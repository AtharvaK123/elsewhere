import { loadTile, loadTileJSON, chunkSnapshot, CHUNK_DIVISIONS } from './openfreemap.js';
import { packElements, elementsByChunk } from './packed.js';
import { buildChunk, tileRoadIndex, regionOf } from './chunk-builder.js';
import { arrayBuffers } from './props.js';
import { project, pointInPolygon } from './geo.js';
import { buildingSurfaces } from './building-surfaces.js';
import { enrichElements, openStructure } from './structures.js';
import { loadNeighbourhood } from './osm-details.js';
import { storefrontIndex } from './street-life.js';
import { natureExclusions } from './nature.js';

// A long-lived map worker. It fetches and decodes zoom-14 tiles, keeps a few in memory, and
// builds the geometry for any ~250 m chunk on request, so the game's render loop only uploads it.
const controllers = new Map(), tiles = new Map(), snapshotTiles = new Map();
const TILE_LIMIT = 18;
let details=[];

function tileEntry(elements, provider, tile) {
  const groups = elementsByChunk(packElements(tile ? enrichElements(elements,details,tile) : elements));
  return { groups, all: [...groups.values()].flat(), provider, indexes: new Map(), baseElements:elements, tile };
}
async function getTile(tile, source, tileJSONUrl, signal) {
  const tileKey = tile.x + '/' + tile.y;
  if (source === 'snapshot') return snapshotTiles.get(tileKey) || (snapshotTiles.set(tileKey, tileEntry([], 'snapshot')), snapshotTiles.get(tileKey));
  const key = (tileJSONUrl || 'default') + ':' + tileKey;
  let entry = tiles.get(key);
  if (entry) { tiles.delete(key); tiles.set(key, entry); }
  else {
    // Adjacent chunks share this request. Canceling one chunk must not cancel its neighbours.
    entry = { promise: loadTile(tile, { tileJSONUrl }).then(elements => Object.assign(entry, tileEntry(elements, 'openfreemap',tile))) };
    tiles.set(key, entry);
    entry.promise.catch(() => tiles.delete(key));
    while (tiles.size > TILE_LIMIT) tiles.delete(tiles.keys().next().value);
  }
  await entry.promise;
  return entry;
}
// Road and building lookups for a tile, in the current world origin's meters.
function indexes(entry, origin) {
  const key = origin.lat + ',' + origin.lon;
  if (!entry.indexes.has(key)) {
    const grid = new Map(), parkingRoofs=[], CELL = 40;
    for (const e of entry.all) {
      if(e.tags.parkingCanopy||e.tags.building==='carport')parkingRoofs.push({pts:e.geometry.map(p=>project(p.lat,p.lon,origin)),holes:(e.holes||[]).map(h=>h.map(p=>project(p.lat,p.lon,origin)))});
      if (!e.tags.building || e.kind !== 1 || openStructure(e.tags)) continue;
      const pts = e.geometry.map(p => project(p.lat, p.lon, origin));
      let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
      for (const [x, z] of pts) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z); }
      const b = { pts, holes: (e.holes || []).map(r => r.map(p => project(p.lat, p.lon, origin))), minX, maxX, minZ, maxZ, low: (parseFloat(e.tags.min_height) || 0) < 2 };
      for (let gx = Math.floor(minX / CELL); gx <= Math.floor(maxX / CELL); gx++) for (let gz = Math.floor(minZ / CELL); gz <= Math.floor(maxZ / CELL); gz++) { const k = gx + ',' + gz; if (!grid.has(k)) grid.set(k, []); grid.get(k).push(b); }
    }
    const collides = (x, z) => (grid.get(Math.floor(x / CELL) + ',' + Math.floor(z / CELL)) || []).some(b => b.low && x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ && pointInPolygon(x, z, b.pts) && !b.holes.some(h => pointInPolygon(x, z, h)));
    const coveredParking=(x,z)=>parkingRoofs.some(r=>pointInPolygon(x,z,r.pts)&&!r.holes.some(h=>pointInPolygon(x,z,h)));
    const roads = tileRoadIndex(entry.all, origin);
    entry.indexes.set(key, { roads, collides, coveredParking, excludesNature:natureExclusions(entry.all,origin), storefronts: storefrontIndex(entry.all, origin, roads), ...buildingSurfaces(entry.all, origin) });
    if (entry.indexes.size > 2) entry.indexes.delete(entry.indexes.keys().next().value);
  }
  return entry.indexes.get(key);
}
function chunkRect(tile, chunk, origin) {
  const size = 4096 * 2 ** tile.z, s = 4096 / CHUNK_DIVISIONS, i = chunk % CHUNK_DIVISIONS, j = Math.floor(chunk / CHUNK_DIVISIONS);
  const geo = (px, py) => [Math.atan(Math.sinh(Math.PI * (1 - 2 * py / size))) * 180 / Math.PI, px / size * 360 - 180];
  const [x0, z0] = project(...geo(tile.x * 4096 + i * s, tile.y * 4096 + j * s), origin), [x1, z1] = project(...geo(tile.x * 4096 + (i + 1) * s, tile.y * 4096 + (j + 1) * s), origin);
  return { minX: Math.min(x0, x1), maxX: Math.max(x0, x1), minZ: Math.min(z0, z1), maxZ: Math.max(z0, z1) };
}

self.onmessage = async ({ data }) => {
  if (data.type === 'cancel') { controllers.get(data.id)?.abort(); return; }
  const controller = new AbortController(); controllers.set(data.id, controller);
  try {
    if(data.type==='details'){
      const details=await loadNeighbourhood(data.lat,data.lon,{url:data.url,signal:controller.signal,footprints:data.footprints!==false});
      self.postMessage({id:data.id,type:'ready',details});
    }else if(data.type==='apply-details'){
      details=[...new Map(data.features.map(f=>[f.osmId,f])).values()];
      for(const entry of tiles.values())if(entry.baseElements)Object.assign(entry,tileEntry(entry.baseElements,entry.provider,entry.tile));
      self.postMessage({id:data.id,type:'ready'});
    }else if (data.type === 'tilejson') {
      await loadTileJSON(data.tileJSONUrl, controller.signal);
      self.postMessage({ id: data.id, type: 'ready' });
    } else if (data.type === 'snapshot') {
      const response = await fetch(data.url, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]) });
      if (!response.ok) throw new Error('The offline snapshot is unavailable.');
      snapshotTiles.clear();
      for (const [key, elements] of chunkSnapshot((await response.json()).elements || [])) snapshotTiles.set(key, tileEntry(elements, 'snapshot'));
      self.postMessage({ id: data.id, type: 'ready', tiles: snapshotTiles.size });
    } else if (data.type === 'tile') {
      await getTile(data.tile, data.source, data.tileJSONUrl, controller.signal);
      self.postMessage({ id: data.id, type: 'ready' });
    } else if (data.type === 'chunk') {
      const { tile, chunk, origin, source, tileJSONUrl, landmarks } = data;
      const entry = await getTile(tile, source, tileJSONUrl, controller.signal);
      controller.signal.throwIfAborted();
      const generator = buildChunk({ elements: entry.groups.get(chunk) || [], ...indexes(entry, origin), origin, rect: chunkRect(tile, chunk, origin), region: regionOf(origin.lat, origin.lon), seed: ((((tile.x * 73856093) ^ (tile.y * 19349663) ^ (chunk * 83492791)) >>> 0) / 4294967296) || .5, landmarks });
      let step; while (!(step = generator.next()).done) controller.signal.throwIfAborted();
      const result = { ...step.value, provider: entry.provider };
      self.postMessage({ id: data.id, type: 'ready', chunk: result }, [...arrayBuffers(result.solid), ...arrayBuffers(result.detail), ...arrayBuffers(result.ground), ...arrayBuffers(result.water),result.grass.buffer]);
    }
  } catch (error) {
    self.postMessage({ id: data.id, type: 'error', name: error.name, message: error.message });
  } finally { controllers.delete(data.id); }
};

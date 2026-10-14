import { VectorTile, classifyRings } from '@mapbox/vector-tile';
import { PbfReader } from 'pbf';
import polygonClipping from 'polygon-clipping';

export const OPENFREEMAP_TILEJSON = 'https://tiles.openfreemap.org/planet';
const metadataCache = new Map();

export function tileCoordinates(lat, lon, zoom = 14) {
  const n = 2 ** zoom;
  const latitude = Math.max(-85.05112878, Math.min(85.05112878, lat)) * Math.PI / 180;
  return { x: (lon + 180) / 360 * n, y: (1 - Math.asinh(Math.tan(latitude)) / Math.PI) / 2 * n, z: zoom };
}

export function tileBounds({ x, y, z }) {
  const n = 2 ** z;
  const latitude = row => Math.atan(Math.sinh(Math.PI * (1 - 2 * row / n))) * 180 / Math.PI;
  return [x / n * 360 - 180, latitude(y + 1), (x + 1) / n * 360 - 180, latitude(y)];
}

function rectangle([west, south, east, north]) {
  return [[[west, south], [east, south], [east, north], [west, north], [west, south]]];
}

export function clipLineToBounds(points, bounds) {
  const [west, south, east, north] = bounds;
  const lines = [];
  let line = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i], dx = b[0] - a[0], dy = b[1] - a[1];
    let enter = 0, leave = 1, visible = true;
    const p = [-dx, dx, -dy, dy], q = [a[0] - west, east - a[0], a[1] - south, north - a[1]];
    for (let edge = 0; edge < 4; edge++) {
      if (p[edge] === 0) { if (q[edge] < 0) visible = false; continue; }
      const t = q[edge] / p[edge];
      if (p[edge] < 0) enter = Math.max(enter, t); else leave = Math.min(leave, t);
    }
    if (!visible || enter > leave) { if (line.length > 1) lines.push(line); line = []; continue; }
    const first = [a[0] + enter * dx, a[1] + enter * dy], last = [a[0] + leave * dx, a[1] + leave * dy];
    if (line.length && Math.hypot(line.at(-1)[0] - first[0], line.at(-1)[1] - first[1]) > 1e-8) { if (line.length > 1) lines.push(line); line = []; }
    if (!line.length) line.push(first);
    line.push(last);
  }
  if (line.length > 1) lines.push(line);
  return lines;
}

// Street furniture and storefront points worth drawing at their real positions.
const POI_CLASSES = new Set(['waste_basket', 'bollard', 'bicycle_parking', 'bus', 'post', 'drinking_water', 'bench', 'entrance', 'shelter', 'recycling', 'art_gallery', 'restaurant', 'cafe', 'fast_food', 'bar', 'ice_cream', 'fuel', 'telephone', 'toilets', 'fountain', 'playground', 'parking', 'information', 'shop', 'pub', 'bakery', 'supermarket', 'convenience', 'grocery', 'clothes', 'shoes', 'books', 'florist', 'hairdresser', 'beauty', 'pharmacy', 'optician', 'bicycle', 'butcher', 'greengrocer', 'deli', 'gift', 'jewelry', 'electronics', 'department_store']);
export const ATTRACTIONS = new Set(['attraction', 'viewpoint', 'museum', 'monument', 'memorial', 'castle', 'historic', 'archaeological_site', 'cinema', 'theatre', 'theater', 'stadium', 'sports_centre', 'zoo', 'theme_park', 'park', 'art_gallery', 'library', 'college', 'university', 'place_of_worship', 'parking']);
const mapName = p => typeof (p.name || p['name:en'] || p.name_en || p.ref) === 'string' ? String(p.name || p['name:en'] || p.name_en || p.ref).slice(0,120) : '';
// Land use / land cover classes become ground areas with their own colors and details.
const AREA_CLASSES = new Set(['grass', 'park', 'garden', 'flowerbed', 'meadow', 'recreation_ground', 'allotments', 'village_green', 'wood', 'forest', 'scrub', 'heath', 'sand', 'beach', 'rock', 'bare_rock', 'scree', 'wetland', 'ice', 'glacier', 'farmland', 'farm', 'orchard', 'vineyard', 'cemetery', 'pitch', 'playground', 'track', 'stadium', 'school', 'kindergarten', 'college', 'university', 'hospital', 'commercial', 'retail', 'industrial', 'railway', 'garages', 'military', 'zoo', 'theme_park', 'parking', 'residential', 'apron', 'runway', 'taxiway', 'dog_park', 'golf_course']);

export function featureTags(layer, properties) {
  if (layer === 'transportation_name') {
    const name=mapName(properties);
    return name && properties.brunnel !== 'tunnel' && properties.class !== 'rail' ? { labelType:'street',name,roadClass:properties.class||'minor' } : null;
  }
  if (layer === 'building') {
    if (properties.hide_3d === true || properties.hide_3d === 1 || properties.hide_3d === 'true') return null;
    const height = Number(properties.render_height), base = Number(properties.render_min_height);
    return { building: 'yes', ...(Number.isFinite(height) && height > 0 ? { height: String(height) } : {}), min_height: String(Number.isFinite(base) && base > 0 ? base : 0), ...(typeof properties.colour === 'string' ? { colour: properties.colour } : {}) };
  }
  if (layer === 'water') return properties.brunnel === 'tunnel' ? null : { natural: 'water', ...(properties.class ? { water: properties.class } : {}) };
  if (layer === 'waterway') return properties.brunnel === 'tunnel' ? null : { waterway: properties.class || 'stream' };
  if (layer === 'transportation') {
    if (properties.brunnel === 'tunnel' || Number(properties.indoor) === 1) return null;
    const extras = {
      ...(properties.brunnel === 'bridge' ? { bridge: 'yes' } : {}),
      ...(Number(properties.oneway) !== 0 && properties.oneway != null ? { oneway: 'yes' } : {}),
      ...(properties.service ? { service: properties.service } : {}),
      ...(properties.surface ? { surface: properties.surface } : {})
    };
    if (properties.class === 'rail' || properties.class === 'transit') return { railway: properties.subclass || 'rail', ...extras };
    if (properties.class === 'pier') return { man_made: 'pier' };
    if (properties.class === 'path') {
      const kind = ({ cycleway: 'cycleway', steps: 'steps', pedestrian: 'pedestrian', platform: 'platform', bridleway: 'path', path: 'path' })[properties.subclass] || 'footway';
      return { highway: kind, ...extras };
    }
    const highway = ({ motorway: 'motorway', trunk: 'trunk', primary: 'primary', secondary: 'secondary', tertiary: 'tertiary', minor: 'residential', service: 'service', track: 'track', raceway: 'service', busway: 'service' })[properties.class];
    return highway ? { highway, ...extras } : null;
  }
  if (layer === 'landcover' || layer === 'landuse' || layer === 'aeroway') {
    const kind = AREA_CLASSES.has(properties.subclass) ? properties.subclass : properties.class;
    return AREA_CLASSES.has(kind) ? { area: kind } : null;
  }
  if (layer === 'poi') {
    const poi=properties.class,subclass=properties.subclass,name=mapName(properties);
    if (!POI_CLASSES.has(poi) && !(name && (ATTRACTIONS.has(poi) || ATTRACTIONS.has(subclass)))) return null;
    return {poi,...(subclass?{subclass}:{}),...(name?{name}:{}),...(properties.level!=null?{level:String(properties.level)}:{}),...(name&&(ATTRACTIONS.has(poi)||ATTRACTIONS.has(subclass))?{labelType:'attraction',rank:Number(properties.rank)||20}: {})};
  }
  return null;
}

function numericId(value) {
  let hash = 2166136261;
  for (const char of value) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}

export const CHUNK_DIVISIONS = 8;
const TILE_LAYERS = ['water', 'waterway', 'landcover', 'landuse', 'aeroway', 'transportation', 'transportation_name', 'building', 'poi'];

function cellBounds(tile, i, j, extent) {
  const size = extent / CHUNK_DIVISIONS, x0 = tile.x * extent + i * size, y0 = tile.y * extent + j * size;
  return [x0, y0, x0 + size, y0 + size];
}
function boundsOf(rings) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const ring of rings) for (const [x, y] of ring) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
  return [minX, minY, maxX, maxY];
}

// Decodes one tile and splits every feature into an 8x8 grid of chunks (chunk = i + j * 8),
// so the game can load and drop ~250 m pieces of the world independently.
// Buildings stay whole and belong to the chunk holding their center; lines and areas are cut at chunk edges.
export function decodeTile(bytes, tile) {
  const data = new VectorTile(new PbfReader(bytes)), extent = 4096, size = extent * 2 ** tile.z;
  const tileRect = [tile.x * extent, tile.y * extent, (tile.x + 1) * extent, (tile.y + 1) * extent];
  const toGeo = ring => ring.map(([x, y]) => ({ lon: x / size * 360 - 180, lat: Math.atan(Math.sinh(Math.PI * (1 - 2 * y / size))) * 180 / Math.PI }));
  const cellOf = (x, y) => {
    const s = extent / CHUNK_DIVISIONS;
    return Math.min(CHUNK_DIVISIONS - 1, Math.max(0, Math.floor((x - tileRect[0]) / s))) + Math.min(CHUNK_DIVISIONS - 1, Math.max(0, Math.floor((y - tileRect[1]) / s))) * CHUNK_DIVISIONS;
  };
  const cellsIn = ([minX, minY, maxX, maxY]) => {
    const s = extent / CHUNK_DIVISIONS, cells = [];
    const i0 = Math.max(0, Math.floor((minX - tileRect[0]) / s)), i1 = Math.min(CHUNK_DIVISIONS - 1, Math.floor((maxX - tileRect[0]) / s));
    const j0 = Math.max(0, Math.floor((minY - tileRect[1]) / s)), j1 = Math.min(CHUNK_DIVISIONS - 1, Math.floor((maxY - tileRect[1]) / s));
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) cells.push([i, j]);
    return cells;
  };
  const elements = [], groups = new Map();
  for (const name of TILE_LAYERS) {
    const layer = data.layers[name]; if (!layer) continue;
    for (let n = 0; n < layer.length; n++) {
      const feature = layer.feature(n), tags = featureTags(name, feature.properties); if (!tags) continue;
      const scale = extent / feature.extent, points = ring => ring.map(p => [tile.x * extent + p.x * scale, tile.y * extent + p.y * scale]);
      const raw = feature.loadGeometry(), id = numericId(name + ':' + (feature.id ?? n) + ':' + JSON.stringify(tags));
      if (feature.type === 1) {
        for (const ring of raw) for (const p of points(ring)) if (p[0] >= tileRect[0] && p[0] < tileRect[2] && p[1] >= tileRect[1] && p[1] < tileRect[3]) elements.push({ id, tags, kind: 2, chunk: cellOf(p[0], p[1]), geometry: toGeo([p]) });
      } else if (feature.type === 2) {
        for (const line of raw) for (const clipped of clipLineToBounds(points(line), tileRect)) {
          for (const [i, j] of cellsIn(boundsOf([clipped]))) for (const piece of clipLineToBounds(clipped, cellBounds(tile, i, j, extent))) elements.push({ id, tags, kind: 0, chunk: i + j * CHUNK_DIVISIONS, geometry: toGeo(piece) });
        }
      } else if (feature.type === 3) {
        const clipped = polygonClipping.intersection(classifyRings(raw).map(polygon => polygon.map(points)), rectangle(tileRect));
        if (!clipped.length) continue;
        const key = name + ':' + (feature.id ?? 'n' + n) + ':' + JSON.stringify(tags);
        if (!groups.has(key)) groups.set(key, { id, tags, polygons: [] });
        groups.get(key).polygons.push(...clipped);
      }
    }
  }
  for (const { id, tags, polygons: parts } of groups.values()) {
    const polygons = parts.length > 1 ? polygonClipping.union(...parts) : parts;
    for (const polygon of polygons) {
      const bounds = boundsOf(polygon), cells = cellsIn(bounds);
      if (tags.building || cells.length === 1) {
        const [outer, ...holes] = polygon;
        elements.push({ id, tags, kind: 1, chunk: cellOf((bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2), geometry: toGeo(outer), holes: holes.map(toGeo) });
        continue;
      }
      for (const [i, j] of cells) for (const [outer, ...holes] of polygonClipping.intersection([polygon], rectangle(cellBounds(tile, i, j, extent)))) {
        elements.push({ id, tags, kind: 1, chunk: i + j * CHUNK_DIVISIONS, geometry: toGeo(outer), holes: holes.map(toGeo) });
      }
    }
  }
  return elements;
}

export async function loadTileJSON(tileJSONUrl, signal) {
  let metadata = metadataCache.get(tileJSONUrl);
  if (!metadata || Date.now() - metadata.loadedAt > 15 * 60 * 1000) {
    const data = await (await responseFor(tileJSONUrl, signal)).json();
    if (!Array.isArray(data.tiles) || !data.tiles[0] || data.maxzoom < 13) throw new Error('This map source does not provide the detailed vector tiles needed for the 3D world.');
    metadata = { data, loadedAt: Date.now() }; metadataCache.set(tileJSONUrl, metadata);
  }
  return metadata.data;
}

// Loads and decodes a single zoom-14 tile into chunked features.
export async function loadTile(tile, { signal, tileJSONUrl = OPENFREEMAP_TILEJSON } = {}) {
  const requestSignal = AbortSignal.any([...(signal ? [signal] : []), AbortSignal.timeout(30000)]);
  const metadata = await loadTileJSON(tileJSONUrl, requestSignal);
  const template = new URL(metadata.tiles[0], tileJSONUrl).href;
  const url = template.replace(/\{z\}|%7Bz%7D/gi, String(tile.z)).replace(/\{x\}|%7Bx%7D/gi, String(tile.x)).replace(/\{y\}|%7By%7D/gi, String(metadata.scheme === 'tms' ? 2 ** tile.z - 1 - tile.y : tile.y));
  const bytes = new Uint8Array(await (await responseFor(url, requestSignal)).arrayBuffer());
  requestSignal.throwIfAborted();
  return decodeTile(bytes, tile);
}

// Normalizes OSM-style snapshot features (Overpass JSON) to the tile feature tags.
export function snapshotTags(tags = {}) {
  if (tags.building||tags['building:part']) return { ...tags,building:tags.building||tags['building:part'], ...(tags['building:colour']?{colour:tags['building:colour']}:{}), min_height:tags.min_height||(parseFloat(tags['building:min_level'])*3.4||0).toString() };
  if (tags.highway) { const t = featureTags('transportation', { class: ({ residential: 'minor', unclassified: 'minor', living_street: 'minor', footway: 'path', path: 'path', pedestrian: 'path', cycleway: 'path', steps: 'path' })[tags.highway] || tags.highway, subclass: tags.highway, ...(tags.bridge === 'yes' ? { brunnel: 'bridge' } : {}) }); return t; }
  if (tags.natural === 'water' || tags.waterway === 'riverbank') return { natural: 'water' };
  if (tags.leisure === 'park') return { area: 'park' };
  if (tags.landuse === 'grass') return { area: 'grass' };
  return null;
}

// Splits snapshot features into the same tile/chunk structure live tiles use.
export function chunkSnapshot(elements, zoom = 14) {
  const tiles = new Map(), extent = 4096, size = extent * 2 ** zoom;
  const toPixel = ({ lat, lon }) => [(lon + 180) / 360 * size, (1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * size];
  const toGeo = ring => ring.map(([x, y]) => ({ lon: x / size * 360 - 180, lat: Math.atan(Math.sinh(Math.PI * (1 - 2 * y / size))) * 180 / Math.PI }));
  const tileList = key => { if (!tiles.has(key)) tiles.set(key, []); return tiles.get(key); };
  for (const element of elements) {
    const tags = snapshotTags(element.tags); if (!tags || !element.geometry?.length) continue;
    const outer = element.geometry.map(toPixel), holes = (element.holes || []).map(ring => ring.map(toPixel));
    const closed = outer.length > 3 && outer[0][0] === outer.at(-1)[0] && outer[0][1] === outer.at(-1)[1];
    const [minX, minY, maxX, maxY] = boundsOf([outer]);
    if (tags.building) {
      const x = (minX + maxX) / 2, y = (minY + maxY) / 2, tx = Math.floor(x / extent), ty = Math.floor(y / extent);
      const chunk = Math.min(7, Math.floor((x / extent - tx) * CHUNK_DIVISIONS)) + Math.min(7, Math.floor((y / extent - ty) * CHUNK_DIVISIONS)) * CHUNK_DIVISIONS;
      tileList(tx + '/' + ty).push({ id: element.id || 0, tags, kind: 1, chunk, geometry: element.geometry, holes: element.holes || [] });
      continue;
    }
    for (let tx = Math.floor(minX / extent); tx <= Math.floor(maxX / extent); tx++) for (let ty = Math.floor(minY / extent); ty <= Math.floor(maxY / extent); ty++) {
      const tile = { x: tx, y: ty, z: zoom };
      for (let j = 0; j < CHUNK_DIVISIONS; j++) for (let i = 0; i < CHUNK_DIVISIONS; i++) {
        const cell = cellBounds(tile, i, j, extent);
        if (maxX < cell[0] || minX > cell[2] || maxY < cell[1] || minY > cell[3]) continue;
        const chunk = i + j * CHUNK_DIVISIONS;
        if (closed && !tags.highway) for (const [ring, ...inner] of polygonClipping.intersection([[outer, ...holes]], rectangle(cell))) tileList(tx + '/' + ty).push({ id: element.id || 0, tags, kind: 1, chunk, geometry: toGeo(ring), holes: inner.map(toGeo) });
        else for (const piece of clipLineToBounds(outer, cell)) tileList(tx + '/' + ty).push({ id: element.id || 0, tags, kind: 0, chunk, geometry: toGeo(piece) });
      }
    }
  }
  return tiles;
}

async function responseFor(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error('OpenFreeMap is unavailable right now. Please try again shortly.');
  return response;
}

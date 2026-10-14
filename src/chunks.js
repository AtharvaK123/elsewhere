import * as THREE from 'three';
import { project, unproject } from './geo.js';
import { geometryFromArrays } from './props.js';
import { makeShopSigns } from './shop-signs.js';
import { measureRoute } from './street-life.js';
import { makeGrass } from './nature.js';

// The world is cut into chunks: each zoom-14 map tile split 8 x 8 (about 150-300 m a side,
// depending on latitude). Only chunks within the render distance exist; workers build them.
export const DIVISIONS = 8, ZOOM = 14, GRID = 2 ** ZOOM * DIVISIONS;
export const DEFAULT_RENDER_DISTANCE = 1200;
const EARTH = 40075016.686, MAX_IN_FLIGHT = 6;

export function chunkCoordinates(lat, lon) {
  const latitude = Math.max(-85.05, Math.min(85.05, lat)) * Math.PI / 180;
  return { gx: (lon + 180) / 360 * GRID, gy: (1 - Math.asinh(Math.tan(latitude)) / Math.PI) / 2 * GRID };
}
export function chunkCenter(gx, gy) {
  return { lon: (gx + .5) / GRID * 360 - 180, lat: Math.atan(Math.sinh(Math.PI * (1 - 2 * (gy + .5) / GRID))) * 180 / Math.PI };
}
export function chunkMeters(lat) { return EARTH * Math.cos(lat * Math.PI / 180) / GRID; }
export function chunkBounds(gx, gy, origin) {
  const latitude = y => Math.atan(Math.sinh(Math.PI * (1 - 2 * y / GRID))) * 180 / Math.PI;
  const center = chunkCenter(gx, gy), [cx] = project(center.lat, center.lon, origin);
  const half = 360 / GRID * 111320 * Math.cos(origin.lat * Math.PI / 180) / 2;
  const [, z0] = project(latitude(gy), center.lon, origin), [, z1] = project(latitude(gy + 1), center.lon, origin);
  return { minX: cx - half, maxX: cx + half, minZ: Math.min(z0, z1), maxZ: Math.max(z0, z1) };
}
export function distanceToBounds(x, z, bounds) {
  return Math.hypot(Math.max(bounds.minX - x, 0, x - bounds.maxX), Math.max(bounds.minZ - z, 0, z - bounds.maxZ));
}
// Chunks whose area comes within `radius` meters of (x, z), nearest first.
export function chunksAround(origin, x, z, radius) {
  const here = unproject(x, z, origin), { gx, gy } = chunkCoordinates(here.lat, here.lon), size = chunkMeters(here.lat);
  // Chunks shrink toward the poles; cap the reach so far-north views stay a few hundred chunks.
  radius = Math.min(radius, size * 9);
  const reach = Math.ceil(radius / size) + 1, list = [];
  for (let dy = -reach; dy <= reach; dy++) for (let dx = -reach; dx <= reach; dx++) {
    const cx = Math.floor(gx) + dx, cy = Math.floor(gy) + dy; if (cy < 0 || cy >= GRID) continue;
    const wx = ((cx % GRID) + GRID) % GRID, center = chunkCenter(wx, cy), [px, pz] = project(center.lat, center.lon, origin);
    const bounds = chunkBounds(wx, cy, origin), distance = distanceToBounds(x, z, bounds);
    if (distance > radius) continue;
    list.push({ key: wx + ':' + cy, tile: { x: Math.floor(wx / DIVISIONS), y: Math.floor(cy / DIVISIONS), z: ZOOM }, index: (wx % DIVISIONS) + (cy % DIVISIONS) * DIVISIONS, center: [px, pz], bounds, distance });
  }
  return list.sort((a, b) => a.distance - b.distance);
}

export class ChunkManager {
  constructor({ client, root, materials, addColliders, removeColliders }) {
    Object.assign(this, { client, root, materials, addColliders, removeColliders });
    this.chunks = new Map(); this.generation = 0; this.renderDistance = DEFAULT_RENDER_DISTANCE; this.source = 'live'; this.provider = 'openfreemap';
    this.buildingCount = 0; this.failures = 0;
  }
  reset(origin, { source = 'live', tileJSONUrl, landmarks = [] } = {}) {
    this.generation++;
    for (const chunk of this.chunks.values()) this.dispose(chunk);
    this.chunks.clear(); Object.assign(this, { origin, source, tileJSONUrl, landmarks, buildingCount: 0, provider: source === 'snapshot' ? 'snapshot' : 'openfreemap' });
  }
  get loading() { let n = 0; for (const c of this.chunks.values()) if (c.state === 'loading'||c.refreshing) n++; return n; }
  get loaded() { let n = 0; for (const c of this.chunks.values()) if (c.state === 'ready') n++; return n; }
  get carRoads() { const roads = []; for (const c of this.chunks.values()) if (c.state === 'ready') roads.push(...c.carRoads); return roads; }
  request(entry, { signal, origin = this.origin, source = this.source, tileJSONUrl = this.tileJSONUrl, landmarks = this.landmarks } = {}) {
    return this.client.chunk({ tile: entry.tile, chunk: entry.index, origin: { lat: origin.lat, lon: origin.lon }, source, tileJSONUrl, landmarks }, { signal });
  }
  // Called a few times per second with the player's position and velocity (m/s).
  update(x, z, vx = 0, vz = 0) {
    if (!this.origin) return;
    const wanted = new Map();
    const size = chunkMeters(unproject(x, z, this.origin).lat);
    // A border of resident chunks covers buildings that extend beyond their owner cell.
    for (const entry of chunksAround(this.origin, x, z, this.renderDistance + size)) wanted.set(entry.key, entry);
    // Look ahead along the direction of travel so fast flight never outruns the world.
    const speed = Math.hypot(vx, vz);
    if (speed > .1) {
      const ahead = Math.min(this.renderDistance, Math.max(size, speed * 6));
      for (const entry of chunksAround(this.origin, x + vx / speed * ahead, z + vz / speed * ahead, this.renderDistance * .6)) {
        if (!wanted.has(entry.key)) wanted.set(entry.key, { ...entry, distance: entry.distance + ahead * .5 });
      }
    }
    for (const [key, chunk] of this.chunks) {
      if(chunk.grass)chunk.grass.visible=distanceToBounds(x,z,chunk.bounds)<70;
      const far = distanceToBounds(x, z, chunk.bounds) > this.renderDistance + size * 2;
      if (far && !wanted.has(key)) { this.dispose(chunk); this.chunks.delete(key); }
    }
    let inFlight = this.loading;
    for (const entry of [...wanted.values()].sort((a, b) => a.distance - b.distance)) {
      if (inFlight >= MAX_IN_FLIGHT) break;
      const existing = this.chunks.get(entry.key);
      if(existing?.state==='ready'&&existing.dirty&&!existing.refreshing&&performance.now()>(existing.retryAt||0)){this.refresh(existing);inFlight++;continue;}
      if (existing && !(existing.state === 'failed' && performance.now() > existing.retryAt)) continue;
      this.load(entry); inFlight++;
    }
  }
  load(entry) {
    const generation = this.generation, controller = new AbortController();
    const chunk = { ...entry, state: 'loading', controller };
    this.chunks.set(entry.key, chunk);
    this.request(entry, { signal: controller.signal }).then(data => {
      if (generation !== this.generation || this.chunks.get(entry.key) !== chunk) return;
      this.adopt(chunk, data);
    }).catch(error => {
      if (generation !== this.generation || this.chunks.get(entry.key) !== chunk) return;
      chunk.state = 'failed'; chunk.retryAt = performance.now() + 8000; this.failures++; this.onError?.(error);
    });
  }
  refreshBounds(bounds) {
    for(const chunk of this.chunks.values()){
      const p=unproject(chunk.center[0],chunk.center[1],this.origin),pad=chunkMeters(p.lat)*1.5;
      if(p.lat>=bounds.south-pad/110540&&p.lat<=bounds.north+pad/110540&&p.lon>=bounds.west-pad/(111320*Math.cos(p.lat*Math.PI/180))&&p.lon<=bounds.east+pad/(111320*Math.cos(p.lat*Math.PI/180)))chunk.dirty=true;
    }
  }
  refresh(chunk){
    const generation=this.generation,controller=new AbortController();chunk.refreshing=true;chunk.controller=controller;chunk.dirty=false;
    this.request(chunk,{signal:controller.signal}).then(data=>{
      if(generation!==this.generation||this.chunks.get(chunk.key)!==chunk)return;
      const dirty=chunk.dirty;this.dispose(chunk);this.adopt(chunk,data);chunk.dirty=dirty;
    }).catch(error=>{if(generation===this.generation&&this.chunks.get(chunk.key)===chunk){chunk.dirty=true;chunk.retryAt=performance.now()+15000;this.onError?.(error);}}).finally(()=>{chunk.refreshing=false;});
  }
  // Turns worker output into meshes and collision shapes.
  adopt(chunk, data) {
    const group = new THREE.Group(); group.name = 'chunk ' + chunk.key;
    const add = (arrays, material, { cast = false, receive = true } = {}) => { const geometry = geometryFromArrays(arrays); if (!geometry) return null; const mesh = new THREE.Mesh(geometry, material); mesh.castShadow = cast; mesh.receiveShadow = receive; group.add(mesh); return mesh; };
    add(data.ground, this.materials.ground || this.materials.solid);
    add(data.solid, this.materials.solid, { cast: true });
    chunk.detail = add(data.detail, this.materials.solid, { cast: true });
    add(data.water, this.materials.water);
    chunk.grass=makeGrass(data.grass,this.materials);if(chunk.grass)group.add(chunk.grass);chunk.nature=data.nature||{};
    chunk.shopSigns = makeShopSigns(data.shopSigns); if (chunk.shopSigns) group.add(chunk.shopSigns);
    if (data.glow.length) {
      const pools = new THREE.InstancedMesh(this.materials.poolGeometry, this.materials.pool, data.glow.length), m = new THREE.Matrix4();
      data.glow.forEach(([x, z], i) => pools.setMatrixAt(i, m.makeTranslation(x, .16, z)));
      pools.computeBoundingSphere(); pools.renderOrder = 9; group.add(pools); chunk.pools = pools;
    }
    Object.assign(chunk, { state: 'ready', group, colliders: data.colliders, carRoads: data.carRoads, pedestrianRoutes: data.pedestrianRoutes || [], storefronts: data.shopSigns || [], mapLabels:data.mapLabels||[], structures:data.structures||{}, buildingCount: data.buildingCount, urban: data.urban, controller: null });
    // Retention uses the actual geometry extent too, including large buildings and bridges.
    const actual = new THREE.Box3().setFromObject(group);
    if (!actual.isEmpty()) chunk.bounds = { minX: Math.min(chunk.bounds.minX, actual.min.x), maxX: Math.max(chunk.bounds.maxX, actual.max.x), minZ: Math.min(chunk.bounds.minZ, actual.min.z), maxZ: Math.max(chunk.bounds.maxZ, actual.max.z) };
    this.provider = data.provider; this.buildingCount += data.buildingCount;
    this.root.add(group); this.addColliders(data.colliders);
    this.onChunk?.(chunk);
  }
  dispose(chunk) {
    chunk.controller?.abort();
    if (chunk.state !== 'ready') return;
    this.root.remove(chunk.group); chunk.group.traverse(o => { if (o.isMesh && o.geometry !== this.materials.poolGeometry && o.geometry!==this.materials.grassGeometry) o.geometry.dispose(); });
    chunk.pools?.dispose();
    chunk.grass?.dispose();
    chunk.shopSigns?.material.map.dispose(); chunk.shopSigns?.material.dispose();
    this.removeColliders(chunk.colliders); this.buildingCount -= chunk.buildingCount;
  }
  // Fetches every chunk within `radius` of a point for a new origin without touching the current world.
  // Resolves with results to hand to `install`; rejects (world unchanged) if the map is unavailable.
  // Chunks inside `required` always load; farther ones load nearest first until `deadline`
  // (a performance.now() time), and anything left streams in after arrival.
  async preload(origin, x, z, radius, { signal, source = 'live', tileJSONUrl, landmarks = [], onProgress, required = radius, deadline = Infinity } = {}) {
    const entries = chunksAround(origin, x, z, radius);
      if (source === 'live') await this.client.tileJSON(tileJSONUrl, { signal });
      let done = 0;
      const results = [], queue = [...entries];
      const run = async () => { while (queue.length) { signal?.throwIfAborted(); if (queue[0].distance > required && performance.now() > deadline) { queue.length = 0; break; } const entry = queue.shift(); results.push([entry, await this.request(entry, { signal, origin, source, tileJSONUrl, landmarks })]); onProgress?.(++done, entries.length); } };
      await Promise.all(Array.from({ length: Math.min(MAX_IN_FLIGHT, entries.length) }, run));
      return results;
  }
  // Downloads and decodes the map tiles under an area, so building its chunks only waits on geometry.
  async prefetchTiles(origin, x, z, radius, { signal, tileJSONUrl } = {}) {
    await this.client.tileJSON(tileJSONUrl, { signal });
    const tiles = new Map(); for (const entry of chunksAround(origin, x, z, radius)) tiles.set(entry.tile.x + '/' + entry.tile.y, entry.tile);
    await Promise.all([...tiles.values()].map(tile => this.client.tile(tile, 'live', tileJSONUrl, { signal })));
  }
  // Keep resident meshes through an origin change. Only unfinished work uses obsolete coordinates.
  rebase(origin, dx, dz, landmarks = [], scaleX = 1) {
    this.generation++;
    this.origin = origin; this.landmarks = landmarks;
    for (const [key, chunk] of this.chunks) {
      if (chunk.state !== 'ready') { chunk.controller?.abort(); this.chunks.delete(key); continue; }
      this.removeColliders(chunk.colliders);
      if(chunk.refreshing)chunk.dirty=true;chunk.controller?.abort();chunk.refreshing=false;
      chunk.group.position.x = chunk.group.position.x * scaleX + dx; chunk.group.position.z += dz; chunk.group.scale.x *= scaleX;
      chunk.center[0] = chunk.center[0] * scaleX + dx; chunk.center[1] += dz;
      chunk.bounds.minX = chunk.bounds.minX * scaleX + dx; chunk.bounds.maxX = chunk.bounds.maxX * scaleX + dx; chunk.bounds.minZ += dz; chunk.bounds.maxZ += dz;
      for (const c of chunk.colliders) {
        c.minX = c.minX * scaleX + dx; c.maxX = c.maxX * scaleX + dx; c.minZ += dz; c.maxZ += dz;
        for (const ring of [c.pts, ...(c.holes || [])]) for (const p of ring) { p[0] = p[0] * scaleX + dx; p[1] += dz; }
      }
      for (const road of chunk.carRoads) {
        road.length = 0; road.cumulative = [0];
        for (let i = 0; i < road.pts.length; i++) { const p = road.pts[i]; p[0] = p[0] * scaleX + dx; p[1] += dz; if (i) { road.length += Math.hypot(p[0] - road.pts[i - 1][0], p[1] - road.pts[i - 1][1]); road.cumulative.push(road.length); } }
      }
      for(const label of chunk.mapLabels||[])for(const p of label.points){p[0]=p[0]*scaleX+dx;p[1]+=dz;}
      for(const route of chunk.pedestrianRoutes||[]){for(const p of route.pts){p[0]=p[0]*scaleX+dx;p[1]+=dz;}measureRoute(route);}
      for(const shop of chunk.storefronts||[]){shop.x=shop.x*scaleX+dx;shop.z+=dz;}
      this.addColliders(chunk.colliders);
    }
  }
  install(origin, results, options) {
    this.reset(origin, options);
    for (const [entry, data] of results) { const chunk = { ...entry, state: 'loading' }; this.chunks.set(entry.key, chunk); this.adopt(chunk, data); }
  }
}

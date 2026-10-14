import test from 'node:test';
import assert from 'node:assert/strict';
import { tileCoordinates, tileBounds, clipLineToBounds, featureTags, loadTile, chunkSnapshot } from '../src/openfreemap.js';
import { project, unproject } from '../src/geo.js';
import { World } from '../src/world.js';
import { chunksAround, chunkMeters } from '../src/chunks.js';
import { tileRoadIndex, regionOf } from '../src/chunk-builder.js';

test('tile bounds contain the destination in both hemispheres', () => {
  for (const [lat, lon] of [[40.7112, -74.0085], [-33.86, 151.2], [0, 0], [84.9, 179.999]]) {
    const coordinate = tileCoordinates(lat, lon);
    const [west, south, east, north] = tileBounds({ ...coordinate, x: Math.floor(coordinate.x), y: Math.floor(coordinate.y) });
    assert.ok(lon >= west && lon <= east && lat >= south && lat <= north);
  }
});

test('only chunks within the render distance are loaded, nearest first, including near the poles and the antimeridian', () => {
  for (const [lat, lon] of [[40.7, -74], [-80, 179.999], [0, -179.999], [84, 10]]) {
    const origin = { lat, lon }, radius = 700, list = chunksAround(origin, 0, 0, radius);
    assert.ok(list.length > 0 && list.length < 400);
    assert.ok(list.every(c => c.distance <= radius && c.tile.x >= 0 && c.tile.x < 2 ** 14 && c.index >= 0 && c.index < 64));
    assert.ok(list.every((c, i) => !i || list[i - 1].distance <= c.distance), 'sorted nearest first');
    assert.equal(new Set(list.map(c => c.key)).size, list.length);
  }
  assert.ok(chunksAround({ lat: 40.7, lon: -74 }, 0, 0, 1400).length > chunksAround({ lat: 40.7, lon: -74 }, 0, 0, 700).length * 2.5, 'a larger view distance loads more');
  assert.ok(Math.abs(chunkMeters(0) - 305.7) < 1, 'chunks are about 300 m at the equator');
});

test('nearby buildings across the antimeridian remain nearby in the 3D scene', () => {
  const origin = { lat: 0, lon: 179.999 };
  const [x, z] = project(0, -179.999, origin);
  assert.ok(x > 200 && x < 250);
  assert.ok(Math.abs(unproject(x, z, origin).lon + 179.999) < 1e-8);
});

test('tile-edge roads are clipped instead of joining unrelated outside segments', () => {
  const bounds = [0, 0, 10, 10];
  assert.deepEqual(clipLineToBounds([[-5, 5], [15, 5]], bounds), [[[0, 5], [10, 5]]]);
  assert.deepEqual(clipLineToBounds([[-5, 15], [15, 15]], bounds), []);
  const clipped = clipLineToBounds([[5, 5], [15, 5], [15, 8], [5, 8]], bounds);
  assert.equal(clipped.length, 2);
});

test('OpenMapTiles heights, colours, suspended bases, and street details are preserved', () => {
  assert.deepEqual(featureTags('building', { render_height: 125, render_min_height: 18 }), { building: 'yes', height: '125', min_height: '18' });
  assert.equal(featureTags('building', { render_height: 9, colour: '#cdaa7d' }).colour, '#cdaa7d');
  assert.equal(featureTags('building', { hide_3d: true }), null);
  assert.equal(featureTags('transportation', { class: 'primary', brunnel: 'tunnel' }), null);
  assert.deepEqual(featureTags('transportation', { class: 'primary', brunnel: 'bridge' }), { highway: 'primary', bridge: 'yes' });
  assert.deepEqual(featureTags('transportation', { class: 'service', service: 'parking_aisle' }), { highway: 'service', service: 'parking_aisle' });
  assert.deepEqual(featureTags('transportation', { class: 'rail', subclass: 'rail' }), { railway: 'rail' });
  assert.deepEqual(featureTags('landcover', { class: 'grass', subclass: 'flowerbed' }), { area: 'flowerbed' });
  assert.deepEqual(featureTags('water', { class: 'swimming_pool' }), { natural: 'water', water: 'swimming_pool' });
  assert.deepEqual(featureTags('poi', { class: 'waste_basket', subclass: 'waste_basket' }), { poi: 'waste_basket', subclass: 'waste_basket' });
  assert.equal(featureTags('poi', { class: 'office' }), null);
});

test('courtyards remain walkable while surrounding building walls block movement', () => {
  const wall = { minX: 0, maxX: 20, minZ: 0, maxZ: 20, pts: [[0, 0], [20, 0], [20, 20], [0, 20]], holes: [[[5, 5], [15, 5], [15, 15], [5, 15]]] };
  const state = { collisionGrid: new Map([['0,0', [wall]]]) };
  assert.equal(World.prototype.collides.call(state, 2, 2), true);
  assert.equal(World.prototype.collides.call(state, 10, 10), false);
});

test('a failed tile request rejects instead of returning an incomplete world', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async url => url.endsWith('/metadata')
    ? new Response(JSON.stringify({ maxzoom: 14, tiles: ['https://tiles.test/{z}/{x}/{y}.pbf'] }))
    : new Response('Unavailable', { status: 503 });
  try { await assert.rejects(loadTile({ x: 1, y: 1, z: 14 }, { tileJSONUrl: 'https://failure.test/metadata' }), /OpenFreeMap is unavailable/); }
  finally { globalThis.fetch = original; }
});

test('canceling propagates abort through map requests', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (_, { signal }) => { signal.throwIfAborted(); };
  const controller = new AbortController(); controller.abort();
  try { await assert.rejects(loadTile({ x: 1, y: 1, z: 14 }, { tileJSONUrl: 'https://cancel.test/metadata', signal: controller.signal }), error => error.name === 'AbortError'); }
  finally { globalThis.fetch = original; }
});

test('bundled snapshots are split into the same tiles and chunks as live data', () => {
  const ring = [[40.7112, -74.0085], [40.7112, -74.0080], [40.7116, -74.0080], [40.7116, -74.0085], [40.7112, -74.0085]].map(([lat, lon]) => ({ lat, lon }));
  const tiles = chunkSnapshot([{ id: 1, tags: { building: 'yes', height: '30' }, geometry: ring }, { id: 2, tags: { highway: 'residential' }, geometry: [{ lat: 40.70, lon: -74.02 }, { lat: 40.72, lon: -74.00 }] }]);
  const all = [...tiles.values()].flat();
  assert.equal(all.filter(e => e.tags.building).length, 1, 'buildings stay whole');
  assert.ok(all.filter(e => e.tags.highway).length > 3, 'long roads are cut at chunk edges');
  assert.ok(all.every(e => e.chunk >= 0 && e.chunk < 64));
});

test('intersections are found where three or more street arms meet', () => {
  const origin = { lat: 0, lon: 0 }, at = (x, z) => { const g = unproject(x, z, origin); return { lat: g.lat, lon: g.lon }; };
  const road = (id, a, b) => ({ id, kind: 0, tags: { highway: 'residential' }, geometry: [at(...a), at(...b)] });
  const index = tileRoadIndex([road(1, [-50, 0], [0, 0]), road(1, [0, 0], [50, 0]), road(2, [0, 0], [0, 50])], origin);
  assert.equal(index.intersections.length, 1);
  assert.ok(index.onRoad(10, 1) && !index.onRoad(10, 12));
  assert.equal(tileRoadIndex([road(1, [-50, 0], [0, 0]), road(1, [0, 0], [50, 0])], origin).intersections.length, 0, 'a road split in two is not a crossing');
});

test('regional street details follow local conventions', () => {
  assert.equal(regionOf(51.5, -0.12).leftDrive, true);
  assert.equal(regionOf(40.7, -74).post, 'us');
  assert.equal(regionOf(48.86, 2.29).post, 'eu');
  assert.equal(regionOf(35.66, 139.7).leftDrive, true);
});

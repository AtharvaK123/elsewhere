import test from 'node:test';
import assert from 'node:assert/strict';
import { unproject, pointInPolygon } from '../src/geo.js';
import { buildChunk, tileRoadIndex, regionOf } from '../src/chunk-builder.js';
import { SURFACE } from '../src/nature.js';

const origin = { lat: 40.5495, lon: -74.3318 }, rect = { minX: -100, maxX: 100, minZ: -100, maxZ: 100 };
const at = points => points.map(([x, z]) => unproject(x, z, origin));
const build = (elements, extra = {}) => {
  const generator = buildChunk({ elements, roads: tileRoadIndex(elements, origin), origin, rect, region: regionOf(origin.lat, origin.lon), seed: .5, ...extra });
  let next; while (!(next = generator.next()).done) {} return next.value;
};
// A suburban block: one street, an apartment row, and a mapped parking lot; nothing else is mapped.
const street = { id: 1, kind: 0, tags: { highway: 'residential' }, geometry: at([[-100, 0], [100, 0]]) };
const apartment = [[-30, 20], [30, 20], [30, 32], [-30, 32]];
const parking = [[40, -60], [90, -60], [90, -20], [40, -20]];
const elements = [street, { id: 2, kind: 1, tags: { building: 'apartments', height: '7', fillIn: 'yes' }, geometry: at(apartment), holes: [] }, { id: 3, kind: 1, tags: { area: 'parking' }, geometry: at(parking), holes: [] }];

test('unmapped suburban ground becomes textured lawn with tufts, yard trees, and foundation shrubs', () => {
  const result = build(elements), g = result.grass;
  assert.equal(result.urban, false);
  assert.ok(result.nature.grassTufts > 400, 'open ground is planted: ' + result.nature.grassTufts);
  assert.ok(result.nature.yardTrees > 0 && result.nature.shrubs > 0, JSON.stringify(result.nature));
  // The base ground carries the grass surface style.
  const styles = new Set(); for (let i = 0; i < result.ground.info.length; i += 2) styles.add(result.ground.info[i]);
  assert.ok(styles.has(SURFACE.GRASS));
  for (let i = 0; i < g.length; i += 6) {
    const x = g[i], z = g[i + 2];
    assert.ok(Math.abs(z) > 4, 'no grass on the carriageway or curb');
    assert.ok(!pointInPolygon(x, z, apartment), 'no grass inside the building');
    assert.ok(!pointInPolygon(x, z, parking), 'no grass on the parking lot');
  }
});

test('dense centres keep plain paving instead of lawns', () => {
  const blocks = [];
  for (let x = -90; x < 90; x += 30) for (let z = -90; z < 90; z += 30) blocks.push({ id: 100 + blocks.length, kind: 1, tags: { building: 'commercial', height: '40' }, geometry: at([[x + 2, z + 2], [x + 26, z + 2], [x + 26, z + 26], [x + 2, z + 26]]), holes: [] });
  const result = build(blocks);
  assert.equal(result.urban, true);
  assert.equal(result.nature.grassTufts, 0); assert.equal(result.nature.yardTrees, 0);
});

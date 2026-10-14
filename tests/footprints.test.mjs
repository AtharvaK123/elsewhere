import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeFootprints, footprintTags, footprintCoverage, crossedByRoad } from '../src/footprints.js';
import { enrichElements } from '../src/structures.js';
import { loadNeighbourhood } from '../src/osm-details.js';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/margate-footprints.json', import.meta.url)));
const osm = JSON.parse(readFileSync(new URL('./fixtures/margate-osm.json', import.meta.url)));
const tileAt = (lat, lon, z = 14) => ({ z, x: Math.floor((lon + 180) / 360 * 2 ** z), y: Math.floor((1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * 2 ** z) });
// The mapped OSM features, in the shape the tile decoder produces.
const base = osm.elements.map(w => w.tags.highway ? { id: w.id, kind: 0, tags: { highway: w.tags.highway, ...(w.tags.service ? { service: w.tags.service } : {}) }, geometry: w.geometry }
  : { id: w.id, kind: 1, tags: w.tags.building ? { building: w.tags.building } : { area: 'parking' }, geometry: w.geometry, holes: [] });
const tile = tileAt(40.55, -74.3315);

test('surveyed occupancy classes become ordinary building tags with measured or modest heights', () => {
  assert.deepEqual(footprintTags({ OCC_CLS: 'Residential', PRIM_OCC: 'Multi - Family Dwelling', HEIGHT: 8.14 }), { building: 'apartments', structure: 'building', fillIn: 'yes', footprintSource: 'usa-structures', height: '8.1', heightSource: 'footprints' });
  const estimated = footprintTags({ OCC_CLS: 'Residential', PRIM_OCC: 'Multi - Family Dwelling', HEIGHT: null });
  assert.equal(estimated.height, undefined); assert.equal(estimated['building:levels'], '3');
  assert.equal(footprintTags({ OCC_CLS: 'Residential', PRIM_OCC: 'Single Family Dwelling', HEIGHT: 6 }).building, 'house');
  assert.equal(footprintTags({ OCC_CLS: 'Commercial', PRIM_OCC: 'Retail Trade' }).building, 'retail');
  assert.equal(footprintTags({ OCC_CLS: 'Unclassified' }).building, 'yes');
});

test('footprints are only requested inside U.S. coverage', () => {
  assert.equal(footprintCoverage(40.55, -74.33), true); assert.equal(footprintCoverage(21.3, -157.85), true);
  assert.equal(footprintCoverage(48.8584, 2.2945), false); assert.equal(footprintCoverage(35.66, 139.7), false);
});

test('missing Margate apartments are filled in; parking-lot traces and mapped buildings are not', () => {
  const fills = normalizeFootprints(fixture.features);
  assert.equal(fills.length, fixture.features.length);
  const result = enrichElements(base, fills, tile), added = new Set(result.filter(e => e.tags.fillIn).map(e => Number(e.osmId.slice(2))));
  for (const id of fixture.metadata.inspection.confirmedApartmentFootprints) assert.ok(added.has(id), 'apartment footprint ' + id + ' fills the gap in the map');
  for (const id of fixture.metadata.inspection.likelyParkingFalsePositives) assert.ok(!added.has(id), 'automated trace ' + id + ' across a parking aisle is rejected');
  const apartment = result.find(e => e.osmId === 'fp36699040');
  assert.equal(apartment.tags.building, 'apartments'); assert.equal(apartment.tags.height, '8.1'); assert.ok(Number.isInteger(apartment.chunk) && apartment.chunk >= 0 && apartment.chunk < 64);
  // Every mapped building survives, and none is duplicated by a footprint.
  assert.equal(result.filter(e => e.tags.building && !e.tags.fillIn).length, base.filter(e => e.tags.building).length);
  const mapped = base.find(e => e.tags.building), copy = { ...fills[0], osmId: 'fp-copy', geometry: mapped.geometry, holes: [] };
  assert.ok(!enrichElements(base, [copy], tile).some(e => e.osmId === 'fp-copy'), 'a footprint where OSM already has a building is ignored');
});

test('road crossing distinguishes through-streets from covered drives and nearby curbs', () => {
  const square = { geometry: [[0, 0], [0, .0002], [.0002, .0002], [.0002, 0], [0, 0]].map(([dlat, dlon]) => ({ lat: 40 + dlat, lon: -74 + dlon })) };
  const across = { tags: { highway: 'service' }, geometry: [{ lat: 40.0001, lon: -74.001 }, { lat: 40.0001, lon: -73.999 }] };
  assert.equal(crossedByRoad(square, [across]), true);
  assert.equal(crossedByRoad(square, [{ ...across, tags: { highway: 'service', covered: 'yes' } }]), false);
  assert.equal(crossedByRoad(square, [{ ...across, geometry: across.geometry.map(p => ({ ...p, lat: 40.0005 })) }]), false);
});

test('footprints still fill in when OSM details fail, and are never requested abroad', async t => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async url => { calls.push(String(url)); return String(url).includes('USA_Structures') ? Response.json({ type: 'FeatureCollection', features: fixture.features.slice(0, 2) }) : new Response('', { status: 503 }); });
  const data = await loadNeighbourhood(40.55, -74.3315);
  assert.equal(data.source, 'footprints'); assert.equal(data.footprints, 2); assert.ok(data.features.every(f => f.tags.fillIn));
  calls.length = 0;
  await assert.rejects(loadNeighbourhood(48.8584, 2.2945));
  assert.ok(calls.length && calls.every(url => !url.includes('USA_Structures')));
});

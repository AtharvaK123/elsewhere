import test from 'node:test';
import assert from 'node:assert/strict';
import { packElements, packedTransfer, unpackElements } from '../src/packed.js';
import { facadeStyle, brickShare } from '../src/facades.js';

test('packed map features round-trip with holes, tags, and line/polygon kinds intact', () => {
  const elements = [
    { id: 7, tags: { building: 'yes', height: '30' }, geometry: [{ lat: 1, lon: 2 }, { lat: 1, lon: 3 }, { lat: 2, lon: 3 }, { lat: 1, lon: 2 }], holes: [[{ lat: 1.2, lon: 2.5 }, { lat: 1.3, lon: 2.6 }, { lat: 1.2, lon: 2.6 }]] },
    { id: 8, tags: { highway: 'residential' }, geometry: [{ lat: 5, lon: 6 }, { lat: 5.5, lon: 6.5 }] },
    { id: 9, tags: { building: 'yes', height: '30' }, geometry: [{ lat: 0, lon: 0 }, { lat: 0, lon: 1 }, { lat: 1, lon: 1 }], holes: [] }
  ];
  const packed = packElements(elements);
  assert.equal(packed.tagTable.length, 2, 'identical tags are stored once');
  assert.equal(packedTransfer(packed).every(buffer => buffer instanceof ArrayBuffer), true);
  const unpacked = unpackElements(packed);
  unpacked.forEach((element, i) => {
    assert.equal(element.id, elements[i].id);
    assert.deepEqual(element.tags, elements[i].tags);
    assert.deepEqual(element.geometry, elements[i].geometry);
    assert.deepEqual(element.holes, elements[i].holes);
    assert.deepEqual(element.first, elements[i].geometry[0]);
  });
  assert.equal(unpacked[1].holes, undefined, 'lines stay lines');
});

test('brick walk-ups appear where cities are built of brick, and stay rare elsewhere', () => {
  const share = (lat, lon) => { let brick = 0; for (let i = 0; i < 1000; i++) brick += facadeStyle(15, i / 1000, brickShare(lat, lon)) === 2; return brick / 1000; };
  assert.ok(share(40.71, -74.0) > .5, 'New York');
  assert.ok(share(51.5, -0.12) > .5, 'London');
  assert.ok(share(48.86, 2.29) < .15, 'Paris');
  assert.ok(share(35.66, 139.7) < .15, 'Tokyo');
  assert.equal(facadeStyle(8, .5, 1), 3, 'low buildings use the small-building style');
});

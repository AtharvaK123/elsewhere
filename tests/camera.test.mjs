import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { World } from '../src/world.js';
import { SPEED, moveInput } from '../src/first-person.js';

test('the third-person camera stops before a wall and returns when the path clears', () => {
  const camera = { position: new Vector3(0, 2, 12) };
  const state = { camera, controls: { target: new Vector3(0, 2, 0) }, player: { visible: true }, followDistance: 12, collides: (_x, z) => z >= 5 };
  World.prototype.followCamera.call(state);
  assert.ok(camera.position.z > 1.5 && camera.position.z < 5);
  assert.equal(state.player.visible, true);
  state.collides = () => false;
  World.prototype.followCamera.call(state);
  assert.equal(camera.position.z, 12);
});

test('raised building parts allow walking underneath but block a body at their height', () => {
  const building = { minX: 0, maxX: 20, minZ: 0, maxZ: 20, minY: 10, maxY: 30, pts: [[0, 0], [20, 0], [20, 20], [0, 20]], holes: [] };
  const state = { collisionGrid: new Map([['0,0', [building]]]) };
  assert.equal(World.prototype.collides.call(state, 5, 5), false, 'walk underneath');
  assert.equal(World.prototype.collides.call(state, 5, 5, 9), true, 'fly into it');
  assert.equal(World.prototype.collides.call(state, 5, 5, 40), false, 'fly above it');
});

test('you can stand on roofs and step up curbs, but not climb walls', () => {
  const roof = { minX: 0, maxX: 20, minZ: 0, maxZ: 20, minY: 0, maxY: 12, pts: [[0, 0], [20, 0], [20, 20], [0, 20]], holes: [] };
  const curb = { minX: 0, maxX: 20, minZ: 21, maxZ: 24, minY: 0, maxY: .15, pts: [[0, 21], [20, 21], [20, 24], [0, 24]], holes: [], platform: true };
  const state = { collisionGrid: new Map([['0,0', [roof, curb]]]) };
  assert.equal(World.prototype.groundAt.call(state, 5, 5, 12.2), 12, 'landed on the roof');
  assert.equal(World.prototype.groundAt.call(state, 5, 5, 0), 0, 'a wall is not a step');
  assert.equal(World.prototype.collides.call(state, 5, 5, 0), true, 'walls block walking');
  assert.equal(World.prototype.groundAt.call(state, 5, 22, 0), .15, 'curbs are stepped onto');
  assert.equal(World.prototype.collides.call(state, 5, 22, 0), false);
});

test('walking and running use real-world speeds', () => {
  assert.ok(SPEED.walk >= 1.2 && SPEED.walk <= 1.6, 'about 5 km/h');
  assert.ok(SPEED.run >= 3 && SPEED.run <= 5, 'a steady run');
  assert.ok(SPEED.flyFast > SPEED.fly);
  assert.deepEqual(moveInput(new Set(['w', 'shift'])), { x: 0, z: -1, running: true });
});
test('a richer building refresh cannot trap the player inside a raised roof or changed footprint',()=>{
  const position=new Vector3(0,5,0),state={player:{position},camera:{position:new Vector3(0,6.68,0)},controls:{target:new Vector3(0,6.4,0)},velocity:new Vector3(),collides:(x,z,y)=>Math.abs(x)<4&&Math.abs(z)<4&&y<20,groundAt:()=>20,freeSpot:World.prototype.freeSpot};
  World.prototype.reconcilePlayer.call(state);assert.equal(position.y,20);assert.equal(state.camera.position.y,21.68);
  position.set(0,0,0);World.prototype.reconcilePlayer.call(state);assert.equal(position.y,0);assert.ok(!state.collides(position.x,position.z,position.y));
});

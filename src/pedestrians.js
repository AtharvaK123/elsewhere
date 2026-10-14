import * as THREE from 'three';
import { routePoint } from './street-life.js';
import { distanceToBounds } from './chunks.js';

const SHIRTS = [0xd89b53, 0x457782, 0xa45251, 0x607959, 0xc9c3ad, 0x74668e, 0x314b69, 0xddd8cf];
const SKIN = [0xe8b793, 0xc68f69, 0x9a6448, 0x6d4635, 0xf1cdb2];
const HAIR = [0x302926, 0x654739, 0xb08a53, 0x4d3b2e, 0xb6b2a8];
const PANTS = [0x34434f, 0x3c3e40, 0x766c56, 0x566779];
export function stableRandom(key) {
  let n = 2166136261; for (let i = 0; i < key.length; i++) n = Math.imul(n ^ key.charCodeAt(i), 16777619);
  n = Math.imul(n ^ n >>> 16, 0x7feb352d); n = Math.imul(n ^ n >>> 15, 0x846ca68b); n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
}

// Ambient residents are local simulation, distinct from real multiplayer peers.
// Articulated instancing keeps an entire crowd to 14 meshes (+ contact shadows).
export class Pedestrians {
  constructor(scene, capacity = 80) {
    this.capacity = capacity; this.density = 60; this.agents = new Map(); this.routes = new Map(); this.nextSync = 0; this.time = 0;
    this.root = new THREE.Group(); this.root.name = 'Ambient pedestrians'; scene.add(this.root);
    this.material = new THREE.MeshStandardMaterial({ roughness: .86 });
    const capsule = (r, length) => new THREE.CapsuleGeometry(r, length, 3, 7);
    this.parts = {};
    const part = (name, geometry, multiple = 1) => {
      const mesh = new THREE.InstancedMesh(geometry, this.material, capacity * multiple);
      mesh.count = 0; mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.root.add(mesh); this.parts[name] = mesh;
    };
    part('body', capsule(.22, .34));
    part('neck', new THREE.CylinderGeometry(.067, .075, .13, 7));
    part('head', new THREE.SphereGeometry(.17, 10, 8));
    part('hair', new THREE.SphereGeometry(.176, 10, 6, 0, Math.PI * 2, 0, Math.PI * .57));
    part('eyes', new THREE.SphereGeometry(.019, 5, 4), 2);
    part('nose', new THREE.SphereGeometry(.032, 6, 4));
    part('arms', capsule(.06, .34).translate(0, -.2, 0), 2);
    part('hands', new THREE.SphereGeometry(.062, 7, 5), 2);
    part('thighs', capsule(.087, .25).translate(0, -.17, 0), 2);
    part('shins', capsule(.067, .23).translate(0, -.16, 0), 2);
    part('knees', new THREE.SphereGeometry(.083, 7, 5), 2);
    part('shoes', new THREE.BoxGeometry(.155, .1, .27), 2);
    part('bags', new THREE.BoxGeometry(.28, .34, .16));
    part('straps', new THREE.BoxGeometry(.045, .42, .06), 2);
    const pixels=new Uint8Array(32*32*4);
    for(let y=0;y<32;y++)for(let x=0;x<32;x++){const radius=Math.hypot(x-15.5,y-15.5)/16;pixels.set([255,255,255,Math.round(255*Math.max(0,1-radius)**1.5)],(y*32+x)*4);}
    const texture=new THREE.DataTexture(pixels,32,32);texture.needsUpdate=true;texture.magFilter=THREE.LinearFilter;
    const shadowMaterial = new THREE.MeshBasicMaterial({ color: 0x263328, map:texture, transparent: true, opacity: .3, depthWrite: false });
    const shadow = new THREE.InstancedMesh(new THREE.PlaneGeometry(.95,.95).rotateX(-Math.PI / 2), shadowMaterial, capacity);
    shadow.count = 0; shadow.frustumCulled = false; shadow.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.root.add(shadow); this.parts.shadow = shadow;
    this.dummy = new THREE.Object3D(); this.base = new THREE.Matrix4(); this.local = new THREE.Matrix4(); this.matrix = new THREE.Matrix4(); this.color = new THREE.Color();
  }
  setDensity(value) { this.density = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 60)); this.nextSync = 0; if (!this.density) this.reset(); }
  reset() { this.agents.clear(); this.routes.clear(); this.nextSync = 0; for (const mesh of Object.values(this.parts)) mesh.count = 0; }
  rebase(dx, dz, scaleX) {
    for (const a of this.agents.values()) {
      a.x = a.x * scaleX + dx; a.z += dz;
      // Chunk routes have already been transformed. Reproject distance along the
      // polyline; an east/west scale change must not move a northbound resident.
      let best=Infinity;
      for(let i=1;i<a.route.pts.length;i++){
        const p=a.route.pts[i-1],q=a.route.pts[i],vx=q[0]-p[0],vz=q[1]-p[1],l2=vx*vx+vz*vz;
        const t=Math.max(0,Math.min(1,((a.x-p[0])*vx+(a.z-p[1])*vz)/(l2||1))),d=Math.hypot(a.x-p[0]-vx*t,a.z-p[1]-vz*t);
        if(d<best){best=d;a.distance=a.route.cumulative[i-1]+Math.sqrt(l2)*t;}
      }
    }
    this.nextSync = 0;
  }
  sync(world) {
    const player = world.player.position, routes = new Map(), candidates = [];
    for (const chunk of world.chunks.chunks.values()) {
      if (chunk.state !== 'ready' || distanceToBounds(player.x, player.z, chunk.bounds) > 190) continue;
      for (const route of chunk.pedestrianRoutes || []) {
        const key = chunk.key + '/' + route.id; routes.set(key, route);
        const count = Math.min(12, Math.max(1, Math.floor(route.length / 22)));
        for (let i = 0; i < count; i++) {
          const id = key + '/' + i, r = stableRandom(id), old = this.agents.get(id);
          if (stableRandom(id + ':density') * 100 >= this.density) continue;
          const distance = old ? Math.min(old.distance, route.length - .6) : (.12 + r * .76) * route.length;
          const p = old || routePoint(route, distance), away = Math.hypot(p.x - player.x, p.z - player.z);
          if (away > (old ? 215 : 180) || world.collides(p.x, p.z, route.y)) continue;
          candidates.push({ id, key, r, route, distance, p, away, old });
        }
      }
    }
    // Keep existing residents stable. New blocks fill free slots as the player moves.
    candidates.sort((a, b) => Number(!!b.old) - Number(!!a.old) || a.away - b.away);
    const keep = new Set(), limit = Math.round(this.capacity * this.density / 100);
    for (const c of candidates.slice(0, limit)) {
      keep.add(c.id);
      if (c.old) { c.old.route = c.route; c.old.distance = c.distance; continue; }
      const { id, key, r, distance, route, p } = c, direction = r < .5 ? -1 : 1;
      this.agents.set(id, { id, key, route, distance, x: p.x, z: p.z, y: route.y, direction,
        yaw: Math.atan2(-p.ux * direction, -p.uz * direction), speed: .82 + stableRandom(id + ':speed') * .53,
        stride: r * 10, pause: 0, nextPause: this.time + 14 + r * 36, height: .92 + r * .14,
        shirt: SHIRTS[Math.floor(r * SHIRTS.length)], skin: SKIN[Math.floor(stableRandom(id + ':skin') * SKIN.length)],
        hair: HAIR[Math.floor(stableRandom(id + ':hair') * HAIR.length)], pants: PANTS[Math.floor(stableRandom(id + ':pants') * PANTS.length)], bag: stableRandom(id + ':bag') < .45, moving: 0 });
    }
    for (const id of this.agents.keys()) if (!keep.has(id)) this.agents.delete(id);
    this.routes = routes;
  }
  update(dt, world, reduced = false) {
    this.time += dt;
    if (!this.density) return;
    if (this.time >= this.nextSync) { this.sync(world); this.nextSync = this.time + .8; }
    const player = world.player.position, occupancy = new Map();
    for (const a of this.agents.values()) {
      const key = Math.floor(a.x / 2) + ',' + Math.floor(a.z / 2);
      if (!occupancy.has(key)) occupancy.set(key, []); occupancy.get(key).push(a);
    }
    let index = 0;
    for (const a of this.agents.values()) {
      const route = a.route; a.pause = Math.max(0, a.pause - dt); let moving = false;
      if (!reduced && !a.pause) {
        if (this.time > a.nextPause) { a.pause = 1.4 + stableRandom(a.id + Math.floor(this.time)) * 2.2; a.nextPause = this.time + 25 + stableRandom(a.id) * 35; }
        let distance = a.distance + dt * a.speed * a.direction;
        if (distance > route.length - .6 || distance < .6) { a.direction *= -1; a.pause = .8; distance = Math.max(.6, Math.min(route.length - .6, distance)); }
        const next = routePoint(route, distance);
        let occupied = Math.abs(player.y - a.y) < 2 && Math.hypot(next.x - player.x, next.z - player.z) < .85;
        const gx = Math.floor(next.x / 2), gz = Math.floor(next.z / 2);
        for (let dx = -1; dx <= 1 && !occupied; dx++) for (let dz = -1; dz <= 1 && !occupied; dz++) {
          occupied = (occupancy.get((gx + dx) + ',' + (gz + dz)) || []).some(b => b !== a && Math.hypot(next.x - b.x, next.z - b.z) < .65 && Math.hypot(next.x - b.x, next.z - b.z) < Math.hypot(a.x - b.x, a.z - b.z));
        }
        if (world.collides(next.x, next.z, route.y) || occupied) { a.direction *= -1; a.pause = 1 + stableRandom(a.id); }
        else { const step = Math.hypot(next.x - a.x, next.z - a.z); a.stride += step; a.distance = distance; a.x = next.x; a.z = next.z; a.y = Math.max(route.y, world.groundAt(a.x, a.z, route.y)); moving = step > .001; }
        const target = Math.atan2(-next.ux * a.direction, -next.uz * a.direction);
        a.yaw += Math.atan2(Math.sin(target - a.yaw), Math.cos(target - a.yaw)) * Math.min(1, dt * 5);
      }
      a.moving += ((moving ? 1 : 0) - a.moving) * Math.min(1, dt * 9);
      this.draw(a, index++, reduced);
    }
    for (const [name, mesh] of Object.entries(this.parts)) {
      mesh.count = index * (['eyes', 'arms', 'hands', 'thighs', 'shins', 'knees', 'shoes', 'straps'].includes(name) ? 2 : 1);
      mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }
  draw(a, i, reduced) {
    const d = this.dummy, h = a.height, walk = reduced ? 0 : a.moving, phase = a.stride * Math.PI * 2 / 1.5;
    const legs=[-1,1].map(s=>{
      const wave=Math.sin(phase+(s===1?Math.PI:0)),angle=wave*.43*walk,bend=angle-Math.max(0,-wave)*.48*walk;
      const kneeY=.78-Math.cos(angle)*.35,kneeZ=-Math.sin(angle)*.35;
      return {s,angle,bend,kneeY,kneeZ,shoeY:kneeY-Math.cos(bend)*.33-.05};
    });
    const sole=Math.min(...legs.map(l=>l.shoeY))-.05;
    d.position.set(a.x, a.y-sole*h, a.z); d.rotation.set(0, a.yaw, 0); d.scale.setScalar(h); d.updateMatrix(); this.base.copy(d.matrix);
    const put = (name, slot, color, x, y, z, sx = 1, sy = 1, sz = 1, rx = 0) => {
      d.position.set(x, y, z); d.rotation.set(rx, 0, 0); d.scale.set(sx, sy, sz); d.updateMatrix();
      this.matrix.multiplyMatrices(this.base, d.matrix); this.parts[name].setMatrixAt(slot, this.matrix); this.parts[name].setColorAt(slot, this.color.set(color));
    };
    put('body', i, a.shirt, 0, 1.04, 0, 1, 1, .72);
    put('neck', i, a.skin, 0, 1.42, 0);
    put('head', i, a.skin, 0, 1.59, -.015, .94, 1.1, .95);
    put('hair', i, a.hair, 0, 1.63, 0, 1, 1.04, 1);
    put('nose', i, a.skin, 0, 1.58, -.18, .75, 1, 1);
    for (const {s,angle,bend,kneeY,kneeZ,shoeY} of legs) {
      const slot = i * 2 + (s === 1 ? 1 : 0);
      put('eyes', slot, 0x292725, s * .063, 1.62, -.16, 1, 1, .6);
      put('arms', slot, a.shirt, s * .264, 1.26, 0, 1, 1, 1, -angle * .8);
      put('hands', slot, a.skin, s * .264, 1.26 - Math.cos(angle * .8) * .43, Math.sin(angle * .8) * .43);
      put('thighs', slot, a.pants, s * .107, .78, 0, 1, 1, 1, angle);
      put('knees', slot, a.pants, s * .107, kneeY, kneeZ);
      put('shins', slot, a.pants, s * .107, kneeY, kneeZ, 1, 1, 1, bend);
      put('shoes', slot, 0xe6e0d5, s * .107, shoeY, kneeZ - Math.sin(bend) * .33 - .035);
      put('straps', slot, 0x353c3c, s * .14, 1.11, -.145, a.bag ? 1 : 0, 1, 1);
    }
    put('bags', i, a.shirt === SHIRTS[0] ? 0x344b51 : 0x8d6548, 0, 1.1, .21, a.bag ? 1 : 0, 1, 1);
    d.position.set(a.x, a.y + .018, a.z); d.rotation.set(0, 0, 0); d.scale.set(h, 1, h * .72); d.updateMatrix(); this.parts.shadow.setMatrixAt(i, d.matrix);
  }
  get state() { return { count: this.agents.size, density: this.density, samples: [...this.agents.values()].slice(0, 12).map(a => ({ id: a.id, x: a.x, y: a.y, z: a.z, yaw: a.yaw, distance: a.distance, shirt: a.shirt })) }; }
  dispose() { for (const mesh of Object.values(this.parts)) { mesh.geometry.dispose(); mesh.dispose(); } this.parts.shadow.material.map.dispose(); this.parts.shadow.material.dispose(); this.material.dispose(); this.root.removeFromParent(); }
}

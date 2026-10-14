import * as THREE from 'three';
import { STYLE } from './facades.js';

// Everything in a chunk is appended into a few MeshBuilders and uploaded as one mesh each,
// so a whole street block of props costs a handful of draw calls. All sizes are in meters.

const colorCache = new Map();
export function rgb(hex) {
  let value = colorCache.get(hex);
  if (!value) {
    const c = new THREE.Color();
    // OSM colours are CSS names, hex, or names like 'light_grey'.
    const name = typeof hex === 'string' ? hex.trim().toLowerCase().replace(/[\s_-]/g, '').replace(/grey/g, 'gray') : hex;
    if (typeof name === 'string' && !/^#[0-9a-f]{3,8}$/.test(name) && !(name in THREE.Color.NAMES)) c.set(0xcfc8bb); else c.set(name);
    value = [Math.round(Math.min(1, c.r) * 255), Math.round(Math.min(1, c.g) * 255), Math.round(Math.min(1, c.b) * 255)];
    colorCache.set(hex, value);
  }
  return value;
}

export class MeshBuilder {
  constructor(capacity = 8192) { this.count = 0; this.allocate(capacity); }
  allocate(capacity) {
    const grow = (old, size) => { const next = new old.constructor(capacity * size); next.set(old.subarray(0, this.count * size)); return next; };
    if (!this.position) { this.position = new Float32Array(capacity * 3); this.normal = new Float32Array(capacity * 3); this.uv = new Float32Array(capacity * 2); this.info = new Float32Array(capacity * 2); this.color = new Uint8Array(capacity * 3); }
    else { this.position = grow(this.position, 3); this.normal = grow(this.normal, 3); this.uv = grow(this.uv, 2); this.info = grow(this.info, 2); this.color = grow(this.color, 3); }
    this.capacity = capacity;
  }
  vertex(x, y, z, nx, ny, nz, color, u, v, style, seed) {
    if (this.count >= this.capacity) this.allocate(this.capacity * 2);
    const i = this.count++;
    this.position[i * 3] = x; this.position[i * 3 + 1] = y; this.position[i * 3 + 2] = z;
    this.normal[i * 3] = nx; this.normal[i * 3 + 1] = ny; this.normal[i * 3 + 2] = nz;
    this.color[i * 3] = color[0]; this.color[i * 3 + 1] = color[1]; this.color[i * 3 + 2] = color[2];
    this.uv[i * 2] = u; this.uv[i * 2 + 1] = v; this.info[i * 2] = style; this.info[i * 2 + 1] = seed;
  }
  // A triangle wound to face along n. uvs are [u, v] per corner (meters on walls).
  tri(a, b, c, n, color, style = STYLE.PLAIN, seed = 0, ua = ZERO2, ub = ZERO2, uc = ZERO2) {
    const cx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), cy = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), cz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    if (cx * n[0] + cy * n[1] + cz * n[2] < 0) { [b, c] = [c, b]; [ub, uc] = [uc, ub]; }
    for (const [p, uv] of [[a, ua], [b, ub], [c, uc]]) this.vertex(p[0], p[1], p[2], n[0], n[1], n[2], color, uv[0], uv[1], style, seed);
  }
  quad(a, b, c, d, n, color, style, seed, ua, ub, uc, ud) { this.tri(a, b, c, n, color, style, seed, ua, ub, uc); this.tri(a, c, d, n, color, style, seed, ua, uc, ud); }
  // Flat horizontal polygon (x/z points) at height y, triangulated with holes.
  polygon(points, holes, y, color, style = STYLE.PLAIN, seed = 0, up = true) {
    if (points.length < 3) return;
    const contour = points.map(([x, z]) => new THREE.Vector2(x, z)), inner = holes.filter(h => h.length > 2).map(h => h.map(([x, z]) => new THREE.Vector2(x, z)));
    let faces; try { faces = THREE.ShapeUtils.triangulateShape(contour, inner); } catch { return; }
    const all = [...contour, ...inner.flat()], n = up ? UP : DOWN;
    for (const [i, j, k] of faces) this.tri([all[i].x, y, all[i].y], [all[j].x, y, all[j].y], [all[k].x, y, all[k].y], n, color, style, seed, [all[i].x, all[i].y], [all[j].x, all[j].y], [all[k].x, all[k].y]);
  }
  // Appends a template shape transformed by a Matrix4. facadeUv carries (u, sway): sway weight for
  // foliage, or (light index, parity) for traffic signals.
  shape(name, matrix, color, style = STYLE.PLAIN, seed = 0, sway = 0, u = 0) {
    const { position, normal } = SHAPES[name] || (SHAPES[name] = makeShape(name)), e = matrix.elements;
    const normalMatrix = NORMAL.getNormalMatrix(matrix).elements;
    for (let i = 0; i < position.length; i += 3) {
      const x = position[i], y = position[i + 1], z = position[i + 2], nx = normal[i], ny = normal[i + 1], nz = normal[i + 2];
      let mx = normalMatrix[0] * nx + normalMatrix[3] * ny + normalMatrix[6] * nz, my = normalMatrix[1] * nx + normalMatrix[4] * ny + normalMatrix[7] * nz, mz = normalMatrix[2] * nx + normalMatrix[5] * ny + normalMatrix[8] * nz;
      const length = Math.hypot(mx, my, mz) || 1; mx /= length; my /= length; mz /= length;
      this.vertex(e[0] * x + e[4] * y + e[8] * z + e[12], e[1] * x + e[5] * y + e[9] * z + e[13], e[2] * x + e[6] * y + e[10] * z + e[14], mx, my, mz, color, u, sway, style, seed);
    }
  }
  // Raw typed arrays, transferable from a worker.
  arrays() {
    if (!this.count) return null;
    const n = this.count;
    return { position: this.position.slice(0, n * 3), normal: this.normal.slice(0, n * 3), color: this.color.slice(0, n * 3), uv: this.uv.slice(0, n * 2), info: this.info.slice(0, n * 2) };
  }
  geometry() {
    if (!this.count) return null;
    const g = new THREE.BufferGeometry(), n = this.count;
    g.setAttribute('position', new THREE.BufferAttribute(this.position.slice(0, n * 3), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(this.normal.slice(0, n * 3), 3));
    g.setAttribute('color', new THREE.BufferAttribute(this.color.slice(0, n * 3), 3, true));
    g.setAttribute('facadeUv', new THREE.BufferAttribute(this.uv.slice(0, n * 2), 2));
    g.setAttribute('facadeInfo', new THREE.BufferAttribute(this.info.slice(0, n * 2), 2));
    g.computeBoundingSphere();
    return g;
  }
}
const ZERO2 = [0, 0], UP = [0, 1, 0], DOWN = [0, -1, 0], NORMAL = new THREE.Matrix3();

const SHAPES = {};
function makeShape(name) {
  const geometry = ({
    box: () => new THREE.BoxGeometry(1, 1, 1),
    cyl: () => new THREE.CylinderGeometry(.5, .5, 1, 10),
    cyl6: () => new THREE.CylinderGeometry(.5, .5, 1, 6),
    cone: () => new THREE.ConeGeometry(.5, 1, 9),
    ico: () => new THREE.IcosahedronGeometry(1, 1),
    ico0: () => new THREE.IcosahedronGeometry(1, 0),
    sphere: () => new THREE.SphereGeometry(.5, 10, 7),
    oct: () => new THREE.OctahedronGeometry(1, 0),
    dome: () => new THREE.SphereGeometry(.5, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2),
    torus: () => new THREE.TorusGeometry(.5, .045, 5, 12)
  })[name]();
  if (geometry.index) return makeArrays(geometry.toNonIndexed());
  return makeArrays(geometry);
}
function makeArrays(geometry) {
  return { position: geometry.attributes.position.array, normal: geometry.attributes.normal.array };
}

// Placement helper: a prop's base transform (position + heading) composed with a part's local transform.
const BASE = new THREE.Matrix4(), LOCAL = new THREE.Matrix4(), OUT = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), V = new THREE.Vector3(), S = new THREE.Vector3(), YAXIS = new THREE.Vector3(0, 1, 0);
export function base(x, y, z, yaw = 0) { return BASE.makeRotationY(yaw).setPosition(x, y, z).clone(); }
function at(baseMatrix, x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0) {
  LOCAL.compose(V.set(x, y, z), Q.setFromEuler(E.set(rx, ry, rz)), S.set(sx, sy, sz));
  return OUT.multiplyMatrices(baseMatrix, LOCAL);
}
const part = (b, name, m, color, style, seed, sway) => b.shape(name, m, rgb(color), style, seed, sway);

// --- Vegetation -------------------------------------------------------------------------
const LEAVES = [0x4f8a3c, 0x5d9a40, 0x467f36, 0x6aa548, 0x3f7434, 0x78ad4f, 0x568c3a];
export function tree(b, x, z, height, random, { kind = 'broadleaf', y = 0, autumn = false } = {}) {
  const m = base(x, y, z, random() * 6.28), seed = random();
  if (kind === 'conifer') {
    part(b, 'cyl6', at(m, 0, height * .15, 0, .28, height * .3, .28), 0x5b4433);
    const green = [0x2f5d36, 0x386b3c, 0x2b5532][Math.floor(random() * 3)];
    for (let i = 0; i < 3; i++) part(b, 'cone', at(m, 0, height * (.32 + i * .2), 0, height * (.42 - i * .1), height * .38, height * (.42 - i * .1)), green, STYLE.FOLIAGE, seed, .4 + i * .3);
    return;
  }
  if (kind === 'palm') {
    const lean = (random() - .5) * .25;
    part(b, 'cyl6', at(m, Math.sin(lean) * height * .5, height * .5, 0, .32, height, .32, 0, 0, -lean), 0x8a7356);
    const topX = Math.sin(lean) * height;
    for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; part(b, 'box', at(m, topX + Math.cos(a) * 1.4, height - .3, Math.sin(a) * 1.4, 3, .08, .7, 0, -a, -.45), 0x4f8f3a, STYLE.FOLIAGE, seed, 1); }
    return;
  }
  const trunk = .1 + height * .014;
  part(b, 'cyl6', at(m, 0, height * .25, 0, trunk * 2, height * .5, trunk * 2), 0x5e4a3a);
  const leaf = autumn ? [0xc9772f, 0xd7a03a, 0xb5462e][Math.floor(random() * 3)] : LEAVES[Math.floor(random() * LEAVES.length)];
  const r = height * (.3 + random() * .06);
  part(b, 'ico', at(m, 0, height * .64, 0, r, r * 1.05, r), leaf, STYLE.FOLIAGE, seed, 1);
  part(b, 'ico0', at(m, r * .45, height * .76, r * .2, r * .62, r * .58, r * .62), leaf, STYLE.FOLIAGE, seed, 1);
}
export function bush(b, x, z, size, random, color) {
  const m = base(x, 0, z, random() * 6.28);
  part(b, 'ico0', at(m, 0, size * .42, 0, size * .62, size * .48, size * .62), color ?? LEAVES[Math.floor(random() * LEAVES.length)], STYLE.FOLIAGE, random(), .35);
}
export function hedge(b, x, z, length, yaw) {
  part(b, 'box', at(base(x, 0, z, yaw), 0, .55, 0, .7, 1.1, length), 0x3f7a35, STYLE.FOLIAGE, 0, .15);
}
const BLOOMS = [0xe23c5b, 0xf28c28, 0xf6d32d, 0xffffff, 0xb05ad4, 0xea6fa8, 0x4d7de0, 0xff5a36];
export function rock(b,x,z,y,random){
  const size=.2+random()*.5,m=base(x,y+size*.18,z,random()*Math.PI*2);
  part(b,'ico0',at(m,0,0,0,size*1.3,size*.55,size,.12,0,.15),[0x888b78,0x999486,0x7c8479][Math.floor(random()*3)]);
}
// A small clump of leaves dotted with blooms, about 40 cm across.
export function flowers(b, x, z, random, palette = BLOOMS) {
  const m = base(x, 0, z, random() * 6.28), bloom = palette[Math.floor(random() * palette.length)];
  part(b, 'ico0', at(m, 0, .1, 0, .22, .14, .22), 0x4c8a37, STYLE.FOLIAGE, random(), .2);
  for (let i = 0; i < 5; i++) { const a = i * 1.26 + random(); part(b, 'oct', at(m, Math.cos(a) * .13, .26 + random() * .08, Math.sin(a) * .13, .055, .05, .055), bloom, STYLE.FOLIAGE, random(), .5); }
}

// --- Street furniture ---------------------------------------------------------------------
export function streetLight(b, x, z, yaw, { style = 'modern' } = {}) {
  const m = base(x, .15, z, yaw);
  if (style === 'classic') {
    part(b, 'cyl6', at(m, 0, 2, 0, .16, 4, .16), 0x253330);
    part(b, 'cyl6', at(m, 0, .3, 0, .34, .6, .34), 0x253330);
    part(b, 'sphere', at(m, 0, 4.25, 0, .48, .55, .48), 0xfff4d8, STYLE.LAMP);
    return;
  }
  part(b, 'cyl6', at(m, 0, 3.6, 0, .16, 7.2, .16), 0x515b5c);
  part(b, 'box', at(m, 0, 7.15, .8, .09, .09, 1.7), 0x515b5c);
  part(b, 'box', at(m, 0, 7.05, 1.65, .32, .14, .62), 0x3b4344);
  part(b, 'box', at(m, 0, 6.97, 1.65, .26, .03, .52), 0xfff3d6, STYLE.LAMP);
}
export function bench(b, x, z, yaw) {
  const m = base(x, 0, z, yaw);
  part(b, 'box', at(m, 0, .45, 0, 1.7, .06, .42), 0xa0673b);
  part(b, 'box', at(m, 0, .78, .2, 1.7, .32, .05, -.12), 0xa0673b);
  for (const sx of [-.72, .72]) part(b, 'box', at(m, sx, .38, .02, .07, .76, .48), 0x2f3433);
}
export function wasteBasket(b, x, z) {
  const m = base(x, 0, z);
  part(b, 'cyl', at(m, 0, .45, 0, .52, .9, .52), 0x2e5a3f);
  part(b, 'cyl', at(m, 0, .93, 0, .56, .06, .56), 0x243128);
}
export function bollard(b, x, z) {
  const m = base(x, 0, z);
  part(b, 'cyl6', at(m, 0, .45, 0, .2, .9, .2), 0x3a3f41);
  part(b, 'cyl6', at(m, 0, .78, 0, .21, .06, .21), 0xd9d9cf);
}
export function bikeRack(b, x, z, yaw) {
  const m = base(x, 0, z, yaw);
  for (const dx of [-.8, 0, .8]) { for (const dz of [-.3, .3]) part(b, 'box', at(m, dx, .42, dz, .05, .84, .05), 0x8d9596); part(b, 'box', at(m, dx, .84, 0, .05, .05, .65), 0x8d9596); }
  // Illustrative parked bicycles at the mapped rack, built into the same mesh.
  for (const offset of [-.7,.1]) {
    const color=offset<0?0xbc6748:0x357883;
    for(const wz of [-.55,.55]) {
      part(b,'torus',at(m,offset,.35,wz,.66,.66,.66,0,Math.PI/2),0x2e3436);
      part(b,'torus',at(m,offset,.35,wz,.57,.57,.57,0,Math.PI/2),0xb7c1bd);
      for(const angle of [0,Math.PI/3,-Math.PI/3])part(b,'box',at(m,offset,.35,wz,.016,.58,.012,angle),0xaeb7b4);
    }
    for(const [a,c]of [[[.35,-.55],[.37,0]],[[.37,0],[.82,-.2]],[[.82,-.2],[.35,-.55]],[[.82,-.2],[.89,.39]],[[.89,.39],[.37,0]],[[.89,.39],[.35,.55]],[[.89,.39],[1.03,.36]]]) {
      const dy=c[0]-a[0],dz=c[1]-a[1];part(b,'cyl6',at(m,offset,(a[0]+c[0])/2,(a[1]+c[1])/2,.035,Math.hypot(dy,dz),.035,Math.atan2(dz,dy)),color);
    }
    part(b,'box',at(m,offset,.86,-.23,.18,.065,.28),0x343638);
    part(b,'box',at(m,offset,1.03,.36,.46,.035,.04),0x3b4344);
    part(b,'box',at(m,offset,.36,0,.3,.045,.07),0x3b4344);
  }
}
export function busShelter(b, x, z, yaw, accent = 0x2f6fb3) {
  const m = base(x, .15, z, yaw);
  part(b, 'box', at(m, 0, 2.5, 0, 3.6, .12, 1.6), 0x3c4648);
  part(b, 'box', at(m, 0, 1.3, -.72, 3.4, 2.2, .05), 0x9fc3cf, STYLE.GLASS);
  part(b, 'box', at(m, -1.75, 1.3, -.05, .05, 2.2, 1.3), 0x9fc3cf, STYLE.GLASS);
  for (const sx of [-1.75, 1.75]) part(b, 'box', at(m, sx, 1.25, .7, .08, 2.5, .08), 0x3c4648);
  part(b, 'box', at(m, 0, .45, -.45, 2.4, .06, .4), 0x8a8f8f);
  part(b, 'cyl6', at(m, 2.4, 1.3, .6, .08, 2.6, .08), 0x6b7272);
  part(b, 'box', at(m, 2.4, 2.45, .6, .5, .5, .05), accent);
}
export function postBox(b, x, z, region) {
  const m = base(x, 0, z, 0);
  if (region === 'us') { part(b, 'box', at(m, 0, .55, 0, .48, 1.1, .5), 0x2a4f9a); part(b, 'cyl', at(m, 0, 1.1, 0, .48, .5, .5, 0, 0, Math.PI / 2), 0x2a4f9a); return; }
  const color = region === 'uk' || region === 'jp' ? 0xc8261f : 0xf2c12e;
  if (region === 'uk' || region === 'jp') { part(b, 'cyl', at(m, 0, .7, 0, .5, 1.4, .5), color); part(b, 'dome', at(m, 0, 1.4, 0, .56, .3, .56), 0x1f1f1f); return; }
  part(b, 'cyl6', at(m, 0, .5, 0, .08, 1, .08), 0x555b5b);
  part(b, 'box', at(m, 0, 1.15, 0, .45, .55, .35), color);
}
export function hydrant(b, x, z) {
  const m = base(x, .15, z);
  part(b, 'cyl', at(m, 0, .32, 0, .3, .64, .3), 0xc8312a);
  part(b, 'dome', at(m, 0, .64, 0, .34, .2, .34), 0xc8312a);
  part(b, 'cyl6', at(m, 0, .42, 0, .16, .16, .48, Math.PI / 2), 0xd9d9cf);
}
export function drinkingFountain(b, x, z) {
  const m = base(x, 0, z);
  part(b, 'box', at(m, 0, .45, 0, .35, .9, .35), 0x6e7a76);
  part(b, 'cyl', at(m, 0, .93, 0, .5, .08, .5), 0x8d9a95);
}
export function recyclingBins(b, x, z, yaw) {
  const m = base(x, 0, z, yaw);
  [0x2c6db5, 0x3c8a3f, 0xe0b42a].forEach((color, i) => part(b, 'box', at(m, (i - 1) * 1.3, .7, 0, 1.2, 1.4, 1), color));
}
export function subwayEntrance(b, x, z, yaw) {
  const m = base(x, .15, z, yaw);
  for (const sx of [-1, 1]) { part(b, 'box', at(m, sx * 1, .55, 0, .06, 1.1, 4), 0x2c5f3f); part(b, 'box', at(m, sx, 1.1, 0, .1, .06, 4), 0x2c5f3f); }
  part(b, 'box', at(m, 0, .55, -2, 2, 1.1, .06), 0x2c5f3f);
  part(b, 'box', at(m, 0, -.3, .2, 1.9, .6, 3.6), 0x262a2a);
  for (const sx of [-1, 1]) { part(b, 'cyl6', at(m, sx, 1.6, -2, .1, 1, .1), 0x2c5f3f); part(b, 'sphere', at(m, sx, 2.25, -2, .35, .35, .35), 0x7fd18a, STYLE.LAMP); }
}
export function infoBoard(b, x, z, yaw) {
  const m = base(x, 0, z, yaw);
  for (const sx of [-.5, .5]) part(b, 'box', at(m, sx, .9, 0, .08, 1.8, .08), 0x3c4648);
  part(b, 'box', at(m, 0, 1.45, 0, 1.2, .9, .06), 0xe9e4d4);
}
export function sculpture(b, x, z, random) {
  const m = base(x, 0, z, random() * 6.28);
  part(b, 'box', at(m, 0, .5, 0, 1.4, 1, 1.4), 0xb8b2a4);
  const color = [0x9c6b3c, 0xc0392b, 0x2d6f9e, 0xd9b44a][Math.floor(random() * 4)];
  part(b, 'sphere', at(m, 0, 1.9, 0, 1.6, 1.6, 1.6), color, STYLE.PLAIN);
  part(b, 'box', at(m, 0, 2.9, 0, .5, 1.2, .5, .4, 0, .5), color);
}
export function cafeSet(b, x, z, yaw, random) {
  const m = base(x, .15, z, yaw), canvas = [0xc0392b, 0x2e7d5b, 0xf0e6d2, 0x2c4f86, 0xe2a336][Math.floor(random() * 5)];
  part(b, 'cyl', at(m, 0, .72, 0, .7, .04, .7), 0xe8e4da);
  part(b, 'cyl6', at(m, 0, .36, 0, .06, .72, .06), 0x2e3333);
  for (const a of [0, Math.PI]) {
    const cx = Math.cos(a) * .65, cz = Math.sin(a) * .65;
    part(b, 'box', at(m, cx, .45, cz, .42, .05, .42), 0x2e3333);
    part(b, 'box', at(m, cx * 1.3, .72, cz, .05, .55, .42), 0x2e3333);
  }
  part(b, 'cyl6', at(m, 0, 1.3, 0, .05, 1.2, .05), 0xd9d4c7);
  part(b, 'cone', at(m, 0, 2.15, 0, 2.6, .55, 2.6), canvas);
}
// Street-level shopfronts share the chunk's material and draw call. Their layout
// and palette are illustrative, while the owning POI and building are map data.
export function storefront(b, shop, color) {
  const { x, z, yaw, width: w } = shop, m = base(x, .15, z, yaw), frame = 0x304347;
  part(b, 'box', at(m, 0, 1.45, 0, w, 2.9, .13), 0xe6dfce);
  const doorX = w * .28, displayW = w * .59;
  part(b, 'box', at(m, -w * .17, 1.4, .09, displayW, 2.18, .07), 0x365563, STYLE.GLASS);
  part(b, 'box', at(m, doorX, 1.2, .12, .96, 2.35, .09), frame);
  part(b, 'box', at(m, doorX, 1.33, .18, .79, 1.94, .03), 0x658691, STYLE.GLASS);
  part(b, 'box', at(m, doorX + .27, 1.15, .24, .035, .38, .06), 0xd5c6a3);
  for (const u of [-w * .47, -w * .17, w * .125]) part(b, 'box', at(m, u, 1.42, .145, .07, 2.28, .08), frame);
  for (const h of [.3, 2.5]) part(b, 'box', at(m, -w * .17, h, .15, displayW + .07, .075, .08), frame);
  // A sill, low plinth, and transom separate the shop from upper-floor facades.
  part(b, 'box', at(m, 0, .14, .12, w + .1, .23, .28), 0x9b9c91);
  part(b, 'box', at(m, 0, 2.94, .1, w, .52, .18), color);
  part(b, 'box', at(m, 0, 3.26, .12, w + .18, .12, .3), frame);
  const aw = w * .97, count = Math.ceil(aw / .42);
  for (let i = 0; i < count; i++) {
    const stripe = i % 2 ? 0xf3e9d2 : color, u = -aw / 2 + (i + .5) * aw / count;
    part(b, 'box', at(m, u, 2.67, .68, aw / count, .07, 1.3, .13), stripe);
    part(b, 'box', at(m, u, 2.47, 1.3, aw / count, .22, .07), stripe);
  }
  // Warm display strip participates in the existing day/night lighting shader.
  part(b, 'box', at(m, -w * .17, 2.4, .19, displayW - .15, .035, .06), 0xffdfac, STYLE.LAMP);
}
export function shopPlanter(b, x, z, yaw, color, random) {
  const m = base(x, .15, z, yaw);
  part(b, 'box', at(m, 0, .24, 0, .68, .48, .68), color);
  part(b, 'box', at(m, 0, .49, 0, .6, .03, .6), 0x504434);
  part(b, 'ico', at(m, 0, .74, 0, .72, .66, .72), 0x62864a, STYLE.FOLIAGE, random(), .4);
}
export function menuBoard(b, x, z, yaw) {
  const m = base(x, .15, z, yaw);
  for (const side of [-1, 1]) part(b, 'box', at(m, 0, .55, side * .17, .55, 1.04, .06, side * -.2), 0xb38b58);
  part(b, 'box', at(m, 0, .65, .2, .45, .66, .03, -.2), 0x263f3c);
  for (let i = 0; i < 4; i++) part(b, 'box', at(m, -.025, .83 - i * .105, .25 + i * .021, .29 - i % 2 * .08, .018, .012), 0xeee8ce);
}
export function trafficSignal(b, x, z, yaw, parity, phase) {
  const m = base(x, .15, z, yaw);
  part(b, 'cyl6', at(m, 0, 2.2, 0, .16, 4.4, .16), 0x3b4040);
  part(b, 'box', at(m, 0, 3.6, .2, .34, 1, .26), 0x2e3232);
  [0xff3b30, 0xffb000, 0x34d058].forEach((color, i) => b.shape('sphere', at(m, 0, 3.92 - i * .32, .34, .2, .2, .08), rgb(color), STYLE.SIGNAL, phase, parity, i));
}
export function stopSign(b, x, z, yaw) {
  const m = base(x, .15, z, yaw);
  part(b, 'cyl6', at(m, 0, 1.1, 0, .07, 2.2, .07), 0x9aa0a0);
  part(b, 'cyl', at(m, 0, 2.3, .05, .75, .75, .04, Math.PI / 2), 0xc42b23);
}
export function parkingSign(b, x, z, yaw) {
  const m = base(x, .15, z, yaw);
  part(b, 'cyl6', at(m, 0, 1.1, 0, .07, 2.2, .07), 0x9aa0a0);
  part(b, 'box', at(m, 0, 2.3, .05, .55, .55, .04), 0x2a62b8);
}
export function goal(b, x, z, yaw, width = 7.3) {
  const m = base(x, .03, z, yaw);
  for (const sx of [-width / 2, width / 2]) part(b, 'box', at(m, sx, 1.22, 0, .12, 2.44, .12), 0xf5f5f0);
  part(b, 'box', at(m, 0, 2.44, 0, width + .12, .12, .12), 0xf5f5f0);
}
export function playground(b, x, z, yaw, random) {
  const m = base(x, .03, z, yaw);
  // Slide: platform with ladder and a chute.
  for (const [sx, sz] of [[-.6, -.6], [.6, -.6], [-.6, .6], [.6, .6]]) part(b, 'box', at(m, sx, 1, sz, .1, 2, .1), 0x2f6fb3);
  part(b, 'box', at(m, 0, 1.5, 0, 1.4, .1, 1.4), 0xe8b52f);
  part(b, 'box', at(m, 0, 2.2, 0, 1.5, .08, 1.5), 0xd8452f);
  part(b, 'box', at(m, 0, .8, 1.85, .7, .06, 2.7, .58), 0xd8452f);
  // Swings: A-frame with two seats.
  const s = base(0, 0, 0); s.multiplyMatrices(m, s.makeTranslation(4, 0, 0));
  for (const sx of [-1.6, 1.6]) for (const sz of [-.6, .6]) part(b, 'box', at(s, sx, 1.2, sz * .7, .1, 2.5, .1, sz > 0 ? -.25 : .25), 0x3f8f4f);
  part(b, 'box', at(s, 0, 2.4, 0, 3.4, .1, .1), 0x3f8f4f);
  for (const sx of [-.7, .7]) { part(b, 'box', at(s, sx, .5, 0, .45, .05, .2), 0xd8452f); for (const d of [-.18, .18]) part(b, 'box', at(s, sx + d, 1.45, 0, .02, 1.9, .02), 0x8d9596); }
  if (random() < .7) { part(b, 'box', at(m, -3.5, .25, 0, 1.6, .5, 1.6), 0xc29a5b); part(b, 'box', at(m, -3.5, .45, 0, 1.3, .1, 1.3), 0xe3cf98); }
}

// --- Cars ---------------------------------------------------------------------------------
export const CAR_COLORS = [0xf3f3ef, 0x202325, 0xb3b7ba, 0x6a7176, 0xa82f2f, 0x2f5684, 0xe6dfcc, 0x3e6a52, 0x7a4a8c, 0xd9862f];
// A 4.5 m sedan. With white body color it can be tinted per instance (moving traffic).
export function car(b, matrix, body, random) {
  part(b, 'box', at(matrix, 0, .62, 0, 1.82, .62, 4.5), body);
  part(b, 'box', at(matrix, 0, 1.18, -.2, 1.6, .55, 2.3), body);
  part(b, 'box', at(matrix, 0, 1.18, -.2, 1.64, .44, 2.1), 0x6f8fa3, STYLE.GLASS);
  for (const sx of [-.82, .82]) for (const sz of [-1.45, 1.45]) part(b, 'cyl6', at(matrix, sx, .33, sz, .66, .24, .66, 0, 0, Math.PI / 2), 0x1d1f20);
  for (const sx of [-.6, .6]) { part(b, 'box', at(matrix, sx, .72, 2.25, .38, .14, .03), 0xfff4d6, STYLE.LAMP); part(b, 'box', at(matrix, sx, .78, -2.25, .36, .12, .03), 0xc4302b, STYLE.LAMP); }
}
export function carGeometry() {
  const b = new MeshBuilder(1024); car(b, base(0, 0, 0), 0xffffff); return b.geometry();
}
// Builds a BufferGeometry from MeshBuilder arrays (e.g. received from a worker).
export function geometryFromArrays(a) {
  if (!a) return null;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(a.position, 3)); g.setAttribute('normal', new THREE.BufferAttribute(a.normal, 3));
  g.setAttribute('color', new THREE.BufferAttribute(a.color, 3, true)); g.setAttribute('facadeUv', new THREE.BufferAttribute(a.uv, 2)); g.setAttribute('facadeInfo', new THREE.BufferAttribute(a.info, 2));
  g.computeBoundingSphere(); return g;
}
export function arrayBuffers(a) { return a ? [a.position.buffer, a.normal.buffer, a.color.buffer, a.uv.buffer, a.info.buffer] : []; }

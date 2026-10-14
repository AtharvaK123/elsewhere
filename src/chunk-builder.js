import * as THREE from 'three';
import { project, buildingHeight, pointInPolygon } from './geo.js';
import { STYLE, facadeStyle, facadeColor, hash32 } from './facades.js';
import * as P from './props.js';
import { structureLevels, openStructure, canopyRoofRings } from './structures.js';
import { collectMapLabels } from './map-labels.js';
import { walkingRoutes, storefrontIndex, shopType, FOOD_TYPES } from './street-life.js';
import { surfaceType, grassyAreas, natureExclusions, SURFACE } from './nature.js';

const { MeshBuilder, rgb, base } = P;

// Real carriageway widths in meters (both directions). One-way halves of dual carriageways are narrower.
export const ROAD_WIDTH = { motorway: 22, trunk: 18, primary: 14, secondary: 12, tertiary: 10, residential: 8, service: 4.5, track: 3, footway: 2.2, path: 1.8, cycleway: 2.2, pedestrian: 5, steps: 2.4, platform: 3 };
const MAJOR = new Set(['motorway', 'trunk', 'primary', 'secondary', 'tertiary']);
const PATHS = new Set(['footway', 'path', 'cycleway', 'pedestrian', 'steps', 'platform', 'track']);
const LIFT = 6.5;
// Ground layer heights. The renderer uses a logarithmic depth buffer, so a centimeter keeps layers apart.
// Grass tufts per block (instanced; drawn only within 70 m of the player).
const GRASS_BUDGET = 2500;
const SHINGLES = [0x5d6166, 0x4c4f53, 0x6e6c68, 0x5d5a55, 0x575c63, 0x6b5a4c];
const Y = { base: .005, landuse: .012, campus: .015, green: .02, wood: .021, natural: .024, sport: .03, water: .03, service: .055, road: .06, path: .045, marking: .08, plaza: .12, sidewalk: .15 };

const AREAS = {
  park: [0x74b257, Y.green, 'park'], grass: [0x86bb61, Y.green, 'lawn'], village_green: [0x86bb61, Y.green, 'lawn'], recreation_ground: [0x86bb61, Y.green, 'lawn'],
  garden: [0x7ab65a, Y.green + .002, 'garden'], flowerbed: [0x6a4a35, Y.green + .004, 'flowerbed'], meadow: [0x9cc46c, Y.green, 'meadow'], allotments: [0x8f9f50, Y.green, 'allotments'],
  dog_park: [0xa69f6c, Y.green, null], golf_course: [0x7fc65a, Y.green, 'lawn'], zoo: [0x95bd6f, Y.green, 'park'], theme_park: [0xb8bfa6, Y.landuse, null],
  wood: [0x4f7b3d, Y.wood, 'wood'], forest: [0x4f7b3d, Y.wood, 'wood'], scrub: [0x8b9a59, Y.wood, 'scrub'], heath: [0x9a9a62, Y.wood, 'scrub'], orchard: [0x9cc06a, Y.green, 'orchard'], vineyard: [0x93ad5c, Y.green, 'rows'],
  farmland: [0xcbc37c, Y.green, 'rows'], farm: [0xcbc37c, Y.green, 'rows'], wetland: [0x6f906b, Y.natural, 'reeds'],
  sand: [0xe8d8a8, Y.natural, null], beach: [0xedddab, Y.natural, null], rock: [0xa29d95, Y.natural, null], bare_rock: [0xa29d95, Y.natural, null], scree: [0xb1aca2, Y.natural, null], ice: [0xeef4f8, Y.natural, null], glacier: [0xeef4f8, Y.natural, null],
  cemetery: [0x7fa865, Y.green, 'cemetery'], pitch: [0x4f9c49, Y.sport, 'pitch'], playground: [0xc98463, Y.sport, 'playground'], track: [0xb5523c, Y.sport, null], stadium: [0xa3a39a, Y.landuse, null],
  school: [0xbcc5a5, Y.campus, null], kindergarten: [0xbcc5a5, Y.campus, null], college: [0xbcc5a5, Y.campus, null], university: [0xbcc5a5, Y.campus, null], hospital: [0xcbcbc2, Y.campus, null],
  commercial: [0xc6c2b8, Y.landuse, null], retail: [0xc6c2b8, Y.landuse, null], industrial: [0xaaa79e, Y.landuse, null], railway: [0xa39d92, Y.landuse, null], garages: [0xaaa79e, Y.landuse, null], military: [0xa7aa96, Y.landuse, null],
  residential: [0x9db084, Y.landuse, 'yard'],
  parking: [0x707474, Y.service, 'parking'], apron: [0x8d9090, Y.landuse, null], runway: [0x6e7272, Y.landuse, null], taxiway: [0x7a7e7e, Y.landuse, null]
};
const WATER_COLORS = { ocean: 0x2e6c8c, bay: 0x2e6c8c, river: 0x3a7d93, lake: 0x3e88a0, pond: 0x4a8c86, swimming_pool: 0x4cc7dc, reservoir: 0x3e88a0, basin: 0x3e88a0, dock: 0x356f86 };
const WATERWAY_WIDTH = { river: 14, canal: 9, stream: 2.4, ditch: 1.2, drain: 1.2, brook: 1.6 };

// What a place looks like: driving side, sign styles, roof and tree types.
export function regionOf(lat, lon) {
  const us = lon < -50 && lat > 15, uk = lat > 49.8 && lat < 59.5 && lon > -8.5 && lon < 2, jp = lon > 128 && lon < 146 && lat > 30 && lat < 46;
  const au = lon > 110 && lon < 155 && lat < -10, mediterranean = lat > 35 && lat < 46 && lon > -10 && lon < 30;
  return {
    us, uk, jp, americas: lon < -30, leftDrive: uk || jp || au, mediterranean, tropical: Math.abs(lat) < 28, north: Math.abs(lat) > 52,
    brick: lon < -30 || lat > 49.5 ? 1 : .2, post: us ? 'us' : uk ? 'uk' : jp ? 'jp' : 'eu',
    roofs: us ? [0x4c4f53, 0x6b4f3e, 0x3c4651, 0x7a3e31, 0x5d5a55] : mediterranean ? [0xb5562f, 0xc4683a, 0xa84d2d, 0xbf7140] : jp ? [0x3e4a5c, 0x55606e, 0x4a4d52] : [0x4b4f57, 0x8c3d2f, 0x6b3a2e, 0x55595f],
    walls: us ? [0xf1efe8, 0xd9d4c4, 0xbcc9d3, 0xe7d8a9, 0xb8c4a8, 0xd6c3a5, 0xe9e4da] : mediterranean ? [0xf0e3c4, 0xe9c99a, 0xf3efe4, 0xdcb48a, 0xe8d2a6] : [0xe9e5dc, 0xcfc6b5, 0xd8cab2, 0xbfb6a6, 0xe2dccf]
  };
}

// Road segments, intersections, and nearest-road lookups for one tile, in world meters.
export function tileRoadIndex(elements, origin) {
  const grid = new Map(), nodes = new Map(), segments=[], CELL = 40;
  const addSegment = segment => {
    segments.push(segment);
    const [ax, az, bx, bz, half] = segment;
    for (let gx = Math.floor((Math.min(ax, bx) - half) / CELL); gx <= Math.floor((Math.max(ax, bx) + half) / CELL); gx++)
      for (let gz = Math.floor((Math.min(az, bz) - half) / CELL); gz <= Math.floor((Math.max(az, bz) + half) / CELL); gz++) {
        const key = gx + ',' + gz; if (!grid.has(key)) grid.set(key, []); grid.get(key).push(segment);
      }
  };
  for (const element of elements) {
    const kind = element.tags.highway; if (!kind || element.kind !== 0 || element.tags.bridge) continue;
    const car = !PATHS.has(kind), pts = element.geometry.map(p => project(p.lat, p.lon, origin)), half = roadWidth(element.tags) / 2;
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = pts[i], [bx, bz] = pts[i + 1], length = Math.hypot(bx - ax, bz - az); if (!length) continue;
      addSegment([ax, az, bx, bz, half, car, element.id, kind]);
      if (!car || kind === 'service' || kind === 'track') continue;
      for (const [x, z, ux, uz] of [[ax, az, (bx - ax) / length, (bz - az) / length], [bx, bz, (ax - bx) / length, (az - bz) / length]]) {
        const key = Math.round(x * 2) + ',' + Math.round(z * 2);
        if (!nodes.has(key)) nodes.set(key, { x, z, arms: [] });
        const node = nodes.get(key);
        // An arm per distinct direction; split pieces of one road meeting end to end make a straight pair.
        if (!node.arms.some(a => a.ux * ux + a.uz * uz > .96)) node.arms.push({ ux, uz, half, kind, major: MAJOR.has(kind) });
      }
    }
  }
  const near = (x, z) => grid.get(Math.floor(x / CELL) + ',' + Math.floor(z / CELL)) || [];
  const intersections = [...nodes.values()].filter(n => n.arms.length >= 3);
  return {
    segments,
    intersections,
    // True when (x, z) is on a carriageway, optionally ignoring one road.
    onRoad(x, z, margin = 0, ignoreId = null, carsOnly = true) {
      for (const [ax, az, bx, bz, half, car, id] of near(x, z)) {
        if ((carsOnly && !car) || id === ignoreId) continue;
        const dx = bx - ax, dz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
        if (Math.hypot(x - ax - dx * t, z - az - dz * t) < half + margin) return true;
      }
      return false;
    },
    nearest(x, z, maxDistance = 40, carsOnly = true) {
      let best = null;
      for (let gx = Math.floor((x - maxDistance) / CELL); gx <= Math.floor((x + maxDistance) / CELL); gx++) for (let gz = Math.floor((z - maxDistance) / CELL); gz <= Math.floor((z + maxDistance) / CELL); gz++) {
        for (const [ax, az, bx, bz, half, car, id, kind] of grid.get(gx + ',' + gz) || []) {
          if (carsOnly && !car) continue;
          const dx = bx - ax, dz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
          const px = ax + dx * t, pz = az + dz * t, d = Math.hypot(x - px, z - pz);
          if (d < maxDistance && (!best || d < best.distance)) { const l = Math.hypot(dx, dz); best = { x: px, z: pz, distance: d, half, ux: dx / l, uz: dz / l, id, kind }; }
        }
      }
      return best;
    },
    nearIntersection(x, z, radius) { return intersections.some(n => Math.hypot(n.x - x, n.z - z) < radius); }
  };
}

export function roadWidth(tags) {
  const measured=parseFloat(tags.width);if(measured>0)return Math.min(60,/(?:ft|feet|')/i.test(tags.width)?measured*.3048:measured);
  const lanes=parseFloat(tags.lanes);if(lanes>0&&!PATHS.has(tags.highway))return Math.min(60,lanes*3.1+.8);
  const width = ROAD_WIDTH[tags.highway] ?? 8;
  return tags.oneway && ['motorway', 'trunk', 'primary'].includes(tags.highway) ? width * .55 : width;
}

function ringArea(pts) { let a = 0; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) a += (pts[j][0] + pts[i][0]) * (pts[j][1] - pts[i][1]); return a / 2; }
function bounds(pts) { let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity; for (const [x, z] of pts) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z); } return { minX, maxX, minZ, maxZ }; }
function open(pts) { return pts.length > 1 && pts[0][0] === pts.at(-1)[0] && pts[0][1] === pts.at(-1)[1] ? pts.slice(0, -1) : pts; }
// Minimum-area bounding rectangle: center, long-axis unit vector, half sizes.
function orientedBox(pts) {
  let best = null;
  for (let i = 0; i < pts.length; i++) {
    const [ax, az] = pts[i], [bx, bz] = pts[(i + 1) % pts.length], l = Math.hypot(bx - ax, bz - az); if (l < .5) continue;
    const ux = (bx - ax) / l, uz = (bz - az) / l;
    let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
    for (const [x, z] of pts) { const u = x * ux + z * uz, v = -x * uz + z * ux; minU = Math.min(minU, u); maxU = Math.max(maxU, u); minV = Math.min(minV, v); maxV = Math.max(maxV, v); }
    const area = (maxU - minU) * (maxV - minV);
    if (!best || area < best.area) best = { area, ux, uz, minU, maxU, minV, maxV };
  }
  if (!best) return null;
  let { ux, uz, minU, maxU, minV, maxV } = best;
  if (maxV - minV > maxU - minU) { [ux, uz] = [-uz, ux]; [minU, maxU, minV, maxV] = [minV, maxV, -maxU, -minU]; }
  const cu = (minU + maxU) / 2, cv = (minV + maxV) / 2;
  return { area: best.area, cx: cu * ux - cv * uz, cz: cu * uz + cv * ux, ux, uz, halfLong: (maxU - minU) / 2, halfShort: (maxV - minV) / 2 };
}
function randomInPolygon(pts, holes, box, random, tries = 12) {
  for (let i = 0; i < tries; i++) {
    const x = box.minX + random() * (box.maxX - box.minX), z = box.minZ + random() * (box.maxZ - box.minZ);
    if (pointInPolygon(x, z, pts) && !holes.some(h => pointInPolygon(x, z, h))) return [x, z];
  }
  return null;
}

// Continuous miter joins keep bends closed without stacking coplanar discs and strips.
function ribbon(b, pts, width, y, color, { down = false } = {}) {
  const h = width / 2, c = rgb(color);
  const offsets = pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], q = pts[Math.min(pts.length - 1, i + 1)];
    const l0 = Math.hypot(p[0] - a[0], p[1] - a[1]), l1 = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const n0 = l0 ? [-(p[1] - a[1]) / l0, (p[0] - a[0]) / l0] : [-(q[1] - p[1]) / (l1 || 1), (q[0] - p[0]) / (l1 || 1)];
    const n1 = l1 ? [-(q[1] - p[1]) / l1, (q[0] - p[0]) / l1] : n0;
    const nx = n0[0] + n1[0], nz = n0[1] + n1[1], l = Math.hypot(nx, nz);
    if (l < .01) return n0.map(n => n * h);
    const length = Math.min(h * 2, h / Math.max(.1, (nx * n1[0] + nz * n1[1]) / l));
    return [nx / l * length, nz / l * length];
  });
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i], [bx, bz] = pts[i + 1], length = Math.hypot(bx - ax, bz - az); if (!length) continue;
    const [dx, dz] = offsets[i], [ex, ez] = offsets[i + 1];
    const quad = [[ax + dx, y, az + dz], [bx + ex, y, bz + ez], [bx - ex, y, bz - ez], [ax - dx, y, az - dz]];
    b.quad(...quad, [0, 1, 0], c, STYLE.PLAIN, 0, [ax, az], [bx, bz], [bx, bz], [ax, az]);
    if (down) b.quad(...quad, [0, -1, 0], c);
  }
}
// Visits points every `spacing` meters along a polyline: (x, z, ux, uz, distanceAlong).
function along(pts, spacing, offset, visit) {
  let carried = offset;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i], [bx, bz] = pts[i + 1], length = Math.hypot(bx - ax, bz - az); if (!length) continue;
    const ux = (bx - ax) / length, uz = (bz - az) / length;
    for (let d = carried; d < length; d += spacing) visit(ax + ux * d, az + uz * d, ux, uz);
    carried = (carried - length) % spacing; if (carried < 0) carried += spacing;
  }
}
function box(b, x, y, z, w, h, d, yaw, color, style = STYLE.PLAIN) {
  const m = base(x, y, z, yaw); m.multiply(new THREE.Matrix4().makeScale(w, h, d)); b.shape('box', m, rgb(color), style);
}

/**
 * Builds one chunk. A generator so the caller can spread the work across frames.
 * input: { elements, roads (tileRoadIndex), origin, rect: {minX,maxX,minZ,maxZ}, region, seed, collides(x,z), landmarks }
 */
export function* buildChunk(input) {
  const { elements, roads, origin, rect, region, landmarks = [] } = input;
  let seed = Math.floor(input.seed * 2147483646) + 1;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const solid = new MeshBuilder(16384), detail = new MeshBuilder(16384), ground = new MeshBuilder(8192), water = new MeshBuilder(1024), glow = [];
  const colliders = [], carRoads = [], projected = new Map();
  const structures={canopies:0,solar:0,garages:0,glass:0,parkedCars:0,storefronts:0};
  const shopSigns = [], pedestrianRoutes = [], streetObstacles = [];
  const grass = [], nature={grassTufts:0,rocks:0,yardTrees:0,shrubs:0};
  const geo = element => {
    if (!projected.has(element)) projected.set(element, { pts: open(element.geometry.map(p => project(p.lat, p.lon, origin))), holes: (element.holes || []).map(h => open(h.map(p => project(p.lat, p.lon, origin)))) });
    return projected.get(element);
  };
  const inLocalBuilding = (x, z) => colliders.some(c => c.building && c.minY<1.8 && x >= c.minX && x <= c.maxX && z >= c.minZ && z <= c.maxZ && pointInPolygon(x, z, c.pts) && !c.holes?.some(h=>pointInPolygon(x,z,h)));
  const blocked = (x, z) => inLocalBuilding(x, z) || (input.collides ? input.collides(x,z) : buildings.some(e=>structureLevels(e.tags).base<1.8&&pointInPolygon(x,z,geo(e).pts)&&!geo(e).holes.some(h=>pointInPolygon(x,z,h))));
  // Parked cars claim their spot so stalls from crossing aisles never overlap.
  const spots = new Map();
  const claim = (x, z, radius = 2.4) => {
    const gx = Math.floor(x / 5), gz = Math.floor(z / 5);
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (const [px, pz] of spots.get((gx + i) + ',' + (gz + j)) || []) if (Math.hypot(px - x, pz - z) < radius) return false;
    const key = gx + ',' + gz; if (!spots.has(key)) spots.set(key, []); spots.get(key).push([x, z]); return true;
  };
  const cleared = pts => landmarks.some(l => l.clear && pts.some(([x, z]) => Math.hypot(x - l.at[0], z - l.at[1]) < l.clear));

  // How built-up this chunk is decides urban sidewalks vs. suburban lawns.
  const buildings = elements.filter(e => e.tags.building && e.kind === 1);
  const coveredParking=(x,z)=>input.coveredParking?.(x,z)||buildings.some(e=>(e.tags.parkingCanopy||e.tags.building==='carport')&&pointInPolygon(x,z,geo(e).pts)&&!geo(e).holes.some(h=>pointInPolygon(x,z,h)));
  let footprint = 0, heightSum = 0;
  for (const e of buildings) { if(openStructure(e.tags))continue;const a = Math.abs(ringArea(geo(e).pts)); footprint += a; heightSum += buildingHeight(e.tags) * a; }
  const chunkArea = Math.max(1, (rect.maxX - rect.minX) * (rect.maxZ - rect.minZ));
  const urban = footprint / chunkArea > .3 || heightSum / Math.max(1, footprint) > 20;
  const sidewalk = urban ? 3.2 : 1.8;
  const excludesNature=input.excludesNature||natureExclusions(elements,origin),grassCells=new Set();
  const [x0, x1, z0, z1] = [rect.minX, rect.maxX, rect.minZ, rect.maxZ];
  // Unknown ground in a dense centre gets one continuous neutral tone. Elsewhere, unmapped
  // ground between streets and buildings is overwhelmingly lawn, so it gets a grass surface.
  ground.polygon([[x0, z0], [x1, z0], [x1, z1], [x0, z1]], [], Y.base, rgb(urban ? 0xbabdaf : 0x97ad73), urban ? 9 : SURFACE.GRASS);
  yield;

  // --- Areas: parks, gardens, water, pitches... --------------------------------------------
  for (const e of elements) {
    if (e.kind !== 1 || e.tags.building) continue;
    const { pts, holes } = geo(e); if (pts.length < 3) continue;
    if (e.tags.natural === 'water') {
      const color = WATER_COLORS[e.tags.water] ?? 0x3e88a0;
      water.polygon(pts, holes, Y.water, rgb(color));
      if (e.tags.water === 'swimming_pool') ribbon(ground, [...pts, pts[0]], .6, Y.water + .004, 0xe9e4d8);
      continue;
    }
    if (e.tags.highway && PATHS.has(e.tags.highway)) { ground.polygon(pts, holes, Y.plaza, rgb(0xd9d1c1)); plazaDetails(pts, holes); continue; }
    if (e.tags.man_made === 'pier') { ground.polygon(pts, holes, .35, rgb(0x8a6a4c)); continue; }
    const style = AREAS[e.tags.area]; if (!style) continue;
    const [color, y, look] = style;
    ground.polygon(pts, holes, y, rgb(color), e.tags.area==='residential'&&urban?9:surfaceType(e.tags.area));
    if((grassyAreas.has(e.tags.area)||look==='wood'||look==='scrub')&&!(urban&&e.tags.area==='residential'))natureDetails(e,pts,holes,y);
    if (look) areaDetails(look, pts, holes, y);
    yield;
  }

  function plazaDetails(pts, holes) {
    const bb = bounds(pts), area = (bb.maxX - bb.minX) * (bb.maxZ - bb.minZ);
    for (let i = 0; i < Math.min(12, area / 400); i++) {
      const p = randomInPolygon(pts, holes, bb, random); if (!p || blocked(...p)) continue;
      const pick = random();
      if (pick < .45) P.bench(detail, p[0], p[1], random() * 6.28);
      else if (pick < .75) { box_planter(p[0], p[1]); }
      else P.tree(solid, p[0], p[1], 7 + random() * 4, random, { y: Y.plaza });
    }
  }
  function box_planter(x, z) {
    box(detail, x, .4, z, 1.6, .8, 1.6, 0, 0x9c948a);
    P.bush(detail, x, z, 1.1, random); for (let i = 0; i < 3; i++) P.flowers(detail, x + (random() - .5) * 1.1, z + (random() - .5) * 1.1, random);
  }
  function areaDetails(look, pts, holes, y) {
    const bb = bounds(pts), area = Math.abs(ringArea(pts)), scatter = (count, place) => { for (let i = 0; i < count; i++) { const p = randomInPolygon(pts, holes, bb, random); if (p && !blocked(...p) && !roads.onRoad(p[0], p[1], .5, null, false)) place(p[0], p[1]); } };
    const treeKind = () => region.tropical && random() < .5 ? 'palm' : region.north && random() < .5 ? 'conifer' : random() < .12 ? 'conifer' : 'broadleaf';
    if (look === 'park') { scatter(Math.min(90, area / 260), (x, z) => P.tree(solid, x, z, 8 + random() * 9, random, { kind: treeKind() })); scatter(Math.min(20, area / 1500), (x, z) => P.bench(detail, x, z, random() * 6.28)); scatter(Math.min(40, area / 500), (x, z) => P.bush(detail, x, z, 1 + random(), random)); edgeFlowers(pts, .04); }
    else if (look === 'lawn') scatter(Math.min(40, area / 900), (x, z) => P.tree(solid, x, z, 7 + random() * 8, random, { kind: treeKind() }));
    else if (look === 'garden') { scatter(Math.min(6, area / 120), (x, z) => P.bush(detail, x, z, .8 + random() * .8, random)); scatter(Math.min(4, area / 250), (x, z) => P.tree(solid, x, z, 5 + random() * 6, random, { kind: treeKind() })); edgeFlowers(pts, .35); }
    else if (look === 'flowerbed') scatter(Math.min(300, area * 2.2), (x, z) => P.flowers(detail, x, z, random));
    else if (look === 'meadow') scatter(Math.min(120, area / 40), (x, z) => P.flowers(detail, x, z, random, [0xf6d32d, 0xffffff, 0xb05ad4, 0xe23c5b]));
    else if (look === 'wood') scatter(Math.min(260, area / 55), (x, z) => P.tree(solid, x, z, 10 + random() * 12, random, { kind: region.north || random() < .3 ? 'conifer' : 'broadleaf' }));
    else if (look === 'scrub') scatter(Math.min(120, area / 35), (x, z) => P.bush(detail, x, z, .7 + random() * 1.2, random, 0x6f8a45));
    else if (look === 'orchard') scatter(Math.min(150, area / 40), (x, z) => P.tree(solid, x, z, 4 + random() * 2, random));
    else if (look === 'allotments' || look === 'rows') scatter(Math.min(160, area / 30), (x, z) => P.bush(detail, x, z, .5, random, look === 'rows' ? 0x8da14b : 0x5f9a3e));
    else if (look === 'reeds') scatter(Math.min(120, area / 30), (x, z) => P.bush(detail, x, z, .9, random, 0x7c8f4e));
    else if (look === 'cemetery') scatter(Math.min(220, area / 18), (x, z) => box(detail, x, .45, z, .6, .9, .15, random() * .2, [0x9a9890, 0xb3b0a8, 0x7f7d78][Math.floor(random() * 3)]));
    else if (look === 'playground') { const c = orientedBox(pts); if (c) P.playground(detail, c.cx, c.cz, Math.atan2(c.ux, c.uz), random); }
    else if (look === 'pitch') pitch(pts, y);
    else if (look === 'parking') { const c = orientedBox(pts); if (c) for (let u = -c.halfLong + 3; u < c.halfLong - 3; u += 2.6) for (const v of [-c.halfShort + 2.6, c.halfShort - 2.6]) if (random() < .55 && c.halfShort > 5) { const x = c.cx + c.ux * u - c.uz * v, z = c.cz + c.uz * u + c.ux * v; if (pointInPolygon(x,z,pts)&&!holes.some(h=>pointInPolygon(x,z,h))&&!roads.onRoad(x,z,1.5)&&!coveredParking(x,z)&&!blocked(x, z) && claim(x, z)) P.car(detail, base(x, Y.service, z, Math.atan2(c.ux, c.uz) + Math.PI / 2), P.CAR_COLORS[Math.floor(random() * P.CAR_COLORS.length)]); } }
  }
  function natureDetails(e,pts,holes,y){
    const bb=bounds(pts),area=Math.max(0,Math.abs(ringArea(pts))-holes.reduce((sum,h)=>sum+Math.abs(ringArea(h)),0));
    const count=Math.min(GRASS_BUDGET-nature.grassTufts,Math.ceil(area/7)),wild=['meadow','wood','forest','scrub','park'].includes(e.tags.area);
    for(let i=0;i<count;i++){
      const p=randomInPolygon(pts,holes,bb,random);if(!p)continue;const [x,z]=p;
      if(blocked(x,z)||excludesNature(x,z)||roads.onRoad(x,z,.35,null,false))continue;
      const near=roads.nearest(x,z,14);if(near&&near.distance<near.half+(near.kind==='service'?.8:sidewalk+.25))continue;
      const cell=Math.floor(x*1.2)+','+Math.floor(z*1.2);if(grassCells.has(cell))continue;grassCells.add(cell);
      grass.push(x,y+.012,z,(wild?1.1:.6)+random()*.55,random()*Math.PI*2,random());nature.grassTufts++;
      if(wild&&random()<.017)P.flowers(detail,x+.25,z+.2,random,[0xf1deb0,0xe7edf0,0xa68bc1]);
      if(wild&&random()<.003){P.rock(detail,x,z,y,random);nature.rocks++;}
    }
  }
  function edgeFlowers(pts, chance) {
    along([...pts, pts[0]], 1.2, .5, (x, z, ux, uz) => { if (random() < chance) { const ix = x - uz * .6, iz = z + ux * .6; if (!blocked(ix, iz)) P.flowers(detail, ix, iz, random); } });
  }
  function pitch(pts, y) {
    const c = orientedBox(pts); if (!c || c.halfShort < 4) return;
    const court = c.halfLong < 16, line = (u1, v1, u2, v2) => ribbon(ground, [[c.cx + c.ux * u1 - c.uz * v1, c.cz + c.uz * u1 + c.ux * v1], [c.cx + c.ux * u2 - c.uz * v2, c.cz + c.uz * u2 + c.ux * v2]], .12, y + .004, 0xf4f4ee);
    if (court) ground.polygon([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [c.cx + c.ux * u * (c.halfLong - .5) - c.uz * v * (c.halfShort - .5), c.cz + c.uz * u * (c.halfLong - .5) + c.ux * v * (c.halfShort - .5)]), [], y + .002, rgb(random() < .5 ? 0x3d7a9e : 0xc4693d));
    const L = c.halfLong - 1, W = c.halfShort - 1;
    line(-L, -W, L, -W); line(-L, W, L, W); line(-L, -W, -L, W); line(L, -W, L, W); line(0, -W, 0, W);
    if (!court) { for (let i = 0; i < 20; i++) { const a1 = i / 20 * Math.PI * 2, a2 = (i + 1) / 20 * Math.PI * 2, r = Math.min(9.15, W * .5); line(Math.cos(a1) * r, Math.sin(a1) * r, Math.cos(a2) * r, Math.sin(a2) * r); }
      for (const s of [-1, 1]) P.goal(detail, c.cx + c.ux * L * s, c.cz + c.uz * L * s, Math.atan2(-c.ux, -c.uz), Math.min(7.3, W)); }
  }

  // --- Roads, paths, rail, waterways ------------------------------------------------------
  for (const e of elements) {
    if (e.kind !== 0) continue;
    const { pts } = geo(e); if (pts.length < 2) continue;
    const tags = e.tags;
    if (tags.waterway) { ribbon(water, pts, WATERWAY_WIDTH[tags.waterway] ?? 3, Y.water + .002, tags.waterway === 'stream' ? 0x4a8c95 : 0x3a7d93); continue; }
    if (tags.man_made === 'pier') { ribbon(ground, pts, 4, .35, 0x8a6a4c); continue; }
    if (tags.railway) { if (!['subway', 'monorail', 'funicular'].includes(tags.railway)) rail(pts); continue; }
    if (!tags.highway) continue;
    road(e, pts, tags); yield;
  }

  function rail(pts) {
    ribbon(ground, pts, 3.4, Y.road - .01, 0x857b6f);
    along(pts, .65, .3, (x, z, ux, uz) => box(detail, x, Y.road + .06, z, 2.6, .14, .24, Math.atan2(ux, uz), 0x6a5443));
    for (const side of [-.72, .72]) ribbon(solid, pts.map(([x, z], i) => { const [nx, nz] = pts[Math.min(i + 1, pts.length - 1)], [px, pz] = pts[Math.max(i - 1, 0)], l = Math.hypot(nx - px, nz - pz) || 1; return [x - (nz - pz) / l * side, z + (nx - px) / l * side]; }), .08, Y.road + .16, 0x9aa0a3);
  }
  function road(e, pts, tags) {
    const kind = tags.highway, path = PATHS.has(kind), lift = tags.bridge ? LIFT : 0, width = roadWidth(tags), half = width / 2;
    const unpaved = tags.surface && /unpaved|dirt|gravel|ground|grass|sand|compacted/.test(tags.surface);
    if (path) {
      const color = unpaved || kind === 'path' || kind === 'track' ? 0xb79f7a : kind === 'cycleway' ? (region.americas ? 0x5e8f63 : 0xa5594b) : 0xd3cab6;
      ribbon(ground, pts, width, Y.path + lift, color, { down: !!lift });
      if (kind === 'steps') along(pts, .32, 0, (x, z, ux, uz) => box(detail, x, Y.path + .05 + lift, z, width, .1, .05, Math.atan2(ux, uz), 0xb5ad9b));
      if (lift) bridgeSides(pts, width);
      return;
    }
    const service = kind === 'service' || kind === 'track', highway = kind === 'motorway' || kind === 'trunk';
    ribbon(ground, pts, width, (service ? Y.service : Y.road) + lift, unpaved ? 0x9d8a6a : service ? 0x6d7271 : 0x55595b, { down: !!lift });
    if (lift) { bridgeSides(pts, width); return; }
    let length = 0; const cumulative = [0];
    for (let i = 1; i < pts.length; i++) { length += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); cumulative.push(length); }
    if (!service) carRoads.push({ pts, cumulative, length, width, major: MAJOR.has(kind), oneway: !!tags.oneway, y: Y.road, left: region.leftDrive });
    if (tags.service === 'parking_aisle') { parkingStalls(e, pts, half); return; }
    if (service) return;
    // Lane markings: double yellow center lines in the Americas, white elsewhere; dashed on smaller roads.
    if (!tags.oneway && MAJOR.has(kind) && !highway) for (const side of [-.15, .15]) ribbon(ground, offsetLine(pts, side), .12, Y.marking, region.americas ? 0xe6b83a : 0xf0eee4);
    else along(pts, 9, 3, (x, z, ux, uz) => { if (!roads.nearIntersection(x, z, half + 8)) box(ground, x, Y.marking, z, .13, .01, 3, Math.atan2(ux, uz), region.americas && !tags.oneway ? 0xe6b83a : 0xf0eee4); });
    if (highway) { for (const side of [-half + .4, half - .4]) ribbon(ground, offsetLine(pts, side), .15, Y.marking, 0xf0eee4); return; }
    // Sidewalks with curbs, cut wherever another street crosses.
    for (const side of [-1, 1]) along(pts, 3, 1.5, (x, z, ux, uz) => {
      const mid = half + sidewalk / 2, cx = x - uz * mid * side, cz = z + ux * mid * side;
      if (roads.onRoad(cx, cz, .3, e.id)) return;
      const nx = -uz * side, nz = ux * side, a = half, o = half + sidewalk, l = 1.5;
      const corners = [[x + nx * a - ux * l, z + nz * a - uz * l], [x + nx * a + ux * l, z + nz * a + uz * l], [x + nx * o + ux * l, z + nz * o + uz * l], [x + nx * o - ux * l, z + nz * o - uz * l]];
      ground.quad(...corners.map(([px, pz]) => [px, Y.sidewalk, pz]), [0, 1, 0], rgb(urban ? 0xc9c5ba : 0xc4c1b8));
      const curb = rgb(0xdedad0), [c0, c1] = corners, [, , c2, c3] = corners;
      ground.quad([c0[0], Y.road, c0[1]], [c1[0], Y.road, c1[1]], [c1[0], Y.sidewalk, c1[1]], [c0[0], Y.sidewalk, c0[1]], [-nx, 0, -nz], curb);
      ground.quad([c3[0], 0, c3[1]], [c2[0], 0, c2[1]], [c2[0], Y.sidewalk, c2[1]], [c3[0], Y.sidewalk, c3[1]], [nx, 0, nz], curb);
      colliders.push({ pts: corners, holes: [], ...bounds(corners), minY: 0, maxY: Y.sidewalk, platform: true });
    });
    // Street furniture along the curb.
    const furnish = kind !== 'motorway' && kind !== 'trunk';
    if (furnish) along(pts, urban ? 30 : 42, 10 + random() * 8, (x, z, ux, uz) => {
      const side = random() < .5 ? -1 : 1, o = half + .45, px = x - uz * o * side, pz = z + ux * o * side;
      if (roads.onRoad(px, pz, .2) || blocked(px, pz)) return;
      P.streetLight(solid, px, pz, Math.atan2(uz * side, -ux * side), { style: region.mediterranean && urban ? 'classic' : 'modern' });
      glow.push([px + uz * side * 1.65, pz - ux * side * 1.65]);
    });
    if (furnish && kind !== 'primary') along(pts, urban ? 9 : 13, 4 + random() * 4, (x, z, ux, uz) => {
      for (const side of [-1, 1]) {
        if (random() < (urban ? .45 : .5)) continue;
        const o = urban ? half + sidewalk * .6 : half + sidewalk + 2.5, px = x - uz * o * side, pz = z + ux * o * side;
        if (roads.onRoad(px, pz, 1.5) || blocked(px, pz) || roads.nearIntersection(px, pz, half + 6)) continue;
        if (urban) ground.polygon([[px - .7, pz - .7], [px + .7, pz - .7], [px + .7, pz + .7], [px - .7, pz + .7]], [], Y.sidewalk + .004, rgb(0x5c4635));
        P.tree(solid, px, pz, (urban ? 7 : 8) + random() * 5, random, { y: urban ? Y.sidewalk : 0, kind: region.tropical && random() < .4 ? 'palm' : 'broadleaf' });
      }
    });
    if (region.us && furnish) along(pts, 80, 20 + random() * 30, (x, z, ux, uz) => {
      const side = random() < .5 ? -1 : 1, o = half + .6, px = x - uz * o * side, pz = z + ux * o * side;
      if (!roads.onRoad(px, pz, .2) && !blocked(px, pz)) P.hydrant(detail, px, pz);
    });
    // Parked cars along the curb on residential streets.
    if (['residential', 'tertiary', 'secondary'].includes(kind) && width >= 8) along(pts, 6.3, 4, (x, z, ux, uz) => {
      for (const side of [-1, 1]) {
        if (random() > (urban ? .55 : .3)) continue;
        const o = half - 1.15, px = x - uz * o * side, pz = z + ux * o * side;
        if (roads.nearIntersection(px, pz, half + 9) || roads.onRoad(px, pz, .3, e.id) || coveredParking(px,pz) || blocked(px, pz) || !claim(px, pz, 4)) continue;
        P.car(detail, base(px, Y.road, pz, Math.atan2(ux, uz) + (side > 0 === !region.leftDrive ? 0 : Math.PI)), P.CAR_COLORS[Math.floor(random() * P.CAR_COLORS.length)]);
      }
    });
  }
  // Parking lots: 2.6 m stalls, 5 m deep, on both sides of each aisle, with painted lines and parked cars.
  function parkingStalls(e, pts, half) {
    ribbon(ground, pts, half * 2 + 10, Y.service - .003, 0x6d7271);
    along(pts, 2.6, 1.3, (x, z, ux, uz) => {
      for (const side of [-1, 1]) {
        const o = half + 2.5, px = x - uz * o * side, pz = z + ux * o * side;
        if (coveredParking(px,pz)||blocked(px, pz) || roads.onRoad(px, pz, .5, e.id, false)) continue;
        const lx = px + ux * 1.3, lz = pz + uz * 1.3;
        box(ground, lx, Y.marking - .01, lz, .1, .01, 5, Math.atan2(-uz, ux) + Math.PI / 2, 0xf0eee4);
        if (random() < .62 && claim(px, pz)) P.car(detail, base(px, Y.service, pz, Math.atan2(ux, uz) + Math.PI / 2 * side + (random() < .5 ? 0 : Math.PI)), P.CAR_COLORS[Math.floor(random() * P.CAR_COLORS.length)]);
      }
    });
  }
  function bridgeSides(pts, width) {
    for (const side of [-1, 1]) ribbon(solid, offsetLine(pts, side * (width / 2 + .15)), .3, LIFT + .6, 0x8e918d);
  }
  function offsetLine(pts, offset) {
    return pts.map(([x, z], i) => { const [nx, nz] = pts[Math.min(i + 1, pts.length - 1)], [px, pz] = pts[Math.max(i - 1, 0)], l = Math.hypot(nx - px, nz - pz) || 1; return [x - (nz - pz) / l * offset, z + (nx - px) / l * offset]; });
  }

  // --- Intersections: crosswalks, signals, stop signs -----------------------------------------
  for (const node of roads.intersections) {
    if (node.x < x0 || node.x >= x1 || node.z < z0 || node.z >= z1) continue;
    const signals = node.arms.some(a => a.major && a.kind !== 'motorway') && node.arms.length >= 3;
    const widest = Math.max(...node.arms.map(a => a.half));
    node.arms.forEach((arm, index) => {
      if (arm.kind === 'motorway' || arm.kind === 'trunk') return;
      const d = widest + 2.2, cx = node.x + arm.ux * d, cz = node.z + arm.uz * d, yaw = Math.atan2(arm.ux, arm.uz);
      if (urban || signals) for (let s = -arm.half + .5; s < arm.half - .2; s += 1) box(ground, cx - arm.uz * s, Y.marking, cz + arm.ux * s, .5, .01, 3, yaw, 0xf2f0e6);
      const side = region.leftDrive ? -1 : 1, corner = arm.half + 1.1, px = node.x + arm.ux * (d + 2.2) + arm.uz * corner * side, pz = node.z + arm.uz * (d + 2.2) - arm.ux * corner * side;
      if (blocked(px, pz) || roads.onRoad(px, pz, .2)) return;
      if (signals) P.trafficSignal(detail, px, pz, yaw, index % 2, hash32(Math.round(node.x) * 31 + Math.round(node.z)));
      else if (region.us && !urban) P.stopSign(detail, px, pz, yaw);
    });
  }
  yield;

  // --- Buildings ------------------------------------------------------------------------------
  let count = 0;
  for (const e of buildings) {
    const { pts, holes } = geo(e); if (pts.length < 3 || cleared(pts)) continue;
    building(e, pts, holes); count++;
    if (count % 6 === 0) yield;
  }

  function building(e, pts, holes) {
    const tags = e.tags, levels=structureLevels(tags),height=levels.top,minY=levels.base;
    if(levels.open){
      const obb=orientedBox(pts);
      const roofs=levels.solar&&tags.parkingCanopy&&obb?.halfShort>9?canopyRoofRings(pts,holes,roads.segments):[[pts,...holes]];
      for(const [outer,...inner]of roofs)canopy(e,open(outer),inner.map(open),levels);return;
    }
    if(levels.kind==='garage'){parkingGarage(e,pts,holes,levels);return;}
    const area = Math.abs(ringArea(pts)), seed = hash32(e.id), b = bounds(pts);
    const house = !urban && minY === 0 && area < 280 && height <= 12, obb = house ? orientedBox(pts) : null;
    // An unspecified roof is extruded to its mapped height. Guessing a bounding-box gable
    // distorted L-shaped houses and changed the height of measured buildings.
    const pitched = house && tags['roof:shape'] === 'gabled' && obb && !holes.length && area / obb.area > .97 && obb.halfShort > 2.2;
    const glass=levels.kind==='greenhouse'||/glass|glazing|curtain_wall/i.test(tags['building:material']||tags['facade:material']||tags.material||'');
    const material=tags['building:material']||tags['facade:material']||tags.material||'';
    const style = glass ? STYLE.OFFICE : /brick/i.test(material)?STYLE.BRICK:/stone|concrete|plaster/i.test(material)?STYLE.STONE:house ? STYLE.HOUSE : facadeStyle(height, seed, region.brick);
    if(glass)structures.glass++;
    let color;
    if (tags['building:colour']||tags.colour) { const c = rgb(tags['building:colour']||tags.colour); color = c; }
    else if(glass)color=rgb(0x779fae);
    else if (house) color = rgb(region.walls[Math.floor(hash32(e.id * 7) * region.walls.length)]);
    else { const c = facadeColor(style, hash32(e.id * 31 + 7)); color = [Math.round(Math.min(1, c.r) * 255), Math.round(Math.min(1, c.g) * 255), Math.round(Math.min(1, c.b) * 255)]; }
    const rise = pitched ? Math.min(parseFloat(tags['roof:height']) || obb.halfShort * .6, height * .35) : 0;
    const wallTop = height - rise;
    for (const ring of [pts, ...holes]) walls(ring, minY, wallTop, color, style, seed, ring !== pts, e);
    if (pitched) gableRoof(obb, wallTop, color, seed, rise);
    else {
      // Surveyed fill-in homes are seen from above as shingle roofs, not facade-coloured slabs.
      // Most are grey asphalt; a footprint carries no colour, so stay with the common case.
      const roof = tags['roof:colour'] ? rgb(tags['roof:colour']) : tags.fillIn && !urban && /house|apartments|residential/.test(tags.building) ? rgb(SHINGLES[Math.floor(seed * 97) % SHINGLES.length]) : null;
      for (const [outer, ...inner] of input.roofPolygons?.(e, pts, holes, wallTop) || [[pts, ...holes]]) solid.polygon(outer, inner, wallTop, roof || color, roof ? STYLE.PLAIN : style, seed);
    }
    if (minY > 0) solid.polygon(pts, holes, minY, color, style, seed, false);
    colliders.push({ pts, holes, ...b, minY, maxY: wallTop, building: true });
    if (house) houseDetails(pts, obb, wallTop, seed);
    // Do not add invented rooftop towers or equipment above a measured skyline.
  }
  function slab(e,pts,holes,bottom,top,color,style=STYLE.PLAIN){
    for(const ring of [pts,...holes])walls(ring,bottom,top,rgb(color),STYLE.PLAIN,hash32(e.id),ring!==pts,null);
    const start=solid.count;solid.polygon(pts,holes,top,rgb(color),style,hash32(e.id));
    const obb=orientedBox(pts);
    if(obb)for(let i=start;i<solid.count;i++){const x=solid.position[i*3]-obb.cx,z=solid.position[i*3+2]-obb.cz;solid.uv[i*2]=x*obb.ux+z*obb.uz;solid.uv[i*2+1]=-x*obb.uz+z*obb.ux;}
    solid.polygon(pts,holes,bottom,rgb(0xb0b9bc),STYLE.PLAIN,0,false);
    colliders.push({pts,holes,...bounds(pts),minY:bottom,maxY:top,building:true});
  }
  function support(x,z,top,width=.23){
    box(solid,x,top/2,z,width,top,width,0,0x87979e);
    const pts=[[x-width/2,z-width/2],[x+width/2,z-width/2],[x+width/2,z+width/2],[x-width/2,z+width/2]];
    colliders.push({pts,holes:[],...bounds(pts),minY:0,maxY:top,building:true});
  }
  function canopy(e,pts,holes,levels){
    const obb=orientedBox(pts),{top,base:bottom,solar}=levels;if(!obb)return;
    structures.canopies++;if(solar)structures.solar++;
    slab(e,pts,holes,bottom,top,solar?0x245c86:0xa5aeb0,solar?STYLE.SOLAR:STYLE.PLAIN);
    if(e.tags.rooftop)return;
    const inside=(x,z,inset=0)=>[[inset,0],[-inset,0],[0,inset],[0,-inset]].every(([dx,dz])=>pointInPolygon(x+dx,z+dz,pts)&&!holes.some(h=>pointInPolygon(x+dx,z+dz,h)));
    const at=(u,v)=>[obb.cx+obb.ux*u-obb.uz*v,obb.cz+obb.uz*u+obb.ux*v];
    const rows=Math.max(1,Math.ceil(obb.halfShort*2/10)),cols=Math.max(1,Math.ceil(obb.halfLong*2/7));
    for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){
      const [x,z]=at(-obb.halfLong+(i+.5)*obb.halfLong*2/cols,-obb.halfShort+(j+.5)*obb.halfShort*2/rows);
      if(inside(x,z,.3)&&!roads.onRoad(x,z,.3)){support(x,z,bottom);claim(x,z,.3);}
    }
    if(e.tags.parkingCanopy||e.tags.building==='carport'){
      ground.polygon(pts,holes,Y.service,rgb(0x727c82));
      // Stalls and occupancy are illustrative, deterministic, and confined to the mapped roof.
      for(let u=-obb.halfLong+1.5;u<obb.halfLong-1.4;u+=2.8)for(let v=-obb.halfShort+2.8;v<obb.halfShort-2.3;v+=6){
        const [x,z]=at(u,v);if(!inside(x,z,2.25)||roads.onRoad(x,z,1.4)||!claim(x,z,2.6))continue;
        const yaw=Math.atan2(-obb.uz,obb.ux);
        box(ground,x+obb.ux*1.35,Y.marking,z+obb.uz*1.35,.08,.012,4.8,yaw,0xe8e5d7);
        if(random()<.62){P.car(detail,base(x,Y.service,z,yaw),P.CAR_COLORS[Math.floor(random()*P.CAR_COLORS.length)]);structures.parkedCars++;}
      }
    }
  }
  function parkingGarage(e,pts,holes,levels){
    structures.garages++;const obb=orientedBox(pts);if(!obb)return;
    const floors=Math.max(1,Math.min(16,parseInt(e.tags['building:levels'])||Math.round(levels.top/3.2))),rise=levels.top/floors;
    for(let i=1;i<=floors;i++)slab(e,pts,holes,i*rise-.24,i*rise,0xc0c5c2);
    for(let u=-obb.halfLong+1;u<obb.halfLong;u+=7)for(let v=-obb.halfShort+1;v<obb.halfShort;v+=7){const x=obb.cx+obb.ux*u-obb.uz*v,z=obb.cz+obb.uz*u+obb.ux*v;if(pointInPolygon(x,z,pts)&&!holes.some(h=>pointInPolygon(x,z,h)))support(x,z,levels.top,.42);}
    // Open parking decks have short guard walls, not residential windows.
    for(let i=0;i<floors;i++)for(const ring of [pts,...holes])walls(ring,i*rise,i*rise+.85,rgb(0xb3bbb8),STYLE.PLAIN,hash32(e.id),ring!==pts,null);
  }
  function walls(ring, y0, y1, color, style, seed, hole, owner) {
    const sign = Math.sign(ringArea(ring)) * (hole ? -1 : 1);
    let u = 0;
    for (let i = 0; i < ring.length; i++) {
      const [ax, az] = ring[i], [bx, bz] = ring[(i + 1) % ring.length], length = Math.hypot(bx - ax, bz - az); if (length < .05) continue;
      // Outward normal for a ring with the given winding (x right, z down).
      const n = [-(bz - az) / length * sign, 0, (bx - ax) / length * sign];
      const panels = input.wallPanels?.(owner, [ax,az], [bx,bz], y0, y1, n) || [{t0:0,t1:1,y0,y1}];
      for (const panel of panels) {
        const {t0,t1,y0:low,y1:high}=panel, x0=ax+(bx-ax)*t0,z0=az+(bz-az)*t0,x1=ax+(bx-ax)*t1,z1=az+(bz-az)*t1, u0=u+length*t0,u1=u+length*t1;
        solid.quad([x0,low,z0],[x1,low,z1],[x1,high,z1],[x0,high,z0],n,color,style,seed,[u0,low],[u1,low],[u1,high],[u0,high]);
      }
      u += length;
    }
  }
  function gableRoof(obb, top, wallColor, seed, rise) {
    const { cx, cz, ux, uz } = obb, L = obb.halfLong, W = obb.halfShort;
    const roof = rgb(region.roofs[Math.floor(seed * 97) % region.roofs.length]);
    const pt = (u, v, y) => [cx + ux * u - uz * v, y, cz + uz * u + ux * v];
    const eave = top - .12, ridge = top + rise;
    for (const s of [-1, 1]) {
      const n = [-uz * s * rise, W, ux * s * rise], l = Math.hypot(...n);
      solid.quad(pt(-L, s * W, eave), pt(L, s * W, eave), pt(L, 0, ridge), pt(-L, 0, ridge), n.map(v => v / l), roof, STYLE.PLAIN, seed);
      solid.quad(pt(-L, s * W, eave), pt(L, s * W, eave), pt(L, 0, ridge), pt(-L, 0, ridge), n.map(v => -v / l), roof, STYLE.PLAIN, seed);
      solid.tri(pt(s * obb.halfLong, -obb.halfShort, top), pt(s * obb.halfLong, obb.halfShort, top), pt(s * obb.halfLong, 0, top + rise * obb.halfShort / W), [ux * s, 0, uz * s], wallColor, STYLE.PLAIN, seed);
    }
  }
  function houseDetails(pts, obb, top, seed) {
    const cx = obb?.cx ?? pts[0][0], cz = obb?.cz ?? pts[0][1], road = roads.nearest(cx, cz, 45); if (!road) return;
    let front = null, back = null;
    for (let i = 0; i < pts.length; i++) {
      const [ax, az] = pts[i], [bx, bz] = pts[(i + 1) % pts.length], length = Math.hypot(bx - ax, bz - az); if (length < 2.2) continue;
      let nx = (bz - az) / length, nz = -(bx - ax) / length; const mx = (ax + bx) / 2, mz = (az + bz) / 2;
      if ((mx + nx - cx) * nx + (mz + nz - cz) * nz < 0) { nx = -nx; nz = -nz; }
      const toRoadX = road.x - mx, toRoadZ = road.z - mz, d = Math.hypot(toRoadX, toRoadZ) || 1, facing = (nx * toRoadX + nz * toRoadZ) / d;
      const wall = { ax, az, bx, bz, length, nx, nz, mx, mz, facing };
      if (!front || facing > front.facing) front = wall;
      if (!back || facing < back.facing) back = wall;
    }
    if (!front || front.facing < .3) return;
    const yaw = Math.atan2(front.nx, front.nz), door = [0xa83a32, 0x2d4a6e, 0x2f5d45, 0xf2efe6, 0x6b4a33, 0x1f2324][Math.floor(seed * 61) % 6];
    const dx = front.mx + front.nx * .06, dz = front.mz + front.nz * .06;
    box(detail, dx, 1.05, dz, 1, 2.1, .1, yaw, door);
    box(detail, front.mx + front.nx * .55, .09, front.mz + front.nz * .55, 1.6, .18, 1, yaw, 0xb9b4a8);
    detail.shape('sphere', base(dx + (front.bx - front.ax) / front.length * .9, 2.2, dz + (front.bz - front.az) / front.length * .9).multiply(new THREE.Matrix4().makeScale(.18, .24, .18)), rgb(0xfff2d0), STYLE.LAMP);
    // Flower bed along the front wall, either side of the door.
    for (let t = .08; t < .92; t += .09) {
      if (Math.abs(t - .5) < .14) continue;
      const fx = front.ax + (front.bx - front.ax) * t + front.nx * .5, fz = front.az + (front.bz - front.az) * t + front.nz * .5;
      if (!blocked(fx, fz)) P.flowers(detail, fx, fz, random);
    }
    // Front path to the street, and a driveway beside the house.
    const sx = front.mx + front.nx * 1.05, sz = front.mz + front.nz * 1.05, edge = roads.nearest(sx, sz, 40);
    if (edge && edge.distance > edge.half + .5) {
      const k = (edge.distance - edge.half) / edge.distance, ex = sx + (edge.x - sx) * k, ez = sz + (edge.z - sz) * k;
      ribbon(ground, [[sx, sz], [ex, ez]], 1.2, Y.path + .004, 0xc8bba4);
      const ox = (front.bx - front.ax) / front.length, oz = (front.bz - front.az) / front.length, off = front.length / 2 + 2;
      const dsx = front.mx + ox * off + front.nx * .5, dsz = front.mz + oz * off + front.nz * .5;
      if (!blocked(dsx, dsz)) {
        const dEdge = roads.nearest(dsx, dsz, 40);
        if (dEdge && dEdge.distance < 30) {
          const kk = Math.max(0, (dEdge.distance - dEdge.half) / dEdge.distance), dex = dsx + (dEdge.x - dsx) * kk, dez = dsz + (dEdge.z - dsz) * kk;
          ribbon(ground, [[dsx - front.nx * 3, dsz - front.nz * 3], [dex, dez]], 3, Y.path + .002, 0xb6b2a7);
          if (random() < .55) P.car(detail, base(dsx + front.nx * 1.5, Y.path, dsz + front.nz * 1.5, Math.atan2(front.nx, front.nz) + (random() < .5 ? 0 : Math.PI)), P.CAR_COLORS[Math.floor(random() * P.CAR_COLORS.length)]);
          if (region.us && random() < .8) { const mx = dex + ox * 2.2, mz = dez + oz * 2.2; box(detail, mx, .55, mz, .08, 1.1, .08, 0, 0x6b5a4a); box(detail, mx, 1.15, mz, .25, .25, .5, Math.atan2(front.nx, front.nz), 0x2f3433); }
        }
      }
      for (const s of [-1, 1]) { const bx = front.mx + ox * s * (front.length / 2 + .6) + front.nx * .8, bz = front.mz + oz * s * (front.length / 2 + .6) + front.nz * .8; if (!blocked(bx, bz)) P.bush(detail, bx, bz, 1 + random() * .5, random); }
    }
    // Patio behind the house.
    if (back && back.facing < 0 && back !== front) {
      const ox = (back.bx - back.ax) / back.length, oz = (back.bz - back.az) / back.length, w = Math.min(4.5, back.length * .7);
      const p = (u, v) => [back.mx + ox * u + back.nx * v, back.mz + oz * u + back.nz * v];
      const corners = [p(-w / 2, .05), p(w / 2, .05), p(w / 2, 3.4), p(-w / 2, 3.4)];
      if (!corners.some(c => blocked(...c))) {
        ground.polygon(corners, [], Y.path + .006, rgb([0xc9b79c, 0xa89e90, 0xb9a48a][Math.floor(seed * 13) % 3]));
        const [tx, tz] = p(0, 1.8);
        if (random() < .7) P.cafeSet(detail, tx, tz, Math.atan2(back.nx, back.nz), random);
      }
    }
  }
  yield;

  // --- Mapped businesses: facade details and furnishings -----------------------------------
  const storefronts = input.storefronts || storefrontIndex(elements, origin, roads);
  for (const e of elements) {
    const match = storefronts.get(e); if (!match || shopSigns.length >= 32) continue;
    const colors = [0x315f59, 0x943f38, 0x315775, 0x795639, 0x69577b], color = colors[Math.floor(hash32(e.id) * colors.length)];
    const shop = { ...match, color }; P.storefront(detail, shop, color); shopSigns.push(shop); structures.storefronts++;
    const at = (u, v) => [shop.x + shop.nz * u + shop.nx * v, shop.z - shop.nx * u + shop.nz * v];
    const clear = (x,z,r) => [[0,0],[r,0],[-r,0],[0,r],[0,-r]].every(([dx,dz])=>!blocked(x+dx,z+dz)&&!roads.onRoad(x+dx,z+dz,.25));
    for (const side of [-1,1]) {
      const [x,z]=at(side*(shop.width/2-.42),.65);
      // Keep curb-side walking space free; extras belong against the facade.
      const near=roads.nearest(x,z,12);
      if (clear(x,z,.45) && (!near || near.distance-near.half>2.1) && claim(x,z,1)) { P.shopPlanter(detail,x,z,shop.yaw,color,random); streetObstacles.push([x,z,.6]); }
    }
    if (FOOD_TYPES.has(shop.kind)) {
      const [x,z]=at(-shop.width*.29,.75),near=roads.nearest(x,z,15);
      if(clear(x,z,.4)&&(!near||near.distance-near.half>2.1)&&claim(x,z,.8)){P.menuBoard(detail,x,z,shop.yaw);streetObstacles.push([x,z,.5]);}
      const [tx,tz]=at(-shop.width*.27,2.5),n=roads.nearest(tx,tz,20);
      if(clear(tx,tz,1.45)&&(!n||n.distance-n.half>3.3)&&claim(tx,tz,2.1)){P.cafeSet(detail,tx,tz,shop.yaw,random);streetObstacles.push([tx,tz,1.5]);}
    }
  }

  // --- Points: real street furniture --------------------------------------------------------
  for (const e of elements) {
    if (e.kind !== 2) continue;
    let [x, z] = project(e.geometry[0].lat, e.geometry[0].lon, origin);
    const near = roads.nearest(x, z, 35);
    let yaw = near ? Math.atan2(near.x - x, near.z - z) : 0;
    const kind = e.tags.poi, sub = e.tags.subclass;
    const toSidewalk = (offset = 1.3) => {
      if (!near) return false;
      const d = near.distance || 1, nx = (x - near.x) / d, nz = (z - near.z) / d;
      x = near.x + nx * (near.half + offset); z = near.z + nz * (near.half + offset); yaw = Math.atan2(-nx, -nz); return true;
    };
    if (shopType(e.tags)) continue;
    if (blocked(x, z) && !toSidewalk()) continue;
    if (blocked(x, z) || roads.onRoad(x, z, 0)) continue;
    if (['bench','waste_basket','bollard','bicycle_parking','bus','shelter','post','recycling','information','fountain'].includes(kind)) streetObstacles.push([x,z,['bus','shelter','fountain'].includes(kind)?2:kind==='bench'?1.1:.6]);
    if (kind === 'waste_basket') P.wasteBasket(detail, x, z);
    else if (kind === 'bollard') P.bollard(detail, x, z);
    else if (kind === 'bicycle_parking') P.bikeRack(detail, x, z, yaw + Math.PI / 2);
    else if (kind === 'bus') P.busShelter(detail, x, z, yaw, region.uk ? 0xc8261f : 0x2f6fb3);
    else if (kind === 'shelter') P.busShelter(detail, x, z, yaw, 0x6a7a62);
    else if (kind === 'post') P.postBox(detail, x, z, region.post);
    else if (kind === 'drinking_water') P.drinkingFountain(detail, x, z);
    else if (kind === 'bench') P.bench(detail, x, z, yaw);
    else if (kind === 'recycling') P.recyclingBins(detail, x, z, yaw + Math.PI / 2);
    else if (kind === 'entrance' && sub === 'subway_entrance') P.subwayEntrance(detail, x, z, yaw);
    else if (kind === 'art_gallery' && sub === 'artwork') P.sculpture(detail, x, z, random);
    else if (kind === 'information') P.infoBoard(detail, x, z, yaw);
    else if (kind === 'parking') P.parkingSign(detail, x, z, yaw);
    else if (kind === 'fountain') { box(solid, x, .25, z, 4, .5, 4, 0, 0xbab3a6); water.polygon([[x - 1.8, z - 1.8], [x + 1.8, z - 1.8], [x + 1.8, z + 1.8], [x - 1.8, z + 1.8]], [], .45, rgb(0x5bb5cc)); box(solid, x, 1, z, .4, 2, .4, 0, 0xbab3a6); }
  }

  // --- Open ground: lawns, yard trees, and shrubs between mapped features --------------------
  // Mapped parks and lawns already have their own vegetation. Outside dense centres, the
  // unmapped ground left between streets, parking, and buildings is planted here.
  if (!urban) {
    const mapped = elements.filter(e => e.kind === 1 && !e.tags.building && (AREAS[e.tags.area] || e.tags.natural === 'water' || e.tags.highway)).map(e => { const g = geo(e); return { ...g, ...bounds(g.pts), residential: e.tags.area === 'residential' }; });
    const inMapped = (x, z, yards) => mapped.some(m => (!yards || !m.residential) && x >= m.minX && x <= m.maxX && z >= m.minZ && z <= m.maxZ && pointInPolygon(x, z, m.pts) && !m.holes.some(h => pointInPolygon(x, z, h)));
    // Tufts avoid every mapped area (grassy ones are already planted); trees and shrubs may
    // also go in mapped residential land, whose yards are otherwise bare.
    const plantable = (x, z, margin, yards = false) => { if (blocked(x, z) || excludesNature(x, z) || coveredParking(x, z) || inMapped(x, z, yards) || roads.onRoad(x, z, .35, null, false)) return false; const near = roads.nearest(x, z, 24); return !near || near.distance > near.half + margin; };
    const budget = Math.min(GRASS_BUDGET - nature.grassTufts, Math.ceil(chunkArea / 20));
    for (let i = 0; i < budget; i++) {
      const x = x0 + random() * (x1 - x0), z = z0 + random() * (z1 - z0);
      const cell = Math.floor(x * 1.2) + ',' + Math.floor(z * 1.2); if (grassCells.has(cell) || !plantable(x, z, (roads.nearest(x, z, 24)?.kind === 'service' ? .8 : sidewalk + .3))) continue;
      grassCells.add(cell); grass.push(x, Y.base + .012, z, .55 + random() * .5, random() * Math.PI * 2, random()); nature.grassTufts++;
      if (random() < .006) P.flowers(detail, x + .2, z - .2, random, [0xf6e27a, 0xffffff, 0xc6a2e0]);
    }
    // A few shade trees per yard, kept clear of walls, drives, and each other.
    const treeKind = () => region.tropical && random() < .5 ? 'palm' : region.north && random() < .4 ? 'conifer' : random() < .15 ? 'conifer' : 'broadleaf';
    for (let i = 0; i < Math.min(40, chunkArea / 1600); i++) {
      const x = x0 + random() * (x1 - x0), z = z0 + random() * (z1 - z0);
      if (!plantable(x, z, sidewalk + 3, true) || [[3.5, 0], [-3.5, 0], [0, 3.5], [0, -3.5]].some(([dx, dz]) => blocked(x + dx, z + dz)) || !claim(x, z, 6)) continue;
      P.tree(solid, x, z, 7 + random() * 8, random, { kind: treeKind() }); nature.yardTrees++;
    }
    // Foundation shrubs along low residential walls, on the outside of each wall.
    for (const e of buildings) {
      if (nature.shrubs >= 120) break;
      if (!/house|apartments|residential|detached|terrace|semidetached_house|dormitory/.test(e.tags.building) || openStructure(e.tags) || structureLevels(e.tags).base > .5) continue;
      const { pts } = geo(e); if (Math.abs(ringArea(pts)) > 6000) continue;
      for (let i = 0; i < pts.length; i++) {
        const [ax, az] = pts[i], [bx, bz] = pts[(i + 1) % pts.length], length = Math.hypot(bx - ax, bz - az); if (length < 3) continue;
        const nx = -(bz - az) / length, nz = (bx - ax) / length;
        for (let t = 1.2; t < length - 1.2; t += 2.4 + random() * 3) {
          if (nature.shrubs >= 120 || random() < .55) continue;
          const mx = ax + (bx - ax) * t / length, mz = az + (bz - az) * t / length, side = blocked(mx + nx * .9, mz + nz * .9) ? -1 : 1, x = mx + nx * .85 * side, z = mz + nz * .85 * side;
          if (!plantable(x, z, sidewalk + .6, true) || !claim(x, z, 1.1)) continue;
          P.bush(detail, x, z, .7 + random() * .6, random); nature.shrubs++;
        }
      }
    }
  }

  // Clip ambient walking paths after buildings and shop furniture are known.
  const waters = elements.filter(e=>e.kind===1&&e.tags.natural==='water').map(geo);
  const walkBlocked = (x,z) => blocked(x,z) || streetObstacles.some(([px,pz,r])=>Math.hypot(x-px,z-pz)<r) || waters.some(w=>pointInPolygon(x,z,w.pts)&&!w.holes.some(h=>pointInPolygon(x,z,h)));
  for (const e of elements) if(e.kind===0&&e.tags.highway) {
    const first=e.geometry[0],key=`${e.id}:${first.lat.toFixed(6)},${first.lon.toFixed(6)}`;
    pedestrianRoutes.push(...walkingRoutes(geo(e).pts,{key,kind:e.tags.highway,width:roadWidth(e.tags),sidewalk,bridge:e.tags.bridge,blocked:walkBlocked,roads,rect}));
  }

  return { solid: solid.arrays(), detail: detail.arrays(), ground: ground.arrays(), water: water.arrays(), grass:new Float32Array(grass),nature, glow, colliders, carRoads, pedestrianRoutes, shopSigns, buildingCount: count, urban,structures,mapLabels:collectMapLabels(elements,origin) };
}

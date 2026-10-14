import { project, pointInPolygon } from './geo.js';
import { structureLevels } from './structures.js';

export const SHOP_TYPES = new Set(['shop', 'restaurant', 'cafe', 'fast_food', 'bar', 'pub', 'ice_cream', 'bakery', 'supermarket', 'convenience', 'grocery', 'clothes', 'shoes', 'books', 'florist', 'hairdresser', 'beauty', 'pharmacy', 'optician', 'bicycle', 'butcher', 'greengrocer', 'deli', 'gift', 'jewelry', 'electronics', 'department_store']);
export const FOOD_TYPES = new Set(['restaurant', 'cafe', 'fast_food', 'bar', 'pub', 'ice_cream', 'bakery']);
export const shopType = tags => SHOP_TYPES.has(tags.subclass) ? tags.subclass : SHOP_TYPES.has(tags.poi) ? tags.poi : null;

export function measureRoute(route) {
  route.length = 0; route.cumulative = [0];
  for (let i = 1; i < route.pts.length; i++) {
    route.length += Math.hypot(route.pts[i][0] - route.pts[i - 1][0], route.pts[i][1] - route.pts[i - 1][1]);
    route.cumulative.push(route.length);
  }
  return route;
}
export function routePoint(route, distance) {
  const d = Math.max(0, Math.min(route.length, distance));
  let i = 1; while (i < route.cumulative.length - 1 && route.cumulative[i] < d) i++;
  const a = route.pts[i - 1], b = route.pts[i], length = route.cumulative[i] - route.cumulative[i - 1] || 1, t = (d - route.cumulative[i - 1]) / length;
  return { x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t, ux: (b[0] - a[0]) / length, uz: (b[1] - a[1]) / length };
}

// Conservative walking routes: never infer a crossing, sidewalk on a freeway, or a
// walkable bridge from a line alone. One-meter sampling clips routes at obstructions.
export function walkingRoutes(pts, { key, kind, width, sidewalk, bridge, blocked, roads, rect }) {
  const path = ['footway', 'path', 'pedestrian'].includes(kind);
  if (bridge || (!path && !['residential', 'tertiary', 'secondary', 'primary'].includes(kind))) return [];
  const routes = [];
  for (const side of path ? [0] : [-1, 1]) {
    let run = [], serial = 0;
    const flush = () => {
      if (run.length > 1) {
        const route = measureRoute({ id: `${key}:${side}:${serial++}`, pts: run, y: path ? .05 : .15, path });
        if (route.length >= 9) routes.push(route);
      }
      run = [];
    };
    for (let i = 1; i < pts.length; i++) {
      const [ax, az] = pts[i - 1], [bx, bz] = pts[i], length = Math.hypot(bx - ax, bz - az);
      if (length < .01) continue;
      const ux = (bx - ax) / length, uz = (bz - az) / length, offset = side * (width / 2 + Math.min(.95, sidewalk / 2));
      const steps = Math.ceil(length);
      for (let j = 0; j <= steps; j++) {
        const x = ax + (bx - ax) * j / steps - uz * offset, z = az + (bz - az) * j / steps + ux * offset;
        const outside = x < rect.minX || x >= rect.maxX || z < rect.minZ || z >= rect.maxZ;
        const obstructed = outside || roads.onRoad(x, z, .48) || [[0, 0], [.38, 0], [-.38, 0], [0, .38], [0, -.38]].some(([dx, dz]) => blocked(x + dx, z + dz));
        if (obstructed) { flush(); continue; }
        const last = run.at(-1), gap = last && Math.hypot(x - last[0], z - last[1]);
        // Sharp offset corners must not cut through the carriageway.
        if (gap > 1.6) flush();
        if (!run.length || gap > .05) run.push([x, z]);
      }
    }
    flush();
  }
  return routes;
}

// Match POIs against the whole tile, so a shop and its building may belong to
// different chunks. The facade design is illustrative; business names are map data.
export function storefrontIndex(elements, origin, roads) {
  const buildings = elements.filter(e => e.kind === 1 && e.tags.building).map(e => {
    const levels = structureLevels(e.tags);
    return { e, levels, pts: e.geometry.map(p => project(p.lat, p.lon, origin)), holes: (e.holes || []).map(h => h.map(p => project(p.lat, p.lon, origin))) };
  }).filter(b => !b.levels.open && b.levels.kind === 'building' && b.levels.base < .3 && b.levels.top >= 3.5);
  const grid = new Map(), cell = 80;
  for (const b of buildings) {
    const xs=b.pts.map(p=>p[0]),zs=b.pts.map(p=>p[1]);
    for(let gx=Math.floor(Math.min(...xs)/cell);gx<=Math.floor(Math.max(...xs)/cell);gx++)for(let gz=Math.floor(Math.min(...zs)/cell);gz<=Math.floor(Math.max(...zs)/cell);gz++){
      const key=gx+','+gz;if(!grid.has(key))grid.set(key,[]);grid.get(key).push(b);
    }
  }
  const nearby = (x,z) => grid.get(Math.floor(x/cell)+','+Math.floor(z/cell))||[];
  const occupied = (x, z) => nearby(x,z).some(b => pointInPolygon(x, z, b.pts) && !b.holes.some(h => pointInPolygon(x, z, h)));
  const placements = new Map(), used = [];
  for (const e of elements) {
    const kind = shopType(e.tags);
    if (e.kind !== 2 || !kind || !e.tags.name || Number(e.tags.level || 0) !== 0) continue;
    const [px, pz] = project(e.geometry[0].lat, e.geometry[0].lon, origin);
    let best = null;
    const candidates=new Set();for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)for(const b of nearby(px+dx*cell,pz+dz*cell))candidates.add(b);
    for (const b of candidates) {
      const inside = pointInPolygon(px, pz, b.pts) && !b.holes.some(h => pointInPolygon(px, pz, h));
      for (let i = 0; i < b.pts.length; i++) {
        const a = b.pts[i], q = b.pts[(i + 1) % b.pts.length], dx = q[0] - a[0], dz = q[1] - a[1], length = Math.hypot(dx, dz);
        if (length < 4.4) continue;
        const width = Math.min(6.4, length - 1), inset = (width / 2 + .3) / length;
        const t = Math.max(inset, Math.min(1 - inset, ((px - a[0]) * dx + (pz - a[1]) * dz) / (length * length)));
        const x = a[0] + dx * t, z = a[1] + dz * t, distance = Math.hypot(x - px, z - pz);
        if (distance > (inside ? 65 : 9)) continue;
        let nx = -dz / length, nz = dx / length;
        if (pointInPolygon(x + nx * .3, z + nz * .3, b.pts)) { nx = -nx; nz = -nz; }
        const near = roads.nearest(x + nx, z + nz, 65, false);
        if (!near || (near.x - x) * nx + (near.z - z) * nz < 1) continue;
        // Require clear air in front of the whole window, including attached wings.
        if ([-width / 2, 0, width / 2].some(u => occupied(x + nx * .4 + nz * u, z + nz * .4 - nx * u))) continue;
        if (roads.onRoad(x + nx * .65, z + nz * .65, .2)) continue;
        const score = distance + near.distance * .3 + (inside ? 0 : 20);
        if (best && score >= best.score) continue;
        if (used.some(s => Math.hypot(s.x - x, s.z - z) < (s.width + width) / 2 + .6)) continue;
        best = { id: e.id, name: e.tags.name, kind, x: x + nx * .08, z: z + nz * .08, nx, nz, yaw: Math.atan2(nx, nz), width, score };
      }
    }
    if (best) { used.push(best); placements.set(e, best); }
  }
  return placements;
}

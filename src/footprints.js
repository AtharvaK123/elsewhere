import polygonClipping from 'polygon-clipping';
import { pointInPolygon } from './geo.js';

// Fill-in footprints for buildings OpenStreetMap has not mapped yet. In the United States,
// FEMA/ORNL "USA Structures" traces every structure over 450 sq ft from aerial imagery,
// often with a measured height and occupancy class (CC BY 4.0). They are only ever added
// where the map has no building; a mapped OSM building always wins.
export const USA_STRUCTURES_URL = 'https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/USA_Structures_View/FeatureServer/0/query';
export const FOOTPRINT_ATTRIBUTION = 'Oak Ridge National Laboratory; FEMA Geospatial Response Office (CC BY 4.0)';
const PAGE = 2000, MAX_PAGES = 3;
// The 50 states, Puerto Rico, the U.S. Virgin Islands, and Guam.
const COVERAGE = [[24.4, 49.5, -125, -66.8], [51, 71.6, -180, -129.9], [18.8, 22.4, -160.5, -154.6], [17.6, 18.6, -67.4, -64.5], [13.2, 13.7, 144.6, 145]];
export const footprintCoverage = (lat, lon) => COVERAGE.some(([s, n, w, e]) => lat >= s && lat <= n && lon >= w && lon <= e);

export function footprintQuery(bounds, offset = 0) {
  const url = new URL(USA_STRUCTURES_URL);
  for (const [key, value] of Object.entries({ f: 'geojson', where: '1=1', geometry: [bounds.west, bounds.south, bounds.east, bounds.north].map(n => n.toFixed(6)).join(','), geometryType: 'esriGeometryEnvelope', inSR: 4326, outSR: 4326, spatialRel: 'esriSpatialRelIntersects', outFields: 'OBJECTID,OCC_CLS,PRIM_OCC,HEIGHT,SOURCE', geometryPrecision: 7, orderByFields: 'OBJECTID', resultOffset: offset, resultRecordCount: PAGE })) url.searchParams.set(key, value);
  return url.href;
}
export async function loadFootprints(bounds, { signal } = {}) {
  const features = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const response = await fetch(footprintQuery(bounds, page * PAGE), { signal: AbortSignal.any([...(signal ? [signal] : []), AbortSignal.timeout(12000)]) });
    if (!response.ok) throw new Error('Building footprints are temporarily unavailable (' + response.status + ').');
    const data = await response.json(); if (data.error) throw new Error('The building footprint lookup could not finish.');
    features.push(...(data.features || []));
    if (!data.properties?.exceededTransferLimit && !data.exceededTransferLimit && (data.features || []).length < PAGE) break;
  }
  return normalizeFootprints(features);
}

// Occupancy classes become ordinary building tags, so facades, yards, and heights follow the
// same rules as mapped buildings. Without a measured height, use a modest floor count.
export function footprintTags(p = {}) {
  const occ = String(p.OCC_CLS || ''), use = String(p.PRIM_OCC || '');
  const building = /single family|manufactured|mobile/i.test(use) ? 'house' : /multi/i.test(use) ? 'apartments' : /nursing|dormitor|hotel|lodging/i.test(use) ? 'residential'
    : occ === 'Residential' ? 'residential' : occ === 'Commercial' ? (/retail/i.test(use) ? 'retail' : 'commercial') : occ === 'Industrial' ? 'industrial'
    : occ === 'Education' ? (/college|universit/i.test(use) ? 'university' : 'school') : occ === 'Government' ? 'civic' : occ === 'Agriculture' ? 'farm_auxiliary'
    : occ === 'Assembly' ? (/relig|church|worship/i.test(use) ? 'church' : 'public') : 'yes';
  const tags = { building, structure: 'building', fillIn: 'yes', footprintSource: 'usa-structures' };
  const height = Number(p.HEIGHT);
  if (Number.isFinite(height) && height >= 2.5 && height < 400) { tags.height = String(Math.round(height * 10) / 10); tags.heightSource = 'footprints'; }
  else { tags.heightSource = 'estimated'; const levels = { house: 0, apartments: 3, residential: 3, university: 3, school: 2, industrial: 0, church: 0 }[building] ?? 2; if (levels) tags['building:levels'] = String(levels); }
  return tags;
}
export function normalizeFootprints(features = []) {
  const out = [];
  for (const f of features) {
    const g = f.geometry, id = f.id ?? f.properties?.OBJECTID; if (!g || id == null) continue;
    const polygons = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
    polygons.forEach((rings, i) => {
      const [outer, ...inner] = rings.map(r => r.filter(p => Number.isFinite(p[0]) && Number.isFinite(p[1])).map(([lon, lat]) => ({ lat, lon })));
      if (!outer || outer.length < 4) return;
      out.push({ id: -(1e9 + Number(id) * 4 + i), osmId: 'fp' + id + (i ? ':' + i : ''), kind: 1, tags: footprintTags(f.properties), geometry: outer, holes: inner.filter(r => r.length >= 4) });
    });
  }
  return out;
}

const local = (lat0) => { const kx = 111320 * Math.cos(lat0 * Math.PI / 180); return p => [p.lon * kx, p.lat * 110540]; };
const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
const segmentsCross = (a, b, c, d) => cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0;
// Automated footprints sometimes trace a parking lot or courtyard. A building does not have
// a street or parking aisle running through it, unless the road is mapped as covered.
export function crossedByRoad(footprint, roads) {
  const toXY = local(footprint.geometry[0].lat), ring = footprint.geometry.map(toXY), holes = (footprint.holes || []).map(h => h.map(toXY));
  const inside = p => pointInPolygon(p[0], p[1], ring) && !holes.some(h => pointInPolygon(p[0], p[1], h));
  for (const road of roads) {
    const t = road.tags || {};
    if (t.covered === 'yes' || t.tunnel || t.indoor === 'yes' || t.bridge || t.service === 'drive-through' || Number(t.layer) > 0 || Number(t.layer) < 0) continue;
    const line = road.geometry.map(toXY);
    for (let i = 0; i < line.length; i++) {
      if (inside(line[i])) return true;
      // Passing straight through: the segment enters and leaves the outline.
      if (i && ring.filter((p, j) => j && segmentsCross(line[i - 1], line[i], ring[j - 1], p)).length >= 2) return true;
    }
  }
  return false;
}
// Fraction of `a` covered by the union of `others`; anything above a sliver means the map already
// has this building (perhaps drawn differently), so the fill-in footprint is not used.
export function coveredFraction(a, others) {
  if (!others.length) return 0;
  const q = r => r.map(p => [Math.round(p.lon * 1e7), Math.round(p.lat * 1e7)]), area = rings => rings.reduce((s, r, i) => s + (i ? -1 : 1) * Math.abs(r.reduce((n, p, j) => { const o = r[(j + 1) % r.length]; return n + p[0] * o[1] - o[0] * p[1]; }, 0)) / 2, 0);
  try {
    const self = [q(a.geometry), ...(a.holes || []).map(q)], total = area(self); if (!total) return 1;
    const hit = polygonClipping.intersection([self], polygonClipping.union(...others.map(o => [[q(o.geometry), ...(o.holes || []).map(q)]])));
    return hit.reduce((s, p) => s + area(p), 0) / total;
  } catch { return 1; }
}

export const DESTINATIONS = [
  { id: 'new-york', name: 'New York', region: 'United States', subtitle: 'A little main-character energy.', lat: 40.7112, lon: -74.0085, tag: 'CITY ESCAPE', image: 'new-york', radius: 1400 },
  { id: 'tokyo', name: 'Tokyo', region: 'Japan', subtitle: 'Get lost in a different rhythm.', lat: 35.6595, lon: 139.7005, tag: 'AFTER HOURS', image: 'tokyo', radius: 900 },
  { id: 'paris', name: 'Paris', region: 'France', subtitle: 'Take the scenic route. Always.', lat: 48.8584, lon: 2.2945, tag: 'THE CLASSICS', image: 'paris', radius: 1000 },
  { id: 'santorini', name: 'Santorini', region: 'Greece', subtitle: 'Somewhere between sea and sky.', lat: 36.4618, lon: 25.3753, tag: 'SLOW LIVING', image: 'santorini', radius: 750 },
  { id: 'london', name: 'London', region: 'United Kingdom', subtitle: 'A new story around every corner.', lat: 51.5007, lon: -0.1246, tag: 'CITY ESCAPE', image: 'london', radius: 950 },
  { id: 'rome', name: 'Rome', region: 'Italy', subtitle: 'A few thousand years of wonder.', lat: 41.8902, lon: 12.4922, tag: 'THE CLASSICS', image: 'rome', radius: 900 }
];

export function project(lat, lon, origin) {
  const longitudeDelta = ((lon - origin.lon + 540) % 360) - 180;
  return [longitudeDelta * 111320 * Math.cos(origin.lat * Math.PI / 180), -(lat - origin.lat) * 110540];
}
export function unproject(x, z, origin) {
  const lon = origin.lon + x / (111320 * Math.cos(origin.lat * Math.PI / 180));
  return { lat: origin.lat - z / 110540, lon: ((lon + 540) % 360) - 180 };
}
export function parseCoordinates(query) {
  const match = query.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const lat = Number(match[1]), lon = Number(match[2]);
  if (Math.abs(lat) > 85 || Math.abs(lon) > 180) return null;
  return { id: `location-${lat}-${lon}`, name: `${lat.toFixed(4)}, ${lon.toFixed(4)}`, region: 'Coordinates', lat, lon, radius: 900 };
}
export function buildingHeight(tags = {}) {
  const height = parseFloat(tags.height);
  if (Number.isFinite(height) && height > 0) return Math.min(10000, /(?:ft|feet|')/i.test(String(tags.height)) ? height * .3048 : height);
  const levels = parseFloat(tags['building:levels']);
  if (Number.isFinite(levels) && levels > 0) return Math.min(10000, levels * 3.4);
  return ({ house: 8, residential: 14, apartments: 20, commercial: 24, church: 24, garage: 4, industrial: 9 })[tags.building] || 15;
}
export function overpassQuery(place) {
  const r = place.radius || 900;
  const dy = r / 110540, dx = r / (111320 * Math.cos(place.lat * Math.PI / 180));
  const box = `${place.lat - dy},${place.lon - dx},${place.lat + dy},${place.lon + dx}`;
  return `[out:json][timeout:35];(way[building](${box});way[highway](${box});way[leisure=park](${box});way[landuse=grass](${box});way[natural=water](${box});way[natural=coastline](${box});way[waterway=riverbank](${box}););out tags geom;`;
}
export function pointInPolygon(x, z, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, zi] = points[i], [xj, zj] = points[j];
    if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

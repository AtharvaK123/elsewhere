import { loadOpenFreeMap } from '../src/openfreemap.js';
import { DESTINATIONS } from '../src/geo.js';
const place = DESTINATIONS.find(p => p.id === process.argv[2]) || DESTINATIONS[0];
const data = await loadOpenFreeMap(place, { onProgress: (done, total) => { if (done === total) console.log(`Downloaded ${total} OpenFreeMap tiles.`); } });
console.log(JSON.stringify({ place: place.name, provider: data.provider, radius: data.radius, features: data.elements.length, buildings: data.elements.filter(e => e.tags.building).length, water: data.elements.filter(e => e.tags.natural === 'water').length, courtyards: data.elements.filter(e => e.tags.building && e.holes?.length).length }, null, 2));

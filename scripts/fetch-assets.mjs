import { writeFile, mkdir, access } from 'node:fs/promises';
import { DESTINATIONS, overpassQuery } from '../src/geo.js';
await mkdir('dist/assets',{recursive:true});
const photos = {'new-york':'photo-1485871981521-5b1fd3805eee',tokyo:'photo-1540959733332-eab4deabeeaf',paris:'photo-1502602898657-3e91760cbb34',santorini:'photo-1613395877344-13d4a8e0d49e',london:'photo-1513635269975-59663e0ac1ad',rome:'photo-1552832230-c0197dd311b5'};
for (const place of DESTINATIONS.slice(0,4)) {
  try { await access(`dist/assets/${place.id}.json`); continue; } catch {}
  try {
    const query=overpassQuery({...place,radius:place.id==='new-york'?1200:650}).replace('[timeout:35]','[timeout:60]');
    const response=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:'data='+encodeURIComponent(query),headers:{'Content-Type':'application/x-www-form-urlencoded','User-Agent':'ElsewhereWorldExplorer/1.0 (prototype map extract)'},signal:AbortSignal.timeout(85000)});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    if (!data.elements?.length) throw new Error('No map features');
    const compact={version:0.6,attribution:'© OpenStreetMap contributors, ODbL',fetchedAt:new Date().toISOString(),elements:data.elements.map(({id,tags,geometry})=>({id,tags,geometry}))};
    await writeFile(`dist/assets/${place.id}.json`,JSON.stringify(compact));
    console.log(`${place.id}: ${data.elements.length} map features`);
  } catch(error) {console.error(`${place.id}: ${error.message}`);}
}
await Promise.all(Object.entries(photos).map(async([id,photo])=>{
  try { await access(`dist/assets/${id}.jpg`); return; } catch {}
  try {const r=await fetch(`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=720&q=85`,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw new Error(r.status);await writeFile(`dist/assets/${id}.jpg`,Buffer.from(await r.arrayBuffer()));console.log(`${id}: photo saved`);}catch(e){console.error(`${id} photo: ${e.message}`);}
}));

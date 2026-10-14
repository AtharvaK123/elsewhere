import { normalizeDetails } from './structures.js';
import { loadFootprints, footprintCoverage } from './footprints.js';
export const OSM_DETAILS_URL='https://overpass-api.de/api/interpreter';
export function detailQuery(lat,lon,radius=800){
  const dy=radius/110540,dx=radius/(111320*Math.max(.09,Math.cos(lat*Math.PI/180)));
  const bounds={south:Math.max(-85,lat-dy),north:Math.min(85,lat+dy),west:Math.max(-180,lon-dx),east:Math.min(180,lon+dx)};
  const box=[bounds.south,bounds.west,bounds.north,bounds.east].map(n=>n.toFixed(6)).join(',');
  const query=`[out:json][timeout:12];(wr["building"](${box});wr["building:part"](${box});wr["generator:source"="solar"](${box});wr["amenity"="parking"](${box});wr["amenity"="shelter"](${box});way["highway"](${box}););out tags geom;`;
  return {bounds,query};
}
export async function loadDetails(lat,lon,{url=OSM_DETAILS_URL,signal}={}){
  const {bounds,query}=detailQuery(lat,lon);
  try{
    const response=await fetch(url,{method:'POST',body:new URLSearchParams({data:query}),signal:AbortSignal.any([...(signal?[signal]:[]),AbortSignal.timeout(14000)])});
    if(!response.ok)throw new Error('Structure details are temporarily unavailable ('+response.status+').');
    const data=await response.json();if(data.remark)throw new Error('The structure lookup could not finish.');
    return {bounds,features:normalizeDetails(data),source:'overpass',radius:800};
  }catch(error){
    signal?.throwIfAborted();if(url!==OSM_DETAILS_URL)throw error;
    // A conservative, read-only fallback for this local prototype: one small area, at most once
    // per minute, cached for a day. Production use should configure a dedicated Overpass service.
    const {bounds:small}=detailQuery(lat,lon,350),box=[small.west,small.south,small.east,small.north].map(n=>n.toFixed(6)).join(',');
    const response=await fetch('https://api.openstreetmap.org/api/0.6/map.json?bbox='+box,{signal:AbortSignal.any([...(signal?[signal]:[]),AbortSignal.timeout(10000)])});
    if(!response.ok)throw error;
    return {bounds:small,features:normalizeDetails(await response.json()),source:'osm-area',radius:350};
  }
}

// OSM details plus, where available, surveyed footprints for buildings the map is missing.
// Either source alone is still useful; the lookup only fails when both do.
export async function loadNeighbourhood(lat,lon,{url,signal,footprints=true}={}){
  const fill=footprints&&footprintCoverage(lat,lon)?loadFootprints(detailQuery(lat,lon).bounds,{signal}).catch(error=>{signal?.throwIfAborted();console.warn(error);return null;}):Promise.resolve(null);
  fill.catch(()=>{});
  let data;
  try{data=await loadDetails(lat,lon,{url,signal});}
  catch(error){signal?.throwIfAborted();const extra=await fill;if(!extra?.length)throw error;return {bounds:detailQuery(lat,lon).bounds,features:extra,source:'footprints',radius:800,footprints:extra.length};}
  const extra=await fill;
  return {...data,features:extra?[...data.features,...extra]:data.features,footprints:extra?.length||0};
}

// One background lookup at a time. Small cached neighbourhoods never block entering the world.
export class DetailStreamer {
  constructor(client,onDetails){this.client=client;this.onDetails=onDetails;this.cache=new Map();this.status='idle';this.nextRequest=0;this.generation=0;this.enabled=true;}
  reset(){this.generation++;this.controller?.abort();this.controller=null;this.pending=false;this.last=null;this.nextRequest=0;this.status=this.enabled?'idle':'off';}
  key(lat,lon){return Math.round(lat*180)+':'+Math.round(lon*180)+':'+(this.url||OSM_DETAILS_URL)+(this.footprints===false?':nofp':'');}
  // The cached neighbourhood around a point, from memory, this device, or the map workers.
  async fetch(lat,lon,signal){
    const key=this.key(lat,lon),storageKey='elsewhere:details:v3';
    let data=this.cache.get(key);
    if(!data){try{const stored=JSON.parse(localStorage.getItem(storageKey)||'[]').find(e=>e.key===key);if(stored&&Date.now()-stored.time<86400000)data=stored.data;}catch{}}
    if(data){const b=data.bounds,pad=80/110540;if(lat<b.south+pad||lat>b.north-pad||lon<b.west+pad||lon>b.east-pad)data=null;}
    if(!data){
      data=(await this.client.request({type:'details',lat,lon,url:this.url,footprints:this.footprints!==false},{signal,timeout:28000})).details;
      // Footprint-heavy suburbs are large; keep as many recent neighbourhoods as fit.
      try{const stored=JSON.parse(localStorage.getItem(storageKey)||'[]').filter(e=>e.key!==key&&Date.now()-e.time<86400000).slice(-5);stored.push({key,time:Date.now(),data});
        while(stored.length){try{localStorage.setItem(storageKey,JSON.stringify(stored));break;}catch{stored.shift();}}}catch{}
    }
    return {key,data};
  }
  async adopt(key,data,generation){
    this.cache.delete(key);this.cache.set(key,data);while(this.cache.size>12)this.cache.delete(this.cache.keys().next().value);
    await this.client.applyDetails([...this.cache.values()].flatMap(d=>d.features));
    if(generation!==this.generation)return false;
    this.last={lat:(data.bounds.south+data.bounds.north)/2,lon:(data.bounds.west+data.bounds.east)/2,radius:data.radius};this.source=data.source;this.footprintCount=data.footprints||0;this.status='ready';
    this.nextRequest=performance.now()+(data.source==='osm-area'?60000:15000);return true;
  }
  // During a trip: load the destination's details before its blocks are built, so buildings
  // arrive complete instead of being rebuilt after landing. Never fails the trip; a slow or
  // unavailable service simply leaves the lookup to the background streamer.
  async prepare(lat,lon,{signal,timeout=12000}={}){
    this.reset();if(!this.enabled)return null;
    const generation=this.generation,controller=new AbortController(),abort=()=>controller.abort(signal.reason);signal?.addEventListener('abort',abort,{once:true});
    const timer=setTimeout(()=>controller.abort(new DOMException('Details took too long.','TimeoutError')),timeout);
    this.pending=true;this.status='loading';this.controller=controller;
    try{const {key,data}=await this.fetch(lat,lon,controller.signal);return await this.adopt(key,data,generation)?data:null;}
    catch(error){signal?.throwIfAborted();if(generation===this.generation){this.status='unavailable';this.nextRequest=performance.now()+4000;}return null;}
    finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);if(generation===this.generation){this.pending=false;this.controller=null;}}
  }
  async update(lat,lon){
    if(!this.enabled||this.pending||performance.now()<this.nextRequest)return;
    if(this.last&&Math.hypot((lat-this.last.lat)*110540,(lon-this.last.lon)*111320*Math.cos(lat*Math.PI/180))<(this.last.radius||800)*.5)return;
    const generation=this.generation;
    this.pending=true;this.status='loading';const controller=new AbortController();this.controller=controller;
    try{
      const {key,data}=await this.fetch(lat,lon,controller.signal);
      if(generation!==this.generation)return;
      if(await this.adopt(key,data,generation))this.onDetails(data);
    }catch(error){if(generation===this.generation&&error.name!=='AbortError'){this.status='unavailable';this.nextRequest=performance.now()+60000;}}
    finally{if(generation===this.generation){this.pending=false;this.controller=null;}}
  }
}

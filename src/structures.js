import polygonClipping from 'polygon-clipping';
import { buildingHeight, pointInPolygon } from './geo.js';
import { crossedByRoad, coveredFraction } from './footprints.js';

export function structureKind(tags={}) {
  if(tags.structure)return tags.structure;
  if(tags.building==='carport')return 'carport';
  if(tags.building==='roof'||tags.amenity==='shelter'||tags.building==='canopy')return 'canopy';
  if(tags['generator:source']==='solar'&&(!tags.building||tags.building==='solar_panel'))return 'solar';
  if(tags.building==='parking'||tags.parking==='multi-storey')return 'garage';
  if(tags.building==='greenhouse')return 'greenhouse';
  return 'building';
}
export const openStructure = tags => ['canopy','carport','solar'].includes(structureKind(tags));
export function structureLevels(tags={}) {
  const kind=structureKind(tags),open=openStructure(tags),solar=kind==='solar'||tags.solar==='yes';
  const measured=parseFloat(tags.height),base=tags.min_height!=null?lengthMeters(tags.min_height):parseFloat(tags['building:min_level'])*3.4;
  const top=Number.isFinite(measured)&&measured>0?buildingHeight(tags):open?(kind==='solar'&&!tags.parkingCanopy&&!tags.rooftop?1.4:4):tags.building==='shed'?3.5:kind==='greenhouse'?4:buildingHeight(tags);
  return {kind,solar,open,top,base:open?Math.max(0,Number.isFinite(base)&&base>0?Math.min(base,top-.12):top-.22):Math.min(top-.01,Math.max(0,Number.isFinite(base)?base:0))};
}
export function lengthMeters(value){const n=parseFloat(value);return /(?:ft|feet|')/i.test(String(value))?n*.3048:n;}
// Some solar multipolygons describe an entire parking installation. Leave its mapped
// driving aisles open instead of spanning the whole lot with one enormous roof.
export function canopyRoofRings(pts,holes,segments=[]){
  const minX=Math.min(...pts.map(p=>p[0])),maxX=Math.max(...pts.map(p=>p[0])),minZ=Math.min(...pts.map(p=>p[1])),maxZ=Math.max(...pts.map(p=>p[1]));
  const cuts=[];
  for(const [ax,az,bx,bz,half,car]of segments){
    if(!car||Math.max(ax,bx)+half<minX||Math.min(ax,bx)-half>maxX||Math.max(az,bz)+half<minZ||Math.min(az,bz)-half>maxZ)continue;
    const dx=bx-ax,dz=bz-az,l=Math.hypot(dx,dz);if(l<.1)continue;
    const w=half+.35,ox=-dz/l*w,oz=dx/l*w,ex=dx/l*.4,ez=dz/l*.4;
    cuts.push([[[ax-ex+ox,az-ez+oz],[bx+ex+ox,bz+ez+oz],[bx+ex-ox,bz+ez-oz],[ax-ex-ox,az-ez-oz],[ax-ex+ox,az-ez+oz]]]);
  }
  if(!cuts.length)return [[pts,...holes]];
  const ints=poly=>poly.map(r=>r.map(([x,z])=>[Math.round(x*1000),Math.round(z*1000)]));
  try{return polygonClipping.difference([ints([pts,...holes])],...cuts.map(c=>[ints(c)])).map(p=>p.map(r=>r.map(([x,z])=>[x/1000,z/1000])));}catch{return [[pts,...holes]];}
}
const ringArea = ring => Math.abs(ring.reduce((s,p,i)=>{const q=ring[(i+1)%ring.length];return s+p[0]*q[1]-q[0]*p[1];},0))/2;
const polygon = e => [e.geometry,...(e.holes||[])].map(r=>r.map(p=>[Math.round(p.lon*1e7),Math.round(p.lat*1e7)]));
export function overlapFraction(a,b) {
  try {const pa=polygon(a),pb=polygon(b),area=ringArea(pa[0])-pa.slice(1).reduce((n,r)=>n+ringArea(r),0);if(!area)return 0;
    return polygonClipping.intersection([pa],[pb]).reduce((n,p)=>n+ringArea(p[0])-p.slice(1).reduce((n,r)=>n+ringArea(r),0),0)/area;
  }catch{return 0;}
}
const center = e => {const b=extent(e);return {lat:(b.south+b.north)/2,lon:(b.west+b.east)/2};};
const contains = (e,p) => pointInPolygon(p.lon,p.lat,e.geometry.map(q=>[q.lon,q.lat]))&&!(e.holes||[]).some(h=>pointInPolygon(p.lon,p.lat,h.map(q=>[q.lon,q.lat])));
function extent(e){return e.geometry.reduce((b,p)=>({west:Math.min(b.west,p.lon),east:Math.max(b.east,p.lon),south:Math.min(b.south,p.lat),north:Math.max(b.north,p.lat)}),{west:Infinity,east:-Infinity,south:Infinity,north:-Infinity});}
function spatialIndex(elements){
  const cells=new Map(),wide=[];
  const keys=e=>{const b=extent(e),keys=[];if((b.east-b.west)*(b.north-b.south)> .004)return null;for(let x=Math.floor(b.west*1000);x<=Math.floor(b.east*1000);x++)for(let y=Math.floor(b.south*1000);y<=Math.floor(b.north*1000);y++)keys.push(x+','+y);return keys;};
  for(const e of elements){const k=keys(e);if(!k){wide.push(e);continue;}for(const key of k){if(!cells.has(key))cells.set(key,[]);cells.get(key).push(e);}}
  return e=>{const k=keys(e);return k?[...new Set([...wide,...k.flatMap(key=>cells.get(key)||[])])]:elements;};
}
const samePoint=(a,b)=>a&&b&&Math.abs(a.lat-b.lat)<1e-8&&Math.abs(a.lon-b.lon)<1e-8;
// The small-area OSM API response references nodes; Overpass already supplies geometry.
export function withGeometry(data){
  const nodes=new Map((data.elements||[]).filter(e=>e.type==='node').map(e=>[e.id,{lat:e.lat,lon:e.lon}]));
  const ways=new Map((data.elements||[]).filter(e=>e.type==='way').map(e=>[e.id,{...e,geometry:e.geometry||(e.nodes?.every(id=>nodes.has(id))?e.nodes.map(id=>nodes.get(id)):undefined)}]));
  return {...data,elements:(data.elements||[]).map(e=>e.type==='way'?ways.get(e.id):e.type==='relation'?{...e,members:(e.members||[]).map(m=>({...m,geometry:m.geometry||ways.get(m.ref)?.geometry}))}:e)};
}
function ringsFromMembers(members){
  const remaining=members.filter(m=>m.geometry?.length>1).map(m=>m.geometry.slice()),rings=[];
  while(remaining.length){let ring=remaining.pop(),joined=true;
    while(!samePoint(ring[0],ring.at(-1))&&joined){joined=false;for(let i=0;i<remaining.length;i++){
      let next=remaining[i];if(samePoint(ring.at(-1),next.at(-1)))next=next.slice().reverse();
      if(samePoint(ring.at(-1),next[0])){ring.push(...next.slice(1));remaining.splice(i,1);joined=true;break;}
      if(samePoint(ring[0],next[0]))next=next.slice().reverse();
      if(samePoint(ring[0],next.at(-1))){ring=[...next.slice(0,-1),...ring];remaining.splice(i,1);joined=true;break;}
    }}
    if(ring.length>=4&&samePoint(ring[0],ring.at(-1)))rings.push(ring);
  }return rings;
}

export function normalizeDetails(data) {
  data=withGeometry(data);
  const features=[],expanded=[],memberIds=new Set();
  for(const e of data.elements||[]){
    if(e.type!=='relation'){expanded.push(e);continue;}
    if(e.tags?.type!=='multipolygon')continue;
    const outer=ringsFromMembers((e.members||[]).filter(m=>m.role!=='inner')),inner=ringsFromMembers((e.members||[]).filter(m=>m.role==='inner'));
    if(!outer.length)continue;
    for(const m of e.members||[])memberIds.add(m.ref);
    outer.forEach(geometry=>{const b=extent({geometry});expanded.push({...e,id:-e.id,osmId:'r'+e.id+':'+b.west.toFixed(7)+':'+b.south.toFixed(7),geometry,holes:inner.filter(h=>contains({geometry},h[0]))});});
  }
  for(const e of expanded){
    if(e.type!=='relation'&&memberIds.has(e.id))continue;
    if(e.tags?.highway&&e.geometry?.length>=2){
      if(e.tags.tunnel==='yes'||e.tags.indoor==='yes'||Number(e.tags.layer)<0)continue;
      features.push({id:e.id,osmId:'w'+e.id,kind:0,tags:{...e.tags,detailRoad:'yes'},geometry:e.geometry});continue;
    }
    if(!e.tags||!e.geometry||e.geometry.length<4)continue;
    const geometry=e.geometry.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon));
    if(geometry.length<4||Math.hypot(geometry[0].lat-geometry.at(-1).lat,geometry[0].lon-geometry.at(-1).lon)>1e-6)continue;
    const raw=e.tags,tags={...raw};
    if(raw.building==='no'||raw['building:part']==='no'||raw.location==='underground'||raw.indoor==='yes')continue;
    if(raw.amenity==='parking'&&!raw.building&&!raw['building:part']&&raw.parking!=='multi-storey'&&raw.parking!=='underground')tags.area='parking';
    else if(raw.building||raw['building:part']||raw.amenity==='shelter'||raw['generator:source']==='solar'){
      tags.building=raw.building||raw['building:part']||(raw['generator:source']==='solar'?'solar_panel':'roof');
      tags.structure=structureKind(tags);
      if(raw['building:min_level']&&!raw.min_height)tags.min_height=String(parseFloat(raw['building:min_level'])*3.4);
      tags.heightSource=raw.height?'measured':raw['building:levels']?'levels':'estimated';
    }
    else continue;
    features.push({id:e.id,osmId:e.osmId||'w'+e.id,kind:1,tags,geometry,holes:e.holes||[]});
  }
  const parking=features.filter(e=>e.tags.area==='parking'),panels=features.filter(e=>e.tags['generator:source']==='solar');
  for(const e of features){
    if(e.tags.area||e.tags.detailRoad)continue;
    const p=center(e),lot=parking.find(l=>contains(l,p));
    if(lot&&openStructure(e.tags)){e.tags.parkingCanopy='yes';if(!e.tags.height)e.tags.height='4';}
    if(e.tags['generator:source']==='solar'){
      e.tags.solar='yes';if(openStructure(e.tags)&&(e.tags['generator:location']==='roof'||e.tags.location==='roof'))e.tags.rooftop='yes';
      if(['roof','carport'].includes(e.tags.building)){e.tags.structure=e.tags.building==='carport'?'carport':'canopy';e.tags.parkingCanopy=lot?'yes':e.tags.parkingCanopy;}
    }else if(openStructure(e.tags)&&panels.some(p=>overlapFraction(e,p)>.1||overlapFraction(p,e)>.8))e.tags.solar='yes';
  }
  // A solar generator on a mapped canopy is part of that roof, not a second floating roof.
  return features.filter(e=>e.tags.structure!=='solar'||!features.some(c=>c!==e&&['canopy','carport'].includes(c.tags.structure)&&overlapFraction(e,c)>.8));
}

// Match geometry, not tile feature IDs: OpenFreeMap can merge many buildings into one feature.
export function enrichElements(elements,details,tile) {
  const fills=details.filter(e=>e.tags.fillIn);details=details.filter(e=>!e.tags.fillIn);
  const n=2**tile.z,within=p=>{const x=(p.lon+180)/360*n,y=(1-Math.asinh(Math.tan(p.lat*Math.PI/180))/Math.PI)/2*n;return Math.floor(x)===tile.x&&Math.floor(y)===tile.y;};
  const chunkOf=p=>{const gx=(p.lon+180)/360*n,gy=(1-Math.asinh(Math.tan(p.lat*Math.PI/180))/Math.PI)/2*n;return Math.min(7,Math.floor((gx-tile.x)*8))+Math.min(7,Math.floor((gy-tile.y)*8))*8;};
  const special=details.filter(e=>e.tags.building),nearDetail=spatialIndex(special),nearBase=spatialIndex(elements.filter(e=>e.tags.building)),nearParking=spatialIndex(details.filter(e=>e.tags.area==='parking')),replaced=new Set(),additions=[];
  for(const e of details){
    if(e.tags.detailRoad)continue;
    const p=center(e);if(!within(p))continue;
    const copy={...e,tags:{...e.tags}};
    const matching=nearBase(e).filter(b=>overlapFraction(e,b)>.65||overlapFraction(b,e)>.85).sort((a,b)=>overlapFraction(e,b)-overlapFraction(e,a));
    // A useful vector height wins over an estimate, but the ubiquitous 5 m default does not
    // overwrite mapped floor counts or the building-type estimate.
    if(copy.tags.building&&!openStructure(copy.tags)&&!copy.tags.height&&!copy.tags['building:levels']){
      const host=matching.find(b=>parseFloat(b.tags.height)>0&&parseFloat(b.tags.height)!==5);
      if(host){copy.tags.height=host.tags.height;copy.tags.heightSource='tiles';}
    }
    if(copy.tags.rooftop&&!copy.tags.parkingCanopy){
      const host=[...nearDetail(e),...nearBase(e)].filter(b=>b!==e&&!openStructure(b.tags)&&contains(b,p)).sort((a,b)=>buildingHeight(b.tags)-buildingHeight(a.tags))[0];
      if(host){copy.tags.height=String(buildingHeight(host.tags)+.35);copy.tags.min_height=String(buildingHeight(host.tags)+.15);}
    }
    copy.chunk=chunkOf(p);
    additions.push(copy);
  }
  for(const e of elements){
    if(e.tags.area==='parking'&&nearParking(e).some(p=>overlapFraction(e,p)>.72))replaced.add(e);
    if(!e.tags.building)continue;
    const p=center(e);
    for(const s of nearDetail(e)){
      // Roof-mounted panels must not erase the occupied building below them.
      if(s.tags.rooftop&&!s.tags.parkingCanopy)continue;
      if(overlapFraction(e,s)>.72){replaced.add(e);break;}
    }
  }
  // Building parts provide the massing. Remove the matching parent volume where ground-level
  // parts already occupy it; preserve uncovered wings, courtyards, and elevated glass bridges.
  const nearParts=spatialIndex(additions.filter(e=>e.tags['building:part']&&!openStructure(e.tags)&&structureLevels(e.tags).base<.1));
  const assembled=additions.flatMap(e=>{
    if(!e.tags.building||e.tags['building:part']||openStructure(e.tags))return [e];
    const parts=nearParts(e).filter(p=>overlapFraction(p,e)>.9);if(!parts.length)return [e];
    try{return polygonClipping.difference([polygon(e)],...parts.map(p=>[polygon(p)])).map(([outer,...holes])=>({...e,geometry:outer.map(([lon,lat])=>({lon:lon/1e7,lat:lat/1e7})),holes:holes.map(r=>r.map(([lon,lat])=>({lon:lon/1e7,lat:lat/1e7})))}));}catch{return [e];}
  });
  const nearRoads=spatialIndex(details.filter(e=>e.tags.detailRoad));
  const roadsEnriched=elements.filter(e=>!replaced.has(e)).map(e=>{
    if(!e.tags.highway||e.kind!==0)return e;
    const matches=nearRoads(e).map(r=>({r,score:roadMatch(e,r)})).filter(m=>m.score>.75).sort((a,b)=>b.score-a.score);
    if(!matches.length)return e;
    const raw=matches[0].r.tags,tags={...e.tags,highway:raw.highway};
    for(const key of ['width','lanes','surface','service','name'])if(raw[key])tags[key]=raw[key];
    // Explicit "no" must not become truthy and halve a two-way street.
    if(raw.oneway)tags.oneway=['yes','1','-1'].includes(raw.oneway)?'yes':undefined;
    return {...e,tags};
  });
  const kept=roadsEnriched.filter(e=>e.tags.building||e.tags.highway||e.tags.area==='parking');
  return [...roadsEnriched,...assembled,...fillIns(fills,[...kept,...assembled,...details.filter(e=>e.tags.detailRoad||e.tags.area==='parking')],within,chunkOf)];
}
// Footprints from aerial surveys fill gaps only: never where the map already has a building
// (even one drawn differently), and never across a street or parking aisle.
function fillIns(fills,context,within,chunkOf){
  if(!fills.length)return [];
  const box=e=>extent(e),hits=(a,b)=>a.west<=b.east&&b.west<=a.east&&a.south<=b.north&&b.south<=a.north;
  const near=spatialIndex(context),out=[];
  for(const f of fills){
    const p=center(f);if(!within(p))continue;
    const b=box(f),around=near(f).filter(e=>hits(b,box(e)));
    const buildings=around.filter(e=>e.tags.building&&e.kind===1),roads=around.filter(e=>e.tags.highway&&e.kind===0&&e.geometry.length>1);
    if(buildings.some(e=>contains(e,p))||coveredFraction(f,buildings)>.2||buildings.some(e=>overlapFraction(e,f)>.3))continue;
    if(crossedByRoad(f,roads))continue;
    if(!f.tags.height&&around.some(e=>e.tags.area==='parking'&&contains(e,p)))continue;
    out.push({...f,tags:{...f.tags},chunk:chunkOf(p)});
  }
  return out;
}
function roadMatch(a,b){
  const scale=Math.cos(a.geometry[0].lat*Math.PI/180),toXY=p=>[p.lon*111320*scale,p.lat*110540],line=b.geometry.map(toXY);
  let hit=0,total=0;
  for(let i=1;i<a.geometry.length;i++){
    const p=toXY(a.geometry[i-1]),q=toXY(a.geometry[i]),dx=q[0]-p[0],dy=q[1]-p[1],length=Math.hypot(dx,dy);if(!length)continue;total+=length;
    const x=(p[0]+q[0])/2,y=(p[1]+q[1])/2;
    for(let j=1;j<line.length;j++){const s=line[j-1],t=line[j],ux=t[0]-s[0],uy=t[1]-s[1],l=Math.hypot(ux,uy);if(!l||Math.abs((dx*ux+dy*uy)/(length*l))<.94)continue;
      const f=Math.max(0,Math.min(1,((x-s[0])*ux+(y-s[1])*uy)/(l*l)));if(Math.hypot(x-s[0]-f*ux,y-s[1]-f*uy)<1.3){hit+=length;break;}
    }
  }return total?hit/total:0;
}

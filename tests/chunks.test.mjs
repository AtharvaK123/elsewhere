import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { ChunkManager, chunksAround, distanceToBounds } from '../src/chunks.js';
import { MeshBuilder, rgb } from '../src/props.js';
import { project, unproject } from '../src/geo.js';
import { buildChunk, tileRoadIndex, regionOf } from '../src/chunk-builder.js';

const origin = { lat: 40.7112, lon: -74.0085 };
const fixture = () => {
  const requests = [], added = [], removed = [];
  const manager = new ChunkManager({client:{chunk:(message,{signal})=>new Promise((resolve,reject)=>{
    requests.push({message,resolve,reject}); signal?.addEventListener('abort',()=>reject(new DOMException('Canceled','AbortError')));
  })},root:new THREE.Group(),materials:{solid:new THREE.MeshStandardMaterial(),water:new THREE.MeshStandardMaterial()},addColliders:list=>added.push(list),removeColliders:list=>removed.push(list)});
  manager.origin=origin;
  return {manager,requests,added,removed};
};
const data = () => {
  const b=new MeshBuilder(); b.polygon([[0,0],[10,0],[10,10],[0,10]],[],5,rgb(0xeeeeee));
  return {solid:b.arrays(),detail:b.arrays(),ground:null,water:null,glow:[],colliders:[],carRoads:[],buildingCount:1,urban:true,provider:'openfreemap'};
};
const settle = () => new Promise(resolve=>setImmediate(resolve));

test('loaded blocks and their props stay resident throughout the view, including behind a walking player',async()=>{
  const {manager,requests}=fixture();
  manager.update(0,0);requests.splice(0).forEach(r=>r.resolve(data()));await settle();
  const resident=[...manager.chunks.values()].filter(c=>c.state==='ready');
  assert.ok(resident.length);
  for(const [x,z,vx,vz] of [[350,0,1.4,0],[0,350,0,1.4],[-350,0,-1.4,0],[0,-350,0,-1.4]]) {
    manager.update(x,z,vx,vz);
    for(const chunk of resident) if(distanceToBounds(x,z,chunk.bounds)<=manager.renderDistance) {
      assert.equal(manager.chunks.get(chunk.key),chunk,'same mesh remains loaded');
      assert.equal(chunk.detail.visible,true,'props are not hidden at 320 m');
    }
  }
  manager.update(10000,10000);
  assert.ok(resident.every(c=>!manager.chunks.has(c.key)),'distant chunks are eventually released');
  manager.reset(origin);await settle();
});

test('rebasing retains mesh identity, map positions, collider holes, and road distances',()=>{
  const {manager}=fixture(), entry=chunksAround(origin,0,0,250)[0], chunk={...entry,state:'loading'};
  const result=data();
  result.colliders=[{pts:[[1,1],[10,1],[10,10],[1,10]],holes:[[[3,3],[4,3],[4,4]]],minX:1,maxX:10,minZ:1,maxZ:10,minY:0,maxY:5}];
  result.carRoads=[{pts:[[0,0],[10,0]],cumulative:[0,10],length:10}];
  result.pedestrianRoutes=[{id:'walk',pts:[[0,4],[10,4]],cumulative:[0,10],length:10,y:.15}];
  result.shopSigns=[{name:'Mapped shop',x:5,z:12,width:6,nx:0,nz:-1,color:0x315f59}];
  manager.chunks.set(entry.key,chunk);manager.adopt(chunk,result);
  const mesh=chunk.group, geo=unproject(10,10,origin), next=unproject(6000,-3000,origin);
  const scaleX=Math.cos(next.lat*Math.PI/180)/Math.cos(origin.lat*Math.PI/180);
  manager.rebase(next,-6000*scaleX,3000,[],scaleX);
  assert.equal(chunk.group,mesh);assert.equal(manager.loaded,1);assert.equal(manager.buildingCount,1);
  const expected=project(geo.lat,geo.lon,next), c=chunk.colliders[0];
  assert.ok(Math.abs(c.maxX-expected[0])<1e-6);assert.ok(Math.abs(c.maxZ-expected[1])<1e-6);
  assert.ok(Math.abs(c.holes[0][0][0]-(3-6000)*scaleX)<1e-6);
  assert.ok(Math.abs(chunk.carRoads[0].length-10*scaleX)<1e-6);
  assert.ok(Math.abs(chunk.pedestrianRoutes[0].length-10*scaleX)<1e-6);
  assert.ok(Math.abs(chunk.pedestrianRoutes[0].pts[0][0]+6000*scaleX)<1e-6);
  assert.ok(Math.abs(chunk.storefronts[0].x-(5-6000)*scaleX)<1e-6);
  assert.equal(chunk.detail.visible,true); manager.reset(next);
});

test('a canceled shared fetch can retry instead of occupying a loading slot forever',async()=>{
  const {manager,requests}=fixture(),entry=chunksAround(origin,0,0,250)[0];
  manager.load(entry);requests[0].reject(new DOMException('Upstream canceled','AbortError'));await settle();
  assert.equal(manager.chunks.get(entry.key).state,'failed');assert.equal(manager.loading,0);
  manager.chunks.get(entry.key).retryAt=0;manager.update(0,0);
  assert.equal(manager.chunks.get(entry.key).state,'loading');manager.reset(origin);await settle();
});

test('late worker results cannot reappear after travel',async()=>{
  const {manager,requests}=fixture(),entry=chunksAround(origin,0,0,250)[0];
  manager.load(entry);manager.reset({lat:35,lon:140});requests[0].resolve(data());await settle();
  assert.equal(manager.loaded,0);assert.equal(manager.root.children.length,0);
});
test('background structure refresh keeps the old block visible until replacement is ready',async()=>{
  const {manager,requests,removed}=fixture(),entry=chunksAround(origin,0,0,250)[0],chunk={...entry,state:'loading'};
  manager.chunks.set(entry.key,chunk);manager.adopt(chunk,data());const old=chunk.group;
  manager.refresh(chunk);assert.equal(manager.loaded,1);assert.ok(manager.root.children.includes(old));assert.equal(removed.length,0);
  requests[0].resolve({...data(),mapLabels:[{name:'A street',points:[[1,2],[3,4]]}]});await settle();
  assert.equal(manager.loaded,1);assert.equal(manager.buildingCount,1);assert.ok(!manager.root.children.includes(old));assert.equal(chunk.mapLabels[0].name,'A street');
  manager.refresh(chunk);manager.reset({lat:35,lon:140});requests[1].resolve(data());await settle();assert.equal(manager.loaded,0);
});

test('building meshes preserve measured height and irregular footprints without guessed roofs',()=>{
  for(const height of [2,9,828]) {
    const points=[[0,0],[20,0],[20,8],[8,8],[8,20],[0,20]], e={id:123,kind:1,tags:{building:'house',height:String(height),colour:'slategray'},geometry:points.map(([x,z])=>unproject(x,z,origin)),holes:[]};
    // Planting is excluded so only the building's own geometry is measured.
    const generator=buildChunk({elements:[e],roads:tileRoadIndex([],origin),origin,rect:{minX:-100,maxX:100,minZ:-100,maxZ:100},region:regionOf(origin.lat,origin.lon),seed:.5,excludesNature:()=>true});
    let next;while(!(next=generator.next()).done){}
    const result=next.value, p=result.solid.position;
    let top=-Infinity;
    for(let i=0;i<p.length;i+=3){top=Math.max(top,p[i+1]);assert.ok(p[i]<=8.01||p[i+2]<=8.01,'no bounding-box roof covering the missing corner');}
    assert.equal(top,height);assert.equal(result.colliders[0].maxY,height);
  }
});

test('recorded CSS colours survive normalization',()=>{
  assert.deepEqual(rgb('slategray'),rgb(0x708090));
  assert.deepEqual(rgb('light_grey'),rgb(0xd3d3d3));
  assert.deepEqual(rgb('white smoke'),rgb(0xf5f5f5));
});

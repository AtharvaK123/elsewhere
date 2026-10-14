import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { walkingRoutes, measureRoute, routePoint, storefrontIndex } from '../src/street-life.js';
import { Pedestrians } from '../src/pedestrians.js';
import { tileRoadIndex, buildChunk, regionOf } from '../src/chunk-builder.js';
import { unproject, pointInPolygon } from '../src/geo.js';
import { featureTags } from '../src/openfreemap.js';

const origin={lat:40.5264,lon:-74.4414},rect={minX:-100,maxX:100,minZ:-100,maxZ:100};
const line=(id,pts,highway='residential')=>({id,kind:0,tags:{highway},geometry:pts.map(p=>unproject(...p,origin))});
const building=(id,pts,tags={})=>({id,kind:1,tags:{building:'yes',height:'15',...tags},geometry:pts.map(p=>unproject(...p,origin)),holes:[]});
const poi=(id,x,z,tags={})=>({id,kind:2,tags:{poi:'cafe',name:'Corner Café',...tags},geometry:[unproject(x,z,origin)]});
test('pedestrians use sidewalks and break their routes at roads and building walls',()=>{
  const elements=[line(1,[[-80,0],[80,0]]),line(2,[[0,-80],[0,80]])],roads=tileRoadIndex(elements,origin);
  const blocked=(x,z)=>x>35&&x<45&&z>0;
  const routes=walkingRoutes([[-80,0],[80,0]],{key:'street',kind:'residential',width:8,sidewalk:3.2,blocked,roads,rect});
  assert.ok(routes.length>=5);
  for(const route of routes)for(let d=0;d<=route.length;d+=.2){const p=routePoint(route,d);assert.equal(roads.onRoad(p.x,p.z,.4),false);assert.equal(blocked(p.x,p.z),false);}
  assert.equal(walkingRoutes([[-80,0],[80,0]],{kind:'motorway'}).length,0);
  assert.equal(walkingRoutes([[-80,0],[80,0]],{kind:'footway',bridge:true}).length,0);
});
test('footpaths keep their bends without inventing connections across gaps',()=>{
  const routes=walkingRoutes([[-30,0],[-30,25],[30,25]],{key:'path',kind:'footway',width:2,sidewalk:1.8,blocked:(x,z)=>x>0&&x<6,roads:{onRoad:()=>false},rect});
  assert.equal(routes.length,2);assert.ok(routes.every(r=>r.path&&r.y===.05));
  assert.ok(routes[0].length>=54&&routes[0].length<55,'stops with body clearance before the wall');assert.deepEqual(routePoint(routes[0],10),{x:-30,z:10,ux:0,uz:1});
});
test('shop names and levels survive tile decoding; unrelated POIs do not become stores',()=>{
  assert.deepEqual(featureTags('poi',{class:'shop',subclass:'books',name:'Real Bookshop',level:1}),{poi:'shop',subclass:'books',name:'Real Bookshop',level:'1'});
  assert.equal(featureTags('poi',{class:'dentist',name:'Dentist'}),null);
});
test('storefronts attach to an actual outward wall facing the street, in either winding',()=>{
  const pts=[[-12,10],[12,10],[12,28],[-12,28],[-12,10]];
  for(const ring of [pts,[...pts].reverse()]){
    const shop=poi(2,0,18),elements=[building(1,ring),shop,line(3,[[-80,0],[80,0]])];
    const result=storefrontIndex(elements,origin,tileRoadIndex(elements,origin)),s=result.get(shop);
    assert.ok(s);assert.equal(s.name,'Corner Café');assert.ok(Math.abs(s.z-9.92)<.001);assert.ok(s.nz<-.99);
    assert.equal(pointInPolygon(s.x+s.nx*.4,s.z+s.nz*.4,pts),false);assert.ok(s.width<=24);
  }
});
test('missing buildings, elevated businesses, canopies and occupied facades do not get fake shops',()=>{
  const shop=poi(2,0,18),road=line(3,[[-80,0],[80,0]]),pts=[[-12,10],[12,10],[12,28],[-12,28]];
  for(const elements of [[shop,road],[building(1,pts,{building:'roof'}),shop,road],[building(1,pts),poi(2,0,18,{level:'2'}),road]])assert.equal(storefrontIndex(elements,origin,tileRoadIndex(elements,origin)).size,0);
});
test('chunk generation retains real shop names and emits walkable routes and finite props',()=>{
  const elements=[building(1,[[-12,10],[12,10],[12,28],[-12,28]]),poi(2,0,18),line(3,[[-80,0],[80,0]])];
  const generator=buildChunk({elements,origin,rect,region:regionOf(origin.lat,origin.lon),seed:12,roads:tileRoadIndex(elements,origin)});
  let result;while(!(result=generator.next()).done){}const data=result.value;
  assert.equal(data.structures.storefronts,1);assert.equal(data.shopSigns[0].name,'Corner Café');assert.ok(data.pedestrianRoutes.length>=2);
  assert.ok([...data.detail.position].every(Number.isFinite));
});
function crowdWorld(){
  const routes=[0,1,2].map(i=>measureRoute({id:'walk'+i,pts:[[-70,5+i*5],[70,5+i*5]],y:.15}));
  return {player:{position:{x:0,y:0,z:0}},chunks:{chunks:new Map([['a',{key:'a',state:'ready',bounds:rect,pedestrianRoutes:routes}]])},collides:()=>false,groundAt:()=>.15};
}
test('crowd is bounded, animated, stable through chunk refresh, and separate from peers',()=>{
  const crowd=new Pedestrians(new THREE.Scene(),10),world=crowdWorld();crowd.setDensity(100);crowd.update(.016,world);
  assert.equal(crowd.agents.size,10);const before=new Map([...crowd.agents].map(([id,a])=>[id,{a,x:a.x,z:a.z}]));
  for(let i=0;i<120;i++)crowd.update(1/60,world);
  assert.ok([...crowd.agents].some(([id,a])=>Math.hypot(a.x-before.get(id).x,a.z-before.get(id).z)>.4));
  world.chunks.chunks.get('a').pedestrianRoutes=structuredClone(world.chunks.chunks.get('a').pedestrianRoutes);crowd.nextSync=0;crowd.update(.016,world);
  for(const [id,a]of crowd.agents)assert.equal(a,before.get(id).a);
  assert.ok(Object.values(crowd.parts).every(mesh=>mesh.count<=20));
  crowd.setDensity(0);assert.equal(crowd.agents.size,0);assert.ok(Object.values(crowd.parts).every(mesh=>mesh.count===0));crowd.dispose();
});
test('pedestrians yield to the player, obey newly loaded walls and respect reduced motion',()=>{
  const crowd=new Pedestrians(new THREE.Scene(),8),world=crowdWorld();crowd.setDensity(100);crowd.update(.01,world);
  const a=[...crowd.agents.values()][0],before={x:a.x,z:a.z};
  crowd.update(.1,world,true);assert.equal(a.x,before.x);assert.equal(a.z,before.z);
  const next=routePoint(a.route,a.distance+a.direction*.15);world.player.position={...next,y:.15};
  crowd.update(.1,world);assert.equal(a.x,before.x);assert.equal(a.z,before.z);assert.ok(a.pause>0);
  world.collides=(x,z)=>z>4&&z<6;crowd.nextSync=0;crowd.update(.1,world);assert.ok([...crowd.agents.values()].every(p=>!world.collides(p.x,p.z)));
  world.chunks.chunks.clear();crowd.nextSync=0;crowd.update(.1,world);assert.equal(crowd.agents.size,0);crowd.dispose();
});
test('origin changes preserve pedestrian positions and distance on transformed paths',()=>{
  const crowd=new Pedestrians(new THREE.Scene(),8),world=crowdWorld();crowd.setDensity(100);crowd.update(.01,world);
  const before=new Map([...crowd.agents].map(([id,a])=>[id,{x:a.x,z:a.z}]));
  for(const route of world.chunks.chunks.get('a').pedestrianRoutes){for(const p of route.pts){p[0]=p[0]*1.03-60;p[1]+=30;}measureRoute(route);}
  crowd.rebase(-60,30,1.03);
  for(const [id,a]of crowd.agents){const p=routePoint(a.route,a.distance);assert.ok(Math.abs(a.x-(before.get(id).x*1.03-60))<1e-8);assert.ok(Math.abs(p.x-a.x)<1e-8);assert.ok(Math.abs(p.z-a.z)<1e-8);}
  crowd.dispose();
});

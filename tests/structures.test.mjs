import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeDetails, enrichElements, structureLevels, structureKind, openStructure, canopyRoofRings } from '../src/structures.js';
import { tileCoordinates, featureTags } from '../src/openfreemap.js';
import { unproject, pointInPolygon } from '../src/geo.js';
import { buildChunk, tileRoadIndex, regionOf, roadWidth } from '../src/chunk-builder.js';
import { buildingSurfaces } from '../src/building-surfaces.js';
import { World } from '../src/world.js';
import { collectMapLabels, nearestOnLine } from '../src/map-labels.js';
const origin={lat:40.5264,lon:-74.4414};
const tile=tileCoordinates(origin.lat,origin.lon);tile.x=Math.floor(tile.x);tile.y=Math.floor(tile.y);
const rect=(x,z,w,d)=>[[x,z],[x+w,z],[x+w,z+d],[x,z+d],[x,z]].map(([x,z])=>unproject(x,z,origin));
const feature=(id,tags,geometry=rect(-20,-10,40,20))=>({type:'way',id,tags,geometry,kind:1,holes:[]});
function build(elements){const generator=buildChunk({elements,origin,rect:{minX:-100,maxX:100,minZ:-100,maxZ:100},region:regionOf(origin.lat,origin.lon),seed:.5,roads:tileRoadIndex(elements,origin),...buildingSurfaces(elements,origin)});let result;while(!(result=generator.next()).done){}return result.value;}
test('Rutgers source identifies solar canopy roofs separately from the apartment buildings',()=>{
  const data=JSON.parse(readFileSync(new URL('./fixtures/rutgers-structures.json',import.meta.url))),details=normalizeDetails(data);
  const roofs=details.filter(e=>e.tags.solar==='yes');assert.ok(roofs.length>=5);
  assert.ok(roofs.every(e=>openStructure(e.tags)&&structureLevels(e.tags).base>3));
  assert.ok(roofs.some(e=>e.tags.parkingCanopy==='yes'));
  assert.equal(details.filter(e=>e.tags.building==='apartments').length,3);
  assert.ok(details.filter(e=>e.tags.building==='apartments').every(e=>!e.tags['building:levels']),'source contains no floor counts; do not claim measured heights');
});
test('open solar roofs have walkable clearance, physical columns, and illustrative parked cars',()=>{
  const [roof]=normalizeDetails({elements:[feature(1,{building:'carport','generator:source':'solar',height:'4.5'})]});
  const result=build([roof]);assert.equal(result.structures.solar,1);assert.ok(result.structures.parkedCars>0);
  const slab=result.colliders.find(c=>c.minY>4);assert.ok(slab);assert.equal(slab.maxY,4.5);
  const world={collisionGrid:new Map(),inside:World.prototype.inside};World.prototype.addColliders.call(world,result.colliders);
  const free=[...Array(16)].map((_,i)=>({x:-16+i*2,z:0})).find(p=>!World.prototype.collides.call(world,p.x,p.z,0));
  assert.ok(free,'there is space to walk under the roof');assert.equal(World.prototype.collides.call(world,free.x,free.z,3.5),true);
  assert.ok([...result.solid.position].every(Number.isFinite));
});
test('geometry matching replaces only the correct footprint even when tile IDs repeat',()=>{
  const a=feature(99,{building:'yes',height:'5'}),b=feature(99,{building:'yes',height:'5'},rect(70,0,15,15));
  const details=normalizeDetails({elements:[feature(7,{building:'roof',height:'4'})]});
  const result=enrichElements([a,b],details,tile);
  assert.equal(result.filter(e=>e.tags.building==='yes').length,1);assert.equal(result.find(e=>e.tags.building==='yes'),b);assert.ok(result.some(e=>openStructure(e.tags)));
});
test('rooftop solar retains the occupied host and respects its measured height',()=>{
  const host=feature(2,{building:'yes',height:'23'}),panel=feature(3,{'generator:source':'solar','generator:location':'roof'},rect(-8,-5,16,10));
  const result=enrichElements([host],normalizeDetails({elements:[panel]}),tile);
  assert.ok(result.includes(host));assert.equal(Number(result.find(e=>e.tags.solar).tags.height),23.35);
});
test('building parts retain distinct heights and an elevated glazed section',()=>{
  const parent=feature(1,{building:'apartments','building:levels':'6'},rect(-40,0,80,20));
  const low=feature(2,{'building:part':'yes',height:'12'},rect(-40,0,40,20));
  const high=feature(3,{'building:part':'yes',height:'23'},rect(0,0,40,20));
  const glass=feature(4,{'building:part':'yes',height:'19',min_height:'13','building:material':'glass'},rect(-10,20,20,10));
  const result=enrichElements([feature(1,{building:'yes',height:'5'},parent.geometry)],normalizeDetails({elements:[parent,low,high,glass]}),tile);
  assert.equal(result.filter(e=>e.tags.building&&!e.tags['building:part']).length,0,'parent must not bury its wings');
  assert.deepEqual(result.map(e=>structureLevels(e.tags).top).sort((a,b)=>a-b),[12,19,23]);
  const chunk=build(result);assert.equal(chunk.structures.glass,1);assert.ok(chunk.colliders.some(c=>c.minY===13&&c.maxY===19));
});
test('multipolygon courtyards and disconnected apartment wings preserve their real outlines',()=>{
  const outer=rect(-30,-30,60,60),hole=rect(-10,-10,20,20),wing=rect(80,0,20,40);
  const relation={type:'relation',id:4,tags:{type:'multipolygon',building:'apartments','building:levels':'3'},members:[{type:'way',ref:1,role:'outer',geometry:outer.slice(0,3)},{type:'way',ref:2,role:'outer',geometry:outer.slice(2)},{type:'way',ref:3,role:'inner',geometry:hole},{type:'way',ref:5,role:'outer',geometry:wing}]};
  const result=normalizeDetails({elements:[relation]});assert.equal(result.length,2);assert.equal(result.filter(e=>e.holes.length).length,1);assert.notEqual(result[0].osmId,result[1].osmId);
  const ids=result.map(e=>e.osmId).sort();relation.members.reverse();assert.deepEqual(normalizeDetails({elements:[relation]}).map(e=>e.osmId).sort(),ids,'relation part identity is independent of request/member order');
  const courtyard=build(result).colliders.find(c=>c.holes.length);assert.ok(pointInPolygon(0,0,courtyard.holes[0]));
});
test('recorded dimensions override estimates; underground parking does not create a surface lot',()=>{
  assert.equal(structureLevels({building:'apartments','building:levels':'3'}).top,10.2);
  assert.equal(structureLevels({building:'yes',height:'50 ft',min_height:'10 ft'}).base,3.048);
  assert.equal(structureKind({building:'parking'}),'garage');
  assert.ok(structureLevels({building:'carport',height:'4',min_height:'0'}).base>3,'a default zero base does not turn an open roof into walls');
  assert.equal(normalizeDetails({elements:[feature(1,{amenity:'parking',parking:'underground'})]}).length,0);
  assert.equal(roadWidth({highway:'residential',width:'5.2'}),5.2);
  assert.equal(roadWidth({highway:'primary',lanes:'2'}),7);
});
test('nearby perpendicular paths cannot reclassify roads; matching tags recover width and service type',()=>{
  const street={id:4,kind:0,tags:{highway:'residential'},geometry:rect(-40,0,80,10).slice(0,2)};
  const path={type:'way',id:5,tags:{highway:'footway'},geometry:rect(0,-40,10,80).slice(1,3)};
  const road={type:'way',id:6,tags:{highway:'service',service:'parking_aisle',width:'4'},geometry:street.geometry};
  assert.equal(enrichElements([street],normalizeDetails({elements:[path]}),tile)[0].tags.highway,'residential');
  const matched=enrichElements([street],normalizeDetails({elements:[path,road]}),tile)[0];
  assert.equal(matched.tags.highway,'service');assert.equal(matched.tags.service,'parking_aisle');assert.equal(roadWidth(matched.tags),4);
});
test('street and attraction labels use source names and actual line distance',()=>{
  const tags=featureTags('transportation_name',{name:'Rockafeller Road',class:'minor'});
  const labels=collectMapLabels([{tags,geometry:rect(0,0,100,10).slice(0,2)}],origin);
  assert.equal(labels[0].name,'Rockafeller Road');assert.ok(Math.abs(nearestOnLine(labels[0].points,50,8).distance-8)<.001);
  assert.equal(featureTags('poi',{class:'cinema',name:'Rutgers Cinema'}).labelType,'attraction');
  assert.equal(featureTags('transportation_name',{class:'rail',name:'Rail line'}),null);
});
test('a grouped solar installation leaves its mapped driving aisles open',()=>{
  const roofs=canopyRoofRings([[-40,-30],[40,-30],[40,30],[-40,30]],[],[[-50,0,50,0,3,true]]);
  assert.equal(roofs.length,2);
  assert.ok(roofs.every(([outer])=>!pointInPolygon(0,0,outer)));
  assert.ok(roofs.some(([outer])=>pointInPolygon(0,15,outer)));
});

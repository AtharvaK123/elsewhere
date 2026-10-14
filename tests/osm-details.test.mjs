import test from 'node:test';
import assert from 'node:assert/strict';
import { loadDetails, detailQuery, DetailStreamer } from '../src/osm-details.js';
test('detail queries include building parts and are geographically bounded',()=>{
  const {query,bounds}=detailQuery(40.5264,-74.4414);assert.match(query,/building:part/);assert.match(query,/wr\["building"\]/);
  assert.ok(bounds.north-bounds.south<.02);assert.ok(bounds.east-bounds.west<.02);
});
test('an unavailable default Overpass service falls back to a small OSM area',async t=>{
  const calls=[];t.mock.method(globalThis,'fetch',async url=>{calls.push(String(url));return calls.length===1?new Response('',{status:504}):Response.json({elements:[]});});
  const data=await loadDetails(40.5264,-74.4414);assert.equal(data.source,'osm-area');assert.equal(data.radius,350);
  assert.match(calls[1],/^https:\/\/api.openstreetmap.org\/api\/0.6\/map.json\?bbox=/);assert.ok(data.bounds.north-data.bounds.south<.007);
});
test('custom endpoints and canceled lookups never silently contact the fallback',async t=>{
  const calls=[];t.mock.method(globalThis,'fetch',async url=>{calls.push(String(url));return new Response('',{status:503});});
  await assert.rejects(loadDetails(40,-74,{url:'https://example.test/interpreter'}));assert.equal(calls.length,1);
  const controller=new AbortController();controller.abort();await assert.rejects(loadDetails(40,-74,{signal:controller.signal}),{name:'AbortError'});assert.equal(calls.length,2);
});
test('a late detail response cannot refresh a destination the player has left',async()=>{
  let resolve,applied=0,refreshed=0;
  const streamer=new DetailStreamer({request:()=>new Promise(r=>resolve=r),applyDetails:async()=>applied++},()=>refreshed++);
  const pending=streamer.update(40,-74);streamer.reset();resolve({details:{...detailQuery(40,-74),features:[]}});await pending;
  assert.equal(applied,0);assert.equal(refreshed,0);assert.equal(streamer.pending,false);
});

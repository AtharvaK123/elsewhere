import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanPeer } from '../src/party.js';
test('peer updates preserve flight altitude and reject nonfinite coordinates',()=>{
 const payload={name:'Explorer',position:{lat:40,lon:-74,y:175.5},flying:true,moving:true};
 const peer=cleanPeer(payload,'peer');assert.equal(peer.position.y,175.5);assert.equal(peer.flying,true);
 assert.equal(cleanPeer({...payload,position:{lat:40,lon:-74}},'peer').position.y,0);
 assert.equal(cleanPeer({...payload,position:{lat:40,lon:-74,y:Infinity}},'peer').position.y,0);
 assert.equal(cleanPeer({...payload,position:{lat:NaN,lon:-74}},'peer'),null);
});

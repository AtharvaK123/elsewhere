import test from 'node:test';
import assert from 'node:assert/strict';
import { buildingSurfaces } from '../src/building-surfaces.js';
import { unproject } from '../src/geo.js';
const origin={lat:40,lon:-74};
const building=(id,points,height,base=0)=>({id,kind:1,tags:{building:'yes',height:String(height),min_height:String(base)},geometry:points.map(([x,z])=>unproject(x,z,origin)),holes:[]});
const rect=[[0,0],[10,0],[10,10],[0,10]];
test('overlapping mapped tower parts draw a single exterior facade',()=>{
 const low=building(1,rect,20),high=building(2,rect,50),s=buildingSurfaces([low,high],origin);
 assert.equal(s.wallPanels(low,[0,0],[10,0],0,20,[0,0,-1]).length,0);
 assert.deepEqual(s.wallPanels(high,[0,0],[10,0],0,50,[0,0,-1]),[{t0:0,t1:1,y0:0,y1:50}]);
 assert.equal(s.roofPolygons(low,rect,[],20).length,0);
 assert.equal(s.roofPolygons(high,rect,[],50).length,1);
});
test('a shorter attached building hides only the shared portion of a wall',()=>{
 const a=building(1,rect,30),b=building(2,[[2,-5],[8,-5],[8,0],[2,0]],10),s=buildingSurfaces([a,b],origin);
 const panels=s.wallPanels(a,[0,0],[10,0],0,30,[0,0,-1]);
 const area=panels.reduce((sum,p)=>sum+(p.t1-p.t0)*10*(p.y1-p.y0),0);
 assert.ok(Math.abs(area-240)<.001);assert.equal(panels.length,3);
});
test('suspended parts keep the wall below them and roofs retain courtyard holes',()=>{
 const low=building(1,rect,10),floating=building(2,rect,30,15),s=buildingSurfaces([low,floating],origin);
 assert.deepEqual(s.wallPanels(low,[0,0],[10,0],0,10,[0,0,-1]),[{t0:0,t1:1,y0:0,y1:10}]);
 const hole=[[3,3],[7,3],[7,7],[3,7]];
 assert.deepEqual(s.roofPolygons(low,rect,[hole],10),[[rect,hole]]);
});

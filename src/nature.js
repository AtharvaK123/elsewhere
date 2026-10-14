import * as THREE from 'three';
import { project, pointInPolygon } from './geo.js';

export const SURFACE = { GRASS: 15, EARTH: 16, SAND: 17 };
export const grassyAreas = new Set(['grass','park','garden','meadow','village_green','recreation_ground','golf_course','orchard','allotments','cemetery','residential','school','college','university','kindergarten']);
export function surfaceType(area) {
  return grassyAreas.has(area) ? SURFACE.GRASS : ['wood','forest','scrub','heath','flowerbed','farmland'].includes(area) ? SURFACE.EARTH : ['sand','beach'].includes(area) ? SURFACE.SAND : 9;
}
export function natureExclusions(elements,origin){
  const grid=new Map(),cell=60;
  for(const e of elements){
    if(e.kind!==1||!(e.tags.natural==='water'||e.tags.highway||['parking','pitch','playground','track','apron','runway','taxiway','industrial','commercial','retail'].includes(e.tags.area)))continue;
    const pts=e.geometry.map(p=>project(p.lat,p.lon,origin)),holes=(e.holes||[]).map(r=>r.map(p=>project(p.lat,p.lon,origin))),b={pts,holes};
    const xs=pts.map(p=>p[0]),zs=pts.map(p=>p[1]);
    for(let x=Math.floor(Math.min(...xs)/cell);x<=Math.floor(Math.max(...xs)/cell);x++)for(let z=Math.floor(Math.min(...zs)/cell);z<=Math.floor(Math.max(...zs)/cell);z++){const k=x+','+z;if(!grid.has(k))grid.set(k,[]);grid.get(k).push(b);}
  }
  return (x,z)=>(grid.get(Math.floor(x/cell)+','+Math.floor(z/cell))||[]).some(b=>pointInPolygon(x,z,b.pts)&&!b.holes.some(h=>pointInPolygon(x,z,h)));
}

// Meter-scale, continuous ground texture. Screen-space filtering avoids a noisy
// shimmer in the distance; roads, paving and roofs keep their own materials.
export function groundMaterial() {
  const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
  material.onBeforeCompile=shader=>{
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute vec2 facadeInfo; varying vec2 vGroundMeters; varying float vGroundKind;')
      .replace('#include <begin_vertex>','#include <begin_vertex>\nvGroundMeters=position.xz;vGroundKind=facadeInfo.x;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
varying vec2 vGroundMeters;varying float vGroundKind;
float earthHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float earthNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(earthHash(i),earthHash(i+vec2(1,0)),f.x),mix(earthHash(i+vec2(0,1)),earthHash(i+1.0),f.x),f.y);}`)
      .replace('#include <color_fragment>',`#include <color_fragment>
if(vGroundKind>14.5){
  vec2 p=vGroundMeters;float pixel=max(length(dFdx(p)),length(dFdy(p)));
  float patchiness=earthNoise(p*.16)*.6+earthNoise(p*.48)*.4;
  float grain=mix(.5,earthNoise(p*23.0),1.0-smoothstep(.018,.12,pixel));
  float mid=mix(.5,earthNoise(p*3.8),1.0-smoothstep(.15,1.2,pixel));
  if(vGroundKind<15.5){
    // Sun and sky light upward-facing ground about four times over; lighter, desaturated
    // lawn tones would tone-map to beige, so grass is shaded darker and greener here.
    vec3 green=diffuseColor.rgb*vec3(.62,.86,.48),dry=diffuseColor.rgb*vec3(.86,.84,.46);
    diffuseColor.rgb=mix(green,dry,smoothstep(.45,.85,patchiness)*.8)*(.78+mid*.27+grain*.2);
    vec2 cell=floor(p*20.0);float blade=step(.68,earthHash(cell))*(1.0-smoothstep(.0,.18,abs(fract(p.x*20.0+p.y*2.0)-.5)));
    diffuseColor.rgb*=1.0-blade*.16*(1.0-smoothstep(.025,.10,pixel));
  }else if(vGroundKind<16.5)diffuseColor.rgb*=.7+patchiness*.35+mid*.16+grain*.15;
  else diffuseColor.rgb*=.86+patchiness*.12+grain*.14;
}`);
  };
  material.customProgramCacheKey=()=> 'elsewhere-ground-nature-v2';return material;
}

export function grassGeometry() {
  const positions=[],normals=[];
  for(let i=0;i<5;i++){
    const angle=i*2.39996,x=Math.cos(angle)*.19*(i%3)/2,z=Math.sin(angle)*.19*(i%3)/2;
    const height=.16+(i*7%11)/11*.2,w=.018,ux=Math.cos(angle),uz=Math.sin(angle),bend=.07;
    const a=[x-ux*w,0,z-uz*w],b=[x+ux*w,0,z+uz*w],c=[x+ux*w*.55+uz*bend*.35,height*.58,z+uz*w*.55+ux*bend*.35],d=[x-ux*w*.55+uz*bend*.35,height*.58,z-uz*w*.55+ux*bend*.35],tip=[x+uz*bend,height,z+ux*bend];
    for(const p of [a,b,c,a,c,d,d,c,tip]){positions.push(...p);normals.push(-uz,.35,ux);}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));g.computeBoundingSphere();return g;
}
export function grassMaterial(uniforms) {
  const material=new THREE.MeshStandardMaterial({color:0x92ae55,side:THREE.DoubleSide,roughness:1});
  material.onBeforeCompile=shader=>{
    shader.uniforms.uTime=uniforms.uTime;
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nuniform float uTime;')
      .replace('#include <begin_vertex>',`#include <begin_vertex>
vec3 tuftWorld=(modelMatrix*instanceMatrix*vec4(0.0,0.0,0.0,1.0)).xyz;
float distanceFade=1.0-smoothstep(40.0,68.0,distance(cameraPosition,tuftWorld));
float flex=pow(clamp(position.y/.36,0.0,1.0),1.5);
transformed.x+=sin(uTime*1.5+tuftWorld.x*.27+tuftWorld.z*.2)*.08*flex;
transformed.z+=cos(uTime*1.1+tuftWorld.x*.13)*.045*flex;
transformed.y*=distanceFade;`);
  };
  material.customProgramCacheKey=()=> 'elsewhere-grass-v2';return material;
}
export function makeGrass(points,materials){
  if(!points?.length||!materials.grassGeometry)return null;
  const mesh=new THREE.InstancedMesh(materials.grassGeometry,materials.grass,points.length/6),d=new THREE.Object3D(),color=new THREE.Color();
  for(let i=0;i<points.length;i+=6){d.position.set(points[i],points[i+1],points[i+2]);d.rotation.y=points[i+4];d.scale.setScalar(points[i+3]);d.updateMatrix();mesh.setMatrixAt(i/6,d.matrix);mesh.setColorAt(i/6,color.setHSL(.19+points[i+5]*.025,.3+points[i+5]*.16,.42+points[i+5]*.13));}
  mesh.name='Windblown grass';mesh.receiveShadow=true;mesh.computeBoundingSphere();return mesh;
}

import * as THREE from 'three';

export const DEFAULT_APPEARANCE = { skin:'#c98e68', shirt:'#b7e889', pants:'#304d5a', hair:'#34271f', hat:'cap', backpack:true };
export function normalizeAppearance(value = {}) {
  const result = { ...DEFAULT_APPEARANCE };
  for (const key of ['skin','shirt','pants','hair']) if (/^#[0-9a-f]{6}$/i.test(value?.[key])) result[key] = value[key];
  if (['none','cap','beanie'].includes(value?.hat)) result.hat = value.hat;
  if (typeof value?.backpack === 'boolean') result.backpack = value.backpack;
  return result;
}
export function makeAvatar(appearance) {
  const root = new THREE.Group();
  const materials = Object.fromEntries(['skin','shirt','pants','hair'].map(key => [key,new THREE.MeshStandardMaterial({roughness:.85})]));
  const mesh = (geometry, material, x,y,z,parent=root) => {const object=new THREE.Mesh(geometry,material);object.position.set(x,y,z);object.castShadow=true;parent.add(object);return object;};
  const torso=mesh(new THREE.CapsuleGeometry(.22,.37,5,10),materials.shirt,0,1.04,0);torso.scale.z=.7;
  mesh(new THREE.SphereGeometry(.205,16,12),materials.skin,0,1.56,0);
  const hair=mesh(new THREE.SphereGeometry(.213,16,10,0,Math.PI*2,0,Math.PI*.47),materials.hair,0,1.59,0);
  const cap=mesh(new THREE.SphereGeometry(.225,16,10,0,Math.PI*2,0,Math.PI*.48),materials.shirt,0,1.6,0);
  const brim=mesh(new THREE.BoxGeometry(.33,.035,.24),materials.shirt,0,1.64,-.2);
  const beanie=mesh(new THREE.SphereGeometry(.23,12,10,0,Math.PI*2,0,Math.PI*.49),materials.shirt,0,1.68,0);
  const eyes=new THREE.MeshBasicMaterial({color:0x1b2526});
  for(const x of [-.073,.073])mesh(new THREE.SphereGeometry(.021,8,6),eyes,x,1.58,-.19);
  const limbs=[];
  for(const side of [-1,1]){
    const leg=new THREE.Group();leg.position.set(side*.115,.76,0);root.add(leg);mesh(new THREE.CapsuleGeometry(.085,.45,4,8),materials.pants,0,-.32,0,leg);mesh(new THREE.BoxGeometry(.18,.12,.28),materials.pants,0,-.69,-.045,leg);limbs.push(leg);
    const arm=new THREE.Group();arm.position.set(side*.275,1.24,0);root.add(arm);mesh(new THREE.CapsuleGeometry(.064,.28,4,8),materials.shirt,0,-.18,0,arm);mesh(new THREE.SphereGeometry(.068,10,8),materials.skin,0,-.4,0,arm);limbs.push(arm);
  }
  const backpack=mesh(new THREE.BoxGeometry(.33,.41,.17),materials.pants,0,1.08,.21);
  const ring=mesh(new THREE.RingGeometry(.35,.43,36),new THREE.MeshBasicMaterial({color:0xd8f5b0,side:THREE.DoubleSide,transparent:true,opacity:.55}),0,.015,0);ring.rotation.x=-Math.PI/2;
  root.userData={materials,limbs,cap,brim,beanie,hair,backpack,ring};
  applyAppearance(root,appearance);return root;
}
export function applyAppearance(avatar, value) {
  const appearance=normalizeAppearance(value),data=avatar.userData;
  for(const key of ['skin','shirt','pants','hair'])data.materials[key].color.set(appearance[key]);
  data.cap.visible=data.brim.visible=appearance.hat==='cap';data.beanie.visible=appearance.hat==='beanie';data.hair.visible=appearance.hat==='none';data.backpack.visible=appearance.backpack;
  data.appearance=appearance;
}
export function animateAvatar(avatar,time,moving){avatar.userData.limbs.forEach((limb,i)=>limb.rotation.x=moving?Math.sin(time*9+(i<2?0:Math.PI))*(i%2?.35:.5):0);}
export function disposeAvatar(avatar){const materials=new Set();avatar.traverse(o=>{o.geometry?.dispose();if(o.material)materials.add(o.material);});materials.forEach(m=>m.dispose());}

export function previewAvatar(container,appearance){
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(container.clientWidth,230);container.append(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(33,container.clientWidth/230,.1,20);camera.position.set(2.6,1.8,4.1);camera.lookAt(0,.9,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0x657d75,2.5));const light=new THREE.DirectionalLight(0xfff2d3,3);light.position.set(-3,5,4);scene.add(light);
  const avatar=makeAvatar(appearance);avatar.rotation.y=Math.PI;scene.add(avatar);let frame;
  const draw=()=>{frame=requestAnimationFrame(draw);avatar.rotation.y+=.004;renderer.render(scene,camera);};draw();
  return {update:value=>applyAppearance(avatar,value),dispose:()=>{cancelAnimationFrame(frame);disposeAvatar(avatar);renderer.dispose();renderer.domElement.remove();}};
}

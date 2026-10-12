import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { project, unproject, buildingHeight, pointInPolygon } from './geo.js';

const PALETTE = [0xc3cdb7,0xb4c5b1,0xd1d6bc,0xacbfab,0xa0b8a9,0xd7d9c3,0xb9c3a7,0x96b4aa];
const ZERO = new THREE.Vector3();
export class World {
  constructor(container, { onMove, onLimit } = {}) {
    this.container=container; this.onMove=onMove;this.onLimit=onLimit;this.keys=new Set();this.labels=[];this.peers=new Map();this.walking=false;this.night=false;this.lastLimit=0;this.lastBroadcast=0;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0xcadedd);this.scene.fog=new THREE.FogExp2(0xd1e1d9,.00017);
    this.camera=new THREE.PerspectiveCamera(39,1,1,18000);
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));this.renderer.setSize(container.clientWidth,container.clientHeight);
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;
    container.appendChild(this.renderer.domElement);
    this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.enableDamping=true;this.controls.dampingFactor=.075;this.controls.minDistance=35;this.controls.maxDistance=6200;this.controls.maxPolarAngle=Math.PI/2.08;this.controls.minPolarAngle=.08;this.controls.screenSpacePanning=false;this.controls.enablePan=true;
    this.ambient=new THREE.HemisphereLight(0xf5fff4,0x8dada3,1.65);this.scene.add(this.ambient);
    this.sun=new THREE.DirectionalLight(0xfff3d4,2.6);this.sun.position.set(-1600,2500,-700);this.sun.castShadow=true;this.sun.shadow.mapSize.set(2048,2048);Object.assign(this.sun.shadow.camera,{left:-2000,right:2000,top:2000,bottom:-2000,near:100,far:6000});this.sun.shadow.bias=-.0003;this.sun.shadow.normalBias=1;this.scene.add(this.sun);
    this.root=new THREE.Group();this.scene.add(this.root);
    this.player=this.makePlayer(0xb0e87e);this.scene.add(this.player);
    this.clock=new THREE.Clock();this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(container);
    this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.querySelector('#scene-error-text').textContent='The 3D graphics context was interrupted. Reload this page to enter the world again.';document.querySelector('#scene-error').hidden=false;});
    this.animate();
  }
  makePlayer(color) {
    const group=new THREE.Group();const mat=new THREE.MeshStandardMaterial({color,roughness:.8});
    const body=new THREE.Mesh(new THREE.CapsuleGeometry(2.5,4,4,8),mat);body.position.y=6;body.castShadow=true;group.add(body);
    const head=new THREE.Mesh(new THREE.SphereGeometry(2.6,12,8),new THREE.MeshStandardMaterial({color:0xffe0ac,roughness:1}));head.position.y=12;head.castShadow=true;group.add(head);
    const hat=new THREE.Mesh(new THREE.SphereGeometry(2.85,12,8,0,Math.PI*2,0,Math.PI/2),mat);hat.position.y=12.5;group.add(hat);
    const ring=new THREE.Mesh(new THREE.RingGeometry(6,8,40),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide,transparent:true,opacity:.6}));ring.rotation.x=-Math.PI/2;ring.position.y=.5;group.add(ring);group.userData.ring=ring;
    return group;
  }
  disposeRoot() {
    const mats=new Set();this.root.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])mats.add(m);}});mats.forEach(m=>m.dispose());this.root.clear();
    this.labels.forEach(l=>l.el.remove());this.labels=[];this.collisions=[];this.collisionGrid=new Map();this.roads=[];
  }
  build(place,data) {
    this.disposeRoot();this.place=place;this.radius=place.radius||900;
    const buckets=new Map();const add=(key,geometry)=>{if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(geometry);};
    const base=new THREE.Mesh(new THREE.PlaneGeometry(16000,16000),new THREE.MeshStandardMaterial({color:0xaecfc9,roughness:.62,metalness:.06}));base.rotation.x=-Math.PI/2;base.position.y=-2;base.receiveShadow=true;this.root.add(base);
    if(place.id==='new-york') {
      // Simplified shoreline control points in geographic coordinates; streets and buildings use OSM geometry.
      const manhattan=[[40.6996,-74.0185],[40.7020,-74.0190],[40.7068,-74.0198],[40.7118,-74.0189],[40.7178,-74.0148],[40.7240,-74.0120],[40.75,-74.01],[40.75,-73.96],[40.723,-73.973],[40.7126,-73.977],[40.7102,-73.984],[40.7077,-73.9950],[40.7035,-74.0048],[40.7010,-74.0100],[40.6996,-74.0185]];
      const brooklyn=[[40.699,-73.996],[40.704,-73.990],[40.706,-73.981],[40.71,-73.975],[40.719,-73.969],[40.73,-73.969],[40.73,-73.93],[40.67,-73.93],[40.67,-74.016],[40.69,-74.008],[40.699,-73.996]];
      [manhattan,brooklyn].forEach(coords=>this.polygon(coords.map(([lat,lon])=>project(lat,lon,place)),0,0xe4e5cf));
    } else {
      const ground=new THREE.Mesh(new THREE.CircleGeometry(this.radius*2.3,100),new THREE.MeshStandardMaterial({color:0xe0e2cd,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.3;ground.receiveShadow=true;this.root.add(ground);
    }
    let count=0;const treePositions=[];let seed=13;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
    for(const element of data.elements||[]) {
      const tags=element.tags||{};if(!element.geometry?.length)continue;
      const pts=element.geometry.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon)).map(p=>project(p.lat,p.lon,place));if(pts.length<2)continue;
      if(tags.building&&pts.length>3&&count<6500) {
        if(pts.some(p=>Math.abs(p[0])>this.radius*1.8||Math.abs(p[1])>this.radius*1.8))continue;
        const shape=this.shape(pts);const height=buildingHeight(tags);const geo=new THREE.ExtrudeGeometry(shape,{depth:height,bevelEnabled:false,steps:1,curveSegments:1});geo.rotateX(-Math.PI/2);geo.translate(0,.2,0);
        add(`building-${element.id%PALETTE.length}`,geo);count++;
        const minX=Math.min(...pts.map(p=>p[0])),maxX=Math.max(...pts.map(p=>p[0])),minZ=Math.min(...pts.map(p=>p[1])),maxZ=Math.max(...pts.map(p=>p[1]));
        const collider={pts,minX,maxX,minZ,maxZ};this.collisions.push(collider);
        for(let gx=Math.floor(minX/60);gx<=Math.floor(maxX/60);gx++)for(let gz=Math.floor(minZ/60);gz<=Math.floor(maxZ/60);gz++){const key=`${gx},${gz}`;if(!this.collisionGrid.has(key))this.collisionGrid.set(key,[]);this.collisionGrid.get(key).push(collider);}
        if(height>100) {const roof=new THREE.ShapeGeometry(shape);roof.rotateX(-Math.PI/2);roof.translate(0,height+.5,0);add('roof',roof);}
      } else if(tags.highway && !['steps','proposed','construction'].includes(tags.highway)) {
        const major=['motorway','trunk','primary','secondary','tertiary'].includes(tags.highway);const path=['footway','path','pedestrian','cycleway'].includes(tags.highway);const width=major?13:path?3.5:8;
        const elevated=tags.bridge==='yes'?12:0;
        this.roadGeometry(pts,width+2.6,.06+elevated,add,'curb');this.roadGeometry(pts,width,.14+elevated,add,path?'path':'road');
        if(!path&&pts.length>1)this.roads.push(pts);
        if(major)for(let i=0;i<pts.length-1;i++){const [x,z]=pts[i],[x2,z2]=pts[i+1];const distance=Math.hypot(x2-x,z2-z);for(let d=7;d<distance;d+=17){const t=d/distance;const g=new THREE.BoxGeometry(1,.06,5);g.rotateY(Math.atan2(x2-x,z2-z));g.translate(x+(x2-x)*t,.23+elevated,z+(z2-z)*t);add('markings',g);}}
      } else if((tags.leisure==='park'||tags.landuse==='grass')&&pts.length>3) {
        const shape=this.shape(pts),geo=new THREE.ShapeGeometry(shape);geo.rotateX(-Math.PI/2);geo.translate(0,.04,0);add('grass',geo);
        const minX=Math.max(-this.radius,Math.min(...pts.map(p=>p[0]))),maxX=Math.min(this.radius,Math.max(...pts.map(p=>p[0]))),minZ=Math.max(-this.radius,Math.min(...pts.map(p=>p[1]))),maxZ=Math.min(this.radius,Math.max(...pts.map(p=>p[1])));
        for(let i=0;i<Math.min(350,(maxX-minX)*(maxZ-minZ)/500);i++){const x=minX+random()*(maxX-minX),z=minZ+random()*(maxZ-minZ);if(pointInPolygon(x,z,pts))treePositions.push([x,z,8+random()*8]);}
      } else if((tags.natural==='water'||tags.waterway==='riverbank')&&pts.length>3){const geo=new THREE.ShapeGeometry(this.shape(pts));geo.rotateX(-Math.PI/2);geo.translate(0,.1,0);add('water',geo);}
    }
    const colors={curb:0xd3d9c1,road:0xb7c6b4,path:0xece8d6,grass:0xb9d29e,water:0xaecfc9,roof:0xe3e7d2,markings:0xebeeda};
    for(const[key,geometries]of buckets){if(!geometries.length)continue;const merged=mergeGeometries(geometries,false);geometries.forEach(g=>g.dispose());if(!merged)continue;const color=key.startsWith('building-')?PALETTE[Number(key.split('-')[1])]:colors[key];const mesh=new THREE.Mesh(merged,new THREE.MeshStandardMaterial({color,roughness:.94,flatShading:true}));mesh.castShadow=key.startsWith('building');mesh.receiveShadow=true;this.root.add(mesh);}
    this.addTrees(treePositions.slice(0,1700),random);
    if(place.id==='paris')this.eiffel(place);
    if(place.id==='new-york')this.brooklynBridge(place);
    this.addCars(random);
    this.buildingCount=count;
    let spawn=[0,0],closest=Infinity;
    for(const road of this.roads)for(const [x,z]of road){const d=x*x+z*z;if(d<closest&&!this.collides(x,z)){closest=d;spawn=[x,z];}}
    this.player.position.set(spawn[0],.4,spawn[1]);this.player.visible=true;this.keys.clear();this.walking=false;
    this.addLabel('You are here',this.player.position,'player',true);
    if(place.id==='new-york') {
      this.addGeoLabel('One World Trade Center',40.7127,-74.0134,425);
      this.addGeoLabel('Brooklyn Bridge',40.7068,-73.9969,85);
      this.addGeoLabel('The Battery',40.7033,-74.0165,15);
    } else if(place.id==='paris')this.addGeoLabel('Eiffel Tower',48.8584,2.2945,327);
    else if(place.id==='tokyo')this.addGeoLabel('Shibuya Crossing',35.6595,139.7005,25);
    this.resetView();this.resize();return count;
  }
  shape(points){const shape=new THREE.Shape();points.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();return shape;}
  polygon(points,height,color){const geometry=new THREE.ShapeGeometry(this.shape(points));geometry.rotateX(-Math.PI/2);geometry.translate(0,height,0);const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color,roughness:1}));mesh.receiveShadow=true;this.root.add(mesh);}
  roadGeometry(pts,width,height,add,key){const vertices=[];for(let i=0;i<pts.length-1;i++){const[a,b]=pts[i],[c,d]=pts[i+1],length=Math.hypot(c-a,d-b);if(!length||length>4500)continue;const dx=-(d-b)/length*width/2,dz=(c-a)/length*width/2;vertices.push(a+dx,height,b+dz,c+dx,height,d+dz,a-dx,height,b-dz,c+dx,height,d+dz,c-dx,height,d-dz,a-dx,height,b-dz);}if(vertices.length){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.computeVertexNormals();add(key,g);}}
  addTrees(positions,random){if(!positions.length)return;const crowns=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),new THREE.MeshStandardMaterial({color:0x759b70,roughness:1,flatShading:true}),positions.length);const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.8,1,1,5),new THREE.MeshStandardMaterial({color:0x959678}),positions.length);const o=new THREE.Object3D();positions.forEach(([x,z,h],i)=>{o.position.set(x,h*.7,z);o.scale.set(h*.45,h*.6,h*.45);o.rotation.y=random()*6;o.updateMatrix();crowns.setMatrixAt(i,o.matrix);crowns.setColorAt(i,new THREE.Color().setHSL(.22+random()*.08,.19+random()*.1,.42+random()*.14));o.position.y=h*.2;o.scale.set(1,h*.5,1);o.updateMatrix();trunks.setMatrixAt(i,o.matrix);});crowns.castShadow=true;crowns.receiveShadow=true;this.root.add(crowns,trunks);}
  addCars(random){this.cars=[];const count=Math.min(70,this.roads.length);const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(3,2.4,6),new THREE.MeshStandardMaterial({color:0xf5ecd1,roughness:.55}),count);const o=new THREE.Object3D();for(let i=0;i<count;i++){const road=this.roads[Math.floor(random()*this.roads.length)];const a=road[0],b=road[1];const t=random();this.cars.push({a,b,t,speed:.04+random()*.08});o.position.set(a[0]+(b[0]-a[0])*t,1.6,a[1]+(b[1]-a[1])*t);o.rotation.y=Math.atan2(b[0]-a[0],b[1]-a[1]);o.updateMatrix();mesh.setMatrixAt(i,o.matrix);mesh.setColorAt(i,new THREE.Color([0xf0d48b,0xf8f4df,0xa0b9ae,0xc0c5ad][i%4]));}mesh.castShadow=true;this.carMesh=mesh;this.root.add(mesh);}
  eiffel(place){const [x,z]=project(48.8584,2.2945,place);const material=new THREE.MeshStandardMaterial({color:0x8e9276,roughness:.8});const beam=(a,b,r)=>{const dir=new THREE.Vector3().subVectors(b,a);const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r*.7,r,dir.length(),4),material);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());mesh.castShadow=true;this.root.add(mesh);};for(const sx of[-1,1])for(const sz of[-1,1]){const a=new THREE.Vector3(x+sx*58,0,z+sz*58),b=new THREE.Vector3(x+sx*18,120,z+sz*18),c=new THREE.Vector3(x+sx*7,265,z+sz*7);beam(a,b,6);beam(b,c,3.5);beam(c,new THREE.Vector3(x,315,z),2);for(let h=20;h<120;h+=20){const t=h/120;beam(new THREE.Vector3(x+sx*(58-40*t),h,z+sz*(58-40*t)),new THREE.Vector3(x-sx*(58-40*(t+.16)),h+20,z+sz*(58-40*(t+.16))),1.5);}}[60,120,270].forEach((h,i)=>{const size=[85,43,17][i],platform=new THREE.Mesh(new THREE.BoxGeometry(size,4,size),material);platform.position.set(x,h,z);this.root.add(platform);});beam(new THREE.Vector3(x,310,z),new THREE.Vector3(x,330,z),1.2);}
  brooklynBridge(place){const start=project(40.7106,-74.0017,place),end=project(40.7004,-73.9891,place);const length=Math.hypot(end[0]-start[0],end[1]-start[1]);const group=new THREE.Group();group.position.set(start[0],0,start[1]);group.rotation.y=Math.atan2(end[0]-start[0],end[1]-start[1]);const stone=new THREE.MeshStandardMaterial({color:0xa8b59c,roughness:1}),steel=new THREE.MeshStandardMaterial({color:0x7f9789,roughness:.8});const box=(x,y,z,w,h,d,mat=stone)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);};box(0,24,length/2,25,4,length,steel);for(const t of [.3,.7]){for(const x of[-11,11])box(x,43,length*t,8,86,13);box(0,78,length*t,31,9,13);box(0,49,length*t,31,6,13);}for(const x of[-12,12]){const points=[];for(let i=0;i<=80;i++){const t=i/80;let y;if(t<.3)y=27+54*(t/.3);else if(t>.7)y=81-54*((t-.7)/.3);else y=35+46*Math.pow((t-.5)/.2,2);points.push(new THREE.Vector3(x,y,length*t));if(i%3===0&&t>.04&&t<.96)box(x,(24+y)/2,length*t,.6,y-24,.6,steel);}const curve=new THREE.CatmullRomCurve3(points);const cable=new THREE.Mesh(new THREE.TubeGeometry(curve,80,1,4,false),steel);group.add(cable);}this.root.add(group);}
  addLabel(text,position,className='',follow=false){const el=document.createElement('div');el.className=`scene-label ${className}`;const dot=document.createElement('span');dot.className='pin';el.append(dot,document.createTextNode(text));document.querySelector('#scene-labels').append(el);this.labels.push({el,position:follow?position:position.clone(),follow});}
  addGeoLabel(text,lat,lon,height){const[x,z]=project(lat,lon,this.place);this.addLabel(text,new THREE.Vector3(x,height,z));}
  resetView(){this.walking=false;const r=this.radius||1400;this.controls.target.set(0,35,0);this.camera.position.set(r*1.22,r*1.04,r*1.38);this.controls.maxDistance=r*4;this.controls.minDistance=35;this.controls.update();}
  zoom(factor){const offset=this.camera.position.clone().sub(this.controls.target).multiplyScalar(factor);offset.clampLength(this.controls.minDistance,this.controls.maxDistance);this.camera.position.copy(this.controls.target).add(offset);}
  setWalk(enabled){this.walking=enabled;this.keys.clear();if(enabled){this.controls.target.copy(this.player.position).add(new THREE.Vector3(0,12,0));this.camera.position.copy(this.player.position).add(new THREE.Vector3(85,95,120));this.controls.minDistance=25;this.controls.maxDistance=650;}else this.resetView();}
  setNight(enabled){this.night=enabled;this.scene.background.set(enabled?0x172d3e:0xcadedd);this.scene.fog.color.set(enabled?0x172d3e:0xd1e1d9);this.ambient.intensity=enabled?.65:1.65;this.sun.intensity=enabled?.7:2.6;this.sun.color.set(enabled?0xaec8ff:0xfff3d4);this.renderer.toneMappingExposure=enabled?.85:1.05;}
  collides(x,z){const nearby=this.collisionGrid?.get(`${Math.floor(x/60)},${Math.floor(z/60)}`)||[];return nearby.some(b=>x>=b.minX&&x<=b.maxX&&z>=b.minZ&&z<=b.maxZ&&pointInPolygon(x,z,b.pts));}
  updatePeers(players){const ids=new Set();for(const p of players){if(!this.place||!p.position||p.placeId!==this.place.id)continue;ids.add(p.id);let peer=this.peers.get(p.id);if(!peer){peer=this.makePlayer(0xc2adf2);this.scene.add(peer);this.peers.set(p.id,peer);}const[x,z]=project(p.position.lat,p.position.lon,this.place);peer.position.set(x,.4,z);}for(const[id,peer]of this.peers)if(!ids.has(id)){this.scene.remove(peer);peer.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});this.peers.delete(id);}}
  resize(){const w=this.container.clientWidth,h=this.container.clientHeight;if(!w||!h)return;this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h);}
  animate=()=>{this.frame=requestAnimationFrame(this.animate);const dt=Math.min(this.clock.getDelta(),.05),time=this.clock.elapsedTime;
    if(this.walking&&this.place){const input=new THREE.Vector3(Number(this.keys.has('d')||this.keys.has('arrowright'))-Number(this.keys.has('a')||this.keys.has('arrowleft')),0,Number(this.keys.has('s')||this.keys.has('arrowdown'))-Number(this.keys.has('w')||this.keys.has('arrowup')));if(input.lengthSq()){input.normalize();const direction=this.camera.position.clone().sub(this.controls.target);const angle=Math.atan2(direction.x,direction.z);input.applyAxisAngle(new THREE.Vector3(0,1,0),angle);input.multiplyScalar(dt*(this.keys.has('shift')?65:30));const old=this.player.position.clone();const x=old.x+input.x,z=old.z+input.z;if(Math.abs(x)<this.radius*.95&&Math.abs(z)<this.radius*.95){if(!this.collides(x,old.z))this.player.position.x=x;if(!this.collides(this.player.position.x,z))this.player.position.z=z;}else if(time-this.lastLimit>4){this.lastLimit=time;this.onLimit?.();}const moved=this.player.position.clone().sub(old);this.camera.position.add(moved);this.controls.target.add(moved);this.player.rotation.y=Math.atan2(input.x,input.z);this.player.children[0].rotation.z=Math.sin(time*14)*.05;}
      if(time-this.lastBroadcast>.16){this.lastBroadcast=time;this.onMove?.(unproject(this.player.position.x,this.player.position.z,this.place));}
    }
    this.player.userData.ring.scale.setScalar(1+Math.sin(time*2)*.08);
    if(this.carMesh&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const o=new THREE.Object3D();this.cars.forEach((car,i)=>{car.t=(car.t+dt*car.speed)%1;const{a,b,t}=car;o.position.set(a[0]+(b[0]-a[0])*t,1.6,a[1]+(b[1]-a[1])*t);o.rotation.y=Math.atan2(b[0]-a[0],b[1]-a[1]);o.updateMatrix();this.carMesh.setMatrixAt(i,o.matrix);});this.carMesh.instanceMatrix.needsUpdate=true;}
    this.controls.update();this.renderer.render(this.scene,this.camera);
    for(const label of this.labels){const p=label.position.clone();if(label.follow)p.y+=23;p.project(this.camera);const visible=p.z>-1&&p.z<1&&Math.abs(p.x)<.92&&Math.abs(p.y)<.85;label.el.hidden=!visible;if(visible){label.el.style.left=`${(p.x*.5+.5)*this.container.clientWidth}px`;label.el.style.top=`${(-p.y*.5+.5)*this.container.clientHeight}px`;}}
  };
}

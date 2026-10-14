import * as THREE from 'three';
import { project } from './geo.js';

export function collectMapLabels(elements, origin) {
  return elements.filter(e=>e.tags.name&&e.tags.labelType).map(e=>({
    name:e.tags.name,type:e.tags.labelType,kind:e.tags.poi||e.tags.roadClass,rank:e.tags.rank||20,
    points:e.geometry.map(p=>project(p.lat,p.lon,origin))
  }));
}
export function nearestOnLine(points,x,z) {
  let best={distance:Infinity,x:points[0]?.[0]||0,z:points[0]?.[1]||0};
  if(points.length===1)return {...best,distance:Math.hypot(best.x-x,best.z-z)};
  for(let i=1;i<points.length;i++){
    const [ax,az]=points[i-1],[bx,bz]=points[i],dx=bx-ax,dz=bz-az;
    const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz||1))),px=ax+dx*t,pz=az+dz*t,distance=Math.hypot(px-x,pz-z);
    if(distance<best.distance)best={x:px,z:pz,distance};
  }
  return best;
}
export class MapLabels {
  constructor(container,streetElement){this.container=container;this.streetElement=streetElement;this.nodes=new Map();this.lastUpdate=0;this.visible=[];}
  clear(){for(const el of this.nodes.values())el.remove();this.nodes.clear();this.visible=[];if(this.streetElement)this.streetElement.hidden=true;}
  update(world,time){
    if(time-this.lastUpdate<.15)return;this.lastUpdate=time;
    const p=world.player.position,found=new Map();let street=null;
    for(const chunk of world.chunks.chunks.values())for(const label of chunk.mapLabels||[]){
      const near=nearestOnLine(label.points,p.x,p.z);
      if(label.type==='street'&&near.distance<35&&(!street||near.distance<street.distance))street={name:label.name,distance:near.distance};
      const limit=label.type==='street'?170:world.renderDistance;
      if(near.distance>limit)continue;
      const key=label.type+':'+label.name.toLocaleLowerCase();
      if(found.has(key)&&found.get(key).distance<near.distance)continue;
      const at=label.type==='street'&&near.distance<18?label.points[Math.floor(label.points.length/2)]:[near.x,near.z];
      const height=label.type==='street'?1.2:Math.min(900,world.groundAt(at[0],at[1],10000)+6);
      found.set(key,{...label,key,x:at[0],z:at[1],height,distance:near.distance});
    }
    if(this.streetElement){this.streetElement.hidden=!street;this.streetElement.textContent=street?.name||'';}
    const w=world.container.clientWidth,h=world.container.clientHeight,boxes=[],visible=[];
    const candidates=[...found.values()].sort((a,b)=>(a.type==='street'?0:100)+(a.kind==='parking'?300:0)+a.distance*.35+a.rank*3-((b.type==='street'?0:100)+(b.kind==='parking'?300:0)+b.distance*.35+b.rank*3));
    for(const label of candidates){
      if(visible.length>=9||visible.filter(l=>l.type===label.type).length>=(label.type==='street'?3:6))continue;
      if(label.type==='attraction'&&world.labels.some(l=>l.landmark&&l.el.textContent.trim()===label.name))continue;
      const point=new THREE.Vector3(label.x,label.height,label.z).project(world.camera);
      if(point.z<=-1||point.z>=1||Math.abs(point.x)>.93||Math.abs(point.y)>.84)continue;
      const x=(point.x*.5+.5)*w,y=(-point.y*.5+.5)*h,width=Math.min(230,Math.max(95,label.name.length*6+38)),height=label.type==='street'?27:49;
      if(y>h-155||(x<315&&y<225)||(x>w-110&&y<360)||y<90)continue;
      const box={left:x-width/2,right:x+width/2,top:y-height,bottom:y+18};
      if(boxes.some(b=>box.left<b.right+12&&box.right>b.left-12&&box.top<b.bottom+8&&box.bottom>b.top-8))continue;
      boxes.push(box);visible.push(label);
      let el=this.nodes.get(label.key);
      if(!el){el=document.createElement('div');el.className='map-label '+label.type;const title=document.createElement('strong'),caption=document.createElement('span');title.textContent=label.name;el.append(title,caption);this.container.append(el);this.nodes.set(label.key,el);}
      el.hidden=false;el.style.left=x+'px';el.style.top=y+'px';
      el.lastChild.textContent=label.type==='street'?'':`${String(label.kind||'place').replaceAll('_',' ')} · ${label.distance>=1000?(label.distance/1000).toFixed(1)+' km':Math.round(label.distance)+' m'}`;
    }
    const keys=new Set(visible.map(l=>l.key));for(const [key,el]of this.nodes)if(!keys.has(key)){el.remove();this.nodes.delete(key);}
    this.visible=visible.map(({name,type})=>({name,type}));
  }
}

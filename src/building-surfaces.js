import polygonClipping from 'polygon-clipping';
import { project } from './geo.js';
import { openStructure, structureLevels } from './structures.js';

// Mapped buildings often contain overlapping extrusions (a base and several tower parts).
// Draw the outside of their combined volume. Coplanar duplicate walls otherwise shimmer
// as the camera moves, even though each individual footprint is correct.
export function buildingSurfaces(elements, origin) {
  const CELL = 80, grid = new Map(), owners = new Map();
  const cells = function* (b) {
    for (let x = Math.floor(b.minX / CELL); x <= Math.floor(b.maxX / CELL); x++)
      for (let z = Math.floor(b.minZ / CELL); z <= Math.floor(b.maxZ / CELL); z++) yield x + ':' + z;
  };
  const area = ring => ring.reduce((a,p,i)=>{const q=ring[(i+1)%ring.length];return a+p[0]*q[1]-q[0]*p[1];},0);
  for (const e of elements) {
    if (!e.tags.building || e.kind !== 1 || openStructure(e.tags)) continue;
    const rings = [e.geometry, ...(e.holes || [])].map(r=>r.map(p=>project(p.lat,p.lon,origin)));
    const {top,base} = structureLevels(e.tags);
    const b = { e, rings, top, base, rank:owners.size, minX:Infinity,maxX:-Infinity,minZ:Infinity,maxZ:-Infinity,edges:[] };
    rings.forEach((ring,hole)=>{
      const sign = Math.sign(area(ring)) * (hole ? -1 : 1);
      ring.forEach((p,i)=>{
        const q=ring[(i+1)%ring.length],dx=q[0]-p[0],dz=q[1]-p[1],length=Math.hypot(dx,dz);
        b.minX=Math.min(b.minX,p[0]);b.maxX=Math.max(b.maxX,p[0]);b.minZ=Math.min(b.minZ,p[1]);b.maxZ=Math.max(b.maxZ,p[1]);
        if(length>.01)b.edges.push({p,q,nx:dz/length*sign,nz:-dx/length*sign});
      });
    });
    owners.set(e,b);
    for(const key of cells(b)){if(!grid.has(key))grid.set(key,[]);grid.get(key).push(b);}
  }
  const neighbours = bounds => {
    const found=new Set();for(const key of cells(bounds))for(const b of grid.get(key)||[])if(b.maxX>=bounds.minX-.02&&b.minX<=bounds.maxX+.02&&b.maxZ>=bounds.minZ-.02&&b.minZ<=bounds.maxZ+.02)found.add(b);
    return found;
  };
  const wins = (a,b) => b.top>a.top || (b.top===a.top && (b.base<a.base || (b.base===a.base && b.rank<a.rank)));
  return {
    wallPanels(e, a, q, y0, y1, normal) {
      const owner=owners.get(e);if(!owner)return [{t0:0,t1:1,y0,y1}];
      const dx=q[0]-a[0],dz=q[1]-a[1],length=Math.hypot(dx,dz),ux=dx/length,uz=dz/length;
      const covers=[];
      for(const b of neighbours({minX:Math.min(a[0],q[0]),maxX:Math.max(a[0],q[0]),minZ:Math.min(a[1],q[1]),maxZ:Math.max(a[1],q[1])})) {
        if(b===owner||b.base>=y1||b.top<=y0)continue;
        for(const edge of b.edges) {
          const side=normal[0]*edge.nx+normal[2]*edge.nz;
          if(Math.abs(side)<.99999 || (side>0 && !wins(owner,b)))continue;
          if(Math.abs((edge.p[0]-a[0])*uz-(edge.p[1]-a[1])*ux)>.02 || Math.abs((edge.q[0]-a[0])*uz-(edge.q[1]-a[1])*ux)>.02)continue;
          const u=(edge.p[0]-a[0])*ux+(edge.p[1]-a[1])*uz,v=(edge.q[0]-a[0])*ux+(edge.q[1]-a[1])*uz;
          const t0=Math.max(0,Math.min(u,v)/length),t1=Math.min(1,Math.max(u,v)/length);
          if(t1-t0>1e-6)covers.push({t0,t1,y0:Math.max(y0,b.base),y1:Math.min(y1,b.top)});
        }
      }
      let panels=[{t0:0,t1:1,y0,y1}];
      for(const cut of covers)panels=panels.flatMap(p=>{
        const l=Math.max(p.t0,cut.t0),r=Math.min(p.t1,cut.t1),bottom=Math.max(p.y0,cut.y0),top=Math.min(p.y1,cut.y1);
        if(r<=l+1e-6||top<=bottom+.001)return [p];
        const out=[];
        if(l>p.t0+1e-6)out.push({...p,t1:l});if(r<p.t1-1e-6)out.push({...p,t0:r});
        if(bottom>p.y0+.001)out.push({t0:l,t1:r,y0:p.y0,y1:bottom});if(top<p.y1-.001)out.push({t0:l,t1:r,y0:top,y1:p.y1});
        return out;
      });
      return panels;
    },
    roofPolygons(e, pts, holes, top) {
      const owner=owners.get(e);if(!owner)return [[pts,...holes]];
      const blockers=[...neighbours(owner)].filter(b=>b!==owner && b.base<top-.001 && b.top>=top && (b.top>top || wins(owner,b)));
      if(!blockers.length)return [[pts,...holes]];
      const integer = rings => rings.map(r=>r.map(([x,z])=>[Math.round(x*1000),Math.round(z*1000)]));
      try { return polygonClipping.difference([integer([pts,...holes])],...blockers.map(b=>[integer(b.rings)])).map(poly=>poly.map(r=>r.map(([x,z])=>[x/1000,z/1000]))); }
      catch { return [[pts,...holes]]; }
    }
  };
}

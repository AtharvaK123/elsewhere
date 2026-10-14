import { Euler, Vector3 } from 'three';

// Real-world speeds in meters per second: an everyday walk (5 km/h), a steady run (about 14 km/h),
// and flight (Shift boosts flight to about 160 km/h).
export const SPEED = { walk: 1.4, run: 3.8, fly: 12, flyFast: 45 };

// Movement intent from held keys: x is right(+)/left(-), z is back(+)/forward(-).
export function moveInput(keys) {
  return {
    x: Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft')),
    z: Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup')),
    running: keys.has('shift')
  };
}

export class FirstPersonLook {
  constructor(canvas, camera){
    this.canvas=canvas;this.camera=camera;this.active=false;this.yaw=0;this.pitch=0;this.dragging=false;
    canvas.addEventListener('pointerdown',e=>{if(!this.active||e.button!==0)return;this.dragging=true;this.last={x:e.clientX,y:e.clientY};if(e.pointerType==='mouse'&&canvas.requestPointerLock){Promise.resolve(canvas.requestPointerLock()).catch(()=>{});}else canvas.setPointerCapture(e.pointerId);});
    document.addEventListener('pointermove',e=>{if(!this.active)return;const locked=document.pointerLockElement===canvas;if(!locked&&!this.dragging)return;const dx=locked?e.movementX:e.clientX-this.last.x,dy=locked?e.movementY:e.clientY-this.last.y;this.last={x:e.clientX,y:e.clientY};this.yaw-=dx*.0025;this.pitch=Math.max(-1.45,Math.min(1.45,this.pitch-dy*.0025));});
    const stop=()=>this.dragging=false;canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);canvas.addEventListener('lostpointercapture',stop);window.addEventListener('blur',()=>this.release());
  }
  release(){this.dragging=false;if(document.pointerLockElement===this.canvas)document.exitPointerLock();}
  update(feet,bob=0,eye=1.68){this.camera.position.copy(feet).add(new Vector3(0,eye+bob,0));this.camera.quaternion.setFromEuler(new Euler(this.pitch,this.yaw,0,'YXZ'));}
}

import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const errors=[],checks=[];
try {
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 // This suite checks retention of unchanged geometry. Detail replacements have a separate
 // atomic-swap test and intentionally create new meshes when richer data arrives.
 await page.addInitScript(()=>localStorage.setItem('elsewhere:config',JSON.stringify({osmDetails:false,supabaseUrl:'',supabaseKey:''})));
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error'&&/THREE.WebGLProgram|shader error/i.test(m.text()))errors.push(m.text());});
 await page.goto('http://127.0.0.1:4173',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__elsewhere?.getState().provider==='openfreemap'&&!window.__elsewhere.getState().refreshing&&window.__elsewhere.getState().chunks>100,null,{timeout:60000});
 await page.waitForTimeout(2000);
 const state=()=>page.evaluate(()=>window.__elsewhere.getState());
 const initial=await state();assert.equal(initial.renderDistance,1200);assert.ok(initial.buildingCount>2000);
 assert.ok(initial.residentChunks.every(c=>c.detailVisible));
 await page.screenshot({path:'artifacts/world-street.png'});
 const checkRetained=(before,after)=>{
  const present=new Map(after.residentChunks.map(c=>[c.key,c]));
  let checked=0;
  for(const c of before.residentChunks){const b=c.bounds,p=after.position;const d=Math.hypot(Math.max(b.minX-p.x,0,p.x-b.maxX),Math.max(b.minZ-p.z,0,p.z-b.maxZ));if(d>after.renderDistance)continue;
   assert.equal(present.get(c.key)?.uuid,c.uuid,'resident mesh identity survives walking and turning');assert.equal(present.get(c.key).detailVisible,true);checked++;
  }
  assert.ok(checked>20);
 };
 await page.locator('#world').focus();const beforeWalk=await state();await page.keyboard.down('s');await page.waitForTimeout(1600);await page.keyboard.up('s');
 const afterWalk=await state();assert.ok(Math.hypot(afterWalk.position.x-beforeWalk.position.x,afterWalk.position.z-beforeWalk.position.z)>1);checkRetained(initial,afterWalk);
 await page.evaluate(()=>window.__elsewhere.turn(Math.PI));await page.waitForTimeout(600);checkRetained(afterWalk,await state());checks.push('walking and 180-degree turns retain visible meshes and props');
 await page.keyboard.press('f');await page.evaluate(()=>{window.__elsewhere.nudge(350,0,160);window.__elsewhere.look(.9,-.4);});
 await page.waitForTimeout(5000);const moved=await state();checkRetained(afterWalk,moved);
 assert.ok(moved.residentChunks.some(c=>!initial.residentChunks.some(i=>i.key===c.key)));checks.push('crossing chunk boundaries loads new streets while preserving nearby blocks');
 await page.screenshot({path:'artifacts/world-city.png'});
 // Advance close to the floating-origin threshold, let this region load, then cross it.
 await page.evaluate(()=>{const p=window.__elsewhere.getState().position;window.__elsewhere.nudge(5990-p.x,-p.z,650-p.y);});
 await page.waitForTimeout(9000);
 const beforeRebase=await state();assert.ok(beforeRebase.chunks>20);
 await page.evaluate(()=>window.__elsewhere.nudge(20,0));await page.waitForFunction(()=>Math.abs(window.__elsewhere.getState().position.x)<100,null,{timeout:10000});
 const rebased=await state(), ids=new Set(rebased.residentChunks.map(c=>c.uuid));
 assert.ok(beforeRebase.residentChunks.filter(c=>ids.has(c.uuid)).length>20,'origin changes retain existing geometry');
 assert.notEqual(rebased.origin.lon,beforeRebase.origin.lon);checks.push('long journeys rebase without clearing the world');
 await page.locator('#settings-button').click();
 await page.locator('#render-distance').fill('1600');await page.locator('#render-distance').dispatchEvent('input');assert.equal((await state()).renderDistance,1600);
 await page.keyboard.press('Escape');checks.push('view-distance slider updates streaming immediately');
 await page.locator('[data-view="discover"]').click();await page.locator('[data-place="paris"]').click();
 await page.waitForFunction(()=>window.__elsewhere.getState().placeId==='paris'&&!window.__elsewhere.getState().busy,null,{timeout:60000});
 assert.equal((await state()).provider,'openfreemap');await page.waitForTimeout(1500);await page.screenshot({path:'artifacts/world-paris.png'});
 await page.locator('#day-button').click();assert.equal((await state()).night,true);await page.screenshot({path:'artifacts/world-night.png'});checks.push('destination travel and animated night materials');
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth&&document.documentElement.scrollHeight===innerHeight),true);await page.screenshot({path:'artifacts/world-mobile.png'});checks.push('mobile full-screen layout');
 assert.deepEqual(errors,[]);
 await writeFile('artifacts/streaming-qa.json',JSON.stringify({success:true,checks,initialBuildings:initial.buildingCount,initialChunks:initial.chunks,errors},null,2));
 console.log(JSON.stringify({success:true,checks,errors}));
} finally {await browser.close();}

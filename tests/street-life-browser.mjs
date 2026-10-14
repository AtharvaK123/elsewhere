import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:900}});
await context.addInitScript(()=>{if(!localStorage.getItem('elsewhere:config'))localStorage.setItem('elsewhere:config',JSON.stringify({osmDetails:false,renderDistance:650,crowdDensity:70,supabaseUrl:'',supabaseKey:''}));});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
const state=()=>page.evaluate(()=>window.__elsewhere.getState());
try{
  await page.goto('http://127.0.0.1:4173',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__elsewhere?.getState().streetLife.count>0,null,{timeout:45000});
  // Let the initial background tile replacement settle before comparing residents.
  await page.waitForFunction(()=>!window.__elsewhere.getState().refreshing,null,{timeout:60000});
  await page.waitForTimeout(2500);
  const initial=await state();await page.waitForTimeout(2500);const after=await state();
  assert.ok(after.streetLife.count<=56);assert.equal(after.nearby,0,'ambient people do not inflate online presence');
  assert.ok(after.streetLife.samples.some(a=>{const b=initial.streetLife.samples.find(b=>b.id===a.id);return b&&Math.hypot(a.x-b.x,a.z-b.z)>.2;}),'residents actually walk');
  await page.locator('[data-view="discover"]').click();await page.locator('#destination').fill('40.5264, -74.4414');await page.locator('#go-button').click();
  await page.waitForFunction(()=>window.__elsewhere.getState().placeId.startsWith('location-')&&!window.__elsewhere.getState().busy,null,{timeout:60000});
  await page.waitForFunction(()=>window.__elsewhere.getState().structures.storefronts>=3,null,{timeout:30000});
  const rutgers=await state();assert.equal(rutgers.provider,'openfreemap');
  const shop=rutgers.shopfronts.find(s=>s.name==="Henry's Diner")||rutgers.shopfronts[0];
  await page.evaluate(shop=>{const p=window.__elsewhere.getState().position;window.__elsewhere.nudge(shop.x+shop.nx*11-p.x,shop.z+shop.nz*11-p.z,-p.y);window.__elsewhere.look(Math.atan2(shop.nx,shop.nz),.04);},shop);
  await page.waitForTimeout(3000);await page.screenshot({path:'artifacts/street-life-rutgers.png'});
  const resident=(await state()).streetLife.samples[0];assert.ok(resident);
  await page.evaluate(a=>{const p=window.__elsewhere.getState().position;window.__elsewhere.nudge(a.x-Math.sin(a.yaw)*4-p.x,a.z-Math.cos(a.yaw)*4-p.z,a.y-p.y);window.__elsewhere.look(a.yaw+Math.PI,-.13);},resident);
  await page.screenshot({path:'artifacts/street-life-pedestrian.png'});
  await page.locator('#settings-button').click();await page.locator('#crowd-density').evaluate(e=>{e.value=0;e.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.equal((await state()).streetLife.count,0);
  await page.locator('#crowd-density').evaluate(e=>{e.value=50;e.dispatchEvent(new Event('input',{bubbles:true}));});
  await page.locator('#settings-form button[type="submit"]').click();
  await page.waitForFunction(()=>window.__elsewhere.getState().streetLife.count>0);assert.ok((await state()).streetLife.count<=40);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('elsewhere:config')).crowdDensity),50);
  await page.locator('#day-button').click();await page.waitForTimeout(1200);await page.screenshot({path:'artifacts/street-life-night.png'});
  await page.setViewportSize({width:390,height:844});await page.locator('#settings-button').click();assert.ok(await page.locator('#crowd-density').isVisible());
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:'artifacts/street-life-mobile.png'});
  assert.deepEqual(errors,[]);
  await writeFile('artifacts/street-life-qa.json',JSON.stringify({success:true,initialCrowd:initial.streetLife.count,rutgersCrowd:rutgers.streetLife.count,shops:rutgers.shopfronts,render:rutgers.renderStats,errors},null,2));
  console.log('Street life browser checks passed.',JSON.stringify({crowd:rutgers.streetLife.count,shops:rutgers.shopfronts.length,render:rutgers.renderStats}));
}catch(error){await page.screenshot({path:'artifacts/street-life-failure.png'}).catch(()=>{});const s=await state().catch(()=>null);console.log('Failure',JSON.stringify(s&&{provider:s.provider,place:s.placeId,busy:s.busy,refreshing:s.refreshing,people:s.streetLife.count,shops:s.shopfronts.length,errors}));throw error;}
finally{await browser.close();}

import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:1100},deviceScaleFactor:1});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>window.__elsewhere?.getState().buildingCount>100,{timeout:60000});
 await page.screenshot({path:'artifacts/desktop.png',fullPage:true});
 const initial=await page.evaluate(()=>window.__elsewhere.getState());console.log('Initial scene',initial);
 const liveServices=await page.evaluate(async()=>{
   const results={};
   for(const[name,url]of [['search','https://photon.komoot.io/api/?q=Flatiron%20Building&limit=1'],['geometry','https://overpass-api.de/api/interpreter?data='+encodeURIComponent('[out:json][timeout:10];way[building](around:80,40.7411,-73.9897);out tags geom;')]]){
     try{const response=await fetch(url,{signal:AbortSignal.timeout(15000)});const data=await response.json();results[name]={status:response.status,count:(data.features||data.elements||[]).length};}catch(e){results[name]={error:e.message};}
   }return results;
 });console.log('Live service checks',liveServices);
 await page.locator('#save-place').click();assert.ok(await page.locator('#save-place').evaluate(e=>e.classList.contains('saved')));
 await page.locator('[data-view="saved"]').click();assert.equal(await page.locator('.destination-card').count(),1);
 await page.locator('[data-view="explore"]').click();
 await page.locator('#day-button').click();assert.equal(await page.evaluate(()=>window.__elsewhere.getState().night),true);
 await page.locator('#day-button').click();await page.locator('#explore-button').click();
 const before=await page.evaluate(()=>window.__elsewhere.getState().position);await page.keyboard.down('s');await page.waitForTimeout(600);await page.keyboard.up('s');
 const after=await page.evaluate(()=>window.__elsewhere.getState().position);assert.ok(Math.hypot(after.x-before.x,after.z-before.z)>1,'Walking changes player position');await page.locator('#explore-button').click();
 await page.locator('#travel-mode').selectOption('warp');await page.locator('[data-place="paris"]').click();await page.waitForFunction(()=>window.__elsewhere.getState().placeId==='paris'&&!window.__elsewhere.getState().busy,{timeout:40000});
 assert.match(await page.locator('#data-status').innerText(),/buildings/);await page.screenshot({path:'artifacts/paris.png',fullPage:true});
 await page.locator('#travel-mode').selectOption('cloud');await page.locator('[data-place="tokyo"]').click();await page.waitForFunction(()=>window.__elsewhere.getState().placeId==='tokyo'&&!window.__elsewhere.getState().busy,{timeout:40000});
 await page.locator('#travel-mode').selectOption('portal');await page.locator('[data-place="santorini"]').click();await page.waitForFunction(()=>window.__elsewhere.getState().placeId==='santorini'&&!window.__elsewhere.getState().busy,{timeout:40000});
 await page.locator('[data-place="new-york"]').click();await page.waitForFunction(()=>window.__elsewhere.getState().placeId==='new-york'&&!window.__elsewhere.getState().busy,{timeout:40000});
 await page.locator('#invite-button').click();const link=await page.locator('#party-link').inputValue();const friend=await context.newPage();await friend.goto(link,{waitUntil:'networkidle'});await friend.waitForFunction(()=>window.__elsewhere?.getState().room,{timeout:60000});await page.waitForFunction(()=>window.__elsewhere.getState().peers===1,{timeout:15000});
 await friend.locator('#invite-button').click();await page.locator('#chat-message').fill('Hello from the other side!');await page.locator('#chat-form button').click();await friend.locator('#chat-log').getByText('Hello from the other side!',{exact:false}).waitFor();console.log('Local multiplayer presence and chat passed');await friend.close();await page.locator('#close-modal').click();
 await page.route('https://photon.komoot.io/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({features:[{type:'Feature',geometry:{type:'Point',coordinates:[-.158,51.523]},properties:{name:'221B Baker Street',city:'London',country:'United Kingdom'}}]})}));
 await page.route('https://overpass-api.de/**',route=>route.fulfill({status:503,body:'Unavailable'}));
 await page.locator('#destination').fill('221B Baker Street London');await page.locator('#go-button').click();await page.locator('.search-result').waitFor();await page.locator('.search-result').click();await page.waitForFunction(()=>!window.__elsewhere.getState().busy);assert.equal(await page.evaluate(()=>window.__elsewhere.getState().placeId),'new-york');assert.match(await page.locator('#toast').innerText(),/unavailable/);console.log('Search resolution and failed travel preserve existing world');
 await page.locator('#settings-button').click();await page.locator('#supabase-key').fill('sb_secret_not-for-browsers');await page.locator('#settings-form button[type="submit"]').click();assert.match(await page.locator('#settings-error').innerText(),/public/);await page.locator('#close-modal').click();
 await page.locator('#destination').fill('');await page.locator('#world-tab').click();await page.setViewportSize({width:390,height:844});await page.waitForTimeout(4700);await page.screenshot({path:'artifacts/mobile.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'Mobile has no horizontal overflow');
 await page.locator('#help-button').click();assert.ok(await page.locator('#modal').evaluate(e=>e.open));await page.keyboard.press('Escape');
 assert.deepEqual(errors,[]);console.log('All browser checks passed.');await writeFile('artifacts/qa.json',JSON.stringify({success:true,initial,liveServices,errors,checks:['4 destination scenes','3 travel effects','save places','day/night','walking','local multiplayer','party chat','address resolution','failed travel recovery','secret key rejection','mobile overflow','keyboard dialog']},null,2));
}finally{await browser.close();}

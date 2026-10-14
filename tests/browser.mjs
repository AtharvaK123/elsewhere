import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
// Travel tests run as if no account project were configured; accounts are checked separately.
await context.addInitScript(()=>{if(!localStorage.getItem('elsewhere:config'))localStorage.setItem('elsewhere:config',JSON.stringify({supabaseUrl:'',supabaseKey:''}));});
const page=await context.newPage();const errors=[];const checks=[];
page.on('pageerror',e=>errors.push(e.message));
const state=()=>page.evaluate(()=>window.__elsewhere.getState());
// The world is ready once it is built and the loading screen (which covers shader warm-up) has lifted.
const ready=async p=>p.waitForFunction(()=>window.__elsewhere?.getState().buildingCount>100&&document.querySelector('#scene-loading').hidden,null,{timeout:45000});
const destination=async(id,mode)=>{
 await page.locator('[data-view="discover"]').click();
 await page.locator('#travel-mode').selectOption(mode);
 await page.locator(`[data-place="${id}"]`).click();
 await page.waitForFunction(id=>window.__elsewhere.getState().placeId===id&&!window.__elsewhere.getState().busy,id,{timeout:60000});
 assert.equal((await state()).provider,'openfreemap');
 assert.equal(await page.locator('#travel-panel').isVisible(),false);
};
try{
 const start=Date.now();await page.goto('http://127.0.0.1:4173',{waitUntil:'domcontentloaded'});await ready(page);
 const firstWorldMs=Date.now()-start;assert.equal(await page.locator('#scene-loading').isVisible(),false);
 console.log('Starting world visible in',firstWorldMs,'ms');
 await page.waitForFunction(()=>!window.__elsewhere.getState().refreshing,null,{timeout:60000});
 const initial=await state();assert.equal(initial.provider,'openfreemap');
 assert.equal(await page.locator('#openmaptiles-credit').isVisible(),true);
 const viewport=await page.evaluate(()=>({canvas:document.querySelector('canvas').getBoundingClientRect().toJSON(),width:innerWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight}));
 assert.equal(viewport.canvas.width,viewport.width);assert.equal(viewport.canvas.height,viewport.height);assert.equal(viewport.scrollHeight,viewport.height);
 await page.screenshot({path:'artifacts/game-desktop.png'});checks.push('full viewport canvas and immediate starting world');
 await page.locator('#save-place').click();await page.locator('[data-view="saved"]').click();assert.equal(await page.locator('.destination-card').count(),1);
 await page.locator('[data-view="explore"]').click();assert.equal(await page.locator('#travel-panel').isVisible(),false);
 await page.keyboard.press('t');assert.equal(await page.locator('#travel-panel').isVisible(),true);await page.locator('.panel-heading').click();
 await page.waitForTimeout(300);await page.screenshot({path:'artifacts/game-travel.png'});await page.keyboard.press('Escape');
 await page.locator('#day-button').click();assert.equal((await state()).night,true);await page.screenshot({path:'artifacts/game-night.png'});await page.locator('#day-button').click();
 assert.equal((await state()).walking,true,'The world starts on foot');await page.locator('#world').focus();
 const before=(await state()).position;let moved=false;
 for(const key of ['s','w','a','d']){await page.keyboard.down(key);await page.waitForTimeout(1500);await page.keyboard.up(key);const after=(await state()).position;if(Math.hypot(after.x-before.x,after.z-before.z)>1){moved=true;break;}}
 assert.ok(moved,'Walking changes player position');await page.screenshot({path:'artifacts/game-walking.png'});
 await page.keyboard.press(' ');await page.waitForTimeout(100);await page.keyboard.press(' ');assert.equal((await state()).flying,true,'double space starts flying');await page.keyboard.down(' ');await page.waitForTimeout(1500);await page.keyboard.up(' ');assert.ok((await state()).position.y>3,'flying climbs');await page.keyboard.press('f');await page.waitForFunction(()=>window.__elsewhere.getState().grounded,null,{timeout:20000});
 checks.push('glass menus, bookmarks, keyboard shortcuts, day/night, walking, flying and landing');
 await destination('paris','warp');console.log('Paris live tiles and warp passed');
 await destination('tokyo','cloud');console.log('Tokyo live tiles and cloud passed');
 await destination('santorini','portal');console.log('Santorini live tiles and portal passed');
 await page.locator('[data-view="discover"]').click();await page.locator('#destination').fill('51.5007, -0.1246');await page.locator('#go-button').click();
 await page.waitForFunction(()=>window.__elsewhere.getState().placeId.startsWith('location-')&&!window.__elsewhere.getState().busy,null,{timeout:60000});
 assert.equal((await state()).provider,'openfreemap');assert.ok((await state()).buildingCount>100);checks.push('3 transitions and unbundled coordinate destination');
 await destination('new-york','portal');
 await page.locator('#invite-button').click();const link=await page.locator('#party-link').inputValue();const friend=await context.newPage();await friend.goto(link,{waitUntil:'domcontentloaded'});
 await friend.waitForFunction(()=>window.__elsewhere?.getState().room,null,{timeout:45000});await page.waitForFunction(()=>window.__elsewhere.getState().peers===1,null,{timeout:15000});
 await friend.locator('#invite-button').click();await page.locator('#chat-message').fill('Hello from the other side!');await page.locator('#chat-form button').click();await friend.locator('#chat-log').getByText('Hello from the other side!',{exact:false}).waitFor();
 await friend.close();await page.locator('#close-modal').click();checks.push('two tab party presence and chat');console.log('Party presence and chat passed');
 await context.route('https://photon.komoot.io/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({features:[{type:'Feature',geometry:{type:'Point',coordinates:[151.215,-33.8568]},properties:{name:'Sydney Opera House',city:'Sydney',country:'Australia'}}]})}));
 await context.route('https://tiles.openfreemap.org/**',route=>route.fulfill({status:503,body:'Unavailable'}));
 await page.locator('[data-view="discover"]').click();await page.locator('#destination').fill('Sydney Opera House');await page.locator('#go-button').click();await page.locator('.search-result').click();await page.waitForFunction(()=>!window.__elsewhere.getState().busy,null,{timeout:45000});
 assert.equal((await state()).placeId,'new-york');assert.match(await page.locator('#toast').innerText(),/unavailable/i);checks.push('address resolution and failed travel keeps current world');
 await page.locator('#settings-button').click();assert.equal(await page.locator('#maptiler-key').count(),0);assert.equal(await page.locator('#openfreemap-url').inputValue(),'https://tiles.openfreemap.org/planet');
 await page.locator('#supabase-key').fill('sb_secret_not-for-browsers');await page.locator('#settings-form button[type="submit"]').click();assert.match(await page.locator('#settings-error').innerText(),/public/);await page.keyboard.press('Escape');
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(4700);await page.screenshot({path:'artifacts/game-mobile.png'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth&&document.documentElement.scrollHeight===innerHeight),true);
 await page.locator('[data-view="discover"]').click();await page.waitForTimeout(300);await page.screenshot({path:'artifacts/game-mobile-travel.png'});
 assert.ok(await page.locator('#go-button').isVisible());await page.locator('#close-travel-panel').click();
 if(!(await state()).walking)await page.locator('#explore-button').click();const touchBefore=(await state()).position;
 // Real touch controls are checked with a mouse down/up as pointer capture requires an active pointer.
 const move=page.locator('[data-move="s"]');const box=await move.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.waitForTimeout(1500);await page.mouse.up();
 assert.ok(Math.hypot((await state()).position.x-touchBefore.x,(await state()).position.z-touchBefore.z)>1);
 await page.locator('#help-button').click();assert.ok(await page.locator('#modal').evaluate(e=>e.open));await page.keyboard.press('Escape');checks.push('mobile viewport, menu, touch movement, dialog');
 const slow=await browser.newContext({viewport:{width:1024,height:768}});const held=[];
 await slow.route('**/config.json',route=>new Promise(resolve=>held.push(()=>route.abort().catch(()=>{}).finally(resolve))));
 await slow.route('https://tiles.openfreemap.org/**',route=>new Promise(resolve=>held.push(()=>route.fulfill({status:503,body:'Unavailable'}).catch(()=>{}).finally(resolve))));
 const offline=await slow.newPage();await offline.goto('http://127.0.0.1:4173',{waitUntil:'domcontentloaded'});await ready(offline);
 assert.equal(await offline.locator('#scene-loading').isVisible(),false);assert.equal(await offline.evaluate(()=>window.__elsewhere.getState().provider),'snapshot');
 await offline.locator('[data-view="discover"]').click();assert.ok(await offline.locator('#travel-panel').isVisible());
 await offline.waitForFunction(()=>window.__elsewhere.getState().refreshing,null,{timeout:10000});
 for(let i=0;held.length<2&&i<50;i++)await new Promise(resolve=>setTimeout(resolve,100));assert.equal(held.length,2);
 for(const release of held)await release();await offline.waitForFunction(()=>!window.__elsewhere.getState().refreshing,null,{timeout:10000});
 assert.match(await offline.locator('#data-status').innerText(),/Offline OSM snapshot/);assert.equal(await offline.locator('#openfreemap-credit').isVisible(),false);await slow.close();
 checks.push('hung configuration and failed live tiles do not block game');console.log('Slow startup recovery passed');
 const broken=await browser.newPage();await broken.route('**/app.js',route=>route.fulfill({status:404,body:'Missing'}));await broken.goto('http://127.0.0.1:4173');await broken.locator('#scene-error').waitFor();assert.equal(await broken.locator('#scene-loading').isVisible(),false);await broken.close();
 const file=await browser.newPage();await file.goto(pathToFileURL(path.resolve('dist/index.html')).href);await file.locator('#scene-error').waitFor();assert.match(await file.locator('#scene-error-text').innerText(),/local game server/);await file.close();checks.push('missing bundle and direct file startup show recovery instructions');
 assert.deepEqual(errors,[]);console.log('All game browser checks passed.');await writeFile('artifacts/qa.json',JSON.stringify({success:true,firstWorldMs,initial,checks,errors},null,2));
}catch(error){await page.screenshot({path:'artifacts/failure.png'}).catch(()=>{});console.log('Failure state',await state().catch(()=>null));throw error;}
finally{await browser.close();}

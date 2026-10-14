import { createIcons, Compass, Globe2, Bookmark, UsersRound, CircleHelp, SlidersHorizontal, UserRoundPlus, Sparkles, Search, Orbit, ArrowUpRight, Shuffle, MapPin, Sun, Moon, VolumeX, Volume2, Maximize, Minimize, Footprints, ArrowRight, Mouse, MoveVertical, Keyboard, Plus, Minus, Navigation, X, Check, Link, Send, Plug, RefreshCw, Plane, PlaneLanding, Lock, LogIn, LogOut, Mail } from 'lucide';
import { normalizeAppearance, previewAvatar } from './avatar.js';
import { project, unproject } from './geo.js';
import { World } from './world.js';
import { OSM_DETAILS_URL } from './osm-details.js';
import { DEFAULT_RENDER_DISTANCE } from './chunks.js';
import { Party } from './party.js';
import { DESTINATIONS, parseCoordinates } from './geo.js';
import { TileClient, OPENFREEMAP_TILEJSON } from './map-client.js';
const icons={Compass,Globe2,Bookmark,UsersRound,CircleHelp,SlidersHorizontal,UserRoundPlus,Sparkles,Search,Orbit,ArrowUpRight,Shuffle,MapPin,Sun,Moon,VolumeX,Volume2,Maximize,Minimize,Footprints,ArrowRight,Mouse,MoveVertical,Keyboard,Plus,Minus,Navigation,X,Check,Link,Send,Plug,RefreshCw,Plane,PlaneLanding,Lock,LogIn,LogOut,Mail};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const drawIcons=()=>createIcons({icons,attrs:{'stroke-width':1.7}});
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(`elsewhere:${key}`))??fallback;}catch{return fallback;}};
const save=(key,value)=>{try{localStorage.setItem(`elsewhere:${key}`,JSON.stringify(value));}catch{toast('Your browser could not save this preference.');}};
let profile=read('profile',{name:'Just exploring'}),saved=read('saved',[]),config={},world,current=DESTINATIONS[0],busy=false,tripController=null,view='explore',showAll=false,night=false,room=null,partyStatus='solo',chatMessages=[],partyDestination=null,toastTimer,searchController,refreshController,refreshing=false,cloudStatus='local',cloudError='',avatarPreview=null;
profile={name:typeof profile.name==='string'?profile.name.slice(0,24):'Explorer',appearance:normalizeAppearance(profile.appearance)};
const client=new TileClient(3),searchCache=new Map(),params=new URLSearchParams(location.search);
const party=new Party({onAccount:user=>accountChanged(user),onPeers:peers=>{world?.updatePeers(peers);updateConnection();if($('#party-list'))renderPartyMembers();},onChat:message=>{chatMessages.push(message);chatMessages=chatMessages.slice(-50);renderChat();},onStatus:status=>{partyStatus=status;updateConnection();},onProfile:value=>{profile=value;save('profile',profile);updateProfile();world?.setAppearance(profile.appearance);party.update(profile);},onCloud:(status,error)=>{cloudStatus=status;cloudError=error||'';if($('#cloud-status'))$('#cloud-status').textContent=cloudDescription();},onTravel:place=>{partyDestination=place;toast(`Your party is exploring ${place.name}. Open Your party to join them.`);if($('#follow-party'))$('#follow-party').hidden=false;}});
function cloudDescription(){return cloudStatus==='ready'?`Signed in as ${party.account?.email||'your account'}. Your explorer is saved to your account.`:cloudStatus==='signed-out'?'Guest explorer, saved on this device. Create a free account to travel anywhere, save your explorer online, and play with friends.':cloudStatus==='connecting'?'Connecting to your player database...':cloudStatus==='error'?'Supabase needs setup: '+cloudError:'Player saved on this device. Add Supabase in Settings to save online.';}
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,4500);}
function setIcon(button,name){button.innerHTML=`<i data-lucide="${name}"></i>`;drawIcons();}
function updateProfile(){const initial=profile.name.trim().charAt(0).toUpperCase()||'E';$('#player-label').textContent=profile.name;$('#profile-button').firstChild.textContent=initial;$('#profile-button').style.background=profile.appearance.shirt;world?.setAppearance(profile.appearance);}
function updateConnection(){const n=party.peers.size;if($('#nearby-count'))$('#nearby-count').textContent=(world?.nearbyCount||0)+' nearby';if($('#party-info'))$('#party-info').textContent=partyStatus==='online'?'Online. Nearby players appear in the same real-world location. Share the room link to meet friends.':partyStatus==='error'?'Online connection needs setup. '+(party.lastError||'Check your Supabase Realtime settings.'):'Local room. Open this link in another tab, or add Supabase in Settings to play across devices.';$('#connection-status').textContent=room?(partyStatus==='online'?`${n+1} explorer${n?'s':''} · Online`:partyStatus==='error'?'Connection unavailable':`${n+1} explorer${n?'s':''} · Local party`):'Solo session';$('#player-mode').textContent=room?`${n+1} in party`:'Solo';}
function renderCards(){const list=view==='saved'?saved:DESTINATIONS.slice(0,showAll?6:4);$('#destinations-heading').textContent=view==='saved'?'Your saved places':'Pick a portal';$('#view-destinations').hidden=view==='saved';$('#view-destinations').innerHTML=showAll?'Fewer destinations<i data-lucide="arrow-right"></i>':'More destinations<i data-lucide="arrow-right"></i>';$('#empty-saved').hidden=!(view==='saved'&&!list.length);$('#destination-grid').innerHTML=list.map(place=>`<article class="destination-card" data-place="${escapeHTML(place.id)}" tabindex="0" role="button" aria-label="Travel to ${escapeHTML(place.name)}"><div class="destination-photo"><img src="./assets/${escapeHTML(place.image||'new-york')}.jpg" alt="${escapeHTML(place.name)} cityscape" loading="lazy"><span class="destination-tag">${escapeHTML(place.tag||'YOUR COLLECTION')}</span>${canVisit(place)?'':'<span class="destination-lock"><i data-lucide="lock"></i>Account</span>'}<button class="destination-save ${saved.some(s=>s.id===place.id)?'saved':''}" data-save="${escapeHTML(place.id)}" aria-label="${saved.some(s=>s.id===place.id)?'Unsave':'Save'} ${escapeHTML(place.name)}"><i data-lucide="bookmark"></i></button></div><div class="destination-info"><div class="destination-name">${escapeHTML(place.name)}<span class="destination-country">${escapeHTML(place.region)}</span></div><i data-lucide="arrow-up-right"></i></div><div class="destination-subtitle">${escapeHTML(place.subtitle||'A place with a story of your own.')}</div></article>`).join('');$('#saved-dot').hidden=!saved.length;drawIcons();$$('.destination-card').forEach(card=>{const place=list.find(p=>p.id===card.dataset.place);card.addEventListener('click',e=>{if(e.target.closest('[data-save]'))toggleSave(place);else travel(place);});card.addEventListener('keydown',e=>{if(e.target===card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();travel(place);}});});}
function toggleSave(place){const index=saved.findIndex(p=>p.id===place.id);if(index<0){saved.push({...place});toast(`${place.name} saved to your places.`);}else{saved.splice(index,1);toast(`${place.name} removed from saved places.`);}save('saved',saved);renderCards();updateSave();}
function updateSave(){const isSaved=saved.some(p=>p.id===current.id);$('#save-place').classList.toggle('saved',isSaved);$('#save-place').setAttribute('aria-label',isSaved?'Unsave this place':'Save this place');}
function setView(next){
  view=next;showAll=false;
  const open=next!=='explore';$('#travel-panel').hidden=!open;
  $('#panel-title').textContent=next==='saved'?'Your places.':'Where to?';
  $$('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===next);if(b.hasAttribute('aria-expanded'))b.setAttribute('aria-expanded',String(open&&b.dataset.view===next));});
  $('#search-results').hidden=true;world?.releaseInput();renderCards();
  if(!open)$('#world').focus({preventScroll:true});
}
function coordinates(place){return `${Math.abs(place.lat).toFixed(4)}° ${place.lat>=0?'N':'S'}  ${Math.abs(place.lon).toFixed(4)}° ${place.lon>=0?'E':'W'}`;}
const tileJSONUrl=()=>config.openFreeMapUrl||OPENFREEMAP_TILEJSON;
const SNAPSHOTS=new Set(['new-york','tokyo','paris','santorini']);
// Guests tour the four starter cities; an account unlocks every destination. This is a game
// rule enforced in the browser, not access control over public map data.
const GUEST_RANGE=3000;let pendingTrip=null,guestToast=0;
// Without a Supabase project there are no accounts to require, so nothing is locked.
const accountsEnabled=()=>!!(config.supabaseUrl&&config.supabaseKey);
const canVisit=place=>!accountsEnabled()||!!party.account||hasSnapshot(place);
function accountChanged(user){
  renderCards();if($('#account-panel'))renderAccount();if($('#cloud-status'))$('#cloud-status').textContent=cloudDescription();
  if(!user)return;
  if(room)connectParty(room);
  if(pendingTrip){const place=pendingTrip;pendingTrip=null;if($('#modal').open)$('#modal').close();toast(`Welcome, ${profile.name}. Every destination is open to you.`);travel(place);}
}
// Keep guests within walking (or flying) distance of their starter city.
function guestBoundary(){
  if(!accountsEnabled()||party.account||!world?.place||busy)return;
  const [cx,cz]=project(current.lat,current.lon,world.place),p=world.player.position,dx=p.x-cx,dz=p.z-cz,d=Math.hypot(dx,dz);if(d<=GUEST_RANGE)return;
  const k=(GUEST_RANGE-5)/d;p.x=cx+dx*k;p.z=cz+dz*k;world.velocity.set(0,0,0);
  if(Date.now()-guestToast>8000){guestToast=Date.now();toast(`Guests explore ${current.name} and the other starter cities. Create a free account to keep going.`);}
}
function hasSnapshot(place){return SNAPSHOTS.has(place.id)&&DESTINATIONS.some(p=>p.id===place.id&&p.lat===place.lat&&p.lon===place.lon);}
// Loads the area around a destination (live tiles, or the bundled snapshot as a fallback) and enters it.
async function enter(place,{signal,onProgress,onStage}={}){
  try{await world.travelTo(place,{signal,tileJSONUrl:tileJSONUrl(),onProgress,onStage});}
  catch(error){
    // Keep the four bundled worlds available during provider outages. Never substitute
    // a different destination, and identify snapshot data in the visible source badge.
    if(signal?.aborted||!hasSnapshot(place))throw error;
    await client.snapshot(new URL(`./assets/${place.id}.json`,location.href).href,{signal});
    await world.travelTo(place,{signal,source:'snapshot',onStage});
  }
}
async function travel(place,{initial=false,announce=true}={}){
  if(busy)return;
  if(!canVisit(place)){pendingTrip=place;openAccount(`Create a free account to visit ${place.name}. Guests can tour New York, Tokyo, Paris, and Santorini.`);return;}refreshController?.abort();refreshing=false;setView('explore');busy=true;tripController=new AbortController();const signal=tripController.signal;$('#search-results').hidden=true;$('#go-button').disabled=true;
  const mode=$('#travel-mode').value;const overlay=$('#travel-overlay');overlay.className=`travel-overlay ${mode}`;
  $('#travel-eyebrow').textContent={portal:'OPENING A PORTAL',warp:'ENGAGING WARP DRIVE',cloud:'TAKING THE SCENIC ROUTE'}[mode];$('#travel-title').textContent=`Next stop, ${place.name}.`;$('#travel-detail').textContent='Loading streets, buildings, and a new perspective…';$('#travel-bar').style.width='2%';if(!initial)overlay.hidden=false;$('#scene-error').hidden=true;
  const started=performance.now();
  try{
    // The trip is the loading screen: it stays up until the destination is fully built and its graphics are warm.
    await enter(place,{signal,onStage:(message,fraction)=>{$('#travel-detail').textContent=message;$('#travel-bar').style.width=Math.round(Math.max(2,fraction*100))+'%';if(!$('#scene-loading').hidden)$('#loading-detail').textContent=message;}});
    if(signal.aborted)return;
    arrived(place);
    if(!initial&&!matchMedia('(prefers-reduced-motion: reduce)').matches)await new Promise(resolve=>setTimeout(resolve,Math.max(0,1200-(performance.now()-started))));
    party.update({placeId:place.id,position:{lat:place.lat,lon:place.lon}});if(room&&announce&&!initial)party.send('travel',place);
    if(world.provider==='snapshot')toast('OpenFreeMap could not load. Showing this destination’s bundled OSM snapshot.');
    else if(!initial)toast(`Welcome to ${place.name}. Make yourself at home.`);
    if(!initial)save('lastPlace',place);
  }catch(error){if(!signal.aborted&&error.name!=='AbortError'){if(initial){$('#scene-error-text').textContent=error.message||'Unable to load this world. Try again.';$('#scene-error').hidden=false;}else toast(error.name==='TimeoutError'?'The map service took too long. Your current world is still here. Try again shortly.':(error.message||'Unable to load this destination.')+' Your current world is still here.');}}
  finally{busy=false;$('#scene-loading').hidden=true;overlay.hidden=true;$('#go-button').disabled=false;tripController=null;}
}
function arrived(place){
  current=place;
  $('#location-name').textContent=place.id==='new-york'?'Lower Manhattan':place.name;
  $('#location-region').textContent=place.id==='new-york'?'New York, United States':place.region||'Your next adventure';
  $('#destination').value='';updateSave();updateDataStatus();updateMovement();
  $('#scene-loading').hidden=true;$('#scene-error').hidden=true;world.updatePeers([...party.peers.values()]);updateConnection();
}
function updateDataStatus(){
  if(refreshing||!world?.place)return;
  $('#data-status').textContent=(world.provider==='openfreemap'?'OpenFreeMap':'Offline OSM snapshot')+' / '+world.buildingCount.toLocaleString()+' buildings';
  $('#data-status').title=world.provider==='openfreemap'?({loading:'Loading mapped building types, floor counts, materials, and road widths',ready:'Local OpenStreetMap structure details loaded'+(world.details.footprintCount?`, plus ${world.details.footprintCount.toLocaleString()} surveyed footprints for buildings the map is missing`:'')+'. Unmapped heights and facades remain estimates.',unavailable:'Detailed OpenStreetMap lookup unavailable; showing base tiles. Retrying in the background.',off:'Detailed structure lookup is disabled.'}[world.details.status]||'Base map ready'): 'Bundled map snapshot';
  $('#openfreemap-credit').hidden=world.provider!=='openfreemap';$('#footprints-credit').hidden=!(world.provider==='openfreemap'&&world.details.footprintCount>0);$('#openmaptiles-credit').hidden=world.provider!=='openfreemap';
}
function showResults(places,message){const host=$('#search-results');host.hidden=false;host.innerHTML=message?`<div class="search-message">${escapeHTML(message)}</div>`:places.map((p,i)=>`<button class="search-result" data-result="${i}"><i data-lucide="map-pin"></i><span><strong>${escapeHTML(p.name)}</strong><small>${escapeHTML(p.region)} · ${p.lat.toFixed(4)}, ${p.lon.toFixed(4)}</small></span><i data-lucide="arrow-up-right"></i></button>`).join('');drawIcons();host.querySelectorAll('[data-result]').forEach(b=>b.addEventListener('click',()=>travel(places[Number(b.dataset.result)])));}
let lastSearch=0;
async function search(event){event?.preventDefault();const query=$('#destination').value.trim();if(!query){showResults(DESTINATIONS.slice(0,4));$('#destination').focus();return;}const coords=parseCoordinates(query);if(coords){travel(coords);return;}const local=DESTINATIONS.filter(p=>[p.name,p.region,p.id].some(s=>s.toLowerCase()===query.toLowerCase()));if(local.length){showResults(local);return;}if(searchCache.has(query)){showResults(searchCache.get(query));return;}
  if(Date.now()-lastSearch<1200){showResults([],'Give that search a moment, then try again.');return;}lastSearch=Date.now();searchController?.abort();searchController=new AbortController();showResults([],'Looking for your next adventure…');$('#go-button').disabled=true;
  try{const url=new URL(config.photonUrl||'https://photon.komoot.io/api/');url.searchParams.set('q',query);url.searchParams.set('limit','5');url.searchParams.set('lang','en');
    const response=await fetch(url,{signal:AbortSignal.any([searchController.signal,AbortSignal.timeout(15000)])});if(!response.ok)throw new Error('Search is unavailable right now. Try a featured destination or enter latitude, longitude.');const data=await response.json();
    const places=(data.features||[]).filter(f=>f.geometry?.type==='Point'&&Number.isFinite(f.geometry.coordinates[0])&&Number.isFinite(f.geometry.coordinates[1])&&Math.abs(f.geometry.coordinates[1])<=85).map(f=>{const p=f.properties||{},[lon,lat]=f.geometry.coordinates;return{id:`location-${lat.toFixed(5)}-${lon.toFixed(5)}`,name:f.text||p.name||[p.street,p.housenumber].filter(Boolean).join(' ')||query,region:f.place_name||[p.city,p.state,p.country].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(', '),lat,lon,radius:900};});
    if(!places.length)showResults([],'No places found. Try a city, a fuller address, or latitude, longitude.');else{searchCache.set(query,places);showResults(places);}
  }catch(error){if(error.name!=='AbortError')showResults([],error.name==='TimeoutError'?'Search took too long. Try again or choose a featured destination.':error.message);}finally{if(!busy)$('#go-button').disabled=false;}
}
function updateMovement(){
  if(!world)return;const first=world.walkView==='first';
  $('#perspective-button').setAttribute('aria-label',first?'Switch to third person':'Switch to first person');$('#perspective-button').title=first?'Third person (V)':'First person (V)';
  $('#world').classList.add('walking');$('#world').classList.toggle('first-person',first);$('#world').classList.toggle('flying',world.flying);
  $('#explore-button').innerHTML=world.flying?'<i data-lucide="plane-landing"></i><span>Land</span><kbd>F</kbd>':'<i data-lucide="plane"></i><span>Fly</span><kbd>F</kbd>';
  $('#explore-button').setAttribute('aria-label',world.flying?'Stop flying':'Fly');
  $('#movement-hint').textContent=world.flying?'WASD TO FLY / SPACE UP / C DOWN / SHIFT FASTER / DOUBLE SPACE TO LAND':'CLICK TO LOOK / WASD TO WALK / SHIFT TO RUN / DOUBLE SPACE TO FLY';
  $('#mobile-movement').hidden=false;drawIcons();updateElevation();
}
function updateElevation(){if(world?.place)$('#elevation').textContent=`${world.walkView==='first'?'FIRST':'THIRD'} PERSON · ${world.flying?'FLYING':world.grounded?'ON FOOT':'IN THE AIR'} · ${Math.round(world.player.position.y)} M`;}
function toggleFlying(){if(!world?.place)return;world.setFlying(!world.flying);updateMovement();}
function openModal(title,body){avatarPreview?.dispose();avatarPreview=null;world?.releaseInput();$('#modal-content').innerHTML=`<div class="modal-heading"><h2>${title}</h2><button id="close-modal" aria-label="Close dialog"><i data-lucide="x"></i></button></div>${body}`;drawIcons();if(!$('#modal').open)$('#modal').showModal();$('#close-modal').onclick=()=>$('#modal').close();}
function openHelp(){openModal('Make yourself at home.',`<p class="modal-description">A whole world, at your own pace. Search a city, landmark, address, or coordinates, choose your travel style, and jump in.</p><div class="controls-list"><span class="keys"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span><span>Walk at a real 5 km/h</span><span class="keys"><kbd>Shift</kbd></span><span>Run (about 14 km/h), or fly faster</span><span class="keys"><kbd>Space</kbd></span><span>Jump; while flying, rise</span><span class="keys"><kbd>Space</kbd><kbd>Space</kbd></span><span>Double tap to fly or land (also <kbd>F</kbd>)</span><span class="keys"><kbd>C</kbd></span><span>Fly down</span><span class="keys"><kbd>Click</kbd></span><span>Mouse look (Esc releases)</span><span class="keys"><kbd>V</kbd></span><span>First / third person</span><span class="keys"><kbd>+</kbd><kbd>-</kbd></span><span>Zoom the view</span><span class="keys"><kbd>T</kbd><kbd>/</kbd></span><span>Open destination search</span></div><div class="info-box">One world unit is one metre. Mapped footprints and available heights keep their scale; missing heights and street details are estimated. Streets, buildings, parks, and street furniture come from OpenFreeMap; facade windows, flowers, yards, and cars are generated details. The world is built around you out to your view distance (Settings) and keeps loading as you walk or fly.</div><button class="button primary full-width" id="got-it">Let’s explore<i data-lucide="arrow-right"></i></button>`);$('#got-it').onclick=()=>$('#modal').close();}
function openProfile(){
  openModal('Your explorer.',`<div class="avatar-preview" id="avatar-preview"></div><p class="avatar-caption">Your look, wherever you go.</p><form id="profile-form"><label class="modal-field"><span>Explorer name</span><input id="explorer-name" value="${escapeHTML(profile.name)}" required maxlength="24"></label><div class="appearance-colors">${['skin','shirt','pants','hair'].map(key=>'<label><input type="color" id="avatar-'+key+'" value="'+profile.appearance[key]+'"><span>'+key+'</span></label>').join('')}</div><div class="appearance-options"><label class="modal-field"><span>Headwear</span><select id="avatar-hat"><option value="cap">Cap</option><option value="beanie">Beanie</option><option value="none">No hat</option></select></label><label class="backpack-toggle"><input type="checkbox" id="avatar-backpack" ${profile.appearance.backpack?'checked':''}>Backpack</label></div><p id="cloud-status" class="modal-description">${escapeHTML(cloudDescription())}</p><button class="button primary full-width" type="submit">Save explorer<i data-lucide="check"></i></button></form><button class="button full-width account-link" id="account-link" type="button"><i data-lucide="${party.account?'log-out':'log-in'}"></i>${party.account?'Account and sign out':'Sign in or create an account'}</button>`);
  $('#account-link').onclick=()=>openAccount();
  $('#avatar-hat').value=profile.appearance.hat;
  const appearance=()=>normalizeAppearance({...Object.fromEntries(['skin','shirt','pants','hair'].map(key=>[key,$('#avatar-'+key).value])),hat:$('#avatar-hat').value,backpack:$('#avatar-backpack').checked});
  try{avatarPreview=previewAvatar($('#avatar-preview'),profile.appearance);}catch{$('#avatar-preview').textContent='Your colors will appear on your player in the world.';}
  $('#profile-form').oninput=()=>avatarPreview?.update(appearance());
  $('#profile-form').onsubmit=async e=>{e.preventDefault();const name=$('#explorer-name').value.trim();if(!name)return;profile={name,appearance:appearance()};save('profile',profile);updateProfile();party.update(profile);
    const button=$('#profile-form button[type="submit"]');button.disabled=true;
    try{const online=await party.saveProfile(profile);$('#modal').close();toast(online?'Explorer saved to Supabase.':'Explorer saved on this device.');}
    catch{$('#cloud-status').textContent='Saved on this device. Cloud save failed; try again when connected.';}
    finally{button.disabled=false;}
  };
}
function openAccount(reason=''){
  openModal(party.account?'Your account.':'Join the explorers.',`<div id="account-panel"></div>`);
  $('#account-panel').dataset.reason=reason;renderAccount();
}
function renderAccount(mode=$('#account-panel')?.dataset.mode||'signup'){
  const panel=$('#account-panel');if(!panel)return;panel.dataset.mode=mode;const reason=panel.dataset.reason||'';
  if(!config.supabaseUrl||!config.supabaseKey){panel.innerHTML='<p class="modal-description">Accounts need a Supabase project. Add its URL and publishable key in Settings.</p>';return;}
  if(party.account){panel.innerHTML=`<p class="modal-description">Signed in as <strong>${escapeHTML(party.account.email)}</strong>. Every destination is open, your explorer is saved online, and you can play with friends on other devices.</p><button class="button full-width" id="sign-out"><i data-lucide="log-out"></i>Sign out</button><p class="modal-description" id="account-error" role="alert"></p>`;drawIcons();
    $('#sign-out').onclick=async()=>{$('#sign-out').disabled=true;try{await party.signOut();$('#modal').close();toast('Signed out. Guests can tour the starter cities.');if(!hasSnapshot(current))travel(DESTINATIONS[0]);}catch(error){$('#account-error').textContent=error.message;$('#sign-out').disabled=false;}};return;}
  const signup=mode==='signup';
  panel.innerHTML=`<p class="modal-description">${escapeHTML(reason||'Guests can tour New York, Tokyo, Paris, and Santorini. A free account opens the whole world, saves your explorer online, and lets you play with friends.')}</p>
  <div class="account-tabs" role="tablist"><button type="button" role="tab" aria-selected="${signup}" data-mode="signup">Create account</button><button type="button" role="tab" aria-selected="${!signup}" data-mode="signin">Sign in</button></div>
  <form id="account-form">${signup?`<label class="modal-field"><span>Explorer name</span><input id="account-name" value="${escapeHTML(profile.name)}" maxlength="24" required autocomplete="nickname"></label>`:''}
  <label class="modal-field"><span>Email</span><input id="account-email" type="email" required autocomplete="email" maxlength="254"></label>
  <label class="modal-field"><span>Password</span><input id="account-password" type="password" required minlength="8" autocomplete="${signup?'new-password':'current-password'}"><small>${signup?'At least 8 characters.':''}</small></label>
  <p class="modal-description" id="account-error" role="alert"></p>
  <button class="button primary full-width" type="submit"><i data-lucide="${signup?'mail':'log-in'}"></i>${signup?'Create account':'Sign in'}</button></form>`;
  drawIcons();
  panel.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>renderAccount(b.dataset.mode));
  $('#account-form').onsubmit=async e=>{e.preventDefault();const button=$('#account-form button[type="submit"]'),email=$('#account-email').value.trim(),password=$('#account-password').value;button.disabled=true;$('#account-error').textContent='';
    try{
      if(!party.client)await party.configure(config,profile);
      if(signup){const name=$('#account-name').value.trim()||profile.name;profile={...profile,name};save('profile',profile);updateProfile();
        const result=await party.signUp({email,password,name});
        if(result==='confirm'){panel.innerHTML=`<p class="modal-description">Almost there. We sent a confirmation link to <strong>${escapeHTML(email)}</strong>. Open it in this browser and you will be signed in here.</p>`;return;}}
      else await party.signIn({email,password});
      if($('#modal').open&&!pendingTrip){$('#modal').close();toast(`Welcome, ${profile.name}. Every destination is open to you.`);}
    }catch(error){$('#account-error').textContent=/invalid login/i.test(error.message)?'That email and password do not match an account.':/not confirmed/i.test(error.message)?'Please confirm your email first, using the link we sent you.':error.message;}
    finally{button.disabled=false;}
  };
}
function openSettings(){openModal('Your world, connected.',`<p class="modal-description">OpenFreeMap powers your world. Connect your player database to meet other explorers.</p><form id="settings-form"><h3 class="modal-subheading"><i data-lucide="globe-2"></i>OpenFreeMap</h3><div class="info-box">Buildings, streets, parks, water, and street furniture come from OpenFreeMap at real scale. Loaded blocks stay around you in every direction. The world expands ahead as you walk or fly. OpenStreetMap adds mapped building types, floor counts, parts, materials, and road widths in the background. Mapped businesses gain shop windows, awnings, and signs. Facade styling, pedestrians, landscaping, parked cars, and unmapped heights are illustrative. Address search uses Photon.</div><label class="modal-field"><span>View distance: <output id="render-distance-value">${world?.renderDistance||DEFAULT_RENDER_DISTANCE} m</output></span><input id="render-distance" type="range" min="250" max="2500" step="50" value="${world?.renderDistance||DEFAULT_RENDER_DISTANCE}"><small>1,200 m by default. Buildings and props stay loaded across this range; farther views need more memory.</small></label><label class="modal-field"><span>Street life: <output id="crowd-density-value">${world?.pedestrians.density??60}%</output></span><input id="crowd-density" type="range" min="0" max="100" step="10" value="${world?.pedestrians.density??60}"><small>Animated ambient pedestrians on sidewalks and footpaths. These are simulated residents; online explorers appear separately. Set to 0 for quiet streets.</small></label><div class="modal-divider"></div><h3 class="modal-subheading"><i data-lucide="users-round"></i>Multiplayer across devices</h3><label class="modal-field"><span>Supabase project URL</span><input id="supabase-url" type="url" placeholder="https://your-project.supabase.co" value="${escapeHTML(config.supabaseUrl||'')}"></label><label class="modal-field"><span>Supabase publishable key</span><input id="supabase-key" type="password" autocomplete="off" placeholder="sb_publishable_…" value="${escapeHTML(config.supabaseKey||'')}"><small>Use a publishable key or legacy anon key. Never a secret or service-role key.</small></label><div class="info-box">Run the database setup below in your Supabase SQL editor and keep Email sign-in enabled in Authentication. Players create an account with email and password; their look is saved to the database. Guests without an account tour the starter cities. Live rooms show positions, outfits, and chat. Without Supabase, rooms connect tabs in this browser.</div><a class="button full-width" href="./setup/world.sql" download="elsewhere-world.sql">Download Supabase database setup</a><p class="modal-description">${escapeHTML(cloudDescription())}</p><details><summary class="field-label">Advanced map services</summary><label class="backpack-toggle"><input id="osm-details" type="checkbox" ${config.osmDetails!==false?'checked':''}>Load detailed OpenStreetMap structures</label><label class="backpack-toggle"><input id="building-footprints" type="checkbox" ${config.buildingFootprints!==false?'checked':''}>Fill in unmapped U.S. buildings from FEMA/ORNL footprints</label><label class="modal-field"><span>Overpass-compatible structure endpoint</span><input id="osm-details-url" type="url" value="${escapeHTML(config.osmDetailsUrl||OSM_DETAILS_URL)}"><small>${escapeHTML(world?.details.status==='unavailable'?'Detail service unavailable. Base map remains playable; retries run in the background.':'Looks up the area around you. Cached locally for one day.')}</small></label><label class="modal-field"><span>Photon-compatible search endpoint</span><input id="photon-url" type="url" value="${escapeHTML(config.photonUrl||'https://photon.komoot.io/api/')}"></label><label class="modal-field"><span>OpenFreeMap TileJSON endpoint</span><input id="openfreemap-url" type="url" value="${escapeHTML(config.openFreeMapUrl||OPENFREEMAP_TILEJSON)}"></label></details><p id="settings-error" class="modal-description" role="alert"></p><button class="button primary full-width" type="submit">Save connections<i data-lucide="check"></i></button></form>`);
  $('#settings-form').onsubmit=async e=>{e.preventDefault();const key=$('#supabase-key').value.trim(),url=$('#supabase-url').value.trim();let invalid=key.startsWith('sb_secret_');if(key.startsWith('eyJ')){try{const payload=JSON.parse(atob(key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));invalid=payload.role!=='anon';}catch{invalid=true;}}else if(key&&!key.startsWith('sb_publishable_'))invalid=true;
    if(invalid){$('#settings-error').textContent='Please use a public publishable or legacy anon key. Secret keys do not belong in a browser.';return;}if(!!key!==!!url){$('#settings-error').textContent='Add both the Supabase URL and its publishable key, or leave both empty.';return;}
    const next={crowdDensity:Number($('#crowd-density').value),osmDetails:$('#osm-details').checked,buildingFootprints:$('#building-footprints').checked,osmDetailsUrl:$('#osm-details-url').value.trim(),supabaseUrl:url,supabaseKey:key,photonUrl:$('#photon-url').value.trim(),openFreeMapUrl:$('#openfreemap-url').value.trim(),renderDistance:Number($('#render-distance').value)};for(const endpoint of [next.photonUrl,next.openFreeMapUrl,next.osmDetailsUrl,url].filter(Boolean)){try{const u=new URL(endpoint);if(u.protocol!=='https:'&&u.hostname!=='localhost'&&u.hostname!=='127.0.0.1')throw new Error();}catch{$('#settings-error').textContent='Please use valid HTTPS service URLs.';return;}}config={...config,...next};delete config.maptilerKey;delete config.overpassUrl;save('config',next);world.configureDetails(config);world.pedestrians.setDensity(config.crowdDensity);searchCache.clear();$('#modal').close();if(config.supabaseUrl&&config.supabaseKey)await connectParty(room||'elsewhere-world');else if(room)await connectParty(room);else await party.configure(config,profile);toast('Settings saved. Your player database is connecting if configured.');};
  $('#crowd-density').oninput=()=>{const value=Number($('#crowd-density').value);$('#crowd-density-value').textContent=value+'%';world?.pedestrians.setDensity(value);};
  $('#render-distance').oninput=()=>{const meters=Number($('#render-distance').value);$('#render-distance-value').textContent=meters+' m';world?.setRenderDistance(meters);};
}
async function connectParty(code){room=code;await party.connect(room,config,{...profile,placeId:current.id,position:world?.place?unproject(world.player.position.x,world.player.position.z,world.place):{lat:current.lat,lon:current.lon},heading:world?.look.yaw||0});updateConnection();}
function inviteUrl(){const url=new URL(location.href);url.search='';url.searchParams.set('room',room);url.searchParams.set('place',current.id);url.searchParams.set('lat',current.lat);url.searchParams.set('lon',current.lon);url.searchParams.set('name',current.name);return url.toString();}
async function openParty(){if(!room)await connectParty(config.supabaseUrl&&config.supabaseKey?'elsewhere-world':crypto.randomUUID().replace(/-/g,'').slice(0,16));openModal('Better with company.',`<p class="modal-description">A shared place for a little collective wandering.</p><div class="info-box" id="party-info">${partyStatus==='online'?'Online. Nearby players appear together at their real-world coordinates. Share the room link to meet friends.':'Local room is ready. Open the link in another tab. Add Supabase in Settings for database profiles and online play.'}</div><div id="party-list"></div><label class="modal-field"><span>Your party link</span><input id="party-link" value="${escapeHTML(inviteUrl())}" readonly></label><button class="button primary full-width" id="copy-invite"><i data-lucide="link"></i>Copy invite link</button><button class="button full-width" id="follow-party" ${partyDestination?'':'hidden'}><i data-lucide="arrow-up-right"></i>Jump to your party</button><div class="chat-log" id="chat-log" aria-live="polite"></div><form class="chat-form" id="chat-form"><label class="sr-only" for="chat-message">Message your party</label><input id="chat-message" placeholder="Say hello to your party…" maxlength="300" required><button type="submit" aria-label="Send message"><i data-lucide="send"></i></button></form><button class="text-button full-width" id="leave-party">Leave party</button>`);renderPartyMembers();renderChat();$('#copy-invite').onclick=async()=>{try{await navigator.clipboard.writeText(inviteUrl());toast('Invite link copied. Adventure loves company.');$('#copy-invite').innerHTML='<i data-lucide="check"></i>Link copied';drawIcons();}catch{$('#party-link').select();toast('Select and copy the party link above.');}};$('#chat-form').onsubmit=e=>{e.preventDefault();const text=$('#chat-message').value.trim();if(!text)return;party.chat(text);$('#chat-message').value='';};$('#follow-party').onclick=()=>{if(partyDestination){$('#modal').close();travel(partyDestination,{announce:false});}};$('#leave-party').onclick=async()=>{await party.disconnect();room=null;partyStatus='solo';partyDestination=null;chatMessages=[];updateConnection();$('#modal').close();toast('You’re back on your own adventure.');};}
function renderPartyMembers(){if(!$('#party-list'))return;$('#party-list').innerHTML=[{name:profile.name,id:party.id},...party.peers.values()].map(p=>`<div class="party-member"><div class="party-circle">${escapeHTML(p.name.charAt(0).toUpperCase())}</div>${escapeHTML(p.name)}<span>${p.id===party.id?'You':'Exploring'}</span></div>`).join('');}
function renderChat(){if(!$('#chat-log'))return;$('#chat-log').innerHTML=chatMessages.length?chatMessages.map(m=>`<div><strong>${escapeHTML(m.name)}:</strong> ${escapeHTML(m.text)}</div>`).join(''):'Your party conversation starts here.';$('#chat-log').scrollTop=$('#chat-log').scrollHeight;}
let audioContext=null,audioGain=null,sound=false;
async function toggleSound(){try{if(!audioContext){audioContext=new AudioContext();const buffer=audioContext.createBuffer(1,audioContext.sampleRate*4,audioContext.sampleRate);const noise=buffer.getChannelData(0);let last=0;for(let i=0;i<noise.length;i++){last=(last+Math.random()*.04-.02)/1.02;noise[i]=last*3;}const source=audioContext.createBufferSource();source.buffer=buffer;source.loop=true;const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=450;audioGain=audioContext.createGain();audioGain.gain.value=0;source.connect(filter).connect(audioGain).connect(audioContext.destination);source.start();}await audioContext.resume();sound=!sound;audioGain.gain.setTargetAtTime(sound?.17:0,audioContext.currentTime,.3);setIcon($('#sound-button'),sound?'volume-2':'volume-x');$('#sound-button').setAttribute('aria-label',sound?'Mute ambient sound':'Enable ambient sound');toast(sound?'A little atmosphere. Ambient sound is on.':'Ambient sound is off.');}catch{toast('Audio is unavailable in this browser.');}}

$('#search-form').addEventListener('submit',search);
$('#destination').addEventListener('focus',()=>{if(!$('#destination').value)showResults(DESTINATIONS.slice(0,4));});
document.addEventListener('click',e=>{if(!e.target.closest('.search-panel'))$('#search-results').hidden=true;});
$$('[data-view]').forEach(button=>button.onclick=()=>setView(view===button.dataset.view?'explore':button.dataset.view));
$('#close-travel-panel').onclick=()=>setView('explore');
$('.brand-mark').onclick=e=>{e.preventDefault();setView('explore');};$('.wordmark').onclick=e=>{e.preventDefault();setView('explore');};
$('#view-destinations').onclick=()=>{showAll=!showAll;renderCards();};
$('#perspective-button').onclick=()=>{world?.togglePerspective();updateMovement();};
$('#modal').addEventListener('close',()=>{avatarPreview?.dispose();avatarPreview=null;});
$('#save-place').onclick=()=>toggleSave(current);
$('#surprise-button').onclick=()=>{const options=DESTINATIONS.slice(0,4).filter(p=>p.id!==current.id);travel(options[Math.floor(Math.random()*options.length)]);};
$('#explore-button').onclick=toggleFlying;
$('#data-chip').onclick=()=>{if(!busy&&!refreshing)refreshLiveMap();};
$('#reset-view').onclick=()=>{world?.faceNorth();toast('Facing north.');};
$('#zoom-in').onclick=()=>world?.zoom(.8);$('#zoom-out').onclick=()=>world?.zoom(1.25);
$('#day-button').onclick=()=>{night=!night;world?.setNight(night);$('#world').classList.toggle('night',night);setIcon($('#day-button'),night?'moon':'sun');$('#day-button').setAttribute('aria-label',night?'Switch to day':'Switch to night');};
$('#sound-button').onclick=toggleSound;
$('#fullscreen-button').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if($('#world').requestFullscreen)await document.documentElement.requestFullscreen();else toast('Fullscreen is not supported in this browser.');}catch{toast('Fullscreen is unavailable in this view.');}};
document.addEventListener('fullscreenchange',()=>setIcon($('#fullscreen-button'),document.fullscreenElement?'minimize':'maximize'));
$('#controls-button').onclick=openHelp;$('#help-button').onclick=openHelp;$('#settings-button').onclick=openSettings;$('#profile-button').onclick=openProfile;$('#invite-button').onclick=openParty;$('#party-nav').onclick=openParty;
$('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=$('#modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#modal').close();}});
$('#cancel-travel').onclick=()=>{tripController?.abort();toast('Trip canceled. Stay a little longer.');};
$('#retry-scene').onclick=()=>{if(!world||world.contextLost)location.reload();else travel(current,{initial:true});};
// Space: jump on foot, rise while flying; a quick double tap starts or stops flying.
let lastSpace=0;
const MOVE_KEYS=['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright','shift','c','control'];
window.addEventListener('keydown',e=>{if(e.key==='Escape'){tripController?.abort();setView('explore');}if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)||$('#modal').open||busy)return;const key=e.key.toLowerCase();
  if(key==='v'){world?.togglePerspective();updateMovement();return;}
  if(key==='f'&&world?.place){e.preventDefault();toggleFlying();return;}
  if(key==='/'||key==='t'){e.preventDefault();setView(view==='explore'?'discover':'explore');if(view==='discover')$('#destination').focus();return;}
  if(view!=='explore'||!world?.place)return;
  if(key===' '){e.preventDefault();world.keys.add(' ');if(e.repeat)return;const now=performance.now();if(now-lastSpace<330){lastSpace=0;toggleFlying();return;}lastSpace=now;world.jump();return;}
  if(MOVE_KEYS.includes(key)){e.preventDefault();world.keys.add(key);}});
window.addEventListener('keyup',e=>world?.keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>world?.keys.clear());
$$('[data-move]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);world?.keys.add(b.dataset.move);if(b.dataset.move===' ')world?.jump();});['pointerup','pointercancel','lostpointercapture'].forEach(type=>b.addEventListener(type,()=>world?.keys.delete(b.dataset.move)));});
window.addEventListener('beforeunload',()=>party.send('leave',{}));

async function refreshLiveMap(){
  if(busy||refreshing||!world?.place)return;
  refreshing=true;refreshController=new AbortController();const controller=refreshController;const place=current;
  $('#data-status').textContent='Loading live OpenFreeMap...';
  try{await world.travelTo(place,{signal:controller.signal,tileJSONUrl:tileJSONUrl(),preserve:true,onProgress:(done,total)=>{$('#data-status').textContent='OpenFreeMap / '+done+' of '+total+' blocks';}});refreshing=false;updateDataStatus();}
  catch(error){if(!controller.signal.aborted&&error.name!=='AbortError'){$('#data-status').textContent=(world.provider==='snapshot'?'Offline OSM snapshot':'Current map')+' / tap to retry';toast('Live tiles could not load. Your current world is ready to explore.');}}
  finally{if(refreshController===controller){refreshing=false;refreshController=null;}}
}
let settingsLoad=null;
const settingsPromiseFor=()=>settingsLoad??=(async()=>{try{const response=await fetch('./config.json',{signal:AbortSignal.timeout(2500)});config={...(response.ok?await response.json():{}),...read('config',{})};}catch{config=read('config',{});}})();
async function init(){
  drawIcons();renderCards();updateProfile();
  let first=DESTINATIONS[0];const linked=DESTINATIONS.find(p=>p.id===params.get('place'));
  if(linked)first=linked;else if(params.has('lat')&&params.has('lon')){const coordinatePlace=parseCoordinates(params.get('lat')+','+params.get('lon'));if(coordinatePlace)first={...coordinatePlace,name:(params.get('name')||coordinatePlace.name).slice(0,100)};}
  const settingsPromise=settingsPromiseFor();
  current=first;
  if(!hasSnapshot(first)){await settingsPromiseFor();await party.configure(config,profile);if(!party.account){pendingTrip=first;first=current=DESTINATIONS[0];setTimeout(()=>toast(`Sign in or create a free account to visit ${pendingTrip?.name||'that place'}.`),1500);}}
  world=new World($('#scene'),{client,onMove:position=>{guestBoundary();party.update({position:{lat:position.lat,lon:position.lon,y:position.y},heading:position.heading,moving:position.moving,flying:position.flying,placeId:current.id});$('#coordinates').textContent=coordinates(position);updateElevation();}});
  world.onLand=updateMovement;
  let streamToast=0;world.chunks.onError=()=>{if(Date.now()-streamToast>20000){streamToast=Date.now();toast('Some nearby streets could not load yet. We will retry while you explore.');}};
  setInterval(()=>{updateDataStatus();if($('#stream-status'))$('#stream-status').hidden=!world.chunks.loading;},1000);
  world.setAppearance(profile.appearance);
  window.__elsewhere={getState:()=>({placeId:current.id,provider:world.provider,detailStatus:world.details.status,streetLife:world.pedestrians.state,shopfronts:[...world.chunks.chunks.values()].flatMap(c=>c.storefronts||[]).map(s=>({name:s.name,x:s.x,z:s.z,nx:s.nx,nz:s.nz,width:s.width})),visibleLabels:world.mapLabels.visible,structures:[...world.chunks.chunks.values()].reduce((sum,c)=>{for(const [k,v]of Object.entries(c.structures||{}))sum[k]=(sum[k]||0)+v;return sum;},{}),walking:world.walking,flying:world.flying,grounded:world.grounded,position:{...world.player.position},buildingCount:world.buildingCount||0,chunks:world.chunks.loaded,loadingChunks:world.chunks.loading,renderDistance:world.renderDistance,room,peers:party.peers.size,partyStatus,busy,refreshing,night,view,walkView:world.walkView,heading:world.look.yaw,pitch:world.look.pitch,nearby:world.nearbyCount,streaming:world.chunks.loading>0,origin:{lat:world.place?.lat,lon:world.place?.lon},profile,cloudStatus,renderStats:{...world.renderer.info.render},residentChunks:[...world.chunks.chunks.values()].filter(c=>c.state==='ready').map(c=>({key:c.key,uuid:c.group.uuid,detailVisible:c.detail?.visible??true,bounds:c.bounds}))}),turn:radians=>{world.look.yaw+=radians;},look:(yaw,pitch)=>{world.look.yaw=yaw;world.look.pitch=pitch;},nudge:(x,z,y=0)=>{world.player.position.x+=x;world.player.position.z+=z;world.player.position.y+=y;}};
  $('#loading-detail').textContent='Opening your starting world...';
  // The four featured places start instantly from bundled snapshots, then upgrade to live tiles.
  let started=false;
  if(hasSnapshot(first)){try{await client.snapshot(new URL(`./assets/${first.id}.json`,location.href).href);await world.travelTo(first,{source:'snapshot'});arrived(first);started=true;}catch(error){console.warn(error);}}
  await settingsPromise;party.configure(config,profile);world.configureDetails(config);world.pedestrians.setDensity(config.crowdDensity);world.setRenderDistance(config.renderDistance||DEFAULT_RENDER_DISTANCE);
  if(started)refreshLiveMap();else await travel(first,{initial:true});
  const roomCode=params.get('room');if(roomCode&&/^[a-zA-Z0-9_-]{12,64}$/.test(roomCode)){await connectParty(roomCode);toast('You joined the party. Explore together.');}else if(config.supabaseUrl&&config.supabaseKey)await connectParty('elsewhere-world');
}
init().catch(error=>{
  console.error(error);$('#scene-loading').hidden=true;$('#scene-error').hidden=false;
  $('#scene-error-text').textContent='The game could not start 3D graphics. Enable hardware acceleration and reload, or try another browser.';
});

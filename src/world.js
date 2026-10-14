import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeAvatar, applyAppearance, animateAvatar, disposeAvatar } from './avatar.js';
import { FirstPersonLook, moveInput, SPEED } from './first-person.js';
import { facadeMaterial, waterMaterial } from './facades.js';
import { makeSky, SKY } from './scenery.js';
import { carGeometry, CAR_COLORS } from './props.js';
import { ChunkManager, DEFAULT_RENDER_DISTANCE } from './chunks.js';
import { project, unproject, pointInPolygon } from './geo.js';
import { DetailStreamer } from './osm-details.js';
import { MapLabels } from './map-labels.js';
import { Pedestrians } from './pedestrians.js';
import { groundMaterial, grassMaterial, grassGeometry } from './nature.js';

const SUN_DIRECTION = new THREE.Vector3(-.48, .74, -.34).normalize();
const GRAVITY = 9.81, JUMP_SPEED = 4.2, STEP = .45, BODY = 1.75, EYE = 1.68, CELL = 30, REBASE = 6000, MAX_ALTITUDE = 1200;
// Hand-modeled landmarks appear whenever they are within range. `clear` removes the map footprints
// the model replaces so they do not poke through it.
export const LANDMARKS = [
  { name: 'Eiffel Tower', lat: 48.8584, lon: 2.2945, range: 4000, clear: 75, label: 327, model: 'eiffel' },
  { name: 'Brooklyn Bridge', lat: 40.7068, lon: -73.9969, range: 5000, label: 85, model: 'brooklynBridge' },
  { name: 'One World Trade Center', lat: 40.7127, lon: -74.0134, range: 5000, label: 425 },
  { name: 'Shibuya Crossing', lat: 35.6595, lon: 139.7005, range: 2500, label: 25 },
  { name: 'Colosseum', lat: 41.8902, lon: 12.4922, range: 2500, label: 52 },
  { name: 'Big Ben', lat: 51.5007, lon: -0.1246, range: 2500, label: 98 }
];

export class World {
  constructor(container, { client, onMove } = {}) {
    this.container = container; this.onMove = onMove;
    this.keys = new Set(); this.labels = []; this.peers = new Map(); this.collisionGrid = new Map();
    this.walkView = 'first'; this.flying = false; this.night = false; this.nearbyCount = 0; this.stride = 0; this.lastBroadcast = 0; this.lastStream = 0;
    this.velocity = new THREE.Vector3(); this.grounded = true; this.fov = 58; this.renderDistance = DEFAULT_RENDER_DISTANCE;
    this.uniforms = { uNight: { value: 0 }, uTime: { value: 0 }, uSkyTint: { value: new THREE.Color(SKY.day.horizon) } };
    this.scene = new THREE.Scene(); this.scene.fog = new THREE.Fog(SKY.day.fog, this.renderDistance * .65, this.renderDistance * 1.3);
    this.camera = new THREE.PerspectiveCamera(this.fov, 1, .1, 20000);
    // A logarithmic depth buffer keeps centimeter-thin ground layers (paint, curbs, lawns) from flickering.
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance', logarithmicDepthBuffer: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace; this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);
    this.look = new FirstPersonLook(this.renderer.domElement, this.camera);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    Object.assign(this.controls, { enableDamping: true, dampingFactor: .08, minDistance: 1.2, maxDistance: 60, maxPolarAngle: Math.PI * .58, enablePan: false, enabled: false });
    this.controls.addEventListener('end', () => { this.followDistance = this.camera.position.distanceTo(this.controls.target); });
    this.sky = makeSky(); this.sky.mesh.material.depthTest = false; this.scene.add(this.sky.mesh);
    this.ambient = new THREE.HemisphereLight(0xd9ecff, 0x797582, 2.1); this.scene.add(this.ambient);
    this.sun = new THREE.DirectionalLight(0xfff1d6, 2.7); this.sun.castShadow = true; this.sun.shadow.mapSize.set(2048, 2048); this.sun.shadow.bias = -.0004;
    this.scene.add(this.sun, this.sun.target);
    this.materials = {
      solid: facadeMaterial(this.uniforms), water: waterMaterial(this.uniforms),
      ground: groundMaterial(),grass:grassMaterial(this.uniforms),grassGeometry:grassGeometry(),
      pool: new THREE.MeshBasicMaterial({ map: this.glowTexture(), color: 0xffc27a, transparent: true, opacity: .5, blending: THREE.AdditiveBlending, depthWrite: false, visible: false }),
      poolGeometry: new THREE.PlaneGeometry(11, 11).rotateX(-Math.PI / 2)
    };
    this.ground = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xa9ad98, roughness: 1 }));
    this.ground.scale.setScalar(40000); this.ground.position.y = -.05; this.ground.receiveShadow = true;
    // A backdrop beyond the loaded blocks: drawn first without depth, so it can never win a
    // depth contest with the lawns and paving a few centimeters above it.
    this.ground.renderOrder = -1; this.ground.material.depthWrite = false; this.scene.add(this.ground);
    this.root = new THREE.Group(); this.scene.add(this.root);
    this.landmarkRoot = new THREE.Group(); this.scene.add(this.landmarkRoot);
    this.chunks = new ChunkManager({ client, root: this.root, materials: this.materials, addColliders: list => this.addColliders(list), removeColliders: list => this.removeColliders(list) });
    this.details = new DetailStreamer(client, data => this.chunks.refreshBounds(data.bounds));
    this.mapLabels = new MapLabels(document.querySelector('#scene-labels'),document.querySelector('#street-name'));
    this.chunks.onChunk=chunk=>{if(chunk.refreshing&&this.place)this.reconcilePlayer();};
    this.traffic = this.makeTraffic(70);
    this.pedestrians = new Pedestrians(this.scene);
    this.player = makeAvatar(this.appearance); this.player.visible = false; this.scene.add(this.player);
    this.clock = new THREE.Clock(); this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(container);
    this.renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); this.contextLost = true; document.querySelector('#scene-error-text').textContent = 'The 3D graphics context was interrupted. Reload this page to enter the world again.'; document.querySelector('#scene-error').hidden = false; });
    this.setView('first'); this.animate();
  }
  get walking() { return true; }
  get provider() { return this.chunks.provider; }
  get buildingCount() { return this.chunks.buildingCount; }
  setAppearance(appearance) { this.appearance = appearance; applyAppearance(this.player, appearance); }
  releaseInput() { this.keys.clear(); this.look.release(); }
  glowTexture() {
    const size = 64, data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) { const d = Math.hypot(x - size / 2 + .5, y - size / 2 + .5) / (size / 2); data.set([255, 255, 255, Math.round(255 * Math.max(0, 1 - d) ** 1.8)], (y * size + x) * 4); }
    const texture = new THREE.DataTexture(data, size, size); texture.needsUpdate = true; return texture;
  }

  // --- Places --------------------------------------------------------------------------------
  // Loads the area around a destination, then swaps it in. Rejects (keeping the current world) on failure.
  // The trip doubles as a loading screen. Building details and fill-in footprints download
  // alongside the map tiles, so blocks are built once, complete; the neighbourhood is then built
  // out toward the view distance within a time budget, and shaders and geometry reach the GPU
  // before the overlay lifts. `onStage(text, fraction)` reports progress from 0 to 1.
  async travelTo(place, { signal, source = 'live', tileJSONUrl, onProgress, onStage, preserve = false } = {}) {
    const origin = preserve && this.place ? this.place : { lat: place.lat, lon: place.lon };
    const landmarks = LANDMARKS.map(l => ({ ...l, at: project(l.lat, l.lon, origin) })).filter(l => Math.hypot(...l.at) < l.range);
    const clears = landmarks.map(({ at, clear }) => ({ at, clear }));
    const keep = preserve ? this.player.position.clone() : null, x = keep?.x ?? 0, z = keep?.z ?? 0, near = Math.min(this.renderDistance, 320);
    let prepared = false;
    if (source === 'live') {
      const here = unproject(x, z, origin);
      let surveyed = .04; onStage?.('Surveying streets, buildings, and missing footprints', surveyed);
      const creep = setInterval(() => onStage?.('Surveying streets, buildings, and missing footprints', surveyed = Math.min(.19, surveyed + .006)), 400);
      let details;
      try { [details] = await Promise.all([this.details.prepare(here.lat, here.lon, { signal, timeout: 20000 }), this.chunks.prefetchTiles(origin, x, z, preserve ? near : this.renderDistance, { signal, tileJSONUrl })]); }
      finally { clearInterval(creep); }
      prepared = !!details;
      if (details?.footprints) onStage?.(`Filling in ${details.footprints.toLocaleString()} surveyed building footprints`, .2);
    }
    signal?.throwIfAborted();
    const deadline = performance.now() + 9000;
    // A background refresh (preserve) happens while the player is already exploring: keep it light.
    const results = await this.chunks.preload(origin, x, z, preserve ? near : this.renderDistance, { signal, source, tileJSONUrl, landmarks: clears, required: near, deadline, onProgress: (done, total) => { onProgress?.(done, total); onStage?.(`Building the neighborhood · ${done} of ${total} blocks`, .22 + .63 * done / total); } });
    signal?.throwIfAborted();
    this.collisionGrid = new Map();
    this.chunks.install(origin, results, { source, tileJSONUrl, landmarks: clears });
    if (!preserve) this.pedestrians.reset(); else this.pedestrians.nextSync = 0;
    if (!prepared) this.details.reset();
    this.mapLabels.clear();
    this.place = { ...place, lat: origin.lat, lon: origin.lon };
    this.landmarks = landmarks; this.buildLandmarks();
    if (!preserve) { this.spawn(); this.flying = false; this.velocity.set(0, 0, 0); this.look.yaw = 0; this.look.pitch = 0; this.setView(this.walkView); }
    this.chunks.update(this.player.position.x, this.player.position.z);
    onStage?.('Planting grass and warming up the graphics', .9);
    if (!preserve) await this.warmUp();
    onStage?.('Arriving', 1);
    return this.chunks.buildingCount;
  }
  // Compile every material variant and upload geometry and shadows behind the overlay, so the
  // first frames after arrival do not stutter.
  async warmUp() {
    // Background tabs pause animation frames; never let that hold up a trip.
    const within = (promise, ms) => Promise.race([promise, new Promise(resolve => setTimeout(resolve, ms))]);
    try { await within(this.renderer.compileAsync(this.scene, this.camera), 5000); } catch { try { this.renderer.compile(this.scene, this.camera); } catch {} }
    for (let i = 0; i < 3; i++) await within(new Promise(resolve => requestAnimationFrame(() => resolve())), 120);
  }
  // Start on a sidewalk (or path) close to the destination point.
  spawn() {
    let best = null;
    for (const list of this.collisionGrid.values()) for (const c of list) {
      if (!c.platform) continue;
      const x = (c.minX + c.maxX) / 2, z = (c.minZ + c.maxZ) / 2, d = x * x + z * z;
      if ((!best || d < best.d) && !this.collides(x, z, c.maxY)) best = { x, z, d, y: c.maxY };
    }
    if (best) this.player.position.set(best.x, best.y, best.z);
    else { const free = this.freeSpot(0, 0); this.player.position.set(free.x, 0, free.z); }
    this.grounded = true;
  }
  freeSpot(x, z, feet=0) {
    if (!this.collides(x, z, feet)) return { x, z };
    for (let r = 2; r < 150; r += 2) for (let a = 0; a < 16; a++) { const px = x + Math.cos(a / 16 * Math.PI * 2) * r, pz = z + Math.sin(a / 16 * Math.PI * 2) * r; if (!this.collides(px, pz, feet)) return { x: px, z: pz }; }
    return { x, z };
  }
  // A corrected footprint or taller roof must not trap a player inside new geometry.
  reconcilePlayer(){
    const p=this.player.position;if(!this.collides(p.x,p.z,p.y))return;
    const before=p.clone(),roof=this.groundAt(p.x,p.z,10000);
    if(p.y>BODY){p.y=roof;this.velocity.y=0;}
    else{const free=this.freeSpot(p.x,p.z,p.y);p.x=free.x;p.z=free.z;if(this.collides(p.x,p.z,p.y))p.y=roof;}
    const shift=p.clone().sub(before);this.camera.position.add(shift);this.controls.target.add(shift);
  }
  // Moves the world origin under a far-traveling player so coordinates stay precise.
  rebase() {
    const here = unproject(this.player.position.x, this.player.position.z, this.place), origin = { lat: here.lat, lon: here.lon };
    const scaleX = Math.cos(origin.lat * Math.PI / 180) / Math.cos(this.place.lat * Math.PI / 180);
    const shift = new THREE.Vector3(-this.player.position.x * scaleX, 0, -this.player.position.z);
    this.place = { ...this.place, lat: origin.lat, lon: origin.lon };
    this.landmarks = LANDMARKS.map(l => ({ ...l, at: project(l.lat, l.lon, origin) })).filter(l => Math.hypot(...l.at) < l.range);
    this.chunks.rebase(origin, shift.x, shift.z, this.landmarks.map(({ at, clear }) => ({ at, clear })), scaleX);
    this.pedestrians.rebase(shift.x, shift.z, scaleX);
    for (const p of [this.player.position, this.camera.position, this.controls.target]) { p.x *= scaleX; p.add(shift); }
    for (const peer of this.peers.values()) for (const p of [peer.position, peer.userData.target]) if (p) { p.x *= scaleX; p.add(shift); }
    this.buildLandmarks();
  }
  setRenderDistance(meters) {
    this.renderDistance = this.chunks.renderDistance = THREE.MathUtils.clamp(Number.isFinite(meters) ? meters : DEFAULT_RENDER_DISTANCE, 250, 2500);
    this.scene.fog.near = this.renderDistance * .65; this.scene.fog.far = this.renderDistance * 1.3;
    if (this.place) this.chunks.update(this.player.position.x, this.player.position.z, this.velocity.x, this.velocity.z);
  }
  configureDetails(config){this.details.url=config.osmDetailsUrl;this.details.enabled=config.osmDetails!==false;this.details.footprints=config.buildingFootprints!==false;this.details.reset();}
  buildLandmarks() {
    this.landmarkRoot.traverse(o => { o.geometry?.dispose(); o.material?.dispose?.(); }); this.landmarkRoot.clear();
    this.labels.filter(l => l.landmark).forEach(l => l.el.remove()); this.labels = this.labels.filter(l => !l.landmark);
    for (const l of this.landmarks) { if (l.model) this[l.model](this.landmarkRoot, this.place); this.addLabel(l.name, new THREE.Vector3(l.at[0], l.label, l.at[1])).landmark = true; }
  }

  // --- Collision: buildings block you, sidewalks and roofs hold you up -----------------------------
  addColliders(list) {
    for (const c of list) for (let gx = Math.floor(c.minX / CELL); gx <= Math.floor(c.maxX / CELL); gx++) for (let gz = Math.floor(c.minZ / CELL); gz <= Math.floor(c.maxZ / CELL); gz++) {
      const key = gx + ',' + gz; if (!this.collisionGrid.has(key)) this.collisionGrid.set(key, []); this.collisionGrid.get(key).push(c);
    }
  }
  removeColliders(list) {
    const gone = new Set(list), cells = new Set();
    for (const c of list) for (let gx = Math.floor(c.minX / CELL); gx <= Math.floor(c.maxX / CELL); gx++) for (let gz = Math.floor(c.minZ / CELL); gz <= Math.floor(c.maxZ / CELL); gz++) cells.add(gx + ',' + gz);
    for (const key of cells) { const kept = (this.collisionGrid.get(key) || []).filter(c => !gone.has(c)); if (kept.length) this.collisionGrid.set(key, kept); else this.collisionGrid.delete(key); }
  }
  inside(c, x, z) { return x >= c.minX && x <= c.maxX && z >= c.minZ && z <= c.maxZ && pointInPolygon(x, z, c.pts) && !(c.holes || []).some(h => pointInPolygon(x, z, h)); }
  // True when a body standing with feet at height `feet` would be inside something solid at (x, z).
  collides(x, z, feet = 0) {
    for (const c of this.collisionGrid?.get(Math.floor(x / CELL) + ',' + Math.floor(z / CELL)) || []) {
      if (c.platform || (c.maxY ?? Infinity) <= feet + STEP || (c.minY || 0) >= feet + BODY) continue;
      if (World.prototype.inside(c, x, z)) return true;
    }
    return false;
  }
  // Highest surface under (x, z) you could stand on from height `feet` (the ground, a curb, a roof).
  groundAt(x, z, feet) {
    let ground = 0;
    for (const c of this.collisionGrid.get(Math.floor(x / CELL) + ',' + Math.floor(z / CELL)) || []) {
      const top = c.maxY ?? 0; if (top <= ground || top > feet + STEP) continue;
      if (World.prototype.inside(c, x, z)) ground = top;
    }
    return ground;
  }

  // --- Movement -------------------------------------------------------------------------------
  setView(view) {
    this.walkView = view;
    if (view === 'first') {
      this.controls.enabled = false; this.look.active = true; this.player.visible = false;
    } else {
      this.look.active = false; this.look.release(); this.controls.enabled = true; this.player.visible = true;
      this.controls.target.copy(this.player.position).add(new THREE.Vector3(0, 1.4, 0));
      const offset = new THREE.Vector3(0, 1.6, 4.6).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.look.yaw);
      this.camera.position.copy(this.controls.target).add(offset); this.followDistance = offset.length();
    }
    this.camera.fov = view === 'first' ? this.fov : 55; this.camera.updateProjectionMatrix();
  }
  togglePerspective() {
    if (this.walkView === 'third') this.look.yaw = Math.atan2(this.camera.position.x - this.controls.target.x, this.camera.position.z - this.controls.target.z);
    this.setView(this.walkView === 'first' ? 'third' : 'first'); return this.walkView;
  }
  setFlying(enabled) {
    this.flying = enabled; this.velocity.y = 0;
    if (enabled) { this.grounded = false; this.player.position.y += .3; }
  }
  jump() { if (!this.flying && this.grounded) { this.velocity.y = JUMP_SPEED; this.grounded = false; } }
  faceNorth() { this.look.yaw = 0; this.look.pitch = 0; if (this.walkView === 'third') this.setView('third'); }
  zoom(factor) {
    if (this.walkView === 'third') { this.followDistance = THREE.MathUtils.clamp((this.followDistance || 5) * factor, 1.5, 60); return; }
    this.fov = THREE.MathUtils.clamp(this.fov * factor, 15, 58); this.camera.fov = this.fov; this.camera.updateProjectionMatrix();
  }
  move(dt) {
    const p = this.player.position, yaw = this.walkView === 'first' ? this.look.yaw : Math.atan2(this.camera.position.x - this.controls.target.x, this.camera.position.z - this.controls.target.z);
    const { x: ix, z: iz, running } = moveInput(this.keys);
    const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)), right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    const before = p.clone();
    if (this.flying) {
      const speed = running ? SPEED.flyFast : SPEED.fly, dir = new THREE.Vector3();
      if (this.walkView === 'first') dir.copy(forward).multiplyScalar(Math.cos(this.look.pitch)).setY(Math.sin(this.look.pitch)).multiplyScalar(-iz);
      else dir.addScaledVector(forward, -iz);
      dir.addScaledVector(right, ix);
      dir.y += (this.keys.has(' ') ? 1 : 0) - (this.keys.has('c') || this.keys.has('control') ? 1 : 0);
      if (dir.lengthSq() > 1) dir.normalize();
      // Ease toward the target velocity so flight feels like gliding, not teleporting.
      this.velocity.lerp(dir.multiplyScalar(speed), Math.min(1, dt * 4));
      this.step(this.velocity.x * dt, this.velocity.z * dt);
      const ground = this.groundAt(p.x, p.z, p.y), y = Math.min(MAX_ALTITUDE, p.y + this.velocity.y * dt);
      if (y <= ground && this.velocity.y < 0) { p.y = ground; this.flying = false; this.velocity.set(0, 0, 0); this.grounded = true; this.onLand?.(); }
      else if (!this.collides(p.x, p.z, y)) p.y = Math.max(ground, y);
    } else {
      const speed = running ? SPEED.run : SPEED.walk, dir = forward.clone().multiplyScalar(-iz).addScaledVector(right, ix);
      if (dir.lengthSq() > 1) dir.normalize();
      // On the ground you change pace quickly; in the air you keep your momentum.
      const target = dir.multiplyScalar(speed), blend = Math.min(1, dt * (this.grounded ? 12 : 1.5));
      this.velocity.x += (target.x - this.velocity.x) * blend; this.velocity.z += (target.z - this.velocity.z) * blend;
      this.step(this.velocity.x * dt, this.velocity.z * dt);
      this.velocity.y = Math.max(-55, this.velocity.y - GRAVITY * dt);
      const ground = this.groundAt(p.x, p.z, p.y), y = p.y + this.velocity.y * dt;
      if (y <= ground) { p.y = ground; this.velocity.y = 0; this.grounded = true; }
      else { p.y = y; this.grounded = false; }
    }
    const moved = p.clone().sub(before);
    if (this.walkView !== 'first') { this.camera.position.add(moved); this.controls.target.add(moved); }
    this.stride += Math.hypot(moved.x, moved.z);
    return Math.hypot(moved.x, moved.z) / Math.max(dt, 1e-4) > .2;
  }
  // Horizontal motion that slides along walls and steps up curbs.
  step(dx, dz) {
    const p = this.player.position;
    if (!this.collides(p.x + dx, p.z, p.y)) p.x += dx;
    if (!this.collides(p.x, p.z + dz, p.y)) p.z += dz;
    if (this.grounded && !this.flying) p.y = Math.max(p.y, this.groundAt(p.x, p.z, p.y));
  }
  // Third-person camera: pull in when a building is between the camera and the player.
  followCamera() {
    const target = this.controls.target, offset = this.camera.position.clone().sub(target), length = offset.length(); if (length < .01) return;
    const direction = offset.divideScalar(length), wanted = this.followDistance || length;
    let clear = wanted;
    for (let d = 1; d <= wanted; d += .5) { const q = target.clone().addScaledVector(direction, d); if (this.collides(q.x, q.z, q.y - .5)) { clear = Math.max(.8, d - .6); break; } }
    this.camera.position.copy(target).addScaledVector(direction, clear);
    this.player.visible = clear > 1.4;
  }
  updateSun() {
    const focus = this.player.position, altitude = Math.max(0, this.camera.position.y - 2);
    const half = THREE.MathUtils.clamp(140 + altitude * 1.2, 140, 900), texel = half * 2 / this.sun.shadow.mapSize.x, snap = v => Math.round(v / texel) * texel;
    const shadow = this.sun.shadow.camera;
    if (Math.abs(shadow.right - half) > half * .15) { Object.assign(shadow, { left: -half, right: half, top: half, bottom: -half, near: 10, far: 4000 }); shadow.updateProjectionMatrix(); this.sun.shadow.normalBias = texel * 1.2; }
    this.sun.target.position.set(snap(focus.x), 0, snap(focus.z));
    this.sun.position.copy(this.sun.target.position).addScaledVector(SUN_DIRECTION, 1800);
  }

  // --- Traffic: cars drive the streets of nearby chunks in their lane ----------------------------
  makeTraffic(count) {
    const mesh = new THREE.InstancedMesh(carGeometry(), this.materials.solid, count), color = new THREE.Color();
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; mesh.count = 0;
    for (let i = 0; i < count; i++) mesh.setColorAt(i, color.set(CAR_COLORS[i % CAR_COLORS.length]));
    this.scene.add(mesh);
    return { mesh, cars: Array.from({ length: count }, () => ({ road: null })), object: new THREE.Object3D(), pool: [], total: 0, live: new Set(), refreshed: 0 };
  }
  updateTraffic(dt) {
    const t = this.traffic, p = this.player.position, now = performance.now();
    if (now - t.refreshed > 1000) { t.refreshed = now; t.pool = this.chunks.carRoads.filter(r => Math.hypot(r.pts[0][0] - p.x, r.pts[0][1] - p.z) < 450); t.total = t.pool.reduce((sum, r) => sum + r.length, 0); t.live = new Set(t.pool); }
    const active = t.pool.length ? Math.min(t.cars.length, Math.floor(t.total / 90)) : 0;
    t.mesh.count = active;
    const pedestrians = [p, ...[...this.peers.values()].map(peer => peer.position)];
    for (let i = 0; i < active; i++) {
      const car = t.cars[i];
      if (!car.road || !t.live.has(car.road) || (car.position && Math.hypot(car.position.x - p.x, car.position.z - p.z) > 500)) {
        let pick = Math.random() * t.total; car.road = t.pool[0];
        for (const r of t.pool) { pick -= r.length; if (pick <= 0) { car.road = r; break; } }
        Object.assign(car, { s: Math.random() * car.road.length, dir: car.road.oneway || Math.random() < .5 ? 1 : -1, speed: car.road.major ? 11 + Math.random() * 5 : 7 + Math.random() * 4, segment: 0, position: null });
      }
      const { road } = car, blocked = car.position && pedestrians.some(q => Math.abs(q.y - road.y) < 3 && Math.hypot(q.x - car.position.x - car.heading.x * 4.5, q.z - car.position.z - car.heading.z * 4.5) < 3.4);
      if (!blocked) car.s += car.speed * dt * car.dir;
      if (car.s > road.length) { car.s = road.length; car.dir = -1; }
      if (car.s < 0) { car.s = 0; car.dir = 1; }
      const { pts, cumulative } = road;
      while (car.segment < pts.length - 2 && cumulative[car.segment + 1] < car.s) car.segment++;
      while (car.segment > 0 && cumulative[car.segment] > car.s) car.segment--;
      const a = pts[car.segment], b = pts[car.segment + 1], span = cumulative[car.segment + 1] - cumulative[car.segment] || 1;
      const k = (car.s - cumulative[car.segment]) / span, dx = (b[0] - a[0]) / span * car.dir, dz = (b[1] - a[1]) / span * car.dir;
      const lane = road.oneway ? 0 : road.width * .25 * (road.left ? -1 : 1);
      t.object.position.set(a[0] + (b[0] - a[0]) * k - dz * lane, road.y, a[1] + (b[1] - a[1]) * k + dx * lane);
      t.object.rotation.set(0, Math.atan2(dx, dz), 0); t.object.updateMatrix(); t.mesh.setMatrixAt(i, t.object.matrix);
      car.position = { x: t.object.position.x, z: t.object.position.z }; car.heading = { x: dx, z: dz };
    }
    t.mesh.instanceMatrix.needsUpdate = true;
  }

  setNight(enabled) {
    this.night = enabled; const sky = enabled ? SKY.night : SKY.day;
    this.sky.uniforms.top.value.set(sky.top); this.sky.uniforms.horizon.value.set(sky.horizon); this.sky.uniforms.ground.value.set(sky.ground); this.sky.uniforms.night.value = enabled ? 1 : 0;
    this.scene.fog.color.set(sky.fog); this.uniforms.uNight.value = enabled ? 1 : 0; this.uniforms.uSkyTint.value.set(sky.horizon);
    this.ambient.intensity = enabled ? .55 : 2.1; this.sun.intensity = enabled ? .45 : 2.7; this.sun.color.set(enabled ? 0x9fb8ff : 0xfff1d6);
    this.renderer.toneMappingExposure = enabled ? .9 : 1.05; this.materials.pool.visible = enabled;
    this.ground.material.color.set(enabled ? 0x3b4440 : 0xa9ad98);
  }
  updatePeers(players) {
    const ids = new Set();
    for (const p of players) {
      if (!this.place || !p.position) continue; const [x, z] = project(p.position.lat, p.position.lon, this.place);
      if (Math.hypot(x - this.player.position.x, z - this.player.position.z) > this.renderDistance) continue; ids.add(p.id);
      const y = Number.isFinite(p.position.y) ? p.position.y : 0;
      let peer = this.peers.get(p.id);
      if (!peer) { peer = makeAvatar(p.appearance); peer.userData.ring.visible = false; this.scene.add(peer); this.peers.set(p.id, peer); peer.position.set(x, y, z); }
      const appearance = JSON.stringify(p.appearance); if (peer.userData.appearanceKey !== appearance) { applyAppearance(peer, p.appearance); peer.userData.appearanceKey = appearance; }
      peer.userData.target = new THREE.Vector3(x, y, z); peer.userData.heading = p.heading || 0; peer.userData.moving = p.moving && !p.flying;
      if (!peer.userData.label?.el.isConnected) { peer.userData.label = this.addLabel(p.name, peer.position, 'peer', true); peer.userData.label.height = 2.05; }
      else if (peer.userData.name !== p.name) peer.userData.label.el.lastChild.textContent = p.name;
      peer.userData.name = p.name;
    }
    for (const [id, peer] of this.peers) if (!ids.has(id)) { this.scene.remove(peer); peer.userData.label?.el.remove(); this.labels = this.labels.filter(label => label !== peer.userData.label); disposeAvatar(peer); this.peers.delete(id); }
    this.nearbyCount = this.peers.size;
  }
  addLabel(text, position, className = '', follow = false) {
    const el = document.createElement('div'); el.className = `scene-label ${className}`; const dot = document.createElement('span'); dot.className = 'pin';
    el.append(dot, document.createTextNode(text)); document.querySelector('#scene-labels').append(el);
    const label = { el, position: follow ? position : position.clone(), follow }; this.labels.push(label); return label;
  }
  resize() { const w = this.container.clientWidth, h = this.container.clientHeight; if (!w || !h) return; this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.renderer.setSize(w, h); }
  animate = () => {
    this.frame = requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), .1), time = this.clock.elapsedTime, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.uniforms.uTime.value = reduced ? 0 : time;
    let moving = false;
    if (this.place) {
      moving = this.move(dt);
      const p = this.player.position;
      this.player.rotation.y = this.walkView === 'first' ? this.look.yaw : Math.atan2(this.camera.position.x - this.controls.target.x, this.camera.position.z - this.controls.target.z);
      if (time - this.lastStream > .25) { this.lastStream = time; this.chunks.update(p.x, p.z, this.velocity.x, this.velocity.z); if (Math.hypot(p.x, p.z) > REBASE) this.rebase(); if(this.provider==='openfreemap'){const here=unproject(p.x,p.z,this.place);void this.details.update(here.lat,here.lon);} }
      if (time - this.lastBroadcast > .12) { this.lastBroadcast = time; this.onMove?.({ ...unproject(p.x, p.z, this.place), y: p.y, heading: this.player.rotation.y, moving, flying: this.flying }); }
      this.updateTraffic(reduced ? 0 : dt);
      this.pedestrians.update(dt, this, reduced);
    }
    animateAvatar(this.player, time, moving && !this.flying); this.player.userData.ring.visible = false;
    for (const peer of this.peers.values()) { peer.position.lerp(peer.userData.target, Math.min(1, dt * 12)); const delta = Math.atan2(Math.sin(peer.userData.heading - peer.rotation.y), Math.cos(peer.userData.heading - peer.rotation.y)); peer.rotation.y += delta * Math.min(1, dt * 12); animateAvatar(peer, time, peer.userData.moving); }
    if (this.walkView === 'first') {
      // A gentle head bob at a real walking cadence (about one step per 0.75 m).
      const bob = moving && this.grounded && !this.flying && !reduced ? Math.sin(this.stride / .75 * Math.PI) * .028 : 0;
      this.look.update(this.player.position, bob, EYE);
    } else { this.controls.target.copy(this.player.position).add(new THREE.Vector3(0, 1.4, 0)); this.controls.update(); this.followCamera(); }
    this.sky.mesh.position.copy(this.camera.position); this.updateSun();
    this.renderer.render(this.scene, this.camera);
    this.mapLabels?.update(this,time);
    const direction = this.camera.getWorldDirection(new THREE.Vector3()), bearing = Math.atan2(direction.x, -direction.z);
    const heading = (Math.round(bearing / (Math.PI / 4)) + 8) % 8;
    if (heading !== this.lastHeading) { this.lastHeading = heading; const names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']; const compass = document.querySelector('.compass'); if (compass) { document.querySelector('#heading').textContent = names[heading]; const spans = compass.querySelectorAll('span'); [0, 2, 3, 5].forEach((index, i) => { if (spans[index]) spans[index].textContent = names[(heading + [-2, -1, 1, 2][i] + 8) % 8]; }); } }
    for (const label of this.labels) { const p = label.position.clone(); if (label.follow) p.y += label.height || 2.1; p.project(this.camera); const visible = p.z > -1 && p.z < 1 && Math.abs(p.x) < .92 && Math.abs(p.y) < .85; label.el.hidden = !visible; if (visible) { label.el.style.left = ((p.x * .5 + .5) * this.container.clientWidth) + 'px'; label.el.style.top = ((-p.y * .5 + .5) * this.container.clientHeight) + 'px'; } }
  };
  eiffel(root, place) { const [x, z] = project(48.8584, 2.2945, place); const material = new THREE.MeshStandardMaterial({ color: 0x7d6e58, roughness: .8 }); const beam = (a, b, r) => { const dir = new THREE.Vector3().subVectors(b, a); const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r * .7, r, dir.length(), 4), material); mesh.position.copy(a).add(b).multiplyScalar(.5); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()); mesh.castShadow = true; root.add(mesh); }; for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const a = new THREE.Vector3(x + sx * 58, 0, z + sz * 58), b = new THREE.Vector3(x + sx * 18, 120, z + sz * 18), c = new THREE.Vector3(x + sx * 7, 265, z + sz * 7); beam(a, b, 6); beam(b, c, 3.5); beam(c, new THREE.Vector3(x, 315, z), 2); for (let h = 20; h < 120; h += 20) { const t = h / 120; beam(new THREE.Vector3(x + sx * (58 - 40 * t), h, z + sz * (58 - 40 * t)), new THREE.Vector3(x - sx * (58 - 40 * (t + .16)), h + 20, z + sz * (58 - 40 * (t + .16))), 1.5); } } [60, 120, 270].forEach((h, i) => { const size = [85, 43, 17][i], platform = new THREE.Mesh(new THREE.BoxGeometry(size, 4, size), material); platform.position.set(x, h, z); root.add(platform); }); beam(new THREE.Vector3(x, 310, z), new THREE.Vector3(x, 330, z), 1.2); }
  brooklynBridge(root, place) { const start = project(40.7106, -74.0017, place), end = project(40.7004, -73.9891, place); const length = Math.hypot(end[0] - start[0], end[1] - start[1]); const group = new THREE.Group(); group.position.set(start[0], 0, start[1]); group.rotation.y = Math.atan2(end[0] - start[0], end[1] - start[1]); const stone = new THREE.MeshStandardMaterial({ color: 0xb59c80, roughness: 1 }), steel = new THREE.MeshStandardMaterial({ color: 0x6f7c78, roughness: .8 }); const box = (x, y, z, w, h, d, mat = stone) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); }; box(0, 24, length / 2, 25, 4, length, steel); for (const t of [.3, .7]) { for (const x of [-11, 11]) box(x, 43, length * t, 8, 86, 13); box(0, 78, length * t, 31, 9, 13); box(0, 49, length * t, 31, 6, 13); } for (const x of [-12, 12]) { const points = []; for (let i = 0; i <= 80; i++) { const t = i / 80; let y; if (t < .3) y = 27 + 54 * (t / .3); else if (t > .7) y = 81 - 54 * ((t - .7) / .3); else y = 35 + 46 * Math.pow((t - .5) / .2, 2); points.push(new THREE.Vector3(x, y, length * t)); if (i % 3 === 0 && t > .04 && t < .96) box(x, (24 + y) / 2, length * t, .6, y - 24, .6, steel); } const curve = new THREE.CatmullRomCurve3(points); const cable = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 1, 4, false), steel); group.add(cable); } root.add(group); }
}

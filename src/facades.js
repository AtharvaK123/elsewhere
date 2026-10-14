import * as THREE from 'three';

// Generated architectural detail; these pixels are not photographs of real facades.
// Facade coordinates are in meters (u along the wall, v up from the ground), so
// floors, window bays, and storefronts keep real-world proportions at any size.

// style: 0 glass office tower, 1 stone mid/high-rise, 2 brick walk-up, 3 low building / house
const STYLE_COLORS = [
  [0x738d9c, 0x91a6ad, 0x678391, 0x8a9da9, 0x81959c],
  [0xe4dbc7, 0xccc8bd, 0xeee9db, 0xc5c3bb, 0xd9c6a6, 0xb4bdc4],
  [0xb6765b, 0xa1614e, 0x927566, 0xc6876b, 0xcba37b, 0xaf8063],
  [0xe8e4d8, 0xd8c9ad, 0xc7cfc4, 0xe3d3bd, 0xbfb6a6, 0xd5cfc3]
];

export function hash32(value) {
  let h = (value | 0) ^ 0x9e3779b9;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b); h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// Brick is common in the Americas and northern Europe; stone and stucco elsewhere.
export function brickShare(lat, lon) { return lon < -30 || lat > 49.5 ? 1 : .2; }
export function facadeStyle(height, seed, brick = 1) {
  if (height >= 55) return seed < .62 ? 0 : 1;
  if (height >= 22) return seed < .22 ? 0 : seed < .22 + .48 * brick ? 2 : 1;
  if (height >= 11) return seed < .55 * brick ? 2 : 1;
  return 3;
}

export function facadeColor(style, seed) {
  const options = STYLE_COLORS[style];
  const color = new THREE.Color(options[Math.floor(seed * 7919) % options.length]);
  return color.multiplyScalar(.9 + (seed * 13.7 % 1) * .18);
}

// Adds meter-based facade coordinates, style, and color. Walls vs. roofs come from the normal.
export function applyFacadeAttributes(geometry, { style, seed, color }) {
  const p = geometry.attributes.position, n = geometry.attributes.normal, count = p.count;
  const facadeUv = new Float32Array(count * 2), info = new Float32Array(count * 2), colors = new Uint8Array(count * 3);
  const [r, g, b] = [color.r, color.g, color.b].map(c => Math.round(Math.min(1, c) * 255));
  for (let i = 0; i < count; i++) {
    const nx = n.getX(i), ny = n.getY(i), nz = n.getZ(i), wall = Math.abs(ny) < .5;
    facadeUv[i * 2] = wall ? p.getX(i) * -nz + p.getZ(i) * nx : p.getX(i);
    facadeUv[i * 2 + 1] = wall ? p.getY(i) : p.getZ(i);
    info[i * 2] = style; info[i * 2 + 1] = seed;
    colors[i * 3] = r; colors[i * 3 + 1] = g; colors[i * 3 + 2] = b;
  }
  geometry.deleteAttribute('uv');
  geometry.setAttribute('facadeUv', new THREE.BufferAttribute(facadeUv, 2));
  geometry.setAttribute('facadeInfo', new THREE.BufferAttribute(info, 2));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3, true));
}

// Styles 0-3 are building facades. Higher styles share the same material for everything else:
// plain painted props, foliage that sways, lamps that glow at night, glass, and traffic signals.
export const STYLE = { OFFICE: 0, STONE: 1, BRICK: 2, HOUSE: 3, PLAIN: 9, FOLIAGE: 10, LAMP: 11, GLASS: 12, SIGNAL: 13, SOLAR:14 };

export function facadeMaterial(uniforms) {
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .82, metalness: 0 });
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime; attribute vec2 facadeUv; attribute vec2 facadeInfo; varying float vFacade; varying vec2 vFacadeUv; varying vec2 vFacadeInfo;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
float vertexStyle = floor(facadeInfo.x + 0.5);
vFacade = vertexStyle < 8.5 && abs(objectNormal.y) < 0.5 ? 1.0 : 0.0; vFacadeUv = facadeUv; vFacadeInfo = facadeInfo;
if (abs(vertexStyle - 10.0) < 0.5) {
  // Leaves sway in a gentle breeze; facadeUv.y weights the motion toward the crown's top.
  float phase = uTime * 1.3 + position.x * 0.21 + position.z * 0.17 + facadeInfo.y * 6.0;
  transformed.x += sin(phase) * 0.09 * facadeUv.y; transformed.z += cos(phase * 0.83) * 0.07 * facadeUv.y;
}`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
uniform float uNight; uniform float uTime; uniform vec3 uSkyTint;
varying float vFacade; varying vec2 vFacadeUv; varying vec2 vFacadeInfo;
float facadeHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
// Antialiased rectangle mask inside a repeating cell: 1 inside [lo, hi] on both axes.
float facadeBox(vec2 f, vec2 lo, vec2 hi, vec2 w) {
  vec2 a = smoothstep(lo - w, lo + w, f) * (1.0 - smoothstep(hi - w, hi + w, f));
  return a.x * a.y;
}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
float facadeGlass = 0.0, facadeLit = 0.0, facadeShine = 0.0; vec2 facadeId = vec2(0.0); vec3 facadeEmit = vec3(0.0);
float fragmentStyle = floor(vFacadeInfo.x + 0.5);
if (fragmentStyle > 8.5) {
  if (abs(fragmentStyle - 11.0) < 0.5) facadeEmit = vec3(1.0, 0.82, 0.55) * 2.2 * uNight;
  else if (abs(fragmentStyle - 12.0) < 0.5) { facadeGlass = 1.0; facadeShine = 1.0; }
  else if (abs(fragmentStyle - 14.0) < 0.5) {
    vec2 cell=vFacadeUv/vec2(1.05,1.75),w=fwidth(cell);
    float panel=facadeBox(fract(cell),vec2(0.025),vec2(0.975),w);
    panel=mix(0.88,panel,1.0-smoothstep(0.2,0.8,max(w.x,w.y)));
    diffuseColor.rgb=mix(vec3(0.36,0.45,0.5),vec3(0.025,0.085,0.15),panel);
    facadeGlass=panel;facadeShine=0.5;
  }
  else if (abs(fragmentStyle - 13.0) < 0.5) {
    // Traffic signals: 0 red, 1 amber, 2 green; opposite approaches (parity) alternate on a 30 s cycle.
    float t = mod(uTime + vFacadeInfo.y * 30.0 + vFacadeUv.y * 15.0, 30.0);
    float lightOn = t < 12.0 ? 2.0 : t < 15.0 ? 1.0 : 0.0;
    float on = 1.0 - step(0.5, abs(vFacadeUv.x - lightOn));
    facadeEmit = diffuseColor.rgb * on * 3.0; diffuseColor.rgb *= 0.25 + on * 0.5;
  }
} else if (vFacade > 0.5) {
  float style = fragmentStyle, seed = vFacadeInfo.y;
  vec2 p = vFacadeUv;
  float bay = style < 0.5 ? 1.55 : style < 1.5 ? 2.7 + seed * 0.6 : style < 2.5 ? 2.4 + seed * 0.4 : 3.4;
  float storey = style < 0.5 ? 3.9 : 3.3;
  float shop = style > 2.5 ? 0.0 : 4.6;
  // Broad cool reflections and warm masonry keep the illustrated style readable at street level.
  // This is generated glazing, not street photography.
  vec3 glass = mix(vec3(0.075, 0.15, 0.21), vec3(0.16, 0.28, 0.34), facadeHash(vec2(seed, 3.0)));
  glass = mix(glass * 0.8, glass * 1.18, smoothstep(0.0, 55.0, p.y));
  diffuseColor.rgb *= mix(0.76, 1.0, smoothstep(0.0, 2.2, p.y));
  float mask = 0.0, coverage = 0.0; vec2 id;
  if (p.y < shop) {
    // Street-level storefronts: tall glass bays, a fascia band above.
    vec2 c = vec2(p.x / 4.8, p.y / shop); vec2 w = fwidth(c) * 0.8; id = vec2(floor(c.x), -1.0);
    mask = facadeBox(fract(c), vec2(0.07, 0.06), vec2(0.93, 0.74), w); coverage = 0.58;
    float detail = 1.0 - smoothstep(0.3, 0.9, max(w.x, w.y)); mask = mix(coverage, mask, detail);
    float fascia = smoothstep(0.79 - w.y, 0.79 + w.y, c.y) * (1.0 - smoothstep(0.93 - w.y, 0.93 + w.y, c.y));
    diffuseColor.rgb *= 1.0 - fascia * 0.38;
    glass = mix(glass, vec3(0.22, 0.20, 0.17), 0.35);
  } else {
    vec2 c = vec2(p.x / bay, (p.y - shop) / storey); vec2 w = fwidth(c) * 0.8; id = floor(c);
    if (style < 0.5) { mask = facadeBox(fract(c), vec2(0.06, 0.12), vec2(0.94, 0.97), w); coverage = 0.75; }
    else if (style < 1.5) { mask = facadeBox(fract(c), vec2(0.2, 0.22), vec2(0.8, 0.82), w); coverage = 0.36; }
    else if (style < 2.5) { mask = facadeBox(fract(c), vec2(0.24, 0.2), vec2(0.76, 0.8), w); coverage = 0.31;
      diffuseColor.rgb *= 1.0 - 0.18 * facadeBox(fract(c), vec2(0.2, 0.12), vec2(0.8, 0.2), w); }
    else { mask = facadeBox(fract(c), vec2(0.28, 0.3), vec2(0.72, 0.78), w); coverage = 0.25;
      // White window trim on houses.
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.92), facadeBox(fract(c), vec2(0.25, 0.27), vec2(0.75, 0.81), w) * (1.0 - facadeBox(fract(c), vec2(0.28, 0.3), vec2(0.72, 0.78), w)) * 0.8); }
    // Fade the pattern to its average tone where cells shrink below a pixel.
    float detail = 1.0 - smoothstep(0.25, 0.8, max(w.x, w.y));
    mask = mix(coverage, mask, detail);
    float belt = 1.0 - smoothstep(0.02, 0.055 + w.y, fract(c.y));
    diffuseColor.rgb *= 1.0 - 0.13 * detail * belt;
    // A soft upper pane reflection; never high frequency surface noise.
    glass *= mix(0.86, 1.14, smoothstep(0.24, 0.82, fract(c.y)) * detail);
  }
  facadeGlass = mask; facadeId = id;
  float lit = step(p.y < shop ? 0.35 : 0.7, facadeHash(id + seed * 91.0));
  facadeLit = mask * lit * uNight;
  diffuseColor.rgb = mix(diffuseColor.rgb, glass, mask);
} else if (fragmentStyle < 8.5) {
  diffuseColor.rgb *= vec3(0.69, 0.74, 0.79);
}`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.34, facadeGlass);')
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
float facing = 1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition)));
totalEmissiveRadiance += uSkyTint * facadeGlass * (0.05 + pow(facing, 3.0) * (0.32 + facadeShine * 0.2)) * (1.0 - uNight);
totalEmissiveRadiance += vec3(1.0, 0.72, 0.42) * facadeLit * (0.22 + facadeHash(facadeId.yx + 7.0) * 0.3);
totalEmissiveRadiance += facadeEmit;`);
  };
  material.customProgramCacheKey = () => 'elsewhere-facade-v4';
  return material;
}

// Water: vertex-colored, glossy, with ripples that move over time (facadeUv carries world x/z).
export function waterMaterial(uniforms) {
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .12, metalness: .05 });
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec2 facadeUv; varying vec2 vWaterUv;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWaterUv = facadeUv;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uTime; uniform float uNight; uniform vec3 uSkyTint; varying vec2 vWaterUv;')
      .replace('#include <normal_fragment_begin>', `#include <normal_fragment_begin>
vec2 q = vWaterUv * 0.35;
float rippleDetail = 1.0 - smoothstep(0.25, 1.5, max(length(dFdx(q)), length(dFdy(q))));
vec2 ripple = vec2(sin(q.x * 1.7 + uTime * 1.1) + sin(q.y * 2.3 - uTime * 0.9) * 0.6, cos(q.y * 1.9 + uTime * 1.3) + cos(q.x * 2.9 - uTime * 0.7) * 0.5) * 0.035 * rippleDetail;
normal = normalize(normal + (viewMatrix * vec4(ripple.x, 0.0, ripple.y, 0.0)).xyz);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
float waterFacing = 1.0 - abs(dot(normal, normalize(vViewPosition)));
totalEmissiveRadiance += uSkyTint * pow(waterFacing, 4.0) * 0.45 * (1.0 - uNight * 0.7);`);
  };
  material.customProgramCacheKey = () => 'elsewhere-water-v1';
  return material;
}

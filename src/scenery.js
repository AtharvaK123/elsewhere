import * as THREE from 'three';

// Gradient sky dome that follows the camera; fog matches its horizon color.
export const SKY = {
  day: { top: 0x68a8e2, horizon: 0xd7e9f2, ground: 0xbacbd0, fog: 0xd7e9f2 },
  night: { top: 0x07121f, horizon: 0x1d3145, ground: 0x111a22, fog: 0x18293a }
};
export function makeSky() {
  const uniforms = { top: { value: new THREE.Color(SKY.day.top) }, horizon: { value: new THREE.Color(SKY.day.horizon) }, ground: { value: new THREE.Color(SKY.day.ground) }, sun: { value: new THREE.Vector3(-.5, .7, -.3).normalize() }, night: { value: 0 } };
  const material = new THREE.ShaderMaterial({
    uniforms, side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform vec3 top; uniform vec3 horizon; uniform vec3 ground; uniform vec3 sun; uniform float night; varying vec3 vDir;
      float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
      void main(){
        float h = vDir.y;
        vec3 color = h > 0.0 ? mix(horizon, top, pow(min(1.0, h * 1.6), 0.7)) : mix(horizon, ground, min(1.0, -h * 6.0));
        float sunAmount = max(0.0, dot(vDir, sun));
        color += (1.0 - night) * (vec3(1.0, 0.92, 0.74) * pow(sunAmount, 900.0) * 1.4 + vec3(1.0, 0.86, 0.66) * pow(sunAmount, 12.0) * 0.18);
        vec3 cell = floor(vDir * 380.0);
        color += night * step(0.9975, hash(cell)) * smoothstep(0.05, 0.3, h) * 0.8;
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }`
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(14000, 32, 16), material);
  mesh.renderOrder = -1; mesh.frustumCulled = false;
  return { mesh, uniforms };
}

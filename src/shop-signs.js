import * as THREE from 'three';

// One texture and mesh per chunk, not a DOM element or draw call per shop.
export function makeShopSigns(shops) {
  if (!shops?.length || typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  const rowHeight = 32;
  canvas.width = 256; canvas.height = rowHeight * 2 ** Math.ceil(Math.log2(shops.length));
  const ctx = canvas.getContext('2d'), positions = [], uv = [], indices = [];
  shops.forEach((shop, i) => {
    const y = i * rowHeight, w = shop.width * .93, h = .43;
    ctx.fillStyle = '#' + shop.color.toString(16).padStart(6, '0'); ctx.fillRect(0, y, 256, rowHeight);
    ctx.fillStyle = '#fff3d8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const name = shop.name.normalize().slice(0, 120);
    // Preserve glyph proportions when the atlas cell is mapped onto a wide sign.
    const aspect = h * canvas.width / (rowHeight * w);
    let size = 22; ctx.font = `600 ${size}px system-ui, sans-serif`;
    while (size > 9 && ctx.measureText(name).width * aspect > 232) ctx.font = `600 ${--size}px system-ui, sans-serif`;
    ctx.save(); ctx.translate(128,y+rowHeight/2); ctx.scale(aspect,1); ctx.fillText(name,0,0,232/aspect); ctx.restore();
    const { nx, nz } = shop, x = shop.x + nx * .205, z = shop.z + nz * .205;
    for (const [u, v] of [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]) positions.push(x + nz * u, 3.09 + v, z - nx * u);
    const top = 1 - (y + .5) / canvas.height, bottom = 1 - (y + rowHeight - .5) / canvas.height;
    uv.push(.01, bottom, .99, bottom, .99, top, .01, top);
    const n = i * 4; indices.push(n, n + 1, n + 2, n, n + 2, n + 3);
  });
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geometry.setIndex(indices); geometry.computeBoundingSphere();
  const mesh = new THREE.Mesh(geometry, material); mesh.name = 'Mapped shop names';
  return mesh;
}

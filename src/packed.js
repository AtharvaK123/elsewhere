// Compact, transferable form of decoded map features. Posting tens of thousands of
// {lat, lon} objects from the worker stalls the main thread while they are copied;
// typed arrays transfer instantly and features are unpacked one at a time while building.
// kind: 0 line, 1 area (outer ring + holes), 2 point. chunk: 0-63 cell within the tile.

export function packElements(elements) {
  const tagTable = [], tagKeys = new Map();
  let ringCount = 0, pointCount = 0;
  for (const e of elements) { ringCount += 1 + (e.holes?.length || 0); pointCount += e.geometry.length + (e.holes || []).reduce((n, ring) => n + ring.length, 0); }
  const ids = new Float64Array(elements.length), tagIndex = new Uint32Array(elements.length), kind = new Uint8Array(elements.length), chunk = new Uint8Array(elements.length);
  const elementRings = new Uint32Array(elements.length + 1), ringPoints = new Uint32Array(ringCount + 1), coords = new Float64Array(pointCount * 2);
  let ring = 0, point = 0;
  const writeRing = points => { for (const p of points) { coords[point * 2] = p.lat; coords[point * 2 + 1] = p.lon; point++; } ringPoints[++ring] = point; };
  elements.forEach((e, i) => {
    const key = JSON.stringify(e.tags);
    if (!tagKeys.has(key)) { tagKeys.set(key, tagTable.length); tagTable.push(e.tags); }
    ids[i] = e.id; tagIndex[i] = tagKeys.get(key);
    kind[i] = e.kind ?? (Array.isArray(e.holes) ? 1 : 0); chunk[i] = e.chunk ?? 0;
    writeRing(e.geometry); (e.holes || []).forEach(writeRing);
    elementRings[i + 1] = ring;
  });
  return { tagTable, ids, tagIndex, kind, chunk, elementRings, ringPoints, coords };
}

export function packedTransfer(packed) {
  return ['ids', 'tagIndex', 'kind', 'chunk', 'elementRings', 'ringPoints', 'coords'].map(key => packed[key].buffer);
}

class PackedElement {
  constructor(packed, index) { this.packed = packed; this.index = index; this.id = packed.ids[index]; this.tags = packed.tagTable[packed.tagIndex[index]]; this.kind = packed.kind[index]; this.chunk = packed.chunk[index]; }
  ring(r) {
    const { ringPoints, coords } = this.packed, points = [];
    for (let p = ringPoints[r]; p < ringPoints[r + 1]; p++) points.push({ lat: coords[p * 2], lon: coords[p * 2 + 1] });
    return points;
  }
  get first() { const p = this.packed.ringPoints[this.packed.elementRings[this.index]]; return { lat: this.packed.coords[p * 2], lon: this.packed.coords[p * 2 + 1] }; }
  get geometry() { return this._geometry ??= this.ring(this.packed.elementRings[this.index]); }
  get holes() {
    if (this.kind !== 1) return undefined;
    const holes = [];
    for (let r = this.packed.elementRings[this.index] + 1; r < this.packed.elementRings[this.index + 1]; r++) holes.push(this.ring(r));
    return holes;
  }
}

// Lightweight views over a packed world; geometry is materialized only when read.
export function unpackElements(packed) {
  return Array.from({ length: packed.ids.length }, (_, i) => new PackedElement(packed, i));
}

// Groups a tile's features by chunk cell without materializing their geometry.
export function elementsByChunk(packed) {
  const groups = new Map();
  unpackElements(packed).forEach(element => { if (!groups.has(element.chunk)) groups.set(element.chunk, []); groups.get(element.chunk).push(element); });
  return groups;
}

export const OPENFREEMAP_TILEJSON = 'https://tiles.openfreemap.org/planet';

// A small pool of map workers. Tiles are fetched and decoded off the render loop,
// and arrive as transferable typed arrays.
export class TileClient {
  constructor(size = 3) { this.size = size; this.workers = []; this.pending = new Map(); this.next = 0; this.ids = 0; }
  worker() {
    if (this.workers.length < this.size) {
      const worker = new Worker(new URL('./map-worker.js', location.href), { type: 'module' });
      worker.onmessage = ({ data }) => { const job = this.pending.get(data.id); if (!job) return; this.pending.delete(data.id); job.finish(data); };
      worker.onerror = () => { for (const [id, job] of this.pending) if (job.worker === worker) { this.pending.delete(id); job.finish({ type: 'error', message: 'The map loader could not start. Rebuild the game and refresh.' }); } };
      this.workers.push(worker);
    }
    return this.workers[this.next++ % this.workers.length];
  }
  request(message, { signal, timeout = 35000, worker } = {}) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) { reject(signal.reason || new DOMException('Canceled', 'AbortError')); return; }
      try { worker ??= this.worker(); } catch { reject(new Error('The map loader could not start. Rebuild the game and refresh.')); return; }
      const id = ++this.ids, timer = setTimeout(() => cancel(new DOMException('OpenFreeMap took too long to load.', 'TimeoutError')), timeout);
      const cancel = reason => { if (!this.pending.has(id)) return; this.pending.delete(id); worker.postMessage({ type: 'cancel', id }); clearTimeout(timer); signal?.removeEventListener('abort', onAbort); reject(reason); };
      const onAbort = () => cancel(signal.reason || new DOMException('Canceled', 'AbortError'));
      signal?.addEventListener('abort', onAbort, { once: true });
      this.pending.set(id, { worker, finish: data => {
        clearTimeout(timer); signal?.removeEventListener('abort', onAbort);
        if (data.type === 'ready') resolve(data);
        else { const error = data.name === 'TimeoutError' || data.name === 'AbortError' ? new DOMException(data.message, data.name) : new Error(data.message || 'OpenFreeMap is unavailable right now. Please try again shortly.'); reject(error); }
      } });
      worker.postMessage({ ...message, id });
    });
  }
  // Requests for the same tile go to the same worker, so each tile is downloaded and decoded once.
  workerFor(tile) { while (this.workers.length < this.size) this.worker(); return this.workers[((tile.x * 7 + tile.y * 13) % this.size + this.size) % this.size]; }
  tileJSON(tileJSONUrl, options) { return this.request({ type: 'tilejson', tileJSONUrl }, options); }
  tile(tile, source, tileJSONUrl, options) { return this.request({ type: 'tile', tile, source, tileJSONUrl }, { ...options, worker: this.workerFor(tile) }); }
  async chunk(message, options) { return (await this.request({ type: 'chunk', ...message }, { ...options, worker: this.workerFor(message.tile), timeout: 45000 })).chunk; }
  async applyDetails(features) { while(this.workers.length<this.size)this.worker();await Promise.all(this.workers.map(worker=>this.request({type:'apply-details',features},{worker}))); }
  // Every worker keeps its own copy of the bundled snapshot.
  async snapshot(url, options) { while (this.workers.length < this.size) this.worker(); await Promise.all(this.workers.map(worker => this.request({ type: 'snapshot', url }, { ...options, worker }))); }
}

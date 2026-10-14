import { build } from 'esbuild';
import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await build({entryPoints:['src/app.js','src/map-worker.js'], bundle:true, minify:true, format:'esm', target:'es2022', outdir:'dist', sourcemap:false});
await Promise.all(['index.html','styles.css'].map(file=>copyFile(`src/${file}`, `dist/${file}`)));
await mkdir('dist/setup', { recursive: true });
await copyFile('supabase/migrations/202610120001_world.sql','dist/setup/world.sql');
console.log('Elsewhere built successfully.');

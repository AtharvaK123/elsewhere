import { build } from 'esbuild';
import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await build({entryPoints:['src/app.js'], bundle:true, minify:true, format:'esm', target:'es2022', outfile:'dist/app.js', sourcemap:false});
await Promise.all(['index.html','styles.css'].map(file=>copyFile(`src/${file}`, `dist/${file}`)));
console.log('Elsewhere built successfully.');

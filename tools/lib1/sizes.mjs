// LIB-1: sizes of the current www/ build and the How-to main-bundle footprint, as JSON. Usage: node tools/lib1/sizes.mjs <label>
import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const A = join(ROOT, 'www/assets');
const rows = fs.readdirSync(A).map(f => { const b = fs.readFileSync(join(A, f)); return { f, raw: b.length, gz: gzipSync(b).length }; });
const sum = xs => xs.reduce((o, r) => ({ n: o.n + 1, raw: o.raw + r.raw, gz: o.gz + r.gz }), { n: 0, raw: 0, gz: 0 });
const grp = re => sum(rows.filter(r => re.test(r.f)));
const max = re => rows.filter(r => re.test(r.f)).sort((a, b) => b.gz - a.gz)[0];
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);
const www = walk(join(ROOT, 'www')).map(p => { const b = fs.readFileSync(p); return { raw: b.length, gz: gzipSync(b).length }; });
// HT3b-A1's measure (tests/howto/footprint.test.ts), plus the ht-index import as external
const EXTERNAL = ['preact', 'preact/hooks', '@/app/toast', './HowToSheet', '@/howto/generated/ht-index'];
const bundled = async files => (await build({ stdin: { contents: files.map((f, i) => `export * as m${i} from ${JSON.stringify(resolve(ROOT, f))};`).join('\n'), resolveDir: ROOT, loader: 'ts' }, bundle: true, minify: true, write: false, format: 'esm', platform: 'browser', jsx: 'automatic', jsxImportSource: 'preact', external: EXTERNAL, logLevel: 'silent' })).outputFiles.reduce((n, f) => n + f.contents.byteLength, 0);
const genFiles = fs.readdirSync(join(ROOT, 'src/howto/generated')).length + fs.readdirSync(join(ROOT, 'src/slices/howto/css')).filter(f => f.startsWith('zoom-')).length;
const loaderChunk = rows.filter(r => /\.js$/.test(r.f) && fs.readFileSync(join(A, r.f), 'utf8').includes('lib_machine_chest_press') && /import\(/.test(fs.readFileSync(join(A, r.f), 'utf8')) && !/^ht-[a-z]/.test(r.f.replace(/^ht-index/, 'X')));
const out = {
  label: process.argv[2],
  idsTsRaw: fs.statSync(join(ROOT, 'src/howto/ids.ts')).size,
  idsTsMin: await bundled(['src/howto/ids.ts']),
  idsPlusLazyMin: await bundled(['src/howto/ids.ts', 'src/slices/howto/lazy.tsx']),
  generatedFiles: genFiles,
  howToTotalA4: grp(/^(HowToSheet-|ht-|hand-|feel-|posture-|zoom-)[\w-]+\.(js|css)$/),
  plates: grp(/^ht-(?!index)[\w-]+\.js$/), hand: grp(/^hand-.*\.js$/), posture: grp(/^posture-.*\.js$/), feel: grp(/^feel-.*\.js$/), zoomCss: grp(/^zoom-.*\.css$/),
  sheetJs: grp(/^HowToSheet-.*\.js$/), sheetCss: grp(/^HowToSheet-.*\.css$/),
  mainIndex: grp(/^index-.*\.js$/),
  loaderChunks: loaderChunk.map(r => r), 
  largest: { ht: max(/^ht-(?!index).*\.js$/), hand: max(/^hand-.*\.js$/), posture: max(/^posture-.*\.js$/), feel: max(/^feel-.*\.js$/) },
  assets: sum(rows), www: sum(www),
};
console.log(JSON.stringify(out, null, 1));

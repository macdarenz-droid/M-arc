// MO: build the motion lab as a self-contained page for review outside the repo (one page, the lab code as one
// module, the assets inlined as one script). three.js loads from the jsDelivr CDN; nothing else is fetched.
//   node tools/motion/build-lab-page.mjs <outDir> <figure.glb> <machine.glb>
// The GLBs are the unpacked builds (figure_rig.py + regions.py, machine_prep.py): meshopt decoding needs
// WebAssembly, which a locked-down page may refuse, so the page ships plain glTF and stubs the decoder.
import { build } from 'esbuild';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [out, figure, machine] = process.argv.slice(2);
if (!out || !figure || !machine) { console.error('usage: build-lab-page.mjs <outDir> <figure.glb> <machine.glb>'); process.exit(2); }
const lab = resolve(import.meta.dirname, '../../docs/design/motion-lab');
const THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.186.1/';
mkdirSync(out, { recursive: true });

await build({
  entryPoints: [join(lab, 'src/app.js')], bundle: true, format: 'esm', target: 'es2022', minify: true,
  outfile: join(out, 'lab.js'), external: ['three', 'three/addons/*'], logLevel: 'warning',
  plugins: [{ name: 'no-meshopt', setup(b) {
    b.onResolve({ filter: /meshopt_decoder/ }, () => ({ path: 'meshopt', namespace: 'stub' }));
    b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: 'export const MeshoptDecoder = null;' }));
  } }],
});

const json = (p) => JSON.parse(readFileSync(join(lab, p), 'utf8'));
const b64 = (p) => readFileSync(p).toString('base64');
writeFileSync(join(out, 'assets.js'), `(function(){var d=function(s){var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer;};
window.MOTION_ASSETS={themes:${JSON.stringify(json('src/themes.json'))},files:{figure:d("${b64(figure)}"),machine:d("${b64(machine)}"),meta:${JSON.stringify(json('assets/figure.meta.json'))},regions:${JSON.stringify(json('assets/figure.regions.json'))}}};})();\n`);

// page: the lab's own markup and styles, without the document wrapper (the host adds it), a fixed import map,
// and the first-paint colours for both screen themes (the app's Silent Black and Paper tokens)
const html = readFileSync(join(lab, 'index.html'), 'utf8');
const style = /<style>([\s\S]*?)<\/style>/.exec(html)[1];
const body = /<body>([\s\S]*?)<\/body>/.exec(html)[1].replace('<script type="module" src="./src/app.js"></script>', '<script src="assets.js"></script>\n<script type="module" src="lab.js"></script>');
const themes = json('src/themes.json');
const vars = (id) => { const t = themes.find(x => x.id === id).tokens; return `--bg:${t.bg};--surface-1:${t.surface1};--surface-2:${t.surface2};--surface-3:${t.surface3};--border-subtle:${t.borderSubtle};--border:${t.border};--text:${t.text};--text-2:${t.text2};--text-3:${t.text3};--accent:${t.accent};--on-accent:${t.onAccent};--mistake:${t.mistake};color-scheme:${t.colorScheme}`; };
const page = `<title>Chest Press Motion</title>
<script type="importmap">${JSON.stringify({ imports: { three: THREE_CDN + 'build/three.module.js', 'three/addons/': THREE_CDN + 'examples/jsm/' } })}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>${style.replace(/:root \{[^}]*\}/, `:root { ${vars('silent-black')}; --radius-lg:16px; --radius-pill:999px; }
  @media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) { ${vars('paper')}; } }
  :root[data-theme="light"] { ${vars('paper')}; }`)}</style>
${body.trim()}
`;
writeFileSync(join(out, 'index.html'), page);
console.log('ok', out);

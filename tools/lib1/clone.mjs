// LIB-1 scale rehearsal (never merged): clones the 8 approved How-to modules into the other 145 library ids, so the
// app builds with 153 How-to entries. Measurement only. Usage: node tools/lib1/clone.mjs today|lib2
//  today: today's wiring at 153 (literal HOWTO_IDS, LOADERS in generated/index.ts).
//  lib2:  LIB-2's planned wiring (#189 sec. 7): hash-set ids.ts, LOADERS in its own generated/ht-index.ts chunk,
//         fetched in parallel with the sheet chunk on tap.
import fs from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const G = join(ROOT, 'src/howto/generated'), CSS = join(ROOT, 'src/slices/howto/css');
const mode = process.argv[2];
if (!['today', 'lib2'].includes(mode)) throw new Error('usage: clone.mjs today|lib2');

const lib = JSON.parse(fs.readFileSync(join(ROOT, 'src/data/exercises.json'), 'utf8')).filter(e => e.id.startsWith('lib_'));
const idsTs = fs.readFileSync(join(ROOT, 'src/howto/ids.ts'), 'utf8');
const EIGHT = [...idsTs.match(/HOWTO_IDS = \[([\s\S]*?)\]/)[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
if (EIGHT.length !== 8) throw new Error(`expected the 8 in ids.ts, got ${EIGHT.length} (already cloned? git checkout src first)`);
const idx = fs.readFileSync(join(G, 'index.ts'), 'utf8');
const FILE_OF = Object.fromEntries([...idx.matchAll(/(lib_\w+): \(\) => import\('\.\/(ht-[a-z0-9-]+)'\)/g)].map(m => [m[1], m[2]]));
// chromeId exactly as PlateView.chromeIdOf derives it
const chromeOf = t => { const fk = /firstKey: "([^"]+)"/.exec(t)[1]; return new RegExp(`id=\\\\"([a-z0-9-]+)-n-${fk}\\\\"`).exec(t)[1]; };
const SRC = EIGHT.map(id => { const t = fs.readFileSync(join(G, FILE_OF[id] + '.ts'), 'utf8'); return { id, file: FILE_OF[id], chrome: chromeOf(t), text: t }; });
const head1 = t => t.slice(0, t.indexOf('\n') + 1);
const token = c => new RegExp(`(?<![a-z0-9-])${c}(?![a-z0-9])`, 'g');

const loaders = [], all = [], srcOf = {};
let n = 0;
for (const e of lib) {
  if (EIGHT.includes(e.id)) { loaders.push([e.id, FILE_OF[e.id]]); all.push(e.id); continue; }
  const s = SRC[n++ % 8];
  srcOf[e.id] = s.id;
  const nc = e.id.slice(4).replace(/_/g, '-');
  if (SRC.some(x => x.chrome === nc)) throw new Error(`chromeId clash ${nc}`);
  const re = token(s.chrome);
  let ht = s.text.replace(re, nc).replace(`id: "${s.id}"`, `id: "${e.id}"`).replace(/\n  name: "[^"]*",/, `\n  name: ${JSON.stringify(e.name)},`);
  if (!ht.includes(`id: "${e.id}"`)) throw new Error(`id not replaced in ${e.id}`);
  if (chromeOf(ht) !== nc) throw new Error(`chromeId not replaced in ${e.id}`);
  fs.writeFileSync(join(G, `ht-${nc}.ts`), ht);
  for (const k of ['hand', 'posture', 'feel']) {
    const f = join(G, `${k}-${s.chrome}.ts`);
    if (!fs.existsSync(f)) continue;
    let t = fs.readFileSync(f, 'utf8').replace(re, nc).replace(`css/zoom-${s.chrome}.css`, `css/zoom-${nc}.css`);
    fs.writeFileSync(join(G, `${k}-${nc}.ts`), t);
  }
  // per-exercise close-up CSS, made unique by one rule so the bundler cannot fold identical files into one asset
  const css = join(CSS, `zoom-${s.chrome}.css`);
  if (fs.existsSync(css)) fs.writeFileSync(join(CSS, `zoom-${nc}.css`), fs.readFileSync(css, 'utf8') + `\n.ht .lib1-${nc}{order:0}\n`);
  loaders.push([e.id, `ht-${nc}`]); all.push(e.id);
}
if (all.length !== 153 || new Set(all).size !== 153) throw new Error(`expected 153 ids, got ${all.length}`);

// LibId: the 153
const types = join(ROOT, 'src/howto/types.ts');
fs.writeFileSync(types, fs.readFileSync(types, 'utf8').replace(/export type LibId =[\s\S]*?;\n/, `export type LibId =\n${all.map(i => `  | '${i}'`).join('\n')};\n`));

const hint = (idsTs.match(/HOWTO_HINTS[^{]*\{([\s\S]*?)\};/)[1].match(/"(lib_\w+)": ("[^"]*")/));
const hintText = JSON.parse(hint[2]);
const hinted = all.filter(id => (srcOf[id] ?? id) === hint[1]);

const loaderLines = loaders.map(([id, f]) => `  ${id}: () => import('./${f}'),`).join('\n');
if (mode === 'today') {
  fs.writeFileSync(join(ROOT, 'src/howto/ids.ts'), idsTs
    .replace(/HOWTO_IDS = \[[\s\S]*?\] as const;/, `HOWTO_IDS = [\n${all.map(i => `  "${i}",`).join('\n')}\n] as const;`)
    .replace(/HOWTO_HINTS([^{]*)\{[\s\S]*?\};/, (_, t) => `HOWTO_HINTS${t}{\n${hinted.map(i => `  "${i}": ${JSON.stringify(hintText)},`).join('\n')}\n};`));
  fs.writeFileSync(join(G, 'index.ts'), idx.replace(/= \{[\s\S]*\};/, `= {\n${loaderLines}\n};`));
} else {
  // FNV-1a 32-bit, folded to 30 bits, 5 base-64 characters (#189 sec. 7)
  const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const h = s => { let x = 0x811c9dc5; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; } x = ((x >>> 30) ^ x) & 0x3fffffff; let o = ''; for (let i = 0; i < 5; i++) { o = B[x & 63] + o; x >>>= 6; } return o; };
  const hs = all.map(h); if (new Set(hs).size !== hs.length) throw new Error('hash collision');
  const hintIdx = all.map(id => (hinted.includes(id) ? '1' : '0')).join('');
  fs.writeFileSync(join(ROOT, 'src/howto/ids.ts'), `${head1(idsTs)}// The only How-to module in the main bundle (plan 2.9: <= 2,048 B, no runtime imports). LIB-1 prototype of #189 sec. 7.
import type { LibId } from './types';
export type HowToId = LibId & { readonly __howto: true };
export const HOWTO_LABEL = "How to do it";
const SET = "${hs.join('')}";
const B = "${B}";
function h(s: string): string {
  let x = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; }
  x = ((x >>> 30) ^ x) & 0x3fffffff;
  let o = "";
  for (let i = 0; i < 5; i++) { o = B[x & 63] + o; x >>>= 6; }
  return o;
}
function at(id: string): number {
  if (!id.startsWith("lib_")) return -1;
  const k = h(id);
  for (let i = 0; i < SET.length; i += 5) if (SET.slice(i, i + 5) === k) return i / 5;
  return -1;
}
export function hasHowTo(id: string): id is HowToId { return at(id) >= 0; }
const HINTS = [${JSON.stringify(hintText)}];
const HINT_OF = "${hintIdx}";
export function howToHint(id: string): string | undefined { const i = at(id); const k = i < 0 ? 0 : +HINT_OF[i]!; return k ? HINTS[k - 1] : undefined; }
/** Kept for today's callers: a read-only view built from howToHint. */
export const HOWTO_HINTS: { readonly [id: string]: string | undefined } = new Proxy({}, { get: (_, id) => howToHint(String(id)) });
`);
  fs.writeFileSync(join(G, 'ht-index.ts'), `${head1(idx)}import type { BuiltHowTo, LibId } from '../types';\n\nexport const LOADERS: Partial<Record<LibId, () => Promise<{ default: BuiltHowTo }>>> = {\n${loaderLines}\n};\n`);
  fs.writeFileSync(join(G, 'index.ts'), `${head1(idx)}export { LOADERS } from './ht-index';\n`);
  const sheet = join(ROOT, 'src/slices/howto/HowToSheet.tsx');
  fs.writeFileSync(sheet, fs.readFileSync(sheet, 'utf8').replace("import('@/howto/generated').then(m => m.LOADERS[exerciseId]())", "import('@/howto/generated/ht-index').then(m => m.LOADERS[exerciseId]!())"));
  const lazy = join(ROOT, 'src/slices/howto/lazy.tsx');
  fs.writeFileSync(lazy, fs.readFileSync(lazy, 'utf8').replace("    void import('./HowToSheet')", "    void import('@/howto/generated/ht-index').catch(() => {});   // LIB-1: ht-index in parallel with the sheet\n    void import('./HowToSheet')"));
}
console.log(`LIB-1 clone (${mode}): ${all.length} ids with How-to entries, ${n} cloned, ${hinted.length} with the hint`);

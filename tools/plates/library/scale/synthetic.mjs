// LIB-2 (library plan 5.2: "A synthetic 153-id build runs the size tests in LIB-2's PR"; D-LIB2-synthetic): builds the
// app in a temporary copy of the repo with N shipped How-to ids, N = 8 (the approved 8) up to 153 (every library id).
// The ids past the 8 are clones of the 8's generated modules (round robin, chrome id and exercise id swapped, the
// approach of LIB-1's tools/lib1/clone.mjs on #209), registered through one synthetic batch file whose rows ship; the
// repo's own generator (tools/plates/gen/ids.mjs, run in the copy) writes ids.ts and loaders.ts from the registry.
// Measurement only: nothing here is written into the repo.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

const COPY = ['index.html', 'vite.config.ts', 'package.json', 'tsconfig.json', 'public', 'src', 'tools/plates'];
const G = 'src/howto/generated', CSS = 'src/slices/howto/css';
const token = c => new RegExp(`(?<![a-z0-9-])${c}(?![a-z0-9])`, 'g');

/** The temporary repo copy with `n` shipped ids. Returns { root, ids, chromeIds } (registry order). */
export async function syntheticRoot(src, n) {
  const root = mkdtempSync(join(tmpdir(), `lib2-n${n}-`));
  for (const p of COPY) if (existsSync(join(src, p))) cpSync(join(src, p), join(root, p), { recursive: true });
  symlinkSync(join(src, 'node_modules'), join(root, 'node_modules'), 'dir');
  rmSync(join(root, 'tools/plates/library/hands/pairs.mjs'), { force: true });   // LIB-7-FIX: the clones never use LIB-7's pairs; write-ids writes its own loader, and a real one imported here would stay cached (ESM) after write-ids replaces it
  const plates = JSON.parse(readFileSync(join(root, 'tools/plates/plates.json'), 'utf8'));
  const eight = Object.keys(plates);
  if (eight.length !== 8) throw new Error(`synthetic: expected the 8 in plates.json, found ${eight.length}`);
  if (!Number.isInteger(n) || n < 8) throw new Error(`synthetic: n must be an integer >= 8, got ${n}`);
  const lib = JSON.parse(readFileSync(join(root, 'src/data/exercises.json'), 'utf8')).filter(e => e.id.startsWith('lib_') && !eight.includes(e.id));
  if (n - 8 > lib.length) throw new Error(`synthetic: only ${lib.length + 8} library ids, asked for ${n}`);
  const rowsOut = {};
  lib.slice(0, n - 8).forEach((e, i) => {
    const sid = eight[i % 8], s = plates[sid], nc = e.id.slice(4).replace(/_/g, '-');
    if (Object.values(plates).some(p => p.chromeId === nc || p.prefix === nc)) throw new Error(`synthetic: chrome id clash ${nc}`);
    const re = token(s.chromeId);
    const ht = readFileSync(join(root, G, `ht-${s.slug}.ts`), 'utf8').replace(re, nc).replace(`id: "${sid}"`, `id: "${e.id}"`);
    if (!ht.includes(`id: "${e.id}"`)) throw new Error(`synthetic: id not replaced in ${e.id}`);
    writeFileSync(join(root, G, `ht-${nc}.ts`), ht);
    for (const k of ['hand', 'posture', 'feel']) {
      const f = join(root, G, `${k}-${s.chromeId}.ts`);
      if (existsSync(f)) writeFileSync(join(root, G, `${k}-${nc}.ts`), readFileSync(f, 'utf8').replace(re, nc).replace(`css/zoom-${s.chromeId}.css`, `css/zoom-${nc}.css`));
    }
    // one rule makes each close-up CSS unique, so the bundler cannot fold identical files into one asset
    const css = join(root, CSS, `zoom-${s.chromeId}.css`);
    if (existsSync(css)) writeFileSync(join(root, CSS, `zoom-${nc}.css`), `${readFileSync(css, 'utf8')}\n.ht .lib2-${nc}{order:0}\n`);
    rowsOut[e.id] = { src: `library/specs/${e.id.slice(4)}.mjs`, slug: nc, prefix: nc, chromeId: nc, mode: 'H', stage: 'shipped' };
  });
  const batches = join(root, 'tools/plates/library/batches');
  mkdirSync(batches, { recursive: true });
  for (const f of readdirSync(batches)) if (f.endsWith('.json')) rmSync(join(batches, f));
  if (n > 8) writeFileSync(join(batches, 'zz-synthetic.json'), JSON.stringify({ batch: 'SYNTH', rows: rowsOut }));
  // the generator in the copy (its ROOT is the copy): ids.ts and loaders.ts from the registry (ids.ts without the hints,
  // which content.mjs adds; the sheet chunk does not depend on them)
  const gen = await import(pathToFileURL(join(root, 'tools/plates/gen/ids.mjs')).href);
  for (const o of await gen.outputs()) if (['src/howto/generated/loaders.ts', 'src/howto/ids.ts'].includes(o.path)) writeFileSync(join(root, o.path), o.text);
  const ids = [...eight, ...Object.keys(rowsOut)];
  return { root, ids, chromeIds: [...eight.map(id => plates[id].chromeId), ...Object.values(rowsOut).map(r => r.chromeId)] };
}

/** vite build in `root` (its own config); returns www/assets' files as { name: Buffer }. */
export function buildAssets(root) {
  // the environment of `npm run build`: no NODE_ENV or VITEST* from a calling test runner (they switch vite to dev builds)
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_ENV' && !k.startsWith('VITEST') && k !== 'TEST'));
  const r = spawnSync(process.execPath, [join(root, 'node_modules/vite/bin/vite.js'), 'build', '--logLevel', 'error'], { cwd: root, env, encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.status !== 0) throw new Error(`synthetic: vite build failed in ${root}: ${r.stderr || r.stdout}`);
  const dir = join(root, 'www/assets');
  return Object.fromEntries(readdirSync(dir).map(f => [f, readFileSync(join(dir, f))]));
}

/** The one asset matching `re`, with its raw and gz (default level, as the gate) sizes. */
export function one(assets, re) {
  const m = Object.keys(assets).filter(f => re.test(f));
  if (m.length !== 1) throw new Error(`synthetic: expected one asset matching ${re}, found ${m.join(', ') || 'none'}`);
  const buf = assets[m[0]];
  return { name: m[0], buf, raw: buf.length, gz: gzipSync(buf).length };
}

/** A chunk's text with every content-hashed file name made neutral (hashes are 8 [\w-] characters). */
export const unhashed = buf => buf.toString('utf8').replace(/-[\w-]{8}\.(js|css)\b/g, '-HASH.$1');

/** The keys of the HAND, POSTURE and FEEL maps in a generated loaders.ts source. */
export function mapKeys(loadersTs) {
  const keysOf = name => {
    const m = loadersTs.match(new RegExp(`^export const ${name}\\b.* = \\{([\\s\\S]*?)\\};$`, 'm'));
    return m ? [...m[1].matchAll(/^ {2}"([a-z0-9-]+)": /gm)].map(x => x[1]) : null;
  };
  return { HAND: keysOf('HAND'), POSTURE: keysOf('POSTURE'), FEEL: keysOf('FEEL') };
}

// LIB-4c (card LIB-4c Do 3; D-LIB4-MODE, D-LIB4c-1 (d)): which library ids a push must prove in affected mode. Every
// changed path (git diff --name-only FETCH_HEAD HEAD) goes to the first class that matches:
//   1 one id's own files      -> that id (its batch row, spec, How-to, golden entries, its batch's layers page, its
//                                research card and quotes, its per-id generated files whose inputsSha256 moved)
//   2 registry-derived files  -> the ids whose rows differ (all of them when no row differs: fail-safe)
//   3 a tools/plates/** input that generated outputs list at HEAD (map built here, proven against every header)
//                             -> the ids whose per-id files alone list it; all ids when any other output lists it
//   4 shared inputs           -> all ids        5 neutral paths -> 0 ids        6 anything else -> all ids
// `changed: null` (the fetch failed) selects every id. Every base-side value read is returned in `baseValues`, so the
// verdict can recompute the same set at the sha without fetching. Build and CI time only; never bundled.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { BATCH_DIR, LIBRARY_GOLDEN_DIR, batchGoldenOf, rows, sourceOf } from '../registry.mjs';
import { libraryIds } from './plan.mjs';

/** Class 2: files derived from the registry rows. */
export const CLASS2 = ['src/howto/ids.ts', 'src/howto/lib-id.ts', 'src/howto/coverage.ts', 'src/howto/generated/index.ts', 'src/howto/generated/loaders.ts', 'tools/plates/library/ids-node.mjs'];
/** The HT-2 core and LIB-2b's plugins: never class 3 (every output's hash covers them). */
export const NOT_CLASS3 = p => p === 'tools/plates/generate.mjs' || p.startsWith('tools/plates/lib/') || p.startsWith('tools/plates/gen/');
/** Class 4 entry point whose esbuild import closure selects all ids. */
export const LAZY = 'src/slices/howto/lazy.tsx';

const CLASS4 = [
  p => p === 'src/data/exercises.json',
  p => p.startsWith('src/slices/howto/') || p.startsWith('src/howto/'),
  p => p === 'src/ui/styles.css' || /\.(woff2?|ttf|otf)$/.test(p),
  p => ['index.html', 'vite.config.ts', 'tsconfig.json'].includes(p) || /^package(-lock)?\.json$/.test(p),
  p => p.startsWith('tools/plates/'),
  p => p.startsWith('tests/howto/'),
  p => /^scripts\/howto-[^/]*\.mjs$/.test(p) || p === 'scripts/ci-verdict.mjs',
  p => p.startsWith('.github/'),
  p => p.startsWith('docs/research/howto/'),
];
const CLASS5 = [
  p => p.startsWith('docs/') || (!p.includes('/') && p.endsWith('.md')) || p.startsWith('.claude/'),
  p => p.startsWith('escobar-worker/') || p.startsWith('relay/') || p.startsWith('native/'),
  p => p === 'scripts/screenshot-gate.mjs' || /^scripts\/gate-[^/]*\.mjs$/.test(p) || p === 'scripts/ht10-gate.mjs',
  p => p.startsWith('tests/'),
  p => p.startsWith('src/'),
];

/** The class a path gets from the path rules alone (4, 5 or 6), before the lazy.tsx closure: src/** outside class 4's
 *  patterns is class 4 when the closure holds it (affectedIds checks that), else 5. */
export const staticClass = p => (CLASS4.some(f => f(p)) ? 4 : CLASS5.some(f => f(p)) ? 5 : 6);

const HEADER = /^(?:\/\/|\/\*) GENERATED, do not edit\. Written by tools\/plates\/generate\.mjs \(([^)]*)\)\. inputsSha256=([0-9a-f]{64})/;
const hashOfText = t => (t == null ? null : HEADER.exec(t)?.[2] ?? null);
const readHead = (root, p) => (existsSync(join(root, p)) ? readFileSync(join(root, p), 'utf8') : null);
const card = id => id.replace(/^lib_/, '');
const strip = e => { const { prev, ...rest } = e; return rest; };

/** The base-side text of a path through git (null when it does not exist at base). */
export function gitShow(root, base, p) {
  try { return execFileSync('git', ['show', `${base}:${p}`], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return null; }
}

/** The esbuild import closure of lazy.tsx (repo-relative), or null when it cannot be built. */
export async function lazyClosure(root = ROOT) {
  try {
    const { build } = await import('esbuild');
    const r = await build({ entryPoints: [LAZY], bundle: true, write: false, metafile: true, format: 'esm', platform: 'browser', packages: 'external', logLevel: 'silent', absWorkingDir: root, outdir: 'lazy-out',
      loader: { '.svg': 'file', '.png': 'file', '.woff2': 'file', '.woff': 'file', '.ttf': 'file', '.jpg': 'file', '.webp': 'file' } });
    return Object.keys(r.metafile.inputs).map(p => p.split('\\').join('/')).filter(p => !p.includes('node_modules/'));
  } catch { return null; }
}

/**
 * Class 3's map, built at `root` without editing the generator: generate.mjs's exported loadPlugins() in order, each
 * plugin's outputs() with the ctx render() passes (prev, hashFor from lib/inputs.mjs's inputsSha256 the same way), and
 * each output's inputs (o.inputs, else mod.inputs()), joined per path across writers as render() joins them. Proven:
 * every output's inputsSha256(writers, inputs) must equal the header on disk. Returns { inputs: Map(path -> [input]),
 * writers, proven, why }.
 */
export async function inputsMap(root = ROOT) {
  const { loadPlugins } = await import(pathToFileURL(join(root, 'tools/plates/generate.mjs')).href);
  const { inputsSha256 } = await import(pathToFileURL(join(root, 'tools/plates/lib/inputs.mjs')).href);
  const prev = new Map(), writers = new Map(), inputs = new Map();
  for (const { path, mod } of await loadPlugins()) {
    const own = mod.inputs();
    const listOf = oi => (oi === undefined ? own : oi);
    const hashFor = (p, oi) => inputsSha256([...(writers.get(p) ?? []), path].sort(), [...(inputs.get(p) ?? []), ...listOf(oi)]);
    for (const o of await mod.outputs({ prev, hashFor })) {
      prev.set(o.path, o.text);
      writers.set(o.path, [...new Set([...(writers.get(o.path) ?? []), path])].sort());
      inputs.set(o.path, [...(inputs.get(o.path) ?? []), ...listOf(o.inputs)]);
    }
  }
  const bad = [];
  for (const [p, ins] of inputs) {
    const disk = hashOfText(readHead(root, p)), mine = inputsSha256(writers.get(p), ins);
    if (disk !== mine) bad.push(`${p}: header ${disk?.slice(0, 12) ?? 'none'} != collected ${mine.slice(0, 12)}`);
  }
  return { inputs, writers, proven: bad.length === 0, why: bad };
}

/** The per-id generated files of a library row (class 1), repo-relative. */
export const perIdFiles = row => [`src/howto/generated/ht-${row.slug}.ts`, `src/howto/generated/posture-${row.chromeId}.ts`, `src/howto/generated/feel-${row.chromeId}.ts`, `src/slices/howto/css/zoom-${row.chromeId}.css`];

/** The comparable form of a batch row: the row plus its batch-level fields. */
const rowKey = (b, id) => JSON.stringify({ row: b.rows[id], pages: b.pages ?? null, censusRef: b.censusRef ?? null, batch: b.batch ?? null });

/**
 * { ids, all, reasons: [{ path, cls, ids | 'all', why }], baseValues, class3 } for the changed paths. `base`: the git
 * ref the base side is read from (FETCH_HEAD in CI); `baseValues` replaces git (the verdict's recompute). A base value
 * the verdict needs but the proof lacks makes that path select all ids.
 */
export async function affectedIds({ changed, base = 'FETCH_HEAD', root = ROOT, baseValues = null, all = rows(root), class3 = 'auto' }) {
  const U = libraryIds(all), inU = new Set(U), reasons = [], picked = new Set();
  const values = { batch: {}, golden: {}, hash: {} };
  const readBase = (kind, p, parse) => {
    if (baseValues) { if (!(p in (baseValues[kind] ?? {}))) return { missing: true }; return { v: baseValues[kind][p] }; }
    const v = parse(gitShow(root, base, p));
    values[kind][p] = v;
    return { v };
  };
  const done = (ids, extra) => ({ ids, all: ids.length === U.length && U.length > 0, reasons, baseValues: values, class3: extra });
  if (changed === null) { reasons.push({ path: '*', cls: 0, ids: 'all', why: 'git fetch of origin main failed' }); return done([...U], { active: false, why: 'not needed' }); }

  const lib = all.filter(r => inU.has(r.id)), byId = new Map(lib.map(r => [r.id, r]));
  const batchIds = file => lib.filter(r => r.batchFile === file).map(r => r.id);
  // research cards named by each id's How-to (class 1); an id whose How-to cannot be read leaves research paths to class 4
  let research = null;
  const researchMap = async () => {
    if (research) return research;
    research = new Map();
    for (const r of lib) {
      try {
        const src = (await import(pathToFileURL(join(root, sourceOf(r.id, root))).href)).default, c = src?.research?.card;
        if (typeof c !== 'string') continue;
        const add = p => research.set(p, [...(research.get(p) ?? []), r.id]);
        add(c);
        const q = /^docs\/research\/howto\/cards\/(.+\.json)$/.exec(c);
        if (q) add(`docs/research/howto/quotes/${q[1]}`);
      } catch { /* that id's card is unknown: its research paths fall to class 4 */ }
    }
    return research;
  };
  let pairs;
  const pairKeys = async () => {
    if (pairs !== undefined) return pairs;
    try { pairs = (await import(pathToFileURL(join(root, 'tools/plates/library/hands/pairs.mjs')).href)).HAND_OF_ID ?? null; } catch { pairs = null; }
    return pairs;
  };
  let map;
  const class3Map = async () => {
    if (map !== undefined) return map;
    if (class3 === 'off') map = { proven: false, why: ['class 3 switched off'] };
    else { try { map = await inputsMap(root); } catch (e) { map = { proven: false, why: [`map not built: ${e.message.split('\n')[0]}`] }; } }
    return map;
  };
  let closure;
  const lazySet = async () => { if (closure === undefined) closure = await lazyClosure(root); return closure; };
  const rowsDiffer = new Set();
  const perIdOwner = new Map(lib.flatMap(r => perIdFiles(r).map(f => [f, r.id])));

  const class1 = async p => {
    if (p.startsWith(`${BATCH_DIR}/`) && p.endsWith('.json')) {
      const { v: b0, missing } = readBase('batch', p, t => { try { return t == null ? null : JSON.parse(t); } catch { return null; } });
      if (missing) return { ids: 'all', why: 'base rows not in the proof' };
      let b1 = null;
      try { b1 = JSON.parse(readHead(root, p) ?? 'null'); } catch { b1 = null; }
      const ids0 = Object.keys(b0?.rows ?? {}), ids1 = Object.keys(b1?.rows ?? {}), diff = [];
      for (const id of new Set([...ids0, ...ids1])) if (!b0?.rows?.[id] || !b1?.rows?.[id] || rowKey(b0, id) !== rowKey(b1, id)) diff.push(id);
      for (const id of diff) rowsDiffer.add(id);
      const sel = diff.filter(id => inU.has(id));
      return { ids: sel.length || diff.length ? sel : batchIds(p), why: diff.length ? `rows differ: ${diff.join(', ')}` : 'batch file changed, no row differs: its batch' };
    }
    for (const r of lib) {
      if (p === `tools/plates/${r.src}` || p.startsWith(`tools/plates/library/specs/${card(r.id)}.`) || p.startsWith(`tools/plates/library/specs/${card(r.id)}/`)) return { ids: [r.id], why: 'spec' };
      if (p === `tools/plates/library/howto/${r.id}.howto.mjs`) return { ids: [r.id], why: 'How-to source' };
    }
    if (p.startsWith(`${LIBRARY_GOLDEN_DIR}/`) && p.endsWith('.json')) {
      const { v: g0, missing } = readBase('golden', p, t => { try { return t == null ? null : JSON.parse(t); } catch { return null; } });
      const holders = lib.filter(r => batchGoldenOf(r.batchFile) === p).map(r => r.id);
      if (missing) return { ids: 'all', why: 'base golden entries not in the proof' };
      let g1 = null;
      try { g1 = JSON.parse(readHead(root, p) ?? 'null'); } catch { g1 = null; }
      const latest = g => { const m = new Map(); for (const e of g?.entries ?? []) m.set(e.kind === 'plate' ? `plate:${e.id}` : e.kind, JSON.stringify(strip(e))); return m; };
      const a = latest(g0), b = latest(g1), keys = new Set([...a.keys(), ...b.keys()]), sel = new Set();
      let shared = JSON.stringify(g0?.base ?? null) !== JSON.stringify(g1?.base ?? null);
      for (const k of keys) if (a.get(k) !== b.get(k)) { if (k.startsWith('plate:')) sel.add(k.slice(6)); else shared = true; }
      const ids = shared || !sel.size ? holders : [...sel].filter(id => inU.has(id));
      return { ids, why: shared ? 'batch pin changed: its batch' : sel.size ? `entries of ${[...sel].join(', ')}` : 'golden file changed, no latest entry differs: its batch' };
    }
    const layers = lib.filter(r => r.pages?.layers === p);
    if (layers.length) return { ids: layers.map(r => r.id), why: 'committed layers page of its batch' };
    if (p.startsWith('docs/research/howto/') || p.startsWith('tests/')) {
      const m = await researchMap();
      if (m.has(p)) return { ids: m.get(p), why: 'research card named by its How-to' };
    }
    const owner = perIdOwner.get(p), pairKey = /^src\/howto\/generated\/handpair-(.+)\.ts$/.exec(p)?.[1];
    if (owner || pairKey) {
      const { v: h0, missing } = readBase('hash', p, hashOfText);
      if (missing) return { ids: 'all', why: 'base inputsSha256 not in the proof' };
      const h1 = hashOfText(readHead(root, p));
      if (!h1 || h0 === h1) return null;   // unchanged inputs: not this class (class 4 selects all)
      if (owner) return { ids: [owner], why: 'per-id generated file, inputsSha256 moved' };
      const keys = await pairKeys();
      const ids = keys ? lib.filter(r => keys[r.id] === pairKey).map(r => r.id) : null;
      return ids?.length ? { ids, why: `hand pair ${pairKey}` } : null;
    }
    return null;
  };

  const pending = [];
  for (const p of changed) {
    const c1 = await class1(p);
    if (c1) { reasons.push({ path: p, cls: 1, ...c1 }); continue; }
    if (CLASS2.includes(p)) { pending.push(p); continue; }
    if (p.startsWith('tools/plates/') && !NOT_CLASS3(p)) {
      const M = await class3Map();
      if (M.proven && [...M.inputs.values()].some(ins => ins.includes(p))) {
        const listers = [...M.inputs].filter(([, ins]) => ins.includes(p)).map(([out]) => out);
        const owners = listers.map(o => perIdOwner.get(o) ?? null);
        const pk = listers.map(o => /^src\/howto\/generated\/handpair-(.+)\.ts$/.exec(o)?.[1]);
        let ids = null;
        if (listers.every((o, i) => owners[i] || pk[i])) {
          const keys = pk.some(Boolean) ? await pairKeys() : {};
          ids = [...new Set(listers.flatMap((o, i) => (owners[i] ? [owners[i]] : lib.filter(r => keys?.[r.id] === pk[i]).map(r => r.id))))];
        }
        reasons.push({ path: p, cls: 3, ids: ids?.length ? ids : 'all', why: ids?.length ? `listed only by ${listers.join(', ')}` : `listed by ${listers.filter((o, i) => !owners[i]).slice(0, 3).join(', ')}` });
        continue;
      }
    }
    const sc = staticClass(p);
    if (sc === 4) { reasons.push({ path: p, cls: 4, ids: 'all', why: 'shared input' }); continue; }
    if (p.startsWith('src/')) {
      const c = await lazySet();
      if (!c || c.includes(p)) { reasons.push({ path: p, cls: 4, ids: 'all', why: c ? `in the import closure of ${LAZY}` : `closure of ${LAZY} not built` }); continue; }
    }
    if (sc === 5) { reasons.push({ path: p, cls: 5, ids: [], why: 'neutral' }); continue; }
    reasons.push({ path: p, cls: 6, ids: 'all', why: 'unclassified path' });
  }
  for (const p of pending) {
    const ids = [...rowsDiffer].filter(id => inU.has(id));
    reasons.push({ path: p, cls: 2, ids: rowsDiffer.size ? ids : 'all', why: rowsDiffer.size ? `rows differ: ${[...rowsDiffer].join(', ')}` : 'registry-derived file changed, no row differs' });
  }
  for (const r of reasons) for (const id of r.ids === 'all' ? U : r.ids) picked.add(id);
  return done(U.filter(id => picked.has(id)), map ? { active: !!map.proven, why: map.why?.slice(0, 5) ?? [] } : { active: false, why: 'not needed' });
}

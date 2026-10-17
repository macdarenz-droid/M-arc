// LIB-4c (card LIB-4c): library CI. Each block names its acceptance id. C1-C3 are pure; C4 runs affectedIds on real
// temporary git repos (a light tree with three registry rows, and LIB-2b's fixtureTree with its generated files for
// class 3); C5, C6 and C8 run the verdict family on fixture proofs; C7 scans the How-to sources and a fresh build; C9
// rebuilds the pinned pages of LIB-2b's fixtureTree. The CI runs (C11-C14) are recorded on the PR.
import { execFileSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs build tool, no types
import { JOB_BUDGET_S, SHARD_TARGET_S as LIB_TARGET, idsOfShard, libraryIds, libraryPlan, planK, readTimes, shardLoads } from '../../tools/plates/library/ci/plan.mjs';
// @ts-expect-error plain .mjs build tool, no types
import { modeOf } from '../../tools/plates/library/ci/mode.mjs';
// @ts-expect-error plain .mjs build tool, no types
import { affectedIds, inputsMap, lazyClosure, staticClass } from '../../tools/plates/library/ci/affected.mjs';
// @ts-expect-error plain .mjs build tool, no types
import { collectLibrary, libraryVerdict, pinnedPages } from '../../tools/plates/library/ci/verdict.mjs';
// @ts-expect-error plain .mjs build tool, no types
import { firstDifference } from '../../tools/plates/library/ci/compare.mjs';
// @ts-expect-error plain .mjs build tool, no types
import { refreshLibraryTimes } from '../../tools/plates/library/ci/times.mjs';
// @ts-expect-error plain .mjs build tool, no types
import { JOB_BUDGET_S as GATE_BUDGET, SHARD_TARGET_S as GATE_TARGET } from '../../scripts/ci-verdict.mjs';
// @ts-expect-error plain .mjs build tool, no types
import { wwwHash as gateWwwHash } from '../../scripts/gate-split.mjs';
// @ts-expect-error plain .mjs build tool, no types
import { wwwHash as libWwwHash, inputProblems } from '../../scripts/howto-shard.mjs';
// @ts-expect-error plain .mjs build tool, no types
import { LIB_ONCE, libraryTuples, parseState } from '../../tools/plates/library/fidelity/tuples.mjs';
// @ts-expect-error plain .mjs build tool, no types
import { rows as registryRows } from '../../tools/plates/library/registry.mjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = join(__dirname, '..', '..');
const SHA = 'a'.repeat(40);
const sha256 = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
const tmps: string[] = [];
afterAll(() => { for (const d of tmps) rmSync(d, { recursive: true, force: true }); });
const git = (cwd: string, ...a: string[]) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const cleanEnv = () => Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_ENV' && !k.startsWith('VITEST') && k !== 'TEST'));
const run = (cwd: string, args: string[], env: Record<string, string> = {}) => new Promise<{ code: number; out: string }>(resolve => {
  const c = spawn(process.execPath, args, { cwd, env: { ...cleanEnv(), ...env } });
  let out = '';
  c.stdout.on('data', d => { out += d; }); c.stderr.on('data', d => { out += d; });
  c.on('close', code => resolve({ code: code ?? 1, out }));
});
const put = (root: string, p: string, text: string | Buffer) => { mkdirSync(dirname(join(root, p)), { recursive: true }); writeFileSync(join(root, p), text); };
const items = (n: number, s = 271) => Array.from({ length: n }, (_, i) => ({ id: `x${String(i).padStart(3, '0')}`, seconds: s }));
/** Problems of a shard list against its items: every id exactly once. */
const coverOf = (ids: string[], shards: string[][]) => {
  const seen = new Map<string, number>(), out: string[] = [];
  for (const s of shards) for (const id of s) seen.set(id, (seen.get(id) ?? 0) + 1);
  for (const id of ids) if (seen.get(id) !== 1) out.push(`${id} in ${seen.get(id) ?? 0} shards`);
  for (const id of seen.keys()) if (!ids.includes(id)) out.push(`${id} not an item`);
  return out;
};

describe('C1: each shipped id is in exactly one shard', () => {
  const times = { default: 271, c0: 30, once: { run: 40, shard: 8 }, ids: {} };
  for (const N of [0, 1, 4, 8, 14, 145, 153]) it(`N = ${N}, every K in 1..${Math.max(16, N)}`, () => {
    const it0 = items(N), ids = it0.map(x => x.id);
    for (let K = 1; K <= Math.max(16, N); K++) {
      const { shards } = shardLoads(it0, K, times);
      expect(shards).toHaveLength(K);
      expect(coverOf(ids, shards)).toEqual([]);
      const plan = { shards };
      expect(coverOf(ids, Array.from({ length: K }, (_, i) => idsOfShard(plan, i + 1)))).toEqual([]);
    }
  });
  it('the real registry: libraryPlan covers libraryIds() exactly once, and the shard reader is 1-based', () => {
    const ids = libraryIds(registryRows(ROOT)), plan = libraryPlan({ ids, times: readTimes(ROOT) });
    expect(coverOf(ids, plan.shards)).toEqual([]);
    expect(coverOf(ids, Array.from({ length: plan.K }, (_, i) => idsOfShard(plan, i + 1)))).toEqual([]);
    const p2 = libraryPlan({ ids: ['a', 'b', 'c'], times: { default: 600, c0: 0, once: { run: 0, shard: 0 }, ids: {} } });
    expect(p2.K).toBe(3);
    expect([1, 2, 3].map(k => idsOfShard(p2, k)).flat().sort()).toEqual(['a', 'b', 'c']);
  });
  it('the cover check bites: a dropped item and a duplicate id are red', () => {
    const it0 = items(14), ids = it0.map(x => x.id), { shards } = shardLoads(it0, 5, times);
    expect(coverOf(ids, shards.map((s: string[], j: number) => (j === 4 ? s.slice(0, -1) : s)))).not.toEqual([]);
    expect(coverOf(ids, shards.map((s: string[], j: number) => (j === 0 ? [...s, shards[1][0]] : s)))).not.toEqual([]);
    expect(() => libraryPlan({ ids: ['a', 'a'], times })).toThrow(/twice/);
  });
});

describe('C2: integer-aware K (t = 271, c0 = 30)', () => {
  const times = { default: 271, c0: 30, once: { run: 0, shard: 0 }, ids: {} };
  it('K(0) = 1, K(4) = 2, K(14) = 5, K(145) = 49, every packed shard <= 900', () => {
    for (const [n, K] of [[0, 1], [4, 2], [14, 5], [145, 49]]) {
      const p = libraryPlan({ ids: items(n).map(x => x.id), times });
      expect([n, p.K]).toEqual([n, K]);
      for (const s of p.loads) expect(s).toBeLessThanOrEqual(900);
      expect(p.note).toBeNull();
    }
    expect(Math.ceil((145 * 271) / (900 - 30))).toBe(46);   // the rule D-LIB4-SHARD replaces: 46 shards, some over 900
    expect(Math.max(...shardLoads(items(145), 46, times).loads)).toBeGreaterThan(900);
  });
  it('shard 1 carries the once-states; an id alone over 900 s gets its own shard with a note; the numbers are GATE-SPLIT\'s', () => {
    const t = { default: 271, c0: 30, once: { run: 300, shard: 10 }, ids: {} }, p = libraryPlan({ ids: items(4).map(x => x.id), times: t });
    expect(p.loads[0]).toBe(30 + 310 + 271 * p.shards[0].length);
    for (const s of p.loads) expect(s).toBeLessThanOrEqual(900);
    const big = libraryPlan({ ids: ['a', 'b'], times: { default: 271, c0: 30, once: { run: 0, shard: 0 }, ids: { a: 1000 } } });
    expect([big.K, big.shards.map((s: string[]) => s.length)]).toEqual([2, [1, 1]]);
    expect(big.note).toMatch(/over alone: a/);
    expect(planK([], times)).toEqual({ K: 1, note: null });
    expect([LIB_TARGET, JOB_BUDGET_S]).toEqual([GATE_TARGET, GATE_BUDGET]);
  });
  it('an unmeasured id uses the largest measured time, else default; the hash covers ids, times and K', () => {
    const t = { default: 100, c0: 0, once: { run: 0, shard: 0 }, ids: { a: 400 } };
    expect(libraryPlan({ ids: ['a', 'b', 'c'], times: t }).loads.reduce((x: number, y: number) => x + y, 0)).toBe(1200);
    const h = (ids: string[], tt: any) => libraryPlan({ ids, times: tt }).hash;
    expect(h(['a', 'b'], t)).toBe(h(['b', 'a'], t));
    expect(h(['a', 'b'], t)).not.toBe(h(['a', 'c'], t));
    expect(h(['a', 'b'], t)).not.toBe(h(['a', 'b'], { ...t, c0: 1 }));
  });
});

describe('C3: mode by ref and event', () => {
  it.each([
    ['refs/heads/main', 'push', 'full'],
    ['refs/heads/claude/sup-merge-train-21', 'push', 'full'],
    ['refs/heads/claude/sup-merge-train-18b', 'push', 'affected'],
    ['refs/heads/claude/x', 'push', 'affected'],
    ['refs/heads/claude/x', 'workflow_dispatch', 'full'],   // split and serial arrangements alike: the mode reads no arrangement
    ['refs/tags/v1.2.0', 'push', 'affected'],
    ['refs/heads/mainx', 'push', 'affected'],
  ])('%s on %s is %s', (ref, event, mode) => { expect(modeOf({ ref, event })).toBe(mode); });
});

// ---- C4 ------------------------------------------------------------------------------------------------------------
/** A light real git repo: the registry inputs, src/ (for lazy.tsx's closure) and three shipped library rows. */
function lightTree() {
  const root = mkdtempSync(join(tmpdir(), 'lib4c-light-')); tmps.push(root);
  for (const p of ['src', 'tsconfig.json', 'tools/plates/plates.json', 'package.json']) cpSync(join(ROOT, p), join(root, p), { recursive: true });
  symlinkModules(root);
  const row = (n: string) => ({ src: `library/specs/${n}.mjs`, slug: n.replace(/_/g, '-'), prefix: n.replace(/_/g, '-'), chromeId: n.replace(/_/g, '-'), mode: 'H', stage: 'shipped' });
  const names = ['barbell_row', 't_bar_row', 'landmine_row'];
  put(root, 'tools/plates/library/batches/zz-c4.json', `${JSON.stringify({ batch: 'C4', pages: { plates: 'tools/plates/library/pages/zz-c4.json', layers: 'tests/howto/golden/library/zz-c4.layers.html', layersConfig: 'tools/plates/library/pages/zz-c4.layers.json' }, rows: Object.fromEntries(names.map(n => [`lib_${n}`, row(n)])) }, null, 2)}\n`);
  for (const n of names) {
    put(root, `tools/plates/library/specs/${n}.mjs`, `export default { id: '${n}' };\n`);
    put(root, `tools/plates/library/howto/lib_${n}.howto.mjs`, `export default { id: 'lib_${n}', research: { card: 'docs/research/howto/cards/${n}.json', rev: 1 } };\n`);
    put(root, `docs/research/howto/cards/${n}.json`, '{}\n');
    put(root, `docs/research/howto/quotes/${n}.json`, '{}\n');
    put(root, `src/howto/generated/ht-${n.replace(/_/g, '-')}.ts`, `// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/plates.mjs). inputsSha256=${'1'.repeat(64)}\nexport default {};\n`);
  }
  put(root, 'tests/howto/golden/library/zz-c4.json', `${JSON.stringify({ base: { index: 0, hash: 'x' }, entries: names.map(n => ({ kind: 'plate', id: `lib_${n}`, fragments: { cues: n } })).concat([{ kind: 'page', pageSha256: 'p' } as any]) }, null, 2)}\n`);
  put(root, 'tests/howto/golden/library/zz-c4.layers.html', '<p>layers</p>\n');
  git(root, 'init', '-q'); git(root, 'add', '-A'); git(root, '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'base');
  return { root, base: git(root, 'rev-parse', 'HEAD') };
}
function symlinkModules(root: string) {
  if (!existsSync(join(root, 'node_modules'))) execFileSync('ln', ['-s', join(ROOT, 'node_modules'), join(root, 'node_modules')]);
}
/** Applies `edit` as one commit on top of base, runs affectedIds on the diff, then resets to base. */
async function caseOf(t: { root: string; base: string }, edit: (root: string) => void, opts: any = {}, atHead: (r: any) => Promise<any> = async () => null) {
  edit(t.root);
  git(t.root, 'add', '-A'); git(t.root, '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'case', '--allow-empty');
  const changed = git(t.root, 'diff', '--name-only', t.base, 'HEAD').split('\n').filter(Boolean);
  try {
    const r = { changed, ...await affectedIds({ changed, base: t.base, root: t.root, all: registryRows(t.root), ...opts }) };
    return { ...r, atHead: await atHead(r) };
  } finally { git(t.root, 'reset', '-q', '--hard', t.base); }
}
const A = ['lib_barbell_row', 'lib_landmine_row', 'lib_t_bar_row'];

describe('C4: the affected rule is ordered and fail-safe (real git repo)', { timeout: 120_000 }, () => {
  let t: { root: string; base: string };
  beforeAll(() => { t = lightTree(); });
  const ids = (r: any) => [...r.ids].sort();
  it('one id\'s row selects that id; its spec, How-to and golden entry select that id', async () => {
    let r = await caseOf(t, root => { const f = join(root, 'tools/plates/library/batches/zz-c4.json'), b = JSON.parse(readFileSync(f, 'utf8')); b.rows.lib_t_bar_row.view = 'side'; writeFileSync(f, JSON.stringify(b, null, 2)); });
    expect([ids(r), r.reasons[0].cls]).toEqual([['lib_t_bar_row'], 1]);
    r = await caseOf(t, root => put(root, 'tools/plates/library/specs/landmine_row.mjs', "export default { id: 'landmine_row', x: 1 };\n"));
    expect([ids(r), r.reasons[0].cls]).toEqual([['lib_landmine_row'], 1]);
    r = await caseOf(t, root => put(root, 'tools/plates/library/howto/lib_barbell_row.howto.mjs', "export default { id: 'lib_barbell_row' };\n"));
    expect(ids(r)).toEqual(['lib_barbell_row']);
    r = await caseOf(t, root => { const f = join(root, 'tests/howto/golden/library/zz-c4.json'), g = JSON.parse(readFileSync(f, 'utf8')); g.entries[1].fragments.cues = 'changed'; writeFileSync(f, JSON.stringify(g, null, 2)); });
    expect(ids(r)).toEqual(['lib_t_bar_row']);
  });
  it('<batch>.layers.html and a batch-level pin select that batch\'s ids', async () => {
    let r = await caseOf(t, root => put(root, 'tests/howto/golden/library/zz-c4.layers.html', '<p>layers 2</p>\n'));
    expect([ids(r), r.reasons[0].cls]).toEqual([A, 1]);
    r = await caseOf(t, root => { const f = join(root, 'tests/howto/golden/library/zz-c4.json'), g = JSON.parse(readFileSync(f, 'utf8')); g.entries[3].pageSha256 = 'q'; writeFileSync(f, JSON.stringify(g, null, 2)); });
    expect(ids(r)).toEqual(A);
  });
  it('the research card named by one id (and its quotes file) selects that id; any other research path selects all', async () => {
    let r = await caseOf(t, root => put(root, 'docs/research/howto/cards/landmine_row.json', '{"x":1}\n'));
    expect([ids(r), r.reasons[0].cls]).toEqual([['lib_landmine_row'], 1]);
    r = await caseOf(t, root => put(root, 'docs/research/howto/quotes/t_bar_row.json', '{"x":1}\n'));
    expect(ids(r)).toEqual(['lib_t_bar_row']);
    r = await caseOf(t, root => put(root, 'docs/research/howto/reviews.json', '{}\n'));
    expect([ids(r), r.reasons[0].cls]).toEqual([A, 4]);
  });
  it('a per-id generated file selects its id when its inputsSha256 moved, all ids when it did not', async () => {
    let r = await caseOf(t, root => put(root, 'src/howto/generated/ht-barbell-row.ts', `// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/plates.mjs). inputsSha256=${'2'.repeat(64)}\nexport default {};\n`));
    expect([ids(r), r.reasons[0].cls]).toEqual([['lib_barbell_row'], 1]);
    r = await caseOf(t, root => put(root, 'src/howto/generated/ht-barbell-row.ts', `// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/plates.mjs). inputsSha256=${'1'.repeat(64)}\nexport default { x: 1 };\n`));
    expect([ids(r), r.reasons[0].cls]).toEqual([A, 4]);
  });
  it('exercises.json selects all (class 4, never class 3); src/ui/primitives.tsx selects all (lazy.tsx closure)', async () => {
    let r = await caseOf(t, root => { const f = join(root, 'src/data/exercises.json'); writeFileSync(f, `${readFileSync(f, 'utf8')}\n`); });
    expect([ids(r), r.reasons[0].cls]).toEqual([A, 4]);
    r = await caseOf(t, root => { const f = join(root, 'src/ui/primitives.tsx'); writeFileSync(f, `${readFileSync(f, 'utf8')}\n// x\n`); });
    expect([ids(r), r.reasons[0].cls]).toEqual([A, 4]);
  });
  it('screenshot-gate.mjs alone selects 0; docs only select 0; an unknown path selects all', async () => {
    let r = await caseOf(t, root => put(root, 'scripts/screenshot-gate.mjs', '// x\n'));
    expect([ids(r), r.reasons[0].cls]).toEqual([[], 5]);
    r = await caseOf(t, root => { put(root, 'docs/notes.md', 'x\n'); put(root, 'README.md', 'x\n'); });
    expect(ids(r)).toEqual([]);
    expect(r.reasons.map((x: any) => x.cls)).toEqual([5, 5]);
    r = await caseOf(t, root => put(root, 'mystery/file.bin', 'x'));
    expect([ids(r), r.reasons[0].cls]).toEqual([A, 6]);
  });
  it('ids.ts selects the changed rows (all when no row differs); changed = null selects all', async () => {
    let r = await caseOf(t, root => {
      put(root, 'src/howto/ids.ts', '// x\n');
      const f = join(root, 'tools/plates/library/batches/zz-c4.json'), b = JSON.parse(readFileSync(f, 'utf8')); b.rows.lib_barbell_row.view = 'front'; writeFileSync(f, JSON.stringify(b, null, 2));
    });
    expect(ids(r)).toEqual(['lib_barbell_row']);
    expect(r.reasons.find((x: any) => x.path === 'src/howto/ids.ts')).toMatchObject({ cls: 2, ids: ['lib_barbell_row'] });
    r = await caseOf(t, root => put(root, 'src/howto/ids.ts', '// y\n'));
    expect([ids(r), r.reasons[0].cls]).toEqual([A, 2]);
    const n = await affectedIds({ changed: null, root: t.root, all: registryRows(t.root) });
    expect([...n.ids].sort()).toEqual(A);
  });
  it('the order is first-match: a spec under tools/plates/** is class 1, never class 3 or 4; base values replace git (the verdict\'s recompute)', async () => {
    const r = await caseOf(t, root => { const f = join(root, 'tools/plates/library/batches/zz-c4.json'), b = JSON.parse(readFileSync(f, 'utf8')); b.rows.lib_t_bar_row.view = 'side'; writeFileSync(f, JSON.stringify(b, null, 2)); }, {}, async x => ({
      again: await affectedIds({ changed: x.changed, base: 'nonexistent-ref', baseValues: x.baseValues, root: t.root, all: registryRows(t.root) }),
      missing: await affectedIds({ changed: x.changed, baseValues: {}, root: t.root, all: registryRows(t.root) }),
    }));
    expect(r.ids).toEqual(['lib_t_bar_row']);
    expect(r.atHead.again.ids).toEqual(r.ids);
    expect([...r.atHead.missing.ids].sort()).toEqual(A);   // a base value the proof lacks: that path selects all
  });
  it('the static classes: every class-4 and class-5 pattern from the card', () => {
    for (const p of ['src/data/exercises.json', 'src/slices/howto/x.tsx', 'src/howto/y.ts', 'src/ui/styles.css', 'index.html', 'vite.config.ts', 'tsconfig.json', 'package.json', 'package-lock.json', 'tools/plates/layers.mjs', 'tests/howto/a.test.ts', 'scripts/howto-shard.mjs', 'scripts/ci-verdict.mjs', '.github/workflows/build-apk.yml', 'docs/research/howto/reviews.json']) expect([p, staticClass(p)]).toEqual([p, 4]);
    for (const p of ['docs/a.md', 'README.md', '.claude/x.md', 'escobar-worker/a.ts', 'relay/a', 'native/a', 'scripts/screenshot-gate.mjs', 'scripts/gate-split.mjs', 'scripts/ht10-gate.mjs', 'tests/a.test.ts', 'src/app/App.tsx']) expect([p, staticClass(p)]).toEqual([p, 5]);
    for (const p of ['scripts/gate-times.json', 'branding/x.png', 'capacitor.config.json']) expect([p, staticClass(p)]).toEqual([p, 6]);
  });
  it('no class-5 path is in the esbuild import closure of howto-shard.mjs, howto-rebuild.mjs or lazy.tsx', async () => {
    const { build } = await import('esbuild');
    const r = await build({ entryPoints: ['scripts/howto-shard.mjs', 'scripts/howto-rebuild.mjs'], bundle: true, write: false, metafile: true, format: 'esm', platform: 'node', packages: 'external', logLevel: 'silent', absWorkingDir: ROOT, outdir: 'c4-out' });
    const scripts = Object.keys(r.metafile.inputs);
    expect(scripts.length).toBeGreaterThan(10);
    expect(scripts.filter(p => staticClass(p) === 5)).toEqual([]);
    const lazy = await lazyClosure(ROOT);
    expect(lazy).toContain('src/ui/primitives.tsx');
    // lazy.tsx's closure is class 4 by the rule itself; none of it may be class 5 by any other path rule than src/**
    expect(lazy.filter((p: string) => staticClass(p) === 5 && !p.startsWith('src/'))).toEqual([]);
  });
});

describe('C4 class 3: the per-output inputs map, proven against every generated header', { timeout: 600_000 }, () => {
  let F: any, tree: string, base: string;
  beforeAll(async () => {
    F = await import(/* @vite-ignore */ new URL('./fixtures/lib2b/fixture.mjs', import.meta.url).href);
    tree = F.fixtureTree(); tmps.push(tree);
    cpSync(join(ROOT, 'scripts'), join(tree, 'scripts'), { recursive: true });
    const g = await run(tree, ['tools/plates/generate.mjs']);
    if (g.code !== 0) throw new Error(`generate failed in the fixture tree:\n${g.out}`);
    git(tree, 'init', '-q'); git(tree, 'add', '-A'); git(tree, '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'base');
    base = git(tree, 'rev-parse', 'HEAD');
  }, 600_000);
  /** affectedIds in a child process of the tree (its own modules, so the map is built from the tree). */
  const inTree = async (edit: (root: string) => void) => {
    edit(tree);
    git(tree, 'add', '-A'); git(tree, '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'case');
    try {
      const changed = git(tree, 'diff', '--name-only', base, 'HEAD').split('\n').filter(Boolean);
      const r = await run(tree, ['--input-type=module', '-e', `import { affectedIds } from './tools/plates/library/ci/affected.mjs'; const r = await affectedIds({ changed: ${JSON.stringify(changed)}, base: '${base}' }); console.log('@@' + JSON.stringify(r));`]);
      const line = r.out.split('\n').find(l => l.startsWith('@@'));
      if (!line) throw new Error(r.out);
      return JSON.parse(line.slice(2));
    } finally { git(tree, 'reset', '-q', '--hard', base); }
  };
  it('the map is proven on the real tree and on the fixture tree: every header equals inputsSha256(writers, collected inputs)', async () => {
    const real = await inputsMap(ROOT);
    expect(real.why).toEqual([]);
    expect(real.proven).toBe(true);
    expect(real.inputs.size).toBe(60);
    const r = await run(tree, ['--input-type=module', '-e', "import { inputsMap } from './tools/plates/library/ci/affected.mjs'; const m = await inputsMap(); console.log('@@' + JSON.stringify({ proven: m.proven, why: m.why, n: m.inputs.size }));"]);
    expect(JSON.parse(r.out.split('\n').find(l => l.startsWith('@@'))!.slice(2))).toEqual({ proven: true, why: [], n: 66 });
  });
  it('D-LIB4c-3: a new composer imported only by the fixture id\'s spec selects all (ids.ts, ids-node.mjs and sources.json list it); a path only per-id files list (the batch\'s layersConfig) selects that id; one the 8\'s outputs list selects all', async () => {
    const SPEC = F.SPEC as string, gen = (root: string) => execFileSync(process.execPath, ['tools/plates/generate.mjs'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
    let r = await inTree(root => {
      put(root, 'tools/plates/library/composers/c4.mjs', 'export const C4 = 1;\n');
      const f = join(root, SPEC); writeFileSync(f, `import { C4 } from '../composers/c4.mjs';\n${readFileSync(f, 'utf8')}`);
      gen(root);
    });
    const c3 = r.reasons.find((x: any) => x.path === 'tools/plates/library/composers/c4.mjs');
    expect(c3).toMatchObject({ cls: 3, ids: 'all' });
    expect(c3.why).toMatch(/src\/howto\/ids\.ts|tools\/plates\/library\/ids-node\.mjs|docs\/research\/howto\/sources\.json/);
    r = await inTree(root => {
      const f = join(root, F.PAGES.layersConfig), c = JSON.parse(readFileSync(f, 'utf8'));
      writeFileSync(f, `${JSON.stringify({ ...c, $comment: 'C4 class 3' }, null, 2)}\n`);
      gen(root);
    });
    expect(r.reasons.find((x: any) => x.path === F.PAGES.layersConfig)).toMatchObject({ cls: 3, ids: [F.ID] });
    expect(r.class3.active).toBe(true);
    r = await inTree(root => { put(root, 'tools/plates/layers.mjs', `${readFileSync(join(root, 'tools/plates/layers.mjs'), 'utf8')}// c4\n`); gen(root); });
    expect(r.reasons.find((x: any) => x.path === 'tools/plates/layers.mjs')).toMatchObject({ cls: 3, ids: 'all' });
  });
  it('class 3 is off when the map is not proven: its paths fall to class 4', async () => {
    const r = await inTree(root => {
      put(root, 'tools/plates/layers.mjs', `${readFileSync(join(root, 'tools/plates/layers.mjs'), 'utf8')}// c4\n`);
      const f = join(root, 'src/howto/generated/ht-cable-lateral-raise.ts'), s = readFileSync(f, 'utf8');
      writeFileSync(f, s.replace(/inputsSha256=[0-9a-f]{64}/, `inputsSha256=${'0'.repeat(64)}`));
    });
    expect(r.class3.active).toBe(false);
    expect(r.reasons.find((x: any) => x.path === 'tools/plates/layers.mjs')).toMatchObject({ cls: 4, ids: 'all' });
  });
});

// ---- C5, C6, C8: the verdict family --------------------------------------------------------------------------------
type Proof = { sha: string; shard: any; rows: any[]; meta: any };
const rowOf = (t: any, result = 'pass') => { const p = parseState(t.state); return { sha: SHA, id: t.id, check: p.check, state: t.state, theme: t.theme, width: p.width, result }; };
/** A green proof set at `root` for `ids` in `mode` (rebuild + shards + a gate proof). */
async function greenSet(root: string, { ids, times, mode = 'full', all = registryRows(root) }: any) {
  const plan = libraryPlan({ ids, times }), { pages } = pinnedPages(root);
  const pageShas = Object.fromEntries(pages.map((p: any) => [p.id, p.pageSha256]));
  const rebuild: Proof = { sha: SHA, shard: null, rows: pages.map((p: any) => ({ sha: SHA, id: p.id, check: 'L1', state: `L1/${p.kind}@*`, theme: '*', width: null, result: 'pass' })), meta: { mode, base: null, changed: mode === 'affected' ? null : [], plan: { hash: plan.hash }, pageShas, baseValues: null } };
  const tuples = await libraryTuples(ids, { root });
  const lib: Proof[] = [];
  for (let k = 1; k <= plan.K; k++) {
    const mine = idsOfShard(plan, k);
    const ts = [...LIB_ONCE.shard(k), ...(k === 1 ? LIB_ONCE.run : []), ...tuples.filter((x: any) => mine.includes(x.id))];
    lib.push({ sha: SHA, shard: plan.K > 1 ? { k: k - 1, N: plan.K } : null, rows: ts.map((x: any) => rowOf(x)), meta: { job: { k, K: plan.K }, tz: 'UTC', www: 'w', chrome: 'c', plan: plan.hash, mode, ids: mine, pageShas, px: {}, seconds: {}, onceSeconds: 10, shardSeconds: 600 } });
  }
  return { lib, rebuild: [rebuild], gate: [{ meta: { www: 'w', chrome: 'c' } }], plan, all };
}
const NEEDS = { 'howto-rebuild': { result: 'success' }, 'howto-shard': { result: 'success' } };
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

describe('C6, C8: zero library ids on this tree', { timeout: 120_000 }, () => {
  const times = { default: 280.8, c0: 30, once: { run: 0, shard: 0 }, ids: {} };
  const verdict = (s: any, over: any = {}) => libraryVerdict({ lib: s.lib, rebuild: s.rebuild, gate: s.gate, sha: SHA, ref: 'refs/heads/main', event: 'push', needs: NEEDS, root: ROOT, times, ...over });
  it('C6: K = 1, shard 1 holds exactly LIB_ONCE.shard(1) plus the 4 LIB_ONCE.run rows, and the family is green', async () => {
    const s = await greenSet(ROOT, { ids: [], times });
    expect(s.plan.K).toBe(1);
    expect(s.lib[0].rows).toHaveLength(6);
    expect(LIB_ONCE.run).toHaveLength(4);
    const v = await verdict(s);
    expect(v.problems).toEqual([]);
    expect(v.line).toBe('library: full (0 of 0)');
  });
  it('C6: shard 1\'s proof missing is red; a skipped or missing needed job is red', async () => {
    const s = await greenSet(ROOT, { ids: [], times });
    expect((await verdict({ ...s, lib: [] })).problems.join('\n')).toMatch(/expected shard proofs 1\.\.1 of 1/);
    expect((await verdict(s, { needs: { ...NEEDS, 'howto-shard': { result: 'skipped' } } })).problems).toContain('library: needed job howto-shard ended skipped');
    expect((await verdict(s, { needs: { 'howto-rebuild': { result: 'success' } } })).problems).toContain('library: needed job howto-shard is missing from MARC_NEEDS');
  });
  it('C8: the 4 LIB_ONCE.run rows exactly once, in shard 1: a failed selftest, a run row also in shard 2, or a dropped run row is red', async () => {
    const t2 = { default: 280.8, c0: 30, once: { run: 0, shard: 0 }, ids: {} };
    const s = await greenSet(ROOT, { ids: [], times: t2 });
    const failed = clone(s); failed.lib[0].rows.find((r: any) => r.state === 'qa-selftest/browser@*').result = 'fail';
    expect((await verdict(failed)).problems.join('\n')).toMatch(/qa-selftest\/browser@\*: fail/);
    const dropped = clone(s); dropped.lib[0].rows = dropped.lib[0].rows.filter((r: any) => r.state !== 'guard/HT9-A3-dup@390');
    expect((await verdict(dropped)).problems.join('\n')).toMatch(/\*\|silent-black\|guard\/HT9-A3-dup@390 proven 0 times/);
    const twice = clone(s); twice.lib.push({ ...clone(s.lib[0]), rows: [...LIB_ONCE.shard(2), LIB_ONCE.run[1]].map((x: any) => rowOf(x)), meta: { ...s.lib[0].meta, job: { k: 2, K: 1 } } });
    expect((await verdict(twice)).problems.join('\n')).toMatch(/guard\/L-sections@390 proven 2 times/);
  });
});

describe('C5: the verdict family is red on every D-LIB4-VERDICT item (LIB-2b fixture tree, one library id, K = 2)', { timeout: 600_000 }, () => {
  let F: any, tree: string, s: any, all: any[];
  // shard 1 carries the once-states (400 s), so the one id (600 s) goes to shard 2: K = 2
  const times = { default: 600, c0: 0, once: { run: 400, shard: 0 }, ids: {} };
  beforeAll(async () => {
    F = await import(/* @vite-ignore */ new URL('./fixtures/lib2b/fixture.mjs', import.meta.url).href);
    tree = F.fixtureTree(); tmps.push(tree);
    const g = await run(tree, ['tools/plates/generate.mjs']);
    if (g.code !== 0) throw new Error(`generate failed in the fixture tree:\n${g.out}`);
    all = registryRows(tree);
    s = await greenSet(tree, { ids: [F.ID], times, all });
  }, 600_000);
  const verdict = (x: any, over: any = {}) => libraryVerdict({ lib: x.lib, rebuild: x.rebuild, gate: x.gate, sha: SHA, ref: 'refs/heads/main', event: 'push', needs: NEEDS, root: tree, all, times, ...over });
  const red = async (mut: (x: any) => void, re: RegExp, over: any = {}) => {
    const x = clone(s); mut(x);
    const v = await verdict(x, over);
    expect(v.problems.join('\n')).toMatch(re);
  };
  it('the green set is green: K = 2, one id, every tuple once', async () => {
    expect(s.plan.K).toBe(2);
    expect(idsOfShard(s.plan, 2)).toEqual([F.ID]);
    const v = await verdict(s);
    expect(v.problems).toEqual([]);
    expect(v.line).toBe('library: full (1 of 1)');
  });
  it('a row dropped; a row in two shards; a missing shard; an extra shard', async () => {
    await red(x => { x.lib[1].rows.pop(); }, /proven 0 times/);
    await red(x => { x.lib[0].rows.push(clone(x.lib[1].rows[3])); }, /proven 2 times/);
    await red(x => { x.lib.pop(); }, /expected shard proofs 1\.\.2 of 2/);
    await red(x => { x.lib.push({ ...clone(x.lib[1]), meta: { ...x.lib[1].meta, job: { k: 3, K: 2 } } }); }, /expected shard proofs 1\.\.2 of 2/);
  });
  it('a wrong sha; a wrong K; a different plan hash; a shard\'s ids differ from its plan; an extra id', async () => {
    await red(x => { x.lib[1].sha = 'b'.repeat(40); for (const r of x.lib[1].rows) r.sha = x.lib[1].sha; }, /ran on b{40}, not a{40}/);
    await red(x => { for (const m of x.lib) m.meta.job.K = 3; }, /expected shard proofs 1\.\.2 of 2/);
    await red(x => { x.lib[1].meta.plan = 'f'.repeat(64); }, /packed plan ffffffffffff/);
    await red(x => { x.rebuild[0].meta.plan.hash = 'f'.repeat(64); }, /the rebuild planned ffffffffffff/);
    await red(x => { x.lib[1].meta.ids = []; }, /proved ids \[\], its plan is/);
    await red(x => { x.lib[1].rows.push({ ...clone(x.lib[1].rows[0]), id: 'lib_extra' }); }, /lib_extra\|.* proven but not expected/);
  });
  it('a fail row; a state that does not encode its check or its width', async () => {
    await red(x => { x.lib[1].rows[5].result = 'fail'; }, /: fail/);
    await red(x => { const r = x.lib[1].rows.find((y: any) => y.width === 390); r.check = 'HT6'; r.state = r.state.replace(/^[^/]+/, 'L3'); }, /state does not begin with its check/);
    await red(x => { const r = x.lib[1].rows.find((y: any) => y.width === 390); r.width = 360; }, /state does not end with its width/);
  });
  it('L1: a pinned page missing from the rebuild proof, a failed rebuild row, a rebuilt sha != pin; a shard page sha != the rebuild proof', async () => {
    await red(x => { x.rebuild[0].rows.pop(); }, /library L1: .* proven 0 times/);
    await red(x => { x.rebuild[0].rows[0].result = 'fail'; }, /library L1 .*: fail/);
    await red(x => { const k = Object.keys(x.rebuild[0].meta.pageShas)[0]; x.rebuild[0].meta.pageShas[k] = '0'.repeat(64); for (const m of x.lib) m.meta.pageShas[k] = '0'.repeat(64); }, /rebuilt 000000000000 != pinned/);
    await red(x => { const k = Object.keys(x.lib[1].meta.pageShas)[0]; x.lib[1].meta.pageShas[k] = '1'.repeat(64); }, /page shas differ from the rebuild proof/);
    await red(x => { x.rebuild = []; }, /expected one rebuild proof, got 0/);
  });
  it('www differs from the gate family\'s; chrome differs; tz is not UTC', async () => {
    await red(x => { for (const m of x.lib) m.meta.www = 'other'; }, /meta\.www other differs from the gate family's w/);
    await red(x => { x.lib[1].meta.chrome = 'c2'; }, /shard proofs differ in meta\.chrome/);
    await red(x => { x.lib[1].meta.tz = 'Pacific/Auckland'; }, /time zone Pacific\/Auckland, not UTC/);
  });
  it('shardSeconds 1801 is red; 900-1800 is a note', async () => {
    await red(x => { x.lib[1].meta.shardSeconds = 1801; }, /1801 s, over the 1800 s budget/);
    const x = clone(s); x.lib[1].meta.shardSeconds = 1800;
    const v = await verdict(x);
    expect(v.problems).toEqual([]);
    expect(v.notes.join('\n')).toMatch(/1800 s, over the 900 s target/);
  });
  it('affected mode on a full ref; a howto-shard need missing or skipped; library ids + the 8 != shippedIds()', async () => {
    await red(x => { x.rebuild[0].meta.mode = 'affected'; }, /affected mode on a full ref/);
    await red(() => {}, /needed job howto-shard ended skipped/, { needs: { ...NEEDS, 'howto-shard': { result: 'skipped' } } });
    await red(() => {}, /needed job howto-shard is missing/, { needs: { 'howto-rebuild': { result: 'success' } } });
    await red(() => {}, /differ from shippedIds/, { all: [...all, { ...all[0], id: 'lib_ghost', chromeId: 'ghost', prefix: 'ghost' }] });
  });
  it('affected mode recomputes the ids from the proof\'s base and changed list, never the proof\'s own ids', async () => {
    const changed = [F.SPEC];
    const aff = await greenSet(tree, { ids: [F.ID], times, mode: 'affected', all });
    aff.rebuild[0].meta.changed = changed; aff.rebuild[0].meta.base = 'HEAD'; aff.rebuild[0].meta.baseValues = { batch: {}, golden: {}, hash: {} };
    const v = await verdict(aff, { ref: 'refs/heads/claude/x' });
    expect(v.problems).toEqual([]);
    expect(v.line).toBe('library: affected (1 of 1)');
    // the proof claims no id was affected (its plan and shards edited to match): the recompute still selects the id
    const edited = await greenSet(tree, { ids: [], times, mode: 'affected', all });
    edited.rebuild[0].meta.changed = changed; edited.rebuild[0].meta.base = 'HEAD'; edited.rebuild[0].meta.baseValues = { batch: {}, golden: {}, hash: {} };
    const w = await verdict(edited, { ref: 'refs/heads/claude/x' });
    expect(w.problems.join('\n')).toMatch(/the rebuild planned/);
    expect(w.problems.join('\n')).toMatch(/lib_cable_lateral_raise\|.* proven 0 times/);
  });
});

describe('C7: C-TZ, no Date, Intl or toLocale in the How-to code or its built chunks', { timeout: 180_000 }, () => {
  /** Date.now() and performance.now() are allowed; any other Date, Intl or toLocale use is a problem. */
  const tzProblems = (name: string, text: string) => [...text.replace(/\bDate\.now\(\)|\bperformance\.now\(\)/g, '').matchAll(/\bDate\b|\bIntl\b|\btoLocale\w*/g)].map(m => `${name}: ${m[0]} at ${m.index}`);
  const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap(e => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
  it('src/slices/howto/** and src/howto/** have none', () => {
    const files = [...walk(join(ROOT, 'src/slices/howto')), ...walk(join(ROOT, 'src/howto'))].filter(f => /\.(ts|tsx|js|mjs)$/.test(f));
    expect(files.length).toBeGreaterThan(30);
    expect(files.flatMap(f => tzProblems(f.slice(ROOT.length + 1), readFileSync(f, 'utf8')))).toEqual([]);
  });
  it('the built HowToSheet-, ht-, hand-, handpair-, feel-, posture-, zoom- and loaders- chunks have none', async () => {
    const out = mkdtempSync(join(tmpdir(), 'lib4c-www-')); tmps.push(out);
    const b = await run(ROOT, ['node_modules/vite/bin/vite.js', 'build', '--outDir', out, '--emptyOutDir', '--logLevel', 'error']);
    expect(b.code, b.out).toBe(0);
    const chunks = readdirSync(join(out, 'assets')).filter(n => /^(HowToSheet|ht|hand|handpair|feel|posture|zoom|loaders)-.+\.js$/.test(n));
    expect(chunks.filter(n => n.startsWith('HowToSheet-')).length).toBe(1);
    expect(chunks.filter(n => n.startsWith('ht-')).length).toBe(8);
    expect(chunks.flatMap(n => tzProblems(n, readFileSync(join(out, 'assets', n), 'utf8')))).toEqual([]);
  });
  it('the scan bites: a fixture file with new Date() and a chunk with toLocaleString are red; Date.now() is allowed', () => {
    expect(tzProblems('fixture.ts', 'const d = new Date();')).toHaveLength(1);
    expect(tzProblems('ht-x.js', 'a.toLocaleString("en")')).toHaveLength(1);
    expect(tzProblems('ok.ts', 'const t = Date.now(); const p = performance.now();')).toEqual([]);
  });
});

describe('C9: L1 rebuilds every pinned page: committed == rebuilt == pin (LIB-2b fixture tree)', { timeout: 900_000 }, () => {
  let F: any, tree: string;
  beforeAll(async () => {
    F = await import(/* @vite-ignore */ new URL('./fixtures/lib2b/fixture.mjs', import.meta.url).href);
    tree = F.fixtureTree(); tmps.push(tree);
    cpSync(join(ROOT, 'scripts'), join(tree, 'scripts'), { recursive: true });
  }, 600_000);
  const L1 = async () => {
    const r = await run(tree, ['--input-type=module', '-e', "import { rebuildAll } from './scripts/howto-rebuild.mjs'; import { mkdtempSync } from 'node:fs'; import { tmpdir } from 'node:os'; import { join } from 'node:path'; const r = await rebuildAll({ out: mkdtempSync(join(tmpdir(), 'l1-')) }); console.log('@@' + JSON.stringify(r));"]);
    const line = r.out.split('\n').find(l => l.startsWith('@@'));
    if (!line) throw new Error(r.out);
    return JSON.parse(line.slice(2)) as { rows: any[]; pageShas: Record<string, string> };
  };
  const byKind = (r: any, kind: string) => r.rows.find((x: any) => x.state === `L1/${kind}@*`);
  const hasBuilder = () => existsSync(join(tree, 'tools/plates/library/build-layers-page.mjs'));
  const edit = (p: string, f: (s: string) => string) => { const a = join(tree, p), s = readFileSync(a, 'utf8'); writeFileSync(a, f(s)); return () => writeFileSync(a, s); };
  it('every pinned page rebuilds to its pin on parallel processes; a layers page with no builder at this sha is red', async () => {
    const r = await L1();
    expect(r.rows.map((x: any) => x.id).sort()).toEqual(['tests/howto/golden/library/zz-lib2b.json#layers-page', 'tests/howto/golden/library/zz-lib2b.json#page']);
    expect(byKind(r, 'page')).toMatchObject({ result: 'pass' });
    if (hasBuilder()) expect(byKind(r, 'layers-page')).toMatchObject({ result: 'pass' });
    else expect(byKind(r, 'layers-page').why.join(' ')).toMatch(/build-layers-page\.mjs \(LIB-6\) is not at this sha/);
  });
  it('one byte in a page source, a changed pin, an unknown kind and one byte in a committed layers page are red', async () => {
    let undo = edit(F.SPEC, s => s.replace("name: 'Pull-up'", "name: 'Pull-up x'"));
    try { expect(byKind(await L1(), 'page')).toMatchObject({ result: 'fail' }); } finally { undo(); }
    undo = edit(F.BATCH_GOLDEN, s => s.replace(/"pageSha256": "([0-9a-f])/, (_m, c) => `"pageSha256": "${c === '0' ? '1' : '0'}`));
    try { expect(byKind(await L1(), 'page').why.join(' ')).toMatch(/!= pinned/); } finally { undo(); }
    undo = edit(F.BATCH_GOLDEN, s => s.replace('"kind": "page"', '"kind": "poster-page"'));
    try { expect((await L1()).rows.find((x: any) => x.state === 'L1/unknown-kind@*')).toMatchObject({ result: 'fail' }); } finally { undo(); }
    undo = edit(F.PAGES.layers, s => s.replace('</', ' </'));
    try { expect(byKind(await L1(), 'layers-page').why.join(' ')).toMatch(hasBuilder() ? /rebuilt != committed/ : /is not at this sha/); } finally { undo(); }
  });
});

describe('Do 5, 7, 8: the shard inputs, times.json and compare.mjs', () => {
  it('howto-shard re-checks the plan hash at this sha\'s times.json, K and the page shas', () => {
    const times = readTimes(ROOT), plan = { ids: ['a'], ...libraryPlan({ ids: ['a'], times }) }, rebuild = { meta: { pageShas: { p: 'x' } } };
    expect(inputProblems({ plan, rebuild, job: { k: 0, N: plan.K }, times, pages: { p: 'x' } }).problems).toEqual([]);
    expect(inputProblems({ plan, rebuild, job: { k: 0, N: plan.K }, times: { ...times, default: times.default + 1 }, pages: { p: 'x' } }).problems.join()).toMatch(/plan hash/);
    expect(inputProblems({ plan, rebuild, job: { k: 0, N: plan.K + 1 }, times, pages: { p: 'x' } }).problems.join()).toMatch(/but the plan has K/);
    expect(inputProblems({ plan, rebuild, job: { k: 0, N: plan.K }, times, pages: { p: 'y' } }).problems.join()).toMatch(/page p/);
  });
  it('the library www hash is GATE-SPLIT\'s, byte for byte, including the sw.js stamp rule', () => {
    const d = mkdtempSync(join(tmpdir(), 'lib4c-www-')); tmps.push(d);
    put(d, 'index.html', '<p>x</p>'); put(d, 'sw.js', "const C = 'marc-20261017190538';"); put(d, 'assets/a.js', 'a');
    expect(libWwwHash(d)).toBe(gateWwwHash(d));
    put(d, 'assets/a.js', 'b');
    expect(libWwwHash(d)).toBe(gateWwwHash(d));
  });
  it('times.json has the seeded shape, and the refresh takes each id\'s largest seconds and the once-states', () => {
    const t = readTimes(ROOT);
    expect(Object.keys(t).sort()).toEqual(['c0', 'default', 'ids', 'once']);
    expect(t.default).toBe(280.8);
    const m = (k: number, seconds: any, once: number) => ({ meta: { job: { k }, seconds, onceSeconds: once } });
    const next = refreshLibraryTimes(t, [m(1, { a: 200 }, 70), m(2, { b: 250, a: 210 }, 12), m(1, { a: 190 }, 75)]);
    expect(next.ids).toEqual({ a: 210, b: 250 });
    expect(next.once).toEqual({ run: 63, shard: 12 });
    expect([next.default, next.c0]).toEqual([t.default, t.c0]);
  });
  it('compare.mjs: identical runs pass; a dropped row, a flipped result or a changed px is the first difference', () => {
    const run1 = [{ sha: SHA, rows: [{ id: 'a', theme: 't', state: 'L3/N@390', result: 'pass' }, { id: 'a', theme: 't', state: 'L3/M@390', result: 'pass' }], meta: { px: { 'a|t|L3/N@390': 0 } } }];
    expect(firstDifference([run1, clone(run1), clone(run1)])).toBeNull();
    const drop = clone(run1); drop[0].rows.pop();
    expect(firstDifference([run1, drop])).toMatch(/rows/);
    const flip = clone(run1); flip[0].rows[1].result = 'fail';
    expect(firstDifference([run1, flip])).toMatch(/is fail, was pass/);
    const px = clone(run1); px[0].meta.px['a|t|L3/N@390'] = 1;
    expect(firstDifference([run1, px])).toMatch(/px a\|t\|L3\/N@390 is 1, was 0/);
    expect(firstDifference([run1])).toMatch(/at least two/);
  });
  it('collectLibrary finds the rebuild proof and the shard proofs, dropping byte-identical copies', () => {
    const d = mkdtempSync(join(tmpdir(), 'lib4c-proofs-')); tmps.push(d);
    put(d, 'MARC-howto-rebuild-proof/howto-rebuild-proof.json', '{"sha":"x","rows":[]}');
    put(d, 'MARC-howto-proof-1/howto-proof-1of2.json', '{"sha":"x","rows":[],"meta":{"job":{"k":1}}}');
    put(d, 'MARC-howto-proof-2/howto-proof-2of2.json', '{"sha":"x","rows":[],"meta":{"job":{"k":2}}}');
    put(d, 'copy/howto-proof-2of2.json', '{"sha":"x","rows":[],"meta":{"job":{"k":2}}}');
    put(d, 'howto-evidence-1/shard-1of2.json', '{}');
    const c = collectLibrary(d);
    expect([c.rebuild.length, c.shards.length]).toEqual([1, 2]);
  });
  it('the pinned-page list is empty on this tree and sha256 is the pin hash', () => {
    expect(pinnedPages(ROOT)).toEqual({ pages: [], unknown: [] });
    expect(sha256('')).toHaveLength(64);
  });
});

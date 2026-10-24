// LIB-4c C0 (card LIB-4c Do 8b; D-LIB4c-1 (b), plan 3.5-3.6 L0-lib): tools/plates/library/MANIFEST.json lists exactly
// the recomputed file set of every pinned library row, each file with its sha256 and the approving plate entry's hash.
// 0 rows on this tree; 1 row on LIB-2b's fixtureTree (stageTree + pinTree), where each mutation must turn it red.
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs build tool, no types
import { MANIFEST, manifestOf, manifestProblems } from '../../tools/plates/library/ci/manifest.mjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = join(__dirname, '..', '..');
const tmps: string[] = [];
afterAll(() => { for (const d of tmps) rmSync(d, { recursive: true, force: true }); });
const run = (cwd: string, code: string) => new Promise<{ code: number; out: string }>(resolve => {
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_ENV' && !k.startsWith('VITEST') && k !== 'TEST'));
  const c = spawn(process.execPath, ['--input-type=module', '-e', code], { cwd, env });
  let out = '';
  c.stdout.on('data', d => { out += d; }); c.stderr.on('data', d => { out += d; });
  c.on('close', c2 => resolve({ code: c2 ?? 1, out }));
});
const at = async (cwd: string, code: string) => {
  const r = await run(cwd, `${code}`);
  const line = r.out.split('\n').find(l => l.startsWith('@@'));
  if (!line) throw new Error(r.out);
  return JSON.parse(line.slice(2));
};
const problemsIn = (tree: string) => at(tree, "import { manifestProblems } from './tools/plates/library/ci/manifest.mjs'; console.log('@@' + JSON.stringify(await manifestProblems()));");

describe('C0: L0-lib on this tree', () => {
  // LIB-8M Do 13 (A14): pilot A's pin adds the first rows, exactly its 13 ids (was 0 before the pin)
  const PILOT_A = ['barbell_overhead_press', 'barbell_row', 'dumbbell_bench_press', 'dumbbell_biceps_curl', 'dumbbell_shoulder_press', 'mountain_climbers',
    'pec_fly', 'plank', 'romanian_deadlift', 'rope_triceps_pushdown', 'single_leg_romanian_deadlift', 'triceps_pushdown', 'upright_row'].map(id => `lib_${id}`);
  it('MANIFEST.json lists exactly the pinned rows: pilot A\'s 13 here, and no problem', async () => {
    const file = JSON.parse(readFileSync(join(ROOT, MANIFEST), 'utf8'));
    expect(Object.keys(file.rows)).toEqual(PILOT_A);
    expect(await manifestOf(ROOT)).toEqual(file);
    expect(await manifestProblems(ROOT)).toEqual([]);
  });
});

describe('C0: L0-lib on LIB-2b\'s fixtureTree (one pinned row)', { timeout: 300_000 }, () => {
  let F: any, tree: string, M: any;
  beforeAll(async () => {
    F = await import(/* @vite-ignore */ new URL('./fixtures/lib2b/fixture.mjs', import.meta.url).href);
    tree = F.fixtureTree(); tmps.push(tree);
    M = await at(tree, "import { manifestOf, manifestText, MANIFEST } from './tools/plates/library/ci/manifest.mjs'; import { writeFileSync } from 'node:fs'; const m = await manifestOf(); writeFileSync(MANIFEST, manifestText(m)); console.log('@@' + JSON.stringify(m));");
  }, 300_000);
  /** Applies `edit` to `p` in the tree, returns the problems, restores the file. */
  const mutated = async (p: string, edit: (s: string) => string) => {
    const f = join(tree, p), s = readFileSync(f, 'utf8');
    writeFileSync(f, edit(s));
    try { return await problemsIn(tree); } finally { writeFileSync(f, s); }
  };
  it('exactly one row, the clone, with its approving entry hash; the set has every part', async () => {
    expect(Object.keys(M.rows)).toEqual([F.ID]);
    const files = Object.keys(M.rows[F.ID].files);
    expect(M.rows[F.ID].entry).toMatch(/^[0-9a-f]{64}$/);
    for (const p of [F.SPEC, F.HOWTO, 'tools/plates/layers/MANIFEST.json', 'tools/plates/library/build-page.mjs', 'tools/plates/library/plates-page.mjs', 'tools/plates/golden.mjs',
      'tools/plates/vendor/MANIFEST.json', F.PAGES.plates, F.PAGES.layersConfig, F.BATCH, 'tools/plates/pins.json', 'tools/plates/plates.json', 'tools/plates/library/hands/pairs.mjs', F.PAGES.layers]) expect(files).toContain(p);
    expect(await problemsIn(tree)).toEqual([]);
  });
  it('mutations, each red: a spec byte, a page-builder byte, a batch page JSON byte, a locked MANIFEST hash', async () => {
    expect((await mutated(F.SPEC, s => `${s}// x\n`)).join('\n')).toMatch(new RegExp(`${F.SPEC} sha256`));
    expect((await mutated('tools/plates/library/build-page.mjs', s => `${s}// x\n`)).join('\n')).toMatch(/build-page\.mjs sha256/);
    expect((await mutated(F.PAGES.plates, s => `${s} `)).join('\n')).toMatch(/pages\/zz-lib2b\.json sha256/);
    expect((await mutated('tools/plates/vendor/MANIFEST.json', s => s.replace(/("sha256": ")([0-9a-f])/, (_m, a, c) => `${a}${c === '0' ? '1' : '0'}`))).join('\n')).toMatch(/vendor\/MANIFEST\.json sha256/);
  });
  it('mutations, each red: a run-time read left out, an unlisted closure file, a wrong golden hash', async () => {
    const drop = await mutated(MANIFEST, s => { const m = JSON.parse(s); delete m.rows[F.ID].files[F.PAGES.layersConfig]; return `${JSON.stringify(m, null, 1)}\n`; });
    expect(drop.join('\n')).toMatch(/zz-lib2b\.layers\.json is an input, not listed/);
    mkdirSync(dirname(join(tree, 'tools/plates/library/composers/c0.mjs')), { recursive: true });
    writeFileSync(join(tree, 'tools/plates/library/composers/c0.mjs'), 'export const C0 = 1;\n');
    const unlisted = await mutated(F.SPEC, s => `import { C0 } from '../composers/c0.mjs';\n${s}`);
    expect(unlisted.join('\n')).toMatch(/composers\/c0\.mjs is an input, not listed/);
    const wrong = await mutated(MANIFEST, s => { const m = JSON.parse(s); m.rows[F.ID].entry = '0'.repeat(64); return `${JSON.stringify(m, null, 1)}\n`; });
    expect(wrong.join('\n')).toMatch(/approving entry hash 0{64}/);
    const extra = await mutated(MANIFEST, s => { const m = JSON.parse(s); m.rows.lib_ghost = m.rows[F.ID]; return `${JSON.stringify(m, null, 1)}\n`; });
    expect(extra.join('\n')).toMatch(/lib_ghost: in .*MANIFEST\.json, but no plate entry pins it/);
  });
});

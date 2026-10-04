// GATE-SPLIT (docs/qa/GATE-SPLIT-DESIGN.md 4.2, 4.3 E5, E6, E8, E9): the gate-verdict job and the arrangement compare.
// Fixture proofs are built from the real gate file and plan; each case is one mutation that must turn the verdict red.
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';

type Row = { id: string; check: string; state: string; theme: string; width: number | null; result: string };
type Manifest = { sha: string; shard: { k: number; N: number } | null; rows: Row[]; meta: Record<string, any> };
type Tuple = { id: string; theme: string; state: string };
let V: {
  GATE_TZS: string[]; JOB_BUDGET_S: number;
  verdict: (o: Record<string, unknown>) => { problems: string[]; notes: string[] };
};
let C: { compareRuns: (a: Manifest[], b: Manifest[]) => string[]; compareSeeded: (a: Manifest[], b: Manifest[], k: string) => string[] };
let G: { planFor: (keys: string[], times: unknown, K: number, tz: string) => string[][]; planHash: (keys: string[], times: unknown, tz: string) => string };
let B: { GATE_FILE: string; ALWAYS: Set<string>; parseGate: (s: string) => { groups: { key: string }[] } };
let SRC = '', KEYS: string[] = [], TIMES: any;
const SHA = 'c'.repeat(40);
beforeAll(async () => {
  V = await import(/* @vite-ignore */ new URL('../scripts/ci-verdict.mjs', import.meta.url).href);
  C = await import(/* @vite-ignore */ new URL('../scripts/gate-compare.mjs', import.meta.url).href);
  G = await import(/* @vite-ignore */ new URL('../scripts/gate-split.mjs', import.meta.url).href);
  B = await import(/* @vite-ignore */ new URL('../scripts/gate-blocks.mjs', import.meta.url).href);
  SRC = readFileSync(B.GATE_FILE, 'utf8');
  KEYS = B.parseGate(SRC).groups.map(g => g.key);
  TIMES = JSON.parse(readFileSync(new URL('../scripts/gate-times.json', import.meta.url), 'utf8'));
});

/** Proofs as the gate jobs write them: K jobs per time zone, every planned group passing, one theme row for BASE. */
const proofs = (K: number): Manifest[] => (V.GATE_TZS).flatMap(tz => {
  const plan = K === 1 ? [KEYS.filter(k => !B.ALWAYS.has(k))] : G.planFor(KEYS, TIMES, K, tz);
  return plan.map((ids, j) => {
    const run = KEYS.filter(k => ids.includes(k) || B.ALWAYS.has(k));
    const rows: Row[] = run.map(id => ({ id, check: 'gate', state: tz, theme: '*', width: null, result: 'pass' }));
    if (run.includes('BASE')) rows.push({ id: 'BASE', check: 'gate-theme', state: tz, theme: 'paper', width: null, result: 'pass' });
    return {
      sha: SHA, shard: K > 1 ? { k: j, N: K } : null, rows,
      meta: { job: { k: j + 1, K }, tz, www: 'w1', chrome: '153', plan: G.planHash(KEYS, TIMES, tz), groups: KEYS.length, gateSeconds: 600, errors: [], files: Object.fromEntries(run.map(id => [id, id === 'BASE' ? ['paper-today.png'] : []])), constructionOnly: [] },
    };
  });
});
const HT: Tuple[] = ['a', 'b', 'c', 'd'].flatMap(id => ['paper', 'midnight'].map(theme => ({ id, theme, state: 'sweep' })));
const ht10 = (N = 2) => V.GATE_TZS.flatMap(tz => Array.from({ length: N }, (_, k) => ({
  tz, manifest: { sha: SHA, shard: { k, N }, rows: HT.filter((_, i) => i % N === k).map(t => ({ ...t, check: 'C10', width: 390, result: 'pass' })) },
})));
const run = (over: Record<string, unknown> = {}) => V.verdict({ gate: proofs(TIMES.K), ht10: ht10(), ht10Tuples: HT, gateSrc: SRC, times: TIMES, sha: SHA, event: 'push', arrangement: 'split', needs: { 'source-gate': { result: 'success' } }, ...over });
const red = (over: Record<string, unknown>, re: RegExp) => { const { problems } = run(over); expect(problems.join('\n')).toMatch(re); };

describe('E5: gate-verdict', () => {
  it('a complete, green split run passes', () => {
    expect(run().problems).toEqual([]);
  });
  it('the serial arrangement passes only on workflow_dispatch', () => {
    expect(run({ gate: proofs(1), event: 'workflow_dispatch', arrangement: 'serial', needs: { 'gate-shard': { result: 'skipped' } } }).problems).toEqual([]);
    red({ needs: { 'gate-shard': { result: 'skipped' } } }, /needed job gate-shard ended skipped/);
    red({ gate: proofs(1), event: 'push', arrangement: 'split' }, /expected gate proofs for jobs 1\.\.3 of 3/);
    red({ gate: proofs(1), event: 'push', arrangement: 'serial' }, /serial arrangement is allowed only on workflow_dispatch/);
  });
  it('mutation: a wrong sha is red', () => {
    const g = proofs(TIMES.K); g[1]!.sha = 'd'.repeat(40);
    red({ gate: g }, /ran on d{40}, not c{40}/);
  });
  it('mutation: a missing manifest is red', () => red({ gate: proofs(TIMES.K).slice(1) }, /expected gate proofs for jobs 1\.\.3 of 3|proven 0 times/));
  it('mutation: a duplicated manifest is red', () => { const g = proofs(TIMES.K); red({ gate: [...g, g[0]] }, /proven 2 times/); });
  it('mutation: a dropped row is red (E6)', () => {
    const g = proofs(TIMES.K); const i = g[2]!.rows.findIndex(r => r.check === 'gate' && !B.ALWAYS.has(r.id));
    const id = g[2]!.rows[i]!.id; g[2]!.rows.splice(i, 1);
    red({ gate: g }, new RegExp(`${id.replace(/\./g, '\\.')}\\|\\*\\|.*proven 0 times`));
  });
  it('mutation: an extra row and a miscount are red', () => {
    const g = proofs(TIMES.K); g[0]!.rows.push({ id: 'NOT-A-BLOCK', check: 'gate', state: 'UTC', theme: '*', width: null, result: 'pass' });
    red({ gate: g }, /NOT-A-BLOCK\|\*\|UTC proven but not expected/);
    red({ gate: g }, /group rows, expected/);
  });
  it('mutation: an ALWAYS group missing from one job is red', () => {
    const g = proofs(TIMES.K); g[3]!.rows = g[3]!.rows.filter(r => r.id !== 'HT-10.clock');
    red({ gate: g }, /ALWAYS group HT-10\.clock proven 0 times/);
  });
  it('mutation: a job running another plan is red', () => {
    const g = proofs(TIMES.K); g[0]!.meta.plan = 'x';
    red({ gate: g }, /packed a different plan/);
  });
  it('mutation: mixed www or chrome is red', () => {
    const g = proofs(TIMES.K); g[4]!.meta.www = 'w2'; g[5]!.meta.chrome = '141';
    red({ gate: g }, /differ in meta\.www/); red({ gate: g }, /differ in meta\.chrome/);
  });
  it('mutation: a fail row is red', () => {
    const g = proofs(TIMES.K); g[1]!.rows[0]!.result = 'fail';
    red({ gate: g }, /: fail/);
  });
  it('mutation: a needed job that did not succeed is red', () => red({ needs: { 'gate-shard': { result: 'failure' } } }, /needed job gate-shard ended failure/));
  it('mutation: Auckland missing is red', () => red({ gate: proofs(TIMES.K).filter(m => m.meta.tz === 'UTC') }, /Pacific\/Auckland: expected gate proofs/));
  it('mutation: a gate step over 1,800 s is red; over 900 s is a note', () => {
    const g = proofs(TIMES.K); g[0]!.meta.gateSeconds = V.JOB_BUDGET_S + 1;
    red({ gate: g }, /over the 1800 s budget/);
    const h = proofs(TIMES.K); h[0]!.meta.gateSeconds = 901;
    const r = run({ gate: h });
    expect(r.problems).toEqual([]); expect(r.notes.join()).toMatch(/re-pick K/);
  });
  it('mutation: a theme seen in two jobs, or only in one time zone, is red', () => {
    const g = proofs(TIMES.K); const other = g.find(m => m.meta.tz === 'UTC' && !m.rows.some(r => r.id === 'BASE'))!;
    other.rows.push({ id: 'BASE', check: 'gate-theme', state: 'UTC', theme: 'paper', width: null, result: 'pass' });
    red({ gate: g }, /gate-theme BASE\|paper\|UTC proven 2 times/);
    const h = proofs(TIMES.K); for (const m of h) m.rows = m.rows.filter(r => !(r.check === 'gate-theme' && r.state === 'UTC'));
    red({ gate: h }, /BASE: themes seen in UTC \[\] differ/);
  });
  it('ht10: every tuple once per time zone; a dropped ht10 row, a missing shard or a wrong sha is red', () => {
    const h = ht10(); h[0]!.manifest.rows.pop();
    red({ ht10: h }, /ht10 UTC: .*proven 0 times/);
    red({ ht10: ht10().slice(1) }, /ht10 UTC: expected shards 1\.\.N once each/);
    const s = ht10(); s[3]!.manifest.sha = 'e'.repeat(40);
    red({ ht10: s }, /ht10 Pacific\/Auckland shard 2: ran on e{40}/);
  });
});

describe('E8/E9: gate-compare', () => {
  it('E8: identical serial and split runs compare equal', () => {
    expect(C.compareRuns(proofs(1), proofs(TIMES.K))).toEqual([]);
  });
  it('E8 mutations: a dropped screenshot, a flipped result, an extra error, a missing theme row are each red', () => {
    const b1 = proofs(TIMES.K); const m = b1.find(x => x.meta.files.BASE)!; m.meta.files.BASE = [];
    expect(C.compareRuns(proofs(1), b1).join()).toMatch(/screenshot BASE\|paper-today\.png: in A, missing in B/);
    const b2 = proofs(TIMES.K); b2[1]!.rows[0]!.result = 'fail';
    expect(C.compareRuns(proofs(1), b2).join()).toMatch(/pass in A, fail in B/);
    const b3 = proofs(TIMES.K); b3[2]!.meta.errors = ['X: something'];
    expect(C.compareRuns(proofs(1), b3).join()).toMatch(/error lists differ/);
    const a4 = proofs(1); a4[0]!.rows = a4[0]!.rows.filter(r => r.check !== 'gate-theme');
    expect(C.compareRuns(a4, proofs(TIMES.K)).join()).toMatch(/theme BASE\|paper: in B, missing in A/);
  });
  const seed = (ms: Manifest[], key: string) => { for (const m of ms) for (const r of m.rows) if (r.id === key && r.check === 'gate') { r.result = 'fail'; m.meta.errors = [`${key}: seeded`]; } return ms; };
  it('E9: the seeded group red in both arrangements, only in its own job in B', () => {
    expect(C.compareSeeded(seed(proofs(1), 'F8'), seed(proofs(TIMES.K), 'F8'), 'F8')).toEqual([]);
  });
  it('E9 mutations: a seed that does not bite, or a second job red, is red', () => {
    expect(C.compareSeeded(proofs(1), seed(proofs(TIMES.K), 'F8'), 'F8').join()).toMatch(/seed did not bite/);
    const b = seed(proofs(TIMES.K), 'F8'); const other = b.find(m => m.meta.tz === 'UTC' && !m.rows.some(r => r.id === 'F8'))!;
    other.rows[0]!.result = 'fail';
    expect(C.compareSeeded(seed(proofs(1), 'F8'), b, 'F8').join()).toMatch(/expected pass/);
  });
});

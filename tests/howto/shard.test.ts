// HT-10 (HT10-A5): htShard and writeProof (tools/plates/fidelity/shard.mjs). Every tuple lands in exactly one shard
// for N = 1..16, unset runs everything, and the proof manifest refuses incomplete rows.
import { describe, it, expect, beforeAll } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

type Tuple = { id: string; theme: string; state: string };
let S: {
  htShard: (k?: number, N?: number) => (t: Tuple[]) => Tuple[];
  shardFromEnv: (env: Record<string, string | undefined>) => { k?: number; N?: number };
  ht10Runs: (env: Record<string, string | undefined>) => boolean;
  coverProblems: (manifests: { sha: string; rows: Tuple[] }[], tuples: Tuple[]) => string[];
  writeProof: (file: string, m: { sha: string; shard?: { k?: number; N?: number }; rows: unknown[] }) => { rows: Record<string, unknown>[] };
};
beforeAll(async () => {
  S = await import(/* @vite-ignore */ new URL('../../tools/plates/fidelity/shard.mjs', import.meta.url).href);
});

const IDS = ['lib_barbell_back_squat', 'lib_dumbbell_lateral_raise', 'lib_pull_up', 'lib_leg_press', 'lib_lat_pulldown'];
const THEMES = ['silent-black', 'paper', 'midnight', 'ember', 'emerald'];
const STATES = ['sweep', 'reduced', 'a2'];
// deliberately unsorted input, so the helper's own sort is what decides
const TUPLES: Tuple[] = STATES.flatMap(state => THEMES.flatMap(theme => [...IDS].reverse().map(id => ({ id, theme, state }))));
const key = (t: Tuple) => `${t.id}|${t.theme}|${t.state}`;

describe('htShard', () => {
  it('unset runs every tuple', () => {
    expect(S.htShard()(TUPLES).map(key).sort()).toEqual(TUPLES.map(key).sort());
  });
  it('every tuple lands in exactly one shard for N = 1..16', () => {
    for (let N = 1; N <= 16; N++) {
      const seen = new Map<string, number>();
      for (let k = 0; k < N; k++) for (const t of S.htShard(k, N)(TUPLES)) seen.set(key(t), (seen.get(key(t)) ?? 0) + 1);
      expect(seen.size, `N=${N}`).toBe(TUPLES.length);
      expect([...seen.values()].every(c => c === 1), `N=${N}`).toBe(true);
    }
  });
  it('is independent of input order and balanced to within one tuple', () => {
    const shuffled = [...TUPLES].sort(() => 0).reverse();
    for (const N of [2, 3, 7]) {
      const sizes = [];
      for (let k = 0; k < N; k++) {
        const a = S.htShard(k, N)(TUPLES).map(key), b = S.htShard(k, N)(shuffled).map(key);
        expect(a).toEqual(b);
        sizes.push(a.length);
      }
      expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1);
    }
  });
  it('refuses a half-set or invalid shard and a duplicate tuple', () => {
    expect(() => S.htShard(0)).toThrow(/N must be/);
    expect(() => S.htShard(undefined, 2)).toThrow(/k must be/);
    expect(() => S.htShard(2, 2)).toThrow(/k must be/);
    expect(() => S.htShard(0, 0)).toThrow(/N must be/);
    expect(() => S.htShard(0.5, 2)).toThrow(/k must be/);
    expect(() => S.htShard()([...TUPLES, TUPLES[0]!])).toThrow(/duplicate/);
    expect(() => S.htShard()([{ id: 'x', theme: '', state: 's' }])).toThrow(/no theme/);
  });
  it('reads MARC_HT_SHARD 1-based, as the CI matrix names its jobs', () => {
    expect(S.shardFromEnv({})).toEqual({});
    expect(S.shardFromEnv({ MARC_HT_SHARD: '' })).toEqual({});
    expect(S.shardFromEnv({ MARC_HT_SHARD: '1/2' })).toEqual({ k: 0, N: 2 });
    expect(S.shardFromEnv({ MARC_HT_SHARD: '2/2' })).toEqual({ k: 1, N: 2 });
    expect(() => S.shardFromEnv({ MARC_HT_SHARD: '0/2' })).toThrow(/1 <= k <= N/);
    expect(() => S.shardFromEnv({ MARC_HT_SHARD: '3/2' })).toThrow(/1 <= k <= N/);
    expect(() => S.shardFromEnv({ MARC_HT_SHARD: 'all' })).toThrow(/k\/N/);
  });
  it('runs gate block HT-10 unless MARC_HT10_OWN_JOB=1 is set without a shard (D-HT10-A5)', () => {
    expect(S.ht10Runs({})).toBe(true);
    expect(S.ht10Runs({ MARC_HT_SHARD: '1/2' })).toBe(true);
    expect(S.ht10Runs({ MARC_HT10_OWN_JOB: '1', MARC_HT_SHARD: '2/2' })).toBe(true);
    expect(S.ht10Runs({ MARC_HT10_OWN_JOB: '1' })).toBe(false);
    expect(S.ht10Runs({ MARC_HT10_OWN_JOB: '0' })).toBe(true);
  });
});

describe('writeProof', () => {
  const row = { id: 'lib_pull_up', check: 'C10', state: 'sweep', theme: 'paper', width: 390, result: 'pass' };
  it('writes sorted rows, each carrying the sha', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ht10-proof-'));
    try {
      const file = join(dir, 'nested', 'proof.json');
      S.writeProof(file, { sha: 'abc1234', shard: { k: 1, N: 2 }, rows: [{ ...row, theme: 'silent-black' }, row, { ...row, check: 'C12', width: null }] });
      const m = JSON.parse(readFileSync(file, 'utf8'));
      expect(m.shard).toEqual({ k: 1, N: 2 });
      expect(m.rows.map((r: Tuple & { check: string }) => `${r.check}/${r.theme}`)).toEqual(['C10/paper', 'C10/silent-black', 'C12/paper']);
      expect(m.rows.every((r: { sha: string }) => r.sha === 'abc1234')).toBe(true);
      expect(Object.keys(m.rows[0])).toEqual(['sha', 'id', 'check', 'state', 'theme', 'width', 'result']);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
  it('refuses an incomplete or duplicate row and writes nothing', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ht10-proof-'));
    try {
      const file = join(dir, 'proof.json');
      const { check: _c, ...noCheck } = row;
      expect(() => S.writeProof(file, { sha: 'abc1234', rows: [noCheck] })).toThrow(/no check/);
      expect(() => S.writeProof(file, { sha: 'abc1234', rows: [{ ...row, result: 'skipped' }] })).toThrow(/pass or fail/);
      expect(() => S.writeProof(file, { sha: 'abc1234', rows: [{ ...row, width: 0 }] })).toThrow(/width/);
      expect(() => S.writeProof(file, { sha: 'abc1234', rows: [row, { ...row }] })).toThrow(/duplicate/);
      expect(() => S.writeProof(file, { sha: 'HEAD', rows: [row] })).toThrow(/git sha/);
      expect(existsSync(file)).toBe(false);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});

describe('D-HT10-A5: the ht10-gate matrix 1/2 + 2/2', () => {
  it('proves, through writeProof manifests, every HT-10 tuple exactly once; a dropped row fails the verdict', async () => {
    const H = await import(/* @vite-ignore */ new URL('../../tools/plates/fidelity/harness.mjs', import.meta.url).href) as { ht10AllTuples: () => Promise<Tuple[]> };
    const all = await H.ht10AllTuples();
    expect(all.length).toBe(8 * 5 * 3 + 5);
    const dir = mkdtempSync(join(tmpdir(), 'ht10-matrix-'));
    try {
      const manifests = ['1/2', '2/2'].map(v => {
        const sh = S.shardFromEnv({ MARC_HT_SHARD: v }) as { k: number; N: number };
        const rows = S.htShard(sh.k, sh.N)(all).map(t => ({ ...t, check: t.state, width: 390, result: 'pass' }));
        expect(rows.length).toBeGreaterThan(0);
        S.writeProof(join(dir, `proof-${sh.k}.json`), { sha: 'abc1234', shard: sh, rows });
        return JSON.parse(readFileSync(join(dir, `proof-${sh.k}.json`), 'utf8'));
      });
      expect(S.coverProblems(manifests, all)).toEqual([]);
      const dropped = [{ ...manifests[0], rows: manifests[0].rows.slice(1) }, manifests[1]];
      expect(S.coverProblems(dropped, all).join()).toMatch(/proven 0 times/);
      expect(S.coverProblems([manifests[0], manifests[0], manifests[1]], all).join()).toMatch(/proven 2 times/);
      expect(S.coverProblems([manifests[0], { ...manifests[1], sha: 'def5678' }], all).join()).toMatch(/2 shas/);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});

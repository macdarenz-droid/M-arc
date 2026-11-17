// F-GEN-SPEED (D-GSP-G, D-GSP-GPROOF): lib7b.test.ts runs alone in a MARC_SOLO=1 vitest run, after the normal run, in
// every place the normal run runs. This pins that the normal, solo and perf sets partition tests/**/*.test.ts (every
// file in exactly one set), that the solo set is exactly lib7b.test.ts, and that every script or workflow step that
// runs the normal set also runs the solo set under the same TZ.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { SOLO_TESTS, testSets } from '../vite.config';

type Sets = { include: string[]; exclude: string[] };
const glob = (g: string) => new RegExp(`^${g.split(/(\*\*\/|\*\*|\*)/).map(t => (t === '**/' ? '(?:.*/)?' : t === '**' ? '.*' : t === '*' ? '[^/]*' : t.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))).join('')}$`);
const inSet = (f: string, s: Sets) => s.include.some(g => glob(g).test(f)) && !s.exclude.some(g => glob(g).test(f));
const walk = (d: string): string[] => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const FILES = walk('tests').map(p => p.split('\\').join('/')).filter(f => f.endsWith('.test.ts')).sort();
const SETS = (sets: Record<string, Sets>) => FILES.map(f => [f, Object.keys(sets).filter(k => inSet(f, sets[k]!))] as const);
const REAL = { normal: testSets({}), solo: testSets({ MARC_SOLO: '1' }), perf: testSets({ MARC_PERF: '1' }) };

/** Each `vitest run` in a command line, with its TZ and run kind (normal, solo or perf). */
function runsOf(cmd: string): { tz: string; kind: string }[] {
  return cmd.split('&&').map(s => s.trim()).filter(s => /\bvitest run\b/.test(s)).map(s => ({
    tz: s.match(/\bTZ=(\S+)/)?.[1] ?? '',
    kind: /\bMARC_PERF=1\b/.test(s) ? 'perf' : /\bMARC_SOLO=1\b/.test(s) ? 'solo' : 'normal',
  }));
}
/** A command line's problems: a normal run without a solo run under the same TZ. */
function missingSolo(cmd: string, tz = ''): string[] {
  const runs = runsOf(cmd).map(r => ({ ...r, tz: r.tz || tz }));
  return runs.filter(r => r.kind === 'normal' && !runs.some(s => s.kind === 'solo' && s.tz === r.tz)).map(r => `normal run (TZ=${r.tz || 'unset'}) has no solo run`);
}
const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> };
const WORKFLOWS = readdirSync('.github/workflows').filter(f => /\.ya?ml$/.test(f)).map(f => [f, readFileSync(join('.github/workflows', f), 'utf8')] as const);
/** Every workflow `run:` line that calls vitest, with the TZ of its step (a matrix TZ counts as its own value). */
function workflowRuns(files: readonly (readonly [string, string])[]): { where: string; cmd: string; tz: string }[] {
  const out: { where: string; cmd: string; tz: string }[] = [];
  for (const [f, text] of files) {
    for (const step of text.split(/\n(?=\s*- )/)) {
      const run = step.match(/^\s*-?\s*run: (.*)$/m)?.[1];
      if (!run || !/\bvitest run\b/.test(run)) continue;
      out.push({ where: `${f}: ${run}`, cmd: run.replace(/\s+#.*$/, ''), tz: step.match(/^\s+TZ: (.+)$/m)?.[1]?.trim() ?? '' });
    }
  }
  return out;
}

describe('F-GEN-SPEED D-GSP-G: lib7b.test.ts runs alone (MARC_SOLO=1)', () => {
  it('the normal, solo and perf sets partition tests/**/*.test.ts: every file in exactly one set', () => {
    expect(FILES.length).toBeGreaterThan(300);
    expect(SETS(REAL).filter(([, s]) => s.length !== 1)).toEqual([]);
  });
  it('the solo set is exactly lib7b.test.ts', () => {
    expect(SOLO_TESTS).toEqual(['tests/library/lib7b.test.ts']);
    expect(FILES.filter(f => inSet(f, REAL.solo))).toEqual(['tests/library/lib7b.test.ts']);
    expect(FILES.filter(f => inSet(f, REAL.perf))).toEqual(FILES.filter(f => f.startsWith('tests/perf/')));
  });
  it('every package.json script that runs the normal set also runs the solo set under the same TZ', () => {
    const withVitest = Object.entries(pkg.scripts).filter(([, c]) => runsOf(c).some(r => r.kind === 'normal'));
    expect(withVitest.map(([k]) => k).sort()).toEqual(['test', 'test:tz']);
    expect(withVitest.flatMap(([k, c]) => missingSolo(c).map(p => `${k}: ${p}`))).toEqual([]);
    expect(runsOf(pkg.scripts['test:tz']!)).toEqual([
      { tz: 'America/New_York', kind: 'normal' }, { tz: 'America/New_York', kind: 'solo' },
      { tz: 'Asia/Manila', kind: 'normal' }, { tz: 'Asia/Manila', kind: 'solo' },
    ]);
  });
  it('every workflow step that runs the normal set also runs the solo set under the same TZ', () => {
    const steps = workflowRuns(WORKFLOWS);
    expect(steps.map(s => s.where)).toEqual(['build-apk.yml: npx vitest run && MARC_SOLO=1 npx vitest run  # F-GEN-SPEED (D-GSP-G): lib7b.test.ts runs alone, same TZ']);
    expect(steps[0]!.tz).toBe('${{ matrix.tz }}');
    expect(steps.flatMap(s => missingSolo(s.cmd, s.tz).map(p => `${s.where}: ${p}`))).toEqual([]);
  });
  it('mutation: lib7b dropped from the solo include is red (it runs in no set)', () => {
    const bad = { ...REAL, solo: { include: [], exclude: REAL.solo.exclude } };
    expect(SETS(bad).filter(([, s]) => s.length !== 1).map(([f]) => f)).toEqual(['tests/library/lib7b.test.ts']);
  });
  it('mutation: lib7b left in the normal set as well is red (it runs twice)', () => {
    const bad = { ...REAL, normal: { include: REAL.normal.include, exclude: REAL.normal.exclude.filter(g => !SOLO_TESTS.includes(g)) } };
    expect(SETS(bad).filter(([, s]) => s.length !== 1).map(([f]) => f)).toEqual(['tests/library/lib7b.test.ts']);
  });
  it('mutation: the solo run left out of one invocation is red (script, and the unit-tz step)', () => {
    expect(missingSolo(pkg.scripts['test:tz']!.replace('TZ=Asia/Manila MARC_SOLO=1 vitest run', 'true'))).toEqual(['normal run (TZ=Asia/Manila) has no solo run']);
    expect(missingSolo(pkg.scripts.test!.replace(' && MARC_SOLO=1 vitest run', ''))).toEqual(['normal run (TZ=unset) has no solo run']);
    expect(missingSolo(pkg.scripts['test:tz']!.replace('TZ=Asia/Manila MARC_SOLO=1', 'TZ=America/New_York MARC_SOLO=1'))).toEqual(['normal run (TZ=Asia/Manila) has no solo run']);
    const yml = WORKFLOWS.map(([f, t]) => [f, t.replace(' && MARC_SOLO=1 npx vitest run', '')] as const);
    const s = workflowRuns(yml);
    expect(s.flatMap(x => missingSolo(x.cmd, x.tz))).toEqual(['normal run (TZ=${{ matrix.tz }}) has no solo run']);
  });
});

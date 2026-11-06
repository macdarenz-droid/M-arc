// LIB-5 S8 (Do 6; D-LIB5-STAMPS, D-LIB5-SCRATCH): strict C15. The stamp helpers (tools/plates/library/research/
// stamps.mjs) compute exactly c15's contentHash over a row's full content and its 9 plate fragments, and an empty,
// missing or unparsable reviews.json fails every id (never c15's stub pass). Main holds no scratch marker or stamp.
import { execFileSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { checkC15, contentHash } from './checks/c15';

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const ROOT = new URL('../../', import.meta.url).pathname;
const EIGHT = Object.keys(JSON.parse(readFileSync(join(ROOT, 'tools/plates/plates.json'), 'utf8')));
let S: any, content: any, G: any;
const temps: string[] = [];
beforeAll(async () => {
  [S, content, G] = await Promise.all(['tools/plates/library/research/stamps.mjs', 'tools/plates/gen/content.mjs', 'tools/plates/golden.mjs'].map(p => import(/* @vite-ignore */ url(p))));
});
afterAll(() => { for (const t of temps) rmSync(t, { recursive: true, force: true }); });
const fragmentsOf8 = (id: string) => G.latestEntries(JSON.parse(readFileSync(G.GOLDEN_JSON, 'utf8')).entries).get(id).fragments;

describe('LIB-5 S8: the stamp hash is c15\'s contentHash over the full content and the 9 plate fragments', () => {
  it('contentHashOf equals c15 contentHash(loadContent(id).content, fragments) for each of the 8', async () => {
    for (const id of EIGHT) {
      const f = fragmentsOf8(id), { content: c } = await content.loadContent(id);
      expect(Object.keys(f)).toEqual(['normalSvg', 'normalOverlay', 'mistakeSvg', 'mistakeOverlay', 'tells', 'tempo', 'cues', 'alt', 'mistakeAlt']);
      expect([id, await S.contentHashOf(id)]).toEqual([id, contentHash(c, f)]);
      expect((await S.stampOf(id)).scope).toBe(c.extends ?? c.id);
    }
  });
  it('mutations: one character of content, or one fragment, changes the hash, and checkC15 then fails on the old stamp', async () => {
    const id = 'lib_pull_up', f = fragmentsOf8(id), { content: c } = await content.loadContent(id), h = contentHash(c, f);
    const reviews = { schema: 1 as const, entries: [{ scope: id, hash: h, date: '2026-10-18' }] };
    expect(checkC15(c, f, reviews)).toEqual([]);
    const c2 = { ...c, copy: { ...c.copy, setupLine: `${c.copy.setupLine.slice(0, -1)}!` } };
    expect(checkC15(c2, f, reviews)).toHaveLength(1);
    expect(checkC15(c, { ...f, tells: f.tells.replace(/^./, 'x') }, reviews)).toHaveLength(1);
  });
});

describe('LIB-5 S8: stampProblems is strict', () => {
  it('a missing, unparsable or empty reviews.json fails every id', async () => {
    for (const reviews of [null, { schema: 1, entries: [] }, { schema: 1 }]) {
      expect(await S.stampProblems(['lib_pull_up', 'lib_leg_press'], { reviews })).toEqual([
        'LIB-5 stamp: lib_pull_up: reviews.json is missing, unparsable or empty', 'LIB-5 stamp: lib_leg_press: reviews.json is missing, unparsable or empty']);
    }
  });
  it('a matching entry passes; a stale hash, a wrong scope, and a scratch entry outside a marked root each fail', async () => {
    const { scope, hash } = await S.stampOf('lib_pull_up');
    const one = (e: any) => S.stampProblems(['lib_pull_up'], { reviews: { schema: 1, entries: [e] } });
    expect(await one({ scope, hash, date: '2026-10-18', approvedBy: 'supervisor', decision: 'D-LIB5-STAMPS', approval: 'https://github.com/macdarenz-droid/M-arc/pull/244#issuecomment-6247438837 @ 33302cc898afae29df539c9a932ceaad4a0864cb', open: 0 })).toEqual([]);
    expect(await one({ scope, hash: hash.replace(/^./, (c: string) => (c === '0' ? '1' : '0')), date: '2026-10-18' })).toEqual([`LIB-5 stamp: lib_pull_up: no reviews.json entry for scope lib_pull_up hash ${hash.slice(0, 12)}…`]);
    expect(await one({ scope: 'lib_leg_press', hash, date: '2026-10-18' })).toHaveLength(1);
    expect(await one({ scope, hash, date: '2026-10-18', scratch: true })).toHaveLength(1);
  });
});

describe('LIB-5 S8 / D-LIB5-SCRATCH: main holds no scratch marker or scratch stamp', () => {
  it('no SCRATCH_MARKER at ROOT, none tracked, and the committed reviews.json holds no scratch entry', () => {
    expect(S.SCRATCH_MARKER).toBe('LIB5-SCRATCH-ROOT');
    expect(existsSync(join(ROOT, S.SCRATCH_MARKER))).toBe(false);
    expect(execFileSync('git', ['ls-files', '--', `:(glob)**/${S.SCRATCH_MARKER}`], { cwd: ROOT, encoding: 'utf8' })).toBe('');
    const reviews = JSON.parse(readFileSync(join(ROOT, 'docs/research/howto/reviews.json'), 'utf8'));
    expect(reviews.entries.filter((e: any) => 'scratch' in e)).toEqual([]);
  });
  it('writeScratchStamps on an unmarked root throws, and writes nothing', () => {
    const t = mkdtempSync(join(tmpdir(), 'lib5-unmarked-')); temps.push(t);
    expect(() => S.writeScratchStamps(t, ['lib_pull_up'])).toThrow(/holds no LIB5-SCRATCH-ROOT/);
    expect(existsSync(join(t, 'docs/research/howto/reviews.json'))).toBe(false);
  });
});

describe('LIB-5 Do 6 (D-LIB5-STAMPS, D-LIB-O5 = lib4-cards 14.8): the 8\'s committed stamps', () => {
  const reviews = () => JSON.parse(readFileSync(join(ROOT, 'docs/research/howto/reviews.json'), 'utf8'));
  /** Problems with the committed (non-scratch) entries: approvedBy 'supervisor', a decision, an approval and open 0. */
  // LIB-SHIP W2 (ruling 3): the ruled library stamps, each with its decision and approval
  const W1_RULE = ['D-SHIP-W1-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/376#issuecomment-6616230145 @ 26593a92bdbe428f12186949c7842b35d9f47dec'];
  const W2_RULE = ['D-SHIP-W2-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/379#issuecomment-6636105974 @ 91ee3dfa68c60f825dad53077358bcc0056c4ecf'];
  const W2_STAMPED = ['lib_barbell_row', 'lib_dumbbell_bench_press', 'lib_dumbbell_shoulder_press', 'lib_upright_row', 'lib_rope_triceps_pushdown', 'lib_plank', 'lib_cable_fly', 'lib_push_up'];
  // LIB-PLATEFIX-1 (#385, D-PLATEFIX-STAMP 6654532221 @ e1419e26, the re-stamp at the merge of main 05f27be9; D-PLATEFIX-PINS / PIN GO): the 4 it ships are stamped
  // under its ruling, and barbell_row and cable_fly, whose plates it changed, are re-stamped after their W2 stamps (kept
  // as main's history, byte-equal). RULING now lists each id's rulings in stamp order; the last one is the current stamp.
  const PF_RULE = ['D-PLATEFIX-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/385#issuecomment-6654532221 @ e1419e2616a6cd7a048a6a09d81fadee83ccdd2d'];
  const PF_STAMPED = ['lib_romanian_deadlift', 'lib_single_leg_romanian_deadlift', 'lib_triceps_pushdown', 'lib_reverse_lunge'];
  const PF_RESTAMPED = ['lib_barbell_row', 'lib_cable_fly'];
  const RULING: Record<string, string[][]> = { lib_dumbbell_biceps_curl: [W1_RULE], ...Object.fromEntries(W2_STAMPED.map(id => [id, [W2_RULE]])),
    ...Object.fromEntries(PF_STAMPED.map(id => [id, [PF_RULE]])), ...Object.fromEntries(PF_RESTAMPED.map(id => [id, [W2_RULE, PF_RULE]])) };
  /** main 98eaec86's 17 reviews.json entries (sha256 of their JSON.stringify): LIB-PLATEFIX-1 only appends. */
  const sha = (t: string) => createHash('sha256').update(t).digest('hex');
  const MAIN_ENTRIES = { n: 17, sha: '0445f39e7b277ef6e0708c69cabaa060095193b5bfd3e2be7e1dc1b1ccf55e5b' };
  const clone = (x: any) => JSON.parse(JSON.stringify(x));
  /** The library entries against RULING: every ruled id stamped once per ruling, in order, under that decision; no
   *  unruled id stamped. */
  const stampedProblems = (entries: any[]) => {
    const lib = entries.filter(e => !e.scratch && !EIGHT.includes(e.scope)), bad: string[] = [];
    for (const id of Object.keys(RULING)) {
      const n = lib.filter(e => e.scope === id).length;
      if (!n) bad.push(`${id}: ruled, not stamped`);
      else if (n < RULING[id]!.length) bad.push(`${id}: ruled ${RULING[id]!.length} stamps, has ${n}`);
    }
    const seen: Record<string, number> = {};
    for (const e of lib) {
      const ruled = RULING[e.scope]?.[(seen[e.scope] = (seen[e.scope] ?? -1) + 1)];
      if (!RULING[e.scope]) bad.push(`${e.scope}: stamped, not ruled`);
      else if (!ruled) bad.push(`${e.scope}: stamped again, not ruled`);
      else if (e.decision !== ruled[0]) bad.push(`${e.scope}: decision ${e.decision}, ruled ${ruled[0]}`);
    }
    return bad;
  };
  const entryProblems = (entries: any[]) => entries.filter(e => !e.scratch).flatMap(e => [
    ...(e.approvedBy !== 'supervisor' ? [`${e.scope}: approvedBy ${JSON.stringify(e.approvedBy)}`] : []),
    ...(typeof e.decision !== 'string' || !e.decision ? [`${e.scope}: no decision`] : []),
    ...(typeof e.approval !== 'string' || !e.approval ? [`${e.scope}: no approval`] : []),
    ...(e.open !== 0 ? [`${e.scope}: open ${JSON.stringify(e.open)}`] : []),
  ]);
  // LIB-SHIP (D-SHIP-A9, ruling 3; D-SHIP-W1-STAMP #376 6616230145): replaces "exactly the 8": the committed entries are
  // the 8 then exactly the ruled shipped library ids, in shipping order; an unruled or missing entry is red.
  it('one approved entry per id of the 8, each matching stampOf; LIB-SHIP: then one per ruled shipped library id; every committed entry is the supervisor\'s', async () => {
    const r = reviews();
    // LIB-SHIP W2 (ruling 3; D-SHIP-W2-STAMP #379 6636105974): the W1 id, then the 9 W2 ids in shipping (registry) order
    // LIB-PLATEFIX-1: then its 4 in registry order, then the 2 re-stamps; main's 17 entries unchanged
    expect(r.entries.map((e: any) => e.scope)).toEqual([...EIGHT, 'lib_dumbbell_biceps_curl', ...W2_STAMPED, ...PF_STAMPED, ...PF_RESTAMPED]);
    expect(sha(JSON.stringify(r.entries.slice(0, MAIN_ENTRIES.n)))).toBe(MAIN_ENTRIES.sha);
    expect(stampedProblems(r.entries)).toEqual([]);
    expect(entryProblems(r.entries)).toEqual([]);
    const lib = r.entries.filter((x: any) => !EIGHT.includes(x.scope));
    for (const [i, e] of lib.entries()) {   // LIB-SHIP: each library stamp matches its sheet and its ruling
      const k = lib.slice(0, i).filter((x: any) => x.scope === e.scope).length, last = !lib.slice(i + 1).some((x: any) => x.scope === e.scope);
      // LIB-PLATEFIX-1: a superseded stamp (main's, byte-equal above) no longer matches the changed sheet; the last one does
      if (last) expect([e.scope, e.hash]).toEqual([e.scope, (await S.stampOf(e.scope)).hash]);
      else expect([e.scope, e.hash === (await S.stampOf(e.scope)).hash]).toEqual([e.scope, false]);
      expect([e.scope, e.decision, e.approval]).toEqual([e.scope, ...(RULING[e.scope]?.[k] ?? ['no ruling', ''])]);
    }
    for (const e of r.entries.filter((x: any) => EIGHT.includes(x.scope))) {
      expect([e.scope, e.hash]).toEqual([e.scope, (await S.stampOf(e.scope)).hash]);
      expect([e.decision, e.approval]).toEqual(['D-LIB5-STAMPS', 'https://github.com/macdarenz-droid/M-arc/pull/244#issuecomment-6247438837 @ 33302cc898afae29df539c9a932ceaad4a0864cb']);
      for (const role of ['fetcher', 'critic', 'safety', 'reviewer']) expect([e.scope, role, e[role]]).toEqual([e.scope, role, expect.stringContaining('README.md:52-90')]);
      for (const f of e.findings) expect(f).toMatch(/recorded, not changed: golden B is locked \(plan 2\.8\)$/);
    }
    expect(await S.stampProblems(EIGHT)).toEqual([]);
  });
  it('LIB-SHIP W2 A9 mutations, each red: a ruled id\'s stamp removed; an unruled id stamped; a W2 id under the W1 ruling', () => {
    const es = reviews().entries;
    expect(stampedProblems(es.filter((e: any) => e.scope !== 'lib_plank'))).toEqual(['lib_plank: ruled, not stamped']);
    expect(stampedProblems([...es, { ...es[es.length - 1], scope: 'lib_crunch' }])).toEqual(['lib_crunch: stamped, not ruled']);
    const w1 = clone(es); w1.find((e: any) => e.scope === 'lib_push_up').decision = 'D-SHIP-W1-STAMP';
    expect(stampedProblems(w1)).toEqual(['lib_push_up: decision D-SHIP-W1-STAMP, ruled D-SHIP-W2-STAMP']);
    // LIB-PLATEFIX-1 A9: a PLATEFIX id's stamp removed; a re-stamp removed; a PLATEFIX id under the W2 ruling; a third stamp
    expect(stampedProblems(es.filter((e: any) => e.scope !== 'lib_reverse_lunge'))).toEqual(['lib_reverse_lunge: ruled, not stamped']);
    const noRe = es.filter((e: any) => !(e.scope === 'lib_cable_fly' && e.decision === 'D-PLATEFIX-STAMP'));
    expect(stampedProblems(noRe)).toEqual(['lib_cable_fly: ruled 2 stamps, has 1']);
    const pfW2 = clone(es); pfW2.find((e: any) => e.scope === 'lib_triceps_pushdown').decision = 'D-SHIP-W2-STAMP';
    expect(stampedProblems(pfW2)).toEqual(['lib_triceps_pushdown: decision D-SHIP-W2-STAMP, ruled D-PLATEFIX-STAMP']);
    expect(stampedProblems([...es, { ...es[es.length - 1] }])).toEqual(['lib_cable_fly: stamped again, not ruled']);
    // the re-stamp's order matters: the PLATEFIX stamp before the W2 one is red
    const swapped = clone(es), a = swapped.findIndex((e: any) => e.scope === 'lib_barbell_row'), b = swapped.map((e: any) => e.scope).lastIndexOf('lib_barbell_row');
    [swapped[a], swapped[b]] = [swapped[b], swapped[a]];
    expect(stampedProblems(swapped)).toEqual(['lib_barbell_row: decision D-PLATEFIX-STAMP, ruled D-SHIP-W2-STAMP', 'lib_barbell_row: decision D-SHIP-W2-STAMP, ruled D-PLATEFIX-STAMP']);
  });
  it('mutations, each red: \'owner\'; approvedBy missing; open: 1', () => {
    const e = reviews().entries[0], { approvedBy: _a, ...noBy } = e;
    expect(entryProblems([{ ...e, approvedBy: 'owner' }])).toEqual([`${e.scope}: approvedBy "owner"`]);
    expect(entryProblems([noBy])).toEqual([`${e.scope}: approvedBy undefined`]);
    expect(entryProblems([{ ...e, open: 1 }])).toEqual([`${e.scope}: open 1`]);
    expect(entryProblems([{ ...e, approvedBy: 'stamps (O5)' }])).toHaveLength(1);
  });
});

describe('LIB-5 Do 6: the stamp gate in E1\'s tree (D-LIB5-SCRATCH 3, 7; S8)', () => {
  const T = 900_000;
  let F: any, tree: string;
  beforeAll(async () => {
    F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));
    tree = await (await import(/* @vite-ignore */ url('tests/howto/fixtures/lib5/tree.mjs'))).fixtureTreeAsync(); temps.push(tree);
  }, T);
  /** `node tools/plates/generate.mjs` in `cwd`; resolves { code, out }. */
  const gen = (cwd: string) => new Promise<{ code: number; out: string }>(resolve => {
    const c = spawn(process.execPath, ['tools/plates/generate.mjs'], { cwd, env: Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_ENV' && !k.startsWith('VITEST') && k !== 'TEST')) });
    let out = '';
    c.stdout.on('data', d => { out += d; }); c.stderr.on('data', d => { out += d; });
    c.on('close', code => resolve({ code: code ?? 1, out }));
  });
  const copy = (edit: (r: string) => void) => { const r = mkdtempSync(join(tmpdir(), 'lib5-stamp-')); temps.push(r); cpSync(tree, r, { recursive: true, verbatimSymlinks: true }); edit(r); return r; };
  const REV = 'docs/research/howto/reviews.json';
  const rev = (r: string) => JSON.parse(readFileSync(join(r, REV), 'utf8'));
  it('fixtureTree() marks the tree and writes one scratch stamp for E1, and generate passes the gate', async () => {
    expect(existsSync(join(tree, S.SCRATCH_MARKER))).toBe(true);
    expect(rev(tree).entries.filter((e: any) => e.scratch).map((e: any) => e.scope)).toEqual([F.ID]);
    const g = await gen(tree);
    expect([g.code, g.out.slice(-300)]).toEqual([0, expect.stringContaining('generate: wrote')]);
  }, T);
  it('mutations, each red: entries emptied (every shipped id named, while checkC15 passes the empty file); marker removed; E1\'s stamp dropped', async () => {
    // one generator at a time: three full generator runs at once, beside the other suites, overload the runner
    const emptied = await gen(copy(r => writeFileSync(join(r, REV), '{ "schema": 1, "entries": [] }\n')));
    const unmarked = await gen(copy(r => rmSync(join(r, S.SCRATCH_MARKER))));
    const dropped = await gen(copy(r => { const v = rev(r); v.entries = v.entries.filter((e: any) => !e.scratch); writeFileSync(join(r, REV), JSON.stringify(v)); }));
    expect(emptied.code).not.toBe(0);
    for (const id of [...EIGHT, F.ID]) expect([id, emptied.out]).toEqual([id, expect.stringContaining(`LIB-5 stamp: ${id}: reviews.json is missing, unparsable or empty`)]);
    const { content: c } = await content.loadContent('lib_pull_up');
    expect(checkC15(c, fragmentsOf8('lib_pull_up'), { schema: 1, entries: [] })).toEqual([]);
    for (const x of [unmarked, dropped]) {
      expect(x.code).not.toBe(0);
      expect(x.out).toContain(`LIB-5 stamp: ${F.ID}: no reviews.json entry for scope ${F.ID}`);
      for (const id of EIGHT) expect(x.out).not.toContain(`LIB-5 stamp: ${id}:`);
    }
  }, T);
  it('LIB-4a: writeIds(ROOT, 22) passes, and its synthetic copy holds no reviews.json (the gate is never reached from ids.mjs)', async () => {
    // In a child process: writeIds copies src/ and tools/plates synchronously, which would block this worker's RPC.
    const code = `import { existsSync } from 'node:fs'; import { join } from 'node:path';
const { writeIds } = await import(${JSON.stringify(url('tools/plates/library/scale/write-ids.mjs'))});
const o = await writeIds(${JSON.stringify(ROOT)}, 22);
console.log('@@' + JSON.stringify({ root: o.root, reviews: existsSync(join(o.root, ${JSON.stringify(REV)})) }));`;
    const r = await new Promise<{ code: number; out: string }>(resolve => {
      const c = spawn(process.execPath, ['--input-type=module', '-e', code], { cwd: ROOT });
      let out = '';
      c.stdout.on('data', d => { out += d; }); c.stderr.on('data', d => { out += d; });
      c.on('close', k => resolve({ code: k ?? 1, out }));
    });
    const line = r.out.split('\n').find(l => l.startsWith('@@'));
    expect([r.code, Boolean(line)]).toEqual([0, true]);
    const got = JSON.parse(line!.slice(2));
    temps.push(got.root);
    expect(got.reviews).toBe(false);
  }, T);
});

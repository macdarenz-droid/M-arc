// F-HARNESS-FEEL-GRIP (docs/supervisor/verify/f-harness-feel-grip-card.md; rulings D-HFG-ONECARD, D-HFG-TRUNKEQ,
// D-HFG-JJGRIP, D-HFG-OWNE, D-HFG-HIGHKNEES, D-HFG-LIBSHIP448). The fidelity harness learns three real sheet shapes:
// a feel map with no primary muscle (cable_external_rotation), a feel section with no rows (jumping_jacks) and a declared
// Right that is its base reference pose with `trunk` written as an object (cable_external_rotation, one_arm_dumbbell_row).
// Every rule keys on the sheet's source and keeps a red for a row that claims the shape but lacks it.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { child } from '../child-test';

const ROOT = process.cwd();
const imp = async (p: string): Promise<any> => import(/* @vite-ignore */ pathToFileURL(join(ROOT, p)).href);
const T4 = 'tools/plates/library/fidelity/twins/ht4.mjs', T8 = 'tools/plates/library/fidelity/twins/ht8.mjs';
const T9 = 'tools/plates/library/fidelity/twins/ht9.mjs', TU = 'tools/plates/library/fidelity/tuples.mjs';
const FID = 'tools/plates/library/fidelity.mjs', GB = 'tools/plates/fidelity/goldenB.mjs';
const CER = 'lib_cable_external_rotation', JJ = 'lib_jumping_jacks', OADR = 'lib_one_arm_dumbbell_row';

describe('F-HARNESS-FEEL-GRIP part 1: sourceFacts feel and noPrimary (from source, fail closed)', () => {
  it('noPrimary is true only for CER (sheet [] and card []); jj and oadr name a primary; sourceFacts carries both facts', async () => {
    const T = await imp(TU);
    const got = await Promise.all([CER, JJ, OADR].map(async id => [id, T.noPrimaryOf(id, (await imp(`tools/plates/library/howto/${id}.howto.mjs`)).default)]));
    expect(got).toEqual([[CER, true], [JJ, false], [OADR, false]]);
    // a shipped row (the three are approved-plate on main; the scratch flip runs sourceFacts on them)
    const f = await T.sourceFacts('lib_dumbbell_biceps_curl');
    expect([f.feel, f.noPrimary, f.rows.length > 0]).toEqual([true, false, true]);
    expect(readFileSync(TU, 'utf8')).toContain('noPrimary: noPrimaryOf(id, src, root),');
  });
  it('m5: a sheet with primary [] whose research card names a primary is false; a missing card is false', async () => {
    const T = await imp(TU), D = mkdtempSync(join(tmpdir(), 'hfg-card-'));
    try {
      const sheet = { feel: { primary: [] } };
      mkdirSync(join(D, 'docs/research/howto/cards'), { recursive: true });
      expect(T.noPrimaryOf('lib_x', sheet, D)).toBe(false);   // no card
      writeFileSync(join(D, 'docs/research/howto/cards/x.json'), JSON.stringify({ feel: { primary: [{ muscleId: 'quads' }] } }));
      expect(T.noPrimaryOf('lib_x', sheet, D)).toBe(false);   // m5
      writeFileSync(join(D, 'docs/research/howto/cards/x.json'), JSON.stringify({ feel: { primary: [] } }));
      expect(T.noPrimaryOf('lib_x', sheet, D)).toBe(true);
      expect(T.noPrimaryOf('lib_x', { feel: { primary: ['quads'] } }, D)).toBe(false);
      expect(T.noPrimaryOf('lib_x', {}, D)).toBe(false);
    } finally { rmSync(D, { recursive: true, force: true }); }
  });
});

describe('F-HARNESS-FEEL-GRIP D-HFG-HT8FEEL: statesOf keys the HT8 block on the feel section, S6 one per row', () => {
  const base = { id: 'x', chromeId: 'x', normal: ['a'], tells: ['b'], firstKey: 'a', hand: null, posture: [], shows: 0, grip: false, push: false, noPrimary: false };
  const ht8 = (t: any[]) => t.filter((x: any) => x.state.startsWith('HT8/') && x.state !== 'HT8/size@*').map((x: any) => `${x.theme}|${x.state}`);
  it('a feel section with no rows gets every HT8 state but S6; no feel section gets none (mutation: keyed on rows, red)', async () => {
    const T = await imp(TU);
    const noRows = ht8(T.statesOf({ ...base, feel: true, rows: [] }));
    expect(noRows).toContain('silent-black|HT8/L4@390');
    expect(noRows).toContain('silent-black|HT8/C12@390');
    expect(noRows).toContain('paper|HT8/reduced@390');
    expect(noRows.some((s: string) => s.includes('/S6-'))).toBe(false);
    expect(ht8(T.statesOf({ ...base, feel: false, rows: [] }))).toEqual([]);
    const two = ht8(T.statesOf({ ...base, feel: true, rows: ['r1', 'r2'] }));
    expect(two.filter((s: string) => s.includes('/S6-')).length).toBe(2 * 5);
  });
  child.it('every shipped row\'s tuple list is unchanged: each has feel rows exactly when it has a feel section', async () => {
    const T = await imp(TU), R = await imp('tools/plates/library/registry.mjs');
    const shipped = R.rows().filter((r: any) => r.stage === 'shipped').map((r: any) => r.id);
    expect(shipped.length).toBeGreaterThan(80);
    const odd: string[] = [];
    for (const id of shipped) { const f = await T.sourceFacts(id); if (f.feel !== f.rows.length > 0) odd.push(id); }
    expect(odd).toEqual([]);
  }, 120_000);
});

describe('F-HARNESS-FEEL-GRIP part 2: HT4-A6 on a map with no primary (goldenB.mjs statesFor, selfCheck)', () => {
  const fakeEval = { evaluate: async (fn: any, arg: any) => (String(fn).includes('.zx-chip') || String(fn).includes('.fr') ? [] : (String(arg).startsWith('#card-') && String(fn).includes('.grip') ? true : null)) };
  it('the default keeps the playing state; primary: false swaps it for "feel tapped (no primary)", held equal to rest', async () => {
    const G = await imp(GB);
    const d = await G.statesFor(fakeEval, 'x'), n = await G.statesFor(fakeEval, 'x', { primary: false });
    expect(d.map((s: any) => s.name)).toContain('x: feel playing (paused mid-sweep)');
    expect(d.some((s: any) => s.equalsBaseline)).toBe(false);
    expect(n.map((s: any) => s.name)).not.toContain('x: feel playing (paused mid-sweep)');
    const t = n.find((s: any) => s.name === 'x: feel tapped (no primary)');
    expect([t?.group, t?.equalsBaseline, typeof t?.open, typeof t?.close]).toEqual(['feel', true, 'function', 'function']);
    expect(n.length).toBe(d.length);   // every other state still runs
  });
  it('ht4.mjs passes primary: !facts.noPrimary (sourceFacts), next to grip', () => {
    expect(readFileSync(T4, 'utf8')).toContain('gb.selfCheck(page, chrome, { grip: await gripOf(ctx.root, lib), primary: !facts.noPrimary })');
  });
});

describe('F-HARNESS-FEEL-GRIP part 3: HT8 L4, S4 and reduced on a map with no primary', () => {
  const anim = [{ name: 'feel-sweep' }];
  it('L4: no band and no animation in app and golden passes; a band (m3) is red; a primary row with 0 bands stays red', async () => {
    const H = await imp(T8);
    expect(H.l4Problems({ la: [], lg: [], bands: 0, goldBands: 0, noPrimary: true })).toEqual([]);
    expect(H.l4Problems({ la: anim, lg: anim, bands: 1, goldBands: 1, noPrimary: true })).toHaveLength(1);
    expect(H.l4Problems({ la: [], lg: [], bands: 0, goldBands: 1, noPrimary: true })).toHaveLength(1);
    expect(H.l4Problems({ la: [], lg: [], bands: 1, goldBands: 0, noPrimary: true })).toHaveLength(1);   // an app band with no animation
    expect(H.l4Problems({ la: [], lg: [], bands: 0, goldBands: 0 })).toEqual(['0 band animations for 0 bands']);   // m4's other side: today's red
    expect(H.l4Problems({ la: anim, lg: anim, bands: 1, goldBands: 1 })).toEqual([]);
    expect(H.l4Problems({ la: anim, lg: [], bands: 1, goldBands: 0 })).toHaveLength(1);
  });
  it('S4: with no primary the class lists must be equal and nothing run; with a primary is-playing must be gone', async () => {
    const H = await imp(T8), c = ['feel-map', 'is-playing'];
    expect(H.s4Problems({ playing: true, appClass: c, goldClass: c, running: 0, noPrimary: true })).toEqual([]);
    expect(H.s4Problems({ playing: true, appClass: c, goldClass: ['feel-map'], running: 0, noPrimary: true })).toHaveLength(1);
    expect(H.s4Problems({ playing: false, appClass: c, goldClass: c, running: 1, noPrimary: true })).toHaveLength(1);
    expect(H.s4Problems({ playing: true, appClass: c, goldClass: c, running: 0 })).toEqual(['is-playing still set after the sweep ended']);
    expect(H.s4Problems({ playing: false, appClass: ['feel-map'], goldClass: [], running: 0 })).toEqual([]);
  });
  it('reduced: no primary wants exactly no band; a band (m3) is red; a primary row keeps today\'s rule', async () => {
    const H = await imp(T8), none = { n: 0, shown: 0, anims: 0, playing: false }, hidden = { n: 2, shown: 0, anims: 0, playing: false };
    expect(H.reducedProblems(none, true)).toEqual([]);
    expect(H.reducedProblems(hidden, true)).toHaveLength(1);
    expect(H.reducedProblems(none, false)).toHaveLength(1);
    expect(H.reducedProblems(hidden, false)).toEqual([]);
    expect(H.reducedProblems({ ...hidden, playing: true }, false)).toHaveLength(1);
  });
});

describe('F-HARNESS-FEEL-GRIP part 4 (D-HFG-TRUNKEQ): a declared Right that is its base pose with trunk as an object', () => {
  const sheetRight = async (lib: string, key: string) => {
    const T = await imp(T4), howto = (await imp(`tools/plates/library/howto/${lib}.howto.mjs`)).default;
    const spec = JSON.parse(JSON.stringify((await imp(`tools/plates/library/specs/${lib.replace(/^lib_/, '')}.mjs`)).default));
    const z = howto.zooms.find((x: any) => x.key === key);
    return { T, z, base: spec.poses[z.right.base], right: JSON.parse(JSON.stringify(T.mergeDeep(spec.poses[z.right.base], z.right.pose))) };
  };
  it('trunkOf reads the engine\'s forms; any bow, array, other key or non-number is never equal', async () => {
    const T = await imp(T4);
    for (const t of [undefined, null, 0, { flex: 0 }, { flex: 0, yaw: 0 }, { flex: 0, yaw: 0, lat: 0 }, {}]) expect(T.trunkOf(t)).toEqual({ flex: 0, yaw: 0, lat: 0 });
    expect(T.trunkOf(5)).toEqual({ flex: 5, yaw: 0, lat: 0 });
    for (const t of [{ flex: 0, bow: 1 }, { flex: [0, 0] }, { roll: 0 }, { flex: '0' }, [0], 'x', Number.NaN]) expect(T.trunkOf(t)).toBe(null);
  });
  it('CER cer-turn and oadr oadr-top: the declared Right draws the same as its base pose, and is not JSON-equal to it', async () => {
    for (const [lib, key] of [[CER, 'cer-turn'], [OADR, 'oadr-top']] as const) {
      const { T, base, right, z } = await sheetRight(lib, key);
      expect([lib, z.right.base, JSON.stringify(right) === JSON.stringify(base), T.sameDrawing(right, base)]).toEqual([lib, 'end', false, true]);
      // m1, yaw 1, m2: each mutated Right draws differently
      for (const t of [{ flex: 5, yaw: 0 }, { flex: 0, yaw: 1 }, { flex: 0, yaw: 0, bow: 1 }]) expect([lib, t, T.sameDrawing({ ...right, trunk: t }, base)]).toEqual([lib, t, false]);
      expect(T.sameDrawing({ ...right, shoulder: null }, base)).toBe(false);   // a change outside trunk
    }
  });
  // libraryA5 on a minimal source: base, the plate's -n/-m, and one zoom-shell zoom `k` whose Right is end with trunk
  // written { flex: 0, yaw: 0 } and whose Wrong is solid with `under` (CER's cer-turn form)
  const a5 = async (rightTrunk: any, { ruled = [] as any[], callTrunk = rightTrunk } = {}) => {
    const T = await imp(T4);
    const ref = { id: 'hfg_spec', poses: { start: { trunk: 0, arm: 1 }, end: { trunk: 0, arm: 2 } }, mistake: { pose: { arm: 3 } } };
    const howto = { zooms: [{ kind: 'posture', key: 'k', right: { base: 'end', pose: { trunk: rightTrunk } }, wrong: { base: 'end', pose: { arm: 9 }, solid: true, under: true } }] };
    const rightCall = { trunk: callTrunk, arm: 2 }, wrongPose = { trunk: 0, arm: 9 };
    const call = (id: string, p: any) => ({ opts: { id }, spec: { ...ref, poses: { start: p, end: p } } });
    const calls = [{ opts: { id: 'base' }, spec: ref }, call('p-n', ref.poses.end), call('k-right', rightCall), call('k-under', rightCall), call('k-wrong', wrongPose)];
    const gb = { protectedFieldProblems: () => [], fragmentProblems: () => [] };
    return T.libraryA5({ calls, html: '' }, { specId: 'hfg_spec', ref, howto, prefix: 'p', family: 'zoom', entry: {}, ruled }, gb).poses;
  };
  it('libraryA5 accepts the trunk-form Right on its Right and -under calls without a RULED_RIGHT_POSES entry', async () => {
    expect(await a5({ flex: 0, yaw: 0 })).toEqual([]);
    expect(await a5(0)).toEqual([]);   // the plain form is a reference pose, as today
  });
  it('m1, yaw 1, m2: a Right that differs in its trunk drawing stays red on both calls', async () => {
    for (const t of [{ flex: 5, yaw: 0 }, { flex: 0, yaw: 1 }, { flex: 0, yaw: 0, bow: 1 }]) {
      const p = await a5(t);
      expect([t, p.filter((m: string) => /\|k-(right|under): poses\.(start|end) matches neither a reference pose/.test(m)).length]).toEqual([t, 4]);
    }
  });
  it('only that exact declared pose is accepted: a call drawing another trunk-equal form is red', async () => {
    expect((await a5({ flex: 0, yaw: 0 }, { callTrunk: { flex: 0 } })).length).toBe(4);
  });
  it('RULED_RIGHT_POSES keeps its 5 entries (D-HFG-TRUNKEQ: proof, not list)', async () => {
    expect((await imp(T4)).RULED_RIGHT_POSES.map((e: any) => e.id)).toEqual(['dumbbell_shrug|dshrug-top', 'bulgarian_split_squat|rear-knee', 'diamond_push_up|shoulder-blades', 'hack_squat|knee-lock', 'wall_ball|wall-distance']);
  });
});

describe('F-HARNESS-FEEL-GRIP part 5: HT8/size wants a feel chunk for every feel section, rows or not', () => {
  it('feelChunkWanted keys on the feel section (m6: rows.length would refuse jj\'s chunk)', async () => {
    const F = await imp(FID);
    expect(F.feelChunkWanted({ feel: true, rows: [] })).toBe(true);
    expect(F.feelChunkWanted({ feel: true, rows: ['a'] })).toBe(true);
    expect(F.feelChunkWanted({ feel: false, rows: [] })).toBe(false);
    expect(readFileSync(FID, 'utf8')).toContain("`feel-${chrome}`, feelChunkWanted(facts)]");
  });
});

describe('F-HARNESS-FEEL-GRIP part 7 (D-HFG-OWNE): HT10-A1 own-E list', () => {
  it('the list is exactly jumping_jacks, citing its ruling, with pinned terms whose E is its own floor', async () => {
    const F = await imp(FID), T = await imp(T4);
    expect(F.HT10_OWN_E.map((e: any) => e.id)).toEqual([JJ]);
    // the terms of jj's card as its layers page shows it, measured on the scratch flip (F-HARNESS-FEEL-GRIP PLAN: E 13)
    expect(F.HT10_OWN_E[0].terms).toEqual({ callouts: 3, tells: 1, wrist: 0, chips: [1], shows: 0, feel: 1, more: 0, rows: 0 });
    const e = F.HT10_OWN_E[0];
    expect([T.citesRuling(e), /\bD-HFG-OWNE\b/.test(e.ruling)]).toEqual([true, true]);
    const E = F.ht10Expected(e.terms);
    expect(E).toBeLessThan(F.HT10_FLOOR);
    expect(F.ownEFloor(JJ, e.terms, E, false)).toEqual({ floor: E, problems: [], listed: true });
  });
  it('m8: a changed term is red (floor back to 15); m9: no citation is red; unlisted rows keep max(15, E)', async () => {
    const F = await imp(FID), e = F.HT10_OWN_E[0], E = F.ht10Expected(e.terms);
    const moved = { ...e.terms, rows: e.terms.rows + 1 };
    const m8 = F.ownEFloor(JJ, moved, F.ht10Expected(moved), false);
    expect([m8.floor, m8.problems.length]).toEqual([15, 1]);
    const m9 = F.ownEFloor(JJ, e.terms, E, false, [{ ...e, ruling: 'own E' }]);
    expect([m9.floor, m9.problems.length]).toEqual([15, 1]);
    expect(F.ownEFloor(JJ, e.terms, E, false, [])).toEqual({ floor: 15, problems: [], listed: false });   // jj off the list
    expect(F.ownEFloor('lib_other', e.terms, 13, false)).toEqual({ floor: 15, problems: [], listed: false });
    expect(F.ownEFloor('lib_other', e.terms, 13, true)).toEqual({ floor: 13, problems: [], listed: false });   // a ruled text-zoom row, as today
  });
});

// The browser halves of parts 2 and 6 (golden B's selfCheck with no primary, openAllNoRows) run in
// tests/howto/fixtures/f-harness-feel-grip/probe.mjs, a self-asserting evidence script in the tests/gate form: the unit jobs
// install no browser. Its output is recorded in the PR.

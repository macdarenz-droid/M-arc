// FG-3: the §5 checks (docs/FORM-GUIDE-PRODUCTION.md) on every exercise file, each against its seeded bad file (A1, A2),
// the library census for targetVisible (A3) and the `npm run fg:check` command (A4).
import { describe, expect, it } from 'vitest';
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import library from '@/data/exercises.json';
import type { ExerciseGuide } from '@/formguide/model';
import { CHECKS, runChecks, report, moments, speedsDiffer, stopsRule, type CheckId } from '@/formguide/check';
import { inputFor, guideOf } from '@/formguide/check/node';
import { CENSUS_VIEW_OVERRIDES, OVERLAYS, hasOverlay, hiddenTargets, type LibraryRow } from '@/formguide/check/overlays';
import { anchorAt, offPath, type Lever } from '@/formguide/check/machines';
import { bbox, compile, pathSegs } from '@/formguide/check/svg';
import { stopsFor, windowsFor } from '@/formguide/sample';
import { BASE } from './fixtures/bad/base';

const EX = 'src/formguide/exercises', BAD = 'tests/formguide/fixtures/bad';
const failing = (rs: ReturnType<typeof runChecks>) => rs.filter(r => !r.ok).map(r => r.check);
/** The lateral raise's input with another guide in its place (a variant of the base). */
const variant = (g: ExerciseGuide, only?: CheckId[]) => runChecks(inputFor(`${EX}/lib_dumbbell_lateral_raise.ts`, g), only);

describe('every exercise file passes every check', () => {
  const files = readdirSync(EX).filter(f => f.endsWith('.ts'));
  it('the library holds the lateral raise', () => expect(files).toContain('lib_dumbbell_lateral_raise.ts'));
  it.each(files)('%s', async f => {
    const g = guideOf(await import(`../../${EX}/${f}`), f), rs = runChecks(inputFor(`${EX}/${f}`, g));
    console.info(report(f.replace(/\.ts$/, ''), rs));
    expect(rs.map(r => r.check)).toEqual([...CHECKS]);
    expect(failing(rs)).toEqual([]);
  });
  it('the fixture base (the lateral raise without its mistake sway) passes every check but its missing hash', () => {
    expect(failing(variant(BASE))).toEqual(['hash']);
  });
});

describe('A1/A2 each check fails on its own seeded bad file, and names the check, the id and the numbers', () => {
  const dirs = readdirSync(BAD, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
  /** A folder is named for its check, with `.case` when a check has more than one bad file. */
  const checkOf = (dir: string) => dir.split('.')[0] as CheckId;
  it('at least one seeded bad file per check, and every folder names a check', () => {
    expect([...new Set(dirs.map(checkOf))].sort()).toEqual([...CHECKS].sort());
  });
  /** The rule each extra case exercises, by its failing line. */
  const CASE: Record<string, RegExp> = { 'handsOnHandle.nodrive': /has 0 drive parts: nothing moves the machine/, 'handsOnHandle.unattached': /hand_l holds the equipment but 0 of 1 drive parts attach it/ };
  it.each(dirs)('%s', async dir => {
    const check = checkOf(dir), f = readdirSync(`${BAD}/${dir}`).find(x => x.endsWith('.ts'))!, path = `${BAD}/${dir}/${f}`;
    const g = guideOf(await import(`./fixtures/bad/${dir}/${f}`), f), rs = runChecks(inputFor(path, g));
    const r = rs.find(x => x.check === check)!;
    console.info(`[FG-3] ${check}: ${r.fails[0]}`);
    expect(failing(rs)).toEqual([check]);
    if (CASE[dir]) expect(r.fails.join('\n')).toMatch(CASE[dir]!);
    for (const m of r.fails) {
      expect(m.startsWith(`${check} ${g.id}: `), m).toBe(true);
      // the failing numbers; idMatch's failing values are the two names it prints
      if (check !== 'idMatch') expect(m, 'names a number').toMatch(/\d/);
    }
  });
  it('sample-based failures say where: the channel or joint and the rep fraction, seconds and rep', async () => {
    for (const check of ['smoothness', 'jointRanges', 'feetPlanted', 'handsOnHandle', 'machinePivot', 'bodyOnPad'] as const) {
      const f = readdirSync(`${BAD}/${check}`).find(x => x.endsWith('.ts'))!;
      const g = guideOf(await import(`./fixtures/bad/${check}/${f}`), f), r = runChecks(inputFor(`${BAD}/${check}/${f}`, g), [check])[0]!;
      for (const m of r.fails) expect(m, check).toMatch(/u=[\d.]+ \([\d.]+ s, (rep \d|mistake)\)/);
      expect(r.fails.some(m => /(_[lr]|hand|foot|back|shoulder|arm)\b/.test(m)), check).toBe(true);
    }
  });
});

describe('the rules inside each check', () => {
  const only = (g: unknown, c: CheckId) => variant(g as ExerciseGuide, [c])[0]!;
  it('smoothness (d): a 15° snap of the elbow fails', () => {
    const r = only({ ...BASE, joints: { ...BASE.joints, elbow_flex: { keys: [[0.5, 5], [0.5005, 20]] } } }, 'smoothness');
    expect(r.fails.some(m => /\(d\) elbow_flex_[lr] moves [\d.]+° in 1\/120 s > 4°/.test(m))).toBe(true);
  });
  it('smoothness (c) is measured at the stops\' exact times: a plain minimum-jerk raise passes at uneven tempos', () => {
    for (const t of [[1.2, 0.5, 2, 0.8], [0.9, 0.3, 1.7, 0.6], [1.5, 1, 2.5, 0], [0.7, 0.4, 1.9, 0.5]])
      expect(only({ ...BASE, joints: { shoulder_abd: [10, 88] }, tempo: { lift: t[0], hold: t[1], lower: t[2], rest: t[3] } }, 'smoothness').fails, t.join('/')).toEqual([]);
  });
  it('stops: D-FG2\'s rule on the stop list itself (99 intervals, an uneven stop, a stop in the hold, not 0..1)', () => {
    const ws = windowsFor({ lift: 1, hold: 0.5, lower: 2, rest: 0.5 }, 'lift_first', 'rep'), good = stopsFor({ lift: 1, hold: 0.5, lower: 2, rest: 0.5 }, 'lift_first', 'rep');
    expect(stopsRule(good, ws)).toEqual([]);
    expect(stopsRule(good.filter((_, i) => i !== 50), ws)).toEqual(['lift: 99 intervals, D-FG2 gives 100 per moving phase']);
    expect(stopsRule(good.map((u, i) => (i === 50 ? u + 0.001 : u)), ws)).toEqual(['lift: uneven stop at u=0.126, 0.0035 after the last (step 0.0025)']);
    expect(stopsRule([...good.slice(0, 101), 0.3, ...good.slice(101)], ws)).toEqual(['hold: 1 stops inside (first u=0.3), D-FG2 allows its two ends only']);
    expect(stopsRule(good.slice(0, -1), ws)).toEqual(['stops run 0..0.875, not 0..1']);
    expect(stopsRule([0, ...good], ws).join()).toMatch(/stop 1 at u=0 does not increase/);
  });
  it('stops: a rep with one moving phase fails; a hold has stops at its ends only', () => {
    expect(only({ ...BASE, tempo: { lift: 1, hold: 0.5, lower: 0, rest: 2.5 } }, 'stops').fails.join()).toMatch(/lower = 0 s: a rep needs both moving phases/);
    const hold = { ...BASE, kind: 'hold', tempo: { hold: 4 }, mistake: { ...BASE.mistake, tempo: undefined } };
    expect(only(hold, 'stops').fails).toEqual([]);
  });
  it('jointRanges: a written channel without a research range fails, and so does leaving the AAOS limits', () => {
    expect(only({ ...BASE, joints: { ...BASE.joints, hip_flex: 5 } }, 'jointRanges').fails.join()).toMatch(/hip_flex_[lr] is written but research.json has no coaching range/);
    expect(only({ ...BASE, joints: { ...BASE.joints, knee_flex: 140 } }, 'jointRanges').fails.join()).toMatch(/knee_flex_[lr] = 140 outside the AAOS limits 0..135/);
  });
  it('jointRanges: a NaN in the correct figure fails, named as the correct figure', () => {
    expect(only({ ...BASE, joints: { ...BASE.joints, knee_flex: NaN } }, 'jointRanges').fails.join()).toMatch(/correct figure knee_flex_[lr] = NaN outside the coaching range 0..10/);
    expect(only({ ...BASE, joints: { ...BASE.joints, torso_lean: NaN } }, 'jointRanges').fails.join()).toMatch(/correct figure torso_lean = NaN outside the AAOS limits/);
  });
  it('mistakeDiffers: no motion in either figure never differs; 15 % either way does', () => {
    expect(speedsDiffer(0, 0)).toMatch(/no motion \(0 and 0 u\/s\)/);
    expect(speedsDiffer(0, 10)).toMatch(/no motion/);
    expect(speedsDiffer(100, 114.9)).toBe('14.9 % < 15 %');
    expect(speedsDiffer(100, 115)).toBeNull();
    expect(speedsDiffer(100, 85)).toBeNull();
  });
  it('mistakeSane: fewer than two tells, NaN and the AAOS limits fail', () => {
    expect(only({ ...BASE, mistake: { ...BASE.mistake, tells: BASE.mistake.tells.slice(0, 1) } }, 'mistakeSane').fails.join()).toMatch(/1 tells, the mistake needs 2/);
    expect(only({ ...BASE, mistake: { ...BASE.mistake, joints: { ...BASE.mistake.joints, elbow_flex: NaN } } }, 'mistakeSane').fails.join()).toMatch(/elbow_flex_[lr] = NaN/);
    expect(only({ ...BASE, mistake: { ...BASE.mistake, joints: { ...BASE.mistake.joints, knee_flex: [0, 140] } } }, 'mistakeSane').fails.join()).toMatch(/knee_flex_[lr] = [\d.]+ outside the AAOS limits/);
  });
  it('mistakeDiffers: a hold passes on its sag delta and fails without one', () => {
    const hold = (d: number) => ({ ...BASE, kind: 'hold', tempo: { hold: 4 }, mistake: { ...BASE.mistake, tempo: undefined, joints: { knee_flex: [0, d] } } });
    expect(only(hold(12), 'mistakeDiffers').fails).toEqual([]);
    expect(only(hold(2), 'mistakeDiffers').fails.join()).toMatch(/largest sag delta 2 < 5°/);
  });
  it('machine checks fail a machine with no drawing, and a setup mistake without a machine', () => {
    const m = { ...BASE, machine: { id: 'nowhere', settings: {}, drive: [] } };
    for (const c of ['handsOnHandle', 'bodyOnPad', 'machinePivot', 'pathBudget', 'everyPoseRenders'] as const) expect(only(m, c).fails.join(), c).toMatch(/machine nowhere has no drawing/);
    expect(only({ ...BASE, mistake: { ...BASE.mistake, setup: { setting: 'seat', wrong: 0.2, text: 'x' } } }, 'setupDiffers').fails.join()).toMatch(/no machine/);
  });
  it('a view or pose the rig does not draw yet fails the figure checks, naming what is missing', () => {
    const side = only({ ...BASE, view: 'side', viewWhy: 'test' }, 'everyPoseRenders').fails.join();
    expect(side).toMatch(/no side view figure yet/);
    expect(only({ ...BASE, pose: 'lying_supine' }, 'themes').fails.join()).toMatch(/no lying_supine pose/);
    expect(only({ ...BASE, equipment: { ...BASE.equipment, kind: 'barbell' } }, 'pathBudget').fails.join()).toMatch(/part barbell has no drawing yet/);
  });
  it('muscleTiming: an effort step over 0.02 per 1/120 s, a loud keep-quiet muscle and a quiet mistake fail', () => {
    const e = (effort: object, mistake?: object) => ({ ...BASE, muscles: { ...BASE.muscles, effort }, mistake: { ...BASE.mistake, muscles: mistake } });
    expect(only(e({ side_delts: { keys: [[0, 0.1], [0.3, 0.1], [0.302, 1], [0.6, 0.1]] }, upper_traps: 0.1 }, { upper_traps: 0.5 }), 'muscleTiming').fails.join()).toMatch(/side_delts effort steps [\d.]+ in 1\/120 s > 0.02/);
    expect(only(e({ side_delts: { keys: [[0, 0.1], [0.3, 1], [0.6, 0.1]] }, upper_traps: 0.3 }, { upper_traps: 0.5 }), 'muscleTiming').fails.join()).toMatch(/keep-quiet upper_traps reaches 0.3 ≥ 0.2/);
    expect(only(e({ side_delts: { keys: [[0, 0.1], [0.3, 1], [0.6, 0.1]] }, upper_traps: 0.1 }), 'muscleTiming').fails.join()).toMatch(/upper_traps is not higher in the mistake/);
    expect(only({ ...BASE, muscles: { ...BASE.muscles, keepQuiet: [] } }, 'muscleTiming').fails.join()).toMatch(/keepQuiet is empty/);
  });
  it('secondaryMotion: no breath and too much sway fail', () => {
    expect(only({ ...BASE, joints: { ...BASE.joints, breath: 0.5 } }, 'secondaryMotion').fails.join()).toMatch(/breath amplitude 0, must be > 0/);
    expect(only({ ...BASE, movement: { ...BASE.movement, leanDeg: 3 } }, 'secondaryMotion').fails.join()).toMatch(/sway amplitude 2.94° outside \[0.2°, 1.5°\] at u=/);
  });
  it('targetVisible: an empty target list fails', () => {
    expect(only({ ...BASE, muscles: { ...BASE.muscles, target: [] } }, 'targetVisible').fails.join()).toMatch(/target is empty/);
  });
  it('the key moments come from the tempo: start, mid-lift, top, mid-lower', () => {
    expect(moments(windowsFor({ lift: 1, hold: 0.5, lower: 2, rest: 0.5 }, 'lift_first', 'rep'))).toEqual([0, 0.125, 0.25, 0.625]);
    expect(moments(windowsFor({ lift: 1, hold: 0.25, lower: 2, rest: 0.75 }, 'lower_first', 'rep'))).toEqual([0, 0.25, 0.5, 0.6875]);
  });
});

describe('D-FG3 the widened standingFront frame', () => {
  it('holds the lateral raise\'s correct reps and its mistake (sway kept) with at least 1 unit to spare', async () => {
    const { VIEWBOXES } = await import('@/formguide/model');
    const { rigFor } = await import('@/formguide/check/view');
    const { themeReader } = await import('@/formguide/rig/paint');
    const { poseAt } = await import('@/formguide/sample');
    const { lib_dumbbell_lateral_raise: LR } = await import('@/formguide/exercises/lib_dumbbell_lateral_raise');
    const [x, y, w, h] = VIEWBOXES.standingFront, rig = rigFor(LR, 'front');
    if (typeof rig === 'string') throw new Error(rig);
    for (const [fig, reps] of [['correct', [0, 1, 2]], ['mistake', [0]]] as const) {
      const c = compile(rig.markup(themeReader('silent-black'), fig === 'mistake'));
      let m = Infinity;
      for (const rep of reps) for (let i = 0; i <= 480; i++) {
        const b = bbox(c, rig.frame(poseAt(LR, i / 480, fig, rep)));
        m = Math.min(m, b.x0 - x, b.y0 - y, x + w - b.x1, y + h - b.y1);
      }
      console.info(`[FG-3] ${fig}: least margin to the standingFront frame ${m.toFixed(2)} units`);
      expect(m).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('helpers', () => {
  it('a lever anchor runs on its arc and a slide end on its segment; travel past the ends leaves the path', () => {
    const L: Lever = { kind: 'lever', pivot: [0, 0], bound: 'shoulder_r', radius: 10, deg: [0, 90] };
    expect(anchorAt(L, 0).map(v => +v.toFixed(9))).toEqual([0, 10]);
    expect(anchorAt(L, 1).map(v => +v.toFixed(9))).toEqual([10, 0]);
    expect(offPath(L, anchorAt(L, 0.5))).toBeCloseTo(0, 9);
    expect(offPath(L, anchorAt(L, 1.5))).toBeGreaterThan(5);
    const S = { kind: 'cable' as const, path: [[0, 0], [0, 10]] as [[number, number], [number, number]] };
    expect(offPath(S, anchorAt(S, 0.3))).toBeCloseTo(0, 9);
    expect(offPath(S, anchorAt(S, 1.2))).toBeCloseTo(2, 9);
  });
  it('the box of a curve is its true extent, not its control points', () => {
    const c = compile('<g><path d="M0 0 C0 10 10 10 10 0 Z"/></g>'), b = bbox(c, {});
    expect([b.x0, b.y0, b.x1, +b.y1.toFixed(9)]).toEqual([0, 0, 10, 7.5]);
    expect(pathSegs('m1 1 h2 v2 l-2 0 z').length).toBe(4);
    const r = compile('<g transform="rotate(90)"><rect x="0" y="0" width="4" height="2"/></g>'), rb = bbox(r, {});
    expect([rb.x0, rb.y0, rb.x1, rb.y1].map(v => +v.toFixed(9))).toEqual([-2, 0, 0, 4]);
  });
});

describe('A3 targetVisible census over the library (§3 overlays, pattern-to-view table)', () => {
  const lib = library as LibraryRow[];
  it('with the pattern views alone, four targets on three exercises are hidden', () => {
    const hidden = hiddenTargets(lib);
    console.info(`[FG-3] census, pattern views: ${lib.length} exercises, ${lib.reduce((n, e) => n + e.primary.length, 0)} targets, ${hidden.length} hidden: ${hidden.join('; ')}`);
    expect(hidden).toEqual([
      'lib_cable_external_rotation: rotator_cuff (front)', 'lib_sumo_deadlift: adductors (side)',
      'lib_hip_abduction: glutes (front)', 'lib_hip_abduction: abductors (front)',
    ]);
  });
  it('with the three recorded view overrides (D-FG3), zero targets are hidden', () => {
    const hidden = hiddenTargets(lib, CENSUS_VIEW_OVERRIDES);
    console.info(`[FG-3] census with overrides: ${hidden.length} hidden`);
    expect(hidden).toEqual([]);
    for (const [id, o] of Object.entries(CENSUS_VIEW_OVERRIDES)) for (const m of lib.find(e => e.id === id)!.primary) expect(hasOverlay(o.view, m as never), `${id} ${m}`).toBe(true);
    expect(OVERLAYS.back).toContain('adductors');
  });
});

describe('A4 npm run fg:check', () => {
  const run = (...args: string[]) => spawnSync('npm', ['run', '-s', 'fg:check', ...args], { encoding: 'utf8' });
  it('prints pass or fail per check for the lateral raise', () => {
    const r = run('lib_dumbbell_lateral_raise');
    for (const c of CHECKS) expect(r.stdout).toMatch(new RegExp(`^(PASS|FAIL) ${c}\\b`, 'm'));
    expect(r.stdout).toMatch(/all 20 checks passed/);
    expect(r.status).toBe(0);
  }, 30_000);
  it('exits non-zero on a bad file and prints its failing numbers', () => {
    const bad = run(`${BAD}/jointRanges/lib_dumbbell_lateral_raise.ts`);
    expect(bad.status).toBe(1);
    expect(bad.stdout).toMatch(/^FAIL jointRanges$/m);
    expect(bad.stdout).toMatch(/jointRanges lib_dumbbell_lateral_raise: correct figure knee_flex_[lr] = 12 outside the coaching range 0..10 \(research.json\) at u=0 \(0 s, rep 0\)/);
    expect(run('lib_nothing').status).toBe(2);
  }, 30_000);
});

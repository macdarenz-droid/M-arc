// V1-06: the side view wired into the checks and the player (docs/FORM-GUIDE-PRODUCTION.md §10.5 V1-06). A1 FG-6's side
// fixtures through the real rigFor, A2 a side file mounts and says "Side view", A3 solveSideLeg, A4 the camera table,
// A5 the lateral raise unchanged, F1 a back file fails with the stub's reason. No module is mocked for A1: the player
// mount (A2) mocks preact's hooks with vi.doMock inside its own test, after the checks have run.
import { describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { THEME_IDS } from '@/theme/themes';
import type { Pose } from '@/formguide/rig/joints';
import { FLOOR, figureFront } from '@/formguide/rig/figureFront';
import { figureSide } from '@/formguide/rig/figureSide';
import { BACK_REASON } from '@/formguide/rig/figureBack';
import { themeReader } from '@/formguide/rig/paint';
import { frontFrame, sideFrame, sideHandAt, sidePivot, sidePoint, solveSideLeg, type Frame, type SidePoseId } from '@/formguide/rig/pose';
import { bbox, compile, type Box, type Compiled } from '@/formguide/check/svg';
import { CHECKS, runChecks, report } from '@/formguide/check';
import { guideOf, inputFor } from '@/formguide/check/node';
import { rigFor, viewOf } from '@/formguide/check/view';
import { VIEWBOXES, type ExerciseGuide, type ViewBoxId } from '@/formguide/model';
import { cameraOf, chainedGroups, guideRig, markupOf, momentFrame, momentsOf } from '@/formguide/player/guideView';
import { lib_dumbbell_lateral_raise as LR } from '@/formguide/exercises/lib_dumbbell_lateral_raise';
import library from '@/data/exercises.json';
import { STILLS } from './sideGallery';

const SB = themeReader('silent-black');
const FIX = ['lib_barbell_bench_press', 'lib_superman'] as const;
const patternOf = (id: string) => (library as { id: string; pattern?: string }[]).find(e => e.id === id)?.pattern;
const fixture = async (id: string) => {
  const path = `tests/formguide/fixtures/side/${id}/${id}.ts`;
  return { path, g: guideOf(await import(`./fixtures/side/${id}/${id}.ts`), path) };
};

describe('A1 FG-6 side fixtures pass every check through the real rigFor', () => {
  it.each(FIX)('%s', async id => {
    const { path, g } = await fixture(id), rig = rigFor(g, viewOf(g, patternOf(id)));
    expect(typeof rig === 'string' ? rig : rig.view).toBe('side');
    const rs = runChecks(inputFor(path, g));
    console.info(report(id, rs));
    expect(rs.map(r => r.check)).toEqual([...CHECKS]);
    expect(rs.filter(r => !r.ok).flatMap(r => r.fails)).toEqual([]);
  });
});

describe('F1 a back file fails with the stub reason, not a crash', () => {
  const back: ExerciseGuide = { ...LR, view: 'back', viewWhy: 'V1-06 F1: the back view stub' };
  it('every figure check fails naming the reason; the player refuses it with the same reason', () => {
    expect(rigFor(back, 'back')).toBe(BACK_REASON);
    const rs = runChecks(inputFor('src/formguide/exercises/lib_dumbbell_lateral_raise.ts', back));
    const failed = rs.filter(r => !r.ok);
    for (const c of ['everyPoseRenders', 'themes', 'pathBudget', 'mistakeSane'] as const) {
      expect(failed.find(r => r.check === c)?.fails.join(' '), c).toContain(BACK_REASON);
    }
    expect(() => guideRig(back, undefined)).toThrow(`form guide ${LR.id}: ${BACK_REASON}`);
  });
});

describe('A3 solveSideLeg', () => {
  const both = (b: string, v: number): Pose => ({ [`${b}_l`]: v, [`${b}_r`]: v }) as Pose;
  // a small fixed-seed generator, so the sweep is the same on every run
  let seed = 7;
  const rnd = (a: number, b: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + ((b - a) * seed) / 2147483648; };
  const cases: { id: SidePoseId; s: 'l' | 'r'; mirror: boolean; base: Pose }[] = [];
  for (const mirror of [false, true]) {
    for (const s of ['l', 'r'] as const) cases.push({ id: 'lying_supine', s, mirror, base: {} }, { id: 'lying_prone', s, mirror, base: {} });
    // the leg the support does not place the pelvis from: the far one
    cases.push({ id: 'seated', s: mirror ? 'r' : 'l', mirror, base: {} }, { id: 'standing', s: mirror ? 'r' : 'l', mirror, base: {} });
  }
  it('puts the sole on a reachable target within 1e-6 units, knee bent the natural way (0..180), the rest of the pose kept', () => {
    let worst = 0, n = 0;
    for (const c of cases) for (let k = 0; k < 25; k++) {
      const hf = rnd(-30, 120), kf = rnd(0, 135), af = rnd(-50, 20), o = { mirror: c.mirror };
      const pose: Pose = { ...c.base, [`ankle_flex_${c.s}`]: af, torso_lean: rnd(-20, 10) };
      const target = sidePoint(sideFrame(c.id, { ...pose, [`hip_flex_${c.s}`]: hf, [`knee_flex_${c.s}`]: kf }, o), `foot_${c.s}`, c.mirror);
      // started from a nearby pose, as a driven path would be
      const r = solveSideLeg(c.id, { ...pose, [`hip_flex_${c.s}`]: hf + rnd(-5, 5), [`knee_flex_${c.s}`]: kf + rnd(-5, 5) }, c.s, target, o);
      const at = sidePoint(sideFrame(c.id, { ...pose, [`hip_flex_${c.s}`]: r.hip_flex, [`knee_flex_${c.s}`]: r.knee_flex }, o), `foot_${c.s}`, c.mirror);
      const miss = Math.hypot(at[0] - target[0], at[1] - target[1]);
      worst = Math.max(worst, miss); n++;
      expect(miss, `${c.id} ${c.s} mirror=${c.mirror}`).toBeLessThanOrEqual(1e-6);
      expect(r.knee_flex).toBeGreaterThanOrEqual(0);
      expect(r.knee_flex).toBeLessThanOrEqual(180);
      // started on the target's own angles it stays there (no jump to the other bend)
      const same = solveSideLeg(c.id, { ...pose, [`hip_flex_${c.s}`]: hf, [`knee_flex_${c.s}`]: kf }, c.s, target, o);
      expect(Math.abs(same.knee_flex - kf) + Math.abs(same.hip_flex - hf), `${c.id} ${c.s}`).toBeLessThan(1e-6);
    }
    console.info(`[V1-06 A3] ${n} targets, worst sole miss ${worst.toExponential(2)} units`);
  });
  it('throws when the target is out of reach, too near the hip, or where the support will not let the pelvis follow', () => {
    const hip = sidePivot(sideFrame('lying_supine', {}), 'hip_r');
    expect(() => solveSideLeg('lying_supine', {}, 'r', [hip[0] + 600, hip[1]])).toThrow(/outside the leg's reach/);
    // a target on the hip pivot is nearer than the folded leg reaches
    const hp = sidePivot(sideFrame('lying_prone', {}), 'hip_l');
    expect(() => solveSideLeg('lying_prone', {}, 'l', hp)).toThrow(/outside the leg's reach/);
    // standing: the near sole is the pelvis's anchor, so it cannot be sent anywhere else
    const sole = sidePoint(sideFrame('standing', {}), 'foot_r');
    expect(() => solveSideLeg('standing', both('knee_flex', 0), 'r', [sole[0] + 60, sole[1] - 80])).toThrow(/support moves the pelvis/);
  });
});

// ---- A4: the camera table ----------------------------------------------------------------------------------------------
type Shot = { name: string; frame: Frame; mirror: boolean; /** extra points that must be inside (a bar the hands hold) */ pts?: [number, number][]; dy?: number };
type Cam = { id: ViewBoxId; view: 'side' | 'front'; zoom: boolean; subject?: (mirror: boolean) => string; shots: Shot[] };
const sym = (p: Record<string, number>): Pose => Object.fromEntries(Object.entries(p).flatMap(([k, v]) => (['torso_lean', 'sway', 'breath'].includes(k) ? [[k, v]] : [[`${k}_l`, v], [`${k}_r`, v]]))) as Pose;
const FACINGS = [false, true];
/** The pose at rest and at each range end, in both facings (side), as one channel set per entry (both sides). */
const shots = (id: SidePoseId, ends: Record<string, number>[], surface?: number): Shot[] =>
  FACINGS.flatMap(mirror => [{}, ...ends].map(p => ({ name: `${id}${surface ? ' on a bench' : ''} ${JSON.stringify(p)}${mirror ? ' mirrored' : ''}`, frame: sideFrame(id, sym(p), { mirror, surface }), mirror })));
const BAR_Y = FLOOR - 2.3 * 303;   // the pull-up bar at 2.3 m (COACHING-DECISIONS.md:489), 303 units per metre
/** Hanging stand-in until V1-11 draws the hanging pose: the straight-legged seated frame (no stance-leg pitch), arms
 * overhead, moved up so the grip is on the bar. */
const hanging = (p: Record<string, number>, mirror: boolean): Shot => {
  const f = sideFrame('seated', sym({ hip_flex: 0, knee_flex: 0, shoulder_flex: 180, ...p }), { mirror }), h = sideHandAt(f, mirror ? 'l' : 'r', mirror);
  return { name: `hanging ${JSON.stringify(p)}${mirror ? ' mirrored' : ''}`, frame: f, mirror, dy: BAR_Y - h[1], pts: [[h[0], BAR_Y - 12], [h[0], BAR_Y + 12]] };
};
const still = (names: string[]): Shot[] => STILLS.map(s => s()).filter(s => names.some(n => s.name.startsWith(n))).map(s => ({ name: `FG-6 still: ${s.name}`, frame: s.frame, mirror: !!s.o.mirror }));
const front = (id: 'standing' | 'seated', ends: Record<string, number>[]): Shot[] => [{}, ...ends].map(p => ({ name: `front ${id} ${JSON.stringify(p)}`, frame: frontFrame(id, sym(p)), mirror: false }));

const CAMERAS: Cam[] = [
  { id: 'standingSide', view: 'side', zoom: false, shots: [
    ...shots('standing', [{ shoulder_flex: -60 }, { shoulder_flex: 90 }, { elbow_flex: 150 }, { shoulder_flex: 30, elbow_flex: 150 }, { torso_lean: -80 }, { torso_lean: 25 },
      { hip_flex: 120, knee_flex: 20 }, { hip_flex: 120, knee_flex: 120, ankle_flex: 38, torso_lean: -40 }, { sway: 1.5 }, { sway: -1.5 }, { shrug_cm: 5 }]),
    ...still(['back squat', 'standing'])] },
  { id: 'seatedSide', view: 'side', zoom: false, shots: shots('seated', [{ shoulder_flex: -60 }, { shoulder_flex: 180 }, { elbow_flex: 150 }, { torso_lean: -80 }, { torso_lean: 25 }, { ankle_flex: 20 }]) },
  { id: 'lyingSide', view: 'side', zoom: false, shots: [
    ...shots('lying_supine', [{ shoulder_flex: 90 }, { shoulder_flex: 180 }, { shoulder_flex: 90, elbow_flex: 150 }, { hip_flex: 90, knee_flex: 90 }, { hip_flex: 120 }, { torso_lean: -30 }]),
    ...shots('lying_supine', [{ shoulder_flex: 90 }, { hip_flex: 120 }], FLOOR - 0.44 * 303),
    ...shots('lying_prone', [{ shoulder_flex: 180 }, { hip_flex: -30 }, { torso_lean: 25 }, { shoulder_flex: 180, hip_flex: -30, torso_lean: 25 }]),
    ...still(['bench press', 'prone'])] },
  { id: 'hangingSide', view: 'side', zoom: false, shots: FACINGS.flatMap(m => ([{}, { hip_flex: 90, knee_flex: 90 }, { hip_flex: 90 }, { hip_flex: 120 }] as Record<string, number>[]).map(p => hanging(p, m))) },
  { id: 'ankleSide', view: 'side', zoom: true, subject: m => (m ? 'knee_l' : 'knee_r'), shots: shots('seated', [{ ankle_flex: -50 }, { ankle_flex: 20 }]) },
  { id: 'gripFront', view: 'front', zoom: true, subject: () => 'hands', shots: front('standing', [{ wrist_pron: 80 }, { wrist_pron: -80 }, { shrug_cm: 5 }, { scap_depress_cm: 5 }]) },
  // the back figure is V1-22's; until then the front figure, which it shares its outline with, stands in
  { id: 'backFull', view: 'front', zoom: false, shots: [...front('standing', [{ shoulder_abd: 90 }, { sway: 1.5 }, { sway: -1.5 }]), ...front('seated', [{ shoulder_abd: 90 }])] },
];

const under = (c: Compiled, keys: string[]): Compiled => ({ nodes: c.nodes, shapes: c.shapes.filter(s => { for (let n = s.node; n >= 0; n = c.nodes[n]!.parent) if (keys.includes(c.nodes[n]!.key ?? '')) return true; return false; }) });
const SUBJECT: Record<string, string[]> = { hands: ['wrist_r', 'wrist_l', 'eq_r', 'eq_l', 'eqf_r', 'eqf_l'] };
/** Distance from the box's nearest edge to the figure (negative: the figure is cut). */
const margin = (b: Box, v: readonly number[]) => Math.min(b.x0 - v[0]!, b.y0 - v[1]!, v[0]! + v[2]! - b.x1, v[1]! + v[3]! - b.y1);

describe('A4 every camera holds its pose\'s figure at least 1 unit inside, at rest and at the range ends, both facings', () => {
  const figs = new Map<string, Compiled>();
  const figOf = (view: 'side' | 'front', mirror: boolean) => {
    const k = `${view}${mirror}`;
    if (!figs.has(k)) figs.set(k, compile(view === 'side' ? figureSide(SB, { id: 'a4', mirror }) : figureFront(SB, { id: 'a4', dumbbell: { kg: 10 } })));
    return figs.get(k)!;
  };
  it.each(CAMERAS.map(c => [c.id, c] as const))('%s', (_id, cam) => {
    let low = { m: Infinity, name: '' };
    for (const s of cam.shots) {
      const c = figOf(cam.view, s.mirror), part = cam.subject ? under(c, SUBJECT[cam.subject(s.mirror)] ?? [cam.subject(s.mirror)]) : c;
      expect(part.shapes.length, `${cam.id} ${s.name}: subject draws nothing`).toBeGreaterThan(0);
      const b0 = bbox(part, s.frame), dy = s.dy ?? 0;
      const b: Box = { x0: b0.x0, y0: b0.y0 + dy, x1: b0.x1, y1: b0.y1 + dy };
      for (const [x, y] of s.pts ?? []) { b.x0 = Math.min(b.x0, x); b.x1 = Math.max(b.x1, x); b.y0 = Math.min(b.y0, y); b.y1 = Math.max(b.y1, y); }
      // the box the player shows: cameraOf, which reflects a zoom for a mirrored file
      const g = { camera: { full: cam.id, zoom: cam.id, subject: 'pelvis' }, mirror: s.mirror } as unknown as ExerciseGuide;
      const m = margin(b, cameraOf(g, cam.zoom, false).box);
      if (m < low.m) low = { m, name: s.name };
      expect(m, `${cam.id} ${s.name}: box ${[b.x0, b.y0, b.x1, b.y1].map(v => v.toFixed(1)).join(',')}`).toBeGreaterThanOrEqual(1);
    }
    console.info(`[V1-06 A4] ${cam.id} [${VIEWBOXES[cam.id].join(' ')}]: ${cam.shots.length} poses, tightest ${low.m.toFixed(1)} units (${low.name})`);
  });
  it('the full side cameras are centred on x = 200 (the checks read VIEWBOXES unreflected) and keep standingFront\'s height, bar hangingSide', () => {
    for (const c of CAMERAS.filter(x => !x.zoom)) {
      const [x, , w, h] = VIEWBOXES[c.id];
      expect(x + w / 2, c.id).toBe(200);
      if (c.id !== 'hangingSide') expect(h, c.id).toBe(VIEWBOXES.standingFront[3]);
      // height-bound on the 358:276 stage, so the figure draws at standingFront's size
      expect(w / h, c.id).toBeLessThanOrEqual(358 / 276);
    }
    for (const c of CAMERAS.filter(x => x.zoom)) expect(VIEWBOXES[c.id].slice(2), c.id).toEqual(VIEWBOXES.upperFront.slice(2));
  });
});

describe('A5 the lateral raise is byte-identical', () => {
  it('markup (every theme, both figures), chained keyframes, moment frames and cameras hash as on the base commit ed221a0', () => {
    const rig = guideRig(LR, 'shoulder_abduction'), out: unknown[] = [];
    for (const id of THEME_IDS) for (const mistake of [false, true]) {
      const fig = mistake ? 'mistake' : 'correct', m = markupOf(LR, rig, themeReader(id), { id: 't', mistake, load: 9 });
      out.push(m, chainedGroups(LR, rig, fig, m), momentsOf(LR, fig).map(u => momentFrame(LR, rig, fig, u, m)));
    }
    for (const z of [false, true]) for (const c of [false, true]) out.push(cameraOf(LR, z, c));
    expect(createHash('sha256').update(JSON.stringify(out)).digest('hex')).toBe('b29fed33a75525c1d5c047a0be675fa746b65728bad51b1896e1d90886e97ae7');
  });
});

describe('A2 a side file mounts in the player and shows "Side view"', () => {
  it('ExercisePlayer renders the bench press fixture: side markup mounted, its groups animated, the label "Side view"', async () => {
    const { g } = await fixture('lib_barbell_bench_press');
    const read = themeReader('silent-black'), animated: string[] = [];
    const el = {
      innerHTML: '', firstChild: null, cancel: () => {},
      querySelectorAll: (sel: string) => [{ animate: () => { animated.push(sel); return { pause: () => {} }; } }],
    };
    vi.resetModules();
    vi.doMock('preact/hooks', () => ({
      useMemo: (f: () => unknown) => f(), useEffect: () => {}, useLayoutEffect: (f: () => void) => { f(); },
      useState: (i: unknown) => [typeof i === 'function' ? (i as () => unknown)() : i, () => {}],
      useRef: (i: unknown) => ({ current: i ?? el }),
    }));
    vi.doMock('@/ui/motion', () => ({ reduced: () => false, onReducedChange: () => () => {} }));
    vi.stubGlobal('document', { documentElement: { getAttribute: () => 'silent-black' } });
    vi.stubGlobal('getComputedStyle', () => ({ getPropertyValue: (p: string) => read(p.slice(2) as Parameters<typeof read>[0]) }));
    try {
      const { ExercisePlayer } = await import('@/formguide/player/ExercisePlayer');
      const { guideRig: rigOf } = await import('@/formguide/player/guideView');
      const vnode = ExercisePlayer({ guide: g, rig: rigOf(g, patternOf(g.id)), name: 'Bench press', load: null });
      const texts = (n: unknown): string[] => {
        if (n == null || typeof n === 'boolean') return [];
        if (typeof n === 'string' || typeof n === 'number') return [String(n)];
        if (Array.isArray(n)) return n.flatMap(texts);
        const v = n as { props?: { children?: unknown; class?: string } };
        return v.props?.class === 'cam-label' ? [`cam-label:${texts(v.props.children).join('')}`] : texts(v.props?.children);
      };
      expect(texts(vnode)).toContain('cam-label:Side view');
      expect(el.innerHTML).toContain('fg-side');
      expect(animated).toContain('.j-shoulder_r');
      expect(animated).toContain('.j-pelvis');
    } finally {
      vi.unstubAllGlobals();
      vi.doUnmock('preact/hooks');
      vi.doUnmock('@/ui/motion');
    }
  });
});

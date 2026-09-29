// V1-06: the side view wired into the checks and the player (docs/FORM-GUIDE-PRODUCTION.md §10.5 V1-06). A1 FG-6's side
// fixtures through the real rigFor, A2 a side file mounts and says "Side view", A3 solveSideLeg, A4 the camera table,
// A5 the lateral raise unchanged, A6 the side hand parts, F1 a back file fails with the stub's reason. No module is mocked for A1: the player
// mount (A2) mocks preact's hooks with vi.doMock inside its own test, after the checks have run.
import { describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { THEME_IDS } from '@/theme/themes';
import type { Pose } from '@/formguide/rig/joints';
import { FLOOR, figureFront } from '@/formguide/rig/figureFront';
import { figureSide, type Held } from '@/formguide/rig/figureSide';
import { BACK_REASON } from '@/formguide/rig/figureBack';
import { themeReader } from '@/formguide/rig/paint';
import { frontFrame, sideFrame, sideHandAt, sidePivot, sidePoint, solveSideLeg, type Frame, type SidePoseId } from '@/formguide/rig/pose';
import { bbox, colourLiterals, compile, countPaths, type Box, type Compiled } from '@/formguide/check/svg';
import { shapeCount } from '@/formguide/parts/kit';
import { CHECKS, runChecks, report } from '@/formguide/check';
import { guideOf, inputFor } from '@/formguide/check/node';
import { heldOf, rigFor, viewOf } from '@/formguide/check/view';
import { VIEWBOXES, type ExerciseGuide, type ViewBoxId } from '@/formguide/model';
import { cameraOf, chainedGroups, guideRig, markupOf, momentFrame, momentsOf } from '@/formguide/player/guideView';
import { snapshotSvg } from '@/formguide/snapshot';
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
  // V1-07 (D-V1-07b/c) changed the look, not the motion: the moving half (every transform keyframe, the moment frames'
  // transforms, the cameras) hashes as on origin/main eb1ed6d, recomputed there with this same split; the look half (the
  // markup, and the tint and band opacity keyframes and moment values) is pinned to the V1-07 drawing.
  it('markup (every theme, both figures), chained keyframes, moment frames and cameras: motion as on eb1ed6d, look as V1-07 drew it', () => {
    const rig = guideRig(LR, 'shoulder_abduction'), moves: unknown[] = [], looks: unknown[] = [];
    const overlay = (k: string) => /^(fg-)?[tb]-/.test(k);
    for (const id of THEME_IDS) for (const mistake of [false, true]) {
      const fig = mistake ? 'mistake' : 'correct', m = markupOf(LR, rig, themeReader(id), { id: 't', mistake, load: 9 });
      const groups = chainedGroups(LR, rig, fig, m), frames = momentsOf(LR, fig).map(u => momentFrame(LR, rig, fig, u, m));
      moves.push(groups.filter(g => !overlay(g.className)), frames.map(f => Object.fromEntries(Object.entries(f).filter(([k]) => !overlay(k)))));
      looks.push(m, groups.filter(g => overlay(g.className)), frames.map(f => Object.fromEntries(Object.entries(f).filter(([k]) => overlay(k)))));
    }
    for (const z of [false, true]) for (const c of [false, true]) moves.push(cameraOf(LR, z, c));
    const h = (x: unknown) => createHash('sha256').update(JSON.stringify(x)).digest('hex');
    expect(h(moves)).toBe('3c11056c6957e2751314ebf27c7a5c7e6f83520e3c143ff7875178727882722b');
    expect(h(looks)).toBe('cfd3fc8ead4cdd833dadf72e5019b06e0ec30f00d439a53aa6549848d1f74fba');
  });
});

/** Mounts ExercisePlayer in node: preact's hooks run inline (layout effects once), the DOM is a stub. `reduced` on sends
 * the player down the Pictures path (controller.ts initial: mode 'pics'), whose tiles are snapshotSvg data URIs. */
async function mountPlayer(g: ExerciseGuide, reduced: boolean) {
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
  vi.doMock('@/ui/motion', () => ({ reduced: () => reduced, onReducedChange: () => () => {} }));
  vi.stubGlobal('document', { documentElement: { getAttribute: () => 'silent-black' } });
  vi.stubGlobal('getComputedStyle', () => ({ getPropertyValue: (p: string) => read(p.slice(2) as Parameters<typeof read>[0]) }));
  try {
    const { ExercisePlayer } = await import('@/formguide/player/ExercisePlayer');
    const { guideRig: rigOf } = await import('@/formguide/player/guideView');
    const vnode = ExercisePlayer({ guide: g, rig: rigOf(g, patternOf(g.id)), name: 'Bench press', load: null });
    const texts: string[] = [], imgs: string[] = [];
    const walk = (n: unknown): void => {
      if (n == null || typeof n === 'boolean') return;
      if (typeof n === 'string' || typeof n === 'number') { texts.push(String(n)); return; }
      if (Array.isArray(n)) { n.forEach(walk); return; }
      const v = n as { type?: unknown; props?: { children?: unknown; class?: string; src?: string } };
      if (v.type === 'img' && v.props?.src) imgs.push(v.props.src);
      if (v.props?.class === 'cam-label') { const t: string[] = []; const w = (c: unknown): void => { if (typeof c === 'string' || typeof c === 'number') t.push(String(c)); else if (Array.isArray(c)) c.forEach(w); }; w(v.props.children); texts.push(`cam-label:${t.join('')}`); return; }
      walk(v.props?.children);
    };
    walk(vnode);
    return { texts, imgs, el, animated };
  } finally {
    vi.unstubAllGlobals();
    vi.doUnmock('preact/hooks');
    vi.doUnmock('@/ui/motion');
  }
}

describe('A2 a side file mounts in the player and shows "Side view"', () => {
  it('ExercisePlayer renders the bench press fixture: side markup mounted, its groups animated, the label "Side view"', async () => {
    const { g } = await fixture('lib_barbell_bench_press');
    const { texts, el, animated } = await mountPlayer(g, false);
    expect(texts).toContain('cam-label:Side view');
    expect(el.innerHTML).toContain('fg-side');
    expect(animated).toContain('.j-shoulder_r');
    expect(animated).toContain('.j-pelvis');
  });
  it('B1: under reduced motion (the Pictures path) it renders the four side moments as images, every colour resolved', async () => {
    const { g } = await fixture('lib_barbell_bench_press');
    const { imgs, el } = await mountPlayer(g, true);
    expect(el.innerHTML).toContain('fg-side');
    expect(imgs).toHaveLength(4);
    for (const src of imgs) {
      const svg = decodeURIComponent(src.replace(/^data:image\/svg\+xml;charset=utf-8,/, ''));
      expect(svg).toContain('fg-side');
      expect(svg).not.toContain('var(');
    }
  });
});

describe('B1 a side moment snapshots with every colour resolved', () => {
  it.each(FIX)('%s: both facings, both figures, Silent Black and Paper', async id => {
    const { g: g0 } = await fixture(id);
    for (const mirror of [false, true]) for (const theme of ['silent-black', 'paper'] as const) for (const mistake of [false, true]) {
      const g = { ...g0, mirror }, rig = guideRig(g, patternOf(id)), read = themeReader(theme), fig = mistake ? 'mistake' : 'correct';
      const m = markupOf(g, rig, read, { id: 'snap', mistake, load: null });
      for (const u of momentsOf(g, fig)) {
        const svg = snapshotSvg(m, momentFrame(g, rig, fig, u, m), read, cameraOf(g, false, false).box);
        expect(svg, `${id} mirror=${mirror} ${theme} ${fig} u=${u}`).not.toContain('var(');
      }
    }
  });
});
describe('A6 the side hand draws the dumbbell and the end-on barbell', () => {
  const HELD: Held[] = [{ kind: 'dumbbell' }, { kind: 'barbell', kg: 0 }, { kind: 'barbell', kg: 60 }, { kind: 'barbell', kg: 500 }];
  it('each part is at most 25 shapes (paths included) in every theme, both figures, both facings', () => {
    for (const id of THEME_IDS) for (const mistake of [false, true]) for (const mirror of [false, true]) {
      const r = themeReader(id), bare = figureSide(r, { id: 'a6', mistake, mirror });
      for (const held of HELD) {
        const svg = figureSide(r, { id: 'a6', mistake, mirror, held }), n = shapeCount(svg) - shapeCount(bare);
        expect(n, `${id} ${JSON.stringify(held)}`).toBeGreaterThan(0);
        expect(n, `${id} ${JSON.stringify(held)}`).toBeLessThanOrEqual(25);
        expect(countPaths(svg) - countPaths(bare)).toBeLessThanOrEqual(25);
        if (id === 'silent-black' && !mistake && !mirror) console.info(`[V1-06 A6] ${JSON.stringify(held)}: ${n} shapes`);
      }
    }
  });
  it('token-only: no colour literal in the part markup, its gradient defined, every var() a theme or figure token', () => {
    for (const id of THEME_IDS) for (const held of HELD) {
      const r = themeReader(id), svg = figureSide(r, { id: 'a6', held }), bare = figureSide(r, { id: 'a6' });
      const extra = svg.replace(/<defs>[\s\S]*?<\/defs>/, '');
      expect(colourLiterals(extra).length - colourLiterals(bare.replace(/<defs>[\s\S]*?<\/defs>/, '')).length, `${id}`).toBe(0);
      expect(svg).toContain('id="a6-i"');
      const ids = new Set([...svg.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]!));
      expect([...svg.matchAll(/url\(#([^)]+)\)/g)].map(m => m[1]!).filter(x => !ids.has(x))).toEqual([]);
    }
  });
  it('the dumbbell is in both hands, the bar at the near hand only; each sits on the grip and moves with it', () => {
    const count = (svg: string, re: RegExp) => (svg.match(re) ?? []).length;
    for (const mirror of [false, true]) {
      const near = mirror ? 'wrist_l' : 'wrist_r', far = mirror ? 'wrist_r' : 'wrist_l';
      const db = compile(figureSide(SB, { id: 'a6', mirror, held: { kind: 'dumbbell' } })), bar = compile(figureSide(SB, { id: 'a6', mirror, held: { kind: 'barbell', kg: 60 } }));
      const bare = compile(figureSide(SB, { id: 'a6', mirror }));
      for (const w of [near, far]) expect(under(db, [w]).shapes.length, `dumbbell ${w}`).toBeGreaterThan(under(bare, [w]).shapes.length);
      expect(under(bar, [near]).shapes.length).toBeGreaterThan(under(bare, [near]).shapes.length);
      expect(under(bar, [far]).shapes.length).toBe(under(bare, [far]).shapes.length);
      expect(count(figureSide(SB, { id: 'a6', mirror, held: { kind: 'barbell', kg: 60 } }), /fg-part-barbell/g)).toBe(1);
      // the part is centred on the grip point the solver and the checks use, at rest and in a curl
      for (const p of [{}, sym({ elbow_flex: 130, shoulder_flex: 20 })]) {
        const f = sideFrame('standing', p, { mirror }), grip = sideHandAt(f, mirror ? 'l' : 'r', mirror);
        const onlyBar: Compiled = { nodes: bar.nodes, shapes: bar.shapes.filter(sh => !bare.shapes.some(b => b.node === sh.node && JSON.stringify(b.segs) === JSON.stringify(sh.segs))) };
        const b = bbox(onlyBar, f);
        expect(Math.abs((b.x0 + b.x1) / 2 - grip[0]) + Math.abs((b.y0 + b.y1) / 2 - grip[1]), `mirror=${mirror}`).toBeLessThan(0.01);   // disc outlines are cubic, so their box centre is within 0.002
      }
    }
  });
  it('the rig and the player draw the file\'s part: a dumbbell or a hand-held bar, not a bar on the back or no part', async () => {
    const { g } = await fixture('lib_barbell_bench_press');
    expect(heldOf(g)).toEqual({ kind: 'barbell', kg: undefined });
    expect(heldOf({ ...g, equipment: { ...g.equipment, attach: ['shoulder_l', 'shoulder_r'] } })).toBeUndefined();
    expect(heldOf({ ...g, equipment: { kind: 'dumbbell', attach: ['hand_l', 'hand_r'], loadFrom: 'lastSet', kg: 12 } })).toEqual({ kind: 'dumbbell', kg: 12 });
    expect(heldOf({ ...g, equipment: { kind: 'none', attach: [], loadFrom: 'bodyweight' } })).toBeUndefined();
    const rig = rigFor(g, 'side');
    if (typeof rig === 'string') throw new Error(rig);
    expect(rig.markup(SB, false, true)).toContain('fg-part-barbell');
    expect(rig.markup(SB, false, false)).not.toContain('fg-part-barbell');
    expect(markupOf(g, rig, SB, { id: 'p', mistake: false, load: 60 })).toContain('fg-part-barbell');
  });
  it('a standing dumbbell side file passes themes, pathBudget and noFilters with the part in hand', () => {
    const curl: ExerciseGuide = { ...LR, view: 'side', viewWhy: 'V1-06 A6: a side dumbbell file', joints: { elbow_flex: [5, 125] }, mistake: { ...LR.mistake, joints: { elbow_flex: [0, 10] }, tells: LR.mistake.tells.map(t => ({ ...t, joint: 'elbow_flex' })) } } as ExerciseGuide;
    const rs = runChecks(inputFor('src/formguide/exercises/lib_dumbbell_lateral_raise.ts', curl), ['themes', 'pathBudget', 'noFilters']);
    console.info(report('side dumbbell stand-in', rs));
    expect(rs.filter(r => !r.ok).flatMap(r => r.fails)).toEqual([]);
    const rig = rigFor(curl, 'side');
    if (typeof rig === 'string') throw new Error(rig);
    expect(shapeCount(rig.markup(SB, false, true)) - shapeCount(rig.markup(SB, false, false))).toBeGreaterThan(0);
  });
});

describe('A3 the side chain: the side rig seeds the V1-04 solver with solveSideArm and solveSideLeg', () => {
  it('hand and foot targets come back as the two channels that reach them; an unreachable foot or another point gives null', async () => {
    for (const id of FIX) {
      const { g } = await fixture(id), rig = rigFor(g, 'side');
      if (typeof rig === 'string') throw new Error(rig);
      expect(rig.machine).toBeNull();
      const base = rig.frame({} as Parameters<typeof rig.frame>[0]);
      for (const s of ['l', 'r'] as const) {
        // reachable targets: where another pose puts the hand and the foot
        const moved = rig.frame({ [`shoulder_flex_${s}`]: 60, [`elbow_flex_${s}`]: 50, [`hip_flex_${s}`]: 40, [`knee_flex_${s}`]: 60 } as Parameters<typeof rig.frame>[0]);
        const foot = rig.point(base, `foot_${s}`);
        for (const [a, t] of [[`hand_${s}`, rig.point(moved, `hand_${s}`)], [`foot_${s}`, rig.point(moved, `foot_${s}`)]] as const) {
          const x = rig.chain!({} as Parameters<typeof rig.frame>[0], a, t as [number, number]);
          expect(x, `${id} ${a}`).not.toBeNull();
          const at = rig.point(rig.frame(x as Parameters<typeof rig.frame>[0]), a);
          expect(Math.hypot(at[0] - t[0], at[1] - t[1]), `${id} ${a}`).toBeLessThan(1e-6);
        }
        expect(rig.chain!({} as Parameters<typeof rig.frame>[0], `foot_${s}`, [foot[0] + 900, foot[1]])).toBeNull();
      }
      expect(rig.chain!({} as Parameters<typeof rig.frame>[0], 'hip', [0, 0])).toBeNull();
    }
  });
});

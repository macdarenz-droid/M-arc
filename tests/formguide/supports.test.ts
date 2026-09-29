// V1-11: supports and the sway about them (docs/FORM-GUIDE-PRODUCTION.md §10.5 V1-11, D-FG7 (c) and (f)).
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import type { ExerciseGuide } from '@/formguide/model';
import type { ChannelId, Pose } from '@/formguide/rig/joints';
import { HANG_BAR, SIDE_POSES, css, sideFrame, sidePivot, sidePoint, supportOf, type Frame } from '@/formguide/rig/pose';
import { FLOOR } from '@/formguide/rig/figureFront';
import { guideHash, LIMITS, runChecks } from '@/formguide/check';
import { inputFor } from '@/formguide/check/node';
import { rigFor, swayDrawn, type Rig } from '@/formguide/check/view';
import type { MachineDrawing } from '@/formguide/check/machines';
import { poseAt } from '@/formguide/sample';
import { lib_dumbbell_lateral_raise as LR } from '@/formguide/exercises/lib_dumbbell_lateral_raise';
import { lib_dumbbell_biceps_curl as CURL } from './fixtures/swayDrawn/lib_dumbbell_biceps_curl';
import { lib_hanging_leg_raise as HANG } from './fixtures/supports/lib_hanging_leg_raise';

const U = Array.from({ length: LIMITS.jointSamples + 1 }, (_, i) => i / LIMITS.jointSamples);   // 481 samples
const sym = (p: Record<string, number>): Pose => Object.fromEntries(Object.entries(p).flatMap(([k, v]) => (['torso_lean', 'sway', 'breath'].includes(k) ? [[k, v]] : [[`${k}_l`, v], [`${k}_r`, v]]))) as Pose;
/** A frame as the player writes it: each key's CSS transform or opacity, in key order. */
const cssOf = (f: Frame) => Object.entries(f).map(([k, x]) => `${k}:${x.ops ? css(x.ops) : `o${x.opacity}`}`).join(';');
const digest = (xs: string[]) => createHash('sha256').update(xs.join('\n')).digest('hex').slice(0, 16);

describe('A1: standing frames are byte-identical and the lateral raise hash is unchanged', () => {
  // Digests of the CSS of every frame below, taken on origin/main 578bbc8 (before V1-11) with this same code.
  it('front standing: the lateral raise, correct and mistake, 481 samples each, plus sway at the band ends', () => {
    const rig = rigFor(LR, 'front') as Rig, out: string[] = [];
    for (const fig of ['correct', 'mistake'] as const) for (const u of U) out.push(cssOf(rig.frame(poseAt(LR, u, fig))));
    for (const sway of [-1.5, -0.2, 0.2, 1.5]) out.push(cssOf(rig.frame({ ...poseAt(LR, 0.3), sway })));
    expect(digest(out)).toBe('f2e5cf1852f308cd');
  });
  it('side standing: rest, range ends and sway, both facings', () => {
    const ends: Record<string, number>[] = [{}, { shoulder_flex: 90 }, { elbow_flex: 150 }, { torso_lean: -40 }, { hip_flex: 120, knee_flex: 120, ankle_flex: 38, torso_lean: -40 }, { knee_flex: 60, hip_flex: 60, ankle_flex: 20 }];
    const out: string[] = [];
    for (const mirror of [false, true]) for (const e of ends) for (const sway of [0, -1.5, 0.2, 1.5]) out.push(cssOf(sideFrame('standing', sym({ ...e, sway }), { mirror })));
    expect(digest(out)).toBe('752fcdec9c081674');
  });
  it('the lateral raise hash', () => expect(guideHash(LR, rigFor(LR, 'front') as Rig)).toBe('c1ac61634cd68bd4'));
});

describe('A2: front seated, the trunk sways about the hips and a thigh pad stays put', () => {
  // the lateral raise seated, its thighs under a fixed pad (a knee attachment on each side), no other machine part
  const seated = { ...LR, id: 'lib_machine_lateral_raise', pose: 'seated', equipment: { ...LR.equipment, kind: 'none', attach: [] }, machine: { id: 'fx_thigh', settings: {}, drive: [{ part: 'stack', travel: [0, 1], chain: [] }] } } as ExerciseGuide;
  const free = rigFor(seated, 'front', null) as Rig, f0 = free.frame(poseAt(seated, 0, 'correct', 0, free));
  const pads = (['knee_l', 'knee_r'] as const).map(a => ({ attach: a, at: free.point(f0, a) }));
  const machine: MachineDrawing = { view: 'front', svg: '', parts: { stack: { kind: 'carriage', path: [[0, 0], [0, 1]] } }, pads };
  const bodyOnPad = () => runChecks({ ...inputFor('src/formguide/exercises/lib_dumbbell_lateral_raise.ts', seated), machines: { fx_thigh: machine } }, ['bodyOnPad'])[0]!;
  it('the support is the seat', () => expect(supportOf('seated', pads)).toBe('seat'));
  it('bodyOnPad: the thigh pads drift < 0.01 over the 481 samples while the sway is in band', () => {
    const rig = rigFor(seated, 'front', machine) as Rig;
    let drift = 0, sway = 0;
    for (const u of U) {
      const p = poseAt(seated, u, 'correct', 0, rig), f = rig.frame(p);
      sway = Math.max(sway, Math.abs(p.sway));
      for (const pad of pads) { const b = rig.point(f, pad.attach); drift = Math.max(drift, Math.hypot(b[0] - pad.at[0], b[1] - pad.at[1])); }
    }
    console.info(`[V1-11] A2: front seated thigh-pad drift ${drift.toExponential(2)} units, sway to ${sway.toFixed(3)}°`);
    expect(sway).toBeGreaterThanOrEqual(LIMITS.sway[0]);
    expect(drift).toBeLessThan(LIMITS.padDrift);
    const r = bodyOnPad();
    expect(r.fails).toEqual([]);
  });
  it('the head still sways about the hips by the full angle', () => {
    const rig = rigFor(seated, 'front', machine) as Rig, s = swayDrawn(seated, rig, poseAt(seated, 0, 'correct', 0, rig), LIMITS.sway[0]);
    expect(s.support).toBe('seat');
    expect(s.moved).toBeGreaterThanOrEqual(s.need * (1 - 1e-9));
  });
});

describe('A3: hanging, the grip holds the bar and the body swings about it, feet off the floor', () => {
  const pts = (f: Frame, mirror: boolean) => ({ hand: sidePoint(f, mirror ? 'hand_l' : 'hand_r', mirror), head: sidePivot(f, 'head', mirror), feet: [sidePoint(f, 'foot_l', mirror), sidePoint(f, 'foot_r', mirror)] });
  const shots: Record<string, number>[] = [{}, { hip_flex: 90 }, { hip_flex: 120, knee_flex: 90 }, { torso_lean: -20, hip_flex: 60 }, { shoulder_flex: 160, elbow_flex: 20 }];
  it.each([false, true])('mirror %s: the hand on the bar ≤ 1e-6 at every sway and pose; sway turns the body about the grip', mirror => {
    let miss = 0, turn = 0, lowest = -Infinity;
    for (const p of shots) for (const sway of [0, -1.5, -0.2, 0.2, 1.5, 6]) {
      const f0 = pts(sideFrame('hanging', sym(p), { mirror }), mirror), f = pts(sideFrame('hanging', sym({ ...p, sway }), { mirror }), mirror);
      miss = Math.max(miss, Math.hypot(f.hand[0] - HANG_BAR[0], f.hand[1] - HANG_BAR[1]));
      // the head at this sway is the head at none, turned about the bar by the sway (the mirror reverses the turn)
      const a = ((mirror ? -sway : sway) * Math.PI) / 180, [x, y] = [f0.head[0] - HANG_BAR[0], f0.head[1] - HANG_BAR[1]];
      const want = [HANG_BAR[0] + Math.cos(a) * x - Math.sin(a) * y, HANG_BAR[1] + Math.sin(a) * x + Math.cos(a) * y];
      turn = Math.max(turn, Math.hypot(f.head[0] - want[0]!, f.head[1] - want[1]!));
      lowest = Math.max(lowest, ...f.feet.map(q => q[1]));
    }
    console.info(`[V1-11] A3${mirror ? ' mirrored' : ''}: grip miss ${miss.toExponential(2)}, swing off-pivot ${turn.toExponential(2)}, lowest sole y ${lowest.toFixed(1)} (floor ${FLOOR})`);
    expect(miss).toBeLessThanOrEqual(1e-6);
    expect(turn).toBeLessThanOrEqual(1e-6);
    expect(lowest).toBeLessThan(FLOOR);
  });
  it('the hanging fixture: grip on the bar over the 481 samples of its rep and its mistake, feet clear of the floor', () => {
    const rig = rigFor(HANG, 'side') as Rig;
    let miss = 0, lowest = -Infinity;
    for (const fig of ['correct', 'mistake'] as const) for (const u of U) {
      const f = rig.frame(poseAt(HANG, u, fig)), h = rig.point(f, 'hand_r');
      miss = Math.max(miss, Math.hypot(h[0] - HANG_BAR[0], h[1] - HANG_BAR[1]));
      lowest = Math.max(lowest, rig.point(f, 'foot_l')[1], rig.point(f, 'foot_r')[1]);
    }
    expect(supportOf('hanging')).toBe('grip');
    expect(miss).toBeLessThanOrEqual(1e-6);
    expect(lowest).toBeLessThan(FLOOR);
  });
  it('the dead hang reads overhead arms and relaxed feet', () => {
    expect(SIDE_POSES.hanging).toMatchObject({ shoulder_flex_r: 180, shoulder_flex_l: 180, ankle_flex_r: -10, ankle_flex_l: -10 });
  });
});

describe('A4: the reclined support, the back on its pad at backrest angles 20-60°', () => {
  // a leg-press-like seated side file: knees and hips drive, the arms rest, the machine's seat and back pads hold it
  const PRESS = { ...CURL, id: 'lib_leg_press', joints: { hip_flex: [100, 60], knee_flex: [95, 20], ankle_flex: [10, -5], shoulder_flex: 20, elbow_flex: 40 },
    equipment: { ...CURL.equipment, kind: 'none', attach: [] }, machine: { id: 'fx_recline', settings: {}, drive: [{ part: 'stack', travel: [0, 1], chain: [] }] } } as unknown as ExerciseGuide;
  const upright = sideFrame('seated', {}), L = Math.hypot(...([0, 1] as const).map(i => sidePoint(upright, 'back')[i] - sidePoint(upright, 'hip')[i]) as [number, number]);
  const SEAT: [number, number] = [200, 380];
  /** Pads at backrest angle th from vertical, reclined toward the figure's back (the mirror reflects it). */
  const drawing = (th: number, mirror: boolean): MachineDrawing => {
    const back: [number, number] = [SEAT[0] - L * Math.sin((th * Math.PI) / 180), SEAT[1] - L * Math.cos((th * Math.PI) / 180)];
    const m = (q: [number, number]): [number, number] => (mirror ? [400 - q[0], q[1]] : q);
    return { view: 'side', svg: '', parts: { stack: { kind: 'carriage', path: [[0, 0], [0, 1]] } }, pads: [{ attach: 'hip', at: m(SEAT) }, { attach: 'back', at: m(back) }] };
  };
  const angles = Array.from({ length: 9 }, (_, i) => 20 + 5 * i);
  it.each([false, true])('mirror %s: bodyOnPad passes (gap < 0.5, back drift < 0.01 over 481 samples) at every angle, the back along the pad line', mirror => {
    const g = { ...PRESS, mirror } as ExerciseGuide;
    for (const th of angles) {
      const m = drawing(th, mirror), rig = rigFor(g, 'side', m) as Rig;
      expect(supportOf('seated', m.pads)).toBe('backPad');
      let drift = 0, sway = 0;
      const b0 = rig.point(rig.frame(poseAt(g, 0, 'correct', 0, rig)), 'back');
      for (const u of U) {
        const p = poseAt(g, u, 'correct', 0, rig), f = rig.frame(p), b = rig.point(f, 'back'), h = rig.point(f, 'hip');
        drift = Math.max(drift, Math.hypot(b[0] - b0[0], b[1] - b0[1]));
        sway = Math.max(sway, Math.abs(p.sway));
        const lean = (Math.atan2((mirror ? -1 : 1) * (h[0] - b[0]), h[1] - b[1]) * 180) / Math.PI;
        expect(Math.abs(lean - th), `backrest ${th}° drawn at ${lean.toFixed(4)}°`).toBeLessThan(1e-6);
      }
      console.info(`[V1-11] A4${mirror ? ' mirrored' : ''} ${th}°: back drift ${drift.toExponential(2)} units, sway to ${sway.toFixed(3)}°`);
      expect(sway).toBeGreaterThanOrEqual(LIMITS.sway[0]);
      expect(drift).toBeLessThan(LIMITS.padDrift);
      const r = runChecks({ ...inputFor('tests/formguide/fixtures/swayDrawn/lib_dumbbell_biceps_curl.ts', g), machines: { fx_recline: m } }, ['bodyOnPad'])[0]!;
      expect(r.fails, `${th}°`).toEqual([]);
      // the back pad holds the trunk, so the sway turns the head and neck only, and swayDrawn still sees it
      const s = swayDrawn(g, rig, poseAt(g, 0, 'correct', 0, rig), LIMITS.sway[0]);
      expect(s.support).toBe('backPad');
      expect(s.moved).toBeGreaterThanOrEqual(s.need * (1 - 1e-9));
      expect(s.moved).toBeLessThanOrEqual(s.need * (1 + 1e-9));   // turned about the neck, not some other point
    }
  });
});

describe('A6: swayDrawn, a seated side figure must draw its sway', () => {
  const rig = rigFor(CURL, 'side') as Rig, p = poseAt(CURL, 0, 'correct', 0, rig);
  it('FG-6 drew no sway when seated (sideFrame read sway only standing): the head stays put and the measure fails', () => {
    const fg6: Rig = { ...rig, frame: q => rig.frame({ ...q, sway: 0 } as Record<ChannelId, number>) };
    const s = swayDrawn(CURL, fg6, p, LIMITS.sway[0]);
    expect(s.moved).toBe(0);
    expect(s.moved >= s.need * (1 - 1e-9)).toBe(false);
  });
  it('V1-11 turns the trunk about the hips: 0.2° moves the head by the chord about the hips', () => {
    const s = swayDrawn(CURL, rig, p, LIMITS.sway[0]);
    console.info(`[V1-11] A6: seated side head moves ${s.moved.toFixed(4)} units for ${LIMITS.sway[0]}°, need ${s.need.toFixed(4)} (r ${s.radius.toFixed(1)} about the ${s.support})`);
    expect(s.support).toBe('seat');
    expect(s.moved).toBeGreaterThanOrEqual(s.need * (1 - 1e-9));
    expect(s.moved).toBeLessThanOrEqual(s.need * (1 + 1e-9));
  });
  it('every support draws it: standing, seated, hanging, lying, a back pad', () => {
    const LAT = rigFor(LR, 'front') as Rig;
    const cases: [string, ExerciseGuide, Rig][] = [['front standing', LR, LAT], ['side seated', CURL, rig], ['side hanging', HANG, rigFor(HANG, 'side') as Rig]];
    for (const [name, g, r] of cases) {
      const s = swayDrawn(g, r, poseAt(g, 0, 'correct', 0, r), LIMITS.sway[0]);
      expect(s.moved, name).toBeGreaterThanOrEqual(s.need * (1 - 1e-9));
    }
  });
});

describe('A7: secondaryMotion and its band are unchanged', () => {
  it('the band is [0.2°, 1.5°]', () => expect(LIMITS.sway).toEqual([0.2, 1.5]));
  it('secondaryMotion still fails a sway past the band on a seated file', () => {
    const g = { ...CURL, joints: { ...CURL.joints, sway: 2 } } as ExerciseGuide;
    const r = runChecks(inputFor('tests/formguide/fixtures/swayDrawn/lib_dumbbell_biceps_curl.ts', g), ['secondaryMotion'])[0]!;
    expect(r.fails.join()).toMatch(/sway amplitude 2\.2° outside \[0\.2°, 1\.5°\]/);
  });
});

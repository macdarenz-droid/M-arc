// V1-04: the solver core (docs/FORM-GUIDE-PRODUCTION.md §10.5 V1-04, D-FG7 (b)).
import { describe, expect, it } from 'vitest';
import type { ExerciseGuide } from '@/formguide/model';
import { frontFrame, handAt, solveFrontArm } from '@/formguide/rig/pose';
import { residual, solveFrontChain } from '@/formguide/solve/frontChain';
import { pathOff } from '@/formguide/solve';
import { poseAt, sampleGuide, stateAt, stopsFor, tempoOf, type Figure } from '@/formguide/sample';
import { guideHash, runChecks, type CheckId } from '@/formguide/check';
import { inputFor } from '@/formguide/check/node';
import { rigFor, type Rig } from '@/formguide/check/view';
import type { MachineDrawing } from '@/formguide/check/machines';
import { chainedGroups, momentFrame } from '@/formguide/player/guideView';
import { effortOf } from '@/formguide/check/effort';
import { themeReader } from '@/formguide/rig/paint';
import { lib_dumbbell_lateral_raise as LR } from '@/formguide/exercises/lib_dumbbell_lateral_raise';
import { lib_smith_machine_shoulder_press as FX } from './fixtures/solve/lib_smith_machine_shoulder_press';

const PATH = 'tests/formguide/fixtures/solve/lib_smith_machine_shoulder_press.ts';
const input = (g: ExerciseGuide = FX) => inputFor(PATH, g);
const MACHINE = input().machines!.fx_press!;
const rigOf = (g: ExerciseGuide, m: MachineDrawing = MACHINE): Rig => ({ ...(rigFor(g, 'front') as Rig), machine: m });
const variant = (over: Record<string, unknown>) => ({ ...FX, ...over }) as ExerciseGuide;
const failing = (g: ExerciseGuide, only: CheckId[], m?: MachineDrawing) => {
  const inp = input(g);
  return runChecks(m ? { ...inp, machines: { fx_press: m } } : inp, only).filter(r => !r.ok);
};
const shift = (m: MachineDrawing, part: string, dx: number): MachineDrawing => {
  const p = m.parts[part]!;
  if (p.kind === 'lever') throw new Error('slide only');
  return { ...m, parts: { ...m.parts, [part]: { ...p, path: p.path.map(([x, y]) => [x + dx, y]) as [[number, number], [number, number]] } } };
};
/** The worst hand-to-rail distance over every stop of one figure. */
function worstGap(g: ExerciseGuide, fig: Figure, rig: Rig): number {
  let w = 0;
  for (const u of stopsFor(tempoOf(g, fig, 0), g.order, g.kind)) {
    const f = rig.frame(poseAt(g, u, fig, 0, rig));
    for (const s of ['l', 'r'] as const) w = Math.max(w, Math.abs(pathOff(MACHINE.parts[`bar_${s}`]!, rig.point(f, `hand_${s}`))));
  }
  return w;
}

describe('V1-04 A1: files without contacts take the old path byte for byte', () => {
  it('the lateral raise hash is unchanged, with or without a rig', () => {
    expect(guideHash(LR)).toBe('c1ac61634cd68bd4');
    expect(guideHash(LR, rigFor(LR, 'front') as Rig)).toBe('c1ac61634cd68bd4');
    expect(sampleGuide(LR).travel).toBeUndefined();
  });
});

describe('V1-04 A2: the front two-hand press holds its contacts', () => {
  const rig = rigOf(FX);
  it('both hands stay on their rails within 1e-6 at every stop, correct and mistake', () => {
    const c = worstGap(FX, 'correct', rig), m = worstGap(FX, 'mistake', rig);
    console.info(`[V1-04 A2] worst gap: correct ${c.toExponential(2)}, mistake ${m.toExponential(2)} units`);
    expect(c).toBeLessThanOrEqual(1e-6);
    expect(m).toBeLessThanOrEqual(1e-6);
  });
  it('handsOnHandle, bodyOnPad and machinePivot pass at unchanged limits', () => {
    expect(failing(FX, ['handsOnHandle', 'bodyOnPad', 'machinePivot'])).toEqual([]);
  });
  it('the fixture passes all 20 checks, its hash stored', () => {
    expect(runChecks(input()).filter(r => !r.ok).flatMap(r => r.fails)).toEqual([]);
  });
  it('the handles follow the hands: the travel is the hand projected on the rail, 0 at the start, near 1 at the top', () => {
    const s = sampleGuide(FX, 'correct', 0, rig);
    expect(s.travel?.map(t => t.part)).toEqual(['bar_r', 'bar_l']);
    const tr = s.travel![0]!.stops, top = tr[stopsFor(FX.tempo, FX.order, FX.kind).indexOf(0.25)]![1];
    expect(tr[0]![1]).toBeCloseTo(0.12, 1);
    expect(top).toBeGreaterThan(0.9);
    expect(stateAt(FX, 0.25, 'correct', 0, rig).travel[0]).toBeCloseTo(top, 4);
  });
  it('a solved stop is the same whether sampled in order or asked for alone', () => {
    const s = sampleGuide(FX, 'correct', 0, rig), i = 57, u = s.stops[i]!;
    const alone = poseAt(FX, u, 'correct', 0, rigOf(FX));   // a fresh rig: a fresh solve
    expect(Math.round(alone.elbow_lead_r * 1e4) / 1e4).toBe(s.channels.find(c => c.id === 'elbow_lead_r')!.stops[i]![1]);
  });
});

describe('V1-04 A3: an unreachable target throws, naming the contact, u and the distance', () => {
  it('a rail 300 units out', () => {
    const far = shift(MACHINE, 'bar_r', 300);
    expect(() => poseAt(FX, 0, 'correct', 0, rigOf(FX, far))).toThrow(/^contact hand_r on bar_r: out of reach at u=0 \(rep 0\), \d+\.\d{4} units off$/);
  });
});

describe('V1-04 A4: the bend never flips within a rep', () => {
  it('elbow_lead keeps its sign at every stop of every figure', () => {
    const rig = rigOf(FX);
    for (const fig of ['correct', 'mistake'] as const) {
      const s = sampleGuide(FX, fig, 0, rig);
      for (const id of ['elbow_lead_r', 'elbow_lead_l'] as const) expect(s.channels.find(c => c.id === id)!.stops.every(([, v]) => v < 0), `${fig} ${id}`).toBe(true);
    }
  });
  it('a solve that would leave its range throws instead of flipping', () => {
    const g = variant({ contacts: [{ at: 'hand_r', on: 'bar_r', solve: 'elbow_lead', range: [-100, -5] }, FX.contacts![1]!] });
    expect(() => sampleGuide(g, 'correct', 0, rigOf(g))).toThrow(/contact hand_r on bar_r: elbow_lead_r = -\d+\.\d\d leaves its range -100\.\.-5 at u=\S+ \(rep 0\) \(the bend would flip\)|contact hand_r on bar_r: out of reach/);
  });
  it('a range holding both bends is refused at the first stop', () => {
    const g = variant({ contacts: [{ at: 'hand_r', on: 'bar_r', solve: 'elbow_lead', range: [-170, 170] }, FX.contacts![1]!] });
    expect(() => poseAt(g, 0, 'correct', 0, rigOf(g))).toThrow(/elbow_lead_r has 2 solutions in its range -170\.\.170 at u=0 \(rep 0\) \(near .*\): narrow the range to one bend/);
  });
});

describe('V1-04 A5: a file that keys a solved channel is rejected', () => {
  it('in joints', () => {
    const g = variant({ joints: { ...FX.joints, elbow_lead: -60 } });
    expect(() => poseAt(g, 0, 'correct', 0, rigOf(g))).toThrow('lib_smith_machine_shoulder_press: joints key elbow_lead, which contact hand_r on bar_r solves: a solved channel is never keyed');
  });
  it('in the mistake, unless the point is released', () => {
    const g = variant({ mistake: { ...FX.mistake, joints: { ...FX.mistake.joints, elbow_lead: [0, 20] } } });
    expect(() => poseAt(g, 0, 'mistake', 0, rigOf(g))).toThrow(/mistake keys elbow_lead, which contact hand_r on bar_r solves: release hand_r in the mistake to move it/);
  });
});

describe('V1-04 A6: every call site is threaded', () => {
  it('a file with contacts and no rig throws, naming why', () => {
    expect(() => poseAt(FX, 0)).toThrow(/declares contacts, a balance or a followed part: it is sampled on a rig/);
    expect(() => sampleGuide(FX)).toThrow(/sampled on a rig/);
  });
  it('runChecks runs every check on the fixture with no throw', () => {
    const rs = runChecks(input());
    expect(rs.flatMap(r => r.fails).filter(f => / threw /.test(f))).toEqual([]);
  });
  it('the player path (chained keyframes, moments, effort) runs on the fixture', () => {
    const rig = rigOf(FX), markup = rig.markup(themeReader('silent-black'), false);
    for (const fig of ['correct', 'mistake'] as const) {
      expect(chainedGroups(FX, rig, fig, markup).length).toBeGreaterThan(0);
      expect(momentFrame(FX, rig, fig, 0.25, markup).elbow_r).toBeTruthy();
      const e = effortOf(FX, fig, 0, rig);
      expect(typeof e).toBe('function');
    }
  });
});

describe('V1-04 A8: released contacts are not enforced in the mistake', () => {
  const released = variant({ mistake: { ...FX.mistake, release: ['hand_l', 'hand_r'], joints: { ...FX.mistake.joints, elbow_lead: { keys: [[0, 0], [0.2, 20], [0.5, 20], [0.8, 0]] } }, travel: { bar_r: 0.5, bar_l: 0.5 } } });
  const rig = rigOf(released);
  it('the hands leave the rails by the delta in the mistake; the correct figure still holds them', () => {
    const m = worstGap(released, 'mistake', rig), c = worstGap(released, 'correct', rig);
    console.info(`[V1-04 A8] released mistake: hands up to ${m.toFixed(2)} units off the rails; correct ${c.toExponential(2)}`);
    expect(m).toBeGreaterThan(5);
    expect(c).toBeLessThanOrEqual(1e-6);
  });
  it('a released channel is its solve on the pose before deltas, plus its delta', () => {
    const at = poseAt(released, 0.2, 'mistake', 0, rig), held = poseAt(FX, 0.2, 'mistake', 0, rigOf(FX));
    const pre = poseAt(variant({ mistake: { ...FX.mistake, joints: {} } }), 0.2, 'mistake', 0, rig);
    expect(at.elbow_lead_r).toBeCloseTo(pre.elbow_lead_r + 20, 6);
    expect(at.elbow_lead_r).not.toBeCloseTo(held.elbow_lead_r, 1);
  });
  it('mistake.travel replaces the followed travel of a released handle', () => {
    expect(stateAt(released, 0.2, 'mistake', 0, rig).travel).toEqual([0.5, 0.5]);
  });
});

describe('V1-04 A10: the front chain is solved to a fixed point', () => {
  // a raised arm (the target is where 120° of abduction and 60° of lead put the hand); the pose starts at the stored 10°
  const target = handAt(frontFrame('seated', { shoulder_abd_r: 120, elbow_lead_r: 60 }), 'r');
  it('one pass of solveFrontArm leaves the hand more than 1e-6 off (the rise of the old abduction)', () => {
    const one = solveFrontArm('seated', {}, 'r', target);
    const r = residual('seated', { shoulder_abd_r: one.shoulder_abd, elbow_lead_r: one.elbow_lead }, 'r', target);
    console.info(`[V1-04 A10] one pass: ${r.toExponential(2)} units`);
    expect(r).toBeGreaterThan(1e-6);
  });
  it('the fixed point puts it within 1e-6, on both sides', () => {
    for (const s of ['r', 'l'] as const) {
      const t = handAt(frontFrame('seated', { [`shoulder_abd_${s}`]: 120, [`elbow_lead_${s}`]: 60 }), s);
      const x = solveFrontChain('seated', {}, s, t), r = residual('seated', { [`shoulder_abd_${s}`]: x.shoulder_abd, [`elbow_lead_${s}`]: x.elbow_lead }, s, t);
      console.info(`[V1-04 A10] fixed point ${s}: ${r.toExponential(2)} units`);
      expect(r).toBeLessThanOrEqual(1e-6);
      expect(x.shoulder_abd).toBeCloseTo(120, 6);
    }
  });
});

describe('V1-04 two fixture machines: travel-driven against follow (D-FG7 (b))', () => {
  // the same rails, the handle's travel keyed min-jerk and both arm channels solved to its anchor
  const start = handAt(frontFrame('seated', { shoulder_abd_r: 101, elbow_lead_r: -126.66, hip_flex_r: 90, knee_flex_r: 90 }), 'r');
  const end = handAt(frontFrame('seated', { shoulder_abd_r: 165, elbow_lead_r: -15, hip_flex_r: 90, knee_flex_r: 90 }), 'r');
  const rails = (x: number): MachineDrawing['parts'][string] => ({ kind: 'carriage', path: [[x, start[1]], [x, end[1]]], attach: x > 200 ? 'hand_r' : 'hand_l' });
  const m: MachineDrawing = { ...MACHINE, parts: { bar_r: rails(start[0]), bar_l: rails(400 - start[0]) } };
  const { shoulder_abd: _drop, ...joints } = FX.joints as Record<string, unknown>;
  const travelDriven = variant({
    joints, machine: { id: 'fx_press', settings: {}, drive: [{ part: 'bar_r', travel: [0, 1], chain: ['shoulder_r', 'elbow_r', 'wrist_r'] }, { part: 'bar_l', travel: [0, 1], chain: ['shoulder_l', 'elbow_l', 'wrist_l'] }] },
    contacts: (['r', 'l'] as const).map(s => ({ at: `hand_${s}`, on: `bar_${s}`, solve: ['shoulder_abd', 'elbow_lead'], range: [[90, 175], [-170, -5]] })),
  });
  it('travel-driven holds the hands on the handle but fails (c); the follow rule passes (c)', () => {
    const t = failing(travelDriven, ['smoothness', 'handsOnHandle'], m), f = failing(FX, ['smoothness']);
    const c = (rs: typeof t) => rs.flatMap(r => r.fails).filter(x => / \(c\) /.test(x));
    console.info(`[V1-04 compare] travel-driven: ${c(t)[0]}`);
    expect(t.map(r => r.check)).toEqual(['smoothness']);
    expect(c(t).length).toBeGreaterThan(0);
    expect(c(f)).toEqual([]);
  });
});

describe('V1-04 A9: a followed handle drawn off the hand fails handsOnHandle', () => {
  it('the seeded bad file handsOnHandle.follow: the hands on their rails, the handles 1 unit outside', async () => {
    const path = 'tests/formguide/fixtures/bad/handsOnHandle.follow/lib_smith_machine_shoulder_press.ts';
    const g = (await import('./fixtures/bad/handsOnHandle.follow/lib_smith_machine_shoulder_press')).lib_smith_machine_shoulder_press;
    const bad = runChecks(inputFor(path, g)).filter(r => !r.ok);
    expect(bad.map(r => r.check)).toEqual(['handsOnHandle']);
    expect(bad[0]!.fails[0]).toMatch(/^handsOnHandle lib_smith_machine_shoulder_press: hand_r is 1 units from the bar_r anchor \(limit 0\.5\) at u=0 /);
  });
});

describe('V1-04 D-FG3 extension: smoothness reads a solved file with the sway held at 0', () => {
  it('the sway still reaches the drawn pose: the solved arm differs with and without it', () => {
    const rig = rigOf(FX), still = sampleGuide(FX, 'correct', 0, rig, { still: true }), drawn = sampleGuide(FX, 'correct', 0, rig);
    const lead = (s: typeof drawn) => s.channels.find(c => c.id === 'elbow_lead_r')!.stops.map(x => x[1]);
    expect(Math.max(...lead(still).map((v, i) => Math.abs(v - lead(drawn)[i]!)))).toBeGreaterThan(0.01);
    expect(still.channels.find(c => c.id === 'sway')!.stops).toEqual(drawn.channels.find(c => c.id === 'sway')!.stops);
  });
  it('guard: a real edge jerk in the driver still fails (a) in the solved arm and the hand path', () => {
    // the shoulder still moving when the lift ends at u = 0.25
    const g = variant({ joints: { ...FX.joints, shoulder_abd: { keys: [[0, 101], [0.3, 165], [0.45, 165], [0.9, 101]] } } });
    const f = failing(g, ['smoothness']).flatMap(r => r.fails);
    expect(f.some(x => /\(a\) elbow_lead_r lift: edge speed/.test(x))).toBe(true);
    expect(f.some(x => /\(a\) hand_r path lift: edge speed/.test(x))).toBe(true);
  });
});

describe('V1-04 A11: a sweep of 50 contact parameter sets inside the declared bounds', () => {
  // rails moved out or in (grip width) by up to 6 units, the press started at 101..113° and finished at 160 or 165°
  const sets = [-6, -3, 0, 3, 6].flatMap(dx => [101, 104, 107, 110, 113].flatMap(a0 => [160, 165].map(a1 => ({ dx, a0, a1 }))));
  it(`${sets.length} sets pass smoothness, jointRanges, handsOnHandle and machinePivot`, () => {
    expect(sets.length).toBeGreaterThanOrEqual(50);
    const bad: string[] = [];
    for (const { dx, a0, a1 } of sets) {
      const m = shift(shift(MACHINE, 'bar_r', dx), 'bar_l', -dx), g = variant({ joints: { ...FX.joints, shoulder_abd: [a0, a1] } });
      for (const r of failing(g, ['smoothness', 'jointRanges', 'handsOnHandle', 'machinePivot'], m)) bad.push(`dx ${dx} ${a0}->${a1}: ${r.fails[0]}`);
    }
    expect(bad).toEqual([]);
  }, 60_000);
});

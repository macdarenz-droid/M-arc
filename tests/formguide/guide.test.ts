// FG-2: the ExerciseGuide schema and sampler (A1-A5). The lab numbers come from the verbatim fixture labFront.ts.
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import exercises from '@/data/exercises.json';
import { AAOS, aaosTruth, inRange } from '@/formguide/rig/ranges';
import { CHANNELS } from '@/formguide/rig/joints';
import { frontFrame, handAt } from '@/formguide/rig/pose';
import type { ExerciseGuide, Research } from '@/formguide/model';
import { STEPS_PER_PHASE, channelKind, curveAt, drawnAt, envelope, keysAt, mj, poseAt, sampleGuide, stopsFor, tempoOf, windowsFor } from '@/formguide/sample';
import { lib_dumbbell_lateral_raise as LR } from '@/formguide/exercises/lib_dumbbell_lateral_raise';
import research from '@/formguide/research/lib_dumbbell_lateral_raise.json';
import { MOMENTS, labChannels, pose2d, screenFist, type Mode } from './fixtures/labFront';

const hand = (m: Mode, u: number, rep = 0) => handAt(frontFrame('standing', poseAt(LR, u, m, rep)), 'r');
const labHand = (m: Mode, u: number, rep = 0) => screenFist(pose2d(m, u * 4, rep));
const dist = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);
const lab = (m: Mode, u: number) => labChannels(pose2d(m, u * 4, 0)) as Record<string, number>;
const grid = (n: number) => Array.from({ length: n + 1 }, (_, i) => i / n);
const hash = (x: unknown) => createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);

// GU-7a rig/stops.ts SAMPLES (percent): every 0.25 % in the lift, every 0.5 % in the return, the holds at their boundaries.
const GU7A_SAMPLES = [...Array.from({ length: 101 }, (_, i) => i * 0.25), ...Array.from({ length: 101 }, (_, i) => 37.5 + i * 0.5), 100];

describe('A5 stopsFor and Channel, ported from GU-7a', () => {
  it('a 1/0.5/2/0.5 s rep gives GU-7a\'s 203 stops exactly', () => {
    const s = stopsFor({ lift: 1, hold: 0.5, lower: 2, rest: 0.5 }, 'lift_first', 'rep');
    expect(s).toHaveLength(203);
    s.forEach((u, i) => expect(u).toBeCloseTo(GU7A_SAMPLES[i]! / 100, 12));
  });
  it('the windows come from the tempo, not a fixed 1/0.5/2/0.5 s; 100 steps per moving phase, none across a hold or rest', () => {
    const t = { lift: 1.5, hold: 1, lower: 2.5, rest: 0 }, s = stopsFor(t, 'lift_first', 'rep');
    expect(s).toHaveLength(2 * STEPS_PER_PHASE + 2);   // two moving phases share no stop; the empty rest adds none
    expect(s.filter(u => u > 1.5 / 5 + 1e-9 && u < 2.5 / 5 - 1e-9)).toEqual([]);
    expect(s[STEPS_PER_PHASE]).toBeCloseTo(0.3, 12);
    expect(s[STEPS_PER_PHASE + 1]).toBeCloseTo(0.5, 12);
    expect(s.at(-1)).toBe(1);
    expect(s.every((u, i) => !i || u > s[i - 1]!)).toBe(true);
    // about one stop per 1/4 % of a 4 s rep in the moving phases: 203 for a 4 s rep whatever the split
    expect(stopsFor({ lift: 0.8, hold: 0.2, lower: 0.9, rest: 2.1 }, 'lift_first', 'rep')).toHaveLength(203);
  });
  it('Channel kinds follow the channel unit; drawnAt draws linearly between stops (GU-7a)', () => {
    expect(channelKind('shoulder_abd_r')).toBe('rotate');
    expect(channelKind('shrug_cm_l')).toBe('translateY');
    expect(channelKind('breath')).toBe('scaleY');
    expect(channelKind('layer')).toBe('opacity');
    const st: [number, number][] = [[0, 0], [0.5, 10], [1, 10]];
    expect([drawnAt(st, 0), drawnAt(st, 0.25), drawnAt(st, 0.5), drawnAt(st, 0.75), drawnAt(st, 1)]).toEqual([0, 5, 10, 10, 10]);
    const g = sampleGuide(LR);
    expect(g.channels.map(c => c.id)).toEqual([...CHANNELS]);
    for (const c of g.channels) { expect(c.kind).toBe(channelKind(c.id)); expect(c.stops.map(s => s[0])).toEqual(g.stops.map(u => +u.toFixed(4))); }
  });
});

describe('curves', () => {
  it('[a, b] runs minimum-jerk out over the first moving phase, holds, and back over the second', () => {
    const ws = windowsFor({ lift: 1, hold: 0.5, lower: 2, rest: 0.5 }, 'lift_first', 'rep');
    expect([0, 0.125, 0.25, 0.3, 0.625, 0.875, 0.95].map(u => curveAt([10, 88], ws, u))).toEqual([10, 49, 88, 88, 49, 10, 10].map(v => expect.closeTo(v, 9)));
  });
  it('two keys are exactly the minimum-jerk blend; keys never overshoot and hold their end values', () => {
    for (const u of grid(40)) expect(keysAt([[0.2, 3], [0.6, 7]], u)).toBeCloseTo(3 + 4 * mj((u - 0.2) / 0.4), 12);
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let k = 0; k < 200; k++) {
      const n = 3 + Math.floor(rnd() * 6), ks = Array.from({ length: n }, (_, i) => [(i + rnd() * 0.9) / n, rnd() * 20 - 10] as [number, number]);
      for (let i = 1; i < n; i++) {
        const [t0, v0] = ks[i - 1]!, [t1, v1] = ks[i]!;
        for (const s of grid(50)) { const v = keysAt(ks, t0 + (t1 - t0) * s); expect(v).toBeGreaterThanOrEqual(Math.min(v0, v1) - 1e-9); expect(v).toBeLessThanOrEqual(Math.max(v0, v1) + 1e-9); }
      }
      expect(keysAt(ks, 0)).toBe(ks[0]![1]);
      expect(keysAt(ks, 1)).toBe(ks[n - 1]![1]);
    }
  });
  it('a symmetric file rejects a sided key, and a hold tempo on a rep kind is refused', () => {
    const bad = { ...LR, joints: { ...LR.joints, knee_flex_r: 6 } } as unknown as ExerciseGuide;
    expect(() => sampleGuide(bad)).toThrow(/knee_flex_r is not allowed/);
    expect(() => windowsFor({ hold: 30 }, 'lift_first', 'rep')).toThrow(/tempo/);
    expect(() => windowsFor({ lift: 1, hold: 0, lower: 1, rest: 0 }, 'lift_first', 'hold')).toThrow(/tempo/);
  });
});

describe('A1 lib_dumbbell_lateral_raise reproduces the lab', () => {
  it('the id is the file name and a library id; research.json matches the file', () => {
    expect(LR.id).toBe('lib_dumbbell_lateral_raise');
    expect((exercises as { id: string }[]).some(e => e.id === LR.id)).toBe(true);
    const r = research as Research;
    expect(r.id).toBe(LR.id);
    expect([r.kind, r.order, r.tempo]).toEqual([LR.kind, LR.order, LR.tempo]);
    expect(r.muscles.target).toEqual(LR.muscles.target);
    expect(r.mistake.tells.map(t => t.joint)).toEqual(LR.mistake.tells.map(t => t.joint));
    expect(LR.cues.length).toBeLessThanOrEqual(3);
    LR.cues.forEach(c => expect(c.length).toBeLessThanOrEqual(60));
  });
  it('hash snapshot of the sampled stops per channel (the three slowed reps and the mistake)', () => {
    const snap = (s: ReturnType<typeof sampleGuide>) => Object.fromEntries(s.channels.map(c => [c.id, hash(c.stops)]));
    const all = [0, 1, 2].map(r => sampleGuide(LR, 'correct', r)).concat(sampleGuide(LR, 'mistake'));
    expect(all.map(s => s.stops.length)).toEqual([203, 203, 203, 203]);
    expect(hash(all.map(snap))).toMatchInlineSnapshot(`"c1ac61634cd68bd4"`);
  });
  it.each(MOMENTS)('%s (%s, t=%s s): the right hand within 1 unit of the lab', (_n, mode, t) => {
    const err = dist(hand(mode, t / 4), labHand(mode, t / 4));
    console.info(`[FG-2] ${_n}: ${err.toFixed(3)} units off the lab`);
    expect(err).toBeLessThan(1);
  });
  it('the working channels match the lab at the moments, and the whole path stays within 2 units', () => {
    for (const [, mode, t] of MOMENTS) {
      const p = poseAt(LR, t / 4, mode), l = lab(mode, t / 4);
      for (const c of ['shoulder_abd_r', 'elbow_lead_r', 'knee_flex_r', 'torso_lean']) expect(Math.abs(p[c as never] - l[c]!), c).toBeLessThan(0.35);
      expect(Math.abs(p.sway - l.sway!)).toBeLessThan(0.02);
    }
    // The lab's hold tremor starts and stops with a jump; ours is windowed to zero at the hold's ends (sample.ts), so the
    // correct holds are checked for staying inside the lab's tremor band instead.
    let worst = 0;
    for (const [m, rep] of [['correct', 0], ['correct', 1], ['correct', 2], ['mistake', 0]] as const) {
      const hold = sampleGuide(LR, m, rep).windows.find(w => w.name === 'hold')!;
      for (const u of grid(960)) {
        if (m === 'correct' && u > hold.u0 && u < hold.u1) {
          const amp = 0.35 * (1 + 0.3 * rep) * 1.45;
          expect(Math.abs(poseAt(LR, u, m, rep).shoulder_abd_r - 88)).toBeLessThanOrEqual(amp);
          continue;
        }
        worst = Math.max(worst, dist(hand(m, u, rep), labHand(m, u, rep)));
      }
    }
    console.info(`[FG-2] worst hand gap over the path: ${worst.toFixed(3)} units`);
    expect(worst).toBeLessThan(2);
  });
  it('the slowed reps stretch the lift and shorten the rest, as the lab does', () => {
    expect([0, 1, 2].map(r => tempoOf(LR, 'correct', r))).toEqual([
      { lift: 1, hold: 0.5, lower: 2, rest: 0.5 }, { lift: 1.08, hold: 0.5, lower: 2, rest: 0.42 }, { lift: 1.18, hold: 0.5, lower: 2, rest: 0.32 }]);
  });
  it('the correct figure stays inside the research.json coaching ranges and the AAOS limits at 481 samples, every rep', () => {
    const ranges = (research as Research).ranges;
    for (const rep of [0, 1, 2]) for (const u of grid(480)) {
      const p = poseAt(LR, u, 'correct', rep);
      for (const [base, r] of Object.entries(ranges)) for (const c of base === 'torso_lean' ? [base] : [`${base}_l`, `${base}_r`]) {
        const v = p[c as never] as number;
        expect(v, `${c} at ${u}`).toBeGreaterThanOrEqual(r.min - 1e-9);
        expect(v, `${c} at ${u}`).toBeLessThanOrEqual(r.max + 1e-9);
        const a = aaosTruth(c, v); if (a) expect(inRange(a)).toBe(true);
      }
    }
  });
});

describe('A3 the mistake deltas reproduce the lab mistake', () => {
  const U = grid(1920);
  const ext = (f: (u: number) => number, a: number, b: number, pick: typeof Math.max) => pick(...U.filter(u => u >= a && u <= b).map(f));
  const ours = (c: string) => (u: number) => poseAt(LR, u, 'mistake')[c as never] as number;
  const theirs = (c: string) => (u: number) => lab('mistake', u)[c]!;
  it.each([
    ['knee dip', 'knee_flex_r', 0, 0.2, Math.max, 0.6],
    ['lean back', 'torso_lean', 0, 0.2, Math.max, 0.6],
    ['shrug', 'shrug_cm_r', 0, 1, Math.max, 0.15],
    ['thumbs down', 'wrist_pron_r', 0, 1, Math.max, 1],
    ['too high', 'shoulder_abd_r', 0, 1, Math.max, 0.6],
    ['bounce past the start', 'shoulder_abd_r', 0.475, 1, Math.min, 0.6],
  ] as const)('%s: %s peaks where the lab peaks', (_n, c, a, b, pick, tol) => {
    const o = ext(ours(c), a, b, pick), t = ext(theirs(c), a, b, pick);
    expect(Math.abs(o - t)).toBeLessThan(tol);
  });
  it('drop: the lower takes the mistake\'s 0.9 s and the hand is still fast when it ends, then bounces', () => {
    const s = sampleGuide(LR, 'mistake'), lower = s.windows.find(w => w.name === 'lower')!;
    expect(lower.s1 - lower.s0).toBeCloseTo(0.9, 12);
    const speed = (m: Mode, u: number) => dist(hand(m, u + 0.5 / 480), hand(m, u - 0.5 / 480)) * 480 / 4;   // units per second
    const end = lower.u1 - 1 / 480, lab0 = dist(labHand('mistake', end + 0.5 / 480), labHand('mistake', end - 0.5 / 480)) * 480 / 4;
    expect(Math.abs(speed('mistake', end) - lab0) / lab0).toBeLessThan(0.15);
    expect(speed('mistake', end)).toBeGreaterThan(3 * Math.max(...grid(100).map(k => speed('correct', 0.87 + 0.004 * k))));
  });
  it('every tell names a joint whose delta is at least 5° (or 20 % of its range), inside the AAOS limits', () => {
    for (const t of LR.mistake.tells) {
      const c = `${t.joint}_r`, d = Math.max(...U.map(u => Math.abs(ours(c)(u) - (poseAt(LR, u, 'correct')[c as never] as number))));
      const r = (research as Research).ranges[t.joint]!;
      expect(d >= 5 || d >= 0.2 * (r.max - r.min), t.joint).toBe(true);
    }
    for (const u of U) for (const [c, v] of Object.entries(poseAt(LR, u, 'mistake'))) {
      expect(Number.isFinite(v)).toBe(true);
      const a = aaosTruth(c, v); if (a) expect(inRange(a), `${c} ${v}`).toBe(true);
    }
    expect(Object.keys(AAOS)).toContain('shoulder_abd');
  });
});

describe('A4 lower_first and hold files sample with the right phase windows', () => {
  const squat = { ...LR, id: 'fixture_squat', order: 'lower_first', tempo: { lift: 1, hold: 0.25, lower: 2, rest: 0.75 },
    joints: { knee_flex: [0, 90], hip_flex: { keys: [[0, 0], [0.5, 80], [0.5625, 80], [0.8125, 0]] } },
    movement: { breathe: 'out on lift' }, mistake: { name: 'x', joints: { knee_flex: [0, 10] }, tells: [] } } as unknown as ExerciseGuide;
  const plank = { ...LR, id: 'fixture_plank', kind: 'hold', tempo: { hold: 30 }, joints: { hip_flex: 0 },
    movement: { breathe: 'out on lift', tremorDeg: 0.5 }, mistake: { name: 'Sag', joints: { hip_flex: [0, -12] }, tells: [{ text: 'Hips sag.', joint: 'hip_flex' }] } } as unknown as ExerciseGuide;
  it('lower_first: lower 0–50 %, hold, lift 56.25–81.25 %, rest; [a, b] goes out on the lower', () => {
    const ws = windowsFor(squat.tempo, 'lower_first', 'rep');
    expect(ws.map(w => [w.name, w.u0, w.u1, w.move])).toEqual([['lower', 0, 0.5, 1], ['hold', 0.5, 0.5625, 0], ['lift', 0.5625, 0.8125, 2], ['rest', 0.8125, 1, 0]]);
    const s = sampleGuide(squat), knee = s.channels.find(c => c.id === 'knee_flex_r')!;
    expect(s.stops).toHaveLength(203);
    expect(s.stops.filter(u => u > 0.5 + 1e-9 && u < 0.5625 - 1e-9)).toEqual([]);
    expect(drawnAt(knee.stops, 0.25)).toBeCloseTo(45, 1);
    expect(drawnAt(knee.stops, 0.53)).toBe(90);
    expect(drawnAt(knee.stops, 0.9)).toBe(0);
    // breathing in on the way down and out on the way up
    const breath = s.channels.find(c => c.id === 'breath')!;
    expect([drawnAt(breath.stops, 0), drawnAt(breath.stops, 0.53), drawnAt(breath.stops, 0.9)]).toEqual([0, 1, 0]);
    // the mistake delta follows the same windows
    expect(poseAt(squat, 0.53, 'mistake').knee_flex_l).toBe(100);
  });
  it('hold: one window over the duration, stops at its ends only, a sag delta that drifts across it', () => {
    const ws = windowsFor({ hold: 30 }, 'lift_first', 'hold');
    expect(ws).toEqual([{ name: 'hold', u0: 0, u1: 1, s0: 0, s1: 30, move: 0, half: 0 }]);
    expect(stopsFor({ hold: 30 }, 'lift_first', 'hold')).toEqual([0, 1]);
    expect(envelope(ws, 0.5)).toBe(0.5);
    const m = sampleGuide(plank, 'mistake').channels.find(c => c.id === 'hip_flex_r')!;
    expect(m.stops).toEqual([[0, 0], [1, -12]]);
    expect(poseAt(plank, 0.5, 'mistake').hip_flex_r).toBeCloseTo(-6, 9);
    expect(sampleGuide(plank).channels.find(c => c.id === 'hip_flex_r')!.stops).toEqual([[0, 0], [1, 0]]);
  });
  it('alternating: two half-reps, the right side moves in the first and the left in the second', () => {
    const alt = { ...LR, kind: 'alternating', symmetric: true, joints: { elbow_flex: [10, 140] }, mistake: { name: 'x', joints: {}, tells: [] } } as unknown as ExerciseGuide;
    const s = sampleGuide(alt), at = (id: string, u: number) => drawnAt(s.channels.find(c => c.id === id)!.stops, u);
    expect(s.windows).toHaveLength(8);
    expect([at('elbow_flex_r', 0.125), at('elbow_flex_l', 0.125), at('elbow_flex_r', 0.625), at('elbow_flex_l', 0.625)]).toEqual([140, 10, 10, 140]);
  });
});

describe('A2 speed', () => {
  it('sampling every channel of a rep takes at most 20 ms', () => {
    const t0 = performance.now(); sampleGuide(LR); const cold = performance.now() - t0;
    const t1 = performance.now(); for (let r = 0; r < 3; r++) sampleGuide(LR, 'correct', r); sampleGuide(LR, 'mistake'); const all = (performance.now() - t1) / 4;
    console.info(`[FG-2] sampleGuide: first ${cold.toFixed(2)} ms, then ${all.toFixed(2)} ms per rep`);
    expect(cold).toBeLessThanOrEqual(20);
    expect(all).toBeLessThanOrEqual(20);
  });
});

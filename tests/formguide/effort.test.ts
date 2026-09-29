// V1-10: effort for cables and machines (docs/FORM-GUIDE-PRODUCTION.md §10.5 V1-10, D-V1-10).
import { describe, expect, it } from 'vitest';
import type { ExerciseGuide, Research } from '@/formguide/model';
import type { MachineDrawing } from '@/formguide/check/machines';
import { guideHash, runChecks } from '@/formguide/check';
import { inputFor } from '@/formguide/check/node';
import { rigFor, type Rig } from '@/formguide/check/view';
import { effortOf } from '@/formguide/check/effort';
import { poseAt, repSeconds, tempoOf } from '@/formguide/sample';
import { lib_dumbbell_lateral_raise as LR } from '@/formguide/exercises/lib_dumbbell_lateral_raise';

const LR_PATH = 'src/formguide/exercises/lib_dumbbell_lateral_raise.ts', HZ = 120;

// A high pulley up and out from the right arm; the forearm swings down from 60° above horizontal to 40° below it
// (front view, shoulder at 90°). The cable from hand to pulley is perpendicular to the forearm at lead 40°, the end of
// the lift; gravity's horizontal arm peaks where the forearm is level (lead 0°), mid-lift and mid-lower.
const PULLEY: [number, number] = [603, -33];
const MACHINE: MachineDrawing = { view: 'front', svg: '', parts: { cable: { kind: 'cable', path: [PULLEY, [423, 181]], attach: 'hand_r' } } };
const FX = {
  id: 'fx_v1_10_high_cable', kind: 'rep', order: 'lift_first', view: 'front', viewWhy: 'the V1-10 fixture reads the front arm',
  camera: { full: 'standingFront', zoom: 'upperFront', subject: 'elbow_r' }, pose: 'standing',
  equipment: { kind: 'd_handle', attach: ['hand_r'], loadFrom: 'lastSet' },
  machine: { id: 'fx_high_pulley', settings: { pulley: 'high' }, drive: [] },
  tempo: { lift: 2, hold: 0.5, lower: 2, rest: 0.5 }, symmetric: true,
  joints: { shoulder_abd: 90, elbow_lead: [-60, 40] },
  movement: { breathe: 'out on lift' },
  muscles: { target: ['triceps'], helps: [], keepQuiet: ['upper_traps'], effort: { model: 'torque', chain: ['elbow_r'], force: { along: 'cable' } } },
  cues: ['Press the handle down and out.'],
  mistake: { name: 'Shrug', joints: { shrug_cm: [0, 4] }, tells: [{ text: 'The shoulder shrugs.', joint: 'shrug_cm' }] },
  sources: ['V1-10 fixture'],
} as const satisfies ExerciseGuide;
const gravity = { ...FX, muscles: { ...FX.muscles, effort: { model: 'torque', chain: ['elbow_r'], force: 'gravity' } } } as ExerciseGuide;
const researchAt = (peakAt: number): Research => ({
  id: FX.id, ranges: {}, tempo: FX.tempo, order: 'lift_first', kind: 'rep',
  muscles: { target: ['triceps'], helps: [], keepQuiet: ['upper_traps'], peakAt, peakSource: 'V1-10 fixture: the cable is perpendicular to the forearm' },
  mistake: { name: 'Shrug', tells: [], source: 'V1-10 fixture' }, sources: [],
});
const rigOf = (g: ExerciseGuide, m: MachineDrawing | null = MACHINE): Rig => ({ ...(rigFor(g, 'front') as Rig), machine: m });

/** The rep-0 samples of one figure, at the check's 120 Hz grid. */
function grid(g: ExerciseGuide): number[] {
  const N = Math.round(repSeconds(tempoOf(g, 'correct', 0)) * HZ);
  return Array.from({ length: N + 1 }, (_, i) => i / N);
}
/** The u where a function of u is largest (the first, as muscleTiming reads it). */
const argmax = (us: number[], f: (u: number) => number) => { const y = us.map(f); return us[y.indexOf(Math.max(...y))]!; };

describe('V1-10 A2: an overhead pulley peaks where the cable is most perpendicular to the forearm', () => {
  const rig = rigOf(FX), us = grid(FX);
  // the geometry alone: |sin| of the angle between the forearm (elbow to hand) and the cable (hand to pulley)
  const perp = (u: number) => {
    const f = rig.frame(poseAt(FX, u, 'correct', 0, rig)), e = rig.pivot(f, 'elbow_r'), h = rig.point(f, 'hand_r');
    const a = [h[0] - e[0], h[1] - e[1]], c = [PULLEY[0] - h[0], PULLEY[1] - h[1]];
    return Math.abs(a[0]! * c[1]! - a[1]! * c[0]!) / Math.hypot(a[0]!, a[1]!) / Math.hypot(c[0]!, c[1]!);
  };
  const uPerp = argmax(us, perp), research = researchAt(uPerp);
  const peakFails = (g: ExerciseGuide) => runChecks({ ...inputFor(LR_PATH, g), research, machines: { fx_high_pulley: MACHINE } }, ['muscleTiming'])[0]!
    .fails.filter(s => /target triceps (peaks|does not fall)/.test(s));

  it('the fixture numbers', () => {
    const e = effortOf(FX, 'correct', 0, rig), eg = effortOf(gravity, 'correct', 0, rig);
    if (typeof e === 'string' || typeof eg === 'string') throw new Error(`${e} ${eg}`);
    const uc = argmax(us, u => e(u).triceps!), ug = argmax(us, u => eg(u).triceps!);
    console.info(`[V1-10 A2] most perpendicular u=${uPerp.toFixed(4)} (|sin| ${perp(uPerp).toFixed(4)}); contact peak u=${uc.toFixed(4)} (${e(uc).triceps!.toFixed(4)}); gravity peak u=${ug.toFixed(4)} (${eg(ug).triceps!.toFixed(4)}); contact at u=0 ${e(0).triceps!.toFixed(4)}`);
    expect(Math.abs(uc - uPerp)).toBeLessThanOrEqual(1 / us.length);
    expect(perp(uPerp)).toBeGreaterThan(0.999);
    expect(Math.abs(ug - uPerp)).toBeGreaterThan(0.15);
  });
  it('fails muscleTiming under gravity', () => {
    expect(peakFails(gravity)).toEqual([expect.stringMatching(/target triceps peaks at u=0\.\d+, 0\.\d+ from research peakAt/)]);
  });
  it('passes muscleTiming under contact', () => {
    expect(peakFails(FX)).toEqual([]);
    expect(runChecks({ ...inputFor(LR_PATH, FX), research, machines: { fx_high_pulley: MACHINE } }, ['muscleTiming'])[0]).toMatchObject({ ok: true, fails: [] });
  });
});

describe('V1-10 A3: a machine with no force line fails with "no contact force"', () => {
  const along = (part: string) => ({ ...FX, muscles: { ...FX.muscles, effort: { model: 'torque', chain: ['elbow_r'], force: { along: part } } } }) as ExerciseGuide;
  it('the named part is not in the drawing', () => {
    expect(effortOf(along('stack'), 'correct', 0, rigOf(FX))).toBe('no contact force: part stack is not in machine fx_high_pulley, so the force along stack has no line');
  });
  it('the machine has no drawing', () => {
    expect(effortOf(FX, 'correct', 0, rigOf(FX, null))).toBe('no contact force: machine fx_high_pulley has no drawing, so the force along cable has no line');
  });
  it('the file has no machine', () => {
    const { machine: _, ...bare } = FX;
    expect(effortOf(bare as ExerciseGuide, 'correct', 0, rigOf(FX))).toBe('no contact force: the file has no machine, so the force along cable has no line');
  });
  it('muscleTiming fails with it', () => {
    const r = runChecks({ ...inputFor(LR_PATH, along('stack')), research: researchAt(0.5), machines: { fx_high_pulley: MACHINE } }, ['muscleTiming'])[0]!;
    expect(r.fails).toContain('muscleTiming fx_v1_10_high_cable: no contact force: part stack is not in machine fx_high_pulley, so the force along stack has no line');
  });
});

describe('V1-10 A1: gravity files are unchanged', () => {
  it('the lateral raise hash and muscleTiming note', () => {
    const inp = inputFor(LR_PATH, LR), [h, m] = runChecks(inp, ['hash', 'muscleTiming']);
    expect(guideHash(LR)).toBe('c1ac61634cd68bd4');
    expect(h!.ok).toBe(true);
    expect(m).toEqual({ check: 'muscleTiming', ok: true, fails: [], note: 'torque model (0.12 + 0.88·t)' });
  });
  it('an explicit force: gravity gives the same effort, bit for bit, as none', () => {
    const rig = rigFor(LR, 'front') as Rig, g = { ...LR, muscles: { ...LR.muscles, effort: { model: 'torque', chain: ['shoulder_r'], force: 'gravity' } } } as ExerciseGuide;
    for (const fig of ['correct', 'mistake'] as const) {
      const a = effortOf(LR, fig, 0, rig), b = effortOf(g, fig, 0, rig);
      if (typeof a === 'string' || typeof b === 'string') throw new Error(`${a} ${b}`);
      for (let i = 0; i <= 100; i++) expect(b(i / 100)).toEqual(a(i / 100));
    }
  });
});

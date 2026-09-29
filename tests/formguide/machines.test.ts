// V1-09: machines in the player (docs/FORM-GUIDE-PRODUCTION.md §10 card V1-09, A1-A7). Node only: the layer builder,
// the primitives, the stand-in and the frame-rate readout are pure; the DOM side is the gate's FG-4 block.
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import type { ExerciseGuide } from '@/formguide/model';
import { anchorAt, type Lever, type Slide } from '@/formguide/check/machines';
import { runChecks, type CheckId } from '@/formguide/check';
import { inputFor } from '@/formguide/check/node';
import { compile, countPaths, forbiddenEffects } from '@/formguide/check/svg';
import { MACHINES, MACHINE_CARDS, machineFor, type MachineArt } from '@/formguide/machines';
import { STAND_IN, STAND_IN_PLATES } from '@/formguide/machines/stand_in';
import { cableOps, carriageOps, leverOps, platesFor, stackMarkup, stackOps } from '@/formguide/machines/primitives';
import { HANDLES, HANDLE_CARDS } from '@/formguide/parts';
import { STACK_CLASS, cableClass, guideDrive, guideStops, layerFor, layerGroups, layerMarkup, partClass, setupSvgs, standInDrive } from '@/formguide/player/machineView';
import { REPS, guideRig, markupOf, momentFrame } from '@/formguide/player/guideView';
import { themeReader } from '@/formguide/rig/paint';
import { VIEWBOXES } from '@/formguide/model';
import { apply, mmul, opMat, type Op } from '@/formguide/rig/pose';
import type { Mat } from '@/formguide/rig/figureFront';
import type { Pt } from '@/formguide/rig/ik';
import { poseAt, sampleGuide } from '@/formguide/sample';
import { rigFor, type Rig } from '@/formguide/check/view';
import type { ChannelId } from '@/formguide/rig/joints';
import { lib_smith_machine_shoulder_press as SM } from './fixtures/solve/lib_smith_machine_shoulder_press';
import SMFX from './fixtures/solve/fixture.json';
import { lib_dumbbell_lateral_raise as LR } from '@/formguide/exercises/lib_dumbbell_lateral_raise';
import { FrameLog, LONG_PRESS_MS, longPress, quantile, statsLine } from '@/formguide/player/fps';
import { FpsPanel } from '@/formguide/player/ExercisePlayer';

// V1-04's follow fixture: a front press whose handles slide on rails and follow the hands the solver keeps on them.
const FXP: MachineArt = { ...(SMFX.machines.fx_press as unknown as MachineArt), moving: {
  bar_r: '<path d="M273 176h16v8h-16Z" fill="var(--iron-hi)" stroke="var(--ink)"/>', bar_l: '<path d="M111 176h16v8h-16Z" fill="var(--iron-hi)" stroke="var(--ink)"/>' } };
const LR_PATH = 'src/formguide/exercises/lib_dumbbell_lateral_raise.ts';
const rig = guideRig(LR, 'shoulder_abduction');
const I: Mat = [1, 0, 0, 1, 0, 0];
/** A keyframe's transform string (rig/pose.ts css) back to its matrix. */
function matOf(t: string): Mat {
  const ops: Op[] = [...t.matchAll(/(translate|rotate|scale)\(([^)]*)\)/g)].map(([, f, a]) => {
    const v = a!.split(',').map(x => parseFloat(x));
    return f === 'translate' ? ['t', v[0]!, v[1]!] : f === 'rotate' ? ['r', v[0]!] : ['s', v[0]!, v[1]!];
  });
  return ops.reduce((m, o) => mmul(m, opMat(o)), I);
}
/** The rep and the exact stop a chained keyframe offset was made from. */
function stopOf(g: ExerciseGuide, offset: number): { r: number; u: number; i: number } {
  for (let r = 0; r < REPS; r++) for (const [i, u] of guideStops(g, 'correct')(r).entries()) if (Math.round(((r + u) / REPS) * 1e4) / 1e4 === offset) return { r, u, i };
  throw new Error(`no stop at offset ${offset}`);
}
const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// The fixture machine: a lever about the right shoulder whose handle the right hand holds (a machine lateral raise),
// a seat that is set by height, and a stack the lever lifts.
const ARM: Lever = { kind: 'lever', pivot: [260, 128], bound: 'shoulder_r', radius: 176, deg: [11, 85], attach: 'hand_r' };
const A0 = anchorAt(ARM, 0);
const FX: MachineArt = {
  view: 'front',
  svg: '<path d="M240 100h40v20h-40Z" fill="var(--iron)" stroke="var(--ink)" stroke-width="1.6"/>',
  settings: { seat: { svg: '<path d="M150 380h100v12h-100Z" fill="var(--iron-sh)" stroke="var(--ink)" stroke-width="1.6"/>', shift: [0, -10] } },
  parts: { arm: ARM },
  moving: { arm: `<path d="M260 128L${A0[0]} ${A0[1]}" fill="none" stroke="var(--ink)" stroke-width="4"/><path d="M${A0[0] - 6} ${A0[1] - 3}h12v6h-12Z" fill="var(--iron-hi)" stroke="var(--ink)"/>` },
  stack: { part: 'arm', x: 20, top: 300, w: 40, plateH: 10, gap: 2, gain: 60, plateKg: 5, max: 12 },
};
const FXG = {
  ...LR, equipment: { ...LR.equipment, kind: 'none', attach: ['hand_r'] },
  machine: { id: 'fx_lever', settings: { seat: 2 }, drive: [{ part: 'arm', travel: [0, 1], chain: ['shoulder_r', 'elbow_r', 'wrist_r'] }] },
  mistake: { ...LR.mistake, setup: { setting: 'seat', wrong: 5, text: 'Seat too high: the handle sits above the hand.' } },
} as ExerciseGuide;
const fxRig = { ...rig, machine: FX };
const check = (g: ExerciseGuide, only: CheckId[], machines: Record<string, MachineArt> = { fx_lever: FX }) =>
  runChecks({ ...inputFor(LR_PATH, g), machines }, only);

describe('V1-09 primitives: transforms only, each anchor where the part puts it', () => {
  const at = (ops: Op[], p: Pt) => apply(ops.reduce((m, o) => mmul(m, opMat(o)), I), p);
  it('a lever turns its travel-0 anchor onto anchorAt for any travel', () => {
    for (const s of [0, 0.25, 0.5, 1]) expect(dist(at(leverOps(ARM, s), A0), anchorAt(ARM, s))).toBeLessThan(1e-3);
  });
  it('a carriage moves along its rail', () => {
    const C: Slide = { kind: 'carriage', path: [[10, 20], [110, 70]] };
    for (const s of [0, 0.3, 1]) expect(dist(at(carriageOps(C, s), anchorAt(C, 0)), anchorAt(C, s))).toBeLessThan(1e-3);
  });
  it('a cable is the unit line scaled and turned from its pulley to its end', () => {
    for (const end of [[300, 400], [-50, 10], [100, 100.5]] as Pt[]) {
      const ops = cableOps([100, 100], end);
      expect(dist(at(ops, [0, 0]), [100, 100])).toBeLessThan(1e-3);
      expect(dist(at(ops, [0, 1]), end)).toBeLessThan(2e-3);
      expect(ops.find(o => o[0] === 's')![1]).toBe(1);        // the line's width axis is never scaled
    }
  });
});

describe('V1-09 A1: the fixture machine plays with transforms only, its anchor on the solved hand', () => {
  const m = layerMarkup(FX, { kg: 20, settings: FXG.machine!.settings });
  const groups = layerGroups(FX, guideStops(FXG, 'correct'), guideDrive(FXG, fxRig, 'correct'), REPS);
  it('noFilters: no filter, blur, shadow or mask in the layer, and every keyframe animates transform only', () => {
    expect(forbiddenEffects(m)).toEqual([]);
    for (const g of groups) for (const f of g.frames) expect(Object.keys(f).sort()).toEqual(['offset', 'transform']);
    expect(groups.map(g => g.className).sort()).toEqual([STACK_CLASS, partClass('arm')].sort());
    for (const g of groups) expect(m).toContain(`class="fg-mp ${g.className}"`);
  });
  it('each keyframe puts the lever handle on its arc at the drive\'s travel', () => {
    const frames = groups.find(g => g.className === partClass('arm'))!.frames, drive = guideDrive(FXG, fxRig, 'correct');
    for (const f of frames) {
      const { r, u, i } = stopOf(FXG, f.offset);
      expect(dist(apply(matOf(f.transform!), A0), anchorAt(ARM, drive(r, i, u).travel.arm!))).toBeLessThan(1e-3);
    }
  });
  it('on a follow machine (V1-04\'s fixture), every kept keyframe puts each handle within 0.5 of the sampler\'s solved hand', () => {
    const smRig = { ...(rigFor(SM, 'front') as Rig), machine: FXP }, gs = layerGroups(FXP, guideStops(SM, 'correct'), guideDrive(SM, smRig, 'correct'), REPS);
    let worst = 0, n = 0;
    for (const [part, at] of [['bar_r', 'hand_r'], ['bar_l', 'hand_l']] as const) {
      const p = FXP.parts[part]!, a0 = anchorAt(p, 0);
      for (const f of gs.find(g => g.className === partClass(part))!.frames) {
        const { r, i } = stopOf(SM, f.offset), s = sampleGuide(SM, 'correct', r, smRig);
        const pose = Object.fromEntries(s.channels.map(ch => [ch.id, ch.stops[i]![1]])) as Record<ChannelId, number>;
        worst = Math.max(worst, dist(apply(matOf(f.transform!), a0), smRig.point(smRig.frame(pose), at))); n++;
      }
    }
    expect(n).toBeGreaterThan(40);
    console.info(`V1-09 A1: ${n} keyframes, worst handle-to-solved-hand gap ${worst.toExponential(2)} units`);
    expect(worst).toBeLessThan(0.5);
  });
  it('the layer runs on the figure\'s clock: offsets 0..1 rising, the last frame the start pose', () => {
    for (const g of groups) {
      const o = g.frames.map(f => f.offset);
      expect(o[0]).toBe(0); expect(o[o.length - 1]).toBe(1);
      o.forEach((v, i) => { if (i) expect(v).toBeGreaterThan(o[i - 1]!); });
      expect(g.frames[g.frames.length - 1]!.transform).toBe(g.frames[0]!.transform);
    }
  });
});

describe('V1-09 A2: the stack rises with the load, 0 plates at 0 kg', () => {
  const st = FX.stack!, plates = (svg: string) => countPaths(svg);
  it('pinned plates follow the load: 0 at 0 kg, one per started plate, capped at the column', () => {
    expect([0, 0.1, 5, 5.1, 20, 1000].map(kg => platesFor(st, kg))).toEqual([0, 1, 1, 2, 4, 12]);
    for (const kg of [0, 7, 20, 1000]) { const s = stackMarkup(st, kg); expect(plates(s.moving) + plates(s.fixed)).toBe(st.max); }
  });
  it('the rising group holds 0 plates at 0 kg and more with more load', () => {
    const moving = (kg: number) => { const m = layerMarkup(FX, { kg }); return countPaths(/class="fg-mp fg-ms">(.*?)<\/g>/.exec(m)![1]!); };
    expect(moving(0)).toBe(0);
    expect(moving(20)).toBe(4);
    expect(moving(60)).toBeGreaterThan(moving(20));
  });
  it('it rises by travel × gain (up is -y), and sits still at travel 0', () => {
    expect(stackOps(st, 0)).toEqual([['t', 0, 0]]);
    expect(stackOps(st, 0.5)).toEqual([['t', 0, -30]]);
    const frames = layerGroups(FX, guideStops(FXG, 'correct'), guideDrive(FXG, fxRig, 'correct'), REPS).find(g => g.className === STACK_CLASS)!.frames;
    const ys = frames.map(f => matOf(f.transform!)[5]);
    expect(Math.min(...ys)).toBeCloseTo(-st.gain, 1);          // the top of the lift
    expect(Math.max(...ys)).toBe(0);
  });
});

describe('V1-09 A3: the setup moment differs right and wrong', () => {
  it('setupDiffers passes the fixture, and the layer draws the seat where each setting puts it', () => {
    expect(check(FXG, ['setupDiffers'])[0]).toMatchObject({ ok: true, fails: [] });
    const right = layerMarkup(FX, { kg: 0, settings: { seat: 2 } }), wrong = layerMarkup(FX, { kg: 0, settings: { seat: 2 }, wrong: { setting: 'seat', value: 5 } });
    expect(right).toContain('class="fg-set-seat" transform="translate(0 -20)"');
    expect(wrong).toContain('class="fg-set-seat" transform="translate(0 -50)"');
  });
  it('the player\'s setup pair: the machine at the right and the wrong setting under the start pose, fully resolved', () => {
    const read = themeReader('silent-black'), m = markupOf(FXG, rig, read, { id: 'snap', mistake: false, load: 20 });
    const pics = setupSvgs(FXG, FX, { markup: m, frame: momentFrame(FXG, rig, 'correct', 0, m) }, read, VIEWBOXES.standingFront, 20);
    expect(pics.map(p => p.wrong)).toEqual([false, true]);
    expect(pics[0]!.svg).not.toBe(pics[1]!.svg);
    for (const p of pics) { expect(p.svg).not.toContain('var('); expect(p.svg.indexOf('fg-machine')).toBeLessThan(p.svg.indexOf('fg-fig')); }
    const plain = { ...FXG, mistake: { ...FXG.mistake, setup: undefined } } as ExerciseGuide;
    expect(setupSvgs(plain, FX, { markup: m, frame: momentFrame(plain, rig, 'correct', 0, m) }, read, VIEWBOXES.standingFront, 20)).toHaveLength(1);
  });
  it('and fails when the wrong setting draws the same picture', () => {
    const g = { ...FXG, mistake: { ...FXG.mistake, setup: { ...FXG.mistake.setup!, wrong: 2 } } } as ExerciseGuide;
    expect(check(g, ['setupDiffers'])[0]!.fails.join()).toMatch(/draw the same setup moment/);
  });
});

describe('V1-09 A4: a machine is at most 80 paths', () => {
  const shapes = (svg: string) => compile(svg).shapes.length;
  it('the stand-in is exactly the budget, every shape a path, at its heaviest load', () => {
    const m = layerMarkup(STAND_IN, { kg: 1000 });
    expect(countPaths(m)).toBe(80);
    expect(shapes(m)).toBe(80);
    expect(platesFor(STAND_IN.stack!, 1000)).toBe(STAND_IN_PLATES);
  });
  it('every drawn machine in the library, with its moving parts and full stack, is ≤ 80 paths and token-only', () => {
    for (const [id, m] of Object.entries(MACHINES)) {
      if (!m) continue;
      const svg = layerMarkup(m, { kg: 1000 });
      expect(countPaths(svg), id).toBeLessThanOrEqual(80);
      expect(shapes(svg), id).toBeLessThanOrEqual(80);
      expect(forbiddenEffects(svg), id).toEqual([]);
    }
  });
  it('the stand-in paints with theme tokens only', () => {
    const svg = layerMarkup(STAND_IN, { kg: 1000 });
    expect(svg).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i);
    expect(svg).toMatch(/var\(--iron\)/);
  });
});

describe('V1-09 A5: the lateral raise mounts no machine layer', () => {
  it('no layer without Stress, nor with Stress outside compare mode; the stand-in only with both', () => {
    for (const o of [{ stress: false, compare: false }, { stress: false, compare: true }, { stress: true, compare: false }]) expect(layerFor(LR, o)).toBeNull();
    expect(layerFor(LR, { stress: true, compare: true })).toEqual({ art: STAND_IN, standIn: true });
  });
  it('the stand-in plays on the lateral raise\'s clock: the cable ends at the right hand and the stack rises with the arm', () => {
    const groups = layerGroups(STAND_IN, guideStops(LR, 'correct'), standInDrive(LR, rig, 'correct'), REPS);
    const cable = groups.find(g => g.className === cableClass('cable'))!.frames, stack = groups.find(g => g.className === STACK_CLASS)!.frames;
    const top = cable.reduce((b, f) => (matOf(f.transform!)[5] < matOf(b.transform!)[5] ? f : b));
    expect(cable.length).toBeGreaterThan(20);
    const { r, u } = stopOf(LR, top.offset);
    const hand = rig.point(rig.frame(poseAt(LR, u, 'correct', r)), 'hand_r');
    expect(dist(apply(matOf(top.transform!), [0, 1]), hand)).toBeLessThan(0.5);
    expect(Math.min(...stack.map(f => matOf(f.transform!)[5]))).toBeLessThan(-80);
  });
});

describe('V1-09 A7: a file naming an unbuilt machine fails with the card that draws it', () => {
  it('ten null slots, each naming its card; the handles likewise', () => {
    expect(Object.keys(MACHINES).sort()).toEqual(Object.keys(MACHINE_CARDS).sort());
    expect(Object.keys(MACHINES)).toHaveLength(10);
    for (const [id, card] of Object.entries(MACHINE_CARDS)) {
      expect(MACHINES[id as keyof typeof MACHINES]).toBeNull();
      expect(machineFor(id)).toBe(`machine ${id} is drawn by ${card}`);
    }
    expect(Object.keys(HANDLES).sort()).toEqual(['d_handle', 'v_handle', 'wide_bar']);
    for (const id of Object.keys(HANDLE_CARDS)) expect(HANDLES[id as keyof typeof HANDLES]).toBeNull();
  });
  it('the machine checks fail naming the machine and its card; the player refuses it the same way', () => {
    const g = { ...FXG, machine: { ...FXG.machine!, id: 'leg_press_45' } } as ExerciseGuide;
    for (const r of check(g, ['handsOnHandle', 'machinePivot', 'pathBudget', 'setupDiffers'], {})) expect(r.fails.join(), r.check).toMatch(/machine leg_press_45 is drawn by V1-14/);
    expect(() => layerFor(g, { stress: false, compare: false })).toThrow(/machine leg_press_45 is drawn by V1-14/);
  });
  it('an id with no slot at all still says it has no drawing', () => {
    expect(machineFor('nowhere')).toMatch(/machine nowhere has no drawing/);
  });
});

describe('V1-09 A6: the frame-rate panel opens only on a long-press and stores nothing', () => {
  it('the long-press fires once after 600 ms held still; lifting, leaving or moving 10 px cancels it', () => {
    vi.useFakeTimers();
    try {
      const fire = vi.fn(), lp = longPress(fire), at = { clientX: 100, clientY: 100 };
      lp.down(at); vi.advanceTimersByTime(LONG_PRESS_MS - 1); lp.up(); vi.advanceTimersByTime(1000);
      lp.down(at); lp.move({ clientX: 111, clientY: 100 }); vi.advanceTimersByTime(1000);
      lp.down(at); lp.move({ clientX: 105, clientY: 105 }); vi.advanceTimersByTime(LONG_PRESS_MS - 1);
      expect(fire).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(fire).toHaveBeenCalledTimes(1);
      // the lift's own clock: held 600 ms fires even if the timer has not run yet; 599 ms or a leave does not
      lp.down({ ...at, timeStamp: 1000 }); lp.up({ ...at, timeStamp: 1599 }); vi.advanceTimersByTime(1000);
      lp.down({ ...at, timeStamp: 1000 }); lp.leave(); vi.advanceTimersByTime(1000);
      expect(fire).toHaveBeenCalledTimes(1);
      lp.down({ ...at, timeStamp: 1000 }); lp.up({ ...at, timeStamp: 1600 });
      expect(fire).toHaveBeenCalledTimes(2);
      vi.advanceTimersByTime(1000);
      expect(fire).toHaveBeenCalledTimes(2);
    } finally { vi.useRealTimers(); }
  });
  it('the panel renders nothing until opened, then the last play\'s median and p95 and the Stress toggle', () => {
    const p = { stats: null, stress: false, onStress: () => {}, onClose: () => {} };
    expect(FpsPanel({ ...p, open: false })).toBeNull();
    const txt = JSON.stringify(FpsPanel({ ...p, open: true, stats: { frames: 20, median: 16.7, p95: 33.4 } }));
    expect(txt).toContain('Median 16.7 ms (60 fps) · p95 33.4 ms · 20 frames');
    expect(txt).toContain('Stress');
  });
  it('the frame log keeps the last play only: median and p95 of its intervals, pauses not counted', () => {
    const log = new FrameLog();
    expect(log.stats()).toBeNull();
    log.start(); [0, 16, 32, 48, 98].forEach(t => log.tick(t));       // 16, 16, 16, 50
    log.gap(); log.tick(5000); log.tick(5016);                         // the pause is no frame: + 16
    expect(log.stats()).toEqual({ frames: 5, median: 16, p95: 50 });
    log.start(); log.tick(0); log.tick(20);
    expect(log.stats()).toEqual({ frames: 1, median: 20, p95: 20 });
    expect(quantile([], 0.5)).toBeNaN();
  });
  it('writes nothing: no storage or store in the layer, the readout or the player, and a played log touches neither', () => {
    for (const f of ['src/formguide/player/fps.ts', 'src/formguide/player/machineView.ts', 'src/formguide/player/ExercisePlayer.tsx', 'src/formguide/machines/stand_in.ts'])
      expect(readFileSync(f, 'utf8'), f).not.toMatch(/localStorage|sessionStorage|indexedDB|@\/core\/store|document\.cookie/);
    const set = vi.fn(), store = { getItem: () => null, setItem: set, removeItem: set, clear: set, key: () => null, length: 0 };
    vi.stubGlobal('localStorage', store);
    try {
      const log = new FrameLog(); log.start(); for (let t = 0; t < 1000; t += 16) log.tick(t);
      statsLine(log.stats()); FpsPanel({ open: true, stats: log.stats(), stress: true, onStress: () => {}, onClose: () => {} });
      expect(set).not.toHaveBeenCalled();
    } finally { vi.unstubAllGlobals(); }
  });
});

// Dumbbell Lateral Raise, front view: rig-final/gen.mjs lateralRaise() at DEMO_COMMIT (the player uses it unpatched).
import { n2, n3, n4, progress, rad } from '../rig/math';
import { smoothNumbers } from '../rig/stops';
import type { MoveSpec } from '../rig/api';
import type { Move, Truth } from './types';

export const LR_OPT = { H: [179, 156] as [number, number], A0: 12, A1: 76, BEND: 15, DROP: 20 };
export type LrOpt = typeof LR_OPT;

export function makeLateralRaise(o: LrOpt = LR_OPT) {
  const { H, BEND } = o;
  const A = (p: number) => o.A0 + o.A1 * p;     // arm out from the side, degrees
  const grip = (p: number, sgn: number): [number, number] => { const a = A(p); const E = [22 + 38 * Math.sin(rad(a)), -62 + 38 * Math.cos(rad(a))]; const Gp = [E[0]! + 40 * Math.sin(rad(a - BEND)), E[1]! + 40 * Math.cos(rad(a - BEND))]; return [sgn * Gp[0]!, Gp[1]!]; };
  const key = (p: number) => { const g = grip(p, 1); return { p: n2(p), A: n2(A(p)), outFromSide: n2(A(p)), inside: n2(180 - BEND), gripR: [n2(g[0] + H[0]), n2(g[1] + H[1])] }; };
  const keyTable = () => [0, 0.25, 0.5, 0.75, 1].map(key);
  const smooth = () => smoothNumbers(u => { const p = progress(u); return { A: A(p), db: A(p) - BEND, g: grip(p, 1) }; }, ['A', 'db'], q => q.g);
  // spec 3.5 truth table, with the ranges anim-dumbbell-lateral-raise/shoot.cjs checks
  const truth = (): Truth[] => {
    const g0 = grip(0, 1), g1 = grip(1, 1), SHOULDER_Y = 94;
    return [
      { name: 'setup arm out from the side', value: A(0), min: 10, max: 15 },
      { name: 'top arm out from the side', value: A(1), min: 85, max: 90 },
      { name: 'elbow inside angle', value: 180 - BEND, min: 165, max: 165 },
      { name: 'setup grip distance from (206.8, 171.2)', value: Math.hypot(g0[0] + H[0] - 206.8, g0[1] + H[1] - 171.2), min: 0, max: 0.2 },
      { name: 'top grip distance from (277.2, 107)', value: Math.hypot(g1[0] + H[0] - 277.2, g1[1] + H[1] - 107), min: 0, max: 0.2 },
      { name: 'top hand below the shoulder line', value: g1[1] + H[1] - SHOULDER_Y, min: 12, max: Infinity },
    ];
  };
  const channels: Move['channels'] = [
    { className: 'lr-ua-r', kind: 'rotate', at: p => `rotate(${n4(-A(p))}deg)` },
    { className: 'lr-ua-l', kind: 'rotate', at: p => `rotate(${n4(A(p))}deg)` },
    { className: 'lr-db-r', kind: 'rotate', at: p => `rotate(${n4(A(p) - BEND)}deg)` },
    { className: 'lr-db-l', kind: 'rotate', at: p => `rotate(${n4(-(A(p) - BEND))}deg)` },
    { className: 'lr-trail', kind: 'dashoffset', at: p => n3(1 - p) },
    { className: 'lr-eff', kind: 'opacity', at: p => n3(0.75 + 0.25 * p) },
    { className: 'lr-ten', kind: 'opacity', at: p => n3(p) },
    { className: 'lr-hlp', kind: 'opacity', at: p => n3(1 - 0.3 * p) },
  ];
  return { o, A, grip, keyTable, smooth, truth, channels };
}
export const LR_SPEC: MoveSpec = {
  id: 'lr', exerciseId: 'lib_dumbbell_lateral_raise', view: 'front', cam: 'Front view', rep: 4,
  caps: ['Raise to shoulder height, 1 s', 'Pause, shoulders down', 'Lower slowly, 2 s', 'Reset at your sides'],
  tempo: '1 s up · 2 s down', picsLine: 'Raise 1 s, pause, lower 2 s',
  srText: 'One rep: raise your arms out to the sides for 1 second, pause, lower slowly for 2 seconds, reset.',
  chips: [
    { id: 'shoulders', label: 'Shoulders', caption: 'Keep your shoulders down, away from your ears. No shrug.' },
    { id: 'path', label: 'Path', caption: 'Out to the sides and up to shoulder height, no higher.' },
    { id: 'elbows', label: 'Elbows', caption: 'A soft bend in your elbows that stays the same up and down.' },
  ],
  pics: ['Stand tall, elbows soft', 'Lift out to the sides', 'Stop at shoulder height', 'Lower slowly, 2 s'],
  picsAt: [0, 0.125, 0.31, 0.625],
  roles: { sideDelts: 'side_delts', upperTraps: 'upper_traps' },
};

export const lateralRaise = makeLateralRaise();
export const dumbbellLateralRaise: Move = { spec: LR_SPEC, stops: { lift: 0.25, return: 0.5 }, channels: lateralRaise.channels, glow: 'lr-ten' };

// Machine Chest Press, side view: the motion of the demo's chest press PLAYER (rig-final/gen.mjs chestPress() with the
// anim-machine-chest-press/build.mjs patches: P, X0, E0, pole1, the p^4 pole blend and PACE), at DEMO_COMMIT.
import { LEN } from '../rig/parts';
import { add, deg, mul, n2, n3, n4, norm, pace, progress, rad, solve3, type Solve } from '../rig/math';
import { SAMPLES, smoothNumbers } from '../rig/stops';
import type { MoveSpec } from '../rig/api';
import type { Move, Truth } from './types';

export const CP_OPT = {
  H: [150, 206] as [number, number],   // hip on the stage
  P: [203.5, 58] as [number, number],  // lever pivot
  R: 100,                              // lever length to the grip centre
  X0: 181, X1: 226,                    // grip x: setup, pressed
  HALF: 13,                            // handle half-length
  Z1: 6,                               // hand 6 units out from the shoulder at the end
  E0: [144.5, 166] as [number, number],// chosen setup elbow (stage)
  POLE1: [0, 0.95, 1],
  PACE: [6.2061, 0.5597, 0.2101, 4.7279, 0.9953, 8.658, 1.6495],
};
export type CpOpt = typeof CP_OPT;
export type CpPose = Solve & { s: number; x: number; G: number[]; alpha: number; ua: number; fa: number; lift: number; p: number };

export function makeChestPress(o: CpOpt = CP_OPT) {
  const { H, P, R, X0, X1, Z1, E0 } = o;
  const S = [H[0], H[1] - 62, 0];                // shoulder (150,144), fixed
  const lever = (x: number) => -deg(Math.asin((x - P[0]) / R));
  const grip2 = (x: number): [number, number] => [x, P[1] + Math.sqrt(R * R - (x - P[0]) ** 2)];
  // Setup: from the chosen elbow, the sideways (z) offsets that keep both bones full length.
  const ez0 = Math.sqrt(LEN.upperArm ** 2 - (E0[0] - S[0]!) ** 2 - (E0[1] - S[1]!) ** 2);
  const G0 = grip2(X0), dz0 = Math.sqrt(LEN.forearm ** 2 - (G0[0] - E0[0]) ** 2 - (G0[1] - E0[1]) ** 2);
  const Z0 = ez0 + dz0;                          // hand further out than the elbow at setup
  const pole0 = norm([E0[0] - S[0]!, E0[1] - S[1]!, ez0]), pole1 = norm(o.POLE1);
  const poseAt = (p: number) => {
    const x = X0 + (X1 - X0) * p, G = [...grip2(x), Z0 + (Z1 - Z0) * p];
    const w = p ** 4, pole = norm(add(mul(pole0, 1 - w), mul(pole1, w)));
    const r = solve3(S, G, LEN.upperArm, LEN.forearm, pole);
    return { s: p, x, G, alpha: lever(x), ...r, ua: -r.phi, fa: -(r.psi - r.phi), lift: 0.5 * (x - X0) };
  };
  const pose = (q: number): CpPose => ({ ...poseAt(pace(o.PACE, q)), p: q });
  const a0 = lever(X0), a1 = lever(X1);
  const trailS = (p: number) => (a0 - pose(p).alpha) / (a0 - a1);      // share of the handle-tip arc done
  const smooth = () => smoothNumbers(u => pose(progress(u)), ['ua', 'fa', 'alpha'], q => q.G);
  // analytic check: hand vs handle half-way between baked samples
  const maxDrift = () => {
    let md = 0;
    for (let i = 0; i < SAMPLES.length - 1; i++) {
      const a = pose(progress(SAMPLES[i]! / 100)), b = pose(progress(SAMPLES[i + 1]! / 100));
      const m = (k: 'ua' | 'fa' | 'fu' | 'ff' | 'alpha') => (a[k] + b[k]) / 2;
      const phi = -m('ua'), psi = phi - m('fa');
      const hand = [S[0]! + LEN.upperArm * m('fu') * Math.sin(rad(phi)) + LEN.forearm * m('ff') * Math.sin(rad(psi)), S[1]! + LEN.upperArm * m('fu') * Math.cos(rad(phi)) + LEN.forearm * m('ff') * Math.cos(rad(psi))];
      const al = m('alpha'), hdl = [P[0] - R * Math.sin(rad(al)), P[1] + R * Math.cos(rad(al))];
      md = Math.max(md, Math.hypot(hand[0]! - hdl[0]!, hand[1]! - hdl[1]!));
    }
    return md;
  };
  const row = (q: CpPose) => ({ p: n2(q.p), grip: [n2(q.G[0]!), n2(q.G[1]!), n2(q.G[2]!)], elbow: q.E.map(n2), lever: n2(q.alpha), upper: n2(q.ua), fu: n3(q.fu), fore: n2(q.fa), ff: n3(q.ff), inside: n2(q.inside), outFromSide: n2(q.outFromSide), forward: n2(q.forward), lift: n2(q.lift) });
  const keyTable = () => [0, 0.25, 0.5, 0.75, 1].map(p => row(pose(p)));
  // spec 3.1 truth table, with the ranges anim-machine-chest-press/shoot.cjs checks
  // A grip the arm cannot reach reads as a straight, locked arm (inside angle 180), so the range check reports it.
  const truth = (): Truth[] => {
    const reach = (p: number): CpPose | null => { try { return pose(p); } catch { return null; } };
    const s = pose(0), e = reach(1);
    if (!e) return [{ name: 'pressed elbow inside angle', value: 180, min: 155, max: 168 }];
    let minFu = 9; for (let i = 0; i <= 100; i++) minFu = Math.min(minFu, pose(i / 100).fu);
    return [
      { name: 'setup elbow inside angle', value: s.inside, min: 80, max: 95 },
      { name: 'pressed elbow inside angle', value: e.inside, min: 155, max: 168 },
      { name: 'setup arm out from the side', value: s.outFromSide, min: 45, max: 60 },
      { name: 'setup arm forward angle', value: s.forward, min: -18, max: -10 },
      { name: 'pressed arm forward angle', value: e.forward, min: 75, max: 85 },
      { name: 'shoulder travel', value: e.forward - s.forward, min: 88, max: 100 },
      { name: 'upper arm drawn length (min)', value: minFu, min: 0.55, max: 1 },
    ];
  };
  const channels: Move['channels'] = [
    { className: 'cp-ua', kind: 'rotate', at: p => `rotate(${n4(pose(p).ua)}deg)` },
    { className: 'cp-ul', kind: 'scaleY', at: p => `scaleY(${n4(pose(p).fu)})` },
    { className: 'cp-fa', kind: 'composite', at: p => { const q = pose(p); return `translateY(${n3(-(1 - q.fu) * LEN.upperArm)}px) rotate(${n4(q.fa)}deg)`; } },
    { className: 'cp-fl', kind: 'scaleY', at: p => `scaleY(${n4(pose(p).ff)})` },
    { className: 'cp-hd', kind: 'translateY', at: p => `translateY(${n3(-(1 - pose(p).ff) * LEN.forearm)}px)` },
    { className: 'cp-lever', kind: 'rotate', at: p => `rotate(${n4(pose(p).alpha)}deg)` },
    { className: 'cp-stack', kind: 'translateY', at: p => `translateY(${n3(-pose(p).lift)}px)` },
    { className: 'cp-cable', kind: 'scaleY', at: p => `scaleY(${n4((45 - pose(p).lift) / 45)})` },
    { className: 'cp-trail', kind: 'dashoffset', at: p => n3(1 - trailS(p)) },
    { className: 'cp-eff', kind: 'opacity', at: p => n3(0.75 + 0.25 * p) },
    { className: 'cp-ten', kind: 'opacity', at: p => n3(p) },
  ];
  return { o, S, pose, lever, a0, a1, smooth, maxDrift, keyTable, truth, channels };
}

export const CP_SPEC: MoveSpec = {
  id: 'cp', exerciseId: 'lib_machine_chest_press', view: 'side', cam: 'Side view', rep: 4,
  caps: ['Press out, 1 s', 'Pause, don’t lock out', 'Back slowly, 2 s', 'Reset, light chest stretch'],
  tempo: '1 s out · 2 s back', picsLine: 'Press out 1 s, pause, back 2 s',
  srText: 'One rep: press out for 1 second, pause, back slowly for 2 seconds, reset.',
  chips: [
    { id: 'grip', label: 'Grip', caption: 'Hold the middle of the handle. Wrists straight, not bent back.' },
    { id: 'path', label: 'Path', caption: 'Handles stay at mid-chest height the whole way out and back.' },
    { id: 'seat', label: 'Seat', caption: 'Set the seat so the handles line up with the middle of your chest.' },
  ],
  pics: ['Setup: handles at mid-chest', 'Press straight out', 'Arms almost straight, no lock', 'Back slowly, 2 s'],
  picsAt: [0, 0.125, 0.31, 0.625],
  roles: { chest: 'chest', frontDelts: 'front_delts', triceps: 'triceps' },
};

export const chestPress = makeChestPress();
export const machineChestPress: Move = { spec: CP_SPEC, stops: { lift: 0.25, return: 0.5 }, channels: chestPress.channels, glow: 'cp-ten' };

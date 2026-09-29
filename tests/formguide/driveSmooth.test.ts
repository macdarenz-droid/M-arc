// V1-04 A0, the check-in gate (docs/FORM-GUIDE-PRODUCTION.md §10.5, D-FG7 (b)): on the real rig, does a machine's
// drive pass smoothness (c) (limit 3×, check/smooth.ts) with the hand or foot held on the part's one-dimensional path?
// Two ways, over one 4 s rep (lift 1, hold 0.5, lower 2, rest 0.5) at the sampler's stops, values rounded to 1e-4 as
// sampleGuide writes them:
//   (i) travel-driven: the part's travel is the minimum-jerk curve and both limb channels are solved to it;
//  (ii) joint driver: one channel is the minimum-jerk curve and the other is solved to keep the point on the path.
// A geometry is buildable only if (ii) gives (c) ≤ 3 and a gap < 0.5 units. Each geometry is a straight path from the
// "end" pose (near lockout) back to a start point at `d0` of the end distance from the root joint (shoulder or hip);
// the envelope rows vary d0 and the lockout bend. The side arm and leg are FG-6's.
import { describe, expect, it } from 'vitest';
import type { ChannelId, Pose } from '@/formguide/rig/joints';
import { apply, frontFrame, handAt, inv, sideFrame, sidePivot, sidePoint, sideWorldMat, worldMat } from '@/formguide/rig/pose';
import { envelope, stopsFor, windowsFor } from '@/formguide/sample';
import { LIM, stopJerk } from '@/formguide/check/smooth';

type P = [number, number];
type Limb = { name: string; chans: [ChannelId, ChannelId]; point: (p: Pose) => P; root: (p: Pose) => P };
const pose = (L: Limb, x: number[]): Pose => ({ [L.chans[0]]: x[0], [L.chans[1]]: x[1] });

/** The real front arm, seated (the shoulder rises with abduction, pose.ts riseOf). */
const FRONT: Limb = {
  name: 'front arm', chans: ['shoulder_abd_r', 'elbow_lead_r'],
  point: p => handAt(frontFrame('seated', p), 'r'), root: p => apply(worldMat('shoulder_r', frontFrame('seated', p)), [0, 0]),
};

/** FG-6's side arm, seated (the shoulder rises with flexion), the fist's centre on the path. */
const SIDE_ARM: Limb = {
  name: 'side arm', chans: ['shoulder_flex_r', 'elbow_flex_r'],
  point: p => sidePoint(sideFrame('seated', p), 'hand_r'), root: p => sidePivot(sideFrame('seated', p), 'shoulder_r'),
};
/** FG-6's side leg, read in the pelvis's frame (the seat holds the pelvis; the seated pose would place it by the feet),
 * the sole on the sled. */
const inPelvis = (p: Pose, q: (f: ReturnType<typeof sideFrame>) => P): P => { const f = sideFrame('seated', p); return apply(inv(sideWorldMat('pelvis', f)), q(f)); };
const LEG: Limb = {
  name: 'side leg', chans: ['hip_flex_r', 'knee_flex_r'],
  point: p => inPelvis(p, f => sidePoint(f, 'foot_r')), root: p => inPelvis(p, f => sidePivot(f, 'hip_r')),
};

/** Both channels to a point: Newton on the rig's own forward kinematics. */
function reach(L: Limb, T: P, seed: number[]): { x: number[]; r: number } {
  let x = [...seed];
  for (let it = 0; it < 100; it++) {
    const p = L.point(pose(L, x)), r = [p[0] - T[0], p[1] - T[1]] as P;
    if (Math.hypot(...r) < 1e-11) break;
    const J = [0, 1].map(k => { const y = [...x]; y[k]! += 1e-6; const q = L.point(pose(L, y)); return [(q[0] - p[0]) / 1e-6, (q[1] - p[1]) / 1e-6] as P; });
    const det = J[0]![0] * J[1]![1] - J[1]![0] * J[0]![1];
    let dx = [-(J[1]![1] * r[0] - J[1]![0] * r[1]) / det, -(-J[0]![1] * r[0] + J[0]![0] * r[1]) / det];
    const m = Math.max(...dx.map(Math.abs));
    if (m > 5) dx = dx.map(v => (v * 5) / m);
    x = x.map((v, k) => v + dx[k]!);
  }
  const p = L.point(pose(L, x));
  return { x, r: Math.hypot(p[0] - T[0], p[1] - T[1]) };
}
/** Signed distance of the point from the line through P0 along dir. */
const off = (p: P, P0: P, dir: P) => dir[0] * (p[1] - P0[1]) - dir[1] * (p[0] - P0[0]);
/** Channel k solved to put the point on the line, the other held. */
function onLine(L: Limb, x: number[], k: number, P0: P, dir: P): { x: number[]; r: number } {
  const d = (y: number) => { const z = [...x]; z[k] = y; return off(L.point(pose(L, z)), P0, dir); };
  let y = x[k]!;
  for (let it = 0; it < 100; it++) {
    const f = d(y);
    if (Math.abs(f) < 1e-11) break;
    const s = -f / ((d(y + 1e-6) - f) / 1e-6);
    y += Math.abs(s) > 5 ? 5 * Math.sign(s) : s;
  }
  const z = [...x]; z[k] = y;
  return { x: z, r: Math.abs(d(y)) };
}

const TEMPO = { lift: 1, hold: 0.5, lower: 2, rest: 0.5 }, REP_S = 4;
const WS = windowsFor(TEMPO, 'lift_first', 'rep'), STOPS = stopsFor(TEMPO, 'lift_first', 'rep');
const r4 = (v: number) => Math.round(v * 1e4) / 1e4;
/** check/index.ts smoothness (c) on written stops: every channel moving ≥ 10° in a moving phase, the worst. */
function cOf(tracks: number[][]): number {
  let worst = 0;
  for (const tr of tracks) for (const w of WS.filter(x => x.move)) {
    const s = STOPS.map((u, i) => [u, r4(tr[i]!)] as const).filter(([u]) => u >= w.u0 - 1e-9 && u <= w.u1 + 1e-9);
    const v = s.map(x => x[1]);
    if (Math.max(...v) - Math.min(...v) >= LIM.travel) worst = Math.max(worst, stopJerk(s, w.u0, w.u1, REP_S));
  }
  return worst;
}

type Geo = { name: string; L: Limb; end: number[]; dirDeg: number; d0: number; driver: 0 | 1 };
type Result = { travelDriven: number; joint: number; gap: number; other: number; start: number[] };
/** dirDeg: the path's direction, 0 = +x on screen, 90 = up the screen. */
function measure(g: Geo): Result {
  const L = g.L, x1 = [...g.end], P1 = L.point(pose(L, x1)), S = L.root(pose(L, x1));
  const dir: P = [Math.cos((g.dirDeg * Math.PI) / 180), -Math.sin((g.dirDeg * Math.PI) / 180)];
  const R = Math.hypot(P1[0] - S[0], P1[1] - S[1]), b = (P1[0] - S[0]) * dir[0] + (P1[1] - S[1]) * dir[1];
  const t = -b + Math.sqrt(b * b - R * R + (g.d0 * R) ** 2), P0: P = [P1[0] + dir[0] * t, P1[1] + dir[1] * t];
  let x = [...x1];
  for (let k = 1; k <= 200; k++) x = reach(L, [P1[0] + (dir[0] * t * k) / 200, P1[1] + (dir[1] * t * k) / 200], x).x;
  const x0 = [...x];
  // (i) the travel is the minimum-jerk curve
  const ti: number[][] = [[], []];
  for (const u of STOPS) {
    const s = envelope(WS, u);
    x = reach(L, [P0[0] + (P1[0] - P0[0]) * s, P0[1] + (P1[1] - P0[1]) * s], x).x;
    ti[0]!.push(x[0]!); ti[1]!.push(x[1]!);
  }
  // (ii) a channel is the minimum-jerk curve, the other solved; `k` is the driver
  const joint = (k: number) => {
    let y = [...x0], gap = 0;
    const tr: number[][] = [[], []];
    for (const u of STOPS) {
      y[k] = x0[k]! + (x1[k]! - x0[k]!) * envelope(WS, u);
      y = onLine(L, y, 1 - k, P0, dir).x;
      tr[0]!.push(y[0]!); tr[1]!.push(y[1]!);
      gap = Math.max(gap, Math.abs(off(L.point(pose(L, [r4(y[0]!), r4(y[1]!)])), P0, dir)));   // as drawn
    }
    return { c: cOf(tr), gap };
  };
  const main = joint(g.driver);
  return { travelDriven: cOf(ti), joint: main.c, gap: main.gap, other: joint(1 - g.driver).c, start: x0 };
}

const f2 = (v: number) => +v.toFixed(2);
/** The recorded A0 numbers (front arm on main at 5e416d8, side arm and leg on FG-6 7009772, re-run on main cfad57d):
 * (i), (ii) with the named driver, and (ii) driven by the other channel. The elbow drives the horizontal and incline
 * press, the shoulder the overhead press and the pulldown (the elbow, the larger excursion, fails (c) when it drives the
 * front one), the knee the sled (D-FG7 (b) amendment). */
const ROWS: (Geo & { rec: [number, number, number] })[] = [
  { name: 'horizontal press', L: SIDE_ARM, end: [90, 15], dirDeg: 0, d0: 0.45, driver: 1, rec: [17.6, 2.58, 4.65] },
  { name: 'incline press 35°', L: SIDE_ARM, end: [125, 15], dirDeg: 35, d0: 0.45, driver: 1, rec: [16, 2.58, 4.5] },
  { name: 'overhead press', L: SIDE_ARM, end: [170, 15], dirDeg: 90, d0: 0.45, driver: 0, rec: [15.62, 2.5, 2.86] },
  { name: '45° sled', L: LEG, end: [90, 15], dirDeg: 0, d0: 0.45, driver: 1, rec: [16.52, 2.38, 102.67] },
  { name: 'overhead press', L: FRONT, end: [165, -15], dirDeg: 90, d0: 0.45, driver: 0, rec: [17.16, 2.68, 3.29] },
  { name: 'front pulldown', L: FRONT, end: [160, -15], dirDeg: 90, d0: 0.45, driver: 0, rec: [17.55, 2.92, 3.87] },
];

describe('V1-04 A0: the drive rule measured on the real rig', () => {
  it.each(ROWS)('$name, $L.name: travel-driven fails (c); the joint driver holds (c) and the contact', g => {
    const r = measure(g);
    console.info(`[V1-04 A0] ${g.name} (${g.L.name}, ${g.L.chans[g.driver]} drives): (i) c ${f2(r.travelDriven)}, (ii) c ${f2(r.joint)} gap ${r.gap.toExponential(1)}, other driver c ${f2(r.other)}; start ${r.start.map(f2).join('/')}`);
    expect([f2(r.travelDriven), f2(r.joint), f2(r.other)]).toEqual(g.rec);
    expect(r.travelDriven).toBeGreaterThan(LIM.c);
    expect(r.joint).toBeLessThanOrEqual(LIM.c);
    expect(r.gap).toBeLessThan(1e-3);
  });
  it.each(ROWS)('$name, $L.name: buildable envelope (lockout bend ≥ 15°, start ≥ 0.45 of the reach): (c) ≤ 3', g => {
    for (const d0 of [0.45, 0.55]) for (const bend of [15, 25]) {
      const end = [g.end[0]!, Math.sign(g.end[1]!) * bend], r = measure({ ...g, d0, end });
      expect(r.joint, `${g.name} d0 ${d0} bend ${bend}`).toBeLessThanOrEqual(LIM.c);
      expect(r.gap).toBeLessThan(0.5);
    }
  });
  it.each(ROWS.filter(g => g.L === FRONT))('$name, $L.name: outside the envelope (locked to 10° from a start at 0.35 of the reach) (c) fails', g => {
    expect(measure({ ...g, d0: 0.35, end: [g.end[0]!, Math.sign(g.end[1]!) * 10] }).joint).toBeGreaterThan(LIM.c);
  });
});

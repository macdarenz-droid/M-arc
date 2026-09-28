// FG-1 fixture: the Lateral Raise Lab's own motion and 2D maths, copied verbatim (only types added) from
// docs/design/form-guide-lab/lateral-raise-lab.html at 6c6aaf1 (branch claude/marc-form-guide-smoothness-fiuy2y):
// SPEC (the numbers used here), motion, pose3, pose2d, world2d and the root's sway rotate. The tests compare the rig
// against these numbers; nothing here is rig code.
/* eslint-disable */
type V3 = [number, number, number];
const D = Math.PI / 180, clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x)), lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mj = (s: number) => { s = clamp(s, 0, 1); return s * s * s * (10 - 15 * s + 6 * s * s); };
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], len = (a: V3) => Math.hypot(a[0], a[1], a[2]), norm = (a: V3): V3 => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const rotX = (p: V3, c: V3, a: number): V3 => { const y = p[1] - c[1], z = p[2] - c[2], cs = Math.cos(a), sn = Math.sin(a); return [p[0], c[1] + y * cs + z * sn, c[2] - y * sn + z * cs]; };

const SPEC = {
  equipment: { kg: 7 }, plane: { forwardDeg: 22 }, tempo: { lift: 1, hold: 0.5, lower: 2, rest: 0.5 },
  joints: { shoulderAbductionDeg: [10, 88], elbowBendDeg: 14, elbowLeadDeg: 8, kneesSoftDeg: 6 },
  movement: { liftSlowdownPerRep: [1, 1.08, 1.18], balanceLeanDeg: 0.6, holdTremorDeg: 0.35 },
  mistake: { tempo: { lift: 0.8, hold: 0.2, lower: 0.9, rest: 2.1 }, kneeDipDeg: 14, leanBackDeg: 10, shrugCm: 5, abductionDeg: 108, thumbsDownDeg: 40, bounceDeg: 7 },
};
const H = 1.78, UA = 0.186 * H * 0.94, FA = 0.146 * H, GRIP = 0.07;
const PLANE = SPEC.plane.forwardDeg * D, ELBOW = SPEC.joints.elbowBendDeg * D, LEAD = SPEC.joints.elbowLeadDeg * D;
const TH0 = SPEC.joints.shoulderAbductionDeg[0]! * D, TH1 = SPEC.joints.shoulderAbductionDeg[1]! * D, TH1_BAD = SPEC.mistake.abductionDeg * D;
export const T = 4; const KG = SPEC.equipment.kg, G = 9.81, REPS = 3;
export type Mode = 'correct' | 'mistake';
function phases(m: Mode, rep: number): [string, number][] {
  if (m === 'mistake') return [['Lift', SPEC.mistake.tempo.lift], ['Hold', SPEC.mistake.tempo.hold], ['Lower', SPEC.mistake.tempo.lower], ['Rest', SPEC.mistake.tempo.rest]];
  const lift = +(SPEC.tempo.lift * SPEC.movement.liftSlowdownPerRep[rep % REPS]!).toFixed(2), hold = SPEC.tempo.hold, lower = SPEC.tempo.lower;
  return [['Lift', lift], ['Hold', hold], ['Lower', lower], ['Rest', +(T - lift - hold - lower).toFixed(2)]];
}
function phaseAt(m: Mode, t: number, rep: number) { let acc = 0; const ph = phases(m, rep); for (let i = 0; i < ph.length; i++) { const d = ph[i]![1]; if (t < acc + d || i === ph.length - 1) return { i, name: ph[i]![0], s: clamp((t - acc) / d, 0, 1), dt: t - acc }; acc += d; } throw new Error('phase'); }
export function motion(m: Mode, t: number, rep: number) {
  const p = phaseAt(m, t, rep), r = rep % REPS; let th: number, lean = 0, knee = SPEC.joints.kneesSoftDeg * D, shrug = 0, rotIn = 0, breath = 0.5;
  if (m === 'correct') {
    if (p.name === 'Lift') { th = lerp(TH0, TH1, mj(p.s)); breath = 1 - mj(p.s); }
    else if (p.name === 'Hold') { const amp = SPEC.movement.holdTremorDeg * D * (1 + 0.3 * r); th = TH1 + amp * (Math.sin(2 * Math.PI * 9 * p.dt) + 0.45 * Math.sin(2 * Math.PI * 13 * p.dt + 1.3)); breath = 0; }
    else if (p.name === 'Lower') { th = lerp(TH1, TH0, mj(p.s)); breath = mj(p.s); }
    else { th = TH0; breath = 1; }
  } else {
    const dip = SPEC.mistake.kneeDipDeg * D;
    if (p.name === 'Lift') { const s = p.s, q = clamp((s - 0.2) / 0.8, 0, 1); th = lerp(TH0, TH1_BAD, mj(q) + 0.04 * Math.sin(Math.PI * q));
      lean = SPEC.mistake.leanBackDeg * D * Math.sin(Math.PI * Math.min(1, s * 1.15)); if (s < 0.35) knee += dip * Math.sin((Math.PI * s) / 0.35); }
    else if (p.name === 'Hold') { th = TH1_BAD; lean = 2 * D; }
    else if (p.name === 'Lower') { th = lerp(TH1_BAD, TH0, p.s * p.s); lean = 2 * D * (1 - p.s); }
    else { const b = SPEC.mistake.bounceDeg * D; th = Math.max(0, TH0 - b * Math.exp(-p.dt / 0.3) * Math.sin(2 * Math.PI * 1.6 * p.dt)); }
    shrug = (SPEC.mistake.shrugCm / 100) * smooth(55 * D, TH1_BAD, th);
    rotIn = SPEC.mistake.thumbsDownDeg * D * smooth(20 * D, 90 * D, th);
  }
  const up = clamp((th - TH0) / (TH1 - TH0), 0, 1.3);
  const sway = -SPEC.movement.balanceLeanDeg * D * up * (m === 'mistake' ? 2 : 1) + 0.2 * D * Math.sin((2 * Math.PI * t) / T);
  const blade = Math.max(0, th - 30 * D) / 3, lead = LEAD * smooth(40 * D, TH1, th);
  return { p, th, lean, sway, knee, shrug, rotIn, breath, blade, lead };
}
function pose3(m: Mode, t: number, rep: number) {
  const M = motion(m, t, rep), L1 = 0.43, L2 = 0.44, a2 = M.knee / 2, dy = 0.085 + (L1 + L2) * Math.cos(a2) - 0.955;
  const ankC: V3 = [0, 0.085, -0.01], P: V3 = [0, 0.98 + dy, 0], UP = (q: V3) => rotX(rotX(q, P, M.lean), ankC, M.sway);
  const S: V3 = [0.2 - 0.012 * Math.sin(M.blade), 1.45 + dy + M.shrug + 0.03 * Math.sin(M.blade), 0], Gh = add(S, [-0.025, -0.04, 0]);
  const lat: V3 = [Math.cos(PLANE), 0, Math.sin(PLANE)], u = norm(add(mul([0, -1, 0], Math.cos(M.th)), mul(lat, Math.sin(M.th))));
  const w = norm(sub([0, 0, 1], mul(u, dot([0, 0, 1], u)))), el = ELBOW + M.lead, f = norm(add(mul(u, Math.cos(el)), mul(w, Math.sin(el))));
  const Hd = add(add(add(Gh, mul(u, UA)), mul(f, FA)), mul(f, GRIP));
  const g = UP(Gh), h = UP(Hd), r = sub(h, g);
  return { M, Hd: h, torque: KG * G * Math.hypot(r[0], r[2]) };
}
const P2 = 303, SH_R = [260, 128], ELB = [3, 92], FIST = [0, 93], HIP = 262, FLOOR = 566;
export function pose2d(m: Mode, t: number, rep: number) {
  const M = motion(m, t, rep), P = pose3(m, t, rep);
  const dip = (0.955 - (0.085 + 0.87 * Math.cos(M.knee / 2))) * P2;
  return { m, M, P, thDeg: M.th / D, leadDeg: M.lead / D, rise: 10 * Math.sin(M.blade) + M.shrug * P2, breath: M.breath, swayDeg: M.sway / D, dip, leanS: Math.cos(M.lean), tiltDeg: M.rotIn / D };
}
const rot = (v: number[], a: number) => { const c = Math.cos(a * D), s = Math.sin(a * D); return [v[0]! * c - v[1]! * s, v[0]! * s + v[1]! * c]; };
export function world2d(Q: ReturnType<typeof pose2d>) {
  const piv = [SH_R[0]!, SH_R[1]! - Q.rise], el = rot(ELB, -Q.thDeg), fi = rot(rot(FIST, Q.leadDeg), -Q.thDeg);
  let f = [piv[0]! + el[0]! + fi[0]!, piv[1]! + el[1]! + fi[1]!];
  f = [f[0]!, HIP + (f[1]! - HIP) * Q.leanS + Q.dip];
  return { fistR: f as [number, number], piv: [piv[0]!, HIP + (piv[1]! - HIP) * Q.leanS + Q.dip] };
}
/** The fist on screen: world2d inside the figure root's `rotate(swayDeg 200 FLOOR)` (lab applyPose). */
export function screenFist(Q: ReturnType<typeof pose2d>): [number, number] {
  const [x, y] = world2d(Q).fistR, a = Q.swayDeg * D, c = Math.cos(a), s = Math.sin(a), dx = x - 200, dy = y - FLOOR;
  return [200 + dx * c - dy * s, FLOOR + dx * s + dy * c];
}
/** The lab's moments (moments(): correct Start 0.02, Half-way 0.5, Top 1.2; mistake Top 0.9), rep 0. */
export const MOMENTS: [string, Mode, number][] = [['rest', 'correct', 0.02], ['half-way', 'correct', 0.5], ['top', 'correct', 1.2], ['mistake top', 'mistake', 0.9]];
/** The lab's state as rig channels (degrees, cm), both sides alike as the lab draws them. */
export function labChannels(Q: ReturnType<typeof pose2d>) {
  const M = Q.M, sides = (b: string, v: number) => ({ [`${b}_l`]: v, [`${b}_r`]: v });
  return {
    ...sides('shoulder_abd', Q.thDeg), ...sides('elbow_lead', Q.leadDeg), ...sides('wrist_pron', Q.tiltDeg),
    ...sides('knee_flex', M.knee / D), ...sides('shrug_cm', M.shrug * 100),
    torso_lean: M.lean / D, breath: M.breath, sway: Q.swayDeg,
  };
}

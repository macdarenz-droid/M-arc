// FG-1: poses and the front view's pose → transform mapping, ported from the Lateral Raise Lab's pose2d/applyPose.
// A pose is channel values (joints.ts). frontFrame turns it into one CSS transform (or opacity) per joint or moving
// part; applyPose writes those, and only those: `transform` and `opacity` (§3).
import { PARENT, type ChannelId, type JointId, type Pose, type SidedBase } from './joints';
import { solve2, type Pt } from './ik';
import { ELB, FIST, FLOOR, FRONT_RIG, HIP, P2, SHIN_H, THIGH_H, TRAP_X, type Mat } from './figureFront';

export type PoseId = 'standing' | 'seated';
/** Stored start-angle sets (§3 "Poses"); an exercise overrides only what moves. legs picks the leg rule. */
export const POSES: Record<PoseId, { legs: 'standing' | 'seated'; base: Pose }> = {
  standing: { legs: 'standing', base: { shoulder_abd_l: 10, shoulder_abd_r: 10, breath: 0.5 } },
  seated: { legs: 'seated', base: { shoulder_abd_l: 10, shoulder_abd_r: 10, breath: 0.5, hip_flex_l: 90, hip_flex_r: 90, knee_flex_l: 90, knee_flex_r: 90 } },
};

/** One transform step, applied right to left as in CSS. */
export type Op = ['t', number, number] | ['r', number] | ['s', number, number] | ['m', number, number, number, number, number, number];
export type Xf = { ops: Op[]; opacity?: never } | { ops?: never; opacity: number };
/** Keys are the joint ids and the part names (`breath`, `trap_r`, `eq_r`, `eqf_r`, ...); see figureFront.ts. */
export type Frame = Record<string, Xf>;

const D = Math.PI / 180;
const n = (v: number) => { const s = (Math.round(v * 10000) / 10000).toString(); return s === '-0' ? '0' : s; };
/** CSS text of a transform list (units: px, deg). */
export function css(ops: Op[]): string {
  return ops.map(o => o[0] === 't' ? `translate(${n(o[1])}px, ${n(o[2])}px)` : o[0] === 'r' ? `rotate(${n(o[1])}deg)` : o[0] === 's' ? `scale(${n(o[1])}, ${n(o[2])})` : `matrix(${o.slice(1).map(v => n(v as number)).join(', ')})`).join(' ');
}

const LEG_REST = 0.955, ANKLE_H = 0.085, THIGH_M = 0.43, SHIN_M = 0.44;   // lab pose3: metres
/** Floor-to-hip drop at this thigh and shin angle from vertical (lab pose2d `dip`), in units. */
const dropOf = (thigh: number, shin: number) => (LEG_REST - (ANKLE_H + THIGH_M * Math.cos(thigh * D) + SHIN_M * Math.cos(shin * D))) * P2;
/** Seated front view: a thigh pointing at the viewer is never drawn thinner than this share of its length. */
export const THIGH_MIN = 0.3;

/** The pose's stored start values under the given channels. */
export function resolve(id: PoseId, pose: Pose): (c: ChannelId) => number {
  const base = POSES[id].base;
  return c => pose[c] ?? base[c] ?? 0;
}

/** The lab's shoulder rise: blade rotation above 30° of abduction (10·sin(blade), blade = (abd − 30°)/3), plus a shrug
 * and minus a depression (cm at 303 units per metre). */
export function riseOf(abd: number, shrugCm: number, depressCm: number): number {
  return 10 * Math.sin((Math.max(0, abd - 30) * D) / 3) + ((shrugCm - depressCm) / 100) * P2;
}

/** The front view of a pose: one transform per joint and moving part, and muscle tint opacities (0..1). */
export function frontFrame(id: PoseId, pose: Pose, tints: Record<string, number> = {}): Frame {
  const v = resolve(id, pose), f: Frame = {};
  const sc = (b: SidedBase, s: 'l' | 'r') => v(`${b}_${s}` as ChannelId);
  // legs: standing splits the knee bend between thigh and shin (feet under the hips, the lab's squat maths); seated
  // takes the thigh from hip flexion and the shin from the rest of the knee bend.
  const legs = (['r', 'l'] as const).map(s => {
    const knee = sc('knee_flex', s), hip = sc('hip_flex', s);
    if (POSES[id].legs === 'standing') { const dip = dropOf(knee / 2, knee / 2), k = (FLOOR - HIP - dip) / (FLOOR - HIP); return { s, dip, sT: k, sS: k }; }
    const sT = Math.max(Math.abs(Math.cos(hip * D)), THIGH_MIN), sS = Math.abs(Math.cos((knee - hip) * D));
    return { s, dip: FLOOR - HIP - (THIGH_H * sT + SHIN_H * sS), sT, sS };
  });
  const dip = (legs[0]!.dip + legs[1]!.dip) / 2, sway = v('sway'), lean = v('torso_lean');
  const fy = FLOOR - FRONT_RIG.pelvis.origin[1];
  // sway turns the body about the floor point between the feet; dip lowers the hips (the legs fore-shorten to match)
  f.pelvis = { ops: [['t', 0, fy], ['r', sway], ['t', 0, -fy + dip]] };
  for (const L of legs) {
    f[`hip_${L.s}`] = { ops: [['r', -sc('hip_abd', L.s)], ['s', 1, L.sT]] };
    f[`knee_${L.s}`] = { ops: [['s', 1, L.sS / L.sT]] };
    f[`ankle_${L.s}`] = { ops: [['r', 0]] };
  }
  f.spine = { ops: [['s', 1, Math.cos(lean * D)]] };            // leaning back fore-shortens the trunk in this view
  const br = v('breath');
  f.breath = { ops: [['s', 1 + 0.02 * (br - 0.5), 1 + 0.012 * (br - 0.5)]] };
  f.chest = { ops: [['r', 0]] };
  f.neck = { ops: [['r', 0]] };
  f.head = { ops: [['t', 0, -lean * 0.25]] };
  const tw = TRAP_X[1] - TRAP_X[0];
  for (const s of ['r', 'l'] as const) {
    const abd = sc('shoulder_abd', s), lead = sc('elbow_lead', s), pron = sc('wrist_pron', s);
    const r = riseOf(abd, sc('shrug_cm', s), sc('scap_depress_cm', s));
    f[`shoulder_${s}`] = { ops: [['t', 0, -r], ['r', -abd]] };
    f[`elbow_${s}`] = { ops: [['r', lead]] };
    f[`wrist_${s}`] = { ops: [['r', 0]] };
    // a hanging weight stays level: the equipment turns back by the chain's rotation, less the pronation
    f[`eq_${s}`] = { ops: [['r', abd - lead - pron]] };
    f[`eqf_${s}`] = { ops: [['r', abd - lead - pron]] };
    // traps shear up at the shoulder end and stay put at the neck end (lab)
    f[`trap_${s}`] = { ops: [s === 'r' ? ['m', 1, -r / tw, 0, 1, 0, (r * TRAP_X[0]) / tw] : ['m', 1, r / tw, 0, 1, 0, (-r * (400 - TRAP_X[0])) / tw]] };
  }
  for (const [k, o] of Object.entries(tints)) f[k] = { opacity: Math.min(1, Math.max(0, o)) };
  return f;
}

// ---- matrices (forward kinematics of the drawn rig) --------------------------------------------------------------------
export const mmul = (A: Mat, B: Mat): Mat => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
export const apply = (A: Mat, p: Pt): Pt => [A[0] * p[0] + A[2] * p[1] + A[4], A[1] * p[0] + A[3] * p[1] + A[5]];
export const inv = (A: Mat): Mat => { const d = A[0] * A[3] - A[1] * A[2]; return [A[3] / d, -A[1] / d, -A[2] / d, A[0] / d, (A[2] * A[5] - A[3] * A[4]) / d, (A[1] * A[4] - A[0] * A[5]) / d]; };
export function opMat(o: Op): Mat {
  if (o[0] === 't') return [1, 0, 0, 1, o[1], o[2]];
  if (o[0] === 's') return [o[1], 0, 0, o[2], 0, 0];
  if (o[0] === 'm') return [o[1], o[2], o[3], o[4], o[5], o[6]];
  const c = Math.cos(o[1] * D), s = Math.sin(o[1] * D); return [c, s, -s, c, 0, 0];
}
/** A joint's transform as CSS applies it: about its transform-origin, after its static placement. */
export function localMat(j: JointId, xf: Xf | undefined): Mat {
  const { at, origin: [x, y] } = FRONT_RIG[j];
  let X: Mat = [1, 0, 0, 1, 0, 0];
  for (const o of xf?.ops ?? []) X = mmul(X, opMat(o));
  return mmul(at, mmul([1, 0, 0, 1, x, y], mmul(X, [1, 0, 0, 1, -x, -y])));
}
/** Figure-space matrix of a joint's frame. */
export function worldMat(j: JointId, f: Frame): Mat {
  const p = PARENT[j];
  return p ? mmul(worldMat(p, f), localMat(j, f[j])) : localMat(j, f[j]);
}
/** Where a hand (the wrist pivot) lands in figure space. */
export const handAt = (f: Frame, s: 'l' | 'r'): Pt => apply(worldMat(`wrist_${s}`, f), [0, 0]);

/** Upper-arm and forearm lengths of the front arm (shoulder → elbow → wrist pivots). */
export const ARM_A = Math.hypot(ELB[0], ELB[1]), ARM_B = Math.hypot(FIST[0], FIST[1]);
/**
 * Two-bone solve of a front arm to a hand target in figure space (a machine handle or a cable end driving the hand):
 * returns the shoulder_abd and elbow_lead that put the wrist pivot there, with the rest of the pose unchanged.
 */
export function solveFrontArm(id: PoseId, pose: Pose, s: 'l' | 'r', hand: Pt): { shoulder_abd: number; elbow_lead: number } {
  const v = resolve(id, pose), f = frontFrame(id, pose);
  const sh = FRONT_RIG[`shoulder_${s}`];
  const r = riseOf(v(`shoulder_abd_${s}`), v(`shrug_cm_${s}`), v(`scap_depress_cm_${s}`));
  // the target in the shoulder's rotation frame (after its rise, before its rotation)
  const frame = mmul(mmul(worldMat('chest', f), sh.at), [1, 0, 0, 1, 0, -r]);
  const G = apply(inv(frame), hand), E = solve2([0, 0], G, ARM_A, ARM_B, 1);
  const ang = (p: Pt) => Math.atan2(p[1], p[0]) / D;
  const abd = -(ang(E) - ang(ELB));
  const lead = ang([G[0] - E[0], G[1] - E[1]]) - ang(FIST) + abd;
  const wrap = (a: number) => ((a + 540) % 360) - 180;
  return { shoulder_abd: wrap(abd), elbow_lead: wrap(lead) };
}

// ---- DOM ---------------------------------------------------------------------------------------------------------------
/** What applyPose writes to: an SVG group's style. */
export type StyleTarget = { style: { transform: string; opacity: string } };
/** The figure's moving groups by frame key (joints `.j-<id>`, parts `.fg-<name>`). */
export function bindFigure(root: ParentNode): Record<string, StyleTarget> {
  const out: Record<string, StyleTarget> = {};
  root.querySelectorAll<SVGGElement>('.fg-j').forEach(el => { const k = [...el.classList].find(c => c.startsWith('j-')); if (k) out[k.slice(2)] = el; });
  root.querySelectorAll<SVGElement>('.fg-p').forEach(el => { const k = [...el.classList].find(c => c.startsWith('fg-') && c !== 'fg-p'); if (k) out[k.slice(3)] = el; });
  return out;
}
/** Writes a frame: `transform` and `opacity`, nothing else. Keys without a bound element are skipped. */
export function applyPose(els: Record<string, StyleTarget>, frame: Frame): void {
  for (const [k, xf] of Object.entries(frame)) {
    const el = els[k];
    if (!el) continue;
    if (xf.ops) el.style.transform = css(xf.ops);
    else el.style.opacity = n(xf.opacity!);
  }
}

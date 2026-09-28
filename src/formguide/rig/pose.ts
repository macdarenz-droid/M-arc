// FG-1: poses and the front view's pose → transform mapping, ported from the Lateral Raise Lab's pose2d/applyPose.
// A pose is channel values (joints.ts). frontFrame turns it into one CSS transform (or opacity) per joint or moving
// part; applyPose writes those, and only those: `transform` and `opacity` (§3).
import { PARENT, type ChannelId, type JointId, type Pose, type SidedBase } from './joints';
import { solve2, type Pt } from './ik';
import { ELB, FIST, FLOOR, FRONT_RIG, HIP, MIRROR, P2, SHIN_H, THIGH_H, TRAP_X, type Mat } from './figureFront';
import { S_BACK, S_BAR, S_ELB, S_FRONT, S_GRIP, S_HIP_FRONT, S_PELVIS, S_SACRUM, S_SH, S_SOLE, S_WR, figureSide, sideParent, sideRig, type Near, type SideRig } from './figureSide';
import type { AttachmentId, ExerciseGuide } from '../model';
import { poseAt } from '../sample';
import type { Rig } from '../check/view';

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

// ---- FG-6: the side view ---------------------------------------------------------------------------------------------
// The side figure (figureSide.ts) faces right; `mirror` faces it left. The mirror rule: the mirrored figure is the
// drawing reflected about x = 200 with the sides swapped, so its near limbs are the lifter's left and read the `_l`
// channels. Sign conventions, figure facing right: flexion turns a limb forward (shoulder, elbow, hip), the knee bends
// back, ankle_flex + is dorsiflexion, torso_lean + leans back (joints.ts, ranges.ts).
export type SidePoseId = 'standing' | 'seated' | 'lying_supine' | 'lying_prone';
/** Stored start values per side pose (§3 "Poses"); an exercise overrides only what moves. */
export const SIDE_POSES: Record<SidePoseId, Pose> = {
  standing: { breath: 0.5 },
  seated: { breath: 0.5, hip_flex_l: 90, hip_flex_r: 90, knee_flex_l: 90, knee_flex_r: 90 },
  lying_supine: { breath: 0.5 },
  lying_prone: { breath: 0.5, ankle_flex_l: -30, ankle_flex_r: -30 },   // tops of the feet on the floor
};
export const SIDE_POSE_IDS = Object.keys(SIDE_POSES) as SidePoseId[];
export type SideFrameOptions = {
  mirror?: boolean;
  /** Lying poses: the y of the surface the body rests on (the floor, or a bench pad's top); default the floor. */
  surface?: number;
};
/** A lying figure's pelvis is moved this far along the floor (toward its feet) so the straight body, with the prone
 * figure's pointed feet, fits the standing camera's 576 units. */
export const LYING_SHIFT = { lying_supine: 34, lying_prone: 46 } as const;

const ROT = (a: number): Mat => { const c = Math.cos(a * D), s = Math.sin(a * D); return [c, s, -s, c, 0, 0]; };
const TR = (x: number, y: number): Mat => [1, 0, 0, 1, x, y];
const about = (o: readonly [number, number], M: Mat): Mat => mmul(mmul(TR(o[0], o[1]), M), TR(-o[0], -o[1]));
/** The CSS transform that makes a group about origin `o` equal M in its parent's space. */
const asOps = (o: readonly [number, number], M: Mat): Op[] => [['m', ...mmul(mmul(TR(-o[0], -o[1]), M), TR(o[0], o[1]))]];
const opsMat = (ops: Op[] | undefined): Mat => (ops ?? []).reduce<Mat>((X, o) => mmul(X, opMat(o)), [1, 0, 0, 1, 0, 0]);
const sideLocal = (rig: SideRig, j: JointId, xf: Xf | undefined): Mat => { const { at, origin } = rig[j]; return mmul(at, about(origin, opsMat(xf?.ops))); };

/** The side view of a pose: one transform per joint and moving part, and muscle tint opacities (0..1). */
export function sideFrame(id: SidePoseId, pose: Pose, o: SideFrameOptions = {}, tints: Record<string, number> = {}): Frame {
  const base = SIDE_POSES[id], v = (c: ChannelId) => pose[c] ?? base[c] ?? 0, f: Frame = {};
  const near: Near = o.mirror ? 'l' : 'r', rig = sideRig(near);
  const sc = (b: SidedBase, s: 'l' | 'r') => v(`${b}_${s}` as ChannelId);
  for (const s of ['l', 'r'] as const) {
    f[`hip_${s}`] = { ops: [['r', -sc('hip_flex', s)]] };
    f[`knee_${s}`] = { ops: [['r', sc('knee_flex', s)]] };
    f[`ankle_${s}`] = { ops: [['r', -sc('ankle_flex', s)]] };
  }
  f.spine = { ops: [['r', -v('torso_lean')]] };
  f.chest = { ops: [['r', 0]] };
  f.head = { ops: [['r', 0]] };
  const br = v('breath');
  f.breath = { ops: [['s', 1 + 0.03 * (br - 0.5), 1 + 0.01 * (br - 0.5)]] };
  const trunk = mmul(sideLocal(rig, 'spine', f.spine), sideLocal(rig, 'chest', f.chest));   // chest frame in the pelvis
  for (const s of ['l', 'r'] as const) {
    const flex = sc('shoulder_flex', s), r = riseOf(Math.max(0, flex), sc('shrug_cm', s), sc('scap_depress_cm', s));
    const own: Op[] = [['t', 0, -r], ['r', -flex]];
    f[`shoulder_${s}`] = { ops: s === near ? [['m', ...mmul(mmul(trunk, TR(S_SH[0], S_SH[1])), opsMat(own))]] : own };
    f[`elbow_${s}`] = { ops: [['r', -sc('elbow_flex', s)]] };
    f[`wrist_${s}`] = { ops: [['r', 0]] };
  }
  // the pelvis: turned and placed so the pose's support holds (standing: the near foot flat on its spot, swaying about
  // it; seated: the feet on the floor; lying: the lowest contact point on the surface)
  const legOf = (s: 'l' | 'r', P: Mat) => mmul(mmul(mmul(P, sideLocal(rig, `hip_${s}`, f[`hip_${s}`])), sideLocal(rig, `knee_${s}`, f[`knee_${s}`])), sideLocal(rig, `ankle_${s}`, f[`ankle_${s}`]));
  let P: Mat;
  if (id === 'standing' || id === 'seated') {
    const rho = id === 'standing' ? sc('hip_flex', near) - sc('knee_flex', near) + sc('ankle_flex', near) : 0;
    const P0 = about(S_PELVIS, ROT(rho)), sole = apply(legOf(near, P0), S_SOLE);
    const move = id === 'standing' ? TR(S_SOLE[0] - sole[0], FLOOR - sole[1]) : TR(0, FLOOR - sole[1]);
    P = mmul(about([S_SOLE[0], FLOOR], ROT(id === 'standing' ? v('sway') : 0)), mmul(move, P0));
  } else {
    const sup = id === 'lying_supine', P0 = mmul(TR(sup ? -LYING_SHIFT.lying_supine : LYING_SHIFT.lying_prone, 0), about(S_PELVIS, ROT(sup ? -90 : 90)));
    // the contact is read with the trunk straight, so it stays put while the trunk moves (a back extension lifts the chest)
    const pts = sup ? [apply(P0, S_SACRUM), apply(P0, S_BACK)] : [apply(P0, S_HIP_FRONT), apply(P0, S_FRONT)];
    P = mmul(TR(0, (o.surface ?? FLOOR) - Math.max(...pts.map(q => q[1]))), P0);
  }
  f.pelvis = { ops: asOps(S_PELVIS, P) };
  // gaze: on the feet, the neck lifts the head back by half the trunk's forward tilt, so a squat or a hinge looks ahead
  // and down rather than at the floor (a drawing rule, D-FG6); lying poses keep the head in line with the trunk
  const tilt = id === 'standing' || id === 'seated' ? Math.atan2(P[1], P[0]) / D - v('torso_lean') : 0;
  f.neck = { ops: [['r', -0.5 * Math.max(0, tilt)]] };
  for (const [k, x] of Object.entries(tints)) f[k] = { opacity: Math.min(1, Math.max(0, x)) };
  return f;
}

/** Figure-space matrix of a joint's frame in the side view (the mirror included). */
export function sideWorldMat(j: JointId, f: Frame, mirror = false): Mat {
  const near: Near = mirror ? 'l' : 'r', rig = sideRig(near), parent = sideParent(near);
  const walk = (k: JointId): Mat => { const p = parent[k], L = sideLocal(rig, k, f[k]); return p ? mmul(walk(p), L) : L; };
  return mirror ? mmul(MIRROR, walk(j)) : walk(j);
}
/** A joint's pivot in figure space (side view). */
export const sidePivot = (f: Frame, j: JointId, mirror = false): Pt => apply(sideWorldMat(j, f, mirror), sideRig(mirror ? 'l' : 'r')[j].origin);
/** Where a hand grips (the fist's centre) in figure space (side view). */
export const sideHandAt = (f: Frame, s: 'l' | 'r', mirror = false): Pt => apply(sideWorldMat(`wrist_${s}`, f, mirror), S_GRIP);
/** A §3 attachment point in figure space (side view). */
export function sidePoint(f: Frame, a: AttachmentId, mirror = false): Pt {
  const s = a.slice(-1) as 'l' | 'r', W = (j: JointId) => sideWorldMat(j, f, mirror);
  if (a === 'back') return apply(W('chest'), S_BACK);
  if (a === 'hip') return apply(W('pelvis'), S_SACRUM);
  if (a.startsWith('hand_')) return sideHandAt(f, s, mirror);
  if (a.startsWith('foot_')) return apply(W(`ankle_${s}`), S_SOLE);
  if (a.startsWith('shoulder_')) return apply(W('chest'), S_BAR);
  return sidePivot(f, `${a.slice(0, -2)}_${s}` as JointId, mirror);   // knee_, ankle_
}

/** Upper arm and forearm-to-grip lengths of the side arm. */
export const SIDE_ARM_A = Math.hypot(...S_ELB), SIDE_ARM_B = Math.hypot(S_WR[0] + S_GRIP[0], S_WR[1] + S_GRIP[1]);
/**
 * Two-bone solve of a side arm to a grip target in figure space (a bar in the hands, a handle): the shoulder_flex and
 * elbow_flex that put the fist's centre there, elbow bending the natural way (0..180), the rest of the pose unchanged.
 * A target beyond the arm's reach gets the straight arm pointing at it. `turnedOut`: the arm is abducted and turned out
 * (a back-squat grip), so its drawn projection bends the other way; elbow_flex comes back 0..-180 (D-FG6).
 */
export function solveSideArm(id: SidePoseId, pose: Pose, s: 'l' | 'r', hand: Pt, o: SideFrameOptions & { turnedOut?: boolean } = {}): { shoulder_flex: number; elbow_flex: number } {
  const mirror = !!o.mirror, ang = (x: number, y: number) => Math.atan2(x, y) / D, wrap = (a: number) => ((a + 540) % 360) - 180;
  const reach = SIDE_ARM_A + SIDE_ARM_B;
  // the shoulder rises with its own flexion (blade rhythm), so solve, re-place the shoulder, and solve again
  let own = pose[`shoulder_flex_${s}` as ChannelId] ?? SIDE_POSES[id][`shoulder_flex_${s}` as ChannelId] ?? 0, out: { shoulder_flex: number; elbow_flex: number } | null = null;
  for (let it = 0; it < 30; it++) {
    const f = sideFrame(id, { ...pose, [`shoulder_flex_${s}`]: own }, o);
    // the shoulder's frame before its own rotation: its world matrix with the rotation taken back out
    let G = apply(inv(mmul(sideWorldMat(`shoulder_${s}`, f, mirror), ROT(own))), hand);
    const d = Math.hypot(G[0], G[1]);
    if (d > reach * (1 - 1e-9)) G = [(G[0] * reach * (1 - 1e-9)) / d, (G[1] * reach * (1 - 1e-9)) / d];   // straight, pointing at it
    out = null;
    for (const bend of [1, -1] as const) {
      const E = solve2([0, 0], G, SIDE_ARM_A, SIDE_ARM_B, bend);
      const sf = ang(E[0], E[1]), ef = wrap(ang(G[0] - E[0], G[1] - E[1]) - sf);
      if (o.turnedOut ? ef <= 1e-9 : ef >= -1e-9) { out = { shoulder_flex: wrap(sf), elbow_flex: o.turnedOut ? Math.min(0, ef) : Math.max(0, ef) }; break; }
    }
    if (!out) break;
    if (Math.abs(out.shoulder_flex - own) < 1e-10) return out;
    own = out.shoulder_flex;
  }
  if (out) return out;
  throw new Error('solveSideArm: no natural elbow bend reaches the target');
}

/** The side-view rig the §5 checks read (check/view.ts `Rig`), or the reason there is none: a side file in a pose the
 * side view does not draw yet (kneeling, hanging, plank, quadruped). check/view.ts rigFor returns it for view 'side'. */
export function sideGuideRig(g: ExerciseGuide): Rig | string {
  if (!(SIDE_POSE_IDS as string[]).includes(g.pose)) return `no ${g.pose} pose in the side view yet`;
  const id = g.pose as SidePoseId, mirror = !!g.mirror;
  // lying: the support is as high as the start pose's feet need to reach the floor (a bench press on its bench), or the floor
  let surface: number = FLOOR;
  if (id === 'lying_supine' || id === 'lying_prone') {
    const f0 = sideFrame(id, poseAt(g, 0) as Pose, { mirror });
    surface = FLOOR - Math.max(0, ...(['foot_l', 'foot_r'] as const).map(a => sidePoint(f0, a, mirror)[1] - FLOOR));
  }
  return {
    view: 'side',
    frame: p => sideFrame(id, p as Pose, { mirror, surface }),
    point: (f, a) => sidePoint(f, a, mirror),
    pivot: (f, j) => sidePivot(f, j, mirror),
    markup: (read, mistake) => figureSide(read, { id: 'fgc', mistake, mirror }),
  };
}

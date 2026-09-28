// FG-1: the form-guide skeleton (docs/FORM-GUIDE-PRODUCTION.md §3). One skeleton, 17 joint groups, named channels on
// top. Pure data, no DOM.

export type View = 'front' | 'side' | 'back';
export type Kind = 'rep' | 'hold' | 'alternating' | 'locomotion' | 'ballistic';
export type Order = 'lift_first' | 'lower_first';
export type Side = '_l' | '_r';

/** The 17 joints: the pelvis is the root; per side shoulder, elbow, wrist, hip, knee, ankle. */
export const JOINTS = [
  'pelvis', 'spine', 'chest', 'neck', 'head',
  'shoulder_r', 'elbow_r', 'wrist_r', 'shoulder_l', 'elbow_l', 'wrist_l',
  'hip_r', 'knee_r', 'ankle_r', 'hip_l', 'knee_l', 'ankle_l',
] as const;
export type JointId = (typeof JOINTS)[number];

/** Nesting (§3): pelvis → spine → chest → neck → head; chest → shoulder → elbow → wrist (→ equipment);
 * pelvis → hip → knee → ankle. */
export const PARENT: Record<JointId, JointId | null> = {
  pelvis: null, spine: 'pelvis', chest: 'spine', neck: 'chest', head: 'neck',
  shoulder_r: 'chest', elbow_r: 'shoulder_r', wrist_r: 'elbow_r',
  shoulder_l: 'chest', elbow_l: 'shoulder_l', wrist_l: 'elbow_l',
  hip_r: 'pelvis', knee_r: 'hip_r', ankle_r: 'knee_r',
  hip_l: 'pelvis', knee_l: 'hip_l', ankle_l: 'knee_l',
};

/** The named channels of §3 (the card's list), on top of the joint angles. */
export const NAMED_CHANNELS = ['torso_lean', 'shrug_cm', 'scap_depress_cm', 'elbow_lead', 'wrist_pron', 'breath', 'sway', 'layer'] as const;

/** Channels written once per side (`<base>_l`, `<base>_r`). Degrees, or cm where the name ends in `_cm`. */
export const SIDED = [
  'shoulder_abd', 'shoulder_flex', 'elbow_flex', 'elbow_lead', 'wrist_pron',
  'hip_flex', 'hip_abd', 'knee_flex', 'ankle_flex', 'shrug_cm', 'scap_depress_cm',
] as const;
export type SidedBase = (typeof SIDED)[number];
/** Whole-body channels: torso_lean (degrees, + leans back), breath (0 = full out .. 1 = full in), sway (degrees about the
 * floor point between the feet, + clockwise on screen), layer (0 = arms-front group shown, 1 = arms-behind). */
export const BODY = ['torso_lean', 'breath', 'sway', 'layer'] as const;
export type BodyChannel = (typeof BODY)[number];
export type ChannelId = BodyChannel | `${SidedBase}${Side}`;

export const CHANNELS: readonly ChannelId[] = [
  ...BODY,
  ...SIDED.flatMap(b => [`${b}_l`, `${b}_r`] as ChannelId[]),
];

/** A pose: channel values. Missing channels take the pose's stored start value (pose.ts). */
export type Pose = Partial<Record<ChannelId, number>>;

/** Writes one value to both sides (`symmetric: true` in an exercise file). */
export const both = (base: SidedBase, v: number): Pose => ({ [`${base}_l`]: v, [`${base}_r`]: v }) as Pose;

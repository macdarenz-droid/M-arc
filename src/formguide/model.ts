// FG-2: the exercise-guide content model (docs/FORM-GUIDE-PRODUCTION.md §2). One exercise = one data file
// `src/formguide/exercises/<libraryId>.ts` exporting an ExerciseGuide; no functions in exercise files. The numbers the
// checks read live in `src/formguide/research/<libraryId>.json` (Research below). Sampling is in sample.ts.
import type { MuscleId } from '@/data/muscles';
import type { BodyChannel, ChannelId, JointId, Kind, Order, SidedBase, View } from './rig/joints';

export type { Kind, Order, View };

/**
 * A curve over the rep: a number is fixed; `[a, b]` is minimum-jerk from a to b over the first moving phase in `order`,
 * held at b, and back to a over the second (a hold-only file drifts linearly from a to b); `keys` is a minimum-jerk
 * (quintic) segment between each pair of keys, zero speed at the first and last key and at every turning point, never
 * overshooting a key (sample.ts), held at the end values outside them; two keys are exactly the minimum-jerk blend. Key times are rep
 * fractions (0..1) in the file's own tempo; a slowed rep or another tempo stretches them phase by phase.
 */
export type Curve = number | [number, number] | { keys: [t: number, v: number][] };

/** A sided joint channel (`knee_flex_r`) or a whole-body one (`torso_lean`, `breath`, `sway`, `layer`). */
export type JointChannel = ChannelId;
/** In a `symmetric: true` file a sided channel is written once by its base name and drawn on both sides. */
export type SymmetricChannel = SidedBase | BodyChannel;

export type RepTempo = { lift: number; hold: number; lower: number; rest: number };
/** Holds (`kind: 'hold'`) give only their duration. */
export type HoldTempo = { hold: number };
export type Tempo = RepTempo | HoldTempo;

/** Stored camera frames, in the lab's units (lateral-raise-lab.html VB: full and shoulders). */
export const VIEWBOXES = {
  standingFront: [-88, -6, 576, 600],   // the lab's -80 -6 560 600 widened 8 units a side for the mistake's sway (D-FG3)
  upperFront: [60, 10, 280, 300],
} as const satisfies Record<string, readonly [number, number, number, number]>;
export type ViewBoxId = keyof typeof VIEWBOXES;

/** The parts library of §4 (`none` for bodyweight). */
export type PartId =
  | 'none' | 'dumbbell' | 'kettlebell' | 'barbell' | 'ez_bar' | 'trap_bar' | 'straight_bar' | 'wide_bar' | 'v_handle'
  | 'rope' | 'd_handle' | 'band' | 'ankle_strap' | 'ab_wheel' | 'medicine_ball' | 'jump_rope' | 'battle_rope' | 'plate'
  | 'bench' | 'box' | 'wall' | 'rack' | 'sled' | 'dip_station' | 'pull_up_bar' | 'landmine' | 'farmer_handles';
/** Attachment points of §3. */
export type AttachmentId =
  | 'hand_l' | 'hand_r' | 'foot_l' | 'foot_r' | 'shoulder_l' | 'shoulder_r' | 'back' | 'hip' | 'knee_l' | 'knee_r' | 'ankle_l' | 'ankle_r';
/** Machine ids arrive with the machines library (§4, `machines/index.ts`); until then any id string. */
export type MachineId = string;

export type GuidePose = 'standing' | 'seated' | 'lying_supine' | 'lying_prone' | 'kneeling' | 'hanging' | 'plank' | 'quadruped';
export type Settings = { seat?: number; pad?: number; pulley?: 'high' | 'mid' | 'low'; bench?: number; rail?: number };

export type Equipment = {
  kind: PartId; grip?: string; attach: AttachmentId[]; loadFrom: 'lastSet' | 'bodyweight' | 'fixed'; kg?: number;
  /** ballistic release window, rep fractions */
  release?: [t: number, t2: number];
};
/**
 * How a machine part moves. D-FG7 (b): the body drives and the part follows. A `follow` part's travel is the named body
 * point projected onto the part's one-dimensional path (line or arc), so `handsOnHandle` still measures a real gap;
 * the limb reaches it through `contacts` (one keyed minimum-jerk driver, one solved channel). A `travel` part keeps the
 * older rule: its travel is the source and its `chain` is the limb it moves.
 */
export type Drive = { part: string; travel: [number, number]; chain: JointId[] } | { part: string; follow: AttachmentId };
export type Machine = { id: MachineId; settings: Settings; drive: Drive[] };
export type Movement = { breathe: 'out on lift' | 'out on lower'; leanDeg?: number; tremorDeg?: number; slowdown?: number[]; bladeRhythm?: string };
/** `force`: the line the load acts along (V1-10 computes it): gravity (the default), or a machine part's path (a cable). */
export type Effort = Partial<Record<MuscleId, Curve>> | { model: 'torque'; chain: JointId[]; force?: 'gravity' | { along: string } };
export type Muscles = { target: MuscleId[]; helps: MuscleId[]; keepQuiet: MuscleId[]; effort: Effort };

/** The common mistake: its joint curves are deltas added to the correct curves; each tell names the joint it is read on. */
export type Mistake<C extends string> = {
  name: string; tempo?: Tempo;
  joints: Partial<Record<C, Curve>>;
  muscles?: Partial<Record<MuscleId, Curve>>;
  tells: { text: string; joint: C }[];
  setup?: { setting: keyof Settings; wrong: number; text: string };
  /** contacts (and a balance) on these points are not enforced in the mistake: the solved channel takes its value
   * solved on the mistake's pose before its deltas, plus its own delta (a hand leaving the handle, hips off the pad) */
  release?: AttachmentId[];
  /** a machine part's travel (0..1) in the mistake, replacing the followed or keyed travel (a released handle) */
  travel?: Partial<Record<string, Curve>>;
};

/**
 * V1-04 (D-FG7 (b)): a body point held on the machine. One solved channel keeps it on the part's one-dimensional path
 * (a slide's line, a lever's arc); two keep it on a point (a fixed pad when `on` is 'pad', or a `travel` part's
 * moving anchor). The solved channel is never keyed. `range` is its branch (default its AAOS row): the solve never
 * leaves it, so a bend never flips. In a symmetric file a base-name channel takes the side of `at`.
 */
export type Contact<C extends string> = { at: AttachmentId; on: string; solve: C | [C, C]; range?: [number, number] | [[number, number], [number, number]] };
/** V1-04: `at` kept plumb over `over` (the same x, e.g. the bar over mid-foot) by solving one channel. */
export type Balance<C extends string> = { at: AttachmentId; over: AttachmentId; solve: C; range?: [number, number] };

type GuideBase = {
  id: string;                                       // = library id and file name
  kind: Kind; order: Order; why?: string;           // default from rig/patterns.ts; an override needs `why`
  view?: View; viewWhy?: string;                    // derived from rig/patterns.ts; an override needs `viewWhy`
  mirror?: boolean;                                 // left-facing side view
  camera: { full: ViewBoxId; zoom: ViewBoxId; subject: JointId };
  pose: GuidePose;
  equipment: Equipment;
  machine?: Machine;
  tempo: Tempo;                                     // s; a rep sums to 3–5
  movement: Movement;
  muscles: Muscles;
  cues: string[];                                   // ≤ 3, each ≤ 60 characters
  sources: string[];
};
/** Degrees, or cm where the channel name ends in `_cm`. */
export type ExerciseGuide = GuideBase & (
  | { symmetric: true; joints: Partial<Record<SymmetricChannel, Curve>>; mistake: Mistake<SymmetricChannel>; contacts?: Contact<SymmetricChannel>[]; balance?: Balance<SymmetricChannel> }
  | { symmetric?: false; joints: Partial<Record<JointChannel, Curve>>; mistake: Mistake<JointChannel>; contacts?: Contact<JointChannel>[]; balance?: Balance<JointChannel> }
);

/** research.json: the researcher's cited numbers; the checks read it, the author never edits it. */
export type Research = {
  id: string;
  /** coaching range per channel (base name for symmetric exercises), with its source */
  ranges: Record<string, { min: number; max: number; source: string }>;
  tempo: RepTempo | HoldTempo; order: Order; kind: Kind;
  muscles: { target: MuscleId[]; helps: MuscleId[]; keepQuiet: MuscleId[]; peakAt: number; peakSource: string };
  mistake: { name: string; tells: { text: string; joint: string }[]; source: string };
  machine?: { settings: Settings; source: string; unverified_on_machine?: boolean };
  sources: string[];
};

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
  // V1-06: the full cameras keep standingFront's 600-unit height, so the stage (358:276, height-bound up to 778 units
  // wide) draws the figure at one size, and are centred on x = 200, so a mirrored file (reflected about x = 200) keeps
  // its camera; hangingSide alone is taller (the bar at 2.3 m, COACHING-DECISIONS.md:489). The zooms are upperFront's
  // size; guideView cameraOf reflects them for a mirrored file. Poses held: tests/formguide/sideWiring.test.ts A4.
  standingSide: [-88, -6, 576, 600],
  seatedSide: [-150, -6, 700, 600],
  lyingSide: [-189, -6, 778, 600],
  hangingSide: [-112, -150, 624, 666],
  ankleSide: [244, 367, 280, 300],
  gripFront: [60, 162, 280, 300],
  backFull: [-88, -6, 576, 600],
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
export type Machine = {
  id: MachineId; settings: Settings;
  /** the machine part's travel is the source; the limb chain is solved to it */
  drive: { part: string; travel: [number, number]; chain: JointId[] }[];
};
export type Movement = { breathe: 'out on lift' | 'out on lower'; leanDeg?: number; tremorDeg?: number; slowdown?: number[]; bladeRhythm?: string };
export type Effort = Partial<Record<MuscleId, Curve>> | { model: 'torque'; chain: JointId[] };
export type Muscles = { target: MuscleId[]; helps: MuscleId[]; keepQuiet: MuscleId[]; effort: Effort };

/** The common mistake: its joint curves are deltas added to the correct curves; each tell names the joint it is read on. */
export type Mistake<C extends string> = {
  name: string; tempo?: Tempo;
  joints: Partial<Record<C, Curve>>;
  muscles?: Partial<Record<MuscleId, Curve>>;
  tells: { text: string; joint: C }[];
  setup?: { setting: keyof Settings; wrong: number; text: string };
};

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
  | { symmetric: true; joints: Partial<Record<SymmetricChannel, Curve>>; mistake: Mistake<SymmetricChannel> }
  | { symmetric?: false; joints: Partial<Record<JointChannel, Curve>>; mistake: Mistake<JointChannel> }
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

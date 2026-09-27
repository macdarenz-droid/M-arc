// The contract between the rig (GU-7a-1), the player (GU-7a-2) and the muscle data (GU-7a-3).
// Every number a Guide returns is the demo's (docs/design/form-guide-demo at DEMO_COMMIT).
import type { MuscleId } from '../../data/muscles';

export type View = 'side' | 'front' | 'top';
export type Scheme = 'dark' | 'light';

/** One Web Animations keyframe. `offset` is 0..1 of the 4 s rep; values are the demo's 4-decimal strings. */
export type Frame = { offset: number; transform?: string; opacity?: number; strokeDashoffset?: number };
/** Keyframes for one animated group, found in the stage markup by `className` (the demo's class, e.g. "cp-ua"). */
export type GroupFrames = { className: string; frames: Frame[] };

export type ZoomChip = { id: string; label: string; caption: string };
export type MuscleRole = 'target' | 'helps';

export type MoveSpec = {
  id: string;                     // demo id: 'cp' | 'lp' | 'lr'
  exerciseId: string;             // library id, e.g. 'lib_machine_chest_press'
  view: View;
  cam: string;                    // camera label, e.g. 'Side view'
  rep: number;                    // seconds per rep (4)
  caps: [string, string, string, string];
  tempo: string;                  // e.g. '1 s out · 2 s back'
  picsLine: string;
  srText: string;
  chips: ZoomChip[];              // 3
  pics: [string, string, string, string];
  picsAt: [number, number, number, number];
  /** rig region name -> muscle id, for the painted target and helper regions; roles come from the exercise row */
  roles: Record<string, MuscleId>;
  muscleNotes?: Partial<Record<MuscleId, string>>;
};

export type Stage = {
  svg: string;     // the stage <svg> inner markup: the rig group, overlays, guides; ids and classes as in the demo
  tiles: string;   // the 4 Pictures tiles markup
  css: string;     // exercise-specific static CSS: zoom camera transforms, overlay visibility, static part transforms
};

export type Sample = { stops: number[]; groups: GroupFrames[] };

export interface Guide {
  readonly spec: MoveSpec;
  /** the same values the demo writes into @keyframes, one entry per animated class */
  sample(): Sample;
  /** markup and CSS for the given scheme (dark or light); no hex colours, tokens only */
  stage(scheme: Scheme): Stage;
  /** the rig's derived colour tokens for the scheme, as a style string (rigVars); for tests and the fixture, not for the player (R1-12) */
  rigVars(scheme: Scheme): string;
}
// RIG_CSS is a real `export const RIG_CSS: string` in src/formguide/rig/paint.ts (GU-7a-1), never a `declare` here
// (a declare emits no runtime binding and breaks `vite build`). GU-7a-2 imports it from '@/formguide/rig/paint';
// until 7a-1 merges, its stubGuide.ts exports its own RIG_CSS and 7a-4 switches the import.


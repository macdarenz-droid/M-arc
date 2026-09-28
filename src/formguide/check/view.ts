// FG-3: what the checks need from a drawn view: a frame per pose, the figure-space position of an attachment point and
// the figure markup. Only the front view exists (FG-1); the side and back views arrive with FG-6, and until then a
// file drawn in them fails the checks that need a figure, naming the missing view.
import type { AttachmentId, ExerciseGuide, PartId } from '../model';
import type { ChannelId, JointId, Pose, View } from '../rig/joints';
import { FLOOR, FRONT_RIG, LEG_X, figureFront } from '../rig/figureFront';
import { apply, frontFrame, handAt, worldMat, type Frame, type PoseId } from '../rig/pose';
import type { TokenReader } from '../rig/paint';
import type { Pt } from '../rig/ik';
import { viewFor } from '../rig/patterns';

export type Rig = {
  view: View;
  frame: (p: Record<ChannelId, number>) => Frame;
  /** An attachment point (§3) in figure space. */
  point: (f: Frame, a: AttachmentId) => Pt;
  /** A joint's pivot in figure space. */
  pivot: (f: Frame, j: JointId) => Pt;
  /** The figure markup, with the file's hand-held part when the figure draws it (part: false leaves it out). */
  markup: (read: TokenReader, mistake: boolean, part?: boolean) => string;
};

/** Parts the figure draws in its own hand groups (FG-1: the lab's dumbbell); other parts come from the parts library. */
export const FIGURE_PARTS: readonly PartId[] = ['dumbbell'];
/** The parts library (§4, FG-5). Only `none` until then; a file using a part not here fails pathBudget. */
export const PARTS: Partial<Record<PartId, string>> = { none: '' };

/** The view a file is drawn in: its override, else its pattern's (null when the id has no library row). */
export function viewOf(g: ExerciseGuide, pattern: string | undefined): View | null {
  return g.view ?? (pattern ? viewFor(pattern) : null);
}

const FRONT_POSES: readonly string[] = ['standing', 'seated'] satisfies PoseId[];
/** The rig for a file, or the reason there is none yet. */
export function rigFor(g: ExerciseGuide, view: View | null): Rig | string {
  if (view !== 'front') return `no ${view ?? 'known'} view figure yet (FG-6 draws side and back)`;
  if (!FRONT_POSES.includes(g.pose)) return `no ${g.pose} pose in the front view yet`;
  const id = g.pose as PoseId;
  const pivot = (f: Frame, j: JointId) => apply(worldMat(j, f), FRONT_RIG[j].origin);
  const sole = (f: Frame, s: 'l' | 'r'): Pt => apply(worldMat(`ankle_${s}`, f), [LEG_X, FLOOR]);
  const point = (f: Frame, a: AttachmentId): Pt => {
    const s = a.slice(-1) as 'l' | 'r';
    if (a === 'back') return pivot(f, 'chest');
    if (a === 'hip') return pivot(f, 'pelvis');
    if (a.startsWith('hand_')) return handAt(f, s);
    if (a.startsWith('foot_')) return sole(f, s);
    return pivot(f, `${a.slice(0, -2)}_${s}` as JointId);   // shoulder_, knee_, ankle_
  };
  const db = g.equipment.kind === 'dumbbell' ? { kg: g.equipment.kg } : undefined;
  return {
    view, point, pivot,
    frame: p => frontFrame(id, p as Pose),
    markup: (read, mistake, part = true) => figureFront(read, { id: 'fgc', mistake, dumbbell: part ? db : undefined }),
  };
}

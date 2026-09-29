// FG-3: what the checks need from a drawn view: a frame per pose, the figure-space position of an attachment point and
// the figure markup. Only the front view exists (FG-1); the side and back views arrive with FG-6, and until then a
// file drawn in them fails the checks that need a figure, naming the missing view.
import type { AttachmentId, ExerciseGuide, PartId } from '../model';
import type { ChannelId, JointId, Pose, View } from '../rig/joints';
import { FLOOR, FRONT_RIG, LEG_X, figureFront } from '../rig/figureFront';
import { apply, frontFrame, localMat, mmul, resolve, riseOf, type Frame, type PoseId } from '../rig/pose';
import { CHANNELS, PARENT } from '../rig/joints';
import type { Mat } from '../rig/figureFront';
import type { TokenReader } from '../rig/paint';
import type { Pt } from '../rig/ik';
import { viewFor } from '../rig/patterns';
import { PART_BUDGET_MARKUP } from '../parts';
import { solveFrontChain } from '../solve/frontChain';
import { MACHINES, type MachineDrawing } from './machines';

export type Rig = {
  view: View;
  frame: (p: Record<ChannelId, number>) => Frame;
  /** An attachment point (§3) in figure space. */
  point: (f: Frame, a: AttachmentId) => Pt;
  /** A joint's pivot in figure space. */
  pivot: (f: Frame, j: JointId) => Pt;
  /** The figure markup, with the file's hand-held part when the figure draws it (part: false leaves it out). */
  markup: (read: TokenReader, mistake: boolean, part?: boolean) => string;
  /** V1-04: the view's two-joint solve of a limb to a point (the solver starts a two-channel contact from it). */
  chain?: (p: Record<ChannelId, number>, a: AttachmentId, target: Pt) => Partial<Record<ChannelId, number>> | null;
  /** V1-04: the drawing of the file's machine, whose parts and pads its contacts name (null: none drawn yet). */
  machine?: MachineDrawing | null;
  /** V1-04: `point(frame(p), a)` without drawing the whole frame, where the view has a shortcut (else null). */
  reach?: (p: Record<ChannelId, number>, a: AttachmentId) => Pt | null;
};

/** The front arm's own channels: nothing above the shoulder reads them, so the chest's frame does not change with them.
 * The chest is drawn once per trunk pose with the sway at 0, and the sway turned onto it (held equal by solve.test.ts). */
const ARM_CHANNELS = new Set<string>(['shoulder_abd', 'elbow_lead', 'wrist_pron', 'shrug_cm', 'scap_depress_cm'].flatMap(b => [`${b}_l`, `${b}_r`]));
// breath and layer draw their own groups, outside the chest's parent chain (joints.ts PARENT)
const TRUNK_CHANNELS = CHANNELS.filter(c => !ARM_CHANNELS.has(c) && c !== 'sway' && c !== 'breath' && c !== 'layer');
/** frontFrame's sway turns the body about the floor point under the pelvis (pose.ts:61): the chest with the sway is the
 * chest without it, turned about that point. */
const SWAY_AT: Pt = [FRONT_RIG.pelvis.origin[0], FLOOR];
const swayed = (a: number, M: Mat): Mat => { const c = Math.cos(a * D), s = Math.sin(a * D), [x, y] = SWAY_AT; return mmul([c, s, -s, c, x - c * x + s * y, y - s * x - c * y], M); };
/**
 * V1-04 (D-FG7 (b)): the front hand without drawing the frame. The solver moves only arm channels while it holds a hand,
 * so the chest's figure matrix is taken from one drawn frame (kept while the trunk's channels stay the same) and the arm
 * is multiplied on in pose.ts's order, with frontFrame's shoulder, elbow and wrist ops (frontFrame, pose.ts:77-79). Held
 * equal to `point(frame(p))` to 1e-9 by solve.test.ts.
 */
const D = Math.PI / 180;
/** q turned by a° as pose.ts opMat's rotate turns it. */
const turn = (a: number, q: Pt): Pt => { const c = Math.cos(a * D), s = Math.sin(a * D); return [c * q[0] - s * q[1], s * q[0] + c * q[1]]; };
/** The arm joints turn about their own placement (origin [0, 0], figureFront FRONT_RIG), so each one's matrix is its
 * placement times its ops; the wrist's op is a 0° turn, so the hand is the wrist placement's image of [0, 0]. */
const HAND = { l: apply(FRONT_RIG.wrist_l.at, [0, 0]), r: apply(FRONT_RIG.wrist_r.at, [0, 0]) };
function frontReach(id: PoseId) {
  let key: (number | undefined)[] | null = null, sway = NaN;
  const still: Record<'l' | 'r', Mat | null> = { l: null, r: null }, toChest: Record<'l' | 'r', Mat | null> = { l: null, r: null };
  return (p: Record<ChannelId, number>, a: AttachmentId): Pt | null => {
    if (a !== 'hand_l' && a !== 'hand_r') return null;
    let same = !!key;
    for (let i = 0; same && i < TRUNK_CHANNELS.length; i++) same = p[TRUNK_CHANNELS[i]!] === key![i];
    if (!same) {
      key = TRUNK_CHANNELS.map(c => p[c]); sway = NaN;
      const chest = worldMat('chest', frontFrame(id, { ...p, sway: 0 } as Pose));
      still.l = mmul(chest, FRONT_RIG.shoulder_l.at); still.r = mmul(chest, FRONT_RIG.shoulder_r.at);
    }
    const w = p.sway ?? 0;
    if (w !== sway) { sway = w; toChest.l = swayed(w, still.l!); toChest.r = swayed(w, still.r!); }
    // frontFrame's arm ops (pose.ts:77-79), applied to the point from the wrist inward: elbow turn, elbow placement,
    // shoulder turn, shoulder rise, then the shoulder placement in the chest's figure frame
    const v = resolve(id, p as Pose), s = a.slice(-1) as 'l' | 'r', abd = v(`shoulder_abd_${s}`), r = riseOf(abd, v(`shrug_cm_${s}`), v(`scap_depress_cm_${s}`));
    const q = turn(-abd, apply(FRONT_RIG[`elbow_${s}`].at, turn(v(`elbow_lead_${s}`), HAND[s])));
    return apply(toChest[s]!, [q[0], q[1] - r]);
  };
}

/** Parts the figure draws in its own hand groups (FG-1: the lab's dumbbell); other parts come from the parts library. */
export const FIGURE_PARTS: readonly PartId[] = ['dumbbell'];
/** The parts library (§4): FG-5's free-weight parts at their worst case (parts/index.ts PART_BUDGET_MARKUP); a file
 * using a part not here fails pathBudget. */
export const PARTS: Partial<Record<PartId, string>> = { none: '', ...PART_BUDGET_MARKUP };

/** The view a file is drawn in: its override, else its pattern's (null when the id has no library row). */
export function viewOf(g: ExerciseGuide, pattern: string | undefined): View | null {
  return g.view ?? (pattern ? viewFor(pattern) : null);
}

/** pose.ts worldMat with each frame's joint matrices kept, so the points of one frame share their parent chain (the
 * V1-04 solver reads both hands of every frame it draws); the same products in the same order, so the same numbers. */
const worlds = new WeakMap<Frame, Map<JointId, Mat>>();
function worldMat(j: JointId, f: Frame): Mat {
  let m = worlds.get(f);
  if (!m) worlds.set(f, (m = new Map()));
  let w = m.get(j);
  if (!w) { const p = PARENT[j]; w = p ? mmul(worldMat(p, f), localMat(j, f[j])) : localMat(j, f[j]); m.set(j, w); }
  return w;
}

const FRONT_POSES: readonly string[] = ['standing', 'seated'] satisfies PoseId[];
/** The rig for a file, or the reason there is none yet. */
export function rigFor(g: ExerciseGuide, view: View | null): Rig | string {
  if (view !== 'front') return `no ${view ?? 'known'} view figure yet (FG-6 draws side and back)`;
  if (!FRONT_POSES.includes(g.pose)) return `no ${g.pose} pose in the front view yet`;
  const id = g.pose as PoseId;
  const pivot = (f: Frame, j: JointId) => apply(worldMat(j, f), FRONT_RIG[j].origin);
  const sole = (f: Frame, s: 'l' | 'r'): Pt => apply(worldMat(`ankle_${s}`, f), [LEG_X, FLOOR]);
  const handAt = (f: Frame, s: 'l' | 'r'): Pt => apply(worldMat(`wrist_${s}`, f), [0, 0]);
  const point = (f: Frame, a: AttachmentId): Pt => {
    const s = a.slice(-1) as 'l' | 'r';
    if (a === 'back') return pivot(f, 'chest');
    if (a === 'hip') return pivot(f, 'pelvis');
    if (a.startsWith('hand_')) return handAt(f, s);
    if (a.startsWith('foot_')) return sole(f, s);
    return pivot(f, `${a.slice(0, -2)}_${s}` as JointId);   // shoulder_, knee_, ankle_
  };
  const db = g.equipment.kind === 'dumbbell' ? { kg: g.equipment.kg } : undefined;
  // the front arm: shoulder_abd and elbow_lead to a hand target, the shoulder's rise at its fixed point (V1-04 A10)
  const chain = (p: Record<ChannelId, number>, a: AttachmentId, target: Pt) => {
    if (!/^hand_[lr]$/.test(a)) return null;
    const s = a.slice(-1) as 'l' | 'r', x = solveFrontChain(id, p as Pose, s, target);
    return { [`shoulder_abd_${s}`]: x.shoulder_abd, [`elbow_lead_${s}`]: x.elbow_lead } as Partial<Record<ChannelId, number>>;
  };
  return {
    view, point, pivot, chain, machine: g.machine ? MACHINES[g.machine.id] ?? null : null, reach: frontReach(id),
    frame: p => frontFrame(id, p as Pose),
    markup: (read, mistake, part = true) => figureFront(read, { id: 'fgc', mistake, dumbbell: part ? db : undefined }),
  };
}

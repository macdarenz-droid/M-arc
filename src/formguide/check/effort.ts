// FG-3: muscle effort over a rep, the input of the muscleTiming check and (FG-4) the shimmer. Shared helper: the player
// card reads the same numbers. Pure, no DOM.
//
// `effort: { model: 'torque', chain }` is the Lateral Raise Lab's model (lateral-raise-lab.html v6, `effort`): the load's
// horizontal moment arm about the chain's first joint over the arm's full reach (the lab's torque / TMAX), then
// target 0.12 + 0.88 t, helpers 0.08 + 0.42 t, keep-quiet 0.06 + 0.14 t. The lab's upper-trap rise with the shrug
// (+0.72 per 5 cm) and with the thumbs turned down (+0.1 per 40°) is kept for `upper_traps`; no other keep-quiet muscle
// has a cited coupling, so a file shows those rising in its mistake with `mistake.muscles`.
// V1-10: `force: { along: part }` takes the moment arm from the machine's force line instead of gravity's horizontal
// arm: the perpendicular distance from the chain's first joint to the line through the load point along the force. A
// cable pulls from the load toward its pulley (the part's path[0], where the cable leaves the wrap), a carriage along
// its rail, a lever along its tangent at the load (perpendicular to the pivot-to-load radius). The same reach
// normalises it, so t stays in 0..1. A named part that is not drawn, or a machine file with no `force`, is "no contact
// force".
// `effort` as curves per muscle is evaluated like the joint curves; `mistake.muscles` replaces a muscle's effort in the
// mistake (absolute 0..1, in the mistake's own tempo), as the lat-pulldown example of §2 reads.
import type { MuscleId } from '@/data/muscles';
import type { Curve, ExerciseGuide } from '../model';
import type { ChannelId, JointId } from '../rig/joints';
import { curveAt, poseAt, tempoOf, windowsFor, type Figure } from '../sample';
import type { Pt } from '../rig/ik';
import type { MachinePart } from './machines';
import type { Rig } from './view';

export const TORQUE = { target: [0.12, 0.88], helps: [0.08, 0.42], keepQuiet: [0.06, 0.14] } as const;
export const TRAP_PER_SHRUG_CM = 0.72 / 5, TRAP_PER_PRON_DEG = 0.1 / 40;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ARM = /^(shoulder|elbow|wrist)_([lr])$/, LEG = /^(hip|knee|ankle)_([lr])$/;

/** The unit direction the contact force acts along at the load point (V1-10); [0, 0] where it has none. */
export function forceLine(p: MachinePart, load: Pt): Pt {
  let d: Pt;
  if (p.kind === 'lever') d = [p.pivot[1] - load[1], load[0] - p.pivot[0]];
  else if (p.kind === 'cable') {
    d = [p.path[0][0] - load[0], p.path[0][1] - load[1]];
    if (Math.hypot(d[0], d[1]) < 1e-9) d = [p.path[0][0] - p.path[1][0], p.path[0][1] - p.path[1][1]];
  } else d = [p.path[1][0] - p.path[0][0], p.path[1][1] - p.path[0][1]];
  const n = Math.hypot(d[0], d[1]);
  return n < 1e-9 ? [0, 0] : [d[0] / n, d[1] / n];
}

/** The muscles a file names, each with its role. */
export function roles(g: ExerciseGuide): Map<MuscleId, keyof typeof TORQUE> {
  const r = new Map<MuscleId, keyof typeof TORQUE>();
  for (const k of ['keepQuiet', 'helps', 'target'] as const) for (const m of g.muscles[k]) r.set(m, k);
  return r;
}

/** effort(u) for every named muscle (and every muscle the mistake gives a curve), or the reason it cannot be computed. */
export function effortOf(g: ExerciseGuide, figure: Figure, rep: number, rig: Rig | string): ((u: number) => Partial<Record<MuscleId, number>>) | string {
  const ws = windowsFor(tempoOf(g, figure, rep), g.order, g.kind), base = windowsFor(g.tempo, g.order, g.kind);
  const mBase = windowsFor(g.mistake.tempo ?? g.tempo, g.order, g.kind);
  const over = (figure === 'mistake' ? g.mistake.muscles ?? {} : {}) as Partial<Record<MuscleId, Curve>>;
  const role = roles(g), e = g.muscles.effort;
  let model: (u: number) => Partial<Record<MuscleId, number>>;
  if ('model' in e) {
    if (typeof rig === 'string') return `torque model needs a figure: ${rig}`;
    const j = e.chain[0] as JointId | undefined, arm = j && ARM.exec(j), leg = j && LEG.exec(j);
    if (!j || (!arm && !leg)) return `torque model has no load point for chain [${e.chain.join(', ')}]`;
    const s = (arm ?? leg)![2] as 'l' | 'r';
    const bones: JointId[] = arm ? [`shoulder_${s}`, `elbow_${s}`, `wrist_${s}`] : [`hip_${s}`, `knee_${s}`, `ankle_${s}`];
    const from = bones.indexOf(j), f0 = rig.frame(poseAt(g, 0, 'correct', 0, rig));
    let reach = 0;
    for (let i = from; i < bones.length - 1; i++) { const a = rig.pivot(f0, bones[i]!), b = rig.pivot(f0, bones[i + 1]!); reach += Math.hypot(b[0] - a[0], b[1] - a[1]); }
    if (!(reach > 0)) return `torque model: chain [${e.chain.join(', ')}] has no length`;
    let part: MachinePart | undefined;
    if (g.machine && !e.force) return 'no contact force: a machine file must declare force';
    if (e.force && e.force !== 'gravity') {
      const along = e.force.along;
      part = g.machine ? rig.machine?.parts[along] : undefined;
      if (!part) return `no contact force: ${!g.machine ? 'the file has no machine' : !rig.machine ? `machine ${g.machine.id} has no drawing` : `part ${along} is not in machine ${g.machine.id}`}, so the force along ${along} has no line`;
    }
    model = u => {
      const p = poseAt(g, u, figure, rep, rig), f = rig.frame(p);
      const load = arm ? rig.point(f, `hand_${s}`) : rig.pivot(f, `ankle_${s}`), at = rig.pivot(f, j);
      let moment: number;
      if (part) { const d = forceLine(part, load); moment = Math.abs((load[0] - at[0]) * d[1] - (load[1] - at[1]) * d[0]); }
      else moment = Math.abs(load[0] - at[0]);
      const t = clamp01(moment / reach), out: Partial<Record<MuscleId, number>> = {};
      for (const [m, r] of role) {
        let v = TORQUE[r][0] + TORQUE[r][1] * t;
        if (m === 'upper_traps') v += TRAP_PER_SHRUG_CM * Math.max(0, p[`shrug_cm_${s}` as ChannelId]) + TRAP_PER_PRON_DEG * Math.max(0, p[`wrist_pron_${s}` as ChannelId]);
        out[m] = clamp01(v);
      }
      return out;
    };
  } else {
    const curves = e as Partial<Record<MuscleId, Curve>>;
    model = u => { const out: Partial<Record<MuscleId, number>> = {}; for (const m of role.keys()) { const c = curves[m]; out[m] = c === undefined ? 0 : curveAt(c, ws, u, base); } return out; };
  }
  return u => {
    const out = model(u);
    for (const [m, c] of Object.entries(over) as [MuscleId, Curve][]) out[m] = curveAt(c, ws, u, mBase);
    return out;
  };
}

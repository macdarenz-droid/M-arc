// V1-19: the readouts of docs/FORM-GUIDE-PRODUCTION.md §1 (joint angle, hand speed, effort per muscle, phase bar), read
// from the same model the figure plays: poseAt for the angle and the hand, effortOf for the bars, the chained clock of
// guideView for the rep. Pure, no DOM; the player writes them into its readout row on each animation frame.
import type { MuscleId } from '@/data/muscles';
import type { ExerciseGuide } from '../model';
import type { ChannelId } from '../rig/joints';
import { P2 } from '../rig/figureFront';
import { poseAt, repSeconds, sampleGuide, tempoOf, windowsFor, type Figure, type PhaseName } from '../sample';
import { effortOf, roles } from '../check/effort';
import type { Rig } from '../check/view';
import { REPS } from './guideView';

/** The label a channel's readout carries (the lab's "Arm angle" for the shoulder). */
const LABEL: Record<string, string> = {
  shoulder_abd: 'Arm angle', shoulder_flex: 'Arm angle', elbow_flex: 'Elbow', elbow_lead: 'Elbow',
  hip_flex: 'Hip', hip_abd: 'Hip', knee_flex: 'Knee', ankle_flex: 'Ankle', wrist_pron: 'Wrist', torso_lean: 'Trunk',
};

/**
 * The working joint: the sided degree channel that moves most over the correct first rep, the right side first
 * (the side the tag and the arc are drawn on). Null when nothing moves.
 */
export function workingChannel(g: ExerciseGuide): ChannelId | null {
  let best: ChannelId | null = null, span = 0.5;
  for (const ch of sampleGuide(g, 'correct', 0).channels) {
    if (!/_[lr]$/.test(ch.id) || ch.id.includes('_cm')) continue;
    const vs = ch.stops.map(s => s[1]), d = Math.max(...vs) - Math.min(...vs);
    if (d > span + 1e-6 || (best && Math.abs(d - span) <= 1e-6 && ch.id.endsWith('_r') && !best.endsWith('_r'))) { best = ch.id; span = d; }
  }
  return best;
}

/** The working joint's readout label, or null when nothing moves. */
export function angleLabel(g: ExerciseGuide): string | null {
  const ch = workingChannel(g);
  return ch ? LABEL[ch.slice(0, -2)] ?? 'Angle' : null;
}

/** The chained clock (ms into the REPS-rep run) as the rep (0-based) and rep fraction the figure is at. */
export function repAt(g: ExerciseGuide, figure: Figure, ms: number): { r: number; rep: number; u: number } {
  const len = repSeconds(g.tempo) * 1000, t = Math.min(REPS * len, Math.max(0, ms));
  const r = Math.min(REPS - 1, Math.floor(t / len)), u = Math.min(1, (t - r * len) / len);
  return { r, rep: figure === 'mistake' ? 0 : r, u };
}

export type EffortRow = { id: MuscleId; role: 'target' | 'helps' | 'keepQuiet'; v: number };
export type Readout = {
  /** 1-based rep of the run */
  rep: number;
  phase: PhaseName;
  /** position in the rep, 0..1 (the phase bar's marker) */
  u: number;
  angle: { channel: ChannelId; label: string; deg: number } | null;
  /** hand speed, m/s */
  speed: number;
  effort: EffortRow[];
};

const ROLE_ORDER = { target: 0, helps: 1, keepQuiet: 2 } as const;
/** The file's muscles, targets first, then helpers, then keep-quiet (the bar order). */
export const effortRows = (g: ExerciseGuide): Omit<EffortRow, 'v'>[] =>
  [...roles(g)].map(([id, role]) => ({ id, role })).sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]);

/** Seconds either side of a time for the hand's speed (the lab's speedAt step). */
const H = 0.01;

/** A readout function for one guide, caching the effort model per figure and rep. */
export function readouts(g: ExerciseGuide, rig: Rig): (figure: Figure, ms: number) => Readout {
  const ch = workingChannel(g), rows = effortRows(g), eff = new Map<string, ReturnType<typeof effortOf>>();
  const side = ch?.endsWith('_l') ? 'l' : 'r', repS = repSeconds(g.tempo);
  // Speed shows the rep's motion, not the secondary motion (supervisor re-guide on the check-in): the hand is read on
  // the pose with the hold tremor and the balance sway at 0, as D-FG3 reads grip paths in the body's frame.
  const still: ExerciseGuide = { ...g, movement: { ...g.movement, tremorDeg: 0 } };
  const hand = (figure: Figure, rep: number, u: number) => {
    const p = poseAt(still, Math.min(1, Math.max(0, u)), figure, rep);
    return rig.point(rig.frame({ ...p, sway: 0 }), `hand_${side}`);
  };
  return (figure, ms) => {
    const { r, rep, u } = repAt(g, figure, ms);
    const ws = windowsFor(tempoOf(g, figure, rep), g.order, g.kind);
    const phase = (ws.find(w => u < w.u1 && w.u1 > w.u0) ?? ws[ws.length - 1]!).name;
    const p = poseAt(g, u, figure, rep);
    const du = H / repS, a = hand(figure, rep, u - du), b = hand(figure, rep, u + du);
    const span = (Math.min(1, u + du) - Math.max(0, u - du)) * repS;
    const speed = span > 0 ? Math.hypot(b[0] - a[0], b[1] - a[1]) / P2 / span : 0;
    const key = `${figure}${rep}`;
    if (!eff.has(key)) eff.set(key, effortOf(g, figure, rep, rig));
    const e = eff.get(key)!, ev = typeof e === 'string' ? {} : e(u);
    return {
      rep: r + 1, phase, u, speed,
      angle: ch ? { channel: ch, label: angleLabel(g)!, deg: p[ch] } : null,
      effort: rows.map(x => ({ ...x, v: ev[x.id] ?? 0 })),
    };
  };
}

/** One readout (readouts() once per guide in the player; this is the one-off form). */
export const readoutAt = (g: ExerciseGuide, rig: Rig, figure: Figure, ms: number): Readout => readouts(g, rig)(figure, ms);

/** The phase bar of one rep: each phase with its share of the rep (a phase of 0 s is left out). */
export function phaseBar(g: ExerciseGuide, figure: Figure, rep: number): { name: PhaseName; frac: number }[] {
  return windowsFor(tempoOf(g, figure, rep), g.order, g.kind).filter(w => w.u1 > w.u0).map(w => ({ name: w.name, frac: w.u1 - w.u0 }));
}

export const fmtDeg = (v: number): string => `${Math.round(v) || 0}°`;
export const fmtPct = (v: number): string => `${Math.round(100 * Math.min(1, Math.max(0, v)))}%`;
export const fmtSpeed = (v: number): string => `${v.toFixed(1)} m/s`;

// FG-4: what the player shows for an ExerciseGuide (docs/FORM-GUIDE-PRODUCTION.md §6 "Rendering"): the WAAPI keyframes
// of the three reps chained (one keyframe set per rep, so the slow-down plays with no per-frame code), the effort
// tints, the four key moments, the captions and the camera. Pure, no DOM; the markup is FG-1's figure.
import type { MuscleId } from '@/data/muscles';
import type { Frame as Keyframe, GroupFrames } from '../rig/api';
import { JOINTS, type ChannelId, type Pose } from '../rig/joints';
import { css, type Frame } from '../rig/pose';
import type { TokenReader } from '../rig/paint';
import { figureFront } from '../rig/figureFront';
import { figureSide } from '../rig/figureSide';
import { VIEWBOXES, type ExerciseGuide, type RepTempo } from '../model';
import { repSeconds, sampleGuide, tempoOf, windowsFor, type Figure, type PhaseName, type Window } from '../sample';
import { effortOf } from '../check/effort';
import { heldOf, rigFor, viewOf, type Rig } from '../check/view';

/** Reps per play (GU-7a R1-3: three, then hold the start pose). */
export const REPS = 3;
/** Effort (0..1) to tint and band opacity (D-FG4): the tint reads at every load and never hides the shading; the
 * shimmer band shows only in the upper half of the effort, so it marks where the load peaks. */
export const tintOf = (e: number): number => 0.6 * Math.min(1, Math.max(0, e));
export const bandOf = (e: number): number => Math.min(1, Math.max(0, (e - 0.5) / 0.5));

/** The drawn rig for a guide, or why there is none (the back view until V1-22, a pose a view does not draw yet). */
export function guideRig(g: ExerciseGuide, pattern: string | undefined): Rig {
  const r = rigFor(g, viewOf(g, pattern));
  if (typeof r === 'string') throw new Error(`form guide ${g.id}: ${r}`);
  return r;
}

const r4 = (v: number) => { const x = Math.round(v * 1e4) / 1e4; return x === 0 ? 0 : x; };
const SIDES = ['l', 'r'] as const;

/** The tint and band keys the markup draws for the file's muscles, with the muscle each shows. */
function overlayKeys(g: ExerciseGuide, markup: string): { key: string; m: MuscleId; band: boolean }[] {
  const out: { key: string; m: MuscleId; band: boolean }[] = [];
  const ms = new Set<MuscleId>([...g.muscles.target, ...g.muscles.helps, ...g.muscles.keepQuiet]);
  for (const m of ms) for (const s of SIDES) for (const band of [false, true]) {
    const key = `${band ? 'b' : 't'}-${m}_${s}`;
    if (markup.includes(`class="fg-p fg-${key}"`)) out.push({ key, m, band });
  }
  return out;
}

/** The frame (transforms and tint opacities) of a figure at rep fraction u of rep `rep`. */
export function frameFn(g: ExerciseGuide, rig: Rig, figure: Figure, rep: number, markup: string): (pose: Pose, u: number) => Frame {
  const eff = effortOf(g, figure, rep, rig), keys = overlayKeys(g, markup);
  return (pose, u) => {
    const f = rig.frame(pose as Record<ChannelId, number>);
    if (typeof eff === 'string') return f;
    const e = eff(u);
    for (const k of keys) f[k.key] = { opacity: (k.band ? bandOf : tintOf)(e[k.m] ?? 0) };
    return f;
  };
}

/** A key of the frame as the class the markup gives its element (joints `j-<id>`, parts `fg-<name>`). */
const classOf = (key: string) => ((JOINTS as readonly string[]).includes(key) ? `j-${key}` : `fg-${key}`);

/**
 * The WAAPI groups of one figure over REPS reps chained into one timeline: rep r's stops at offset (r + u) / REPS.
 * The correct figure plays rep 0, 1, 2 (each its own slowed lift); the mistake plays its one rep REPS times. Runs of an
 * unchanged value keep their first and last keyframe only (the same picture under linear interpolation).
 */
export function chainedGroups(g: ExerciseGuide, rig: Rig, figure: Figure, markup: string): GroupFrames[] {
  const by = new Map<string, Keyframe[]>(), drawn = new Map<string, boolean>();
  const has = (key: string) => {
    let v = drawn.get(key);
    if (v === undefined) drawn.set(key, (v = markup.includes(`class="${(JOINTS as readonly string[]).includes(key) ? 'fg-j' : 'fg-p'} ${classOf(key)}"`)));
    return v;
  };
  for (let r = 0; r < REPS; r++) {
    const s = sampleGuide(g, figure, figure === 'mistake' ? 0 : r), fr = frameFn(g, rig, figure, figure === 'mistake' ? 0 : r, markup);
    s.stops.forEach((u, i) => {
      if (r > 0 && i === 0) return;                         // rep r starts where rep r - 1 ended (the start pose)
      const pose: Pose = {};
      for (const ch of s.channels) pose[ch.id] = ch.stops[i]![1];
      const offset = r4((r + u) / REPS), f = fr(pose, u);
      for (const [key, xf] of Object.entries(f)) {
        if (!has(key)) continue;
        const k: Keyframe = xf.ops ? { offset, transform: css(xf.ops) } : { offset, opacity: r4(xf.opacity) };
        let list = by.get(key);
        if (!list) by.set(key, (list = []));
        list.push(k);
      }
    });
  }
  const same = (a: Keyframe, b: Keyframe) => a.transform === b.transform && a.opacity === b.opacity;
  return [...by].map(([key, fs]) => ({
    className: classOf(key),
    frames: fs.filter((f, i) => i === 0 || i === fs.length - 1 || !(same(f, fs[i - 1]!) && same(f, fs[i + 1]!))),
  }));
}

/** The frame of the figure at one key moment (the correct figure's first rep, or the mistake). */
export function momentFrame(g: ExerciseGuide, rig: Rig, figure: Figure, u: number, markup: string): Frame {
  const s = sampleGuide(g, figure, 0);
  const i = s.stops.reduce((b, v, k) => (Math.abs(v - u) < Math.abs(s.stops[b]! - u) ? k : b), 0);
  const pose: Pose = {};
  for (const ch of s.channels) pose[ch.id] = ch.stops[i]![1];
  return frameFn(g, rig, figure, 0, markup)(pose, s.stops[i]!);
}

/** The four key moments (§1, the rule of check/index.ts `moments`): start, mid first move, top, mid second move. */
export function momentsOf(g: ExerciseGuide, figure: Figure = 'correct'): number[] {
  const ws = windowsFor(tempoOf(g, figure, 0), g.order, g.kind), m1 = ws.find(w => w.move === 1), m2 = ws.find(w => w.move === 2);
  return m1 && m2 ? [0, (m1.u0 + m1.u1) / 2, m1.u1, (m2.u0 + m2.u1) / 2] : [0, 0.25, 0.5, 0.75];
}

const sec = (v: number) => `${+v.toFixed(1)} s`;
const PHASE_CAP: Record<PhaseName, string> = { lift: 'Lift', hold: 'Hold', lower: 'Lower slowly', rest: 'Reset' };

/** Texts of the player for a guide: captions per phase name, the tempo line, the four tile captions, the summary. */
export function textsOf(g: ExerciseGuide, name: string) {
  const t = g.tempo as RepTempo, rep = 'lift' in g.tempo;
  const first = g.order === 'lift_first' ? 'up' : 'down', second = first === 'up' ? 'down' : 'up';
  const caps = (p: PhaseName) => `${PHASE_CAP[p]}, ${sec(rep ? t[p] : repSeconds(g.tempo))}`;
  const tempo = rep ? `${sec(g.order === 'lift_first' ? t.lift : t.lower)} ${first} · ${sec(g.order === 'lift_first' ? t.lower : t.lift)} ${second}` : `Hold ${sec(repSeconds(g.tempo))}`;
  const top = g.order === 'lift_first' ? 'Top' : 'Bottom';
  const pics = rep ? ['Start', `Halfway ${first}`, t.hold ? `${top}: hold ${sec(t.hold)}` : top, `Halfway ${second}`] : ['Start', 'Holding', 'Holding', 'End'];
  const picsLine = rep ? `Lift ${sec(t.lift)}, hold ${sec(t.hold)}, lower ${sec(t.lower)}` : `Hold ${sec(repSeconds(g.tempo))}`;
  const sr = rep
    ? `One rep of ${name}: lift for ${sec(t.lift)}, hold ${sec(t.hold)}, lower for ${sec(t.lower)}, then reset. ${g.cues.join(' ')}`
    : `${name}: hold for ${sec(repSeconds(g.tempo))}. ${g.cues.join(' ')}`;
  return { caps, tempo, pics, picsLine, sr, cue: g.cues.join(' '), tells: `${g.mistake.name}: ${g.mistake.tells.map(x => x.text).join(' ')}` };
}

/** Rep (1..3), the phase playing and whether the run is over, from the animation's own clock (ms). */
export function clockOf(g: ExerciseGuide, ms: number): { rep: 1 | 2 | 3; phase: PhaseName; done: boolean } {
  const len = repSeconds(g.tempo) * 1000, done = ms >= REPS * len, t = done ? 0 : Math.max(0, ms);
  const r = Math.min(REPS - 1, Math.floor(t / len)), u = (t - r * len) / len;
  const ws: Window[] = windowsFor(tempoOf(g, 'correct', r), g.order, g.kind);
  const w = ws.find(x => u < x.u1 && x.u1 > x.u0) ?? ws[ws.length - 1]!;
  return { rep: (r + 1) as 1 | 2 | 3, phase: w.name, done };
}

export type Box = readonly [number, number, number, number];
/** The scene's viewBox: the full or zoom camera, twice as wide in compare mode (the mistake figure to the right). A
 * mirrored file's camera is reflected about x = 200 with its figure (the full cameras are centred there, so only a zoom
 * moves). */
export function cameraOf(g: ExerciseGuide, zoom: boolean, compare: boolean): { box: Box; dx: number } {
  const v = VIEWBOXES[zoom ? g.camera.zoom : g.camera.full], b: Box = g.mirror ? [400 - v[0] - v[2], v[1], v[2], v[3]] : v;
  return { box: compare ? [b[0], b[1], b[2] * 2, b[3]] : b, dx: b[2] };
}

/**
 * The figure markup for a guide (TokenReader: the live page or a theme). `id` prefixes the gradient ids, unique per live
 * figure on the page; `load` is the number the dumbbell label shows (the last logged set, in the display unit).
 */
export function markupOf(g: ExerciseGuide, rig: Rig, read: TokenReader, o: { id: string; mistake: boolean; load: number | null }): string {
  if (rig.view === 'side') return figureSide(read, { id: o.id, mistake: o.mistake, mirror: !!g.mirror, held: heldOf(g) });
  if (rig.view !== 'front') throw new Error(`form guide ${g.id}: no ${rig.view} figure yet`);
  const db = g.equipment.kind === 'dumbbell' ? { kg: o.load ?? undefined } : undefined;
  return figureFront(read, { id: o.id, mistake: o.mistake, dumbbell: db });
}

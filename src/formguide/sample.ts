// FG-2: sampling an ExerciseGuide (docs/FORM-GUIDE-PRODUCTION.md §2, §5 "stops", §6 "Rendering"). The phase windows
// come from the file's tempo and order, never a fixed 1/0.5/2/0.5 s. stopsFor and the Channel type are ported from
// GU-7a (PR #40, rig/stops.ts and moves/types.ts). Pure, no DOM.
import { BODY, CHANNELS, SIDED, type ChannelId, type Kind, type Order, type Side } from './rig/joints';
import type { AttachmentId, Curve, ExerciseGuide, RepTempo, Tempo } from './model';
import type { Pt } from './rig/ik';
import { compile, pointsOf, firstSeed, needsRig, solveSystem, travelOf, validateSolve, type Seed, type SolveRig, type System } from './solve';

export type PhaseName = 'lift' | 'hold' | 'lower' | 'rest';
/** One phase of the rep in rep fractions. `move` is 1 or 2 for the first and second moving phase in `order`, else 0;
 * `half` is the alternating half-rep (0 for every other kind). */
export type Window = { name: PhaseName; u0: number; u1: number; s0: number; s1: number; move: 0 | 1 | 2; half: 0 | 1 };

/** Intervals per moving phase: GU-7a's spacing (0.25 % of a 4 s rep across a 1 s lift, 0.5 % across a 2 s lower). */
export const STEPS_PER_PHASE = 100;
const EPS = 1e-9;

const isRep = (t: Tempo): t is RepTempo => 'lift' in t;
export const repSeconds = (t: Tempo): number => (isRep(t) ? t.lift + t.hold + t.lower + t.rest : t.hold);

/** The phase windows of one rep (alternating: two half-reps, the first for the `_r` side). */
export function windowsFor(tempo: Tempo, order: Order, kind: Kind): Window[] {
  if ((kind === 'hold') === isRep(tempo)) throw new Error(`${kind} needs ${kind === 'hold' ? '{ hold }' : '{ lift, hold, lower, rest }'} tempo`);
  if (!isRep(tempo)) return [{ name: 'hold', u0: 0, u1: 1, s0: 0, s1: tempo.hold, move: 0, half: 0 }];
  const seq: PhaseName[] = order === 'lift_first' ? ['lift', 'hold', 'lower', 'rest'] : ['lower', 'hold', 'lift', 'rest'];
  const halves = kind === 'alternating' ? 2 : 1, T = repSeconds(tempo) * halves, out: Window[] = [];
  let s = 0;
  for (let h = 0; h < halves; h++) {
    let m = 0;
    for (const name of seq) {
      const d = tempo[name], moving = name === 'lift' || name === 'lower';
      if (moving) m++;
      out.push({ name, u0: s / T, u1: (s + d) / T, s0: s, s1: s + d, move: moving ? (m as 1 | 2) : 0, half: h as 0 | 1 });
      s += d;
    }
  }
  return out;
}

/** Keyframe offsets (0..1): STEPS_PER_PHASE intervals across each moving phase, holds and rests at their boundaries only. */
export function stopsFor(tempo: Tempo, order: Order, kind: Kind): number[] {
  const out: number[] = [];
  const push = (u: number) => { if (!out.length || u - out[out.length - 1]! > EPS) out.push(u); };
  for (const w of windowsFor(tempo, order, kind)) {
    if (w.u1 - w.u0 <= EPS) continue;
    if (!w.move) { push(w.u0); push(w.u1); continue; }
    for (let i = 0; i <= STEPS_PER_PHASE; i++) push(w.u0 + ((w.u1 - w.u0) * i) / STEPS_PER_PHASE);
  }
  push(1);
  return out;
}

/** minimum-jerk blend 0..1 */
export const mj = (s: number): number => { s = Math.min(1, Math.max(0, s)); return s * s * s * (10 - 15 * s + 6 * s * s); };

/** Where rep fraction u falls: its window and the progress through it (0..1). */
function locate(ws: Window[], u: number): { w: Window; s: number; i: number } {
  let i = -1;
  for (let k = 0; k < ws.length; k++) {
    if (ws[k]!.u1 - ws[k]!.u0 <= EPS) continue;
    i = k;
    if (u < ws[k]!.u1) break;
  }
  const w = ws[i]!;
  return { w, s: Math.min(1, Math.max(0, (u - w.u0) / (w.u1 - w.u0))), i };
}

/** Progress toward the far position: 0 at the start, minimum-jerk out over the first moving phase, 1 across the hold
 * between, back to 0 over the second and through the rest; a hold-only rep drifts linearly 0 → 1. */
export function envelope(ws: Window[], u: number): number {
  const { w, s } = locate(ws, u);
  if (ws.length === 1) return s;
  return w.move === 1 ? mj(s) : w.move === 2 ? 1 - mj(s) : w.name === 'hold' ? 1 : 0;
}

/** Maps rep fraction u under `ws` to the same phase point under `base` (keys are written in the file's own tempo). */
export function warp(ws: Window[], base: Window[], u: number): number {
  if (ws === base) return u;
  const { s, i } = locate(ws, u), b = base[i]!;
  return b.u0 + s * (b.u1 - b.u0);
}

/**
 * Key speeds (per unit of u): Fritsch–Butland's monotone rule, zero at the first and last key, at a turning point and on
 * a plateau, and at most 2× either neighbouring slope, which keeps every quintic segment monotone (no overshoot).
 */
function keySpeeds(keys: [number, number][]): number[] {
  const n = keys.length, h = (i: number) => keys[i + 1]![0] - keys[i]![0], d = (i: number) => (h(i) > EPS ? (keys[i + 1]![1] - keys[i]![1]) / h(i) : 0);
  return keys.map((_, k) => {
    if (k === 0 || k === n - 1) return 0;
    const a = d(k - 1), b = d(k);
    if (a * b <= 0) return 0;
    const w1 = 2 * h(k) + h(k - 1), w2 = h(k) + 2 * h(k - 1), m = (w1 + w2) / (w1 / a + w2 / b);
    return Math.sign(m) * Math.min(Math.abs(m), 2 * Math.abs(a), 2 * Math.abs(b));
  });
}
const speedCache = new WeakMap<object, number[]>();

/** Keys: a minimum-jerk (quintic) segment between each pair, zero acceleration at every key, through each key at its
 * monotone speed; two keys give exactly the minimum-jerk blend. */
export function keysAt(keys: [number, number][], u: number): number {
  if (u <= keys[0]![0]) return keys[0]![1];
  let v = speedCache.get(keys);
  if (!v) { v = keySpeeds(keys); speedCache.set(keys, v); }
  for (let i = 1; i < keys.length; i++) {
    const [t1, p1] = keys[i]!;
    if (u > t1) continue;
    const [t0, p0] = keys[i - 1]!, L = t1 - t0;
    if (L <= EPS) return p1;
    const s = (u - t0) / L, s3 = s * s * s, s4 = s3 * s, s5 = s4 * s;
    return p0 + (p1 - p0) * (10 * s3 - 15 * s4 + 6 * s5) + L * (v[i - 1]! * (s - 6 * s3 + 8 * s4 - 3 * s5) + v[i]! * (-4 * s3 + 7 * s4 - 3 * s5));
  }
  return keys[keys.length - 1]![1];
}

/** A curve's value at rep fraction u (`base`: the windows of the tempo the file's keys are written in). */
export function curveAt(c: Curve, ws: Window[], u: number, base: Window[] = ws, half?: 0 | 1): number {
  if (typeof c === 'number') return c;
  if (Array.isArray(c)) {
    if (half !== undefined && locate(ws, u).w.half !== half) return c[0];
    return c[0] + (c[1] - c[0]) * envelope(ws, u);
  }
  return keysAt(c.keys, warp(ws, base, u));
}

/** One sampled channel, ported from GU-7a's moves/types.ts `Channel`: the kind list is kept; `at(p)` becomes the sampled
 * stops, since exercise files are data. */
export type ChannelKind = 'rotate' | 'scaleY' | 'scaleX' | 'translateY' | 'opacity' | 'dashoffset' | 'composite';
export type Channel = { id: ChannelId; kind: ChannelKind; stops: [u: number, v: number][] };
export const channelKind = (id: ChannelId): ChannelKind =>
  id === 'breath' ? 'scaleY' : id === 'layer' ? 'opacity' : id.includes('_cm_') ? 'translateY' : 'rotate';

/** Ported from GU-7a rig/stops.ts: the value a channel draws at u, linear between its written stops. */
export function drawnAt(stops: readonly (readonly [number, number])[], u: number): number {
  let i = 0; while (i < stops.length - 2 && stops[i + 1]![0] <= u) i++;
  const [u0, v0] = stops[i]!, [u1, v1] = stops[i + 1]!;
  return u1 === u0 ? v1 : v0 + (v1 - v0) * Math.min(1, Math.max(0, (u - u0) / (u1 - u0)));
}

export type Figure = 'correct' | 'mistake';
/** Balance drift on top of the lean (lab: 0.2° once per rep); the doc's sway band is [0.2°, 1.5°]. */
export const SWAY_DRIFT_DEG = 0.2;
/** Hold tremor frequencies (lab: 9 Hz plus 0.45 × 13 Hz at phase 1.3), windowed by sin(π·s) so the hold's ends stay put. */
const tremor = (dt: number) => Math.sin(2 * Math.PI * 9 * dt) + 0.45 * Math.sin(2 * Math.PI * 13 * dt + 1.3);

/** The tempo of rep `rep` (0-based): the lift slowed by `movement.slowdown`, the rest shortened to keep the rep length. */
export function tempoOf(g: ExerciseGuide, figure: Figure = 'correct', rep = 0): Tempo {
  if (figure === 'mistake') return g.mistake.tempo ?? g.tempo;
  const t = g.tempo, sd = g.movement.slowdown;
  if (!isRep(t) || !sd?.length) return t;
  const lift = +(t.lift * sd[rep % sd.length]!).toFixed(2);
  return { ...t, lift, rest: Math.max(0, +(repSeconds(t) - lift - t.hold - t.lower).toFixed(2)) } satisfies RepTempo;
}

type Resolved = { curve: Curve; half?: 0 | 1 };
/** The file's curve for a channel, resolving `symmetric` and alternating sides. */
function curveFor(joints: Partial<Record<string, Curve>>, id: ChannelId, symmetric: boolean, kind: Kind): Resolved | null {
  const side = id.endsWith('_l') || id.endsWith('_r') ? (id.slice(-2) as Side) : null;
  const key = side && symmetric ? id.slice(0, -2) : id, c = joints[key];
  if (c === undefined) return null;
  return kind === 'alternating' && side ? { curve: c, half: side === '_r' ? 0 : 1 } : { curve: c };
}

/** Throws on a key the file's `symmetric` setting does not allow, or keys out of order. */
function validate(joints: Partial<Record<string, Curve>>, symmetric: boolean, what: string): void {
  const ok = new Set<string>(symmetric ? [...BODY, ...SIDED] : CHANNELS);
  for (const [k, c] of Object.entries(joints)) {
    if (!ok.has(k)) throw new Error(`${what}: channel ${k} is not allowed in a ${symmetric ? 'symmetric' : 'sided'} file`);
    if (c && typeof c === 'object' && !Array.isArray(c)) c.keys.forEach(([t], i) => { if (t < 0 || t > 1 || (i && t < c.keys[i - 1]![0])) throw new Error(`${what}: ${k} keys out of order`); });
  }
}

/**
 * Every channel's value at rep fraction u. A file with contacts, a balance or a followed part is solved on `rig` after
 * its curves, deltas and sway (V1-04, D-FG7 (b)), and throws without one; any other file ignores `rig`.
 */
export function poseAt(g: ExerciseGuide, u: number, figure: Figure = 'correct', rep = 0, rig?: SolveRig): Record<ChannelId, number> {
  if (!needsRig(g)) return evaluator(g, figure, rep)(u);
  return solvedAt(g, u, figure, rep, rig).pose;
}

function evaluator(g: ExerciseGuide, figure: Figure, rep: number, deltas = true): (u: number) => Record<ChannelId, number> {
  const sym = g.symmetric === true, joints = g.joints as Partial<Record<string, Curve>>;
  const delta = (figure === 'mistake' && deltas ? g.mistake.joints : {}) as Partial<Record<string, Curve>>;
  validate(joints, sym, g.id); validate(delta, sym, `${g.id} mistake`);
  const tempo = tempoOf(g, figure, rep), ws = windowsFor(tempo, g.order, g.kind);
  const base = windowsFor(g.tempo, g.order, g.kind);
  const mBase = figure === 'mistake' ? windowsFor(g.mistake.tempo ?? g.tempo, g.order, g.kind) : ws;
  const moving = ws.some(w => w.move);
  // breath: the out-breath phase goes to 0 (full out), the other moving phase back to 1
  const outFirst = (g.movement.breathe === 'out on lift') === (g.order === 'lift_first');
  const breathDefault: Curve = moving ? (outFirst ? [1, 0] : [0, 1]) : 0.5;
  const trem = figure === 'correct' ? (g.movement.tremorDeg ?? 0) * (1 + 0.3 * (rep % Math.max(1, g.movement.slowdown?.length ?? 1))) : 0;
  const plan = CHANNELS.map(id => ({ id, c: curveFor(joints, id, sym, g.kind), d: curveFor(delta, id, sym, g.kind) }));
  return u => {
    const out = {} as Record<ChannelId, number>;
    const loc = locate(ws, u), dt = (loc.s * (loc.w.s1 - loc.w.s0));
    for (const { id, c, d } of plan) {
      let v: number;
      if (c) {
        v = curveAt(c.curve, ws, u, base, c.half);
        // tremor on the working joints (a moving pair of 10° or more, degrees only) across the correct hold
        if (trem && loc.w.name === 'hold' && Array.isArray(c.curve) && Math.abs(c.curve[1] - c.curve[0]) >= 10 && !id.includes('_cm'))
          v += trem * Math.sin(Math.PI * loc.s) * tremor(dt);
      } else if (id === 'breath') v = curveAt(breathDefault, ws, u);
      else if (id === 'sway') v = -(g.movement.leanDeg ?? 0) * (moving ? envelope(ws, u) : 0);
      else v = 0;
      if (id === 'sway') v += SWAY_DRIFT_DEG * Math.sin(2 * Math.PI * u);
      if (d) v += curveAt(d.curve, ws, u, mBase, d.half);
      out[id] = v;
    }
    return out;
  };
}

// ---- V1-04: the solved path (files with contacts, a balance or a followed part) ----------------------------------------
type Plan = {
  enforced: System; released: System; base: (u: number) => Record<ChannelId, number>; pre: ((u: number) => Record<ChannelId, number>) | null;
  travel: (pt: (a: AttachmentId) => Pt, u: number) => number[]; stops: number[]; label: string;
  /** solved with the sway held at 0 (the body's frame, D-FG3 as extended by V1-04); the sway channel keeps its value */
  still: boolean;
  /** the continuation over the stops: each stop's solution and Jacobian (released, then enforced) */
  table: { rel: Seed; enf: Seed }[];
  /** the solved pose and every drive's travel at each stop */
  poses: Record<ChannelId, number>[]; travels: number[][];
};
const plans = new WeakMap<ExerciseGuide, WeakMap<SolveRig, Map<string, Plan>>>();

/** The solve of one rep, cached per file, rig, figure and rep: every stop solved in order, each from the last. */
function planOf(g: ExerciseGuide, figure: Figure, rep: number, rig: SolveRig | undefined, still = false): Plan {
  if (!rig) throw new Error(`${g.id} declares contacts, a balance or a followed part: it is sampled on a rig (poseAt, sampleGuide and effortOf take one)`);
  let byRig = plans.get(g);
  if (!byRig) plans.set(g, (byRig = new WeakMap()));
  let byKey = byRig.get(rig);
  if (!byKey) byRig.set(rig, (byKey = new Map()));
  const key = `${figure}:${figure === 'mistake' ? 0 : rep}${still ? ':still' : ''}`, hit = byKey.get(key);
  if (hit) return hit;
  validateSolve(g);
  const tempo = tempoOf(g, figure, rep), ws = windowsFor(tempo, g.order, g.kind), base = windowsFor(g.tempo, g.order, g.kind);
  const mBase = figure === 'mistake' ? windowsFor(g.mistake.tempo ?? g.tempo, g.order, g.kind) : ws;
  const drives = g.machine?.drive ?? [], over = figure === 'mistake' ? g.mistake.travel ?? {} : {};
  const keyed = (part: string, u: number) => {
    const o = over[part];
    if (o !== undefined) return curveAt(o, ws, u, mBase);
    const d = drives.find(x => x.part === part);
    return d && 'travel' in d ? curveAt(d.travel, ws, u) : NaN;
  };
  const released = new Set<AttachmentId>(figure === 'mistake' ? g.mistake.release ?? [] : []);
  const { enforced, released: rel } = compile(g, released, rig, keyed);
  const parts = rig.machine?.parts ?? {};
  const plan: Plan = {
    enforced, released: rel, base: evaluator(g, figure, rep), pre: rel.cons.length ? evaluator(g, figure, rep, false) : null,
    travel: (pt, u) => drives.map(d => {
      if (over[d.part] !== undefined || 'travel' in d) return keyed(d.part, u);
      const p = parts[d.part];
      if (!p) throw new Error(`${g.id}: followed part ${d.part} is not in machine ${g.machine!.id}`);
      return travelOf(p, pt(d.follow));
    }),
    still, stops: stopsFor(tempo, g.order, g.kind), label: figure === 'mistake' ? 'mistake' : `rep ${rep}`, table: [], poses: [], travels: [],
  };
  const other = [...byKey.values()][0]?.table[0];
  // each stop starts from the last three, extrapolated (the motion is smooth between stops)
  const ext = (a: Seed, b: Seed | undefined, c: Seed | undefined, d?: Seed): Seed => ({ x: d && c && b ? a.x.map((v, i) => 4 * v - 6 * b.x[i]! + 4 * c.x[i]! - d.x[i]!) : c && b ? a.x.map((v, i) => 3 * v - 3 * b.x[i]! + c.x[i]!) : b ? a.x.map((v, i) => 2 * v - b.x[i]!) : a.x, J: a.J });
  for (let i = 0; i < plan.stops.length; i++) {
    const u = plan.stops[i]!, a = plan.table[i - 1], b = plan.table[i - 2], c = plan.table[i - 3], d = plan.table[i - 4];
    let r: ReturnType<typeof solveStop> | null = null;
    if (!a && other) try { r = solveStop(plan, rig, u, other); } catch { r = null; }   // another rep's start, if it holds
    r ??= solveStop(plan, rig, u, a ? { rel: ext(a.rel, b?.rel, c?.rel, d?.rel), enf: ext(a.enf, b?.enf, c?.enf, d?.enf) } : null);
    plan.table.push(r.s); plan.poses.push(r.pose); plan.travels.push(plan.travel((plan.enforced.cons.length && r.s.enf.pts) || pointsOf(rig, r.pose), u));   // the enforced solve's own points of the final pose
  }
  byKey.set(key, plan);
  return plan;
}

/** One solve: the released points on the pose before deltas (their deltas then added), then the enforced ones. */
function solveStop(plan: Plan, rig: SolveRig, u: number, from: { rel: Seed; enf: Seed } | null) {
  const pose = plan.base(u), sway = pose.sway;
  if (plan.still) pose.sway = 0;
  let rel: Seed = { x: [], J: null };
  if (plan.pre) {
    const pre = plan.pre(u);
    if (plan.still) pre.sway = 0;
    rel = from ? solveSystem(rig, plan.released, pre, u, from.rel, plan.label) : firstSeed(rig, plan.released, pre, u, plan.label);
    plan.released.chans.forEach((c, i) => { pose[c] = rel.x[i]! + (pose[c] - pre[c]); });
  }
  let enf: Seed = { x: [], J: null };
  if (plan.enforced.cons.length) enf = from ? solveSystem(rig, plan.enforced, pose, u, from.enf, plan.label) : firstSeed(rig, plan.enforced, pose, u, plan.label);
  plan.enforced.chans.forEach((c, i) => { pose[c] = enf.x[i]!; });
  pose.sway = sway;
  return { s: { rel, enf }, pose };
}

/** The solved pose at any u, started from the nearest solved stop (so a stop gives back its own solution). */
function solvedAt(g: ExerciseGuide, u: number, figure: Figure, rep: number, rig: SolveRig | undefined, still = false) {
  const plan = planOf(g, figure, rep, rig!, still), st = plan.stops;
  let lo = 0, hi = st.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (st[m]! <= u) lo = m; else hi = m; }
  const i = Math.abs(st[hi]! - u) < Math.abs(u - st[lo]!) ? hi : lo;
  if (st[i] === u) return { pose: { ...plan.poses[i]! }, travel: [...plan.travels[i]!] };
  const { pose } = solveStop(plan, rig!, u, plan.table[i]!);
  return { pose, travel: plan.travel(pointsOf(rig!, pose), u) };
}

/** The pose and every drive's travel (0..1, in `machine.drive` order) at u: a followed part's is its point projected on
 * its path, a travel part's its curve, and the mistake's `travel` replaces either. Files without drives give []. */
export function stateAt(g: ExerciseGuide, u: number, figure: Figure = 'correct', rep = 0, rig?: SolveRig): { pose: Record<ChannelId, number>; travel: number[] } {
  if (needsRig(g)) return solvedAt(g, u, figure, rep, rig);
  const ws = windowsFor(tempoOf(g, figure, rep), g.order, g.kind), mBase = windowsFor(g.mistake.tempo ?? g.tempo, g.order, g.kind);
  const over = figure === 'mistake' ? g.mistake.travel ?? {} : {};
  return { pose: evaluator(g, figure, rep)(u), travel: (g.machine?.drive ?? []).map(d => (over[d.part] !== undefined ? curveAt(over[d.part]!, ws, u, mBase) : curveAt((d as { travel: [number, number] }).travel, ws, u))) };
}

/** `travel`: the followed parts' travel at the stops (V1-04), present only when the file follows a part. */
export type Sampled = { tempo: Tempo; windows: Window[]; stops: number[]; channels: Channel[]; travel?: { part: string; stops: [number, number][] }[] };
const r4 = (v: number) => { const x = Math.round(v * 1e4) / 1e4; return x === 0 ? 0 : x; };

/** Every channel at every stop of one rep (the correct figure's rep `rep`, or the mistake), values to 1e-4. A solved
 * file (see poseAt) needs `rig`; `still` solves it with the sway held at 0 (smoothness reads it so, D-FG3), and other
 * files ignore it. */
export function sampleGuide(g: ExerciseGuide, figure: Figure = 'correct', rep = 0, rig?: SolveRig, o: { still?: boolean } = {}): Sampled {
  const tempo = tempoOf(g, figure, rep), windows = windowsFor(tempo, g.order, g.kind), stops = stopsFor(tempo, g.order, g.kind);
  if (!needsRig(g)) {
    const at = evaluator(g, figure, rep), poses = stops.map(at);
    const channels = CHANNELS.map(id => ({ id, kind: channelKind(id), stops: stops.map((u, i) => [r4(u), r4(poses[i]![id])] as [number, number]) }));
    return { tempo, windows, stops, channels };
  }
  const states = stops.map(u => solvedAt(g, u, figure, rep, rig, o.still));
  const channels = CHANNELS.map(id => ({ id, kind: channelKind(id), stops: stops.map((u, i) => [r4(u), r4(states[i]!.pose[id])] as [number, number]) }));
  const drives = g.machine?.drive ?? [], travel = drives.map((d, k) => ({ d, k })).filter(({ d }) => 'follow' in d)
    .map(({ d, k }) => ({ part: d.part, stops: stops.map((u, i) => [r4(u), r4(states[i]!.travel[k]!)] as [number, number]) }));
  return { tempo, windows, stops, channels, ...(travel.length ? { travel } : {}) };
}

// FG-2: sampling an ExerciseGuide (docs/FORM-GUIDE-PRODUCTION.md §2, §5 "stops", §6 "Rendering"). The phase windows
// come from the file's tempo and order, never a fixed 1/0.5/2/0.5 s. stopsFor and the Channel type are ported from
// GU-7a (PR #40, rig/stops.ts and moves/types.ts). Pure, no DOM.
import { BODY, CHANNELS, SIDED, type ChannelId, type Kind, type Order, type Side } from './rig/joints';
import type { Curve, ExerciseGuide, RepTempo, Tempo } from './model';

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

/** Every channel's value at rep fraction u. */
export function poseAt(g: ExerciseGuide, u: number, figure: Figure = 'correct', rep = 0): Record<ChannelId, number> {
  return evaluator(g, figure, rep)(u);
}

function evaluator(g: ExerciseGuide, figure: Figure, rep: number): (u: number) => Record<ChannelId, number> {
  const sym = g.symmetric === true, joints = g.joints as Partial<Record<string, Curve>>;
  const delta = (figure === 'mistake' ? g.mistake.joints : {}) as Partial<Record<string, Curve>>;
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

export type Sampled = { tempo: Tempo; windows: Window[]; stops: number[]; channels: Channel[] };
const r4 = (v: number) => { const x = Math.round(v * 1e4) / 1e4; return x === 0 ? 0 : x; };

/** Every channel at every stop of one rep (the correct figure's rep `rep`, or the mistake), values to 1e-4. */
export function sampleGuide(g: ExerciseGuide, figure: Figure = 'correct', rep = 0): Sampled {
  const tempo = tempoOf(g, figure, rep), windows = windowsFor(tempo, g.order, g.kind), stops = stopsFor(tempo, g.order, g.kind);
  const at = evaluator(g, figure, rep), poses = stops.map(at);
  const channels = CHANNELS.map(id => ({ id, kind: channelKind(id), stops: stops.map((u, i) => [r4(u), r4(poses[i]![id])] as [number, number]) }));
  return { tempo, windows, stops, channels };
}

// V1-04: the contact solver (docs/FORM-GUIDE-PRODUCTION.md §10.5 V1-04, D-FG7 (b)). A file that declares `contacts`,
// a `balance` or a `follow` drive is solved after its curves, deltas and sway: each constraint moves the channels it
// names until its body point sits on the machine part's one-dimensional path (one channel), on a point (two), or plumb
// over another point (balance). The math only: sample.ts evaluates the curves, walks the stops and caches the solve,
// and passes the rig in, so nothing here imports rig code (FG-6's side rig imports sample.ts). Pure, no DOM.
import type { AttachmentId, Balance, Contact, ExerciseGuide } from '../model';
import { CHANNELS, type ChannelId } from '../rig/joints';
import { AAOS } from '../rig/ranges';
import type { Frame } from '../rig/pose';
import type { Pt } from '../rig/ik';
import { anchorAt, type MachineDrawing, type MachinePart } from '../check/machines';

/** What the solver reads from a drawn view: check/view.ts `Rig` satisfies it. `chain` is the view's analytic two-joint
 * solve of a limb to a point (front: the fixed-point front arm), used to start a two-channel contact; `machine` is the
 * drawing whose parts and pads the contacts name. */
export type SolveRig = {
  frame: (p: Record<ChannelId, number>) => Frame;
  point: (f: Frame, a: AttachmentId) => Pt;
  chain?: (p: Record<ChannelId, number>, a: AttachmentId, target: Pt) => Partial<Record<ChannelId, number>> | null;
  machine?: MachineDrawing | null;
};
export type Pose = Record<ChannelId, number>;

/** A constraint: the channels it solves (with their branch) and its residuals, zero when it holds. */
export type Con = { what: string; at: AttachmentId; chans: ChannelId[]; ranges: [number, number][]; res: (f: Frame, rig: SolveRig, u: number) => number[] };
/** The constraints solved together, their channels in one vector. */
export type System = { cons: Con[]; chans: ChannelId[]; ranges: [number, number][] };

/** Residual below which a constraint holds (units); a solve that cannot get below FAIL throws. */
export const TOL = 1e-10;
const FAIL = 1e-7, MAX_IT = 60, STEP = 10, H = 1e-6;

/** True when the file needs the rig to be sampled. */
export const needsRig = (g: ExerciseGuide): boolean => !!(g.contacts?.length || g.balance || g.machine?.drive.some(d => 'follow' in d));

const sideOf = (a: AttachmentId) => (/_[lr]$/.test(a) ? (a.slice(-2) as '_l' | '_r') : null);
/** The channel a constraint names, resolved to the side of its point in a symmetric file. */
function channelOf(g: ExerciseGuide, c: string, at: AttachmentId): ChannelId {
  if ((CHANNELS as readonly string[]).includes(c)) return c as ChannelId;
  const s = sideOf(at), id = `${c}${s ?? ''}`;
  if (!s || !(CHANNELS as readonly string[]).includes(id)) throw new Error(`${g.id}: ${at} cannot solve ${c}: not a channel for that point`);
  return id as ChannelId;
}
function rangeOf(g: ExerciseGuide, ch: ChannelId, r: [number, number] | undefined, what: string): [number, number] {
  const a = r ?? (AAOS as Record<string, readonly [number, number]>)[ch.replace(/_[lr]$/, '')];
  if (!a) throw new Error(`${g.id}: ${what} solves ${ch}, which has no AAOS row: give its range`);
  if (!(a[0] < a[1])) throw new Error(`${g.id}: ${what} range ${a[0]}..${a[1]} is empty`);
  return [a[0], a[1]];
}

/** Signed distance of a point from a part's one-dimensional path: across a slide's line, out from a lever's arc. */
export function pathOff(p: MachinePart, q: Pt): number {
  if (p.kind === 'lever') return Math.hypot(q[0] - p.pivot[0], q[1] - p.pivot[1]) - p.radius;
  const [a, b] = p.path, L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return ((b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0])) / L;
}
/** A point projected onto a part's path, as travel (0..1 between its ends; outside them it leaves the path). */
export function travelOf(p: MachinePart, q: Pt): number {
  if (p.kind === 'lever') {
    const a = (Math.atan2(q[0] - p.pivot[0], q[1] - p.pivot[1]) * 180) / Math.PI;
    return (a - p.deg[0]) / (p.deg[1] - p.deg[0]);
  }
  const [a, b] = p.path, dx = b[0] - a[0], dy = b[1] - a[1];
  return ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / (dx * dx + dy * dy);
}

/** Every channel a constraint of the file solves (both figures), with the constraint that solves it. */
function solvedBy(g: ExerciseGuide): Map<ChannelId, string> {
  const out = new Map<ChannelId, string>();
  const add = (at: AttachmentId, s: string | string[], what: string) => {
    for (const c of Array.isArray(s) ? s : [s]) {
      const ch = channelOf(g, c, at);
      if (out.has(ch)) throw new Error(`${g.id}: ${ch} is solved by both ${out.get(ch)} and ${what}`);
      out.set(ch, what);
    }
  };
  for (const c of g.contacts ?? []) add(c.at, c.solve as string | string[], `contact ${c.at} on ${c.on}`);
  if (g.balance) add(g.balance.at, g.balance.solve, `balance ${g.balance.at} over ${g.balance.over}`);
  return out;
}

/** A5: a solved channel is never keyed; a mistake delta on one needs the contact released. Throws, naming both. */
export function validateSolve(g: ExerciseGuide): void {
  const by = solvedBy(g), rel = new Set(g.mistake.release ?? []);
  // a symmetric file keys a sided channel by its base name
  const key = (ch: ChannelId) => (g.symmetric === true && /_[lr]$/.test(ch) ? ch.slice(0, -2) : ch);
  for (const [ch, what] of by) {
    const k = key(ch), at = what.split(' ')[1] as AttachmentId;
    if (k in g.joints) throw new Error(`${g.id}: joints key ${k}, which ${what} solves: a solved channel is never keyed`);
    if (k in g.mistake.joints && !rel.has(at)) throw new Error(`${g.id}: mistake keys ${k}, which ${what} solves: release ${at} in the mistake to move it`);
  }
}

/**
 * The constraints of one figure. `travelAt(part, u)` is a `travel` part's travel (a two-channel contact on it follows
 * its moving anchor). Released points (mistake only) come back separately: they are solved on the pose before deltas.
 */
export function compile(g: ExerciseGuide, released: ReadonlySet<AttachmentId>, rig: SolveRig, travelAt: (part: string, u: number) => number): { enforced: System; released: System } {
  const m = rig.machine, drives = g.machine?.drive ?? [];
  const enforced: Con[] = [], rel: Con[] = [];
  const need = (on: string, what: string): MachinePart => {
    if (!m) throw new Error(`${g.id}: ${what} needs a machine drawing (${g.machine ? `machine ${g.machine.id} has none` : 'the file has no machine'})`);
    const p = m.parts[on];
    if (!p) throw new Error(`${g.id}: ${what}: part ${on} is not in machine ${g.machine?.id}`);
    return p;
  };
  for (const c of (g.contacts ?? []) as Contact<string>[]) {
    const what = `contact ${c.at} on ${c.on}`, solve = Array.isArray(c.solve) ? c.solve : [c.solve];
    const chans = solve.map(s => channelOf(g, s, c.at));
    let res: Con['res'], ranges: [number, number][];
    if (chans.length === 1) {
      if (c.on === 'pad') throw new Error(`${g.id}: ${what}: a pad is a point, solve two channels`);
      const p = need(c.on, what);
      res = (f, r) => [pathOff(p, r.point(f, c.at))];
      ranges = [rangeOf(g, chans[0]!, c.range as [number, number] | undefined, what)];
    } else {
      const rr = c.range as [[number, number], [number, number]] | undefined;
      ranges = chans.map((ch, i) => rangeOf(g, ch, rr?.[i], what));
      let target: (u: number) => Pt;
      if (c.on === 'pad') {
        const pad = m?.pads?.find(x => x.attach === c.at);
        if (!pad) throw new Error(`${g.id}: ${what}: machine ${g.machine?.id ?? '(none)'} has no pad for ${c.at}`);
        target = () => pad.at;
      } else {
        const p = need(c.on, what), d = drives.find(x => x.part === c.on);
        if (!d || !('travel' in d)) throw new Error(`${g.id}: ${what}: two channels hold a point, and ${c.on} is not a travel-driven part (a followed part has only a path)`);
        target = u => anchorAt(p, travelAt(c.on, u));
      }
      res = (f, r, u) => { const q = r.point(f, c.at), t = target(u); return [q[0] - t[0], q[1] - t[1]]; };
    }
    (released.has(c.at) ? rel : enforced).push({ what, at: c.at, chans, ranges, res });
  }
  const b = g.balance as Balance<string> | undefined;
  if (b) {
    const what = `balance ${b.at} over ${b.over}`, ch = channelOf(g, b.solve, b.at);
    (released.has(b.at) ? rel : enforced).push({ what, at: b.at, chans: [ch], ranges: [rangeOf(g, ch, b.range, what)], res: (f, r) => [r.point(f, b.at)[0] - r.point(f, b.over)[0]] });
  }
  const sys = (cons: Con[]): System => ({ cons, chans: cons.flatMap(c => c.chans), ranges: cons.flatMap(c => c.ranges) });
  return { enforced: sys(enforced), released: sys(rel) };
}

const nrm = (v: number[]) => Math.sqrt(v.reduce((s, x) => s + x * x, 0));
/** Solves J·dx = r (Gaussian elimination, partial pivoting); null when singular. */
function linsolve(J: number[][], r: number[]): number[] | null {
  const n = r.length, A = J.map((row, i) => [...row, r[i]!]);
  for (let k = 0; k < n; k++) {
    let p = k;
    for (let i = k + 1; i < n; i++) if (Math.abs(A[i]![k]!) > Math.abs(A[p]![k]!)) p = i;
    if (Math.abs(A[p]![k]!) < 1e-14) return null;
    [A[k], A[p]] = [A[p]!, A[k]!];
    for (let i = k + 1; i < n; i++) { const f = A[i]![k]! / A[k]![k]!; for (let j = k; j <= n; j++) A[i]![j]! -= f * A[k]![j]!; }
  }
  const x = new Array<number>(n).fill(0);
  for (let i = n - 1; i >= 0; i--) { let s = A[i]![n]!; for (let j = i + 1; j < n; j++) s -= A[i]![j]! * x[j]!; x[i] = s / A[i]![i]!; }
  return x;
}

export type Seed = { x: number[]; J: number[][] | null };
const where = (u: number, label: string) => `u=${+u.toFixed(4)} (${label})`;

/** The residuals of a system with its channels at x on the given pose. */
function residuals(rig: SolveRig, sys: System, pose: Pose, x: number[], u: number): number[] {
  const p = { ...pose };
  sys.chans.forEach((c, i) => { p[c] = x[i]!; });
  const f = rig.frame(p);
  return sys.cons.flatMap(c => c.res(f, rig, u));
}

/**
 * Newton on the rig's own forward kinematics, from `seed`, reusing its Jacobian while that still converges (one frame
 * per step). Throws when the target is out of reach, naming the constraint, u and the distance left, and when a
 * channel leaves its branch.
 */
export function solveSystem(rig: SolveRig, sys: System, pose: Pose, u: number, seed: Seed, label: string): Seed {
  let x = [...seed.x], J = seed.J, fresh = false, r = residuals(rig, sys, pose, x, u), n0 = nrm(r);
  const jac = (x: number[], r: number[]) => sys.chans.map((_, k) => { const y = [...x]; y[k]! += H; return residuals(rig, sys, pose, y, u).map((v, i) => (v - r[i]!) / H); });
  for (let it = 0; it < MAX_IT && n0 >= TOL; it++) {
    if (!J) { const T = jac(x, r); J = r.map((_, i) => T.map(col => col[i]!)); fresh = true; }
    let dx = linsolve(J, r.map(v => -v));
    if (!dx) { if (fresh) break; J = null; continue; }
    const big = Math.max(...dx.map(Math.abs));
    if (big > STEP) dx = dx.map(v => (v * STEP) / big);
    let ok = false;
    for (let h = 0; h < 12 && !ok; h++) {
      const xn = x.map((v, i) => v + dx![i]!), rn = residuals(rig, sys, pose, xn, u), n1 = nrm(rn);
      if (n1 < n0 * (fresh ? 1 : 0.5) || n1 < TOL) { x = xn; r = rn; n0 = n1; ok = true; }
      else if (!fresh) break;
      else dx = dx!.map(v => v / 2);
    }
    if (!ok) { if (fresh) break; J = null; continue; }
    fresh = false;
  }
  if (!(n0 < FAIL)) {
    const worst = sys.cons.map(c => c.what)[0]!, per = sys.cons.map((c, i) => ({ c, d: nrm(r.slice(offset(sys, i), offset(sys, i) + c.chans.length)) })).sort((a, b) => b.d - a.d)[0];
    throw new Error(`${(per?.c.what ?? worst)}: out of reach at ${where(u, label)}, ${(per?.d ?? n0).toFixed(4)} units off`);
  }
  sys.chans.forEach((c, i) => {
    const [lo, hi] = sys.ranges[i]!;
    if (!(x[i]! >= lo - 1e-9 && x[i]! <= hi + 1e-9)) throw new Error(`${sys.cons.find(k => k.chans.includes(c))!.what}: ${c} = ${x[i]!.toFixed(2)} leaves its range ${lo}..${hi} at ${where(u, label)} (the bend would flip)`);
  });
  return { x, J };
}
const offset = (sys: System, i: number) => sys.cons.slice(0, i).reduce((s, c) => s + c.chans.length, 0);

/**
 * The first solve of a rep (no neighbour to start from): each one-channel constraint scans its range for the root,
 * and must find exactly one (two means its `range` holds both bends: narrow it); a two-channel one starts from the
 * rig's chain, else from the best point of a grid over its ranges. Then all are solved together.
 */
export function firstSeed(rig: SolveRig, sys: System, pose: Pose, u: number, label: string): Seed {
  const x = sys.ranges.map(([lo, hi]) => (lo + hi) / 2);
  const N = 180;
  sys.cons.forEach((c, ci) => {
    const o = offset(sys, ci), one = (k: number[]) => { const y = [...x]; k.forEach((v, j) => { y[o + j] = v; }); return residuals(rig, { ...sys, cons: [c], chans: sys.chans, ranges: sys.ranges }, pose, y, u); };
    if (c.chans.length === 1) {
      const [lo, hi] = c.ranges[0]!, v = Array.from({ length: N + 1 }, (_, i) => lo + ((hi - lo) * i) / N), f = v.map(t => one([t])[0]!);
      const roots: number[] = [];
      for (let i = 0; i < N; i++) if (f[i] === 0 || f[i]! * f[i + 1]! < 0) roots.push(i);
      if (roots.length > 1) throw new Error(`${c.what}: ${c.chans[0]} has ${roots.length} solutions in its range ${lo}..${hi} at ${where(u, label)} (near ${roots.map(i => +v[i]!.toFixed(1)).join(', ')}): narrow the range to one bend`);
      const i = roots.length ? roots[0]! : f.reduce((b, y, k) => (Math.abs(y) < Math.abs(f[b]!) ? k : b), 0);
      x[o] = roots.length ? v[i]! + ((v[i + 1]! - v[i]!) * f[i]!) / (f[i]! - f[i + 1]!) : v[i]!;
      return;
    }
    const p = { ...pose };
    sys.chans.forEach((ch, i) => { p[ch] = x[i]!; });
    const t = rig.chain?.(p, c.at, (() => { const q = rig.point(rig.frame(p), c.at), r = one([x[o]!, x[o + 1]!]); return [q[0] - r[0]!, q[1] - r[1]!] as Pt; })());
    const guess = t && c.chans.every(ch => typeof t[ch] === 'number') ? c.chans.map(ch => t[ch]!) : null;
    if (guess && guess.every((g, j) => g >= c.ranges[j]![0] && g <= c.ranges[j]![1])) { x[o] = guess[0]!; x[o + 1] = guess[1]!; return; }
    let best = Infinity;
    const [[a0, a1], [b0, b1]] = c.ranges as [[number, number], [number, number]];
    for (let i = 0; i <= 36; i++) for (let j = 0; j <= 36; j++) {
      const k = [a0 + ((a1 - a0) * i) / 36, b0 + ((b1 - b0) * j) / 36], d = nrm(one(k));
      if (d < best) { best = d; x[o] = k[0]!; x[o + 1] = k[1]!; }
    }
  });
  return solveSystem(rig, sys, pose, u, { x, J: null }, label);
}

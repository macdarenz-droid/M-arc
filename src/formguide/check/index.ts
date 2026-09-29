// FG-3: the automated checks of docs/FORM-GUIDE-PRODUCTION.md §5, one function per table row, shared by
// tests/formguide/checks.test.ts and `npm run fg:check <id>` (scripts/fg-check.mjs). Every limit is §5's or
// research.json's; readings where §5 is silent are recorded in docs/COACHING-DECISIONS.md D-FG3. Node only (zlib, crypto).
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import type { MuscleId } from '@/data/muscles';
import { THEMES, THEME_IDS, themeToCss } from '@/theme/themes';
import { VIEWBOXES, type AttachmentId, type ExerciseGuide, type PartId, type Research } from '../model';
import { CHANNELS, type ChannelId } from '../rig/joints';
import { aaosTruth } from '../rig/ranges';
import { FLOOR } from '../rig/figureFront';
import { FIGURE_TOKENS, bodyPal, mix, themeReader, type TokenReader } from '../rig/paint';
import type { Frame } from '../rig/pose';
import type { Pt } from '../rig/ik';
import { STEPS_PER_PHASE, drawnAt, poseAt, repSeconds, sampleGuide, stateAt, stopsFor, tempoOf, windowsFor, type Figure, type Window } from '../sample';
import { MACHINES, anchorAt, offPath, setupMarkup, type MachineDrawing } from './machines';
import { hasOverlay, type LibraryRow } from './overlays';
import { effortOf, TORQUE } from './effort';
import { HZ, LIM, phaseStats, stopJerk } from './smooth';
import { bbox, colourLiterals, compile, countPaths, forbiddenEffects } from './svg';
import { FIGURE_PARTS, PARTS, rigFor, viewOf, type Rig } from './view';
import { contactsHeld as heldBy, travelRange as travelOf, type Pass } from './contacts';
import { researchMismatches } from './research';
import { WIDEST_LABEL, around, drawnFor, fastBox, heldIn, marginsOf, mirrored, union } from './framing';
import { MIN_TEXT_PX, RATIO, RENDER_PX, boundaryContrast, guideContrast, isGuide, paintedShapes, parseColour, ratio, textContrast, type RGBA } from './contrast';
import { centreOfMass, feetOf, groupOf } from './balance';
import { drawnTints, undrawnTargets } from './drawn';
import { tintOf } from '../player/guideView';

export const CHECKS = [
  'smoothness', 'stops', 'jointRanges', 'mistakeSane', 'mistakeDiffers', 'setupDiffers', 'handsOnHandle', 'bodyOnPad',
  'feetPlanted', 'targetVisible', 'muscleTiming', 'secondaryMotion', 'pathBudget', 'sizeBudget', 'themes',
  'everyPoseRenders', 'noFilters', 'machinePivot', 'idMatch', 'hash',
] as const;
/** V1-07's add-only checks (docs/FORM-GUIDE-PRODUCTION.md §10.5): run by `fg:check` after the 20, and by name. */
export const CHECKS_V1 = ['contactsHeld', 'matchesResearch', 'framing', 'contrast', 'balance', 'targetDrawn', 'travelRange'] as const;
export const ALL_CHECKS = [...CHECKS, ...CHECKS_V1] as const;
export type CheckId = (typeof ALL_CHECKS)[number];
export type CheckResult = { check: CheckId; ok: boolean; fails: string[]; note?: string };

export type CheckInput = {
  guide: ExerciseGuide;
  /** research.json for the file (null when missing: the checks that read it fail) */
  research: Research | null;
  /** the exercise file's name without `.ts`, and its source text */
  file: { name: string; source: string };
  library: LibraryRow[];
  /** the stored hash snapshots (src/formguide/check/hashes.json), by exercise id */
  hashes: Record<string, string>;
  /** the shipped form-guide source (everything under src/formguide/ but exercises/, research/ and check/) */
  chunk: string;
  /** extra machine and part drawings (the seeded bad files; FG-5 and FG-7 fill the libraries) */
  machines?: Record<string, MachineDrawing>;
  parts?: Partial<Record<PartId, string>>;
};

/** §5 limits (and §3 budgets). */
export const LIMITS = {
  jointSamples: 480, tellDeg: 5, tellShare: 0.2, tells: 2, speedDiff: 0.15, gap: 0.5, padDrift: 0.01, pivot: 0.05,
  land: 0.5, peakAt: 0.1, effortStep: 0.02, quiet: 0.2, sway: [0.2, 1.5], bladeAbove: 30,
  figurePaths: 260, machinePaths: 80, partPaths: 25, fileGzip: 2 * 1024, chunkGzip: 150 * 1024, repS: [3, 5],
} as const;

const f2 = (v: number) => (Number.isFinite(v) ? +v.toFixed(2) : v);
const f4 = (v: number) => (Number.isFinite(v) ? +v.toFixed(4) : v);
const MAX_LINES = 8;

type Ctx = {
  g: ExerciseGuide; in: CheckInput; view: ReturnType<typeof viewOf>; rig: Rig | string; reps: number[];
  machine: MachineDrawing | null | string;
};
const at = (u: number, T: number, label: string) => `u=${f4(u)} (${f2(u * T)} s, ${label})`;
const grid = (n: number) => Array.from({ length: n + 1 }, (_, i) => i / n);
/** The correct reps a file plays (one per `movement.slowdown` entry). */
const repsOf = (g: ExerciseGuide) => Array.from({ length: Math.max(1, g.movement.slowdown?.length ?? 1) }, (_, i) => i);
const repLabel = (fig: Figure, rep: number) => (fig === 'mistake' ? 'mistake' : `rep ${rep}`);
const sides = (g: ExerciseGuide, joint: string): ChannelId[] =>
  (CHANNELS as readonly string[]).includes(joint) ? [joint as ChannelId] : [`${joint}_l`, `${joint}_r`].filter(c => (CHANNELS as readonly string[]).includes(c)) as ChannelId[];
const researchRange = (r: Research, c: ChannelId) => r.ranges[c] ?? r.ranges[c.replace(/_[lr]$/, '')];
const windowsOf = (g: ExerciseGuide, fig: Figure, rep: number) => windowsFor(tempoOf(g, fig, rep), g.order, g.kind);
/** The rig a solved file samples on (V1-04): undefined when there is no figure, so a solved file throws naming it. */
const rigOf = (c: Ctx): Rig | undefined => (typeof c.rig === 'string' ? undefined : c.rig);
const frameAt = (c: Ctx, rig: Rig, u: number, fig: Figure, rep: number): Frame => rig.frame(poseAt(c.g, u, fig, rep, rig));
/** The four key moments (§1): start, mid first move, end of first move (top), mid second move; a hold at quarters. */
export function moments(ws: Window[]): number[] {
  const m1 = ws.find(w => w.move === 1), m2 = ws.find(w => w.move === 2);
  if (!m1 || !m2) return [0, 0.25, 0.5, 0.75];
  return [0, (m1.u0 + m1.u1) / 2, m1.u1, (m2.u0 + m2.u1) / 2];
}
const grip = (g: ExerciseGuide): AttachmentId[] => {
  const pts = g.equipment.attach.filter(a => /^(hand|foot)_/.test(a));
  return pts.length ? pts : ['hand_l', 'hand_r', 'foot_l', 'foot_r'];
};

// ---- the checks ---------------------------------------------------------------------------------------------------
type Fn = (c: Ctx, fail: (s: string) => void) => string | void;

const smoothness: Fn = (c, fail) => {
  const g = c.g, pts = grip(g);
  for (const rep of c.reps) {
    // a solved file is read from its solve with the sway held at 0: its arm channels would otherwise carry the sway's
    // drift across every phase edge, the drift D-FG3 reads the grip without (V1-04, D-FG3 extension)
    const s = sampleGuide(g, 'correct', rep, rigOf(c), { still: true }), T = repSeconds(s.tempo), N = Math.round(T * HZ), dt = T / N, L = repLabel('correct', rep);
    const drawn = new Map(s.channels.map(ch => [ch.id, grid(N).map(u => drawnAt(ch.stops, u))]));
    const moving = s.windows.filter(w => w.move && w.u1 - w.u0 > 1e-9);
    // (c) reads the written values at the stops' exact times: the written offsets are rounded to 1e-4 of the rep, which
    // spaces the stops of a tempo that does not divide evenly by up to 4 % and turns (c) into a measure of that rounding
    for (const ch of s.channels.filter(k => k.kind === 'rotate')) {
      const smp = drawn.get(ch.id)!;
      for (let i = 0; i < N; i++) {
        const d = Math.abs(smp[i + 1]! - smp[i]!);
        if (d > LIM.d) { fail(`(d) ${ch.id} moves ${f2(d)}° in 1/120 s > ${LIM.d}° at ${at(i / N, T, L)}`); break; }
      }
      for (const w of moving) {
        const i0 = Math.round(w.u0 * N), i1 = Math.round(w.u1 * N), st = phaseStats(smp.map(v => [v]), i0, i1, dt);
        if (st.travel < LIM.travel) continue;
        if (st.edge > LIM.a) fail(`(a) ${ch.id} ${w.name}: edge speed ${f2(100 * st.edge)} % of top speed > ${100 * LIM.a} % at ${at(st.edgeAt / N, T, L)}`);
        if (st.jump > LIM.b) fail(`(b) ${ch.id} ${w.name}: velocity step ${f2(100 * st.jump)} % of top speed > ${100 * LIM.b} % at ${at(st.jumpAt / N, T, L)}`);
        const j = stopJerk(ch.stops.map((x, k) => [s.stops[k]!, x[1]] as const), w.u0, w.u1, T);
        if (j > LIM.c) fail(`(c) ${ch.id} ${w.name}: stop jerk ${f2(j)}× its median > ${LIM.c}× (${L})`);
      }
    }
    if (typeof c.rig === 'string') { fail(`grip path not measured: ${c.rig}`); continue; }
    // the grip is read in the body's frame: the whole-body sway (its 0.2° drift runs across every phase edge by design)
    // is secondaryMotion's, and the sway channel itself is held to (d) above (D-FG3)
    const rig = c.rig, frames = grid(N).map((_, i) => rig.frame({ ...Object.fromEntries(s.channels.map(ch => [ch.id, drawn.get(ch.id)![i]!])), sway: 0 } as Record<ChannelId, number>));
    for (const a of pts) {
      const track = frames.map(f => rig.point(f, a) as number[]);
      for (const w of moving) {
        const st = phaseStats(track, Math.round(w.u0 * N), Math.round(w.u1 * N), dt);
        if (!st.peak) continue;
        if (st.edge > LIM.a) fail(`(a) ${a} path ${w.name}: edge speed ${f2(100 * st.edge)} % of top speed > ${100 * LIM.a} % at ${at(st.edgeAt / N, T, L)}`);
        if (st.jump > LIM.b) fail(`(b) ${a} path ${w.name}: velocity step ${f2(100 * st.jump)} % of top speed > ${100 * LIM.b} % at ${at(st.jumpAt / N, T, L)}`);
      }
    }
  }
};

const stops: Fn = (c, fail) => {
  const g = c.g, tempos = [...c.reps.map(r => ({ t: tempoOf(g, 'correct', r), L: repLabel('correct', r) })), { t: tempoOf(g, 'mistake'), L: 'mistake' }];
  for (const { t, L } of tempos) {
    const vals = Object.entries(t);
    for (const [k, v] of vals) if (!(Number.isFinite(v) && v >= 0)) fail(`${L} tempo ${k} = ${v} s, must be a number ≥ 0`);
    let ws: Window[];
    try { ws = windowsFor(t, g.order, g.kind); } catch (e) { fail(`${L}: ${(e as Error).message}`); continue; }
    if ('lift' in t) {
      const T = repSeconds(t);
      if (T < LIMITS.repS[0] || T > LIMITS.repS[1]) fail(`${L} rep lasts ${f2(T)} s, outside ${LIMITS.repS[0]}–${LIMITS.repS[1]} s (§2), so stop spacing leaves GU-7a's ¼ % of a 4 s rep`);
      for (const k of ['lift', 'lower'] as const) if (!(t[k] > 0)) fail(`${L} ${k} = ${t[k]} s: a ${g.kind} needs both moving phases`);
    }
    for (const m of stopsRule(stopsFor(t, g.order, g.kind), ws)) fail(`${L} ${m}`);
  }
};

/** D-FG2's stop rule on a stop list and its phase windows: 0..1, increasing, 100 even intervals across each moving
 * phase, no stop inside a hold or rest. Returns the failures. */
export function stopsRule(st: readonly number[], ws: readonly Window[]): string[] {
  const out: string[] = [];
  if (st[0] !== 0 || st[st.length - 1] !== 1) out.push(`stops run ${st[0]}..${st[st.length - 1]}, not 0..1`);
  st.forEach((u, i) => { if (i && !(u > st[i - 1]!)) out.push(`stop ${i} at u=${f4(u)} does not increase`); });
  for (const w of ws.filter(x => x.u1 - x.u0 > 1e-9)) {
    const inside = st.filter(u => u >= w.u0 - 1e-9 && u <= w.u1 + 1e-9);
    if (w.move) {
      const step = (w.u1 - w.u0) / STEPS_PER_PHASE, bad = inside.findIndex((u, i) => i && Math.abs(u - inside[i - 1]! - step) > 1e-9);
      if (inside.length !== STEPS_PER_PHASE + 1) out.push(`${w.name}: ${inside.length - 1} intervals, D-FG2 gives ${STEPS_PER_PHASE} per moving phase`);
      else if (bad > 0) out.push(`${w.name}: uneven stop at u=${f4(inside[bad]!)}, ${f4(inside[bad]! - inside[bad - 1]!)} after the last (step ${f4(step)})`);
    } else {
      const mid = inside.filter(u => u > w.u0 + 1e-9 && u < w.u1 - 1e-9);
      if (mid.length) out.push(`${w.name}: ${mid.length} stops inside (first u=${f4(mid[0]!)}), D-FG2 allows its two ends only`);
    }
  }
  return out;
}

const jointRanges: Fn = (c, fail) => {
  const g = c.g, r = c.in.research;
  if (!r) return void fail('no research.json: the coaching ranges are missing');
  const written = Object.keys(g.joints).filter(k => !['breath', 'sway', 'layer'].includes(k));
  for (const k of written) for (const ch of sides(g, k)) if (!researchRange(r, ch)) fail(`${ch} is written but research.json has no coaching range for it`);
  for (const rep of c.reps) {
    const T = repSeconds(tempoOf(g, 'correct', rep)), L = repLabel('correct', rep), seen = new Set<string>();
    for (const u of grid(LIMITS.jointSamples)) {
      const p = poseAt(g, u, 'correct', rep, rigOf(c));
      for (const ch of CHANNELS) {
        const v = p[ch], cr = researchRange(r, ch), a = aaosTruth(ch, v);
        // written as !(inside) so a NaN fails
        if (cr && !seen.has(ch) && !(v >= cr.min - 1e-9 && v <= cr.max + 1e-9)) { seen.add(ch); fail(`correct figure ${ch} = ${f2(v)} outside the coaching range ${cr.min}..${cr.max} (research.json) at ${at(u, T, L)}`); }
        if (a && !seen.has('a' + ch) && !(v >= a.min && v <= a.max)) { seen.add('a' + ch); fail(`correct figure ${ch} = ${f2(v)} outside the AAOS limits ${a.min}..${a.max} at ${at(u, T, L)}`); }
      }
    }
  }
};

const mistakeSane: Fn = (c, fail) => {
  const g = c.g, T = repSeconds(tempoOf(g, 'mistake')), U = grid(LIMITS.jointSamples), seen = new Set<string>();
  const tells = g.mistake.tells;
  if (tells.length < LIMITS.tells) fail(`${tells.length} tells, the mistake needs ${LIMITS.tells} (§5 researcher: two visible tells)`);
  const cb = typeof c.rig === 'string' ? null : compile(c.rig.markup(themeReader('silent-black'), true));
  const vb = VIEWBOXES[g.camera.full];
  if (!cb) fail(`clipping not measured: ${c.rig as string}`);
  const mis = U.map(u => poseAt(g, u, 'mistake', 0, rigOf(c))), cor = U.map(u => poseAt(g, u, 'correct', 0, rigOf(c)));
  U.forEach((u, i) => {
    const p = mis[i]!;
    for (const ch of CHANNELS) {
      const v = p[ch], a = aaosTruth(ch, v);
      if (!Number.isFinite(v) && !seen.has(ch)) { seen.add(ch); fail(`${ch} = ${v} at ${at(u, T, 'mistake')}`); }
      if (a && !seen.has('a' + ch) && !(v >= a.min && v <= a.max)) { seen.add('a' + ch); fail(`${ch} = ${f2(v)} outside the AAOS limits ${a.min}..${a.max} at ${at(u, T, 'mistake')}`); }
    }
    if (cb && !seen.has('clip')) {
      const b = bbox(cb, (c.rig as Rig).frame(p));
      if (!(b.x0 >= vb[0] && b.y0 >= vb[1] && b.x1 <= vb[0] + vb[2] && b.y1 <= vb[1] + vb[3])) { seen.add('clip'); fail(`clipped: figure box ${f2(b.x0)},${f2(b.y0)}..${f2(b.x1)},${f2(b.y1)} outside viewBox ${g.camera.full} [${vb.join(' ')}] at ${at(u, T, 'mistake')}`); }
    }
  });
  for (const t of tells) {
    const chs = sides(g, t.joint);
    if (!chs.length) { fail(`tell "${t.text}" names ${t.joint}, not a channel`); continue; }
    let best = 0, bu = 0;
    U.forEach((u, i) => { for (const ch of chs) { const d = Math.abs(mis[i]![ch] - cor[i]![ch]); if (d > best) { best = d; bu = u; } } });
    const cr = c.in.research ? researchRange(c.in.research, chs[0]!) : undefined, share = cr ? LIMITS.tellShare * (cr.max - cr.min) : Infinity;
    if (!(best >= LIMITS.tellDeg || best >= share)) fail(`tell ${t.joint}: largest delta ${f2(best)} at ${at(bu, T, 'mistake')} < ${LIMITS.tellDeg}° and < 20 % of its range (${cr ? f2(share) : 'no research range'})`);
  }
};

/** Peak speed (units/s) of the fastest grip point over one rep, sampled at 1/120 s. */
function peakSpeed(c: Ctx, rig: Rig, fig: Figure): { v: number; a: AttachmentId; u: number } {
  const T = repSeconds(tempoOf(c.g, fig, 0)), N = Math.round(T * HZ), U = grid(N), pts = grip(c.g);
  const fr = U.map(u => frameAt(c, rig, u, fig, 0));
  let best = { v: 0, a: pts[0]!, u: 0 };
  for (const a of pts) for (let i = 1; i <= N; i++) {
    const p = rig.point(fr[i]!, a), q = rig.point(fr[i - 1]!, a), v = Math.hypot(p[0] - q[0], p[1] - q[1]) * N / T;
    if (v > best.v) best = { v, a, u: U[i]! };
  }
  return best;
}

const mistakeDiffers: Fn = (c, fail) => {
  const g = c.g;
  if (g.kind === 'hold') {
    const d = Math.max(0, ...grid(LIMITS.jointSamples).flatMap(u => { const m = poseAt(g, u, 'mistake', 0, rigOf(c)), k = poseAt(g, u, 'correct', 0, rigOf(c)); return CHANNELS.map(ch => Math.abs(m[ch] - k[ch])); }));
    if (d < LIMITS.tellDeg) fail(`hold: largest sag delta ${f2(d)} < ${LIMITS.tellDeg}°`);
    return 'hold: sag delta';
  }
  if (typeof c.rig === 'string') return void fail(`hand and foot speed not measured: ${c.rig}`);
  const k = peakSpeed(c, c.rig, 'correct'), m = peakSpeed(c, c.rig, 'mistake'), why = speedsDiffer(k.v, m.v);
  if (why) fail(`peak grip speed ${f2(m.v)} u/s (${m.a}, mistake u=${f4(m.u)}) vs ${f2(k.v)} u/s (${k.a}, rep 0 u=${f4(k.u)}): ${why}`);
  return `peak grip speed ${f2(k.v)} → ${f2(m.v)} u/s`;
};

/** mistakeDiffers' rule on the two peak speeds: null when they differ by 15 % or more; no motion in either never differs. */
export function speedsDiffer(correct: number, mistake: number): string | null {
  if (!(correct > 0) || !(mistake > 0)) return `no motion (${f2(correct)} and ${f2(mistake)} u/s), so nothing differs`;
  const d = Math.abs(mistake - correct) / correct;
  return d >= LIMITS.speedDiff ? null : `${f2(100 * d)} % < ${100 * LIMITS.speedDiff} %`;
}

const machineOf = (c: Ctx, fail: (s: string) => void): MachineDrawing | null => {
  if (typeof c.machine === 'string') { fail(c.machine); return null; }
  return c.machine;
};

const setupDiffers: Fn = (c, fail) => {
  const su = c.g.mistake.setup;
  if (!su) return 'no mistake.setup';
  if (!c.g.machine) return void fail(`mistake.setup changes ${su.setting} but the file has no machine`);
  const m = machineOf(c, fail);
  if (!m) return;
  const right = c.g.machine.settings[su.setting];
  if (typeof right !== 'number') return void fail(`setting ${su.setting} = ${String(right)}: the right value must be a number to set against ${su.wrong}`);
  if (!m.settings?.[su.setting]) return void fail(`machine ${c.g.machine.id} has no adjustable ${su.setting} to draw in the setup moment`);
  if (!su.text.trim()) fail('mistake.setup has no text');
  const r = setupMarkup(m, c.g.machine.settings), w = setupMarkup(m, c.g.machine.settings, { setting: su.setting, value: su.wrong });
  if (!compile(r).shapes.length || !compile(w).shapes.length) fail('the setup moment draws 0 shapes');
  if (r === w) fail(`${su.setting}: wrong ${su.wrong} and right ${right} draw the same setup moment`);
};

/** Samples of the correct reps with the drive travel: calls back per sample with the frame and the travel of each drive
 * (a followed part's is its point projected on its path, V1-04). */
function eachSample(c: Ctx, rig: Rig, cb: (f: Frame, u: number, T: number, L: string, travel: number[]) => void) {
  const g = c.g;
  for (const rep of c.reps) {
    const T = repSeconds(tempoOf(g, 'correct', rep)), L = repLabel('correct', rep);
    for (const u of grid(LIMITS.jointSamples)) { const st = stateAt(g, u, 'correct', rep, rig); cb(rig.frame(st.pose), u, T, L, st.travel); }
  }
}

const handsOnHandle: Fn = (c, fail) => {
  if (!c.g.machine) return 'no machine: free-weight parts are drawn in the hand group';
  const m = machineOf(c, fail);
  if (!m) return;
  if (typeof c.rig === 'string') return void fail(`gap not measured: ${c.rig}`);
  const drives = c.g.machine.drive.map(d => ({ d, p: m.parts[d.part] }));
  if (!drives.length) fail(`machine ${c.g.machine.id} has 0 drive parts: nothing moves the machine`);
  drives.filter(x => !x.p).forEach(x => fail(`drive part ${x.d.part} is not in machine ${c.g.machine!.id}`));
  const held = new Set(drives.map(x => x.p?.attach).filter(Boolean));
  for (const a of c.g.equipment.attach.filter(a => /^(hand|foot)_/.test(a))) if (!held.has(a)) fail(`${a} holds the equipment but 0 of ${drives.length} drive parts attach it`);
  const seen = new Set<string>(), rig = c.rig;
  eachSample(c, rig, (f, u, T, L, tr) => drives.forEach(({ d, p }, i) => {
    if (!p?.attach || seen.has(d.part)) return;
    const q = anchorAt(p, tr[i]!), b = rig.point(f, p.attach), gap = Math.hypot(q[0] - b[0], q[1] - b[1]);
    if (!(gap < LIMITS.gap)) { seen.add(d.part); fail(`${p.attach} is ${f2(gap)} units from the ${d.part} anchor (limit ${LIMITS.gap}) at ${at(u, T, L)}`); }
  }));
};

const bodyOnPad: Fn = (c, fail) => {
  if (!c.g.machine) return 'no machine';
  const m = machineOf(c, fail);
  if (!m) return;
  if (!m.pads?.length) return 'no fixed pads';
  if (typeof c.rig === 'string') return void fail(`pads not measured: ${c.rig}`);
  const rig = c.rig, first = new Map<number, Pt>(), seen = new Set<string>();
  eachSample(c, rig, (f, u, T, L) => m.pads!.forEach((pad, i) => {
    const b = rig.point(f, pad.attach), gap = Math.hypot(b[0] - pad.at[0], b[1] - pad.at[1]);
    if (!first.has(i)) first.set(i, b);
    const o = first.get(i)!, drift = Math.hypot(b[0] - o[0], b[1] - o[1]);
    if (!(gap < LIMITS.gap) && !seen.has(`g${i}`)) { seen.add(`g${i}`); fail(`${pad.attach} is ${f2(gap)} units off its pad (limit ${LIMITS.gap}) at ${at(u, T, L)}`); }
    if (!(drift < LIMITS.padDrift) && !seen.has(`d${i}`)) { seen.add(`d${i}`); fail(`${pad.attach} drifts ${f4(drift)} units on its fixed pad (limit ${LIMITS.padDrift}) at ${at(u, T, L)}`); }
  }));
};

const machinePivot: Fn = (c, fail) => {
  if (!c.g.machine) return 'no machine';
  const m = machineOf(c, fail);
  if (!m) return;
  if (typeof c.rig === 'string') return void fail(`pivots not measured: ${c.rig}`);
  const drives = c.g.machine.drive.map(d => ({ d, p: m.parts[d.part] })), seen = new Set<string>(), rig = c.rig;
  drives.filter(x => !x.p).forEach(x => fail(`drive part ${x.d.part} is not in machine ${c.g.machine!.id}`));
  eachSample(c, rig, (f, u, T, L, tr) => drives.forEach(({ d, p }, i) => {
    if (!p || seen.has(d.part)) return;
    if (p.kind === 'lever') {
      const j = rig.pivot(f, p.bound), e = Math.hypot(j[0] - p.pivot[0], j[1] - p.pivot[1]);
      if (!(e <= LIMITS.pivot)) { seen.add(d.part); fail(`${d.part} lever pivot is ${f4(e)} units from ${p.bound} (limit ${LIMITS.pivot}) at ${at(u, T, L)}`); return; }
    }
    const off = offPath(p, anchorAt(p, tr[i]!));
    if (!(off <= LIMITS.gap)) { seen.add(d.part); fail(`${d.part} ${p.kind} end is ${f2(off)} units off its path (travel ${f4(tr[i]!)}, limit ${LIMITS.gap}) at ${at(u, T, L)}`); }
  }));
};

const feetPlanted: Fn = (c, fail) => {
  const g = c.g;
  if (g.pose !== 'standing' && g.pose !== 'seated') return `${g.pose}: no floor contact rule`;
  if (typeof c.rig === 'string') return void fail(`feet not measured: ${c.rig}`);
  const onMachine = new Set<string>();
  if (g.machine && typeof c.machine === 'object' && c.machine) for (const d of g.machine.drive) { const a = c.machine.parts[d.part]?.attach; if (a) onMachine.add(a); }
  const feet = (['foot_l', 'foot_r'] as const).filter(a => !onMachine.has(a)), rig = c.rig, rest = new Map<string, Pt>(), seen = new Set<string>();
  const flight = g.kind === 'ballistic' ? g.equipment.release : undefined;
  eachSample(c, rig, (f, u, T, L) => feet.forEach(a => {
    const p = rig.point(f, a);
    if (!rest.has(a)) rest.set(a, p);
    if (flight && u > flight[0] && u < flight[1]) return;
    const o = rest.get(a)!, move = Math.hypot(p[0] - o[0], p[1] - o[1]), lift = Math.abs(p[1] - FLOOR);
    if ((move > LIMITS.land || lift > LIMITS.land) && !seen.has(a)) { seen.add(a); fail(`${a} ${lift > LIMITS.land ? `${f2(lift)} units off the floor` : `slides ${f2(move)} units`} (limit ${LIMITS.land}) at ${at(u, T, L)}`); }
  }));
};

const pattern = (c: Ctx) => c.in.library.find(e => e.id === c.g.id)?.pattern;
const targetVisible: Fn = (c, fail) => {
  if (!c.view) return void fail(`no view: ${c.g.id} has no library pattern and the file sets no view`);
  if (!c.g.muscles.target.length) fail('muscles.target is empty');
  for (const m of c.g.muscles.target) if (!hasOverlay(c.view, m)) fail(`target ${m} has no overlay in the ${c.view} view (§3)`);
  return `${c.view} view`;
};

const muscleTiming: Fn = (c, fail) => {
  const g = c.g, r = c.in.research;
  if (!r) return void fail('no research.json: peakAt is missing');
  if (!g.muscles.keepQuiet.length) fail('muscles.keepQuiet is empty (§5 researcher: target, helper and quiet muscles)');
  const series = (fig: Figure, rep: number) => {
    const e = effortOf(g, fig, rep, c.rig);
    if (typeof e === 'string') return e;
    const T = repSeconds(tempoOf(g, fig, rep)), N = Math.round(T * HZ);
    return { T, N, v: grid(N).map(u => e(u)) };
  };
  const quietMax = new Map<MuscleId, { v: number; u: number; L: string; T: number }>();
  for (const rep of c.reps) {
    const s = series('correct', rep), L = repLabel('correct', rep);
    if (typeof s === 'string') return void fail(s);
    const muscles = Object.keys(s.v[0]!) as MuscleId[];
    for (const m of muscles) {
      const y = s.v.map(x => x[m]!);
      for (let i = 1; i < y.length; i++) if (Math.abs(y[i]! - y[i - 1]!) > LIMITS.effortStep) { fail(`${m} effort steps ${f4(Math.abs(y[i]! - y[i - 1]!))} in 1/120 s > ${LIMITS.effortStep} at ${at(i / s.N, s.T, L)}`); break; }
      if (g.muscles.keepQuiet.includes(m)) { const i = y.indexOf(Math.max(...y)), q = quietMax.get(m); if (!q || y[i]! > q.v) quietMax.set(m, { v: y[i]!, u: i / s.N, L, T: s.T }); }
      if (rep || !g.muscles.target.includes(m)) continue;
      const i = y.indexOf(Math.max(...y)), u = i / s.N;
      if (Math.abs(u - r.muscles.peakAt) > LIMITS.peakAt) fail(`target ${m} peaks at u=${f4(u)}, ${f4(Math.abs(u - r.muscles.peakAt))} from research peakAt ${r.muscles.peakAt} (limit ${LIMITS.peakAt})`);
      const back = windowsOf(g, 'correct', 0).find(w => w.move === 2 && w.u1 - w.u0 > 1e-9);
      if (back) { const a = y[Math.round(back.u0 * s.N)]!, b = y[Math.round(back.u1 * s.N)]!; if (!(b < a)) fail(`target ${m} does not fall in the ${back.name}: ${f4(a)} at u=${f4(back.u0)} → ${f4(b)} at u=${f4(back.u1)}`); }
    }
  }
  const ms = series('mistake', 0);
  if (typeof ms === 'string') return void fail(ms);
  for (const m of g.muscles.keepQuiet) {
    const q = quietMax.get(m) ?? { v: 0, u: 0, L: 'rep 0', T: 1 }, mm = Math.max(...ms.v.map(x => x[m] ?? 0));
    if (!(q.v < LIMITS.quiet)) fail(`keep-quiet ${m} reaches ${f4(q.v)} ≥ ${LIMITS.quiet} at ${at(q.u, q.T, q.L)}`);
    if (!(mm > q.v)) fail(`keep-quiet ${m} is not higher in the mistake: ${f4(mm)} vs ${f4(q.v)} in the correct reps`);
  }
  return 'model' in g.muscles.effort ? `torque model (${TORQUE.target.join(' + ')}·t)` : 'effort curves';
};

const secondaryMotion: Fn = (c, fail) => {
  const g = c.g, s = sampleGuide(g, 'correct', 0, rigOf(c)), br = s.channels.find(ch => ch.id === 'breath')!.stops.map(x => x[1]);
  if (!(Math.max(...br) - Math.min(...br) > 0)) fail(`breath amplitude ${f4(Math.max(...br) - Math.min(...br))}, must be > 0`);
  let sway = { v: 0, u: 0, L: 'rep 0', T: 1 }, top = 0;
  for (const rep of c.reps) {
    const T = repSeconds(tempoOf(g, 'correct', rep));
    for (const u of grid(LIMITS.jointSamples)) {
      const p = poseAt(g, u, 'correct', rep, rigOf(c));
      if (Math.abs(p.sway) > sway.v) sway = { v: Math.abs(p.sway), u, L: repLabel('correct', rep), T };
      top = Math.max(top, p.shoulder_abd_l, p.shoulder_abd_r, p.shoulder_flex_l, p.shoulder_flex_r);
    }
  }
  const [lo, hi] = LIMITS.sway;
  if (sway.v < lo - 1e-9 || sway.v > hi + 1e-9) fail(`sway amplitude ${f2(sway.v)}° outside [${lo}°, ${hi}°]${sway.v ? ` at ${at(sway.u, sway.T, sway.L)}` : ''}`);
  if (top > LIMITS.bladeAbove && !g.movement.bladeRhythm?.trim()) fail(`the shoulder rises to ${f2(top)}° (> ${LIMITS.bladeAbove}°) with no movement.bladeRhythm`);
  return `sway ${f2(sway.v)}°, shoulder to ${f2(top)}°`;
};

const partMarkup = (c: Ctx): string | null => {
  const k = c.g.equipment.kind;
  if (FIGURE_PARTS.includes(k)) return typeof c.rig === 'string' ? null : '';
  return c.in.parts?.[k] ?? PARTS[k] ?? null;
};
const machineMarkup = (m: MachineDrawing) => m.svg + Object.values(m.settings ?? {}).map(a => a!.svg).join('');

const pathBudget: Fn = (c, fail) => {
  const read = themeReader('silent-black'), out: string[] = [];
  if (typeof c.rig === 'string') fail(`figure not counted: ${c.rig}`);
  else {
    const fig = countPaths(c.rig.markup(read, false, false)), all = countPaths(c.rig.markup(read, false, true));
    if (fig > LIMITS.figurePaths) fail(`figure ${fig} paths > ${LIMITS.figurePaths}`);
    if (all - fig > LIMITS.partPaths) fail(`${c.g.equipment.kind} ${all - fig} paths > ${LIMITS.partPaths}`);
    out.push(`figure ${fig}`, `${c.g.equipment.kind} ${all - fig}`);
  }
  const k = c.g.equipment.kind;
  if (!FIGURE_PARTS.includes(k)) {
    const p = partMarkup(c);
    if (p === null) fail(`part ${k} has no drawing yet (parts library, FG-5)`);
    else { const n = countPaths(p); if (n > LIMITS.partPaths) fail(`part ${k} ${n} paths > ${LIMITS.partPaths}`); out.push(`${k} ${n}`); }
  }
  if (c.g.machine) {
    const m = machineOf(c, fail);
    if (m) { const n = countPaths(machineMarkup(m)); if (n > LIMITS.machinePaths) fail(`machine ${c.g.machine.id} ${n} paths > ${LIMITS.machinePaths}`); out.push(`machine ${n}`); }
  }
  return out.join(', ') + ' paths';
};

const sizeBudget: Fn = (c, fail) => {
  const f = gzipSync(c.in.file.source, { level: 9 }).length, k = gzipSync(c.in.chunk, { level: 9 }).length;
  if (f > LIMITS.fileGzip) fail(`${c.in.file.name}.ts is ${f} B gzip > ${LIMITS.fileGzip} B`);
  if (k > LIMITS.chunkGzip) fail(`form-guide source is ${k} B gzip > ${LIMITS.chunkGzip} B`);
  return `file ${f} B, form-guide source ${k} B gzip`;
};

const FIGURE_ROOT_VARS = ['--l', '--d', '--oc', '--sp', '--rim', '--ph'];
const themes: Fn = (c, fail) => {
  const g = c.g, vb = VIEWBOXES[g.camera.full];
  const extra: [string, string][] = [];
  const p = partMarkup(c);
  if (p) extra.push([`part ${g.equipment.kind}`, p]);
  if (g.machine && typeof c.machine === 'object' && c.machine) extra.push([`machine ${g.machine.id}`, machineMarkup(c.machine)]);
  for (const [what, svg] of extra) { const lit = colourLiterals(svg); if (lit.length) fail(`${what} has colour literals: ${lit.slice(0, 3).join(', ')}`); }
  if (typeof c.rig === 'string') return void fail(`figure not rendered: ${c.rig}`);
  const rig = c.rig, cb = compile(rig.markup(themeReader('silent-black'), false));
  for (const u of moments(windowsOf(g, 'correct', 0))) {
    const b = bbox(cb, frameAt(c, rig, u, 'correct', 0));
    if (!(b.x0 >= vb[0] && b.y0 >= vb[1] && b.x1 <= vb[0] + vb[2] && b.y1 <= vb[1] + vb[3])) fail(`clipped at moment u=${f4(u)}: box ${f2(b.x0)},${f2(b.y0)}..${f2(b.x1)},${f2(b.y1)} outside ${g.camera.full} [${vb.join(' ')}]`);
  }
  for (const id of THEME_IDS) {
    const read = themeReader(id), allowed = new Set<string>();
    for (const m of [false, true]) Object.values(bodyPal(read, m)).forEach(x => allowed.add(x));
    for (const t of Object.keys(FIGURE_TOKENS) as (keyof typeof FIGURE_TOKENS)[]) if (read(t).startsWith('#')) { allowed.add(mix(read, t, 'white', 0)); allowed.add(mix(read, t, 'white', 1)); }
    allowed.add(mix(read, 'pants-hi', 'white', 0.22));
    const defined = new Set([...themeToCss(THEMES[id]).matchAll(/(--[\w-]+):/g)].map(m => m[1]!).concat(FIGURE_ROOT_VARS));
    for (const mistake of [false, true]) {
      const svg = rig.markup(read, mistake) + extra.map(x => x[1]).join(''), L = `${id}${mistake ? ' mistake' : ''}`;
      const lit = colourLiterals(svg, { hex: false }), hex = [...svg.matchAll(/#[0-9a-f]{3,8}\b/gi)].map(m => m[0]).filter(h => !allowed.has(h));
      if (lit.length || hex.length) fail(`${L}: literal colours ${[...lit, ...hex].slice(0, 3).join(', ')}`);
      const undef = [...new Set([...svg.matchAll(/var\((--[\w-]+)\)/g)].map(m => m[1]!))].filter(v => !defined.has(v));
      if (undef.length) fail(`${L}: tokens not defined in the theme: ${undef.join(', ')}`);
      if (!/<path\b[^>]*\sfill="(?!none")[^"]+"/.test(svg)) fail(`${L}: the moment snapshot paints nothing`);
    }
  }
  return `${THEME_IDS.length} themes`;
};

const everyPoseRenders: Fn = (c, fail) => {
  const g = c.g;
  if (typeof c.rig === 'string') return void fail(`no figure: ${c.rig}`);
  const svg = c.rig.markup(themeReader('silent-black'), false);
  if (!countPaths(svg)) fail('the figure markup has 0 paths');
  for (const u of moments(windowsOf(g, 'correct', 0))) {
    const f = frameAt(c, c.rig, u, 'correct', 0), bad = Object.entries(f).find(([, x]) => (x.ops ? x.ops.flat() : [x.opacity]).some(v => typeof v === 'number' && !Number.isFinite(v)));
    if (bad) fail(`moment u=${f4(u)}: ${bad[0]} transform is not finite`);
  }
  if (g.machine) {
    const m = machineOf(c, fail);
    if (!m) return;
    if (!compile(setupMarkup(m, g.machine.settings)).shapes.length) fail(`setup moment of ${g.machine.id} draws 0 shapes`);
    const su = g.mistake.setup;
    if (su && !compile(setupMarkup(m, g.machine.settings, { setting: su.setting, value: su.wrong })).shapes.length) fail('wrong-setting setup moment draws 0 shapes');
  }
  return g.machine ? '4 moments + setup' : '4 moments';
};

const noFilters: Fn = (c, fail) => {
  const svgs: [string, string][] = [];
  if (typeof c.rig !== 'string') for (const m of [false, true]) svgs.push([m ? 'mistake figure' : 'figure', c.rig.markup(themeReader('silent-black'), m)]);
  const p = partMarkup(c);
  if (p) svgs.push([`part ${c.g.equipment.kind}`, p]);
  if (c.g.machine && typeof c.machine === 'object' && c.machine) svgs.push([`machine ${c.g.machine.id}`, machineMarkup(c.machine)]);
  if (!svgs.length) return void fail(`nothing to inspect: ${c.rig as string}`);
  for (const [what, svg] of svgs) { const bad = forbiddenEffects(svg); if (bad.length) fail(`${what}: ${bad.length} forbidden (limit 0): ${bad.slice(0, 3).join(', ')}`); }
};

const idMatch: Fn = (c, fail) => {
  if (c.g.id !== c.in.file.name) fail(`guide.id ${c.g.id} ≠ file name ${c.in.file.name}`);
  if (!c.in.library.some(e => e.id === c.g.id)) fail(`${c.g.id} is not in exercises.json`);
};

/** FG-2's snapshot: sha256 of the per-channel hashes of every correct rep and the mistake, first 16 hex digits. A
 * followed part's travel (V1-04) is hashed beside the channels, only when the file has one. */
export function guideHash(g: ExerciseGuide, rig?: Rig): string {
  const h = (x: unknown) => createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
  const all = repsOf(g).map(r => sampleGuide(g, 'correct', r, rig)).concat(sampleGuide(g, 'mistake', 0, rig));
  return h(all.map(s => ({ ...Object.fromEntries(s.channels.map(ch => [ch.id, h(ch.stops)])), ...(s.travel ? { travel: h(s.travel) } : {}) })));
}
const hash: Fn = (c, fail) => {
  const a = guideHash(c.g, rigOf(c)), b = guideHash(c.g, rigOf(c)), want = c.in.hashes[c.g.id];
  if (a !== b) fail(`sampling is not deterministic: ${a} then ${b}`);
  if (!want) fail(`no stored snapshot for ${c.g.id}: record "${a}" in src/formguide/check/hashes/${c.g.id}.txt`);
  else if (a !== want) fail(`stops hash ${a} ≠ stored ${want}`);
  return a;
};

// ---- V1-07: the add-only checks (docs/FORM-GUIDE-PRODUCTION.md §10.5) ----------------------------------------------
/** V1-07's limits (LIMITS above is unchanged): the frame margin in units, the WCAG ratios, the smallest text in px. */
export const LIMITS_V1 = { frame: 1, gap: LIMITS.gap, ...RATIO, textPx: MIN_TEXT_PX, renderPx: RENDER_PX } as const;
const passesOf = (c: Ctx): Pass[] => [...c.reps.map(rep => ({ fig: 'correct' as Figure, rep })), { fig: 'mistake' as Figure, rep: 0 }]
  .map(p => ({ ...p, T: repSeconds(tempoOf(c.g, p.fig, p.rep)), L: repLabel(p.fig, p.rep) }));
const where = (u: number, p: Pass) => at(u, p.T, p.L);
/** The figure with the widest load label its held part can show (framing.ts WIDEST_LABEL), else the file's own rig. */
const labelled = (c: Ctx, rig: Rig): Rig => {
  if (c.g.equipment.kind !== 'dumbbell') return rig;
  const r = rigFor({ ...c.g, equipment: { ...c.g.equipment, kg: WIDEST_LABEL } } as ExerciseGuide, c.view);
  return typeof r === 'string' ? rig : r;
};
/** A held part the file's fixture draws in place of the figure's own (a seeded bad file), else null. */
const heldOverride = (c: Ctx): string | null => (FIGURE_PARTS.includes(c.g.equipment.kind) ? c.in.parts?.[c.g.equipment.kind] ?? null : null);

const contactsHeld: Fn = (c, fail) => {
  const g = c.g;
  if (!g.contacts?.length && !g.balance && !g.machine?.drive.some(d => 'follow' in d)) return 'no contacts or balance';
  if (typeof c.rig === 'string') return void fail(`contacts not measured: ${c.rig}`);
  const r = heldBy(g, c.rig, typeof c.machine === 'object' ? c.machine : null, passesOf(c), LIMITS.jointSamples, LIMITS.gap, where);
  r.fails.forEach(fail);
  return r.note;
};

const matchesResearch: Fn = (c, fail) => {
  if (!c.in.research) return void fail('no research.json to match');
  researchMismatches(c.g, c.in.research).forEach(fail);
  return `${c.g.cues.length} cues, ${c.g.mistake.tells.length} tells`;
};

const framing: Fn = (c, fail) => {
  if (typeof c.rig === 'string') return void fail(`not framed: ${c.rig}`);
  const g = c.g, rig = c.rig, lab = labelled(c, rig), full = VIEWBOXES[g.camera.full], zoom = VIEWBOXES[g.camera.zoom], read = themeReader('silent-black');
  // the least margin of each figure, facing and camera, reported where it is smallest
  const worst = new Map<string, { v: number; side: string; u: number; p: Pass; box: string }>();
  const keep = (k: string, v: number, side: string, u: number, p: Pass, box: string) => { const w = worst.get(k); if (!w || v < w.v) worst.set(k, { v, side, u, p, box }); };
  for (const p of passesOf(c)) {
    const d = drawnFor(g, m => lab.markup(read, m), p.fig === 'mistake', heldOverride(c), g.camera.subject);
    for (const u of grid(LIMITS.jointSamples)) {
      const f = frameAt(c, rig, u, p.fig, p.rep), b = fastBox(d.body, f);
      for (const [facing, box] of [['', b], [' (other facing)', mirrored(b)]] as const) {
        const [side, v] = Object.entries(marginsOf(box, full)).sort((x, y) => x[1] - y[1])[0]!;
        keep(`${p.L}${facing}`, v, side, u, p, `${g.camera.full} [${full.join(' ')}]`);
      }
      let z = around(rig.pivot(f, g.camera.subject));
      if (d.zoom.shapes.length) z = union(z, fastBox(d.zoom, f));
      const [side, v] = Object.entries(marginsOf(z, zoom)).sort((x, y) => x[1] - y[1])[0]!;
      keep(`${p.L} zoom (${g.camera.subject} and its target tint)`, v, side, u, p, `${g.camera.zoom} [${zoom.join(' ')}]`);
    }
  }
  const least = { full: Infinity, zoom: Infinity };
  for (const [k, w] of worst) {
    least[k.includes('zoom') ? 'zoom' : 'full'] = Math.min(least[k.includes('zoom') ? 'zoom' : 'full'], w.v);
    if (!(w.v >= LIMITS_V1.frame)) fail(`${k}: ${w.side} margin ${f2(w.v)} units < ${LIMITS_V1.frame} in ${w.box} at ${at(w.u, w.p.T, w.p.L)}`);
  }
  return `least margin ${f2(least.full)} units full, ${f2(least.zoom)} zoom`;
};

const contrast: Fn = (c, fail) => {
  if (typeof c.rig === 'string') return void fail(`not measured: ${c.rig}`);
  const g = c.g, rig = c.rig, lab = labelled(c, rig), full = VIEWBOXES[g.camera.full], override = heldOverride(c), px = RENDER_PX / full[2];
  const extra: [string, string][] = [];
  if (override) extra.push([`part ${g.equipment.kind}`, override]);
  const fig = (read: TokenReader, m: boolean) => (override ? heldIn(lab.markup(read, m), override) : lab.markup(read, m));
  const p = partMarkup(c);
  if (p) extra.push([`part ${g.equipment.kind}`, p]);
  if (g.machine && typeof c.machine === 'object' && c.machine) extra.push([`machine ${g.machine.id}`, machineMarkup(c.machine)]);
  const worst = { text: Infinity, mark: Infinity, figure: Infinity, px: Infinity }, seen = new Set<string>();
  const once = (k: string, s: string) => { if (!seen.has(k)) { seen.add(k); fail(s); } };
  for (const id of THEME_IDS) {
    const read = themeReader(id), t = THEMES[id].tokens;
    const pages: [string, RGBA][] = [['stage', parseColour(t.surface1)!], ['tile', parseColour(t.surface2)!]];
    const drawings: [string, string, boolean, Figure?][] = [[' figure', fig(read, false), true, 'correct'], [' mistake figure', fig(read, true), true, 'mistake'], ...extra.map(([w, s]) => [` ${w}`, s, false] as [string, string, boolean])];
    for (const [what, svg, fig, figure] of drawings) {
      // posed at the four key moments (a figure; a part or machine at rest), each at rest as drawn and at full effort:
      // every tint group at the player's full-effort opacity (guideView tintOf)
      const tints = [...svg.matchAll(/<g class="fg-p fg-(t-[\w]+)"/g)].map(m => m[1]!);
      const poses: Frame[] = fig && figure ? moments(windowsOf(g, figure, 0)).map(u => frameAt(c, rig, u, figure, 0)) : [{}];
      for (const pose of poses) {
      const rest = paintedShapes(svg, read, pose), shapes = paintedShapes(svg, read, { ...pose, ...Object.fromEntries(tints.map(k => [k, { opacity: tintOf(1) }])) });
      shapes.forEach((s, i) => {
        if (s.text) {
          const h = s.text.size * px;
          worst.px = Math.min(worst.px, h);
          if (h < MIN_TEXT_PX) once(`px${what}${s.text.body}`, `${id}${what}: text "${s.text.body}" is ${f2(h)} px tall at ${RENDER_PX} px < ${MIN_TEXT_PX} px`);
          for (const [pg, page] of pages) {
            const r = textContrast(shapes, i, page);
            worst.text = Math.min(worst.text, r);
            if (!(r >= RATIO.text)) once(`t${id}${what}${s.text.body}${pg}`, `${id}${what}: text "${s.text.body}" ${f2(r)}:1 < ${RATIO.text}:1 on the ${pg}`);
          }
        } else if (isGuide(s)) {
          for (const [pg, page] of pages) {
            const r = guideContrast(s, page);
            worst.mark = Math.min(worst.mark, r);
            if (!(r >= RATIO.mark)) once(`g${id}${what}${i}${pg}`, `${id}${what}: guide ${s.tag}${s.cls ? ` .${s.cls.split(' ').join('.')}` : ''} ${f2(r)}:1 < ${RATIO.mark}:1 on the ${pg}`);
          }
        } else if (fig && /\bfg-t-/.test(s.cls)) {
          // a tint drawn as a bare shape, not a group with its boundary
          once(`nb${id}${what}${s.cls}`, `${id}${what}: mark ${s.cls.replace(/^.*\b(fg-t-\S+).*$/, '$1')} has no two-tone boundary (0 of 2 lines)`);
        } else if (fig && /^fg-tf-/.test(s.cls)) {
          const key = s.cls.slice(6), o = shapes.findIndex(x => x.cls === `fg-tro-${key}`), n = shapes.findIndex(x => x.cls === `fg-tri-${key}`);
          if (o < 0 || n < 0) return once(`nb${id}${what}${key}`, `${id}${what}: mark fg-t-${key} has no two-tone boundary (${+(o >= 0) + +(n >= 0)} of 2 lines)`);
          const r = boundaryContrast(shapes, i, o, n, pages[0]![1]), m = Math.min(r.outer, r.inner);
          worst.mark = Math.min(worst.mark, m);
          if (!(r.outer >= RATIO.mark)) once(`mo${id}${what}${key}`, `${id}${what}: mark fg-t-${key} outer line ${f2(r.outer)}:1 < ${RATIO.mark}:1 against the body at full effort`);
          if (!(r.inner >= RATIO.mark)) once(`mi${id}${what}${key}`, `${id}${what}: mark fg-t-${key} inner line ${f2(r.inner)}:1 < ${RATIO.mark}:1 against the tint at full effort`);
          for (const k of [o, n]) if (rest[k]!.alpha > 0) once(`mr${id}${what}${key}${k}`, `${id}${what}: mark fg-t-${key} ${k === o ? 'outer' : 'inner'} line shows at rest (opacity ${f2(rest[k]!.alpha)}), not with the effort`);
        }
      });
      }
    }
    // the figure against the page: the body and the clothes, each by its fill or the outline the figure draws round it
    // (the body's --l line, the clothes' bodyPal cloth), whichever reads more
    for (const m of [false, true]) {
      const b = bodyPal(read, m), regions: [string, string, string][] = [['body', b.base, b.line], ['clothes', read('pants'), b.cloth]];
      for (const [pg, page] of pages) for (const [r, fill, line] of regions) {
        const v = Math.max(ratio(parseColour(fill)!, page), ratio(parseColour(line)!, page));
        worst.figure = Math.min(worst.figure, v);
        if (!(v >= RATIO.figure)) once(`f${id}${m}${r}${pg}`, `${id}${m ? ' mistake' : ''} figure ${r} ${f2(v)}:1 < ${RATIO.figure}:1 against the ${pg} (fill ${fill}, outline ${line}, page ${t[pg === 'stage' ? 'surface1' : 'surface2']})`);
      }
    }
  }
  const s = (v: number) => (Number.isFinite(v) ? f2(v) : 'none');
  return `least text ${s(worst.text)}:1, mark ${s(worst.mark)}:1, figure ${s(worst.figure)}:1, smallest text ${s(worst.px)} px`;
};

const balance: Fn = (c, fail) => {
  if (c.g.pose !== 'standing') return `${c.g.pose}: not standing`;
  if (typeof c.rig === 'string') return void fail(`not measured: ${c.rig}`);
  const rig = c.rig, drawn = compile(rig.markup(themeReader('silent-black'), false, false)), head = groupOf(drawn, /^head$/), feet = feetOf(drawn, FLOOR);
  if (!head.shapes.length || !feet.shapes.length) return void fail(`the figure draws ${head.shapes.length} head and ${feet.shapes.length} foot shapes`);
  let least = Infinity, off = 0;
  for (const p of passesOf(c)) {
    let failed = false;
    for (const u of grid(LIMITS.jointSamples)) {
      const f = frameAt(c, rig, u, p.fig, p.rep), cm = centreOfMass(rig, f, head), b = fastBox(feet, f), m = Math.min(cm[0] - b.x0, b.x1 - cm[0]);
      least = Math.min(least, m); off = Math.max(off, Math.abs(cm[0] - (b.x0 + b.x1) / 2));
      if (!(m >= 0) && !failed) { failed = true; fail(`${p.L}: centre of mass x ${f2(cm[0])} is ${f2(-m)} units outside the foot base ${f2(b.x0)}..${f2(b.x1)} at ${at(u, p.T, p.L)}`); }
    }
  }
  return `centre of mass at most ${f2(off)} units off the base middle, ${f2(least)} units inside`;
};

const targetDrawn: Fn = (c, fail) => {
  if (typeof c.rig === 'string') return void fail(`no drawing: ${c.rig}`);
  for (const m of [false, true]) {
    const svg = c.rig.markup(themeReader('silent-black'), m), miss = undrawnTargets(svg, c.g.muscles.target);
    if (miss.length) fail(`${m ? 'mistake' : 'correct'} ${c.view} figure draws no fg-t- tint for ${miss.join(', ')} (${miss.length} of ${c.g.muscles.target.length} targets; it tints ${drawnTints(svg).join(', ')})`);
  }
  return `${c.g.muscles.target.length} targets`;
};

const travelRange: Fn = (c, fail) => {
  const r = travelOf(c.g, rigOf(c), passesOf(c), LIMITS.jointSamples, where);
  r.fails.forEach(fail);
  return r.note;
};

const FNS: Record<CheckId, Fn> = {
  smoothness, stops, jointRanges, mistakeSane, mistakeDiffers, setupDiffers, handsOnHandle, bodyOnPad, feetPlanted,
  targetVisible, muscleTiming, secondaryMotion, pathBudget, sizeBudget, themes, everyPoseRenders, noFilters, machinePivot,
  idMatch, hash,
  contactsHeld, matchesResearch, framing, contrast, balance, targetDrawn, travelRange,
};

/** Runs every §5 check (or the listed ones) on one exercise file. A check that throws fails with the error. */
export function runChecks(input: CheckInput, only: readonly CheckId[] = CHECKS): CheckResult[] {
  const g = input.guide, view = viewOf(g, input.library.find(e => e.id === g.id)?.pattern);
  const mid = g.machine?.id, drawing = mid ? { ...MACHINES, ...input.machines }[mid] : undefined;
  const machine = !mid ? null : drawing ? (drawing.view === view ? drawing : `machine ${mid} is drawn ${drawing.view}, the file is ${view}`) : `machine ${mid} has no drawing (machines library, FG-7)`;
  const r = rigFor(g, view);
  // the solver reads the file's machine from its rig (V1-04): the input's drawing (a seeded file's) over the library's
  const c: Ctx = { g, in: input, view, rig: typeof r === 'string' ? r : { ...r, machine: typeof machine === 'object' ? machine : null }, reps: repsOf(g), machine };
  return only.map(check => {
    const fails: string[] = [];
    let note: string | void = undefined;
    try { note = FNS[check](c, s => fails.push(`${check} ${g.id}: ${s}`)); } catch (e) { fails.push(`${check} ${g.id}: threw ${(e as Error).message}`); }
    return { check, ok: !fails.length, fails, ...(note ? { note } : {}) };
  });
}

/** Plain-text report: one line per check, the failing numbers under it. */
export function report(id: string, rs: CheckResult[]): string {
  const lines = [`fg:check ${id}`];
  for (const r of rs) {
    lines.push(`${r.ok ? 'PASS' : 'FAIL'} ${r.check}${r.note ? ` (${r.note})` : ''}`);
    for (const f of r.fails.slice(0, MAX_LINES)) lines.push(`  ${f}`);
    if (r.fails.length > MAX_LINES) lines.push(`  … and ${r.fails.length - MAX_LINES} more`);
  }
  // one summary per set: the 20 §5 checks, then V1-07's when they ran
  for (const [set, label] of [[CHECKS, ''], [CHECKS_V1, 'V1-07 ']] as const) {
    const ran = rs.filter(r => (set as readonly string[]).includes(r.check));
    if (!ran.length) continue;
    const bad = ran.filter(r => !r.ok).length;
    lines.push(bad ? `${bad} of ${ran.length} ${label}checks failed` : `all ${ran.length} ${label}checks passed`);
  }
  return lines.join('\n');
}

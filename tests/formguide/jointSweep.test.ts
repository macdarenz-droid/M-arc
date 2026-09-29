// V1-11 A5: the joint sweep. Every joint the view draws, alone, in 5° steps across its AAOS range (rig/ranges.ts), in
// every pose of both views: the shapes the joint's group draws must overlap its neighbour's (the parent group's) by
// ≥ 400 units², FG-6's hip-block rule (side.test.ts) made general, so no pose opens a gap at a joint.
import { describe, expect, it } from 'vitest';
import { parseTransform, pathSegs } from '@/formguide/check/svg';
import { figureFront } from '@/formguide/rig/figureFront';
import { DELT, HIPS, THIGH, TORSO, UA, figureSide } from '@/formguide/rig/figureSide';
import { themeReader } from '@/formguide/rig/paint';
import { AAOS } from '@/formguide/rig/ranges';
import { PARENT, type ChannelId, type JointId, type Pose } from '@/formguide/rig/joints';
import { css, frontFrame, sideFrame, type Frame, type PoseId, type SidePoseId } from '@/formguide/rig/pose';

type Pt = [number, number];
type M = [number, number, number, number, number, number];
const MIN = 400, STEP = 5;
const mul = (A: M, B: M): M => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
const I: M = [1, 0, 0, 1, 0, 0];

/** The markup's visible filled shapes (no `fill="none"`, nothing at opacity 0, nothing in defs), each with the joint
 * group that owns it (its nearest `.fg-j` ancestor) and its outline in its own group's coordinates. */
type Tree = { nodes: { parent: number; own?: M; key?: string; origin: Pt; joint?: JointId }[]; shapes: { node: number; joint?: JointId; poly: Pt[] }[] };
function walk(svg: string): Tree {
  const t: Tree = { nodes: [{ parent: -1, origin: [0, 0] }], shapes: [] };
  const stack: { tag: string; node: number; hidden: boolean }[] = [{ tag: '#', node: 0, hidden: false }];
  let defs = 0;
  const attr = (a: string, k: string) => new RegExp(`\\s${k}="([^"]*)"`).exec(a)?.[1];
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z]+)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g)) {
    const [, close, tag, a, self] = m as unknown as string[];
    if (close) { stack.pop(); if (tag === 'defs') defs--; continue; }
    if (tag === 'defs' && !self) defs++;
    const top = stack[stack.length - 1]!, hidden = top.hidden || attr(a!, 'opacity') === '0' || /opacity:\s*0(?![.\d])/.test(attr(a!, 'style') ?? '');
    let node = top.node;
    const tf = attr(a!, 'transform');
    if (tf || tag === 'g') {
      const cls = attr(a!, 'class') ?? '', o = /transform-origin:([-\d.]+)px ([-\d.]+)px/.exec(attr(a!, 'style') ?? '');
      const key = /\bfg-[jp]\b/.test(cls) ? cls.split(' ').map(c => (c.startsWith('j-') ? c.slice(2) : c.startsWith('fg-') && c !== 'fg-j' && c !== 'fg-p' ? c.slice(3) : '')).find(Boolean) : undefined;
      const parent = t.nodes[node]!;
      t.nodes.push({ parent: node, own: tf ? (parseTransform(tf) as M) : undefined, key, origin: o ? [+o[1]!, +o[2]!] : [0, 0], joint: /\bfg-j\b/.test(cls) ? (key as JointId) : parent.joint });
      node = t.nodes.length - 1;
    }
    if (!defs && !hidden && attr(a!, 'fill') !== 'none') {
      const n = (k: string) => +(attr(a!, k) ?? 0);
      let poly: Pt[] = [];
      if (tag === 'path') poly = pathSegs(attr(a!, 'd') ?? '').flatMap(s => (s.length === 4 ? Array.from({ length: 8 }, (_, k) => { const q = k / 8, u = 1 - q; return [0, 1].map(i => u * u * u * s[0]![i]! + 3 * u * u * q * s[1]![i]! + 3 * u * q * q * s[2]![i]! + q * q * q * s[3]![i]!) as Pt; }) : [s[0] as Pt]));
      else if (tag === 'ellipse' || tag === 'circle') { const rx = tag === 'circle' ? n('r') : n('rx'), ry = tag === 'circle' ? n('r') : n('ry'); poly = Array.from({ length: 32 }, (_, k) => [n('cx') + rx * Math.cos((k * Math.PI) / 16), n('cy') + ry * Math.sin((k * Math.PI) / 16)] as Pt); }
      else if (tag === 'rect') { const x = n('x'), y = n('y'), w = n('width'), h = n('height'); poly = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }
      if (poly.length > 2) t.shapes.push({ node, joint: t.nodes[node]!.joint, poly });
    }
    if (!self) stack.push({ tag: tag!, node, hidden });
  }
  return t;
}
/** Each shape's outline in figure space under a frame (CSS: the group's transform about its origin). */
function place(t: Tree, f: Frame, out: M[] = []): { joint?: JointId; poly: Pt[] }[] {
  const mats: M[] = [];
  t.nodes.forEach((n, i) => {
    let X = n.parent < 0 ? I : mats[n.parent]!;
    if (n.own) X = mul(X, n.own);
    const xf = n.key ? f[n.key] : undefined;
    if (xf?.ops) { const [ox, oy] = n.origin; X = mul(mul(mul(X, [1, 0, 0, 1, ox, oy]), parseTransform(css(xf.ops)) as M), [1, 0, 0, 1, -ox, -oy]); }
    mats[i] = X;
  });
  out.push(...mats);
  return t.shapes.map(s => { const A = mats[s.node]!; return { joint: s.joint, poly: s.poly.map(p => [A[0] * p[0] + A[2] * p[1] + A[4], A[1] * p[0] + A[3] * p[1] + A[5]] as Pt) }; });
}
/** Scanline area where both unions are inside (even-odd per shape, unions merged), rows 1 unit apart. */
function overlap(a: Pt[][], b: Pt[][]): number {
  const box = (ps: Pt[][]) => ps.flat().reduce((m, p) => [Math.min(m[0]!, p[1]), Math.max(m[1]!, p[1])], [Infinity, -Infinity]);
  const [a0, a1] = box(a), [b0, b1] = box(b), y0 = Math.max(a0!, b0!), y1 = Math.min(a1!, b1!);
  const spans = (ps: Pt[][], y: number) => {
    const out: [number, number][] = [];
    for (const p of ps) {
      const xs: number[] = [];
      p.forEach((q, i) => { const r = p[(i + 1) % p.length]!; if ((q[1] > y) !== (r[1] > y)) xs.push(q[0] + ((r[0] - q[0]) * (y - q[1])) / (r[1] - q[1])); });
      xs.sort((x, z) => x - z);
      for (let i = 0; i + 1 < xs.length; i += 2) out.push([xs[i]!, xs[i + 1]!]);
    }
    out.sort((x, z) => x[0] - z[0]);
    const m: [number, number][] = [];
    for (const s of out) { const l = m[m.length - 1]; if (l && s[0] <= l[1]) l[1] = Math.max(l[1], s[1]); else m.push([...s]); }
    return m;
  };
  let area = 0;
  for (let y = Math.floor(y0) + 0.5; y < y1; y += 1) {
    const A = spans(a, y), B = spans(b, y);
    let i = 0, j = 0;
    while (i < A.length && j < B.length) {
      const lo = Math.max(A[i]![0], B[j]![0]), hi = Math.min(A[i]![1], B[j]![1]);
      if (hi > lo) area += hi - lo;
      if (A[i]![1] < B[j]![1]) i++; else j++;
    }
  }
  return area;
}

/** The joint a channel turns, and the AAOS range it sweeps. */
const JOINT_OF: Record<string, (s: 'l' | 'r') => JointId> = {
  shoulder_abd: s => `shoulder_${s}`, shoulder_flex: s => `shoulder_${s}`, elbow_flex: s => `elbow_${s}`, wrist_pron: s => `wrist_${s}`,
  hip_flex: s => `hip_${s}`, hip_abd: s => `hip_${s}`, knee_flex: s => `knee_${s}`, ankle_flex: s => `ankle_${s}`, torso_lean: () => 'spine',
};
/** The channels each view draws (docs/FORM-GUIDE-PRODUCTION.md §3 "Channels each view can draw"); front hip_flex is
 * drawn seated only. */
const DRAWN = {
  front: (id: PoseId) => ['shoulder_abd', 'hip_abd', 'knee_flex', 'torso_lean', 'wrist_pron', ...(id === 'seated' ? ['hip_flex'] : [])],
  side: () => ['shoulder_flex', 'elbow_flex', 'hip_flex', 'knee_flex', 'ankle_flex', 'torso_lean'],
};
const sweepOf = (base: keyof typeof AAOS) => { const [lo, hi] = AAOS[base]; const out: number[] = []; for (let v = lo; v <= hi + 1e-9; v += STEP) out.push(v); if (out[out.length - 1]! < hi) out.push(hi); return out; };

/** The joint's own shapes (or, when its group draws none, its first descendant's that do) against its parent's (or the
 * nearest ancestor's that draws some). */
function sides(t: Tree, j: JointId): { child: JointId; parent: JointId[] } {
  const owners = new Set(t.shapes.map(s => s.joint).filter(Boolean) as JointId[]);
  let child: JointId | undefined = j;
  while (child && !owners.has(child)) child = (Object.keys(PARENT) as JointId[]).find(k => PARENT[k] === child);
  let parent = PARENT[j];
  while (parent && !owners.has(parent)) parent = PARENT[parent];
  if (!child) throw new Error(`no drawn shapes at or under ${j}`);
  // the front figure draws its pelvis inside the trunk (the spine's group): a thigh's neighbour is the trunk, and the
  // trunk's are the thighs
  if (!parent) return { child, parent: child === 'spine' ? ['hip_r', 'hip_l'] : ['spine'] };
  return { child, parent: [parent] };
}

type Row = { view: string; pose: string; channel: string; min: number; at: number; rest: number };
function sweep(view: 'front' | 'side', pose: string, tree: Tree, frame: (p: Pose) => Frame): Row[] {
  const rows: Row[] = [];
  for (const base of (view === 'front' ? DRAWN.front(pose as PoseId) : DRAWN.side())) {
    for (const s of base === 'torso_lean' ? (['r'] as const) : (['l', 'r'] as const)) {
      const ch = (base === 'torso_lean' ? base : `${base}_${s}`) as ChannelId, j = JOINT_OF[base]!(s), { child, parent } = sides(tree, j);
      let min = Infinity, at = NaN, rest = NaN;
      for (const v of sweepOf(base as keyof typeof AAOS)) {
        const all = place(tree, frame({ [ch]: v } as Pose));
        const a = overlap(all.filter(x => x.joint === child).map(x => x.poly), all.filter(x => parent.includes(x.joint!)).map(x => x.poly));
        if (a < min) { min = a; at = v; }
        if (v === 0) rest = a;
      }
      rows.push({ view, pose, channel: `${ch} (${child} on ${parent.join('+')})`, min, at, rest });
    }
  }
  return rows;
}

const read = themeReader('silent-black');
const FRONT = walk(figureFront(read, { id: 'q' })), SIDE = { r: walk(figureSide(read, { id: 'q' })) };
const CASES: [string, () => Row[]][] = [
  ...(['standing', 'seated'] as const).map(id => [`front ${id}`, () => sweep('front', id, FRONT, p => frontFrame(id, p))] as [string, () => Row[]]),
  ...(['standing', 'seated', 'lying_supine', 'lying_prone', 'hanging'] as SidePoseId[]).map(id => [`side ${id}`, () => sweep('side', id, SIDE.r, p => sideFrame(id, p))] as [string, () => Row[]]),
];

// A5's assertion (the overlap floor per joint) lands after the V1-11 check-in rules on the measured caps.

// ---- ANSUR ± 0.08 across views and poses ---------------------------------------------------------------------------
// FG-6's rows (side.test.ts "review r1"): side depth over FG-1's front width at the same landmark, from the ANSUR II male
// means (Gordon et al. 2014). V1-11 holds them in every pose of both views: each landmark shape's group is placed rigidly
// relative to its standing rest (side: a rotation and a move; front: also its drawn fore-shortening, which keeps
// widths), so the standing ratios are the ratios of every support.
const TOL = 0.08, CSS = 1e-3;   // CSS text carries 4 decimals (pose.ts css), so a drawn rotation is orthonormal to ~1e-4
/** The last drawn shape with path `d` (the near limb's when both sides draw it): its first point and outline length. */
const shapeIn = (t: Tree, d: string) => { const g = pathSegs(d), p0 = g[0]![0]!, n = g.reduce((k, s) => k + (s.length === 4 ? 8 : 1), 0); return t.shapes.map((s, i) => ({ s, i })).filter(({ s }) => s.poly.length === n && Math.abs(s.poly[0]![0] - p0[0]) < 1e-9 && Math.abs(s.poly[0]![1] - p0[1]) < 1e-9).at(-1)!.i; };
const frontD = (re: RegExp) => re.exec(figureFront(read, { id: 'q' }))![1]!;
const widthAt = (poly: Pt[], y: number) => { const xs: number[] = []; poly.forEach((a, i) => { const b = poly[(i + 1) % poly.length]!; if ((a[1] - y) * (b[1] - y) <= 0 && a[1] !== b[1]) xs.push(a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1])); }); return Math.max(...xs) - Math.min(...xs); };
const ANSUR: [string, string, number, string, number, number][] = [
  ['chest', frontD(/<path d="(M200 99 [^"]+)"/), 150, TORSO, 150, 0.65],
  ['waist', frontD(/<path d="(M200 99 [^"]+)"/), 228, TORSO, 228, 0.74],
  ['hips', frontD(/<path d="(M200 99 [^"]+)"/), 262, HIPS, 290, 0.69],
  ['thigh', frontD(/<path d="(M200 262 L251[^"]+)"/), 350, THIGH, 350, 1],
  ['upper arm', frontD(/<path d="(M-15 6 [^"]+)"/), 50 + 128, UA, 50 + 134, 1],
  ['shoulder (deltoid)', frontD(/<path d="(M-15 -2 C-11 -8 -3 -12 6 -12 C11 -12 16 -11 20 -8 C24 -4 25.5 3 25 12 [^"]+)"/), 10 + 128, DELT, 10 + 134, 1],
];
const inv = (A: M): M => { const d = A[0] * A[3] - A[1] * A[2]; return [A[3] / d, -A[1] / d, -A[2] / d, A[0] / d, (A[2] * A[5] - A[3] * A[4]) / d, (A[1] * A[4] - A[0] * A[5]) / d]; };
/** The shape's outline under a pose, carried back to its standing rest place by the group's motion relative to rest,
 * and that motion's linear part (to check it is rigid, or keeps x in the front view). */
function atRest(t: Tree, i: number, rest: Frame, f: Frame): { poly: Pt[]; L: M } {
  const r: M[] = [], m: M[] = [];
  place(t, rest, r); const all = place(t, f, m), n = t.shapes[i]!.node, X = mul(r[n]!, inv(m[n]!));
  return { poly: all[i]!.poly.map(p => [X[0] * p[0] + X[2] * p[1] + X[4], X[1] * p[0] + X[3] * p[1] + X[5]] as Pt), L: mul(m[n]!, inv(r[n]!)) };
}
const SIDE_ANSUR: [string, Frame][] = [
  ['standing', sideFrame('standing', {})], ['seated', sideFrame('seated', { sway: 1.5 })], ['lying_supine', sideFrame('lying_supine', { sway: 1.5 })],
  ['lying_prone', sideFrame('lying_prone', {})], ['hanging', sideFrame('hanging', { sway: 1.5, hip_flex_r: 90, hip_flex_l: 90 })],
];
const FRONT_ANSUR: [string, Frame][] = [['standing', frontFrame('standing', { sway: 1.5 })], ['seated', frontFrame('seated', { sway: 1.5 })]];

describe('ANSUR ± 0.08 across views, in every pose and support', () => {
  const sideRest = sideFrame('standing', {}), frontRest = frontFrame('standing', {});
  it.each(ANSUR)('%s: side depth / front width within ± 0.08 in every pose', (name, fd, fy, sd, sy, want) => {
    const fi = shapeIn(FRONT, fd), si = shapeIn(SIDE.r, sd);
    for (const [fp, ff] of FRONT_ANSUR) for (const [sp, sf] of SIDE_ANSUR) {
      const F = atRest(FRONT, fi, frontRest, ff), S = atRest(SIDE.r, si, sideRest, sf);
      // side: a rotation (orthonormal); front: widths kept (the part's x axis stays unit length; fore-shortening scales y)
      expect(Math.abs(S.L[0] * S.L[0] + S.L[1] * S.L[1] - 1) + Math.abs(S.L[2] * S.L[2] + S.L[3] * S.L[3] - 1) + Math.abs(S.L[0] * S.L[2] + S.L[1] * S.L[3]), `${name} side ${sp} rigid`).toBeLessThan(CSS);
      expect(Math.abs(F.L[0] * F.L[0] + F.L[1] * F.L[1] - 1), `${name} front ${fp} keeps widths`).toBeLessThan(CSS);
      const r = widthAt(S.poly, sy) / widthAt(F.poly, fy);
      if (fp === 'seated') console.info(`[V1-11] ANSUR ${name}: front ${fp}, side ${sp}: ${r.toFixed(3)} (want ${want}, delta ${(r - want).toFixed(3)})`);
      expect(Math.abs(r - want)).toBeLessThanOrEqual(TOL);
    }
  });
});

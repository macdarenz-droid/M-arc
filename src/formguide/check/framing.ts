// V1-07 `framing` (docs/FORM-GUIDE-PRODUCTION.md §10.5): both figures keep at least 1 unit inside their camera at every
// sample of every correct rep and of the mistake. Covered:
// - loads: the dumbbell label is centred on its head, so the widest label (WIDEST_LABEL, the widest 0.1 kg text over
//   the kg and lb dumbbell ladders, src/brain/units.ts) holds every narrower one, and no label (load 0 or none) sits
//   inside it; a held part given by the file's fixture (`parts`) replaces the figure's own one in its hand groups
//   (heldIn), so it is placed, mirrored and kept level as the figure draws its own;
// - facings: the other facing is the figure mirrored about the rig's centre line (figureFront MIRROR, x → 400 − x);
// - compare: guideView.cameraOf puts the mistake one box width to the right, so each figure must stay in its own box;
// - zoom: the zoom camera exists to show the subject joint and the target muscle, so those (the subject's pivot and
//   the target tints on its side) keep the margin inside it; the rest of the body is cropped by design.
// SVG text is measured as a box: TEXT_EM wide per character, TEXT_ASCENT above and TEXT_DESCENT below the baseline.
import type { ExerciseGuide } from '../model';
import type { Pt } from '../rig/ik';
import { apply, mmul, opMat, type Frame, type Op } from '../rig/pose';
import type { Mat } from '../rig/figureFront';
import { compile, type Box, type Compiled } from './svg';

/** The widest dumbbell label (to 0.1 kg, load.ts) over the kg ladder 2..60 kg and the lb ladder 5..150 lb. */
export const WIDEST_LABEL = 57.5;
export const TEXT_EM = 0.7, TEXT_ASCENT = 0.8, TEXT_DESCENT = 0.25;
/** The rig's mirror axis (figureFront MIRROR). */
export const MIRROR_X = 200;

const attr = (a: string, k: string) => new RegExp(`\\s${k}="([^"]*)"`).exec(a)?.[1];
/** Markup with every <text> replaced by the box it covers (same place in the tree, so the same transforms). */
export function textAsBoxes(svg: string): string {
  return svg.replace(/<text\b((?:\s+[\w:-]+="[^"]*")*)\s*>([^<]*)<\/text>/g, (_, a: string, body: string) => {
    const fs = +(attr(a, 'font-size') ?? 16), n = body.trim().length, w = n * TEXT_EM * fs, x = +(attr(a, 'x') ?? 0), y = +(attr(a, 'y') ?? 0);
    const anchor = attr(a, 'text-anchor') ?? 'start', x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
    const t = attr(a, 'transform');
    return `<rect${t ? ` transform="${t}"` : ''} x="${+x0.toFixed(3)}" y="${+(y - TEXT_ASCENT * fs).toFixed(3)}" width="${+w.toFixed(3)}" height="${+((TEXT_ASCENT + TEXT_DESCENT) * fs).toFixed(3)}"/>`;
  });
}

/** Only the target tints of the listed muscles on one side keep their outline (the rest keep the tree, no shapes). */
export function tintsOnly(svg: string, muscles: readonly string[], side: 'l' | 'r'): string {
  const keep = new RegExp(`class="[^"]*\\bfg-t[f]?-(?:${muscles.join('|') || '(?!)'})_${side}\\b`);
  return svg
    .replace(/<(\/?)(polygon|polyline|rect|circle|ellipse|line|text)\b/g, '<$1g')
    .replace(/<path\b((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g, (m, a: string, self: string) => (keep.test(m) ? m : `<g${a.replace(/\sd="[^"]*"/, '')}${self ? ' /' : ''}>`));
}

export type Margins = { left: number; top: number; right: number; bottom: number };
export const marginsOf = (b: Box, vb: readonly number[]): Margins =>
  ({ left: b.x0 - vb[0]!, top: b.y0 - vb[1]!, right: vb[0]! + vb[2]! - b.x1, bottom: vb[1]! + vb[3]! - b.y1 });
/** The same box drawn facing the other way. */
export const mirrored = (b: Box): Box => ({ x0: 2 * MIRROR_X - b.x1, x1: 2 * MIRROR_X - b.x0, y0: b.y0, y1: b.y1 });
export const union = (a: Box, b: Box): Box => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) });
export const around = (p: Pt): Box => ({ x0: p[0], y0: p[1], x1: p[0], y1: p[1] });

/**
 * The figure markup with another held part in its hands: the part goes in each level hand group (`fg-eq_<side>`, the
 * near head's, about the grip) and the far-head group (`fg-eqf_<side>`) is emptied. Throws when the markup has no hand
 * groups to hold it.
 */
export function heldIn(markup: string, part: string): string {
  let n = 0;
  const out = markup.replace(/(<g class="fg-p fg-(eqf?)_[lr]"[^>]*>)[^]*?(<\/g>)/g, (_, open: string, k: string, close: string) => { n++; return `${open}${k === 'eq' ? part : ''}${close}`; });
  if (n !== 4) throw new Error(`the figure has ${n} of 4 hand part groups (fg-eq_l, fg-eq_r, fg-eqf_l, fg-eqf_r)`);
  return out;
}

/** The figure as the check measures it: all of it, and the zoom's subject tints. */
export type Drawn = { body: Compiled; zoom: Compiled };

/** The extremes of a cubic on one axis (svg.ts cubicRange). */
function range3(a: number, b: number, c: number, d: number, lo: number, hi: number): [number, number] {
  lo = Math.min(lo, a, d); hi = Math.max(hi, a, d);
  const A = -a + 3 * b - 3 * c + d, B = 2 * (a - 2 * b + c), C = b - a;
  const ts = Math.abs(A) < 1e-12 ? (Math.abs(B) < 1e-12 ? [] : [-C / B]) : (() => { const q = B * B - 4 * A * C; return q < 0 ? [] : [(-B + Math.sqrt(q)) / (2 * A), (-B - Math.sqrt(q)) / (2 * A)]; })();
  for (const t of ts) if (t > 0 && t < 1) { const v = (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d; lo = Math.min(lo, v); hi = Math.max(hi, v); }
  return [lo, hi];
}
/**
 * svg.ts `bbox`, faster for the thousands of frames framing reads: each animated group's ops are multiplied as matrices
 * with their numbers rounded to 1e-4 as pose.ts `css` writes them for the browser (bbox writes the CSS text and parses
 * it back), and a shape's curves are solved only when the box of its control points (which holds the curve) reaches
 * past the box so far. Held equal to bbox by checksV1.test.ts.
 */
const localBoxes = new WeakMap<Compiled, number[][]>();
export function fastBox(c: Compiled, f: Frame): Box {
  const mats: Mat[] = [];
  c.nodes.forEach((n, i) => {
    let M: Mat = n.parent < 0 ? [1, 0, 0, 1, 0, 0] : mats[n.parent]!;
    if (n.own) M = mmul(M, n.own);
    const xf = n.key ? f[n.key] : undefined;
    if (xf?.ops) { const [ox, oy] = n.origin!; M = mmul(M, [1, 0, 0, 1, ox, oy]); for (const o of xf.ops) M = mmul(M, opMat(o.map(v => (typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v)) as Op)); M = mmul(M, [1, 0, 0, 1, -ox, -oy]); }
    mats[i] = M;
  });
  const b: Box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  let lb = localBoxes.get(c);
  if (!lb) localBoxes.set(c, (lb = c.shapes.map(s => { const q = s.segs.flat(); return [Math.min(...q.map(p => p[0])), Math.min(...q.map(p => p[1])), Math.max(...q.map(p => p[0])), Math.max(...q.map(p => p[1]))]; })));
  for (let si = 0; si < c.shapes.length; si++) {
    const s = c.shapes[si]!, M = mats[s.node]!, [lx0, ly0, lx1, ly1] = lb[si]!;
    // the shape's control points lie in its local box, whose four corners bound them under M: inside the box so far, skip
    let inside = true;
    for (const q of [[lx0, ly0], [lx1, ly0], [lx0, ly1], [lx1, ly1]] as Pt[]) { const p = apply(M, q); if (!(p[0] >= b.x0 && p[0] <= b.x1 && p[1] >= b.y0 && p[1] <= b.y1)) { inside = false; break; } }
    if (inside) continue;
    const pts = s.segs.map(seg => seg.map(q => apply(M, q)));
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const seg of pts) for (const p of seg) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
    if (x0 >= b.x0 && x1 <= b.x1 && y0 >= b.y0 && y1 <= b.y1) continue;
    for (const p of pts) {
      if (p.length !== 4) { const q = p[0]!; b.x0 = Math.min(b.x0, q[0]); b.x1 = Math.max(b.x1, q[0]); b.y0 = Math.min(b.y0, q[1]); b.y1 = Math.max(b.y1, q[1]); continue; }
      [b.x0, b.x1] = range3(p[0]![0], p[1]![0], p[2]![0], p[3]![0], b.x0, b.x1);
      [b.y0, b.y1] = range3(p[0]![1], p[1]![1], p[2]![1], p[3]![1], b.y0, b.y1);
    }
  }
  return b;
}

/** The figure markup the check measures: the widest load label as a box, and an override part (fixture) held. */
export function drawnFor(g: ExerciseGuide, markup: (mistake: boolean) => string, mistake: boolean, override: string | null | undefined, subject: string): Drawn {
  const m = markup(mistake), side = subject.endsWith('_l') ? 'l' : 'r';
  return { body: compile(textAsBoxes(override ? heldIn(m, override) : m)), zoom: compile(tintsOnly(m, g.muscles.target, side)) };
}

// FG-5: what every free-weight part shares (docs/FORM-GUIDE-PRODUCTION.md §4 "Parts library"). A part is one <g> in
// the comic style: iron bodies fill with the figure's cel gradient (`url(#<g>)`, three bands from --iron-hi, --iron and
// --iron-sh), inked with --ink, and one --iron-hi highlight edge. Markup carries var() and url() only, never a colour.
// Units are the rig's (303 per metre, y down; figureFront.ts P2, kept equal by tests/formguide/parts.test.ts and not
// imported, because figureFront.ts draws the library dumbbell and an import back would be a cycle). Each part is drawn
// in its own frame: a held part about its grip, a floor part with y = 0 on the floor. Anchors are §3 attachment points in that frame; `place` moves both together.
import type { AttachmentId, PartId } from '../model';
import type { Pt } from '../rig/ik';
import type { MachineDrawing, Slide } from '../check/machines';
import type { View } from '../rig/joints';
import { cel, mix, type TokenReader } from '../rig/paint';

export type { Pt };
export type Anchors = Partial<Record<AttachmentId, Pt>>;
export type Part = {
  id: PartId;
  view: View;
  /** The part's markup: one <g class="fg-part fg-part-<id>">, token colours only. */
  svg: string;
  /** Attachment points in the part's frame. */
  anchors: Anchors;
};

/** Rig units per metre. */
export const UNITS_PER_M = 303;
/** The rig's own spacings (figureFront.ts, front view): shoulder joint to shoulder joint (SH_R - SH_L = 120 units) and
 * foot to foot standing (2 x (LEG_X - 200) = 56 units), in mm, so a part's paired anchors meet both sides at once. */
export const RIG_MM = { shoulders: 396.04, stance: 184.82 } as const;
/** Millimetres to rig units. */
export const mm = (v: number) => +((v * UNITS_PER_M) / 1000).toFixed(2);
export const n2 = (v: number) => +v.toFixed(2);

/** The iron cel gradient the parts fill with; the figure defines the same one as `<id>-i` (figureFront.ts). */
export const ironGrad = (read: TokenReader, id: string) =>
  cel(id, mix(read, 'iron-hi', 'white', 0), mix(read, 'iron', 'white', 0), mix(read, 'iron-sh', 'white', 0), 0.6);

export const INK = 'var(--ink)', HI = 'var(--iron-hi)', SH = 'var(--iron-sh)', IRON = 'var(--iron)';
/** An inked iron body (even-odd, so a second sub-path punches a hole). */
export const body = (d: string, g: string, w = 1.8, cls = '') => `<path${cls ? ` class="${cls}"` : ''} d="${d}" fill="url(#${g})" fill-rule="evenodd" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"/>`;
/** A flat body in one token. */
export const flat = (d: string, paint: string, w = 1.6) => `<path d="${d}" fill="${paint}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"/>`;
/** The highlight edge (one per part, §4). */
export const edge = (d: string, w = 1.6) => `<path d="${d}" fill="none" stroke="${HI}" stroke-width="${w}" stroke-linecap="round" opacity=".85"/>`;
/** A rectangle as a path (so the §5 path count sees it). */
export const rect = (x: number, y: number, w: number, h: number) => `M${n2(x)} ${n2(y)}h${n2(w)}v${n2(h)}h${n2(-w)}Z`;
/** A rounded rectangle as a path. */
export const rrect = (x: number, y: number, w: number, h: number, r: number) => {
  r = Math.min(r, w / 2, h / 2);
  return `M${n2(x + r)} ${n2(y)}H${n2(x + w - r)}Q${n2(x + w)} ${n2(y)} ${n2(x + w)} ${n2(y + r)}V${n2(y + h - r)}Q${n2(x + w)} ${n2(y + h)} ${n2(x + w - r)} ${n2(y + h)}H${n2(x + r)}Q${n2(x)} ${n2(y + h)} ${n2(x)} ${n2(y + h - r)}V${n2(y + r)}Q${n2(x)} ${n2(y)} ${n2(x + r)} ${n2(y)}Z`;
};
/** A circular arc from a0 to a1 degrees (0 = +x, 90 = down the screen) as cubic Béziers of at most 90° each, so the
 * checks' bounding box (check/svg.ts reads arcs only by their end points) sees the whole curve. Starts with M. */
export function arc(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / 90)), da = ((a1 - a0) / n) * (Math.PI / 180), k = (4 / 3) * Math.tan(da / 4);
  const P = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const, f = (v: number) => n2(v);
  let a = a0 * (Math.PI / 180);
  const [x0, y0] = P(a);
  let d = `M${f(x0)} ${f(y0)}`;
  for (let i = 0; i < n; i++, a += da) {
    const [xa, ya] = P(a), [xb, yb] = P(a + da);
    d += `C${f(xa - k * r * Math.sin(a))} ${f(ya + k * r * Math.cos(a))} ${f(xb + k * r * Math.sin(a + da))} ${f(yb - k * r * Math.cos(a + da))} ${f(xb)} ${f(yb)}`;
  }
  return d;
}
/** A circle as a path; `hole` punches a centre hole (bodies fill even-odd). */
export const disc = (cx: number, cy: number, r: number, hole = 0) => arc(cx, cy, r, 0, 360) + 'Z' + (hole ? arc(cx, cy, hole, 0, 360) + 'Z' : '');
/** The lab's hexagon points (the dumbbell ends). */
export function hexPts(cx: number, cy: number, r: number): string {
  const a: string[] = [];
  for (let i = 0; i < 6; i++) { const t = Math.PI / 6 + (i * Math.PI) / 3; a.push((cx + r * Math.cos(t)).toFixed(1) + ',' + (cy + r * Math.sin(t)).toFixed(1)); }
  return a.join(' ');
}
export const wrap = (id: PartId, inner: string, extra = '') => `<g class="fg-part fg-part-${id}"${extra}>${inner}</g>`;

/** Every drawn shape (path, rect, circle, ellipse, polygon, polyline, line): the §3 part budget counts them all. */
export const shapeCount = (svg: string) => (svg.match(/<(?:path|rect|circle|ellipse|polygon|polyline|line)[\s/>]/g) ?? []).length;
/** §3 budget: a bench or free-weight part draws at most this many shapes. */
export const PART_SHAPES = 25;

const D = Math.PI / 180;
/** A part moved to `at` and turned `deg` (clockwise on screen, as SVG rotate): markup and anchors together. */
export function place(p: Part, at: Pt, deg = 0): Part {
  const c = Math.cos(deg * D), s = Math.sin(deg * D);
  const anchors: Anchors = {};
  for (const [k, q] of Object.entries(p.anchors) as [AttachmentId, Pt][]) anchors[k] = [n4(at[0] + c * q[0] - s * q[1]), n4(at[1] + s * q[0] + c * q[1])];
  return { ...p, anchors, svg: `<g transform="translate(${n4(at[0])} ${n4(at[1])})${deg ? ` rotate(${n4(deg)})` : ''}">${p.svg}</g>` };
}
const n4 = (v: number) => +v.toFixed(4);

/**
 * The hook the machine checks read (§3: `handsOnHandle`, `bodyOnPad`). Fixed parts (bench, box, rack) become pads at
 * their anchors; a held part becomes one slide per hand or foot anchor along `path` (its travel from 0 to 1, e.g. the
 * RDL bar's line), so the limb chain is checked against the part the drive rule moves.
 */
export function asDrawing(view: View, fixed: Part[], held?: { part: Part; path: [Pt, Pt]; name: string }): MachineDrawing {
  const pads = fixed.flatMap(p => (Object.entries(p.anchors) as [AttachmentId, Pt][]).map(([attach, at]) => ({ attach, at })));
  const parts: Record<string, Slide> = {};
  if (held) {
    const d: Pt = [held.path[1][0] - held.path[0][0], held.path[1][1] - held.path[0][1]];
    for (const [attach, a] of Object.entries(held.part.anchors) as [AttachmentId, Pt][]) {
      if (!/^(hand|foot)_/.test(attach)) continue;
      parts[`${held.name}_${attach}`] = { kind: 'carriage', attach, path: [a, [a[0] + d[0], a[1] + d[1]]] };
    }
  }
  return { view, svg: fixed.map(p => p.svg).join('') + (held?.part.svg ?? ''), parts, pads };
}

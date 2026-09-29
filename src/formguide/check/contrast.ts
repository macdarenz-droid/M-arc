// V1-07 `contrast` (docs/FORM-GUIDE-PRODUCTION.md §10.5; WCAG 2.2 SC 1.4.3 and 1.4.11): in every theme, drawn text
// reaches 4.5:1 against what is painted under it, the marks (the muscle tints at full effort) 3:1 against the body under
// them, and the figure 3:1 against the page; drawn text is at least MIN_TEXT_PX tall at 360 px. Colours are read from
// the markup itself (hex, rgb(a), var() through the figure's own custom properties and the theme's figure tokens, and
// every stop of a url() gradient, each one tried), composited as the browser does (opacity and alpha over what is
// under). What is under a point is the topmost earlier shape whose outline holds it, at the markup's rest pose; the page
// is the stage (`--surface-1`, styles.css .form-guide .stage) and the Pictures tile (`--surface-2`, .tile).
import type { Token, TokenReader } from '../rig/paint';
import { FIGURE_TOKENS } from '../rig/paint';
import type { Mat } from '../rig/figureFront';
import { apply, mmul } from '../rig/pose';
import type { Pt } from '../rig/ik';
import { parseTransform, pathSegs, type Seg } from './svg';
import { TEXT_ASCENT, TEXT_DESCENT, TEXT_EM } from './framing';

export const RATIO = { text: 4.5, mark: 3, figure: 3 } as const;
/** The app's smallest type (styles.css `--fs-cap`, 11px): drawn text is never smaller at 360 px. */
export const MIN_TEXT_PX = 11;
export const RENDER_PX = 360;

// ---- colour ---------------------------------------------------------------------------------------------------------
export type RGBA = [number, number, number, number];
export function parseColour(s: string): RGBA | null {
  const t = s.trim().toLowerCase();
  let m = /^#([0-9a-f]{3,8})$/.exec(t);
  if (m) {
    const h = m[1]!, x = h.length <= 4 ? [...h].map(c => c + c).join('') : h;
    if (x.length !== 6 && x.length !== 8) return null;
    return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16), x.length === 8 ? parseInt(x.slice(6, 8), 16) / 255 : 1];
  }
  m = /^rgba?\(([^)]*)\)$/.exec(t);
  if (m) { const v = m[1]!.split(/[,\s/]+/).filter(Boolean).map(Number); return [v[0]!, v[1]!, v[2]!, v[3] ?? 1]; }
  return null;
}
const lin = (c: number) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
/** WCAG relative luminance. */
export const luminance = (c: RGBA) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
/** WCAG contrast ratio (opaque colours). */
export const ratio = (a: RGBA, b: RGBA) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
/** `top` at opacity `o` (times its own alpha) over the opaque `under`. */
export const over = (top: RGBA, o: number, under: RGBA): RGBA => { const a = top[3] * o; return [top[0] * a + under[0] * (1 - a), top[1] * a + under[1] * (1 - a), top[2] * a + under[2] * (1 - a), 1]; };

// ---- painted shapes -------------------------------------------------------------------------------------------------
export type Painted = {
  tag: string; cls: string;
  /** the fill's colours: one, or every stop of a gradient; empty for none */
  fill: RGBA[];
  /** the stroke's colours (as fill), and the raw stroke and fill values (a guide is found by its token) */
  stroke: RGBA[]; raw: { fill: string; stroke: string };
  /** the element's opacity times its groups' and its fill-opacity */
  alpha: number;
  /** outline in figure space at the rest pose, as polygons (cubics flattened) */
  rings: Pt[][];
  /** text only: font size in figure units after its transforms, its box corners and middle, and its characters */
  text?: { size: number; pts: Pt[]; body: string };
};

const attr = (a: string, k: string) => new RegExp(`\\s${k}="([^"]*)"`).exec(a)?.[1];
const styleVars = (a: string) => Object.fromEntries([...(attr(a, 'style') ?? '').matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)].map(m => [m[1]!, m[2]!.trim()]));
const flat = (seg: Seg): Pt[] => (seg.length === 4 ? Array.from({ length: 8 }, (_, i) => { const t = (i + 1) / 8, u = 1 - t; return [0, 1].map(k => u * u * u * seg[0]![k]! + 3 * u * u * t * seg[1]![k]! + 3 * u * t * t * seg[2]![k]! + t * t * t * seg[3]![k]!) as Pt; }) : [seg[0]!]);
const nums = (s: string) => (s.match(/-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/gi) ?? []).map(Number);
const scaleOf = (M: Mat) => Math.sqrt(Math.abs(M[0] * M[3] - M[1] * M[2]));

/** Every painted shape of the markup in paint order, with its resolved fill. `read` resolves the theme's figure tokens. */
export function paintedShapes(svg: string, read: TokenReader): Painted[] {
  const grads = new Map<string, string[]>();
  for (const m of svg.matchAll(/<(linear|radial)Gradient\b[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/\1Gradient>/g))
    grads.set(m[2]!, [...m[3]!.matchAll(/stop-color="([^"]+)"/g)].map(s => s[1]!));
  type Fr = { tag: string; M: Mat; vars: Record<string, string>; fill?: string; op: number };
  const stack: Fr[] = [{ tag: '#root', M: [1, 0, 0, 1, 0, 0], vars: {}, op: 1 }], out: Painted[] = [];
  let inDefs = 0;
  const tokenOf = (name: string, vars: Record<string, string>): string | null => {
    if (vars[name]) return vars[name]!;
    const t = name.slice(2);
    return t in FIGURE_TOKENS ? read(t as Token) : null;
  };
  const resolve = (v: string, vars: Record<string, string>, depth = 0): string[] => {
    const s = v.trim();
    if (!s || s === 'none' || s === 'transparent' || depth > 4) return [];
    const u = /^url\(#([^)]+)\)$/.exec(s);
    if (u) return (grads.get(u[1]!) ?? []).flatMap(c => resolve(c, vars, depth + 1));
    const va = /^var\((--[\w-]+)\)$/.exec(s);
    if (va) { const x = tokenOf(va[1]!, vars); return x ? resolve(x, vars, depth + 1) : []; }
    return [s];
  };
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z]+)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g)) {
    const [, close, tag, a, self] = m as unknown as [string, string, string, string, string];
    if (close) { const top = stack.pop()!; if (top.tag === 'defs') inDefs--; continue; }
    if (tag === 'defs' && !self) inDefs++;
    const up = stack[stack.length - 1]!, t = attr(a, 'transform');
    const fr: Fr = { tag, M: t ? mmul(up.M, parseTransform(t)) : up.M, vars: { ...up.vars, ...styleVars(a) }, fill: attr(a, 'fill') ?? up.fill, op: up.op * +(attr(a, 'opacity') ?? 1) };
    if (!inDefs && tag !== 'g' && tag !== 'svg') {
      const n = (k: string) => +(attr(a, k) ?? 0), fillOp = +(attr(a, 'fill-opacity') ?? 1);
      let segs: Seg[] = [];
      if (tag === 'path') segs = pathSegs(attr(a, 'd') ?? '');
      else if (tag === 'rect') { const x = n('x'), y = n('y'), w = n('width'), h = n('height'); segs = [[[x, y]], [[x + w, y]], [[x + w, y + h]], [[x, y + h]]]; }
      else if (tag === 'circle' || tag === 'ellipse') { const rx = tag === 'circle' ? n('r') : n('rx'), ry = tag === 'circle' ? n('r') : n('ry'); segs = Array.from({ length: 24 }, (_, i) => [[n('cx') + rx * Math.cos((i * Math.PI) / 12), n('cy') + ry * Math.sin((i * Math.PI) / 12)]] as Seg); }
      else if (tag === 'polygon' || tag === 'polyline') { const v = nums(attr(a, 'points') ?? ''); for (let i = 0; i + 1 < v.length; i += 2) segs.push([[v[i]!, v[i + 1]!]]); }
      const fillSrc = fr.fill ?? (tag === 'line' || tag === 'polyline' ? 'none' : '#000000');
      const fill = resolve(fillSrc, fr.vars).map(parseColour).filter((c): c is RGBA => !!c);
      const strokeSrc = attr(a, 'stroke') ?? 'none', stroke = resolve(strokeSrc, fr.vars).map(parseColour).filter((c): c is RGBA => !!c);
      const p: Painted = { tag, cls: attr(a, 'class') ?? '', fill, stroke, raw: { fill: fillSrc, stroke: strokeSrc }, alpha: fr.op * fillOp, rings: [] };
      // a path's sub-paths start at each M: split the flattened outline there
      if (tag === 'path') {
        let ring: Pt[] = [];
        for (const s of segs) { if (s.length === 1 && ring.length) { p.rings.push(ring); ring = []; } ring.push(...flat(s).map(q => apply(fr.M, q))); }
        if (ring.length) p.rings.push(ring);
      } else if (segs.length) p.rings.push(segs.map(s => apply(fr.M, s[0]!)));
      if (tag === 'text') {
        const fs = +(attr(a, 'font-size') ?? 16), end = svg.indexOf('</text>', m.index!), body = svg.slice(m.index! + m[0].length, end).trim();
        const w = body.length * TEXT_EM * fs, x = n('x'), y = n('y'), anc = attr(a, 'text-anchor') ?? 'start', x0 = anc === 'middle' ? x - w / 2 : anc === 'end' ? x - w : x;
        const y0 = y - TEXT_ASCENT * fs, y1 = y + TEXT_DESCENT * fs, i = 0.15;
        const pts: Pt[] = [[x0 + i * w, y0 + i * (y1 - y0)], [x0 + (1 - i) * w, y0 + i * (y1 - y0)], [x0 + i * w, y1 - i * (y1 - y0)], [x0 + (1 - i) * w, y1 - i * (y1 - y0)], [x0 + w / 2, (y0 + y1) / 2]];
        p.text = { size: fs * scaleOf(fr.M), pts: pts.map(q => apply(fr.M, q)), body };
        p.rings = [];
      }
      out.push(p);
    }
    if (!self) stack.push(fr);
  }
  return out;
}

/** Even-odd: is the point inside the shape's outline. */
export function inside(p: Painted, q: Pt): boolean {
  let n = false;
  for (const ring of p.rings) for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i]!, b = ring[j]!;
    if ((a[1] > q[1]) !== (b[1] > q[1]) && q[0] < ((b[0] - a[0]) * (q[1] - a[1])) / (b[1] - a[1]) + a[0]) n = !n;
  }
  return n;
}

/** Every colour the point can show under shape `before` (paint order): the shapes below composited over the page. */
export function under(shapes: Painted[], before: number, q: Pt, page: RGBA): RGBA[] {
  for (let j = before - 1; j >= 0; j--) {
    const s = shapes[j]!;
    if (s.text || !s.fill.length || !(s.alpha > 0) || !inside(s, q)) continue;
    const below = s.alpha >= 1 && s.fill.every(c => c[3] >= 1) ? [page] : under(shapes, j, q, page);
    const out: RGBA[] = [];
    for (const c of s.fill) for (const b of below) out.push(over(c, s.alpha, b));
    return dedupe(out);
  }
  return [page];
}
const dedupe = (cs: RGBA[]) => [...new Map(cs.map(c => [c.map(v => v.toFixed(2)).join(), c])).values()];

/** The lowest ratio of a text against what is under it, and its rendered height in px at `scale` px per unit. */
export function textContrast(shapes: Painted[], i: number, page: RGBA): number {
  const s = shapes[i]!;
  let worst = Infinity;
  for (const q of s.text!.pts) for (const b of under(shapes, i, q, page)) for (const c of s.fill) worst = Math.min(worst, ratio(over(c, s.alpha, b), b));
  return worst;
}

/** A guide mark (angle arc, tag, path trace): painted with `--guide` or classed `fg-guide`. Guides sit on the stage. */
export const isGuide = (s: Painted) => /\bfg-guide\b/.test(s.cls) || /var\(--guide\)/.test(s.raw.fill + s.raw.stroke);
/** The lowest ratio of a guide's colours (fill and stroke, at its opacity) against the page. */
export function guideContrast(s: Painted, page: RGBA): number {
  let worst = Infinity;
  for (const c of [...s.fill, ...s.stroke]) worst = Math.min(worst, ratio(over(c, s.alpha, page), page));
  return worst;
}

/** The lowest ratio of a mark (drawn at opacity `o`) against what is under its middle. */
export function markContrast(shapes: Painted[], i: number, o: number, page: RGBA): number {
  const s = shapes[i]!, pts = s.rings.flat(), mid: Pt = [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length];
  const q = inside(s, mid) ? mid : pts.find(p => inside(s, p)) ?? mid;
  let worst = Infinity;
  for (const b of under(shapes, i, q, page)) for (const c of s.fill) worst = Math.min(worst, ratio(over(c, o, b), b));
  return worst;
}

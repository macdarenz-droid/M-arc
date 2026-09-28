// FG-3: node-side reading of form-guide markup for the checks: the bounding box of a posed figure (each static
// `transform` and each animated group's CSS transform about its transform-origin, composed as the browser does, as in
// tests/formguide/svgWalk.ts), path counts, colour literals and forbidden effects. Pure string work, no DOM.
import type { Mat } from '../rig/figureFront';
import { css, mmul, apply, type Frame } from '../rig/pose';

const D = Math.PI / 180;
const nums = (s: string) => (s.match(/-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/gi) ?? []).map(Number);

/** A transform list in SVG attribute or CSS syntax (px/deg units). */
export function parseTransform(s: string): Mat {
  let M: Mat = [1, 0, 0, 1, 0, 0];
  for (const m of s.matchAll(/(matrix|translate|rotate|scale)\(([^)]*)\)/g)) {
    const a = nums(m[2]!);
    let X: Mat;
    if (m[1] === 'matrix') X = a.slice(0, 6) as Mat;
    else if (m[1] === 'translate') X = [1, 0, 0, 1, a[0]!, a[1] ?? 0];
    else if (m[1] === 'scale') X = [a[0]!, 0, 0, a[1] ?? a[0]!, 0, 0];
    else {
      const c = Math.cos(a[0]! * D), sn = Math.sin(a[0]! * D); X = [c, sn, -sn, c, 0, 0];
      if (a.length === 3) X = mmul(mmul([1, 0, 0, 1, a[1]!, a[2]!], X), [1, 0, 0, 1, -a[1]!, -a[2]!]);
    }
    M = mmul(M, X);
  }
  return M;
}

type Pt = [number, number];
/** A drawn outline piece: a point, or a cubic Bézier [p0, c1, c2, p3] (lines and quadratics are written as cubics). */
export type Seg = Pt[];
const lineSeg = (a: Pt, b: Pt): Seg => [a, a, b, b];
/** A path's outline as cubic segments (arcs and T by their end points). */
export function pathSegs(d: string): Seg[] {
  const out: Seg[] = [];
  let x = 0, y = 0, sx = 0, sy = 0, lc: Pt | null = null;
  for (const m of d.matchAll(/([MLHVCSQTAZmlhvcsqtaz])([^MLHVCSQTAZmlhvcsqtaz]*)/g)) {
    const c = m[1]!, a = nums(m[2]!), rel = c === c.toLowerCase(), C = c.toUpperCase();
    if (C === 'Z') { out.push(lineSeg([x, y], [sx, sy])); x = sx; y = sy; lc = null; continue; }
    const step = C === 'H' || C === 'V' ? 1 : C === 'C' ? 6 : C === 'S' || C === 'Q' ? 4 : C === 'A' ? 7 : 2;
    for (let i = 0; i + step <= a.length; i += step) {
      const g = a.slice(i, i + step), ox = rel ? x : 0, oy = rel ? y : 0, P = (k: number): Pt => [g[k]! + ox, g[k + 1]! + oy], cur: Pt = [x, y];
      let end: Pt, nc: Pt | null = null;
      if (C === 'M') { end = P(0); if (i === 0) { sx = end[0]; sy = end[1]; } else out.push(lineSeg(cur, end)); }
      else if (C === 'L' || C === 'T' || C === 'A') { end = C === 'A' ? P(5) : P(0); out.push(lineSeg(cur, end)); }
      else if (C === 'H') { end = [g[0]! + ox, y]; out.push(lineSeg(cur, end)); }
      else if (C === 'V') { end = [x, g[0]! + oy]; out.push(lineSeg(cur, end)); }
      else if (C === 'C' || C === 'S') {
        const c1: Pt = C === 'C' ? P(0) : lc ? [2 * x - lc[0], 2 * y - lc[1]] : cur, c2 = C === 'C' ? P(2) : P(0);
        end = C === 'C' ? P(4) : P(2); out.push([cur, c1, c2, end]); nc = c2;
      } else {
        const q = P(0); end = P(2);
        out.push([cur, [x + (2 / 3) * (q[0] - x), y + (2 / 3) * (q[1] - y)], [end[0] + (2 / 3) * (q[0] - end[0]), end[1] + (2 / 3) * (q[1] - end[1])], end]);
      }
      x = end[0]; y = end[1]; lc = nc;
    }
  }
  return out;
}
/** An ellipse as four cubic Béziers (k = 0.5523). */
const ellipseSegs = (cx: number, cy: number, rx: number, ry: number): Seg[] => {
  const k = 0.5523, p = (a: number, b: number): Pt => [cx + a * rx, cy + b * ry];
  return [[p(1, 0), p(1, k), p(k, 1), p(0, 1)], [p(0, 1), p(-k, 1), p(-1, k), p(-1, 0)], [p(-1, 0), p(-1, -k), p(-k, -1), p(0, -1)], [p(0, -1), p(k, -1), p(1, -k), p(1, 0)]];
};

type Node = { parent: number; own?: Mat; key?: string; origin?: Pt };
export type Compiled = { nodes: Node[]; shapes: { node: number; segs: Seg[] }[] };
const attrOf = (attrs: string, k: string) => new RegExp(`\\s${k}="([^"]*)"`).exec(attrs)?.[1];

/** Parses markup once into its group tree and shape outlines; throws on unbalanced tags. */
export function compile(svg: string): Compiled {
  const nodes: Node[] = [{ parent: -1 }], shapes: Compiled['shapes'] = [], stack: { tag: string; node: number }[] = [{ tag: '#root', node: 0 }];
  let inDefs = 0;
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z]+)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g)) {
    const [, close, tag, attrs, self] = m as unknown as [string, string, string, string, string];
    if (close) { const top = stack.pop()!; if (top.tag !== tag) throw new Error(`</${tag}> closes <${top.tag}>`); if (tag === 'defs') inDefs--; continue; }
    if (tag === 'defs' && !self) inDefs++;
    const parent = stack[stack.length - 1]!.node, t = attrOf(attrs, 'transform');
    let node = parent;
    if (t || tag === 'g') {
      const cls = attrOf(attrs, 'class') ?? '', o = /transform-origin:([-\d.]+)px ([-\d.]+)px/.exec(attrOf(attrs, 'style') ?? '');
      const key = /\bfg-[jp]\b/.test(cls) ? cls.split(' ').map(c => (c.startsWith('j-') ? c.slice(2) : c.startsWith('fg-') && c !== 'fg-j' && c !== 'fg-p' ? c.slice(3) : '')).find(Boolean) : undefined;
      nodes.push({ parent, own: t ? parseTransform(t) : undefined, key, origin: o ? [+o[1]!, +o[2]!] : [0, 0] });
      node = nodes.length - 1;
    }
    if (!inDefs) {
      const n = (k: string) => +(attrOf(attrs, k) ?? 0);
      let segs: Seg[] = [];
      if (tag === 'path') segs = pathSegs(attrOf(attrs, 'd') ?? '');
      else if (tag === 'ellipse') segs = ellipseSegs(n('cx'), n('cy'), n('rx'), n('ry'));
      else if (tag === 'circle') segs = ellipseSegs(n('cx'), n('cy'), n('r'), n('r'));
      else if (tag === 'rect') { const x = n('x'), y = n('y'), w = n('width'), h = n('height'); segs = [lineSeg([x, y], [x + w, y]), lineSeg([x + w, y], [x + w, y + h]), lineSeg([x + w, y + h], [x, y + h]), lineSeg([x, y + h], [x, y])]; }
      else if (tag === 'line') segs = [lineSeg([n('x1'), n('y1')], [n('x2'), n('y2')])];
      else if (tag === 'polygon' || tag === 'polyline') { const a = nums(attrOf(attrs, 'points') ?? ''); for (let i = 2; i + 1 < a.length; i += 2) segs.push(lineSeg([a[i - 2]!, a[i - 1]!], [a[i]!, a[i + 1]!])); }
      else if (tag === 'text') segs = [[[n('x'), n('y')]]];
      if (segs.length) shapes.push({ node, segs });
    }
    if (!self) stack.push({ tag, node });
  }
  if (stack.length !== 1) throw new Error(`unclosed <${stack[stack.length - 1]!.tag}>`);
  return { nodes, shapes };
}

/** The extremes of a cubic on one axis: its end values and the values where its derivative is zero. */
function cubicRange(a: number, b: number, c: number, d: number): [number, number] {
  let lo = Math.min(a, d), hi = Math.max(a, d);
  const A = -a + 3 * b - 3 * c + d, B = 2 * (a - 2 * b + c), C = b - a;
  const ts = Math.abs(A) < 1e-12 ? (Math.abs(B) < 1e-12 ? [] : [-C / B]) : (() => { const q = B * B - 4 * A * C; return q < 0 ? [] : [(-B + Math.sqrt(q)) / (2 * A), (-B - Math.sqrt(q)) / (2 * A)]; })();
  for (const t of ts) if (t > 0 && t < 1) { const v = (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d; lo = Math.min(lo, v); hi = Math.max(hi, v); }
  return [lo, hi];
}

export type Box = { x0: number; y0: number; x1: number; y1: number };
/** The bounding box of the compiled markup's outlines under a frame (strokes not included). */
export function bbox(c: Compiled, f: Frame): Box {
  const mats: Mat[] = [];
  c.nodes.forEach((n, i) => {
    let M: Mat = n.parent < 0 ? [1, 0, 0, 1, 0, 0] : mats[n.parent]!;
    if (n.own) M = mmul(M, n.own);
    const xf = n.key ? f[n.key] : undefined;
    if (xf?.ops) { const [ox, oy] = n.origin!; M = mmul(mmul(mmul(M, [1, 0, 0, 1, ox, oy]), parseTransform(css(xf.ops))), [1, 0, 0, 1, -ox, -oy]); }
    mats[i] = M;
  });
  const b: Box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  for (const s of c.shapes) for (const seg of s.segs) {
    const p = seg.map(q => apply(mats[s.node]!, q));
    const [x0, x1] = p.length === 4 ? cubicRange(p[0]![0], p[1]![0], p[2]![0], p[3]![0]) : [p[0]![0], p[0]![0]];
    const [y0, y1] = p.length === 4 ? cubicRange(p[0]![1], p[1]![1], p[2]![1], p[3]![1]) : [p[0]![1], p[0]![1]];
    if (x0 < b.x0) b.x0 = x0; if (x1 > b.x1) b.x1 = x1; if (y0 < b.y0) b.y0 = y0; if (y1 > b.y1) b.y1 = y1;
  }
  return b;
}

export const countPaths = (svg: string): number => (svg.match(/<path[\s/>]/g) ?? []).length;

// The colour-literal lint of tests/formguide/colourLint.ts (kept in step with it; that file is test-only).
const HEX = /#[0-9a-fA-F]{3,8}(?![\w-])/g;
const FN = /(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\(/gi;
const NAMED = /(?<![\w-])(?:fill|stroke|stop-color|flood-color|lighting-color|color)\s*[:=]\s*["']?(?!(?:none|currentColor|transparent|inherit|url|var)(?![\w-]))[a-z]+(?![\w(-])/gi;
export function colourLiterals(src: string, { hex = true } = {}): string[] {
  return [...(hex ? [HEX] : []), FN, NAMED].flatMap(re => [...src.matchAll(re)].map(m => m[0]));
}

/** §5 noFilters: a filter or mask anywhere, or an animated `d` or fill (SMIL or a CSS property). */
export function forbiddenEffects(svg: string): string[] {
  const res = [/<filter\b/g, /\sfilter="[^"]*"/g, /filter\s*:/g, /<mask\b/g, /\smask="[^"]*"/g, /mask\s*:/g,
    /<(?:animate|set)\b[^>]*attributeName="(?:d|fill)"/g, /(?:^|[;"\s])d\s*:\s*path\(/g, /(?:transition|animation)[^;"]*\b(?:fill|d)\b/g];
  return res.flatMap(re => [...svg.matchAll(re)].map(m => m[0].trim()));
}

// FG-1 test helper: a node-only SVG walk (no DOM in this test environment). It checks the markup is well formed and
// composes, down the group tree, each static `transform` attribute and each animated group's CSS transform about its
// transform-origin, the way the browser does, so a joint's figure-space position comes from the markup itself.
export type Mat = [number, number, number, number, number, number];
const D = Math.PI / 180;
const mul = (A: Mat, B: Mat): Mat => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
export const at = (A: Mat, x: number, y: number): [number, number] => [A[0] * x + A[2] * y + A[4], A[1] * x + A[3] * y + A[5]];
const nums = (s: string) => s.split(/[\s,]+/).filter(Boolean).map(v => parseFloat(v));

/** Parses a transform list: SVG attribute syntax or CSS (px/deg units). */
export function parseTransform(s: string): Mat {
  let M: Mat = [1, 0, 0, 1, 0, 0];
  for (const m of s.matchAll(/(matrix|translate|rotate|scale)\(([^)]*)\)/g)) {
    const a = nums(m[2]!.replace(/px|deg/g, ''));
    let X: Mat;
    if (m[1] === 'matrix') X = a as Mat;
    else if (m[1] === 'translate') X = [1, 0, 0, 1, a[0]!, a[1] ?? 0];
    else if (m[1] === 'scale') X = [a[0]!, 0, 0, a[1] ?? a[0]!, 0, 0];
    else { const c = Math.cos(a[0]! * D), sn = Math.sin(a[0]! * D); X = [c, sn, -sn, c, 0, 0]; if (a.length === 3) X = mul(mul([1, 0, 0, 1, a[1]!, a[2]!], X), [1, 0, 0, 1, -a[1]!, -a[2]!]); }
    M = mul(M, X);
  }
  return M;
}

export type Walk = { frames: Record<string, Mat>; tags: Record<string, number>; classes: string[] };
/**
 * Walks the markup. css(key) gives the CSS transform applyPose wrote for a joint or part key (or undefined).
 * frames maps each joint/part key to the matrix of its own frame; throws on unbalanced tags.
 */
export function walk(svg: string, css: (key: string) => string | undefined): Walk {
  const stack: { tag: string; M: Mat }[] = [{ tag: '#root', M: [1, 0, 0, 1, 0, 0] }];
  const frames: Record<string, Mat> = {}, tags: Record<string, number> = {}, classes: string[] = [];
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z]+)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g)) {
    const [, close, tag, attrs, self] = m as unknown as [string, string, string, string, string];
    if (close) { const top = stack.pop()!; if (top.tag !== tag) throw new Error(`</${tag}> closes <${top.tag}>`); continue; }
    tags[tag] = (tags[tag] ?? 0) + 1;
    const attr = (k: string) => new RegExp(`\\s${k}="([^"]*)"`).exec(attrs)?.[1];
    const cls = attr('class');
    if (cls) classes.push(cls);
    if (self) continue;
    let M = stack[stack.length - 1]!.M;
    if (tag === 'g') {
      const t = attr('transform'); if (t) M = mul(M, parseTransform(t));
      const key = cls?.split(' ').map(c => (c.startsWith('j-') ? c.slice(2) : c.startsWith('fg-') && c !== 'fg-j' && c !== 'fg-p' ? c.slice(3) : '')).find(Boolean);
      if (key && /fg-[jp]\b/.test(cls!)) {
        const o = /transform-origin:([-\d.]+)px ([-\d.]+)px/.exec(attr('style') ?? '');
        const ox = o ? +o[1]! : 0, oy = o ? +o[2]! : 0, c = css(key);
        if (c) M = mul(mul(mul(M, [1, 0, 0, 1, ox, oy]), parseTransform(c)), [1, 0, 0, 1, -ox, -oy]);
        frames[key] = M;
      }
    }
    stack.push({ tag, M });
  }
  if (stack.length !== 1) throw new Error(`unclosed <${stack[stack.length - 1]!.tag}>`);
  return { frames, tags, classes };
}

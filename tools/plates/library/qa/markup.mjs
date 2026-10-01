// LIB-3 markup helpers: a tag scanner for the engine's own SVG and overlay markup (regular, generated, no comments or
// CDATA), and path lengths for the absolute M/L/H/V/C/Z commands the engine writes. Pure: no I/O.

const TAG = /<(\/?)([a-zA-Z][\w:-]*)((?:\s+[\w:-]+(?:="[^"]*")?)*)\s*(\/?)>/g;
const ATTR = /([\w:-]+)(?:="([^"]*)")?/g;

/** Every opening tag: [{ name, attrs: Map }]. Throws on a '<' that is not a tag (markup the scanner cannot read). */
export function tags(markup) {
  const out = [];
  let last = 0;
  for (const m of markup.matchAll(TAG)) {
    if (markup.slice(last, m.index).includes('<')) throw new Error(`markup: unreadable text before offset ${m.index}`);
    last = m.index + m[0].length;
    if (m[1]) continue;
    const attrs = new Map();
    for (const a of m[3].matchAll(ATTR)) attrs.set(a[1], a[2] ?? '');
    out.push({ name: m[2], attrs });
  }
  if (markup.slice(last).includes('<')) throw new Error('markup: unreadable text at the end');
  return out;
}

/** Element names, attribute names and class tokens used. */
export function vocabularyOf(markup) {
  const el = new Set(), attr = new Set(), cls = new Set();
  for (const t of tags(markup)) {
    el.add(t.name);
    for (const [k, v] of t.attrs) { attr.add(k); if (k === 'class') v.split(/\s+/).filter(Boolean).forEach(c => cls.add(c)); }
  }
  return { elements: el, attributes: attr, classes: cls };
}

/** The d attribute of every <path> whose class list holds `cls`. */
export const pathsOf = (markup, cls) => tags(markup)
  .filter(t => t.name === 'path' && (t.attrs.get('class') ?? '').split(/\s+/).includes(cls))
  .map(t => t.attrs.get('d') ?? '');

/** Length of an absolute path (M, L, H, V, C, Z). Cubic segments are integrated at 64 steps. */
export function pathLength(d) {
  const tok = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  let i = 0, cmd = null, x = 0, y = 0, sx = 0, sy = 0, L = 0;
  const num = () => { const v = +tok[i++]; if (!Number.isFinite(v)) throw new Error(`pathLength: bad number in ${d.slice(0, 40)}`); return v; };
  while (i < tok.length) {
    if (/[A-Za-z]/.test(tok[i])) cmd = tok[i++];
    if (!/^[MLHVCZ]$/.test(cmd ?? '')) throw new Error(`pathLength: unsupported command ${cmd}`);
    if (cmd === 'Z') { L += Math.hypot(sx - x, sy - y); x = sx; y = sy; continue; }
    if (cmd === 'M') { x = sx = num(); y = sy = num(); cmd = 'L'; continue; }
    if (cmd === 'L') { const nx = num(), ny = num(); L += Math.hypot(nx - x, ny - y); x = nx; y = ny; continue; }
    if (cmd === 'H') { const nx = num(); L += Math.abs(nx - x); x = nx; continue; }
    if (cmd === 'V') { const ny = num(); L += Math.abs(ny - y); y = ny; continue; }
    const c = [x, y, num(), num(), num(), num(), num(), num()];
    let px = x, py = y;
    for (let k = 1; k <= 64; k++) {
      const t = k / 64, u = 1 - t;
      const qx = u * u * u * c[0] + 3 * u * u * t * c[2] + 3 * u * t * t * c[4] + t * t * t * c[6];
      const qy = u * u * u * c[1] + 3 * u * u * t * c[3] + 3 * u * t * t * c[5] + t * t * t * c[7];
      L += Math.hypot(qx - px, qy - py); px = qx; py = qy;
    }
    x = c[6]; y = c[7];
  }
  return L;
}

/** Words as golden B's copy lint counts them. */
export const words = s => String(s).replace(/<br\s*\/?>/g, ' ').split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
export const unesc = s => String(s).replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

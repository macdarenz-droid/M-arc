// HT-11: the encoder of the generated How-to modules' path codec. The format and its one decoder are in
// src/howto/delta.js; pack() runs that decoder on its own output and refuses any fragment that does not come back
// byte for byte, so this file's predictions (walk) only have to match it for the output to be accepted.
import { readFileSync } from 'node:fs';
import { unpack } from '../../../../src/howto/delta.js';

const DECODER = new URL('../../../../src/howto/delta.js', import.meta.url);
/** unpack's source as written in src/howto/delta.js (its last declaration), for the generated modules to carry. Read from
 *  the file, never String(unpack): a module loader that transforms delta.js (vitest's) would change those bytes. */
export function decoderSource() {
  const t = readFileSync(DECODER, 'utf8'), i = t.indexOf('export function unpack(');
  if (i < 0 || t.indexOf('export function unpack(', i + 1) >= 0 || !t.endsWith('\n}\n')) throw new Error('delta: src/howto/delta.js must end with export function unpack');
  return t.slice(i + 'export '.length, -1);
}

/** The files a packed module is made with (each packed output lists them among its inputs). */
export const CODEC = ['tools/plates/gen/codec/delta.mjs', 'src/howto/delta.js'];
export const ALPHA = '0123456789abcdefghijklmnopqrstuvwxyzABDEFGHIJKNOPRSTUVWXY-_.!*()';
const ARITY = { M: 2, L: 2, Q: 4, C: 6 };
const NUM = /^(0|[1-9][0-9]*)(\.[0-9]?[1-9])?$/;
const ORDER = { M: [0, 1], L: [0, 1], Q: [0, 1, 2, 3], C: [0, 1, 4, 5, 2, 3] };   // walk order of a group's numbers
const hundredths = s => { const [i, f = ''] = s.split('.'); return Number(i) * 100 + Number(f.padEnd(2, '0')); };
const fmt = n => { const f = n % 100; return `${(n - f) / 100}${f ? `.${f < 10 ? '0' : ''}${f % 10 ? f : f / 10}` : ''}`; };
export const varint = r => { let z = r < 0 ? -2 * r - 1 : 2 * r, s = ''; do { const b = z % 32; z = (z - b) / 32; s += ALPHA[z ? b + 32 : b]; } while (z); return s; };

/** The decoder's predictions for one coordinate group of command c (see delta.js): calls next(prediction) per number
 *  in walk order, next returns the true number. */
function walk(st, c, next) {
  const [x, y] = st.cur, ex = 2 * x - st.prev[0], ey = 2 * y - st.prev[1];
  if (c === 'M') { const p = [next(x), next(y)]; st.prev = st.cur = p; if (st.open) { st.start = p; st.open = false; } st.ctl = null; return; }
  if (c === 'L') { const p = [next(ex), next(ey)]; st.prev = st.cur; st.cur = p; st.ctl = null; return; }
  if (c === 'Q') { next(x); next(y); const p = [next(ex), next(ey)]; st.prev = st.cur; st.cur = p; st.ctl = null; return; }
  const k = st.ctl ? [2 * x - st.ctl[0], 2 * y - st.ctl[1]] : st.cur;
  const c1 = [next(k[0]), next(k[1])], p = [next(3 * c1[0] - 2 * x), next(3 * c1[1] - 2 * y)];
  st.ctl = [next(Math.round(p[0] + (x - p[0]) / 3)), next(Math.round(p[1] + (y - p[1]) / 3))];
  st.prev = st.cur; st.cur = p;
}

/** A path of commands M C L Q Z, each followed directly by its numbers, one space between numbers, every number
 *  canonical (NUM), as [[cmd, hundredths[]], ...]; else null. */
function parse(d) {
  if (d[0] !== 'M' || !/^(?:[MCLQ][0-9.]+(?: [0-9.]+)*|Z)+$/.test(d)) return null;
  const out = [];
  for (const [, c, run] of d.matchAll(/([MCLQZ])([0-9. ]*)/g)) {
    const v = run ? run.split(' ') : [];
    if (v.some(s => !NUM.test(s)) || (c === 'Z' ? v.length : !v.length || v.length % ARITY[c])) return null;
    out.push([c, v.map(hundredths)]);
  }
  return out;
}

/** The `~#` form of a Catmull-Rom spline path (M q0, then C c1 c2 q per segment, optional Z), else null. */
function encodeSpline(d) {
  const m = d.match(/^M([0-9.]+) ([0-9.]+)((?:C[0-9.]+ [0-9.]+ [0-9.]+ [0-9.]+ [0-9.]+ [0-9.]+)+)(Z?)$/);
  if (!m) return null;
  const segs = [...m[3].matchAll(/C([0-9.]+) ([0-9.]+) ([0-9.]+) ([0-9.]+) ([0-9.]+) ([0-9.]+)/g)].map(x => x.slice(1));
  if (![m[1], m[2], ...segs.flat()].every(s => NUM.test(s))) return null;
  const qx = [m[1], ...segs.map(s => s[4])].map(hundredths), qy = [m[2], ...segs.map(s => s[5])].map(hundredths);
  const n = segs.length, z = m[4] ? 1 : 0;
  const g = j => z ? (j % n + n) % n : j < 0 ? 0 : j > n ? n : j, X = j => qx[g(j)], Y = j => qy[g(j)];
  let out = `~#${varint(n)}${varint(z)}`;
  for (let j = 0; j <= n; j++) out += varint(qx[j] - (2 * (qx[j - 1] ?? 0) - (qx[j - 2] ?? 0))) + varint(qy[j] - (2 * (qy[j - 1] ?? 0) - (qy[j - 2] ?? 0)));
  segs.forEach((s, j) => {
    const c = [X(j) + (X(j + 1) - X(j - 1)) / 6, Y(j) + (Y(j + 1) - Y(j - 1)) / 6, X(j + 1) - (X(j + 2) - X(j)) / 6, Y(j + 1) - (Y(j + 2) - Y(j)) / 6];
    out += c.map((p, k) => varint(hundredths(s[k]) - Math.round(p))).join('');
  });
  return out;
}

/** The shortest `~` form of a path (spline, circle or walked commands), else null (the path stays raw). */
export function encodePath(d) {
  const a = encodeSpline(d), b = encodeWalk(d);
  return a && b ? (a.length <= b.length ? a : b) : a ?? b;
}

function encodeWalk(d) {
  const o = d.match(/^M([0-9.]+) ([0-9.]+)a([0-9.]+) [0-9.]+ 0 1 0 ([0-9.]+) /);
  if (o && o.slice(1).every(s => NUM.test(s))) {
    const [x, y, r, w] = o.slice(1).map(hundredths), a = fmt(r);
    if (`M${fmt(x)} ${fmt(y)}a${a} ${a} 0 1 0 ${fmt(w)} 0a${a} ${a} 0 1 0 -${fmt(w)} 0Z` === d) return `~~${varint(x)}${varint(y)}${varint(r)}${varint(w - 2 * r)}`;
  }
  const cmds = parse(d);
  if (!cmds) return null;
  const st = { cur: [0, 0], prev: [0, 0], start: [0, 0], ctl: null, open: true };
  let out = '~';
  for (const [c, v] of cmds) {
    out += c;
    if (c === 'Z') { st.prev = st.cur = st.start; st.ctl = null; st.open = true; continue; }
    for (let i = 0; i < v.length; i += ARITY[c]) {
      const vals = ORDER[c].map(j => v[i + j]);
      let k = 0;
      walk(st, c, pred => { const t = vals[k++]; out += varint(t - pred); return t; });
    }
  }
  return out;
}

const ATTR = / d="([^"]*)"/g;

/** Encodes fragments that share one path table. `table` (the distinct paths before them, in first-seen order) grows in
 *  place. Throws unless unpack() gives every fragment's bytes back. */
export function pack(frags, table = []) {
  const before = [...table], at = new Map(table.map((d, n) => [d, n]));
  const out = frags.map(s => {
    if (/ d="[~^]/.test(s)) throw new Error('delta: a source path starts with ~ or ^');
    return s.replace(ATTR, (m, d) => {
      if (at.has(d)) return ` d="^${at.get(d)}"`;
      at.set(d, table.length); table.push(d);
      return ` d="${encodePath(d) ?? d}"`;
    });
  });
  const back = unpack(out, before);
  frags.forEach((s, n) => { if (back[n] !== s) throw new Error(`delta: fragment ${n} does not decode to its own bytes`); });
  return out;
}

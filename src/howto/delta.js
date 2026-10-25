// HT-11: the decoder of the generated How-to modules' path codec. Plain JS, so the encoder
// (tools/plates/gen/codec/delta.mjs) runs this same function in node; delta.d.ts types it. unpack() is
// self-contained and type-clean as TypeScript (defaults type its parameters): the generator writes its source text into
// each ht-<slug>.ts, which calls it once at import, so the chunk imports nothing (an import would add a preload entry
// per id to loaders-*.js). The app reads the decoded strings, the golden bytes (L2 compares them with ===).
//
// In an encoded fragment each ` d="X"` value is one of
//   X               raw, byte for byte (it never starts with ~ or ^)
//   ^<n>            the table's n-th path, n in decimal (a repeat: a Mistake path the Normal SVG already ships)
//   ~<cmd><v>...    a path of commands M C L Q Z, each number in hundredths, as its difference from a prediction
//   ~~<x><y><r><e>  the circle `M<x> <y>a<r> <r> 0 1 0 <w> 0a<r> <r> 0 1 0 -<w> 0Z`, w = 2r + e
//   ~#<n><z><q...><c...>  a Catmull-Rom spline as the engine draws it (tools/plates/vendor/engine/geom.mjs spline):
//                   M q0 then n segments C c1 c2 q(j+1), Z when z = 1. The n + 1 on-curve points q come first, each
//                   one step on from the previous (the first from 0 0), then each segment's four control numbers as
//                   their difference from the Catmull-Rom control of the decoded points (closed: the points wrap,
//                   open: they clamp), rounded to hundredths
// A number is a zigzag varint: digits of 5 bits, low first; A's first 32 end a number, its last 32 continue it.
// Predictions, from the current point (x, y): M at it; L and Q's end one step on from the previous point; C walks c1,
// end, c2 as if the control points sat a third of the way along the chord: c1 continues the last control (a smooth
// join), the end lies three c1 steps on, c2 a third of the way back. Z returns to the subpath's start.
export function unpack(frags = [''], table = frags.slice(0, 0)) {
  const A = '0123456789abcdefghijklmnopqrstuvwxyzABDEFGHIJKNOPRSTUVWXY-_.!*()';
  const f = (n = 0) => { const r = n % 100; return (n - r) / 100 + (r ? '.' + (r < 10 ? '0' : '') + (r % 10 ? r : r / 10) : ''); };
  const path = (e = '') => {
    let i = 1, out = '', x = 0, y = 0, px = 0, py = 0, sx = 0, sy = 0, kx = 0, ky = 0, k = 0, open = 1;
    const v = () => { let z = 0, m = 1, b = 0; do { b = A.indexOf(e.charAt(i++)); z += (b % 32) * m; m *= 32; } while (b > 31); return z % 2 ? -(z + 1) / 2 : z / 2; };
    if (e[1] === '~') {
      i = 2;
      const cx = f(v()), cy = f(v()), r = v(), w = f(2 * r + v()), a = f(r);
      return `M${cx} ${cy}a${a} ${a} 0 1 0 ${w} 0a${a} ${a} 0 1 0 -${w} 0Z`;
    }
    if (e[1] === '#') {
      i = 2;
      const n = v(), z = v(), qx = [0], qy = [0];
      for (let j = 0; j <= n; j++) { qx[j] = x = 2 * x - px + v(); qy[j] = y = 2 * y - py + v(); px = qx[j - 1] ?? 0; py = qy[j - 1] ?? 0; }
      const g = (j = 0) => z ? (j % n + n) % n : j < 0 ? 0 : j > n ? n : j, X = (j = 0) => qx[g(j)] ?? 0, Y = (j = 0) => qy[g(j)] ?? 0;
      out = `M${f(qx[0])} ${f(qy[0])}`;
      for (let j = 0; j < n; j++) {
        const c = [X(j) + (X(j + 1) - X(j - 1)) / 6, Y(j) + (Y(j + 1) - Y(j - 1)) / 6, X(j + 1) - (X(j + 2) - X(j)) / 6, Y(j + 1) - (Y(j + 2) - Y(j)) / 6];
        out += `C${c.map(c => f(Math.round(c) + v())).join(' ')} ${f(qx[j + 1])} ${f(qy[j + 1])}`;
      }
      return z ? out + 'Z' : out;
    }
    while (i < e.length) {
      const c = e.charAt(i++), n = [];
      if (c === 'Z') { x = px = sx; y = py = sy; k = 0; open = 1; out += c; continue; }
      while (i < e.length && !'MCLQZ'.includes(e.charAt(i))) {
        if (c === 'M') { px = x += v(); py = y += v(); if (open) { sx = x; sy = y; open = 0; } k = 0; n.push(x, y); continue; }
        const ex = 2 * x - px, ey = 2 * y - py;
        if (c === 'C') {
          const ax = (k ? 2 * x - kx : x) + v(), ay = (k ? 2 * y - ky : y) + v(), bx = 3 * ax - 2 * x + v(), by = 3 * ay - 2 * y + v();
          kx = Math.round(bx + (x - bx) / 3) + v(); ky = Math.round(by + (y - by) / 3) + v(); k = 1;
          n.push(ax, ay, kx, ky, bx, by); px = x; py = y; x = bx; y = by;
        } else {
          if (c === 'Q') n.push(x + v(), y + v());
          px = x; py = y; x = ex + v(); y = ey + v(); k = 0; n.push(x, y);
        }
      }
      out += c + n.map(f).join(' ');
    }
    return out;
  };
  return frags.map(s => s.replace(/ d="([^"]*)"/g, (_, d) => {
    const p = d[0] === '^' ? table[+d.slice(1)] : d[0] === '~' ? path(d) : d;
    if (d[0] !== '^') table.push(p);
    return ` d="${p}"`;
  }));
}

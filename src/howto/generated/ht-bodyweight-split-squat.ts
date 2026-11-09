// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=fdad2076e22c626abc4ba46a069cd25e6920bb60b8cd4cba001676a84f473e90
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_bodyweight_split_squat",
  name: "Bodyweight Split Squat",
  hashes: { inputsSha256: "fdad2076e22c626abc4ba46a069cd25e6920bb60b8cd4cba001676a84f473e90", golden: "b236382b5ca7b8f99bce1ab4d6fdabbf66cbb27a94ba41c8cb06b0f0b3fa0a63" },
  plate: (() => {
    // HT-11: the figure strings ship path-encoded; unpack (src/howto/delta.js, copied so the chunk imports nothing)
    // gives back their golden bytes once, at import.
    const unpack = function unpack(frags = [''], table = frags.slice(0, 0)) {
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
    };
    const [nSvg = '', nOverlay = '', mSvg = '', mOverlay = ''] = unpack([
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"bodyweight-split-squat-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"bodyweight-split-squat-n-st-thigh.l\" d=\"~#F12SDx1SDG1O-x1G.E1(3Ebx1jVq(Y1y9z4D4z2NrTK1YlIeS9-h0zq!m*O1f-4R1V9Xw1SV1A1iA7K9.lBpVD1Up*gUv3JN100000100000000002010100000000010100000000020010000210001210000010100010120001022\"/><path id=\"bodyweight-split-squat-n-st-kneecap.l\" d=\"~~!zsDAV1_J10\"/><path id=\"bodyweight-split-squat-n-st-shank.l\" d=\"~#F12yTsNwU1--tBBT1Faz6ouGK1(I1_9d_4bDR1VK1Af)2F9T7_5Ie(V1-E1H1T4D2T9OT1NA1rvw8.8EhK2KrP5Vg(dRa!p02000000000000101010010011000202000000101000001000210100000200110100210000000100\"/><path id=\"bodyweight-split-squat-n-st-foot.l\" d=\"~#o2DDkyS.1EGl.E.1Y6HbAiY6yz1D1Wx2y*1)S1V-1Kl-w1)g)g-w1*pA1xhHsPc*x1F2011101000100002000000001011000101201010002001001\"/><path id=\"bodyweight-split-squat-n-st-shcap.l\" d=\"~~_Py1P.swP10\"/><path id=\"bodyweight-split-squat-n-st-upper.l\" d=\"~#F12_Py1P.sXRy1XXrg)882J2SO1D3.5N1x3Y5KD1ya-i2Igza-iX5KD1K1x3B3.5I2SO172h)8zgvXdPp2PmUdPp02002012001000000001002000200120000110001010110000002000221000220000000000000020\"/><path id=\"bodyweight-split-squat-n-st-elbowcap.l\" d=\"~~U*y1ABD1Dz10\"/><path id=\"bodyweight-split-squat-n-st-fore.l\" d=\"~#F12A!y1WED1z*y1OIB1uIau_1N6yI1(2R9N1K2-1*w1!5BdnEbX7EcV2*w1-1z2E4z9bSI1j(1K2zazaiB9FkF1Dh!bYi00000000010111000000000000100001000000000012101001012100000000001110000020200120\"/><path id=\"bodyweight-split-squat-n-st-fist.l\" d=\"~~WWz1N*O1ww10\"/><path id=\"bodyweight-split-squat-n-st-head\" d=\"~#w12SRA1w!i*(y1XOizkDiXjS8)aX3K3U4I4E8I7TbKgGnN5Kcx1X9Bjvwn)9UmB5WkF4FiwhR2Aj2000200000000000000001000101111012000100000000100000001200002001\"/><path id=\"bodyweight-split-squat-n-st-torso\" d=\"~#_12W-y1FRnVBz1KzmE9.6E33Y8wiD9(6(bWgN68B5Eo.lB9zdA4Hg*3ylG5DnXeSiXgF5E9z7KgIpTA1X9VrG69V9hwcWgY2A8GcT8KgA7O7NkA6Y6HdRa_2D8-U2Ur00000000022000101000000001000000000010002002000002012000100101010000200000011101000021200001000000200010100000000200\"/><path id=\"bodyweight-split-squat-n-st-thigh.r\" d=\"~#F12yFx1!RI1)Jw1EIH1K7B9z1kYy1FU1F1X9c-4-oxO1vxqEaKhGmOdztRJ1I4*1z9X3_s_X1A1jK4xb.w1U5_1JN1HiwvSE1wo02000002101001002020001010000000000002010110001000000020000010100110120200111000\"/><path id=\"bodyweight-split-squat-n-st-kneecap.r\" d=\"~~HAF1W!U1_J10\"/><path id=\"bodyweight-split-squat-n-st-shank.r\" d=\"~#F12DDF1NNV1RXE1GxU1.2VbA1dUsHY1P2R9w1V4xtK!1S1IfR4xb)b-9zmG)1x4R2R8)4Ujw!1z1iE6GaG7Yf.2!rJ8ykUlYh20010100000000000010000000002000010000000000001010002000220100020010000200020002\"/><path id=\"bodyweight-split-squat-n-st-foot.r\" d=\"~#o2_HK1AB)1K!K1zB(1_cF3Uhx8Up)nS-2B3-J2-4ID1)7xo2OG1Y4Eb-cYsBbGmSp120002012120000111001000101200002101101000010110\"/><path id=\"bodyweight-split-squat-n-st-shcap.r\" d=\"^4\"/><path id=\"bodyweight-split-squat-n-st-upper.r\" d=\"^5\"/><path id=\"bodyweight-split-squat-n-st-elbowcap.r\" d=\"^6\"/><path id=\"bodyweight-split-squat-n-st-fore.r\" d=\"^7\"/><path id=\"bodyweight-split-squat-n-st-fist.r\" d=\"^8\"/><path id=\"bodyweight-split-squat-n-g0-thigh.l\" d=\"~#F12Pwx1FFK1)Gx1x_I1P1XbB1bzeD*1!7.5Y3*2FhIS1HiTiU5IjK5OpJc-T1R1O4R3B9XkF.1A1cy5-aVq)jKw1yx1xaSy1W9JK111100000010000001002000001000000020210110110021000200210020000000210101000020001\"/><path id=\"bodyweight-split-squat-n-g0-kneecap.l\" d=\"~~yPuyW-1_J10\"/><path id=\"bodyweight-split-squat-n-g0-shank.l\" d=\"~#F12NPvHGY1*(w1GwY1!bI1aD1I.1PlA9W3U4S1P)1OlyfJ3Pbz3FbXaPx2Gey3V3w6.7)*1DcbE1(a.4VeE9Grz6*k_5EkHj00000200000010001001210002101012000001001110100010110110010020002002200000000000\"/><path id=\"bodyweight-split-squat-n-g0-foot.l\" d=\"^3\"/><path id=\"bodyweight-split-squat-n-g0-head\" d=\"~#w12SRA1WNm*(y1KymzkDiXjS8)aX3K3U4I4E8I7TbKgEnN5Rcx1V9BjtwnxaUmE5WkJ4Fi(gR2yj2000200000000000000000000002101010000000000000110000001001002100\"/><path id=\"bodyweight-split-squat-n-g0-torso\" d=\"~#_12W-y1(zrVBz1xWpE9*6E35Y8AiD9!6(bUgN6cB5Io.lx9zdy4Hg*3ylG5Dn-eSiTgF5I9z7IgIpRA1X9XrG6bV9fwcWgY2A8GcT8KgA7O7NkA6Y6HdOa_2A8-U2Sr02000000002000101101000000000100000010012100000000002000100000000000210001001000000020200200000000200210100000010000\"/><path id=\"bodyweight-split-squat-n-g0-thigh.r\" d=\"~#F12JAy1NwP1T-w1OJO1xbE4lA1HY1!r.3x9x2G4*J1Ks*dxmTh*9xqjOO1*nX4cX9J1_U1(x1mx1I9K7VpJl_oFE1DvUhNN1A112000002000000002000000000000000021010000000010022000020000111120000001100002210\"/><path id=\"bodyweight-split-squat-n-g0-kneecap.r\" d=\"~~NSJ1((T1_J10\"/><path id=\"bodyweight-split-squat-n-g0-shank.r\" d=\"~#F12!PJ1!)T1TTJ1RPS1S1.bF10D6_(1_5*7U2x4z5-y2w7-d7*bR7OdH2)y2.2*3x6V7R3y)1E10z2XbOc(bXc(ogYlYdJo10101000000110021010000000000020002100000001010000000000001000012120000002000012\"/><path id=\"bodyweight-split-squat-n-g0-foot.r\" d=\"~#o2_HK1DB)1K!K1EB(1_cH3Uhx8Up)nS-2B3-J2-4ID1)7xo2OG1Y4Eb-cYsBbGmUp100002012120000111001000101200002101101000000011\"/><path id=\"bodyweight-split-squat-n-g0-shcap.r\" d=\"~~_Py1FNw1wP10\"/><path id=\"bodyweight-split-squat-n-g0-upper.r\" d=\"~#F12_Py1FNw1XRy1RHvg.881J2WO1D3)5N1)2Y5KD1yaXi2OgzaXiX5KD1K1)2B3)5I2WO171h.8zgx1XdPp2PmUdPp00022010001200000000002000200020000010001010100000002200201002200000000000000020\"/><path id=\"bodyweight-split-squat-n-g0-elbowcap.r\" d=\"~~U*y1_XG1Dz10\"/><path id=\"bodyweight-split-squat-n-g0-fore.r\" d=\"~#F12A!y1N_G1z*y1G(F1uGau_1N6yI1(2O9N1O2-1*w1!5EdnBbX7EcV2.w1-1E2E4x9bSI1j(1K2zazaiB9FkF1Dh!b_i01000000000111000000010101110000000200000010111100012002000000001010000020200021\"/><path id=\"bodyweight-split-squat-n-g0-fist.r\" d=\"~~WWz1DPT1ww10\"/><path id=\"bodyweight-split-squat-n-g1-thigh.l\" d=\"~#F12Y)w1W*P1REx1zOO1A1.bB19.bW*1W7z6S3B3Nf.S1ShIj!4OjI6IpPazU1X1O4*3x9Riy!1D18W4)aKr*iEvFy1V8!y1Jb(J100002100000000000011000000000100100100200000110110000001000020121000010000200000\"/><path id=\"bodyweight-split-squat-n-g1-kneecap.l\" d=\"~~D(uSJ*1_J10\"/><path id=\"bodyweight-split-squat-n-g1-shank.l\" d=\"~#F12SJw1D(.1T.x1Rz!1WbF20F1x)1Y2U7D6_3(2Az2R1Hd_7wcc!d-6Yy2w6y4T2y8V5X(1)62E1_bK1EbBdBoxeXlnxpNc00100202200000100000000100101000000000100200000000012001000110100000001000000000\"/><path id=\"bodyweight-split-squat-n-g1-foot.l\" d=\"~#o2DDkyS.1EGl.E.1Y6HbAiY6yz1D1Wx2y*1)S1V-1Kl-w1)g)g-w1*pA1xhHsPc*x1F2011101002100002000000001011000101201010002101001\"/><path id=\"bodyweight-split-squat-n-g1-head\" d=\"~#w12SRA1Jxq*(y1xVpzkyiXjW8)a-3K3S4I4B8I7RbKgInN5Ocx1T9Bjx1wn)9UmB5WkF4FiwhR2yj2000210002000001000000020000111010000001010000100000001000002000\"/><path id=\"bodyweight-split-squat-n-g1-torso\" d=\"~#_12W-y1WWuVBz1.FtE9.6E35Y8AiD9!6(bUgN6cB5Go.lB9zdA4Hg*3ylG5Dn-eSiTgF5I9z7IgIpRA1X9XrG6bV9dwcUgY2A8GcT8KgA7O7NkA6Y6HdRa_2D8-U2Ur00000000002000121000000200000001010010002000000000002200100002000002200000001000010021210001000000210011100000000000\"/><path id=\"bodyweight-split-squat-n-g1-thigh.r\" d=\"~#F12S_y1S.T1XIx1VVT1.bh7D1y(1N9I6K7G3O3RT1Id*jXgXjz4xpJ7RU1G8I4_1.8H4U!1DgaE1zbz4)hysUz1!tAz1H7PJ1zd10000000001210000000000010002000200010000000000002001000200002001022000000000011\"/><path id=\"bodyweight-split-squat-n-g1-kneecap.r\" d=\"~~D*K1JwU1_J10\"/><path id=\"bodyweight-split-squat-n-g1-shank.r\" d=\"~#F12Y.K1H!T1TzN1TKS1!2RbD14jy)1U6E7A3V3y2xz2P8.cw1)b)5BeP9Gy2I2E4E5G8GaH(1G13n*bXdPaKfNn-1WlwbWp00200212100100000000000010000010010000100000200000000010100100010010100000010100\"/><path id=\"bodyweight-split-squat-n-g1-foot.r\" d=\"~#o2_HK1DB)1K!K1EB(1_cF3Uh*7UpxoS-2B3-J2-4ID1)7xo0OG1_4EbXcYsEbGmUp100002002021000111001000101000002000121000000011\"/><path id=\"bodyweight-split-squat-n-g1-shcap.r\" d=\"~~_Py1(wA1wP10\"/><path id=\"bodyweight-split-squat-n-g1-upper.r\" d=\"~#F12_Py1(wA1XRy1B*y1g)882J2SO1D3*5N1*2Y5RD1yaVi2OgzaViX5RD1K1*2B3*5I2SO172h)8zgvXdPp2PmUdPp02002110001000000000002101200020000010011110100000002000201100220000000000000020\"/><path id=\"bodyweight-split-squat-n-g1-elbowcap.r\" d=\"~~U*y1SHK1Dz10\"/><path id=\"bodyweight-split-squat-n-g1-fore.r\" d=\"~#F12A!y1AKK1z*y1*PJ1uKau!1N6AI1(2T9N1K2-1*w1!5EdnzbX7GcV2*w1-1B2E4x9bUI1j!1K2zazagB9HkF1Dh!b_i01010102000210000000000000100000020001010010101000022000000000011012000220220020\"/><path id=\"bodyweight-split-squat-n-g1-fist.r\" d=\"~~WWz1!yX1ww10\"/><path id=\"bodyweight-split-squat-n-e-thigh.l\" d=\"~#F12_wx1UJU1)Hx1R(S1Y1XbB1bxfw*1y8-5W3.2yizS1NiGiw6IjB5RpDdRT1O1R4K3B9Tl!_1A1cF5VaKqIk.w1Uw1OaJy1w9PK101002000001010000012000020121020000010002000000000000100102000020000000000100001\"/><path id=\"bodyweight-split-squat-n-e-kneecap.l\" d=\"~~!Hu!-w2_J10\"/><path id=\"bodyweight-split-squat-n-e-shank.l\" d=\"~#F12ADw1_K)1.Rx1zww2WaN5bD1I*1)eW5A8_2!3_w2FhWaDbJbY3FfV2N(1NoU4K1H9E3G_1BocB1_b(1z7XfGjIkVkV6Or!401002020010000000000001011010000022002000001010000020000020022200200001010200000\"/><path id=\"bodyweight-split-squat-n-e-foot.l\" d=\"~#o2DDkyS.1EGl.E.1Y6HbAiY6yz1D1Wx2y*1)S1V-1Kl-w1)g)g-w1*pA1xhHsPc*x1F2011101002100002000000001010000101001010002101001\"/><path id=\"bodyweight-split-squat-n-e-shcap.l\" d=\"~~_Py1WTE1wP10\"/><path id=\"bodyweight-split-squat-n-e-upper.l\" d=\"~#F12_Py1WTE1XRy1)OD1g.881J2UO1D3.5N1x3Y5KD1ya-i2Igza-iX5KD1K1x3B3.5I2UO171h.8zgz1XdUp2JmUdUp00002010011000020000002000200020000010001010100002002001201000200100000000000021\"/><path id=\"bodyweight-split-squat-n-e-elbowcap.l\" d=\"~~U*y1F*P1Dz10\"/><path id=\"bodyweight-split-squat-n-e-fore.l\" d=\"~#F12A!y1_)P1z*y1TzP1uIau_1N6yI1(2R9N1K2-1*w1!5BdnEbX7EcV2.w1-1E2E4x9bSI1j(1K2zazaiB9FkF1Dh!bYi00000000000111000000000000100000000000000010111101012100000000001010000020200120\"/><path id=\"bodyweight-split-squat-n-e-fist.l\" d=\"~~WWz1SV_1ww10\"/><path id=\"bodyweight-split-squat-n-e-head\" d=\"~#w12SRA1AUt*(y1.EtzkDiXjS8)aX3K3U4I4E8I7TbKgEnN5Rcx1V9Bjvwn*9UmG5WkH4FiwhR2Aj2000200000000000000001000100101110000000020002110100001200002000\"/><path id=\"bodyweight-split-squat-n-e-torso\" d=\"~#_12W-y1JGy1VBz1R.w1E9.6E33Y8wiD9(6(bWgN68B5Eo.lB9zdD4Hgx4ylB5Dn.eSiVgF5E9z7KgIpTA1X9VrG69V9hwcWgY2A8GcT8KgA7O7NkA6Y6HdRa_2D8-U2Ur00000200022000101000000001020000000010012102000100012000100101000000200200011100000020200000000000200010100200000200\"/><path id=\"bodyweight-split-squat-n-e-thigh.r\" d=\"~#F12!Pz1SOX1Gyy1IXX1Tb_26F1A(1.8G8G5z4I2BV1y2*nEaBkW1-lHeVU1A7V3A3G7S6Y(1*11E1.bp)8Aw1SH1HiYz1z3!D1Kp02100022000002010100200002000201010000000002000111001001000000000000100110210000\"/><path id=\"bodyweight-split-squat-n-e-kneecap.r\" d=\"~~(zN1AxU1_J10\"/><path id=\"bodyweight-split-squat-n-e-shank.r\" d=\"~#F12UyN1F!T1GIN1VKS1y3RbD14V1A)1Y6B7A3T3H3)y2W8XcF1*b.5GeYazy2G2E4z5K8KbA(1E15h*b*dHaXfAnG2UlUa(p00010100002200000000000001000010000000020010100010101001010000022000000002000000\"/><path id=\"bodyweight-split-squat-n-e-foot.r\" d=\"~#o2_HK1DB)1K!K1EB(1_cF3Uh)7Up)nS-2B3-J2X4ID1x8xo0OG1_4EbXcYsEbGmUp100002002220000010001200101000002000121000000011\"/><path id=\"bodyweight-split-squat-n-e-shcap.r\" d=\"^48\"/><path id=\"bodyweight-split-squat-n-e-upper.r\" d=\"^49\"/><path id=\"bodyweight-split-squat-n-e-elbowcap.r\" d=\"^50\"/><path id=\"bodyweight-split-squat-n-e-fore.r\" d=\"^51\"/><path id=\"bodyweight-split-squat-n-e-fist.r\" d=\"^52\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#bodyweight-split-squat-n-dots)\"/>\n  <path class=\"floorline\" d=\"M57.83 339.5H306.51\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-n-st-thigh.l\"/><use href=\"#bodyweight-split-squat-n-st-kneecap.l\"/><use href=\"#bodyweight-split-squat-n-st-shank.l\"/><use href=\"#bodyweight-split-squat-n-st-foot.l\"/><use href=\"#bodyweight-split-squat-n-st-shcap.l\"/><use href=\"#bodyweight-split-squat-n-st-upper.l\"/><use href=\"#bodyweight-split-squat-n-st-elbowcap.l\"/><use href=\"#bodyweight-split-squat-n-st-fore.l\"/><use href=\"#bodyweight-split-squat-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-n-st-thigh.l\"/><use href=\"#bodyweight-split-squat-n-st-kneecap.l\"/><use href=\"#bodyweight-split-squat-n-st-shank.l\"/><use href=\"#bodyweight-split-squat-n-st-foot.l\"/><use href=\"#bodyweight-split-squat-n-st-shcap.l\"/><use href=\"#bodyweight-split-squat-n-st-upper.l\"/><use href=\"#bodyweight-split-squat-n-st-elbowcap.l\"/><use href=\"#bodyweight-split-squat-n-st-fore.l\"/><use href=\"#bodyweight-split-squat-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-n-st-head\"/><use href=\"#bodyweight-split-squat-n-st-torso\"/><use href=\"#bodyweight-split-squat-n-st-thigh.r\"/><use href=\"#bodyweight-split-squat-n-st-kneecap.r\"/><use href=\"#bodyweight-split-squat-n-st-shank.r\"/><use href=\"#bodyweight-split-squat-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-n-st-head\"/><use href=\"#bodyweight-split-squat-n-st-torso\"/><use href=\"#bodyweight-split-squat-n-st-thigh.r\"/><use href=\"#bodyweight-split-squat-n-st-kneecap.r\"/><use href=\"#bodyweight-split-squat-n-st-shank.r\"/><use href=\"#bodyweight-split-squat-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-n-st-shcap.r\"/><use href=\"#bodyweight-split-squat-n-st-upper.r\"/><use href=\"#bodyweight-split-squat-n-st-elbowcap.r\"/><use href=\"#bodyweight-split-squat-n-st-fore.r\"/><use href=\"#bodyweight-split-squat-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-n-st-shcap.r\"/><use href=\"#bodyweight-split-squat-n-st-upper.r\"/><use href=\"#bodyweight-split-squat-n-st-elbowcap.r\"/><use href=\"#bodyweight-split-squat-n-st-fore.r\"/><use href=\"#bodyweight-split-squat-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-n-g0-thigh.l\"/><use href=\"#bodyweight-split-squat-n-g0-kneecap.l\"/><use href=\"#bodyweight-split-squat-n-g0-shank.l\"/><use href=\"#bodyweight-split-squat-n-g0-foot.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-n-g0-thigh.l\"/><use href=\"#bodyweight-split-squat-n-g0-kneecap.l\"/><use href=\"#bodyweight-split-squat-n-g0-shank.l\"/><use href=\"#bodyweight-split-squat-n-g0-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-n-g0-head\"/><use href=\"#bodyweight-split-squat-n-g0-torso\"/><use href=\"#bodyweight-split-squat-n-g0-thigh.r\"/><use href=\"#bodyweight-split-squat-n-g0-kneecap.r\"/><use href=\"#bodyweight-split-squat-n-g0-shank.r\"/><use href=\"#bodyweight-split-squat-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-n-g0-head\"/><use href=\"#bodyweight-split-squat-n-g0-torso\"/><use href=\"#bodyweight-split-squat-n-g0-thigh.r\"/><use href=\"#bodyweight-split-squat-n-g0-kneecap.r\"/><use href=\"#bodyweight-split-squat-n-g0-shank.r\"/><use href=\"#bodyweight-split-squat-n-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-n-g0-shcap.r\"/><use href=\"#bodyweight-split-squat-n-g0-upper.r\"/><use href=\"#bodyweight-split-squat-n-g0-elbowcap.r\"/><use href=\"#bodyweight-split-squat-n-g0-fore.r\"/><use href=\"#bodyweight-split-squat-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-n-g0-shcap.r\"/><use href=\"#bodyweight-split-squat-n-g0-upper.r\"/><use href=\"#bodyweight-split-squat-n-g0-elbowcap.r\"/><use href=\"#bodyweight-split-squat-n-g0-fore.r\"/><use href=\"#bodyweight-split-squat-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-n-g1-thigh.l\"/><use href=\"#bodyweight-split-squat-n-g1-kneecap.l\"/><use href=\"#bodyweight-split-squat-n-g1-shank.l\"/><use href=\"#bodyweight-split-squat-n-g1-foot.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-n-g1-thigh.l\"/><use href=\"#bodyweight-split-squat-n-g1-kneecap.l\"/><use href=\"#bodyweight-split-squat-n-g1-shank.l\"/><use href=\"#bodyweight-split-squat-n-g1-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-n-g1-head\"/><use href=\"#bodyweight-split-squat-n-g1-torso\"/><use href=\"#bodyweight-split-squat-n-g1-thigh.r\"/><use href=\"#bodyweight-split-squat-n-g1-kneecap.r\"/><use href=\"#bodyweight-split-squat-n-g1-shank.r\"/><use href=\"#bodyweight-split-squat-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-n-g1-head\"/><use href=\"#bodyweight-split-squat-n-g1-torso\"/><use href=\"#bodyweight-split-squat-n-g1-thigh.r\"/><use href=\"#bodyweight-split-squat-n-g1-kneecap.r\"/><use href=\"#bodyweight-split-squat-n-g1-shank.r\"/><use href=\"#bodyweight-split-squat-n-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-n-g1-shcap.r\"/><use href=\"#bodyweight-split-squat-n-g1-upper.r\"/><use href=\"#bodyweight-split-squat-n-g1-elbowcap.r\"/><use href=\"#bodyweight-split-squat-n-g1-fore.r\"/><use href=\"#bodyweight-split-squat-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-n-g1-shcap.r\"/><use href=\"#bodyweight-split-squat-n-g1-upper.r\"/><use href=\"#bodyweight-split-squat-n-g1-elbowcap.r\"/><use href=\"#bodyweight-split-squat-n-g1-fore.r\"/><use href=\"#bodyweight-split-squat-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-n-e-thigh.l\"/><use href=\"#bodyweight-split-squat-n-e-kneecap.l\"/><use href=\"#bodyweight-split-squat-n-e-shank.l\"/><use href=\"#bodyweight-split-squat-n-e-foot.l\"/><use href=\"#bodyweight-split-squat-n-e-shcap.l\"/><use href=\"#bodyweight-split-squat-n-e-upper.l\"/><use href=\"#bodyweight-split-squat-n-e-elbowcap.l\"/><use href=\"#bodyweight-split-squat-n-e-fore.l\"/><use href=\"#bodyweight-split-squat-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-n-e-thigh.l\"/><use href=\"#bodyweight-split-squat-n-e-kneecap.l\"/><use href=\"#bodyweight-split-squat-n-e-shank.l\"/><use href=\"#bodyweight-split-squat-n-e-foot.l\"/><use href=\"#bodyweight-split-squat-n-e-shcap.l\"/><use href=\"#bodyweight-split-squat-n-e-upper.l\"/><use href=\"#bodyweight-split-squat-n-e-elbowcap.l\"/><use href=\"#bodyweight-split-squat-n-e-fore.l\"/><use href=\"#bodyweight-split-squat-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-n-e-head\"/><use href=\"#bodyweight-split-squat-n-e-torso\"/><use href=\"#bodyweight-split-squat-n-e-thigh.r\"/><use href=\"#bodyweight-split-squat-n-e-kneecap.r\"/><use href=\"#bodyweight-split-squat-n-e-shank.r\"/><use href=\"#bodyweight-split-squat-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-n-e-head\"/><use href=\"#bodyweight-split-squat-n-e-torso\"/><use href=\"#bodyweight-split-squat-n-e-thigh.r\"/><use href=\"#bodyweight-split-squat-n-e-kneecap.r\"/><use href=\"#bodyweight-split-squat-n-e-shank.r\"/><use href=\"#bodyweight-split-squat-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-n-e-shcap.r\"/><use href=\"#bodyweight-split-squat-n-e-upper.r\"/><use href=\"#bodyweight-split-squat-n-e-elbowcap.r\"/><use href=\"#bodyweight-split-squat-n-e-fore.r\"/><use href=\"#bodyweight-split-squat-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-n-e-shcap.r\"/><use href=\"#bodyweight-split-squat-n-e-upper.r\"/><use href=\"#bodyweight-split-squat-n-e-elbowcap.r\"/><use href=\"#bodyweight-split-squat-n-e-fore.r\"/><use href=\"#bodyweight-split-squat-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"184.45\" cy=\"202.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"184.45\" cy=\"250.44\" r=\"2.25\"/><circle class=\"joint\" cx=\"180.84\" cy=\"271.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"243.32\" cy=\"266.42\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#Y10FHz1NIJ1EHz1EAJ10000010200010200000102000102000001020001020001020000010200000000010000020000010000020000000001000000000001000002000000000100000000000100000200000000000200000000010000\"/><path class=\"arrow\" d=\"~MFHz1W-T1LXiOB1LFY1PB1Z\"/><path data-guide=\"shin\" style=\"display:none\" class=\"lead-guide\" d=\"~MUEN1YDy2L0RTh\"/></g><path class=\"leader\" d=\"~MWPE1P-E1LyW1X4\"/><circle class=\"anchor\" cx=\"202.35\" cy=\"203.76\" r=\"1.5\"/><path class=\"leader\" d=\"~MwHP1DR-1LYF2V3\"/><circle class=\"anchor\" cx=\"247.36\" cy=\"294.59\" r=\"1.5\"/><path class=\"leader\" d=\"M162.5 331.82L125.71 274H115.71\"/><circle class=\"anchor\" cx=\"162.5\" cy=\"331.82\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"bodyweight-split-squat-n-trunk\" data-key=\"trunk\" data-cue=\"Keep the trunk upright.\" class=\"plate-callout\" style=\"left:57.54%;top:50.56%\" aria-pressed=\"true\">Trunk upright</button><button type=\"button\" id=\"bodyweight-split-squat-n-shin\" data-key=\"shin\" data-cue=\"At the bottom, keep the front shin about vertical.\" class=\"plate-callout two\" style=\"left:70.95%;top:75.98%\" aria-pressed=\"false\">Front shin<br>vertical</button><button type=\"button\" id=\"bodyweight-split-squat-n-knee\" data-key=\"knee\" data-cue=\"Lower until the back knee lightly touches the floor.\" class=\"plate-callout two\" style=\"left:11.17%;top:70.39%\" aria-pressed=\"false\">Back knee<br>down</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"bodyweight-split-squat-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"bodyweight-split-squat-m-st-thigh.l\" d=\"^0\"/><path id=\"bodyweight-split-squat-m-st-kneecap.l\" d=\"^1\"/><path id=\"bodyweight-split-squat-m-st-shank.l\" d=\"^2\"/><path id=\"bodyweight-split-squat-m-st-foot.l\" d=\"^3\"/><path id=\"bodyweight-split-squat-m-st-shcap.l\" d=\"^4\"/><path id=\"bodyweight-split-squat-m-st-upper.l\" d=\"^5\"/><path id=\"bodyweight-split-squat-m-st-elbowcap.l\" d=\"^6\"/><path id=\"bodyweight-split-squat-m-st-fore.l\" d=\"^7\"/><path id=\"bodyweight-split-squat-m-st-fist.l\" d=\"^8\"/><path id=\"bodyweight-split-squat-m-st-head\" d=\"^9\"/><path id=\"bodyweight-split-squat-m-st-torso\" d=\"^10\"/><path id=\"bodyweight-split-squat-m-st-thigh.r\" d=\"^11\"/><path id=\"bodyweight-split-squat-m-st-kneecap.r\" d=\"^12\"/><path id=\"bodyweight-split-squat-m-st-shank.r\" d=\"^13\"/><path id=\"bodyweight-split-squat-m-st-foot.r\" d=\"^14\"/><path id=\"bodyweight-split-squat-m-st-shcap.r\" d=\"^4\"/><path id=\"bodyweight-split-squat-m-st-upper.r\" d=\"^5\"/><path id=\"bodyweight-split-squat-m-st-elbowcap.r\" d=\"^6\"/><path id=\"bodyweight-split-squat-m-st-fore.r\" d=\"^7\"/><path id=\"bodyweight-split-squat-m-st-fist.r\" d=\"^8\"/><path id=\"bodyweight-split-squat-m-g0-thigh.l\" d=\"^15\"/><path id=\"bodyweight-split-squat-m-g0-kneecap.l\" d=\"^16\"/><path id=\"bodyweight-split-squat-m-g0-shank.l\" d=\"^17\"/><path id=\"bodyweight-split-squat-m-g0-foot.l\" d=\"^3\"/><path id=\"bodyweight-split-squat-m-g0-head\" d=\"^18\"/><path id=\"bodyweight-split-squat-m-g0-torso\" d=\"^19\"/><path id=\"bodyweight-split-squat-m-g0-thigh.r\" d=\"^20\"/><path id=\"bodyweight-split-squat-m-g0-kneecap.r\" d=\"^21\"/><path id=\"bodyweight-split-squat-m-g0-shank.r\" d=\"^22\"/><path id=\"bodyweight-split-squat-m-g0-foot.r\" d=\"^23\"/><path id=\"bodyweight-split-squat-m-g0-shcap.r\" d=\"^24\"/><path id=\"bodyweight-split-squat-m-g0-upper.r\" d=\"^25\"/><path id=\"bodyweight-split-squat-m-g0-elbowcap.r\" d=\"^26\"/><path id=\"bodyweight-split-squat-m-g0-fore.r\" d=\"^27\"/><path id=\"bodyweight-split-squat-m-g0-fist.r\" d=\"^28\"/><path id=\"bodyweight-split-squat-m-g1-thigh.l\" d=\"^29\"/><path id=\"bodyweight-split-squat-m-g1-kneecap.l\" d=\"^30\"/><path id=\"bodyweight-split-squat-m-g1-shank.l\" d=\"^31\"/><path id=\"bodyweight-split-squat-m-g1-foot.l\" d=\"^32\"/><path id=\"bodyweight-split-squat-m-g1-head\" d=\"^33\"/><path id=\"bodyweight-split-squat-m-g1-torso\" d=\"^34\"/><path id=\"bodyweight-split-squat-m-g1-thigh.r\" d=\"^35\"/><path id=\"bodyweight-split-squat-m-g1-kneecap.r\" d=\"^36\"/><path id=\"bodyweight-split-squat-m-g1-shank.r\" d=\"^37\"/><path id=\"bodyweight-split-squat-m-g1-foot.r\" d=\"^38\"/><path id=\"bodyweight-split-squat-m-g1-shcap.r\" d=\"^39\"/><path id=\"bodyweight-split-squat-m-g1-upper.r\" d=\"^40\"/><path id=\"bodyweight-split-squat-m-g1-elbowcap.r\" d=\"^41\"/><path id=\"bodyweight-split-squat-m-g1-fore.r\" d=\"^42\"/><path id=\"bodyweight-split-squat-m-g1-fist.r\" d=\"^43\"/><path id=\"bodyweight-split-squat-m-e-thigh.l\" d=\"^44\"/><path id=\"bodyweight-split-squat-m-e-kneecap.l\" d=\"^45\"/><path id=\"bodyweight-split-squat-m-e-shank.l\" d=\"^46\"/><path id=\"bodyweight-split-squat-m-e-foot.l\" d=\"^47\"/><path id=\"bodyweight-split-squat-m-e-shcap.l\" d=\"^48\"/><path id=\"bodyweight-split-squat-m-e-upper.l\" d=\"^49\"/><path id=\"bodyweight-split-squat-m-e-elbowcap.l\" d=\"^50\"/><path id=\"bodyweight-split-squat-m-e-fore.l\" d=\"^51\"/><path id=\"bodyweight-split-squat-m-e-fist.l\" d=\"^52\"/><path id=\"bodyweight-split-squat-m-e-head\" d=\"^53\"/><path id=\"bodyweight-split-squat-m-e-torso\" d=\"^54\"/><path id=\"bodyweight-split-squat-m-e-thigh.r\" d=\"^55\"/><path id=\"bodyweight-split-squat-m-e-kneecap.r\" d=\"^56\"/><path id=\"bodyweight-split-squat-m-e-shank.r\" d=\"^57\"/><path id=\"bodyweight-split-squat-m-e-foot.r\" d=\"^58\"/><path id=\"bodyweight-split-squat-m-e-shcap.r\" d=\"^48\"/><path id=\"bodyweight-split-squat-m-e-upper.r\" d=\"^49\"/><path id=\"bodyweight-split-squat-m-e-elbowcap.r\" d=\"^50\"/><path id=\"bodyweight-split-squat-m-e-fore.r\" d=\"^51\"/><path id=\"bodyweight-split-squat-m-e-fist.r\" d=\"^52\"/><path id=\"bodyweight-split-squat-m-m-head\" d=\"~#w12DEG1AUtRUE1.EtBkDiTjS8xbX3K3U4I4E8K7TbIgEnP5Rcz1V9Bjv(m*9YmG5SkH4JiwhT2Aj0000000000000010100011100100002100100010021002010110100220000000\"/><path id=\"bodyweight-split-squat-m-m-torso\" d=\"~#_12HOE1JGy1G.E1R.w1G9.6z33U8wiH9(6!bWgN68B5Eo*lB9)cD4Fgx4ylB5Dn.ePiVgJ5E9E7KgEpTA1-9VrI69R9h(bWgY2A8GcT8KgA7O7NkA6Y6HdRaY2D8VU2Ur00100200020000000000100001120000002000010102100100010020000111000010100220010100000000000000001000200010101200200200\"/><path id=\"bodyweight-split-squat-m-m-thigh.l\" d=\"~#F12JAD1PST1E)D1VIS1y6Gatn)A1_S1S9I2U4E1Sz1RE1Ao*9YcVfw5TpWvXH1aX4a.9GH1JN1uo!8.7Vg*s.H1_hXmYr-8UK111010100000000100100001000100000110001010000010001200000012200010100000100000010\"/><path id=\"bodyweight-split-squat-m-m-kneecap.l\" d=\"~~y.uSS(1_J10\"/><path id=\"bodyweight-split-squat-m-m-shank.l\" d=\"~#F12(Kw1SA*1G!x1KN*1PbJ33D1z)1I3y7(6S3F3!y2w5Pcy9(bP1NeK5(x2NcF4B2S8*4-*1)c6E1(b9.9ze-mKgOl-2Bq(900002021010001010001000110100000000100000010011111101000010101000001110000101210\"/><path id=\"bodyweight-split-squat-m-m-foot.l\" d=\"~#o2DDkyS.1EGl.E.1Y6HbAiY6yz1D1Wx2y*1)S1V-1Kl-w1)g)g-w1*pA1xhHsPc*x1F2011101000100002000000001011000101201010002101001\"/><path id=\"bodyweight-split-squat-m-m-shcap.l\" d=\"~~NDE1WTE1wP10\"/><path id=\"bodyweight-split-squat-m-m-upper.l\" d=\"~#F12NDE1WTE1IEE1)OD1e.8c1H2UO1D3.5N1x3Y5KD1ya-i0Igxa-iV5KD1R1x3x3.5K2UO191d.8Bgz1XdUp2JmUdUp00000000211010020010100000000000000000200010100022101001000000000100000000000001\"/><path id=\"bodyweight-split-squat-m-m-elbowcap.l\" d=\"~~FTE1F*P1Dz10\"/><path id=\"bodyweight-split-squat-m-m-fore.l\" d=\"~#F12YRE1_)P1-SE1TzP1y1Iaq_1S6yI1!2R9N1K2.1*w1w6BdpEbX7EcX2.w1X1E2B4x9dSI1j(1K2zaBaix9FkD1Dh!bYi10000010000101000010101000000000001000000000210101010100001000101000200000000110\"/><path id=\"bodyweight-split-squat-m-m-fist.l\" d=\"~~HJF1SV_1ww10\"/><path id=\"bodyweight-split-squat-m-m-thigh.r\" d=\"~#F12A*E1_OX1)KD1.RX1XbJ13D1_(1B1R7E6.3.2)U1K4RmBdBkjInNbEV1m)3U2)7W5P(1W52E1VbE2.c_uwF1HnwA1F1SG1Kk00000111011000220000000001000000200001000000000000110100000000001001012000101000\"/><path id=\"bodyweight-split-squat-m-m-kneecap.r\" d=\"~~__S1(PV1_J10\"/><path id=\"bodyweight-split-squat-m-m-shank.r\" d=\"~#F12y)S1H_U1I-T1*ST1J7K9y1kOqH-1y9*3H4x2NtG!1wdG8_5KaaOf(z1RY1fX4I1-9*y1SU1z1jF4Bb*g(3TnAfTa(idws00002100100000101000000000100010100000000000000000010000010020101012000101000121\"/><path id=\"bodyweight-split-squat-m-m-shcap.r\" d=\"^72\"/><path id=\"bodyweight-split-squat-m-m-upper.r\" d=\"^73\"/><path id=\"bodyweight-split-squat-m-m-elbowcap.r\" d=\"^74\"/><path id=\"bodyweight-split-squat-m-m-fore.r\" d=\"^75\"/><path id=\"bodyweight-split-squat-m-m-fist.r\" d=\"^76\"/><path id=\"bodyweight-split-squat-m-mf-foot.r\" d=\"^58\"/><path id=\"bodyweight-split-squat-m-mo-0\" d=\"^53\"/><path id=\"bodyweight-split-squat-m-mo-1\" d=\"^54\"/><path id=\"bodyweight-split-squat-m-mo-2\" d=\"^44\"/><path id=\"bodyweight-split-squat-m-mo-3\" d=\"^45\"/><path id=\"bodyweight-split-squat-m-mo-4\" d=\"^46\"/><path id=\"bodyweight-split-squat-m-mo-5\" d=\"^47\"/><path id=\"bodyweight-split-squat-m-mo-6\" d=\"^48\"/><path id=\"bodyweight-split-squat-m-mo-7\" d=\"^49\"/><path id=\"bodyweight-split-squat-m-mo-8\" d=\"^50\"/><path id=\"bodyweight-split-squat-m-mo-9\" d=\"^51\"/><path id=\"bodyweight-split-squat-m-mo-10\" d=\"^52\"/><path id=\"bodyweight-split-squat-m-mo-11\" d=\"^55\"/><path id=\"bodyweight-split-squat-m-mo-12\" d=\"^56\"/><path id=\"bodyweight-split-squat-m-mo-13\" d=\"^57\"/><path id=\"bodyweight-split-squat-m-mo-14\" d=\"^58\"/><path id=\"bodyweight-split-squat-m-mo-15\" d=\"^48\"/><path id=\"bodyweight-split-squat-m-mo-16\" d=\"^49\"/><path id=\"bodyweight-split-squat-m-mo-17\" d=\"^50\"/><path id=\"bodyweight-split-squat-m-mo-18\" d=\"^51\"/><path id=\"bodyweight-split-squat-m-mo-19\" d=\"^52\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#bodyweight-split-squat-m-dots)\"/>\n  <path class=\"floorline\" d=\"^59\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-m-st-thigh.l\"/><use href=\"#bodyweight-split-squat-m-st-kneecap.l\"/><use href=\"#bodyweight-split-squat-m-st-shank.l\"/><use href=\"#bodyweight-split-squat-m-st-foot.l\"/><use href=\"#bodyweight-split-squat-m-st-shcap.l\"/><use href=\"#bodyweight-split-squat-m-st-upper.l\"/><use href=\"#bodyweight-split-squat-m-st-elbowcap.l\"/><use href=\"#bodyweight-split-squat-m-st-fore.l\"/><use href=\"#bodyweight-split-squat-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-m-st-thigh.l\"/><use href=\"#bodyweight-split-squat-m-st-kneecap.l\"/><use href=\"#bodyweight-split-squat-m-st-shank.l\"/><use href=\"#bodyweight-split-squat-m-st-foot.l\"/><use href=\"#bodyweight-split-squat-m-st-shcap.l\"/><use href=\"#bodyweight-split-squat-m-st-upper.l\"/><use href=\"#bodyweight-split-squat-m-st-elbowcap.l\"/><use href=\"#bodyweight-split-squat-m-st-fore.l\"/><use href=\"#bodyweight-split-squat-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-m-st-head\"/><use href=\"#bodyweight-split-squat-m-st-torso\"/><use href=\"#bodyweight-split-squat-m-st-thigh.r\"/><use href=\"#bodyweight-split-squat-m-st-kneecap.r\"/><use href=\"#bodyweight-split-squat-m-st-shank.r\"/><use href=\"#bodyweight-split-squat-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-m-st-head\"/><use href=\"#bodyweight-split-squat-m-st-torso\"/><use href=\"#bodyweight-split-squat-m-st-thigh.r\"/><use href=\"#bodyweight-split-squat-m-st-kneecap.r\"/><use href=\"#bodyweight-split-squat-m-st-shank.r\"/><use href=\"#bodyweight-split-squat-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-m-st-shcap.r\"/><use href=\"#bodyweight-split-squat-m-st-upper.r\"/><use href=\"#bodyweight-split-squat-m-st-elbowcap.r\"/><use href=\"#bodyweight-split-squat-m-st-fore.r\"/><use href=\"#bodyweight-split-squat-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-m-st-shcap.r\"/><use href=\"#bodyweight-split-squat-m-st-upper.r\"/><use href=\"#bodyweight-split-squat-m-st-elbowcap.r\"/><use href=\"#bodyweight-split-squat-m-st-fore.r\"/><use href=\"#bodyweight-split-squat-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-m-g0-thigh.l\"/><use href=\"#bodyweight-split-squat-m-g0-kneecap.l\"/><use href=\"#bodyweight-split-squat-m-g0-shank.l\"/><use href=\"#bodyweight-split-squat-m-g0-foot.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-m-g0-thigh.l\"/><use href=\"#bodyweight-split-squat-m-g0-kneecap.l\"/><use href=\"#bodyweight-split-squat-m-g0-shank.l\"/><use href=\"#bodyweight-split-squat-m-g0-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-m-g0-head\"/><use href=\"#bodyweight-split-squat-m-g0-torso\"/><use href=\"#bodyweight-split-squat-m-g0-thigh.r\"/><use href=\"#bodyweight-split-squat-m-g0-kneecap.r\"/><use href=\"#bodyweight-split-squat-m-g0-shank.r\"/><use href=\"#bodyweight-split-squat-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-m-g0-head\"/><use href=\"#bodyweight-split-squat-m-g0-torso\"/><use href=\"#bodyweight-split-squat-m-g0-thigh.r\"/><use href=\"#bodyweight-split-squat-m-g0-kneecap.r\"/><use href=\"#bodyweight-split-squat-m-g0-shank.r\"/><use href=\"#bodyweight-split-squat-m-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-m-g0-shcap.r\"/><use href=\"#bodyweight-split-squat-m-g0-upper.r\"/><use href=\"#bodyweight-split-squat-m-g0-elbowcap.r\"/><use href=\"#bodyweight-split-squat-m-g0-fore.r\"/><use href=\"#bodyweight-split-squat-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-m-g0-shcap.r\"/><use href=\"#bodyweight-split-squat-m-g0-upper.r\"/><use href=\"#bodyweight-split-squat-m-g0-elbowcap.r\"/><use href=\"#bodyweight-split-squat-m-g0-fore.r\"/><use href=\"#bodyweight-split-squat-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-m-g1-thigh.l\"/><use href=\"#bodyweight-split-squat-m-g1-kneecap.l\"/><use href=\"#bodyweight-split-squat-m-g1-shank.l\"/><use href=\"#bodyweight-split-squat-m-g1-foot.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-m-g1-thigh.l\"/><use href=\"#bodyweight-split-squat-m-g1-kneecap.l\"/><use href=\"#bodyweight-split-squat-m-g1-shank.l\"/><use href=\"#bodyweight-split-squat-m-g1-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-m-g1-head\"/><use href=\"#bodyweight-split-squat-m-g1-torso\"/><use href=\"#bodyweight-split-squat-m-g1-thigh.r\"/><use href=\"#bodyweight-split-squat-m-g1-kneecap.r\"/><use href=\"#bodyweight-split-squat-m-g1-shank.r\"/><use href=\"#bodyweight-split-squat-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-m-g1-head\"/><use href=\"#bodyweight-split-squat-m-g1-torso\"/><use href=\"#bodyweight-split-squat-m-g1-thigh.r\"/><use href=\"#bodyweight-split-squat-m-g1-kneecap.r\"/><use href=\"#bodyweight-split-squat-m-g1-shank.r\"/><use href=\"#bodyweight-split-squat-m-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-m-g1-shcap.r\"/><use href=\"#bodyweight-split-squat-m-g1-upper.r\"/><use href=\"#bodyweight-split-squat-m-g1-elbowcap.r\"/><use href=\"#bodyweight-split-squat-m-g1-fore.r\"/><use href=\"#bodyweight-split-squat-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-m-g1-shcap.r\"/><use href=\"#bodyweight-split-squat-m-g1-upper.r\"/><use href=\"#bodyweight-split-squat-m-g1-elbowcap.r\"/><use href=\"#bodyweight-split-squat-m-g1-fore.r\"/><use href=\"#bodyweight-split-squat-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-m-e-thigh.l\"/><use href=\"#bodyweight-split-squat-m-e-kneecap.l\"/><use href=\"#bodyweight-split-squat-m-e-shank.l\"/><use href=\"#bodyweight-split-squat-m-e-foot.l\"/><use href=\"#bodyweight-split-squat-m-e-shcap.l\"/><use href=\"#bodyweight-split-squat-m-e-upper.l\"/><use href=\"#bodyweight-split-squat-m-e-elbowcap.l\"/><use href=\"#bodyweight-split-squat-m-e-fore.l\"/><use href=\"#bodyweight-split-squat-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-m-e-thigh.l\"/><use href=\"#bodyweight-split-squat-m-e-kneecap.l\"/><use href=\"#bodyweight-split-squat-m-e-shank.l\"/><use href=\"#bodyweight-split-squat-m-e-foot.l\"/><use href=\"#bodyweight-split-squat-m-e-shcap.l\"/><use href=\"#bodyweight-split-squat-m-e-upper.l\"/><use href=\"#bodyweight-split-squat-m-e-elbowcap.l\"/><use href=\"#bodyweight-split-squat-m-e-fore.l\"/><use href=\"#bodyweight-split-squat-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-m-e-head\"/><use href=\"#bodyweight-split-squat-m-e-torso\"/><use href=\"#bodyweight-split-squat-m-e-thigh.r\"/><use href=\"#bodyweight-split-squat-m-e-kneecap.r\"/><use href=\"#bodyweight-split-squat-m-e-shank.r\"/><use href=\"#bodyweight-split-squat-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-m-e-head\"/><use href=\"#bodyweight-split-squat-m-e-torso\"/><use href=\"#bodyweight-split-squat-m-e-thigh.r\"/><use href=\"#bodyweight-split-squat-m-e-kneecap.r\"/><use href=\"#bodyweight-split-squat-m-e-shank.r\"/><use href=\"#bodyweight-split-squat-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-m-e-shcap.r\"/><use href=\"#bodyweight-split-squat-m-e-upper.r\"/><use href=\"#bodyweight-split-squat-m-e-elbowcap.r\"/><use href=\"#bodyweight-split-squat-m-e-fore.r\"/><use href=\"#bodyweight-split-squat-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-split-squat-m-e-shcap.r\"/><use href=\"#bodyweight-split-squat-m-e-upper.r\"/><use href=\"#bodyweight-split-squat-m-e-elbowcap.r\"/><use href=\"#bodyweight-split-squat-m-e-fore.r\"/><use href=\"#bodyweight-split-squat-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"184.45\" cy=\"202.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"184.45\" cy=\"250.44\" r=\"2.25\"/><circle class=\"joint\" cx=\"180.84\" cy=\"271.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"243.32\" cy=\"266.42\" r=\"2.25\"/></g><mask id=\"bodyweight-split-squat-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#bodyweight-split-squat-m-m-head\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-torso\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-thigh.l\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-shank.l\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-foot.l\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-shcap.l\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-upper.l\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-fore.l\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-fist.l\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-thigh.r\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-shank.r\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-mf-foot.r\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-shcap.r\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-upper.r\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-fore.r\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-m-fist.r\" fill=\"#000\"/><use href=\"#bodyweight-split-squat-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-split-squat-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#bodyweight-split-squat-m-mmask)\"><g class=\"u-stroke\"><use href=\"#bodyweight-split-squat-m-m-head\"/><use href=\"#bodyweight-split-squat-m-m-torso\"/><use href=\"#bodyweight-split-squat-m-m-thigh.l\"/><use href=\"#bodyweight-split-squat-m-m-kneecap.l\"/><use href=\"#bodyweight-split-squat-m-m-shank.l\"/><use href=\"#bodyweight-split-squat-m-m-foot.l\"/><use href=\"#bodyweight-split-squat-m-m-shcap.l\"/><use href=\"#bodyweight-split-squat-m-m-upper.l\"/><use href=\"#bodyweight-split-squat-m-m-elbowcap.l\"/><use href=\"#bodyweight-split-squat-m-m-fore.l\"/><use href=\"#bodyweight-split-squat-m-m-fist.l\"/><use href=\"#bodyweight-split-squat-m-m-thigh.r\"/><use href=\"#bodyweight-split-squat-m-m-kneecap.r\"/><use href=\"#bodyweight-split-squat-m-m-shank.r\"/><use href=\"#bodyweight-split-squat-m-m-shcap.r\"/><use href=\"#bodyweight-split-squat-m-m-upper.r\"/><use href=\"#bodyweight-split-squat-m-m-elbowcap.r\"/><use href=\"#bodyweight-split-squat-m-m-fore.r\"/><use href=\"#bodyweight-split-squat-m-m-fist.r\"/></g></g><g class=\"mistake-layer\"><path class=\"leader m\" d=\"~MSEU1(PV1L0*X2\"/><path class=\"leader m\" d=\"M252.1 301.54L267 312H277\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"bodyweight-split-squat-m-knee\" data-key=\"knee\" data-cue=\"The front knee slides forward and the shin tips well past vertical.\" class=\"plate-callout two m\" style=\"left:72.63%;top:61.45%\" aria-pressed=\"true\">Knee slides<br>forward</button><button type=\"button\" id=\"bodyweight-split-squat-m-shin\" data-key=\"shin\" data-cue=\"The front shin tips well past vertical.\" class=\"plate-callout two m\" style=\"left:75.98%;top:81.01%\" aria-pressed=\"false\">Shin tips<br>forward</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "trunk",
        cues: [{ key: "trunk", cue: "Keep the trunk upright." }, { key: "shin", cue: "At the bottom, keep the front shin about vertical." }, { key: "knee", cue: "Lower until the back knee lightly touches the floor." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "knee",
        cues: [{ key: "knee", cue: "The front knee slides forward and the shin tips well past vertical." }, { key: "shin", cue: "The front shin tips well past vertical." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Knee slides forward</b><span>The front knee slides forward and the shin tips well past vertical.</span></li><li><b>Shin tips forward</b><span>The front shin tips well past vertical.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower smooth, rise smooth\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>Smooth</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Rise</b><span>Smooth</span></div></div></div>",
      alt: "Bodyweight split squat, side view. From a split stance with the front knee about straight, both knees bend and the body lowers until the back knee lightly touches the floor, front shin near vertical, front foot flat, back foot on the ball, trunk upright, feet staying in place.",
      mistakeAlt: "Bodyweight Split Squat: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP: the card archetype.hand is none; it gives no thumb, contact or wrist claim."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Stand in a split stance, one foot forward, one back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-splitsquat"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Front foot farther forward for more hip work, closer for more quads.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-splitsquat"
        ],
        "note": "c4"
      }
    },
    {
      "kind": "position",
      "text": "Bend both knees, lowering smoothly until the back knee lightly touches.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-splitsquat"
        ],
        "note": "c1, c6"
      }
    },
    {
      "kind": "position",
      "text": "Keep the trunk upright and the front shin about vertical.",
      "zoom": "front-shin",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-splitsquat"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "finish",
      "text": "Stand back up until the front knee is about straight.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-splitsquat"
        ],
        "note": "c3"
      }
    }
  ],
  posture: [
    {
      "key": "trunk",
      "label": "Trunk upright",
      "detail": "Trunk upright.",
      "anchor": {
        "pose": "end",
        "at": "sternum"
      },
      "zoom": "trunk",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-splitsquat"
        ],
        "note": "c2"
      }
    },
    {
      "key": "shin",
      "label": "Front shin vertical",
      "detail": "Front shin about vertical at the bottom.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "front-shin",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-splitsquat"
        ],
        "note": "c2"
      }
    },
    {
      "key": "split",
      "label": "Split length",
      "detail": "Front foot farther forward for more hip work, closer for more quads.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-splitsquat"
        ],
        "note": "c4"
      }
    },
    {
      "key": "drop",
      "label": "Dropping fast",
      "detail": "Lower smoothly until the back knee just touches.",
      "anchor": {
        "pose": "end",
        "at": "knee.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-splitsquat"
        ],
        "note": "c6, c1"
      }
    }
  ],
  zooms: [
    {
      "key": "front-shin",
      "chip": "Shin",
      "heading": "Front shin",
      "kind": "posture"
    },
    {
      "key": "trunk",
      "chip": "Trunk",
      "heading": "Trunk angle",
      "kind": "posture"
    }
  ],
  chips: [
    "front-shin",
    "trunk",
    "feel"
  ],
  copy: {
    "setupLine": "Split stance, one foot forward, one back. Lower until the back knee lightly touches the floor.",
    "mistakeLine": "Never let the front knee slide forward. Keep the front shin about vertical at the bottom.",
    "cueLine": "Trunk upright, front shin vertical."
  },
  mistakes: [],
  risks: [
    {
      "key": "crash",
      "text": "Crashing into the bottom instead of lowering smoothly.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-splitsquat"
        ],
        "note": "c6"
      }
    }
  ],
  riskFlags: [
    "knee"
  ],
  redFlag: {
    "name": "Wrist pain",
    "now": "Can't grip, wrist changed shape, or hand gone numb? Get it checked today.",
    "doctor": "Tingling, keeps coming back, or no better after two weeks' rest? See a doctor.",
    "claim": {
      "tags": [
        "CONSENSUS"
      ],
      "sources": [
        "nhs-wrist-pain"
      ]
    }
  },
  sources: [
    "cat-splitsquat",
    "nhs-knee",
    "nhs-knee-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/bodyweight_split_squat.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

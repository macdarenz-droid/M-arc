// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=3b8c968c502a7d05100aa0507d7eec99cc51b7c9329acca09709fd93754b9dca
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_walking_lunge",
  name: "Walking Lunge",
  hashes: { inputsSha256: "3b8c968c502a7d05100aa0507d7eec99cc51b7c9329acca09709fd93754b9dca", golden: "ef57e70296193923beb0e1d64d78df50bd51c9c181d9a0a42fb081c29ec01cfe" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"walking-lunge-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"walking-lunge-n-st-thigh.l\" d=\"~#F12W(fN.E1K-fRJD1B2TbG11P5U(1Y5)7S2x4uzV1SbInjEkxdRmB4)U1.2.3E6T7K1Y(1D10P1-bTv-aRkPG1y1(z1FnDF100020000010220000200000200001001001010121000101000010000000000100000000002200200\"/><path id=\"walking-lunge-n-st-kneecap.l\" d=\"~~(Hh_wU1_J10\"/><path id=\"walking-lunge-n-st-shank.l\" d=\"~#F12SGhA!T1xShOKS1w3TbF16R1A)1_6E7y3T3y3)y2U8-cF1*b*5EePaEy2G2E4B5I8BbA(1E13h*b)dHaTfFnB2UlUa!p00200100020000000010100200000000000000000001000010000101000100100000220000100120\"/><path id=\"walking-lunge-n-st-foot.l\" d=\"~#o2FTgAB)1.AhzB(1_cF3Uhx8Sp)nU-2B3XJ2-4OD1)7*n2TG1Y4Bb-c_sBbImSp120002012100002101200000100220002101000000210110\"/><path id=\"walking-lunge-n-st-shcap.l\" d=\"~~N.gyGqwP10\"/><path id=\"walking-lunge-n-st-upper.l\" d=\"~#F12N.gyGqI!gIBpg.881J2UO1D3.5N1x3Y5KD1ya-i0Ig)9-i-5KD1K1x3B3.5I2UO191d.8Bgz1XdUp2JmUdUp00000010011000020011100000000120000100001010111002000001000020200100000000000021\"/><path id=\"walking-lunge-n-st-elbowcap.l\" d=\"~~FFhUSz1Dz10\"/><path id=\"walking-lunge-n-st-fore.l\" d=\"~#F12YDhDVz1-Eh)Yy1y1Iaq_1S6yI1!2R9N1K2.1*w1w6BdpEbX7EcX2.w1X1E2B4x9dSI1j(1K2zaBaix9FkD1Dh!bYi10002000000101000010100000002001001000002000210101010100000000101000200000000110\"/><path id=\"walking-lunge-n-st-fist.l\" d=\"~~Hxi(HK1ww10\"/><path id=\"walking-lunge-n-st-head\" d=\"~#w12NIiyGgBYgO)fEjFjEjS9zbz3E3Y4X4)7)7EbThGmY4.cO1R9Ej0JmBbNmI6YkA3FjygT1Dj0000121000002200012000001110021100200010000012000010010000000000\"/><path id=\"walking-lunge-n-st-torso\" d=\"~#_12N.gyxl)AhVSjT9I6E30U9UhU9J6_cwgJ60K6)nGm)7.cY4wgX4!kI6Hm)fUhTh_4T9)7)fBrzz1BbErK60R90YcwgF3w8.c)7*fw8I6YkH6P6!cEbD3w8ET2ww101000010000000012000001001100101000011020000201010000100000020000200010100111000000000100000202001101220010010000100\"/><path id=\"walking-lunge-n-st-thigh.r\" d=\"^0\"/><path id=\"walking-lunge-n-st-kneecap.r\" d=\"^1\"/><path id=\"walking-lunge-n-st-shank.r\" d=\"^2\"/><path id=\"walking-lunge-n-st-foot.r\" d=\"^3\"/><path id=\"walking-lunge-n-st-shcap.r\" d=\"^4\"/><path id=\"walking-lunge-n-st-upper.r\" d=\"^5\"/><path id=\"walking-lunge-n-st-elbowcap.r\" d=\"^6\"/><path id=\"walking-lunge-n-st-fore.r\" d=\"^7\"/><path id=\"walking-lunge-n-st-fist.r\" d=\"^8\"/><path id=\"walking-lunge-n-g0-eq1.dumbbell.1-0\" d=\"~M!Bk(.J1LEK10QI90!z1J9LJ9yy2Q0J9J9xy2L!z1I9QJ90.z1I9LI9xy2Q0I9I9yy2Z\"/><path id=\"walking-lunge-n-g0-eq1.dumbbell.2-1\" d=\"~MPOoA_O1LFK10QJ90.z1I9LI9xy2Q0I9I9yy2L.z1J9QI90!z1J9LJ9yy2Q0J9J9xy2Z\"/><path id=\"walking-lunge-n-g0-thigh.l\" d=\"~#F12YwjJ)F1z-i-PE1-2RbB12S8F(1H5G8N2z4-1zV1Ja)nV1xkze*l*6XU1x3V3R6G7W1_(1D13s.bxw1B9KiPH1!2_z1FpwE101010100001000000002000200100012100020000010000000000010100000000100010110000000\"/><path id=\"walking-lunge-n-g0-kneecap.l\" d=\"~~WwlW)U1_J10\"/><path id=\"walking-lunge-n-g0-shank.l\" d=\"~#F12wzlAKU1I-lIzT1N6xaA1gXkU.1U8X4A4R2Jn.(1AcR9Y4*aB1OfDu-.1tV4G2T9TtYX1B1fy3ObIgP5xmJhV8!jH2ws01000000000000002001212000100010000001020002000000002000000000200000000002020000\"/><path id=\"walking-lunge-n-g0-foot.l\" d=\"^3\"/><path id=\"walking-lunge-n-g0-head\" d=\"~#w12N_lAGhKEkT(gOj!iIjF9zbK3G3_4T4z8.7GbzhXmw5VcK1T9Bj9Sm-aPmx6_kU3!iHg*1Aj0000020000000010100001100000200000101010101010000000020111100000\"/><path id=\"walking-lunge-n-g0-torso\" d=\"~#_12YEkHwmzSkzSkR9O6z33F9_hP9S6PcFgN62)5xoEmK8*cS4AgK4(kz6UmRf(hGh(4O9V7zgRqVz1XaIrK63R93PcDgA3y8XcE8xgY7-6UkH6S6wd*aw3w8VT2Su00000001200010000000020000000001100000002200000000000000000220000010021010000200000020011000000001100200000011010101\"/><path id=\"walking-lunge-n-g0-thigh.r\" d=\"~#F12UOj_DH1RPiGzG1O8G8voDF1FP14.93X4TtBJ1-3-p)bBgVnBbTx1xG1T4R1K9X2Uy1NU1unO5Oaxw1A9W6!K1Nl_swH1_j10000200000021200020000020000002000000000000010100200010100220000010100000200000\"/><path id=\"walking-lunge-n-g0-kneecap.r\" d=\"~~AHrYTS1_J10\"/><path id=\"walking-lunge-n-g0-shank.r\" d=\"~#F12UGry(S1-yrBOR1r.bF19WiH!1y4)8_1I4OiRw2A4.eV2TbzaXbzbxy2T3G3O7G6A9P(1B18I4xb.9DeO7wr_4DlJiDl00000000010000001010100100001212100120200010012002000000020020002000000002000200\"/><path id=\"walking-lunge-n-g0-foot.r\" d=\"~#o2AGuw-*1-RuOV!1Ad9wfBcNi.t_V2EqOI2FfzE1D2BnF6*D1JfBeO9wpBixfNu000111200200002002100001011010000111000000111000\"/><path id=\"walking-lunge-n-g0-shcap.r\" d=\"~~_AkAGrwP10\"/><path id=\"walking-lunge-n-g0-upper.r\" d=\"~#F12_AkAGrXBkKBqe.8c1H2WO1D3)5N1)2Y5KD1ya-i0Igxa-iV5KD1O1)2B3)5I2WO191d.8Bgz1XdUp2JmUdUp00000000211010000110100000000020000000200000101100100001000000000100000000000001\"/><path id=\"walking-lunge-n-g0-elbowcap.r\" d=\"~~URkWSA1Dz10\"/><path id=\"walking-lunge-n-g0-fore.r\" d=\"~#F12APkFVA1BRkx-z1y1Iaq_1S6yI1!2R9N1I2.1xx1w6zdpEbX7EcX2.w1X1E2B4x9dSI1j(1K2zaBaix9FkD1Dh!bYi10002000000101000010101101002200001000000000210101010100000000101000200000000110\"/><path id=\"walking-lunge-n-g0-fist.r\" d=\"~~WHlwIN1ww10\"/><path id=\"walking-lunge-n-g0-eq2.dumbbell.1-0\" d=\"^11\"/><path id=\"walking-lunge-n-g0-eq2.dumbbell.2-1\" d=\"^12\"/><path id=\"walking-lunge-n-g1-eq1.dumbbell.1-0\" d=\"~MWBuDHS1LEK10QI90!z1J9LJ9yy2Q0J9J9xy2L!z1I9QJ90.z1I9LI9xy2Q0I9I9yy2Z\"/><path id=\"walking-lunge-n-g1-eq1.dumbbell.2-1\" d=\"~MHOy1JFV1LFK10QJ90.z1I9LI9xy2Q0I9I9yy2L.z1J9QI90!z1J9LJ9yy2Q0J9J9xy2Z\"/><path id=\"walking-lunge-n-g1-thigh.l\" d=\"~#F12SRs!KN1KGsI)J1.2RbG14H9A(1F5I8J2z4K2BV1Aa)n.1BkIeVlO7VU1x3T3X6E7N2Y(1D13o.bzw1.8zi_H1N3Wz1SpWD120200010100000200000000011100001200000000000001000000010102000000000002101000000\"/><path id=\"walking-lunge-n-g1-kneecap.l\" d=\"~~WVuwK_1_J10\"/><path id=\"walking-lunge-n-g1-shank.l\" d=\"~#F12_YvU)Y1-Ex1K-Y1(bjaA1R!1wi!8A4P4!1Uw2Th(eH4WbR2Yb)9Hy2GaF3O3N6O7R(1N87E1AbE4xexa*q-7ElS4Glyi10000220010200100100001200000010111000000200121010000000001000020000000000000000\"/><path id=\"walking-lunge-n-g1-foot.l\" d=\"~#o2DDkyS.1EGl.E.1Y6HbAiY6yz1D1Wx2y*1)S1V-1Kl-w1)g)g-w1*pA1xhHsPc*x1F2011101002100002000000001011000101201010002101001\"/><path id=\"walking-lunge-n-g1-head\" d=\"~#w12JBw1YXmXSuKImzkAiXjS8)aX3K3U4I4G8I7ObKgInN5Kcx1X9Bjvwn)9UmB5WkF4FiwhR2yj2200200000000000000101020000111012000100000000100000001200002000\"/><path id=\"walking-lunge-n-g1-torso\" d=\"~#_12PKuyKrO-uE)pE9.6E33Y8wiD9(6(bWgN68B5Eo.lB9zdA4Hg*3ylG5DnXeSiXgF5E9z7KgIpTA1X9VrG69V9hwcWgY2A8GcT8KgA7O7NkA6Y6HdRa_2D8-U2Ur00000000022000101000000001000001010010002002000002012000100111010000200000011101000021200001000000200010100000000200\"/><path id=\"walking-lunge-n-g1-thigh.r\" d=\"~#F12_StFDP1-Gs.NO1XaB5lA1_V1Jw1z3G9X1R4KH1*vxcznXgIb*pX2GK1-r.42X9i!R1AD1kx1T8x8GrAjNlDG1WtAkAN1(400000100020000000010010000020010001000010101112000011011000220000200000001000000\"/><path id=\"walking-lunge-n-g1-kneecap.r\" d=\"~~FVE1HzV1_J10\"/><path id=\"walking-lunge-n-g1-shank.r\" d=\"~#F12wYE1_WV1REE1IHU1G3ObA1f(uyX1y2T9sX4RvB.1sKfx5-aGcI9XoE(1B4K2X8V4AmF.1B1gR6*9X6(fT1ysA9UjNm_g10000000020000101000210010001010000120000200000010000200000001010102000001000000\"/><path id=\"walking-lunge-n-g1-foot.r\" d=\"~#o2_HK1DB)1K!K1EB(1_cF3Uh*7UpxoS-2B3-J2-4ID1)7xo0OG1!4Eb.cYsBbGmUp100002002020000111001000101200022001101000000011\"/><path id=\"walking-lunge-n-g1-shcap.r\" d=\"~~UAuHXw1wP10\"/><path id=\"walking-lunge-n-g1-upper.r\" d=\"~#F12UAuHXw1RBuRTvg)882J2SO1D3.5N1x3Y5KD1ya-i2Igza-iX5KD1K1x3B3.5I2SO172h)8zgvXdPp2PmUdPp02002012001000000001002000200120000110001010110000002000221000220000000000000020\"/><path id=\"walking-lunge-n-g1-elbowcap.r\" d=\"~~NRu(wH1Dz10\"/><path id=\"walking-lunge-n-g1-fore.r\" d=\"~#F12(OuPzH1*PuGEG1uIauY1N6DI1(2T9N1K2.1*w1w6BdpEbX7EcV2*w1-1z2E4z9bSI1j(1K2zazaiB9FkF1Dh!bYi00100100010010000000000020002001000001000012101001012100000000001110000020200120\"/><path id=\"walking-lunge-n-g1-fist.r\" d=\"~~PHvF-T1ww10\"/><path id=\"walking-lunge-n-g1-eq2.dumbbell.1-0\" d=\"^27\"/><path id=\"walking-lunge-n-g1-eq2.dumbbell.2-1\" d=\"^28\"/><path id=\"walking-lunge-n-e-thigh.l\" d=\"~#F12_wx1UJU1)Hx1R(S1Y1XbB1bxfw*1y8-5W3.2yizS1NiGiw6IjB5RpDdRT1O1R4K3B9Tl!_1A1cF5VaKqIk.w1Uw1OaJy1w9PK101002000001010000012000020121020000010002000000000000100102000020000000000100001\"/><path id=\"walking-lunge-n-e-kneecap.l\" d=\"~~!Hu!-w2_J10\"/><path id=\"walking-lunge-n-e-shank.l\" d=\"~#F12ADw1_K)1.Rx1zww2WaN5bD1I*1)eW5A8_2!3_w2FhWaDbJbY3FfV2N(1NoU4K1H9E3G_1BocB1_b(1z7XfGjIkVkV6Or!401002020010000000000001011010000022002000001010000020000020022200200001010200000\"/><path id=\"walking-lunge-n-e-foot.l\" d=\"~#o2DDkyS.1EGl.E.1Y6HbAiY6yz1D1Wx2y*1)S1V-1Kl-w1)g)g-w1*pA1xhHsPc*x1F2011101002100002000000001010000101001010002101001\"/><path id=\"walking-lunge-n-e-shcap.l\" d=\"~~_Py1WTE1wP10\"/><path id=\"walking-lunge-n-e-upper.l\" d=\"~#F12_Py1WTE1XRy1)OD1g.881J2UO1D3.5N1x3Y5KD1ya-i2Igza-iX5KD1K1x3B3.5I2UO171h.8zgz1XdUp2JmUdUp00002010011000020000002000200020000010001010100002002001201000200100000000000021\"/><path id=\"walking-lunge-n-e-elbowcap.l\" d=\"~~U*y1F*P1Dz10\"/><path id=\"walking-lunge-n-e-fore.l\" d=\"~#F12A!y1_)P1z*y1TzP1uIau_1N6yI1(2R9N1K2-1*w1!5BdnEbX7EcV2.w1-1E2E4x9bSI1j(1K2zazaiB9FkF1Dh!bYi00000000000111000000000000100000000000000010111101012100000000001010000020200120\"/><path id=\"walking-lunge-n-e-fist.l\" d=\"~~WWz1SV_1ww10\"/><path id=\"walking-lunge-n-e-head\" d=\"~#w12SRA1AUt*(y1.EtzkDiXjS8)aX3K3U4I4E8I7TbKgEnN5Rcx1V9Bjvwn*9UmG5WkH4FiwhR2Aj2000200000000000000001000100101110000000020002110100001200002000\"/><path id=\"walking-lunge-n-e-torso\" d=\"~#_12W-y1JGy1VBz1R.w1E9.6E33Y8wiD9(6(bWgN68B5Eo.lB9zdD4Hgx4ylB5Dn.eSiVgF5E9z7KgIpTA1X9VrG69V9hwcWgY2A8GcT8KgA7O7NkA6Y6HdRa_2D8-U2Ur00000200022000101000000001020000000010012102000100012000100101000000200200011100000020200000000000200010100200000200\"/><path id=\"walking-lunge-n-e-thigh.r\" d=\"~#F12!Pz1SOX1Gyy1IXX1Tb_26F1A(1.8G8G5z4I2BV1y2*nEaBkW1-lHeVU1A7V3A3G7S6Y(1*11E1.bp)8Aw1SH1HiYz1z3!D1Kp02100022000002010100200002000201010000000002000111001001000000000000100110210000\"/><path id=\"walking-lunge-n-e-kneecap.r\" d=\"~~(zN1AxU1_J10\"/><path id=\"walking-lunge-n-e-shank.r\" d=\"~#F12UyN1F!T1GIN1VKS1y3RbD14V1A)1Y6B7A3T3H3)y2W8XcF1*b.5GeYazy2G2E4z5K8KbA(1E15h*b*dHaXfAnG2UlUa(p00010100002200000000000001000010000000020010100010101001010000022000000002000000\"/><path id=\"walking-lunge-n-e-foot.r\" d=\"~#o2_HK1DB)1K!K1EB(1_cF3Uh)7Up)nS-2B3-J2X4ID1x8xo0OG1_4EbXcYsEbGmUp100002002220000010001200101000002000121000000011\"/><path id=\"walking-lunge-n-e-shcap.r\" d=\"^48\"/><path id=\"walking-lunge-n-e-upper.r\" d=\"^49\"/><path id=\"walking-lunge-n-e-elbowcap.r\" d=\"^50\"/><path id=\"walking-lunge-n-e-fore.r\" d=\"^51\"/><path id=\"walking-lunge-n-e-fist.r\" d=\"^52\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#walking-lunge-n-dots)\"/>\n  <path class=\"floorline\" d=\"M57.83 339.5H306.51\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-st-thigh.l\"/><use href=\"#walking-lunge-n-st-kneecap.l\"/><use href=\"#walking-lunge-n-st-shank.l\"/><use href=\"#walking-lunge-n-st-foot.l\"/><use href=\"#walking-lunge-n-st-shcap.l\"/><use href=\"#walking-lunge-n-st-upper.l\"/><use href=\"#walking-lunge-n-st-elbowcap.l\"/><use href=\"#walking-lunge-n-st-fore.l\"/><use href=\"#walking-lunge-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-st-thigh.l\"/><use href=\"#walking-lunge-n-st-kneecap.l\"/><use href=\"#walking-lunge-n-st-shank.l\"/><use href=\"#walking-lunge-n-st-foot.l\"/><use href=\"#walking-lunge-n-st-shcap.l\"/><use href=\"#walking-lunge-n-st-upper.l\"/><use href=\"#walking-lunge-n-st-elbowcap.l\"/><use href=\"#walking-lunge-n-st-fore.l\"/><use href=\"#walking-lunge-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-st-head\"/><use href=\"#walking-lunge-n-st-torso\"/><use href=\"#walking-lunge-n-st-thigh.r\"/><use href=\"#walking-lunge-n-st-kneecap.r\"/><use href=\"#walking-lunge-n-st-shank.r\"/><use href=\"#walking-lunge-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-st-head\"/><use href=\"#walking-lunge-n-st-torso\"/><use href=\"#walking-lunge-n-st-thigh.r\"/><use href=\"#walking-lunge-n-st-kneecap.r\"/><use href=\"#walking-lunge-n-st-shank.r\"/><use href=\"#walking-lunge-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-st-shcap.r\"/><use href=\"#walking-lunge-n-st-upper.r\"/><use href=\"#walking-lunge-n-st-elbowcap.r\"/><use href=\"#walking-lunge-n-st-fore.r\"/><use href=\"#walking-lunge-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-st-shcap.r\"/><use href=\"#walking-lunge-n-st-upper.r\"/><use href=\"#walking-lunge-n-st-elbowcap.r\"/><use href=\"#walking-lunge-n-st-fore.r\"/><use href=\"#walking-lunge-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-solid\" d=\"~M(PkU-N1LPT30QF60EK3E6LE6OaQ0E6E6PaLEK3F6QE60FK3F6LF6PaQ0F6F6OaZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-g0-eq1.dumbbell.1-0\"/><use href=\"#walking-lunge-n-g0-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-g0-eq1.dumbbell.1-0\"/><use href=\"#walking-lunge-n-g0-eq1.dumbbell.2-1\"/></g></g><g class=\"far\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-g0-thigh.l\"/><use href=\"#walking-lunge-n-g0-kneecap.l\"/><use href=\"#walking-lunge-n-g0-shank.l\"/><use href=\"#walking-lunge-n-g0-foot.l\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-g0-thigh.l\"/><use href=\"#walking-lunge-n-g0-kneecap.l\"/><use href=\"#walking-lunge-n-g0-shank.l\"/><use href=\"#walking-lunge-n-g0-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-g0-head\"/><use href=\"#walking-lunge-n-g0-torso\"/><use href=\"#walking-lunge-n-g0-thigh.r\"/><use href=\"#walking-lunge-n-g0-kneecap.r\"/><use href=\"#walking-lunge-n-g0-shank.r\"/><use href=\"#walking-lunge-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-g0-head\"/><use href=\"#walking-lunge-n-g0-torso\"/><use href=\"#walking-lunge-n-g0-thigh.r\"/><use href=\"#walking-lunge-n-g0-kneecap.r\"/><use href=\"#walking-lunge-n-g0-shank.r\"/><use href=\"#walking-lunge-n-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-g0-shcap.r\"/><use href=\"#walking-lunge-n-g0-upper.r\"/><use href=\"#walking-lunge-n-g0-elbowcap.r\"/><use href=\"#walking-lunge-n-g0-fore.r\"/><use href=\"#walking-lunge-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-g0-shcap.r\"/><use href=\"#walking-lunge-n-g0-upper.r\"/><use href=\"#walking-lunge-n-g0-elbowcap.r\"/><use href=\"#walking-lunge-n-g0-fore.r\"/><use href=\"#walking-lunge-n-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-g0-eq2.dumbbell.1-0\"/><use href=\"#walking-lunge-n-g0-eq2.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-g0-eq2.dumbbell.1-0\"/><use href=\"#walking-lunge-n-g0-eq2.dumbbell.2-1\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-solid\" d=\"~MYPu!EU1LPT30QF60EK3E6LE6OaQ0E6E6PaLEK3F6QE60FK3F6LF6PaQ0F6F6OaZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-g1-eq1.dumbbell.1-0\"/><use href=\"#walking-lunge-n-g1-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-g1-eq1.dumbbell.1-0\"/><use href=\"#walking-lunge-n-g1-eq1.dumbbell.2-1\"/></g></g><g class=\"far\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-g1-thigh.l\"/><use href=\"#walking-lunge-n-g1-kneecap.l\"/><use href=\"#walking-lunge-n-g1-shank.l\"/><use href=\"#walking-lunge-n-g1-foot.l\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-g1-thigh.l\"/><use href=\"#walking-lunge-n-g1-kneecap.l\"/><use href=\"#walking-lunge-n-g1-shank.l\"/><use href=\"#walking-lunge-n-g1-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-g1-head\"/><use href=\"#walking-lunge-n-g1-torso\"/><use href=\"#walking-lunge-n-g1-thigh.r\"/><use href=\"#walking-lunge-n-g1-kneecap.r\"/><use href=\"#walking-lunge-n-g1-shank.r\"/><use href=\"#walking-lunge-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-g1-head\"/><use href=\"#walking-lunge-n-g1-torso\"/><use href=\"#walking-lunge-n-g1-thigh.r\"/><use href=\"#walking-lunge-n-g1-kneecap.r\"/><use href=\"#walking-lunge-n-g1-shank.r\"/><use href=\"#walking-lunge-n-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-g1-shcap.r\"/><use href=\"#walking-lunge-n-g1-upper.r\"/><use href=\"#walking-lunge-n-g1-elbowcap.r\"/><use href=\"#walking-lunge-n-g1-fore.r\"/><use href=\"#walking-lunge-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-g1-shcap.r\"/><use href=\"#walking-lunge-n-g1-upper.r\"/><use href=\"#walking-lunge-n-g1-elbowcap.r\"/><use href=\"#walking-lunge-n-g1-fore.r\"/><use href=\"#walking-lunge-n-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^61\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-g1-eq2.dumbbell.1-0\"/><use href=\"#walking-lunge-n-g1-eq2.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-g1-eq2.dumbbell.1-0\"/><use href=\"#walking-lunge-n-g1-eq2.dumbbell.2-1\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-solid\" d=\"~M(!y1DA.1LPT30QF60EK3E6LE6OaQ0E6E6PaLEK3F6QE60FK3F6LF6PaQ0F6F6OaZ\"/><path class=\"disc\" d=\"~M!Ry1PD-1LEK10QI90!z1J9LJ9yy2Q0J9J9xy2L!z1I9QJ90.z1I9LI9xy2Q0I9I9yy2Z\"/><path class=\"disc\" d=\"~MP.D1WA!1LFK10QJ90.z1I9LI9xy2Q0I9I9yy2L.z1J9QI90!z1J9LJ9yy2Q0J9J9xy2Z\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-e-thigh.l\"/><use href=\"#walking-lunge-n-e-kneecap.l\"/><use href=\"#walking-lunge-n-e-shank.l\"/><use href=\"#walking-lunge-n-e-foot.l\"/><use href=\"#walking-lunge-n-e-shcap.l\"/><use href=\"#walking-lunge-n-e-upper.l\"/><use href=\"#walking-lunge-n-e-elbowcap.l\"/><use href=\"#walking-lunge-n-e-fore.l\"/><use href=\"#walking-lunge-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-e-thigh.l\"/><use href=\"#walking-lunge-n-e-kneecap.l\"/><use href=\"#walking-lunge-n-e-shank.l\"/><use href=\"#walking-lunge-n-e-foot.l\"/><use href=\"#walking-lunge-n-e-shcap.l\"/><use href=\"#walking-lunge-n-e-upper.l\"/><use href=\"#walking-lunge-n-e-elbowcap.l\"/><use href=\"#walking-lunge-n-e-fore.l\"/><use href=\"#walking-lunge-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-e-head\"/><use href=\"#walking-lunge-n-e-torso\"/><use href=\"#walking-lunge-n-e-thigh.r\"/><use href=\"#walking-lunge-n-e-kneecap.r\"/><use href=\"#walking-lunge-n-e-shank.r\"/><use href=\"#walking-lunge-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-e-head\"/><use href=\"#walking-lunge-n-e-torso\"/><use href=\"#walking-lunge-n-e-thigh.r\"/><use href=\"#walking-lunge-n-e-kneecap.r\"/><use href=\"#walking-lunge-n-e-shank.r\"/><use href=\"#walking-lunge-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-n-e-shcap.r\"/><use href=\"#walking-lunge-n-e-upper.r\"/><use href=\"#walking-lunge-n-e-elbowcap.r\"/><use href=\"#walking-lunge-n-e-fore.r\"/><use href=\"#walking-lunge-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-n-e-shcap.r\"/><use href=\"#walking-lunge-n-e-upper.r\"/><use href=\"#walking-lunge-n-e-elbowcap.r\"/><use href=\"#walking-lunge-n-e-fore.r\"/><use href=\"#walking-lunge-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^62\"/><path class=\"disc\" d=\"^63\"/><path class=\"disc\" d=\"^64\"/><circle class=\"joint\" cx=\"184.45\" cy=\"202.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"184.45\" cy=\"250.44\" r=\"2.25\"/><circle class=\"joint\" cx=\"180.84\" cy=\"271.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"243.32\" cy=\"266.42\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#y20UFkyKF1RykxIF12000000000!c_8220001122000011220010210200102Ga!202010022110002012012000001200100010001001111000000200000101210000020000011101000002000020010100000200100000000000001012000200001110100000021012100001010\"/><path class=\"arrow\" d=\"~MSSy1!*T1L*z1RlLSz2J1Z\"/><path data-guide=\"hips\" style=\"display:none\" class=\"lead-guide\" d=\"~MFHz1yzV1L0Wzd\"/><path data-guide=\"shin\" style=\"display:none\" class=\"lead-guide\" d=\"~MUEN1YDy2L0RTh\"/></g><path class=\"leader\" d=\"~MwHP1DR-1LYF2V3\"/><circle class=\"anchor\" cx=\"247.36\" cy=\"294.59\" r=\"1.5\"/><path class=\"leader\" d=\"M160.28 272.82L193 240H203\"/><circle class=\"anchor\" cx=\"160.28\" cy=\"272.82\" r=\"1.5\"/><path class=\"leader\" d=\"M202.35 203.76L207 182H217\"/><circle class=\"anchor\" cx=\"202.35\" cy=\"203.76\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"walking-lunge-n-shin\" data-key=\"shin\" data-cue=\"At the bottom, keep the front shin about vertical.\" class=\"plate-callout two\" style=\"left:70.95%;top:75.98%\" aria-pressed=\"true\">Front shin<br>vertical</button><button type=\"button\" id=\"walking-lunge-n-hips\" data-key=\"hips\" data-cue=\"Lower the hips toward the floor instead of driving them forward.\" class=\"plate-callout two\" style=\"left:55.31%;top:60.89%\" aria-pressed=\"false\">Hips drop<br>down</button><button type=\"button\" id=\"walking-lunge-n-chest\" data-key=\"chest\" data-cue=\"Keep the trunk upright through the step.\" class=\"plate-callout\" style=\"left:59.22%;top:44.69%\" aria-pressed=\"false\">Chest up</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"walking-lunge-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"walking-lunge-m-st-thigh.l\" d=\"^0\"/><path id=\"walking-lunge-m-st-kneecap.l\" d=\"^1\"/><path id=\"walking-lunge-m-st-shank.l\" d=\"^2\"/><path id=\"walking-lunge-m-st-foot.l\" d=\"^3\"/><path id=\"walking-lunge-m-st-shcap.l\" d=\"^4\"/><path id=\"walking-lunge-m-st-upper.l\" d=\"^5\"/><path id=\"walking-lunge-m-st-elbowcap.l\" d=\"^6\"/><path id=\"walking-lunge-m-st-fore.l\" d=\"^7\"/><path id=\"walking-lunge-m-st-fist.l\" d=\"^8\"/><path id=\"walking-lunge-m-st-head\" d=\"^9\"/><path id=\"walking-lunge-m-st-torso\" d=\"^10\"/><path id=\"walking-lunge-m-st-thigh.r\" d=\"^0\"/><path id=\"walking-lunge-m-st-kneecap.r\" d=\"^1\"/><path id=\"walking-lunge-m-st-shank.r\" d=\"^2\"/><path id=\"walking-lunge-m-st-foot.r\" d=\"^3\"/><path id=\"walking-lunge-m-st-shcap.r\" d=\"^4\"/><path id=\"walking-lunge-m-st-upper.r\" d=\"^5\"/><path id=\"walking-lunge-m-st-elbowcap.r\" d=\"^6\"/><path id=\"walking-lunge-m-st-fore.r\" d=\"^7\"/><path id=\"walking-lunge-m-st-fist.r\" d=\"^8\"/><path id=\"walking-lunge-m-g0-eq1.dumbbell.1-0\" d=\"^11\"/><path id=\"walking-lunge-m-g0-eq1.dumbbell.2-1\" d=\"^12\"/><path id=\"walking-lunge-m-g0-thigh.l\" d=\"^13\"/><path id=\"walking-lunge-m-g0-kneecap.l\" d=\"^14\"/><path id=\"walking-lunge-m-g0-shank.l\" d=\"^15\"/><path id=\"walking-lunge-m-g0-foot.l\" d=\"^3\"/><path id=\"walking-lunge-m-g0-head\" d=\"^16\"/><path id=\"walking-lunge-m-g0-torso\" d=\"^17\"/><path id=\"walking-lunge-m-g0-thigh.r\" d=\"^18\"/><path id=\"walking-lunge-m-g0-kneecap.r\" d=\"^19\"/><path id=\"walking-lunge-m-g0-shank.r\" d=\"^20\"/><path id=\"walking-lunge-m-g0-foot.r\" d=\"^21\"/><path id=\"walking-lunge-m-g0-shcap.r\" d=\"^22\"/><path id=\"walking-lunge-m-g0-upper.r\" d=\"^23\"/><path id=\"walking-lunge-m-g0-elbowcap.r\" d=\"^24\"/><path id=\"walking-lunge-m-g0-fore.r\" d=\"^25\"/><path id=\"walking-lunge-m-g0-fist.r\" d=\"^26\"/><path id=\"walking-lunge-m-g0-eq2.dumbbell.1-0\" d=\"^11\"/><path id=\"walking-lunge-m-g0-eq2.dumbbell.2-1\" d=\"^12\"/><path id=\"walking-lunge-m-g1-eq1.dumbbell.1-0\" d=\"^27\"/><path id=\"walking-lunge-m-g1-eq1.dumbbell.2-1\" d=\"^28\"/><path id=\"walking-lunge-m-g1-thigh.l\" d=\"^29\"/><path id=\"walking-lunge-m-g1-kneecap.l\" d=\"^30\"/><path id=\"walking-lunge-m-g1-shank.l\" d=\"^31\"/><path id=\"walking-lunge-m-g1-foot.l\" d=\"^32\"/><path id=\"walking-lunge-m-g1-head\" d=\"^33\"/><path id=\"walking-lunge-m-g1-torso\" d=\"^34\"/><path id=\"walking-lunge-m-g1-thigh.r\" d=\"^35\"/><path id=\"walking-lunge-m-g1-kneecap.r\" d=\"^36\"/><path id=\"walking-lunge-m-g1-shank.r\" d=\"^37\"/><path id=\"walking-lunge-m-g1-foot.r\" d=\"^38\"/><path id=\"walking-lunge-m-g1-shcap.r\" d=\"^39\"/><path id=\"walking-lunge-m-g1-upper.r\" d=\"^40\"/><path id=\"walking-lunge-m-g1-elbowcap.r\" d=\"^41\"/><path id=\"walking-lunge-m-g1-fore.r\" d=\"^42\"/><path id=\"walking-lunge-m-g1-fist.r\" d=\"^43\"/><path id=\"walking-lunge-m-g1-eq2.dumbbell.1-0\" d=\"^27\"/><path id=\"walking-lunge-m-g1-eq2.dumbbell.2-1\" d=\"^28\"/><path id=\"walking-lunge-m-e-thigh.l\" d=\"^44\"/><path id=\"walking-lunge-m-e-kneecap.l\" d=\"^45\"/><path id=\"walking-lunge-m-e-shank.l\" d=\"^46\"/><path id=\"walking-lunge-m-e-foot.l\" d=\"^47\"/><path id=\"walking-lunge-m-e-shcap.l\" d=\"^48\"/><path id=\"walking-lunge-m-e-upper.l\" d=\"^49\"/><path id=\"walking-lunge-m-e-elbowcap.l\" d=\"^50\"/><path id=\"walking-lunge-m-e-fore.l\" d=\"^51\"/><path id=\"walking-lunge-m-e-fist.l\" d=\"^52\"/><path id=\"walking-lunge-m-e-head\" d=\"^53\"/><path id=\"walking-lunge-m-e-torso\" d=\"^54\"/><path id=\"walking-lunge-m-e-thigh.r\" d=\"^55\"/><path id=\"walking-lunge-m-e-kneecap.r\" d=\"^56\"/><path id=\"walking-lunge-m-e-shank.r\" d=\"^57\"/><path id=\"walking-lunge-m-e-foot.r\" d=\"^58\"/><path id=\"walking-lunge-m-e-shcap.r\" d=\"^48\"/><path id=\"walking-lunge-m-e-upper.r\" d=\"^49\"/><path id=\"walking-lunge-m-e-elbowcap.r\" d=\"^50\"/><path id=\"walking-lunge-m-e-fore.r\" d=\"^51\"/><path id=\"walking-lunge-m-e-fist.r\" d=\"^52\"/><path id=\"walking-lunge-m-m-head\" d=\"~#w12A(K1FAw1-UJ1OAvXpJ8Ol1R8*7)4_2lG9x2RdR5*ryaE9(2G9BhV8yp6(mJ4whFcwa(mBaNg0020010010111100200100000000000001000010000000000100102000020000\"/><path id=\"walking-lunge-m-m-torso\" d=\"~#_12UNH1DWz1BJI1BRy1T5)9.2K1kykU5waF4ykU5(2F5GoKgGhTdO1Pgw3NlW3FrB4UnV7S8K66.hI8VI1F2ItV5-2O8I4A4wknW8-7)c.h1zfUf_2U8PgB4nS8VY2)801022000020200100020000000200111010002200220002000000011010000011110010000002101100210010001001000120000000000021000\"/><path id=\"walking-lunge-m-m-shcap.l\" d=\"~~P*E1WxG1wP10\"/><path id=\"walking-lunge-m-m-upper.l\" d=\"~#F12P*E1WxG1K(E1**E1e)8a2N2SO1A3.5N1x3Y5KD1ya-i0Igxa-iX5KD1K1x3z3.5K2SO192d)8BgvXdPp0PmYdPp02000002000000100011100010000100000100000000010000101000020000020000001000000000\"/><path id=\"walking-lunge-m-m-elbowcap.l\" d=\"~~HHF1HIS1Dz10\"/><path id=\"walking-lunge-m-m-fore.l\" d=\"~#F12_FF1!KS1.GF1VRR1w1Iau_1P6yI1!2R9N1K2.1*w1(5BdnEbV7Ec-2*w1X1z2B4z9dSI1l(1I2zazaiz9FkD1Dh!bYi10000000210101000010101000000001200000101002000011010110000000200100000000000110\"/><path id=\"walking-lunge-m-m-fist.l\" d=\"~~HzG1Uz!1ww10\"/><path id=\"walking-lunge-m-m-shcap.r\" d=\"^74\"/><path id=\"walking-lunge-m-m-upper.r\" d=\"^75\"/><path id=\"walking-lunge-m-m-elbowcap.r\" d=\"^76\"/><path id=\"walking-lunge-m-m-fore.r\" d=\"^77\"/><path id=\"walking-lunge-m-m-fist.r\" d=\"^78\"/><path id=\"walking-lunge-m-m-eq0\" d=\"~MSGF1FS!1LPT30QF60EK3E6LE6OaQ0E6E6PaLEK3F6QE60FK3F6LF6PaQ0F6F6OaZ\"/><path id=\"walking-lunge-m-m-eq1\" d=\"~MS(E1SU_1LEK10QI90!z1J9LJ9yy2Q0J9J9xy2L!z1I9QJ90.z1I9LI9xy2Q0I9I9yy2Z\"/><path id=\"walking-lunge-m-m-eq2\" d=\"~MAFJ1YS*1LFK10QJ90.z1I9LI9xy2Q0I9I9yy2L.z1J9QI90!z1J9LJ9yy2Q0J9J9xy2Z\"/><path id=\"walking-lunge-m-m-eq3\" d=\"^79\"/><path id=\"walking-lunge-m-m-eq4\" d=\"^80\"/><path id=\"walking-lunge-m-m-eq5\" d=\"^81\"/><path id=\"walking-lunge-m-mf-thigh.l\" d=\"^44\"/><path id=\"walking-lunge-m-mf-kneecap.l\" d=\"^45\"/><path id=\"walking-lunge-m-mf-shank.l\" d=\"^46\"/><path id=\"walking-lunge-m-mf-foot.l\" d=\"^47\"/><path id=\"walking-lunge-m-mf-thigh.r\" d=\"^55\"/><path id=\"walking-lunge-m-mf-kneecap.r\" d=\"^56\"/><path id=\"walking-lunge-m-mf-shank.r\" d=\"^57\"/><path id=\"walking-lunge-m-mf-foot.r\" d=\"^58\"/><path id=\"walking-lunge-m-mo-0\" d=\"^53\"/><path id=\"walking-lunge-m-mo-1\" d=\"^54\"/><path id=\"walking-lunge-m-mo-2\" d=\"^44\"/><path id=\"walking-lunge-m-mo-3\" d=\"^45\"/><path id=\"walking-lunge-m-mo-4\" d=\"^46\"/><path id=\"walking-lunge-m-mo-5\" d=\"^47\"/><path id=\"walking-lunge-m-mo-6\" d=\"^48\"/><path id=\"walking-lunge-m-mo-7\" d=\"^49\"/><path id=\"walking-lunge-m-mo-8\" d=\"^50\"/><path id=\"walking-lunge-m-mo-9\" d=\"^51\"/><path id=\"walking-lunge-m-mo-10\" d=\"^52\"/><path id=\"walking-lunge-m-mo-11\" d=\"^55\"/><path id=\"walking-lunge-m-mo-12\" d=\"^56\"/><path id=\"walking-lunge-m-mo-13\" d=\"^57\"/><path id=\"walking-lunge-m-mo-14\" d=\"^58\"/><path id=\"walking-lunge-m-mo-15\" d=\"^48\"/><path id=\"walking-lunge-m-mo-16\" d=\"^49\"/><path id=\"walking-lunge-m-mo-17\" d=\"^50\"/><path id=\"walking-lunge-m-mo-18\" d=\"^51\"/><path id=\"walking-lunge-m-mo-19\" d=\"^52\"/><path id=\"walking-lunge-m-mo-20\" d=\"^62\"/><path id=\"walking-lunge-m-mo-21\" d=\"^63\"/><path id=\"walking-lunge-m-mo-22\" d=\"^64\"/><path id=\"walking-lunge-m-mo-23\" d=\"^62\"/><path id=\"walking-lunge-m-mo-24\" d=\"^63\"/><path id=\"walking-lunge-m-mo-25\" d=\"^64\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#walking-lunge-m-dots)\"/>\n  <path class=\"floorline\" d=\"^59\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-st-thigh.l\"/><use href=\"#walking-lunge-m-st-kneecap.l\"/><use href=\"#walking-lunge-m-st-shank.l\"/><use href=\"#walking-lunge-m-st-foot.l\"/><use href=\"#walking-lunge-m-st-shcap.l\"/><use href=\"#walking-lunge-m-st-upper.l\"/><use href=\"#walking-lunge-m-st-elbowcap.l\"/><use href=\"#walking-lunge-m-st-fore.l\"/><use href=\"#walking-lunge-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-st-thigh.l\"/><use href=\"#walking-lunge-m-st-kneecap.l\"/><use href=\"#walking-lunge-m-st-shank.l\"/><use href=\"#walking-lunge-m-st-foot.l\"/><use href=\"#walking-lunge-m-st-shcap.l\"/><use href=\"#walking-lunge-m-st-upper.l\"/><use href=\"#walking-lunge-m-st-elbowcap.l\"/><use href=\"#walking-lunge-m-st-fore.l\"/><use href=\"#walking-lunge-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-st-head\"/><use href=\"#walking-lunge-m-st-torso\"/><use href=\"#walking-lunge-m-st-thigh.r\"/><use href=\"#walking-lunge-m-st-kneecap.r\"/><use href=\"#walking-lunge-m-st-shank.r\"/><use href=\"#walking-lunge-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-st-head\"/><use href=\"#walking-lunge-m-st-torso\"/><use href=\"#walking-lunge-m-st-thigh.r\"/><use href=\"#walking-lunge-m-st-kneecap.r\"/><use href=\"#walking-lunge-m-st-shank.r\"/><use href=\"#walking-lunge-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-st-shcap.r\"/><use href=\"#walking-lunge-m-st-upper.r\"/><use href=\"#walking-lunge-m-st-elbowcap.r\"/><use href=\"#walking-lunge-m-st-fore.r\"/><use href=\"#walking-lunge-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-st-shcap.r\"/><use href=\"#walking-lunge-m-st-upper.r\"/><use href=\"#walking-lunge-m-st-elbowcap.r\"/><use href=\"#walking-lunge-m-st-fore.r\"/><use href=\"#walking-lunge-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-solid\" d=\"^60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-g0-eq1.dumbbell.1-0\"/><use href=\"#walking-lunge-m-g0-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-g0-eq1.dumbbell.1-0\"/><use href=\"#walking-lunge-m-g0-eq1.dumbbell.2-1\"/></g></g><g class=\"far\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-g0-thigh.l\"/><use href=\"#walking-lunge-m-g0-kneecap.l\"/><use href=\"#walking-lunge-m-g0-shank.l\"/><use href=\"#walking-lunge-m-g0-foot.l\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-g0-thigh.l\"/><use href=\"#walking-lunge-m-g0-kneecap.l\"/><use href=\"#walking-lunge-m-g0-shank.l\"/><use href=\"#walking-lunge-m-g0-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-g0-head\"/><use href=\"#walking-lunge-m-g0-torso\"/><use href=\"#walking-lunge-m-g0-thigh.r\"/><use href=\"#walking-lunge-m-g0-kneecap.r\"/><use href=\"#walking-lunge-m-g0-shank.r\"/><use href=\"#walking-lunge-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-g0-head\"/><use href=\"#walking-lunge-m-g0-torso\"/><use href=\"#walking-lunge-m-g0-thigh.r\"/><use href=\"#walking-lunge-m-g0-kneecap.r\"/><use href=\"#walking-lunge-m-g0-shank.r\"/><use href=\"#walking-lunge-m-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-g0-shcap.r\"/><use href=\"#walking-lunge-m-g0-upper.r\"/><use href=\"#walking-lunge-m-g0-elbowcap.r\"/><use href=\"#walking-lunge-m-g0-fore.r\"/><use href=\"#walking-lunge-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-g0-shcap.r\"/><use href=\"#walking-lunge-m-g0-upper.r\"/><use href=\"#walking-lunge-m-g0-elbowcap.r\"/><use href=\"#walking-lunge-m-g0-fore.r\"/><use href=\"#walking-lunge-m-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-g0-eq2.dumbbell.1-0\"/><use href=\"#walking-lunge-m-g0-eq2.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-g0-eq2.dumbbell.1-0\"/><use href=\"#walking-lunge-m-g0-eq2.dumbbell.2-1\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-solid\" d=\"^61\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-g1-eq1.dumbbell.1-0\"/><use href=\"#walking-lunge-m-g1-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-g1-eq1.dumbbell.1-0\"/><use href=\"#walking-lunge-m-g1-eq1.dumbbell.2-1\"/></g></g><g class=\"far\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-g1-thigh.l\"/><use href=\"#walking-lunge-m-g1-kneecap.l\"/><use href=\"#walking-lunge-m-g1-shank.l\"/><use href=\"#walking-lunge-m-g1-foot.l\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-g1-thigh.l\"/><use href=\"#walking-lunge-m-g1-kneecap.l\"/><use href=\"#walking-lunge-m-g1-shank.l\"/><use href=\"#walking-lunge-m-g1-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-g1-head\"/><use href=\"#walking-lunge-m-g1-torso\"/><use href=\"#walking-lunge-m-g1-thigh.r\"/><use href=\"#walking-lunge-m-g1-kneecap.r\"/><use href=\"#walking-lunge-m-g1-shank.r\"/><use href=\"#walking-lunge-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-g1-head\"/><use href=\"#walking-lunge-m-g1-torso\"/><use href=\"#walking-lunge-m-g1-thigh.r\"/><use href=\"#walking-lunge-m-g1-kneecap.r\"/><use href=\"#walking-lunge-m-g1-shank.r\"/><use href=\"#walking-lunge-m-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-g1-shcap.r\"/><use href=\"#walking-lunge-m-g1-upper.r\"/><use href=\"#walking-lunge-m-g1-elbowcap.r\"/><use href=\"#walking-lunge-m-g1-fore.r\"/><use href=\"#walking-lunge-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-g1-shcap.r\"/><use href=\"#walking-lunge-m-g1-upper.r\"/><use href=\"#walking-lunge-m-g1-elbowcap.r\"/><use href=\"#walking-lunge-m-g1-fore.r\"/><use href=\"#walking-lunge-m-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^61\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-g1-eq2.dumbbell.1-0\"/><use href=\"#walking-lunge-m-g1-eq2.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-g1-eq2.dumbbell.1-0\"/><use href=\"#walking-lunge-m-g1-eq2.dumbbell.2-1\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-solid\" d=\"^62\"/><path class=\"disc\" d=\"^63\"/><path class=\"disc\" d=\"^64\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-e-thigh.l\"/><use href=\"#walking-lunge-m-e-kneecap.l\"/><use href=\"#walking-lunge-m-e-shank.l\"/><use href=\"#walking-lunge-m-e-foot.l\"/><use href=\"#walking-lunge-m-e-shcap.l\"/><use href=\"#walking-lunge-m-e-upper.l\"/><use href=\"#walking-lunge-m-e-elbowcap.l\"/><use href=\"#walking-lunge-m-e-fore.l\"/><use href=\"#walking-lunge-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-e-thigh.l\"/><use href=\"#walking-lunge-m-e-kneecap.l\"/><use href=\"#walking-lunge-m-e-shank.l\"/><use href=\"#walking-lunge-m-e-foot.l\"/><use href=\"#walking-lunge-m-e-shcap.l\"/><use href=\"#walking-lunge-m-e-upper.l\"/><use href=\"#walking-lunge-m-e-elbowcap.l\"/><use href=\"#walking-lunge-m-e-fore.l\"/><use href=\"#walking-lunge-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-e-head\"/><use href=\"#walking-lunge-m-e-torso\"/><use href=\"#walking-lunge-m-e-thigh.r\"/><use href=\"#walking-lunge-m-e-kneecap.r\"/><use href=\"#walking-lunge-m-e-shank.r\"/><use href=\"#walking-lunge-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-e-head\"/><use href=\"#walking-lunge-m-e-torso\"/><use href=\"#walking-lunge-m-e-thigh.r\"/><use href=\"#walking-lunge-m-e-kneecap.r\"/><use href=\"#walking-lunge-m-e-shank.r\"/><use href=\"#walking-lunge-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-e-shcap.r\"/><use href=\"#walking-lunge-m-e-upper.r\"/><use href=\"#walking-lunge-m-e-elbowcap.r\"/><use href=\"#walking-lunge-m-e-fore.r\"/><use href=\"#walking-lunge-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#walking-lunge-m-e-shcap.r\"/><use href=\"#walking-lunge-m-e-upper.r\"/><use href=\"#walking-lunge-m-e-elbowcap.r\"/><use href=\"#walking-lunge-m-e-fore.r\"/><use href=\"#walking-lunge-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^62\"/><path class=\"disc\" d=\"^63\"/><path class=\"disc\" d=\"^64\"/><circle class=\"joint\" cx=\"184.45\" cy=\"202.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"184.45\" cy=\"250.44\" r=\"2.25\"/><circle class=\"joint\" cx=\"180.84\" cy=\"271.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"243.32\" cy=\"266.42\" r=\"2.25\"/></g><mask id=\"walking-lunge-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#walking-lunge-m-m-head\" fill=\"#000\"/><use href=\"#walking-lunge-m-m-torso\" fill=\"#000\"/><use href=\"#walking-lunge-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#walking-lunge-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#walking-lunge-m-mf-shank.l\" fill=\"#000\"/><use href=\"#walking-lunge-m-mf-foot.l\" fill=\"#000\"/><use href=\"#walking-lunge-m-m-shcap.l\" fill=\"#000\"/><use href=\"#walking-lunge-m-m-upper.l\" fill=\"#000\"/><use href=\"#walking-lunge-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#walking-lunge-m-m-fore.l\" fill=\"#000\"/><use href=\"#walking-lunge-m-m-fist.l\" fill=\"#000\"/><use href=\"#walking-lunge-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#walking-lunge-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#walking-lunge-m-mf-shank.r\" fill=\"#000\"/><use href=\"#walking-lunge-m-mf-foot.r\" fill=\"#000\"/><use href=\"#walking-lunge-m-m-shcap.r\" fill=\"#000\"/><use href=\"#walking-lunge-m-m-upper.r\" fill=\"#000\"/><use href=\"#walking-lunge-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#walking-lunge-m-m-fore.r\" fill=\"#000\"/><use href=\"#walking-lunge-m-m-fist.r\" fill=\"#000\"/><use href=\"#walking-lunge-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#walking-lunge-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#walking-lunge-m-mmask)\"><g class=\"u-stroke\"><use href=\"#walking-lunge-m-m-head\"/><use href=\"#walking-lunge-m-m-torso\"/><use href=\"#walking-lunge-m-m-shcap.l\"/><use href=\"#walking-lunge-m-m-upper.l\"/><use href=\"#walking-lunge-m-m-elbowcap.l\"/><use href=\"#walking-lunge-m-m-fore.l\"/><use href=\"#walking-lunge-m-m-fist.l\"/><use href=\"#walking-lunge-m-m-shcap.r\"/><use href=\"#walking-lunge-m-m-upper.r\"/><use href=\"#walking-lunge-m-m-elbowcap.r\"/><use href=\"#walking-lunge-m-m-fore.r\"/><use href=\"#walking-lunge-m-m-fist.r\"/><use href=\"#walking-lunge-m-m-eq0\"/><use href=\"#walking-lunge-m-m-eq1\"/><use href=\"#walking-lunge-m-m-eq2\"/><use href=\"#walking-lunge-m-m-eq3\"/><use href=\"#walking-lunge-m-m-eq4\"/><use href=\"#walking-lunge-m-m-eq5\"/></g></g><g class=\"mistake-layer\"><path class=\"leader m\" d=\"~MJRJ1HUH1L0Ge\"/><path class=\"leader m\" d=\"~MJAJ1SAz1L0RV4\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"walking-lunge-m-chest\" data-key=\"chest\" data-cue=\"The trunk pitches forward over the front thigh at the bottom.\" class=\"plate-callout two m\" style=\"left:64.25%;top:59.22%\" aria-pressed=\"true\">Trunk pitches<br>forward</button><button type=\"button\" id=\"walking-lunge-m-head\" data-key=\"head\" data-cue=\"The head and chest drop toward the front knee.\" class=\"plate-callout m\" style=\"left:56.98%;top:34.36%\" aria-pressed=\"false\">Head drops</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "shin",
        cues: [{ key: "shin", cue: "At the bottom, keep the front shin about vertical." }, { key: "hips", cue: "Lower the hips toward the floor instead of driving them forward." }, { key: "chest", cue: "Keep the trunk upright through the step." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "chest",
        cues: [{ key: "chest", cue: "The trunk pitches forward over the front thigh at the bottom." }, { key: "head", cue: "The head and chest drop toward the front knee." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Trunk pitches forward</b><span>The trunk pitches forward over the front thigh at the bottom.</span></li><li><b>Head drops</b><span>The head and chest drop toward the front knee.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower controlled, rise\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>Controlled</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Rise</b><span>&nbsp;</span></div></div></div>",
      alt: "Walking lunge with dumbbells, side view, one step. One leg steps forward and lands heel first, and the body lowers until the back knee lightly touches the floor, front shin near vertical, trunk upright. The back foot then steps forward for the next step.",
      mistakeAlt: "Walking Lunge: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP: the card gives no thumb, contact or wrist claim."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Stand with feet about hip width apart, dumbbells at your sides.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-walk-twist",
          "cat-lunge"
        ],
        "note": "c6, c12 (card grip.type)"
      }
    },
    {
      "kind": "position",
      "text": "Step forward heel first, weight onto it slowly, no sideways tilt.",
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "ace-walk-twist"
        ],
        "note": "c5"
      }
    },
    {
      "kind": "position",
      "text": "Lower slowly, back knee toward the front heel, until it lightly touches.",
      "zoom": "front-shin",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH",
          "WEAK"
        ],
        "sources": [
          "cat-lunge",
          "ace-walk-twist"
        ],
        "note": "c2, c3, c8"
      }
    },
    {
      "kind": "position",
      "text": "Push through the front foot to stand. Swing the back leg forward.",
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "ace-walk-twist"
        ],
        "note": "c4"
      }
    },
    {
      "kind": "finish",
      "text": "Keep alternating legs as you move forward.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH",
          "WEAK"
        ],
        "sources": [
          "cat-lunge",
          "ace-walk-twist"
        ],
        "note": "c1, c4"
      }
    }
  ],
  posture: [
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
          "cat-lunge"
        ],
        "note": "c2"
      }
    },
    {
      "key": "hips",
      "label": "Hips drop down",
      "detail": "Hips lower down, not forward. Aim the back knee at the front heel.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "zoom": "front-shin",
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "ace-walk-twist"
        ],
        "note": "c3"
      }
    },
    {
      "key": "trunk",
      "label": "Trunk upright",
      "detail": "Trunk upright. Go lighter until you can stay upright and controlled.",
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
          "cat-lunge"
        ],
        "note": "c7"
      }
    },
    {
      "key": "tilt",
      "label": "No sideways tilt",
      "detail": "No sideways tilt of the upper body.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "ace-walk-twist"
        ],
        "note": "c5"
      }
    },
    {
      "key": "drop",
      "label": "Dropping fast",
      "detail": "Lower slowly. Use a weight you can move smoothly.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-lunge"
        ],
        "note": "c8, c7"
      }
    }
  ],
  zooms: [
    {
      "key": "trunk",
      "chip": "Trunk",
      "heading": "Trunk angle",
      "kind": "posture",
      "feelRow": "lower-back"
    },
    {
      "key": "front-shin",
      "chip": "Shin",
      "heading": "Front shin",
      "kind": "posture"
    }
  ],
  chips: [
    "trunk",
    "front-shin",
    "feel"
  ],
  copy: {
    "setupLine": "Feet about hip width, dumbbells at your sides. Step forward heel first.",
    "mistakeLine": "Never let the chest pitch forward. Go lighter until you stay upright and controlled.",
    "cueLine": "Chest up, front shin vertical.",
    "variantLine": "Same form with a barbell instead of dumbbells."
  },
  mistakes: [],
  risks: [
    {
      "key": "heavy",
      "text": "Too heavy a load costs the upright trunk, the controlled descent and balance.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-lunge"
        ],
        "note": "c7"
      }
    },
    {
      "key": "crash",
      "text": "Crashing into the bottom position instead of lowering under control.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-lunge"
        ],
        "note": "c8"
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
    "cat-lunge",
    "ace-walk-twist",
    "bezerra-2021",
    "escamilla-2025",
    "nhs-knee",
    "nhs-knee-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/walking_lunge.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

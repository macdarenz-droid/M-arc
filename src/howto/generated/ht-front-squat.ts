// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=a86b9e4877cfc12876f153c4a566a898c78461ef1c2da8ea50b5fad750ccd86f
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_front_squat",
  name: "Front Squat",
  hashes: { inputsSha256: "a86b9e4877cfc12876f153c4a566a898c78461ef1c2da8ea50b5fad750ccd86f", golden: "322b5fdbcb5dfbe4d31d7a9158860d5a92d78d1bb8f6f34daaf7f5d31c7c3a58" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"front-squat-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"front-squat-n-st-head\" d=\"~#w12NWrSTmzHq-FmVh!fBhP7T9E3x3w4-3E7K6xaKeKk!4)avI8-gtAkX8!jR4wiY3yg!eG2Wg0000000020200001000001000011100100120000000000000010020000000000\"/><path id=\"front-squat-n-st-torso\" d=\"~#_12SBqDWqxPqxNpz8x6-23U7_fA8w6JaUeU58O4ElBjx8IbW3AeO3PiT4Hk)cDgOeW4E8G6GeBm)vO8EoT59I8dPaSeJ2A7-aR7GeF6R6!hF5!5YbB9N2A7BH2Do11100000000000010010000000000020000022001120000020020000000010001200021000000021010100100000010010110021000000000000\"/><path id=\"front-squat-n-st-thigh.r\" d=\"~#F12yRoFHI1IHoVxH1O2zav4P7DW1W4E7y2T3R1zN1y9*kK1VhKcxjx6-K1V2E3X5G6P1UW1A11mGaxsE8BgDB1U2JvAmyy110010020000000000100012000000001200002000001000000200120001011101111100020002010\"/><path id=\"front-squat-n-st-kneecap.r\" d=\"~~AGq_YV1DE10\"/><path id=\"front-squat-n-st-shank.r\" d=\"~#F12YEqYYV1zIqROU1S1GaD10y4wX1F5.6N2K3z3K_1J6-b2RaK6.bN3I_1I2K3E5.6I4!W1x12R1IaEbAaTbSl1wjSbWl01110000001012002120002100020000000002000020001001000100000001000000000210101010\"/><path id=\"front-squat-n-st-foot.r\" d=\"~#o2wYqFR)1VErKV(1_a_2yf-6JmXkyJ2z2xx2X4Iw1G7Ik3Oz1(3z9GbWoO9TjAm000001100202201210000001000002100000200002100010\"/><path id=\"front-squat-n-g0-head\" d=\"~#w12FEsJyr-.qRUqXiUeThF6K9*3G3_3E3K7-5Ta.cGlS5RabR8Vg)1UkI7Akz3Yh(4wfwgK3Ng0200002100101010100000010000020002000000101000000000210020010010\"/><path id=\"front-squat-n-g0-torso\" d=\"~#_12HKqFxvR_q*-tV7B7I39D6PgS7Y6D9NfH5qB2Kl)hO9TbY2NeO2YiE3AlRbDhKdD5-7E5Ve.jOx1-6.oV58E73N9WdY1H7zaK8-e(4x8FhY4Y5!bB8!1(7VI2!i02011110000001020002000010002010010020210000000111000010101002100100000002100100200000000001210000000021011000110000\"/><path id=\"front-squat-n-g0-thigh.r\" d=\"~#F12Y)nS.P1VynTwP1.7E6poYB1_A1hI8fx4RrOx1R5Bm)b)cKlT7*uRu)3nG8I1Fx1(F1qnK5I8GsS9(9HE1DlDnFD1Sd01000000000020001000100000011102100001001000120000002000202000001001010100100221\"/><path id=\"front-squat-n-g0-kneecap.r\" d=\"~~!EvAxX1DE10\"/><path id=\"front-squat-n-g0-shank.r\" d=\"~#F12AIvDNW1Bxw1IIV1F6G8sgVlNS1_7R3Y3*1AoxV1FbO7!4G93Rdwu.R1hE4I1K8GtPN1vfN3-9TeU3GkWd-8_g6Po00000002000000000000010110000000010000020001002000001002000002021010010000010000\"/><path id=\"front-squat-n-g0-foot.r\" d=\"~#o2UYqNR)1XErOV(1PaY2Ue*6Pl*kYG2-2x)1B4Iv)6-j0Ey1F4*8Eb!nX9*iJm010120000202002000000000000012220000000000101000\"/><path id=\"front-squat-n-g1-head\" d=\"~#w12J*sU-vGTrxFv*j!czi_4x9.4R3S3V2V7-4xb*aImJ6zaeK8OgO3FlR5HkI1FhP6PdFh-4yg0000002002000000000000010120000010000200002100000020002200210100\"/><path id=\"front-squat-n-g1-torso\" d=\"~#_12UYqwTz1GGr)Jy1-6*8O4nA4PhW6S7D7Jgw5U1w1IlTfxb*bU1UeE1(iV1AmR9Fi*b_5G7.3zf.gzz1V4Epx6H1B5H1J8NbuP7)8V9IfA3zaAgF4y5PbX6w1H9)J2Dc02200100100200010101000002000100001010200000002000000110102200000002100000000002000000010100000100002001000010010100\"/><path id=\"front-squat-n-g1-thigh.r\" d=\"~#F12!GnWVV1.AmRGV1R9G2du_P1Nh*3G7)1O3*B1OiGeXhGg*6Vmy2VE1Ke.3w1)7H2NN1(mcvG8E5GmDkJpUvwtHcJF1X300010100010000020000001012120010100000000000020200000000101010020000000020000000\"/><path id=\"front-squat-n-g1-kneecap.r\" d=\"~~NDw1yWX1DE10\"/><path id=\"front-squat-n-g1-shank.r\" d=\"~#F12(Iw1J)W1KBx1I)V1(6R7w1k*qPO1D8X2!3K1NtVR1ycE6_5X8H1Kdwz1xN13x4hT8*x1YH1phH4I9XeY1TlPbTaYfO2Jo01111020001010000000101010022000100010010000100011000100201011011000000010011001\"/><path id=\"front-squat-n-g1-foot.r\" d=\"~#o2NYqJR)1IErIV(1PaY2Pe)6Pl*kWG2-2x)1B4Ov)6Vj0Gy1D4)8Bb!nX9.iHm000001010000000101000010001100111100000000010102\"/><path id=\"front-squat-n-e-thigh.l\" d=\"~#F12D!mNA_1.VlTH_1O9H24A1DT1.6X6X4O3z2)G1s-kG9XhJ1BjFcVG1J5z3U2)5U5WT1n1x1X9tXaFsyB1JgNvE2Dy1-l10000000020000002010002100000012002000000000002100000200000100100011100200000101\"/><path id=\"front-squat-n-e-kneecap.l\" d=\"~~URvJGX1DE10\"/><path id=\"front-squat-n-e-shank.l\" d=\"~#F12UVvDVW1-Jw1KTV1P6x8ugInHR1!7E3_3-1_pRT1PbB7F5x9cOdPvIP1bz4B1O8XuyK1rhU3T9Re_2Xk(cO9PglPo00210101000000100001011000010120000010001000101012002020011000100000000000000000\"/><path id=\"front-squat-n-e-foot.l\" d=\"~#o2AYqJR)1XDrIV(1NaY2Se*6Dl)kWG2-2z)1B4Ovx7-j2zy1D4B9BbWn-9OiNm010001000020000101000020000002200012101000000000\"/><path id=\"front-squat-n-e-shcap.l\" d=\"~~DRpSzK1wH10\"/><path id=\"front-squat-n-e-upper.l\" d=\"~#F12Y)qHKN1)HqXNN1B5415JrB5X3I2*1v*eO3Eh.6GeS1IfPa-dU6T1N1B3A3_rt28z5w1X9HfPnN9Pjz2(kIe00000000002100001010100000200200000100000011011010002000000000010101110010000000\"/><path id=\"front-squat-n-e-elbowcap.l\" d=\"~~UFvUPJ1_u0\"/><path id=\"front-squat-n-e-fore.l\" d=\"~#F12_Ww1JUI1.Yw1RYI1ey2feX659H3bN1B8)3w7UaS8W4Yc4-7V4w1z1S2x2V3R50lw2jSmD2TaGgEdE7Oj121100200000111000000000200000210100020101000200200200000000020200120010000001001\"/><path id=\"front-squat-n-e-palm.l\" d=\"~#o2SFvNJI1Gyw1I!H1T6R7H5B2Na(2WcB5Y8B1Hdv_9G1w5-4R5k-mziRe!1000000110100000001010100200000002200000022000020\"/><path id=\"front-squat-n-e-head\" d=\"~#w12JXtH-A1GOsOzA1El_aRi_2K8X5*3D3.1)7R3KbT8KnN7G9F1K8*fE5UlB3NkmJgH8WbPiR6Sf2100000001200120000000200000001000110100001000000000101000000001\"/><path id=\"front-squat-n-e-torso\" d=\"~#_12JDr_HF1*_r-DE1X5xa.4I1(1wiW5H8A5DhU4A2!3.kTdRcxcaWe8wjawnB7Jj*9S6V6E2OfBdTA1*1VpO6S1O4(1S7Ua1U7X7XaRfH1xcYeY3!4SbG51!9.K2A410000000100000000000000001000020001200012000000000000111012100101000000010100000010002200002000001200010100020010010\"/><path id=\"front-squat-n-e-thigh.r\" d=\"^18\"/><path id=\"front-squat-n-e-kneecap.r\" d=\"^19\"/><path id=\"front-squat-n-e-shank.r\" d=\"^20\"/><path id=\"front-squat-n-e-foot.r\" d=\"^21\"/><path id=\"front-squat-n-e-shcap.r\" d=\"^22\"/><path id=\"front-squat-n-e-upper.r\" d=\"^23\"/><path id=\"front-squat-n-e-elbowcap.r\" d=\"^24\"/><path id=\"front-squat-n-e-fore.r\" d=\"^25\"/><path id=\"front-squat-n-e-palm.r\" d=\"^26\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#front-squat-n-dots)\"/>\n  <path class=\"datum\" d=\"~MPGtFBA2L0ENY1\"/><path class=\"floorline\" d=\"M54 339.5H246\"/><path class=\"eq\" d=\"~M!OG1Pwy2L0Oz-1Q0E6E6F*Y1L)G1F6QE60wH1F6LF6F*Y1Q0F6F6E*Y1LwH1E6QF60)G1E6Z\"/><path class=\"eq-thin\" d=\"M207 300.6h1.2M207 294.2h1.2M207 287.8h1.2M207 281.4h1.2M207 275h1.2M207 268.6h1.2M207 262.2h1.2M207 255.8h1.2M207 249.4h1.2M207 243h1.2M207 236.6h1.2M207 230.2h1.2M207 223.8h1.2M207 217.4h1.2M207 211h1.2M207 204.6h1.2M207 198.2h1.2M207 191.8h1.2M207 185.4h1.2M207 179h1.2M207 172.6h1.2M207 166.2h1.2M207 159.8h1.2M207 153.4h1.2M207 147h1.2M207 140.6h1.2M207 134.2h1.2M207 127.8h1.2M207 121.4h1.2M207 115h1.2M207 108.6h1.2M207 102.2h1.2M207 95.8h1.2M207 89.4h1.2M207 83h1.2M207 76.6h1.2M207 70.2h1.2M207 63.8h1.2\"/><path class=\"eq\" d=\"~MPKhyBO1LwPm0Qwk0).l)jL)jwkQ0)j)j)jL).lwkQ)j0w!lwkLwk)jQ0wkwkwkZ\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#front-squat-n-st-head\"/><use href=\"#front-squat-n-st-torso\"/><use href=\"#front-squat-n-st-thigh.r\"/><use href=\"#front-squat-n-st-kneecap.r\"/><use href=\"#front-squat-n-st-shank.r\"/><use href=\"#front-squat-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#front-squat-n-st-head\"/><use href=\"#front-squat-n-st-torso\"/><use href=\"#front-squat-n-st-thigh.r\"/><use href=\"#front-squat-n-st-kneecap.r\"/><use href=\"#front-squat-n-st-shank.r\"/><use href=\"#front-squat-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#front-squat-n-g0-head\"/><use href=\"#front-squat-n-g0-torso\"/><use href=\"#front-squat-n-g0-thigh.r\"/><use href=\"#front-squat-n-g0-kneecap.r\"/><use href=\"#front-squat-n-g0-shank.r\"/><use href=\"#front-squat-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#front-squat-n-g0-head\"/><use href=\"#front-squat-n-g0-torso\"/><use href=\"#front-squat-n-g0-thigh.r\"/><use href=\"#front-squat-n-g0-kneecap.r\"/><use href=\"#front-squat-n-g0-shank.r\"/><use href=\"#front-squat-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#front-squat-n-g1-head\"/><use href=\"#front-squat-n-g1-torso\"/><use href=\"#front-squat-n-g1-thigh.r\"/><use href=\"#front-squat-n-g1-kneecap.r\"/><use href=\"#front-squat-n-g1-shank.r\"/><use href=\"#front-squat-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#front-squat-n-g1-head\"/><use href=\"#front-squat-n-g1-torso\"/><use href=\"#front-squat-n-g1-thigh.r\"/><use href=\"#front-squat-n-g1-kneecap.r\"/><use href=\"#front-squat-n-g1-shank.r\"/><use href=\"#front-squat-n-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-line\" d=\"~~PVn!GJ1wU50\"/><path class=\"eq-thin\" d=\"~~!Vo!GJ1UT41\"/><path class=\"eq-solid\" d=\"~~PVs!GJ1wk0\"/><path class=\"eq-pin\" d=\"~~Fzt!GJ1F60\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#front-squat-n-e-thigh.l\"/><use href=\"#front-squat-n-e-kneecap.l\"/><use href=\"#front-squat-n-e-shank.l\"/><use href=\"#front-squat-n-e-foot.l\"/><use href=\"#front-squat-n-e-shcap.l\"/><use href=\"#front-squat-n-e-upper.l\"/><use href=\"#front-squat-n-e-elbowcap.l\"/><use href=\"#front-squat-n-e-fore.l\"/><use href=\"#front-squat-n-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#front-squat-n-e-thigh.l\"/><use href=\"#front-squat-n-e-kneecap.l\"/><use href=\"#front-squat-n-e-shank.l\"/><use href=\"#front-squat-n-e-foot.l\"/><use href=\"#front-squat-n-e-shcap.l\"/><use href=\"#front-squat-n-e-upper.l\"/><use href=\"#front-squat-n-e-elbowcap.l\"/><use href=\"#front-squat-n-e-fore.l\"/><use href=\"#front-squat-n-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#front-squat-n-e-head\"/><use href=\"#front-squat-n-e-torso\"/><use href=\"#front-squat-n-e-thigh.r\"/><use href=\"#front-squat-n-e-kneecap.r\"/><use href=\"#front-squat-n-e-shank.r\"/><use href=\"#front-squat-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#front-squat-n-e-head\"/><use href=\"#front-squat-n-e-torso\"/><use href=\"#front-squat-n-e-thigh.r\"/><use href=\"#front-squat-n-e-kneecap.r\"/><use href=\"#front-squat-n-e-shank.r\"/><use href=\"#front-squat-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#front-squat-n-e-shcap.r\"/><use href=\"#front-squat-n-e-upper.r\"/><use href=\"#front-squat-n-e-elbowcap.r\"/><use href=\"#front-squat-n-e-fore.r\"/><use href=\"#front-squat-n-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#front-squat-n-e-shcap.r\"/><use href=\"#front-squat-n-e-upper.r\"/><use href=\"#front-squat-n-e-elbowcap.r\"/><use href=\"#front-squat-n-e-fore.r\"/><use href=\"#front-squat-n-e-palm.r\"/></g></g><path class=\"eq-solid\" d=\"^36\"/><path class=\"eq-pin\" d=\"^37\"/><path class=\"eq-cable m-line\" d=\"~MP*tJ-tLO1V7L.2D1Lz2D2Lz1_2L0w3LA1_2LA2D2L!2D1Lw31L!2z1LA2B2LA1X2L0z3Lz1X2Lz2B2L.2z1\"/><circle class=\"joint\" cx=\"137.47\" cy=\"230.97\" r=\"2.25\"/><circle class=\"joint\" cx=\"165.02\" cy=\"227.94\" r=\"2.25\"/><circle class=\"joint\" cx=\"116.35\" cy=\"286.94\" r=\"2.25\"/><circle class=\"joint\" cx=\"167.81\" cy=\"283.1\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#y20F_tJ-vE_tzPv11201020102010201i0021122112002112002112201102211c21102010201020000110000000100000001000000010000000100000200100000000021000000000001000002000000000000011000000000210010101100100011001000010000000\"/><path class=\"arrow\" d=\"~Mw-tH*H1LTiRB1LAY1WB1Z\"/></g><path class=\"leader\" d=\"M165.02 227.94L217 212H227\"/><circle class=\"anchor\" cx=\"165.02\" cy=\"227.94\" r=\"1.5\"/><path class=\"leader\" d=\"M147.8 248.44L217 264H227\"/><circle class=\"anchor\" cx=\"147.8\" cy=\"248.44\" r=\"1.5\"/><path class=\"leader\" d=\"M135.63 339L127.35 323H117.35\"/><circle class=\"anchor\" cx=\"135.63\" cy=\"339\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"front-squat-n-elbows\" data-key=\"elbows\" data-cue=\"Keep your elbows up so your shoulders hold the bar.\" class=\"plate-callout\" style=\"left:62.01%;top:53.07%\" aria-pressed=\"true\">Elbows high</button><button type=\"button\" id=\"front-squat-n-chest\" data-key=\"chest\" data-cue=\"Keep your torso upright on the way down and up.\" class=\"plate-callout\" style=\"left:62.01%;top:67.6%\" aria-pressed=\"false\">Chest tall</button><button type=\"button\" id=\"front-squat-n-foot\" data-key=\"foot\" data-cue=\"Stay balanced over the whole foot, knees in line with your feet.\" class=\"plate-callout\" style=\"left:8.38%;top:84.08%\" aria-pressed=\"false\">Whole foot</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"front-squat-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"front-squat-m-st-head\" d=\"^0\"/><path id=\"front-squat-m-st-torso\" d=\"^1\"/><path id=\"front-squat-m-st-thigh.r\" d=\"^2\"/><path id=\"front-squat-m-st-kneecap.r\" d=\"^3\"/><path id=\"front-squat-m-st-shank.r\" d=\"^4\"/><path id=\"front-squat-m-st-foot.r\" d=\"^5\"/><path id=\"front-squat-m-g0-head\" d=\"^6\"/><path id=\"front-squat-m-g0-torso\" d=\"^7\"/><path id=\"front-squat-m-g0-thigh.r\" d=\"^8\"/><path id=\"front-squat-m-g0-kneecap.r\" d=\"^9\"/><path id=\"front-squat-m-g0-shank.r\" d=\"^10\"/><path id=\"front-squat-m-g0-foot.r\" d=\"^11\"/><path id=\"front-squat-m-g1-head\" d=\"^12\"/><path id=\"front-squat-m-g1-torso\" d=\"^13\"/><path id=\"front-squat-m-g1-thigh.r\" d=\"^14\"/><path id=\"front-squat-m-g1-kneecap.r\" d=\"^15\"/><path id=\"front-squat-m-g1-shank.r\" d=\"^16\"/><path id=\"front-squat-m-g1-foot.r\" d=\"^17\"/><path id=\"front-squat-m-e-thigh.l\" d=\"^18\"/><path id=\"front-squat-m-e-kneecap.l\" d=\"^19\"/><path id=\"front-squat-m-e-shank.l\" d=\"^20\"/><path id=\"front-squat-m-e-foot.l\" d=\"^21\"/><path id=\"front-squat-m-e-shcap.l\" d=\"^22\"/><path id=\"front-squat-m-e-upper.l\" d=\"^23\"/><path id=\"front-squat-m-e-elbowcap.l\" d=\"^24\"/><path id=\"front-squat-m-e-fore.l\" d=\"^25\"/><path id=\"front-squat-m-e-palm.l\" d=\"^26\"/><path id=\"front-squat-m-e-head\" d=\"^27\"/><path id=\"front-squat-m-e-torso\" d=\"^28\"/><path id=\"front-squat-m-e-thigh.r\" d=\"^18\"/><path id=\"front-squat-m-e-kneecap.r\" d=\"^19\"/><path id=\"front-squat-m-e-shank.r\" d=\"^20\"/><path id=\"front-squat-m-e-foot.r\" d=\"^21\"/><path id=\"front-squat-m-e-shcap.r\" d=\"^22\"/><path id=\"front-squat-m-e-upper.r\" d=\"^23\"/><path id=\"front-squat-m-e-elbowcap.r\" d=\"^24\"/><path id=\"front-squat-m-e-fore.r\" d=\"^25\"/><path id=\"front-squat-m-e-palm.r\" d=\"^26\"/><path id=\"front-squat-m-m-head\" d=\"~#w12JTuUGB1GIt.TA1zlYaRi(2K8V5)3A3-1.7V3RbV8GnP7K9A1I8*fz5WlI3HkmPgD8YbPiO6Sf0010010002000000002002010100002000020002002000000001010200100012\"/><path id=\"front-squat-m-m-torso\" d=\"~#_12WysN.F1zXsIXE1-4Bdx8I23_i_4(8N3ShP3Y2_7IjT9*b*b3Ueawj8(mI7Jj)9U6T6K2OfEdTA1x2TpT8D68F9AaW1rS7R6ObXf9IdPdD4W1J8.4B1Jd*K2J400000200110101100000000002002010000002020000101110010022000011000100002000000000000210010010002000000000100200001011\"/><path id=\"front-squat-m-m-shcap.l\" d=\"~~NBqSTK1wH10\"/><path id=\"front-squat-m-m-upper.l\" d=\"~#F12PFqFzN1V*pIDK1R2E785JhJB1k.56-2V7Iw1y2OiI5GdGe*bxhTsx2.1O4V3Nd_D174E3)6Tdw4-2HpN7AiNjFg00020000012000001000100000200000001010001020000000010100200000000000020001000000\"/><path id=\"front-squat-m-m-elbowcap.l\" d=\"~~!PtPxV1_u0\"/><path id=\"front-squat-m-m-fore.l\" d=\"~#F12SOv!BV1xHvK_V1R2N7fO1P1.w1x4P6V1U1I3NmR7DaE1_9J4!bV2PmA1w2A2J7P7zw1sE1c!7J8W4NbVfw2)eX6Bi02101010000000000002000020100020020000101110000001010000001200200012101000000000\"/><path id=\"front-squat-m-m-palm.l\" d=\"~#o2P_vUGO1GWw1.BP1F4IaP4y6D2yeAbUeF5_aF7Pgw6Dcy7!4E3X6P5IA1K6Bd010200110000002100100000100020000020000000000001\"/><path id=\"front-squat-m-m-shcap.r\" d=\"^46\"/><path id=\"front-squat-m-m-upper.r\" d=\"^47\"/><path id=\"front-squat-m-m-elbowcap.r\" d=\"^48\"/><path id=\"front-squat-m-m-fore.r\" d=\"^49\"/><path id=\"front-squat-m-m-palm.r\" d=\"^50\"/><path id=\"front-squat-m-m-eq0\" d=\"~~wJt!xK1wk0\"/><path id=\"front-squat-m-m-eq1\" d=\"~~Y-t!xK1F60\"/><path id=\"front-squat-m-m-eq2\" d=\"^51\"/><path id=\"front-squat-m-m-eq3\" d=\"^52\"/><path id=\"front-squat-m-mf-thigh.l\" d=\"^18\"/><path id=\"front-squat-m-mf-kneecap.l\" d=\"^19\"/><path id=\"front-squat-m-mf-shank.l\" d=\"^20\"/><path id=\"front-squat-m-mf-foot.l\" d=\"^21\"/><path id=\"front-squat-m-mf-thigh.r\" d=\"^18\"/><path id=\"front-squat-m-mf-kneecap.r\" d=\"^19\"/><path id=\"front-squat-m-mf-shank.r\" d=\"^20\"/><path id=\"front-squat-m-mf-foot.r\" d=\"^21\"/><path id=\"front-squat-m-mo-0\" d=\"^27\"/><path id=\"front-squat-m-mo-1\" d=\"^28\"/><path id=\"front-squat-m-mo-2\" d=\"^18\"/><path id=\"front-squat-m-mo-3\" d=\"^19\"/><path id=\"front-squat-m-mo-4\" d=\"^20\"/><path id=\"front-squat-m-mo-5\" d=\"^21\"/><path id=\"front-squat-m-mo-6\" d=\"^22\"/><path id=\"front-squat-m-mo-7\" d=\"^23\"/><path id=\"front-squat-m-mo-8\" d=\"^24\"/><path id=\"front-squat-m-mo-9\" d=\"^25\"/><path id=\"front-squat-m-mo-10\" d=\"^26\"/><path id=\"front-squat-m-mo-11\" d=\"^18\"/><path id=\"front-squat-m-mo-12\" d=\"^19\"/><path id=\"front-squat-m-mo-13\" d=\"^20\"/><path id=\"front-squat-m-mo-14\" d=\"^21\"/><path id=\"front-squat-m-mo-15\" d=\"^22\"/><path id=\"front-squat-m-mo-16\" d=\"^23\"/><path id=\"front-squat-m-mo-17\" d=\"^24\"/><path id=\"front-squat-m-mo-18\" d=\"^25\"/><path id=\"front-squat-m-mo-19\" d=\"^26\"/><path id=\"front-squat-m-mo-20\" d=\"^31\"/><path id=\"front-squat-m-mo-21\" d=\"^33\"/><path id=\"front-squat-m-mo-22\" d=\"^36\"/><path id=\"front-squat-m-mo-23\" d=\"^37\"/><path id=\"front-squat-m-mo-24\" d=\"^36\"/><path id=\"front-squat-m-mo-25\" d=\"^37\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#front-squat-m-dots)\"/>\n  <path class=\"datum\" d=\"^29\"/><path class=\"floorline\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq-thin\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#front-squat-m-st-head\"/><use href=\"#front-squat-m-st-torso\"/><use href=\"#front-squat-m-st-thigh.r\"/><use href=\"#front-squat-m-st-kneecap.r\"/><use href=\"#front-squat-m-st-shank.r\"/><use href=\"#front-squat-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#front-squat-m-st-head\"/><use href=\"#front-squat-m-st-torso\"/><use href=\"#front-squat-m-st-thigh.r\"/><use href=\"#front-squat-m-st-kneecap.r\"/><use href=\"#front-squat-m-st-shank.r\"/><use href=\"#front-squat-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#front-squat-m-g0-head\"/><use href=\"#front-squat-m-g0-torso\"/><use href=\"#front-squat-m-g0-thigh.r\"/><use href=\"#front-squat-m-g0-kneecap.r\"/><use href=\"#front-squat-m-g0-shank.r\"/><use href=\"#front-squat-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#front-squat-m-g0-head\"/><use href=\"#front-squat-m-g0-torso\"/><use href=\"#front-squat-m-g0-thigh.r\"/><use href=\"#front-squat-m-g0-kneecap.r\"/><use href=\"#front-squat-m-g0-shank.r\"/><use href=\"#front-squat-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#front-squat-m-g1-head\"/><use href=\"#front-squat-m-g1-torso\"/><use href=\"#front-squat-m-g1-thigh.r\"/><use href=\"#front-squat-m-g1-kneecap.r\"/><use href=\"#front-squat-m-g1-shank.r\"/><use href=\"#front-squat-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#front-squat-m-g1-head\"/><use href=\"#front-squat-m-g1-torso\"/><use href=\"#front-squat-m-g1-thigh.r\"/><use href=\"#front-squat-m-g1-kneecap.r\"/><use href=\"#front-squat-m-g1-shank.r\"/><use href=\"#front-squat-m-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-line\" d=\"^34\"/><path class=\"eq-thin\" d=\"^35\"/><path class=\"eq-solid\" d=\"^36\"/><path class=\"eq-pin\" d=\"^37\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#front-squat-m-e-thigh.l\"/><use href=\"#front-squat-m-e-kneecap.l\"/><use href=\"#front-squat-m-e-shank.l\"/><use href=\"#front-squat-m-e-foot.l\"/><use href=\"#front-squat-m-e-shcap.l\"/><use href=\"#front-squat-m-e-upper.l\"/><use href=\"#front-squat-m-e-elbowcap.l\"/><use href=\"#front-squat-m-e-fore.l\"/><use href=\"#front-squat-m-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#front-squat-m-e-thigh.l\"/><use href=\"#front-squat-m-e-kneecap.l\"/><use href=\"#front-squat-m-e-shank.l\"/><use href=\"#front-squat-m-e-foot.l\"/><use href=\"#front-squat-m-e-shcap.l\"/><use href=\"#front-squat-m-e-upper.l\"/><use href=\"#front-squat-m-e-elbowcap.l\"/><use href=\"#front-squat-m-e-fore.l\"/><use href=\"#front-squat-m-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#front-squat-m-e-head\"/><use href=\"#front-squat-m-e-torso\"/><use href=\"#front-squat-m-e-thigh.r\"/><use href=\"#front-squat-m-e-kneecap.r\"/><use href=\"#front-squat-m-e-shank.r\"/><use href=\"#front-squat-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#front-squat-m-e-head\"/><use href=\"#front-squat-m-e-torso\"/><use href=\"#front-squat-m-e-thigh.r\"/><use href=\"#front-squat-m-e-kneecap.r\"/><use href=\"#front-squat-m-e-shank.r\"/><use href=\"#front-squat-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#front-squat-m-e-shcap.r\"/><use href=\"#front-squat-m-e-upper.r\"/><use href=\"#front-squat-m-e-elbowcap.r\"/><use href=\"#front-squat-m-e-fore.r\"/><use href=\"#front-squat-m-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#front-squat-m-e-shcap.r\"/><use href=\"#front-squat-m-e-upper.r\"/><use href=\"#front-squat-m-e-elbowcap.r\"/><use href=\"#front-squat-m-e-fore.r\"/><use href=\"#front-squat-m-e-palm.r\"/></g></g><path class=\"eq-solid\" d=\"^36\"/><path class=\"eq-pin\" d=\"^37\"/><path class=\"eq-cable m-line\" d=\"^38\"/><circle class=\"joint\" cx=\"137.47\" cy=\"230.97\" r=\"2.25\"/><circle class=\"joint\" cx=\"165.02\" cy=\"227.94\" r=\"2.25\"/><circle class=\"joint\" cx=\"116.35\" cy=\"286.94\" r=\"2.25\"/><circle class=\"joint\" cx=\"167.81\" cy=\"283.1\" r=\"2.25\"/></g><mask id=\"front-squat-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#front-squat-m-m-head\" fill=\"#000\"/><use href=\"#front-squat-m-m-torso\" fill=\"#000\"/><use href=\"#front-squat-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#front-squat-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#front-squat-m-mf-shank.l\" fill=\"#000\"/><use href=\"#front-squat-m-mf-foot.l\" fill=\"#000\"/><use href=\"#front-squat-m-m-shcap.l\" fill=\"#000\"/><use href=\"#front-squat-m-m-upper.l\" fill=\"#000\"/><use href=\"#front-squat-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#front-squat-m-m-fore.l\" fill=\"#000\"/><use href=\"#front-squat-m-m-palm.l\" fill=\"#000\"/><use href=\"#front-squat-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#front-squat-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#front-squat-m-mf-shank.r\" fill=\"#000\"/><use href=\"#front-squat-m-mf-foot.r\" fill=\"#000\"/><use href=\"#front-squat-m-m-shcap.r\" fill=\"#000\"/><use href=\"#front-squat-m-m-upper.r\" fill=\"#000\"/><use href=\"#front-squat-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#front-squat-m-m-fore.r\" fill=\"#000\"/><use href=\"#front-squat-m-m-palm.r\" fill=\"#000\"/><use href=\"#front-squat-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#front-squat-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#front-squat-m-mmask)\"><g class=\"u-stroke\"><use href=\"#front-squat-m-m-head\"/><use href=\"#front-squat-m-m-torso\"/><use href=\"#front-squat-m-m-shcap.l\"/><use href=\"#front-squat-m-m-upper.l\"/><use href=\"#front-squat-m-m-elbowcap.l\"/><use href=\"#front-squat-m-m-fore.l\"/><use href=\"#front-squat-m-m-palm.l\"/><use href=\"#front-squat-m-m-shcap.r\"/><use href=\"#front-squat-m-m-upper.r\"/><use href=\"#front-squat-m-m-elbowcap.r\"/><use href=\"#front-squat-m-m-fore.r\"/><use href=\"#front-squat-m-m-palm.r\"/><use href=\"#front-squat-m-m-eq0\"/><use href=\"#front-squat-m-m-eq1\"/><use href=\"#front-squat-m-m-eq2\"/><use href=\"#front-squat-m-m-eq3\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~Mw.rWNF1L.bBA1LHkmLPgD8LYbPiLO6SfL!9wfLzlYaLRi(2LK8V5L)3A3L-1.7LV3Rb\"/><path class=\"m-line\" d=\"~MWysN.F1LKkyA1L-4BdLx8I2L3_iL_4(8LN3ShLP3Y2L_7IjLT9*bL*b3LUeaLwj8L(mI7LJj)9LU6T6LK2OfLEdTA1Lx2TpLT8D6L8F9LAaW1LrS7LR6ObLXf9LIdPdLD4W1\"/><path class=\"m-line\" d=\"~MPFqFzN1Ly7UjLT1)4L83LJc(oLD1E4Lkx2LrIfLy2OiLI5IdLIe.bLxaRbL-1z1L.3E2LN8SqL72LG2T4LIhG5L-2HpLN7AiLNjFg\"/><path class=\"m-line\" d=\"~MYYt_RT1L)buLiT4LH2z4LW3.2LP4G1LW4iLy4H2L!2W3LH1P4LjU4LB2A4LX3(2LO4D1LV4fLx4G2L.2V3\"/><path class=\"m-line\" d=\"~M_OuJ.S1LJ3z3LX1w1LhdLT1K6LI3iLK10LW1*8LI8S9LB2U9LH3DcLN2X8LH1mLY2!1LF4x5Lo3LA1W1Lw4HmL_cVeLJ3TeLz5-i\"/><path class=\"m-line\" d=\"~MAItDxR1L.aqLgB4Ly2V3LJ3V2Ly4B1LF4iLY3y2LS2J3LF1A4LhD4Lx2W3LI3W2Lx4A1LE4fLX3x2LT2G3\"/><path class=\"m-line\" d=\"~MN(tDUS1L.1y7LE3*1L*1E3L2X3L!1E3LD3*1L!32LD3_1L!1H3L2Y3L*1H3LE3_1\"/><path class=\"m-arrow\" d=\"~MJSy1JzK1L)W2SH5MG5-uLH5_uLYmRJ1\"/><path class=\"leader m\" d=\"M156.11 271.6L213 310H223\"/><path class=\"leader m\" d=\"M149.23 251.95L213 258H223\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"front-squat-m-elbows\" data-key=\"elbows\" data-cue=\"The elbows drop and the bar starts to slip.\" class=\"plate-callout m\" style=\"left:60.89%;top:80.45%\" aria-pressed=\"true\">Elbows drop</button><button type=\"button\" id=\"front-squat-m-chest\" data-key=\"chest\" data-cue=\"The chest falls and the torso tips forward.\" class=\"plate-callout two m\" style=\"left:60.89%;top:65.92%\" aria-pressed=\"false\">Chest falls<br>forward</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "Keep your elbows up so your shoulders hold the bar." }, { key: "chest", cue: "Keep your torso upright on the way down and up." }, { key: "foot", cue: "Stay balanced over the whole foot, knees in line with your feet." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "The elbows drop and the bar starts to slip." }, { key: "chest", cue: "The chest falls and the torso tips forward." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Elbows drop</b><span>The elbows drop and the bar starts to slip.</span></li><li><b>Chest falls forward</b><span>The chest falls and the torso tips forward.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower controlled, drive up\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>Controlled</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Drive up</b><span>&nbsp;</span></div></div></div>",
      alt: "Front squat, side view. The bar rests on the front of the shoulders with the elbows high, in a rack with safety bars set just below the bottom. The lifter sits straight down until the hips are below the knees, torso upright and the whole foot flat.",
      mistakeAlt: "Front Squat: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "on-body",
    "why": "D-SHIP-C3 no-zoom list, gap-key: the front-rack key lists front_squat in GAPS (hand-front-rack.mjs:29, below the hand bar); the grip copy carries c3, c4, c6 and c7.",
    "handle": "bar-28",
    "width": {
      "text": "No fixed width. Try other widths until a full grip fits.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-rack"
        ],
        "note": "card grip.width, c5"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-frontsquat",
          "cat-rack"
        ],
        "note": "card grip.thumb, c4, c5"
      }
    },
    "contact": "fingertips",
    "wrist": {
      "exempt": "Front-rack exemption (shared/front-rack-exemption.json): the shoulders carry the bar and the hands only add security; a fingertip rack is fine (c3, c5). No source gives a wrist angle.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-rack",
          "cat-frontsquat"
        ],
        "note": "card grip.wrist, c3, c5; shared/front-rack-exemption.json c1, c4"
      }
    },
    "faults": [
      {
        "key": "bar-off-shoulders",
        "label": "Bar on hands",
        "pose": {},
        "markers": [],
        "alt": "Bar held in the hands, off the shoulders."
      },
      {
        "key": "cross-arm-elbows",
        "label": "Elbows dropped",
        "pose": {},
        "markers": [],
        "alt": "Crossed arms with the elbows dropped."
      }
    ],
    "gripLine": "Your shoulders hold the bar, hands loose round it, elbows high. Or cross your arms over it, elbows high.",
    "cue": "Shoulders hold the bar, elbows high."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "safety",
      "text": "Set safeties just below your lowest depth. Heavy? Use a spotter.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "rep-fail"
        ],
        "note": "c14, c25 (card tierA.wayOut)"
      }
    },
    {
      "kind": "position",
      "text": "Bar between throat and shoulders. Shoulders pushed forward and slightly up.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-frontsquat",
          "cat-rack",
          "hk-frontsquat"
        ],
        "note": "c2, c3"
      }
    },
    {
      "kind": "grip",
      "text": "Loose full grip, elbows high. Sit straight down, knees and hips together.",
      "zoom": "upright-torso",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-frontsquat"
        ],
        "note": "c4, c10"
      }
    },
    {
      "kind": "position",
      "text": "Heels hip width or a little wider, toes out 15-30 degrees.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-frontsquat"
        ],
        "note": "c8"
      }
    },
    {
      "kind": "brace",
      "text": "Walk out one step back on each leg. Brace hard each rep.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "stronglifts-squat",
          "cat-frontsquat"
        ],
        "note": "c26, c9"
      }
    }
  ],
  posture: [
    {
      "key": "bar",
      "label": "Bar in channel",
      "detail": "Bar in the channel, no pressure on the throat.",
      "anchor": {
        "pose": "start",
        "at": "shoulderTop.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-frontsquat",
          "cat-rack"
        ],
        "note": "c2"
      }
    },
    {
      "key": "elbows",
      "label": "Elbows high",
      "detail": "Elbows high throughout.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "zoom": "upright-torso",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hk-frontsquat"
        ],
        "note": "c7"
      }
    },
    {
      "key": "bend",
      "label": "Straight down",
      "detail": "Knees and hips bend together, straight down.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-frontsquat"
        ],
        "note": "c10"
      }
    },
    {
      "key": "feet",
      "label": "Knees follow toes",
      "detail": "Whole-foot balance, knees in line with the feet.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-frontsquat"
        ],
        "note": "c10"
      }
    },
    {
      "key": "depth",
      "label": "Depth",
      "detail": "Depth as far as a neutral spine and whole-foot balance allow.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-frontsquat",
          "hk-frontsquat"
        ],
        "note": "c11"
      }
    },
    {
      "key": "torso",
      "label": "Torso upright",
      "detail": "Torso upright on the way up.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "zoom": "upright-torso",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-frontsquat"
        ],
        "note": "c12"
      }
    }
  ],
  zooms: [
    {
      "key": "upright-torso",
      "chip": "Torso",
      "heading": "Torso angle",
      "kind": "posture",
      "feelRow": "lower-back"
    }
  ],
  chips: [
    "upright-torso",
    "feel"
  ],
  copy: {
    "setupLine": "Safeties below your lowest depth, or a spotter when heavy. Practise bailing light: let go, drop it forward onto them, step back.",
    "mistakeLine": "Keep your elbows high, or the bar may slip. Go only as deep as balance and a neutral spine allow.",
    "cueLine": "Hips and knees together, straight down."
  },
  mistakes: [
    {
      "key": "chest",
      "title": "Chest falling, elbows dropping",
      "zoom": "upright-torso",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hk-frontsquat"
        ],
        "note": "c7"
      },
      "fix": "Elbows up, chest tall."
    },
    {
      "key": "hands",
      "title": "Hands holding the bar up",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-rack",
          "hk-frontsquat"
        ],
        "note": "c3"
      },
      "fix": "Let your shoulders carry the bar. Try a fingertip rack."
    },
    {
      "key": "safeties",
      "title": "Bailing with no safeties set",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "rep-fail"
        ],
        "note": "c14, c25"
      },
      "fix": "Set the safeties. Let go, drop it forward onto them, step back."
    }
  ],
  risks: [
    {
      "key": "no-safeties",
      "text": "A failed rep with no safeties set. Practise bailing light.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "rep-fail"
        ],
        "note": "c14, c25"
      }
    },
    {
      "key": "breath",
      "text": "Holding your breath under heavy load raises blood pressure.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "hackett-2013"
        ],
        "note": "c19"
      }
    },
    {
      "key": "throat",
      "text": "Bar pressing on the throat.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-frontsquat",
          "cat-rack"
        ],
        "note": "c2"
      }
    }
  ],
  riskFlags: [
    "wrist",
    "back",
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
    "cat-frontsquat",
    "cat-rack",
    "hk-frontsquat",
    "rep-fail",
    "yavuz-2015",
    "hackett-2013",
    "stronglifts-squat",
    "nhs-knee",
    "nhs-wrist-pain",
    "nhs-back",
    "nhs-knee-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/front_squat.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

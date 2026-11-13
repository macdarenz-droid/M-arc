// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=fd89d5dad6f136ab49b333e8cbbfcb5059e22daa42a7f2d17bd46ec76b542e00
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_farmer_s_carry",
  name: "Farmer's Carry",
  hashes: { inputsSha256: "fd89d5dad6f136ab49b333e8cbbfcb5059e22daa42a7f2d17bd46ec76b542e00", golden: "5bf7c7c8a9c39b64719d594e802ff47738335ca3eacbdb3aeaae2153de2a3b00" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"farmer-s-carry-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"farmer-s-carry-n-st-thigh.l\" d=\"~#F12YElYzF1Oyl.UD1B2TbB11N5U(1Y5)7U2x4ozV1WbKnlBkzdRmB4xV1*2-3B6T7K1Y(1F10N1-bRv-aTkSG1D1(z1FnAF100000000211210000200100210210100001000010100000000010000000000000000000000000000\"/><path id=\"farmer-s-carry-n-st-kneecap.l\" d=\"~~JUmyGU1_J10\"/><path id=\"farmer-s-carry-n-st-shank.l\" d=\"~#F12(TmP(T1GynIRS1N4xbD1aR9J(1S7G6U3B3Sbxy2DaTb_2Tbz4*e(iIw2X1O4x4)8xjF!1B19s*bzfP8Oiwl*4DlF7wr00000200000001101000000002000000000000000100200000000001010000002020000000010000\"/><path id=\"farmer-s-carry-n-st-foot.l\" d=\"~#o2_HkAB)1K!kzB(1_cF3Uhx8Up)nS-2B3-J2-4ID1)7xo2OG1Y4Eb-cYsBbGmSp120002012120000110001000101200002101101000010110\"/><path id=\"farmer-s-carry-n-st-shcap.l\" d=\"~~J.lN_qwP10\"/><path id=\"farmer-s-carry-n-st-upper.l\" d=\"~#F12J.lN_qG!lXWpe.8a1J2WO1D3)5N1)2_5KD1wa-i0Igxa-iX5KD1K1)2B3)5I2WO171f.8Egz1TdUp1JmYdUp10100000010000002000002000001000100000000010000000002001201000001100001010000001\"/><path id=\"farmer-s-carry-n-st-elbowcap.l\" d=\"~~AFmwAA1Dz10\"/><path id=\"farmer-s-carry-n-st-fore.l\" d=\"~#F12SDmwAA1RGm*Ez1W1Gaq!1N3NI1U3G9S1I2e)w1!6Xc1EbX6Xcf)w1T1I2R3G9K3NI1p!1V1Gaza3OaSj1FhSaSj00100000200101002101001010000010000000001000010100010100000000000000000010000000\"/><path id=\"farmer-s-carry-n-st-fist.l\" d=\"~~JImA*K1ww10\"/><path id=\"farmer-s-carry-n-st-head\" d=\"~#w12PUnFRgGxmTEgBjDjBjS9BbB3E3_4X4)7x8BbRhIm_4.cT1R9Bj0NmBbHmK6!kF3DjwgT1Aj0000010000001000000000121000000100000000000000100002200000000100\"/><path id=\"farmer-s-carry-n-st-torso\" d=\"~#_12PAmFGlzNm-_jR9.1B3O5S9!eU9yaYcwgN60I6)nKm)7Xc_4(f-4_kI6NmxgShRh_4R9)7xgBrBz1EbBrG60V90!cwgA3w8Xc)7)fYaK6yiN6U3_cK8A3w8zT2ww100002100000000000000000220022010122200100000000000000000000000101002000002101200000010000000021010000000021000020002\"/><path id=\"farmer-s-carry-n-st-thigh.r\" d=\"^0\"/><path id=\"farmer-s-carry-n-st-kneecap.r\" d=\"^1\"/><path id=\"farmer-s-carry-n-st-shank.r\" d=\"^2\"/><path id=\"farmer-s-carry-n-st-foot.r\" d=\"^3\"/><path id=\"farmer-s-carry-n-st-shcap.r\" d=\"^4\"/><path id=\"farmer-s-carry-n-st-upper.r\" d=\"^5\"/><path id=\"farmer-s-carry-n-st-elbowcap.r\" d=\"^6\"/><path id=\"farmer-s-carry-n-st-fore.r\" d=\"^7\"/><path id=\"farmer-s-carry-n-st-fist.r\" d=\"^8\"/><path id=\"farmer-s-carry-n-g0-thigh.r\" d=\"~#F12DSoJ_F1XwoONE1E5Xaz1e_l__1H3B9S1R4GdOT1A5Vp)5EjRiIixi)R1-3*2)7-5Dfy*1A1dV1XbEx1x2)8NK1UaNy1wx1Pw112100002200001100200200010010000121000121010010100200011000000200001010020000000\"/><path id=\"farmer-s-carry-n-g0-kneecap.r\" d=\"~~AytN_T1_J10\"/><path id=\"farmer-s-carry-n-g0-shank.r\" d=\"~#F12YytJJT1VUtOwS1J5XaA1eKeN*1A8T5Y3*2_g)w2wbXaW3Ib-2Ef!nV(1O1R4E3G9VnS_1E1d!1Xb-fF7xkNjR6YkA5Sr00210000000000220000000001100002002001000000100020020000100002100001010200001010\"/><path id=\"farmer-s-carry-n-g0-foot.r\" d=\"~#o2__pHN(1KJqGN*1_cD3Uh)7Up)nS-2B3-J2-4ID1*7xo1OG1_4Eb-cYsBbGmUp100100012020000010001000121001012100101000000011\"/><path id=\"farmer-s-carry-n-e-thigh.l\" d=\"~#F12SXr(VE1.*rzED1m*bB17)9w(1S7I6P3E3YdIT1wh-jF4-jz7xp_8KU1-1K4B4*8XgS!1F18F4xb)rEizuHz1R7Az1UcSJ120000101000000000000001000000001110000000200210000000000000010100100222000100000\"/><path id=\"farmer-s-carry-n-e-kneecap.l\" d=\"~~JyqHBU1_J10\"/><path id=\"farmer-s-carry-n-e-shank.l\" d=\"~#F12(BqyPT1*(q-ES1y7V9y1kRoD_1(8G4H4B2HrE*1YcX8P5Va7Ifwy1.-1jX4V1V9Bx1WV1x1hY3GbXgP4zn_f.9Jjcws00000002001001010000001210100000000200110000000000210000000010000001002002100000\"/><path id=\"farmer-s-carry-n-e-foot.l\" d=\"~#o2JEl(-*1EwmB)!1UbD6wjK3Yu)gUX2YiGG2InGz1BhBn-5RG1O5X7BfWu-3)rHj000000000020001000101200002200020001110000010000\"/><path id=\"farmer-s-carry-n-e-shcap.l\" d=\"~~PGsN)qwP10\"/><path id=\"farmer-s-carry-n-e-upper.l\" d=\"~#F12PGsN)qKHsV.pe)8a2J2SO1D3*5N1*2_5RD1waVi0OgxaViX5RD1K1*2B3*5I2SO172f)8EgvTdPp1PmYdPp12100100000000002000002101001000100000010110000000002000201100021000001010000000\"/><path id=\"farmer-s-carry-n-e-elbowcap.l\" d=\"~~FWsyGA1Dz10\"/><path id=\"farmer-s-carry-n-e-fore.l\" d=\"~#F12WUsyGA1VXsxKz1W1Eaq!1N3PI1U3K9S1G2e*w1!6.c1zbX6.cf*w1T1G2R3K9K3PI1p!1V1Eaza5OaSj1FhSaSj00100002200200012100021012000010000000021002000101000200020000000000000010000000\"/><path id=\"farmer-s-carry-n-e-fist.l\" d=\"~~P-sAyN1ww10\"/><path id=\"farmer-s-carry-n-e-head\" d=\"~#w12UyuHWgKOsVJgBjAjBjW9BbE3E3_4X4)7x8BbRhKm_4XcT1T9Bj0NmBbHmK6!kF3Dj(fT1Fj0001000002001001000000101000000002000100000000110000200001000000\"/><path id=\"farmer-s-carry-n-e-torso\" d=\"~#_12USsHNlE!s*)jR9X1B3R5S9!eU9yaYcwgN60I6)nKm)7Xc_4(f-4_kK6Nm*fShTh_4T9)7*fBrEz1EbBrG60V90!cwgA3w8Xc)7)fYaK6yiN6U3_cK8A3w8zT2ww100022001000000010100000020002010102000100000000002000000000200101000000000101000000010000000001010000000001000000000\"/><path id=\"farmer-s-carry-n-e-thigh.r\" d=\"~#F12SYrW_F1KFrINE1*4-aB1cwkP.1W3z9S1O4Rb*T1Y5KpG5Kjxi*iKgTS1X3)2-7*5FdJ*1D1bG1-bEx1x3GaDK1S9Wy1(vSx100001012002000000000000000001002001111010000120002100000010000100000000000000100\"/><path id=\"farmer-s-carry-n-e-kneecap.r\" d=\"~~W*vHwU1_J10\"/><path id=\"farmer-s-carry-n-e-shank.r\" d=\"~#F12F!vD!T1BAw1OKS1!2RbF14nA)1U6G7A3V3D2)y2N8*cA1)bx6zeU9Ky2I2z4E5I8KaF(1E11n*bXdPaKfJn*1WlwbYp20002202000110100000001012001000210002001000000011010000000020210000111010000000\"/><path id=\"farmer-s-carry-n-e-foot.r\" d=\"~#o2_HvAB)1K!vzB(1_cF3Uhx8Up)nS-2B3-J2-4ID1)7xo2OG1Y4Eb-cYsBbGmSp120002012120000110001000101200002101101000010110\"/><path id=\"farmer-s-carry-n-e-shcap.r\" d=\"^19\"/><path id=\"farmer-s-carry-n-e-upper.r\" d=\"^20\"/><path id=\"farmer-s-carry-n-e-elbowcap.r\" d=\"^21\"/><path id=\"farmer-s-carry-n-e-fore.r\" d=\"^22\"/><path id=\"farmer-s-carry-n-e-fist.r\" d=\"^23\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#farmer-s-carry-n-dots)\"/>\n  <path class=\"floorline\" d=\"M54.17 339.5H288.23\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#farmer-s-carry-n-st-thigh.l\"/><use href=\"#farmer-s-carry-n-st-kneecap.l\"/><use href=\"#farmer-s-carry-n-st-shank.l\"/><use href=\"#farmer-s-carry-n-st-foot.l\"/><use href=\"#farmer-s-carry-n-st-shcap.l\"/><use href=\"#farmer-s-carry-n-st-upper.l\"/><use href=\"#farmer-s-carry-n-st-elbowcap.l\"/><use href=\"#farmer-s-carry-n-st-fore.l\"/><use href=\"#farmer-s-carry-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#farmer-s-carry-n-st-thigh.l\"/><use href=\"#farmer-s-carry-n-st-kneecap.l\"/><use href=\"#farmer-s-carry-n-st-shank.l\"/><use href=\"#farmer-s-carry-n-st-foot.l\"/><use href=\"#farmer-s-carry-n-st-shcap.l\"/><use href=\"#farmer-s-carry-n-st-upper.l\"/><use href=\"#farmer-s-carry-n-st-elbowcap.l\"/><use href=\"#farmer-s-carry-n-st-fore.l\"/><use href=\"#farmer-s-carry-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#farmer-s-carry-n-st-head\"/><use href=\"#farmer-s-carry-n-st-torso\"/><use href=\"#farmer-s-carry-n-st-thigh.r\"/><use href=\"#farmer-s-carry-n-st-kneecap.r\"/><use href=\"#farmer-s-carry-n-st-shank.r\"/><use href=\"#farmer-s-carry-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#farmer-s-carry-n-st-head\"/><use href=\"#farmer-s-carry-n-st-torso\"/><use href=\"#farmer-s-carry-n-st-thigh.r\"/><use href=\"#farmer-s-carry-n-st-kneecap.r\"/><use href=\"#farmer-s-carry-n-st-shank.r\"/><use href=\"#farmer-s-carry-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#farmer-s-carry-n-st-shcap.r\"/><use href=\"#farmer-s-carry-n-st-upper.r\"/><use href=\"#farmer-s-carry-n-st-elbowcap.r\"/><use href=\"#farmer-s-carry-n-st-fore.r\"/><use href=\"#farmer-s-carry-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#farmer-s-carry-n-st-shcap.r\"/><use href=\"#farmer-s-carry-n-st-upper.r\"/><use href=\"#farmer-s-carry-n-st-elbowcap.r\"/><use href=\"#farmer-s-carry-n-st-fore.r\"/><use href=\"#farmer-s-carry-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#farmer-s-carry-n-g0-thigh.r\"/><use href=\"#farmer-s-carry-n-g0-kneecap.r\"/><use href=\"#farmer-s-carry-n-g0-shank.r\"/><use href=\"#farmer-s-carry-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#farmer-s-carry-n-g0-thigh.r\"/><use href=\"#farmer-s-carry-n-g0-kneecap.r\"/><use href=\"#farmer-s-carry-n-g0-shank.r\"/><use href=\"#farmer-s-carry-n-g0-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-solid\" d=\"~MY)rYPN1LPT30QF60EK3E6LE6OaQ0E6E6PaLEK3F6QE60FK3F6LF6PaQ0F6F6OaZ\"/><path class=\"disc\" d=\"~MWUr_DJ1L.*10QI90PU1J9LJ9S_2Q0J9J9R_2LPU1I9QJ90OU1I9LI9R_2Q0I9I9S_2Z\"/><path class=\"disc\" d=\"~MF(vP*O1L(*10QJ90RU1I9LI9R_2Q0I9I9S_2LRU1J9QI90SU1J9LJ9S_2Q0J9J9R_2Z\"/><path class=\"eq-line m-line\" d=\"~MH)iYxJ1LUP20LTP2yU1L_W3xU1L-W3xU1LWP2yU1LVP2WW3LVP2VW3LWP2)T1L-W3wU1L_W3wU1LTP2)T1LUP2VW3\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#farmer-s-carry-n-e-thigh.l\"/><use href=\"#farmer-s-carry-n-e-kneecap.l\"/><use href=\"#farmer-s-carry-n-e-shank.l\"/><use href=\"#farmer-s-carry-n-e-foot.l\"/><use href=\"#farmer-s-carry-n-e-shcap.l\"/><use href=\"#farmer-s-carry-n-e-upper.l\"/><use href=\"#farmer-s-carry-n-e-elbowcap.l\"/><use href=\"#farmer-s-carry-n-e-fore.l\"/><use href=\"#farmer-s-carry-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#farmer-s-carry-n-e-thigh.l\"/><use href=\"#farmer-s-carry-n-e-kneecap.l\"/><use href=\"#farmer-s-carry-n-e-shank.l\"/><use href=\"#farmer-s-carry-n-e-foot.l\"/><use href=\"#farmer-s-carry-n-e-shcap.l\"/><use href=\"#farmer-s-carry-n-e-upper.l\"/><use href=\"#farmer-s-carry-n-e-elbowcap.l\"/><use href=\"#farmer-s-carry-n-e-fore.l\"/><use href=\"#farmer-s-carry-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#farmer-s-carry-n-e-head\"/><use href=\"#farmer-s-carry-n-e-torso\"/><use href=\"#farmer-s-carry-n-e-thigh.r\"/><use href=\"#farmer-s-carry-n-e-kneecap.r\"/><use href=\"#farmer-s-carry-n-e-shank.r\"/><use href=\"#farmer-s-carry-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#farmer-s-carry-n-e-head\"/><use href=\"#farmer-s-carry-n-e-torso\"/><use href=\"#farmer-s-carry-n-e-thigh.r\"/><use href=\"#farmer-s-carry-n-e-kneecap.r\"/><use href=\"#farmer-s-carry-n-e-shank.r\"/><use href=\"#farmer-s-carry-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#farmer-s-carry-n-e-shcap.r\"/><use href=\"#farmer-s-carry-n-e-upper.r\"/><use href=\"#farmer-s-carry-n-e-elbowcap.r\"/><use href=\"#farmer-s-carry-n-e-fore.r\"/><use href=\"#farmer-s-carry-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#farmer-s-carry-n-e-shcap.r\"/><use href=\"#farmer-s-carry-n-e-upper.r\"/><use href=\"#farmer-s-carry-n-e-elbowcap.r\"/><use href=\"#farmer-s-carry-n-e-fore.r\"/><use href=\"#farmer-s-carry-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^31\"/><path class=\"disc\" d=\"^32\"/><path class=\"disc\" d=\"^33\"/><path class=\"eq-line m-line\" d=\"^34\"/><circle class=\"joint\" cx=\"152.56\" cy=\"138.15\" r=\"2.25\"/><circle class=\"joint\" cx=\"152.56\" cy=\"185.77\" r=\"2.25\"/><circle class=\"joint\" cx=\"154.02\" cy=\"205.81\" r=\"2.25\"/><circle class=\"joint\" cx=\"170.64\" cy=\"266.29\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#Y10UGrD(x2Gyrz)x201221000211200201102201000211w20120100022110020120120101100000000100000000000120000000000100002000000100000000001100001000000100000000002100000000000100200000000100010\"/><path class=\"arrow\" d=\"~MA!y1Axy2LTE1YdLPJ1*S1Z\"/></g><path class=\"leader\" d=\"M172.45 150.77L179 142H189\"/><circle class=\"anchor\" cx=\"172.45\" cy=\"150.77\" r=\"1.5\"/><path class=\"leader\" d=\"~MNOqHDtL0xJd\"/><circle class=\"anchor\" cx=\"135.59\" cy=\"149.49\" r=\"1.5\"/><path class=\"leader\" d=\"M146.56 185.77L104.95 178H94.95\"/><circle class=\"anchor\" cx=\"146.56\" cy=\"185.77\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"farmer-s-carry-n-torso\" data-key=\"torso\" data-cue=\"Torso upright and chest tall, gaze ahead.\" class=\"plate-callout\" style=\"left:51.4%;top:33.52%\" aria-pressed=\"true\">Tall torso</button><button type=\"button\" id=\"farmer-s-carry-n-shoulders\" data-key=\"shoulders\" data-cue=\"Shoulders back and down, not shrugged.\" class=\"plate-callout\" style=\"left:4.47%;top:13.41%\" aria-pressed=\"false\">Shoulders down</button><button type=\"button\" id=\"farmer-s-carry-n-arms\" data-key=\"arms\" data-cue=\"Arms fully extended at your sides.\" class=\"plate-callout\" style=\"left:4.47%;top:43.58%\" aria-pressed=\"false\">Arms long</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"farmer-s-carry-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"farmer-s-carry-m-st-thigh.l\" d=\"^0\"/><path id=\"farmer-s-carry-m-st-kneecap.l\" d=\"^1\"/><path id=\"farmer-s-carry-m-st-shank.l\" d=\"^2\"/><path id=\"farmer-s-carry-m-st-foot.l\" d=\"^3\"/><path id=\"farmer-s-carry-m-st-shcap.l\" d=\"^4\"/><path id=\"farmer-s-carry-m-st-upper.l\" d=\"^5\"/><path id=\"farmer-s-carry-m-st-elbowcap.l\" d=\"^6\"/><path id=\"farmer-s-carry-m-st-fore.l\" d=\"^7\"/><path id=\"farmer-s-carry-m-st-fist.l\" d=\"^8\"/><path id=\"farmer-s-carry-m-st-head\" d=\"^9\"/><path id=\"farmer-s-carry-m-st-torso\" d=\"^10\"/><path id=\"farmer-s-carry-m-st-thigh.r\" d=\"^0\"/><path id=\"farmer-s-carry-m-st-kneecap.r\" d=\"^1\"/><path id=\"farmer-s-carry-m-st-shank.r\" d=\"^2\"/><path id=\"farmer-s-carry-m-st-foot.r\" d=\"^3\"/><path id=\"farmer-s-carry-m-st-shcap.r\" d=\"^4\"/><path id=\"farmer-s-carry-m-st-upper.r\" d=\"^5\"/><path id=\"farmer-s-carry-m-st-elbowcap.r\" d=\"^6\"/><path id=\"farmer-s-carry-m-st-fore.r\" d=\"^7\"/><path id=\"farmer-s-carry-m-st-fist.r\" d=\"^8\"/><path id=\"farmer-s-carry-m-g0-thigh.r\" d=\"^11\"/><path id=\"farmer-s-carry-m-g0-kneecap.r\" d=\"^12\"/><path id=\"farmer-s-carry-m-g0-shank.r\" d=\"^13\"/><path id=\"farmer-s-carry-m-g0-foot.r\" d=\"^14\"/><path id=\"farmer-s-carry-m-e-thigh.l\" d=\"^15\"/><path id=\"farmer-s-carry-m-e-kneecap.l\" d=\"^16\"/><path id=\"farmer-s-carry-m-e-shank.l\" d=\"^17\"/><path id=\"farmer-s-carry-m-e-foot.l\" d=\"^18\"/><path id=\"farmer-s-carry-m-e-shcap.l\" d=\"^19\"/><path id=\"farmer-s-carry-m-e-upper.l\" d=\"^20\"/><path id=\"farmer-s-carry-m-e-elbowcap.l\" d=\"^21\"/><path id=\"farmer-s-carry-m-e-fore.l\" d=\"^22\"/><path id=\"farmer-s-carry-m-e-fist.l\" d=\"^23\"/><path id=\"farmer-s-carry-m-e-head\" d=\"^24\"/><path id=\"farmer-s-carry-m-e-torso\" d=\"^25\"/><path id=\"farmer-s-carry-m-e-thigh.r\" d=\"^26\"/><path id=\"farmer-s-carry-m-e-kneecap.r\" d=\"^27\"/><path id=\"farmer-s-carry-m-e-shank.r\" d=\"^28\"/><path id=\"farmer-s-carry-m-e-foot.r\" d=\"^29\"/><path id=\"farmer-s-carry-m-e-shcap.r\" d=\"^19\"/><path id=\"farmer-s-carry-m-e-upper.r\" d=\"^20\"/><path id=\"farmer-s-carry-m-e-elbowcap.r\" d=\"^21\"/><path id=\"farmer-s-carry-m-e-fore.r\" d=\"^22\"/><path id=\"farmer-s-carry-m-e-fist.r\" d=\"^23\"/><path id=\"farmer-s-carry-m-m-head\" d=\"~#w12PRz1UwiG(x1xXhBjFjBjU9EbE3z3_4.4)7*7BbThKm_4XcT1T9Bj0JmEbNmG6_kA3AjygO1Dj1000021010110001010010000001000000001100000000000200100200000010\"/><path id=\"farmer-s-carry-m-m-torso\" d=\"~#_12Pxy1UYmzIy1EHlR9-1E3K5W9_eP9ya!cwgJ60I6)nKm)7-c_4yg-4YkK6Jm*fWhThY4T9)7*fErEz1zbBrK60R90YcwgF3w8-c)7xgYaG6yiJ6U3YcK8F3w8BT2ww100000000000020110100000000000010101010000110001000002100101000110000000000000000002000000010000000001000100020000000\"/><path id=\"farmer-s-carry-m-m-thigh.l\" d=\"~#F12YIx1NPF1x!x1BAE1H3IbB1hznJ_1W8R4D4K2SoBO1!kVfN8GiR1xqwkIR1rT4z2V9KtSX1A1eS6.9InXn)A1_rzfWw1_2HN101000010110000000000000101000010100001000102000101020001000000000001000000002000\"/><path id=\"farmer-s-carry-m-m-kneecap.l\" d=\"~~HwtPUU1_J10\"/><path id=\"farmer-s-carry-m-m-shank.l\" d=\"~#F12NGt_WT1RHu*US1(8*7w1sRA1NT1S9B2W4G1wF1-V1He-5U7B9D3zfWK1zR1cX4g.9)I1FK1x1nF6EaIho*pPa*dWgT5Pr01010122000000000000000002001010000000101010022000200010120020001000000010001000\"/><path id=\"farmer-s-carry-m-m-foot.l\" d=\"~#o2DEmPW!1EBnXx!1waS8HjoUx1)9SR2HB1Ry2VD1VuIoKl-aIE1GeE4OgYu(2Ov_c220101011000010101001000000000100000000000200000\"/><path id=\"farmer-s-carry-m-m-shcap.l\" d=\"~~HYx1YGswP10\"/><path id=\"farmer-s-carry-m-m-upper.l\" d=\"~#F12HYx1YGsE-x1)Brg)882J2SO1D3*5N1*2Y5RD1yaVi0Og)9Vi-5RD1K1*2B3*5I2SO192d)8BgvXdPp2PmUdPp00000110001001000010100101000020000000011110101000010000000120200000000000000020\"/><path id=\"farmer-s-carry-m-m-elbowcap.l\" d=\"~~ABy1JTB1Dz10\"/><path id=\"farmer-s-carry-m-m-fore.l\" d=\"~#F12Szy1JTB1RDy1IXA1W1Eaq!1N3NI1S3G9U1I2g*w1Y6.c2zb.6.cd*w1T1I2O3G9O3NI1p!1V1Eaza5RaSj2FhPaSj00101002001010000000002000000000200000000000000020001010021000000000002000000000\"/><path id=\"farmer-s-carry-m-m-fist.l\" d=\"~~HFy1NJO1ww10\"/><path id=\"farmer-s-carry-m-m-thigh.r\" d=\"~#F12POx1(XH1BUw1KRG1T7B9vkyz1AU1y1-9eX4xp*N1B1zqGaGhImOdItGJ1I4*1z9V3AtUX1y1jO4)a-w1_5A2HN1Hi!u_E1(n00100100200000111100000010010000200000020000000000002000000200002000200000020000\"/><path id=\"farmer-s-carry-m-m-kneecap.r\" d=\"~~HKF1JxU1_J10\"/><path id=\"farmer-s-carry-m-m-shank.r\" d=\"~#F12wJF1YDU1EHF1IXS1c)bH11yc(*1y5O8F2E4Obxy2Y5KeK1-b-8Xc)3*y2B3R3.6B7N2A)1B16B3RbIbAdGayqP2Plwgyn00100120001111000000100101200002000000200000000000000200220000000000000100100202\"/><path id=\"farmer-s-carry-m-m-foot.r\" d=\"~#o2_HH1AB)1K!H1zB(1_cF3Uhx8Up)nS-2B3-J2-4ID1)7xo2OG1Y4Eb-cYsBbGmSp120002012120000110001000101200002101101000010110\"/><path id=\"farmer-s-carry-m-m-shcap.r\" d=\"^46\"/><path id=\"farmer-s-carry-m-m-upper.r\" d=\"^47\"/><path id=\"farmer-s-carry-m-m-elbowcap.r\" d=\"^48\"/><path id=\"farmer-s-carry-m-m-fore.r\" d=\"^49\"/><path id=\"farmer-s-carry-m-m-fist.r\" d=\"^50\"/><path id=\"farmer-s-carry-m-m-eq0\" d=\"~MSNx1y.O1LPT30QF60EK3E6LE6OaQ0E6E6PaLEK3F6QE60FK3F6LF6PaQ0F6F6OaZ\"/><path id=\"farmer-s-carry-m-m-eq1\" d=\"~MPzx1yRK1L.*10QI90PU1J9LJ9U_2Q0J9J9T_2LPU1I9QJ90OU1I9LI9T_2Q0I9I9U_2Z\"/><path id=\"farmer-s-carry-m-m-eq2\" d=\"~MAKB1_ER1L!*10QJ90OU1I9LI9T_2Q0I9I9U_2LOU1J9QI90PU1J9LJ9U_2Q0J9J9T_2Z\"/><path id=\"farmer-s-carry-m-m-eq3\" d=\"^55\"/><path id=\"farmer-s-carry-m-m-eq4\" d=\"^56\"/><path id=\"farmer-s-carry-m-m-eq5\" d=\"^57\"/><path id=\"farmer-s-carry-m-mo-0\" d=\"^24\"/><path id=\"farmer-s-carry-m-mo-1\" d=\"^25\"/><path id=\"farmer-s-carry-m-mo-2\" d=\"^15\"/><path id=\"farmer-s-carry-m-mo-3\" d=\"^16\"/><path id=\"farmer-s-carry-m-mo-4\" d=\"^17\"/><path id=\"farmer-s-carry-m-mo-5\" d=\"^18\"/><path id=\"farmer-s-carry-m-mo-6\" d=\"^19\"/><path id=\"farmer-s-carry-m-mo-7\" d=\"^20\"/><path id=\"farmer-s-carry-m-mo-8\" d=\"^21\"/><path id=\"farmer-s-carry-m-mo-9\" d=\"^22\"/><path id=\"farmer-s-carry-m-mo-10\" d=\"^23\"/><path id=\"farmer-s-carry-m-mo-11\" d=\"^26\"/><path id=\"farmer-s-carry-m-mo-12\" d=\"^27\"/><path id=\"farmer-s-carry-m-mo-13\" d=\"^28\"/><path id=\"farmer-s-carry-m-mo-14\" d=\"^29\"/><path id=\"farmer-s-carry-m-mo-15\" d=\"^19\"/><path id=\"farmer-s-carry-m-mo-16\" d=\"^20\"/><path id=\"farmer-s-carry-m-mo-17\" d=\"^21\"/><path id=\"farmer-s-carry-m-mo-18\" d=\"^22\"/><path id=\"farmer-s-carry-m-mo-19\" d=\"^23\"/><path id=\"farmer-s-carry-m-mo-20\" d=\"^31\"/><path id=\"farmer-s-carry-m-mo-21\" d=\"^32\"/><path id=\"farmer-s-carry-m-mo-22\" d=\"^33\"/><path id=\"farmer-s-carry-m-mo-23\" d=\"^31\"/><path id=\"farmer-s-carry-m-mo-24\" d=\"^32\"/><path id=\"farmer-s-carry-m-mo-25\" d=\"^33\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#farmer-s-carry-m-dots)\"/>\n  <path class=\"floorline\" d=\"^30\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#farmer-s-carry-m-st-thigh.l\"/><use href=\"#farmer-s-carry-m-st-kneecap.l\"/><use href=\"#farmer-s-carry-m-st-shank.l\"/><use href=\"#farmer-s-carry-m-st-foot.l\"/><use href=\"#farmer-s-carry-m-st-shcap.l\"/><use href=\"#farmer-s-carry-m-st-upper.l\"/><use href=\"#farmer-s-carry-m-st-elbowcap.l\"/><use href=\"#farmer-s-carry-m-st-fore.l\"/><use href=\"#farmer-s-carry-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#farmer-s-carry-m-st-thigh.l\"/><use href=\"#farmer-s-carry-m-st-kneecap.l\"/><use href=\"#farmer-s-carry-m-st-shank.l\"/><use href=\"#farmer-s-carry-m-st-foot.l\"/><use href=\"#farmer-s-carry-m-st-shcap.l\"/><use href=\"#farmer-s-carry-m-st-upper.l\"/><use href=\"#farmer-s-carry-m-st-elbowcap.l\"/><use href=\"#farmer-s-carry-m-st-fore.l\"/><use href=\"#farmer-s-carry-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#farmer-s-carry-m-st-head\"/><use href=\"#farmer-s-carry-m-st-torso\"/><use href=\"#farmer-s-carry-m-st-thigh.r\"/><use href=\"#farmer-s-carry-m-st-kneecap.r\"/><use href=\"#farmer-s-carry-m-st-shank.r\"/><use href=\"#farmer-s-carry-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#farmer-s-carry-m-st-head\"/><use href=\"#farmer-s-carry-m-st-torso\"/><use href=\"#farmer-s-carry-m-st-thigh.r\"/><use href=\"#farmer-s-carry-m-st-kneecap.r\"/><use href=\"#farmer-s-carry-m-st-shank.r\"/><use href=\"#farmer-s-carry-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#farmer-s-carry-m-st-shcap.r\"/><use href=\"#farmer-s-carry-m-st-upper.r\"/><use href=\"#farmer-s-carry-m-st-elbowcap.r\"/><use href=\"#farmer-s-carry-m-st-fore.r\"/><use href=\"#farmer-s-carry-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#farmer-s-carry-m-st-shcap.r\"/><use href=\"#farmer-s-carry-m-st-upper.r\"/><use href=\"#farmer-s-carry-m-st-elbowcap.r\"/><use href=\"#farmer-s-carry-m-st-fore.r\"/><use href=\"#farmer-s-carry-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#farmer-s-carry-m-g0-thigh.r\"/><use href=\"#farmer-s-carry-m-g0-kneecap.r\"/><use href=\"#farmer-s-carry-m-g0-shank.r\"/><use href=\"#farmer-s-carry-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#farmer-s-carry-m-g0-thigh.r\"/><use href=\"#farmer-s-carry-m-g0-kneecap.r\"/><use href=\"#farmer-s-carry-m-g0-shank.r\"/><use href=\"#farmer-s-carry-m-g0-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-solid\" d=\"^31\"/><path class=\"disc\" d=\"^32\"/><path class=\"disc\" d=\"^33\"/><path class=\"eq-line m-line\" d=\"^34\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#farmer-s-carry-m-e-thigh.l\"/><use href=\"#farmer-s-carry-m-e-kneecap.l\"/><use href=\"#farmer-s-carry-m-e-shank.l\"/><use href=\"#farmer-s-carry-m-e-foot.l\"/><use href=\"#farmer-s-carry-m-e-shcap.l\"/><use href=\"#farmer-s-carry-m-e-upper.l\"/><use href=\"#farmer-s-carry-m-e-elbowcap.l\"/><use href=\"#farmer-s-carry-m-e-fore.l\"/><use href=\"#farmer-s-carry-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#farmer-s-carry-m-e-thigh.l\"/><use href=\"#farmer-s-carry-m-e-kneecap.l\"/><use href=\"#farmer-s-carry-m-e-shank.l\"/><use href=\"#farmer-s-carry-m-e-foot.l\"/><use href=\"#farmer-s-carry-m-e-shcap.l\"/><use href=\"#farmer-s-carry-m-e-upper.l\"/><use href=\"#farmer-s-carry-m-e-elbowcap.l\"/><use href=\"#farmer-s-carry-m-e-fore.l\"/><use href=\"#farmer-s-carry-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#farmer-s-carry-m-e-head\"/><use href=\"#farmer-s-carry-m-e-torso\"/><use href=\"#farmer-s-carry-m-e-thigh.r\"/><use href=\"#farmer-s-carry-m-e-kneecap.r\"/><use href=\"#farmer-s-carry-m-e-shank.r\"/><use href=\"#farmer-s-carry-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#farmer-s-carry-m-e-head\"/><use href=\"#farmer-s-carry-m-e-torso\"/><use href=\"#farmer-s-carry-m-e-thigh.r\"/><use href=\"#farmer-s-carry-m-e-kneecap.r\"/><use href=\"#farmer-s-carry-m-e-shank.r\"/><use href=\"#farmer-s-carry-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#farmer-s-carry-m-e-shcap.r\"/><use href=\"#farmer-s-carry-m-e-upper.r\"/><use href=\"#farmer-s-carry-m-e-elbowcap.r\"/><use href=\"#farmer-s-carry-m-e-fore.r\"/><use href=\"#farmer-s-carry-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#farmer-s-carry-m-e-shcap.r\"/><use href=\"#farmer-s-carry-m-e-upper.r\"/><use href=\"#farmer-s-carry-m-e-elbowcap.r\"/><use href=\"#farmer-s-carry-m-e-fore.r\"/><use href=\"#farmer-s-carry-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^31\"/><path class=\"disc\" d=\"^32\"/><path class=\"disc\" d=\"^33\"/><path class=\"eq-line m-line\" d=\"^34\"/><circle class=\"joint\" cx=\"152.56\" cy=\"138.15\" r=\"2.25\"/><circle class=\"joint\" cx=\"152.56\" cy=\"185.77\" r=\"2.25\"/><circle class=\"joint\" cx=\"154.02\" cy=\"205.81\" r=\"2.25\"/><circle class=\"joint\" cx=\"170.64\" cy=\"266.29\" r=\"2.25\"/></g><mask id=\"farmer-s-carry-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#farmer-s-carry-m-m-head\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-torso\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-thigh.l\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-shank.l\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-foot.l\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-shcap.l\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-upper.l\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-fore.l\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-fist.l\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-thigh.r\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-shank.r\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-foot.r\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-shcap.r\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-upper.r\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-fore.r\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-m-fist.r\" fill=\"#000\"/><use href=\"#farmer-s-carry-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#farmer-s-carry-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#farmer-s-carry-m-mmask)\"><g class=\"u-stroke\"><use href=\"#farmer-s-carry-m-m-head\"/><use href=\"#farmer-s-carry-m-m-torso\"/><use href=\"#farmer-s-carry-m-m-thigh.l\"/><use href=\"#farmer-s-carry-m-m-kneecap.l\"/><use href=\"#farmer-s-carry-m-m-shank.l\"/><use href=\"#farmer-s-carry-m-m-foot.l\"/><use href=\"#farmer-s-carry-m-m-shcap.l\"/><use href=\"#farmer-s-carry-m-m-upper.l\"/><use href=\"#farmer-s-carry-m-m-elbowcap.l\"/><use href=\"#farmer-s-carry-m-m-fore.l\"/><use href=\"#farmer-s-carry-m-m-fist.l\"/><use href=\"#farmer-s-carry-m-m-thigh.r\"/><use href=\"#farmer-s-carry-m-m-kneecap.r\"/><use href=\"#farmer-s-carry-m-m-shank.r\"/><use href=\"#farmer-s-carry-m-m-foot.r\"/><use href=\"#farmer-s-carry-m-m-shcap.r\"/><use href=\"#farmer-s-carry-m-m-upper.r\"/><use href=\"#farmer-s-carry-m-m-elbowcap.r\"/><use href=\"#farmer-s-carry-m-m-fore.r\"/><use href=\"#farmer-s-carry-m-m-fist.r\"/><use href=\"#farmer-s-carry-m-m-eq0\"/><use href=\"#farmer-s-carry-m-m-eq1\"/><use href=\"#farmer-s-carry-m-m-eq2\"/><use href=\"#farmer-s-carry-m-m-eq3\"/><use href=\"#farmer-s-carry-m-m-eq4\"/><use href=\"#farmer-s-carry-m-m-eq5\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MF!uyRK1LUP20LTP2yU1L!W3xU1L.W3xU1LUP2yU1LTP2YW3LTP2XW3LUP2xU1L.W3yU1L!W3yU1LTP2xU1LUP2XW3\"/><path class=\"leader m\" d=\"~MUER1AVx2L0.P4\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"farmer-s-carry-m-long\" data-key=\"long\" data-cue=\"A regular-sized step, too long for a beginner.\" class=\"plate-callout m\" style=\"left:62.57%;top:78.21%\" aria-pressed=\"true\">Steps too long</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "torso",
        cues: [{ key: "torso", cue: "Torso upright and chest tall, gaze ahead." }, { key: "shoulders", cue: "Shoulders back and down, not shrugged." }, { key: "arms", cue: "Arms fully extended at your sides." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "long",
        cues: [{ key: "long", cue: "A regular-sized step, too long for a beginner." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Steps too long</b><span>A regular-sized step, too long for a beginner.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: walk controlled\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Walk</b><span>Controlled</span></div></div></div>",
      alt: "Farmer's carry, side view. Standing tall with a dumbbell in each hand, arms long at the sides and shoulders back and down, the near foot takes one short step forward.",
      mistakeAlt: "Farmer's Carry: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hold",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW7: gap-ruled, no pair key draws a carry handle; the grip copy carries c3, c4 and c13.",
    "orientation": "neutral",
    "handle": "dumbbell",
    "loadAxis": "across",
    "overBody": false,
    "width": {
      "text": "Hands at the sides of your body.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-farmers",
          "fv-farmers"
        ],
        "note": "card c4"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-farmers"
        ],
        "note": "card c13"
      }
    },
    "contact": "heel",
    "wrist": {
      "exempt": "Hold default: no source gives a wrist position; the plate draws a straight wrist.",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "hold-default"
        ],
        "note": "card grip.wrist is empty (no source gives a wrist position): golden B's hold default, as lib_cable_fly; not a card claim, never shown"
      }
    },
    "faults": [
      {
        "key": "fingers-only",
        "label": "Fingers only",
        "pose": {},
        "markers": [],
        "alt": "Handle held in the fingers only, not pushed into the palm."
      }
    ],
    "gripLine": "Palm pushed into the handle, thumb wrapped, fingers curled around it. Not in the fingers only.",
    "cue": "Squeeze the handles hard."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "safety",
      "text": "Clear a level, dry route, with room to set down.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-farmers"
        ],
        "note": "card c2"
      }
    },
    {
      "kind": "position",
      "text": "Stand between the weights, feet about hip-width apart.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-farmers",
          "bb-farmers",
          "ggr-farmers"
        ],
        "note": "card c3"
      }
    },
    {
      "kind": "grip",
      "text": "Bend at your hips and knees and grip, thumbs wrapped.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-farmers",
          "bb-farmers",
          "ggr-farmers"
        ],
        "note": "card c3, c13"
      }
    },
    {
      "kind": "brace",
      "text": "Breathe in, brace, and stand up without jerking the weights.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-farmers",
          "bb-farmers",
          "ggr-farmers",
          "sl-farmers"
        ],
        "note": "card c3, c11"
      }
    },
    {
      "kind": "position",
      "text": "Stand fully tall, arms long at your sides, before your first step.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "ggr-farmers",
          "fv-farmers",
          "bb-fwbreak"
        ],
        "note": "card c4, c24"
      }
    }
  ],
  posture: [
    {
      "key": "torso",
      "label": "Tall torso",
      "detail": "Torso upright, gaze ahead.",
      "anchor": {
        "pose": "start",
        "at": "head"
      },
      "zoom": "torso",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-farmers",
          "fv-farmers"
        ],
        "note": "card c4"
      }
    },
    {
      "key": "arms",
      "label": "Arms long",
      "detail": "Arms long at your sides.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-farmers",
          "fv-farmers"
        ],
        "note": "card c4"
      }
    },
    {
      "key": "shoulders",
      "label": "Shoulders down",
      "detail": "Shoulders back and down, not shrugged.",
      "anchor": {
        "pose": "start",
        "at": "shoulder.r"
      },
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-farmers",
          "fv-farmers"
        ],
        "note": "card c5"
      }
    },
    {
      "key": "steps",
      "label": "Short steps",
      "detail": "Short, deliberate steps.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-farmers",
          "bb-farmers",
          "sl-farmers"
        ],
        "note": "card c8"
      }
    },
    {
      "key": "even",
      "label": "Weights even",
      "detail": "Weights even, not shifting to one side.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-farmers",
          "sl-farmers",
          "fv-farmers"
        ],
        "note": "card c9"
      }
    },
    {
      "key": "turn",
      "label": "Slow turns",
      "detail": "Slow down and turn with small steps.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-farmers"
        ],
        "note": "card c17"
      }
    }
  ],
  zooms: [
    {
      "key": "shoulders",
      "chip": "Shoulders",
      "heading": "Shoulders down",
      "kind": "posture"
    },
    {
      "key": "torso",
      "chip": "Torso",
      "heading": "Tall torso",
      "kind": "posture"
    }
  ],
  chips: [
    "shoulders",
    "torso",
    "feel"
  ],
  copy: {
    "setupLine": "Grip each weight, thumbs wrapped. Stand fully tall, arms long, then walk.",
    "mistakeLine": "Never hold the handles in the fingers only: push your palm in.",
    "cueLine": "Tall torso, shoulders down, short steps.",
    "variantLine": "Trap bar: step inside, deadlift it up, arms fully extended."
  },
  mistakes: [
    {
      "key": "rush",
      "title": "Rushing the walk",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-farmers",
          "fv-farmers"
        ],
        "note": "card c7, c17"
      },
      "fix": "Don't rush for distance. Turn in small steps, not a sharp pivot."
    },
    {
      "key": "long",
      "title": "Steps too long",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-farmers",
          "ggr-farmers",
          "sl-farmers",
          "fv-farmers"
        ],
        "note": "card c25, c8, c15"
      },
      "fix": "Take short, deliberate steps. Steps out of control? End the carry."
    },
    {
      "key": "shrug",
      "title": "Shrugging as you tire",
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-farmers",
          "fv-farmers",
          "sl-farmers"
        ],
        "note": "card c5, c15"
      },
      "fix": "Keep your shoulders back and down. Posture changing? End the carry."
    }
  ],
  risks: [
    {
      "key": "rush",
      "text": "Rushing: one misstep could pull a calf, roll an ankle or twist a knee.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-farmers",
          "fv-farmers"
        ],
        "note": "card c7"
      }
    },
    {
      "key": "brace",
      "text": "Not bracing can wreak havoc on your lower back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-farmers"
        ],
        "note": "card c10"
      }
    },
    {
      "key": "grip",
      "text": "Without a good grip, the weights may slip and land on your toe.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-farmers"
        ],
        "note": "card c14"
      }
    }
  ],
  riskFlags: [
    "back"
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
    "bb-farmers",
    "ggr-farmers",
    "fv-farmers",
    "sl-farmers",
    "bb-fwbreak",
    "hold-default",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/farmer_s_carry.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

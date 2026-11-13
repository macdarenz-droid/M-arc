// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=52a6dfd3d5eeab2c00c314840bce472a78fadf69c4496307d74e41c6d9342fb4
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_bodyweight_lunge",
  name: "Bodyweight Lunge",
  hashes: { inputsSha256: "52a6dfd3d5eeab2c00c314840bce472a78fadf69c4496307d74e41c6d9342fb4", golden: "378d18b08efd3421035238e2883cd62e8a2533b32d9c775cd7356995d28c6696" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"bodyweight-lunge-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"bodyweight-lunge-n-st-thigh.l\" d=\"~#F12!JgH_E1GFgIID1x2VbB11P4U(1!5.7W2x4U1)U1(bEnbBkVc-mK3)U1.2.3x6V7I2W(1D10W1-bKvGbElFG1k(z1WmNF112000000010000220000110200110001010001000010000000200000000101000000002101200000\"/><path id=\"bodyweight-lunge-n-st-kneecap.l\" d=\"~~PThUwU1_J10\"/><path id=\"bodyweight-lunge-n-st-shank.l\" d=\"~#F12yShS!T1.-h.KS1_2RbF12jA)1U6I7y3T3A2)y2N8.cw1)bx6BeS9Gy2K2B4E5G8GaF(1E13p.bVdNaKfPn-1UlwbWp00000001111000100100020000000010012000000000000200020010020002002010100000010100\"/><path id=\"bodyweight-lunge-n-st-foot.l\" d=\"~#o2NxhDB)1xThEB(1_cF3Uh)7Sp)nU-2B3XJ2-4OD1*7*n1TG1_4BbXc_sEbImUp100000002010002000200000100020002000020100220010\"/><path id=\"bodyweight-lunge-n-st-shcap.l\" d=\"~~UGhyGqwP10\"/><path id=\"bodyweight-lunge-n-st-upper.l\" d=\"~#F12UGhyGqRHhIBpe.8c1H2UO1D3.5N1x3Y5KD1ya-i0Igxa-iV5KD1O1x3B3.5I2UO191d.8Bgz1XdUp2JmUdUp00000000211010020011100000000120000100200000111002100001000000000100000000000001\"/><path id=\"bodyweight-lunge-n-st-elbowcap.l\" d=\"~~NWhUSz1Dz10\"/><path id=\"bodyweight-lunge-n-st-fore.l\" d=\"~#F12(UhDVz1)Vh)Yy1y1Iaq_1S6yI1!2R9N1K2.1*w1w6BdpEbX7EcX2.w1X1E2B4x9dSI1j(1K2zaBaix9FkD1Dh!bYi10002000000101000010101000002001001000000000210101010100000000101000200000000110\"/><path id=\"bodyweight-lunge-n-st-fist.l\" d=\"~~POi(HK1ww10\"/><path id=\"bodyweight-lunge-n-st-head\" d=\"~#w12U-iyGgKDhO)fBjFjBjS9Bbz3E3Y4X4)7x8EbRhGm_4.cT1R9Bj0NmBbJmI6YkA3FjygT1Dj2020020000000200012000101100220120200000202002000010010000000000\"/><path id=\"bodyweight-lunge-n-st-torso\" d=\"~#_12UGhyxlBThVSjV9I6z30S9UhU9J6_cwgJ60K6)nIm)7XcY4(fX4_kI6Nm)fShTh_4T9)7)fBrzz1BbErK60T90!cwgA3w8Xc)7)fw8K6YkN6P6_cEbD3w8ET2ww101100000000000012000001001100101202001020000000000000100000020000200011100110000000010000000001001000200011010000100\"/><path id=\"bodyweight-lunge-n-st-thigh.r\" d=\"^0\"/><path id=\"bodyweight-lunge-n-st-kneecap.r\" d=\"^1\"/><path id=\"bodyweight-lunge-n-st-shank.r\" d=\"^2\"/><path id=\"bodyweight-lunge-n-st-foot.r\" d=\"^3\"/><path id=\"bodyweight-lunge-n-st-shcap.r\" d=\"^4\"/><path id=\"bodyweight-lunge-n-st-upper.r\" d=\"^5\"/><path id=\"bodyweight-lunge-n-st-elbowcap.r\" d=\"^6\"/><path id=\"bodyweight-lunge-n-st-fore.r\" d=\"^7\"/><path id=\"bodyweight-lunge-n-st-fist.r\" d=\"^8\"/><path id=\"bodyweight-lunge-n-g0-thigh.l\" d=\"~#F12(NjJ)F1GEj-PE1-2RbB12S8F(1H5G8N2z4-1zV1Ja)nV1xkze*l*6XU1x3V3R6G7U1_(1H13q.bxw1B9OiPH1w3_z1DpwE101110100101000000002000210100012100020000010100000001000000000000100012100000000\"/><path id=\"bodyweight-lunge-n-g0-kneecap.l\" d=\"~~!NlW)U1_J10\"/><path id=\"bodyweight-lunge-n-g0-shank.l\" d=\"~#F12DRlAKU1REmIzT1N6xaA1gXkU.1U8X4A4R2Jn.(1ycR9!4*aE1OfDu-.1tV4G2T9TtYX1B1fy3ObIgP5xmJhV8!jH2ws01000000000000000001210000100000200001020002000000002000000000200000000002020000\"/><path id=\"bodyweight-lunge-n-g0-foot.l\" d=\"~#o2NxhAB)1xThzB(1_cF3Uhx8Sp)nU-2B3XJ2-4OD1)7*n2TG1Y4Bb-c_sBbImSp120002012110002101200000100220002101000000210110\"/><path id=\"bodyweight-lunge-n-g0-head\" d=\"~#w12SFmAGhOVkT(gRj!iIjF9zbK3G3_4V4z8X7GbBhXmw5VcK1T9Bj9Sm-aPmx6_kU3_iHg.1Aj2000021000000010101001002000000000101010101010000000020111002000\"/><path id=\"bodyweight-lunge-n-g0-torso\" d=\"~#_12(VkHwmGwlzSkR9O6z33F9_hP9S6PcFgN62)5xoGmK8-cS4ygK4(kz6UmRf(hGh(4O9V7zgRqVz1XaIrK63R93PcDgy3y8TcE8zgY7-6UkH6S6wd*aw3w8VT2Su00100001200010000010020000000011102000000200001000000010000200000010021010000200000000210000000011101200000011010101\"/><path id=\"bodyweight-lunge-n-g0-thigh.r\" d=\"~#F12y(jAEH1.(i-zG1O8E8tmJF1yP10-91-4.t)I1.3XpBcBgTn)a*x1*F1O4K1O9V2_y1DU1y1lV5Ra)vH9w7_K1SlYsyH1Pj00000200000012100000200000000011100001101000020010000000001111000001200010000100\"/><path id=\"bodyweight-lunge-n-g0-kneecap.r\" d=\"~~Y-rHSS1_J10\"/><path id=\"bodyweight-lunge-n-g0-shank.r\" d=\"~#F12y-rS.S1GTrRJR1h*bD17JhW!1F4*8(1I4xh-w2N4-eI2Vb.9*bX9Ey2K3I3K7K6_7U(1E16z4BbBawez8_qJ4Hl(hPl00000000000121010100000101000000000101000001000002000011010000020000000200000000\"/><path id=\"bodyweight-lunge-n-g0-foot.r\" d=\"~#o2FPuy-*1)YuTV!1Fd7!eEcSi-tWV2EqKI2FfzE1D2BnF6*D1JfzeK9!oEi*ePu010100001000000012000020000000020000000200000000\"/><path id=\"bodyweight-lunge-n-g0-shcap.r\" d=\"~~wTkAGrwP10\"/><path id=\"bodyweight-lunge-n-g0-upper.r\" d=\"~#F12wTkAGr*TkKBqe.8c1H2WO1D3)5N1)2Y5KD1ya-i0Igxa-iX5KD1K1)2z3)5K2WO191d.8Bgz1XdUp0JmYdUp00000000211010000110100000000000000000200000000120101001000000000100000020000001\"/><path id=\"bodyweight-lunge-n-g0-elbowcap.r\" d=\"~~_)kWSA1Dz10\"/><path id=\"bodyweight-lunge-n-g0-fore.r\" d=\"~#F12H(kFVA1I)kx-z1y1Iaq_1S6yI1!2R9N1I2.1xx1w6zdpEbX7EcX2.w1X1E2B4x9dSI1j(1O2zaxaiz9FkD1Dh!bYi10000010000101000010101101000200001000100000210101010100001000000000000000000110\"/><path id=\"bodyweight-lunge-n-g0-fist.r\" d=\"~~!YlwIN1ww10\"/><path id=\"bodyweight-lunge-n-g1-thigh.l\" d=\"~#F12yJtPIN1IBt-!J1T2RbB10J7N(1J5B8S2z4nBV1(aVnG1zkVdEm-5.U1)2V3K6O7cY(1H10w1.b-v-9IjAH1D2_z1NoPE101001001002000000100210000020002100000000010000001010002000010000000000100002000\"/><path id=\"bodyweight-lunge-n-g1-kneecap.l\" d=\"~~yAvwN_1_J10\"/><path id=\"bodyweight-lunge-n-g1-shank.l\" d=\"~#F12HEw1Sw-1GWx1O_Y1(bj8D1R!1_h!8D4P4!1Ww2Oh_eJ4_bR2Yb.9Hy2EaF3K3P6O7R(1F89E1AbB4)dza*q.7BlP4Klyi10020000000200000120001000100000210200000000002100010011101100200000000022101000\"/><path id=\"bodyweight-lunge-n-g1-foot.l\" d=\"~#o2JUkyS.1OXl.E.1!6HbyiY6yz1D1Wx2y*1)S1V-1Kl-w1)g)g-w1*pA1xhHsPc*x1F2110121001100002000001001011000101201010002101001\"/><path id=\"bodyweight-lunge-n-g1-head\" d=\"~#w12(-E1AAozKD1TGnRoPbIlP2K9.6R4J3.1z9T3Ed.8xr_8Ia!1T9ziO6(o.2FnU1JiAaUcSlx8Sh0100000002000101001000000202001000200112000001010000012100000000\"/><path id=\"bodyweight-lunge-n-g1-torso\" d=\"~#_12_YA1PysVRB1B_q-6E9x3z1w3_j!6F9S6Pj(5A2F2XoGizfVd4WguYlA1PqI7SmRa_7I7x2XhRdIH1z1Itx6B2x9G3U6Nj6S8E9-bXhw2zdHh_3F8!fz68S8B-2U120000200110101010002001100000002000200010100200100010100000200101200200000001000001010002000210101000000100010101002\"/><path id=\"bodyweight-lunge-n-g1-thigh.r\" d=\"~#F12JPuAFP1IDtTSO1*aT4ly1DX1wuO3B9*1K4.I1xuxdRmBhTaxqR1ON1-p-4c.9sUT1(z1kx1x9X7IqJkDnAF1Uu(iFN1Y200010000000000000010110020000020000001010102001001002000000000200202002000000100\"/><path id=\"bodyweight-lunge-n-g1-kneecap.r\" d=\"~~N-F1WUU1_J10\"/><path id=\"bodyweight-lunge-n-g1-shank.r\" d=\"~#F12N_F1(zV1KNF1zWT1E2VbF1dHp_-1w3G9H1V4Rp)*1N2Ef*3GbIbKaKiOw2*3-2B8O5ygA*1z1cV5RaB8FfK4WrD7PkSk(i00100000210001001000001010000200020002000000000000101000001000002000100100011100\"/><path id=\"bodyweight-lunge-n-g1-foot.r\" d=\"~#o2_HK1DB)1K!K1EB(1_cF3Uh*7UpxoS-2B3-J2-4ID1)7xo0OG1!4Eb.cYsBbGmUp100002002020000111001000101200022001101000000011\"/><path id=\"bodyweight-lunge-n-g1-shcap.r\" d=\"~~P!y1_Px1wP10\"/><path id=\"bodyweight-lunge-n-g1-upper.r\" d=\"~#F12P!y1_Px1K*y1zKw1e.8a1N2WO1y3)5S1)2W5KD1yaXi0OgxaXiX5KD1K1)2B3)5G2WO1b1d.8Egx1TdPp1PmYdPp00020000000200100000000010000000000000000000000000000210000002000000001010000000\"/><path id=\"bodyweight-lunge-n-g1-elbowcap.r\" d=\"~~HGz1J_H1Dz10\"/><path id=\"bodyweight-lunge-n-g1-fore.r\" d=\"~#F12YEz1w*H1XFz1.wH1uGau_1P6yI1_2O9P1O2-1*w1!5EdnBbV7Ec-2.w1X1E2B4x9dSI1l(1I2zazaiz9FkD1Dh_b_i01000000000101000000210101010000000000101000011110010010000000200000000000000001\"/><path id=\"bodyweight-lunge-n-g1-fist.r\" d=\"~~HyA1YSU1ww10\"/><path id=\"bodyweight-lunge-n-e-thigh.l\" d=\"~#F12wGy1_KT1xVy1BwS1A2Xbz1bThH!1F8K5(3-2ykBR1FjThY6)i)3.pFf.S1E1T4x3K9xoy_1A1cU5OaOpKlEy1Dv)b!x1A7!K100110000000001000100000012100000020001000000000101000210001000120000010110000020\"/><path id=\"bodyweight-lunge-n-e-kneecap.l\" d=\"~~Fyv(Y)1_J10\"/><path id=\"bodyweight-lunge-n-e-shank.l\" d=\"~#F12U-w1_I(1XDy1E_(1ybN47F1K(1R9F6S7F3S3Ay2UbPbFaYbW2!e)3Jw2!iN4X1y9)3E!1zjaB1(bsO8xf)kRiBl)4)qJ711000000021210011100202000000001010000000100020000010000000100100000010100200200\"/><path id=\"bodyweight-lunge-n-e-foot.l\" d=\"^29\"/><path id=\"bodyweight-lunge-n-e-shcap.l\" d=\"~~DVE1JRE1wP10\"/><path id=\"bodyweight-lunge-n-e-upper.l\" d=\"~#F12DVE1JRE1zWE1TKD1e)8a2N2SO1A3.5N1x3Y5OD1yaVi0OgxaViX5OD1K1x3z3.5K2SO192d)8BgvXdPp0PmYdPp02000002000000100011100002020000000002020000010000101000020000020000000000000000\"/><path id=\"bodyweight-lunge-n-e-elbowcap.l\" d=\"~~wyF1w.P1Dz10\"/><path id=\"bodyweight-lunge-n-e-fore.l\" d=\"~#F12PwF1S*P1RxF1IxP1w1IauY1P6DI1!2T9N1K2.1*w1(5BdnEbV7Ec-2*w1X1z2B4z9dSI1l(1I2zazaiz9FkD1Dh!bYi10000100210000000010101000000001200001111002200011010110000020200100000001000110\"/><path id=\"bodyweight-lunge-n-e-fist.l\" d=\"~~w.F1HT_1ww10\"/><path id=\"bodyweight-lunge-n-e-head\" d=\"~#w12USJ1WAu-BI1zHtRoNbIlN2I9-6V4N3-1B9T3Ed.8xr!8KaY1O9xiT6(o-2FnU1NiAaPcUl)7Nh0000000000000010101000200000001000021000000000000000000010210100\"/><path id=\"bodyweight-lunge-n-e-torso\" d=\"~#_12SRG1Azy1OHH1-_w1X6G9x3x1y3_jY6H9U6Jj(5F2F2-oGizfVd2Wgy1Ylw1PqG7SmOa_7K7x2XhOdIH1E1It)5E2x9B3U6Hj6W8B9*b.hy2xdJh_3D8!fB68W8z-2S100000000000000000000001000012000200101200000200002020000010000000010000001000201201210000010000200000000000210001000\"/><path id=\"bodyweight-lunge-n-e-thigh.r\" d=\"~#F12JRA1AUW1Gyz1-XW1XbY11F1Y(1K3-7)5*3V2BV1T2*mGcBk1xnJczV1P2.3Y2.7w6Y(1P31G1XbX1XbAv_F1wm(z10!F1*l22200110000000000010101001000000000210000020020200000000100220200002000000200000\"/><path id=\"bodyweight-lunge-n-e-kneecap.r\" d=\"~~UJO1PEU1_J10\"/><path id=\"bodyweight-lunge-n-e-shank.r\" d=\"~#F12yJO1!*T1R-O1OPS1F4zbD18G8S(1N7K6S3G3FaBy2(9.bS2VbI4-eUhXw2.1I4E4)8-hU!1B19k.b*eW8ziNlO4Fl!7!q01100200100000111001010002101020000000012000000100002000000000000000020020002001\"/><path id=\"bodyweight-lunge-n-e-foot.r\" d=\"~#o2_HK1DB)1K!K1EB(1_cF3Uh)7Up*nS-2E3-J2-4ID1)7xo0OG1_4EbXcYsEbGmUp100002002220000011011000101000002000121000000011\"/><path id=\"bodyweight-lunge-n-e-shcap.r\" d=\"^44\"/><path id=\"bodyweight-lunge-n-e-upper.r\" d=\"^45\"/><path id=\"bodyweight-lunge-n-e-elbowcap.r\" d=\"^46\"/><path id=\"bodyweight-lunge-n-e-fore.r\" d=\"^47\"/><path id=\"bodyweight-lunge-n-e-fist.r\" d=\"^48\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#bodyweight-lunge-n-dots)\"/>\n  <path class=\"floorline\" d=\"M57.83 339.5H306.51\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-n-st-thigh.l\"/><use href=\"#bodyweight-lunge-n-st-kneecap.l\"/><use href=\"#bodyweight-lunge-n-st-shank.l\"/><use href=\"#bodyweight-lunge-n-st-foot.l\"/><use href=\"#bodyweight-lunge-n-st-shcap.l\"/><use href=\"#bodyweight-lunge-n-st-upper.l\"/><use href=\"#bodyweight-lunge-n-st-elbowcap.l\"/><use href=\"#bodyweight-lunge-n-st-fore.l\"/><use href=\"#bodyweight-lunge-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-n-st-thigh.l\"/><use href=\"#bodyweight-lunge-n-st-kneecap.l\"/><use href=\"#bodyweight-lunge-n-st-shank.l\"/><use href=\"#bodyweight-lunge-n-st-foot.l\"/><use href=\"#bodyweight-lunge-n-st-shcap.l\"/><use href=\"#bodyweight-lunge-n-st-upper.l\"/><use href=\"#bodyweight-lunge-n-st-elbowcap.l\"/><use href=\"#bodyweight-lunge-n-st-fore.l\"/><use href=\"#bodyweight-lunge-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-n-st-head\"/><use href=\"#bodyweight-lunge-n-st-torso\"/><use href=\"#bodyweight-lunge-n-st-thigh.r\"/><use href=\"#bodyweight-lunge-n-st-kneecap.r\"/><use href=\"#bodyweight-lunge-n-st-shank.r\"/><use href=\"#bodyweight-lunge-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-n-st-head\"/><use href=\"#bodyweight-lunge-n-st-torso\"/><use href=\"#bodyweight-lunge-n-st-thigh.r\"/><use href=\"#bodyweight-lunge-n-st-kneecap.r\"/><use href=\"#bodyweight-lunge-n-st-shank.r\"/><use href=\"#bodyweight-lunge-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-n-st-shcap.r\"/><use href=\"#bodyweight-lunge-n-st-upper.r\"/><use href=\"#bodyweight-lunge-n-st-elbowcap.r\"/><use href=\"#bodyweight-lunge-n-st-fore.r\"/><use href=\"#bodyweight-lunge-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-n-st-shcap.r\"/><use href=\"#bodyweight-lunge-n-st-upper.r\"/><use href=\"#bodyweight-lunge-n-st-elbowcap.r\"/><use href=\"#bodyweight-lunge-n-st-fore.r\"/><use href=\"#bodyweight-lunge-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-n-g0-thigh.l\"/><use href=\"#bodyweight-lunge-n-g0-kneecap.l\"/><use href=\"#bodyweight-lunge-n-g0-shank.l\"/><use href=\"#bodyweight-lunge-n-g0-foot.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-n-g0-thigh.l\"/><use href=\"#bodyweight-lunge-n-g0-kneecap.l\"/><use href=\"#bodyweight-lunge-n-g0-shank.l\"/><use href=\"#bodyweight-lunge-n-g0-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-n-g0-head\"/><use href=\"#bodyweight-lunge-n-g0-torso\"/><use href=\"#bodyweight-lunge-n-g0-thigh.r\"/><use href=\"#bodyweight-lunge-n-g0-kneecap.r\"/><use href=\"#bodyweight-lunge-n-g0-shank.r\"/><use href=\"#bodyweight-lunge-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-n-g0-head\"/><use href=\"#bodyweight-lunge-n-g0-torso\"/><use href=\"#bodyweight-lunge-n-g0-thigh.r\"/><use href=\"#bodyweight-lunge-n-g0-kneecap.r\"/><use href=\"#bodyweight-lunge-n-g0-shank.r\"/><use href=\"#bodyweight-lunge-n-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-n-g0-shcap.r\"/><use href=\"#bodyweight-lunge-n-g0-upper.r\"/><use href=\"#bodyweight-lunge-n-g0-elbowcap.r\"/><use href=\"#bodyweight-lunge-n-g0-fore.r\"/><use href=\"#bodyweight-lunge-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-n-g0-shcap.r\"/><use href=\"#bodyweight-lunge-n-g0-upper.r\"/><use href=\"#bodyweight-lunge-n-g0-elbowcap.r\"/><use href=\"#bodyweight-lunge-n-g0-fore.r\"/><use href=\"#bodyweight-lunge-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-n-g1-thigh.l\"/><use href=\"#bodyweight-lunge-n-g1-kneecap.l\"/><use href=\"#bodyweight-lunge-n-g1-shank.l\"/><use href=\"#bodyweight-lunge-n-g1-foot.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-n-g1-thigh.l\"/><use href=\"#bodyweight-lunge-n-g1-kneecap.l\"/><use href=\"#bodyweight-lunge-n-g1-shank.l\"/><use href=\"#bodyweight-lunge-n-g1-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-n-g1-head\"/><use href=\"#bodyweight-lunge-n-g1-torso\"/><use href=\"#bodyweight-lunge-n-g1-thigh.r\"/><use href=\"#bodyweight-lunge-n-g1-kneecap.r\"/><use href=\"#bodyweight-lunge-n-g1-shank.r\"/><use href=\"#bodyweight-lunge-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-n-g1-head\"/><use href=\"#bodyweight-lunge-n-g1-torso\"/><use href=\"#bodyweight-lunge-n-g1-thigh.r\"/><use href=\"#bodyweight-lunge-n-g1-kneecap.r\"/><use href=\"#bodyweight-lunge-n-g1-shank.r\"/><use href=\"#bodyweight-lunge-n-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-n-g1-shcap.r\"/><use href=\"#bodyweight-lunge-n-g1-upper.r\"/><use href=\"#bodyweight-lunge-n-g1-elbowcap.r\"/><use href=\"#bodyweight-lunge-n-g1-fore.r\"/><use href=\"#bodyweight-lunge-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-n-g1-shcap.r\"/><use href=\"#bodyweight-lunge-n-g1-upper.r\"/><use href=\"#bodyweight-lunge-n-g1-elbowcap.r\"/><use href=\"#bodyweight-lunge-n-g1-fore.r\"/><use href=\"#bodyweight-lunge-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-n-e-thigh.l\"/><use href=\"#bodyweight-lunge-n-e-kneecap.l\"/><use href=\"#bodyweight-lunge-n-e-shank.l\"/><use href=\"#bodyweight-lunge-n-e-foot.l\"/><use href=\"#bodyweight-lunge-n-e-shcap.l\"/><use href=\"#bodyweight-lunge-n-e-upper.l\"/><use href=\"#bodyweight-lunge-n-e-elbowcap.l\"/><use href=\"#bodyweight-lunge-n-e-fore.l\"/><use href=\"#bodyweight-lunge-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-n-e-thigh.l\"/><use href=\"#bodyweight-lunge-n-e-kneecap.l\"/><use href=\"#bodyweight-lunge-n-e-shank.l\"/><use href=\"#bodyweight-lunge-n-e-foot.l\"/><use href=\"#bodyweight-lunge-n-e-shcap.l\"/><use href=\"#bodyweight-lunge-n-e-upper.l\"/><use href=\"#bodyweight-lunge-n-e-elbowcap.l\"/><use href=\"#bodyweight-lunge-n-e-fore.l\"/><use href=\"#bodyweight-lunge-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-n-e-head\"/><use href=\"#bodyweight-lunge-n-e-torso\"/><use href=\"#bodyweight-lunge-n-e-thigh.r\"/><use href=\"#bodyweight-lunge-n-e-kneecap.r\"/><use href=\"#bodyweight-lunge-n-e-shank.r\"/><use href=\"#bodyweight-lunge-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-n-e-head\"/><use href=\"#bodyweight-lunge-n-e-torso\"/><use href=\"#bodyweight-lunge-n-e-thigh.r\"/><use href=\"#bodyweight-lunge-n-e-kneecap.r\"/><use href=\"#bodyweight-lunge-n-e-shank.r\"/><use href=\"#bodyweight-lunge-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-n-e-shcap.r\"/><use href=\"#bodyweight-lunge-n-e-upper.r\"/><use href=\"#bodyweight-lunge-n-e-elbowcap.r\"/><use href=\"#bodyweight-lunge-n-e-fore.r\"/><use href=\"#bodyweight-lunge-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-n-e-shcap.r\"/><use href=\"#bodyweight-lunge-n-e-upper.r\"/><use href=\"#bodyweight-lunge-n-e-elbowcap.r\"/><use href=\"#bodyweight-lunge-n-e-fore.r\"/><use href=\"#bodyweight-lunge-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"210.75\" cy=\"202.46\" r=\"2.25\"/><circle class=\"joint\" cx=\"210.75\" cy=\"250.08\" r=\"2.25\"/><circle class=\"joint\" cx=\"187.11\" cy=\"267.42\" r=\"2.25\"/><circle class=\"joint\" cx=\"249.83\" cy=\"267.44\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#y20_WkyKF1XPkxIF12000000010_d_8120021120000211200012210002112GaD121020112200112210210000001200100010011101101200000000020000210000000002001001000000000220000100000000100101000210000000000001200000100000000000002000000\"/><path class=\"arrow\" d=\"~Mw-z1SFT1L)B1XhLNz2R5Z\"/><path data-guide=\"thigh\" style=\"display:none\" class=\"lead-guide\" d=\"~MSyT1JEU1LE_g0\"/><path data-guide=\"hips\" style=\"display:none\" class=\"lead-guide\" d=\"~MNRA1JEU1L0J)d\"/></g><path class=\"leader\" d=\"M187.11 267.42L235 226H245\"/><circle class=\"anchor\" cx=\"187.11\" cy=\"267.42\" r=\"1.5\"/><path class=\"leader\" d=\"M224.74 267.43L265 312H275\"/><circle class=\"anchor\" cx=\"224.74\" cy=\"267.43\" r=\"1.5\"/><path class=\"leader\" d=\"M189.05 208.19L231 166H241\"/><circle class=\"anchor\" cx=\"189.05\" cy=\"208.19\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"bodyweight-lunge-n-hips\" data-key=\"hips\" data-cue=\"Drop the hips toward the floor rather than driving them forward.\" class=\"plate-callout two\" style=\"left:67.04%;top:56.98%\" aria-pressed=\"true\">Hips drop<br>down</button><button type=\"button\" id=\"bodyweight-lunge-n-thigh\" data-key=\"thigh\" data-cue=\"Lower until the front thigh is about parallel, or to a comfortable depth.\" class=\"plate-callout two\" style=\"left:75.42%;top:81.01%\" aria-pressed=\"false\">Thigh<br>parallel</button><button type=\"button\" id=\"bodyweight-lunge-n-back\" data-key=\"back\" data-cue=\"Bend forward at the hips with a flat back.\" class=\"plate-callout\" style=\"left:65.92%;top:40.22%\" aria-pressed=\"false\">Flat back</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"bodyweight-lunge-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"bodyweight-lunge-m-st-thigh.l\" d=\"^0\"/><path id=\"bodyweight-lunge-m-st-kneecap.l\" d=\"^1\"/><path id=\"bodyweight-lunge-m-st-shank.l\" d=\"^2\"/><path id=\"bodyweight-lunge-m-st-foot.l\" d=\"^3\"/><path id=\"bodyweight-lunge-m-st-shcap.l\" d=\"^4\"/><path id=\"bodyweight-lunge-m-st-upper.l\" d=\"^5\"/><path id=\"bodyweight-lunge-m-st-elbowcap.l\" d=\"^6\"/><path id=\"bodyweight-lunge-m-st-fore.l\" d=\"^7\"/><path id=\"bodyweight-lunge-m-st-fist.l\" d=\"^8\"/><path id=\"bodyweight-lunge-m-st-head\" d=\"^9\"/><path id=\"bodyweight-lunge-m-st-torso\" d=\"^10\"/><path id=\"bodyweight-lunge-m-st-thigh.r\" d=\"^0\"/><path id=\"bodyweight-lunge-m-st-kneecap.r\" d=\"^1\"/><path id=\"bodyweight-lunge-m-st-shank.r\" d=\"^2\"/><path id=\"bodyweight-lunge-m-st-foot.r\" d=\"^3\"/><path id=\"bodyweight-lunge-m-st-shcap.r\" d=\"^4\"/><path id=\"bodyweight-lunge-m-st-upper.r\" d=\"^5\"/><path id=\"bodyweight-lunge-m-st-elbowcap.r\" d=\"^6\"/><path id=\"bodyweight-lunge-m-st-fore.r\" d=\"^7\"/><path id=\"bodyweight-lunge-m-st-fist.r\" d=\"^8\"/><path id=\"bodyweight-lunge-m-g0-thigh.l\" d=\"^11\"/><path id=\"bodyweight-lunge-m-g0-kneecap.l\" d=\"^12\"/><path id=\"bodyweight-lunge-m-g0-shank.l\" d=\"^13\"/><path id=\"bodyweight-lunge-m-g0-foot.l\" d=\"^14\"/><path id=\"bodyweight-lunge-m-g0-head\" d=\"^15\"/><path id=\"bodyweight-lunge-m-g0-torso\" d=\"^16\"/><path id=\"bodyweight-lunge-m-g0-thigh.r\" d=\"^17\"/><path id=\"bodyweight-lunge-m-g0-kneecap.r\" d=\"^18\"/><path id=\"bodyweight-lunge-m-g0-shank.r\" d=\"^19\"/><path id=\"bodyweight-lunge-m-g0-foot.r\" d=\"^20\"/><path id=\"bodyweight-lunge-m-g0-shcap.r\" d=\"^21\"/><path id=\"bodyweight-lunge-m-g0-upper.r\" d=\"^22\"/><path id=\"bodyweight-lunge-m-g0-elbowcap.r\" d=\"^23\"/><path id=\"bodyweight-lunge-m-g0-fore.r\" d=\"^24\"/><path id=\"bodyweight-lunge-m-g0-fist.r\" d=\"^25\"/><path id=\"bodyweight-lunge-m-g1-thigh.l\" d=\"^26\"/><path id=\"bodyweight-lunge-m-g1-kneecap.l\" d=\"^27\"/><path id=\"bodyweight-lunge-m-g1-shank.l\" d=\"^28\"/><path id=\"bodyweight-lunge-m-g1-foot.l\" d=\"^29\"/><path id=\"bodyweight-lunge-m-g1-head\" d=\"^30\"/><path id=\"bodyweight-lunge-m-g1-torso\" d=\"^31\"/><path id=\"bodyweight-lunge-m-g1-thigh.r\" d=\"^32\"/><path id=\"bodyweight-lunge-m-g1-kneecap.r\" d=\"^33\"/><path id=\"bodyweight-lunge-m-g1-shank.r\" d=\"^34\"/><path id=\"bodyweight-lunge-m-g1-foot.r\" d=\"^35\"/><path id=\"bodyweight-lunge-m-g1-shcap.r\" d=\"^36\"/><path id=\"bodyweight-lunge-m-g1-upper.r\" d=\"^37\"/><path id=\"bodyweight-lunge-m-g1-elbowcap.r\" d=\"^38\"/><path id=\"bodyweight-lunge-m-g1-fore.r\" d=\"^39\"/><path id=\"bodyweight-lunge-m-g1-fist.r\" d=\"^40\"/><path id=\"bodyweight-lunge-m-e-thigh.l\" d=\"^41\"/><path id=\"bodyweight-lunge-m-e-kneecap.l\" d=\"^42\"/><path id=\"bodyweight-lunge-m-e-shank.l\" d=\"^43\"/><path id=\"bodyweight-lunge-m-e-foot.l\" d=\"^29\"/><path id=\"bodyweight-lunge-m-e-shcap.l\" d=\"^44\"/><path id=\"bodyweight-lunge-m-e-upper.l\" d=\"^45\"/><path id=\"bodyweight-lunge-m-e-elbowcap.l\" d=\"^46\"/><path id=\"bodyweight-lunge-m-e-fore.l\" d=\"^47\"/><path id=\"bodyweight-lunge-m-e-fist.l\" d=\"^48\"/><path id=\"bodyweight-lunge-m-e-head\" d=\"^49\"/><path id=\"bodyweight-lunge-m-e-torso\" d=\"^50\"/><path id=\"bodyweight-lunge-m-e-thigh.r\" d=\"^51\"/><path id=\"bodyweight-lunge-m-e-kneecap.r\" d=\"^52\"/><path id=\"bodyweight-lunge-m-e-shank.r\" d=\"^53\"/><path id=\"bodyweight-lunge-m-e-foot.r\" d=\"^54\"/><path id=\"bodyweight-lunge-m-e-shcap.r\" d=\"^44\"/><path id=\"bodyweight-lunge-m-e-upper.r\" d=\"^45\"/><path id=\"bodyweight-lunge-m-e-elbowcap.r\" d=\"^46\"/><path id=\"bodyweight-lunge-m-e-fore.r\" d=\"^47\"/><path id=\"bodyweight-lunge-m-e-fist.r\" d=\"^48\"/><path id=\"bodyweight-lunge-m-m-head\" d=\"~#w12wzP1WAuBWN1zHtRoNbIlN2K9-6T4N3X1B9V3Ed*8xr(8Ka_1O9ziT6(o-2DnU1PiAaScUlx8Nh0000000000000000200020000000000020220010000000000000200000010100\"/><path id=\"bodyweight-lunge-m-m-torso\" d=\"~#_12!xK1Azy1X_K1-_w1-6G9x3x1w3_j!6H9P6Jjy6F2D2-oGizfVd2Wgy1Ylw1PqG7SmOa_7K7x2XhRdIH1z1Itz6E2*8B3P6HjaW8G9*bXhy2zdJh_3D8_fB6aW8z-2S120000000100000000000000020010000000101000000000002020000010000101000200001000201000200000000200200000010100200200000\"/><path id=\"bodyweight-lunge-m-m-thigh.l\" d=\"~#F12DAD1P-S1E*D1ORR1S5RavlTy1JU1N9X2S4O1_x1zG1SnxbycEg_3XpWtBJ14X43*9BF1HP1uoS8I8xixs*G1WjKl_s-6!K100000000020000010000002000001000101002101000000100101000100000001001010000101000\"/><path id=\"bodyweight-lunge-m-m-kneecap.l\" d=\"~~yIv_x(1_J10\"/><path id=\"bodyweight-lunge-m-m-shank.l\" d=\"~#F12(.w1UT!1THy1O.!1Sb_23F1z)1lH7W6W3y3yz2A2!cP8wcy1Aez6Ny2U9D4I2H8G5E(1Ga2E1(bpOaXdKnIfVl*1Vpyb01010110002000020000000000000000010000000000001110000000110100000000010101000000\"/><path id=\"bodyweight-lunge-m-m-foot.l\" d=\"~#o2JUkyS.1OXl.E.1!6HbyiY6yz1D1Ux2y*1.S1V-1Ol-w1)g)g-w1*pA1xhHsPc*x1F2110121001100002000200001011000101201010002101001\"/><path id=\"bodyweight-lunge-m-m-shcap.l\" d=\"~~SBI1JRE1wP10\"/><path id=\"bodyweight-lunge-m-m-upper.l\" d=\"~#F12SBI1JRE1ODI1TKD1e)8a2J2SO1D3.5P1x3W5OD1yaVi0OgxaViX5OD1K1x3B3.5G2SO1b2d)8EgvTdPp1PmYdPp12100002000020002021000012020000100002020000010000000010020000021000001010000000\"/><path id=\"bodyweight-lunge-m-m-elbowcap.l\" d=\"~~JSI1w.P1Dz10\"/><path id=\"bodyweight-lunge-m-m-fore.l\" d=\"~#F12_PI1S*P1-RI1IxP1uIauY1N6DI1(2T9N1K2-1*w1!5BdnEbV7Ec-2*w1X1z2B4z9fSI1h(1K2zazaiz9FkD1Dh_bYi00000100010000200000000000100001000001111012001011010100200000000100000001000100\"/><path id=\"bodyweight-lunge-m-m-fist.l\" d=\"~~JIJ1HT_1ww10\"/><path id=\"bodyweight-lunge-m-m-thigh.r\" d=\"~#F12U-E1WTW1KHD1KSW1.bi5F1_(1D3E7-6R3x3RU1E8RlTezkB2zo_9BV1x3z4H2K8y5w(1Aa4E1Ob)2xfWtJD1DqWz1_3(H1Oh00000200002000000002000001020000110100101020000001000000000200101022000200000202\"/><path id=\"bodyweight-lunge-m-m-kneecap.r\" d=\"~~__S1!PV1_J10\"/><path id=\"bodyweight-lunge-m-m-shank.r\" d=\"~#F12y)S1F_U1I-T1.ST1J7I9w1iIqH-1w9*3H4x2NtG!1wdG8_5KaaOf(z1RY1f-4I1X9*y1SU1z1jD4zb.g!3RnyfVawjdws00000001110000001000000000100010100000000000000000000000000022002101011002000000\"/><path id=\"bodyweight-lunge-m-m-shcap.r\" d=\"^69\"/><path id=\"bodyweight-lunge-m-m-upper.r\" d=\"^70\"/><path id=\"bodyweight-lunge-m-m-elbowcap.r\" d=\"^71\"/><path id=\"bodyweight-lunge-m-m-fore.r\" d=\"^72\"/><path id=\"bodyweight-lunge-m-m-fist.r\" d=\"^73\"/><path id=\"bodyweight-lunge-m-mf-foot.r\" d=\"^54\"/><path id=\"bodyweight-lunge-m-mo-0\" d=\"^49\"/><path id=\"bodyweight-lunge-m-mo-1\" d=\"^50\"/><path id=\"bodyweight-lunge-m-mo-2\" d=\"^41\"/><path id=\"bodyweight-lunge-m-mo-3\" d=\"^42\"/><path id=\"bodyweight-lunge-m-mo-4\" d=\"^43\"/><path id=\"bodyweight-lunge-m-mo-5\" d=\"^29\"/><path id=\"bodyweight-lunge-m-mo-6\" d=\"^44\"/><path id=\"bodyweight-lunge-m-mo-7\" d=\"^45\"/><path id=\"bodyweight-lunge-m-mo-8\" d=\"^46\"/><path id=\"bodyweight-lunge-m-mo-9\" d=\"^47\"/><path id=\"bodyweight-lunge-m-mo-10\" d=\"^48\"/><path id=\"bodyweight-lunge-m-mo-11\" d=\"^51\"/><path id=\"bodyweight-lunge-m-mo-12\" d=\"^52\"/><path id=\"bodyweight-lunge-m-mo-13\" d=\"^53\"/><path id=\"bodyweight-lunge-m-mo-14\" d=\"^54\"/><path id=\"bodyweight-lunge-m-mo-15\" d=\"^44\"/><path id=\"bodyweight-lunge-m-mo-16\" d=\"^45\"/><path id=\"bodyweight-lunge-m-mo-17\" d=\"^46\"/><path id=\"bodyweight-lunge-m-mo-18\" d=\"^47\"/><path id=\"bodyweight-lunge-m-mo-19\" d=\"^48\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#bodyweight-lunge-m-dots)\"/>\n  <path class=\"floorline\" d=\"^55\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-m-st-thigh.l\"/><use href=\"#bodyweight-lunge-m-st-kneecap.l\"/><use href=\"#bodyweight-lunge-m-st-shank.l\"/><use href=\"#bodyweight-lunge-m-st-foot.l\"/><use href=\"#bodyweight-lunge-m-st-shcap.l\"/><use href=\"#bodyweight-lunge-m-st-upper.l\"/><use href=\"#bodyweight-lunge-m-st-elbowcap.l\"/><use href=\"#bodyweight-lunge-m-st-fore.l\"/><use href=\"#bodyweight-lunge-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-m-st-thigh.l\"/><use href=\"#bodyweight-lunge-m-st-kneecap.l\"/><use href=\"#bodyweight-lunge-m-st-shank.l\"/><use href=\"#bodyweight-lunge-m-st-foot.l\"/><use href=\"#bodyweight-lunge-m-st-shcap.l\"/><use href=\"#bodyweight-lunge-m-st-upper.l\"/><use href=\"#bodyweight-lunge-m-st-elbowcap.l\"/><use href=\"#bodyweight-lunge-m-st-fore.l\"/><use href=\"#bodyweight-lunge-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-m-st-head\"/><use href=\"#bodyweight-lunge-m-st-torso\"/><use href=\"#bodyweight-lunge-m-st-thigh.r\"/><use href=\"#bodyweight-lunge-m-st-kneecap.r\"/><use href=\"#bodyweight-lunge-m-st-shank.r\"/><use href=\"#bodyweight-lunge-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-m-st-head\"/><use href=\"#bodyweight-lunge-m-st-torso\"/><use href=\"#bodyweight-lunge-m-st-thigh.r\"/><use href=\"#bodyweight-lunge-m-st-kneecap.r\"/><use href=\"#bodyweight-lunge-m-st-shank.r\"/><use href=\"#bodyweight-lunge-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-m-st-shcap.r\"/><use href=\"#bodyweight-lunge-m-st-upper.r\"/><use href=\"#bodyweight-lunge-m-st-elbowcap.r\"/><use href=\"#bodyweight-lunge-m-st-fore.r\"/><use href=\"#bodyweight-lunge-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-m-st-shcap.r\"/><use href=\"#bodyweight-lunge-m-st-upper.r\"/><use href=\"#bodyweight-lunge-m-st-elbowcap.r\"/><use href=\"#bodyweight-lunge-m-st-fore.r\"/><use href=\"#bodyweight-lunge-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-m-g0-thigh.l\"/><use href=\"#bodyweight-lunge-m-g0-kneecap.l\"/><use href=\"#bodyweight-lunge-m-g0-shank.l\"/><use href=\"#bodyweight-lunge-m-g0-foot.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-m-g0-thigh.l\"/><use href=\"#bodyweight-lunge-m-g0-kneecap.l\"/><use href=\"#bodyweight-lunge-m-g0-shank.l\"/><use href=\"#bodyweight-lunge-m-g0-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-m-g0-head\"/><use href=\"#bodyweight-lunge-m-g0-torso\"/><use href=\"#bodyweight-lunge-m-g0-thigh.r\"/><use href=\"#bodyweight-lunge-m-g0-kneecap.r\"/><use href=\"#bodyweight-lunge-m-g0-shank.r\"/><use href=\"#bodyweight-lunge-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-m-g0-head\"/><use href=\"#bodyweight-lunge-m-g0-torso\"/><use href=\"#bodyweight-lunge-m-g0-thigh.r\"/><use href=\"#bodyweight-lunge-m-g0-kneecap.r\"/><use href=\"#bodyweight-lunge-m-g0-shank.r\"/><use href=\"#bodyweight-lunge-m-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-m-g0-shcap.r\"/><use href=\"#bodyweight-lunge-m-g0-upper.r\"/><use href=\"#bodyweight-lunge-m-g0-elbowcap.r\"/><use href=\"#bodyweight-lunge-m-g0-fore.r\"/><use href=\"#bodyweight-lunge-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-m-g0-shcap.r\"/><use href=\"#bodyweight-lunge-m-g0-upper.r\"/><use href=\"#bodyweight-lunge-m-g0-elbowcap.r\"/><use href=\"#bodyweight-lunge-m-g0-fore.r\"/><use href=\"#bodyweight-lunge-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-m-g1-thigh.l\"/><use href=\"#bodyweight-lunge-m-g1-kneecap.l\"/><use href=\"#bodyweight-lunge-m-g1-shank.l\"/><use href=\"#bodyweight-lunge-m-g1-foot.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-m-g1-thigh.l\"/><use href=\"#bodyweight-lunge-m-g1-kneecap.l\"/><use href=\"#bodyweight-lunge-m-g1-shank.l\"/><use href=\"#bodyweight-lunge-m-g1-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-m-g1-head\"/><use href=\"#bodyweight-lunge-m-g1-torso\"/><use href=\"#bodyweight-lunge-m-g1-thigh.r\"/><use href=\"#bodyweight-lunge-m-g1-kneecap.r\"/><use href=\"#bodyweight-lunge-m-g1-shank.r\"/><use href=\"#bodyweight-lunge-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-m-g1-head\"/><use href=\"#bodyweight-lunge-m-g1-torso\"/><use href=\"#bodyweight-lunge-m-g1-thigh.r\"/><use href=\"#bodyweight-lunge-m-g1-kneecap.r\"/><use href=\"#bodyweight-lunge-m-g1-shank.r\"/><use href=\"#bodyweight-lunge-m-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-m-g1-shcap.r\"/><use href=\"#bodyweight-lunge-m-g1-upper.r\"/><use href=\"#bodyweight-lunge-m-g1-elbowcap.r\"/><use href=\"#bodyweight-lunge-m-g1-fore.r\"/><use href=\"#bodyweight-lunge-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-m-g1-shcap.r\"/><use href=\"#bodyweight-lunge-m-g1-upper.r\"/><use href=\"#bodyweight-lunge-m-g1-elbowcap.r\"/><use href=\"#bodyweight-lunge-m-g1-fore.r\"/><use href=\"#bodyweight-lunge-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-m-e-thigh.l\"/><use href=\"#bodyweight-lunge-m-e-kneecap.l\"/><use href=\"#bodyweight-lunge-m-e-shank.l\"/><use href=\"#bodyweight-lunge-m-e-foot.l\"/><use href=\"#bodyweight-lunge-m-e-shcap.l\"/><use href=\"#bodyweight-lunge-m-e-upper.l\"/><use href=\"#bodyweight-lunge-m-e-elbowcap.l\"/><use href=\"#bodyweight-lunge-m-e-fore.l\"/><use href=\"#bodyweight-lunge-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-m-e-thigh.l\"/><use href=\"#bodyweight-lunge-m-e-kneecap.l\"/><use href=\"#bodyweight-lunge-m-e-shank.l\"/><use href=\"#bodyweight-lunge-m-e-foot.l\"/><use href=\"#bodyweight-lunge-m-e-shcap.l\"/><use href=\"#bodyweight-lunge-m-e-upper.l\"/><use href=\"#bodyweight-lunge-m-e-elbowcap.l\"/><use href=\"#bodyweight-lunge-m-e-fore.l\"/><use href=\"#bodyweight-lunge-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-m-e-head\"/><use href=\"#bodyweight-lunge-m-e-torso\"/><use href=\"#bodyweight-lunge-m-e-thigh.r\"/><use href=\"#bodyweight-lunge-m-e-kneecap.r\"/><use href=\"#bodyweight-lunge-m-e-shank.r\"/><use href=\"#bodyweight-lunge-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-m-e-head\"/><use href=\"#bodyweight-lunge-m-e-torso\"/><use href=\"#bodyweight-lunge-m-e-thigh.r\"/><use href=\"#bodyweight-lunge-m-e-kneecap.r\"/><use href=\"#bodyweight-lunge-m-e-shank.r\"/><use href=\"#bodyweight-lunge-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-m-e-shcap.r\"/><use href=\"#bodyweight-lunge-m-e-upper.r\"/><use href=\"#bodyweight-lunge-m-e-elbowcap.r\"/><use href=\"#bodyweight-lunge-m-e-fore.r\"/><use href=\"#bodyweight-lunge-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-lunge-m-e-shcap.r\"/><use href=\"#bodyweight-lunge-m-e-upper.r\"/><use href=\"#bodyweight-lunge-m-e-elbowcap.r\"/><use href=\"#bodyweight-lunge-m-e-fore.r\"/><use href=\"#bodyweight-lunge-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"210.75\" cy=\"202.46\" r=\"2.25\"/><circle class=\"joint\" cx=\"210.75\" cy=\"250.08\" r=\"2.25\"/><circle class=\"joint\" cx=\"187.11\" cy=\"267.42\" r=\"2.25\"/><circle class=\"joint\" cx=\"249.83\" cy=\"267.44\" r=\"2.25\"/></g><mask id=\"bodyweight-lunge-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#bodyweight-lunge-m-m-head\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-torso\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-thigh.l\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-shank.l\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-foot.l\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-shcap.l\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-upper.l\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-fore.l\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-fist.l\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-thigh.r\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-shank.r\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-mf-foot.r\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-shcap.r\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-upper.r\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-fore.r\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-m-fist.r\" fill=\"#000\"/><use href=\"#bodyweight-lunge-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-lunge-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#bodyweight-lunge-m-mmask)\"><g class=\"u-stroke\"><use href=\"#bodyweight-lunge-m-m-head\"/><use href=\"#bodyweight-lunge-m-m-torso\"/><use href=\"#bodyweight-lunge-m-m-thigh.l\"/><use href=\"#bodyweight-lunge-m-m-kneecap.l\"/><use href=\"#bodyweight-lunge-m-m-shank.l\"/><use href=\"#bodyweight-lunge-m-m-foot.l\"/><use href=\"#bodyweight-lunge-m-m-shcap.l\"/><use href=\"#bodyweight-lunge-m-m-upper.l\"/><use href=\"#bodyweight-lunge-m-m-elbowcap.l\"/><use href=\"#bodyweight-lunge-m-m-fore.l\"/><use href=\"#bodyweight-lunge-m-m-fist.l\"/><use href=\"#bodyweight-lunge-m-m-thigh.r\"/><use href=\"#bodyweight-lunge-m-m-kneecap.r\"/><use href=\"#bodyweight-lunge-m-m-shank.r\"/><use href=\"#bodyweight-lunge-m-m-shcap.r\"/><use href=\"#bodyweight-lunge-m-m-upper.r\"/><use href=\"#bodyweight-lunge-m-m-elbowcap.r\"/><use href=\"#bodyweight-lunge-m-m-fore.r\"/><use href=\"#bodyweight-lunge-m-m-fist.r\"/></g></g><g class=\"mistake-layer\"><path class=\"leader m\" d=\"~MSEU1!PV1L0.X2\"/><path class=\"leader m\" d=\"M252.09 301.54L267 312H277\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"bodyweight-lunge-m-knee\" data-key=\"knee\" data-cue=\"The hips and front knee drive forward, and the shin tips far over the foot.\" class=\"plate-callout two m\" style=\"left:73.74%;top:61.45%\" aria-pressed=\"true\">Knee drives<br>forward</button><button type=\"button\" id=\"bodyweight-lunge-m-shin\" data-key=\"shin\" data-cue=\"The front shin tips far forward over the foot.\" class=\"plate-callout two m\" style=\"left:75.98%;top:81.01%\" aria-pressed=\"false\">Shin tips<br>forward</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "hips",
        cues: [{ key: "hips", cue: "Drop the hips toward the floor rather than driving them forward." }, { key: "thigh", cue: "Lower until the front thigh is about parallel, or to a comfortable depth." }, { key: "back", cue: "Bend forward at the hips with a flat back." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "knee",
        cues: [{ key: "knee", cue: "The hips and front knee drive forward, and the shin tips far over the foot." }, { key: "shin", cue: "The front shin tips far forward over the foot." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Knee drives forward</b><span>The hips and front knee drive forward, and the shin tips far over the foot.</span></li><li><b>Shin tips forward</b><span>The front shin tips far forward over the foot.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: step slow, lower, rise\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Step</b><span>Slow</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>&nbsp;</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Rise</b><span>&nbsp;</span></div></div></div>",
      alt: "Bodyweight lunge, side view. From standing with the feet together, one leg steps forward and lands heel first, and the body lowers until the front thigh is about parallel, front shin leaning slightly forward, trunk bent forward at the hips with a flat back.",
      mistakeAlt: "Bodyweight Lunge: the common mistake, drawn dashed in the mistake colour over the correct end position.",
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
      "kind": "brace",
      "text": "Stand with feet together, shoulders down and back, trunk braced.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bw"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Balance on one foot, step forward, land heel first.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bw"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "position",
      "text": "Move the weight over slowly, upper body level.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bw"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "position",
      "text": "Drop the hips until the front thigh is about parallel.",
      "zoom": "front-shin",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bw"
        ],
        "note": "c4, c3"
      }
    },
    {
      "kind": "finish",
      "text": "Push off firmly with the front leg to stand back up.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bw"
        ],
        "note": "c6"
      }
    }
  ],
  posture: [
    {
      "key": "hips",
      "label": "Hips drop down",
      "detail": "Hips lower down, not forward. Land heel first and drop the hips straight down.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "zoom": "front-shin",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bw"
        ],
        "note": "c3, c2"
      }
    },
    {
      "key": "shin",
      "label": "Front shin",
      "detail": "Front shin leans only slightly forward.",
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
          "ace-fwdlunge-bw"
        ],
        "note": "c4"
      }
    },
    {
      "key": "back",
      "label": "Flat back",
      "detail": "Flat back, bent forward at the hips.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "zoom": "back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bw"
        ],
        "note": "c5"
      }
    },
    {
      "key": "tilt",
      "label": "No sideways tilt",
      "detail": "No sideways tilt of the upper body. Keep it level, without tilting or swaying.",
      "anchor": {
        "pose": "end",
        "at": "sternum"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bw"
        ],
        "note": "c2"
      }
    },
    {
      "key": "wobble",
      "label": "One-leg wobble",
      "detail": "Practise standing on one leg first.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bw"
        ],
        "note": "c7, c2"
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
      "key": "back",
      "chip": "Back",
      "heading": "Flat back",
      "kind": "posture"
    }
  ],
  chips: [
    "front-shin",
    "back",
    "feel"
  ],
  copy: {
    "setupLine": "Feet together, trunk braced. Step forward, land heel first, and move the weight over slowly.",
    "mistakeLine": "Never drive the hips forward: drop them straight down. Keep the upper body from swaying sideways.",
    "cueLine": "Hips down, back flat."
  },
  mistakes: [],
  risks: [
    {
      "key": "balance",
      "text": "Losing balance on the step. Learn single-leg standing first.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bw"
        ],
        "note": "c7, c2"
      }
    },
    {
      "key": "shin",
      "text": "Uncontrolled forward shin travel when the hips drive forward.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bw"
        ],
        "note": "c3"
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
    "ace-fwdlunge-bw",
    "cat-lunge",
    "nhs-knee",
    "nhs-knee-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/bodyweight_lunge.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

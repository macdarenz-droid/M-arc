// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=2961606358f741fcb852dece78df1bfe12bbcadf30004a7bf90d7099d608acd7
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_hanging_knee_raise",
  name: "Hanging Knee Raise",
  hashes: { inputsSha256: "2961606358f741fcb852dece78df1bfe12bbcadf30004a7bf90d7099d608acd7", golden: "f83c9456f39e6c3091c923e71ded04763c558f93a8452b10442599e3cbda82c3" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"hanging-knee-raise-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"hanging-knee-raise-n-st-thigh.l\" d=\"~#F12F-rJJE1*Vr-yD1R1Iaz10y3PX1F5)6N2K3H2)N1_aGk2.h.aGkG2)N1K2K3E5)6x3PX1A10S1IaRrOaKjDA12YvJjDA101000010001010001100002000001020000000001000002100000000001010010000000020000000\"/><path id=\"hanging-knee-raise-n-st-kneecap.l\" d=\"~~SVs(DS1UE10\"/><path id=\"hanging-knee-raise-n-st-shank.l\" d=\"~#F12AUs(DS1KXsB*P1S1KaD10F4WX1F5*6N2O3E3B.1J6zc2OaK6zcF3B.1K2O3E5*6E4WX1B10R1KaIbHaVb!l2AjUb!l00101020001000001002000000110000000001000000022000002000100000000002000000001200\"/><path id=\"hanging-knee-raise-n-st-foot.l\" d=\"~#o2FTtw!.1GKu*F.1y9H7yh8PtX9yG2(u-.1Ow1-r-kBj*8zz1VbB4KeFrY1OrDc110100000200000000001210000200020000000100000000\"/><path id=\"hanging-knee-raise-n-st-shcap.l\" d=\"~~WSsJNrNH10\"/><path id=\"hanging-knee-raise-n-st-upper.l\" d=\"~#F12PEv(IrKFvKIs0_792K4-G1R2H5x1Y2B3Fy1.7whqSe_9wgy7Ux1N1S2y3y57xH161u!7He6_aGnB1-jId-l00000110000000011002000012000010100001000001011000000000100000101011111100002020\"/><path id=\"hanging-knee-raise-n-st-elbowcap.l\" d=\"~~!NswFjAv0\"/><path id=\"hanging-knee-raise-n-st-fore.l\" d=\"~#F12PNuYGjOHuGyk)1(8jV1tOD1T3y8O1w2)1ytT6wbj(9P5SbB1DtF1y2Y2P8A5BD1qV1w1F9(8iDaXgsEfI8Xh00000100002000000000000101200210000121000001012200000101000002011100000020000202\"/><path id=\"hanging-knee-raise-n-st-head\" d=\"~#w12A*tNTi-Os*Hixh(g.gS8)9.2X2D4G4)6x7*9OfXjD4IbK1K8*g1_j.9_jT5JiY2whDeO1wh0001002000000101001200000020021010000000010000000001000000021020\"/><path id=\"hanging-knee-raise-n-st-torso\" d=\"~#_12WSs_-mz.sXPlR8V5-20P8PfP8Y5HbAeU51T5zl-jz7IbF4FeE4HiV5_jzeUfRfD4K8x7Bexozv.9xoV50K82Fbye!2A7Gbx7Bew7T5NiW5W5Fb*9!2y7TG2Hs00000000010000020000011100020011101001002101100002200000020000000020000000020001012000000000000020001200100000001020\"/><path id=\"hanging-knee-raise-n-st-thigh.r\" d=\"^0\"/><path id=\"hanging-knee-raise-n-st-kneecap.r\" d=\"^1\"/><path id=\"hanging-knee-raise-n-st-shank.r\" d=\"^2\"/><path id=\"hanging-knee-raise-n-st-foot.r\" d=\"^3\"/><path id=\"hanging-knee-raise-n-st-shcap.r\" d=\"^4\"/><path id=\"hanging-knee-raise-n-st-upper.r\" d=\"^5\"/><path id=\"hanging-knee-raise-n-st-elbowcap.r\" d=\"^6\"/><path id=\"hanging-knee-raise-n-st-fore.r\" d=\"^7\"/><path id=\"hanging-knee-raise-n-g0-head\" d=\"~#w12FFsDRi)_qGFiBh_gxhJ8.9*2-2F4E4z7*6)9Kf.jJ4IbG1K8)g3!jX9!jO5Jiw3_gHeR1(g0010101002000000000011000000002100200200020000200000001010010020\"/><path id=\"hanging-knee-raise-n-g0-torso\" d=\"~#_12W!qDXmRBrENlB8G4K17(8(eY8H5YbYdF54B5)kxi*5)ay5WdR5YhI7Ji)fwe)gJ3.8I8Gd*qXszc)mK5U3)3F3NbU7y3(6RbT6.dS7)4Siw6w7PcRaU2S5-G2Ur10000000010000002100000200010000120000000000000001001110000000110001200210100000000000020000200000000001010020101100\"/><path id=\"hanging-knee-raise-n-g0-thigh.r\" d=\"~#F12SzryEF1TIq*AE1T6z8ti_uFN1uV8eB4*lVG1t)mz9IfTjxc-pEE1.3-1x8G3SpJR1sh.3X9xtw5U1(F1DgNrwz1Fl10000200000010100020001111101002100121020000000101000200100000000000000000000011\"/><path id=\"hanging-knee-raise-n-g0-kneecap.r\" d=\"~~JDx1FOP1UE10\"/><path id=\"hanging-knee-raise-n-g0-shank.r\" d=\"~#F12ABx1ATP1KAx1BGO1kTay11U9wX1U4K7y2V3)8V_1H5Ocx1TaO7IbK2E.1X2B3*5K6y1_X1x14T2EaGaJbR9_m!1AjYdUk00010000000000000001010110000200010020021000020001000001000100111001010002200202\"/><path id=\"hanging-knee-raise-n-g0-foot.r\" d=\"~#o2Wxz1_z_1--z1IN-1Y9P6whO1NsKcUI2_nR(1XqVt*h)jx7xA1G8T5)dJrpEqYe010220200020000020010000020001010101000101000020\"/><path id=\"hanging-knee-raise-n-g1-head\" d=\"~#w12Y)qPKiTSpBAiGhUgxhD8.9*2*2A4x4z7*6)9BfzkJ4BbB1R8)g7wkR9!jI5HiF3YgJeV1(g1010100000000001100000001001000000000000000101100110000001010112\"/><path id=\"hanging-knee-raise-n-g1-torso\" d=\"~#_12(SpATmz!pEHl*7x31dN9Fe!8w5HcHd_48X4XkEgE5Oa(5wd-6whz9WgThJcEiP2z9T9RcOt)pIeVlX4D7u_5YaD1F3!6XbE6Vdy8G4YiN6F8WdBbF2y4)G2(q02000010000000002121011210000020010120001200000002022000000001200000100002000121010000020010100000010000021000000000\"/><path id=\"hanging-knee-raise-n-g1-thigh.r\" d=\"~#F12YGrHVF1XzqxAF1.9T3huwS1FoO3)7-1-3xF1XoOcKjRfR8znbzH1-kE4eT8F1wO1UtivI8O6KmAjDmPy1_rJfwG1i00000010100002000101001010110000000001012000101100001010110110020022000021200000\"/><path id=\"hanging-knee-raise-n-g1-kneecap.r\" d=\"~~DSA1(xJ1UE10\"/><path id=\"hanging-knee-raise-n-g1-shank.r\" d=\"~#F12SRA1YGJ1.JA1zwI1bOaw19(e(V1_3*7Y1-3ReO-1w4zd*1GaV8Tax8X_1)2)2R6-5N6PX1z18R3)9z9HcG7WnU3_iWfDj00020001100022000100000000000100220000000020011000020000021100210100000000101012\"/><path id=\"hanging-knee-raise-n-g1-foot.r\" d=\"~#o2yIE1DTV1xxF1O.U1JaP5_gz3yrxfSK2Jg.w2RkBvxfTkz5XA1-4-6GdyrO3ToDh000020000000100100010000001000100000000000200012\"/><path id=\"hanging-knee-raise-n-g2-head\" d=\"~#w12WDq_HiT-ozxiKhPgEhy8X9z3*2D4z4z7X6BaxfzkS4EbE1O8*gdykI9wkB5FiJ3SgSe-1!g2200001000002000120012210010120010100000000020010000120000012000\"/><path id=\"hanging-knee-raise-n-g2-torso\" d=\"~#_12YYoyPmGypEElR7-1H1l!9Pdy9Y4Wc!cP4cB4VkOeT4xaW6Jcx8wgVa(eBjSaGjU1I9-aOb.vxnGgEkT3Uay6_7F9x5P3Y6)b.5EdS8-3_i(6W9Ye*by2P2GH2Jq00000000000100000010100022000012000000000001111000000000100000002120002200100000000000002020001010000200000000000000\"/><path id=\"hanging-knee-raise-n-g2-thigh.r\" d=\"~#F12!EsUSF1I(qxXF1Ia(10y1NX1O4z7z5O3G2xO1x1RkGa.hexkNb.N1N3K3S2-6P5SX1S10z1OaE1V9YrUA1Pi_vpSz1Ik00001001012000001100001011000000101010010100101010000120000210010002000200011000\"/><path id=\"hanging-knee-raise-n-g2-kneecap.r\" d=\"~~(YB1WBD1UE10\"/><path id=\"hanging-knee-raise-n-g2-shank.r\" d=\"~#F12F-B1HRD1TPB1GFB1I1Oay19(jDU1y3z8J1z4)jXX1Y2Kd)2BaR9T9Vd--1I3R2*6E5UbUW1x1cO4T9.7Ddx5DoN5NiNhUh00002000000002020020000002000100202000011010002100100012100000200001001000100010\"/><path id=\"hanging-knee-raise-n-g2-foot.r\" d=\"~#o2_NG1_PO1IyH1zXN1YaN4NgV4SpRhYN2_8Ry2BeOw1)b)kB3)A1B1z8VcWq)5)mNj010000000022000101101000200000000000000000000001\"/><path id=\"hanging-knee-raise-n-e-thigh.l\" d=\"~#F12JXty)E1.Vs*XF1)7!6kuNK1*vX8rB45)F1wnxnP1BfN9IbykVD1_qV1(3x3y8UP1XqftX9D4_5!s!F1V2wr-gJkTz100100020000200010020000020101110002000000010100101100020001000000010000020200110\"/><path id=\"hanging-knee-raise-n-e-kneecap.l\" d=\"~~WRA1_Kw1UE10\"/><path id=\"hanging-knee-raise-n-e-shank.l\" d=\"~#F12FTA1D*w1VDA1EVvK2Eay1d_oyS1H2K8uB4EpTV1N1Td*3-9OaV8zjBY1O3I2R7I4!gDV1vcK5)8T6YdT2WoA7_hyj_f00100000000000000100010000111000000020012121001012010101001012002020000010010100\"/><path id=\"hanging-knee-raise-n-e-foot.l\" d=\"~#o2!zG1yPG1*UG1TUF1DbN3(fG6Wn*jHO2H1Vz2-7Kx1.8Elx1*A1H2G9-bwqR8)kSl100101002100000000101021000200000010000001100000\"/><path id=\"hanging-knee-raise-n-e-shcap.l\" d=\"~~J-oSwrNH10\"/><path id=\"hanging-knee-raise-n-e-upper.l\" d=\"~#F12UKrYErKErVDsX1W790A5-G1V3W4V1J2-aSw1Rb!eK2Je(5_hnHy1q_2!1W5D9zG1a2t!7!dJ3!fEkH3Ojz8Io00100002100001111101000111000200000000000000000020000000200210100000211210001100\"/><path id=\"hanging-knee-raise-n-e-elbowcap.l\" d=\"~~FRqS*iAv0\"/><path id=\"hanging-knee-raise-n-e-fore.l\" d=\"~#F12UOsSDjBDsT*j)3H85-1W7XB1G5y7*1U1O8(r.8A9-2S9W2PcV7DsqH2o!8SdxA1A1K1x1D9S8U2YdzeD4Rez4Ej02001011111010001010120000002100000001000001210022101000000000001011001000100000\"/><path id=\"hanging-knee-raise-n-e-fist.l\" d=\"~~YwtUTaHs1\"/><path id=\"hanging-knee-raise-n-e-head\" d=\"~#w12JwqNIiKToIxiRhJgEh!7X9z3x3A4*3E7X6za-eIkS4zbx1O8)gjAkE9yk.4FiN3NgWe)1(g0000000020220000000021000101000012000000010100020000111100010000\"/><path id=\"hanging-knee-raise-n-e-torso\" d=\"~#_12FRoFPmz.oOElE7hW2vHa_cD9N4DdJcD4k-3XkRcI4R9N7SbB9!eBcydOkU8GkoK9-bKa)x1.jBiRiz2!dUbD9!6zbY3S6BcI5)c(8x3wjH7wb(fXcW1y1RH2Wp00000102000000000000200200000020000000000001110000010100020002000202000002022000010101101000001010020000002000000020\"/><path id=\"hanging-knee-raise-n-e-thigh.r\" d=\"^28\"/><path id=\"hanging-knee-raise-n-e-kneecap.r\" d=\"^29\"/><path id=\"hanging-knee-raise-n-e-shank.r\" d=\"^30\"/><path id=\"hanging-knee-raise-n-e-foot.r\" d=\"^31\"/><path id=\"hanging-knee-raise-n-e-shcap.r\" d=\"^32\"/><path id=\"hanging-knee-raise-n-e-upper.r\" d=\"^33\"/><path id=\"hanging-knee-raise-n-e-elbowcap.r\" d=\"^34\"/><path id=\"hanging-knee-raise-n-e-fore.r\" d=\"^35\"/><path id=\"hanging-knee-raise-n-e-fist.r\" d=\"^36\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#hanging-knee-raise-n-dots)\"/>\n  <path class=\"datum\" d=\"~MJTsNBD1L(B90\"/><path class=\"floorline\" d=\"M56.13 345.85H301.87\"/><path class=\"eq\" d=\"~MFKuAEaL0zR5Q0OcOcUA5LA5PcQOc0z5PcLPcUA5Q0PcPcTA5Lz5OcQPc0A5OcZ\"/><path class=\"eq-solid\" d=\"~~APtUTa(c0\"/><path class=\"eq-pin\" d=\"~~H-tUTaY30\"/><path class=\"eq-line\" d=\"~MJ.oPG4LJza0\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-n-st-thigh.l\"/><use href=\"#hanging-knee-raise-n-st-kneecap.l\"/><use href=\"#hanging-knee-raise-n-st-shank.l\"/><use href=\"#hanging-knee-raise-n-st-foot.l\"/><use href=\"#hanging-knee-raise-n-st-shcap.l\"/><use href=\"#hanging-knee-raise-n-st-upper.l\"/><use href=\"#hanging-knee-raise-n-st-elbowcap.l\"/><use href=\"#hanging-knee-raise-n-st-fore.l\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-n-st-thigh.l\"/><use href=\"#hanging-knee-raise-n-st-kneecap.l\"/><use href=\"#hanging-knee-raise-n-st-shank.l\"/><use href=\"#hanging-knee-raise-n-st-foot.l\"/><use href=\"#hanging-knee-raise-n-st-shcap.l\"/><use href=\"#hanging-knee-raise-n-st-upper.l\"/><use href=\"#hanging-knee-raise-n-st-elbowcap.l\"/><use href=\"#hanging-knee-raise-n-st-fore.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-n-st-head\"/><use href=\"#hanging-knee-raise-n-st-torso\"/><use href=\"#hanging-knee-raise-n-st-thigh.r\"/><use href=\"#hanging-knee-raise-n-st-kneecap.r\"/><use href=\"#hanging-knee-raise-n-st-shank.r\"/><use href=\"#hanging-knee-raise-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-n-st-head\"/><use href=\"#hanging-knee-raise-n-st-torso\"/><use href=\"#hanging-knee-raise-n-st-thigh.r\"/><use href=\"#hanging-knee-raise-n-st-kneecap.r\"/><use href=\"#hanging-knee-raise-n-st-shank.r\"/><use href=\"#hanging-knee-raise-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-n-st-shcap.r\"/><use href=\"#hanging-knee-raise-n-st-upper.r\"/><use href=\"#hanging-knee-raise-n-st-elbowcap.r\"/><use href=\"#hanging-knee-raise-n-st-fore.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-n-st-shcap.r\"/><use href=\"#hanging-knee-raise-n-st-upper.r\"/><use href=\"#hanging-knee-raise-n-st-elbowcap.r\"/><use href=\"#hanging-knee-raise-n-st-fore.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-n-g0-head\"/><use href=\"#hanging-knee-raise-n-g0-torso\"/><use href=\"#hanging-knee-raise-n-g0-thigh.r\"/><use href=\"#hanging-knee-raise-n-g0-kneecap.r\"/><use href=\"#hanging-knee-raise-n-g0-shank.r\"/><use href=\"#hanging-knee-raise-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-n-g0-head\"/><use href=\"#hanging-knee-raise-n-g0-torso\"/><use href=\"#hanging-knee-raise-n-g0-thigh.r\"/><use href=\"#hanging-knee-raise-n-g0-kneecap.r\"/><use href=\"#hanging-knee-raise-n-g0-shank.r\"/><use href=\"#hanging-knee-raise-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-n-g1-head\"/><use href=\"#hanging-knee-raise-n-g1-torso\"/><use href=\"#hanging-knee-raise-n-g1-thigh.r\"/><use href=\"#hanging-knee-raise-n-g1-kneecap.r\"/><use href=\"#hanging-knee-raise-n-g1-shank.r\"/><use href=\"#hanging-knee-raise-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-n-g1-head\"/><use href=\"#hanging-knee-raise-n-g1-torso\"/><use href=\"#hanging-knee-raise-n-g1-thigh.r\"/><use href=\"#hanging-knee-raise-n-g1-kneecap.r\"/><use href=\"#hanging-knee-raise-n-g1-shank.r\"/><use href=\"#hanging-knee-raise-n-g1-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-n-g2-head\"/><use href=\"#hanging-knee-raise-n-g2-torso\"/><use href=\"#hanging-knee-raise-n-g2-thigh.r\"/><use href=\"#hanging-knee-raise-n-g2-kneecap.r\"/><use href=\"#hanging-knee-raise-n-g2-shank.r\"/><use href=\"#hanging-knee-raise-n-g2-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-n-g2-head\"/><use href=\"#hanging-knee-raise-n-g2-torso\"/><use href=\"#hanging-knee-raise-n-g2-thigh.r\"/><use href=\"#hanging-knee-raise-n-g2-kneecap.r\"/><use href=\"#hanging-knee-raise-n-g2-shank.r\"/><use href=\"#hanging-knee-raise-n-g2-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-n-e-thigh.l\"/><use href=\"#hanging-knee-raise-n-e-kneecap.l\"/><use href=\"#hanging-knee-raise-n-e-shank.l\"/><use href=\"#hanging-knee-raise-n-e-foot.l\"/><use href=\"#hanging-knee-raise-n-e-shcap.l\"/><use href=\"#hanging-knee-raise-n-e-upper.l\"/><use href=\"#hanging-knee-raise-n-e-elbowcap.l\"/><use href=\"#hanging-knee-raise-n-e-fore.l\"/><use href=\"#hanging-knee-raise-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-n-e-thigh.l\"/><use href=\"#hanging-knee-raise-n-e-kneecap.l\"/><use href=\"#hanging-knee-raise-n-e-shank.l\"/><use href=\"#hanging-knee-raise-n-e-foot.l\"/><use href=\"#hanging-knee-raise-n-e-shcap.l\"/><use href=\"#hanging-knee-raise-n-e-upper.l\"/><use href=\"#hanging-knee-raise-n-e-elbowcap.l\"/><use href=\"#hanging-knee-raise-n-e-fore.l\"/><use href=\"#hanging-knee-raise-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-n-e-head\"/><use href=\"#hanging-knee-raise-n-e-torso\"/><use href=\"#hanging-knee-raise-n-e-thigh.r\"/><use href=\"#hanging-knee-raise-n-e-kneecap.r\"/><use href=\"#hanging-knee-raise-n-e-shank.r\"/><use href=\"#hanging-knee-raise-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-n-e-head\"/><use href=\"#hanging-knee-raise-n-e-torso\"/><use href=\"#hanging-knee-raise-n-e-thigh.r\"/><use href=\"#hanging-knee-raise-n-e-kneecap.r\"/><use href=\"#hanging-knee-raise-n-e-shank.r\"/><use href=\"#hanging-knee-raise-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-n-e-shcap.r\"/><use href=\"#hanging-knee-raise-n-e-upper.r\"/><use href=\"#hanging-knee-raise-n-e-elbowcap.r\"/><use href=\"#hanging-knee-raise-n-e-fore.r\"/><use href=\"#hanging-knee-raise-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-n-e-shcap.r\"/><use href=\"#hanging-knee-raise-n-e-upper.r\"/><use href=\"#hanging-knee-raise-n-e-elbowcap.r\"/><use href=\"#hanging-knee-raise-n-e-fore.r\"/><use href=\"#hanging-knee-raise-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MwHuUTaLdI3Lr8LleLlkLdqL7qL2sL6qLeqLkkLoeLs8Ls1Ls5LodLkjLepL6pL2rL7pLdpLljLldLr5\"/><circle class=\"joint\" cx=\"133.73\" cy=\"138.33\" r=\"2.25\"/><circle class=\"joint\" cx=\"140.86\" cy=\"96.89\" r=\"2.25\"/><circle class=\"joint\" cx=\"146.46\" cy=\"195.43\" r=\"2.25\"/><circle class=\"joint\" cx=\"193.49\" cy=\"166.05\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#J20N!vD.R1zPvO)R13n7h7l7j9j9h9jbhdhbhw1pfhddhdfff9jdhbj9h9j7l7j7j3l7j1P14j3n0j0l0l0l4l4j4l4l800002010000000000101000000200100000001000010000111000010102000220000010001000000000200000200200200000000021000010000000020000001001012000000000110100200\"/><path class=\"arrow\" d=\"~MHJD1HSx1L!qDw1LI)1RnZ\"/><path data-guide=\"curl\" style=\"display:none\" class=\"lead-guide\" d=\"~M(-mJPF1LJfNuLw5z3LH4-3LW3R4LY2x5L(1O5LuX5L1X5Lx1-5LR.1FK1LJV1TF2LKD2Wp\"/></g><path class=\"leader\" d=\"M153.14 257.11L143.28 262H133.28\"/><circle class=\"anchor\" cx=\"153.14\" cy=\"257.11\" r=\"1.5\"/><path class=\"leader\" d=\"~MH-B1_Kw1L0-X2\"/><circle class=\"anchor\" cx=\"193.49\" cy=\"166.05\" r=\"1.5\"/><path class=\"leader\" d=\"M129.62 188.81L86.33 192H76.33\"/><circle class=\"anchor\" cx=\"129.62\" cy=\"188.81\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"hanging-knee-raise-n-still\" data-key=\"still\" data-cue=\"Start every rep from a still hang, with no swing.\" class=\"plate-callout\" style=\"left:13.97%;top:67.04%\" aria-pressed=\"true\">Still start</button><button type=\"button\" id=\"hanging-knee-raise-n-knees\" data-key=\"knees\" data-cue=\"Lift the knees past hip height and hold a moment.\" class=\"plate-callout two\" style=\"left:47.49%;top:31.28%\" aria-pressed=\"false\">Knees<br>above hips</button><button type=\"button\" id=\"hanging-knee-raise-n-curl\" data-key=\"curl\" data-cue=\"At the top, roll the hips up toward the ribs, low back rounding a little.\" class=\"plate-callout two\" style=\"left:2.79%;top:47.49%\" aria-pressed=\"false\">Pelvis<br>curls up</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"hanging-knee-raise-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"hanging-knee-raise-m-st-thigh.l\" d=\"^0\"/><path id=\"hanging-knee-raise-m-st-kneecap.l\" d=\"^1\"/><path id=\"hanging-knee-raise-m-st-shank.l\" d=\"^2\"/><path id=\"hanging-knee-raise-m-st-foot.l\" d=\"^3\"/><path id=\"hanging-knee-raise-m-st-shcap.l\" d=\"^4\"/><path id=\"hanging-knee-raise-m-st-upper.l\" d=\"^5\"/><path id=\"hanging-knee-raise-m-st-elbowcap.l\" d=\"^6\"/><path id=\"hanging-knee-raise-m-st-fore.l\" d=\"^7\"/><path id=\"hanging-knee-raise-m-st-head\" d=\"^8\"/><path id=\"hanging-knee-raise-m-st-torso\" d=\"^9\"/><path id=\"hanging-knee-raise-m-st-thigh.r\" d=\"^0\"/><path id=\"hanging-knee-raise-m-st-kneecap.r\" d=\"^1\"/><path id=\"hanging-knee-raise-m-st-shank.r\" d=\"^2\"/><path id=\"hanging-knee-raise-m-st-foot.r\" d=\"^3\"/><path id=\"hanging-knee-raise-m-st-shcap.r\" d=\"^4\"/><path id=\"hanging-knee-raise-m-st-upper.r\" d=\"^5\"/><path id=\"hanging-knee-raise-m-st-elbowcap.r\" d=\"^6\"/><path id=\"hanging-knee-raise-m-st-fore.r\" d=\"^7\"/><path id=\"hanging-knee-raise-m-g0-head\" d=\"^10\"/><path id=\"hanging-knee-raise-m-g0-torso\" d=\"^11\"/><path id=\"hanging-knee-raise-m-g0-thigh.r\" d=\"^12\"/><path id=\"hanging-knee-raise-m-g0-kneecap.r\" d=\"^13\"/><path id=\"hanging-knee-raise-m-g0-shank.r\" d=\"^14\"/><path id=\"hanging-knee-raise-m-g0-foot.r\" d=\"^15\"/><path id=\"hanging-knee-raise-m-g1-head\" d=\"^16\"/><path id=\"hanging-knee-raise-m-g1-torso\" d=\"^17\"/><path id=\"hanging-knee-raise-m-g1-thigh.r\" d=\"^18\"/><path id=\"hanging-knee-raise-m-g1-kneecap.r\" d=\"^19\"/><path id=\"hanging-knee-raise-m-g1-shank.r\" d=\"^20\"/><path id=\"hanging-knee-raise-m-g1-foot.r\" d=\"^21\"/><path id=\"hanging-knee-raise-m-g2-head\" d=\"^22\"/><path id=\"hanging-knee-raise-m-g2-torso\" d=\"^23\"/><path id=\"hanging-knee-raise-m-g2-thigh.r\" d=\"^24\"/><path id=\"hanging-knee-raise-m-g2-kneecap.r\" d=\"^25\"/><path id=\"hanging-knee-raise-m-g2-shank.r\" d=\"^26\"/><path id=\"hanging-knee-raise-m-g2-foot.r\" d=\"^27\"/><path id=\"hanging-knee-raise-m-e-thigh.l\" d=\"^28\"/><path id=\"hanging-knee-raise-m-e-kneecap.l\" d=\"^29\"/><path id=\"hanging-knee-raise-m-e-shank.l\" d=\"^30\"/><path id=\"hanging-knee-raise-m-e-foot.l\" d=\"^31\"/><path id=\"hanging-knee-raise-m-e-shcap.l\" d=\"^32\"/><path id=\"hanging-knee-raise-m-e-upper.l\" d=\"^33\"/><path id=\"hanging-knee-raise-m-e-elbowcap.l\" d=\"^34\"/><path id=\"hanging-knee-raise-m-e-fore.l\" d=\"^35\"/><path id=\"hanging-knee-raise-m-e-fist.l\" d=\"^36\"/><path id=\"hanging-knee-raise-m-e-head\" d=\"^37\"/><path id=\"hanging-knee-raise-m-e-torso\" d=\"^38\"/><path id=\"hanging-knee-raise-m-e-thigh.r\" d=\"^28\"/><path id=\"hanging-knee-raise-m-e-kneecap.r\" d=\"^29\"/><path id=\"hanging-knee-raise-m-e-shank.r\" d=\"^30\"/><path id=\"hanging-knee-raise-m-e-foot.r\" d=\"^31\"/><path id=\"hanging-knee-raise-m-e-shcap.r\" d=\"^32\"/><path id=\"hanging-knee-raise-m-e-upper.r\" d=\"^33\"/><path id=\"hanging-knee-raise-m-e-elbowcap.r\" d=\"^34\"/><path id=\"hanging-knee-raise-m-e-fore.r\" d=\"^35\"/><path id=\"hanging-knee-raise-m-e-fist.r\" d=\"^36\"/><path id=\"hanging-knee-raise-m-m-head\" d=\"~#w12DPiDFgKyhGKgEbDlXdydEa8R1!4x6R5V9I7TkIemxc-3X7Bgw5wgEfFhEbPiT2HkP8U3Yg0101000120000202100000000220001010000020001000000100200110020000\"/><path id=\"hanging-knee-raise-m-m-torso\" d=\"~#_12!NiyVk)HiGIj-aR5I5!1_bAeP9Y3yePb_6z2)d-jTrX3.a(4AeE4NiV5YjzeSfOfH4R8z7zexozv.9xo-6IaxoT7AgDw1F4J6OcR4Kc_9V1FjW5J1A6Xa_5_8x(1SP100000000100200200000001000012100000000000100000012000220001000100000001000200001110002000010100200000100000101010002\"/><path id=\"hanging-knee-raise-m-m-thigh.l\" d=\"~#F12_OnP!D1OImxRE1X8_5ew1(P1BqK8.1E4nOI1_h)mE1EgP7XdPiVG1(lz2U3)3W7PT1Tkdvxa(2D2Nt!F1F2!sKdPo-w100000010000000000000000100022001002000001000012001000000000000001010010020000000\"/><path id=\"hanging-knee-raise-m-m-kneecap.l\" d=\"~~UBvPJw1UE10\"/><path id=\"hanging-knee-raise-m-m-shank.l\" d=\"~#F12WVvANx1IVuKTw1T7G7ktyP1NsV2G8K1)3IS1BvB6EcV8z6RdR1TN1VA1E40V8aAI1Pz1lsK9V4w2FfAbAmYf(aSow320000100010000000000200002010011100000000000000000000210100000200200000120000200\"/><path id=\"hanging-knee-raise-m-m-foot.l\" d=\"~#o2WAF1!BD1)zF1RBB1DbE3(9.dy9XtAz2)G1*!1Fu*w1!aGiSa-tymBe-4yhGl-5Pt000001000000010012100000000001001002000000002020\"/><path id=\"hanging-knee-raise-m-m-shcap.l\" d=\"~~PSj__oNH10\"/><path id=\"hanging-knee-raise-m-m-upper.l\" d=\"~#F12wymPOp*RlVHqz4Y693Ui-B1)4H3I2U1)kDr-fAax7Yc9_izcAw11(25(5HmVz184O3y7yc_7Sl-dU9GheTp21200002100101000000010101000000020002000000000010000000001100000000000200000001\"/><path id=\"hanging-knee-raise-m-m-elbowcap.l\" d=\"~~W*nFVhAv0\"/><path id=\"hanging-knee-raise-m-m-fore.l\" d=\"~#F12HXpAFi-Dp-_iK6S6aX1_jzx1I7(4I2sBhSnObU5X5D8T1WcOgwo1P2E2S8YoOtP1v)3H8F7H5ShX8!8KcJ2Kj00200010110020000010000000011002100001210010101000120000202000002000000100000020\"/><path id=\"hanging-knee-raise-m-m-thigh.r\" d=\"^54\"/><path id=\"hanging-knee-raise-m-m-kneecap.r\" d=\"^55\"/><path id=\"hanging-knee-raise-m-m-shank.r\" d=\"^56\"/><path id=\"hanging-knee-raise-m-m-foot.r\" d=\"^57\"/><path id=\"hanging-knee-raise-m-m-shcap.r\" d=\"^58\"/><path id=\"hanging-knee-raise-m-m-upper.r\" d=\"^59\"/><path id=\"hanging-knee-raise-m-m-elbowcap.r\" d=\"^60\"/><path id=\"hanging-knee-raise-m-m-fore.r\" d=\"^61\"/><path id=\"hanging-knee-raise-m-mf-fist.l\" d=\"^36\"/><path id=\"hanging-knee-raise-m-mf-fist.r\" d=\"^36\"/><path id=\"hanging-knee-raise-m-mo-0\" d=\"^37\"/><path id=\"hanging-knee-raise-m-mo-1\" d=\"^38\"/><path id=\"hanging-knee-raise-m-mo-2\" d=\"^28\"/><path id=\"hanging-knee-raise-m-mo-3\" d=\"^29\"/><path id=\"hanging-knee-raise-m-mo-4\" d=\"^30\"/><path id=\"hanging-knee-raise-m-mo-5\" d=\"^31\"/><path id=\"hanging-knee-raise-m-mo-6\" d=\"^32\"/><path id=\"hanging-knee-raise-m-mo-7\" d=\"^33\"/><path id=\"hanging-knee-raise-m-mo-8\" d=\"^34\"/><path id=\"hanging-knee-raise-m-mo-9\" d=\"^35\"/><path id=\"hanging-knee-raise-m-mo-10\" d=\"^36\"/><path id=\"hanging-knee-raise-m-mo-11\" d=\"^28\"/><path id=\"hanging-knee-raise-m-mo-12\" d=\"^29\"/><path id=\"hanging-knee-raise-m-mo-13\" d=\"^30\"/><path id=\"hanging-knee-raise-m-mo-14\" d=\"^31\"/><path id=\"hanging-knee-raise-m-mo-15\" d=\"^32\"/><path id=\"hanging-knee-raise-m-mo-16\" d=\"^33\"/><path id=\"hanging-knee-raise-m-mo-17\" d=\"^34\"/><path id=\"hanging-knee-raise-m-mo-18\" d=\"^35\"/><path id=\"hanging-knee-raise-m-mo-19\" d=\"^36\"/><path id=\"hanging-knee-raise-m-mo-20\" d=\"^41\"/><path id=\"hanging-knee-raise-m-mo-21\" d=\"^42\"/><path id=\"hanging-knee-raise-m-mo-22\" d=\"^43\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#hanging-knee-raise-m-dots)\"/>\n  <path class=\"datum\" d=\"^39\"/><path class=\"floorline\" d=\"^40\"/><path class=\"eq\" d=\"^41\"/><path class=\"eq-solid\" d=\"^42\"/><path class=\"eq-pin\" d=\"^43\"/><path class=\"eq-line\" d=\"^44\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-m-st-thigh.l\"/><use href=\"#hanging-knee-raise-m-st-kneecap.l\"/><use href=\"#hanging-knee-raise-m-st-shank.l\"/><use href=\"#hanging-knee-raise-m-st-foot.l\"/><use href=\"#hanging-knee-raise-m-st-shcap.l\"/><use href=\"#hanging-knee-raise-m-st-upper.l\"/><use href=\"#hanging-knee-raise-m-st-elbowcap.l\"/><use href=\"#hanging-knee-raise-m-st-fore.l\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-m-st-thigh.l\"/><use href=\"#hanging-knee-raise-m-st-kneecap.l\"/><use href=\"#hanging-knee-raise-m-st-shank.l\"/><use href=\"#hanging-knee-raise-m-st-foot.l\"/><use href=\"#hanging-knee-raise-m-st-shcap.l\"/><use href=\"#hanging-knee-raise-m-st-upper.l\"/><use href=\"#hanging-knee-raise-m-st-elbowcap.l\"/><use href=\"#hanging-knee-raise-m-st-fore.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-m-st-head\"/><use href=\"#hanging-knee-raise-m-st-torso\"/><use href=\"#hanging-knee-raise-m-st-thigh.r\"/><use href=\"#hanging-knee-raise-m-st-kneecap.r\"/><use href=\"#hanging-knee-raise-m-st-shank.r\"/><use href=\"#hanging-knee-raise-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-m-st-head\"/><use href=\"#hanging-knee-raise-m-st-torso\"/><use href=\"#hanging-knee-raise-m-st-thigh.r\"/><use href=\"#hanging-knee-raise-m-st-kneecap.r\"/><use href=\"#hanging-knee-raise-m-st-shank.r\"/><use href=\"#hanging-knee-raise-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-m-st-shcap.r\"/><use href=\"#hanging-knee-raise-m-st-upper.r\"/><use href=\"#hanging-knee-raise-m-st-elbowcap.r\"/><use href=\"#hanging-knee-raise-m-st-fore.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-m-st-shcap.r\"/><use href=\"#hanging-knee-raise-m-st-upper.r\"/><use href=\"#hanging-knee-raise-m-st-elbowcap.r\"/><use href=\"#hanging-knee-raise-m-st-fore.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-m-g0-head\"/><use href=\"#hanging-knee-raise-m-g0-torso\"/><use href=\"#hanging-knee-raise-m-g0-thigh.r\"/><use href=\"#hanging-knee-raise-m-g0-kneecap.r\"/><use href=\"#hanging-knee-raise-m-g0-shank.r\"/><use href=\"#hanging-knee-raise-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-m-g0-head\"/><use href=\"#hanging-knee-raise-m-g0-torso\"/><use href=\"#hanging-knee-raise-m-g0-thigh.r\"/><use href=\"#hanging-knee-raise-m-g0-kneecap.r\"/><use href=\"#hanging-knee-raise-m-g0-shank.r\"/><use href=\"#hanging-knee-raise-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-m-g1-head\"/><use href=\"#hanging-knee-raise-m-g1-torso\"/><use href=\"#hanging-knee-raise-m-g1-thigh.r\"/><use href=\"#hanging-knee-raise-m-g1-kneecap.r\"/><use href=\"#hanging-knee-raise-m-g1-shank.r\"/><use href=\"#hanging-knee-raise-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-m-g1-head\"/><use href=\"#hanging-knee-raise-m-g1-torso\"/><use href=\"#hanging-knee-raise-m-g1-thigh.r\"/><use href=\"#hanging-knee-raise-m-g1-kneecap.r\"/><use href=\"#hanging-knee-raise-m-g1-shank.r\"/><use href=\"#hanging-knee-raise-m-g1-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-m-g2-head\"/><use href=\"#hanging-knee-raise-m-g2-torso\"/><use href=\"#hanging-knee-raise-m-g2-thigh.r\"/><use href=\"#hanging-knee-raise-m-g2-kneecap.r\"/><use href=\"#hanging-knee-raise-m-g2-shank.r\"/><use href=\"#hanging-knee-raise-m-g2-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-m-g2-head\"/><use href=\"#hanging-knee-raise-m-g2-torso\"/><use href=\"#hanging-knee-raise-m-g2-thigh.r\"/><use href=\"#hanging-knee-raise-m-g2-kneecap.r\"/><use href=\"#hanging-knee-raise-m-g2-shank.r\"/><use href=\"#hanging-knee-raise-m-g2-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-m-e-thigh.l\"/><use href=\"#hanging-knee-raise-m-e-kneecap.l\"/><use href=\"#hanging-knee-raise-m-e-shank.l\"/><use href=\"#hanging-knee-raise-m-e-foot.l\"/><use href=\"#hanging-knee-raise-m-e-shcap.l\"/><use href=\"#hanging-knee-raise-m-e-upper.l\"/><use href=\"#hanging-knee-raise-m-e-elbowcap.l\"/><use href=\"#hanging-knee-raise-m-e-fore.l\"/><use href=\"#hanging-knee-raise-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-m-e-thigh.l\"/><use href=\"#hanging-knee-raise-m-e-kneecap.l\"/><use href=\"#hanging-knee-raise-m-e-shank.l\"/><use href=\"#hanging-knee-raise-m-e-foot.l\"/><use href=\"#hanging-knee-raise-m-e-shcap.l\"/><use href=\"#hanging-knee-raise-m-e-upper.l\"/><use href=\"#hanging-knee-raise-m-e-elbowcap.l\"/><use href=\"#hanging-knee-raise-m-e-fore.l\"/><use href=\"#hanging-knee-raise-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-m-e-head\"/><use href=\"#hanging-knee-raise-m-e-torso\"/><use href=\"#hanging-knee-raise-m-e-thigh.r\"/><use href=\"#hanging-knee-raise-m-e-kneecap.r\"/><use href=\"#hanging-knee-raise-m-e-shank.r\"/><use href=\"#hanging-knee-raise-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-m-e-head\"/><use href=\"#hanging-knee-raise-m-e-torso\"/><use href=\"#hanging-knee-raise-m-e-thigh.r\"/><use href=\"#hanging-knee-raise-m-e-kneecap.r\"/><use href=\"#hanging-knee-raise-m-e-shank.r\"/><use href=\"#hanging-knee-raise-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-m-e-shcap.r\"/><use href=\"#hanging-knee-raise-m-e-upper.r\"/><use href=\"#hanging-knee-raise-m-e-elbowcap.r\"/><use href=\"#hanging-knee-raise-m-e-fore.r\"/><use href=\"#hanging-knee-raise-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-knee-raise-m-e-shcap.r\"/><use href=\"#hanging-knee-raise-m-e-upper.r\"/><use href=\"#hanging-knee-raise-m-e-elbowcap.r\"/><use href=\"#hanging-knee-raise-m-e-fore.r\"/><use href=\"#hanging-knee-raise-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^45\"/><circle class=\"joint\" cx=\"133.73\" cy=\"138.33\" r=\"2.25\"/><circle class=\"joint\" cx=\"140.86\" cy=\"96.89\" r=\"2.25\"/><circle class=\"joint\" cx=\"146.46\" cy=\"195.43\" r=\"2.25\"/><circle class=\"joint\" cx=\"193.49\" cy=\"166.05\" r=\"2.25\"/></g><mask id=\"hanging-knee-raise-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#hanging-knee-raise-m-m-head\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-torso\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-thigh.l\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-shank.l\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-foot.l\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-shcap.l\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-upper.l\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-fore.l\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-mf-fist.l\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-thigh.r\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-shank.r\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-foot.r\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-shcap.r\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-upper.r\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-m-fore.r\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-mf-fist.r\" fill=\"#000\"/><use href=\"#hanging-knee-raise-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-knee-raise-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#hanging-knee-raise-m-mmask)\"><g class=\"u-stroke\"><use href=\"#hanging-knee-raise-m-m-head\"/><use href=\"#hanging-knee-raise-m-m-torso\"/><use href=\"#hanging-knee-raise-m-m-thigh.l\"/><use href=\"#hanging-knee-raise-m-m-kneecap.l\"/><use href=\"#hanging-knee-raise-m-m-shank.l\"/><use href=\"#hanging-knee-raise-m-m-foot.l\"/><use href=\"#hanging-knee-raise-m-m-shcap.l\"/><use href=\"#hanging-knee-raise-m-m-upper.l\"/><use href=\"#hanging-knee-raise-m-m-elbowcap.l\"/><use href=\"#hanging-knee-raise-m-m-fore.l\"/><use href=\"#hanging-knee-raise-m-m-thigh.r\"/><use href=\"#hanging-knee-raise-m-m-kneecap.r\"/><use href=\"#hanging-knee-raise-m-m-shank.r\"/><use href=\"#hanging-knee-raise-m-m-foot.r\"/><use href=\"#hanging-knee-raise-m-m-shcap.r\"/><use href=\"#hanging-knee-raise-m-m-upper.r\"/><use href=\"#hanging-knee-raise-m-m-elbowcap.r\"/><use href=\"#hanging-knee-raise-m-m-fore.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"M106.18 142.63A100 100 0 0 1 76.53 118.61M81.49 119.23L76.53 118.61L77.32 123.55\"/><path class=\"m-line\" d=\"~MwHmUXjLiY3L13L30L55L53L33L31L11L11L55L73L95L99Lf7Lf9Lh5Lb9L95L35L07L03\"/><path class=\"m-line\" d=\"~MHEnyNnLO3z4L3eL1cL1aL44L02L41L63L41L46L22L20L43L21L27L69L2bL2bL65L05\"/><path class=\"leader m\" d=\"~MSEgJOoL0Uy2\"/><path class=\"leader m\" d=\"M211.57 197.78L237 178H247\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"hanging-knee-raise-m-swing\" data-key=\"swing\" data-cue=\"The body swings to help the legs up.\" class=\"plate-callout two m\" style=\"left:6.15%;top:36.87%\" aria-pressed=\"true\">Body<br>swings</button><button type=\"button\" id=\"hanging-knee-raise-m-kick\" data-key=\"kick\" data-cue=\"The swing kicks the knees up, not the abs.\" class=\"plate-callout two m\" style=\"left:67.6%;top:43.58%\" aria-pressed=\"false\">Legs<br>kicked up</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "still",
        cues: [{ key: "still", cue: "Start every rep from a still hang, with no swing." }, { key: "knees", cue: "Lift the knees past hip height and hold a moment." }, { key: "curl", cue: "At the top, roll the hips up toward the ribs, low back rounding a little." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "swing",
        cues: [{ key: "swing", cue: "The body swings to help the legs up." }, { key: "kick", cue: "The swing kicks the knees up, not the abs." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Body swings</b><span>The body swings to help the legs up.</span></li><li><b>Legs kicked up</b><span>The swing kicks the knees up, not the abs.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lift 1 second, hold 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lift</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Hanging knee raise, side view. Hanging from a bar with straight arms and an overhand grip. From a still hang, the bent knees rise above hip height while the pelvis curls up, the body not swinging.",
      mistakeAlt: "Hanging Knee Raise: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hang",
    "orientation": "pronated",
    "handle": "bar-32",
    "loadAxis": "across",
    "width": {
      "text": "Hands about shoulder width.",
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "bullbar-calluses"
        ],
        "note": "c18"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "hk-baechle-grip"
        ],
        "note": "c3; inherited from hanging_leg_raise (THUMB)"
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        35
      ],
      "limitText": "Keep your wrist from curling forward.",
      "claim": {
        "tags": [
          "MECH",
          "CONVENTION"
        ],
        "sources": [
          "odriscoll-1992",
          "hand-key-bar"
        ],
        "note": "c16. The ext range is the bar key's hang wristRange (ga:hang-base), a convention, not a card number."
      }
    },
    "pose": {
      "view": "radial",
      "forearm": 180,
      "wrist": {
        "ext": 10,
        "dev": 0
      },
      "contactAt": 1,
      "fingers": {
        "curl": 1
      },
      "thumb": "wrapped",
      "squeeze": "firm",
      "load": {
        "kind": "gravity"
      }
    },
    "faults": [
      {
        "key": "curled",
        "label": "Wrist curled",
        "pose": {
          "wrist": {
            "dev": 0,
            "ext": -30
          }
        },
        "markers": [
          "lever-arc"
        ],
        "alt": "Wrist curled forward toward the forearm."
      }
    ],
    "gripLine": "Overhand, bar just below the base of your fingers, thumbs wrapped. Arms fully straight.",
    "cue": "Overhand, thumbs wrapped."
  },
  contacts: [
    "hang-support"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Use a bar high enough that you hang with straight legs.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "yessis-hanging-knee-leg-raise",
          "strengthlog-hanging-knee-raise"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "grip",
      "text": "Take the bar overhand, hands shoulder width, thumbs wrapped.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH",
          "WEAK"
        ],
        "sources": [
          "yessis-hanging-knee-leg-raise",
          "hk-baechle-grip",
          "bullbar-calluses"
        ],
        "note": "c2, c18, c3; thumb inherited from hanging_leg_raise (THUMB)"
      }
    },
    {
      "kind": "position",
      "text": "Hang with straight arms and let your body go still.",
      "zoom": "body-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-hanging-knee-raise",
          "yessis-hanging-knee-leg-raise"
        ],
        "note": "c4"
      }
    },
    {
      "kind": "brace",
      "text": "Pull your shoulder blades down and back as you hang.",
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "bullbar-calluses"
        ],
        "note": "c19"
      }
    },
    {
      "kind": "load",
      "text": "New to it? Keep the knees bent until this is easy.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "yessis-hanging-knee-leg-raise",
          "strengthlog-hanging-knee-raise"
        ],
        "note": "c13"
      }
    }
  ],
  posture: [
    {
      "key": "still",
      "label": "Still start",
      "detail": "Still hang, arms straight, before every rep.",
      "anchor": {
        "pose": "start",
        "at": "knee.r"
      },
      "zoom": "body-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-hanging-knee-raise",
          "yessis-hanging-knee-leg-raise"
        ],
        "note": "c4"
      }
    },
    {
      "key": "knees",
      "label": "Knees above hips",
      "detail": "Knees lift above hip height, with a brief hold.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "yessis-hanging-knee-leg-raise"
        ],
        "note": "c5"
      }
    },
    {
      "key": "curl",
      "label": "Pelvis curls",
      "detail": "Pelvis curls back at the top.",
      "anchor": {
        "pose": "end",
        "at": "sacrum"
      },
      "zoom": "top",
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "workman-2008",
          "yessis-hanging-knee-leg-raise"
        ],
        "note": "c7, c6"
      }
    },
    {
      "key": "lower",
      "label": "Controlled lowering",
      "detail": "Legs lowered under control.",
      "anchor": {
        "pose": "start",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-hanging-knee-raise",
          "yessis-hanging-knee-leg-raise"
        ],
        "note": "c8"
      }
    },
    {
      "key": "wrists",
      "label": "Wrists level",
      "detail": "Wrists not curled forward.",
      "anchor": {
        "pose": "start",
        "at": "wrist.r"
      },
      "zoom": "hand",
      "claim": {
        "tags": [
          "MECH",
          "CONVENTION"
        ],
        "sources": [
          "odriscoll-1992",
          "hand-key-bar"
        ],
        "note": "c16. The ext range is the bar key's hang wristRange (ga:hang-base), a convention, not a card number."
      }
    }
  ],
  zooms: [
    {
      "key": "hand",
      "chip": "Hand",
      "heading": "Hand: right and wrong",
      "kind": "hand"
    },
    {
      "key": "top",
      "chip": "Top",
      "heading": "Top position",
      "kind": "posture",
      "feelRow": "hips"
    },
    {
      "key": "body-line",
      "chip": "Body line",
      "heading": "Body line",
      "kind": "posture",
      "feelRow": "low-back"
    }
  ],
  chips: [
    "hand",
    "top",
    "body-line",
    "feel"
  ],
  copy: {
    "setupLine": "Hang overhand with straight arms and a still body. Lift the knees above your hips.",
    "mistakeLine": "Don't swing to kick the legs up. Start each rep still.",
    "cueLine": "Knees up, pelvis curls."
  },
  mistakes: [
    {
      "key": "swing",
      "title": "Swinging the body",
      "zoom": "body-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-hanging-knee-raise",
          "yessis-hanging-knee-leg-raise"
        ],
        "note": "c4, c8"
      },
      "fix": "Start each rep from a still hang. Lower with control."
    },
    {
      "key": "short",
      "title": "Knees stop at hip height",
      "zoom": "top",
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "yessis-hanging-knee-leg-raise"
        ],
        "note": "c6"
      },
      "fix": "Lift past hip height and roll your hips up."
    },
    {
      "key": "drop",
      "title": "Dropping the legs fast",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-hanging-knee-raise",
          "yessis-hanging-knee-leg-raise"
        ],
        "note": "c8"
      },
      "fix": "Lower the legs with control."
    }
  ],
  risks: [
    {
      "key": "spine",
      "text": "The straight-leg version measured about 3000 newtons of spine load. Bent knees likely less.",
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "mcgill-2015"
        ],
        "note": "c14"
      }
    },
    {
      "key": "shoulder",
      "text": "A long hang with arms overhead narrows the space under the shoulder roof.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "prinold-2016"
        ],
        "note": "c15"
      }
    }
  ],
  riskFlags: [
    "back",
    "shoulder"
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
    "yessis-hanging-knee-leg-raise",
    "strengthlog-hanging-knee-raise",
    "hk-baechle-grip",
    "workman-2008",
    "escamilla-2006",
    "mcgill-2015",
    "odriscoll-1992",
    "prinold-2016",
    "bullbar-calluses",
    "nasm-chin-pull",
    "hand-key-bar",
    "nhs-shoulder-pain",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/hanging_knee_raise.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

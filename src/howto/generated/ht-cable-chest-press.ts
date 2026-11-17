// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=954518dc997ec36710f7d9d64eb5029f850740e32d1ee47111c78b00c9f119c3
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_cable_chest_press",
  name: "Cable Chest Press",
  hashes: { inputsSha256: "954518dc997ec36710f7d9d64eb5029f850740e32d1ee47111c78b00c9f119c3", golden: "4e047075872b0f976de5f41f8cc7c75b42ceb47d7da0967704038b888bd341e4" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"cable-chest-press-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"cable-chest-press-n-st-upper.r\" d=\"~#F12P(x1Syt)Ix1*RsK4I465yrHjz1z5nI2TaIgx8TjTcRa.kB4)hO7R25B55yo(m7ax5V3Oj(4!a!qJhFeJs_510000000000020002012000000020000000010000100000000000010000000001200100001001200\"/><path id=\"cable-chest-press-n-st-elbowcap.r\" d=\"~~P-D1!xw1Dz10\"/><path id=\"cable-chest-press-n-st-fore.r\" d=\"~#F12((E1UDx1EFE1)Ax1G8B1J1rWy1T5V7x3)1O1.mw1Edz6zbmIcU7.m_1-1Y1E7w4Az1J1P1kz8F2x5NaFkH9Ahv(iXb00200010001000000000020220010000001000100010100020200000010000100000000000000020\"/><path id=\"cable-chest-press-n-st-fist.r\" d=\"~~yYN1USvww10\"/><path id=\"cable-chest-press-n-g0-upper.r\" d=\"~#F12FAy1WDtVJx1IXs-5)349Hx1HhK2z5B1K2)hRh-aEixeR8Glz1-nV7-22T5a_uHl5aE6G3.fN9_e(oFjSb!sP100000001010020101220020200000000010100200000020000000101010101000000210001100000\"/><path id=\"cable-chest-press-n-g0-elbowcap.r\" d=\"~~(xF1NWvDz10\"/><path id=\"cable-chest-press-n-g0-fore.r\" d=\"~#F12WBG1F.w1KKF1TYw1-8O1P1rUB1)3z8I3z2T1)p3*cT6Bb6Vcw7zqq*1U1x8W3UB1(2U1o-8!1-3AaWjHaHh9JjXa00220010012000000010010000100002001000001001000000100000000000000000002100001010\"/><path id=\"cable-chest-press-n-g0-fist.r\" d=\"~~AUP1USvww10\"/><path id=\"cable-chest-press-n-g1-upper.r\" d=\"~#F12(Gy1UGtRKx1E!s)6O369FE1SeO3)4-1I2XpKhBd-gxfO6BlW1Gu*6x38)5qNB1(i5aG7X2KbWc(h_mSk(8(sG200000000000010000202000200111100220101010110010100000210000000010110101000000010\"/><path id=\"cable-chest-press-n-g1-elbowcap.r\" d=\"~~YGG1DDvDz10\"/><path id=\"cable-chest-press-n-g1-fore.r\" d=\"~#F12JIH1(Hw1KRG1-Dw1O9z2_1lSF1-1R8-3z2-1ItT1OcK7BbdxdF6OtpB2S1-8D3DF1D5Y1qT9H1O2yayjHbDhoykV902000000000010001211000000001010100100100022000000000000200101200000101010000000\"/><path id=\"cable-chest-press-n-g1-fist.r\" d=\"~~APS1USvww10\"/><path id=\"cable-chest-press-n-e-thigh.l\" d=\"~#F12!Pw1NAG1-Sw1GVE19.bG13)3W(1!6z7D3R3!8IU1wfKlJ2)jK9GoY3zV1B2z4x5R8.a!*1D14F3IbTtOfTq(B1E4Wz1!gDI110220012100021000100000200000002000101000000020111000010100200010001002101000010\"/><path id=\"cable-chest-press-n-e-kneecap.l\" d=\"~~Pxw1YSV1_J10\"/><path id=\"cable-chest-press-n-e-shank.l\" d=\"~#F12wDw1W.U1Xwx1RUT1P7G9y1ixrA-1A9*3H4)1wu).1AdB8(5IaeOfPA1EY1dX4G1.9Kz1HU1x1lF4xb*gW3Xn(eXaYipys00022001010000010000121000100012000001001000101001002001011002111100020000100002\"/><path id=\"cable-chest-press-n-e-foot.l\" d=\"~#o2wNqAB)1R)qzB(1YcF3Uhx8Sp)nU-2B3-J2-4ID1)7)n2TG1Y4Bb-c_sBbKmSp021002110110100101000020000200100111000010111100\"/><path id=\"cable-chest-press-n-e-shcap.l\" d=\"~~AKx1U*rwP10\"/><path id=\"cable-chest-press-n-e-upper.l\" d=\"~#F12yRy1yJtKOx1GytG8V229_K1P9-4T4O2x2Ty1*eTfKe.fB4Vky5OB1-3B3mO6S1WJ1ye3aR8-1-5HfHlWjYlU5Ds.600000100000000210010001000100001200000000001011101002001010101101000002100000010\"/><path id=\"cable-chest-press-n-e-elbowcap.l\" d=\"~~NUH1wEuDz10\"/><path id=\"cable-chest-press-n-e-fore.l\" d=\"~#F12PSI1NIvGXH1RAv.9z3(1fHI1U2V8.4x2.1Kw1)4TbT8BbR1Rdw5Ow1B4O2H1X9F2HH1N9Y1y1Ga8X1wa!hDdAhJ2_kV700000000000020010020020000002111110001200000020210101000000000000000000020101001\"/><path id=\"cable-chest-press-n-e-fist.l\" d=\"~~DJU1USvww10\"/><path id=\"cable-chest-press-n-e-head\" d=\"~#w12A*y1U*h*Gx1xUhBjFjBjU9EbE3z3_4.4)7*7BbThKm_4XcT1T9Bj0JmEbNmG6_kA3AjygO1Dj1000021010110001010010000001000000001100000100000200110000000010\"/><path id=\"cable-chest-press-n-e-torso\" d=\"~#_12AKx1UVmXWx1EElR9I6E30W9UhP9J6!cwgJ60I6)nKm)7-c_4yg-4YkK6Jm*fWhThY4T9)7*fErEz1zbBrK60R90YcwgF3w8-c)7xgw8G6_kJ6J6YcBbF3w8BT2ww101000200000020110000000001000111101010000110011000002100101000110000000100010000002000000010000000011001110020000100\"/><path id=\"cable-chest-press-n-e-thigh.r\" d=\"~#F12P_w1_TH1.)v.JG1I7G9z1kFy1WU1F1X9e-4BoGO1pzq)9Ohzm-dTs.J1I4)1)8-3AsAY1y1lE4)a*w1D5F1NN1(hAvJE1So10000000100000001001010000100100202000012000022000011011100000011110000000010100\"/><path id=\"cable-chest-press-n-e-kneecap.r\" d=\"~~FTE1UxU1_J10\"/><path id=\"cable-chest-press-n-e-shank.r\" d=\"~#F12wSE1FEU1xPE1*XS1c.bF17Ncw(1(4R8H2B4-bxy2S5KeI1.b.8TcI4*y2B3R3.6z7W2A)1B14B3ObIbAdBaAqW2Slyg(m11120001000002101000001010010100222000020000001000120000200000001200020002120000\"/><path id=\"cable-chest-press-n-e-foot.r\" d=\"~#o2SSG1AB)1zAH1zB(1YcF3Uhx8Sp)nU-2B3-J2-4ID1)7)n2TG1Y4Bb-c_sBbKmSp020002010110100101000020000200000101000000110100\"/><path id=\"cable-chest-press-n-e-shcap.r\" d=\"^16\"/><path id=\"cable-chest-press-n-e-upper.r\" d=\"^17\"/><path id=\"cable-chest-press-n-e-elbowcap.r\" d=\"^18\"/><path id=\"cable-chest-press-n-e-fore.r\" d=\"^19\"/><path id=\"cable-chest-press-n-e-fist.r\" d=\"^20\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#cable-chest-press-n-dots)\"/>\n  <path class=\"floorline\" d=\"M29.96 339.5H311.11\"/><path class=\"eq\" d=\"~MWW4Pwy2L0OT.1Q0E6E6FK.1L*qF6QE60(qF6LF6FK.1Q0F6F6EK.1L(qE6QF60*qE6Z\"/><path class=\"eq\" d=\"~M_)cPwy2L0OT.1Q0E6E6FK.1L*qF6QE60(qF6LF6FK.1Q0F6F6EK.1L(qE6QF60*qE6Z\"/><path class=\"eq\" d=\"~MFO3U*7LHH90QF60xA9E6LE6zA1Q0E6E6AA1LxA9F6QE60yA9F6LF6AA1Q0F6F6zA1Z\"/><path class=\"eq\" d=\"~MJY1YDy2LyYc0QF60-RcE6LE6B3Q0E6E6D3L-RcF6QE60_RcF6LF6D3Q0F6F6B3Z\"/><path class=\"eq\" d=\"~MyD5YDy2LW!50QF60KW5E6LE6zA1Q0E6E6AA1LKW5F6QE60NW5F6LF6AA1Q0F6F6zA1Z\"/><path class=\"eq-thin\" d=\"~MyF6!Ow2L0VKl\"/><path class=\"eq-thin\" d=\"~MYwa!Ow2L0VKl\"/><path class=\"eq\" d=\"~M_)4HI-1LDG60LBG6SA7LBG6RA7Z\"/><path class=\"eq-thin\" d=\"M25.57 326.57H57.76M25.57 322.91H57.76M25.57 319.25H57.76M25.57 315.59H57.76M25.57 311.94H57.76M25.57 308.28H57.76M25.57 304.62H57.76M25.57 300.97H57.76M25.57 297.31H57.76\"/><path class=\"eq-solid\" d=\"~~WWbUSvAG12\"/><path class=\"eq-pin\" d=\"~~S-cUSvF60\"/><path class=\"eq\" d=\"~~NA7y-8ww10\"/><path class=\"eq-pin\" d=\"~~D(7y-8F60\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-n-st-upper.r\"/><use href=\"#cable-chest-press-n-st-elbowcap.r\"/><use href=\"#cable-chest-press-n-st-fore.r\"/><use href=\"#cable-chest-press-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-n-st-upper.r\"/><use href=\"#cable-chest-press-n-st-elbowcap.r\"/><use href=\"#cable-chest-press-n-st-fore.r\"/><use href=\"#cable-chest-press-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq\" d=\"~MAUR1DXtLK.2N.1L!W50Z\"/><path class=\"eq-solid\" d=\"~M_JR1DXtLUe0LTe!W3LTe.W3Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-n-g0-upper.r\"/><use href=\"#cable-chest-press-n-g0-elbowcap.r\"/><use href=\"#cable-chest-press-n-g0-fore.r\"/><use href=\"#cable-chest-press-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-n-g0-upper.r\"/><use href=\"#cable-chest-press-n-g0-elbowcap.r\"/><use href=\"#cable-chest-press-n-g0-fore.r\"/><use href=\"#cable-chest-press-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq\" d=\"~MAPT1DXtLK.2N.1L!W50Z\"/><path class=\"eq-solid\" d=\"~M_FT1DXtLUe0LTe!W3LTe.W3Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-n-g1-upper.r\"/><use href=\"#cable-chest-press-n-g1-elbowcap.r\"/><use href=\"#cable-chest-press-n-g1-fore.r\"/><use href=\"#cable-chest-press-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-n-g1-upper.r\"/><use href=\"#cable-chest-press-n-g1-elbowcap.r\"/><use href=\"#cable-chest-press-n-g1-fore.r\"/><use href=\"#cable-chest-press-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~M_)4yNO1LDG60LBG6AG4LBG6zG4Z\"/><path class=\"eq-thin\" d=\"M25.57 261.18H57.76M25.57 257.52H57.76M25.57 253.86H57.76M25.57 250.2H57.76M25.57 246.55H57.76\"/><path class=\"eq-cable\" d=\"~MWWbUSvL0R-mMES3ww1L0wVB1\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-n-e-thigh.l\"/><use href=\"#cable-chest-press-n-e-kneecap.l\"/><use href=\"#cable-chest-press-n-e-shank.l\"/><use href=\"#cable-chest-press-n-e-foot.l\"/><use href=\"#cable-chest-press-n-e-shcap.l\"/><use href=\"#cable-chest-press-n-e-upper.l\"/><use href=\"#cable-chest-press-n-e-elbowcap.l\"/><use href=\"#cable-chest-press-n-e-fore.l\"/><use href=\"#cable-chest-press-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-n-e-thigh.l\"/><use href=\"#cable-chest-press-n-e-kneecap.l\"/><use href=\"#cable-chest-press-n-e-shank.l\"/><use href=\"#cable-chest-press-n-e-foot.l\"/><use href=\"#cable-chest-press-n-e-shcap.l\"/><use href=\"#cable-chest-press-n-e-upper.l\"/><use href=\"#cable-chest-press-n-e-elbowcap.l\"/><use href=\"#cable-chest-press-n-e-fore.l\"/><use href=\"#cable-chest-press-n-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"~MYPS1USvLOOB1AG1\"/><path class=\"eq\" d=\"~MDJV1DXtLK.2N.1L!W50Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-n-e-head\"/><use href=\"#cable-chest-press-n-e-torso\"/><use href=\"#cable-chest-press-n-e-thigh.r\"/><use href=\"#cable-chest-press-n-e-kneecap.r\"/><use href=\"#cable-chest-press-n-e-shank.r\"/><use href=\"#cable-chest-press-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-n-e-head\"/><use href=\"#cable-chest-press-n-e-torso\"/><use href=\"#cable-chest-press-n-e-thigh.r\"/><use href=\"#cable-chest-press-n-e-kneecap.r\"/><use href=\"#cable-chest-press-n-e-shank.r\"/><use href=\"#cable-chest-press-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~M!AV1DXtLUe0LTe!W3LTe.W3Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-n-e-shcap.r\"/><use href=\"#cable-chest-press-n-e-upper.r\"/><use href=\"#cable-chest-press-n-e-elbowcap.r\"/><use href=\"#cable-chest-press-n-e-fore.r\"/><use href=\"#cable-chest-press-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-n-e-shcap.r\"/><use href=\"#cable-chest-press-n-e-upper.r\"/><use href=\"#cable-chest-press-n-e-elbowcap.r\"/><use href=\"#cable-chest-press-n-e-fore.r\"/><use href=\"#cable-chest-press-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"178.74\" cy=\"142.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"223.94\" cy=\"154.72\" r=\"2.25\"/><circle class=\"joint\" cx=\"178.74\" cy=\"212.1\" r=\"2.25\"/><circle class=\"joint\" cx=\"209.93\" cy=\"266.5\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#m0!XR1USvzUR1TSv0000000000000000000000000000000000000000000000000000000000000000\"/><path class=\"arrow\" d=\"~MUDU1USvLOB1YiLPB1EY1Z\"/></g><path class=\"leader\" d=\"M248.22 336.18L261 284H271\"/><circle class=\"anchor\" cx=\"248.22\" cy=\"336.18\" r=\"1.5\"/><path class=\"leader\" d=\"~MDJV1!Hx1L0AB4\"/><circle class=\"anchor\" cx=\"273.31\" cy=\"170.7\" r=\"1.5\"/><path class=\"leader\" d=\"M162.86 173.7L146.88 196H136.88\"/><circle class=\"anchor\" cx=\"162.86\" cy=\"173.7\" r=\"1.5\"/>\n<g class=\"plate-zoom\" data-view=\"normal\" data-k=\"3\" data-c=\"298 96\" data-src=\"258.9 161.7\"><defs><clipPath id=\"cable-chest-press-n-zclip\"><circle cx=\"298\" cy=\"96\" r=\"52\"/></clipPath></defs><circle class=\"pz-src\" cx=\"258.9\" cy=\"161.7\" r=\"17.33\"/><path class=\"pz-link\" d=\"~MSGU1PVsLYmBD1\"/><circle class=\"pz-bg\" cx=\"298\" cy=\"96\" r=\"52\"/><g class=\"pz-in\" clip-path=\"url(#cable-chest-press-n-zclip)\">\n  <defs><pattern id=\"cable-chest-press-n-z-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"cable-chest-press-n-z-st-upper.r\" d=\"~#F12PI8YEb-T6*V9Od*cinDR2w_1O3Ef)1G7zw1)P1*nx.1zD1OvK(1VczW1ImR7jTflyF2yB2hoEf*aR_1Ye_w1PP2!T1yI1FV2Ah02000010111110010000000000000000002101000000012100002022000111020000200000200100\"/><path id=\"cable-chest-press-n-z-st-elbowcap.r\" d=\"~~W!m_BkUG31\"/><path id=\"cable-chest-press-n-z-st-fore.r\" d=\"~#F12wKqwUn*FozOnxpT3H4R2yF3-gBnB9.5R4-A2!2OE1EiTx1y2)A1!mTA2P5G5D5.lwcHG3y4S4w2IoU6zfJvU!1wsPT1B3YY1)y100000000000000100001000000000100000000020020000000000100100000011002000000000000\"/><path id=\"cable-chest-press-n-z-st-fist.r\" d=\"~~HYN1wYiww30\"/><path id=\"cable-chest-press-n-z-g0-upper.r\" d=\"~#F12(!8DUbIW6GDaGh)bgnWz3_T1x7GfX3I7.V1XU1Ow1-W1GH1RpV)1E3VE2znE82*gsJ!2Aw2hqTiX9TO1AsJJ1_H2W-1_y1_W2P400020002001011000000010100001000001002000001010000000010010000120020002100000200\"/><path id=\"cable-chest-press-n-z-g0-elbowcap.r\" d=\"~~(VqNzjUG31\"/><path id=\"cable-chest-press-n-z-g0-fore.r\" d=\"~#F12yxu!RmzYr*Gm-qX4!4G2UP3zcIoBaB6-4EN27TD1xkVx1i)B1ylGN2N2*5(4zowb(P3_8!4F2RqP5IbUuA.1WuYT1lD_1Iw120000000000100020000010100110010120001110100000000110110000000100000100020101000\"/><path id=\"cable-chest-press-n-z-g0-fist.r\" d=\"~~NJU1wYiww30\"/><path id=\"cable-chest-press-n-z-g1-upper.r\" d=\"~#F12_K9!!bRY6TUaxlTact(V3WI1Ra*eK5B7EK2OU1OE1xS1EK1-jR)1D5x.2-k*8qBiJ2FP3_Y19sBmE8zy1DD1WV1HA2_*1(qWW2x700101011010110000001000000001101001010100010100001000000001011002010100000000002\"/><path id=\"cable-chest-press-n-z-g1-elbowcap.r\" d=\"~~JKuWShUG31\"/><path id=\"cable-chest-press-n-z-g1-fore.r\" d=\"~#F12FSx1wxlKAvVUkKsI6H5)1W-3G5TpXbG6z5EY2x5IB1BmTx1O1EE1(iEY2I2-6P4KqS9WY3SfD5S2.s!3T7DuH-1wy1WT1D2w!1)s01000000020000010000020002000121001000022000110000101000200200001010002000001111\"/><path id=\"cable-chest-press-n-z-g1-fist.r\" d=\"~~Sw_1wYiww30\"/><path id=\"cable-chest-press-n-z-e-thigh.l\" d=\"~#F12Uy4NKO1EF4))H1E1Vz1V3dzcy!5SkElU9TaSqK*4yK1))1D7B!1Os*F2Pbz)4-6Vc*eOp-w1S-5U3cW9Ey1VY2KN1*O2(R3*cwI3WS1Ux400001010000000000000000000200200000020000200000100000011000200012100000000020001\"/><path id=\"cable-chest-press-n-z-e-kneecap.l\" d=\"~~PU2NYU2JD42\"/><path id=\"cable-chest-press-n-z-e-shank.l\" d=\"M15.69 422.92C10.99 427.86 6.55 436.19 2.87 441.7C-0.81 447.22 -3.39 451.18 -6.38 456C-9.38 460.81 -10.04 461.16 -15.12 470.59C-20.19 480.02 -30.33 498.89 -36.84 512.58C-43.35 526.26 -48.75 539.5 -54.19 552.71C-59.63 565.92 -66.77 583.61 -69.46 591.85C-72.15 600.1 -71.09 599.41 -70.33 602.21C-69.57 605 -67.18 607.32 -64.9 608.62C-62.61 609.93 -59.41 610.81 -56.62 610.05C-53.82 609.29 -53.88 610.56 -48.13 604.06C-42.38 597.56 -30.76 582.44 -22.12 571.06C-13.48 559.68 -4.82 548.31 3.68 535.76C12.18 523.21 23.32 504.92 28.88 495.76C34.43 486.61 34.4 485.86 37.03 480.84C39.66 475.82 41.78 471.59 44.67 465.62C47.55 459.66 52.48 451.6 54.36 445.05C56.23 438.49 57.3 431.35 55.93 426.29C54.55 421.22 50.23 417.02 46.09 414.65C41.94 412.28 36.14 410.69 31.07 412.07C26.01 413.45 20.39 417.98 15.69 422.92Z\"/><path id=\"cable-chest-press-n-z-e-foot.l\" d=\"M-72.62 581.06C-78.64 583.11 -79.28 591.05 -81.07 596.42C-82.86 601.8 -84.01 608.32 -83.37 613.32C-82.73 618.31 -81.33 623.94 -77.23 626.37C-73.13 628.8 -72.11 627.65 -58.8 627.91C-45.48 628.16 -11.69 628.29 2.65 627.91C16.98 627.52 22.1 627.01 27.22 625.6C32.34 624.2 33.24 621.51 33.37 619.46C33.49 617.41 33.11 614.98 27.99 613.32C22.87 611.65 11.99 611.78 2.65 609.48C-6.7 607.17 -20.14 603.72 -28.08 599.49C-36.01 595.27 -37.55 587.21 -44.97 584.13C-52.4 581.06 -66.6 579.02 -72.62 581.06Z\"/><path id=\"cable-chest-press-n-z-e-shcap.l\" d=\"~~JX6!Y7wP40\"/><path id=\"cable-chest-press-n-z-e-upper.l\" d=\"~#F12DzaHAcB(6BEbxp.76tPG4HsTeRdI7K6.E3-J1XN1GI1-O1Ic)*1wfRP3IbO9w2Ij_4_B4AH15s-pE5GhYK1!)1y.1Fx2(gNU2Ok01000010012000000000000000002002001001000200201000101000001210121020000000000011\"/><path id=\"cable-chest-press-n-z-e-elbowcap.l\" d=\"~~NKy1AVeUG31\"/><path id=\"cable-chest-press-n-z-e-fore.l\" d=\"~#F12SEB1Nyi*Vy1.KhVtG9!5O1(x4_7BqKeB6X5Bx3zf)y1VpKx1X4XF1wfOx3KcT7_3ztU6y)3SsA5w3xvoz5AuYV1JE1AT1F7S(1*m21002020000000101000021010000010112000000100110000210110010020200001000000020000\"/><path id=\"cable-chest-press-n-z-e-fist.l\" d=\"~~WU)1wYiww30\"/><path id=\"cable-chest-press-n-z-e-head\" d=\"M57.5 -113.78C64.42 -113.27 75.42 -112.24 82.08 -109.17C88.74 -106.1 93.86 -100.72 97.44 -95.35C101.03 -89.97 102.43 -82.8 103.59 -76.91C104.74 -71.03 104.35 -66.03 104.35 -60.02C104.35 -54 104.23 -46.58 103.59 -40.82C102.95 -35.06 102.18 -29.68 100.51 -25.46C98.85 -21.23 97.31 -17.01 93.6 -15.47C89.89 -13.94 82.98 -14.96 78.24 -16.24C73.5 -17.52 69.66 -20.08 65.18 -23.15C60.7 -26.23 57.5 -30.83 51.36 -34.67C45.22 -38.51 34.21 -41.46 28.32 -46.19C22.43 -50.93 18.33 -56.95 16.03 -63.09C13.73 -69.23 13.34 -76.66 14.49 -83.06C15.65 -89.46 18.59 -96.63 22.94 -101.49C27.29 -106.36 34.85 -110.2 40.61 -112.24C46.37 -114.29 50.59 -114.29 57.5 -113.78Z\"/><path id=\"cable-chest-press-n-z-e-torso\" d=\"M34.46 -40.82C26.78 -37.11 32.16 -25.46 29.86 -18.55C27.55 -11.63 23.97 -5.74 20.64 0.66C17.31 7.06 12.7 12.05 9.89 19.86C7.07 27.66 5.02 37.78 3.74 47.5C2.46 57.23 1.69 66.71 2.21 78.23C2.72 89.75 4.77 103.83 6.81 116.63C8.86 129.43 12.45 144.15 14.49 155.03C16.54 165.91 19.36 173.59 19.1 181.91C18.85 190.23 16.03 196.89 12.96 204.95C9.89 213.01 3.49 222.23 0.67 230.29C-2.15 238.36 -4.07 246.17 -3.94 253.33C-3.81 260.5 -2.15 267.93 1.44 273.3C5.02 278.68 10.78 282.9 17.57 285.59C24.35 288.28 33.57 288.92 42.14 289.43C50.72 289.94 60.7 290.2 69.02 288.66C77.34 287.13 86.56 285.85 92.06 280.22C97.57 274.58 99.62 265.5 102.05 254.87C104.48 244.25 105.63 229.27 106.66 216.47C107.68 203.67 108.45 190.87 108.19 178.07C107.94 165.27 105.12 151.19 105.12 139.67C105.12 128.15 106.91 118.55 108.19 108.95C109.47 99.35 112.29 91.67 112.8 82.07C113.31 72.47 113.06 60.95 111.27 51.34C109.47 41.74 105.63 31.76 102.05 24.46C98.47 17.17 93.34 12.69 89.76 7.57C86.18 2.45 82.59 -0.75 80.54 -6.26C78.5 -11.76 78.24 -19.7 77.47 -25.46C76.7 -31.22 83.1 -38.26 75.94 -40.82C68.77 -43.38 42.14 -44.53 34.46 -40.82Z\"/><path id=\"cable-chest-press-n-z-e-thigh.r\" d=\"~#F12P)4S.T1OO2-DP1Gm-rE3!1UD3w(4!3GtF1GeTF2xN4E2EN2zuTU1Iy2IG1*V2RD4)cz6ErKbSU2NF5F3*1-cEx1-y3_f!3yI4UV1S*2yW3UG200000000000001000001110000001000200000010000000002020020010000111111010000000100\"/><path id=\"cable-chest-press-n-z-e-kneecap.r\" d=\"~~_GpABP2JD42\"/><path id=\"cable-chest-press-n-z-e-shank.r\" d=\"~#F12yDp!VP2Ewp.EJ2D1-z1Y3dAB1Y-5wfRp_6VcIz1BD6_gzI1E4Xz1Xq.B1*c-F6V9XaRkGlD8H*5V3gV9Ry1*x1NE1RuHN2_7Uw2NP1_A200002000201000002000001100021001200000200111100000000000000000000000000100002000\"/><path id=\"cable-chest-press-n-z-e-foot.r\" d=\"~#o2!EvUOR3V!w1TON3ND1U9YU1xo_J2*E2!J8T9OD7KezT3*nxF20X!3JeTx1KD1JW2Rx1Bz2_J2000200010000000021011100020000000101111000121002\"/><path id=\"cable-chest-press-n-z-e-shcap.r\" d=\"^73\"/><path id=\"cable-chest-press-n-z-e-upper.r\" d=\"^74\"/><path id=\"cable-chest-press-n-z-e-elbowcap.r\" d=\"^75\"/><path id=\"cable-chest-press-n-z-e-fore.r\" d=\"^76\"/><path id=\"cable-chest-press-n-z-e-fist.r\" d=\"^77\"/></defs>\n  \n  <path class=\"floorline\" d=\"M-388.83 628.41H454.63\"/><path class=\"eq\" d=\"M-406.38 626.91L-406.38 -292.72Q-406.38 -293.72 -407.38 -293.72L-427.33 -293.72Q-428.33 -293.72 -428.33 -292.72L-428.33 626.91Q-428.33 627.91 -427.33 627.91L-407.38 627.91Q-406.38 627.91 -406.38 626.91Z\"/><path class=\"eq\" d=\"M-279.11 626.91L-279.11 -292.72Q-279.11 -293.72 -280.11 -293.72L-300.05 -293.72Q-301.05 -293.72 -301.05 -292.72L-301.05 626.91Q-301.05 627.91 -300.05 627.91L-280.11 627.91Q-279.11 627.91 -279.11 626.91Z\"/><path class=\"eq\" d=\"M-427.33 -267.38L-280.11 -267.38Q-279.11 -267.38 -279.11 -268.38L-279.11 -292.72Q-279.11 -293.72 -280.11 -293.72L-427.33 -293.72Q-428.33 -293.72 -428.33 -292.72L-428.33 -268.38Q-428.33 -267.38 -427.33 -267.38Z\"/><path class=\"eq\" d=\"M-453.66 627.91L-253.78 627.91Q-252.78 627.91 -252.78 626.91L-252.78 618.38Q-252.78 617.38 -253.78 617.38L-453.66 617.38Q-454.66 617.38 -454.66 618.38L-454.66 626.91Q-454.66 627.91 -453.66 627.91Z\"/><path class=\"eq\" d=\"M-400.99 627.91L-306.44 627.91Q-305.44 627.91 -305.44 626.91L-305.44 602.58Q-305.44 601.58 -306.44 601.58L-400.99 601.58Q-401.99 601.58 -401.99 602.58L-401.99 626.91Q-401.99 627.91 -400.99 627.91Z\"/><path class=\"eq-thin\" d=\"M-382.68 601.58L-382.68 272.43\"/><path class=\"eq-thin\" d=\"M-324.75 601.58L-324.75 272.43\"/><path class=\"eq\" d=\"M-401.99 491.86L-305.44 491.86L-305.44 601.58L-401.99 601.58Z\"/><path class=\"eq-thin\" d=\"M-401.99 590.61H-305.44M-401.99 579.63H-305.44M-401.99 568.66H-305.44M-401.99 557.69H-305.44M-401.99 546.72H-305.44M-401.99 535.75H-305.44M-401.99 524.78H-305.44M-401.99 513.8H-305.44M-401.99 502.83H-305.44\"/><path class=\"eq-solid\" d=\"M-298.86 96a19.75 19.75 0 1 0 39.5 0a19.75 19.75 0 1 0 -39.5 0Z\"/><path class=\"eq-pin\" d=\"M-280.11 96a1 1 0 1 0 2 0a1 1 0 1 0 -2 0Z\"/><path class=\"eq\" d=\"M-369.08 -254.22a15.36 15.36 0 1 0 30.72 0a15.36 15.36 0 1 0 -30.72 0Z\"/><path class=\"eq-pin\" d=\"M-354.72 -254.22a1 1 0 1 0 2 0a1 1 0 1 0 -2 0Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-n-z-st-upper.r\"/><use href=\"#cable-chest-press-n-z-st-elbowcap.r\"/><use href=\"#cable-chest-press-n-z-st-fore.r\"/><use href=\"#cable-chest-press-n-z-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-n-z-st-upper.r\"/><use href=\"#cable-chest-press-n-z-st-elbowcap.r\"/><use href=\"#cable-chest-press-n-z-st-fore.r\"/><use href=\"#cable-chest-press-n-z-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq\" d=\"~MNJX1WBdLGS8HS5LUAh0Z\"/><path class=\"eq-solid\" d=\"~MPWW1WBdL!I10L.I1UAbL.I1TAbZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-n-z-g0-upper.r\"/><use href=\"#cable-chest-press-n-z-g0-elbowcap.r\"/><use href=\"#cable-chest-press-n-z-g0-fore.r\"/><use href=\"#cable-chest-press-n-z-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-n-z-g0-upper.r\"/><use href=\"#cable-chest-press-n-z-g0-elbowcap.r\"/><use href=\"#cable-chest-press-n-z-g0-fore.r\"/><use href=\"#cable-chest-press-n-z-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq\" d=\"~MSw*1WBdLGS8HS5LUAh0Z\"/><path class=\"eq-solid\" d=\"~MUH!1WBdL!I10L.I1UAbL.I1TAbZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-n-z-g1-upper.r\"/><use href=\"#cable-chest-press-n-z-g1-elbowcap.r\"/><use href=\"#cable-chest-press-n-z-g1-fore.r\"/><use href=\"#cable-chest-press-n-z-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-n-z-g1-upper.r\"/><use href=\"#cable-chest-press-n-z-g1-elbowcap.r\"/><use href=\"#cable-chest-press-n-z-g1-fore.r\"/><use href=\"#cable-chest-press-n-z-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"M-401.99 339.57L-305.44 339.57L-305.44 405.4L-401.99 405.4Z\"/><path class=\"eq-thin\" d=\"M-401.99 394.43H-305.44M-401.99 383.46H-305.44M-401.99 372.49H-305.44M-401.99 361.52H-305.44M-401.99 350.54H-305.44\"/><path class=\"eq-cable\" d=\"M-298.86 96L-298.86 -254.22M-353.72 -238.86L-353.72 339.57\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-n-z-e-thigh.l\"/><use href=\"#cable-chest-press-n-z-e-kneecap.l\"/><use href=\"#cable-chest-press-n-z-e-shank.l\"/><use href=\"#cable-chest-press-n-z-e-foot.l\"/><use href=\"#cable-chest-press-n-z-e-shcap.l\"/><use href=\"#cable-chest-press-n-z-e-upper.l\"/><use href=\"#cable-chest-press-n-z-e-elbowcap.l\"/><use href=\"#cable-chest-press-n-z-e-fore.l\"/><use href=\"#cable-chest-press-n-z-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-n-z-e-thigh.l\"/><use href=\"#cable-chest-press-n-z-e-kneecap.l\"/><use href=\"#cable-chest-press-n-z-e-shank.l\"/><use href=\"#cable-chest-press-n-z-e-foot.l\"/><use href=\"#cable-chest-press-n-z-e-shcap.l\"/><use href=\"#cable-chest-press-n-z-e-upper.l\"/><use href=\"#cable-chest-press-n-z-e-elbowcap.l\"/><use href=\"#cable-chest-press-n-z-e-fore.l\"/><use href=\"#cable-chest-press-n-z-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"M297.34 96L-278.43 115.74\"/><path class=\"eq\" d=\"~MWUy2WBdLGS8HS5LUAh0Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-n-z-e-head\"/><use href=\"#cable-chest-press-n-z-e-torso\"/><use href=\"#cable-chest-press-n-z-e-thigh.r\"/><use href=\"#cable-chest-press-n-z-e-kneecap.r\"/><use href=\"#cable-chest-press-n-z-e-shank.r\"/><use href=\"#cable-chest-press-n-z-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-n-z-e-head\"/><use href=\"#cable-chest-press-n-z-e-torso\"/><use href=\"#cable-chest-press-n-z-e-thigh.r\"/><use href=\"#cable-chest-press-n-z-e-kneecap.r\"/><use href=\"#cable-chest-press-n-z-e-shank.r\"/><use href=\"#cable-chest-press-n-z-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~MY(x2WBdL!I10L.I1UAbL.I1TAbZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-n-z-e-shcap.r\"/><use href=\"#cable-chest-press-n-z-e-upper.r\"/><use href=\"#cable-chest-press-n-z-e-elbowcap.r\"/><use href=\"#cable-chest-press-n-z-e-fore.r\"/><use href=\"#cable-chest-press-n-z-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-n-z-e-shcap.r\"/><use href=\"#cable-chest-press-n-z-e-upper.r\"/><use href=\"#cable-chest-press-n-z-e-elbowcap.r\"/><use href=\"#cable-chest-press-n-z-e-fore.r\"/><use href=\"#cable-chest-press-n-z-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"57.5\" cy=\"39.82\" r=\"2.25\"/><circle class=\"joint\" cx=\"193.13\" cy=\"75.06\" r=\"2.25\"/><circle class=\"joint\" cx=\"57.5\" cy=\"247.19\" r=\"2.25\"/><circle class=\"joint\" cx=\"151.08\" cy=\"410.42\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#D20!.T1wYiTPT1)Xi0000000020100000000000002010000000000000002010000000000000201000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000002000000000000000000000000000000000000000000000000000\"/><path class=\"arrow\" d=\"~MJIx2wYiLOB1YiLPB1EY1Z\"/></g>\n</g><circle class=\"pz-ring\" cx=\"298\" cy=\"96\" r=\"52\"/></g></svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"cable-chest-press-n-stance\" data-key=\"stance\" data-cue=\"Stand with one foot in front of the other, feet planted.\" class=\"plate-callout two\" style=\"left:74.3%;top:73.18%\" aria-pressed=\"true\">Staggered<br>stance</button><button type=\"button\" id=\"cable-chest-press-n-height\" data-key=\"height\" data-cue=\"Bring the handles back to about nipple height, not the collarbone.\" class=\"plate-callout two\" style=\"left:73.18%;top:52.51%\" aria-pressed=\"false\">Handles at<br>nipples</button><button type=\"button\" id=\"cable-chest-press-n-spine\" data-key=\"spine\" data-cue=\"Brace your abs and glutes and keep your back from arching.\" class=\"plate-callout two\" style=\"left:20.67%;top:48.6%\" aria-pressed=\"false\">Spine<br>neutral</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"cable-chest-press-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"cable-chest-press-m-st-upper.r\" d=\"^0\"/><path id=\"cable-chest-press-m-st-elbowcap.r\" d=\"^1\"/><path id=\"cable-chest-press-m-st-fore.r\" d=\"^2\"/><path id=\"cable-chest-press-m-st-fist.r\" d=\"^3\"/><path id=\"cable-chest-press-m-g0-upper.r\" d=\"^4\"/><path id=\"cable-chest-press-m-g0-elbowcap.r\" d=\"^5\"/><path id=\"cable-chest-press-m-g0-fore.r\" d=\"^6\"/><path id=\"cable-chest-press-m-g0-fist.r\" d=\"^7\"/><path id=\"cable-chest-press-m-g1-upper.r\" d=\"^8\"/><path id=\"cable-chest-press-m-g1-elbowcap.r\" d=\"^9\"/><path id=\"cable-chest-press-m-g1-fore.r\" d=\"^10\"/><path id=\"cable-chest-press-m-g1-fist.r\" d=\"^11\"/><path id=\"cable-chest-press-m-e-thigh.l\" d=\"^12\"/><path id=\"cable-chest-press-m-e-kneecap.l\" d=\"^13\"/><path id=\"cable-chest-press-m-e-shank.l\" d=\"^14\"/><path id=\"cable-chest-press-m-e-foot.l\" d=\"^15\"/><path id=\"cable-chest-press-m-e-shcap.l\" d=\"^16\"/><path id=\"cable-chest-press-m-e-upper.l\" d=\"^17\"/><path id=\"cable-chest-press-m-e-elbowcap.l\" d=\"^18\"/><path id=\"cable-chest-press-m-e-fore.l\" d=\"^19\"/><path id=\"cable-chest-press-m-e-fist.l\" d=\"^20\"/><path id=\"cable-chest-press-m-e-head\" d=\"^21\"/><path id=\"cable-chest-press-m-e-torso\" d=\"^22\"/><path id=\"cable-chest-press-m-e-thigh.r\" d=\"^23\"/><path id=\"cable-chest-press-m-e-kneecap.r\" d=\"^24\"/><path id=\"cable-chest-press-m-e-shank.r\" d=\"^25\"/><path id=\"cable-chest-press-m-e-foot.r\" d=\"^26\"/><path id=\"cable-chest-press-m-e-shcap.r\" d=\"^16\"/><path id=\"cable-chest-press-m-e-upper.r\" d=\"^17\"/><path id=\"cable-chest-press-m-e-elbowcap.r\" d=\"^18\"/><path id=\"cable-chest-press-m-e-fore.r\" d=\"^19\"/><path id=\"cable-chest-press-m-e-fist.r\" d=\"^20\"/><path id=\"cable-chest-press-m-m-upper.l\" d=\"~#F12!Ty1WJtxRx1.AtT8B209DO1_6E5B4T2x2TA1xdKgKdBgz3EkD6.D1V1B3qK6w2DN1Nb1a-8E1B4WfNmJiwmH4YrR800000000100000000000010111000002000000120011011010101110000000002020000101000000\"/><path id=\"cable-chest-press-m-m-elbowcap.l\" d=\"~~U*H1_WtDz10\"/><path id=\"cable-chest-press-m-m-fore.l\" d=\"~#F12!-I1(_u*(H1VSu-9T3y2dFI1_4O8E5)1)1Ew1V6Gbz9*aB2.dJ4Kw1-5T2A1-9Y1wH1UbU1A1Ia9x2(9Dhye(gD3DlR600101021010012100012000001001001000000000000000022200000000120200000000000021002\"/><path id=\"cable-chest-press-m-m-fist.l\" d=\"~~(TU1(Rvww10\"/><path id=\"cable-chest-press-m-m-upper.r\" d=\"^110\"/><path id=\"cable-chest-press-m-m-elbowcap.r\" d=\"^111\"/><path id=\"cable-chest-press-m-m-fore.r\" d=\"^112\"/><path id=\"cable-chest-press-m-m-fist.r\" d=\"^113\"/><path id=\"cable-chest-press-m-m-eq0\" d=\"~M_)4HDO1LDG60LBG6AG4LBG6zG4Z\"/><path id=\"cable-chest-press-m-m-eq1\" d=\"~MUJV1PWtLUe0LTe!W3LTe.W3Z\"/><path id=\"cable-chest-press-m-m-eq2\" d=\"~M(TV1PWtLK.2P.1L!W53Z\"/><path id=\"cable-chest-press-m-mf-head\" d=\"^21\"/><path id=\"cable-chest-press-m-mf-torso\" d=\"^22\"/><path id=\"cable-chest-press-m-mf-thigh.l\" d=\"^12\"/><path id=\"cable-chest-press-m-mf-kneecap.l\" d=\"^13\"/><path id=\"cable-chest-press-m-mf-shank.l\" d=\"^14\"/><path id=\"cable-chest-press-m-mf-foot.l\" d=\"^15\"/><path id=\"cable-chest-press-m-mf-shcap.l\" d=\"^16\"/><path id=\"cable-chest-press-m-mf-thigh.r\" d=\"^23\"/><path id=\"cable-chest-press-m-mf-kneecap.r\" d=\"^24\"/><path id=\"cable-chest-press-m-mf-shank.r\" d=\"^25\"/><path id=\"cable-chest-press-m-mf-foot.r\" d=\"^26\"/><path id=\"cable-chest-press-m-mf-shcap.r\" d=\"^16\"/><path id=\"cable-chest-press-m-mo-0\" d=\"^21\"/><path id=\"cable-chest-press-m-mo-1\" d=\"^22\"/><path id=\"cable-chest-press-m-mo-2\" d=\"^12\"/><path id=\"cable-chest-press-m-mo-3\" d=\"^13\"/><path id=\"cable-chest-press-m-mo-4\" d=\"^14\"/><path id=\"cable-chest-press-m-mo-5\" d=\"^15\"/><path id=\"cable-chest-press-m-mo-6\" d=\"^16\"/><path id=\"cable-chest-press-m-mo-7\" d=\"^17\"/><path id=\"cable-chest-press-m-mo-8\" d=\"^18\"/><path id=\"cable-chest-press-m-mo-9\" d=\"^19\"/><path id=\"cable-chest-press-m-mo-10\" d=\"^20\"/><path id=\"cable-chest-press-m-mo-11\" d=\"^23\"/><path id=\"cable-chest-press-m-mo-12\" d=\"^24\"/><path id=\"cable-chest-press-m-mo-13\" d=\"^25\"/><path id=\"cable-chest-press-m-mo-14\" d=\"^26\"/><path id=\"cable-chest-press-m-mo-15\" d=\"^16\"/><path id=\"cable-chest-press-m-mo-16\" d=\"^17\"/><path id=\"cable-chest-press-m-mo-17\" d=\"^18\"/><path id=\"cable-chest-press-m-mo-18\" d=\"^19\"/><path id=\"cable-chest-press-m-mo-19\" d=\"^20\"/><path id=\"cable-chest-press-m-mo-20\" d=\"^28\"/><path id=\"cable-chest-press-m-mo-21\" d=\"^29\"/><path id=\"cable-chest-press-m-mo-22\" d=\"^30\"/><path id=\"cable-chest-press-m-mo-23\" d=\"^31\"/><path id=\"cable-chest-press-m-mo-24\" d=\"^32\"/><path id=\"cable-chest-press-m-mo-25\" d=\"^35\"/><path id=\"cable-chest-press-m-mo-26\" d=\"^45\"/><path id=\"cable-chest-press-m-mo-27\" d=\"^37\"/><path id=\"cable-chest-press-m-mo-28\" d=\"^38\"/><path id=\"cable-chest-press-m-mo-29\" d=\"^39\"/><path id=\"cable-chest-press-m-mo-30\" d=\"^40\"/><path id=\"cable-chest-press-m-mo-31\" d=\"^50\"/><path id=\"cable-chest-press-m-mo-32\" d=\"^49\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#cable-chest-press-m-dots)\"/>\n  <path class=\"floorline\" d=\"^27\"/><path class=\"eq\" d=\"^28\"/><path class=\"eq\" d=\"^29\"/><path class=\"eq\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq\" d=\"^32\"/><path class=\"eq-thin\" d=\"^33\"/><path class=\"eq-thin\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq-thin\" d=\"^36\"/><path class=\"eq-solid\" d=\"^37\"/><path class=\"eq-pin\" d=\"^38\"/><path class=\"eq\" d=\"^39\"/><path class=\"eq-pin\" d=\"^40\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-m-st-upper.r\"/><use href=\"#cable-chest-press-m-st-elbowcap.r\"/><use href=\"#cable-chest-press-m-st-fore.r\"/><use href=\"#cable-chest-press-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-m-st-upper.r\"/><use href=\"#cable-chest-press-m-st-elbowcap.r\"/><use href=\"#cable-chest-press-m-st-fore.r\"/><use href=\"#cable-chest-press-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq\" d=\"^41\"/><path class=\"eq-solid\" d=\"^42\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-m-g0-upper.r\"/><use href=\"#cable-chest-press-m-g0-elbowcap.r\"/><use href=\"#cable-chest-press-m-g0-fore.r\"/><use href=\"#cable-chest-press-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-m-g0-upper.r\"/><use href=\"#cable-chest-press-m-g0-elbowcap.r\"/><use href=\"#cable-chest-press-m-g0-fore.r\"/><use href=\"#cable-chest-press-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq\" d=\"^43\"/><path class=\"eq-solid\" d=\"^44\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-m-g1-upper.r\"/><use href=\"#cable-chest-press-m-g1-elbowcap.r\"/><use href=\"#cable-chest-press-m-g1-fore.r\"/><use href=\"#cable-chest-press-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-m-g1-upper.r\"/><use href=\"#cable-chest-press-m-g1-elbowcap.r\"/><use href=\"#cable-chest-press-m-g1-fore.r\"/><use href=\"#cable-chest-press-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^45\"/><path class=\"eq-thin\" d=\"^46\"/><path class=\"eq-cable\" d=\"^47\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-m-e-thigh.l\"/><use href=\"#cable-chest-press-m-e-kneecap.l\"/><use href=\"#cable-chest-press-m-e-shank.l\"/><use href=\"#cable-chest-press-m-e-foot.l\"/><use href=\"#cable-chest-press-m-e-shcap.l\"/><use href=\"#cable-chest-press-m-e-upper.l\"/><use href=\"#cable-chest-press-m-e-elbowcap.l\"/><use href=\"#cable-chest-press-m-e-fore.l\"/><use href=\"#cable-chest-press-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-m-e-thigh.l\"/><use href=\"#cable-chest-press-m-e-kneecap.l\"/><use href=\"#cable-chest-press-m-e-shank.l\"/><use href=\"#cable-chest-press-m-e-foot.l\"/><use href=\"#cable-chest-press-m-e-shcap.l\"/><use href=\"#cable-chest-press-m-e-upper.l\"/><use href=\"#cable-chest-press-m-e-elbowcap.l\"/><use href=\"#cable-chest-press-m-e-fore.l\"/><use href=\"#cable-chest-press-m-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"^48\"/><path class=\"eq\" d=\"^49\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-m-e-head\"/><use href=\"#cable-chest-press-m-e-torso\"/><use href=\"#cable-chest-press-m-e-thigh.r\"/><use href=\"#cable-chest-press-m-e-kneecap.r\"/><use href=\"#cable-chest-press-m-e-shank.r\"/><use href=\"#cable-chest-press-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-m-e-head\"/><use href=\"#cable-chest-press-m-e-torso\"/><use href=\"#cable-chest-press-m-e-thigh.r\"/><use href=\"#cable-chest-press-m-e-kneecap.r\"/><use href=\"#cable-chest-press-m-e-shank.r\"/><use href=\"#cable-chest-press-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^50\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-m-e-shcap.r\"/><use href=\"#cable-chest-press-m-e-upper.r\"/><use href=\"#cable-chest-press-m-e-elbowcap.r\"/><use href=\"#cable-chest-press-m-e-fore.r\"/><use href=\"#cable-chest-press-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-m-e-shcap.r\"/><use href=\"#cable-chest-press-m-e-upper.r\"/><use href=\"#cable-chest-press-m-e-elbowcap.r\"/><use href=\"#cable-chest-press-m-e-fore.r\"/><use href=\"#cable-chest-press-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"178.74\" cy=\"142.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"223.94\" cy=\"154.72\" r=\"2.25\"/><circle class=\"joint\" cx=\"178.74\" cy=\"212.1\" r=\"2.25\"/><circle class=\"joint\" cx=\"209.93\" cy=\"266.5\" r=\"2.25\"/></g><mask id=\"cable-chest-press-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#cable-chest-press-m-mf-head\" fill=\"#000\"/><use href=\"#cable-chest-press-m-mf-torso\" fill=\"#000\"/><use href=\"#cable-chest-press-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-mf-shank.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-mf-foot.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-m-upper.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-m-fore.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-m-fist.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-mf-shank.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-mf-foot.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-m-upper.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-m-fore.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-m-fist.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#cable-chest-press-m-mmask)\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-m-m-upper.l\"/><use href=\"#cable-chest-press-m-m-elbowcap.l\"/><use href=\"#cable-chest-press-m-m-fore.l\"/><use href=\"#cable-chest-press-m-m-fist.l\"/><use href=\"#cable-chest-press-m-m-upper.r\"/><use href=\"#cable-chest-press-m-m-elbowcap.r\"/><use href=\"#cable-chest-press-m-m-fore.r\"/><use href=\"#cable-chest-press-m-m-fist.r\"/><use href=\"#cable-chest-press-m-m-eq0\"/><use href=\"#cable-chest-press-m-m-eq1\"/><use href=\"#cable-chest-press-m-m-eq2\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MA*y1U*rL_WiHU3\"/><path class=\"leader m\" d=\"~M_wJ1_WtL0-ye\"/></g>\n<g class=\"plate-zoom\" data-view=\"mistake\" data-k=\"4\" data-c=\"270 232\" data-src=\"224.68 153.42\"><defs><clipPath id=\"cable-chest-press-m-zclip\"><circle cx=\"270\" cy=\"232\" r=\"52\"/></clipPath></defs><circle class=\"pz-src\" cx=\"224.68\" cy=\"153.42\" r=\"13\"/><path class=\"pz-link\" d=\"~M_AK1FBw1LHP2FI4\"/><circle class=\"pz-bg\" cx=\"270\" cy=\"232\" r=\"52\"/><g class=\"pz-in\" clip-path=\"url(#cable-chest-press-m-zclip)\">\n  <defs><pattern id=\"cable-chest-press-m-z-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"cable-chest-press-m-z-st-upper.r\" d=\"~#F12NwdUYG1EWaEWE1*hEhotHJ3HK2X4GkV2-9XH1Ex2)v-N2XS1)G1GT2.gzF2.txap.kryw3y!2nuIkOe*K2SjWI1NI3AB2H-1WR3wn00000000002000000010000200210100020000000000001000000000010100000000000000000000\"/><path id=\"cable-chest-press-m-z-st-elbowcap.r\" d=\"~~WJw1wWV1_J40\"/><path id=\"cable-chest-press-m-z-st-fore.r\" d=\"~#F12JyB1(F_1TEy1Oy_1Kx1X4!5K3UH4Im.uIc.7*5X.2Y3TU1Go.J1_2GR1JuO.2N7x7!6Bt(fJJ4P5A6U2Ow1!8zk!G1YP2DB1WA2z4WI2VN100020000200010010000100001000000000000022000010011100010012000000101011210000020\"/><path id=\"cable-chest-press-m-z-st-fist.r\" d=\"~~_Dw2(YT1ww40\"/><path id=\"cable-chest-press-m-z-e-thigh.l\" d=\"~#F12(G7Aw_2OR7OzU2R1TO1)4hzgW_7NrEs_cEeNz1-R6y!1KV2S9EP2*B1zx3FfGU6)8.g)j)x1XI1NX7w5iYcXK1BW3.*1VH3!X4zhWN4Sz2_J500000101012101000000000000010112000200010121000020022020001200000112100020000000\"/><path id=\"cable-chest-press-m-z-e-kneecap.l\" d=\"~~NJ5N-I4DT52\"/><path id=\"cable-chest-press-m-z-e-shank.l\" d=\"M30.48 701C24.22 707.59 18.29 718.69 13.38 726.04C8.48 733.39 5.04 738.69 1.05 745.1C-2.95 751.52 -3.83 751.99 -10.6 764.56C-17.37 777.13 -30.88 802.29 -39.56 820.54C-48.24 838.79 -55.45 856.43 -62.7 874.05C-69.95 891.67 -79.47 915.25 -83.06 926.24C-86.64 937.24 -85.23 936.32 -84.21 940.05C-83.2 943.77 -80.02 946.86 -76.97 948.6C-73.93 950.35 -69.66 951.52 -65.93 950.51C-62.2 949.49 -62.28 951.18 -54.62 942.52C-46.95 933.85 -31.45 913.69 -19.93 898.52C-8.42 883.34 3.14 868.19 14.47 851.46C25.8 834.72 40.65 810.33 48.06 798.12C55.47 785.92 55.42 784.92 58.93 778.23C62.44 771.53 65.26 765.89 69.11 757.93C72.96 749.98 79.53 739.24 82.04 730.5C84.54 721.76 85.96 712.24 84.13 705.49C82.29 698.73 76.53 693.14 71.01 689.98C65.49 686.82 57.74 684.69 50.99 686.53C44.24 688.37 36.75 694.42 30.48 701Z\"/><path id=\"cable-chest-press-m-z-e-foot.l\" d=\"M-87.27 911.86C-95.29 914.59 -96.14 925.17 -98.53 932.33C-100.92 939.5 -102.46 948.2 -101.61 954.86C-100.75 961.52 -98.87 969.02 -93.41 972.27C-87.95 975.51 -86.59 973.97 -68.84 974.31C-51.09 974.66 -6.03 974.83 13.09 974.31C32.2 973.8 39.03 973.12 45.85 971.24C52.68 969.37 53.88 965.78 54.05 963.05C54.22 960.32 53.71 957.08 46.88 954.86C40.05 952.64 25.54 952.81 13.09 949.74C0.63 946.67 -17.29 942.06 -27.88 936.43C-38.46 930.8 -40.51 920.05 -50.4 915.95C-60.3 911.86 -79.25 909.13 -87.27 911.86Z\"/><path id=\"cable-chest-press-m-z-e-shcap.l\" d=\"~~(_aYAB1ww60\"/><path id=\"cable-chest-press-m-z-e-upper.l\" d=\"~#F12WHfU(H1)zbXXG1Ox1RacE1DX5_B1Ijzi.9T8KH4V.1K(1X-1X)1RgTS2ykxW4BfXcW2XpJ6NS5DY19D1Ky1)6*mw*1yV2WN2(W2UmWP3Ir10100000010000000101001012001012000000101200202000000000001002002000011010000000\"/><path id=\"cable-chest-press-m-z-e-elbowcap.l\" d=\"~~HYO1JHN1_J40\"/><path id=\"cable-chest-press-m-z-e-fore.l\" d=\"~#F12PPT1A!S1TzP1TwS1TE1Rc_7.1DK5Ha-y1BjE8X7Rx4xkXN1Gy1OJ1G6IW1wkxy4TgxaD5.D1Y8JG5yD1(6y4OG1y1-6wF1UE2UU1FA2U9JT2Tu20010002000100000020001010100101000001101100000100002000000000000112000020020000\"/><path id=\"cable-chest-press-m-z-e-fist.l\" d=\"~~HXW2(YT1ww40\"/><path id=\"cable-chest-press-m-z-e-head\" d=\"M86.23 -14.6C95.45 -13.92 110.12 -12.55 119 -8.46C127.87 -4.36 134.7 2.81 139.48 9.98C144.26 17.14 146.14 26.7 147.67 34.55C149.21 42.4 148.7 49.06 148.7 57.08C148.7 65.1 148.53 75 147.67 82.68C146.82 90.36 145.8 97.53 143.58 103.16C141.36 108.79 139.31 114.43 134.36 116.47C129.41 118.52 120.19 117.16 113.88 115.45C107.56 113.74 102.44 110.33 96.47 106.23C90.5 102.14 86.23 95.99 78.04 90.87C69.85 85.75 55.17 81.83 47.32 75.51C39.47 69.2 34.01 61.18 30.93 52.98C27.86 44.79 27.35 34.89 28.89 26.36C30.42 17.83 34.35 8.27 40.15 1.78C45.95 -4.7 56.02 -9.82 63.7 -12.55C71.38 -15.28 77.01 -15.28 86.23 -14.6Z\"/><path id=\"cable-chest-press-m-z-e-torso\" d=\"~#_12(_aYAgGxczIaKD1Tp-c0ND1ND2JD1SpDT1ww2Wp0Vp))2R-2)vET1Djyw2zjDT2VpS-2))1ND2ID2DjID1)v))1-J3.J4XJ1XJ3Tp0KD10FT1ww2Ycww1BT1)v))1(vRpHT2SpPpFT1XJ1Ycww1-Jaww400001110000000010000000021100000001000000200010000000200020000000000220010000000000010000000010022010000000010000000\"/><path id=\"cable-chest-press-m-z-e-thigh.r\" d=\"~#F12NP8U*)2-B5.x.2VtBB1I4N2!F4_S6A5BE1W1)i.w3O*5.2EF3EF1BD2OY2EX1TS3GT5EhB8IA1GfYP3Uw7H4R2zhIJ1Vz4ylD5P-5PE2W!3N*4Dy310111100100000011000100000020001010000110101211000020001000000002022000020200000\"/><path id=\"cable-chest-press-m-z-e-kneecap.r\" d=\"~~STz1yVB4DT52\"/><path id=\"cable-chest-press-m-z-e-shank.r\" d=\"~#F12PNz1JID4XDz1)Kw4U1-O1!4hUR1WX7wkzy1(8*gxO1zF8PmT-1-5RO1Rz1TS1GhVI8.cIeKrGs(aJ!7*4i*c*K1EK1PU1VF1NF3JaDW2Sw2W.200210100000020200002000002000010100120000000100002000010001012000100001101000002\"/><path id=\"cable-chest-press-m-z-e-foot.r\" d=\"~#o2(PI1AzS5IXK1BzN5FT1!cJD2)vND3xw3JDbXcBT9BjT-4)v))20ID5Dj-J1BT1DT3-J1R-2ND3100200000001000002020000020000002000000000000000\"/><path id=\"cable-chest-press-m-z-e-shcap.r\" d=\"^128\"/><path id=\"cable-chest-press-m-z-e-upper.r\" d=\"^129\"/><path id=\"cable-chest-press-m-z-e-elbowcap.r\" d=\"^130\"/><path id=\"cable-chest-press-m-z-e-fore.r\" d=\"^131\"/><path id=\"cable-chest-press-m-z-e-fist.r\" d=\"^132\"/><path id=\"cable-chest-press-m-z-m-upper.l\" d=\"~#F12wWfDxI1VHb)xH1Vy1V88E1S!5Hr.k)gTa)7IS4BU1.x2-V1Rw2XcGR2ypE.4)6-cN3-p_7(Y5(K19F1Gz1x5XgY(1U-2NG2FY2HhYN3zy100101000010020000010000101001021000000000200000000000010100000200100000020000000\"/><path id=\"cable-chest-press-m-z-m-elbowcap.l\" d=\"~~y*P1UGJ1_J40\"/><path id=\"cable-chest-press-m-z-m-fore.l\" d=\"~#F12wNU1D_P1EyR1E-O1xE1Oe(7R1yK5Aj*x1)k*7x8zx4Vq)J1TA1xJ1O8IX1HhXx4BnIaU4IE1_6!E5SN1Y6J4TG1x1K8YE1wB2AY1Uz2wd_U2Oq00000000001000000000100000000000200002002020000101200000000100020000220001000100\"/><path id=\"cable-chest-press-m-z-m-fist.l\" d=\"~~HWX2AWT1ww40\"/><path id=\"cable-chest-press-m-z-m-upper.r\" d=\"^139\"/><path id=\"cable-chest-press-m-z-m-elbowcap.r\" d=\"^140\"/><path id=\"cable-chest-press-m-z-m-fore.r\" d=\"^141\"/><path id=\"cable-chest-press-m-z-m-fist.r\" d=\"^142\"/><path id=\"cable-chest-press-m-z-m-eq0\" d=\"M-526.43 584.91L-397.7 584.91L-397.7 672.68L-526.43 672.68Z\"/><path id=\"cable-chest-press-m-z-m-eq1\" d=\"~My-_2NFJ1LP_10LO_1N.eLO_1K.eZ\"/><path id=\"cable-chest-press-m-z-m-eq2\" d=\"~MHW.2NFJ1LVKb!K7LJ.m9Z\"/><path id=\"cable-chest-press-m-z-mf-head\" d=\"^133\"/><path id=\"cable-chest-press-m-z-mf-torso\" d=\"^134\"/><path id=\"cable-chest-press-m-z-mf-thigh.l\" d=\"^124\"/><path id=\"cable-chest-press-m-z-mf-kneecap.l\" d=\"^125\"/><path id=\"cable-chest-press-m-z-mf-shank.l\" d=\"^126\"/><path id=\"cable-chest-press-m-z-mf-foot.l\" d=\"^127\"/><path id=\"cable-chest-press-m-z-mf-shcap.l\" d=\"^128\"/><path id=\"cable-chest-press-m-z-mf-thigh.r\" d=\"^135\"/><path id=\"cable-chest-press-m-z-mf-kneecap.r\" d=\"^136\"/><path id=\"cable-chest-press-m-z-mf-shank.r\" d=\"^137\"/><path id=\"cable-chest-press-m-z-mf-foot.r\" d=\"^138\"/><path id=\"cable-chest-press-m-z-mf-shcap.r\" d=\"^128\"/><path id=\"cable-chest-press-m-z-mo-0\" d=\"^133\"/><path id=\"cable-chest-press-m-z-mo-1\" d=\"^134\"/><path id=\"cable-chest-press-m-z-mo-2\" d=\"^124\"/><path id=\"cable-chest-press-m-z-mo-3\" d=\"^125\"/><path id=\"cable-chest-press-m-z-mo-4\" d=\"^126\"/><path id=\"cable-chest-press-m-z-mo-5\" d=\"^127\"/><path id=\"cable-chest-press-m-z-mo-6\" d=\"^128\"/><path id=\"cable-chest-press-m-z-mo-7\" d=\"^129\"/><path id=\"cable-chest-press-m-z-mo-8\" d=\"^130\"/><path id=\"cable-chest-press-m-z-mo-9\" d=\"^131\"/><path id=\"cable-chest-press-m-z-mo-10\" d=\"^132\"/><path id=\"cable-chest-press-m-z-mo-11\" d=\"^135\"/><path id=\"cable-chest-press-m-z-mo-12\" d=\"^136\"/><path id=\"cable-chest-press-m-z-mo-13\" d=\"^137\"/><path id=\"cable-chest-press-m-z-mo-14\" d=\"^138\"/><path id=\"cable-chest-press-m-z-mo-15\" d=\"^128\"/><path id=\"cable-chest-press-m-z-mo-16\" d=\"^129\"/><path id=\"cable-chest-press-m-z-mo-17\" d=\"^130\"/><path id=\"cable-chest-press-m-z-mo-18\" d=\"^131\"/><path id=\"cable-chest-press-m-z-mo-19\" d=\"^132\"/><path id=\"cable-chest-press-m-z-mo-20\" d=\"M-532.28 973.32L-532.28 -253.52Q-532.28 -254.52 -533.28 -254.52L-560.54 -254.52Q-561.54 -254.52 -561.54 -253.52L-561.54 973.32Q-561.54 974.32 -560.54 974.32L-533.28 974.32Q-532.28 974.32 -532.28 973.32Z\"/><path id=\"cable-chest-press-m-z-mo-21\" d=\"M-362.59 973.32L-362.59 -253.52Q-362.59 -254.52 -363.59 -254.52L-390.84 -254.52Q-391.84 -254.52 -391.84 -253.52L-391.84 973.32Q-391.84 974.32 -390.84 974.32L-363.59 974.32Q-362.59 974.32 -362.59 973.32Z\"/><path id=\"cable-chest-press-m-z-mo-22\" d=\"M-560.54 -219.41L-363.59 -219.41Q-362.59 -219.41 -362.59 -220.41L-362.59 -253.52Q-362.59 -254.52 -363.59 -254.52L-560.54 -254.52Q-561.54 -254.52 -561.54 -253.52L-561.54 -220.41Q-561.54 -219.41 -560.54 -219.41Z\"/><path id=\"cable-chest-press-m-z-mo-23\" d=\"M-595.65 974.32L-328.48 974.32Q-327.48 974.32 -327.48 973.32L-327.48 961.28Q-327.48 960.28 -328.48 960.28L-595.65 960.28Q-596.65 960.28 -596.65 961.28L-596.65 973.32Q-596.65 974.32 -595.65 974.32Z\"/><path id=\"cable-chest-press-m-z-mo-24\" d=\"M-525.43 974.32L-398.7 974.32Q-397.7 974.32 -397.7 973.32L-397.7 940.21Q-397.7 939.21 -398.7 939.21L-525.43 939.21Q-526.43 939.21 -526.43 940.21L-526.43 973.32Q-526.43 974.32 -525.43 974.32Z\"/><path id=\"cable-chest-press-m-z-mo-25\" d=\"M-526.43 792.92L-397.7 792.92L-397.7 939.21L-526.43 939.21Z\"/><path id=\"cable-chest-press-m-z-mo-26\" d=\"M-526.43 589.87L-397.7 589.87L-397.7 677.64L-526.43 677.64Z\"/><path id=\"cable-chest-press-m-z-mo-27\" d=\"M-388.92 265.11a26.33 26.33 0 1 0 52.66 0a26.33 26.33 0 1 0 -52.66 0Z\"/><path id=\"cable-chest-press-m-z-mo-28\" d=\"M-363.59 265.11a1 1 0 1 0 2 0a1 1 0 1 0 -2 0Z\"/><path id=\"cable-chest-press-m-z-mo-29\" d=\"M-482.54 -201.85a20.48 20.48 0 1 0 40.96 0a20.48 20.48 0 1 0 -40.96 0Z\"/><path id=\"cable-chest-press-m-z-mo-30\" d=\"M-463.06 -201.85a1 1 0 1 0 2 0a1 1 0 1 0 -2 0Z\"/><path id=\"cable-chest-press-m-z-mo-31\" d=\"~My_-2DIJ1LP_10LO_1N.eLO_1K.eZ\"/><path id=\"cable-chest-press-m-z-mo-32\" d=\"~MHX_2DIJ1LXKbYK7LP.m1Z\"/></defs>\n  \n  <path class=\"floorline\" d=\"M-508.88 974.82H615.73\"/><path class=\"eq\" d=\"^146\"/><path class=\"eq\" d=\"^147\"/><path class=\"eq\" d=\"^148\"/><path class=\"eq\" d=\"^149\"/><path class=\"eq\" d=\"^150\"/><path class=\"eq-thin\" d=\"M-500.68 939.21L-500.68 500.34\"/><path class=\"eq-thin\" d=\"M-423.44 939.21L-423.44 500.34\"/><path class=\"eq\" d=\"^151\"/><path class=\"eq-thin\" d=\"M-526.43 924.58H-397.7M-526.43 909.95H-397.7M-526.43 895.32H-397.7M-526.43 880.69H-397.7M-526.43 866.06H-397.7M-526.43 851.44H-397.7M-526.43 836.81H-397.7M-526.43 822.18H-397.7M-526.43 807.55H-397.7\"/><path class=\"eq-solid\" d=\"^153\"/><path class=\"eq-pin\" d=\"^154\"/><path class=\"eq\" d=\"^155\"/><path class=\"eq-pin\" d=\"^156\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-m-z-st-upper.r\"/><use href=\"#cable-chest-press-m-z-st-elbowcap.r\"/><use href=\"#cable-chest-press-m-z-st-fore.r\"/><use href=\"#cable-chest-press-m-z-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-m-z-st-upper.r\"/><use href=\"#cable-chest-press-m-z-st-elbowcap.r\"/><use href=\"#cable-chest-press-m-z-st-fore.r\"/><use href=\"#cable-chest-press-m-z-st-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^152\"/><path class=\"eq-thin\" d=\"M-526.43 663.01H-397.7M-526.43 648.38H-397.7M-526.43 633.76H-397.7M-526.43 619.13H-397.7M-526.43 604.5H-397.7\"/><path class=\"eq-cable\" d=\"M-388.92 265.11L-388.92 -201.85M-462.06 -181.37L-462.06 589.87\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-m-z-e-thigh.l\"/><use href=\"#cable-chest-press-m-z-e-kneecap.l\"/><use href=\"#cable-chest-press-m-z-e-shank.l\"/><use href=\"#cable-chest-press-m-z-e-foot.l\"/><use href=\"#cable-chest-press-m-z-e-shcap.l\"/><use href=\"#cable-chest-press-m-z-e-upper.l\"/><use href=\"#cable-chest-press-m-z-e-elbowcap.l\"/><use href=\"#cable-chest-press-m-z-e-fore.l\"/><use href=\"#cable-chest-press-m-z-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-m-z-e-thigh.l\"/><use href=\"#cable-chest-press-m-z-e-kneecap.l\"/><use href=\"#cable-chest-press-m-z-e-shank.l\"/><use href=\"#cable-chest-press-m-z-e-foot.l\"/><use href=\"#cable-chest-press-m-z-e-shcap.l\"/><use href=\"#cable-chest-press-m-z-e-upper.l\"/><use href=\"#cable-chest-press-m-z-e-elbowcap.l\"/><use href=\"#cable-chest-press-m-z-e-fore.l\"/><use href=\"#cable-chest-press-m-z-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"M406.01 265.11L-361.68 291.42\"/><path class=\"eq\" d=\"^158\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-m-z-e-head\"/><use href=\"#cable-chest-press-m-z-e-torso\"/><use href=\"#cable-chest-press-m-z-e-thigh.r\"/><use href=\"#cable-chest-press-m-z-e-kneecap.r\"/><use href=\"#cable-chest-press-m-z-e-shank.r\"/><use href=\"#cable-chest-press-m-z-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-m-z-e-head\"/><use href=\"#cable-chest-press-m-z-e-torso\"/><use href=\"#cable-chest-press-m-z-e-thigh.r\"/><use href=\"#cable-chest-press-m-z-e-kneecap.r\"/><use href=\"#cable-chest-press-m-z-e-shank.r\"/><use href=\"#cable-chest-press-m-z-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^157\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-m-z-e-shcap.r\"/><use href=\"#cable-chest-press-m-z-e-upper.r\"/><use href=\"#cable-chest-press-m-z-e-elbowcap.r\"/><use href=\"#cable-chest-press-m-z-e-fore.r\"/><use href=\"#cable-chest-press-m-z-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-chest-press-m-z-e-shcap.r\"/><use href=\"#cable-chest-press-m-z-e-upper.r\"/><use href=\"#cable-chest-press-m-z-e-elbowcap.r\"/><use href=\"#cable-chest-press-m-z-e-fore.r\"/><use href=\"#cable-chest-press-m-z-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"86.23\" cy=\"190.2\" r=\"2.25\"/><circle class=\"joint\" cx=\"267.06\" cy=\"237.18\" r=\"2.25\"/><circle class=\"joint\" cx=\"86.23\" cy=\"466.69\" r=\"2.25\"/><circle class=\"joint\" cx=\"211\" cy=\"684.33\" r=\"2.25\"/></g><mask id=\"cable-chest-press-m-z-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#cable-chest-press-m-z-mf-head\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-mf-torso\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-mf-thigh.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-mf-kneecap.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-mf-shank.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-mf-foot.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-mf-shcap.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-m-upper.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-m-elbowcap.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-m-fore.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-m-fist.l\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-mf-thigh.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-mf-kneecap.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-mf-shank.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-mf-foot.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-mf-shcap.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-m-upper.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-m-elbowcap.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-m-fore.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-m-fist.r\" fill=\"#000\"/><use href=\"#cable-chest-press-m-z-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-chest-press-m-z-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#cable-chest-press-m-z-mmask)\"><g class=\"u-stroke\"><use href=\"#cable-chest-press-m-z-m-upper.l\"/><use href=\"#cable-chest-press-m-z-m-elbowcap.l\"/><use href=\"#cable-chest-press-m-z-m-fore.l\"/><use href=\"#cable-chest-press-m-z-m-fist.l\"/><use href=\"#cable-chest-press-m-z-m-upper.r\"/><use href=\"#cable-chest-press-m-z-m-elbowcap.r\"/><use href=\"#cable-chest-press-m-z-m-fore.r\"/><use href=\"#cable-chest-press-m-z-m-fist.r\"/><use href=\"#cable-chest-press-m-z-m-eq0\"/><use href=\"#cable-chest-press-m-z-m-eq1\"/><use href=\"#cable-chest-press-m-z-m-eq2\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~M(_gYAB1LJ.H2JRe\"/></g>\n</g><circle class=\"pz-ring\" cx=\"270\" cy=\"232\" r=\"52\"/></g></svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"cable-chest-press-m-lock\" data-key=\"lock\" data-cue=\"The elbows lock straight at the front of the press.\" class=\"plate-callout two m\" style=\"left:46.37%;top:11.17%\" aria-pressed=\"true\">Locked<br>elbows</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "stance",
        cues: [{ key: "stance", cue: "Stand with one foot in front of the other, feet planted." }, { key: "height", cue: "Bring the handles back to about nipple height, not the collarbone." }, { key: "spine", cue: "Brace your abs and glutes and keep your back from arching." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "lock",
        cues: [{ key: "lock", cue: "The elbows lock straight at the front of the press." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Locked elbows</b><span>The elbows lock straight at the front of the press.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: press 2 seconds, return 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div></div>",
      alt: "Cable chest press, side view. Standing in a staggered stance in front of a cable column, the lifter presses single handles from the nipple line straight ahead until the elbows are almost straight, body still.",
      mistakeAlt: "Cable Chest Press: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "push",
    "why": "D-SHIP-C3: the d-handle key lists cable_chest_press in GAPS (c3 names no bend direction); the grip copy carries c3 and c7.",
    "orientation": "neutral",
    "handle": "d-handle",
    "loadAxis": "along-forearm",
    "overBody": false,
    "width": {
      "text": "Handles just outside shoulder width, not much wider.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-cable-press",
          "bos-cable-press"
        ],
        "note": "c3, c7"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "push-default"
        ],
        "note": "card grip.thumb: \"Not given by any cable press source read (push archetype default)\"; golden B's push default, not a card claim, never shown"
      }
    },
    "contact": "heel",
    "wrist": {
      "ext": [
        0,
        15
      ],
      "limitText": "Keep your wrists lined up with your elbows.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "CONVENTION"
        ],
        "sources": [
          "nfpt-cable-press",
          "ga-push-heel"
        ],
        "note": "card c3. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number."
      }
    },
    "faults": [
      {
        "key": "wrist-bent",
        "label": "Wrist bent",
        "pose": {},
        "markers": [],
        "alt": "Wrist bent out of line with the elbow."
      }
    ],
    "gripLine": "Single handles, neutral grip, just outside shoulder width. Press straight ahead, pushing through the palms.",
    "cue": "Push through the palms."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set both pulleys at chest height with single handles.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bos-cable-press",
          "motra-cable-press"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Stand a foot or two from the cables, a handle per hand.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bos-cable-press",
          "motra-cable-press"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Step into a staggered stance, feet planted.",
      "zoom": "cable-press-stance",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-cable-press",
          "bos-cable-press"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "grip",
      "text": "Handles just outside shoulders, elbows just below 90 degrees, wrists over elbows.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-cable-press"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "brace",
      "text": "Brace your abs and glutes, spine neutral, shoulders down.",
      "zoom": "cable-press-stance",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-cable-press",
          "bos-cable-press"
        ],
        "note": "c6, c7"
      }
    }
  ],
  posture: [
    {
      "key": "stance",
      "label": "Staggered stance",
      "detail": "Staggered stance, feet planted.",
      "anchor": {
        "pose": "start",
        "at": "toe.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-cable-press",
          "bos-cable-press"
        ],
        "note": "c2"
      }
    },
    {
      "key": "spine",
      "label": "Spine neutral",
      "detail": "Spine neutral, abs and glutes braced.",
      "anchor": {
        "pose": "start",
        "at": "lumbar"
      },
      "zoom": "cable-press-stance",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-cable-press",
          "bos-cable-press"
        ],
        "note": "c6"
      }
    },
    {
      "key": "height",
      "label": "Handles at nipples",
      "detail": "Handles back to about nipple height.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-cable-press"
        ],
        "note": "c4"
      }
    },
    {
      "key": "wrists",
      "label": "Wrists over elbows",
      "detail": "Wrists in line with the elbows.",
      "anchor": {
        "pose": "start",
        "at": "wrist.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-cable-press"
        ],
        "note": "c3"
      }
    },
    {
      "key": "shoulders",
      "label": "Shoulders down",
      "detail": "Shoulders down, not shrugged.",
      "anchor": {
        "pose": "start",
        "at": "shoulder.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-cable-press",
          "bos-cable-press"
        ],
        "note": "c7"
      }
    },
    {
      "key": "lockout",
      "label": "No lockout",
      "detail": "Elbows almost straight at the front, not locked.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-cable-press"
        ],
        "note": "c5"
      }
    }
  ],
  zooms: [
    {
      "key": "cable-press-stance",
      "chip": "Back",
      "heading": "Back position",
      "kind": "posture",
      "feelRow": "lower-back"
    }
  ],
  chips: [
    "cable-press-stance",
    "feel"
  ],
  copy: {
    "setupLine": "Pulleys at chest height, single handles. Staggered stance, a foot or two in front.",
    "mistakeLine": "Keep your spine neutral. Press out without locking the elbows.",
    "cueLine": "Push through the palms."
  },
  mistakes: [
    {
      "key": "lock",
      "title": "Locking the elbows",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-cable-press",
          "nfpt-cable-press"
        ],
        "note": "c17, c5"
      },
      "fix": "Extend your arms without locking the elbows."
    },
    {
      "key": "arch",
      "title": "Arching the lower back",
      "zoom": "cable-press-stance",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-cable-press",
          "bos-cable-press"
        ],
        "note": "c6"
      },
      "fix": "Keep your spine neutral and brace your abs."
    },
    {
      "key": "jerk",
      "title": "Jerking the body, too heavy",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-cable-press",
          "bos-cable-press"
        ],
        "note": "c7, c8"
      },
      "fix": "Choose a weight you can press with the body still."
    }
  ],
  risks: [
    {
      "key": "shoulder",
      "text": "Wide grips and flared elbows stress the shoulder, a common injury site in lifting.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "nfpt-cable-press",
          "bos-cable-press",
          "kolber2010"
        ],
        "note": "c7, c13"
      }
    },
    {
      "key": "heavy",
      "text": "Too much weight costs form and raises injury risk. Add weight in small steps.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-cable-press",
          "bos-cable-press",
          "acsm2009"
        ],
        "note": "c7, c14"
      }
    }
  ],
  riskFlags: [
    "shoulder",
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
    "bos-cable-press",
    "motra-cable-press",
    "nfpt-cable-press",
    "sl-cable-press",
    "santana2007",
    "calatayud2014",
    "schutz2022",
    "kolber2010",
    "acsm2009",
    "ga-push-heel",
    "push-default",
    "nhs-shoulder-pain",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/cable_chest_press.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

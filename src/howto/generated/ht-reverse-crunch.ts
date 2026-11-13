// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=6063c90b5c1751314d329a4db5edffd1cc0f04c55e5053210a25b8039b6c5c50
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_reverse_crunch",
  name: "Reverse Crunch",
  hashes: { inputsSha256: "6063c90b5c1751314d329a4db5edffd1cc0f04c55e5053210a25b8039b6c5c50", golden: "fa2976a8d5dff6c3a3797c9f469695b493e65b4928dfbac848b0113a5ecfff83" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"reverse-crunch-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"reverse-crunch-n-st-thigh.l\" d=\"~#F12wOG1YR*1TTG1*I)1D2PeU10I4TK2I7W9I3_4B3!x2EfNs0wpFfNsD3!x2J3_4N7W9F4TK2R10B2PeSD1WeDrTS10OJ1BrTS120010000200000000101011010012100000101000001010100001010000001000000010000110000\"/><path id=\"reverse-crunch-n-st-kneecap.l\" d=\"~~PYA1NJN1NX12\"/><path id=\"reverse-crunch-n-st-shank.l\" d=\"~#F12(OD1!BP1KVA1BxP1VeG22O1(K2)5V9K7*4K3*S2W4-gx9.e0-gy9*S2T4*4J3V9J7(K2y62S1VeD2Pe(fSuHg!q2SuKg02000022000200200100101002000000020000001010000020000002200001000001000000000000\"/><path id=\"reverse-crunch-n-st-foot.l\" d=\"~#o2WIU1APO1xAT1I_N1(3Xf.9.lXtVv*3.N3*5y)2*9PO12Yt!5PT1-f!d.dVz1YvYr100210000110001200010100010000000000012101012000\"/><path id=\"reverse-crunch-n-st-torso\" d=\"~#_12W-gyW)1O)eI*)1*nWiY5HoJs.9P9Va_l.cD1-7Epw1XbU2P7Uf*aRhEe.mIqTlTqIfxdX2RgYeIx1_I1.symYI1u*1OjKkTeJaR2xcJew7(kJoPb-dE2V5w5(uIbWD2WU201000000000000001010100000000000012002101200200200200000010200200021011000010001000101001010000000100212000200101001\"/><path id=\"reverse-crunch-n-st-thigh.r\" d=\"^0\"/><path id=\"reverse-crunch-n-st-kneecap.r\" d=\"^1\"/><path id=\"reverse-crunch-n-st-shank.r\" d=\"^2\"/><path id=\"reverse-crunch-n-st-foot.r\" d=\"^3\"/><path id=\"reverse-crunch-n-g0-thigh.r\" d=\"~#F12JKF1SU.1X*F1VJ*1D5_dP17.jEI2G5ybG2J5DaAx2B9(uw5SoYkWoNg!)1F4y4F9w8Ob*J2R1aqYeYF1N6Hg)W1*8RI1-A1xJ101010002200120000000000010101010000101022000000020000010100000010110100020010100\"/><path id=\"reverse-crunch-n-g0-kneecap.r\" d=\"~~UWw1NJK1NX12\"/><path id=\"reverse-crunch-n-g0-shank.r\" d=\"~#F12W-y1YAO1K)w1xJO1-eq9O1AI2Vl)aG5O5G2EP2HlIiK5Oew3VeFcBS2Fcx4H4)7D9PK2-9cN1.dD5JhUcDx1!9JqK5UqBm21000200001101010110020200001202000000000000002000000020010110000000102000000001\"/><path id=\"reverse-crunch-n-g0-foot.r\" d=\"~#o2!EP1WVI1V!N1IFI1mGgxeGjRz1xpGq-I3NdH(23SP1y6ytDgFR1Vc_g-kzw1WA1_k000101010111000000000100010001101002000000020001\"/><path id=\"reverse-crunch-n-g1-thigh.r\" d=\"~#F12_EE1yY-1zzF1VI.1_7PcJ1lTy1OB2)2YbB1!5AnU*1V2Dw1!9wnHpyk(sA.1y5D3Ua(5-q)F2I1kW3FeDG1.1(4B-1Th.F1)J1Xz120000001010002011010120000010000000101000002002000000200220010100000000000000100\"/><path id=\"reverse-crunch-n-g1-kneecap.r\" d=\"~~_YsAwK1NX12\"/><path id=\"reverse-crunch-n-g1-shank.r\" d=\"~#F12yEv!UN1OOtXEO1IeW3hI1DB2KA1.b*2-5B1GH2AB1xjT1Td_5*byf*K2Ssz3y5x6UayH2GpgJ1Kc!7Pj_8Uy1w3UoVaUlzr11010000000101010100000002000000000200000000001011210100112100001000020000002001\"/><path id=\"reverse-crunch-n-g1-foot.r\" d=\"~#o2!VI1ARF1.FH1-JF1T2zgXhxg-E1IhRO1EA3Dw1U-2W9UO1!bFrYp(J1)8wj.qBrAF1!c010000000000000000000000000021001000200200000101\"/><path id=\"reverse-crunch-n-e-thigh.l\" d=\"~#F12W(B1D*X1.zE1EH-1DaWaD1t)O1x*1fAc0(5Dz1WX1Y3Aw1NeNkYsUeJF1wU1S5A2UbU3xG1)x2B1qN6FdyF1Ba-6)Y1OpOA1GT1-p00000210000220010021010000100020000200012002000010120000011012101010000000100000\"/><path id=\"reverse-crunch-n-e-kneecap.l\" d=\"~~wzpDDK1NX12\"/><path id=\"reverse-crunch-n-e-shank.l\" d=\"~#F12J.rFVN1XFq)SO1IdS6pE1N!1VR1Gcd.50Gx2JT1)iF2zcP8T8yhRD2_I1z2S5V3UbJz2XE1qF1VaFawlW4Jy1z4ymIfUf)u00100000000000001000201010000020000020000010002000200010101000000011000000002101\"/><path id=\"reverse-crunch-n-e-foot.l\" d=\"~#o2J_D1!AD1KKB1XGD1-5EfTkBcOH1.8*y2TY2YR1FR2AjWJ1whHoNy1_D1)4Nk-vEl_G1P4000000000000001010210010020010000000010000001110\"/><path id=\"reverse-crunch-n-e-shcap.l\" d=\"~~yElSI*1N.10\"/><path id=\"reverse-crunch-n-e-upper.l\" d=\"~#F12AXm!B)1*IlG!(1XaT22bN_1H8K6E5G3K2KK1zgKkRg*j*3BpY7BP1x2.3y1x8N2J-1Ae3c*aR1x5PjYrUmFrJ5Hy1Va00200000000120210000100010100201011001101020000101002101000000200011001000002100\"/><path id=\"reverse-crunch-n-e-elbowcap.l\" d=\"~~Swx1!R)1SI12\"/><path id=\"reverse-crunch-n-e-fore.l\" d=\"~#F12Pzy1S(w2Byx1GUw2)bO4J2dWV1(5RaK6K2R2)E1G8.dIbVdT2zhH5EF1E7B3J1BcA2(T1PeA2J1.cbT2HcHlJh(kA4HqB800220000000000121000002000000010100000100001000010101020000000001010000002000100\"/><path id=\"reverse-crunch-n-e-palm.l\" d=\"~#o2yFI1HIw2RSG1O-)1Wa-bXax2Bj(5Vp.4zh1Vpw1Bj0Xa*5Wa0AI1VtYk1000000010120000200010100000020000000000000010100\"/><path id=\"reverse-crunch-n-e-head\" d=\"~#w12JUaP_)1R*aG_x2Au_e(iUioNe!6!1K7Y8*9!dBjSt*gfTaY5W7NmzmXlIgVnT4TpAb*sAn-50010000120200002000100000000000002021000001000200000100001000000\"/><path id=\"reverse-crunch-n-e-torso\" d=\"~#_12W-gyW)1O)eI*)1*nWiY5HoJs.9yfzaYk)uB2IhzuP1xh.7PbH9xjz8XoOa)x1T2VuW2BcF5z5SlE2wX1xbYy1Wx2xO1Gn-gTnO9O2-3S3w5)iUhJoPb-dE2V5w5(uIbWD2WU201000000000000001100000000220000010101020000200020000001000000001010000101010000000101001000100000100212000200101001\"/><path id=\"reverse-crunch-n-e-thigh.r\" d=\"^13\"/><path id=\"reverse-crunch-n-e-kneecap.r\" d=\"^14\"/><path id=\"reverse-crunch-n-e-shank.r\" d=\"^15\"/><path id=\"reverse-crunch-n-e-foot.r\" d=\"^16\"/><path id=\"reverse-crunch-n-e-shcap.r\" d=\"^17\"/><path id=\"reverse-crunch-n-e-upper.r\" d=\"^18\"/><path id=\"reverse-crunch-n-e-elbowcap.r\" d=\"^19\"/><path id=\"reverse-crunch-n-e-fore.r\" d=\"^20\"/><path id=\"reverse-crunch-n-e-palm.r\" d=\"^21\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#reverse-crunch-n-dots)\"/>\n  <path class=\"floorline\" d=\"M16 339.5H342\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#reverse-crunch-n-st-thigh.l\"/><use href=\"#reverse-crunch-n-st-kneecap.l\"/><use href=\"#reverse-crunch-n-st-shank.l\"/><use href=\"#reverse-crunch-n-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#reverse-crunch-n-st-thigh.l\"/><use href=\"#reverse-crunch-n-st-kneecap.l\"/><use href=\"#reverse-crunch-n-st-shank.l\"/><use href=\"#reverse-crunch-n-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-crunch-n-st-torso\"/><use href=\"#reverse-crunch-n-st-thigh.r\"/><use href=\"#reverse-crunch-n-st-kneecap.r\"/><use href=\"#reverse-crunch-n-st-shank.r\"/><use href=\"#reverse-crunch-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-crunch-n-st-torso\"/><use href=\"#reverse-crunch-n-st-thigh.r\"/><use href=\"#reverse-crunch-n-st-kneecap.r\"/><use href=\"#reverse-crunch-n-st-shank.r\"/><use href=\"#reverse-crunch-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-crunch-n-g0-thigh.r\"/><use href=\"#reverse-crunch-n-g0-kneecap.r\"/><use href=\"#reverse-crunch-n-g0-shank.r\"/><use href=\"#reverse-crunch-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-crunch-n-g0-thigh.r\"/><use href=\"#reverse-crunch-n-g0-kneecap.r\"/><use href=\"#reverse-crunch-n-g0-shank.r\"/><use href=\"#reverse-crunch-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-crunch-n-g1-thigh.r\"/><use href=\"#reverse-crunch-n-g1-kneecap.r\"/><use href=\"#reverse-crunch-n-g1-shank.r\"/><use href=\"#reverse-crunch-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-crunch-n-g1-thigh.r\"/><use href=\"#reverse-crunch-n-g1-kneecap.r\"/><use href=\"#reverse-crunch-n-g1-shank.r\"/><use href=\"#reverse-crunch-n-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#reverse-crunch-n-e-thigh.l\"/><use href=\"#reverse-crunch-n-e-kneecap.l\"/><use href=\"#reverse-crunch-n-e-shank.l\"/><use href=\"#reverse-crunch-n-e-foot.l\"/><use href=\"#reverse-crunch-n-e-shcap.l\"/><use href=\"#reverse-crunch-n-e-upper.l\"/><use href=\"#reverse-crunch-n-e-elbowcap.l\"/><use href=\"#reverse-crunch-n-e-fore.l\"/><use href=\"#reverse-crunch-n-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#reverse-crunch-n-e-thigh.l\"/><use href=\"#reverse-crunch-n-e-kneecap.l\"/><use href=\"#reverse-crunch-n-e-shank.l\"/><use href=\"#reverse-crunch-n-e-foot.l\"/><use href=\"#reverse-crunch-n-e-shcap.l\"/><use href=\"#reverse-crunch-n-e-upper.l\"/><use href=\"#reverse-crunch-n-e-elbowcap.l\"/><use href=\"#reverse-crunch-n-e-fore.l\"/><use href=\"#reverse-crunch-n-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-crunch-n-e-head\"/><use href=\"#reverse-crunch-n-e-torso\"/><use href=\"#reverse-crunch-n-e-thigh.r\"/><use href=\"#reverse-crunch-n-e-kneecap.r\"/><use href=\"#reverse-crunch-n-e-shank.r\"/><use href=\"#reverse-crunch-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-crunch-n-e-head\"/><use href=\"#reverse-crunch-n-e-torso\"/><use href=\"#reverse-crunch-n-e-thigh.r\"/><use href=\"#reverse-crunch-n-e-kneecap.r\"/><use href=\"#reverse-crunch-n-e-shank.r\"/><use href=\"#reverse-crunch-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-crunch-n-e-shcap.r\"/><use href=\"#reverse-crunch-n-e-upper.r\"/><use href=\"#reverse-crunch-n-e-elbowcap.r\"/><use href=\"#reverse-crunch-n-e-fore.r\"/><use href=\"#reverse-crunch-n-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-crunch-n-e-shcap.r\"/><use href=\"#reverse-crunch-n-e-upper.r\"/><use href=\"#reverse-crunch-n-e-elbowcap.r\"/><use href=\"#reverse-crunch-n-e-fore.r\"/><use href=\"#reverse-crunch-n-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"118.16\" cy=\"314.17\" r=\"2.25\"/><circle class=\"joint\" cx=\"176.03\" cy=\"325.42\" r=\"2.25\"/><circle class=\"joint\" cx=\"181.89\" cy=\"295\" r=\"2.25\"/><circle class=\"joint\" cx=\"137.35\" cy=\"231.39\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#N20PXB1(AN1V)B1GEN12402122204022212240202221422022204000422042004022222020420042202242004004402000200001011110000200220002000010000000000000000001200000001010000001000110000000000000100000000000101200000000200000010021200000002000000100010012000010111\"/><path class=\"arrow\" d=\"~MywrHAK1LDA1BlLVx1U_1Z\"/></g><path class=\"leader\" d=\"M131.35 228.39L115.42 202H105.42\"/><circle class=\"anchor\" cx=\"131.35\" cy=\"228.39\" r=\"1.5\"/><path class=\"leader\" d=\"M202.94 309.35L251 258H261\"/><circle class=\"anchor\" cx=\"202.94\" cy=\"309.35\" r=\"1.5\"/><path class=\"leader\" d=\"M165.97 330.85L207 318H217\"/><circle class=\"anchor\" cx=\"165.97\" cy=\"330.85\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"reverse-crunch-n-knees\" data-key=\"knees\" data-cue=\"Keep the knee angle at 90 degrees the whole rep.\" class=\"plate-callout\" style=\"left:5.59%;top:50.28%\" aria-pressed=\"true\">Knees at 90</button><button type=\"button\" id=\"reverse-crunch-n-hips\" data-key=\"hips\" data-cue=\"Curl your hips and low back off the floor toward your ribs.\" class=\"plate-callout\" style=\"left:71.51%;top:65.92%\" aria-pressed=\"false\">Hips curl up</button><button type=\"button\" id=\"reverse-crunch-n-back\" data-key=\"back\" data-cue=\"Start with the low back flat on the floor, not arched.\" class=\"plate-callout\" style=\"left:59.22%;top:82.68%\" aria-pressed=\"false\">Back down</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"reverse-crunch-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"reverse-crunch-m-st-thigh.l\" d=\"^0\"/><path id=\"reverse-crunch-m-st-kneecap.l\" d=\"^1\"/><path id=\"reverse-crunch-m-st-shank.l\" d=\"^2\"/><path id=\"reverse-crunch-m-st-foot.l\" d=\"^3\"/><path id=\"reverse-crunch-m-st-torso\" d=\"^4\"/><path id=\"reverse-crunch-m-st-thigh.r\" d=\"^0\"/><path id=\"reverse-crunch-m-st-kneecap.r\" d=\"^1\"/><path id=\"reverse-crunch-m-st-shank.r\" d=\"^2\"/><path id=\"reverse-crunch-m-st-foot.r\" d=\"^3\"/><path id=\"reverse-crunch-m-g0-thigh.r\" d=\"^5\"/><path id=\"reverse-crunch-m-g0-kneecap.r\" d=\"^6\"/><path id=\"reverse-crunch-m-g0-shank.r\" d=\"^7\"/><path id=\"reverse-crunch-m-g0-foot.r\" d=\"^8\"/><path id=\"reverse-crunch-m-g1-thigh.r\" d=\"^9\"/><path id=\"reverse-crunch-m-g1-kneecap.r\" d=\"^10\"/><path id=\"reverse-crunch-m-g1-shank.r\" d=\"^11\"/><path id=\"reverse-crunch-m-g1-foot.r\" d=\"^12\"/><path id=\"reverse-crunch-m-e-thigh.l\" d=\"^13\"/><path id=\"reverse-crunch-m-e-kneecap.l\" d=\"^14\"/><path id=\"reverse-crunch-m-e-shank.l\" d=\"^15\"/><path id=\"reverse-crunch-m-e-foot.l\" d=\"^16\"/><path id=\"reverse-crunch-m-e-shcap.l\" d=\"^17\"/><path id=\"reverse-crunch-m-e-upper.l\" d=\"^18\"/><path id=\"reverse-crunch-m-e-elbowcap.l\" d=\"^19\"/><path id=\"reverse-crunch-m-e-fore.l\" d=\"^20\"/><path id=\"reverse-crunch-m-e-palm.l\" d=\"^21\"/><path id=\"reverse-crunch-m-e-head\" d=\"^22\"/><path id=\"reverse-crunch-m-e-torso\" d=\"^23\"/><path id=\"reverse-crunch-m-e-thigh.r\" d=\"^13\"/><path id=\"reverse-crunch-m-e-kneecap.r\" d=\"^14\"/><path id=\"reverse-crunch-m-e-shank.r\" d=\"^15\"/><path id=\"reverse-crunch-m-e-foot.r\" d=\"^16\"/><path id=\"reverse-crunch-m-e-shcap.r\" d=\"^17\"/><path id=\"reverse-crunch-m-e-upper.r\" d=\"^18\"/><path id=\"reverse-crunch-m-e-elbowcap.r\" d=\"^19\"/><path id=\"reverse-crunch-m-e-fore.r\" d=\"^20\"/><path id=\"reverse-crunch-m-e-palm.r\" d=\"^21\"/><path id=\"reverse-crunch-m-m-thigh.l\" d=\"~#F12JEB1_BX1X-D1IzY1DdP6uG1zy2)F1Y3Ubw2U5AU1FF1Pe!sSkHeyw1!3UX1Az1w60Dcfz*1xP1tF1WaFayy1Gn.pET1IA1Opx-1-610101101011000000200022001100020000200100101200000010100100002110100000000001010\"/><path id=\"reverse-crunch-m-m-kneecap.l\" d=\"~~_IlJ*P1NX12\"/><path id=\"reverse-crunch-m-m-shank.l\" d=\"~#F12ASn_US1KYlK)S1VeU1dO1_G2xqIbR4R5)1*N2!pTiI4Ge!3*dAdGR2(g-3S4O7W9!J2IecP1Rd(5AiSb_x1w8!p)6Hp-n22020000002101000000000001000000000002010100000000000010000000012122000110010000\"/><path id=\"reverse-crunch-m-m-foot.l\" d=\"~#o2A-A1(JN1EKz1zyN17IgBfKi*A1*mOw1zH3!iJ*2W2NP1Y7YswjDP1TbShVm*u_B1Ui000020000000000001200100010000100020021111020000\"/><path id=\"reverse-crunch-m-m-thigh.r\" d=\"^30\"/><path id=\"reverse-crunch-m-m-kneecap.r\" d=\"^31\"/><path id=\"reverse-crunch-m-m-shank.r\" d=\"^32\"/><path id=\"reverse-crunch-m-m-foot.r\" d=\"^33\"/><path id=\"reverse-crunch-m-mf-head\" d=\"^22\"/><path id=\"reverse-crunch-m-mf-torso\" d=\"^23\"/><path id=\"reverse-crunch-m-mf-shcap.l\" d=\"^17\"/><path id=\"reverse-crunch-m-mf-upper.l\" d=\"^18\"/><path id=\"reverse-crunch-m-mf-elbowcap.l\" d=\"^19\"/><path id=\"reverse-crunch-m-mf-fore.l\" d=\"^20\"/><path id=\"reverse-crunch-m-mf-palm.l\" d=\"^21\"/><path id=\"reverse-crunch-m-mf-shcap.r\" d=\"^17\"/><path id=\"reverse-crunch-m-mf-upper.r\" d=\"^18\"/><path id=\"reverse-crunch-m-mf-elbowcap.r\" d=\"^19\"/><path id=\"reverse-crunch-m-mf-fore.r\" d=\"^20\"/><path id=\"reverse-crunch-m-mf-palm.r\" d=\"^21\"/><path id=\"reverse-crunch-m-mo-0\" d=\"^22\"/><path id=\"reverse-crunch-m-mo-1\" d=\"^23\"/><path id=\"reverse-crunch-m-mo-2\" d=\"^13\"/><path id=\"reverse-crunch-m-mo-3\" d=\"^14\"/><path id=\"reverse-crunch-m-mo-4\" d=\"^15\"/><path id=\"reverse-crunch-m-mo-5\" d=\"^16\"/><path id=\"reverse-crunch-m-mo-6\" d=\"^17\"/><path id=\"reverse-crunch-m-mo-7\" d=\"^18\"/><path id=\"reverse-crunch-m-mo-8\" d=\"^19\"/><path id=\"reverse-crunch-m-mo-9\" d=\"^20\"/><path id=\"reverse-crunch-m-mo-10\" d=\"^21\"/><path id=\"reverse-crunch-m-mo-11\" d=\"^13\"/><path id=\"reverse-crunch-m-mo-12\" d=\"^14\"/><path id=\"reverse-crunch-m-mo-13\" d=\"^15\"/><path id=\"reverse-crunch-m-mo-14\" d=\"^16\"/><path id=\"reverse-crunch-m-mo-15\" d=\"^17\"/><path id=\"reverse-crunch-m-mo-16\" d=\"^18\"/><path id=\"reverse-crunch-m-mo-17\" d=\"^19\"/><path id=\"reverse-crunch-m-mo-18\" d=\"^20\"/><path id=\"reverse-crunch-m-mo-19\" d=\"^21\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#reverse-crunch-m-dots)\"/>\n  <path class=\"floorline\" d=\"^24\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#reverse-crunch-m-st-thigh.l\"/><use href=\"#reverse-crunch-m-st-kneecap.l\"/><use href=\"#reverse-crunch-m-st-shank.l\"/><use href=\"#reverse-crunch-m-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#reverse-crunch-m-st-thigh.l\"/><use href=\"#reverse-crunch-m-st-kneecap.l\"/><use href=\"#reverse-crunch-m-st-shank.l\"/><use href=\"#reverse-crunch-m-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-crunch-m-st-torso\"/><use href=\"#reverse-crunch-m-st-thigh.r\"/><use href=\"#reverse-crunch-m-st-kneecap.r\"/><use href=\"#reverse-crunch-m-st-shank.r\"/><use href=\"#reverse-crunch-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-crunch-m-st-torso\"/><use href=\"#reverse-crunch-m-st-thigh.r\"/><use href=\"#reverse-crunch-m-st-kneecap.r\"/><use href=\"#reverse-crunch-m-st-shank.r\"/><use href=\"#reverse-crunch-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-crunch-m-g0-thigh.r\"/><use href=\"#reverse-crunch-m-g0-kneecap.r\"/><use href=\"#reverse-crunch-m-g0-shank.r\"/><use href=\"#reverse-crunch-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-crunch-m-g0-thigh.r\"/><use href=\"#reverse-crunch-m-g0-kneecap.r\"/><use href=\"#reverse-crunch-m-g0-shank.r\"/><use href=\"#reverse-crunch-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-crunch-m-g1-thigh.r\"/><use href=\"#reverse-crunch-m-g1-kneecap.r\"/><use href=\"#reverse-crunch-m-g1-shank.r\"/><use href=\"#reverse-crunch-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-crunch-m-g1-thigh.r\"/><use href=\"#reverse-crunch-m-g1-kneecap.r\"/><use href=\"#reverse-crunch-m-g1-shank.r\"/><use href=\"#reverse-crunch-m-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#reverse-crunch-m-e-thigh.l\"/><use href=\"#reverse-crunch-m-e-kneecap.l\"/><use href=\"#reverse-crunch-m-e-shank.l\"/><use href=\"#reverse-crunch-m-e-foot.l\"/><use href=\"#reverse-crunch-m-e-shcap.l\"/><use href=\"#reverse-crunch-m-e-upper.l\"/><use href=\"#reverse-crunch-m-e-elbowcap.l\"/><use href=\"#reverse-crunch-m-e-fore.l\"/><use href=\"#reverse-crunch-m-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#reverse-crunch-m-e-thigh.l\"/><use href=\"#reverse-crunch-m-e-kneecap.l\"/><use href=\"#reverse-crunch-m-e-shank.l\"/><use href=\"#reverse-crunch-m-e-foot.l\"/><use href=\"#reverse-crunch-m-e-shcap.l\"/><use href=\"#reverse-crunch-m-e-upper.l\"/><use href=\"#reverse-crunch-m-e-elbowcap.l\"/><use href=\"#reverse-crunch-m-e-fore.l\"/><use href=\"#reverse-crunch-m-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-crunch-m-e-head\"/><use href=\"#reverse-crunch-m-e-torso\"/><use href=\"#reverse-crunch-m-e-thigh.r\"/><use href=\"#reverse-crunch-m-e-kneecap.r\"/><use href=\"#reverse-crunch-m-e-shank.r\"/><use href=\"#reverse-crunch-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-crunch-m-e-head\"/><use href=\"#reverse-crunch-m-e-torso\"/><use href=\"#reverse-crunch-m-e-thigh.r\"/><use href=\"#reverse-crunch-m-e-kneecap.r\"/><use href=\"#reverse-crunch-m-e-shank.r\"/><use href=\"#reverse-crunch-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-crunch-m-e-shcap.r\"/><use href=\"#reverse-crunch-m-e-upper.r\"/><use href=\"#reverse-crunch-m-e-elbowcap.r\"/><use href=\"#reverse-crunch-m-e-fore.r\"/><use href=\"#reverse-crunch-m-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-crunch-m-e-shcap.r\"/><use href=\"#reverse-crunch-m-e-upper.r\"/><use href=\"#reverse-crunch-m-e-elbowcap.r\"/><use href=\"#reverse-crunch-m-e-fore.r\"/><use href=\"#reverse-crunch-m-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"118.16\" cy=\"314.17\" r=\"2.25\"/><circle class=\"joint\" cx=\"176.03\" cy=\"325.42\" r=\"2.25\"/><circle class=\"joint\" cx=\"181.89\" cy=\"295\" r=\"2.25\"/><circle class=\"joint\" cx=\"137.35\" cy=\"231.39\" r=\"2.25\"/></g><mask id=\"reverse-crunch-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#reverse-crunch-m-mf-head\" fill=\"#000\"/><use href=\"#reverse-crunch-m-mf-torso\" fill=\"#000\"/><use href=\"#reverse-crunch-m-m-thigh.l\" fill=\"#000\"/><use href=\"#reverse-crunch-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#reverse-crunch-m-m-shank.l\" fill=\"#000\"/><use href=\"#reverse-crunch-m-m-foot.l\" fill=\"#000\"/><use href=\"#reverse-crunch-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#reverse-crunch-m-mf-upper.l\" fill=\"#000\"/><use href=\"#reverse-crunch-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#reverse-crunch-m-mf-fore.l\" fill=\"#000\"/><use href=\"#reverse-crunch-m-mf-palm.l\" fill=\"#000\"/><use href=\"#reverse-crunch-m-m-thigh.r\" fill=\"#000\"/><use href=\"#reverse-crunch-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#reverse-crunch-m-m-shank.r\" fill=\"#000\"/><use href=\"#reverse-crunch-m-m-foot.r\" fill=\"#000\"/><use href=\"#reverse-crunch-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#reverse-crunch-m-mf-upper.r\" fill=\"#000\"/><use href=\"#reverse-crunch-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#reverse-crunch-m-mf-fore.r\" fill=\"#000\"/><use href=\"#reverse-crunch-m-mf-palm.r\" fill=\"#000\"/><use href=\"#reverse-crunch-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-crunch-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#reverse-crunch-m-mmask)\"><g class=\"u-stroke\"><use href=\"#reverse-crunch-m-m-thigh.l\"/><use href=\"#reverse-crunch-m-m-kneecap.l\"/><use href=\"#reverse-crunch-m-m-shank.l\"/><use href=\"#reverse-crunch-m-m-foot.l\"/><use href=\"#reverse-crunch-m-m-thigh.r\"/><use href=\"#reverse-crunch-m-m-kneecap.r\"/><use href=\"#reverse-crunch-m-m-shank.r\"/><use href=\"#reverse-crunch-m-m-foot.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~M(OB1_OB1LUdP4LT4y9LK42L11LS40Lx92LS41L10L22L11L00LO42LS41L10L22L11LO40LS42LR41LP40LRd2LO4R4L0R4L1O4L2S4L0z9L1S4L2O4L0P4L1y9L2R4L00L1S4L2O4L01L12L21L0S4L1R4L22L01L12L21L02L11L22L01L10L22LArP4L20L1R4L0S4L20L10L0R4L2S4L10L00L20L10L00L21L12L00L20L10L0R4L2S4L10LO40LR4P4LS42L01L00Lx92LR41L20LP42LO41Lz9O4L20L00L10L2TdL0S4L1O4L2P4L0R4L12L2R4L0O4L1P4L2R4L0U4L11L2R4L0S4L12L21L0R4L1S4L22L01L1R4L2S4L0O4L10L2P4L0O4L11L2S4L0O4L10L21L02L1P4LS40L0O4LS40LP41L02Ly90L0P4LP40L00L2P4L12L00L21L12L01L22L11L02L2P4L1R4L02L2P4L1O4L01L2S4L1O4L01L2S4L1O4L0P4L2R4L1S4L0O4L2P4L10L0R4L2S4L1O4L0P4L20L1O4LO4z9LR42LS40LO41LR42L00LP41LO42L00L01L02LO40LP41L02L00LP4P4\"/><path class=\"m-arrow\" d=\"~MDypNBN1LBJ1NS1MJ2BvLI2DvLwx1VB1\"/><path class=\"leader m\" d=\"~MwIlJ*P1L0TE2\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"reverse-crunch-m-tuck\" data-key=\"tuck\" data-cue=\"The knees tuck in toward your chest and the knee angle closes.\" class=\"plate-callout m\" style=\"left:5.59%;top:57.54%\" aria-pressed=\"true\">Knees tuck</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "knees",
        cues: [{ key: "knees", cue: "Keep the knee angle at 90 degrees the whole rep." }, { key: "hips", cue: "Curl your hips and low back off the floor toward your ribs." }, { key: "back", cue: "Start with the low back flat on the floor, not arched." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "tuck",
        cues: [{ key: "tuck", cue: "The knees tuck in toward your chest and the knee angle closes." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Knees tuck</b><span>The knees tuck in toward your chest and the knee angle closes.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: curl 2 seconds, hold 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Curl</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Reverse crunch, side view. Lying on the back, arms by the sides and palms down, knees over the hips at 90 degrees, the lifter curls the hips and low back off the floor, knees toward the chest, then lowers.",
      mistakeAlt: "Reverse Crunch: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c1, c19) is on setup steps 1 and 3."
  },
  contacts: [
    "floor-body"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Lie on your back, arms by your sides, palms down.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-revcrunch",
          "bb-revcrunch",
          "motra-revcrunch"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "brace",
      "text": "Brace, lift your feet, knees over hips and bent to 90 degrees.",
      "zoom": "knees",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-revcrunch",
          "bb-revcrunch",
          "motra-revcrunch"
        ],
        "note": "card c2"
      }
    },
    {
      "kind": "position",
      "text": "Lower back flat. Hard to flatten? Put your hands under your hips.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-revcrunch",
          "bb-revcrunch",
          "motra-revcrunch"
        ],
        "note": "card c2, c19"
      }
    },
    {
      "kind": "position",
      "text": "Breathe out, curl your hips toward your ribs, tailbone off the floor.",
      "zoom": "hips",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-revcrunch",
          "bb-revcrunch",
          "pg-revcrunch",
          "motra-revcrunch"
        ],
        "note": "card c3, c8, c17, c5"
      }
    },
    {
      "kind": "position",
      "text": "Hold briefly. Breathe in and roll down slowly, vertebra by vertebra.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-revcrunch",
          "bb-revcrunch",
          "motra-revcrunch"
        ],
        "note": "card c5, c6, c10, c17"
      }
    }
  ],
  posture: [
    {
      "key": "curl",
      "label": "Hips curl up",
      "detail": "Breathe out and curl your hips toward your rib cage. Lift your lower back, not just your legs.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "zoom": "hips",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-revcrunch",
          "bb-revcrunch",
          "pg-revcrunch",
          "motra-revcrunch"
        ],
        "note": "card c3, c8, c17, c9"
      }
    },
    {
      "key": "knees",
      "label": "Knees at 90",
      "detail": "Keep your knees at 90 degrees. Don't tuck them too far.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "knees",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-revcrunch",
          "bb-revcrunch",
          "motra-revcrunch"
        ],
        "note": "card c4, c11"
      }
    },
    {
      "key": "tail",
      "label": "Tailbone up",
      "detail": "Curl until your tailbone clears the floor.",
      "anchor": {
        "pose": "end",
        "at": "sacrum"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-revcrunch",
          "motra-revcrunch"
        ],
        "note": "card c5"
      }
    },
    {
      "key": "hold",
      "label": "Brief hold",
      "detail": "Hold briefly at the top.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-revcrunch",
          "motra-revcrunch"
        ],
        "note": "card c5"
      }
    },
    {
      "key": "down",
      "label": "Slow roll down",
      "detail": "Breathe in and roll down slowly, vertebra by vertebra.",
      "anchor": {
        "pose": "start",
        "at": "backMid"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-revcrunch",
          "bb-revcrunch",
          "motra-revcrunch"
        ],
        "note": "card c6, c10, c17"
      }
    },
    {
      "key": "return",
      "label": "Knees over hips",
      "detail": "Control your legs. Knees return over your hips, not past them.",
      "anchor": {
        "pose": "start",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-revcrunch"
        ],
        "note": "card c7"
      }
    },
    {
      "key": "low-back",
      "label": "Back down",
      "detail": "Lower back flat on the floor at the start, not arching. Brace so it doesn't arch.",
      "anchor": {
        "pose": "start",
        "at": "lumbar"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-revcrunch",
          "bb-revcrunch",
          "motra-revcrunch",
          "pg-revcrunch"
        ],
        "note": "card c2, c12, c17"
      }
    }
  ],
  zooms: [
    {
      "key": "knees",
      "chip": "Knees",
      "heading": "Knee angle",
      "kind": "posture",
      "feelRow": "neck"
    },
    {
      "key": "hips",
      "chip": "Hips",
      "heading": "Hip curl",
      "kind": "posture",
      "feelRow": "hips"
    }
  ],
  chips: [
    "knees",
    "hips",
    "feel"
  ],
  copy: {
    "setupLine": "Breathe out and curl until your tailbone clears the floor. Hold briefly, then breathe in and roll down vertebra by vertebra.",
    "mistakeLine": "Knees tucking too far, or moving past your hips? Keep them at 90 degrees, over your hips.",
    "cueLine": "Hips toward your ribs."
  },
  mistakes: [],
  risks: [
    {
      "key": "tuck",
      "text": "Tucking your knees too far brings your weight onto your upper back and neck.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-revcrunch"
        ],
        "note": "card c11"
      }
    },
    {
      "key": "arch",
      "text": "If your lower back arches, it can strain your lower back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "pg-revcrunch",
          "motra-revcrunch"
        ],
        "note": "card c12"
      }
    },
    {
      "key": "legs",
      "text": "Lowering? Keep your knees over your hips, not past, to spare your low back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-revcrunch"
        ],
        "note": "card c7"
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
    "ace-revcrunch",
    "bb-revcrunch",
    "motra-revcrunch",
    "pg-revcrunch",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/reverse_crunch.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

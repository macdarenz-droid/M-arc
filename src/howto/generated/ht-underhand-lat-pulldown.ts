// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=6152aed02b880611513ac3d3da02b3c89be177f077392602d5b937415ef69329
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_underhand_lat_pulldown",
  name: "Underhand Lat Pulldown",
  hashes: { inputsSha256: "6152aed02b880611513ac3d3da02b3c89be177f077392602d5b937415ef69329", golden: "2b363f4df3e407314a0f3fac67d2931d2093eb1a2cf8a2edc2bd817c226d3072" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"underhand-lat-pulldown-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"underhand-lat-pulldown-n-st-shcap.l\" d=\"~~ASjJSF1PI10\"/><path id=\"underhand-lat-pulldown-n-st-upper.l\" d=\"~#F12JEmU(F1K*lK*G1V2U791AaxH1G4N4)1D2-eww1Rd_dz4Fe(3!i-4(y1iw3D1w6De.F1a4*1!7!dw5NiViW5OjK5Xp20000000000000101000000010100001001010000000021010111000000000210000000000010000\"/><path id=\"underhand-lat-pulldown-n-st-elbowcap.l\" d=\"~~PGmSOw1!v2\"/><path id=\"underhand-lat-pulldown-n-st-fore.l\" d=\"~#F12NGo_Yw1X)nOPx1z4S83-1_7XD1I5H7)1S1X8Usz9N9-2Y9W2!c.7_sqN2oy9(d)A1A1I1x1H9_8Y2yeKeH4*eE4Xj20000000200000002000000000002000101000000110100000001000000020000200000000010001\"/><path id=\"underhand-lat-pulldown-n-st-fist.l\" d=\"~~D.o((nwt0\"/><path id=\"underhand-lat-pulldown-n-st-torso\" d=\"~#_12DRiJEA1VNiR!y1XaI5)4P1_bPeW9y4Aewcw6I1-aBkznK3XaA6YdG6_hI8DiEhPd*hA3E9B9Id.szsOd)mz6.1-cdyfFhF4S6-c.4-c!9z2Ujw6A2y7BbP5W8Gx2SO100001200110100000000111000000001110210001000002001120000001010000200002000100001000000000000000010010000020000000001\"/><path id=\"underhand-lat-pulldown-n-st-shcap.r\" d=\"^0\"/><path id=\"underhand-lat-pulldown-n-st-upper.r\" d=\"^1\"/><path id=\"underhand-lat-pulldown-n-st-elbowcap.r\" d=\"^2\"/><path id=\"underhand-lat-pulldown-n-st-fore.r\" d=\"^3\"/><path id=\"underhand-lat-pulldown-n-st-fist.r\" d=\"^4\"/><path id=\"underhand-lat-pulldown-n-g0-shcap.r\" d=\"~~!NjFXF1PI10\"/><path id=\"underhand-lat-pulldown-n-g0-upper.r\" d=\"~#F12YzmWAG1x.lV!G1I2w673J8)w1)3D3.1U1.bPj.dJdT4FeN3!i*1!mkJ2J1(4ScVva4T1D6Sbwc(iBiH6IjV4-p00000000010110002020010100000000020001000001000000010100020010000010100000000001\"/><path id=\"underhand-lat-pulldown-n-g0-elbowcap.r\" d=\"~~w!lHKy1!v2\"/><path id=\"underhand-lat-pulldown-n-g0-fore.r\" d=\"~#F12__n_-y1XPnRIz1B4H63O1_8EuO5y5)1w1x8YixaN8-3N9N1wdE7AjmA2gJ7Ue-rA1vG1N7S6N8Nf*c!5KeB2xk00000000000000000000001000000000000000020010100001000000000101000000010000000101\"/><path id=\"underhand-lat-pulldown-n-g0-fist.r\" d=\"~~NTo(.rwt0\"/><path id=\"underhand-lat-pulldown-n-g1-shcap.r\" d=\"~~SIjA!F1PI10\"/><path id=\"underhand-lat-pulldown-n-g1-upper.r\" d=\"~#F12Sym!*F1.wm.RG1jw591v-qx3F3G1S1X5Dc-9Sgj(eN8HhW4UcD1W1_2N3D3Tqc04w5Ae!dNdTmqGkObVn10000100010020101000000000101000101010101211010100010001200011000000200000001010\"/><path id=\"underhand-lat-pulldown-n-g1-elbowcap.r\" d=\"~~y(j(Uz1!v2\"/><path id=\"underhand-lat-pulldown-n-g1-fore.r\" d=\"~#F12yUl(KA1)BlVWA1R5Y2eE1!gzjB6D1x25BaS8-c(2T7Y6R4JcX9y91w2*1y6AlKeF15O3y5nydUjT4UbIay7.i12000100000012000010020000000000000000010000000000200000000001000200010011000000\"/><path id=\"underhand-lat-pulldown-n-g1-fist.r\" d=\"~~wHow!vwt0\"/><path id=\"underhand-lat-pulldown-n-g2-shcap.r\" d=\"~~HFj(wG1PI10\"/><path id=\"underhand-lat-pulldown-n-g2-upper.r\" d=\"~#F12H)lHxG1G(lzPG1fW370)1-j.2N2I1F1B5Y2E9!g3(e(8whF5!2F1D1!2P2J2Xj60eY3PeSiWcxn2GkBcEn00000100010001010100120000001000101100000210000020002010020002000000201002000000\"/><path id=\"underhand-lat-pulldown-n-g2-elbowcap.r\" d=\"~~!UjHBB1!v2\"/><path id=\"underhand-lat-pulldown-n-g2-fore.r\" d=\"~#F12N(kFBD1KRkGDD1.45iryiX8)4.1K1x1T6S1-cT2-9(2E9H9I6J2jW1z3H4!jV2y1cz4_2O9ScYjw4!eR4HeEe00002100101010000000000101200111100002000210000020010121000010022020000101210000\"/><path id=\"underhand-lat-pulldown-n-g2-fist.r\" d=\"~~Pwoy!z1wt0\"/><path id=\"underhand-lat-pulldown-n-e-thigh.l\" d=\"~#F12w)mJ!W1EUl.*W1XaD10A1!Y1j-6X5K3T2xP1K4EkzcIipElFaEP16V3H2G7y5UY1W54z1Taz2*bYryA1SlUw1N1_B1Ei00000020000001200100000000000000000000020010110100000020000010001010020021100100\"/><path id=\"underhand-lat-pulldown-n-e-kneecap.l\" d=\"~~N!w1WDV1UF11\"/><path id=\"underhand-lat-pulldown-n-e-shank.l\" d=\"~#F12A.w1DzV1xyx1-YT1P2RaA14bD-1(5T6!2G3U1-!1W7Vbs.aR5-cN8B!1B2-3X4O7E9NY1x11nXaKcP9.dHlT1SjyaJn20001010001000120020000010000010010000101001000000110120000000200100100000000200\"/><path id=\"underhand-lat-pulldown-n-e-foot.l\" d=\"~#o2AKw1DH)1x*w1EK(1Sbw3wgG7DnXlDR2.2TB2G4Xy1G7Xl2XB1H4zaTbyqzaEkFn010002002100000200000021010000100101000002200200\"/><path id=\"underhand-lat-pulldown-n-e-shcap.l\" d=\"~~yBj_BG1PI10\"/><path id=\"underhand-lat-pulldown-n-e-upper.l\" d=\"~#F12PGjw-G1x!iV.F1z3I765(kWB16x60)2TaOx1mBjR6KdVfEb*j-sI2-1)4R3yhSE172*3)6TdP5tFq(8HiJlFf00022011110000020000010120000000210000200200000010000020000002200000000200000000\"/><path id=\"underhand-lat-pulldown-n-e-elbowcap.l\" d=\"~~DEnAXP1!v2\"/><path id=\"underhand-lat-pulldown-n-e-fore.l\" d=\"~#F12JFpUYP1OAp.RR1*1H9l-1G1IE1T3H8R1w2X1_tX6HbdAaW5_bv!tN1D2Y2S8w5zE1mT1D1H9D9kHaEhmTfV8Bi20000211100002000100000020200000010100000200001101000010020020000200000100010000\"/><path id=\"underhand-lat-pulldown-n-e-fist.l\" d=\"~~wXnA!E1wt0\"/><path id=\"underhand-lat-pulldown-n-e-head\" d=\"~#w12SXiwXvOFhR_vGcFlOe(cTa5T1(4z6.5R9.7VkRfD1EcV3x8XgP4(gxfAi.a(ix2UkP9y3Dh0000012000001001010000000200100210110100001000000110000000000000\"/><path id=\"underhand-lat-pulldown-n-e-torso\" d=\"~#_12DRiJEA1VNiR!y1I9F2O6E7WaA9(aSaAewcw6I1-aBkznK3XaA6YdG6_hI8DiEhPd*hA3E9B9Id.szsOd)mz6.1-cdyfFhF4S6-c.4.bYex3Yey5X2w8G6P5W8Gx2SO100100200000020210100111000000001110210001000002001120000001010000200002000100001000000000000000000010000020000000001\"/><path id=\"underhand-lat-pulldown-n-e-thigh.r\" d=\"^21\"/><path id=\"underhand-lat-pulldown-n-e-kneecap.r\" d=\"^22\"/><path id=\"underhand-lat-pulldown-n-e-shank.r\" d=\"^23\"/><path id=\"underhand-lat-pulldown-n-e-foot.r\" d=\"^24\"/><path id=\"underhand-lat-pulldown-n-e-shcap.r\" d=\"^25\"/><path id=\"underhand-lat-pulldown-n-e-upper.r\" d=\"^26\"/><path id=\"underhand-lat-pulldown-n-e-elbowcap.r\" d=\"^27\"/><path id=\"underhand-lat-pulldown-n-e-fore.r\" d=\"^28\"/><path id=\"underhand-lat-pulldown-n-e-fist.r\" d=\"^29\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#underhand-lat-pulldown-n-dots)\"/>\n  <path class=\"floorline\" d=\"M47.74 338.84H310.26\"/><path class=\"eq\" d=\"~MW!oYAaLYPv0QJ90IEvI9LI9TlQ0I9I9UlLIEvJ9QI90JEvJ9LJ9UlQ0J9J9TlZ\"/><path class=\"eq\" d=\"~MSVqYAaL0Fy2\"/><path class=\"eq\" d=\"~MFVT1YAaL0w_1\"/><path class=\"eq\" d=\"~MyYP1Uyy2L(s0QF60VmE6LE6zIX1Q0E6E6AIX1LVmF6QE60WmF6LF6AIX1Q0F6F6zIX1Z\"/><path class=\"eq\" d=\"~MPOX1Uyy2L(s0QF60VmE6LE6zIX1Q0E6E6AIX1LVmF6QE60WmF6LF6AIX1Q0F6F6zIX1Z\"/><path class=\"eq\" d=\"~MFAiSw-1LyH90Qwp0xR8)oL)owhQ0)o)o)gLxR8wpQ)o0yR8wpLwp)gQ0wpwpwhZ\"/><path class=\"eq\" d=\"~MNwmAO-1L0JU7Q0F6F6zN7L(uE6QF60*uE6LE6zN7Q0E6E6AN7L*uF6QE60(uF6Z\"/><path class=\"eq\" d=\"~MFGhUyy2Lywb0QF60--aE6LE6z6Q0E6E6A6L--aF6QE60_-aF6LF6A6Q0F6F6z6Z\"/><path class=\"eq-solid\" d=\"~~HPpwEcHB11\"/><path class=\"eq-pin\" d=\"~~HOqwEcF60\"/><path class=\"eq-solid\" d=\"~~FYS1Y(bwt0\"/><path class=\"eq-pin\" d=\"~~wOT1Y(bF60\"/><path class=\"eq-cable\" d=\"~MSVqYxbLW)o0\"/><path class=\"eq\" d=\"~MDWS1Uyy2LyY30QF60-R3E6LE6)uQ0E6E6wvL-R3F6QE60_R3F6LF6wvQ0F6F6)uZ\"/><path class=\"eq\" d=\"~M(OS1DI.1LSA40LRA4WB5LRA4VB5Z\"/><path class=\"eq-thin\" d=\"M258.55 327.07H279.76M258.55 323.75H279.76M258.55 320.44H279.76M258.55 317.12H279.76M258.55 313.81H279.76M258.55 310.49H279.76M258.55 307.18H279.76\"/><path class=\"eq-thin\" d=\"~M_FT1!Pw2L0z(P1\"/><path class=\"eq-thin\" d=\"~MW.V1!Pw2L0z(P1\"/><path class=\"arc measure\" d=\"M86.33 222.32L86.33 267.32A45 45 0 0 0 94.14 266.63Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-n-st-shcap.l\"/><use href=\"#underhand-lat-pulldown-n-st-upper.l\"/><use href=\"#underhand-lat-pulldown-n-st-elbowcap.l\"/><use href=\"#underhand-lat-pulldown-n-st-fore.l\"/><use href=\"#underhand-lat-pulldown-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-n-st-shcap.l\"/><use href=\"#underhand-lat-pulldown-n-st-upper.l\"/><use href=\"#underhand-lat-pulldown-n-st-elbowcap.l\"/><use href=\"#underhand-lat-pulldown-n-st-fore.l\"/><use href=\"#underhand-lat-pulldown-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-n-st-torso\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-n-st-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-n-st-shcap.r\"/><use href=\"#underhand-lat-pulldown-n-st-upper.r\"/><use href=\"#underhand-lat-pulldown-n-st-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-n-st-fore.r\"/><use href=\"#underhand-lat-pulldown-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-n-st-shcap.r\"/><use href=\"#underhand-lat-pulldown-n-st-upper.r\"/><use href=\"#underhand-lat-pulldown-n-st-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-n-st-fore.r\"/><use href=\"#underhand-lat-pulldown-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"~~!Ap(.rUb1\"/><path class=\"eq-cable\" d=\"~MNPp(.rL3*Uf\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-n-g0-shcap.r\"/><use href=\"#underhand-lat-pulldown-n-g0-upper.r\"/><use href=\"#underhand-lat-pulldown-n-g0-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-n-g0-fore.r\"/><use href=\"#underhand-lat-pulldown-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-n-g0-shcap.r\"/><use href=\"#underhand-lat-pulldown-n-g0-upper.r\"/><use href=\"#underhand-lat-pulldown-n-g0-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-n-g0-fore.r\"/><use href=\"#underhand-lat-pulldown-n-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MNPpwIvL00QUb0UbTbLTbRw2Q0TbTbSw2LUbUbQRb0RbUbLSbSw2Q0UbSbRw2Z\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"~~J.ow!vUb1\"/><path class=\"eq-cable\" d=\"~MwEpw!vLH9RVj\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-n-g1-shcap.r\"/><use href=\"#underhand-lat-pulldown-n-g1-upper.r\"/><use href=\"#underhand-lat-pulldown-n-g1-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-n-g1-fore.r\"/><use href=\"#underhand-lat-pulldown-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-n-g1-shcap.r\"/><use href=\"#underhand-lat-pulldown-n-g1-upper.r\"/><use href=\"#underhand-lat-pulldown-n-g1-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-n-g1-fore.r\"/><use href=\"#underhand-lat-pulldown-n-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MwEpyIz1L00QSb0SbTbLRbTw2Q0RbRbWw2LSbSbQTb0TbSbLUbWw2Q0UbUbTw2Z\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"~~!Roy!z1Ub1\"/><path class=\"eq-cable\" d=\"~MP*oy!z1L_i)Vn\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-n-g2-shcap.r\"/><use href=\"#underhand-lat-pulldown-n-g2-upper.r\"/><use href=\"#underhand-lat-pulldown-n-g2-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-n-g2-fore.r\"/><use href=\"#underhand-lat-pulldown-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-n-g2-shcap.r\"/><use href=\"#underhand-lat-pulldown-n-g2-upper.r\"/><use href=\"#underhand-lat-pulldown-n-g2-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-n-g2-fore.r\"/><use href=\"#underhand-lat-pulldown-n-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MP*oAIE1L00QSb0SbTbLRbTw2Q0RbRbWw2LSbSbQTb0TbSbLUbWw2Q0UbUbTw2Z\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"~M(OS1ANB1LSA40LRA4YB5LRA4XB5Z\"/><path class=\"eq-thin\" d=\"M258.55 214.9H279.76M258.55 211.59H279.76M258.55 208.27H279.76M258.55 204.96H279.76M258.55 201.64H279.76M258.55 198.33H279.76M258.55 195.01H279.76\"/><path class=\"eq-cable\" d=\"~MFSU1Y(bL0JOp\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-n-e-thigh.l\"/><use href=\"#underhand-lat-pulldown-n-e-kneecap.l\"/><use href=\"#underhand-lat-pulldown-n-e-shank.l\"/><use href=\"#underhand-lat-pulldown-n-e-foot.l\"/><use href=\"#underhand-lat-pulldown-n-e-shcap.l\"/><use href=\"#underhand-lat-pulldown-n-e-upper.l\"/><use href=\"#underhand-lat-pulldown-n-e-elbowcap.l\"/><use href=\"#underhand-lat-pulldown-n-e-fore.l\"/><use href=\"#underhand-lat-pulldown-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-n-e-thigh.l\"/><use href=\"#underhand-lat-pulldown-n-e-kneecap.l\"/><use href=\"#underhand-lat-pulldown-n-e-shank.l\"/><use href=\"#underhand-lat-pulldown-n-e-foot.l\"/><use href=\"#underhand-lat-pulldown-n-e-shcap.l\"/><use href=\"#underhand-lat-pulldown-n-e-upper.l\"/><use href=\"#underhand-lat-pulldown-n-e-elbowcap.l\"/><use href=\"#underhand-lat-pulldown-n-e-fore.l\"/><use href=\"#underhand-lat-pulldown-n-e-fist.l\"/></g></g><path class=\"eq\" d=\"~MWYgUyy2LJyd0QF60z!cE6LE6XhQ0E6E6YhLz!cF6QE60A!cF6LF6YhQ0F6F6XhZ\"/><path class=\"eq\" d=\"~MwEJ1Uyy2LWPb0QF60KHbE6LE6XhQ0E6E6YhLKHbF6QE60NHbF6LF6YhQ0F6F6XhZ\"/><path class=\"eq\" d=\"~MDXvD(R1L*!8_!8QI4N4(!8*T8LUeW5QN4N4-5ReLAU8-!8QN4I4*!8wU8LRe-5QK4K4W5UeZ\"/><path class=\"eq\" d=\"~~Y-uPBS1SK10\"/><path class=\"eq-pin\" d=\"~~yxw1PBS1F60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-n-e-head\"/><use href=\"#underhand-lat-pulldown-n-e-torso\"/><use href=\"#underhand-lat-pulldown-n-e-thigh.r\"/><use href=\"#underhand-lat-pulldown-n-e-kneecap.r\"/><use href=\"#underhand-lat-pulldown-n-e-shank.r\"/><use href=\"#underhand-lat-pulldown-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-n-e-head\"/><use href=\"#underhand-lat-pulldown-n-e-torso\"/><use href=\"#underhand-lat-pulldown-n-e-thigh.r\"/><use href=\"#underhand-lat-pulldown-n-e-kneecap.r\"/><use href=\"#underhand-lat-pulldown-n-e-shank.r\"/><use href=\"#underhand-lat-pulldown-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~~JFoA!E1Ub1\"/><path class=\"eq-cable\" d=\"~MwUoA!E1LHsGWr\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-n-e-shcap.r\"/><use href=\"#underhand-lat-pulldown-n-e-upper.r\"/><use href=\"#underhand-lat-pulldown-n-e-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-n-e-fore.r\"/><use href=\"#underhand-lat-pulldown-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-n-e-shcap.r\"/><use href=\"#underhand-lat-pulldown-n-e-upper.r\"/><use href=\"#underhand-lat-pulldown-n-e-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-n-e-fore.r\"/><use href=\"#underhand-lat-pulldown-n-e-fist.r\"/></g></g><path class=\"eq\" d=\"^67\"/><path class=\"eq-pin\" d=\"^68\"/><path class=\"eq-solid\" d=\"~MwUoAII1L00QUb0UbRbLTbVw2Q0TbTbUw2LUbUbQTb0TbUbLUbUw2Q0SbUbVw2Z\"/><path class=\"eq-line datum\" d=\"~MS.gPKI1L0NIa\"/><path class=\"eq-line\" d=\"~MS.gPKI1LP-1NDa\"/><circle class=\"joint\" cx=\"105.05\" cy=\"210.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"124.01\" cy=\"249.46\" r=\"2.25\"/><circle class=\"joint\" cx=\"118.1\" cy=\"269.9\" r=\"2.25\"/><circle class=\"joint\" cx=\"174.89\" cy=\"272.43\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#y20NUpUDqEVp).p0220100122102112002011022010012210002112002011022011221000211200000000200000000001200000000000021000000000001002000000001000002000001000002001001000002000000100002000000002000010000000000010000001\"/><path class=\"arrow\" d=\"~MSXoAJD1L*fXD1LHV1PG1Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M86.33 267.32A45 45 0 0 0 94.14 266.63\"/><g class=\"arc-ticks\"><path d=\"~MS.gYKT1L0FY1\"/><path d=\"~MyFi!GT1LY9JX1\"/></g><path class=\"leader\" d=\"~MAVhASU1Lxz2ID1\"/></g></g><path class=\"leader\" d=\"M179.01 264.17L183 258H193\"/><circle class=\"anchor\" cx=\"179.01\" cy=\"264.17\" r=\"1.5\"/><path class=\"leader\" d=\"M124.01 249.46L112.68 310H102.68\"/><circle class=\"anchor\" cx=\"124.01\" cy=\"249.46\" r=\"1.5\"/><path class=\"leader\" d=\"M126.08 204.18L141 196H151\"/><circle class=\"anchor\" cx=\"126.08\" cy=\"204.18\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"underhand-lat-pulldown-n-thighs\" data-key=\"thighs\" data-cue=\"Set the pads tight on top of the thighs.\" class=\"plate-callout two\" style=\"left:52.51%;top:65.92%\" aria-pressed=\"true\">Thighs<br>pinned</button><button type=\"button\" id=\"underhand-lat-pulldown-n-elbows\" data-key=\"elbows\" data-cue=\"Pull the elbows down and back toward the glutes.\" class=\"plate-callout two\" style=\"left:4.47%;top:80.45%\" aria-pressed=\"false\">Elbows<br>down, back</button><button type=\"button\" id=\"underhand-lat-pulldown-n-chin\" data-key=\"chin\" data-cue=\"Stop when the bar passes just below chin height.\" class=\"plate-callout two\" style=\"left:40.78%;top:48.6%\" aria-pressed=\"false\">Bar<br>below chin</button><span class=\"plate-arc-label\" style=\"left:2.23%;top:71.51%\"><b>Lean back</b><span>under 30°</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"underhand-lat-pulldown-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"underhand-lat-pulldown-m-st-shcap.l\" d=\"^0\"/><path id=\"underhand-lat-pulldown-m-st-upper.l\" d=\"^1\"/><path id=\"underhand-lat-pulldown-m-st-elbowcap.l\" d=\"^2\"/><path id=\"underhand-lat-pulldown-m-st-fore.l\" d=\"^3\"/><path id=\"underhand-lat-pulldown-m-st-fist.l\" d=\"^4\"/><path id=\"underhand-lat-pulldown-m-st-torso\" d=\"^5\"/><path id=\"underhand-lat-pulldown-m-st-shcap.r\" d=\"^0\"/><path id=\"underhand-lat-pulldown-m-st-upper.r\" d=\"^1\"/><path id=\"underhand-lat-pulldown-m-st-elbowcap.r\" d=\"^2\"/><path id=\"underhand-lat-pulldown-m-st-fore.r\" d=\"^3\"/><path id=\"underhand-lat-pulldown-m-st-fist.r\" d=\"^4\"/><path id=\"underhand-lat-pulldown-m-g0-shcap.r\" d=\"^6\"/><path id=\"underhand-lat-pulldown-m-g0-upper.r\" d=\"^7\"/><path id=\"underhand-lat-pulldown-m-g0-elbowcap.r\" d=\"^8\"/><path id=\"underhand-lat-pulldown-m-g0-fore.r\" d=\"^9\"/><path id=\"underhand-lat-pulldown-m-g0-fist.r\" d=\"^10\"/><path id=\"underhand-lat-pulldown-m-g1-shcap.r\" d=\"^11\"/><path id=\"underhand-lat-pulldown-m-g1-upper.r\" d=\"^12\"/><path id=\"underhand-lat-pulldown-m-g1-elbowcap.r\" d=\"^13\"/><path id=\"underhand-lat-pulldown-m-g1-fore.r\" d=\"^14\"/><path id=\"underhand-lat-pulldown-m-g1-fist.r\" d=\"^15\"/><path id=\"underhand-lat-pulldown-m-g2-shcap.r\" d=\"^16\"/><path id=\"underhand-lat-pulldown-m-g2-upper.r\" d=\"^17\"/><path id=\"underhand-lat-pulldown-m-g2-elbowcap.r\" d=\"^18\"/><path id=\"underhand-lat-pulldown-m-g2-fore.r\" d=\"^19\"/><path id=\"underhand-lat-pulldown-m-g2-fist.r\" d=\"^20\"/><path id=\"underhand-lat-pulldown-m-e-thigh.l\" d=\"^21\"/><path id=\"underhand-lat-pulldown-m-e-kneecap.l\" d=\"^22\"/><path id=\"underhand-lat-pulldown-m-e-shank.l\" d=\"^23\"/><path id=\"underhand-lat-pulldown-m-e-foot.l\" d=\"^24\"/><path id=\"underhand-lat-pulldown-m-e-shcap.l\" d=\"^25\"/><path id=\"underhand-lat-pulldown-m-e-upper.l\" d=\"^26\"/><path id=\"underhand-lat-pulldown-m-e-elbowcap.l\" d=\"^27\"/><path id=\"underhand-lat-pulldown-m-e-fore.l\" d=\"^28\"/><path id=\"underhand-lat-pulldown-m-e-fist.l\" d=\"^29\"/><path id=\"underhand-lat-pulldown-m-e-head\" d=\"^30\"/><path id=\"underhand-lat-pulldown-m-e-torso\" d=\"^31\"/><path id=\"underhand-lat-pulldown-m-e-thigh.r\" d=\"^21\"/><path id=\"underhand-lat-pulldown-m-e-kneecap.r\" d=\"^22\"/><path id=\"underhand-lat-pulldown-m-e-shank.r\" d=\"^23\"/><path id=\"underhand-lat-pulldown-m-e-foot.r\" d=\"^24\"/><path id=\"underhand-lat-pulldown-m-e-shcap.r\" d=\"^25\"/><path id=\"underhand-lat-pulldown-m-e-upper.r\" d=\"^26\"/><path id=\"underhand-lat-pulldown-m-e-elbowcap.r\" d=\"^27\"/><path id=\"underhand-lat-pulldown-m-e-fore.r\" d=\"^28\"/><path id=\"underhand-lat-pulldown-m-e-fist.r\" d=\"^29\"/><path id=\"underhand-lat-pulldown-m-m-shcap.r\" d=\"^25\"/><path id=\"underhand-lat-pulldown-m-m-upper.r\" d=\"~#F12JFjyVF1RVjTXE1N3G7a6TeNF1Y4-3F2)1Ai)twfzcY5-d.1BjS8)x15*2jz6Oi!D173W2T7zdT6IkUg.7YiS2Aq21010100000011010000001000200001000000000212101001002001000000000000021001010001\"/><path id=\"underhand-lat-pulldown-m-m-elbowcap.r\" d=\"~~yGg!*P1!v2\"/><path id=\"underhand-lat-pulldown-m-m-fore.r\" d=\"~#F12(ThJ*R1x.gBzS1I9U1N1B1yA1.f)89O2lGsN9)cx2R9H3*8Y9)rAaR1y2.6!5AD1)9_14E8S4!2W8!jD3Wez5Wd-e00001200000000200100000000001001001002010000100000001000000000210100001010002001\"/><path id=\"underhand-lat-pulldown-m-m-fist.r\" d=\"~~PXoYwN1wt0\"/><path id=\"underhand-lat-pulldown-m-m-eq0\" d=\"~~!FpYwN1Ub1\"/><path id=\"underhand-lat-pulldown-m-m-eq1\" d=\"~MPUp_OR1L00QUb0UbTbLTbRw2Q0TbTbSw2LUbUbQTb0TbUbLUbSw2Q0UbUbRw2Z\"/><path id=\"underhand-lat-pulldown-m-mf-head\" d=\"^30\"/><path id=\"underhand-lat-pulldown-m-mf-torso\" d=\"^31\"/><path id=\"underhand-lat-pulldown-m-mf-thigh.l\" d=\"^21\"/><path id=\"underhand-lat-pulldown-m-mf-kneecap.l\" d=\"^22\"/><path id=\"underhand-lat-pulldown-m-mf-shank.l\" d=\"^23\"/><path id=\"underhand-lat-pulldown-m-mf-foot.l\" d=\"^24\"/><path id=\"underhand-lat-pulldown-m-mf-shcap.l\" d=\"^25\"/><path id=\"underhand-lat-pulldown-m-mf-upper.l\" d=\"^83\"/><path id=\"underhand-lat-pulldown-m-mf-elbowcap.l\" d=\"^84\"/><path id=\"underhand-lat-pulldown-m-mf-fore.l\" d=\"^85\"/><path id=\"underhand-lat-pulldown-m-mf-fist.l\" d=\"^86\"/><path id=\"underhand-lat-pulldown-m-mf-thigh.r\" d=\"^21\"/><path id=\"underhand-lat-pulldown-m-mf-kneecap.r\" d=\"^22\"/><path id=\"underhand-lat-pulldown-m-mf-shank.r\" d=\"^23\"/><path id=\"underhand-lat-pulldown-m-mf-foot.r\" d=\"^24\"/><path id=\"underhand-lat-pulldown-m-mo-0\" d=\"^30\"/><path id=\"underhand-lat-pulldown-m-mo-1\" d=\"^31\"/><path id=\"underhand-lat-pulldown-m-mo-2\" d=\"^21\"/><path id=\"underhand-lat-pulldown-m-mo-3\" d=\"^22\"/><path id=\"underhand-lat-pulldown-m-mo-4\" d=\"^23\"/><path id=\"underhand-lat-pulldown-m-mo-5\" d=\"^24\"/><path id=\"underhand-lat-pulldown-m-mo-6\" d=\"^25\"/><path id=\"underhand-lat-pulldown-m-mo-7\" d=\"^26\"/><path id=\"underhand-lat-pulldown-m-mo-8\" d=\"^27\"/><path id=\"underhand-lat-pulldown-m-mo-9\" d=\"^28\"/><path id=\"underhand-lat-pulldown-m-mo-10\" d=\"^29\"/><path id=\"underhand-lat-pulldown-m-mo-11\" d=\"^21\"/><path id=\"underhand-lat-pulldown-m-mo-12\" d=\"^22\"/><path id=\"underhand-lat-pulldown-m-mo-13\" d=\"^23\"/><path id=\"underhand-lat-pulldown-m-mo-14\" d=\"^24\"/><path id=\"underhand-lat-pulldown-m-mo-15\" d=\"^25\"/><path id=\"underhand-lat-pulldown-m-mo-16\" d=\"^26\"/><path id=\"underhand-lat-pulldown-m-mo-17\" d=\"^27\"/><path id=\"underhand-lat-pulldown-m-mo-18\" d=\"^28\"/><path id=\"underhand-lat-pulldown-m-mo-19\" d=\"^29\"/><path id=\"underhand-lat-pulldown-m-mo-20\" d=\"^64\"/><path id=\"underhand-lat-pulldown-m-mo-21\" d=\"^65\"/><path id=\"underhand-lat-pulldown-m-mo-22\" d=\"^33\"/><path id=\"underhand-lat-pulldown-m-mo-23\" d=\"^36\"/><path id=\"underhand-lat-pulldown-m-mo-24\" d=\"^37\"/><path id=\"underhand-lat-pulldown-m-mo-25\" d=\"^38\"/><path id=\"underhand-lat-pulldown-m-mo-26\" d=\"^39\"/><path id=\"underhand-lat-pulldown-m-mo-27\" d=\"^40\"/><path id=\"underhand-lat-pulldown-m-mo-28\" d=\"^66\"/><path id=\"underhand-lat-pulldown-m-mo-29\" d=\"^67\"/><path id=\"underhand-lat-pulldown-m-mo-30\" d=\"^68\"/><path id=\"underhand-lat-pulldown-m-mo-31\" d=\"^67\"/><path id=\"underhand-lat-pulldown-m-mo-32\" d=\"^68\"/><path id=\"underhand-lat-pulldown-m-mo-33\" d=\"^41\"/><path id=\"underhand-lat-pulldown-m-mo-34\" d=\"^42\"/><path id=\"underhand-lat-pulldown-m-mo-35\" d=\"^43\"/><path id=\"underhand-lat-pulldown-m-mo-36\" d=\"^44\"/><path id=\"underhand-lat-pulldown-m-mo-37\" d=\"^46\"/><path id=\"underhand-lat-pulldown-m-mo-38\" d=\"^47\"/><path id=\"underhand-lat-pulldown-m-mo-39\" d=\"^61\"/><path id=\"underhand-lat-pulldown-m-mo-40\" d=\"^69\"/><path id=\"underhand-lat-pulldown-m-mo-41\" d=\"^71\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#underhand-lat-pulldown-m-dots)\"/>\n  <path class=\"floorline\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><path class=\"eq\" d=\"^38\"/><path class=\"eq\" d=\"^39\"/><path class=\"eq\" d=\"^40\"/><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq-pin\" d=\"^42\"/><path class=\"eq-solid\" d=\"^43\"/><path class=\"eq-pin\" d=\"^44\"/><path class=\"eq-cable\" d=\"^45\"/><path class=\"eq\" d=\"^46\"/><path class=\"eq\" d=\"^47\"/><path class=\"eq-thin\" d=\"^48\"/><path class=\"eq-thin\" d=\"^49\"/><path class=\"eq-thin\" d=\"^50\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-m-st-shcap.l\"/><use href=\"#underhand-lat-pulldown-m-st-upper.l\"/><use href=\"#underhand-lat-pulldown-m-st-elbowcap.l\"/><use href=\"#underhand-lat-pulldown-m-st-fore.l\"/><use href=\"#underhand-lat-pulldown-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-m-st-shcap.l\"/><use href=\"#underhand-lat-pulldown-m-st-upper.l\"/><use href=\"#underhand-lat-pulldown-m-st-elbowcap.l\"/><use href=\"#underhand-lat-pulldown-m-st-fore.l\"/><use href=\"#underhand-lat-pulldown-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-m-st-torso\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-m-st-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-m-st-shcap.r\"/><use href=\"#underhand-lat-pulldown-m-st-upper.r\"/><use href=\"#underhand-lat-pulldown-m-st-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-m-st-fore.r\"/><use href=\"#underhand-lat-pulldown-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-m-st-shcap.r\"/><use href=\"#underhand-lat-pulldown-m-st-upper.r\"/><use href=\"#underhand-lat-pulldown-m-st-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-m-st-fore.r\"/><use href=\"#underhand-lat-pulldown-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"^52\"/><path class=\"eq-cable\" d=\"^53\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-m-g0-shcap.r\"/><use href=\"#underhand-lat-pulldown-m-g0-upper.r\"/><use href=\"#underhand-lat-pulldown-m-g0-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-m-g0-fore.r\"/><use href=\"#underhand-lat-pulldown-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-m-g0-shcap.r\"/><use href=\"#underhand-lat-pulldown-m-g0-upper.r\"/><use href=\"#underhand-lat-pulldown-m-g0-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-m-g0-fore.r\"/><use href=\"#underhand-lat-pulldown-m-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^54\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"^55\"/><path class=\"eq-cable\" d=\"^56\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-m-g1-shcap.r\"/><use href=\"#underhand-lat-pulldown-m-g1-upper.r\"/><use href=\"#underhand-lat-pulldown-m-g1-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-m-g1-fore.r\"/><use href=\"#underhand-lat-pulldown-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-m-g1-shcap.r\"/><use href=\"#underhand-lat-pulldown-m-g1-upper.r\"/><use href=\"#underhand-lat-pulldown-m-g1-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-m-g1-fore.r\"/><use href=\"#underhand-lat-pulldown-m-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^57\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"^58\"/><path class=\"eq-cable\" d=\"^59\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-m-g2-shcap.r\"/><use href=\"#underhand-lat-pulldown-m-g2-upper.r\"/><use href=\"#underhand-lat-pulldown-m-g2-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-m-g2-fore.r\"/><use href=\"#underhand-lat-pulldown-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-m-g2-shcap.r\"/><use href=\"#underhand-lat-pulldown-m-g2-upper.r\"/><use href=\"#underhand-lat-pulldown-m-g2-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-m-g2-fore.r\"/><use href=\"#underhand-lat-pulldown-m-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^60\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"^61\"/><path class=\"eq-thin\" d=\"^62\"/><path class=\"eq-cable\" d=\"^63\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-m-e-thigh.l\"/><use href=\"#underhand-lat-pulldown-m-e-kneecap.l\"/><use href=\"#underhand-lat-pulldown-m-e-shank.l\"/><use href=\"#underhand-lat-pulldown-m-e-foot.l\"/><use href=\"#underhand-lat-pulldown-m-e-shcap.l\"/><use href=\"#underhand-lat-pulldown-m-e-upper.l\"/><use href=\"#underhand-lat-pulldown-m-e-elbowcap.l\"/><use href=\"#underhand-lat-pulldown-m-e-fore.l\"/><use href=\"#underhand-lat-pulldown-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-m-e-thigh.l\"/><use href=\"#underhand-lat-pulldown-m-e-kneecap.l\"/><use href=\"#underhand-lat-pulldown-m-e-shank.l\"/><use href=\"#underhand-lat-pulldown-m-e-foot.l\"/><use href=\"#underhand-lat-pulldown-m-e-shcap.l\"/><use href=\"#underhand-lat-pulldown-m-e-upper.l\"/><use href=\"#underhand-lat-pulldown-m-e-elbowcap.l\"/><use href=\"#underhand-lat-pulldown-m-e-fore.l\"/><use href=\"#underhand-lat-pulldown-m-e-fist.l\"/></g></g><path class=\"eq\" d=\"^64\"/><path class=\"eq\" d=\"^65\"/><path class=\"eq\" d=\"^66\"/><path class=\"eq\" d=\"^67\"/><path class=\"eq-pin\" d=\"^68\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-m-e-head\"/><use href=\"#underhand-lat-pulldown-m-e-torso\"/><use href=\"#underhand-lat-pulldown-m-e-thigh.r\"/><use href=\"#underhand-lat-pulldown-m-e-kneecap.r\"/><use href=\"#underhand-lat-pulldown-m-e-shank.r\"/><use href=\"#underhand-lat-pulldown-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-m-e-head\"/><use href=\"#underhand-lat-pulldown-m-e-torso\"/><use href=\"#underhand-lat-pulldown-m-e-thigh.r\"/><use href=\"#underhand-lat-pulldown-m-e-kneecap.r\"/><use href=\"#underhand-lat-pulldown-m-e-shank.r\"/><use href=\"#underhand-lat-pulldown-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^69\"/><path class=\"eq-cable\" d=\"^70\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-m-e-shcap.r\"/><use href=\"#underhand-lat-pulldown-m-e-upper.r\"/><use href=\"#underhand-lat-pulldown-m-e-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-m-e-fore.r\"/><use href=\"#underhand-lat-pulldown-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#underhand-lat-pulldown-m-e-shcap.r\"/><use href=\"#underhand-lat-pulldown-m-e-upper.r\"/><use href=\"#underhand-lat-pulldown-m-e-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-m-e-fore.r\"/><use href=\"#underhand-lat-pulldown-m-e-fist.r\"/></g></g><path class=\"eq\" d=\"^67\"/><path class=\"eq-pin\" d=\"^68\"/><path class=\"eq-solid\" d=\"^71\"/><circle class=\"joint\" cx=\"105.05\" cy=\"210.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"124.01\" cy=\"249.46\" r=\"2.25\"/><circle class=\"joint\" cx=\"118.1\" cy=\"269.9\" r=\"2.25\"/><circle class=\"joint\" cx=\"174.89\" cy=\"272.43\" r=\"2.25\"/></g><mask id=\"underhand-lat-pulldown-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#underhand-lat-pulldown-m-mf-head\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-mf-torso\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-mf-shank.l\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-mf-foot.l\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-mf-upper.l\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-mf-fore.l\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-mf-fist.l\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-mf-shank.r\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-mf-foot.r\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-m-shcap.r\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-m-upper.r\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-m-fore.r\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-m-fist.r\" fill=\"#000\"/><use href=\"#underhand-lat-pulldown-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-36\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-37\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-38\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-39\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-40\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#underhand-lat-pulldown-m-mo-41\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#underhand-lat-pulldown-m-mmask)\"><g class=\"u-stroke\"><use href=\"#underhand-lat-pulldown-m-m-shcap.r\"/><use href=\"#underhand-lat-pulldown-m-m-upper.r\"/><use href=\"#underhand-lat-pulldown-m-m-elbowcap.r\"/><use href=\"#underhand-lat-pulldown-m-m-fore.r\"/><use href=\"#underhand-lat-pulldown-m-m-fist.r\"/><use href=\"#underhand-lat-pulldown-m-m-eq0\"/><use href=\"#underhand-lat-pulldown-m-m-eq1\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MPUpYwN1LB4R-x1\"/><path class=\"m-line\" d=\"~MSPk_BG1LRE3yY7LyTbBVa\"/><path class=\"m-line\" d=\"~MPRqYwN1LB2xbLz4U1Lx3D3LX1w4L0P4LY1w4Ly3D3LA4U1LJ42LA4X1Ly3x3LY1z4L0I4LX1z4Lx3x3Lz4X1\"/><path class=\"m-arrow\" d=\"~MN.oyGG1LWjwX3MTmTlLUmUlLE8IR1\"/><path class=\"leader m\" d=\"M136.28 235.64L171 244H181\"/><path class=\"leader m\" d=\"M88.48 250.54L75.68 258H65.68\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"underhand-lat-pulldown-m-past\" data-key=\"past\" data-cue=\"The bar keeps going down well past the chin.\" class=\"plate-callout two m\" style=\"left:49.16%;top:62.01%\" aria-pressed=\"true\">Pulled<br>too low</button><button type=\"button\" id=\"underhand-lat-pulldown-m-back\" data-key=\"back\" data-cue=\"The elbows start to travel back behind the body.\" class=\"plate-callout two m\" style=\"left:1.12%;top:65.92%\" aria-pressed=\"false\">Elbows<br>go back</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "thighs",
        cues: [{ key: "thighs", cue: "Set the pads tight on top of the thighs." }, { key: "elbows", cue: "Pull the elbows down and back toward the glutes." }, { key: "chin", cue: "Stop when the bar passes just below chin height." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "past",
        cues: [{ key: "past", cue: "The bar keeps going down well past the chin." }, { key: "back", cue: "The elbows start to travel back behind the body." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Pulled too low</b><span>The bar keeps going down well past the chin.</span></li><li><b>Elbows go back</b><span>The elbows start to travel back behind the body.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 2 seconds, return 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div></div>",
      alt: "Underhand lat pulldown, side view. Seated with the thighs under the knee pad, palms facing you about shoulder width, the bar is pulled from straight arms overhead to just below the chin, elbows down and back.",
      mistakeAlt: "Underhand Lat Pulldown: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "pull",
    "orientation": "supinated",
    "handle": "bar-28",
    "loadAxis": "across",
    "width": {
      "text": "About shoulder width, or a little closer.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "puregym-reverse-grip-lat-pulldown",
          "barbend-reverse-grip-lat-pulldown"
        ],
        "note": "c1, c2, c3"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-reverse-grip-lat-pulldown"
        ],
        "note": "c2"
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        25
      ],
      "limitText": "Keep the wrists from curling forward.",
      "claim": {
        "tags": [
          "MECH",
          "CONVENTION"
        ],
        "sources": [
          "odriscoll-1992",
          "hand-key-bar"
        ],
        "note": "c18; the ext range is the key's ga:pull-base convention, not a card number"
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
    "gripLine": "Underhand, palms facing you. Thumbs wrapped or thumbless, either is fine.",
    "cue": "Palms facing you, wrists straight."
  },
  contacts: [
    "seat-back",
    "brace-pad"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Sit and set the pads tight against your thighs.",
      "zoom": "pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-reverse-grip-lat-pulldown"
        ],
        "note": "c4"
      }
    },
    {
      "kind": "grip",
      "text": "Stand, take the bar underhand about shoulder width, then sit.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-reverse-grip-lat-pulldown"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Lean back slightly, no more than about 30 degrees.",
      "zoom": "torso",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "ace-lat-pulldown"
        ],
        "note": "c5"
      }
    },
    {
      "kind": "brace",
      "text": "Draw your shoulder blades down to start the pull.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "ace-lat-pulldown"
        ],
        "note": "c10"
      }
    },
    {
      "kind": "load",
      "text": "Can't control the bar on the way up? Go lighter.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-reverse-grip-lat-pulldown",
          "barbend-reverse-grip-lat-pulldown"
        ],
        "note": "c9"
      }
    }
  ],
  posture: [
    {
      "key": "thighs",
      "label": "Thighs pinned",
      "detail": "Thighs pinned under the pads all set.",
      "anchor": {
        "pose": "end",
        "at": "thighTop.r"
      },
      "zoom": "pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-reverse-grip-lat-pulldown"
        ],
        "note": "c4"
      }
    },
    {
      "key": "lean",
      "label": "Torso still",
      "detail": "Torso stable. The lean does not change.",
      "anchor": {
        "pose": "end",
        "at": "backMid"
      },
      "zoom": "torso",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-reverse-grip-lat-pulldown"
        ],
        "note": "c7"
      }
    },
    {
      "key": "path",
      "label": "Bar in front",
      "detail": "The bar comes down in front of your face and stops just below your chin. Never behind the head.",
      "anchor": {
        "at": "chin"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA",
          "WEAK"
        ],
        "sources": [
          "puregym-reverse-grip-lat-pulldown",
          "sperandei2009",
          "signorile-2002",
          "padovan2024",
          "kolber2013"
        ],
        "note": "c6 (stop just below the chin); card inherit[0]: in front of the face, never behind the head"
      }
    },
    {
      "key": "elbows",
      "label": "Elbows down",
      "detail": "Elbows down and back toward the glutes.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-reverse-grip-lat-pulldown"
        ],
        "note": "c6"
      }
    },
    {
      "key": "stop",
      "label": "Stop point",
      "detail": "Stop just below the chin, when the elbows stop moving down.",
      "anchor": {
        "pose": "end",
        "at": "chin"
      },
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "ace-lat-pulldown"
        ],
        "note": "c11"
      }
    }
  ],
  zooms: [
    {
      "key": "hand",
      "chip": "Hand",
      "heading": "Hand position",
      "kind": "hand"
    },
    {
      "key": "torso",
      "chip": "Torso",
      "heading": "Torso lean",
      "kind": "posture"
    },
    {
      "key": "pad",
      "chip": "Knee pad",
      "heading": "Knee pad",
      "kind": "posture"
    }
  ],
  chips: [
    "hand",
    "torso",
    "pad",
    "feel"
  ],
  copy: {
    "setupLine": "Pin your thighs under the pads. Lean back slightly and keep that lean.",
    "mistakeLine": "Don't pull the bar behind your head or past your chin. Stop when your elbows stop moving down.",
    "cueLine": "Palms facing you, bar to chin.",
    "variantLine": "Drawn on a lat pulldown machine with a long bar."
  },
  mistakes: [
    {
      "key": "far",
      "title": "Pulling too far",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-reverse-grip-lat-pulldown"
        ],
        "note": "c8, c6"
      },
      "fix": "Stop when the bar passes just below your chin."
    },
    {
      "key": "rock",
      "title": "Rocking the torso",
      "zoom": "torso",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-reverse-grip-lat-pulldown"
        ],
        "note": "c7"
      },
      "fix": "Keep the torso still."
    },
    {
      "key": "fly",
      "title": "Bar flying back up",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-reverse-grip-lat-pulldown",
          "barbend-reverse-grip-lat-pulldown"
        ],
        "note": "c9"
      },
      "fix": "Control it all the way up. Can't? Go lighter."
    }
  ],
  risks: [
    {
      "key": "shoulder",
      "text": "Pulling past where the elbows stop moving down stresses the shoulder.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "ace-lat-pulldown"
        ],
        "note": "c11"
      }
    }
  ],
  riskFlags: [
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
    "ace-lat-pulldown",
    "barbend-reverse-grip-lat-pulldown",
    "buonsenso-2025",
    "lusk-2010",
    "odriscoll-1992",
    "puregym-reverse-grip-lat-pulldown",
    "hand-key-bar",
    "sperandei2009",
    "padovan2024",
    "kolber2013",
    "signorile-2002",
    "nhs-wrist-pain",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/underhand_lat_pulldown.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

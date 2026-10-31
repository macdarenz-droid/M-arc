// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=6b60e910e360723168929b8cfca52bb6ce528e5a5f39de2a11beb740cb633349
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_lat_pulldown",
  name: "Lat Pulldown",
  hashes: { inputsSha256: "6b60e910e360723168929b8cfca52bb6ce528e5a5f39de2a11beb740cb633349", golden: "0666827521cc8d42721a01e804596a3a3670ca11ce83b074da95d728e89c5ea3" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"lat-pulldown-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"lat-pulldown-n-st-thigh.l\" d=\"~#F12_Pp((W1xDoVwX1XaF10A1!Y1r.6X5K3R2)O1E4Kk)bGilBlJaGP1cR3H2I7D5WY1J52B1Ra)1.b_rHA1HlPw1H1_B1Ki10100000001000010000000000101000000200111001010000100000000002000000200000000110\"/><path id=\"lat-pulldown-n-st-kneecap.l\" d=\"~~(Kz1JEV1UF11\"/><path id=\"lat-pulldown-n-st-shank.l\" d=\"~#F12YJz1wzV1RUz1XYT1Y2OaA12O1F-1A6O6!2G3_2X!1(7Rby1-aG5*cU9).1x2-3V4V7EaHY1z11h.aTcJ9Ee(k)1UjU9Pn10000001010002020001011011000000000000002000000111000000000000000000012002000010\"/><path id=\"lat-pulldown-n-st-shcap.l\" d=\"~~STnJSF1PI10\"/><path id=\"lat-pulldown-n-st-upper.l\" d=\"~#F12YGqY_F1-yqO-G1*1U791y6VG1.3S4X1J2TbYvBc(e.2UeW5JiI1_x1q_2_1Y5Da.F1a2z1_7yeS4WgGk!3)jV7xp00011001010100010002001200000020000000000000000200000000000000111000101000000002\"/><path id=\"lat-pulldown-n-st-elbowcap.l\" d=\"~~!RpNPw1!v2\"/><path id=\"lat-pulldown-n-st-fore.l\" d=\"~#F12WSrwWw1-IrINx1)2_8d-1J3)D1O4W7-1!1I5ytx8NaV1(9D4PcR4Fty1H2Y1_8W9)B1w1R11J9w9!1Jc.fU2KfI6xj00210111101002002000020000000001010002020000101101000000000010000002002000200200\"/><path id=\"lat-pulldown-n-st-fist.l\" d=\"~~yArU_nwt0\"/><path id=\"lat-pulldown-n-st-head\" d=\"~#w12!OoYPvxxnOHvOgHi.gS9IaG2R2N4-4)6X7V9*gOjW3-b.1T8Khu_jBb(j.6wj!1AiUdhNh0100100101100001010010002201000000010010102001010000000012101001\"/><path id=\"lat-pulldown-n-st-torso\" d=\"~#_12UInS!z1zSnxSy1*8I5*24P9Pfw9H5Jc!dY59.6IlVkB6Ib(4Hez5PiX6PjOfyf-g(3*8)7xeGqTuKbxoX5aX8gJc_dH3A7)bV6zey8X4Ajy6N5ybVaF3y7XG2!w102000001101000010120000000000200100000200000020210010100010111110010100002000221010000010100020220000000000101200000\"/><path id=\"lat-pulldown-n-st-thigh.r\" d=\"^0\"/><path id=\"lat-pulldown-n-st-kneecap.r\" d=\"^1\"/><path id=\"lat-pulldown-n-st-shank.r\" d=\"^2\"/><path id=\"lat-pulldown-n-st-shcap.r\" d=\"^3\"/><path id=\"lat-pulldown-n-st-upper.r\" d=\"^4\"/><path id=\"lat-pulldown-n-st-elbowcap.r\" d=\"^5\"/><path id=\"lat-pulldown-n-st-fore.r\" d=\"^6\"/><path id=\"lat-pulldown-n-st-fist.r\" d=\"^7\"/><path id=\"lat-pulldown-n-g0-shcap.r\" d=\"~~(.mUWF1PI10\"/><path id=\"lat-pulldown-n-g0-upper.r\" d=\"~#F12AOpPFG1GDp*-G1K2F453W8Ro*3Y1.1uI9F8GfWbB6UdJ1Fj4Ncgy2F1A4Wc-ma2V1W4W7Si!k)fJ8Oi-1Eq01111001000000000100000000111110000020012000000000000000000010010100000002001001\"/><path id=\"lat-pulldown-n-g0-elbowcap.r\" d=\"~~JHpFyA1!v2\"/><path id=\"lat-pulldown-n-g0-fore.r\" d=\"~#F12DIr_EA1VAr)*A1*2y8bV1Y2Rz1K4(6X1W1T4wpx8NaV1waD4Nc.3DpD1A2!1y8w9Ry1w1I14P8S8A4Nc.fS2KfK6zj00000001001000010100200020000200010101000020000000000020002100001222000000111000\"/><path id=\"lat-pulldown-n-g0-fist.r\" d=\"~~yYqFBswt0\"/><path id=\"lat-pulldown-n-g1-shcap.r\" d=\"~~YAm(.F1PI10\"/><path id=\"lat-pulldown-n-g1-upper.r\" d=\"~#F12(JoW!G1.BoXxH1.1A157H7B9)2E1K1fw3R9XiH4Eb!9X6wi_9T1cJ1oD3Aax668G1Y1*8FrWp.5FfKdF9Ro00000001000000011000010001000002000000020000011000110100002000101100201000001000\"/><path id=\"lat-pulldown-n-g1-elbowcap.r\" d=\"~~_DoHJE1!v2\"/><path id=\"lat-pulldown-n-g1-fore.r\" d=\"~#F12UDq(VE1x(p.FF1V3Y69O1F6Kvx5S5*1F1K6AkG9H9.2W9S2(cV5Hksy2A1P7FcVty1z1nY7N7H7DeEeS4.ex4-j02001010000020010010100000000021010010111101100001210100001000000010100200011100\"/><path id=\"lat-pulldown-n-g1-fist.r\" d=\"~~wJq!Ow1wt0\"/><path id=\"lat-pulldown-n-g2-shcap.r\" d=\"~~yNlNyG1PI10\"/><path id=\"lat-pulldown-n-g2-upper.r\" d=\"~#F12!UlY-G1TNlGNG1I1*265DbPdF1I3gR1Y4I2K1Bjx8TcVgK9z4H3X17O37N7Yf76x2R2GnB9(1Aq(aDh!m(c00001010110100000000100001101011000120001011000000111000101101000201000000100010\"/><path id=\"lat-pulldown-n-g2-elbowcap.r\" d=\"~~_Tnw(I1!v2\"/><path id=\"lat-pulldown-n-g2-fore.r\" d=\"~#F12PTpDFJ1IHpV.J1.3(65R1A7Ow1B5_5)1D1G7JlK9A9z3W9J2(cO6SlqD2sY7AdTuD1z1v(7P7_6Pe)d_4.eT3-j10010100000200000001010000000000000001010100101100011000001000000000000000000012\"/><path id=\"lat-pulldown-n-g2-fist.r\" d=\"~~wwqP_A1wt0\"/><path id=\"lat-pulldown-n-e-thigh.l\" d=\"~#F12WDpS.W1*.n)!W1XaA10D1!Y1f-6-5K3T2)O1O4GkzcGirGlDaEP12T3J2I7w5WY1!50B1Raz2)bYrAA1SlPw1P1(B1zi00110000001000010110100000120010001011000022000100000200010000010000010100000000\"/><path id=\"lat-pulldown-n-e-kneecap.l\" d=\"~~DAz1PDV1UF11\"/><path id=\"lat-pulldown-n-e-shank.l\" d=\"~#F12!yz1HzV1OGz1*YT1N2OaA122F-1(5V6_2I3A1-!1U7Xbo.aT5Xc(7G!1B2V3-4R7X8UY1B15nVaKcS9TdPlO1SjFaFn01000000100000020000200010000200000020000020000020000210110220000102001000001000\"/><path id=\"lat-pulldown-n-e-foot.l\" d=\"~#o2WXy1DH)1TEz1EK(1Sbw3wgG7DnXlDR2.2RB2G4.y1G7Vl2XB1H4zaTbAqzaIkFn210002002100000200000001110000100101000002001200\"/><path id=\"lat-pulldown-n-e-shcap.l\" d=\"~~(Xk(GG1PI10\"/><path id=\"lat-pulldown-n-e-upper.l\" d=\"~#F12(XkDHG1TYkIKF1cB780N2ND1Y2-4J1K2y5Ksw9xh3.eB9*gI5IsG1K2.2X4)1ND170dB7XeK4EcFn2HkUcAn00110010000000110101200000011110021001000001010000001000000101110100000001200010\"/><path id=\"lat-pulldown-n-e-elbowcap.l\" d=\"~~!AlD_P1!v2\"/><path id=\"lat-pulldown-n-e-fore.l\" d=\"~#F12YxnYHR1.SmI)R1.5H76-1YgRz1)6Y5G2y1zfPpzby7)4Y8dDdGe(p6S2I1!8DmIw1N1B1G3!8(7Y4yhTaW7Rdkzk00200010120000001000101100022000200000000000000100020001001200000000021000002000\"/><path id=\"lat-pulldown-n-e-fist.l\" d=\"~~wUpABG1wt0\"/><path id=\"lat-pulldown-n-e-head\" d=\"~#w12WwkY!v)RiTzw1XaymTd(dRakG1w5O6K5zaE7Xl)deIcG4X7IgU5!fBgFhxc_iI3Dlw8H4(g1101000002020000011001000001000020001020010000001200000100000010\"/><path id=\"lat-pulldown-n-e-torso\" d=\"~#_12JAkAKA1.(jOyz1xaP1K7.5(aY8HbDaPePby6R1Tb.jEnR2KaP6Pd.6Ph*8Sh-h!cKi_2I9V9xd-txrEeRmG6R1Vc3Sf_gP4J6*cI4IbyfO2(eJ4z4W6)5P6N9.*1wU100101020000000000010000020000010000200001110000000000001001111000000000210000000000020200001010000010000020000000202\"/><path id=\"lat-pulldown-n-e-thigh.r\" d=\"^25\"/><path id=\"lat-pulldown-n-e-kneecap.r\" d=\"^26\"/><path id=\"lat-pulldown-n-e-shank.r\" d=\"^27\"/><path id=\"lat-pulldown-n-e-foot.r\" d=\"^28\"/><path id=\"lat-pulldown-n-e-shcap.r\" d=\"^29\"/><path id=\"lat-pulldown-n-e-upper.r\" d=\"^30\"/><path id=\"lat-pulldown-n-e-elbowcap.r\" d=\"^31\"/><path id=\"lat-pulldown-n-e-fore.r\" d=\"^32\"/><path id=\"lat-pulldown-n-e-fist.r\" d=\"^33\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#lat-pulldown-n-dots)\"/>\n  <path class=\"floorline\" d=\"M59.67 338.84H298.33\"/><path class=\"eq\" d=\"~MFErYAaLU.q0QJ90ESqI9LI9TlQ0I9I9UlLESqJ9QI90FSqJ9LJ9UlQ0J9J9TlZ\"/><path class=\"eq\" d=\"~MDwtYAaL0Fy2\"/><path class=\"eq\" d=\"~MUHR1YAaL0w_1\"/><path class=\"eq\" d=\"~MNKN1Uyy2L(s0QF60VmE6LE6zIX1Q0E6E6AIX1LVmF6QE60WmF6LF6AIX1Q0F6F6zIX1Z\"/><path class=\"eq\" d=\"~M(AV1Uyy2L(s0QF60VmE6LE6zIX1Q0E6E6AIX1LVmF6QE60WmF6LF6AIX1Q0F6F6zIX1Z\"/><path class=\"eq\" d=\"~M!NkSw-1LwH90Qwp0)P8)oL)owhQ0)o)o)gL)P8wpQ)o0wR8wpLwp)gQ0wpwpwhZ\"/><path class=\"eq\" d=\"~MwIoAO-1L0JU7Q0F6F6zN7LwvE6QF60)uE6LE6zN7Q0E6E6AN7L)uF6QE60wvF6Z\"/><path class=\"eq\" d=\"~M_TjUyy2LAwb0QF60.-aE6LE6z6Q0E6E6A6L.-aF6QE60!-aF6LF6A6Q0F6F6z6Z\"/><path class=\"eq-solid\" d=\"~~!_rwEcHB11\"/><path class=\"eq-pin\" d=\"~~(-swEcF60\"/><path class=\"eq-solid\" d=\"~~UKP1Y(bwt0\"/><path class=\"eq-pin\" d=\"~~JAR1Y(bF60\"/><path class=\"eq-cable\" d=\"~MDwtYxbLNHk0\"/><path class=\"eq\" d=\"~MUIP1Uyy2LyY30QF60-R3E6LE6)uQ0E6E6wvL-R3F6QE60_R3F6LF6wvQ0F6F6)uZ\"/><path class=\"eq\" d=\"~MJBP1DI.1LSA40LRA4WB5LRA4VB5Z\"/><path class=\"eq-thin\" d=\"M246.62 327.07H267.83M246.62 323.75H267.83M246.62 320.44H267.83M246.62 317.12H267.83M246.62 313.81H267.83M246.62 310.49H267.83M246.62 307.18H267.83\"/><path class=\"eq-thin\" d=\"~MF(P1!Pw2L0z(P1\"/><path class=\"eq-thin\" d=\"~MyRT1!Pw2L0z(P1\"/><path class=\"arc measure\" d=\"M129.58 269.76L129.58 229.76A40 40 0 0 0 118.75 231.26Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-n-st-thigh.l\"/><use href=\"#lat-pulldown-n-st-kneecap.l\"/><use href=\"#lat-pulldown-n-st-shank.l\"/><use href=\"#lat-pulldown-n-st-shcap.l\"/><use href=\"#lat-pulldown-n-st-upper.l\"/><use href=\"#lat-pulldown-n-st-elbowcap.l\"/><use href=\"#lat-pulldown-n-st-fore.l\"/><use href=\"#lat-pulldown-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-n-st-thigh.l\"/><use href=\"#lat-pulldown-n-st-kneecap.l\"/><use href=\"#lat-pulldown-n-st-shank.l\"/><use href=\"#lat-pulldown-n-st-shcap.l\"/><use href=\"#lat-pulldown-n-st-upper.l\"/><use href=\"#lat-pulldown-n-st-elbowcap.l\"/><use href=\"#lat-pulldown-n-st-fore.l\"/><use href=\"#lat-pulldown-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-n-st-head\"/><use href=\"#lat-pulldown-n-st-torso\"/><use href=\"#lat-pulldown-n-st-thigh.r\"/><use href=\"#lat-pulldown-n-st-kneecap.r\"/><use href=\"#lat-pulldown-n-st-shank.r\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-n-st-head\"/><use href=\"#lat-pulldown-n-st-torso\"/><use href=\"#lat-pulldown-n-st-thigh.r\"/><use href=\"#lat-pulldown-n-st-kneecap.r\"/><use href=\"#lat-pulldown-n-st-shank.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-n-st-shcap.r\"/><use href=\"#lat-pulldown-n-st-upper.r\"/><use href=\"#lat-pulldown-n-st-elbowcap.r\"/><use href=\"#lat-pulldown-n-st-fore.r\"/><use href=\"#lat-pulldown-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-n-st-shcap.r\"/><use href=\"#lat-pulldown-n-st-upper.r\"/><use href=\"#lat-pulldown-n-st-elbowcap.r\"/><use href=\"#lat-pulldown-n-st-fore.r\"/><use href=\"#lat-pulldown-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"~~NGrNYrUb1\"/><path class=\"eq-cable\" d=\"~MyVrNYrL_5.Rf\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-n-g0-shcap.r\"/><use href=\"#lat-pulldown-n-g0-upper.r\"/><use href=\"#lat-pulldown-n-g0-elbowcap.r\"/><use href=\"#lat-pulldown-n-g0-fore.r\"/><use href=\"#lat-pulldown-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-n-g0-shcap.r\"/><use href=\"#lat-pulldown-n-g0-upper.r\"/><use href=\"#lat-pulldown-n-g0-elbowcap.r\"/><use href=\"#lat-pulldown-n-g0-fore.r\"/><use href=\"#lat-pulldown-n-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MyVrPEvL00QSb0SbTbLRbIT1Q0RbRbNT1LSbSbQTb0TbSbLUbNT1Q0UbUbIT1Z\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"~~N*qyzw1Ub1\"/><path class=\"eq-cable\" d=\"~MyGryzw1L_hz*j\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-n-g1-shcap.r\"/><use href=\"#lat-pulldown-n-g1-upper.r\"/><use href=\"#lat-pulldown-n-g1-elbowcap.r\"/><use href=\"#lat-pulldown-n-g1-fore.r\"/><use href=\"#lat-pulldown-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-n-g1-shcap.r\"/><use href=\"#lat-pulldown-n-g1-upper.r\"/><use href=\"#lat-pulldown-n-g1-elbowcap.r\"/><use href=\"#lat-pulldown-n-g1-fore.r\"/><use href=\"#lat-pulldown-n-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MyGrASz1L00QSb0SbTbLRbIT1Q0RbRbNT1LSbSbQTb0TbSbLUbNT1Q0UbUbIT1Z\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"~~NRqWKA1Ub1\"/><path class=\"eq-cable\" d=\"~Mw*qWKA1L!tzFo\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-n-g2-shcap.r\"/><use href=\"#lat-pulldown-n-g2-upper.r\"/><use href=\"#lat-pulldown-n-g2-elbowcap.r\"/><use href=\"#lat-pulldown-n-g2-fore.r\"/><use href=\"#lat-pulldown-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-n-g2-shcap.r\"/><use href=\"#lat-pulldown-n-g2-upper.r\"/><use href=\"#lat-pulldown-n-g2-elbowcap.r\"/><use href=\"#lat-pulldown-n-g2-fore.r\"/><use href=\"#lat-pulldown-n-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~Mw*qY!E1L00QUb0UbTbLTbIT1Q0RbTbNT1LUbSbQRb0RbSbLSbNT1Q0UbSbIT1Z\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MJBP1wwA1LSA40LRA4YB5LRA4XB5Z\"/><path class=\"eq-thin\" d=\"M246.62 207.52H267.83M246.62 204.21H267.83M246.62 200.89H267.83M246.62 197.58H267.83M246.62 194.26H267.83M246.62 190.95H267.83M246.62 187.63H267.83\"/><path class=\"eq-cable\" d=\"~MUES1Y(bL0Fxo\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-n-e-thigh.l\"/><use href=\"#lat-pulldown-n-e-kneecap.l\"/><use href=\"#lat-pulldown-n-e-shank.l\"/><use href=\"#lat-pulldown-n-e-foot.l\"/><use href=\"#lat-pulldown-n-e-shcap.l\"/><use href=\"#lat-pulldown-n-e-upper.l\"/><use href=\"#lat-pulldown-n-e-elbowcap.l\"/><use href=\"#lat-pulldown-n-e-fore.l\"/><use href=\"#lat-pulldown-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-n-e-thigh.l\"/><use href=\"#lat-pulldown-n-e-kneecap.l\"/><use href=\"#lat-pulldown-n-e-shank.l\"/><use href=\"#lat-pulldown-n-e-foot.l\"/><use href=\"#lat-pulldown-n-e-shcap.l\"/><use href=\"#lat-pulldown-n-e-upper.l\"/><use href=\"#lat-pulldown-n-e-elbowcap.l\"/><use href=\"#lat-pulldown-n-e-fore.l\"/><use href=\"#lat-pulldown-n-e-fist.l\"/></g></g><path class=\"eq\" d=\"~MFzjUyy2LJyd0QF60z!cE6LE6XhQ0E6E6YhLz!cF6QE60A!cF6LF6YhQ0F6F6XhZ\"/><path class=\"eq\" d=\"~MN!G1Uyy2LWPb0QF60KHbE6LE6XhQ0E6E6YhLKHbF6QE60NHbF6LF6YhQ0F6F6XhZ\"/><path class=\"eq\" d=\"~Mw)x1(*R1LE_8A*8QI4N4H_8GU8LUeY5QN4J4.5TeLNR8x*8QJ4K4G_8HU8LReX5QO4I4Y5UeZ\"/><path class=\"eq\" d=\"~~Uxx1DBS1SK10\"/><path class=\"eq-pin\" d=\"~~(Fy1DBS1F60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-n-e-head\"/><use href=\"#lat-pulldown-n-e-torso\"/><use href=\"#lat-pulldown-n-e-thigh.r\"/><use href=\"#lat-pulldown-n-e-kneecap.r\"/><use href=\"#lat-pulldown-n-e-shank.r\"/><use href=\"#lat-pulldown-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-n-e-head\"/><use href=\"#lat-pulldown-n-e-torso\"/><use href=\"#lat-pulldown-n-e-thigh.r\"/><use href=\"#lat-pulldown-n-e-kneecap.r\"/><use href=\"#lat-pulldown-n-e-shank.r\"/><use href=\"#lat-pulldown-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~~JBqHYF1Ub1\"/><path class=\"eq-cable\" d=\"~MwRqHYF1L(G1)Ss\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-n-e-shcap.r\"/><use href=\"#lat-pulldown-n-e-upper.r\"/><use href=\"#lat-pulldown-n-e-elbowcap.r\"/><use href=\"#lat-pulldown-n-e-fore.r\"/><use href=\"#lat-pulldown-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-n-e-shcap.r\"/><use href=\"#lat-pulldown-n-e-upper.r\"/><use href=\"#lat-pulldown-n-e-elbowcap.r\"/><use href=\"#lat-pulldown-n-e-fore.r\"/><use href=\"#lat-pulldown-n-e-fist.r\"/></g></g><path class=\"eq\" d=\"^71\"/><path class=\"eq-pin\" d=\"^72\"/><path class=\"eq-solid\" d=\"~MwRqJEJ1L00QUb0UbTbLTbIT1Q0RbTbNT1LUbSbQTb0TbSbLUbNT1Q0UbUbIT1Z\"/><path class=\"eq-line datum\" d=\"~M!GpwWU1L0KR8\"/><path class=\"eq-line\" d=\"~M!GpwWU1LxH2BE8\"/><circle class=\"joint\" cx=\"113.19\" cy=\"211.51\" r=\"2.25\"/><circle class=\"joint\" cx=\"113.41\" cy=\"249.95\" r=\"2.25\"/><circle class=\"joint\" cx=\"129.58\" cy=\"269.76\" r=\"2.25\"/><circle class=\"joint\" cx=\"186.37\" cy=\"272.4\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#D20y.r()px!rIUp0000000001020000000001020000000102001020000102000000000102000000000100020000100011001101110010021000100011001101110010021000100011011100100210121000002001210120002200220020002001210120002200220020002001210102\"/><path class=\"arrow\" d=\"~MYUqU-E1LKf*D1L_U1AH1Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M129.58 229.76A40 40 0 0 0 118.75 231.26\"/><g class=\"arc-ticks\"><path d=\"~M!GpwVK1L0EY1\"/><path d=\"~M(JnN*K1LEfzW1\"/></g><path class=\"leader\" d=\"~MwDowSJ1L*x7XP4\"/></g></g><path class=\"leader\" d=\"M132.29 204.37L145 186H155\"/><circle class=\"anchor\" cx=\"132.29\" cy=\"204.37\" r=\"1.5\"/><path class=\"leader\" d=\"M113.41 249.95L77.5 266H67.5\"/><circle class=\"anchor\" cx=\"113.41\" cy=\"249.95\" r=\"1.5\"/><path class=\"leader\" d=\"M111.62 204.72L99.34 170H89.34\"/><circle class=\"anchor\" cx=\"111.62\" cy=\"204.72\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"lat-pulldown-n-chest\" data-key=\"chest\" data-cue=\"Lean back slightly and pull the bar past the face to the top of the chest.\" class=\"plate-callout two\" style=\"left:41.9%;top:45.81%\" aria-pressed=\"true\">Bar to<br>chest</button><button type=\"button\" id=\"lat-pulldown-n-elbows\" data-key=\"elbows\" data-cue=\"Drive the elbows down and back to the sides.\" class=\"plate-callout two\" style=\"left:2.79%;top:68.16%\" aria-pressed=\"false\">Elbows<br>down</button><button type=\"button\" id=\"lat-pulldown-n-down\" data-key=\"down\" data-cue=\"Keep the shoulders pulled down, away from the ears.\" class=\"plate-callout two\" style=\"left:2.79%;top:41.34%\" aria-pressed=\"false\">Shoulders<br>down</button><span class=\"plate-arc-label\" style=\"left:4.47%;top:55.31%\"><b>Lean back</b><span>about 15°</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"lat-pulldown-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"lat-pulldown-m-st-thigh.l\" d=\"^0\"/><path id=\"lat-pulldown-m-st-kneecap.l\" d=\"^1\"/><path id=\"lat-pulldown-m-st-shank.l\" d=\"^2\"/><path id=\"lat-pulldown-m-st-shcap.l\" d=\"^3\"/><path id=\"lat-pulldown-m-st-upper.l\" d=\"^4\"/><path id=\"lat-pulldown-m-st-elbowcap.l\" d=\"^5\"/><path id=\"lat-pulldown-m-st-fore.l\" d=\"^6\"/><path id=\"lat-pulldown-m-st-fist.l\" d=\"^7\"/><path id=\"lat-pulldown-m-st-head\" d=\"^8\"/><path id=\"lat-pulldown-m-st-torso\" d=\"^9\"/><path id=\"lat-pulldown-m-st-thigh.r\" d=\"^0\"/><path id=\"lat-pulldown-m-st-kneecap.r\" d=\"^1\"/><path id=\"lat-pulldown-m-st-shank.r\" d=\"^2\"/><path id=\"lat-pulldown-m-st-shcap.r\" d=\"^3\"/><path id=\"lat-pulldown-m-st-upper.r\" d=\"^4\"/><path id=\"lat-pulldown-m-st-elbowcap.r\" d=\"^5\"/><path id=\"lat-pulldown-m-st-fore.r\" d=\"^6\"/><path id=\"lat-pulldown-m-st-fist.r\" d=\"^7\"/><path id=\"lat-pulldown-m-g0-shcap.r\" d=\"^10\"/><path id=\"lat-pulldown-m-g0-upper.r\" d=\"^11\"/><path id=\"lat-pulldown-m-g0-elbowcap.r\" d=\"^12\"/><path id=\"lat-pulldown-m-g0-fore.r\" d=\"^13\"/><path id=\"lat-pulldown-m-g0-fist.r\" d=\"^14\"/><path id=\"lat-pulldown-m-g1-shcap.r\" d=\"^15\"/><path id=\"lat-pulldown-m-g1-upper.r\" d=\"^16\"/><path id=\"lat-pulldown-m-g1-elbowcap.r\" d=\"^17\"/><path id=\"lat-pulldown-m-g1-fore.r\" d=\"^18\"/><path id=\"lat-pulldown-m-g1-fist.r\" d=\"^19\"/><path id=\"lat-pulldown-m-g2-shcap.r\" d=\"^20\"/><path id=\"lat-pulldown-m-g2-upper.r\" d=\"^21\"/><path id=\"lat-pulldown-m-g2-elbowcap.r\" d=\"^22\"/><path id=\"lat-pulldown-m-g2-fore.r\" d=\"^23\"/><path id=\"lat-pulldown-m-g2-fist.r\" d=\"^24\"/><path id=\"lat-pulldown-m-e-thigh.l\" d=\"^25\"/><path id=\"lat-pulldown-m-e-kneecap.l\" d=\"^26\"/><path id=\"lat-pulldown-m-e-shank.l\" d=\"^27\"/><path id=\"lat-pulldown-m-e-foot.l\" d=\"^28\"/><path id=\"lat-pulldown-m-e-shcap.l\" d=\"^29\"/><path id=\"lat-pulldown-m-e-upper.l\" d=\"^30\"/><path id=\"lat-pulldown-m-e-elbowcap.l\" d=\"^31\"/><path id=\"lat-pulldown-m-e-fore.l\" d=\"^32\"/><path id=\"lat-pulldown-m-e-fist.l\" d=\"^33\"/><path id=\"lat-pulldown-m-e-head\" d=\"^34\"/><path id=\"lat-pulldown-m-e-torso\" d=\"^35\"/><path id=\"lat-pulldown-m-e-thigh.r\" d=\"^25\"/><path id=\"lat-pulldown-m-e-kneecap.r\" d=\"^26\"/><path id=\"lat-pulldown-m-e-shank.r\" d=\"^27\"/><path id=\"lat-pulldown-m-e-foot.r\" d=\"^28\"/><path id=\"lat-pulldown-m-e-shcap.r\" d=\"^29\"/><path id=\"lat-pulldown-m-e-upper.r\" d=\"^30\"/><path id=\"lat-pulldown-m-e-elbowcap.r\" d=\"^31\"/><path id=\"lat-pulldown-m-e-fore.r\" d=\"^32\"/><path id=\"lat-pulldown-m-e-fist.r\" d=\"^33\"/><path id=\"lat-pulldown-m-m-head\" d=\"~#w12HKb!Jz1)AaKBA1G1Sox7AiO9S4mF5)7O2BcV2OpK4O4Ob.6O5*cUbH8zlAb.hwgOaWmpPa_d0010100000000110100020010101110000002100000001100100200000010112\"/><path id=\"lat-pulldown-m-m-torso\" d=\"~#_12DGdJPE1RTcGID1Ij*8(4Wd(lHeF4T8AiF4H5-4Elxc)pU8R7U9YaTa!d)dDbGmS6Rl7X9BdI9XA1RgRkxh)9X4RmH4_rHjY6!3TdN1Rb_8Jb!nNb!5T3Kj_8D5TA1wF210220001210010001000212002100210010001100001000000000000000000020010000000000000000001001010100000000000001111110010\"/><path id=\"lat-pulldown-m-m-shcap.r\" d=\"~~URfwWG1PI10\"/><path id=\"lat-pulldown-m-m-upper.r\" d=\"~#F12DTfHHG1O_fxTF1w2X580R6(v_3B3!1T1Ja)hHd)dw4GeB4-ia-klI2X1T4VaWu91F1)5VbRcEi(iK5Uj_5Up00100011000000000001200000000100220000101011101200000000000021000011000000000000\"/><path id=\"lat-pulldown-m-m-elbowcap.r\" d=\"~~(DeN-O1!v2\"/><path id=\"lat-pulldown-m-m-fore.r\" d=\"~#F12_.fHTP1BEfKwR1)7J4uT1DrxqG8U2O22.lFh.cN2*7J6z5AcGl_hlN2G4U7HvElU1f.5_6Y4(7_jX3Ac-9Y7Ri00001121000012120010010020210100001000000000020000200100010121000000000000000222\"/><path id=\"lat-pulldown-m-m-fist.r\" d=\"~~S!k!NH1wt0\"/><path id=\"lat-pulldown-m-m-eq0\" d=\"~~wNlwyH1Ub1\"/><path id=\"lat-pulldown-m-m-eq1\" d=\"~MS-lyRK1L00QUb0UbTbLTbGT1Q0TbTbHT1LUbUbQRb0RbUbLSbHT1Q0UbSbGT1Z\"/><path id=\"lat-pulldown-m-mf-thigh.l\" d=\"~#F12FJoPYW1OxnV-W1Vay13D1w-17.6X5I3T2)O1.4EkBcGivGlAaEP17V3H2I7y5SY1y64z1TaB2xcWr!z1_lSw1U1wD1.h01010100000020000002000010001200000020001110000010011100000000020002000100000001\"/><path id=\"lat-pulldown-m-mf-kneecap.l\" d=\"~~AHy1NBV1UF11\"/><path id=\"lat-pulldown-m-mf-shank.l\" d=\"~#F12UFy1JBV1zJy1T_T1W1Tay11H4A-1N5B7P2O3E3V!1U6Ic2-aT6IcS3V!1K2R3K5z7R4w-1z12T1XaTbSaxcHm1Yj(bJm21000011000000010100000010001010000000010100000010100002000100000001010200100000\"/><path id=\"lat-pulldown-m-mf-foot.l\" d=\"^28\"/><path id=\"lat-pulldown-m-mf-shcap.l\" d=\"^89\"/><path id=\"lat-pulldown-m-mf-upper.l\" d=\"^90\"/><path id=\"lat-pulldown-m-mf-elbowcap.l\" d=\"^91\"/><path id=\"lat-pulldown-m-mf-fore.l\" d=\"^92\"/><path id=\"lat-pulldown-m-mf-fist.l\" d=\"^93\"/><path id=\"lat-pulldown-m-mf-thigh.r\" d=\"^96\"/><path id=\"lat-pulldown-m-mf-kneecap.r\" d=\"^97\"/><path id=\"lat-pulldown-m-mf-shank.r\" d=\"^98\"/><path id=\"lat-pulldown-m-mf-foot.r\" d=\"^28\"/><path id=\"lat-pulldown-m-mo-0\" d=\"^34\"/><path id=\"lat-pulldown-m-mo-1\" d=\"^35\"/><path id=\"lat-pulldown-m-mo-2\" d=\"^25\"/><path id=\"lat-pulldown-m-mo-3\" d=\"^26\"/><path id=\"lat-pulldown-m-mo-4\" d=\"^27\"/><path id=\"lat-pulldown-m-mo-5\" d=\"^28\"/><path id=\"lat-pulldown-m-mo-6\" d=\"^29\"/><path id=\"lat-pulldown-m-mo-7\" d=\"^30\"/><path id=\"lat-pulldown-m-mo-8\" d=\"^31\"/><path id=\"lat-pulldown-m-mo-9\" d=\"^32\"/><path id=\"lat-pulldown-m-mo-10\" d=\"^33\"/><path id=\"lat-pulldown-m-mo-11\" d=\"^25\"/><path id=\"lat-pulldown-m-mo-12\" d=\"^26\"/><path id=\"lat-pulldown-m-mo-13\" d=\"^27\"/><path id=\"lat-pulldown-m-mo-14\" d=\"^28\"/><path id=\"lat-pulldown-m-mo-15\" d=\"^29\"/><path id=\"lat-pulldown-m-mo-16\" d=\"^30\"/><path id=\"lat-pulldown-m-mo-17\" d=\"^31\"/><path id=\"lat-pulldown-m-mo-18\" d=\"^32\"/><path id=\"lat-pulldown-m-mo-19\" d=\"^33\"/><path id=\"lat-pulldown-m-mo-20\" d=\"^68\"/><path id=\"lat-pulldown-m-mo-21\" d=\"^69\"/><path id=\"lat-pulldown-m-mo-22\" d=\"^37\"/><path id=\"lat-pulldown-m-mo-23\" d=\"^40\"/><path id=\"lat-pulldown-m-mo-24\" d=\"^41\"/><path id=\"lat-pulldown-m-mo-25\" d=\"^42\"/><path id=\"lat-pulldown-m-mo-26\" d=\"^43\"/><path id=\"lat-pulldown-m-mo-27\" d=\"^44\"/><path id=\"lat-pulldown-m-mo-28\" d=\"^70\"/><path id=\"lat-pulldown-m-mo-29\" d=\"^71\"/><path id=\"lat-pulldown-m-mo-30\" d=\"^72\"/><path id=\"lat-pulldown-m-mo-31\" d=\"^71\"/><path id=\"lat-pulldown-m-mo-32\" d=\"^72\"/><path id=\"lat-pulldown-m-mo-33\" d=\"^45\"/><path id=\"lat-pulldown-m-mo-34\" d=\"^46\"/><path id=\"lat-pulldown-m-mo-35\" d=\"^47\"/><path id=\"lat-pulldown-m-mo-36\" d=\"^48\"/><path id=\"lat-pulldown-m-mo-37\" d=\"^50\"/><path id=\"lat-pulldown-m-mo-38\" d=\"^51\"/><path id=\"lat-pulldown-m-mo-39\" d=\"^65\"/><path id=\"lat-pulldown-m-mo-40\" d=\"^73\"/><path id=\"lat-pulldown-m-mo-41\" d=\"^75\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#lat-pulldown-m-dots)\"/>\n  <path class=\"floorline\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><path class=\"eq\" d=\"^38\"/><path class=\"eq\" d=\"^39\"/><path class=\"eq\" d=\"^40\"/><path class=\"eq\" d=\"^41\"/><path class=\"eq\" d=\"^42\"/><path class=\"eq\" d=\"^43\"/><path class=\"eq\" d=\"^44\"/><path class=\"eq-solid\" d=\"^45\"/><path class=\"eq-pin\" d=\"^46\"/><path class=\"eq-solid\" d=\"^47\"/><path class=\"eq-pin\" d=\"^48\"/><path class=\"eq-cable\" d=\"^49\"/><path class=\"eq\" d=\"^50\"/><path class=\"eq\" d=\"^51\"/><path class=\"eq-thin\" d=\"^52\"/><path class=\"eq-thin\" d=\"^53\"/><path class=\"eq-thin\" d=\"^54\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-m-st-thigh.l\"/><use href=\"#lat-pulldown-m-st-kneecap.l\"/><use href=\"#lat-pulldown-m-st-shank.l\"/><use href=\"#lat-pulldown-m-st-shcap.l\"/><use href=\"#lat-pulldown-m-st-upper.l\"/><use href=\"#lat-pulldown-m-st-elbowcap.l\"/><use href=\"#lat-pulldown-m-st-fore.l\"/><use href=\"#lat-pulldown-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-m-st-thigh.l\"/><use href=\"#lat-pulldown-m-st-kneecap.l\"/><use href=\"#lat-pulldown-m-st-shank.l\"/><use href=\"#lat-pulldown-m-st-shcap.l\"/><use href=\"#lat-pulldown-m-st-upper.l\"/><use href=\"#lat-pulldown-m-st-elbowcap.l\"/><use href=\"#lat-pulldown-m-st-fore.l\"/><use href=\"#lat-pulldown-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-m-st-head\"/><use href=\"#lat-pulldown-m-st-torso\"/><use href=\"#lat-pulldown-m-st-thigh.r\"/><use href=\"#lat-pulldown-m-st-kneecap.r\"/><use href=\"#lat-pulldown-m-st-shank.r\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-m-st-head\"/><use href=\"#lat-pulldown-m-st-torso\"/><use href=\"#lat-pulldown-m-st-thigh.r\"/><use href=\"#lat-pulldown-m-st-kneecap.r\"/><use href=\"#lat-pulldown-m-st-shank.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-m-st-shcap.r\"/><use href=\"#lat-pulldown-m-st-upper.r\"/><use href=\"#lat-pulldown-m-st-elbowcap.r\"/><use href=\"#lat-pulldown-m-st-fore.r\"/><use href=\"#lat-pulldown-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-m-st-shcap.r\"/><use href=\"#lat-pulldown-m-st-upper.r\"/><use href=\"#lat-pulldown-m-st-elbowcap.r\"/><use href=\"#lat-pulldown-m-st-fore.r\"/><use href=\"#lat-pulldown-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"^56\"/><path class=\"eq-cable\" d=\"^57\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-m-g0-shcap.r\"/><use href=\"#lat-pulldown-m-g0-upper.r\"/><use href=\"#lat-pulldown-m-g0-elbowcap.r\"/><use href=\"#lat-pulldown-m-g0-fore.r\"/><use href=\"#lat-pulldown-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-m-g0-shcap.r\"/><use href=\"#lat-pulldown-m-g0-upper.r\"/><use href=\"#lat-pulldown-m-g0-elbowcap.r\"/><use href=\"#lat-pulldown-m-g0-fore.r\"/><use href=\"#lat-pulldown-m-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^58\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"^59\"/><path class=\"eq-cable\" d=\"^60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-m-g1-shcap.r\"/><use href=\"#lat-pulldown-m-g1-upper.r\"/><use href=\"#lat-pulldown-m-g1-elbowcap.r\"/><use href=\"#lat-pulldown-m-g1-fore.r\"/><use href=\"#lat-pulldown-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-m-g1-shcap.r\"/><use href=\"#lat-pulldown-m-g1-upper.r\"/><use href=\"#lat-pulldown-m-g1-elbowcap.r\"/><use href=\"#lat-pulldown-m-g1-fore.r\"/><use href=\"#lat-pulldown-m-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^61\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"^62\"/><path class=\"eq-cable\" d=\"^63\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-m-g2-shcap.r\"/><use href=\"#lat-pulldown-m-g2-upper.r\"/><use href=\"#lat-pulldown-m-g2-elbowcap.r\"/><use href=\"#lat-pulldown-m-g2-fore.r\"/><use href=\"#lat-pulldown-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-m-g2-shcap.r\"/><use href=\"#lat-pulldown-m-g2-upper.r\"/><use href=\"#lat-pulldown-m-g2-elbowcap.r\"/><use href=\"#lat-pulldown-m-g2-fore.r\"/><use href=\"#lat-pulldown-m-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^64\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"^65\"/><path class=\"eq-thin\" d=\"^66\"/><path class=\"eq-cable\" d=\"^67\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-m-e-thigh.l\"/><use href=\"#lat-pulldown-m-e-kneecap.l\"/><use href=\"#lat-pulldown-m-e-shank.l\"/><use href=\"#lat-pulldown-m-e-foot.l\"/><use href=\"#lat-pulldown-m-e-shcap.l\"/><use href=\"#lat-pulldown-m-e-upper.l\"/><use href=\"#lat-pulldown-m-e-elbowcap.l\"/><use href=\"#lat-pulldown-m-e-fore.l\"/><use href=\"#lat-pulldown-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-m-e-thigh.l\"/><use href=\"#lat-pulldown-m-e-kneecap.l\"/><use href=\"#lat-pulldown-m-e-shank.l\"/><use href=\"#lat-pulldown-m-e-foot.l\"/><use href=\"#lat-pulldown-m-e-shcap.l\"/><use href=\"#lat-pulldown-m-e-upper.l\"/><use href=\"#lat-pulldown-m-e-elbowcap.l\"/><use href=\"#lat-pulldown-m-e-fore.l\"/><use href=\"#lat-pulldown-m-e-fist.l\"/></g></g><path class=\"eq\" d=\"^68\"/><path class=\"eq\" d=\"^69\"/><path class=\"eq\" d=\"^70\"/><path class=\"eq\" d=\"^71\"/><path class=\"eq-pin\" d=\"^72\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-m-e-head\"/><use href=\"#lat-pulldown-m-e-torso\"/><use href=\"#lat-pulldown-m-e-thigh.r\"/><use href=\"#lat-pulldown-m-e-kneecap.r\"/><use href=\"#lat-pulldown-m-e-shank.r\"/><use href=\"#lat-pulldown-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-m-e-head\"/><use href=\"#lat-pulldown-m-e-torso\"/><use href=\"#lat-pulldown-m-e-thigh.r\"/><use href=\"#lat-pulldown-m-e-kneecap.r\"/><use href=\"#lat-pulldown-m-e-shank.r\"/><use href=\"#lat-pulldown-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^73\"/><path class=\"eq-cable\" d=\"^74\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-m-e-shcap.r\"/><use href=\"#lat-pulldown-m-e-upper.r\"/><use href=\"#lat-pulldown-m-e-elbowcap.r\"/><use href=\"#lat-pulldown-m-e-fore.r\"/><use href=\"#lat-pulldown-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#lat-pulldown-m-e-shcap.r\"/><use href=\"#lat-pulldown-m-e-upper.r\"/><use href=\"#lat-pulldown-m-e-elbowcap.r\"/><use href=\"#lat-pulldown-m-e-fore.r\"/><use href=\"#lat-pulldown-m-e-fist.r\"/></g></g><path class=\"eq\" d=\"^71\"/><path class=\"eq-pin\" d=\"^72\"/><path class=\"eq-solid\" d=\"^75\"/><circle class=\"joint\" cx=\"113.19\" cy=\"211.51\" r=\"2.25\"/><circle class=\"joint\" cx=\"113.41\" cy=\"249.95\" r=\"2.25\"/><circle class=\"joint\" cx=\"129.58\" cy=\"269.76\" r=\"2.25\"/><circle class=\"joint\" cx=\"186.37\" cy=\"272.4\" r=\"2.25\"/></g><mask id=\"lat-pulldown-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#lat-pulldown-m-m-head\" fill=\"#000\"/><use href=\"#lat-pulldown-m-m-torso\" fill=\"#000\"/><use href=\"#lat-pulldown-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#lat-pulldown-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#lat-pulldown-m-mf-shank.l\" fill=\"#000\"/><use href=\"#lat-pulldown-m-mf-foot.l\" fill=\"#000\"/><use href=\"#lat-pulldown-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#lat-pulldown-m-mf-upper.l\" fill=\"#000\"/><use href=\"#lat-pulldown-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#lat-pulldown-m-mf-fore.l\" fill=\"#000\"/><use href=\"#lat-pulldown-m-mf-fist.l\" fill=\"#000\"/><use href=\"#lat-pulldown-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#lat-pulldown-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#lat-pulldown-m-mf-shank.r\" fill=\"#000\"/><use href=\"#lat-pulldown-m-mf-foot.r\" fill=\"#000\"/><use href=\"#lat-pulldown-m-m-shcap.r\" fill=\"#000\"/><use href=\"#lat-pulldown-m-m-upper.r\" fill=\"#000\"/><use href=\"#lat-pulldown-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#lat-pulldown-m-m-fore.r\" fill=\"#000\"/><use href=\"#lat-pulldown-m-m-fist.r\" fill=\"#000\"/><use href=\"#lat-pulldown-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-36\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-37\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-38\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-39\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-40\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lat-pulldown-m-mo-41\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#lat-pulldown-m-mmask)\"><g class=\"u-stroke\"><use href=\"#lat-pulldown-m-m-head\"/><use href=\"#lat-pulldown-m-m-torso\"/><use href=\"#lat-pulldown-m-m-shcap.r\"/><use href=\"#lat-pulldown-m-m-upper.r\"/><use href=\"#lat-pulldown-m-m-elbowcap.r\"/><use href=\"#lat-pulldown-m-m-fore.r\"/><use href=\"#lat-pulldown-m-m-fist.r\"/><use href=\"#lat-pulldown-m-m-eq0\"/><use href=\"#lat-pulldown-m-m-eq1\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MS-lwyH1Lyy6Iyu\"/><path class=\"m-arrow\" d=\"M98.07 204.84A70 70 0 0 0 71.8 224.28M72.59 219.34L71.8 224.28L76.76 223.66\"/><path class=\"m-arrow\" d=\"~MHyg(wF1L0OX2MYiwpLXi)oL0wS1\"/><path class=\"leader m\" d=\"~MYDgwzN1LKG5Xi\"/><path class=\"leader m\" d=\"M82.29 188.95L66.51 162H56.51\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"lat-pulldown-m-swing\" data-key=\"swing\" data-cue=\"The torso swings far back to heave the weight down.\" class=\"plate-callout two m\" style=\"left:2.23%;top:58.94%\" aria-pressed=\"true\">Swing<br>back</button><button type=\"button\" id=\"lat-pulldown-m-shrug\" data-key=\"shrug\" data-cue=\"The shoulders creep up toward the ears.\" class=\"plate-callout m\" style=\"left:2.23%;top:39.11%\" aria-pressed=\"false\">Shrug</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "chest",
        cues: [{ key: "chest", cue: "Lean back slightly and pull the bar past the face to the top of the chest." }, { key: "elbows", cue: "Drive the elbows down and back to the sides." }, { key: "down", cue: "Keep the shoulders pulled down, away from the ears." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "swing",
        cues: [{ key: "swing", cue: "The torso swings far back to heave the weight down." }, { key: "shrug", cue: "The shoulders creep up toward the ears." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Swing back</b><span>The torso swings far back to heave the weight down.</span></li><li><b>Shrug</b><span>The shoulders creep up toward the ears.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 1 second, hold 0.5 seconds, return 2 seconds, rest 0.5 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:0.5 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>0.5 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:0.5 1 0\"><i></i><div class=\"tempo-label\"><b>Rest</b><span>0.5 s</span></div></div></div>",
      alt: "Lat pulldown, side view. Seated with the thighs under the knee pad, the wide bar is pulled from straight arms overhead down in front of the face to the upper chest, with a slight lean back.",
      mistakeAlt: "Lat Pulldown: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "pull",
    "orientation": "pronated",
    "handle": "bar-28",
    "loadAxis": "across",
    "overBody": false,
    "handleChoice": {
      "sore": "Sore wrist? Use the neutral-grip handles.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "buonsenso2025"
        ],
        "note": "The card: with a sore wrist, use the neutral handles, go lighter, stop if it hurts (consensus). Buonsenso 2025: no lat difference between grips, so the swap costs nothing."
      }
    },
    "width": {
      "text": "About 1.5 times shoulder width, often on or just inside the bar's bends. At the bottom your forearms are close to vertical. If a wrist bends hard sideways, move your hands onto or off the bends.",
      "claim": {
        "tags": [
          "DATA",
          "MECH"
        ],
        "sources": [
          "andersen2014",
          "lusk2010",
          "difonza2026"
        ],
        "note": "Width barely changes lat activity (Lusk, Andersen, Di Fonza); the widest grip costs a little strength (Andersen). The bent ends keeping the wrist straight is mechanical reasoning only (card)."
      }
    },
    "thumb": {
      "mode": "wrapped",
      "options": [
        {
          "mode": "over",
          "when": "If your forearms give out before your back"
        }
      ],
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "baechle-earle"
        ],
        "note": "No study has measured thumb position on a pulldown. Full grip follows the NSCA editors; thumb on top is coaching consensus. A pulldown bar cannot fall on the lifter, so thumb on top is a comfort choice only (C4 allows `over` for `pull`)."
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        25
      ],
      "dev": [
        -10,
        10
      ],
      "limitText": "Wrist curling, or bar slipping to your fingertips? Finish the rep and end the set.",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "odriscoll1992"
        ],
        "note": "O'Driscoll 1992 (a dynamometer, applied by reasoning): grip strongest 25 to 35 degrees back, weakest curled. The near-straight target and the end-the-set limit are consensus, not injury thresholds."
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
      "handle": {
        "profile": "bar-28",
        "axis": "across"
      },
      "load": {
        "kind": "pull"
      }
    },
    "faults": [
      {
        "key": "curled-squeeze",
        "label": "Curled, squeezed",
        "pose": {
          "wrist": {
            "ext": -30,
            "dev": 0
          },
          "contactAt": 0.8,
          "squeeze": "max",
          "thumb": "wrapped"
        },
        "markers": [
          "lever-arc",
          "tendon"
        ],
        "alt": "Wrist curled forward, knuckles tipping back toward the face. Fist squeezed hard, forearm tendons standing out. The forearms and biceps end up doing the pulling."
      },
      {
        "key": "fingertip-slip",
        "label": "Slipping out",
        "pose": {
          "wrist": {
            "ext": 40,
            "dev": 0
          },
          "contactAt": 1.45,
          "fingers": {
            "curl": 1,
            "open": 0.45
          },
          "thumb": "loose"
        },
        "markers": [
          "slip-arrow"
        ],
        "alt": "Bar slid out to the fingertips, fingers half open, thumb loose, the hand pulled back. The grip is failing: finish the rep and end the set."
      }
    ],
    "gripLine": "Hook the bar at the base of your fingers, wrist straight. Pull with your elbows so your back does more.",
    "cue": "Hands are hooks. Elbows pull."
  },
  contacts: [
    "seat-back",
    "brace-pad"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Snug the knee pad so you can't lift off.",
      "zoom": "pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-pulldown"
        ]
      }
    },
    {
      "kind": "safety",
      "text": "Push the pin fully in. Start light.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-pulldown"
        ],
        "note": "Pin and \"start lighter\": card consensus; ACE covers the setup, not the pin wording."
      }
    },
    {
      "kind": "grip",
      "text": "Hands about 1.5 times shoulder width, palms away, thumb wrapped.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "baechle-earle",
          "andersen2014"
        ]
      }
    },
    {
      "kind": "position",
      "text": "Lean back slightly, about 30 degrees at most.",
      "zoom": "path",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-pulldown"
        ]
      }
    },
    {
      "kind": "brace",
      "text": "Shoulders down, away from your ears. Then pull.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-pulldown"
        ]
      }
    }
  ],
  posture: [
    {
      "key": "pad",
      "label": "Thighs under pad",
      "detail": "Pad firm on the tops of the thighs, just above the knees, feet flat. Hips stay on the seat all set.",
      "anchor": {
        "at": "thighTop.r"
      },
      "zoom": "pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-pulldown"
        ]
      }
    },
    {
      "key": "lean",
      "label": "Slight lean back",
      "detail": "Torso tipped back a little from the hips, no more than about 30 degrees. Chest up, lower back in its normal curve. The lean stays the same every rep, with no extra lean as you pull.",
      "anchor": {
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "ace-lat-pulldown",
          "buonsenso2025"
        ],
        "note": "Shown by the plate: the measured lean (about 15 degrees) and the Mistake layer (swing back)."
      }
    },
    {
      "key": "shoulders",
      "label": "Shoulders down",
      "detail": "At the top, arms straight, the shoulders first draw down and slightly back. Then the elbows bend.",
      "anchor": {
        "at": "shoulderTop.r",
        "pose": "start"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-pulldown"
        ],
        "note": "Already a plate callout (\"Shoulders down\"); the card's back-view \"shoulder blades\" zoom needs a back-view plate."
      }
    },
    {
      "key": "path",
      "label": "Bar in front",
      "detail": "The bar travels past your chin to the top of your chest. Never behind the head.",
      "anchor": {
        "at": "chin"
      },
      "zoom": "path",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "sperandei2009",
          "signorile2002",
          "padovan2024",
          "kolber2013"
        ]
      }
    },
    {
      "key": "elbows",
      "label": "Elbows down",
      "detail": "At the bottom the elbows point at the floor, beside the ribs. Forearms near vertical under the bar. Stop when the elbows stop going down and start going back. The bar need not touch your chest.",
      "anchor": {
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-pulldown"
        ],
        "note": "Plate callout \"Elbows down\". The shoulders rolling forward past that point is reasoning (card)."
      }
    },
    {
      "key": "wrists",
      "label": "Wrists straight",
      "detail": "Back of the hand in line with the forearm, or tipped back a little. Bar at the base of the fingers, no curl.",
      "anchor": {
        "at": "grip.r"
      },
      "zoom": "hand",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "odriscoll1992"
        ]
      }
    },
    {
      "key": "width",
      "label": "Grip width",
      "detail": "Hands about 1.5 times shoulder width, on or just inside the bar's bends. At the bottom, forearms close to vertical, wrists straight side to side.",
      "anchor": {
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "DATA",
          "MECH"
        ],
        "sources": [
          "andersen2014",
          "lusk2010"
        ],
        "note": "Front view: text checkpoint. The plate is a side view, where width does not show (5.2)."
      }
    }
  ],
  zooms: [
    {
      "key": "hand",
      "chip": "Hand",
      "heading": "Hand: right and wrong",
      "kind": "hand",
      "feelRow": "arms"
    },
    {
      "key": "pad",
      "chip": "Knee pad",
      "heading": "Knee pad: right and wrong",
      "kind": "posture",
      "feelRow": "low-back"
    },
    {
      "key": "path",
      "chip": "Bar path",
      "heading": "Bar path: right and wrong",
      "kind": "posture",
      "feelRow": "pinch"
    }
  ],
  chips: [
    "hand",
    "pad",
    "path",
    "feel"
  ],
  copy: {
    "setupLine": "Snug the knee pad on your thighs. Lean back a little, shoulders down, then pull to your chest.",
    "mistakeLine": "Pull to the front, never behind your neck. That puts your shoulders in a bad spot for no gain."
  },
  mistakes: [
    {
      "key": "behind",
      "title": "Pulling behind your neck",
      "zoom": "path",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "kolber2013",
          "signorile2002",
          "sperandei2009"
        ]
      },
      "fix": "Pull in front of your face, to your upper chest."
    },
    {
      "key": "curl",
      "title": "Curling wrists, squeezing hard",
      "zoom": "hand",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "odriscoll1992"
        ]
      },
      "fix": "Straighten your wrist. Grip only as hard as needed."
    },
    {
      "key": "swing",
      "title": "Leaning back and swinging",
      "zoom": "pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-pulldown"
        ]
      },
      "fix": "Hold a small lean still and go lighter."
    }
  ],
  risks: [
    {
      "key": "behind",
      "text": "Behind-the-neck pulling is linked to a looser front shoulder.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "kolber2013"
        ],
        "note": "Association, not proof of cause."
      }
    },
    {
      "key": "swing",
      "text": "Rocking uses your lower back and jerks your shoulders.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-pulldown"
        ]
      }
    },
    {
      "key": "too-far",
      "text": "Pulling past where your elbows stop stresses the shoulder joint.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-pulldown"
        ]
      }
    }
  ],
  riskFlags: [
    "wrist",
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
    "signorile2002",
    "lusk2010",
    "andersen2014",
    "sperandei2009",
    "padovan2024",
    "snyder2009",
    "lehman2004",
    "buonsenso2025",
    "difonza2026",
    "doma2013",
    "kolber2013",
    "kolber2010",
    "odriscoll1992",
    "ace-lat-pulldown",
    "baechle-earle",
    "nhs-wrist-pain",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "grip/research/lat_pulldown.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

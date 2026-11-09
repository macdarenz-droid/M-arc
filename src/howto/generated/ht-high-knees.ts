// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=8b75a0d97339d3e8234e35c8015990a76baafc1eb946d1c7add909c5ca246fe9
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_high_knees",
  name: "High Knees",
  hashes: { inputsSha256: "8b75a0d97339d3e8234e35c8015990a76baafc1eb946d1c7add909c5ca246fe9", golden: "c79bae2fdad372f32cfe317fddf36698496ded664b491ead7c30a5e6459d2a64" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"high-knees-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"high-knees-n-st-thigh.l\" d=\"~#F12!wz1FDF1I)y1xXD1B1.bG10iY(1J6R7!2X3w5*U1PdKmsBkBbOn3BV1O2z4R5)7O6J(1H14J2VbVuEdXn_E1X1!z1yk_G110000000020021200012001000210100000002100000202200001120020101100000000001200000\"/><path id=\"high-knees-n-st-kneecap.l\" d=\"~~HNz1NRU1_J10\"/><path id=\"high-knees-n-st-shank.l\" d=\"~#F12(Nz1HzU1.wA1KXS1H5XaD1eOeN*1y8V5!3*2Yg*w2ybVaW3Kb-2Ef(nT(1K1R4G3I9-nS_1z1d_1XbVfF7BkNjT6YkD5Pr00111000000001010101010100020000012001000000001011100020000002000201111200010000\"/><path id=\"high-knees-n-st-foot.l\" d=\"~#o2WDw1AB)1EYw1zB(1YcF3Uhx8Sp)nU-2B3-J2-4ID1)7)n2TG1Y4Bb-c_sBbKmSp021002110110100101000020000200100111000010111100\"/><path id=\"high-knees-n-st-shcap.l\" d=\"~~S*z1!-qwP10\"/><path id=\"high-knees-n-st-upper.l\" d=\"~#F12S*z1!-qO(z1zWpe)8a2N2SO1A3*5N1*2Y5RD1yaVi0OgxaViX5RD1K1*2z3*5K2SO192d)8BgvXdPp0PmYdPp02000100000000000010100101000000000000210100000020101000000100020000000020000000\"/><path id=\"high-knees-n-st-elbowcap.l\" d=\"~~JHA1PzA1Dz10\"/><path id=\"high-knees-n-st-fore.l\" d=\"~#F12!FA1yDA1*GA1.Gz1y1Kaq!1S6AI1!2T9N1K2.1*w1w6EdpzbX7GcX2*w1X1B2B4x9dUI1l!1I2zazaiz9DkD1Fh!b_i11010112000200000010101000000010021001110000200000020000000020210100010200020010\"/><path id=\"high-knees-n-st-fist.l\" d=\"~~JzB1_.K1ww10\"/><path id=\"high-knees-n-st-head\" d=\"~#w12SKB1!-gI_z1EPgBjDjBjS9BbB3E3_4X4)7x8BbRhKm_4XcT1T9Bj0NmBbHmK6!kF3Dj(fT1Fj0001010100001000000000101000200002000000002000100002200000020000\"/><path id=\"high-knees-n-st-torso\" d=\"~#_12S*z1!RlBEA1KzkR9K6B30S9ShU9N6YcwgN60I6)nKm)7Xc_4(f-4_kI6NmxgShRh_4R9)7xgBrBz1EbBrG60V90!cwgA3w8Xc)7)fw8K6_kN6J6_cBbA3w8zT2ww100012101000100000200000220022000022000000000000100000000000001000000000022101200000010000000001010000000001000022002\"/><path id=\"high-knees-n-st-thigh.r\" d=\"^0\"/><path id=\"high-knees-n-st-kneecap.r\" d=\"^1\"/><path id=\"high-knees-n-st-shank.r\" d=\"^2\"/><path id=\"high-knees-n-st-foot.r\" d=\"^3\"/><path id=\"high-knees-n-st-shcap.r\" d=\"^4\"/><path id=\"high-knees-n-st-upper.r\" d=\"^5\"/><path id=\"high-knees-n-st-elbowcap.r\" d=\"^6\"/><path id=\"high-knees-n-st-fore.r\" d=\"^7\"/><path id=\"high-knees-n-st-fist.r\" d=\"^8\"/><path id=\"high-knees-n-g0-shcap.l\" d=\"~~Yyz1FxqwP10\"/><path id=\"high-knees-n-g0-upper.l\" d=\"~#F12DDz1yTq--y1RRp.2K883!jHI1oV68G3*8.B1J2xlx6IfIgTdRjVx1K2B2B5G4NfyK174X3z8Kfw5E3_sJ8!kAmWi01000011000101002020000200000001001000000020021210010100202001010020000000001001\"/><path id=\"high-knees-n-g0-elbowcap.l\" d=\"~~(*D1UVy1Dz10\"/><path id=\"high-knees-n-g0-fore.l\" d=\"~#F12_TE1!Xz1X_D1*Hz1)8G5y20YG1NcK7V6T1G2RuKcK9*aKaz4Ie_1)uRbX2m*93DE1wjP1J1Bax2.3H9Pe(gwgF6ymX202020002200000101010000000000021002000001000002001000000220000001002001200000000\"/><path id=\"high-knees-n-g0-fist.l\" d=\"~~wBP1(DD1ww10\"/><path id=\"high-knees-n-g0-thigh.r\" d=\"~#F12yDz1WOG1R*x1IXF1VaI5nw1AV1Wx1)2K9O1O4-G1*w1ObOnKgVb.pI3XJ1.sX40-9a(P1HE1ox1O8G8XrSiPkSG1Dt(kwN1!500101000002002100002200210010000001100010000020020101000010000000001010000002100\"/><path id=\"high-knees-n-g0-kneecap.r\" d=\"~~_AK1FVN1_J10\"/><path id=\"high-knees-n-g0-shank.r\" d=\"~#F12YzK1ANN1XNK1xwK1U3GbF14.4w)1A7.6F3K3W6-y2F9Gc!1-bz5ReweVx2z2E4V4V8OeN*1E152*bKeU9*gHmG3NlF9Nq20000020010020000000000000001000000000001012001000000000002000020000110101001000\"/><path id=\"high-knees-n-g0-foot.r\" d=\"~#o2FYI1wX-1-GJ1)WY1YcD3Uh)7Sp)nU-2B3-J2-4ID1)7)n2TG1Y4Bb-c_sBbKmUp001100110010100000000000000200100110101010101001\"/><path id=\"high-knees-n-e-thigh.l\" d=\"~#F12FIx1H!D1BBx1OKB1I2VbG12U6P(1P5z8U2x41BV1AbTntzkKdImB5*U1.2-3K6O79_(1D11H1.b-vEa.j(G1Y1!z1(nWE100010110000022001000200000011002000010000000001010000100000100000000200000010100\"/><path id=\"high-knees-n-e-kneecap.l\" d=\"~~J(y1ywT1_J10\"/><path id=\"high-knees-n-e-shank.l\" d=\"~#F12_*y1FWS1OIz1.FR1H4BbF1aT8S(1S7K6P3G3PaBy2wa-bP2VbB4.eYhTw2.1O4z4.8xiP!1E19o.b)eW8BiHlR4FlY7(q00000000000010010101010010100000100000120001002200001000012000000000000002000010\"/><path id=\"high-knees-n-e-foot.l\" d=\"~#o2HBx1HX*1T(x1)!!1SbN6Ajz3!uTgJX2Ak*F2Oo)y1VhBnB6KG1z6O7GfYuG3Gs(i100000200000111000000000000000101001000000101011\"/><path id=\"high-knees-n-e-shcap.l\" d=\"~~(Ey1SFpwP10\"/><path id=\"high-knees-n-e-upper.l\" d=\"~#F12DVy1UGqG*x1xOpX5-667Sy1(w1-1R6vz3Im.vT5KkIb)bzkV6Xu.nx3B1I6z2wvAA138R6B6KcNaU7!rPfJgSrw902010100010000010000121000001010010120020000000000000100201010000001000002000010\"/><path id=\"high-knees-n-e-elbowcap.l\" d=\"~~_xG1Fww1Dz10\"/><path id=\"high-knees-n-e-fore.l\" d=\"~#F12H(H1(_w1.EH1xJx1V8_5q-1AtOw1E9!3-2gBoJm)d_3z8Y7R4YdRnynj_2G4w9!x1Kr!1lE6H8!6N7Nl.5Pc.b!6xl20101010100100100002000021010101200001000000000000001000000121010100010000001000\"/><path id=\"high-knees-n-e-fist.l\" d=\"~~(EP1SFpww10\"/><path id=\"high-knees-n-e-head\" d=\"~#w12(Xz1SFfVAy1*(eEjAjEjW9zbE3E3_4X4)7)7BbThKmY4XcO1T9Ej0JmBbNmK6YkF3Fj(fT1Fj0001101002002000002000001010001002200110000010010010000000020000\"/><path id=\"high-knees-n-e-torso\" d=\"~#_12(Ey1SwkORy1BSiT9I6E30U9UhU9J6_cwgJ60K6)nGm)7.c_4wg-4!kK6Hm*fUhTh_4T9)7*fBrEz1BbBrK60R90YcwgF3w8.c)7*fw8I6_kH6J6!cBbD3w8ET2ww100000210020002002000001000100000000010000000201012000000000220000000000000101000000000100000202000101020000010000000\"/><path id=\"high-knees-n-e-thigh.r\" d=\"~#F12DUA1wwG1-Gz1-UG1Gay6gD1y-1IqO9R2T4B1KS1Dh-px3.iN7-g(jOP1!lV2w4)4N8P.1-jbz1TbS2gJx1wN1J5Px1Bd(tIz110101200200100000200001000210100100002020002000020001002200101000202102200000200\"/><path id=\"high-knees-n-e-kneecap.r\" d=\"~~YXK1SFy1_J10\"/><path id=\"high-knees-n-e-shank.r\" d=\"~#F12AWK1SFy1.-K1G-w1_1-bF11!4y)1(5*7Y2.3V3xz2F7Rd0)bG7Rd_3xz2-2.3*5*7*4y)1B11-1-b-cWbEdYo0UlDdYo00010100010000000000020100100200000200200112100000100001002101000000020000120020\"/><path id=\"high-knees-n-e-foot.r\" d=\"~#o2YEN1(NK1I-N1*NJ1!cF3Phx8Wp)nS-2B3-J2-4ID1)7)n2TG1Y4Bb-c_sBbKmSp020022110100000000000000000200100111101010111100\"/><path id=\"high-knees-n-e-shcap.r\" d=\"^24\"/><path id=\"high-knees-n-e-upper.r\" d=\"~#F12DVy1PEoONz1ENnP6B688zvAA1N6z2A3B1Uu.nFkV6Hb)bU5KkJm.vw1z3Y1R6Ky1(w197!5-6xb.bOrw9KfJgV7!r00002000200100002020000012002111100000000002100001200011000101020000202200000100\"/><path id=\"high-knees-n-e-elbowcap.r\" d=\"~~YEsFww1Dz10\"/><path id=\"high-knees-n-e-fore.r\" d=\"~#F12SRs(_w1G)rKBw1E6I8!1q!x1JrG4x9jV2RnznR4Xdz8X7)d-3BoKm-2bE9*3AtPw1q_1V8-5)6D7!6DlPc_bNl!500210000021000010002000000001000000000210002000110000010111010200110000101000000\"/><path id=\"high-knees-n-e-fist.r\" d=\"~~!Kz1wYD1ww10\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#high-knees-n-dots)\"/>\n  <path class=\"floorline\" d=\"M87.6 339.5H321.66\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#high-knees-n-st-thigh.l\"/><use href=\"#high-knees-n-st-kneecap.l\"/><use href=\"#high-knees-n-st-shank.l\"/><use href=\"#high-knees-n-st-foot.l\"/><use href=\"#high-knees-n-st-shcap.l\"/><use href=\"#high-knees-n-st-upper.l\"/><use href=\"#high-knees-n-st-elbowcap.l\"/><use href=\"#high-knees-n-st-fore.l\"/><use href=\"#high-knees-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#high-knees-n-st-thigh.l\"/><use href=\"#high-knees-n-st-kneecap.l\"/><use href=\"#high-knees-n-st-shank.l\"/><use href=\"#high-knees-n-st-foot.l\"/><use href=\"#high-knees-n-st-shcap.l\"/><use href=\"#high-knees-n-st-upper.l\"/><use href=\"#high-knees-n-st-elbowcap.l\"/><use href=\"#high-knees-n-st-fore.l\"/><use href=\"#high-knees-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#high-knees-n-st-head\"/><use href=\"#high-knees-n-st-torso\"/><use href=\"#high-knees-n-st-thigh.r\"/><use href=\"#high-knees-n-st-kneecap.r\"/><use href=\"#high-knees-n-st-shank.r\"/><use href=\"#high-knees-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#high-knees-n-st-head\"/><use href=\"#high-knees-n-st-torso\"/><use href=\"#high-knees-n-st-thigh.r\"/><use href=\"#high-knees-n-st-kneecap.r\"/><use href=\"#high-knees-n-st-shank.r\"/><use href=\"#high-knees-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#high-knees-n-st-shcap.r\"/><use href=\"#high-knees-n-st-upper.r\"/><use href=\"#high-knees-n-st-elbowcap.r\"/><use href=\"#high-knees-n-st-fore.r\"/><use href=\"#high-knees-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#high-knees-n-st-shcap.r\"/><use href=\"#high-knees-n-st-upper.r\"/><use href=\"#high-knees-n-st-elbowcap.r\"/><use href=\"#high-knees-n-st-fore.r\"/><use href=\"#high-knees-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#high-knees-n-g0-shcap.l\"/><use href=\"#high-knees-n-g0-upper.l\"/><use href=\"#high-knees-n-g0-elbowcap.l\"/><use href=\"#high-knees-n-g0-fore.l\"/><use href=\"#high-knees-n-g0-fist.l\"/></g><g class=\"u-fill\"><use href=\"#high-knees-n-g0-shcap.l\"/><use href=\"#high-knees-n-g0-upper.l\"/><use href=\"#high-knees-n-g0-elbowcap.l\"/><use href=\"#high-knees-n-g0-fore.l\"/><use href=\"#high-knees-n-g0-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#high-knees-n-g0-thigh.r\"/><use href=\"#high-knees-n-g0-kneecap.r\"/><use href=\"#high-knees-n-g0-shank.r\"/><use href=\"#high-knees-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#high-knees-n-g0-thigh.r\"/><use href=\"#high-knees-n-g0-kneecap.r\"/><use href=\"#high-knees-n-g0-shank.r\"/><use href=\"#high-knees-n-g0-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#high-knees-n-e-thigh.l\"/><use href=\"#high-knees-n-e-kneecap.l\"/><use href=\"#high-knees-n-e-shank.l\"/><use href=\"#high-knees-n-e-foot.l\"/><use href=\"#high-knees-n-e-shcap.l\"/><use href=\"#high-knees-n-e-upper.l\"/><use href=\"#high-knees-n-e-elbowcap.l\"/><use href=\"#high-knees-n-e-fore.l\"/><use href=\"#high-knees-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#high-knees-n-e-thigh.l\"/><use href=\"#high-knees-n-e-kneecap.l\"/><use href=\"#high-knees-n-e-shank.l\"/><use href=\"#high-knees-n-e-foot.l\"/><use href=\"#high-knees-n-e-shcap.l\"/><use href=\"#high-knees-n-e-upper.l\"/><use href=\"#high-knees-n-e-elbowcap.l\"/><use href=\"#high-knees-n-e-fore.l\"/><use href=\"#high-knees-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#high-knees-n-e-head\"/><use href=\"#high-knees-n-e-torso\"/><use href=\"#high-knees-n-e-thigh.r\"/><use href=\"#high-knees-n-e-kneecap.r\"/><use href=\"#high-knees-n-e-shank.r\"/><use href=\"#high-knees-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#high-knees-n-e-head\"/><use href=\"#high-knees-n-e-torso\"/><use href=\"#high-knees-n-e-thigh.r\"/><use href=\"#high-knees-n-e-kneecap.r\"/><use href=\"#high-knees-n-e-shank.r\"/><use href=\"#high-knees-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#high-knees-n-e-shcap.r\"/><use href=\"#high-knees-n-e-upper.r\"/><use href=\"#high-knees-n-e-elbowcap.r\"/><use href=\"#high-knees-n-e-fore.r\"/><use href=\"#high-knees-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#high-knees-n-e-shcap.r\"/><use href=\"#high-knees-n-e-upper.r\"/><use href=\"#high-knees-n-e-elbowcap.r\"/><use href=\"#high-knees-n-e-fore.r\"/><use href=\"#high-knees-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"183.03\" cy=\"129.37\" r=\"2.25\"/><circle class=\"joint\" cx=\"150.23\" cy=\"163.88\" r=\"2.25\"/><circle class=\"joint\" cx=\"183.03\" cy=\"198.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"241.37\" cy=\"175.45\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#J20WDE1WEU1-XD1VIU11j7j3l7j7l7h9j9hbj9hdfbjddfhddfdffhbhbhdh9j9h7jbl5h5l7j3l5l1l3j0l1l0j0n4j200000012000000100101000000020010100000200000002100000000000002000001001010101010100000000202200100101000200100000001111000111000000001000100000010000101\"/><path class=\"arrow\" d=\"~MNYO1FXz1L(pwx1LV(1OpZ\"/></g><path class=\"leader\" d=\"~MS*F1!-qL0IY3\"/><circle class=\"anchor\" cx=\"209.53\" cy=\"137.26\" r=\"1.5\"/><path class=\"leader\" d=\"~MSAO1SFy1LDN3Gf\"/><circle class=\"anchor\" cx=\"241.37\" cy=\"175.45\" r=\"1.5\"/><path class=\"leader\" d=\"M190 329.62L245 322H255\"/><circle class=\"anchor\" cx=\"190\" cy=\"329.62\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"high-knees-n-chest\" data-key=\"chest\" data-cue=\"Stand tall, eyes ahead, core braced.\" class=\"plate-callout\" style=\"left:58.66%;top:23.74%\" aria-pressed=\"true\">Chest tall</button><button type=\"button\" id=\"high-knees-n-thigh\" data-key=\"thigh\" data-cue=\"Knee up to hip height or a little above, opposite arm pumping.\" class=\"plate-callout\" style=\"left:70.95%;top:42.18%\" aria-pressed=\"false\">Thigh to hip</button><button type=\"button\" id=\"high-knees-n-balls\" data-key=\"balls\" data-cue=\"Soft knees, springing from the ball of one foot to the other.\" class=\"plate-callout\" style=\"left:69.83%;top:83.8%\" aria-pressed=\"false\">Balls of feet</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"high-knees-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"high-knees-m-st-thigh.l\" d=\"^0\"/><path id=\"high-knees-m-st-kneecap.l\" d=\"^1\"/><path id=\"high-knees-m-st-shank.l\" d=\"^2\"/><path id=\"high-knees-m-st-foot.l\" d=\"^3\"/><path id=\"high-knees-m-st-shcap.l\" d=\"^4\"/><path id=\"high-knees-m-st-upper.l\" d=\"^5\"/><path id=\"high-knees-m-st-elbowcap.l\" d=\"^6\"/><path id=\"high-knees-m-st-fore.l\" d=\"^7\"/><path id=\"high-knees-m-st-fist.l\" d=\"^8\"/><path id=\"high-knees-m-st-head\" d=\"^9\"/><path id=\"high-knees-m-st-torso\" d=\"^10\"/><path id=\"high-knees-m-st-thigh.r\" d=\"^0\"/><path id=\"high-knees-m-st-kneecap.r\" d=\"^1\"/><path id=\"high-knees-m-st-shank.r\" d=\"^2\"/><path id=\"high-knees-m-st-foot.r\" d=\"^3\"/><path id=\"high-knees-m-st-shcap.r\" d=\"^4\"/><path id=\"high-knees-m-st-upper.r\" d=\"^5\"/><path id=\"high-knees-m-st-elbowcap.r\" d=\"^6\"/><path id=\"high-knees-m-st-fore.r\" d=\"^7\"/><path id=\"high-knees-m-st-fist.r\" d=\"^8\"/><path id=\"high-knees-m-g0-shcap.l\" d=\"^11\"/><path id=\"high-knees-m-g0-upper.l\" d=\"^12\"/><path id=\"high-knees-m-g0-elbowcap.l\" d=\"^13\"/><path id=\"high-knees-m-g0-fore.l\" d=\"^14\"/><path id=\"high-knees-m-g0-fist.l\" d=\"^15\"/><path id=\"high-knees-m-g0-thigh.r\" d=\"^16\"/><path id=\"high-knees-m-g0-kneecap.r\" d=\"^17\"/><path id=\"high-knees-m-g0-shank.r\" d=\"^18\"/><path id=\"high-knees-m-g0-foot.r\" d=\"^19\"/><path id=\"high-knees-m-e-thigh.l\" d=\"^20\"/><path id=\"high-knees-m-e-kneecap.l\" d=\"^21\"/><path id=\"high-knees-m-e-shank.l\" d=\"^22\"/><path id=\"high-knees-m-e-foot.l\" d=\"^23\"/><path id=\"high-knees-m-e-shcap.l\" d=\"^24\"/><path id=\"high-knees-m-e-upper.l\" d=\"^25\"/><path id=\"high-knees-m-e-elbowcap.l\" d=\"^26\"/><path id=\"high-knees-m-e-fore.l\" d=\"^27\"/><path id=\"high-knees-m-e-fist.l\" d=\"^28\"/><path id=\"high-knees-m-e-head\" d=\"^29\"/><path id=\"high-knees-m-e-torso\" d=\"^30\"/><path id=\"high-knees-m-e-thigh.r\" d=\"^31\"/><path id=\"high-knees-m-e-kneecap.r\" d=\"^32\"/><path id=\"high-knees-m-e-shank.r\" d=\"^33\"/><path id=\"high-knees-m-e-foot.r\" d=\"^34\"/><path id=\"high-knees-m-e-shcap.r\" d=\"^24\"/><path id=\"high-knees-m-e-upper.r\" d=\"^35\"/><path id=\"high-knees-m-e-elbowcap.r\" d=\"^36\"/><path id=\"high-knees-m-e-fore.r\" d=\"^37\"/><path id=\"high-knees-m-e-fist.r\" d=\"^38\"/><path id=\"high-knees-m-m-head\" d=\"~#w12WRs_EhO)qTVh-8Up)cAhObw2pW5X7x5BcR6RpIcG1VdV5.7BhN8Df*jHhRfAkB6Fo(5w7(h1000210200001101000000000000220010000222001010000000001001011111\"/><path id=\"high-knees-m-m-torso\" d=\"~#_12AGtNBmI*sOXkObR1-2J1HgUbNbS1PiY8w7B4-k*hIvP3RaJ8JeR8UiEb!h.k_cIlH2OaTbRd*y1RrIhVnGaR9Rs-1SqwvJ6Y5)eR1.aDeJ3SlS8!2S6TfN6Y5-!1Fx220000101000010001000100010000000020000010100000000000011100010101000000000001010010001000001000200000000002000000000\"/><path id=\"high-knees-m-m-thigh.l\" d=\"~#F12!Wz1_(D1IVz1VOB1G1-bE10eY(1J6O7!2-3D5*U1JdImy1BkBbRn0zV1O2z4T5z8O6P(1F12J2VbRuGd*nYE1X1(z1!j!G101101000020001200010010101100100000000020001200000002000210101000010120002100100\"/><path id=\"high-knees-m-m-kneecap.l\" d=\"~~SzA1yHT1_J10\"/><path id=\"high-knees-m-m-shank.l\" d=\"~#F12DAA1!.S1BWA1xPR1H5VaD1cTeN*1A8V5Y3.2wh.w2ybXaW3Kb-2BfyoT(1I1R4G3G9*nN_1z1b!1-bXfD7EkPjR6Ukw5Ur01010000010101000000020220100010100000000000001010010000200101010000000100000020\"/><path id=\"high-knees-m-m-shcap.l\" d=\"~~(KvJEqwP10\"/><path id=\"high-knees-m-m-upper.l\" d=\"~#F12A.vPFrBzv)Kq-5X665Sy1_w1-1K6x1B3Gm.vR5OkKb*bzkT6Xu)nx3z1K6z2AvAA178K6B6OcNaU7(rPfFgPrA920000000000001000011110020210010100020001100000000000002000000000011010100000001\"/><path id=\"high-knees-m-m-elbowcap.l\" d=\"~~YED1A)w1Dz10\"/><path id=\"high-knees-m-m-fore.l\" d=\"~#F12HAF1Y-x1*KE1.Hy1T8_5s-1wtOw1z9(3.2cBoNm)d_3z8Y7R4YdTnAnfW2I4y9!x1Ir!1pE6J8!6N7Nl.5Nc-bw7Bl20002020001000002210010101010100001010000020010002001001000002010110100000210102\"/><path id=\"high-knees-m-m-fist.l\" d=\"~~!KK1JEqww10\"/><path id=\"high-knees-m-m-thigh.r\" d=\"~#F12FPE1yxG1BJD1O)G1K8H8ky1yR1GE1-99.42TJ1!s*pF3Kg_bObJn-G1(w1R1S4.2J9wV1Tx1lvVaJ5U8Dw1(K1.5Ft.kPkTG120200002000000000000000200011000000100110110000000100002001012000012100000000101\"/><path id=\"high-knees-m-m-kneecap.r\" d=\"~~YVN1U(v_J10\"/><path id=\"high-knees-m-m-shank.r\" d=\"~#F12PVN1!Gw1VKN1B.uz1-bD19(j!.1(3x9Y1K4*jzw2!3)e*2TbIaKbRc.x2T3z3V7E6PaH(1B18T4)aT9Pe.6ArF5yl_iYk00001000100100210000001011200100002002000000200021210101000000000000000101000001\"/><path id=\"high-knees-m-m-foot.r\" d=\"~#o2H*R1JxI1VDS1z(G1Fd2Af)byjOtAW2XoVI2!dBE1S1EnY5EE1_e*d-9FpXhRfFu010022000202000010101000002000000000010002000100\"/><path id=\"high-knees-m-m-shcap.r\" d=\"^50\"/><path id=\"high-knees-m-m-upper.r\" d=\"~#F12NNvNNqzHv*Hpp*881J9YN1F2G6w1B30*D1F7)jO2EgTcxhIbGB1.1V2)3I5U4JO174-1-8BgH1-9HrH3DmHhFn02210101010000020000011000200010020121010100000002010000200011000110100000000020\"/><path id=\"high-knees-m-m-elbowcap.r\" d=\"~~PDx1YKz1Dz10\"/><path id=\"high-knees-m-m-fore.r\" d=\"~#F12AOy1DSA1)Sx1ITA1Ia3Y1x1NH1-9X9B2R2B1Vw1J4Td*4zbY1TbS8Tw1H5x2w2V8_4PI1.2(1e*9D3J1ya(kS7(gR2(hEd11002000000000012000000001000002001100100002000021000001010100010000001010000001\"/><path id=\"high-knees-m-m-fist.r\" d=\"~~J)H1Y)x1ww10\"/><path id=\"high-knees-m-mf-foot.l\" d=\"^23\"/><path id=\"high-knees-m-mo-0\" d=\"^29\"/><path id=\"high-knees-m-mo-1\" d=\"^30\"/><path id=\"high-knees-m-mo-2\" d=\"^20\"/><path id=\"high-knees-m-mo-3\" d=\"^21\"/><path id=\"high-knees-m-mo-4\" d=\"^22\"/><path id=\"high-knees-m-mo-5\" d=\"^23\"/><path id=\"high-knees-m-mo-6\" d=\"^24\"/><path id=\"high-knees-m-mo-7\" d=\"^25\"/><path id=\"high-knees-m-mo-8\" d=\"^26\"/><path id=\"high-knees-m-mo-9\" d=\"^27\"/><path id=\"high-knees-m-mo-10\" d=\"^28\"/><path id=\"high-knees-m-mo-11\" d=\"^31\"/><path id=\"high-knees-m-mo-12\" d=\"^32\"/><path id=\"high-knees-m-mo-13\" d=\"^33\"/><path id=\"high-knees-m-mo-14\" d=\"^34\"/><path id=\"high-knees-m-mo-15\" d=\"^24\"/><path id=\"high-knees-m-mo-16\" d=\"^35\"/><path id=\"high-knees-m-mo-17\" d=\"^36\"/><path id=\"high-knees-m-mo-18\" d=\"^37\"/><path id=\"high-knees-m-mo-19\" d=\"^38\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#high-knees-m-dots)\"/>\n  <path class=\"floorline\" d=\"^39\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#high-knees-m-st-thigh.l\"/><use href=\"#high-knees-m-st-kneecap.l\"/><use href=\"#high-knees-m-st-shank.l\"/><use href=\"#high-knees-m-st-foot.l\"/><use href=\"#high-knees-m-st-shcap.l\"/><use href=\"#high-knees-m-st-upper.l\"/><use href=\"#high-knees-m-st-elbowcap.l\"/><use href=\"#high-knees-m-st-fore.l\"/><use href=\"#high-knees-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#high-knees-m-st-thigh.l\"/><use href=\"#high-knees-m-st-kneecap.l\"/><use href=\"#high-knees-m-st-shank.l\"/><use href=\"#high-knees-m-st-foot.l\"/><use href=\"#high-knees-m-st-shcap.l\"/><use href=\"#high-knees-m-st-upper.l\"/><use href=\"#high-knees-m-st-elbowcap.l\"/><use href=\"#high-knees-m-st-fore.l\"/><use href=\"#high-knees-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#high-knees-m-st-head\"/><use href=\"#high-knees-m-st-torso\"/><use href=\"#high-knees-m-st-thigh.r\"/><use href=\"#high-knees-m-st-kneecap.r\"/><use href=\"#high-knees-m-st-shank.r\"/><use href=\"#high-knees-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#high-knees-m-st-head\"/><use href=\"#high-knees-m-st-torso\"/><use href=\"#high-knees-m-st-thigh.r\"/><use href=\"#high-knees-m-st-kneecap.r\"/><use href=\"#high-knees-m-st-shank.r\"/><use href=\"#high-knees-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#high-knees-m-st-shcap.r\"/><use href=\"#high-knees-m-st-upper.r\"/><use href=\"#high-knees-m-st-elbowcap.r\"/><use href=\"#high-knees-m-st-fore.r\"/><use href=\"#high-knees-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#high-knees-m-st-shcap.r\"/><use href=\"#high-knees-m-st-upper.r\"/><use href=\"#high-knees-m-st-elbowcap.r\"/><use href=\"#high-knees-m-st-fore.r\"/><use href=\"#high-knees-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#high-knees-m-g0-shcap.l\"/><use href=\"#high-knees-m-g0-upper.l\"/><use href=\"#high-knees-m-g0-elbowcap.l\"/><use href=\"#high-knees-m-g0-fore.l\"/><use href=\"#high-knees-m-g0-fist.l\"/></g><g class=\"u-fill\"><use href=\"#high-knees-m-g0-shcap.l\"/><use href=\"#high-knees-m-g0-upper.l\"/><use href=\"#high-knees-m-g0-elbowcap.l\"/><use href=\"#high-knees-m-g0-fore.l\"/><use href=\"#high-knees-m-g0-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#high-knees-m-g0-thigh.r\"/><use href=\"#high-knees-m-g0-kneecap.r\"/><use href=\"#high-knees-m-g0-shank.r\"/><use href=\"#high-knees-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#high-knees-m-g0-thigh.r\"/><use href=\"#high-knees-m-g0-kneecap.r\"/><use href=\"#high-knees-m-g0-shank.r\"/><use href=\"#high-knees-m-g0-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#high-knees-m-e-thigh.l\"/><use href=\"#high-knees-m-e-kneecap.l\"/><use href=\"#high-knees-m-e-shank.l\"/><use href=\"#high-knees-m-e-foot.l\"/><use href=\"#high-knees-m-e-shcap.l\"/><use href=\"#high-knees-m-e-upper.l\"/><use href=\"#high-knees-m-e-elbowcap.l\"/><use href=\"#high-knees-m-e-fore.l\"/><use href=\"#high-knees-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#high-knees-m-e-thigh.l\"/><use href=\"#high-knees-m-e-kneecap.l\"/><use href=\"#high-knees-m-e-shank.l\"/><use href=\"#high-knees-m-e-foot.l\"/><use href=\"#high-knees-m-e-shcap.l\"/><use href=\"#high-knees-m-e-upper.l\"/><use href=\"#high-knees-m-e-elbowcap.l\"/><use href=\"#high-knees-m-e-fore.l\"/><use href=\"#high-knees-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#high-knees-m-e-head\"/><use href=\"#high-knees-m-e-torso\"/><use href=\"#high-knees-m-e-thigh.r\"/><use href=\"#high-knees-m-e-kneecap.r\"/><use href=\"#high-knees-m-e-shank.r\"/><use href=\"#high-knees-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#high-knees-m-e-head\"/><use href=\"#high-knees-m-e-torso\"/><use href=\"#high-knees-m-e-thigh.r\"/><use href=\"#high-knees-m-e-kneecap.r\"/><use href=\"#high-knees-m-e-shank.r\"/><use href=\"#high-knees-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#high-knees-m-e-shcap.r\"/><use href=\"#high-knees-m-e-upper.r\"/><use href=\"#high-knees-m-e-elbowcap.r\"/><use href=\"#high-knees-m-e-fore.r\"/><use href=\"#high-knees-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#high-knees-m-e-shcap.r\"/><use href=\"#high-knees-m-e-upper.r\"/><use href=\"#high-knees-m-e-elbowcap.r\"/><use href=\"#high-knees-m-e-fore.r\"/><use href=\"#high-knees-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"183.03\" cy=\"129.37\" r=\"2.25\"/><circle class=\"joint\" cx=\"150.23\" cy=\"163.88\" r=\"2.25\"/><circle class=\"joint\" cx=\"183.03\" cy=\"198.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"241.37\" cy=\"175.45\" r=\"2.25\"/></g><mask id=\"high-knees-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#high-knees-m-m-head\" fill=\"#000\"/><use href=\"#high-knees-m-m-torso\" fill=\"#000\"/><use href=\"#high-knees-m-m-thigh.l\" fill=\"#000\"/><use href=\"#high-knees-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#high-knees-m-m-shank.l\" fill=\"#000\"/><use href=\"#high-knees-m-mf-foot.l\" fill=\"#000\"/><use href=\"#high-knees-m-m-shcap.l\" fill=\"#000\"/><use href=\"#high-knees-m-m-upper.l\" fill=\"#000\"/><use href=\"#high-knees-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#high-knees-m-m-fore.l\" fill=\"#000\"/><use href=\"#high-knees-m-m-fist.l\" fill=\"#000\"/><use href=\"#high-knees-m-m-thigh.r\" fill=\"#000\"/><use href=\"#high-knees-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#high-knees-m-m-shank.r\" fill=\"#000\"/><use href=\"#high-knees-m-m-foot.r\" fill=\"#000\"/><use href=\"#high-knees-m-m-shcap.r\" fill=\"#000\"/><use href=\"#high-knees-m-m-upper.r\" fill=\"#000\"/><use href=\"#high-knees-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#high-knees-m-m-fore.r\" fill=\"#000\"/><use href=\"#high-knees-m-m-fist.r\" fill=\"#000\"/><use href=\"#high-knees-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#high-knees-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#high-knees-m-mmask)\"><g class=\"u-stroke\"><use href=\"#high-knees-m-m-head\"/><use href=\"#high-knees-m-m-torso\"/><use href=\"#high-knees-m-m-thigh.l\"/><use href=\"#high-knees-m-m-kneecap.l\"/><use href=\"#high-knees-m-m-shank.l\"/><use href=\"#high-knees-m-m-shcap.l\"/><use href=\"#high-knees-m-m-upper.l\"/><use href=\"#high-knees-m-m-elbowcap.l\"/><use href=\"#high-knees-m-m-fore.l\"/><use href=\"#high-knees-m-m-fist.l\"/><use href=\"#high-knees-m-m-thigh.r\"/><use href=\"#high-knees-m-m-kneecap.r\"/><use href=\"#high-knees-m-m-shank.r\"/><use href=\"#high-knees-m-m-foot.r\"/><use href=\"#high-knees-m-m-shcap.r\"/><use href=\"#high-knees-m-m-upper.r\"/><use href=\"#high-knees-m-m-elbowcap.r\"/><use href=\"#high-knees-m-m-fore.r\"/><use href=\"#high-knees-m-m-fist.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~M(Xz1HPdLED7F)1MAjXoLzjYoLDP1Gd\"/><path class=\"leader m\" d=\"M152.01 137.61L143.08 146H133.08\"/><path class=\"leader m\" d=\"M246.16 155.62L259 142H269\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"high-knees-m-arch\" data-key=\"arch\" data-cue=\"The lower back arches and the trunk tips back.\" class=\"plate-callout m\" style=\"left:11.17%;top:34.64%\" aria-pressed=\"true\">Back arches</button><button type=\"button\" id=\"high-knees-m-high\" data-key=\"high\" data-cue=\"The knee is driven so high that the lower back arches.\" class=\"plate-callout two m\" style=\"left:73.74%;top:33.52%\" aria-pressed=\"false\">Knee<br>too high</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "chest",
        cues: [{ key: "chest", cue: "Stand tall, eyes ahead, core braced." }, { key: "thigh", cue: "Knee up to hip height or a little above, opposite arm pumping." }, { key: "balls", cue: "Soft knees, springing from the ball of one foot to the other." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "arch",
        cues: [{ key: "arch", cue: "The lower back arches and the trunk tips back." }, { key: "high", cue: "The knee is driven so high that the lower back arches." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Back arches</b><span>The lower back arches and the trunk tips back.</span></li><li><b>Knee too high</b><span>The knee is driven so high that the lower back arches.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: work 30 seconds, rest 30 seconds\"><div class=\"tempo-seg move\" style=\"flex:30 1 0\"><i></i><div class=\"tempo-label\"><b>Work</b><span>30 s</span></div></div><div class=\"tempo-seg\" style=\"flex:30 1 0\"><i></i><div class=\"tempo-label\"><b>Rest</b><span>30 s</span></div></div></div>",
      alt: "High knees, side view. Standing tall on the balls of the feet, the right knee drives up to waist height while the left arm pumps forward. The trunk stays upright.",
      mistakeAlt: "High Knees: the common mistake, drawn dashed in the mistake colour over the correct end position.",
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
      "text": "Stand tall, feet about hip-width apart, arms at your sides.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hl-hk",
          "bb-hk"
        ],
        "note": "card c1, c4"
      }
    },
    {
      "kind": "brace",
      "text": "Brace your trunk, shift onto the balls of your feet, knees soft.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hl-hk",
          "bb-hk"
        ],
        "note": "card c1, c4"
      }
    },
    {
      "kind": "position",
      "text": "Drive one knee to hip height as the opposite arm pumps up.",
      "zoom": "knee-height",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hl-hk",
          "ace-cardio15",
          "bb-hk"
        ],
        "note": "card c2, c3"
      }
    },
    {
      "kind": "position",
      "text": "Lower it quickly and switch legs.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hl-hk",
          "ace-cardio15"
        ],
        "note": "card c2"
      }
    },
    {
      "kind": "finish",
      "text": "To start, work 30 seconds, then rest 30 seconds.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hl-hk"
        ],
        "note": "card c8"
      }
    }
  ],
  posture: [
    {
      "key": "chest",
      "label": "Chest tall",
      "detail": "Chest tall, eyes ahead.",
      "anchor": {
        "pose": "start",
        "at": "sternum"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hl-hk"
        ],
        "note": "card c1"
      }
    },
    {
      "key": "thigh",
      "label": "Thigh to hip",
      "detail": "Thigh up to about hip height.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "knee-height",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hl-hk",
          "ace-cardio15",
          "bb-hk"
        ],
        "note": "card c2, c3"
      }
    },
    {
      "key": "back",
      "label": "Braced trunk",
      "detail": "Lower back doesn't arch. Brace your trunk, knee at hip height.",
      "anchor": {
        "pose": "end",
        "at": "lumbar"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-hk"
        ],
        "note": "card c5, c3"
      }
    },
    {
      "key": "balls",
      "label": "Balls of feet",
      "detail": "On the balls of your feet, knees soft.",
      "anchor": {
        "pose": "end",
        "at": "ball.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-hk"
        ],
        "note": "card c4"
      }
    },
    {
      "key": "drops",
      "label": "Dropping knees",
      "detail": "Knee height slowly drops? Take a short rest.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-hk"
        ],
        "note": "card c6"
      }
    },
    {
      "key": "turn-out",
      "label": "Legs turning out",
      "detail": "Legs turn out more and more as you tire? Take a break.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-hk"
        ],
        "note": "card c7"
      }
    }
  ],
  zooms: [
    {
      "key": "knee-height",
      "chip": "Knee height",
      "heading": "Knee height",
      "kind": "posture"
    }
  ],
  chips: [
    "knee-height",
    "feel"
  ],
  copy: {
    "setupLine": "Stand tall, feet about hip-width, on the balls of your feet. Brace your trunk.",
    "mistakeLine": "Don't drive the knees so high your back arches. Keep the knee at hip height.",
    "cueLine": "Thigh to hip, chest tall."
  },
  mistakes: [],
  risks: [
    {
      "key": "arch",
      "text": "Driving the knees too high arches the lower back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-hk"
        ],
        "note": "card c5"
      }
    },
    {
      "key": "shoes",
      "text": "Wear supportive shoes. Knee or ankle issues? Use a gym floor or grass.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hl-hk"
        ],
        "note": "card c10"
      }
    },
    {
      "key": "tire",
      "text": "Knee height dropping, or legs turning out more as you tire? Take a rest.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-hk"
        ],
        "note": "card c6, c7"
      }
    }
  ],
  riskFlags: [],
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
    "hl-hk",
    "bb-hk",
    "ace-cardio15"
  ],
  research: {
    "card": "docs/research/howto/cards/high_knees.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

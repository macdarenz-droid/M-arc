// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=33c7499fba6dbdc95ec341edb865924671e6d8bb7e27f4a44f75f43ef0da6bb3
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_dumbbell_romanian_deadlift",
  name: "Dumbbell Romanian Deadlift",
  hashes: { inputsSha256: "33c7499fba6dbdc95ec341edb865924671e6d8bb7e27f4a44f75f43ef0da6bb3", golden: "2eb73ec70f8b6eb5ae2c2f748859a7f89c17e6367eb836d6a2950c3ea330198d" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-romanian-deadlift-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-romanian-deadlift-n-st-head\" d=\"~#w12wTx1YPg-)vzEgBjDjBjS9BbB3E3_4X4)7x8BbRhIm_4.cT1R9Bj0NmBbHmK6!kF3DjwgT1Aj0000010000001000000000121000000100000000000000100002200000000100\"/><path id=\"dumbbell-romanian-deadlift-n-st-torso\" d=\"~#_12wzw1YFlTJw1G_jR9K6B30S9ShU9N6YcwgN60I6)nKm)7Xc_4(f-4_kI6NmxgShRh_4R9)7xgBrBz1EbBrG60V90!cwgA3w8Xc)7)fw8K6_kN6J6_cBbA3w8zT2ww100012101000100000200000220022000122200100000000000000000000000001000000022101200000010000000001210000000001000020002\"/><path id=\"dumbbell-romanian-deadlift-n-st-thigh.r\" d=\"~#F12FDv!zF1RwvxVD1G2TbE10w6P(1U5)7U2z4czV1NbKnrEkBdKmX4*U1.2-3G6T7t_(1F11J1-bVvRaEkYG1P1!z1Pn(E120020000111002120001200220200000000002001010000110111100010000111100010001001001\"/><path id=\"dumbbell-romanian-deadlift-n-st-kneecap.r\" d=\"~~yWw1FFU1_J10\"/><path id=\"dumbbell-romanian-deadlift-n-st-shank.r\" d=\"~#F12UVw1A(T1Tzx1.PS1H4xbH16x9S(1S7I6P3E3wbBy2AaVbU2Vbz4.eFiRw2.1K4)3*8TiH!1z17o.b)eS8IiDlV4DlP7wr10020020010002000000100020200020002002100010000220000100200200002101000000100000\"/><path id=\"dumbbell-romanian-deadlift-n-st-foot.r\" d=\"~#o2FPuDB)1.xvEB(1_cF3Ph)7Sp*nF-2E3OJ2-4BD1)7)n0IG1_4zbXcWsEbImUp000022001200120001010000001000002000020000000001\"/><path id=\"dumbbell-romanian-deadlift-n-st-shcap.r\" d=\"~~wzw1YPqwP10\"/><path id=\"dumbbell-romanian-deadlift-n-st-upper.r\" d=\"~#F12Szw1!XqE)v-UprX8a3J9FN1F2G6w1z32BD1A7xkI2Eg-c)gBbRA1*1T2)3K5U4wO190X1V8Bgw1-9HrH3DmNhDn12021000000000010100101010001000000012210100100101001200012101200010100101010100\"/><path id=\"dumbbell-romanian-deadlift-n-st-elbowcap.r\" d=\"~~P.x1YTz1Dz10\"/><path id=\"dumbbell-romanian-deadlift-n-st-fore.r\" d=\"~#F12H.x1_*z1VWx1Kyz1z1BaH1S1(eFF1u-9sV2G8zvA3Bex3XaxaOaB9.uB2X1*5*7F8AH15y2I4I9*9F2-4YlY4PgJfyg00000000201010000000100000000002000000020012100011100002000120000200022000100200\"/><path id=\"dumbbell-romanian-deadlift-n-st-fist.r\" d=\"~~WSA1W!J1ww10\"/><path id=\"dumbbell-romanian-deadlift-n-g0-head\" d=\"~#w12UAG1NJjz!E1VIi)pY7KljG8z8z5W2dE9X1Xd.4)rJa)8y3E9.gx9ypoWm(4_gYcJ9DnRaAg0001000022200000000000100100020021100000000000111000022000101000\"/><path id=\"dumbbell-romanian-deadlift-n-g0-torso\" d=\"~#_12FSB1P.mVPD1EXlK5za-2O12wkP5DaU3DkN5w3A6-nEfzhRdT1Ngw3JlW3Hrx4UnV7U8K64-hE8XI1H2GtE6X1O7K2(4_hvS8K7zd.hfRfFfU2U8UgX3x1S8IY2Eb01000200000001200000000000000121002100001010010020010100001002000000000020000020000020200000001000000000001010020001\"/><path id=\"dumbbell-romanian-deadlift-n-g0-thigh.r\" d=\"~#F12UYrHTF1XHrBDE1G4zbE18(gP!1D4)8_1I4)8KU1y7xpI4Xjxh-j)dET1O3E3O7G6Da(*1D19p-b*w1-4RcWJ1Y7wz1FuDz102001000101010010000002100000000001111000000202002000110001000002000000010100200\"/><path id=\"dumbbell-romanian-deadlift-n-g0-kneecap.r\" d=\"~~WIvDxU1_J10\"/><path id=\"dumbbell-romanian-deadlift-n-g0-shank.r\" d=\"~#F12JHvy!T1GTvRKS1y3ObF14z2A)1Y6B7F3R3U3)y2_8VcJ1*b-5IeDbzy2I2E4)4K8-by(1E15f*b)dFa*fwnK2UlNawq00101000000000000020020000002000211011000010002000200001010000020001100010000021\"/><path id=\"dumbbell-romanian-deadlift-n-g0-foot.r\" d=\"~#o2FPuAB)1.xvzB(1_cF3Shx8Pp)nF-2B3OJ2-4ED1)7.n2KG1Y4Bb-cWsBbEmSp020022010100000101000000000220000101101000210110\"/><path id=\"dumbbell-romanian-deadlift-n-g0-shcap.r\" d=\"~~!!y1ADswP10\"/><path id=\"dumbbell-romanian-deadlift-n-g0-upper.r\" d=\"~#F12(!y1Azsxwz1*)qw1-880fAO1P3V5U1.2A8EB1Dbxiy1Kg.8GjK3*B1B1z3.2)5E5YN1922*8xgK2EfUoK1JmycJq00000010012000000101200020000000000012000000000210000000021111000200000010120002\"/><path id=\"dumbbell-romanian-deadlift-n-g0-elbowcap.r\" d=\"~~FXy1PIB1Dz10\"/><path id=\"dumbbell-romanian-deadlift-n-g0-fore.r\" d=\"~#F12YVy1HGB1I_y1-KA1H2xak!1uwI1A4*8Y1E2H2Ew1W7IciBb)5zdJ1Iw1I1I2x3O9)5WH1r_1z1Eaxaz1VbwjvAhJ9Ak02101010001001000020001200022012002000100100201110000000000000200000020001012000\"/><path id=\"dumbbell-romanian-deadlift-n-g0-fist.r\" d=\"~~DFy1DwO1ww10\"/><path id=\"dumbbell-romanian-deadlift-n-g1-head\" d=\"~#w12WzN1DNrROK1B(pRqI5Ri-aO3zb-51y4G8w5*c(8*qJdz3A7R6Oa)fUlPcUhDf_8AjX2!o)gD92002000101000011100200010010000001002002200100001000200020001100\"/><path id=\"dumbbell-romanian-deadlift-n-g1-torso\" d=\"~#_12JHG1W-sKWH1BFs4Ob-1V2I9Wh1PbI6SjA3y5yhKh)4IlGbR7Jd(9NhwdDqS8UoY3Sa.1A8*fFcXH1DfzpB6O3K5X2K1yg*4y7dxfIf*8*ky6-1!8JgP4*4A7KF2*T102022000000000000100100100000000010000000100021000000001000010000210020020002020010111101000201111010000101000010100\"/><path id=\"dumbbell-romanian-deadlift-n-g1-thigh.r\" d=\"~#F12!NoAIG1._nKwF1-5Iaz1eFpP-1_2K9F1T4GgTS1P3.pz7.iTjEh)kXP1)3X2G8E5_i(.1y1dG2VbKx11z6(K1ScWx1(y1Su01000021000000000022001010000000100000020010000000000011110020001000001010000001\"/><path id=\"dumbbell-romanian-deadlift-n-g1-kneecap.r\" d=\"~~STt((T1_J10\"/><path id=\"dumbbell-romanian-deadlift-n-g1-shank.r\" d=\"~#F12wStNwU1EUtzRS1N1-bF13_6!(1Y5z8U2*3-5.y2_6.db*bX7IdU1zz2-2-3G6T7-2y)1E10B2VbKcycOcypoYlweFo00000001001012000000222100101000000001200000001002000001000000000011000000000001\"/><path id=\"dumbbell-romanian-deadlift-n-g1-foot.r\" d=\"~#o2DPuAB)1XxvzB(1_cF3Phx8Pp)nF-2B3OJ2-4ED1)7.n2OG1Y4zb-cWsBbGmSp020002010100000100000000000200000101001010011100\"/><path id=\"dumbbell-romanian-deadlift-n-g1-shcap.r\" d=\"~~NFA1D(w1wP10\"/><path id=\"dumbbell-romanian-deadlift-n-g1-upper.r\" d=\"~#F12PGA1HUw1VRA1)RvF2O8a2I7PN1H4z5y2R2JdVz1WdGgJ3xg*5KkA2xD1pB3.1I6)bPK1b1N1V8Rf.4ViFmT4(lA8_r00100200000000010000000000111000000101000001010020010011010000101000020000100000\"/><path id=\"dumbbell-romanian-deadlift-n-g1-elbowcap.r\" d=\"~~WYy1!*G1Dz10\"/><path id=\"dumbbell-romanian-deadlift-n-g1-fore.r\" d=\"~#F12_Xy1NWG1Gwz1*.F1W3T9aw2B5YH1F5I8A2.1w7TvF9zbH2)az4.dA6-vz1R2R1-9zcJG1z1U1aGaX9O2GewhK3(gF6Fl00101110020220110000200000001100000000010100200001000010011100002200000000010021\"/><path id=\"dumbbell-romanian-deadlift-n-g1-fist.r\" d=\"~~A*w1WJT1ww10\"/><path id=\"dumbbell-romanian-deadlift-n-e-thigh.l\" d=\"~#F12_ElSIH1GOkEzG1.6V9B1iJvNW1Y1V9mX4RlRP1kxqx9xiGl)eBqGN1B4E2.8G4ypS-1A1hT3GbEx1P3z1HN1ygAw1wD1Uq00002000000121001000000000001000210100101000100010000000000000001000000010000001\"/><path id=\"dumbbell-romanian-deadlift-n-e-kneecap.l\" d=\"~~_OryEU1_J10\"/><path id=\"dumbbell-romanian-deadlift-n-e-shank.l\" d=\"~#F12DOrPPU1EGrOxT1j*bF17ShW!1F4*8(1K4Ih-w2J4XeI2-b)9-b)9Gy2K3G3O7O6y8U(1B1aB4Ebzaye)7(qN4DlyiPl00000000020000000100000000020021000000000000000010000000000100000000120101000000\"/><path id=\"dumbbell-romanian-deadlift-n-e-foot.l\" d=\"~#o2APuAB)1TxvzB(1YcF3Shx8Np)nF-2B3OJ2-4ED1)7*n2KG1Y4zb-cUsBbEmSp222002010100000101000000000200000121000000012100\"/><path id=\"dumbbell-romanian-deadlift-n-e-shcap.l\" d=\"~~Szz1DXE1wP10\"/><path id=\"dumbbell-romanian-deadlift-n-e-upper.l\" d=\"~#F12(Az1!IE1BNz1XGD1P2O8a2-8JN1P4)4y2O2SeIz1Ae.f(3*fG5TkF3xD1jE3X1K6IdFK1b3W1V8IfE5KjUlE5_lH7ys11110000000200200000000010010000000000100001000010002001100020200000020020000000\"/><path id=\"dumbbell-romanian-deadlift-n-e-elbowcap.l\" d=\"~~_Hx1HVP1Dz10\"/><path id=\"dumbbell-romanian-deadlift-n-e-fore.l\" d=\"~#F12NGx1ARP1OOx1)VO1_2.9g!1G1(H1P4X8(1z2y4*vF8*bF1zbG5OdD3xw1I1K2K2R9G8yH1v_1hEa)9X1TcFi)1AhF8Uk00000010000101100100011010100000000001000000000000000010000000000021000000002200\"/><path id=\"dumbbell-romanian-deadlift-n-e-fist.l\" d=\"~~AIw1WE_1ww10\"/><path id=\"dumbbell-romanian-deadlift-n-e-head\" d=\"~#w12HSN1w.D1IXN1BEB1XkIhGbGiD2Kbx5X2S7O5Na*8_kOjAdU3J9K2T1zjAdJlJ8WlK1wlBeSkEj40020001000001002000200000200020010001002200200010100020022000200\"/><path id=\"dumbbell-romanian-deadlift-n-e-torso\" d=\"~#_12WWG1SYB1XBI1)*B1P5Ba7z3VgybR5AaXeDe2Y5HnR6U5-jT6)bP7(e(9JjUjDjNkHeHay3HeVa(t*w1_oXf)5V5x5*1x5!cV7!3!6OdK9BfElO4-5!6FcYbT7(3EE1xP200001000020101000000000000000001010001010110101001000200000000000000000000000000100100000110120200101000000000000000\"/><path id=\"dumbbell-romanian-deadlift-n-e-thigh.r\" d=\"^33\"/><path id=\"dumbbell-romanian-deadlift-n-e-kneecap.r\" d=\"^34\"/><path id=\"dumbbell-romanian-deadlift-n-e-shank.r\" d=\"^35\"/><path id=\"dumbbell-romanian-deadlift-n-e-foot.r\" d=\"^36\"/><path id=\"dumbbell-romanian-deadlift-n-e-shcap.r\" d=\"^37\"/><path id=\"dumbbell-romanian-deadlift-n-e-upper.r\" d=\"^38\"/><path id=\"dumbbell-romanian-deadlift-n-e-elbowcap.r\" d=\"^39\"/><path id=\"dumbbell-romanian-deadlift-n-e-fore.r\" d=\"^40\"/><path id=\"dumbbell-romanian-deadlift-n-e-fist.r\" d=\"^41\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-romanian-deadlift-n-dots)\"/>\n  <path class=\"floorline\" d=\"M62.29 339.5H281.71\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-n-st-head\"/><use href=\"#dumbbell-romanian-deadlift-n-st-torso\"/><use href=\"#dumbbell-romanian-deadlift-n-st-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-n-st-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-st-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-n-st-head\"/><use href=\"#dumbbell-romanian-deadlift-n-st-torso\"/><use href=\"#dumbbell-romanian-deadlift-n-st-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-n-st-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-st-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-n-st-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-st-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-n-st-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-st-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-n-st-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-st-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-n-st-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-st-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-n-g0-head\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-torso\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-n-g0-head\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-torso\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-n-g0-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-n-g0-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-n-g1-head\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-torso\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-n-g1-head\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-torso\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-n-g1-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-n-g1-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-n-e-thigh.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-kneecap.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-shank.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-foot.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-shcap.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-upper.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-elbowcap.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-fore.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-n-e-thigh.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-kneecap.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-shank.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-foot.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-shcap.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-upper.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-elbowcap.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-fore.l\"/><use href=\"#dumbbell-romanian-deadlift-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-n-e-head\"/><use href=\"#dumbbell-romanian-deadlift-n-e-torso\"/><use href=\"#dumbbell-romanian-deadlift-n-e-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-n-e-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-e-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-n-e-head\"/><use href=\"#dumbbell-romanian-deadlift-n-e-torso\"/><use href=\"#dumbbell-romanian-deadlift-n-e-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-n-e-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-e-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-n-e-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-e-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-n-e-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-e-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-n-e-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-e-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-n-e-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-n-e-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-n-e-fist.r\"/></g></g><path class=\"disc\" d=\"~MPxz1WE_1LBrAO1LErzO1LFrzO1LJW10LFrAO1Z\"/><path class=\"disc-core\" d=\"~~U!w1WE_1Ne0\"/><path class=\"eq-cable m-line\" d=\"~MYxE1PxJ1LxO1BrL1JW1LAO1DrLAO1BrL1IW1LxO1Br\"/><circle class=\"joint\" cx=\"187.45\" cy=\"203.39\" r=\"2.25\"/><circle class=\"joint\" cx=\"176.32\" cy=\"249.17\" r=\"2.25\"/><circle class=\"joint\" cx=\"119.75\" cy=\"211.37\" r=\"2.25\"/><circle class=\"joint\" cx=\"147.93\" cy=\"267.37\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#(10W(z1ADN1zzA1IxN118080616081636081836164vF4w56r1a180a181a18083808380618181408142100000002010101010000101010002000000201010101210000000000101010000000000010100000000000100000000021010210000000000000101000\"/><path class=\"arrow\" d=\"~MPOx1HWY1LIf)D1LWU1HH1Z\"/></g><path class=\"leader\" d=\"M114.16 191.56L97.8 198H87.8\"/><circle class=\"anchor\" cx=\"114.16\" cy=\"191.56\" r=\"1.5\"/><path class=\"leader\" d=\"M170.74 298.19L181 302H191\"/><circle class=\"anchor\" cx=\"170.74\" cy=\"298.19\" r=\"1.5\"/><path class=\"leader\" d=\"M173.07 186.16L141.41 148H131.41\"/><circle class=\"anchor\" cx=\"173.07\" cy=\"186.16\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dumbbell-romanian-deadlift-n-hips\" data-key=\"hips\" data-cue=\"Push your hips back, not down, and keep your knees softly bent.\" class=\"plate-callout\" style=\"left:4.47%;top:49.16%\" aria-pressed=\"true\">Hips back</button><button type=\"button\" id=\"dumbbell-romanian-deadlift-n-bells\" data-key=\"bells\" data-cue=\"Run the dumbbells down your thighs and shins, touching your legs.\" class=\"plate-callout two\" style=\"left:51.96%;top:78.21%\" aria-pressed=\"false\">Bells on<br>legs</button><button type=\"button\" id=\"dumbbell-romanian-deadlift-n-back\" data-key=\"back\" data-cue=\"Keep your back neutral and stop where it would round.\" class=\"plate-callout\" style=\"left:15.92%;top:35.2%\" aria-pressed=\"false\">Flat back</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-romanian-deadlift-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-romanian-deadlift-m-st-head\" d=\"^0\"/><path id=\"dumbbell-romanian-deadlift-m-st-torso\" d=\"^1\"/><path id=\"dumbbell-romanian-deadlift-m-st-thigh.r\" d=\"^2\"/><path id=\"dumbbell-romanian-deadlift-m-st-kneecap.r\" d=\"^3\"/><path id=\"dumbbell-romanian-deadlift-m-st-shank.r\" d=\"^4\"/><path id=\"dumbbell-romanian-deadlift-m-st-foot.r\" d=\"^5\"/><path id=\"dumbbell-romanian-deadlift-m-st-shcap.r\" d=\"^6\"/><path id=\"dumbbell-romanian-deadlift-m-st-upper.r\" d=\"^7\"/><path id=\"dumbbell-romanian-deadlift-m-st-elbowcap.r\" d=\"^8\"/><path id=\"dumbbell-romanian-deadlift-m-st-fore.r\" d=\"^9\"/><path id=\"dumbbell-romanian-deadlift-m-st-fist.r\" d=\"^10\"/><path id=\"dumbbell-romanian-deadlift-m-g0-head\" d=\"^11\"/><path id=\"dumbbell-romanian-deadlift-m-g0-torso\" d=\"^12\"/><path id=\"dumbbell-romanian-deadlift-m-g0-thigh.r\" d=\"^13\"/><path id=\"dumbbell-romanian-deadlift-m-g0-kneecap.r\" d=\"^14\"/><path id=\"dumbbell-romanian-deadlift-m-g0-shank.r\" d=\"^15\"/><path id=\"dumbbell-romanian-deadlift-m-g0-foot.r\" d=\"^16\"/><path id=\"dumbbell-romanian-deadlift-m-g0-shcap.r\" d=\"^17\"/><path id=\"dumbbell-romanian-deadlift-m-g0-upper.r\" d=\"^18\"/><path id=\"dumbbell-romanian-deadlift-m-g0-elbowcap.r\" d=\"^19\"/><path id=\"dumbbell-romanian-deadlift-m-g0-fore.r\" d=\"^20\"/><path id=\"dumbbell-romanian-deadlift-m-g0-fist.r\" d=\"^21\"/><path id=\"dumbbell-romanian-deadlift-m-g1-head\" d=\"^22\"/><path id=\"dumbbell-romanian-deadlift-m-g1-torso\" d=\"^23\"/><path id=\"dumbbell-romanian-deadlift-m-g1-thigh.r\" d=\"^24\"/><path id=\"dumbbell-romanian-deadlift-m-g1-kneecap.r\" d=\"^25\"/><path id=\"dumbbell-romanian-deadlift-m-g1-shank.r\" d=\"^26\"/><path id=\"dumbbell-romanian-deadlift-m-g1-foot.r\" d=\"^27\"/><path id=\"dumbbell-romanian-deadlift-m-g1-shcap.r\" d=\"^28\"/><path id=\"dumbbell-romanian-deadlift-m-g1-upper.r\" d=\"^29\"/><path id=\"dumbbell-romanian-deadlift-m-g1-elbowcap.r\" d=\"^30\"/><path id=\"dumbbell-romanian-deadlift-m-g1-fore.r\" d=\"^31\"/><path id=\"dumbbell-romanian-deadlift-m-g1-fist.r\" d=\"^32\"/><path id=\"dumbbell-romanian-deadlift-m-e-thigh.l\" d=\"^33\"/><path id=\"dumbbell-romanian-deadlift-m-e-kneecap.l\" d=\"^34\"/><path id=\"dumbbell-romanian-deadlift-m-e-shank.l\" d=\"^35\"/><path id=\"dumbbell-romanian-deadlift-m-e-foot.l\" d=\"^36\"/><path id=\"dumbbell-romanian-deadlift-m-e-shcap.l\" d=\"^37\"/><path id=\"dumbbell-romanian-deadlift-m-e-upper.l\" d=\"^38\"/><path id=\"dumbbell-romanian-deadlift-m-e-elbowcap.l\" d=\"^39\"/><path id=\"dumbbell-romanian-deadlift-m-e-fore.l\" d=\"^40\"/><path id=\"dumbbell-romanian-deadlift-m-e-fist.l\" d=\"^41\"/><path id=\"dumbbell-romanian-deadlift-m-e-head\" d=\"^42\"/><path id=\"dumbbell-romanian-deadlift-m-e-torso\" d=\"^43\"/><path id=\"dumbbell-romanian-deadlift-m-e-thigh.r\" d=\"^33\"/><path id=\"dumbbell-romanian-deadlift-m-e-kneecap.r\" d=\"^34\"/><path id=\"dumbbell-romanian-deadlift-m-e-shank.r\" d=\"^35\"/><path id=\"dumbbell-romanian-deadlift-m-e-foot.r\" d=\"^36\"/><path id=\"dumbbell-romanian-deadlift-m-e-shcap.r\" d=\"^37\"/><path id=\"dumbbell-romanian-deadlift-m-e-upper.r\" d=\"^38\"/><path id=\"dumbbell-romanian-deadlift-m-e-elbowcap.r\" d=\"^39\"/><path id=\"dumbbell-romanian-deadlift-m-e-fore.r\" d=\"^40\"/><path id=\"dumbbell-romanian-deadlift-m-e-fist.r\" d=\"^41\"/><path id=\"dumbbell-romanian-deadlift-m-m-head\" d=\"~#w12y(K1JYnX(J1VNmBrA1Rk-5B6)9R5N1!1z9U1VdD2KsAcB6J5z8Be)cyo!6_kNaFdHgH3!ozewd0011100020001100002000010101000000020010100010101001211012210000\"/><path id=\"dumbbell-romanian-deadlift-m-m-torso\" d=\"~#_12yUG1AFqO_H1KJpX2zbG2B2-4PjW2DbG1Jkw8w6N7)tVgXy1Kax8(aScPeHg!nWdFnW8YaeHb*dUkIE1AkOlUfxjT6GN1-B1wO1x3y8)3ReEh.4Xiwbew9(ge)2y8*S2Rw110000200200200111100210000000010100000101200020000100000022000001000012100000010101010200100000000010010102000000001\"/><path id=\"dumbbell-romanian-deadlift-m-m-thigh.l\" d=\"~#F12UxqyXF1zSpOHE1V4*aE1aFj_.1_3z9U1O4)a)T1D6Ipz5RjXhxj.f-S1T3x3-7x6PcP*1F19E1-bBx1R3.aAK1A9Yy1Pv(x100010100000021000111001000000001000020210021001000000000001000101002000001001100\"/><path id=\"dumbbell-romanian-deadlift-m-m-kneecap.l\" d=\"~~DyuY(T1_J10\"/><path id=\"dumbbell-romanian-deadlift-m-m-shank.l\" d=\"~#F12SwuP(T1RAuEOS1!1.bF12P4w)1w6.7_2*3I3*y2J7Td0*bB7VdA4)y2X2.3*5*7B5((1E10X1-b.cUbKdUo1WlAdYo00011000001000100021000020000000100000002000000001000000000000000000002000200000\"/><path id=\"dumbbell-romanian-deadlift-m-m-foot.l\" d=\"~#o2DPuAB)1XxvzB(1YcF3Shx8Pp)nF-2B3KJ2-4GD1)7*n2IG1Y4Bb-cWsBbGmSp020022012100000100000000001200000101001000010100\"/><path id=\"dumbbell-romanian-deadlift-m-m-shcap.l\" d=\"~~wWB1NAvwP10\"/><path id=\"dumbbell-romanian-deadlift-m-m-upper.l\" d=\"~#F12_!B1_Iu.OD1-Ktw5I764Em(G1Y5K3_2-1Po.tFi.aN8zew1ElWeXz1aE38X6GqPE195D4.7EdI9.o(eRbFjI1(s01210010100002220000001100100010100001000002000000000210100000200000000011110000\"/><path id=\"dumbbell-romanian-deadlift-m-m-elbowcap.l\" d=\"~~YHx1UyE1Dz10\"/><path id=\"dumbbell-romanian-deadlift-m-m-fore.l\" d=\"~#F12DGx1DxE1GKx1)BD1D2*9m!1Y1NH1(3.8W1G2Y1TvH7RceBbG6)co-vK1G2E3E9B5FH1nY1I1xaxaE1GbAjjFhW9wk00210100100100020000010022111100000200010020001000000000010000000000000000100011\"/><path id=\"dumbbell-romanian-deadlift-m-m-fist.l\" d=\"~~!xx1_TP1ww10\"/><path id=\"dumbbell-romanian-deadlift-m-m-thigh.r\" d=\"^55\"/><path id=\"dumbbell-romanian-deadlift-m-m-kneecap.r\" d=\"^56\"/><path id=\"dumbbell-romanian-deadlift-m-m-shank.r\" d=\"^57\"/><path id=\"dumbbell-romanian-deadlift-m-m-foot.r\" d=\"^58\"/><path id=\"dumbbell-romanian-deadlift-m-m-shcap.r\" d=\"^59\"/><path id=\"dumbbell-romanian-deadlift-m-m-upper.r\" d=\"^60\"/><path id=\"dumbbell-romanian-deadlift-m-m-elbowcap.r\" d=\"^61\"/><path id=\"dumbbell-romanian-deadlift-m-m-fore.r\" d=\"^62\"/><path id=\"dumbbell-romanian-deadlift-m-m-fist.r\" d=\"^63\"/><path id=\"dumbbell-romanian-deadlift-m-m-eq0\" d=\"~MHYz1_TP1LErAO1LzrzO1LDrzO1LJW12LDryO1Z\"/><path id=\"dumbbell-romanian-deadlift-m-m-eq1\" d=\"~~NTx1_TP1Ne0\"/><path id=\"dumbbell-romanian-deadlift-m-mo-0\" d=\"^42\"/><path id=\"dumbbell-romanian-deadlift-m-mo-1\" d=\"^43\"/><path id=\"dumbbell-romanian-deadlift-m-mo-2\" d=\"^33\"/><path id=\"dumbbell-romanian-deadlift-m-mo-3\" d=\"^34\"/><path id=\"dumbbell-romanian-deadlift-m-mo-4\" d=\"^35\"/><path id=\"dumbbell-romanian-deadlift-m-mo-5\" d=\"^36\"/><path id=\"dumbbell-romanian-deadlift-m-mo-6\" d=\"^37\"/><path id=\"dumbbell-romanian-deadlift-m-mo-7\" d=\"^38\"/><path id=\"dumbbell-romanian-deadlift-m-mo-8\" d=\"^39\"/><path id=\"dumbbell-romanian-deadlift-m-mo-9\" d=\"^40\"/><path id=\"dumbbell-romanian-deadlift-m-mo-10\" d=\"^41\"/><path id=\"dumbbell-romanian-deadlift-m-mo-11\" d=\"^33\"/><path id=\"dumbbell-romanian-deadlift-m-mo-12\" d=\"^34\"/><path id=\"dumbbell-romanian-deadlift-m-mo-13\" d=\"^35\"/><path id=\"dumbbell-romanian-deadlift-m-mo-14\" d=\"^36\"/><path id=\"dumbbell-romanian-deadlift-m-mo-15\" d=\"^37\"/><path id=\"dumbbell-romanian-deadlift-m-mo-16\" d=\"^38\"/><path id=\"dumbbell-romanian-deadlift-m-mo-17\" d=\"^39\"/><path id=\"dumbbell-romanian-deadlift-m-mo-18\" d=\"^40\"/><path id=\"dumbbell-romanian-deadlift-m-mo-19\" d=\"^41\"/><path id=\"dumbbell-romanian-deadlift-m-mo-20\" d=\"^45\"/><path id=\"dumbbell-romanian-deadlift-m-mo-21\" d=\"^46\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-romanian-deadlift-m-dots)\"/>\n  <path class=\"floorline\" d=\"^44\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-m-st-head\"/><use href=\"#dumbbell-romanian-deadlift-m-st-torso\"/><use href=\"#dumbbell-romanian-deadlift-m-st-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-m-st-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-st-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-m-st-head\"/><use href=\"#dumbbell-romanian-deadlift-m-st-torso\"/><use href=\"#dumbbell-romanian-deadlift-m-st-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-m-st-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-st-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-m-st-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-st-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-m-st-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-st-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-m-st-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-st-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-m-st-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-st-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-m-g0-head\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-torso\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-m-g0-head\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-torso\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-m-g0-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-m-g0-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-m-g1-head\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-torso\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-m-g1-head\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-torso\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-m-g1-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-m-g1-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-m-e-thigh.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-kneecap.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-shank.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-foot.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-shcap.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-upper.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-elbowcap.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-fore.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-m-e-thigh.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-kneecap.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-shank.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-foot.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-shcap.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-upper.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-elbowcap.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-fore.l\"/><use href=\"#dumbbell-romanian-deadlift-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-m-e-head\"/><use href=\"#dumbbell-romanian-deadlift-m-e-torso\"/><use href=\"#dumbbell-romanian-deadlift-m-e-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-m-e-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-e-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-m-e-head\"/><use href=\"#dumbbell-romanian-deadlift-m-e-torso\"/><use href=\"#dumbbell-romanian-deadlift-m-e-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-m-e-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-e-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-m-e-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-e-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-m-e-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-e-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-romanian-deadlift-m-e-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-e-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-m-e-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-e-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-m-e-fist.r\"/></g></g><path class=\"disc\" d=\"^45\"/><path class=\"disc-core\" d=\"^46\"/><path class=\"eq-cable m-line\" d=\"^47\"/><circle class=\"joint\" cx=\"187.45\" cy=\"203.39\" r=\"2.25\"/><circle class=\"joint\" cx=\"176.32\" cy=\"249.17\" r=\"2.25\"/><circle class=\"joint\" cx=\"119.75\" cy=\"211.37\" r=\"2.25\"/><circle class=\"joint\" cx=\"147.93\" cy=\"267.37\" r=\"2.25\"/></g><mask id=\"dumbbell-romanian-deadlift-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#dumbbell-romanian-deadlift-m-m-head\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-torso\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-thigh.l\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-shank.l\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-foot.l\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-shcap.l\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-upper.l\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-fore.l\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-fist.l\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-thigh.r\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-shank.r\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-foot.r\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-shcap.r\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-upper.r\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-fore.r\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-m-fist.r\" fill=\"#000\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-romanian-deadlift-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#dumbbell-romanian-deadlift-m-mmask)\"><g class=\"u-stroke\"><use href=\"#dumbbell-romanian-deadlift-m-m-head\"/><use href=\"#dumbbell-romanian-deadlift-m-m-torso\"/><use href=\"#dumbbell-romanian-deadlift-m-m-thigh.l\"/><use href=\"#dumbbell-romanian-deadlift-m-m-kneecap.l\"/><use href=\"#dumbbell-romanian-deadlift-m-m-shank.l\"/><use href=\"#dumbbell-romanian-deadlift-m-m-foot.l\"/><use href=\"#dumbbell-romanian-deadlift-m-m-shcap.l\"/><use href=\"#dumbbell-romanian-deadlift-m-m-upper.l\"/><use href=\"#dumbbell-romanian-deadlift-m-m-elbowcap.l\"/><use href=\"#dumbbell-romanian-deadlift-m-m-fore.l\"/><use href=\"#dumbbell-romanian-deadlift-m-m-fist.l\"/><use href=\"#dumbbell-romanian-deadlift-m-m-thigh.r\"/><use href=\"#dumbbell-romanian-deadlift-m-m-kneecap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-m-shank.r\"/><use href=\"#dumbbell-romanian-deadlift-m-m-foot.r\"/><use href=\"#dumbbell-romanian-deadlift-m-m-shcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-m-upper.r\"/><use href=\"#dumbbell-romanian-deadlift-m-m-elbowcap.r\"/><use href=\"#dumbbell-romanian-deadlift-m-m-fore.r\"/><use href=\"#dumbbell-romanian-deadlift-m-m-fist.r\"/><use href=\"#dumbbell-romanian-deadlift-m-m-eq0\"/><use href=\"#dumbbell-romanian-deadlift-m-m-eq1\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~#60NVtNYz1OWrOVz1zoOx3wpA1001000000100\"/><path class=\"m-arrow\" d=\"~MJUv_Ww1L0N.2MXi)oLYiwpL0)R1\"/><path class=\"leader m\" d=\"M161.98 186.5L135.75 152H125.75\"/><path class=\"leader m\" d=\"M134.9 187.6L110.97 222H100.97\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dumbbell-romanian-deadlift-m-arch\" data-key=\"arch\" data-cue=\"The lower back arches to stand up.\" class=\"plate-callout two m\" style=\"left:19.55%;top:36.31%\" aria-pressed=\"true\">Back<br>arches</button><button type=\"button\" id=\"dumbbell-romanian-deadlift-m-hips\" data-key=\"hips\" data-cue=\"The hips stay back while the back does the lifting.\" class=\"plate-callout two m\" style=\"left:8.38%;top:55.87%\" aria-pressed=\"false\">Hips stay<br>back</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "hips",
        cues: [{ key: "hips", cue: "Push your hips back, not down, and keep your knees softly bent." }, { key: "bells", cue: "Run the dumbbells down your thighs and shins, touching your legs." }, { key: "back", cue: "Keep your back neutral and stop where it would round." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "arch",
        cues: [{ key: "arch", cue: "The lower back arches to stand up." }, { key: "hips", cue: "The hips stay back while the back does the lifting." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Back arches</b><span>The lower back arches to stand up.</span></li><li><b>Hips stay back</b><span>The hips stay back while the back does the lifting.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower 2 seconds, stand 1 second\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Stand</b><span>1 s</span></div></div></div>",
      alt: "Dumbbell Romanian deadlift, side view. Standing with a dumbbell in front of each thigh and the knees softly bent, the lifter pushes the hips back with a flat back, the dumbbells grazing the legs down to about mid-shin, and stands back up.",
      mistakeAlt: "Dumbbell Romanian Deadlift: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hold",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: dbrdl-grip is a placement zoom (dumbbells on the thighs), not a hand pose; its Right and Wrong are text checkpoints.",
    "handle": "dumbbell",
    "width": {
      "text": "Hands in front of the thighs, dumbbells close to the legs.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-db-rdl"
        ],
        "note": "c1, c4"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "baechle-grip"
        ],
        "note": "c24"
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "ext": [
        -10,
        10
      ],
      "limitText": "Keep the wrist neutral, in line with the forearm.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-db-rdl"
        ],
        "note": "inherit:0 (card inherit[0] grip.wrist, romanian_deadlift; the card notes call the neutral wrist a drawing convention; W4 content K2: not c15). The ext range is the hold archetype's (GA 3.1), a convention, not a card number."
      }
    },
    "faults": [],
    "gripLine": "Dumbbells on the thighs, palms facing you, thumbs wrapped.",
    "cue": "Bells on legs, arms straight."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Feet shoulder width. Dumbbells on thighs, not hanging away from the legs.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-db-rdl",
          "fitbod-db-rdl"
        ],
        "note": "c1, c4"
      }
    },
    {
      "kind": "brace",
      "text": "Shoulder blades down and back. Breathe in, brace slightly before each rep.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-db-rdl",
          "sl-db-rdl"
        ],
        "note": "c2, c11"
      }
    },
    {
      "kind": "position",
      "text": "Knees behind the toes. Eyes to the floor as you lower.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-db-rdl"
        ],
        "note": "c6, c7"
      }
    },
    {
      "kind": "adjust",
      "text": "Want more range? Stand on a plate.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-db-rdl"
        ],
        "note": "c12"
      }
    },
    {
      "kind": "load",
      "text": "Add weight in small steps once you beat your target reps.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "acsm2009"
        ],
        "note": "c21"
      }
    }
  ],
  posture: [
    {
      "key": "hips",
      "label": "Hips back",
      "detail": "Push the hips back, not down. Knees stay behind the toes.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "zoom": "dbrdl-bottom",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-db-rdl"
        ],
        "note": "c6"
      }
    },
    {
      "key": "knees",
      "label": "Knees fixed",
      "detail": "Knees fixed at a slight bend. The movement is at the hips.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "dbrdl-bottom",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-db-rdl"
        ],
        "note": "c3, c6; card inherit[1] knees posture (romanian_deadlift c4)"
      }
    },
    {
      "key": "bells",
      "label": "Bells on legs",
      "detail": "Dumbbells touch the legs all the way.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-db-rdl"
        ],
        "note": "c4"
      }
    },
    {
      "key": "depth",
      "label": "Mid-shin depth",
      "detail": "Down to about mid-shin, only as low as your hinge allows.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fitbod-db-rdl",
          "sweat-db-rdl"
        ],
        "note": "c9, c3"
      }
    },
    {
      "key": "back",
      "label": "Back neutral",
      "detail": "Back neutral going down and coming up.",
      "anchor": {
        "pose": "end",
        "at": "lumbar"
      },
      "zoom": "dbrdl-bottom",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-db-rdl"
        ],
        "note": "c10"
      }
    },
    {
      "key": "eyes",
      "label": "Eyes down",
      "detail": "Eyes move to the floor as you lower.",
      "anchor": {
        "pose": "end",
        "at": "head"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-db-rdl"
        ],
        "note": "c7"
      }
    },
    {
      "key": "heels",
      "label": "Heels down",
      "detail": "Push through the heels to stand.",
      "anchor": {
        "pose": "start",
        "at": "heel.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-db-rdl"
        ],
        "note": "c5"
      }
    }
  ],
  zooms: [
    {
      "key": "dbrdl-bottom",
      "chip": "Bottom",
      "heading": "Bottom position",
      "kind": "posture"
    }
  ],
  chips: [
    "dbrdl-bottom",
    "feel"
  ],
  copy: {
    "setupLine": "Feet shoulder width, dumbbells on your thighs. Shoulder blades down and back.",
    "mistakeLine": "Never round your back to reach lower. Stop where it stays flat.",
    "cueLine": "Hips back, bells on legs."
  },
  mistakes: [
    {
      "key": "arch",
      "title": "Arching to stand up",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-db-rdl"
        ],
        "note": "c10, c5"
      },
      "fix": "Push through the heels with glutes and hamstrings. Back neutral."
    },
    {
      "key": "round",
      "title": "Rounding to reach lower",
      "zoom": "dbrdl-bottom",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "fitbod-db-rdl",
          "sl-db-rdl",
          "sl-deadlift"
        ],
        "note": "c8, c22"
      },
      "fix": "Stop where the back stays flat. If it rounds, go lighter."
    },
    {
      "key": "low",
      "title": "Going too low",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fitbod-db-rdl"
        ],
        "note": "c9"
      },
      "fix": "Stop where the hamstrings stop the hinge."
    }
  ],
  risks: [
    {
      "key": "round",
      "text": "Rounding the back to reach lower raises injury risk.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fitbod-db-rdl",
          "sl-db-rdl"
        ],
        "note": "c8"
      }
    },
    {
      "key": "breath",
      "text": "Heavy reps with a held breath send blood pressure very high.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "macdougall1985"
        ],
        "note": "c19"
      }
    },
    {
      "key": "neck",
      "text": "Looking straight ahead at the bottom strains the neck.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-db-rdl"
        ],
        "note": "c7"
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
    "sweat-db-rdl",
    "fitbod-db-rdl",
    "sl-db-rdl",
    "martinfuentes2020",
    "macdougall1985",
    "acsm2009",
    "sl-deadlift",
    "baechle-grip",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/dumbbell_romanian_deadlift.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

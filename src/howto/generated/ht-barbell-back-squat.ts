// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=528ab14dda26a5931be6f31d9af0bb1c2dd3691bc560c135d8c09a724c49100a
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_barbell_back_squat",
  name: "Barbell Back Squat",
  hashes: { inputsSha256: "528ab14dda26a5931be6f31d9af0bb1c2dd3691bc560c135d8c09a724c49100a", golden: "6f8b671dc0b95f9fe171df82f154388ddc20c76dadcc6485d1e8eccfb7f5fae7" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"barbell-back-squat-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"barbell-back-squat-n-st-head\" d=\"~#w12HDH1YWg*UF1zDgVlJgIk_6TaX4.3H4R3R8K6EcEeRoP6xc7V9)iV2Yn)7ynB3Akw6_gSiE4_i0010101000000101000020101000200010100000010100111101100000000200\"/><path id=\"barbell-back-squat-n-st-torso\" d=\"~#_12UxF1UDlTRF1x_jR8T7B3dy7YiU8W7NaUhH6s*2TozlxbGdw3PgR2NlK3PoXc_j*eA6.8V5*gxmTD1G7OsG6rO9I1NaUhy2J8TbV9.gW5E9WjN5F7DeG9A2J8.W2Ak01000202000200000212100000020000110000011000000020101020000000020012000000010010110010100000200111101200100020100000\"/><path id=\"barbell-back-squat-n-st-thigh.r\" d=\"~#F12wRA1D_E1KPA1EID1vXbG13nP(1P6I7w3V3A6KU1!dxmJ1BkVa-ny1VU1O2z4K5B8X7w(1H14S2RbEuzeXoFE1I2!z1wjFH100000011002001000000000111000000002000020010001101000022000000000000100020001020\"/><path id=\"barbell-back-squat-n-st-kneecap.r\" d=\"~~DWA1SAU1_J10\"/><path id=\"barbell-back-squat-n-st-shank.r\" d=\"~#F12AVA1N*T1xwB1KOS1U3KbD18-4Y(1D7-6F3K3P6Ry2J9Gc_1-bB5TeweGx2B2G4T4V8OeH*1B150*bKeN9.gJmG3PlH9Jq10100010001000200202100000000000000000022000002101001000000101000000000200000000\"/><path id=\"barbell-back-squat-n-st-foot.r\" d=\"~#o2HJz1yB)1V(z1OB(1JcJ3Jh-7YpKnwX2B2EH2V5)A1I8En9OF1H4Ia-cHs.aTmFp110020010110020001000010020000220000000000000201\"/><path id=\"barbell-back-squat-n-g0-head\" d=\"~#w12FwI1A!kERG1RBkRnPd)kJ4)9x6I4!3O2)8.4.cBbBq(7Bbw1T9Ti*4Sox5HndFjS8NeJkR6Ai0001100000110102002000000001010000002210000021210000200000000000\"/><path id=\"barbell-back-squat-n-g0-torso\" d=\"~#_12SHF1Syp.)F1EYnG7Oa*4B1S3DkD7y9F7DjS5y2N2GoBhOdVdy1YgfYlpYpT9UlKcy7x8T3OhzhxG1X3Btx7D1*5F1!8PdgS8T9ObVhS2Rc!hS4w6Pd)6kUaTY2N910000001011010000200000010000000101010210000200000002001110000210020000000020000001000002001001210002200000002020001\"/><path id=\"barbell-back-squat-n-g0-thigh.r\" d=\"~#F12WFy1URJ1-Nx1BJI1E7.8viAx1WS1N1O9eT4VmXJ1r)p)9RhEmXdzrzH1E4*1)8R3DrDW1y1l)3Va.x1!3P1JN1_hAvPE1Po10000020011100101212100020100200201000200000000110000101002000001002200012220000\"/><path id=\"barbell-back-squat-n-g0-kneecap.r\" d=\"~~y.F1wTV1_J10\"/><path id=\"barbell-back-squat-n-g0-shank.r\" d=\"~#F12N)F1A!U1.-G1)UT1J7G9A1iVqw-1y9.3H4x2St..1ydE8!5KacKfyA1BY1fX4G1-9xz1FU1z1jD4zb-gY3Vn(eVa!ijws22220001210000000000000000000000000000000002000020000000100012120001011011000000\"/><path id=\"barbell-back-squat-n-g0-foot.r\" d=\"~#o2wKz1HB)1T(z1KB(1!bA3!g*7!o.nFU2B3)E2X4Xz1)7Tm0BE1_4zaXcNrBb.lPp000110012000100010002001000000000000010001000010\"/><path id=\"barbell-back-squat-n-g1-head\" d=\"~#w12SFJ1FTs.)H1XSr*p(7OlfG8z8B5Y2bG9.1Td)4xsFax9y3B9*gx9ypm_m_4_gUcN9AnKaDg0001000002200000100020000000000000000000202000010010001000101100\"/><path id=\"barbell-back-squat-n-g1-torso\" d=\"~#_12_WF1(yw1xVG1O(uX3Be-6I3X2wlF4WaH1PkA4S3SaRlRazgRdG2NgF3Jly4FrR3!nE7W8E6e.hK7.I1_2EtB9!2K3_5U8W8x2N8-5)dXhR2zhJdU3P4NcX3z3wdOY2-a00010100000200000000021101101010101000210020000002200210100000000000120000100202001010000100100000001000011001010101\"/><path id=\"barbell-back-squat-n-g1-thigh.r\" d=\"~#F12N)uFUS1zWtGzS1XaK3hy1NW1(n*3T8)1B4)G1Go.eOl*hB9zqeGJ1XjO4oI9(1FT1yuivx9X6)qDlJqDD1ww1JgJN1r10000000010120000200000000000100000000000202000000010002000001010110000002020010\"/><path id=\"barbell-back-squat-n-g1-kneecap.r\" d=\"~~U)F1!YV1_J10\"/><path id=\"barbell-back-squat-n-g1-shank.r\" d=\"~#F12NAG1HxV1I)G1*_T1P7B9y1kKrDY1y9V3N4*1Du._1Hd*7w6IakOf_A1*W1dX4E1X9Xz1DT1x1jJ4)aXgD3*nPexbYix1(r01010001000010000020001001002000110021022002000010012120002002001000010000000101\"/><path id=\"barbell-back-squat-n-g1-foot.r\" d=\"~#o2FJz1DB)1B*z1EB(1(bF3Ug)7No)nDU2B3xF2-4)z1*7Om1BE1_4IaXcFrEbKlUp001010000000000000002000022000001010020100000020\"/><path id=\"barbell-back-squat-n-e-thigh.l\" d=\"~#F12_BvU!Y1--tTy-1)aJ24F1W_1I6V7V5X3O2zP13RnBbzkw1KmSdXO1!4R3(2x7H6A.1i3E1zbG1)c(v(G1_j!z1-1WE1.n00110000200002010020020000002020001200002100000101220000000100200000000000001201\"/><path id=\"barbell-back-squat-n-e-kneecap.l\" d=\"~~FBG1J*V1_J10\"/><path id=\"barbell-back-squat-n-e-shank.l\" d=\"~#F12SHG1yBV1BDH1G)T1W7*8y1kIsNX1A9K3J4.1Hvx_1HdX7H6EasKfUB1zW19X4vX9VA1JS1x1jS4.aXgY2zoyeKbPiR1ws02000010100011100000220000001000000101001010000110100110120200100000201010020010\"/><path id=\"barbell-back-squat-n-e-foot.l\" d=\"~#o2AJz1DB)1)!z1EB(1ycF3Sg)7Ho*nDU2E3xF2-4xA1)7Om0BE1_4IaXcDrEbGlUp000022101210100001010000000000000000020000000001\"/><path id=\"barbell-back-squat-n-e-shcap.l\" d=\"~~WJB1W)I1wP10\"/><path id=\"barbell-back-squat-n-e-upper.l\" d=\"~#F12yKB1H-I1TPB1KBI1y1*4a2E1wrU3*2U1O1y7B9NcBhF2GgR7*jG4VaB1*1V2V3)5Jq716x5.dTi*gPn)2FmAaDr00001010100000010011001000100020001111000001200002021000000010110000000000020020\"/><path id=\"barbell-back-squat-n-e-elbowcap.l\" d=\"~~yzB1NDR1Dz10\"/><path id=\"barbell-back-squat-n-e-fore.l\" d=\"~#F12yIE1_DR1-EE1RwS1-1N9nV1z3)E1R3S8V1D2lYs)6Yc3DbY6!c6_sS1D2P3U8_3.E1qX1U1N9AaS2YaKj2EhEaVj11101000000100000010100001001000101002000010120000121000010020200200201000000101\"/><path id=\"barbell-back-squat-n-e-fist.l\" d=\"~~wGB1YDF1ww10\"/><path id=\"barbell-back-squat-n-e-head\" d=\"~#w12_SJ1(Tz1OJI1VPy1KqA6Il)1-7V8B5J22G9nXdz3Gs!aG8Y3*8GgEa(oJ2JmP6wgWdY7YnObNf0100020002000020001000002002000002000000010000020021010100000011\"/><path id=\"barbell-back-squat-n-e-torso\" d=\"~#_12S-F1J.D1G_G1x-B1I2xfz7z4T4YkH3AbfNkH3(3Hd-jX7RfIdz3Fg(3Dl_4NrV2yoI6!8)5A1Xh*5BJ1!3xtBb_4*1Ja!aH4V2F8V4KeKhz4Ei!bW3A4!b*2G4JdOX2)g02000120001000000000000000000000002001000000002000020000012002210002000000000020000012001100020200200110000200000010\"/><path id=\"barbell-back-squat-n-e-thigh.r\" d=\"^18\"/><path id=\"barbell-back-squat-n-e-kneecap.r\" d=\"^19\"/><path id=\"barbell-back-squat-n-e-shank.r\" d=\"^20\"/><path id=\"barbell-back-squat-n-e-foot.r\" d=\"^21\"/><path id=\"barbell-back-squat-n-e-shcap.r\" d=\"^22\"/><path id=\"barbell-back-squat-n-e-upper.r\" d=\"^23\"/><path id=\"barbell-back-squat-n-e-elbowcap.r\" d=\"^24\"/><path id=\"barbell-back-squat-n-e-fore.r\" d=\"^25\"/><path id=\"barbell-back-squat-n-e-fist.r\" d=\"^26\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#barbell-back-squat-n-dots)\"/>\n  <path class=\"datum\" d=\"~MwGD1FBA2L0ENY1\"/><path class=\"datum\" d=\"~MySH1J*V1LUX3-y6\"/><path class=\"floorline\" d=\"M86.29 339.5H305.71\"/><path class=\"arc measure\" d=\"M217.93 276.06L229.44 257.31A22 22 0 0 0 195.96 277.16Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-back-squat-n-st-head\"/><use href=\"#barbell-back-squat-n-st-torso\"/><use href=\"#barbell-back-squat-n-st-thigh.r\"/><use href=\"#barbell-back-squat-n-st-kneecap.r\"/><use href=\"#barbell-back-squat-n-st-shank.r\"/><use href=\"#barbell-back-squat-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-back-squat-n-st-head\"/><use href=\"#barbell-back-squat-n-st-torso\"/><use href=\"#barbell-back-squat-n-st-thigh.r\"/><use href=\"#barbell-back-squat-n-st-kneecap.r\"/><use href=\"#barbell-back-squat-n-st-shank.r\"/><use href=\"#barbell-back-squat-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-back-squat-n-g0-head\"/><use href=\"#barbell-back-squat-n-g0-torso\"/><use href=\"#barbell-back-squat-n-g0-thigh.r\"/><use href=\"#barbell-back-squat-n-g0-kneecap.r\"/><use href=\"#barbell-back-squat-n-g0-shank.r\"/><use href=\"#barbell-back-squat-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-back-squat-n-g0-head\"/><use href=\"#barbell-back-squat-n-g0-torso\"/><use href=\"#barbell-back-squat-n-g0-thigh.r\"/><use href=\"#barbell-back-squat-n-g0-kneecap.r\"/><use href=\"#barbell-back-squat-n-g0-shank.r\"/><use href=\"#barbell-back-squat-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-back-squat-n-g1-head\"/><use href=\"#barbell-back-squat-n-g1-torso\"/><use href=\"#barbell-back-squat-n-g1-thigh.r\"/><use href=\"#barbell-back-squat-n-g1-kneecap.r\"/><use href=\"#barbell-back-squat-n-g1-shank.r\"/><use href=\"#barbell-back-squat-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-back-squat-n-g1-head\"/><use href=\"#barbell-back-squat-n-g1-torso\"/><use href=\"#barbell-back-squat-n-g1-thigh.r\"/><use href=\"#barbell-back-squat-n-g1-kneecap.r\"/><use href=\"#barbell-back-squat-n-g1-shank.r\"/><use href=\"#barbell-back-squat-n-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-line\" d=\"~~H.vYDF1WK62\"/><path class=\"eq-thin\" d=\"~~Hwx1YDF1WF50\"/><path class=\"eq-solid\" d=\"~~ASB1YDF1!m1\"/><path class=\"eq-pin\" d=\"~~YyD1YDF1F60\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#barbell-back-squat-n-e-thigh.l\"/><use href=\"#barbell-back-squat-n-e-kneecap.l\"/><use href=\"#barbell-back-squat-n-e-shank.l\"/><use href=\"#barbell-back-squat-n-e-foot.l\"/><use href=\"#barbell-back-squat-n-e-shcap.l\"/><use href=\"#barbell-back-squat-n-e-upper.l\"/><use href=\"#barbell-back-squat-n-e-elbowcap.l\"/><use href=\"#barbell-back-squat-n-e-fore.l\"/><use href=\"#barbell-back-squat-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#barbell-back-squat-n-e-thigh.l\"/><use href=\"#barbell-back-squat-n-e-kneecap.l\"/><use href=\"#barbell-back-squat-n-e-shank.l\"/><use href=\"#barbell-back-squat-n-e-foot.l\"/><use href=\"#barbell-back-squat-n-e-shcap.l\"/><use href=\"#barbell-back-squat-n-e-upper.l\"/><use href=\"#barbell-back-squat-n-e-elbowcap.l\"/><use href=\"#barbell-back-squat-n-e-fore.l\"/><use href=\"#barbell-back-squat-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-back-squat-n-e-head\"/><use href=\"#barbell-back-squat-n-e-torso\"/><use href=\"#barbell-back-squat-n-e-thigh.r\"/><use href=\"#barbell-back-squat-n-e-kneecap.r\"/><use href=\"#barbell-back-squat-n-e-shank.r\"/><use href=\"#barbell-back-squat-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-back-squat-n-e-head\"/><use href=\"#barbell-back-squat-n-e-torso\"/><use href=\"#barbell-back-squat-n-e-thigh.r\"/><use href=\"#barbell-back-squat-n-e-kneecap.r\"/><use href=\"#barbell-back-squat-n-e-shank.r\"/><use href=\"#barbell-back-squat-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-back-squat-n-e-shcap.r\"/><use href=\"#barbell-back-squat-n-e-upper.r\"/><use href=\"#barbell-back-squat-n-e-elbowcap.r\"/><use href=\"#barbell-back-squat-n-e-fore.r\"/><use href=\"#barbell-back-squat-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-back-squat-n-e-shcap.r\"/><use href=\"#barbell-back-squat-n-e-upper.r\"/><use href=\"#barbell-back-squat-n-e-elbowcap.r\"/><use href=\"#barbell-back-squat-n-e-fore.r\"/><use href=\"#barbell-back-squat-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^35\"/><path class=\"eq-pin\" d=\"^36\"/><path class=\"eq-cable m-line\" d=\"~M!)D1PXnLX1X8LB3H1LO2P2LG1D3L0P3LH1D3LP2P2LD3H1LP30LD3G1LP2O2LH1B3L0O3LG1B3LO2O2LB3G1\"/><circle class=\"joint\" cx=\"199.15\" cy=\"225.23\" r=\"2.25\"/><circle class=\"joint\" cx=\"195.56\" cy=\"251.91\" r=\"2.25\"/><circle class=\"joint\" cx=\"159.03\" cy=\"279.02\" r=\"2.25\"/><circle class=\"joint\" cx=\"217.93\" cy=\"276.06\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#y20wGD1DXp)FD1xPp0100020100000W50000000000000000000000000000000c000000000000000000000000000002000001000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000\"/><path class=\"arrow\" d=\"~MwGD1P*D1LXiOB1LFY1PB1Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M229.44 257.31A22 22 0 0 0 195.96 277.16\"/><g class=\"arc-ticks\"><path d=\"~M(JJ1P*S1LNt*O1\"/><path d=\"~MWxE1wzW1LzY1!2\"/></g><path class=\"leader\" d=\"~MSBF1H!R1LDy8xB5\"/></g></g><path class=\"leader\" d=\"M196 121.52L164.51 134H154.51\"/><circle class=\"anchor\" cx=\"196\" cy=\"121.52\" r=\"1.5\"/><path class=\"leader\" d=\"M217.93 276.06L247 312H257\"/><circle class=\"anchor\" cx=\"217.93\" cy=\"276.06\" r=\"1.5\"/><path class=\"leader\" d=\"M179.54 339L170.82 323H160.82\"/><circle class=\"anchor\" cx=\"179.54\" cy=\"339\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"barbell-back-squat-n-bar\" data-key=\"bar\" data-cue=\"The bar travels straight down and up over the middle of the foot.\" class=\"plate-callout two\" style=\"left:24.02%;top:31.28%\" aria-pressed=\"true\">Bar over<br>mid-foot</button><button type=\"button\" id=\"barbell-back-squat-n-knees\" data-key=\"knees\" data-cue=\"Let the knees travel forward and out, in line with the toes.\" class=\"plate-callout two\" style=\"left:70.39%;top:81.01%\" aria-pressed=\"false\">Knees over<br>toes</button><button type=\"button\" id=\"barbell-back-squat-n-heels\" data-key=\"heels\" data-cue=\"Keep the whole foot flat; the heels never lift.\" class=\"plate-callout\" style=\"left:20.67%;top:84.08%\" aria-pressed=\"false\">Heels down</button><span class=\"plate-arc-label\" style=\"left:69.83%;top:62.01%\"><b>Knee</b><span>about 125° bend</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"barbell-back-squat-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"barbell-back-squat-m-st-head\" d=\"^0\"/><path id=\"barbell-back-squat-m-st-torso\" d=\"^1\"/><path id=\"barbell-back-squat-m-st-thigh.r\" d=\"^2\"/><path id=\"barbell-back-squat-m-st-kneecap.r\" d=\"^3\"/><path id=\"barbell-back-squat-m-st-shank.r\" d=\"^4\"/><path id=\"barbell-back-squat-m-st-foot.r\" d=\"^5\"/><path id=\"barbell-back-squat-m-g0-head\" d=\"^6\"/><path id=\"barbell-back-squat-m-g0-torso\" d=\"^7\"/><path id=\"barbell-back-squat-m-g0-thigh.r\" d=\"^8\"/><path id=\"barbell-back-squat-m-g0-kneecap.r\" d=\"^9\"/><path id=\"barbell-back-squat-m-g0-shank.r\" d=\"^10\"/><path id=\"barbell-back-squat-m-g0-foot.r\" d=\"^11\"/><path id=\"barbell-back-squat-m-g1-head\" d=\"^12\"/><path id=\"barbell-back-squat-m-g1-torso\" d=\"^13\"/><path id=\"barbell-back-squat-m-g1-thigh.r\" d=\"^14\"/><path id=\"barbell-back-squat-m-g1-kneecap.r\" d=\"^15\"/><path id=\"barbell-back-squat-m-g1-shank.r\" d=\"^16\"/><path id=\"barbell-back-squat-m-g1-foot.r\" d=\"^17\"/><path id=\"barbell-back-squat-m-e-thigh.l\" d=\"^18\"/><path id=\"barbell-back-squat-m-e-kneecap.l\" d=\"^19\"/><path id=\"barbell-back-squat-m-e-shank.l\" d=\"^20\"/><path id=\"barbell-back-squat-m-e-foot.l\" d=\"^21\"/><path id=\"barbell-back-squat-m-e-shcap.l\" d=\"^22\"/><path id=\"barbell-back-squat-m-e-upper.l\" d=\"^23\"/><path id=\"barbell-back-squat-m-e-elbowcap.l\" d=\"^24\"/><path id=\"barbell-back-squat-m-e-fore.l\" d=\"^25\"/><path id=\"barbell-back-squat-m-e-fist.l\" d=\"^26\"/><path id=\"barbell-back-squat-m-e-head\" d=\"^27\"/><path id=\"barbell-back-squat-m-e-torso\" d=\"^28\"/><path id=\"barbell-back-squat-m-e-thigh.r\" d=\"^18\"/><path id=\"barbell-back-squat-m-e-kneecap.r\" d=\"^19\"/><path id=\"barbell-back-squat-m-e-shank.r\" d=\"^20\"/><path id=\"barbell-back-squat-m-e-foot.r\" d=\"^21\"/><path id=\"barbell-back-squat-m-e-shcap.r\" d=\"^22\"/><path id=\"barbell-back-squat-m-e-upper.r\" d=\"^23\"/><path id=\"barbell-back-squat-m-e-elbowcap.r\" d=\"^24\"/><path id=\"barbell-back-squat-m-e-fore.r\" d=\"^25\"/><path id=\"barbell-back-squat-m-e-fist.r\" d=\"^26\"/><path id=\"barbell-back-squat-m-m-head\" d=\"~#w12!GP1S)B1XNO1zTA1zrI1)j-7x5RaX5uY2)8w3Id_4zsYc)4y6R7-cGeFnD9YjJcSbShw1wpIfUb1110020200000100020001000001000000000000000000000000212000000011\"/><path id=\"barbell-back-squat-m-m-torso\" d=\"~#_12_YI1SxF1XxK1TGE1_4Ohz8*8TcFiz1Pbz8YieP4NlXaA1.c)bV6!eW7Nj_9Dry4!odAaR3N5xh_4BJ1_aIrViD6I4YmDkK2T5S6y1xfReIaIlA4Y4F2y9x1BbDeOO2OF110100000000022220001000002020000010111000000001010100000000000101010010120210020000111101010100000110001200000011000\"/><path id=\"barbell-back-squat-m-m-thigh.l\" d=\"~#F12yItDXV1V(r)TV1Eb25F1!_1W5I6)6E3E3xO1xa-kVf)jB3ToS8.O1*4z4D2B8W4_-1Uc4B1RaR3EjSs(A1ysPz1S5YI1Gf00001000010110021000022000000000010100200000000000001000000020001000100000100000\"/><path id=\"barbell-back-squat-m-m-kneecap.l\" d=\"~~!WE1YAV1_J10\"/><path id=\"barbell-back-squat-m-m-shank.l\" d=\"~#F12F-E1wSU1ROF1-FT1N6)9A1iTk__1S8V4A4K2An-*1DcO9!4*aE1Kfyu-_1tT4I2O9Ot!W1B1dy3KbBg(4xmHh-8_jD2(r00002002000000000000000010000000200000000000100012000000000001010100001010000002\"/><path id=\"barbell-back-squat-m-m-foot.l\" d=\"~#o2UIz1AB)1).z1zB(1wcF3Sgx8!n)nFU2B3EF2-4xA1)7Tm2)D1Y4Ta-cwrBb.kSp020012010100100101000000000210002101000000010100\"/><path id=\"barbell-back-squat-m-m-shcap.l\" d=\"~~J-D1SFJ1wP10\"/><path id=\"barbell-back-squat-m-m-upper.l\" d=\"~#F12A_D1yRJ1KXD1T!I1dx5a3D7WqS2)3y1.1Y3XbU6Bk*2EgBdTgT7V9V1K1V3-2N2Nr74I1)4-ixd)8Srw4AmwiYm10002020010101200010120000000000000000100000000000011100020000101011000000020010\"/><path id=\"barbell-back-squat-m-m-elbowcap.l\" d=\"~~PAF1!RR1Dz10\"/><path id=\"barbell-back-squat-m-m-fore.l\" d=\"~#F12PJH1NRR1-GH1GIS1R1P9pX1*3)E1K3U8T1D21wtX6!c4Fbw7WcqwtU1A2U3S8y3zF1mV1!1N9AaF2HaXj5BhXaKj21010001000000101000000000120000000000000000000101000002100000021000000000020000\"/><path id=\"barbell-back-squat-m-m-fist.l\" d=\"~~NAF1yRF1ww10\"/><path id=\"barbell-back-squat-m-m-thigh.r\" d=\"^49\"/><path id=\"barbell-back-squat-m-m-kneecap.r\" d=\"^50\"/><path id=\"barbell-back-squat-m-m-shank.r\" d=\"^51\"/><path id=\"barbell-back-squat-m-m-foot.r\" d=\"^52\"/><path id=\"barbell-back-squat-m-m-shcap.r\" d=\"^53\"/><path id=\"barbell-back-squat-m-m-upper.r\" d=\"^54\"/><path id=\"barbell-back-squat-m-m-elbowcap.r\" d=\"^55\"/><path id=\"barbell-back-squat-m-m-fore.r\" d=\"^56\"/><path id=\"barbell-back-squat-m-m-fist.r\" d=\"^57\"/><path id=\"barbell-back-squat-m-m-eq0\" d=\"~~SKF1yRF1!m1\"/><path id=\"barbell-back-squat-m-m-eq1\" d=\"~~D(F1yRF1F60\"/><path id=\"barbell-back-squat-m-m-eq2\" d=\"^58\"/><path id=\"barbell-back-squat-m-m-eq3\" d=\"^59\"/><path id=\"barbell-back-squat-m-mo-0\" d=\"^27\"/><path id=\"barbell-back-squat-m-mo-1\" d=\"^28\"/><path id=\"barbell-back-squat-m-mo-2\" d=\"^18\"/><path id=\"barbell-back-squat-m-mo-3\" d=\"^19\"/><path id=\"barbell-back-squat-m-mo-4\" d=\"^20\"/><path id=\"barbell-back-squat-m-mo-5\" d=\"^21\"/><path id=\"barbell-back-squat-m-mo-6\" d=\"^22\"/><path id=\"barbell-back-squat-m-mo-7\" d=\"^23\"/><path id=\"barbell-back-squat-m-mo-8\" d=\"^24\"/><path id=\"barbell-back-squat-m-mo-9\" d=\"^25\"/><path id=\"barbell-back-squat-m-mo-10\" d=\"^26\"/><path id=\"barbell-back-squat-m-mo-11\" d=\"^18\"/><path id=\"barbell-back-squat-m-mo-12\" d=\"^19\"/><path id=\"barbell-back-squat-m-mo-13\" d=\"^20\"/><path id=\"barbell-back-squat-m-mo-14\" d=\"^21\"/><path id=\"barbell-back-squat-m-mo-15\" d=\"^22\"/><path id=\"barbell-back-squat-m-mo-16\" d=\"^23\"/><path id=\"barbell-back-squat-m-mo-17\" d=\"^24\"/><path id=\"barbell-back-squat-m-mo-18\" d=\"^25\"/><path id=\"barbell-back-squat-m-mo-19\" d=\"^26\"/><path id=\"barbell-back-squat-m-mo-20\" d=\"^35\"/><path id=\"barbell-back-squat-m-mo-21\" d=\"^36\"/><path id=\"barbell-back-squat-m-mo-22\" d=\"^35\"/><path id=\"barbell-back-squat-m-mo-23\" d=\"^36\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#barbell-back-squat-m-dots)\"/>\n  <path class=\"datum\" d=\"^29\"/><path class=\"floorline\" d=\"^31\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-back-squat-m-st-head\"/><use href=\"#barbell-back-squat-m-st-torso\"/><use href=\"#barbell-back-squat-m-st-thigh.r\"/><use href=\"#barbell-back-squat-m-st-kneecap.r\"/><use href=\"#barbell-back-squat-m-st-shank.r\"/><use href=\"#barbell-back-squat-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-back-squat-m-st-head\"/><use href=\"#barbell-back-squat-m-st-torso\"/><use href=\"#barbell-back-squat-m-st-thigh.r\"/><use href=\"#barbell-back-squat-m-st-kneecap.r\"/><use href=\"#barbell-back-squat-m-st-shank.r\"/><use href=\"#barbell-back-squat-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-back-squat-m-g0-head\"/><use href=\"#barbell-back-squat-m-g0-torso\"/><use href=\"#barbell-back-squat-m-g0-thigh.r\"/><use href=\"#barbell-back-squat-m-g0-kneecap.r\"/><use href=\"#barbell-back-squat-m-g0-shank.r\"/><use href=\"#barbell-back-squat-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-back-squat-m-g0-head\"/><use href=\"#barbell-back-squat-m-g0-torso\"/><use href=\"#barbell-back-squat-m-g0-thigh.r\"/><use href=\"#barbell-back-squat-m-g0-kneecap.r\"/><use href=\"#barbell-back-squat-m-g0-shank.r\"/><use href=\"#barbell-back-squat-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-back-squat-m-g1-head\"/><use href=\"#barbell-back-squat-m-g1-torso\"/><use href=\"#barbell-back-squat-m-g1-thigh.r\"/><use href=\"#barbell-back-squat-m-g1-kneecap.r\"/><use href=\"#barbell-back-squat-m-g1-shank.r\"/><use href=\"#barbell-back-squat-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-back-squat-m-g1-head\"/><use href=\"#barbell-back-squat-m-g1-torso\"/><use href=\"#barbell-back-squat-m-g1-thigh.r\"/><use href=\"#barbell-back-squat-m-g1-kneecap.r\"/><use href=\"#barbell-back-squat-m-g1-shank.r\"/><use href=\"#barbell-back-squat-m-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-line\" d=\"^33\"/><path class=\"eq-thin\" d=\"^34\"/><path class=\"eq-solid\" d=\"^35\"/><path class=\"eq-pin\" d=\"^36\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#barbell-back-squat-m-e-thigh.l\"/><use href=\"#barbell-back-squat-m-e-kneecap.l\"/><use href=\"#barbell-back-squat-m-e-shank.l\"/><use href=\"#barbell-back-squat-m-e-foot.l\"/><use href=\"#barbell-back-squat-m-e-shcap.l\"/><use href=\"#barbell-back-squat-m-e-upper.l\"/><use href=\"#barbell-back-squat-m-e-elbowcap.l\"/><use href=\"#barbell-back-squat-m-e-fore.l\"/><use href=\"#barbell-back-squat-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#barbell-back-squat-m-e-thigh.l\"/><use href=\"#barbell-back-squat-m-e-kneecap.l\"/><use href=\"#barbell-back-squat-m-e-shank.l\"/><use href=\"#barbell-back-squat-m-e-foot.l\"/><use href=\"#barbell-back-squat-m-e-shcap.l\"/><use href=\"#barbell-back-squat-m-e-upper.l\"/><use href=\"#barbell-back-squat-m-e-elbowcap.l\"/><use href=\"#barbell-back-squat-m-e-fore.l\"/><use href=\"#barbell-back-squat-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-back-squat-m-e-head\"/><use href=\"#barbell-back-squat-m-e-torso\"/><use href=\"#barbell-back-squat-m-e-thigh.r\"/><use href=\"#barbell-back-squat-m-e-kneecap.r\"/><use href=\"#barbell-back-squat-m-e-shank.r\"/><use href=\"#barbell-back-squat-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-back-squat-m-e-head\"/><use href=\"#barbell-back-squat-m-e-torso\"/><use href=\"#barbell-back-squat-m-e-thigh.r\"/><use href=\"#barbell-back-squat-m-e-kneecap.r\"/><use href=\"#barbell-back-squat-m-e-shank.r\"/><use href=\"#barbell-back-squat-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-back-squat-m-e-shcap.r\"/><use href=\"#barbell-back-squat-m-e-upper.r\"/><use href=\"#barbell-back-squat-m-e-elbowcap.r\"/><use href=\"#barbell-back-squat-m-e-fore.r\"/><use href=\"#barbell-back-squat-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-back-squat-m-e-shcap.r\"/><use href=\"#barbell-back-squat-m-e-upper.r\"/><use href=\"#barbell-back-squat-m-e-elbowcap.r\"/><use href=\"#barbell-back-squat-m-e-fore.r\"/><use href=\"#barbell-back-squat-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^35\"/><path class=\"eq-pin\" d=\"^36\"/><path class=\"eq-cable m-line\" d=\"^37\"/><circle class=\"joint\" cx=\"199.15\" cy=\"225.23\" r=\"2.25\"/><circle class=\"joint\" cx=\"195.56\" cy=\"251.91\" r=\"2.25\"/><circle class=\"joint\" cx=\"159.03\" cy=\"279.02\" r=\"2.25\"/><circle class=\"joint\" cx=\"217.93\" cy=\"276.06\" r=\"2.25\"/></g><mask id=\"barbell-back-squat-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#barbell-back-squat-m-m-head\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-torso\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-thigh.l\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-shank.l\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-foot.l\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-shcap.l\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-upper.l\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-fore.l\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-fist.l\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-thigh.r\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-shank.r\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-foot.r\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-shcap.r\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-upper.r\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-fore.r\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-m-fist.r\" fill=\"#000\"/><use href=\"#barbell-back-squat-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-back-squat-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#barbell-back-squat-m-mmask)\"><g class=\"u-stroke\"><use href=\"#barbell-back-squat-m-m-head\"/><use href=\"#barbell-back-squat-m-m-torso\"/><use href=\"#barbell-back-squat-m-m-thigh.l\"/><use href=\"#barbell-back-squat-m-m-kneecap.l\"/><use href=\"#barbell-back-squat-m-m-shank.l\"/><use href=\"#barbell-back-squat-m-m-foot.l\"/><use href=\"#barbell-back-squat-m-m-shcap.l\"/><use href=\"#barbell-back-squat-m-m-upper.l\"/><use href=\"#barbell-back-squat-m-m-elbowcap.l\"/><use href=\"#barbell-back-squat-m-m-fore.l\"/><use href=\"#barbell-back-squat-m-m-fist.l\"/><use href=\"#barbell-back-squat-m-m-thigh.r\"/><use href=\"#barbell-back-squat-m-m-kneecap.r\"/><use href=\"#barbell-back-squat-m-m-shank.r\"/><use href=\"#barbell-back-squat-m-m-foot.r\"/><use href=\"#barbell-back-squat-m-m-shcap.r\"/><use href=\"#barbell-back-squat-m-m-upper.r\"/><use href=\"#barbell-back-squat-m-m-elbowcap.r\"/><use href=\"#barbell-back-squat-m-m-fore.r\"/><use href=\"#barbell-back-squat-m-m-fist.r\"/><use href=\"#barbell-back-squat-m-m-eq0\"/><use href=\"#barbell-back-squat-m-m-eq1\"/><use href=\"#barbell-back-squat-m-m-eq2\"/><use href=\"#barbell-back-squat-m-m-eq3\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MwGD1YDF1LN.2HaM*q!fL(q.fLVR1R5\"/><path class=\"m-line\" d=\"~MNAG1SWG1L0DPo\"/><path class=\"leader m\" d=\"~MySqU.P1L0zT1\"/><path class=\"leader m\" d=\"~M(*G1PIO1LHA5Of\"/><path class=\"leader m\" d=\"M210.63 253.55L251 284H261\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"barbell-back-squat-m-hips\" data-key=\"hips\" data-cue=\"The hips come up before the shoulders.\" class=\"plate-callout two m\" style=\"left:18.44%;top:56.42%\" aria-pressed=\"true\">Hips rise<br>first</button><button type=\"button\" id=\"barbell-back-squat-m-chest\" data-key=\"chest\" data-cue=\"The chest falls and the trunk tips forward.\" class=\"plate-callout m\" style=\"left:65.92%;top:60.89%\" aria-pressed=\"false\">Chest drops</button><button type=\"button\" id=\"barbell-back-squat-m-drift\" data-key=\"drift\" data-cue=\"The bar moves out over the toes.\" class=\"plate-callout two m\" style=\"left:71.51%;top:73.18%\" aria-pressed=\"false\">Bar drifts<br>forward</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "bar",
        cues: [{ key: "bar", cue: "The bar travels straight down and up over the middle of the foot." }, { key: "knees", cue: "Let the knees travel forward and out, in line with the toes." }, { key: "heels", cue: "Keep the whole foot flat; the heels never lift." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "hips",
        cues: [{ key: "hips", cue: "The hips come up before the shoulders." }, { key: "chest", cue: "The chest falls and the trunk tips forward." }, { key: "drift", cue: "The bar moves out over the toes." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Hips rise first</b><span>The hips come up before the shoulders.</span></li><li><b>Chest drops</b><span>The chest falls and the trunk tips forward.</span></li><li><b>Bar drifts forward</b><span>The bar moves out over the toes.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower 2 seconds, drive up 1 second, brace 1 second\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Drive up</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Brace</b><span>1 s</span></div></div></div>",
      alt: "High-bar barbell back squat, side view. The bar rests on the upper back over the middle of the foot. The lifter sits down until the thighs are about parallel, knees travelling forward over the toes, heels flat, trunk leaning about 40 degrees, and the bar moves in a straight vertical line.",
      mistakeAlt: "Barbell Back Squat: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "on-body",
    "orientation": "pronated",
    "handle": "bar-28",
    "loadAxis": "along-forearm",
    "overBody": false,
    "width": {
      "text": "A little wider than your shoulders. Go as narrow as is comfortable, so your forearms stay near upright. Use the rings on the bar to place your hands the same every set.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-back-squat",
          "hk-squat",
          "barbell-logic-squat-grip"
        ],
        "note": "No study sets an ideal width."
      }
    },
    "thumb": {
      "mode": "wrapped",
      "options": [
        {
          "mode": "beside",
          "when": "If wrapping bends your wrist back, rest your thumb over the bar."
        }
      ],
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nsca-summary",
          "barbell-logic-squat-grip"
        ],
        "note": "NSCA teaches the closed grip (the only source for it). Barbell Logic teaches thumb-over with the bar in the heel of the palm. The bar sits on the back, so the thumb has no safety job here."
      }
    },
    "contact": "heel",
    "wrist": {
      "ext": [
        0,
        15
      ],
      "dev": [
        -10,
        10
      ],
      "limitText": "Wrist folding back or taking weight? Your hands are holding the bar up.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbell-logic-squat-grip",
          "hk-squat",
          "schulz"
        ],
        "note": "Sources disagree: Human Kinetics teaches an extended wrist, Barbell Logic warns against over-extension. The card allows 0-15 deg and draws the line where the wrist starts carrying load. The 0-15 deg number is a coaching estimate."
      }
    },
    "pose": {
      "view": "radial",
      "forearm": 180,
      "wrist": {
        "ext": 8,
        "dev": 0
      },
      "contactAt": -0.1,
      "fingers": {
        "curl": 1
      },
      "thumb": "wrapped",
      "squeeze": "light",
      "handle": {
        "profile": "bar-28",
        "axis": "across",
        "diameterMm": 28
      },
      "load": {
        "kind": "on-body"
      }
    },
    "faults": [
      {
        "key": "waiter-tray",
        "label": "Bar in fingers",
        "pose": {
          "wrist": {
            "ext": 42,
            "dev": 0
          },
          "contactAt": 1.05,
          "fingers": {
            "curl": 0.92
          }
        },
        "markers": [
          "lever-arc"
        ],
        "alt": "Bar up in the fingers, hand bent back under it like a tray. The wrist bends about 40 degrees. The weight passes on the back-of-hand side, bending it further."
      }
    ],
    "gripLine": "Your back holds the bar. Your hands just pin it, in the heel of your palm.",
    "cue": "Your back holds the bar."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "safety",
      "text": "Collars on, pins just below your lowest squat to catch a miss.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "nsca-summary",
          "kerr2010",
          "ace-back-squat"
        ],
        "note": "Pins: CL.safety. Collars: card setup step 3 (coaching consensus)."
      }
    },
    {
      "kind": "position",
      "text": "Squeeze your shoulder blades so the bar rests on muscle.",
      "zoom": "bar-on-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hk-squat"
        ],
        "note": "Bar on muscle, not bone, is consensus."
      }
    },
    {
      "kind": "brace",
      "text": "Breathe into your belly, brace, and stand the bar up.",
      "claim": {
        "tags": [
          "MECH",
          "CONSENSUS"
        ],
        "sources": [
          "hackett2013",
          "lander1992",
          "nsca-summary"
        ],
        "note": "A held breath raises trunk pressure (Hackett 2013); the high-blood-pressure caution is consensus."
      }
    },
    {
      "kind": "position",
      "text": "Step back, feet hip to shoulder width, toes out a little.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "hk-squat",
          "ace-back-squat",
          "fry2003"
        ],
        "note": "Knee tracking and heels down are consensus; knees past the toes kept hip torque low (Fry 2003, n=7)."
      }
    },
    {
      "kind": "safety",
      "text": "Stuck? Lower the bar onto the pins. Don't throw it.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nsca-summary"
        ],
        "note": "Coaching consensus (card)."
      }
    }
  ],
  posture: [
    {
      "key": "bar",
      "label": "Bar on traps",
      "detail": "The bar sits on the upper traps, just below the bony bump. It is centred and never on the neck bones.",
      "anchor": {
        "pose": "start",
        "at": "backUpper"
      },
      "zoom": "bar-on-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hk-squat"
        ],
        "note": "Bar on muscle, not bone, is consensus."
      }
    },
    {
      "key": "hands",
      "label": "Wrists straight",
      "detail": "Hands even, a little wider than the shoulders, forearms roughly upright, elbows down. Knuckles to forearm in a nearly straight line.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-back-squat",
          "hk-squat",
          "barbell-logic-squat-grip"
        ],
        "note": "Everything about the hands is coaching consensus. No study measures wrist or elbow load in the back squat."
      }
    },
    {
      "key": "midfoot",
      "label": "Bar over mid-foot",
      "detail": "From the side, the bar stays over the middle of the foot, top to bottom.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "glassbrook2017"
        ],
        "note": "Glassbrook 2017 says the centre of mass stays over the base of support; it does not name the mid-foot. The mid-foot line is consensus."
      }
    },
    {
      "key": "feet",
      "label": "Knees follow toes",
      "detail": "Feet hip to shoulder width, toes out a little, heels down. Each knee points where its foot points and may pass the toes.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "hk-squat",
          "ace-back-squat",
          "fry2003"
        ],
        "note": "Knee tracking and heels down are consensus; knees past the toes kept hip torque low (Fry 2003, n=7)."
      }
    },
    {
      "key": "back",
      "label": "Back flat",
      "detail": "The body leans forward but the back stays flat from hips to neck. Eyes ahead, neck in line.",
      "anchor": {
        "pose": "end",
        "at": "backMid"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "hk-squat",
          "glassbrook2017",
          "fry2003"
        ]
      }
    },
    {
      "key": "depth",
      "label": "Hip at knee",
      "detail": "At the bottom, the hip crease is at or below the top of the knee. If your lower back tucks under, stop a little higher.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "zoom": "depth",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "ace-back-squat",
          "kubo2019",
          "bloomquist2013",
          "caterisano2002"
        ],
        "note": "Full squats grew the glutes and inner thighs more than half squats (Kubo 2019); deep squats grew the front thigh more (Bloomquist 2013); glute share rises with depth (Caterisano 2002)."
      }
    }
  ],
  zooms: [
    {
      "key": "hand",
      "chip": "Hand",
      "heading": "Hand: right and wrong",
      "kind": "hand",
      "feelRow": "wrist"
    },
    {
      "key": "bar-on-back",
      "chip": "Bar on back",
      "heading": "Bar on back: right and wrong",
      "kind": "posture"
    },
    {
      "key": "depth",
      "chip": "Depth",
      "heading": "Depth: right and wrong",
      "kind": "posture"
    }
  ],
  copy: {
    "setupLine": "Set the bar at armpit height and the pins just below your lowest squat. Bar on your upper traps, then stand up.",
    "mistakeLine": "If wrists or elbows ache after squats, your hands held the bar up. Let your back hold it.",
    "gripLine": "Your back holds the bar. Your hands just pin it, in the heel of your palm."
  },
  mistakes: [
    {
      "key": "hands",
      "title": "Hands holding the bar up",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbell-logic-squat-grip"
        ]
      },
      "fix": "Elbows down, so your back holds the bar."
    },
    {
      "key": "knees",
      "title": "Knees caving or heels lifting",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hk-squat"
        ]
      },
      "fix": "Knees out over toes, heels down. Still caving? Go lighter."
    },
    {
      "key": "hips",
      "title": "Hips shoot up, back rounds",
      "zoom": "depth",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "fry2003",
          "hackett2013"
        ]
      },
      "fix": "Brace. Chest and hips rise together."
    }
  ],
  risks: [
    {
      "key": "back",
      "text": "Hips shooting up or a rounding back loads your lower back far more.",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "fry2003"
        ],
        "note": "Fry 2003, 7 lifters, a related lab set-up."
      }
    },
    {
      "key": "breath",
      "text": "High blood pressure? Don't hold your breath long. Breathe out as you stand.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hackett2013"
        ],
        "note": "Card fix text (mistake 4); Hackett 2013 is about bracing, not blood pressure."
      }
    }
  ],
  riskFlags: [
    "wrist",
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
    "ace-back-squat",
    "hk-squat",
    "nsca-summary",
    "barbell-logic-squat-grip",
    "schulz",
    "glassbrook2017",
    "wretenberg1996",
    "caterisano2002",
    "kubo2019",
    "bloomquist2013",
    "paoli2009",
    "clark2012",
    "escamilla2001",
    "contreras2015",
    "fry2003",
    "hackett2013",
    "lander1992",
    "kerr2010",
    "nhs-wrist-pain",
    "nhs-knee-pain"
  ],
  research: {
    "card": "grip/research/barbell_back_squat.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

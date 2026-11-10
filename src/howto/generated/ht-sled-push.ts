// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=daa3b866d443aa7148a9a8b760eb86feb7f69b322cf1a8591765abf4a68ddba3
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_sled_push",
  name: "Sled Push",
  hashes: { inputsSha256: "daa3b866d443aa7148a9a8b760eb86feb7f69b322cf1a8591765abf4a68ddba3", golden: "0c3e0f842acebc5093f6d7270bd9b81bac9338e5ce196f067044ece1ef90d5d5" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"sled-push-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"sled-push-n-st-thigh.r\" d=\"~#F12SYhFNK1*Hi)GJ1(3K9rjVpWO1w8x3W3T1_p*B1JjIby9-eF1KmymBF19z4rK8VuPJ1uiS6-7ThVmKy1DkzgJqG2(E100000021000000220000120000010000101000000010101101002100000010000000002000101000\"/><path id=\"sled-push-n-st-kneecap.r\" d=\"~~H_cYPX1SD12\"/><path id=\"sled-push-n-st-shank.r\" d=\"~#F12(ydHWW1Gwe*-V1(7T6qm-w1PI1J8V1y4vWz1IK1ScT4Y6X7A3*cSF1zG1ez4mK8xE1_B1pjS5V8*e6VmN8GcweO5Pn00000100001210002000011110002001100000101100000000101010000010011110100020200002\"/><path id=\"sled-push-n-st-foot.r\" d=\"~#o2JP6DI(1zD7OU*1(9P5JgV2WqEeFI2Fh.(1xlzuEf*jG5Vz1G5O6zdNq*2GoJg000010001210101000100000202000001100001000020000\"/><path id=\"sled-push-n-g0-thigh.r\" d=\"~#F12FShWBO1GyhEwN1X4B9vcwkFS1W2)7D1*3KczJ1_3zmO5OgIgKfRgXH1G3I2)6-4FeDU1w19V1zaXsB1V6NE1Y9JtytHr00100000002000000210101010000000010101010000000000001010000001110120000010111002\"/><path id=\"sled-push-n-g0-kneecap.r\" d=\"~~JVl!PY1SD12\"/><path id=\"sled-push-n-g0-shank.r\" d=\"~#F12(Jm!IX1.TnT)W1yaG2cw1VP1FoF8F2w4sFU1ToFdJ1P9.3S8EaWW1ViD2O3J4G7-T1Sgdv!8G5OdK6)nR2Ghw7KfUi00002202000000020000000200001110000100000000000020220000000101000000000000000200\"/><path id=\"sled-push-n-g0-foot.r\" d=\"~#o2YRcWJ.1REd)V_1waP5JgV2WqEeFI2Fh-(1zlBuBf)jG5Tz1E5O6BdPq*2IoJg000020001200000001101110100012000000010000021000\"/><path id=\"sled-push-n-e-thigh.l\" d=\"~#F12SPhY)N1EAhx-K1-3K9v6yf(T1S3V7N1.3z8xK1_5Vl*3*g-e.gOczJ1x3X2O6I5F9FV1y15nGaOsX3KaSD1y7AuHqyu00000021010100000010010020000000000020012021000020011000000001000200000020000001\"/><path id=\"sled-push-n-e-kneecap.l\" d=\"~~_WkS-Y1SD12\"/><path id=\"sled-push-n-e-shank.l\" d=\"~#F12FAlP_X1.BmIzX1_8E5osRE1HB1P85D49YH1-D1ydO2y8O6D5Ec_N1Xx1A1x4A2B8.J1_ulpw7T7-eB2XnN4Oe_bG9Dm02110020000101000000001000000000002200101011000000001110000020101001102101012000\"/><path id=\"sled-push-n-e-foot.l\" d=\"~#o2_BdDI(1T.dOU*1waP5JgV2WqEeFI2Fh-(1xlBuEf)jG5Tz1G5O6zdPq*2IoJg000020000200000000001010100000002100000020020000\"/><path id=\"sled-push-n-e-shcap.l\" d=\"~~Y.tYPN1HG12\"/><path id=\"sled-push-n-e-upper.l\" d=\"~#F12!yvy_O1EAuTXO1T7p05wG12*4*2R2I1Vw1X6VfR9BelOgY7Ix1D3T2y1E5P2_F1D40aX71V1(dJl(cHjy1SmRa01000000120001000212000020010110022000001001010000000100000110100000000010100001\"/><path id=\"sled-push-n-e-elbowcap.l\" d=\"~~JDD1P(N1Hu0\"/><path id=\"sled-push-n-e-fore.l\" d=\"~#F12HDE1D(O1xND1.!O1*8vU1lDB1*4E8V2)1E1Ksy1GbG5T9gVaN6Is_1*1P1.7P3SB1y1S1iV8(18Y8HhA8_elJg*900000222001010011100200000000000200001000000000000000011110000000100011000000021\"/><path id=\"sled-push-n-e-fist.l\" d=\"~~NWN1YPN1Sr0\"/><path id=\"sled-push-n-e-head\" d=\"~#w12WYE1YPN1*wF1TAK1RgRgE8RgY2T9z4X2!6z4U9*6HjzfybA4D8G12TgU9HjP5HjV2(h.dPgOgI12101002001000000000010001000020000100000210000002020000010200000\"/><path id=\"sled-push-n-e-torso\" d=\"~#_12_Vz1JEK1-*A1TOK1S5E80-2BfF8O5H8-dyb2N5UkK5(6IjB4)aD4_dN5!h_dHjDfDfF8A4_d*6HuInJnV90O52E8-dwb.6_2!6zb*6Vd-hR5T5P5Y9yb*6Y2RrVE200000001010000000202000001000000011010000010000000220000200000000010001002020000000200001110100000000000221010101010\"/><path id=\"sled-push-n-e-thigh.r\" d=\"~#F12y.hwXO1)wh-XN1z7I7rkWx1HH1aK80B4XoRD1X2GmzaBexk)9GsxA1.3I1x8R2Ys_K1ujT4z9XrD7(4WE1!hDp_z1_h00000000000000200020010010010000000200101000000100000000220002000000000000000012\"/><path id=\"sled-push-n-e-kneecap.r\" d=\"~~YKoAAX1SD12\"/><path id=\"sled-push-n-e-shank.r\" d=\"~#F12!UoNIW1OPpKKV1N7)6ukEuHK1F8B2w4E1wx1GO1FcI5H6z8H2zdAD1KI18x44R8-A1AF1nl(4*8-eA1zmU9Rb_ez4Wn00101200000010000020000002000100110000012020000000000020000010020001000000010000\"/><path id=\"sled-push-n-e-foot.r\" d=\"~#o2yTiDI(1.FjOU*1waP5JgV2WqEeFI2Fh-(1xlBuEf)jG5Tz1G5O6zdPq*2IoJg000020000200000000001010100000002100000020020000\"/><path id=\"sled-push-n-e-shcap.r\" d=\"^12\"/><path id=\"sled-push-n-e-upper.r\" d=\"^13\"/><path id=\"sled-push-n-e-elbowcap.r\" d=\"^14\"/><path id=\"sled-push-n-e-fore.r\" d=\"^15\"/><path id=\"sled-push-n-e-fist.r\" d=\"^16\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#sled-push-n-dots)\"/>\n  <path class=\"datum\" d=\"~MUBb!PH1L!Xz1!)4\"/><path class=\"floorline\" d=\"M-26 339.5H354.71\"/><path class=\"eq\" d=\"~M(TO1YDy2LPWi0QYf0XDiXfLXfYfQ0XfXfXfLXDiYfQXf0YDiYfLYfXfQ0YfYfYfZ\"/><path class=\"eq\" d=\"~M_.O1UOw2LYDi0QUn0zOhTnLTnUnQ0TnTnTnLzOhUnQTn0AOhUnLUnTnQ0UnUnUnZ\"/><path class=\"eq-solid\" d=\"~MUEP1FEx2LUn0LTnTnLTnUnZ\"/><path class=\"eq-solid\" d=\"~MA)w2FEx2LUn0LTnTnLTnUnZ\"/><path class=\"eq\" d=\"~M!S-1WJ(1L0zU7Q0VjVjNw7LWjWjQVj0VjWjLWjNw7Q0WjWjKw7LVjVjQWj0WjVjZ\"/><path class=\"eq-solid\" d=\"~MwNT1Jw)1LJyb0LIybEO1LIybFO1Z\"/><path class=\"eq-solid\" d=\"~MwNT1AR*1LJyb0LIybEO1LIybFO1Z\"/><path class=\"eq\" d=\"~MY)O1US(1L0Xzw1Q0XdXdwWvLYdYdQ-d0-dYdL_dwWvQ0Yd_d)VvL-dXdQYd0YdXdZ\"/><path class=\"eq-solid\" d=\"~MwSO1Jw)1LP(20L)!5O(2Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-push-n-st-thigh.r\"/><use href=\"#sled-push-n-st-kneecap.r\"/><use href=\"#sled-push-n-st-shank.r\"/><use href=\"#sled-push-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sled-push-n-st-thigh.r\"/><use href=\"#sled-push-n-st-kneecap.r\"/><use href=\"#sled-push-n-st-shank.r\"/><use href=\"#sled-push-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-push-n-g0-thigh.r\"/><use href=\"#sled-push-n-g0-kneecap.r\"/><use href=\"#sled-push-n-g0-shank.r\"/><use href=\"#sled-push-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sled-push-n-g0-thigh.r\"/><use href=\"#sled-push-n-g0-kneecap.r\"/><use href=\"#sled-push-n-g0-shank.r\"/><use href=\"#sled-push-n-g0-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#sled-push-n-e-thigh.l\"/><use href=\"#sled-push-n-e-kneecap.l\"/><use href=\"#sled-push-n-e-shank.l\"/><use href=\"#sled-push-n-e-foot.l\"/><use href=\"#sled-push-n-e-shcap.l\"/><use href=\"#sled-push-n-e-upper.l\"/><use href=\"#sled-push-n-e-elbowcap.l\"/><use href=\"#sled-push-n-e-fore.l\"/><use href=\"#sled-push-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#sled-push-n-e-thigh.l\"/><use href=\"#sled-push-n-e-kneecap.l\"/><use href=\"#sled-push-n-e-shank.l\"/><use href=\"#sled-push-n-e-foot.l\"/><use href=\"#sled-push-n-e-shcap.l\"/><use href=\"#sled-push-n-e-upper.l\"/><use href=\"#sled-push-n-e-elbowcap.l\"/><use href=\"#sled-push-n-e-fore.l\"/><use href=\"#sled-push-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-push-n-e-head\"/><use href=\"#sled-push-n-e-torso\"/><use href=\"#sled-push-n-e-thigh.r\"/><use href=\"#sled-push-n-e-kneecap.r\"/><use href=\"#sled-push-n-e-shank.r\"/><use href=\"#sled-push-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sled-push-n-e-head\"/><use href=\"#sled-push-n-e-torso\"/><use href=\"#sled-push-n-e-thigh.r\"/><use href=\"#sled-push-n-e-kneecap.r\"/><use href=\"#sled-push-n-e-shank.r\"/><use href=\"#sled-push-n-e-foot.r\"/></g></g><path class=\"eq\" d=\"^32\"/><path class=\"eq-solid\" d=\"^33\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-push-n-e-shcap.r\"/><use href=\"#sled-push-n-e-upper.r\"/><use href=\"#sled-push-n-e-elbowcap.r\"/><use href=\"#sled-push-n-e-fore.r\"/><use href=\"#sled-push-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sled-push-n-e-shcap.r\"/><use href=\"#sled-push-n-e-upper.r\"/><use href=\"#sled-push-n-e-elbowcap.r\"/><use href=\"#sled-push-n-e-fore.r\"/><use href=\"#sled-push-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"159.53\" cy=\"238.2\" r=\"2.25\"/><circle class=\"joint\" cx=\"200.44\" cy=\"240.4\" r=\"2.25\"/><circle class=\"joint\" cx=\"100\" cy=\"238.2\" r=\"2.25\"/><circle class=\"joint\" cx=\"131.25\" cy=\"282.26\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#w20PVbYzx2KKbVEx2001020000000000000001020000000000!7001020000000000000001020000011000000000000000000000000000000000000000000100000000000000000000000000000000020000000000000000000000000000000000000000000000001\"/><path class=\"arrow\" d=\"~M(YkHJx2L*G1cLN_1xy1Z\"/></g><path class=\"leader\" d=\"~MDwtPKI1L0EU9\"/><circle class=\"anchor\" cx=\"148.51\" cy=\"222.32\" r=\"1.5\"/><path class=\"leader\" d=\"M133.08 224.53L100.41 192H90.41\"/><circle class=\"anchor\" cx=\"133.08\" cy=\"224.53\" r=\"1.5\"/><path class=\"leader\" d=\"M112.6 337.81L135 302H145\"/><circle class=\"anchor\" cx=\"112.6\" cy=\"337.81\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"sled-push-n-line\" data-key=\"line\" data-cue=\"Body leans forward in a straight line from head to hips.\" class=\"plate-callout\" style=\"left:33.52%;top:39.11%\" aria-pressed=\"true\">Straight line</button><button type=\"button\" id=\"sled-push-n-flat\" data-key=\"flat\" data-cue=\"Spine neutral, abs tight.\" class=\"plate-callout\" style=\"left:4.47%;top:47.49%\" aria-pressed=\"false\">Flat back</button><button type=\"button\" id=\"sled-push-n-balls\" data-key=\"balls\" data-cue=\"Heels up, push through the balls of your feet.\" class=\"plate-callout\" style=\"left:39.11%;top:78.21%\" aria-pressed=\"false\">Balls of feet</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"sled-push-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"sled-push-m-st-thigh.r\" d=\"^0\"/><path id=\"sled-push-m-st-kneecap.r\" d=\"^1\"/><path id=\"sled-push-m-st-shank.r\" d=\"^2\"/><path id=\"sled-push-m-st-foot.r\" d=\"^3\"/><path id=\"sled-push-m-g0-thigh.r\" d=\"^4\"/><path id=\"sled-push-m-g0-kneecap.r\" d=\"^5\"/><path id=\"sled-push-m-g0-shank.r\" d=\"^6\"/><path id=\"sled-push-m-g0-foot.r\" d=\"^7\"/><path id=\"sled-push-m-e-thigh.l\" d=\"^8\"/><path id=\"sled-push-m-e-kneecap.l\" d=\"^9\"/><path id=\"sled-push-m-e-shank.l\" d=\"^10\"/><path id=\"sled-push-m-e-foot.l\" d=\"^11\"/><path id=\"sled-push-m-e-shcap.l\" d=\"^12\"/><path id=\"sled-push-m-e-upper.l\" d=\"^13\"/><path id=\"sled-push-m-e-elbowcap.l\" d=\"^14\"/><path id=\"sled-push-m-e-fore.l\" d=\"^15\"/><path id=\"sled-push-m-e-fist.l\" d=\"^16\"/><path id=\"sled-push-m-e-head\" d=\"^17\"/><path id=\"sled-push-m-e-torso\" d=\"^18\"/><path id=\"sled-push-m-e-thigh.r\" d=\"^19\"/><path id=\"sled-push-m-e-kneecap.r\" d=\"^20\"/><path id=\"sled-push-m-e-shank.r\" d=\"^21\"/><path id=\"sled-push-m-e-foot.r\" d=\"^22\"/><path id=\"sled-push-m-e-shcap.r\" d=\"^12\"/><path id=\"sled-push-m-e-upper.r\" d=\"^13\"/><path id=\"sled-push-m-e-elbowcap.r\" d=\"^14\"/><path id=\"sled-push-m-e-fore.r\" d=\"^15\"/><path id=\"sled-push-m-e-fist.r\" d=\"^16\"/><path id=\"sled-push-m-m-head\" d=\"~#w12NFE1!FV1RyF1IAU1)7)lfOiS6R7R2E4(7pWbB2(nR5D8J8y8F2y7)egSlx3!jzawfOjD9IeE80000000000000010100010010100000110000100000010220000110010002002\"/><path id=\"sled-push-m-m-torso\" d=\"~#_12FzA1AJS1*zB1OAT1N8B5D1O2EhA1O8A5zhD4E3Y1yiNbA8B2K2Kby4_dS5!hYdHjDfDfF8A4Yd*6JuInJnV9OkxaXo_gwoHdK7d(ax7bKf)dRcE7W2y4yeK7bH5TJ200110000000000100101010000010100000000101000000010020010000000200000002000000000001000000020001000220000001200100120\"/><path id=\"sled-push-m-m-thigh.l\" d=\"~#F12AEj(VN1Vwj-KK1K2)9v4D7UV1S4z7A2T3I1XK1w9RkG1GhBc)iX5IK1R2E3X5E6H1wW1y10oGaTr*7)fPA1J2!uSlUx101011020000002101000010002001200001100020000000200002010101101001000210000000000\"/><path id=\"sled-push-m-m-kneecap.l\" d=\"~~!!kHx-1SD12\"/><path id=\"sled-push-m-m-shank.l\" d=\"~#F12FIlPxY1RKmIIX1w9*4mqRF1FA1P80A45!I1RB1Ddz2D8E6S5xcYO1Ow1H1.3F2E8VK1UtjtA7I7VeT2-nY3.eJb)9(l12000000000000000000110110010000000000011000020000000021010002020000010000001010\"/><path id=\"sled-push-m-m-shcap.l\" d=\"~~HBuNUR1HG12\"/><path id=\"sled-push-m-m-upper.l\" d=\"~#F12HUvJ*S1XVuXwT1V7k17HF1V7K5*1V2tOx19zhK6xew2-eYaxw1N9K2U1T4J3_F1R328R7N1uweNnU8DjT2AkVe11101100010101000000000000000000000000000000120200101000021010020000000012100010\"/><path id=\"sled-push-m-m-elbowcap.l\" d=\"~~!KD1JRP1Hu0\"/><path id=\"sled-push-m-m-fore.l\" d=\"~#F12_TE1APR1X.D1ITR1*8kJ1vUz1.bR8vE2rXrJ6)bx3O9H2B9J8OrD7T1!1z7_4yB1)5Y18E8P3(1S8SiY4JeR3Fe-c00111010020000020000001100002000000220000200121100000020000000100000020000022000\"/><path id=\"sled-push-m-m-thigh.r\" d=\"~#F12AOjWPO1XYi-NN1E6x8tgWs(K1F1O8ex4BkzG15KmK8Gf.iBc)nxE1V3X1X7O3Nn_P1uhR3T9IsA4e!E1!eArSx1Yl00200200000200000100020200000001110000010002000001000000000000002200011000000021\"/><path id=\"sled-push-m-m-kneecap.r\" d=\"~~JBpNYX1SD12\"/><path id=\"sled-push-m-m-shank.r\" d=\"~#F12!Npw*W1zKqTxW1y8I6qoBy1JH1J8O1w4nHB1BJ1UcB4A7R7N3-cwH1VE1iz4uK8GF1PA1nl_5O8.e7)mU7XcUdI6Fn00000000000000000010000020002000010000000000110000000000000000220000120020000000\"/><path id=\"sled-push-m-m-foot.r\" d=\"~#o2yTiDI(1.FjOU*1waP5JgV2WqEeFI2Fh-(1xlBuEf)jI5Tz1B5O6BdPq*2IoJg000020000200000000001010100000022000000020020000\"/><path id=\"sled-push-m-m-shcap.r\" d=\"^44\"/><path id=\"sled-push-m-m-upper.r\" d=\"^45\"/><path id=\"sled-push-m-m-elbowcap.r\" d=\"^46\"/><path id=\"sled-push-m-m-fore.r\" d=\"^47\"/><path id=\"sled-push-m-mf-foot.l\" d=\"^11\"/><path id=\"sled-push-m-mf-fist.l\" d=\"^16\"/><path id=\"sled-push-m-mf-fist.r\" d=\"^16\"/><path id=\"sled-push-m-mo-0\" d=\"^17\"/><path id=\"sled-push-m-mo-1\" d=\"^18\"/><path id=\"sled-push-m-mo-2\" d=\"^8\"/><path id=\"sled-push-m-mo-3\" d=\"^9\"/><path id=\"sled-push-m-mo-4\" d=\"^10\"/><path id=\"sled-push-m-mo-5\" d=\"^11\"/><path id=\"sled-push-m-mo-6\" d=\"^12\"/><path id=\"sled-push-m-mo-7\" d=\"^13\"/><path id=\"sled-push-m-mo-8\" d=\"^14\"/><path id=\"sled-push-m-mo-9\" d=\"^15\"/><path id=\"sled-push-m-mo-10\" d=\"^16\"/><path id=\"sled-push-m-mo-11\" d=\"^19\"/><path id=\"sled-push-m-mo-12\" d=\"^20\"/><path id=\"sled-push-m-mo-13\" d=\"^21\"/><path id=\"sled-push-m-mo-14\" d=\"^22\"/><path id=\"sled-push-m-mo-15\" d=\"^12\"/><path id=\"sled-push-m-mo-16\" d=\"^13\"/><path id=\"sled-push-m-mo-17\" d=\"^14\"/><path id=\"sled-push-m-mo-18\" d=\"^15\"/><path id=\"sled-push-m-mo-19\" d=\"^16\"/><path id=\"sled-push-m-mo-20\" d=\"^25\"/><path id=\"sled-push-m-mo-21\" d=\"^26\"/><path id=\"sled-push-m-mo-22\" d=\"^27\"/><path id=\"sled-push-m-mo-23\" d=\"^28\"/><path id=\"sled-push-m-mo-24\" d=\"^29\"/><path id=\"sled-push-m-mo-25\" d=\"^30\"/><path id=\"sled-push-m-mo-26\" d=\"^31\"/><path id=\"sled-push-m-mo-27\" d=\"^32\"/><path id=\"sled-push-m-mo-28\" d=\"^33\"/><path id=\"sled-push-m-mo-29\" d=\"^32\"/><path id=\"sled-push-m-mo-30\" d=\"^33\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#sled-push-m-dots)\"/>\n  <path class=\"datum\" d=\"^23\"/><path class=\"floorline\" d=\"^24\"/><path class=\"eq\" d=\"^25\"/><path class=\"eq\" d=\"^26\"/><path class=\"eq-solid\" d=\"^27\"/><path class=\"eq-solid\" d=\"^28\"/><path class=\"eq\" d=\"^29\"/><path class=\"eq-solid\" d=\"^30\"/><path class=\"eq-solid\" d=\"^31\"/><path class=\"eq\" d=\"^32\"/><path class=\"eq-solid\" d=\"^33\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-push-m-st-thigh.r\"/><use href=\"#sled-push-m-st-kneecap.r\"/><use href=\"#sled-push-m-st-shank.r\"/><use href=\"#sled-push-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sled-push-m-st-thigh.r\"/><use href=\"#sled-push-m-st-kneecap.r\"/><use href=\"#sled-push-m-st-shank.r\"/><use href=\"#sled-push-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-push-m-g0-thigh.r\"/><use href=\"#sled-push-m-g0-kneecap.r\"/><use href=\"#sled-push-m-g0-shank.r\"/><use href=\"#sled-push-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sled-push-m-g0-thigh.r\"/><use href=\"#sled-push-m-g0-kneecap.r\"/><use href=\"#sled-push-m-g0-shank.r\"/><use href=\"#sled-push-m-g0-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#sled-push-m-e-thigh.l\"/><use href=\"#sled-push-m-e-kneecap.l\"/><use href=\"#sled-push-m-e-shank.l\"/><use href=\"#sled-push-m-e-foot.l\"/><use href=\"#sled-push-m-e-shcap.l\"/><use href=\"#sled-push-m-e-upper.l\"/><use href=\"#sled-push-m-e-elbowcap.l\"/><use href=\"#sled-push-m-e-fore.l\"/><use href=\"#sled-push-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#sled-push-m-e-thigh.l\"/><use href=\"#sled-push-m-e-kneecap.l\"/><use href=\"#sled-push-m-e-shank.l\"/><use href=\"#sled-push-m-e-foot.l\"/><use href=\"#sled-push-m-e-shcap.l\"/><use href=\"#sled-push-m-e-upper.l\"/><use href=\"#sled-push-m-e-elbowcap.l\"/><use href=\"#sled-push-m-e-fore.l\"/><use href=\"#sled-push-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-push-m-e-head\"/><use href=\"#sled-push-m-e-torso\"/><use href=\"#sled-push-m-e-thigh.r\"/><use href=\"#sled-push-m-e-kneecap.r\"/><use href=\"#sled-push-m-e-shank.r\"/><use href=\"#sled-push-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sled-push-m-e-head\"/><use href=\"#sled-push-m-e-torso\"/><use href=\"#sled-push-m-e-thigh.r\"/><use href=\"#sled-push-m-e-kneecap.r\"/><use href=\"#sled-push-m-e-shank.r\"/><use href=\"#sled-push-m-e-foot.r\"/></g></g><path class=\"eq\" d=\"^32\"/><path class=\"eq-solid\" d=\"^33\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-push-m-e-shcap.r\"/><use href=\"#sled-push-m-e-upper.r\"/><use href=\"#sled-push-m-e-elbowcap.r\"/><use href=\"#sled-push-m-e-fore.r\"/><use href=\"#sled-push-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sled-push-m-e-shcap.r\"/><use href=\"#sled-push-m-e-upper.r\"/><use href=\"#sled-push-m-e-elbowcap.r\"/><use href=\"#sled-push-m-e-fore.r\"/><use href=\"#sled-push-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"159.53\" cy=\"238.2\" r=\"2.25\"/><circle class=\"joint\" cx=\"200.44\" cy=\"240.4\" r=\"2.25\"/><circle class=\"joint\" cx=\"100\" cy=\"238.2\" r=\"2.25\"/><circle class=\"joint\" cx=\"131.25\" cy=\"282.26\" r=\"2.25\"/></g><mask id=\"sled-push-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#sled-push-m-m-head\" fill=\"#000\"/><use href=\"#sled-push-m-m-torso\" fill=\"#000\"/><use href=\"#sled-push-m-m-thigh.l\" fill=\"#000\"/><use href=\"#sled-push-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#sled-push-m-m-shank.l\" fill=\"#000\"/><use href=\"#sled-push-m-mf-foot.l\" fill=\"#000\"/><use href=\"#sled-push-m-m-shcap.l\" fill=\"#000\"/><use href=\"#sled-push-m-m-upper.l\" fill=\"#000\"/><use href=\"#sled-push-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#sled-push-m-m-fore.l\" fill=\"#000\"/><use href=\"#sled-push-m-mf-fist.l\" fill=\"#000\"/><use href=\"#sled-push-m-m-thigh.r\" fill=\"#000\"/><use href=\"#sled-push-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#sled-push-m-m-shank.r\" fill=\"#000\"/><use href=\"#sled-push-m-m-foot.r\" fill=\"#000\"/><use href=\"#sled-push-m-m-shcap.r\" fill=\"#000\"/><use href=\"#sled-push-m-m-upper.r\" fill=\"#000\"/><use href=\"#sled-push-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#sled-push-m-m-fore.r\" fill=\"#000\"/><use href=\"#sled-push-m-mf-fist.r\" fill=\"#000\"/><use href=\"#sled-push-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-push-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#sled-push-m-mmask)\"><g class=\"u-stroke\"><use href=\"#sled-push-m-m-head\"/><use href=\"#sled-push-m-m-torso\"/><use href=\"#sled-push-m-m-thigh.l\"/><use href=\"#sled-push-m-m-kneecap.l\"/><use href=\"#sled-push-m-m-shank.l\"/><use href=\"#sled-push-m-m-shcap.l\"/><use href=\"#sled-push-m-m-upper.l\"/><use href=\"#sled-push-m-m-elbowcap.l\"/><use href=\"#sled-push-m-m-fore.l\"/><use href=\"#sled-push-m-m-thigh.r\"/><use href=\"#sled-push-m-m-kneecap.r\"/><use href=\"#sled-push-m-m-shank.r\"/><use href=\"#sled-push-m-m-foot.r\"/><use href=\"#sled-push-m-m-shcap.r\"/><use href=\"#sled-push-m-m-upper.r\"/><use href=\"#sled-push-m-m-elbowcap.r\"/><use href=\"#sled-push-m-m-fore.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~M!Un_wJ1CY5gJhP18bC00jA18bC00hD16bC12jy18bC21lF16bC11hF16bC00lA16bC02lw16bC00lD16bC22py189C02jA18bC20nA1J3W4\"/><path class=\"leader m\" d=\"~M!!ryxK1L0-Y5\"/><path class=\"leader m\" d=\"~MNFE1!FV1L0US2\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"sled-push-m-round\" data-key=\"round\" data-cue=\"The back rounds instead of staying flat.\" class=\"plate-callout m\" style=\"left:24.58%;top:46.93%\" aria-pressed=\"true\">Back rounds</button><button type=\"button\" id=\"sled-push-m-line\" data-key=\"line\" data-cue=\"Head to hips is no longer one straight line.\" class=\"plate-callout m\" style=\"left:40.78%;top:76.82%\" aria-pressed=\"false\">Line breaks</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "line",
        cues: [{ key: "line", cue: "Body leans forward in a straight line from head to hips." }, { key: "flat", cue: "Spine neutral, abs tight." }, { key: "balls", cue: "Heels up, push through the balls of your feet." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "round",
        cues: [{ key: "round", cue: "The back rounds instead of staying flat." }, { key: "line", cue: "Head to hips is no longer one straight line." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Back rounds</b><span>The back rounds instead of staying flat.</span></li><li><b>Line breaks</b><span>Head to hips is no longer one straight line.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: walk\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Walk</b><span>&nbsp;</span></div></div></div>",
      alt: "Sled push, side view. Leaning forward in one straight line from head to hips, arms straight, hands halfway down the sled posts. On the balls of the feet, the rear foot drives through to the front.",
      mistakeAlt: "Sled Push: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP (b): the card gives no thumb, hand contact or wrist; its type and width claim (c1) and hand zoom Right (c1, c4) are on setup 2."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "safety",
      "text": "Load the sled. Check the path is flat and clear.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sledpush"
        ],
        "note": "card c17"
      }
    },
    {
      "kind": "grip",
      "text": "Stand behind the sled. Hands about halfway down the handles, arms straight.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sledpush",
          "bb-sledpush",
          "fv-sledpush",
          "ggr-sledpush"
        ],
        "note": "card c1, c4"
      }
    },
    {
      "kind": "position",
      "text": "Step back and lean forward, head to hips in a straight line.",
      "zoom": "back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sledpush",
          "bb-sledpush"
        ],
        "note": "card c3"
      }
    },
    {
      "kind": "position",
      "text": "Keep arms straight the whole push, shoulders behind your hands.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sledpush",
          "bb-sledpush",
          "ggr-sledpush",
          "fv-sledpush"
        ],
        "note": "card c3, c4, c11"
      }
    },
    {
      "kind": "brace",
      "text": "Tighten your abs, spine neutral, eyes just ahead of the sled.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sledpush",
          "ggr-sledpush",
          "fv-sledpush"
        ],
        "note": "card c6"
      }
    }
  ],
  posture: [
    {
      "key": "shoulders",
      "label": "Shoulders behind hands",
      "detail": "Shoulders straight behind your hands.",
      "anchor": {
        "pose": "start",
        "at": "shoulder.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sledpush",
          "bb-sledpush"
        ],
        "note": "card c3"
      }
    },
    {
      "key": "spine",
      "label": "Spine neutral",
      "detail": "Spine neutral, abs tight.",
      "anchor": {
        "pose": "start",
        "at": "backMid"
      },
      "zoom": "back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sledpush",
          "ggr-sledpush",
          "fv-sledpush"
        ],
        "note": "card c6"
      }
    },
    {
      "key": "eyes",
      "label": "Eyes ahead",
      "detail": "Eyes just ahead of the sled.",
      "anchor": {
        "pose": "start",
        "at": "head"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sledpush",
          "ggr-sledpush",
          "fv-sledpush"
        ],
        "note": "card c6"
      }
    },
    {
      "key": "feet",
      "label": "Balls of feet",
      "detail": "Push through the balls of your feet.",
      "anchor": {
        "pose": "start",
        "at": "ball.r"
      },
      "zoom": "feet",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-sledpush",
          "fv-sledpush",
          "bb-sledpush"
        ],
        "note": "card c8"
      }
    },
    {
      "key": "steps",
      "label": "Short steps",
      "detail": "Short, powerful steps, not a jog.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sledpush",
          "fv-sledpush"
        ],
        "note": "card c10"
      }
    },
    {
      "key": "arms",
      "label": "Arms steady",
      "detail": "Keep your arms in the same position.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sledpush"
        ],
        "note": "card c11"
      }
    },
    {
      "key": "hm-round",
      "label": "Rounded back",
      "detail": "Hinge at your hips, head up, shoulders down.",
      "anchor": {
        "pose": "end",
        "at": "backMid"
      },
      "zoom": "back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-sledpush"
        ],
        "note": "card c7"
      }
    },
    {
      "key": "hm-heels",
      "label": "Heels touching floor",
      "detail": "Drive your knees higher and stay on the balls of your feet.",
      "anchor": {
        "pose": "end",
        "at": "heel.r"
      },
      "zoom": "feet",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-sledpush",
          "fv-sledpush",
          "bb-sledpush"
        ],
        "note": "card c8"
      }
    },
    {
      "key": "hm-angle",
      "label": "Body angle drifting",
      "detail": "Hips rising or chest dropping as you tire? Keep the same body angle all push.",
      "anchor": {
        "pose": "end",
        "at": "hips"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sledpush"
        ],
        "note": "card c9"
      }
    }
  ],
  zooms: [
    {
      "key": "back",
      "chip": "Back",
      "heading": "Flat back",
      "kind": "posture"
    },
    {
      "key": "feet",
      "chip": "Feet",
      "heading": "Balls of feet",
      "kind": "posture"
    }
  ],
  chips: [
    "back",
    "feet",
    "feel"
  ],
  copy: {
    "setupLine": "Hands halfway down the handles, arms straight. Lean forward, head to hips in a line.",
    "mistakeLine": "Never push with a rounded back. Hinge at your hips, head up.",
    "cueLine": "Back flat, heels up."
  },
  mistakes: [],
  risks: [
    {
      "key": "round",
      "text": "Pushing with a rounded back is not good for your spine.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-sledpush"
        ],
        "note": "card c7"
      }
    },
    {
      "key": "bent",
      "text": "Bent arms may cause some discomfort in your elbows and shoulders.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-sledpush"
        ],
        "note": "card c5"
      }
    },
    {
      "key": "angle",
      "text": "Hips rising or chest dropping as you tire? Keep the same body angle.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sledpush"
        ],
        "note": "card c9"
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
    "sl-sledpush",
    "bb-sledpush",
    "fv-sledpush",
    "ggr-sledpush",
    "maddigan-2014",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/sled_push.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=20599756f417a4494d59d396f70344c6ef358e414f60dde541891677f2d7fe1a
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_sled_pull",
  name: "Sled Pull",
  hashes: { inputsSha256: "20599756f417a4494d59d396f70344c6ef358e414f60dde541891677f2d7fe1a", golden: "33b7118eb3515741d2fa3a837143749514408ac31f04277c9f4d5e2be2be9d0f" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"sled-pull-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"sled-pull-n-st-thigh.l\" d=\"~#F12WAqJDN1xKpIBK1T6.7piFuWJ1w1K88z4TlBF1x1Om)8.eGjRbGp*B1-3V1.7z3DpYO1uh.3K9Esy5!1!E1(fSqJy1Jk12100000000010000000100010000010000001200000000000000000000000002000011000210000\"/><path id=\"sled-pull-n-st-kneecap.l\" d=\"~~JAw1DBW1SD12\"/><path id=\"sled-pull-n-st-shank.l\" d=\"~#F12Yzw1P*V1XNw1GWU1P3T9y14G6wW1H6V5y3.2_7)Y1P8Ia(1xa.3XcDe-X1T1X3X3T7ReFU1x15gEa-cU7GfWiR3JiA7yn10001001000012000020000210002000000000100000000001000101012000001000000200000001\"/><path id=\"sled-pull-n-st-shcap.l\" d=\"~~yUqFPx1HG12\"/><path id=\"sled-pull-n-st-upper.l\" d=\"~#F12YXqHxy1KJqGDx1R2-663wiYy1eR56X2z8-tF1Gi.5.cRezbxhXpB2T1K4I3DeJA156I3R6XdW3T1_ow8Wh_jAf00000000000210001010101101010000100000000012100100011002000000000201000000100010\"/><path id=\"sled-pull-n-st-elbowcap.l\" d=\"~~!zuSNF1Hu0\"/><path id=\"sled-pull-n-st-fore.l\" d=\"~#F12yIuDAG1V*t)RF1O4x7P1k(pJn*2R77G2.gViE3zcR6)6.bx4OhBiE2dI7G3SlJrgS1V6)4T7U4_4PiDa_aAiA612002000000000001000202000000102000010000020000000210000100002000210100100010000\"/><path id=\"sled-pull-n-st-fist.l\" d=\"~~NRz1SBN1Sr0\"/><path id=\"sled-pull-n-st-head\" d=\"~#w12J*rU!oERqIUoRgSgRgF8T9X2X2A4z4.6*6T9zfGjD4)aK1G8Rg0HjT9HjO5(hW2Pg!dI1Pg0100000100000000000002000200200000101110100000200001000002000000\"/><path id=\"sled-pull-n-st-torso\" d=\"~#_12yUqP)sI!qOXrB8R5-20H8DfD8P5Ab_dN51K5TkIj*6)aD4_dz4!hR5HjXdDfBfA4E8*6-dInEuV9OnO52E81wb_d_2!6xb.6-d(6O5!hS5P5(aV9_2(6TE2Sr10010110100002100020000101000200100000022000012100210000000000000200000020210100002002001210100001000010000000000012\"/><path id=\"sled-pull-n-st-thigh.r\" d=\"^0\"/><path id=\"sled-pull-n-st-kneecap.r\" d=\"^1\"/><path id=\"sled-pull-n-st-shank.r\" d=\"^2\"/><path id=\"sled-pull-n-st-foot.r\" d=\"~#o2yRuYS)1EwvEX(1ybY2Df.6wmTkDK2X2By2z4)w1.6Xk0Xz1A4V9)a_oT9Gjwm000000000000110100101000010110000000000000000002\"/><path id=\"sled-pull-n-st-shcap.r\" d=\"^3\"/><path id=\"sled-pull-n-st-upper.r\" d=\"~#F12!-qJBy1VIq.Ix1G3K663WlJw13O55-2EbRspGiE7BcVfI9-jTnE2K1.4-2DiSy174x4z6EdA5y1!o(9UgJl(c00200010100100002010100002000002000002111021010100000001001110120000110002001210\"/><path id=\"sled-pull-n-st-elbowcap.r\" d=\"~~S.uPxF1Hu0\"/><path id=\"sled-pull-n-st-fore.r\" d=\"~#F12HBvW-F1.VuBGF1G5K6S1gPsHk-3E7dB2zj-gO4TbI7E6BcT2RjBgI23V7R2Uo!omP1B7E4x7P5(6!hHbS9Wiy400000000000001110020020101200000000002000002100000000000020000000202101011101001\"/><path id=\"sled-pull-n-st-fist.r\" d=\"~~N*A1HAK1Sr0\"/><path id=\"sled-pull-n-g0-thigh.r\" d=\"~#F12YUoPEN1O!n)DK1V6V7tiFvyJ1oO86x4Im-E1R1ImE9-eRjxbxqOB1-3R1)7)2FqFO1qh)3K9BsW5W2_E1NgDqYy1_j20020000000000000100020000001200000000000000001100010010000100000001110101002200\"/><path id=\"sled-pull-n-g0-kneecap.r\" d=\"~~N-uWxW1SD12\"/><path id=\"sled-pull-n-g0-shank.r\" d=\"~#F12W_uHTV1EJvRNU1y5)8w1gKf(T1A7K4P3I2UhXW1yaX8W3R9V1EdYnRU1x1*3I2B8GnwR1x1bF2xa.dJ5GiYfX6Nhy3(n20010000020000100020010002001010100100200010020000101010102101000000100000002000\"/><path id=\"sled-pull-n-g0-foot.r\" d=\"~#o2_Kry)(1*!rRz(1wbY2Af.6ymTkDK2X2zy2z4zx1.6Tk0.z1A4T9)a_oT9Gjwm200010100010010100200000012100010000000000000002\"/><path id=\"sled-pull-n-e-thigh.l\" d=\"~#F12SAnAFN1*Im.EK1-6T7rgWv_I1mO86z4*mRE1X1ImI9TeVj.aRqEB1-3O1*7*2UqwO1ujB4G9zs(5D3_E1Ygyq(y1Hj00000020010200000001100010020000200010101110100101000010100002000000000020000000\"/><path id=\"sled-pull-n-e-kneecap.l\" d=\"~~yJtW)V1SD12\"/><path id=\"sled-pull-n-e-shank.l\" d=\"~#F12YHtNyW1BItX-U1sBay13!7WV1W4x7A2R3B7z-1P5zclGaz7EbnT-1R2B3R5I6fFW1z12B2)9GaWa)9wmH1Ui!cPk01000001000000101000000002020000100010000100000000001001110000001010000100020000\"/><path id=\"sled-pull-n-e-foot.l\" d=\"^10\"/><path id=\"sled-pull-n-e-shcap.l\" d=\"~~!SnFPx1HG12\"/><path id=\"sled-pull-n-e-upper.l\" d=\"~#F12SWnHxy1EInGDx1R2-663wiYy1eR56X2z8-tF1Gi.5.cRezbxhXpB2T1K4I3DeJA156I3R6XdW3T1_ow8Wh_jAf00000000000210000000001101010000100000000012100100011002200000000201000000000010\"/><path id=\"sled-pull-n-e-elbowcap.l\" d=\"~~WyrSNF1Hu0\"/><path id=\"sled-pull-n-e-fore.l\" d=\"~#F12!GrDAG1O!q)RF1O4x7P1k(pJn*2R75G2)gViB3zcR6)6.bx4OhBiE2dI7G3SlJrgS1V6)4T7U4_4PiDa_aAiA602002000200000001000000010000102000010002020000000210000100002000210100100010000\"/><path id=\"sled-pull-n-e-fist.l\" d=\"~~FPw1SBN1Sr0\"/><path id=\"sled-pull-n-e-head\" d=\"~#w12D!oU!oxPnIUoRgSgRgF8T9X2X2A4z4.6*6T9zfGjD4)aK1G8Rg0HjT9HjO5(hW2Pg!dI1Pg0100000100000000002002000200200020101110100000200001000002000000\"/><path id=\"sled-pull-n-e-torso\" d=\"~#_12!SnP)sB.nOXrB8R5-20H8DfF8P5wb_dP51K5TkIj*6)aD4_dz4!hR5JjXdyfBfD4E8*6-dInEuV9OnO52E81wb_d_2!6xb.6-d(6O5!hS5P5(aV9_2(6TE2Sr10010110100002100000100101200200100000022000012100011000000000000200000020210100002002001210100001000010000000002012\"/><path id=\"sled-pull-n-e-thigh.r\" d=\"~#F12W)mA)K1GJmO.J1T5R8rePoyP1(1E8sx4OgRH1W1Km)6.f-h-dIk-F1R3z2K7z4yjSS1w1fT2-9XsN1)2!E1PcHsPvSo00100001010011111001001000010000021010200000001110101000012000000000000210000021\"/><path id=\"sled-pull-n-e-kneecap.r\" d=\"~~w(rJYW1SD12\"/><path id=\"sled-pull-n-e-shank.r\" d=\"~#F12U)rAGW1zSs.AV1H5X8y1e.gST1J7E4P3E2(iIW1HaK8(3R9G1Bd!o)T1p)3B2E8RoPP1vfN2*9)dw5ViHfz7FhN2yo00000002001101020000000012000000000002011020000000121010010000020000000020020000\"/><path id=\"sled-pull-n-e-foot.r\" d=\"~#o2UHoYS)1--oEX(1ybY2Af.6AmTkAK2X2By2z4)w1.6Xk0Xz1A4V9)aYoT9Bjwm000000000020011100101000010110000000101000200012\"/><path id=\"sled-pull-n-e-shcap.r\" d=\"^22\"/><path id=\"sled-pull-n-e-upper.r\" d=\"~#F12WYnJBy1OHn.Ix1G3K663WlJw13O55-2EbRspGiE7BcVfI9-jTnE2K1.4-2DiSy174x4z6EdA5y1!o(9UgJl(c00200000100100002000100002000002000002111021010100000001001110120000110002001210\"/><path id=\"sled-pull-n-e-elbowcap.r\" d=\"~~J_rPxF1Hu0\"/><path id=\"sled-pull-n-e-fore.r\" d=\"~#F12AAsW-F1VUrBGF1G5K6S1gPsHk-3E7dB2xj-gT4TbG7E6BcT2RjBgI23T7R2Po!ooP1B7E4x7P5(6!hHbS9Wiy400000000000001110020020101001000000002000002100000100000220000000202101011101001\"/><path id=\"sled-pull-n-e-fist.r\" d=\"~~F!x1HAK1Sr0\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#sled-pull-n-dots)\"/>\n  <path class=\"floorline\" d=\"M44 339.5H356.48\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#sled-pull-n-st-thigh.l\"/><use href=\"#sled-pull-n-st-kneecap.l\"/><use href=\"#sled-pull-n-st-shank.l\"/><use href=\"#sled-pull-n-st-shcap.l\"/><use href=\"#sled-pull-n-st-upper.l\"/><use href=\"#sled-pull-n-st-elbowcap.l\"/><use href=\"#sled-pull-n-st-fore.l\"/><use href=\"#sled-pull-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-n-st-thigh.l\"/><use href=\"#sled-pull-n-st-kneecap.l\"/><use href=\"#sled-pull-n-st-shank.l\"/><use href=\"#sled-pull-n-st-shcap.l\"/><use href=\"#sled-pull-n-st-upper.l\"/><use href=\"#sled-pull-n-st-elbowcap.l\"/><use href=\"#sled-pull-n-st-fore.l\"/><use href=\"#sled-pull-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-pull-n-st-head\"/><use href=\"#sled-pull-n-st-torso\"/><use href=\"#sled-pull-n-st-thigh.r\"/><use href=\"#sled-pull-n-st-kneecap.r\"/><use href=\"#sled-pull-n-st-shank.r\"/><use href=\"#sled-pull-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-n-st-head\"/><use href=\"#sled-pull-n-st-torso\"/><use href=\"#sled-pull-n-st-thigh.r\"/><use href=\"#sled-pull-n-st-kneecap.r\"/><use href=\"#sled-pull-n-st-shank.r\"/><use href=\"#sled-pull-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-pull-n-st-shcap.r\"/><use href=\"#sled-pull-n-st-upper.r\"/><use href=\"#sled-pull-n-st-elbowcap.r\"/><use href=\"#sled-pull-n-st-fore.r\"/><use href=\"#sled-pull-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-n-st-shcap.r\"/><use href=\"#sled-pull-n-st-upper.r\"/><use href=\"#sled-pull-n-st-elbowcap.r\"/><use href=\"#sled-pull-n-st-fore.r\"/><use href=\"#sled-pull-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-pull-n-g0-thigh.r\"/><use href=\"#sled-pull-n-g0-kneecap.r\"/><use href=\"#sled-pull-n-g0-shank.r\"/><use href=\"#sled-pull-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-n-g0-thigh.r\"/><use href=\"#sled-pull-n-g0-kneecap.r\"/><use href=\"#sled-pull-n-g0-shank.r\"/><use href=\"#sled-pull-n-g0-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~M_*J1YDy2LPWi0QYf0XDiXfLXfYfQ0XfXfXfLXDiYfQXf0YDiYfLYfXfQ0YfYfYfZ\"/><path class=\"eq\" d=\"~MWBK1UOw2LYDi0QUn0zOhTnLTnUnQ0TnTnTnLzOhUnQTn0AOhUnLUnTnQ0UnUnUnZ\"/><path class=\"eq-solid\" d=\"~MPRK1FEx2LUn0LTnTnLTnUnZ\"/><path class=\"eq-solid\" d=\"~MwG(1FEx2LUn0LTnTnLTnUnZ\"/><path class=\"eq\" d=\"~MY!W1WJ(1L0zU7Q0VjVjNw7LWjWjQVj0VjWjLWjNw7Q0WjWjKw7LVjVjQWj0WjVjZ\"/><path class=\"eq-solid\" d=\"~M!XP1Jw)1LJyb0LIybEO1LIybFO1Z\"/><path class=\"eq-solid\" d=\"~M!XP1AR*1LJyb0LIybEO1LIybFO1Z\"/><path class=\"eq-solid\" d=\"~MyKN1Jw)1L)(10Lw)1EO1LYfFO1Z\"/><path class=\"eq\" d=\"~#o2J_I1N*!1XXI1GE*1U4W2S2S42F5V2S4R4W2E50R4V2V2R42E5S2R4U4V2000000101000001010000000000101101000001010010100\"/><path class=\"eq-line m-line\" d=\"~MFOO1YDy2LwWj0L)VjOvL)VjPvLwWjPv\"/><path class=\"eq-line m-line\" d=\"~MFOO1UOw2LwWj0L)VjEO1L)VjFO1LwWjFO1\"/><path class=\"eq-line m-line\" d=\"~MWSP1FEx2LUn0LTnTnLTnUnLUnUn\"/><path class=\"eq-line m-line\" d=\"~MDHx2FEx2LUn0LTnTnLTnUnLUnUn\"/><path class=\"eq-line m-line\" d=\"~M(*-1Jw)1L0O.8LIE1P.8LJE1P.8LJE1O.8\"/><path class=\"eq-line m-line\" d=\"~My-T1Jw)1LJyb0LIybEO1LIybFO1LJybFO1\"/><path class=\"eq-line m-line\" d=\"~My-T1AR*1LJyb0LIybEO1LIybFO1LJybFO1\"/><path class=\"eq-line m-line\" d=\"~MFNR1Jw)1L)(10Lw)1EO1LYfFO1LPvFO1\"/><path class=\"eq-line m-line\" d=\"~MS.N1N*!1LU2.9LS4W2LW2S4L1F5LR2S4LT4W2LE50LR4V2LV2R4L0E5LW2R4LS4V2\"/><path class=\"eq-line m-line\" d=\"~MHNO1!D!1L*I9GFfLD-8_TfLW(9!!eLB-8*Tf\"/><path class=\"eq-line m-line\" d=\"~MHSB1P.J1L*I1Fx1LD-1VfLYuXS1LG-1Sf\"/><path class=\"eq-line m-line\" d=\"~MwyA1YBN1LuDX1LY18LY1hLP1vLJ1I1LH1)1LD1K2Lw1*2LuG3Lo.3LqE4LkX4Lmx5LsK5LS1x6Lj*7LXdzfL00L-e!7LkX5LG1V6LbG6L2V5Lcz5LiR4Lm*3LsO3Lw1)2LA1K2LF1)1LJ1K1LP1vLW1dLY15LxayX1L00\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#sled-pull-n-e-thigh.l\"/><use href=\"#sled-pull-n-e-kneecap.l\"/><use href=\"#sled-pull-n-e-shank.l\"/><use href=\"#sled-pull-n-e-foot.l\"/><use href=\"#sled-pull-n-e-shcap.l\"/><use href=\"#sled-pull-n-e-upper.l\"/><use href=\"#sled-pull-n-e-elbowcap.l\"/><use href=\"#sled-pull-n-e-fore.l\"/><use href=\"#sled-pull-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-n-e-thigh.l\"/><use href=\"#sled-pull-n-e-kneecap.l\"/><use href=\"#sled-pull-n-e-shank.l\"/><use href=\"#sled-pull-n-e-foot.l\"/><use href=\"#sled-pull-n-e-shcap.l\"/><use href=\"#sled-pull-n-e-upper.l\"/><use href=\"#sled-pull-n-e-elbowcap.l\"/><use href=\"#sled-pull-n-e-fore.l\"/><use href=\"#sled-pull-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-pull-n-e-head\"/><use href=\"#sled-pull-n-e-torso\"/><use href=\"#sled-pull-n-e-thigh.r\"/><use href=\"#sled-pull-n-e-kneecap.r\"/><use href=\"#sled-pull-n-e-shank.r\"/><use href=\"#sled-pull-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-n-e-head\"/><use href=\"#sled-pull-n-e-torso\"/><use href=\"#sled-pull-n-e-thigh.r\"/><use href=\"#sled-pull-n-e-kneecap.r\"/><use href=\"#sled-pull-n-e-shank.r\"/><use href=\"#sled-pull-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~MAKJ1!D!1L*I9GFfLD-8_TfLW(9!!eZ\"/><path class=\"eq-solid\" d=\"~MDRy1P.J1L)I1Fx1LF-1VfLYuXS1Z\"/><path class=\"eq-solid\" d=\"~#F22_wx1ADN1-(w1R)J1_3W4F3F3w3J2N2N1D2iW19J1G1uB2iB36)33.4d.5fO67K7)1R9)eBg01)g_6T1x8V2I8R1G7rE69z52B4gB3uG2F1E1Y19D2mN2S1(2S2F3W3W3y4x9DD100000000001000200101000010100000001001110002020000012000000100000000010100000000000001111100002000100001000100120000000011100100100021010100000001\"/><path class=\"eq-thin\" d=\"~M(BJ1A..1LGuE7\"/><path class=\"eq-thin\" d=\"~MPXI1Wz.1LGuE7\"/><path class=\"eq-thin\" d=\"~MyGI1DJ_1LGuE7\"/><path class=\"eq-thin\" d=\"~MW_H1WU-1LIuE7\"/><path class=\"eq-thin\" d=\"~MFJH1D*Y1LGuE7\"/><path class=\"eq-thin\" d=\"~M_*G1YBY1LGuE7\"/><path class=\"eq-thin\" d=\"~MJOG1FNX1LGuE7\"/><path class=\"eq-thin\" d=\"~M(wG1YWW1LGuE7\"/><path class=\"eq-thin\" d=\"~MSSF1F)V1LIuE7\"/><path class=\"eq-thin\" d=\"~MAAF1YEV1LIuE7\"/><path class=\"eq-thin\" d=\"~MWVE1HPU1LGuE7\"/><path class=\"eq-thin\" d=\"~MFEE1_YT1LGuE7\"/><path class=\"eq-thin\" d=\"~M_YD1HxT1LGuE7\"/><path class=\"eq-thin\" d=\"~MNHD1_GS1LIuE7\"/><path class=\"eq-thin\" d=\"~Mw!B1JSR1LIuE7\"/><path class=\"eq-thin\" d=\"~MSKB1!_P1LGuE7\"/><path class=\"eq-thin\" d=\"~MA)A1JzP1LGuE7\"/><path class=\"eq-thin\" d=\"~MWPA1!IO1LGuE7\"/><path class=\"eq-thin\" d=\"~MFyA1JUN1LGuE7\"/><path class=\"eq-thin\" d=\"~Myxx1YTN1LPnSk\"/><path class=\"eq-thin\" d=\"~MAzx1(OO1LSoDj\"/><path class=\"eq-thin\" d=\"~MWDx1_IP1LJpAi\"/><path class=\"eq-thin\" d=\"~MHIx1JER1LwqFh\"/><path class=\"eq-thin\" d=\"~M!Px1WyS1LNqSg\"/><path class=\"eq-thin\" d=\"~MDXx1_*S1L_q!f\"/><path class=\"eq-thin\" d=\"~MA(x1YYT1LArHf\"/><path class=\"eq-thin\" d=\"~MUBy1PTU1LNr_e\"/><path class=\"eq-thin\" d=\"~MUKy1yNV1LYrHe\"/><path class=\"eq-thin\" d=\"~MAWy1PFW1Lws_d\"/><path class=\"eq-thin\" d=\"~MA)y1YyX1LDsJd\"/><path class=\"eq-thin\" d=\"~MPFz1!!X1LJs!c\"/><path class=\"eq-thin\" d=\"~MHSz1_WY1LUsNc\"/><path class=\"eq-thin\" d=\"~MS!z1UP-1L_s!b\"/><path class=\"eq-thin\" d=\"~MFEA1FH_1LwtJb\"/><path class=\"eq-thin\" d=\"~MJSA1Uz.1LFt!a\"/><path class=\"eq-thin\" d=\"~My(A1!!.1LNtDa\"/><path class=\"eq-thin\" d=\"~MFHB1!V!1LWtP9\"/><path class=\"eq-thin\" d=\"~MyXB1SN*1L(tW8\"/><path class=\"eq-thin\" d=\"~MUAD1wE(1LFuS7\"/><path class=\"eq-thin\" d=\"~MATD1(((1LSuA6\"/><path class=\"eq-thin\" d=\"~M(yE1JW)1L_u(3\"/><path class=\"eq-thin\" d=\"~MSUE1_Jw2Lwv4\"/><path class=\"eq-solid\" d=\"~MYII1NVx2L)1I3L)34LV38LG3cL.2eLE2kLO1iLpmL0kLqmLP1iLF2kL!2eLH3cLW38Lw44Lw40Lw43LW37LH3bL!2fLF2fLP1jLqlL0jLplLO1jLE2fL.2fLG3bLV37L)33LxoJ3LPkD1LB30L.21LT25LG23LX17LB15Lj7L07Lk7LD15LY17LH23LU25L!21LD30LA31LD32L!24LU24LH24LY18LD16Lk8L08Lj8LB16LX18LG24LT24L.24LB32Z\"/><path class=\"eq-solid\" d=\"~MATJ1NVx2L)1I3L)34LV38LG3cL.2eLE2kLO1iLpmL0kLqmLP1iLF2kL!2eLH3cLW38Lw44Lw40Lw43LW37LH3bL!2fLF2fLP1jLqlL0jLplLO1jLE2fL.2fLG3bLV37L)33LxoJ3LPkD1LB30L.21LT25LG23LX17LB15Lj7L07Lk7LD15LY17LH23LU25L!21LD30LA31LD32L!24LU24LH24LY18LD16Lk8L08Lj8LB16LX18LG24LT24L.24LB32Z\"/><path class=\"eq-solid\" d=\"~MP_K1NVx2L)1I3L)34LV38LG3cL.2eLE2kLO1iLpmL0kLqmLP1iLF2kL!2eLH3cLW38Lw44Lw40Lw43LW37LH3bL!2fLF2fLP1jLqlL0jLplLO1jLE2fL.2fLG3bLV37L)33LxoJ3LPkD1LB30L.21LT25LG23LX17LB15Lj7L07Lk7LD15LY17LH23LU25L!21LD30LA31LD32L!24LU24LH24LY18LD16Lk8L08Lj8LB16LX18LG24LT24L.24LB32Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-pull-n-e-shcap.r\"/><use href=\"#sled-pull-n-e-upper.r\"/><use href=\"#sled-pull-n-e-elbowcap.r\"/><use href=\"#sled-pull-n-e-fore.r\"/><use href=\"#sled-pull-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-n-e-shcap.r\"/><use href=\"#sled-pull-n-e-upper.r\"/><use href=\"#sled-pull-n-e-elbowcap.r\"/><use href=\"#sled-pull-n-e-fore.r\"/><use href=\"#sled-pull-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"127.39\" cy=\"171.56\" r=\"2.25\"/><circle class=\"joint\" cx=\"147.31\" cy=\"205.04\" r=\"2.25\"/><circle class=\"joint\" cx=\"127.39\" cy=\"231.09\" r=\"2.25\"/><circle class=\"joint\" cx=\"149.21\" cy=\"280.38\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#u0A_w1H_x2G(w1z.x221020000000010200U10000001020000101000002000200000000000011000100000100010000000000000200\"/><path class=\"arrow\" d=\"~MHXtA)x2LAx1VpL-pP(1Z\"/></g><path class=\"leader\" d=\"M149.21 280.38L89.99 262H79.99\"/><circle class=\"anchor\" cx=\"149.21\" cy=\"280.38\" r=\"1.5\"/><path class=\"leader\" d=\"M111.52 182.58L109.34 146H99.34\"/><circle class=\"anchor\" cx=\"111.52\" cy=\"182.58\" r=\"1.5\"/><path class=\"leader\" d=\"M123.25 338.98L107.89 310H97.89\"/><circle class=\"anchor\" cx=\"123.25\" cy=\"338.98\" r=\"1.5\"/>\n<g class=\"plate-zoom\" data-view=\"normal\" data-k=\"3\" data-c=\"260 218\" data-src=\"162.06 337.4\"><defs><clipPath id=\"sled-pull-n-zclip\"><circle cx=\"260\" cy=\"218\" r=\"52\"/></clipPath></defs><circle class=\"pz-src\" cx=\"162.06\" cy=\"337.4\" r=\"17.33\"/><path class=\"pz-link\" d=\"~MS-x1wG)1LHRaB.c\"/><circle class=\"pz-bg\" cx=\"260\" cy=\"218\" r=\"52\"/><g class=\"pz-in\" clip-path=\"url(#sled-pull-n-zclip)\">\n  <defs><pattern id=\"sled-pull-n-z-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"sled-pull-n-z-st-thigh.l\" d=\"M175.42 -84.58C177.78 -77.49 183.5 -73.39 186.75 -68.74C190 -64.09 192.28 -60.74 194.94 -56.68C197.59 -52.61 197.67 -52.03 202.68 -44.35C207.69 -36.66 217.48 -21.15 224.99 -10.57C232.5 0.01 240.13 9.58 247.74 19.16C255.35 28.74 264.73 40.88 270.64 46.92C276.54 52.95 279.07 54.34 283.15 55.36C287.24 56.38 291.86 55 295.14 53.03C298.42 51.06 301.81 47.62 302.83 43.53C303.85 39.45 303.81 36.56 301.25 28.52C298.7 20.48 292.38 6.49 287.49 -4.73C282.61 -15.94 277.75 -27.18 271.93 -38.78C266.11 -50.38 257.01 -66.3 252.58 -74.33C248.14 -82.36 247.67 -82.7 245.33 -86.95C242.98 -91.21 241.1 -94.79 238.52 -99.85C235.94 -104.9 235.01 -111.88 229.85 -117.28C224.7 -122.69 214.87 -130.48 207.6 -132.29C200.34 -134.1 192.12 -131.65 186.28 -128.15C180.45 -124.64 174.43 -118.53 172.61 -111.27C170.8 -104.01 173.06 -91.66 175.42 -84.58Z\"/><path id=\"sled-pull-n-z-st-kneecap.l\" d=\"~~JEU1YI7YT30\"/><path id=\"sled-pull-n-z-st-shank.l\" d=\"~#F12PBU1WU6KDV1z)2Na*sA3k.iWx5yj*g(8R8WnBI5Hp.u(5IuXbBD1YH1IE5z5Ibzb.mVI1!!4x3jD1XuED1(m-K1wY1.ayX1JlFB200100010000020200000000000000002000000220000002000101022000000000020000010200200\"/><path id=\"sled-pull-n-z-st-shcap.l\" d=\"M182.79 -279.54a19.84 19.84 0 1 0 39.69 0a19.84 19.84 0 1 0 -39.69 0Z\"/><path id=\"sled-pull-n-z-st-upper.l\" d=\"M184.56 -271.34C185.44 -266.38 188.41 -262.15 190.02 -258.37C191.62 -254.6 192.78 -251.9 194.19 -248.68C195.6 -245.46 195.61 -245.04 198.48 -239.05C201.35 -233.06 207.06 -221.06 211.41 -212.74C215.76 -204.42 220.17 -196.77 224.56 -189.11C228.96 -181.45 234.02 -171.85 237.78 -166.79C241.54 -161.74 243.91 -160 247.12 -158.79C250.33 -157.58 254.2 -158.26 257.04 -159.55C259.88 -160.84 262.95 -163.3 264.16 -166.51C265.37 -169.72 265.61 -172.66 264.29 -178.81C262.96 -184.97 259.08 -195.11 256.21 -203.46C253.35 -211.81 250.5 -220.17 247.1 -228.93C243.7 -237.68 238.45 -249.88 235.83 -255.98C233.22 -262.09 232.9 -262.38 231.41 -265.56C229.92 -268.74 228.66 -271.39 226.87 -275.08C225.09 -278.78 223.86 -283.8 220.71 -287.73C217.56 -291.66 212.35 -297 207.98 -298.65C203.6 -300.29 198.31 -299.37 194.44 -297.61C190.57 -295.85 186.39 -292.49 184.74 -288.11C183.09 -283.73 183.68 -276.3 184.56 -271.34Z\"/><path id=\"sled-pull-n-z-st-elbowcap.l\" d=\"M236.48 -172.8a14.55 14.55 0 1 0 29.11 0a14.55 14.55 0 1 0 -29.11 0Z\"/><path id=\"sled-pull-n-z-st-fore.l\" d=\"M239.91 -162.42C241.65 -158.93 244.57 -156.06 246.35 -153.71C248.13 -151.37 249.07 -150.2 250.61 -148.37C252.15 -146.54 251.86 -146.47 255.59 -142.72C259.32 -138.97 267.43 -130.88 273 -125.87C278.57 -120.85 283.71 -116.86 289.04 -112.63C294.36 -108.4 301 -103.05 304.95 -100.51C308.9 -97.96 310.39 -97.45 312.73 -97.37C315.06 -97.29 317.42 -98.57 318.97 -100.03C320.53 -101.48 321.97 -103.74 322.05 -106.07C322.13 -108.41 321.72 -109.94 319.45 -114.05C317.19 -118.16 312.3 -125.16 308.45 -130.76C304.6 -136.36 300.97 -141.76 296.35 -147.66C291.73 -153.57 284.22 -162.21 280.73 -166.19C277.25 -170.17 277.16 -169.89 275.44 -171.55C273.72 -173.21 272.61 -174.23 270.4 -176.17C268.19 -178.11 265.52 -181.21 262.16 -183.19C258.79 -185.16 253.81 -187.87 250.23 -188C246.65 -188.12 243.04 -186.15 240.65 -183.93C238.27 -181.7 236.06 -178.23 235.93 -174.65C235.81 -171.07 238.18 -165.91 239.91 -162.42Z\"/><path id=\"sled-pull-n-z-st-fist.l\" d=\"M319.79 -84.98a13.23 13.23 0 1 0 26.46 0a13.23 13.23 0 1 0 -26.46 0Z\"/><path id=\"sled-pull-n-z-st-head\" d=\"M202.64 -411.84C208.59 -411.39 218.07 -410.51 223.8 -407.87C229.54 -405.22 233.95 -400.59 237.03 -395.96C240.12 -391.33 241.33 -385.15 242.33 -380.08C243.32 -375.01 242.99 -370.71 242.99 -365.53C242.99 -360.35 242.88 -353.95 242.33 -348.99C241.78 -344.03 241.11 -339.4 239.68 -335.76C238.25 -332.12 236.92 -328.49 233.73 -327.16C230.53 -325.84 224.58 -326.72 220.5 -327.82C216.42 -328.93 213.11 -331.13 209.25 -333.78C205.39 -336.42 202.64 -340.39 197.34 -343.7C192.05 -347.01 182.57 -349.54 177.5 -353.62C172.43 -357.7 168.9 -362.88 166.92 -368.18C164.93 -373.47 164.6 -379.86 165.59 -385.38C166.59 -390.89 169.12 -397.06 172.87 -401.25C176.62 -405.44 183.12 -408.75 188.08 -410.51C193.05 -412.28 196.68 -412.28 202.64 -411.84Z\"/><path id=\"sled-pull-n-z-st-torso\" d=\"M182.79 -348.99C176.18 -345.8 180.81 -335.76 178.82 -329.81C176.84 -323.86 173.75 -318.78 170.88 -313.27C168.02 -307.76 164.05 -303.46 161.62 -296.73C159.2 -290.01 157.43 -281.3 156.33 -272.92C155.23 -264.54 154.57 -256.38 155.01 -246.46C155.45 -236.54 157.21 -224.41 158.98 -213.39C160.74 -202.36 163.83 -189.68 165.59 -180.31C167.36 -170.94 169.78 -164.32 169.56 -157.16C169.34 -149.99 166.92 -144.26 164.27 -137.31C161.62 -130.37 156.11 -122.43 153.69 -115.48C151.26 -108.54 149.61 -101.81 149.72 -95.64C149.83 -89.46 151.26 -83.07 154.35 -78.44C157.43 -73.81 162.4 -70.17 168.24 -67.86C174.08 -65.54 182.02 -64.99 189.41 -64.55C196.79 -64.11 205.39 -63.89 212.56 -65.21C219.73 -66.53 227.66 -67.63 232.4 -72.49C237.15 -77.34 238.91 -85.16 241 -94.32C243.1 -103.47 244.09 -116.37 244.97 -127.39C245.85 -138.42 246.52 -149.44 246.3 -160.47C246.08 -171.49 243.65 -183.62 243.65 -193.54C243.65 -203.46 245.19 -211.73 246.3 -220C247.4 -228.27 249.82 -234.88 250.26 -243.15C250.71 -251.42 250.49 -261.34 248.94 -269.61C247.4 -277.88 244.09 -286.48 241 -292.77C237.92 -299.05 233.51 -302.91 230.42 -307.32C227.33 -311.73 224.25 -314.48 222.48 -319.23C220.72 -323.97 220.5 -330.8 219.84 -335.76C219.17 -340.72 224.69 -346.79 218.51 -348.99C212.34 -351.2 189.41 -352.19 182.79 -348.99Z\"/><path id=\"sled-pull-n-z-st-thigh.r\" d=\"^113\"/><path id=\"sled-pull-n-z-st-kneecap.r\" d=\"^114\"/><path id=\"sled-pull-n-z-st-shank.r\" d=\"^115\"/><path id=\"sled-pull-n-z-st-foot.r\" d=\"~#o2PKO1PUz1)_P1)xx1Ax1D8NK1RkDy2.*1PE7E8KD6IcEz3Tk)*10OI3Jc*s*w1NH2*s*-1wy2002000000000000010000000000000000000001010101000\"/><path id=\"sled-pull-n-z-st-shcap.r\" d=\"^116\"/><path id=\"sled-pull-n-z-st-upper.r\" d=\"M185.58 -269.39C187 -264.57 190.41 -260.7 192.42 -257.14C194.42 -253.57 195.87 -251.03 197.62 -247.99C199.38 -244.95 199.43 -244.53 202.94 -238.91C206.44 -233.29 213.43 -222.03 218.66 -214.26C223.89 -206.49 229.11 -199.4 234.31 -192.29C239.52 -185.19 245.59 -176.23 249.88 -171.63C254.17 -167.03 256.72 -165.55 260.05 -164.71C263.37 -163.86 267.15 -164.97 269.83 -166.56C272.51 -168.16 275.28 -170.95 276.13 -174.27C276.97 -177.59 276.89 -180.54 274.9 -186.51C272.91 -192.47 267.94 -202.09 264.18 -210.05C260.42 -218.02 256.67 -225.99 252.34 -234.3C248.01 -242.6 241.45 -254.11 238.19 -259.88C234.92 -265.64 234.58 -265.89 232.75 -268.88C230.92 -271.87 229.37 -274.36 227.2 -277.82C225.02 -281.29 223.25 -286.13 219.69 -289.68C216.13 -293.23 210.36 -297.97 205.83 -299.12C201.3 -300.27 196.15 -298.77 192.49 -296.59C188.84 -294.42 185.05 -290.61 183.9 -286.08C182.75 -281.55 184.16 -274.22 185.58 -269.39Z\"/><path id=\"sled-pull-n-z-st-elbowcap.r\" d=\"M247.84 -179.07a14.55 14.55 0 1 0 29.11 0a14.55 14.55 0 1 0 -29.11 0Z\"/><path id=\"sled-pull-n-z-st-fore.r\" d=\"M252.52 -167.49C254.65 -164.22 257.89 -161.68 259.94 -159.55C261.98 -157.42 263.05 -156.36 264.79 -154.71C266.54 -153.06 266.26 -152.96 270.4 -149.65C274.55 -146.34 283.55 -139.21 289.68 -134.84C295.81 -130.48 301.38 -127.09 307.17 -123.48C312.95 -119.88 320.18 -115.3 324.4 -113.21C328.62 -111.13 330.16 -110.8 332.49 -110.98C334.82 -111.17 337.01 -112.72 338.39 -114.33C339.77 -115.95 340.95 -118.36 340.76 -120.7C340.57 -123.03 340 -124.49 337.27 -128.32C334.54 -132.16 328.87 -138.57 324.39 -143.71C319.91 -148.85 315.67 -153.81 310.39 -159.16C305.11 -164.52 296.64 -172.27 292.71 -175.84C288.78 -179.41 288.72 -179.11 286.82 -180.57C284.91 -182.03 283.7 -182.92 281.27 -184.6C278.84 -186.28 275.82 -189.07 272.26 -190.65C268.69 -192.23 263.43 -194.36 259.86 -194.07C256.28 -193.79 252.92 -191.42 250.81 -188.94C248.69 -186.45 246.89 -182.76 247.18 -179.18C247.46 -175.61 250.4 -170.76 252.52 -167.49Z\"/><path id=\"sled-pull-n-z-st-fist.r\" d=\"M340.9 -100.93a13.23 13.23 0 1 0 26.46 0a13.23 13.23 0 1 0 -26.46 0Z\"/><path id=\"sled-pull-n-z-g0-thigh.r\" d=\"M152.42 -84.04C154.92 -77 160.72 -73.02 164.06 -68.43C167.41 -63.85 169.75 -60.55 172.49 -56.53C175.22 -52.52 175.31 -51.94 180.47 -44.36C185.63 -36.78 195.72 -21.47 203.44 -11.04C211.16 -0.6 218.98 8.81 226.78 18.24C234.57 27.66 244.19 39.62 250.21 45.53C256.23 51.45 258.79 52.79 262.89 53.73C267 54.66 271.6 53.19 274.84 51.16C278.08 49.12 281.4 45.62 282.34 41.51C283.27 37.41 283.18 34.52 280.46 26.53C277.75 18.54 271.16 4.68 266.05 -6.43C260.94 -17.55 255.86 -28.68 249.81 -40.16C243.77 -51.65 234.36 -67.38 229.77 -75.32C225.18 -83.26 224.7 -83.6 222.27 -87.8C219.84 -92.01 217.89 -95.55 215.21 -100.56C212.53 -105.56 211.46 -112.51 206.2 -117.82C200.94 -123.12 190.96 -130.72 183.66 -132.38C176.36 -134.05 168.19 -131.44 162.42 -127.82C156.66 -124.2 150.76 -117.97 149.09 -110.67C147.43 -103.38 149.93 -91.08 152.42 -84.04Z\"/><path id=\"sled-pull-n-z-g0-kneecap.r\" d=\"~~UDP1Dx7YT30\"/><path id=\"sled-pull-n-z-g0-shank.r\" d=\"~#F12NHP1DW5B)R1xF2HfVqw3A1RN1y!4WlKdHa.6!U1RA5Fu)pAb*s)4TE1(D2R*4)2xcx7KoxD2wT4)2z1S6zuTG1wg.W1HO1zkHU1y9!E200001000001000000000222000000001010001000101010000101000000021200000000121000000\"/><path id=\"sled-pull-n-z-g0-foot.r\" d=\"~#o2_zD1P-x1ERE1xEvwx1F8PK1TkDy2-*1PE7E8KD6IcEz3Rk)*11OI3Jc*s*w1NH2*s*-1yy2010010000020000000000000000000000000000110101200\"/><path id=\"sled-pull-n-z-e-thigh.l\" d=\"M129.29 -83.74C131.87 -76.73 137.71 -72.81 141.11 -68.26C144.5 -63.71 146.88 -60.44 149.66 -56.46C152.44 -52.47 152.54 -51.9 157.79 -44.37C163.03 -36.85 173.29 -21.65 181.13 -11.3C188.96 -0.95 196.89 8.37 204.79 17.71C212.7 27.05 222.45 38.9 228.54 44.75C234.63 50.6 237.2 51.91 241.31 52.8C245.43 53.69 250.01 52.17 253.23 50.1C256.44 48.03 259.73 44.48 260.62 40.37C261.51 36.26 261.38 33.37 258.57 25.41C255.77 17.45 249.02 3.67 243.79 -7.39C238.56 -18.45 233.35 -29.53 227.17 -40.95C221 -52.36 211.41 -67.99 206.73 -75.88C202.05 -83.77 201.57 -84.1 199.09 -88.28C196.62 -92.46 194.62 -95.98 191.89 -100.96C189.15 -105.93 188 -112.87 182.69 -118.12C177.37 -123.36 167.3 -130.85 159.98 -132.43C152.67 -134.02 144.52 -131.31 138.8 -127.63C133.08 -123.94 127.25 -117.65 125.66 -110.33C124.08 -103.02 126.72 -90.75 129.29 -83.74Z\"/><path id=\"sled-pull-n-z-e-kneecap.l\" d=\"~~P(I1F.6YT30\"/><path id=\"sled-pull-n-z-e-shank.l\" d=\"~#F12U_I1Pz7*.I1IG3S2XuD33Ynwx5weGlJ6TaOlII5NgIA1B2*uBl-x1E2XJ5X7T9-gzjI1Wy5B3a-6zu)uAw1Xtwy2!3wY1PD1F*100011000000021210101000002000011010000100002000000000100100010100200000002000000\"/><path id=\"sled-pull-n-z-e-foot.l\" d=\"^123\"/><path id=\"sled-pull-n-z-e-shcap.l\" d=\"M136.14 -279.54a19.84 19.84 0 1 0 39.69 0a19.84 19.84 0 1 0 -39.69 0Z\"/><path id=\"sled-pull-n-z-e-upper.l\" d=\"M137.91 -271.34C138.79 -266.38 141.76 -262.15 143.37 -258.37C144.97 -254.6 146.13 -251.9 147.54 -248.68C148.95 -245.46 148.96 -245.04 151.83 -239.05C154.7 -233.06 160.41 -221.06 164.76 -212.74C169.11 -204.42 173.52 -196.77 177.92 -189.11C182.31 -181.45 187.37 -171.85 191.13 -166.79C194.89 -161.74 197.26 -160 200.47 -158.79C203.68 -157.58 207.56 -158.26 210.4 -159.55C213.24 -160.84 216.3 -163.3 217.51 -166.51C218.72 -169.72 218.96 -172.66 217.64 -178.81C216.32 -184.97 212.43 -195.11 209.56 -203.46C206.7 -211.81 203.85 -220.17 200.45 -228.93C197.06 -237.68 191.8 -249.88 189.18 -255.98C186.57 -262.09 186.26 -262.38 184.76 -265.56C183.27 -268.74 182.01 -271.39 180.22 -275.08C178.44 -278.78 177.21 -283.8 174.06 -287.73C170.91 -291.66 165.71 -297 161.33 -298.65C156.95 -300.29 151.67 -299.37 147.79 -297.61C143.92 -295.85 139.74 -292.49 138.09 -288.11C136.45 -283.73 137.04 -276.3 137.91 -271.34Z\"/><path id=\"sled-pull-n-z-e-elbowcap.l\" d=\"M189.83 -172.8a14.55 14.55 0 1 0 29.11 0a14.55 14.55 0 1 0 -29.11 0Z\"/><path id=\"sled-pull-n-z-e-fore.l\" d=\"M193.26 -162.42C195 -158.93 197.92 -156.06 199.7 -153.71C201.48 -151.37 202.42 -150.2 203.96 -148.37C205.5 -146.54 205.21 -146.47 208.94 -142.72C212.67 -138.97 220.78 -130.88 226.35 -125.87C231.93 -120.85 237.06 -116.86 242.39 -112.63C247.71 -108.4 254.35 -103.05 258.3 -100.51C262.25 -97.96 263.74 -97.45 266.08 -97.37C268.41 -97.29 270.77 -98.57 272.32 -100.03C273.88 -101.48 275.32 -103.74 275.4 -106.07C275.48 -108.41 275.07 -109.94 272.81 -114.05C270.54 -118.16 265.66 -125.16 261.81 -130.76C257.96 -136.36 254.32 -141.76 249.7 -147.66C245.08 -153.57 237.57 -162.21 234.09 -166.19C230.6 -170.17 230.51 -169.89 228.79 -171.55C227.07 -173.21 225.97 -174.23 223.75 -176.17C221.54 -178.11 218.87 -181.21 215.51 -183.19C212.15 -185.16 207.17 -187.87 203.58 -188C200 -188.12 196.39 -186.15 194 -183.93C191.62 -181.7 189.41 -178.23 189.28 -174.65C189.16 -171.07 191.53 -165.91 193.26 -162.42Z\"/><path id=\"sled-pull-n-z-e-fist.l\" d=\"M273.14 -84.98a13.23 13.23 0 1 0 26.46 0a13.23 13.23 0 1 0 -26.46 0Z\"/><path id=\"sled-pull-n-z-e-head\" d=\"M155.99 -411.84C161.94 -411.39 171.42 -410.51 177.16 -407.87C182.89 -405.22 187.3 -400.59 190.39 -395.96C193.47 -391.33 194.69 -385.15 195.68 -380.08C196.67 -375.01 196.34 -370.71 196.34 -365.53C196.34 -360.35 196.23 -353.95 195.68 -348.99C195.13 -344.03 194.47 -339.4 193.03 -335.76C191.6 -332.12 190.28 -328.49 187.08 -327.16C183.88 -325.84 177.93 -326.72 173.85 -327.82C169.77 -328.93 166.46 -331.13 162.6 -333.78C158.74 -336.42 155.99 -340.39 150.7 -343.7C145.4 -347.01 135.92 -349.54 130.85 -353.62C125.78 -357.7 122.25 -362.88 120.27 -368.18C118.28 -373.47 117.95 -379.86 118.94 -385.38C119.94 -390.89 122.47 -397.06 126.22 -401.25C129.97 -405.44 136.47 -408.75 141.44 -410.51C146.4 -412.28 150.03 -412.28 155.99 -411.84Z\"/><path id=\"sled-pull-n-z-e-torso\" d=\"M136.14 -348.99C129.53 -345.8 134.16 -335.76 132.17 -329.81C130.19 -323.86 127.1 -318.78 124.24 -313.27C121.37 -307.76 117.4 -303.46 114.98 -296.73C112.55 -290.01 110.79 -281.3 109.68 -272.92C108.58 -264.54 107.92 -256.38 108.36 -246.46C108.8 -236.54 110.57 -224.41 112.33 -213.39C114.09 -202.36 117.18 -189.68 118.94 -180.31C120.71 -170.94 123.13 -164.32 122.91 -157.16C122.69 -149.99 120.27 -144.26 117.62 -137.31C114.98 -130.37 109.46 -122.43 107.04 -115.48C104.61 -108.54 102.96 -101.81 103.07 -95.64C103.18 -89.46 104.61 -83.07 107.7 -78.44C110.79 -73.81 115.75 -70.17 121.59 -67.86C127.43 -65.54 135.37 -64.99 142.76 -64.55C150.15 -64.11 158.74 -63.89 165.91 -65.21C173.08 -66.53 181.02 -67.63 185.76 -72.49C190.5 -77.34 192.26 -85.16 194.36 -94.32C196.45 -103.47 197.44 -116.37 198.32 -127.39C199.21 -138.42 199.87 -149.44 199.65 -160.47C199.43 -171.49 197 -183.62 197 -193.54C197 -203.46 198.54 -211.73 199.65 -220C200.75 -228.27 203.18 -234.88 203.62 -243.15C204.06 -251.42 203.84 -261.34 202.29 -269.61C200.75 -277.88 197.44 -286.48 194.36 -292.77C191.27 -299.05 186.86 -302.91 183.77 -307.32C180.68 -311.73 177.6 -314.48 175.83 -319.23C174.07 -323.97 173.85 -330.8 173.19 -335.76C172.53 -340.72 178.04 -346.79 171.86 -348.99C165.69 -351.2 142.76 -352.19 136.14 -348.99Z\"/><path id=\"sled-pull-n-z-e-thigh.r\" d=\"M126.95 -88.08C128.41 -80.75 133.58 -75.98 136.23 -70.96C138.88 -65.95 140.73 -62.34 142.86 -57.98C144.99 -53.62 144.99 -53.03 149.01 -44.79C153.03 -36.55 160.81 -19.95 166.95 -8.52C173.09 2.91 179.48 13.35 185.84 23.79C192.2 34.24 200.01 47.45 205.11 54.17C210.22 60.88 212.56 62.58 216.48 64.1C220.41 65.61 225.17 64.82 228.67 63.27C232.17 61.72 235.96 58.73 237.48 54.8C239 50.87 239.32 48.01 237.78 39.71C236.24 31.41 231.71 16.75 228.25 5.02C224.79 -6.71 221.36 -18.46 217.03 -30.69C212.69 -42.92 205.64 -59.84 202.24 -68.35C198.84 -76.87 198.41 -77.27 196.61 -81.78C194.82 -86.29 193.39 -90.07 191.46 -95.41C189.52 -100.74 189.46 -107.78 185.02 -113.78C180.58 -119.79 171.79 -128.74 164.81 -131.43C157.82 -134.13 149.36 -132.72 143.14 -129.96C136.91 -127.21 130.18 -121.89 127.48 -114.91C124.78 -107.93 125.5 -95.4 126.95 -88.08Z\"/><path id=\"sled-pull-n-z-e-kneecap.r\" d=\"~~FUE1JB9YT30\"/><path id=\"sled-pull-n-z-e-shank.r\" d=\"~#F12D-E1SX7TPG1VH4(fIq(2D1GS1!_4(l-cPaV6(Y1Ez5!uEp_bTs)3XE1!H2-.4X2xcO6VoRG2HR4x3G1H7.t)G1wf)X1(K1Kl_T1F7wF200011011000002100020000010000210000020002000100000000010010200000020000000110000\"/><path id=\"sled-pull-n-z-e-foot.r\" d=\"~#o2D_sPUz1VEu)xx1yx1D8SK1Rkyy2.*1SE7E8KD6IcEz3Tk)*10OI3Jc*s*w1NH2*s.-1wy2101000002000100000000000000000000000000000001000\"/><path id=\"sled-pull-n-z-e-shcap.r\" d=\"^135\"/><path id=\"sled-pull-n-z-e-upper.r\" d=\"M138.93 -269.39C140.35 -264.57 143.76 -260.7 145.77 -257.14C147.78 -253.57 149.22 -251.03 150.97 -247.99C152.73 -244.95 152.78 -244.53 156.29 -238.91C159.8 -233.29 166.78 -222.03 172.01 -214.26C177.24 -206.49 182.46 -199.4 187.66 -192.29C192.87 -185.19 198.94 -176.23 203.23 -171.63C207.52 -167.03 210.08 -165.55 213.4 -164.71C216.73 -163.86 220.5 -164.97 223.18 -166.56C225.86 -168.16 228.64 -170.95 229.48 -174.27C230.33 -177.59 230.24 -180.54 228.25 -186.51C226.26 -192.47 221.29 -202.09 217.53 -210.05C213.77 -218.02 210.02 -225.99 205.69 -234.3C201.36 -242.6 194.8 -254.11 191.54 -259.88C188.27 -265.64 187.93 -265.89 186.1 -268.88C184.27 -271.87 182.73 -274.36 180.55 -277.82C178.37 -281.29 176.61 -286.13 173.04 -289.68C169.48 -293.23 163.71 -297.97 159.18 -299.12C154.65 -300.27 149.5 -298.77 145.84 -296.59C142.19 -294.42 138.41 -290.61 137.25 -286.08C136.1 -281.55 137.51 -274.22 138.93 -269.39Z\"/><path id=\"sled-pull-n-z-e-elbowcap.r\" d=\"M201.19 -179.07a14.55 14.55 0 1 0 29.11 0a14.55 14.55 0 1 0 -29.11 0Z\"/><path id=\"sled-pull-n-z-e-fore.r\" d=\"M205.88 -167.49C208 -164.22 211.24 -161.68 213.29 -159.55C215.33 -157.42 216.4 -156.36 218.15 -154.71C219.89 -153.06 219.61 -152.96 223.75 -149.65C227.9 -146.34 236.9 -139.21 243.03 -134.84C249.16 -130.48 254.73 -127.09 260.52 -123.48C266.31 -119.88 273.53 -115.3 277.76 -113.21C281.98 -111.13 283.51 -110.8 285.84 -110.98C288.17 -111.17 290.36 -112.72 291.74 -114.33C293.12 -115.95 294.3 -118.36 294.11 -120.7C293.92 -123.03 293.35 -124.49 290.62 -128.32C287.9 -132.16 282.22 -138.57 277.74 -143.71C273.26 -148.85 269.03 -153.81 263.74 -159.16C258.46 -164.52 249.99 -172.27 246.06 -175.84C242.13 -179.41 242.08 -179.11 240.17 -180.57C238.26 -182.03 237.05 -182.92 234.62 -184.6C232.2 -186.28 229.18 -189.07 225.61 -190.65C222.04 -192.23 216.79 -194.36 213.21 -194.07C209.64 -193.79 206.27 -191.42 204.16 -188.94C202.05 -186.45 200.24 -182.76 200.53 -179.18C200.81 -175.61 203.75 -170.76 205.88 -167.49Z\"/><path id=\"sled-pull-n-z-e-fist.r\" d=\"M294.25 -100.93a13.23 13.23 0 1 0 26.46 0a13.23 13.23 0 1 0 -26.46 0Z\"/></defs>\n  \n  <path class=\"floorline\" d=\"M-94.19 223.3H843.25\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#sled-pull-n-z-st-thigh.l\"/><use href=\"#sled-pull-n-z-st-kneecap.l\"/><use href=\"#sled-pull-n-z-st-shank.l\"/><use href=\"#sled-pull-n-z-st-shcap.l\"/><use href=\"#sled-pull-n-z-st-upper.l\"/><use href=\"#sled-pull-n-z-st-elbowcap.l\"/><use href=\"#sled-pull-n-z-st-fore.l\"/><use href=\"#sled-pull-n-z-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-n-z-st-thigh.l\"/><use href=\"#sled-pull-n-z-st-kneecap.l\"/><use href=\"#sled-pull-n-z-st-shank.l\"/><use href=\"#sled-pull-n-z-st-shcap.l\"/><use href=\"#sled-pull-n-z-st-upper.l\"/><use href=\"#sled-pull-n-z-st-elbowcap.l\"/><use href=\"#sled-pull-n-z-st-fore.l\"/><use href=\"#sled-pull-n-z-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-pull-n-z-st-head\"/><use href=\"#sled-pull-n-z-st-torso\"/><use href=\"#sled-pull-n-z-st-thigh.r\"/><use href=\"#sled-pull-n-z-st-kneecap.r\"/><use href=\"#sled-pull-n-z-st-shank.r\"/><use href=\"#sled-pull-n-z-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-n-z-st-head\"/><use href=\"#sled-pull-n-z-st-torso\"/><use href=\"#sled-pull-n-z-st-thigh.r\"/><use href=\"#sled-pull-n-z-st-kneecap.r\"/><use href=\"#sled-pull-n-z-st-shank.r\"/><use href=\"#sled-pull-n-z-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-pull-n-z-st-shcap.r\"/><use href=\"#sled-pull-n-z-st-upper.r\"/><use href=\"#sled-pull-n-z-st-elbowcap.r\"/><use href=\"#sled-pull-n-z-st-fore.r\"/><use href=\"#sled-pull-n-z-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-n-z-st-shcap.r\"/><use href=\"#sled-pull-n-z-st-upper.r\"/><use href=\"#sled-pull-n-z-st-elbowcap.r\"/><use href=\"#sled-pull-n-z-st-fore.r\"/><use href=\"#sled-pull-n-z-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-pull-n-z-g0-thigh.r\"/><use href=\"#sled-pull-n-z-g0-kneecap.r\"/><use href=\"#sled-pull-n-z-g0-shank.r\"/><use href=\"#sled-pull-n-z-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-n-z-g0-thigh.r\"/><use href=\"#sled-pull-n-z-g0-kneecap.r\"/><use href=\"#sled-pull-n-z-g0-shank.r\"/><use href=\"#sled-pull-n-z-g0-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MS*-2PPI1LwP-10Qwp0)WY1)oL)oOjQ0)o)oPjL)WY1wpQ)o0wXY1wpLwpPjQ0wpwpOjZ\"/><path class=\"eq\" d=\"~MS*-2AID1LwP-10Qwp0)WY1)oL)oXy2Q0)o)oYy2L)WY1wpQ)o0wXY1wpLwpYy2Q0wpwpXy2Z\"/><path class=\"eq-solid\" d=\"~M!N!2wSF1L!D20L.D2.D2L.D2!D2Z\"/><path class=\"eq-solid\" d=\"~MJVN4wSF1L!D20L.D2.D2L.D2!D2Z\"/><path class=\"eq\" d=\"~MUPY3JAx1L0OwpQ0)o)oPEoLzI1wpQ)o0AI1wpLwpPEoQ0wpwpOEoLAI1)oQwp0zI1)oZ\"/><path class=\"eq-solid\" d=\"~MwyD3J*x1LAEx10LzEx1XK4LzEx1YK4Z\"/><path class=\"eq-solid\" d=\"~MwyD3UOtLAEx10LzEx1XK4LzEx1YK4Z\"/><path class=\"eq-solid\" d=\"~MSx)2J*x1L)!50Lw*5XK4LFO1YK4Z\"/><path class=\"eq\" d=\"~#o2PGX2SUrTxX2zSsYd(7(7Yd1Yf.7YdVd(7.f1Vd.7.7Vd1.f(7VdYd.7010100001010100000000101010000000010101000000001\"/><path class=\"eq-line m-line\" d=\"~MyFy3PPI1Lwy.10L)x.1O(2L)x.1P(2Lwy.1P(2\"/><path class=\"eq-line m-line\" d=\"~MyFy3AID1Lwy.10L)x.1XK4L)x.1YK4Lwy.1YK4\"/><path class=\"eq-line m-line\" d=\"~MJSB3wSF1L!D20L.D2.D2L.D2!D2L!D2!D2\"/><path class=\"eq-line m-line\" d=\"~M!YX4wSF1L!D20L.D2.D2L.D2!D2L!D2!D2\"/><path class=\"eq-line m-line\" d=\"~MAUx4J*x1L0OSqLzW3PSqLAW3PSqLAW3OSq\"/><path class=\"eq-line m-line\" d=\"~MPBO3J*x1LAEx10LzEx1XK4LzEx1YK4LAEx1YK4\"/><path class=\"eq-line m-line\" d=\"~MPBO3UOtLAEx10LzEx1XK4LzEx1YK4LAEx1YK4\"/><path class=\"eq-line m-line\" d=\"~MyBF3J*x1L)!50Lw*5XK4LFO1YK4LP(2YK4\"/><path class=\"eq-line m-line\" d=\"~MwKw3SUrL(7RtLWd(7L!7YdL2YfL*7YdLXd(7LXf1LXd.7L*7VdL2.fL!7VdLWd.7\"/><path class=\"eq-line m-line\" d=\"M502.62 130.7L358.64 -103.7L349.62 -98.16L493.6 136.24L502.62 130.7\"/><path class=\"eq-line m-line\" d=\"M350.94 -105.15L329.83 -89.2L336.2 -80.76L357.32 -96.71L350.94 -105.15\"/><path class=\"eq-line m-line\" d=\"M327.72 -84.89L328.17 -58.39L329.48 -31.8L331.59 -5.45L334.44 20.43L337.96 45.6L342.1 69.84L346.8 92.92L351.99 114.6L357.63 134.66L363.66 152.88L370.03 169.04L376.72 182.94L383.73 194.4L391.18 203.23L399.36 209.19L407.26 211.3L408.55 206.16L409.85 201.03L404.04 199.69L398.51 195.6L392.36 188.27L386.03 177.91L379.74 164.82L373.61 149.29L367.76 131.58L362.24 111.94L357.13 90.64L352.51 67.9L348.42 43.98L344.94 19.12L342.13 -6.45L340.05 -32.48L338.75 -58.74L338.31 -85.07L333.02 -84.98L327.72 -84.89\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#sled-pull-n-z-e-thigh.l\"/><use href=\"#sled-pull-n-z-e-kneecap.l\"/><use href=\"#sled-pull-n-z-e-shank.l\"/><use href=\"#sled-pull-n-z-e-foot.l\"/><use href=\"#sled-pull-n-z-e-shcap.l\"/><use href=\"#sled-pull-n-z-e-upper.l\"/><use href=\"#sled-pull-n-z-e-elbowcap.l\"/><use href=\"#sled-pull-n-z-e-fore.l\"/><use href=\"#sled-pull-n-z-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-n-z-e-thigh.l\"/><use href=\"#sled-pull-n-z-e-kneecap.l\"/><use href=\"#sled-pull-n-z-e-shank.l\"/><use href=\"#sled-pull-n-z-e-foot.l\"/><use href=\"#sled-pull-n-z-e-shcap.l\"/><use href=\"#sled-pull-n-z-e-upper.l\"/><use href=\"#sled-pull-n-z-e-elbowcap.l\"/><use href=\"#sled-pull-n-z-e-fore.l\"/><use href=\"#sled-pull-n-z-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-pull-n-z-e-head\"/><use href=\"#sled-pull-n-z-e-torso\"/><use href=\"#sled-pull-n-z-e-thigh.r\"/><use href=\"#sled-pull-n-z-e-kneecap.r\"/><use href=\"#sled-pull-n-z-e-shank.r\"/><use href=\"#sled-pull-n-z-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-n-z-e-head\"/><use href=\"#sled-pull-n-z-e-torso\"/><use href=\"#sled-pull-n-z-e-thigh.r\"/><use href=\"#sled-pull-n-z-e-kneecap.r\"/><use href=\"#sled-pull-n-z-e-shank.r\"/><use href=\"#sled-pull-n-z-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"M455.97 130.7L311.99 -103.7L302.97 -98.16L446.95 136.24Z\"/><path class=\"eq-solid\" d=\"M304.29 -105.15L283.18 -89.2L289.56 -80.76L310.67 -96.71Z\"/><path class=\"eq-solid\" d=\"M281.08 -84.71C280.36 -81.57 281.43 -72.73 282.05 -66.19C282.67 -59.64 283.64 -52.61 284.83 -45.43C286.02 -38.25 287.51 -30.74 289.2 -23.11C290.89 -15.49 292.84 -7.6 294.97 0.34C297.09 8.28 299.45 16.4 301.94 24.5C304.44 32.6 307.13 40.82 309.94 48.93C312.74 57.04 315.71 65.2 318.76 73.19C321.81 81.17 325 89.12 328.23 96.83C331.47 104.53 334.81 112.13 338.16 119.41C341.52 126.68 344.95 133.78 348.36 140.49C351.78 147.19 355.24 153.64 358.67 159.63C362.09 165.61 365.52 171.27 368.9 176.4C372.28 181.53 375.63 186.26 378.93 190.4C382.23 194.54 385.45 198.22 388.69 201.24C391.93 204.27 395.3 206.89 398.36 208.55C401.42 210.22 405.36 211.64 407.05 211.24C408.75 210.84 408.05 207.86 408.55 206.16C409.05 204.47 410.91 202.24 410.05 201.09C409.19 199.93 405.74 200.5 403.39 199.24C401.04 197.98 398.65 196.11 395.95 193.54C393.25 190.97 390.25 187.64 387.21 183.81C384.18 179.99 380.97 175.49 377.74 170.58C374.52 165.68 371.18 160.19 367.85 154.37C364.53 148.56 361.14 142.24 357.79 135.68C354.45 129.11 351.07 122.13 347.77 114.97C344.47 107.82 341.18 100.32 337.99 92.73C334.81 85.14 331.66 77.29 328.65 69.41C325.64 61.53 322.71 53.48 319.94 45.47C317.18 37.47 314.52 29.36 312.06 21.38C309.6 13.41 307.28 5.4 305.19 -2.4C303.1 -10.2 301.18 -17.94 299.53 -25.4C297.88 -32.87 296.43 -40.2 295.27 -47.16C294.11 -54.13 293.19 -60.84 292.59 -67.19C291.98 -73.54 292.69 -82.29 291.65 -85.26C290.61 -88.22 288.13 -85.07 286.37 -84.98C284.6 -84.89 281.8 -87.84 281.08 -84.71Z\"/><path class=\"eq-thin\" d=\"~MDJY2WKoL)_2Xl\"/><path class=\"eq-thin\" d=\"~M!wX2DEmL)_2Xl\"/><path class=\"eq-thin\" d=\"~MUVV2YwkL)_2Xl\"/><path class=\"eq-thin\" d=\"~MHHU2H_hL*_2Xl\"/><path class=\"eq-thin\" d=\"~My)S2_TfL)_2Vl\"/><path class=\"eq-thin\" d=\"~MYTR2JKdL*_2Xl\"/><path class=\"eq-thin\" d=\"~MPFP2(DbL)_2Xl\"/><path class=\"eq-thin\" d=\"~MF*N2Nw9L)_2Vl\"/><path class=\"eq-thin\" d=\"~M(RK2w_6L)_2Xl\"/><path class=\"eq-thin\" d=\"~MWDJ2ST4L)_2Xl\"/><path class=\"eq-thin\" d=\"~MJ.H2yK2L)_2Vl\"/><path class=\"eq-thin\" d=\"M376.34 1.06L361.78 -2.42\"/><path class=\"eq-thin\" d=\"M369.41 -10.21L354.86 -13.69\"/><path class=\"eq-thin\" d=\"M362.49 -21.48L347.93 -24.96\"/><path class=\"eq-thin\" d=\"M355.56 -32.76L341.01 -36.24\"/><path class=\"eq-thin\" d=\"M348.64 -44.03L334.08 -47.51\"/><path class=\"eq-thin\" d=\"M341.72 -55.3L327.16 -58.78\"/><path class=\"eq-thin\" d=\"M334.79 -66.58L320.23 -70.06\"/><path class=\"eq-thin\" d=\"M327.87 -77.85L313.31 -81.33\"/><path class=\"eq-thin\" d=\"M281.22 -78.15L292.48 -68.29\"/><path class=\"eq-thin\" d=\"M282.2 -64.64L293.99 -55.42\"/><path class=\"eq-thin\" d=\"M283.9 -51.27L296.07 -42.55\"/><path class=\"eq-thin\" d=\"M286.14 -38.04L298.59 -29.73\"/><path class=\"eq-thin\" d=\"M288.8 -24.91L301.48 -16.97\"/><path class=\"eq-thin\" d=\"M291.82 -11.89L304.69 -4.26\"/><path class=\"eq-thin\" d=\"~MWU-1N6LPR2wN1\"/><path class=\"eq-thin\" d=\"~MFI_1YW2LHS2JJ1\"/><path class=\"eq-thin\" d=\"~MFz.1PD5LDT2_H1\"/><path class=\"eq-thin\" d=\"~MY!.1YV7L!T2NG1\"/><path class=\"eq-thin\" d=\"~MUX!1SAaLSU2wF1\"/><path class=\"eq-thin\" d=\"~MYT*1_ScLFV2UD1\"/><path class=\"eq-thin\" d=\"~MFR(1WwfL_V2DB1\"/><path class=\"eq-thin\" d=\"~MwP)1yNhLNW2Wz1\"/><path class=\"eq-thin\" d=\"~MyPw2(_jLyX2Ay1\"/><path class=\"eq-thin\" d=\"~MPRx2DEmLYX2Pw1\"/><path class=\"eq-thin\" d=\"~MPUy2!SoLJY2Uu\"/><path class=\"eq-thin\" d=\"~My-z2_*qLA-2Ps\"/><path class=\"eq-thin\" d=\"~MS)A2wFtL!-2(p\"/><path class=\"eq-thin\" d=\"~MHFD2DRvLW_2Wm\"/><path class=\"eq-thin\" d=\"~M_TE2A-x1LU.2Ji\"/><path class=\"eq-thin\" d=\"~MAzG2F)z1LS!2!b\"/><path class=\"eq-thin\" d=\"~MyYH2UyD1Lw*2e\"/><path class=\"eq-solid\" d=\"~MS*V2P!G1Lx6zaL-bcLzboLzaA1LO8N1LV6U1LT4_1LI2w2L2w2LF2w2LW4_1LW6U1LS8N1LyaA1LAboL_bcLAc0L_bbLAbnLyaz1LS8K1LW6T1LW4-1LF2)1L2)1LI2)1LT4-1LV6T1LO8K1Lzaz1LzbnL-bbLEF2AaLN*1W3LI93LX89L)7bLX6hLE5hLT3jL*1pL2jL!1pLS3jLJ5hLW6hLw8bLY89LH93LU90LH94LY8aLw8cLW6iLJ5iLS3kL!1qL2kL*1qLT3kLE5iLX6iL)7cLX8aLI94Z\"/><path class=\"eq-solid\" d=\"~MWT-2P!G1Lx6zaL-bcLzboLzaA1LO8N1LV6U1LT4_1LI2w2L2w2LF2w2LW4_1LW6U1LS8N1LyaA1LAboL_bcLAc0L_bbLAbnLyaz1LS8K1LW6T1LW4-1LF2)1L2)1LI2)1LT4-1LV6T1LO8K1Lzaz1LzbnL-bbLEF2AaLN*1W3LI93LX89L)7bLX6hLE5hLT3jL*1pL2jL!1pLS3jLJ5hLW6hLw8bLY89LH93LU90LH94LY8aLw8cLW6iLJ5iLS3kL!1qL2kL*1qLT3kLE5iLX6iL)7cLX8aLI94Z\"/><path class=\"eq-solid\" d=\"~M_G*2P!G1Lx6zaL-bcLzboLzaA1LO8N1LV6U1LT4_1LI2w2L2w2LF2w2LW4_1LW6U1LS8N1LyaA1LAboL_bcLAc0L_bbLAbnLyaz1LS8K1LW6T1LW4-1LF2)1L2)1LI2)1LT4-1LV6T1LO8K1Lzaz1LzbnL-bbLEF2AaLN*1W3LI93LX89L)7bLX6hLE5hLT3jL*1pL2jL!1pLS3jLJ5hLW6hLw8bLY89LH93LU90LH94LY8aLw8cLW6iLJ5iLS3kL!1qL2kL*1qLT3kLE5iLX6iL)7cLX8aLI94Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-pull-n-z-e-shcap.r\"/><use href=\"#sled-pull-n-z-e-upper.r\"/><use href=\"#sled-pull-n-z-e-elbowcap.r\"/><use href=\"#sled-pull-n-z-e-fore.r\"/><use href=\"#sled-pull-n-z-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-n-z-e-shcap.r\"/><use href=\"#sled-pull-n-z-e-upper.r\"/><use href=\"#sled-pull-n-z-e-elbowcap.r\"/><use href=\"#sled-pull-n-z-e-fore.r\"/><use href=\"#sled-pull-n-z-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"155.99\" cy=\"-279.54\" r=\"2.25\"/><circle class=\"joint\" cx=\"215.74\" cy=\"-179.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"155.99\" cy=\"-100.93\" r=\"2.25\"/><circle class=\"joint\" cx=\"221.44\" cy=\"46.94\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#H20WA_1YzI1zR_1EDI12210211221122001122112201122112210210w511201221122110220112211022112211201000000000000100000000020020000001001000000210000000000000000022000000200000000010000000020000000000000000200200000010010000100002000000000100200000\"/><path class=\"arrow\" d=\"~M(UH1SFI1LAx1VpL-pP(1Z\"/></g>\n</g><circle class=\"pz-ring\" cx=\"260\" cy=\"218\" r=\"52\"/></g></svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"sled-pull-n-squat\" data-key=\"squat\" data-cue=\"Knees soft in a quarter squat, chest up, core braced.\" class=\"plate-callout two\" style=\"left:4.47%;top:67.04%\" aria-pressed=\"true\">Quarter<br>squat</button><button type=\"button\" id=\"sled-pull-n-stack\" data-key=\"stack\" data-cue=\"Keep your shoulders over your hips, not leaning far back.\" class=\"plate-callout two\" style=\"left:5.59%;top:34.64%\" aria-pressed=\"false\">Shoulders<br>over hips</button><button type=\"button\" id=\"sled-pull-n-steps\" data-key=\"steps\" data-cue=\"Short, quick steps back, driving through the midfoot.\" class=\"plate-callout two\" style=\"left:13.97%;top:80.45%\" aria-pressed=\"false\">Short<br>steps<br>back</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"sled-pull-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"sled-pull-m-st-thigh.l\" d=\"^0\"/><path id=\"sled-pull-m-st-kneecap.l\" d=\"^1\"/><path id=\"sled-pull-m-st-shank.l\" d=\"^2\"/><path id=\"sled-pull-m-st-shcap.l\" d=\"^3\"/><path id=\"sled-pull-m-st-upper.l\" d=\"^4\"/><path id=\"sled-pull-m-st-elbowcap.l\" d=\"^5\"/><path id=\"sled-pull-m-st-fore.l\" d=\"^6\"/><path id=\"sled-pull-m-st-fist.l\" d=\"^7\"/><path id=\"sled-pull-m-st-head\" d=\"^8\"/><path id=\"sled-pull-m-st-torso\" d=\"^9\"/><path id=\"sled-pull-m-st-thigh.r\" d=\"^0\"/><path id=\"sled-pull-m-st-kneecap.r\" d=\"^1\"/><path id=\"sled-pull-m-st-shank.r\" d=\"^2\"/><path id=\"sled-pull-m-st-foot.r\" d=\"^10\"/><path id=\"sled-pull-m-st-shcap.r\" d=\"^3\"/><path id=\"sled-pull-m-st-upper.r\" d=\"^11\"/><path id=\"sled-pull-m-st-elbowcap.r\" d=\"^12\"/><path id=\"sled-pull-m-st-fore.r\" d=\"^13\"/><path id=\"sled-pull-m-st-fist.r\" d=\"^14\"/><path id=\"sled-pull-m-g0-thigh.r\" d=\"^15\"/><path id=\"sled-pull-m-g0-kneecap.r\" d=\"^16\"/><path id=\"sled-pull-m-g0-shank.r\" d=\"^17\"/><path id=\"sled-pull-m-g0-foot.r\" d=\"^18\"/><path id=\"sled-pull-m-e-thigh.l\" d=\"^19\"/><path id=\"sled-pull-m-e-kneecap.l\" d=\"^20\"/><path id=\"sled-pull-m-e-shank.l\" d=\"^21\"/><path id=\"sled-pull-m-e-foot.l\" d=\"^10\"/><path id=\"sled-pull-m-e-shcap.l\" d=\"^22\"/><path id=\"sled-pull-m-e-upper.l\" d=\"^23\"/><path id=\"sled-pull-m-e-elbowcap.l\" d=\"^24\"/><path id=\"sled-pull-m-e-fore.l\" d=\"^25\"/><path id=\"sled-pull-m-e-fist.l\" d=\"^26\"/><path id=\"sled-pull-m-e-head\" d=\"^27\"/><path id=\"sled-pull-m-e-torso\" d=\"^28\"/><path id=\"sled-pull-m-e-thigh.r\" d=\"^29\"/><path id=\"sled-pull-m-e-kneecap.r\" d=\"^30\"/><path id=\"sled-pull-m-e-shank.r\" d=\"^31\"/><path id=\"sled-pull-m-e-foot.r\" d=\"^32\"/><path id=\"sled-pull-m-e-shcap.r\" d=\"^22\"/><path id=\"sled-pull-m-e-upper.r\" d=\"^33\"/><path id=\"sled-pull-m-e-elbowcap.r\" d=\"^34\"/><path id=\"sled-pull-m-e-fore.r\" d=\"^35\"/><path id=\"sled-pull-m-e-fist.r\" d=\"^36\"/><path id=\"sled-pull-m-m-head\" d=\"~#w12wDkSTqX_iO)qR7DmGbUe-9Y1nw5V6K4IaV5zmTaz1Xb.4.6-eH7ydzh(eKdHhI5!kA5y6Pf0000001001000200120001002000120011000000021010010100000000000000\"/><path id=\"sled-pull-m-m-torso\" d=\"~#_12F_kJ.uBPk.Tt-9E1O2D1Ae(9_9J1(fS7y6T3)hIf*q!2z9H7HcI7AgX9Hf*hAbKi(1)8)9Vb)t-nzfIkX8B8VoR1!mUqS5y5*cK1K9Fcw3SiH7P2W5KdP5(4GU1DY110000200002001101012000002020001200000111000210200200010100001002100100220100010010000101100102200000002000000010011\"/><path id=\"sled-pull-m-m-thigh.l\" d=\"~#F12SVqYPN1E*pGPK1V6V7tiHvwJ1oI88B4RmXE1R1KmG9VeOjxbEqKB1-3R1*7*2FqAO1uhz4G9zsU5Y2!E1SgAqYy1Yj01210000000002000220010001000000000000000000001000000100001000002100100020000021\"/><path id=\"sled-pull-m-m-kneecap.l\" d=\"~~__w1JHW1SD12\"/><path id=\"sled-pull-m-m-shank.l\" d=\"~#F12__w1wwW1OFx1T-U1F4I9u6.9NV1W6E5A3T2_bKY1y9T9Y2)9x3)c(hTW1I1*3B3.7xiDT1x17A1EaEd_6OgSh.4yiS5Pn12022011000022001110000100101000010100001000012100000002000000000000000010000200\"/><path id=\"sled-pull-m-m-foot.l\" d=\"~#o2yRuYS)1EwvEX(1ybY2Df.6wmTkDK2X2By2z4)w1.6Xk0Xz1A4V9)a_oT9Gjwm000000000000110100101000010110010000000000000002\"/><path id=\"sled-pull-m-m-shcap.l\" d=\"~~PVmFIy1HG12\"/><path id=\"sled-pull-m-m-upper.l\" d=\"~#F12Y-mS*y1OKm.yy1.2-681AjAy18R54X2z9TtiEiB6Xc*eTa)hBpB2T1R4B3Nf(z176T3K6Ody4r(oU8JhFkPe02200002001000000000010110100000200010100000000000110000101001210100000200020000\"/><path id=\"sled-pull-m-m-elbowcap.l\" d=\"~~WJqNDG1Hu0\"/><path id=\"sled-pull-m-m-fore.l\" d=\"~#F12!Wq!(G1EEqTNG1K5I6U1eUsYjX3x7jG2zjEgX4TbK7z6EcO2VjVfI23T7I2_oJooN1G7x4)6P5F7YhNbN9_iY310000120000000200001010020000100000110101000100000000101011111012000002000000010\"/><path id=\"sled-pull-m-m-thigh.r\" d=\"~#F12DKqW!K1VwqxWJ1.3R9x1aNfWT1N3X7P1-3K8-J1_5Xlx4*g*e-gTc-I1z3X2R6I5S9AV1y17pBaOs-3GaWD1F7yuPq!t00110100000101000000001012001011011111000000010000010001000101000010120121000212\"/><path id=\"sled-pull-m-m-kneecap.r\" d=\"~~_UtyVX1SD12\"/><path id=\"sled-pull-m-m-shank.r\" d=\"~#F12!-tH)W1VSu)(V1!6V7sk*pWO1w8.2!3R1Ps)R1YbO6S5T8A1Ed(x1RN11z4lO8*w1DI1rhA4I9TeH2zlWbEaWf*1yo00000000000000000020000000012010100200000000200000020000000000012020000000000000\"/><path id=\"sled-pull-m-m-foot.r\" d=\"~#o2UHoYS)1--oEX(1ybY2Af.6AmTkAK2X2By2z4)w1.6Xk0Xz1A4V9)aYoT9Bjwm000000000020011100101000010110010000101000200012\"/><path id=\"sled-pull-m-m-shcap.r\" d=\"^228\"/><path id=\"sled-pull-m-m-upper.r\" d=\"~#F12A*mDzz1*Jm*Hy1.3z685DoPujO5bX2OdOrE2BiB8RbKgz8Rl.lI2B1x5K2_k(w156O4X5.cw6y3_oFbYfJmAb02020000200010100000100010000000000000010002000000000002202000100110000020020000\"/><path id=\"sled-pull-m-m-elbowcap.r\" d=\"~~DKrSRF1Hu0\"/><path id=\"sled-pull-m-m-fore.r\" d=\"~#F12w-rFIG1BFr).F1.5)5U1ayu(hG4.6lE2KkzfO5Bb.7V5IcT1.kOeI20-7.1SqYmqN1R7R3O6w6J8FhAcU8!iN200000000001000010000000200000011011000000000000000101010101200010000002100100120\"/><path id=\"sled-pull-m-mf-fist.l\" d=\"^26\"/><path id=\"sled-pull-m-mf-fist.r\" d=\"^36\"/><path id=\"sled-pull-m-mo-0\" d=\"^27\"/><path id=\"sled-pull-m-mo-1\" d=\"^28\"/><path id=\"sled-pull-m-mo-2\" d=\"^19\"/><path id=\"sled-pull-m-mo-3\" d=\"^20\"/><path id=\"sled-pull-m-mo-4\" d=\"^21\"/><path id=\"sled-pull-m-mo-5\" d=\"^10\"/><path id=\"sled-pull-m-mo-6\" d=\"^22\"/><path id=\"sled-pull-m-mo-7\" d=\"^23\"/><path id=\"sled-pull-m-mo-8\" d=\"^24\"/><path id=\"sled-pull-m-mo-9\" d=\"^25\"/><path id=\"sled-pull-m-mo-10\" d=\"^26\"/><path id=\"sled-pull-m-mo-11\" d=\"^29\"/><path id=\"sled-pull-m-mo-12\" d=\"^30\"/><path id=\"sled-pull-m-mo-13\" d=\"^31\"/><path id=\"sled-pull-m-mo-14\" d=\"^32\"/><path id=\"sled-pull-m-mo-15\" d=\"^22\"/><path id=\"sled-pull-m-mo-16\" d=\"^33\"/><path id=\"sled-pull-m-mo-17\" d=\"^34\"/><path id=\"sled-pull-m-mo-18\" d=\"^35\"/><path id=\"sled-pull-m-mo-19\" d=\"^36\"/><path id=\"sled-pull-m-mo-20\" d=\"^38\"/><path id=\"sled-pull-m-mo-21\" d=\"^39\"/><path id=\"sled-pull-m-mo-22\" d=\"^40\"/><path id=\"sled-pull-m-mo-23\" d=\"^41\"/><path id=\"sled-pull-m-mo-24\" d=\"^42\"/><path id=\"sled-pull-m-mo-25\" d=\"^43\"/><path id=\"sled-pull-m-mo-26\" d=\"^44\"/><path id=\"sled-pull-m-mo-27\" d=\"^45\"/><path id=\"sled-pull-m-mo-28\" d=\"^46\"/><path id=\"sled-pull-m-mo-29\" d=\"^59\"/><path id=\"sled-pull-m-mo-30\" d=\"^60\"/><path id=\"sled-pull-m-mo-31\" d=\"^61\"/><path id=\"sled-pull-m-mo-32\" d=\"^104\"/><path id=\"sled-pull-m-mo-33\" d=\"^105\"/><path id=\"sled-pull-m-mo-34\" d=\"^106\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#sled-pull-m-dots)\"/>\n  <path class=\"floorline\" d=\"^37\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#sled-pull-m-st-thigh.l\"/><use href=\"#sled-pull-m-st-kneecap.l\"/><use href=\"#sled-pull-m-st-shank.l\"/><use href=\"#sled-pull-m-st-shcap.l\"/><use href=\"#sled-pull-m-st-upper.l\"/><use href=\"#sled-pull-m-st-elbowcap.l\"/><use href=\"#sled-pull-m-st-fore.l\"/><use href=\"#sled-pull-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-m-st-thigh.l\"/><use href=\"#sled-pull-m-st-kneecap.l\"/><use href=\"#sled-pull-m-st-shank.l\"/><use href=\"#sled-pull-m-st-shcap.l\"/><use href=\"#sled-pull-m-st-upper.l\"/><use href=\"#sled-pull-m-st-elbowcap.l\"/><use href=\"#sled-pull-m-st-fore.l\"/><use href=\"#sled-pull-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-pull-m-st-head\"/><use href=\"#sled-pull-m-st-torso\"/><use href=\"#sled-pull-m-st-thigh.r\"/><use href=\"#sled-pull-m-st-kneecap.r\"/><use href=\"#sled-pull-m-st-shank.r\"/><use href=\"#sled-pull-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-m-st-head\"/><use href=\"#sled-pull-m-st-torso\"/><use href=\"#sled-pull-m-st-thigh.r\"/><use href=\"#sled-pull-m-st-kneecap.r\"/><use href=\"#sled-pull-m-st-shank.r\"/><use href=\"#sled-pull-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-pull-m-st-shcap.r\"/><use href=\"#sled-pull-m-st-upper.r\"/><use href=\"#sled-pull-m-st-elbowcap.r\"/><use href=\"#sled-pull-m-st-fore.r\"/><use href=\"#sled-pull-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-m-st-shcap.r\"/><use href=\"#sled-pull-m-st-upper.r\"/><use href=\"#sled-pull-m-st-elbowcap.r\"/><use href=\"#sled-pull-m-st-fore.r\"/><use href=\"#sled-pull-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-pull-m-g0-thigh.r\"/><use href=\"#sled-pull-m-g0-kneecap.r\"/><use href=\"#sled-pull-m-g0-shank.r\"/><use href=\"#sled-pull-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-m-g0-thigh.r\"/><use href=\"#sled-pull-m-g0-kneecap.r\"/><use href=\"#sled-pull-m-g0-shank.r\"/><use href=\"#sled-pull-m-g0-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^38\"/><path class=\"eq\" d=\"^39\"/><path class=\"eq-solid\" d=\"^40\"/><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq\" d=\"^42\"/><path class=\"eq-solid\" d=\"^43\"/><path class=\"eq-solid\" d=\"^44\"/><path class=\"eq-solid\" d=\"^45\"/><path class=\"eq\" d=\"^46\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#sled-pull-m-e-thigh.l\"/><use href=\"#sled-pull-m-e-kneecap.l\"/><use href=\"#sled-pull-m-e-shank.l\"/><use href=\"#sled-pull-m-e-foot.l\"/><use href=\"#sled-pull-m-e-shcap.l\"/><use href=\"#sled-pull-m-e-upper.l\"/><use href=\"#sled-pull-m-e-elbowcap.l\"/><use href=\"#sled-pull-m-e-fore.l\"/><use href=\"#sled-pull-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-m-e-thigh.l\"/><use href=\"#sled-pull-m-e-kneecap.l\"/><use href=\"#sled-pull-m-e-shank.l\"/><use href=\"#sled-pull-m-e-foot.l\"/><use href=\"#sled-pull-m-e-shcap.l\"/><use href=\"#sled-pull-m-e-upper.l\"/><use href=\"#sled-pull-m-e-elbowcap.l\"/><use href=\"#sled-pull-m-e-fore.l\"/><use href=\"#sled-pull-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-pull-m-e-head\"/><use href=\"#sled-pull-m-e-torso\"/><use href=\"#sled-pull-m-e-thigh.r\"/><use href=\"#sled-pull-m-e-kneecap.r\"/><use href=\"#sled-pull-m-e-shank.r\"/><use href=\"#sled-pull-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-m-e-head\"/><use href=\"#sled-pull-m-e-torso\"/><use href=\"#sled-pull-m-e-thigh.r\"/><use href=\"#sled-pull-m-e-kneecap.r\"/><use href=\"#sled-pull-m-e-shank.r\"/><use href=\"#sled-pull-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^59\"/><path class=\"eq-solid\" d=\"^60\"/><path class=\"eq-solid\" d=\"^61\"/><path class=\"eq-thin\" d=\"^62\"/><path class=\"eq-thin\" d=\"^63\"/><path class=\"eq-thin\" d=\"^64\"/><path class=\"eq-thin\" d=\"^65\"/><path class=\"eq-thin\" d=\"^66\"/><path class=\"eq-thin\" d=\"^67\"/><path class=\"eq-thin\" d=\"^68\"/><path class=\"eq-thin\" d=\"^69\"/><path class=\"eq-thin\" d=\"^70\"/><path class=\"eq-thin\" d=\"^71\"/><path class=\"eq-thin\" d=\"^72\"/><path class=\"eq-thin\" d=\"^73\"/><path class=\"eq-thin\" d=\"^74\"/><path class=\"eq-thin\" d=\"^75\"/><path class=\"eq-thin\" d=\"^76\"/><path class=\"eq-thin\" d=\"^77\"/><path class=\"eq-thin\" d=\"^78\"/><path class=\"eq-thin\" d=\"^79\"/><path class=\"eq-thin\" d=\"^80\"/><path class=\"eq-thin\" d=\"^81\"/><path class=\"eq-thin\" d=\"^82\"/><path class=\"eq-thin\" d=\"^83\"/><path class=\"eq-thin\" d=\"^84\"/><path class=\"eq-thin\" d=\"^85\"/><path class=\"eq-thin\" d=\"^86\"/><path class=\"eq-thin\" d=\"^87\"/><path class=\"eq-thin\" d=\"^88\"/><path class=\"eq-thin\" d=\"^89\"/><path class=\"eq-thin\" d=\"^90\"/><path class=\"eq-thin\" d=\"^91\"/><path class=\"eq-thin\" d=\"^92\"/><path class=\"eq-thin\" d=\"^93\"/><path class=\"eq-thin\" d=\"^94\"/><path class=\"eq-thin\" d=\"^95\"/><path class=\"eq-thin\" d=\"^96\"/><path class=\"eq-thin\" d=\"^97\"/><path class=\"eq-thin\" d=\"^98\"/><path class=\"eq-thin\" d=\"^99\"/><path class=\"eq-thin\" d=\"^100\"/><path class=\"eq-thin\" d=\"^101\"/><path class=\"eq-thin\" d=\"^102\"/><path class=\"eq-thin\" d=\"^103\"/><path class=\"eq-solid\" d=\"^104\"/><path class=\"eq-solid\" d=\"^105\"/><path class=\"eq-solid\" d=\"^106\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#sled-pull-m-e-shcap.r\"/><use href=\"#sled-pull-m-e-upper.r\"/><use href=\"#sled-pull-m-e-elbowcap.r\"/><use href=\"#sled-pull-m-e-fore.r\"/><use href=\"#sled-pull-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sled-pull-m-e-shcap.r\"/><use href=\"#sled-pull-m-e-upper.r\"/><use href=\"#sled-pull-m-e-elbowcap.r\"/><use href=\"#sled-pull-m-e-fore.r\"/><use href=\"#sled-pull-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"127.39\" cy=\"171.56\" r=\"2.25\"/><circle class=\"joint\" cx=\"147.31\" cy=\"205.04\" r=\"2.25\"/><circle class=\"joint\" cx=\"127.39\" cy=\"231.09\" r=\"2.25\"/><circle class=\"joint\" cx=\"149.21\" cy=\"280.38\" r=\"2.25\"/></g><mask id=\"sled-pull-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#sled-pull-m-m-head\" fill=\"#000\"/><use href=\"#sled-pull-m-m-torso\" fill=\"#000\"/><use href=\"#sled-pull-m-m-thigh.l\" fill=\"#000\"/><use href=\"#sled-pull-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#sled-pull-m-m-shank.l\" fill=\"#000\"/><use href=\"#sled-pull-m-m-foot.l\" fill=\"#000\"/><use href=\"#sled-pull-m-m-shcap.l\" fill=\"#000\"/><use href=\"#sled-pull-m-m-upper.l\" fill=\"#000\"/><use href=\"#sled-pull-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#sled-pull-m-m-fore.l\" fill=\"#000\"/><use href=\"#sled-pull-m-mf-fist.l\" fill=\"#000\"/><use href=\"#sled-pull-m-m-thigh.r\" fill=\"#000\"/><use href=\"#sled-pull-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#sled-pull-m-m-shank.r\" fill=\"#000\"/><use href=\"#sled-pull-m-m-foot.r\" fill=\"#000\"/><use href=\"#sled-pull-m-m-shcap.r\" fill=\"#000\"/><use href=\"#sled-pull-m-m-upper.r\" fill=\"#000\"/><use href=\"#sled-pull-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#sled-pull-m-m-fore.r\" fill=\"#000\"/><use href=\"#sled-pull-m-mf-fist.r\" fill=\"#000\"/><use href=\"#sled-pull-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sled-pull-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#sled-pull-m-mmask)\"><g class=\"u-stroke\"><use href=\"#sled-pull-m-m-head\"/><use href=\"#sled-pull-m-m-torso\"/><use href=\"#sled-pull-m-m-thigh.l\"/><use href=\"#sled-pull-m-m-kneecap.l\"/><use href=\"#sled-pull-m-m-shank.l\"/><use href=\"#sled-pull-m-m-foot.l\"/><use href=\"#sled-pull-m-m-shcap.l\"/><use href=\"#sled-pull-m-m-upper.l\"/><use href=\"#sled-pull-m-m-elbowcap.l\"/><use href=\"#sled-pull-m-m-fore.l\"/><use href=\"#sled-pull-m-m-thigh.r\"/><use href=\"#sled-pull-m-m-kneecap.r\"/><use href=\"#sled-pull-m-m-shank.r\"/><use href=\"#sled-pull-m-m-foot.r\"/><use href=\"#sled-pull-m-m-shcap.r\"/><use href=\"#sled-pull-m-m-upper.r\"/><use href=\"#sled-pull-m-m-elbowcap.r\"/><use href=\"#sled-pull-m-m-fore.r\"/></g></g><g class=\"mistake-layer\"><path class=\"leader m\" d=\"M108.26 180.75L77.27 230H67.27\"/><path class=\"leader m\" d=\"M107.41 166.92L97.34 158H87.34\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"sled-pull-m-lean\" data-key=\"lean\" data-cue=\"The torso pitches back and the lower back takes the load.\" class=\"plate-callout two m\" style=\"left:2.23%;top:58.1%\" aria-pressed=\"true\">Torso<br>pitched<br>back</button><button type=\"button\" id=\"sled-pull-m-stack\" data-key=\"stack\" data-cue=\"The shoulders are no longer over the hips, leaning too far back.\" class=\"plate-callout two m\" style=\"left:2.23%;top:37.99%\" aria-pressed=\"false\">Shoulders<br>behind<br>hips</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "squat",
        cues: [{ key: "squat", cue: "Knees soft in a quarter squat, chest up, core braced." }, { key: "stack", cue: "Keep your shoulders over your hips, not leaning far back." }, { key: "steps", cue: "Short, quick steps back, driving through the midfoot." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "lean",
        cues: [{ key: "lean", cue: "The torso pitches back and the lower back takes the load." }, { key: "stack", cue: "The shoulders are no longer over the hips, leaning too far back." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Torso pitched back</b><span>The torso pitches back and the lower back takes the load.</span></li><li><b>Shoulders behind hips</b><span>The shoulders are no longer over the hips, leaning too far back.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: walk quick\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Walk</b><span>Quick</span></div></div></div>",
      alt: "Sled pull, side view. Facing the sled in a quarter squat, shoulders over the hips, both hands one behind the other on the rope from the sled. One foot steps straight back and the sled follows by the same distance. A short coil of rope lies at the feet.",
      mistakeAlt: "Sled Pull: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "pull",
    "why": "D-SHIP-C3 no-zoom list (gap-key hand-implement.mjs:7): the rope-grip zoom has no Wrong; the grip copy carries c1 and c4.",
    "handle": "rope",
    "width": {
      "text": "Hands together on the rope, one over the other.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c1"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "pull-default"
        ],
        "note": "card grip.thumb is empty: golden B's pull default, not a card claim, never shown"
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        25
      ],
      "limitText": "Keep your wrists firm and your elbows tucked.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c4. The ext range is pairs.mjs CONVENTIONS ga:pull-base, a convention, not a card number."
      }
    },
    "faults": [],
    "gripLine": "Both hands on the rope, one over the other.",
    "cue": "Shoulders over hips."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "grip",
      "text": "Face the sled, rope in both hands, one hand over the other.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "position",
      "text": "Step back for light tension in the rope. Chin level, eyes forward.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c1, c6"
      }
    },
    {
      "kind": "brace",
      "text": "Feet shoulder-width, sink into a quarter squat, chest up, trunk braced.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c2"
      }
    },
    {
      "kind": "position",
      "text": "Step back one foot at a time, short and quick.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c3"
      }
    },
    {
      "kind": "position",
      "text": "Feed the rope through your hands. Flick the piled rope aside.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c4, c5"
      }
    }
  ],
  posture: [
    {
      "key": "stack",
      "label": "Shoulders over hips",
      "detail": "Shoulders over hips, not leaning far back.",
      "anchor": {
        "pose": "end",
        "at": "shoulder.r"
      },
      "zoom": "torso-stack",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c2"
      }
    },
    {
      "key": "squat",
      "label": "Quarter squat",
      "detail": "Knees soft, quarter squat.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c2"
      }
    },
    {
      "key": "head",
      "label": "Head level",
      "detail": "Chin level, eyes forward.",
      "anchor": {
        "pose": "end",
        "at": "head"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c6"
      }
    },
    {
      "key": "elbows",
      "label": "Elbows tucked",
      "detail": "Elbows tucked, wrists firm.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c4"
      }
    }
  ],
  zooms: [
    {
      "key": "torso-stack",
      "chip": "Torso",
      "heading": "Torso stack",
      "kind": "posture"
    }
  ],
  chips: [
    "torso-stack",
    "feel"
  ],
  copy: {
    "setupLine": "Face the sled, rope in both hands. Quarter squat, chest up, shoulders over hips.",
    "mistakeLine": "Don't lean back so your lower back takes the load. Stay braced.",
    "cueLine": "Shoulders over hips."
  },
  mistakes: [
    {
      "key": "lean",
      "title": "Leaning back",
      "zoom": "torso-stack",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c8, c2, c9"
      },
      "fix": "Keep your torso braced, shoulders over hips. Go lighter."
    },
    {
      "key": "yank",
      "title": "Yanking with the arms",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c6: the fault and its fix (lead with the legs)"
      },
      "fix": "Lead with your legs."
    },
    {
      "key": "pile",
      "title": "Rope piled at your feet",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c5"
      },
      "fix": "Flick or step it aside between steps."
    }
  ],
  risks: [
    {
      "key": "lean",
      "text": "Leaning back puts the load on your lower back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c8"
      }
    },
    {
      "key": "slack",
      "text": "Slack rope at your feet can trip you.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c5, c9"
      }
    },
    {
      "key": "round",
      "text": "A rounded back can strain your lower spine.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "gs-sled"
        ],
        "note": "card c11"
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
    "gs-sled",
    "west-2014",
    "ga-pull-base",
    "pull-default",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/sled_pull.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

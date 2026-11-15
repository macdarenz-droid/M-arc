// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=e595ee2d3ffdae80eb4dda1a69d0e45110e28d2edd7cf052d4cd8b1004cc21b9
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_single_arm_triceps_pushdown",
  name: "Single-Arm Triceps Pushdown",
  hashes: { inputsSha256: "e595ee2d3ffdae80eb4dda1a69d0e45110e28d2edd7cf052d4cd8b1004cc21b9", golden: "0d169fd7fa5343a405a67a23f461135c46b9c61616022029ae18fb6f277c63cb" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"single-arm-triceps-pushdown-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"single-arm-triceps-pushdown-n-st-fore.r\" d=\"~#F12YUsS*D1Vxs*NE1K7w6kX1!n-vx8F4O2iGkHmIcU4.6W7)2(cVj_m9S2B3S8UsVrY1nz5y8!6H6wjz7PaXbU4Xj21001000100000000101010100000200100000010111000000000100020010001000110022000201\"/><path id=\"single-arm-triceps-pushdown-n-st-fist.r\" d=\"~~!.w1wRvFt2\"/><path id=\"single-arm-triceps-pushdown-n-g0-fore.r\" d=\"~#F12!AsUEE1OIrxJE1O9y1P1z1FB1)dx9pO2nxt!7*c-2.9!2R9D9-s_8T1(1G7P5wE1*7!18T8y4N2w9!jH4yfI4UeBe10010020000000002000000001010100001010022001010000000020022000022020000010010100\"/><path id=\"single-arm-triceps-pushdown-n-g0-fist.r\" d=\"~~FRz1FYz1Ft2\"/><path id=\"single-arm-triceps-pushdown-n-g1-fore.r\" d=\"~#F12ASrSEE1G_qX*D1T8z4!15wE1A8E7O5V1x2Xs.8O9E9-9*2)cY2xtz8I2sB9mFB1FeJ1A1I9B1-2(8NeFeDfJ4!jz410100000000000200000012000001200011000000002201010000010010101101010100001000011\"/><path id=\"single-arm-triceps-pushdown-n-g1-fist.r\" d=\"~~_Pz1YXF1Ft2\"/><path id=\"single-arm-triceps-pushdown-n-g2-fore.r\" d=\"~#F12HyrP*D1OTqOFD1)4)7W1oSsYrB3R87R2Vj*m*2.cX6X7OcT4zkGmR2lx8G4Ynww1mW1I7*5z7(5U4_jJa_byjA701020021000002002000000010000220001002002001101010120000000002000010001100000100\"/><path id=\"single-arm-triceps-pushdown-n-g2-fist.r\" d=\"~~A.w1A(J1Ft2\"/><path id=\"single-arm-triceps-pushdown-n-e-thigh.l\" d=\"~#F12(*o_BH1VWoE.F1T2Raz12D8_Y1!4R7A2-3*1TP1J9*lT1Iizd*jT6EP1-2E3x6X6!1N-1D11m*aItB8VgyE1(2Uw1FnPz102001000111111002001010001010000000010000002000000000200000000001000020100000200\"/><path id=\"single-arm-triceps-pushdown-n-e-kneecap.l\" d=\"~~W_qUAV1wG11\"/><path id=\"single-arm-triceps-pushdown-n-e-shank.l\" d=\"~#F12S-qD)U1Oyr-UT1y3Oay16.2U-1H6I6(2G3N4z*1F8ObJ1*ax5zdFbG!1)1*3R4-7XbSY1z139)a*cA9.e!kR2WjA9(n00101010102000000201010220200021000000002000001010000000000100000200220010100000\"/><path id=\"single-arm-triceps-pushdown-n-e-foot.l\" d=\"~#o2J.pHG)1OIqxJ(1Yb(2ygG7Nn*l(R2*2ED2I4zz1I7.l2zD1J4EaVbJqEaKkJn120000101000000000010001002000000000000020210000\"/><path id=\"single-arm-triceps-pushdown-n-e-shcap.l\" d=\"~~wYpWYt!I12\"/><path id=\"single-arm-triceps-pushdown-n-e-upper.l\" d=\"~#F12(!pNAtTJqxFsy4)684*hHE1w5K3N2X1WkKsyg*aw7Kd9IjJbEx12x31z6.lJB153H3K7Tc.7.l(eK9FiaNq00020000000101000200021000000020000002000000000000002000000010100200000200000022\"/><path id=\"single-arm-triceps-pushdown-n-e-elbowcap.l\" d=\"~~AEmJFB1Dw10\"/><path id=\"single-arm-triceps-pushdown-n-e-fore.l\" d=\"~#F12wKmH*B1O)l*EB1R4B8W1sWqSsV2T83O2.hEnI2)cK6x8zcE5RiTmK2nX7O4WlNw1iY1*6B6X7D5W3ykY9HcYiy810000000200010000002200020000000000020000200000000111120002000011000000000200000\"/><path id=\"single-arm-triceps-pushdown-n-e-fist.l\" d=\"~~_YrDAJ1Ft2\"/><path id=\"single-arm-triceps-pushdown-n-e-head\" d=\"~#w12!zr!Ok)UpzEkThUhRhY8Ba*2)2J4G4G7I7BaxgRkJ4TbO1.8Oh2NkEaPk.5yjw3PhSeK1Sh0002000000010101000000120000000010110002001210020002000011010121\"/><path id=\"single-arm-triceps-pushdown-n-e-torso\" d=\"~#_12wYp!_oXwqKPn-8X3*2O2_8_eY8P7WbWe!51-5.lRkI7TbN4SeK4yj-5PkTeygzgN4-8I7Re.oEw1Ba.o.52-81YbWe!2F7VbE7TeP8-5_h_5U4Wbx9(2J7xJ2Ft00001010110101001010100020020000000020000000000020000001010010010000000200100000000100000200212000021010100002000000\"/><path id=\"single-arm-triceps-pushdown-n-e-thigh.r\" d=\"^8\"/><path id=\"single-arm-triceps-pushdown-n-e-kneecap.r\" d=\"^9\"/><path id=\"single-arm-triceps-pushdown-n-e-shank.r\" d=\"^10\"/><path id=\"single-arm-triceps-pushdown-n-e-foot.r\" d=\"^11\"/><path id=\"single-arm-triceps-pushdown-n-e-shcap.r\" d=\"^12\"/><path id=\"single-arm-triceps-pushdown-n-e-upper.r\" d=\"~#F12DYpS!tEWpx!s7z8a0(5AI1J2X5A1X2D2Kz1U7.hG1)eTaEgG8Oy1O1R2K3B5U1NI172z1x8.e8KaJo_1NkPeDm01200020000010000100000000000000020000000000201000012000020220000000000000001010\"/><path id=\"single-arm-triceps-pushdown-n-e-elbowcap.r\" d=\"~~J.qFED1Dw10\"/><path id=\"single-arm-triceps-pushdown-n-e-fore.r\" d=\"~#F12H_qJJD1z-qTSB14R9w1U1A9YD1w2)8y1E2B4*tN4KcT1Ba*7Ra)4Vt-1*1O4*7!2YE1bY1)2)8B9D1X6FjJ2PfFcFg00200022000010002112100001000011010000020001011000000020012000010120000001000200\"/><path id=\"single-arm-triceps-pushdown-n-e-fist.r\" d=\"~~wHs(xO1Ft2\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#single-arm-triceps-pushdown-n-dots)\"/>\n  <path class=\"floorline\" d=\"M71.97 338.83H286.03\"/><path class=\"eq\" d=\"~MUYB1Syy2L!Ac0QF60T(bE6LE6xiQ0E6E6yiLT(bF6QE60U(bF6LF6yiQ0F6F6xiZ\"/><path class=\"eq\" d=\"~MNJD1DBaLwEc0QJ90T*bI9LI9xmQ0I9I9ymLT*bJ9QI90U*bJ9LJ9ymQ0J9J9xmZ\"/><path class=\"eq\" d=\"~MwDF1DBaL0(.2\"/><path class=\"eq\" d=\"~MY-K1DBaL0UT2\"/><path class=\"eq\" d=\"~MW.H1Syy2LHt0QF60xnE6LE6THX1Q0E6E6UHX1LxnF6QE60ynF6LF6UHX1Q0F6F6THX1Z\"/><path class=\"eq\" d=\"~MyVR1Syy2LHt0QF60xnE6LE6THX1Q0E6E6UHX1LxnF6QE60ynF6LF6UHX1Q0F6F6THX1Z\"/><path class=\"eq-solid\" d=\"~~JwE1AxdUB10\"/><path class=\"eq-pin\" d=\"~~Y)E1AxdF60\"/><path class=\"eq-solid\" d=\"~~P!J1_YcFt2\"/><path class=\"eq-pin\" d=\"~~PTK1_YcF60\"/><path class=\"eq-cable\" d=\"~MwDF1P.bLYT50\"/><path class=\"eq-thin\" d=\"~MDKK1JPw2L0GJR1\"/><path class=\"eq-thin\" d=\"~M_wP1JPw2L0GJR1\"/><path class=\"eq\" d=\"~MJ_J1Syy2LH-30QF60xT3E6LE6KvQ0E6E6NvLxT3F6QE60yT3F6LF6NvQ0F6F6KvZ\"/><path class=\"eq\" d=\"~MAUJ1DG.1L_B40L-B4DE5L-B4BE5Z\"/><path class=\"eq-thin\" d=\"M228.5 326.96H249.91M228.5 323.61H249.91M228.5 320.27H249.91M228.5 316.93H249.91M228.5 313.58H249.91M228.5 310.24H249.91M228.5 306.89H249.91\"/><path class=\"arc measure\" d=\"M142.65 195.72L141.08 177.79A18 18 0 0 1 145.4 213.51Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-triceps-pushdown-n-st-fore.r\"/><use href=\"#single-arm-triceps-pushdown-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-triceps-pushdown-n-st-fore.r\"/><use href=\"#single-arm-triceps-pushdown-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"~MHEz1ABz1LPS2SdLTI2)3LE8G1LB8G1L*F2OkLSI2(3LH8J1Z\"/><path class=\"eq\" d=\"~MH-y1UGz1LN)1T*2L-_1Y!2LsU4LR4sLGw2w-2LW_1X!2LpT4Z\"/><path class=\"eq\" d=\"~MWYB1((z1Lzu*J3LPw1_F3Ly4J2LG2y4L(pUH3LIw1-F3Lz4G2Z\"/><path class=\"eq\" d=\"~MYNB1wKw1LE4IaLz6A6L2P8Lw6A6LU81Lw6)5L2T8Z\"/><path class=\"eq-cable\" d=\"~MAwB1wKw1LNw2VOj\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-triceps-pushdown-n-g0-fore.r\"/><use href=\"#single-arm-triceps-pushdown-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-triceps-pushdown-n-g0-fore.r\"/><use href=\"#single-arm-triceps-pushdown-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"~MHDz1WBF1L!S2FbLVI2.1LG8x1LG8B1LKG2GiLYI2_1LF8y1Z\"/><path class=\"eq\" d=\"~MPYy1UHF1LW!1I)2LxY1J(2Lw1S4LR4y1LX*1Y_2LyY1I(2LvR4Z\"/><path class=\"eq\" d=\"~MNYB1F*F1LBx1xJ3LJz1!E3LD4F2LB2A4Lwt!G3LIz1.E3LB4E2Z\"/><path class=\"eq\" d=\"~MFIB1wJB1LE4GaLz6w6L2U8Lw6w6LU82Lw6z6L2O8Z\"/><path class=\"eq-cable\" d=\"~MU!A1wJB1L!z2zNo\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-triceps-pushdown-n-g1-fore.r\"/><use href=\"#single-arm-triceps-pushdown-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-triceps-pushdown-n-g1-fore.r\"/><use href=\"#single-arm-triceps-pushdown-n-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"~M!Rw1SGJ1LwS2PgLKI2T6LE8V1Lz8T1LBF2xnLNI2U6LF8W1Z\"/><path class=\"eq\" d=\"~M_zw1SKJ1LWy2E.2L)*1P_2LmY4LT4kLKz2WW2Lw(1T_2LnT4Z\"/><path class=\"eq\" d=\"~MHyz1HDK1LBq*K3LWs!G3Lw4S2LO2(3LDmSI3LVs)G3L)3K2Z\"/><path class=\"eq\" d=\"~MP!y1STG1LG4IaL)5A6L1P8LA6A6LP80LA6z6L1O8Z\"/><path class=\"eq-cable\" d=\"~M!Ky1STG1L(S4IYs\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-triceps-pushdown-n-g2-fore.r\"/><use href=\"#single-arm-triceps-pushdown-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-triceps-pushdown-n-g2-fore.r\"/><use href=\"#single-arm-triceps-pushdown-n-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MAUJ1FzB1L_B40L-B4FE5L-B4EE5Z\"/><path class=\"eq-thin\" d=\"M228.5 213.37H249.91M228.5 210.03H249.91M228.5 206.68H249.91M228.5 203.34H249.91M228.5 200H249.91M228.5 196.65H249.91M228.5 193.31H249.91\"/><path class=\"eq-cable\" d=\"~MwXN1_YcL0NHo\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#single-arm-triceps-pushdown-n-e-thigh.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-kneecap.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-shank.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-foot.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-shcap.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-upper.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-elbowcap.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-fore.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#single-arm-triceps-pushdown-n-e-thigh.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-kneecap.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-shank.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-foot.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-shcap.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-upper.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-elbowcap.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-fore.l\"/><use href=\"#single-arm-triceps-pushdown-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-triceps-pushdown-n-e-head\"/><use href=\"#single-arm-triceps-pushdown-n-e-torso\"/><use href=\"#single-arm-triceps-pushdown-n-e-thigh.r\"/><use href=\"#single-arm-triceps-pushdown-n-e-kneecap.r\"/><use href=\"#single-arm-triceps-pushdown-n-e-shank.r\"/><use href=\"#single-arm-triceps-pushdown-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-triceps-pushdown-n-e-head\"/><use href=\"#single-arm-triceps-pushdown-n-e-torso\"/><use href=\"#single-arm-triceps-pushdown-n-e-thigh.r\"/><use href=\"#single-arm-triceps-pushdown-n-e-kneecap.r\"/><use href=\"#single-arm-triceps-pushdown-n-e-shank.r\"/><use href=\"#single-arm-triceps-pushdown-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~MHzsDGN1LUO2UpLEH2xfL*7T2L*7R2LzB2)uLFH2AfL(7S2Z\"/><path class=\"eq\" d=\"~M!UrSIN1LSJ2zT2L.E2(S2L8W4LX48LXJ2JN2L!E2*S2L7V4Z\"/><path class=\"eq\" d=\"~MwPu_NO1LTdBP3LSgNJ3LW3(2L*2Y3L(9FK3LOgKJ3L-3*2Z\"/><path class=\"eq\" d=\"~MFXuP_I1LG4IaL)5A6L1P8LA6A6LP81LA6)5L1T8Z\"/><path class=\"eq-cable\" d=\"~MUFuP_I1LA-8Rzv\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-triceps-pushdown-n-e-shcap.r\"/><use href=\"#single-arm-triceps-pushdown-n-e-upper.r\"/><use href=\"#single-arm-triceps-pushdown-n-e-elbowcap.r\"/><use href=\"#single-arm-triceps-pushdown-n-e-fore.r\"/><use href=\"#single-arm-triceps-pushdown-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-triceps-pushdown-n-e-shcap.r\"/><use href=\"#single-arm-triceps-pushdown-n-e-upper.r\"/><use href=\"#single-arm-triceps-pushdown-n-e-elbowcap.r\"/><use href=\"#single-arm-triceps-pushdown-n-e-fore.r\"/><use href=\"#single-arm-triceps-pushdown-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"138.86\" cy=\"152.43\" r=\"2.25\"/><circle class=\"joint\" cx=\"142.65\" cy=\"195.72\" r=\"2.25\"/><circle class=\"joint\" cx=\"138.86\" cy=\"214.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"143.94\" cy=\"272.1\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#H20yDz1Jzx1T(y1zYw1fch8hah8j6j8h6j4l2h4j2l2j1h0l1j3j1j5h5j5j7f7j9f9h9hbdbfdddddff9dbhbf9h9h0000200001000000111000000000000010110100020000120000000200000000101000000000000010100000201000000010101210000001010000101010002200000000000101111100\"/><path class=\"arrow\" d=\"~MPTu(_N1LDpOx1LO8yz2Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M141.08 177.79A18 18 0 0 1 145.4 213.51\"/><g class=\"arc-ticks\"><path d=\"~M(TryPz1L.4)X1\"/><path d=\"~M(FsY*F1LU8SX1\"/></g><path class=\"leader\" d=\"~MWXvFYB1LE_aP-5\"/></g></g><path class=\"leader\" d=\"~MS.rFED1LzT7Xa\"/><circle class=\"anchor\" cx=\"142.65\" cy=\"195.72\" r=\"1.5\"/><path class=\"leader\" d=\"M122.01 163.47L122.04 146H112.04\"/><circle class=\"anchor\" cx=\"122.01\" cy=\"163.47\" r=\"1.5\"/><path class=\"leader\" d=\"M147.87 229.47L90.88 270H80.88\"/><circle class=\"anchor\" cx=\"147.87\" cy=\"229.47\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"single-arm-triceps-pushdown-n-elbow\" data-key=\"elbow\" data-cue=\"Keep the working upper arm at your side so only the forearm moves.\" class=\"plate-callout two\" style=\"left:14.53%;top:48.04%\" aria-pressed=\"true\">Elbow<br>pinned</button><button type=\"button\" id=\"single-arm-triceps-pushdown-n-torso\" data-key=\"torso\" data-cue=\"Keep the shoulders and hips square. The body does not turn.\" class=\"plate-callout two\" style=\"left:15.64%;top:34.64%\" aria-pressed=\"false\">Square<br>torso</button><button type=\"button\" id=\"single-arm-triceps-pushdown-n-wrist\" data-key=\"wrist\" data-cue=\"Keep the hand in line with the forearm from top to bottom.\" class=\"plate-callout two\" style=\"left:5.03%;top:69.27%\" aria-pressed=\"false\">Neutral<br>wrist</button><span class=\"plate-arc-label\" style=\"left:12.29%;top:60.34%\"><b>Elbow</b><span>not locked</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"single-arm-triceps-pushdown-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"single-arm-triceps-pushdown-m-st-fore.r\" d=\"^0\"/><path id=\"single-arm-triceps-pushdown-m-st-fist.r\" d=\"^1\"/><path id=\"single-arm-triceps-pushdown-m-g0-fore.r\" d=\"^2\"/><path id=\"single-arm-triceps-pushdown-m-g0-fist.r\" d=\"^3\"/><path id=\"single-arm-triceps-pushdown-m-g1-fore.r\" d=\"^4\"/><path id=\"single-arm-triceps-pushdown-m-g1-fist.r\" d=\"^5\"/><path id=\"single-arm-triceps-pushdown-m-g2-fore.r\" d=\"^6\"/><path id=\"single-arm-triceps-pushdown-m-g2-fist.r\" d=\"^7\"/><path id=\"single-arm-triceps-pushdown-m-e-thigh.l\" d=\"^8\"/><path id=\"single-arm-triceps-pushdown-m-e-kneecap.l\" d=\"^9\"/><path id=\"single-arm-triceps-pushdown-m-e-shank.l\" d=\"^10\"/><path id=\"single-arm-triceps-pushdown-m-e-foot.l\" d=\"^11\"/><path id=\"single-arm-triceps-pushdown-m-e-shcap.l\" d=\"^12\"/><path id=\"single-arm-triceps-pushdown-m-e-upper.l\" d=\"^13\"/><path id=\"single-arm-triceps-pushdown-m-e-elbowcap.l\" d=\"^14\"/><path id=\"single-arm-triceps-pushdown-m-e-fore.l\" d=\"^15\"/><path id=\"single-arm-triceps-pushdown-m-e-fist.l\" d=\"^16\"/><path id=\"single-arm-triceps-pushdown-m-e-head\" d=\"^17\"/><path id=\"single-arm-triceps-pushdown-m-e-torso\" d=\"^18\"/><path id=\"single-arm-triceps-pushdown-m-e-thigh.r\" d=\"^8\"/><path id=\"single-arm-triceps-pushdown-m-e-kneecap.r\" d=\"^9\"/><path id=\"single-arm-triceps-pushdown-m-e-shank.r\" d=\"^10\"/><path id=\"single-arm-triceps-pushdown-m-e-foot.r\" d=\"^11\"/><path id=\"single-arm-triceps-pushdown-m-e-shcap.r\" d=\"^12\"/><path id=\"single-arm-triceps-pushdown-m-e-upper.r\" d=\"^19\"/><path id=\"single-arm-triceps-pushdown-m-e-elbowcap.r\" d=\"^20\"/><path id=\"single-arm-triceps-pushdown-m-e-fore.r\" d=\"^21\"/><path id=\"single-arm-triceps-pushdown-m-e-fist.r\" d=\"^22\"/><path id=\"single-arm-triceps-pushdown-m-m-head\" d=\"~#w12YNA1_KnRGz1zPmVnH7VjfT7I7T4P2fR8T1KcR4TpH9G8!2K8OfE8!mi_kP4NfPbW8AlR9!e1100001010200000001000020000020000002000001000020000002100101200\"/><path id=\"single-arm-triceps-pushdown-m-m-torso\" d=\"~#_12WDx1(TqIyy1TSp*5I7K1T3oDhF4_aP3NiA7(2S1OpxkKmXbO3_dP6wiJ8yp_2Wmz1D9T3H4-fy3OF1y9Ip!2EeXeEp)ayE1p_7*6.b.gkRd(cw3!6SeO2p_7)P2-900000000010000002000001101100201010022000000100000000200010001000020000100000000002000020020011010100000010000001000\"/><path id=\"single-arm-triceps-pushdown-m-m-eq0\" d=\"~MU.D1UOH1LUT20LEI2J8LI80LI80LEI2K8LFI2G8LJ80Z\"/><path id=\"single-arm-triceps-pushdown-m-m-eq1\" d=\"~MUND1HWH1LJO1TD3L.H1wB3LS1N4LK4U1LxR1Dy3LwI1)A3LT1K4Z\"/><path id=\"single-arm-triceps-pushdown-m-m-eq2\" d=\"~MAPG1(.H1LGO1TD3L(P1Dy3LP4U1LV1N4L!H1yB3L)P1Ey3LI4T1Z\"/><path id=\"single-arm-triceps-pushdown-m-m-eq3\" d=\"~MAUF1NOE1LE4GaLz6w6L2U8Lw6w6LU82Lw6x6L2T8Z\"/><path id=\"single-arm-triceps-pushdown-m-mf-thigh.l\" d=\"~#F12(AnAWH1*Xm)JG1)3zaz1aygAX1U3B8W1z4V8-O1F6)mz4xiXf.hEd.N1B3.2*6-5_9UY1y17n.aEux4zb!F1J7yw1ws!v00200000022000100001000000000001010200001020000100101010100100001100011000200101\"/><path id=\"single-arm-triceps-pushdown-m-mf-kneecap.l\" d=\"~~yRqPzV1wG11\"/><path id=\"single-arm-triceps-pushdown-m-mf-shank.l\" d=\"~#F12_OqD)U1RXqRUT1W2RaD12K1Y-1D6R6_2I3_2E*1(7VbA1*aK5xdS9R!1x2.3X4V7Ea!Y1z13h*aVcN9KeDl*1_jY9Wn20000000001012020010000020200000001010101000001002000200010100010000100022000202\"/><path id=\"single-arm-triceps-pushdown-m-mf-foot.l\" d=\"^11\"/><path id=\"single-arm-triceps-pushdown-m-mf-shcap.l\" d=\"~~NXu!Tv!I12\"/><path id=\"single-arm-triceps-pushdown-m-mf-upper.l\" d=\"~#F12U!uF)uXJv-yuF4)684RiNE1A5I3P2.1AlRsDg-ay7Gd3Kj(bRx14)21E6GmPB173N3K7Tc-7)lYeV9Ai4Pq02002000001010000201000002101010101000000020000100002200001010000000001000001200\"/><path id=\"single-arm-triceps-pushdown-m-mf-elbowcap.l\" d=\"~~JzrDAE1Dw10\"/><path id=\"single-arm-triceps-pushdown-m-mf-fore.l\" d=\"~#F12!BrJUD1GUr)(B1Y5R73Y1.fWA1!6x6H2E1PeIqybK7_4)81Gd_d-q9R2D1z9OlUx1K1D1y3x9z8O4*gJbI7_d4Jk00100001000210011110001002000010121000000000010100001001110101001002000000200202\"/><path id=\"single-arm-triceps-pushdown-m-mf-fist.l\" d=\"~~!)mwxO1Ft2\"/><path id=\"single-arm-triceps-pushdown-m-mf-thigh.r\" d=\"^79\"/><path id=\"single-arm-triceps-pushdown-m-mf-kneecap.r\" d=\"^80\"/><path id=\"single-arm-triceps-pushdown-m-mf-shank.r\" d=\"^81\"/><path id=\"single-arm-triceps-pushdown-m-mf-foot.r\" d=\"^11\"/><path id=\"single-arm-triceps-pushdown-m-mf-shcap.r\" d=\"^82\"/><path id=\"single-arm-triceps-pushdown-m-mf-upper.r\" d=\"~#F12PXuSRvx_u*PusB8803UI1D3G5P1T2y7.y1yaVgq)eG8RhI3Oz1B1X2T2R5K4HI1701z8Ve-1XdYmz1NkHbwo02200001100000000000001010110002000200000000020000000000021210000002000010000020\"/><path id=\"single-arm-triceps-pushdown-m-mf-elbowcap.r\" d=\"~~(UuWzF1Dw10\"/><path id=\"single-arm-triceps-pushdown-m-mf-fore.r\" d=\"~#F12YHvWzG1ETuB-F1K8G4!15YD1F9z7X5R1x2RsV9B9R9X9B3zdH2Xs.8O2mB9g!A1FfJ1F1K9K1*2Y8weYewf_4wkT300000001210001000020000000000001011100220000001000000000001001000002101001001010\"/><path id=\"single-arm-triceps-pushdown-m-mf-fist.r\" d=\"~~DFE1D!H1Ft2\"/><path id=\"single-arm-triceps-pushdown-m-mo-0\" d=\"^17\"/><path id=\"single-arm-triceps-pushdown-m-mo-1\" d=\"^18\"/><path id=\"single-arm-triceps-pushdown-m-mo-2\" d=\"^8\"/><path id=\"single-arm-triceps-pushdown-m-mo-3\" d=\"^9\"/><path id=\"single-arm-triceps-pushdown-m-mo-4\" d=\"^10\"/><path id=\"single-arm-triceps-pushdown-m-mo-5\" d=\"^11\"/><path id=\"single-arm-triceps-pushdown-m-mo-6\" d=\"^12\"/><path id=\"single-arm-triceps-pushdown-m-mo-7\" d=\"^13\"/><path id=\"single-arm-triceps-pushdown-m-mo-8\" d=\"^14\"/><path id=\"single-arm-triceps-pushdown-m-mo-9\" d=\"^15\"/><path id=\"single-arm-triceps-pushdown-m-mo-10\" d=\"^16\"/><path id=\"single-arm-triceps-pushdown-m-mo-11\" d=\"^8\"/><path id=\"single-arm-triceps-pushdown-m-mo-12\" d=\"^9\"/><path id=\"single-arm-triceps-pushdown-m-mo-13\" d=\"^10\"/><path id=\"single-arm-triceps-pushdown-m-mo-14\" d=\"^11\"/><path id=\"single-arm-triceps-pushdown-m-mo-15\" d=\"^12\"/><path id=\"single-arm-triceps-pushdown-m-mo-16\" d=\"^19\"/><path id=\"single-arm-triceps-pushdown-m-mo-17\" d=\"^20\"/><path id=\"single-arm-triceps-pushdown-m-mo-18\" d=\"^21\"/><path id=\"single-arm-triceps-pushdown-m-mo-19\" d=\"^22\"/><path id=\"single-arm-triceps-pushdown-m-mo-20\" d=\"^24\"/><path id=\"single-arm-triceps-pushdown-m-mo-21\" d=\"^25\"/><path id=\"single-arm-triceps-pushdown-m-mo-22\" d=\"^28\"/><path id=\"single-arm-triceps-pushdown-m-mo-23\" d=\"^29\"/><path id=\"single-arm-triceps-pushdown-m-mo-24\" d=\"^30\"/><path id=\"single-arm-triceps-pushdown-m-mo-25\" d=\"^31\"/><path id=\"single-arm-triceps-pushdown-m-mo-26\" d=\"^32\"/><path id=\"single-arm-triceps-pushdown-m-mo-27\" d=\"^33\"/><path id=\"single-arm-triceps-pushdown-m-mo-28\" d=\"^37\"/><path id=\"single-arm-triceps-pushdown-m-mo-29\" d=\"^38\"/><path id=\"single-arm-triceps-pushdown-m-mo-30\" d=\"^56\"/><path id=\"single-arm-triceps-pushdown-m-mo-31\" d=\"^59\"/><path id=\"single-arm-triceps-pushdown-m-mo-32\" d=\"^60\"/><path id=\"single-arm-triceps-pushdown-m-mo-33\" d=\"^61\"/><path id=\"single-arm-triceps-pushdown-m-mo-34\" d=\"^62\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#single-arm-triceps-pushdown-m-dots)\"/>\n  <path class=\"floorline\" d=\"^23\"/><path class=\"eq\" d=\"^24\"/><path class=\"eq\" d=\"^25\"/><path class=\"eq\" d=\"^26\"/><path class=\"eq\" d=\"^27\"/><path class=\"eq\" d=\"^28\"/><path class=\"eq\" d=\"^29\"/><path class=\"eq-solid\" d=\"^30\"/><path class=\"eq-pin\" d=\"^31\"/><path class=\"eq-solid\" d=\"^32\"/><path class=\"eq-pin\" d=\"^33\"/><path class=\"eq-cable\" d=\"^34\"/><path class=\"eq-thin\" d=\"^35\"/><path class=\"eq-thin\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><path class=\"eq\" d=\"^38\"/><path class=\"eq-thin\" d=\"^39\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-triceps-pushdown-m-st-fore.r\"/><use href=\"#single-arm-triceps-pushdown-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-triceps-pushdown-m-st-fore.r\"/><use href=\"#single-arm-triceps-pushdown-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq\" d=\"^42\"/><path class=\"eq\" d=\"^43\"/><path class=\"eq\" d=\"^44\"/><path class=\"eq-cable\" d=\"^45\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-triceps-pushdown-m-g0-fore.r\"/><use href=\"#single-arm-triceps-pushdown-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-triceps-pushdown-m-g0-fore.r\"/><use href=\"#single-arm-triceps-pushdown-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"^46\"/><path class=\"eq\" d=\"^47\"/><path class=\"eq\" d=\"^48\"/><path class=\"eq\" d=\"^49\"/><path class=\"eq-cable\" d=\"^50\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-triceps-pushdown-m-g1-fore.r\"/><use href=\"#single-arm-triceps-pushdown-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-triceps-pushdown-m-g1-fore.r\"/><use href=\"#single-arm-triceps-pushdown-m-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"^51\"/><path class=\"eq\" d=\"^52\"/><path class=\"eq\" d=\"^53\"/><path class=\"eq\" d=\"^54\"/><path class=\"eq-cable\" d=\"^55\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-triceps-pushdown-m-g2-fore.r\"/><use href=\"#single-arm-triceps-pushdown-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-triceps-pushdown-m-g2-fore.r\"/><use href=\"#single-arm-triceps-pushdown-m-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^56\"/><path class=\"eq-thin\" d=\"^57\"/><path class=\"eq-cable\" d=\"^58\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#single-arm-triceps-pushdown-m-e-thigh.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-kneecap.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-shank.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-foot.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-shcap.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-upper.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-elbowcap.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-fore.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#single-arm-triceps-pushdown-m-e-thigh.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-kneecap.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-shank.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-foot.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-shcap.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-upper.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-elbowcap.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-fore.l\"/><use href=\"#single-arm-triceps-pushdown-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-triceps-pushdown-m-e-head\"/><use href=\"#single-arm-triceps-pushdown-m-e-torso\"/><use href=\"#single-arm-triceps-pushdown-m-e-thigh.r\"/><use href=\"#single-arm-triceps-pushdown-m-e-kneecap.r\"/><use href=\"#single-arm-triceps-pushdown-m-e-shank.r\"/><use href=\"#single-arm-triceps-pushdown-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-triceps-pushdown-m-e-head\"/><use href=\"#single-arm-triceps-pushdown-m-e-torso\"/><use href=\"#single-arm-triceps-pushdown-m-e-thigh.r\"/><use href=\"#single-arm-triceps-pushdown-m-e-kneecap.r\"/><use href=\"#single-arm-triceps-pushdown-m-e-shank.r\"/><use href=\"#single-arm-triceps-pushdown-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^59\"/><path class=\"eq\" d=\"^60\"/><path class=\"eq\" d=\"^61\"/><path class=\"eq\" d=\"^62\"/><path class=\"eq-cable\" d=\"^63\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-triceps-pushdown-m-e-shcap.r\"/><use href=\"#single-arm-triceps-pushdown-m-e-upper.r\"/><use href=\"#single-arm-triceps-pushdown-m-e-elbowcap.r\"/><use href=\"#single-arm-triceps-pushdown-m-e-fore.r\"/><use href=\"#single-arm-triceps-pushdown-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-triceps-pushdown-m-e-shcap.r\"/><use href=\"#single-arm-triceps-pushdown-m-e-upper.r\"/><use href=\"#single-arm-triceps-pushdown-m-e-elbowcap.r\"/><use href=\"#single-arm-triceps-pushdown-m-e-fore.r\"/><use href=\"#single-arm-triceps-pushdown-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"138.86\" cy=\"152.43\" r=\"2.25\"/><circle class=\"joint\" cx=\"142.65\" cy=\"195.72\" r=\"2.25\"/><circle class=\"joint\" cx=\"138.86\" cy=\"214.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"143.94\" cy=\"272.1\" r=\"2.25\"/></g><mask id=\"single-arm-triceps-pushdown-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#single-arm-triceps-pushdown-m-m-head\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-m-torso\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-shank.l\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-foot.l\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-upper.l\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-fore.l\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-fist.l\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-shank.r\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-foot.r\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-upper.r\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-fore.r\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mf-fist.r\" fill=\"#000\"/><use href=\"#single-arm-triceps-pushdown-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-triceps-pushdown-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#single-arm-triceps-pushdown-m-mmask)\"><g class=\"u-stroke\"><use href=\"#single-arm-triceps-pushdown-m-m-head\"/><use href=\"#single-arm-triceps-pushdown-m-m-torso\"/><use href=\"#single-arm-triceps-pushdown-m-m-eq0\"/><use href=\"#single-arm-triceps-pushdown-m-m-eq1\"/><use href=\"#single-arm-triceps-pushdown-m-m-eq2\"/><use href=\"#single-arm-triceps-pushdown-m-m-eq3\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MPXuSRvLvD4La0La2L61L40L25L11L37L17L07L21L15L20L01L02L02L07L0dL03L02L0aL0kL2sL1y1L1H1L0D1L0sL0iL2aL00L27L2hL4dL03L43L00L23L20L11L20L16L0aL00L00L4bL2dL4lL6rL2rL6nL0hL6hL4bL47L67L61L65La7L67L47L27L27L07L35L05L47L25L09L15L39L57L59L73L35L53L3bL3bL0hL1hL0nL0tL3pL1lL0hL17L11L20L1aL28L11L01L00L03L10L15L11L0dL1hL09L12L18L1iL1uL3A1L1H1L3y1L3sL0kL1aL02L05L0bL27L02L02L10L23L11L25L07L23L67L05L01L31L51L71Ld4L95L77L53L70L76L78L3gL7iL9iL9cL7cL5aL5cL2aL1aL6aL18L3aL1aL08L2eL6aL6eLacL8iL4kL6gL6aL64L64La5L65\"/><path class=\"m-line\" d=\"~MHVw1WzF1LK2HcLR4.1LK3K3L.1R4L0.4L!1R4LN3K3LS4.1L!40LS4!1LN3N3L!1S4L0!4L.1S4LK3N3LR4!1\"/><path class=\"m-line\" d=\"~MYHvWzG1L_2Y1L83L05L43L33L31L31L71L70L93L31L33L00L10L40L22L11Ld3L10L42La0Lg4Lo8Lw16LD1aLw18Lq8Lg4L80L00L97Lh3Ld9L51L33L11L33L00L10L20L82L60L20L01L91Lb3Lh5Ll7Ln5Lj3Lh5Ld5L71L55L15L23L05L55L35L35L51L31L30L50L31L33L50L11L71L52L52L74L34L14L32L72L91Ld3Lf5Lj7Ll7Ln7Lf5Ld3L71L30L40L66L60L22L12L11L10L32L30L71Lf1Lj3L90L01L66Le6LqaLw1cLD1eLscLm8LgaLc2L02L11L93L50L60L02L01L02L50L31L91L73L51L53L32L30L16L04L08L14L74L34L14L66L48La6LcaLacL6aLa8L46L86L82L82L80L60L66L64L82La0L80Lc3Lc3Le3Le2Le1L83L60L45L15L33\"/><path class=\"m-line\" d=\"~MWyG1D!H1L0J1L32L10L10L10L11L10L11L10L31L00L30L01L11L11L10L03L30L01L10L13L00L03L11L01L10L03L11L21L11L03L00L23L10L03L01L01L21L03L20L01L21L03L00L23L20L01L40L03L40L11L41L21L00L40L01L40L21L20L21L20L20L20L42L01L40L20L20L22L21L24L21L44L01L42L02L20L40L14L42L00L42L02L22L20L04L00L24L02L22L02L22L02L02L02L12L24L02L02L12L22L12L02L12L02L14L00L04L10L12L02L32L00L12L14L10L00L32L02L31L14L11L14L11L12L10L10L30\"/><path class=\"m-line\" d=\"~MPBF1NOE1LzB1TJq\"/><path class=\"leader m\" d=\"M144.31 163.73L117.98 158H107.98\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"single-arm-triceps-pushdown-m-lean\" data-key=\"lean\" data-cue=\"You lean over the handle or arch your back to push it down.\" class=\"plate-callout two m\" style=\"left:13.41%;top:37.99%\" aria-pressed=\"true\">Leaning<br>over</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "elbow",
        cues: [{ key: "elbow", cue: "Keep the working upper arm at your side so only the forearm moves." }, { key: "torso", cue: "Keep the shoulders and hips square. The body does not turn." }, { key: "wrist", cue: "Keep the hand in line with the forearm from top to bottom." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "lean",
        cues: [{ key: "lean", cue: "You lean over the handle or arch your back to push it down." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Leaning over</b><span>You lean over the handle or arch your back to push it down.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: press 1 second, hold 1 second, return 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div></div>",
      alt: "Single-arm triceps pushdown, side view. Standing tall at a high cable with the torso vertical, one upper arm pinned at the side, the lifter presses a single handle from upper-chest level down to a straight arm, the other arm hanging.",
      mistakeAlt: "Single-Arm Triceps Pushdown: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "push",
    "why": "D-SHIP-C3 no-zoom list: the d-handle key lists single_arm_triceps_pushdown in GAPS (hand-d-handle.mjs:21; golden-B follow-up 9, D-LIB7-19a); the grip copy carries c2 and c9.",
    "handle": "d-handle",
    "overBody": false,
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown"
        ],
        "note": "card c2"
      }
    },
    "contact": "heel",
    "wrist": {
      "ext": [
        0,
        15
      ],
      "limitText": "Keep the wrist in line with the forearm.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "CONVENTION"
        ],
        "sources": [
          "ace-pushdown",
          "ga-push-heel"
        ],
        "note": "card c9. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number."
      }
    },
    "faults": [],
    "gripLine": "Single handle, firm full grip, thumb wrapped.",
    "cue": "Wrist in line with the forearm."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set the pulley above head height and attach a single handle.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown"
        ],
        "note": "card c1, c2"
      }
    },
    {
      "kind": "grip",
      "text": "Grip the handle firmly, thumb wrapped.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown"
        ],
        "note": "card c2"
      }
    },
    {
      "kind": "position",
      "text": "Stand facing the machine with your shoulders and hips square.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown",
          "centr-single"
        ],
        "note": "card c1, c4"
      }
    },
    {
      "kind": "brace",
      "text": "Brace, torso upright. Working elbow at your side, hand at upper chest.",
      "zoom": "single-pushdown-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown"
        ],
        "note": "card c16, c7"
      }
    },
    {
      "kind": "position",
      "text": "Straighten the arm fully without locking the elbow.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown"
        ],
        "note": "card c8"
      }
    }
  ],
  posture: [
    {
      "key": "elbow",
      "label": "Elbow pinned",
      "detail": "Working elbow stays next to your side.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "zoom": "single-pushdown-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown"
        ],
        "note": "card c5"
      }
    },
    {
      "key": "square",
      "label": "Square torso",
      "detail": "Shoulders and hips stay square, no twisting.",
      "anchor": {
        "pose": "start",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "centr-single"
        ],
        "note": "card c4"
      }
    },
    {
      "key": "torso",
      "label": "Torso upright",
      "detail": "Torso braced and upright.",
      "anchor": {
        "pose": "start",
        "at": "backMid"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown"
        ],
        "note": "card c16"
      }
    },
    {
      "key": "wrist",
      "label": "Neutral wrist",
      "detail": "Wrist neutral throughout.",
      "anchor": {
        "pose": "end",
        "at": "wrist.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown"
        ],
        "note": "card c9"
      }
    },
    {
      "key": "lockout",
      "label": "No lockout",
      "detail": "Straighten the arm fully without locking the elbow.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown"
        ],
        "note": "card c8"
      }
    },
    {
      "key": "return",
      "label": "Return height",
      "detail": "Return only until the elbow starts to move forward.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "zoom": "single-pushdown-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown"
        ],
        "note": "card c7"
      }
    }
  ],
  zooms: [
    {
      "key": "single-pushdown-elbow",
      "chip": "Elbow",
      "heading": "Elbow position",
      "kind": "posture",
      "feelRow": "lats"
    }
  ],
  chips: [
    "single-pushdown-elbow",
    "feel"
  ],
  copy: {
    "setupLine": "Single handle on a high pulley. Working elbow at your side, shoulders and hips square.",
    "mistakeLine": "Keep your elbow at your side. Tilt only from the hips, never by arching your back.",
    "cueLine": "Elbow pinned to your side."
  },
  mistakes: [
    {
      "key": "lean",
      "title": "Leaning over or arching back",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "sl-pushdown"
        ],
        "note": "card c17"
      },
      "fix": "Tilt from your hips. Don't arch your back."
    },
    {
      "key": "elbow-forward",
      "title": "Elbow drifting forward",
      "zoom": "single-pushdown-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown"
        ],
        "note": "card c6, c5, c7"
      },
      "fix": "Keep the elbow at your side. Stop the return at upper-chest level."
    },
    {
      "key": "turning",
      "title": "Turning the torso",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "centr-single"
        ],
        "note": "card c4"
      },
      "fix": "Keep shoulders and hips square."
    }
  ],
  risks: [
    {
      "key": "elbows",
      "text": "Heavy loads feel uncomfortable in the elbows for many people.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-pushdown"
        ],
        "note": "card c12"
      }
    },
    {
      "key": "weight",
      "text": "Too much weight moved with momentum can lead to injury.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "sl-pushdown"
        ],
        "note": "card c13"
      }
    },
    {
      "key": "lean",
      "text": "Leaning or arching can strain the lower back.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "sl-pushdown"
        ],
        "note": "card c17"
      }
    }
  ],
  riskFlags: [
    "elbow",
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
    "ace-pushdown",
    "centr-single",
    "acsm-2009",
    "sl-pushdown",
    "ga-push-heel",
    "nhs-elbow-pain",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/single_arm_triceps_pushdown.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

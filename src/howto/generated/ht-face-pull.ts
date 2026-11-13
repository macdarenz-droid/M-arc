// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=bb7adc4b87448412e2dbc1d22a06d21f62b7da66d293d3078a36c94cdbc57340
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_face_pull",
  name: "Face Pull",
  hashes: { inputsSha256: "bb7adc4b87448412e2dbc1d22a06d21f62b7da66d293d3078a36c94cdbc57340", golden: "433a67bea1aa3d464e0d02227303e090f06973bd82c458414c739579bd4c0dce" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"face-pull-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"face-pull-n-st-shcap.l\" d=\"~~!Xh_EqwP10\"/><path id=\"face-pull-n-st-upper.l\" d=\"~#F12FIjWXrKFiB-rV8419AN1V5*5V2x3G1BB1x3IjX8KgF1)hHbIA1H8X2W1T5U3PN1v2cV8w1nJgNq_bJmT1PoKf00010000000000000000010000000112100010010100020002010000000100000010110010000002\"/><path id=\"face-pull-n-st-elbowcap.l\" d=\"~~DDrDTpDz10\"/><path id=\"face-pull-n-st-fore.l\" d=\"~#F12NSs!WqIXrT_qxaoS1B1(E1VdV9E1O2vTuH7xeO3-aW2Xa!9GuA8-1y2*7Y5WG1)6w28G9D4S1waPlN5YgE4Jg)e11101000101010110020001000000021001200000110001200002021000000000000020000000000\"/><path id=\"face-pull-n-st-fist.l\" d=\"~~NOA1UFnww10\"/><path id=\"face-pull-n-st-shcap.r\" d=\"^0\"/><path id=\"face-pull-n-st-upper.r\" d=\"^1\"/><path id=\"face-pull-n-st-elbowcap.r\" d=\"^2\"/><path id=\"face-pull-n-st-fore.r\" d=\"^3\"/><path id=\"face-pull-n-st-fist.r\" d=\"^4\"/><path id=\"face-pull-n-g0-shcap.r\" d=\"~~YRh_EqwP10\"/><path id=\"face-pull-n-g0-upper.r\" d=\"~#F12WRiyVr.PhIFrz8I349(J1PdI4*4I2I2Ix1*hEe-fRfO5)kA3EB1z7G3cR6y1NI1(h58I8K2*6WeNjPlAlP7YsG410100100001000002010020022000010100000200210120000000101100000000010110010210100\"/><path id=\"face-pull-n-g0-elbowcap.r\" d=\"~~YSqDHtDz10\"/><path id=\"face-pull-n-g0-fore.r\" d=\"~#F12HWsY.tKFsxOuV5_66V1Fe-x1-6F5I2uBcSlzc(7I5!91PeKbwmgP2jU8PkKuJ1x1R2N8W6(8SiEcD8xf4Em10000202200010000001010101110000100000100000220000200000000000000010100012000101\"/><path id=\"face-pull-n-g0-fist.r\" d=\"~~JTuwzmww10\"/><path id=\"face-pull-n-g1-shcap.r\" d=\"~~WIh_EqwP10\"/><path id=\"face-pull-n-g1-upper.r\" d=\"~#F12WAjwXrTGiE.r.6s09Hz1B9)4E2R2v-nG1GkG6zgy3RgNdTl(9)1!1-3w4DA1O428T6Y1B6WhUrW8AmE4NmEi00000000000000200010100100101001210000002000022200120001000000010100000001001101\"/><path id=\"face-pull-n-g1-elbowcap.r\" d=\"~~FYow*oDz10\"/><path id=\"face-pull-n-g1-fore.r\" d=\"~#F12Fwr_.oT*qGEpT1D4llz4ThI3(3T1y1bP2I6wdaFbF7PciU2U1qW3Y3(2-hmp!1A4UaNg(9*jhBhzbBj10001100000010000010000001000002100000000201010000001011010100100000200000020000\"/><path id=\"face-pull-n-g1-fist.r\" d=\"~~HXoN*kww10\"/><path id=\"face-pull-n-e-thigh.l\" d=\"~#F12HAh!.E1z(gzKD1I2TbE12Y6P(1P5B8U2x49BV1AbTnx1BkOdGmG5.U1)2-3G6R77!(1F11F1.b-vzaVj(G1_1(z1yoUE100200200000012100001010000000000000000000200100001100200002000010020001000010001\"/><path id=\"face-pull-n-e-kneecap.l\" d=\"~~YYiH)T1_J10\"/><path id=\"face-pull-n-e-shank.l\" d=\"~#F12FXi!!T1O*i*KS1N2TbH10P1D)1J6R7w3-37xz2w8Bdk)bT6)dF7Vy2O2x4R5B8B8W(1B13E1.bIdybOe!nB1YlwcHp01000201000010000020000000001000110110002000000010000220000000022000000200000011\"/><path id=\"face-pull-n-e-foot.l\" d=\"~#o2DUiAB)1XBjzB(1YcF3Uhx8Sp)nU-2B3-J2-4ID1)7)n2TG1Y4Bb-c_sBbKmSp021002110110100100000020000200100111000010111100\"/><path id=\"face-pull-n-e-shcap.l\" d=\"~~SBh_EqwP10\"/><path id=\"face-pull-n-e-upper.l\" d=\"~#F12_AkJPqBwk-ArG1y593U2.rX3!2X1N1V7HaEdUg.2DgP6DkU3Jcy1w2S2(3H7xra2hF5DdNiyiVmw4zm*8Rr00012100010002000210000000002001210101000212100121001002001000000000200000000000\"/><path id=\"face-pull-n-e-elbowcap.l\" d=\"~~SRi!.kDz10\"/><path id=\"face-pull-n-e-fore.l\" d=\"~#F12(YkNylIVkzBl*1slbR2R5T3cV10Y1Ec*8Jbx2wbN4_dW2xcS1gF3Y1J4K4o0P1N1P5Hq!dIhy3*g.6zl20000001000000200110100000020011001010000001000010010000120000100000000000000000\"/><path id=\"face-pull-n-e-fist.l\" d=\"~~H.i_Xjww10\"/><path id=\"face-pull-n-e-head\" d=\"~#w12wRj_Eg-*hB(fBjDjBjS9BbB3E3_4X4)7x8BbRhKm_4XcT1T9Bj0NmBbHmK6!kF3Dj(fT1Fj0001010100001000000000101000000002000000000000100002200000020000\"/><path id=\"face-pull-n-e-torso\" d=\"~#_12wxi_)kTHiIRjR9K6B30S9ShU9N6YcwgN60I6)nKm)7Xc_4(f-4_kI6NmxgShRh_4R9)7xgBrBz1EbBrG60V90!cwgA3w8Xc)7)fw8K6_kN6J6_cBbA3w8zT2ww100012101000100000000000220022000122000100000000100000000000001001000000022101200000010000000001010000000001000020000\"/><path id=\"face-pull-n-e-thigh.r\" d=\"^15\"/><path id=\"face-pull-n-e-kneecap.r\" d=\"^16\"/><path id=\"face-pull-n-e-shank.r\" d=\"^17\"/><path id=\"face-pull-n-e-foot.r\" d=\"^18\"/><path id=\"face-pull-n-e-shcap.r\" d=\"^19\"/><path id=\"face-pull-n-e-upper.r\" d=\"^20\"/><path id=\"face-pull-n-e-elbowcap.r\" d=\"^21\"/><path id=\"face-pull-n-e-fore.r\" d=\"^22\"/><path id=\"face-pull-n-e-fist.r\" d=\"^23\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#face-pull-n-dots)\"/>\n  <path class=\"floorline\" d=\"M34.17 339.5H343.49\"/><path class=\"eq\" d=\"~MF(-1Pwy2L0OT.1Q0E6E6FK.1L)qF6QE60wrF6LF6FK.1Q0F6F6EK.1LwrE6QF60)qE6Z\"/><path class=\"eq\" d=\"~MJEy2Pwy2L0OT.1Q0E6E6FK.1L*qF6QE60(qF6LF6FK.1Q0F6F6EK.1L(qE6QF60*qE6Z\"/><path class=\"eq\" d=\"~MYWY1U*7LJH90QF60zA9E6LE6zA1Q0E6E6AA1LzA9F6QE60AA9F6LF6AA1Q0F6F6zA1Z\"/><path class=\"eq\" d=\"~M()W1YDy2LyYc0QF60-RcE6LE6B3Q0E6E6D3L-RcF6QE60_RcF6LF6D3Q0F6F6B3Z\"/><path class=\"eq\" d=\"~MUK_1YDy2LU!50QF60IW5E6LE6zA1Q0E6E6AA1LIW5F6QE60JW5F6LF6AA1Q0F6F6zA1Z\"/><path class=\"eq-thin\" d=\"~MUO.1!Ow2L0VKl\"/><path class=\"eq-thin\" d=\"~MHF)1!Ow2L0VKl\"/><path class=\"eq\" d=\"~MJE_1HI-1LAG60LzG6SA7LzG6RA7Z\"/><path class=\"eq-thin\" d=\"M298.14 326.57H330.32M298.14 322.91H330.32M298.14 319.25H330.32M298.14 315.59H330.32M298.14 311.94H330.32M298.14 308.28H330.32M298.14 304.62H330.32M298.14 300.97H330.32M298.14 297.31H330.32\"/><path class=\"eq-solid\" d=\"~~W--1_XjAG12\"/><path class=\"eq-pin\" d=\"~~S!_1_XjF60\"/><path class=\"eq\" d=\"~~(I!1y-8ww10\"/><path class=\"eq-pin\" d=\"~~WB*1y-8F60\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#face-pull-n-st-shcap.l\"/><use href=\"#face-pull-n-st-upper.l\"/><use href=\"#face-pull-n-st-elbowcap.l\"/><use href=\"#face-pull-n-st-fore.l\"/><use href=\"#face-pull-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#face-pull-n-st-shcap.l\"/><use href=\"#face-pull-n-st-upper.l\"/><use href=\"#face-pull-n-st-elbowcap.l\"/><use href=\"#face-pull-n-st-fore.l\"/><use href=\"#face-pull-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#face-pull-n-st-shcap.r\"/><use href=\"#face-pull-n-st-upper.r\"/><use href=\"#face-pull-n-st-elbowcap.r\"/><use href=\"#face-pull-n-st-fore.r\"/><use href=\"#face-pull-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#face-pull-n-st-shcap.r\"/><use href=\"#face-pull-n-st-upper.r\"/><use href=\"#face-pull-n-st-elbowcap.r\"/><use href=\"#face-pull-n-st-fore.r\"/><use href=\"#face-pull-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-cable\" d=\"~MJ*_1yOiL**k!Y2\"/><path class=\"eq-solid\" d=\"~#H12(wD1JTl)EE1XGld.27)15R1DeK1xk(3HA1!3K6K7_6Ea(2*2F9B1W3w2A9A8B4!8Dy1KcBk(3FeK15R17)13bGA1wu001210020000000000000012100002000012002200000010000002021000100020000000021000022000\"/><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq-solid\" d=\"~MAwE1wIlLIJ1FdLPF1EH1LDS1FuZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#face-pull-n-g0-shcap.r\"/><use href=\"#face-pull-n-g0-upper.r\"/><use href=\"#face-pull-n-g0-elbowcap.r\"/><use href=\"#face-pull-n-g0-fore.r\"/><use href=\"#face-pull-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#face-pull-n-g0-shcap.r\"/><use href=\"#face-pull-n-g0-upper.r\"/><use href=\"#face-pull-n-g0-elbowcap.r\"/><use href=\"#face-pull-n-g0-fore.r\"/><use href=\"#face-pull-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-cable\" d=\"~MY)_1_NiLIErJw2\"/><path class=\"eq-solid\" d=\"~#H12D-vU_kI(w1KTk7.21z25O1Jdh)iY2!x1y6T5-7!6-9w3X2U8jN3H2D8U8K4U8Ww1Ia)iY2Hdh1R13)11bVz1Sr220200012012100002200010002000000000021002020010101010011000201000000000001010000000\"/><path class=\"eq-solid\" d=\"^44\"/><path class=\"eq-solid\" d=\"~M_Yw1AUkLxK1UaL(H1-E1LFP1Ax1Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#face-pull-n-g1-shcap.r\"/><use href=\"#face-pull-n-g1-upper.r\"/><use href=\"#face-pull-n-g1-elbowcap.r\"/><use href=\"#face-pull-n-g1-fore.r\"/><use href=\"#face-pull-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#face-pull-n-g1-shcap.r\"/><use href=\"#face-pull-n-g1-upper.r\"/><use href=\"#face-pull-n-g1-elbowcap.r\"/><use href=\"#face-pull-n-g1-fore.r\"/><use href=\"#face-pull-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MJE_1ySy1LAG60LzG6AG4LzG6zG4Z\"/><path class=\"eq-thin\" d=\"M298.14 195.26H330.32M298.14 191.6H330.32M298.14 187.94H330.32M298.14 184.28H330.32M298.14 180.63H330.32\"/><path class=\"eq-cable\" d=\"~M(I!1_XjL0X(aMww1ww1L0w-o\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#face-pull-n-e-thigh.l\"/><use href=\"#face-pull-n-e-kneecap.l\"/><use href=\"#face-pull-n-e-shank.l\"/><use href=\"#face-pull-n-e-foot.l\"/><use href=\"#face-pull-n-e-shcap.l\"/><use href=\"#face-pull-n-e-upper.l\"/><use href=\"#face-pull-n-e-elbowcap.l\"/><use href=\"#face-pull-n-e-fore.l\"/><use href=\"#face-pull-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#face-pull-n-e-thigh.l\"/><use href=\"#face-pull-n-e-kneecap.l\"/><use href=\"#face-pull-n-e-shank.l\"/><use href=\"#face-pull-n-e-foot.l\"/><use href=\"#face-pull-n-e-shcap.l\"/><use href=\"#face-pull-n-e-upper.l\"/><use href=\"#face-pull-n-e-elbowcap.l\"/><use href=\"#face-pull-n-e-fore.l\"/><use href=\"#face-pull-n-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"~MHJpwSjLAVx1Gz1\"/><path class=\"eq-cable\" d=\"~MNx.1WNiLzVx1Hz1\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#face-pull-n-e-head\"/><use href=\"#face-pull-n-e-torso\"/><use href=\"#face-pull-n-e-thigh.r\"/><use href=\"#face-pull-n-e-kneecap.r\"/><use href=\"#face-pull-n-e-shank.r\"/><use href=\"#face-pull-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#face-pull-n-e-head\"/><use href=\"#face-pull-n-e-torso\"/><use href=\"#face-pull-n-e-thigh.r\"/><use href=\"#face-pull-n-e-kneecap.r\"/><use href=\"#face-pull-n-e-shank.r\"/><use href=\"#face-pull-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~#H12WJpS*j*NqxYj3.21)11T1Hc2Rh(1!uP7*4x8U6K9_2T2(79y3P2D7w9I4H8Hu-8Rh!1Hc03O10x20bTx1yq100200121000002000000001001010000210000000000010110001000000000000001000210000001001\"/><path class=\"eq-solid\" d=\"^51\"/><path class=\"eq-solid\" d=\"~MPJqHYjLKK1Y8LPJ1*B1L!N1wz1Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#face-pull-n-e-shcap.r\"/><use href=\"#face-pull-n-e-upper.r\"/><use href=\"#face-pull-n-e-elbowcap.r\"/><use href=\"#face-pull-n-e-fore.r\"/><use href=\"#face-pull-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#face-pull-n-e-shcap.r\"/><use href=\"#face-pull-n-e-upper.r\"/><use href=\"#face-pull-n-e-elbowcap.r\"/><use href=\"#face-pull-n-e-fore.r\"/><use href=\"#face-pull-n-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"~MJzJ1(AmLXE1NdLj.2Ld*1LbR1LUe-2LRk(5LyD1aLE7.6LA6-aL!2E3LP9z2L(3Y1LDaA7LT3H9LJy1.fLOkw6LUe-2L9R1Lf*1L1bLGz1Nx1\"/><circle class=\"joint\" cx=\"95.61\" cy=\"134.37\" r=\"2.25\"/><circle class=\"joint\" cx=\"100.6\" cy=\"106.86\" r=\"2.25\"/><circle class=\"joint\" cx=\"100\" cy=\"203.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"103.29\" cy=\"266.13\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#D20!Fz1P_mTUz1-!m0102010002010201000201020100020102010012210201000201020100020102010000012100200121002000000101000001010000000001010000110110001000110110001101100010000121002001210020002001210020010100000000010100000101000002\"/><path class=\"arrow\" d=\"~M_Fl(wkLNF1xbL-O1!O1Z\"/></g><path class=\"leader\" d=\"M91.11 120.62L75.5 130H65.5\"/><circle class=\"anchor\" cx=\"91.11\" cy=\"120.62\" r=\"1.5\"/><path class=\"leader\" d=\"M129.97 100.16L141 52H151\"/><circle class=\"anchor\" cx=\"129.97\" cy=\"100.16\" r=\"1.5\"/><path class=\"leader\" d=\"M118.43 148.45L159 194H169\"/><circle class=\"anchor\" cx=\"118.43\" cy=\"148.45\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"face-pull-n-high\" data-key=\"high\" data-cue=\"Keep the elbows high and wide for the whole rep.\" class=\"plate-callout two\" style=\"left:2.23%;top:30.17%\" aria-pressed=\"true\">Elbows<br>high</button><button type=\"button\" id=\"face-pull-n-face\" data-key=\"face\" data-cue=\"Pull the rope toward your face at eye level, not the chin.\" class=\"plate-callout two\" style=\"left:40.78%;top:8.38%\" aria-pressed=\"false\">Rope<br>to face</button><button type=\"button\" id=\"face-pull-n-still\" data-key=\"still\" data-cue=\"Keep the chest up and the body still and stable.\" class=\"plate-callout\" style=\"left:45.81%;top:48.04%\" aria-pressed=\"false\">Body still</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"face-pull-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"face-pull-m-st-shcap.l\" d=\"^0\"/><path id=\"face-pull-m-st-upper.l\" d=\"^1\"/><path id=\"face-pull-m-st-elbowcap.l\" d=\"^2\"/><path id=\"face-pull-m-st-fore.l\" d=\"^3\"/><path id=\"face-pull-m-st-fist.l\" d=\"^4\"/><path id=\"face-pull-m-st-shcap.r\" d=\"^0\"/><path id=\"face-pull-m-st-upper.r\" d=\"^1\"/><path id=\"face-pull-m-st-elbowcap.r\" d=\"^2\"/><path id=\"face-pull-m-st-fore.r\" d=\"^3\"/><path id=\"face-pull-m-st-fist.r\" d=\"^4\"/><path id=\"face-pull-m-g0-shcap.r\" d=\"^5\"/><path id=\"face-pull-m-g0-upper.r\" d=\"^6\"/><path id=\"face-pull-m-g0-elbowcap.r\" d=\"^7\"/><path id=\"face-pull-m-g0-fore.r\" d=\"^8\"/><path id=\"face-pull-m-g0-fist.r\" d=\"^9\"/><path id=\"face-pull-m-g1-shcap.r\" d=\"^10\"/><path id=\"face-pull-m-g1-upper.r\" d=\"^11\"/><path id=\"face-pull-m-g1-elbowcap.r\" d=\"^12\"/><path id=\"face-pull-m-g1-fore.r\" d=\"^13\"/><path id=\"face-pull-m-g1-fist.r\" d=\"^14\"/><path id=\"face-pull-m-e-thigh.l\" d=\"^15\"/><path id=\"face-pull-m-e-kneecap.l\" d=\"^16\"/><path id=\"face-pull-m-e-shank.l\" d=\"^17\"/><path id=\"face-pull-m-e-foot.l\" d=\"^18\"/><path id=\"face-pull-m-e-shcap.l\" d=\"^19\"/><path id=\"face-pull-m-e-upper.l\" d=\"^20\"/><path id=\"face-pull-m-e-elbowcap.l\" d=\"^21\"/><path id=\"face-pull-m-e-fore.l\" d=\"^22\"/><path id=\"face-pull-m-e-fist.l\" d=\"^23\"/><path id=\"face-pull-m-e-head\" d=\"^24\"/><path id=\"face-pull-m-e-torso\" d=\"^25\"/><path id=\"face-pull-m-e-thigh.r\" d=\"^15\"/><path id=\"face-pull-m-e-kneecap.r\" d=\"^16\"/><path id=\"face-pull-m-e-shank.r\" d=\"^17\"/><path id=\"face-pull-m-e-foot.r\" d=\"^18\"/><path id=\"face-pull-m-e-shcap.r\" d=\"^19\"/><path id=\"face-pull-m-e-upper.r\" d=\"^20\"/><path id=\"face-pull-m-e-elbowcap.r\" d=\"^21\"/><path id=\"face-pull-m-e-fore.r\" d=\"^22\"/><path id=\"face-pull-m-e-fist.r\" d=\"^23\"/><path id=\"face-pull-m-m-upper.l\" d=\"~#F12w)hDSrOwh.wrR7R467HH1_jV3O5.1T2BuTmXbVhReV7Gl0Oz1IcG31R60wF1yo18)7V3z9Pdygyo!jUa(s520101000000100120000000001000000001000200002002001000000000000020000002002010000\"/><path id=\"face-pull-m-m-elbowcap.l\" d=\"~~(TpwRuDz10\"/><path id=\"face-pull-m-m-fore.l\" d=\"~#F12!_rwFuV*rG)ueW8x1G1EcBy1O1J8z1H2P5YnR3we_2!aY9YaJ6Nnw2S1J5U6K5.z1aX1_3(7wbF2J5Rlz4Vg)eIg01000101010001000010000000100100200000001000000100111001000000120000020022020011\"/><path id=\"face-pull-m-m-fist.l\" d=\"~~UXnUUmww10\"/><path id=\"face-pull-m-m-upper.r\" d=\"^59\"/><path id=\"face-pull-m-m-elbowcap.r\" d=\"^60\"/><path id=\"face-pull-m-m-fore.r\" d=\"^61\"/><path id=\"face-pull-m-m-fist.r\" d=\"^62\"/><path id=\"face-pull-m-m-eq0\" d=\"~#H12wAvFEm*Hw1)*l9*27x27O1DeG1xk_3AA1D4I6O7!6Baw3.2A9z1U3A2A9D8I4_8Ay1xc)jW3yeE15O15x23bIA1St000101010000100000000000001000000000021200002200200000002001001200000200001000002202\"/><path id=\"face-pull-m-m-eq1\" d=\"^63\"/><path id=\"face-pull-m-m-eq2\" d=\"~MFzw1D)lLOJ1_cLwG1-G1LYR1WuZ\"/><path id=\"face-pull-m-mf-head\" d=\"^24\"/><path id=\"face-pull-m-mf-torso\" d=\"^25\"/><path id=\"face-pull-m-mf-thigh.l\" d=\"^15\"/><path id=\"face-pull-m-mf-kneecap.l\" d=\"^16\"/><path id=\"face-pull-m-mf-shank.l\" d=\"^17\"/><path id=\"face-pull-m-mf-foot.l\" d=\"^18\"/><path id=\"face-pull-m-mf-shcap.l\" d=\"^19\"/><path id=\"face-pull-m-mf-thigh.r\" d=\"^15\"/><path id=\"face-pull-m-mf-kneecap.r\" d=\"^16\"/><path id=\"face-pull-m-mf-shank.r\" d=\"^17\"/><path id=\"face-pull-m-mf-foot.r\" d=\"^18\"/><path id=\"face-pull-m-mf-shcap.r\" d=\"^19\"/><path id=\"face-pull-m-mo-0\" d=\"^24\"/><path id=\"face-pull-m-mo-1\" d=\"^25\"/><path id=\"face-pull-m-mo-2\" d=\"^15\"/><path id=\"face-pull-m-mo-3\" d=\"^16\"/><path id=\"face-pull-m-mo-4\" d=\"^17\"/><path id=\"face-pull-m-mo-5\" d=\"^18\"/><path id=\"face-pull-m-mo-6\" d=\"^19\"/><path id=\"face-pull-m-mo-7\" d=\"^20\"/><path id=\"face-pull-m-mo-8\" d=\"^21\"/><path id=\"face-pull-m-mo-9\" d=\"^22\"/><path id=\"face-pull-m-mo-10\" d=\"^23\"/><path id=\"face-pull-m-mo-11\" d=\"^15\"/><path id=\"face-pull-m-mo-12\" d=\"^16\"/><path id=\"face-pull-m-mo-13\" d=\"^17\"/><path id=\"face-pull-m-mo-14\" d=\"^18\"/><path id=\"face-pull-m-mo-15\" d=\"^19\"/><path id=\"face-pull-m-mo-16\" d=\"^20\"/><path id=\"face-pull-m-mo-17\" d=\"^21\"/><path id=\"face-pull-m-mo-18\" d=\"^22\"/><path id=\"face-pull-m-mo-19\" d=\"^23\"/><path id=\"face-pull-m-mo-20\" d=\"^27\"/><path id=\"face-pull-m-mo-21\" d=\"^28\"/><path id=\"face-pull-m-mo-22\" d=\"^29\"/><path id=\"face-pull-m-mo-23\" d=\"^30\"/><path id=\"face-pull-m-mo-24\" d=\"^31\"/><path id=\"face-pull-m-mo-25\" d=\"^34\"/><path id=\"face-pull-m-mo-26\" d=\"^46\"/><path id=\"face-pull-m-mo-27\" d=\"^36\"/><path id=\"face-pull-m-mo-28\" d=\"^37\"/><path id=\"face-pull-m-mo-29\" d=\"^38\"/><path id=\"face-pull-m-mo-30\" d=\"^39\"/><path id=\"face-pull-m-mo-31\" d=\"^51\"/><path id=\"face-pull-m-mo-32\" d=\"^51\"/><path id=\"face-pull-m-mo-33\" d=\"^52\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#face-pull-m-dots)\"/>\n  <path class=\"floorline\" d=\"^26\"/><path class=\"eq\" d=\"^27\"/><path class=\"eq\" d=\"^28\"/><path class=\"eq\" d=\"^29\"/><path class=\"eq\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq-thin\" d=\"^32\"/><path class=\"eq-thin\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq-thin\" d=\"^35\"/><path class=\"eq-solid\" d=\"^36\"/><path class=\"eq-pin\" d=\"^37\"/><path class=\"eq\" d=\"^38\"/><path class=\"eq-pin\" d=\"^39\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#face-pull-m-st-shcap.l\"/><use href=\"#face-pull-m-st-upper.l\"/><use href=\"#face-pull-m-st-elbowcap.l\"/><use href=\"#face-pull-m-st-fore.l\"/><use href=\"#face-pull-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#face-pull-m-st-shcap.l\"/><use href=\"#face-pull-m-st-upper.l\"/><use href=\"#face-pull-m-st-elbowcap.l\"/><use href=\"#face-pull-m-st-fore.l\"/><use href=\"#face-pull-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#face-pull-m-st-shcap.r\"/><use href=\"#face-pull-m-st-upper.r\"/><use href=\"#face-pull-m-st-elbowcap.r\"/><use href=\"#face-pull-m-st-fore.r\"/><use href=\"#face-pull-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#face-pull-m-st-shcap.r\"/><use href=\"#face-pull-m-st-upper.r\"/><use href=\"#face-pull-m-st-elbowcap.r\"/><use href=\"#face-pull-m-st-fore.r\"/><use href=\"#face-pull-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-cable\" d=\"^40\"/><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq-solid\" d=\"^42\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#face-pull-m-g0-shcap.r\"/><use href=\"#face-pull-m-g0-upper.r\"/><use href=\"#face-pull-m-g0-elbowcap.r\"/><use href=\"#face-pull-m-g0-fore.r\"/><use href=\"#face-pull-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#face-pull-m-g0-shcap.r\"/><use href=\"#face-pull-m-g0-upper.r\"/><use href=\"#face-pull-m-g0-elbowcap.r\"/><use href=\"#face-pull-m-g0-fore.r\"/><use href=\"#face-pull-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-cable\" d=\"^43\"/><path class=\"eq-solid\" d=\"^44\"/><path class=\"eq-solid\" d=\"^44\"/><path class=\"eq-solid\" d=\"^45\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#face-pull-m-g1-shcap.r\"/><use href=\"#face-pull-m-g1-upper.r\"/><use href=\"#face-pull-m-g1-elbowcap.r\"/><use href=\"#face-pull-m-g1-fore.r\"/><use href=\"#face-pull-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#face-pull-m-g1-shcap.r\"/><use href=\"#face-pull-m-g1-upper.r\"/><use href=\"#face-pull-m-g1-elbowcap.r\"/><use href=\"#face-pull-m-g1-fore.r\"/><use href=\"#face-pull-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^46\"/><path class=\"eq-thin\" d=\"^47\"/><path class=\"eq-cable\" d=\"^48\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#face-pull-m-e-thigh.l\"/><use href=\"#face-pull-m-e-kneecap.l\"/><use href=\"#face-pull-m-e-shank.l\"/><use href=\"#face-pull-m-e-foot.l\"/><use href=\"#face-pull-m-e-shcap.l\"/><use href=\"#face-pull-m-e-upper.l\"/><use href=\"#face-pull-m-e-elbowcap.l\"/><use href=\"#face-pull-m-e-fore.l\"/><use href=\"#face-pull-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#face-pull-m-e-thigh.l\"/><use href=\"#face-pull-m-e-kneecap.l\"/><use href=\"#face-pull-m-e-shank.l\"/><use href=\"#face-pull-m-e-foot.l\"/><use href=\"#face-pull-m-e-shcap.l\"/><use href=\"#face-pull-m-e-upper.l\"/><use href=\"#face-pull-m-e-elbowcap.l\"/><use href=\"#face-pull-m-e-fore.l\"/><use href=\"#face-pull-m-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"^49\"/><path class=\"eq-cable\" d=\"^50\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#face-pull-m-e-head\"/><use href=\"#face-pull-m-e-torso\"/><use href=\"#face-pull-m-e-thigh.r\"/><use href=\"#face-pull-m-e-kneecap.r\"/><use href=\"#face-pull-m-e-shank.r\"/><use href=\"#face-pull-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#face-pull-m-e-head\"/><use href=\"#face-pull-m-e-torso\"/><use href=\"#face-pull-m-e-thigh.r\"/><use href=\"#face-pull-m-e-kneecap.r\"/><use href=\"#face-pull-m-e-shank.r\"/><use href=\"#face-pull-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^51\"/><path class=\"eq-solid\" d=\"^51\"/><path class=\"eq-solid\" d=\"^52\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#face-pull-m-e-shcap.r\"/><use href=\"#face-pull-m-e-upper.r\"/><use href=\"#face-pull-m-e-elbowcap.r\"/><use href=\"#face-pull-m-e-fore.r\"/><use href=\"#face-pull-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#face-pull-m-e-shcap.r\"/><use href=\"#face-pull-m-e-upper.r\"/><use href=\"#face-pull-m-e-elbowcap.r\"/><use href=\"#face-pull-m-e-fore.r\"/><use href=\"#face-pull-m-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"^53\"/><circle class=\"joint\" cx=\"95.61\" cy=\"134.37\" r=\"2.25\"/><circle class=\"joint\" cx=\"100.6\" cy=\"106.86\" r=\"2.25\"/><circle class=\"joint\" cx=\"100\" cy=\"203.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"103.29\" cy=\"266.13\" r=\"2.25\"/></g><mask id=\"face-pull-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#face-pull-m-mf-head\" fill=\"#000\"/><use href=\"#face-pull-m-mf-torso\" fill=\"#000\"/><use href=\"#face-pull-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#face-pull-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#face-pull-m-mf-shank.l\" fill=\"#000\"/><use href=\"#face-pull-m-mf-foot.l\" fill=\"#000\"/><use href=\"#face-pull-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#face-pull-m-m-upper.l\" fill=\"#000\"/><use href=\"#face-pull-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#face-pull-m-m-fore.l\" fill=\"#000\"/><use href=\"#face-pull-m-m-fist.l\" fill=\"#000\"/><use href=\"#face-pull-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#face-pull-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#face-pull-m-mf-shank.r\" fill=\"#000\"/><use href=\"#face-pull-m-mf-foot.r\" fill=\"#000\"/><use href=\"#face-pull-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#face-pull-m-m-upper.r\" fill=\"#000\"/><use href=\"#face-pull-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#face-pull-m-m-fore.r\" fill=\"#000\"/><use href=\"#face-pull-m-m-fist.r\" fill=\"#000\"/><use href=\"#face-pull-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#face-pull-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#face-pull-m-mmask)\"><g class=\"u-stroke\"><use href=\"#face-pull-m-m-upper.l\"/><use href=\"#face-pull-m-m-elbowcap.l\"/><use href=\"#face-pull-m-m-fore.l\"/><use href=\"#face-pull-m-m-fist.l\"/><use href=\"#face-pull-m-m-upper.r\"/><use href=\"#face-pull-m-m-elbowcap.r\"/><use href=\"#face-pull-m-m-fore.r\"/><use href=\"#face-pull-m-m-fist.r\"/><use href=\"#face-pull-m-m-eq0\"/><use href=\"#face-pull-m-m-eq1\"/><use href=\"#face-pull-m-m-eq2\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MY--1(_jLzXq!w2\"/><path class=\"leader m\" d=\"M136.83 156.32L145 226H155\"/><path class=\"leader m\" d=\"M126.66 115.94L159 178H169\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"face-pull-m-drop\" data-key=\"drop\" data-cue=\"The elbows drop below shoulder height during the pull.\" class=\"plate-callout two m\" style=\"left:41.9%;top:56.98%\" aria-pressed=\"true\">Elbows<br>drop</button><button type=\"button\" id=\"face-pull-m-low\" data-key=\"low\" data-cue=\"The rope is pulled too low, to the chin, not the face.\" class=\"plate-callout two m\" style=\"left:45.81%;top:43.58%\" aria-pressed=\"false\">Pulled<br>to chin</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "high",
        cues: [{ key: "high", cue: "Keep the elbows high and wide for the whole rep." }, { key: "face", cue: "Pull the rope toward your face at eye level, not the chin." }, { key: "still", cue: "Keep the chest up and the body still and stable." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "drop",
        cues: [{ key: "drop", cue: "The elbows drop below shoulder height during the pull." }, { key: "low", cue: "The rope is pulled too low, to the chin, not the face." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Elbows drop</b><span>The elbows drop below shoulder height during the pull.</span></li><li><b>Pulled to chin</b><span>The rope is pulled too low, to the chin, not the face.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 2 seconds, hold 1 second, return 3 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:3 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>3 s</span></div></div></div>",
      alt: "Face pull, side view. Standing tall facing a cable column with the pulley at eye height, the lifter pulls a rope from extended arms to the face, the hands finishing by the ears with the elbows high and wide.",
      mistakeAlt: "Face Pull: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "pull",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW6: the rope key's GAPS reason is stale and the card refuses rope-rule c1 (no sourced contact); the grip copy carries c2.",
    "orientation": "neutral",
    "handle": "rope",
    "width": {
      "text": "Set by the rope. The ends separate as you pull.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-face-pull",
          "bb-face-pull",
          "sl-face-pull"
        ],
        "note": "c6, c7"
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
        "note": "card grip.thumb: the pull archetype default, no face-pull source; golden B's pull default, not a card claim, never shown"
      }
    },
    "contact": "finger-base",
    "wrist": {
      "exempt": "Card grip.wrist: pull archetype default only; no source gives a wrist range for this exercise.",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "pull-default"
        ],
        "note": "card grip.wrist: pull archetype default only; no source gives a wrist range, so none is taken and nothing is shown (D-SHIP-W6-WRISTEXEMPT)"
      }
    },
    "faults": [],
    "gripLine": "Hands on the ends of the rope, palms facing each other. Pull the ends apart and squeeze your shoulder blades.",
    "cue": "Elbows high, rope to your face."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Attach a rope to the cable at about head height.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-face-pull",
          "bb-face-pull",
          "sl-face-pull"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "grip",
      "text": "Hands on the ends of the rope, palms facing each other.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-face-pull",
          "bb-face-pull",
          "sl-face-pull"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "position",
      "text": "Step back until your arms are straight, with tension.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-face-pull",
          "sl-face-pull"
        ],
        "note": "c2, c3"
      }
    },
    {
      "kind": "position",
      "text": "Stand up straight, feet hip-width apart.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-face-pull",
          "mo-face-pull"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "brace",
      "text": "Lift your chest, shoulders back. Neutral spine, no arching.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-face-pull",
          "sl-face-pull"
        ],
        "note": "c4, c12"
      }
    }
  ],
  posture: [
    {
      "key": "elbows",
      "label": "Elbows high",
      "detail": "Keep your elbows high and wide.",
      "anchor": {
        "at": "elbow.r",
        "pose": "end"
      },
      "zoom": "fp-elbows",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-face-pull",
          "sl-face-pull",
          "bb-face-pull"
        ],
        "note": "c5, c9"
      }
    },
    {
      "key": "face",
      "label": "Rope to face",
      "detail": "Pull toward your face at eye level.",
      "anchor": {
        "at": "grip.r",
        "pose": "end"
      },
      "zoom": "fp-height",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-face-pull",
          "sl-face-pull"
        ],
        "note": "c5, c10"
      }
    },
    {
      "key": "apart",
      "label": "Ends apart",
      "detail": "Pull the rope ends apart as you pull.",
      "anchor": {
        "at": "grip.r",
        "pose": "end"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-face-pull",
          "bb-face-pull",
          "sl-face-pull"
        ],
        "note": "c6"
      }
    },
    {
      "key": "squeeze",
      "label": "Blades together",
      "detail": "Squeeze the shoulder blades together.",
      "anchor": {
        "at": "backUpper",
        "pose": "end"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-face-pull",
          "bb-face-pull",
          "sl-face-pull"
        ],
        "note": "c6"
      }
    },
    {
      "key": "still",
      "label": "Body still",
      "detail": "Keep your whole body still.",
      "anchor": {
        "at": "chest",
        "pose": "end"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-face-pull",
          "sl-face-pull"
        ],
        "note": "c4"
      }
    },
    {
      "key": "spine",
      "label": "Neutral spine",
      "detail": "Neutral spine, no arching.",
      "anchor": {
        "at": "backMid",
        "pose": "end"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-face-pull"
        ],
        "note": "c12"
      }
    }
  ],
  zooms: [
    {
      "key": "fp-elbows",
      "chip": "Elbows",
      "heading": "Elbow height",
      "kind": "posture",
      "feelRow": "pinch"
    },
    {
      "key": "fp-height",
      "chip": "Rope height",
      "heading": "Rope height",
      "kind": "posture"
    }
  ],
  chips: [
    "fp-elbows",
    "fp-height",
    "feel"
  ],
  copy: {
    "setupLine": "Attach a rope at about head height. Hold the ends, palms facing each other.",
    "mistakeLine": "Keep your elbows high. Never let them drop below your shoulders.",
    "cueLine": "Elbows high, rope to your face."
  },
  mistakes: [
    {
      "key": "drop",
      "title": "Dropping the elbows",
      "zoom": "fp-elbows",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-face-pull",
          "bb-face-pull"
        ],
        "note": "c9"
      },
      "fix": "Keep your elbows high."
    },
    {
      "key": "low",
      "title": "Pulling too low",
      "zoom": "fp-height",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-face-pull",
          "mo-face-pull"
        ],
        "note": "c10"
      },
      "fix": "Pull toward your face, not your chest or chin."
    },
    {
      "key": "momentum",
      "title": "Momentum from the torso",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-face-pull",
          "sl-face-pull",
          "bb-face-pull"
        ],
        "note": "c11, c4"
      },
      "fix": "Start light and keep your whole body still."
    }
  ],
  risks: [
    {
      "key": "pinch",
      "text": "Dropped elbows can pinch the shoulder.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-face-pull",
          "bb-face-pull"
        ],
        "note": "c9"
      }
    },
    {
      "key": "pain",
      "text": "Shoulder pain means stop.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-face-pull",
          "bb-face-pull"
        ],
        "note": "c13"
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
    "mo-face-pull",
    "bb-face-pull",
    "sl-face-pull",
    "zhu-2025",
    "ga-pull-base",
    "pull-default",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/face_pull.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

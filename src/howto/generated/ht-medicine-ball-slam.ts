// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=507e2bb300103bcca383f38bd43929bbcc0d4b99afb9d7f1def7e2e27c9dc0b6
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_medicine_ball_slam",
  name: "Medicine Ball Slam",
  hashes: { inputsSha256: "507e2bb300103bcca383f38bd43929bbcc0d4b99afb9d7f1def7e2e27c9dc0b6", golden: "40d6af26e650158eab5d5809607bdcd4870f66f17b451c77a10ebf924d06377a" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"medicine-ball-slam-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"medicine-ball-slam-n-st-thigh.l\" d=\"~#F12wAy1F!D1KAy1xRB1l.az13)1P-1A6V6Y2G3Y6EP1Ad*jW1KiI9*lw2VP1z2-3.4T7E8(Y1A12S2RaKrIdInPz1*2Yw1UgAE100010000000000010110002000000000020010100000000000000200000010010000000100000001\"/><path id=\"medicine-ball-slam-n-st-kneecap.l\" d=\"~~_wy1!ES1yG11\"/><path id=\"medicine-ball-slam-n-st-shank.l\" d=\"~#F12W)x1SyS1KFy1xYP1(2RaA16V2W-1H6K6(2E3D4E*1D8RbJ1.ax5BdwbK!1x2*3O4X7TbUY1z137)axdD9-e(kK2YjD9!n02110100000000101000001000000000002000210100000200000000010120000200000000111020\"/><path id=\"medicine-ball-slam-n-st-foot.l\" d=\"~#o2Sxy1wA!1Rxz1X_.1D6JaHgF6(vy1D.1(X1-K1-U1Ij)tGfTfTt-nD1OfSpNb-uw2002000001000001000000210020001000002201210000101\"/><path id=\"medicine-ball-slam-n-st-shcap.l\" d=\"~~A(y1_WqwJ11\"/><path id=\"medicine-ball-slam-n-st-upper.l\" d=\"~#F12yWB1AWqXVB1TWr7A890.2GI1-2P5G1W2T4wz1)8Hh8yfS9whY5_y1N1W2(2H5P1GI1a0gA8!esDcOnbTk.cBn00010010100101000001010000001000200000100000010000000000000010000100020011000110\"/><path id=\"medicine-ball-slam-n-st-elbowcap.l\" d=\"~~NBz1yFiFw10\"/><path id=\"medicine-ball-slam-n-st-fore.l\" d=\"~#F12JEB1SFiEAB1RxjV1A9lT1R2*D1K3H8K1y2rytO6Ub5HaD6_b3ytN1A2D3J8Y3XD1oT1J1A9H9u(9Xh8-fI9xi10000000000001100000200000100212100000001100000000000200000110000200020010100010\"/><path id=\"medicine-ball-slam-n-st-fist.l\" d=\"~~YJz1AP9Ht0\"/><path id=\"medicine-ball-slam-n-st-head\" d=\"~#w12yHA1WRhz.y1.FhThShTh_8Ba*2)2J4I4G7G7EazgRkN4VbO1X8Th1SkEaPk.5yj(2ShWeK1Sh0010001000000000010020002020000000100010010100010000000000000002\"/><path id=\"medicine-ball-slam-n-st-torso\" d=\"~#_12A(y1(!l*Dz1KSkX8.5)20!8DgY8_5WbUe(52.5xmRkE7VbJ4UeK4yj-5SkVeygzgN4X8I7Ve.oEw1Ea.o.51-82YbUe(2H7XbG7VeH7-5yj!5!5WbEa(2H7BJ2Ht10000010020000000010110000010000000000000000000000000002000000002002200100000001000000001010000000220010101010000010\"/><path id=\"medicine-ball-slam-n-st-thigh.r\" d=\"^0\"/><path id=\"medicine-ball-slam-n-st-kneecap.r\" d=\"^1\"/><path id=\"medicine-ball-slam-n-st-shank.r\" d=\"^2\"/><path id=\"medicine-ball-slam-n-st-foot.r\" d=\"^3\"/><path id=\"medicine-ball-slam-n-st-shcap.r\" d=\"^4\"/><path id=\"medicine-ball-slam-n-st-upper.r\" d=\"^5\"/><path id=\"medicine-ball-slam-n-st-elbowcap.r\" d=\"^6\"/><path id=\"medicine-ball-slam-n-st-fore.r\" d=\"^7\"/><path id=\"medicine-ball-slam-n-st-fist.r\" d=\"^8\"/><path id=\"medicine-ball-slam-n-g0-shcap.r\" d=\"~~SNz1PJy1wJ11\"/><path id=\"medicine-ball-slam-n-g0-upper.r\" d=\"~#F12WYA1NYz1EYz1BWz1z8n29JI1bG5x3T2O1Ty1X6-g.9)ejRhN8zz1_3V2D1T5W2HI1w43ax82-1Ye!mSdPks(nTb10000020000100000000002000121022000111100001011000200010000020000100000011010010\"/><path id=\"medicine-ball-slam-n-g0-elbowcap.r\" d=\"~~(FJ1(Xy1Fw10\"/><path id=\"medicine-ball-slam-n-g0-fore.r\" d=\"~#F12_EK1U-z1.NJ1.Vz1B9.1_1l_D1T1z8R3x2R1xtT1IbV6Gad*bY5ztnx2N1R8_2YD1!4S1mB9F1B1D9ShJaYfmHi*800121020001000002000000000020000000000100200000111002000110000000100000000000100\"/><path id=\"medicine-ball-slam-n-g0-fist.r\" d=\"~~NzV1Jzz1Ht0\"/><path id=\"medicine-ball-slam-n-e-thigh.l\" d=\"~#F12_.ry*W1ESq-TW1TaR19A1wX1Udz5G7V2I3TJ1Gg.g)gThO5OnU4xN1-bz4H1I8D3DV1Yj8z1R9V4Kj(n!tDuNvY9WG1z800002000200100000002000000010001000000000000002000000000102002101000200002020000\"/><path id=\"medicine-ball-slam-n-e-kneecap.l\" d=\"~~S-B1HyY1yG11\"/><path id=\"medicine-ball-slam-n-e-shank.l\" d=\"~#F12!yD1(BX1zyE1zFW1N8*6qo*y1YK1!8X1F4tAD1VO1Fd.4H7B8J3VdAI1BI1iI4k*8OG1YE1rn(5z9Xf0xoY8Gd_ex6(o00210110101010010000020000001000000002110100011000012000000000002000001010000000\"/><path id=\"medicine-ball-slam-n-e-foot.l\" d=\"~#o2U-uJK)1TGvxP(1Sb!2(fE7An)l_P2*2BB2I4Vy1I7Tl0RB1N4xaXbyqEaGkPn010100200200000000002001000100000200202000000200\"/><path id=\"medicine-ball-slam-n-e-shcap.l\" d=\"~~NJz1(SI1wJ11\"/><path id=\"medicine-ball-slam-n-e-upper.l\" d=\"~#F12!Jz1UJI1ISz1IJH1S1x882x4NI1U3)4Y1K2FaBy1SbTfA2*eT6Gi5Rz1r*2z2-5K8_H170qB8Tex3XfHl*2Jky9wp00011100101110100020000000000210000020000000210101100000200101001000000002000200\"/><path id=\"medicine-ball-slam-n-e-elbowcap.l\" d=\"~~DRy1SwU1Fw10\"/><path id=\"medicine-ball-slam-n-e-fore.l\" d=\"~#F12WOy1wwU1XSy1zHT1W1)7kP1Y2(x1H3B7P1-1oInP6Rb4Gax6Xb1InK1.1z3I7X3wy1nJ1I1)7E9x4*9Yh7_fJ9yi00000210000121101010001000000000000002000101000000021000100002001010101000200022\"/><path id=\"medicine-ball-slam-n-e-fist.l\" d=\"~~HPy1JV.1Ht0\"/><path id=\"medicine-ball-slam-n-e-head\" d=\"~#w12_.H1NYA1V(G1TSz1.oJ1)iz5T5x9z5H1S1I8N1OcU1xqyb-5_4R7zdVbDmw6AjJ9Hc_eF3WmXcAc0000000002012100000000000211011101000000000000001000011000200000\"/><path id=\"medicine-ball-slam-n-e-torso\" d=\"~#_12F(D1!yE1BxF1xGD1R2BaE2)1z4!hS2FatYiH4!3FaGkIaxjTbT4_dS6AiH8ypY2YmG1A9R3J4-f!2VF1(8IpG4*3R6-5x1WiV2N7.3EdXfG4zhFagH8Sf4X2P7EJ2xt10200000000100000000211000010020002000000000000100011000002001000010100000000010101000000020000000200010100002200100\"/><path id=\"medicine-ball-slam-n-e-thigh.r\" d=\"^16\"/><path id=\"medicine-ball-slam-n-e-kneecap.r\" d=\"^17\"/><path id=\"medicine-ball-slam-n-e-shank.r\" d=\"^18\"/><path id=\"medicine-ball-slam-n-e-foot.r\" d=\"^19\"/><path id=\"medicine-ball-slam-n-e-shcap.r\" d=\"^20\"/><path id=\"medicine-ball-slam-n-e-upper.r\" d=\"^21\"/><path id=\"medicine-ball-slam-n-e-elbowcap.r\" d=\"^22\"/><path id=\"medicine-ball-slam-n-e-fore.r\" d=\"^23\"/><path id=\"medicine-ball-slam-n-e-fist.r\" d=\"^24\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#medicine-ball-slam-n-dots)\"/>\n  <path class=\"floorline\" d=\"M64.8 339.5H279.2\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#medicine-ball-slam-n-st-thigh.l\"/><use href=\"#medicine-ball-slam-n-st-kneecap.l\"/><use href=\"#medicine-ball-slam-n-st-shank.l\"/><use href=\"#medicine-ball-slam-n-st-foot.l\"/><use href=\"#medicine-ball-slam-n-st-shcap.l\"/><use href=\"#medicine-ball-slam-n-st-upper.l\"/><use href=\"#medicine-ball-slam-n-st-elbowcap.l\"/><use href=\"#medicine-ball-slam-n-st-fore.l\"/><use href=\"#medicine-ball-slam-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#medicine-ball-slam-n-st-thigh.l\"/><use href=\"#medicine-ball-slam-n-st-kneecap.l\"/><use href=\"#medicine-ball-slam-n-st-shank.l\"/><use href=\"#medicine-ball-slam-n-st-foot.l\"/><use href=\"#medicine-ball-slam-n-st-shcap.l\"/><use href=\"#medicine-ball-slam-n-st-upper.l\"/><use href=\"#medicine-ball-slam-n-st-elbowcap.l\"/><use href=\"#medicine-ball-slam-n-st-fore.l\"/><use href=\"#medicine-ball-slam-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#medicine-ball-slam-n-st-head\"/><use href=\"#medicine-ball-slam-n-st-torso\"/><use href=\"#medicine-ball-slam-n-st-thigh.r\"/><use href=\"#medicine-ball-slam-n-st-kneecap.r\"/><use href=\"#medicine-ball-slam-n-st-shank.r\"/><use href=\"#medicine-ball-slam-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#medicine-ball-slam-n-st-head\"/><use href=\"#medicine-ball-slam-n-st-torso\"/><use href=\"#medicine-ball-slam-n-st-thigh.r\"/><use href=\"#medicine-ball-slam-n-st-kneecap.r\"/><use href=\"#medicine-ball-slam-n-st-shank.r\"/><use href=\"#medicine-ball-slam-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#medicine-ball-slam-n-st-shcap.r\"/><use href=\"#medicine-ball-slam-n-st-upper.r\"/><use href=\"#medicine-ball-slam-n-st-elbowcap.r\"/><use href=\"#medicine-ball-slam-n-st-fore.r\"/><use href=\"#medicine-ball-slam-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#medicine-ball-slam-n-st-shcap.r\"/><use href=\"#medicine-ball-slam-n-st-upper.r\"/><use href=\"#medicine-ball-slam-n-st-elbowcap.r\"/><use href=\"#medicine-ball-slam-n-st-fore.r\"/><use href=\"#medicine-ball-slam-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"~#P12yx-1Jzz1GA-1G!z1I6W1V5H3T4U4G3W5V1J60P6Y1J6D3W5Y4U4U5H3H6W1U60H6X1U5B3Y4X4D3T5Y1G60T6V1G6G3T5T4X4V5B3I6X1000110101000000010120000002002001000000010101100001110100000001002002000000010120000001010100100\"/><path class=\"eq\" d=\"~#P12PKT1WxA1TwT1RGA1066c6i8k8m8o8o8k8g2c26GtY52426286e2a6e6e2a680824010110002000000020000000000000200120010010010100200000101000100200100000002000101000210010000000\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#medicine-ball-slam-n-g0-shcap.r\"/><use href=\"#medicine-ball-slam-n-g0-upper.r\"/><use href=\"#medicine-ball-slam-n-g0-elbowcap.r\"/><use href=\"#medicine-ball-slam-n-g0-fore.r\"/><use href=\"#medicine-ball-slam-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#medicine-ball-slam-n-g0-shcap.r\"/><use href=\"#medicine-ball-slam-n-g0-upper.r\"/><use href=\"#medicine-ball-slam-n-g0-elbowcap.r\"/><use href=\"#medicine-ball-slam-n-g0-fore.r\"/><use href=\"#medicine-ball-slam-n-g0-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#medicine-ball-slam-n-e-thigh.l\"/><use href=\"#medicine-ball-slam-n-e-kneecap.l\"/><use href=\"#medicine-ball-slam-n-e-shank.l\"/><use href=\"#medicine-ball-slam-n-e-foot.l\"/><use href=\"#medicine-ball-slam-n-e-shcap.l\"/><use href=\"#medicine-ball-slam-n-e-upper.l\"/><use href=\"#medicine-ball-slam-n-e-elbowcap.l\"/><use href=\"#medicine-ball-slam-n-e-fore.l\"/><use href=\"#medicine-ball-slam-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#medicine-ball-slam-n-e-thigh.l\"/><use href=\"#medicine-ball-slam-n-e-kneecap.l\"/><use href=\"#medicine-ball-slam-n-e-shank.l\"/><use href=\"#medicine-ball-slam-n-e-foot.l\"/><use href=\"#medicine-ball-slam-n-e-shcap.l\"/><use href=\"#medicine-ball-slam-n-e-upper.l\"/><use href=\"#medicine-ball-slam-n-e-elbowcap.l\"/><use href=\"#medicine-ball-slam-n-e-fore.l\"/><use href=\"#medicine-ball-slam-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#medicine-ball-slam-n-e-head\"/><use href=\"#medicine-ball-slam-n-e-torso\"/><use href=\"#medicine-ball-slam-n-e-thigh.r\"/><use href=\"#medicine-ball-slam-n-e-kneecap.r\"/><use href=\"#medicine-ball-slam-n-e-shank.r\"/><use href=\"#medicine-ball-slam-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#medicine-ball-slam-n-e-head\"/><use href=\"#medicine-ball-slam-n-e-torso\"/><use href=\"#medicine-ball-slam-n-e-thigh.r\"/><use href=\"#medicine-ball-slam-n-e-kneecap.r\"/><use href=\"#medicine-ball-slam-n-e-shank.r\"/><use href=\"#medicine-ball-slam-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~#P12(KD1ND)1ERD1I))1E6W1X5H3T4U4G3Y5V1F60U6Y1F6D3Y5W4U4Y5H3F6W1U60F6V1Y5G3U4T4H3X5W1E60T6V1E6G3X5T4T4X5G3E6V1002000021000000210101100002100001200002002001000001101012000000120000200001210100100001001012100\"/><path class=\"eq\" d=\"~#P12J_w1YAw2RKw1TJw2464e6e8m8m8o8o8k8g2c26GtY524262a4a6c4e6e2a484804002000002001010000001000000000200120010010010100000000101000101001002000002002101000002002000000\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#medicine-ball-slam-n-e-shcap.r\"/><use href=\"#medicine-ball-slam-n-e-upper.r\"/><use href=\"#medicine-ball-slam-n-e-elbowcap.r\"/><use href=\"#medicine-ball-slam-n-e-fore.r\"/><use href=\"#medicine-ball-slam-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#medicine-ball-slam-n-e-shcap.r\"/><use href=\"#medicine-ball-slam-n-e-upper.r\"/><use href=\"#medicine-ball-slam-n-e-elbowcap.r\"/><use href=\"#medicine-ball-slam-n-e-fore.r\"/><use href=\"#medicine-ball-slam-n-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"~MJHE1AP9LE3*oLI6Y1LV5D3LT4W4LG3Y5LV1F6L0U6LY1F6LF3Y5LU4W4LW5D3LH6Y1LU60LH6V1LW5G3LU4T4LF3V5LY1I6L0O6LV1I6LG3V5LT4T4LV5G3LI6V1\"/><path class=\"eq-line m-line\" d=\"~M_Wx1NNaL!c.7L06L6eL6eL8mL8mL8oL8oLakL4gL4cL26LGtY5L24L26L2aL6aL2cL8gL2aL4cL6aL04L26\"/><circle class=\"joint\" cx=\"188.22\" cy=\"223.19\" r=\"2.25\"/><circle class=\"joint\" cx=\"181.99\" cy=\"266.33\" r=\"2.25\"/><circle class=\"joint\" cx=\"146.01\" cy=\"270.38\" r=\"2.25\"/><circle class=\"joint\" cx=\"200.09\" cy=\"287.09\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#W20PVD1SEaOPB1XW922I1!402*1Y401R2P410x3y400T3S302)3y312I4P200X4!122.4H111*4m10)4100*4l00-4I102R4)101E4O200-3x310G3T312-2)300G2G420X1R420x1X41002000000100200000101000210000000200001010022210102000001010001100020000001010002101000000000000000001010021010111100000202101010100000010000000100000101200010010001010000\"/><path class=\"arrow\" d=\"~MF-B1D*.1Lyq-w1LEa_y2Z\"/></g><path class=\"leader\" d=\"M170.52 48.66L146.95 66H136.95\"/><circle class=\"anchor\" cx=\"170.52\" cy=\"48.66\" r=\"1.5\"/><path class=\"leader\" d=\"~MJRpNUS1L0BW6\"/><circle class=\"anchor\" cx=\"130.78\" cy=\"259.27\" r=\"1.5\"/><path class=\"leader\" d=\"M167.82 220.67L140.41 158H130.41\"/><circle class=\"anchor\" cx=\"167.82\" cy=\"220.67\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"medicine-ball-slam-n-overhead\" data-key=\"overhead\" data-cue=\"Tall on your toes, arms straight, ball overhead.\" class=\"plate-callout\" style=\"left:8.38%;top:12.29%\" aria-pressed=\"true\">Ball overhead</button><button type=\"button\" id=\"medicine-ball-slam-n-hips\" data-key=\"hips\" data-cue=\"Press the hips back and bend the knees as you slam.\" class=\"plate-callout\" style=\"left:7.82%;top:53.63%\" aria-pressed=\"false\">Hips and knees</button><button type=\"button\" id=\"medicine-ball-slam-n-flat\" data-key=\"flat\" data-cue=\"Back flat as you slam.\" class=\"plate-callout\" style=\"left:15.64%;top:37.99%\" aria-pressed=\"false\">Flat back</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"medicine-ball-slam-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"medicine-ball-slam-m-st-thigh.l\" d=\"^0\"/><path id=\"medicine-ball-slam-m-st-kneecap.l\" d=\"^1\"/><path id=\"medicine-ball-slam-m-st-shank.l\" d=\"^2\"/><path id=\"medicine-ball-slam-m-st-foot.l\" d=\"^3\"/><path id=\"medicine-ball-slam-m-st-shcap.l\" d=\"^4\"/><path id=\"medicine-ball-slam-m-st-upper.l\" d=\"^5\"/><path id=\"medicine-ball-slam-m-st-elbowcap.l\" d=\"^6\"/><path id=\"medicine-ball-slam-m-st-fore.l\" d=\"^7\"/><path id=\"medicine-ball-slam-m-st-fist.l\" d=\"^8\"/><path id=\"medicine-ball-slam-m-st-head\" d=\"^9\"/><path id=\"medicine-ball-slam-m-st-torso\" d=\"^10\"/><path id=\"medicine-ball-slam-m-st-thigh.r\" d=\"^0\"/><path id=\"medicine-ball-slam-m-st-kneecap.r\" d=\"^1\"/><path id=\"medicine-ball-slam-m-st-shank.r\" d=\"^2\"/><path id=\"medicine-ball-slam-m-st-foot.r\" d=\"^3\"/><path id=\"medicine-ball-slam-m-st-shcap.r\" d=\"^4\"/><path id=\"medicine-ball-slam-m-st-upper.r\" d=\"^5\"/><path id=\"medicine-ball-slam-m-st-elbowcap.r\" d=\"^6\"/><path id=\"medicine-ball-slam-m-st-fore.r\" d=\"^7\"/><path id=\"medicine-ball-slam-m-st-fist.r\" d=\"^8\"/><path id=\"medicine-ball-slam-m-g0-shcap.r\" d=\"^11\"/><path id=\"medicine-ball-slam-m-g0-upper.r\" d=\"^12\"/><path id=\"medicine-ball-slam-m-g0-elbowcap.r\" d=\"^13\"/><path id=\"medicine-ball-slam-m-g0-fore.r\" d=\"^14\"/><path id=\"medicine-ball-slam-m-g0-fist.r\" d=\"^15\"/><path id=\"medicine-ball-slam-m-e-thigh.l\" d=\"^16\"/><path id=\"medicine-ball-slam-m-e-kneecap.l\" d=\"^17\"/><path id=\"medicine-ball-slam-m-e-shank.l\" d=\"^18\"/><path id=\"medicine-ball-slam-m-e-foot.l\" d=\"^19\"/><path id=\"medicine-ball-slam-m-e-shcap.l\" d=\"^20\"/><path id=\"medicine-ball-slam-m-e-upper.l\" d=\"^21\"/><path id=\"medicine-ball-slam-m-e-elbowcap.l\" d=\"^22\"/><path id=\"medicine-ball-slam-m-e-fore.l\" d=\"^23\"/><path id=\"medicine-ball-slam-m-e-fist.l\" d=\"^24\"/><path id=\"medicine-ball-slam-m-e-head\" d=\"^25\"/><path id=\"medicine-ball-slam-m-e-torso\" d=\"^26\"/><path id=\"medicine-ball-slam-m-e-thigh.r\" d=\"^16\"/><path id=\"medicine-ball-slam-m-e-kneecap.r\" d=\"^17\"/><path id=\"medicine-ball-slam-m-e-shank.r\" d=\"^18\"/><path id=\"medicine-ball-slam-m-e-foot.r\" d=\"^19\"/><path id=\"medicine-ball-slam-m-e-shcap.r\" d=\"^20\"/><path id=\"medicine-ball-slam-m-e-upper.r\" d=\"^21\"/><path id=\"medicine-ball-slam-m-e-elbowcap.r\" d=\"^22\"/><path id=\"medicine-ball-slam-m-e-fore.r\" d=\"^23\"/><path id=\"medicine-ball-slam-m-e-fist.r\" d=\"^24\"/><path id=\"medicine-ball-slam-m-m-head\" d=\"~#w12AHz1wYkK*x1BEkKkFe-iU5R9V4V3_3x3*7K5IbGcxnJ6Xa4*8Ih)2wmT6Flz2FiA6YeShO4wh0000100200000000000200100001010020200000000100002200000210000000\"/><path id=\"medicine-ball-slam-m-m-torso\" d=\"~#_12UDx1P-oTWx1BRnV7E7.2h_5NhW7F7w9Sg_5u)1Tm*i-aGcH2Df-1_jK2Ym.aUixd(5*7X4Tf.iBA1-5EqX5vV8R1w9NgU1Y7EaE9VfW4z9YhY4Y6Hd)7U1W7zP2Uf00020000010000000000222001001010010000111100000200001000201000002110120200000101010020002002000210100012100020002000\"/><path id=\"medicine-ball-slam-m-m-thigh.l\" d=\"~#F12DJt_(G1OFt-TF1X1Vaz10P3J-1P5E7N2O3y2XP1Abxl1OiIbxlT2RP1R2R3O5B7.2N-1D10S1XaTsVa.jSB16!w1HkJB111000000000100200000120010100000002000001200101101010100000010001011010100101000\"/><path id=\"medicine-ball-slam-m-m-kneecap.l\" d=\"~~PIuFBV1yG11\"/><path id=\"medicine-ball-slam-m-m-shank.l\" d=\"~#F12yHuABV1TKu.-T1W1.aA12H4W-1N5E7U2R3G3G*1Y6Kc0)aT6OcU3G*1R2T3I5B7V4U-1z10T1-a-bUazcUm3!jAcUm10101102001210101000000000000011000001000110110020101000000000000000021001000000\"/><path id=\"medicine-ball-slam-m-m-foot.l\" d=\"~#o2W-uJK)1XGvxP(1Sb!2(fE7Dnxm_P2.2BB2I4Vy1G7Rl1TB1N4)9XbyqBaIkJn010020000201101200000210000121100000200000010001\"/><path id=\"medicine-ball-slam-m-m-shcap.l\" d=\"~~FIw1WYtwJ11\"/><path id=\"medicine-ball-slam-m-m-upper.l\" d=\"~#F12ARw1WNuOxw1*RtX3G781YnUA19B63)2zdBx1jKjO7xdRgGaBm.rO2V1G5E3wk_D176O4*6GdU6qSqHaYhPmye21000000000001101000220000100020000101020000001210210101010111000000001110100001\"/><path id=\"medicine-ball-slam-m-m-elbowcap.l\" d=\"~~H)A1YAB1Fw10\"/><path id=\"medicine-ball-slam-m-m-fore.l\" d=\"~#F12HyB1UVB1-XA1)*A1I3)8N1D1Wm!w1O1x98R2-eIqbGdz5.8Gbx7Kf.pK2B1)6X5yhwA1a!1x6G7B8N4mJk!7WdFhWa00000000120000001000001010010100001010000010110020000000020000100100000000000000\"/><path id=\"medicine-ball-slam-m-m-fist.l\" d=\"~~URG1A*J1Ht0\"/><path id=\"medicine-ball-slam-m-m-thigh.r\" d=\"^41\"/><path id=\"medicine-ball-slam-m-m-kneecap.r\" d=\"^42\"/><path id=\"medicine-ball-slam-m-m-shank.r\" d=\"^43\"/><path id=\"medicine-ball-slam-m-m-foot.r\" d=\"^44\"/><path id=\"medicine-ball-slam-m-m-shcap.r\" d=\"^45\"/><path id=\"medicine-ball-slam-m-m-upper.r\" d=\"^46\"/><path id=\"medicine-ball-slam-m-m-elbowcap.r\" d=\"^47\"/><path id=\"medicine-ball-slam-m-m-fore.r\" d=\"^48\"/><path id=\"medicine-ball-slam-m-m-fist.r\" d=\"^49\"/><path id=\"medicine-ball-slam-m-mo-0\" d=\"^25\"/><path id=\"medicine-ball-slam-m-mo-1\" d=\"^26\"/><path id=\"medicine-ball-slam-m-mo-2\" d=\"^16\"/><path id=\"medicine-ball-slam-m-mo-3\" d=\"^17\"/><path id=\"medicine-ball-slam-m-mo-4\" d=\"^18\"/><path id=\"medicine-ball-slam-m-mo-5\" d=\"^19\"/><path id=\"medicine-ball-slam-m-mo-6\" d=\"^20\"/><path id=\"medicine-ball-slam-m-mo-7\" d=\"^21\"/><path id=\"medicine-ball-slam-m-mo-8\" d=\"^22\"/><path id=\"medicine-ball-slam-m-mo-9\" d=\"^23\"/><path id=\"medicine-ball-slam-m-mo-10\" d=\"^24\"/><path id=\"medicine-ball-slam-m-mo-11\" d=\"^16\"/><path id=\"medicine-ball-slam-m-mo-12\" d=\"^17\"/><path id=\"medicine-ball-slam-m-mo-13\" d=\"^18\"/><path id=\"medicine-ball-slam-m-mo-14\" d=\"^19\"/><path id=\"medicine-ball-slam-m-mo-15\" d=\"^20\"/><path id=\"medicine-ball-slam-m-mo-16\" d=\"^21\"/><path id=\"medicine-ball-slam-m-mo-17\" d=\"^22\"/><path id=\"medicine-ball-slam-m-mo-18\" d=\"^23\"/><path id=\"medicine-ball-slam-m-mo-19\" d=\"^24\"/><path id=\"medicine-ball-slam-m-mo-20\" d=\"^30\"/><path id=\"medicine-ball-slam-m-mo-21\" d=\"^31\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#medicine-ball-slam-m-dots)\"/>\n  <path class=\"floorline\" d=\"^27\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#medicine-ball-slam-m-st-thigh.l\"/><use href=\"#medicine-ball-slam-m-st-kneecap.l\"/><use href=\"#medicine-ball-slam-m-st-shank.l\"/><use href=\"#medicine-ball-slam-m-st-foot.l\"/><use href=\"#medicine-ball-slam-m-st-shcap.l\"/><use href=\"#medicine-ball-slam-m-st-upper.l\"/><use href=\"#medicine-ball-slam-m-st-elbowcap.l\"/><use href=\"#medicine-ball-slam-m-st-fore.l\"/><use href=\"#medicine-ball-slam-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#medicine-ball-slam-m-st-thigh.l\"/><use href=\"#medicine-ball-slam-m-st-kneecap.l\"/><use href=\"#medicine-ball-slam-m-st-shank.l\"/><use href=\"#medicine-ball-slam-m-st-foot.l\"/><use href=\"#medicine-ball-slam-m-st-shcap.l\"/><use href=\"#medicine-ball-slam-m-st-upper.l\"/><use href=\"#medicine-ball-slam-m-st-elbowcap.l\"/><use href=\"#medicine-ball-slam-m-st-fore.l\"/><use href=\"#medicine-ball-slam-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#medicine-ball-slam-m-st-head\"/><use href=\"#medicine-ball-slam-m-st-torso\"/><use href=\"#medicine-ball-slam-m-st-thigh.r\"/><use href=\"#medicine-ball-slam-m-st-kneecap.r\"/><use href=\"#medicine-ball-slam-m-st-shank.r\"/><use href=\"#medicine-ball-slam-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#medicine-ball-slam-m-st-head\"/><use href=\"#medicine-ball-slam-m-st-torso\"/><use href=\"#medicine-ball-slam-m-st-thigh.r\"/><use href=\"#medicine-ball-slam-m-st-kneecap.r\"/><use href=\"#medicine-ball-slam-m-st-shank.r\"/><use href=\"#medicine-ball-slam-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#medicine-ball-slam-m-st-shcap.r\"/><use href=\"#medicine-ball-slam-m-st-upper.r\"/><use href=\"#medicine-ball-slam-m-st-elbowcap.r\"/><use href=\"#medicine-ball-slam-m-st-fore.r\"/><use href=\"#medicine-ball-slam-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#medicine-ball-slam-m-st-shcap.r\"/><use href=\"#medicine-ball-slam-m-st-upper.r\"/><use href=\"#medicine-ball-slam-m-st-elbowcap.r\"/><use href=\"#medicine-ball-slam-m-st-fore.r\"/><use href=\"#medicine-ball-slam-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"^28\"/><path class=\"eq\" d=\"^29\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#medicine-ball-slam-m-g0-shcap.r\"/><use href=\"#medicine-ball-slam-m-g0-upper.r\"/><use href=\"#medicine-ball-slam-m-g0-elbowcap.r\"/><use href=\"#medicine-ball-slam-m-g0-fore.r\"/><use href=\"#medicine-ball-slam-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#medicine-ball-slam-m-g0-shcap.r\"/><use href=\"#medicine-ball-slam-m-g0-upper.r\"/><use href=\"#medicine-ball-slam-m-g0-elbowcap.r\"/><use href=\"#medicine-ball-slam-m-g0-fore.r\"/><use href=\"#medicine-ball-slam-m-g0-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#medicine-ball-slam-m-e-thigh.l\"/><use href=\"#medicine-ball-slam-m-e-kneecap.l\"/><use href=\"#medicine-ball-slam-m-e-shank.l\"/><use href=\"#medicine-ball-slam-m-e-foot.l\"/><use href=\"#medicine-ball-slam-m-e-shcap.l\"/><use href=\"#medicine-ball-slam-m-e-upper.l\"/><use href=\"#medicine-ball-slam-m-e-elbowcap.l\"/><use href=\"#medicine-ball-slam-m-e-fore.l\"/><use href=\"#medicine-ball-slam-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#medicine-ball-slam-m-e-thigh.l\"/><use href=\"#medicine-ball-slam-m-e-kneecap.l\"/><use href=\"#medicine-ball-slam-m-e-shank.l\"/><use href=\"#medicine-ball-slam-m-e-foot.l\"/><use href=\"#medicine-ball-slam-m-e-shcap.l\"/><use href=\"#medicine-ball-slam-m-e-upper.l\"/><use href=\"#medicine-ball-slam-m-e-elbowcap.l\"/><use href=\"#medicine-ball-slam-m-e-fore.l\"/><use href=\"#medicine-ball-slam-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#medicine-ball-slam-m-e-head\"/><use href=\"#medicine-ball-slam-m-e-torso\"/><use href=\"#medicine-ball-slam-m-e-thigh.r\"/><use href=\"#medicine-ball-slam-m-e-kneecap.r\"/><use href=\"#medicine-ball-slam-m-e-shank.r\"/><use href=\"#medicine-ball-slam-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#medicine-ball-slam-m-e-head\"/><use href=\"#medicine-ball-slam-m-e-torso\"/><use href=\"#medicine-ball-slam-m-e-thigh.r\"/><use href=\"#medicine-ball-slam-m-e-kneecap.r\"/><use href=\"#medicine-ball-slam-m-e-shank.r\"/><use href=\"#medicine-ball-slam-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#medicine-ball-slam-m-e-shcap.r\"/><use href=\"#medicine-ball-slam-m-e-upper.r\"/><use href=\"#medicine-ball-slam-m-e-elbowcap.r\"/><use href=\"#medicine-ball-slam-m-e-fore.r\"/><use href=\"#medicine-ball-slam-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#medicine-ball-slam-m-e-shcap.r\"/><use href=\"#medicine-ball-slam-m-e-upper.r\"/><use href=\"#medicine-ball-slam-m-e-elbowcap.r\"/><use href=\"#medicine-ball-slam-m-e-fore.r\"/><use href=\"#medicine-ball-slam-m-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"^32\"/><path class=\"eq-line m-line\" d=\"^33\"/><circle class=\"joint\" cx=\"188.22\" cy=\"223.19\" r=\"2.25\"/><circle class=\"joint\" cx=\"181.99\" cy=\"266.33\" r=\"2.25\"/><circle class=\"joint\" cx=\"146.01\" cy=\"270.38\" r=\"2.25\"/><circle class=\"joint\" cx=\"200.09\" cy=\"287.09\" r=\"2.25\"/></g><mask id=\"medicine-ball-slam-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#medicine-ball-slam-m-m-head\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-torso\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-thigh.l\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-shank.l\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-foot.l\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-shcap.l\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-upper.l\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-fore.l\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-fist.l\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-thigh.r\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-shank.r\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-foot.r\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-shcap.r\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-upper.r\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-fore.r\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-m-fist.r\" fill=\"#000\"/><use href=\"#medicine-ball-slam-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#medicine-ball-slam-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#medicine-ball-slam-m-mmask)\"><g class=\"u-stroke\"><use href=\"#medicine-ball-slam-m-m-head\"/><use href=\"#medicine-ball-slam-m-m-torso\"/><use href=\"#medicine-ball-slam-m-m-thigh.l\"/><use href=\"#medicine-ball-slam-m-m-kneecap.l\"/><use href=\"#medicine-ball-slam-m-m-shank.l\"/><use href=\"#medicine-ball-slam-m-m-foot.l\"/><use href=\"#medicine-ball-slam-m-m-shcap.l\"/><use href=\"#medicine-ball-slam-m-m-upper.l\"/><use href=\"#medicine-ball-slam-m-m-elbowcap.l\"/><use href=\"#medicine-ball-slam-m-m-fore.l\"/><use href=\"#medicine-ball-slam-m-m-fist.l\"/><use href=\"#medicine-ball-slam-m-m-thigh.r\"/><use href=\"#medicine-ball-slam-m-m-kneecap.r\"/><use href=\"#medicine-ball-slam-m-m-shank.r\"/><use href=\"#medicine-ball-slam-m-m-foot.r\"/><use href=\"#medicine-ball-slam-m-m-shcap.r\"/><use href=\"#medicine-ball-slam-m-m-upper.r\"/><use href=\"#medicine-ball-slam-m-m-elbowcap.r\"/><use href=\"#medicine-ball-slam-m-m-fore.r\"/><use href=\"#medicine-ball-slam-m-m-fist.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MFXx1WYtLHF4yJ7Ly7Hc\"/><path class=\"leader m\" d=\"~M(NH1A*J1L0!(1\"/><path class=\"leader m\" d=\"~Mw*rSVG1Lzx2G2\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"medicine-ball-slam-m-arms\" data-key=\"arms\" data-cue=\"The arms slam the ball on their own.\" class=\"plate-callout m\" style=\"left:58.1%;top:63.97%\" aria-pressed=\"true\">Arms only</button><button type=\"button\" id=\"medicine-ball-slam-m-legs\" data-key=\"legs\" data-cue=\"The hips and knees stay straight instead of bending.\" class=\"plate-callout m\" style=\"left:8.38%;top:53.35%\" aria-pressed=\"false\">Legs straight</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "overhead",
        cues: [{ key: "overhead", cue: "Tall on your toes, arms straight, ball overhead." }, { key: "hips", cue: "Press the hips back and bend the knees as you slam." }, { key: "flat", cue: "Back flat as you slam." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "arms",
        cues: [{ key: "arms", cue: "The arms slam the ball on their own." }, { key: "legs", cue: "The hips and knees stay straight instead of bending." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Arms only</b><span>The arms slam the ball on their own.</span></li><li><b>Legs straight</b><span>The hips and knees stay straight instead of bending.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: slam\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Slam</b><span>&nbsp;</span></div></div></div>",
      alt: "Medicine ball slam, side view. Tall on the toes with the ball overhead in straight arms, then the ball slammed to the floor between the feet with the hips pressed back, the knees bent and the back flat.",
      mistakeAlt: "Medicine Ball Slam: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP (b3): the card gives no thumb, hand contact or wrist (pinned \"Not given\" statements); grip claims c15 and c1 and the hand zoom Right are on setup 4."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "load",
      "text": "Use a soft ball without much bounce.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "vit-slam",
          "pg-mb",
          "ace-os",
          "bodbot-mb-slam"
        ],
        "note": "card c9"
      }
    },
    {
      "kind": "safety",
      "text": "Check the space around you is safe.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "vit-slam",
          "pg-mb",
          "ace-os",
          "bodbot-mb-slam"
        ],
        "note": "card c9"
      }
    },
    {
      "kind": "position",
      "text": "Feet about shoulder-width apart, knees slightly bent.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slam",
          "bodbot-mb-slam",
          "ace-os"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "grip",
      "text": "Hold the ball firmly in both hands at chest height.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hl-slam",
          "bodbot-mb-slam",
          "sl-slam",
          "ace-os"
        ],
        "note": "card c15, c1"
      }
    },
    {
      "kind": "brace",
      "text": "Ball overhead, arms straight. Brace, exhale, slam it hard between your feet.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slam",
          "bodbot-mb-slam",
          "ace-os",
          "bb-slam",
          "vit-slam",
          "im-slam"
        ],
        "note": "card c1, c2, c3, c7, c16"
      }
    }
  ],
  posture: [
    {
      "key": "top",
      "label": "Ball overhead",
      "detail": "Rise onto your toes, arms straight, ball overhead.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slam",
          "bodbot-mb-slam",
          "vit-slam"
        ],
        "note": "card c2"
      }
    },
    {
      "key": "slam",
      "label": "Slam down",
      "detail": "Slam the ball straight down between your feet.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slam",
          "bb-slam",
          "ace-os"
        ],
        "note": "card c3"
      }
    },
    {
      "key": "hips",
      "label": "Hips and knees",
      "detail": "Press your hips back and bend your knees as you slam.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "zoom": "slam-hips",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slam",
          "bb-slam",
          "ace-os"
        ],
        "note": "card c3"
      }
    },
    {
      "key": "back",
      "label": "Back flat",
      "detail": "Keep your back flat.",
      "anchor": {
        "pose": "end",
        "at": "backMid"
      },
      "zoom": "pickup-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-slam",
          "ace-heavy",
          "ace-os"
        ],
        "note": "card c5"
      }
    },
    {
      "key": "pickup",
      "label": "Squat down",
      "detail": "Squat down to pick up the ball.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "pickup-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slam",
          "bodbot-mb-slam",
          "ace-heavy"
        ],
        "note": "card c6, c5"
      }
    },
    {
      "key": "breathe",
      "label": "Breathe out",
      "detail": "Exhale as you slam the ball down.",
      "anchor": {
        "pose": "start",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slam",
          "vit-slam",
          "im-slam"
        ],
        "note": "card c7"
      }
    },
    {
      "key": "hm-soft",
      "label": "Slamming too softly",
      "detail": "Slam it down with as much force as possible.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slam",
          "bb-slam",
          "ace-os",
          "vit-slam"
        ],
        "note": "card c3, c16"
      }
    },
    {
      "key": "hm-arms",
      "label": "Arms only",
      "detail": "Press your hips back and bend your knees as you slam.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "slam-hips",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slam",
          "bb-slam",
          "ace-os",
          "vit-slam",
          "bodbot-mb-slam"
        ],
        "note": "card c3, c4"
      }
    },
    {
      "key": "hm-round",
      "label": "Rounding the back",
      "detail": "Keep your back flat and hinge from the hips.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "zoom": "pickup-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-slam",
          "ace-heavy",
          "ace-os"
        ],
        "note": "card c5"
      }
    }
  ],
  zooms: [
    {
      "key": "slam-hips",
      "chip": "Hips",
      "heading": "Hips and knees",
      "kind": "posture"
    },
    {
      "key": "pickup-back",
      "chip": "Back",
      "heading": "Flat back",
      "kind": "posture"
    }
  ],
  chips: [
    "slam-hips",
    "pickup-back",
    "feel"
  ],
  copy: {
    "setupLine": "Hold a soft ball firmly in both hands at chest height, feet shoulder-width.",
    "mistakeLine": "Never slam with the arms only: press your hips back and bend your knees.",
    "cueLine": "Hips back, back flat."
  },
  mistakes: [],
  risks: [
    {
      "key": "face",
      "text": "A bouncy ball can fly back up into your face.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-slam-ben",
          "im-slam",
          "pg-mb",
          "vit-slam"
        ],
        "note": "card c8, c9"
      }
    },
    {
      "key": "toes",
      "text": "Take care not to throw the ball onto your toes.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "pg-mb"
        ],
        "note": "card c10"
      }
    },
    {
      "key": "space",
      "text": "A bouncing ball needs ample space around you.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "vit-slam",
          "pg-mb",
          "ace-os",
          "bodbot-mb-slam"
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
    "bb-slam",
    "bb-slam-ben",
    "sl-slam",
    "ace-os",
    "ace-heavy",
    "vit-slam",
    "bodbot-mb-slam",
    "im-slam",
    "pg-mb",
    "hl-slam",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/medicine_ball_slam.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

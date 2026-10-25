// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=45f57cad039d5db74376b4759a4a1f9aff7612c7cb093f5a35606aa8606215a8
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_leg_press",
  name: "Leg Press (45°)",
  hashes: { inputsSha256: "45f57cad039d5db74376b4759a4a1f9aff7612c7cb093f5a35606aa8606215a8", golden: "c441fcc806598fc3335d845b98674cae21e27bc15cf9619b2d2a4c864390198f" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"leg-press-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"leg-press-n-st-thigh.l\" d=\"~#F12H.uSPV1Bwu.WW1z6Aaw1qHB1xS1T9A2R4F1Xz1_D1BoW9*cPfG5Sp.vwH19_4fY9YH1RK1vp*8Y7FgHtyI1GhwnRrN9IK101000000000010021002000020000000000111001100000110022000101000200020000000000201\"/><path id=\"leg-press-n-st-kneecap.l\" d=\"~~UKz1DUH1_J10\"/><path id=\"leg-press-n-st-shank.l\" d=\"~#F12UVB1_-I1BKA1KSJ1TaP5lx1AP1XF1.97-42)T1FH1Ifw2T9y7-6!dKY1DA1R1P4*2N9(V1.w1muO8N8whS3WrV3UhXcHcBp10000200000210000010000200000022000010100010111010000001000002000012000000200000\"/><path id=\"leg-press-n-st-foot.l\" d=\"~#o2SFN1PXA1EAK1VYA1O3GcIfVaBx1R9xN1GG2!w1Uy2WbyA1SbAkFoJw1X5YfRnOiwx1w6011000000001110000000021010012100002100000000000\"/><path id=\"leg-press-n-st-thigh.r\" d=\"^0\"/><path id=\"leg-press-n-st-kneecap.r\" d=\"^1\"/><path id=\"leg-press-n-st-shank.r\" d=\"^2\"/><path id=\"leg-press-n-st-foot.r\" d=\"^3\"/><path id=\"leg-press-n-g0-thigh.r\" d=\"~#F12HDvw)U1RWuXHW1B3HbD1gJmX-1T8U4z4H2XnFN1Xk_fG8NiW1wqzjHP1uU4F2S9Ws.W1z1hO6!9HnDo_A1xs!e-w1x3EN100101000200001000001110000000002001010000000000000101100010210010100002001002002\"/><path id=\"leg-press-n-g0-kneecap.r\" d=\"~~FTw1S)F1_J10\"/><path id=\"leg-press-n-g0-shank.r\" d=\"~#F12FPy1wIH1Vyx1*XH1XbN2bB1H-1RqK9-2V4B1K*1_qGfx2EbD4BaSbxw2!jX2(3E5H8W!1IheD1Ka_5Jf(7_r_3HkT7Si)k10001000200000000000000100000010000001000000002000001010100010000000001010000002\"/><path id=\"leg-press-n-g0-foot.r\" d=\"~#o2AwK1_)B1-.I1*wD1K3GcKfXaBx1O9xN1IG2(w1Uy2SbyA1SbykHoNw1V5YfVnRiyx1w6200000020002000200000001111010002022001010000100\"/><path id=\"leg-press-n-g1-thigh.r\" d=\"~#F12JHv(TU1TxvGxW1I1SbF1cAdz!1-7_5V3(2Eg_P1)h_iK5NjU5PpEbAS1S1N4Y3w9_jE_1E19X4UaSqUkyw1Kx1W9Ty1zaBK101000120000100010110100020000001101000002000000020000101112000011010000200022000\"/><path id=\"leg-press-n-g1-kneecap.r\" d=\"~~U_uUKF1_J10\"/><path id=\"leg-press-n-g1-shank.r\" d=\"~#F12YPw1y.G1Xxv.wH1)bk5E1S!1Gh.8I4I4-1Xw2wh-eI4XbJ2.b(9By2Y9G3N3R6N7U(1-78D1BbA4(dFa!qy8FlK4Pl.h00021000001000000100001001000210000200000001011110002020000000000220000001000200\"/><path id=\"leg-press-n-g1-foot.r\" d=\"~#o2WXI1DFE1GTH1EGE1O3GcIfXaGx1T9)K1GG2(w1Uy2SbyA1SbykHoNw1X5UfTnOiyx1A6200111002010110000020001011000002021000220020000\"/><path id=\"leg-press-n-g2-thigh.r\" d=\"~#F12HJvUHU1EGvKYV14PbD18U5*!1)6W6G3H3xawS1Tf!k*2wk_8Uox5US1A2D4_4P8Pc*.1E15O3yb(sPhWrBB1J5Rz1VfTI100210002000020200000011010000000000200000110000200010101000000010010010020020020\"/><path id=\"leg-press-n-g2-kneecap.r\" d=\"~~yJtYBF1_J10\"/><path id=\"leg-press-n-g2-shank.r\" d=\"~#F12P!uwUG1EKt*TG1*br1E1F(1X9I8G5x4O2Ey2w9zeE6*bu)cH8-y2S1V3w3G7S6!(114F1RbY2Pc!bUpFbUlV1Unzf00000000202000001000000000200101012000000000010100011100000020210001000101000000\"/><path id=\"leg-press-n-g2-foot.r\" d=\"~#o2FOH1PPF1.HG1ORF1K3GcKfXaEx1T9xN1IG2!w1Sy2UbAA1SbwkHoPw1X5UfVnRiAx1A6200000000200000000010100020000002000000000012000\"/><path id=\"leg-press-n-e-thigh.l\" d=\"~#F12AKvNyU1)NvzPV1J1NbD10t-!1E6H7*2U3T4NS1EdNmrDkNbPneSS1S2(3U5_7w6R!1B13I2JbWuNeSn.E1P1.z1Bk-G102000011100002010110110220200000000022000000120010020000000000000000020000002000\"/><path id=\"leg-press-n-e-kneecap.l\" d=\"~~HzsSzF1_J10\"/><path id=\"leg-press-n-e-shank.l\" d=\"~#F12WNt(RG1-)rXJG1XbB24B1Y(1)2T7B6.3.2Ty2W1IdV7)bb-d!6Ky2X5)3S2*7_5J(1Y62F1.bN1AbDdDo(dYloApRc10001022000001000000100000000000000001000001000020100020001101012110110020210110\"/><path id=\"leg-press-n-e-foot.l\" d=\"~#o2_DG1_YG1KyF1X-G1I3EcOf-aEx1V9xN1IG2(w1Sy2PbyA1UbykHoNw1X5WfXnViDx1F6200002200020000200000000120020002000101000002000\"/><path id=\"leg-press-n-e-shcap.l\" d=\"~~F_fHEK1wP10\"/><path id=\"leg-press-n-e-upper.l\" d=\"~#F12_)gAWN1BAg)NN1.6*14bUB1w6)3x4*1)1Onzbxg*dzgR3KkY5)p0T2uI5y2WA1Ua3ax7z1Rbwe(lwj!l!4ws-710020000010010120000012000000010020000010000001200220010000000101000000001000010\"/><path id=\"leg-press-n-e-elbowcap.l\" d=\"~~AOnD.N1Dz10\"/><path id=\"leg-press-n-e-fore.l\" d=\"~#F12Y)n(_O1IJnxJO1-6x6_18Dy1!fB5z7tI2EmRdR7GcV9X5KefXmXcR2cV8vSu(ly1P1R8x3O8_6Sb(i!eW8Dmq00010022002001000002100000101010000002001010000000010000210101200000000000000002\"/><path id=\"leg-press-n-e-fist.l\" d=\"~~_.u!zT1ww10\"/><path id=\"leg-press-n-e-head\" d=\"~#w12Jy9WXE1z*7x!F1W4UqB3Hl)8H7A2J5G9j-d2IsU1-7GbX8z4)aUfW3VoS7xmUeBfyoR6_eHc0210011000200000200200101002001010022021000002000100201010000000\"/><path id=\"leg-press-n-e-torso\" d=\"~#_12JzcFWI1.yb-TH1.7S5f9Jj6Hax5Fkz3F3R5)nK6BiJfB2Sd!3Gg_4ElV2IrI6)n)5)8Xhx1BJ1w6xt*3E3P5-4J8Fkz3S8F1GdA7z1_h!e(f_bn.1*jF5cKlSW211100001010022101200002000000000000002000100010000000000100020100200010010100000000020000200012000011000200020000000\"/><path id=\"leg-press-n-e-thigh.r\" d=\"^16\"/><path id=\"leg-press-n-e-kneecap.r\" d=\"^17\"/><path id=\"leg-press-n-e-shank.r\" d=\"^18\"/><path id=\"leg-press-n-e-foot.r\" d=\"^19\"/><path id=\"leg-press-n-e-shcap.r\" d=\"^20\"/><path id=\"leg-press-n-e-upper.r\" d=\"^21\"/><path id=\"leg-press-n-e-elbowcap.r\" d=\"^22\"/><path id=\"leg-press-n-e-fore.r\" d=\"^23\"/><path id=\"leg-press-n-e-fist.r\" d=\"^24\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#leg-press-n-dots)\"/>\n  <path class=\"floorline\" d=\"M31.51 339.77H338.71\"/><path class=\"eq\" d=\"~MySgNFy2L(xi0QPc0KVhOcLOcuQ0OcOctLKVhPcQOc0NVhPcLPctQ0PcPcuZ\"/><path class=\"eq\" d=\"~MUWi!zx2LWk0QPc0B8OcLOc*AbQ0OcOc(AbLB8PcQOc0D8PcLPc(AbQ0PcPc*AbZ\"/><path class=\"eq\" d=\"~M_Nu!zx2LYk0QPc0E8OcLOcEB6Q0OcOcFB6LE8PcQOc0F8PcLPcFB6Q0PcPcEB6Z\"/><path class=\"eq\" d=\"~M_.v!zT1LGiN.2\"/><path class=\"eq\" d=\"~MYBrwRX1LxWl*RdQElEdSTk(-dLAr_3QEdFlHfWmLDNlJOcQDlFdVTk--dL)q*3QFdBlKfRmZ\"/><path class=\"eq\" d=\"~MYVy1(yV1LzV7D-2QOnS8DD7z-1LWj.iQS8NnHrY1LyV6BF3QPnR8BD7D-1LXj(iQR8OnBr-1Z\"/><path class=\"eq-line\" d=\"~M(.z1P(Y1LYFrXFr\"/><path class=\"eq-line\" d=\"~MYVA1JY-1L_Fr-Fr\"/><path class=\"eq\" d=\"~M!O)1_xvLID1AKy1Q7F6JJ1VDy1LJA1*4QF68*z1O7L(vBEy1Q6E6KJ1YDy1LEA1(4QE65!z1S7Z\"/><path class=\"eq\" d=\"~MUDA1yE_1L-A1SA7QvD6wH1K*6LUA1bQD6w1Ty1*bLUtG)6Qw1B6)G1H*6LTA1gQB6vUy1_bZ\"/><path class=\"eq\" d=\"~MU*y1NFy2LJBt0QF60z)sE6LE6-hQ0E6E6_hLz)sF6QE60A)sF6LF6_hQ0F6F6-hZ\"/><path class=\"arc measure\" d=\"M151.06 205.37L149.98 231.35A26 26 0 0 0 177.04 206.16Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#leg-press-n-st-thigh.l\"/><use href=\"#leg-press-n-st-kneecap.l\"/><use href=\"#leg-press-n-st-shank.l\"/><use href=\"#leg-press-n-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#leg-press-n-st-thigh.l\"/><use href=\"#leg-press-n-st-kneecap.l\"/><use href=\"#leg-press-n-st-shank.l\"/><use href=\"#leg-press-n-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-press-n-st-thigh.r\"/><use href=\"#leg-press-n-st-kneecap.r\"/><use href=\"#leg-press-n-st-shank.r\"/><use href=\"#leg-press-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-press-n-st-thigh.r\"/><use href=\"#leg-press-n-st-kneecap.r\"/><use href=\"#leg-press-n-st-shank.r\"/><use href=\"#leg-press-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-press-n-g0-thigh.r\"/><use href=\"#leg-press-n-g0-kneecap.r\"/><use href=\"#leg-press-n-g0-shank.r\"/><use href=\"#leg-press-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-press-n-g0-thigh.r\"/><use href=\"#leg-press-n-g0-kneecap.r\"/><use href=\"#leg-press-n-g0-shank.r\"/><use href=\"#leg-press-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-press-n-g1-thigh.r\"/><use href=\"#leg-press-n-g1-kneecap.r\"/><use href=\"#leg-press-n-g1-shank.r\"/><use href=\"#leg-press-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-press-n-g1-thigh.r\"/><use href=\"#leg-press-n-g1-kneecap.r\"/><use href=\"#leg-press-n-g1-shank.r\"/><use href=\"#leg-press-n-g1-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-press-n-g2-thigh.r\"/><use href=\"#leg-press-n-g2-kneecap.r\"/><use href=\"#leg-press-n-g2-shank.r\"/><use href=\"#leg-press-n-g2-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-press-n-g2-thigh.r\"/><use href=\"#leg-press-n-g2-kneecap.r\"/><use href=\"#leg-press-n-g2-shank.r\"/><use href=\"#leg-press-n-g2-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MYGP1JAN1LFR8ER8Q!8-8ER8S)7Lxy1IgQ-8-8Ngyy1LT)7FR8Q.8!8FR8R)7Lwy1JgQ!8_8Ggxy1Z\"/><path class=\"eq\" d=\"~MyEP1wII1LxY2Rw4QO3z5JO2((3LEqSpQz5S3Hx1EfLW-2!X3QS3A5IO2*(3LFqRpQD5R3Gx1FfZ\"/><path class=\"eq-solid\" d=\"~MDwP1WNK1LTW9x_gQV4z8_G9UWgLH1yaQx8W4A8D6Lw_9FKgQW4A8.G9TWgLE1xaQA8V4x8B6Z\"/><path class=\"eq-thin\" d=\"~MwIU1wBG1L))9GHhLW.aH_gLHA9H_hLV.aG_g\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#leg-press-n-e-thigh.l\"/><use href=\"#leg-press-n-e-kneecap.l\"/><use href=\"#leg-press-n-e-shank.l\"/><use href=\"#leg-press-n-e-foot.l\"/><use href=\"#leg-press-n-e-shcap.l\"/><use href=\"#leg-press-n-e-upper.l\"/><use href=\"#leg-press-n-e-elbowcap.l\"/><use href=\"#leg-press-n-e-fore.l\"/><use href=\"#leg-press-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#leg-press-n-e-thigh.l\"/><use href=\"#leg-press-n-e-kneecap.l\"/><use href=\"#leg-press-n-e-shank.l\"/><use href=\"#leg-press-n-e-foot.l\"/><use href=\"#leg-press-n-e-shcap.l\"/><use href=\"#leg-press-n-e-upper.l\"/><use href=\"#leg-press-n-e-elbowcap.l\"/><use href=\"#leg-press-n-e-fore.l\"/><use href=\"#leg-press-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-press-n-e-head\"/><use href=\"#leg-press-n-e-torso\"/><use href=\"#leg-press-n-e-thigh.r\"/><use href=\"#leg-press-n-e-kneecap.r\"/><use href=\"#leg-press-n-e-shank.r\"/><use href=\"#leg-press-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-press-n-e-head\"/><use href=\"#leg-press-n-e-torso\"/><use href=\"#leg-press-n-e-thigh.r\"/><use href=\"#leg-press-n-e-kneecap.r\"/><use href=\"#leg-press-n-e-shank.r\"/><use href=\"#leg-press-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~~JIv!zT1Ng2\"/><path class=\"eq-pin\" d=\"~~SVv!zT1F60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-press-n-e-shcap.r\"/><use href=\"#leg-press-n-e-upper.r\"/><use href=\"#leg-press-n-e-elbowcap.r\"/><use href=\"#leg-press-n-e-fore.r\"/><use href=\"#leg-press-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#leg-press-n-e-shcap.r\"/><use href=\"#leg-press-n-e-upper.r\"/><use href=\"#leg-press-n-e-elbowcap.r\"/><use href=\"#leg-press-n-e-fore.r\"/><use href=\"#leg-press-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"88.68\" cy=\"231.57\" r=\"2.25\"/><circle class=\"joint\" cx=\"125.81\" cy=\"239.87\" r=\"2.25\"/><circle class=\"joint\" cx=\"148.54\" cy=\"266.13\" r=\"2.25\"/><circle class=\"joint\" cx=\"151.06\" cy=\"205.37\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#_10wEP1wHA1IHP1TDA10020100000002010000000002010000000221100000020100000201000000000000000000000000000000010000000000000000000002000000000000000000020000000000000000000200000000000000000100000\"/><path class=\"arrow\" d=\"~MyIJ1SDF1LAd-E1LNdFy2Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M149.98 231.35A26 26 0 0 0 177.04 206.16\"/><g class=\"arc-ticks\"><path d=\"~MNHt(JJ1LI2DY1\"/><path d=\"~MP-x1YEF1LFY1Y1\"/></g><path class=\"leader\" d=\"~MHEx1WzJ1L(A9Szd\"/></g></g><path class=\"leader\" d=\"M128.92 271.94L65.19 306H55.19\"/><circle class=\"anchor\" cx=\"128.92\" cy=\"271.94\" r=\"1.5\"/><path class=\"leader\" d=\"M188.55 218.27L223 271H233\"/><circle class=\"anchor\" cx=\"188.55\" cy=\"218.27\" r=\"1.5\"/><path class=\"leader\" d=\"M225.36 207.54L233 140H243\"/><circle class=\"anchor\" cx=\"225.36\" cy=\"207.54\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"leg-press-n-back\" data-key=\"back\" data-cue=\"Keep the hips and low back pressed into the pad the whole time.\" class=\"plate-callout two\" style=\"left:2.79%;top:79.33%\" aria-pressed=\"true\">Hips<br>down</button><button type=\"button\" id=\"leg-press-n-soft\" data-key=\"soft\" data-cue=\"Press until the legs are almost straight; never snap the knees locked.\" class=\"plate-callout\" style=\"left:63.69%;top:69.55%\" aria-pressed=\"false\">Soft knees</button><button type=\"button\" id=\"leg-press-n-heels\" data-key=\"heels\" data-cue=\"Push through the whole foot; the heels stay flat on the plate.\" class=\"plate-callout\" style=\"left:66.48%;top:32.96%\" aria-pressed=\"false\">Heels down</button><span class=\"plate-arc-label\" style=\"left:61.45%;top:79.89%\"><b>Knee</b><span>about 90° bend</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"leg-press-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"leg-press-m-st-thigh.l\" d=\"^0\"/><path id=\"leg-press-m-st-kneecap.l\" d=\"^1\"/><path id=\"leg-press-m-st-shank.l\" d=\"^2\"/><path id=\"leg-press-m-st-foot.l\" d=\"^3\"/><path id=\"leg-press-m-st-thigh.r\" d=\"^0\"/><path id=\"leg-press-m-st-kneecap.r\" d=\"^1\"/><path id=\"leg-press-m-st-shank.r\" d=\"^2\"/><path id=\"leg-press-m-st-foot.r\" d=\"^3\"/><path id=\"leg-press-m-g0-thigh.r\" d=\"^4\"/><path id=\"leg-press-m-g0-kneecap.r\" d=\"^5\"/><path id=\"leg-press-m-g0-shank.r\" d=\"^6\"/><path id=\"leg-press-m-g0-foot.r\" d=\"^7\"/><path id=\"leg-press-m-g1-thigh.r\" d=\"^8\"/><path id=\"leg-press-m-g1-kneecap.r\" d=\"^9\"/><path id=\"leg-press-m-g1-shank.r\" d=\"^10\"/><path id=\"leg-press-m-g1-foot.r\" d=\"^11\"/><path id=\"leg-press-m-g2-thigh.r\" d=\"^12\"/><path id=\"leg-press-m-g2-kneecap.r\" d=\"^13\"/><path id=\"leg-press-m-g2-shank.r\" d=\"^14\"/><path id=\"leg-press-m-g2-foot.r\" d=\"^15\"/><path id=\"leg-press-m-e-thigh.l\" d=\"^16\"/><path id=\"leg-press-m-e-kneecap.l\" d=\"^17\"/><path id=\"leg-press-m-e-shank.l\" d=\"^18\"/><path id=\"leg-press-m-e-foot.l\" d=\"^19\"/><path id=\"leg-press-m-e-shcap.l\" d=\"^20\"/><path id=\"leg-press-m-e-upper.l\" d=\"^21\"/><path id=\"leg-press-m-e-elbowcap.l\" d=\"^22\"/><path id=\"leg-press-m-e-fore.l\" d=\"^23\"/><path id=\"leg-press-m-e-fist.l\" d=\"^24\"/><path id=\"leg-press-m-e-head\" d=\"^25\"/><path id=\"leg-press-m-e-torso\" d=\"^26\"/><path id=\"leg-press-m-e-thigh.r\" d=\"^16\"/><path id=\"leg-press-m-e-kneecap.r\" d=\"^17\"/><path id=\"leg-press-m-e-shank.r\" d=\"^18\"/><path id=\"leg-press-m-e-foot.r\" d=\"^19\"/><path id=\"leg-press-m-e-shcap.r\" d=\"^20\"/><path id=\"leg-press-m-e-upper.r\" d=\"^21\"/><path id=\"leg-press-m-e-elbowcap.r\" d=\"^22\"/><path id=\"leg-press-m-e-fore.r\" d=\"^23\"/><path id=\"leg-press-m-e-fist.r\" d=\"^24\"/><path id=\"leg-press-m-m-torso\" d=\"~#_12JzcFWI1.yb-TH1.7S5f9Jj6Hax5Fkz3(3V1VjzfV9_1Y1JdI3GgR4ElxeXn*fxjz9T5VgS6IB1yozs_8_mWdFu*gKq-hS8F1GdA7z1_h!e(f_bn.1*jF5cKlSW211100001010022101200000101000000220001200012100001210100000000020000000101001000000020000200012000011000200020000000\"/><path id=\"leg-press-m-m-thigh.l\" d=\"~#F12PBvy!R1*FvVGT1Y1JbF12x3.!1)5S7-2_3.2NS1Oc(m5FkFcynA2PS1Y2!3!5U7(3-!1E10.1JbyvPdFmXF16*z1Rl)F100000000001110000001010100000000000001100100001100110101000000100011001000002000\"/><path id=\"leg-press-m-m-kneecap.l\" d=\"~~UNrN)B1_J10\"/><path id=\"leg-press-m-m-shank.l\" d=\"~#F12FSs!JE1zBr*)D1xbx46G1A(1U7K6K7G3K3Rx2I9*b*9XbG2-eP4zw2XgI4!1X8J4A!1yh7F1-bhS8YePl(hHlF4_qz800000000011200000000000000111112001210000001200020100000000001002012001000000000\"/><path id=\"leg-press-m-m-foot.l\" d=\"~#o2_wF1_RG1z*D1RIG1p-c-cTdOuxgXtIR2HiyF2!3_B1D7wmwhYA1.8FeBj)m(uWc000100000001010001000002202000002000000000101220\"/><path id=\"leg-press-m-m-thigh.r\" d=\"^56\"/><path id=\"leg-press-m-m-kneecap.r\" d=\"^57\"/><path id=\"leg-press-m-m-shank.r\" d=\"^58\"/><path id=\"leg-press-m-m-foot.r\" d=\"^59\"/><path id=\"leg-press-m-mf-head\" d=\"^25\"/><path id=\"leg-press-m-mf-shcap.l\" d=\"^20\"/><path id=\"leg-press-m-mf-upper.l\" d=\"^21\"/><path id=\"leg-press-m-mf-elbowcap.l\" d=\"^22\"/><path id=\"leg-press-m-mf-fore.l\" d=\"^23\"/><path id=\"leg-press-m-mf-fist.l\" d=\"^24\"/><path id=\"leg-press-m-mf-shcap.r\" d=\"^20\"/><path id=\"leg-press-m-mf-upper.r\" d=\"^21\"/><path id=\"leg-press-m-mf-elbowcap.r\" d=\"^22\"/><path id=\"leg-press-m-mf-fore.r\" d=\"^23\"/><path id=\"leg-press-m-mf-fist.r\" d=\"^24\"/><path id=\"leg-press-m-mo-0\" d=\"^25\"/><path id=\"leg-press-m-mo-1\" d=\"^26\"/><path id=\"leg-press-m-mo-2\" d=\"^16\"/><path id=\"leg-press-m-mo-3\" d=\"^17\"/><path id=\"leg-press-m-mo-4\" d=\"^18\"/><path id=\"leg-press-m-mo-5\" d=\"^19\"/><path id=\"leg-press-m-mo-6\" d=\"^20\"/><path id=\"leg-press-m-mo-7\" d=\"^21\"/><path id=\"leg-press-m-mo-8\" d=\"^22\"/><path id=\"leg-press-m-mo-9\" d=\"^23\"/><path id=\"leg-press-m-mo-10\" d=\"^24\"/><path id=\"leg-press-m-mo-11\" d=\"^16\"/><path id=\"leg-press-m-mo-12\" d=\"^17\"/><path id=\"leg-press-m-mo-13\" d=\"^18\"/><path id=\"leg-press-m-mo-14\" d=\"^19\"/><path id=\"leg-press-m-mo-15\" d=\"^20\"/><path id=\"leg-press-m-mo-16\" d=\"^21\"/><path id=\"leg-press-m-mo-17\" d=\"^22\"/><path id=\"leg-press-m-mo-18\" d=\"^23\"/><path id=\"leg-press-m-mo-19\" d=\"^24\"/><path id=\"leg-press-m-mo-20\" d=\"^28\"/><path id=\"leg-press-m-mo-21\" d=\"^29\"/><path id=\"leg-press-m-mo-22\" d=\"^30\"/><path id=\"leg-press-m-mo-23\" d=\"^32\"/><path id=\"leg-press-m-mo-24\" d=\"^33\"/><path id=\"leg-press-m-mo-25\" d=\"^36\"/><path id=\"leg-press-m-mo-26\" d=\"^37\"/><path id=\"leg-press-m-mo-27\" d=\"^38\"/><path id=\"leg-press-m-mo-28\" d=\"^40\"/><path id=\"leg-press-m-mo-29\" d=\"^41\"/><path id=\"leg-press-m-mo-30\" d=\"^42\"/><path id=\"leg-press-m-mo-31\" d=\"^44\"/><path id=\"leg-press-m-mo-32\" d=\"^45\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#leg-press-m-dots)\"/>\n  <path class=\"floorline\" d=\"^27\"/><path class=\"eq\" d=\"^28\"/><path class=\"eq\" d=\"^29\"/><path class=\"eq\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq-line\" d=\"^34\"/><path class=\"eq-line\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><path class=\"eq\" d=\"^38\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#leg-press-m-st-thigh.l\"/><use href=\"#leg-press-m-st-kneecap.l\"/><use href=\"#leg-press-m-st-shank.l\"/><use href=\"#leg-press-m-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#leg-press-m-st-thigh.l\"/><use href=\"#leg-press-m-st-kneecap.l\"/><use href=\"#leg-press-m-st-shank.l\"/><use href=\"#leg-press-m-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-press-m-st-thigh.r\"/><use href=\"#leg-press-m-st-kneecap.r\"/><use href=\"#leg-press-m-st-shank.r\"/><use href=\"#leg-press-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-press-m-st-thigh.r\"/><use href=\"#leg-press-m-st-kneecap.r\"/><use href=\"#leg-press-m-st-shank.r\"/><use href=\"#leg-press-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-press-m-g0-thigh.r\"/><use href=\"#leg-press-m-g0-kneecap.r\"/><use href=\"#leg-press-m-g0-shank.r\"/><use href=\"#leg-press-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-press-m-g0-thigh.r\"/><use href=\"#leg-press-m-g0-kneecap.r\"/><use href=\"#leg-press-m-g0-shank.r\"/><use href=\"#leg-press-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-press-m-g1-thigh.r\"/><use href=\"#leg-press-m-g1-kneecap.r\"/><use href=\"#leg-press-m-g1-shank.r\"/><use href=\"#leg-press-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-press-m-g1-thigh.r\"/><use href=\"#leg-press-m-g1-kneecap.r\"/><use href=\"#leg-press-m-g1-shank.r\"/><use href=\"#leg-press-m-g1-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-press-m-g2-thigh.r\"/><use href=\"#leg-press-m-g2-kneecap.r\"/><use href=\"#leg-press-m-g2-shank.r\"/><use href=\"#leg-press-m-g2-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-press-m-g2-thigh.r\"/><use href=\"#leg-press-m-g2-kneecap.r\"/><use href=\"#leg-press-m-g2-shank.r\"/><use href=\"#leg-press-m-g2-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^40\"/><path class=\"eq\" d=\"^41\"/><path class=\"eq-solid\" d=\"^42\"/><path class=\"eq-thin\" d=\"^43\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#leg-press-m-e-thigh.l\"/><use href=\"#leg-press-m-e-kneecap.l\"/><use href=\"#leg-press-m-e-shank.l\"/><use href=\"#leg-press-m-e-foot.l\"/><use href=\"#leg-press-m-e-shcap.l\"/><use href=\"#leg-press-m-e-upper.l\"/><use href=\"#leg-press-m-e-elbowcap.l\"/><use href=\"#leg-press-m-e-fore.l\"/><use href=\"#leg-press-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#leg-press-m-e-thigh.l\"/><use href=\"#leg-press-m-e-kneecap.l\"/><use href=\"#leg-press-m-e-shank.l\"/><use href=\"#leg-press-m-e-foot.l\"/><use href=\"#leg-press-m-e-shcap.l\"/><use href=\"#leg-press-m-e-upper.l\"/><use href=\"#leg-press-m-e-elbowcap.l\"/><use href=\"#leg-press-m-e-fore.l\"/><use href=\"#leg-press-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-press-m-e-head\"/><use href=\"#leg-press-m-e-torso\"/><use href=\"#leg-press-m-e-thigh.r\"/><use href=\"#leg-press-m-e-kneecap.r\"/><use href=\"#leg-press-m-e-shank.r\"/><use href=\"#leg-press-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-press-m-e-head\"/><use href=\"#leg-press-m-e-torso\"/><use href=\"#leg-press-m-e-thigh.r\"/><use href=\"#leg-press-m-e-kneecap.r\"/><use href=\"#leg-press-m-e-shank.r\"/><use href=\"#leg-press-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^44\"/><path class=\"eq-pin\" d=\"^45\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-press-m-e-shcap.r\"/><use href=\"#leg-press-m-e-upper.r\"/><use href=\"#leg-press-m-e-elbowcap.r\"/><use href=\"#leg-press-m-e-fore.r\"/><use href=\"#leg-press-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#leg-press-m-e-shcap.r\"/><use href=\"#leg-press-m-e-upper.r\"/><use href=\"#leg-press-m-e-elbowcap.r\"/><use href=\"#leg-press-m-e-fore.r\"/><use href=\"#leg-press-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"88.68\" cy=\"231.57\" r=\"2.25\"/><circle class=\"joint\" cx=\"125.81\" cy=\"239.87\" r=\"2.25\"/><circle class=\"joint\" cx=\"148.54\" cy=\"266.13\" r=\"2.25\"/><circle class=\"joint\" cx=\"151.06\" cy=\"205.37\" r=\"2.25\"/></g><mask id=\"leg-press-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#leg-press-m-mf-head\" fill=\"#000\"/><use href=\"#leg-press-m-m-torso\" fill=\"#000\"/><use href=\"#leg-press-m-m-thigh.l\" fill=\"#000\"/><use href=\"#leg-press-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#leg-press-m-m-shank.l\" fill=\"#000\"/><use href=\"#leg-press-m-m-foot.l\" fill=\"#000\"/><use href=\"#leg-press-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#leg-press-m-mf-upper.l\" fill=\"#000\"/><use href=\"#leg-press-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#leg-press-m-mf-fore.l\" fill=\"#000\"/><use href=\"#leg-press-m-mf-fist.l\" fill=\"#000\"/><use href=\"#leg-press-m-m-thigh.r\" fill=\"#000\"/><use href=\"#leg-press-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#leg-press-m-m-shank.r\" fill=\"#000\"/><use href=\"#leg-press-m-m-foot.r\" fill=\"#000\"/><use href=\"#leg-press-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#leg-press-m-mf-upper.r\" fill=\"#000\"/><use href=\"#leg-press-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#leg-press-m-mf-fore.r\" fill=\"#000\"/><use href=\"#leg-press-m-mf-fist.r\" fill=\"#000\"/><use href=\"#leg-press-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-press-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#leg-press-m-mmask)\"><g class=\"u-stroke\"><use href=\"#leg-press-m-m-torso\"/><use href=\"#leg-press-m-m-thigh.l\"/><use href=\"#leg-press-m-m-kneecap.l\"/><use href=\"#leg-press-m-m-shank.l\"/><use href=\"#leg-press-m-m-foot.l\"/><use href=\"#leg-press-m-m-thigh.r\"/><use href=\"#leg-press-m-m-kneecap.r\"/><use href=\"#leg-press-m-m-shank.r\"/><use href=\"#leg-press-m-m-foot.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MPIrSUX1LSx2**2My1FvLx1EvLTswG1\"/><path class=\"m-arrow\" d=\"~#40((kD*S1*AgxHR1TY1G700012000\"/><path class=\"leader m\" d=\"M131.99 268.85L78.78 306H68.78\"/><path class=\"leader m\" d=\"~MN.sN)B1L0*K2\"/><path class=\"leader m\" d=\"~MNwI1H!F1L0DGa\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"leg-press-m-lift\" data-key=\"lift\" data-cue=\"Too deep; the hips and low back peel off the pad.\" class=\"plate-callout two m\" style=\"left:2.79%;top:79.33%\" aria-pressed=\"true\">Hips<br>lift off</button><button type=\"button\" id=\"leg-press-m-cave\" data-key=\"cave\" data-cue=\"The knees fall in toward each other.\" class=\"plate-callout m\" style=\"left:16.2%;top:41.62%\" aria-pressed=\"false\">Knees cave</button><button type=\"button\" id=\"leg-press-m-heels\" data-key=\"heels\" data-cue=\"The heels peel off the plate.\" class=\"plate-callout m\" style=\"left:62.01%;top:70.11%\" aria-pressed=\"false\">Heels lift</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "back",
        cues: [{ key: "back", cue: "Keep the hips and low back pressed into the pad the whole time." }, { key: "soft", cue: "Press until the legs are almost straight; never snap the knees locked." }, { key: "heels", cue: "Push through the whole foot; the heels stay flat on the plate." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "lift",
        cues: [{ key: "lift", cue: "Too deep; the hips and low back peel off the pad." }, { key: "cave", cue: "The knees fall in toward each other." }, { key: "heels", cue: "The heels peel off the plate." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Hips lift off</b><span>Too deep; the hips and low back peel off the pad.</span></li><li><b>Knees cave</b><span>The knees fall in toward each other.</span></li><li><b>Heels lift</b><span>The heels peel off the plate.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower 2 seconds, pause 0.5 seconds, press 1 second, rest 0.5 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:0.5 1 0\"><i></i><div class=\"tempo-label\"><b>Pause</b><span>0.5 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:0.5 1 0\"><i></i><div class=\"tempo-label\"><b>Rest</b><span>0.5 s</span></div></div></div>",
      alt: "Leg press on a 45 degree sled, side view. Reclined against the back pad, feet mid-plate, the sled lowers along the rails until the knees reach about 90 degrees, with the hips staying on the pad, then presses back to almost straight legs.",
      mistakeAlt: "Leg Press (45°): the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "balance",
    "handle": "pad-handle",
    "loadAxis": "across",
    "width": {
      "text": "Set by the machine: one handle beside each hip. Arms relaxed with soft elbows, shoulders down and back on the pad.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-leg-press",
          "ace-leg-press"
        ],
        "note": "Set by the machine."
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-leg-press",
          "nasm-leg-press"
        ],
        "note": "Wrapped thumb: coaching consensus (you turn the catch levers with it). No study compares thumb positions here."
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        20
      ],
      "dev": [
        -10,
        10
      ],
      "limitText": "Keep your wrist level, not curled forward or bent far back.",
      "claim": {
        "tags": [
          "WEAK",
          "MECH"
        ],
        "sources": [
          "ace-leg-press",
          "nasm-leg-press"
        ],
        "note": "Level wrist, 0-20 deg: drawing check, not an injury threshold. Pushing on the knees folds the wrist back under part of the sled load: mechanics plus coaching observation; not counted in any study."
      }
    },
    "pose": {
      "view": "radial",
      "forearm": 0,
      "wrist": {
        "ext": 8,
        "dev": 0
      },
      "contactAt": 0.9,
      "fingers": {
        "curl": 1
      },
      "thumb": "wrapped",
      "squeeze": "light",
      "handle": {
        "profile": "pad-handle",
        "axis": "across",
        "strut": [
          -0.35,
          1
        ]
      },
      "load": {
        "kind": "pull"
      }
    },
    "faults": [
      {
        "key": "push-on-knees",
        "label": "Pushing on knee",
        "pose": {
          "forearm": 0,
          "wrist": {
            "ext": 80,
            "dev": 0
          },
          "contactAt": 0.45,
          "fingers": {
            "curl": 1
          },
          "thumb": "beside",
          "squeeze": "firm",
          "handle": {
            "profile": "machine-grip",
            "axis": "across",
            "diameterMm": 104
          },
          "load": {
            "kind": "push"
          }
        },
        "markers": [
          "lever-arc"
        ],
        "alt": "Palm pressed on the front of the knee to push a hard rep up. The wrist folds back about 80 degrees. The push runs behind the wrist, bending it further."
      }
    ],
    "gripLine": "Your hands just keep you in the seat. Hold lightly, never push on your knees.",
    "cue": "Light hands, never on your knees."
  },
  contacts: [
    "foot-platform",
    "seat-back"
  ],
  setup: [
    {
      "kind": "safety",
      "text": "Depth catch? Set it just below your lowest point.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-leg-press",
          "bells-of-steel"
        ],
        "note": "Catch steps from NASM and a manufacturer guide; machines differ, so \"on most machines\" and the machine sticker."
      }
    },
    {
      "kind": "get-in",
      "text": "Sit right back, lower back flat on the pad.",
      "zoom": "back-on-pad",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "ace-leg-press",
          "nasm-leg-press",
          "yessis",
          "castonguay2022"
        ],
        "note": "No study measured lumbar bending at the bottom of a leg press. Consensus plus mechanics; the pad takes real pressure (Castonguay-Siu 2022)."
      }
    },
    {
      "kind": "safety",
      "text": "On most machines, push the sled up and turn the handles out.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-leg-press",
          "bells-of-steel"
        ],
        "note": "Catch steps from NASM and a manufacturer guide; machines differ, so \"on most machines\" and the machine sticker."
      }
    },
    {
      "kind": "position",
      "text": "Lower to about 90 degrees. Breathe out as you push. Dizzy? Stop.",
      "zoom": "back-on-pad",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "ace-leg-press",
          "nasm-leg-press",
          "macdougall1985"
        ]
      }
    },
    {
      "kind": "finish",
      "text": "Turn the handles in and rest the sled before feet come off.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-leg-press",
          "bells-of-steel"
        ],
        "note": "Catch steps from NASM and a manufacturer guide; machines differ, so \"on most machines\" and the machine sticker."
      }
    }
  ],
  posture: [
    {
      "key": "back",
      "label": "Tailbone on pad",
      "detail": "Your lower back stays on the pad with no gap, even at the bottom. Hips sit in the corner of the seat.",
      "anchor": {
        "pose": "end",
        "at": "sacrum"
      },
      "zoom": "back-on-pad",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "ace-leg-press",
          "nasm-leg-press",
          "yessis",
          "castonguay2022"
        ],
        "note": "No study measured lumbar bending at the bottom of a leg press. Consensus plus mechanics; the pad takes real pressure (Castonguay-Siu 2022)."
      }
    },
    {
      "key": "feet",
      "label": "Whole foot flat",
      "detail": "Heels down, foot in the middle of the plate, toes straight or out a little. Push from heel through ball.",
      "anchor": {
        "pose": "end",
        "at": "heel.r"
      },
      "zoom": "foot",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "ace-leg-press",
          "nasm-leg-press",
          "escamilla2001lp",
          "martinfuentes2022"
        ],
        "note": "Heels flat, knees over toes: consensus. Width and toe angle barely change the muscles (Martin-Fuentes 2022, Escamilla 2001)."
      }
    },
    {
      "key": "knees",
      "label": "Knees over toes",
      "detail": "Seen from the front, each knee stays over your second or third toe. It never falls inward.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-leg-press"
        ],
        "note": "Knee valgus as a leg-press injury cause is NASM consensus, not leg-press data."
      }
    },
    {
      "key": "depth",
      "label": "About 90 degrees",
      "detail": "At the bottom, knees at about 90 degrees, tailbone still on the pad. Thighs stay clear of your ribs.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "back-on-pad",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "ace-leg-press",
          "nasm-leg-press",
          "yessis",
          "larsen2025"
        ],
        "note": "90 deg stop: consensus. Larsen 2025: moderate range grows the quads as well as deep range."
      }
    },
    {
      "key": "soft",
      "label": "Soft knees",
      "detail": "At the top your legs are almost straight, with a small bend at the knee.",
      "anchor": {
        "pose": "start",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "WEAK",
          "CONSENSUS"
        ],
        "sources": [
          "barnds2019",
          "nasm-leg-press",
          "ace-leg-press"
        ],
        "note": "One case report plus consensus."
      }
    },
    {
      "key": "hands",
      "label": "Hands light",
      "detail": "Arms relaxed, shoulders and head on the pad, hands wrapped lightly round the side handles.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "ace-leg-press",
          "nasm-leg-press"
        ],
        "note": "Nothing measures grip, thumb or wrist on the leg press handles. \"Lightly grasp\" and \"avoid moving the upper body\" (ACE), hands on the handles (NASM)."
      }
    }
  ],
  zooms: [
    {
      "key": "back-on-pad",
      "chip": "Back pad",
      "heading": "Back on pad: right and wrong",
      "kind": "posture",
      "feelRow": "lower-back"
    },
    {
      "key": "foot",
      "chip": "Feet",
      "heading": "Feet: right and wrong",
      "kind": "posture",
      "feelRow": "knee"
    },
    {
      "key": "hand",
      "chip": "Hand",
      "heading": "Hand: right and wrong",
      "kind": "hand",
      "feelRow": "wrists"
    }
  ],
  copy: {
    "setupLine": "Sit right back, tailbone on the pad. Feet mid-platform, whole foot flat, heels down.",
    "mistakeLine": "Keep a small bend at the top. On the way down, stop before your tailbone lifts.",
    "gripLine": "Your hands just keep you in the seat. Hold lightly, never push on your knees."
  },
  mistakes: [
    {
      "key": "deep",
      "title": "Going too deep",
      "zoom": "back-on-pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-leg-press",
          "nasm-leg-press",
          "yessis"
        ]
      },
      "fix": "Stop before your tailbone lifts, around 90 degrees for most people."
    },
    {
      "key": "lock",
      "title": "Snapping knees straight",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "ace-leg-press",
          "barnds2019"
        ]
      },
      "fix": "Push until almost straight, keep a small bend, then go again."
    },
    {
      "key": "knees",
      "title": "Knees caving, hands on knees",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-leg-press",
          "nasm-leg-press"
        ]
      },
      "fix": "Knees over toes. If you need your hands, take a plate off."
    }
  ],
  risks: [
    {
      "key": "back",
      "text": "Going too deep bends your lower back under the whole sled.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-leg-press",
          "yessis"
        ]
      }
    },
    {
      "key": "lock",
      "text": "A knee snapped straight under load can bend the wrong way. Rare, but reported.",
      "claim": {
        "tags": [
          "WEAK"
        ],
        "sources": [
          "barnds2019"
        ],
        "note": "One case report (A8 open item)."
      }
    },
    {
      "key": "knees",
      "text": "Caving knees twist under load. Hands on knees bend your wrists back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-leg-press",
          "nasm-leg-press"
        ]
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
    "ace-leg-press",
    "nasm-leg-press",
    "bells-of-steel",
    "yessis",
    "escamilla2001lp",
    "dasilva2008",
    "martinfuentes2022",
    "martinfuentes2020",
    "marchetti2023",
    "kinoshita2026",
    "stien2021",
    "larsen2025",
    "castonguay2022",
    "barnds2019",
    "macdougall1985",
    "nhs-wrist-pain",
    "nhs-knee-pain"
  ],
  research: {
    "card": "grip/research/leg_press.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

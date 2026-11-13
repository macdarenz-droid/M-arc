// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=81c4b5f9fb3f9909d5f3020a7cccac4a76112ac9b34242ebb4d675d7893afa5e
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_pistol_squat",
  name: "Pistol Squat",
  hashes: { inputsSha256: "81c4b5f9fb3f9909d5f3020a7cccac4a76112ac9b34242ebb4d675d7893afa5e", golden: "67c9cde15c3d5693735833cd3552ff18a72ffc98feeeb924eb0a43d9f87f8ec9" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"pistol-squat-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"pistol-squat-n-st-thigh.l\" d=\"~#F12wxtJ_F1GFsBSE1*6T9z1iUvHW1W1V9m-4-lKP1gxqz9xiOl.eIqBN1B4E2.8G4HpP-1D1hX3GbBx1W3tHN1Hgyw1yD1Nq00022020002000000001202002000000011000000000200101000220020000101200010010101000\"/><path id=\"pistol-squat-n-st-kneecap.l\" d=\"~~UHz1_US1_J10\"/><path id=\"pistol-squat-n-st-shank.l\" d=\"~#F12yNz1!GT1).y1z(R1V3Eby1jwx1!V1W1V9kX4Vx1)-1aKfK5VaVc-8xrI*1E4E2.8G4DoH_1vix7V9z6Dghys!9Jjwn(f00000210110021001000000000000000202000200000000001000120011111100000000020010101\"/><path id=\"pistol-squat-n-st-foot.l\" d=\"~#o2!*F1WF*1TYF1OA!1ycB5H9)g(5Ry1WB2KY1Ew2HH1Oz1_gzjJeIu!sTgK3FgGqO2!x1020000000000000000000002000000110000000001010000\"/><path id=\"pistol-squat-n-st-head\" d=\"~#w12YDw1PEg-TuR!fVjWiOjy9xbK3G3W4T4z8V7Ib)g.mA5VcI1T9zjfUmTaSmX5YkW3YiPgz2Dj0001000110002001010010000000000000100020000000101200011000001001\"/><path id=\"pistol-squat-n-st-torso\" d=\"~#_12_SuD(kT*uxPjR9T7z42Y8HiD9!6(bUgN6az5Eo)lz9)cy4Dg*3AlG5Fn-eNiTgH5I9z7IgIpRA1V9-rK67T9hwcWg_2A8KcT8IgA7K7Nk(5W5HcIaA3A9xU2_t10000000202001101101002101020002100110110100010000100010100000000001011210010100200000001200000000101000000020111100\"/><path id=\"pistol-squat-n-st-thigh.r\" d=\"~#F12WYsJ_E1BTsOID1E2VbE10Y5U(1Y5z8S2*3iEV1PbKnnBkBdRmO4*U1.2.3E6R7B1_(1F13N1XbVvVaGkWG1F1(z1NnwF101000100010200200000100100000101010101000200002002000100010020101022000210000001\"/><path id=\"pistol-squat-n-st-kneecap.r\" d=\"~~AEuF)T1_J10\"/><path id=\"pistol-squat-n-st-shank.r\" d=\"~#F12SBu(!T1VIu)KS1J2TbH10U1D)1J6R7w3-3dxz2w8Edk)bT6*dy7Vy2O2z4R5z8)7W(1G13B1.bIdybOewoz1UlycJp01000200001200000020001010000101000010000000000200000010100000020000100000002000\"/><path id=\"pistol-squat-n-st-foot.r\" d=\"~#o2HzuAB)1*UuzB(1_cF3Uhx8Up)nS-2B3-J2-4ID1)7xo2OG1Y4Eb-cYsBbGmSp120002012120000110001000101200002101101000010110\"/><path id=\"pistol-squat-n-g0-thigh.l\" d=\"~#F12YIr(WJ1RIqIUI1-8z8tqUG1yO15.99-4*uEI1R4TpRc*f.nGa)y1BF1T4G1O9K2DA1HT1un.5IaXvAaA8WK1HmAsPH1Pi01100100000010000000000000200001002000010110000000000000100000022000000100000020\"/><path id=\"pistol-squat-n-g0-kneecap.l\" d=\"~~JNz1Y_U1_J10\"/><path id=\"pistol-squat-n-g0-shank.l\" d=\"~#F12YWz1SXV1I!y1BPU1*5Iaw1p_H1NN13.99.4KJ1zS1X2EfK7K9Bez6TD1-W1R4K1R9O2Fz1PU1vmX8x8-2yh(4UrNdwhYpDb00001001011012002101000200001001111000100001010000000210001000111102000000200000\"/><path id=\"pistol-squat-n-g0-foot.l\" d=\"~#o2_xI1UK(1RVH1BI*1_aK7_5Oivxz1F-1xB2VW1DW1OvJn*f(hxoFy1xh5!a.sA4Wx1000000000110000020000000000001000111112000000020\"/><path id=\"pistol-squat-n-g0-head\" d=\"~#w12NDy1JBk-Uw1OVjOlWgBkA7XaR4X3J4-3R8O6xcVeKoJ6zcbX9xjI2UnE8wnT3FkY5yhHi)3!i0110020200001002000000022000012000200000020200110000000002000000\"/><path id=\"pistol-squat-n-g0-torso\" d=\"~#_12!zw1DWoBTw1IGnR8)bT7n_4SkY7U8N8UiD6S17-oXjEdRdN1WglYlx1Wp*9JlVcw7z8X3OhTh-F1B4ztz6R1I9K2P8WiA1S8Ka*aOh_3IbSiA5_2ya.7Y1HdOW2Nl10101000200010000011101110000202000020000001000000000000100020000010002000110100202000000010021000200001002000200000\"/><path id=\"pistol-squat-n-g0-thigh.r\" d=\"~#F12SGr(TJ1BIq.OI1E8K8x1kHE1yR18-90-4-sXJ1I3.pVbKgKnOb*w1-G1R4R1I9.2Ux1wV1w1lI5VaBw1S8!5yN1!kDtWG1Pk10020010000000001000200000000000000002001010100200010010000101000000000000000001\"/><path id=\"pistol-squat-n-g0-kneecap.r\" d=\"~~A)y1FDV1_J10\"/><path id=\"pistol-squat-n-g0-shank.r\" d=\"~#F12Dyz1wSU1B_z1BGT1Y6X9D1gznY_1Y8K4F4G2!p**1Pcx9F5XalOfUw1R_1lX4)1X9.vSW1x1fP3KbVg!4TmPgO9PjA1ws00020000200010100002000101001000001100022000001100000002200010101022000001011000\"/><path id=\"pistol-squat-n-g0-foot.r\" d=\"^9\"/><path id=\"pistol-squat-n-g1-thigh.l\" d=\"~#F12DxqPDT1RYoONS1TaG5ny1FV1Fx1.2I9V1R4)G1Tw1VbGnRgVb.px3.J1Rs.40-9cHR1(D1mvO8G8VrYi!kPG1HtUkyN1U500002000000000002011010010101010000000000000100000200000000120001022001110100000\"/><path id=\"pistol-squat-n-g1-kneecap.l\" d=\"~~DxA1HGY1_J10\"/><path id=\"pistol-squat-n-g1-shank.l\" d=\"~#F12FTA1FO-1-Nz1)PY1R8E8mx1HW1Hw1)2K9T1R4)Y1Kz1.6-d-9.6Gf*1TU1RG1-40.9aWP1FF1nw1TaE5A2AhScAp_hNcYrJ300000001010000000101011000002000000000020000000000101010000200110010000100010000\"/><path id=\"pistol-squat-n-g1-foot.l\" d=\"~#o2YzN1(W)1ENK1I-(1H8Ea8Ij.aGx1Dz1OS2*A1Nz2TnNvzaWlIdYE1GgU4y2XuWdyv100010010010000001000100000000100001000200010100\"/><path id=\"pistol-squat-n-g1-head\" d=\"~#w12_NA1FNrB)y1x-qznDe*k(4zaV5B4(3.2.8B5-c*b-pU7GbkX9ViK4JoV5Hnz1Pj(7(ewk*5Hi0000000000000020000000010000020000100010000000000000001210000002\"/><path id=\"pistol-squat-n-g1-torso\" d=\"~#_12y*x1AXvzRy1BJuz6VgGbT26AmY5waF4ykW5_2y5EoKgEhRdK1Ng(2PlS3ArE4Wn-7S8I62*hR8VI1F2GtX5.2R8E4F4(jlW8.7*c*h1)eYfA5dF7z6x1UhGY2wc01210100201010002100001010020000002002000221011000000002000001010100200000000000212002000111000020000001001012020001\"/><path id=\"pistol-squat-n-g1-thigh.r\" d=\"~#F12NJqyKT1GwpE!S1KbK3fA1y_1YnK4V8I2B4*N1zpKf)kGiV8)pH1zR1OkV4oV9y2DX1yuiB1.9T6xoAnPrHB1Pw1JfHN1B200010101001010020000010100000010100020000000010000000000001000000000000001020000\"/><path id=\"pistol-squat-n-g1-kneecap.r\" d=\"~~WyB1!OW1_J10\"/><path id=\"pistol-squat-n-g1-shank.r\" d=\"~#F12UHB1WTV1GHD1OPU1S8E8y1oOy1wV1S9V2S4K1_B1IX1weK6J7O9N2EfWI1*S18X40.9zH1wO1vnY5KaGhN1OpSbBdFhR4Ur00020002000200000000020200001121000110000000020010002002000200000000000000101000\"/><path id=\"pistol-squat-n-g1-foot.r\" d=\"^9\"/><path id=\"pistol-squat-n-e-thigh.l\" d=\"~#F12YzpNz!1zVnB!.1.bt7D1_*1DbG6T7z3T3xT1XeRjIhTjV4EpW6EU1-9O4W1)8y4F!1!h8B1)aR4XiWrYy1_u!y1H8!J1.b00000000000000011021000000000100000002020000100000002101010100000000200100000100\"/><path id=\"pistol-squat-n-e-kneecap.l\" d=\"~~yDA1WT!1_J10\"/><path id=\"pistol-squat-n-e-shank.l\" d=\"~#F12AFB1_w(1x.z1BS*1xbR48z1N(1_9E6T7B3R3xy2.bRbGaTb-2*ew4Gw2BjO4Y1)8w4D!1JjbA1.brJ8AfwlUiylw5Arz700000002000020200002001200110101011210100202002000002200100200000100010001000010\"/><path id=\"pistol-squat-n-e-foot.l\" d=\"~#o2!JP1UGw2)KO1zW)1w4Tc)6)hImxrA2R-2I9JJ2Ea_B1K1woH2YG1KdPaO9OtFo(n000020100001210000000000210000101000020011000000\"/><path id=\"pistol-squat-n-e-shcap.l\" d=\"~~F.w1_KO1wP10\"/><path id=\"pistol-squat-n-e-upper.l\" d=\"~#F12FIy1_*P1REx1.!P1.8d1bWO1G2)5B3)2K1KD1X5XixaOg0XiyaKD1W5)2P1)5D3WO1J21a.8ex1DgPpYdPm1PpTd00200000010000000000000000000001000000010000020200020000000020000000000101000000\"/><path id=\"pistol-squat-n-e-elbowcap.l\" d=\"~~URH1_KO1Dz10\"/><path id=\"pistol-squat-n-e-fore.l\" d=\"~#F12_UI1USP1XYH1VOP1GaT1!1pNI1K3G9R3I2T1)w1dXc.6Eb0Xc!6)w1eI2U1G9P3NI1S3!1mGaY13AaUjSaAh1UjKa00000200001010000010000101000000010000010100100001101000010000002020000000002020\"/><path id=\"pistol-squat-n-e-fist.l\" d=\"~~(KU1_KO1ww10\"/><path id=\"pistol-squat-n-e-head\" d=\"~#w12WYD1YDD1-IB1BJB1VoNbGlN2I9-6V4N3X1B9X3Ed-8xr!8KaY1O9)hT6_o-2HnU1NiAaScUlz8Nh0011100100000010100000011000000001021000011010200000000000011120\"/><path id=\"pistol-squat-n-e-torso\" d=\"~#_12UXz1DBH1OPA1.!F1B2)kTe*5z5PmD3AbdNk!4A4SaOm)bOk*cR4HfS6AkP8JrD2!oE2Y9E4F4IhY1KJ1!8xs.4x4I7E6dSkV2A8V4GeKhB4Bi_bN6V3(3I5O5Jlz-2S101101000020100001001000000002000000010110120001000200000000022000200100020000122000100000001012000101000220000010000\"/><path id=\"pistol-squat-n-e-thigh.r\" d=\"~#F12NOqwx!1IApIU!1OaU5cD1(-1KoK9*2T4G1.S1SfXp.3xj!6OhHjBR1HkV2(3K5F8F!1.hdz1VbD2hJx1!K1_6_x1xcyvOy122001100100000121001010000200002000111000000000012020012100001000000200000000000\"/><path id=\"pistol-squat-n-e-kneecap.r\" d=\"~~Y-z1PUV1_J10\"/><path id=\"pistol-squat-n-e-shank.r\" d=\"~#F12P(z1y*U1R-A1BWT1P7E9A1kRr_Y1y9X3N4x2PuV.1Ddz8y6GagKfyB1*X1d-4z1-9)z1(T1x1jJ4zb*gU3*nUe.a_ix1(r00020022000000000020000000110000021000000000000000010100000000000010102200010100\"/><path id=\"pistol-squat-n-e-foot.r\" d=\"~#o2HzuAB)1*UuzB(1_cF3Uhx8Up)nS-2B3-J2-4ID1)7xo2OG1Y4Eb-cYsBbGmSp120002012120000111001000101200002101101000010110\"/><path id=\"pistol-squat-n-e-shcap.r\" d=\"^32\"/><path id=\"pistol-squat-n-e-upper.r\" d=\"^33\"/><path id=\"pistol-squat-n-e-elbowcap.r\" d=\"^34\"/><path id=\"pistol-squat-n-e-fore.r\" d=\"^35\"/><path id=\"pistol-squat-n-e-fist.r\" d=\"^36\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#pistol-squat-n-dots)\"/>\n  <path class=\"floorline\" d=\"M60.29 339.5H316.29\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pistol-squat-n-st-thigh.l\"/><use href=\"#pistol-squat-n-st-kneecap.l\"/><use href=\"#pistol-squat-n-st-shank.l\"/><use href=\"#pistol-squat-n-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-n-st-thigh.l\"/><use href=\"#pistol-squat-n-st-kneecap.l\"/><use href=\"#pistol-squat-n-st-shank.l\"/><use href=\"#pistol-squat-n-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pistol-squat-n-st-head\"/><use href=\"#pistol-squat-n-st-torso\"/><use href=\"#pistol-squat-n-st-thigh.r\"/><use href=\"#pistol-squat-n-st-kneecap.r\"/><use href=\"#pistol-squat-n-st-shank.r\"/><use href=\"#pistol-squat-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-n-st-head\"/><use href=\"#pistol-squat-n-st-torso\"/><use href=\"#pistol-squat-n-st-thigh.r\"/><use href=\"#pistol-squat-n-st-kneecap.r\"/><use href=\"#pistol-squat-n-st-shank.r\"/><use href=\"#pistol-squat-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pistol-squat-n-g0-thigh.l\"/><use href=\"#pistol-squat-n-g0-kneecap.l\"/><use href=\"#pistol-squat-n-g0-shank.l\"/><use href=\"#pistol-squat-n-g0-foot.l\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-n-g0-thigh.l\"/><use href=\"#pistol-squat-n-g0-kneecap.l\"/><use href=\"#pistol-squat-n-g0-shank.l\"/><use href=\"#pistol-squat-n-g0-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pistol-squat-n-g0-head\"/><use href=\"#pistol-squat-n-g0-torso\"/><use href=\"#pistol-squat-n-g0-thigh.r\"/><use href=\"#pistol-squat-n-g0-kneecap.r\"/><use href=\"#pistol-squat-n-g0-shank.r\"/><use href=\"#pistol-squat-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-n-g0-head\"/><use href=\"#pistol-squat-n-g0-torso\"/><use href=\"#pistol-squat-n-g0-thigh.r\"/><use href=\"#pistol-squat-n-g0-kneecap.r\"/><use href=\"#pistol-squat-n-g0-shank.r\"/><use href=\"#pistol-squat-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pistol-squat-n-g1-thigh.l\"/><use href=\"#pistol-squat-n-g1-kneecap.l\"/><use href=\"#pistol-squat-n-g1-shank.l\"/><use href=\"#pistol-squat-n-g1-foot.l\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-n-g1-thigh.l\"/><use href=\"#pistol-squat-n-g1-kneecap.l\"/><use href=\"#pistol-squat-n-g1-shank.l\"/><use href=\"#pistol-squat-n-g1-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pistol-squat-n-g1-head\"/><use href=\"#pistol-squat-n-g1-torso\"/><use href=\"#pistol-squat-n-g1-thigh.r\"/><use href=\"#pistol-squat-n-g1-kneecap.r\"/><use href=\"#pistol-squat-n-g1-shank.r\"/><use href=\"#pistol-squat-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-n-g1-head\"/><use href=\"#pistol-squat-n-g1-torso\"/><use href=\"#pistol-squat-n-g1-thigh.r\"/><use href=\"#pistol-squat-n-g1-kneecap.r\"/><use href=\"#pistol-squat-n-g1-shank.r\"/><use href=\"#pistol-squat-n-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pistol-squat-n-e-thigh.l\"/><use href=\"#pistol-squat-n-e-kneecap.l\"/><use href=\"#pistol-squat-n-e-shank.l\"/><use href=\"#pistol-squat-n-e-foot.l\"/><use href=\"#pistol-squat-n-e-shcap.l\"/><use href=\"#pistol-squat-n-e-upper.l\"/><use href=\"#pistol-squat-n-e-elbowcap.l\"/><use href=\"#pistol-squat-n-e-fore.l\"/><use href=\"#pistol-squat-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-n-e-thigh.l\"/><use href=\"#pistol-squat-n-e-kneecap.l\"/><use href=\"#pistol-squat-n-e-shank.l\"/><use href=\"#pistol-squat-n-e-foot.l\"/><use href=\"#pistol-squat-n-e-shcap.l\"/><use href=\"#pistol-squat-n-e-upper.l\"/><use href=\"#pistol-squat-n-e-elbowcap.l\"/><use href=\"#pistol-squat-n-e-fore.l\"/><use href=\"#pistol-squat-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pistol-squat-n-e-head\"/><use href=\"#pistol-squat-n-e-torso\"/><use href=\"#pistol-squat-n-e-thigh.r\"/><use href=\"#pistol-squat-n-e-kneecap.r\"/><use href=\"#pistol-squat-n-e-shank.r\"/><use href=\"#pistol-squat-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-n-e-head\"/><use href=\"#pistol-squat-n-e-torso\"/><use href=\"#pistol-squat-n-e-thigh.r\"/><use href=\"#pistol-squat-n-e-kneecap.r\"/><use href=\"#pistol-squat-n-e-shank.r\"/><use href=\"#pistol-squat-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pistol-squat-n-e-shcap.r\"/><use href=\"#pistol-squat-n-e-upper.r\"/><use href=\"#pistol-squat-n-e-elbowcap.r\"/><use href=\"#pistol-squat-n-e-fore.r\"/><use href=\"#pistol-squat-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-n-e-shcap.r\"/><use href=\"#pistol-squat-n-e-upper.r\"/><use href=\"#pistol-squat-n-e-elbowcap.r\"/><use href=\"#pistol-squat-n-e-fore.r\"/><use href=\"#pistol-squat-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"175.88\" cy=\"242.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"223.49\" cy=\"242.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"131.45\" cy=\"295.8\" r=\"2.25\"/><circle class=\"joint\" cx=\"190.49\" cy=\"274.64\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#H20SHuNFG1INuOxG112201021021020102102102011220010cya002010000000002010000000000020100000020110120000101001000002101200001010010000021010000011100002001010100020002000001010100000000000002000001010100010000000002000200000101010000000000020\"/><path class=\"arrow\" d=\"~Mw!pD-Y1L.aOF1LUO1yP1Z\"/></g><path class=\"leader\" d=\"~M(KV1_KO1L0GP2\"/><circle class=\"anchor\" cx=\"273.59\" cy=\"242.85\" r=\"1.5\"/><path class=\"leader\" d=\"M192.46 310.35L231 276H241\"/><circle class=\"anchor\" cx=\"192.46\" cy=\"310.35\" r=\"1.5\"/><path class=\"leader\" d=\"M152.59 339L123 323H113\"/><circle class=\"anchor\" cx=\"152.59\" cy=\"339\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"pistol-squat-n-arms\" data-key=\"arms\" data-cue=\"Reach your arms forward for balance.\" class=\"plate-callout\" style=\"left:59.22%;top:55.03%\" aria-pressed=\"true\">Arms forward</button><button type=\"button\" id=\"pistol-squat-n-leg\" data-key=\"leg\" data-cue=\"Hold the free leg out in front, knee straight.\" class=\"plate-callout two\" style=\"left:65.92%;top:70.95%\" aria-pressed=\"false\">Free leg<br>straight</button><button type=\"button\" id=\"pistol-squat-n-heel\" data-key=\"heel\" data-cue=\"Keep the whole standing foot flat on the floor.\" class=\"plate-callout\" style=\"left:9.5%;top:84.08%\" aria-pressed=\"false\">Heel down</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"pistol-squat-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"pistol-squat-m-st-thigh.l\" d=\"^0\"/><path id=\"pistol-squat-m-st-kneecap.l\" d=\"^1\"/><path id=\"pistol-squat-m-st-shank.l\" d=\"^2\"/><path id=\"pistol-squat-m-st-foot.l\" d=\"^3\"/><path id=\"pistol-squat-m-st-head\" d=\"^4\"/><path id=\"pistol-squat-m-st-torso\" d=\"^5\"/><path id=\"pistol-squat-m-st-thigh.r\" d=\"^6\"/><path id=\"pistol-squat-m-st-kneecap.r\" d=\"^7\"/><path id=\"pistol-squat-m-st-shank.r\" d=\"^8\"/><path id=\"pistol-squat-m-st-foot.r\" d=\"^9\"/><path id=\"pistol-squat-m-g0-thigh.l\" d=\"^10\"/><path id=\"pistol-squat-m-g0-kneecap.l\" d=\"^11\"/><path id=\"pistol-squat-m-g0-shank.l\" d=\"^12\"/><path id=\"pistol-squat-m-g0-foot.l\" d=\"^13\"/><path id=\"pistol-squat-m-g0-head\" d=\"^14\"/><path id=\"pistol-squat-m-g0-torso\" d=\"^15\"/><path id=\"pistol-squat-m-g0-thigh.r\" d=\"^16\"/><path id=\"pistol-squat-m-g0-kneecap.r\" d=\"^17\"/><path id=\"pistol-squat-m-g0-shank.r\" d=\"^18\"/><path id=\"pistol-squat-m-g0-foot.r\" d=\"^9\"/><path id=\"pistol-squat-m-g1-thigh.l\" d=\"^19\"/><path id=\"pistol-squat-m-g1-kneecap.l\" d=\"^20\"/><path id=\"pistol-squat-m-g1-shank.l\" d=\"^21\"/><path id=\"pistol-squat-m-g1-foot.l\" d=\"^22\"/><path id=\"pistol-squat-m-g1-head\" d=\"^23\"/><path id=\"pistol-squat-m-g1-torso\" d=\"^24\"/><path id=\"pistol-squat-m-g1-thigh.r\" d=\"^25\"/><path id=\"pistol-squat-m-g1-kneecap.r\" d=\"^26\"/><path id=\"pistol-squat-m-g1-shank.r\" d=\"^27\"/><path id=\"pistol-squat-m-g1-foot.r\" d=\"^9\"/><path id=\"pistol-squat-m-e-thigh.l\" d=\"^28\"/><path id=\"pistol-squat-m-e-kneecap.l\" d=\"^29\"/><path id=\"pistol-squat-m-e-shank.l\" d=\"^30\"/><path id=\"pistol-squat-m-e-foot.l\" d=\"^31\"/><path id=\"pistol-squat-m-e-shcap.l\" d=\"^32\"/><path id=\"pistol-squat-m-e-upper.l\" d=\"^33\"/><path id=\"pistol-squat-m-e-elbowcap.l\" d=\"^34\"/><path id=\"pistol-squat-m-e-fore.l\" d=\"^35\"/><path id=\"pistol-squat-m-e-fist.l\" d=\"^36\"/><path id=\"pistol-squat-m-e-head\" d=\"^37\"/><path id=\"pistol-squat-m-e-torso\" d=\"^38\"/><path id=\"pistol-squat-m-e-thigh.r\" d=\"^39\"/><path id=\"pistol-squat-m-e-kneecap.r\" d=\"^40\"/><path id=\"pistol-squat-m-e-shank.r\" d=\"^41\"/><path id=\"pistol-squat-m-e-foot.r\" d=\"^42\"/><path id=\"pistol-squat-m-e-shcap.r\" d=\"^32\"/><path id=\"pistol-squat-m-e-upper.r\" d=\"^33\"/><path id=\"pistol-squat-m-e-elbowcap.r\" d=\"^34\"/><path id=\"pistol-squat-m-e-fore.r\" d=\"^35\"/><path id=\"pistol-squat-m-e-fist.r\" d=\"^36\"/><path id=\"pistol-squat-m-m-head\" d=\"~#w12WSF1!OA1-BE1GVz1VoNbGlN2I9-6V4N3-1B9T3Ed.8xr!8KaY1O9)hT6_o-2HnU1NiAaScSlz8Sh0011100100010010110000210000010001001000011010000000000010001020\"/><path id=\"pistol-squat-m-m-torso\" d=\"~#_12URB1HNF1OHD1)BE1B2)kTe*5B5PmH3ybfSk!4y4SaOmxcOk-cT4FfW6AkN8JrA2!oz2Y9G4F4IhY1KJ1!8xs.4x4I7E6dSkV2A8V4GeKhB4Ei_bS6V3!3I5O5Hlz-2W101101000020100200000020001000000002000100020001000200010000020100000100000000120000110001001010000000000000000001200\"/><path id=\"pistol-squat-m-m-thigh.l\" d=\"~#F12Y*qSJ_1zOpGB_1.bt7D1Y*1DbB6T7B3T3xT1XeRjIhTjV4EpW6EU1-9O4W1)8w4F!1wi8G1)aK4XiUrYy1_u!y1H8!J1.b00000000000010010001000000001100000012020000100002022001110002000000200110000100\"/><path id=\"pistol-squat-m-m-kneecap.l\" d=\"~~ywD1_!_1_J10\"/><path id=\"pistol-squat-m-m-shank.l\" d=\"~#F12yyE1(G!1*UB1G..1zbR48z1N(1_9E6T7E3R3*x2.bTbGaTb-2)ew4Bw2BjR4Y1)8w4A!1Jj7A1*brJ8AfwlSiylA5yrB720001002000020000000000220110111011200002002102000000020000200000101011200101000\"/><path id=\"pistol-squat-m-m-foot.l\" d=\"~#o2!DS1YS(1)ER1E)*1w4Tc)6xiIm*qA2T-2I9JJ2Ea_B1K1woH2YG1KdPaO9OtFo(n000100110000000200000000010000101000020011000000\"/><path id=\"pistol-squat-m-m-shcap.l\" d=\"~~FVy1(WK1wP10\"/><path id=\"pistol-squat-m-m-upper.l\" d=\"~#F12FBA1(DO1Rxz1)BO1.8d1bWO1G2)5B3)2K1KD1X5XixaOg0XiyaKD1W5)2P1)5D3WO1J21a.8ez1DgUpYdJm1UpTd00000000010000000000000000000001000000010000020200020000000001011000000101000011\"/><path id=\"pistol-squat-m-m-elbowcap.l\" d=\"~~UIJ1(WK1Dz10\"/><path id=\"pistol-squat-m-m-fore.l\" d=\"~#F12_NK1Y.N1XSJ1-YN1GaT1!1pNI1K3G9R3I2T1)w1dXc.6Eb0Xc!6)w1eI2U1G9P3NI1P3!1qGaW13AaUjSaAh1UjKa00000200001010001010000101000000010000010100101001101202000001000000000000000001\"/><path id=\"pistol-squat-m-m-fist.l\" d=\"~~(EW1(WK1ww10\"/><path id=\"pistol-squat-m-m-thigh.r\" d=\"~#F12F_r!K_1BJqzY_1IbJ34F1W*1BcV8-4B4z2)U1_4Oo*8)jY2xlPfEU1!9O3H3*6w7S(1I53B1*b3G7Pw1SI1wgSz1)4JB1Kr20010010000000101202200011000011000010000100100010100120021210002021000000000000\"/><path id=\"pistol-squat-m-m-kneecap.r\" d=\"~~(DD1AIW1_J10\"/><path id=\"pistol-squat-m-m-shank.r\" d=\"~#F12DRD1AJV1RTE1RIU1F9O7uqRD1yS1Y9.1W4x1wH1GU1SeE5(7.8Y3)eSO1GO1i-4sX9XK1PI1tpP6)9Gh4GqN9ReDgV6Fr01002000010101002020000000010010000020000110100020001010001000002121000000000000\"/><path id=\"pistol-squat-m-m-foot.r\" d=\"~#o2wWuDF(1XJvTI*1AcH5Ui.4HtIj!Y2(b*H2ThOA1IeTnx4-G1G2.8OeFuB6IqPl012101000000010100100000012101012100000100002221\"/><path id=\"pistol-squat-m-m-shcap.r\" d=\"^55\"/><path id=\"pistol-squat-m-m-upper.r\" d=\"^56\"/><path id=\"pistol-squat-m-m-elbowcap.r\" d=\"^57\"/><path id=\"pistol-squat-m-m-fore.r\" d=\"^58\"/><path id=\"pistol-squat-m-m-fist.r\" d=\"^59\"/><path id=\"pistol-squat-m-mo-0\" d=\"^37\"/><path id=\"pistol-squat-m-mo-1\" d=\"^38\"/><path id=\"pistol-squat-m-mo-2\" d=\"^28\"/><path id=\"pistol-squat-m-mo-3\" d=\"^29\"/><path id=\"pistol-squat-m-mo-4\" d=\"^30\"/><path id=\"pistol-squat-m-mo-5\" d=\"^31\"/><path id=\"pistol-squat-m-mo-6\" d=\"^32\"/><path id=\"pistol-squat-m-mo-7\" d=\"^33\"/><path id=\"pistol-squat-m-mo-8\" d=\"^34\"/><path id=\"pistol-squat-m-mo-9\" d=\"^35\"/><path id=\"pistol-squat-m-mo-10\" d=\"^36\"/><path id=\"pistol-squat-m-mo-11\" d=\"^39\"/><path id=\"pistol-squat-m-mo-12\" d=\"^40\"/><path id=\"pistol-squat-m-mo-13\" d=\"^41\"/><path id=\"pistol-squat-m-mo-14\" d=\"^42\"/><path id=\"pistol-squat-m-mo-15\" d=\"^32\"/><path id=\"pistol-squat-m-mo-16\" d=\"^33\"/><path id=\"pistol-squat-m-mo-17\" d=\"^34\"/><path id=\"pistol-squat-m-mo-18\" d=\"^35\"/><path id=\"pistol-squat-m-mo-19\" d=\"^36\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#pistol-squat-m-dots)\"/>\n  <path class=\"floorline\" d=\"^43\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-st-thigh.l\"/><use href=\"#pistol-squat-m-st-kneecap.l\"/><use href=\"#pistol-squat-m-st-shank.l\"/><use href=\"#pistol-squat-m-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-m-st-thigh.l\"/><use href=\"#pistol-squat-m-st-kneecap.l\"/><use href=\"#pistol-squat-m-st-shank.l\"/><use href=\"#pistol-squat-m-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-st-head\"/><use href=\"#pistol-squat-m-st-torso\"/><use href=\"#pistol-squat-m-st-thigh.r\"/><use href=\"#pistol-squat-m-st-kneecap.r\"/><use href=\"#pistol-squat-m-st-shank.r\"/><use href=\"#pistol-squat-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-m-st-head\"/><use href=\"#pistol-squat-m-st-torso\"/><use href=\"#pistol-squat-m-st-thigh.r\"/><use href=\"#pistol-squat-m-st-kneecap.r\"/><use href=\"#pistol-squat-m-st-shank.r\"/><use href=\"#pistol-squat-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-g0-thigh.l\"/><use href=\"#pistol-squat-m-g0-kneecap.l\"/><use href=\"#pistol-squat-m-g0-shank.l\"/><use href=\"#pistol-squat-m-g0-foot.l\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-m-g0-thigh.l\"/><use href=\"#pistol-squat-m-g0-kneecap.l\"/><use href=\"#pistol-squat-m-g0-shank.l\"/><use href=\"#pistol-squat-m-g0-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-g0-head\"/><use href=\"#pistol-squat-m-g0-torso\"/><use href=\"#pistol-squat-m-g0-thigh.r\"/><use href=\"#pistol-squat-m-g0-kneecap.r\"/><use href=\"#pistol-squat-m-g0-shank.r\"/><use href=\"#pistol-squat-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-m-g0-head\"/><use href=\"#pistol-squat-m-g0-torso\"/><use href=\"#pistol-squat-m-g0-thigh.r\"/><use href=\"#pistol-squat-m-g0-kneecap.r\"/><use href=\"#pistol-squat-m-g0-shank.r\"/><use href=\"#pistol-squat-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-g1-thigh.l\"/><use href=\"#pistol-squat-m-g1-kneecap.l\"/><use href=\"#pistol-squat-m-g1-shank.l\"/><use href=\"#pistol-squat-m-g1-foot.l\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-m-g1-thigh.l\"/><use href=\"#pistol-squat-m-g1-kneecap.l\"/><use href=\"#pistol-squat-m-g1-shank.l\"/><use href=\"#pistol-squat-m-g1-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-g1-head\"/><use href=\"#pistol-squat-m-g1-torso\"/><use href=\"#pistol-squat-m-g1-thigh.r\"/><use href=\"#pistol-squat-m-g1-kneecap.r\"/><use href=\"#pistol-squat-m-g1-shank.r\"/><use href=\"#pistol-squat-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-m-g1-head\"/><use href=\"#pistol-squat-m-g1-torso\"/><use href=\"#pistol-squat-m-g1-thigh.r\"/><use href=\"#pistol-squat-m-g1-kneecap.r\"/><use href=\"#pistol-squat-m-g1-shank.r\"/><use href=\"#pistol-squat-m-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-e-thigh.l\"/><use href=\"#pistol-squat-m-e-kneecap.l\"/><use href=\"#pistol-squat-m-e-shank.l\"/><use href=\"#pistol-squat-m-e-foot.l\"/><use href=\"#pistol-squat-m-e-shcap.l\"/><use href=\"#pistol-squat-m-e-upper.l\"/><use href=\"#pistol-squat-m-e-elbowcap.l\"/><use href=\"#pistol-squat-m-e-fore.l\"/><use href=\"#pistol-squat-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-m-e-thigh.l\"/><use href=\"#pistol-squat-m-e-kneecap.l\"/><use href=\"#pistol-squat-m-e-shank.l\"/><use href=\"#pistol-squat-m-e-foot.l\"/><use href=\"#pistol-squat-m-e-shcap.l\"/><use href=\"#pistol-squat-m-e-upper.l\"/><use href=\"#pistol-squat-m-e-elbowcap.l\"/><use href=\"#pistol-squat-m-e-fore.l\"/><use href=\"#pistol-squat-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-e-head\"/><use href=\"#pistol-squat-m-e-torso\"/><use href=\"#pistol-squat-m-e-thigh.r\"/><use href=\"#pistol-squat-m-e-kneecap.r\"/><use href=\"#pistol-squat-m-e-shank.r\"/><use href=\"#pistol-squat-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-m-e-head\"/><use href=\"#pistol-squat-m-e-torso\"/><use href=\"#pistol-squat-m-e-thigh.r\"/><use href=\"#pistol-squat-m-e-kneecap.r\"/><use href=\"#pistol-squat-m-e-shank.r\"/><use href=\"#pistol-squat-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-e-shcap.r\"/><use href=\"#pistol-squat-m-e-upper.r\"/><use href=\"#pistol-squat-m-e-elbowcap.r\"/><use href=\"#pistol-squat-m-e-fore.r\"/><use href=\"#pistol-squat-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-m-e-shcap.r\"/><use href=\"#pistol-squat-m-e-upper.r\"/><use href=\"#pistol-squat-m-e-elbowcap.r\"/><use href=\"#pistol-squat-m-e-fore.r\"/><use href=\"#pistol-squat-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"175.88\" cy=\"242.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"223.49\" cy=\"242.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"131.45\" cy=\"295.8\" r=\"2.25\"/><circle class=\"joint\" cx=\"190.49\" cy=\"274.64\" r=\"2.25\"/></g><mask id=\"pistol-squat-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#pistol-squat-m-m-head\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-torso\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-thigh.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-shank.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-foot.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-shcap.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-upper.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-fore.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-fist.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-thigh.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-shank.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-foot.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-shcap.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-upper.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-fore.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-m-fist.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#pistol-squat-m-mmask)\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-m-head\"/><use href=\"#pistol-squat-m-m-torso\"/><use href=\"#pistol-squat-m-m-thigh.l\"/><use href=\"#pistol-squat-m-m-kneecap.l\"/><use href=\"#pistol-squat-m-m-shank.l\"/><use href=\"#pistol-squat-m-m-foot.l\"/><use href=\"#pistol-squat-m-m-shcap.l\"/><use href=\"#pistol-squat-m-m-upper.l\"/><use href=\"#pistol-squat-m-m-elbowcap.l\"/><use href=\"#pistol-squat-m-m-fore.l\"/><use href=\"#pistol-squat-m-m-fist.l\"/><use href=\"#pistol-squat-m-m-thigh.r\"/><use href=\"#pistol-squat-m-m-kneecap.r\"/><use href=\"#pistol-squat-m-m-shank.r\"/><use href=\"#pistol-squat-m-m-foot.r\"/><use href=\"#pistol-squat-m-m-shcap.r\"/><use href=\"#pistol-squat-m-m-upper.r\"/><use href=\"#pistol-squat-m-m-elbowcap.r\"/><use href=\"#pistol-squat-m-m-fore.r\"/><use href=\"#pistol-squat-m-m-fist.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~My!tYDx2LyA5ys\"/><path class=\"m-line\" d=\"~MwWuDF(1LXmSsLAcH5LUi.4LHtIjL!Y2(bL*H2ThLOA1IeLTnx4L-G1G2L.8OeLFuB6LIqPl\"/><path class=\"m-arrow\" d=\"~MHXrYDy2L0)vMYiwpLXi)oL0wS1\"/><path class=\"leader m\" d=\"M152.97 333.88L123.6 323H113.6\"/></g>\n<g class=\"plate-zoom\" data-view=\"mistake\" data-k=\"2.5\" data-c=\"60 230\" data-src=\"152.78 336.44\"><defs><clipPath id=\"pistol-squat-m-zclip\"><circle cx=\"60\" cy=\"230\" r=\"52\"/></clipPath></defs><circle class=\"pz-src\" cx=\"152.78\" cy=\"336.44\" r=\"20.8\"/><path class=\"pz-link\" d=\"~MPBrYU(1L*Y8Eya\"/><circle class=\"pz-bg\" cx=\"60\" cy=\"230\" r=\"52\"/><g class=\"pz-in\" clip-path=\"url(#pistol-squat-m-zclip)\">\n  <defs><pattern id=\"pistol-squat-m-z-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"pistol-squat-m-z-st-thigh.l\" d=\"M49.64 -88.55C51.44 -81.55 56.7 -77.19 59.53 -72.47C62.36 -67.75 64.33 -64.36 66.62 -60.25C68.92 -56.14 68.96 -55.57 73.28 -47.8C77.6 -40.03 86.02 -24.38 92.56 -13.63C99.11 -2.89 105.84 6.88 112.55 16.66C119.26 26.44 127.51 38.83 132.81 45.06C138.1 51.29 140.44 52.79 144.32 54.05C148.19 55.31 152.75 54.29 156.05 52.61C159.35 50.93 162.85 47.84 164.11 43.96C165.37 40.09 165.53 37.31 163.6 29.37C161.67 21.42 156.5 7.47 152.53 -3.71C148.56 -14.89 144.62 -26.08 139.77 -37.69C134.93 -49.3 127.21 -65.31 123.46 -73.37C119.72 -81.44 119.28 -81.8 117.3 -86.07C115.33 -90.34 113.74 -93.94 111.59 -99C109.44 -104.06 109 -110.88 104.39 -116.45C99.78 -122.02 90.81 -130.2 83.93 -132.43C77.04 -134.67 68.93 -132.86 63.07 -129.87C57.2 -126.89 50.97 -121.39 48.74 -114.5C46.5 -107.62 47.84 -95.56 49.64 -88.55Z\"/><path id=\"pistol-squat-m-z-st-kneecap.l\" d=\"~~FNpSF7wP30\"/><path id=\"pistol-squat-m-z-st-shank.l\" d=\"~#F12(WpF*8XGoXO5G9Ks_2G1FS2WD4N4GoU1-bIU2xR4qRD1RdVqXvxmXz2O-4OaR5Gm-aW!1_R4X2N1OhEoEfSF1O1yD2UoHP1S-1wF110010022000111000000001100101000010111110020020101010100000100000100000111000000\"/><path id=\"pistol-squat-m-z-st-foot.l\" d=\"~#o2SNE1J_x1RxE1))uJu-cAnRH1(eIW2AN5BK4Ow5(G3-Y2_G1.O1AA1-I2AF2TG1V8UF1Vx2B6_U2001200010010120000210111010000210000000000000010\"/><path id=\"pistol-squat-m-z-st-head\" d=\"M90.34 -403.33C96.09 -402.75 105.24 -401.66 110.72 -398.95C116.19 -396.25 120.34 -391.66 123.21 -387.1C126.08 -382.54 127.1 -376.54 127.93 -371.61C128.76 -366.68 128.33 -362.53 128.2 -357.52C128.07 -352.51 127.8 -346.33 127.14 -341.54C126.48 -336.76 125.72 -332.3 124.25 -328.81C122.77 -325.33 121.4 -321.84 118.27 -320.65C115.14 -319.45 109.41 -320.45 105.49 -321.62C101.57 -322.79 98.43 -325.01 94.76 -327.66C91.1 -330.32 88.53 -334.23 83.5 -337.56C78.46 -340.9 69.36 -343.59 64.56 -347.66C59.76 -351.74 56.47 -356.84 54.69 -362.01C52.9 -367.17 52.75 -373.37 53.84 -378.67C54.94 -383.98 57.55 -389.89 61.28 -393.85C65.02 -397.8 71.39 -400.84 76.23 -402.42C81.08 -404 84.6 -403.91 90.34 -403.33Z\"/><path id=\"pistol-squat-m-z-st-torso\" d=\"M69.56 -343.05C63.08 -340.12 67.31 -330.24 65.23 -324.6C63.16 -318.95 60.09 -314.32 57.1 -309.18C54.11 -304.04 49.99 -300.12 47.3 -293.76C44.62 -287.4 42.47 -279.06 40.98 -271.02C39.49 -262.98 38.44 -255.13 38.37 -245.52C38.29 -235.91 39.38 -224.11 40.53 -213.37C41.67 -202.62 44.01 -190.22 45.24 -181.07C46.47 -171.93 48.48 -165.42 47.91 -158.5C47.33 -151.59 44.7 -146.17 41.79 -139.6C38.88 -133.02 33.15 -125.63 30.46 -119.04C27.76 -112.45 25.82 -106.04 25.62 -100.07C25.41 -94.1 26.47 -87.85 29.22 -83.22C31.97 -78.59 36.58 -74.82 42.1 -72.29C47.63 -69.75 55.28 -68.82 62.39 -68.02C69.5 -67.22 77.8 -66.57 84.79 -67.49C91.78 -68.4 99.51 -69.06 104.34 -73.51C109.16 -77.96 111.26 -85.43 113.75 -94.17C116.24 -102.9 117.85 -115.32 119.26 -125.92C120.67 -136.53 121.87 -147.15 122.21 -157.81C122.56 -168.48 120.83 -180.32 121.33 -189.9C121.83 -199.49 123.74 -207.4 125.23 -215.34C126.71 -223.27 129.39 -229.54 130.23 -237.51C131.08 -245.47 131.37 -255.07 130.3 -263.14C129.22 -271.21 126.46 -279.68 123.8 -285.91C121.13 -292.14 117.07 -296.02 114.31 -300.51C111.55 -304.99 108.76 -308.03 107.22 -312.83C105.67 -317.63 105.57 -324.43 105.05 -329.32C104.53 -334.2 110.02 -339.86 104.11 -342.15C98.19 -344.43 76.04 -345.97 69.56 -343.05Z\"/><path id=\"pistol-squat-m-z-st-thigh.r\" d=\"M46.31 -101.37C45 -94.26 47.93 -88.09 48.51 -82.62C49.1 -77.15 49.46 -73.24 49.81 -68.54C50.16 -63.85 49.96 -63.32 50.61 -54.45C51.26 -45.58 52.31 -27.84 53.72 -15.34C55.14 -2.84 57.14 8.86 59.11 20.55C61.08 32.25 63.36 46.95 65.54 54.83C67.72 62.71 69.21 65.06 72.19 67.83C75.18 70.61 79.74 71.6 83.44 71.46C87.14 71.33 91.62 70 94.39 67.01C97.17 64.03 98.48 61.58 100.07 53.56C101.67 45.54 102.85 30.7 103.95 18.89C105.05 7.08 106.18 -4.73 106.67 -17.3C107.16 -29.87 106.9 -47.64 106.89 -56.53C106.89 -65.42 106.65 -65.94 106.65 -70.65C106.65 -75.35 106.73 -79.28 106.91 -84.78C107.08 -90.27 109.55 -96.64 107.71 -103.64C105.88 -110.63 101.19 -121.82 95.88 -126.75C90.57 -131.68 82.46 -133.44 75.88 -133.2C69.3 -132.96 61.34 -130.6 56.41 -125.29C51.48 -119.98 47.63 -108.48 46.31 -101.37Z\"/><path id=\"pistol-squat-m-z-st-kneecap.r\" d=\"~~PVcYSawP30\"/><path id=\"pistol-squat-m-z-st-shank.r\" d=\"~#F12WRc!JaxxdIX6A6Gtw36H4_*4!f.iJ7O9vVE5ykxx1N1*tOg*y1Yh-D5G6za)dKk)jW!4B37)2TtKx1SrEA1(.1X2FW1yuF)102012100100120000000001000200000000100010000000010000011002200000001110000010000\"/><path id=\"pistol-squat-m-z-e-thigh.l\" d=\"M-0.46 158.27C6.04 161.44 12.76 160.27 18.19 161.17C23.61 162.08 27.48 162.77 32.1 163.69C36.71 164.61 37.17 164.95 45.89 166.7C54.61 168.44 71.98 172.19 84.41 174.17C96.83 176.15 108.63 177.35 120.43 178.59C132.22 179.82 147 181.57 155.18 181.58C163.36 181.59 166.02 180.78 169.49 178.64C172.96 176.51 175.14 172.38 176 168.78C176.86 165.18 176.78 160.5 174.64 157.03C172.51 153.56 170.5 151.64 163.2 147.96C155.9 144.28 141.92 139.16 130.84 134.94C119.76 130.72 108.68 126.47 96.7 122.63C84.72 118.79 67.52 114.29 58.95 111.91C50.39 109.53 49.83 109.63 45.29 108.37C40.76 107.1 36.99 105.98 31.74 104.34C26.49 102.69 21.02 98.61 13.79 98.51C6.56 98.4 -5.48 99.93 -11.65 103.72C-17.82 107.51 -21.69 114.86 -23.22 121.26C-24.75 127.67 -24.6 135.97 -20.81 142.14C-17.02 148.31 -6.96 155.1 -0.46 158.27Z\"/><path id=\"pistol-squat-m-z-e-kneecap.l\" d=\"~~(Sr_Bw1wP30\"/><path id=\"pistol-squat-m-z-e-shank.l\" d=\"~#F12wFuUWz1GXqxSy1TrGbk)2y!4WoXfzj*7.8xB5-t.sVpzt*6KB1!9Tw5*O1EbN4Rm!9JW4NP1p(2VtI2(k(B1JU1SN1YU1ScYz2.h20000010000020100002200101210101001012022002000000200011110000021010020010020000\"/><path id=\"pistol-squat-m-z-e-foot.l\" d=\"~#o2wA_1YJG1-WX1x!E1waOvKhxK1xY1Oz2J5xw7In((5XpW(2R3_.1_5UF3Tx1wqVnRG2U!1Y.1110021101000000020002010000100022000010100200010\"/><path id=\"pistol-squat-m-z-e-shcap.l\" d=\"M98.54 -3.99a19.2 19.2 0 1 0 38.4 0a19.2 19.2 0 1 0 -38.4 0Z\"/><path id=\"pistol-squat-m-z-e-upper.l\" d=\"M117.74 15.21C122.57 16.42 127.86 15.49 132.03 15.59C136.19 15.68 139.17 15.74 142.74 15.78C146.31 15.83 146.71 15.99 153.45 15.85C160.2 15.72 173.69 15.48 183.21 14.97C192.74 14.47 201.67 13.64 210.59 12.82C219.52 12.01 230.62 11.39 236.78 10.09C242.95 8.8 245.22 7.41 247.57 5.06C249.92 2.72 250.86 -0.97 250.86 -3.99C250.86 -7 249.92 -10.69 247.57 -13.04C245.22 -15.38 242.95 -16.77 236.78 -18.07C230.62 -19.36 219.52 -19.98 210.59 -20.8C201.67 -21.61 192.74 -22.44 183.21 -22.94C173.69 -23.45 160.2 -23.69 153.45 -23.83C146.71 -23.96 146.31 -23.8 142.74 -23.76C139.17 -23.71 136.19 -23.66 132.03 -23.56C127.86 -23.47 122.57 -24.39 117.74 -23.19C112.91 -21.98 106.23 -19.53 103.03 -16.33C99.83 -13.13 98.54 -8.1 98.54 -3.99C98.54 0.13 99.83 5.15 103.03 8.36C106.23 11.56 112.91 14.01 117.74 15.21Z\"/><path id=\"pistol-squat-m-z-e-elbowcap.l\" d=\"M222.7 -3.99a14.08 14.08 0 1 0 28.16 0a14.08 14.08 0 1 0 -28.16 0Z\"/><path id=\"pistol-squat-m-z-e-fore.l\" d=\"M236.78 10.73C240.53 11.81 244.94 11.65 248 11.93C251.05 12.22 252.61 12.32 255.1 12.44C257.59 12.56 257.43 12.82 262.95 12.65C268.46 12.49 280.39 12.1 288.18 11.47C295.96 10.84 302.66 9.84 309.67 8.86C316.68 7.89 325.57 6.73 330.23 5.61C334.88 4.5 335.98 3.78 337.58 2.18C339.18 0.58 339.83 -1.93 339.83 -3.99C339.83 -6.04 339.18 -8.56 337.58 -10.16C335.98 -11.76 334.88 -12.47 330.23 -13.59C325.57 -14.7 316.68 -15.86 309.67 -16.84C302.66 -17.81 295.96 -18.81 288.18 -19.44C280.39 -20.07 268.46 -20.46 262.95 -20.63C257.43 -20.79 257.59 -20.54 255.1 -20.42C252.61 -20.3 251.05 -20.19 248 -19.9C244.94 -19.62 240.53 -19.78 236.78 -18.71C233.04 -17.63 227.96 -15.9 225.51 -13.45C223.05 -11 222.06 -7.14 222.06 -3.99C222.06 -0.83 223.05 3.02 225.51 5.48C227.96 7.93 233.04 9.66 236.78 10.73Z\"/><path id=\"pistol-squat-m-z-e-fist.l\" d=\"M349.22 -3.99a12.8 12.8 0 1 0 25.6 0a12.8 12.8 0 1 0 -25.6 0Z\"/><path id=\"pistol-squat-m-z-e-head\" d=\"M174.33 -122.01C179.6 -119.64 187.93 -115.7 192.26 -111.4C196.6 -107.09 199.08 -101.42 200.35 -96.19C201.62 -90.96 200.68 -84.95 199.91 -80.01C199.13 -75.07 197.41 -71.27 195.69 -66.56C193.98 -61.84 191.76 -56.07 189.62 -51.74C187.48 -47.41 185.34 -43.42 182.84 -40.59C180.33 -37.75 177.92 -34.88 174.58 -34.74C171.23 -34.59 166.11 -37.37 162.77 -39.72C159.42 -42.07 157.15 -45.17 154.51 -48.85C151.88 -52.53 150.69 -57.05 146.97 -61.81C143.25 -66.57 135.47 -72.01 132.21 -77.4C128.95 -82.79 127.46 -88.67 127.41 -94.14C127.35 -99.6 129.17 -105.53 131.89 -110.21C134.62 -114.89 138.97 -119.67 143.76 -122.24C148.56 -124.8 155.57 -125.66 160.66 -125.62C165.76 -125.58 169.06 -124.38 174.33 -122.01Z\"/><path id=\"pistol-squat-m-z-e-torso\" d=\"M135.49 -71.44C128.42 -70.72 129 -59.29 125.54 -55.31C122.07 -51.33 119.3 -49.75 114.72 -47.57C110.14 -45.39 103.94 -45.52 98.04 -42.24C92.14 -38.96 85.33 -33.41 79.31 -27.88C73.28 -22.36 67.71 -16.72 61.87 -9.09C56.03 -1.46 49.79 8.62 44.24 17.89C38.69 27.16 33.1 38.47 28.57 46.52C24.05 54.56 21.74 60.97 17.12 66.15C12.5 71.32 7.13 74.06 0.85 77.56C-5.43 81.07 -14.45 83.52 -20.57 87.16C-26.68 90.8 -32.09 94.76 -35.85 99.4C-39.61 104.04 -42.52 109.68 -43.12 115.03C-43.71 120.38 -42.29 126.16 -39.4 131.51C-36.51 136.86 -30.97 142.21 -25.77 147.13C-20.57 152.05 -14.33 157.56 -8.2 161.04C-2.06 164.51 4.5 168.63 11.04 167.98C17.57 167.34 23.74 162.63 30.99 157.15C38.23 151.67 46.99 142.73 54.5 135.11C62.01 127.48 69.35 119.72 76.05 111.42C82.74 103.11 88.48 92.61 94.66 85.26C100.83 77.9 107.11 72.73 113.07 67.29C119.03 61.85 124.94 58.45 130.41 52.6C135.88 46.74 141.89 39.25 145.89 32.17C149.89 25.08 152.78 16.65 154.4 10.07C156.02 3.49 154.77 -1.26 155.61 -7.3C156.45 -13.34 157.9 -19.51 159.43 -26.15C160.96 -32.79 163.37 -41.58 164.79 -47.15C166.22 -52.73 172.85 -55.57 167.97 -59.62C163.08 -63.67 142.56 -72.16 135.49 -71.44Z\"/><path id=\"pistol-squat-m-z-e-thigh.r\" d=\"M17.03 157.31C24.2 156.41 29.2 151.75 34.23 149.54C39.27 147.33 42.89 145.8 47.26 144.05C51.63 142.3 52.19 142.33 60.45 139.03C68.7 135.72 85.3 129.36 96.79 124.23C108.27 119.1 118.82 113.66 129.37 108.24C139.92 102.83 153.25 96.21 160.1 91.75C166.95 87.29 168.74 85.16 170.48 81.47C172.22 77.79 171.79 73.14 170.54 69.65C169.29 66.17 166.67 62.3 162.99 60.56C159.3 58.82 156.57 58.31 148.44 59.22C140.32 60.12 125.82 63.48 114.23 66C102.64 68.53 91.04 71.02 78.91 74.35C66.78 77.69 49.92 83.32 41.44 86.01C32.97 88.7 32.55 89.09 28.07 90.51C23.58 91.93 19.81 93.04 14.52 94.54C9.22 96.03 2.41 95.6 -3.7 99.47C-9.81 103.34 -19.06 111.19 -22.15 117.74C-25.25 124.29 -24.48 132.56 -22.26 138.75C-20.04 144.95 -15.38 151.83 -8.83 154.92C-2.28 158.01 9.85 158.2 17.03 157.31Z\"/><path id=\"pistol-squat-m-z-e-kneecap.r\" d=\"~~DUqYXewP30\"/><path id=\"pistol-squat-m-z-e-shank.r\" d=\"~#F12wwrH*cTztz!9YiznY2P1*A2AN4_mK9(ax5HJ2GV4wx1Ekyf-pN1TD1N!2.I4r*bx3Ro--2_x4X2O1wb.rKH1A9V.1UA1Ir_N1R2yD200100020000000000000000101012010100200021002001111200000020000000020002101000021\"/><path id=\"pistol-squat-m-z-e-foot.r\" d=\"~#o2wJcPRD1)XdOxA1ww1w8wJ1)jww2).1ww7)7))5)b*)2)jz!10*E3wc)r)vwF2)r)X1ww2002000002000200020200020000010002000202000002020\"/><path id=\"pistol-squat-m-z-e-shcap.r\" d=\"^82\"/><path id=\"pistol-squat-m-z-e-upper.r\" d=\"^83\"/><path id=\"pistol-squat-m-z-e-elbowcap.r\" d=\"^84\"/><path id=\"pistol-squat-m-z-e-fore.r\" d=\"^85\"/><path id=\"pistol-squat-m-z-e-fist.r\" d=\"^86\"/><path id=\"pistol-squat-m-z-m-head\" d=\"M197.53 -143.96C202.79 -141.59 211.12 -137.65 215.46 -133.35C219.8 -129.04 222.27 -123.38 223.55 -118.14C224.82 -112.91 223.88 -106.9 223.11 -101.96C222.33 -97.02 220.61 -93.22 218.89 -88.51C217.18 -83.8 214.96 -78.02 212.82 -73.69C210.67 -69.36 208.54 -65.37 206.03 -62.54C203.53 -59.71 201.12 -56.84 197.78 -56.69C194.43 -56.55 189.31 -59.32 185.97 -61.67C182.62 -64.02 180.34 -67.12 177.71 -70.8C175.08 -74.49 173.89 -79.01 170.17 -83.77C166.45 -88.52 158.67 -93.97 155.41 -99.35C152.15 -104.74 150.66 -110.62 150.6 -116.09C150.55 -121.56 152.37 -127.48 155.09 -132.16C157.82 -136.85 162.17 -141.62 166.96 -144.19C171.76 -146.76 178.76 -147.61 183.86 -147.57C188.95 -147.54 192.26 -146.33 197.53 -143.96Z\"/><path id=\"pistol-squat-m-z-m-torso\" d=\"M158.69 -93.39C151.62 -92.67 152.2 -81.24 148.73 -77.26C145.27 -73.29 142.5 -71.7 137.92 -69.52C133.33 -67.35 127.14 -67.47 121.24 -64.19C115.33 -60.91 108.53 -55.36 102.5 -49.83C96.48 -44.31 90.91 -38.67 85.07 -31.05C79.22 -23.42 72.99 -13.33 67.44 -4.06C61.89 5.21 56.29 16.52 51.77 24.57C47.25 32.61 44.94 39.02 40.32 44.19C35.7 49.37 30.33 52.11 24.05 55.61C17.77 59.11 8.75 61.57 2.63 65.21C-3.49 68.85 -8.89 72.8 -12.65 77.45C-16.41 82.09 -19.33 87.72 -19.92 93.07C-20.51 98.43 -19.09 104.21 -16.2 109.56C-13.31 114.91 -7.77 120.25 -2.57 125.17C2.63 130.1 8.87 135.61 15 139.08C21.13 142.56 27.7 146.68 34.23 146.03C40.76 145.39 46.94 140.68 54.18 135.2C61.43 129.72 70.18 120.78 77.69 113.16C85.21 105.53 92.55 97.77 99.25 89.46C105.94 81.16 111.68 70.66 117.85 63.3C124.02 55.95 130.31 50.78 136.27 45.34C142.23 39.9 148.14 36.5 153.61 30.65C159.08 24.79 165.09 17.3 169.09 10.21C173.09 3.12 175.98 -5.31 177.6 -11.88C179.22 -18.46 177.97 -23.22 178.81 -29.25C179.65 -35.29 181.1 -41.46 182.63 -48.1C184.16 -54.75 186.57 -63.53 187.99 -69.11C189.41 -74.68 196.05 -77.52 191.17 -81.57C186.28 -85.62 165.76 -94.11 158.69 -93.39Z\"/><path id=\"pistol-squat-m-z-m-thigh.l\" d=\"M22.73 136.32C29.23 139.49 35.96 138.32 41.39 139.22C46.81 140.13 50.68 140.82 55.29 141.74C59.91 142.66 60.37 143 69.09 144.74C77.8 146.49 95.18 150.23 107.6 152.22C120.03 154.2 131.83 155.4 143.63 156.64C155.42 157.87 170.2 159.62 178.38 159.62C186.55 159.63 189.22 158.82 192.69 156.69C196.16 154.56 198.34 150.43 199.2 146.82C200.06 143.22 199.97 138.55 197.84 135.08C195.71 131.61 193.7 129.69 186.4 126.01C179.1 122.32 165.12 117.21 154.04 112.99C142.95 108.77 131.88 104.51 119.9 100.68C107.92 96.84 90.72 92.34 82.15 89.96C73.58 87.58 73.02 87.68 68.49 86.41C63.95 85.15 60.19 84.03 54.94 82.38C49.69 80.74 44.22 76.66 36.99 76.55C29.76 76.45 17.72 77.98 11.55 81.77C5.38 85.56 1.51 92.91 -0.02 99.31C-1.55 105.71 -1.4 114.02 2.39 120.19C6.18 126.35 16.23 133.15 22.73 136.32Z\"/><path id=\"pistol-squat-m-z-m-kneecap.l\" d=\"~~(zw1U!rwP30\"/><path id=\"pistol-squat-m-z-m-shank.l\" d=\"~#F12w-y1NKvGFv.FuVrGbo)2w!4WoXfzj*7*8xB5Vt.sXpBt*6GB1!9Vw5*O1EbJ4RmwaHW4HP1ly3-tK2wl(B1JU1SN1_U1ScWz2.h00000100200101110000000000000101010000000000000000010100000000200000202000020000\"/><path id=\"pistol-squat-m-z-m-foot.l\" d=\"~#o2(U(1PzB1VE!1-Sz1!9KvGhzK1zY1Oz2J5xw7In((5XpU(2R3(.1_5PF3Tx1yqVnOG2S!1U.1000220000101000020010110000002000002000002010000\"/><path id=\"pistol-squat-m-z-m-shcap.l\" d=\"M121.74 -25.94a19.2 19.2 0 1 0 38.4 0a19.2 19.2 0 1 0 -38.4 0Z\"/><path id=\"pistol-squat-m-z-m-upper.l\" d=\"M140.94 -6.74C145.77 -5.53 151.06 -6.46 155.22 -6.36C159.39 -6.27 162.37 -6.21 165.94 -6.17C169.51 -6.12 169.91 -5.96 176.65 -6.1C183.4 -6.23 196.89 -6.48 206.41 -6.98C215.94 -7.49 224.86 -8.32 233.79 -9.13C242.72 -9.94 253.82 -10.57 259.98 -11.86C266.14 -13.15 268.42 -14.54 270.77 -16.89C273.11 -19.24 274.06 -22.92 274.06 -25.94C274.06 -28.96 273.11 -32.64 270.77 -34.99C268.42 -37.34 266.14 -38.73 259.98 -40.02C253.82 -41.31 242.72 -41.94 233.79 -42.75C224.86 -43.56 215.94 -44.39 206.41 -44.9C196.89 -45.4 183.4 -45.64 176.65 -45.78C169.91 -45.92 169.51 -45.75 165.94 -45.71C162.37 -45.67 159.39 -45.61 155.22 -45.52C151.06 -45.42 145.77 -46.35 140.94 -45.14C136.11 -43.93 129.43 -41.48 126.23 -38.28C123.03 -35.08 121.74 -30.05 121.74 -25.94C121.74 -21.83 123.03 -16.8 126.23 -13.6C129.43 -10.4 136.11 -7.94 140.94 -6.74Z\"/><path id=\"pistol-squat-m-z-m-elbowcap.l\" d=\"M245.9 -25.94a14.08 14.08 0 1 0 28.16 0a14.08 14.08 0 1 0 -28.16 0Z\"/><path id=\"pistol-squat-m-z-m-fore.l\" d=\"M259.98 -11.22C263.73 -10.14 268.14 -10.31 271.19 -10.02C274.25 -9.74 275.8 -9.63 278.3 -9.51C280.79 -9.39 280.63 -9.14 286.15 -9.3C291.66 -9.46 303.59 -9.85 311.37 -10.49C319.16 -11.12 325.86 -12.11 332.87 -13.09C339.87 -14.06 348.77 -15.23 353.42 -16.34C358.08 -17.45 359.18 -18.17 360.78 -19.77C362.38 -21.37 363.02 -23.88 363.02 -25.94C363.02 -28 362.38 -30.51 360.78 -32.11C359.18 -33.71 358.08 -34.43 353.42 -35.54C348.77 -36.65 339.87 -37.81 332.87 -38.79C325.86 -39.77 319.16 -40.76 311.37 -41.39C303.59 -42.02 291.66 -42.42 286.15 -42.58C280.63 -42.74 280.79 -42.49 278.3 -42.37C275.8 -42.25 274.25 -42.14 271.19 -41.86C268.14 -41.57 263.73 -41.74 259.98 -40.66C256.23 -39.58 251.16 -37.85 248.7 -35.4C246.25 -32.95 245.26 -29.09 245.26 -25.94C245.26 -22.79 246.25 -18.93 248.7 -16.48C251.16 -14.02 256.23 -12.29 259.98 -11.22Z\"/><path id=\"pistol-squat-m-z-m-fist.l\" d=\"M372.42 -25.94a12.8 12.8 0 1 0 25.6 0a12.8 12.8 0 1 0 -25.6 0Z\"/><path id=\"pistol-squat-m-z-m-thigh.r\" d=\"M34.15 136.86C41.36 137.43 47.19 133.88 52.57 132.74C57.95 131.6 61.8 130.83 66.44 130C71.07 129.17 71.62 129.32 80.37 127.76C89.13 126.19 106.67 123.33 118.96 120.63C131.25 117.94 142.67 114.74 154.1 111.58C165.53 108.42 179.93 104.64 187.54 101.66C195.16 98.68 197.34 96.95 199.79 93.7C202.24 90.45 202.76 85.8 202.24 82.14C201.72 78.47 199.94 74.15 196.69 71.7C193.43 69.25 190.86 68.2 182.72 67.44C174.58 66.68 159.7 67.03 147.84 67.15C135.98 67.27 124.12 67.36 111.56 68.17C99.01 68.97 81.35 71.07 72.51 71.99C63.67 72.9 63.18 73.2 58.5 73.68C53.81 74.16 49.9 74.49 44.41 74.88C38.93 75.27 32.34 73.47 25.57 76.02C18.8 78.57 8.16 84.38 3.8 90.17C-0.55 95.95 -1.48 104.21 -0.56 110.73C0.36 117.24 3.53 124.92 9.31 129.28C15.1 133.63 26.94 136.28 34.15 136.86Z\"/><path id=\"pistol-squat-m-z-m-kneecap.r\" d=\"~~yVw1NPgwP30\"/><path id=\"pistol-squat-m-z-m-shank.r\" d=\"~#F12_Nx1!yeXAA1KRbyn-iJ2y2Gw3A*3HoR4Wb-2wG3Vy4JA1zdykBmA9TB1wX3BW3P1*bw2RoGS3!J3G2x2JgxpII1c*x2WnEA1JF1VgyA201100200011011000001110010000002000100200000001000000000000001100000000020000001\"/><path id=\"pistol-squat-m-z-m-foot.r\" d=\"~#o2__dyGA1VTfTxy1DuFdYN1EcFG2IP1y(6wuz.5GJ1G.2.z1B.1BaKF3T5EmIA1WI2If)x2UV1000100002000200002010010101101200201001012000000\"/><path id=\"pistol-squat-m-z-m-shcap.r\" d=\"^99\"/><path id=\"pistol-squat-m-z-m-upper.r\" d=\"^100\"/><path id=\"pistol-squat-m-z-m-elbowcap.r\" d=\"^101\"/><path id=\"pistol-squat-m-z-m-fore.r\" d=\"^102\"/><path id=\"pistol-squat-m-z-m-fist.r\" d=\"^103\"/><path id=\"pistol-squat-m-z-mo-0\" d=\"^87\"/><path id=\"pistol-squat-m-z-mo-1\" d=\"^88\"/><path id=\"pistol-squat-m-z-mo-2\" d=\"^78\"/><path id=\"pistol-squat-m-z-mo-3\" d=\"^79\"/><path id=\"pistol-squat-m-z-mo-4\" d=\"^80\"/><path id=\"pistol-squat-m-z-mo-5\" d=\"^81\"/><path id=\"pistol-squat-m-z-mo-6\" d=\"^82\"/><path id=\"pistol-squat-m-z-mo-7\" d=\"^83\"/><path id=\"pistol-squat-m-z-mo-8\" d=\"^84\"/><path id=\"pistol-squat-m-z-mo-9\" d=\"^85\"/><path id=\"pistol-squat-m-z-mo-10\" d=\"^86\"/><path id=\"pistol-squat-m-z-mo-11\" d=\"^89\"/><path id=\"pistol-squat-m-z-mo-12\" d=\"^90\"/><path id=\"pistol-squat-m-z-mo-13\" d=\"^91\"/><path id=\"pistol-squat-m-z-mo-14\" d=\"^92\"/><path id=\"pistol-squat-m-z-mo-15\" d=\"^82\"/><path id=\"pistol-squat-m-z-mo-16\" d=\"^83\"/><path id=\"pistol-squat-m-z-mo-17\" d=\"^84\"/><path id=\"pistol-squat-m-z-mo-18\" d=\"^85\"/><path id=\"pistol-squat-m-z-mo-19\" d=\"^86\"/></defs>\n  \n  <path class=\"floorline\" d=\"M-171.25 236.9H468.77\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-z-st-thigh.l\"/><use href=\"#pistol-squat-m-z-st-kneecap.l\"/><use href=\"#pistol-squat-m-z-st-shank.l\"/><use href=\"#pistol-squat-m-z-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-m-z-st-thigh.l\"/><use href=\"#pistol-squat-m-z-st-kneecap.l\"/><use href=\"#pistol-squat-m-z-st-shank.l\"/><use href=\"#pistol-squat-m-z-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-z-st-head\"/><use href=\"#pistol-squat-m-z-st-torso\"/><use href=\"#pistol-squat-m-z-st-thigh.r\"/><use href=\"#pistol-squat-m-z-st-kneecap.r\"/><use href=\"#pistol-squat-m-z-st-shank.r\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-m-z-st-head\"/><use href=\"#pistol-squat-m-z-st-torso\"/><use href=\"#pistol-squat-m-z-st-thigh.r\"/><use href=\"#pistol-squat-m-z-st-kneecap.r\"/><use href=\"#pistol-squat-m-z-st-shank.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-z-e-thigh.l\"/><use href=\"#pistol-squat-m-z-e-kneecap.l\"/><use href=\"#pistol-squat-m-z-e-shank.l\"/><use href=\"#pistol-squat-m-z-e-foot.l\"/><use href=\"#pistol-squat-m-z-e-shcap.l\"/><use href=\"#pistol-squat-m-z-e-upper.l\"/><use href=\"#pistol-squat-m-z-e-elbowcap.l\"/><use href=\"#pistol-squat-m-z-e-fore.l\"/><use href=\"#pistol-squat-m-z-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-m-z-e-thigh.l\"/><use href=\"#pistol-squat-m-z-e-kneecap.l\"/><use href=\"#pistol-squat-m-z-e-shank.l\"/><use href=\"#pistol-squat-m-z-e-foot.l\"/><use href=\"#pistol-squat-m-z-e-shcap.l\"/><use href=\"#pistol-squat-m-z-e-upper.l\"/><use href=\"#pistol-squat-m-z-e-elbowcap.l\"/><use href=\"#pistol-squat-m-z-e-fore.l\"/><use href=\"#pistol-squat-m-z-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-z-e-head\"/><use href=\"#pistol-squat-m-z-e-torso\"/><use href=\"#pistol-squat-m-z-e-thigh.r\"/><use href=\"#pistol-squat-m-z-e-kneecap.r\"/><use href=\"#pistol-squat-m-z-e-shank.r\"/><use href=\"#pistol-squat-m-z-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-m-z-e-head\"/><use href=\"#pistol-squat-m-z-e-torso\"/><use href=\"#pistol-squat-m-z-e-thigh.r\"/><use href=\"#pistol-squat-m-z-e-kneecap.r\"/><use href=\"#pistol-squat-m-z-e-shank.r\"/><use href=\"#pistol-squat-m-z-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-z-e-shcap.r\"/><use href=\"#pistol-squat-m-z-e-upper.r\"/><use href=\"#pistol-squat-m-z-e-elbowcap.r\"/><use href=\"#pistol-squat-m-z-e-fore.r\"/><use href=\"#pistol-squat-m-z-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pistol-squat-m-z-e-shcap.r\"/><use href=\"#pistol-squat-m-z-e-upper.r\"/><use href=\"#pistol-squat-m-z-e-elbowcap.r\"/><use href=\"#pistol-squat-m-z-e-fore.r\"/><use href=\"#pistol-squat-m-z-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"117.74\" cy=\"-3.99\" r=\"2.25\"/><circle class=\"joint\" cx=\"236.78\" cy=\"-3.99\" r=\"2.25\"/><circle class=\"joint\" cx=\"6.66\" cy=\"128.39\" r=\"2.25\"/><circle class=\"joint\" cx=\"154.27\" cy=\"75.48\" r=\"2.25\"/></g><mask id=\"pistol-squat-m-z-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#pistol-squat-m-z-m-head\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-torso\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-thigh.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-kneecap.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-shank.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-foot.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-shcap.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-upper.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-elbowcap.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-fore.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-fist.l\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-thigh.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-kneecap.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-shank.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-foot.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-shcap.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-upper.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-elbowcap.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-fore.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-m-fist.r\" fill=\"#000\"/><use href=\"#pistol-squat-m-z-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pistol-squat-m-z-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#pistol-squat-m-z-mmask)\"><g class=\"u-stroke\"><use href=\"#pistol-squat-m-z-m-head\"/><use href=\"#pistol-squat-m-z-m-torso\"/><use href=\"#pistol-squat-m-z-m-thigh.l\"/><use href=\"#pistol-squat-m-z-m-kneecap.l\"/><use href=\"#pistol-squat-m-z-m-shank.l\"/><use href=\"#pistol-squat-m-z-m-foot.l\"/><use href=\"#pistol-squat-m-z-m-shcap.l\"/><use href=\"#pistol-squat-m-z-m-upper.l\"/><use href=\"#pistol-squat-m-z-m-elbowcap.l\"/><use href=\"#pistol-squat-m-z-m-fore.l\"/><use href=\"#pistol-squat-m-z-m-fist.l\"/><use href=\"#pistol-squat-m-z-m-thigh.r\"/><use href=\"#pistol-squat-m-z-m-kneecap.r\"/><use href=\"#pistol-squat-m-z-m-shank.r\"/><use href=\"#pistol-squat-m-z-m-foot.r\"/><use href=\"#pistol-squat-m-z-m-shcap.r\"/><use href=\"#pistol-squat-m-z-m-upper.r\"/><use href=\"#pistol-squat-m-z-m-elbowcap.r\"/><use href=\"#pistol-squat-m-z-m-fore.r\"/><use href=\"#pistol-squat-m-z-m-fist.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~Mw_bPVI1Lw_cFD2\"/><path class=\"m-line\" d=\"~M__dyGA1L.Y1NE2LDuFdLYN1EcLFG2IP1Ly(6wuLz.5GJ1LG.2.z1LB.1BaLKF3T5LEmIA1LWI2IfL)x2UV1\"/><path class=\"m-arrow\" d=\"~MAN6PBN1L0)O2MYiwpLXi)oL0wS1\"/></g>\n</g><circle class=\"pz-ring\" cx=\"60\" cy=\"230\" r=\"52\"/></g></svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"pistol-squat-m-heel\" data-key=\"heel\" data-cue=\"The standing heel comes off the floor at the bottom.\" class=\"plate-callout m\" style=\"left:11.17%;top:84.08%\" aria-pressed=\"true\">Heel lifts</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "arms",
        cues: [{ key: "arms", cue: "Reach your arms forward for balance." }, { key: "leg", cue: "Hold the free leg out in front, knee straight." }, { key: "heel", cue: "Keep the whole standing foot flat on the floor." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "heel",
        cues: [{ key: "heel", cue: "The standing heel comes off the floor at the bottom." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Heel lifts</b><span>The standing heel comes off the floor at the bottom.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower slow, drive up slow\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>Slow</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Drive up</b><span>Slow</span></div></div></div>",
      alt: "Pistol squat, side view. Standing on one leg with the arms reaching forward and the other leg lifted in front, the lifter sits the hips back and bends the standing knee fully, the standing foot flat and the free leg straight and hovering forward.",
      mistakeAlt: "Pistol Squat: the common mistake, drawn dashed in the mistake colour over the correct end position.",
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
      "kind": "safety",
      "text": "Master air squats and single-leg balance first.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "physitrack-pistol",
          "rep-pistol"
        ],
        "note": "p6, p7"
      }
    },
    {
      "kind": "safety",
      "text": "While learning, squat to a box behind you or hold a support.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-pistol"
        ],
        "note": "p7"
      }
    },
    {
      "kind": "position",
      "text": "On one leg, arms forward, lift the other leg forward, knee straight.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-pistol",
          "physitrack-pistol"
        ],
        "note": "p1, p5"
      }
    },
    {
      "kind": "brace",
      "text": "Brace, hips back, bend the knee without letting it cave in.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-pistol"
        ],
        "note": "p2, p8"
      }
    },
    {
      "kind": "position",
      "text": "Go as low as mobility allows, foot flat. Press up, no bounce.",
      "zoom": "standing-foot",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-pistol"
        ],
        "note": "p3, p4, p8"
      }
    }
  ],
  posture: [
    {
      "key": "arms",
      "label": "Arms forward",
      "detail": "Arms forward for balance.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-pistol"
        ],
        "note": "p1"
      }
    },
    {
      "key": "free-leg",
      "label": "Free leg straight",
      "detail": "Free leg straight, off the floor.",
      "anchor": {
        "pose": "end",
        "at": "knee.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "physitrack-pistol"
        ],
        "note": "p5"
      }
    },
    {
      "key": "hips",
      "label": "Hips back",
      "detail": "Hips go back as the knee bends.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-pistol"
        ],
        "note": "p2"
      }
    },
    {
      "key": "heel",
      "label": "Heel down",
      "detail": "Standing foot flat, heel down.",
      "anchor": {
        "pose": "end",
        "at": "heel.r"
      },
      "zoom": "standing-foot",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-pistol"
        ],
        "note": "p3"
      }
    },
    {
      "key": "depth",
      "label": "Depth",
      "detail": "As deep as mobility allows.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-pistol"
        ],
        "note": "p3"
      }
    },
    {
      "key": "knee",
      "label": "Knee in line",
      "detail": "Knee does not cave inward.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-pistol"
        ],
        "note": "p8"
      }
    },
    {
      "key": "bounce",
      "label": "Bouncing at bottom",
      "detail": "Lower slowly and stand without a bounce.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-pistol"
        ],
        "note": "p8"
      }
    },
    {
      "key": "basics",
      "label": "Skipping the basics",
      "detail": "Master air squats and single-leg balance, then use a box.",
      "anchor": {
        "pose": "start",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "physitrack-pistol",
          "rep-pistol"
        ],
        "note": "p6, p7"
      }
    },
    {
      "key": "knee-pain",
      "label": "Pushing through pain",
      "detail": "Back off, check your form, or use an easier version.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-pistol"
        ],
        "note": "p9"
      }
    }
  ],
  zooms: [
    {
      "key": "standing-foot",
      "chip": "Foot",
      "heading": "Standing foot",
      "kind": "posture"
    }
  ],
  chips: [
    "standing-foot",
    "feel"
  ],
  copy: {
    "setupLine": "A box behind you to sit onto, or a support to hold, while learning.",
    "mistakeLine": "Never bounce out of the bottom. Keep the knee from caving inward.",
    "cueLine": "Arms forward, heel down."
  },
  mistakes: [],
  risks: [
    {
      "key": "knee-demand",
      "text": "High knee demand in the deep single-leg bend.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-pistol"
        ],
        "note": "p9"
      }
    },
    {
      "key": "basics",
      "text": "Advanced skill: attempting it before the basics.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "physitrack-pistol"
        ],
        "note": "p6"
      }
    }
  ],
  riskFlags: [
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
    "rep-pistol",
    "physitrack-pistol",
    "nhs-knee",
    "nhs-knee-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/pistol_squat.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

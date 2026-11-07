// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=77bac1ed487299b370b903166ccbb97373667178fb3f81f3971cc5bd800b9f3f
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_straight_arm_pulldown",
  name: "Straight-Arm Pulldown",
  hashes: { inputsSha256: "77bac1ed487299b370b903166ccbb97373667178fb3f81f3971cc5bd800b9f3f", golden: "3154819bfdc5ea5448fccd1cfcd64882f7d204f0ef3084d7c6ca6e5cd7d70cf5" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"straight-arm-pulldown-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"straight-arm-pulldown-n-st-upper.l\" d=\"~#F12DKoJUv*TnREw1K6W437Uv)r*5w1-2mXtFhXiJ3KbF9O7PhEnDpG1Y2G2N5Fy1Vo86)5H5D8wcNpV4YfRcAa-n00000200000200101100220000010000000000000010120000020000000010010000002000000010\"/><path id=\"straight-arm-pulldown-n-st-elbowcap.l\" d=\"~~yxt_KpPv1\"/><path id=\"straight-arm-pulldown-n-st-fore.l\" d=\"~#F12WOuwIqEYtzUq-8_2A1G1yx1Vk*8w1O27GqDd*c5*8U4G7Wa*p(dE1F2.5W6_z1zf_15I7U5(3y8(jaUdx7FbKg10000000000000101002000020000000000100000000122002101000002000001100020002000000\"/><path id=\"straight-arm-pulldown-n-st-fist.l\" d=\"~~A!A1wKlUs0\"/><path id=\"straight-arm-pulldown-n-st-upper.r\" d=\"^0\"/><path id=\"straight-arm-pulldown-n-st-elbowcap.r\" d=\"^1\"/><path id=\"straight-arm-pulldown-n-st-fore.r\" d=\"^2\"/><path id=\"straight-arm-pulldown-n-st-fist.r\" d=\"^3\"/><path id=\"straight-arm-pulldown-n-g0-upper.r\" d=\"~#F12WUnW*vBVmR(v*722bYG1I4K5O2T2E1.x1B3Bhz8VeqEg(9Ex1(6T2N1)4A3wH150a-7qjSePn(aykx1ymOd00000020010000120020010200002100000000001110002000000000000101010101010000101022\"/><path id=\"straight-arm-pulldown-n-g0-elbowcap.r\" d=\"~~_YuPAuPv1\"/><path id=\"straight-arm-pulldown-n-g0-fore.r\" d=\"~#F12w_vHBv*wv*zvB9vS1rPD1x5K8X2B2G1GtA1VbR5xaixbW6Et(1)1S1B8U3_D1y1Y1iz9y28y9wiN8HfnyhIa02020000110000200010120200002000002000002000000000010120000000010101000000010000\"/><path id=\"straight-arm-pulldown-n-g0-fist.r\" d=\"~~ySE1(VtUs0\"/><path id=\"straight-arm-pulldown-n-g1-upper.r\" d=\"~#F12H.myXv)wmGBvO6T447_A1!k*2B5O1R2*pRmG9RgKc.7*iK1Iv.d)29*5fPy1Po58.6*3X8UbUcSmwh_a_p!100011011001100000001010100000200000020000010011100001200000121200000000000000000\"/><path id=\"straight-arm-pulldown-n-g1-elbowcap.r\" d=\"~~URtSwz1Pv1\"/><path id=\"straight-arm-pulldown-n-g1-fore.r\" d=\"~#F12ABuD)z1-NtRTz1*7X4Y11HB1HbT6x6K1x2ErBbK8-9G9V3*cS1OrIaO2i*81yz1yhF1D1z9.1K3J8!cAfHeU5YjI200200200010000010100100101100000001010200000000000200001110010000000000000000002\"/><path id=\"straight-arm-pulldown-n-g1-fist.r\" d=\"~~!YB1SDD1Us0\"/><path id=\"straight-arm-pulldown-n-g2-upper.r\" d=\"~#F12!Im(BvK(lxGuE3G7a3YkwB14)52*2Va.w1m)iT6EdKf)a.jEsG2.1.4O3(gwE172.3*6OdP5p(p(8(hAlwf20010100010000000002001002000000100000021001000020020000010100021010000101012002\"/><path id=\"straight-arm-pulldown-n-g2-elbowcap.r\" d=\"~~YFqDwD1Pv1\"/><path id=\"straight-arm-pulldown-n-g2-fore.r\" d=\"~#F12wOqJVD1*wqKwD1V4x8P1sNrYr*2O89K2Ri*mX2TcI6X7zcX4BjImO2j-7K4Um_viW1z7)5x7W5A4Nj!9_bNiJ701000000000020001100000001001000200002000002100100000200100200000000200000020020\"/><path id=\"straight-arm-pulldown-n-g2-fist.r\" d=\"~~U)vUWJ1Us0\"/><path id=\"straight-arm-pulldown-n-e-thigh.l\" d=\"~#F12!HjYVH1TzjEJG1R2Eaz12H8SX1W4O7A2X3B2KO1y9OlV1)h.cKjX6xO1X2E3*5O6A2AY1A13iRaVs)7zgFD1(2ww1wnSy101200000000000000001000010100000000000011100200020020000101000002000001010210101\"/><path id=\"straight-arm-pulldown-n-e-kneecap.l\" d=\"~~!ElAJV1yF10\"/><path id=\"straight-arm-pulldown-n-e-shank.l\" d=\"~#F12SDlYFV1GKl*(T1P2Iay125PY1(5R6W2I3P1*.1P7RbqXaO5TcD8K.1B2V3-4K7-8YX1z11nVaGcP9OdylT1Hjwawn00200200000200220001000000020010000000200000101000000000000101101020001101001220\"/><path id=\"straight-arm-pulldown-n-e-foot.l\" d=\"~#o2y_kJI)1-GlXN(1Jb_2Yfz7_mKl_O2.2IA2E4By1E7Il2xB1H4)9KbYpxaxk!m001000220010100200220000000200000000112100011000\"/><path id=\"straight-arm-pulldown-n-e-shcap.l\" d=\"~~NEm!Su(H10\"/><path id=\"straight-arm-pulldown-n-e-upper.l\" d=\"~#F12PEmyPuKHmIPtu.7a0lPH1A3x5P1T2J7-x1AazguVe*7Ih-2Ky1z1-2O2K5.4FH1914*7Ie)1Xd(lG1AkWaSn00200000000000001000012000002000101001000000000002200200000000000011000002100101\"/><path id=\"straight-arm-pulldown-n-e-elbowcap.l\" d=\"~~NxmU.D1Pv1\"/><path id=\"straight-arm-pulldown-n-e-fore.l\" d=\"~#F12SwmUxE1T(lKFD13I9sP1FaWB1S1-8w1I2*4)s(3Kc.1-9x8za-5*s-1-1T4T7w4YD19_1E3-8.8S1x6(iY2AfPcNf00010011002000000101000002000110000000001010100000000000000101200000000001210002\"/><path id=\"straight-arm-pulldown-n-e-fist.l\" d=\"~~NXn(NO1Us0\"/><path id=\"straight-arm-pulldown-n-e-head\" d=\"~#w12yApy-lOYnVFl-j(dKiP5I9R4R3Y3)2-7E5zbxcKmD6Oa4X8*g*2PlK6Wkz2!hw6JeAhI4Wg0101001012100002001000000010001010000110110101000000000210021010\"/><path id=\"straight-arm-pulldown-n-e-torso\" d=\"~#_12DynNXp.RnxPoK7z7-2fY5whN7A7Y8ygW5w1*1zmOiRa)bH2!e-1FjI2FmRaFi-cW5X7R4GfOiBz1T5VpT5x1K8K1Y8ygS1S7)9x9GfS4.8JhU4S6wd-7S1P7BN2Ff00000000000000000010000000000010000200200000100020000001000000000200200121000000100000200000000012100010001000000010\"/><path id=\"straight-arm-pulldown-n-e-thigh.r\" d=\"^16\"/><path id=\"straight-arm-pulldown-n-e-kneecap.r\" d=\"^17\"/><path id=\"straight-arm-pulldown-n-e-shank.r\" d=\"^18\"/><path id=\"straight-arm-pulldown-n-e-foot.r\" d=\"^19\"/><path id=\"straight-arm-pulldown-n-e-shcap.r\" d=\"^20\"/><path id=\"straight-arm-pulldown-n-e-upper.r\" d=\"^21\"/><path id=\"straight-arm-pulldown-n-e-elbowcap.r\" d=\"^22\"/><path id=\"straight-arm-pulldown-n-e-fore.r\" d=\"^23\"/><path id=\"straight-arm-pulldown-n-e-fist.r\" d=\"^24\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#straight-arm-pulldown-n-dots)\"/>\n  <path class=\"floorline\" d=\"M81.45 338.85H336.55\"/><path class=\"eq\" d=\"~MywX1N!x2L0Bz-1Q0E6E6(!Y1LBmF6QE60DmF6LF6(!Y1Q0F6F6*!Y1LDmE6QF60BmE6Z\"/><path class=\"eq\" d=\"~MAK(1N!x2L0Bz-1Q0E6E6(!Y1LzmF6QE60AmF6LF6(!Y1Q0F6F6*!Y1LAmE6QF60zmE6Z\"/><path class=\"eq\" d=\"~MJ*V1yAaLPG80QF60Ez8E6LE6GuQ0E6E6HuLEz8F6QE60Fz8F6LF6HuQ0F6F6GuZ\"/><path class=\"eq\" d=\"~MJJU1Wyy2LSIb0QF60GBbE6LE6rQ0E6E6sLGBbF6QE60HBbF6LF6sQ0F6F6rZ\"/><path class=\"eq\" d=\"~MNNX1Wyy2LJE50QF60zx5E6LE6GuQ0E6E6HuLzx5F6QE60Ax5F6LF6HuQ0F6F6GuZ\"/><path class=\"eq\" d=\"~MDFX1yN.1L!T50L.T5Sz5L.T5Rz5Z\"/><path class=\"eq-thin\" d=\"M282.91 327.23H311.69M282.91 323.96H311.69M282.91 320.69H311.69M282.91 317.41H311.69M282.91 314.14H311.69M282.91 310.87H311.69M282.91 307.6H311.69\"/><path class=\"eq-solid\" d=\"~~PGT1H*b_A11\"/><path class=\"eq-pin\" d=\"~~wFU1H*bF60\"/><path class=\"eq\" d=\"~~SB-1S!aUs0\"/><path class=\"eq-pin\" d=\"~~!.-1S!aF60\"/><path class=\"eq-thin\" d=\"~MF-Y1URw2L0*SS1\"/><path class=\"eq-thin\" d=\"~MwI.1URw2L0*SS1\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-n-st-upper.l\"/><use href=\"#straight-arm-pulldown-n-st-elbowcap.l\"/><use href=\"#straight-arm-pulldown-n-st-fore.l\"/><use href=\"#straight-arm-pulldown-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-n-st-upper.l\"/><use href=\"#straight-arm-pulldown-n-st-elbowcap.l\"/><use href=\"#straight-arm-pulldown-n-st-fore.l\"/><use href=\"#straight-arm-pulldown-n-st-fist.l\"/></g></g><path class=\"eq-cable\" d=\"~MWYB1wKlLU)dEKa\"/><path class=\"eq-solid\" d=\"~~FKB1wKlNb0\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-n-st-upper.r\"/><use href=\"#straight-arm-pulldown-n-st-elbowcap.r\"/><use href=\"#straight-arm-pulldown-n-st-fore.r\"/><use href=\"#straight-arm-pulldown-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-n-st-upper.r\"/><use href=\"#straight-arm-pulldown-n-st-elbowcap.r\"/><use href=\"#straight-arm-pulldown-n-st-fore.r\"/><use href=\"#straight-arm-pulldown-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"~~FzF1(VtNb0\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-n-g0-upper.r\"/><use href=\"#straight-arm-pulldown-n-g0-elbowcap.r\"/><use href=\"#straight-arm-pulldown-n-g0-fore.r\"/><use href=\"#straight-arm-pulldown-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-n-g0-upper.r\"/><use href=\"#straight-arm-pulldown-n-g0-elbowcap.r\"/><use href=\"#straight-arm-pulldown-n-g0-fore.r\"/><use href=\"#straight-arm-pulldown-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"~~yHD1SDD1Nb0\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-n-g1-upper.r\"/><use href=\"#straight-arm-pulldown-n-g1-elbowcap.r\"/><use href=\"#straight-arm-pulldown-n-g1-fore.r\"/><use href=\"#straight-arm-pulldown-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-n-g1-upper.r\"/><use href=\"#straight-arm-pulldown-n-g1-elbowcap.r\"/><use href=\"#straight-arm-pulldown-n-g1-fore.r\"/><use href=\"#straight-arm-pulldown-n-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"~~_Pw1UWJ1Nb0\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-n-g2-upper.r\"/><use href=\"#straight-arm-pulldown-n-g2-elbowcap.r\"/><use href=\"#straight-arm-pulldown-n-g2-fore.r\"/><use href=\"#straight-arm-pulldown-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-n-g2-upper.r\"/><use href=\"#straight-arm-pulldown-n-g2-elbowcap.r\"/><use href=\"#straight-arm-pulldown-n-g2-fore.r\"/><use href=\"#straight-arm-pulldown-n-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MDFX1y(rL!T50L.T5W_3L.T5V_3Z\"/><path class=\"eq-thin\" d=\"M282.91 159.41H311.69M282.91 156.14H311.69M282.91 152.87H311.69M282.91 149.59H311.69M282.91 146.32H311.69\"/><path class=\"eq-cable\" d=\"~MyTV1H*bL0Xw1MyO4UsL0!Ag\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-n-e-thigh.l\"/><use href=\"#straight-arm-pulldown-n-e-kneecap.l\"/><use href=\"#straight-arm-pulldown-n-e-shank.l\"/><use href=\"#straight-arm-pulldown-n-e-foot.l\"/><use href=\"#straight-arm-pulldown-n-e-shcap.l\"/><use href=\"#straight-arm-pulldown-n-e-upper.l\"/><use href=\"#straight-arm-pulldown-n-e-elbowcap.l\"/><use href=\"#straight-arm-pulldown-n-e-fore.l\"/><use href=\"#straight-arm-pulldown-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-n-e-thigh.l\"/><use href=\"#straight-arm-pulldown-n-e-kneecap.l\"/><use href=\"#straight-arm-pulldown-n-e-shank.l\"/><use href=\"#straight-arm-pulldown-n-e-foot.l\"/><use href=\"#straight-arm-pulldown-n-e-shcap.l\"/><use href=\"#straight-arm-pulldown-n-e-upper.l\"/><use href=\"#straight-arm-pulldown-n-e-elbowcap.l\"/><use href=\"#straight-arm-pulldown-n-e-fore.l\"/><use href=\"#straight-arm-pulldown-n-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"~MyUo(NO1LW!qREA1\"/><path class=\"eq-solid\" d=\"~~SFo(NO1Nb0\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-n-e-head\"/><use href=\"#straight-arm-pulldown-n-e-torso\"/><use href=\"#straight-arm-pulldown-n-e-thigh.r\"/><use href=\"#straight-arm-pulldown-n-e-kneecap.r\"/><use href=\"#straight-arm-pulldown-n-e-shank.r\"/><use href=\"#straight-arm-pulldown-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-n-e-head\"/><use href=\"#straight-arm-pulldown-n-e-torso\"/><use href=\"#straight-arm-pulldown-n-e-thigh.r\"/><use href=\"#straight-arm-pulldown-n-e-kneecap.r\"/><use href=\"#straight-arm-pulldown-n-e-shank.r\"/><use href=\"#straight-arm-pulldown-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-n-e-shcap.r\"/><use href=\"#straight-arm-pulldown-n-e-upper.r\"/><use href=\"#straight-arm-pulldown-n-e-elbowcap.r\"/><use href=\"#straight-arm-pulldown-n-e-fore.r\"/><use href=\"#straight-arm-pulldown-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-n-e-shcap.r\"/><use href=\"#straight-arm-pulldown-n-e-upper.r\"/><use href=\"#straight-arm-pulldown-n-e-elbowcap.r\"/><use href=\"#straight-arm-pulldown-n-e-fore.r\"/><use href=\"#straight-arm-pulldown-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"120.7\" cy=\"156.62\" r=\"2.25\"/><circle class=\"joint\" cx=\"117.91\" cy=\"198.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"109.96\" cy=\"217.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"115.19\" cy=\"273.3\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#U20!WD1NJn-JD1GXm0000-5(12110022110x6c2112012211*5B10102012211K5V20021120021T4)32201102000I3x50102000020)1X50122000000000002000001001002002001000002000101101001010000111110100001000020012000001110000000210000120000010000120200001110110001000100100101000002002200200000101001000000\"/><path class=\"arrow\" d=\"~MDUpWFO1LDx1TpL)pN(1Z\"/></g><path class=\"leader\" d=\"M117.91 198.98L98.11 218H88.11\"/><circle class=\"anchor\" cx=\"117.91\" cy=\"198.98\" r=\"1.5\"/><path class=\"leader\" d=\"M101.95 181.21L68.26 162H58.26\"/><circle class=\"anchor\" cx=\"101.95\" cy=\"181.21\" r=\"1.5\"/><path class=\"leader\" d=\"M126.09 243.03L135 284H145\"/><circle class=\"anchor\" cx=\"126.09\" cy=\"243.03\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"straight-arm-pulldown-n-straight\" data-key=\"straight\" data-cue=\"Keep the same slight elbow bend from top to bottom. Only the shoulders move.\" class=\"plate-callout two\" style=\"left:2.79%;top:54.75%\" aria-pressed=\"true\">Arms stay<br>straight</button><button type=\"button\" id=\"straight-arm-pulldown-n-trunk\" data-key=\"trunk\" data-cue=\"Hold one trunk angle: no swing to start the rep, no arched lower back.\" class=\"plate-callout two\" style=\"left:2.79%;top:39.11%\" aria-pressed=\"false\">Trunk<br>still</button><button type=\"button\" id=\"straight-arm-pulldown-n-thighs\" data-key=\"thighs\" data-cue=\"Finish with the bar at the front of the thighs, chest tall.\" class=\"plate-callout two\" style=\"left:39.11%;top:73.18%\" aria-pressed=\"false\">Bar to<br>thighs</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"straight-arm-pulldown-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"straight-arm-pulldown-m-st-upper.l\" d=\"^0\"/><path id=\"straight-arm-pulldown-m-st-elbowcap.l\" d=\"^1\"/><path id=\"straight-arm-pulldown-m-st-fore.l\" d=\"^2\"/><path id=\"straight-arm-pulldown-m-st-fist.l\" d=\"^3\"/><path id=\"straight-arm-pulldown-m-st-upper.r\" d=\"^0\"/><path id=\"straight-arm-pulldown-m-st-elbowcap.r\" d=\"^1\"/><path id=\"straight-arm-pulldown-m-st-fore.r\" d=\"^2\"/><path id=\"straight-arm-pulldown-m-st-fist.r\" d=\"^3\"/><path id=\"straight-arm-pulldown-m-g0-upper.r\" d=\"^4\"/><path id=\"straight-arm-pulldown-m-g0-elbowcap.r\" d=\"^5\"/><path id=\"straight-arm-pulldown-m-g0-fore.r\" d=\"^6\"/><path id=\"straight-arm-pulldown-m-g0-fist.r\" d=\"^7\"/><path id=\"straight-arm-pulldown-m-g1-upper.r\" d=\"^8\"/><path id=\"straight-arm-pulldown-m-g1-elbowcap.r\" d=\"^9\"/><path id=\"straight-arm-pulldown-m-g1-fore.r\" d=\"^10\"/><path id=\"straight-arm-pulldown-m-g1-fist.r\" d=\"^11\"/><path id=\"straight-arm-pulldown-m-g2-upper.r\" d=\"^12\"/><path id=\"straight-arm-pulldown-m-g2-elbowcap.r\" d=\"^13\"/><path id=\"straight-arm-pulldown-m-g2-fore.r\" d=\"^14\"/><path id=\"straight-arm-pulldown-m-g2-fist.r\" d=\"^15\"/><path id=\"straight-arm-pulldown-m-e-thigh.l\" d=\"^16\"/><path id=\"straight-arm-pulldown-m-e-kneecap.l\" d=\"^17\"/><path id=\"straight-arm-pulldown-m-e-shank.l\" d=\"^18\"/><path id=\"straight-arm-pulldown-m-e-foot.l\" d=\"^19\"/><path id=\"straight-arm-pulldown-m-e-shcap.l\" d=\"^20\"/><path id=\"straight-arm-pulldown-m-e-upper.l\" d=\"^21\"/><path id=\"straight-arm-pulldown-m-e-elbowcap.l\" d=\"^22\"/><path id=\"straight-arm-pulldown-m-e-fore.l\" d=\"^23\"/><path id=\"straight-arm-pulldown-m-e-fist.l\" d=\"^24\"/><path id=\"straight-arm-pulldown-m-e-head\" d=\"^25\"/><path id=\"straight-arm-pulldown-m-e-torso\" d=\"^26\"/><path id=\"straight-arm-pulldown-m-e-thigh.r\" d=\"^16\"/><path id=\"straight-arm-pulldown-m-e-kneecap.r\" d=\"^17\"/><path id=\"straight-arm-pulldown-m-e-shank.r\" d=\"^18\"/><path id=\"straight-arm-pulldown-m-e-foot.r\" d=\"^19\"/><path id=\"straight-arm-pulldown-m-e-shcap.r\" d=\"^20\"/><path id=\"straight-arm-pulldown-m-e-upper.r\" d=\"^21\"/><path id=\"straight-arm-pulldown-m-e-elbowcap.r\" d=\"^22\"/><path id=\"straight-arm-pulldown-m-e-fore.r\" d=\"^23\"/><path id=\"straight-arm-pulldown-m-e-fist.r\" d=\"^24\"/><path id=\"straight-arm-pulldown-m-m-shcap.r\" d=\"^20\"/><path id=\"straight-arm-pulldown-m-m-upper.r\" d=\"~#F12SOmwJvz(lISuB4O685!pHw1l-5d.2xfTtK2-iV8.b)gK8KnOnO2G1G5R2NmYy158.4z6.cw7N3WpYbFgHnNb11010001010000002000010010000012100001120000200000000000020011100000000010000001\"/><path id=\"straight-arm-pulldown-m-m-elbowcap.r\" d=\"~~yHrPAB1Pv1\"/><path id=\"straight-arm-pulldown-m-m-fore.r\" d=\"~#F12W.swwD1RBsKID1I8Y3uK1JuXnV8!1O21IoUf.cD1K8P5z6Jb*nHgtH2z5D7Wx1Oi_19X6D6U4(7_j.1_cK8N9Oh01200000020020000000202000002010112001000000000100000220002000000000011000101000\"/><path id=\"straight-arm-pulldown-m-m-fist.r\" d=\"~~YTy1FJw1Us0\"/><path id=\"straight-arm-pulldown-m-m-eq0\" d=\"~~(Az1FJw1Nb0\"/><path id=\"straight-arm-pulldown-m-mf-head\" d=\"^25\"/><path id=\"straight-arm-pulldown-m-mf-torso\" d=\"^26\"/><path id=\"straight-arm-pulldown-m-mf-thigh.l\" d=\"^16\"/><path id=\"straight-arm-pulldown-m-mf-kneecap.l\" d=\"^17\"/><path id=\"straight-arm-pulldown-m-mf-shank.l\" d=\"^18\"/><path id=\"straight-arm-pulldown-m-mf-foot.l\" d=\"^19\"/><path id=\"straight-arm-pulldown-m-mf-shcap.l\" d=\"^20\"/><path id=\"straight-arm-pulldown-m-mf-upper.l\" d=\"^56\"/><path id=\"straight-arm-pulldown-m-mf-elbowcap.l\" d=\"^57\"/><path id=\"straight-arm-pulldown-m-mf-fore.l\" d=\"^58\"/><path id=\"straight-arm-pulldown-m-mf-fist.l\" d=\"^59\"/><path id=\"straight-arm-pulldown-m-mf-thigh.r\" d=\"^16\"/><path id=\"straight-arm-pulldown-m-mf-kneecap.r\" d=\"^17\"/><path id=\"straight-arm-pulldown-m-mf-shank.r\" d=\"^18\"/><path id=\"straight-arm-pulldown-m-mf-foot.r\" d=\"^19\"/><path id=\"straight-arm-pulldown-m-mo-0\" d=\"^25\"/><path id=\"straight-arm-pulldown-m-mo-1\" d=\"^26\"/><path id=\"straight-arm-pulldown-m-mo-2\" d=\"^16\"/><path id=\"straight-arm-pulldown-m-mo-3\" d=\"^17\"/><path id=\"straight-arm-pulldown-m-mo-4\" d=\"^18\"/><path id=\"straight-arm-pulldown-m-mo-5\" d=\"^19\"/><path id=\"straight-arm-pulldown-m-mo-6\" d=\"^20\"/><path id=\"straight-arm-pulldown-m-mo-7\" d=\"^21\"/><path id=\"straight-arm-pulldown-m-mo-8\" d=\"^22\"/><path id=\"straight-arm-pulldown-m-mo-9\" d=\"^23\"/><path id=\"straight-arm-pulldown-m-mo-10\" d=\"^24\"/><path id=\"straight-arm-pulldown-m-mo-11\" d=\"^16\"/><path id=\"straight-arm-pulldown-m-mo-12\" d=\"^17\"/><path id=\"straight-arm-pulldown-m-mo-13\" d=\"^18\"/><path id=\"straight-arm-pulldown-m-mo-14\" d=\"^19\"/><path id=\"straight-arm-pulldown-m-mo-15\" d=\"^20\"/><path id=\"straight-arm-pulldown-m-mo-16\" d=\"^21\"/><path id=\"straight-arm-pulldown-m-mo-17\" d=\"^22\"/><path id=\"straight-arm-pulldown-m-mo-18\" d=\"^23\"/><path id=\"straight-arm-pulldown-m-mo-19\" d=\"^24\"/><path id=\"straight-arm-pulldown-m-mo-20\" d=\"^28\"/><path id=\"straight-arm-pulldown-m-mo-21\" d=\"^29\"/><path id=\"straight-arm-pulldown-m-mo-22\" d=\"^30\"/><path id=\"straight-arm-pulldown-m-mo-23\" d=\"^31\"/><path id=\"straight-arm-pulldown-m-mo-24\" d=\"^32\"/><path id=\"straight-arm-pulldown-m-mo-25\" d=\"^33\"/><path id=\"straight-arm-pulldown-m-mo-26\" d=\"^46\"/><path id=\"straight-arm-pulldown-m-mo-27\" d=\"^35\"/><path id=\"straight-arm-pulldown-m-mo-28\" d=\"^36\"/><path id=\"straight-arm-pulldown-m-mo-29\" d=\"^37\"/><path id=\"straight-arm-pulldown-m-mo-30\" d=\"^38\"/><path id=\"straight-arm-pulldown-m-mo-31\" d=\"^50\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#straight-arm-pulldown-m-dots)\"/>\n  <path class=\"floorline\" d=\"^27\"/><path class=\"eq\" d=\"^28\"/><path class=\"eq\" d=\"^29\"/><path class=\"eq\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq-thin\" d=\"^34\"/><path class=\"eq-solid\" d=\"^35\"/><path class=\"eq-pin\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><path class=\"eq-pin\" d=\"^38\"/><path class=\"eq-thin\" d=\"^39\"/><path class=\"eq-thin\" d=\"^40\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-m-st-upper.l\"/><use href=\"#straight-arm-pulldown-m-st-elbowcap.l\"/><use href=\"#straight-arm-pulldown-m-st-fore.l\"/><use href=\"#straight-arm-pulldown-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-m-st-upper.l\"/><use href=\"#straight-arm-pulldown-m-st-elbowcap.l\"/><use href=\"#straight-arm-pulldown-m-st-fore.l\"/><use href=\"#straight-arm-pulldown-m-st-fist.l\"/></g></g><path class=\"eq-cable\" d=\"^41\"/><path class=\"eq-solid\" d=\"^42\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-m-st-upper.r\"/><use href=\"#straight-arm-pulldown-m-st-elbowcap.r\"/><use href=\"#straight-arm-pulldown-m-st-fore.r\"/><use href=\"#straight-arm-pulldown-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-m-st-upper.r\"/><use href=\"#straight-arm-pulldown-m-st-elbowcap.r\"/><use href=\"#straight-arm-pulldown-m-st-fore.r\"/><use href=\"#straight-arm-pulldown-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"^43\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-m-g0-upper.r\"/><use href=\"#straight-arm-pulldown-m-g0-elbowcap.r\"/><use href=\"#straight-arm-pulldown-m-g0-fore.r\"/><use href=\"#straight-arm-pulldown-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-m-g0-upper.r\"/><use href=\"#straight-arm-pulldown-m-g0-elbowcap.r\"/><use href=\"#straight-arm-pulldown-m-g0-fore.r\"/><use href=\"#straight-arm-pulldown-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"^44\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-m-g1-upper.r\"/><use href=\"#straight-arm-pulldown-m-g1-elbowcap.r\"/><use href=\"#straight-arm-pulldown-m-g1-fore.r\"/><use href=\"#straight-arm-pulldown-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-m-g1-upper.r\"/><use href=\"#straight-arm-pulldown-m-g1-elbowcap.r\"/><use href=\"#straight-arm-pulldown-m-g1-fore.r\"/><use href=\"#straight-arm-pulldown-m-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"^45\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-m-g2-upper.r\"/><use href=\"#straight-arm-pulldown-m-g2-elbowcap.r\"/><use href=\"#straight-arm-pulldown-m-g2-fore.r\"/><use href=\"#straight-arm-pulldown-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-m-g2-upper.r\"/><use href=\"#straight-arm-pulldown-m-g2-elbowcap.r\"/><use href=\"#straight-arm-pulldown-m-g2-fore.r\"/><use href=\"#straight-arm-pulldown-m-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^46\"/><path class=\"eq-thin\" d=\"^47\"/><path class=\"eq-cable\" d=\"^48\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-m-e-thigh.l\"/><use href=\"#straight-arm-pulldown-m-e-kneecap.l\"/><use href=\"#straight-arm-pulldown-m-e-shank.l\"/><use href=\"#straight-arm-pulldown-m-e-foot.l\"/><use href=\"#straight-arm-pulldown-m-e-shcap.l\"/><use href=\"#straight-arm-pulldown-m-e-upper.l\"/><use href=\"#straight-arm-pulldown-m-e-elbowcap.l\"/><use href=\"#straight-arm-pulldown-m-e-fore.l\"/><use href=\"#straight-arm-pulldown-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-m-e-thigh.l\"/><use href=\"#straight-arm-pulldown-m-e-kneecap.l\"/><use href=\"#straight-arm-pulldown-m-e-shank.l\"/><use href=\"#straight-arm-pulldown-m-e-foot.l\"/><use href=\"#straight-arm-pulldown-m-e-shcap.l\"/><use href=\"#straight-arm-pulldown-m-e-upper.l\"/><use href=\"#straight-arm-pulldown-m-e-elbowcap.l\"/><use href=\"#straight-arm-pulldown-m-e-fore.l\"/><use href=\"#straight-arm-pulldown-m-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"^49\"/><path class=\"eq-solid\" d=\"^50\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-m-e-head\"/><use href=\"#straight-arm-pulldown-m-e-torso\"/><use href=\"#straight-arm-pulldown-m-e-thigh.r\"/><use href=\"#straight-arm-pulldown-m-e-kneecap.r\"/><use href=\"#straight-arm-pulldown-m-e-shank.r\"/><use href=\"#straight-arm-pulldown-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-m-e-head\"/><use href=\"#straight-arm-pulldown-m-e-torso\"/><use href=\"#straight-arm-pulldown-m-e-thigh.r\"/><use href=\"#straight-arm-pulldown-m-e-kneecap.r\"/><use href=\"#straight-arm-pulldown-m-e-shank.r\"/><use href=\"#straight-arm-pulldown-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-m-e-shcap.r\"/><use href=\"#straight-arm-pulldown-m-e-upper.r\"/><use href=\"#straight-arm-pulldown-m-e-elbowcap.r\"/><use href=\"#straight-arm-pulldown-m-e-fore.r\"/><use href=\"#straight-arm-pulldown-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#straight-arm-pulldown-m-e-shcap.r\"/><use href=\"#straight-arm-pulldown-m-e-upper.r\"/><use href=\"#straight-arm-pulldown-m-e-elbowcap.r\"/><use href=\"#straight-arm-pulldown-m-e-fore.r\"/><use href=\"#straight-arm-pulldown-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"120.7\" cy=\"156.62\" r=\"2.25\"/><circle class=\"joint\" cx=\"117.91\" cy=\"198.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"109.96\" cy=\"217.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"115.19\" cy=\"273.3\" r=\"2.25\"/></g><mask id=\"straight-arm-pulldown-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#straight-arm-pulldown-m-mf-head\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-mf-torso\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-mf-shank.l\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-mf-foot.l\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-mf-upper.l\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-mf-fore.l\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-mf-fist.l\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-mf-shank.r\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-mf-foot.r\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-m-shcap.r\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-m-upper.r\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-m-fore.r\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-m-fist.r\" fill=\"#000\"/><use href=\"#straight-arm-pulldown-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#straight-arm-pulldown-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#straight-arm-pulldown-m-mmask)\"><g class=\"u-stroke\"><use href=\"#straight-arm-pulldown-m-m-shcap.r\"/><use href=\"#straight-arm-pulldown-m-m-upper.r\"/><use href=\"#straight-arm-pulldown-m-m-elbowcap.r\"/><use href=\"#straight-arm-pulldown-m-m-fore.r\"/><use href=\"#straight-arm-pulldown-m-m-fist.r\"/><use href=\"#straight-arm-pulldown-m-m-eq0\"/></g></g><g class=\"mistake-layer\"><path class=\"leader m\" d=\"~MSGsPAB1LVzfPb\"/><path class=\"leader m\" d=\"M186.82 170.8L195 222H205\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"straight-arm-pulldown-m-bend\" data-key=\"bend\" data-cue=\"The elbows bend and the lift turns into a pushdown.\" class=\"plate-callout two m\" style=\"left:2.79%;top:47.49%\" aria-pressed=\"true\">Elbows<br>bend</button><button type=\"button\" id=\"straight-arm-pulldown-m-close\" data-key=\"close\" data-cue=\"The elbows bend as the bar comes down, turning it into a bent-arm pulldown.\" class=\"plate-callout two m\" style=\"left:55.87%;top:55.87%\" aria-pressed=\"false\">Bar<br>pulled in</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "straight",
        cues: [{ key: "straight", cue: "Keep the same slight elbow bend from top to bottom. Only the shoulders move." }, { key: "trunk", cue: "Hold one trunk angle: no swing to start the rep, no arched lower back." }, { key: "thighs", cue: "Finish with the bar at the front of the thighs, chest tall." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "bend",
        cues: [{ key: "bend", cue: "The elbows bend and the lift turns into a pushdown." }, { key: "close", cue: "The elbows bend as the bar comes down, turning it into a bent-arm pulldown." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Elbows bend</b><span>The elbows bend and the lift turns into a pushdown.</span></li><li><b>Bar pulled in</b><span>The elbows bend as the bar comes down, turning it into a bent-arm pulldown.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 2 seconds, hold 1 second, return 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div></div>",
      alt: "Straight-arm cable pulldown, side view. Standing a step back from a high pulley with a slight forward lean and soft knees, the lifter sweeps a straight bar from overhead down to the front of the thighs, elbows keeping one slight bend.",
      mistakeAlt: "Straight-Arm Pulldown: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hold",
    "why": "D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c1.",
    "orientation": "pronated",
    "handle": "bar-28",
    "loadAxis": "across",
    "width": {
      "text": "About shoulder width or a little wider.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "athlean-sap",
          "catalyst-sap"
        ],
        "note": "c1"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "hold-default"
        ],
        "note": "card grip.thumb and grip.handContact: hold archetype default, no exercise-specific source; golden B's hold default, not a card claim, never shown"
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "exempt": "Card grip.wrist: hold archetype default only; no source gives a wrist range for this exercise.",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "hold-default"
        ],
        "note": "card grip.thumb and grip.handContact: hold archetype default, no exercise-specific source; golden B's hold default, not a card claim, never shown"
      }
    },
    "faults": [],
    "gripLine": "Overhand on a straight bar, hands about shoulder width or a little wider.",
    "cue": "Overhand, arms nearly straight."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set the pulley at its highest point and attach a straight bar.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "athlean-sap",
          "catalyst-sap"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "grip",
      "text": "Take the bar overhand, hands about shoulder width or a little wider.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "athlean-sap",
          "catalyst-sap"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Step back until the cable is taut. Feet hip width, knees soft.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "athlean-sap",
          "ace-sap"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "brace",
      "text": "Chest up, trunk braced, at most a slight lean forward.",
      "zoom": "trunk",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "athlean-sap",
          "ace-sap"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "load",
      "text": "Pick a weight you can move smoothly, with a one-second squeeze.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "athlean-sap"
        ],
        "note": "c7"
      }
    }
  ],
  posture: [
    {
      "key": "elbows",
      "label": "Fixed elbow bend",
      "detail": "Elbows keep a slight bend that does not change during the rep.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "zoom": "elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "athlean-sap",
          "catalyst-sap",
          "ace-sap"
        ],
        "note": "c4"
      }
    },
    {
      "key": "arc",
      "label": "Bar to thighs",
      "detail": "The bar sweeps down in an arc to the front of the thighs.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "athlean-sap",
          "catalyst-sap"
        ],
        "note": "c5"
      }
    },
    {
      "key": "trunk",
      "label": "Trunk still",
      "detail": "Trunk braced and still. No swing, no lower-back arch.",
      "anchor": {
        "pose": "end",
        "at": "lumbar"
      },
      "zoom": "trunk",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "athlean-sap"
        ],
        "note": "c9, c7"
      }
    },
    {
      "key": "chest",
      "label": "Chest tall",
      "detail": "Chest tall at the bottom.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "athlean-sap",
          "catalyst-sap"
        ],
        "note": "c5"
      }
    },
    {
      "key": "return",
      "label": "Slow return",
      "detail": "Slow way back up, letting the arms rise under control.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "athlean-sap",
          "ace-sap"
        ],
        "note": "c8"
      }
    }
  ],
  zooms: [
    {
      "key": "elbow",
      "chip": "Elbows",
      "heading": "Elbow bend",
      "kind": "posture",
      "feelRow": "triceps"
    },
    {
      "key": "trunk",
      "chip": "Trunk",
      "heading": "Trunk position",
      "kind": "posture",
      "feelRow": "low-back"
    }
  ],
  chips: [
    "elbow",
    "trunk",
    "feel"
  ],
  copy: {
    "setupLine": "Stand a step back from a high pulley, cable taut. Brace, then let the bar rise slowly.",
    "mistakeLine": "Don't bend your elbows to push the bar down. Keep the same slight bend.",
    "cueLine": "Arms long, bar to thighs."
  },
  mistakes: [
    {
      "key": "bend",
      "title": "Bending the elbows",
      "zoom": "elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "athlean-sap",
          "catalyst-sap",
          "ace-sap"
        ],
        "note": "c6, c4"
      },
      "fix": "Keep the same slight elbow bend all set."
    },
    {
      "key": "heavy",
      "title": "Too much weight",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "athlean-sap",
          "ace-sap"
        ],
        "note": "c7, c8"
      },
      "fix": "Lower the weight. Pause at the bottom, let the bar rise slowly."
    },
    {
      "key": "arch",
      "title": "Arching the lower back",
      "zoom": "trunk",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "athlean-sap"
        ],
        "note": "c9, c10"
      },
      "fix": "Brace the stomach and move only the arms."
    }
  ],
  risks: [
    {
      "key": "arch",
      "text": "Arching the lower back under the cable moves stress onto the lumbar spine.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "athlean-sap"
        ],
        "note": "c9"
      }
    },
    {
      "key": "jerk",
      "text": "Jerking a load that is too heavy swings the torso.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "athlean-sap"
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
    "athlean-sap",
    "catalyst-sap",
    "ace-sap",
    "difonza2026",
    "hold-default",
    "nhs-back",
    "nhs-wrist-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/straight_arm_pulldown.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

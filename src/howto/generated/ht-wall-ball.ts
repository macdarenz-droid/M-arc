// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=faabb61d79daa7c687eab1313aae9f26cc1077edb90284abab79908335962781
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_wall_ball",
  name: "Wall Ball",
  hashes: { inputsSha256: "faabb61d79daa7c687eab1313aae9f26cc1077edb90284abab79908335962781", golden: "b90ce5f46e968ad63b7a8212a526ab48db5c39f69e9c53ea8b0e04edf1989c84" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"wall-ball-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"wall-ball-n-st-head\" d=\"~#w12NOtAHgO!rE)fXj_iIjw9zbK3G3W4T4z8V7Ib)g.mA5VcI1T9BjfYmTaPmX5WkW3_iPgx2Dj0000022100000001010010000000001100100010000000001200010020200001\"/><path id=\"wall-ball-n-st-torso\" d=\"~#_12N.r_wlEDsVSjO9T7B42W8HiH9_6!bYgN68B5Eo.lB9zdD4Hg)3ylG5Dn-eSiVgF5E9B7KgEpRA1-9-rG67V9hwcWgY2A8GcT8KgA7O7Nky6W5FcIay3A9)T2_t00200100000001010100020001020000000012002100010100010000121111002001010200011100000000200200000000000010000000012120\"/><path id=\"wall-ball-n-st-thigh.r\" d=\"~#F12HxqS-E1**pTHD1V1XbE11w3U(1w6-7_2-3(2*U1Pc.m4Bkzcznz2.U1X2*3.5-7)3N(1H10_1Tb)uEcGmWF17wA1UlwG101000021010002000000000100100000000001000000000000001101000012000101100000000001\"/><path id=\"wall-ball-n-st-kneecap.r\" d=\"~~H(q(wU1_J10\"/><path id=\"wall-ball-n-st-shank.r\" d=\"~#F12(!qW!T1)ArxNS1(2RbD14ry)1W6G7A3V3H2.y2P8*cA1.bx6Ee!9Ey2K2B4B5G8TaA(1B13p.bXdNaKfJn)1Sl(a_p00000000000001012101000010000002200000002000000000001001000002002000010111101002\"/><path id=\"wall-ball-n-st-foot.r\" d=\"~#o2YJqAB)1K(qEB(1DcD3wh.7Ap.nYV2-2EG2x5RA1z8*m3.E1U4Ka-c!rxbxmNp100101000001000000002010100000000000002101000010\"/><path id=\"wall-ball-n-g0-head\" d=\"~#w12(FuN(hVWsVPhVkSh*jw8*ax4O3N4B4G8x7-bVfXn_5IcpV9zjR1FnI9_mR4Nk(4!hPhz3(i0000001010100020010000000000000000000000000001110010102000010102\"/><path id=\"wall-ball-n-g0-torso\" d=\"~#_12WJsySm)-sTAlz9xaB67W6UjJ8!7ya!hw6A1T1KoVjxbGd(2PgV2NlV3Do)c_jBf(5*8*5*gKmGD1T7KsV6A1*6uSa(d!1N8Ib)9)gH5X9PjH5y4Fb-8J2NbOV2Dp01000000000001100010000000000011010000200000101010220011111111000220001012022000000002000000000210000002001000000021\"/><path id=\"wall-ball-n-g0-thigh.r\" d=\"~#F12D(oAxH1OIoVWF1K5EaB1aPnD-1A3G9J1O4TeVR1A4XpV6zjzjThKjxP1.3V2z8G5(gJ.1D1bx2RbTx1T1E7_K1Yb(x1Dy1Jv02022001110000010120000000000001000000010002000000121000000010100000001000000010\"/><path id=\"wall-ball-n-g0-kneecap.r\" d=\"~~PYtwUU1_J10\"/><path id=\"wall-ball-n-g0-shank.r\" d=\"~#F12J-tABU1xJuT-S1P5TaD1cRfD*1F8O5_3*2!hOw2FbOa!3KbO2Bf!oB(1G1R4z3I9Xow_1B1by2Xb.f!6KkAj)6UkW4Ur11000101001000000011010200021001002000100000200021010000000001000100101002020000\"/><path id=\"wall-ball-n-g0-foot.r\" d=\"~#o2yKqFB)1G(qGB(1(bD3Yg)7So*nHU2B3zF2-4.z1*7Rm0BE1Y4BaXcFrBbTlSp000001012000002101100000200000200101000111000001\"/><path id=\"wall-ball-n-g0-shcap.r\" d=\"~~NXrA)rwP10\"/><path id=\"wall-ball-n-g0-upper.r\" d=\"~#F12AYrDEszTrOArx1T883FaYK1A2G6w1B3lVB1_6BkX2EgxdXg*b-z1*1V2x4B5P5NN1b4.1T8Egy1B9PrW3Am_h!m00001000112000210121000002002000000200000000000020000000102100002000000011000120\"/><path id=\"wall-ball-n-g0-elbowcap.r\" d=\"~~HVtF)A1Dz10\"/><path id=\"wall-ball-n-g0-fore.r\" d=\"~#F12FSvS-B1Owv-DD1.6N4eR1(lGqX7S2K26*f(e*dy4)7_7G4!dGfUf5N2V2U7WqGlS1fO4!6U2UbHlB6JcxcS6Bl00002000000101001010101010000000200002020000000021000010102000000210100020011111\"/><path id=\"wall-ball-n-g0-fist.r\" d=\"~~UEz1WTvww10\"/><path id=\"wall-ball-n-g1-head\" d=\"~#w12AVvUUnBAu.yn)l!fRkH6Oa*4*3F4K3X8x6GcXd*o_6.b1X9.ix3!nK7AnV2ykP6Hg(iV4Wi0000200000000000000000000000100000100020000101110100011111101011\"/><path id=\"wall-ball-n-g1-torso\" d=\"~#_12AKt_ysz(tRWq.7-d)8z1H3Aly7D9w7FjN5A2w3xoIgKdXdA1YgjYltYpX9NlTcy7x8V3OhIh*F1*3BtI7F2.4N2D9YbiS8T9TbVhJ2XcYh(4S1D9)6u_eGX2Ai01110000220021200000000100000000001000000020000200100110000000000000000200012100022101001000010012000000020100000010\"/><path id=\"wall-ball-n-g1-thigh.r\" d=\"~#F12J(nyyP1._mBDO1O9G6puHN1HD1O1K9pR4Ky1Rz1K8Vo-e-dBpR6*B1.vR4fT9nUG1NI1qr)6x9IvNd(e!I1HqPo!J1_b00000000002000100200000001011001010000000100020010020000000011110111101000002100\"/><path id=\"wall-ball-n-g1-kneecap.r\" d=\"~~JYw1JGW1_J10\"/><path id=\"wall-ball-n-g1-shank.r\" d=\"~#F12y)w1!NV1X!x1XHU1A8O8w1kKv(V1H9x3N4R1Sy1EY1_d)6_6-9Y1KfWF1.T10X4f-9OE1FP1vlA5Ta-g_1*oWcKc_hE3!r20000001000000111000000001000000000001000200021001001002000200000200001010001000\"/><path id=\"wall-ball-n-g1-foot.r\" d=\"~#o2(JqDB)1x(qEB(1wcF3Ugx8So.nDU2E3xF2-4*z1)7Om2EE1Y4EaXcFrEbOlUp000210100002000011010000000220001000000100020010\"/><path id=\"wall-ball-n-g1-shcap.r\" d=\"~~yys(Rx1wP10\"/><path id=\"wall-ball-n-g1-upper.r\" d=\"~#F12HysSWx1*)r)Tw1bV8a0_6YK1S2x6F1x3A2.A1F8RjR1Kg-bVhE9Xz1V1-2X3I5y2AN174G1T8IgjBb_qD2HmAgAo00000010000000100121010010002001010111100001000012000000020011011000000020000010\"/><path id=\"wall-ball-n-g1-elbowcap.r\" d=\"~~SHtDRH1Dz10\"/><path id=\"wall-ball-n-g1-fore.r\" d=\"~#F12FzvyOI1VPuVYI1B7w3mI1(nRlR7A1K29xgybIe(1z9P6I6wdRfYbfJ2O3!6ws.fU15z5_57Ucym.2wexaY9)j00001010101000200000000002220001000100010010000000000000202000100010000101010000\"/><path id=\"wall-ball-n-g1-fist.r\" d=\"~~HGz1JHD1ww10\"/><path id=\"wall-ball-n-e-thigh.l\" d=\"~#F12FJoFY_1BwnB(_1xbH24H1Y_1K6T7R5.3T2xP11TnEbzkw1ImPd.O1!4R3(2)6J6y.1g1E1BbE1*c!v!G1(j!z1.1YE1.n01111100220121200000010000010020000000000101002002101100000000020002000001200221\"/><path id=\"wall-ball-n-e-kneecap.l\" d=\"~~wJy1F-X1_J10\"/><path id=\"wall-ball-n-e-shank.l\" d=\"~#F12AYy1HYW1R.z1K_V1N9.6usIF1!N1W9B1U4nUI1OP1!eK4N8K8S4Xe!P1zI1oX4H1T9BO1(E1rt(6I9TgR1.q!7IfJfE8Yq00000000000012000010000001210100100002020011000000000000000012001000000000010000\"/><path id=\"wall-ball-n-e-foot.l\" d=\"~#o2yKqDB)1G(qEB(1wcF3Wgx8So*nHU2B3zF2-4.z1*7Rm0BE1Y4EaXcFrBbOlPp020200101010000000100000220010000100001101200110\"/><path id=\"wall-ball-n-e-shcap.l\" d=\"~~_Ss_KJ1wP10\"/><path id=\"wall-ball-n-e-upper.l\" d=\"~#F12_SsNOJ1RSsIKI14O8a1w4HK1(2X5H1*2S4Rz1N9zjjKgVaKi*6zz1R1.2I3O5pJK192nO8Egz2.c(pqPmSewp02001000000020000200002000000100101000000000010010101110100002000001111200101000\"/><path id=\"wall-ball-n-e-elbowcap.l\" d=\"~~JGtJGV1Dz10\"/><path id=\"wall-ball-n-e-fore.l\" d=\"~#F12H*uDHW1.HuEPW1x7W1qE1(oRgI79z2lzfD7Oe9)9A5E8!bXey8lA2z4y6ysIaS12R5Y4I3AdDmgHf-7YcEi00101000000000100100000101000022000000001210100010100000000010020000001000000000\"/><path id=\"wall-ball-n-e-fist.l\" d=\"~~JIz1DFS1ww10\"/><path id=\"wall-ball-n-e-head\" d=\"~#w12wEx1WXy1TXv*xy1Gn(d*kU4xaX5G4!3V2*8x5-cVb)p_7EboV9ViT4PoO5HnnHjA8_eDkB6Di0210000001220010100000000010000022000010022000020000100000200000\"/><path id=\"wall-ball-n-e-torso\" d=\"~#_12WTuS)D1EFv-UB1X5BhXb*29FmP5Aa_3AkW4y3S7.mxdzfTdpUgP1Wl(1YqO6!mX9A8x7O1-h)b.H15ItK8(2O3W4Y8N9tS8O7xd*hdIfHfD5n(6*5K1wiKY2!a12000011011000010000001010000010100020000010100011000120001000002100000101000000100000000010100000101000001010010000\"/><path id=\"wall-ball-n-e-thigh.r\" d=\"^28\"/><path id=\"wall-ball-n-e-kneecap.r\" d=\"^29\"/><path id=\"wall-ball-n-e-shank.r\" d=\"^30\"/><path id=\"wall-ball-n-e-foot.r\" d=\"^31\"/><path id=\"wall-ball-n-e-shcap.r\" d=\"^32\"/><path id=\"wall-ball-n-e-upper.r\" d=\"^33\"/><path id=\"wall-ball-n-e-elbowcap.r\" d=\"^34\"/><path id=\"wall-ball-n-e-fore.r\" d=\"^35\"/><path id=\"wall-ball-n-e-fist.r\" d=\"^36\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#wall-ball-n-dots)\"/>\n  <path class=\"datum\" d=\"~MY*w1y-w2LAGg0\"/><path class=\"floorline\" d=\"M21.27 339.5H251.98\"/><path class=\"eq\" d=\"~MUUU1YKx2L0zX(1Q0)o)oA(*1LXy1wpQ)o0Yy1wpLwpA(*1Q0wpwpz(*1LYy1)oQwp0Xy1)oZ\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-ball-n-st-head\"/><use href=\"#wall-ball-n-st-torso\"/><use href=\"#wall-ball-n-st-thigh.r\"/><use href=\"#wall-ball-n-st-kneecap.r\"/><use href=\"#wall-ball-n-st-shank.r\"/><use href=\"#wall-ball-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-n-st-head\"/><use href=\"#wall-ball-n-st-torso\"/><use href=\"#wall-ball-n-st-thigh.r\"/><use href=\"#wall-ball-n-st-kneecap.r\"/><use href=\"#wall-ball-n-st-shank.r\"/><use href=\"#wall-ball-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-ball-n-g0-head\"/><use href=\"#wall-ball-n-g0-torso\"/><use href=\"#wall-ball-n-g0-thigh.r\"/><use href=\"#wall-ball-n-g0-kneecap.r\"/><use href=\"#wall-ball-n-g0-shank.r\"/><use href=\"#wall-ball-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-n-g0-head\"/><use href=\"#wall-ball-n-g0-torso\"/><use href=\"#wall-ball-n-g0-thigh.r\"/><use href=\"#wall-ball-n-g0-kneecap.r\"/><use href=\"#wall-ball-n-g0-shank.r\"/><use href=\"#wall-ball-n-g0-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~#P12_PE1(ztKUE1z)t.6_1B6U3x5y5T3A6.1w72A7_1w7U3A6y5y5A6U3w7_1A72w7.1A6T3y5x5U3B6_1.62E7.1.6T3B6x5x5B6T3.6.1000020000201111100000220000200002101111200002000022000001111002000020000200002001010010100200002\"/><path class=\"eq\" d=\"~#P12YJx1yBuV(w1VKu086e8i6kasao8qam4i8c08)vF604482a6a4g6e6e2a6c2802000200000020000100002220010000200101002001001210000200020000000000002000210000000102000000110001\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-ball-n-g0-shcap.r\"/><use href=\"#wall-ball-n-g0-upper.r\"/><use href=\"#wall-ball-n-g0-elbowcap.r\"/><use href=\"#wall-ball-n-g0-fore.r\"/><use href=\"#wall-ball-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-n-g0-shcap.r\"/><use href=\"#wall-ball-n-g0-upper.r\"/><use href=\"#wall-ball-n-g0-elbowcap.r\"/><use href=\"#wall-ball-n-g0-fore.r\"/><use href=\"#wall-ball-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-ball-n-g1-head\"/><use href=\"#wall-ball-n-g1-torso\"/><use href=\"#wall-ball-n-g1-thigh.r\"/><use href=\"#wall-ball-n-g1-kneecap.r\"/><use href=\"#wall-ball-n-g1-shank.r\"/><use href=\"#wall-ball-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-n-g1-head\"/><use href=\"#wall-ball-n-g1-torso\"/><use href=\"#wall-ball-n-g1-thigh.r\"/><use href=\"#wall-ball-n-g1-kneecap.r\"/><use href=\"#wall-ball-n-g1-shank.r\"/><use href=\"#wall-ball-n-g1-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~#P12NSE1W_z1)VE1*VA1*6(1B6P3z5A5O3D6*1!62F7_1!6U3D6w5A5F6P3(6(1A71(6-1F6T3w5)4U3E6_1*62z7*1*6O3E6z5)4B6T3*6-1000200011010020121011000000001010112000021000200000000200002100001010100001101210000121000000000\"/><path class=\"eq\" d=\"~#P12NNx1Y.A1Kwx1GAB1464c8k6maoaq8q8m8i4c28)vH622066c4c4c6g4e6c480a42100000010020000111010001001000000000000000000202200001110120000000100000020000200020010002002000\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-ball-n-g1-shcap.r\"/><use href=\"#wall-ball-n-g1-upper.r\"/><use href=\"#wall-ball-n-g1-elbowcap.r\"/><use href=\"#wall-ball-n-g1-fore.r\"/><use href=\"#wall-ball-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-n-g1-shcap.r\"/><use href=\"#wall-ball-n-g1-upper.r\"/><use href=\"#wall-ball-n-g1-elbowcap.r\"/><use href=\"#wall-ball-n-g1-fore.r\"/><use href=\"#wall-ball-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#wall-ball-n-e-thigh.l\"/><use href=\"#wall-ball-n-e-kneecap.l\"/><use href=\"#wall-ball-n-e-shank.l\"/><use href=\"#wall-ball-n-e-foot.l\"/><use href=\"#wall-ball-n-e-shcap.l\"/><use href=\"#wall-ball-n-e-upper.l\"/><use href=\"#wall-ball-n-e-elbowcap.l\"/><use href=\"#wall-ball-n-e-fore.l\"/><use href=\"#wall-ball-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-n-e-thigh.l\"/><use href=\"#wall-ball-n-e-kneecap.l\"/><use href=\"#wall-ball-n-e-shank.l\"/><use href=\"#wall-ball-n-e-foot.l\"/><use href=\"#wall-ball-n-e-shcap.l\"/><use href=\"#wall-ball-n-e-upper.l\"/><use href=\"#wall-ball-n-e-elbowcap.l\"/><use href=\"#wall-ball-n-e-fore.l\"/><use href=\"#wall-ball-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-ball-n-e-head\"/><use href=\"#wall-ball-n-e-torso\"/><use href=\"#wall-ball-n-e-thigh.r\"/><use href=\"#wall-ball-n-e-kneecap.r\"/><use href=\"#wall-ball-n-e-shank.r\"/><use href=\"#wall-ball-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-n-e-head\"/><use href=\"#wall-ball-n-e-torso\"/><use href=\"#wall-ball-n-e-thigh.r\"/><use href=\"#wall-ball-n-e-kneecap.r\"/><use href=\"#wall-ball-n-e-shank.r\"/><use href=\"#wall-ball-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~#P12SUE1NYO1BYE1TTP1.6_1B6U3z5y5O3D6*1!62F7_1!6U3D6w5y5F6U3(6_1A72(6.1F6T3w5x5U3B6_1.62E7*1.6O3B6z5x5B6T3.6.1000020000210010121011000000001010111000220000000020000200101100000020000001002200000110100200002\"/><path class=\"eq\" d=\"~#P12PPx1S-P1Oyx1zyR1464c8k6kasao8qam4i6c48zw1F644282a6a4g6e6e2a6c0842000001010020000110000200010000000000000000200210000200121000100000000200000000001102000000002000\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-ball-n-e-shcap.r\"/><use href=\"#wall-ball-n-e-upper.r\"/><use href=\"#wall-ball-n-e-elbowcap.r\"/><use href=\"#wall-ball-n-e-fore.r\"/><use href=\"#wall-ball-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-n-e-shcap.r\"/><use href=\"#wall-ball-n-e-upper.r\"/><use href=\"#wall-ball-n-e-elbowcap.r\"/><use href=\"#wall-ball-n-e-fore.r\"/><use href=\"#wall-ball-n-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"~MYPE1UWqLR3BrL*6_1LE6S3L)4A5LT3D6L-1(6L1A7L(1(6LP3D6LA5A5LD6S3L!6_1LF70L!6-1LD6R3LA5z5LP3B6L(1*6L1z7L-1*6LT3B6L)4z5LE6R3L*6-1\"/><path class=\"eq-line m-line\" d=\"~MWJx1WXrLyeR8L26L4cL6kLamL8oL8qLcqL6mL8iL4eL26L)vF6L04L48L48L2eL8eL4cL4gL6cL2aL46L04\"/><circle class=\"joint\" cx=\"154.05\" cy=\"227.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"155.61\" cy=\"272.86\" r=\"2.25\"/><circle class=\"joint\" cx=\"124.23\" cy=\"288.57\" r=\"2.25\"/><circle class=\"joint\" cx=\"183.17\" cy=\"285.64\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#W10NzrySG1VDr)EG10200000000000000000000010200kwa0001122000011220010210000200200020002000200020002000200020002000200020002000200002200000010000022000000001000000200001000002000000\"/><path class=\"arrow\" d=\"~MANoHwX1LVdTE1L!S1PJ1Z\"/></g><path class=\"leader\" d=\"M247.6 331.69L267 318H277\"/><circle class=\"anchor\" cx=\"247.6\" cy=\"331.69\" r=\"1.5\"/><path class=\"leader\" d=\"~MwKkNEX1L0B*1\"/><circle class=\"anchor\" cx=\"104.48\" cy=\"282.79\" r=\"1.5\"/><path class=\"leader\" d=\"M185.54 153.49L127.36 168H117.36\"/><circle class=\"anchor\" cx=\"185.54\" cy=\"153.49\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"wall-ball-n-distance\" data-key=\"distance\" data-cue=\"Arms out, the ball touches the wall: stand there.\" class=\"plate-callout two\" style=\"left:75.98%;top:82.68%\" aria-pressed=\"true\">Right<br>distance</button><button type=\"button\" id=\"wall-ball-n-depth\" data-key=\"depth\" data-cue=\"Squat until your thighs are parallel to the floor or lower, chest up.\" class=\"plate-callout\" style=\"left:2.23%;top:67.04%\" aria-pressed=\"false\">Squat depth</button><button type=\"button\" id=\"wall-ball-n-catch\" data-key=\"catch\" data-cue=\"Catch the ball standing, hands under it, then squat.\" class=\"plate-callout two\" style=\"left:8.94%;top:40.78%\" aria-pressed=\"false\">Catch,<br>then squat</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"wall-ball-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"wall-ball-m-st-head\" d=\"^0\"/><path id=\"wall-ball-m-st-torso\" d=\"^1\"/><path id=\"wall-ball-m-st-thigh.r\" d=\"^2\"/><path id=\"wall-ball-m-st-kneecap.r\" d=\"^3\"/><path id=\"wall-ball-m-st-shank.r\" d=\"^4\"/><path id=\"wall-ball-m-st-foot.r\" d=\"^5\"/><path id=\"wall-ball-m-g0-head\" d=\"^6\"/><path id=\"wall-ball-m-g0-torso\" d=\"^7\"/><path id=\"wall-ball-m-g0-thigh.r\" d=\"^8\"/><path id=\"wall-ball-m-g0-kneecap.r\" d=\"^9\"/><path id=\"wall-ball-m-g0-shank.r\" d=\"^10\"/><path id=\"wall-ball-m-g0-foot.r\" d=\"^11\"/><path id=\"wall-ball-m-g0-shcap.r\" d=\"^12\"/><path id=\"wall-ball-m-g0-upper.r\" d=\"^13\"/><path id=\"wall-ball-m-g0-elbowcap.r\" d=\"^14\"/><path id=\"wall-ball-m-g0-fore.r\" d=\"^15\"/><path id=\"wall-ball-m-g0-fist.r\" d=\"^16\"/><path id=\"wall-ball-m-g1-head\" d=\"^17\"/><path id=\"wall-ball-m-g1-torso\" d=\"^18\"/><path id=\"wall-ball-m-g1-thigh.r\" d=\"^19\"/><path id=\"wall-ball-m-g1-kneecap.r\" d=\"^20\"/><path id=\"wall-ball-m-g1-shank.r\" d=\"^21\"/><path id=\"wall-ball-m-g1-foot.r\" d=\"^22\"/><path id=\"wall-ball-m-g1-shcap.r\" d=\"^23\"/><path id=\"wall-ball-m-g1-upper.r\" d=\"^24\"/><path id=\"wall-ball-m-g1-elbowcap.r\" d=\"^25\"/><path id=\"wall-ball-m-g1-fore.r\" d=\"^26\"/><path id=\"wall-ball-m-g1-fist.r\" d=\"^27\"/><path id=\"wall-ball-m-e-thigh.l\" d=\"^28\"/><path id=\"wall-ball-m-e-kneecap.l\" d=\"^29\"/><path id=\"wall-ball-m-e-shank.l\" d=\"^30\"/><path id=\"wall-ball-m-e-foot.l\" d=\"^31\"/><path id=\"wall-ball-m-e-shcap.l\" d=\"^32\"/><path id=\"wall-ball-m-e-upper.l\" d=\"^33\"/><path id=\"wall-ball-m-e-elbowcap.l\" d=\"^34\"/><path id=\"wall-ball-m-e-fore.l\" d=\"^35\"/><path id=\"wall-ball-m-e-fist.l\" d=\"^36\"/><path id=\"wall-ball-m-e-head\" d=\"^37\"/><path id=\"wall-ball-m-e-torso\" d=\"^38\"/><path id=\"wall-ball-m-e-thigh.r\" d=\"^28\"/><path id=\"wall-ball-m-e-kneecap.r\" d=\"^29\"/><path id=\"wall-ball-m-e-shank.r\" d=\"^30\"/><path id=\"wall-ball-m-e-foot.r\" d=\"^31\"/><path id=\"wall-ball-m-e-shcap.r\" d=\"^32\"/><path id=\"wall-ball-m-e-upper.r\" d=\"^33\"/><path id=\"wall-ball-m-e-elbowcap.r\" d=\"^34\"/><path id=\"wall-ball-m-e-fore.r\" d=\"^35\"/><path id=\"wall-ball-m-e-fist.r\" d=\"^36\"/><path id=\"wall-ball-m-m-head\" d=\"~#w12NSo_VA1TBnE.z1ToNbElN2O9-6T4N3X1B9X3Ed-8xr!8IaY1T9)hO6!o*2DnW1PiAaScUlx8Nh1010000000000000000000001200200000000100200111001202000002010102\"/><path id=\"wall-ball-m-m-torso\" d=\"~#_12HRlFUF1BHm*IE1B2*kTex6z5SmD3AbdNk(3w4Dc.kR9KhEdV3(fw5_kH6SrnJoV4J9I5J2Vh*2IJ1(5-s.8A1I4!3S6wbT2F8V4KeIhz4Gi!bS6X3_3I5K5Hlz-2U100101000000000000000000002000000120010001200000002120000202000000000000000000000100020000100020010101111000001000000\"/><path id=\"wall-ball-m-m-thigh.l\" d=\"~#F12AzcFY_1zXaB(_1*aH22H1Y_1K6T7R5.3T2xP11TnEbzkw1KmPdXO1!4T3(2x7J6A.1g1E1zbE1)c!v!G1(j!z1.1YE1.n01010100020101200000011010110000001000000101001002002120000000220002100001000201\"/><path id=\"wall-ball-m-m-kneecap.l\" d=\"~~!ymF-X1_J10\"/><path id=\"wall-ball-m-m-shank.l\" d=\"~#F12wOmHYW1KSnK_V1N9.6ssGF1!N1W9B1W4nSI1OP1_eK4S8K8P4Xe_P1zI1sX4F1T9BO1(E1rt!6I9OgR1*q!7IfJfE8Yq00100000000002200000000001110120000012020001200000101010001002200000100000010000\"/><path id=\"wall-ball-m-m-foot.l\" d=\"~#o2!zeDB)1xVeEB(1(bF3Wgx8So*nFU2B3)E2-4*z1*7Rm0BE1Y4GaXcJrBbTlPp020200101010100000002010121010001100100121000100\"/><path id=\"wall-ball-m-m-shcap.l\" d=\"~~(Ui!!K1wP10\"/><path id=\"wall-ball-m-m-upper.l\" d=\"~#F12(Ui_.K1TWi-_J1kB8a1N1DJ1D3K5S1X2S6Ox1NaOicOgV9.i.4.x1K1V2x3T5I3wJ1709E8zgz4GeFpdPmyd_p00000000002000100001000000001000110002002100020001010000210010000100000002000000\"/><path id=\"wall-ball-m-m-elbowcap.l\" d=\"~~N.iJPW1Dz10\"/><path id=\"wall-ball-m-m-fore.l\" d=\"~#F12NFk_TX1OXjIVX1I60sx1AoEaI6*1X1B1)b!2zeE3-aw3OawaXbW3t(1K4(4wqR3F1eO5F3G8!cWl!4SgR4AgGf00020000000000001000000022200000000000000000000000002001010110000000111010200002\"/><path id=\"wall-ball-m-m-fist.l\" d=\"~~wToU(U1ww10\"/><path id=\"wall-ball-m-m-thigh.r\" d=\"^57\"/><path id=\"wall-ball-m-m-kneecap.r\" d=\"^58\"/><path id=\"wall-ball-m-m-shank.r\" d=\"^59\"/><path id=\"wall-ball-m-m-foot.r\" d=\"^60\"/><path id=\"wall-ball-m-m-shcap.r\" d=\"^61\"/><path id=\"wall-ball-m-m-upper.r\" d=\"^62\"/><path id=\"wall-ball-m-m-elbowcap.r\" d=\"^63\"/><path id=\"wall-ball-m-m-fore.r\" d=\"^64\"/><path id=\"wall-ball-m-m-fist.r\" d=\"^65\"/><path id=\"wall-ball-m-m-eq0\" d=\"~#P12A!s(NS1V)sBHT1*6(1E6P3)4A5T3D6-1(61A7(1(6P3D6A5A5D6P3!6(1F71!6-1D6T3A5)4P3E6(1*61z7-1*6T3E6)4)4E6T3*6-1001210110000220101010100000101110102201011100200000010101022000011010100000101010020020010101000\"/><path id=\"wall-ball-m-m-eq1\" d=\"~#P12yYmwPT1)GmRYT1264c6kam8o8qcq6m8i4e24)vJ602464c2c8c4g4e6c2a4604000000011010100001110000100220001000000000111002000001012100001010002000020200000010110100000020\"/><path id=\"wall-ball-m-mo-0\" d=\"^37\"/><path id=\"wall-ball-m-mo-1\" d=\"^38\"/><path id=\"wall-ball-m-mo-2\" d=\"^28\"/><path id=\"wall-ball-m-mo-3\" d=\"^29\"/><path id=\"wall-ball-m-mo-4\" d=\"^30\"/><path id=\"wall-ball-m-mo-5\" d=\"^31\"/><path id=\"wall-ball-m-mo-6\" d=\"^32\"/><path id=\"wall-ball-m-mo-7\" d=\"^33\"/><path id=\"wall-ball-m-mo-8\" d=\"^34\"/><path id=\"wall-ball-m-mo-9\" d=\"^35\"/><path id=\"wall-ball-m-mo-10\" d=\"^36\"/><path id=\"wall-ball-m-mo-11\" d=\"^28\"/><path id=\"wall-ball-m-mo-12\" d=\"^29\"/><path id=\"wall-ball-m-mo-13\" d=\"^30\"/><path id=\"wall-ball-m-mo-14\" d=\"^31\"/><path id=\"wall-ball-m-mo-15\" d=\"^32\"/><path id=\"wall-ball-m-mo-16\" d=\"^33\"/><path id=\"wall-ball-m-mo-17\" d=\"^34\"/><path id=\"wall-ball-m-mo-18\" d=\"^35\"/><path id=\"wall-ball-m-mo-19\" d=\"^36\"/><path id=\"wall-ball-m-mo-20\" d=\"^41\"/><path id=\"wall-ball-m-mo-21\" d=\"^46\"/><path id=\"wall-ball-m-mo-22\" d=\"^47\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#wall-ball-m-dots)\"/>\n  <path class=\"floorline\" d=\"^40\"/><path class=\"eq\" d=\"^41\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-ball-m-st-head\"/><use href=\"#wall-ball-m-st-torso\"/><use href=\"#wall-ball-m-st-thigh.r\"/><use href=\"#wall-ball-m-st-kneecap.r\"/><use href=\"#wall-ball-m-st-shank.r\"/><use href=\"#wall-ball-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-m-st-head\"/><use href=\"#wall-ball-m-st-torso\"/><use href=\"#wall-ball-m-st-thigh.r\"/><use href=\"#wall-ball-m-st-kneecap.r\"/><use href=\"#wall-ball-m-st-shank.r\"/><use href=\"#wall-ball-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-ball-m-g0-head\"/><use href=\"#wall-ball-m-g0-torso\"/><use href=\"#wall-ball-m-g0-thigh.r\"/><use href=\"#wall-ball-m-g0-kneecap.r\"/><use href=\"#wall-ball-m-g0-shank.r\"/><use href=\"#wall-ball-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-m-g0-head\"/><use href=\"#wall-ball-m-g0-torso\"/><use href=\"#wall-ball-m-g0-thigh.r\"/><use href=\"#wall-ball-m-g0-kneecap.r\"/><use href=\"#wall-ball-m-g0-shank.r\"/><use href=\"#wall-ball-m-g0-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^42\"/><path class=\"eq\" d=\"^43\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-ball-m-g0-shcap.r\"/><use href=\"#wall-ball-m-g0-upper.r\"/><use href=\"#wall-ball-m-g0-elbowcap.r\"/><use href=\"#wall-ball-m-g0-fore.r\"/><use href=\"#wall-ball-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-m-g0-shcap.r\"/><use href=\"#wall-ball-m-g0-upper.r\"/><use href=\"#wall-ball-m-g0-elbowcap.r\"/><use href=\"#wall-ball-m-g0-fore.r\"/><use href=\"#wall-ball-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-ball-m-g1-head\"/><use href=\"#wall-ball-m-g1-torso\"/><use href=\"#wall-ball-m-g1-thigh.r\"/><use href=\"#wall-ball-m-g1-kneecap.r\"/><use href=\"#wall-ball-m-g1-shank.r\"/><use href=\"#wall-ball-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-m-g1-head\"/><use href=\"#wall-ball-m-g1-torso\"/><use href=\"#wall-ball-m-g1-thigh.r\"/><use href=\"#wall-ball-m-g1-kneecap.r\"/><use href=\"#wall-ball-m-g1-shank.r\"/><use href=\"#wall-ball-m-g1-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^44\"/><path class=\"eq\" d=\"^45\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-ball-m-g1-shcap.r\"/><use href=\"#wall-ball-m-g1-upper.r\"/><use href=\"#wall-ball-m-g1-elbowcap.r\"/><use href=\"#wall-ball-m-g1-fore.r\"/><use href=\"#wall-ball-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-m-g1-shcap.r\"/><use href=\"#wall-ball-m-g1-upper.r\"/><use href=\"#wall-ball-m-g1-elbowcap.r\"/><use href=\"#wall-ball-m-g1-fore.r\"/><use href=\"#wall-ball-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#wall-ball-m-e-thigh.l\"/><use href=\"#wall-ball-m-e-kneecap.l\"/><use href=\"#wall-ball-m-e-shank.l\"/><use href=\"#wall-ball-m-e-foot.l\"/><use href=\"#wall-ball-m-e-shcap.l\"/><use href=\"#wall-ball-m-e-upper.l\"/><use href=\"#wall-ball-m-e-elbowcap.l\"/><use href=\"#wall-ball-m-e-fore.l\"/><use href=\"#wall-ball-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-m-e-thigh.l\"/><use href=\"#wall-ball-m-e-kneecap.l\"/><use href=\"#wall-ball-m-e-shank.l\"/><use href=\"#wall-ball-m-e-foot.l\"/><use href=\"#wall-ball-m-e-shcap.l\"/><use href=\"#wall-ball-m-e-upper.l\"/><use href=\"#wall-ball-m-e-elbowcap.l\"/><use href=\"#wall-ball-m-e-fore.l\"/><use href=\"#wall-ball-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-ball-m-e-head\"/><use href=\"#wall-ball-m-e-torso\"/><use href=\"#wall-ball-m-e-thigh.r\"/><use href=\"#wall-ball-m-e-kneecap.r\"/><use href=\"#wall-ball-m-e-shank.r\"/><use href=\"#wall-ball-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-m-e-head\"/><use href=\"#wall-ball-m-e-torso\"/><use href=\"#wall-ball-m-e-thigh.r\"/><use href=\"#wall-ball-m-e-kneecap.r\"/><use href=\"#wall-ball-m-e-shank.r\"/><use href=\"#wall-ball-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^46\"/><path class=\"eq\" d=\"^47\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-ball-m-e-shcap.r\"/><use href=\"#wall-ball-m-e-upper.r\"/><use href=\"#wall-ball-m-e-elbowcap.r\"/><use href=\"#wall-ball-m-e-fore.r\"/><use href=\"#wall-ball-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#wall-ball-m-e-shcap.r\"/><use href=\"#wall-ball-m-e-upper.r\"/><use href=\"#wall-ball-m-e-elbowcap.r\"/><use href=\"#wall-ball-m-e-fore.r\"/><use href=\"#wall-ball-m-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"^48\"/><path class=\"eq-line m-line\" d=\"^49\"/><circle class=\"joint\" cx=\"154.05\" cy=\"227.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"155.61\" cy=\"272.86\" r=\"2.25\"/><circle class=\"joint\" cx=\"124.23\" cy=\"288.57\" r=\"2.25\"/><circle class=\"joint\" cx=\"183.17\" cy=\"285.64\" r=\"2.25\"/></g><mask id=\"wall-ball-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#wall-ball-m-m-head\" fill=\"#000\"/><use href=\"#wall-ball-m-m-torso\" fill=\"#000\"/><use href=\"#wall-ball-m-m-thigh.l\" fill=\"#000\"/><use href=\"#wall-ball-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#wall-ball-m-m-shank.l\" fill=\"#000\"/><use href=\"#wall-ball-m-m-foot.l\" fill=\"#000\"/><use href=\"#wall-ball-m-m-shcap.l\" fill=\"#000\"/><use href=\"#wall-ball-m-m-upper.l\" fill=\"#000\"/><use href=\"#wall-ball-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#wall-ball-m-m-fore.l\" fill=\"#000\"/><use href=\"#wall-ball-m-m-fist.l\" fill=\"#000\"/><use href=\"#wall-ball-m-m-thigh.r\" fill=\"#000\"/><use href=\"#wall-ball-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#wall-ball-m-m-shank.r\" fill=\"#000\"/><use href=\"#wall-ball-m-m-foot.r\" fill=\"#000\"/><use href=\"#wall-ball-m-m-shcap.r\" fill=\"#000\"/><use href=\"#wall-ball-m-m-upper.r\" fill=\"#000\"/><use href=\"#wall-ball-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#wall-ball-m-m-fore.r\" fill=\"#000\"/><use href=\"#wall-ball-m-m-fist.r\" fill=\"#000\"/><use href=\"#wall-ball-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-ball-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#wall-ball-m-mmask)\"><g class=\"u-stroke\"><use href=\"#wall-ball-m-m-head\"/><use href=\"#wall-ball-m-m-torso\"/><use href=\"#wall-ball-m-m-thigh.l\"/><use href=\"#wall-ball-m-m-kneecap.l\"/><use href=\"#wall-ball-m-m-shank.l\"/><use href=\"#wall-ball-m-m-foot.l\"/><use href=\"#wall-ball-m-m-shcap.l\"/><use href=\"#wall-ball-m-m-upper.l\"/><use href=\"#wall-ball-m-m-elbowcap.l\"/><use href=\"#wall-ball-m-m-fore.l\"/><use href=\"#wall-ball-m-m-fist.l\"/><use href=\"#wall-ball-m-m-thigh.r\"/><use href=\"#wall-ball-m-m-kneecap.r\"/><use href=\"#wall-ball-m-m-shank.r\"/><use href=\"#wall-ball-m-m-foot.r\"/><use href=\"#wall-ball-m-m-shcap.r\"/><use href=\"#wall-ball-m-m-upper.r\"/><use href=\"#wall-ball-m-m-elbowcap.r\"/><use href=\"#wall-ball-m-m-fore.r\"/><use href=\"#wall-ball-m-m-fist.r\"/><use href=\"#wall-ball-m-m-eq0\"/><use href=\"#wall-ball-m-m-eq1\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MAGlJBF1L)b.G1LDnW1LPiAaLScUlLx8NhLUaShLToNbLElN2LO9-6LT4N3LX1B9LX3Ed\"/><path class=\"m-line\" d=\"~MHImFXP1LHlEX1LGi!bLS6X3\"/><path class=\"m-line\" d=\"~MHRlFUF1L.oHF1LB2*kLTex6Lz5SmLD3AbLdNkL(3w4LDc.kLR9KhLEdV3L(fw5L_kH6LSrnLJoV4LJ9I5LJ2Vh\"/><path class=\"m-line\" d=\"~MDPeWN_1LAx1G2LY_1K6\"/><path class=\"m-line\" d=\"~MwXh_I.1LXX1SB2\"/><path class=\"m-line\" d=\"~MNVhyF)1LyD2BX1LF1T9LBO1(E1LrtL!6I9LOgR1L*q!7\"/><path class=\"m-line\" d=\"~M!zeDB)1LBh(vL(bF3LWgx8LSo*nLFU2B3L)E2-4L*z1*7LRm0LBE1Y4LGaXc\"/><path class=\"m-line\" d=\"~MyHlWUU1L_6B)1\"/><path class=\"m-line\" d=\"~MSIoJyW1LNfzd\"/><path class=\"m-line\" d=\"~M_SoPXU1L)jI3LXbW3Lt(1\"/><path class=\"m-line\" d=\"~MNVoJSU1L(6IaLN3N3L!1P4L0!4L.1P4LK3N3LO4!1L.40LO4.1LK3K3L.1O4L0.4L!1O4\"/><path class=\"m-line\" d=\"~MA!s(NS1LR3ErL*6(1LE6P3L)4A5LT3D6L-1(6L1A7L(1(6LP3D6LA5A5LD6P3L!6(1LF71L!6-1LD6T3LA5)4LP3E6L(1*6L1z7L-1*6LT3E6L)4)4LE6T3L*6-1\"/><path class=\"m-line\" d=\"~MWRkyzy2LDVs0\"/><path class=\"leader m\" d=\"~M_YdUDy2L0IB1\"/><path class=\"leader m\" d=\"~MF-fAPK1L0TJ8\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"wall-ball-m-far\" data-key=\"far\" data-cue=\"The feet stand too far from the wall.\" class=\"plate-callout m\" style=\"left:2.23%;top:83.8%\" aria-pressed=\"true\">Too far</button><button type=\"button\" id=\"wall-ball-m-tilt\" data-key=\"tilt\" data-cue=\"The body tilts forward to reach the wall.\" class=\"plate-callout two m\" style=\"left:2.23%;top:41.9%\" aria-pressed=\"false\">Body tilts<br>forward</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "distance",
        cues: [{ key: "distance", cue: "Arms out, the ball touches the wall: stand there." }, { key: "depth", cue: "Squat until your thighs are parallel to the floor or lower, chest up." }, { key: "catch", cue: "Catch the ball standing, hands under it, then squat." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "far",
        cues: [{ key: "far", cue: "The feet stand too far from the wall." }, { key: "tilt", cue: "The body tilts forward to reach the wall." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Too far</b><span>The feet stand too far from the wall.</span></li><li><b>Body tilts forward</b><span>The body tilts forward to reach the wall.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: squat, throw\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Squat</b><span>&nbsp;</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Throw</b><span>&nbsp;</span></div></div></div>",
      alt: "Wall ball, side view. Facing a wall at arm's length, the lifter holds a medicine ball under the chin with the elbows tucked in and squats until the hips are below the knees, chest up, heels flat.",
      mistakeAlt: "Wall Ball: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP (b3): the card gives no thumb or wrist (pinned \"Not given\" statements); grip claims c1 and c9 and the hand zoom Right are on setup 3 and 5."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Face a sturdy wall at arm's length, feet shoulder-width, toes slightly out.",
      "zoom": "wall-distance",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-wb",
          "pg-wb",
          "bb-wb",
          "boxrox-wb5",
          "boxlife-wallball",
          "hl-wb"
        ],
        "note": "card c1, c2"
      }
    },
    {
      "kind": "grip",
      "text": "Brace and stand tall, ball close at chest height, elbows tucked in.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-wb",
          "pg-wb",
          "bb-wb",
          "boxrox-wallball",
          "boxlife-wallball"
        ],
        "note": "card c1, c5, c9"
      }
    },
    {
      "kind": "position",
      "text": "Breathe in, squat: weight in heels, chest up, thighs parallel or lower.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "boxlife-wallball",
          "pg-wb",
          "bb-wb",
          "boxrox-wb5"
        ],
        "note": "card c11, c6"
      }
    },
    {
      "kind": "position",
      "text": "Breathe out, drive up through your heels and throw to the target.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "boxlife-wallball",
          "pg-wb",
          "ggr-wb",
          "hl-wb"
        ],
        "note": "card c11, c7"
      }
    },
    {
      "kind": "grip",
      "text": "Catch tall, hands under the ball, elbows high, not sandwiching it.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "boxrox-wallball",
          "boxlife-wallball",
          "pg-wb",
          "bb-wb"
        ],
        "note": "card c8, c9"
      }
    }
  ],
  posture: [
    {
      "key": "depth",
      "label": "Squat depth",
      "detail": "Squat until your thighs are parallel to the floor or lower.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-wb",
          "boxrox-wb5",
          "pg-wb"
        ],
        "note": "card c6"
      }
    },
    {
      "key": "heels",
      "label": "Chest up",
      "detail": "Keep your weight in your heels and your chest up.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-wb",
          "boxrox-wb5",
          "pg-wb"
        ],
        "note": "card c6"
      }
    },
    {
      "key": "drive",
      "label": "Drive up",
      "detail": "Drive up through your heels and throw the ball to the target.",
      "anchor": {
        "pose": "start",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-wb",
          "pg-wb",
          "hl-wb"
        ],
        "note": "card c7"
      }
    },
    {
      "key": "close",
      "label": "Ball close",
      "detail": "Keep the ball close to your body.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "boxrox-wallball",
          "boxlife-wallball"
        ],
        "note": "card c9"
      }
    },
    {
      "key": "catch",
      "label": "Catch, then squat",
      "detail": "Catch with hips and arms extended, then squat.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "boxrox-wallball",
          "boxlife-wallball",
          "pg-wb",
          "bb-wb"
        ],
        "note": "card c8, c9"
      }
    },
    {
      "key": "breathe",
      "label": "Breathe",
      "detail": "Breathe in as you squat, out as you throw.",
      "anchor": {
        "pose": "start",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "boxlife-wallball",
          "pg-wb"
        ],
        "note": "card c11"
      }
    },
    {
      "key": "hm-far",
      "label": "Too far back",
      "detail": "Arms out, ball touching the wall: stand there.",
      "anchor": {
        "pose": "end",
        "at": "heel.r"
      },
      "zoom": "wall-distance",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-wb",
          "boxrox-wallball",
          "boxrox-wb5",
          "boxlife-wallball",
          "ggr-wb",
          "bb-wb",
          "hl-wb"
        ],
        "note": "card c3, c2"
      }
    },
    {
      "key": "hm-early",
      "label": "Squatting before catching",
      "detail": "Catch standing tall, then squat.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "boxrox-wallball",
          "boxlife-wallball",
          "pg-wb",
          "bb-wb"
        ],
        "note": "card c8"
      }
    },
    {
      "key": "hm-shallow",
      "label": "Squatting too shallow",
      "detail": "Squat until your thighs are parallel to the floor or lower.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-wb",
          "boxrox-wb5",
          "pg-wb"
        ],
        "note": "card c6"
      }
    },
    {
      "key": "hm-hands",
      "label": "Sandwiching the ball",
      "detail": "Hands under the ball, elbows high in front.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "boxrox-wallball",
          "boxlife-wallball"
        ],
        "note": "card c9"
      }
    }
  ],
  zooms: [
    {
      "key": "wall-distance",
      "chip": "Distance",
      "heading": "Wall distance",
      "kind": "posture"
    }
  ],
  chips: [
    "wall-distance",
    "feel"
  ],
  copy: {
    "setupLine": "Arms out, ball touching the wall: stand there. Ball at chest height.",
    "mistakeLine": "Never sandwich the ball from the sides: hands under it, elbows high.",
    "cueLine": "Catch tall, then squat."
  },
  mistakes: [],
  risks: [
    {
      "key": "early",
      "text": "Catching at the bottom of the squat makes the impact feel heavier.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "boxrox-wallball",
          "boxlife-wallball",
          "pg-wb",
          "bb-wb"
        ],
        "note": "card c8"
      }
    },
    {
      "key": "close",
      "text": "Too close to the wall, the ball will probably fall on your face.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "boxrox-wallball"
        ],
        "note": "card c4"
      }
    },
    {
      "key": "tired",
      "text": "Tired arms can let the ball smash into your face.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-wb",
          "boxrox-wb5"
        ],
        "note": "card c10"
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
    "bb-wb",
    "ggr-wb",
    "pg-wb",
    "boxlife-wallball",
    "boxrox-wallball",
    "boxrox-wb5",
    "fv-wb",
    "hl-wb",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/wall_ball.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

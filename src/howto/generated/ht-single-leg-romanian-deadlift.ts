// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=be332a87bef447c5dbbd14dc2a2457f2d671b5b71771f746bf9a02efb3be5ebf
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_single_leg_romanian_deadlift",
  name: "Single-Leg Romanian Deadlift",
  hashes: { inputsSha256: "be332a87bef447c5dbbd14dc2a2457f2d671b5b71771f746bf9a02efb3be5ebf", golden: "89603e90a7b941b73e069727c0c3c4f342ea519d42cec3c4398a88d25c3d073c" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"single-leg-romanian-deadlift-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"single-leg-romanian-deadlift-n-st-head\" d=\"~#w12NyG1DUgTOE1XFg-jNiRj(8xbR3I3W4O4B8T7Ob-g*mF5VcE1T9BjjYmKaUmT5Wk(3UiUgE2Aj1201001000101001010100001110100000000202001001000100000000010000\"/><path id=\"single-leg-romanian-deadlift-n-st-torso\" d=\"~#_12AKE1NHlGYE1I!jK9X6z33(8(hJ9W6FcPgJ66R5Boxm-8)cJ4DgE4wlT5(mEfDi)gA5I9I7Gg)pxA1EaTrI67T97FcJg(2A8RcK8BgJ7B7UkD6U6DdXa(2y8GU2At00000121000000010120020000000020000000000000000100010000000000020010000000100201000000000000000200100200000000000200\"/><path id=\"single-leg-romanian-deadlift-n-st-thigh.r\" d=\"~#F12(.B1J_E1**B1BID1b*bE15z4Y(1_6z7D3O3y9KU1wfIlP2)jO9Gow4zV1E2B4)4O8xb_*1F16D3ObOtOfXq!B1I4Yz1_gAI100000101012002001010120000010000001000210000200000002000000000200020002200210000\"/><path id=\"single-leg-romanian-deadlift-n-st-kneecap.r\" d=\"~~UIB1_FU1_J10\"/><path id=\"single-leg-romanian-deadlift-n-st-shank.r\" d=\"~#F12_.B1FAT1GzE1zHS1Ja-5ouRN1UH1_95!45JS1EJ1HfR2N9K7D6zeAX1ED1J1T4S2R9VU1(y1ltA8X8xh.2TrY4xhJdIbUp00000000010000111020000001002000000010000000011010000000020000000200220200100020\"/><path id=\"single-leg-romanian-deadlift-n-st-foot.r\" d=\"~#o2FJt_N_1GPu)F_1J5ycAhw9Wy1H5W-1WA2OI1O)1Ihzz1Xe)iItXtD3XgSq_f)x1.1000000000001010010000002000120200200000000100000\"/><path id=\"single-leg-romanian-deadlift-n-st-shcap.r\" d=\"~~FEE1wUqwP10\"/><path id=\"single-leg-romanian-deadlift-n-st-upper.r\" d=\"~#F12HEE1(PqOHE1GKpw1*8a0jWO1P3V5U1*2D8xD1Fb)hy1Og.8EjE3.D1G1)2X2B6I5JO1b04*8xgx2GfSoK1NmwcHq00200001000000000001010000220000000002012002000020200010020000002001100101010102\"/><path id=\"single-leg-romanian-deadlift-n-st-elbowcap.r\" d=\"~~AxE1w*z1Dz10\"/><path id=\"single-leg-romanian-deadlift-n-st-fore.r\" d=\"~#F12S)D1D)z1-wE1)yz1w1Iau_1y6AI1w3O9P1K2T1)w1A6zdlEbT7GcK2.w1X1G2x4x9rSI1l(1G2BazagG9Akw1FhWb_i22000000200001000001010010200000000000022000010000000012000000000000000200000100\"/><path id=\"single-leg-romanian-deadlift-n-st-fist.r\" d=\"~~FXE1PVK1ww10\"/><path id=\"single-leg-romanian-deadlift-n-g0-head\" d=\"~#w12U_P1JTjXSO1.RiBqH7Klx1B8G8z5U25I9R1TdE4BsNa-8J3z9XgK9wpF1WmP5Pg(c!8Jn-awg0000120200000000200001101200010100002000000000000001000000200000\"/><path id=\"single-leg-romanian-deadlift-n-g0-torso\" d=\"~#_12yDK1AwnEBN1K!lB5Ga-2R17ykD5FaF3FkH5D3_6TnTexhRd.1JgD3Pl!3Dr-3YnR7W8G68-h.7.I1S2EtR6B1*6T1D5_gB1P8B7Bd.hv-fyfN2U8WgI3B1P8BY2xd20200000000020011002000000000110000001000220001012100000000010000000000200111002001010020000001010000122000100010000\"/><path id=\"single-leg-romanian-deadlift-n-g0-thigh.r\" d=\"~#F12SJz1(_D1TxA1XPB1P4)az1jItPX1D9T3H4*1WtBJ1JmGdPaGhH1xqHpXN19.4z1V9Iz1_T1A1mS7z9RkEq*E1WnOiYuK2HN100001002100020000011110101010021010020022000000002010100201010000110102000011101\"/><path id=\"single-leg-romanian-deadlift-n-g0-kneecap.r\" d=\"~~(WtDSS1_J10\"/><path id=\"single-leg-romanian-deadlift-n-g0-shank.r\" d=\"~#F12SFuSJR1xRv.TP1WaO5mw1BP1!F1(96Y41AU1EH1Ffz2Y9)6Y6.dPY1EA1P1R4(2I9.V1(w1nx1P8G8)gT3Xr_3RhWcEcDp00101100101001010011000000011000200000000100100200010101010010000100020000000010\"/><path id=\"single-leg-romanian-deadlift-n-g0-foot.r\" d=\"~#o2NPl!JY1VUmIFY1(4Fc_gS9Jy1W6AX1WD2xG1)w2xg-z1xeKjGs*u!3Og!pWg-x1z3002200000010000000020000000000000022000000200200\"/><path id=\"single-leg-romanian-deadlift-n-g0-shcap.r\" d=\"~~FKH1wHswP10\"/><path id=\"single-leg-romanian-deadlift-n-g0-upper.r\" d=\"~#F12FKH1AGs-NH1KBrk.881U1WO1D3.5S1)2J6ID1NaRi8KgV9*ix5TD1K1*2x3x6B3UO1919.8BgI1zeFpdPmFdYp22020000002000101000011000010100000000010000000101002200000002000000211010000000\"/><path id=\"single-leg-romanian-deadlift-n-g0-elbowcap.r\" d=\"~~_UH1STB1Dz10\"/><path id=\"single-leg-romanian-deadlift-n-g0-fore.r\" d=\"~#F12DTH1wTB1RWH1)WA1_1Eao!1!2NI1W3B9U1I2u)w1w7Vc8BbX6.c2xx1T1G2I3I9z4JI1n!1R1IaBa7-aNj5DhDaYj02000000000121020000010001000000200010010100022000200020000011000200002000021000\"/><path id=\"single-leg-romanian-deadlift-n-g0-fist.r\" d=\"~~PTH1UJO1ww10\"/><path id=\"single-leg-romanian-deadlift-n-g0-eq1.dumbbell.0-0\" d=\"~M!GK1UJO1LBrAO1LErzO1LFrzO1LJW10LFrAO1Z\"/><path id=\"single-leg-romanian-deadlift-n-g1-head\" d=\"~#w12J(W1(IrxIW1R.pKq*5KixbG3zbV53y4I8F5XcN9.qJd-2F7O6EaBgJl!cPhPfJ8FjB3_o)g(80000000000020022001010002100100000002000001000200200100000200000\"/><path id=\"single-leg-romanian-deadlift-n-g1-torso\" d=\"~#_12HAS1(UsTPT1BAs8ObV1V2X9Ph7SbT6Jj(2A5Jh*gI4xlGbV7HdyaNhydyqW8Uo_3UaX1D8.fNcXH1HfxpV6z3K5V1lFf)4w73xfIfE9*kY5)1!8JgY4z5y7RE2zV100020000000100000000000000100000010002101010121010200020020000000000002200020000000000000000000020020000201000000100\"/><path id=\"single-leg-romanian-deadlift-n-g1-thigh.r\" d=\"~#F12wzy1WzD1VFz1GEB1(8-7jx1zT1SA1_9s_44FN1Eq(p*1Ah.aYcXmSI1RuY1O4P3E9.W1Yumy1(a-4-6Tw1EN1J3GuFjXmPF100010100000101000001000002101000200100002000010000000210000000101001000000000001\"/><path id=\"single-leg-romanian-deadlift-n-g1-kneecap.r\" d=\"~~PUnWWN1_J10\"/><path id=\"single-leg-romanian-deadlift-n-g1-shank.r\" d=\"~#F12ANoNJK1V_pG!J1PbE3gA1GX1PuW9A2U4uP.1zvNfw1!a.4J9IcS(1EoN2z4W4X8I.1WldB1(9O6*f.6*r-1-j(8*gHm10010000010000000010020220000202000000000000111110000001011010101010100000000000\"/><path id=\"single-leg-romanian-deadlift-n-g1-foot.r\" d=\"~#o2yOeWPS1OTfOTS1N2wdPeWcPw1Nd(E1FP2Kr*E2O8ED1)9.lRl.z1y7OfymSlRw1X9010020000022000000100100200011000100010010000000\"/><path id=\"single-leg-romanian-deadlift-n-g1-shcap.r\" d=\"~~FwK1PXw1wP10\"/><path id=\"single-leg-romanian-deadlift-n-g1-upper.r\" d=\"~#F12HwK1WVw1TyK1xSvo.8c0iWO1H3-5U1*2F7ED1WaIimIgG9BjG4TD1G1x3*2z6B4SO1905)8xgT1Ve(otPm_cwq10001222000200101020000000110002000001020001010100000000001110002001001010000010\"/><path id=\"single-leg-romanian-deadlift-n-g1-elbowcap.r\" d=\"~~UxK1(wH1Dz10\"/><path id=\"single-leg-romanian-deadlift-n-g1-fore.r\" d=\"~#F12ywK1U)G1xAK1XzG1y2zao_1(1SI1!3B9W1G2U1*w1F7OceGbI6*ck)w1K1I2G3O9*4HI1p_1K1GaxafBbDjjDh_9wk10020021010100000000000000000000210002020020001001002001000010022000100000121000\"/><path id=\"single-leg-romanian-deadlift-n-g1-fist.r\" d=\"~~_-J1_-T1ww10\"/><path id=\"single-leg-romanian-deadlift-n-g1-eq1.dumbbell.0-0\" d=\"~MFPO1_-T1LErAO1LzrzO1LDrzO1LJW10LDrAO1Z\"/><path id=\"single-leg-romanian-deadlift-n-e-thigh.l\" d=\"~#F12SYv_wG1TDvBVE1I5Raz1aJmW_1J3G9J1O4-dKT1_4VpE6BjViBiTi-R1-3.2x8V5Yf_!1F1b.1XbGx1X1K8UK1(aFy1Jx1Dw100100000000101002000120010010112000000020000020011000002200010000010120000012100\"/><path id=\"single-leg-romanian-deadlift-n-e-kneecap.l\" d=\"~~JJA1Y(T1_J10\"/><path id=\"single-leg-romanian-deadlift-n-e-shank.l\" d=\"~#F12YHA1((T1ENA1VOS1W1-bF10A5((1w6.7W2)3)3*y2D7Td0)bI7RdP3)y2-2)3)5X7T4((1B10*1XbVcWbBd_o2UlJdWo00001000000000002010100000121022000000200111100000001000000200010102100001000220\"/><path id=\"single-leg-romanian-deadlift-n-e-foot.l\" d=\"~#o2y(A1AB)1VOB1zB(1_cF3Uhx8Up)nS-2B3-J2-4ID1)7xo2OG1Y4Eb-cYsBbGmSp120002012120000110001000101200002101101000010110\"/><path id=\"single-leg-romanian-deadlift-n-e-shcap.l\" d=\"~~(-K1yyE1wP10\"/><path id=\"single-leg-romanian-deadlift-n-e-upper.l\" d=\"~#F12y_K1y)D1G*K1O.B1y1.8a0jYO1P3-5U1.2F8)B1Dbziw1IgX8IjI3-D1E1)2X2B6I5JO1b06*8Bgx2EfSoK1NmycJq11000001200220010101000000001110002100110002000020200000022000000000200101000110\"/><path id=\"single-leg-romanian-deadlift-n-e-elbowcap.l\" d=\"~~_TK1yIP1Dz10\"/><path id=\"single-leg-romanian-deadlift-n-e-fore.l\" d=\"~#F12HSK1HKP1TTK1BRO1A1Gaq_1D6AI1(2O9N1K2O1)w1y6zdlEbT7GcK2.w1X1G2z4x9pSI1l(1G2BazagG9Akw1FhYb!i00000000002001000001110000000010000000120000001000000002000000000000000200000101\"/><path id=\"single-leg-romanian-deadlift-n-e-fist.l\" d=\"~~(GN1Sz_1ww10\"/><path id=\"single-leg-romanian-deadlift-n-e-head\" d=\"~#w12HG-1YKD1TO-1)-A1Kk)hXaRiP2Gbx5*2Y7G5UaV8Fl*iyd(3P9E2B1xjScSl_7wm.1(kXeDkEjd1000002101200000010000010000000001210020000100101000010101010000\"/><path id=\"single-leg-romanian-deadlift-n-e-torso\" d=\"~#_12SNU1PEB1O*V1zNB1_5)95B3)gWaX5waBf_d0W5Nn*5y6VjE6zcy7yfP9WjDjWjykYeAaH3WeGaWuBw1FpBf.5X5x5x2I5WcX7W3D7Edx9Kfxlz5x6_6wcycX7Y3EB1xR202002000001000000000000101000011110000010000220000001010000121000000200000001001010000020010100120001000020002000000\"/><path id=\"single-leg-romanian-deadlift-n-e-thigh.r\" d=\"~#F12_!x1Y!B1OIz1)VB1UbR23E1G(1N7A8N5A4S2FV1rUn_aFkB1Am.d!U1-5Y3x3N7K6-(1g4F1YbA1!9*vBH1Gj.z1H2KE1Po20000000100101001000220001100002200001000201210000000000000002200001100002121000\"/><path id=\"single-leg-romanian-deadlift-n-e-kneecap.r\" d=\"~~WKkHyG1_J10\"/><path id=\"single-leg-romanian-deadlift-n-e-shank.r\" d=\"~#F12SXlwUE1*DnXUE1!by14D1R(1(8F8N5y4P2Uy2)7yeJ6wclydB8Az2fY3)2N7K6z)1r1E1UbR2KcxcOpVbVlN1Xn_e00000100000210000010100001012020001010022000000000200100000001000101010002200000\"/><path id=\"single-leg-romanian-deadlift-n-e-foot.r\" d=\"~#o2wTaH!F1xUb.IG1I2wdA9yhSpyo!8D-21)J2P5XD1O1)nK7BG1yc)bwdws*qVk000020002000000101000000120000101001000000010000\"/><path id=\"single-leg-romanian-deadlift-n-e-shcap.r\" d=\"^39\"/><path id=\"single-leg-romanian-deadlift-n-e-upper.r\" d=\"^40\"/><path id=\"single-leg-romanian-deadlift-n-e-elbowcap.r\" d=\"^41\"/><path id=\"single-leg-romanian-deadlift-n-e-fore.r\" d=\"^42\"/><path id=\"single-leg-romanian-deadlift-n-e-fist.r\" d=\"^43\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#single-leg-romanian-deadlift-n-dots)\"/>\n  <path class=\"datum\" d=\"~MFxF1FBA2L0ENY1\"/><path class=\"floorline\" d=\"M95.29 339.5H314.71\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-n-st-head\"/><use href=\"#single-leg-romanian-deadlift-n-st-torso\"/><use href=\"#single-leg-romanian-deadlift-n-st-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-n-st-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-n-st-shank.r\"/><use href=\"#single-leg-romanian-deadlift-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-n-st-head\"/><use href=\"#single-leg-romanian-deadlift-n-st-torso\"/><use href=\"#single-leg-romanian-deadlift-n-st-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-n-st-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-n-st-shank.r\"/><use href=\"#single-leg-romanian-deadlift-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-n-st-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-st-upper.r\"/><use href=\"#single-leg-romanian-deadlift-n-st-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-st-fore.r\"/><use href=\"#single-leg-romanian-deadlift-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-n-st-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-st-upper.r\"/><use href=\"#single-leg-romanian-deadlift-n-st-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-st-fore.r\"/><use href=\"#single-leg-romanian-deadlift-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-n-g0-head\"/><use href=\"#single-leg-romanian-deadlift-n-g0-torso\"/><use href=\"#single-leg-romanian-deadlift-n-g0-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-n-g0-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-n-g0-shank.r\"/><use href=\"#single-leg-romanian-deadlift-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-n-g0-head\"/><use href=\"#single-leg-romanian-deadlift-n-g0-torso\"/><use href=\"#single-leg-romanian-deadlift-n-g0-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-n-g0-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-n-g0-shank.r\"/><use href=\"#single-leg-romanian-deadlift-n-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-n-g0-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-g0-upper.r\"/><use href=\"#single-leg-romanian-deadlift-n-g0-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-g0-fore.r\"/><use href=\"#single-leg-romanian-deadlift-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-n-g0-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-g0-upper.r\"/><use href=\"#single-leg-romanian-deadlift-n-g0-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-g0-fore.r\"/><use href=\"#single-leg-romanian-deadlift-n-g0-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-n-g0-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-n-g0-eq1.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-n-g1-head\"/><use href=\"#single-leg-romanian-deadlift-n-g1-torso\"/><use href=\"#single-leg-romanian-deadlift-n-g1-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-n-g1-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-n-g1-shank.r\"/><use href=\"#single-leg-romanian-deadlift-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-n-g1-head\"/><use href=\"#single-leg-romanian-deadlift-n-g1-torso\"/><use href=\"#single-leg-romanian-deadlift-n-g1-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-n-g1-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-n-g1-shank.r\"/><use href=\"#single-leg-romanian-deadlift-n-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-n-g1-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-g1-upper.r\"/><use href=\"#single-leg-romanian-deadlift-n-g1-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-g1-fore.r\"/><use href=\"#single-leg-romanian-deadlift-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-n-g1-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-g1-upper.r\"/><use href=\"#single-leg-romanian-deadlift-n-g1-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-g1-fore.r\"/><use href=\"#single-leg-romanian-deadlift-n-g1-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-n-g1-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-n-g1-eq1.dumbbell.0-0\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-n-e-thigh.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-kneecap.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-shank.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-foot.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-shcap.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-upper.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-elbowcap.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-fore.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-n-e-thigh.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-kneecap.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-shank.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-foot.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-shcap.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-upper.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-elbowcap.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-fore.l\"/><use href=\"#single-leg-romanian-deadlift-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-n-e-head\"/><use href=\"#single-leg-romanian-deadlift-n-e-torso\"/><use href=\"#single-leg-romanian-deadlift-n-e-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-n-e-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-n-e-shank.r\"/><use href=\"#single-leg-romanian-deadlift-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-n-e-head\"/><use href=\"#single-leg-romanian-deadlift-n-e-torso\"/><use href=\"#single-leg-romanian-deadlift-n-e-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-n-e-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-n-e-shank.r\"/><use href=\"#single-leg-romanian-deadlift-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-n-e-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-e-upper.r\"/><use href=\"#single-leg-romanian-deadlift-n-e-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-e-fore.r\"/><use href=\"#single-leg-romanian-deadlift-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-n-e-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-e-upper.r\"/><use href=\"#single-leg-romanian-deadlift-n-e-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-n-e-fore.r\"/><use href=\"#single-leg-romanian-deadlift-n-e-fist.r\"/></g></g><path class=\"disc\" d=\"~MJwR1Sz_1LErAO1LzrzO1LDrzO1LJW10LDrAO1Z\"/><path class=\"disc-core\" d=\"~~P.N1Sz_1Ne0\"/><path class=\"eq-cable m-line\" d=\"~MJDH1H_J1LzO1ErL0PW1LAO1ArLAO1BrL0IW1LzO1Br\"/><circle class=\"joint\" cx=\"242.23\" cy=\"200.01\" r=\"2.25\"/><circle class=\"joint\" cx=\"239.2\" cy=\"247.53\" r=\"2.25\"/><circle class=\"joint\" cx=\"174.35\" cy=\"206.3\" r=\"2.25\"/><circle class=\"joint\" cx=\"111.76\" cy=\"210.29\" r=\"2.25\"/><circle class=\"joint\" cx=\"193.47\" cy=\"266.04\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#w20wRH1!KN1BIH1RGN11a0a0c1a2a1a0a0c281a082a0vX2U32v28182a162a160806080616060604162400001101110010101000011111000002200001101010010000011010020120010010100000111100001010002001210220000000000200020002000010000000\"/><path class=\"arrow\" d=\"~MHwO1J-Y1LTqIw1LD)1yoZ\"/></g><path class=\"leader\" d=\"~M_xx1YJA1L0XE1\"/><circle class=\"anchor\" cx=\"169.25\" cy=\"186.36\" r=\"1.5\"/><path class=\"leader\" d=\"M201.47 266.04L245 316H255\"/><circle class=\"anchor\" cx=\"201.47\" cy=\"266.04\" r=\"1.5\"/><path class=\"leader\" d=\"M242.23 297.53L255 270H265\"/><circle class=\"anchor\" cx=\"242.23\" cy=\"297.53\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"single-leg-romanian-deadlift-n-line\" data-key=\"line\" data-cue=\"Keep your head, back and free leg in one line, neck neutral.\" class=\"plate-callout two\" style=\"left:26.82%;top:39.11%\" aria-pressed=\"true\">Straight<br>line</button><button type=\"button\" id=\"single-leg-romanian-deadlift-n-knee\" data-key=\"knee\" data-cue=\"Keep your standing knee bent about 15-20 degrees, not locked.\" class=\"plate-callout two\" style=\"left:69.83%;top:82.12%\" aria-pressed=\"false\">Soft knee<br>15-20°</button><button type=\"button\" id=\"single-leg-romanian-deadlift-n-shin\" data-key=\"shin\" data-cue=\"Stop the dumbbell at about mid-shin, in front of your standing leg.\" class=\"plate-callout\" style=\"left:72.63%;top:69.27%\" aria-pressed=\"false\">Mid-shin</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"single-leg-romanian-deadlift-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"single-leg-romanian-deadlift-m-st-head\" d=\"^0\"/><path id=\"single-leg-romanian-deadlift-m-st-torso\" d=\"^1\"/><path id=\"single-leg-romanian-deadlift-m-st-thigh.r\" d=\"^2\"/><path id=\"single-leg-romanian-deadlift-m-st-kneecap.r\" d=\"^3\"/><path id=\"single-leg-romanian-deadlift-m-st-shank.r\" d=\"^4\"/><path id=\"single-leg-romanian-deadlift-m-st-foot.r\" d=\"^5\"/><path id=\"single-leg-romanian-deadlift-m-st-shcap.r\" d=\"^6\"/><path id=\"single-leg-romanian-deadlift-m-st-upper.r\" d=\"^7\"/><path id=\"single-leg-romanian-deadlift-m-st-elbowcap.r\" d=\"^8\"/><path id=\"single-leg-romanian-deadlift-m-st-fore.r\" d=\"^9\"/><path id=\"single-leg-romanian-deadlift-m-st-fist.r\" d=\"^10\"/><path id=\"single-leg-romanian-deadlift-m-g0-head\" d=\"^11\"/><path id=\"single-leg-romanian-deadlift-m-g0-torso\" d=\"^12\"/><path id=\"single-leg-romanian-deadlift-m-g0-thigh.r\" d=\"^13\"/><path id=\"single-leg-romanian-deadlift-m-g0-kneecap.r\" d=\"^14\"/><path id=\"single-leg-romanian-deadlift-m-g0-shank.r\" d=\"^15\"/><path id=\"single-leg-romanian-deadlift-m-g0-foot.r\" d=\"^16\"/><path id=\"single-leg-romanian-deadlift-m-g0-shcap.r\" d=\"^17\"/><path id=\"single-leg-romanian-deadlift-m-g0-upper.r\" d=\"^18\"/><path id=\"single-leg-romanian-deadlift-m-g0-elbowcap.r\" d=\"^19\"/><path id=\"single-leg-romanian-deadlift-m-g0-fore.r\" d=\"^20\"/><path id=\"single-leg-romanian-deadlift-m-g0-fist.r\" d=\"^21\"/><path id=\"single-leg-romanian-deadlift-m-g0-eq1.dumbbell.0-0\" d=\"^22\"/><path id=\"single-leg-romanian-deadlift-m-g1-head\" d=\"^23\"/><path id=\"single-leg-romanian-deadlift-m-g1-torso\" d=\"^24\"/><path id=\"single-leg-romanian-deadlift-m-g1-thigh.r\" d=\"^25\"/><path id=\"single-leg-romanian-deadlift-m-g1-kneecap.r\" d=\"^26\"/><path id=\"single-leg-romanian-deadlift-m-g1-shank.r\" d=\"^27\"/><path id=\"single-leg-romanian-deadlift-m-g1-foot.r\" d=\"^28\"/><path id=\"single-leg-romanian-deadlift-m-g1-shcap.r\" d=\"^29\"/><path id=\"single-leg-romanian-deadlift-m-g1-upper.r\" d=\"^30\"/><path id=\"single-leg-romanian-deadlift-m-g1-elbowcap.r\" d=\"^31\"/><path id=\"single-leg-romanian-deadlift-m-g1-fore.r\" d=\"^32\"/><path id=\"single-leg-romanian-deadlift-m-g1-fist.r\" d=\"^33\"/><path id=\"single-leg-romanian-deadlift-m-g1-eq1.dumbbell.0-0\" d=\"^34\"/><path id=\"single-leg-romanian-deadlift-m-e-thigh.l\" d=\"^35\"/><path id=\"single-leg-romanian-deadlift-m-e-kneecap.l\" d=\"^36\"/><path id=\"single-leg-romanian-deadlift-m-e-shank.l\" d=\"^37\"/><path id=\"single-leg-romanian-deadlift-m-e-foot.l\" d=\"^38\"/><path id=\"single-leg-romanian-deadlift-m-e-shcap.l\" d=\"^39\"/><path id=\"single-leg-romanian-deadlift-m-e-upper.l\" d=\"^40\"/><path id=\"single-leg-romanian-deadlift-m-e-elbowcap.l\" d=\"^41\"/><path id=\"single-leg-romanian-deadlift-m-e-fore.l\" d=\"^42\"/><path id=\"single-leg-romanian-deadlift-m-e-fist.l\" d=\"^43\"/><path id=\"single-leg-romanian-deadlift-m-e-head\" d=\"^44\"/><path id=\"single-leg-romanian-deadlift-m-e-torso\" d=\"^45\"/><path id=\"single-leg-romanian-deadlift-m-e-thigh.r\" d=\"^46\"/><path id=\"single-leg-romanian-deadlift-m-e-kneecap.r\" d=\"^47\"/><path id=\"single-leg-romanian-deadlift-m-e-shank.r\" d=\"^48\"/><path id=\"single-leg-romanian-deadlift-m-e-foot.r\" d=\"^49\"/><path id=\"single-leg-romanian-deadlift-m-e-shcap.r\" d=\"^39\"/><path id=\"single-leg-romanian-deadlift-m-e-upper.r\" d=\"^40\"/><path id=\"single-leg-romanian-deadlift-m-e-elbowcap.r\" d=\"^41\"/><path id=\"single-leg-romanian-deadlift-m-e-fore.r\" d=\"^42\"/><path id=\"single-leg-romanian-deadlift-m-e-fist.r\" d=\"^43\"/><path id=\"single-leg-romanian-deadlift-m-m-head\" d=\"~#w12yGU1WRS1EOV1ENR1)3-qW3BlF9z7*1I5H9sWd8PsrP7SbS8J4PbKfI4Woz8_l)e_eEo!5OeVc0000000101012020000001000101200020100121010000002000100000001000\"/><path id=\"single-leg-romanian-deadlift-m-m-torso\" d=\"~#_12NIR1WPN1)HS1)TO1_a*3(1R2.jX2-a(3OkoR5T1Pg!oH6(bE3Vcy7yfP9WjDjWjykYeAaH3WeGaWuBw1FpBfzI1XgRV1!F1Y)1WlI8E2AeK5y3Vh*cOh*8H1N1(gI8z2Yn*V200101000000000200000000000000000002000010000220000001010000121000000200200020002000010000201011011010100000210001000\"/><path id=\"single-leg-romanian-deadlift-m-m-shcap.l\" d=\"~~AyH1WPK1wP10\"/><path id=\"single-leg-romanian-deadlift-m-m-upper.l\" d=\"~#F12DyH1UKK1IBH1xHJ1w1-8a1lWO1S3V5W1*2A8xD1Fb)hy1Og.8GjG3XD1B1x3-2B6K5JO1702*8xgz2IfWoI1JmycHq00001201010100000021010000020000110012000200201110101000220001000010002001010120\"/><path id=\"single-leg-romanian-deadlift-m-m-elbowcap.l\" d=\"~~w!G1W-W1Dz10\"/><path id=\"single-leg-romanian-deadlift-m-m-fore.l\" d=\"~#F12N_G1!.W1X.G1V)V1A1IasY1y6FI1w3T9N1I2O1*w1y6EdlzbT7IcK2*w1X1B2x4z9tSI1j(1E2BaEagE9Aky1DhUb(i00000100010200010000022000000000000000010002000000110100000020000000200100000000\"/><path id=\"single-leg-romanian-deadlift-m-m-fist.l\" d=\"~~ASH1DSw2ww10\"/><path id=\"single-leg-romanian-deadlift-m-m-shcap.r\" d=\"^62\"/><path id=\"single-leg-romanian-deadlift-m-m-upper.r\" d=\"~#F12FyH1yUK1VwH1IPJ15*8a0Y5HO1Y2B6F1x3w3-D1W8Ijz1KgIb*hI8xD1X1-2O3X5uWO190x1.8Eg2.bPqS1JmPfPo10000000000021010120000000000000200200012110000020101000011010110010020010100010\"/><path id=\"single-leg-romanian-deadlift-m-m-elbowcap.r\" d=\"~~_zI1P-W1Dz10\"/><path id=\"single-leg-romanian-deadlift-m-m-fore.r\" d=\"~#F12(yI1UwX1KwI1OAW1bOaD1Y1Yb(G1Y1.9y1R2*5Ow1H4.dB2)aB9Bb.6Gw1)1*1E5O8(4FI1bw2V3V9*9Y1R6FlH3!gAeDh00100000000000000111111000012000001010001000002001010000000000010000010100000000\"/><path id=\"single-leg-romanian-deadlift-m-m-fist.r\" d=\"~~SzK1WJw2ww10\"/><path id=\"single-leg-romanian-deadlift-m-m-eq0\" d=\"~M(-O1WJw2LBrAO1LErzO1LFrzO1LJW10LFrAO1Z\"/><path id=\"single-leg-romanian-deadlift-m-m-eq1\" d=\"~~yVK1WJw2Ne0\"/><path id=\"single-leg-romanian-deadlift-m-mf-thigh.l\" d=\"^35\"/><path id=\"single-leg-romanian-deadlift-m-mf-kneecap.l\" d=\"^36\"/><path id=\"single-leg-romanian-deadlift-m-mf-shank.l\" d=\"^37\"/><path id=\"single-leg-romanian-deadlift-m-mf-foot.l\" d=\"^38\"/><path id=\"single-leg-romanian-deadlift-m-mf-thigh.r\" d=\"^46\"/><path id=\"single-leg-romanian-deadlift-m-mf-kneecap.r\" d=\"^47\"/><path id=\"single-leg-romanian-deadlift-m-mf-shank.r\" d=\"^48\"/><path id=\"single-leg-romanian-deadlift-m-mf-foot.r\" d=\"^49\"/><path id=\"single-leg-romanian-deadlift-m-mo-0\" d=\"^44\"/><path id=\"single-leg-romanian-deadlift-m-mo-1\" d=\"^45\"/><path id=\"single-leg-romanian-deadlift-m-mo-2\" d=\"^35\"/><path id=\"single-leg-romanian-deadlift-m-mo-3\" d=\"^36\"/><path id=\"single-leg-romanian-deadlift-m-mo-4\" d=\"^37\"/><path id=\"single-leg-romanian-deadlift-m-mo-5\" d=\"^38\"/><path id=\"single-leg-romanian-deadlift-m-mo-6\" d=\"^39\"/><path id=\"single-leg-romanian-deadlift-m-mo-7\" d=\"^40\"/><path id=\"single-leg-romanian-deadlift-m-mo-8\" d=\"^41\"/><path id=\"single-leg-romanian-deadlift-m-mo-9\" d=\"^42\"/><path id=\"single-leg-romanian-deadlift-m-mo-10\" d=\"^43\"/><path id=\"single-leg-romanian-deadlift-m-mo-11\" d=\"^46\"/><path id=\"single-leg-romanian-deadlift-m-mo-12\" d=\"^47\"/><path id=\"single-leg-romanian-deadlift-m-mo-13\" d=\"^48\"/><path id=\"single-leg-romanian-deadlift-m-mo-14\" d=\"^49\"/><path id=\"single-leg-romanian-deadlift-m-mo-15\" d=\"^39\"/><path id=\"single-leg-romanian-deadlift-m-mo-16\" d=\"^40\"/><path id=\"single-leg-romanian-deadlift-m-mo-17\" d=\"^41\"/><path id=\"single-leg-romanian-deadlift-m-mo-18\" d=\"^42\"/><path id=\"single-leg-romanian-deadlift-m-mo-19\" d=\"^43\"/><path id=\"single-leg-romanian-deadlift-m-mo-20\" d=\"^52\"/><path id=\"single-leg-romanian-deadlift-m-mo-21\" d=\"^53\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#single-leg-romanian-deadlift-m-dots)\"/>\n  <path class=\"datum\" d=\"^50\"/><path class=\"floorline\" d=\"^51\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-m-st-head\"/><use href=\"#single-leg-romanian-deadlift-m-st-torso\"/><use href=\"#single-leg-romanian-deadlift-m-st-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-m-st-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-m-st-shank.r\"/><use href=\"#single-leg-romanian-deadlift-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-m-st-head\"/><use href=\"#single-leg-romanian-deadlift-m-st-torso\"/><use href=\"#single-leg-romanian-deadlift-m-st-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-m-st-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-m-st-shank.r\"/><use href=\"#single-leg-romanian-deadlift-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-m-st-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-st-upper.r\"/><use href=\"#single-leg-romanian-deadlift-m-st-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-st-fore.r\"/><use href=\"#single-leg-romanian-deadlift-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-m-st-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-st-upper.r\"/><use href=\"#single-leg-romanian-deadlift-m-st-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-st-fore.r\"/><use href=\"#single-leg-romanian-deadlift-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-m-g0-head\"/><use href=\"#single-leg-romanian-deadlift-m-g0-torso\"/><use href=\"#single-leg-romanian-deadlift-m-g0-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-m-g0-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-m-g0-shank.r\"/><use href=\"#single-leg-romanian-deadlift-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-m-g0-head\"/><use href=\"#single-leg-romanian-deadlift-m-g0-torso\"/><use href=\"#single-leg-romanian-deadlift-m-g0-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-m-g0-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-m-g0-shank.r\"/><use href=\"#single-leg-romanian-deadlift-m-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-m-g0-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-g0-upper.r\"/><use href=\"#single-leg-romanian-deadlift-m-g0-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-g0-fore.r\"/><use href=\"#single-leg-romanian-deadlift-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-m-g0-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-g0-upper.r\"/><use href=\"#single-leg-romanian-deadlift-m-g0-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-g0-fore.r\"/><use href=\"#single-leg-romanian-deadlift-m-g0-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-m-g0-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-m-g0-eq1.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-m-g1-head\"/><use href=\"#single-leg-romanian-deadlift-m-g1-torso\"/><use href=\"#single-leg-romanian-deadlift-m-g1-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-m-g1-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-m-g1-shank.r\"/><use href=\"#single-leg-romanian-deadlift-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-m-g1-head\"/><use href=\"#single-leg-romanian-deadlift-m-g1-torso\"/><use href=\"#single-leg-romanian-deadlift-m-g1-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-m-g1-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-m-g1-shank.r\"/><use href=\"#single-leg-romanian-deadlift-m-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-m-g1-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-g1-upper.r\"/><use href=\"#single-leg-romanian-deadlift-m-g1-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-g1-fore.r\"/><use href=\"#single-leg-romanian-deadlift-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-m-g1-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-g1-upper.r\"/><use href=\"#single-leg-romanian-deadlift-m-g1-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-g1-fore.r\"/><use href=\"#single-leg-romanian-deadlift-m-g1-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-m-g1-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-m-g1-eq1.dumbbell.0-0\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-m-e-thigh.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-kneecap.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-shank.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-foot.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-shcap.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-upper.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-elbowcap.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-fore.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-m-e-thigh.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-kneecap.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-shank.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-foot.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-shcap.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-upper.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-elbowcap.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-fore.l\"/><use href=\"#single-leg-romanian-deadlift-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-m-e-head\"/><use href=\"#single-leg-romanian-deadlift-m-e-torso\"/><use href=\"#single-leg-romanian-deadlift-m-e-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-m-e-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-m-e-shank.r\"/><use href=\"#single-leg-romanian-deadlift-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-m-e-head\"/><use href=\"#single-leg-romanian-deadlift-m-e-torso\"/><use href=\"#single-leg-romanian-deadlift-m-e-thigh.r\"/><use href=\"#single-leg-romanian-deadlift-m-e-kneecap.r\"/><use href=\"#single-leg-romanian-deadlift-m-e-shank.r\"/><use href=\"#single-leg-romanian-deadlift-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-m-e-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-e-upper.r\"/><use href=\"#single-leg-romanian-deadlift-m-e-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-e-fore.r\"/><use href=\"#single-leg-romanian-deadlift-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-leg-romanian-deadlift-m-e-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-e-upper.r\"/><use href=\"#single-leg-romanian-deadlift-m-e-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-e-fore.r\"/><use href=\"#single-leg-romanian-deadlift-m-e-fist.r\"/></g></g><path class=\"disc\" d=\"^52\"/><path class=\"disc-core\" d=\"^53\"/><path class=\"eq-cable m-line\" d=\"^54\"/><circle class=\"joint\" cx=\"242.23\" cy=\"200.01\" r=\"2.25\"/><circle class=\"joint\" cx=\"239.2\" cy=\"247.53\" r=\"2.25\"/><circle class=\"joint\" cx=\"174.35\" cy=\"206.3\" r=\"2.25\"/><circle class=\"joint\" cx=\"111.76\" cy=\"210.29\" r=\"2.25\"/><circle class=\"joint\" cx=\"193.47\" cy=\"266.04\" r=\"2.25\"/></g><mask id=\"single-leg-romanian-deadlift-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#single-leg-romanian-deadlift-m-m-head\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-m-torso\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-mf-shank.l\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-mf-foot.l\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-m-shcap.l\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-m-upper.l\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-m-fore.l\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-m-fist.l\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-mf-shank.r\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-mf-foot.r\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-m-shcap.r\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-m-upper.r\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-m-fore.r\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-m-fist.r\" fill=\"#000\"/><use href=\"#single-leg-romanian-deadlift-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-leg-romanian-deadlift-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#single-leg-romanian-deadlift-m-mmask)\"><g class=\"u-stroke\"><use href=\"#single-leg-romanian-deadlift-m-m-head\"/><use href=\"#single-leg-romanian-deadlift-m-m-torso\"/><use href=\"#single-leg-romanian-deadlift-m-m-shcap.l\"/><use href=\"#single-leg-romanian-deadlift-m-m-upper.l\"/><use href=\"#single-leg-romanian-deadlift-m-m-elbowcap.l\"/><use href=\"#single-leg-romanian-deadlift-m-m-fore.l\"/><use href=\"#single-leg-romanian-deadlift-m-m-fist.l\"/><use href=\"#single-leg-romanian-deadlift-m-m-shcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-m-upper.r\"/><use href=\"#single-leg-romanian-deadlift-m-m-elbowcap.r\"/><use href=\"#single-leg-romanian-deadlift-m-m-fore.r\"/><use href=\"#single-leg-romanian-deadlift-m-m-fist.r\"/><use href=\"#single-leg-romanian-deadlift-m-m-eq0\"/><use href=\"#single-leg-romanian-deadlift-m-m-eq1\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MYHA1NwB1L!gR7LN6E4LP4I2LU2jLoA1LB1(2L)2Y4L*4J6LK4_6LG2D5Lx2A4LT1F3LG1A2LvF1Lj4L9nLfN1LvH3Lv!1LncLnz1LjV2Ljz4LdT5\"/><path class=\"m-arrow\" d=\"~MN.H1HAvL0ww3MXi)oLYiwpL0)R1\"/><path class=\"m-arrow\" d=\"~M(GO1Sz_1LID1AG6MXdxsLYdysLH9zR1\"/><path class=\"leader m\" d=\"M219.43 176.96L163.48 166H153.48\"/><path class=\"leader m\" d=\"M236.09 329.71L249 314H259\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"single-leg-romanian-deadlift-m-round\" data-key=\"round\" data-cue=\"The back and shoulders round as you reach down.\" class=\"plate-callout two m\" style=\"left:26.82%;top:40.22%\" aria-pressed=\"true\">Back<br>rounds</button><button type=\"button\" id=\"single-leg-romanian-deadlift-m-low\" data-key=\"low\" data-cue=\"The dumbbell is reached to the floor, well past mid-shin.\" class=\"plate-callout two m\" style=\"left:70.95%;top:81.56%\" aria-pressed=\"false\">Dumbbell<br>too low</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "line",
        cues: [{ key: "line", cue: "Keep your head, back and free leg in one line, neck neutral." }, { key: "knee", cue: "Keep your standing knee bent about 15-20 degrees, not locked." }, { key: "shin", cue: "Stop the dumbbell at about mid-shin, in front of your standing leg." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "round",
        cues: [{ key: "round", cue: "The back and shoulders round as you reach down." }, { key: "low", cue: "The dumbbell is reached to the floor, well past mid-shin." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Back rounds</b><span>The back and shoulders round as you reach down.</span></li><li><b>Dumbbell too low</b><span>The dumbbell is reached to the floor, well past mid-shin.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower 2 seconds, stand 1 second, balance 1 second\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Stand</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Balance</b><span>1 s</span></div></div></div>",
      alt: "Single-leg Romanian deadlift, side view. Standing on the left leg with the knee bent about 15 to 20 degrees and a dumbbell in the right hand, the lifter pushes the hips back until the dumbbell is about mid-shin, head, back and right leg in one straight line.",
      mistakeAlt: "Single-Leg Romanian Deadlift: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hold",
    "why": "D-SHIP-C3: the card has no hand zoom (card-no-zoom); the grip copy carries c1, c3 and c18.",
    "handle": "dumbbell",
    "width": {
      "text": "One hand. The dumbbell lowers in front of the standing leg.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-sl-rdl"
        ],
        "note": "c3"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [],
        "note": "card inherit grip.thumb: the parent's wrapped thumb carries over to a dumbbell handle by reasoning (MECH)."
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "ext": [
        -10,
        10
      ],
      "limitText": "Keep the wrist neutral, in line with the forearm.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [],
        "note": "card inherit grip.wrist: same hold archetype and hanging load as the parent, so its neutral range applies (MECH)."
      }
    },
    "pose": {
      "thumb": "wrapped"
    },
    "faults": [],
    "gripLine": "One dumbbell in the hand opposite your standing leg. Grip it hard, thumb wrapped.",
    "cue": "Grip hard, arm straight."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "load",
      "text": "Hold one dumbbell in the hand opposite your standing leg.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-sl-rdl"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Stand on that leg with the knee soft, about 15-20 degrees.",
      "zoom": "slrdl-knee",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gentilcore-slrdl"
        ],
        "note": "c10"
      }
    },
    {
      "kind": "safety",
      "text": "Balance shaky? Keep the free leg's toes touching the floor.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sl-rdl"
        ],
        "note": "c6"
      }
    },
    {
      "kind": "position",
      "text": "Do all reps on one leg, then switch.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sl-rdl"
        ],
        "note": "c19"
      }
    },
    {
      "kind": "load",
      "text": "Beat target by one or two reps? Add 2 to 10 percent.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "acsm2009"
        ],
        "note": "c17"
      }
    }
  ],
  posture: [
    {
      "key": "hips",
      "label": "Hips back",
      "detail": "Hips back. Don't reach the dumbbell down.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gentilcore-slrdl"
        ],
        "note": "c9"
      }
    },
    {
      "key": "line",
      "label": "Straight line",
      "detail": "Head to heel in one straight line, neck neutral.",
      "anchor": {
        "pose": "end",
        "at": "backMid"
      },
      "zoom": "slrdl-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gentilcore-slrdl"
        ],
        "note": "c8"
      }
    },
    {
      "key": "knee",
      "label": "Soft knee",
      "detail": "Standing knee bent about 15-20 degrees, not locked.",
      "anchor": {
        "pose": "end",
        "at": "knee.l"
      },
      "zoom": "slrdl-knee",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gentilcore-slrdl"
        ],
        "note": "c10"
      }
    },
    {
      "key": "level",
      "label": "Hips level",
      "detail": "Hips level. The lifted side does not turn up.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sl-rdl"
        ],
        "note": "c5"
      }
    },
    {
      "key": "heel",
      "label": "Heel weighted",
      "detail": "Weight back in the standing heel.",
      "anchor": {
        "pose": "end",
        "at": "heel.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gentilcore-slrdl"
        ],
        "note": "c11"
      }
    },
    {
      "key": "range",
      "label": "Shorter range",
      "detail": "A shorter range is fine while control builds.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gentilcore-slrdl"
        ],
        "note": "c12"
      }
    }
  ],
  zooms: [
    {
      "key": "slrdl-line",
      "chip": "Line",
      "heading": "Body line",
      "kind": "posture",
      "feelRow": "low-back"
    },
    {
      "key": "slrdl-knee",
      "chip": "Knee",
      "heading": "Standing knee",
      "kind": "posture"
    }
  ],
  chips: [
    "slrdl-line",
    "slrdl-knee",
    "feel"
  ],
  copy: {
    "setupLine": "Dumbbell in the hand opposite your standing leg. Standing knee soft, about 15-20 degrees.",
    "mistakeLine": "Don't reach the dumbbell to the floor. Stop around mid-shin with a flat back.",
    "cueLine": "Hips back, one straight line.",
    "variantLine": "Bodyweight version: same body position, no dumbbell to hold."
  },
  mistakes: [
    {
      "key": "reach",
      "title": "Reaching to the floor, rounding",
      "zoom": "slrdl-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gentilcore-slrdl"
        ],
        "note": "c7, c9"
      },
      "fix": "Stop around mid-shin with a flat back."
    },
    {
      "key": "hip",
      "title": "Opening the lifted-leg hip",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sl-rdl",
          "gentilcore-slrdl"
        ],
        "note": "c5, c12"
      },
      "fix": "Keep both hips pointing at the floor. Shorten the range if needed."
    },
    {
      "key": "toes",
      "title": "Weight drifting onto the toes",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gentilcore-slrdl"
        ],
        "note": "c11"
      },
      "fix": "Push the hips back and sit into the standing heel."
    }
  ],
  risks: [
    {
      "key": "balance",
      "text": "Losing balance on one leg: keep the free leg's toes on the floor.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sl-rdl",
          "gentilcore-slrdl"
        ],
        "note": "c6, c13"
      }
    },
    {
      "key": "round",
      "text": "Rounding the back while reaching low.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "gentilcore-slrdl"
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
    "ace-sl-rdl",
    "sl-sl-rdl",
    "gentilcore-slrdl",
    "mo2023",
    "acsm2009",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/single_leg_romanian_deadlift.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

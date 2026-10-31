// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=5a3495182cb05ff1b6b21eba499d70e529eae958ef21b152f5cce584149c928e
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_hanging_leg_raise",
  name: "Hanging Leg Raise",
  hashes: { inputsSha256: "5a3495182cb05ff1b6b21eba499d70e529eae958ef21b152f5cce584149c928e", golden: "59644b737389e9c10626701e297d441385c1bfa1dd90805e3e6baa7727ec9539" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"hanging-leg-raise-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"hanging-leg-raise-n-st-thigh.l\" d=\"~#F12F-rJJE1*Vr-yD1R1Iaz10y3PX1F5)6N2K3H2)N1_aGk2.h.aGkG2)N1K2K3E5)6x3PX1A10S1IaRrOaKjDA12YvJjDA101000010001010001100002000001020000000001000002100000000001010010000000020000000\"/><path id=\"hanging-leg-raise-n-st-kneecap.l\" d=\"~~SVs(DS1UE10\"/><path id=\"hanging-leg-raise-n-st-shank.l\" d=\"~#F12AUs(DS1KXsB*P1S1KaD10F4WX1F5*6N2O3E3B.1J6zc2OaK6zcF3B.1K2O3E5*6E4WX1B10R1KaIbHaVb!l2AjUb!l00101020001000001002000000110000000001000000022000002000100000000002000000001200\"/><path id=\"hanging-leg-raise-n-st-foot.l\" d=\"~#o2FTtw!.1GKu*F.1y9H7yh8PtX9yG2(u-.1Ow1-r-kBj*8zz1VbB4KeFrY1OrDc110100000200000000001210000200020000000100000000\"/><path id=\"hanging-leg-raise-n-st-shcap.l\" d=\"~~WSsJNrNH10\"/><path id=\"hanging-leg-raise-n-st-upper.l\" d=\"~#F12PEv(IrKFvKIs0_792K4-G1R2H5x1Y2B3Fy1.7whqSe_9wgy7Ux1N1S2y3y57xH161u!7He6_aGnB1-jId-l00000110000000011002000012000010100001000001011000000000100000101011111100002020\"/><path id=\"hanging-leg-raise-n-st-elbowcap.l\" d=\"~~!NswFjAv0\"/><path id=\"hanging-leg-raise-n-st-fore.l\" d=\"~#F12PNuYGjOHuGyk)1(8jV1tOD1T3y8O1w2)1ytT6wbj(9P5SbB1DtF1y2Y2P8A5BD1qV1w1F9(8iDaXgsEfI8Xh00000100002000000000000101200210000121000001012200000101000002011100000020000202\"/><path id=\"hanging-leg-raise-n-st-head\" d=\"~#w12A*tNTi-Os*Hixh(g.gS8)9.2X2D4G4)6x7*9OfXjD4IbK1K8*g1_j.9_jT5JiY2whDeO1wh0001002000000101001200000020021010000000010000000001000000021020\"/><path id=\"hanging-leg-raise-n-st-torso\" d=\"~#_12WSs_-mz.sXPlR8V5-20P8PfP8Y5HbAeU51T5zl-jz7IbF4FeE4HiV5_jzeUfRfD4K8x7Bexozv.9xoV50K82Fbye!2A7Gbx7Bew7T5NiW5W5Fb*9!2y7TG2Hs00000000010000020000011100020011101001002101100002200000020000000020000000020001012000000000000020001200100000001020\"/><path id=\"hanging-leg-raise-n-st-thigh.r\" d=\"^0\"/><path id=\"hanging-leg-raise-n-st-kneecap.r\" d=\"^1\"/><path id=\"hanging-leg-raise-n-st-shank.r\" d=\"^2\"/><path id=\"hanging-leg-raise-n-st-foot.r\" d=\"^3\"/><path id=\"hanging-leg-raise-n-st-shcap.r\" d=\"^4\"/><path id=\"hanging-leg-raise-n-st-upper.r\" d=\"^5\"/><path id=\"hanging-leg-raise-n-st-elbowcap.r\" d=\"^6\"/><path id=\"hanging-leg-raise-n-st-fore.r\" d=\"^7\"/><path id=\"hanging-leg-raise-n-g0-head\" d=\"~#w12HxsPPizUqTEizh_gxhJ8-9*2*2F4z4z7x7)9Gf.jH4GbI1O8*g5(jV9YjO5Niw3_gHeO1(g1000000002000010120001001000220000010021002000001000000000002000\"/><path id=\"hanging-leg-raise-n-g0-torso\" d=\"~#_12WVqPWmO(qRKlE8x4z17A9YeW8F5(bWdF52I5*k.h-5)aF5UdX5UhT7DiEg_dzhF3*8R8EdGrIsOc-mG5(3T3J3NbD7D3!6VbO6-dU7.4WiD6D7WcVaP2F5XG2Ur02100000000020000000002000110100221200100202000020000001110010110000000000200000000001021000010000000101111000002100\"/><path id=\"hanging-leg-raise-n-g0-thigh.r\" d=\"~#F12W(qDxF1GGqI*D1x6T8tiFrHP1W1R8kz4XiBI1o)m.7xgXiKd-mxG1X3z2X7-3YlyT1w1fB3)9Gt_2I1wG1weNsJx1(n01000000001001101000101000100200200101101000010000000000000000000120011000001010\"/><path id=\"hanging-leg-raise-n-g0-kneecap.r\" d=\"~~FKw1w_P1UE10\"/><path id=\"hanging-leg-raise-n-g0-shank.r\" d=\"~#F12WOw1HIR1xxw1xAP1*2zaw1fNrWP1_1R8oB4xsEU1qVdO4R9*aB8)lxX1V3B2X7)3UjFU1ve-5X8*5DeK1WoD8Jh_j!e00000000000000001101100000000000020000000001111002000000000000000010100100000200\"/><path id=\"hanging-leg-raise-n-g0-foot.r\" d=\"~#o2PNB1FW-1x(B1*-Y1Hb_2Sfx7UmElFO2-2*z2E4*x1x7Bl0-A1F4*9IbPp-9XjSm121101000000110101101001010000000010100000012100\"/><path id=\"hanging-leg-raise-n-g1-head\" d=\"~#w12NPqDIiGzp*xiGhWgxhF8.9x3*2D4x4z7*6)9BfzkN4BbG1R8*g7wkR9!jG5HiA3YgNeV1wh1110102002010000000022020000000200101002000000000000002000220000\"/><path id=\"hanging-leg-raise-n-g1-torso\" d=\"~#_12Wzp_Pm*Jp*ElX7R2gfW9(d(8_4PcDdY44.4Vkxg.4IaD6_cE7YgO9Fgxi!bRiH2E9)9EcEuBp-eGlR4W7Y1A6Pa6P3_6*bx6OdH8)3YiU6!8yeTbF2P3xH2wr11010020022000001100100010012100022000101000020200002000000210100002201011010000000000101000100000000011000200000001\"/><path id=\"hanging-leg-raise-n-g1-thigh.r\" d=\"~#F12__qHIF1XXpTUE1G9x5js!K1JvG2O8E1)3*z1IuK9xlBe-a-mX3TD1.qB43X81AH1DA1mpG7T7xpPf(gJB1ApJjPF1S602100000020002111000000002200000020000002100000010001002001000010001201000002000\"/><path id=\"hanging-leg-raise-n-g1-kneecap.r\" d=\"~~POz1NFK1UE10\"/><path id=\"hanging-leg-raise-n-g1-shank.r\" d=\"~#F12Y!z1!EN1.(y1OHK1)6.7otJK1Sw1*1R8x1x4RO1Rz1)4Vcz8-6KdX2BI1TF1E4bV8d!E1yE1ns)8K5kFfD9wnYeJcDoy500020001000000010100000000002000001210000000000000001000020000010001002200101020\"/><path id=\"hanging-leg-raise-n-g1-foot.r\" d=\"~#o2P*I1WWT1T)I1KWS1JbE2Db)cSbXsSD2zA1G)1(o-x1!7Bjw9RvJjXdx6(iXjK8!s001000002020000010000010010000100000000000101002\"/><path id=\"hanging-leg-raise-n-g2-head\" d=\"~#w12wNpDDi*woO!hKhPgBhy8.9z3.2D4z4B7X6xaxfBkS4EbE1O8*gdykK9wkx5FiF3SgUe-1(g2100011010110000000010200000110011100000000021200001100000002001\"/><path id=\"hanging-leg-raise-n-g2-torso\" d=\"~#_12ywoNImTGoVylI7rD2vDaydA9S4AdPcJ4aR4RkxeG4.9y7ycT8SfBbFe-jW9XjH1I9Ebzb-w1XlxhRjz3HbN7y8S8O6Y3U6zcR5xd!8E3wjD7HaNfKcY1W1EH2Hq00002000000010000200000010101020000000200100000100000100000000000000200101000010120021010120000000001100021000000001\"/><path id=\"hanging-leg-raise-n-g2-thigh.r\" d=\"~#F12wKrYFF1Rzq.zF1Raf3A1(W1_7X5R6*2x3TK1Ib-hTeRhO3)lW6RN1*6.3Y1-7Y3YV1!d8x1*9T3RfwpWvAqAvA6FE1*b00000000221010010100000000000010110100000002101110100200000000002000220100000000\"/><path id=\"hanging-leg-raise-n-g2-kneecap.r\" d=\"~~SDB1_GF1UE10\"/><path id=\"hanging-leg-raise-n-g2-shank.r\" d=\"~#F12SzD1NRG1z!A1KzG1T9E4ax1!W1HaI5*6X2E3)-1Bc)9G9EaV2Edy3IY1Oi)3N1z8F3YU1Ui9y1Raz1A7SdwiwhUi(4yoT501000000000200000110010101000200000000001001111000002200001200000100002000101010\"/><path id=\"hanging-leg-raise-n-g2-foot.r\" d=\"~#o2AWO1JzI1OHO1GBH1P9X6S4RgV1*uYP1O(1.N1FR1GrPlRdFgKk(u)e8Y8-pU4Wt010022010000000000000012000002101000001000010111\"/><path id=\"hanging-leg-raise-n-e-thigh.l\" d=\"~#F12SSsU-E1EIrTEF1T9H4aw1YU1Ghx8E3)3O1*K1waOmG5EhW4XgYf.J1JeV2D3I5(6NW1Ib9z1OaD1*2JtwF1H9UuB8!tzs00020000000110020000111011010000000020001000000000000000101002020020011000000000\"/><path id=\"hanging-leg-raise-n-e-kneecap.l\" d=\"~~DFB1H(y1UE10\"/><path id=\"hanging-leg-raise-n-e-shank.l\" d=\"~#F12(WD1YDA1EKB1XHA1Ra85x1AW1*d-7)3-3X1X-1Sd)cG4Ka_1XaP8._1w7)2w3*5N6SX1O58D1xaH3AcJ9SnY7(iG3NjGf10000200000020000220002001010011110000002000200000000120021110000000200000000011\"/><path id=\"hanging-leg-raise-n-e-foot.l\" d=\"~#o2!xP1NSx1RHO1x!w1U5EaX2-gVeIr_hEK2XlPw2Rf(uK5PkO5UA1OdW6*2ErYgyp101000000010100000100021012000001000000021020010\"/><path id=\"hanging-leg-raise-n-e-shcap.l\" d=\"~~w-n(XqNH10\"/><path id=\"hanging-leg-raise-n-e-upper.l\" d=\"~#F12YJqWxrXAqBwsz2S791U7IG1)3N4-1H2Vc!vOcyeG3De_4Di-2Dy1k!2S1Y5WbKF182K1Y7YdF4(gEjS4EjR6-o10000010100200001000200001100001001000111100000100000000101010000000000002002000\"/><path id=\"hanging-leg-raise-n-e-elbowcap.l\" d=\"~~SwqDYiAv0\"/><path id=\"hanging-leg-raise-n-e-fore.l\" d=\"~#F12H(rAzjOTrR-jK4y81-1waBB1V5Y6x2N1BaHrR9S8G3N9!1ScK9WriJ28!8_fzz1F1I1V1A9J8A3UezdA5Ie.2Kj10020000001000200200000001010100000100000000100220020000001002100000000001010010\"/><path id=\"hanging-leg-raise-n-e-fist.l\" d=\"~~YwtUTaHs1\"/><path id=\"hanging-leg-raise-n-e-head\" d=\"~#w12P*oFAiRPnB_hRhJgEh!7-9B3*2D4)3E7X6za.eGkW4BbB1R8.ghykB9wk)4HiP3PgYex2!g0000000000010020020000021000000001000000001010022002000000001100\"/><path id=\"hanging-leg-raise-n-e-torso\" d=\"~#_12JNnyGmGYnIwl-6kY3I1WaDcH9y4Wdwcy4gB4VkBc)3z9!7wb-9Fe*cwczlP7Xk8K9Gc.9)y1)hBjThz1_eJdA9Y5)cw4P6Ic*4VcJ9I2yj_7(bWgIdJ15RH2Wp02220002101101101120000000000000020220100000100000011000000020001010100121000000000000020000010101000010120000101000\"/><path id=\"hanging-leg-raise-n-e-thigh.r\" d=\"^28\"/><path id=\"hanging-leg-raise-n-e-kneecap.r\" d=\"^29\"/><path id=\"hanging-leg-raise-n-e-shank.r\" d=\"^30\"/><path id=\"hanging-leg-raise-n-e-foot.r\" d=\"^31\"/><path id=\"hanging-leg-raise-n-e-shcap.r\" d=\"^32\"/><path id=\"hanging-leg-raise-n-e-upper.r\" d=\"^33\"/><path id=\"hanging-leg-raise-n-e-elbowcap.r\" d=\"^34\"/><path id=\"hanging-leg-raise-n-e-fore.r\" d=\"^35\"/><path id=\"hanging-leg-raise-n-e-fist.r\" d=\"^36\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#hanging-leg-raise-n-dots)\"/>\n  <path class=\"datum\" d=\"~MwxsyYB1LWXn0\"/><path class=\"floorline\" d=\"M56.13 345.85H301.87\"/><path class=\"eq\" d=\"~MFKuAEaL0zR5Q0OcOcUA5LA5PcQOc0z5PcLPcUA5Q0PcPcTA5Lz5OcQPc0A5OcZ\"/><path class=\"eq-solid\" d=\"~~APtUTa(c0\"/><path class=\"eq-pin\" d=\"~~H-tUTaY30\"/><path class=\"eq-line\" d=\"~MJ.oPG4LJza0\"/><path class=\"arc measure\" d=\"M143.52 193.29L136.33 166.23A28 28 0 0 1 170.57 186.04Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-n-st-thigh.l\"/><use href=\"#hanging-leg-raise-n-st-kneecap.l\"/><use href=\"#hanging-leg-raise-n-st-shank.l\"/><use href=\"#hanging-leg-raise-n-st-foot.l\"/><use href=\"#hanging-leg-raise-n-st-shcap.l\"/><use href=\"#hanging-leg-raise-n-st-upper.l\"/><use href=\"#hanging-leg-raise-n-st-elbowcap.l\"/><use href=\"#hanging-leg-raise-n-st-fore.l\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-n-st-thigh.l\"/><use href=\"#hanging-leg-raise-n-st-kneecap.l\"/><use href=\"#hanging-leg-raise-n-st-shank.l\"/><use href=\"#hanging-leg-raise-n-st-foot.l\"/><use href=\"#hanging-leg-raise-n-st-shcap.l\"/><use href=\"#hanging-leg-raise-n-st-upper.l\"/><use href=\"#hanging-leg-raise-n-st-elbowcap.l\"/><use href=\"#hanging-leg-raise-n-st-fore.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-n-st-head\"/><use href=\"#hanging-leg-raise-n-st-torso\"/><use href=\"#hanging-leg-raise-n-st-thigh.r\"/><use href=\"#hanging-leg-raise-n-st-kneecap.r\"/><use href=\"#hanging-leg-raise-n-st-shank.r\"/><use href=\"#hanging-leg-raise-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-n-st-head\"/><use href=\"#hanging-leg-raise-n-st-torso\"/><use href=\"#hanging-leg-raise-n-st-thigh.r\"/><use href=\"#hanging-leg-raise-n-st-kneecap.r\"/><use href=\"#hanging-leg-raise-n-st-shank.r\"/><use href=\"#hanging-leg-raise-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-n-st-shcap.r\"/><use href=\"#hanging-leg-raise-n-st-upper.r\"/><use href=\"#hanging-leg-raise-n-st-elbowcap.r\"/><use href=\"#hanging-leg-raise-n-st-fore.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-n-st-shcap.r\"/><use href=\"#hanging-leg-raise-n-st-upper.r\"/><use href=\"#hanging-leg-raise-n-st-elbowcap.r\"/><use href=\"#hanging-leg-raise-n-st-fore.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-n-g0-head\"/><use href=\"#hanging-leg-raise-n-g0-torso\"/><use href=\"#hanging-leg-raise-n-g0-thigh.r\"/><use href=\"#hanging-leg-raise-n-g0-kneecap.r\"/><use href=\"#hanging-leg-raise-n-g0-shank.r\"/><use href=\"#hanging-leg-raise-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-n-g0-head\"/><use href=\"#hanging-leg-raise-n-g0-torso\"/><use href=\"#hanging-leg-raise-n-g0-thigh.r\"/><use href=\"#hanging-leg-raise-n-g0-kneecap.r\"/><use href=\"#hanging-leg-raise-n-g0-shank.r\"/><use href=\"#hanging-leg-raise-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-n-g1-head\"/><use href=\"#hanging-leg-raise-n-g1-torso\"/><use href=\"#hanging-leg-raise-n-g1-thigh.r\"/><use href=\"#hanging-leg-raise-n-g1-kneecap.r\"/><use href=\"#hanging-leg-raise-n-g1-shank.r\"/><use href=\"#hanging-leg-raise-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-n-g1-head\"/><use href=\"#hanging-leg-raise-n-g1-torso\"/><use href=\"#hanging-leg-raise-n-g1-thigh.r\"/><use href=\"#hanging-leg-raise-n-g1-kneecap.r\"/><use href=\"#hanging-leg-raise-n-g1-shank.r\"/><use href=\"#hanging-leg-raise-n-g1-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-n-g2-head\"/><use href=\"#hanging-leg-raise-n-g2-torso\"/><use href=\"#hanging-leg-raise-n-g2-thigh.r\"/><use href=\"#hanging-leg-raise-n-g2-kneecap.r\"/><use href=\"#hanging-leg-raise-n-g2-shank.r\"/><use href=\"#hanging-leg-raise-n-g2-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-n-g2-head\"/><use href=\"#hanging-leg-raise-n-g2-torso\"/><use href=\"#hanging-leg-raise-n-g2-thigh.r\"/><use href=\"#hanging-leg-raise-n-g2-kneecap.r\"/><use href=\"#hanging-leg-raise-n-g2-shank.r\"/><use href=\"#hanging-leg-raise-n-g2-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-n-e-thigh.l\"/><use href=\"#hanging-leg-raise-n-e-kneecap.l\"/><use href=\"#hanging-leg-raise-n-e-shank.l\"/><use href=\"#hanging-leg-raise-n-e-foot.l\"/><use href=\"#hanging-leg-raise-n-e-shcap.l\"/><use href=\"#hanging-leg-raise-n-e-upper.l\"/><use href=\"#hanging-leg-raise-n-e-elbowcap.l\"/><use href=\"#hanging-leg-raise-n-e-fore.l\"/><use href=\"#hanging-leg-raise-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-n-e-thigh.l\"/><use href=\"#hanging-leg-raise-n-e-kneecap.l\"/><use href=\"#hanging-leg-raise-n-e-shank.l\"/><use href=\"#hanging-leg-raise-n-e-foot.l\"/><use href=\"#hanging-leg-raise-n-e-shcap.l\"/><use href=\"#hanging-leg-raise-n-e-upper.l\"/><use href=\"#hanging-leg-raise-n-e-elbowcap.l\"/><use href=\"#hanging-leg-raise-n-e-fore.l\"/><use href=\"#hanging-leg-raise-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-n-e-head\"/><use href=\"#hanging-leg-raise-n-e-torso\"/><use href=\"#hanging-leg-raise-n-e-thigh.r\"/><use href=\"#hanging-leg-raise-n-e-kneecap.r\"/><use href=\"#hanging-leg-raise-n-e-shank.r\"/><use href=\"#hanging-leg-raise-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-n-e-head\"/><use href=\"#hanging-leg-raise-n-e-torso\"/><use href=\"#hanging-leg-raise-n-e-thigh.r\"/><use href=\"#hanging-leg-raise-n-e-kneecap.r\"/><use href=\"#hanging-leg-raise-n-e-shank.r\"/><use href=\"#hanging-leg-raise-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-n-e-shcap.r\"/><use href=\"#hanging-leg-raise-n-e-upper.r\"/><use href=\"#hanging-leg-raise-n-e-elbowcap.r\"/><use href=\"#hanging-leg-raise-n-e-fore.r\"/><use href=\"#hanging-leg-raise-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-n-e-shcap.r\"/><use href=\"#hanging-leg-raise-n-e-upper.r\"/><use href=\"#hanging-leg-raise-n-e-elbowcap.r\"/><use href=\"#hanging-leg-raise-n-e-fore.r\"/><use href=\"#hanging-leg-raise-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MwHuUTaLdI3Lr8LleLlkLdqL7qL2sL6qLeqLkkLoeLs8Ls1Ls5LodLkjLepL6pL2rL7pLdpLljLldLr5\"/><circle class=\"joint\" cx=\"128.55\" cy=\"136.95\" r=\"2.25\"/><circle class=\"joint\" cx=\"138.19\" cy=\"96.03\" r=\"2.25\"/><circle class=\"joint\" cx=\"143.52\" cy=\"193.29\" r=\"2.25\"/><circle class=\"joint\" cx=\"197.09\" cy=\"178.93\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#U20Fyw1H!!1IIvKw*15v3r7v5tbr7tbrbtdpdrfrfnoK1hljpjllnjlnjllpfnlnfrfpfrdpdtbF15vbp7v7t7t5t3v1r3x11t0t2t2001100200221000000000201210000000110100001000002002000000200000010010021010000010110020100000000120200000000001210000000010020100001000000000202002100001000000200000010\"/><path class=\"arrow\" d=\"~MwOR1SJy1LAlDA1LR_1-x1Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M136.33 166.23A28 28 0 0 1 170.57 186.04\"/><g class=\"arc-ticks\"><path d=\"~MP_qyEx1LOeIW1\"/><path d=\"~M!Rw1FRA1LJW1Re\"/></g><path class=\"leader\" d=\"~M((uYVw1LH_2)G6\"/></g><path data-guide=\"curl\" style=\"display:none\" class=\"lead-guide\" d=\"~MSEm(yF1LNfNuL(4z3LH4-3LU3R4L_2x5L(1O5LuV5L1.5LvV5LT.1DK1LJV1TF2LOD2Up\"/></g><path class=\"leader\" d=\"M126.36 187.55L93.33 196H83.33\"/><circle class=\"anchor\" cx=\"126.36\" cy=\"187.55\" r=\"1.5\"/><path class=\"leader\" d=\"~MPDR1J!vL0T.7\"/><circle class=\"anchor\" cx=\"251.92\" cy=\"163.26\" r=\"1.5\"/><path class=\"leader\" d=\"~MJImHOtL-A2e\"/><circle class=\"anchor\" cx=\"114.46\" cy=\"150.93\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"hanging-leg-raise-n-curl\" data-key=\"curl\" data-cue=\"At the top, curl the pelvis up toward the ribs so the abs finish the lift.\" class=\"plate-callout two\" style=\"left:4.75%;top:48.6%\" aria-pressed=\"true\">Pelvis<br>curls up</button><button type=\"button\" id=\"hanging-leg-raise-n-legs\" data-key=\"legs\" data-cue=\"Keep the knees straight or only slightly soft all the way up.\" class=\"plate-callout\" style=\"left:59.78%;top:25.14%\" aria-pressed=\"false\">Legs straight</button><button type=\"button\" id=\"hanging-leg-raise-n-still\" data-key=\"still\" data-cue=\"Hang still; lift slowly and lower under control, no swing.\" class=\"plate-callout\" style=\"left:9.5%;top:36.03%\" aria-pressed=\"false\">No swing</button><span class=\"plate-arc-label\" style=\"left:49.16%;top:35.75%\"><b>Hip</b><span>90° to trunk</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"hanging-leg-raise-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"hanging-leg-raise-m-st-thigh.l\" d=\"^0\"/><path id=\"hanging-leg-raise-m-st-kneecap.l\" d=\"^1\"/><path id=\"hanging-leg-raise-m-st-shank.l\" d=\"^2\"/><path id=\"hanging-leg-raise-m-st-foot.l\" d=\"^3\"/><path id=\"hanging-leg-raise-m-st-shcap.l\" d=\"^4\"/><path id=\"hanging-leg-raise-m-st-upper.l\" d=\"^5\"/><path id=\"hanging-leg-raise-m-st-elbowcap.l\" d=\"^6\"/><path id=\"hanging-leg-raise-m-st-fore.l\" d=\"^7\"/><path id=\"hanging-leg-raise-m-st-head\" d=\"^8\"/><path id=\"hanging-leg-raise-m-st-torso\" d=\"^9\"/><path id=\"hanging-leg-raise-m-st-thigh.r\" d=\"^0\"/><path id=\"hanging-leg-raise-m-st-kneecap.r\" d=\"^1\"/><path id=\"hanging-leg-raise-m-st-shank.r\" d=\"^2\"/><path id=\"hanging-leg-raise-m-st-foot.r\" d=\"^3\"/><path id=\"hanging-leg-raise-m-st-shcap.r\" d=\"^4\"/><path id=\"hanging-leg-raise-m-st-upper.r\" d=\"^5\"/><path id=\"hanging-leg-raise-m-st-elbowcap.r\" d=\"^6\"/><path id=\"hanging-leg-raise-m-st-fore.r\" d=\"^7\"/><path id=\"hanging-leg-raise-m-g0-head\" d=\"^10\"/><path id=\"hanging-leg-raise-m-g0-torso\" d=\"^11\"/><path id=\"hanging-leg-raise-m-g0-thigh.r\" d=\"^12\"/><path id=\"hanging-leg-raise-m-g0-kneecap.r\" d=\"^13\"/><path id=\"hanging-leg-raise-m-g0-shank.r\" d=\"^14\"/><path id=\"hanging-leg-raise-m-g0-foot.r\" d=\"^15\"/><path id=\"hanging-leg-raise-m-g1-head\" d=\"^16\"/><path id=\"hanging-leg-raise-m-g1-torso\" d=\"^17\"/><path id=\"hanging-leg-raise-m-g1-thigh.r\" d=\"^18\"/><path id=\"hanging-leg-raise-m-g1-kneecap.r\" d=\"^19\"/><path id=\"hanging-leg-raise-m-g1-shank.r\" d=\"^20\"/><path id=\"hanging-leg-raise-m-g1-foot.r\" d=\"^21\"/><path id=\"hanging-leg-raise-m-g2-head\" d=\"^22\"/><path id=\"hanging-leg-raise-m-g2-torso\" d=\"^23\"/><path id=\"hanging-leg-raise-m-g2-thigh.r\" d=\"^24\"/><path id=\"hanging-leg-raise-m-g2-kneecap.r\" d=\"^25\"/><path id=\"hanging-leg-raise-m-g2-shank.r\" d=\"^26\"/><path id=\"hanging-leg-raise-m-g2-foot.r\" d=\"^27\"/><path id=\"hanging-leg-raise-m-e-thigh.l\" d=\"^28\"/><path id=\"hanging-leg-raise-m-e-kneecap.l\" d=\"^29\"/><path id=\"hanging-leg-raise-m-e-shank.l\" d=\"^30\"/><path id=\"hanging-leg-raise-m-e-foot.l\" d=\"^31\"/><path id=\"hanging-leg-raise-m-e-shcap.l\" d=\"^32\"/><path id=\"hanging-leg-raise-m-e-upper.l\" d=\"^33\"/><path id=\"hanging-leg-raise-m-e-elbowcap.l\" d=\"^34\"/><path id=\"hanging-leg-raise-m-e-fore.l\" d=\"^35\"/><path id=\"hanging-leg-raise-m-e-fist.l\" d=\"^36\"/><path id=\"hanging-leg-raise-m-e-head\" d=\"^37\"/><path id=\"hanging-leg-raise-m-e-torso\" d=\"^38\"/><path id=\"hanging-leg-raise-m-e-thigh.r\" d=\"^28\"/><path id=\"hanging-leg-raise-m-e-kneecap.r\" d=\"^29\"/><path id=\"hanging-leg-raise-m-e-shank.r\" d=\"^30\"/><path id=\"hanging-leg-raise-m-e-foot.r\" d=\"^31\"/><path id=\"hanging-leg-raise-m-e-shcap.r\" d=\"^32\"/><path id=\"hanging-leg-raise-m-e-upper.r\" d=\"^33\"/><path id=\"hanging-leg-raise-m-e-elbowcap.r\" d=\"^34\"/><path id=\"hanging-leg-raise-m-e-fore.r\" d=\"^35\"/><path id=\"hanging-leg-raise-m-e-fist.r\" d=\"^36\"/><path id=\"hanging-leg-raise-m-m-head\" d=\"~#w12A_fHUg*NeGAh-5FnBawg*9W27A5G7.3zb.4Rn)8z2-bT5R6ReW8!bTiyexfDhx7(lJ3N7Hf0000010100101010001000000101002000100110101200101000000020121000\"/><path id=\"hanging-leg-raise-m-m-torso\" d=\"~#_12(_gJ*kxKg-Vj.bX2V4y3_e!aAaJ1NgW7A6V3Ii-fXry3I9J7WcO7Sg*9WfRiNb-iw2G9Ga)b-uIoKf*kx9K8GpR1SnHrU5D5GdK1R9Sc(2wj_52J3)b_7F7OP1y(120000101010200000001010012000200020000020020000010002001110000022002000000020001010000111010110010100000000002010000\"/><path id=\"hanging-leg-raise-m-m-thigh.l\" d=\"~#F12HyoSXB1x_mKJB1Iax2bw1DV1AgV4I7K2K3KI1BiGfBh-gz6-mH3*J1)dz4A1E8U2wT1_lcx1B9x5EjJmJrUu_t_aSF1.510000010000220000010121000000000000000101000100200001101000020002200021010100002\"/><path id=\"hanging-leg-raise-m-m-kneecap.l\" d=\"~~UXx1HNE1UE10\"/><path id=\"hanging-leg-raise-m-m-shank.l\" d=\"~#F12D-x1((D1*Iy1K-B1N5z9w1e-gFV1N7O4S3G2AjzY1PaX8w4.9O1RdFpTV1vB4E2I8-o(R1x1bN2EaIeH5)i_fE7!hW2So00000120000000101001000000000101000010000200100200210102000002200021000012111100\"/><path id=\"hanging-leg-raise-m-m-foot.l\" d=\"~#o2FyvAGP1Rxw1BxP1W5DaYfS6(uy2AY1wY1BI1OU1)hXtOeKfBs)nS1)eUo!bzuu000101100001000000000001000010000021002000000000\"/><path id=\"hanging-leg-raise-m-m-shcap.l\" d=\"~~U!iFJoNH10\"/><path id=\"hanging-leg-raise-m-m-upper.l\" d=\"~#F12yIlYypV-kx*pK4P695SkXA1B5w3O2S1GmyqGgH9V7NcE1WiVdPv9(2b(5yoRy164-3(6UbN8FmXcSa.gU1Op00200000000002000200111110110100000101010000002000010110100000000000000000000010\"/><path id=\"hanging-leg-raise-m-m-elbowcap.l\" d=\"~~ATnNKhAv0\"/><path id=\"hanging-leg-raise-m-m-fore.l\" d=\"~#F12!IpPxiO_oITi-6F6gX1Hlzw1T7S4G2oIiWmXbD5z6_7B2UcVhDn3P2V2P8DqIsP1tI4D8(6S5wi.7N9*bH3Ij00000021002000010120000010100000000000000000001010000100010002000100000200000000\"/><path id=\"hanging-leg-raise-m-m-thigh.r\" d=\"^59\"/><path id=\"hanging-leg-raise-m-m-kneecap.r\" d=\"^60\"/><path id=\"hanging-leg-raise-m-m-shank.r\" d=\"^61\"/><path id=\"hanging-leg-raise-m-m-foot.r\" d=\"^62\"/><path id=\"hanging-leg-raise-m-m-shcap.r\" d=\"^63\"/><path id=\"hanging-leg-raise-m-m-upper.r\" d=\"^64\"/><path id=\"hanging-leg-raise-m-m-elbowcap.r\" d=\"^65\"/><path id=\"hanging-leg-raise-m-m-fore.r\" d=\"^66\"/><path id=\"hanging-leg-raise-m-mf-fist.l\" d=\"^36\"/><path id=\"hanging-leg-raise-m-mf-fist.r\" d=\"^36\"/><path id=\"hanging-leg-raise-m-mo-0\" d=\"^37\"/><path id=\"hanging-leg-raise-m-mo-1\" d=\"^38\"/><path id=\"hanging-leg-raise-m-mo-2\" d=\"^28\"/><path id=\"hanging-leg-raise-m-mo-3\" d=\"^29\"/><path id=\"hanging-leg-raise-m-mo-4\" d=\"^30\"/><path id=\"hanging-leg-raise-m-mo-5\" d=\"^31\"/><path id=\"hanging-leg-raise-m-mo-6\" d=\"^32\"/><path id=\"hanging-leg-raise-m-mo-7\" d=\"^33\"/><path id=\"hanging-leg-raise-m-mo-8\" d=\"^34\"/><path id=\"hanging-leg-raise-m-mo-9\" d=\"^35\"/><path id=\"hanging-leg-raise-m-mo-10\" d=\"^36\"/><path id=\"hanging-leg-raise-m-mo-11\" d=\"^28\"/><path id=\"hanging-leg-raise-m-mo-12\" d=\"^29\"/><path id=\"hanging-leg-raise-m-mo-13\" d=\"^30\"/><path id=\"hanging-leg-raise-m-mo-14\" d=\"^31\"/><path id=\"hanging-leg-raise-m-mo-15\" d=\"^32\"/><path id=\"hanging-leg-raise-m-mo-16\" d=\"^33\"/><path id=\"hanging-leg-raise-m-mo-17\" d=\"^34\"/><path id=\"hanging-leg-raise-m-mo-18\" d=\"^35\"/><path id=\"hanging-leg-raise-m-mo-19\" d=\"^36\"/><path id=\"hanging-leg-raise-m-mo-20\" d=\"^41\"/><path id=\"hanging-leg-raise-m-mo-21\" d=\"^42\"/><path id=\"hanging-leg-raise-m-mo-22\" d=\"^43\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#hanging-leg-raise-m-dots)\"/>\n  <path class=\"datum\" d=\"^39\"/><path class=\"floorline\" d=\"^40\"/><path class=\"eq\" d=\"^41\"/><path class=\"eq-solid\" d=\"^42\"/><path class=\"eq-pin\" d=\"^43\"/><path class=\"eq-line\" d=\"^44\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-m-st-thigh.l\"/><use href=\"#hanging-leg-raise-m-st-kneecap.l\"/><use href=\"#hanging-leg-raise-m-st-shank.l\"/><use href=\"#hanging-leg-raise-m-st-foot.l\"/><use href=\"#hanging-leg-raise-m-st-shcap.l\"/><use href=\"#hanging-leg-raise-m-st-upper.l\"/><use href=\"#hanging-leg-raise-m-st-elbowcap.l\"/><use href=\"#hanging-leg-raise-m-st-fore.l\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-m-st-thigh.l\"/><use href=\"#hanging-leg-raise-m-st-kneecap.l\"/><use href=\"#hanging-leg-raise-m-st-shank.l\"/><use href=\"#hanging-leg-raise-m-st-foot.l\"/><use href=\"#hanging-leg-raise-m-st-shcap.l\"/><use href=\"#hanging-leg-raise-m-st-upper.l\"/><use href=\"#hanging-leg-raise-m-st-elbowcap.l\"/><use href=\"#hanging-leg-raise-m-st-fore.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-m-st-head\"/><use href=\"#hanging-leg-raise-m-st-torso\"/><use href=\"#hanging-leg-raise-m-st-thigh.r\"/><use href=\"#hanging-leg-raise-m-st-kneecap.r\"/><use href=\"#hanging-leg-raise-m-st-shank.r\"/><use href=\"#hanging-leg-raise-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-m-st-head\"/><use href=\"#hanging-leg-raise-m-st-torso\"/><use href=\"#hanging-leg-raise-m-st-thigh.r\"/><use href=\"#hanging-leg-raise-m-st-kneecap.r\"/><use href=\"#hanging-leg-raise-m-st-shank.r\"/><use href=\"#hanging-leg-raise-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-m-st-shcap.r\"/><use href=\"#hanging-leg-raise-m-st-upper.r\"/><use href=\"#hanging-leg-raise-m-st-elbowcap.r\"/><use href=\"#hanging-leg-raise-m-st-fore.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-m-st-shcap.r\"/><use href=\"#hanging-leg-raise-m-st-upper.r\"/><use href=\"#hanging-leg-raise-m-st-elbowcap.r\"/><use href=\"#hanging-leg-raise-m-st-fore.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-m-g0-head\"/><use href=\"#hanging-leg-raise-m-g0-torso\"/><use href=\"#hanging-leg-raise-m-g0-thigh.r\"/><use href=\"#hanging-leg-raise-m-g0-kneecap.r\"/><use href=\"#hanging-leg-raise-m-g0-shank.r\"/><use href=\"#hanging-leg-raise-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-m-g0-head\"/><use href=\"#hanging-leg-raise-m-g0-torso\"/><use href=\"#hanging-leg-raise-m-g0-thigh.r\"/><use href=\"#hanging-leg-raise-m-g0-kneecap.r\"/><use href=\"#hanging-leg-raise-m-g0-shank.r\"/><use href=\"#hanging-leg-raise-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-m-g1-head\"/><use href=\"#hanging-leg-raise-m-g1-torso\"/><use href=\"#hanging-leg-raise-m-g1-thigh.r\"/><use href=\"#hanging-leg-raise-m-g1-kneecap.r\"/><use href=\"#hanging-leg-raise-m-g1-shank.r\"/><use href=\"#hanging-leg-raise-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-m-g1-head\"/><use href=\"#hanging-leg-raise-m-g1-torso\"/><use href=\"#hanging-leg-raise-m-g1-thigh.r\"/><use href=\"#hanging-leg-raise-m-g1-kneecap.r\"/><use href=\"#hanging-leg-raise-m-g1-shank.r\"/><use href=\"#hanging-leg-raise-m-g1-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-m-g2-head\"/><use href=\"#hanging-leg-raise-m-g2-torso\"/><use href=\"#hanging-leg-raise-m-g2-thigh.r\"/><use href=\"#hanging-leg-raise-m-g2-kneecap.r\"/><use href=\"#hanging-leg-raise-m-g2-shank.r\"/><use href=\"#hanging-leg-raise-m-g2-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-m-g2-head\"/><use href=\"#hanging-leg-raise-m-g2-torso\"/><use href=\"#hanging-leg-raise-m-g2-thigh.r\"/><use href=\"#hanging-leg-raise-m-g2-kneecap.r\"/><use href=\"#hanging-leg-raise-m-g2-shank.r\"/><use href=\"#hanging-leg-raise-m-g2-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-m-e-thigh.l\"/><use href=\"#hanging-leg-raise-m-e-kneecap.l\"/><use href=\"#hanging-leg-raise-m-e-shank.l\"/><use href=\"#hanging-leg-raise-m-e-foot.l\"/><use href=\"#hanging-leg-raise-m-e-shcap.l\"/><use href=\"#hanging-leg-raise-m-e-upper.l\"/><use href=\"#hanging-leg-raise-m-e-elbowcap.l\"/><use href=\"#hanging-leg-raise-m-e-fore.l\"/><use href=\"#hanging-leg-raise-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-m-e-thigh.l\"/><use href=\"#hanging-leg-raise-m-e-kneecap.l\"/><use href=\"#hanging-leg-raise-m-e-shank.l\"/><use href=\"#hanging-leg-raise-m-e-foot.l\"/><use href=\"#hanging-leg-raise-m-e-shcap.l\"/><use href=\"#hanging-leg-raise-m-e-upper.l\"/><use href=\"#hanging-leg-raise-m-e-elbowcap.l\"/><use href=\"#hanging-leg-raise-m-e-fore.l\"/><use href=\"#hanging-leg-raise-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-m-e-head\"/><use href=\"#hanging-leg-raise-m-e-torso\"/><use href=\"#hanging-leg-raise-m-e-thigh.r\"/><use href=\"#hanging-leg-raise-m-e-kneecap.r\"/><use href=\"#hanging-leg-raise-m-e-shank.r\"/><use href=\"#hanging-leg-raise-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-m-e-head\"/><use href=\"#hanging-leg-raise-m-e-torso\"/><use href=\"#hanging-leg-raise-m-e-thigh.r\"/><use href=\"#hanging-leg-raise-m-e-kneecap.r\"/><use href=\"#hanging-leg-raise-m-e-shank.r\"/><use href=\"#hanging-leg-raise-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-m-e-shcap.r\"/><use href=\"#hanging-leg-raise-m-e-upper.r\"/><use href=\"#hanging-leg-raise-m-e-elbowcap.r\"/><use href=\"#hanging-leg-raise-m-e-fore.r\"/><use href=\"#hanging-leg-raise-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hanging-leg-raise-m-e-shcap.r\"/><use href=\"#hanging-leg-raise-m-e-upper.r\"/><use href=\"#hanging-leg-raise-m-e-elbowcap.r\"/><use href=\"#hanging-leg-raise-m-e-fore.r\"/><use href=\"#hanging-leg-raise-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^46\"/><circle class=\"joint\" cx=\"128.55\" cy=\"136.95\" r=\"2.25\"/><circle class=\"joint\" cx=\"138.19\" cy=\"96.03\" r=\"2.25\"/><circle class=\"joint\" cx=\"143.52\" cy=\"193.29\" r=\"2.25\"/><circle class=\"joint\" cx=\"197.09\" cy=\"178.93\" r=\"2.25\"/></g><mask id=\"hanging-leg-raise-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#hanging-leg-raise-m-m-head\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-torso\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-thigh.l\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-shank.l\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-foot.l\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-shcap.l\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-upper.l\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-fore.l\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-mf-fist.l\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-thigh.r\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-shank.r\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-foot.r\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-shcap.r\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-upper.r\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-m-fore.r\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-mf-fist.r\" fill=\"#000\"/><use href=\"#hanging-leg-raise-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hanging-leg-raise-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#hanging-leg-raise-m-mmask)\"><g class=\"u-stroke\"><use href=\"#hanging-leg-raise-m-m-head\"/><use href=\"#hanging-leg-raise-m-m-torso\"/><use href=\"#hanging-leg-raise-m-m-thigh.l\"/><use href=\"#hanging-leg-raise-m-m-kneecap.l\"/><use href=\"#hanging-leg-raise-m-m-shank.l\"/><use href=\"#hanging-leg-raise-m-m-foot.l\"/><use href=\"#hanging-leg-raise-m-m-shcap.l\"/><use href=\"#hanging-leg-raise-m-m-upper.l\"/><use href=\"#hanging-leg-raise-m-m-elbowcap.l\"/><use href=\"#hanging-leg-raise-m-m-fore.l\"/><use href=\"#hanging-leg-raise-m-m-thigh.r\"/><use href=\"#hanging-leg-raise-m-m-kneecap.r\"/><use href=\"#hanging-leg-raise-m-m-shank.r\"/><use href=\"#hanging-leg-raise-m-m-foot.r\"/><use href=\"#hanging-leg-raise-m-m-shcap.r\"/><use href=\"#hanging-leg-raise-m-m-upper.r\"/><use href=\"#hanging-leg-raise-m-m-elbowcap.r\"/><use href=\"#hanging-leg-raise-m-m-fore.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"M106.18 142.63A100 100 0 0 1 76.53 118.61M81.49 119.23L76.53 118.61L77.32 123.55\"/><path class=\"m-arrow\" d=\"~M_Di(Gw1LFR20M)oYiLwpXiL)R10\"/><path class=\"m-line\" d=\"~MPSm__mL-4G4L2aL8cL2eL0gL2cL28L26L20L41L45L41L24L62L00L43\"/><path class=\"leader m\" d=\"~MSEgJOoL0Uy2\"/><path class=\"leader m\" d=\"M175.08 209.97L119.15 254H109.15\"/><path class=\"leader m\" d=\"M111.22 174.1L107.08 192H97.08\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"hanging-leg-raise-m-swing\" data-key=\"swing\" data-cue=\"The body swings to fling the legs.\" class=\"plate-callout m\" style=\"left:8.38%;top:34.92%\" aria-pressed=\"true\">Swing</button><button type=\"button\" id=\"hanging-leg-raise-m-knees\" data-key=\"knees\" data-cue=\"Knees bend; thighs stop short.\" class=\"plate-callout m\" style=\"left:7.26%;top:64.8%\" aria-pressed=\"false\">Knees only</button><button type=\"button\" id=\"hanging-leg-raise-m-arch\" data-key=\"arch\" data-cue=\"The low back arches, no curl.\" class=\"plate-callout m\" style=\"left:1.12%;top:47.49%\" aria-pressed=\"false\">Back arches</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "curl",
        cues: [{ key: "curl", cue: "At the top, curl the pelvis up toward the ribs so the abs finish the lift." }, { key: "legs", cue: "Keep the knees straight or only slightly soft all the way up." }, { key: "still", cue: "Hang still; lift slowly and lower under control, no swing." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "swing",
        cues: [{ key: "swing", cue: "The body swings to fling the legs." }, { key: "knees", cue: "Knees bend; thighs stop short." }, { key: "arch", cue: "The low back arches, no curl." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Swing</b><span>The body swings to fling the legs.</span></li><li><b>Knees only</b><span>Knees bend; thighs stop short.</span></li><li><b>Back arches</b><span>The low back arches, no curl.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lift 1.5 seconds, hold 0.5 seconds, lower 2 seconds, rest 1 second\"><div class=\"tempo-seg move\" style=\"flex:1.5 1 0\"><i></i><div class=\"tempo-label\"><b>Lift</b><span>1.5 s</span></div></div><div class=\"tempo-seg\" style=\"flex:0.5 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>0.5 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Rest</b><span>1 s</span></div></div></div>",
      alt: "Side view. Hanging from a bar with straight arms. Straight legs rise from a still dead hang to just above hip height, the pelvis curling up, body not swinging.",
      mistakeAlt: "Hanging Leg Raise: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hang",
    "orientation": "pronated",
    "handle": "bar-32",
    "loadAxis": "across",
    "overBody": false,
    "width": {
      "text": "About shoulder width, so your arms hang straight down.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-hlr",
          "strengthlog-hlr"
        ],
        "note": "Consensus only. No study compares grip widths for leg raises."
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "baechle-earle"
        ],
        "note": "No study has measured thumb position on this exercise. Thumbless is shown on the thumb page as information only (C4)."
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        35
      ],
      "dev": [
        -10,
        10
      ],
      "limitText": "A curling wrist means your grip is failing. End the set or use straps.",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "odriscoll1992"
        ],
        "note": "O'Driscoll 1992 (hand gauge, not a bar): grip strongest near 35 degrees back, curling the wrist cuts grip. The target and the limit in a hang are consensus."
      }
    },
    "pose": {
      "view": "radial",
      "forearm": 180,
      "wrist": {
        "ext": 10,
        "dev": 0
      },
      "contactAt": 1,
      "fingers": {
        "curl": 1
      },
      "thumb": "wrapped",
      "squeeze": "firm",
      "handle": {
        "profile": "bar-32",
        "axis": "across"
      },
      "load": {
        "kind": "gravity"
      }
    },
    "faults": [
      {
        "key": "curl-slip",
        "label": "Slipping out",
        "pose": {
          "wrist": {
            "ext": -30,
            "dev": 0
          },
          "contactAt": 1.4,
          "fingers": {
            "curl": 1,
            "open": 0.4
          },
          "thumb": "over"
        },
        "markers": [
          "slip-arrow",
          "lever-arc"
        ],
        "alt": "The bar has rolled toward the fingertips and the wrist curls forward. The thumb rests loose on top and the fingers peel open. The grip is about to fail."
      }
    ],
    "gripLine": "Bar at the base of your fingers, thumb wrapped, so your hand won't peel open.",
    "cue": "Hook the fingers, wrap the thumb.",
    "alternatives": [
      "lifting-straps",
      "ab-slings",
      "captains-chair"
    ]
  },
  contacts: [
    "hang-support"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Weak grip? Use straps. Sore wrist? Ab slings or a captain's chair.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "catalyst-hlr",
          "escamilla2006",
          "ace-abs",
          "jukic2021",
          "valerio2021",
          "martins2026"
        ],
        "note": "Ab slings appear in Escamilla 2006 as used, not compared. The captain's chair ranking is a press release. Straps cut grip fatigue in deadlifts, no effect in pulldowns. Not studied on this exercise."
      }
    },
    {
      "kind": "get-in",
      "text": "Step up from a box, and check it's clear of your legs.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "yessis-hlr",
          "prinold2016"
        ],
        "note": "Stepping up instead of jumping into the hang is consensus."
      }
    },
    {
      "kind": "grip",
      "text": "Chalk up. Bar at shoulder width, palms away, thumb wrapped.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "baechle-earle"
        ]
      }
    },
    {
      "kind": "position",
      "text": "Hang with straight arms, shoulders pulled a little down from your ears.",
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "catalyst-scap",
          "prinold2016"
        ]
      }
    },
    {
      "kind": "brace",
      "text": "Wait until you hang still. New to this? Start with bent knees.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-hlr",
          "yessis-hlr",
          "strengthlog-hlr"
        ]
      }
    }
  ],
  posture: [
    {
      "key": "hang",
      "label": "Active hang",
      "detail": "Arms straight, shoulder blades pulled slightly down, a clear gap between ears and shoulders.",
      "anchor": {
        "at": "shoulderTop.r",
        "pose": "start"
      },
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "catalyst-scap",
          "prinold2016"
        ]
      }
    },
    {
      "key": "still",
      "label": "Still body",
      "detail": "At the start you hang still in a line under the bar. Legs together, a touch in front.",
      "anchor": {
        "at": "hip.r",
        "pose": "start"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-hlr",
          "yessis-hlr",
          "strengthlog-hlr"
        ],
        "note": "Shown by the plate Mistake layer (swing), not a zoom."
      }
    },
    {
      "key": "curl",
      "label": "Pelvis curls up",
      "detail": "At the top your lower back rounds gently and your tailbone tips up. Your belt line rises toward your ribs.",
      "anchor": {
        "at": "sacrum"
      },
      "zoom": "pelvis",
      "claim": {
        "tags": [
          "MECH",
          "CONSENSUS"
        ],
        "sources": [
          "workman2008",
          "catalyst-hlr",
          "wiki-leg-raise"
        ],
        "note": "Workman 2008 is a lying leg lift, not a bar, so the support is indirect."
      }
    },
    {
      "key": "height",
      "label": "Legs past hips",
      "detail": "Your thighs reach hip height or higher (knees to chest on the bent-knee version). Early in the lift it is mostly the front of your hips. Your pelvis curls as the legs rise higher.",
      "anchor": {
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "WEAK"
        ],
        "sources": [
          "yessis-hlr"
        ],
        "note": "The 30 to 45 degree point is one biomechanist's expert opinion, not data."
      }
    },
    {
      "key": "chest",
      "label": "Chest stays quiet",
      "detail": "Your upper body stays under the bar while your legs rise. You do not lean far back to counter the legs, and your arms stay straight.",
      "anchor": {
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-hlr",
          "yessis-hlr"
        ]
      }
    },
    {
      "key": "lower",
      "label": "Slow way down",
      "detail": "Your legs come down under control and stop just in front of your body. They do not swing behind you.",
      "anchor": {
        "at": "ankle.r",
        "pose": "start"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-hlr",
          "catalyst-hlr"
        ]
      }
    }
  ],
  zooms: [
    {
      "key": "hand",
      "chip": "Hand",
      "heading": "Hand: right and wrong",
      "kind": "hand",
      "feelRow": "wrist"
    },
    {
      "key": "pelvis",
      "chip": "Pelvis curl",
      "heading": "Pelvis curl: right and wrong",
      "kind": "posture",
      "feelRow": "hips"
    },
    {
      "key": "shoulders",
      "chip": "Shoulders",
      "heading": "Shoulders: right and wrong",
      "kind": "posture",
      "feelRow": "traps"
    }
  ],
  chips: [
    "hand",
    "pelvis",
    "shoulders",
    "feel"
  ],
  copy: {
    "setupLine": "Step up to the bar instead of jumping. Hang with shoulders a little down, and wait until you're still.",
    "mistakeLine": "Don't swing your legs up. If you need a kick, bend your knees and lift slowly."
  },
  mistakes: [
    {
      "key": "swing",
      "title": "Swinging your legs up",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-hlr",
          "yessis-hlr",
          "strengthlog-hlr"
        ]
      },
      "fix": "Start each rep still and lower slower than you lift."
    },
    {
      "key": "legs-only",
      "title": "Lifting only your legs",
      "zoom": "pelvis",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "catalyst-hlr",
          "workman2008"
        ]
      },
      "fix": "As your thighs pass hip height, curl your hips toward your ribs."
    },
    {
      "key": "sunk",
      "title": "Hanging loose, shoulders sunk",
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "MECH",
          "CONSENSUS"
        ],
        "sources": [
          "prinold2016",
          "catalyst-scap"
        ]
      },
      "fix": "Set your shoulders a little down before the first rep."
    }
  ],
  risks: [
    {
      "key": "swing",
      "text": "Swinging jerks your weight through your hands and shoulders and arches your lower back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-hlr",
          "yessis-hlr"
        ],
        "note": "The injury link is consensus, not measured."
      }
    },
    {
      "key": "spine",
      "text": "Skipping the hip curl pulls on your lower spine, which matters with back pain.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "mcgill2015"
        ],
        "note": "McGill 2015: about 3000 N of spine compression in the straight-leg hanging raise."
      }
    },
    {
      "key": "shoulder",
      "text": "Dropping into a loose hang loads your shoulder, which has little room overhead.",
      "claim": {
        "tags": [
          "MECH",
          "CONSENSUS"
        ],
        "sources": [
          "prinold2016",
          "kolber2010"
        ]
      }
    }
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
    "mcgill2015",
    "escamilla2006",
    "axler1997",
    "workman2008",
    "andersson1997",
    "juker1998",
    "jukic2021",
    "valerio2021",
    "martins2026",
    "odriscoll1992",
    "prinold2016",
    "kolber2010",
    "ace-abs",
    "catalyst-hlr",
    "catalyst-scap",
    "yessis-hlr",
    "strengthlog-hlr",
    "baechle-earle",
    "wiki-leg-raise",
    "nhs-wrist-pain"
  ],
  research: {
    "card": "grip/research/hanging_leg_raise.json",
    "rev": 1,
    "related": [
      "grip/research/GENERAL.md (G9)",
      "grip/research/pull_up.json"
    ]
  },
} satisfies BuiltHowTo;

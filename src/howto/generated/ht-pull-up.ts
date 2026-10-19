// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=47102b2f6bc2482998584c3aebf840438d4d502f058bc826152f42f18d7b867c
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_pull_up",
  name: "Pull-up",
  hashes: { inputsSha256: "47102b2f6bc2482998584c3aebf840438d4d502f058bc826152f42f18d7b867c", golden: "0f6f2a49b37027a1555b18b58145a32d3052bac9f144ba5eeab80ca247160231" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"pull-up-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"pull-up-n-st-thigh.l\" d=\"~#F12U_sSFH1VUsxxG1B2-9z14W6YU1U4)6y2K3vxK1w9Bkz1xhXbViI5XJ1O2B3O5B6oAV1y11q)9)qB8Bg!z1D2Ju(kDx100000002000001200100100111110100202000000000202200000001000200000000000000010010\"/><path id=\"pull-up-n-st-kneecap.l\" d=\"~~WJuFOU1(B10\"/><path id=\"pull-up-n-st-shank.l\" d=\"~#F12JIu!KU1*Ou)BT1!1*9y10F2PV1F5O6P2E3E1-Y1U6GbcBa-5VbD5TY1E2I3-4.6)5DV1v1E1)9BbP9.bPknHiSaJl00000010101002100000001101200001210002000000000000000020000010100120011100000220\"/><path id=\"pull-up-n-st-foot.l\" d=\"~#o2!!uFX*1OVvOA*1Y8_6Ng3ysV9JD2HsV-1zu)qKjRiE8.x1TaE4-dDqH1Bqyc000000000002101101000010010010000010000200000002\"/><path id=\"pull-up-n-st-shcap.l\" d=\"~~AItAWuWF11\"/><path id=\"pull-up-n-st-upper.l\" d=\"~#F12F!vN-u)Yv)WvvJ791H1TE1z3W4K1J2K7DvX9AfB1!dD7PgH2ww1uS2H2A5H5GE1605N7SdS2HdTkS1)i-9Km01200001012000010100000000000010010000000010000001002000100000101010000100020000\"/><path id=\"pull-up-n-st-elbowcap.l\" d=\"~~DHuA)m_t0\"/><path id=\"pull-up-n-st-fore.l\" d=\"~#F12DEw1P)mIAw1BXnR1W8jR1R2XA1x3!7I1(1l_r)5_a0N9U5(a2!rH1(1w3(7H3TA1kT1N1Y8S88y9Og6ReX8Vg01000000000200000020010100100001201000101011012000101200000000010011000000000001\"/><path id=\"pull-up-n-st-head\" d=\"~#w12P.uyEmzPt*(lEgFgGgD8K9X2X2y4x4-6X6K9.e*iw4*aG1x8Gg0wjO9wjK5ShY2HgPdI1Hg0100001000010000010101000200001001101212100000010110100001000001\"/><path id=\"pull-up-n-st-torso\" d=\"~#_12!St_Eqx.tOwpx8K5V20y8!eD8P5_aPdN50K5Gk)iX6-aw4Sd)3UhK5(iTd(e-ey4B8X6Odxn.tO9)mK50z81!aUdW2Y6-aX6RdY6K5UhN5J5_aK9W2_6ID2yr00010000011110020011100000000000000021020021010001020001210200101000100000010102000000000000100000010010000000200110\"/><path id=\"pull-up-n-st-thigh.r\" d=\"^0\"/><path id=\"pull-up-n-st-kneecap.r\" d=\"^1\"/><path id=\"pull-up-n-st-shank.r\" d=\"^2\"/><path id=\"pull-up-n-st-foot.r\" d=\"^3\"/><path id=\"pull-up-n-st-shcap.r\" d=\"^4\"/><path id=\"pull-up-n-st-upper.r\" d=\"^5\"/><path id=\"pull-up-n-st-elbowcap.r\" d=\"^6\"/><path id=\"pull-up-n-st-fore.r\" d=\"^7\"/><path id=\"pull-up-n-g0-thigh.l\" d=\"~#F12w_sF*B1IPsKWA1z3T9z16UbwU1_3K7_1T3B5XJ1D7*k-2.gKdRhK9)I1.2*2x6X5Y5(U1y175)9TrR5VcAB1!4yu(nAv01010000102002001000000200010100000000121001110100000000011012002020000000010000\"/><path id=\"pull-up-n-g0-kneecap.l\" d=\"~~AHvH_O1(B10\"/><path id=\"pull-up-n-g0-shank.l\" d=\"~#F12_FvW.O1THvRTN1D1zaA12(5yV1_4X6D2O3x5OY1W5-b9zaR6GbD1-Y1O2E3E5K6E2JV1x12*1*9KaHaOaFlkJiwcPk10100020021011000200000020001100202000001010020000000110101010020020000001010000\"/><path id=\"pull-up-n-g0-foot.l\" d=\"~#o2wOw1Az-1GDx1XNY1H9F6HgE1HrVbFF2JnX.1xqBsKhBj)6Ky1E8E5IdDqjBp!d120002020000000000000200020000012002000120200000\"/><path id=\"pull-up-n-g0-head\" d=\"~#w12DGtAUhx*rzSh*dJi.eHa.9G1x2J4*4B6x8K8KhVgS2GbO2-7xgD2Nh)byi)7Yh6yiDbsHg2010000020100000002101010000000000220000210000001001010000000000\"/><path id=\"pull-up-n-g0-torso\" d=\"~#_12!SsF-lKVsBRkE9z3G5x3(8JcU8w8Ub(cU5dB7zkOk-5TaJ4NdG4Ph.5Ui)dUeEf_3B8x7KdXnEt)9-mO5O1RaE1YbFgA3U6Ebz6)c_9O4Ufy52W7x7A4w9*x2WA100001002001011000000200020010010020020000001000100002010100000001200101200101000000000001101010020000001011001000000\"/><path id=\"pull-up-n-g0-thigh.r\" d=\"^10\"/><path id=\"pull-up-n-g0-kneecap.r\" d=\"^11\"/><path id=\"pull-up-n-g0-shank.r\" d=\"^12\"/><path id=\"pull-up-n-g0-foot.r\" d=\"^13\"/><path id=\"pull-up-n-g1-thigh.l\" d=\"~#F12w_s_Rx1-JsxJw1x4E9v8HgWS1F3X7H1-3E9xJ1D5OlG4OgzfEgKd)H1x3T2T6z5UaAU1y17x1xazs*2B9DD1Y7NtWqYs00101000010001000010000020020000120010000000000000002000001010001000000101000100\"/><path id=\"pull-up-n-g1-kneecap.l\" d=\"~~yEw1SyI1(B10\"/><path id=\"pull-up-n-g1-shank.l\" d=\"~#F12!Bw1WDI1-Aw1R(G1ezaw13Y9WU1H4B7(1T3x9)X1w5Bcz1xaG7-a-2XY1V2z3V5x6N1NV1v6T2.9V9ybx9(lw2FiFdWj00001000000220000011000002210100000000101000111000010100200001200000110000001020\"/><path id=\"pull-up-n-g1-foot.l\" d=\"~#o2Uwy1YHU1KWy1-UT1W9U5DgK2NqRdYG2HiK*1-lKtOfOjT5)y1X5z6xdyqI2BoSf001010111100000020000000000020000000200000000100\"/><path id=\"pull-up-n-g1-head\" d=\"~#w12(WrDDd)HqGHdBbykIdJc-91R1W4V5I5B9E7RjzeuRbR3K7TfN4UfGeYgKaWhE2HjS8F3wg1011110000002000020002021010001010111111011000001010121000002000\"/><path id=\"pull-up-n-g1-torso\" d=\"~#_12HTrAKhEPrxBgOaB1V7R4F9F9P9SaHcFc!5tz9VjXl-4OaY4HdV4JhE6HiKeDeRfW3G8I7BdKoXsOaRmX5z3xdz2(c_iN3N6RbK5zc!c.3Pd!3z5(4z4A6AbG!1JK100110100101001012100002101010000020000100000000000000010000000000121001001002020000010000020000000020000100200110000\"/><path id=\"pull-up-n-g1-thigh.r\" d=\"^16\"/><path id=\"pull-up-n-g1-kneecap.r\" d=\"^17\"/><path id=\"pull-up-n-g1-shank.r\" d=\"^18\"/><path id=\"pull-up-n-g1-foot.r\" d=\"^19\"/><path id=\"pull-up-n-e-thigh.l\" d=\"~#F12P_sFDt.Gs.xs.4.8tc!k(P1P2)7y1.3IdxI1A3.l-5zgOgVeIhRG1I3G2)6O4Jf!S1w19*1*9Es9T5!D1NaUsFtAq00010000001000000000000101010001000000000000100001110000000000000000000000110010\"/><path id=\"pull-up-n-e-kneecap.l\" d=\"~~Fzx1wFD1(B10\"/><path id=\"pull-up-n-e-shank.l\" d=\"~#F12Pyx1!ND1V(w1*DB17zay13JdYT1Y3I7Y1X3)cGX1A4Kc-1*9x8IaX6IY1-2.2B6V5D5FV1v6G3T9.8WbO7PmD3AiYeWi00000002000120021000000110000010000000000220000010100000010100002000100002000001\"/><path id=\"pull-up-n-e-foot.l\" d=\"~#o2NRz1ANO1VBA1VWN1Aa!4(fR3NpGfYH2AdV(1RhOuGd-jG4Gz1E3x7Vc_pz4)mFh000001111100101000012100100100001011111210000000\"/><path id=\"pull-up-n-e-shcap.l\" d=\"~~SFrJ.hWF11\"/><path id=\"pull-up-n-e-upper.l\" d=\"~#F12PSrwWiOArTAiI3O483(kylbR49B2z8-g*3OhB9Ta-gG6KfKaB2jK4x1(h_n56*3)3BgH2J5(nPcJe(mW802000100200100000000101100000010000200200000010000020000000001010001002100000000\"/><path id=\"pull-up-n-e-elbowcap.l\" d=\"~~yKvSEm_t0\"/><path id=\"pull-up-n-e-fore.l\" d=\"~#F12YGx1PzmxHx1K-mdA8pG1G7zx1x2U7z1w2_2AoG4PbD1N9F7(9P3yoW1W1!3Y6O1.x1eK1P2W7Y8uW6Rh.1OexbEf21020002000000000002100100010000000020010020000011010010020000000000202000101001\"/><path id=\"pull-up-n-e-fist.l\" d=\"~~!OuSWeAr1\"/><path id=\"pull-up-n-e-head\" d=\"~#w12FBqD*8G_oIE9E8NlRbyeX9J1p_4O6O4xa)5GlBblRbR4*6-eW6NdKgAfTcDhX4Jk_5J5Jf0000000000002000000010101000020001010000000111000010010000000002\"/><path id=\"pull-up-n-e-torso\" d=\"~#_12PUqJzd*IqB!bTbJ1zaB6J9J6SaAdwdNby6I1*aBjxnX3GaA5Fd)4AhT6yi.e_d.fN3I8T7zdzpxsxbIm)5R4Vf)2DeNl(3D6*b-4.a(fR3Jb(1xaW2nN8_cIV1JV110020020000000000200000200101022002000220002100000001212100120001010100000000010000000010100200000000000111010011010\"/><path id=\"pull-up-n-e-thigh.r\" d=\"^22\"/><path id=\"pull-up-n-e-kneecap.r\" d=\"^23\"/><path id=\"pull-up-n-e-shank.r\" d=\"^24\"/><path id=\"pull-up-n-e-foot.r\" d=\"^25\"/><path id=\"pull-up-n-e-shcap.r\" d=\"^26\"/><path id=\"pull-up-n-e-upper.r\" d=\"^27\"/><path id=\"pull-up-n-e-elbowcap.r\" d=\"^28\"/><path id=\"pull-up-n-e-fore.r\" d=\"^29\"/><path id=\"pull-up-n-e-fist.r\" d=\"^30\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#pull-up-n-dots)\"/>\n  <path class=\"datum\" d=\"~Mw*3DHeLwGq0\"/><path class=\"datum\" d=\"~M!Hw1SEmLWO3Ww4\"/><path class=\"eq\" d=\"~MJUvAAfLDXc0QJ90-KcI9LI9w1Q0I9I9vL-KcJ9QI90_KcJ9LJ9vQ0J9J9w1Z\"/><path class=\"eq\" d=\"~MD.J1F.hLy60QF606E6LE6TW5Q0E6E6UW5L6F6QE605F6LF6UW5Q0F6F6TW5Z\"/><path class=\"eq\" d=\"~MP_vSWeL00Q0111L-u2Q10_u2L21Q0020L_u0Q20-u0Z\"/><path class=\"eq-solid\" d=\"~~U(uSWeJc2\"/><path class=\"eq-pin\" d=\"~~FEvSWeY30\"/><path class=\"arc measure\" d=\"M165.58 113.85L178.69 128.96A20 20 0 0 0 162.96 94.03Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pull-up-n-st-thigh.l\"/><use href=\"#pull-up-n-st-kneecap.l\"/><use href=\"#pull-up-n-st-shank.l\"/><use href=\"#pull-up-n-st-foot.l\"/><use href=\"#pull-up-n-st-shcap.l\"/><use href=\"#pull-up-n-st-upper.l\"/><use href=\"#pull-up-n-st-elbowcap.l\"/><use href=\"#pull-up-n-st-fore.l\"/></g><g class=\"u-fill\"><use href=\"#pull-up-n-st-thigh.l\"/><use href=\"#pull-up-n-st-kneecap.l\"/><use href=\"#pull-up-n-st-shank.l\"/><use href=\"#pull-up-n-st-foot.l\"/><use href=\"#pull-up-n-st-shcap.l\"/><use href=\"#pull-up-n-st-upper.l\"/><use href=\"#pull-up-n-st-elbowcap.l\"/><use href=\"#pull-up-n-st-fore.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pull-up-n-st-head\"/><use href=\"#pull-up-n-st-torso\"/><use href=\"#pull-up-n-st-thigh.r\"/><use href=\"#pull-up-n-st-kneecap.r\"/><use href=\"#pull-up-n-st-shank.r\"/><use href=\"#pull-up-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pull-up-n-st-head\"/><use href=\"#pull-up-n-st-torso\"/><use href=\"#pull-up-n-st-thigh.r\"/><use href=\"#pull-up-n-st-kneecap.r\"/><use href=\"#pull-up-n-st-shank.r\"/><use href=\"#pull-up-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pull-up-n-st-shcap.r\"/><use href=\"#pull-up-n-st-upper.r\"/><use href=\"#pull-up-n-st-elbowcap.r\"/><use href=\"#pull-up-n-st-fore.r\"/></g><g class=\"u-fill\"><use href=\"#pull-up-n-st-shcap.r\"/><use href=\"#pull-up-n-st-upper.r\"/><use href=\"#pull-up-n-st-elbowcap.r\"/><use href=\"#pull-up-n-st-fore.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pull-up-n-g0-thigh.l\"/><use href=\"#pull-up-n-g0-kneecap.l\"/><use href=\"#pull-up-n-g0-shank.l\"/><use href=\"#pull-up-n-g0-foot.l\"/></g><g class=\"u-fill\"><use href=\"#pull-up-n-g0-thigh.l\"/><use href=\"#pull-up-n-g0-kneecap.l\"/><use href=\"#pull-up-n-g0-shank.l\"/><use href=\"#pull-up-n-g0-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pull-up-n-g0-head\"/><use href=\"#pull-up-n-g0-torso\"/><use href=\"#pull-up-n-g0-thigh.r\"/><use href=\"#pull-up-n-g0-kneecap.r\"/><use href=\"#pull-up-n-g0-shank.r\"/><use href=\"#pull-up-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pull-up-n-g0-head\"/><use href=\"#pull-up-n-g0-torso\"/><use href=\"#pull-up-n-g0-thigh.r\"/><use href=\"#pull-up-n-g0-kneecap.r\"/><use href=\"#pull-up-n-g0-shank.r\"/><use href=\"#pull-up-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pull-up-n-g1-thigh.l\"/><use href=\"#pull-up-n-g1-kneecap.l\"/><use href=\"#pull-up-n-g1-shank.l\"/><use href=\"#pull-up-n-g1-foot.l\"/></g><g class=\"u-fill\"><use href=\"#pull-up-n-g1-thigh.l\"/><use href=\"#pull-up-n-g1-kneecap.l\"/><use href=\"#pull-up-n-g1-shank.l\"/><use href=\"#pull-up-n-g1-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pull-up-n-g1-head\"/><use href=\"#pull-up-n-g1-torso\"/><use href=\"#pull-up-n-g1-thigh.r\"/><use href=\"#pull-up-n-g1-kneecap.r\"/><use href=\"#pull-up-n-g1-shank.r\"/><use href=\"#pull-up-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pull-up-n-g1-head\"/><use href=\"#pull-up-n-g1-torso\"/><use href=\"#pull-up-n-g1-thigh.r\"/><use href=\"#pull-up-n-g1-kneecap.r\"/><use href=\"#pull-up-n-g1-shank.r\"/><use href=\"#pull-up-n-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pull-up-n-e-thigh.l\"/><use href=\"#pull-up-n-e-kneecap.l\"/><use href=\"#pull-up-n-e-shank.l\"/><use href=\"#pull-up-n-e-foot.l\"/><use href=\"#pull-up-n-e-shcap.l\"/><use href=\"#pull-up-n-e-upper.l\"/><use href=\"#pull-up-n-e-elbowcap.l\"/><use href=\"#pull-up-n-e-fore.l\"/><use href=\"#pull-up-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#pull-up-n-e-thigh.l\"/><use href=\"#pull-up-n-e-kneecap.l\"/><use href=\"#pull-up-n-e-shank.l\"/><use href=\"#pull-up-n-e-foot.l\"/><use href=\"#pull-up-n-e-shcap.l\"/><use href=\"#pull-up-n-e-upper.l\"/><use href=\"#pull-up-n-e-elbowcap.l\"/><use href=\"#pull-up-n-e-fore.l\"/><use href=\"#pull-up-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pull-up-n-e-head\"/><use href=\"#pull-up-n-e-torso\"/><use href=\"#pull-up-n-e-thigh.r\"/><use href=\"#pull-up-n-e-kneecap.r\"/><use href=\"#pull-up-n-e-shank.r\"/><use href=\"#pull-up-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pull-up-n-e-head\"/><use href=\"#pull-up-n-e-torso\"/><use href=\"#pull-up-n-e-thigh.r\"/><use href=\"#pull-up-n-e-kneecap.r\"/><use href=\"#pull-up-n-e-shank.r\"/><use href=\"#pull-up-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pull-up-n-e-shcap.r\"/><use href=\"#pull-up-n-e-upper.r\"/><use href=\"#pull-up-n-e-elbowcap.r\"/><use href=\"#pull-up-n-e-fore.r\"/><use href=\"#pull-up-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pull-up-n-e-shcap.r\"/><use href=\"#pull-up-n-e-upper.r\"/><use href=\"#pull-up-n-e-elbowcap.r\"/><use href=\"#pull-up-n-e-fore.r\"/><use href=\"#pull-up-n-e-fist.r\"/></g></g><path class=\"eq-cable m-line\" d=\"~MAIw1JRmLy4S2L98L7aL74L54\"/><path class=\"eq-cable m-line\" d=\"~MAHx1Y-qLpD3L13L55L01L11L13L55L17L95L5bLbdLbbLdbL99L59L15L07\"/><path class=\"eq-cable m-line\" d=\"~MDRtyAqL.4X2Li7Li7La5L83Lc5L81L83Lc1L81La3La3La3La1L81La2L82L84L80La0La1L84L82La6L6aL8aLc8Le4La8L88L26L2aL36L5aL7aL3a\"/><path class=\"eq-cable m-line\" d=\"~MAOx1ARG1Ls.8L11L12L18L14L02L31L12L31L12L51L52L73L73L71L30L24L46L8aLa8LeeL68L68L64L48L02L24L10L46L46L26L24L11L31L75L95L59L57L53L33L52\"/><path class=\"eq-cable m-line\" d=\"~MAyx1HNtL.2V3L08L22L62L40L42L28L04L42L61L21L87\"/><path class=\"eq-cable m-line\" d=\"~M!St_EqLz4y3L_1y1LF1oLuiLc8L22Ld9LrfLjfL31L73L11L11L30L20L14L13L33L13L14L22L26L8cL6aL6cL4cL48L68\"/><path class=\"eq-cable m-line\" d=\"~M(Fu!xnLI1w6L2iL2eL0aL02L20L09L15L22L00L02L00L24L24L02L2cL0iL08L20L29L2fL4pL2vL6B1L4x1L2lL4jL07L01L04L0cL18L03L00L02L20L14L04L06L38L14L34L24L22L62La0La0La6L68\"/><path class=\"eq-cable m-line\" d=\"~MU)tW-vLF3U1L4bL29L07L37L09L67L27L09L1bL59L3bL9bL5fL3jL3dL37L77L30L94L76L74Ld3L52L70L10L36L42L28L26L06L04L14L02L20L11L00L04L0gL12L20L1bL2fL2pL1vL4B1L2x1L0nL2hL17L01L38L0iL5cL02L14L10L04L10L02L00L05L27L01L14L18L1cL5m\"/><path class=\"eq-cable m-line\" d=\"~MFDw1SynLux3L30L70L51L10L32L04L06L06L2aL16L06L14L02L00L01L05L06L0cL02L03L07L1hL1jL1vL0x1L1x1L1lL1hL03L01L3cL1gL0gL36L04L12L16L01L02L10L27L15L11L02L08L0cL0gL1oL2mL2kL0eL1gL08L36L34L10L72L36L14L38L12L08L02L26L22L36L06L02L26L26L26L84L24L60L42L28L28L0eL0gL1iL1oL0oL1eL2eL08L22L11L47L15L20L00L02L22L22L06L26L4gL1gL4aL02L27L2dL2pL2vL2x1L2tL2nL2fL07L23L14L2aL14L03L20L11L22L04L26L16L2aL16L16L44L02L60L40L61\"/><circle class=\"joint\" cx=\"146.12\" cy=\"91.42\" r=\"2.25\"/><circle class=\"joint\" cx=\"165.58\" cy=\"113.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"157.38\" cy=\"145.92\" r=\"2.25\"/><circle class=\"joint\" cx=\"175.55\" cy=\"195.84\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#!10HEw1F(nxGw1xFo2010201201221010200010221122100104010010221021122012010002000001000020000200000022000010101000002000101000001010000010101100000201010100110000200001012100000200120000010000000001\"/><path class=\"arrow\" d=\"~MDHuHWdLUpDx1LK(1*pZ\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M178.69 128.96A20 20 0 0 0 162.96 94.03\"/><g class=\"arc-ticks\"><path d=\"~MNJy1AToL_A1PH1\"/><path d=\"~MY*vNAjLI7XX1\"/></g><path class=\"leader\" d=\"~MFFA1AOkLPU9.n\"/></g></g><path class=\"leader\" d=\"M154.56 66.84L159 43H169\"/><circle class=\"anchor\" cx=\"154.56\" cy=\"66.84\" r=\"1.5\"/><path class=\"leader\" d=\"M167.58 118.85L191 162H201\"/><circle class=\"anchor\" cx=\"167.58\" cy=\"118.85\" r=\"1.5\"/><path class=\"leader\" d=\"M144.99 85.01L133.62 93H123.62\"/><circle class=\"anchor\" cx=\"144.99\" cy=\"85.01\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"pull-up-n-chin\" data-key=\"chin\" data-cue=\"From straight arms, pull until the chin clears the bar, chest toward it.\" class=\"plate-callout\" style=\"left:45.81%;top:5.87%\" aria-pressed=\"true\">Chin over bar</button><button type=\"button\" id=\"pull-up-n-elbows\" data-key=\"elbows\" data-cue=\"Drive the elbows down to the ribs, slightly forward.\" class=\"plate-callout\" style=\"left:54.75%;top:39.11%\" aria-pressed=\"false\">Elbows down</button><button type=\"button\" id=\"pull-up-n-down\" data-key=\"down\" data-cue=\"Keep the shoulders pulled down, away from the ears, all the way up.\" class=\"plate-callout\" style=\"left:0.56%;top:19.83%\" aria-pressed=\"false\">Shoulders down</button><span class=\"plate-arc-label\" style=\"left:66.48%;top:26.26%\"><b>Elbow</b><span>about 145° bend</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"pull-up-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"pull-up-m-st-thigh.l\" d=\"^0\"/><path id=\"pull-up-m-st-kneecap.l\" d=\"^1\"/><path id=\"pull-up-m-st-shank.l\" d=\"^2\"/><path id=\"pull-up-m-st-foot.l\" d=\"^3\"/><path id=\"pull-up-m-st-shcap.l\" d=\"^4\"/><path id=\"pull-up-m-st-upper.l\" d=\"^5\"/><path id=\"pull-up-m-st-elbowcap.l\" d=\"^6\"/><path id=\"pull-up-m-st-fore.l\" d=\"^7\"/><path id=\"pull-up-m-st-head\" d=\"^8\"/><path id=\"pull-up-m-st-torso\" d=\"^9\"/><path id=\"pull-up-m-st-thigh.r\" d=\"^0\"/><path id=\"pull-up-m-st-kneecap.r\" d=\"^1\"/><path id=\"pull-up-m-st-shank.r\" d=\"^2\"/><path id=\"pull-up-m-st-foot.r\" d=\"^3\"/><path id=\"pull-up-m-st-shcap.r\" d=\"^4\"/><path id=\"pull-up-m-st-upper.r\" d=\"^5\"/><path id=\"pull-up-m-st-elbowcap.r\" d=\"^6\"/><path id=\"pull-up-m-st-fore.r\" d=\"^7\"/><path id=\"pull-up-m-g0-thigh.l\" d=\"^10\"/><path id=\"pull-up-m-g0-kneecap.l\" d=\"^11\"/><path id=\"pull-up-m-g0-shank.l\" d=\"^12\"/><path id=\"pull-up-m-g0-foot.l\" d=\"^13\"/><path id=\"pull-up-m-g0-head\" d=\"^14\"/><path id=\"pull-up-m-g0-torso\" d=\"^15\"/><path id=\"pull-up-m-g0-thigh.r\" d=\"^10\"/><path id=\"pull-up-m-g0-kneecap.r\" d=\"^11\"/><path id=\"pull-up-m-g0-shank.r\" d=\"^12\"/><path id=\"pull-up-m-g0-foot.r\" d=\"^13\"/><path id=\"pull-up-m-g1-thigh.l\" d=\"^16\"/><path id=\"pull-up-m-g1-kneecap.l\" d=\"^17\"/><path id=\"pull-up-m-g1-shank.l\" d=\"^18\"/><path id=\"pull-up-m-g1-foot.l\" d=\"^19\"/><path id=\"pull-up-m-g1-head\" d=\"^20\"/><path id=\"pull-up-m-g1-torso\" d=\"^21\"/><path id=\"pull-up-m-g1-thigh.r\" d=\"^16\"/><path id=\"pull-up-m-g1-kneecap.r\" d=\"^17\"/><path id=\"pull-up-m-g1-shank.r\" d=\"^18\"/><path id=\"pull-up-m-g1-foot.r\" d=\"^19\"/><path id=\"pull-up-m-e-thigh.l\" d=\"^22\"/><path id=\"pull-up-m-e-kneecap.l\" d=\"^23\"/><path id=\"pull-up-m-e-shank.l\" d=\"^24\"/><path id=\"pull-up-m-e-foot.l\" d=\"^25\"/><path id=\"pull-up-m-e-shcap.l\" d=\"^26\"/><path id=\"pull-up-m-e-upper.l\" d=\"^27\"/><path id=\"pull-up-m-e-elbowcap.l\" d=\"^28\"/><path id=\"pull-up-m-e-fore.l\" d=\"^29\"/><path id=\"pull-up-m-e-fist.l\" d=\"^30\"/><path id=\"pull-up-m-e-head\" d=\"^31\"/><path id=\"pull-up-m-e-torso\" d=\"^32\"/><path id=\"pull-up-m-e-thigh.r\" d=\"^22\"/><path id=\"pull-up-m-e-kneecap.r\" d=\"^23\"/><path id=\"pull-up-m-e-shank.r\" d=\"^24\"/><path id=\"pull-up-m-e-foot.r\" d=\"^25\"/><path id=\"pull-up-m-e-shcap.r\" d=\"^26\"/><path id=\"pull-up-m-e-upper.r\" d=\"^27\"/><path id=\"pull-up-m-e-elbowcap.r\" d=\"^28\"/><path id=\"pull-up-m-e-fore.r\" d=\"^29\"/><path id=\"pull-up-m-e-fist.r\" d=\"^30\"/><path id=\"pull-up-m-m-head\" d=\"~#w12YVmU.c)JlKJdV4PmE9WfK9(21_4z7K3-aE4.m-7K2GbR5x6Vd_8YaEiwd.eDgI7ylS2Y7Je1020020010021011111000000001010121000011110002000000100000000010\"/><path id=\"pull-up-m-m-torso\" d=\"~#_12Y-nY*gBInIYfBbD3xbR4Ha!4NcFbWeH9S5B2zdEhGm1E9!6ycK7Sf-9!e)hPaEi_1.8)9Ib)t-mzf-jB6-1EdmSgWf_4P5Kc.2I8NhT1Yb6BaW2B1FaHbGJ1A*100200001000000000000000000100002000011010101110100001010022000000000010000020000000000000000000001121001210010020000\"/><path id=\"pull-up-m-m-thigh.l\" d=\"~#F12YVtyHx1BOsK)w1*9*19w1!S1JfO4)6G2I3RG1IhVeOgzg-5.lA3xI1Id.3y1)7P2(P1!kct.8.4IiNlAqFtUsNa!D1T500000000000011000001000000000000000010101000200000000100000000000100110000000000\"/><path id=\"pull-up-m-m-kneecap.l\" d=\"~~y(D1P(y1(B10\"/><path id=\"pull-up-m-m-shank.l\" d=\"~#F12H*D1WXy1IEE1.Px1F3O9w14B5FV1A6V5(2.2U6KY1D8EaY1)9z4KcwdIX1X1T3-3O7Gd!T1v56BaKc(7TeUiE3AiN7Pm00020010010000000000001000000000000000010000100000022000010001000000011001110000\"/><path id=\"pull-up-m-m-foot.l\" d=\"~#o2FBD1UwJ1EwE1RRI1Y7y8FgD2AtX5_x2!B1)U1*B1)n*mEhXa)vGfG2zeWp_4RrJ8000000000200100100000000000000012100020000000200\"/><path id=\"pull-up-m-m-shcap.l\" d=\"~~!ApJHlWF11\"/><path id=\"pull-up-m-m-upper.l\" d=\"~#F12DDqJSmVKpzKmz6K129Ax1w4R3I3.1R1Xl*8xeEbVdK2BhN5RnoB2oT4(1Nw1w806E6lO8JcDjHfYiN3HnR700000201010000000000000000000000000101101020000002020001210002000000000000000000\"/><path id=\"pull-up-m-m-elbowcap.l\" d=\"~~Y!v_Om_t0\"/><path id=\"pull-up-m-m-fore.l\" d=\"~#F12D-x1(Gm*_x1Vwn4J8tG1O9xy1O1y8vy2P4WpV3Wb_1J9Y7S9D5PpY1U1J4_6V3xz1aT1w3!7W8dU5*hX2Ie.bTe10000000100101000001001100101000000000101001000020000000000100000000000010100010\"/><path id=\"pull-up-m-m-thigh.r\" d=\"^61\"/><path id=\"pull-up-m-m-kneecap.r\" d=\"^62\"/><path id=\"pull-up-m-m-shank.r\" d=\"^63\"/><path id=\"pull-up-m-m-foot.r\" d=\"^64\"/><path id=\"pull-up-m-m-shcap.r\" d=\"^65\"/><path id=\"pull-up-m-m-upper.r\" d=\"^66\"/><path id=\"pull-up-m-m-elbowcap.r\" d=\"^67\"/><path id=\"pull-up-m-m-fore.r\" d=\"^68\"/><path id=\"pull-up-m-mf-fist.l\" d=\"^30\"/><path id=\"pull-up-m-mf-fist.r\" d=\"^30\"/><path id=\"pull-up-m-mo-0\" d=\"^31\"/><path id=\"pull-up-m-mo-1\" d=\"^32\"/><path id=\"pull-up-m-mo-2\" d=\"^22\"/><path id=\"pull-up-m-mo-3\" d=\"^23\"/><path id=\"pull-up-m-mo-4\" d=\"^24\"/><path id=\"pull-up-m-mo-5\" d=\"^25\"/><path id=\"pull-up-m-mo-6\" d=\"^26\"/><path id=\"pull-up-m-mo-7\" d=\"^27\"/><path id=\"pull-up-m-mo-8\" d=\"^28\"/><path id=\"pull-up-m-mo-9\" d=\"^29\"/><path id=\"pull-up-m-mo-10\" d=\"^30\"/><path id=\"pull-up-m-mo-11\" d=\"^22\"/><path id=\"pull-up-m-mo-12\" d=\"^23\"/><path id=\"pull-up-m-mo-13\" d=\"^24\"/><path id=\"pull-up-m-mo-14\" d=\"^25\"/><path id=\"pull-up-m-mo-15\" d=\"^26\"/><path id=\"pull-up-m-mo-16\" d=\"^27\"/><path id=\"pull-up-m-mo-17\" d=\"^28\"/><path id=\"pull-up-m-mo-18\" d=\"^29\"/><path id=\"pull-up-m-mo-19\" d=\"^30\"/><path id=\"pull-up-m-mo-20\" d=\"^35\"/><path id=\"pull-up-m-mo-21\" d=\"^36\"/><path id=\"pull-up-m-mo-22\" d=\"^37\"/><path id=\"pull-up-m-mo-23\" d=\"^38\"/><path id=\"pull-up-m-mo-24\" d=\"^39\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#pull-up-m-dots)\"/>\n  <path class=\"datum\" d=\"^33\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><path class=\"eq-solid\" d=\"^38\"/><path class=\"eq-pin\" d=\"^39\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pull-up-m-st-thigh.l\"/><use href=\"#pull-up-m-st-kneecap.l\"/><use href=\"#pull-up-m-st-shank.l\"/><use href=\"#pull-up-m-st-foot.l\"/><use href=\"#pull-up-m-st-shcap.l\"/><use href=\"#pull-up-m-st-upper.l\"/><use href=\"#pull-up-m-st-elbowcap.l\"/><use href=\"#pull-up-m-st-fore.l\"/></g><g class=\"u-fill\"><use href=\"#pull-up-m-st-thigh.l\"/><use href=\"#pull-up-m-st-kneecap.l\"/><use href=\"#pull-up-m-st-shank.l\"/><use href=\"#pull-up-m-st-foot.l\"/><use href=\"#pull-up-m-st-shcap.l\"/><use href=\"#pull-up-m-st-upper.l\"/><use href=\"#pull-up-m-st-elbowcap.l\"/><use href=\"#pull-up-m-st-fore.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pull-up-m-st-head\"/><use href=\"#pull-up-m-st-torso\"/><use href=\"#pull-up-m-st-thigh.r\"/><use href=\"#pull-up-m-st-kneecap.r\"/><use href=\"#pull-up-m-st-shank.r\"/><use href=\"#pull-up-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pull-up-m-st-head\"/><use href=\"#pull-up-m-st-torso\"/><use href=\"#pull-up-m-st-thigh.r\"/><use href=\"#pull-up-m-st-kneecap.r\"/><use href=\"#pull-up-m-st-shank.r\"/><use href=\"#pull-up-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pull-up-m-st-shcap.r\"/><use href=\"#pull-up-m-st-upper.r\"/><use href=\"#pull-up-m-st-elbowcap.r\"/><use href=\"#pull-up-m-st-fore.r\"/></g><g class=\"u-fill\"><use href=\"#pull-up-m-st-shcap.r\"/><use href=\"#pull-up-m-st-upper.r\"/><use href=\"#pull-up-m-st-elbowcap.r\"/><use href=\"#pull-up-m-st-fore.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pull-up-m-g0-thigh.l\"/><use href=\"#pull-up-m-g0-kneecap.l\"/><use href=\"#pull-up-m-g0-shank.l\"/><use href=\"#pull-up-m-g0-foot.l\"/></g><g class=\"u-fill\"><use href=\"#pull-up-m-g0-thigh.l\"/><use href=\"#pull-up-m-g0-kneecap.l\"/><use href=\"#pull-up-m-g0-shank.l\"/><use href=\"#pull-up-m-g0-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pull-up-m-g0-head\"/><use href=\"#pull-up-m-g0-torso\"/><use href=\"#pull-up-m-g0-thigh.r\"/><use href=\"#pull-up-m-g0-kneecap.r\"/><use href=\"#pull-up-m-g0-shank.r\"/><use href=\"#pull-up-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pull-up-m-g0-head\"/><use href=\"#pull-up-m-g0-torso\"/><use href=\"#pull-up-m-g0-thigh.r\"/><use href=\"#pull-up-m-g0-kneecap.r\"/><use href=\"#pull-up-m-g0-shank.r\"/><use href=\"#pull-up-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pull-up-m-g1-thigh.l\"/><use href=\"#pull-up-m-g1-kneecap.l\"/><use href=\"#pull-up-m-g1-shank.l\"/><use href=\"#pull-up-m-g1-foot.l\"/></g><g class=\"u-fill\"><use href=\"#pull-up-m-g1-thigh.l\"/><use href=\"#pull-up-m-g1-kneecap.l\"/><use href=\"#pull-up-m-g1-shank.l\"/><use href=\"#pull-up-m-g1-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pull-up-m-g1-head\"/><use href=\"#pull-up-m-g1-torso\"/><use href=\"#pull-up-m-g1-thigh.r\"/><use href=\"#pull-up-m-g1-kneecap.r\"/><use href=\"#pull-up-m-g1-shank.r\"/><use href=\"#pull-up-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pull-up-m-g1-head\"/><use href=\"#pull-up-m-g1-torso\"/><use href=\"#pull-up-m-g1-thigh.r\"/><use href=\"#pull-up-m-g1-kneecap.r\"/><use href=\"#pull-up-m-g1-shank.r\"/><use href=\"#pull-up-m-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pull-up-m-e-thigh.l\"/><use href=\"#pull-up-m-e-kneecap.l\"/><use href=\"#pull-up-m-e-shank.l\"/><use href=\"#pull-up-m-e-foot.l\"/><use href=\"#pull-up-m-e-shcap.l\"/><use href=\"#pull-up-m-e-upper.l\"/><use href=\"#pull-up-m-e-elbowcap.l\"/><use href=\"#pull-up-m-e-fore.l\"/><use href=\"#pull-up-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#pull-up-m-e-thigh.l\"/><use href=\"#pull-up-m-e-kneecap.l\"/><use href=\"#pull-up-m-e-shank.l\"/><use href=\"#pull-up-m-e-foot.l\"/><use href=\"#pull-up-m-e-shcap.l\"/><use href=\"#pull-up-m-e-upper.l\"/><use href=\"#pull-up-m-e-elbowcap.l\"/><use href=\"#pull-up-m-e-fore.l\"/><use href=\"#pull-up-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pull-up-m-e-head\"/><use href=\"#pull-up-m-e-torso\"/><use href=\"#pull-up-m-e-thigh.r\"/><use href=\"#pull-up-m-e-kneecap.r\"/><use href=\"#pull-up-m-e-shank.r\"/><use href=\"#pull-up-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pull-up-m-e-head\"/><use href=\"#pull-up-m-e-torso\"/><use href=\"#pull-up-m-e-thigh.r\"/><use href=\"#pull-up-m-e-kneecap.r\"/><use href=\"#pull-up-m-e-shank.r\"/><use href=\"#pull-up-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pull-up-m-e-shcap.r\"/><use href=\"#pull-up-m-e-upper.r\"/><use href=\"#pull-up-m-e-elbowcap.r\"/><use href=\"#pull-up-m-e-fore.r\"/><use href=\"#pull-up-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pull-up-m-e-shcap.r\"/><use href=\"#pull-up-m-e-upper.r\"/><use href=\"#pull-up-m-e-elbowcap.r\"/><use href=\"#pull-up-m-e-fore.r\"/><use href=\"#pull-up-m-e-fist.r\"/></g></g><path class=\"eq-cable m-line\" d=\"^41\"/><path class=\"eq-cable m-line\" d=\"^42\"/><path class=\"eq-cable m-line\" d=\"^43\"/><path class=\"eq-cable m-line\" d=\"^44\"/><path class=\"eq-cable m-line\" d=\"^45\"/><path class=\"eq-cable m-line\" d=\"^46\"/><path class=\"eq-cable m-line\" d=\"^47\"/><path class=\"eq-cable m-line\" d=\"^48\"/><path class=\"eq-cable m-line\" d=\"^49\"/><circle class=\"joint\" cx=\"146.12\" cy=\"91.42\" r=\"2.25\"/><circle class=\"joint\" cx=\"165.58\" cy=\"113.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"157.38\" cy=\"145.92\" r=\"2.25\"/><circle class=\"joint\" cx=\"175.55\" cy=\"195.84\" r=\"2.25\"/></g><mask id=\"pull-up-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#pull-up-m-m-head\" fill=\"#000\"/><use href=\"#pull-up-m-m-torso\" fill=\"#000\"/><use href=\"#pull-up-m-m-thigh.l\" fill=\"#000\"/><use href=\"#pull-up-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#pull-up-m-m-shank.l\" fill=\"#000\"/><use href=\"#pull-up-m-m-foot.l\" fill=\"#000\"/><use href=\"#pull-up-m-m-shcap.l\" fill=\"#000\"/><use href=\"#pull-up-m-m-upper.l\" fill=\"#000\"/><use href=\"#pull-up-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#pull-up-m-m-fore.l\" fill=\"#000\"/><use href=\"#pull-up-m-mf-fist.l\" fill=\"#000\"/><use href=\"#pull-up-m-m-thigh.r\" fill=\"#000\"/><use href=\"#pull-up-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#pull-up-m-m-shank.r\" fill=\"#000\"/><use href=\"#pull-up-m-m-foot.r\" fill=\"#000\"/><use href=\"#pull-up-m-m-shcap.r\" fill=\"#000\"/><use href=\"#pull-up-m-m-upper.r\" fill=\"#000\"/><use href=\"#pull-up-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#pull-up-m-m-fore.r\" fill=\"#000\"/><use href=\"#pull-up-m-mf-fist.r\" fill=\"#000\"/><use href=\"#pull-up-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pull-up-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#pull-up-m-mmask)\"><g class=\"u-stroke\"><use href=\"#pull-up-m-m-head\"/><use href=\"#pull-up-m-m-torso\"/><use href=\"#pull-up-m-m-thigh.l\"/><use href=\"#pull-up-m-m-kneecap.l\"/><use href=\"#pull-up-m-m-shank.l\"/><use href=\"#pull-up-m-m-foot.l\"/><use href=\"#pull-up-m-m-shcap.l\"/><use href=\"#pull-up-m-m-upper.l\"/><use href=\"#pull-up-m-m-elbowcap.l\"/><use href=\"#pull-up-m-m-fore.l\"/><use href=\"#pull-up-m-m-thigh.r\"/><use href=\"#pull-up-m-m-kneecap.r\"/><use href=\"#pull-up-m-m-shank.r\"/><use href=\"#pull-up-m-m-foot.r\"/><use href=\"#pull-up-m-m-shcap.r\"/><use href=\"#pull-up-m-m-upper.r\"/><use href=\"#pull-up-m-m-elbowcap.r\"/><use href=\"#pull-up-m-m-fore.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"M172.62 207.78A50 50 0 0 0 204.76 169.47M206.54 174.15L204.76 169.47L200.78 172.49\"/><path class=\"leader m\" d=\"M205.44 178.96L211 169H221\"/><path class=\"leader m\" d=\"M139.78 83.59L101.67 111H91.67\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"pull-up-m-kick\" data-key=\"kick\" data-cue=\"The legs kick to swing the body up.\" class=\"plate-callout m\" style=\"left:60.34%;top:41.06%\" aria-pressed=\"true\">Leg kick</button><button type=\"button\" id=\"pull-up-m-short\" data-key=\"short\" data-cue=\"The chin stops under the bar: a half rep.\" class=\"plate-callout m\" style=\"left:2.79%;top:24.86%\" aria-pressed=\"false\">Chin short</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "chin",
        cues: [{ key: "chin", cue: "From straight arms, pull until the chin clears the bar, chest toward it." }, { key: "elbows", cue: "Drive the elbows down to the ribs, slightly forward." }, { key: "down", cue: "Keep the shoulders pulled down, away from the ears, all the way up." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "kick",
        cues: [{ key: "kick", cue: "The legs kick to swing the body up." }, { key: "short", cue: "The chin stops under the bar: a half rep." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Leg kick</b><span>The legs kick to swing the body up.</span></li><li><b>Chin short</b><span>The chin stops under the bar: a half rep.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 1 second, hold 0.5 seconds, lower 2 seconds, rest 0.5 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:0.5 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>0.5 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:0.5 1 0\"><i></i><div class=\"tempo-label\"><b>Rest</b><span>0.5 s</span></div></div></div>",
      alt: "Pull-up, side view. Overhand grip just wider than the shoulders. From a straight-arm hang under a bar, the body rises until the chin clears the bar, elbows driven down.",
      mistakeAlt: "Pull-up: the common mistake, drawn dashed in the mistake colour over the correct end position.",
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
      "text": "Hands just outside your shoulders, about 1.5 times shoulder width. Halfway up, seen from the front, your forearms are near vertical.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA",
          "MECH"
        ],
        "sources": [
          "catalyst-pullup",
          "snarr2017",
          "prinold2016",
          "urbanczyk2020",
          "difonza2026"
        ],
        "note": "Width data is thin and mixed: Urbanczyk 2020 is modelling only, Di Fonza 2026 abstract only. The default rests on shoulder safety (Prinold and Bull 2016, mechanism) and coach consensus."
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "baechle-earle",
          "catalyst-pullup"
        ],
        "note": "No study has measured thumb position on a pull-up. Thumbless, hook and gymnastics false grip are shown on the thumb page as information only (C4)."
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
      "limitText": "Bar sliding to your fingertips? End the set.",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "odriscoll1992",
          "rogue-false-grip"
        ],
        "note": "O'Driscoll 1992: self-chosen grip about 35 degrees back, 10 to 15 degrees away from it weakens grip. Both limits are coaching consensus; no study has set wrist limits in a hang."
      }
    },
    "pose": {
      "view": "radial",
      "forearm": 181,
      "wrist": {
        "ext": 15,
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
        "key": "fingertip-slip",
        "label": "Slipping out",
        "pose": {
          "wrist": {
            "ext": 50,
            "dev": 0
          },
          "contactAt": 1.45,
          "fingers": {
            "curl": 1,
            "open": 0.45
          },
          "thumb": "over",
          "forearm": 170.6
        },
        "markers": [
          "slip-arrow",
          "lever-arc"
        ],
        "alt": "Bar slid out to the fingertips, fingers peeling open, thumb loose on top. The hand hinges far back. The grip is about to fail."
      },
      {
        "key": "palm-deep",
        "label": "Deep in palm",
        "pose": {
          "contactAt": 0.3,
          "thumb": "wrapped",
          "forearm": 182.9
        },
        "markers": [
          "skin-ridge"
        ],
        "fingerBase": true,
        "alt": "Bar jammed deep in the middle of the palm, below the finger base. The skin at the finger base bunches into a pinching ridge, where calluses tear."
      }
    ],
    "gripLine": "Hook the bar where your fingers start, like carrying a bag. Wrap your thumb: you hang from the bar.",
    "cue": "Hook it, then wrap your thumb."
  },
  contacts: [
    "hang-support"
  ],
  setup: [
    {
      "kind": "safety",
      "text": "Bar fixed and dry? Chalk sweaty hands.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "catalyst-pullup",
          "bullbar-calluses"
        ]
      }
    },
    {
      "kind": "load",
      "text": "Can't do a few clean reps? Use a band or assisted machine.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "nasm-chinup",
          "prinold2016"
        ],
        "note": "'A few clean reps' as the threshold is consensus. Prinold and Bull suggest assisted pull-ups for weaker people."
      }
    },
    {
      "kind": "position",
      "text": "Hands just outside your shoulders, palms away.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "catalyst-pullup",
          "prinold2016"
        ]
      }
    },
    {
      "kind": "position",
      "text": "Hang still, legs together.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-pullup",
          "nasm-chinup"
        ]
      }
    },
    {
      "kind": "brace",
      "text": "Arms straight, shoulders down. Then pull.",
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-scap",
          "nasm-chinup"
        ]
      }
    }
  ],
  posture: [
    {
      "key": "width",
      "label": "Grip width",
      "detail": "Overhand grip, forearms close to vertical halfway up, when the elbows reach shoulder height. Elbows point down and a little forward, in line with the forearms.",
      "anchor": {
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "catalyst-pullup",
          "prinold2016"
        ],
        "note": "Front view: text checkpoint. The plate is a side view, where width does not show (5.2)."
      }
    },
    {
      "key": "hang",
      "label": "Active hang",
      "detail": "Arms fully straight, shoulder blades pulled slightly down. A clear gap between ears and shoulders.",
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
      "label": "Body still",
      "detail": "Legs together and a little in front, ribs down, glutes lightly squeezed. A gentle straight line from shoulders to feet. No swinging and no deep arch in the lower back.",
      "anchor": {
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-chinup",
          "catalyst-pullup"
        ],
        "note": "Shown by the plate Mistake layer (kick and swing), not a zoom."
      }
    },
    {
      "key": "elbows",
      "label": "Elbows down",
      "detail": "In mid-pull the elbows travel down and slightly back toward the sides of the ribs. They point at the floor.",
      "anchor": {
        "at": "elbow.r",
        "off": [
          2,
          5
        ]
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-pullup"
        ]
      }
    },
    {
      "key": "top",
      "label": "Chin over bar",
      "detail": "At the top the chin clears the bar and the upper chest rises toward it. The head stays level, neck long. The chin does not crane forward to reach the bar.",
      "anchor": {
        "at": "chin"
      },
      "zoom": "top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-pullup",
          "nasm-chinup"
        ]
      }
    },
    {
      "key": "lower",
      "label": "Full lowering",
      "detail": "At the bottom the elbows are fully straight again, lowered under control. Shoulders set before the next pull.",
      "anchor": {
        "at": "elbow.r",
        "pose": "start"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "catalyst-pullup",
          "prinold2016",
          "kolber2010"
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
      "key": "shoulders",
      "chip": "Shoulders",
      "heading": "Shoulders: right and wrong",
      "kind": "posture",
      "feelRow": "traps"
    },
    {
      "key": "top",
      "chip": "Top",
      "heading": "Top position: right and wrong",
      "kind": "posture",
      "feelRow": "pinch"
    }
  ],
  chips: [
    "hand",
    "shoulders",
    "top",
    "feel"
  ],
  copy: {
    "setupLine": "Hang still on straight arms, legs together. Pull your shoulders down, then start.",
    "mistakeLine": "Don't bounce out of the bottom. Lower all the way, shoulders down, then pull."
  },
  mistakes: [
    {
      "key": "drop",
      "title": "Bouncing at the bottom",
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
      "fix": "Lower slowly to straight arms."
    },
    {
      "key": "wide",
      "title": "Grip too wide",
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "prinold2016",
          "urbanczyk2020",
          "difonza2026"
        ]
      },
      "fix": "Hands just outside your shoulders."
    },
    {
      "key": "slip",
      "title": "Bar slipping to fingertips",
      "zoom": "hand",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "odriscoll1992",
          "bullbar-calluses"
        ]
      },
      "fix": "Set the bar where your fingers start."
    }
  ],
  risks: [
    {
      "key": "bottom",
      "text": "Dropping into the bottom jerks your weight through the shoulder.",
      "claim": {
        "tags": [
          "MECH",
          "CONSENSUS"
        ],
        "sources": [
          "prinold2016",
          "kolber2010"
        ],
        "note": "The link to bouncing is coaching consensus."
      }
    },
    {
      "key": "wide",
      "text": "Wide grips are linked to shoulder pinching.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "prinold2016"
        ],
        "note": "The authors link the movement pattern to impingement risk; injuries were not measured."
      }
    },
    {
      "key": "neck",
      "text": "Chin reaching strains your neck. Fingertip grips can slip off.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "nasm-chinup",
          "catalyst-pullup",
          "odriscoll1992"
        ]
      }
    }
  ],
  riskFlags: [
    "wrist",
    "shoulder",
    "elbow"
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
    "youdas2010",
    "dickie2017",
    "snarr2017",
    "prinold2016",
    "urbanczyk2020",
    "difonza2026",
    "kolber2010",
    "odriscoll1992",
    "oranchuk2022",
    "catalyst-pullup",
    "catalyst-scap",
    "catalyst-neutral",
    "nasm-chinup",
    "baechle-earle",
    "wiki-hook-grip",
    "wiki-muscle-up",
    "rogue-false-grip",
    "bullbar-calluses",
    "nhs-wrist-pain",
    "nhs-shoulder-pain",
    "nhs-elbow-pain"
  ],
  research: {
    "card": "grip/research/pull_up.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

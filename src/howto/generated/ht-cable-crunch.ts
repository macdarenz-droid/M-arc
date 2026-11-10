// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=51e61a433aec860780ff73da22635ccd8282f006a0834bab2fca6938a758a274
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_cable_crunch",
  name: "Cable Crunch",
  hashes: { inputsSha256: "51e61a433aec860780ff73da22635ccd8282f006a0834bab2fca6938a758a274", golden: "df21ebaff82f55abde699d5da068df5d4c0aa819a11a58b8dcf726450ecf1298" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"cable-crunch-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"cable-crunch-n-st-shcap.l\" d=\"~~P*jD)F1wP10\"/><path id=\"cable-crunch-n-st-upper.l\" d=\"~#F12N_lJKH1)Xk)VH1V8!117(J1xfT6K1B3jED1Y4VkT4*fN4GfYexz1YfO2F2.4U4FN1Oa2cK8Y2D3wgFsH6Ulx6!kzk00000000020000000000000000000210100000210000120001002000001100000210001101000100\"/><path id=\"cable-crunch-n-st-elbowcap.l\" d=\"~~yEtNOD1Dz10\"/><path id=\"cable-crunch-n-st-fore.l\" d=\"~#F12W*uDPB1ITvBxD1U7_6*1b.B1Ij!5_7y1U2_qyhD7UcU9!5JesHrNgY25U9Y1By1Epz1V1J9!3y6B8xbEjVex9zmI110001000010000100000000101020020000010000201010001000001001000101000021210000001\"/><path id=\"cable-crunch-n-st-fist.l\" d=\"~~SDlJNx1ww10\"/><path id=\"cable-crunch-n-st-head\" d=\"~#w12y*m!Hv)Jl-WuXmYeXkN5GaO5z4w4x3X8K5TcTcTpJ7ObeV9Xi)3DoG6HnT1UjN7NfWjO5Ni0020002000000000000002000011000022002000200001000100001000000002\"/><path id=\"cable-crunch-n-st-torso\" d=\"~#_12PNkSVz1OxlzHy1.7nS4pP9YfU9J6_cwgJ60K6)nGm)7.c_4wg-4!kK6Hm*fUhTh_4T9)7*fBrEz1BbBrK60R90YcwgF3w8.c)7*fw8I6_kH6YeFlTbP14)X2(d00001121010020012000000001000101000010000100211010000120000020010000000100011000000000000000202000101100000002000002\"/><path id=\"cable-crunch-n-st-shcap.r\" d=\"^0\"/><path id=\"cable-crunch-n-st-upper.r\" d=\"^1\"/><path id=\"cable-crunch-n-st-elbowcap.r\" d=\"^2\"/><path id=\"cable-crunch-n-st-fore.r\" d=\"^3\"/><path id=\"cable-crunch-n-st-fist.r\" d=\"^4\"/><path id=\"cable-crunch-n-g0-head\" d=\"~#w12yNv_-z1KRuENy1Erhzkz7R5GaT5w1P2)8N2Od(3EsUcI5Y5-7Gd.dUnJ8AkYbAcDh_1(o)eAc0000002002100000202000120000000220100100012000022000200000000000\"/><path id=\"cable-crunch-n-g0-torso\" d=\"~#_12F)qUwD1GEsIEB1z6*4F4_1vNiA2JeYe!pAdU4P7RqV8T8ObS2wg-4!kK6Hm*fUhTh_4T9)7*fBrEz1BbBrV6StJ7-7(cNkS37*4gI6Rj*gUdx3_fAoH2F1s-P2XB120010101000010200100100002020020000001000100211010000120000020010000001010000000101010001200000210000010000000001001\"/><path id=\"cable-crunch-n-g0-shcap.r\" d=\"~~!GnJ(H1wP10\"/><path id=\"cable-crunch-n-g0-upper.r\" d=\"~#F12DKoWJJ1)HnGyJ1O8.247PN1Fa.4T4O2B2Rz1VfOfVe-fG4Xk_4VD1V4E3kO6P1FK1!e38V8.1G5HfylwkUl!5FsK600000100200000200000000000100000001200011001000000100100100000010120000010001202\"/><path id=\"cable-crunch-n-g0-elbowcap.r\" d=\"~~WVw1(JK1Dz10\"/><path id=\"cable-crunch-n-g0-fore.r\" d=\"~#F12_-y1S!J1.yz1RVK1Y2P9K1G1Gl)y1mN9dW2(cwrdSew5wa_bN8YdUqP2F1w7F6xfzD11*1_5(7!9*2mBmT7KfBi-c01000000010000001010100100000200000000012020010001000000001010100010000000000101\"/><path id=\"cable-crunch-n-g0-fist.r\" d=\"~~UVsyBB1ww10\"/><path id=\"cable-crunch-n-g1-head\" d=\"~#w12HHA1w.I1xIA1*DH1BmTfXcGhF1RbE5G2y7z6W9-9AjzlJdS2D9B3E3*i_eDkDa(kaylOcWlBjU10000000010000200200021200022001002101000010000210100101000000100\"/><path id=\"cable-crunch-n-g1-torso\" d=\"~#_12JJvPBI1X.w1xEI1B2O7J2!3xbWeEaFf(7YF1DhFeNmBmy5z5X9cwg-4!kK6Hm*fUhTh_4T9)7*fBrEz1BbBr)bJ_1(iTcH6_nU8O7GaA9WnXtVlW1IbNbWiNfgN1VK1TJ200000000000101010000010000000200101001000100211010000120000020010000000000001010000100000002001011000000000001101012\"/><path id=\"cable-crunch-n-g1-shcap.r\" d=\"~~NHpFxN1wP10\"/><path id=\"cable-crunch-n-g1-upper.r\" d=\"~#F12YUpw)N1I)oOyN1B5E785Hv_z1B1V6nE3BjRx1X3*kEa*cOjK8EsOqx3K1x6V2PrWD158.5X6KdD9y5Ps(dWhUqNb02020002000200111110000220000100101000000011110121110100220000001000000002000100\"/><path id=\"cable-crunch-n-g1-elbowcap.r\" d=\"~~HOvwHV1Dz10\"/><path id=\"cable-crunch-n-g1-fore.r\" d=\"~#F12_Wx1(OV1KOx1BHW1I3P9d*1J3)G1)4J8*1(1O5!u-8Nb-1AbW4WdT4wvH1P2(1P9Ha*F1w1V12Aa!9W2PdTh_2)gE7)k21110001010002021000000000010100001010000020001010012100000002000002000002000000\"/><path id=\"cable-crunch-n-g1-fist.r\" d=\"~~Hzx1A)I1ww10\"/><path id=\"cable-crunch-n-e-thigh.l\" d=\"~#F12JBjNGX1XRiO(V1X5OaB1gYoY-1(2K9F1T4-f-S1Y3-p*6)iKjIhRkxR1*3X2G8G5Fiy!1A1bG2VbGx1bV6!K1HcYx1Uy1(u00100000022200010120000000000000000000000000000101210102000000000210100000200010\"/><path id=\"cable-crunch-n-e-kneecap.l\" d=\"~~_DoP)x2_J10\"/><path id=\"cable-crunch-n-e-shank.l\" d=\"~#F12AXpFRw2*BrTYw2WbY25F1x)10H7S6Y3w3yz2N1wdH8(buDeE6Py2!8y4O2J8G5K(1V94B1!btVaVdRnzfVlT1TpHb00000002000001011101000000001000002000000011000020000000000000100000000002000000\"/><path id=\"cable-crunch-n-e-foot.l\" d=\"~#o2!WewNx2T_eISy2GcW4*9UgK7Fy1-E2UV1!x2XE1AA1EfYjTdPvTrNgA4EhUp_3-x1010000000210000022000202000200000100100000011100\"/><path id=\"cable-crunch-n-e-shcap.l\" d=\"~~UWpFKR1wP10\"/><path id=\"cable-crunch-n-e-upper.l\" d=\"~#F12YWpUHR1O-pGHP1uz8822FI1J3B5W1T2P7xw1ybBiuIg)8Gj)3Vw1E1X2.2R5X4wI1911x8.fG5zf_oE1JmHcFq11000110020200000000000001101012100101100000220000000011111010000000000000000101\"/><path id=\"cable-crunch-n-e-elbowcap.l\" d=\"~~PUp__-1Dz10\"/><path id=\"cable-crunch-n-e-fore.l\" d=\"~#F12PNrWX_1VWqVD.1z9w5w1V1YvVtK9y3-24zqykBeS2.8(6X5HdOpWkp_2x5P8yA1Bow2f)6W7A6A8_l*3SdTa_8Kk20011000001101000000000000000001010101000002002001111000020000000000000020010000\"/><path id=\"cable-crunch-n-e-fist.l\" d=\"~~SJx1A-T1ww10\"/><path id=\"cable-crunch-n-e-head\" d=\"~#w12WGA1S*U1REB1.ST1R9IppOlP7.8)2.4D9x1SdV2Ur-6Y9W9H9N2w8OhuypK3ynKbShOmwb-gK91000000000000000220000000000000000011000000012100000000000000010\"/><path id=\"cable-crunch-n-e-torso\" d=\"~#_12(Sw1DTR1E-x1xOS1H2K73S4Kh(5Kl!6RbFV1YfPr!y1XayiN2X7V1wg-4!kK6Hm*fUhTh_4T9)7*fBrEz1BbBrEmUV2DpKh-4NlAi.bxoN7(Y1)b.iVa-fy3_6FndP1D5x-200000000000010000000020020000000100000000100211010000120000020010000000001000000202200001010100022020010101210012100\"/><path id=\"cable-crunch-n-e-thigh.r\" d=\"^21\"/><path id=\"cable-crunch-n-e-kneecap.r\" d=\"^22\"/><path id=\"cable-crunch-n-e-shank.r\" d=\"^23\"/><path id=\"cable-crunch-n-e-foot.r\" d=\"^24\"/><path id=\"cable-crunch-n-e-shcap.r\" d=\"^25\"/><path id=\"cable-crunch-n-e-upper.r\" d=\"^26\"/><path id=\"cable-crunch-n-e-elbowcap.r\" d=\"^27\"/><path id=\"cable-crunch-n-e-fore.r\" d=\"^28\"/><path id=\"cable-crunch-n-e-fist.r\" d=\"^29\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#cable-crunch-n-dots)\"/>\n  <path class=\"floorline\" d=\"M21.42 345.77H336.58\"/><path class=\"eq\" d=\"~MHBV1WEz2L0OT.1Q0E6E6FK.1L*qF6QE60(qF6LF6FK.1Q0F6F6EK.1L(qE6QF60*qE6Z\"/><path class=\"eq\" d=\"~MPN*1WEz2L0OT.1Q0E6E6FK.1L)qF6QE60wrF6LF6FK.1Q0F6F6EK.1LwrE6QF60)qE6Z\"/><path class=\"eq\" d=\"~M!*T1_A9LJH90QF60zA9E6LE6zA1Q0E6E6AA1LzA9F6QE60AA9F6LF6AA1Q0F6F6zA1Z\"/><path class=\"eq\" d=\"~MwES1(Kz2LyYc0QF60-RcE6LE6B3Q0E6E6D3L-RcF6QE60_RcF6LF6D3Q0F6F6B3Z\"/><path class=\"eq\" d=\"~MYUV1(Kz2LU!50QF60IW5E6LE6zA1Q0E6E6AA1LIW5F6QE60JW5F6LF6AA1Q0F6F6zA1Z\"/><path class=\"eq-thin\" d=\"~MWWW1yXx2L0VKl\"/><path class=\"eq-thin\" d=\"~MJO_1yXx2L0VKl\"/><path class=\"eq\" d=\"~MPNV1PS_1LAG60LzG6SA7LzG6RA7Z\"/><path class=\"eq-thin\" d=\"M273.68 332.83H305.86M273.68 329.18H305.86M273.68 325.52H305.86M273.68 321.86H305.86M273.68 318.21H305.86M273.68 314.55H305.86M273.68 310.89H305.86M273.68 307.23H305.86M273.68 303.58H305.86\"/><path class=\"eq-solid\" d=\"~~yTX1Dwaww10\"/><path class=\"eq-pin\" d=\"~~_JY1DwaF60\"/><path class=\"eq\" d=\"^42\"/><path class=\"eq-pin\" d=\"^43\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#cable-crunch-n-st-shcap.l\"/><use href=\"#cable-crunch-n-st-upper.l\"/><use href=\"#cable-crunch-n-st-elbowcap.l\"/><use href=\"#cable-crunch-n-st-fore.l\"/><use href=\"#cable-crunch-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-n-st-shcap.l\"/><use href=\"#cable-crunch-n-st-upper.l\"/><use href=\"#cable-crunch-n-st-elbowcap.l\"/><use href=\"#cable-crunch-n-st-fore.l\"/><use href=\"#cable-crunch-n-st-fist.l\"/></g></g><path class=\"eq-cable\" d=\"~MyErD.tLH-s)Uk\"/><path class=\"eq-cable\" d=\"~MJwY1DD9LG-swVk\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-n-st-head\"/><use href=\"#cable-crunch-n-st-torso\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-n-st-head\"/><use href=\"#cable-crunch-n-st-torso\"/></g></g><path class=\"eq-solid\" d=\"~#H12YKrSAuIHsRHtV1K2B1T1tE1JbT7zfPcUw1.c*8V3sxcA1*3F7z5y44Ybw3iW9ynEqzfPcJbT7tE1z1T19bTgWH1002100000212100000000000000001001100001000101120000010121020002002000202001100002200\"/><path class=\"eq-solid\" d=\"^46\"/><path class=\"eq-solid\" d=\"~MHBsPNtL.w1Sw1L_fGY1LP_1y3Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-n-st-shcap.r\"/><use href=\"#cable-crunch-n-st-upper.r\"/><use href=\"#cable-crunch-n-st-elbowcap.r\"/><use href=\"#cable-crunch-n-st-fore.r\"/><use href=\"#cable-crunch-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-n-st-shcap.r\"/><use href=\"#cable-crunch-n-st-upper.r\"/><use href=\"#cable-crunch-n-st-elbowcap.r\"/><use href=\"#cable-crunch-n-st-fore.r\"/><use href=\"#cable-crunch-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-cable\" d=\"~MY.X1HH9LX(l!Hn\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-n-g0-head\"/><use href=\"#cable-crunch-n-g0-torso\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-n-g0-head\"/><use href=\"#cable-crunch-n-g0-torso\"/></g></g><path class=\"eq-solid\" d=\"~#H12JBy1y*w1O!y1x(vx2)1R1I1x1z1W9T9RcDfWt)iR9-1K1)bcx4A6O6w4jycmN2N9UhEuKcDfU9T9x1z1R1I175z8(J1000020101001000010010101000000000000000000100000000000002000000012000110100200012000\"/><path class=\"eq-solid\" d=\"^49\"/><path class=\"eq-solid\" d=\"~MFYy1!yw1L)pHD1LW4I_1L(-1B8Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-n-g0-shcap.r\"/><use href=\"#cable-crunch-n-g0-upper.r\"/><use href=\"#cable-crunch-n-g0-elbowcap.r\"/><use href=\"#cable-crunch-n-g0-fore.r\"/><use href=\"#cable-crunch-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-n-g0-shcap.r\"/><use href=\"#cable-crunch-n-g0-upper.r\"/><use href=\"#cable-crunch-n-g0-elbowcap.r\"/><use href=\"#cable-crunch-n-g0-fore.r\"/><use href=\"#cable-crunch-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-cable\" d=\"~M(XX1DO9LTIiUFt\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-n-g1-head\"/><use href=\"#cable-crunch-n-g1-torso\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-n-g1-head\"/><use href=\"#cable-crunch-n-g1-torso\"/></g></g><path class=\"eq-solid\" d=\"~#H12yWB1!*D1VDD1*_B1R2T1V1x1E1rS7GbG9HhJpGoV90V3Obf)3Y4T7!3I1(bT1F4Y8Nbxx1G9JhS7KbE1pV1x1b5mWK1001011002000211002101000200020000012000001200022002200020010100001200020001000010022\"/><path class=\"eq-solid\" d=\"^52\"/><path class=\"eq-solid\" d=\"~MPzD1SwD1LxiUH1LX6B_1LHX1EjZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-n-g1-shcap.r\"/><use href=\"#cable-crunch-n-g1-upper.r\"/><use href=\"#cable-crunch-n-g1-elbowcap.r\"/><use href=\"#cable-crunch-n-g1-fore.r\"/><use href=\"#cable-crunch-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-n-g1-shcap.r\"/><use href=\"#cable-crunch-n-g1-upper.r\"/><use href=\"#cable-crunch-n-g1-elbowcap.r\"/><use href=\"#cable-crunch-n-g1-fore.r\"/><use href=\"#cable-crunch-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MPNV1FTP1LAG60LzG6AG4LzG6zG4Z\"/><path class=\"eq-thin\" d=\"M273.68 267.12H305.86M273.68 263.46H305.86M273.68 259.81H305.86M273.68 256.15H305.86M273.68 252.49H305.86\"/><path class=\"eq-cable\" d=\"~MyTX1DwaL00Mww1ww1L0yTB1\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#cable-crunch-n-e-thigh.l\"/><use href=\"#cable-crunch-n-e-kneecap.l\"/><use href=\"#cable-crunch-n-e-shank.l\"/><use href=\"#cable-crunch-n-e-foot.l\"/><use href=\"#cable-crunch-n-e-shcap.l\"/><use href=\"#cable-crunch-n-e-upper.l\"/><use href=\"#cable-crunch-n-e-elbowcap.l\"/><use href=\"#cable-crunch-n-e-fore.l\"/><use href=\"#cable-crunch-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-n-e-thigh.l\"/><use href=\"#cable-crunch-n-e-kneecap.l\"/><use href=\"#cable-crunch-n-e-shank.l\"/><use href=\"#cable-crunch-n-e-foot.l\"/><use href=\"#cable-crunch-n-e-shcap.l\"/><use href=\"#cable-crunch-n-e-upper.l\"/><use href=\"#cable-crunch-n-e-elbowcap.l\"/><use href=\"#cable-crunch-n-e-fore.l\"/><use href=\"#cable-crunch-n-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"~MSBB1_FN1L(Pi)WA1\"/><path class=\"eq-cable\" d=\"~MPWX1_R9L*PiwXA1\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-n-e-head\"/><use href=\"#cable-crunch-n-e-torso\"/><use href=\"#cable-crunch-n-e-thigh.r\"/><use href=\"#cable-crunch-n-e-kneecap.r\"/><use href=\"#cable-crunch-n-e-shank.r\"/><use href=\"#cable-crunch-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-n-e-head\"/><use href=\"#cable-crunch-n-e-torso\"/><use href=\"#cable-crunch-n-e-thigh.r\"/><use href=\"#cable-crunch-n-e-kneecap.r\"/><use href=\"#cable-crunch-n-e-shank.r\"/><use href=\"#cable-crunch-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~#H12!OB1wNN1E*B1XGK1R2G1.1rI1nS6)bT7AiwnRqX9sV4xbp)3(3*7_3-1WbV2w5H8J8)x1V7AiP6xcG1j.1v91w5NK1000000000000000220002000000010002002100000000100101000000000100010000200000022200011\"/><path class=\"eq-solid\" d=\"^59\"/><path class=\"eq-solid\" d=\"~MP_B1POK1LxeAJ1LxcG-1LFV1GoZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-n-e-shcap.r\"/><use href=\"#cable-crunch-n-e-upper.r\"/><use href=\"#cable-crunch-n-e-elbowcap.r\"/><use href=\"#cable-crunch-n-e-fore.r\"/><use href=\"#cable-crunch-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-n-e-shcap.r\"/><use href=\"#cable-crunch-n-e-upper.r\"/><use href=\"#cable-crunch-n-e-elbowcap.r\"/><use href=\"#cable-crunch-n-e-fore.r\"/><use href=\"#cable-crunch-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"139.3\" cy=\"253\" r=\"2.25\"/><circle class=\"joint\" cx=\"136.91\" cy=\"296.13\" r=\"2.25\"/><circle class=\"joint\" cx=\"109.68\" cy=\"278.91\" r=\"2.25\"/><circle class=\"joint\" cx=\"131.14\" cy=\"337.84\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#Y10yFn!YG1GxnXUG13456363654563278325456527434527452525274507232903270500001000000000200200010101001010012000000000000000000102000000000101000000001101000010001000000001020000000000000\"/><path class=\"arrow\" d=\"~MHIr!wP1Lzr*vLP)1wnZ\"/></g><path class=\"leader\" d=\"M94.7 292.96L89.11 308H79.11\"/><circle class=\"anchor\" cx=\"94.7\" cy=\"292.96\" r=\"1.5\"/><path class=\"leader\" d=\"~MYPiNAT1LRO2y1\"/><circle class=\"anchor\" cx=\"94.84\" cy=\"261.83\" r=\"1.5\"/><path class=\"leader\" d=\"M187.58 246.33L195 256H205\"/><circle class=\"anchor\" cx=\"187.58\" cy=\"246.33\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"cable-crunch-n-hips\" data-key=\"hips\" data-cue=\"Keep the hips still and raised while only the spine bends.\" class=\"plate-callout\" style=\"left:2.23%;top:79.89%\" aria-pressed=\"true\">Hips still</button><button type=\"button\" id=\"cable-crunch-n-curl\" data-key=\"curl\" data-cue=\"Curl your spine so the elbows move toward your thighs.\" class=\"plate-callout two\" style=\"left:4.47%;top:67.04%\" aria-pressed=\"false\">Curl the<br>spine</button><button type=\"button\" id=\"cable-crunch-n-rope\" data-key=\"rope\" data-cue=\"Hands hold the rope by your head, and the arms don't yank.\" class=\"plate-callout two\" style=\"left:55.87%;top:65.36%\" aria-pressed=\"false\">Rope by<br>head</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"cable-crunch-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"cable-crunch-m-st-shcap.l\" d=\"^0\"/><path id=\"cable-crunch-m-st-upper.l\" d=\"^1\"/><path id=\"cable-crunch-m-st-elbowcap.l\" d=\"^2\"/><path id=\"cable-crunch-m-st-fore.l\" d=\"^3\"/><path id=\"cable-crunch-m-st-fist.l\" d=\"^4\"/><path id=\"cable-crunch-m-st-head\" d=\"^5\"/><path id=\"cable-crunch-m-st-torso\" d=\"^6\"/><path id=\"cable-crunch-m-st-shcap.r\" d=\"^0\"/><path id=\"cable-crunch-m-st-upper.r\" d=\"^1\"/><path id=\"cable-crunch-m-st-elbowcap.r\" d=\"^2\"/><path id=\"cable-crunch-m-st-fore.r\" d=\"^3\"/><path id=\"cable-crunch-m-st-fist.r\" d=\"^4\"/><path id=\"cable-crunch-m-g0-head\" d=\"^7\"/><path id=\"cable-crunch-m-g0-torso\" d=\"^8\"/><path id=\"cable-crunch-m-g0-shcap.r\" d=\"^9\"/><path id=\"cable-crunch-m-g0-upper.r\" d=\"^10\"/><path id=\"cable-crunch-m-g0-elbowcap.r\" d=\"^11\"/><path id=\"cable-crunch-m-g0-fore.r\" d=\"^12\"/><path id=\"cable-crunch-m-g0-fist.r\" d=\"^13\"/><path id=\"cable-crunch-m-g1-head\" d=\"^14\"/><path id=\"cable-crunch-m-g1-torso\" d=\"^15\"/><path id=\"cable-crunch-m-g1-shcap.r\" d=\"^16\"/><path id=\"cable-crunch-m-g1-upper.r\" d=\"^17\"/><path id=\"cable-crunch-m-g1-elbowcap.r\" d=\"^18\"/><path id=\"cable-crunch-m-g1-fore.r\" d=\"^19\"/><path id=\"cable-crunch-m-g1-fist.r\" d=\"^20\"/><path id=\"cable-crunch-m-e-thigh.l\" d=\"^21\"/><path id=\"cable-crunch-m-e-kneecap.l\" d=\"^22\"/><path id=\"cable-crunch-m-e-shank.l\" d=\"^23\"/><path id=\"cable-crunch-m-e-foot.l\" d=\"^24\"/><path id=\"cable-crunch-m-e-shcap.l\" d=\"^25\"/><path id=\"cable-crunch-m-e-upper.l\" d=\"^26\"/><path id=\"cable-crunch-m-e-elbowcap.l\" d=\"^27\"/><path id=\"cable-crunch-m-e-fore.l\" d=\"^28\"/><path id=\"cable-crunch-m-e-fist.l\" d=\"^29\"/><path id=\"cable-crunch-m-e-head\" d=\"^30\"/><path id=\"cable-crunch-m-e-torso\" d=\"^31\"/><path id=\"cable-crunch-m-e-thigh.r\" d=\"^21\"/><path id=\"cable-crunch-m-e-kneecap.r\" d=\"^22\"/><path id=\"cable-crunch-m-e-shank.r\" d=\"^23\"/><path id=\"cable-crunch-m-e-foot.r\" d=\"^24\"/><path id=\"cable-crunch-m-e-shcap.r\" d=\"^25\"/><path id=\"cable-crunch-m-e-upper.r\" d=\"^26\"/><path id=\"cable-crunch-m-e-elbowcap.r\" d=\"^27\"/><path id=\"cable-crunch-m-e-fore.r\" d=\"^28\"/><path id=\"cable-crunch-m-e-fist.r\" d=\"^29\"/><path id=\"cable-crunch-m-m-head\" d=\"~#w12!yF1SWV1GJF1GzU1GjBjT9BjD3Bb-4B3w8-4Abx8NmThYcY4U9R11EjFbJmP6JmB3_k*fFjEjR10010000000000010100000000000021000000010100100200010101010001000\"/><path id=\"cable-crunch-m-m-torso\" d=\"~#_12YHz1(DU1z-A1KPU1vX7W1F4GdUcE4Wa*c!fJ1H6ymIbA3RnI7Kby8SeUawjHkSi(kNdNaY2(dBbWsxy1DoTgG1E6)1I9*c!fB7_4A5Eezb.dXl*1xdH9_fJi8N1Ew1xT200001000120000010101000000001000000000101111000101000000020011000012000220002000000001012000220000200000000101021020\"/><path id=\"cable-crunch-m-m-thigh.l\" d=\"~#F12SKfYY_1IHeG--1K9E7ts_K1wI1x1X9n-4-y1BF1*6zp*dVeXox8RD1-A1T4r-9R1_F1_O1sr-6-9VuydHcUJ1YoyqAJ1Pe00101000020002200001000002000000202000010100021010000000001111000000100000020000\"/><path id=\"cable-crunch-m-m-shcap.l\" d=\"~~P.s(FW1wP10\"/><path id=\"cable-crunch-m-m-upper.l\" d=\"~#F12_(sJ_W1*Ts..V1O2V783(hJE1w1z6cz3K6Ew1S2xl*5KfEgXdxhzsI2*1.4*3NdAG172I3G7XgY1K3_sD8(kwm_i00100010000000022000000200100001001002020000000021000000210010000100202000100001\"/><path id=\"cable-crunch-m-m-elbowcap.l\" d=\"~~HHw1NA(1Dz10\"/><path id=\"cable-crunch-m-m-fore.l\" d=\"~#F12FNy1FV(1-(x1XJ)1B6H86*1UgBF1I7W6O2H1Ifyt)bD8x5wa6PeReNta_2x1(9(m)A1P1G1B3(9(8_4HiRc_7IfbBm01200002000111002000000020100000020210020010100000200101011010000010101001010021\"/><path id=\"cable-crunch-m-m-fist.l\" d=\"~~D!A1YNV1ww10\"/><path id=\"cable-crunch-m-m-thigh.r\" d=\"^68\"/><path id=\"cable-crunch-m-m-shcap.r\" d=\"^69\"/><path id=\"cable-crunch-m-m-upper.r\" d=\"^70\"/><path id=\"cable-crunch-m-m-elbowcap.r\" d=\"^71\"/><path id=\"cable-crunch-m-m-fore.r\" d=\"^72\"/><path id=\"cable-crunch-m-m-fist.r\" d=\"^73\"/><path id=\"cable-crunch-m-m-eq0\" d=\"~#H12DRF1w!O1R.F1XWN1V2x1.1pK1jS5KcB6UiYkGsR9U1T5Taz1.3H3G8S3x2PbT3U5_7S5Oy1z6UiP5KcK1j.1pb1W8!J1021200002100000002000100000001200000000101000002000001020001000210101001100010010010\"/><path id=\"cable-crunch-m-m-eq1\" d=\"^74\"/><path id=\"cable-crunch-m-m-eq2\" d=\"~MH-F1_!N1LKayK1LVgxY1LAT1RsZ\"/><path id=\"cable-crunch-m-mf-kneecap.l\" d=\"^22\"/><path id=\"cable-crunch-m-mf-shank.l\" d=\"^23\"/><path id=\"cable-crunch-m-mf-foot.l\" d=\"^24\"/><path id=\"cable-crunch-m-mf-kneecap.r\" d=\"^22\"/><path id=\"cable-crunch-m-mf-shank.r\" d=\"^23\"/><path id=\"cable-crunch-m-mf-foot.r\" d=\"^24\"/><path id=\"cable-crunch-m-mo-0\" d=\"^30\"/><path id=\"cable-crunch-m-mo-1\" d=\"^31\"/><path id=\"cable-crunch-m-mo-2\" d=\"^21\"/><path id=\"cable-crunch-m-mo-3\" d=\"^22\"/><path id=\"cable-crunch-m-mo-4\" d=\"^23\"/><path id=\"cable-crunch-m-mo-5\" d=\"^24\"/><path id=\"cable-crunch-m-mo-6\" d=\"^25\"/><path id=\"cable-crunch-m-mo-7\" d=\"^26\"/><path id=\"cable-crunch-m-mo-8\" d=\"^27\"/><path id=\"cable-crunch-m-mo-9\" d=\"^28\"/><path id=\"cable-crunch-m-mo-10\" d=\"^29\"/><path id=\"cable-crunch-m-mo-11\" d=\"^21\"/><path id=\"cable-crunch-m-mo-12\" d=\"^22\"/><path id=\"cable-crunch-m-mo-13\" d=\"^23\"/><path id=\"cable-crunch-m-mo-14\" d=\"^24\"/><path id=\"cable-crunch-m-mo-15\" d=\"^25\"/><path id=\"cable-crunch-m-mo-16\" d=\"^26\"/><path id=\"cable-crunch-m-mo-17\" d=\"^27\"/><path id=\"cable-crunch-m-mo-18\" d=\"^28\"/><path id=\"cable-crunch-m-mo-19\" d=\"^29\"/><path id=\"cable-crunch-m-mo-20\" d=\"^33\"/><path id=\"cable-crunch-m-mo-21\" d=\"^34\"/><path id=\"cable-crunch-m-mo-22\" d=\"^35\"/><path id=\"cable-crunch-m-mo-23\" d=\"^36\"/><path id=\"cable-crunch-m-mo-24\" d=\"^37\"/><path id=\"cable-crunch-m-mo-25\" d=\"^40\"/><path id=\"cable-crunch-m-mo-26\" d=\"^54\"/><path id=\"cable-crunch-m-mo-27\" d=\"^42\"/><path id=\"cable-crunch-m-mo-28\" d=\"^43\"/><path id=\"cable-crunch-m-mo-29\" d=\"^42\"/><path id=\"cable-crunch-m-mo-30\" d=\"^43\"/><path id=\"cable-crunch-m-mo-31\" d=\"^59\"/><path id=\"cable-crunch-m-mo-32\" d=\"^59\"/><path id=\"cable-crunch-m-mo-33\" d=\"^60\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#cable-crunch-m-dots)\"/>\n  <path class=\"floorline\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><path class=\"eq-thin\" d=\"^38\"/><path class=\"eq-thin\" d=\"^39\"/><path class=\"eq\" d=\"^40\"/><path class=\"eq-thin\" d=\"^41\"/><path class=\"eq-solid\" d=\"^42\"/><path class=\"eq-pin\" d=\"^43\"/><path class=\"eq\" d=\"^42\"/><path class=\"eq-pin\" d=\"^43\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#cable-crunch-m-st-shcap.l\"/><use href=\"#cable-crunch-m-st-upper.l\"/><use href=\"#cable-crunch-m-st-elbowcap.l\"/><use href=\"#cable-crunch-m-st-fore.l\"/><use href=\"#cable-crunch-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-m-st-shcap.l\"/><use href=\"#cable-crunch-m-st-upper.l\"/><use href=\"#cable-crunch-m-st-elbowcap.l\"/><use href=\"#cable-crunch-m-st-fore.l\"/><use href=\"#cable-crunch-m-st-fist.l\"/></g></g><path class=\"eq-cable\" d=\"^44\"/><path class=\"eq-cable\" d=\"^45\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-m-st-head\"/><use href=\"#cable-crunch-m-st-torso\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-m-st-head\"/><use href=\"#cable-crunch-m-st-torso\"/></g></g><path class=\"eq-solid\" d=\"^46\"/><path class=\"eq-solid\" d=\"^46\"/><path class=\"eq-solid\" d=\"^47\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-m-st-shcap.r\"/><use href=\"#cable-crunch-m-st-upper.r\"/><use href=\"#cable-crunch-m-st-elbowcap.r\"/><use href=\"#cable-crunch-m-st-fore.r\"/><use href=\"#cable-crunch-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-m-st-shcap.r\"/><use href=\"#cable-crunch-m-st-upper.r\"/><use href=\"#cable-crunch-m-st-elbowcap.r\"/><use href=\"#cable-crunch-m-st-fore.r\"/><use href=\"#cable-crunch-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-cable\" d=\"^48\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-m-g0-head\"/><use href=\"#cable-crunch-m-g0-torso\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-m-g0-head\"/><use href=\"#cable-crunch-m-g0-torso\"/></g></g><path class=\"eq-solid\" d=\"^49\"/><path class=\"eq-solid\" d=\"^49\"/><path class=\"eq-solid\" d=\"^50\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-m-g0-shcap.r\"/><use href=\"#cable-crunch-m-g0-upper.r\"/><use href=\"#cable-crunch-m-g0-elbowcap.r\"/><use href=\"#cable-crunch-m-g0-fore.r\"/><use href=\"#cable-crunch-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-m-g0-shcap.r\"/><use href=\"#cable-crunch-m-g0-upper.r\"/><use href=\"#cable-crunch-m-g0-elbowcap.r\"/><use href=\"#cable-crunch-m-g0-fore.r\"/><use href=\"#cable-crunch-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-cable\" d=\"^51\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-m-g1-head\"/><use href=\"#cable-crunch-m-g1-torso\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-m-g1-head\"/><use href=\"#cable-crunch-m-g1-torso\"/></g></g><path class=\"eq-solid\" d=\"^52\"/><path class=\"eq-solid\" d=\"^52\"/><path class=\"eq-solid\" d=\"^53\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-m-g1-shcap.r\"/><use href=\"#cable-crunch-m-g1-upper.r\"/><use href=\"#cable-crunch-m-g1-elbowcap.r\"/><use href=\"#cable-crunch-m-g1-fore.r\"/><use href=\"#cable-crunch-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-m-g1-shcap.r\"/><use href=\"#cable-crunch-m-g1-upper.r\"/><use href=\"#cable-crunch-m-g1-elbowcap.r\"/><use href=\"#cable-crunch-m-g1-fore.r\"/><use href=\"#cable-crunch-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^54\"/><path class=\"eq-thin\" d=\"^55\"/><path class=\"eq-cable\" d=\"^56\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#cable-crunch-m-e-thigh.l\"/><use href=\"#cable-crunch-m-e-kneecap.l\"/><use href=\"#cable-crunch-m-e-shank.l\"/><use href=\"#cable-crunch-m-e-foot.l\"/><use href=\"#cable-crunch-m-e-shcap.l\"/><use href=\"#cable-crunch-m-e-upper.l\"/><use href=\"#cable-crunch-m-e-elbowcap.l\"/><use href=\"#cable-crunch-m-e-fore.l\"/><use href=\"#cable-crunch-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-m-e-thigh.l\"/><use href=\"#cable-crunch-m-e-kneecap.l\"/><use href=\"#cable-crunch-m-e-shank.l\"/><use href=\"#cable-crunch-m-e-foot.l\"/><use href=\"#cable-crunch-m-e-shcap.l\"/><use href=\"#cable-crunch-m-e-upper.l\"/><use href=\"#cable-crunch-m-e-elbowcap.l\"/><use href=\"#cable-crunch-m-e-fore.l\"/><use href=\"#cable-crunch-m-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"^57\"/><path class=\"eq-cable\" d=\"^58\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-m-e-head\"/><use href=\"#cable-crunch-m-e-torso\"/><use href=\"#cable-crunch-m-e-thigh.r\"/><use href=\"#cable-crunch-m-e-kneecap.r\"/><use href=\"#cable-crunch-m-e-shank.r\"/><use href=\"#cable-crunch-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-m-e-head\"/><use href=\"#cable-crunch-m-e-torso\"/><use href=\"#cable-crunch-m-e-thigh.r\"/><use href=\"#cable-crunch-m-e-kneecap.r\"/><use href=\"#cable-crunch-m-e-shank.r\"/><use href=\"#cable-crunch-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^59\"/><path class=\"eq-solid\" d=\"^59\"/><path class=\"eq-solid\" d=\"^60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-crunch-m-e-shcap.r\"/><use href=\"#cable-crunch-m-e-upper.r\"/><use href=\"#cable-crunch-m-e-elbowcap.r\"/><use href=\"#cable-crunch-m-e-fore.r\"/><use href=\"#cable-crunch-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-crunch-m-e-shcap.r\"/><use href=\"#cable-crunch-m-e-upper.r\"/><use href=\"#cable-crunch-m-e-elbowcap.r\"/><use href=\"#cable-crunch-m-e-fore.r\"/><use href=\"#cable-crunch-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"139.3\" cy=\"253\" r=\"2.25\"/><circle class=\"joint\" cx=\"136.91\" cy=\"296.13\" r=\"2.25\"/><circle class=\"joint\" cx=\"109.68\" cy=\"278.91\" r=\"2.25\"/><circle class=\"joint\" cx=\"131.14\" cy=\"337.84\" r=\"2.25\"/></g><mask id=\"cable-crunch-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#cable-crunch-m-m-head\" fill=\"#000\"/><use href=\"#cable-crunch-m-m-torso\" fill=\"#000\"/><use href=\"#cable-crunch-m-m-thigh.l\" fill=\"#000\"/><use href=\"#cable-crunch-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#cable-crunch-m-mf-shank.l\" fill=\"#000\"/><use href=\"#cable-crunch-m-mf-foot.l\" fill=\"#000\"/><use href=\"#cable-crunch-m-m-shcap.l\" fill=\"#000\"/><use href=\"#cable-crunch-m-m-upper.l\" fill=\"#000\"/><use href=\"#cable-crunch-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#cable-crunch-m-m-fore.l\" fill=\"#000\"/><use href=\"#cable-crunch-m-m-fist.l\" fill=\"#000\"/><use href=\"#cable-crunch-m-m-thigh.r\" fill=\"#000\"/><use href=\"#cable-crunch-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#cable-crunch-m-mf-shank.r\" fill=\"#000\"/><use href=\"#cable-crunch-m-mf-foot.r\" fill=\"#000\"/><use href=\"#cable-crunch-m-m-shcap.r\" fill=\"#000\"/><use href=\"#cable-crunch-m-m-upper.r\" fill=\"#000\"/><use href=\"#cable-crunch-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#cable-crunch-m-m-fore.r\" fill=\"#000\"/><use href=\"#cable-crunch-m-m-fist.r\" fill=\"#000\"/><use href=\"#cable-crunch-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-crunch-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#cable-crunch-m-mmask)\"><g class=\"u-stroke\"><use href=\"#cable-crunch-m-m-head\"/><use href=\"#cable-crunch-m-m-torso\"/><use href=\"#cable-crunch-m-m-thigh.l\"/><use href=\"#cable-crunch-m-m-shcap.l\"/><use href=\"#cable-crunch-m-m-upper.l\"/><use href=\"#cable-crunch-m-m-elbowcap.l\"/><use href=\"#cable-crunch-m-m-fore.l\"/><use href=\"#cable-crunch-m-m-fist.l\"/><use href=\"#cable-crunch-m-m-thigh.r\"/><use href=\"#cable-crunch-m-m-shcap.r\"/><use href=\"#cable-crunch-m-m-upper.r\"/><use href=\"#cable-crunch-m-m-elbowcap.r\"/><use href=\"#cable-crunch-m-m-fore.r\"/><use href=\"#cable-crunch-m-m-fist.r\"/><use href=\"#cable-crunch-m-m-eq0\"/><use href=\"#cable-crunch-m-m-eq1\"/><use href=\"#cable-crunch-m-m-eq2\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MPJeDB.1LGF4SU2MHbztLGbAtLNH1Iq\"/><path class=\"m-line\" d=\"~MJVX1DU9L.NfPzD1\"/><path class=\"leader m\" d=\"M73.51 288.98L60.4 285H50.4\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"cable-crunch-m-hips\" data-key=\"hips\" data-cue=\"The hips move back to pull while the spine stays straight.\" class=\"plate-callout two m\" style=\"left:2.23%;top:73.46%\" aria-pressed=\"true\">Hips<br>move</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "hips",
        cues: [{ key: "hips", cue: "Keep the hips still and raised while only the spine bends." }, { key: "curl", cue: "Curl your spine so the elbows move toward your thighs." }, { key: "rope", cue: "Hands hold the rope by your head, and the arms don't yank." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "hips",
        cues: [{ key: "hips", cue: "The hips move back to pull while the spine stays straight." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Hips move</b><span>The hips move back to pull while the spine stays straight.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: crunch 2 seconds, hold 1 second, return 3 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Crunch</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:3 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>3 s</span></div></div></div>",
      alt: "Side view of a cable crunch: kneeling before a cable column with the rope held beside the head, the lifter curls the spine until the elbows are near the thighs while the hips stay still and raised.",
      mistakeAlt: "Cable Crunch: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP (b3): the card archetype.hand is on-body with no thumb or wrist given; its handContact and grip claim (c2) are on setup step 3, its rope zoom Wrong (c2, c9) as a fault on the mistake line and setup step 3."
  },
  contacts: [
    "floor-body"
  ],
  setup: [
    {
      "kind": "load",
      "text": "Fix a rope to the high pulley. Choose a light-to-moderate weight.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cablecrunch",
          "motra-cablecrunch",
          "bb-cablecrunch"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "position",
      "text": "Kneel a few feet from the machine, facing it, stance about hip-to-shoulder-width.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cablecrunch",
          "motra-cablecrunch",
          "bb-cablecrunch"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "grip",
      "text": "Hold rope ends either side of your head. Yanking? Arms only hold.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-cablecrunch",
          "sl-cablecrunch",
          "motra-cablecrunch"
        ],
        "note": "card c2, c9"
      }
    },
    {
      "kind": "position",
      "text": "Hinge back slightly from your hips to raise them. Tuck your chin.",
      "zoom": "hips",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-cablecrunch"
        ],
        "note": "card c3"
      }
    },
    {
      "kind": "brace",
      "text": "Brace, breathe out and curl. Breathe in, straighten slowly, abs tense.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-cablecrunch",
          "sl-cablecrunch",
          "motra-cablecrunch"
        ],
        "note": "card c4, c7, c6"
      }
    }
  ],
  posture: [
    {
      "key": "curl",
      "label": "Curl the spine",
      "detail": "Brace, breathe out and curl your spine.",
      "anchor": {
        "pose": "end",
        "at": "sacrum"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-cablecrunch",
          "sl-cablecrunch",
          "motra-cablecrunch"
        ],
        "note": "card c4, c7"
      }
    },
    {
      "key": "elbows",
      "label": "Elbows to thighs",
      "detail": "Elbows move toward your thighs.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-cablecrunch"
        ],
        "note": "card c5"
      }
    },
    {
      "key": "hips",
      "label": "Hips still",
      "detail": "Hips stay still and raised. Don't move them to pull: only your spine bends.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "zoom": "hips",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-cablecrunch",
          "motra-cablecrunch"
        ],
        "note": "card c8, c3"
      }
    },
    {
      "key": "chin",
      "label": "Chin tucked",
      "detail": "Chin stays tucked.",
      "anchor": {
        "pose": "end",
        "at": "chin"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-cablecrunch"
        ],
        "note": "card c12"
      }
    },
    {
      "key": "return",
      "label": "Slow return",
      "detail": "Breathe in and straighten slowly. Keep tension on your abs.",
      "anchor": {
        "pose": "start",
        "at": "backMid"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-cablecrunch",
          "sl-cablecrunch",
          "motra-cablecrunch"
        ],
        "note": "card c6, c7"
      }
    },
    {
      "key": "arms",
      "label": "Arms hold",
      "detail": "No yanking the rope down with your arms. Arms only hold the rope. Move with your abs.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-cablecrunch",
          "bb-cablecrunch"
        ],
        "note": "card c9, c11, c2"
      }
    },
    {
      "key": "round",
      "label": "Lower back",
      "detail": "Stop at elbows near thighs, without rounding your lower back excessively.",
      "anchor": {
        "pose": "end",
        "at": "lumbar"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "motra-cablecrunch"
        ],
        "note": "card c13, c5"
      }
    }
  ],
  zooms: [
    {
      "key": "hips",
      "chip": "Hips",
      "heading": "Hips still",
      "kind": "posture",
      "feelRow": "hips"
    }
  ],
  chips: [
    "hips",
    "feel"
  ],
  copy: {
    "setupLine": "Brace, breathe out and curl your spine. Breathe in and straighten slowly, keeping tension on your abs.",
    "mistakeLine": "Hips moving to pull, or arms yanking the rope down? Keep your hips still and move with your abs.",
    "cueLine": "Only your spine bends."
  },
  mistakes: [],
  risks: [
    {
      "key": "neck",
      "text": "Keep the movement controlled to avoid neck strain.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-cablecrunch"
        ],
        "note": "card c12"
      }
    },
    {
      "key": "acute",
      "text": "Acute lower back pain? Avoid this exercise.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "motra-cablecrunch"
        ],
        "note": "card c13"
      }
    },
    {
      "key": "load",
      "text": "Too much weight risks overloading your traps, arms and back instead of your abs.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-cablecrunch",
          "motra-cablecrunch"
        ],
        "note": "card c11"
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
    "bb-cablecrunch",
    "motra-cablecrunch",
    "sl-cablecrunch",
    "fv-cablecrunch",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/cable_crunch.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

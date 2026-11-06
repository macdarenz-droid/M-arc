// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=7859a4ec9ffc764fd478e9d84a984d7a50c18bde748522ebd4ec110cb3b5d79a
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_romanian_deadlift",
  name: "Romanian Deadlift",
  hashes: { inputsSha256: "7859a4ec9ffc764fd478e9d84a984d7a50c18bde748522ebd4ec110cb3b5d79a", golden: "044db99b0b5d6f805b89e489ed2443a9bd0fea805b62d832a2d90c43a1cb4bf0" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"romanian-deadlift-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"romanian-deadlift-n-st-head\" d=\"~#w12YOA1!OhOxz1.Xg)n_czlW3-9I6K4W3E2)8K4zdIaOqJ8-aD1V9IiR5WoE4HncwjA9Wd_kx7wi0000100022000000000200000100020020001000000000000020000001000221\"/><path id=\"romanian-deadlift-n-st-torso\" d=\"~#_12YVx1JTlIJy1XGkI7.8)2ty4SjH7(8U7yjA6_1q-ozjzeRdsUg0_l1wq-8wmXbJ7-7)2Th.fRG1-2Etz6.1B9-2U7yjoS8*9IbVhw3xcyiD4w8Sf)6mS8.Y2P602000200000001000000000000000000200020100000001000002020000002000002000021010001212100000111100120000002000000000000\"/><path id=\"romanian-deadlift-n-st-thigh.r\" d=\"~#F12PHr(NF1I*qTxE1B4zbB16(fY!1H4-8!1K4z8RU1P7)ox4XjVgxkzdRT1O3E3K7O6D9A(1F17j.b.w1G5IdJJ1F7Fz1UtUz100000000010002220001010101000000020010100010000000000000200000200011000000000120\"/><path id=\"romanian-deadlift-n-st-kneecap.r\" d=\"~~NXuN)T1_J10\"/><path id=\"romanian-deadlift-n-st-shank.r\" d=\"~#F12!VuW!T1K!uXKS1S2VbD12A1D)1N6R7w3X36xz2D8Bdk*bK6)dW7Vy2O2x4O5E8T8U(1B13B1.bKd(aVe_nE1WlWbNp00200000000000010000200000002000120200101010000000100200000000000020000020000000\"/><path id=\"romanian-deadlift-n-st-foot.r\" d=\"~#o2DPuAB)1XxvzB(1YcF3Shx8Pp)nF-2B3OJ2-4ED1)7.n2KG1Y4Bb-cWsBbGmSp220022010100000101000000000220000101101000010100\"/><path id=\"romanian-deadlift-n-st-shcap.r\" d=\"~~wzw1AyrwP10\"/><path id=\"romanian-deadlift-n-st-upper.r\" d=\"~#F12Azw1y)qIDw1O.py1.8a0jWO1P3-5U1-2F8)B1AbziA1Ig.8IjE3XD1G1x3X2z6I5HO1b04.8xgB2GfUoK1NmycJq10000001000001010000020000001100200100002000000020200010020200012000100000020010\"/><path id=\"romanian-deadlift-n-st-elbowcap.r\" d=\"~~!!v(HA1Dz10\"/><path id=\"romanian-deadlift-n-st-fore.r\" d=\"~#F12J.vDKA1V!vxRz1A1Gaq_1A6AI1w3O9P1K2R1)w1w6zdjEbT7EcI2)w1-1B2z4B9pWI1l_1G2zazagG9Akw1FhYb!i00000010000000002200010000001000000002002100001101000010010000020000000200000011\"/><path id=\"romanian-deadlift-n-st-fist.r\" d=\"~~wTw1NzN1ww10\"/><path id=\"romanian-deadlift-n-g0-head\" d=\"~#w12ABF1HSkK)D1INjOqW5IlO2V7V8E5D2cE9l-dO2Gs(az8(3*8zgOa!o!2Hm_6WfweJ7!n-bFf0000200110000021002002001000000000000000000220002100100000000200\"/><path id=\"romanian-deadlift-n-g0-torso\" d=\"~#_12yHA1UXnIIB1*VmR4RaV2-1R1wkS4Uay2JkA5P3y8Gn-dEiIdX2AgH4ylN5Pr-1DoX5A9T5S1.hT4BJ1Y4)sB6G2B7x3N3DiV1P8I6Xd-h)1Vgwe(1_8_gI2V1J8EX2Ki02000001011010121000001000101000002000010101012000101012000000000000000001010100000000001010000000200000101000100200\"/><path id=\"romanian-deadlift-n-g0-thigh.r\" d=\"~#F12(Bp_wG1xUoBVE1I5Taz1eJmU_1F3G9N1O4VdKT1Y4Rpz6GjViBiRiXR1-3)2x8R5WfY!1F1b.1XbGx1-1O8UK1!aFy1Jx1Fw110000220000001011000021010020000002100001001000000101120000010100000100000012000\"/><path id=\"romanian-deadlift-n-g0-kneecap.r\" d=\"~~F-t_(T1_J10\"/><path id=\"romanian-deadlift-n-g0-shank.r\" d=\"~#F12UXtU)T1R_tGPS1U1.bF10(5!(1_5)7W2*3.4*y2y7Xd5*bT7RdW2*y2.2*3z6-7X3A)1E10)1-bTc(b-c(oaWlYdNo00000100001011000010002000000000000101220010011101000000000000000000000010002020\"/><path id=\"romanian-deadlift-n-g0-foot.r\" d=\"~#o2DPuAB)1XxvzB(1_cF3Nhx8Sp)nH-2B3RJ2-4ED1)7*n2IG1Y4Bb-cWsBbGmSp020002110100000120000000000200000101001010010100\"/><path id=\"romanian-deadlift-n-g0-shcap.r\" d=\"~~_Dx1W(swP10\"/><path id=\"romanian-deadlift-n-g0-upper.r\" d=\"~#F12DEx1YYsRJx1KVrU1-882K3SO1_3R5_1X2NaOB1HcIhy2GgV7-jv*D1vz3O2G6B8(N170i.8*fz3VgWn-2FmNayr00200000000000110101000000000120000101001100211101000020000010010020000011100000\"/><path id=\"romanian-deadlift-n-g0-elbowcap.r\" d=\"~~(Nw1(BD1Dz10\"/><path id=\"romanian-deadlift-n-g0-fore.r\" d=\"~#F12SKw1PxD1.Tw1)BB1!2xaiw2X1PI1W4-8_1z2N4Xw1H8-bJ1zbE5RdN3-w1E1K2K2X9V8WH1t_1fKa)9I1.cAi)1Dhy8Uk20000000220000200000000000000220000100111000201010000000200101002010012200000102\"/><path id=\"romanian-deadlift-n-g0-fist.r\" d=\"~~SJvW!O1ww10\"/><path id=\"romanian-deadlift-n-g1-head\" d=\"~#w12Y*I1WDrxFI1GXpXqT4*iBa-3*a-54_3O8P4)cA8GrHdO3!6-6zbVfAm!bDiSeH9!i)1!oRg_90001001010000010000002000001012100001010002200000010120000000000\"/><path id=\"romanian-deadlift-n-g1-torso\" d=\"~#_12!BE1AXsGRF1BAs9Rb-1T2.8wi8SbT5WjF3w5PgxiV5xlRbG7WdS9_hNcPqW7Yo!2Naz2U7zg!aEI1NeRpI6E3O5T2vAgT4D7r)eXfO8Vk_6R1!8Sgw4X4F7xH2OR100000001001002100000212100012100000101010100100021210010100002000000100200000000000100000200000012101010120002020000\"/><path id=\"romanian-deadlift-n-g1-thigh.r\" d=\"~#F12UYmA!G1-xm.SF1K6*9B1gwtWX1F2R9sX4TjKR1_1)pI8IiXk*fBoEO1z4K2V8V4WmP_1A1fz3KbIx1A2x3FN1!eYw1YA1Ds00010000001002000000000101000200001101000000010111100000000220000020000220000001\"/><path id=\"romanian-deadlift-n-g1-kneecap.r\" d=\"~~PTsHxU1_J10\"/><path id=\"romanian-deadlift-n-g1-shank.r\" d=\"~#F12DSsSDU1RPsEXS1e.bF15wcy(1w5O8H2E4Gbzy2W5GeG1*b-8Xc.3*y2B3R3-6B7H2A)1E16B3RbIbydIawqP2Ul(fwn00020000002000000000001010101000000100000012100000000000100011000101000000000001\"/><path id=\"romanian-deadlift-n-g1-foot.r\" d=\"~#o2DPuAB)1XxvzB(1_cF3Phx8Pp)nH-2B3RJ2-4GD1)7-n2OG1Y4zb-cWsBbGmSp020002010100000100100000000220000121000010111110\"/><path id=\"romanian-deadlift-n-g1-shcap.r\" d=\"~~HFy1F)w1wP10\"/><path id=\"romanian-deadlift-n-g1-upper.r\" d=\"~#F12HGy1PVw1ORy1XSvH2T882G7AO1H4E5w2R2PdRA1SdEgN3Bgz6IkF2-D1rE3.1K6*bAN1b1J1-8TfI4TiFmR4(lF8!r01000000000000000000002000000001210000200210000002000010000000000000010101000201\"/><path id=\"romanian-deadlift-n-g1-elbowcap.r\" d=\"~~YYw1SyH1Dz10\"/><path id=\"romanian-deadlift-n-g1-fore.r\" d=\"~#F12!Xw1F.G1Kwx1KwG1Y3T9e!1G5JI1H5O8y2)1y7Bw1F9BbD2)ax4.dy6Iw1x1T2T1*9zc(G1x1W1cKa*9B2EeyhI3(gJ6Fl00002200011012111001000000010110100000021000000001000200200000011110000020000101\"/><path id=\"romanian-deadlift-n-g1-fist.r\" d=\"~~J*uHVT1ww10\"/><path id=\"romanian-deadlift-n-e-thigh.l\" d=\"~#F12UxkS(H1*DjTXG1K7I9x1mDy1UU1J1-9cX4GoGO1lxqxaOhBm-dTs-J1I4)1x9-3FsyY1w1jB4xb)w1F5J1NN1(hAvHE1No02101100000200200000100000002000001011010100000000010111002000001000200000111100\"/><path id=\"romanian-deadlift-n-e-kneecap.l\" d=\"~~U_qyJU1_J10\"/><path id=\"romanian-deadlift-n-e-shank.l\" d=\"~#F12U_qwYU1zSqIGT1E1.bF1b!kU.1Y3z9U1R4.kV)1S3zfx3ObRaGbVdVx2V3x3X7x6Pby(1B1a-4.aI9PeI6JrP5!kFjPk10000001000010001001010000010020020101001010100001000100000000000120021000002210\"/><path id=\"romanian-deadlift-n-e-foot.l\" d=\"~#o2APuAB)1TxvzB(1_cF3Nhx8Pp)nF-2B3OJ2-4ED1)7*n2IG1Y4Eb-cWsBbEmSp020002111100000101002020000200000101100000012100\"/><path id=\"romanian-deadlift-n-e-shcap.l\" d=\"~~NYx1ASE1wP10\"/><path id=\"romanian-deadlift-n-e-upper.l\" d=\"~#F12_-x1_DE1Bzy1IAD1U2R884.8_N1N4z5A2K2WezA1AeXf(3xgI5RkS3VD1pG3T1K6OdUK1b1W1-8Kf-4KjSlE5_lH7ys10000000120001001110000001000201210020020000100220010000010100200001110100010011\"/><path id=\"romanian-deadlift-n-e-elbowcap.l\" d=\"~~y)vDTP1Dz10\"/><path id=\"romanian-deadlift-n-e-fore.l\" d=\"~#F12W*vwOP1-zw1OTO1_2)9i!1O1UI1U4.8_1z2F4Xw1F8*bH1zbK5OdJ3-w1I1O2K2V9I8YH1v_1hKa)9G1XcFi*1yhF8Yk00001001001200000200000000000000020010002200000000200000101111010001100101002201\"/><path id=\"romanian-deadlift-n-e-fist.l\" d=\"~~U(uDH_1ww10\"/><path id=\"romanian-deadlift-n-e-head\" d=\"~#w12NBK1PDD1*EK1KSA1VlKgzcXhW1KbE5T2H7X5waO9_jOkHdy3F9*2R2)iAeUkN9JlbwlEdDlEjy10000000000020011000000010001100010110000010000000000101100020002\"/><path id=\"romanian-deadlift-n-e-torso\" d=\"~#_12HFF1WIB1RXG1.NB1w5IadB3zg!b)4Naze!ecW5(mV7W4)jE7VbF8Se!a_iSkHiylHdNaP2_dIbHsGy1wo)gG6G5z5V1I4ydR7F4F6-dzaVeOlO3O5A7!cFbK7D4zI1)K200000000000120020000001000101000001101000000000002000000011110000011001010002021010001012000020210010000222101020000\"/><path id=\"romanian-deadlift-n-e-thigh.r\" d=\"^33\"/><path id=\"romanian-deadlift-n-e-kneecap.r\" d=\"^34\"/><path id=\"romanian-deadlift-n-e-shank.r\" d=\"^35\"/><path id=\"romanian-deadlift-n-e-foot.r\" d=\"^36\"/><path id=\"romanian-deadlift-n-e-shcap.r\" d=\"^37\"/><path id=\"romanian-deadlift-n-e-upper.r\" d=\"^38\"/><path id=\"romanian-deadlift-n-e-elbowcap.r\" d=\"^39\"/><path id=\"romanian-deadlift-n-e-fore.r\" d=\"^40\"/><path id=\"romanian-deadlift-n-e-fist.r\" d=\"^41\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#romanian-deadlift-n-dots)\"/>\n  <path class=\"floorline\" d=\"M62.29 339.5H281.71\"/><path class=\"arc measure\" d=\"M144.55 268.17L135.58 252.56A18 18 0 0 0 149.19 285.56Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-n-st-head\"/><use href=\"#romanian-deadlift-n-st-torso\"/><use href=\"#romanian-deadlift-n-st-thigh.r\"/><use href=\"#romanian-deadlift-n-st-kneecap.r\"/><use href=\"#romanian-deadlift-n-st-shank.r\"/><use href=\"#romanian-deadlift-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-n-st-head\"/><use href=\"#romanian-deadlift-n-st-torso\"/><use href=\"#romanian-deadlift-n-st-thigh.r\"/><use href=\"#romanian-deadlift-n-st-kneecap.r\"/><use href=\"#romanian-deadlift-n-st-shank.r\"/><use href=\"#romanian-deadlift-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-n-st-shcap.r\"/><use href=\"#romanian-deadlift-n-st-upper.r\"/><use href=\"#romanian-deadlift-n-st-elbowcap.r\"/><use href=\"#romanian-deadlift-n-st-fore.r\"/><use href=\"#romanian-deadlift-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-n-st-shcap.r\"/><use href=\"#romanian-deadlift-n-st-upper.r\"/><use href=\"#romanian-deadlift-n-st-elbowcap.r\"/><use href=\"#romanian-deadlift-n-st-fore.r\"/><use href=\"#romanian-deadlift-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-n-g0-head\"/><use href=\"#romanian-deadlift-n-g0-torso\"/><use href=\"#romanian-deadlift-n-g0-thigh.r\"/><use href=\"#romanian-deadlift-n-g0-kneecap.r\"/><use href=\"#romanian-deadlift-n-g0-shank.r\"/><use href=\"#romanian-deadlift-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-n-g0-head\"/><use href=\"#romanian-deadlift-n-g0-torso\"/><use href=\"#romanian-deadlift-n-g0-thigh.r\"/><use href=\"#romanian-deadlift-n-g0-kneecap.r\"/><use href=\"#romanian-deadlift-n-g0-shank.r\"/><use href=\"#romanian-deadlift-n-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-n-g0-shcap.r\"/><use href=\"#romanian-deadlift-n-g0-upper.r\"/><use href=\"#romanian-deadlift-n-g0-elbowcap.r\"/><use href=\"#romanian-deadlift-n-g0-fore.r\"/><use href=\"#romanian-deadlift-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-n-g0-shcap.r\"/><use href=\"#romanian-deadlift-n-g0-upper.r\"/><use href=\"#romanian-deadlift-n-g0-elbowcap.r\"/><use href=\"#romanian-deadlift-n-g0-fore.r\"/><use href=\"#romanian-deadlift-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-n-g1-head\"/><use href=\"#romanian-deadlift-n-g1-torso\"/><use href=\"#romanian-deadlift-n-g1-thigh.r\"/><use href=\"#romanian-deadlift-n-g1-kneecap.r\"/><use href=\"#romanian-deadlift-n-g1-shank.r\"/><use href=\"#romanian-deadlift-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-n-g1-head\"/><use href=\"#romanian-deadlift-n-g1-torso\"/><use href=\"#romanian-deadlift-n-g1-thigh.r\"/><use href=\"#romanian-deadlift-n-g1-kneecap.r\"/><use href=\"#romanian-deadlift-n-g1-shank.r\"/><use href=\"#romanian-deadlift-n-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-n-g1-shcap.r\"/><use href=\"#romanian-deadlift-n-g1-upper.r\"/><use href=\"#romanian-deadlift-n-g1-elbowcap.r\"/><use href=\"#romanian-deadlift-n-g1-fore.r\"/><use href=\"#romanian-deadlift-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-n-g1-shcap.r\"/><use href=\"#romanian-deadlift-n-g1-upper.r\"/><use href=\"#romanian-deadlift-n-g1-elbowcap.r\"/><use href=\"#romanian-deadlift-n-g1-fore.r\"/><use href=\"#romanian-deadlift-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-n-e-thigh.l\"/><use href=\"#romanian-deadlift-n-e-kneecap.l\"/><use href=\"#romanian-deadlift-n-e-shank.l\"/><use href=\"#romanian-deadlift-n-e-foot.l\"/><use href=\"#romanian-deadlift-n-e-shcap.l\"/><use href=\"#romanian-deadlift-n-e-upper.l\"/><use href=\"#romanian-deadlift-n-e-elbowcap.l\"/><use href=\"#romanian-deadlift-n-e-fore.l\"/><use href=\"#romanian-deadlift-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-n-e-thigh.l\"/><use href=\"#romanian-deadlift-n-e-kneecap.l\"/><use href=\"#romanian-deadlift-n-e-shank.l\"/><use href=\"#romanian-deadlift-n-e-foot.l\"/><use href=\"#romanian-deadlift-n-e-shcap.l\"/><use href=\"#romanian-deadlift-n-e-upper.l\"/><use href=\"#romanian-deadlift-n-e-elbowcap.l\"/><use href=\"#romanian-deadlift-n-e-fore.l\"/><use href=\"#romanian-deadlift-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-n-e-head\"/><use href=\"#romanian-deadlift-n-e-torso\"/><use href=\"#romanian-deadlift-n-e-thigh.r\"/><use href=\"#romanian-deadlift-n-e-kneecap.r\"/><use href=\"#romanian-deadlift-n-e-shank.r\"/><use href=\"#romanian-deadlift-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-n-e-head\"/><use href=\"#romanian-deadlift-n-e-torso\"/><use href=\"#romanian-deadlift-n-e-thigh.r\"/><use href=\"#romanian-deadlift-n-e-kneecap.r\"/><use href=\"#romanian-deadlift-n-e-shank.r\"/><use href=\"#romanian-deadlift-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-n-e-shcap.r\"/><use href=\"#romanian-deadlift-n-e-upper.r\"/><use href=\"#romanian-deadlift-n-e-elbowcap.r\"/><use href=\"#romanian-deadlift-n-e-fore.r\"/><use href=\"#romanian-deadlift-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-n-e-shcap.r\"/><use href=\"#romanian-deadlift-n-e-upper.r\"/><use href=\"#romanian-deadlift-n-e-elbowcap.r\"/><use href=\"#romanian-deadlift-n-e-fore.r\"/><use href=\"#romanian-deadlift-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~#o2N(w1!K_1RAx1O(-1-6x5K3.7uO8A5*6!7I3(q-!1IiDy2w6P7z1U9R7w6w3UA2000120000000000120000020012000010000101000002101\"/><path class=\"eq-line\" d=\"~~(PpDH_1WK62\"/><path class=\"eq-thin\" d=\"~~(VqDH_1WF50\"/><path class=\"eq-solid\" d=\"~~YEvDH_1!m1\"/><path class=\"eq-pin\" d=\"~~JYvDH_1F60\"/><path class=\"eq-cable m-line\" d=\"~M!Gy1NzN1LX1X8LB3J1LO2J2LG1F3L0P3LH1F3LP2J2LD3J1LP30LD3G1LP2O2LH1B3L0O3LG1B3LO2O2LB3G1\"/><circle class=\"joint\" cx=\"180.55\" cy=\"202.58\" r=\"2.25\"/><circle class=\"joint\" cx=\"169.32\" cy=\"248.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"113.31\" cy=\"213.81\" r=\"2.25\"/><circle class=\"joint\" cx=\"144.55\" cy=\"268.17\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#W10wOw1SYO1KRw1KUO1021402020214054jw3w76t1a081a1a161a08163a061a1408360804100000021000002101200010121000200000000000000000001010100001011000012001010010002000000001200010000020200000\"/><path class=\"arrow\" d=\"~Mw)vA.Y1LTiRB1LAY1WB1Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M135.58 252.56A18 18 0 0 0 149.19 285.56\"/><g class=\"arc-ticks\"><path d=\"~M_.qDwS1L)rXP1\"/><path d=\"~Mw(sUwX1LPeHW1\"/></g><path class=\"leader\" d=\"~M!ToW.V1LGG2*W1\"/></g></g><path class=\"leader\" d=\"M106.77 194.3L97.8 198H87.8\"/><circle class=\"anchor\" cx=\"106.77\" cy=\"194.3\" r=\"1.5\"/><path class=\"leader\" d=\"~MU(vDH_1LUy8S2\"/><circle class=\"anchor\" cx=\"163.62\" cy=\"298.59\" r=\"1.5\"/><path class=\"leader\" d=\"M165.36 186.06L141.41 148H131.41\"/><circle class=\"anchor\" cx=\"165.36\" cy=\"186.06\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"romanian-deadlift-n-hips\" data-key=\"hips\" data-cue=\"Move your hips back to lower the bar and keep the slight knee bend fixed.\" class=\"plate-callout\" style=\"left:4.47%;top:49.16%\" aria-pressed=\"true\">Hips back</button><button type=\"button\" id=\"romanian-deadlift-n-bar\" data-key=\"bar\" data-cue=\"Keep the bar very close to your legs all the way down and up.\" class=\"plate-callout\" style=\"left:55.87%;top:77.37%\" aria-pressed=\"false\">Bar close</button><button type=\"button\" id=\"romanian-deadlift-n-back\" data-key=\"back\" data-cue=\"Keep your back neutral and stop lowering where it would start to round.\" class=\"plate-callout\" style=\"left:15.92%;top:35.2%\" aria-pressed=\"false\">Flat back</button><span class=\"plate-arc-label\" style=\"left:6.15%;top:72.63%\"><b>Knee</b><span>about 15° bend</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"romanian-deadlift-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"romanian-deadlift-m-st-head\" d=\"^0\"/><path id=\"romanian-deadlift-m-st-torso\" d=\"^1\"/><path id=\"romanian-deadlift-m-st-thigh.r\" d=\"^2\"/><path id=\"romanian-deadlift-m-st-kneecap.r\" d=\"^3\"/><path id=\"romanian-deadlift-m-st-shank.r\" d=\"^4\"/><path id=\"romanian-deadlift-m-st-foot.r\" d=\"^5\"/><path id=\"romanian-deadlift-m-st-shcap.r\" d=\"^6\"/><path id=\"romanian-deadlift-m-st-upper.r\" d=\"^7\"/><path id=\"romanian-deadlift-m-st-elbowcap.r\" d=\"^8\"/><path id=\"romanian-deadlift-m-st-fore.r\" d=\"^9\"/><path id=\"romanian-deadlift-m-st-fist.r\" d=\"^10\"/><path id=\"romanian-deadlift-m-g0-head\" d=\"^11\"/><path id=\"romanian-deadlift-m-g0-torso\" d=\"^12\"/><path id=\"romanian-deadlift-m-g0-thigh.r\" d=\"^13\"/><path id=\"romanian-deadlift-m-g0-kneecap.r\" d=\"^14\"/><path id=\"romanian-deadlift-m-g0-shank.r\" d=\"^15\"/><path id=\"romanian-deadlift-m-g0-foot.r\" d=\"^16\"/><path id=\"romanian-deadlift-m-g0-shcap.r\" d=\"^17\"/><path id=\"romanian-deadlift-m-g0-upper.r\" d=\"^18\"/><path id=\"romanian-deadlift-m-g0-elbowcap.r\" d=\"^19\"/><path id=\"romanian-deadlift-m-g0-fore.r\" d=\"^20\"/><path id=\"romanian-deadlift-m-g0-fist.r\" d=\"^21\"/><path id=\"romanian-deadlift-m-g1-head\" d=\"^22\"/><path id=\"romanian-deadlift-m-g1-torso\" d=\"^23\"/><path id=\"romanian-deadlift-m-g1-thigh.r\" d=\"^24\"/><path id=\"romanian-deadlift-m-g1-kneecap.r\" d=\"^25\"/><path id=\"romanian-deadlift-m-g1-shank.r\" d=\"^26\"/><path id=\"romanian-deadlift-m-g1-foot.r\" d=\"^27\"/><path id=\"romanian-deadlift-m-g1-shcap.r\" d=\"^28\"/><path id=\"romanian-deadlift-m-g1-upper.r\" d=\"^29\"/><path id=\"romanian-deadlift-m-g1-elbowcap.r\" d=\"^30\"/><path id=\"romanian-deadlift-m-g1-fore.r\" d=\"^31\"/><path id=\"romanian-deadlift-m-g1-fist.r\" d=\"^32\"/><path id=\"romanian-deadlift-m-e-thigh.l\" d=\"^33\"/><path id=\"romanian-deadlift-m-e-kneecap.l\" d=\"^34\"/><path id=\"romanian-deadlift-m-e-shank.l\" d=\"^35\"/><path id=\"romanian-deadlift-m-e-foot.l\" d=\"^36\"/><path id=\"romanian-deadlift-m-e-shcap.l\" d=\"^37\"/><path id=\"romanian-deadlift-m-e-upper.l\" d=\"^38\"/><path id=\"romanian-deadlift-m-e-elbowcap.l\" d=\"^39\"/><path id=\"romanian-deadlift-m-e-fore.l\" d=\"^40\"/><path id=\"romanian-deadlift-m-e-fist.l\" d=\"^41\"/><path id=\"romanian-deadlift-m-e-head\" d=\"^42\"/><path id=\"romanian-deadlift-m-e-torso\" d=\"^43\"/><path id=\"romanian-deadlift-m-e-thigh.r\" d=\"^33\"/><path id=\"romanian-deadlift-m-e-kneecap.r\" d=\"^34\"/><path id=\"romanian-deadlift-m-e-shank.r\" d=\"^35\"/><path id=\"romanian-deadlift-m-e-foot.r\" d=\"^36\"/><path id=\"romanian-deadlift-m-e-shcap.r\" d=\"^37\"/><path id=\"romanian-deadlift-m-e-upper.r\" d=\"^38\"/><path id=\"romanian-deadlift-m-e-elbowcap.r\" d=\"^39\"/><path id=\"romanian-deadlift-m-e-fore.r\" d=\"^40\"/><path id=\"romanian-deadlift-m-e-fist.r\" d=\"^41\"/><path id=\"romanian-deadlift-m-m-head\" d=\"~#w12UPH1NDH1zyI1KVF1)f*lK6Kk(4RaE4*3U8O3Jcz6!o.d!b_6Y93w3*iS7!nY2DnK6(jXiPg-iR40100000200000001010001200000000200000100100000100011010220100020\"/><path id=\"romanian-deadlift-m-m-torso\" d=\"~#_12AyD1y)E1KNE1-OF1_7O8iB3*iY6.7N8XhAaT6mNr_g(cSbI9-8JeN8!i(a(qS5!ouHa)2F6-gJ7-I1HcVqVT1U9zsWF2_J2TiI8(1!9IbI5zhOjO9I7F5y9JeI8(1OiBX200101000010010100101200000020010000010000000000010000000000101002000000100000000000000100001000002100001002000000002\"/><path id=\"romanian-deadlift-m-m-shcap.l\" d=\"~~UAvyUF1wP10\"/><path id=\"romanian-deadlift-m-m-upper.l\" d=\"~#F12YAvwRF1*EvKKE1w1.8a0lUO1S3V5W1.2A8xD1Fb)hw1KgX8IjI3XD1B1x3.2z6G5HO1b06*8Bgx2EfSoK1NmycJq11001011001100000200020010020010002100110000001000000000022000000000200000000000\"/><path id=\"romanian-deadlift-m-m-elbowcap.l\" d=\"~~P(u!!R1Dz10\"/><path id=\"romanian-deadlift-m-m-fore.l\" d=\"~#F12w*uA)R1G(u)yR1A1Gaq_1D6AI1(2O9N1K2O1)w1y6zdlEbT7GcK2.w1X1G2z4x9pSI1l(1G2BazagG9Aky1FhUb!i00000000002001000201010000000000000002020000001000000002000000000000000200000101\"/><path id=\"romanian-deadlift-m-m-fist.l\" d=\"~~UUvJV.1ww10\"/><path id=\"romanian-deadlift-m-m-shcap.r\" d=\"^63\"/><path id=\"romanian-deadlift-m-m-upper.r\" d=\"^64\"/><path id=\"romanian-deadlift-m-m-elbowcap.r\" d=\"^65\"/><path id=\"romanian-deadlift-m-m-fore.r\" d=\"^66\"/><path id=\"romanian-deadlift-m-m-fist.r\" d=\"^67\"/><path id=\"romanian-deadlift-m-m-eq0\" d=\"~#o2SUx1NT.1.Xx1Bz.1T7.3-4z7dR8Y3V7D7V4wgRw2V6HA2H7N6gU9I6D7_eyz2202100001000000010020020001110012000000120010000\"/><path id=\"romanian-deadlift-m-m-eq1\" d=\"~~_*vJV.1!m1\"/><path id=\"romanian-deadlift-m-m-eq2\" d=\"~~JNw1JV.1F60\"/><path id=\"romanian-deadlift-m-m-eq3\" d=\"~~(DqJV.1WK62\"/><path id=\"romanian-deadlift-m-m-eq4\" d=\"^70\"/><path id=\"romanian-deadlift-m-mf-thigh.l\" d=\"^33\"/><path id=\"romanian-deadlift-m-mf-kneecap.l\" d=\"^34\"/><path id=\"romanian-deadlift-m-mf-shank.l\" d=\"^35\"/><path id=\"romanian-deadlift-m-mf-foot.l\" d=\"^36\"/><path id=\"romanian-deadlift-m-mf-thigh.r\" d=\"^33\"/><path id=\"romanian-deadlift-m-mf-kneecap.r\" d=\"^34\"/><path id=\"romanian-deadlift-m-mf-shank.r\" d=\"^35\"/><path id=\"romanian-deadlift-m-mf-foot.r\" d=\"^36\"/><path id=\"romanian-deadlift-m-mo-0\" d=\"^42\"/><path id=\"romanian-deadlift-m-mo-1\" d=\"^43\"/><path id=\"romanian-deadlift-m-mo-2\" d=\"^33\"/><path id=\"romanian-deadlift-m-mo-3\" d=\"^34\"/><path id=\"romanian-deadlift-m-mo-4\" d=\"^35\"/><path id=\"romanian-deadlift-m-mo-5\" d=\"^36\"/><path id=\"romanian-deadlift-m-mo-6\" d=\"^37\"/><path id=\"romanian-deadlift-m-mo-7\" d=\"^38\"/><path id=\"romanian-deadlift-m-mo-8\" d=\"^39\"/><path id=\"romanian-deadlift-m-mo-9\" d=\"^40\"/><path id=\"romanian-deadlift-m-mo-10\" d=\"^41\"/><path id=\"romanian-deadlift-m-mo-11\" d=\"^33\"/><path id=\"romanian-deadlift-m-mo-12\" d=\"^34\"/><path id=\"romanian-deadlift-m-mo-13\" d=\"^35\"/><path id=\"romanian-deadlift-m-mo-14\" d=\"^36\"/><path id=\"romanian-deadlift-m-mo-15\" d=\"^37\"/><path id=\"romanian-deadlift-m-mo-16\" d=\"^38\"/><path id=\"romanian-deadlift-m-mo-17\" d=\"^39\"/><path id=\"romanian-deadlift-m-mo-18\" d=\"^40\"/><path id=\"romanian-deadlift-m-mo-19\" d=\"^41\"/><path id=\"romanian-deadlift-m-mo-20\" d=\"^46\"/><path id=\"romanian-deadlift-m-mo-21\" d=\"^49\"/><path id=\"romanian-deadlift-m-mo-22\" d=\"^50\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#romanian-deadlift-m-dots)\"/>\n  <path class=\"floorline\" d=\"^44\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-m-st-head\"/><use href=\"#romanian-deadlift-m-st-torso\"/><use href=\"#romanian-deadlift-m-st-thigh.r\"/><use href=\"#romanian-deadlift-m-st-kneecap.r\"/><use href=\"#romanian-deadlift-m-st-shank.r\"/><use href=\"#romanian-deadlift-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-m-st-head\"/><use href=\"#romanian-deadlift-m-st-torso\"/><use href=\"#romanian-deadlift-m-st-thigh.r\"/><use href=\"#romanian-deadlift-m-st-kneecap.r\"/><use href=\"#romanian-deadlift-m-st-shank.r\"/><use href=\"#romanian-deadlift-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-m-st-shcap.r\"/><use href=\"#romanian-deadlift-m-st-upper.r\"/><use href=\"#romanian-deadlift-m-st-elbowcap.r\"/><use href=\"#romanian-deadlift-m-st-fore.r\"/><use href=\"#romanian-deadlift-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-m-st-shcap.r\"/><use href=\"#romanian-deadlift-m-st-upper.r\"/><use href=\"#romanian-deadlift-m-st-elbowcap.r\"/><use href=\"#romanian-deadlift-m-st-fore.r\"/><use href=\"#romanian-deadlift-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-m-g0-head\"/><use href=\"#romanian-deadlift-m-g0-torso\"/><use href=\"#romanian-deadlift-m-g0-thigh.r\"/><use href=\"#romanian-deadlift-m-g0-kneecap.r\"/><use href=\"#romanian-deadlift-m-g0-shank.r\"/><use href=\"#romanian-deadlift-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-m-g0-head\"/><use href=\"#romanian-deadlift-m-g0-torso\"/><use href=\"#romanian-deadlift-m-g0-thigh.r\"/><use href=\"#romanian-deadlift-m-g0-kneecap.r\"/><use href=\"#romanian-deadlift-m-g0-shank.r\"/><use href=\"#romanian-deadlift-m-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-m-g0-shcap.r\"/><use href=\"#romanian-deadlift-m-g0-upper.r\"/><use href=\"#romanian-deadlift-m-g0-elbowcap.r\"/><use href=\"#romanian-deadlift-m-g0-fore.r\"/><use href=\"#romanian-deadlift-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-m-g0-shcap.r\"/><use href=\"#romanian-deadlift-m-g0-upper.r\"/><use href=\"#romanian-deadlift-m-g0-elbowcap.r\"/><use href=\"#romanian-deadlift-m-g0-fore.r\"/><use href=\"#romanian-deadlift-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-m-g1-head\"/><use href=\"#romanian-deadlift-m-g1-torso\"/><use href=\"#romanian-deadlift-m-g1-thigh.r\"/><use href=\"#romanian-deadlift-m-g1-kneecap.r\"/><use href=\"#romanian-deadlift-m-g1-shank.r\"/><use href=\"#romanian-deadlift-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-m-g1-head\"/><use href=\"#romanian-deadlift-m-g1-torso\"/><use href=\"#romanian-deadlift-m-g1-thigh.r\"/><use href=\"#romanian-deadlift-m-g1-kneecap.r\"/><use href=\"#romanian-deadlift-m-g1-shank.r\"/><use href=\"#romanian-deadlift-m-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-m-g1-shcap.r\"/><use href=\"#romanian-deadlift-m-g1-upper.r\"/><use href=\"#romanian-deadlift-m-g1-elbowcap.r\"/><use href=\"#romanian-deadlift-m-g1-fore.r\"/><use href=\"#romanian-deadlift-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-m-g1-shcap.r\"/><use href=\"#romanian-deadlift-m-g1-upper.r\"/><use href=\"#romanian-deadlift-m-g1-elbowcap.r\"/><use href=\"#romanian-deadlift-m-g1-fore.r\"/><use href=\"#romanian-deadlift-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-m-e-thigh.l\"/><use href=\"#romanian-deadlift-m-e-kneecap.l\"/><use href=\"#romanian-deadlift-m-e-shank.l\"/><use href=\"#romanian-deadlift-m-e-foot.l\"/><use href=\"#romanian-deadlift-m-e-shcap.l\"/><use href=\"#romanian-deadlift-m-e-upper.l\"/><use href=\"#romanian-deadlift-m-e-elbowcap.l\"/><use href=\"#romanian-deadlift-m-e-fore.l\"/><use href=\"#romanian-deadlift-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-m-e-thigh.l\"/><use href=\"#romanian-deadlift-m-e-kneecap.l\"/><use href=\"#romanian-deadlift-m-e-shank.l\"/><use href=\"#romanian-deadlift-m-e-foot.l\"/><use href=\"#romanian-deadlift-m-e-shcap.l\"/><use href=\"#romanian-deadlift-m-e-upper.l\"/><use href=\"#romanian-deadlift-m-e-elbowcap.l\"/><use href=\"#romanian-deadlift-m-e-fore.l\"/><use href=\"#romanian-deadlift-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-m-e-head\"/><use href=\"#romanian-deadlift-m-e-torso\"/><use href=\"#romanian-deadlift-m-e-thigh.r\"/><use href=\"#romanian-deadlift-m-e-kneecap.r\"/><use href=\"#romanian-deadlift-m-e-shank.r\"/><use href=\"#romanian-deadlift-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-m-e-head\"/><use href=\"#romanian-deadlift-m-e-torso\"/><use href=\"#romanian-deadlift-m-e-thigh.r\"/><use href=\"#romanian-deadlift-m-e-kneecap.r\"/><use href=\"#romanian-deadlift-m-e-shank.r\"/><use href=\"#romanian-deadlift-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-m-e-shcap.r\"/><use href=\"#romanian-deadlift-m-e-upper.r\"/><use href=\"#romanian-deadlift-m-e-elbowcap.r\"/><use href=\"#romanian-deadlift-m-e-fore.r\"/><use href=\"#romanian-deadlift-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#romanian-deadlift-m-e-shcap.r\"/><use href=\"#romanian-deadlift-m-e-upper.r\"/><use href=\"#romanian-deadlift-m-e-elbowcap.r\"/><use href=\"#romanian-deadlift-m-e-fore.r\"/><use href=\"#romanian-deadlift-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^46\"/><path class=\"eq-line\" d=\"^47\"/><path class=\"eq-thin\" d=\"^48\"/><path class=\"eq-solid\" d=\"^49\"/><path class=\"eq-pin\" d=\"^50\"/><path class=\"eq-cable m-line\" d=\"^51\"/><circle class=\"joint\" cx=\"180.55\" cy=\"202.58\" r=\"2.25\"/><circle class=\"joint\" cx=\"169.32\" cy=\"248.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"113.31\" cy=\"213.81\" r=\"2.25\"/><circle class=\"joint\" cx=\"144.55\" cy=\"268.17\" r=\"2.25\"/></g><mask id=\"romanian-deadlift-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#romanian-deadlift-m-m-head\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-m-torso\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-mf-shank.l\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-mf-foot.l\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-m-shcap.l\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-m-upper.l\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-m-fore.l\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-m-fist.l\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-mf-shank.r\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-mf-foot.r\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-m-shcap.r\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-m-upper.r\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-m-fore.r\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-m-fist.r\" fill=\"#000\"/><use href=\"#romanian-deadlift-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#romanian-deadlift-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#romanian-deadlift-m-mmask)\"><g class=\"u-stroke\"><use href=\"#romanian-deadlift-m-m-head\"/><use href=\"#romanian-deadlift-m-m-torso\"/><use href=\"#romanian-deadlift-m-m-shcap.l\"/><use href=\"#romanian-deadlift-m-m-upper.l\"/><use href=\"#romanian-deadlift-m-m-elbowcap.l\"/><use href=\"#romanian-deadlift-m-m-fore.l\"/><use href=\"#romanian-deadlift-m-m-fist.l\"/><use href=\"#romanian-deadlift-m-m-shcap.r\"/><use href=\"#romanian-deadlift-m-m-upper.r\"/><use href=\"#romanian-deadlift-m-m-elbowcap.r\"/><use href=\"#romanian-deadlift-m-m-fore.r\"/><use href=\"#romanian-deadlift-m-m-fist.r\"/><use href=\"#romanian-deadlift-m-m-eq0\"/><use href=\"#romanian-deadlift-m-m-eq1\"/><use href=\"#romanian-deadlift-m-m-eq2\"/><use href=\"#romanian-deadlift-m-m-eq3\"/><use href=\"#romanian-deadlift-m-m-eq4\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MWBmNYB1LFh.qLH1F4LF1A4LF1F4LF1D4LF1D4LF1D4LF1F4LD1A4LH1F4LF1A4LF1F4LF1D4LF1D4LF1D4LF1F4\"/><path class=\"m-arrow\" d=\"~MA-qPJvLYmF*2MBo-jLDo_jL*bOP1\"/><path class=\"leader m\" d=\"M137.13 177.37L126.93 158H116.93\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"romanian-deadlift-m-round\" data-key=\"round\" data-cue=\"The lower back rounds at the bottom of the rep.\" class=\"plate-callout two m\" style=\"left:8.38%;top:37.99%\" aria-pressed=\"true\">Lower back<br>rounds</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "hips",
        cues: [{ key: "hips", cue: "Move your hips back to lower the bar and keep the slight knee bend fixed." }, { key: "bar", cue: "Keep the bar very close to your legs all the way down and up." }, { key: "back", cue: "Keep your back neutral and stop lowering where it would start to round." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "round",
        cues: [{ key: "round", cue: "The lower back rounds at the bottom of the rep." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Lower back rounds</b><span>The lower back rounds at the bottom of the rep.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower 2 seconds, stand 1 second\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Stand</b><span>1 s</span></div></div></div>",
      alt: "Romanian deadlift, side view. Standing tall with the bar at the thighs and knees about 15 degrees bent, the lifter pushes the hips back with a flat back, keeping the knee bend fixed and the bar close to the legs down to about mid-shin.",
      mistakeAlt: "Romanian Deadlift: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hold",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW2: no pair key variant holds this card's hanging barbell (ruling 8); the grip copy carries c9 and c22.",
    "handle": "bar-28",
    "width": {
      "text": "Slightly wider than shoulders, arms just outside the thighs.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-rdl"
        ],
        "note": "c9"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "baechle-grip",
          "sl-romanian-deadlift"
        ],
        "note": "c22"
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
          "CONVENTION"
        ],
        "sources": [
          "hold-default"
        ],
        "note": "card grip.wrist (hold archetype). The ext range is the hold archetype's (GA 3.1), a convention, not a card number."
      }
    },
    "pose": {
      "thumb": "wrapped"
    },
    "faults": [],
    "gripLine": "Hands just outside your thighs, thumbs wrapped round the bar. Straps are fine if grip limits the set.",
    "cue": "Thumbs wrapped, wrists neutral."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "grip",
      "text": "Feet hip width. Grip slightly wider than shoulders, thumbs wrapped.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-rdl",
          "baechle-grip",
          "sl-romanian-deadlift"
        ],
        "note": "c10, c9, c22"
      }
    },
    {
      "kind": "get-in",
      "text": "Unrack the bar, or deadlift it off the floor.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-romanian-deadlift"
        ],
        "note": "c11"
      }
    },
    {
      "kind": "position",
      "text": "Bar resting on the thighs. Shoulders back and down.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-romanian-deadlift",
          "nasm-rdl"
        ],
        "note": "c1, c9"
      }
    },
    {
      "kind": "brace",
      "text": "Breathe in, brace slightly. Push the heels into the floor to stand.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-romanian-deadlift",
          "ace-romanian-deadlift"
        ],
        "note": "c12, c3"
      }
    },
    {
      "kind": "safety",
      "text": "Want to avoid turning heavy weight around in mid-air? Lower onto blocks.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-romanian-deadlift"
        ],
        "note": "c18"
      }
    }
  ],
  posture: [
    {
      "key": "hips",
      "label": "Hips back",
      "detail": "Push the hips back to lower the bar.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-romanian-deadlift",
          "sl-romanian-deadlift"
        ],
        "note": "c2, c4"
      }
    },
    {
      "key": "knees",
      "label": "Knees fixed",
      "detail": "Knees fixed at a slight bend. The movement is at the hips.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "rdl-bottom",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-romanian-deadlift"
        ],
        "note": "c4"
      }
    },
    {
      "key": "back",
      "label": "Spine neutral",
      "detail": "Spine neutral. Stop before it rounds.",
      "anchor": {
        "pose": "end",
        "at": "lumbar"
      },
      "zoom": "rdl-bottom",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-romanian-deadlift"
        ],
        "note": "c5"
      }
    },
    {
      "key": "bar",
      "label": "Bar close",
      "detail": "Bar very close to the body.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "zoom": "rdl-bar-path",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-romanian-deadlift"
        ],
        "note": "c3"
      }
    },
    {
      "key": "depth",
      "label": "About mid-shin",
      "detail": "Lower until you feel tension along the back of the legs. Spine position beats depth.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-rdl",
          "ace-romanian-deadlift"
        ],
        "note": "c6, c2"
      }
    },
    {
      "key": "heels",
      "label": "Heels down",
      "detail": "Push the heels into the floor to stand.",
      "anchor": {
        "pose": "start",
        "at": "heel.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-romanian-deadlift"
        ],
        "note": "c3"
      }
    }
  ],
  zooms: [
    {
      "key": "rdl-bottom",
      "chip": "Bottom",
      "heading": "Bottom position",
      "kind": "posture",
      "feelRow": "low-back"
    },
    {
      "key": "rdl-bar-path",
      "chip": "Bar path",
      "heading": "Bar path",
      "kind": "posture"
    }
  ],
  chips: [
    "rdl-bottom",
    "rdl-bar-path",
    "feel"
  ],
  copy: {
    "setupLine": "Feet hip width, bar on your thighs. Grip slightly wider than shoulders, shoulders back and down.",
    "mistakeLine": "Never round your lower back to get the bar lower. Stop where it stays flat.",
    "cueLine": "Hips back, bar close."
  },
  mistakes: [
    {
      "key": "round",
      "title": "Rounding the lower back",
      "zoom": "rdl-bottom",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-rdl"
        ],
        "note": "c7, c8"
      },
      "fix": "Stop where the back stays flat. If it rounds, lower the weight."
    },
    {
      "key": "squat",
      "title": "Knees bending into a squat",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-rdl",
          "sl-romanian-deadlift",
          "ace-romanian-deadlift"
        ],
        "note": "c7, c4, c2"
      },
      "fix": "Lock the knees at a slight bend and push the hips back."
    },
    {
      "key": "heavy",
      "title": "Too heavy, form breaks",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-rdl"
        ],
        "note": "c8"
      },
      "fix": "Go lighter and move smoothly."
    }
  ],
  risks: [
    {
      "key": "round",
      "text": "A rounded lower back under load raises injury risk.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-rdl"
        ],
        "note": "c7"
      }
    },
    {
      "key": "breath",
      "text": "Heavy reps with a held breath send blood pressure very high.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "macdougall1985"
        ],
        "note": "c21"
      }
    },
    {
      "key": "soon",
      "text": "Too much too soon can leave the back sore. Ease into heavy sets gradually.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-romanian-deadlift",
          "acsm2009"
        ],
        "note": "c17, c19"
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
    "ace-romanian-deadlift",
    "sl-romanian-deadlift",
    "nasm-rdl",
    "mcallister2014",
    "lee2018",
    "acsm2009",
    "macdougall1985",
    "baechle-grip",
    "hold-default",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/romanian_deadlift.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

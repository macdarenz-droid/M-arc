// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=ce96cfef42437318aff4c53b190025e00de359196447e2f68abd77bdd4d01fdf
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_dumbbell_pullover",
  name: "Dumbbell Pullover",
  hashes: { inputsSha256: "ce96cfef42437318aff4c53b190025e00de359196447e2f68abd77bdd4d01fdf", golden: "97e0f6dba03b816d413ad175cdcfe95d48bc0b0bd0ba2933ff6854e795a5c314" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-pullover-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-pullover-n-st-upper.l\" d=\"~#F12YDuYPT1ExuzTU1R1U891Y3GN1.3J5.1W2OaUz1OcHhz2HgP7!jqDB1y1A3J2A6N8TK1c2nU8!fA4!gKnw3GmBazr00020001010000020000100100100000200010001000120000000000200100210002000001000000\"/><path id=\"dumbbell-pullover-n-st-elbowcap.l\" d=\"~~F_sDIH1Dz10\"/><path id=\"dumbbell-pullover-n-st-fore.l\" d=\"~#F12(xvPDH1KyvKxI1bwavV1X8XF1K2J9E1J2N3Puz5SdN1ybJ8!bN4Hu!1w2U4J8.1RG1k.1!2S9Fa2(7XkB2xh*cxi00002000000100001200000002020011110210000001101000110000001000100000000000000000\"/><path id=\"dumbbell-pullover-n-st-fist.l\" d=\"~~DXr!yx1ww10\"/><path id=\"dumbbell-pullover-n-st-upper.r\" d=\"^0\"/><path id=\"dumbbell-pullover-n-st-elbowcap.r\" d=\"^1\"/><path id=\"dumbbell-pullover-n-st-fore.r\" d=\"^2\"/><path id=\"dumbbell-pullover-n-st-fist.r\" d=\"^3\"/><path id=\"dumbbell-pullover-n-g0-upper.r\" d=\"~#F12ABuU!S1BNuE(T1w2S870TfVI1I1P6hD3y5_A1B4!kW4YfwfyfAgUx1D2H2Y4U4zbzK1c0!2A8AgV2Y5KsI6OlRkOk00000001000000020000010100000010100200020001010001110022001100000000002000001001\"/><path id=\"dumbbell-pullover-n-g0-elbowcap.r\" d=\"~~Uwp(UH1Dz10\"/><path id=\"dumbbell-pullover-n-g0-fore.r\" d=\"~#F12DzrSxH1VNr.-H1W3D9R1x1XoOx1W1N97_2YfFqsPe!5S9ScH7Ng_pS2y1W7Y5-iBB17.1S6P7N9B4G1zmz9VezjBb00101000000000000002002100000000020000111100001010010100020002010000001001002002\"/><path id=\"dumbbell-pullover-n-g0-fist.r\" d=\"~~wEkSWy1ww10\"/><path id=\"dumbbell-pullover-n-g0-eq3.dumbbell.1-0\" d=\"~M(Xj()E1L0FK1Q0J9J9.z1Lyy2I9QJ90xy2I9LI9.z1Q0I9I9!z1Lxy2J9QI90yy2J9Z\"/><path id=\"dumbbell-pullover-n-g0-eq3.dumbbell.2-1\" d=\"~MAWmHWz1L0EK1Q0I9I9!z1Lxy2J9QI90yy2J9LJ9!z1Q0J9J9.z1Lyy2I9QJ90xy2I9Z\"/><path id=\"dumbbell-pullover-n-g1-upper.r\" d=\"~#F12J.t!HS1ORuVBT1N5_696Bw1Ix1J1N6sA3YjPvW4Yk_aNc(jS7Js(ny3F1D6H2TsRA187w6H6Sdz9I6Es-e)gxrEa00000010001012110100201100121000022000001102000000000000001200100222001000000200\"/><path id=\"dumbbell-pullover-n-g1-elbowcap.r\" d=\"~~_VlYOJ1Dz10\"/><path id=\"dumbbell-pullover-n-g1-fore.r\" d=\"~#F12UKnHRI1zyo-yJ1D7(6.19IA1IkN5(7uS2ApSh_6!cF9D6NeS1UpYg_23H9A2Iw1zqvV1w9A4(6R7IaXjGeT9xmB200200202000001110111110002000201000200000120000002200021000210000010011012020021\"/><path id=\"dumbbell-pullover-n-g1-fist.r\" d=\"~~NxePFE1ww10\"/><path id=\"dumbbell-pullover-n-g1-eq3.dumbbell.1-0\" d=\"~MHSd!RJ1L0FK1Q0J9J9.z1LAy2I9QJ90zy2I9LI9.z1Q0I9I9!z1Lzy2J9QI90Ay2J9Z\"/><path id=\"dumbbell-pullover-n-g1-eq3.dumbbell.2-1\" d=\"~MSPgFFF1L0EK1Q0I9I9!z1Lzy2J9QI90Ay2J9LJ9!z1Q0J9J9.z1LAy2I9QJ90zy2I9Z\"/><path id=\"dumbbell-pullover-n-g2-upper.r\" d=\"~#F12DIt_(R1IHuBNS1W7w43axI1Bh!3H5y2P2wvUk_c(g(e!6FlG1_z1AaF33U6bBG1Tl45A8A3S8-dOhBnIkG9*sY101000100220022001000020000101010000121002000202002101100000100101001002000010021\"/><path id=\"dumbbell-pullover-n-g2-elbowcap.r\" d=\"~~WJjJRO1Dz10\"/><path id=\"dumbbell-pullover-n-g2-fore.r\" d=\"~#F12AWkAKN1*OlTUN1H9J3.1eKG1R3A8w5w2(1AuU5Nbw9wb_1_dR4FuY4P2E1N9*1IF1KaR1z1(90A3X9OhTd)g)2xlA700100000001010001020000002000211000020000000202002100001000002000202000001020000\"/><path id=\"dumbbell-pullover-n-g2-fist.r\" d=\"~~NGa_(K1ww10\"/><path id=\"dumbbell-pullover-n-g2-eq3.dumbbell.1-0\" d=\"~MH_9DFT1L0FK1Q0J9J9.z1LAy2I9QJ90zy2I9LI9.z1Q0I9I9!z1Lzy2J9QI90Ay2J9Z\"/><path id=\"dumbbell-pullover-n-g2-eq3.dumbbell.2-1\" d=\"~MSYcS(N1L0EK1Q0I9I9!z1Lzy2J9QI90Ay2J9LJ9!z1Q0J9J9.z1LAy2I9QJ90zy2I9Z\"/><path id=\"dumbbell-pullover-n-e-thigh.l\" d=\"~#F12(SG1HGU1*zF1BBU1.b37D1P(1y7-6E7I3G3)T1IbRk)f)jI3VoH8-U1G6G4w2X8U4F*1!d8E1GbX3-g_sSA1NsPz1w6(I1.e02020000012000100002001200000000100000200000000000000020010000000000000001010000\"/><path id=\"dumbbell-pullover-n-e-kneecap.l\" d=\"~~NVU1w)T1_J10\"/><path id=\"dumbbell-pullover-n-e-shank.l\" d=\"~#F12!TU1ywU1OWU1XPS1P1.bH10H6_(1_5)7U2x4I5Xy2y7.d9*bT7KdA2xz2-2-3B6X7I3y)1E10x2XbOcwcXcwpiWl!dHo00000000000011000001111200200100000010010100001001001001000000200010000001012102\"/><path id=\"dumbbell-pullover-n-e-foot.l\" d=\"~#o2_NV1DB)1IwW1EB(1YcF3Uh*7SpxoU-2B3-J2-4ID1)7)n0TG1_4BbXc_sEbKmUp000002000011100101010020000000000000020000100001\"/><path id=\"dumbbell-pullover-n-e-shcap.l\" d=\"~~DErJHT1wP10\"/><path id=\"dumbbell-pullover-n-e-upper.l\" d=\"~#F12PXsJ_R1E_tO.R1U8e2aIN1A2Y5D3(2N1WA1w6WiDaNg4_i*9_A1O5(2K1_5x3IN1X209W8dD2zgOp.dOm5RpPd10011020000220000001200000000000000000000200000200011001000100000000101101000000\"/><path id=\"dumbbell-pullover-n-e-elbowcap.l\" d=\"~~FSiNFT1Dz10\"/><path id=\"dumbbell-pullover-n-e-fore.l\" d=\"~#F12DJj_AS1-Dk)wS1!9nO1A1EE1_dP9D1S2w1_tE7yeJ3!a-2Ua-9Stz8_1B2W7T5)F1y7*19y9z4z1BaTlE5VgH4EgAf10100201000000001000000000000001100200000021011200100001110001010110000000022000\"/><path id=\"dumbbell-pullover-n-e-fist.l\" d=\"~~FU9STV1ww10\"/><path id=\"dumbbell-pullover-n-e-head\" d=\"~#w12PJiHIT1-EiB)U1!kFhNbDix2Pbw5W2O7S5Gay9VkUjBdR3I9S2_1yjEdElR8TlF1xlyeTkFj50001100000200000100200020000000000002000002100101000000010001000\"/><path id=\"dumbbell-pullover-n-e-torso\" d=\"~#_12JFnSJU1E-lKEU1E2AaT4Y4JeRaN9BaDf-dl.6VnH9z7ypy5Uc-4*fK6-k*fKmThRhT9-4*fw8Ez1DrBrDbO3S6*2UeAm)d_7V3z7HdUbHfNiD5(1G6.8*a(8B4_E1YO200010000020000100000000000200000000001000000010121000000002001010100000000000110000000220000100001002020000101000020\"/><path id=\"dumbbell-pullover-n-e-thigh.r\" d=\"^22\"/><path id=\"dumbbell-pullover-n-e-kneecap.r\" d=\"^23\"/><path id=\"dumbbell-pullover-n-e-shank.r\" d=\"^24\"/><path id=\"dumbbell-pullover-n-e-foot.r\" d=\"^25\"/><path id=\"dumbbell-pullover-n-e-shcap.r\" d=\"^26\"/><path id=\"dumbbell-pullover-n-e-upper.r\" d=\"^27\"/><path id=\"dumbbell-pullover-n-e-elbowcap.r\" d=\"^28\"/><path id=\"dumbbell-pullover-n-e-fore.r\" d=\"^29\"/><path id=\"dumbbell-pullover-n-e-fist.r\" d=\"^30\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-pullover-n-dots)\"/>\n  <path class=\"floorline\" d=\"M51.16 339.5H332.03\"/><path class=\"eq\" d=\"~MPBjNUX1LAXw10Qwp0z(v)oL)oDkQ0)o)oBkLz(vwpQ)o0A(vwpLwpBkQ0wpwpDkZ\"/><path class=\"eq\" d=\"~MwBlDy-1LAYs0QF60.RsE6LE6)qQ0E6E6wrL.RsF6QE60!RsF6LF6wrQ0F6F6)qZ\"/><path class=\"eq\" d=\"~MJzlSRY1L0PT8Q0F6F6EK8L(qE6QF60*qE6LE6EK8Q0E6E6FK8L*qF6QE60(qF6Z\"/><path class=\"eq\" d=\"~MYSkYDy2L(N20QF60VF2E6LE6V8Q0E6E6W8LVF2F6QE60WF2F6LF6W8Q0F6F6V8Z\"/><path class=\"eq\" d=\"~MyRP1SRY1L0PT8Q0F6F6EK8L(qE6QF60*qE6LE6EK8Q0E6E6FK8L*qF6QE60(qF6Z\"/><path class=\"eq\" d=\"~MNwP1YDy2L(N20QF60VF2E6LE6V8Q0E6E6W8LVF2F6QE60WF2F6LF6W8Q0F6F6V8Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-n-st-upper.l\"/><use href=\"#dumbbell-pullover-n-st-elbowcap.l\"/><use href=\"#dumbbell-pullover-n-st-fore.l\"/><use href=\"#dumbbell-pullover-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-n-st-upper.l\"/><use href=\"#dumbbell-pullover-n-st-elbowcap.l\"/><use href=\"#dumbbell-pullover-n-st-fore.l\"/><use href=\"#dumbbell-pullover-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-n-st-upper.r\"/><use href=\"#dumbbell-pullover-n-st-elbowcap.r\"/><use href=\"#dumbbell-pullover-n-st-fore.r\"/><use href=\"#dumbbell-pullover-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-n-st-upper.r\"/><use href=\"#dumbbell-pullover-n-st-elbowcap.r\"/><use href=\"#dumbbell-pullover-n-st-fore.r\"/><use href=\"#dumbbell-pullover-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-n-g0-upper.r\"/><use href=\"#dumbbell-pullover-n-g0-elbowcap.r\"/><use href=\"#dumbbell-pullover-n-g0-fore.r\"/><use href=\"#dumbbell-pullover-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-n-g0-upper.r\"/><use href=\"#dumbbell-pullover-n-g0-elbowcap.r\"/><use href=\"#dumbbell-pullover-n-g0-fore.r\"/><use href=\"#dumbbell-pullover-n-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MUVl!UE1L0OT3Q0E6E6FK3LOaF6QE60PaF6LF6FK3Q0F6F6EK3LPaE6QF60OaE6Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-n-g0-eq3.dumbbell.1-0\"/><use href=\"#dumbbell-pullover-n-g0-eq3.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-n-g0-eq3.dumbbell.1-0\"/><use href=\"#dumbbell-pullover-n-g0-eq3.dumbbell.2-1\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-n-g1-upper.r\"/><use href=\"#dumbbell-pullover-n-g1-elbowcap.r\"/><use href=\"#dumbbell-pullover-n-g1-fore.r\"/><use href=\"#dumbbell-pullover-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-n-g1-upper.r\"/><use href=\"#dumbbell-pullover-n-g1-elbowcap.r\"/><use href=\"#dumbbell-pullover-n-g1-fore.r\"/><use href=\"#dumbbell-pullover-n-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MyPf_DJ1L0OT3Q0E6E6FK3LOaF6QE60PaF6LF6FK3Q0F6F6EK3LPaE6QF60OaE6Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-n-g1-eq3.dumbbell.1-0\"/><use href=\"#dumbbell-pullover-n-g1-eq3.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-n-g1-eq3.dumbbell.1-0\"/><use href=\"#dumbbell-pullover-n-g1-eq3.dumbbell.2-1\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-n-g2-upper.r\"/><use href=\"#dumbbell-pullover-n-g2-elbowcap.r\"/><use href=\"#dumbbell-pullover-n-g2-fore.r\"/><use href=\"#dumbbell-pullover-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-n-g2-upper.r\"/><use href=\"#dumbbell-pullover-n-g2-elbowcap.r\"/><use href=\"#dumbbell-pullover-n-g2-fore.r\"/><use href=\"#dumbbell-pullover-n-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MyYbA*S1L0OT3Q0E6E6FK3LOaF6QE60PaF6LF6FK3Q0F6F6EK3LPaE6QF60OaE6Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-n-g2-eq3.dumbbell.1-0\"/><use href=\"#dumbbell-pullover-n-g2-eq3.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-n-g2-eq3.dumbbell.1-0\"/><use href=\"#dumbbell-pullover-n-g2-eq3.dumbbell.2-1\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-n-e-thigh.l\"/><use href=\"#dumbbell-pullover-n-e-kneecap.l\"/><use href=\"#dumbbell-pullover-n-e-shank.l\"/><use href=\"#dumbbell-pullover-n-e-foot.l\"/><use href=\"#dumbbell-pullover-n-e-shcap.l\"/><use href=\"#dumbbell-pullover-n-e-upper.l\"/><use href=\"#dumbbell-pullover-n-e-elbowcap.l\"/><use href=\"#dumbbell-pullover-n-e-fore.l\"/><use href=\"#dumbbell-pullover-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-n-e-thigh.l\"/><use href=\"#dumbbell-pullover-n-e-kneecap.l\"/><use href=\"#dumbbell-pullover-n-e-shank.l\"/><use href=\"#dumbbell-pullover-n-e-foot.l\"/><use href=\"#dumbbell-pullover-n-e-shcap.l\"/><use href=\"#dumbbell-pullover-n-e-upper.l\"/><use href=\"#dumbbell-pullover-n-e-elbowcap.l\"/><use href=\"#dumbbell-pullover-n-e-fore.l\"/><use href=\"#dumbbell-pullover-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-n-e-head\"/><use href=\"#dumbbell-pullover-n-e-torso\"/><use href=\"#dumbbell-pullover-n-e-thigh.r\"/><use href=\"#dumbbell-pullover-n-e-kneecap.r\"/><use href=\"#dumbbell-pullover-n-e-shank.r\"/><use href=\"#dumbbell-pullover-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-n-e-head\"/><use href=\"#dumbbell-pullover-n-e-torso\"/><use href=\"#dumbbell-pullover-n-e-thigh.r\"/><use href=\"#dumbbell-pullover-n-e-kneecap.r\"/><use href=\"#dumbbell-pullover-n-e-shank.r\"/><use href=\"#dumbbell-pullover-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-n-e-shcap.r\"/><use href=\"#dumbbell-pullover-n-e-upper.r\"/><use href=\"#dumbbell-pullover-n-e-elbowcap.r\"/><use href=\"#dumbbell-pullover-n-e-fore.r\"/><use href=\"#dumbbell-pullover-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-n-e-shcap.r\"/><use href=\"#dumbbell-pullover-n-e-upper.r\"/><use href=\"#dumbbell-pullover-n-e-elbowcap.r\"/><use href=\"#dumbbell-pullover-n-e-fore.r\"/><use href=\"#dumbbell-pullover-n-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"~MYwr!yF1L0.W7L_J3!W7L-J3!W7L-J3.W7\"/><path class=\"eq-solid\" d=\"~M!yb!R_1L0OT3Q0E6E6FK3LOaF6QE60PaF6LF6FK3Q0F6F6EK3LPaE6QF60OaE6Z\"/><path class=\"disc\" d=\"~MAB9(!_1L0FK1Q0J9J9.z1Lyy2I9QJ90xy2I9LI9.z1Q0I9I9!z1Lxy2J9QI90yy2J9Z\"/><path class=\"disc\" d=\"~MHzcHTW1L0EK1Q0I9I9!z1Lxy2J9QI90yy2J9LJ9!z1Q0J9J9.z1Lyy2I9QJ90xy2I9Z\"/><circle class=\"joint\" cx=\"147.07\" cy=\"262.78\" r=\"2.25\"/><circle class=\"joint\" cx=\"100.71\" cy=\"262.47\" r=\"2.25\"/><circle class=\"joint\" cx=\"215\" cy=\"255.62\" r=\"2.25\"/><circle class=\"joint\" cx=\"276.84\" cy=\"266.08\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#P20(AqWFx1x-qIAx1122102oY2200010F1W2010201S1P2102000!1D2000201D2(1000000N2U1000102U2F1010201Y2s221120!2e1221120010100000200000112000000000000020012000000000121010100000200000000000000200000000000200020002020000001000120010001101100011010000000001000020000010100101101000\"/><path class=\"arrow\" d=\"~MNJaUDU1LKf)D1L_U1FH1Z\"/></g><path class=\"leader\" d=\"M159.25 276.1L163 214H173\"/><circle class=\"anchor\" cx=\"159.25\" cy=\"276.1\" r=\"1.5\"/><path class=\"leader\" d=\"M100.71 262.47L129 316H139\"/><circle class=\"anchor\" cx=\"100.71\" cy=\"262.47\" r=\"1.5\"/><path class=\"leader\" d=\"M217.05 276.1L235 224H245\"/><circle class=\"anchor\" cx=\"217.05\" cy=\"276.1\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dumbbell-pullover-n-five\" data-key=\"five\" data-cue=\"Keep your head, blades and hips on the bench and both feet down.\" class=\"plate-callout two\" style=\"left:46.93%;top:53.63%\" aria-pressed=\"true\">Five<br>points</button><button type=\"button\" id=\"dumbbell-pullover-n-bend\" data-key=\"bend\" data-cue=\"Keep the same slight bend in your elbows the whole way.\" class=\"plate-callout two\" style=\"left:37.43%;top:82.12%\" aria-pressed=\"false\">Same<br>elbow bend</button><button type=\"button\" id=\"dumbbell-pullover-n-hips\" data-key=\"hips\" data-cue=\"Keep your hips on the bench as the weight goes back.\" class=\"plate-callout two\" style=\"left:67.04%;top:56.42%\" aria-pressed=\"false\">Hips<br>down</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-pullover-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-pullover-m-st-upper.l\" d=\"^0\"/><path id=\"dumbbell-pullover-m-st-elbowcap.l\" d=\"^1\"/><path id=\"dumbbell-pullover-m-st-fore.l\" d=\"^2\"/><path id=\"dumbbell-pullover-m-st-fist.l\" d=\"^3\"/><path id=\"dumbbell-pullover-m-st-upper.r\" d=\"^0\"/><path id=\"dumbbell-pullover-m-st-elbowcap.r\" d=\"^1\"/><path id=\"dumbbell-pullover-m-st-fore.r\" d=\"^2\"/><path id=\"dumbbell-pullover-m-st-fist.r\" d=\"^3\"/><path id=\"dumbbell-pullover-m-g0-upper.r\" d=\"^4\"/><path id=\"dumbbell-pullover-m-g0-elbowcap.r\" d=\"^5\"/><path id=\"dumbbell-pullover-m-g0-fore.r\" d=\"^6\"/><path id=\"dumbbell-pullover-m-g0-fist.r\" d=\"^7\"/><path id=\"dumbbell-pullover-m-g0-eq3.dumbbell.1-0\" d=\"^8\"/><path id=\"dumbbell-pullover-m-g0-eq3.dumbbell.2-1\" d=\"^9\"/><path id=\"dumbbell-pullover-m-g1-upper.r\" d=\"^10\"/><path id=\"dumbbell-pullover-m-g1-elbowcap.r\" d=\"^11\"/><path id=\"dumbbell-pullover-m-g1-fore.r\" d=\"^12\"/><path id=\"dumbbell-pullover-m-g1-fist.r\" d=\"^13\"/><path id=\"dumbbell-pullover-m-g1-eq3.dumbbell.1-0\" d=\"^14\"/><path id=\"dumbbell-pullover-m-g1-eq3.dumbbell.2-1\" d=\"^15\"/><path id=\"dumbbell-pullover-m-g2-upper.r\" d=\"^16\"/><path id=\"dumbbell-pullover-m-g2-elbowcap.r\" d=\"^17\"/><path id=\"dumbbell-pullover-m-g2-fore.r\" d=\"^18\"/><path id=\"dumbbell-pullover-m-g2-fist.r\" d=\"^19\"/><path id=\"dumbbell-pullover-m-g2-eq3.dumbbell.1-0\" d=\"^20\"/><path id=\"dumbbell-pullover-m-g2-eq3.dumbbell.2-1\" d=\"^21\"/><path id=\"dumbbell-pullover-m-e-thigh.l\" d=\"^22\"/><path id=\"dumbbell-pullover-m-e-kneecap.l\" d=\"^23\"/><path id=\"dumbbell-pullover-m-e-shank.l\" d=\"^24\"/><path id=\"dumbbell-pullover-m-e-foot.l\" d=\"^25\"/><path id=\"dumbbell-pullover-m-e-shcap.l\" d=\"^26\"/><path id=\"dumbbell-pullover-m-e-upper.l\" d=\"^27\"/><path id=\"dumbbell-pullover-m-e-elbowcap.l\" d=\"^28\"/><path id=\"dumbbell-pullover-m-e-fore.l\" d=\"^29\"/><path id=\"dumbbell-pullover-m-e-fist.l\" d=\"^30\"/><path id=\"dumbbell-pullover-m-e-head\" d=\"^31\"/><path id=\"dumbbell-pullover-m-e-torso\" d=\"^32\"/><path id=\"dumbbell-pullover-m-e-thigh.r\" d=\"^22\"/><path id=\"dumbbell-pullover-m-e-kneecap.r\" d=\"^23\"/><path id=\"dumbbell-pullover-m-e-shank.r\" d=\"^24\"/><path id=\"dumbbell-pullover-m-e-foot.r\" d=\"^25\"/><path id=\"dumbbell-pullover-m-e-shcap.r\" d=\"^26\"/><path id=\"dumbbell-pullover-m-e-upper.r\" d=\"^27\"/><path id=\"dumbbell-pullover-m-e-elbowcap.r\" d=\"^28\"/><path id=\"dumbbell-pullover-m-e-fore.r\" d=\"^29\"/><path id=\"dumbbell-pullover-m-e-fist.r\" d=\"^30\"/><path id=\"dumbbell-pullover-m-m-upper.l\" d=\"~#F12DOt_wS1VKuKTS1S7_458IH1XlP3Y5(1Y2JuDoFbAiFeD8FlmFA1HeF36_66zF1-p67w8w4(8KdBfVoOjBb*st10010101002000000000000111200221010022200000012000000000000000121000001000000002\"/><path id=\"dumbbell-pullover-m-m-elbowcap.l\" d=\"~~FSjUVN1Dz10\"/><path id=\"dumbbell-pullover-m-m-fore.l\" d=\"~#F12HXjPwN1REkRNK1P6B6bW1KiSw1P7R4P2nwfVkwdR6N6B9W1IeHeGl3O2W1T8EoPsO1sU3E8.5B9.jwa.9AeT2ym00000010000000200000000000200000100000000022000000000001000001200200020210100000\"/><path id=\"dumbbell-pullover-m-m-fist.l\" d=\"~~S.eHRV1ww10\"/><path id=\"dumbbell-pullover-m-m-upper.r\" d=\"^52\"/><path id=\"dumbbell-pullover-m-m-elbowcap.r\" d=\"^53\"/><path id=\"dumbbell-pullover-m-m-fore.r\" d=\"^54\"/><path id=\"dumbbell-pullover-m-m-fist.r\" d=\"^55\"/><path id=\"dumbbell-pullover-m-m-eq0\" d=\"~MDHgUO_1L0OT3Q0E6E6FK3LOaF6QE60PaF6LF6FK3Q0F6F6EK3LPaE6QF60OaE6Z\"/><path id=\"dumbbell-pullover-m-m-eq1\" d=\"~MPJeW__1L0FK1Q0J9J9.z1Lyy2I9QJ90xy2I9LI9.z1Q0I9I9!z1Lxy2J9QI90yy2J9Z\"/><path id=\"dumbbell-pullover-m-m-eq2\" d=\"~MWHhyRW1L0EK1Q0I9I9!z1Lxy2J9QI90yy2J9LJ9!z1Q0J9J9.z1Lyy2I9QJ90xy2I9Z\"/><path id=\"dumbbell-pullover-m-mf-head\" d=\"^31\"/><path id=\"dumbbell-pullover-m-mf-torso\" d=\"^32\"/><path id=\"dumbbell-pullover-m-mf-thigh.l\" d=\"^22\"/><path id=\"dumbbell-pullover-m-mf-kneecap.l\" d=\"^23\"/><path id=\"dumbbell-pullover-m-mf-shank.l\" d=\"^24\"/><path id=\"dumbbell-pullover-m-mf-foot.l\" d=\"^25\"/><path id=\"dumbbell-pullover-m-mf-shcap.l\" d=\"^26\"/><path id=\"dumbbell-pullover-m-mf-thigh.r\" d=\"^22\"/><path id=\"dumbbell-pullover-m-mf-kneecap.r\" d=\"^23\"/><path id=\"dumbbell-pullover-m-mf-shank.r\" d=\"^24\"/><path id=\"dumbbell-pullover-m-mf-foot.r\" d=\"^25\"/><path id=\"dumbbell-pullover-m-mf-shcap.r\" d=\"^26\"/><path id=\"dumbbell-pullover-m-mo-0\" d=\"^31\"/><path id=\"dumbbell-pullover-m-mo-1\" d=\"^32\"/><path id=\"dumbbell-pullover-m-mo-2\" d=\"^22\"/><path id=\"dumbbell-pullover-m-mo-3\" d=\"^23\"/><path id=\"dumbbell-pullover-m-mo-4\" d=\"^24\"/><path id=\"dumbbell-pullover-m-mo-5\" d=\"^25\"/><path id=\"dumbbell-pullover-m-mo-6\" d=\"^26\"/><path id=\"dumbbell-pullover-m-mo-7\" d=\"^27\"/><path id=\"dumbbell-pullover-m-mo-8\" d=\"^28\"/><path id=\"dumbbell-pullover-m-mo-9\" d=\"^29\"/><path id=\"dumbbell-pullover-m-mo-10\" d=\"^30\"/><path id=\"dumbbell-pullover-m-mo-11\" d=\"^22\"/><path id=\"dumbbell-pullover-m-mo-12\" d=\"^23\"/><path id=\"dumbbell-pullover-m-mo-13\" d=\"^24\"/><path id=\"dumbbell-pullover-m-mo-14\" d=\"^25\"/><path id=\"dumbbell-pullover-m-mo-15\" d=\"^26\"/><path id=\"dumbbell-pullover-m-mo-16\" d=\"^27\"/><path id=\"dumbbell-pullover-m-mo-17\" d=\"^28\"/><path id=\"dumbbell-pullover-m-mo-18\" d=\"^29\"/><path id=\"dumbbell-pullover-m-mo-19\" d=\"^30\"/><path id=\"dumbbell-pullover-m-mo-20\" d=\"^34\"/><path id=\"dumbbell-pullover-m-mo-21\" d=\"^35\"/><path id=\"dumbbell-pullover-m-mo-22\" d=\"^36\"/><path id=\"dumbbell-pullover-m-mo-23\" d=\"^37\"/><path id=\"dumbbell-pullover-m-mo-24\" d=\"^38\"/><path id=\"dumbbell-pullover-m-mo-25\" d=\"^39\"/><path id=\"dumbbell-pullover-m-mo-26\" d=\"^44\"/><path id=\"dumbbell-pullover-m-mo-27\" d=\"^45\"/><path id=\"dumbbell-pullover-m-mo-28\" d=\"^46\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-pullover-m-dots)\"/>\n  <path class=\"floorline\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><path class=\"eq\" d=\"^38\"/><path class=\"eq\" d=\"^39\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-m-st-upper.l\"/><use href=\"#dumbbell-pullover-m-st-elbowcap.l\"/><use href=\"#dumbbell-pullover-m-st-fore.l\"/><use href=\"#dumbbell-pullover-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-m-st-upper.l\"/><use href=\"#dumbbell-pullover-m-st-elbowcap.l\"/><use href=\"#dumbbell-pullover-m-st-fore.l\"/><use href=\"#dumbbell-pullover-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-m-st-upper.r\"/><use href=\"#dumbbell-pullover-m-st-elbowcap.r\"/><use href=\"#dumbbell-pullover-m-st-fore.r\"/><use href=\"#dumbbell-pullover-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-m-st-upper.r\"/><use href=\"#dumbbell-pullover-m-st-elbowcap.r\"/><use href=\"#dumbbell-pullover-m-st-fore.r\"/><use href=\"#dumbbell-pullover-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-m-g0-upper.r\"/><use href=\"#dumbbell-pullover-m-g0-elbowcap.r\"/><use href=\"#dumbbell-pullover-m-g0-fore.r\"/><use href=\"#dumbbell-pullover-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-m-g0-upper.r\"/><use href=\"#dumbbell-pullover-m-g0-elbowcap.r\"/><use href=\"#dumbbell-pullover-m-g0-fore.r\"/><use href=\"#dumbbell-pullover-m-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^40\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-m-g0-eq3.dumbbell.1-0\"/><use href=\"#dumbbell-pullover-m-g0-eq3.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-m-g0-eq3.dumbbell.1-0\"/><use href=\"#dumbbell-pullover-m-g0-eq3.dumbbell.2-1\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-m-g1-upper.r\"/><use href=\"#dumbbell-pullover-m-g1-elbowcap.r\"/><use href=\"#dumbbell-pullover-m-g1-fore.r\"/><use href=\"#dumbbell-pullover-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-m-g1-upper.r\"/><use href=\"#dumbbell-pullover-m-g1-elbowcap.r\"/><use href=\"#dumbbell-pullover-m-g1-fore.r\"/><use href=\"#dumbbell-pullover-m-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^41\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-m-g1-eq3.dumbbell.1-0\"/><use href=\"#dumbbell-pullover-m-g1-eq3.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-m-g1-eq3.dumbbell.1-0\"/><use href=\"#dumbbell-pullover-m-g1-eq3.dumbbell.2-1\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-m-g2-upper.r\"/><use href=\"#dumbbell-pullover-m-g2-elbowcap.r\"/><use href=\"#dumbbell-pullover-m-g2-fore.r\"/><use href=\"#dumbbell-pullover-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-m-g2-upper.r\"/><use href=\"#dumbbell-pullover-m-g2-elbowcap.r\"/><use href=\"#dumbbell-pullover-m-g2-fore.r\"/><use href=\"#dumbbell-pullover-m-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^42\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-m-g2-eq3.dumbbell.1-0\"/><use href=\"#dumbbell-pullover-m-g2-eq3.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-m-g2-eq3.dumbbell.1-0\"/><use href=\"#dumbbell-pullover-m-g2-eq3.dumbbell.2-1\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-m-e-thigh.l\"/><use href=\"#dumbbell-pullover-m-e-kneecap.l\"/><use href=\"#dumbbell-pullover-m-e-shank.l\"/><use href=\"#dumbbell-pullover-m-e-foot.l\"/><use href=\"#dumbbell-pullover-m-e-shcap.l\"/><use href=\"#dumbbell-pullover-m-e-upper.l\"/><use href=\"#dumbbell-pullover-m-e-elbowcap.l\"/><use href=\"#dumbbell-pullover-m-e-fore.l\"/><use href=\"#dumbbell-pullover-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-m-e-thigh.l\"/><use href=\"#dumbbell-pullover-m-e-kneecap.l\"/><use href=\"#dumbbell-pullover-m-e-shank.l\"/><use href=\"#dumbbell-pullover-m-e-foot.l\"/><use href=\"#dumbbell-pullover-m-e-shcap.l\"/><use href=\"#dumbbell-pullover-m-e-upper.l\"/><use href=\"#dumbbell-pullover-m-e-elbowcap.l\"/><use href=\"#dumbbell-pullover-m-e-fore.l\"/><use href=\"#dumbbell-pullover-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-m-e-head\"/><use href=\"#dumbbell-pullover-m-e-torso\"/><use href=\"#dumbbell-pullover-m-e-thigh.r\"/><use href=\"#dumbbell-pullover-m-e-kneecap.r\"/><use href=\"#dumbbell-pullover-m-e-shank.r\"/><use href=\"#dumbbell-pullover-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-m-e-head\"/><use href=\"#dumbbell-pullover-m-e-torso\"/><use href=\"#dumbbell-pullover-m-e-thigh.r\"/><use href=\"#dumbbell-pullover-m-e-kneecap.r\"/><use href=\"#dumbbell-pullover-m-e-shank.r\"/><use href=\"#dumbbell-pullover-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-m-e-shcap.r\"/><use href=\"#dumbbell-pullover-m-e-upper.r\"/><use href=\"#dumbbell-pullover-m-e-elbowcap.r\"/><use href=\"#dumbbell-pullover-m-e-fore.r\"/><use href=\"#dumbbell-pullover-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-pullover-m-e-shcap.r\"/><use href=\"#dumbbell-pullover-m-e-upper.r\"/><use href=\"#dumbbell-pullover-m-e-elbowcap.r\"/><use href=\"#dumbbell-pullover-m-e-fore.r\"/><use href=\"#dumbbell-pullover-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^44\"/><path class=\"disc\" d=\"^45\"/><path class=\"disc\" d=\"^46\"/><circle class=\"joint\" cx=\"147.07\" cy=\"262.78\" r=\"2.25\"/><circle class=\"joint\" cx=\"100.71\" cy=\"262.47\" r=\"2.25\"/><circle class=\"joint\" cx=\"215\" cy=\"255.62\" r=\"2.25\"/><circle class=\"joint\" cx=\"276.84\" cy=\"266.08\" r=\"2.25\"/></g><mask id=\"dumbbell-pullover-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#dumbbell-pullover-m-mf-head\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-mf-torso\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-mf-shank.l\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-mf-foot.l\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-m-upper.l\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-m-fore.l\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-m-fist.l\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-mf-shank.r\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-mf-foot.r\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-m-upper.r\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-m-fore.r\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-m-fist.r\" fill=\"#000\"/><use href=\"#dumbbell-pullover-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-pullover-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#dumbbell-pullover-m-mmask)\"><g class=\"u-stroke\"><use href=\"#dumbbell-pullover-m-m-upper.l\"/><use href=\"#dumbbell-pullover-m-m-elbowcap.l\"/><use href=\"#dumbbell-pullover-m-m-fore.l\"/><use href=\"#dumbbell-pullover-m-m-fist.l\"/><use href=\"#dumbbell-pullover-m-m-upper.r\"/><use href=\"#dumbbell-pullover-m-m-elbowcap.r\"/><use href=\"#dumbbell-pullover-m-m-fore.r\"/><use href=\"#dumbbell-pullover-m-m-fist.r\"/><use href=\"#dumbbell-pullover-m-m-eq0\"/><use href=\"#dumbbell-pullover-m-m-eq1\"/><use href=\"#dumbbell-pullover-m-m-eq2\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MNSh!VY1LKrPO1LKrOO1LPrOO1LYW10LPrPO1LKrPO1\"/><path class=\"m-arrow\" d=\"~MFKbyNU1LHV3E2MToFjLUoEjL*R1w1\"/><path class=\"leader m\" d=\"M105.83 238.98L155 220H165\"/><path class=\"leader m\" d=\"M81.21 281.45L107 308H117\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dumbbell-pullover-m-bend\" data-key=\"bend\" data-cue=\"Your elbows bend a lot as the dumbbell goes back.\" class=\"plate-callout two m\" style=\"left:44.69%;top:55.31%\" aria-pressed=\"true\">Elbows<br>bend</button><button type=\"button\" id=\"dumbbell-pullover-m-near\" data-key=\"near\" data-cue=\"The dumbbell comes in close to your head and shoulders.\" class=\"plate-callout two m\" style=\"left:31.28%;top:79.89%\" aria-pressed=\"false\">Weight<br>comes in</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "five",
        cues: [{ key: "five", cue: "Keep your head, blades and hips on the bench and both feet down." }, { key: "bend", cue: "Keep the same slight bend in your elbows the whole way." }, { key: "hips", cue: "Keep your hips on the bench as the weight goes back." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "bend",
        cues: [{ key: "bend", cue: "Your elbows bend a lot as the dumbbell goes back." }, { key: "near", cue: "The dumbbell comes in close to your head and shoulders." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Elbows bend</b><span>Your elbows bend a lot as the dumbbell goes back.</span></li><li><b>Weight comes in</b><span>The dumbbell comes in close to your head and shoulders.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower 2 seconds, pull 1 second\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>1 s</span></div></div></div>",
      alt: "Dumbbell pullover, side view. Lying on a flat bench with the head at its end, feet flat, the lifter holds one dumbbell over the upper chest in both hands, arms nearly straight, and lowers it back over the head in an arc at the same elbow bend, then pulls it back.",
      mistakeAlt: "Dumbbell Pullover: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hold",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: cupped-dumbbell has no key (hand-cupped.mjs has no pullover variant) and no card number for the cradle pose; the grip copy carries c3 and c13.",
    "handle": "dumbbell",
    "overBody": true,
    "width": {
      "text": "Both hands on one dumbbell, one palm each side.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c3"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c3"
      }
    },
    "contact": "cupped",
    "wrist": {
      "exempt": "c13: the dumbbell hangs naturally; no source gives a wrist range.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c13"
      }
    },
    "faults": [
      {
        "key": "tilted-flat",
        "label": "Dumbbell tilted",
        "pose": {},
        "markers": [],
        "alt": "Dumbbell tilted flat, held by the wrists."
      }
    ],
    "gripLine": "Palms cradle the top plate, thumbs overlapping behind the handle. Let it hang vertically, not tilted flat by the wrists.",
    "cue": "Cradle the plate, grip securely."
  },
  contacts: [
    "bench-lying"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Head as far up the bench as possible, feet flat.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c2, c1"
      }
    },
    {
      "kind": "brace",
      "text": "Keep five points of contact. Head neutral, eyes on the ceiling.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c1, c9"
      }
    },
    {
      "kind": "get-in",
      "text": "Take the dumbbell from a spotter, or lift it from your thigh.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c21"
      }
    },
    {
      "kind": "grip",
      "text": "Cradle the top plate, thumbs overlapping behind the handle. Grip it securely.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c3, c11"
      }
    },
    {
      "kind": "position",
      "text": "Dumbbell above your upper chest, arms vertical, elbows slightly bent.",
      "zoom": "elbow-bend-constant",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c4"
      }
    }
  ],
  posture: [
    {
      "key": "contact",
      "label": "Five points",
      "detail": "Head, shoulder blades and buttocks on the bench, both feet on the floor.",
      "anchor": {
        "pose": "start",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c1"
      }
    },
    {
      "key": "bend",
      "label": "Same elbow bend",
      "detail": "Same slight elbow bend throughout.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "zoom": "elbow-bend-constant",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c6"
      }
    },
    {
      "key": "hips",
      "label": "Hips down",
      "detail": "Hips on the bench, heels down, abs braced.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c8"
      }
    },
    {
      "key": "head",
      "label": "Head neutral",
      "detail": "Head neutral, eyes on the ceiling.",
      "anchor": {
        "pose": "end",
        "at": "head"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c9"
      }
    },
    {
      "key": "hang",
      "label": "Dumbbell hangs",
      "detail": "Dumbbell hangs naturally. Lower only to a stretch you control.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover",
          "strengthlog-pullover"
        ],
        "note": "c13, c5"
      }
    }
  ],
  zooms: [
    {
      "key": "elbow-bend-constant",
      "chip": "Elbow bend",
      "heading": "Elbow bend",
      "kind": "posture",
      "feelRow": "triceps"
    }
  ],
  chips: [
    "elbow-bend-constant",
    "feel"
  ],
  copy: {
    "setupLine": "Head high on the bench, five points of contact. Dumbbell above your upper chest.",
    "mistakeLine": "Keep the same slight elbow bend. Never turn it into a triceps extension.",
    "cueLine": "Same elbow bend."
  },
  mistakes: [
    {
      "key": "bend",
      "title": "Elbows bending into triceps extension",
      "zoom": "elbow-bend-constant",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c7"
      },
      "fix": "Keep the same slight bend all the way."
    },
    {
      "key": "hips",
      "title": "Hips rising off the bench",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c8"
      },
      "fix": "Dig your heels in, brace, stop where shoulder range ends."
    },
    {
      "key": "let-go",
      "title": "Letting go too early",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c10"
      },
      "fix": "Grip until the spotter has it or it rests on your thigh."
    }
  ],
  risks: [
    {
      "key": "face",
      "text": "Dumbbell over the face: grip it securely and use a spotter.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover"
        ],
        "note": "c10, c11"
      }
    },
    {
      "key": "dropped",
      "text": "In US hospital data, dropped weights are the top cause of lifting injuries.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "kerr2010"
        ],
        "note": "c19"
      }
    },
    {
      "key": "jumps",
      "text": "Even small weight jumps load the shoulders hard at the bottom. Start light.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bm-pullover",
          "acsm2009"
        ],
        "note": "c12"
      }
    }
  ],
  riskFlags: [
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
    "bm-pullover",
    "strengthlog-pullover",
    "kerr2010",
    "kolber2010",
    "acsm2009",
    "nhs-shoulder-pain",
    "nhs-elbow-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/dumbbell_pullover.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

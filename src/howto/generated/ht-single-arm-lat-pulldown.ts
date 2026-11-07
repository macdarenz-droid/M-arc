// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=b7cc9fdd9107f1c1d46efdf35a9ca5b28bf290472d082693c6699dfcb044b44a
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_single_arm_lat_pulldown",
  name: "Single-Arm Lat Pulldown",
  hashes: { inputsSha256: "b7cc9fdd9107f1c1d46efdf35a9ca5b28bf290472d082693c6699dfcb044b44a", golden: "8aa07c7d733dd15c94f9df78b9390ec4600854b03b460b32f6aae75bf386c8fd" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"single-arm-lat-pulldown-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"single-arm-lat-pulldown-n-st-torso\" d=\"~#_12YKkW(z1XOkXTy1XaKcG4W7PaYjY84_cNdw6lI8El)lT5Gby5Hez5NiX6SjOfAf-g!3*8x8xeBqTuObxo*5K1EbvwdyhS3!6Bcz6zeY4-3wnw6P6(7BeP4F9.B2NF110001000020000000200010101001000020000000010020200010100111111012000100000002000000021022000000000000101001002000010\"/><path id=\"single-arm-lat-pulldown-n-st-shcap.r\" d=\"~~_BlPXE1PI10\"/><path id=\"single-arm-lat-pulldown-n-st-upper.r\" d=\"~#F12Y.nyxF1-TnKwG1B2_773H7OH1*3U4.1J2Xc_w1TcUeE3PeA5UiR2Az1m(2W1!5PbTG1a2K1w8DeD4Dh.jN4.jx7Ep21010101000002200000000001001000001000000100000001011001001000000000001010100200\"/><path id=\"single-arm-lat-pulldown-n-st-elbowcap.r\" d=\"~~SJnPPv!v2\"/><path id=\"single-arm-lat-pulldown-n-st-fore.r\" d=\"~#F12AKpJXvEBpROw1K3_89-1w5)D1.4S7*1_1K6!sO8Aaz2!9W3UcV5Atw1H2J1(8DbTB1w1R1bJ9(8F2wdKfD3GfT5Ej01000000000100011110100020000200010000200000000010100000111000020001110111000201\"/><path id=\"single-arm-lat-pulldown-n-st-fist.r\" d=\"~~_GpN!mwt0\"/><path id=\"single-arm-lat-pulldown-n-g0-shcap.r\" d=\"~~UylDyF1PI10\"/><path id=\"single-arm-lat-pulldown-n-g0-upper.r\" d=\"~#F12FVnDVF1)FnKJG1G3Y553HdKw1K4Y2B2H1)eyjTfFbR6NdsFjX5SnaS2kD5FhRu84O2A6yaYcJlIf_8GivEq00101200200100200201000100011010100020100020000000010000100210000020000000000000\"/><path id=\"single-arm-lat-pulldown-n-g0-elbowcap.r\" d=\"~~WKoP*x1!v2\"/><path id=\"single-arm-lat-pulldown-n-g0-fore.r\" d=\"~#F12_NqSwy1KHqRSy1z2S6jG1fRs-3_5R1J1)1_gB7wbtyaA5DcB1_gJ1W1U2J6W5)rsB1s!6S8y8yb.gN1Of.7Oi00210111010000001200020000000000000000101100000011000001200002002010110002020000\"/><path id=\"single-arm-lat-pulldown-n-g0-fist.r\" d=\"~~HzpYRrwt0\"/><path id=\"single-arm-lat-pulldown-n-g1-shcap.r\" d=\"~~J)k!JF1PI10\"/><path id=\"single-arm-lat-pulldown-n-g1-upper.r\" d=\"~#F12J_mPVG1Kxmx(G1E6(137Dw1ReB5z1O2dEoW3zjO2*dF5TcUeTkJdR1w2x3F4Wx1Oa28)5Y2E1DgyqJ3wjE7Fh-j02012100202101000101200000010000010200001001000020000000000000001000000002001210\"/><path id=\"single-arm-lat-pulldown-n-g1-elbowcap.r\" d=\"~~YYrU(B1!v2\"/><path id=\"single-arm-lat-pulldown-n-g1-fore.r\" d=\"~#F12FWtHOB1G!t)wD1Y1Y6E1n.fxo1(6jy2S7Pf5AdW4y9_aN7F8Afw2oW5(3Ga.q0K1S4H5Jby2aBkB7-dRgKb00020002100101101000100001200000000000000012000100000001010021011101101010002000\"/><path id=\"single-arm-lat-pulldown-n-g1-fist.r\" d=\"~~!!oyEw1wt0\"/><path id=\"single-arm-lat-pulldown-n-g2-shcap.r\" d=\"~~D!kSXF1PI10\"/><path id=\"single-arm-lat-pulldown-n-g2-upper.r\" d=\"~#F12UPlN!G1KXkVIG1z6G447Jz1SjX2z5K1K2Tn.kR9XgTc*7EjB1ztzc-27.55Dx1Dn5aT6X3Ia(awdYmHhYaFq_110000000000010000000000002000000000200010001000010010110121000001210010100020000\"/><path id=\"single-arm-lat-pulldown-n-g2-elbowcap.r\" d=\"~~_*rH*J1!v2\"/><path id=\"single-arm-lat-pulldown-n-g2-fore.r\" d=\"~#F12S!tSPJ1TzuRFK1A2(8E1B1XhOy18!8hS2Wa!qG1yd(3N9AaH8NbUqD2H1A6P6.b.A12-1!4_7_8.2w2)j)5OeRfXc10002000000010000000000001010101010010000001010012100000000000000200000110000012\"/><path id=\"single-arm-lat-pulldown-n-g2-fist.r\" d=\"~~JWoJ!A1wt0\"/><path id=\"single-arm-lat-pulldown-n-e-thigh.l\" d=\"~#F12FDn((W1R.lVwX1TaF13A1w-1r*6X5K3R2xP1E4Gk)bIilElJaBP1cV3H2E7D5UY1J52B1Ta)1Xb_rFA1HlPw1H1_B1Ki00002000100020010000000000000010000200010001010000001000000002000000000010000110\"/><path id=\"single-arm-lat-pulldown-n-e-kneecap.l\" d=\"~~Jzx1JEV1UF11\"/><path id=\"single-arm-lat-pulldown-n-e-shank.l\" d=\"~#F12Ayx1wzV1.Gx1XYT1W2OaA12O1F-1A6O6_2G3(2X!1_7RbD1-aI5*cU9).1x2-3V4V7EaHY1z11h.aTcJ9Ee(k)1UjS9Pn00001001010002120001010001000000200000000000001111000010000010000000010002001000\"/><path id=\"single-arm-lat-pulldown-n-e-foot.l\" d=\"~#o2AKw1DH)1x*w1EK(1Sbw3wgG7DnXlDR2.2TB2G4Xy1G7Xl2XB1H4zaTbyqzaEkFn010002002100000200000021010000100101000002200200\"/><path id=\"single-arm-lat-pulldown-n-e-shcap.l\" d=\"~~Y)kwRF1PI10\"/><path id=\"single-arm-lat-pulldown-n-e-upper.l\" d=\"~#F12JwlHYF1E!k)_E1rI7c1W8SD1w2I5sT24EuD6EiR2Xe-bBfzaOsV1E2V3G4P4DE192T1B7xfE1K8(oN3wkDg_k01000100201010000002100000022000000000000000000200100010100000000010000000000000\"/><path id=\"single-arm-lat-pulldown-n-e-elbowcap.l\" d=\"~~YUmyAP1!v2\"/><path id=\"single-arm-lat-pulldown-n-e-fore.l\" d=\"~#F12WBn!xR1TWmGXP1E5G4J13Uq!9*3T5l*1-e*7R7Vax9T4Bdczfz7)1k.66_nNfqD1V6T1Va(4SbNgwey7Akh00000000000000002000001011000001101000000202000200111100001011110111110002000100\"/><path id=\"single-arm-lat-pulldown-n-e-fist.l\" d=\"~~SKsH)S1wt0\"/><path id=\"single-arm-lat-pulldown-n-e-head\" d=\"~#w12Azl_Ov.TjKNvRe!jXfHbRaG1z2_4K5O6X8*8*iOhP2Bc-2G8BhW2PiBdyj*8Aj1PjUbD1Jh0010000121110000200000002000022000000011010000110000000002100022\"/><path id=\"single-arm-lat-pulldown-n-e-torso\" d=\"~#_12YKkW(z1XOkXTy1-9X2K5K3(9(cP9J8_cNdw6lI8El)lT5Gby5Hez5NiX6SjOfAf-g!3*8x8xeBqTuObxo*5K1EbvwdyhS3!6Bcz6Rd(aK4_gS5aN8)7P4F9.B2NF110100111101110002200010101001000020000000010020200010100111111012000100000002000000021022000011111000000011002000010\"/><path id=\"single-arm-lat-pulldown-n-e-thigh.r\" d=\"^21\"/><path id=\"single-arm-lat-pulldown-n-e-kneecap.r\" d=\"^22\"/><path id=\"single-arm-lat-pulldown-n-e-shank.r\" d=\"^23\"/><path id=\"single-arm-lat-pulldown-n-e-foot.r\" d=\"^24\"/><path id=\"single-arm-lat-pulldown-n-e-shcap.r\" d=\"~~(YkDyG1PI10\"/><path id=\"single-arm-lat-pulldown-n-e-upper.r\" d=\"~#F12y-kF)F1z!k)(E1ux8a0nDI1D3z5P1V2S7Iy1FaIgw1-e.7Th-2zz1B1-2O2R5x5!H1702x8Oe)1xeFmG1Hk_a(n10110100000000021010001010000000002000000010100000000002200002002000000020001010\"/><path id=\"single-arm-lat-pulldown-n-e-elbowcap.r\" d=\"~~ASkFOR1!v2\"/><path id=\"single-arm-lat-pulldown-n-e-fore.r\" d=\"~#F12yPm_*R1TymGTS1K5U74-1FeTA1T6F6B2F1GdJqRa_7O4y9iDdRc_qeP2p(8!jXx1N1E1V2y9A8F4Hg.b_6*dpBk00000101000021020002200100002001011010101100011000000200001010000100010200000100\"/><path id=\"single-arm-lat-pulldown-n-e-fist.r\" d=\"~~(OoWRG1wt0\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#single-arm-lat-pulldown-n-dots)\"/>\n  <path class=\"floorline\" d=\"M47.74 338.84H310.26\"/><path class=\"eq\" d=\"~MW!oYAaLYPv0QJ90IEvI9LI9TlQ0I9I9UlLIEvJ9QI90JEvJ9LJ9UlQ0J9J9TlZ\"/><path class=\"eq\" d=\"~MSVqYAaL0Fy2\"/><path class=\"eq\" d=\"~MFVT1YAaL0w_1\"/><path class=\"eq\" d=\"~MyYP1Uyy2L(s0QF60VmE6LE6zIX1Q0E6E6AIX1LVmF6QE60WmF6LF6AIX1Q0F6F6zIX1Z\"/><path class=\"eq\" d=\"~MPOX1Uyy2L(s0QF60VmE6LE6zIX1Q0E6E6AIX1LVmF6QE60WmF6LF6AIX1Q0F6F6zIX1Z\"/><path class=\"eq\" d=\"~MFAiSw-1LyH90Qwp0xR8)oL)owhQ0)o)o)gLxR8wpQ)o0yR8wpLwp)gQ0wpwpwhZ\"/><path class=\"eq\" d=\"~MNwmAO-1L0JU7Q0F6F6zN7L(uE6QF60*uE6LE6zN7Q0E6E6AN7L*uF6QE60(uF6Z\"/><path class=\"eq\" d=\"~MFGhUyy2Lywb0QF60--aE6LE6z6Q0E6E6A6L--aF6QE60_-aF6LF6A6Q0F6F6z6Z\"/><path class=\"eq-solid\" d=\"~~HPpwEcHB11\"/><path class=\"eq-pin\" d=\"~~HOqwEcF60\"/><path class=\"eq-solid\" d=\"~~FYS1Y(bwt0\"/><path class=\"eq-pin\" d=\"~~wOT1Y(bF60\"/><path class=\"eq-cable\" d=\"~MSVqYxbLW)o0\"/><path class=\"eq\" d=\"~MDWS1Uyy2LyY30QF60-R3E6LE6)uQ0E6E6wvL-R3F6QE60_R3F6LF6wvQ0F6F6)uZ\"/><path class=\"eq\" d=\"~M(OS1DI.1LSA40LRA4WB5LRA4VB5Z\"/><path class=\"eq-thin\" d=\"M258.55 327.07H279.76M258.55 323.75H279.76M258.55 320.44H279.76M258.55 317.12H279.76M258.55 313.81H279.76M258.55 310.49H279.76M258.55 307.18H279.76\"/><path class=\"eq-thin\" d=\"~M_FT1!Pw2L0z(P1\"/><path class=\"eq-thin\" d=\"~MW.V1!Pw2L0z(P1\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-n-st-torso\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-n-st-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-n-st-shcap.r\"/><use href=\"#single-arm-lat-pulldown-n-st-upper.r\"/><use href=\"#single-arm-lat-pulldown-n-st-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-n-st-fore.r\"/><use href=\"#single-arm-lat-pulldown-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-n-st-shcap.r\"/><use href=\"#single-arm-lat-pulldown-n-st-upper.r\"/><use href=\"#single-arm-lat-pulldown-n-st-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-n-st-fore.r\"/><use href=\"#single-arm-lat-pulldown-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"~MPXoPzrLYS2U3L-H2w5LG8bLE89LBH2ObL(H2z5LD8eZ\"/><path class=\"eq\" d=\"~MHHoUGrLFT1Tz3LXN1Dy3LJ1P4LK4J1LXU1D)2L!N1By3LO1O4Z\"/><path class=\"eq\" d=\"~MUHrHTrLOH1TE3LHJ1Hz3LH4_1L-1H4LDD1_B3LGJ1Gz3LG4-1Z\"/><path class=\"eq\" d=\"~MPTqADoLE4EaL)5w6L0P8Lw6w6LP80Lw6)5L0O8Z\"/><path class=\"eq-cable\" d=\"~MwBqADoLTkz*b\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-n-g0-shcap.r\"/><use href=\"#single-arm-lat-pulldown-n-g0-upper.r\"/><use href=\"#single-arm-lat-pulldown-n-g0-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-n-g0-fore.r\"/><use href=\"#single-arm-lat-pulldown-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-n-g0-shcap.r\"/><use href=\"#single-arm-lat-pulldown-n-g0-upper.r\"/><use href=\"#single-arm-lat-pulldown-n-g0-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-n-g0-fore.r\"/><use href=\"#single-arm-lat-pulldown-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"~MwRo_YvL_S2U3L.H2w5LG8bLE89LBH2ObL!H2z5LH8eZ\"/><path class=\"eq\" d=\"~M_zo((vLHT1Tz3L.N1Dy3LP1P4LR4J1LTU1D)2LYN1By3LI1O4Z\"/><path class=\"eq\" d=\"~MAArUFw1LOH1TE3LHJ1Hz3LJ4_1L.1H4LDD1_B3LGJ1Gz3LG4-1Z\"/><path class=\"eq\" d=\"~MyKqN.sLE4EaLx6w6L2P8Lw6w6LP80Lw6)5L2O8Z\"/><path class=\"eq-cable\" d=\"~MP(pN.sLBeKTg\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-n-g1-shcap.r\"/><use href=\"#single-arm-lat-pulldown-n-g1-upper.r\"/><use href=\"#single-arm-lat-pulldown-n-g1-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-n-g1-fore.r\"/><use href=\"#single-arm-lat-pulldown-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-n-g1-shcap.r\"/><use href=\"#single-arm-lat-pulldown-n-g1-upper.r\"/><use href=\"#single-arm-lat-pulldown-n-g1-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-n-g1-fore.r\"/><use href=\"#single-arm-lat-pulldown-n-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"~MSHoANA1LYS2U3L-H2w5LG8bLE89LzH2ObL_H2x5LH8aZ\"/><path class=\"eq\" d=\"~MJ*nFUA1LFT1Tz3LXN1Dy3LJ1P4LK4J1LXU1D)2L!N1By3LK1O4Z\"/><path class=\"eq\" d=\"~MW*q(*A1LOH1TE3LHJ1Hz3LH4_1L-1H4LDD1_B3LGJ1Gz3LG4-1Z\"/><path class=\"eq\" d=\"~MSDqYPx1LE4EaL)5w6L0P8Lw6w6LP80Lw6)5L0O8Z\"/><path class=\"eq-cable\" d=\"~MyYpYPx1LX7GGl\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-n-g2-shcap.r\"/><use href=\"#single-arm-lat-pulldown-n-g2-upper.r\"/><use href=\"#single-arm-lat-pulldown-n-g2-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-n-g2-fore.r\"/><use href=\"#single-arm-lat-pulldown-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-n-g2-shcap.r\"/><use href=\"#single-arm-lat-pulldown-n-g2-upper.r\"/><use href=\"#single-arm-lat-pulldown-n-g2-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-n-g2-fore.r\"/><use href=\"#single-arm-lat-pulldown-n-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~M(OS1YWy1LSA40LRA4YB5LRA4XB5Z\"/><path class=\"eq-thin\" d=\"M258.55 200.92H279.76M258.55 197.61H279.76M258.55 194.29H279.76M258.55 190.98H279.76M258.55 187.66H279.76M258.55 184.35H279.76M258.55 181.04H279.76\"/><path class=\"eq-cable\" d=\"~MFSU1Y(bL0wYm\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-n-e-thigh.l\"/><use href=\"#single-arm-lat-pulldown-n-e-kneecap.l\"/><use href=\"#single-arm-lat-pulldown-n-e-shank.l\"/><use href=\"#single-arm-lat-pulldown-n-e-foot.l\"/><use href=\"#single-arm-lat-pulldown-n-e-shcap.l\"/><use href=\"#single-arm-lat-pulldown-n-e-upper.l\"/><use href=\"#single-arm-lat-pulldown-n-e-elbowcap.l\"/><use href=\"#single-arm-lat-pulldown-n-e-fore.l\"/><use href=\"#single-arm-lat-pulldown-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-n-e-thigh.l\"/><use href=\"#single-arm-lat-pulldown-n-e-kneecap.l\"/><use href=\"#single-arm-lat-pulldown-n-e-shank.l\"/><use href=\"#single-arm-lat-pulldown-n-e-foot.l\"/><use href=\"#single-arm-lat-pulldown-n-e-shcap.l\"/><use href=\"#single-arm-lat-pulldown-n-e-upper.l\"/><use href=\"#single-arm-lat-pulldown-n-e-elbowcap.l\"/><use href=\"#single-arm-lat-pulldown-n-e-fore.l\"/><use href=\"#single-arm-lat-pulldown-n-e-fist.l\"/></g></g><path class=\"eq\" d=\"~MWYgUyy2LJyd0QF60z!cE6LE6XhQ0E6E6YhLz!cF6QE60A!cF6LF6YhQ0F6F6XhZ\"/><path class=\"eq\" d=\"~MwEJ1Uyy2LWPb0QF60KHbE6LE6XhQ0E6E6YhLKHbF6QE60NHbF6LF6YhQ0F6F6XhZ\"/><path class=\"eq\" d=\"~M(*v((R1LKz9w!8QO4J4Hz9BT8LPew6QJ4N4O5VeLS_8z!8QP4G4Gz9DT8LOe)5QI4K4P5WeZ\"/><path class=\"eq\" d=\"~~NwvPDS1SK10\"/><path class=\"eq-pin\" d=\"~~YEw1PDS1F60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-n-e-head\"/><use href=\"#single-arm-lat-pulldown-n-e-torso\"/><use href=\"#single-arm-lat-pulldown-n-e-thigh.r\"/><use href=\"#single-arm-lat-pulldown-n-e-kneecap.r\"/><use href=\"#single-arm-lat-pulldown-n-e-shank.r\"/><use href=\"#single-arm-lat-pulldown-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-n-e-head\"/><use href=\"#single-arm-lat-pulldown-n-e-torso\"/><use href=\"#single-arm-lat-pulldown-n-e-thigh.r\"/><use href=\"#single-arm-lat-pulldown-n-e-kneecap.r\"/><use href=\"#single-arm-lat-pulldown-n-e-shank.r\"/><use href=\"#single-arm-lat-pulldown-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~MyAoNzG1L_S2U3L.H2w5LG8bLE89LBH2ObL!H2x5LH8aZ\"/><path class=\"eq\" d=\"~M!WnSGG1LHT1Tz3L.N1Dy3LP1P4LO4J1LXU1D)2L_N1By3LI1O4Z\"/><path class=\"eq\" d=\"~MFXqFTG1LOH1TE3LHJ1Hz3LH4_1L-1H4LDD1_B3LGJ1Gz3LG4-1Z\"/><path class=\"eq\" d=\"~MAwqyDD1LE4EaL)5w6L0P8Lw6w6LP80Lw6)5L0O8Z\"/><path class=\"eq-cable\" d=\"~MURpyDD1LG1)(p\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-n-e-shcap.r\"/><use href=\"#single-arm-lat-pulldown-n-e-upper.r\"/><use href=\"#single-arm-lat-pulldown-n-e-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-n-e-fore.r\"/><use href=\"#single-arm-lat-pulldown-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-n-e-shcap.r\"/><use href=\"#single-arm-lat-pulldown-n-e-upper.r\"/><use href=\"#single-arm-lat-pulldown-n-e-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-n-e-fore.r\"/><use href=\"#single-arm-lat-pulldown-n-e-fist.r\"/></g></g><path class=\"eq\" d=\"^77\"/><path class=\"eq-pin\" d=\"^78\"/><circle class=\"joint\" cx=\"113.35\" cy=\"210.27\" r=\"2.25\"/><circle class=\"joint\" cx=\"110.41\" cy=\"253.32\" r=\"2.25\"/><circle class=\"joint\" cx=\"119.19\" cy=\"270.3\" r=\"2.25\"/><circle class=\"joint\" cx=\"176\" cy=\"272.54\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#D20SzqyEpzAqT_o2010201201201020100020100020122110002010002010201000221120100020100000002200020002100001010100010001001000000000000002000200220000010111000100010001000000002000000002100200020000010101001100010001000000000000\"/><path class=\"arrow\" d=\"~MyOpywF1LxhGD1LPW1(E1Z\"/></g><path class=\"leader\" d=\"M180.08 264.33L183 258H193\"/><circle class=\"anchor\" cx=\"180.08\" cy=\"264.33\" r=\"1.5\"/><path class=\"leader\" d=\"~MUwm!WE1LVw5z2\"/><circle class=\"anchor\" cx=\"112.74\" cy=\"203.34\" r=\"1.5\"/><path class=\"leader\" d=\"M110.41 253.32L90.08 258H80.08\"/><circle class=\"anchor\" cx=\"110.41\" cy=\"253.32\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"single-arm-lat-pulldown-n-thighs\" data-key=\"thighs\" data-cue=\"Set the thighs tight under the pads.\" class=\"plate-callout two\" style=\"left:52.51%;top:65.92%\" aria-pressed=\"true\">Thighs<br>pinned</button><button type=\"button\" id=\"single-arm-lat-pulldown-n-shoulder\" data-key=\"shoulder\" data-cue=\"Drop the shoulder away from the ear before the elbow bends.\" class=\"plate-callout two\" style=\"left:1.12%;top:50.56%\" aria-pressed=\"false\">Shoulder<br>down first</button><button type=\"button\" id=\"single-arm-lat-pulldown-n-pocket\" data-key=\"pocket\" data-cue=\"Pull the elbow back and down toward the back pocket.\" class=\"plate-callout two\" style=\"left:1.12%;top:65.92%\" aria-pressed=\"false\">Elbow<br>to pocket</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"single-arm-lat-pulldown-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"single-arm-lat-pulldown-m-st-torso\" d=\"^0\"/><path id=\"single-arm-lat-pulldown-m-st-shcap.r\" d=\"^1\"/><path id=\"single-arm-lat-pulldown-m-st-upper.r\" d=\"^2\"/><path id=\"single-arm-lat-pulldown-m-st-elbowcap.r\" d=\"^3\"/><path id=\"single-arm-lat-pulldown-m-st-fore.r\" d=\"^4\"/><path id=\"single-arm-lat-pulldown-m-st-fist.r\" d=\"^5\"/><path id=\"single-arm-lat-pulldown-m-g0-shcap.r\" d=\"^6\"/><path id=\"single-arm-lat-pulldown-m-g0-upper.r\" d=\"^7\"/><path id=\"single-arm-lat-pulldown-m-g0-elbowcap.r\" d=\"^8\"/><path id=\"single-arm-lat-pulldown-m-g0-fore.r\" d=\"^9\"/><path id=\"single-arm-lat-pulldown-m-g0-fist.r\" d=\"^10\"/><path id=\"single-arm-lat-pulldown-m-g1-shcap.r\" d=\"^11\"/><path id=\"single-arm-lat-pulldown-m-g1-upper.r\" d=\"^12\"/><path id=\"single-arm-lat-pulldown-m-g1-elbowcap.r\" d=\"^13\"/><path id=\"single-arm-lat-pulldown-m-g1-fore.r\" d=\"^14\"/><path id=\"single-arm-lat-pulldown-m-g1-fist.r\" d=\"^15\"/><path id=\"single-arm-lat-pulldown-m-g2-shcap.r\" d=\"^16\"/><path id=\"single-arm-lat-pulldown-m-g2-upper.r\" d=\"^17\"/><path id=\"single-arm-lat-pulldown-m-g2-elbowcap.r\" d=\"^18\"/><path id=\"single-arm-lat-pulldown-m-g2-fore.r\" d=\"^19\"/><path id=\"single-arm-lat-pulldown-m-g2-fist.r\" d=\"^20\"/><path id=\"single-arm-lat-pulldown-m-e-thigh.l\" d=\"^21\"/><path id=\"single-arm-lat-pulldown-m-e-kneecap.l\" d=\"^22\"/><path id=\"single-arm-lat-pulldown-m-e-shank.l\" d=\"^23\"/><path id=\"single-arm-lat-pulldown-m-e-foot.l\" d=\"^24\"/><path id=\"single-arm-lat-pulldown-m-e-shcap.l\" d=\"^25\"/><path id=\"single-arm-lat-pulldown-m-e-upper.l\" d=\"^26\"/><path id=\"single-arm-lat-pulldown-m-e-elbowcap.l\" d=\"^27\"/><path id=\"single-arm-lat-pulldown-m-e-fore.l\" d=\"^28\"/><path id=\"single-arm-lat-pulldown-m-e-fist.l\" d=\"^29\"/><path id=\"single-arm-lat-pulldown-m-e-head\" d=\"^30\"/><path id=\"single-arm-lat-pulldown-m-e-torso\" d=\"^31\"/><path id=\"single-arm-lat-pulldown-m-e-thigh.r\" d=\"^21\"/><path id=\"single-arm-lat-pulldown-m-e-kneecap.r\" d=\"^22\"/><path id=\"single-arm-lat-pulldown-m-e-shank.r\" d=\"^23\"/><path id=\"single-arm-lat-pulldown-m-e-foot.r\" d=\"^24\"/><path id=\"single-arm-lat-pulldown-m-e-shcap.r\" d=\"^32\"/><path id=\"single-arm-lat-pulldown-m-e-upper.r\" d=\"^33\"/><path id=\"single-arm-lat-pulldown-m-e-elbowcap.r\" d=\"^34\"/><path id=\"single-arm-lat-pulldown-m-e-fore.r\" d=\"^35\"/><path id=\"single-arm-lat-pulldown-m-e-fist.r\" d=\"^36\"/><path id=\"single-arm-lat-pulldown-m-m-shcap.r\" d=\"~~YwmANF1PI10\"/><path id=\"single-arm-lat-pulldown-m-m-upper.r\" d=\"~#F12FOmWKE1*EnXYD1H6z568VuJu(5K1!2rNtGjYiR4Ab*9S6ziPmzrA1X2A2-5Tx1Fr37W5X5)8RbRpD6BfUd*8Uo00002000020220020020000200002000000000000000000101120000210001002000021010000100\"/><path id=\"single-arm-lat-pulldown-m-m-elbowcap.r\" d=\"~~Pzg!xN1!v2\"/><path id=\"single-arm-lat-pulldown-m-m-fore.r\" d=\"~#F12DDhAzO1XJgRyO1I9nS1p_D1K6T8O2E2G1TtA2xcE5zas)aD7Ot_2x2W1x8(3HE15W1ix9H2eD9Siw8PfE1!g)a21001000000101000101010000000022000020002100000020000100000101000020000210000001\"/><path id=\"single-arm-lat-pulldown-m-m-fist.r\" d=\"~~W)oDHK1wt0\"/><path id=\"single-arm-lat-pulldown-m-m-eq0\" d=\"~MSTo_!J1L!S2(1L-H2S6LE87LG83LGH2xaLWH2R6LH86Z\"/><path id=\"single-arm-lat-pulldown-m-m-eq1\" d=\"~MPDoAzK1LHR1RA3L.J1yz3LP1N4LI4N1L*S1Fw3L(J1zz3LO1K4Z\"/><path id=\"single-arm-lat-pulldown-m-m-eq2\" d=\"~MwEr(HK1LRJ1XD3LHN1Jy3LH4Y1LV1J4LDF1wB3LGN1Iy3LG4X1Z\"/><path id=\"single-arm-lat-pulldown-m-m-eq3\" d=\"~MYKqP(G1LE4EaL)5w6L0P8Lw6w6LP80Lw6)5L0O8Z\"/><path id=\"single-arm-lat-pulldown-m-mf-head\" d=\"^30\"/><path id=\"single-arm-lat-pulldown-m-mf-torso\" d=\"~#_12YKkW(z1XOkXTy1zaT6z5w1FaWfD9y5_cNdw6lI8El)lT5Gby5Hez5NiX6SjOfAf-g!3*8x8xeBqTuObxo*5K1EbvwdyhS3!6Bcz6-dN8z4HjW5_2F8OaP4F9.B2NF110100001000020000200010101001000020000000010020200010100111111012000100000002000000021022000000000000001001002000010\"/><path id=\"single-arm-lat-pulldown-m-mf-thigh.l\" d=\"^21\"/><path id=\"single-arm-lat-pulldown-m-mf-kneecap.l\" d=\"^22\"/><path id=\"single-arm-lat-pulldown-m-mf-shank.l\" d=\"^23\"/><path id=\"single-arm-lat-pulldown-m-mf-foot.l\" d=\"^24\"/><path id=\"single-arm-lat-pulldown-m-mf-shcap.l\" d=\"^25\"/><path id=\"single-arm-lat-pulldown-m-mf-upper.l\" d=\"^26\"/><path id=\"single-arm-lat-pulldown-m-mf-elbowcap.l\" d=\"^27\"/><path id=\"single-arm-lat-pulldown-m-mf-fore.l\" d=\"^28\"/><path id=\"single-arm-lat-pulldown-m-mf-fist.l\" d=\"^29\"/><path id=\"single-arm-lat-pulldown-m-mf-thigh.r\" d=\"^21\"/><path id=\"single-arm-lat-pulldown-m-mf-kneecap.r\" d=\"^22\"/><path id=\"single-arm-lat-pulldown-m-mf-shank.r\" d=\"^23\"/><path id=\"single-arm-lat-pulldown-m-mf-foot.r\" d=\"^24\"/><path id=\"single-arm-lat-pulldown-m-mo-0\" d=\"^30\"/><path id=\"single-arm-lat-pulldown-m-mo-1\" d=\"^31\"/><path id=\"single-arm-lat-pulldown-m-mo-2\" d=\"^21\"/><path id=\"single-arm-lat-pulldown-m-mo-3\" d=\"^22\"/><path id=\"single-arm-lat-pulldown-m-mo-4\" d=\"^23\"/><path id=\"single-arm-lat-pulldown-m-mo-5\" d=\"^24\"/><path id=\"single-arm-lat-pulldown-m-mo-6\" d=\"^25\"/><path id=\"single-arm-lat-pulldown-m-mo-7\" d=\"^26\"/><path id=\"single-arm-lat-pulldown-m-mo-8\" d=\"^27\"/><path id=\"single-arm-lat-pulldown-m-mo-9\" d=\"^28\"/><path id=\"single-arm-lat-pulldown-m-mo-10\" d=\"^29\"/><path id=\"single-arm-lat-pulldown-m-mo-11\" d=\"^21\"/><path id=\"single-arm-lat-pulldown-m-mo-12\" d=\"^22\"/><path id=\"single-arm-lat-pulldown-m-mo-13\" d=\"^23\"/><path id=\"single-arm-lat-pulldown-m-mo-14\" d=\"^24\"/><path id=\"single-arm-lat-pulldown-m-mo-15\" d=\"^32\"/><path id=\"single-arm-lat-pulldown-m-mo-16\" d=\"^33\"/><path id=\"single-arm-lat-pulldown-m-mo-17\" d=\"^34\"/><path id=\"single-arm-lat-pulldown-m-mo-18\" d=\"^35\"/><path id=\"single-arm-lat-pulldown-m-mo-19\" d=\"^36\"/><path id=\"single-arm-lat-pulldown-m-mo-20\" d=\"^74\"/><path id=\"single-arm-lat-pulldown-m-mo-21\" d=\"^75\"/><path id=\"single-arm-lat-pulldown-m-mo-22\" d=\"^38\"/><path id=\"single-arm-lat-pulldown-m-mo-23\" d=\"^41\"/><path id=\"single-arm-lat-pulldown-m-mo-24\" d=\"^42\"/><path id=\"single-arm-lat-pulldown-m-mo-25\" d=\"^43\"/><path id=\"single-arm-lat-pulldown-m-mo-26\" d=\"^44\"/><path id=\"single-arm-lat-pulldown-m-mo-27\" d=\"^45\"/><path id=\"single-arm-lat-pulldown-m-mo-28\" d=\"^76\"/><path id=\"single-arm-lat-pulldown-m-mo-29\" d=\"^77\"/><path id=\"single-arm-lat-pulldown-m-mo-30\" d=\"^78\"/><path id=\"single-arm-lat-pulldown-m-mo-31\" d=\"^77\"/><path id=\"single-arm-lat-pulldown-m-mo-32\" d=\"^78\"/><path id=\"single-arm-lat-pulldown-m-mo-33\" d=\"^46\"/><path id=\"single-arm-lat-pulldown-m-mo-34\" d=\"^47\"/><path id=\"single-arm-lat-pulldown-m-mo-35\" d=\"^48\"/><path id=\"single-arm-lat-pulldown-m-mo-36\" d=\"^49\"/><path id=\"single-arm-lat-pulldown-m-mo-37\" d=\"^51\"/><path id=\"single-arm-lat-pulldown-m-mo-38\" d=\"^52\"/><path id=\"single-arm-lat-pulldown-m-mo-39\" d=\"^71\"/><path id=\"single-arm-lat-pulldown-m-mo-40\" d=\"^79\"/><path id=\"single-arm-lat-pulldown-m-mo-41\" d=\"^80\"/><path id=\"single-arm-lat-pulldown-m-mo-42\" d=\"^81\"/><path id=\"single-arm-lat-pulldown-m-mo-43\" d=\"^82\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#single-arm-lat-pulldown-m-dots)\"/>\n  <path class=\"floorline\" d=\"^37\"/><path class=\"eq\" d=\"^38\"/><path class=\"eq\" d=\"^39\"/><path class=\"eq\" d=\"^40\"/><path class=\"eq\" d=\"^41\"/><path class=\"eq\" d=\"^42\"/><path class=\"eq\" d=\"^43\"/><path class=\"eq\" d=\"^44\"/><path class=\"eq\" d=\"^45\"/><path class=\"eq-solid\" d=\"^46\"/><path class=\"eq-pin\" d=\"^47\"/><path class=\"eq-solid\" d=\"^48\"/><path class=\"eq-pin\" d=\"^49\"/><path class=\"eq-cable\" d=\"^50\"/><path class=\"eq\" d=\"^51\"/><path class=\"eq\" d=\"^52\"/><path class=\"eq-thin\" d=\"^53\"/><path class=\"eq-thin\" d=\"^54\"/><path class=\"eq-thin\" d=\"^55\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-m-st-torso\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-m-st-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-m-st-shcap.r\"/><use href=\"#single-arm-lat-pulldown-m-st-upper.r\"/><use href=\"#single-arm-lat-pulldown-m-st-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-m-st-fore.r\"/><use href=\"#single-arm-lat-pulldown-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-m-st-shcap.r\"/><use href=\"#single-arm-lat-pulldown-m-st-upper.r\"/><use href=\"#single-arm-lat-pulldown-m-st-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-m-st-fore.r\"/><use href=\"#single-arm-lat-pulldown-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"^56\"/><path class=\"eq\" d=\"^57\"/><path class=\"eq\" d=\"^58\"/><path class=\"eq\" d=\"^59\"/><path class=\"eq-cable\" d=\"^60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-m-g0-shcap.r\"/><use href=\"#single-arm-lat-pulldown-m-g0-upper.r\"/><use href=\"#single-arm-lat-pulldown-m-g0-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-m-g0-fore.r\"/><use href=\"#single-arm-lat-pulldown-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-m-g0-shcap.r\"/><use href=\"#single-arm-lat-pulldown-m-g0-upper.r\"/><use href=\"#single-arm-lat-pulldown-m-g0-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-m-g0-fore.r\"/><use href=\"#single-arm-lat-pulldown-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"^61\"/><path class=\"eq\" d=\"^62\"/><path class=\"eq\" d=\"^63\"/><path class=\"eq\" d=\"^64\"/><path class=\"eq-cable\" d=\"^65\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-m-g1-shcap.r\"/><use href=\"#single-arm-lat-pulldown-m-g1-upper.r\"/><use href=\"#single-arm-lat-pulldown-m-g1-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-m-g1-fore.r\"/><use href=\"#single-arm-lat-pulldown-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-m-g1-shcap.r\"/><use href=\"#single-arm-lat-pulldown-m-g1-upper.r\"/><use href=\"#single-arm-lat-pulldown-m-g1-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-m-g1-fore.r\"/><use href=\"#single-arm-lat-pulldown-m-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"^66\"/><path class=\"eq\" d=\"^67\"/><path class=\"eq\" d=\"^68\"/><path class=\"eq\" d=\"^69\"/><path class=\"eq-cable\" d=\"^70\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-m-g2-shcap.r\"/><use href=\"#single-arm-lat-pulldown-m-g2-upper.r\"/><use href=\"#single-arm-lat-pulldown-m-g2-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-m-g2-fore.r\"/><use href=\"#single-arm-lat-pulldown-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-m-g2-shcap.r\"/><use href=\"#single-arm-lat-pulldown-m-g2-upper.r\"/><use href=\"#single-arm-lat-pulldown-m-g2-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-m-g2-fore.r\"/><use href=\"#single-arm-lat-pulldown-m-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^71\"/><path class=\"eq-thin\" d=\"^72\"/><path class=\"eq-cable\" d=\"^73\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-m-e-thigh.l\"/><use href=\"#single-arm-lat-pulldown-m-e-kneecap.l\"/><use href=\"#single-arm-lat-pulldown-m-e-shank.l\"/><use href=\"#single-arm-lat-pulldown-m-e-foot.l\"/><use href=\"#single-arm-lat-pulldown-m-e-shcap.l\"/><use href=\"#single-arm-lat-pulldown-m-e-upper.l\"/><use href=\"#single-arm-lat-pulldown-m-e-elbowcap.l\"/><use href=\"#single-arm-lat-pulldown-m-e-fore.l\"/><use href=\"#single-arm-lat-pulldown-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-m-e-thigh.l\"/><use href=\"#single-arm-lat-pulldown-m-e-kneecap.l\"/><use href=\"#single-arm-lat-pulldown-m-e-shank.l\"/><use href=\"#single-arm-lat-pulldown-m-e-foot.l\"/><use href=\"#single-arm-lat-pulldown-m-e-shcap.l\"/><use href=\"#single-arm-lat-pulldown-m-e-upper.l\"/><use href=\"#single-arm-lat-pulldown-m-e-elbowcap.l\"/><use href=\"#single-arm-lat-pulldown-m-e-fore.l\"/><use href=\"#single-arm-lat-pulldown-m-e-fist.l\"/></g></g><path class=\"eq\" d=\"^74\"/><path class=\"eq\" d=\"^75\"/><path class=\"eq\" d=\"^76\"/><path class=\"eq\" d=\"^77\"/><path class=\"eq-pin\" d=\"^78\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-m-e-head\"/><use href=\"#single-arm-lat-pulldown-m-e-torso\"/><use href=\"#single-arm-lat-pulldown-m-e-thigh.r\"/><use href=\"#single-arm-lat-pulldown-m-e-kneecap.r\"/><use href=\"#single-arm-lat-pulldown-m-e-shank.r\"/><use href=\"#single-arm-lat-pulldown-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-m-e-head\"/><use href=\"#single-arm-lat-pulldown-m-e-torso\"/><use href=\"#single-arm-lat-pulldown-m-e-thigh.r\"/><use href=\"#single-arm-lat-pulldown-m-e-kneecap.r\"/><use href=\"#single-arm-lat-pulldown-m-e-shank.r\"/><use href=\"#single-arm-lat-pulldown-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^79\"/><path class=\"eq\" d=\"^80\"/><path class=\"eq\" d=\"^81\"/><path class=\"eq\" d=\"^82\"/><path class=\"eq-cable\" d=\"^83\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-m-e-shcap.r\"/><use href=\"#single-arm-lat-pulldown-m-e-upper.r\"/><use href=\"#single-arm-lat-pulldown-m-e-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-m-e-fore.r\"/><use href=\"#single-arm-lat-pulldown-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#single-arm-lat-pulldown-m-e-shcap.r\"/><use href=\"#single-arm-lat-pulldown-m-e-upper.r\"/><use href=\"#single-arm-lat-pulldown-m-e-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-m-e-fore.r\"/><use href=\"#single-arm-lat-pulldown-m-e-fist.r\"/></g></g><path class=\"eq\" d=\"^77\"/><path class=\"eq-pin\" d=\"^78\"/><circle class=\"joint\" cx=\"113.35\" cy=\"210.27\" r=\"2.25\"/><circle class=\"joint\" cx=\"110.41\" cy=\"253.32\" r=\"2.25\"/><circle class=\"joint\" cx=\"119.19\" cy=\"270.3\" r=\"2.25\"/><circle class=\"joint\" cx=\"176\" cy=\"272.54\" r=\"2.25\"/></g><mask id=\"single-arm-lat-pulldown-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#single-arm-lat-pulldown-m-mf-head\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-mf-torso\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-mf-shank.l\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-mf-foot.l\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-mf-upper.l\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-mf-fore.l\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-mf-fist.l\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-mf-shank.r\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-mf-foot.r\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-m-shcap.r\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-m-upper.r\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-m-fore.r\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-m-fist.r\" fill=\"#000\"/><use href=\"#single-arm-lat-pulldown-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-36\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-37\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-38\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-39\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-40\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-41\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-42\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#single-arm-lat-pulldown-m-mo-43\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#single-arm-lat-pulldown-m-mmask)\"><g class=\"u-stroke\"><use href=\"#single-arm-lat-pulldown-m-m-shcap.r\"/><use href=\"#single-arm-lat-pulldown-m-m-upper.r\"/><use href=\"#single-arm-lat-pulldown-m-m-elbowcap.r\"/><use href=\"#single-arm-lat-pulldown-m-m-fore.r\"/><use href=\"#single-arm-lat-pulldown-m-m-fist.r\"/><use href=\"#single-arm-lat-pulldown-m-m-eq0\"/><use href=\"#single-arm-lat-pulldown-m-m-eq1\"/><use href=\"#single-arm-lat-pulldown-m-m-eq2\"/><use href=\"#single-arm-lat-pulldown-m-m-eq3\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MF)pP(G1L*e.Wt\"/><path class=\"m-line\" d=\"~MNzh!xN1L!R6VhLOH4Wb\"/><path class=\"m-line\" d=\"~#40wUlUxF1O)j)JG1P7YW200000000\"/><path class=\"m-arrow\" d=\"~MNAmDyG1LHD3xkM.kDnL!kBnL)P1S9\"/><path class=\"m-arrow\" d=\"~MNAsWRG1LYfPY3M-lGmL_lHmLK6OR1\"/><path class=\"leader m\" d=\"~MNzh!xN1L0UR3\"/><path class=\"leader m\" d=\"M146.59 232.03L171 244H181\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"single-arm-lat-pulldown-m-past\" data-key=\"past\" data-cue=\"The elbow drives back behind the body past the end.\" class=\"plate-callout two m\" style=\"left:1.12%;top:69.83%\" aria-pressed=\"true\">Elbow<br>goes back</button><button type=\"button\" id=\"single-arm-lat-pulldown-m-low\" data-key=\"low\" data-cue=\"The handle keeps going down well past the chin.\" class=\"plate-callout two m\" style=\"left:49.16%;top:62.01%\" aria-pressed=\"false\">Pulled<br>too low</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "thighs",
        cues: [{ key: "thighs", cue: "Set the thighs tight under the pads." }, { key: "shoulder", cue: "Drop the shoulder away from the ear before the elbow bends." }, { key: "pocket", cue: "Pull the elbow back and down toward the back pocket." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "past",
        cues: [{ key: "past", cue: "The elbow drives back behind the body past the end." }, { key: "low", cue: "The handle keeps going down well past the chin." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Elbow goes back</b><span>The elbow drives back behind the body past the end.</span></li><li><b>Pulled too low</b><span>The handle keeps going down well past the chin.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 2 seconds, hold 1 second, return 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div></div>",
      alt: "Single-arm lat pulldown, side view. Seated with the thighs under the knee pad, one hand pulls a single handle from a long arm overhead down until it just passes the chin, the elbow driving down toward the back pocket.",
      mistakeAlt: "Single-Arm Lat Pulldown: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "pull",
    "handle": "d-handle",
    "loadAxis": "across",
    "width": {
      "text": "One hand, set by the handle.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-single-arm-lat-pulldown"
        ],
        "note": "c1"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "hk-baechle-grip"
        ],
        "note": "c16"
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        25
      ],
      "limitText": "Keep the wrist from curling forward.",
      "claim": {
        "tags": [
          "MECH",
          "CONVENTION"
        ],
        "sources": [
          "odriscoll-1992",
          "hand-key-d-handle"
        ],
        "note": "c15; the ext range is the key's ga:pull-base convention, not a card number"
      }
    },
    "faults": [
      {
        "key": "curled",
        "label": "Wrist curled",
        "pose": {
          "wrist": {
            "dev": 0,
            "ext": -30
          }
        },
        "markers": [
          "lever-arc"
        ],
        "alt": "Wrist curled forward toward the forearm."
      }
    ],
    "gripLine": "Single handle, thumb around it.",
    "cue": "Thumb wrapped, wrist straight."
  },
  contacts: [
    "seat-back",
    "brace-pad"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Clip a single handle to the cable.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-single-arm-lat-pulldown"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "get-in",
      "text": "Stand to take the handle, then sit, thighs tight under the pads.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-single-arm-lat-pulldown"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "load",
      "text": "Use less than half your two-arm pulldown weight to start.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-single-arm-lat-pulldown"
        ],
        "note": "c9"
      }
    },
    {
      "kind": "brace",
      "text": "Brace your trunk so it won't twist.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-single-arm-lat-pulldown"
        ],
        "note": "c6"
      }
    },
    {
      "kind": "position",
      "text": "No pulldown machine? Kneel at a cable machine.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-single-arm-lat-pulldown",
          "puregym-single-arm-lat-pulldown"
        ],
        "note": "c12"
      }
    }
  ],
  posture: [
    {
      "key": "square",
      "label": "Torso square",
      "detail": "Thighs pinned. Torso upright and square, no twisting.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "puregym-single-arm-lat-pulldown"
        ],
        "note": "c1, c7"
      }
    },
    {
      "key": "shoulder",
      "label": "Shoulder down first",
      "detail": "Drop the shoulder away from the ear before the elbow bends.",
      "anchor": {
        "pose": "start",
        "at": "shoulder.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-single-arm-lat-pulldown"
        ],
        "note": "c3"
      }
    },
    {
      "key": "pocket",
      "label": "Elbow to pocket",
      "detail": "Elbow back and down toward the back pocket, upper arm flush with the side.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "zoom": "bottom",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-single-arm-lat-pulldown"
        ],
        "note": "c2"
      }
    },
    {
      "key": "stop",
      "label": "Stop point",
      "detail": "Stop when the handle passes the chin and the elbow stops moving down.",
      "anchor": {
        "pose": "end",
        "at": "chin"
      },
      "zoom": "bottom",
      "claim": {
        "tags": [
          "MECH",
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-pulldown",
          "puregym-single-arm-lat-pulldown"
        ],
        "note": "c13, c2"
      }
    },
    {
      "key": "top",
      "label": "Tension at top",
      "detail": "Top: arm long, the cable lifts the shoulder, tension kept. Never let the handle fly up.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-single-arm-lat-pulldown"
        ],
        "note": "c4"
      }
    }
  ],
  zooms: [
    {
      "key": "hand",
      "chip": "Hand",
      "heading": "Hand position",
      "kind": "hand"
    },
    {
      "key": "bottom",
      "chip": "Bottom",
      "heading": "Bottom position",
      "kind": "posture",
      "feelRow": "shoulder"
    }
  ],
  chips: [
    "hand",
    "bottom",
    "feel"
  ],
  copy: {
    "setupLine": "Sit with your thighs pinned and lean back slightly. Brace so your torso stays square.",
    "mistakeLine": "Stop when the handle passes your chin. Return slowly, never let it fly up.",
    "cueLine": "Shoulder down, elbow to pocket."
  },
  mistakes: [
    {
      "key": "past",
      "title": "Pulling past the end",
      "zoom": "bottom",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-single-arm-lat-pulldown",
          "puregym-single-arm-lat-pulldown"
        ],
        "note": "c10, c2, c4, c5"
      },
      "fix": "Stop when the handle just passes your chin. Return slowly."
    },
    {
      "key": "twist",
      "title": "Twisting the torso",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-single-arm-lat-pulldown"
        ],
        "note": "c6"
      },
      "fix": "Brace the trunk. Still twisting? Lower the load."
    },
    {
      "key": "lean",
      "title": "Leaning into each rep",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-single-arm-lat-pulldown",
          "puregym-single-arm-lat-pulldown"
        ],
        "note": "c11, c6"
      },
      "fix": "Tighten your abs to hold the spine still."
    }
  ],
  risks: [
    {
      "key": "shoulder",
      "text": "Rolling the shoulder forward at the end of the pull may stress it.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-single-arm-lat-pulldown"
        ],
        "note": "c10"
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
    "ace-lat-pulldown",
    "barbend-single-arm-lat-pulldown",
    "odriscoll-1992",
    "puregym-single-arm-lat-pulldown",
    "hk-baechle-grip",
    "hand-key-d-handle",
    "nhs-wrist-pain",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/single_arm_lat_pulldown.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=15d53160051dc2288a9da2ef795a57859c5d864f7227e70e55ce1dc7b13d263a
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_close_grip_pulldown",
  name: "Close-Grip Pulldown",
  hashes: { inputsSha256: "15d53160051dc2288a9da2ef795a57859c5d864f7227e70e55ce1dc7b13d263a", golden: "97a436e7c26a5fefe8c0573f21fa7d28cc7db909b6333b109498fd7f2714eb7c" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"close-grip-pulldown-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"close-grip-pulldown-n-st-shcap.l\" d=\"~~ASjJSF1PI10\"/><path id=\"close-grip-pulldown-n-st-upper.l\" d=\"~#F12DEmF)F1*!lO*G1V2N7b0UaIG1I4F4)1A2zfAvVdPdI4FeU3!iz5Dy1g(2A1(5We)E1a0x2Y7WdW5WiKiy6Kjx5-p20010110022000000000200200200120010010000000000002000220011100002200000000010100\"/><path id=\"close-grip-pulldown-n-st-elbowcap.l\" d=\"~~PJmwUw1!v2\"/><path id=\"close-grip-pulldown-n-st-fore.l\" d=\"~#F12PJoD*w1Ezo-Tx1*3A85X1H7xB1I5!6*1S1)7YqB9J9X2_9Y2_cE7wrsH2sU8JdGz1y1I1tw9P8W3yeIeF4zfE4Rj01010000002000000000000000010000001000020000200100000210100000010000200100020000\"/><path id=\"close-grip-pulldown-n-st-fist.l\" d=\"~~_-o(Nowt0\"/><path id=\"close-grip-pulldown-n-st-torso\" d=\"~#_12DRiJEA1VNiR!y1XaI5)4P1_bPeW9y4Aewcw6I1-aBkznK3XaA6YdG6_hI8DiEhPd*hA3E9B9Id.szsOd)mz6.1-cdyfFhF4S6-c.4-c!9z2Ujw6A2y7BbP5W8Gx2SO100001200110100000000111000000001110210001000002001120000001010000200002000100001000000000000000010010000020000000001\"/><path id=\"close-grip-pulldown-n-st-shcap.r\" d=\"^0\"/><path id=\"close-grip-pulldown-n-st-upper.r\" d=\"^1\"/><path id=\"close-grip-pulldown-n-st-elbowcap.r\" d=\"^2\"/><path id=\"close-grip-pulldown-n-st-fore.r\" d=\"^3\"/><path id=\"close-grip-pulldown-n-st-fist.r\" d=\"^4\"/><path id=\"close-grip-pulldown-n-g0-shcap.r\" d=\"~~!NjFXF1PI10\"/><path id=\"close-grip-pulldown-n-g0-upper.r\" d=\"~#F12H!lPSG1xFlIHH1E5_533Jo.x1O5F2T2D1VoNm-hP7E9WbR3(iRg(sj_2v!5_rzv64R4J6DaYaDoBaYc*f_4-p00000020021200000001010000001020001010000001010000000200010000000000020101000000\"/><path id=\"close-grip-pulldown-n-g0-elbowcap.r\" d=\"~~Y*o!Iy1!v2\"/><path id=\"close-grip-pulldown-n-g0-fore.r\" d=\"~#F12((qJGy1T*q).y1x1_6nz1G5IsX2J6G1W1sFhG5(boDay7ybW1FhU1J1U3!5w1-skE1y2U6W9H6A8Iiz1Tf.a*g00000000200020200020020200010100101010020021000001010000200001011010000100000000\"/><path id=\"close-grip-pulldown-n-g0-fist.r\" d=\"~~ARo_*rwt0\"/><path id=\"close-grip-pulldown-n-g1-shcap.r\" d=\"~~SIjA!F1PI10\"/><path id=\"close-grip-pulldown-n-g1-upper.r\" d=\"~#F12JIlUyH1I)k)EH1z3D137PexaG3O1R1jx2.4Ej3Ed(6Xawg_2N4bU1hS3NgB646V2(1xbJmHq8(hO9YeXl00011000000121000000001110001000000002000000000000000000010100010000001010000000\"/><path id=\"close-grip-pulldown-n-g1-elbowcap.r\" d=\"~~_XmFGE1!v2\"/><path id=\"close-grip-pulldown-n-g1-fore.r\" d=\"~#F12PYoDOE1XRoGBF1)2w8dT1F3Tz1O4w7-1U1*4(oz8Ha.1yay4Ncz4ApA1D2Y1y8P9Ky1uK10U8U8A4PcXf_2IfE6zj20000000000020220002000101002002100001002000200000000000001002000000101010100200\"/><path id=\"close-grip-pulldown-n-g1-fist.r\" d=\"~~JFoWJvwt0\"/><path id=\"close-grip-pulldown-n-g2-shcap.r\" d=\"~~HFj(wG1PI10\"/><path id=\"close-grip-pulldown-n-g2-upper.r\" d=\"~#F12w(jUDH1ISj*(G1.2x269AhP7hV3bX1Y1*4BaKg-cO7GjjO3w4V1iK3H1wfDb58B3K1Bow3_dHmShFaHqs00110101200022011100000002100021001000100010100000200202000101000010101002022000\"/><path id=\"close-grip-pulldown-n-g2-elbowcap.r\" d=\"~~yYmw.H1!v2\"/><path id=\"close-grip-pulldown-n-g2-fore.r\" d=\"~#F12w-oY)H1xToEWI1V2D8dT1!1*z1B4D7X1Y1z4HpV7UaO1waP4NcE3NpA1A2A2y8F8)y1sI1aS8_8Y3(bEgD2Kf.6.i00000001000100200000021101200011001002001010010000002000000000002000110000020000\"/><path id=\"close-grip-pulldown-n-g2-fist.r\" d=\"~~W)nS.y1wt0\"/><path id=\"close-grip-pulldown-n-e-thigh.l\" d=\"~#F12w)mJ!W1EUl.*W1XaD10A1!Y1j-6X5K3T2xP1K4EkzcIipElFaEP16V3H2G7y5UY1W54z1Taz2*bYryA1SlUw1N1_B1Ei00000020000001200100000000000000000000020010110100000020000010001010020021100100\"/><path id=\"close-grip-pulldown-n-e-kneecap.l\" d=\"~~N!w1WDV1UF11\"/><path id=\"close-grip-pulldown-n-e-shank.l\" d=\"~#F12A.w1DzV1xyx1-YT1P2RaA14bD-1(5T6!2G3U1-!1W7Vbs.aR5-cN8B!1B2-3X4O7E9NY1x11nXaKcP9.dHlT1SjyaJn20001010001000120020000010000010010000101001000000110120000000200100100000000200\"/><path id=\"close-grip-pulldown-n-e-foot.l\" d=\"~#o2AKw1DH)1x*w1EK(1Sbw3wgG7DnXlDR2.2TB2G4Xy1G7Xl2XB1H4zaTbyqzaEkFn010002002100000200000021010000100101000002200200\"/><path id=\"close-grip-pulldown-n-e-shcap.l\" d=\"~~yBj_BG1PI10\"/><path id=\"close-grip-pulldown-n-e-upper.l\" d=\"~#F12UDjNRG1.xjB*F1vz581P9Aq!1z4q)1H1ReF4-i)3IeGd*dV8VbV1I1X3R2J5Hr90X1-4OhB8-5SpP5WjAi(i10001200000000000000000010010000000000020020001100000001002000002101000020100012\"/><path id=\"close-grip-pulldown-n-e-elbowcap.l\" d=\"~~w)kUJN1!v2\"/><path id=\"close-grip-pulldown-n-e-fore.l\" d=\"~#F12S(myXN1IUmGKO1E4(73V1Y8.A1R5W6)1P1B9NqO9y9B3U9H2(cK8YqqH2gY8_e.y1A1G1G1w9N8w4Pe.d(4-eO3.j00010100001100000022000000000000012000121001200000101000000200000000100000010000\"/><path id=\"close-grip-pulldown-n-e-fist.l\" d=\"~~wXnJHD1wt0\"/><path id=\"close-grip-pulldown-n-e-head\" d=\"~#w12SXiwXvOFhR_vGcFlOe(cTa5T1(4z6.5R9.7VkRfD1EcV3x8XgP4(gxfAi.a(ix2UkP9y3Dh0000012000001001010000000200100210110100001000000110000000000000\"/><path id=\"close-grip-pulldown-n-e-torso\" d=\"~#_12DRiJEA1VNiR!y1I9F2O6E7WaA9(aSaAewcw6I1-aBkznK3XaA6YdG6_hI8DiEhPd*hA3E9B9Id.szsOd)mz6.1-cdyfFhF4S6-c.4.bYex3Yey5X2w8G6P5W8Gx2SO100100200000020210100111000000001110210001000002001120000001010000200002000100001000000000000000000010000020000000001\"/><path id=\"close-grip-pulldown-n-e-thigh.r\" d=\"^21\"/><path id=\"close-grip-pulldown-n-e-kneecap.r\" d=\"^22\"/><path id=\"close-grip-pulldown-n-e-shank.r\" d=\"^23\"/><path id=\"close-grip-pulldown-n-e-foot.r\" d=\"^24\"/><path id=\"close-grip-pulldown-n-e-shcap.r\" d=\"^25\"/><path id=\"close-grip-pulldown-n-e-upper.r\" d=\"^26\"/><path id=\"close-grip-pulldown-n-e-elbowcap.r\" d=\"^27\"/><path id=\"close-grip-pulldown-n-e-fore.r\" d=\"^28\"/><path id=\"close-grip-pulldown-n-e-fist.r\" d=\"^29\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#close-grip-pulldown-n-dots)\"/>\n  <path class=\"floorline\" d=\"M47.74 338.84H310.26\"/><path class=\"eq\" d=\"~MW!oYAaLYPv0QJ90IEvI9LI9TlQ0I9I9UlLIEvJ9QI90JEvJ9LJ9UlQ0J9J9TlZ\"/><path class=\"eq\" d=\"~MSVqYAaL0Fy2\"/><path class=\"eq\" d=\"~MFVT1YAaL0w_1\"/><path class=\"eq\" d=\"~MyYP1Uyy2L(s0QF60VmE6LE6zIX1Q0E6E6AIX1LVmF6QE60WmF6LF6AIX1Q0F6F6zIX1Z\"/><path class=\"eq\" d=\"~MPOX1Uyy2L(s0QF60VmE6LE6zIX1Q0E6E6AIX1LVmF6QE60WmF6LF6AIX1Q0F6F6zIX1Z\"/><path class=\"eq\" d=\"~MFAiSw-1LyH90Qwp0xR8)oL)owhQ0)o)o)gLxR8wpQ)o0yR8wpLwp)gQ0wpwpwhZ\"/><path class=\"eq\" d=\"~MNwmAO-1L0JU7Q0F6F6zN7L(uE6QF60*uE6LE6zN7Q0E6E6AN7L*uF6QE60(uF6Z\"/><path class=\"eq\" d=\"~MFGhUyy2Lywb0QF60--aE6LE6z6Q0E6E6A6L--aF6QE60_-aF6LF6A6Q0F6F6z6Z\"/><path class=\"eq-solid\" d=\"~~HPpwEcHB11\"/><path class=\"eq-pin\" d=\"~~HOqwEcF60\"/><path class=\"eq-solid\" d=\"~~FYS1Y(bwt0\"/><path class=\"eq-pin\" d=\"~~wOT1Y(bF60\"/><path class=\"eq-cable\" d=\"~MSVqYxbLW)o0\"/><path class=\"eq\" d=\"~MDWS1Uyy2LyY30QF60-R3E6LE6)uQ0E6E6wvL-R3F6QE60_R3F6LF6wvQ0F6F6)uZ\"/><path class=\"eq\" d=\"~M(OS1DI.1LSA40LRA4WB5LRA4VB5Z\"/><path class=\"eq-thin\" d=\"M258.55 327.07H279.76M258.55 323.75H279.76M258.55 320.44H279.76M258.55 317.12H279.76M258.55 313.81H279.76M258.55 310.49H279.76M258.55 307.18H279.76\"/><path class=\"eq-thin\" d=\"~M_FT1!Pw2L0z(P1\"/><path class=\"eq-thin\" d=\"~MW.V1!Pw2L0z(P1\"/><path class=\"arc measure\" d=\"M86.33 222.32L86.33 267.32A45 45 0 0 0 94.14 266.63Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-n-st-shcap.l\"/><use href=\"#close-grip-pulldown-n-st-upper.l\"/><use href=\"#close-grip-pulldown-n-st-elbowcap.l\"/><use href=\"#close-grip-pulldown-n-st-fore.l\"/><use href=\"#close-grip-pulldown-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-n-st-shcap.l\"/><use href=\"#close-grip-pulldown-n-st-upper.l\"/><use href=\"#close-grip-pulldown-n-st-elbowcap.l\"/><use href=\"#close-grip-pulldown-n-st-fore.l\"/><use href=\"#close-grip-pulldown-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-n-st-torso\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-n-st-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-n-st-shcap.r\"/><use href=\"#close-grip-pulldown-n-st-upper.r\"/><use href=\"#close-grip-pulldown-n-st-elbowcap.r\"/><use href=\"#close-grip-pulldown-n-st-fore.r\"/><use href=\"#close-grip-pulldown-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-n-st-shcap.r\"/><use href=\"#close-grip-pulldown-n-st-upper.r\"/><use href=\"#close-grip-pulldown-n-st-elbowcap.r\"/><use href=\"#close-grip-pulldown-n-st-fore.r\"/><use href=\"#close-grip-pulldown-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"~MS_pDTrLPcT(4QsRbBnAS4LWaPcQRbrOcWaL2(T4QrSbAnBS4LVaKcQSbuNcTaZ\"/><path class=\"eq-solid\" d=\"~MWxpPYqL0UH2Q0NcNcB(1LKcKcQNc0NcKcLKcB(1Q0IcKcF(1LNcJcQKc0KcJcZ\"/><path class=\"eq\" d=\"~~_IpyFmSg0\"/><path class=\"eq-cable\" d=\"~MJ!pyFmLxcT)9\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-n-g0-shcap.r\"/><use href=\"#close-grip-pulldown-n-g0-upper.r\"/><use href=\"#close-grip-pulldown-n-g0-elbowcap.r\"/><use href=\"#close-grip-pulldown-n-g0-fore.r\"/><use href=\"#close-grip-pulldown-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-n-g0-shcap.r\"/><use href=\"#close-grip-pulldown-n-g0-upper.r\"/><use href=\"#close-grip-pulldown-n-g0-elbowcap.r\"/><use href=\"#close-grip-pulldown-n-g0-fore.r\"/><use href=\"#close-grip-pulldown-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"~M!RpwyvLNcT(4QuRbxnDS4LUaNcQRbtOcUaL2wU4QtSbAnzS4LVaOcQSbsNcVaZ\"/><path class=\"eq-solid\" d=\"~Mw-oJEuL0SH2Q0NcNcz(1LKcKcQJc0JcKcLIcz(1Q0KcIcA(1LJcNcQKc0KcNcZ\"/><path class=\"eq\" d=\"~~Azp(WpSg0\"/><path class=\"eq-cable\" d=\"~MWTp(WpLI3TOd\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-n-g1-shcap.r\"/><use href=\"#close-grip-pulldown-n-g1-upper.r\"/><use href=\"#close-grip-pulldown-n-g1-elbowcap.r\"/><use href=\"#close-grip-pulldown-n-g1-fore.r\"/><use href=\"#close-grip-pulldown-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-n-g1-shcap.r\"/><use href=\"#close-grip-pulldown-n-g1-upper.r\"/><use href=\"#close-grip-pulldown-n-g1-elbowcap.r\"/><use href=\"#close-grip-pulldown-n-g1-fore.r\"/><use href=\"#close-grip-pulldown-n-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"~MDGp!Py1LNcT(4QuRbxnDS4LUaNcQRbtOcUaL2wU4QtSbynzS4LTaOcQSbsPcVaZ\"/><path class=\"eq-solid\" d=\"~MFPoFWx1L0SH2Q0NcNcz(1LKcKcQNc0NcKcLKcz(1Q0KcKcA(1LNcNcQKc0KcNcZ\"/><path class=\"eq\" d=\"~~J_o_BtSg0\"/><path class=\"eq-cable\" d=\"~MwIp_BtLH5B)g\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-n-g2-shcap.r\"/><use href=\"#close-grip-pulldown-n-g2-upper.r\"/><use href=\"#close-grip-pulldown-n-g2-elbowcap.r\"/><use href=\"#close-grip-pulldown-n-g2-fore.r\"/><use href=\"#close-grip-pulldown-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-n-g2-shcap.r\"/><use href=\"#close-grip-pulldown-n-g2-upper.r\"/><use href=\"#close-grip-pulldown-n-g2-elbowcap.r\"/><use href=\"#close-grip-pulldown-n-g2-fore.r\"/><use href=\"#close-grip-pulldown-n-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~M(OS1YOE1LSA40LRA4YB5LRA4XB5Z\"/><path class=\"eq-thin\" d=\"M258.55 225.41H279.76M258.55 222.09H279.76M258.55 218.78H279.76M258.55 215.46H279.76M258.55 212.15H279.76M258.55 208.83H279.76M258.55 205.52H279.76\"/><path class=\"eq-cable\" d=\"~MFSU1Y(bL0wRr\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-n-e-thigh.l\"/><use href=\"#close-grip-pulldown-n-e-kneecap.l\"/><use href=\"#close-grip-pulldown-n-e-shank.l\"/><use href=\"#close-grip-pulldown-n-e-foot.l\"/><use href=\"#close-grip-pulldown-n-e-shcap.l\"/><use href=\"#close-grip-pulldown-n-e-upper.l\"/><use href=\"#close-grip-pulldown-n-e-elbowcap.l\"/><use href=\"#close-grip-pulldown-n-e-fore.l\"/><use href=\"#close-grip-pulldown-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-n-e-thigh.l\"/><use href=\"#close-grip-pulldown-n-e-kneecap.l\"/><use href=\"#close-grip-pulldown-n-e-shank.l\"/><use href=\"#close-grip-pulldown-n-e-foot.l\"/><use href=\"#close-grip-pulldown-n-e-shcap.l\"/><use href=\"#close-grip-pulldown-n-e-upper.l\"/><use href=\"#close-grip-pulldown-n-e-elbowcap.l\"/><use href=\"#close-grip-pulldown-n-e-fore.l\"/><use href=\"#close-grip-pulldown-n-e-fist.l\"/></g></g><path class=\"eq\" d=\"~MWYgUyy2LJyd0QF60z!cE6LE6XhQ0E6E6YhLz!cF6QE60A!cF6LF6YhQ0F6F6XhZ\"/><path class=\"eq\" d=\"~MwEJ1Uyy2LWPb0QF60KHbE6LE6XhQ0E6E6YhLKHbF6QE60NHbF6LF6YhQ0F6F6XhZ\"/><path class=\"eq\" d=\"~MDXvD(R1L*!8_!8QI4N4(!8*T8LUeW5QN4N4-5ReLAU8-!8QN4I4*!8wU8LRe-5QK4K4W5UeZ\"/><path class=\"eq\" d=\"~~Y-uPBS1SK10\"/><path class=\"eq-pin\" d=\"~~yxw1PBS1F60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-n-e-head\"/><use href=\"#close-grip-pulldown-n-e-torso\"/><use href=\"#close-grip-pulldown-n-e-thigh.r\"/><use href=\"#close-grip-pulldown-n-e-kneecap.r\"/><use href=\"#close-grip-pulldown-n-e-shank.r\"/><use href=\"#close-grip-pulldown-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-n-e-head\"/><use href=\"#close-grip-pulldown-n-e-torso\"/><use href=\"#close-grip-pulldown-n-e-thigh.r\"/><use href=\"#close-grip-pulldown-n-e-kneecap.r\"/><use href=\"#close-grip-pulldown-n-e-shank.r\"/><use href=\"#close-grip-pulldown-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~MPwpY)B1LNcT(4QsRbznAS4LWaPcQRbrKcWaL0(T4QtSbynBS4LTaKcQSbuPcTaZ\"/><path class=\"eq-solid\" d=\"~MSEoABB1L0SH2Q0NcNcz(1LKcKcQNc0NcKcLKcz(1Q0KcKcA(1LNcNcQKc0KcNcZ\"/><path class=\"eq\" d=\"~~WRoUUw1Sg0\"/><path class=\"eq-cable\" d=\"~MFypUUw1LyeKNk\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-n-e-shcap.r\"/><use href=\"#close-grip-pulldown-n-e-upper.r\"/><use href=\"#close-grip-pulldown-n-e-elbowcap.r\"/><use href=\"#close-grip-pulldown-n-e-fore.r\"/><use href=\"#close-grip-pulldown-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-n-e-shcap.r\"/><use href=\"#close-grip-pulldown-n-e-upper.r\"/><use href=\"#close-grip-pulldown-n-e-elbowcap.r\"/><use href=\"#close-grip-pulldown-n-e-fore.r\"/><use href=\"#close-grip-pulldown-n-e-fist.r\"/></g></g><path class=\"eq\" d=\"^70\"/><path class=\"eq-pin\" d=\"^71\"/><path class=\"eq-line datum\" d=\"~MS.gPKI1L0NIa\"/><path class=\"eq-line\" d=\"~MS.gPKI1LP-1NDa\"/><circle class=\"joint\" cx=\"105.05\" cy=\"210.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"112.46\" cy=\"237.54\" r=\"2.25\"/><circle class=\"joint\" cx=\"118.1\" cy=\"269.9\" r=\"2.25\"/><circle class=\"joint\" cx=\"174.89\" cy=\"272.43\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#w20YRpUOqOSpIDq2011022010201001221020100122102010012210201001221020100021120000000011000002002200000000110001000002000000001000010000020000000010000100000200020000100001000002000200001000010001000002000000\"/><path class=\"arrow\" d=\"~MUXoU!A1L-f.D1LFV1_G1Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M86.33 267.32A45 45 0 0 0 94.14 266.63\"/><g class=\"arc-ticks\"><path d=\"~MS.gYKT1L0FY1\"/><path d=\"~MyFi!GT1LY9JX1\"/></g><path class=\"leader\" d=\"~MAVhASU1Lxz2.F6\"/></g></g><path class=\"leader\" d=\"M179.01 264.17L183 258H193\"/><circle class=\"anchor\" cx=\"179.01\" cy=\"264.17\" r=\"1.5\"/><path class=\"leader\" d=\"M112.46 237.54L91.5 284H81.5\"/><circle class=\"anchor\" cx=\"112.46\" cy=\"237.54\" r=\"1.5\"/><path class=\"leader\" d=\"~MwUoJHD1LY.4I1\"/><circle class=\"anchor\" cx=\"126.08\" cy=\"196.22\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"close-grip-pulldown-n-thighs\" data-key=\"thighs\" data-cue=\"Set the thigh pad tight on top of the thighs.\" class=\"plate-callout two\" style=\"left:52.51%;top:65.92%\" aria-pressed=\"true\">Thighs<br>pinned</button><button type=\"button\" id=\"close-grip-pulldown-n-elbows\" data-key=\"elbows\" data-cue=\"Drive the elbows down toward the hips, upper arms tucked at the sides.\" class=\"plate-callout two\" style=\"left:6.7%;top:73.18%\" aria-pressed=\"false\">Elbows<br>to hips</button><button type=\"button\" id=\"close-grip-pulldown-n-chin\" data-key=\"chin\" data-cue=\"Stop when the handle is just below the chin.\" class=\"plate-callout two\" style=\"left:40.78%;top:48.6%\" aria-pressed=\"false\">Handle<br>below chin</button><span class=\"plate-arc-label\" style=\"left:2.23%;top:64.25%\"><b>Lean back</b><span>under 30°</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"close-grip-pulldown-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"close-grip-pulldown-m-st-shcap.l\" d=\"^0\"/><path id=\"close-grip-pulldown-m-st-upper.l\" d=\"^1\"/><path id=\"close-grip-pulldown-m-st-elbowcap.l\" d=\"^2\"/><path id=\"close-grip-pulldown-m-st-fore.l\" d=\"^3\"/><path id=\"close-grip-pulldown-m-st-fist.l\" d=\"^4\"/><path id=\"close-grip-pulldown-m-st-torso\" d=\"^5\"/><path id=\"close-grip-pulldown-m-st-shcap.r\" d=\"^0\"/><path id=\"close-grip-pulldown-m-st-upper.r\" d=\"^1\"/><path id=\"close-grip-pulldown-m-st-elbowcap.r\" d=\"^2\"/><path id=\"close-grip-pulldown-m-st-fore.r\" d=\"^3\"/><path id=\"close-grip-pulldown-m-st-fist.r\" d=\"^4\"/><path id=\"close-grip-pulldown-m-g0-shcap.r\" d=\"^6\"/><path id=\"close-grip-pulldown-m-g0-upper.r\" d=\"^7\"/><path id=\"close-grip-pulldown-m-g0-elbowcap.r\" d=\"^8\"/><path id=\"close-grip-pulldown-m-g0-fore.r\" d=\"^9\"/><path id=\"close-grip-pulldown-m-g0-fist.r\" d=\"^10\"/><path id=\"close-grip-pulldown-m-g1-shcap.r\" d=\"^11\"/><path id=\"close-grip-pulldown-m-g1-upper.r\" d=\"^12\"/><path id=\"close-grip-pulldown-m-g1-elbowcap.r\" d=\"^13\"/><path id=\"close-grip-pulldown-m-g1-fore.r\" d=\"^14\"/><path id=\"close-grip-pulldown-m-g1-fist.r\" d=\"^15\"/><path id=\"close-grip-pulldown-m-g2-shcap.r\" d=\"^16\"/><path id=\"close-grip-pulldown-m-g2-upper.r\" d=\"^17\"/><path id=\"close-grip-pulldown-m-g2-elbowcap.r\" d=\"^18\"/><path id=\"close-grip-pulldown-m-g2-fore.r\" d=\"^19\"/><path id=\"close-grip-pulldown-m-g2-fist.r\" d=\"^20\"/><path id=\"close-grip-pulldown-m-e-thigh.l\" d=\"^21\"/><path id=\"close-grip-pulldown-m-e-kneecap.l\" d=\"^22\"/><path id=\"close-grip-pulldown-m-e-shank.l\" d=\"^23\"/><path id=\"close-grip-pulldown-m-e-foot.l\" d=\"^24\"/><path id=\"close-grip-pulldown-m-e-shcap.l\" d=\"^25\"/><path id=\"close-grip-pulldown-m-e-upper.l\" d=\"^26\"/><path id=\"close-grip-pulldown-m-e-elbowcap.l\" d=\"^27\"/><path id=\"close-grip-pulldown-m-e-fore.l\" d=\"^28\"/><path id=\"close-grip-pulldown-m-e-fist.l\" d=\"^29\"/><path id=\"close-grip-pulldown-m-e-head\" d=\"^30\"/><path id=\"close-grip-pulldown-m-e-torso\" d=\"^31\"/><path id=\"close-grip-pulldown-m-e-thigh.r\" d=\"^21\"/><path id=\"close-grip-pulldown-m-e-kneecap.r\" d=\"^22\"/><path id=\"close-grip-pulldown-m-e-shank.r\" d=\"^23\"/><path id=\"close-grip-pulldown-m-e-foot.r\" d=\"^24\"/><path id=\"close-grip-pulldown-m-e-shcap.r\" d=\"^25\"/><path id=\"close-grip-pulldown-m-e-upper.r\" d=\"^26\"/><path id=\"close-grip-pulldown-m-e-elbowcap.r\" d=\"^27\"/><path id=\"close-grip-pulldown-m-e-fore.r\" d=\"^28\"/><path id=\"close-grip-pulldown-m-e-fist.r\" d=\"^29\"/><path id=\"close-grip-pulldown-m-m-shcap.r\" d=\"^25\"/><path id=\"close-grip-pulldown-m-m-upper.r\" d=\"~#F12!EjJWF1xTjG.E1w3V684-bDB1N4O3y2-1FfOpPeTcH5*dO2zjP5BtbV2tT5.fWz170D2x7Ec)8.jFhB7yjN3wq00000000000101001200100100100000000001200000200001000000000100012000020000000000\"/><path id=\"close-grip-pulldown-m-m-elbowcap.r\" d=\"~~D_g!GP1!v2\"/><path id=\"close-grip-pulldown-m-m-fore.r\" d=\"~#F12Y)hYHR1GDhKJR1I94S1vDD1-9.8V1G2z1OtW4Ocz4)9W1IaA8ItP5-1Y1.7U4NE1R3W1c.8A3N1y9yjJ6NfT2_fIc00200200000000000000000101100001010000000001001000002000100000210110100200021011\"/><path id=\"close-grip-pulldown-m-m-fist.r\" d=\"~~PUpU-N1wt0\"/><path id=\"close-grip-pulldown-m-m-eq0\" d=\"~MA*qyNN1Lkx)4Q0TbBcJT4LSbWbQTb0TbSbLwbST4Q1SbDcOT4LRbTbQUb2UbRbZ\"/><path id=\"close-grip-pulldown-m-m-eq1\" d=\"~MyBqHUK1L0UH2Q0NcNcB(1LKcKcQNc0NcKcLKcB(1Q0IcKcF(1LNcJcQKc0KcJcZ\"/><path id=\"close-grip-pulldown-m-m-eq2\" d=\"~~UxqHzG1Sg0\"/><path id=\"close-grip-pulldown-m-mf-head\" d=\"^30\"/><path id=\"close-grip-pulldown-m-mf-torso\" d=\"^31\"/><path id=\"close-grip-pulldown-m-mf-thigh.l\" d=\"^21\"/><path id=\"close-grip-pulldown-m-mf-kneecap.l\" d=\"^22\"/><path id=\"close-grip-pulldown-m-mf-shank.l\" d=\"^23\"/><path id=\"close-grip-pulldown-m-mf-foot.l\" d=\"^24\"/><path id=\"close-grip-pulldown-m-mf-shcap.l\" d=\"^25\"/><path id=\"close-grip-pulldown-m-mf-upper.l\" d=\"^87\"/><path id=\"close-grip-pulldown-m-mf-elbowcap.l\" d=\"^88\"/><path id=\"close-grip-pulldown-m-mf-fore.l\" d=\"^89\"/><path id=\"close-grip-pulldown-m-mf-fist.l\" d=\"^90\"/><path id=\"close-grip-pulldown-m-mf-thigh.r\" d=\"^21\"/><path id=\"close-grip-pulldown-m-mf-kneecap.r\" d=\"^22\"/><path id=\"close-grip-pulldown-m-mf-shank.r\" d=\"^23\"/><path id=\"close-grip-pulldown-m-mf-foot.r\" d=\"^24\"/><path id=\"close-grip-pulldown-m-mo-0\" d=\"^30\"/><path id=\"close-grip-pulldown-m-mo-1\" d=\"^31\"/><path id=\"close-grip-pulldown-m-mo-2\" d=\"^21\"/><path id=\"close-grip-pulldown-m-mo-3\" d=\"^22\"/><path id=\"close-grip-pulldown-m-mo-4\" d=\"^23\"/><path id=\"close-grip-pulldown-m-mo-5\" d=\"^24\"/><path id=\"close-grip-pulldown-m-mo-6\" d=\"^25\"/><path id=\"close-grip-pulldown-m-mo-7\" d=\"^26\"/><path id=\"close-grip-pulldown-m-mo-8\" d=\"^27\"/><path id=\"close-grip-pulldown-m-mo-9\" d=\"^28\"/><path id=\"close-grip-pulldown-m-mo-10\" d=\"^29\"/><path id=\"close-grip-pulldown-m-mo-11\" d=\"^21\"/><path id=\"close-grip-pulldown-m-mo-12\" d=\"^22\"/><path id=\"close-grip-pulldown-m-mo-13\" d=\"^23\"/><path id=\"close-grip-pulldown-m-mo-14\" d=\"^24\"/><path id=\"close-grip-pulldown-m-mo-15\" d=\"^25\"/><path id=\"close-grip-pulldown-m-mo-16\" d=\"^26\"/><path id=\"close-grip-pulldown-m-mo-17\" d=\"^27\"/><path id=\"close-grip-pulldown-m-mo-18\" d=\"^28\"/><path id=\"close-grip-pulldown-m-mo-19\" d=\"^29\"/><path id=\"close-grip-pulldown-m-mo-20\" d=\"^67\"/><path id=\"close-grip-pulldown-m-mo-21\" d=\"^68\"/><path id=\"close-grip-pulldown-m-mo-22\" d=\"^33\"/><path id=\"close-grip-pulldown-m-mo-23\" d=\"^36\"/><path id=\"close-grip-pulldown-m-mo-24\" d=\"^37\"/><path id=\"close-grip-pulldown-m-mo-25\" d=\"^38\"/><path id=\"close-grip-pulldown-m-mo-26\" d=\"^39\"/><path id=\"close-grip-pulldown-m-mo-27\" d=\"^40\"/><path id=\"close-grip-pulldown-m-mo-28\" d=\"^69\"/><path id=\"close-grip-pulldown-m-mo-29\" d=\"^70\"/><path id=\"close-grip-pulldown-m-mo-30\" d=\"^71\"/><path id=\"close-grip-pulldown-m-mo-31\" d=\"^70\"/><path id=\"close-grip-pulldown-m-mo-32\" d=\"^71\"/><path id=\"close-grip-pulldown-m-mo-33\" d=\"^41\"/><path id=\"close-grip-pulldown-m-mo-34\" d=\"^42\"/><path id=\"close-grip-pulldown-m-mo-35\" d=\"^43\"/><path id=\"close-grip-pulldown-m-mo-36\" d=\"^44\"/><path id=\"close-grip-pulldown-m-mo-37\" d=\"^46\"/><path id=\"close-grip-pulldown-m-mo-38\" d=\"^47\"/><path id=\"close-grip-pulldown-m-mo-39\" d=\"^64\"/><path id=\"close-grip-pulldown-m-mo-40\" d=\"^72\"/><path id=\"close-grip-pulldown-m-mo-41\" d=\"^73\"/><path id=\"close-grip-pulldown-m-mo-42\" d=\"^74\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#close-grip-pulldown-m-dots)\"/>\n  <path class=\"floorline\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><path class=\"eq\" d=\"^38\"/><path class=\"eq\" d=\"^39\"/><path class=\"eq\" d=\"^40\"/><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq-pin\" d=\"^42\"/><path class=\"eq-solid\" d=\"^43\"/><path class=\"eq-pin\" d=\"^44\"/><path class=\"eq-cable\" d=\"^45\"/><path class=\"eq\" d=\"^46\"/><path class=\"eq\" d=\"^47\"/><path class=\"eq-thin\" d=\"^48\"/><path class=\"eq-thin\" d=\"^49\"/><path class=\"eq-thin\" d=\"^50\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-m-st-shcap.l\"/><use href=\"#close-grip-pulldown-m-st-upper.l\"/><use href=\"#close-grip-pulldown-m-st-elbowcap.l\"/><use href=\"#close-grip-pulldown-m-st-fore.l\"/><use href=\"#close-grip-pulldown-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-m-st-shcap.l\"/><use href=\"#close-grip-pulldown-m-st-upper.l\"/><use href=\"#close-grip-pulldown-m-st-elbowcap.l\"/><use href=\"#close-grip-pulldown-m-st-fore.l\"/><use href=\"#close-grip-pulldown-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-m-st-torso\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-m-st-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-m-st-shcap.r\"/><use href=\"#close-grip-pulldown-m-st-upper.r\"/><use href=\"#close-grip-pulldown-m-st-elbowcap.r\"/><use href=\"#close-grip-pulldown-m-st-fore.r\"/><use href=\"#close-grip-pulldown-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-m-st-shcap.r\"/><use href=\"#close-grip-pulldown-m-st-upper.r\"/><use href=\"#close-grip-pulldown-m-st-elbowcap.r\"/><use href=\"#close-grip-pulldown-m-st-fore.r\"/><use href=\"#close-grip-pulldown-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"^52\"/><path class=\"eq-solid\" d=\"^53\"/><path class=\"eq\" d=\"^54\"/><path class=\"eq-cable\" d=\"^55\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-m-g0-shcap.r\"/><use href=\"#close-grip-pulldown-m-g0-upper.r\"/><use href=\"#close-grip-pulldown-m-g0-elbowcap.r\"/><use href=\"#close-grip-pulldown-m-g0-fore.r\"/><use href=\"#close-grip-pulldown-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-m-g0-shcap.r\"/><use href=\"#close-grip-pulldown-m-g0-upper.r\"/><use href=\"#close-grip-pulldown-m-g0-elbowcap.r\"/><use href=\"#close-grip-pulldown-m-g0-fore.r\"/><use href=\"#close-grip-pulldown-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"^56\"/><path class=\"eq-solid\" d=\"^57\"/><path class=\"eq\" d=\"^58\"/><path class=\"eq-cable\" d=\"^59\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-m-g1-shcap.r\"/><use href=\"#close-grip-pulldown-m-g1-upper.r\"/><use href=\"#close-grip-pulldown-m-g1-elbowcap.r\"/><use href=\"#close-grip-pulldown-m-g1-fore.r\"/><use href=\"#close-grip-pulldown-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-m-g1-shcap.r\"/><use href=\"#close-grip-pulldown-m-g1-upper.r\"/><use href=\"#close-grip-pulldown-m-g1-elbowcap.r\"/><use href=\"#close-grip-pulldown-m-g1-fore.r\"/><use href=\"#close-grip-pulldown-m-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"^60\"/><path class=\"eq-solid\" d=\"^61\"/><path class=\"eq\" d=\"^62\"/><path class=\"eq-cable\" d=\"^63\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-m-g2-shcap.r\"/><use href=\"#close-grip-pulldown-m-g2-upper.r\"/><use href=\"#close-grip-pulldown-m-g2-elbowcap.r\"/><use href=\"#close-grip-pulldown-m-g2-fore.r\"/><use href=\"#close-grip-pulldown-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-m-g2-shcap.r\"/><use href=\"#close-grip-pulldown-m-g2-upper.r\"/><use href=\"#close-grip-pulldown-m-g2-elbowcap.r\"/><use href=\"#close-grip-pulldown-m-g2-fore.r\"/><use href=\"#close-grip-pulldown-m-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^64\"/><path class=\"eq-thin\" d=\"^65\"/><path class=\"eq-cable\" d=\"^66\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-m-e-thigh.l\"/><use href=\"#close-grip-pulldown-m-e-kneecap.l\"/><use href=\"#close-grip-pulldown-m-e-shank.l\"/><use href=\"#close-grip-pulldown-m-e-foot.l\"/><use href=\"#close-grip-pulldown-m-e-shcap.l\"/><use href=\"#close-grip-pulldown-m-e-upper.l\"/><use href=\"#close-grip-pulldown-m-e-elbowcap.l\"/><use href=\"#close-grip-pulldown-m-e-fore.l\"/><use href=\"#close-grip-pulldown-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-m-e-thigh.l\"/><use href=\"#close-grip-pulldown-m-e-kneecap.l\"/><use href=\"#close-grip-pulldown-m-e-shank.l\"/><use href=\"#close-grip-pulldown-m-e-foot.l\"/><use href=\"#close-grip-pulldown-m-e-shcap.l\"/><use href=\"#close-grip-pulldown-m-e-upper.l\"/><use href=\"#close-grip-pulldown-m-e-elbowcap.l\"/><use href=\"#close-grip-pulldown-m-e-fore.l\"/><use href=\"#close-grip-pulldown-m-e-fist.l\"/></g></g><path class=\"eq\" d=\"^67\"/><path class=\"eq\" d=\"^68\"/><path class=\"eq\" d=\"^69\"/><path class=\"eq\" d=\"^70\"/><path class=\"eq-pin\" d=\"^71\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-m-e-head\"/><use href=\"#close-grip-pulldown-m-e-torso\"/><use href=\"#close-grip-pulldown-m-e-thigh.r\"/><use href=\"#close-grip-pulldown-m-e-kneecap.r\"/><use href=\"#close-grip-pulldown-m-e-shank.r\"/><use href=\"#close-grip-pulldown-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-m-e-head\"/><use href=\"#close-grip-pulldown-m-e-torso\"/><use href=\"#close-grip-pulldown-m-e-thigh.r\"/><use href=\"#close-grip-pulldown-m-e-kneecap.r\"/><use href=\"#close-grip-pulldown-m-e-shank.r\"/><use href=\"#close-grip-pulldown-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^72\"/><path class=\"eq-solid\" d=\"^73\"/><path class=\"eq\" d=\"^74\"/><path class=\"eq-cable\" d=\"^75\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-m-e-shcap.r\"/><use href=\"#close-grip-pulldown-m-e-upper.r\"/><use href=\"#close-grip-pulldown-m-e-elbowcap.r\"/><use href=\"#close-grip-pulldown-m-e-fore.r\"/><use href=\"#close-grip-pulldown-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#close-grip-pulldown-m-e-shcap.r\"/><use href=\"#close-grip-pulldown-m-e-upper.r\"/><use href=\"#close-grip-pulldown-m-e-elbowcap.r\"/><use href=\"#close-grip-pulldown-m-e-fore.r\"/><use href=\"#close-grip-pulldown-m-e-fist.r\"/></g></g><path class=\"eq\" d=\"^70\"/><path class=\"eq-pin\" d=\"^71\"/><circle class=\"joint\" cx=\"105.05\" cy=\"210.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"112.46\" cy=\"237.54\" r=\"2.25\"/><circle class=\"joint\" cx=\"118.1\" cy=\"269.9\" r=\"2.25\"/><circle class=\"joint\" cx=\"174.89\" cy=\"272.43\" r=\"2.25\"/></g><mask id=\"close-grip-pulldown-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#close-grip-pulldown-m-mf-head\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-mf-torso\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-mf-shank.l\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-mf-foot.l\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-mf-upper.l\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-mf-fore.l\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-mf-fist.l\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-mf-shank.r\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-mf-foot.r\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-m-shcap.r\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-m-upper.r\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-m-fore.r\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-m-fist.r\" fill=\"#000\"/><use href=\"#close-grip-pulldown-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-36\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-37\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-38\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-39\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-40\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-41\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#close-grip-pulldown-m-mo-42\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#close-grip-pulldown-m-mmask)\"><g class=\"u-stroke\"><use href=\"#close-grip-pulldown-m-m-shcap.r\"/><use href=\"#close-grip-pulldown-m-m-upper.r\"/><use href=\"#close-grip-pulldown-m-m-elbowcap.r\"/><use href=\"#close-grip-pulldown-m-m-fore.r\"/><use href=\"#close-grip-pulldown-m-m-fist.r\"/><use href=\"#close-grip-pulldown-m-m-eq0\"/><use href=\"#close-grip-pulldown-m-m-eq1\"/><use href=\"#close-grip-pulldown-m-m-eq2\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MDSqHzG1L.x1*_s\"/><path class=\"m-line\" d=\"~MPRqU-N1LmGW5\"/><path class=\"m-line\" d=\"~MPRqJIP1L0Kz3\"/><path class=\"m-arrow\" d=\"~MPIrJHD1LP*1FO8M-nEkL_nFkLxbXP1\"/><path class=\"leader m\" d=\"M135.92 239.62L169 246H179\"/><path class=\"leader m\" d=\"~My_h!GP1LBy3A4\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"close-grip-pulldown-m-low\" data-key=\"low\" data-cue=\"The handle is pulled past the chin, down the chest.\" class=\"plate-callout two m\" style=\"left:48.6%;top:62.57%\" aria-pressed=\"true\">Pulled<br>too low</button><button type=\"button\" id=\"close-grip-pulldown-m-back\" data-key=\"back\" data-cue=\"The elbows drive back behind the body.\" class=\"plate-callout two m\" style=\"left:5.03%;top:63.13%\" aria-pressed=\"false\">Elbows<br>behind</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "thighs",
        cues: [{ key: "thighs", cue: "Set the thigh pad tight on top of the thighs." }, { key: "elbows", cue: "Drive the elbows down toward the hips, upper arms tucked at the sides." }, { key: "chin", cue: "Stop when the handle is just below the chin." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "low",
        cues: [{ key: "low", cue: "The handle is pulled past the chin, down the chest." }, { key: "back", cue: "The elbows drive back behind the body." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Pulled too low</b><span>The handle is pulled past the chin, down the chest.</span></li><li><b>Elbows behind</b><span>The elbows drive back behind the body.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 2 seconds, return 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div></div>",
      alt: "Close-grip pulldown, side view. Seated with the thighs under the knee pad, a V-handle is pulled from straight arms overhead to just below the chin, elbows down to the hips.",
      mistakeAlt: "Close-Grip Pulldown: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "pull",
    "orientation": "neutral",
    "handle": "v-handle",
    "loadAxis": "across",
    "width": {
      "text": "Close, set by the V-handle.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-close-grip-lat-pulldown",
          "strengthlog-neutral-close-grip-lat-pulldown"
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
      "limitText": "Keep the wrists from curling forward.",
      "claim": {
        "tags": [
          "MECH",
          "CONVENTION"
        ],
        "sources": [
          "odriscoll-1992",
          "hand-key-v-handle"
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
    "gripLine": "V-handle, palms facing each other, thumbs around the handle.",
    "cue": "Palms in, thumbs wrapped."
  },
  contacts: [
    "seat-back",
    "brace-pad"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Clip a V-handle to the cable.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-close-grip-lat-pulldown",
          "strengthlog-neutral-close-grip-lat-pulldown"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "adjust",
      "text": "Set the thigh pads tight on your thighs when you sit.",
      "zoom": "pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-close-grip-lat-pulldown"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "grip",
      "text": "Palms facing each other, thumbs around the handle.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "puregym-close-grip-lat-pulldown",
          "hk-baechle-grip"
        ],
        "note": "c1, c16"
      }
    },
    {
      "kind": "position",
      "text": "Lean back slightly, no more than about 30 degrees.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "ace-lat-pulldown"
        ],
        "note": "c4"
      }
    },
    {
      "kind": "brace",
      "text": "Draw your shoulder blades down to start the pull.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "ace-lat-pulldown"
        ],
        "note": "c9"
      }
    }
  ],
  posture: [
    {
      "key": "thighs",
      "label": "Thighs pinned",
      "detail": "Thighs pinned under the pad all set.",
      "anchor": {
        "pose": "end",
        "at": "thighTop.r"
      },
      "zoom": "pad",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "ace-lat-pulldown"
        ],
        "note": "c3"
      }
    },
    {
      "key": "lean",
      "label": "Fixed lean",
      "detail": "Slight lean back that does not change during the pull.",
      "anchor": {
        "pose": "end",
        "at": "backMid"
      },
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "ace-lat-pulldown"
        ],
        "note": "c4"
      }
    },
    {
      "key": "elbows",
      "label": "Elbows to hips",
      "detail": "Elbows down toward the hips, upper arms tucked.",
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
          "puregym-close-grip-lat-pulldown"
        ],
        "note": "c5"
      }
    },
    {
      "key": "stop",
      "label": "Handle below chin",
      "detail": "Handle stops just below the chin. Stop when the elbows start moving back.",
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
          "puregym-close-grip-lat-pulldown"
        ],
        "note": "c7, c5"
      }
    },
    {
      "key": "return",
      "label": "Slow return",
      "detail": "Controlled on the way up, no momentum.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-close-grip-lat-pulldown"
        ],
        "note": "c8"
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
    },
    {
      "key": "pad",
      "chip": "Knee pad",
      "heading": "Knee pad: right and wrong",
      "kind": "posture"
    }
  ],
  chips: [
    "hand",
    "bottom",
    "pad",
    "feel"
  ],
  copy: {
    "setupLine": "Pin your thighs under the pad. Lean back slightly and keep that lean.",
    "mistakeLine": "Don't pull the handle past your chin. Stop when your elbows stop moving down.",
    "cueLine": "Elbows to hips, handle to chin.",
    "variantLine": "Drawn with a V-handle on a pulldown machine."
  },
  mistakes: [
    {
      "key": "low",
      "title": "Pulling too low",
      "zoom": "bottom",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "puregym-close-grip-lat-pulldown",
          "ace-lat-pulldown"
        ],
        "note": "c6, c7, c5"
      },
      "fix": "Stop when the handle is just below your chin."
    },
    {
      "key": "rock",
      "title": "Rocking the torso back",
      "claim": {
        "tags": [
          "MECH",
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-pulldown",
          "puregym-close-grip-lat-pulldown"
        ],
        "note": "c4, c8"
      },
      "fix": "Hold a slight lean and keep it still."
    },
    {
      "key": "fast",
      "title": "Fast return",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-close-grip-lat-pulldown"
        ],
        "note": "c8"
      },
      "fix": "Control the handle all the way back up."
    }
  ],
  risks: [
    {
      "key": "shoulder",
      "text": "Pulling past where the elbows stop moving down stresses the shoulder.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "ace-lat-pulldown"
        ],
        "note": "c7"
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
    "andersen-2014",
    "odriscoll-1992",
    "puregym-close-grip-lat-pulldown",
    "signorile-2002",
    "strengthlog-neutral-close-grip-lat-pulldown",
    "hk-baechle-grip",
    "hand-key-v-handle",
    "nhs-wrist-pain",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/close_grip_pulldown.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

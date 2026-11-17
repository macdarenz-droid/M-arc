// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=48ebb81ca48ee1d2679cef8285d34e6b79ba49e952e3ea2c4a84d84f285e9d8a
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_cable_curl",
  name: "Cable Curl",
  hashes: { inputsSha256: "48ebb81ca48ee1d2679cef8285d34e6b79ba49e952e3ea2c4a84d84f285e9d8a", golden: "abf44827998343aedd339caea47b6acc12b77a33b999c1f0018aef1dba874175" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"cable-curl-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"cable-curl-n-st-fore.l\" d=\"~#F12y(rPSA1XGrxDB1*7_6k*1HpRz1-8(4V2mRlypKdH5E7U8*2De.kUp7Y2G3P9Suxv_1tE5(8U7W6UkG8AbzdP4Xl00000000012001001001200000000100000000020000011012100001010021011101002002100010\"/><path id=\"cable-curl-n-st-fist.l\" d=\"~~AIw1wIsww10\"/><path id=\"cable-curl-n-st-fore.r\" d=\"^0\"/><path id=\"cable-curl-n-st-fist.r\" d=\"^1\"/><path id=\"cable-curl-n-g0-fore.r\" d=\"~#F12(Or_!A1.UqXAB1BaH2N1I1_D1.j*9a-2jVuFcIeO1KaH4z9FbIuydO1J2E7_6NG1Idw20-8N5Y3P9AmF2!fT6yeEh02000000020021012100010000010010100002000000202000000000010100000200021001000000\"/><path id=\"cable-curl-n-g0-fist.r\" d=\"~~Azz1wzw1ww10\"/><path id=\"cable-curl-n-g1-fore.r\" d=\"~#F12U(qP)A1*yqx_A1zaT2(1hUI18x9E4z2.1.w1G3zc*7BbvGdY5*w1O2O2P1R9W2wI1F7Y1sIasx1yaUiDcAhP1NkX800000000010001101000011000100010000010111002002001010011000200000020000000002020\"/><path id=\"cable-curl-n-g1-fist.r\" d=\"~~Y-z1AWA1ww10\"/><path id=\"cable-curl-n-g2-fore.r\" d=\"~#F12yNq!-A1)XpGFA1-7*6y2cND1Jk*5)7x1R2VrBi)6TcO9)5Oez1)rIh.26-9z2_y1JqA1S1R9)3R5N8_aJjSeF9AmW120000202001010002002000101012000001001010000100110101011010000000010100000000000\"/><path id=\"cable-curl-n-g2-fist.r\" d=\"~~(Gy1yzG1ww10\"/><path id=\"cable-curl-n-e-thigh.l\" d=\"~#F12H(oA!E1zYoIKD1I2TbE12Y6N(1P5B8U2)39BV1AbTnx1BkOdGmG5.U1)2X3G6R77_(1F11F1.b-vzaVj(G1_1(z1yoUE100200200000010100000020000000000000000000200100000110100002000000020001200000000\"/><path id=\"cable-curl-n-e-kneecap.l\" d=\"~~YSqN)T1_J10\"/><path id=\"cable-curl-n-e-shank.l\" d=\"~#F12FRqw*T1OXqxNS1N2VbH14P1y)1J6R7w3X37xz2w8Bdk)bT6)dF7Ty2O2z4R5z8B8U(1B13E1-bId(aOe(nB1YlwcHp00000000020011000022000000001000110110002000010010000020000000002100000200000011\"/><path id=\"cable-curl-n-e-foot.l\" d=\"~#o2DNqDB)1X)qEB(1YcF3Uh)7Sp*nU-2E3-J2-4ID1)7)n0TG1_4BbXc_sEbKmUp001002100210120001010020000000100010020010101001\"/><path id=\"cable-curl-n-e-shcap.l\" d=\"~~!RpFRqwP10\"/><path id=\"cable-curl-n-e-upper.l\" d=\"~#F12!RpFRq-SpRKpe.8a1J2WO1D3)5P1)2W5KD1yaXi0OgxaXiX5KD1K1)2B3)5G2WO1b1d.8Egx1TdPp1PmYdPp10120000000020002020000010000000100000000000000000000010000002001000001010000000\"/><path id=\"cable-curl-n-e-elbowcap.l\" d=\"~~W(p__z1Dz10\"/><path id=\"cable-curl-n-e-fore.l\" d=\"~#F12wyqFKA1RWpOTz1V3X9U1H1Wo_z1R1.98-2zg-sdKeV5X9EcV7.gGsT2B1X7I6YiJE18y2R6z8*8w5mDmU8!e(iYb10100202100011000000000000101010000121200000100001002000000001001001002100002001\"/><path id=\"cable-curl-n-e-fist.l\" d=\"~~J(uwHJ1ww10\"/><path id=\"cable-curl-n-e-head\" d=\"~#w12wIrAFg-XpR(fBjFjBjS9Bbz3E3Y4X4)7x8EbRhGm_4.cT1R9Bj0NmBbHmI6!kA3DjygT1Dj0000020000001200010000101100020100000000000000100000210000000101\"/><path id=\"cable-curl-n-e-torso\" d=\"~#_12w.pAwlTAqXRjR9-1B3O5S9(eU9waYcwgN60I6)nKm)7XcY4(fX4_kI6Nm)fShTh_4T9)7)fBrzz1EbErG60V90!cwgA3w8Xc)7)fWaK6AiN6W3_cO8A3w8zT2ww101012000000002000100000021002101102001120000000000000101000000001200010120111000000010000001001012000001001000000100\"/><path id=\"cable-curl-n-e-thigh.r\" d=\"^8\"/><path id=\"cable-curl-n-e-kneecap.r\" d=\"^9\"/><path id=\"cable-curl-n-e-shank.r\" d=\"^10\"/><path id=\"cable-curl-n-e-foot.r\" d=\"^11\"/><path id=\"cable-curl-n-e-shcap.r\" d=\"^12\"/><path id=\"cable-curl-n-e-upper.r\" d=\"^13\"/><path id=\"cable-curl-n-e-elbowcap.r\" d=\"^14\"/><path id=\"cable-curl-n-e-fore.r\" d=\"^15\"/><path id=\"cable-curl-n-e-fist.r\" d=\"^16\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#cable-curl-n-dots)\"/>\n  <path class=\"floorline\" d=\"M81.49 339.5H326.51\"/><path class=\"eq\" d=\"~MAFS1YDy2LHHb0QF60xAbE6LE6OlQ0E6E6PlLxAbF6QE60yAbF6LF6PlQ0F6F6OlZ\"/><path class=\"eq\" d=\"~MP*U1Dy5L_R80QJ90KF8I9LI9XqQ0I9I9YqLKF8J9QI90NF8J9LJ9YqQ0J9J9XqZ\"/><path class=\"eq\" d=\"~M((U1YDy2LFx10QF60)qE6LE6-R!1Q0E6E6_R!1L)qF6QE60wrF6LF6_R!1Q0F6F6-R!1Z\"/><path class=\"eq\" d=\"~MWJ!1YDy2LDx10QF60*qE6LE6-R!1Q0E6E6_R!1L*qF6QE60(qF6LF6_R!1Q0F6F6-R!1Z\"/><path class=\"eq-solid\" d=\"~~NDY1Dy7ww10\"/><path class=\"eq-pin\" d=\"~~Dw-1Dy7F60\"/><path class=\"eq-solid\" d=\"~~WYS1Dy7ww10\"/><path class=\"eq-pin\" d=\"~~NST1Dy7F60\"/><path class=\"eq-solid\" d=\"~~SOS1NU*1AG12\"/><path class=\"eq-pin\" d=\"~~NST1NU*1F60\"/><path class=\"eq-cable\" d=\"~MND-1Dy6LXK50\"/><path class=\"eq-cable\" d=\"~MWYS1Dy7Lz9FSW1\"/><path class=\"eq-thin\" d=\"~MWYX1!Ow2L0-WR1\"/><path class=\"eq-thin\" d=\"~MAU_1!Ow2L0-WR1\"/><path class=\"eq\" d=\"~MSzX1YDy2LYB40QF60O)3E6LE6zA1Q0E6E6AA1LO)3F6QE60P)3F6LF6AA1Q0F6F6zA1Z\"/><path class=\"eq\" d=\"~MH*W1HI-1LFS40LES4SA7LES4RA7Z\"/><path class=\"eq-thin\" d=\"M281.17 326.57H304.57M281.17 322.91H304.57M281.17 319.25H304.57M281.17 315.59H304.57M281.17 311.94H304.57M281.17 308.28H304.57M281.17 304.62H304.57M281.17 300.97H304.57M281.17 297.31H304.57\"/><path class=\"arc measure\" d=\"M138.54 183.49L138.54 165.49A18 18 0 0 1 147.54 199.08Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#cable-curl-n-st-fore.l\"/><use href=\"#cable-curl-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-n-st-fore.l\"/><use href=\"#cable-curl-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-curl-n-st-fore.r\"/><use href=\"#cable-curl-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-n-st-fore.r\"/><use href=\"#cable-curl-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-cable\" d=\"~MH!U1_)!1LB-g-!s\"/><path class=\"eq-solid\" d=\"~M(OA1wzw1C0z2X10g7C00O1uafC20tP10hC001W17fC20oP1d9C20P1oh0C02W13f8C21H1n7gC20qO10iC000V1agC20tO1g8C01K1pi2Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-curl-n-g0-fore.r\"/><use href=\"#cable-curl-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-n-g0-fore.r\"/><use href=\"#cable-curl-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-cable\" d=\"~Mw.U1Y*!1LExgTEo\"/><path class=\"eq-solid\" d=\"~MSDB1AWA1C0z2X10g9C01O1uafC20tN10hC000Y19fC10uP1f9C01N1uh0C00Y10faC02P1t9gC10uK10iC000X1agC20tO1gaC02K1ti0Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-curl-n-g1-fore.r\"/><use href=\"#cable-curl-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-n-g1-fore.r\"/><use href=\"#cable-curl-n-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-cable\" d=\"~MPXU1D-!1LRKhzWj\"/><path class=\"eq-solid\" d=\"~MWWz1yzG1C0z2V10g9C01O1uafC00nN10hC104Y17fC20oP1f9C01P1uh0C00W10faC02P1t7gC20qK11iC100X18gC00tO1gaC02O1ti0Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-curl-n-g2-fore.r\"/><use href=\"#cable-curl-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-n-g2-fore.r\"/><use href=\"#cable-curl-n-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MH*W1YDU1LFS40LES4AG4LES4zG4Z\"/><path class=\"eq-thin\" d=\"M281.17 285.61H304.57M281.17 281.95H304.57M281.17 278.29H304.57M281.17 274.63H304.57M281.17 270.98H304.57\"/><path class=\"eq-cable\" d=\"~MND-1Dy7L0SAK1\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#cable-curl-n-e-thigh.l\"/><use href=\"#cable-curl-n-e-kneecap.l\"/><use href=\"#cable-curl-n-e-shank.l\"/><use href=\"#cable-curl-n-e-foot.l\"/><use href=\"#cable-curl-n-e-shcap.l\"/><use href=\"#cable-curl-n-e-upper.l\"/><use href=\"#cable-curl-n-e-elbowcap.l\"/><use href=\"#cable-curl-n-e-fore.l\"/><use href=\"#cable-curl-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-n-e-thigh.l\"/><use href=\"#cable-curl-n-e-kneecap.l\"/><use href=\"#cable-curl-n-e-shank.l\"/><use href=\"#cable-curl-n-e-foot.l\"/><use href=\"#cable-curl-n-e-shcap.l\"/><use href=\"#cable-curl-n-e-upper.l\"/><use href=\"#cable-curl-n-e-elbowcap.l\"/><use href=\"#cable-curl-n-e-fore.l\"/><use href=\"#cable-curl-n-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"~MFSU1DU!1L.TkBHg\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-curl-n-e-head\"/><use href=\"#cable-curl-n-e-torso\"/><use href=\"#cable-curl-n-e-thigh.r\"/><use href=\"#cable-curl-n-e-kneecap.r\"/><use href=\"#cable-curl-n-e-shank.r\"/><use href=\"#cable-curl-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-n-e-head\"/><use href=\"#cable-curl-n-e-torso\"/><use href=\"#cable-curl-n-e-thigh.r\"/><use href=\"#cable-curl-n-e-kneecap.r\"/><use href=\"#cable-curl-n-e-shank.r\"/><use href=\"#cable-curl-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~MDIw1wHJ1C0z2V11g7C02O1o8fC10pP12hC200W17fC00uP1f7C02P1qh0C00W10faC02P1t9gC00oK10iC203X18gC10nO1gaC02O1ti0Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-curl-n-e-shcap.r\"/><use href=\"#cable-curl-n-e-upper.r\"/><use href=\"#cable-curl-n-e-elbowcap.r\"/><use href=\"#cable-curl-n-e-fore.r\"/><use href=\"#cable-curl-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-n-e-shcap.r\"/><use href=\"#cable-curl-n-e-upper.r\"/><use href=\"#cable-curl-n-e-elbowcap.r\"/><use href=\"#cable-curl-n-e-fore.r\"/><use href=\"#cable-curl-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"138.54\" cy=\"135.88\" r=\"2.25\"/><circle class=\"joint\" cx=\"138.54\" cy=\"183.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"140\" cy=\"203.54\" r=\"2.25\"/><circle class=\"joint\" cx=\"143.29\" cy=\"266.15\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#F20YWy1YXtzOy1-Ktdadab6daf6b6f8f4d6f4f4d2h4d0h4d1f0h0d1h1d1f3f1f5d5f3d7d5d7d7d7d9b9b7bb001010100000010000110101010210000000000000000021000000000002000021000000100000101002000002021000000100000001000020000010101000000000000200001011\"/><path class=\"arrow\" d=\"~MYGx1WOI1LYbEF1LYfYx2Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M138.54 165.49A18 18 0 0 1 147.54 199.08\"/><g class=\"arc-ticks\"><path d=\"~M!xrHzx1L0EY1\"/><path d=\"~MUKsUDD1LAsWP1\"/></g><path class=\"leader\" d=\"~MU_uP_y1LAS2EHe\"/></g></g><path class=\"leader\" d=\"~M!Fq__z1LK.4D3\"/><circle class=\"anchor\" cx=\"134.54\" cy=\"183.49\" r=\"1.5\"/><path class=\"leader\" d=\"M153.23 215.86L121.12 230H111.12\"/><circle class=\"anchor\" cx=\"153.23\" cy=\"215.86\" r=\"1.5\"/><path class=\"leader\" d=\"M121.57 147.22L106.48 138H96.48\"/><circle class=\"anchor\" cx=\"121.57\" cy=\"147.22\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"cable-curl-n-elbows\" data-key=\"elbows\" data-cue=\"Keep the elbows close to your torso. Never let the upper arms go back.\" class=\"plate-callout two\" style=\"left:8.94%;top:45.25%\" aria-pressed=\"true\">Elbows at<br>sides</button><button type=\"button\" id=\"cable-curl-n-wrists\" data-key=\"wrists\" data-cue=\"Keep the hand in line with the forearm.\" class=\"plate-callout two\" style=\"left:12.01%;top:58.1%\" aria-pressed=\"false\">Straight<br>wrists</button><button type=\"button\" id=\"cable-curl-n-still\" data-key=\"still\" data-cue=\"Keep the torso upright and still. Only the arms move.\" class=\"plate-callout two\" style=\"left:15.64%;top:32.4%\" aria-pressed=\"false\">Still<br>body</button><span class=\"plate-arc-label\" style=\"left:48.6%;top:27.37%\"><b>Elbow</b><span>slightly bent</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"cable-curl-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"cable-curl-m-st-fore.l\" d=\"^0\"/><path id=\"cable-curl-m-st-fist.l\" d=\"^1\"/><path id=\"cable-curl-m-st-fore.r\" d=\"^0\"/><path id=\"cable-curl-m-st-fist.r\" d=\"^1\"/><path id=\"cable-curl-m-g0-fore.r\" d=\"^2\"/><path id=\"cable-curl-m-g0-fist.r\" d=\"^3\"/><path id=\"cable-curl-m-g1-fore.r\" d=\"^4\"/><path id=\"cable-curl-m-g1-fist.r\" d=\"^5\"/><path id=\"cable-curl-m-g2-fore.r\" d=\"^6\"/><path id=\"cable-curl-m-g2-fist.r\" d=\"^7\"/><path id=\"cable-curl-m-e-thigh.l\" d=\"^8\"/><path id=\"cable-curl-m-e-kneecap.l\" d=\"^9\"/><path id=\"cable-curl-m-e-shank.l\" d=\"^10\"/><path id=\"cable-curl-m-e-foot.l\" d=\"^11\"/><path id=\"cable-curl-m-e-shcap.l\" d=\"^12\"/><path id=\"cable-curl-m-e-upper.l\" d=\"^13\"/><path id=\"cable-curl-m-e-elbowcap.l\" d=\"^14\"/><path id=\"cable-curl-m-e-fore.l\" d=\"^15\"/><path id=\"cable-curl-m-e-fist.l\" d=\"^16\"/><path id=\"cable-curl-m-e-head\" d=\"^17\"/><path id=\"cable-curl-m-e-torso\" d=\"^18\"/><path id=\"cable-curl-m-e-thigh.r\" d=\"^8\"/><path id=\"cable-curl-m-e-kneecap.r\" d=\"^9\"/><path id=\"cable-curl-m-e-shank.r\" d=\"^10\"/><path id=\"cable-curl-m-e-foot.r\" d=\"^11\"/><path id=\"cable-curl-m-e-shcap.r\" d=\"^12\"/><path id=\"cable-curl-m-e-upper.r\" d=\"^13\"/><path id=\"cable-curl-m-e-elbowcap.r\" d=\"^14\"/><path id=\"cable-curl-m-e-fore.r\" d=\"^15\"/><path id=\"cable-curl-m-e-fist.r\" d=\"^16\"/><path id=\"cable-curl-m-m-eq0\" d=\"~MDIw1P)J1C0z2V10g7C00O1u8fC10pP12hC200W17fC00uP1f9C00P1oh0C00W12f8C01P1n9gC00oO10iC203V18gC10nO1g8C01O1pi0Z\"/><path id=\"cable-curl-m-mf-head\" d=\"^17\"/><path id=\"cable-curl-m-mf-torso\" d=\"^18\"/><path id=\"cable-curl-m-mf-thigh.l\" d=\"^8\"/><path id=\"cable-curl-m-mf-kneecap.l\" d=\"^9\"/><path id=\"cable-curl-m-mf-shank.l\" d=\"^10\"/><path id=\"cable-curl-m-mf-foot.l\" d=\"^11\"/><path id=\"cable-curl-m-mf-shcap.l\" d=\"^12\"/><path id=\"cable-curl-m-mf-upper.l\" d=\"~#F12NTpS*qBIp-_p-1X881PeNK1S1T6kB3G4XD1(4TkE4*fOeRfKfXz1B2K2R4)4!9WN170X2K8*fA3V6AsY5_lYjAl00000000001001000000000000000000100110011000000001000021000200000100000002000100\"/><path id=\"cable-curl-m-mf-elbowcap.l\" d=\"~~(Hs!Pz1Dz10\"/><path id=\"cable-curl-m-mf-fore.l\" d=\"~#F12SHsH_z1EDsK(y1vIaD1U1SeyG1w1*9uV2)7*vJ3Be*2-a-9Ra)8.vx2X1.5B8Y7(H15w2I4R9X9P2E5UlP4UgAfFg00000000010101010110100000010110100000100120020111000020000010000200020002000000\"/><path id=\"cable-curl-m-mf-fist.l\" d=\"~~J(uP)J1ww10\"/><path id=\"cable-curl-m-mf-thigh.r\" d=\"^8\"/><path id=\"cable-curl-m-mf-kneecap.r\" d=\"^9\"/><path id=\"cable-curl-m-mf-shank.r\" d=\"^10\"/><path id=\"cable-curl-m-mf-foot.r\" d=\"^11\"/><path id=\"cable-curl-m-mf-shcap.r\" d=\"^12\"/><path id=\"cable-curl-m-mf-upper.r\" d=\"^59\"/><path id=\"cable-curl-m-mf-elbowcap.r\" d=\"^60\"/><path id=\"cable-curl-m-mf-fore.r\" d=\"^61\"/><path id=\"cable-curl-m-mf-fist.r\" d=\"^62\"/><path id=\"cable-curl-m-mo-0\" d=\"^17\"/><path id=\"cable-curl-m-mo-1\" d=\"^18\"/><path id=\"cable-curl-m-mo-2\" d=\"^8\"/><path id=\"cable-curl-m-mo-3\" d=\"^9\"/><path id=\"cable-curl-m-mo-4\" d=\"^10\"/><path id=\"cable-curl-m-mo-5\" d=\"^11\"/><path id=\"cable-curl-m-mo-6\" d=\"^12\"/><path id=\"cable-curl-m-mo-7\" d=\"^13\"/><path id=\"cable-curl-m-mo-8\" d=\"^14\"/><path id=\"cable-curl-m-mo-9\" d=\"^15\"/><path id=\"cable-curl-m-mo-10\" d=\"^16\"/><path id=\"cable-curl-m-mo-11\" d=\"^8\"/><path id=\"cable-curl-m-mo-12\" d=\"^9\"/><path id=\"cable-curl-m-mo-13\" d=\"^10\"/><path id=\"cable-curl-m-mo-14\" d=\"^11\"/><path id=\"cable-curl-m-mo-15\" d=\"^12\"/><path id=\"cable-curl-m-mo-16\" d=\"^13\"/><path id=\"cable-curl-m-mo-17\" d=\"^14\"/><path id=\"cable-curl-m-mo-18\" d=\"^15\"/><path id=\"cable-curl-m-mo-19\" d=\"^16\"/><path id=\"cable-curl-m-mo-20\" d=\"^20\"/><path id=\"cable-curl-m-mo-21\" d=\"^21\"/><path id=\"cable-curl-m-mo-22\" d=\"^22\"/><path id=\"cable-curl-m-mo-23\" d=\"^23\"/><path id=\"cable-curl-m-mo-24\" d=\"^24\"/><path id=\"cable-curl-m-mo-25\" d=\"^25\"/><path id=\"cable-curl-m-mo-26\" d=\"^26\"/><path id=\"cable-curl-m-mo-27\" d=\"^27\"/><path id=\"cable-curl-m-mo-28\" d=\"^28\"/><path id=\"cable-curl-m-mo-29\" d=\"^29\"/><path id=\"cable-curl-m-mo-30\" d=\"^34\"/><path id=\"cable-curl-m-mo-31\" d=\"^35\"/><path id=\"cable-curl-m-mo-32\" d=\"^44\"/><path id=\"cable-curl-m-mo-33\" d=\"^48\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#cable-curl-m-dots)\"/>\n  <path class=\"floorline\" d=\"^19\"/><path class=\"eq\" d=\"^20\"/><path class=\"eq\" d=\"^21\"/><path class=\"eq\" d=\"^22\"/><path class=\"eq\" d=\"^23\"/><path class=\"eq-solid\" d=\"^24\"/><path class=\"eq-pin\" d=\"^25\"/><path class=\"eq-solid\" d=\"^26\"/><path class=\"eq-pin\" d=\"^27\"/><path class=\"eq-solid\" d=\"^28\"/><path class=\"eq-pin\" d=\"^29\"/><path class=\"eq-cable\" d=\"^30\"/><path class=\"eq-cable\" d=\"^31\"/><path class=\"eq-thin\" d=\"^32\"/><path class=\"eq-thin\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq-thin\" d=\"^36\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#cable-curl-m-st-fore.l\"/><use href=\"#cable-curl-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-m-st-fore.l\"/><use href=\"#cable-curl-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-curl-m-st-fore.r\"/><use href=\"#cable-curl-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-m-st-fore.r\"/><use href=\"#cable-curl-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-cable\" d=\"^38\"/><path class=\"eq-solid\" d=\"^39\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-curl-m-g0-fore.r\"/><use href=\"#cable-curl-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-m-g0-fore.r\"/><use href=\"#cable-curl-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-cable\" d=\"^40\"/><path class=\"eq-solid\" d=\"^41\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-curl-m-g1-fore.r\"/><use href=\"#cable-curl-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-m-g1-fore.r\"/><use href=\"#cable-curl-m-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-cable\" d=\"^42\"/><path class=\"eq-solid\" d=\"^43\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-curl-m-g2-fore.r\"/><use href=\"#cable-curl-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-m-g2-fore.r\"/><use href=\"#cable-curl-m-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^44\"/><path class=\"eq-thin\" d=\"^45\"/><path class=\"eq-cable\" d=\"^46\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#cable-curl-m-e-thigh.l\"/><use href=\"#cable-curl-m-e-kneecap.l\"/><use href=\"#cable-curl-m-e-shank.l\"/><use href=\"#cable-curl-m-e-foot.l\"/><use href=\"#cable-curl-m-e-shcap.l\"/><use href=\"#cable-curl-m-e-upper.l\"/><use href=\"#cable-curl-m-e-elbowcap.l\"/><use href=\"#cable-curl-m-e-fore.l\"/><use href=\"#cable-curl-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-m-e-thigh.l\"/><use href=\"#cable-curl-m-e-kneecap.l\"/><use href=\"#cable-curl-m-e-shank.l\"/><use href=\"#cable-curl-m-e-foot.l\"/><use href=\"#cable-curl-m-e-shcap.l\"/><use href=\"#cable-curl-m-e-upper.l\"/><use href=\"#cable-curl-m-e-elbowcap.l\"/><use href=\"#cable-curl-m-e-fore.l\"/><use href=\"#cable-curl-m-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"^47\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-curl-m-e-head\"/><use href=\"#cable-curl-m-e-torso\"/><use href=\"#cable-curl-m-e-thigh.r\"/><use href=\"#cable-curl-m-e-kneecap.r\"/><use href=\"#cable-curl-m-e-shank.r\"/><use href=\"#cable-curl-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-m-e-head\"/><use href=\"#cable-curl-m-e-torso\"/><use href=\"#cable-curl-m-e-thigh.r\"/><use href=\"#cable-curl-m-e-kneecap.r\"/><use href=\"#cable-curl-m-e-shank.r\"/><use href=\"#cable-curl-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^48\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-curl-m-e-shcap.r\"/><use href=\"#cable-curl-m-e-upper.r\"/><use href=\"#cable-curl-m-e-elbowcap.r\"/><use href=\"#cable-curl-m-e-fore.r\"/><use href=\"#cable-curl-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-curl-m-e-shcap.r\"/><use href=\"#cable-curl-m-e-upper.r\"/><use href=\"#cable-curl-m-e-elbowcap.r\"/><use href=\"#cable-curl-m-e-fore.r\"/><use href=\"#cable-curl-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"138.54\" cy=\"135.88\" r=\"2.25\"/><circle class=\"joint\" cx=\"138.54\" cy=\"183.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"140\" cy=\"203.54\" r=\"2.25\"/><circle class=\"joint\" cx=\"143.29\" cy=\"266.15\" r=\"2.25\"/></g><mask id=\"cable-curl-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#cable-curl-m-mf-head\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-torso\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-shank.l\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-foot.l\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-upper.l\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-fore.l\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-fist.l\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-shank.r\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-foot.r\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-upper.r\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-fore.r\" fill=\"#000\"/><use href=\"#cable-curl-m-mf-fist.r\" fill=\"#000\"/><use href=\"#cable-curl-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-curl-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#cable-curl-m-mmask)\"><g class=\"u-stroke\"><use href=\"#cable-curl-m-m-eq0\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MNTpS*qLaU4Le0L83L80L25L21L35L75L35L07L15L11L03L00L22L02L37L1dL35L22L4cL8kL6sLeD1LcJ1LcD1L8sL6mL68L02L0bL3hL1fL25L01L21L03L01L00L01L28L08L24L23L39L0hL3lL1vL5vL5nL1jL1jL0dL2bL47L45L85L4bL49L2bL07L07L57L15L37L27L15L19L37L55L97L97L93L51L73L57L7fL7dL7jL7pLbrL9tL9lL5dL59L03L12L6aL08L01L00L01L31L13L10L13L5dL7jL37L10L2cL4iL8w1L8D1LaN1LaA1L4uL6mL2aL02L03L5dL09L04L20L10L11L23L35L15L27L27L05L13L31L72L72Ld6Lb1Lb5L70L50L7aL1cL3iL0mL3kL5gL5gL3cL2eL2aL4cL66L2cL0aL2cL2aL6aLacLcaLeaLegLakLccL8aLa4L80L87L47\"/><path class=\"m-line\" d=\"~MJRu!Pz1LV2PdL*4x2L-3-3Lx2*4L2I5Lw2*4L_3-3L(4x2LJ52L(4w2L_3_3Lw2(4L2J5Lx2(4L-3_3L*4w2\"/><path class=\"m-line\" d=\"~MSHsH_z1L2W3La2L41L61L01L25L13L39L37L09L15L03L03L22L12L44L35L19L13L22L4cL6gLasLaw1LeF1LcA1L8sL6gL48L20L1dL1hL3jL25L15L23L23L11L20L00L28L46L04L23L17L3dL5jL5pL7nL7nL5hL1dL1bL07L63L21L83L29L23L49L13L15L05L33L13L25L15L13L17L31L77L53L50L50L31L55L3bL5dL3hL1lL7rL5pL3hL5fL15L03L12L08L4aL11L02L01L33L11L35L13L7hL7jL39L11L2aL2iL4sLaA1L8J1L6w1L6sL2iL2aL26L15L39L05L24L02L02L13L11L17L35L1bL07L15L13L31L32L30L96L30L73L51L32L38L18L3cL2iL5gL5eL1aL1aL1aL48L2aL44L48L1aL28L26L4aL88L88Lc8LacLagL88L88L62L42L65L25\"/><path class=\"m-line\" d=\"~MJ(w1P)J1L3A3Lb0L71L93L73L91L77L75L35L97L57L19L37L39L17L0bL27L1bL07L69L67L09L67L87L85L65L87L81Lc3L83L81La0Lc2La1L80L86Lc6L80L86L68L88L86L68L08L6cL66L0cL18L2cL08L1cL36L3cL18L58L96L38L78L76L90L76L96L70Lb1\"/><path class=\"m-line\" d=\"~M_GqUWnLUJ6Pzo\"/><path class=\"leader m\" d=\"M150.74 181.9L120.13 220H110.13\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"cable-curl-m-straight\" data-key=\"straight\" data-cue=\"Your arms go fully straight at the bottom, so the biceps lose tension.\" class=\"plate-callout two m\" style=\"left:4.47%;top:55.31%\" aria-pressed=\"true\">Arms locked<br>straight</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "Keep the elbows close to your torso. Never let the upper arms go back." }, { key: "wrists", cue: "Keep the hand in line with the forearm." }, { key: "still", cue: "Keep the torso upright and still. Only the arms move." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "straight",
        cues: [{ key: "straight", cue: "Your arms go fully straight at the bottom, so the biceps lose tension." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Arms locked straight</b><span>Your arms go fully straight at the bottom, so the biceps lose tension.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower 2 seconds, curl 1 second\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Curl</b><span>1 s</span></div></div></div>",
      alt: "Cable curl, side view. Standing a step back from a low cable pulley with a straight bar in both hands, palms up, the elbows at the sides. The lifter lowers the bar from the shoulders to the thighs, stopping with the elbows slightly bent.",
      mistakeAlt: "Cable Curl: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "curl",
    "orientation": "supinated",
    "handle": "bar-28",
    "loadAxis": "across",
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "hand-key-curl"
        ],
        "note": "card grip.thumb is empty: the curl key's right-pose thumb, a convention, never shown."
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "ext": [
        -10,
        10
      ],
      "limitText": "Keep the hand in line with the forearm.",
      "claim": {
        "tags": [
          "MECH",
          "CONVENTION"
        ],
        "sources": [
          "ace-seated-curl",
          "sl-dbcurl",
          "hand-key-curl"
        ],
        "note": "c9. The ext range is the curl key's wristRange (ga:curl-mid), a convention, not a card number."
      }
    },
    "pose": {
      "view": "radial",
      "forearm": 90,
      "wrist": {
        "ext": 0,
        "dev": 0
      },
      "contactAt": 0.6,
      "fingers": {
        "curl": 1
      },
      "thumb": "wrapped",
      "squeeze": "firm",
      "load": {
        "kind": "gravity"
      }
    },
    "faults": [
      {
        "key": "bent-back",
        "label": "Wrist bent back",
        "pose": {
          "wrist": {
            "dev": 0,
            "ext": 30
          }
        },
        "markers": [
          "lever-arc"
        ],
        "alt": "Wrist bent back, the hand tipped away from the forearm."
      },
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
        "alt": "Wrist bent forward, curled toward the forearm."
      }
    ],
    "gripLine": "Underhand grip, palms up, hands about shoulder-width.",
    "cue": "Wrist in line with the forearm."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set the pulley to the lowest position and attach a bar.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cablecurl"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "grip",
      "text": "Take an underhand grip, hands about shoulder-width.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cablecurl"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Step back from the stack. Stand upright, feet about hip-width.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cablecurl",
          "fb-cablecurl"
        ],
        "note": "c1, c2"
      }
    },
    {
      "kind": "load",
      "text": "Pick a weight you can curl without swinging.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "sl-dbcurl"
        ],
        "note": "c8"
      }
    },
    {
      "kind": "finish",
      "text": "Lift and lower under control, arms slightly bent at the bottom.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cablecurl",
          "fb-cablecurl"
        ],
        "note": "c4, c13"
      }
    }
  ],
  posture: [
    {
      "key": "elbows",
      "label": "Elbows at sides",
      "detail": "Elbows stay close to the torso.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "zoom": "curl-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cablecurl",
          "fb-cablecurl"
        ],
        "note": "c3"
      }
    },
    {
      "key": "upper-arm",
      "label": "Never back",
      "detail": "Upper arms stay still or move slightly forward, never back.",
      "anchor": {
        "pose": "start",
        "at": "shoulder.r"
      },
      "zoom": "curl-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cablecurl",
          "fb-cablecurl"
        ],
        "note": "c3"
      }
    },
    {
      "key": "still",
      "label": "Still body",
      "detail": "Body stays still. Only the arms move.",
      "anchor": {
        "pose": "start",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "sl-dbcurl"
        ],
        "note": "c8"
      }
    },
    {
      "key": "wrists",
      "label": "Straight wrists",
      "detail": "Wrists stay straight.",
      "anchor": {
        "pose": "start",
        "at": "wrist.r"
      },
      "zoom": "hand",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "ace-seated-curl",
          "sl-dbcurl"
        ],
        "note": "c9"
      }
    },
    {
      "key": "control",
      "label": "Controlled lowering",
      "detail": "Lower under control.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cablecurl",
          "fb-cablecurl"
        ],
        "note": "c4"
      }
    },
    {
      "key": "bent",
      "label": "Slight bend",
      "detail": "Keep the arm slightly bent at the bottom to maintain tension.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fb-cablecurl"
        ],
        "note": "c13"
      }
    }
  ],
  zooms: [
    {
      "key": "hand",
      "chip": "Wrist",
      "heading": "Wrist position",
      "kind": "hand",
      "feelRow": "wrist"
    },
    {
      "key": "curl-elbow",
      "chip": "Elbows",
      "heading": "Elbow path",
      "kind": "posture",
      "feelRow": "front-shoulder"
    }
  ],
  chips: [
    "hand",
    "curl-elbow",
    "feel"
  ],
  copy: {
    "setupLine": "Bar on the low pulley, underhand grip. Step back, stand upright, elbows close to your torso.",
    "mistakeLine": "Keep a slight bend at the bottom. Never let your upper arms travel back.",
    "cueLine": "Elbows close, body still."
  },
  mistakes: [
    {
      "key": "straight",
      "title": "Arms straight at the bottom",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fb-cablecurl"
        ],
        "note": "c13"
      },
      "fix": "Limit the range. Keep the arm slightly bent between reps."
    },
    {
      "key": "back",
      "title": "Upper arms travelling back",
      "zoom": "curl-elbow",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "sl-cablecurl",
          "fb-cablecurl",
          "sl-dbcurl"
        ],
        "note": "c3, c7"
      },
      "fix": "Keep the upper arms still by your sides."
    },
    {
      "key": "swing",
      "title": "Swinging the body",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "sl-dbcurl"
        ],
        "note": "c8"
      },
      "fix": "Use less weight and lift with control."
    }
  ],
  risks: [
    {
      "key": "wrist",
      "text": "Bent wrists under load can cause wrist discomfort.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "ace-seated-curl",
          "sl-dbcurl"
        ],
        "note": "c9"
      }
    }
  ],
  riskFlags: [
    "wrist"
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
    "sl-cablecurl",
    "fb-cablecurl",
    "sl-dbcurl",
    "ace-seated-curl",
    "marcolin-2018",
    "acsm-2009",
    "larsen-2026",
    "hand-key-curl",
    "nhs-wrist-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/cable_curl.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

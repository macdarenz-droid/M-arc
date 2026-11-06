// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=2a5012da261ee14cf6a741482f805418f842a66be38f8beac4965f8c5b9391be
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_dumbbell_biceps_curl",
  name: "Dumbbell Biceps Curl",
  hashes: { inputsSha256: "2a5012da261ee14cf6a741482f805418f842a66be38f8beac4965f8c5b9391be", golden: "fdf17f62f6bbd30a28078072aafa42a5106e5a80c1e9f9334471cbed21709070" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-biceps-curl-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-biceps-curl-n-st-fore.r\" d=\"~#F12yJvy!z1xOvxwz1W1Eaq!1P3NI1P3G9U1I2e)w1!6Xc0Eb.6Xcd)w1T1I2R3G9K3NI1p!1T1EaEa5KaSj1FhSaSj00100002202000100000001010000010000000101000000000000000022000001000010000010000\"/><path id=\"dumbbell-biceps-curl-n-st-fist.r\" d=\"~~!PvAVK1ww10\"/><path id=\"dumbbell-biceps-curl-n-g0-fore.r\" d=\"~#F12WSvARA1xBvKYz1K4I9U1y1YrSx1I2T91.2RiGrV1IeO6B9.cR6GjXqV2vE8T5ymUB1g(1I7K7I8W5U2ym!9Ae_jwa00220011010000002001000001000010002000000000000000000000000111000000000002020020\"/><path id=\"dumbbell-biceps-curl-n-g0-fist.r\" d=\"~~NAB1P!I1ww10\"/><path id=\"dumbbell-biceps-curl-n-g0-eq1.dumbbell.0-0\" d=\"~M__E1P!I1LBrAO1LBrzO1LDrzO1LJW10LDrAO1Z\"/><path id=\"dumbbell-biceps-curl-n-g1-fore.r\" d=\"~#F12FAw1U(A1*HvESA1x9x5w23yH1UbT7R6R1G2*uVbT9.aRaX3Iew2zv-aX2m)94UE1DiP1H1Ea*1T3S9_ePgDg(5wmB300200000010000000120001000000102000000002001010000000001010000000000212000200000\"/><path id=\"dumbbell-biceps-curl-n-g1-fist.r\" d=\"~~yXF1AEE1ww10\"/><path id=\"dumbbell-biceps-curl-n-g1-eq1.dumbbell.0-0\" d=\"~MNKI1AEE1LBrAO1LBrzO1LDrzO1LJW10LDrAO1Z\"/><path id=\"dumbbell-biceps-curl-n-g2-fore.r\" d=\"~#F12J_w1S)A1O(v.zB1KauW1B1wG1Te.9vX2v*vD8zeI3.a(2Oa!9-vy9.1A2x8_5!H1.7w2aO9F4P2!9Uly5UgK4DgEf00010100000001002000110020000101012001001000010100002000000001002000000000000002\"/><path id=\"dumbbell-biceps-curl-n-g2-fist.r\" d=\"~~F)F1wIx1ww10\"/><path id=\"dumbbell-biceps-curl-n-g2-eq1.dumbbell.0-0\" d=\"~MWVI1wIx1LBrAO1LErzO1LFrzO1LJW10LFrAO1Z\"/><path id=\"dumbbell-biceps-curl-n-e-thigh.l\" d=\"~#F12HKuH*E1zEuTND1I2TbE12Y6J(1P5B8U2)39zV1AbOnx1EkOdGmG5XU1)2-3G6K77W(1F11F1.b-vBaXjwH1(1_z1woWE100200000020210100002000100000001000000000000100200100000002100000020000021000200\"/><path id=\"dumbbell-biceps-curl-n-e-kneecap.l\" d=\"~~Yxw1wwU1_J10\"/><path id=\"dumbbell-biceps-curl-n-e-shank.l\" d=\"~#F12Fww1U*T1ODw1XNS1N2VbH12P1y)1J6R7w3X37*y2w8Bdk)bT6)dF7Oy2O2x4R5B8B8P(1B10E1*bId(aOewoB1UlwcNp01000000000012000020000000001000110110002001010011000020020101002000000000000211\"/><path id=\"dumbbell-biceps-curl-n-e-foot.l\" d=\"~#o2D*vDB)1XNw1EB(1YcF3Uhx8Sp*nU-2B3-J2-4ID1*7)n0TG1Y4BbXc_sBbKmPp021200100010100000000020020000100110000111101100\"/><path id=\"dumbbell-biceps-curl-n-e-shcap.l\" d=\"~~!wvNSqwP10\"/><path id=\"dumbbell-biceps-curl-n-e-upper.l\" d=\"~#F12!wvNSq-xvXNpe.8a0J2SO1D3*5P1*2W5RD1yaVi0OgxaViX5RD1K1*2B3*5G2SO1b0d.8Egx1TdPp1PmYdPp10120000000021002020000111000000100000010100000000010010000002001000001010000000\"/><path id=\"dumbbell-biceps-curl-n-e-elbowcap.l\" d=\"~~WKvy!z1Dz10\"/><path id=\"dumbbell-biceps-curl-n-e-fore.l\" d=\"~#F12yKx1WTA1XYw1EEB1*7_6k*1HpRz1-8(4V2mRlypKdH5E7U8*2Fe.kPp7!2G3J9Su)u_1tE5(8U7W6UkE8AbEdP4Vl00020000002000001000200000000000000200000000001110100000010020001000002000120010\"/><path id=\"dumbbell-biceps-curl-n-e-fist.l\" d=\"~~A_B1DJsww10\"/><path id=\"dumbbell-biceps-curl-n-e-head\" d=\"~#w12w_w1HGg-DvX)fBjFjBjU9BbE3E3_4X4)7x8BbRhKm_4XcT1T9Bj0NmEbHmG6!kA3DjygT1Dj0000020000011001010000101001000000000100000100100200210000000000\"/><path id=\"dumbbell-biceps-curl-n-e-torso\" d=\"~#_12wHvHxlTTv*SjR9-1B3K5S9_eU9yaYcwgN60I6)nKm)7Xc_4(f-4_kK6Nm*fShTh_4T9)7*fBrEz1EbBrG60V90!cwgA3w8Xc)7)fYaK6wiN6Y3_cO8A3w8zT2ww101002000000000010100000021002101102000100100010000000100000000011000000120111000000010000001001010000000001000000100\"/><path id=\"dumbbell-biceps-curl-n-e-thigh.r\" d=\"^11\"/><path id=\"dumbbell-biceps-curl-n-e-kneecap.r\" d=\"^12\"/><path id=\"dumbbell-biceps-curl-n-e-shank.r\" d=\"^13\"/><path id=\"dumbbell-biceps-curl-n-e-foot.r\" d=\"^14\"/><path id=\"dumbbell-biceps-curl-n-e-shcap.r\" d=\"^15\"/><path id=\"dumbbell-biceps-curl-n-e-upper.r\" d=\"^16\"/><path id=\"dumbbell-biceps-curl-n-e-elbowcap.r\" d=\"^17\"/><path id=\"dumbbell-biceps-curl-n-e-fore.r\" d=\"^18\"/><path id=\"dumbbell-biceps-curl-n-e-fist.r\" d=\"^19\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-biceps-curl-n-dots)\"/>\n  <path class=\"floorline\" d=\"M94.86 339.5H258.7\"/><path class=\"arc measure\" d=\"M166.54 183.69L166.54 203.69A20 20 0 0 0 179.39 168.37Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-n-st-fore.r\"/><use href=\"#dumbbell-biceps-curl-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-n-st-fore.r\"/><use href=\"#dumbbell-biceps-curl-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-n-g0-fore.r\"/><use href=\"#dumbbell-biceps-curl-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-n-g0-fore.r\"/><use href=\"#dumbbell-biceps-curl-n-g0-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-n-g0-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-n-g0-eq1.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-n-g1-fore.r\"/><use href=\"#dumbbell-biceps-curl-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-n-g1-fore.r\"/><use href=\"#dumbbell-biceps-curl-n-g1-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-n-g1-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-n-g1-eq1.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-n-g2-fore.r\"/><use href=\"#dumbbell-biceps-curl-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-n-g2-fore.r\"/><use href=\"#dumbbell-biceps-curl-n-g2-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-n-g2-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-n-g2-eq1.dumbbell.0-0\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-n-e-thigh.l\"/><use href=\"#dumbbell-biceps-curl-n-e-kneecap.l\"/><use href=\"#dumbbell-biceps-curl-n-e-shank.l\"/><use href=\"#dumbbell-biceps-curl-n-e-foot.l\"/><use href=\"#dumbbell-biceps-curl-n-e-shcap.l\"/><use href=\"#dumbbell-biceps-curl-n-e-upper.l\"/><use href=\"#dumbbell-biceps-curl-n-e-elbowcap.l\"/><use href=\"#dumbbell-biceps-curl-n-e-fore.l\"/><use href=\"#dumbbell-biceps-curl-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-n-e-thigh.l\"/><use href=\"#dumbbell-biceps-curl-n-e-kneecap.l\"/><use href=\"#dumbbell-biceps-curl-n-e-shank.l\"/><use href=\"#dumbbell-biceps-curl-n-e-foot.l\"/><use href=\"#dumbbell-biceps-curl-n-e-shcap.l\"/><use href=\"#dumbbell-biceps-curl-n-e-upper.l\"/><use href=\"#dumbbell-biceps-curl-n-e-elbowcap.l\"/><use href=\"#dumbbell-biceps-curl-n-e-fore.l\"/><use href=\"#dumbbell-biceps-curl-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-n-e-head\"/><use href=\"#dumbbell-biceps-curl-n-e-torso\"/><use href=\"#dumbbell-biceps-curl-n-e-thigh.r\"/><use href=\"#dumbbell-biceps-curl-n-e-kneecap.r\"/><use href=\"#dumbbell-biceps-curl-n-e-shank.r\"/><use href=\"#dumbbell-biceps-curl-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-n-e-head\"/><use href=\"#dumbbell-biceps-curl-n-e-torso\"/><use href=\"#dumbbell-biceps-curl-n-e-thigh.r\"/><use href=\"#dumbbell-biceps-curl-n-e-kneecap.r\"/><use href=\"#dumbbell-biceps-curl-n-e-shank.r\"/><use href=\"#dumbbell-biceps-curl-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-n-e-shcap.r\"/><use href=\"#dumbbell-biceps-curl-n-e-upper.r\"/><use href=\"#dumbbell-biceps-curl-n-e-elbowcap.r\"/><use href=\"#dumbbell-biceps-curl-n-e-fore.r\"/><use href=\"#dumbbell-biceps-curl-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-n-e-shcap.r\"/><use href=\"#dumbbell-biceps-curl-n-e-upper.r\"/><use href=\"#dumbbell-biceps-curl-n-e-elbowcap.r\"/><use href=\"#dumbbell-biceps-curl-n-e-fore.r\"/><use href=\"#dumbbell-biceps-curl-n-e-fist.r\"/></g></g><path class=\"disc\" d=\"~MPPF1DJsLBrAO1LErzO1LFrzO1LJW10LFrAO1Z\"/><path class=\"disc-core\" d=\"~~WID1DJsNe0\"/><path class=\"eq-cable m-line\" d=\"~MyJvy!z1LrS3L84L60L40L41L03L27L37L09L27L07L01L23L00L02L06L05L0bL03L04L2aL0kL2qL4A1L2H1L2D1L0sL4kL06L20L49L0nL2fL25L27L21L23L21L10L22L06L0aL20L21L17L2dL0lL0pL1pL1nL0jL0dL2bL45L25L80L40L89L23L47L23L07L03L15L13L45L03L07L13L17L53L39L70L30L55L15L0bL3dL4jL0nL0pL2pL0lL0dL17L01L00L1aL16L22L10L01L13L11L07L35L1fL1nL19L00L36L0kL3sL0D1L1H1L3A1L0qL3kL0aL04L03L0bL05L06L02L00L03L11L17L07L29L07L27L33L01L50L70L34\"/><path class=\"eq-cable m-line\" d=\"~MFEy1AVK1LBrAO1LBrzO1LArzO1LPW10LArAO1LBrAO1\"/><circle class=\"joint\" cx=\"166.54\" cy=\"136.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"166.54\" cy=\"183.69\" r=\"2.25\"/><circle class=\"joint\" cx=\"168\" cy=\"203.73\" r=\"2.25\"/><circle class=\"joint\" cx=\"171.29\" cy=\"266.24\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#H20W)y1yIK1IPy1OOK17n7nbn9ldnblfjflfjjhfhlfjflfjbnbndn7n9n5p7p3n3r3n0p0r2n4p2p6n8n6panalela0000022002000200200001000000000001010010000020000202000000220002101101020000000000000110100020010020000010000222000100000000000100011000000000010001\"/><path class=\"arrow\" d=\"~MSBF1WTtLNz1NmLRz2x3Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M166.54 203.69A20 20 0 0 0 179.39 168.37\"/><g class=\"arc-ticks\"><path d=\"~M!Pw1ywE1L0FY1\"/><path d=\"~MARy1NOx1LDA1xI1\"/></g><path class=\"leader\" d=\"~MySA1yIB1LDB8G(3\"/></g></g><path class=\"leader\" d=\"M166.54 183.69L149.77 176H139.77\"/><circle class=\"anchor\" cx=\"166.54\" cy=\"183.69\" r=\"1.5\"/><path class=\"leader\" d=\"M190.56 155.05L189 118H199\"/><circle class=\"anchor\" cx=\"190.56\" cy=\"155.05\" r=\"1.5\"/><path class=\"leader\" d=\"M149.57 147.41L146.48 130H136.48\"/><circle class=\"anchor\" cx=\"149.57\" cy=\"147.41\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dumbbell-biceps-curl-n-elbows\" data-key=\"elbows\" data-cue=\"Keep the upper arms by your sides, never back, at most slightly forward on top.\" class=\"plate-callout two\" style=\"left:21.79%;top:43.02%\" aria-pressed=\"true\">Elbows<br>at sides</button><button type=\"button\" id=\"dumbbell-biceps-curl-n-wrists\" data-key=\"wrists\" data-cue=\"Keep the hand in line with the forearm, not bent up or down.\" class=\"plate-callout two\" style=\"left:54.19%;top:26.82%\" aria-pressed=\"false\">Straight<br>wrists</button><button type=\"button\" id=\"dumbbell-biceps-curl-n-still\" data-key=\"still\" data-cue=\"Keep the torso and knees still, so only the forearms travel.\" class=\"plate-callout two\" style=\"left:26.82%;top:30.17%\" aria-pressed=\"false\">Still<br>body</button><span class=\"plate-arc-label\" style=\"left:64.8%;top:45.81%\"><b>Elbow</b><span>full range</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-biceps-curl-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-biceps-curl-m-st-fore.r\" d=\"^0\"/><path id=\"dumbbell-biceps-curl-m-st-fist.r\" d=\"^1\"/><path id=\"dumbbell-biceps-curl-m-g0-fore.r\" d=\"^2\"/><path id=\"dumbbell-biceps-curl-m-g0-fist.r\" d=\"^3\"/><path id=\"dumbbell-biceps-curl-m-g0-eq1.dumbbell.0-0\" d=\"^4\"/><path id=\"dumbbell-biceps-curl-m-g1-fore.r\" d=\"^5\"/><path id=\"dumbbell-biceps-curl-m-g1-fist.r\" d=\"^6\"/><path id=\"dumbbell-biceps-curl-m-g1-eq1.dumbbell.0-0\" d=\"^7\"/><path id=\"dumbbell-biceps-curl-m-g2-fore.r\" d=\"^8\"/><path id=\"dumbbell-biceps-curl-m-g2-fist.r\" d=\"^9\"/><path id=\"dumbbell-biceps-curl-m-g2-eq1.dumbbell.0-0\" d=\"^10\"/><path id=\"dumbbell-biceps-curl-m-e-thigh.l\" d=\"^11\"/><path id=\"dumbbell-biceps-curl-m-e-kneecap.l\" d=\"^12\"/><path id=\"dumbbell-biceps-curl-m-e-shank.l\" d=\"^13\"/><path id=\"dumbbell-biceps-curl-m-e-foot.l\" d=\"^14\"/><path id=\"dumbbell-biceps-curl-m-e-shcap.l\" d=\"^15\"/><path id=\"dumbbell-biceps-curl-m-e-upper.l\" d=\"^16\"/><path id=\"dumbbell-biceps-curl-m-e-elbowcap.l\" d=\"^17\"/><path id=\"dumbbell-biceps-curl-m-e-fore.l\" d=\"^18\"/><path id=\"dumbbell-biceps-curl-m-e-fist.l\" d=\"^19\"/><path id=\"dumbbell-biceps-curl-m-e-head\" d=\"^20\"/><path id=\"dumbbell-biceps-curl-m-e-torso\" d=\"^21\"/><path id=\"dumbbell-biceps-curl-m-e-thigh.r\" d=\"^11\"/><path id=\"dumbbell-biceps-curl-m-e-kneecap.r\" d=\"^12\"/><path id=\"dumbbell-biceps-curl-m-e-shank.r\" d=\"^13\"/><path id=\"dumbbell-biceps-curl-m-e-foot.r\" d=\"^14\"/><path id=\"dumbbell-biceps-curl-m-e-shcap.r\" d=\"^15\"/><path id=\"dumbbell-biceps-curl-m-e-upper.r\" d=\"^16\"/><path id=\"dumbbell-biceps-curl-m-e-elbowcap.r\" d=\"^17\"/><path id=\"dumbbell-biceps-curl-m-e-fore.r\" d=\"^18\"/><path id=\"dumbbell-biceps-curl-m-e-fist.r\" d=\"^19\"/><path id=\"dumbbell-biceps-curl-m-m-shcap.r\" d=\"^15\"/><path id=\"dumbbell-biceps-curl-m-m-upper.r\" d=\"~#F12(NvJUrIWuK_q*5V665Hz1ww1*1K6x1B3znEvB6IkTbTbIkz6GvBnx3x1O6)1ww1Jz176R6*5EcWaJ8Yr!f!fYrJ810010100121010000001012200000002000000000001010100000000000200000100000010000010\"/><path id=\"dumbbell-biceps-curl-m-m-elbowcap.r\" d=\"~~ywD1!Ax1Dz10\"/><path id=\"dumbbell-biceps-curl-m-m-fore.r\" d=\"~#F12_DF1JNx1T!E1TFy1I4J97*1(7.H1.5A8B2_1*8Yv)9Ua-2_aF3yex8yw1uU2w1waSezG1H1R1x1JaY9Y2FfBgP4TgB5Vl22001002202002020000000000021000000110000200100002101020001010000000200001110100\"/><path id=\"dumbbell-biceps-curl-m-m-fist.r\" d=\"~~HUF1NWnww10\"/><path id=\"dumbbell-biceps-curl-m-m-eq0\" d=\"~MYHI1NWnLErAO1LzrzO1LDrzO1LJW10LDrAO1Z\"/><path id=\"dumbbell-biceps-curl-m-m-eq1\" d=\"~~!BG1NWnNe0\"/><path id=\"dumbbell-biceps-curl-m-mf-head\" d=\"^20\"/><path id=\"dumbbell-biceps-curl-m-mf-torso\" d=\"^21\"/><path id=\"dumbbell-biceps-curl-m-mf-thigh.l\" d=\"^11\"/><path id=\"dumbbell-biceps-curl-m-mf-kneecap.l\" d=\"^12\"/><path id=\"dumbbell-biceps-curl-m-mf-shank.l\" d=\"^13\"/><path id=\"dumbbell-biceps-curl-m-mf-foot.l\" d=\"^14\"/><path id=\"dumbbell-biceps-curl-m-mf-shcap.l\" d=\"^15\"/><path id=\"dumbbell-biceps-curl-m-mf-upper.l\" d=\"^37\"/><path id=\"dumbbell-biceps-curl-m-mf-elbowcap.l\" d=\"^38\"/><path id=\"dumbbell-biceps-curl-m-mf-fore.l\" d=\"^39\"/><path id=\"dumbbell-biceps-curl-m-mf-fist.l\" d=\"^40\"/><path id=\"dumbbell-biceps-curl-m-mf-thigh.r\" d=\"^11\"/><path id=\"dumbbell-biceps-curl-m-mf-kneecap.r\" d=\"^12\"/><path id=\"dumbbell-biceps-curl-m-mf-shank.r\" d=\"^13\"/><path id=\"dumbbell-biceps-curl-m-mf-foot.r\" d=\"^14\"/><path id=\"dumbbell-biceps-curl-m-mo-0\" d=\"^20\"/><path id=\"dumbbell-biceps-curl-m-mo-1\" d=\"^21\"/><path id=\"dumbbell-biceps-curl-m-mo-2\" d=\"^11\"/><path id=\"dumbbell-biceps-curl-m-mo-3\" d=\"^12\"/><path id=\"dumbbell-biceps-curl-m-mo-4\" d=\"^13\"/><path id=\"dumbbell-biceps-curl-m-mo-5\" d=\"^14\"/><path id=\"dumbbell-biceps-curl-m-mo-6\" d=\"^15\"/><path id=\"dumbbell-biceps-curl-m-mo-7\" d=\"^16\"/><path id=\"dumbbell-biceps-curl-m-mo-8\" d=\"^17\"/><path id=\"dumbbell-biceps-curl-m-mo-9\" d=\"^18\"/><path id=\"dumbbell-biceps-curl-m-mo-10\" d=\"^19\"/><path id=\"dumbbell-biceps-curl-m-mo-11\" d=\"^11\"/><path id=\"dumbbell-biceps-curl-m-mo-12\" d=\"^12\"/><path id=\"dumbbell-biceps-curl-m-mo-13\" d=\"^13\"/><path id=\"dumbbell-biceps-curl-m-mo-14\" d=\"^14\"/><path id=\"dumbbell-biceps-curl-m-mo-15\" d=\"^15\"/><path id=\"dumbbell-biceps-curl-m-mo-16\" d=\"^16\"/><path id=\"dumbbell-biceps-curl-m-mo-17\" d=\"^17\"/><path id=\"dumbbell-biceps-curl-m-mo-18\" d=\"^18\"/><path id=\"dumbbell-biceps-curl-m-mo-19\" d=\"^19\"/><path id=\"dumbbell-biceps-curl-m-mo-20\" d=\"^24\"/><path id=\"dumbbell-biceps-curl-m-mo-21\" d=\"^25\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-biceps-curl-m-dots)\"/>\n  <path class=\"floorline\" d=\"^22\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-m-st-fore.r\"/><use href=\"#dumbbell-biceps-curl-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-m-st-fore.r\"/><use href=\"#dumbbell-biceps-curl-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-m-g0-fore.r\"/><use href=\"#dumbbell-biceps-curl-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-m-g0-fore.r\"/><use href=\"#dumbbell-biceps-curl-m-g0-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-m-g0-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-m-g0-eq1.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-m-g1-fore.r\"/><use href=\"#dumbbell-biceps-curl-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-m-g1-fore.r\"/><use href=\"#dumbbell-biceps-curl-m-g1-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-m-g1-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-m-g1-eq1.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-m-g2-fore.r\"/><use href=\"#dumbbell-biceps-curl-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-m-g2-fore.r\"/><use href=\"#dumbbell-biceps-curl-m-g2-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-m-g2-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-m-g2-eq1.dumbbell.0-0\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-m-e-thigh.l\"/><use href=\"#dumbbell-biceps-curl-m-e-kneecap.l\"/><use href=\"#dumbbell-biceps-curl-m-e-shank.l\"/><use href=\"#dumbbell-biceps-curl-m-e-foot.l\"/><use href=\"#dumbbell-biceps-curl-m-e-shcap.l\"/><use href=\"#dumbbell-biceps-curl-m-e-upper.l\"/><use href=\"#dumbbell-biceps-curl-m-e-elbowcap.l\"/><use href=\"#dumbbell-biceps-curl-m-e-fore.l\"/><use href=\"#dumbbell-biceps-curl-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-m-e-thigh.l\"/><use href=\"#dumbbell-biceps-curl-m-e-kneecap.l\"/><use href=\"#dumbbell-biceps-curl-m-e-shank.l\"/><use href=\"#dumbbell-biceps-curl-m-e-foot.l\"/><use href=\"#dumbbell-biceps-curl-m-e-shcap.l\"/><use href=\"#dumbbell-biceps-curl-m-e-upper.l\"/><use href=\"#dumbbell-biceps-curl-m-e-elbowcap.l\"/><use href=\"#dumbbell-biceps-curl-m-e-fore.l\"/><use href=\"#dumbbell-biceps-curl-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-m-e-head\"/><use href=\"#dumbbell-biceps-curl-m-e-torso\"/><use href=\"#dumbbell-biceps-curl-m-e-thigh.r\"/><use href=\"#dumbbell-biceps-curl-m-e-kneecap.r\"/><use href=\"#dumbbell-biceps-curl-m-e-shank.r\"/><use href=\"#dumbbell-biceps-curl-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-m-e-head\"/><use href=\"#dumbbell-biceps-curl-m-e-torso\"/><use href=\"#dumbbell-biceps-curl-m-e-thigh.r\"/><use href=\"#dumbbell-biceps-curl-m-e-kneecap.r\"/><use href=\"#dumbbell-biceps-curl-m-e-shank.r\"/><use href=\"#dumbbell-biceps-curl-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-m-e-shcap.r\"/><use href=\"#dumbbell-biceps-curl-m-e-upper.r\"/><use href=\"#dumbbell-biceps-curl-m-e-elbowcap.r\"/><use href=\"#dumbbell-biceps-curl-m-e-fore.r\"/><use href=\"#dumbbell-biceps-curl-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-biceps-curl-m-e-shcap.r\"/><use href=\"#dumbbell-biceps-curl-m-e-upper.r\"/><use href=\"#dumbbell-biceps-curl-m-e-elbowcap.r\"/><use href=\"#dumbbell-biceps-curl-m-e-fore.r\"/><use href=\"#dumbbell-biceps-curl-m-e-fist.r\"/></g></g><path class=\"disc\" d=\"^24\"/><path class=\"disc-core\" d=\"^25\"/><path class=\"eq-cable m-line\" d=\"^26\"/><path class=\"eq-cable m-line\" d=\"^27\"/><circle class=\"joint\" cx=\"166.54\" cy=\"136.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"166.54\" cy=\"183.69\" r=\"2.25\"/><circle class=\"joint\" cx=\"168\" cy=\"203.73\" r=\"2.25\"/><circle class=\"joint\" cx=\"171.29\" cy=\"266.24\" r=\"2.25\"/></g><mask id=\"dumbbell-biceps-curl-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#dumbbell-biceps-curl-m-mf-head\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-mf-torso\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-mf-shank.l\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-mf-foot.l\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-mf-upper.l\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-mf-fore.l\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-mf-fist.l\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-mf-shank.r\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-mf-foot.r\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-m-shcap.r\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-m-upper.r\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-m-fore.r\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-m-fist.r\" fill=\"#000\"/><use href=\"#dumbbell-biceps-curl-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-biceps-curl-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#dumbbell-biceps-curl-m-mmask)\"><g class=\"u-stroke\"><use href=\"#dumbbell-biceps-curl-m-m-shcap.r\"/><use href=\"#dumbbell-biceps-curl-m-m-upper.r\"/><use href=\"#dumbbell-biceps-curl-m-m-elbowcap.r\"/><use href=\"#dumbbell-biceps-curl-m-m-fore.r\"/><use href=\"#dumbbell-biceps-curl-m-m-fist.r\"/><use href=\"#dumbbell-biceps-curl-m-m-eq0\"/><use href=\"#dumbbell-biceps-curl-m-m-eq1\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~M(NvJUrLS2!3Lc7L85L47L01L15L31L70L75L53L33L01L31L01L22L20L73L99L35L44L68LicLkmLuoLw1y1LuqLomLecL88L21L57LddL7bL05L13L11L01L01L10L01L64L6aL20L11L59LbbLbjLjpLhlLhjLdhLbdL5bL1bL37L47L07L0dL1bL37L39L53L55L73L53L17L35L75L53Lb1L93Lb1Lb2L34L91Lb3Lb7Lf9LfdLhfLplLnfLhfLd9L95L11L02L88L62L02L11L10L10L11L50L11Ld9LdbL75L12L68LggLikLuw1Luw1LsuLikLgiL68L22L15Lb7L57L44L11L22L31L13L31L55L15L19L35L10L50L36L76L7aLb6Lb0L94L14L3cL4cL8gLakL6kL2gL4iL4aL8eL66L88Lc4L66L4cL68La8La6Le4Le2Lk4Li6LkcLg6Lc2La0L85L27L0b\"/><path class=\"m-line\" d=\"~MPDF1!Ax1LV2PdL*4z2L-3X3L)1*4L1I5Ly2*4L_3X3L(4z2LJ50L(4A2L_3Y3Ly2(4L1J5L)1(4L-3Y3L*4A2\"/><path class=\"m-line\" d=\"~M_DF1JNx1L_1B3L77L50L31L32L14L16L0aL18L38L18L14L10L20L10L27L08L3cL12L21L2bL2hL6rL6x1LaE1L8B1L4rL4hL09L02L7aL3kL7iL34L36L14L12L10L02L01L05L29L01L12L1aL3eL5iL5qL5sL3mL5iL1eL5cL56L32L31L72L76L34L56L34L06L06L16L24L54L16L04L08L26L08L68L42L64L24L28L0cL5eL3iL7mL7sL7oL3iL3gL18L04L23L45L07L20L20L12L24L02L08L26L3kL3iL0eL20L27L8fL8rLcz1LcE1Lcx1LanL6jL47L25L16L3aL06L03L21L11L24L04L16L0aL38L3aL14L06L22L62L42La1L64L26L46L61L61L87L87L8fLcbLc7L87L87L47L27L29L15L49L23L69L27L17L1bL1bL59L5hL2fL3dL19L15L70L11L96\"/><path class=\"m-line\" d=\"~MHUH1NWnL3A3Lb0L71L93L73L91L77L75L55L77L37L39L37L39L17L0bL27L3bL47L49L47L49L47L87L85L65L87L81Lc3L63Lc1L80Lc2L83Lc4L64Lc4L84L84L68L88L86L48L48L4cL46L4cL38L2cL08L1cL36L3cL38L38L76L58L78L74L94L74L94L74Lb3\"/><path class=\"m-line\" d=\"~M!Pw1NUpL0HSc\"/><path class=\"m-arrow\" d=\"~MUzx1y!z1LD_4VH2MIeYrLJeXrLxK1Yl\"/><path class=\"leader m\" d=\"M200.21 176.74L223 186H233\"/><path class=\"leader m\" d=\"M174.54 134.07L199 90H209\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dumbbell-biceps-curl-m-elbows\" data-key=\"elbows\" data-cue=\"Your elbows drift forward off your sides.\" class=\"plate-callout two m\" style=\"left:63.69%;top:45.81%\" aria-pressed=\"true\">Elbows<br>forward</button><button type=\"button\" id=\"dumbbell-biceps-curl-m-shoulder\" data-key=\"shoulder\" data-cue=\"The front of your shoulder takes over the lift.\" class=\"plate-callout two m\" style=\"left:56.98%;top:18.99%\" aria-pressed=\"false\">Shoulder<br>takes over</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "Keep the upper arms by your sides, never back, at most slightly forward on top." }, { key: "wrists", cue: "Keep the hand in line with the forearm, not bent up or down." }, { key: "still", cue: "Keep the torso and knees still, so only the forearms travel." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "Your elbows drift forward off your sides." }, { key: "shoulder", cue: "The front of your shoulder takes over the lift." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Elbows forward</b><span>Your elbows drift forward off your sides.</span></li><li><b>Shoulder takes over</b><span>The front of your shoulder takes over the lift.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: curl 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Curl</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Dumbbell biceps curl, side view. Standing tall with a dumbbell in each hand, palms forward. The elbows stay at the sides while the forearms curl the dumbbells from the thighs up to the front of the shoulders.",
      mistakeAlt: "Dumbbell Biceps Curl: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "curl",
    "orientation": "supinated",
    "handle": "dumbbell",
    "loadAxis": "across",
    "width": {
      "text": "Let the dumbbells hang slightly out from your sides if that keeps your wrist straight.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-curl"
        ],
        "note": "c7"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-curl",
          "sl-dbcurl"
        ],
        "note": "c1"
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "ext": [
        -10,
        10
      ],
      "limitText": "Keep the hand in line with the forearm, not bent up or down.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "CONVENTION"
        ],
        "sources": [
          "ace-seated-curl",
          "sl-dbcurl",
          "hand-key-curl"
        ],
        "note": "c6. The ext range is the curl key's wristRange (ga:curl-mid), a convention, not a card number."
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
      },
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
      }
    ],
    "gripLine": "Palms forward, handle across the middle of your palm, thumb wrapped. Keep your wrist straight.",
    "cue": "Wrist straight, thumbs wrapped."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "load",
      "text": "Pick a weight you can curl without swinging.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dbcurl",
          "marcolin-2018"
        ],
        "note": "c5"
      }
    },
    {
      "kind": "position",
      "text": "Stand with feet shoulder-width, knees slightly bent.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dbcurl"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "grip",
      "text": "Palms forward, thumbs wrapped, handle across the middle of the palm.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS",
          "CONVENTION"
        ],
        "sources": [
          "ace-seated-curl",
          "sl-dbcurl",
          "hand-key-curl"
        ],
        "note": "c1. The contact is the curl key's ga:curl-mid (the card has no grip.handContact)."
      }
    },
    {
      "kind": "brace",
      "text": "Chest up, shoulders down and slightly back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dbcurl",
          "ace-seated-curl"
        ],
        "note": "c8"
      }
    }
  ],
  posture: [
    {
      "key": "elbows",
      "label": "Elbows at sides",
      "detail": "Elbows stay close to the body.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "zoom": "curl-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dbcurl",
          "ace-seated-curl"
        ],
        "note": "c3"
      }
    },
    {
      "key": "upper-arm",
      "label": "Never back",
      "detail": "Upper arms never travel back. Slightly forward at the top is fine.",
      "anchor": {
        "pose": "end",
        "at": "shoulder.r"
      },
      "zoom": "curl-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dbcurl"
        ],
        "note": "c13"
      }
    },
    {
      "key": "still",
      "label": "Still body",
      "detail": "Body stays still. Only the arms move.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dbcurl"
        ],
        "note": "c14"
      }
    },
    {
      "key": "wrists",
      "label": "Straight wrists",
      "detail": "Wrists stay straight.",
      "anchor": {
        "pose": "end",
        "at": "wrist.r"
      },
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-curl",
          "sl-dbcurl"
        ],
        "note": "c6"
      }
    },
    {
      "key": "shrug",
      "label": "No shrugging",
      "detail": "No shrugging during the lift.",
      "anchor": {
        "pose": "end",
        "at": "shoulderTop.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dbcurl",
          "ace-seated-curl"
        ],
        "note": "c8"
      }
    },
    {
      "key": "range",
      "label": "Full range",
      "detail": "Lower until the arms are straight again.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "oliveira-2009"
        ],
        "note": "c12"
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
    "setupLine": "Stand tall, feet shoulder-width, knees slightly bent. Palms forward, elbows close to your sides.",
    "mistakeLine": "Never let your elbows travel back to cheat the weight up. Go lighter instead of swinging.",
    "cueLine": "Elbows at your sides."
  },
  mistakes: [
    {
      "key": "wrists",
      "title": "Wrists bending up or down",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-curl",
          "sl-dbcurl"
        ],
        "note": "c6"
      },
      "fix": "Keep the hand in line with the forearm."
    },
    {
      "key": "swing",
      "title": "Swinging the body",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dbcurl",
          "marcolin-2018"
        ],
        "note": "c5"
      },
      "fix": "Use a lighter dumbbell and lift with control."
    },
    {
      "key": "elbows",
      "title": "Elbows drifting back or forward",
      "zoom": "curl-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dbcurl"
        ],
        "note": "c4"
      },
      "fix": "Keep the elbows at your sides. Never let them travel back."
    }
  ],
  risks: [
    {
      "key": "wrist",
      "text": "Bent wrists under load can cause wrist discomfort.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-curl",
          "sl-dbcurl"
        ],
        "note": "c6"
      }
    },
    {
      "key": "dropped",
      "text": "Across weight training, dropped weights are the most common way people get badly hurt.",
      "claim": {
        "tags": [
          "WEAK"
        ],
        "sources": [
          "kerr-2010"
        ],
        "note": "c16"
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
    "sl-dbcurl",
    "ace-seated-curl",
    "marcolin-2018",
    "oliveira-2009",
    "acsm-2009",
    "kerr-2010",
    "hand-key-curl",
    "nhs-wrist-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/dumbbell_biceps_curl.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=e1750afcf9083419ef350b8f6f6c5bcff7547a1af741bff02058ee29b662e951
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_reverse_curl",
  name: "Reverse Curl",
  hashes: { inputsSha256: "e1750afcf9083419ef350b8f6f6c5bcff7547a1af741bff02058ee29b662e951", golden: "8861b815418284537ee145df071917e8ffe296688ead80b2e1654b2872ef5137" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"reverse-curl-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"reverse-curl-n-st-upper.r\" d=\"~#F12YxvU.q..uKYpE1-8a0NbDN1(1I6sB3V1*D1H6GkB3zgKdOg)cVA1*1V2G4B5_6DO1b2x2X8BgA2R8WrH4ymHiNm10000202000000000200012000010010100000000021000000000000000100001202000000000010\"/><path id=\"reverse-curl-n-st-elbowcap.r\" d=\"~~NDx1SWz1Dz10\"/><path id=\"reverse-curl-n-st-fore.r\" d=\"~#F12PBx1S*z1xzx1Kxz19KaA1U1WbyH1W1.9A1T2-5Kw1H4.dB2)aB9EbV6Gw1x2)1E5O8!4JI1b(1V3X9*9Y1T6FlH3(gweAh22000000011012100000000022000000101010002001000022002200001010000000020000100000\"/><path id=\"reverse-curl-n-st-fist.r\" d=\"~~JBz1(GK1ww10\"/><path id=\"reverse-curl-n-g0-upper.r\" d=\"~#F12JxvH-qB*u-Vpp*880F9YN1F2I6y1z34*D1F7*jI2IgTc)gBbIB1.1V2)3K5P4NO192X1X8BgF1.9FrD3FmFhFn00010100100100000000000010100010010220200100000000000000001200101100001000001000\"/><path id=\"reverse-curl-n-g0-elbowcap.r\" d=\"~~JYw1(Yz1Dz10\"/><path id=\"reverse-curl-n-g0-fore.r\" d=\"~#F12Ywx1DSA1VOw1X.z1.5T8!1sHw1Dt-3B9d-2EmIo-3)dV7z8VdT4)mXnX2j)8G4Frwy1m!1E8G6O7_6Y5PlYbScAly711120000000000000000010000101002000001000000000000001110010000000012001000000000\"/><path id=\"reverse-curl-n-g0-fist.r\" d=\"~~ySE1w*H1ww10\"/><path id=\"reverse-curl-n-g1-upper.r\" d=\"~#F12yxvyXqR(uKTpd*8c0!6DO1S2G6D1)2y2*D1D8TjR1Ig-bThK9-B1V1.2X3R5D2UO190G1.8BgiEbYqD2HmygAo00000000021000110000020121010000021210000101000010101010100100000210000001000100\"/><path id=\"reverse-curl-n-g1-elbowcap.r\" d=\"~~DHw1W_z1Dz10\"/><path id=\"reverse-curl-n-g1-fore.r\" d=\"~#F12DAx1H(A1-Gw1KUA1O9B4w27(H1P7B8-5.1z2XvV8Xa-9-a.2xeP3zw1.7T2w1*9y1DG1HeU1D1IatX2Y9JgAfWgH4SlE500000012000000011100020020000001000000010000200100000000000101100000220010121010\"/><path id=\"reverse-curl-n-g1-fist.r\" d=\"~~P!G1yGD1ww10\"/><path id=\"reverse-curl-n-g2-upper.r\" d=\"~#F12(wvYUqBwvxRp2.8a1U4NO1!2x6J1x3_3XD1D9zjpOg.aEiT7zD1T1*2K3-51WO1b0p.8Eg7OcAqy1Nmwf!o00020000001000100020001010002201000021000010010101101011000000001001001000002001\"/><path id=\"reverse-curl-n-g2-elbowcap.r\" d=\"~~(.vW.z1Dz10\"/><path id=\"reverse-curl-n-g2-fore.r\" d=\"~#F12JHx1Y(A1-Nw1KAB1EaP1S1G1FF1Rg*9fV2rTvW9BeT2XaJ3xaNaGvPaV1F2.7D6NH1.9y24E9Y4!2Y9!ly4NgG5Nf*f00200100000100000000200200020000111111000000000010000000000000120000200100001000\"/><path id=\"reverse-curl-n-g2-fist.r\" d=\"~~HGG1F!w1ww10\"/><path id=\"reverse-curl-n-e-thigh.l\" d=\"~#F12HKuH*E1zEuTND1I2TbE12Y6J(1P5B8U2)39zV1AbOnx1EkOdGmG5XU1)2-3G6K77W(1F11F1.b-vBaXjwH1(1_z1woWE100200000020210100002000100000001000000000000100200100000002100000020000021000200\"/><path id=\"reverse-curl-n-e-kneecap.l\" d=\"~~Yxw1wwU1_J10\"/><path id=\"reverse-curl-n-e-shank.l\" d=\"~#F12Fww1U*T1ODw1XNS1N2VbH12P1y)1J6R7w3X37*y2w8Bdk)bT6)dF7Oy2O2x4R5B8B8P(1B10E1*bId(aOewoB1UlwcNp01000000000012000020000000001000110110002001010011000020020101002000000000000211\"/><path id=\"reverse-curl-n-e-foot.l\" d=\"~#o2D*vDB)1XNw1EB(1YcF3Uhx8Sp*nU-2B3-J2-4ID1*7)n0TG1Y4BbXc_sBbKmPp021200100010100000000020020000100110000111101100\"/><path id=\"reverse-curl-n-e-shcap.l\" d=\"~~!wvNSqwP10\"/><path id=\"reverse-curl-n-e-upper.l\" d=\"~#F12!wvNSq-xvXNpe.8a0J2SO1D3*5P1*2W5RD1yaVi0OgxaViX5RD1K1*2B3*5G2SO1b0d.8Egx1TdPp1PmYdPp10120000000021002020000111000000100000010100000000010010000002001000001010000000\"/><path id=\"reverse-curl-n-e-elbowcap.l\" d=\"~~WKvy!z1Dz10\"/><path id=\"reverse-curl-n-e-fore.l\" d=\"~#F12yKx1WTA1XYw1EEB1*7_6k*1HpRz1-8(4V2mRlypKdH5E7U8*2Fe.kPp7!2G3J9Su)u_1tE5(8U7W6UkE8AbEdP4Vl00020000002000001000200000000000000200000000001110100000010020001000002000120010\"/><path id=\"reverse-curl-n-e-fist.l\" d=\"~~A_B1DJsww10\"/><path id=\"reverse-curl-n-e-head\" d=\"~#w12w_w1HGg-DvX)fBjFjBjU9BbE3E3_4X4)7x8BbRhKm_4XcT1T9Bj0NmEbHmG6!kA3DjygT1Dj0000020000011001010000101001000000000100000100100200210000000000\"/><path id=\"reverse-curl-n-e-torso\" d=\"~#_12wHvHxlTTv*SjR9-1B3K5S9_eU9yaYcwgN60I6)nKm)7Xc_4(f-4_kK6Nm*fShTh_4T9)7*fBrEz1EbBrG60V90!cwgA3w8Xc)7)fYaK6wiN6Y3_cO8A3w8zT2ww101002000000000010100000021002101102000100100010000000100000000011000000120111000000010000001001010000000001000000100\"/><path id=\"reverse-curl-n-e-thigh.r\" d=\"^16\"/><path id=\"reverse-curl-n-e-kneecap.r\" d=\"^17\"/><path id=\"reverse-curl-n-e-shank.r\" d=\"^18\"/><path id=\"reverse-curl-n-e-foot.r\" d=\"^19\"/><path id=\"reverse-curl-n-e-shcap.r\" d=\"^20\"/><path id=\"reverse-curl-n-e-upper.r\" d=\"^21\"/><path id=\"reverse-curl-n-e-elbowcap.r\" d=\"^22\"/><path id=\"reverse-curl-n-e-fore.r\" d=\"^23\"/><path id=\"reverse-curl-n-e-fist.r\" d=\"^24\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#reverse-curl-n-dots)\"/>\n  <path class=\"floorline\" d=\"M94.86 339.5H258.7\"/><path class=\"arc measure\" d=\"M166.54 183.69L170.35 203.32A20 20 0 0 0 179.39 168.37Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-curl-n-st-upper.r\"/><use href=\"#reverse-curl-n-st-elbowcap.r\"/><use href=\"#reverse-curl-n-st-fore.r\"/><use href=\"#reverse-curl-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-curl-n-st-upper.r\"/><use href=\"#reverse-curl-n-st-elbowcap.r\"/><use href=\"#reverse-curl-n-st-fore.r\"/><use href=\"#reverse-curl-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-curl-n-g0-upper.r\"/><use href=\"#reverse-curl-n-g0-elbowcap.r\"/><use href=\"#reverse-curl-n-g0-fore.r\"/><use href=\"#reverse-curl-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-curl-n-g0-upper.r\"/><use href=\"#reverse-curl-n-g0-elbowcap.r\"/><use href=\"#reverse-curl-n-g0-fore.r\"/><use href=\"#reverse-curl-n-g0-fist.r\"/></g></g><path class=\"eq-line\" d=\"~~(FB1w*H1AG32\"/><path class=\"eq-thin\" d=\"~~!.B1w*H1DW22\"/><path class=\"eq-solid\" d=\"~~F.E1w*H1!m1\"/><path class=\"eq-pin\" d=\"~~_IF1w*H1F60\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-curl-n-g1-upper.r\"/><use href=\"#reverse-curl-n-g1-elbowcap.r\"/><use href=\"#reverse-curl-n-g1-fore.r\"/><use href=\"#reverse-curl-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-curl-n-g1-upper.r\"/><use href=\"#reverse-curl-n-g1-elbowcap.r\"/><use href=\"#reverse-curl-n-g1-fore.r\"/><use href=\"#reverse-curl-n-g1-fist.r\"/></g></g><path class=\"eq-line\" d=\"~~JTE1yGD1AG32\"/><path class=\"eq-thin\" d=\"~~FDF1yGD1DW22\"/><path class=\"eq-solid\" d=\"~~UBH1yGD1!m1\"/><path class=\"eq-pin\" d=\"~~FWH1yGD1F60\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-curl-n-g2-upper.r\"/><use href=\"#reverse-curl-n-g2-elbowcap.r\"/><use href=\"#reverse-curl-n-g2-fore.r\"/><use href=\"#reverse-curl-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-curl-n-g2-upper.r\"/><use href=\"#reverse-curl-n-g2-elbowcap.r\"/><use href=\"#reverse-curl-n-g2-fore.r\"/><use href=\"#reverse-curl-n-g2-fist.r\"/></g></g><path class=\"eq-line\" d=\"~~DwE1F!w1AG32\"/><path class=\"eq-thin\" d=\"~~ATE1F!w1DW22\"/><path class=\"eq-solid\" d=\"~~NSG1F!w1!m1\"/><path class=\"eq-pin\" d=\"~~yzH1F!w1F60\"/></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#reverse-curl-n-e-thigh.l\"/><use href=\"#reverse-curl-n-e-kneecap.l\"/><use href=\"#reverse-curl-n-e-shank.l\"/><use href=\"#reverse-curl-n-e-foot.l\"/><use href=\"#reverse-curl-n-e-shcap.l\"/><use href=\"#reverse-curl-n-e-upper.l\"/><use href=\"#reverse-curl-n-e-elbowcap.l\"/><use href=\"#reverse-curl-n-e-fore.l\"/><use href=\"#reverse-curl-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#reverse-curl-n-e-thigh.l\"/><use href=\"#reverse-curl-n-e-kneecap.l\"/><use href=\"#reverse-curl-n-e-shank.l\"/><use href=\"#reverse-curl-n-e-foot.l\"/><use href=\"#reverse-curl-n-e-shcap.l\"/><use href=\"#reverse-curl-n-e-upper.l\"/><use href=\"#reverse-curl-n-e-elbowcap.l\"/><use href=\"#reverse-curl-n-e-fore.l\"/><use href=\"#reverse-curl-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-curl-n-e-head\"/><use href=\"#reverse-curl-n-e-torso\"/><use href=\"#reverse-curl-n-e-thigh.r\"/><use href=\"#reverse-curl-n-e-kneecap.r\"/><use href=\"#reverse-curl-n-e-shank.r\"/><use href=\"#reverse-curl-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-curl-n-e-head\"/><use href=\"#reverse-curl-n-e-torso\"/><use href=\"#reverse-curl-n-e-thigh.r\"/><use href=\"#reverse-curl-n-e-kneecap.r\"/><use href=\"#reverse-curl-n-e-shank.r\"/><use href=\"#reverse-curl-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-curl-n-e-shcap.r\"/><use href=\"#reverse-curl-n-e-upper.r\"/><use href=\"#reverse-curl-n-e-elbowcap.r\"/><use href=\"#reverse-curl-n-e-fore.r\"/><use href=\"#reverse-curl-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-curl-n-e-shcap.r\"/><use href=\"#reverse-curl-n-e-upper.r\"/><use href=\"#reverse-curl-n-e-elbowcap.r\"/><use href=\"#reverse-curl-n-e-fore.r\"/><use href=\"#reverse-curl-n-e-fist.r\"/></g></g><path class=\"eq-line\" d=\"~~(Pz1DJsAG32\"/><path class=\"eq-thin\" d=\"~~!zA1DJsDW22\"/><path class=\"eq-solid\" d=\"~~FzD1DJs!m1\"/><path class=\"eq-pin\" d=\"~~!TD1DJsF60\"/><path class=\"eq-cable m-line\" d=\"~M!)z1UUB1Lt-5L6J1L4w1L2sL4kL0aL04L13L0bL05L16L20L02L11L03L35L19L19L27L35L03L31L30L52L76\"/><path class=\"eq-cable m-line\" d=\"~MPBx1S*z1L3W3L62L60L61L23L03L15L17L39L07L07L03L01L00L22L06L17L19L03L04L4aL4iL8qLay1L8H1LcA1L4sL8iL28L21L1bL0jL1hL07L25L03L21L11L41L12L26L4aL00L21\"/><path class=\"eq-cable m-line\" d=\"~MPNE1(GK1LR3DrL*6-1LB6T3Lz5x5LO3B6L*1.6L2E7L_1.6LU3B6Lw5x5LF6T3L(6-1LA71L(6!1LF6U3Lw5y5LU3D6L_1!6L2F7L*1!6LO3D6Lz5y5LB6U3L*6!1\"/><circle class=\"joint\" cx=\"166.54\" cy=\"136.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"166.54\" cy=\"183.69\" r=\"2.25\"/><circle class=\"joint\" cx=\"168\" cy=\"203.73\" r=\"2.25\"/><circle class=\"joint\" cx=\"171.29\" cy=\"266.24\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#F20JRD1PNJ1TBD1GVJ1bhbjbhdhdfdfhfdfjbfdjbh9hbl9j7j7l5l5j3l5l0l1l1n2j0l4l4l2j8l6j6jalahaha000010000000000000002020000001000002100000000200000001000000000000000000002000010002100001000010002000020000000001022000000020000212100021012000\"/><path class=\"arrow\" d=\"~MWBF1FOtLJB1yjLTz2D3Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M170.35 203.32A20 20 0 0 0 179.39 168.37\"/><g class=\"arc-ticks\"><path d=\"~M(zx1D(D1LYaFX1\"/><path d=\"~MARy1NOx1LDA1xI1\"/></g><path class=\"leader\" d=\"~MwWA1N(A1LFBbHW2\"/></g></g><path class=\"leader\" d=\"M198.74 145.31L265 152H275\"/><circle class=\"anchor\" cx=\"198.74\" cy=\"145.31\" r=\"1.5\"/><path class=\"leader\" d=\"M190.56 155.05L195 104H205\"/><circle class=\"anchor\" cx=\"190.56\" cy=\"155.05\" r=\"1.5\"/><path class=\"leader\" d=\"M166.54 183.69L151.77 122H141.77\"/><circle class=\"anchor\" cx=\"166.54\" cy=\"183.69\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"reverse-curl-n-palms\" data-key=\"palms\" data-cue=\"Hold the bar overhand about shoulder-width and keep that grip all the way up.\" class=\"plate-callout two\" style=\"left:75.42%;top:36.31%\" aria-pressed=\"true\">Palms<br>down</button><button type=\"button\" id=\"reverse-curl-n-wrists\" data-key=\"wrists\" data-cue=\"Keep a straight line from the hands to the elbows.\" class=\"plate-callout two\" style=\"left:55.87%;top:22.91%\" aria-pressed=\"false\">Straight<br>wrists</button><button type=\"button\" id=\"reverse-curl-n-elbows\" data-key=\"elbows\" data-cue=\"Keep the upper arms still and the elbows close to the ribs.\" class=\"plate-callout two\" style=\"left:22.35%;top:27.93%\" aria-pressed=\"false\">Elbows<br>at sides</button><span class=\"plate-arc-label\" style=\"left:69.27%;top:54.75%\"><b>Elbow</b><span>full range</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"reverse-curl-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"reverse-curl-m-st-upper.r\" d=\"^0\"/><path id=\"reverse-curl-m-st-elbowcap.r\" d=\"^1\"/><path id=\"reverse-curl-m-st-fore.r\" d=\"^2\"/><path id=\"reverse-curl-m-st-fist.r\" d=\"^3\"/><path id=\"reverse-curl-m-g0-upper.r\" d=\"^4\"/><path id=\"reverse-curl-m-g0-elbowcap.r\" d=\"^5\"/><path id=\"reverse-curl-m-g0-fore.r\" d=\"^6\"/><path id=\"reverse-curl-m-g0-fist.r\" d=\"^7\"/><path id=\"reverse-curl-m-g1-upper.r\" d=\"^8\"/><path id=\"reverse-curl-m-g1-elbowcap.r\" d=\"^9\"/><path id=\"reverse-curl-m-g1-fore.r\" d=\"^10\"/><path id=\"reverse-curl-m-g1-fist.r\" d=\"^11\"/><path id=\"reverse-curl-m-g2-upper.r\" d=\"^12\"/><path id=\"reverse-curl-m-g2-elbowcap.r\" d=\"^13\"/><path id=\"reverse-curl-m-g2-fore.r\" d=\"^14\"/><path id=\"reverse-curl-m-g2-fist.r\" d=\"^15\"/><path id=\"reverse-curl-m-e-thigh.l\" d=\"^16\"/><path id=\"reverse-curl-m-e-kneecap.l\" d=\"^17\"/><path id=\"reverse-curl-m-e-shank.l\" d=\"^18\"/><path id=\"reverse-curl-m-e-foot.l\" d=\"^19\"/><path id=\"reverse-curl-m-e-shcap.l\" d=\"^20\"/><path id=\"reverse-curl-m-e-upper.l\" d=\"^21\"/><path id=\"reverse-curl-m-e-elbowcap.l\" d=\"^22\"/><path id=\"reverse-curl-m-e-fore.l\" d=\"^23\"/><path id=\"reverse-curl-m-e-fist.l\" d=\"^24\"/><path id=\"reverse-curl-m-e-head\" d=\"^25\"/><path id=\"reverse-curl-m-e-torso\" d=\"^26\"/><path id=\"reverse-curl-m-e-thigh.r\" d=\"^16\"/><path id=\"reverse-curl-m-e-kneecap.r\" d=\"^17\"/><path id=\"reverse-curl-m-e-shank.r\" d=\"^18\"/><path id=\"reverse-curl-m-e-foot.r\" d=\"^19\"/><path id=\"reverse-curl-m-e-shcap.r\" d=\"^20\"/><path id=\"reverse-curl-m-e-upper.r\" d=\"^21\"/><path id=\"reverse-curl-m-e-elbowcap.r\" d=\"^22\"/><path id=\"reverse-curl-m-e-fore.r\" d=\"^23\"/><path id=\"reverse-curl-m-e-fist.r\" d=\"^24\"/><path id=\"reverse-curl-m-m-head\" d=\"~#w12N(pYzhXHoKHhIcDoEfyfVbcR1U5)6z6xbE8Vn-fkTdO4V8Ei(5_hRhJj)cYkK3DnH9N4_i0000110101100102000020200000000000000101010101200021000000020000\"/><path id=\"reverse-curl-m-m-torso\" d=\"~#_12Y)pAzmO_p)TkX9D1X4E4YdDbFcU6yhFb!6T2.fTkVrjBbY7Uex8yjRaSiGkSd*kW2Gazb)d*x1-sTgEo-7I4-irDkUmP5W6TeV3.bAfhDjF7P1S9)bP5U6EB2AY100011111000020000200002000001010100002010100000101010100020000101002101012000201000000012121001110002000000000000100\"/><path id=\"reverse-curl-m-m-shcap.r\" d=\"~~NIrS)qwP10\"/><path id=\"reverse-curl-m-m-upper.r\" d=\"~#F12H.rFzsIxrTHrI6I685(A1yuE2G6G1x3XoxuB7)jBc)aVkx5Ow1Olz3tR6R1_x1Sx178*6T5TbHb!9HrUgwfAs!620010000000000200010000000000020020000100000200010010100101000010101210100100100\"/><path id=\"reverse-curl-m-m-elbowcap.r\" d=\"~~NVy1YDx1Dz10\"/><path id=\"reverse-curl-m-m-fore.r\" d=\"~#F12U!A1JNx1.TA1BGy1-3Y99x2S5BI1I5N8x2!1G7Fw1I9ybG2wbw4!dI6Jw1A1U2N1(9Pc.G1A1T1dNa!9F2He)gU3-gB6Gl00101001011010000000011200001010100100200020001010210000022200020010000022000000\"/><path id=\"reverse-curl-m-m-fist.r\" d=\"~~W-A1PUnww10\"/><path id=\"reverse-curl-m-m-eq0\" d=\"~~!yB1PUn!m1\"/><path id=\"reverse-curl-m-m-eq1\" d=\"~~NTB1PUnF60\"/><path id=\"reverse-curl-m-mf-thigh.l\" d=\"^16\"/><path id=\"reverse-curl-m-mf-kneecap.l\" d=\"^17\"/><path id=\"reverse-curl-m-mf-shank.l\" d=\"^18\"/><path id=\"reverse-curl-m-mf-foot.l\" d=\"^19\"/><path id=\"reverse-curl-m-mf-shcap.l\" d=\"^59\"/><path id=\"reverse-curl-m-mf-upper.l\" d=\"^60\"/><path id=\"reverse-curl-m-mf-elbowcap.l\" d=\"^61\"/><path id=\"reverse-curl-m-mf-fore.l\" d=\"^62\"/><path id=\"reverse-curl-m-mf-fist.l\" d=\"^63\"/><path id=\"reverse-curl-m-mf-thigh.r\" d=\"^16\"/><path id=\"reverse-curl-m-mf-kneecap.r\" d=\"^17\"/><path id=\"reverse-curl-m-mf-shank.r\" d=\"^18\"/><path id=\"reverse-curl-m-mf-foot.r\" d=\"^19\"/><path id=\"reverse-curl-m-mo-0\" d=\"^25\"/><path id=\"reverse-curl-m-mo-1\" d=\"^26\"/><path id=\"reverse-curl-m-mo-2\" d=\"^16\"/><path id=\"reverse-curl-m-mo-3\" d=\"^17\"/><path id=\"reverse-curl-m-mo-4\" d=\"^18\"/><path id=\"reverse-curl-m-mo-5\" d=\"^19\"/><path id=\"reverse-curl-m-mo-6\" d=\"^20\"/><path id=\"reverse-curl-m-mo-7\" d=\"^21\"/><path id=\"reverse-curl-m-mo-8\" d=\"^22\"/><path id=\"reverse-curl-m-mo-9\" d=\"^23\"/><path id=\"reverse-curl-m-mo-10\" d=\"^24\"/><path id=\"reverse-curl-m-mo-11\" d=\"^16\"/><path id=\"reverse-curl-m-mo-12\" d=\"^17\"/><path id=\"reverse-curl-m-mo-13\" d=\"^18\"/><path id=\"reverse-curl-m-mo-14\" d=\"^19\"/><path id=\"reverse-curl-m-mo-15\" d=\"^20\"/><path id=\"reverse-curl-m-mo-16\" d=\"^21\"/><path id=\"reverse-curl-m-mo-17\" d=\"^22\"/><path id=\"reverse-curl-m-mo-18\" d=\"^23\"/><path id=\"reverse-curl-m-mo-19\" d=\"^24\"/><path id=\"reverse-curl-m-mo-20\" d=\"^43\"/><path id=\"reverse-curl-m-mo-21\" d=\"^44\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#reverse-curl-m-dots)\"/>\n  <path class=\"floorline\" d=\"^27\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-curl-m-st-upper.r\"/><use href=\"#reverse-curl-m-st-elbowcap.r\"/><use href=\"#reverse-curl-m-st-fore.r\"/><use href=\"#reverse-curl-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-curl-m-st-upper.r\"/><use href=\"#reverse-curl-m-st-elbowcap.r\"/><use href=\"#reverse-curl-m-st-fore.r\"/><use href=\"#reverse-curl-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-curl-m-g0-upper.r\"/><use href=\"#reverse-curl-m-g0-elbowcap.r\"/><use href=\"#reverse-curl-m-g0-fore.r\"/><use href=\"#reverse-curl-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-curl-m-g0-upper.r\"/><use href=\"#reverse-curl-m-g0-elbowcap.r\"/><use href=\"#reverse-curl-m-g0-fore.r\"/><use href=\"#reverse-curl-m-g0-fist.r\"/></g></g><path class=\"eq-line\" d=\"^29\"/><path class=\"eq-thin\" d=\"^30\"/><path class=\"eq-solid\" d=\"^31\"/><path class=\"eq-pin\" d=\"^32\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-curl-m-g1-upper.r\"/><use href=\"#reverse-curl-m-g1-elbowcap.r\"/><use href=\"#reverse-curl-m-g1-fore.r\"/><use href=\"#reverse-curl-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-curl-m-g1-upper.r\"/><use href=\"#reverse-curl-m-g1-elbowcap.r\"/><use href=\"#reverse-curl-m-g1-fore.r\"/><use href=\"#reverse-curl-m-g1-fist.r\"/></g></g><path class=\"eq-line\" d=\"^33\"/><path class=\"eq-thin\" d=\"^34\"/><path class=\"eq-solid\" d=\"^35\"/><path class=\"eq-pin\" d=\"^36\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-curl-m-g2-upper.r\"/><use href=\"#reverse-curl-m-g2-elbowcap.r\"/><use href=\"#reverse-curl-m-g2-fore.r\"/><use href=\"#reverse-curl-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-curl-m-g2-upper.r\"/><use href=\"#reverse-curl-m-g2-elbowcap.r\"/><use href=\"#reverse-curl-m-g2-fore.r\"/><use href=\"#reverse-curl-m-g2-fist.r\"/></g></g><path class=\"eq-line\" d=\"^37\"/><path class=\"eq-thin\" d=\"^38\"/><path class=\"eq-solid\" d=\"^39\"/><path class=\"eq-pin\" d=\"^40\"/></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#reverse-curl-m-e-thigh.l\"/><use href=\"#reverse-curl-m-e-kneecap.l\"/><use href=\"#reverse-curl-m-e-shank.l\"/><use href=\"#reverse-curl-m-e-foot.l\"/><use href=\"#reverse-curl-m-e-shcap.l\"/><use href=\"#reverse-curl-m-e-upper.l\"/><use href=\"#reverse-curl-m-e-elbowcap.l\"/><use href=\"#reverse-curl-m-e-fore.l\"/><use href=\"#reverse-curl-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#reverse-curl-m-e-thigh.l\"/><use href=\"#reverse-curl-m-e-kneecap.l\"/><use href=\"#reverse-curl-m-e-shank.l\"/><use href=\"#reverse-curl-m-e-foot.l\"/><use href=\"#reverse-curl-m-e-shcap.l\"/><use href=\"#reverse-curl-m-e-upper.l\"/><use href=\"#reverse-curl-m-e-elbowcap.l\"/><use href=\"#reverse-curl-m-e-fore.l\"/><use href=\"#reverse-curl-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-curl-m-e-head\"/><use href=\"#reverse-curl-m-e-torso\"/><use href=\"#reverse-curl-m-e-thigh.r\"/><use href=\"#reverse-curl-m-e-kneecap.r\"/><use href=\"#reverse-curl-m-e-shank.r\"/><use href=\"#reverse-curl-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-curl-m-e-head\"/><use href=\"#reverse-curl-m-e-torso\"/><use href=\"#reverse-curl-m-e-thigh.r\"/><use href=\"#reverse-curl-m-e-kneecap.r\"/><use href=\"#reverse-curl-m-e-shank.r\"/><use href=\"#reverse-curl-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#reverse-curl-m-e-shcap.r\"/><use href=\"#reverse-curl-m-e-upper.r\"/><use href=\"#reverse-curl-m-e-elbowcap.r\"/><use href=\"#reverse-curl-m-e-fore.r\"/><use href=\"#reverse-curl-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#reverse-curl-m-e-shcap.r\"/><use href=\"#reverse-curl-m-e-upper.r\"/><use href=\"#reverse-curl-m-e-elbowcap.r\"/><use href=\"#reverse-curl-m-e-fore.r\"/><use href=\"#reverse-curl-m-e-fist.r\"/></g></g><path class=\"eq-line\" d=\"^41\"/><path class=\"eq-thin\" d=\"^42\"/><path class=\"eq-solid\" d=\"^43\"/><path class=\"eq-pin\" d=\"^44\"/><path class=\"eq-cable m-line\" d=\"^45\"/><path class=\"eq-cable m-line\" d=\"^46\"/><path class=\"eq-cable m-line\" d=\"^47\"/><circle class=\"joint\" cx=\"166.54\" cy=\"136.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"166.54\" cy=\"183.69\" r=\"2.25\"/><circle class=\"joint\" cx=\"168\" cy=\"203.73\" r=\"2.25\"/><circle class=\"joint\" cx=\"171.29\" cy=\"266.24\" r=\"2.25\"/></g><mask id=\"reverse-curl-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#reverse-curl-m-m-head\" fill=\"#000\"/><use href=\"#reverse-curl-m-m-torso\" fill=\"#000\"/><use href=\"#reverse-curl-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#reverse-curl-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#reverse-curl-m-mf-shank.l\" fill=\"#000\"/><use href=\"#reverse-curl-m-mf-foot.l\" fill=\"#000\"/><use href=\"#reverse-curl-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#reverse-curl-m-mf-upper.l\" fill=\"#000\"/><use href=\"#reverse-curl-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#reverse-curl-m-mf-fore.l\" fill=\"#000\"/><use href=\"#reverse-curl-m-mf-fist.l\" fill=\"#000\"/><use href=\"#reverse-curl-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#reverse-curl-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#reverse-curl-m-mf-shank.r\" fill=\"#000\"/><use href=\"#reverse-curl-m-mf-foot.r\" fill=\"#000\"/><use href=\"#reverse-curl-m-m-shcap.r\" fill=\"#000\"/><use href=\"#reverse-curl-m-m-upper.r\" fill=\"#000\"/><use href=\"#reverse-curl-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#reverse-curl-m-m-fore.r\" fill=\"#000\"/><use href=\"#reverse-curl-m-m-fist.r\" fill=\"#000\"/><use href=\"#reverse-curl-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#reverse-curl-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#reverse-curl-m-mmask)\"><g class=\"u-stroke\"><use href=\"#reverse-curl-m-m-head\"/><use href=\"#reverse-curl-m-m-torso\"/><use href=\"#reverse-curl-m-m-shcap.r\"/><use href=\"#reverse-curl-m-m-upper.r\"/><use href=\"#reverse-curl-m-m-elbowcap.r\"/><use href=\"#reverse-curl-m-m-fore.r\"/><use href=\"#reverse-curl-m-m-fist.r\"/><use href=\"#reverse-curl-m-m-eq0\"/><use href=\"#reverse-curl-m-m-eq1\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MH.rFzsL_2Y3La9L85L25L25L11L51L71L73L53L13L33L10L00L21L04L35Ld9L11L00Lc8LecLokLuoLy1uLw1qLokLecLa8L21L77LbfL99L13L03L33L21L10L01L01L46L68L40L31L37LbdLfhLjnLjlLjjLbdLbfL9bL1bL17L05L49L3bL1bL39L57L33L75L73L31L39L53L35Lb3L53Ld0Lb1L94L50L92L93Ld7Ld7LjdLhfLphLphLhbLfbL93L10L40L46L84L10L00L10L10L31L31L30Lb7LhbL55L12L88LeeLkmLw1sLw1uLssLkmLgeL8aL20L31L9bL75L42L12L20L11L33L31L53L37L19L13L30L30L54L78L5cLb4Lb2L74L36L1aL4cL8gLakLaiL2iL4gL6cL6aL8aLa4La6L64L6cL68La6Lc6Lc4Lg4Li0Lk4LkcLg6Lc0Lc0L43L4bL19\"/><path class=\"m-line\" d=\"~M_.A1YDx1LV2NdL*4)1L-3-3L)1*4L1I5LA2*4LY3-3L(4)1LJ51L(4y2LY3_3LA2(4L1J5L)1(4L-3_3L*4y2\"/><path class=\"m-line\" d=\"~MU!A1JNx1LS1G3L35L70L31L32L14L18L26L1cL38L16L04L12L10L23L01L04L1cL14L23L09L2jL4pL6z1L4E1L8B1L4tL2fL09L10L3cL5kL5iL36L14L34L12L02L10L20L07L07L03L14L18L1eL5mL3mL5uL1mL3iL1gL5aL38L32L51L72L56L34L58L14L14L08L04L06L34L14L06L08L26L26L6aL42L62L24L28L0cL1eL5kL5mL5qL5qL5iL0gL3aL22L03L45L27L00L20L12L24L22L18L46L3iL1mL0cL20L27L6hL8pL8z1LeI1L8vL8pL4hL69L03L14L1aL08L05L01L00L22L14L06L0aL1aL38L16L04L24L62L41La0L64L26L64L60L41L89L89L8dLabLc9L87L67L49L47L15L0bL23L69L05L47L1bL37L1bL7dL1dL3fL1dL39L15L50L51L58\"/><path class=\"m-line\" d=\"~MW-D1PUnL3y3Lb2L70L95L75L90L75L77L37L95L57L17L3bL37L17L09L2bL19L07L67L6bL07L67L85L87L67L85L80Lc5L85L80La2Lc1La0L82L84Lc4L82L88L66L86L88L68L0aL68L6aL08L1cL28L0cL18L3aL38L1aL58L98L36L76L78L92L74L94L72Lb0\"/><path class=\"m-line\" d=\"~M!Pw1NUpL0HSc\"/><path class=\"m-arrow\" d=\"M156.71 96.32A108 108 0 0 0 107.61 114.19M109.73 109.66L107.61 114.19L112.55 114.96\"/><path class=\"m-arrow\" d=\"~MUzx1y!z1LPO1-F2My2AvLx2zvLGr_G1\"/><path class=\"leader m\" d=\"~MPJqYzuL.T2E1\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"reverse-curl-m-swing\" data-key=\"swing\" data-cue=\"Your body rocks back to swing the bar up.\" class=\"plate-callout two m\" style=\"left:18.44%;top:36.87%\" aria-pressed=\"true\">Body<br>swings</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "palms",
        cues: [{ key: "palms", cue: "Hold the bar overhand about shoulder-width and keep that grip all the way up." }, { key: "wrists", cue: "Keep a straight line from the hands to the elbows." }, { key: "elbows", cue: "Keep the upper arms still and the elbows close to the ribs." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "swing",
        cues: [{ key: "swing", cue: "Your body rocks back to swing the bar up." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Body swings</b><span>Your body rocks back to swing the bar up.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: curl 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Curl</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Reverse curl, side view. Standing with a bar held overhand at the thighs, the lifter keeps the elbows at the sides and curls the bar up to the shoulders, palms facing down.",
      mistakeAlt: "Reverse Curl: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "curl",
    "orientation": "pronated",
    "handle": "ez-bend",
    "loadAxis": "across",
    "width": {
      "text": "In line with your shoulders and elbows.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-revcurl",
          "ace-revcurl"
        ],
        "note": "c1"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "hand-key-ez"
        ],
        "note": "card grip.thumb is empty: the ez key's right-pose thumb, a convention, never shown."
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "ext": [
        -10,
        10
      ],
      "limitText": "Keep the wrists neutral, in line with the forearms.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "CONVENTION"
        ],
        "sources": [
          "tg-revcurl",
          "hand-key-ez"
        ],
        "note": "c6. The ext range is the ez key's wristRange (ga:curl-mid), a convention, not a card number."
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
    "gripLine": "Overhand grip, palms down, hands about shoulder-width.",
    "cue": "Straight line, hands to elbows."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "load",
      "text": "Start light. Add weight as you get stronger.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "tg-revcurl"
        ],
        "note": "c5"
      }
    },
    {
      "kind": "position",
      "text": "Stand with feet hip- to shoulder-width, knees soft.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "tg-revcurl"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "grip",
      "text": "Grip the bar overhand, hands about shoulder-width.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-revcurl",
          "ace-revcurl"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "brace",
      "text": "Stand tall, no arching. Shoulders back and down, chin slightly tucked.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "tg-revcurl"
        ],
        "note": "c8, c2"
      }
    },
    {
      "kind": "finish",
      "text": "Lower the bar slowly, keeping tension at the bottom.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-revcurl",
          "tg-revcurl"
        ],
        "note": "c13"
      }
    }
  ],
  posture: [
    {
      "key": "palms",
      "label": "Palms down",
      "detail": "Overhand grip about shoulder-width, kept all the way up.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-revcurl",
          "ace-revcurl"
        ],
        "note": "c1, c3"
      }
    },
    {
      "key": "elbows",
      "label": "Elbows at sides",
      "detail": "Elbows stay close to the sides.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "tg-revcurl",
          "ace-revcurl",
          "sl-revcurl"
        ],
        "note": "c7, c3"
      }
    },
    {
      "key": "upper-arm",
      "label": "Never back",
      "detail": "Upper arms never travel back.",
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
          "sl-revcurl"
        ],
        "note": "c4"
      }
    },
    {
      "key": "wrists",
      "label": "Straight wrists",
      "detail": "A straight line from hands to elbows.",
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
          "tg-revcurl"
        ],
        "note": "c6"
      }
    },
    {
      "key": "tall",
      "label": "Stand tall",
      "detail": "Stand tall. No arching the back.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "tg-revcurl"
        ],
        "note": "c8"
      }
    },
    {
      "key": "tension",
      "label": "Tension at bottom",
      "detail": "Keep tension at the bottom.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-revcurl",
          "tg-revcurl"
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
      "chip": "Arms",
      "heading": "Upper arms",
      "kind": "posture",
      "feelRow": "joints"
    }
  ],
  chips: [
    "hand",
    "curl-elbow",
    "feel"
  ],
  copy: {
    "setupLine": "Stand tall, knees soft, shoulders back and down. Grip the bar overhand, elbows close to your sides.",
    "mistakeLine": "Never let your upper arms travel back. Go lighter instead of swinging.",
    "cueLine": "Elbows close to your ribs.",
    "variantLine": "The same form works with a straight bar."
  },
  mistakes: [
    {
      "key": "swing",
      "title": "Swinging to move the bar",
      "zoom": "curl-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "tg-revcurl"
        ],
        "note": "c5"
      },
      "fix": "Go lighter and control both the lift and the lowering."
    },
    {
      "key": "wrists",
      "title": "Wrists bending under the bar",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "tg-revcurl"
        ],
        "note": "c6"
      },
      "fix": "Keep the wrists neutral."
    },
    {
      "key": "flare",
      "title": "Elbows flaring outward",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "tg-revcurl"
        ],
        "note": "c7"
      },
      "fix": "Reduce the weight. Keep the elbows close to your ribs."
    }
  ],
  risks: [
    {
      "key": "swing",
      "text": "Swinging a weight above your ability could hurt your joints.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "tg-revcurl"
        ],
        "note": "c5"
      }
    },
    {
      "key": "wrist",
      "text": "Bent wrists add strain to the wrists.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "tg-revcurl"
        ],
        "note": "c6"
      }
    }
  ],
  riskFlags: [
    "wrist",
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
    "sl-revcurl",
    "ace-revcurl",
    "tg-revcurl",
    "caufriez-2018",
    "coratella-2023",
    "acsm-2009",
    "hand-key-ez",
    "nhs-wrist-pain",
    "nhs-elbow-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/reverse_curl.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

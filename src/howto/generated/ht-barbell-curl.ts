// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=e92a00f55576078d71d88dd358946aa58c573582ad977a8ceae0fa0d4825855a
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_barbell_curl",
  name: "Barbell Curl",
  hashes: { inputsSha256: "e92a00f55576078d71d88dd358946aa58c573582ad977a8ceae0fa0d4825855a", golden: "e05e06c74cd5f2487354d75fe14244597cd83f035e882a368ffc4d29510e6ab9" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"barbell-curl-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"barbell-curl-n-st-upper.r\" d=\"~#F12YxvJ_q..uzXpE1.8a1NbHN1(1K6sE3V1-D1H6IkB3BgKdKg)cVA1*1T2G4E5_6AO1b4x2V8Bgy2R8WrH4ymHiJm10000000000200000000002002010010100000000220020000000000020000001000000001010010\"/><path id=\"barbell-curl-n-st-elbowcap.r\" d=\"~~NDx1JVz1Dz10\"/><path id=\"barbell-curl-n-st-fore.r\" d=\"~#F12PBx1J!z1xzx1Ewz19OaA1Y1WbwH1W1.9A1T2-5Kw1H4.dB2)aB9EbV6Gw1x2)1E5O8!4JI1b(1V3X9*9Y1T6FlH3!gweFh20000002001010100000000020000100101011002101000120002200001110000000000000100000\"/><path id=\"barbell-curl-n-st-fist.r\" d=\"~~JBz1WFK1ww10\"/><path id=\"barbell-curl-n-g0-upper.r\" d=\"~#F12JxvAYqB*uTUpp*881F9_N1F2G6y1B34*D1F7*jI2IgTcxhBbEB1.1X2)3K5P4NO192X1X8BgF1.9FrD3DmFhJn00010101100002000200000111100110010020220000000000010000001000101100011101001000\"/><path id=\"barbell-curl-n-g0-elbowcap.r\" d=\"~~JYw1YXz1Dz10\"/><path id=\"barbell-curl-n-g0-fore.r\" d=\"~#F12Ywx1wRA1VOw1R_z1.5T8!1qHw1Ht-3E9d-2EmIo-3)dV7z8VdV4)mVnX2h)8K4Fryy1m(1E8I6O7_6Y5PlYbScAly711100000000002000001010000101002000101000000000000001012000001010012001000000000\"/><path id=\"barbell-curl-n-g0-fist.r\" d=\"~~ySE1_.H1ww10\"/><path id=\"barbell-curl-n-g1-upper.r\" d=\"~#F12yxv_VqR(uzSpd)8c0!6AO1S2B6D1z3y2-D1D8VjR1Ig-bThK9.B1V1X2X3T5D2SO194G1*8BgiEbWqD2Nmygwo00010000001000100200020020010100021210000100020010101010100101000010000200000100\"/><path id=\"barbell-curl-n-g1-elbowcap.r\" d=\"~~DHw1P-z1Dz10\"/><path id=\"barbell-curl-n-g1-fore.r\" d=\"~#F12DAx1A*A1-Gw1ETA1O9B4w27(H1P7B8-5.1z2XvV8Xa.9-aX2xeN3zw1.7T2w1*9y1DG1HeU1A1IarX2_9JgyfWgH4SlE500000012000000011100020020000000020000010000200101000000010002100200200010101011\"/><path id=\"barbell-curl-n-g1-fist.r\" d=\"~~P!G1!ED1ww10\"/><path id=\"barbell-curl-n-g2-upper.r\" d=\"~#F12(wvSTqBwv.Op2.8a1U4NO1!2x6J1x3_3XD1D9BjpIg.aGiT7BD1T1.2K3X51UO1b0p.8Eg9OcFqy1Jmwf!o00000000011100100020001010002200020021000012000200111011000000001000021000002001\"/><path id=\"barbell-curl-n-g2-elbowcap.r\" d=\"~~(.vP_z1Dz10\"/><path id=\"barbell-curl-n-g2-fore.r\" d=\"~#F12JHx1S*A1-Nw1EzB1EaP1S1G1FF1Rg*9fV2rTvW9BeV2XaP3xaJaGvPaV1F2.7D6NH1.9y24E9Y4!2Y9!lw4NgB5Nf)f00200101000101000001200000010102101011010001000011000000000000100000200002001101\"/><path id=\"barbell-curl-n-g2-fist.r\" d=\"~~HGG1y.w1ww10\"/><path id=\"barbell-curl-n-e-thigh.l\" d=\"~#F12HKuA!E1zEuIKD1I2TbE12Y6N(1P5B8U2)39BV1AbTnx1BkOdGmG5.U1)2X3G6R77_(1F11F1.b-vzaVj(G1_1(z1yoUE100200200000010100000020000000000000000000200100000110100002000000020001200000000\"/><path id=\"barbell-curl-n-e-kneecap.l\" d=\"~~Yxw1N)T1_J10\"/><path id=\"barbell-curl-n-e-shank.l\" d=\"~#F12Fww1w*T1ODw1xNS1N2VbH14P1y)1J6R7w3X37xz2w8Bdk)bT6)dF7Ty2O2z4R5z8B8U(1B13E1-bId(aOe(nB1YlwcHp00000000020011000022000000001000110110002000010010000020000000002100000200000011\"/><path id=\"barbell-curl-n-e-foot.l\" d=\"~#o2D*vDB)1XNw1EB(1YcF3Uh)7Sp*nU-2E3-J2-4ID1)7)n0TG1_4BbXc_sEbKmUp001002100210120001010020000000100010020010101001\"/><path id=\"barbell-curl-n-e-shcap.l\" d=\"~~!wvFRqwP10\"/><path id=\"barbell-curl-n-e-upper.l\" d=\"~#F12!wvFRq-xvRKpe.8a1J2WO1D3)5P1)2W5KD1yaXi0OgxaXiX5KD1K1)2B3)5G2WO1b1d.8Egx1TdPp1PmYdPp10120000000020002020000010000000100000000000000000000010000002001000001010000000\"/><path id=\"barbell-curl-n-e-elbowcap.l\" d=\"~~WKv__z1Dz10\"/><path id=\"barbell-curl-n-e-fore.l\" d=\"~#F12yKx1PSA1XYw1xDB1*7_6k*1HpRz1-8(4V2mRlypKdH5E7U8*2De.kUp7Y2G3P9Suxv_1tE5(8U7W6UkG8AbzdP4Xl00000000012001001001200000000100000000020000011012100001010021011101002002100010\"/><path id=\"barbell-curl-n-e-fist.l\" d=\"~~A_B1wIsww10\"/><path id=\"barbell-curl-n-e-head\" d=\"~#w12w_w1AFg-DvR(fBjFjBjS9Bbz3E3Y4X4)7x8EbRhGm_4.cT1R9Bj0NmBbHmI6!kA3DjygT1Dj0000020000001200010000101100020100000000000000100000210000000101\"/><path id=\"barbell-curl-n-e-torso\" d=\"~#_12wHvAwlTTvXRjR9-1B3O5S9(eU9waYcwgN60I6)nKm)7XcY4(fX4_kI6Nm)fShTh_4T9)7)fBrzz1EbErG60V90!cwgA3w8Xc)7)fWaK6AiN6W3_cO8A3w8zT2ww101012000000002000100000021002101102001120000000000000101000000001200010120111000000010000001001012000001001000000100\"/><path id=\"barbell-curl-n-e-thigh.r\" d=\"^16\"/><path id=\"barbell-curl-n-e-kneecap.r\" d=\"^17\"/><path id=\"barbell-curl-n-e-shank.r\" d=\"^18\"/><path id=\"barbell-curl-n-e-foot.r\" d=\"^19\"/><path id=\"barbell-curl-n-e-shcap.r\" d=\"^20\"/><path id=\"barbell-curl-n-e-upper.r\" d=\"^21\"/><path id=\"barbell-curl-n-e-elbowcap.r\" d=\"^22\"/><path id=\"barbell-curl-n-e-fore.r\" d=\"^23\"/><path id=\"barbell-curl-n-e-fist.r\" d=\"^24\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#barbell-curl-n-dots)\"/>\n  <path class=\"floorline\" d=\"M94.86 339.5H258.7\"/><path class=\"arc measure\" d=\"M166.54 183.49L170.35 203.13A20 20 0 0 0 179.39 168.17Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-curl-n-st-upper.r\"/><use href=\"#barbell-curl-n-st-elbowcap.r\"/><use href=\"#barbell-curl-n-st-fore.r\"/><use href=\"#barbell-curl-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-curl-n-st-upper.r\"/><use href=\"#barbell-curl-n-st-elbowcap.r\"/><use href=\"#barbell-curl-n-st-fore.r\"/><use href=\"#barbell-curl-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-curl-n-g0-upper.r\"/><use href=\"#barbell-curl-n-g0-elbowcap.r\"/><use href=\"#barbell-curl-n-g0-fore.r\"/><use href=\"#barbell-curl-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-curl-n-g0-upper.r\"/><use href=\"#barbell-curl-n-g0-elbowcap.r\"/><use href=\"#barbell-curl-n-g0-fore.r\"/><use href=\"#barbell-curl-n-g0-fist.r\"/></g></g><path class=\"eq-line\" d=\"~~(FB1_.H1AG32\"/><path class=\"eq-thin\" d=\"~~!.B1_.H1DW22\"/><path class=\"eq-solid\" d=\"~~F.E1_.H1!m1\"/><path class=\"eq-pin\" d=\"~~_IF1_.H1F60\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-curl-n-g1-upper.r\"/><use href=\"#barbell-curl-n-g1-elbowcap.r\"/><use href=\"#barbell-curl-n-g1-fore.r\"/><use href=\"#barbell-curl-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-curl-n-g1-upper.r\"/><use href=\"#barbell-curl-n-g1-elbowcap.r\"/><use href=\"#barbell-curl-n-g1-fore.r\"/><use href=\"#barbell-curl-n-g1-fist.r\"/></g></g><path class=\"eq-line\" d=\"~~JTE1!ED1AG32\"/><path class=\"eq-thin\" d=\"~~FDF1!ED1DW22\"/><path class=\"eq-solid\" d=\"~~UBH1!ED1!m1\"/><path class=\"eq-pin\" d=\"~~FWH1!ED1F60\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-curl-n-g2-upper.r\"/><use href=\"#barbell-curl-n-g2-elbowcap.r\"/><use href=\"#barbell-curl-n-g2-fore.r\"/><use href=\"#barbell-curl-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-curl-n-g2-upper.r\"/><use href=\"#barbell-curl-n-g2-elbowcap.r\"/><use href=\"#barbell-curl-n-g2-fore.r\"/><use href=\"#barbell-curl-n-g2-fist.r\"/></g></g><path class=\"eq-line\" d=\"~~DwE1y.w1AG32\"/><path class=\"eq-thin\" d=\"~~ATE1y.w1DW22\"/><path class=\"eq-solid\" d=\"~~NSG1y.w1!m1\"/><path class=\"eq-pin\" d=\"~~yzH1y.w1F60\"/></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#barbell-curl-n-e-thigh.l\"/><use href=\"#barbell-curl-n-e-kneecap.l\"/><use href=\"#barbell-curl-n-e-shank.l\"/><use href=\"#barbell-curl-n-e-foot.l\"/><use href=\"#barbell-curl-n-e-shcap.l\"/><use href=\"#barbell-curl-n-e-upper.l\"/><use href=\"#barbell-curl-n-e-elbowcap.l\"/><use href=\"#barbell-curl-n-e-fore.l\"/><use href=\"#barbell-curl-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#barbell-curl-n-e-thigh.l\"/><use href=\"#barbell-curl-n-e-kneecap.l\"/><use href=\"#barbell-curl-n-e-shank.l\"/><use href=\"#barbell-curl-n-e-foot.l\"/><use href=\"#barbell-curl-n-e-shcap.l\"/><use href=\"#barbell-curl-n-e-upper.l\"/><use href=\"#barbell-curl-n-e-elbowcap.l\"/><use href=\"#barbell-curl-n-e-fore.l\"/><use href=\"#barbell-curl-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-curl-n-e-head\"/><use href=\"#barbell-curl-n-e-torso\"/><use href=\"#barbell-curl-n-e-thigh.r\"/><use href=\"#barbell-curl-n-e-kneecap.r\"/><use href=\"#barbell-curl-n-e-shank.r\"/><use href=\"#barbell-curl-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-curl-n-e-head\"/><use href=\"#barbell-curl-n-e-torso\"/><use href=\"#barbell-curl-n-e-thigh.r\"/><use href=\"#barbell-curl-n-e-kneecap.r\"/><use href=\"#barbell-curl-n-e-shank.r\"/><use href=\"#barbell-curl-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-curl-n-e-shcap.r\"/><use href=\"#barbell-curl-n-e-upper.r\"/><use href=\"#barbell-curl-n-e-elbowcap.r\"/><use href=\"#barbell-curl-n-e-fore.r\"/><use href=\"#barbell-curl-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-curl-n-e-shcap.r\"/><use href=\"#barbell-curl-n-e-upper.r\"/><use href=\"#barbell-curl-n-e-elbowcap.r\"/><use href=\"#barbell-curl-n-e-fore.r\"/><use href=\"#barbell-curl-n-e-fist.r\"/></g></g><path class=\"eq-line\" d=\"~~(Pz1wIsAG32\"/><path class=\"eq-thin\" d=\"~~!zA1wIsDW22\"/><path class=\"eq-solid\" d=\"~~FzD1wIs!m1\"/><path class=\"eq-pin\" d=\"~~!TD1wIsF60\"/><path class=\"eq-cable m-line\" d=\"~M!)z1NTB1Lt-5L6J1L4w1L2sL4kL0aL04L13L0bL05L14L24L00L11L03L37L15L1bL27L35L03L31L30L52L76\"/><path class=\"eq-cable m-line\" d=\"~MPBx1J!z1L3W3L62L60L61L23L03L15L17L39L09L03L05L01L00L22L04L13L1bL03L04L4aL4iL8qLay1L8H1LcA1L4sL8iL28L21L1bL0jL1hL07L25L03L21L13L42L10L26L48L04L23\"/><path class=\"eq-cable m-line\" d=\"~MPNE1WFK1LR3FrL*6*1LB6O3Lz5z5LO3B6L*1.6L2E7L_1.6LU3B6Lw5z5LF6O3L(6*1LA72L(6_1LF6U3Lw5w5LU3F6L_1(6L2A7L*1(6LO3F6Lz5w5LB6U3L*6_1\"/><circle class=\"joint\" cx=\"166.54\" cy=\"135.88\" r=\"2.25\"/><circle class=\"joint\" cx=\"166.54\" cy=\"183.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"168\" cy=\"203.54\" r=\"2.25\"/><circle class=\"joint\" cx=\"171.29\" cy=\"266.15\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#F20JRD1HKJ1TBD1zUJ1bhbjbhdhdfdfhfdfjbfdjbhbh9l7j9j7l5l5j5l1l1l1l1n2j0l4l2l6j6l6j6jalah8he000010000100000000002020000001010002100101000000000000020001010000000000002000000202100101010010002100000000000200002000010020000010100120002200\"/><path class=\"arrow\" d=\"~MWBF1yNtLJB1yjLTz2D3Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M170.35 203.13A20 20 0 0 0 179.39 168.17\"/><g class=\"arc-ticks\"><path d=\"~M(zx1w*D1LYaDX1\"/><path d=\"~MARy1FNx1LDA1zI1\"/></g><path class=\"leader\" d=\"~MwWA1F*A1LFBb)E6\"/></g></g><path class=\"leader\" d=\"M166.54 183.49L151.77 162H141.77\"/><circle class=\"anchor\" cx=\"166.54\" cy=\"183.49\" r=\"1.5\"/><path class=\"leader\" d=\"M190.56 154.86L195 104H205\"/><circle class=\"anchor\" cx=\"190.56\" cy=\"154.86\" r=\"1.5\"/><path class=\"leader\" d=\"M149.57 147.22L146.48 82H136.48\"/><circle class=\"anchor\" cx=\"149.57\" cy=\"147.22\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"barbell-curl-n-elbows\" data-key=\"elbows\" data-cue=\"Keep the upper arms by your body. Never let them travel back.\" class=\"plate-callout two\" style=\"left:22.35%;top:39.11%\" aria-pressed=\"true\">Elbows<br>at sides</button><button type=\"button\" id=\"barbell-curl-n-wrists\" data-key=\"wrists\" data-cue=\"Keep the hands in line with the forearms, not bent up or down.\" class=\"plate-callout two\" style=\"left:55.87%;top:22.91%\" aria-pressed=\"false\">Straight<br>wrists</button><button type=\"button\" id=\"barbell-curl-n-still\" data-key=\"still\" data-cue=\"Keep the chest and body still, so only the arms move.\" class=\"plate-callout two\" style=\"left:26.82%;top:16.76%\" aria-pressed=\"false\">Still<br>body</button><span class=\"plate-arc-label\" style=\"left:69.27%;top:41.9%\"><b>Elbow</b><span>full range</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"barbell-curl-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"barbell-curl-m-st-upper.r\" d=\"^0\"/><path id=\"barbell-curl-m-st-elbowcap.r\" d=\"^1\"/><path id=\"barbell-curl-m-st-fore.r\" d=\"^2\"/><path id=\"barbell-curl-m-st-fist.r\" d=\"^3\"/><path id=\"barbell-curl-m-g0-upper.r\" d=\"^4\"/><path id=\"barbell-curl-m-g0-elbowcap.r\" d=\"^5\"/><path id=\"barbell-curl-m-g0-fore.r\" d=\"^6\"/><path id=\"barbell-curl-m-g0-fist.r\" d=\"^7\"/><path id=\"barbell-curl-m-g1-upper.r\" d=\"^8\"/><path id=\"barbell-curl-m-g1-elbowcap.r\" d=\"^9\"/><path id=\"barbell-curl-m-g1-fore.r\" d=\"^10\"/><path id=\"barbell-curl-m-g1-fist.r\" d=\"^11\"/><path id=\"barbell-curl-m-g2-upper.r\" d=\"^12\"/><path id=\"barbell-curl-m-g2-elbowcap.r\" d=\"^13\"/><path id=\"barbell-curl-m-g2-fore.r\" d=\"^14\"/><path id=\"barbell-curl-m-g2-fist.r\" d=\"^15\"/><path id=\"barbell-curl-m-e-thigh.l\" d=\"^16\"/><path id=\"barbell-curl-m-e-kneecap.l\" d=\"^17\"/><path id=\"barbell-curl-m-e-shank.l\" d=\"^18\"/><path id=\"barbell-curl-m-e-foot.l\" d=\"^19\"/><path id=\"barbell-curl-m-e-shcap.l\" d=\"^20\"/><path id=\"barbell-curl-m-e-upper.l\" d=\"^21\"/><path id=\"barbell-curl-m-e-elbowcap.l\" d=\"^22\"/><path id=\"barbell-curl-m-e-fore.l\" d=\"^23\"/><path id=\"barbell-curl-m-e-fist.l\" d=\"^24\"/><path id=\"barbell-curl-m-e-head\" d=\"^25\"/><path id=\"barbell-curl-m-e-torso\" d=\"^26\"/><path id=\"barbell-curl-m-e-thigh.r\" d=\"^16\"/><path id=\"barbell-curl-m-e-kneecap.r\" d=\"^17\"/><path id=\"barbell-curl-m-e-shank.r\" d=\"^18\"/><path id=\"barbell-curl-m-e-foot.r\" d=\"^19\"/><path id=\"barbell-curl-m-e-shcap.r\" d=\"^20\"/><path id=\"barbell-curl-m-e-upper.r\" d=\"^21\"/><path id=\"barbell-curl-m-e-elbowcap.r\" d=\"^22\"/><path id=\"barbell-curl-m-e-fore.r\" d=\"^23\"/><path id=\"barbell-curl-m-e-fist.r\" d=\"^24\"/><path id=\"barbell-curl-m-m-shcap.r\" d=\"^20\"/><path id=\"barbell-curl-m-m-upper.r\" d=\"~#F12HEvF-p)-v-_o!4O786VlNH1U5T3_2-1FoOuwiBbH8EekElFeEA18E38X6.pwF193A4*7Rdx9RoHfGbJjpyt10100202000000000000002000100000021000000000000000001000020000010100201011022000\"/><path id=\"barbell-curl-m-m-elbowcap.r\" d=\"~~!Yq(Sy1Dz10\"/><path id=\"barbell-curl-m-m-fore.r\" d=\"~#F12UFsSVz1EKrI!z1Eaw2P1K1UE1zi)93X2lzv_aIe)1Ra_3T9Ya.uYbV1J2O7N6wH1Rbw24x9y5H3U9wmD3Dg*5YeOg00200001010000020000002100020000000001020010022001001002001101001010001101021000\"/><path id=\"barbell-curl-m-m-fist.r\" d=\"~~FyA1!Evww10\"/><path id=\"barbell-curl-m-m-eq0\" d=\"~~NIA1!Ev!m1\"/><path id=\"barbell-curl-m-m-eq1\" d=\"~~w!A1!EvF60\"/><path id=\"barbell-curl-m-mf-head\" d=\"^25\"/><path id=\"barbell-curl-m-mf-torso\" d=\"^26\"/><path id=\"barbell-curl-m-mf-thigh.l\" d=\"^16\"/><path id=\"barbell-curl-m-mf-kneecap.l\" d=\"^17\"/><path id=\"barbell-curl-m-mf-shank.l\" d=\"^18\"/><path id=\"barbell-curl-m-mf-foot.l\" d=\"^19\"/><path id=\"barbell-curl-m-mf-shcap.l\" d=\"^20\"/><path id=\"barbell-curl-m-mf-upper.l\" d=\"^57\"/><path id=\"barbell-curl-m-mf-elbowcap.l\" d=\"^58\"/><path id=\"barbell-curl-m-mf-fore.l\" d=\"^59\"/><path id=\"barbell-curl-m-mf-fist.l\" d=\"^60\"/><path id=\"barbell-curl-m-mf-thigh.r\" d=\"^16\"/><path id=\"barbell-curl-m-mf-kneecap.r\" d=\"^17\"/><path id=\"barbell-curl-m-mf-shank.r\" d=\"^18\"/><path id=\"barbell-curl-m-mf-foot.r\" d=\"^19\"/><path id=\"barbell-curl-m-mo-0\" d=\"^25\"/><path id=\"barbell-curl-m-mo-1\" d=\"^26\"/><path id=\"barbell-curl-m-mo-2\" d=\"^16\"/><path id=\"barbell-curl-m-mo-3\" d=\"^17\"/><path id=\"barbell-curl-m-mo-4\" d=\"^18\"/><path id=\"barbell-curl-m-mo-5\" d=\"^19\"/><path id=\"barbell-curl-m-mo-6\" d=\"^20\"/><path id=\"barbell-curl-m-mo-7\" d=\"^21\"/><path id=\"barbell-curl-m-mo-8\" d=\"^22\"/><path id=\"barbell-curl-m-mo-9\" d=\"^23\"/><path id=\"barbell-curl-m-mo-10\" d=\"^24\"/><path id=\"barbell-curl-m-mo-11\" d=\"^16\"/><path id=\"barbell-curl-m-mo-12\" d=\"^17\"/><path id=\"barbell-curl-m-mo-13\" d=\"^18\"/><path id=\"barbell-curl-m-mo-14\" d=\"^19\"/><path id=\"barbell-curl-m-mo-15\" d=\"^20\"/><path id=\"barbell-curl-m-mo-16\" d=\"^21\"/><path id=\"barbell-curl-m-mo-17\" d=\"^22\"/><path id=\"barbell-curl-m-mo-18\" d=\"^23\"/><path id=\"barbell-curl-m-mo-19\" d=\"^24\"/><path id=\"barbell-curl-m-mo-20\" d=\"^43\"/><path id=\"barbell-curl-m-mo-21\" d=\"^44\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#barbell-curl-m-dots)\"/>\n  <path class=\"floorline\" d=\"^27\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-curl-m-st-upper.r\"/><use href=\"#barbell-curl-m-st-elbowcap.r\"/><use href=\"#barbell-curl-m-st-fore.r\"/><use href=\"#barbell-curl-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-curl-m-st-upper.r\"/><use href=\"#barbell-curl-m-st-elbowcap.r\"/><use href=\"#barbell-curl-m-st-fore.r\"/><use href=\"#barbell-curl-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-curl-m-g0-upper.r\"/><use href=\"#barbell-curl-m-g0-elbowcap.r\"/><use href=\"#barbell-curl-m-g0-fore.r\"/><use href=\"#barbell-curl-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-curl-m-g0-upper.r\"/><use href=\"#barbell-curl-m-g0-elbowcap.r\"/><use href=\"#barbell-curl-m-g0-fore.r\"/><use href=\"#barbell-curl-m-g0-fist.r\"/></g></g><path class=\"eq-line\" d=\"^29\"/><path class=\"eq-thin\" d=\"^30\"/><path class=\"eq-solid\" d=\"^31\"/><path class=\"eq-pin\" d=\"^32\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-curl-m-g1-upper.r\"/><use href=\"#barbell-curl-m-g1-elbowcap.r\"/><use href=\"#barbell-curl-m-g1-fore.r\"/><use href=\"#barbell-curl-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-curl-m-g1-upper.r\"/><use href=\"#barbell-curl-m-g1-elbowcap.r\"/><use href=\"#barbell-curl-m-g1-fore.r\"/><use href=\"#barbell-curl-m-g1-fist.r\"/></g></g><path class=\"eq-line\" d=\"^33\"/><path class=\"eq-thin\" d=\"^34\"/><path class=\"eq-solid\" d=\"^35\"/><path class=\"eq-pin\" d=\"^36\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-curl-m-g2-upper.r\"/><use href=\"#barbell-curl-m-g2-elbowcap.r\"/><use href=\"#barbell-curl-m-g2-fore.r\"/><use href=\"#barbell-curl-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-curl-m-g2-upper.r\"/><use href=\"#barbell-curl-m-g2-elbowcap.r\"/><use href=\"#barbell-curl-m-g2-fore.r\"/><use href=\"#barbell-curl-m-g2-fist.r\"/></g></g><path class=\"eq-line\" d=\"^37\"/><path class=\"eq-thin\" d=\"^38\"/><path class=\"eq-solid\" d=\"^39\"/><path class=\"eq-pin\" d=\"^40\"/></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#barbell-curl-m-e-thigh.l\"/><use href=\"#barbell-curl-m-e-kneecap.l\"/><use href=\"#barbell-curl-m-e-shank.l\"/><use href=\"#barbell-curl-m-e-foot.l\"/><use href=\"#barbell-curl-m-e-shcap.l\"/><use href=\"#barbell-curl-m-e-upper.l\"/><use href=\"#barbell-curl-m-e-elbowcap.l\"/><use href=\"#barbell-curl-m-e-fore.l\"/><use href=\"#barbell-curl-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#barbell-curl-m-e-thigh.l\"/><use href=\"#barbell-curl-m-e-kneecap.l\"/><use href=\"#barbell-curl-m-e-shank.l\"/><use href=\"#barbell-curl-m-e-foot.l\"/><use href=\"#barbell-curl-m-e-shcap.l\"/><use href=\"#barbell-curl-m-e-upper.l\"/><use href=\"#barbell-curl-m-e-elbowcap.l\"/><use href=\"#barbell-curl-m-e-fore.l\"/><use href=\"#barbell-curl-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-curl-m-e-head\"/><use href=\"#barbell-curl-m-e-torso\"/><use href=\"#barbell-curl-m-e-thigh.r\"/><use href=\"#barbell-curl-m-e-kneecap.r\"/><use href=\"#barbell-curl-m-e-shank.r\"/><use href=\"#barbell-curl-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-curl-m-e-head\"/><use href=\"#barbell-curl-m-e-torso\"/><use href=\"#barbell-curl-m-e-thigh.r\"/><use href=\"#barbell-curl-m-e-kneecap.r\"/><use href=\"#barbell-curl-m-e-shank.r\"/><use href=\"#barbell-curl-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-curl-m-e-shcap.r\"/><use href=\"#barbell-curl-m-e-upper.r\"/><use href=\"#barbell-curl-m-e-elbowcap.r\"/><use href=\"#barbell-curl-m-e-fore.r\"/><use href=\"#barbell-curl-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-curl-m-e-shcap.r\"/><use href=\"#barbell-curl-m-e-upper.r\"/><use href=\"#barbell-curl-m-e-elbowcap.r\"/><use href=\"#barbell-curl-m-e-fore.r\"/><use href=\"#barbell-curl-m-e-fist.r\"/></g></g><path class=\"eq-line\" d=\"^41\"/><path class=\"eq-thin\" d=\"^42\"/><path class=\"eq-solid\" d=\"^43\"/><path class=\"eq-pin\" d=\"^44\"/><path class=\"eq-cable m-line\" d=\"^45\"/><path class=\"eq-cable m-line\" d=\"^46\"/><path class=\"eq-cable m-line\" d=\"^47\"/><circle class=\"joint\" cx=\"166.54\" cy=\"135.88\" r=\"2.25\"/><circle class=\"joint\" cx=\"166.54\" cy=\"183.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"168\" cy=\"203.54\" r=\"2.25\"/><circle class=\"joint\" cx=\"171.29\" cy=\"266.15\" r=\"2.25\"/></g><mask id=\"barbell-curl-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#barbell-curl-m-mf-head\" fill=\"#000\"/><use href=\"#barbell-curl-m-mf-torso\" fill=\"#000\"/><use href=\"#barbell-curl-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#barbell-curl-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#barbell-curl-m-mf-shank.l\" fill=\"#000\"/><use href=\"#barbell-curl-m-mf-foot.l\" fill=\"#000\"/><use href=\"#barbell-curl-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#barbell-curl-m-mf-upper.l\" fill=\"#000\"/><use href=\"#barbell-curl-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#barbell-curl-m-mf-fore.l\" fill=\"#000\"/><use href=\"#barbell-curl-m-mf-fist.l\" fill=\"#000\"/><use href=\"#barbell-curl-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#barbell-curl-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#barbell-curl-m-mf-shank.r\" fill=\"#000\"/><use href=\"#barbell-curl-m-mf-foot.r\" fill=\"#000\"/><use href=\"#barbell-curl-m-m-shcap.r\" fill=\"#000\"/><use href=\"#barbell-curl-m-m-upper.r\" fill=\"#000\"/><use href=\"#barbell-curl-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#barbell-curl-m-m-fore.r\" fill=\"#000\"/><use href=\"#barbell-curl-m-m-fist.r\" fill=\"#000\"/><use href=\"#barbell-curl-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-curl-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#barbell-curl-m-mmask)\"><g class=\"u-stroke\"><use href=\"#barbell-curl-m-m-shcap.r\"/><use href=\"#barbell-curl-m-m-upper.r\"/><use href=\"#barbell-curl-m-m-elbowcap.r\"/><use href=\"#barbell-curl-m-m-fore.r\"/><use href=\"#barbell-curl-m-m-fist.r\"/><use href=\"#barbell-curl-m-m-eq0\"/><use href=\"#barbell-curl-m-m-eq1\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MHEvF-pLx3P3La8L86L84L41L41L05L07L27L27L41L25L20L01L02L12L45L8dL25L14L3aL9iLdqLhA1LjF1LlA1LbqL9kL38L02L87LcfL8bL43L40L21L21L00L41L10L16L58L12L41L67LadLghLinLipLglLchLabLcbLa5L63La0L80Lc3Lc5L65L85L45L49L05L45L85L25L67L27L09L0bL1dL57L15L17L2bL2dL8hL8jLclLcrLctLalL4fL67L05L14L36L1aL13L22L03L11L23L01L05L6dL8hL47L31L3aLbgLfoLjD1LpD1Ljw1LfoLbkL58L12L21LafL25L04L01L02L03L21L25L45L85L61L45L21L15L71L57Ld1L7bL39L39L71L72Ld6LbaLhgLfcLf6Ld8Ld6L5aL7aL38L0eL56L98L58L3cL3aL0eL0iL2eL0oL5kL1iL0eL46L48Lc0Lc3\"/><path class=\"m-line\" d=\"~MF)s(Sy1LV2PdL*4x2L-3-3L)1*4L1I5LA2*4LY3-3L(4x2LJ52L(4w2LY3_3LA2(4L1J5L)1(4L-3_3L*4w2\"/><path class=\"m-line\" d=\"~MUFsSVz1LW3dL05L17L13L31L12L72L72L76L72L72L30L10L00L21L40L30Lb6L32L43La1Lg9LqbLw1bLD1hLA1dLqbLg7L83L10L90Ll6Lf4L92L31L30L30L10L00L01L81L63L21L12L70Lf6Lf6LraLlaLnaLf8Ld2Lb4L90L11L37L31L73L71L51L72L32L32L54L32L51L32L54L52L34L38L58L06L44L36L56L96Ld4Lh8Ll4LraLl8Lj8Ld4L74L32L41La0L41L20L22L30L02L52L16L74Ld6LjcL94L12La1Li1Ls9LA1bLF1bLy17Lo7Lm5L81L60L50L94L72L81L00L20L32L12L52L76L92L90L32L34L14L04L64L48L06L38L16L42L66Lc0La2Lk1Le4Le2La6Lc1La2L83L83L65L61La0L61La1L87L65L89L8bLa9LcdLc5L49L45L03L55L50\"/><path class=\"m-line\" d=\"~MFyD1!EvL3A3Lb0L71L93L73L93L73L77L55L57L77L19L37L39L17L0bL27L3bL47L49L47L49L47L87L85L67L83L83Lc3L63Lc1L80Lc0L80Lc2L64Lc4L84L84L68L88L86L48L48L4cL46L4cL38L2cL08L1cL36L3cL18L78L56L58L78L74L94L74L94L72Lb0\"/><path class=\"m-line\" d=\"~M!Pw1NUpL0HSc\"/><path class=\"m-line\" d=\"~MNIF1!EvLT3FrL.6*1LB6O3Lz5z5LO3B6L*1*6L2z7L_1*6LU3B6Lw5z5LF6O3L(6*1LA72L(6_1LF6U3Lw5w5LU3F6L_1(6L2A7L*1(6LO3F6Lz5w5LB6U3L.6_1\"/><path class=\"m-arrow\" d=\"~MA(v__z1LR!2IrMHt.aLGt!aL(O1Fe\"/><path class=\"leader m\" d=\"~My!rW(z1L0Ho\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"barbell-curl-m-elbows\" data-key=\"elbows\" data-cue=\"Your elbows travel back behind you to cheat the bar up.\" class=\"plate-callout two m\" style=\"left:22.35%;top:51.4%\" aria-pressed=\"true\">Elbows<br>back</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "Keep the upper arms by your body. Never let them travel back." }, { key: "wrists", cue: "Keep the hands in line with the forearms, not bent up or down." }, { key: "still", cue: "Keep the chest and body still, so only the arms move." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "Your elbows travel back behind you to cheat the bar up." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Elbows back</b><span>Your elbows travel back behind you to cheat the bar up.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: curl 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Curl</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Barbell curl, side view. Standing with the feet hip-width and a bar held underhand at the thighs, the lifter keeps the elbows at the sides and curls the bar up to the shoulders.",
      mistakeAlt: "Barbell Curl: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "curl",
    "orientation": "supinated",
    "handle": "bar-28",
    "loadAxis": "across",
    "width": {
      "text": "In line with your elbows and shoulders.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-bbcurl",
          "ace-bbcurl"
        ],
        "note": "c1"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dbcurl"
        ],
        "note": "card grip.thumb and inherit grip.thumb: parent dumbbell_biceps_curl c1 (sources ace-seated-curl, sl-dbcurl)."
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "ext": [
        -10,
        10
      ],
      "limitText": "Keep the hands in line with the forearms.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "CONVENTION"
        ],
        "sources": [
          "sl-bbcurl",
          "hand-key-curl"
        ],
        "note": "c8. The ext range is the curl key's wristRange (ga:curl-mid), a convention, not a card number."
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
    "gripLine": "Underhand grip, hands about shoulder-width, thumbs wrapped.",
    "cue": "Wrists straight, thumbs wrapped."
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
          "sl-bbcurl",
          "marcolin-2018"
        ],
        "note": "c7"
      }
    },
    {
      "kind": "position",
      "text": "Stand with your feet hip-width, core braced.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-bbcurl"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "grip",
      "text": "Grip the bar underhand, hands shoulder-width.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-bbcurl",
          "ace-bbcurl"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "brace",
      "text": "Keep your chest and body still. Only your arms move.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bbcurl",
          "sl-bbcurl"
        ],
        "note": "c9, c3"
      }
    },
    {
      "kind": "finish",
      "text": "Lower the bar slowly, keeping tension at the bottom. No half reps.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-bbcurl",
          "ace-bbcurl"
        ],
        "note": "c10, c9, c6"
      }
    }
  ],
  posture: [
    {
      "key": "elbows",
      "label": "Elbows at sides",
      "detail": "Elbows stay close to your body.",
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
          "sl-bbcurl",
          "ace-bbcurl"
        ],
        "note": "c4, c3"
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
          "sl-bbcurl"
        ],
        "note": "c4"
      }
    },
    {
      "key": "still",
      "label": "Still body",
      "detail": "Body and chest stay still.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bbcurl"
        ],
        "note": "c9"
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
          "sl-bbcurl"
        ],
        "note": "c8"
      }
    },
    {
      "key": "lower",
      "label": "Slow lowering",
      "detail": "Lower the bar slowly, keeping tension at the bottom.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-bbcurl",
          "ace-bbcurl"
        ],
        "note": "c10, c9"
      }
    },
    {
      "key": "range",
      "label": "Full range",
      "detail": "Use the full range, not half reps.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-bbcurl"
        ],
        "note": "c6"
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
    "setupLine": "Stand feet hip-width, core braced. Grip the bar underhand, hands shoulder-width, elbows close to your body.",
    "mistakeLine": "Never let your upper arms travel back. Take weight off instead of swinging.",
    "cueLine": "Elbows close to your body."
  },
  mistakes: [
    {
      "key": "wrists",
      "title": "Wrists bending",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-bbcurl"
        ],
        "note": "c8"
      },
      "fix": "Keep the hands in line with the forearms."
    },
    {
      "key": "elbows",
      "title": "Elbows travelling back or forward",
      "zoom": "curl-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-bbcurl"
        ],
        "note": "c5, c4"
      },
      "fix": "Keep the upper arms at your sides."
    },
    {
      "key": "swing",
      "title": "Swinging the body",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-bbcurl",
          "marcolin-2018"
        ],
        "note": "c7"
      },
      "fix": "Take weight off and lift with control."
    }
  ],
  risks: [
    {
      "key": "wrist",
      "text": "Bent wrists put extra load on them and can lead to discomfort, even injury.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-bbcurl"
        ],
        "note": "c8"
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
    "sl-bbcurl",
    "ace-bbcurl",
    "marcolin-2018",
    "sl-dbcurl",
    "acsm-2009",
    "hand-key-curl",
    "nhs-wrist-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/barbell_curl.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

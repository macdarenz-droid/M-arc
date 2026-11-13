// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=6751694ce4d4c005d5fc6598599e6905b1947ec16bfe22179d6fa2c2d001c648
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_preacher_curl",
  name: "Preacher Curl",
  hashes: { inputsSha256: "6751694ce4d4c005d5fc6598599e6905b1947ec16bfe22179d6fa2c2d001c648", golden: "1f072026c2be27bd0d150d6a647244cc9cc405a705a451d16b6a5b98b23a758d" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"preacher-curl-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"preacher-curl-n-st-fore.l\" d=\"~#F12!AF1DHG1GOE1xYF1R7z7w2e(B1JlX5B8x1T2xr-i-6-cE9G6KeO1Tr)h.20V9G2yy1FrA1U1K9G4.5H8JaWjHeS9ymH221020002001010000000020020000000010000000210002000200021000000001001010101101201\"/><path id=\"preacher-curl-n-st-fist.l\" d=\"~~y*O1Y_K1ww10\"/><path id=\"preacher-curl-n-st-fore.r\" d=\"^0\"/><path id=\"preacher-curl-n-st-fist.r\" d=\"^1\"/><path id=\"preacher-curl-n-g0-fore.r\" d=\"~#F12FWF1HPG1R_E1.HG1zaT2(1hUI1ax9I4B2-1-w1G3zc*7BbvGdY5.w1K2R2J1R9Y2wI1F7Y1uIaox1AaUiDcAhS1Nk.800001000000000101011000020002000202200200110000000000010001001000000020200010020\"/><path id=\"preacher-curl-n-g0-fist.r\" d=\"~~JRR1(DG1ww10\"/><path id=\"preacher-curl-n-g1-fore.r\" d=\"~#F12NFG1HKG1TKF1)VG1xaU2J1K1HD1.k)9k-2jGuydKex1GaS4-8Pb)tYdO1P2x7w7yG1Oey20V8W5w4J9AmS1Wf*6WdRh10000000000002000201000000000012100200000000020000000020000000000011011002000001\"/><path id=\"preacher-curl-n-g1-fist.r\" d=\"~~PXP1HJA1ww10\"/><path id=\"preacher-curl-n-g2-fore.r\" d=\"~#F12!WG1_xG1TzG1IWG1R7A7i.1Hn.A1I8J5X2sEkyqzdA6X6(8E2JeOjSq1!2-2S9(sRw1W1x1-4F9y8F6AkG9JaXdN3)l10110000021010002000101100000200001200002000220010000200101002020000000000000100\"/><path id=\"preacher-curl-n-g2-fist.r\" d=\"~~!VK1URw1ww10\"/><path id=\"preacher-curl-n-e-thigh.l\" d=\"~#F12wUtW-P1xGszDP1Bbz4hA1NY1Nr*3)8x2G4BK1xsze)lTh-9zqbTO1TnX4g-9J1DV1Px1ivK9I7KpSlypwE1JvPhJN1o01000000020010020000000000011000001002000000010001200000021010000000000000020001\"/><path id=\"preacher-curl-n-e-kneecap.l\" d=\"~~wzF1DVU1_J10\"/><path id=\"preacher-curl-n-e-shank.l\" d=\"~#F12SAF1JAU1B-F1X-S1w6IaA1gEiN!1J8B5w4V2YkX)1_b)9H4Bb.1Gf_rx*1B1T4V2O9Ir!Y1B1dU2VbBgF6GlDi.7FkN3_r00000000020200000000000000200200000020010110120200000000100000121010100000200100\"/><path id=\"preacher-curl-n-e-foot.l\" d=\"~#o2JAA1Uw)1)VA1Vw(1_cF3Uh)7Up)nS-2B3-J2-4ID1*7xo1OG1_4EbXcYsEbGmUp100000002020000010001000121000002000101100000011\"/><path id=\"preacher-curl-n-e-shcap.l\" d=\"~~Y_w1UVx1wP10\"/><path id=\"preacher-curl-n-e-upper.l\" d=\"~#F12DFx1(Wy1xPw1R!x1-5-645!y1Uw1*1O6vz3RmVv-5OkKb-bEkO6.uXnz3x1K6z2Jv(z156R6z6IcPa!7(rUfAgSr!800012100000022100000220001010000001100000110000010000001010001000202002000000002\"/><path id=\"preacher-curl-n-e-elbowcap.l\" d=\"~~FWE1WIF1Dz10\"/><path id=\"preacher-curl-n-e-fore.l\" d=\"~#F12(*G1_PF1zXG1BJG1x3waf)1U2OI1.4Y8.1A2x5Uw1R8UbR1Dbw5Sdz4Yw1F1S2F2Y9P9RH1uX1aNayaS1Ad*hJ2xhV7-k01022020000020100000200000000100000101000000202000010100000020210100100101001011\"/><path id=\"preacher-curl-n-e-fist.l\" d=\"~~yBG1UVuww10\"/><path id=\"preacher-curl-n-e-head\" d=\"~#w12PBB1DEoTYz1TJnVoNbElN2O9-6T4N3X1B9X3Ed-8xr!8KaY1O9)hT6!o-2DnU1PiAaScUlz8Nh0010100000001000000000001000200000020000000010001000000000011120\"/><path id=\"preacher-curl-n-e-torso\" d=\"~#_12NAy1UBsG*y1G*qK7R5odD5Pi_7P8P8UiF6S1d-oXjBdTdP1WgnYlB1SpxaJl.cw7z8*3Kh.h-F1E4)sB6T1I9G2S8WiD1N8Oa-aOh(3BbSi_3(bJjE7y1S4z-2S100101000101012000002100000101020000110000000001210200100201010012000200100001000000001000010002100000020000010000000\"/><path id=\"preacher-curl-n-e-thigh.r\" d=\"^8\"/><path id=\"preacher-curl-n-e-kneecap.r\" d=\"^9\"/><path id=\"preacher-curl-n-e-shank.r\" d=\"^10\"/><path id=\"preacher-curl-n-e-foot.r\" d=\"^11\"/><path id=\"preacher-curl-n-e-shcap.r\" d=\"^12\"/><path id=\"preacher-curl-n-e-upper.r\" d=\"^13\"/><path id=\"preacher-curl-n-e-elbowcap.r\" d=\"^14\"/><path id=\"preacher-curl-n-e-fore.r\" d=\"^15\"/><path id=\"preacher-curl-n-e-fist.r\" d=\"^16\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#preacher-curl-n-dots)\"/>\n  <path class=\"floorline\" d=\"M82.4 338.77H272.57\"/><path class=\"eq\" d=\"~MFNnU*S1LY.90Qwp0Xy9)oL)owbQ0)o)o)aLXy9wpQ)o0Yy9wpLwp)aQ0wpwpwbZ\"/><path class=\"eq\" d=\"~MWPrwKT1L0PTdQ0F6F6EKdLAA1E6QF60zA1E6LE6EKdQ0E6E6FKdLzA1F6QE60AA1F6Z\"/><path class=\"eq\" d=\"~MFGmDyy2LYBc0QF60O)bE6LE6V8Q0E6E6W8LO)bF6QE60P)bF6LF6W8Q0F6F6V8Z\"/><path class=\"arc measure\" d=\"M208.88 206.67L188.04 185.09A30 30 0 0 1 213.05 176.96Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#preacher-curl-n-st-fore.l\"/><use href=\"#preacher-curl-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-n-st-fore.l\"/><use href=\"#preacher-curl-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#preacher-curl-n-st-fore.r\"/><use href=\"#preacher-curl-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-n-st-fore.r\"/><use href=\"#preacher-curl-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#preacher-curl-n-g0-fore.r\"/><use href=\"#preacher-curl-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-n-g0-fore.r\"/><use href=\"#preacher-curl-n-g0-fist.r\"/></g></g><path class=\"eq-line\" d=\"~~FFO1(DG1AG32\"/><path class=\"eq-thin\" d=\"~~A.O1(DG1DW22\"/><path class=\"eq-solid\" d=\"~~P_R1(DG1!m1\"/><path class=\"eq-pin\" d=\"~~AIS1(DG1F60\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#preacher-curl-n-g1-fore.r\"/><use href=\"#preacher-curl-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-n-g1-fore.r\"/><use href=\"#preacher-curl-n-g1-fist.r\"/></g></g><path class=\"eq-line\" d=\"~~JNN1HJA1AG32\"/><path class=\"eq-thin\" d=\"~~FxO1HJA1DW22\"/><path class=\"eq-solid\" d=\"~~UwR1HJA1!m1\"/><path class=\"eq-pin\" d=\"~~FRR1HJA1F60\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#preacher-curl-n-g2-fore.r\"/><use href=\"#preacher-curl-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-n-g2-fore.r\"/><use href=\"#preacher-curl-n-g2-fist.r\"/></g></g><path class=\"eq-line\" d=\"~~YJI1URw1AG32\"/><path class=\"eq-thin\" d=\"~~W)I1URw1DW22\"/><path class=\"eq-solid\" d=\"~~y)K1URw1!m1\"/><path class=\"eq-pin\" d=\"~~UON1URw1F60\"/></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#preacher-curl-n-e-thigh.l\"/><use href=\"#preacher-curl-n-e-kneecap.l\"/><use href=\"#preacher-curl-n-e-shank.l\"/><use href=\"#preacher-curl-n-e-foot.l\"/><use href=\"#preacher-curl-n-e-shcap.l\"/><use href=\"#preacher-curl-n-e-upper.l\"/><use href=\"#preacher-curl-n-e-elbowcap.l\"/><use href=\"#preacher-curl-n-e-fore.l\"/><use href=\"#preacher-curl-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-n-e-thigh.l\"/><use href=\"#preacher-curl-n-e-kneecap.l\"/><use href=\"#preacher-curl-n-e-shank.l\"/><use href=\"#preacher-curl-n-e-foot.l\"/><use href=\"#preacher-curl-n-e-shcap.l\"/><use href=\"#preacher-curl-n-e-upper.l\"/><use href=\"#preacher-curl-n-e-elbowcap.l\"/><use href=\"#preacher-curl-n-e-fore.l\"/><use href=\"#preacher-curl-n-e-fist.l\"/></g></g><path class=\"eq\" d=\"~MHJD1UVN1L0AYhQ0wpwpz)gLBk)oQwp0Dk)oL)oz)gQ0)o)oA)gLDkwpQ)o0BkwpZ\"/><path class=\"eq\" d=\"~MHJx1Dyy2L_Wb0QYd0xGbXdLXdYdQ0VdXdVdLxGbWdQXd0yGbWdLYdVdQ0YdYdYdZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#preacher-curl-n-e-head\"/><use href=\"#preacher-curl-n-e-torso\"/><use href=\"#preacher-curl-n-e-thigh.r\"/><use href=\"#preacher-curl-n-e-kneecap.r\"/><use href=\"#preacher-curl-n-e-shank.r\"/><use href=\"#preacher-curl-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-n-e-head\"/><use href=\"#preacher-curl-n-e-torso\"/><use href=\"#preacher-curl-n-e-thigh.r\"/><use href=\"#preacher-curl-n-e-kneecap.r\"/><use href=\"#preacher-curl-n-e-shank.r\"/><use href=\"#preacher-curl-n-e-foot.r\"/></g></g><path class=\"eq\" d=\"~MDYA1NYB1L(X6U)6L*X6.R5L-P8XK1Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#preacher-curl-n-e-shcap.r\"/><use href=\"#preacher-curl-n-e-upper.r\"/><use href=\"#preacher-curl-n-e-elbowcap.r\"/><use href=\"#preacher-curl-n-e-fore.r\"/><use href=\"#preacher-curl-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-n-e-shcap.r\"/><use href=\"#preacher-curl-n-e-upper.r\"/><use href=\"#preacher-curl-n-e-elbowcap.r\"/><use href=\"#preacher-curl-n-e-fore.r\"/><use href=\"#preacher-curl-n-e-fist.r\"/></g></g><path class=\"eq-line\" d=\"~~!.D1UVuAG32\"/><path class=\"eq-thin\" d=\"~~_NE1UVuDW22\"/><path class=\"eq-solid\" d=\"~~DNG1UVu!m1\"/><path class=\"eq-pin\" d=\"~~_(G1UVuF60\"/><circle class=\"joint\" cx=\"175.8\" cy=\"172.42\" r=\"2.25\"/><circle class=\"joint\" cx=\"208.88\" cy=\"206.67\" r=\"2.25\"/><circle class=\"joint\" cx=\"157.66\" cy=\"239.13\" r=\"2.25\"/><circle class=\"joint\" cx=\"212.45\" cy=\"269.63\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#H20(.R1SwJ1EXR1*JJ1h5f3h3h5f1h1h0h3h2h0f2j2f2h6h2f6f6h6f8f8f8daf8dcdcdabebadg9c9gbc7i7e9g5g1011100200000001000000000202000001000000000020100001200012100120000000000012000000000000000100101200000000200000011010010000000000002000001011010000\"/><path class=\"arrow\" d=\"~M(NI1H.uL!G1x2L*Y1JA1Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M188.04 185.09A30 30 0 0 1 213.05 176.96\"/><g class=\"arc-ticks\"><path d=\"~MSFB1_WA1LxE1OF1\"/><path d=\"~MyPG1YHz1L!7VX1\"/></g><path class=\"leader\" d=\"~MW.D1NKy1LzV8VT9\"/></g></g><path class=\"leader\" d=\"~MDYA1NYB1L)J9y4\"/><circle class=\"anchor\" cx=\"188.19\" cy=\"193.35\" r=\"1.5\"/><path class=\"leader\" d=\"M214.82 210.58L261 258H271\"/><circle class=\"anchor\" cx=\"214.82\" cy=\"210.58\" r=\"1.5\"/><path class=\"leader\" d=\"~Mw_G1JAx1L0.Ub\"/><circle class=\"anchor\" cx=\"214.08\" cy=\"169.66\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"preacher-curl-n-armpits\" data-key=\"armpits\" data-cue=\"Sit with the pad top under your armpits and your chest on it.\" class=\"plate-callout two\" style=\"left:20.11%;top:48.04%\" aria-pressed=\"true\">Armpits<br>over pad</button><button type=\"button\" id=\"preacher-curl-n-arms\" data-key=\"arms\" data-cue=\"Press the backs of your upper arms into the pad all the way up.\" class=\"plate-callout two\" style=\"left:74.3%;top:65.92%\" aria-pressed=\"false\">Arms on<br>pad</button><button type=\"button\" id=\"preacher-curl-n-wrists\" data-key=\"wrists\" data-cue=\"Keep the hands in line with the forearms.\" class=\"plate-callout two\" style=\"left:41.9%;top:19.55%\" aria-pressed=\"false\">Straight<br>wrists</button><span class=\"plate-arc-label\" style=\"left:16.2%;top:33.52%\"><b>Elbow</b><span>bar to shoulders</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"preacher-curl-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"preacher-curl-m-st-fore.l\" d=\"^0\"/><path id=\"preacher-curl-m-st-fist.l\" d=\"^1\"/><path id=\"preacher-curl-m-st-fore.r\" d=\"^0\"/><path id=\"preacher-curl-m-st-fist.r\" d=\"^1\"/><path id=\"preacher-curl-m-g0-fore.r\" d=\"^2\"/><path id=\"preacher-curl-m-g0-fist.r\" d=\"^3\"/><path id=\"preacher-curl-m-g1-fore.r\" d=\"^4\"/><path id=\"preacher-curl-m-g1-fist.r\" d=\"^5\"/><path id=\"preacher-curl-m-g2-fore.r\" d=\"^6\"/><path id=\"preacher-curl-m-g2-fist.r\" d=\"^7\"/><path id=\"preacher-curl-m-e-thigh.l\" d=\"^8\"/><path id=\"preacher-curl-m-e-kneecap.l\" d=\"^9\"/><path id=\"preacher-curl-m-e-shank.l\" d=\"^10\"/><path id=\"preacher-curl-m-e-foot.l\" d=\"^11\"/><path id=\"preacher-curl-m-e-shcap.l\" d=\"^12\"/><path id=\"preacher-curl-m-e-upper.l\" d=\"^13\"/><path id=\"preacher-curl-m-e-elbowcap.l\" d=\"^14\"/><path id=\"preacher-curl-m-e-fore.l\" d=\"^15\"/><path id=\"preacher-curl-m-e-fist.l\" d=\"^16\"/><path id=\"preacher-curl-m-e-head\" d=\"^17\"/><path id=\"preacher-curl-m-e-torso\" d=\"^18\"/><path id=\"preacher-curl-m-e-thigh.r\" d=\"^8\"/><path id=\"preacher-curl-m-e-kneecap.r\" d=\"^9\"/><path id=\"preacher-curl-m-e-shank.r\" d=\"^10\"/><path id=\"preacher-curl-m-e-foot.r\" d=\"^11\"/><path id=\"preacher-curl-m-e-shcap.r\" d=\"^12\"/><path id=\"preacher-curl-m-e-upper.r\" d=\"^13\"/><path id=\"preacher-curl-m-e-elbowcap.r\" d=\"^14\"/><path id=\"preacher-curl-m-e-fore.r\" d=\"^15\"/><path id=\"preacher-curl-m-e-fist.r\" d=\"^16\"/><path id=\"preacher-curl-m-m-head\" d=\"~#w12JAtS!mORrBRm*jSiKj!8BbR3E3U4T4z8R7KbXg)mD5VcE1T9BjjYmKaUmT5Wk!3UiYgG2yj0000000100111101000000020020000011100200101101100101000010110120\"/><path id=\"preacher-curl-m-m-torso\" d=\"~#_12AOr_SrG_rXAq-8x3ihWa!fyaY5_dAfN6fx8On*mK6KcW5Wf.5Fk-7FlRhHg-iA4.9z9IfRtEx1xdIqI6gR9k_dyf_3_7Gdz7KfA9*4AlH7DaDg-cN2!3GU2At00011100000001000202000001101001101010020000100111011110000200000000000020000010000220000010000011100200001110100200\"/><path id=\"preacher-curl-m-m-eq0\" d=\"~~HBx1SWp!m1\"/><path id=\"preacher-curl-m-m-eq1\" d=\"~~(Vx1SWpF60\"/><path id=\"preacher-curl-m-mf-thigh.l\" d=\"~#F12D_sJHP1ROrBWO1zbE4hA1wY1FsX3x9x2I4XJ1XsXdzmOhxazqrEO1EoX4c-9F1SU1Hy1mvG9O7-pAlPoJE1yvwiNN1N101001200001100010100010100020002000011020000011110101000001110000100201010020000\"/><path id=\"preacher-curl-m-mf-kneecap.l\" d=\"~~FEE1SIU1_J10\"/><path id=\"preacher-curl-m-mf-shank.l\" d=\"~#F12WEE1w(T1x-E1*RS1D5XaD1aXdU*1w8X5_3*2(fzx2wb*aP3Kbx3zfDn*(1O1R4I3E9znY_1z1bW1-bTfN7*jWjG6_kN5Nr00000001010010120000001010010000001200000000002000100101200000200001110000101000\"/><path id=\"preacher-curl-m-mf-foot.l\" d=\"^11\"/><path id=\"preacher-curl-m-mf-shcap.l\" d=\"~~P.rFYw1wP10\"/><path id=\"preacher-curl-m-mf-upper.l\" d=\"~#F12NztSEy1IwsVwy1X8.12bJO1W5I5z4V2)1)A1xcXgxdGgX2xk_6)D1pz3uK6A2SN1Ha08*8tX3Yf!mYhAm_3PrE900220000012200000000010002000010000220001000200100010100011200110010011000200000\"/><path id=\"preacher-curl-m-mf-elbowcap.l\" d=\"~~WKB1yHy1Dz10\"/><path id=\"preacher-curl-m-mf-fore.l\" d=\"~#F12HRE1SYx1).E1TSy1J3_9R1E1VnRA1H1!99_2HfFt0PeH5(9Ac(7yg_sS2H1S7P6Th-E15x2J6F8y9V43Emz8zfRiEc10000000000000000110110110100010100001000100000000000201010000010100000000001002\"/><path id=\"preacher-curl-m-mf-fist.l\" d=\"~~D!w1SWpww10\"/><path id=\"preacher-curl-m-mf-thigh.r\" d=\"^56\"/><path id=\"preacher-curl-m-mf-kneecap.r\" d=\"^57\"/><path id=\"preacher-curl-m-mf-shank.r\" d=\"^58\"/><path id=\"preacher-curl-m-mf-foot.r\" d=\"^11\"/><path id=\"preacher-curl-m-mf-shcap.r\" d=\"^59\"/><path id=\"preacher-curl-m-mf-upper.r\" d=\"^60\"/><path id=\"preacher-curl-m-mf-elbowcap.r\" d=\"^61\"/><path id=\"preacher-curl-m-mf-fore.r\" d=\"^62\"/><path id=\"preacher-curl-m-mf-fist.r\" d=\"^63\"/><path id=\"preacher-curl-m-mo-0\" d=\"^17\"/><path id=\"preacher-curl-m-mo-1\" d=\"^18\"/><path id=\"preacher-curl-m-mo-2\" d=\"^8\"/><path id=\"preacher-curl-m-mo-3\" d=\"^9\"/><path id=\"preacher-curl-m-mo-4\" d=\"^10\"/><path id=\"preacher-curl-m-mo-5\" d=\"^11\"/><path id=\"preacher-curl-m-mo-6\" d=\"^12\"/><path id=\"preacher-curl-m-mo-7\" d=\"^13\"/><path id=\"preacher-curl-m-mo-8\" d=\"^14\"/><path id=\"preacher-curl-m-mo-9\" d=\"^15\"/><path id=\"preacher-curl-m-mo-10\" d=\"^16\"/><path id=\"preacher-curl-m-mo-11\" d=\"^8\"/><path id=\"preacher-curl-m-mo-12\" d=\"^9\"/><path id=\"preacher-curl-m-mo-13\" d=\"^10\"/><path id=\"preacher-curl-m-mo-14\" d=\"^11\"/><path id=\"preacher-curl-m-mo-15\" d=\"^12\"/><path id=\"preacher-curl-m-mo-16\" d=\"^13\"/><path id=\"preacher-curl-m-mo-17\" d=\"^14\"/><path id=\"preacher-curl-m-mo-18\" d=\"^15\"/><path id=\"preacher-curl-m-mo-19\" d=\"^16\"/><path id=\"preacher-curl-m-mo-20\" d=\"^20\"/><path id=\"preacher-curl-m-mo-21\" d=\"^21\"/><path id=\"preacher-curl-m-mo-22\" d=\"^22\"/><path id=\"preacher-curl-m-mo-23\" d=\"^38\"/><path id=\"preacher-curl-m-mo-24\" d=\"^36\"/><path id=\"preacher-curl-m-mo-25\" d=\"^37\"/><path id=\"preacher-curl-m-mo-26\" d=\"^41\"/><path id=\"preacher-curl-m-mo-27\" d=\"^42\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#preacher-curl-m-dots)\"/>\n  <path class=\"floorline\" d=\"^19\"/><path class=\"eq\" d=\"^20\"/><path class=\"eq\" d=\"^21\"/><path class=\"eq\" d=\"^22\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#preacher-curl-m-st-fore.l\"/><use href=\"#preacher-curl-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-m-st-fore.l\"/><use href=\"#preacher-curl-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#preacher-curl-m-st-fore.r\"/><use href=\"#preacher-curl-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-m-st-fore.r\"/><use href=\"#preacher-curl-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#preacher-curl-m-g0-fore.r\"/><use href=\"#preacher-curl-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-m-g0-fore.r\"/><use href=\"#preacher-curl-m-g0-fist.r\"/></g></g><path class=\"eq-line\" d=\"^24\"/><path class=\"eq-thin\" d=\"^25\"/><path class=\"eq-solid\" d=\"^26\"/><path class=\"eq-pin\" d=\"^27\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#preacher-curl-m-g1-fore.r\"/><use href=\"#preacher-curl-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-m-g1-fore.r\"/><use href=\"#preacher-curl-m-g1-fist.r\"/></g></g><path class=\"eq-line\" d=\"^28\"/><path class=\"eq-thin\" d=\"^29\"/><path class=\"eq-solid\" d=\"^30\"/><path class=\"eq-pin\" d=\"^31\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#preacher-curl-m-g2-fore.r\"/><use href=\"#preacher-curl-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-m-g2-fore.r\"/><use href=\"#preacher-curl-m-g2-fist.r\"/></g></g><path class=\"eq-line\" d=\"^32\"/><path class=\"eq-thin\" d=\"^33\"/><path class=\"eq-solid\" d=\"^34\"/><path class=\"eq-pin\" d=\"^35\"/></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#preacher-curl-m-e-thigh.l\"/><use href=\"#preacher-curl-m-e-kneecap.l\"/><use href=\"#preacher-curl-m-e-shank.l\"/><use href=\"#preacher-curl-m-e-foot.l\"/><use href=\"#preacher-curl-m-e-shcap.l\"/><use href=\"#preacher-curl-m-e-upper.l\"/><use href=\"#preacher-curl-m-e-elbowcap.l\"/><use href=\"#preacher-curl-m-e-fore.l\"/><use href=\"#preacher-curl-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-m-e-thigh.l\"/><use href=\"#preacher-curl-m-e-kneecap.l\"/><use href=\"#preacher-curl-m-e-shank.l\"/><use href=\"#preacher-curl-m-e-foot.l\"/><use href=\"#preacher-curl-m-e-shcap.l\"/><use href=\"#preacher-curl-m-e-upper.l\"/><use href=\"#preacher-curl-m-e-elbowcap.l\"/><use href=\"#preacher-curl-m-e-fore.l\"/><use href=\"#preacher-curl-m-e-fist.l\"/></g></g><path class=\"eq\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#preacher-curl-m-e-head\"/><use href=\"#preacher-curl-m-e-torso\"/><use href=\"#preacher-curl-m-e-thigh.r\"/><use href=\"#preacher-curl-m-e-kneecap.r\"/><use href=\"#preacher-curl-m-e-shank.r\"/><use href=\"#preacher-curl-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-m-e-head\"/><use href=\"#preacher-curl-m-e-torso\"/><use href=\"#preacher-curl-m-e-thigh.r\"/><use href=\"#preacher-curl-m-e-kneecap.r\"/><use href=\"#preacher-curl-m-e-shank.r\"/><use href=\"#preacher-curl-m-e-foot.r\"/></g></g><path class=\"eq\" d=\"^38\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#preacher-curl-m-e-shcap.r\"/><use href=\"#preacher-curl-m-e-upper.r\"/><use href=\"#preacher-curl-m-e-elbowcap.r\"/><use href=\"#preacher-curl-m-e-fore.r\"/><use href=\"#preacher-curl-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#preacher-curl-m-e-shcap.r\"/><use href=\"#preacher-curl-m-e-upper.r\"/><use href=\"#preacher-curl-m-e-elbowcap.r\"/><use href=\"#preacher-curl-m-e-fore.r\"/><use href=\"#preacher-curl-m-e-fist.r\"/></g></g><path class=\"eq-line\" d=\"^39\"/><path class=\"eq-thin\" d=\"^40\"/><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq-pin\" d=\"^42\"/><circle class=\"joint\" cx=\"175.8\" cy=\"172.42\" r=\"2.25\"/><circle class=\"joint\" cx=\"208.88\" cy=\"206.67\" r=\"2.25\"/><circle class=\"joint\" cx=\"157.66\" cy=\"239.13\" r=\"2.25\"/><circle class=\"joint\" cx=\"212.45\" cy=\"269.63\" r=\"2.25\"/></g><mask id=\"preacher-curl-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#preacher-curl-m-m-head\" fill=\"#000\"/><use href=\"#preacher-curl-m-m-torso\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-shank.l\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-foot.l\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-upper.l\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-fore.l\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-fist.l\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-shank.r\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-foot.r\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-upper.r\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-fore.r\" fill=\"#000\"/><use href=\"#preacher-curl-m-mf-fist.r\" fill=\"#000\"/><use href=\"#preacher-curl-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#preacher-curl-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#preacher-curl-m-mmask)\"><g class=\"u-stroke\"><use href=\"#preacher-curl-m-m-head\"/><use href=\"#preacher-curl-m-m-torso\"/><use href=\"#preacher-curl-m-m-eq0\"/><use href=\"#preacher-curl-m-m-eq1\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MNztSEy1LJ4U1L4bL27L09L11L33L32L92L54L91L31L11L32L11L40L02L51Lf1L51L42Lc0Lk4Ls2LF14LN18LF16Lu2Lk4Lc0L11L71Lh5Lf3L33L11L11L10L11L11L02L80L82L22L11L93Lf5Ln7Lr7Lt7Lp5Ll5Lf3Lb9Lb3L37L35L17L9bL75L95L55L70L90L50L70L73L51L91L72L92L94Lb6L5aL34L94L72Lh4Lf1Ll0Lp3Lv1Lt0Ln1Lf0Lb0L32L40L80L80L02L10L10L10L12L52L10Lf0Lj1L90L02La4Lk4Lu6LF18LN18LA1aLu4Lk6Lc4L40L71Ld1L73L44L01L10L00L52L33L50L93L55L31L30L14L36L1cL2cL7aL98L58L28L28LcaLe8LkaLgcLecLacLc8La6Lc2Lc0La1La2L86Lc2Lc2La1Lg1Lc7Lg7Lm5Lk1Li5Lc1L87L27L37L59\"/><path class=\"m-line\" d=\"~MAUE1yHy1LV2PdL*4z2L-3X3Lx2*4L2I5Lw2*4L_3X3L(4z2LJ52L(4w2L_3_3Lw2(4L2J5Lx2(4L-3_3L*4w2\"/><path class=\"m-line\" d=\"~MHRE1SYx1LtR3L72L70L04L34L22L28L86L48L2aL44L06L20L12L01L15L26L6aL24L11L59L9fLfnLhrLlz1Ljx1LfnL7dL77L24L28L8mL6eL4aL14L24L04L02L02L11L37L33L13L06L66L4cLakLemLeoLciL8iL8cL4cL28L36L12L76L28L36L2aL24L26L24L64L04L26L26L42L48L42L84L84L61L61L60L48La8L6cL8iLamLcmLcqLagL8eL28L40L00L39L15L01L02L20L22L22L66L64LaeLaiLaaL01L15L7hL9pLhx1LhB1LdvLbnL5jL57L03L24L4aL44L31L03L02L20L42L28L66L4aL26L48L22L62L21L63L45L81L84L61L21L45L1bL2bL3fL1hL4bL2bL1bL17L19L53L77L13L19L17L37L75L75Lb5L95Lf7L9bLb7L75L70L30L34L08\"/><path class=\"m-line\" d=\"~MD!y1SWpL5A3L70L91L93L73Lb3L53L57L77L75L35L3bL37L39L19L07L0bL07L29L49L47L4bL45L85L87L47La3La3L83La3La1L80Lc0L80La2La4L84La4La4L48L88L84L4aL4aL48L4aL2aL08L0cL08L1aL3aL38L3aL3aL74L78L58L54Lb4L74L94L92L70\"/><path class=\"m-line\" d=\"~MJ!z1W.A1LD.1B-1\"/><path class=\"m-line\" d=\"~MYUz1_TA1LFfYf\"/><path class=\"m-line\" d=\"~M(OB1U_y1LFf_f\"/><path class=\"leader m\" d=\"M197.26 175.69L227 124H237\"/><path class=\"leader m\" d=\"M131.37 181.87L130.61 164H120.61\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"preacher-curl-m-lift\" data-key=\"lift\" data-cue=\"Your upper arms lift off the pad as you heave the bar.\" class=\"plate-callout two m\" style=\"left:64.8%;top:28.49%\" aria-pressed=\"true\">Arms off<br>pad</button><button type=\"button\" id=\"preacher-curl-m-heave\" data-key=\"heave\" data-cue=\"Your torso rocks back off the pad to swing the bar up.\" class=\"plate-callout two m\" style=\"left:7.82%;top:39.66%\" aria-pressed=\"false\">Torso<br>heaves back</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "armpits",
        cues: [{ key: "armpits", cue: "Sit with the pad top under your armpits and your chest on it." }, { key: "arms", cue: "Press the backs of your upper arms into the pad all the way up." }, { key: "wrists", cue: "Keep the hands in line with the forearms." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "lift",
        cues: [{ key: "lift", cue: "Your upper arms lift off the pad as you heave the bar." }, { key: "heave", cue: "Your torso rocks back off the pad to swing the bar up." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Arms off pad</b><span>Your upper arms lift off the pad as you heave the bar.</span></li><li><b>Torso heaves back</b><span>Your torso rocks back off the pad to swing the bar up.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: curl 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Curl</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Preacher curl, side view. Seated at a preacher bench with the chest against the pad and the backs of the upper arms on its sloped face, the lifter curls an EZ bar from nearly straight arms up toward the shoulders while the upper arms stay on the pad.",
      mistakeAlt: "Preacher Curl: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "curl",
    "orientation": "supinated",
    "handle": "ez-bend",
    "loadAxis": "across",
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
      "limitText": "Keep the hands in line with the forearms.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "CONVENTION"
        ],
        "sources": [
          "sl-preacher",
          "bb-preacher",
          "hand-key-ez"
        ],
        "note": "c8. The ext range is the ez key's wristRange (ga:curl-mid), a convention, not a card number."
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
    "gripLine": "Underhand grip on the curl bar.",
    "cue": "Wrist in line with the forearm."
  },
  contacts: [
    "pivot-pad"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set the seat so your chest and upper arms touch the pad.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-preacher"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "adjust",
      "text": "Pad top under your armpits, arms straight. Not so high you hunch.",
      "zoom": "preacher-pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-preacher",
          "sl-preacher"
        ],
        "note": "c2, c3"
      }
    },
    {
      "kind": "position",
      "text": "Feet flat on the floor. Upper body active, not hanging.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-preacher",
          "bb-preacher"
        ],
        "note": "c2, c9"
      }
    },
    {
      "kind": "grip",
      "text": "Take the bar with an underhand grip.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-preacher"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "load",
      "text": "Pick a weight you can lower under control.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-preacher"
        ],
        "note": "c6"
      }
    }
  ],
  posture: [
    {
      "key": "armpits",
      "label": "Armpits over pad",
      "detail": "Pad top under the armpits. Chest and upper arms on the pad.",
      "anchor": {
        "pose": "start",
        "at": "shoulder.r"
      },
      "zoom": "preacher-pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-preacher",
          "bb-preacher"
        ],
        "note": "c2"
      }
    },
    {
      "key": "arms",
      "label": "Arms on pad",
      "detail": "Backs of the upper arms stay pressed into the pad.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "zoom": "preacher-pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-preacher",
          "sl-preacher"
        ],
        "note": "c4"
      }
    },
    {
      "key": "active",
      "label": "Still, active body",
      "detail": "Body stays still, upper body active, not hanging on the pad.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-preacher",
          "sl-preacher"
        ],
        "note": "c4, c9"
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
          "sl-preacher",
          "bb-preacher"
        ],
        "note": "c8"
      }
    },
    {
      "key": "range",
      "label": "Long range",
      "detail": "Lower well past 90 degrees. Stop short if full straightening feels uncomfortable.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-preacher",
          "sl-preacher"
        ],
        "note": "c7"
      }
    },
    {
      "key": "slow",
      "label": "Slow lowering",
      "detail": "Lower slowly.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-preacher"
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
      "key": "preacher-pad",
      "chip": "Pad",
      "heading": "Arms on pad",
      "kind": "posture",
      "feelRow": "front-shoulder"
    }
  ],
  chips: [
    "hand",
    "preacher-pad",
    "feel"
  ],
  copy: {
    "setupLine": "Chest and upper arms on the pad, feet flat. Keep your upper body active, not hanging.",
    "mistakeLine": "Keep your upper arms on the pad, body still. Lower well past 90 degrees, under control.",
    "cueLine": "Arms pressed into the pad.",
    "variantLine": "Shown with the EZ bar, not the machine."
  },
  mistakes: [
    {
      "key": "arms-off",
      "title": "Upper arms leaving the pad",
      "zoom": "preacher-pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-preacher",
          "sl-preacher"
        ],
        "note": "c5, c4"
      },
      "fix": "Go lighter. Keep the arms on the pad, body still."
    },
    {
      "key": "seat",
      "title": "Seat too high or low",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-preacher",
          "sl-preacher"
        ],
        "note": "c3, c2"
      },
      "fix": "Reset it so the pad top sits under your armpits."
    },
    {
      "key": "drop",
      "title": "Dropping fast into the bottom",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-preacher",
          "sl-preacher"
        ],
        "note": "c6, c7"
      },
      "fix": "Lower slowly, past 90 degrees. Go lighter if you can't control it."
    }
  ],
  risks: [
    {
      "key": "heave",
      "text": "Heaving a heavy bar off the pad can put the front shoulder at risk.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-preacher"
        ],
        "note": "c5"
      }
    },
    {
      "key": "seat",
      "text": "A wrong seat height can shift stress onto the shoulder.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-preacher"
        ],
        "note": "c3"
      }
    },
    {
      "key": "tendon",
      "text": "Across many activities, most biceps tendon tears happened palm-up, elbow nearly straight.",
      "claim": {
        "tags": [
          "WEAK"
        ],
        "sources": [
          "jukes-2022"
        ],
        "note": "c13"
      }
    }
  ],
  riskFlags: [
    "shoulder",
    "elbow",
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
    "bb-preacher",
    "sl-preacher",
    "oliveira-2009",
    "nunes-2020",
    "kassiano-2025",
    "jukes-2022",
    "acsm-2009",
    "hand-key-ez",
    "nhs-wrist-pain",
    "nhs-shoulder-pain",
    "nhs-elbow-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/preacher_curl.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

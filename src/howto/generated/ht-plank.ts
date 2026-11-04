// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=ca2f206d7cb49773ca915ba67760e97b0054798a885ba463293b544a251cf2e0
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_plank",
  name: "Plank",
  hashes: { inputsSha256: "ca2f206d7cb49773ca915ba67760e97b0054798a885ba463293b544a251cf2e0", golden: "6f7e82190f975b620d641ca3a096032bfb8e7ebe7f7d5ba72ba4309e3ddffa6d" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"plank-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"plank-n-st-thigh.l\" d=\"~#F12HPB1FO.1OFE1VP.1Del4O1XH2V3U8w8D4Y3W(1W9WpPh(nP2YsVbF)1U3w5V2yaB6.G2*b3P1WdU3!hOz1VK1xvOH1R4BT1!k00000110001200010010010101002001000000000002200100000000000000100110000100000010\"/><path id=\"plank-n-st-kneecap.l\" d=\"~~yxlw-!1JV11\"/><path id=\"plank-n-st-shank.l\" d=\"~#F12F!myy.1XToKJ.1_dU35P1BI2B2S8A8J4W3YO2w4DfJaFeP1wh)6!N2!cw5X2yax6*G2Vd4O1FejGcVgOrXiXpX2.uSc00200000000000000021011000101000001100000000000000000001100000110100000001000000\"/><path id=\"plank-n-st-foot.l\" d=\"~#o2yR9AG_1EVaGx.1x5_eW7WlYp(w1R5UH3YdT_2PdXJ1N2KsG1.R1Jg*bFaHz1)rEt100101000000101210002001001010010021010011000000\"/><path id=\"plank-n-st-torso\" d=\"~#_12Y*W1(zP1BKY1KBO1T2OdT2X2)6!mU2Pd)2FoFb(9FaxI1Bh.X1z9)by7WiH9Ao!kJpHmNj_b!4Hi-aWE1zz1HvTfwH1Tq_9OY2-X2N(1B4J9-3RhBk*6)m!b3YaDkU1z4J9Tw3zJ120000101000020200000100011000010111000200000000200000000001010022011100000100100200000000011110001001010000000100101\"/><path id=\"plank-n-st-thigh.r\" d=\"^0\"/><path id=\"plank-n-st-kneecap.r\" d=\"^1\"/><path id=\"plank-n-st-shank.r\" d=\"^2\"/><path id=\"plank-n-st-foot.r\" d=\"^3\"/><path id=\"plank-n-g0-torso\" d=\"~#_12DTY1J_P1BF_1)DP1gVdx2G3-b_kbYdE8(mW7waHi-x1O7BP1V8)cF7SiW9woDlwpWmAj!bY4DizbyE1-z1Av*fDtOhSbG(1-z2WH1z6H84)hBiBb)oS6R2PaNj(5z6F8RU2Bw200200011111002200001000000210102100010001000001000012000000110000012000000200000000000200100000121000020010001010100\"/><path id=\"plank-n-g0-thigh.r\" d=\"~#F12w_A1AE-1zSD1KA-1weX14O1-H2Y1A9N7P4J3D)1y5(qUfwoo!r-dH)1t_4z3S9-6OH2R63P1weS2DfTA1XO1Vr-H1I1KR1Po10100120000210000000100121020010000100000200000000200000102101121020000200000010\"/><path id=\"plank-n-g0-kneecap.r\" d=\"~~yOkNT.1JV11\"/><path id=\"plank-n-g0-shank.r\" d=\"~#F12DDmD!-1E(nOy_1weU23P1xI2J3y9J7U4N3!O2.1(fF9FeeNgB8WO2y7Y4z3S9-6XH2B82O1AeX1KdTf.s-g-pn*tYe20000010020000001000202000000001111010200000001000000000000100000001010200101100\"/><path id=\"plank-n-g0-foot.r\" d=\"~#o2P_8_y_1BwaRY_1x4Dfw9AlysyvS1_H3S7I.2PaOK1iTsV4RR1PfzdWcUy1)tEr010101110001211000111000000000000200000002020000\"/><path id=\"plank-n-g1-torso\" d=\"~#_12YR-1(*R1VG.1TWR1N3EdE1V3xgYhK3Hd)cUkA4A9Do-mgVD1B8-dU7Jiwa(nUlUo(m_i(bS4wiIbPD1IA1(uOgWe*aY7EA1.I1NrX7Y6w4RhEf.e.pw1X4U9UhyaX7W6OA2xR200000001011010101001000001010010000000012000202001010110101001010001000002000200202000200020000200000021010100200001\"/><path id=\"plank-n-g1-thigh.r\" d=\"~#F12UzA1P)W1K.B1XYW1(dX21K1OH2A7W9Y6Y4A3J)1c(rUdyox1YqVfA)1V5P4K3y9K7XH2z10N1yeU1ScVB1VR1xoXH1W1TO1ys01000000000000220000000100101001000010110100100000210011000002000200000001110001\"/><path id=\"plank-n-g1-kneecap.r\" d=\"~~S)j!K_1JV11\"/><path id=\"plank-n-g1-shank.r\" d=\"~#F12USlWWY1)Hn.YY1AeS12P1VH2!8U9W6_4A3SO2X7Sgy8Feh_fI9(O2D1P4K3A9O7BI2X21K1(dX2OeXe)tOe.py1Xs(g00010100000002000000002000000000001010000000000020000010101010000102001000000120\"/><path id=\"plank-n-g1-foot.r\" d=\"~#o2_F8Y!-1.O9*O_1x3NfNaPkyuAtW8JH3P1R.2J7BN1G1Rsx8BR1Uexe(eWx1VvEp101010120000001010220001210000000000002000000000\"/><path id=\"plank-n-e-thigh.l\" d=\"~#F12HKz1HYU1KAB1KKU1Ud-35O1VG2Ucyaw6w5Y2F)1B4!sPb!n-2SpThS(1EaF4X3N8z8TH2J44N1Aei_9KD1IT1OkOH1!4IK1Pv10100100010022000000022000002001002200200000000000002000100000000200000022000202\"/><path id=\"plank-n-e-kneecap.l\" d=\"~~PSjFF-1JV11\"/><path id=\"plank-n-e-shank.l\" d=\"~#F12SxlJRX1*-mKOX1Dei6N1.G2HeAaw6y5W2WN2KdDh_6AeV1AfKaYO2V4H4X3P8z8BI2Y25K1Yd-3RfOd)uIcVp!2KrAj01000101000000000001000200000000110000000002001000121010102000020020000001000200\"/><path id=\"plank-n-e-foot.l\" d=\"~#o2!.7WW-1zA9BE_1)1SfYbYj(vyr!fSG3V4O.2F4ON1E3KsGbRP1Ud*eDhPw1Ix1)m002101000000000000020002101000101000000000000000\"/><path id=\"plank-n-e-shcap.l\" d=\"~~W*R1YYV1D-11\"/><path id=\"plank-n-e-upper.l\" d=\"~#F12W*R1YYV1-(R1BNU1iVac2_2UY1Y3)6Y1T3!6-K1(bGm0Tj*bGm.6-K1X1T3X3)6-2UY1d2fVaEjB1IgJu0YqHgJu00010100001110020001000000001000000000001000110002101100000121200000110000111000\"/><path id=\"plank-n-e-elbowcap.l\" d=\"~~(JS1D.w2(G11\"/><path id=\"plank-n-e-fore.l\" d=\"~#F12PUT1(Dy2ITS1Rxy2xcV2F2p!T1I1.a-4V2x2BE1T2-e)8GdlTfH7EE1R1*2Y1GbU3NT1!6D2A1GcH1rycUmYdNkA1woEb00000100000110000000000000100000200000200000010000000000020001011100020000002002\"/><path id=\"plank-n-e-palm.l\" d=\"~#o2DN!1UKw2V._1X-)1_a-azaO2-iY4Koz6KgrVobOiv*9E6Fag(H1Eq(jy1201000000100101010110000002100200000010000000000\"/><path id=\"plank-n-e-head\" d=\"~#w12PR)1PKU1*V)1TOS1Gpzk*dKlF2Tdz6B3!8X6Ac*aAo*nYfw4DbB3R2XmFgwpSaWprwpKg!o.mo0101000101000000000000001001111002000020000002000020011010000000\"/><path id=\"plank-n-e-torso\" d=\"~#_12AX-1FGT1GO.1GNT1F6Ecb-3Tj_dB6AcEhJhsU7Sr*aJ6OrI7Oe!7FiHaYnymHoAnPiwcJ4(hVb!B1.A1Yu*gtT7E1GbEhFh)8(4Y7EgTb.hOpX4X6N8yfUdx9(4BR1B(200010021011000010000020200000100120000012001000120021012000020020000001011000010000020000000100010011000020210101120\"/><path id=\"plank-n-e-thigh.r\" d=\"^15\"/><path id=\"plank-n-e-kneecap.r\" d=\"^16\"/><path id=\"plank-n-e-shank.r\" d=\"^17\"/><path id=\"plank-n-e-foot.r\" d=\"^18\"/><path id=\"plank-n-e-shcap.r\" d=\"^19\"/><path id=\"plank-n-e-upper.r\" d=\"^20\"/><path id=\"plank-n-e-elbowcap.r\" d=\"^21\"/><path id=\"plank-n-e-fore.r\" d=\"^22\"/><path id=\"plank-n-e-palm.r\" d=\"^23\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#plank-n-dots)\"/>\n  <path class=\"datum\" d=\"M302.78 272.13L-16.39 298.96\"/><path class=\"floorline\" d=\"M16 339.5H301.72\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#plank-n-st-thigh.l\"/><use href=\"#plank-n-st-kneecap.l\"/><use href=\"#plank-n-st-shank.l\"/><use href=\"#plank-n-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#plank-n-st-thigh.l\"/><use href=\"#plank-n-st-kneecap.l\"/><use href=\"#plank-n-st-shank.l\"/><use href=\"#plank-n-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#plank-n-st-torso\"/><use href=\"#plank-n-st-thigh.r\"/><use href=\"#plank-n-st-kneecap.r\"/><use href=\"#plank-n-st-shank.r\"/><use href=\"#plank-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#plank-n-st-torso\"/><use href=\"#plank-n-st-thigh.r\"/><use href=\"#plank-n-st-kneecap.r\"/><use href=\"#plank-n-st-shank.r\"/><use href=\"#plank-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#plank-n-g0-torso\"/><use href=\"#plank-n-g0-thigh.r\"/><use href=\"#plank-n-g0-kneecap.r\"/><use href=\"#plank-n-g0-shank.r\"/><use href=\"#plank-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#plank-n-g0-torso\"/><use href=\"#plank-n-g0-thigh.r\"/><use href=\"#plank-n-g0-kneecap.r\"/><use href=\"#plank-n-g0-shank.r\"/><use href=\"#plank-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#plank-n-g1-torso\"/><use href=\"#plank-n-g1-thigh.r\"/><use href=\"#plank-n-g1-kneecap.r\"/><use href=\"#plank-n-g1-shank.r\"/><use href=\"#plank-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#plank-n-g1-torso\"/><use href=\"#plank-n-g1-thigh.r\"/><use href=\"#plank-n-g1-kneecap.r\"/><use href=\"#plank-n-g1-shank.r\"/><use href=\"#plank-n-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#plank-n-e-thigh.l\"/><use href=\"#plank-n-e-kneecap.l\"/><use href=\"#plank-n-e-shank.l\"/><use href=\"#plank-n-e-foot.l\"/><use href=\"#plank-n-e-shcap.l\"/><use href=\"#plank-n-e-upper.l\"/><use href=\"#plank-n-e-elbowcap.l\"/><use href=\"#plank-n-e-fore.l\"/><use href=\"#plank-n-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#plank-n-e-thigh.l\"/><use href=\"#plank-n-e-kneecap.l\"/><use href=\"#plank-n-e-shank.l\"/><use href=\"#plank-n-e-foot.l\"/><use href=\"#plank-n-e-shcap.l\"/><use href=\"#plank-n-e-upper.l\"/><use href=\"#plank-n-e-elbowcap.l\"/><use href=\"#plank-n-e-fore.l\"/><use href=\"#plank-n-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#plank-n-e-head\"/><use href=\"#plank-n-e-torso\"/><use href=\"#plank-n-e-thigh.r\"/><use href=\"#plank-n-e-kneecap.r\"/><use href=\"#plank-n-e-shank.r\"/><use href=\"#plank-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#plank-n-e-head\"/><use href=\"#plank-n-e-torso\"/><use href=\"#plank-n-e-thigh.r\"/><use href=\"#plank-n-e-kneecap.r\"/><use href=\"#plank-n-e-shank.r\"/><use href=\"#plank-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#plank-n-e-shcap.r\"/><use href=\"#plank-n-e-upper.r\"/><use href=\"#plank-n-e-elbowcap.r\"/><use href=\"#plank-n-e-fore.r\"/><use href=\"#plank-n-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#plank-n-e-shcap.r\"/><use href=\"#plank-n-e-upper.r\"/><use href=\"#plank-n-e-elbowcap.r\"/><use href=\"#plank-n-e-fore.r\"/><use href=\"#plank-n-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"264.78\" cy=\"275.32\" r=\"2.25\"/><circle class=\"joint\" cx=\"264.78\" cy=\"332.03\" r=\"2.25\"/><circle class=\"joint\" cx=\"182.99\" cy=\"284.67\" r=\"2.25\"/><circle class=\"joint\" cx=\"108.78\" cy=\"293.16\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#y20_wB1HO*1-xB1XT*12110022110022110022110022110022110022110022110022110022110022110000000001000020000001000020000001000022000001000022000001000022000001000022000001000022000000000022000000000022000000000022000000000\"/><path class=\"arrow\" d=\"~MPYz1!WX1LHqUw1L*(1ToZ\"/></g><path class=\"leader\" d=\"~M!WT1YYV1L0EU9\"/><circle class=\"anchor\" cx=\"264.78\" cy=\"275.32\" r=\"1.5\"/><path class=\"leader\" d=\"~MFXy1P*S1L0X*8\"/><circle class=\"anchor\" cx=\"177.8\" cy=\"260.72\" r=\"1.5\"/><path class=\"leader\" d=\"~M!ElFF-1L0)W4\"/><circle class=\"anchor\" cx=\"108.78\" cy=\"293.16\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"plank-n-elbows\" data-key=\"elbows\" data-cue=\"Stack the shoulders right over the elbows, and don't shrug.\" class=\"plate-callout two\" style=\"left:57.54%;top:51.96%\" aria-pressed=\"true\">Elbows under<br>shoulders</button><button type=\"button\" id=\"plank-n-hips\" data-key=\"hips\" data-cue=\"Hold one line: no sagging low back and no hiked hips.\" class=\"plate-callout\" style=\"left:26.82%;top:50.84%\" aria-pressed=\"false\">Hips level</button><button type=\"button\" id=\"plank-n-knees\" data-key=\"knees\" data-cue=\"Keep the legs straight and stiff through the whole hold.\" class=\"plate-callout\" style=\"left:6.7%;top:65.92%\" aria-pressed=\"false\">Knees straight</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"plank-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"plank-m-st-thigh.l\" d=\"^0\"/><path id=\"plank-m-st-kneecap.l\" d=\"^1\"/><path id=\"plank-m-st-shank.l\" d=\"^2\"/><path id=\"plank-m-st-foot.l\" d=\"^3\"/><path id=\"plank-m-st-torso\" d=\"^4\"/><path id=\"plank-m-st-thigh.r\" d=\"^0\"/><path id=\"plank-m-st-kneecap.r\" d=\"^1\"/><path id=\"plank-m-st-shank.r\" d=\"^2\"/><path id=\"plank-m-st-foot.r\" d=\"^3\"/><path id=\"plank-m-g0-torso\" d=\"^5\"/><path id=\"plank-m-g0-thigh.r\" d=\"^6\"/><path id=\"plank-m-g0-kneecap.r\" d=\"^7\"/><path id=\"plank-m-g0-shank.r\" d=\"^8\"/><path id=\"plank-m-g0-foot.r\" d=\"^9\"/><path id=\"plank-m-g1-torso\" d=\"^10\"/><path id=\"plank-m-g1-thigh.r\" d=\"^11\"/><path id=\"plank-m-g1-kneecap.r\" d=\"^12\"/><path id=\"plank-m-g1-shank.r\" d=\"^13\"/><path id=\"plank-m-g1-foot.r\" d=\"^14\"/><path id=\"plank-m-e-thigh.l\" d=\"^15\"/><path id=\"plank-m-e-kneecap.l\" d=\"^16\"/><path id=\"plank-m-e-shank.l\" d=\"^17\"/><path id=\"plank-m-e-foot.l\" d=\"^18\"/><path id=\"plank-m-e-shcap.l\" d=\"^19\"/><path id=\"plank-m-e-upper.l\" d=\"^20\"/><path id=\"plank-m-e-elbowcap.l\" d=\"^21\"/><path id=\"plank-m-e-fore.l\" d=\"^22\"/><path id=\"plank-m-e-palm.l\" d=\"^23\"/><path id=\"plank-m-e-head\" d=\"^24\"/><path id=\"plank-m-e-torso\" d=\"^25\"/><path id=\"plank-m-e-thigh.r\" d=\"^15\"/><path id=\"plank-m-e-kneecap.r\" d=\"^16\"/><path id=\"plank-m-e-shank.r\" d=\"^17\"/><path id=\"plank-m-e-foot.r\" d=\"^18\"/><path id=\"plank-m-e-shcap.r\" d=\"^19\"/><path id=\"plank-m-e-upper.r\" d=\"^20\"/><path id=\"plank-m-e-elbowcap.r\" d=\"^21\"/><path id=\"plank-m-e-fore.r\" d=\"^22\"/><path id=\"plank-m-e-palm.r\" d=\"^23\"/><path id=\"plank-m-m-head\" d=\"~#w12FI)1!GY1Kzw2VPW1KhErG6-oU6Bc.4*4SaR3AfK6Nu.eYd!8Pbk(4KmH7(s_1Yrx9HnKnHi*lX61001000101200000100000002000102000000201001010020010110000000002\"/><path id=\"plank-m-m-torso\" d=\"~#_12PD_1PIV1x_.1KyW1(9R9oV3*mW6-9S9*l_aR1N7PtG1wfxoG2zgS1!jA2_p(cyuwgwpwaw8UkE5_O1VmSy1B6S1K7P2Bb*l!axaW1Sc.cG5TkRmXcx9_5_9YhzaY1Bg)F300000002000000000001110000000000200020020001111101100200001000000000000000200000020000000012100000000020000200000120\"/><path id=\"plank-m-m-thigh.l\" d=\"~#F12HAz1AUO1GYA1-(N1WcI6dG1*B2Sqybw4N5W1F*1IgSuU5!mE7UlImJ.1zmP3O4W6V9KF2!igH1wez2y2VE1GW1xa-F1wdID1WE101000100021111000000000020010000100020002220020101000000012200101001011110002020\"/><path id=\"plank-m-m-kneecap.l\" d=\"~~yNkF-W1JV11\"/><path id=\"plank-m-m-shank.l\" d=\"~#F12USlUAV1RGn-XU1weB2gN1VB2HsAb(3N5W1UH2RsyiN3WdI4WcEdNK2)jN3R4Y6R9BG2FhdK1YcG6*hGa-w1x6To!7Bn(n00100000200000002010100100100020011001000000000220002021012000000012000020010101\"/><path id=\"plank-m-m-foot.l\" d=\"~#o2YR9NG_1-VaXx.1B5!eU7WlWp(w1-5UH3(dR_2UdVJ1S2OsB1-R1Hg*bFaJz1*rGt100010010110000000000000001010000010100022000002\"/><path id=\"plank-m-m-thigh.r\" d=\"^35\"/><path id=\"plank-m-m-kneecap.r\" d=\"^36\"/><path id=\"plank-m-m-shank.r\" d=\"^37\"/><path id=\"plank-m-m-foot.r\" d=\"^38\"/><path id=\"plank-m-mf-shcap.l\" d=\"^19\"/><path id=\"plank-m-mf-upper.l\" d=\"^20\"/><path id=\"plank-m-mf-elbowcap.l\" d=\"^21\"/><path id=\"plank-m-mf-fore.l\" d=\"^22\"/><path id=\"plank-m-mf-palm.l\" d=\"^23\"/><path id=\"plank-m-mf-shcap.r\" d=\"^19\"/><path id=\"plank-m-mf-upper.r\" d=\"^20\"/><path id=\"plank-m-mf-elbowcap.r\" d=\"^21\"/><path id=\"plank-m-mf-fore.r\" d=\"^22\"/><path id=\"plank-m-mf-palm.r\" d=\"^23\"/><path id=\"plank-m-mo-0\" d=\"^24\"/><path id=\"plank-m-mo-1\" d=\"^25\"/><path id=\"plank-m-mo-2\" d=\"^15\"/><path id=\"plank-m-mo-3\" d=\"^16\"/><path id=\"plank-m-mo-4\" d=\"^17\"/><path id=\"plank-m-mo-5\" d=\"^18\"/><path id=\"plank-m-mo-6\" d=\"^19\"/><path id=\"plank-m-mo-7\" d=\"^20\"/><path id=\"plank-m-mo-8\" d=\"^21\"/><path id=\"plank-m-mo-9\" d=\"^22\"/><path id=\"plank-m-mo-10\" d=\"^23\"/><path id=\"plank-m-mo-11\" d=\"^15\"/><path id=\"plank-m-mo-12\" d=\"^16\"/><path id=\"plank-m-mo-13\" d=\"^17\"/><path id=\"plank-m-mo-14\" d=\"^18\"/><path id=\"plank-m-mo-15\" d=\"^19\"/><path id=\"plank-m-mo-16\" d=\"^20\"/><path id=\"plank-m-mo-17\" d=\"^21\"/><path id=\"plank-m-mo-18\" d=\"^22\"/><path id=\"plank-m-mo-19\" d=\"^23\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#plank-m-dots)\"/>\n  <path class=\"datum\" d=\"^26\"/><path class=\"floorline\" d=\"^27\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#plank-m-st-thigh.l\"/><use href=\"#plank-m-st-kneecap.l\"/><use href=\"#plank-m-st-shank.l\"/><use href=\"#plank-m-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#plank-m-st-thigh.l\"/><use href=\"#plank-m-st-kneecap.l\"/><use href=\"#plank-m-st-shank.l\"/><use href=\"#plank-m-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#plank-m-st-torso\"/><use href=\"#plank-m-st-thigh.r\"/><use href=\"#plank-m-st-kneecap.r\"/><use href=\"#plank-m-st-shank.r\"/><use href=\"#plank-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#plank-m-st-torso\"/><use href=\"#plank-m-st-thigh.r\"/><use href=\"#plank-m-st-kneecap.r\"/><use href=\"#plank-m-st-shank.r\"/><use href=\"#plank-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#plank-m-g0-torso\"/><use href=\"#plank-m-g0-thigh.r\"/><use href=\"#plank-m-g0-kneecap.r\"/><use href=\"#plank-m-g0-shank.r\"/><use href=\"#plank-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#plank-m-g0-torso\"/><use href=\"#plank-m-g0-thigh.r\"/><use href=\"#plank-m-g0-kneecap.r\"/><use href=\"#plank-m-g0-shank.r\"/><use href=\"#plank-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#plank-m-g1-torso\"/><use href=\"#plank-m-g1-thigh.r\"/><use href=\"#plank-m-g1-kneecap.r\"/><use href=\"#plank-m-g1-shank.r\"/><use href=\"#plank-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#plank-m-g1-torso\"/><use href=\"#plank-m-g1-thigh.r\"/><use href=\"#plank-m-g1-kneecap.r\"/><use href=\"#plank-m-g1-shank.r\"/><use href=\"#plank-m-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#plank-m-e-thigh.l\"/><use href=\"#plank-m-e-kneecap.l\"/><use href=\"#plank-m-e-shank.l\"/><use href=\"#plank-m-e-foot.l\"/><use href=\"#plank-m-e-shcap.l\"/><use href=\"#plank-m-e-upper.l\"/><use href=\"#plank-m-e-elbowcap.l\"/><use href=\"#plank-m-e-fore.l\"/><use href=\"#plank-m-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#plank-m-e-thigh.l\"/><use href=\"#plank-m-e-kneecap.l\"/><use href=\"#plank-m-e-shank.l\"/><use href=\"#plank-m-e-foot.l\"/><use href=\"#plank-m-e-shcap.l\"/><use href=\"#plank-m-e-upper.l\"/><use href=\"#plank-m-e-elbowcap.l\"/><use href=\"#plank-m-e-fore.l\"/><use href=\"#plank-m-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#plank-m-e-head\"/><use href=\"#plank-m-e-torso\"/><use href=\"#plank-m-e-thigh.r\"/><use href=\"#plank-m-e-kneecap.r\"/><use href=\"#plank-m-e-shank.r\"/><use href=\"#plank-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#plank-m-e-head\"/><use href=\"#plank-m-e-torso\"/><use href=\"#plank-m-e-thigh.r\"/><use href=\"#plank-m-e-kneecap.r\"/><use href=\"#plank-m-e-shank.r\"/><use href=\"#plank-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#plank-m-e-shcap.r\"/><use href=\"#plank-m-e-upper.r\"/><use href=\"#plank-m-e-elbowcap.r\"/><use href=\"#plank-m-e-fore.r\"/><use href=\"#plank-m-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#plank-m-e-shcap.r\"/><use href=\"#plank-m-e-upper.r\"/><use href=\"#plank-m-e-elbowcap.r\"/><use href=\"#plank-m-e-fore.r\"/><use href=\"#plank-m-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"264.78\" cy=\"275.32\" r=\"2.25\"/><circle class=\"joint\" cx=\"264.78\" cy=\"332.03\" r=\"2.25\"/><circle class=\"joint\" cx=\"182.99\" cy=\"284.67\" r=\"2.25\"/><circle class=\"joint\" cx=\"108.78\" cy=\"293.16\" r=\"2.25\"/></g><mask id=\"plank-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#plank-m-m-head\" fill=\"#000\"/><use href=\"#plank-m-m-torso\" fill=\"#000\"/><use href=\"#plank-m-m-thigh.l\" fill=\"#000\"/><use href=\"#plank-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#plank-m-m-shank.l\" fill=\"#000\"/><use href=\"#plank-m-m-foot.l\" fill=\"#000\"/><use href=\"#plank-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#plank-m-mf-upper.l\" fill=\"#000\"/><use href=\"#plank-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#plank-m-mf-fore.l\" fill=\"#000\"/><use href=\"#plank-m-mf-palm.l\" fill=\"#000\"/><use href=\"#plank-m-m-thigh.r\" fill=\"#000\"/><use href=\"#plank-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#plank-m-m-shank.r\" fill=\"#000\"/><use href=\"#plank-m-m-foot.r\" fill=\"#000\"/><use href=\"#plank-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#plank-m-mf-upper.r\" fill=\"#000\"/><use href=\"#plank-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#plank-m-mf-fore.r\" fill=\"#000\"/><use href=\"#plank-m-mf-palm.r\" fill=\"#000\"/><use href=\"#plank-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#plank-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#plank-m-mmask)\"><g class=\"u-stroke\"><use href=\"#plank-m-m-head\"/><use href=\"#plank-m-m-torso\"/><use href=\"#plank-m-m-thigh.l\"/><use href=\"#plank-m-m-kneecap.l\"/><use href=\"#plank-m-m-shank.l\"/><use href=\"#plank-m-m-foot.l\"/><use href=\"#plank-m-m-thigh.r\"/><use href=\"#plank-m-m-kneecap.r\"/><use href=\"#plank-m-m-shank.r\"/><use href=\"#plank-m-m-foot.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MWXz1DTX1LP8*E5MNh!pLKh.pLR2!R1\"/><path class=\"leader m\" d=\"M187.16 233.45L186.19 162H176.19\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"plank-m-hike\" data-key=\"hike\" data-cue=\"The hips hike up above the shoulder-heel line.\" class=\"plate-callout m\" style=\"left:30.73%;top:39.11%\" aria-pressed=\"true\">Hips hike</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "Stack the shoulders right over the elbows, and don't shrug." }, { key: "hips", cue: "Hold one line: no sagging low back and no hiked hips." }, { key: "knees", cue: "Keep the legs straight and stiff through the whole hold." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "hike",
        cues: [{ key: "hike", cue: "The hips hike up above the shoulder-heel line." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Hips hike</b><span>The hips hike up above the shoulder-heel line.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: hold 10–60 seconds\"><div class=\"tempo-seg\" style=\"flex:10–60 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>10–60 s</span></div></div></div>",
      alt: "Forearm plank, side view. From lying face down propped on the forearms, elbows under the shoulders and toes tucked, the hips lift until the body forms one straight line from the head to the heels, knees straight, shoulders over the elbows.",
      mistakeAlt: "Plank: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP (b2): the card archetype.hand is none (forearm plank); its handContact (c1) is on the setup line."
  },
  contacts: [
    "floor-body"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Lie face down, elbows under your shoulders, palms down.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-plank"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "brace",
      "text": "Straighten your legs, pull your toes up, brace your trunk.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-plank"
        ],
        "note": "card c2"
      }
    },
    {
      "kind": "position",
      "text": "Lift slowly, trunk and legs stiff.",
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-plank"
        ],
        "note": "card c3"
      }
    },
    {
      "kind": "position",
      "text": "Hold for the set time and keep breathing.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-plank"
        ],
        "note": "card c6"
      }
    },
    {
      "kind": "finish",
      "text": "Lower yourself down with the body still stiff.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-plank"
        ],
        "note": "card c7"
      }
    }
  ],
  posture: [
    {
      "key": "shoulders",
      "label": "Shoulders over elbows",
      "detail": "Shoulders over the elbows, no shrug.",
      "anchor": {
        "pose": "end",
        "at": "shoulder.r"
      },
      "zoom": "shoulder-stack",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-plank"
        ],
        "note": "card c5"
      }
    },
    {
      "key": "hips",
      "label": "Hips level",
      "detail": "The low back does not sag, and the hips are not hiked. Don't bend at your hips. Brace your trunk. Can't hold it? Rest on your knees.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-plank",
          "harvard-plank"
        ],
        "note": "card c4, c13, c2, c14"
      }
    },
    {
      "key": "knees",
      "label": "Knees straight",
      "detail": "Knees straight.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-plank"
        ],
        "note": "card c4"
      }
    },
    {
      "key": "harder",
      "label": "Harder version",
      "detail": "Tilt the pelvis backward and draw the shoulder blades together.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "cortell-2017"
        ],
        "note": "card c11"
      }
    }
  ],
  zooms: [
    {
      "key": "hip-line",
      "chip": "Hip line",
      "heading": "Hip line",
      "kind": "posture"
    },
    {
      "key": "shoulder-stack",
      "chip": "Shoulders",
      "heading": "Shoulder stack",
      "kind": "posture"
    }
  ],
  chips: [
    "hip-line",
    "shoulder-stack",
    "feel"
  ],
  copy: {
    "setupLine": "Elbows under your shoulders, palms down. Lift slowly and keep trunk and legs stiff.",
    "mistakeLine": "Keep the hips level: no sagging low back, no hiked hips.",
    "cueLine": "Shoulders over elbows, hips level."
  },
  mistakes: [],
  risks: [
    {
      "key": "sag",
      "text": "Low back sagging (arching) during the hold. Can't hold it? Rest on your knees.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-plank",
          "harvard-plank"
        ],
        "note": "card c4, c14"
      }
    },
    {
      "key": "back-pain",
      "text": "Low-back pain during the hold: stop.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-plank"
        ],
        "note": "card c8"
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
    "ace-plank",
    "schoenfeld-2014",
    "cortell-2017",
    "harvard-plank",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/plank.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=127a5cd33535ec1414146ec8202423fc413abb3ccf8ab60c0292d308eed7c3f3
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_rope_triceps_pushdown",
  name: "Rope Triceps Pushdown",
  hashes: { inputsSha256: "127a5cd33535ec1414146ec8202423fc413abb3ccf8ab60c0292d308eed7c3f3", golden: "011653bb9934915c32da9ddf07b9edea32a0ad3b2b8d749e954eb9556dbc2a06" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"rope-triceps-pushdown-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"rope-triceps-pushdown-n-st-fore.l\" d=\"~#F12(wsHSE1GGrBUE1X86J1x1Fz1xaG8X1E2v*pU4Tc*3zay2GaH8XpS5T1Y1z7Y4PA1*3U1cz8F3dP9Njw6Nfx3Yf-c10000001002000000002000120002000121000022001000000000101100000101001000100000001\"/><path id=\"rope-triceps-pushdown-n-st-fist.l\" d=\"~~N)y1U(A1Ft2\"/><path id=\"rope-triceps-pushdown-n-st-fore.r\" d=\"^0\"/><path id=\"rope-triceps-pushdown-n-st-fist.r\" d=\"^1\"/><path id=\"rope-triceps-pushdown-n-g0-fore.r\" d=\"~#F12YRrYRE1*_q-FE1B8X3Y19FB1W6*6E5T1*1XqT7X9)8.9X2.cA3xr.6G2sV8A1Uz1YcJ1D1)8rX3U8_e(dDfy4_jV400020000110011000101000000021001202002010001001210100100002001200000000101000000\"/><path id=\"rope-triceps-pushdown-n-g0-fist.r\" d=\"~~AAz1WXF1Ft2\"/><path id=\"rope-triceps-pushdown-n-g1-fore.r\" d=\"~#F12(ArDIE1KTqB-D1x6)6W1i!vDmI4X7jO2xm-i)4Ec.7R6)cV2RmziO25R8-2_rArqU1)7T4R6S6U7!iAcya!jy401000210100000000200001010000000000121000020001000000000002000000002101200001000\"/><path id=\"rope-triceps-pushdown-n-g1-fist.r\" d=\"~~!Tx1HzJ1Ft2\"/><path id=\"rope-triceps-pushdown-n-g2-fore.r\" d=\"~#F12F!qDwE1KTqEFD1X2)8N1D1Dk!x1nx9aO2Xc.qeBdR4E9-aV7OdKqG2E1T6z6SeWA14_1O5V7O8_3nFky7DePgYb20220000000010210110100120000010111110000012100002000000000101000200100002000000\"/><path id=\"rope-triceps-pushdown-n-g2-fist.r\" d=\"~~__uHON1Ft2\"/><path id=\"rope-triceps-pushdown-n-e-thigh.l\" d=\"~#F12WYnHGH1GOnB)F1B3Kaz16ybHY1J4-7y2.3K4OP1H8GmR2IixeEj)8XO1*2E3K6G6Y4D-1A134.aVtX6VeYE1N4Sw1ypFy101101001011110000020000001200001000000002200001010010102100002002021001010012000\"/><path id=\"rope-triceps-pushdown-n-e-kneecap.l\" d=\"~~WDqSyV1wG11\"/><path id=\"rope-triceps-pushdown-n-e-shank.l\" d=\"~#F12HBqS)U1.IqXUT1P2Vay16aW-1w6-6W2I3y1G*1S7*bo*aV5*cY7-!1B2X3)4R7R8y-1z10r)aKc!9XdUlK1_jPaNn01200012000100000100100000000000012100110000020000000000022100000200000000020000\"/><path id=\"rope-triceps-pushdown-n-e-foot.l\" d=\"~#o2J.pHG)1OIqxJ(1Yb(2ygG7Nn*l(R2*2ED2I4zz1I7.l2zD1J4EaVbJqEaKkJn120000101000000000010001002000000000000020210000\"/><path id=\"rope-triceps-pushdown-n-e-shcap.l\" d=\"~~UVqYxu!I12\"/><path id=\"rope-triceps-pushdown-n-e-upper.l\" d=\"~#F12WVqUwuKXqxwtmz880y1NI1w3G5N1T2D6)y1U9.gcxfX8GhG4Ez1E1X2-2O5E3JI1915x8-eO1zdynfSk!bUn00000001000100000002200100001010000000010000001010002001010200100002002000000010\"/><path id=\"rope-triceps-pushdown-n-e-elbowcap.l\" d=\"~~F_qFRD1Dw10\"/><path id=\"rope-triceps-pushdown-n-e-fore.l\" d=\"~#F12_YqWSD1K_q)YB1D1K9mW1w5PE1_2V8J1B2rzuY5*bdEaX6IbX1xuR1x2R3K8O1_E1jY1)1G9E96-8HikYfNaNh00020010102000101000100000000000000000100010000000100000120010000000000000012020\"/><path id=\"rope-triceps-pushdown-n-e-fist.l\" d=\"~~SGr_NO1Ft2\"/><path id=\"rope-triceps-pushdown-n-e-head\" d=\"~#w12H*sYWk)NrRIkOiWg*h_7zaO3z3F4)3O7X6Ta)eGl(4Kbt.8RhrwlB9Yk-4_iw4_gPfI2Nh0100000101010000200022200000000000000000001101011010000000200101\"/><path id=\"rope-triceps-pushdown-n-e-torso\" d=\"~#_12DHrF)oBVrGVn.8B9B7)1_5yhF7y9U8UgJ5F1hGmxhIaGcP2AfG2WjB3HmRbAiXdU5x8B5OfEkIz1R6xqG6!1G5_1S9DbS1_7BaO9*fW5z9Hg(4gy8K6N2UcRK2Fp00200000020101000012000002101000000000210100000010100020000000010001011000100011110020000100002000101000000200020000\"/><path id=\"rope-triceps-pushdown-n-e-thigh.r\" d=\"^8\"/><path id=\"rope-triceps-pushdown-n-e-kneecap.r\" d=\"^9\"/><path id=\"rope-triceps-pushdown-n-e-shank.r\" d=\"^10\"/><path id=\"rope-triceps-pushdown-n-e-foot.r\" d=\"^11\"/><path id=\"rope-triceps-pushdown-n-e-shcap.r\" d=\"^12\"/><path id=\"rope-triceps-pushdown-n-e-upper.r\" d=\"^13\"/><path id=\"rope-triceps-pushdown-n-e-elbowcap.r\" d=\"^14\"/><path id=\"rope-triceps-pushdown-n-e-fore.r\" d=\"^15\"/><path id=\"rope-triceps-pushdown-n-e-fist.r\" d=\"^16\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#rope-triceps-pushdown-n-dots)\"/>\n  <path class=\"floorline\" d=\"M71.97 338.83H286.03\"/><path class=\"eq\" d=\"~MUYB1Syy2L!Ac0QF60T(bE6LE6xiQ0E6E6yiLT(bF6QE60U(bF6LF6yiQ0F6F6xiZ\"/><path class=\"eq\" d=\"~MNJD1DBaLwEc0QJ90T*bI9LI9xmQ0I9I9ymLT*bJ9QI90U*bJ9LJ9ymQ0J9J9xmZ\"/><path class=\"eq\" d=\"~MwDF1DBaL0(.2\"/><path class=\"eq\" d=\"~MY-K1DBaL0UT2\"/><path class=\"eq\" d=\"~MW.H1Syy2LHt0QF60xnE6LE6THX1Q0E6E6UHX1LxnF6QE60ynF6LF6UHX1Q0F6F6THX1Z\"/><path class=\"eq\" d=\"~MyVR1Syy2LHt0QF60xnE6LE6THX1Q0E6E6UHX1LxnF6QE60ynF6LF6UHX1Q0F6F6THX1Z\"/><path class=\"eq-solid\" d=\"~~JwE1AxdUB10\"/><path class=\"eq-pin\" d=\"~~Y)E1AxdF60\"/><path class=\"eq-solid\" d=\"~~P!J1_YcFt2\"/><path class=\"eq-pin\" d=\"~~PTK1_YcF60\"/><path class=\"eq-cable\" d=\"~MwDF1P.bLYT50\"/><path class=\"eq-thin\" d=\"~MDKK1JPw2L0GJR1\"/><path class=\"eq-thin\" d=\"~M_wP1JPw2L0GJR1\"/><path class=\"eq\" d=\"~MJ_J1Syy2LH-30QF60xT3E6LE6KvQ0E6E6NvLxT3F6QE60yT3F6LF6NvQ0F6F6KvZ\"/><path class=\"eq\" d=\"~MAUJ1DG.1L_B40L-B4DE5L-B4BE5Z\"/><path class=\"eq-thin\" d=\"M228.5 326.96H249.91M228.5 323.61H249.91M228.5 320.27H249.91M228.5 316.93H249.91M228.5 313.58H249.91M228.5 310.24H249.91M228.5 306.89H249.91\"/><path class=\"arc measure\" d=\"M142.47 197.32L142.94 179.33A18 18 0 0 1 143.25 215.3Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-n-st-fore.l\"/><use href=\"#rope-triceps-pushdown-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-n-st-fore.l\"/><use href=\"#rope-triceps-pushdown-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-n-st-fore.r\"/><use href=\"#rope-triceps-pushdown-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-n-st-fore.r\"/><use href=\"#rope-triceps-pushdown-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-cable\" d=\"~MSwE1A*cLEI2Awm\"/><path class=\"eq-solid\" d=\"~#H12_)A1J(y1V)A1V-x1T29.15I15W1-clUiDbIv)7A4T7B8*1G3qK8W2X2D9K6(6W5V3*w1pWiY1*cI13.1591_iWD1000001011101010010000010100200002000000000002001010100000010100100000000210000200010\"/><path class=\"eq-solid\" d=\"^38\"/><path class=\"eq-solid\" d=\"~My)A1!wy1LF2FH1L.sxK1LWB1xD1Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-n-g0-fore.r\"/><use href=\"#rope-triceps-pushdown-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-n-g0-fore.r\"/><use href=\"#rope-triceps-pushdown-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-cable\" d=\"~MYwE1_.cLXW3H_p\"/><path class=\"eq-solid\" d=\"~#H12NUz1UXD1EVz1IVB1V2b-19K15A2*bE1Nhwc.sx8S3I7x8*1z3D1-7U2O2J9R5_6S5.2.uE1JhA2*bK17-15b3Yh(A1121010000000000002020001000220000000000020100200200000000200000020010000020100000000\"/><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq-solid\" d=\"~M_Uz1A_B1LmHH1LBrxN1LyE1VA1Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-n-g1-fore.r\"/><use href=\"#rope-triceps-pushdown-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-n-g1-fore.r\"/><use href=\"#rope-triceps-pushdown-n-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-cable\" d=\"~MDxE1D-cLXE6!.s\"/><path class=\"eq-solid\" d=\"~#H12Yzx1HXG1GDx1OYF1R2h-1bK17Y2VaB2UfNd*oE8J2*6-7V1*2N1)6!2x2P9E4S6W5I1Bsx2UfW2VaK17-1b91_fYy1000000200202000101100000000001000000000000002010000220000020000111001202000001200000\"/><path class=\"eq-solid\" d=\"^44\"/><path class=\"eq-solid\" d=\"~MDDx1!-F1LG2HH1L-n)O1LPG1Xx1Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-n-g2-fore.r\"/><use href=\"#rope-triceps-pushdown-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-n-g2-fore.r\"/><use href=\"#rope-triceps-pushdown-n-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MAUJ1JDE1L_B40L-B4FE5L-B4EE5Z\"/><path class=\"eq-thin\" d=\"M228.5 224.11H249.91M228.5 220.77H249.91M228.5 217.42H249.91M228.5 214.08H249.91M228.5 210.73H249.91M228.5 207.39H249.91M228.5 204.04H249.91\"/><path class=\"eq-cable\" d=\"~MwXN1_YcL0SKq\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-n-e-thigh.l\"/><use href=\"#rope-triceps-pushdown-n-e-kneecap.l\"/><use href=\"#rope-triceps-pushdown-n-e-shank.l\"/><use href=\"#rope-triceps-pushdown-n-e-foot.l\"/><use href=\"#rope-triceps-pushdown-n-e-shcap.l\"/><use href=\"#rope-triceps-pushdown-n-e-upper.l\"/><use href=\"#rope-triceps-pushdown-n-e-elbowcap.l\"/><use href=\"#rope-triceps-pushdown-n-e-fore.l\"/><use href=\"#rope-triceps-pushdown-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-n-e-thigh.l\"/><use href=\"#rope-triceps-pushdown-n-e-kneecap.l\"/><use href=\"#rope-triceps-pushdown-n-e-shank.l\"/><use href=\"#rope-triceps-pushdown-n-e-foot.l\"/><use href=\"#rope-triceps-pushdown-n-e-shcap.l\"/><use href=\"#rope-triceps-pushdown-n-e-upper.l\"/><use href=\"#rope-triceps-pushdown-n-e-elbowcap.l\"/><use href=\"#rope-triceps-pushdown-n-e-fore.l\"/><use href=\"#rope-triceps-pushdown-n-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"~MyyE1(VcLET9WYu\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-n-e-head\"/><use href=\"#rope-triceps-pushdown-n-e-torso\"/><use href=\"#rope-triceps-pushdown-n-e-thigh.r\"/><use href=\"#rope-triceps-pushdown-n-e-kneecap.r\"/><use href=\"#rope-triceps-pushdown-n-e-shank.r\"/><use href=\"#rope-triceps-pushdown-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-n-e-head\"/><use href=\"#rope-triceps-pushdown-n-e-torso\"/><use href=\"#rope-triceps-pushdown-n-e-thigh.r\"/><use href=\"#rope-triceps-pushdown-n-e-kneecap.r\"/><use href=\"#rope-triceps-pushdown-n-e-shank.r\"/><use href=\"#rope-triceps-pushdown-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~#H12!YtYRI1-!tTXH1O2n-1jI1bD3-8-2AdHe-jB8A1O6O7R1-2_1-5!2I1U9O2A6S50EoX2Ady3-8G1bX1hb3weWv020022000100000121000000100022000200000000200000000101020000000000000000210001000000\"/><path class=\"eq-solid\" d=\"^50\"/><path class=\"eq-solid\" d=\"~M(*tWUH1Lx6!G1LOj-R1LJJ1)tZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-n-e-shcap.r\"/><use href=\"#rope-triceps-pushdown-n-e-upper.r\"/><use href=\"#rope-triceps-pushdown-n-e-elbowcap.r\"/><use href=\"#rope-triceps-pushdown-n-e-fore.r\"/><use href=\"#rope-triceps-pushdown-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-n-e-shcap.r\"/><use href=\"#rope-triceps-pushdown-n-e-upper.r\"/><use href=\"#rope-triceps-pushdown-n-e-elbowcap.r\"/><use href=\"#rope-triceps-pushdown-n-e-fore.r\"/><use href=\"#rope-triceps-pushdown-n-e-fist.r\"/></g></g><path class=\"eq-line datum\" d=\"~MSxsyRtL0Ayl\"/><circle class=\"joint\" cx=\"143.61\" cy=\"153.88\" r=\"2.25\"/><circle class=\"joint\" cx=\"142.47\" cy=\"197.32\" r=\"2.25\"/><circle class=\"joint\" cx=\"132.84\" cy=\"214.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"140.74\" cy=\"271.77\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#y20_BA1WBE1KBA1R.D1R13112002O1d221100I1f010201E1l011220z1t120122x1x1201000nB1120102lG1022112000210111000002002000020000110000002000000002001200000010010120000200010101101000000010000100000002000001000100010010100020020000200\"/><path class=\"arrow\" d=\"~M(RtJNO1LWqGw1LObSy2Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M142.94 179.33A18 18 0 0 1 143.25 215.3\"/><g class=\"arc-ticks\"><path d=\"~MY!r_-z1LN1EY1\"/><path d=\"~MF(rWFG1LN2DY1\"/></g><path class=\"leader\" d=\"~MNXvDPD1LOYc*I2\"/></g></g><path class=\"leader\" d=\"M142.47 197.32L119.65 166H109.65\"/><circle class=\"anchor\" cx=\"142.47\" cy=\"197.32\" r=\"1.5\"/><path class=\"leader\" d=\"~MWzsHDK1L*Y7W3\"/><circle class=\"anchor\" cx=\"143.95\" cy=\"231.41\" r=\"1.5\"/><path class=\"leader\" d=\"M143.61 259.07L106.4 278H96.4\"/><circle class=\"anchor\" cx=\"143.61\" cy=\"259.07\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"rope-triceps-pushdown-n-elbows\" data-key=\"elbows\" data-cue=\"Keep the upper arms at the sides from top to bottom.\" class=\"plate-callout\" style=\"left:10.06%;top:40.22%\" aria-pressed=\"true\">Elbows in</button><button type=\"button\" id=\"rope-triceps-pushdown-n-wrists\" data-key=\"wrists\" data-cue=\"Keep the hands in line with the forearms, fists not curled.\" class=\"plate-callout two\" style=\"left:10.06%;top:58.66%\" aria-pressed=\"false\">Straight<br>wrists</button><button type=\"button\" id=\"rope-triceps-pushdown-n-vertical\" data-key=\"vertical\" data-cue=\"At the bottom, line up the wrist, elbow and shoulder vertically.\" class=\"plate-callout two\" style=\"left:8.38%;top:71.51%\" aria-pressed=\"false\">Vertical<br>finish</button><span class=\"plate-arc-label\" style=\"left:9.5%;top:49.72%\"><b>Elbow</b><span>not locked</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"rope-triceps-pushdown-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"rope-triceps-pushdown-m-st-fore.l\" d=\"^0\"/><path id=\"rope-triceps-pushdown-m-st-fist.l\" d=\"^1\"/><path id=\"rope-triceps-pushdown-m-st-fore.r\" d=\"^0\"/><path id=\"rope-triceps-pushdown-m-st-fist.r\" d=\"^1\"/><path id=\"rope-triceps-pushdown-m-g0-fore.r\" d=\"^2\"/><path id=\"rope-triceps-pushdown-m-g0-fist.r\" d=\"^3\"/><path id=\"rope-triceps-pushdown-m-g1-fore.r\" d=\"^4\"/><path id=\"rope-triceps-pushdown-m-g1-fist.r\" d=\"^5\"/><path id=\"rope-triceps-pushdown-m-g2-fore.r\" d=\"^6\"/><path id=\"rope-triceps-pushdown-m-g2-fist.r\" d=\"^7\"/><path id=\"rope-triceps-pushdown-m-e-thigh.l\" d=\"^8\"/><path id=\"rope-triceps-pushdown-m-e-kneecap.l\" d=\"^9\"/><path id=\"rope-triceps-pushdown-m-e-shank.l\" d=\"^10\"/><path id=\"rope-triceps-pushdown-m-e-foot.l\" d=\"^11\"/><path id=\"rope-triceps-pushdown-m-e-shcap.l\" d=\"^12\"/><path id=\"rope-triceps-pushdown-m-e-upper.l\" d=\"^13\"/><path id=\"rope-triceps-pushdown-m-e-elbowcap.l\" d=\"^14\"/><path id=\"rope-triceps-pushdown-m-e-fore.l\" d=\"^15\"/><path id=\"rope-triceps-pushdown-m-e-fist.l\" d=\"^16\"/><path id=\"rope-triceps-pushdown-m-e-head\" d=\"^17\"/><path id=\"rope-triceps-pushdown-m-e-torso\" d=\"^18\"/><path id=\"rope-triceps-pushdown-m-e-thigh.r\" d=\"^8\"/><path id=\"rope-triceps-pushdown-m-e-kneecap.r\" d=\"^9\"/><path id=\"rope-triceps-pushdown-m-e-shank.r\" d=\"^10\"/><path id=\"rope-triceps-pushdown-m-e-foot.r\" d=\"^11\"/><path id=\"rope-triceps-pushdown-m-e-shcap.r\" d=\"^12\"/><path id=\"rope-triceps-pushdown-m-e-upper.r\" d=\"^13\"/><path id=\"rope-triceps-pushdown-m-e-elbowcap.r\" d=\"^14\"/><path id=\"rope-triceps-pushdown-m-e-fore.r\" d=\"^15\"/><path id=\"rope-triceps-pushdown-m-e-fist.r\" d=\"^16\"/><path id=\"rope-triceps-pushdown-m-m-head\" d=\"~#w12PYB1DBp.UA1RBozoy6OjR1I7X7V4D21O8tOcE3*pY9V7H3G8xfx9_m_1SkP5_eHcS7SlIaHe0002000020001001000002002200001002010100101010110000000100001000\"/><path id=\"rope-triceps-pushdown-m-m-torso\" d=\"~#_12HIy1YBsVFz1.BrT3GcG5z5.2_hy2Jb1Yiw6D4w7*nXezoxbI5WcJ8YgYaNoJ6Sm(1U9E2P6xfU8VE1Pc.nD3RbK9-mxe!w1G2S7O4xd-gR2VfAaD4Y2ya-1X3DcEP2xe01011000000101000002000200200000000020111001202000100000200100100020010000200000021012100110110000010000000101000000\"/><path id=\"rope-triceps-pushdown-m-m-eq0\" d=\"~#H12JYD1Y)H1VUD1OOH1T20-11O10gO5y1_7A8)dR7!1I8E3G2O12V3J2G1P8x3P7F2*6Iey1(7eR5I10.1190NmWg012000210100000021000100020000000200010000200100010000000210101111000011011010101001\"/><path id=\"rope-triceps-pushdown-m-m-eq1\" d=\"^64\"/><path id=\"rope-triceps-pushdown-m-m-eq2\" d=\"~MyVD1JyH1L!5(G1LTw1KH1LFy1BG1Z\"/><path id=\"rope-triceps-pushdown-m-m-eq3\" d=\"~MyyE1NwdLRiA)tLDfB)tL(lx)tZ\"/><path id=\"rope-triceps-pushdown-m-mf-thigh.l\" d=\"~#F12U)lSXH1VRlVNG1G4xax1aAhYW1S3E8S1x4V9VO1Y5BnO4.hzgThBeON1I3.2)6T5wbNY1A1bx1XaEuO3GaDG1y8_vUsHv00000000000000000000200000010000200000101000100000000000010000200010111110012000\"/><path id=\"rope-triceps-pushdown-m-mf-kneecap.l\" d=\"~~_SpWxV1wG11\"/><path id=\"rope-triceps-pushdown-m-mf-shank.l\" d=\"~#F12JRpwxV1RVp.VT1!1-aA12P3U-1P5x7U2R3I2G*1(6Gc4)aK6RcN4z*1K2T3I5G7I5N-1B12K1.a*bPaKcHmd(j_bYm00210000000002100220000021010111001110100010100010000110100100000000001010200000\"/><path id=\"rope-triceps-pushdown-m-mf-foot.l\" d=\"^11\"/><path id=\"rope-triceps-pushdown-m-mf-shcap.l\" d=\"~~WEvDwx1!I12\"/><path id=\"rope-triceps-pushdown-m-mf-upper.l\" d=\"~#F12wGvSVw1VRvxWvH2-7a0K8!H1y4V4y2E2Sd.w1ydKeU3TeX4.iN3Iz1l)2K1*5VcWG171S1x8zeK4-hSj)4(jP6Wp00001001001200111120021010111000010100020000000020000100000100000001000101000002\"/><path id=\"rope-triceps-pushdown-m-mf-elbowcap.l\" d=\"~~SRtHFG1Dw10\"/><path id=\"rope-triceps-pushdown-m-mf-fore.l\" d=\"~#F12NxuYBH1GJt*WG1O7*5_18JA1Pg)5)6x1I2Eq*eB7Bb*8*4Gd5RqGeR2ax9I1Dx1AmA1J1*8z3T4w8wbAh_dU7Fk800001010000220100001000010101000000001000000000001101000000020000000000000000000\"/><path id=\"rope-triceps-pushdown-m-mf-fist.l\" d=\"~~(NB1ATK1Ft2\"/><path id=\"rope-triceps-pushdown-m-mf-thigh.r\" d=\"^67\"/><path id=\"rope-triceps-pushdown-m-mf-kneecap.r\" d=\"^68\"/><path id=\"rope-triceps-pushdown-m-mf-shank.r\" d=\"^69\"/><path id=\"rope-triceps-pushdown-m-mf-foot.r\" d=\"^11\"/><path id=\"rope-triceps-pushdown-m-mf-shcap.r\" d=\"^70\"/><path id=\"rope-triceps-pushdown-m-mf-upper.r\" d=\"^71\"/><path id=\"rope-triceps-pushdown-m-mf-elbowcap.r\" d=\"^72\"/><path id=\"rope-triceps-pushdown-m-mf-fore.r\" d=\"^73\"/><path id=\"rope-triceps-pushdown-m-mf-fist.r\" d=\"^74\"/><path id=\"rope-triceps-pushdown-m-mo-0\" d=\"^17\"/><path id=\"rope-triceps-pushdown-m-mo-1\" d=\"^18\"/><path id=\"rope-triceps-pushdown-m-mo-2\" d=\"^8\"/><path id=\"rope-triceps-pushdown-m-mo-3\" d=\"^9\"/><path id=\"rope-triceps-pushdown-m-mo-4\" d=\"^10\"/><path id=\"rope-triceps-pushdown-m-mo-5\" d=\"^11\"/><path id=\"rope-triceps-pushdown-m-mo-6\" d=\"^12\"/><path id=\"rope-triceps-pushdown-m-mo-7\" d=\"^13\"/><path id=\"rope-triceps-pushdown-m-mo-8\" d=\"^14\"/><path id=\"rope-triceps-pushdown-m-mo-9\" d=\"^15\"/><path id=\"rope-triceps-pushdown-m-mo-10\" d=\"^16\"/><path id=\"rope-triceps-pushdown-m-mo-11\" d=\"^8\"/><path id=\"rope-triceps-pushdown-m-mo-12\" d=\"^9\"/><path id=\"rope-triceps-pushdown-m-mo-13\" d=\"^10\"/><path id=\"rope-triceps-pushdown-m-mo-14\" d=\"^11\"/><path id=\"rope-triceps-pushdown-m-mo-15\" d=\"^12\"/><path id=\"rope-triceps-pushdown-m-mo-16\" d=\"^13\"/><path id=\"rope-triceps-pushdown-m-mo-17\" d=\"^14\"/><path id=\"rope-triceps-pushdown-m-mo-18\" d=\"^15\"/><path id=\"rope-triceps-pushdown-m-mo-19\" d=\"^16\"/><path id=\"rope-triceps-pushdown-m-mo-20\" d=\"^20\"/><path id=\"rope-triceps-pushdown-m-mo-21\" d=\"^21\"/><path id=\"rope-triceps-pushdown-m-mo-22\" d=\"^24\"/><path id=\"rope-triceps-pushdown-m-mo-23\" d=\"^25\"/><path id=\"rope-triceps-pushdown-m-mo-24\" d=\"^26\"/><path id=\"rope-triceps-pushdown-m-mo-25\" d=\"^27\"/><path id=\"rope-triceps-pushdown-m-mo-26\" d=\"^28\"/><path id=\"rope-triceps-pushdown-m-mo-27\" d=\"^29\"/><path id=\"rope-triceps-pushdown-m-mo-28\" d=\"^33\"/><path id=\"rope-triceps-pushdown-m-mo-29\" d=\"^34\"/><path id=\"rope-triceps-pushdown-m-mo-30\" d=\"^46\"/><path id=\"rope-triceps-pushdown-m-mo-31\" d=\"^50\"/><path id=\"rope-triceps-pushdown-m-mo-32\" d=\"^50\"/><path id=\"rope-triceps-pushdown-m-mo-33\" d=\"^51\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#rope-triceps-pushdown-m-dots)\"/>\n  <path class=\"floorline\" d=\"^19\"/><path class=\"eq\" d=\"^20\"/><path class=\"eq\" d=\"^21\"/><path class=\"eq\" d=\"^22\"/><path class=\"eq\" d=\"^23\"/><path class=\"eq\" d=\"^24\"/><path class=\"eq\" d=\"^25\"/><path class=\"eq-solid\" d=\"^26\"/><path class=\"eq-pin\" d=\"^27\"/><path class=\"eq-solid\" d=\"^28\"/><path class=\"eq-pin\" d=\"^29\"/><path class=\"eq-cable\" d=\"^30\"/><path class=\"eq-thin\" d=\"^31\"/><path class=\"eq-thin\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq-thin\" d=\"^35\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-m-st-fore.l\"/><use href=\"#rope-triceps-pushdown-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-m-st-fore.l\"/><use href=\"#rope-triceps-pushdown-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-m-st-fore.r\"/><use href=\"#rope-triceps-pushdown-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-m-st-fore.r\"/><use href=\"#rope-triceps-pushdown-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-cable\" d=\"^37\"/><path class=\"eq-solid\" d=\"^38\"/><path class=\"eq-solid\" d=\"^38\"/><path class=\"eq-solid\" d=\"^39\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-m-g0-fore.r\"/><use href=\"#rope-triceps-pushdown-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-m-g0-fore.r\"/><use href=\"#rope-triceps-pushdown-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-cable\" d=\"^40\"/><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq-solid\" d=\"^42\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-m-g1-fore.r\"/><use href=\"#rope-triceps-pushdown-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-m-g1-fore.r\"/><use href=\"#rope-triceps-pushdown-m-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-cable\" d=\"^43\"/><path class=\"eq-solid\" d=\"^44\"/><path class=\"eq-solid\" d=\"^44\"/><path class=\"eq-solid\" d=\"^45\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-m-g2-fore.r\"/><use href=\"#rope-triceps-pushdown-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-m-g2-fore.r\"/><use href=\"#rope-triceps-pushdown-m-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^46\"/><path class=\"eq-thin\" d=\"^47\"/><path class=\"eq-cable\" d=\"^48\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-m-e-thigh.l\"/><use href=\"#rope-triceps-pushdown-m-e-kneecap.l\"/><use href=\"#rope-triceps-pushdown-m-e-shank.l\"/><use href=\"#rope-triceps-pushdown-m-e-foot.l\"/><use href=\"#rope-triceps-pushdown-m-e-shcap.l\"/><use href=\"#rope-triceps-pushdown-m-e-upper.l\"/><use href=\"#rope-triceps-pushdown-m-e-elbowcap.l\"/><use href=\"#rope-triceps-pushdown-m-e-fore.l\"/><use href=\"#rope-triceps-pushdown-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-m-e-thigh.l\"/><use href=\"#rope-triceps-pushdown-m-e-kneecap.l\"/><use href=\"#rope-triceps-pushdown-m-e-shank.l\"/><use href=\"#rope-triceps-pushdown-m-e-foot.l\"/><use href=\"#rope-triceps-pushdown-m-e-shcap.l\"/><use href=\"#rope-triceps-pushdown-m-e-upper.l\"/><use href=\"#rope-triceps-pushdown-m-e-elbowcap.l\"/><use href=\"#rope-triceps-pushdown-m-e-fore.l\"/><use href=\"#rope-triceps-pushdown-m-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"^49\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-m-e-head\"/><use href=\"#rope-triceps-pushdown-m-e-torso\"/><use href=\"#rope-triceps-pushdown-m-e-thigh.r\"/><use href=\"#rope-triceps-pushdown-m-e-kneecap.r\"/><use href=\"#rope-triceps-pushdown-m-e-shank.r\"/><use href=\"#rope-triceps-pushdown-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-m-e-head\"/><use href=\"#rope-triceps-pushdown-m-e-torso\"/><use href=\"#rope-triceps-pushdown-m-e-thigh.r\"/><use href=\"#rope-triceps-pushdown-m-e-kneecap.r\"/><use href=\"#rope-triceps-pushdown-m-e-shank.r\"/><use href=\"#rope-triceps-pushdown-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^50\"/><path class=\"eq-solid\" d=\"^50\"/><path class=\"eq-solid\" d=\"^51\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-m-e-shcap.r\"/><use href=\"#rope-triceps-pushdown-m-e-upper.r\"/><use href=\"#rope-triceps-pushdown-m-e-elbowcap.r\"/><use href=\"#rope-triceps-pushdown-m-e-fore.r\"/><use href=\"#rope-triceps-pushdown-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#rope-triceps-pushdown-m-e-shcap.r\"/><use href=\"#rope-triceps-pushdown-m-e-upper.r\"/><use href=\"#rope-triceps-pushdown-m-e-elbowcap.r\"/><use href=\"#rope-triceps-pushdown-m-e-fore.r\"/><use href=\"#rope-triceps-pushdown-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"143.61\" cy=\"153.88\" r=\"2.25\"/><circle class=\"joint\" cx=\"142.47\" cy=\"197.32\" r=\"2.25\"/><circle class=\"joint\" cx=\"132.84\" cy=\"214.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"140.74\" cy=\"271.77\" r=\"2.25\"/></g><mask id=\"rope-triceps-pushdown-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#rope-triceps-pushdown-m-m-head\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-m-torso\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-shank.l\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-foot.l\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-upper.l\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-fore.l\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-fist.l\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-shank.r\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-foot.r\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-upper.r\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-fore.r\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mf-fist.r\" fill=\"#000\"/><use href=\"#rope-triceps-pushdown-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#rope-triceps-pushdown-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#rope-triceps-pushdown-m-mmask)\"><g class=\"u-stroke\"><use href=\"#rope-triceps-pushdown-m-m-head\"/><use href=\"#rope-triceps-pushdown-m-m-torso\"/><use href=\"#rope-triceps-pushdown-m-m-eq0\"/><use href=\"#rope-triceps-pushdown-m-m-eq1\"/><use href=\"#rope-triceps-pushdown-m-m-eq2\"/><use href=\"#rope-triceps-pushdown-m-m-eq3\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MwGvSVw1L-1!3Lc4L84L61L62L05L23L37L17L23L27L21L01L00L00L04L09L49L27L14L0aL5iL3sL5y1L9H1L7A1L5sL3gL0cL00L49L8dL2fL61L01L21L41L11L20L01L08L58L22L01L69L4dLalLanL8rL8lL8hL4fLabL47L83L61L83La7L63L89L45L27L05L07L07L63L27L25L09L17L3bL57L37L53L37L09L1dL2fL2jL4nL6pL2tL2lL2dL09L03L02L1aL16L21L10L01L00L05L11L13L4dL0hL27L01L5aL3iL7qL9D1LbD1L9y1L5sL7gL1cL12L23L4dL27L02L02L10L23L01L03L27L65L45L43L13L11L53L71Ld0L75L5bL73L50L92L5aLbcL7iLbeLfaL7aL7aL58L3cL1aL4aL38L58L1aL3aL2cL2cL4eL8eL4kL0kL2eL4cL68L62L80La7\"/><path class=\"m-line\" d=\"~M(RvHFG1LK2HcLO4.1LR3K3L-1R4L0.4L!1R4LN3K3LS4.1L!40LS4!1LN3N3L!1S4L0!4L-1S4LR3N3LO4!1\"/><path class=\"m-line\" d=\"~MNxuYBH1LP2F2L63L23L23L01L35L30L73L73L73L33L11L31L20L20L42L50L77L30L42L82Lg8LmaLueLA1iLueLoaLe8L84L23L95Lf9Ld9L35L13L31L13L10L20L00L82L42L42L13L51Lb7Lf9Ll9LlbLj7Ld7Ld5L57L55L15L41L07L15L37L33L33L33L50L31L31L11L55L30L31L71L72L52L54L12L34L91L71Lb7Lf7LhbLjdLl9Lf9Lb5L53L31L24L64L64L00L02L11L10L50L30L51Lf5Lh7L93L00L46LeaLmeLw1iLumLsgLkeLgaL84L24L31L75L53L64L00L02L01L50L33L91L53L55L33L50L12L32L16L08L34L70L34L16L24L4aL88LacLacL2cL8aL48L66L64L84L80L62L68L44L84La0L82Lc0Lc1Le1Lg4Lc2La0L63L21L05L15\"/><path class=\"m-line\" d=\"~MPGE1ATK1L1J1L12L10L10L10L11L10L11L10L31L00L30L01L11L10L13L00L13L32L03L01L10L13L21L30L23L31L21L11L01L01L03L20L13L01L01L01L21L01L23L20L11L23L00L21L23L22L03L40L03L20L01L41L00L40L21L20L21L00L41L20L20L40L02L41L00L40L22L21L42L00L22L20L22L40L00L42L02L20L04L40L02L22L22L20L04L20L14L22L22L02L22L02L02L02L14L20L04L02L02L12L22L32L22L32L24L10L14L00L02L32L12L00L14L10L12L02L30L00L32L10L12L10L12L11L12L10L10\"/><path class=\"m-arrow\" d=\"M134.77 108.64A108 108 0 0 1 183.87 126.51M178.93 127.28L183.87 126.51L181.75 121.99\"/><path class=\"leader m\" d=\"M146.93 166.96L97.98 152H87.98\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"rope-triceps-pushdown-m-lean\" data-key=\"lean\" data-cue=\"You lean far over the rope or arch your back to push it down.\" class=\"plate-callout two m\" style=\"left:7.82%;top:36.31%\" aria-pressed=\"true\">Leaning<br>over</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "Keep the upper arms at the sides from top to bottom." }, { key: "wrists", cue: "Keep the hands in line with the forearms, fists not curled." }, { key: "vertical", cue: "At the bottom, line up the wrist, elbow and shoulder vertically." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "lean",
        cues: [{ key: "lean", cue: "You lean far over the rope or arch your back to push it down." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Leaning over</b><span>You lean far over the rope or arch your back to push it down.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: press 1 second, hold 1 second, return 3 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:3 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>3 s</span></div></div></div>",
      alt: "Rope triceps pushdown, side view. Standing at a high cable tower with a slight forward lean, upper arms pinned at the sides, the lifter presses a rope from forearms just past level down in an arc to straight arms, the hands finishing beside the thighs with the rope ends apart.",
      mistakeAlt: "Rope Triceps Pushdown: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "push",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-ROPEPAIR: the approved rope pair draws the rope across the middle of the palm; card c2 puts the hand against the knob. The grip copy carries c2, c3 and c5.",
    "orientation": "neutral",
    "handle": "rope",
    "loadAxis": "across",
    "overBody": false,
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-rope",
          "ace-pushdown"
        ],
        "note": "card c2"
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "ext": [
        0,
        15
      ],
      "limitText": "Fist curling toward the forearm? Keep the wrist straight.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-rope",
          "ace-pushdown"
        ],
        "note": "card c5"
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
      "handle": {
        "profile": "rope",
        "axis": "across",
        "diameterMm": 28
      },
      "load": {
        "kind": "pull"
      }
    },
    "faults": [
      {
        "key": "curled",
        "label": "Wrist curled",
        "pose": {
          "wrist": {
            "ext": -30,
            "dev": 0
          }
        },
        "markers": [
          "lever-arc"
        ],
        "alt": "Wrist bent toward the palm as the rope is pushed down."
      }
    ],
    "gripLine": "Hold each rope end, hands against the knobs, palms facing. Spread the ends apart at the bottom.",
    "cue": "Hands against the rope knobs."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Fix the rope to the pulley at its top position.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-rope",
          "ace-pushdown"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "grip",
      "text": "Hold each end with your hand against the knob, thumbs wrapped.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-rope",
          "ace-pushdown"
        ],
        "note": "card c2"
      }
    },
    {
      "kind": "position",
      "text": "Stand facing the machine, feet hip-width or staggered, torso tall.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown",
          "sl-rope"
        ],
        "note": "card c10"
      }
    },
    {
      "kind": "position",
      "text": "Elbows at your sides, forearms just past parallel, shoulders down and back.",
      "zoom": "rope-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-rope",
          "ace-pushdown"
        ],
        "note": "card c6, c8, c11"
      }
    },
    {
      "kind": "load",
      "text": "Pick a weight you can move with control.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-rope"
        ],
        "note": "card c15"
      }
    }
  ],
  posture: [
    {
      "key": "elbows",
      "label": "Elbows in",
      "detail": "Elbows stay in at your sides.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "zoom": "rope-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-rope"
        ],
        "note": "card c6"
      }
    },
    {
      "key": "wrists",
      "label": "Straight wrists",
      "detail": "Wrists straight throughout.",
      "anchor": {
        "pose": "end",
        "at": "wrist.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-rope",
          "ace-pushdown"
        ],
        "note": "card c5"
      }
    },
    {
      "key": "torso",
      "label": "Torso tall",
      "detail": "Torso tall. Any lean comes from the hips, not an arched back.",
      "anchor": {
        "pose": "start",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown",
          "sl-rope"
        ],
        "note": "card c10"
      }
    },
    {
      "key": "shoulders",
      "label": "Shoulders down",
      "detail": "Shoulders down and back.",
      "anchor": {
        "pose": "start",
        "at": "shoulder.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown"
        ],
        "note": "card c11"
      }
    },
    {
      "key": "spread",
      "label": "Rope ends apart",
      "detail": "Bottom: rope ends spread apart, hands passing the thighs. Never hands jammed together, rope ends hitting the thighs.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-pushdown",
          "sl-rope"
        ],
        "note": "card c4"
      }
    },
    {
      "key": "soft",
      "label": "Elbows not locked",
      "detail": "Arms straight at the bottom, elbows not locked out.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-rope",
          "ace-pushdown"
        ],
        "note": "card c9"
      }
    }
  ],
  zooms: [
    {
      "key": "rope-elbow",
      "chip": "Elbows",
      "heading": "Elbow position",
      "kind": "posture"
    }
  ],
  chips: [
    "rope-elbow",
    "feel"
  ],
  copy: {
    "setupLine": "Rope on the top pulley, hands against the knobs. Elbows at your sides, shoulders down and back.",
    "mistakeLine": "Keep your elbows at your sides. Lean only from the hips, never by arching your back.",
    "cueLine": "Elbows in at your sides."
  },
  mistakes: [
    {
      "key": "lean",
      "title": "Leaning over or arching back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-rope",
          "ace-pushdown"
        ],
        "note": "card c12, c10"
      },
      "fix": "Stand taller. Tilt only from the hips."
    },
    {
      "key": "elbows-forward",
      "title": "Elbows drifting forward or out",
      "zoom": "rope-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown",
          "nfpt-rope"
        ],
        "note": "card c7, c6"
      },
      "fix": "Keep your elbows at your sides."
    },
    {
      "key": "too-high",
      "title": "Rope rising too high",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-rope"
        ],
        "note": "card c8"
      },
      "fix": "Stop when your forearms are just past parallel."
    }
  ],
  risks: [
    {
      "key": "lockout",
      "text": "Locking the elbows out hard at the bottom can injure the elbows.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nfpt-rope",
          "ace-pushdown"
        ],
        "note": "card c9"
      }
    },
    {
      "key": "lean",
      "text": "Leaning too far forward or arching strains the lower back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-rope"
        ],
        "note": "card c12"
      }
    },
    {
      "key": "weight",
      "text": "Too much weight moved with momentum can lead to injury.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-rope"
        ],
        "note": "card c15"
      }
    }
  ],
  riskFlags: [
    "elbow",
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
    "nfpt-rope",
    "ace-pushdown",
    "sl-rope",
    "sl-pushdown",
    "nhs-elbow-pain",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/rope_triceps_pushdown.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

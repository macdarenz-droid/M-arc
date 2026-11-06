// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=17ef8cfa025fede6e399c61f44cae5a6cf2a1947e3b38e2678c0d40be8f2e63e
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_triceps_pushdown",
  name: "Triceps Pushdown",
  hashes: { inputsSha256: "17ef8cfa025fede6e399c61f44cae5a6cf2a1947e3b38e2678c0d40be8f2e63e", golden: "fe8de46a6320306eb4ddac30471ddd7a504a0542da6ec7fcb9fc8e22dd1334d3" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"triceps-pushdown-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"triceps-pushdown-n-st-fore.l\" d=\"~#F12DPt(FE1R.sKYE1)7F5qT1_qKtK8N3R2cGmHk-cJ3R7w7B4ScXl!khS2)3D8Av-o_1j.5S7F6!6UjB5PbXaS6Ej00011010000000000000001012001010100020000000000101011000000010010000000100210001\"/><path id=\"triceps-pushdown-n-st-fist.l\" d=\"~~wKy1wKw1Ft2\"/><path id=\"triceps-pushdown-n-st-fore.r\" d=\"^0\"/><path id=\"triceps-pushdown-n-st-fist.r\" d=\"^1\"/><path id=\"triceps-pushdown-n-g0-fore.r\" d=\"~#F12D_s(RE1Ows.OE1K9I1W1nSE1E4R8)2E2O1zug-b*5EaaRbS6xuH1z2P1K8P3_E1w2W1mI9!14F9Diy9YfbUhBa00010000001002000010000002220002000000000000010000000100000200000020000022000000\"/><path id=\"triceps-pushdown-n-g0-fist.r\" d=\"~~!-A1DFD1Ft2\"/><path id=\"triceps-pushdown-n-g1-fore.r\" d=\"~#F12YzsDHE1-RrVXD1E6E7_1iSw1(mO4*7lR2*mOj*4Ic*7O6)cT2Kn)iR25V8*2SsYrqW1B8-4z6w7W7!iAcya(jw400000000200000200001000000010000021200000000000010000110021010100002000020010010\"/><path id=\"triceps-pushdown-n-g1-fist.r\" d=\"~~wYy1yEJ1Ft2\"/><path id=\"triceps-pushdown-n-e-thigh.l\" d=\"~#F12WYnHGH1GOnB)F1B3Kaz16ybHY1J4-7y2.3K4OP1H8GmR2IixeEj)8XO1*2E3K6G6Y4D-1A134.aVtX6VeYE1N4Sw1ypFy101101001011110000020000001200001000000002200001010010102100002002021001010012000\"/><path id=\"triceps-pushdown-n-e-kneecap.l\" d=\"~~WDqSyV1wG11\"/><path id=\"triceps-pushdown-n-e-shank.l\" d=\"~#F12HBqS)U1.IqXUT1P2Vay16aW-1w6-6W2I3y1G*1S7*bo*aV5*cY7-!1B2X3)4R7R8y-1z10r)aKc!9XdUlK1_jPaNn01200012000100000100100000000000012100110000020000000000022100000200000000020000\"/><path id=\"triceps-pushdown-n-e-foot.l\" d=\"~#o2J.pHG)1OIqxJ(1Yb(2ygG7Nn*l(R2*2ED2I4zz1I7.l2zD1J4EaVbJqEaKkJn120000101000000000010001002000000000000020210000\"/><path id=\"triceps-pushdown-n-e-shcap.l\" d=\"~~UVqYxu!I12\"/><path id=\"triceps-pushdown-n-e-upper.l\" d=\"~#F12_VqUBu-TqzBt9x883w6DI1N2X5w1X2F2Kz1U7.hE1)eVaEgG8Oy1R1R2G3B5S1NI174z1B8.eaKaJoY1NkSeDm01020000000020200100002000000020020000121000000000101000021001001002000000000000\"/><path id=\"triceps-pushdown-n-e-elbowcap.l\" d=\"~~y-rHPD1Dw10\"/><path id=\"triceps-pushdown-n-e-fore.l\" d=\"~#F12(XrNVD1VWrV.B12R9uU1F9YD1!1)8A1E2B4*tN4KcR1Bax8Ra*4Vt-1*1O4*7(2YE1dY1)2)8B9F1-6AjN2SfFcFg00001012100000000102000021200000100012022001010020000000010010000110100100000200\"/><path id=\"triceps-pushdown-n-e-fist.l\" d=\"~~WEtwIO1Ft2\"/><path id=\"triceps-pushdown-n-e-head\" d=\"~#w12H*sYWk)NrRIkOiWg*h_7zaO3z3F4)3O7X6Ta)eGl(4Kbt.8RhrwlB9Yk-4_iw4_gPfI2Nh0100000101010000200022200000000000000000001101011010000000200101\"/><path id=\"triceps-pushdown-n-e-torso\" d=\"~#_12DHrF)oBVrGVn.8B9B7)1_5yhF7y9U8UgJ5F1hGmxhIaGcP2AfG2WjB3HmRbAiXdU5x8B5OfEkIz1R6xqG6!1G5_1S9DbS1_7BaO9*fW5z9Hg(4gy8K6N2UcRK2Fp00200000020101000012000002101000000000210100000010100020000000010001011000100011110020000100002000101000000200020000\"/><path id=\"triceps-pushdown-n-e-thigh.r\" d=\"^6\"/><path id=\"triceps-pushdown-n-e-kneecap.r\" d=\"^7\"/><path id=\"triceps-pushdown-n-e-shank.r\" d=\"^8\"/><path id=\"triceps-pushdown-n-e-foot.r\" d=\"^9\"/><path id=\"triceps-pushdown-n-e-shcap.r\" d=\"^10\"/><path id=\"triceps-pushdown-n-e-upper.r\" d=\"^11\"/><path id=\"triceps-pushdown-n-e-elbowcap.r\" d=\"^12\"/><path id=\"triceps-pushdown-n-e-fore.r\" d=\"^13\"/><path id=\"triceps-pushdown-n-e-fist.r\" d=\"^14\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#triceps-pushdown-n-dots)\"/>\n  <path class=\"floorline\" d=\"M71.97 338.83H286.03\"/><path class=\"eq\" d=\"~MUYB1Syy2L!Ac0QF60T(bE6LE6xiQ0E6E6yiLT(bF6QE60U(bF6LF6yiQ0F6F6xiZ\"/><path class=\"eq\" d=\"~MNJD1DBaLwEc0QJ90T*bI9LI9xmQ0I9I9ymLT*bJ9QI90U*bJ9LJ9ymQ0J9J9xmZ\"/><path class=\"eq\" d=\"~MwDF1DBaL0(.2\"/><path class=\"eq\" d=\"~MY-K1DBaL0UT2\"/><path class=\"eq\" d=\"~MW.H1Syy2LHt0QF60xnE6LE6THX1Q0E6E6UHX1LxnF6QE60ynF6LF6UHX1Q0F6F6THX1Z\"/><path class=\"eq\" d=\"~MyVR1Syy2LHt0QF60xnE6LE6THX1Q0E6E6UHX1LxnF6QE60ynF6LF6UHX1Q0F6F6THX1Z\"/><path class=\"eq-solid\" d=\"~~JwE1AxdUB10\"/><path class=\"eq-pin\" d=\"~~Y)E1AxdF60\"/><path class=\"eq-solid\" d=\"~~P!J1_YcFt2\"/><path class=\"eq-pin\" d=\"~~PTK1_YcF60\"/><path class=\"eq-cable\" d=\"~MwDF1P.bLYT50\"/><path class=\"eq-thin\" d=\"~MDKK1JPw2L0GJR1\"/><path class=\"eq-thin\" d=\"~M_wP1JPw2L0GJR1\"/><path class=\"eq\" d=\"~MJ_J1Syy2LH-30QF60xT3E6LE6KvQ0E6E6NvLxT3F6QE60yT3F6LF6NvQ0F6F6KvZ\"/><path class=\"eq\" d=\"~MAUJ1DG.1L_B40L-B4DE5L-B4BE5Z\"/><path class=\"eq-thin\" d=\"M228.5 326.96H249.91M228.5 323.61H249.91M228.5 320.27H249.91M228.5 316.93H249.91M228.5 313.58H249.91M228.5 310.24H249.91M228.5 306.89H249.91\"/><path class=\"arc measure\" d=\"M147.4 197.17L145.83 179.24A18 18 0 0 1 150.15 214.96Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#triceps-pushdown-n-st-fore.l\"/><use href=\"#triceps-pushdown-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#triceps-pushdown-n-st-fore.l\"/><use href=\"#triceps-pushdown-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#triceps-pushdown-n-st-fore.r\"/><use href=\"#triceps-pushdown-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#triceps-pushdown-n-st-fore.r\"/><use href=\"#triceps-pushdown-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-solid\" d=\"~~NIB1DFD1Wb2\"/><path class=\"eq-cable\" d=\"~MDXB1DFD1LDG1*Fp\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#triceps-pushdown-n-g0-fore.r\"/><use href=\"#triceps-pushdown-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#triceps-pushdown-n-g0-fore.r\"/><use href=\"#triceps-pushdown-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-solid\" d=\"~~SGz1yEJ1Wb2\"/><path class=\"eq-cable\" d=\"~MHVz1yEJ1LFI3*Gv\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#triceps-pushdown-n-g1-fore.r\"/><use href=\"#triceps-pushdown-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#triceps-pushdown-n-g1-fore.r\"/><use href=\"#triceps-pushdown-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MAUJ1APB1L_B40L-B4FE5L-B4EE5Z\"/><path class=\"eq-thin\" d=\"M228.5 215.43H249.91M228.5 212.09H249.91M228.5 208.75H249.91M228.5 205.4H249.91M228.5 202.06H249.91M228.5 198.71H249.91M228.5 195.37H249.91\"/><path class=\"eq-cable\" d=\"~MwXN1_YcL0HXo\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#triceps-pushdown-n-e-thigh.l\"/><use href=\"#triceps-pushdown-n-e-kneecap.l\"/><use href=\"#triceps-pushdown-n-e-shank.l\"/><use href=\"#triceps-pushdown-n-e-foot.l\"/><use href=\"#triceps-pushdown-n-e-shcap.l\"/><use href=\"#triceps-pushdown-n-e-upper.l\"/><use href=\"#triceps-pushdown-n-e-elbowcap.l\"/><use href=\"#triceps-pushdown-n-e-fore.l\"/><use href=\"#triceps-pushdown-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#triceps-pushdown-n-e-thigh.l\"/><use href=\"#triceps-pushdown-n-e-kneecap.l\"/><use href=\"#triceps-pushdown-n-e-shank.l\"/><use href=\"#triceps-pushdown-n-e-foot.l\"/><use href=\"#triceps-pushdown-n-e-shcap.l\"/><use href=\"#triceps-pushdown-n-e-upper.l\"/><use href=\"#triceps-pushdown-n-e-elbowcap.l\"/><use href=\"#triceps-pushdown-n-e-fore.l\"/><use href=\"#triceps-pushdown-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#triceps-pushdown-n-e-head\"/><use href=\"#triceps-pushdown-n-e-torso\"/><use href=\"#triceps-pushdown-n-e-thigh.r\"/><use href=\"#triceps-pushdown-n-e-kneecap.r\"/><use href=\"#triceps-pushdown-n-e-shank.r\"/><use href=\"#triceps-pushdown-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#triceps-pushdown-n-e-head\"/><use href=\"#triceps-pushdown-n-e-torso\"/><use href=\"#triceps-pushdown-n-e-thigh.r\"/><use href=\"#triceps-pushdown-n-e-kneecap.r\"/><use href=\"#triceps-pushdown-n-e-shank.r\"/><use href=\"#triceps-pushdown-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~~F-twIO1Wb2\"/><path class=\"eq-cable\" d=\"~M(AuwIO1LU!8ETy1\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#triceps-pushdown-n-e-shcap.r\"/><use href=\"#triceps-pushdown-n-e-upper.r\"/><use href=\"#triceps-pushdown-n-e-elbowcap.r\"/><use href=\"#triceps-pushdown-n-e-fore.r\"/><use href=\"#triceps-pushdown-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#triceps-pushdown-n-e-shcap.r\"/><use href=\"#triceps-pushdown-n-e-upper.r\"/><use href=\"#triceps-pushdown-n-e-elbowcap.r\"/><use href=\"#triceps-pushdown-n-e-fore.r\"/><use href=\"#triceps-pushdown-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"143.61\" cy=\"153.88\" r=\"2.25\"/><circle class=\"joint\" cx=\"147.4\" cy=\"197.17\" r=\"2.25\"/><circle class=\"joint\" cx=\"132.84\" cy=\"214.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"140.74\" cy=\"271.77\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#H20wPA1Hxy1xHA1-Vx10120B2s122100E2g100021I24000020I2b201020E2n201020x2B1020021.1K1201022O1.1122102B1x2020000002000000212000021002000001000000001000002020000002001001100011011000100002001000120011111000000000101100002001210020000011010000020021010000000\"/><path class=\"arrow\" d=\"~MwKvDzO1LJqRw1L.aWy2Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M145.83 179.24A18 18 0 0 1 150.15 214.96\"/><g class=\"arc-ticks\"><path d=\"~MURsA-z1L*4)X1\"/><path d=\"~MUDt_DG1LS8SX1\"/></g><path class=\"leader\" d=\"~MHVw1HxD1L.XbNP5\"/></g></g><path class=\"leader\" d=\"M147.4 197.17L113.5 192H103.5\"/><circle class=\"anchor\" cx=\"147.4\" cy=\"197.17\" r=\"1.5\"/><path class=\"leader\" d=\"M124.96 161.5L124.14 146H114.14\"/><circle class=\"anchor\" cx=\"124.96\" cy=\"161.5\" r=\"1.5\"/><path class=\"leader\" d=\"~M_-tFzK1L0YAb\"/><circle class=\"anchor\" cx=\"152.61\" cy=\"230.92\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"triceps-pushdown-n-elbows\" data-key=\"elbows\" data-cue=\"Keep the upper arms against the sides so only the forearms move.\" class=\"plate-callout two\" style=\"left:12.85%;top:47.49%\" aria-pressed=\"true\">Elbows<br>pinned</button><button type=\"button\" id=\"triceps-pushdown-n-torso\" data-key=\"torso\" data-cue=\"Stay upright or tilt slightly from the hips, back not arched.\" class=\"plate-callout two\" style=\"left:18.44%;top:34.64%\" aria-pressed=\"false\">Tall<br>torso</button><button type=\"button\" id=\"triceps-pushdown-n-wrists\" data-key=\"wrists\" data-cue=\"Keep the hands in line with the forearms from top to bottom.\" class=\"plate-callout two\" style=\"left:41.34%;top:79.33%\" aria-pressed=\"false\">Neutral<br>wrists</button><span class=\"plate-arc-label\" style=\"left:12.29%;top:60.34%\"><b>Elbow</b><span>not locked</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"triceps-pushdown-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"triceps-pushdown-m-st-fore.l\" d=\"^0\"/><path id=\"triceps-pushdown-m-st-fist.l\" d=\"^1\"/><path id=\"triceps-pushdown-m-st-fore.r\" d=\"^0\"/><path id=\"triceps-pushdown-m-st-fist.r\" d=\"^1\"/><path id=\"triceps-pushdown-m-g0-fore.r\" d=\"^2\"/><path id=\"triceps-pushdown-m-g0-fist.r\" d=\"^3\"/><path id=\"triceps-pushdown-m-g1-fore.r\" d=\"^4\"/><path id=\"triceps-pushdown-m-g1-fist.r\" d=\"^5\"/><path id=\"triceps-pushdown-m-e-thigh.l\" d=\"^6\"/><path id=\"triceps-pushdown-m-e-kneecap.l\" d=\"^7\"/><path id=\"triceps-pushdown-m-e-shank.l\" d=\"^8\"/><path id=\"triceps-pushdown-m-e-foot.l\" d=\"^9\"/><path id=\"triceps-pushdown-m-e-shcap.l\" d=\"^10\"/><path id=\"triceps-pushdown-m-e-upper.l\" d=\"^11\"/><path id=\"triceps-pushdown-m-e-elbowcap.l\" d=\"^12\"/><path id=\"triceps-pushdown-m-e-fore.l\" d=\"^13\"/><path id=\"triceps-pushdown-m-e-fist.l\" d=\"^14\"/><path id=\"triceps-pushdown-m-e-head\" d=\"^15\"/><path id=\"triceps-pushdown-m-e-torso\" d=\"^16\"/><path id=\"triceps-pushdown-m-e-thigh.r\" d=\"^6\"/><path id=\"triceps-pushdown-m-e-kneecap.r\" d=\"^7\"/><path id=\"triceps-pushdown-m-e-shank.r\" d=\"^8\"/><path id=\"triceps-pushdown-m-e-foot.r\" d=\"^9\"/><path id=\"triceps-pushdown-m-e-shcap.r\" d=\"^10\"/><path id=\"triceps-pushdown-m-e-upper.r\" d=\"^11\"/><path id=\"triceps-pushdown-m-e-elbowcap.r\" d=\"^12\"/><path id=\"triceps-pushdown-m-e-fore.r\" d=\"^13\"/><path id=\"triceps-pushdown-m-e-fist.r\" d=\"^14\"/><path id=\"triceps-pushdown-m-m-head\" d=\"~#w12PYB1DBp.UA1RBozoy6OjR1I7X7V4D21O8tOcE3*pY9V7H3G8xfx9_m_1SkP5_eHcS7SlIaHe0002000020001001000002002200001002010100101010110000000100001000\"/><path id=\"triceps-pushdown-m-m-torso\" d=\"~#_12HIy1YBsVFz1.BrT3GcG5z5.2_hy2Jb1Yiw6D4w7*nXezoxbI5WcJ8YgYaNoJ6Sm(1U9E2P6xfU8VE1Pc.nD3RbK9-mxe!w1G2S7O4xd-gR2VfAaD4Y2ya-1X3DcEP2xe01011000000101000002000200200000000020111001202000100000200100100020010000200000021012100110110000010000000101000000\"/><path id=\"triceps-pushdown-m-m-shcap.r\" d=\"~~WEvDwx1!I12\"/><path id=\"triceps-pushdown-m-m-upper.r\" d=\"~#F12wGvSVw1VRvxWvH2-7a0K8!H1y4V4y2E2Sd.w1ydKeU3TeX4.iN3Iz1l)2K1*5VcWG171S1x8zeK4-hSj)4(jP6Wp00001001001200111120021010111000010100020000000020000100000100000001000101000002\"/><path id=\"triceps-pushdown-m-m-elbowcap.r\" d=\"~~SRtHFG1Dw10\"/><path id=\"triceps-pushdown-m-m-fore.r\" d=\"~#F12NxuYBH1GJt*WG1O7*5_18JA1Pg)5)6x1I2Eq*eB7Bb*8*4Gd5RqGeR2ax9I1Dx1AmA1J1*8z3T4w8wbAh_dU7Fk800001010000220100001000010101000000001000000000001101000000020000000000000000000\"/><path id=\"triceps-pushdown-m-m-fist.r\" d=\"~~(NB1ATK1Ft2\"/><path id=\"triceps-pushdown-m-m-eq0\" d=\"~~PwD1ATK1Wb2\"/><path id=\"triceps-pushdown-m-mf-thigh.l\" d=\"~#F12U)lSXH1VRlVNG1G4xax1aAhYW1S3E8S1x4V9VO1Y5BnO4.hzgThBeON1I3.2)6T5wbNY1A1bx1XaEuO3GaDG1y8_vUsHv00000000000000000000200000010000200000101000100000000000010000200010111110012000\"/><path id=\"triceps-pushdown-m-mf-kneecap.l\" d=\"~~_SpWxV1wG11\"/><path id=\"triceps-pushdown-m-mf-shank.l\" d=\"~#F12JRpwxV1RVp.VT1!1-aA12P3U-1P5x7U2R3I2G*1(6Gc4)aK6RcN4z*1K2T3I5G7I5N-1B12K1.a*bPaKcHmd(j_bYm00210000000002100220000021010111001110100010100010000110100100000000001010200000\"/><path id=\"triceps-pushdown-m-mf-foot.l\" d=\"^9\"/><path id=\"triceps-pushdown-m-mf-shcap.l\" d=\"^55\"/><path id=\"triceps-pushdown-m-mf-upper.l\" d=\"^56\"/><path id=\"triceps-pushdown-m-mf-elbowcap.l\" d=\"^57\"/><path id=\"triceps-pushdown-m-mf-fore.l\" d=\"^58\"/><path id=\"triceps-pushdown-m-mf-fist.l\" d=\"^59\"/><path id=\"triceps-pushdown-m-mf-thigh.r\" d=\"^61\"/><path id=\"triceps-pushdown-m-mf-kneecap.r\" d=\"^62\"/><path id=\"triceps-pushdown-m-mf-shank.r\" d=\"^63\"/><path id=\"triceps-pushdown-m-mf-foot.r\" d=\"^9\"/><path id=\"triceps-pushdown-m-mo-0\" d=\"^15\"/><path id=\"triceps-pushdown-m-mo-1\" d=\"^16\"/><path id=\"triceps-pushdown-m-mo-2\" d=\"^6\"/><path id=\"triceps-pushdown-m-mo-3\" d=\"^7\"/><path id=\"triceps-pushdown-m-mo-4\" d=\"^8\"/><path id=\"triceps-pushdown-m-mo-5\" d=\"^9\"/><path id=\"triceps-pushdown-m-mo-6\" d=\"^10\"/><path id=\"triceps-pushdown-m-mo-7\" d=\"^11\"/><path id=\"triceps-pushdown-m-mo-8\" d=\"^12\"/><path id=\"triceps-pushdown-m-mo-9\" d=\"^13\"/><path id=\"triceps-pushdown-m-mo-10\" d=\"^14\"/><path id=\"triceps-pushdown-m-mo-11\" d=\"^6\"/><path id=\"triceps-pushdown-m-mo-12\" d=\"^7\"/><path id=\"triceps-pushdown-m-mo-13\" d=\"^8\"/><path id=\"triceps-pushdown-m-mo-14\" d=\"^9\"/><path id=\"triceps-pushdown-m-mo-15\" d=\"^10\"/><path id=\"triceps-pushdown-m-mo-16\" d=\"^11\"/><path id=\"triceps-pushdown-m-mo-17\" d=\"^12\"/><path id=\"triceps-pushdown-m-mo-18\" d=\"^13\"/><path id=\"triceps-pushdown-m-mo-19\" d=\"^14\"/><path id=\"triceps-pushdown-m-mo-20\" d=\"^18\"/><path id=\"triceps-pushdown-m-mo-21\" d=\"^19\"/><path id=\"triceps-pushdown-m-mo-22\" d=\"^22\"/><path id=\"triceps-pushdown-m-mo-23\" d=\"^23\"/><path id=\"triceps-pushdown-m-mo-24\" d=\"^24\"/><path id=\"triceps-pushdown-m-mo-25\" d=\"^25\"/><path id=\"triceps-pushdown-m-mo-26\" d=\"^26\"/><path id=\"triceps-pushdown-m-mo-27\" d=\"^27\"/><path id=\"triceps-pushdown-m-mo-28\" d=\"^31\"/><path id=\"triceps-pushdown-m-mo-29\" d=\"^32\"/><path id=\"triceps-pushdown-m-mo-30\" d=\"^39\"/><path id=\"triceps-pushdown-m-mo-31\" d=\"^42\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#triceps-pushdown-m-dots)\"/>\n  <path class=\"floorline\" d=\"^17\"/><path class=\"eq\" d=\"^18\"/><path class=\"eq\" d=\"^19\"/><path class=\"eq\" d=\"^20\"/><path class=\"eq\" d=\"^21\"/><path class=\"eq\" d=\"^22\"/><path class=\"eq\" d=\"^23\"/><path class=\"eq-solid\" d=\"^24\"/><path class=\"eq-pin\" d=\"^25\"/><path class=\"eq-solid\" d=\"^26\"/><path class=\"eq-pin\" d=\"^27\"/><path class=\"eq-cable\" d=\"^28\"/><path class=\"eq-thin\" d=\"^29\"/><path class=\"eq-thin\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq\" d=\"^32\"/><path class=\"eq-thin\" d=\"^33\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#triceps-pushdown-m-st-fore.l\"/><use href=\"#triceps-pushdown-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#triceps-pushdown-m-st-fore.l\"/><use href=\"#triceps-pushdown-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#triceps-pushdown-m-st-fore.r\"/><use href=\"#triceps-pushdown-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#triceps-pushdown-m-st-fore.r\"/><use href=\"#triceps-pushdown-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-solid\" d=\"^35\"/><path class=\"eq-cable\" d=\"^36\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#triceps-pushdown-m-g0-fore.r\"/><use href=\"#triceps-pushdown-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#triceps-pushdown-m-g0-fore.r\"/><use href=\"#triceps-pushdown-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-solid\" d=\"^37\"/><path class=\"eq-cable\" d=\"^38\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#triceps-pushdown-m-g1-fore.r\"/><use href=\"#triceps-pushdown-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#triceps-pushdown-m-g1-fore.r\"/><use href=\"#triceps-pushdown-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^39\"/><path class=\"eq-thin\" d=\"^40\"/><path class=\"eq-cable\" d=\"^41\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#triceps-pushdown-m-e-thigh.l\"/><use href=\"#triceps-pushdown-m-e-kneecap.l\"/><use href=\"#triceps-pushdown-m-e-shank.l\"/><use href=\"#triceps-pushdown-m-e-foot.l\"/><use href=\"#triceps-pushdown-m-e-shcap.l\"/><use href=\"#triceps-pushdown-m-e-upper.l\"/><use href=\"#triceps-pushdown-m-e-elbowcap.l\"/><use href=\"#triceps-pushdown-m-e-fore.l\"/><use href=\"#triceps-pushdown-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#triceps-pushdown-m-e-thigh.l\"/><use href=\"#triceps-pushdown-m-e-kneecap.l\"/><use href=\"#triceps-pushdown-m-e-shank.l\"/><use href=\"#triceps-pushdown-m-e-foot.l\"/><use href=\"#triceps-pushdown-m-e-shcap.l\"/><use href=\"#triceps-pushdown-m-e-upper.l\"/><use href=\"#triceps-pushdown-m-e-elbowcap.l\"/><use href=\"#triceps-pushdown-m-e-fore.l\"/><use href=\"#triceps-pushdown-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#triceps-pushdown-m-e-head\"/><use href=\"#triceps-pushdown-m-e-torso\"/><use href=\"#triceps-pushdown-m-e-thigh.r\"/><use href=\"#triceps-pushdown-m-e-kneecap.r\"/><use href=\"#triceps-pushdown-m-e-shank.r\"/><use href=\"#triceps-pushdown-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#triceps-pushdown-m-e-head\"/><use href=\"#triceps-pushdown-m-e-torso\"/><use href=\"#triceps-pushdown-m-e-thigh.r\"/><use href=\"#triceps-pushdown-m-e-kneecap.r\"/><use href=\"#triceps-pushdown-m-e-shank.r\"/><use href=\"#triceps-pushdown-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^42\"/><path class=\"eq-cable\" d=\"^43\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#triceps-pushdown-m-e-shcap.r\"/><use href=\"#triceps-pushdown-m-e-upper.r\"/><use href=\"#triceps-pushdown-m-e-elbowcap.r\"/><use href=\"#triceps-pushdown-m-e-fore.r\"/><use href=\"#triceps-pushdown-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#triceps-pushdown-m-e-shcap.r\"/><use href=\"#triceps-pushdown-m-e-upper.r\"/><use href=\"#triceps-pushdown-m-e-elbowcap.r\"/><use href=\"#triceps-pushdown-m-e-fore.r\"/><use href=\"#triceps-pushdown-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"143.61\" cy=\"153.88\" r=\"2.25\"/><circle class=\"joint\" cx=\"147.4\" cy=\"197.17\" r=\"2.25\"/><circle class=\"joint\" cx=\"132.84\" cy=\"214.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"140.74\" cy=\"271.77\" r=\"2.25\"/></g><mask id=\"triceps-pushdown-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#triceps-pushdown-m-m-head\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-m-torso\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-mf-shank.l\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-mf-foot.l\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-mf-upper.l\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-mf-fore.l\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-mf-fist.l\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-mf-shank.r\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-mf-foot.r\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-m-shcap.r\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-m-upper.r\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-m-fore.r\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-m-fist.r\" fill=\"#000\"/><use href=\"#triceps-pushdown-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#triceps-pushdown-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#triceps-pushdown-m-mmask)\"><g class=\"u-stroke\"><use href=\"#triceps-pushdown-m-m-head\"/><use href=\"#triceps-pushdown-m-m-torso\"/><use href=\"#triceps-pushdown-m-m-shcap.r\"/><use href=\"#triceps-pushdown-m-m-upper.r\"/><use href=\"#triceps-pushdown-m-m-elbowcap.r\"/><use href=\"#triceps-pushdown-m-m-fore.r\"/><use href=\"#triceps-pushdown-m-m-fist.r\"/><use href=\"#triceps-pushdown-m-m-eq0\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MDJD1ATK1LDkVSw1\"/><path class=\"m-line\" d=\"~#40HBnSRD1zKlG(D1*pXI200001000\"/><path class=\"m-arrow\" d=\"M134.77 108.64A108 108 0 0 1 183.87 126.51M178.93 127.28L183.87 126.51L181.75 121.99\"/><path class=\"leader m\" d=\"M146.93 166.96L97.98 152H87.98\"/><path class=\"leader m\" d=\"M127.6 195.33L101.75 236H91.75\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"triceps-pushdown-m-lean\" data-key=\"lean\" data-cue=\"You lean far over the bar or arch your back to push it down.\" class=\"plate-callout two m\" style=\"left:7.82%;top:36.31%\" aria-pressed=\"true\">Leaning<br>over</button><button type=\"button\" id=\"triceps-pushdown-m-arch\" data-key=\"arch\" data-cue=\"Your low back arches as you push the bar down.\" class=\"plate-callout two m\" style=\"left:10.06%;top:59.78%\" aria-pressed=\"false\">Back<br>arches</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "Keep the upper arms against the sides so only the forearms move." }, { key: "torso", cue: "Stay upright or tilt slightly from the hips, back not arched." }, { key: "wrists", cue: "Keep the hands in line with the forearms from top to bottom." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "lean",
        cues: [{ key: "lean", cue: "You lean far over the bar or arch your back to push it down." }, { key: "arch", cue: "Your low back arches as you push the bar down." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Leaning over</b><span>You lean far over the bar or arch your back to push it down.</span></li><li><b>Back arches</b><span>Your low back arches as you push the bar down.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: press 1 second, hold 1 second, return 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div></div>",
      alt: "Triceps pushdown, side view. Standing at a high cable tower with a slight forward lean, upper arms pinned at the sides, the lifter presses a straight bar from about upper-chest level down in an arc to straight arms in front of the thighs.",
      mistakeAlt: "Triceps Pushdown: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "push",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW2: the push heel-of-palm pair cannot be drawn by golden B's engine (D-LIB7-19); the grip copy carries c2 and c9.",
    "orientation": "pronated",
    "handle": "bar-28",
    "overBody": false,
    "width": {
      "text": "Hands about shoulder-width.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown",
          "hussain-2020"
        ],
        "note": "card c2"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown",
          "hussain-2020"
        ],
        "note": "card c2"
      }
    },
    "contact": "heel",
    "wrist": {
      "ext": [
        0,
        15
      ],
      "limitText": "Keep the wrists in line with the forearms.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "CONVENTION"
        ],
        "sources": [
          "ace-pushdown",
          "ga-push-heel"
        ],
        "note": "card c9. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number."
      }
    },
    "faults": [
      {
        "key": "bent-back",
        "label": "Wrist bent back",
        "pose": {},
        "markers": [],
        "alt": "Wrists bent back over the bar."
      }
    ],
    "gripLine": "Overhand full grip, hands about shoulder-width, thumbs wrapped.",
    "cue": "Wrist in line with the forearm."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Top pulley, straight bar. Grip overhand, hands shoulder-width, thumbs wrapped.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown",
          "ace-pressdown",
          "hussain-2020"
        ],
        "note": "card c1, c2"
      }
    },
    {
      "kind": "position",
      "text": "Stand facing the machine, feet hip-width or staggered.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown"
        ],
        "note": "card c3"
      }
    },
    {
      "kind": "brace",
      "text": "Brace, shoulders down and back, elbows at sides, bar at upper chest.",
      "zoom": "pushdown-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown",
          "hussain-2020",
          "sl-pushdown"
        ],
        "note": "card c4, c10, c7"
      }
    },
    {
      "kind": "position",
      "text": "Straighten the arms fully at the bottom without a hard lockout.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown",
          "ace-pressdown"
        ],
        "note": "card c8"
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
          "sl-pushdown"
        ],
        "note": "card c16"
      }
    }
  ],
  posture: [
    {
      "key": "elbows",
      "label": "Elbows pinned",
      "detail": "Elbows stay right next to your sides.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "zoom": "pushdown-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown",
          "sl-pushdown"
        ],
        "note": "card c5"
      }
    },
    {
      "key": "torso",
      "label": "Tall torso",
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
          "hussain-2020",
          "sl-pushdown"
        ],
        "note": "card c4"
      }
    },
    {
      "key": "wrists",
      "label": "Neutral wrists",
      "detail": "Wrists neutral throughout.",
      "anchor": {
        "pose": "end",
        "at": "wrist.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown"
        ],
        "note": "card c9"
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
        "note": "card c10"
      }
    },
    {
      "key": "lockout",
      "label": "No hard lockout",
      "detail": "Straighten the arms fully at the bottom without a hard lockout.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown",
          "ace-pressdown"
        ],
        "note": "card c8"
      }
    },
    {
      "key": "return",
      "label": "Return height",
      "detail": "Return only until the elbows start to move forward.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "zoom": "pushdown-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown",
          "sl-pushdown"
        ],
        "note": "card c7"
      }
    }
  ],
  zooms: [
    {
      "key": "pushdown-elbow",
      "chip": "Elbows",
      "heading": "Elbow position",
      "kind": "posture",
      "feelRow": "lats"
    }
  ],
  chips: [
    "pushdown-elbow",
    "feel"
  ],
  copy: {
    "setupLine": "Straight bar on the top pulley, overhand grip. Elbows at your sides, shoulders down and back.",
    "mistakeLine": "Keep your elbows at your sides. Lean only from the hips, never by arching your back.",
    "cueLine": "Elbows pinned to your sides."
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
          "sl-pushdown",
          "ace-pushdown",
          "hussain-2020"
        ],
        "note": "card c11, c4"
      },
      "fix": "Stand taller. Tilt only from the hips."
    },
    {
      "key": "elbows-forward",
      "title": "Elbows drifting forward",
      "zoom": "pushdown-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushdown",
          "sl-pushdown"
        ],
        "note": "card c6, c7"
      },
      "fix": "Keep the elbows at your sides. Stop the return at upper-chest level."
    },
    {
      "key": "heavy",
      "title": "Too heavy, moved with momentum",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-pushdown"
        ],
        "note": "card c16"
      },
      "fix": "Go lighter and move with control."
    }
  ],
  risks: [
    {
      "key": "lean",
      "text": "Leaning too far forward or arching the back strains the lower back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-pushdown"
        ],
        "note": "card c11"
      }
    },
    {
      "key": "elbows",
      "text": "Heavy loads feel uncomfortable in the elbows for many people.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-pushdown"
        ],
        "note": "card c17"
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
          "sl-pushdown"
        ],
        "note": "card c16"
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
    "ace-pushdown",
    "ace-pressdown",
    "sl-pushdown",
    "hussain-2020",
    "acsm-2009",
    "ga-push-heel",
    "nhs-elbow-pain",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/triceps_pushdown.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

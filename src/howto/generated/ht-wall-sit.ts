// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=9ab0340d40c4f6ca4f778cf7712bea9af2ffcaf178aab8efcda5e7defbf2798b
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_wall_sit",
  name: "Wall Sit",
  hashes: { inputsSha256: "9ab0340d40c4f6ca4f778cf7712bea9af2ffcaf178aab8efcda5e7defbf2798b", golden: "f8b3fb477de3f79ba91cae6890030e6cbbcaa0b7c00fe396aeef5356e93ac563" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"wall-sit-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"wall-sit-n-st-head\" d=\"~#w12FHnSXjxXl)KjBjFjBjS9Ebz3z3Y4.4)7*7EbThGm_4.cT1R9Bj0JmBbNmI6_kA3DjygT1Dj0000020000100200010000000100020000000000000002002000010000000010\"/><path id=\"wall-sit-n-st-torso\" d=\"~#_12F_lSOo.zmBxnB9B4t9PaNgyaY5YdDf_6lB9Vnzpz7Vcy5yg-4YkK6Nm*fShTh_4T9)7*fBrEz1EbBrK6O3Ve)2(dFmY3Y7EdB7Rfw9)4Aly7P8PeKc(2P5BT2ww101000000020010000000000010000000010000002100000000000100000000111000000000101110102000000010122000020000100021000100\"/><path id=\"wall-sit-n-st-thigh.r\" d=\"~#F12UAmNXJ1GBlTUI1O8B8vqSF1HO10-93X4.tGI1B4VpEcxg-n-a.x1zF1O4K1O9R2yz1ST1unT5Iazw1F9J7!K1_lPsFH1Aj10000000001111010100210101101000101111000000200000000111000001000102000001011000\"/><path id=\"wall-sit-n-st-kneecap.r\" d=\"~~yxu(*U1_J10\"/><path id=\"wall-sit-n-st-shank.r\" d=\"~#F12wzuUOV1OUtVyU1-2RbA1fPsAY1P2O9y1V4*sB!1S1IfR4xb)b-9*l)(1z4T2K8*4Nj_.1B1gz6BaK7Sf.2!rJ8ykUlWh02020010000020000200000000000000000000020000010101001010100000000010000001010100\"/><path id=\"wall-sit-n-st-foot.r\" d=\"~#o2NEz1DB)1.Yz1EB(1ScH3Jhx8Hp)nFY2B3TI2-4XB1)7Vn2)F1Y4*a-cJsBbzmUp001012012100200101200000001210000101000000000001\"/><path id=\"wall-sit-n-g0-head\" d=\"~#w12FHnyVmxXlOImBjFjBjU9EbE3z3_4.4)7*7BbThKm_4XcT1T9Bj0JmEbNmG6_kA3DjygT1Dj0000020000110001010000000001000000000100000100002200010000000010\"/><path id=\"wall-sit-n-g0-torso\" d=\"~#_12F_lyKr.zmV(pB9z4tdPaPgyaY5YdDf_6lB9Vnzpz7Vcy5yg-4YkK6Nm*fShTh_4T9)7*fBrEz1EbBrK6O3Ve)2(dFmY3Y7EdB7Rfw9)4Aly7P8PeKc(2P5BT2ww101000001000010000000000010020000010000002000000002000000000200111000000000101010102000000010122200020000100021000100\"/><path id=\"wall-sit-n-g0-thigh.r\" d=\"~#F12H!mNGP1.RlBWO1xbx4jA1_X1wr.3)8x2G4BJ1Irze)lVh-9xqbVN1)mV4gV9N1JU1Ax1kx1E9E7)pDlApyE1HvNhNN1m00001000100000100011110000011001010100000000000010001202000001000020001000000020\"/><path id=\"wall-sit-n-g0-kneecap.r\" d=\"~~(Dx1yyU1_J10\"/><path id=\"wall-sit-n-g0-shank.r\" d=\"~#F12WBx1YEU1Vzx1OYS1c.bF13PcY*1w5K8D2E4-b)x2S5IeO1.b.8TcK4.y2B3R3*6z7!2A)1E14E3ObEbAdBayqW2UlAg!m01000200002001020010100001000200000020000000001010000200010100002101000002100001\"/><path id=\"wall-sit-n-g0-foot.r\" d=\"~#o2NEz1DB)1.Yz1EB(1ScF3Jh*7HpxoFY2B3TI2-4-B1)7Rn0xG1_4*aXcJsEbzmUp001012000000000101001010000000100000020000200001\"/><path id=\"wall-sit-n-g1-head\" d=\"~#w12FHnSSpxXl)FpBjFjBjU9EbE3z3_4.4)7*7BbThKm_4XcT1T9Bj0JmEbNmG6_kA3DjygT1Dj0000020000110001010000000001000000000100000100002200010200000010\"/><path id=\"wall-sit-n-g1-torso\" d=\"~#_12F_lSHu.zmB!sB9z4tdPaPgyaY5YdDf_6lB9Vnzpz7Vcy5yg-4YkK6Nm*fShTh_4T9)7*fBrEz1EbBrK6O3Ve*2(dAmY3_7EdB7Rfw9)4Dly7J8PeIc(2P5BT2ww100000001000012000000000010020000010000002000000002000000000200101000000000101011102000000010122200000100100021000100\"/><path id=\"wall-sit-n-g1-thigh.r\" d=\"~#F12NOnNNT1RxmzET1TbvbF1!!1Dbz6T7x3R3XR1VeKjOhTjX4EpS6*S1-9K4_1.8(3D.1(h8z1XaR4TjJrSy1(u!y1S8(J1Vb00210000100100000002002000010000000220000012000020010100022000001001010000010100\"/><path id=\"wall-sit-n-g1-kneecap.r\" d=\"~~_Iy1A)T1_J10\"/><path id=\"wall-sit-n-g1-shank.r\" d=\"~#F12FHy1NwU1VJy1BRS1P1XbD13W6_(1Y5)7U2x4T5Xy2(6.d9*bX7Kd!1)y2-2.3E6T7x3w)1E10z2VbOcwcRcypkWl(dHo00020010000020002020002000012020001000000000000200010021002000001000000101001000\"/><path id=\"wall-sit-n-g1-foot.r\" d=\"~#o2PEz1DB)1)Yz1EB(1UcF3Hh)7Jp*nFY2E3TI2-4XB1)7Vn0*F1_4)aXcNsEbBmUp000002100200000001010000001010000000120000001011\"/><path id=\"wall-sit-n-e-thigh.l\" d=\"~#F12yyoANW1XTmBSW1Rb(10D1Y*1-3-7*5-3V2.T1E2xnBcBk2*mSc.T1_2X3Y2X7w6_*1D30G1TbX1EcHv(F1Ul(z13YF1Em00000000000000001002000001101000011000011101200010000200000000200010100002000121\"/><path id=\"wall-sit-n-e-kneecap.l\" d=\"~~!Wy1w)T1_J10\"/><path id=\"wall-sit-n-e-shank.l\" d=\"~#F12FVy1w)T1)Yy1-OS1_1-bF12!4!(1(5-7Y2*3X3)y2J7Rd1)bG7Rd_3)y2-2*3*5-7*4!(1B12-1-b-cUbEdWo0YlDdWo01000002000000100010000000002200100200200010100000100000022000010000000000100020\"/><path id=\"wall-sit-n-e-foot.l\" d=\"~#o2PEz1DB)1)Yz1EB(1ScF3Jh)7Jp)nFY2B3TI2X4XB1x8Tn0xG1_4.aXcJsEbBmUp000002000200000000001200000010100020020100000001\"/><path id=\"wall-sit-n-e-shcap.l\" d=\"~~U)l!KD1wP10\"/><path id=\"wall-sit-n-e-upper.l\" d=\"~#F12Dxm!xD1.HmzwB1U2K884G9!K1P4.4A2K2!eXy1PeTfy4*f)4TkY3TB1jB3T1K6)dUJ190Y1T8GfX5TjJlR5Wl_6Ds01110110022000000000101001012000000220000001210000000112101001110000202000000010\"/><path id=\"wall-sit-n-e-elbowcap.l\" d=\"~~Fzk(FO1Dz10\"/><path id=\"wall-sit-n-e-fore.l\" d=\"~#F12H(k_JP1-zkXzP1R9.3(1b(H1D6G8R5.1x2-vV7.aO9)aK2)d_3*v-6V2A1X9J1FG1(cW1A1GafR2Y9YgUeYgY3Pl.500000010110000100101200101200012000111010100022000001000200022000000101000000210\"/><path id=\"wall-sit-n-e-fist.l\" d=\"~~(VtYKR1ww10\"/><path id=\"wall-sit-n-e-head\" d=\"~#w12FHnyPsxXlODsBjFjBjU9EbE3z3_4.4)7*7BbThKm_4XcT1T9Bj0JmEbNmG6_kA3DjygT1Dj0000020000110001010000000001000000000100000000002200000200000010\"/><path id=\"wall-sit-n-e-torso\" d=\"~#_12F_lyFx1.zmV-vB9z4tbPaJgya_5YdDf_6lB9Vnzpz7Vcy5yg-4YkK6Nm*fShTh_4T9)7*fBrEz1EbBrK6O3Ve*2(dAmY3_7Edz7Rf!8)4Fly7J8PeIc(2P5BT2ww100000201000110000000000010020000000000002000000002000000000200101000000000101010102000020011102200000100100021000000\"/><path id=\"wall-sit-n-e-thigh.r\" d=\"^18\"/><path id=\"wall-sit-n-e-kneecap.r\" d=\"^19\"/><path id=\"wall-sit-n-e-shank.r\" d=\"^20\"/><path id=\"wall-sit-n-e-foot.r\" d=\"^21\"/><path id=\"wall-sit-n-e-shcap.r\" d=\"^22\"/><path id=\"wall-sit-n-e-upper.r\" d=\"^23\"/><path id=\"wall-sit-n-e-elbowcap.r\" d=\"^24\"/><path id=\"wall-sit-n-e-fore.r\" d=\"^25\"/><path id=\"wall-sit-n-e-fist.r\" d=\"^26\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#wall-sit-n-dots)\"/>\n  <path class=\"datum\" d=\"~MWzA1FBA2L0XEn\"/><path class=\"floorline\" d=\"M102.66 339.5H305.71\"/><path class=\"eq\" d=\"~MUxkYKx2L0zXU1Q0)o)oA(T1LXy1wpQ)o0Yy1wpLwpA(T1Q0wpwpz(T1LYy1)oQwp0Xy1)oZ\"/><path class=\"arc measure\" d=\"M184.91 266.08L184.91 244.08A22 22 0 0 0 162.91 266.21Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-sit-n-st-head\"/><use href=\"#wall-sit-n-st-torso\"/><use href=\"#wall-sit-n-st-thigh.r\"/><use href=\"#wall-sit-n-st-kneecap.r\"/><use href=\"#wall-sit-n-st-shank.r\"/><use href=\"#wall-sit-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-sit-n-st-head\"/><use href=\"#wall-sit-n-st-torso\"/><use href=\"#wall-sit-n-st-thigh.r\"/><use href=\"#wall-sit-n-st-kneecap.r\"/><use href=\"#wall-sit-n-st-shank.r\"/><use href=\"#wall-sit-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-sit-n-g0-head\"/><use href=\"#wall-sit-n-g0-torso\"/><use href=\"#wall-sit-n-g0-thigh.r\"/><use href=\"#wall-sit-n-g0-kneecap.r\"/><use href=\"#wall-sit-n-g0-shank.r\"/><use href=\"#wall-sit-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-sit-n-g0-head\"/><use href=\"#wall-sit-n-g0-torso\"/><use href=\"#wall-sit-n-g0-thigh.r\"/><use href=\"#wall-sit-n-g0-kneecap.r\"/><use href=\"#wall-sit-n-g0-shank.r\"/><use href=\"#wall-sit-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-sit-n-g1-head\"/><use href=\"#wall-sit-n-g1-torso\"/><use href=\"#wall-sit-n-g1-thigh.r\"/><use href=\"#wall-sit-n-g1-kneecap.r\"/><use href=\"#wall-sit-n-g1-shank.r\"/><use href=\"#wall-sit-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-sit-n-g1-head\"/><use href=\"#wall-sit-n-g1-torso\"/><use href=\"#wall-sit-n-g1-thigh.r\"/><use href=\"#wall-sit-n-g1-kneecap.r\"/><use href=\"#wall-sit-n-g1-shank.r\"/><use href=\"#wall-sit-n-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#wall-sit-n-e-thigh.l\"/><use href=\"#wall-sit-n-e-kneecap.l\"/><use href=\"#wall-sit-n-e-shank.l\"/><use href=\"#wall-sit-n-e-foot.l\"/><use href=\"#wall-sit-n-e-shcap.l\"/><use href=\"#wall-sit-n-e-upper.l\"/><use href=\"#wall-sit-n-e-elbowcap.l\"/><use href=\"#wall-sit-n-e-fore.l\"/><use href=\"#wall-sit-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#wall-sit-n-e-thigh.l\"/><use href=\"#wall-sit-n-e-kneecap.l\"/><use href=\"#wall-sit-n-e-shank.l\"/><use href=\"#wall-sit-n-e-foot.l\"/><use href=\"#wall-sit-n-e-shcap.l\"/><use href=\"#wall-sit-n-e-upper.l\"/><use href=\"#wall-sit-n-e-elbowcap.l\"/><use href=\"#wall-sit-n-e-fore.l\"/><use href=\"#wall-sit-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-sit-n-e-head\"/><use href=\"#wall-sit-n-e-torso\"/><use href=\"#wall-sit-n-e-thigh.r\"/><use href=\"#wall-sit-n-e-kneecap.r\"/><use href=\"#wall-sit-n-e-shank.r\"/><use href=\"#wall-sit-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-sit-n-e-head\"/><use href=\"#wall-sit-n-e-torso\"/><use href=\"#wall-sit-n-e-thigh.r\"/><use href=\"#wall-sit-n-e-kneecap.r\"/><use href=\"#wall-sit-n-e-shank.r\"/><use href=\"#wall-sit-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-sit-n-e-shcap.r\"/><use href=\"#wall-sit-n-e-upper.r\"/><use href=\"#wall-sit-n-e-elbowcap.r\"/><use href=\"#wall-sit-n-e-fore.r\"/><use href=\"#wall-sit-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#wall-sit-n-e-shcap.r\"/><use href=\"#wall-sit-n-e-upper.r\"/><use href=\"#wall-sit-n-e-elbowcap.r\"/><use href=\"#wall-sit-n-e-fore.r\"/><use href=\"#wall-sit-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"120.26\" cy=\"196.78\" r=\"2.25\"/><circle class=\"joint\" cx=\"108.55\" cy=\"242.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"123.14\" cy=\"266.45\" r=\"2.25\"/><circle class=\"joint\" cx=\"184.91\" cy=\"266.08\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#Y10UxoJ*J1TxoOXJ10102010201020102010201020102010201020102010201020102010000000002000000020000000200000002000000020000000200000002000000020000000200000002000000020000000200000002000000\"/><path class=\"arrow\" d=\"~MUxoPDT1LXiOB1LFY1PB1Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M184.91 244.08A22 22 0 0 0 162.91 266.21\"/><g class=\"arc-ticks\"><path d=\"~MWzA1PNP1L0EY1\"/><path d=\"~MDTw1W)T1LEY1a\"/></g><path class=\"leader\" d=\"~MH-w1FVP1LNRb)_7\"/></g></g><path class=\"leader\" d=\"M102.66 210.7L135 186H145\"/><circle class=\"anchor\" cx=\"102.66\" cy=\"210.7\" r=\"1.5\"/><path class=\"leader\" d=\"M184.91 266.08L221 324H231\"/><circle class=\"anchor\" cx=\"184.91\" cy=\"266.08\" r=\"1.5\"/><path class=\"leader\" d=\"~MA*rDHS1LUXbH2\"/><circle class=\"anchor\" cx=\"142.9\" cy=\"257.63\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"wall-sit-n-back\" data-key=\"back\" data-cue=\"Keep your back and buttocks on the wall.\" class=\"plate-callout\" style=\"left:39.11%;top:45.81%\" aria-pressed=\"true\">Back on wall</button><button type=\"button\" id=\"wall-sit-n-knees\" data-key=\"knees\" data-cue=\"Keep your shins vertical, knees right above the ankles.\" class=\"plate-callout two\" style=\"left:63.13%;top:84.36%\" aria-pressed=\"false\">Knees over<br>ankles</button><button type=\"button\" id=\"wall-sit-n-deg\" data-key=\"deg\" data-cue=\"Slide down until your hips and knees are at about 90 degrees.\" class=\"plate-callout two\" style=\"left:55.31%;top:65.92%\" aria-pressed=\"false\">Hips<br>about 90°</button><span class=\"plate-arc-label\" style=\"left:64.25%;top:56.42%\"><b>Knee</b><span>about 90°</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"wall-sit-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"wall-sit-m-st-head\" d=\"^0\"/><path id=\"wall-sit-m-st-torso\" d=\"^1\"/><path id=\"wall-sit-m-st-thigh.r\" d=\"^2\"/><path id=\"wall-sit-m-st-kneecap.r\" d=\"^3\"/><path id=\"wall-sit-m-st-shank.r\" d=\"^4\"/><path id=\"wall-sit-m-st-foot.r\" d=\"^5\"/><path id=\"wall-sit-m-g0-head\" d=\"^6\"/><path id=\"wall-sit-m-g0-torso\" d=\"^7\"/><path id=\"wall-sit-m-g0-thigh.r\" d=\"^8\"/><path id=\"wall-sit-m-g0-kneecap.r\" d=\"^9\"/><path id=\"wall-sit-m-g0-shank.r\" d=\"^10\"/><path id=\"wall-sit-m-g0-foot.r\" d=\"^11\"/><path id=\"wall-sit-m-g1-head\" d=\"^12\"/><path id=\"wall-sit-m-g1-torso\" d=\"^13\"/><path id=\"wall-sit-m-g1-thigh.r\" d=\"^14\"/><path id=\"wall-sit-m-g1-kneecap.r\" d=\"^15\"/><path id=\"wall-sit-m-g1-shank.r\" d=\"^16\"/><path id=\"wall-sit-m-g1-foot.r\" d=\"^17\"/><path id=\"wall-sit-m-e-thigh.l\" d=\"^18\"/><path id=\"wall-sit-m-e-kneecap.l\" d=\"^19\"/><path id=\"wall-sit-m-e-shank.l\" d=\"^20\"/><path id=\"wall-sit-m-e-foot.l\" d=\"^21\"/><path id=\"wall-sit-m-e-shcap.l\" d=\"^22\"/><path id=\"wall-sit-m-e-upper.l\" d=\"^23\"/><path id=\"wall-sit-m-e-elbowcap.l\" d=\"^24\"/><path id=\"wall-sit-m-e-fore.l\" d=\"^25\"/><path id=\"wall-sit-m-e-fist.l\" d=\"^26\"/><path id=\"wall-sit-m-e-head\" d=\"^27\"/><path id=\"wall-sit-m-e-torso\" d=\"^28\"/><path id=\"wall-sit-m-e-thigh.r\" d=\"^18\"/><path id=\"wall-sit-m-e-kneecap.r\" d=\"^19\"/><path id=\"wall-sit-m-e-shank.r\" d=\"^20\"/><path id=\"wall-sit-m-e-foot.r\" d=\"^21\"/><path id=\"wall-sit-m-e-shcap.r\" d=\"^22\"/><path id=\"wall-sit-m-e-upper.r\" d=\"^23\"/><path id=\"wall-sit-m-e-elbowcap.r\" d=\"^24\"/><path id=\"wall-sit-m-e-fore.r\" d=\"^25\"/><path id=\"wall-sit-m-e-fist.r\" d=\"^26\"/><path id=\"wall-sit-m-m-thigh.l\" d=\"~#F12NPnDJW1XxmIBW1*bp7D1!*1UaG6R7E3R3zT1GeTjBhVjO4Bp!6EU1K9O4!1.8y4F!1Jh8B1)aK4Ri_r(y1Nuyz1A8WJ1Gc01100000000000000000100001010100010010010000120000000010000000001010000200010101\"/><path id=\"wall-sit-m-m-kneecap.l\" d=\"~~PSy1_YW1_J10\"/><path id=\"wall-sit-m-m-shank.l\" d=\"~#F12y.y1!.V1z.z1--U1Y8*7uo)y1UT1P9I2U4G1AD1-V1Fe)5P7K9Y2BfyJ1xR18-46-9TH1SK1tn!5Ea)gkVpwbRdwhx5Sr10000011001000110001010100200020010000020001000000000000000001100000000200000000\"/><path id=\"wall-sit-m-m-foot.l\" d=\"~#o2HRr!A)1xAsBD(1WcU3!hE7NqTmW-22TJ2I7xD1B9*nr-G1F3Xa.cFt)9GnFo000002000110100000000200002000121010002000001002\"/><path id=\"wall-sit-m-m-thigh.r\" d=\"^42\"/><path id=\"wall-sit-m-m-kneecap.r\" d=\"^43\"/><path id=\"wall-sit-m-m-shank.r\" d=\"^44\"/><path id=\"wall-sit-m-m-foot.r\" d=\"^45\"/><path id=\"wall-sit-m-mf-head\" d=\"^27\"/><path id=\"wall-sit-m-mf-torso\" d=\"^28\"/><path id=\"wall-sit-m-mf-shcap.l\" d=\"^22\"/><path id=\"wall-sit-m-mf-upper.l\" d=\"^23\"/><path id=\"wall-sit-m-mf-elbowcap.l\" d=\"^24\"/><path id=\"wall-sit-m-mf-fore.l\" d=\"^25\"/><path id=\"wall-sit-m-mf-fist.l\" d=\"^26\"/><path id=\"wall-sit-m-mf-shcap.r\" d=\"^22\"/><path id=\"wall-sit-m-mf-upper.r\" d=\"^23\"/><path id=\"wall-sit-m-mf-elbowcap.r\" d=\"^24\"/><path id=\"wall-sit-m-mf-fore.r\" d=\"^25\"/><path id=\"wall-sit-m-mf-fist.r\" d=\"^26\"/><path id=\"wall-sit-m-mo-0\" d=\"^27\"/><path id=\"wall-sit-m-mo-1\" d=\"^28\"/><path id=\"wall-sit-m-mo-2\" d=\"^18\"/><path id=\"wall-sit-m-mo-3\" d=\"^19\"/><path id=\"wall-sit-m-mo-4\" d=\"^20\"/><path id=\"wall-sit-m-mo-5\" d=\"^21\"/><path id=\"wall-sit-m-mo-6\" d=\"^22\"/><path id=\"wall-sit-m-mo-7\" d=\"^23\"/><path id=\"wall-sit-m-mo-8\" d=\"^24\"/><path id=\"wall-sit-m-mo-9\" d=\"^25\"/><path id=\"wall-sit-m-mo-10\" d=\"^26\"/><path id=\"wall-sit-m-mo-11\" d=\"^18\"/><path id=\"wall-sit-m-mo-12\" d=\"^19\"/><path id=\"wall-sit-m-mo-13\" d=\"^20\"/><path id=\"wall-sit-m-mo-14\" d=\"^21\"/><path id=\"wall-sit-m-mo-15\" d=\"^22\"/><path id=\"wall-sit-m-mo-16\" d=\"^23\"/><path id=\"wall-sit-m-mo-17\" d=\"^24\"/><path id=\"wall-sit-m-mo-18\" d=\"^25\"/><path id=\"wall-sit-m-mo-19\" d=\"^26\"/><path id=\"wall-sit-m-mo-20\" d=\"^31\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#wall-sit-m-dots)\"/>\n  <path class=\"floorline\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-sit-m-st-head\"/><use href=\"#wall-sit-m-st-torso\"/><use href=\"#wall-sit-m-st-thigh.r\"/><use href=\"#wall-sit-m-st-kneecap.r\"/><use href=\"#wall-sit-m-st-shank.r\"/><use href=\"#wall-sit-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-sit-m-st-head\"/><use href=\"#wall-sit-m-st-torso\"/><use href=\"#wall-sit-m-st-thigh.r\"/><use href=\"#wall-sit-m-st-kneecap.r\"/><use href=\"#wall-sit-m-st-shank.r\"/><use href=\"#wall-sit-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-sit-m-g0-head\"/><use href=\"#wall-sit-m-g0-torso\"/><use href=\"#wall-sit-m-g0-thigh.r\"/><use href=\"#wall-sit-m-g0-kneecap.r\"/><use href=\"#wall-sit-m-g0-shank.r\"/><use href=\"#wall-sit-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-sit-m-g0-head\"/><use href=\"#wall-sit-m-g0-torso\"/><use href=\"#wall-sit-m-g0-thigh.r\"/><use href=\"#wall-sit-m-g0-kneecap.r\"/><use href=\"#wall-sit-m-g0-shank.r\"/><use href=\"#wall-sit-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-sit-m-g1-head\"/><use href=\"#wall-sit-m-g1-torso\"/><use href=\"#wall-sit-m-g1-thigh.r\"/><use href=\"#wall-sit-m-g1-kneecap.r\"/><use href=\"#wall-sit-m-g1-shank.r\"/><use href=\"#wall-sit-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-sit-m-g1-head\"/><use href=\"#wall-sit-m-g1-torso\"/><use href=\"#wall-sit-m-g1-thigh.r\"/><use href=\"#wall-sit-m-g1-kneecap.r\"/><use href=\"#wall-sit-m-g1-shank.r\"/><use href=\"#wall-sit-m-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#wall-sit-m-e-thigh.l\"/><use href=\"#wall-sit-m-e-kneecap.l\"/><use href=\"#wall-sit-m-e-shank.l\"/><use href=\"#wall-sit-m-e-foot.l\"/><use href=\"#wall-sit-m-e-shcap.l\"/><use href=\"#wall-sit-m-e-upper.l\"/><use href=\"#wall-sit-m-e-elbowcap.l\"/><use href=\"#wall-sit-m-e-fore.l\"/><use href=\"#wall-sit-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#wall-sit-m-e-thigh.l\"/><use href=\"#wall-sit-m-e-kneecap.l\"/><use href=\"#wall-sit-m-e-shank.l\"/><use href=\"#wall-sit-m-e-foot.l\"/><use href=\"#wall-sit-m-e-shcap.l\"/><use href=\"#wall-sit-m-e-upper.l\"/><use href=\"#wall-sit-m-e-elbowcap.l\"/><use href=\"#wall-sit-m-e-fore.l\"/><use href=\"#wall-sit-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-sit-m-e-head\"/><use href=\"#wall-sit-m-e-torso\"/><use href=\"#wall-sit-m-e-thigh.r\"/><use href=\"#wall-sit-m-e-kneecap.r\"/><use href=\"#wall-sit-m-e-shank.r\"/><use href=\"#wall-sit-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#wall-sit-m-e-head\"/><use href=\"#wall-sit-m-e-torso\"/><use href=\"#wall-sit-m-e-thigh.r\"/><use href=\"#wall-sit-m-e-kneecap.r\"/><use href=\"#wall-sit-m-e-shank.r\"/><use href=\"#wall-sit-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#wall-sit-m-e-shcap.r\"/><use href=\"#wall-sit-m-e-upper.r\"/><use href=\"#wall-sit-m-e-elbowcap.r\"/><use href=\"#wall-sit-m-e-fore.r\"/><use href=\"#wall-sit-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#wall-sit-m-e-shcap.r\"/><use href=\"#wall-sit-m-e-upper.r\"/><use href=\"#wall-sit-m-e-elbowcap.r\"/><use href=\"#wall-sit-m-e-fore.r\"/><use href=\"#wall-sit-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"120.26\" cy=\"196.78\" r=\"2.25\"/><circle class=\"joint\" cx=\"108.55\" cy=\"242.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"123.14\" cy=\"266.45\" r=\"2.25\"/><circle class=\"joint\" cx=\"184.91\" cy=\"266.08\" r=\"2.25\"/></g><mask id=\"wall-sit-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#wall-sit-m-mf-head\" fill=\"#000\"/><use href=\"#wall-sit-m-mf-torso\" fill=\"#000\"/><use href=\"#wall-sit-m-m-thigh.l\" fill=\"#000\"/><use href=\"#wall-sit-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#wall-sit-m-m-shank.l\" fill=\"#000\"/><use href=\"#wall-sit-m-m-foot.l\" fill=\"#000\"/><use href=\"#wall-sit-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#wall-sit-m-mf-upper.l\" fill=\"#000\"/><use href=\"#wall-sit-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#wall-sit-m-mf-fore.l\" fill=\"#000\"/><use href=\"#wall-sit-m-mf-fist.l\" fill=\"#000\"/><use href=\"#wall-sit-m-m-thigh.r\" fill=\"#000\"/><use href=\"#wall-sit-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#wall-sit-m-m-shank.r\" fill=\"#000\"/><use href=\"#wall-sit-m-m-foot.r\" fill=\"#000\"/><use href=\"#wall-sit-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#wall-sit-m-mf-upper.r\" fill=\"#000\"/><use href=\"#wall-sit-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#wall-sit-m-mf-fore.r\" fill=\"#000\"/><use href=\"#wall-sit-m-mf-fist.r\" fill=\"#000\"/><use href=\"#wall-sit-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#wall-sit-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#wall-sit-m-mmask)\"><g class=\"u-stroke\"><use href=\"#wall-sit-m-m-thigh.l\"/><use href=\"#wall-sit-m-m-kneecap.l\"/><use href=\"#wall-sit-m-m-shank.l\"/><use href=\"#wall-sit-m-m-foot.l\"/><use href=\"#wall-sit-m-m-thigh.r\"/><use href=\"#wall-sit-m-m-kneecap.r\"/><use href=\"#wall-sit-m-m-shank.r\"/><use href=\"#wall-sit-m-m-foot.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MH)z1_YW1L0(Kb\"/><path class=\"m-line\" d=\"~MyIy1yzy2LFU10\"/><path class=\"leader m\" d=\"M175.85 337.11L231 306H241\"/><path class=\"leader m\" d=\"M184.21 280.45L231 244H241\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"wall-sit-m-feet\" data-key=\"feet\" data-cue=\"The feet sit too close to the wall.\" class=\"plate-callout two m\" style=\"left:65.92%;top:79.33%\" aria-pressed=\"true\">Feet too<br>close</button><button type=\"button\" id=\"wall-sit-m-knees\" data-key=\"knees\" data-cue=\"The knees push forward past the toes.\" class=\"plate-callout two m\" style=\"left:65.92%;top:62.01%\" aria-pressed=\"false\">Knees past<br>toes</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "back",
        cues: [{ key: "back", cue: "Keep your back and buttocks on the wall." }, { key: "knees", cue: "Keep your shins vertical, knees right above the ankles." }, { key: "deg", cue: "Slide down until your hips and knees are at about 90 degrees." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "feet",
        cues: [{ key: "feet", cue: "The feet sit too close to the wall." }, { key: "knees", cue: "The knees push forward past the toes." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Feet too close</b><span>The feet sit too close to the wall.</span></li><li><b>Knees past toes</b><span>The knees push forward past the toes.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: hold 30-60 seconds\"><div class=\"tempo-seg\" style=\"flex:30-60 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>30-60 s</span></div></div></div>",
      alt: "Wall sit, side view. From standing with the back and buttocks on a wall and the feet out in front, the lifter slides down and holds with hips and knees at about 90 degrees, shins vertical with the knees over the ankles, back flat on the wall.",
      mistakeAlt: "Wall Sit: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP: the card archetype.hand is none; it gives no thumb, contact or wrist claim."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Back on the wall, feet out front, shoulder width, toes slightly out.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "physitrack-wallsit",
          "cat-wallsit"
        ],
        "note": "w5, w4, w2: back on the wall w5, w4; feet out front w2; shoulder width, toes slightly out w4"
      }
    },
    {
      "kind": "position",
      "text": "Slide down until hips and knees are about 90 degrees.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-wallsit"
        ],
        "note": "w3, w2: slide down w3; hips and knees about 90 degrees w2"
      }
    },
    {
      "kind": "position",
      "text": "Knees right above the ankles. Move the feet if not.",
      "zoom": "knee-over-ankle",
      "claim": {
        "tags": [
          "MECH",
          "CONSENSUS"
        ],
        "sources": [
          "escamilla-2023",
          "escamilla-2009",
          "physitrack-wallsit"
        ],
        "note": "w4, w8: knees right above the ankles w4; move the feet if not w8"
      }
    },
    {
      "kind": "position",
      "text": "Hold 30-60 seconds and keep breathing steadily.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "cat-wallsit",
          "watanabe-2022"
        ],
        "note": "w3, w10: hold 30-60 seconds w3; keep breathing steadily w10"
      }
    }
  ],
  posture: [
    {
      "key": "back",
      "label": "Back on wall",
      "detail": "Back and buttocks on the wall.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "zoom": "back-on-wall",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "physitrack-wallsit"
        ],
        "note": "w5"
      }
    },
    {
      "key": "knees",
      "label": "Knees follow toes",
      "detail": "Knees over the second toe, ankles not rolling.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [],
        "note": "card inherit posture[1]: the wall sit holds a squat position on the same feet, so the parent's knee-over-foot rule (bodyweight_squat b5) holds; w4 adds toes slightly out."
      }
    },
    {
      "key": "ankles",
      "label": "Knees over ankles",
      "detail": "Knees directly above the ankles. Feet too close to the wall? Walk them out until the knees are over the ankles.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "knee-over-ankle",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "physitrack-wallsit",
          "escamilla-2023",
          "escamilla-2009"
        ],
        "note": "w4, w8"
      }
    },
    {
      "key": "depth",
      "label": "About 90 degrees",
      "detail": "Hips and knees about 90 degrees.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-wallsit"
        ],
        "note": "w2"
      }
    },
    {
      "key": "breath",
      "label": "Holding your breath",
      "detail": "Keep breathing steadily.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "watanabe-2022"
        ],
        "note": "w10"
      }
    }
  ],
  zooms: [
    {
      "key": "knee-over-ankle",
      "chip": "Knees",
      "heading": "Knee over ankle",
      "kind": "posture",
      "feelRow": "kneecap"
    },
    {
      "key": "back-on-wall",
      "chip": "Back",
      "heading": "Back on wall",
      "kind": "posture"
    }
  ],
  chips: [
    "knee-over-ankle",
    "back-on-wall",
    "feel"
  ],
  copy: {
    "setupLine": "Back on the wall, feet out front. Slide down until hips and knees are about 90 degrees.",
    "mistakeLine": "Feet too close to the wall? Walk them out until the knees are over the ankles.",
    "cueLine": "Back on wall, knees over ankles."
  },
  mistakes: [],
  risks: [
    {
      "key": "pressure",
      "text": "Blood pressure rises during the hold, more the deeper you go.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "goldring-2014"
        ],
        "note": "w7"
      }
    },
    {
      "key": "breath",
      "text": "Holding the breath raises blood pressure further during the hold.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "watanabe-2022"
        ],
        "note": "w10"
      }
    },
    {
      "key": "feet-close",
      "text": "Feet too close to the wall load the kneecap more.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "escamilla-2023",
          "escamilla-2009"
        ],
        "note": "w8"
      }
    }
  ],
  riskFlags: [
    "knee"
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
    "cat-wallsit",
    "physitrack-wallsit",
    "goldring-2014",
    "escamilla-2023",
    "escamilla-2009",
    "watanabe-2022",
    "nhs-knee",
    "nhs-knee-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/wall_sit.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

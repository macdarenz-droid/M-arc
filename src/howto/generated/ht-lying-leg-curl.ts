// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=e8d744461c3772f0850cc457f3daa42a2447da8a6f44dcb73163827e38c1043e
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_lying_leg_curl",
  name: "Lying Leg Curl",
  hashes: { inputsSha256: "e8d744461c3772f0850cc457f3daa42a2447da8a6f44dcb73163827e38c1043e", golden: "c99477cbd3318dfa530d1d3022c3263847a9feed96b9751d5e6b9c7ba1cfc5d1" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"lying-leg-curl-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"lying-leg-curl-n-st-shank.l\" d=\"~#F12HSo_)S1XwqzGT1NbF31D1z)1R2y7!6U3D3(y2D4Wc_8!bJ1NeR5wy2PbH4B2N8x5**1Bc6E1!bdxaze*m)fRlT2zqHa00020000200012120000000000000100002200100100000010002001000001000000000000001000\"/><path id=\"lying-leg-curl-n-st-foot.l\" d=\"~#o2HJdDES1)GeK!S1V4Hc_5Ni!kFsG7J-2YdVI2NcEB1_2-n6-G1weV9W7(tXmEp010101100000200200001010100002000000010000010020\"/><path id=\"lying-leg-curl-n-st-shank.r\" d=\"^0\"/><path id=\"lying-leg-curl-n-st-foot.r\" d=\"^1\"/><path id=\"lying-leg-curl-n-g0-shank.r\" d=\"~#F12PEp(ET1*IqBDU1S8H8nw1EW1Bw1(2J9W1P4(Y1Pz1(6Yd_9(6Jf_1UU1SG1_40!99XP1EF1otWaF5B2BhTcxpXhKc-rI300101010002000000100001012000100002100000000000020000122000100010110000020200120\"/><path id=\"lying-leg-curl-n-g0-foot.r\" d=\"~#o2AYfHFK1BFgzGN1)9W8O3(i!4_y1*P1yI2AP1).1Us.q_dTj(jXA1(g.1I7wuz8)w1200002200010000110200200200200101201000000000200\"/><path id=\"lying-leg-curl-n-g1-shank.r\" d=\"~#F12JWpA-T1BFqxBV1Y3NbB1gOw1zW1-1W9nY4Jx1F_1dNfH5YaWc!8SqS*1F4H2!8J4.nO_1D1h!6Y9D6Egs*rX9Kj.mzg10000000100000111100100000111110101011110100000000110020010100010000020000000000\"/><path id=\"lying-leg-curl-n-g1-foot.r\" d=\"~#o2FDkPwH1-Ak)AI1*c!2zcwfzcwx1VN2!H1YD2xuwD1)9NlXawz1*m_fP6Xk!mS8*w1001000002022000011100000220000100020022001000000\"/><path id=\"lying-leg-curl-n-e-thigh.l\" d=\"~#F12_BA1WGP1.TB1E)O1NbK35E1R*1NcU8Y4F4D2(U1x5So!8(j*2ylOfDU1xaP3I3!6)6O(1S54F1!b4F7Tw1TI1-fRz1D5EB1Sr10000000000000000110020000100111010002000201000000200010001200002010000000000010\"/><path id=\"lying-leg-curl-n-e-kneecap.l\" d=\"~~ywn!KU1_J10\"/><path id=\"lying-leg-curl-n-e-shank.l\" d=\"~#F12F.pHOU1xWpI(V1B2WbB10)2z)1z6W7*2!3W1yz2V7Jdbwc!6_d-5!y2W2w4W5w8_6X(1F10N1(bAdIbyeEokVlKcxp00010020000000002010000000000000020010100001200110000200001210110000020200000200\"/><path id=\"lying-leg-curl-n-e-foot.l\" d=\"~#o2UUpSFG1xyp)EH1VcT3.hP7EqDnV-2eUJ2D7AD1A9wooWG1O3_aAdxtHaAn.o100001000000000000000000000010021000020020100010\"/><path id=\"lying-leg-curl-n-e-shcap.l\" d=\"~~JPP1(xS1wP10\"/><path id=\"lying-leg-curl-n-e-upper.l\" d=\"~#F12WNR1SNT1B.P1-BT1X4I249JrJ8z2G4z1)1G9.9VdEgGfx6zlN2OdqE2mK4U1UpYc18B5O1EkJ9WiDm!kF8_sG300002200000200210100010000010000000020000100000020000020000210000000001000000010\"/><path id=\"lying-leg-curl-n-e-elbowcap.l\" d=\"~~(yW1WzU1Dz10\"/><path id=\"lying-leg-curl-n-e-fore.l\" d=\"~#F12PEW1yYU1EwW1-EU1B2E6H1g(hWk7-6gz2E7VbI1KeB6G9-c.6*7BbB2bE6.2FcUo1H1*4I4IeE3A2AmP9HeSjPa02000000010000000000120000000000000000000011101200020010110000000000000000101020\"/><path id=\"lying-leg-curl-n-e-fist.l\" d=\"~~US-1YD-1ww10\"/><path id=\"lying-leg-curl-n-e-head\" d=\"~#w12ww!1HTR1EE!1V)O1xkIiKaViW2Ib)4*2_7B5_aO8SlTiwdF4S9x2tBjFc!lN7AmE2!kBf(jBjn0001000000010000100101000000000020000011102200000000011010200000\"/><path id=\"lying-leg-curl-n-e-torso\" d=\"~#_12wDX1HHP1-UY1XRP1w6*95B3zhNa*5_9KfSdaJ6WnK7w7-mK5OcS5WfH7SkwhSlNi_gY9J4WfV8!x1-sWqKc9K6dO9KfNd-7U3N7BdX8TfxlK5z6W6_bHc.7P3Xz1TR200000100000000010000000000000021000010010110100121200000022200000100110111001011110000010100011111000000010011000000\"/><path id=\"lying-leg-curl-n-e-thigh.r\" d=\"^6\"/><path id=\"lying-leg-curl-n-e-kneecap.r\" d=\"^7\"/><path id=\"lying-leg-curl-n-e-shank.r\" d=\"^8\"/><path id=\"lying-leg-curl-n-e-foot.r\" d=\"^9\"/><path id=\"lying-leg-curl-n-e-shcap.r\" d=\"^10\"/><path id=\"lying-leg-curl-n-e-upper.r\" d=\"^11\"/><path id=\"lying-leg-curl-n-e-elbowcap.r\" d=\"^12\"/><path id=\"lying-leg-curl-n-e-fore.r\" d=\"^13\"/><path id=\"lying-leg-curl-n-e-fist.r\" d=\"^14\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#lying-leg-curl-n-dots)\"/>\n  <path class=\"floorline\" d=\"M44.35 338.77H313.65\"/><path class=\"eq\" d=\"~MNHq!OX1LAXw10Qwp0z(v)oL)oDkQ0)o)oBkLz(vwpQ)o0A(vwpLwpBkQ0wpwpDkZ\"/><path class=\"eq\" d=\"~M(GsU*Y1LAYs0QF60.RsE6LE6)qQ0E6E6wrL.RsF6QE60!RsF6LF6wrQ0F6F6)qZ\"/><path class=\"eq\" d=\"~MHFswKY1L0PT8Q0F6F6EK8L(qE6QF60*qE6LE6EK8Q0E6E6FK8L*qF6QE60(qF6Z\"/><path class=\"eq\" d=\"~MWXrDyy2L(N20QF60VF2E6LE6V8Q0E6E6W8LVF2F6QE60WF2F6LF6W8Q0F6F6V8Z\"/><path class=\"eq\" d=\"~MwWX1wKY1L0PT8Q0F6F6EK8L(qE6QF60*qE6LE6EK8Q0E6E6FK8L*qF6QE60(qF6Z\"/><path class=\"eq\" d=\"~MJBX1Dyy2L(N20QF60VF2E6LE6V8Q0E6E6W8LVF2F6QE60WF2F6LF6W8Q0F6F6V8Z\"/><path class=\"eq\" d=\"~MHFpN.)1L0z-9Q0)o)oAw9LAkwpQ)o0zkwpLwpAw9Q0wpwpzw9Lzk)oQwp0Ak)oZ\"/><path class=\"eq\" d=\"~M!O_1SW.1LJe.A3Q(1Rd)pJV2LUbPfQRd*1OfUbLy1F-2Q*1SdAqIV2LVbOfQSd(1PfTbZ\"/><path class=\"eq\" d=\"~MwWhDyy2LPTG10Q!m0T!F1.mL.m!mQ0.m.m.mLT!F1!mQ.m0U!F1!mL!m.mQ0!m!m!mZ\"/><path class=\"eq\" d=\"~MUS_1Dyw2L0XK3Q0EiEiP.2LFiFiQGi0GiFiLHiP.2Q0FiHiO.2LGiEiQFi0FiEiZ\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-n-st-shank.l\"/><use href=\"#lying-leg-curl-n-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-n-st-shank.l\"/><use href=\"#lying-leg-curl-n-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-n-st-shank.r\"/><use href=\"#lying-leg-curl-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-n-st-shank.r\"/><use href=\"#lying-leg-curl-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq\" d=\"~M_NoAUT1LzG6xH7Q*b-dHO5AF7L_p(1Q.d(b*1_pLyI6DP6Q(b!dGO5xF7L-p*1Q!d.b(1XpZ\"/><path class=\"eq\" d=\"~~S-fAFJ1HS11\"/><path class=\"eq-pin\" d=\"~~UBhAFJ1F60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-n-g0-shank.r\"/><use href=\"#lying-leg-curl-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-n-g0-shank.r\"/><use href=\"#lying-leg-curl-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq\" d=\"~M__oAYT1L)x2KK9Q.3.hFJ1P)8LYl(dQ.h!3*dYlL!O2WX8Q(3!hzJ1O)8L-l*dQ!h.3(dXlZ\"/><path class=\"eq\" d=\"~~YPkY!G1HS11\"/><path class=\"eq-pin\" d=\"~~_!lY!G1F60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-n-g1-shank.r\"/><use href=\"#lying-leg-curl-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-n-g1-shank.r\"/><use href=\"#lying-leg-curl-n-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MPzpJxU1L(U2VF9Qy5RhKx3yS8LPcUmQTh)4TmScLI(1A!8Q)4ShSx3zS8LRcRmQShy5UmOcZ\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-n-e-thigh.l\"/><use href=\"#lying-leg-curl-n-e-kneecap.l\"/><use href=\"#lying-leg-curl-n-e-shank.l\"/><use href=\"#lying-leg-curl-n-e-foot.l\"/><use href=\"#lying-leg-curl-n-e-shcap.l\"/><use href=\"#lying-leg-curl-n-e-upper.l\"/><use href=\"#lying-leg-curl-n-e-elbowcap.l\"/><use href=\"#lying-leg-curl-n-e-fore.l\"/><use href=\"#lying-leg-curl-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-n-e-thigh.l\"/><use href=\"#lying-leg-curl-n-e-kneecap.l\"/><use href=\"#lying-leg-curl-n-e-shank.l\"/><use href=\"#lying-leg-curl-n-e-foot.l\"/><use href=\"#lying-leg-curl-n-e-shcap.l\"/><use href=\"#lying-leg-curl-n-e-upper.l\"/><use href=\"#lying-leg-curl-n-e-elbowcap.l\"/><use href=\"#lying-leg-curl-n-e-fore.l\"/><use href=\"#lying-leg-curl-n-e-fist.l\"/></g></g><path class=\"eq\" d=\"~~U-pyyH1HS11\"/><path class=\"eq-pin\" d=\"~~WBryyH1F60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-n-e-head\"/><use href=\"#lying-leg-curl-n-e-torso\"/><use href=\"#lying-leg-curl-n-e-thigh.r\"/><use href=\"#lying-leg-curl-n-e-kneecap.r\"/><use href=\"#lying-leg-curl-n-e-shank.r\"/><use href=\"#lying-leg-curl-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-n-e-head\"/><use href=\"#lying-leg-curl-n-e-torso\"/><use href=\"#lying-leg-curl-n-e-thigh.r\"/><use href=\"#lying-leg-curl-n-e-kneecap.r\"/><use href=\"#lying-leg-curl-n-e-shank.r\"/><use href=\"#lying-leg-curl-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-n-e-shcap.r\"/><use href=\"#lying-leg-curl-n-e-upper.r\"/><use href=\"#lying-leg-curl-n-e-elbowcap.r\"/><use href=\"#lying-leg-curl-n-e-fore.r\"/><use href=\"#lying-leg-curl-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-n-e-shcap.r\"/><use href=\"#lying-leg-curl-n-e-upper.r\"/><use href=\"#lying-leg-curl-n-e-elbowcap.r\"/><use href=\"#lying-leg-curl-n-e-fore.r\"/><use href=\"#lying-leg-curl-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~~NRn!KU1Nr0\"/><path class=\"eq-pin\" d=\"~~UDo!KU1F60\"/><path class=\"eq-line m-line\" d=\"~M!!fFSP1L-3BjLx7!2LO5J5L-2A7L1U7L(2A7LJ5J5LA7!2LU72LA7*2LJ5I5L(2z7L1T7L-2z7LO5I5Lx7*2\"/><circle class=\"joint\" cx=\"256.06\" cy=\"256.31\" r=\"2.25\"/><circle class=\"joint\" cx=\"282.59\" cy=\"266.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"187.01\" cy=\"259.47\" r=\"2.25\"/><circle class=\"joint\" cx=\"124.94\" cy=\"268.46\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#S20(WayGP1TSaRWP1e6c4e6c4c8e6c6a8e8a8c8c88ae88aaa8acc8a8a8c8c8c8a6e6c6e6c4c6e4c4g4c2e4c0g4c0g2c2g00010001000000000000002000000000022200000020002001100000210010101001002002000000110000002020010101000012000200000000000000011012000000101001001200200000020020000000\"/><path class=\"arrow\" d=\"~MDNpJzD1L)A1WjLyA1B-1Z\"/></g><path class=\"leader\" d=\"M120.81 269.96L82.56 306H72.56\"/><circle class=\"anchor\" cx=\"120.81\" cy=\"269.96\" r=\"1.5\"/><path class=\"leader\" d=\"~MD(z1JWN1L0.R2\"/><circle class=\"anchor\" cx=\"184.03\" cy=\"239.1\" r=\"1.5\"/><path class=\"leader\" d=\"M224.64 241.86L235 216H245\"/><circle class=\"anchor\" cx=\"224.64\" cy=\"241.86\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"lying-leg-curl-n-axis\" data-key=\"axis\" data-cue=\"Line your knees up with the machine's axis.\" class=\"plate-callout two\" style=\"left:3.91%;top:79.33%\" aria-pressed=\"true\">Knee at<br>axis</button><button type=\"button\" id=\"lying-leg-curl-n-hips\" data-key=\"hips\" data-cue=\"Keep the front of your hips pressed on the pad.\" class=\"plate-callout two\" style=\"left:44.69%;top:51.96%\" aria-pressed=\"false\">Hips on<br>pad</button><button type=\"button\" id=\"lying-leg-curl-n-back\" data-key=\"back\" data-cue=\"Brace your abs so your low back doesn't arch.\" class=\"plate-callout two\" style=\"left:67.04%;top:54.19%\" aria-pressed=\"false\">Low back<br>still</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"lying-leg-curl-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"lying-leg-curl-m-st-shank.l\" d=\"^0\"/><path id=\"lying-leg-curl-m-st-foot.l\" d=\"^1\"/><path id=\"lying-leg-curl-m-st-shank.r\" d=\"^0\"/><path id=\"lying-leg-curl-m-st-foot.r\" d=\"^1\"/><path id=\"lying-leg-curl-m-g0-shank.r\" d=\"^2\"/><path id=\"lying-leg-curl-m-g0-foot.r\" d=\"^3\"/><path id=\"lying-leg-curl-m-g1-shank.r\" d=\"^4\"/><path id=\"lying-leg-curl-m-g1-foot.r\" d=\"^5\"/><path id=\"lying-leg-curl-m-e-thigh.l\" d=\"^6\"/><path id=\"lying-leg-curl-m-e-kneecap.l\" d=\"^7\"/><path id=\"lying-leg-curl-m-e-shank.l\" d=\"^8\"/><path id=\"lying-leg-curl-m-e-foot.l\" d=\"^9\"/><path id=\"lying-leg-curl-m-e-shcap.l\" d=\"^10\"/><path id=\"lying-leg-curl-m-e-upper.l\" d=\"^11\"/><path id=\"lying-leg-curl-m-e-elbowcap.l\" d=\"^12\"/><path id=\"lying-leg-curl-m-e-fore.l\" d=\"^13\"/><path id=\"lying-leg-curl-m-e-fist.l\" d=\"^14\"/><path id=\"lying-leg-curl-m-e-head\" d=\"^15\"/><path id=\"lying-leg-curl-m-e-torso\" d=\"^16\"/><path id=\"lying-leg-curl-m-e-thigh.r\" d=\"^6\"/><path id=\"lying-leg-curl-m-e-kneecap.r\" d=\"^7\"/><path id=\"lying-leg-curl-m-e-shank.r\" d=\"^8\"/><path id=\"lying-leg-curl-m-e-foot.r\" d=\"^9\"/><path id=\"lying-leg-curl-m-e-shcap.r\" d=\"^10\"/><path id=\"lying-leg-curl-m-e-upper.r\" d=\"^11\"/><path id=\"lying-leg-curl-m-e-elbowcap.r\" d=\"^12\"/><path id=\"lying-leg-curl-m-e-fore.r\" d=\"^13\"/><path id=\"lying-leg-curl-m-e-fist.r\" d=\"^14\"/><path id=\"lying-leg-curl-m-m-head\" d=\"~#w12(K_1H_F1)!-1xGE1zqB7.h*bX2IbX5bS4z8_5OcYaGqPdB2S7B6K9TgYk!dUgJgP7UjI4UoOhy80000001001110000101012000212000001010100001100000000202000000000\"/><path id=\"lying-leg-curl-m-mf-torso\" d=\"~#_12ySV1W.G1z)W1xKG1oRbO1X2RawhrSbR7wjA6S8NgVrX4XF1*6zbS5WfH7SkwhSlNi_gY9J4WfV8!x1-sWqKcwpXdYb*T1G_1Wx1I5Y6kzf.e*9ElY4I2W8wgU5G5W6*A2OY100001020000010000010012100000202000000010110100121200000022200000100111100002000001000001100101000100000100020000002\"/><path id=\"lying-leg-curl-m-mf-thigh.l\" d=\"^6\"/><path id=\"lying-leg-curl-m-mf-kneecap.l\" d=\"^7\"/><path id=\"lying-leg-curl-m-mf-shank.l\" d=\"^8\"/><path id=\"lying-leg-curl-m-mf-foot.l\" d=\"^9\"/><path id=\"lying-leg-curl-m-mf-shcap.l\" d=\"~~YEP1NYK1wP10\"/><path id=\"lying-leg-curl-m-mf-upper.l\" d=\"~#F12!WP1N.N1VzP1zFN1T4)467ysAnz1K5jT2-c-jX6Bk)bEbRkO5VkObR2dO5p_oSq56G5G4xiH5H9NrHgJfwsN720020000000200002020000000000100000110000020020000000100000000000000201010000002\"/><path id=\"lying-leg-curl-m-mf-elbowcap.l\" d=\"~~_-V1STS1Dz10\"/><path id=\"lying-leg-curl-m-mf-fore.l\" d=\"~#F12!!V1NBT1)UV1xRS1G2-7J1uHjUrbx8iG2)9.i7OeK5X9Bc.7XaIiG2nT6T4Hdwv0U1G5x6zcpeFmH8yfYi(b00200000001210002000000001000002000000001000100001000010000000001000000001010100\"/><path id=\"lying-leg-curl-m-mf-fist.l\" d=\"^14\"/><path id=\"lying-leg-curl-m-mf-thigh.r\" d=\"^6\"/><path id=\"lying-leg-curl-m-mf-kneecap.r\" d=\"^7\"/><path id=\"lying-leg-curl-m-mf-shank.r\" d=\"^8\"/><path id=\"lying-leg-curl-m-mf-foot.r\" d=\"^9\"/><path id=\"lying-leg-curl-m-mf-shcap.r\" d=\"^47\"/><path id=\"lying-leg-curl-m-mf-upper.r\" d=\"^48\"/><path id=\"lying-leg-curl-m-mf-elbowcap.r\" d=\"^49\"/><path id=\"lying-leg-curl-m-mf-fore.r\" d=\"^50\"/><path id=\"lying-leg-curl-m-mf-fist.r\" d=\"^14\"/><path id=\"lying-leg-curl-m-mo-0\" d=\"^15\"/><path id=\"lying-leg-curl-m-mo-1\" d=\"^16\"/><path id=\"lying-leg-curl-m-mo-2\" d=\"^6\"/><path id=\"lying-leg-curl-m-mo-3\" d=\"^7\"/><path id=\"lying-leg-curl-m-mo-4\" d=\"^8\"/><path id=\"lying-leg-curl-m-mo-5\" d=\"^9\"/><path id=\"lying-leg-curl-m-mo-6\" d=\"^10\"/><path id=\"lying-leg-curl-m-mo-7\" d=\"^11\"/><path id=\"lying-leg-curl-m-mo-8\" d=\"^12\"/><path id=\"lying-leg-curl-m-mo-9\" d=\"^13\"/><path id=\"lying-leg-curl-m-mo-10\" d=\"^14\"/><path id=\"lying-leg-curl-m-mo-11\" d=\"^6\"/><path id=\"lying-leg-curl-m-mo-12\" d=\"^7\"/><path id=\"lying-leg-curl-m-mo-13\" d=\"^8\"/><path id=\"lying-leg-curl-m-mo-14\" d=\"^9\"/><path id=\"lying-leg-curl-m-mo-15\" d=\"^10\"/><path id=\"lying-leg-curl-m-mo-16\" d=\"^11\"/><path id=\"lying-leg-curl-m-mo-17\" d=\"^12\"/><path id=\"lying-leg-curl-m-mo-18\" d=\"^13\"/><path id=\"lying-leg-curl-m-mo-19\" d=\"^14\"/><path id=\"lying-leg-curl-m-mo-20\" d=\"^18\"/><path id=\"lying-leg-curl-m-mo-21\" d=\"^19\"/><path id=\"lying-leg-curl-m-mo-22\" d=\"^20\"/><path id=\"lying-leg-curl-m-mo-23\" d=\"^21\"/><path id=\"lying-leg-curl-m-mo-24\" d=\"^22\"/><path id=\"lying-leg-curl-m-mo-25\" d=\"^23\"/><path id=\"lying-leg-curl-m-mo-26\" d=\"^34\"/><path id=\"lying-leg-curl-m-mo-27\" d=\"^35\"/><path id=\"lying-leg-curl-m-mo-28\" d=\"^36\"/><path id=\"lying-leg-curl-m-mo-29\" d=\"^37\"/><path id=\"lying-leg-curl-m-mo-30\" d=\"^38\"/><path id=\"lying-leg-curl-m-mo-31\" d=\"^24\"/><path id=\"lying-leg-curl-m-mo-32\" d=\"^25\"/><path id=\"lying-leg-curl-m-mo-33\" d=\"^26\"/><path id=\"lying-leg-curl-m-mo-34\" d=\"^27\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#lying-leg-curl-m-dots)\"/>\n  <path class=\"floorline\" d=\"^17\"/><path class=\"eq\" d=\"^18\"/><path class=\"eq\" d=\"^19\"/><path class=\"eq\" d=\"^20\"/><path class=\"eq\" d=\"^21\"/><path class=\"eq\" d=\"^22\"/><path class=\"eq\" d=\"^23\"/><path class=\"eq\" d=\"^24\"/><path class=\"eq\" d=\"^25\"/><path class=\"eq\" d=\"^26\"/><path class=\"eq\" d=\"^27\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-m-st-shank.l\"/><use href=\"#lying-leg-curl-m-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-m-st-shank.l\"/><use href=\"#lying-leg-curl-m-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-m-st-shank.r\"/><use href=\"#lying-leg-curl-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-m-st-shank.r\"/><use href=\"#lying-leg-curl-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq\" d=\"^28\"/><path class=\"eq\" d=\"^29\"/><path class=\"eq-pin\" d=\"^30\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-m-g0-shank.r\"/><use href=\"#lying-leg-curl-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-m-g0-shank.r\"/><use href=\"#lying-leg-curl-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq\" d=\"^31\"/><path class=\"eq\" d=\"^32\"/><path class=\"eq-pin\" d=\"^33\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-m-g1-shank.r\"/><use href=\"#lying-leg-curl-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-m-g1-shank.r\"/><use href=\"#lying-leg-curl-m-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^34\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-m-e-thigh.l\"/><use href=\"#lying-leg-curl-m-e-kneecap.l\"/><use href=\"#lying-leg-curl-m-e-shank.l\"/><use href=\"#lying-leg-curl-m-e-foot.l\"/><use href=\"#lying-leg-curl-m-e-shcap.l\"/><use href=\"#lying-leg-curl-m-e-upper.l\"/><use href=\"#lying-leg-curl-m-e-elbowcap.l\"/><use href=\"#lying-leg-curl-m-e-fore.l\"/><use href=\"#lying-leg-curl-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-m-e-thigh.l\"/><use href=\"#lying-leg-curl-m-e-kneecap.l\"/><use href=\"#lying-leg-curl-m-e-shank.l\"/><use href=\"#lying-leg-curl-m-e-foot.l\"/><use href=\"#lying-leg-curl-m-e-shcap.l\"/><use href=\"#lying-leg-curl-m-e-upper.l\"/><use href=\"#lying-leg-curl-m-e-elbowcap.l\"/><use href=\"#lying-leg-curl-m-e-fore.l\"/><use href=\"#lying-leg-curl-m-e-fist.l\"/></g></g><path class=\"eq\" d=\"^35\"/><path class=\"eq-pin\" d=\"^36\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-m-e-head\"/><use href=\"#lying-leg-curl-m-e-torso\"/><use href=\"#lying-leg-curl-m-e-thigh.r\"/><use href=\"#lying-leg-curl-m-e-kneecap.r\"/><use href=\"#lying-leg-curl-m-e-shank.r\"/><use href=\"#lying-leg-curl-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-m-e-head\"/><use href=\"#lying-leg-curl-m-e-torso\"/><use href=\"#lying-leg-curl-m-e-thigh.r\"/><use href=\"#lying-leg-curl-m-e-kneecap.r\"/><use href=\"#lying-leg-curl-m-e-shank.r\"/><use href=\"#lying-leg-curl-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-m-e-shcap.r\"/><use href=\"#lying-leg-curl-m-e-upper.r\"/><use href=\"#lying-leg-curl-m-e-elbowcap.r\"/><use href=\"#lying-leg-curl-m-e-fore.r\"/><use href=\"#lying-leg-curl-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-m-e-shcap.r\"/><use href=\"#lying-leg-curl-m-e-upper.r\"/><use href=\"#lying-leg-curl-m-e-elbowcap.r\"/><use href=\"#lying-leg-curl-m-e-fore.r\"/><use href=\"#lying-leg-curl-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^37\"/><path class=\"eq-pin\" d=\"^38\"/><path class=\"eq-line m-line\" d=\"^39\"/><circle class=\"joint\" cx=\"256.06\" cy=\"256.31\" r=\"2.25\"/><circle class=\"joint\" cx=\"282.59\" cy=\"266.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"187.01\" cy=\"259.47\" r=\"2.25\"/><circle class=\"joint\" cx=\"124.94\" cy=\"268.46\" r=\"2.25\"/></g><mask id=\"lying-leg-curl-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#lying-leg-curl-m-m-head\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-torso\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-shank.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-foot.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-upper.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-fore.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-fist.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-shank.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-foot.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-upper.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-fore.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mf-fist.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#lying-leg-curl-m-mmask)\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-m-m-head\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MH(S1DKH1LT56L23L27L03L10L14L56L5cL7gL9cL5aL7cL56L18L04L08L42L24L02L46L36L08L38L5cL3cL7cL9eL3aL38L08L24L64L62L48L0gL2aL42L65L6bLafLcrLgfLcbLebL4dL4hL0hL5nL7nL7rL0vL3lL1jL1bL37L31L14L93L3fL77L03L12L26L4aL8iL4aL28L48L28L48L2cL4aL6aL0cL2aL2aL4cL68L8cLacLcaLacL8cL8cL8aLaaLa8L8aL84LecLacLcaL86L68L80L22L21L24L44L26\"/><path class=\"leader m\" d=\"M220.13 235.7L193.77 174H183.77\"/></g>\n<g class=\"plate-zoom\" data-view=\"mistake\" data-k=\"1.5\" data-c=\"250 150\" data-src=\"222.38 238.81\"><defs><clipPath id=\"lying-leg-curl-m-zclip\"><circle cx=\"250\" cy=\"150\" r=\"52\"/></clipPath></defs><circle class=\"pz-src\" cx=\"222.38\" cy=\"238.81\" r=\"34.67\"/><path class=\"pz-link\" d=\"~MDNK1UBF1L_b-B1\"/><circle class=\"pz-bg\" cx=\"250\" cy=\"150\" r=\"52\"/><g class=\"pz-in\" clip-path=\"url(#lying-leg-curl-m-zclip)\">\n  <defs><pattern id=\"lying-leg-curl-m-z-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"lying-leg-curl-m-z-st-shank.l\" d=\"~#F12yRkW_z1XWmTFA1Fh_45_1V(2-3WaFaH5_4PA3F6wjFd_hA2UlO8yz3NhN6K3WcO7*!2Gi8*1!hhzfBlKy1xoGw1.3BE1Nf00002020000200000010102200002100002000100020000010020020010002002000200000121020\"/><path id=\"lying-leg-curl-m-z-st-foot.l\" d=\"M19.21 177.55C18.55 174.44 14.65 173.66 12.08 172.45C9.52 171.25 6.35 170.29 3.83 170.32C1.31 170.34 -1.57 170.71 -3.01 172.6C-4.46 174.49 -3.95 175.07 -4.86 181.66C-5.77 188.26 -7.82 205.03 -8.47 212.17C-9.12 219.31 -9.17 221.88 -8.77 224.51C-8.38 227.13 -7.09 227.74 -6.08 227.92C-5.07 228.1 -3.84 228.06 -2.72 225.61C-1.59 223.17 -1.01 217.76 0.68 213.25C2.37 208.75 4.88 202.28 7.44 198.59C10.01 194.89 14.1 194.61 16.06 191.1C18.03 187.59 19.88 180.66 19.21 177.55Z\"/><path id=\"lying-leg-curl-m-z-st-shank.r\" d=\"^54\"/><path id=\"lying-leg-curl-m-z-st-foot.r\" d=\"^55\"/><path id=\"lying-leg-curl-m-z-e-thigh.l\" d=\"~#F12H(B1N-vGzF1VGvwhG55-1K!2WiwdA7J6F3NO2V7YA1NdyuI4NvGnJN2BfD5.4JaTa-*2N88Y1_h8_a*P1Ix2VnIV1W7*X1JG100100100000000002101000110020000000100000010100000020000001002111102001000000000\"/><path id=\"lying-leg-curl-m-z-e-kneecap.l\" d=\"~~WBi_)B1Dz20\"/><path id=\"lying-leg-curl-m-z-e-shank.l\" d=\"~#F12NNm(xD1TDmRFF1E3Sh.10K4V(2G9SbG4_5S2PA3RbDkh!hHa_kV8FA3w4w6P8AcFaE(2!12A2_h_j*g(kKA1y1Ow1-iVB120000000001010020010002001200000101010000001200010200101000010000100000000010000\"/><path id=\"lying-leg-curl-m-z-e-foot.l\" d=\"~#o2PAmYElTFl.WmxjK5XqDbOE1_y1OD4mwT3WaA-1_dwA1y1U(1E5DgWjVI1PfYy1KB1000000010100000000000000000020002000000000002120\"/><path id=\"lying-leg-curl-m-z-e-shcap.l\" d=\"~~DNY1!Ky1wF20\"/><path id=\"lying-leg-curl-m-z-e-upper.l\" d=\"~#F12U.-1_PA1G(Y1VzA1B7R36dyG1NcB3G6V1z3*dVeRkKo)mz9TvW3GkD1G3A1V6J2ND1Aj5cT7E2OuyeAsFx1FvNcFI1)400002000001010000001000000000000110000101010120001101010002002000022000000200000\"/><path id=\"lying-leg-curl-m-z-e-elbowcap.l\" d=\"~~A_w2PPB1_U10\"/><path id=\"lying-leg-curl-m-z-e-fore.l\" d=\"~#F12(wx2yOD1zWw2TWB1B3O9(1q(qyvdEaoB3-aOhx2VlG9xeBjBa)b-gE3fE9I4Di_A12D2O7V6Rl.4D3Fx1HeNlJtYf00002120010000111011010000000101010010001010010011111000021100010000000000000000\"/><path id=\"lying-leg-curl-m-z-e-fist.l\" d=\"~~UxD2ABK1wP10\"/><path id=\"lying-leg-curl-m-z-e-head\" d=\"~#w12WVG2(Xx1RwH2RHvxuKrXfzsy4)gK7O4WbV7DgXcNw1*rNjH6Hex3G1XsHiYw1ybDx1G3JvTm!t*sz10200000010101010100002020000001101000000000000121000200000101000\"/><path id=\"lying-leg-curl-m-z-e-torso\" d=\"~#_12UNy2N_v-UA2TBw1(8.e5X4-pSf-8!eBnDkeW9Sz1GbNaxy1)7.iD8WnybWuPpNw1SrFpYeP6Nnzd_S1zI1yF1VidR9lIeznHkXbF5AbTjxdOnTvB8B9AaWhHiXbJ5VV1K_300000100021010002000110000002020020020001000010100000000010100000000200000001012000020220000010100101201000002101200\"/><path id=\"lying-leg-curl-m-z-e-thigh.r\" d=\"^56\"/><path id=\"lying-leg-curl-m-z-e-kneecap.r\" d=\"^57\"/><path id=\"lying-leg-curl-m-z-e-shank.r\" d=\"^58\"/><path id=\"lying-leg-curl-m-z-e-foot.r\" d=\"^59\"/><path id=\"lying-leg-curl-m-z-e-shcap.r\" d=\"^60\"/><path id=\"lying-leg-curl-m-z-e-upper.r\" d=\"^61\"/><path id=\"lying-leg-curl-m-z-e-elbowcap.r\" d=\"^62\"/><path id=\"lying-leg-curl-m-z-e-fore.r\" d=\"^63\"/><path id=\"lying-leg-curl-m-z-e-fist.r\" d=\"^64\"/><path id=\"lying-leg-curl-m-z-m-head\" d=\"~#w12SHE2NSkzRD2RFiGE1-aVq.hB4)gR8j_6BcY8XiygRE1HkB3HbE9Be)oDv(k(oJoFbStV6!A1zqDc1000000200101100010101002011100000000000021010100002100010022000\"/><path id=\"lying-leg-curl-m-z-mf-torso\" d=\"~#_12Yww2PAmIAy2TNlF1EhK2B4XfSpG1HhGbPsA9(cWoVG1B7x*1EaXgD8WnybWuPpNw1SrFpYeP6Nnzd_S1zI1yF1ViSB1OkShxN2OX2US1x8yaw1TmIm*e-vy7T3AdAoJ8x8AaKE3-U200021010100000121000000101000100100020001000010100000000010100000000200200000102100101000000000000020020000012000000\"/><path id=\"lying-leg-curl-m-z-mf-thigh.l\" d=\"^56\"/><path id=\"lying-leg-curl-m-z-mf-kneecap.l\" d=\"^57\"/><path id=\"lying-leg-curl-m-z-mf-shank.l\" d=\"^58\"/><path id=\"lying-leg-curl-m-z-mf-foot.l\" d=\"^59\"/><path id=\"lying-leg-curl-m-z-mf-shcap.l\" d=\"~~FxY1U)rwF20\"/><path id=\"lying-leg-curl-m-z-mf-upper.l\" d=\"~#F12wYY1DUtE.X1EXs*6O7a9AH1Uy1V1z8v*3BjXtzaEuxi.gXuE8)uBh*3nE8B1HB1_E1ba*7K6xr(7!dAG1SoAnwH1Db01010000200020002001000200000000002000000000000000200010001200020000010000011100\"/><path id=\"lying-leg-curl-m-z-mf-elbowcap.l\" d=\"~~JJw2FFz1_U10\"/><path id=\"lying-leg-curl-m-z-mf-fore.l\" d=\"~#F12(Pw2AzA1xBw2RAz1R3Vby2J1ytNG1jxcqR3)eEs9VlB8XeGiXbzgRrK3B1.9.6!jSN12J2x8z9)hz1eHx1UcPmwsyi01000000020001200101000100000020000000002000202002000210100200200200100100000200\"/><path id=\"lying-leg-curl-m-z-mf-fist.l\" d=\"^64\"/><path id=\"lying-leg-curl-m-z-mf-thigh.r\" d=\"^56\"/><path id=\"lying-leg-curl-m-z-mf-kneecap.r\" d=\"^57\"/><path id=\"lying-leg-curl-m-z-mf-shank.r\" d=\"^58\"/><path id=\"lying-leg-curl-m-z-mf-foot.r\" d=\"^59\"/><path id=\"lying-leg-curl-m-z-mf-shcap.r\" d=\"^69\"/><path id=\"lying-leg-curl-m-z-mf-upper.r\" d=\"^70\"/><path id=\"lying-leg-curl-m-z-mf-elbowcap.r\" d=\"^71\"/><path id=\"lying-leg-curl-m-z-mf-fore.r\" d=\"^72\"/><path id=\"lying-leg-curl-m-z-mf-fist.r\" d=\"^64\"/><path id=\"lying-leg-curl-m-z-mo-0\" d=\"^65\"/><path id=\"lying-leg-curl-m-z-mo-1\" d=\"^66\"/><path id=\"lying-leg-curl-m-z-mo-2\" d=\"^56\"/><path id=\"lying-leg-curl-m-z-mo-3\" d=\"^57\"/><path id=\"lying-leg-curl-m-z-mo-4\" d=\"^58\"/><path id=\"lying-leg-curl-m-z-mo-5\" d=\"^59\"/><path id=\"lying-leg-curl-m-z-mo-6\" d=\"^60\"/><path id=\"lying-leg-curl-m-z-mo-7\" d=\"^61\"/><path id=\"lying-leg-curl-m-z-mo-8\" d=\"^62\"/><path id=\"lying-leg-curl-m-z-mo-9\" d=\"^63\"/><path id=\"lying-leg-curl-m-z-mo-10\" d=\"^64\"/><path id=\"lying-leg-curl-m-z-mo-11\" d=\"^56\"/><path id=\"lying-leg-curl-m-z-mo-12\" d=\"^57\"/><path id=\"lying-leg-curl-m-z-mo-13\" d=\"^58\"/><path id=\"lying-leg-curl-m-z-mo-14\" d=\"^59\"/><path id=\"lying-leg-curl-m-z-mo-15\" d=\"^60\"/><path id=\"lying-leg-curl-m-z-mo-16\" d=\"^61\"/><path id=\"lying-leg-curl-m-z-mo-17\" d=\"^62\"/><path id=\"lying-leg-curl-m-z-mo-18\" d=\"^63\"/><path id=\"lying-leg-curl-m-z-mo-19\" d=\"^64\"/><path id=\"lying-leg-curl-m-z-mo-20\" d=\"~MYYm_SH1LY.R10Qwp0XyR1)oL)oG7Q0)o)oH7LXyR1wpQ)o0YyR1wpLwpH7Q0wpwpG7Z\"/><path id=\"lying-leg-curl-m-z-mo-21\" d=\"~MNxqJXJ1LJHI10QF60zAI1E6LE6-R1Q0E6E6_R1LzAI1F6QE60AAI1F6LF6_R1Q0F6F6-R1Z\"/><path id=\"lying-leg-curl-m-z-mo-22\" d=\"~MyyqJ.I1L0PzdQ0F6F6E*cL_R1E6QF60-R1E6LE6E*cQ0E6E6F*cL-R1F6QE60_R1F6Z\"/><path id=\"lying-leg-curl-m-z-mo-23\" d=\"~MwDpFN_1LW!30QF60KW3E6LE6ImQ0E6E6JmLKW3F6QE60NW3F6LF6JmQ0F6F6ImZ\"/><path id=\"lying-leg-curl-m-z-mo-24\" d=\"~MWDz2J.I1L0PzdQ0F6F6E*cL_R1E6QF60-R1E6LE6E*cQ0E6E6F*cL-R1F6QE60_R1F6Z\"/><path id=\"lying-leg-curl-m-z-mo-25\" d=\"~MUHy2FN_1LU!30QF60IW3E6LE6ImQ0E6E6JmLIW3F6QE60JW3F6LF6JmQ0F6F6ImZ\"/><path id=\"lying-leg-curl-m-z-mo-26\" d=\"~MAHlHOB1L!w4TxeQ!6xoxS4WydLScUtQxo.6GqNiL.x3SPdQ*6wo(R4-ydLKcOtQwo!6DqRiZ\"/><path id=\"lying-leg-curl-m-z-mo-27\" d=\"~~yJmyNmNI20\"/><path id=\"lying-leg-curl-m-z-mo-28\" d=\"~~FRoyNmF60\"/><path id=\"lying-leg-curl-m-z-mo-29\" d=\"~~Y)i_)B1AG12\"/><path id=\"lying-leg-curl-m-z-mo-30\" d=\"~~Uyk_)B1F60\"/><path id=\"lying-leg-curl-m-z-mo-31\" d=\"~MySlWPX1L0XNfQ0)o)oYVeLG7wpQ)o0H7wpLwpYVeQ0wpwpXVeLH7)oQwp0G7)oZ\"/><path id=\"lying-leg-curl-m-z-mo-32\" d=\"~MNKE2_!P1LUlGX4Q(2IkxE1yw4LNhFnQIk*2GnNhLY1!B4Q*2HkwE1xw4LKhEnQJk!2FnKhZ\"/><path id=\"lying-leg-curl-m-z-mo-33\" d=\"~MH*9FN_1L!)(10Qwp0.D(1)oL)oN6Q0)o)oK6L.D(1wpQ)o0!D(1wpLwpK6Q0wpwpN6Z\"/><path id=\"lying-leg-curl-m-z-mo-34\" d=\"~MURE2WPX1L0KG5Q0)o)oNP4LAkwpQ)o0zkwpLwpNP4Q0wpwpKP4Lzk)oQwp0Ak)oZ\"/></defs>\n  \n  <path class=\"floorline\" d=\"M-17.06 299.74H386.89\"/><path class=\"eq\" d=\"^73\"/><path class=\"eq\" d=\"^74\"/><path class=\"eq\" d=\"^75\"/><path class=\"eq\" d=\"^76\"/><path class=\"eq\" d=\"^77\"/><path class=\"eq\" d=\"^78\"/><path class=\"eq\" d=\"^84\"/><path class=\"eq\" d=\"^85\"/><path class=\"eq\" d=\"^86\"/><path class=\"eq\" d=\"^87\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-m-z-st-shank.l\"/><use href=\"#lying-leg-curl-m-z-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-m-z-st-shank.l\"/><use href=\"#lying-leg-curl-m-z-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-m-z-st-shank.r\"/><use href=\"#lying-leg-curl-m-z-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-m-z-st-shank.r\"/><use href=\"#lying-leg-curl-m-z-st-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^79\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-m-z-e-thigh.l\"/><use href=\"#lying-leg-curl-m-z-e-kneecap.l\"/><use href=\"#lying-leg-curl-m-z-e-shank.l\"/><use href=\"#lying-leg-curl-m-z-e-foot.l\"/><use href=\"#lying-leg-curl-m-z-e-shcap.l\"/><use href=\"#lying-leg-curl-m-z-e-upper.l\"/><use href=\"#lying-leg-curl-m-z-e-elbowcap.l\"/><use href=\"#lying-leg-curl-m-z-e-fore.l\"/><use href=\"#lying-leg-curl-m-z-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-m-z-e-thigh.l\"/><use href=\"#lying-leg-curl-m-z-e-kneecap.l\"/><use href=\"#lying-leg-curl-m-z-e-shank.l\"/><use href=\"#lying-leg-curl-m-z-e-foot.l\"/><use href=\"#lying-leg-curl-m-z-e-shcap.l\"/><use href=\"#lying-leg-curl-m-z-e-upper.l\"/><use href=\"#lying-leg-curl-m-z-e-elbowcap.l\"/><use href=\"#lying-leg-curl-m-z-e-fore.l\"/><use href=\"#lying-leg-curl-m-z-e-fist.l\"/></g></g><path class=\"eq\" d=\"^80\"/><path class=\"eq-pin\" d=\"^81\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-m-z-e-head\"/><use href=\"#lying-leg-curl-m-z-e-torso\"/><use href=\"#lying-leg-curl-m-z-e-thigh.r\"/><use href=\"#lying-leg-curl-m-z-e-kneecap.r\"/><use href=\"#lying-leg-curl-m-z-e-shank.r\"/><use href=\"#lying-leg-curl-m-z-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-m-z-e-head\"/><use href=\"#lying-leg-curl-m-z-e-torso\"/><use href=\"#lying-leg-curl-m-z-e-thigh.r\"/><use href=\"#lying-leg-curl-m-z-e-kneecap.r\"/><use href=\"#lying-leg-curl-m-z-e-shank.r\"/><use href=\"#lying-leg-curl-m-z-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-m-z-e-shcap.r\"/><use href=\"#lying-leg-curl-m-z-e-upper.r\"/><use href=\"#lying-leg-curl-m-z-e-elbowcap.r\"/><use href=\"#lying-leg-curl-m-z-e-fore.r\"/><use href=\"#lying-leg-curl-m-z-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#lying-leg-curl-m-z-e-shcap.r\"/><use href=\"#lying-leg-curl-m-z-e-upper.r\"/><use href=\"#lying-leg-curl-m-z-e-elbowcap.r\"/><use href=\"#lying-leg-curl-m-z-e-fore.r\"/><use href=\"#lying-leg-curl-m-z-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^82\"/><path class=\"eq-pin\" d=\"^83\"/><path class=\"eq-line m-line\" d=\"~M(P7JDw1LX5.sLTaN4Lx8y8LK4UaL0PbLN4UaLy8y8LUaN4LPb0LUaI4Ly8B8LN4RaL0ObLK4RaLx8B8LTaI4\"/><circle class=\"joint\" cx=\"300.51\" cy=\"176.3\" r=\"2.25\"/><circle class=\"joint\" cx=\"340.3\" cy=\"192.08\" r=\"2.25\"/><circle class=\"joint\" cx=\"196.93\" cy=\"181.03\" r=\"2.25\"/><circle class=\"joint\" cx=\"103.82\" cy=\"194.53\" r=\"2.25\"/></g><mask id=\"lying-leg-curl-m-z-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#lying-leg-curl-m-z-m-head\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-torso\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-thigh.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-kneecap.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-shank.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-foot.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-shcap.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-upper.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-fore.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-fist.l\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-thigh.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-kneecap.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-shank.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-foot.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-shcap.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-upper.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-fore.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mf-fist.r\" fill=\"#000\"/><use href=\"#lying-leg-curl-m-z-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#lying-leg-curl-m-z-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#lying-leg-curl-m-z-mmask)\"><g class=\"u-stroke\"><use href=\"#lying-leg-curl-m-z-m-head\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MAz!1Y(mLI88L05L29L25L11L58L58L9iLbmLdmLbeL9eL7cL1cL38L28L66L26L42L0aL08L5aL1gL7eL9kL9iLdkL7gL3eL1aL66L66La2L6eL0oL4cL44L85LchLgrLeB1LotLobLejLalL6nL1vL7vLbz1LbI1L1K1L1x1L3tL3hL5bL51L54L75LblL7bL37L14L68L4gLcqL6iL4cL48L4eL4eL6eL6gL6iL4gL0eL4iL6cLaiLcgLcgLkiLegLekLaiLeeLeeLeeLccLgaLggLkiLeeLccLc8L64L80L20L42L48L68\"/></g>\n</g><circle class=\"pz-ring\" cx=\"250\" cy=\"150\" r=\"52\"/></g></svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"lying-leg-curl-m-arch\" data-key=\"arch\" data-cue=\"Your lower back arches as your legs curl.\" class=\"plate-callout two m\" style=\"left:31.28%;top:42.46%\" aria-pressed=\"true\">Low back<br>arches</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "axis",
        cues: [{ key: "axis", cue: "Line your knees up with the machine's axis." }, { key: "hips", cue: "Keep the front of your hips pressed on the pad." }, { key: "back", cue: "Brace your abs so your low back doesn't arch." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "arch",
        cues: [{ key: "arch", cue: "Your lower back arches as your legs curl." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Low back arches</b><span>Your lower back arches as your legs curl.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: curl 1 second, hold 1 second, lower 3 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Curl</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:3 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>3 s</span></div></div></div>",
      alt: "Lying leg curl, side view. Face down on the bench with the hips on the pad, the knees close to the bench edge and in line with the machine axis and the roller just above the heels, the lifter curls the heels toward the glutes.",
      mistakeAlt: "Lying Leg Curl: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP (b): the card gives no thumb, contact or wrist claim; its grip type and width (c5) are setup step 4."
  },
  contacts: [
    "pivot-pad"
  ],
  setup: [
    {
      "kind": "get-in",
      "text": "Lie face down, knees near the bench edge, aligned with the axis.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-llc",
          "ace-llc",
          "sl-llc"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "adjust",
      "text": "Roller on your lower calf, not pressing your heel or Achilles.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-llc",
          "lifto-llc",
          "mo-llc",
          "ace-llc"
        ],
        "note": "card c3, c4"
      }
    },
    {
      "kind": "grip",
      "text": "Hold the handles, abs tight. Breathe out to curl, in to lower.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-llc",
          "mo-llc",
          "nasm-llc",
          "lifto-llc"
        ],
        "note": "card c5, c12"
      }
    },
    {
      "kind": "position",
      "text": "Start knees nearly straight, not forced locked. Curl toward your glutes.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-llc",
          "mo-llc",
          "lifto-llc",
          "ace-llc"
        ],
        "note": "card c6, c7"
      }
    },
    {
      "kind": "position",
      "text": "Stop before your hips lift. Lower with control, stack never touching.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-llc",
          "lifto-llc",
          "mo-llc"
        ],
        "note": "card c7, c8, c11"
      }
    }
  ],
  posture: [
    {
      "key": "axis",
      "label": "Knee at axis",
      "detail": "Line your knees up with the machine's axis before you start.",
      "anchor": {
        "pose": "start",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-llc",
          "fv-llc",
          "ace-llc",
          "sl-llc"
        ],
        "note": "card c2, c1"
      }
    },
    {
      "key": "roller",
      "label": "Roller above heel",
      "detail": "Roller on the lower calf, just above the heel, never pressing into it.",
      "anchor": {
        "pose": "start",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-llc",
          "lifto-llc",
          "mo-llc",
          "ace-llc"
        ],
        "note": "card c3, c4"
      }
    },
    {
      "key": "start",
      "label": "Nearly straight",
      "detail": "Knees start nearly straight, not forced locked.",
      "anchor": {
        "pose": "start",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-llc",
          "mo-llc"
        ],
        "note": "card c6"
      }
    },
    {
      "key": "hips",
      "label": "Hips on pad",
      "detail": "Keep your hips down. Use less weight or stop earlier.",
      "anchor": {
        "pose": "end",
        "at": "navel"
      },
      "zoom": "hips-pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-llc",
          "lifto-llc",
          "mo-llc"
        ],
        "note": "card c8"
      }
    },
    {
      "key": "arch",
      "label": "Low back still",
      "detail": "Brace your abs. Use a lighter weight if your low back moves.",
      "anchor": {
        "pose": "end",
        "at": "backMid"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "ace-llc",
          "lifto-llc",
          "mo-llc",
          "fv-llc",
          "hl-hc"
        ],
        "note": "card c9, c10"
      }
    },
    {
      "key": "lower",
      "label": "Controlled lowering",
      "detail": "Lower under control. Don't let the stack touch.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-llc",
          "lifto-llc",
          "mo-llc"
        ],
        "note": "card c11"
      }
    }
  ],
  zooms: [
    {
      "key": "hips-pad",
      "chip": "Hips",
      "heading": "Hips on pad",
      "kind": "posture"
    }
  ],
  chips: [
    "hips-pad",
    "feel"
  ],
  copy: {
    "setupLine": "Knees start nearly straight, not forced locked.",
    "mistakeLine": "Don't start with your knees off the axis or the roller on your heel.",
    "cueLine": "Lower slowly, stack never touches."
  },
  mistakes: [],
  risks: [
    {
      "key": "axis",
      "text": "Line your knees up with the machine's axis to prevent joint stress.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-llc",
          "fv-llc"
        ],
        "note": "card c2"
      }
    },
    {
      "key": "arch",
      "text": "Arching your lower back can cause back pain and discomfort.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "hl-hc"
        ],
        "note": "card c10"
      }
    },
    {
      "key": "jerk",
      "text": "Sudden, jerking movements can lead to injury.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "hl-hc"
        ],
        "note": "card c15"
      }
    }
  ],
  riskFlags: [
    "knee",
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
    "fv-llc",
    "mo-llc",
    "lifto-llc",
    "ace-llc",
    "nasm-llc",
    "sl-llc",
    "hl-hc",
    "nhs-knee-pain",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/lying_leg_curl.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

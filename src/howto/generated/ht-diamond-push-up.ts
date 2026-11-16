// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=fb123629da1d0a14a879e0bb65ac5e4c25c519bca0662eef1eba9dcd9ea5c4b0
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_diamond_push_up",
  name: "Diamond Push-Up",
  hashes: { inputsSha256: "fb123629da1d0a14a879e0bb65ac5e4c25c519bca0662eef1eba9dcd9ea5c4b0", golden: "22499a7a9ef764794cd1900e1aee18550917e12022e1c59ab47851804659615a" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"diamond-push-up-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"diamond-push-up-n-st-thigh.l\" d=\"~#F12F-vDXS1-Ex1EUS1WbT10B1)*1J2W7w6Y3_2PU1N3PmPc(ja(mXbSU1T1!3V2!7X5.*1O41F1Sbw2DcTu)E1ImOz1hVF1wl00000002002000200012000000000111100200000001010000000100101010010020000020002000\"/><path id=\"diamond-push-up-n-st-kneecap.l\" d=\"~~NFiS!U1FJ10\"/><path id=\"diamond-push-up-n-st-shank.l\" d=\"~#F12PVjYNT1zAlETT1Wbw21D1E(1_3U7y6!3Y2Fy2T2HdN7_b8Ud)6yy2Y4(3R2!7-5z(1.52B1UbT1Eb.cEoOdKl9RoWc00000010100022000000200100101012100000001110000000012020000001000010001200200000\"/><path id=\"diamond-push-up-n-st-foot.l\" d=\"~#o2AT8D_T1KS9xJU1I3PcU7UhFnUpW1SY2y6-I2P8XB1cXnx4zG1!c.aSaUs*oRm000000000200010100210000121000101200000010000020\"/><path id=\"diamond-push-up-n-st-torso\" d=\"~#_12PGS1S*T1BXT1-EU1P6I90B3OhF9K6H9xgNc3F6_n.5H8)lR4VcP4_fw6WkJfNmAhUhN9!4!fR7Fz1IqyrRa4G64O9)fJc)7y3D8RcV7*fKkT6K6D6!a!c*7w3EuXS200001000000020010110101100100200000000000000020000000000100200010000000200001010001000000000000000100002200000010000\"/><path id=\"diamond-push-up-n-st-thigh.r\" d=\"^0\"/><path id=\"diamond-push-up-n-st-kneecap.r\" d=\"^1\"/><path id=\"diamond-push-up-n-st-shank.r\" d=\"^2\"/><path id=\"diamond-push-up-n-st-foot.r\" d=\"^3\"/><path id=\"diamond-push-up-n-st-shcap.r\" d=\"~~HTI1DHV1NO10\"/><path id=\"diamond-push-up-n-st-upper.r\" d=\"~#F12H.J1J.T1G(K1-WT1_8r2axN1U9H6D2A3w1JD1b_j(6AgR2WgXcUA1ObW2*1H5)3-N1y507S8.1I1)fxrK9*lP3XmJh00000000010000000000000010000000000000000001011010000000020001002001001002002000\"/><path id=\"diamond-push-up-n-st-elbowcap.r\" d=\"~~_*y1FYW1Yy12\"/><path id=\"diamond-push-up-n-st-fore.r\" d=\"~#F12UJz1UWX1B!y1GFX1T5V5S14!tSfx4*6jE2VhEc.6RcE9z6GeB1BiObI2a*7vAqHlqJ1T7*2Taw5NaHjDeH9!lw200200200100010010002000000001000100000000100212000000000010000002002101010000200\"/><path id=\"diamond-push-up-n-st-palm.r\" d=\"~#o2HXF1Sz-1zKE1GVY1P8O9O8T1Bf_4Ek)3Od0EkqBf0O8X4P80!x1VnUg1102001001010000001000000000010100000201000010102\"/><path id=\"diamond-push-up-n-g0-shcap.r\" d=\"~~(*H1SVR1NO10\"/><path id=\"diamond-push-up-n-g0-upper.r\" d=\"~#F12F-I1SHP1E-J1R!O1y8G368BG1(lS6aH32DA1VawlA1Ye.6Pc.gNv)ky2R2!3E5zI1Uh39Y7x4R5zfRsR1zkJ9xhwn10001000001010110001000000012020000001000120000010000000000000011000010001000000\"/><path id=\"diamond-push-up-n-g0-elbowcap.r\" d=\"~~Dzz1wRV1Yy12\"/><path id=\"diamond-push-up-n-g0-fore.r\" d=\"~#F12!Jz1HIW1K*y1RYV1G5G7Y1iJtDnI3)7bT2OiziK4Vdz8T7XdX3zjThR27B8*2UoDskW1R7*4T9Y4!6_kHcWbAl!500100121010000000200002200000100002200000100000000100000110001002201010100100200\"/><path id=\"diamond-push-up-n-g0-palm.r\" d=\"^9\"/><path id=\"diamond-push-up-n-g1-shcap.r\" d=\"~~W*G1JzN1NO10\"/><path id=\"diamond-push-up-n-g1-upper.r\" d=\"~#F12WIH1YxK1-AI1zHJ1J6X588)uyy1F6-1A3v(t-lDk*5PbObD6xk(l.tA1)2_1G6Gy1_u57Y5K6*9TcOrD8VfUfK8Jr20000020002000000020000010000000000000100022001010000200010011000000000001010001\"/><path id=\"diamond-push-up-n-g1-elbowcap.r\" d=\"~~A(z1wNU1Yy12\"/><path id=\"diamond-push-up-n-g1-fore.r\" d=\"~#F12!yA1PyV1xXz1)IU1.3T8S1u!oHu-1.84T2OfKnK1BeG6B9VcR6Bg*mK2pV7*4DjDy1a_1R6V6-9N3H2!lU9wePjAa00001111110000000000001001000000000000010120000210120010002000000000000120200020\"/><path id=\"diamond-push-up-n-g1-palm.r\" d=\"^9\"/><path id=\"diamond-push-up-n-e-thigh.l\" d=\"~#F12PSsP.I1I(tVII1Ya-49B1*_1Sjy9U3N4U1HT1GbApY5FjB5YiXhwS1Bgy3T3!5X7V!1wdaA1WbG1D3Xw1VJ1IaBy1J9Ix1Nv20210101011111010000120000000000022000000002001002000200000000020000002000001000\"/><path id=\"diamond-push-up-n-e-kneecap.l\" d=\"~~NAgHHR1FJ10\"/><path id=\"diamond-push-up-n-e-shank.l\" d=\"~#F12WAhA(O1VSiOVO1WbG1cD1-_1wly9U3P4U1_(1*k(eN3Nbz3ybOa_w2-dy3R3w6-7I*1Yb7E1WaX4IeB9)qE6VkU5zkyj11011000020002000020000101000120010100010000220020001200201002002000000000000011\"/><path id=\"diamond-push-up-n-e-foot.l\" d=\"~#o2PT6YIT1RW7EUT18ydFcWeNtDiHqUU2IfOH2E2VD1G6.mEfKD1D9*dFiPoGuVe002000200110000000010001011000200010122000101000\"/><path id=\"diamond-push-up-n-e-shcap.l\" d=\"~~!SF1_UH1NO10\"/><path id=\"diamond-push-up-n-e-upper.l\" d=\"~#F12yTF1!PH1VWF1EPG1A1z8a2E1YI1S3B5U1T2N8*w1NbThH1BgI8Gj.2-x1E1.2V2X5.5PI1936z8Tf.4Tfyo-1AmPbFq10001212100001110100010000000000000000000000011001200201000000000010000200220012\"/><path id=\"diamond-push-up-n-e-elbowcap.l\" d=\"~~yGF1JBT1Yy12\"/><path id=\"diamond-push-up-n-e-fore.l\" d=\"~#F12UEF1JyT1VJF1*FS1N2G9k_16yF1D4E8Y1x2_2.s_7)bszbV5xd(1xtK1E2X2-8V6PE1tU1rR9.9.2*bNiG1(gW8Ak00100020002000001010001012000000010000000000020220000001100000100000012000101100\"/><path id=\"diamond-push-up-n-e-palm.l\" d=\"~#o2F_F1Sz-1TRE1GVY1y8O9x8T1Te_4Oj)3)c0OjqTe0x8X4y80Hw1VnUg1101001002000000001000000000000200000101000010102\"/><path id=\"diamond-push-up-n-e-head\" d=\"~#w12JTT1!xF1EOT1RND1GnIdxeXf2RbG5-1H6R6U8Ta_gRmJdH1_8x4)4GiPgPi!bUjJ2YkGaJmViP30000000020010120001010100100000010200001012000000100220100200000\"/><path id=\"diamond-push-up-n-e-torso\" d=\"~#_12wWN1P.E1VAP1TYE1S3-apx3GeWdR3!a)bHgW1A6FlGcY1On-7.aW8(dPbFiwlAhNlHcHaw2FdVbPqzz1wnVhV1z6K2B9*bNg-6y5H4EeXbBdRlnI4_7weF9-6D5zU1xE200111101011000000210000200000010010020101010000100022000002000011001111010010000000001010000000100200001001010100020\"/><path id=\"diamond-push-up-n-e-thigh.r\" d=\"^18\"/><path id=\"diamond-push-up-n-e-kneecap.r\" d=\"^19\"/><path id=\"diamond-push-up-n-e-shank.r\" d=\"^20\"/><path id=\"diamond-push-up-n-e-foot.r\" d=\"^21\"/><path id=\"diamond-push-up-n-e-shcap.r\" d=\"^22\"/><path id=\"diamond-push-up-n-e-upper.r\" d=\"^23\"/><path id=\"diamond-push-up-n-e-elbowcap.r\" d=\"^24\"/><path id=\"diamond-push-up-n-e-fore.r\" d=\"^25\"/><path id=\"diamond-push-up-n-e-palm.r\" d=\"^26\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#diamond-push-up-n-dots)\"/>\n  <path class=\"datum\" d=\"M240.58 212.33L-6.62 271.62\"/><path class=\"floorline\" d=\"M16.34 300.5H281.66\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-n-st-thigh.l\"/><use href=\"#diamond-push-up-n-st-kneecap.l\"/><use href=\"#diamond-push-up-n-st-shank.l\"/><use href=\"#diamond-push-up-n-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-n-st-thigh.l\"/><use href=\"#diamond-push-up-n-st-kneecap.l\"/><use href=\"#diamond-push-up-n-st-shank.l\"/><use href=\"#diamond-push-up-n-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-n-st-torso\"/><use href=\"#diamond-push-up-n-st-thigh.r\"/><use href=\"#diamond-push-up-n-st-kneecap.r\"/><use href=\"#diamond-push-up-n-st-shank.r\"/><use href=\"#diamond-push-up-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-n-st-torso\"/><use href=\"#diamond-push-up-n-st-thigh.r\"/><use href=\"#diamond-push-up-n-st-kneecap.r\"/><use href=\"#diamond-push-up-n-st-shank.r\"/><use href=\"#diamond-push-up-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-n-st-shcap.r\"/><use href=\"#diamond-push-up-n-st-upper.r\"/><use href=\"#diamond-push-up-n-st-elbowcap.r\"/><use href=\"#diamond-push-up-n-st-fore.r\"/><use href=\"#diamond-push-up-n-st-palm.r\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-n-st-shcap.r\"/><use href=\"#diamond-push-up-n-st-upper.r\"/><use href=\"#diamond-push-up-n-st-elbowcap.r\"/><use href=\"#diamond-push-up-n-st-fore.r\"/><use href=\"#diamond-push-up-n-st-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-n-g0-shcap.r\"/><use href=\"#diamond-push-up-n-g0-upper.r\"/><use href=\"#diamond-push-up-n-g0-elbowcap.r\"/><use href=\"#diamond-push-up-n-g0-fore.r\"/><use href=\"#diamond-push-up-n-g0-palm.r\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-n-g0-shcap.r\"/><use href=\"#diamond-push-up-n-g0-upper.r\"/><use href=\"#diamond-push-up-n-g0-elbowcap.r\"/><use href=\"#diamond-push-up-n-g0-fore.r\"/><use href=\"#diamond-push-up-n-g0-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-n-g1-shcap.r\"/><use href=\"#diamond-push-up-n-g1-upper.r\"/><use href=\"#diamond-push-up-n-g1-elbowcap.r\"/><use href=\"#diamond-push-up-n-g1-fore.r\"/><use href=\"#diamond-push-up-n-g1-palm.r\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-n-g1-shcap.r\"/><use href=\"#diamond-push-up-n-g1-upper.r\"/><use href=\"#diamond-push-up-n-g1-elbowcap.r\"/><use href=\"#diamond-push-up-n-g1-fore.r\"/><use href=\"#diamond-push-up-n-g1-palm.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-n-e-thigh.l\"/><use href=\"#diamond-push-up-n-e-kneecap.l\"/><use href=\"#diamond-push-up-n-e-shank.l\"/><use href=\"#diamond-push-up-n-e-foot.l\"/><use href=\"#diamond-push-up-n-e-shcap.l\"/><use href=\"#diamond-push-up-n-e-upper.l\"/><use href=\"#diamond-push-up-n-e-elbowcap.l\"/><use href=\"#diamond-push-up-n-e-fore.l\"/><use href=\"#diamond-push-up-n-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-n-e-thigh.l\"/><use href=\"#diamond-push-up-n-e-kneecap.l\"/><use href=\"#diamond-push-up-n-e-shank.l\"/><use href=\"#diamond-push-up-n-e-foot.l\"/><use href=\"#diamond-push-up-n-e-shcap.l\"/><use href=\"#diamond-push-up-n-e-upper.l\"/><use href=\"#diamond-push-up-n-e-elbowcap.l\"/><use href=\"#diamond-push-up-n-e-fore.l\"/><use href=\"#diamond-push-up-n-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-n-e-head\"/><use href=\"#diamond-push-up-n-e-torso\"/><use href=\"#diamond-push-up-n-e-thigh.r\"/><use href=\"#diamond-push-up-n-e-kneecap.r\"/><use href=\"#diamond-push-up-n-e-shank.r\"/><use href=\"#diamond-push-up-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-n-e-head\"/><use href=\"#diamond-push-up-n-e-torso\"/><use href=\"#diamond-push-up-n-e-thigh.r\"/><use href=\"#diamond-push-up-n-e-kneecap.r\"/><use href=\"#diamond-push-up-n-e-shank.r\"/><use href=\"#diamond-push-up-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-n-e-shcap.r\"/><use href=\"#diamond-push-up-n-e-upper.r\"/><use href=\"#diamond-push-up-n-e-elbowcap.r\"/><use href=\"#diamond-push-up-n-e-fore.r\"/><use href=\"#diamond-push-up-n-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-n-e-shcap.r\"/><use href=\"#diamond-push-up-n-e-upper.r\"/><use href=\"#diamond-push-up-n-e-elbowcap.r\"/><use href=\"#diamond-push-up-n-e-fore.r\"/><use href=\"#diamond-push-up-n-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"215.41\" cy=\"218.37\" r=\"2.25\"/><circle class=\"joint\" cx=\"211.82\" cy=\"261.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"149.51\" cy=\"236.28\" r=\"2.25\"/><circle class=\"joint\" cx=\"89.71\" cy=\"252.53\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#w20S!J1YBX1E*J1xKX10010201000011200d4011200000102110211221102011221f600122110000000100010000020000000000000021000000000010100000200000101010000011100101111000011110020010100000121000000021010010111100100000000\"/><path class=\"arrow\" d=\"~M!EI1w.N1LHs(uLIw2TkZ\"/></g><path class=\"leader\" d=\"M198.43 204.11L160.98 175H150.98\"/><circle class=\"anchor\" cx=\"198.43\" cy=\"204.11\" r=\"1.5\"/><path class=\"leader\" d=\"M220.95 296.21L231 332H241\"/><circle class=\"anchor\" cx=\"220.95\" cy=\"296.21\" r=\"1.5\"/><path class=\"leader\" d=\"~MUwA1FYW1L0FS6\"/><circle class=\"anchor\" cx=\"184.42\" cy=\"280.36\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"diamond-push-up-n-line\" data-key=\"line\" data-cue=\"Keep your torso and legs rigid in one line, with no sag.\" class=\"plate-callout\" style=\"left:17.88%;top:42.74%\" aria-pressed=\"true\">Body in line</button><button type=\"button\" id=\"diamond-push-up-n-hands\" data-key=\"hands\" data-cue=\"Place your hands close together under your upper chest.\" class=\"plate-callout two\" style=\"left:65.92%;top:86.59%\" aria-pressed=\"false\">Hands<br>under chest</button><button type=\"button\" id=\"diamond-push-up-n-elbows\" data-key=\"elbows\" data-cue=\"Keep your elbows close to your torso on the way down.\" class=\"plate-callout two\" style=\"left:33.52%;top:86.59%\" aria-pressed=\"false\">Elbows<br>tucked</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"diamond-push-up-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"diamond-push-up-m-st-thigh.l\" d=\"^0\"/><path id=\"diamond-push-up-m-st-kneecap.l\" d=\"^1\"/><path id=\"diamond-push-up-m-st-shank.l\" d=\"^2\"/><path id=\"diamond-push-up-m-st-foot.l\" d=\"^3\"/><path id=\"diamond-push-up-m-st-torso\" d=\"^4\"/><path id=\"diamond-push-up-m-st-thigh.r\" d=\"^0\"/><path id=\"diamond-push-up-m-st-kneecap.r\" d=\"^1\"/><path id=\"diamond-push-up-m-st-shank.r\" d=\"^2\"/><path id=\"diamond-push-up-m-st-foot.r\" d=\"^3\"/><path id=\"diamond-push-up-m-st-shcap.r\" d=\"^5\"/><path id=\"diamond-push-up-m-st-upper.r\" d=\"^6\"/><path id=\"diamond-push-up-m-st-elbowcap.r\" d=\"^7\"/><path id=\"diamond-push-up-m-st-fore.r\" d=\"^8\"/><path id=\"diamond-push-up-m-st-palm.r\" d=\"^9\"/><path id=\"diamond-push-up-m-g0-shcap.r\" d=\"^10\"/><path id=\"diamond-push-up-m-g0-upper.r\" d=\"^11\"/><path id=\"diamond-push-up-m-g0-elbowcap.r\" d=\"^12\"/><path id=\"diamond-push-up-m-g0-fore.r\" d=\"^13\"/><path id=\"diamond-push-up-m-g0-palm.r\" d=\"^9\"/><path id=\"diamond-push-up-m-g1-shcap.r\" d=\"^14\"/><path id=\"diamond-push-up-m-g1-upper.r\" d=\"^15\"/><path id=\"diamond-push-up-m-g1-elbowcap.r\" d=\"^16\"/><path id=\"diamond-push-up-m-g1-fore.r\" d=\"^17\"/><path id=\"diamond-push-up-m-g1-palm.r\" d=\"^9\"/><path id=\"diamond-push-up-m-e-thigh.l\" d=\"^18\"/><path id=\"diamond-push-up-m-e-kneecap.l\" d=\"^19\"/><path id=\"diamond-push-up-m-e-shank.l\" d=\"^20\"/><path id=\"diamond-push-up-m-e-foot.l\" d=\"^21\"/><path id=\"diamond-push-up-m-e-shcap.l\" d=\"^22\"/><path id=\"diamond-push-up-m-e-upper.l\" d=\"^23\"/><path id=\"diamond-push-up-m-e-elbowcap.l\" d=\"^24\"/><path id=\"diamond-push-up-m-e-fore.l\" d=\"^25\"/><path id=\"diamond-push-up-m-e-palm.l\" d=\"^26\"/><path id=\"diamond-push-up-m-e-head\" d=\"^27\"/><path id=\"diamond-push-up-m-e-torso\" d=\"^28\"/><path id=\"diamond-push-up-m-e-thigh.r\" d=\"^18\"/><path id=\"diamond-push-up-m-e-kneecap.r\" d=\"^19\"/><path id=\"diamond-push-up-m-e-shank.r\" d=\"^20\"/><path id=\"diamond-push-up-m-e-foot.r\" d=\"^21\"/><path id=\"diamond-push-up-m-e-shcap.r\" d=\"^22\"/><path id=\"diamond-push-up-m-e-upper.r\" d=\"^23\"/><path id=\"diamond-push-up-m-e-elbowcap.r\" d=\"^24\"/><path id=\"diamond-push-up-m-e-fore.r\" d=\"^25\"/><path id=\"diamond-push-up-m-e-palm.r\" d=\"^26\"/><path id=\"diamond-push-up-m-m-head\" d=\"~#w12WSP1wEz1.SO1O(x1-qY1OkI5E6V9O5P1W1z9H1KdP1Bs(bG6y5E8GeKc(nF6!k_9Hd!f!3PoVdAd0010010000000100200021000001010000000110000000002111100020010002\"/><path id=\"diamond-push-up-m-m-torso\" d=\"~#_12yJJ1WYB1KRK1K!A1*2xbI2x2G4Jj(2(atHkN8!5N6.uThxA1zaz8Na_cWdSgynJeYmP9SamSbGd!lBD1UkKkDiVkE6xT1BH1_R1.2w8E4EezhO4EiHbi!8Yg2X2w8VS2Iu00000000020002100010100100000010000120000010100000200211111010010100001111100000000000000000002000111000120200000010\"/><path id=\"diamond-push-up-m-m-thigh.l\" d=\"~#F12UFvADR1.Ww1IwR1PbG21E1X*1A6w8S5w4P2SU1aFnAb!jpDmBdJU1-4Y3-2P7G6z(1l4F1UbF1JaGvGG1.jOz1S1IE1Jn00010110000000012000210000000110000001002000000100100000000001010110100010000020\"/><path id=\"diamond-push-up-m-m-kneecap.l\" d=\"~~Y!hWyU1FJ10\"/><path id=\"diamond-push-up-m-m-shank.l\" d=\"~#F12wEj(US1XVkTWS1WbF12F1**1S7w8P5w4S2wy2R6WdU6!bhAdX7Hy2sW3*2S7E6I(1x21E1UbG2zczc*o)bKls-nDe00011000000000110010000000111021010002000001110000000000000100001002101000101000\"/><path id=\"diamond-push-up-m-m-foot.l\" d=\"~#o2wD8UVT1ID9TBU1R2YcU8yh_oFow7FY2N1*I2F6GD1x1VnO6-F1DcTbFc(rBq)k000000200220002100000001111010002200000000000000\"/><path id=\"diamond-push-up-m-m-upper.l\" d=\"~#F12yTF1WPH1.WF1-OG1D1B8a0O1DJ1U3B5W1V2S8Ix1PbRhJ1EgE8GjV2Gy1E1*2T2X5z6YI1908G8VfR4Vf(n.1ymHbJq10000000000000002001110010100101000120000000100020000200000010101000000000000010\"/><path id=\"diamond-push-up-m-m-elbowcap.l\" d=\"~~UEF1PET1Yy12\"/><path id=\"diamond-push-up-m-m-fore.l\" d=\"~#F12DDF1JAT1IIF1XHS1P2I9k_11NF1D4G8_1x2w3Gt_7*bw1zbV5zdA2ItI1E2-2)8.6!E1rU1tT9X9X2xcJiK1(gU8Dk20000000200002000001002101000000000012000002000011000000011110012000000000000000\"/><path id=\"diamond-push-up-m-m-palm.l\" d=\"~#o2PWF1PE-1-IE1K.Y1w8-9R8B1.eN5Gk.2KdmBkY1xfoT8E4J8dSw1KpPgn002002101101000000000010110100002001010101021000\"/><path id=\"diamond-push-up-m-m-thigh.r\" d=\"^38\"/><path id=\"diamond-push-up-m-m-kneecap.r\" d=\"^39\"/><path id=\"diamond-push-up-m-m-shank.r\" d=\"^40\"/><path id=\"diamond-push-up-m-m-foot.r\" d=\"^41\"/><path id=\"diamond-push-up-m-m-upper.r\" d=\"^42\"/><path id=\"diamond-push-up-m-m-elbowcap.r\" d=\"^43\"/><path id=\"diamond-push-up-m-m-fore.r\" d=\"^44\"/><path id=\"diamond-push-up-m-m-palm.r\" d=\"^45\"/><path id=\"diamond-push-up-m-mf-shcap.l\" d=\"^22\"/><path id=\"diamond-push-up-m-mf-shcap.r\" d=\"^22\"/><path id=\"diamond-push-up-m-mo-0\" d=\"^27\"/><path id=\"diamond-push-up-m-mo-1\" d=\"^28\"/><path id=\"diamond-push-up-m-mo-2\" d=\"^18\"/><path id=\"diamond-push-up-m-mo-3\" d=\"^19\"/><path id=\"diamond-push-up-m-mo-4\" d=\"^20\"/><path id=\"diamond-push-up-m-mo-5\" d=\"^21\"/><path id=\"diamond-push-up-m-mo-6\" d=\"^22\"/><path id=\"diamond-push-up-m-mo-7\" d=\"^23\"/><path id=\"diamond-push-up-m-mo-8\" d=\"^24\"/><path id=\"diamond-push-up-m-mo-9\" d=\"^25\"/><path id=\"diamond-push-up-m-mo-10\" d=\"^26\"/><path id=\"diamond-push-up-m-mo-11\" d=\"^18\"/><path id=\"diamond-push-up-m-mo-12\" d=\"^19\"/><path id=\"diamond-push-up-m-mo-13\" d=\"^20\"/><path id=\"diamond-push-up-m-mo-14\" d=\"^21\"/><path id=\"diamond-push-up-m-mo-15\" d=\"^22\"/><path id=\"diamond-push-up-m-mo-16\" d=\"^23\"/><path id=\"diamond-push-up-m-mo-17\" d=\"^24\"/><path id=\"diamond-push-up-m-mo-18\" d=\"^25\"/><path id=\"diamond-push-up-m-mo-19\" d=\"^26\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#diamond-push-up-m-dots)\"/>\n  <path class=\"datum\" d=\"^29\"/><path class=\"floorline\" d=\"^30\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-m-st-thigh.l\"/><use href=\"#diamond-push-up-m-st-kneecap.l\"/><use href=\"#diamond-push-up-m-st-shank.l\"/><use href=\"#diamond-push-up-m-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-m-st-thigh.l\"/><use href=\"#diamond-push-up-m-st-kneecap.l\"/><use href=\"#diamond-push-up-m-st-shank.l\"/><use href=\"#diamond-push-up-m-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-m-st-torso\"/><use href=\"#diamond-push-up-m-st-thigh.r\"/><use href=\"#diamond-push-up-m-st-kneecap.r\"/><use href=\"#diamond-push-up-m-st-shank.r\"/><use href=\"#diamond-push-up-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-m-st-torso\"/><use href=\"#diamond-push-up-m-st-thigh.r\"/><use href=\"#diamond-push-up-m-st-kneecap.r\"/><use href=\"#diamond-push-up-m-st-shank.r\"/><use href=\"#diamond-push-up-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-m-st-shcap.r\"/><use href=\"#diamond-push-up-m-st-upper.r\"/><use href=\"#diamond-push-up-m-st-elbowcap.r\"/><use href=\"#diamond-push-up-m-st-fore.r\"/><use href=\"#diamond-push-up-m-st-palm.r\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-m-st-shcap.r\"/><use href=\"#diamond-push-up-m-st-upper.r\"/><use href=\"#diamond-push-up-m-st-elbowcap.r\"/><use href=\"#diamond-push-up-m-st-fore.r\"/><use href=\"#diamond-push-up-m-st-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-m-g0-shcap.r\"/><use href=\"#diamond-push-up-m-g0-upper.r\"/><use href=\"#diamond-push-up-m-g0-elbowcap.r\"/><use href=\"#diamond-push-up-m-g0-fore.r\"/><use href=\"#diamond-push-up-m-g0-palm.r\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-m-g0-shcap.r\"/><use href=\"#diamond-push-up-m-g0-upper.r\"/><use href=\"#diamond-push-up-m-g0-elbowcap.r\"/><use href=\"#diamond-push-up-m-g0-fore.r\"/><use href=\"#diamond-push-up-m-g0-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-m-g1-shcap.r\"/><use href=\"#diamond-push-up-m-g1-upper.r\"/><use href=\"#diamond-push-up-m-g1-elbowcap.r\"/><use href=\"#diamond-push-up-m-g1-fore.r\"/><use href=\"#diamond-push-up-m-g1-palm.r\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-m-g1-shcap.r\"/><use href=\"#diamond-push-up-m-g1-upper.r\"/><use href=\"#diamond-push-up-m-g1-elbowcap.r\"/><use href=\"#diamond-push-up-m-g1-fore.r\"/><use href=\"#diamond-push-up-m-g1-palm.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-m-e-thigh.l\"/><use href=\"#diamond-push-up-m-e-kneecap.l\"/><use href=\"#diamond-push-up-m-e-shank.l\"/><use href=\"#diamond-push-up-m-e-foot.l\"/><use href=\"#diamond-push-up-m-e-shcap.l\"/><use href=\"#diamond-push-up-m-e-upper.l\"/><use href=\"#diamond-push-up-m-e-elbowcap.l\"/><use href=\"#diamond-push-up-m-e-fore.l\"/><use href=\"#diamond-push-up-m-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-m-e-thigh.l\"/><use href=\"#diamond-push-up-m-e-kneecap.l\"/><use href=\"#diamond-push-up-m-e-shank.l\"/><use href=\"#diamond-push-up-m-e-foot.l\"/><use href=\"#diamond-push-up-m-e-shcap.l\"/><use href=\"#diamond-push-up-m-e-upper.l\"/><use href=\"#diamond-push-up-m-e-elbowcap.l\"/><use href=\"#diamond-push-up-m-e-fore.l\"/><use href=\"#diamond-push-up-m-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-m-e-head\"/><use href=\"#diamond-push-up-m-e-torso\"/><use href=\"#diamond-push-up-m-e-thigh.r\"/><use href=\"#diamond-push-up-m-e-kneecap.r\"/><use href=\"#diamond-push-up-m-e-shank.r\"/><use href=\"#diamond-push-up-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-m-e-head\"/><use href=\"#diamond-push-up-m-e-torso\"/><use href=\"#diamond-push-up-m-e-thigh.r\"/><use href=\"#diamond-push-up-m-e-kneecap.r\"/><use href=\"#diamond-push-up-m-e-shank.r\"/><use href=\"#diamond-push-up-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-m-e-shcap.r\"/><use href=\"#diamond-push-up-m-e-upper.r\"/><use href=\"#diamond-push-up-m-e-elbowcap.r\"/><use href=\"#diamond-push-up-m-e-fore.r\"/><use href=\"#diamond-push-up-m-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#diamond-push-up-m-e-shcap.r\"/><use href=\"#diamond-push-up-m-e-upper.r\"/><use href=\"#diamond-push-up-m-e-elbowcap.r\"/><use href=\"#diamond-push-up-m-e-fore.r\"/><use href=\"#diamond-push-up-m-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"215.41\" cy=\"218.37\" r=\"2.25\"/><circle class=\"joint\" cx=\"211.82\" cy=\"261.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"149.51\" cy=\"236.28\" r=\"2.25\"/><circle class=\"joint\" cx=\"89.71\" cy=\"252.53\" r=\"2.25\"/></g><mask id=\"diamond-push-up-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#diamond-push-up-m-m-head\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-torso\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-thigh.l\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-shank.l\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-foot.l\" fill=\"#000\"/><use href=\"#diamond-push-up-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-upper.l\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-fore.l\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-palm.l\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-thigh.r\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-shank.r\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-foot.r\" fill=\"#000\"/><use href=\"#diamond-push-up-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-upper.r\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-fore.r\" fill=\"#000\"/><use href=\"#diamond-push-up-m-m-palm.r\" fill=\"#000\"/><use href=\"#diamond-push-up-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#diamond-push-up-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#diamond-push-up-m-mmask)\"><g class=\"u-stroke\"><use href=\"#diamond-push-up-m-m-head\"/><use href=\"#diamond-push-up-m-m-torso\"/><use href=\"#diamond-push-up-m-m-thigh.l\"/><use href=\"#diamond-push-up-m-m-kneecap.l\"/><use href=\"#diamond-push-up-m-m-shank.l\"/><use href=\"#diamond-push-up-m-m-foot.l\"/><use href=\"#diamond-push-up-m-m-upper.l\"/><use href=\"#diamond-push-up-m-m-elbowcap.l\"/><use href=\"#diamond-push-up-m-m-fore.l\"/><use href=\"#diamond-push-up-m-m-palm.l\"/><use href=\"#diamond-push-up-m-m-thigh.r\"/><use href=\"#diamond-push-up-m-m-kneecap.r\"/><use href=\"#diamond-push-up-m-m-shank.r\"/><use href=\"#diamond-push-up-m-m-foot.r\"/><use href=\"#diamond-push-up-m-m-upper.r\"/><use href=\"#diamond-push-up-m-m-elbowcap.r\"/><use href=\"#diamond-push-up-m-m-fore.r\"/><use href=\"#diamond-push-up-m-m-palm.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MyIy1AWR1LDJ2_X4M*r*dL(r(dLImVJ1\"/><path class=\"leader m\" d=\"~M!Ot(xP1L0_Nd\"/><path class=\"leader m\" d=\"~MDXy1AxP1L0ANf\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"diamond-push-up-m-sag\" data-key=\"sag\" data-cue=\"Your hips sag toward the floor.\" class=\"plate-callout m\" style=\"left:26.82%;top:84.92%\" aria-pressed=\"true\">Hips sag</button><button type=\"button\" id=\"diamond-push-up-m-arch\" data-key=\"arch\" data-cue=\"Your low back overextends instead of staying rigid.\" class=\"plate-callout m\" style=\"left:46.93%;top:87.71%\" aria-pressed=\"false\">Low back arches</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "line",
        cues: [{ key: "line", cue: "Keep your torso and legs rigid in one line, with no sag." }, { key: "hands", cue: "Place your hands close together under your upper chest." }, { key: "elbows", cue: "Keep your elbows close to your torso on the way down." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "sag",
        cues: [{ key: "sag", cue: "Your hips sag toward the floor." }, { key: "arch", cue: "Your low back overextends instead of staying rigid." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Hips sag</b><span>Your hips sag toward the floor.</span></li><li><b>Low back arches</b><span>Your low back overextends instead of staying rigid.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: press, lower\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>&nbsp;</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>&nbsp;</span></div></div></div>",
      alt: "Diamond push-up, side view. Hands close together under the upper chest, elbows tucked by the sides, the lifter presses from the chest near the backs of the hands to straight arms, the body one straight line on the toes.",
      mistakeAlt: "Diamond Push-Up: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "palm-flat",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW6: the palm-flat pair draws one hand and cannot show the two-hand diamond (c1); the grip copy carries c1.",
    "orientation": "pronated",
    "handle": "floor",
    "loadAxis": "along-forearm",
    "overBody": false,
    "width": {
      "text": "Hands touching at the thumbs and first fingers.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-diamond",
          "fv-diamond"
        ],
        "note": "c1"
      }
    },
    "thumb": {
      "mode": "spread",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-diamond",
          "fv-diamond"
        ],
        "note": "card grip.thumb, c1: the thumbs held out to touch and form the bottom of the diamond"
      }
    },
    "contact": "palm-flat",
    "wrist": {
      "exempt": "Palm flat on the floor below the upper chest: the palm-flat key records no wrist range (null).",
      "claim": {
        "tags": [
          "CONSENSUS",
          "CONVENTION"
        ],
        "sources": [
          "bb-diamond",
          "fv-diamond",
          "hand-key-palm-flat"
        ],
        "note": "card grip.wrist c1 (hands below the upper chest); hand-palm-flat.mjs:14 VARIANTS.floor.wristRange null"
      }
    },
    "faults": [],
    "gripLine": "Hands flat and close together under your upper chest. Thumbs and first fingers touch to make a diamond.",
    "cue": "Elbows close to your sides."
  },
  contacts: [
    "floor-body"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Kneel with your hands flat under your upper chest.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-diamond",
          "fv-diamond"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "grip",
      "text": "Touch thumbs and first fingers to make a diamond.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-diamond",
          "fv-diamond"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Walk your feet back until your body is straight.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-diamond",
          "bb-diamond"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "brace",
      "text": "Brace, tuck your chin, pull your shoulders down and back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-diamond",
          "bb-diamond"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "brace",
      "text": "Keep your torso and legs rigid.",
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-diamond",
          "bb-diamond"
        ],
        "note": "c2"
      }
    }
  ],
  posture: [
    {
      "key": "elbows",
      "label": "Elbows tucked",
      "detail": "Elbows tucked close to your sides.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-diamond",
          "fv-diamond"
        ],
        "note": "c3"
      }
    },
    {
      "key": "line",
      "label": "Body in line",
      "detail": "Low back and hips don't sag or arch up.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-diamond",
          "bb-diamond"
        ],
        "note": "c2, c3"
      }
    },
    {
      "key": "hands",
      "label": "Hands under chest",
      "detail": "Hands close together under the upper chest.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-diamond",
          "fv-diamond"
        ],
        "note": "c1"
      }
    },
    {
      "key": "blades",
      "label": "Blades back",
      "detail": "Shoulder blades pinch back as you lower.",
      "anchor": {
        "pose": "start",
        "at": "shoulder.r"
      },
      "zoom": "shoulder-blades",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-diamond"
        ],
        "note": "c4, c9"
      }
    },
    {
      "key": "top",
      "label": "Reach at top",
      "detail": "At the top, reach your upper back to the ceiling.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-diamond"
        ],
        "note": "c5"
      }
    },
    {
      "key": "breathe",
      "label": "Breathe",
      "detail": "Breathe in going down, out going up.",
      "anchor": {
        "pose": "start",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-diamond",
          "fv-diamond"
        ],
        "note": "c3, c5"
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
      "key": "shoulder-blades",
      "chip": "Shoulder blades",
      "heading": "Shoulder blades",
      "kind": "posture"
    }
  ],
  chips: [
    "hip-line",
    "shoulder-blades",
    "feel"
  ],
  copy: {
    "setupLine": "Hands flat under your upper chest in a diamond. Body straight and rigid.",
    "mistakeLine": "Never let your low back sag. Bend your knees slightly and squeeze your abs and glutes.",
    "cueLine": "Elbows tucked, body rigid."
  },
  mistakes: [
    {
      "key": "sag",
      "title": "Low back sagging",
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-diamond"
        ],
        "note": "c6"
      },
      "fix": "Bend your knees slightly and squeeze your abs and glutes."
    },
    {
      "key": "rolled",
      "title": "Shoulders rolling forward",
      "zoom": "shoulder-blades",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-diamond"
        ],
        "note": "c4, c9, c5"
      },
      "fix": "Pinch your shoulder blades back going down. Spread them at the top."
    },
    {
      "key": "hips",
      "title": "Hips dropping before the chest",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-diamond"
        ],
        "note": "c8"
      },
      "fix": "Press your heels against a wall to stay rigid."
    }
  ],
  risks: [
    {
      "key": "close",
      "text": "The close hand position can cause elbow, shoulder or wrist pain for some.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-diamond"
        ],
        "note": "c10"
      }
    },
    {
      "key": "rolled",
      "text": "Shoulders rolling forward on the way down may cause joint discomfort.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-diamond"
        ],
        "note": "c4"
      }
    },
    {
      "key": "arch",
      "text": "Don't let your back arch, to protect your low back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-diamond"
        ],
        "note": "c7"
      }
    }
  ],
  riskFlags: [
    "shoulder",
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
    "bb-diamond",
    "fv-diamond",
    "cogley-2005",
    "hand-key-palm-flat",
    "nhs-shoulder-pain",
    "nhs-wrist-pain",
    "nhs-elbow-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/diamond_push_up.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=8b8e2ed8cbf004a34fc971526d48ae27c56e513a70eb4f377710adeae784aab1
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_hollow_body_hold",
  name: "Hollow Body Hold",
  hashes: { inputsSha256: "8b8e2ed8cbf004a34fc971526d48ae27c56e513a70eb4f377710adeae784aab1", golden: "47721ef71ebd7c6e8265429128db093405f849f1c8ac8d02b8c615663b173f25" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"hollow-body-hold-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"hollow-body-hold-n-st-head\" d=\"~#w12J*f(Pw2.zg)*x2HlPaHdAdiDa!4H1G5D6)6_9Od_k)b9O7y4N5_fRfGfVbXgz3ziY7IkJgx40000001001000001010101000000201000100001010200100020000200002000\"/><path id=\"hollow-body-hold-n-st-torso\" d=\"~#_12UFkYKw2O)i.Sw2)gDdA4Ahwk)6Y6O7Jfz9qO5XhoI8_1H5ybV7KczazgRiEf-i*aB9-1XbHaOn(uKkUf!ukG1XdKeIaH7V1R8waw5!eDhA8X9T1*3P3Yl)7!R1Y.100000020010000002010000200020000101012000100100200000000000101010002000010000000111010100120000000200100200210001002\"/><path id=\"hollow-body-hold-n-st-thigh.r\" d=\"~#F12NNz1Swx2BBy1Exx2Iaw11w1!W1gK6T5I3V2zN1z5Ij)bVhB1VkS9ON1pR3F2B7Y4PW1N64vBaE2xcPqPy1NlHvw2_A1.g00020001000002220001112200020010000002210100020000000100221010010000020210000020\"/><path id=\"hollow-body-hold-n-st-kneecap.r\" d=\"~~NxK1JT)1AE12\"/><path id=\"hollow-body-hold-n-st-shank.r\" d=\"~#F12yDN1_.w2z*J1*Vw2zaB22z1DX1nR6T5E3T2V_1dIbz7OalGcU5B_1)6R3D2E7_4YW1W75A1GasN9!b_k!c(iF1HmBa10002000100010121012001000002001111000000000000000012000102100001000200200000010\"/><path id=\"hollow-body-hold-n-st-foot.r\" d=\"~#o2J-X1H))1BVX1T)(1WaK4F8XeS5zuJ*1VP1OY1JA1BvHe.gNc-q!oOez3Ne.mO2Ut002000000000000010010000000010110000020010000000\"/><path id=\"hollow-body-hold-n-st-shcap.r\" d=\"~~NJnD-(1(G10\"/><path id=\"hollow-body-hold-n-st-upper.r\" d=\"~#F12YOoYO*1VNpRI*1_7r08TF1W8P5!1_2s!x1dUhA6DeG2YeGbJw1EaJ2V1U4R3GG1S417U7T1E1Be)nE8IjA3xkJf12000001000020011000000011000000000000200200000000000002000000010100100000200200\"/><path id=\"hollow-body-hold-n-st-elbowcap.r\" d=\"~~FXfPyw2Yu0\"/><path id=\"hollow-body-hold-n-st-fore.r\" d=\"~#F12!PgYy)1KGhKx)1y92K1u)A1w9S8Y1D2y1Psz4wcy4W9O1yaX7Js*4Y1X1S7G4*B1w3V1bU8*2E1X8IiG6.eH2If_b00000202000100000001100002200000000100010000000000000000000000000202001100200002\"/><path id=\"hollow-body-hold-n-st-palm.r\" d=\"~#o2JGaFNw2RJb-.)1-8x7D7T2Aew2HhI6!b.1wiB2JdB2Y6G5I7D1Gx1.fReH2000010101100200100000200101000000000200000110000\"/><path id=\"hollow-body-hold-n-e-thigh.l\" d=\"~#F12AAA1N(w2G*y1EJx2K9D48y1AU1zh*7E3*3O1IK1(9EmB5xhP4TgUfGJ1DeT2F3G5Y6YV1Eb7vIay1*2ytPE1D9Jux8PtXr11010101010001010000212002100010110010100202000100000022001000000001202002120011\"/><path id=\"hollow-body-hold-n-e-kneecap.l\" d=\"~~PWJ1(A!1AE12\"/><path id=\"hollow-body-hold-n-e-shank.l\" d=\"~#F12AFN1AJ*1I)J1VT*1KaD17vyU1Ki)7B3*3O1VX1JiBdz3xaW2.9H9K-1(bT2F3G5Y6FW1xaaw1T9F4_cD8_nS5Ji*4_hVg01101000020101000001000002100000000010111100200001000000001200000001010100001000\"/><path id=\"hollow-body-hold-n-e-foot.l\" d=\"~#o2FyX1!N-1BUW1ESY1Y8R7y3RgG4IuUH1Xx2)G1SU1*oPn)bAhKhFw1-eS1N6BqA7_s000020000200000011110101000021000201010000200100\"/><path id=\"hollow-body-hold-n-e-shcap.l\" d=\"~~W!oY*!1(G10\"/><path id=\"hollow-body-hold-n-e-upper.l\" d=\"~#F12P_q_Y.1TVrGF!1W6y418XB1.hJ3(4U1H2HrJkFaNfUc_6Wi2(vJb(26!50Vz1Ol47y7H3S7)bxezlEhE9Ip000000020000001002001110000011110000000101110000000101000000000220010120002100100\"/><path id=\"hollow-body-hold-n-e-elbowcap.l\" d=\"~~Yyi_y-1Yu0\"/><path id=\"hollow-body-hold-n-e-fore.l\" d=\"~#F12WPjNDY1)AkGUY1D7S5-15-y1EfW5S6A1D2Fpwew7SaU8U4Wc0SpHdP27U8y1*vTkB1G1U8!2H4V7VaEgGdx7Kj120020010000000001101000000100000000200001200000000000000100000020000000000000002\"/><path id=\"hollow-body-hold-n-e-palm.l\" d=\"~#o2SXd_OV1X(eRWV1X2)aJ7J2(9AaWhP5SaW5WfD9wcJ6S81R6T3*g-w1*c*6000010020000000200110100200001000000201010000000\"/><path id=\"hollow-body-hold-n-e-head\" d=\"~#w12y!h_X-1REhOw.1Pb!kH3NiI5S8F3!3.7A2Ib(3xnJ9R9B7O8vT4Dg)3Tl4GkY7VgAiBcWfw60102001111010100000200001000020000001202000110002000200000101010\"/><path id=\"hollow-body-hold-n-e-torso\" d=\"~#_12(OlyB!1GIkVR.1Vg_3T3UbYjA2F9x4_hV1PiEiBszgI8_1H5ybV7KczazgRiEf-i*aB9-1XbHaOn(uKkUf!ukW8*aww1IaED1xn)bP5-1SfFcUez2x5.4R4HhS2S6UK200010100002002000000000200020000101012000100100200000000000101010002000010012120000000000100000000001110021011100000\"/><path id=\"hollow-body-hold-n-e-thigh.r\" d=\"^11\"/><path id=\"hollow-body-hold-n-e-kneecap.r\" d=\"^12\"/><path id=\"hollow-body-hold-n-e-shank.r\" d=\"^13\"/><path id=\"hollow-body-hold-n-e-foot.r\" d=\"^14\"/><path id=\"hollow-body-hold-n-e-shcap.r\" d=\"^15\"/><path id=\"hollow-body-hold-n-e-upper.r\" d=\"^16\"/><path id=\"hollow-body-hold-n-e-elbowcap.r\" d=\"^17\"/><path id=\"hollow-body-hold-n-e-fore.r\" d=\"^18\"/><path id=\"hollow-body-hold-n-e-palm.r\" d=\"^19\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#hollow-body-hold-n-dots)\"/>\n  <path class=\"floorline\" d=\"M16 339.5H342\"/><path class=\"arc measure\" d=\"M182.2 322.18L324.2 322.18A142 142 0 0 0 319.36 285.42Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hollow-body-hold-n-st-head\"/><use href=\"#hollow-body-hold-n-st-torso\"/><use href=\"#hollow-body-hold-n-st-thigh.r\"/><use href=\"#hollow-body-hold-n-st-kneecap.r\"/><use href=\"#hollow-body-hold-n-st-shank.r\"/><use href=\"#hollow-body-hold-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hollow-body-hold-n-st-head\"/><use href=\"#hollow-body-hold-n-st-torso\"/><use href=\"#hollow-body-hold-n-st-thigh.r\"/><use href=\"#hollow-body-hold-n-st-kneecap.r\"/><use href=\"#hollow-body-hold-n-st-shank.r\"/><use href=\"#hollow-body-hold-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hollow-body-hold-n-st-shcap.r\"/><use href=\"#hollow-body-hold-n-st-upper.r\"/><use href=\"#hollow-body-hold-n-st-elbowcap.r\"/><use href=\"#hollow-body-hold-n-st-fore.r\"/><use href=\"#hollow-body-hold-n-st-palm.r\"/></g><g class=\"u-fill\"><use href=\"#hollow-body-hold-n-st-shcap.r\"/><use href=\"#hollow-body-hold-n-st-upper.r\"/><use href=\"#hollow-body-hold-n-st-elbowcap.r\"/><use href=\"#hollow-body-hold-n-st-fore.r\"/><use href=\"#hollow-body-hold-n-st-palm.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#hollow-body-hold-n-e-thigh.l\"/><use href=\"#hollow-body-hold-n-e-kneecap.l\"/><use href=\"#hollow-body-hold-n-e-shank.l\"/><use href=\"#hollow-body-hold-n-e-foot.l\"/><use href=\"#hollow-body-hold-n-e-shcap.l\"/><use href=\"#hollow-body-hold-n-e-upper.l\"/><use href=\"#hollow-body-hold-n-e-elbowcap.l\"/><use href=\"#hollow-body-hold-n-e-fore.l\"/><use href=\"#hollow-body-hold-n-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#hollow-body-hold-n-e-thigh.l\"/><use href=\"#hollow-body-hold-n-e-kneecap.l\"/><use href=\"#hollow-body-hold-n-e-shank.l\"/><use href=\"#hollow-body-hold-n-e-foot.l\"/><use href=\"#hollow-body-hold-n-e-shcap.l\"/><use href=\"#hollow-body-hold-n-e-upper.l\"/><use href=\"#hollow-body-hold-n-e-elbowcap.l\"/><use href=\"#hollow-body-hold-n-e-fore.l\"/><use href=\"#hollow-body-hold-n-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hollow-body-hold-n-e-head\"/><use href=\"#hollow-body-hold-n-e-torso\"/><use href=\"#hollow-body-hold-n-e-thigh.r\"/><use href=\"#hollow-body-hold-n-e-kneecap.r\"/><use href=\"#hollow-body-hold-n-e-shank.r\"/><use href=\"#hollow-body-hold-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hollow-body-hold-n-e-head\"/><use href=\"#hollow-body-hold-n-e-torso\"/><use href=\"#hollow-body-hold-n-e-thigh.r\"/><use href=\"#hollow-body-hold-n-e-kneecap.r\"/><use href=\"#hollow-body-hold-n-e-shank.r\"/><use href=\"#hollow-body-hold-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hollow-body-hold-n-e-shcap.r\"/><use href=\"#hollow-body-hold-n-e-upper.r\"/><use href=\"#hollow-body-hold-n-e-elbowcap.r\"/><use href=\"#hollow-body-hold-n-e-fore.r\"/><use href=\"#hollow-body-hold-n-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#hollow-body-hold-n-e-shcap.r\"/><use href=\"#hollow-body-hold-n-e-upper.r\"/><use href=\"#hollow-body-hold-n-e-elbowcap.r\"/><use href=\"#hollow-body-hold-n-e-fore.r\"/><use href=\"#hollow-body-hold-n-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"134.19\" cy=\"311.96\" r=\"2.25\"/><circle class=\"joint\" cx=\"97.52\" cy=\"292.29\" r=\"2.25\"/><circle class=\"joint\" cx=\"182.2\" cy=\"322.18\" r=\"2.25\"/><circle class=\"joint\" cx=\"235.14\" cy=\"307.99\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#A20wG-1_Jx2OF-1ORx20011020132213221302032010010021100101201001002111002011211020132200020000000002000000200000000100001100000000200000020000000022000010000001012100021002000000200001110100220000000000001000020001000002001\"/><path class=\"arrow\" d=\"~MPA-1!D.1L!mDz1Lz!1*uZ\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M324.2 322.18A142 142 0 0 0 319.36 285.42\"/><g class=\"arc-ticks\"><path d=\"~MFR(1U*(1LFY10\"/><path d=\"~M_T*1J(X1LJW1Re\"/></g><path class=\"leader\" d=\"~MwO)1AF.1L0IAe\"/></g></g><path class=\"leader\" d=\"~MY(vFw*1L0E*e\"/><circle class=\"anchor\" cx=\"163.64\" cy=\"312.36\" r=\"1.5\"/><path class=\"leader\" d=\"M128.57 305.29L125.28 236H115.28\"/><circle class=\"anchor\" cx=\"128.57\" cy=\"305.29\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"hollow-body-hold-n-lowback\" data-key=\"lowback\" data-cue=\"Press your low back flat to the floor the whole hold.\" class=\"plate-callout two\" style=\"left:36.31%;top:54.75%\" aria-pressed=\"true\">Low back<br>down</button><button type=\"button\" id=\"hollow-body-hold-n-shoulders\" data-key=\"shoulders\" data-cue=\"Lift your shoulders and arms off the floor, biceps by your ears.\" class=\"plate-callout\" style=\"left:4.47%;top:59.78%\" aria-pressed=\"false\">Shoulders up</button><span class=\"plate-arc-label\" style=\"left:79.89%;top:54.75%\"><b>Legs</b><span>about 15°</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"hollow-body-hold-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"hollow-body-hold-m-st-head\" d=\"^0\"/><path id=\"hollow-body-hold-m-st-torso\" d=\"^1\"/><path id=\"hollow-body-hold-m-st-thigh.r\" d=\"^2\"/><path id=\"hollow-body-hold-m-st-kneecap.r\" d=\"^3\"/><path id=\"hollow-body-hold-m-st-shank.r\" d=\"^4\"/><path id=\"hollow-body-hold-m-st-foot.r\" d=\"^5\"/><path id=\"hollow-body-hold-m-st-shcap.r\" d=\"^6\"/><path id=\"hollow-body-hold-m-st-upper.r\" d=\"^7\"/><path id=\"hollow-body-hold-m-st-elbowcap.r\" d=\"^8\"/><path id=\"hollow-body-hold-m-st-fore.r\" d=\"^9\"/><path id=\"hollow-body-hold-m-st-palm.r\" d=\"^10\"/><path id=\"hollow-body-hold-m-e-thigh.l\" d=\"^11\"/><path id=\"hollow-body-hold-m-e-kneecap.l\" d=\"^12\"/><path id=\"hollow-body-hold-m-e-shank.l\" d=\"^13\"/><path id=\"hollow-body-hold-m-e-foot.l\" d=\"^14\"/><path id=\"hollow-body-hold-m-e-shcap.l\" d=\"^15\"/><path id=\"hollow-body-hold-m-e-upper.l\" d=\"^16\"/><path id=\"hollow-body-hold-m-e-elbowcap.l\" d=\"^17\"/><path id=\"hollow-body-hold-m-e-fore.l\" d=\"^18\"/><path id=\"hollow-body-hold-m-e-palm.l\" d=\"^19\"/><path id=\"hollow-body-hold-m-e-head\" d=\"^20\"/><path id=\"hollow-body-hold-m-e-torso\" d=\"^21\"/><path id=\"hollow-body-hold-m-e-thigh.r\" d=\"^11\"/><path id=\"hollow-body-hold-m-e-kneecap.r\" d=\"^12\"/><path id=\"hollow-body-hold-m-e-shank.r\" d=\"^13\"/><path id=\"hollow-body-hold-m-e-foot.r\" d=\"^14\"/><path id=\"hollow-body-hold-m-e-shcap.r\" d=\"^15\"/><path id=\"hollow-body-hold-m-e-upper.r\" d=\"^16\"/><path id=\"hollow-body-hold-m-e-elbowcap.r\" d=\"^17\"/><path id=\"hollow-body-hold-m-e-fore.r\" d=\"^18\"/><path id=\"hollow-body-hold-m-e-palm.r\" d=\"^19\"/><path id=\"hollow-body-hold-m-m-thigh.l\" d=\"~#F12SYz1Nwx2.Oy1EEx2zaN24y1HW1-7G7R4R3x2ON1Y1*k*8ThS1xjNcxN1H6B3U2I6!5!W1-13x1Ial.7ysFB1(fFvV2(x1Em00000001011111001000001000101000000101002021000000000100100101010100010000000020\"/><path id=\"hollow-body-hold-m-m-kneecap.l\" d=\"~~!wK1Y)*1AE12\"/><path id=\"hollow-body-hold-m-m-shank.l\" d=\"~#F12SIN1AF)1ByK1KF)1Ial3z1PW1)8I7R4R3z2x_1H8KcE5IasGbN7T_1Y1E3_2I6W5FX1f2y1BaP2FbHaNmS9!iR1SkOd02000100000200001000010100000200201010011000000120200200000002200001100000010010\"/><path id=\"hollow-body-hold-m-m-foot.l\" d=\"~#o2AXX1_*!1ENX1B).1(9.5!5.fy1TuHV1I-1IS1SJ1VsYi-e_eXmWs.ev(aVo(1Ut000200000100001010022000010000000000000101000100\"/><path id=\"hollow-body-hold-m-m-thigh.r\" d=\"^32\"/><path id=\"hollow-body-hold-m-m-kneecap.r\" d=\"^33\"/><path id=\"hollow-body-hold-m-m-shank.r\" d=\"^34\"/><path id=\"hollow-body-hold-m-m-foot.r\" d=\"^35\"/><path id=\"hollow-body-hold-m-mf-head\" d=\"^20\"/><path id=\"hollow-body-hold-m-mf-torso\" d=\"^21\"/><path id=\"hollow-body-hold-m-mf-shcap.l\" d=\"^15\"/><path id=\"hollow-body-hold-m-mf-upper.l\" d=\"^16\"/><path id=\"hollow-body-hold-m-mf-elbowcap.l\" d=\"^17\"/><path id=\"hollow-body-hold-m-mf-fore.l\" d=\"^18\"/><path id=\"hollow-body-hold-m-mf-palm.l\" d=\"^19\"/><path id=\"hollow-body-hold-m-mf-shcap.r\" d=\"^15\"/><path id=\"hollow-body-hold-m-mf-upper.r\" d=\"^16\"/><path id=\"hollow-body-hold-m-mf-elbowcap.r\" d=\"^17\"/><path id=\"hollow-body-hold-m-mf-fore.r\" d=\"^18\"/><path id=\"hollow-body-hold-m-mf-palm.r\" d=\"^19\"/><path id=\"hollow-body-hold-m-mo-0\" d=\"^20\"/><path id=\"hollow-body-hold-m-mo-1\" d=\"^21\"/><path id=\"hollow-body-hold-m-mo-2\" d=\"^11\"/><path id=\"hollow-body-hold-m-mo-3\" d=\"^12\"/><path id=\"hollow-body-hold-m-mo-4\" d=\"^13\"/><path id=\"hollow-body-hold-m-mo-5\" d=\"^14\"/><path id=\"hollow-body-hold-m-mo-6\" d=\"^15\"/><path id=\"hollow-body-hold-m-mo-7\" d=\"^16\"/><path id=\"hollow-body-hold-m-mo-8\" d=\"^17\"/><path id=\"hollow-body-hold-m-mo-9\" d=\"^18\"/><path id=\"hollow-body-hold-m-mo-10\" d=\"^19\"/><path id=\"hollow-body-hold-m-mo-11\" d=\"^11\"/><path id=\"hollow-body-hold-m-mo-12\" d=\"^12\"/><path id=\"hollow-body-hold-m-mo-13\" d=\"^13\"/><path id=\"hollow-body-hold-m-mo-14\" d=\"^14\"/><path id=\"hollow-body-hold-m-mo-15\" d=\"^15\"/><path id=\"hollow-body-hold-m-mo-16\" d=\"^16\"/><path id=\"hollow-body-hold-m-mo-17\" d=\"^17\"/><path id=\"hollow-body-hold-m-mo-18\" d=\"^18\"/><path id=\"hollow-body-hold-m-mo-19\" d=\"^19\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#hollow-body-hold-m-dots)\"/>\n  <path class=\"floorline\" d=\"^22\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hollow-body-hold-m-st-head\"/><use href=\"#hollow-body-hold-m-st-torso\"/><use href=\"#hollow-body-hold-m-st-thigh.r\"/><use href=\"#hollow-body-hold-m-st-kneecap.r\"/><use href=\"#hollow-body-hold-m-st-shank.r\"/><use href=\"#hollow-body-hold-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hollow-body-hold-m-st-head\"/><use href=\"#hollow-body-hold-m-st-torso\"/><use href=\"#hollow-body-hold-m-st-thigh.r\"/><use href=\"#hollow-body-hold-m-st-kneecap.r\"/><use href=\"#hollow-body-hold-m-st-shank.r\"/><use href=\"#hollow-body-hold-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hollow-body-hold-m-st-shcap.r\"/><use href=\"#hollow-body-hold-m-st-upper.r\"/><use href=\"#hollow-body-hold-m-st-elbowcap.r\"/><use href=\"#hollow-body-hold-m-st-fore.r\"/><use href=\"#hollow-body-hold-m-st-palm.r\"/></g><g class=\"u-fill\"><use href=\"#hollow-body-hold-m-st-shcap.r\"/><use href=\"#hollow-body-hold-m-st-upper.r\"/><use href=\"#hollow-body-hold-m-st-elbowcap.r\"/><use href=\"#hollow-body-hold-m-st-fore.r\"/><use href=\"#hollow-body-hold-m-st-palm.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#hollow-body-hold-m-e-thigh.l\"/><use href=\"#hollow-body-hold-m-e-kneecap.l\"/><use href=\"#hollow-body-hold-m-e-shank.l\"/><use href=\"#hollow-body-hold-m-e-foot.l\"/><use href=\"#hollow-body-hold-m-e-shcap.l\"/><use href=\"#hollow-body-hold-m-e-upper.l\"/><use href=\"#hollow-body-hold-m-e-elbowcap.l\"/><use href=\"#hollow-body-hold-m-e-fore.l\"/><use href=\"#hollow-body-hold-m-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#hollow-body-hold-m-e-thigh.l\"/><use href=\"#hollow-body-hold-m-e-kneecap.l\"/><use href=\"#hollow-body-hold-m-e-shank.l\"/><use href=\"#hollow-body-hold-m-e-foot.l\"/><use href=\"#hollow-body-hold-m-e-shcap.l\"/><use href=\"#hollow-body-hold-m-e-upper.l\"/><use href=\"#hollow-body-hold-m-e-elbowcap.l\"/><use href=\"#hollow-body-hold-m-e-fore.l\"/><use href=\"#hollow-body-hold-m-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hollow-body-hold-m-e-head\"/><use href=\"#hollow-body-hold-m-e-torso\"/><use href=\"#hollow-body-hold-m-e-thigh.r\"/><use href=\"#hollow-body-hold-m-e-kneecap.r\"/><use href=\"#hollow-body-hold-m-e-shank.r\"/><use href=\"#hollow-body-hold-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hollow-body-hold-m-e-head\"/><use href=\"#hollow-body-hold-m-e-torso\"/><use href=\"#hollow-body-hold-m-e-thigh.r\"/><use href=\"#hollow-body-hold-m-e-kneecap.r\"/><use href=\"#hollow-body-hold-m-e-shank.r\"/><use href=\"#hollow-body-hold-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hollow-body-hold-m-e-shcap.r\"/><use href=\"#hollow-body-hold-m-e-upper.r\"/><use href=\"#hollow-body-hold-m-e-elbowcap.r\"/><use href=\"#hollow-body-hold-m-e-fore.r\"/><use href=\"#hollow-body-hold-m-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#hollow-body-hold-m-e-shcap.r\"/><use href=\"#hollow-body-hold-m-e-upper.r\"/><use href=\"#hollow-body-hold-m-e-elbowcap.r\"/><use href=\"#hollow-body-hold-m-e-fore.r\"/><use href=\"#hollow-body-hold-m-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"134.19\" cy=\"311.96\" r=\"2.25\"/><circle class=\"joint\" cx=\"97.52\" cy=\"292.29\" r=\"2.25\"/><circle class=\"joint\" cx=\"182.2\" cy=\"322.18\" r=\"2.25\"/><circle class=\"joint\" cx=\"235.14\" cy=\"307.99\" r=\"2.25\"/></g><mask id=\"hollow-body-hold-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#hollow-body-hold-m-mf-head\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-mf-torso\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-m-thigh.l\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-m-shank.l\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-m-foot.l\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-mf-upper.l\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-mf-fore.l\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-mf-palm.l\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-m-thigh.r\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-m-shank.r\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-m-foot.r\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-mf-upper.r\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-mf-fore.r\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-mf-palm.r\" fill=\"#000\"/><use href=\"#hollow-body-hold-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hollow-body-hold-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#hollow-body-hold-m-mmask)\"><g class=\"u-stroke\"><use href=\"#hollow-body-hold-m-m-thigh.l\"/><use href=\"#hollow-body-hold-m-m-kneecap.l\"/><use href=\"#hollow-body-hold-m-m-shank.l\"/><use href=\"#hollow-body-hold-m-m-foot.l\"/><use href=\"#hollow-body-hold-m-m-thigh.r\"/><use href=\"#hollow-body-hold-m-m-kneecap.r\"/><use href=\"#hollow-body-hold-m-m-shank.r\"/><use href=\"#hollow-body-hold-m-m-foot.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MyYW1Y(_1LDjw.1MRp*hLSp(hLKfOO1\"/><path class=\"leader m\" d=\"~MwR*1_D_1L0-Hb\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"hollow-body-hold-m-low\" data-key=\"low\" data-cue=\"Your legs sink too low, which might put too much stress on the hip flexors.\" class=\"plate-callout two m\" style=\"left:70.39%;top:55.87%\" aria-pressed=\"true\">Legs too<br>low</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "lowback",
        cues: [{ key: "lowback", cue: "Press your low back flat to the floor the whole hold." }, { key: "shoulders", cue: "Lift your shoulders and arms off the floor, biceps by your ears." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "low",
        cues: [{ key: "low", cue: "Your legs sink too low, which might put too much stress on the hip flexors." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Legs too low</b><span>Your legs sink too low, which might put too much stress on the hip flexors.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: hold max 30 seconds\"><div class=\"tempo-seg\" style=\"flex:max 30 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>max 30 s</span></div></div></div>",
      alt: "Hollow body hold, side view. Lying on the back with the low back pressed to the floor, the lifter lifts the shoulders, arms by the ears, and the straight legs about 15 degrees off the floor, and holds the crescent.",
      mistakeAlt: "Hollow Body Hold: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c1) is on setup step 2."
  },
  contacts: [
    "floor-body"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Lie on your back, legs straight, feet together.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-hollow",
          "fv-hollow"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "position",
      "text": "Reach your arms overhead, biceps by your ears.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-hollow",
          "fv-hollow"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "brace",
      "text": "Breathe out, pull your ribs down, press your lower back flat.",
      "zoom": "low-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-hollow",
          "ggr-hollow"
        ],
        "note": "card c2"
      }
    },
    {
      "kind": "position",
      "text": "Lift your shoulders and legs off the floor and hold.",
      "zoom": "leg-height",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-hollow",
          "ggr-hollow"
        ],
        "note": "card c2"
      }
    },
    {
      "kind": "brace",
      "text": "Body in a crescent, hips down. Breathe shallowly, don't hold your breath.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-hollow",
          "fv-hollow"
        ],
        "note": "card c3, c10"
      }
    }
  ],
  posture: [
    {
      "key": "crescent",
      "label": "Crescent shape",
      "detail": "Lower back and hips stay on the floor, body like a crescent.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-hollow"
        ],
        "note": "card c3"
      }
    },
    {
      "key": "low-back",
      "label": "Low back down",
      "detail": "No space under your lower back. Press it down. Stop the set if it lifts.",
      "anchor": {
        "pose": "end",
        "at": "lumbar"
      },
      "zoom": "low-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-hollow",
          "ggr-hollow",
          "fv-hollow"
        ],
        "note": "card c2, c7"
      }
    },
    {
      "key": "legs",
      "label": "Legs low",
      "detail": "Legs straight, off the floor, no higher than about 30 degrees. Not too low: about 15 to 30 degrees.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "leg-height",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-hollow",
          "ggr-hollow"
        ],
        "note": "card c4, c5, c6"
      }
    },
    {
      "key": "head",
      "label": "Chin lowered",
      "detail": "Lower your chin and look toward your feet. Don't tuck it. No hyperextended neck.",
      "anchor": {
        "pose": "end",
        "at": "chin"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-hollow",
          "fv-hollow"
        ],
        "note": "card c9"
      }
    },
    {
      "key": "shoulders",
      "label": "Shoulders up",
      "detail": "Shoulder blades and head stay up. If they drop, lower your limbs, rest, then do another set.",
      "anchor": {
        "pose": "end",
        "at": "shoulder.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-hollow"
        ],
        "note": "card c8"
      }
    },
    {
      "key": "breathe",
      "label": "Breathing",
      "detail": "Breathe shallowly. Don't hold your breath.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-hollow"
        ],
        "note": "card c10"
      }
    }
  ],
  zooms: [
    {
      "key": "leg-height",
      "chip": "Leg height",
      "heading": "Leg height",
      "kind": "posture",
      "feelRow": "hips"
    },
    {
      "key": "low-back",
      "chip": "Low back",
      "heading": "Low back",
      "kind": "posture",
      "feelRow": "low-back"
    }
  ],
  chips: [
    "leg-height",
    "low-back",
    "feel"
  ],
  copy: {
    "setupLine": "Breathe shallowly and don't hold your breath. Lower your chin toward your feet, but don't tuck it.",
    "mistakeLine": "Keep your legs off the floor. Legs too low might stress the hip flexors over the abs.",
    "cueLine": "Low back down, body a crescent."
  },
  mistakes: [],
  risks: [
    {
      "key": "arch",
      "text": "An arched lower back could lead to injury.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-hollow",
          "ggr-hollow",
          "fv-hollow"
        ],
        "note": "card c7"
      }
    },
    {
      "key": "drop",
      "text": "Dropping shoulder blades and head may cause low back pain. Lower your limbs, rest.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-hollow"
        ],
        "note": "card c8"
      }
    },
    {
      "key": "neck",
      "text": "Hyperextending your neck could result in neck pain.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-hollow",
          "fv-hollow"
        ],
        "note": "card c9"
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
    "bb-hollow",
    "ggr-hollow",
    "fv-hollow",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/hollow_body_hold.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

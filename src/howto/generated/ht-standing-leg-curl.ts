// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=95d3f231c3d57e062e9b0205f7d512bc3ab12c66667b351a7cd62301b6e0616d
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_standing_leg_curl",
  name: "Standing Leg Curl",
  hashes: { inputsSha256: "95d3f231c3d57e062e9b0205f7d512bc3ab12c66667b351a7cd62301b6e0616d", golden: "f3a0160972d56d99a50c8755abef5e2d90ed7e28219e4f456a6817b86722abfe" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"standing-leg-curl-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"standing-leg-curl-n-st-shank.r\" d=\"~#F12UBuUXT1OKu.FS1!2TbD12jF)1W6I7w3V3D2xz2N8*cw1.b)5EeP9Iy2I2B4G5G8EaF(1G11n*b-dPaGfNn.1WlwbWp10010011110002010000012000000012000000100010000000012010100000010000000000011100\"/><path id=\"standing-leg-curl-n-st-foot.r\" d=\"~#o2YUtSw)1IDuRw(1_cD3Uh*7SpxoU-2B3XJ2-4OD1)7*n0TG1_4BbXc_sEbImSp120000002000002101200000100220002000020100210110\"/><path id=\"standing-leg-curl-n-g0-shank.r\" d=\"~#F12HPu!*S1RRvz!R1w9.7uqXA1JT1U9B2W4E1AF1XV1JeV5W7B9D3Bf(K1-P1c.4g-9BJ1AK1vpF6EaIho*pJaxeUgT5Pr10001010000010100100000001000001010101020000110000020000000100000020001000200201\"/><path id=\"standing-leg-curl-n-g0-foot.r\" d=\"~#o2NTn_..1BUoVI.1U8wawjP3Yy1)4DI2_P1z!1)O1-qTsXjVdXA1)j.1.gwuJ7)w1y8101200000110011111000121000010000100020000000002\"/><path id=\"standing-leg-curl-n-g1-shank.r\" d=\"~#F12_Ev!NS1IWw1GDS1_bE1cD1T.1wlD9W3P4W1Y)1*kyfP3Pbz3HbRaWx2Vdy3V3y6-7x(1Sbbz1(a.4ReG9GrK6*kU5KkDj01100200000110012020002000000100100002200000000101010100120100012101012100010100\"/><path id=\"standing-leg-curl-n-g1-foot.r\" d=\"~#o2!NkN_V1*Sl))V1H1ydSd_dHv!fWx1AT2-l.G2T5XD1z8Tm-iIB1D8*eNkDnXvEc001100000000000000101110022001021010002100000200\"/><path id=\"standing-leg-curl-n-e-thigh.l\" d=\"~#F12yEtWTE1GztVAD1-1VbE11P3Y(1(5-7Y2*3S2BV1Hc*m2EkIc*mR2BV1X2*3*5-7O3Y(1F11_1VbBv-b*l_F10wA1wm_F110000000000002120010010000000200001200101011000002020000000000000101002000002101\"/><path id=\"standing-leg-curl-n-e-kneecap.l\" d=\"~~yEuW.T1_J10\"/><path id=\"standing-leg-curl-n-e-shank.l\" d=\"^0\"/><path id=\"standing-leg-curl-n-e-foot.l\" d=\"^1\"/><path id=\"standing-leg-curl-n-e-shcap.l\" d=\"~~!Nw1FHqwP10\"/><path id=\"standing-leg-curl-n-e-upper.l\" d=\"~#F12YRw1U_q.Hw1*AqO1O583UcWrW1V4mE2eXfw3xlT5Of-fzeKa.b)1E1G4K2A8Dt76K2E5)jT7z4WsW7AlSlFj00000010002001000100000000010000210000000000021000100100020000002220000010101000\"/><path id=\"standing-leg-curl-n-e-elbowcap.l\" d=\"~~H!y1A!vDz10\"/><path id=\"standing-leg-curl-n-e-fore.l\" d=\"~#F12Wzz1DUw1*-y1EAw1x3E6H1eJlJjI1*68E2X9)bz3zeI7R8Odz5KaKbE21T6I2(f(naJ1X5*3xen_4UlFbAd_k(710010000002001000001202100002001002200000002000120100101000000100010110022200100\"/><path id=\"standing-leg-curl-n-e-fist.l\" d=\"~~ADE1FYA1ww10\"/><path id=\"standing-leg-curl-n-e-head\" d=\"~#w12NWz1AOgVBy1-!fEmUfRky6Oa)4*3y4I3T8.5KcOdBp(6Vb4X9*iI3yoz7AnI2(jY6Agyj.4Wi0100121010020001210002000010000000200001000022020002000101000000\"/><path id=\"standing-leg-curl-n-e-torso\" d=\"~#_12YJx1N!kE(x1IPjI8)7z3hJ6wjJ8(7_9yiH6y1z2XoVk-bKdS2Sg*1UlX2_o-bNkEeH6V8)4zhXkIE1E6XsI6z1I9T1Y9(h_1P8BbBaBhA5*9NjF5J7Pe.8Y1P8KX2yh10100100000000200000000000000011111010001000001012020011110000100001000010200200100000000100121210010001100002000000\"/><path id=\"standing-leg-curl-n-e-thigh.r\" d=\"^6\"/><path id=\"standing-leg-curl-n-e-kneecap.r\" d=\"^7\"/><path id=\"standing-leg-curl-n-e-shank.r\" d=\"~#F12Wzw1yPS1XNx1XzT1NaY5dD1-!1)gH5H8_2(3Dw2JjHaSbFby4FfB2Y*1JqS4B1P9.2R-1Bqgz1UbF2O6*fXi*kIkK7Xrw400000000001011111000000010101001010010000000020022000120001100000000100101010000\"/><path id=\"standing-leg-curl-n-e-foot.r\" d=\"~#o2NIlJyO1-BmV.O1I6SbD3yjPgwvxkHX2Po*F2Wh)y1D6BnD6KG1DfO7J3Wu.iBs010000000010000101000000000000210100100020000000\"/><path id=\"standing-leg-curl-n-e-shcap.r\" d=\"^8\"/><path id=\"standing-leg-curl-n-e-upper.r\" d=\"^9\"/><path id=\"standing-leg-curl-n-e-elbowcap.r\" d=\"^10\"/><path id=\"standing-leg-curl-n-e-fore.r\" d=\"^11\"/><path id=\"standing-leg-curl-n-e-fist.r\" d=\"^12\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#standing-leg-curl-n-dots)\"/>\n  <path class=\"floorline\" d=\"M128.32 338.77H271.61\"/><path class=\"eq\" d=\"~MFOw1N.)1L0GIaQ0)o)oHS9LAkwpQ)o0zkwpLwpHS9Q0wpwpGS9Lzk)oQwp0Ak)oZ\"/><path class=\"eq\" d=\"~MJzF1yFE1LJe.A3Q(1Rd)pJV2LUbPfQRd*1OfUbLy1F-2Q*1SdyqIV2LTbOfQUd(1SfTbZ\"/><path class=\"eq\" d=\"~MSDrDyy2LNWn0Q_m0T)m.mL-m!mQ0.m-m.mLT)m!mQ.m0S)m!mL!m.mQ0!m!m!mZ\"/><path class=\"eq\" d=\"~M!Uz1_.O1LwD4EO7Q(8*fxK4JW6Ly7!oQ*f*8.ow7LxK3FF7Q*8(f(J4IW6L)6.oQ(f(8!o)6Z\"/><path class=\"eq\" d=\"~MJYS1Dyw2L0E!rQ0EiEiwHrLFiFiQGi0GiFiLHiwHrQ0FiHi)GrLGiEiQFi0FiEiZ\"/><path class=\"eq\" d=\"~MJYR1SHA1LRA90QVd0!W8WdLWdVdQ0WdWdWdL!W8VdQYd0-W8VdLXdWdQ0VdXdVdZ\"/><path class=\"eq\" d=\"~MJYR1JER1LTNe0QXd0!weYdLYdXdQ0WdYdWdL!weVdQYd0.weVdLXdWdQ0XdXdXdZ\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-n-st-shank.r\"/><use href=\"#standing-leg-curl-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-n-st-shank.r\"/><use href=\"#standing-leg-curl-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq\" d=\"~MH_uPXT1LI_7JU5Q.eWaDW7-_4LD4RpQWa_eSpA4L_w7OY5Q_eVaEW7!_4Lz4PpQVa.eOpB4Z\"/><path class=\"eq\" d=\"~~PGlNB_1HS11\"/><path class=\"eq-pin\" d=\"~~PVmNB_1F60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-n-g0-shank.r\"/><use href=\"#standing-leg-curl-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-n-g0-shank.r\"/><use href=\"#standing-leg-curl-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq\" d=\"~MHxvUGT1LRU9A4QGi8Py9NeLyiRiQ8FiSiwiLwy9zmQFi7Ry9IeL)hPiQ7GiOixiZ\"/><path class=\"eq\" d=\"~~NFjHwU1HS11\"/><path class=\"eq-pin\" d=\"~~NUkHwU1F60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-n-g1-shank.r\"/><use href=\"#standing-leg-curl-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-n-g1-shank.r\"/><use href=\"#standing-leg-curl-n-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MwOvFyT1Lz)7RK5QzfGaYB7JS5LJp-4QGaAf_4JpLH_7FU4QAfHaXB7KS5LIp_4QHazf-4KpZ\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-n-e-thigh.l\"/><use href=\"#standing-leg-curl-n-e-kneecap.l\"/><use href=\"#standing-leg-curl-n-e-shank.l\"/><use href=\"#standing-leg-curl-n-e-foot.l\"/><use href=\"#standing-leg-curl-n-e-shcap.l\"/><use href=\"#standing-leg-curl-n-e-upper.l\"/><use href=\"#standing-leg-curl-n-e-elbowcap.l\"/><use href=\"#standing-leg-curl-n-e-fore.l\"/><use href=\"#standing-leg-curl-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-n-e-thigh.l\"/><use href=\"#standing-leg-curl-n-e-kneecap.l\"/><use href=\"#standing-leg-curl-n-e-shank.l\"/><use href=\"#standing-leg-curl-n-e-foot.l\"/><use href=\"#standing-leg-curl-n-e-shcap.l\"/><use href=\"#standing-leg-curl-n-e-upper.l\"/><use href=\"#standing-leg-curl-n-e-elbowcap.l\"/><use href=\"#standing-leg-curl-n-e-fore.l\"/><use href=\"#standing-leg-curl-n-e-fist.l\"/></g></g><path class=\"eq\" d=\"~~DAlP-K1HS11\"/><path class=\"eq-pin\" d=\"~~FPmP-K1F60\"/><path class=\"eq\" d=\"~MSJy1PGR1L-*2S)1QB5P3A!2*W1LDfHbQP3D5-4EiLAV2Ex2QD5O3z!2!W1LBfEbQO3z5_4HiZ\"/><path class=\"eq\" d=\"~~YGx1AVR1HS11\"/><path class=\"eq-pin\" d=\"~~YVy1AVR1F60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-n-e-head\"/><use href=\"#standing-leg-curl-n-e-torso\"/><use href=\"#standing-leg-curl-n-e-thigh.r\"/><use href=\"#standing-leg-curl-n-e-kneecap.r\"/><use href=\"#standing-leg-curl-n-e-shank.r\"/><use href=\"#standing-leg-curl-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-n-e-head\"/><use href=\"#standing-leg-curl-n-e-torso\"/><use href=\"#standing-leg-curl-n-e-thigh.r\"/><use href=\"#standing-leg-curl-n-e-kneecap.r\"/><use href=\"#standing-leg-curl-n-e-shank.r\"/><use href=\"#standing-leg-curl-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-n-e-shcap.r\"/><use href=\"#standing-leg-curl-n-e-upper.r\"/><use href=\"#standing-leg-curl-n-e-elbowcap.r\"/><use href=\"#standing-leg-curl-n-e-fore.r\"/><use href=\"#standing-leg-curl-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-n-e-shcap.r\"/><use href=\"#standing-leg-curl-n-e-upper.r\"/><use href=\"#standing-leg-curl-n-e-elbowcap.r\"/><use href=\"#standing-leg-curl-n-e-fore.r\"/><use href=\"#standing-leg-curl-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~~JYuW.T1Nr0\"/><path class=\"eq-pin\" d=\"~~SKvW.T1F60\"/><path class=\"eq-line m-line\" d=\"~MNUtSx(1L.3EjL)6(2LK5N5L*2w7L0Y7L(2w7LN5N5Lw7(2LY70Lw7*2LN5K5L(2)6L0X7L*2)6LK5K5L)6*2\"/><circle class=\"joint\" cx=\"173.9\" cy=\"134.76\" r=\"2.25\"/><circle class=\"joint\" cx=\"184.25\" cy=\"163.22\" r=\"2.25\"/><circle class=\"joint\" cx=\"161.89\" cy=\"202.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"161.89\" cy=\"265.55\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#U20WXr!Wx2RFs*.x28j8j8l8hahajchcjafgfchefgdgfedidibgbibkbi9i7m9i7m7i5m3m5k3m3k1m0m1k1o4i0o2k4m4k6m4002002000001010002000200002000200112102200000000022200000000000000000200000000012011111010210100000001000002202000000001001000020001010100200210012000000200000200000110\"/><path class=\"arrow\" d=\"~MPEiAKN1LJ7FG1LGI1.T1Z\"/></g><path class=\"leader\" d=\"M169.39 265.55L189 312H199\"/><circle class=\"anchor\" cx=\"169.39\" cy=\"265.55\" r=\"1.5\"/><path class=\"leader\" d=\"M153.52 144.16L153.33 132H143.33\"/><circle class=\"anchor\" cx=\"153.52\" cy=\"144.16\" r=\"1.5\"/><path class=\"leader\" d=\"~MUOi_)K1L0-E2\"/><circle class=\"anchor\" cx=\"94.66\" cy=\"235.49\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"standing-leg-curl-n-knee\" data-key=\"knee\" data-cue=\"Keep your knee steady as it bends and straightens.\" class=\"plate-callout two\" style=\"left:54.19%;top:81.01%\" aria-pressed=\"true\">Knee<br>steady</button><button type=\"button\" id=\"standing-leg-curl-n-still\" data-key=\"still\" data-cue=\"Thighs on the pad, upper body still.\" class=\"plate-callout two\" style=\"left:16.76%;top:30.73%\" aria-pressed=\"false\">Upper body<br>still</button><button type=\"button\" id=\"standing-leg-curl-n-foot\" data-key=\"foot\" data-cue=\"Curl until your foot is higher than your knee.\" class=\"plate-callout two\" style=\"left:8.38%;top:51.4%\" aria-pressed=\"false\">Foot above<br>knee</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"standing-leg-curl-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"standing-leg-curl-m-st-shank.r\" d=\"^0\"/><path id=\"standing-leg-curl-m-st-foot.r\" d=\"^1\"/><path id=\"standing-leg-curl-m-g0-shank.r\" d=\"^2\"/><path id=\"standing-leg-curl-m-g0-foot.r\" d=\"^3\"/><path id=\"standing-leg-curl-m-g1-shank.r\" d=\"^4\"/><path id=\"standing-leg-curl-m-g1-foot.r\" d=\"^5\"/><path id=\"standing-leg-curl-m-e-thigh.l\" d=\"^6\"/><path id=\"standing-leg-curl-m-e-kneecap.l\" d=\"^7\"/><path id=\"standing-leg-curl-m-e-shank.l\" d=\"^0\"/><path id=\"standing-leg-curl-m-e-foot.l\" d=\"^1\"/><path id=\"standing-leg-curl-m-e-shcap.l\" d=\"^8\"/><path id=\"standing-leg-curl-m-e-upper.l\" d=\"^9\"/><path id=\"standing-leg-curl-m-e-elbowcap.l\" d=\"^10\"/><path id=\"standing-leg-curl-m-e-fore.l\" d=\"^11\"/><path id=\"standing-leg-curl-m-e-fist.l\" d=\"^12\"/><path id=\"standing-leg-curl-m-e-head\" d=\"^13\"/><path id=\"standing-leg-curl-m-e-torso\" d=\"^14\"/><path id=\"standing-leg-curl-m-e-thigh.r\" d=\"^6\"/><path id=\"standing-leg-curl-m-e-kneecap.r\" d=\"^7\"/><path id=\"standing-leg-curl-m-e-shank.r\" d=\"^15\"/><path id=\"standing-leg-curl-m-e-foot.r\" d=\"^16\"/><path id=\"standing-leg-curl-m-e-shcap.r\" d=\"^8\"/><path id=\"standing-leg-curl-m-e-upper.r\" d=\"^9\"/><path id=\"standing-leg-curl-m-e-elbowcap.r\" d=\"^10\"/><path id=\"standing-leg-curl-m-e-fore.r\" d=\"^11\"/><path id=\"standing-leg-curl-m-e-fist.r\" d=\"^12\"/><path id=\"standing-leg-curl-m-m-head\" d=\"^13\"/><path id=\"standing-leg-curl-m-mf-torso\" d=\"~#_12YJx1N!kE(x1IPjI8)7z3hJ6wjJ8(7_9yi(nX1.a)pxx1Kexjy1UgS1Wl_1YqK6!mX9A8x7O1-h)b.H15It)a*8Kv-hHe_tN8yeBbBaBhA5*9NjF5J7Pe.8Y1P8KX2yh10100100000000200000000001000020000000000011100010100022001000002000000000000101012000000100121210010001100002000000\"/><path id=\"standing-leg-curl-m-mf-thigh.l\" d=\"^6\"/><path id=\"standing-leg-curl-m-mf-kneecap.l\" d=\"^7\"/><path id=\"standing-leg-curl-m-mf-shank.l\" d=\"^0\"/><path id=\"standing-leg-curl-m-mf-foot.l\" d=\"^1\"/><path id=\"standing-leg-curl-m-mf-shcap.l\" d=\"^8\"/><path id=\"standing-leg-curl-m-mf-upper.l\" d=\"^9\"/><path id=\"standing-leg-curl-m-mf-elbowcap.l\" d=\"^10\"/><path id=\"standing-leg-curl-m-mf-fore.l\" d=\"^11\"/><path id=\"standing-leg-curl-m-mf-fist.l\" d=\"^12\"/><path id=\"standing-leg-curl-m-mf-thigh.r\" d=\"^6\"/><path id=\"standing-leg-curl-m-mf-kneecap.r\" d=\"^7\"/><path id=\"standing-leg-curl-m-mf-shank.r\" d=\"^15\"/><path id=\"standing-leg-curl-m-mf-foot.r\" d=\"^16\"/><path id=\"standing-leg-curl-m-mf-shcap.r\" d=\"^8\"/><path id=\"standing-leg-curl-m-mf-upper.r\" d=\"^9\"/><path id=\"standing-leg-curl-m-mf-elbowcap.r\" d=\"^10\"/><path id=\"standing-leg-curl-m-mf-fore.r\" d=\"^11\"/><path id=\"standing-leg-curl-m-mf-fist.r\" d=\"^12\"/><path id=\"standing-leg-curl-m-mo-0\" d=\"^13\"/><path id=\"standing-leg-curl-m-mo-1\" d=\"^14\"/><path id=\"standing-leg-curl-m-mo-2\" d=\"^6\"/><path id=\"standing-leg-curl-m-mo-3\" d=\"^7\"/><path id=\"standing-leg-curl-m-mo-4\" d=\"^0\"/><path id=\"standing-leg-curl-m-mo-5\" d=\"^1\"/><path id=\"standing-leg-curl-m-mo-6\" d=\"^8\"/><path id=\"standing-leg-curl-m-mo-7\" d=\"^9\"/><path id=\"standing-leg-curl-m-mo-8\" d=\"^10\"/><path id=\"standing-leg-curl-m-mo-9\" d=\"^11\"/><path id=\"standing-leg-curl-m-mo-10\" d=\"^12\"/><path id=\"standing-leg-curl-m-mo-11\" d=\"^6\"/><path id=\"standing-leg-curl-m-mo-12\" d=\"^7\"/><path id=\"standing-leg-curl-m-mo-13\" d=\"^15\"/><path id=\"standing-leg-curl-m-mo-14\" d=\"^16\"/><path id=\"standing-leg-curl-m-mo-15\" d=\"^8\"/><path id=\"standing-leg-curl-m-mo-16\" d=\"^9\"/><path id=\"standing-leg-curl-m-mo-17\" d=\"^10\"/><path id=\"standing-leg-curl-m-mo-18\" d=\"^11\"/><path id=\"standing-leg-curl-m-mo-19\" d=\"^12\"/><path id=\"standing-leg-curl-m-mo-20\" d=\"^31\"/><path id=\"standing-leg-curl-m-mo-21\" d=\"^32\"/><path id=\"standing-leg-curl-m-mo-22\" d=\"^33\"/><path id=\"standing-leg-curl-m-mo-23\" d=\"^37\"/><path id=\"standing-leg-curl-m-mo-24\" d=\"^38\"/><path id=\"standing-leg-curl-m-mo-25\" d=\"^34\"/><path id=\"standing-leg-curl-m-mo-26\" d=\"^35\"/><path id=\"standing-leg-curl-m-mo-27\" d=\"^36\"/><path id=\"standing-leg-curl-m-mo-28\" d=\"^18\"/><path id=\"standing-leg-curl-m-mo-29\" d=\"^19\"/><path id=\"standing-leg-curl-m-mo-30\" d=\"^20\"/><path id=\"standing-leg-curl-m-mo-31\" d=\"^21\"/><path id=\"standing-leg-curl-m-mo-32\" d=\"^22\"/><path id=\"standing-leg-curl-m-mo-33\" d=\"^23\"/><path id=\"standing-leg-curl-m-mo-34\" d=\"^24\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#standing-leg-curl-m-dots)\"/>\n  <path class=\"floorline\" d=\"^17\"/><path class=\"eq\" d=\"^18\"/><path class=\"eq\" d=\"^19\"/><path class=\"eq\" d=\"^20\"/><path class=\"eq\" d=\"^21\"/><path class=\"eq\" d=\"^22\"/><path class=\"eq\" d=\"^23\"/><path class=\"eq\" d=\"^24\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-m-st-shank.r\"/><use href=\"#standing-leg-curl-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-m-st-shank.r\"/><use href=\"#standing-leg-curl-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq\" d=\"^25\"/><path class=\"eq\" d=\"^26\"/><path class=\"eq-pin\" d=\"^27\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-m-g0-shank.r\"/><use href=\"#standing-leg-curl-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-m-g0-shank.r\"/><use href=\"#standing-leg-curl-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq\" d=\"^28\"/><path class=\"eq\" d=\"^29\"/><path class=\"eq-pin\" d=\"^30\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-m-g1-shank.r\"/><use href=\"#standing-leg-curl-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-m-g1-shank.r\"/><use href=\"#standing-leg-curl-m-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^31\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-m-e-thigh.l\"/><use href=\"#standing-leg-curl-m-e-kneecap.l\"/><use href=\"#standing-leg-curl-m-e-shank.l\"/><use href=\"#standing-leg-curl-m-e-foot.l\"/><use href=\"#standing-leg-curl-m-e-shcap.l\"/><use href=\"#standing-leg-curl-m-e-upper.l\"/><use href=\"#standing-leg-curl-m-e-elbowcap.l\"/><use href=\"#standing-leg-curl-m-e-fore.l\"/><use href=\"#standing-leg-curl-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-m-e-thigh.l\"/><use href=\"#standing-leg-curl-m-e-kneecap.l\"/><use href=\"#standing-leg-curl-m-e-shank.l\"/><use href=\"#standing-leg-curl-m-e-foot.l\"/><use href=\"#standing-leg-curl-m-e-shcap.l\"/><use href=\"#standing-leg-curl-m-e-upper.l\"/><use href=\"#standing-leg-curl-m-e-elbowcap.l\"/><use href=\"#standing-leg-curl-m-e-fore.l\"/><use href=\"#standing-leg-curl-m-e-fist.l\"/></g></g><path class=\"eq\" d=\"^32\"/><path class=\"eq-pin\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq-pin\" d=\"^36\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-m-e-head\"/><use href=\"#standing-leg-curl-m-e-torso\"/><use href=\"#standing-leg-curl-m-e-thigh.r\"/><use href=\"#standing-leg-curl-m-e-kneecap.r\"/><use href=\"#standing-leg-curl-m-e-shank.r\"/><use href=\"#standing-leg-curl-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-m-e-head\"/><use href=\"#standing-leg-curl-m-e-torso\"/><use href=\"#standing-leg-curl-m-e-thigh.r\"/><use href=\"#standing-leg-curl-m-e-kneecap.r\"/><use href=\"#standing-leg-curl-m-e-shank.r\"/><use href=\"#standing-leg-curl-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-m-e-shcap.r\"/><use href=\"#standing-leg-curl-m-e-upper.r\"/><use href=\"#standing-leg-curl-m-e-elbowcap.r\"/><use href=\"#standing-leg-curl-m-e-fore.r\"/><use href=\"#standing-leg-curl-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-m-e-shcap.r\"/><use href=\"#standing-leg-curl-m-e-upper.r\"/><use href=\"#standing-leg-curl-m-e-elbowcap.r\"/><use href=\"#standing-leg-curl-m-e-fore.r\"/><use href=\"#standing-leg-curl-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^37\"/><path class=\"eq-pin\" d=\"^38\"/><path class=\"eq-line m-line\" d=\"^39\"/><circle class=\"joint\" cx=\"173.9\" cy=\"134.76\" r=\"2.25\"/><circle class=\"joint\" cx=\"184.25\" cy=\"163.22\" r=\"2.25\"/><circle class=\"joint\" cx=\"161.89\" cy=\"202.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"161.89\" cy=\"265.55\" r=\"2.25\"/></g><mask id=\"standing-leg-curl-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#standing-leg-curl-m-m-head\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-torso\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-shank.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-foot.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-upper.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-fore.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-fist.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-shank.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-foot.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-upper.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-fore.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mf-fist.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#standing-leg-curl-m-mmask)\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-m-m-head\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~#80P)twBs.(tIUoND1xfOO2K-1*tDF10201010020001011\"/><path class=\"m-arrow\" d=\"~MN(pDXy1LPX20M)oYiLwpXiL)R10\"/><path class=\"leader m\" d=\"M159.87 177.79L159.77 112H149.77\"/></g>\n<g class=\"plate-zoom\" data-view=\"mistake\" data-k=\"3\" data-c=\"254 122\" data-src=\"157.85 178.1\"><defs><clipPath id=\"standing-leg-curl-m-zclip\"><circle cx=\"254\" cy=\"122\" r=\"52\"/></clipPath></defs><circle class=\"pz-src\" cx=\"157.85\" cy=\"178.1\" r=\"17.33\"/><path class=\"pz-link\" d=\"~MAYx1Syx1LWy7EA4\"/><circle class=\"pz-bg\" cx=\"254\" cy=\"122\" r=\"52\"/><g class=\"pz-in\" clip-path=\"url(#standing-leg-curl-m-zclip)\">\n  <defs><pattern id=\"standing-leg-curl-m-z-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"standing-leg-curl-m-z-st-shank.r\" d=\"~#F12_UO1PWH2KJP1GHD2S8-y1Y3a)1P*5wk)lD9)aH6BG6Np-D1A3Xz1GiVH1YsBE6E7KcXfzp)u(_5V39K2Xz1GG1Sv)K1HD2X5!w2Dx1FK200000020001000002002001010000010000001000000002100000001011000010020010110000000\"/><path id=\"standing-leg-curl-m-z-st-foot.r\" d=\"~#o2AyN1JRJ3.WO1IRG3HD1U9!U1)nYJ2xF2_J8R9ID7IeET3xo*E22.!3JeRx1ID1JW2Vx1Bz2!J2000210000001100000020000000002000010000101020000\"/><path id=\"standing-leg-curl-m-z-e-thigh.l\" d=\"~#F12y-J1UHD1XKJ1O*x1O5Gz1X32NaA!5(hOnF8-bU7I)4wB1)A21T!1*A1)A2T7I)4E8-b*hOnKaA!5Y32P5Gz1T*2Iz1Xx2S_31!I3_x2S_300011100000000000000000210001010000000200200001010000000002101000021011000111100\"/><path id=\"standing-leg-curl-m-z-e-kneecap.l\" d=\"~~y-O1UyI2JD42\"/><path id=\"standing-leg-curl-m-z-e-shank.l\" d=\"^50\"/><path id=\"standing-leg-curl-m-z-e-foot.l\" d=\"^51\"/><path id=\"standing-leg-curl-m-z-e-shcap.l\" d=\"M279.12 -7.96a23.04 23.04 0 1 0 46.08 0a23.04 23.04 0 1 0 -46.08 0Z\"/><path id=\"standing-leg-curl-m-z-e-upper.l\" d=\"M280.51 -0.08C280.78 4.88 282.83 7.29 283.81 10.32C284.79 13.35 285.51 15.5 286.39 18.08C287.27 20.67 287.19 21.02 289.1 25.8C291.02 30.58 294.81 40.16 297.86 46.79C300.92 53.41 304.18 59.48 307.43 65.55C310.67 71.62 314 78.59 317.34 83.22C320.67 87.85 323.82 91.64 327.43 93.32C331.04 95 335.59 94.56 338.99 93.32C342.39 92.09 346.16 89.51 347.85 85.9C349.53 82.29 349.51 77.36 349.1 71.67C348.68 65.98 346.76 58.5 345.34 51.76C343.93 45.02 342.54 38.28 340.62 31.24C338.71 24.2 335.46 14.42 333.86 9.53C332.25 4.63 331.96 4.41 330.98 1.87C330 -0.67 329.16 -2.79 327.97 -5.74C326.77 -8.69 326.8 -11.85 323.82 -15.83C320.83 -19.81 314.97 -27.31 310.05 -29.61C305.13 -31.9 298.93 -31.3 294.29 -29.61C289.65 -27.92 284.51 -24.4 282.21 -19.48C279.92 -14.56 280.24 -5.05 280.51 -0.08Z\"/><path id=\"standing-leg-curl-m-z-e-elbowcap.l\" d=\"~~w-*1wAfUG31\"/><path id=\"standing-leg-curl-m-z-e-fore.l\" d=\"~#F12wO(1AJhVR*1I!fG9TiA4F1()1A_1)3.kmV6Et*z1K9OH1)lKpTF1TfEvEy1V69xk)6yP1_E2mF4zh)bBH1E2Peyx2Yx1DE1F(1!n00020000010000000000000000000002000000012000000200111111100010101000000022000000\"/><path id=\"standing-leg-curl-m-z-e-fist.l\" d=\"~~JWH2HYtww30\"/><path id=\"standing-leg-curl-m-z-e-head\" d=\"M328.84 -159.23C335.56 -157.52 346.22 -154.6 352.24 -150.42C358.26 -146.24 362.37 -140.06 364.97 -134.14C367.56 -128.22 367.7 -120.92 367.82 -114.92C367.93 -108.92 366.68 -104.07 365.64 -98.15C364.59 -92.22 363.18 -84.93 361.55 -79.37C359.92 -73.81 358.23 -68.65 355.86 -64.78C353.48 -60.91 351.24 -57.01 347.31 -56.15C343.39 -55.28 336.76 -57.49 332.32 -59.57C327.88 -61.65 324.54 -64.84 320.66 -68.64C316.78 -72.45 314.43 -77.54 309.05 -82.39C303.67 -87.24 293.34 -92.05 288.36 -97.74C283.38 -103.42 280.39 -110.06 279.19 -116.51C277.99 -122.96 278.9 -130.34 281.15 -136.44C283.39 -142.54 287.54 -149.09 292.67 -153.13C297.8 -157.16 305.9 -159.63 311.93 -160.65C317.96 -161.67 322.12 -160.93 328.84 -159.23Z\"/><path id=\"standing-leg-curl-m-z-e-torso\" d=\"M293.48 -91.37C285.27 -89.05 288.54 -76.65 285.07 -70.24C281.6 -63.83 277.05 -58.66 272.66 -52.93C268.27 -47.21 262.87 -43.09 258.74 -35.89C254.61 -28.69 250.84 -19.09 247.89 -9.73C244.94 -0.37 242.53 8.82 241.04 20.26C239.54 31.69 239.11 45.92 238.91 58.88C238.7 71.84 239.68 86.96 239.8 98.03C239.93 109.1 241.37 117.15 239.67 125.3C237.98 133.45 234.05 139.52 229.62 146.92C225.2 154.33 217.29 162.3 213.12 169.75C208.95 177.2 205.7 184.56 204.58 191.64C203.46 198.72 203.81 206.32 206.41 212.24C209 218.16 213.94 223.32 220.16 227.14C226.37 230.97 235.34 233.2 243.69 235.19C252.05 237.18 261.84 239.17 270.3 239.1C278.76 239.03 288.06 239.37 294.46 234.78C300.86 230.19 304.45 221.6 308.69 211.56C312.93 201.52 316.67 186.97 319.9 174.54C323.13 162.11 326.11 149.64 328.08 136.99C330.05 124.34 329.72 109.98 331.72 98.64C333.72 87.29 337.15 78.15 340.08 68.92C343.01 59.69 347.12 52.61 349.29 43.25C351.46 33.88 353.21 22.49 353.11 12.72C353.01 2.96 350.96 -7.54 348.7 -15.35C346.44 -23.16 342.17 -28.46 339.53 -34.12C336.89 -39.79 333.92 -43.56 332.86 -49.34C331.8 -55.11 332.92 -62.97 333.17 -68.78C333.41 -74.59 340.93 -80.41 334.32 -84.17C327.71 -87.94 301.68 -93.7 293.48 -91.37Z\"/><path id=\"standing-leg-curl-m-z-e-thigh.r\" d=\"^52\"/><path id=\"standing-leg-curl-m-z-e-kneecap.r\" d=\"^53\"/><path id=\"standing-leg-curl-m-z-e-shank.r\" d=\"~#F12yOV1!)D2GP-1)_F2JvHhG1P3OW5.S1yg!oH8_bUw6A_1(uUy1Yx1Hc!K1V6y-5HO2_dV3NsX8TJ5IN2H1O3Az1(6-jxP1)X1V(1B*1EmBT2wc01100010120020000100000000000200001101000212100020011000000100000000000220012001\"/><path id=\"standing-leg-curl-m-z-e-foot.r\" d=\"~#o2DDlWW!1EVnRy)1BjUy1P9F-1UR1Y!2E!1DD8SG2-_6(U1zG3WiOB2JiG!3YK1OmAaD!2-Y1-U2010000000000012002000010100002110110000020010120\"/><path id=\"standing-leg-curl-m-z-e-shcap.r\" d=\"^54\"/><path id=\"standing-leg-curl-m-z-e-upper.r\" d=\"^55\"/><path id=\"standing-leg-curl-m-z-e-elbowcap.r\" d=\"^56\"/><path id=\"standing-leg-curl-m-z-e-fore.r\" d=\"^57\"/><path id=\"standing-leg-curl-m-z-e-fist.r\" d=\"^58\"/><path id=\"standing-leg-curl-m-z-m-head\" d=\"^59\"/><path id=\"standing-leg-curl-m-z-mf-torso\" d=\"M293.48 -91.37C285.27 -89.05 288.54 -76.65 285.07 -70.24C281.6 -63.83 277.05 -58.66 272.66 -52.93C268.27 -47.21 262.87 -43.09 258.74 -35.89C254.61 -28.69 250.84 -19.09 247.89 -9.73C244.94 -0.37 242.53 8.82 241.04 20.26C239.54 31.69 237.7 46.14 238.91 58.88C240.11 71.61 246.01 86.16 248.26 96.69C250.51 107.21 253.68 114.73 252.42 122.01C251.16 129.3 246.12 134.19 240.68 140.41C235.24 146.62 225.42 152.88 219.79 159.3C214.16 165.72 209.45 172.25 206.89 178.94C204.32 185.63 203.08 193.14 204.39 199.47C205.7 205.8 209.46 211.87 214.74 216.9C220.02 221.94 228.33 225.98 236.09 229.67C243.85 233.36 253.01 237.34 261.3 239.03C269.59 240.72 278.62 242.99 285.83 239.83C293.04 236.67 298.34 229.01 304.58 220.07C310.81 211.13 317.9 198.2 323.24 186.19C328.58 174.18 334.67 162.17 336.62 148.02C338.56 133.87 334.32 114.48 334.9 101.3C335.48 88.11 337.68 78.59 340.08 68.92C342.48 59.24 347.12 52.61 349.29 43.25C351.46 33.88 353.21 22.49 353.11 12.72C353.01 2.96 350.96 -7.54 348.7 -15.35C346.44 -23.16 342.17 -28.46 339.53 -34.12C336.89 -39.79 333.92 -43.56 332.86 -49.34C331.8 -55.11 332.92 -62.97 333.17 -68.78C333.41 -74.59 340.93 -80.41 334.32 -84.17C327.71 -87.94 301.68 -93.7 293.48 -91.37Z\"/><path id=\"standing-leg-curl-m-z-mf-thigh.l\" d=\"^52\"/><path id=\"standing-leg-curl-m-z-mf-kneecap.l\" d=\"^53\"/><path id=\"standing-leg-curl-m-z-mf-shank.l\" d=\"^50\"/><path id=\"standing-leg-curl-m-z-mf-foot.l\" d=\"^51\"/><path id=\"standing-leg-curl-m-z-mf-shcap.l\" d=\"^54\"/><path id=\"standing-leg-curl-m-z-mf-upper.l\" d=\"^55\"/><path id=\"standing-leg-curl-m-z-mf-elbowcap.l\" d=\"^56\"/><path id=\"standing-leg-curl-m-z-mf-fore.l\" d=\"^57\"/><path id=\"standing-leg-curl-m-z-mf-fist.l\" d=\"^58\"/><path id=\"standing-leg-curl-m-z-mf-thigh.r\" d=\"^52\"/><path id=\"standing-leg-curl-m-z-mf-kneecap.r\" d=\"^53\"/><path id=\"standing-leg-curl-m-z-mf-shank.r\" d=\"^61\"/><path id=\"standing-leg-curl-m-z-mf-foot.r\" d=\"^62\"/><path id=\"standing-leg-curl-m-z-mf-shcap.r\" d=\"^54\"/><path id=\"standing-leg-curl-m-z-mf-upper.r\" d=\"^55\"/><path id=\"standing-leg-curl-m-z-mf-elbowcap.r\" d=\"^56\"/><path id=\"standing-leg-curl-m-z-mf-fore.r\" d=\"^57\"/><path id=\"standing-leg-curl-m-z-mf-fist.r\" d=\"^58\"/><path id=\"standing-leg-curl-m-z-mo-0\" d=\"^59\"/><path id=\"standing-leg-curl-m-z-mo-1\" d=\"^60\"/><path id=\"standing-leg-curl-m-z-mo-2\" d=\"^52\"/><path id=\"standing-leg-curl-m-z-mo-3\" d=\"^53\"/><path id=\"standing-leg-curl-m-z-mo-4\" d=\"^50\"/><path id=\"standing-leg-curl-m-z-mo-5\" d=\"^51\"/><path id=\"standing-leg-curl-m-z-mo-6\" d=\"^54\"/><path id=\"standing-leg-curl-m-z-mo-7\" d=\"^55\"/><path id=\"standing-leg-curl-m-z-mo-8\" d=\"^56\"/><path id=\"standing-leg-curl-m-z-mo-9\" d=\"^57\"/><path id=\"standing-leg-curl-m-z-mo-10\" d=\"^58\"/><path id=\"standing-leg-curl-m-z-mo-11\" d=\"^52\"/><path id=\"standing-leg-curl-m-z-mo-12\" d=\"^53\"/><path id=\"standing-leg-curl-m-z-mo-13\" d=\"^61\"/><path id=\"standing-leg-curl-m-z-mo-14\" d=\"^62\"/><path id=\"standing-leg-curl-m-z-mo-15\" d=\"^54\"/><path id=\"standing-leg-curl-m-z-mo-16\" d=\"^55\"/><path id=\"standing-leg-curl-m-z-mo-17\" d=\"^56\"/><path id=\"standing-leg-curl-m-z-mo-18\" d=\"^57\"/><path id=\"standing-leg-curl-m-z-mo-19\" d=\"^58\"/><path id=\"standing-leg-curl-m-z-mo-20\" d=\"~MWGU1FEG2LXNpKHhQVkxewJoyRhLA1YH1QxeUkFF1VeLAFpYEgQWkye)IoxRhLB1VH1QyeVkzF1SeZ\"/><path id=\"standing-leg-curl-m-z-mo-21\" d=\"~~PPkA!Y1!W40\"/><path id=\"standing-leg-curl-m-z-mo-22\" d=\"~~AxpA!Y1F60\"/><path id=\"standing-leg-curl-m-z-mo-23\" d=\"~~DKR1UyI2HS21\"/><path id=\"standing-leg-curl-m-z-mo-24\" d=\"~~F-T1UyI2F60\"/><path id=\"standing-leg-curl-m-z-mo-25\" d=\"~MyU!1yBz2LBN9WJ6QB5P3PJ9)z6LFY1YE2QP3D5.K1XN2LPB9IN6QA5O3RJ9wA6LzY1XE2QO3B5_K1YN2Z\"/><path id=\"standing-leg-curl-m-z-mo-26\" d=\"~~Ax-1(NA2!W40\"/><path id=\"standing-leg-curl-m-z-mo-27\" d=\"~~YR*1(NA2F60\"/><path id=\"standing-leg-curl-m-z-mo-28\" d=\"~MYRW1yUP3L0zDy1Q0)o)oAKx1LR-2wpQ)o0S-2wpLwpAKx1Q0wpwpzKx1LS-2)oQwp0R-2)oZ\"/><path id=\"standing-leg-curl-m-z-mo-29\" d=\"~MYIK2WXB1L_O1ONaQP3XoxB2DS9LVaYnQXoO3U3_pLKjF-9QR3Yo(A2ES9L_aVnQYoS3X3XpZ\"/><path id=\"standing-leg-curl-m-z-mo-30\" d=\"~MyJB1DWV3LN_G20Qwp0KxG2)oL)oz(1Q0)o)oA(1LKxG2wpQ)o0NxG2wpLwpA(1Q0wpwpz(1Z\"/><path id=\"standing-leg-curl-m-z-mo-31\" d=\"~MyU)1A*)1LyOd.xoQFc-lTYd_)mLRH1(4Q-lEcAiWD1LxKcHYnQEc_lUYd.)mLSH1-4Q_lFcziXD1Z\"/><path id=\"standing-leg-curl-m-z-mo-32\" d=\"~MFKK3yUP3L0KPV2Q0)o)oNXU2LXy1wpQ)o0Yy1wpLwpNXU2Q0wpwpKXU2LYy1)oQwp0Xy1)oZ\"/><path id=\"standing-leg-curl-m-z-mo-33\" d=\"~MJ*H3DOsL)Ks0Q)o0wVrwpLwpH7Q0wpwpG7LwVr)oQwp0)Ur)oL)oG7Q0)o)oH7Z\"/><path id=\"standing-leg-curl-m-z-mo-34\" d=\"~MJ*H3_Bz2LIJJ10Q)o0JTI1wpLwpH7Q0wpwpG7LJTI1)oQwp0ITI1)oL)oG7Q0)o)oH7Z\"/></defs>\n  \n  <path class=\"floorline\" d=\"M165.43 603.09H595.31\"/><path class=\"eq\" d=\"^72\"/><path class=\"eq\" d=\"^73\"/><path class=\"eq\" d=\"^74\"/><path class=\"eq\" d=\"^75\"/><path class=\"eq\" d=\"^76\"/><path class=\"eq\" d=\"^77\"/><path class=\"eq\" d=\"^78\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-m-z-st-shank.r\"/><use href=\"#standing-leg-curl-m-z-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-m-z-st-shank.r\"/><use href=\"#standing-leg-curl-m-z-st-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^64\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-m-z-e-thigh.l\"/><use href=\"#standing-leg-curl-m-z-e-kneecap.l\"/><use href=\"#standing-leg-curl-m-z-e-shank.l\"/><use href=\"#standing-leg-curl-m-z-e-foot.l\"/><use href=\"#standing-leg-curl-m-z-e-shcap.l\"/><use href=\"#standing-leg-curl-m-z-e-upper.l\"/><use href=\"#standing-leg-curl-m-z-e-elbowcap.l\"/><use href=\"#standing-leg-curl-m-z-e-fore.l\"/><use href=\"#standing-leg-curl-m-z-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-m-z-e-thigh.l\"/><use href=\"#standing-leg-curl-m-z-e-kneecap.l\"/><use href=\"#standing-leg-curl-m-z-e-shank.l\"/><use href=\"#standing-leg-curl-m-z-e-foot.l\"/><use href=\"#standing-leg-curl-m-z-e-shcap.l\"/><use href=\"#standing-leg-curl-m-z-e-upper.l\"/><use href=\"#standing-leg-curl-m-z-e-elbowcap.l\"/><use href=\"#standing-leg-curl-m-z-e-fore.l\"/><use href=\"#standing-leg-curl-m-z-e-fist.l\"/></g></g><path class=\"eq\" d=\"^65\"/><path class=\"eq-pin\" d=\"^66\"/><path class=\"eq\" d=\"^69\"/><path class=\"eq\" d=\"^70\"/><path class=\"eq-pin\" d=\"^71\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-m-z-e-head\"/><use href=\"#standing-leg-curl-m-z-e-torso\"/><use href=\"#standing-leg-curl-m-z-e-thigh.r\"/><use href=\"#standing-leg-curl-m-z-e-kneecap.r\"/><use href=\"#standing-leg-curl-m-z-e-shank.r\"/><use href=\"#standing-leg-curl-m-z-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-m-z-e-head\"/><use href=\"#standing-leg-curl-m-z-e-torso\"/><use href=\"#standing-leg-curl-m-z-e-thigh.r\"/><use href=\"#standing-leg-curl-m-z-e-kneecap.r\"/><use href=\"#standing-leg-curl-m-z-e-shank.r\"/><use href=\"#standing-leg-curl-m-z-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-m-z-e-shcap.r\"/><use href=\"#standing-leg-curl-m-z-e-upper.r\"/><use href=\"#standing-leg-curl-m-z-e-elbowcap.r\"/><use href=\"#standing-leg-curl-m-z-e-fore.r\"/><use href=\"#standing-leg-curl-m-z-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#standing-leg-curl-m-z-e-shcap.r\"/><use href=\"#standing-leg-curl-m-z-e-upper.r\"/><use href=\"#standing-leg-curl-m-z-e-elbowcap.r\"/><use href=\"#standing-leg-curl-m-z-e-fore.r\"/><use href=\"#standing-leg-curl-m-z-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^67\"/><path class=\"eq-pin\" d=\"^68\"/><path class=\"eq-line m-line\" d=\"~MDxN1JUG3LKbX-1LGl_8LBgFgLX8DlL1wnL_8DlLDgFgLHl_8L!m1LHlX8LDgBgL_8GlL1.mLX8GlLBgBgLGlX8\"/><circle class=\"joint\" cx=\"302.16\" cy=\"-7.96\" r=\"2.25\"/><circle class=\"joint\" cx=\"333.22\" cy=\"77.44\" r=\"2.25\"/><circle class=\"joint\" cx=\"266.16\" cy=\"196.26\" r=\"2.25\"/><circle class=\"joint\" cx=\"266.16\" cy=\"384.42\" r=\"2.25\"/></g><mask id=\"standing-leg-curl-m-z-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#standing-leg-curl-m-z-m-head\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-torso\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-thigh.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-kneecap.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-shank.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-foot.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-shcap.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-upper.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-fore.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-fist.l\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-thigh.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-kneecap.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-shank.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-foot.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-shcap.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-upper.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-fore.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mf-fist.r\" fill=\"#000\"/><use href=\"#standing-leg-curl-m-z-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#standing-leg-curl-m-z-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#standing-leg-curl-m-z-mmask)\"><g class=\"u-stroke\"><use href=\"#standing-leg-curl-m-z-m-head\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~#80PyO1U(3TwO1AT6JT3*J1TN7KJ5--2NY30020000001010000\"/><path class=\"m-arrow\" d=\"~M!PK1DVnLPX20M)oYiLwpXiL)R10\"/></g>\n</g><circle class=\"pz-ring\" cx=\"254\" cy=\"122\" r=\"52\"/></g></svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"standing-leg-curl-m-arch\" data-key=\"arch\" data-cue=\"Your lower back arches as your leg curls.\" class=\"plate-callout two m\" style=\"left:21.79%;top:25.14%\" aria-pressed=\"true\">Low back<br>arches</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "knee",
        cues: [{ key: "knee", cue: "Keep your knee steady as it bends and straightens." }, { key: "still", cue: "Thighs on the pad, upper body still." }, { key: "foot", cue: "Curl until your foot is higher than your knee." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "arch",
        cues: [{ key: "arch", cue: "Your lower back arches as your leg curls." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Low back arches</b><span>Your lower back arches as your leg curls.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: curl 1 second, hold 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Curl</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Standing leg curl, side view. Leaning on the machine with the thighs on the support pad, the hands on the handles and the left foot planted, the lifter curls the right heel toward the glutes until the foot is above the knee.",
      mistakeAlt: "Standing Leg Curl: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP (b): the card gives no thumb, contact or wrist claim; its grip type and width (c2) are setup step 2."
  },
  contacts: [
    "pivot-pad"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set the pad just above the heel of your working leg.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-stlc",
          "hevy-stlc"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "grip",
      "text": "Thighs against the support pad. Hold the handles for balance.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hevy-stlc",
          "sl-stlc"
        ],
        "note": "card c2"
      }
    },
    {
      "kind": "position",
      "text": "Plant your other foot firmly. Keep your upper body still.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hevy-stlc",
          "sl-stlc"
        ],
        "note": "card c3"
      }
    },
    {
      "kind": "position",
      "text": "Curl until your foot is higher than your knee. Hold a second.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hevy-stlc",
          "sl-stlc"
        ],
        "note": "card c4, c16"
      }
    },
    {
      "kind": "finish",
      "text": "Don't drop it: lower slowly, straighten fully. Finish one leg, then switch.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hevy-stlc",
          "sl-stlc"
        ],
        "note": "card c7, c5, c4, c11"
      }
    }
  ],
  posture: [
    {
      "key": "pad",
      "label": "Pad above heel",
      "detail": "Pad just above the heel.",
      "anchor": {
        "pose": "start",
        "at": "heel.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-stlc",
          "hevy-stlc"
        ],
        "note": "card c1"
      }
    },
    {
      "key": "still",
      "label": "Upper body still",
      "detail": "Thighs on the pad, upper body still.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hevy-stlc",
          "sl-stlc"
        ],
        "note": "card c3, c2"
      }
    },
    {
      "key": "knee",
      "label": "Knee steady",
      "detail": "Keep your knee steady as you curl and lower.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "knee-steady",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hevy-stlc"
        ],
        "note": "card c6"
      }
    },
    {
      "key": "top",
      "label": "Full range",
      "detail": "Curl until your ankle is higher than your knee, then straighten fully.",
      "anchor": {
        "pose": "end",
        "at": "heel.r"
      },
      "zoom": "top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hevy-stlc"
        ],
        "note": "card c4, c8"
      }
    },
    {
      "key": "drop",
      "label": "Dropping the weight",
      "detail": "Lower it slowly, with control.",
      "anchor": {
        "pose": "start",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hevy-stlc",
          "sl-stlc"
        ],
        "note": "card c7, c5"
      }
    },
    {
      "key": "arch",
      "label": "Low back",
      "detail": "Contract your abs.",
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
          "hl-hc"
        ],
        "note": "card c13"
      }
    },
    {
      "key": "swing",
      "label": "No swinging",
      "detail": "Control the weight. Don't swing your leg.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hevy-stlc",
          "sl-stlc"
        ],
        "note": "card c9"
      }
    }
  ],
  zooms: [
    {
      "key": "knee-steady",
      "chip": "Knee",
      "heading": "Knee steady",
      "kind": "posture"
    },
    {
      "key": "top",
      "chip": "Range",
      "heading": "Full curl",
      "kind": "posture"
    }
  ],
  chips: [
    "knee-steady",
    "top",
    "feel"
  ],
  copy: {
    "setupLine": "Start with a lighter weight. Pad just above your heel.",
    "mistakeLine": "Don't drop the weight. Lower it slowly, with control.",
    "cueLine": "Control the weight, no swinging."
  },
  mistakes: [],
  risks: [
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
        "note": "card c13"
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
        "note": "card c14"
      }
    },
    {
      "key": "load",
      "text": "Too much weight makes you use momentum and body swinging.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hevy-stlc",
          "sl-stlc"
        ],
        "note": "card c9"
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
    "hevy-stlc",
    "sl-stlc",
    "hl-hc",
    "nhs-knee-pain",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/standing_leg_curl.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=9123a3426f162d84fe47a0daf99ddb8b2b3622b83e824e27e21ed4701a39e37b
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_barbell_overhead_press",
  name: "Barbell Overhead Press",
  hashes: { inputsSha256: "9123a3426f162d84fe47a0daf99ddb8b2b3622b83e824e27e21ed4701a39e37b", golden: "91059048585de459a44aeb8f67486e579f1d987a49de023726e523da6f4d3396" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"barbell-overhead-press-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"barbell-overhead-press-n-st-head\" d=\"~#w12U(tySkxOsEYkIbHmxe_dXaeI1y5O6T5BaO7-lTekRcz4*7-gP5JgEg_h*bAjx3HlP8y4Fh0000001010120001010000101010002000000010101001000000000000000101\"/><path id=\"barbell-overhead-press-n-st-torso\" d=\"~#_12!)tWApz.tI-nEcE8G8!2SbDgP9U4Yd!c_5p.8)kOlK4)aw6weK6yiK8NiOhWdEiD3I9G9RdGtRsVdIn-5qX8F1Wd(c(3!6VcT5OdH9E3YjU4x1F4I9y7AcT)1WT100200000000000001000010000020000100020200010122000121000000000000010100010001200100000100220000000200002201010200000\"/><path id=\"barbell-overhead-press-n-st-shcap.r\" d=\"~~!wvFStDJ11\"/><path id=\"barbell-overhead-press-n-st-upper.r\" d=\"~#F12WBvHDuI_uGNtV2x6a5wiSuiG56R2z6TneOj.6RdzgxbOf.iE2G1R4T2AePw174I3X5TgahUqN9Ni!lDf01000001000010110101000000022001010210000000020200000000000100100010100000001101\"/><path id=\"barbell-overhead-press-n-st-elbowcap.r\" d=\"~~ARy1wXz1Jw10\"/><path id=\"barbell-overhead-press-n-st-fore.r\" d=\"~#F12HTA1PUz1ESA1xIA1tF8rI1X5Ky1V2W7G1w2H1AoG5FcoFaA7FbF2DoU1W1_3F7k*y1iR1A2A8U9Y2H8TiB1.f)aBh01000110002000000000001011200000110010000001010002010110100210000020020100000001\"/><path id=\"barbell-overhead-press-n-st-fist.r\" d=\"~~Hxy1A*rNt0\"/><path id=\"barbell-overhead-press-n-g0-shcap.r\" d=\"^2\"/><path id=\"barbell-overhead-press-n-g0-upper.r\" d=\"~#F12POw1H(uORvz)uR7105YE1O4z5T2T2B1GuR3XhG8xfuXgAaXty7K2N1-4D3yF1118K7s)2AfDoDbUkx1Wm)d20011102000100010010000101002020000011000000000101200011100002200001000002100100\"/><path id=\"barbell-overhead-press-n-g0-elbowcap.r\" d=\"~~!BE1AAtJw10\"/><path id=\"barbell-overhead-press-n-g0-fore.r\" d=\"~#F12(wG1HOsXKG1EAtF4w8R1rXp-rN2J80P2_gFmF2AdJ6D8DcJ5JhYlP2kP7P4Vk.vdX1Y6A6F8O4I3BkX9OcXiE800000100000020010001100000002000200000001020011002010000010012021000000010001020\"/><path id=\"barbell-overhead-press-n-g0-fist.r\" d=\"~~Hxy1(JmNt0\"/><path id=\"barbell-overhead-press-n-g1-shcap.r\" d=\"~~YGw1FOtDJ11\"/><path id=\"barbell-overhead-press-n-g1-upper.r\" d=\"~#F12!Ny1WTuKUx1-AvV6A477Nx1Rp)5k*2axuHeOjA2KcS8)8JhzownK1S2T2J5_z1*l68G6_4S6SdPq.2whVbFcVn00000000100020020000000000000001010001001011110000000002000010000000000010000120\"/><path id=\"barbell-overhead-press-n-g1-elbowcap.r\" d=\"~~YKE1Y_oJw10\"/><path id=\"barbell-overhead-press-n-g1-fore.r\" d=\"~#F12UFG1WBozWG1B.oN4F8R1r-qTsU2S86S2(hHnJ2ydJ6A8HcH5SiWmN2o_7S4-lVw1fV1w7F6W7E5R3Bk.9Ic-ix800001200002000000101010000010100100200010100000020000000202000000021010000101200\"/><path id=\"barbell-overhead-press-n-g1-fist.r\" d=\"~~Hxy1(*hNt0\"/><path id=\"barbell-overhead-press-n-e-thigh.l\" d=\"~#F12FYw1SYG1.Xw1zKF1t*aB13t!-1y6.6W2I3(5TP1YcEkN1Ri-9*lD1.P1G2-3.4R7K7H-1D12P2Ta*r*cXmwA1K2yx1Jh!D120111100000220200110000000010020000010101010100022101000002000001121001010110000\"/><path id=\"barbell-overhead-press-n-e-kneecap.l\" d=\"~~P.w1JBV1DG12\"/><path id=\"barbell-overhead-press-n-e-shank.l\" d=\"~#F12F_w1YwV1Gyx1.VT1_2VaA14X1A_1F6T6!2I3D3R*1w8-bF1*aK5zdya*!1z2.3V4X7Tay-1B11d)a*cJ9ReHlx2!jU9!n00001000001002000100100000010000201002000020000000210100000000100100000002000022\"/><path id=\"barbell-overhead-press-n-e-foot.l\" d=\"~#o2Pzw1(J)1VTw1OO(1Yb(2DgG7UnzmJS2*2TD2K4Iz1G7xm1ED1P4Ga-bPqGaTkPn100200100220011000000000000000000011110111100112\"/><path id=\"barbell-overhead-press-n-e-shcap.l\" d=\"~~SSx1FPtDJ11\"/><path id=\"barbell-overhead-press-n-e-upper.l\" d=\"~#F12!HA1wRtKGA1-RuhD890K1XI1)2J5K1W2-5Hz1R9yh7Df(8JhY4Nz1F1Y2_2S5(2XI180cD8_eF1wdEncTkEcXn20000000000000000111100000000000020000200000101010000001002100101202000220010000\"/><path id=\"barbell-overhead-press-n-e-elbowcap.l\" d=\"~~(yy1W(kJw10\"/><path id=\"barbell-overhead-press-n-e-fore.l\" d=\"~#F12DBA1D(k.yA1)XlI1N9nV1-3.E1B3U8I1D20Jux6_b4HaP6UbuJuP1A2J3S8S2xF1mV1Y1N9H90J9Bi7-f*9.h01210100020002000002000200012001000000220000021200100000000000001000100000000011\"/><path id=\"barbell-overhead-press-n-e-fist.l\" d=\"~~Hxy1_(bNt0\"/><path id=\"barbell-overhead-press-n-e-head\" d=\"~#w12D!z1wPk-Ny1Vwk.jwfXiH6-9G4O3(3I3*7.5BbzdVmw6xb5*8RhK2!lG7Fl)2PiS5Nfyh.3Fh1000000000020000010100100020010000000000100000000111010000010000\"/><path id=\"barbell-overhead-press-n-e-torso\" d=\"~#_12w*x1JUoVIy1IInT7I2_1jW8(e!8(5_bYe_50.5zmRkG7-bJ4YeK4Aj-5SkXeFgEgJ4X8G7XexpKw1Ga*o.51-82YbWew3H7-bG7XeJ7.5Ajy6wb(gVaY1P2.O2Pi00100200000101200220020210000100200100210002000000010002000000010010020121002000010121001002000000000100000001000100\"/><path id=\"barbell-overhead-press-n-e-thigh.r\" d=\"^16\"/><path id=\"barbell-overhead-press-n-e-kneecap.r\" d=\"^17\"/><path id=\"barbell-overhead-press-n-e-shank.r\" d=\"^18\"/><path id=\"barbell-overhead-press-n-e-foot.r\" d=\"^19\"/><path id=\"barbell-overhead-press-n-e-shcap.r\" d=\"^20\"/><path id=\"barbell-overhead-press-n-e-upper.r\" d=\"^21\"/><path id=\"barbell-overhead-press-n-e-elbowcap.r\" d=\"^22\"/><path id=\"barbell-overhead-press-n-e-fore.r\" d=\"^23\"/><path id=\"barbell-overhead-press-n-e-fist.r\" d=\"^24\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#barbell-overhead-press-n-dots)\"/>\n  <path class=\"datum\" d=\"~MY(y1FBA2L0EFw2\"/><path class=\"floorline\" d=\"M78.06 339.5H279.94\"/><path class=\"eq\" d=\"~MA_mPwy2L0EW(1Q0E6E6wP(1LBK1F6QE60DK1F6LF6wP(1Q0F6F6)O(1LDK1E6QF60BK1E6Z\"/><path class=\"eq-thin\" d=\"M111.11 298.63h1.2M111.11 291.9h1.2M111.11 285.17h1.2M111.11 278.44h1.2M111.11 271.71h1.2M111.11 264.98h1.2M111.11 258.25h1.2M111.11 251.52h1.2M111.11 244.79h1.2M111.11 238.06h1.2M111.11 231.33h1.2M111.11 224.6h1.2M111.11 217.87h1.2M111.11 211.15h1.2M111.11 204.42h1.2M111.11 197.69h1.2M111.11 190.96h1.2M111.11 184.23h1.2M111.11 177.5h1.2M111.11 170.77h1.2M111.11 164.04h1.2M111.11 157.31h1.2M111.11 150.58h1.2M111.11 143.85h1.2M111.11 137.12h1.2M111.11 130.4h1.2M111.11 123.67h1.2M111.11 116.94h1.2M111.11 110.21h1.2M111.11 103.48h1.2M111.11 96.75h1.2M111.11 90.02h1.2M111.11 83.29h1.2M111.11 76.56h1.2M111.11 69.83h1.2M111.11 63.1h1.2M111.11 56.37h1.2M111.11 49.65h1.2M111.11 42.92h1.2M111.11 36.19h1.2\"/><path class=\"eq\" d=\"~MHzR1Pwy2L0EW(1Q0E6E6wP(1LBK1F6QE60DK1F6LF6wP(1Q0F6F6)O(1LDK1E6QF60BK1E6Z\"/><path class=\"eq-thin\" d=\"M245.69 298.63h1.2M245.69 291.9h1.2M245.69 285.17h1.2M245.69 278.44h1.2M245.69 271.71h1.2M245.69 264.98h1.2M245.69 258.25h1.2M245.69 251.52h1.2M245.69 244.79h1.2M245.69 238.06h1.2M245.69 231.33h1.2M245.69 224.6h1.2M245.69 217.87h1.2M245.69 211.15h1.2M245.69 204.42h1.2M245.69 197.69h1.2M245.69 190.96h1.2M245.69 184.23h1.2M245.69 177.5h1.2M245.69 170.77h1.2M245.69 164.04h1.2M245.69 157.31h1.2M245.69 150.58h1.2M245.69 143.85h1.2M245.69 137.12h1.2M245.69 130.4h1.2M245.69 123.67h1.2M245.69 116.94h1.2M245.69 110.21h1.2M245.69 103.48h1.2M245.69 96.75h1.2M245.69 90.02h1.2M245.69 83.29h1.2M245.69 76.56h1.2M245.69 69.83h1.2M245.69 63.1h1.2M245.69 56.37h1.2M245.69 49.65h1.2M245.69 42.92h1.2M245.69 36.19h1.2\"/><path class=\"eq\" d=\"~MDTlHE5LAXq0Qwp0z(p)oL)oW7Q0)o)oV7Lz(pwpQ)o0A(pwpLwpV7Q0wpwpW7Z\"/><path class=\"eq\" d=\"~My)jP)vLJ)t0Qwp0IDt)oL)o!bQ0)o)o.bLIDtwpQ)o0JDtwpLwp.bQ0wpwp!bZ\"/><path class=\"eq\" d=\"~MJzO1PVsL._10L!_1xH1LUcyH1LTcNtLFN1KtZ\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-overhead-press-n-st-head\"/><use href=\"#barbell-overhead-press-n-st-torso\"/></g><g class=\"u-fill\"><use href=\"#barbell-overhead-press-n-st-head\"/><use href=\"#barbell-overhead-press-n-st-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-overhead-press-n-st-shcap.r\"/><use href=\"#barbell-overhead-press-n-st-upper.r\"/><use href=\"#barbell-overhead-press-n-st-elbowcap.r\"/><use href=\"#barbell-overhead-press-n-st-fore.r\"/><use href=\"#barbell-overhead-press-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-overhead-press-n-st-shcap.r\"/><use href=\"#barbell-overhead-press-n-st-upper.r\"/><use href=\"#barbell-overhead-press-n-st-elbowcap.r\"/><use href=\"#barbell-overhead-press-n-st-fore.r\"/><use href=\"#barbell-overhead-press-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-overhead-press-n-g0-shcap.r\"/><use href=\"#barbell-overhead-press-n-g0-upper.r\"/><use href=\"#barbell-overhead-press-n-g0-elbowcap.r\"/><use href=\"#barbell-overhead-press-n-g0-fore.r\"/><use href=\"#barbell-overhead-press-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-overhead-press-n-g0-shcap.r\"/><use href=\"#barbell-overhead-press-n-g0-upper.r\"/><use href=\"#barbell-overhead-press-n-g0-elbowcap.r\"/><use href=\"#barbell-overhead-press-n-g0-fore.r\"/><use href=\"#barbell-overhead-press-n-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~~YGy1(Jmwl2\"/><path class=\"eq-pin\" d=\"~~PYy1(JmF60\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-overhead-press-n-g1-shcap.r\"/><use href=\"#barbell-overhead-press-n-g1-upper.r\"/><use href=\"#barbell-overhead-press-n-g1-elbowcap.r\"/><use href=\"#barbell-overhead-press-n-g1-fore.r\"/><use href=\"#barbell-overhead-press-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-overhead-press-n-g1-shcap.r\"/><use href=\"#barbell-overhead-press-n-g1-upper.r\"/><use href=\"#barbell-overhead-press-n-g1-elbowcap.r\"/><use href=\"#barbell-overhead-press-n-g1-fore.r\"/><use href=\"#barbell-overhead-press-n-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~~YGy1(*hwl2\"/><path class=\"eq-pin\" d=\"~~PYy1(*hF60\"/></g><g class=\"pose-end\"><path class=\"eq-line\" d=\"~~Pxt_(bF*50\"/><path class=\"eq-thin\" d=\"~~Szu_(bD.40\"/><path class=\"eq-solid\" d=\"~~YGy1_(bwl2\"/><path class=\"eq-pin\" d=\"~~PYy1_(bF60\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#barbell-overhead-press-n-e-thigh.l\"/><use href=\"#barbell-overhead-press-n-e-kneecap.l\"/><use href=\"#barbell-overhead-press-n-e-shank.l\"/><use href=\"#barbell-overhead-press-n-e-foot.l\"/><use href=\"#barbell-overhead-press-n-e-shcap.l\"/><use href=\"#barbell-overhead-press-n-e-upper.l\"/><use href=\"#barbell-overhead-press-n-e-elbowcap.l\"/><use href=\"#barbell-overhead-press-n-e-fore.l\"/><use href=\"#barbell-overhead-press-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#barbell-overhead-press-n-e-thigh.l\"/><use href=\"#barbell-overhead-press-n-e-kneecap.l\"/><use href=\"#barbell-overhead-press-n-e-shank.l\"/><use href=\"#barbell-overhead-press-n-e-foot.l\"/><use href=\"#barbell-overhead-press-n-e-shcap.l\"/><use href=\"#barbell-overhead-press-n-e-upper.l\"/><use href=\"#barbell-overhead-press-n-e-elbowcap.l\"/><use href=\"#barbell-overhead-press-n-e-fore.l\"/><use href=\"#barbell-overhead-press-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-overhead-press-n-e-head\"/><use href=\"#barbell-overhead-press-n-e-torso\"/><use href=\"#barbell-overhead-press-n-e-thigh.r\"/><use href=\"#barbell-overhead-press-n-e-kneecap.r\"/><use href=\"#barbell-overhead-press-n-e-shank.r\"/><use href=\"#barbell-overhead-press-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-overhead-press-n-e-head\"/><use href=\"#barbell-overhead-press-n-e-torso\"/><use href=\"#barbell-overhead-press-n-e-thigh.r\"/><use href=\"#barbell-overhead-press-n-e-kneecap.r\"/><use href=\"#barbell-overhead-press-n-e-shank.r\"/><use href=\"#barbell-overhead-press-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-overhead-press-n-e-shcap.r\"/><use href=\"#barbell-overhead-press-n-e-upper.r\"/><use href=\"#barbell-overhead-press-n-e-elbowcap.r\"/><use href=\"#barbell-overhead-press-n-e-fore.r\"/><use href=\"#barbell-overhead-press-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-overhead-press-n-e-shcap.r\"/><use href=\"#barbell-overhead-press-n-e-upper.r\"/><use href=\"#barbell-overhead-press-n-e-elbowcap.r\"/><use href=\"#barbell-overhead-press-n-e-fore.r\"/><use href=\"#barbell-overhead-press-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^42\"/><path class=\"eq-pin\" d=\"^43\"/><path class=\"eq-solid m-line\" d=\"~MWBvHDuLuW3La9L65L47L23L01L33L30L51L15L03L31L21L11L24L00L15L57L15L04L66L8eLaiLgqLguLeqLckL6cL88L11L05L3dL5bL21L03L01L01L01L20L11L24L28L01L00L07L39L3dL3jL5fL5dL39L1dL09L19L29L07L69L29L0bL09L17L17L53L35L35L07L15L35L57L73L75Lb5L91L71L75L95L57L77L5bL99L9fLbdL7bL77L55L00L00L44L06L21L10L01L30L00L33L10L59L9bL33L11L4aL4cLamLeqLew1LcqL8kL6eL4aL00L11L3bL15L04L00L01L00L11L33L03L05L25L01L33L30L50Lb0L92Lf3Ld7L93L74L14L3eL4eL4oL0kL1gL1eL0eL2aL6aL48L86L4aL28L2cL68L88La8Lc6Lg8LgcLeiLcaLc8L61L63L49Z\"/><path class=\"eq-solid m-line\" d=\"~M(RA1wXz1LO2NcLO4*1LO3O3L.1O4L1)4L(1O4LP3O3LP4*1Lw52LP4!1LP3P3L(1P4L1w5L.1P4LO3P3Z\"/><path class=\"eq-solid m-line\" d=\"~MHTA1PUz1Lix3L70L32L32L12L16L04L46L06L08L14L06L00L00L01L03L16L48L14L21L39L1fL3jL3rL3x1L3tL3lL1dL17L12L18L0iL0eL16L14L04L12L12L21L12L05L15L01L12L08L28L0iL2iL2iL4iL0cL2cL18L18L36L50L34L38L36L16L16L04L26L24L04L16L04L26L04L48L64L46L64L40L66L24L4cL08L2gL1eL0mL2iL2eL0cL26L02L00L27L05L00L02L20L00L26L44L04L4gL4eL2cL01L23L2hL1jL0vL0x1L0rL0jL0hL25L15L26L08L14L21L01L01L02L24L06L46L18L16L24L04L42L42L62L61L86L48L64L60L23L49L69L2fL8dL6bL47L69L07L09L05L55L07L47L07L17L15L59L59L77L9dL3dL5bL57L51L10L54Z\"/><path class=\"eq-solid m-line\" d=\"~MD!z1A*rL3!2L90L91L53L73Lb1L33L77L55L57L55L37L19L35L1bL05L0bL05L2bL45L29L47L65L67L65L87L43Lc1L83L63La1La0L80La0La2L64L82Lc4L46L86L66L66L68L4aL26L4aL28L0aL08L0aL18L3aL16L3aL58L56L56L76L36Lb4L72L54L92Z\"/><path class=\"eq-line m-line\" d=\"~MSRz1wXz1LxeK_5\"/><path class=\"eq-line m-line\" d=\"~MYTz1A*rLR1x8L)2F1LE2F2LE1(2L0F3LF1(2LF2F2Lw3F1LA30Lw3E1LF2E2LF1)2L0z3LE1)2LE2E2L)2E1\"/><circle class=\"joint\" cx=\"179\" cy=\"151.08\" r=\"2.25\"/><circle class=\"joint\" cx=\"179.73\" cy=\"107.31\" r=\"2.25\"/><circle class=\"joint\" cx=\"179\" cy=\"214.67\" r=\"2.25\"/><circle class=\"joint\" cx=\"174.83\" cy=\"272.22\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#A20Y(y1yPpX(y1z.p02000000010200000y20000000000000000000000000000000)200000001020000000100020000000000000100000200020000000000000000000000000000000000000000000000000000000000000000000000000000010001000100000200020002000000\"/><path class=\"arrow\" d=\"~MY(y1(JdLYiPB1LEY1OB1Z\"/><path data-guide=\"head\" style=\"display:none\" class=\"lead-guide\" d=\"~MPXuHWnLyO4G1\"/></g><path class=\"leader\" d=\"M180.5 162.89L105.01 140H95.01\"/><circle class=\"anchor\" cx=\"180.5\" cy=\"162.89\" r=\"1.5\"/><path class=\"leader\" d=\"M190.47 136.36L253 118H263\"/><circle class=\"anchor\" cx=\"190.47\" cy=\"136.36\" r=\"1.5\"/><path class=\"leader\" d=\"M185 59.25L251 72H261\"/><circle class=\"anchor\" cx=\"185\" cy=\"59.25\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"barbell-overhead-press-n-forearms\" data-key=\"forearms\" data-cue=\"Keep your elbows under the bar so your forearms point straight up.\" class=\"plate-callout two\" style=\"left:6.15%;top:32.96%\" aria-pressed=\"true\">Forearms<br>vertical</button><button type=\"button\" id=\"barbell-overhead-press-n-head\" data-key=\"head\" data-cue=\"Lean back slightly from the hips, then move under the bar as it passes.\" class=\"plate-callout two\" style=\"left:72.07%;top:26.82%\" aria-pressed=\"false\">Head<br>through</button><button type=\"button\" id=\"barbell-overhead-press-n-midfoot\" data-key=\"midfoot\" data-cue=\"Lock out with the bar over your shoulders and mid-foot.\" class=\"plate-callout two\" style=\"left:71.51%;top:13.97%\" aria-pressed=\"false\">Over<br>mid-foot</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"barbell-overhead-press-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"barbell-overhead-press-m-st-head\" d=\"^0\"/><path id=\"barbell-overhead-press-m-st-torso\" d=\"^1\"/><path id=\"barbell-overhead-press-m-st-shcap.r\" d=\"^2\"/><path id=\"barbell-overhead-press-m-st-upper.r\" d=\"^3\"/><path id=\"barbell-overhead-press-m-st-elbowcap.r\" d=\"^4\"/><path id=\"barbell-overhead-press-m-st-fore.r\" d=\"^5\"/><path id=\"barbell-overhead-press-m-st-fist.r\" d=\"^6\"/><path id=\"barbell-overhead-press-m-g0-shcap.r\" d=\"^2\"/><path id=\"barbell-overhead-press-m-g0-upper.r\" d=\"^7\"/><path id=\"barbell-overhead-press-m-g0-elbowcap.r\" d=\"^8\"/><path id=\"barbell-overhead-press-m-g0-fore.r\" d=\"^9\"/><path id=\"barbell-overhead-press-m-g0-fist.r\" d=\"^10\"/><path id=\"barbell-overhead-press-m-g1-shcap.r\" d=\"^11\"/><path id=\"barbell-overhead-press-m-g1-upper.r\" d=\"^12\"/><path id=\"barbell-overhead-press-m-g1-elbowcap.r\" d=\"^13\"/><path id=\"barbell-overhead-press-m-g1-fore.r\" d=\"^14\"/><path id=\"barbell-overhead-press-m-g1-fist.r\" d=\"^15\"/><path id=\"barbell-overhead-press-m-e-thigh.l\" d=\"^16\"/><path id=\"barbell-overhead-press-m-e-kneecap.l\" d=\"^17\"/><path id=\"barbell-overhead-press-m-e-shank.l\" d=\"^18\"/><path id=\"barbell-overhead-press-m-e-foot.l\" d=\"^19\"/><path id=\"barbell-overhead-press-m-e-shcap.l\" d=\"^20\"/><path id=\"barbell-overhead-press-m-e-upper.l\" d=\"^21\"/><path id=\"barbell-overhead-press-m-e-elbowcap.l\" d=\"^22\"/><path id=\"barbell-overhead-press-m-e-fore.l\" d=\"^23\"/><path id=\"barbell-overhead-press-m-e-fist.l\" d=\"^24\"/><path id=\"barbell-overhead-press-m-e-head\" d=\"^25\"/><path id=\"barbell-overhead-press-m-e-torso\" d=\"^26\"/><path id=\"barbell-overhead-press-m-e-thigh.r\" d=\"^16\"/><path id=\"barbell-overhead-press-m-e-kneecap.r\" d=\"^17\"/><path id=\"barbell-overhead-press-m-e-shank.r\" d=\"^18\"/><path id=\"barbell-overhead-press-m-e-foot.r\" d=\"^19\"/><path id=\"barbell-overhead-press-m-e-shcap.r\" d=\"^20\"/><path id=\"barbell-overhead-press-m-e-upper.r\" d=\"^21\"/><path id=\"barbell-overhead-press-m-e-elbowcap.r\" d=\"^22\"/><path id=\"barbell-overhead-press-m-e-fore.r\" d=\"^23\"/><path id=\"barbell-overhead-press-m-e-fist.r\" d=\"^24\"/><path id=\"barbell-overhead-press-m-m-shcap.l\" d=\"^20\"/><path id=\"barbell-overhead-press-m-m-upper.l\" d=\"~#F12SSx1SPtBTx1VOscE880S2_I1_2O5H1X2y5Oz1A9Eh3zfI9EhO5Gz1I1X2)2K5-1YI192dB8)etIcUn4WkYcJn00210001002000000000000100020000000000000000000001002100000200110100200000000120\"/><path id=\"barbell-overhead-press-m-m-elbowcap.l\" d=\"~~Hwy1wyD1Jw10\"/><path id=\"barbell-overhead-press-m-m-fore.l\" d=\"~#F12HwA1AND1OUz1zBE1.4D80.1HbGD1z6Y6B2P1EbAsxaY8X3S9W1HdKaJsiP20F9FhzA1H1I1.1N9S8N3SfEdU5.eO2Ek10000000000200000100100000000000010000000001000200001000202000101022000001200002\"/><path id=\"barbell-overhead-press-m-m-fist.l\" d=\"~~NHB1SVtNt0\"/><path id=\"barbell-overhead-press-m-m-shcap.r\" d=\"^20\"/><path id=\"barbell-overhead-press-m-m-upper.r\" d=\"^56\"/><path id=\"barbell-overhead-press-m-m-elbowcap.r\" d=\"^57\"/><path id=\"barbell-overhead-press-m-m-fore.r\" d=\"^58\"/><path id=\"barbell-overhead-press-m-m-fist.r\" d=\"^59\"/><path id=\"barbell-overhead-press-m-mf-head\" d=\"^25\"/><path id=\"barbell-overhead-press-m-mf-torso\" d=\"^26\"/><path id=\"barbell-overhead-press-m-mf-thigh.l\" d=\"^16\"/><path id=\"barbell-overhead-press-m-mf-kneecap.l\" d=\"^17\"/><path id=\"barbell-overhead-press-m-mf-shank.l\" d=\"^18\"/><path id=\"barbell-overhead-press-m-mf-foot.l\" d=\"^19\"/><path id=\"barbell-overhead-press-m-mf-thigh.r\" d=\"^16\"/><path id=\"barbell-overhead-press-m-mf-kneecap.r\" d=\"^17\"/><path id=\"barbell-overhead-press-m-mf-shank.r\" d=\"^18\"/><path id=\"barbell-overhead-press-m-mf-foot.r\" d=\"^19\"/><path id=\"barbell-overhead-press-m-mo-0\" d=\"^25\"/><path id=\"barbell-overhead-press-m-mo-1\" d=\"^26\"/><path id=\"barbell-overhead-press-m-mo-2\" d=\"^16\"/><path id=\"barbell-overhead-press-m-mo-3\" d=\"^17\"/><path id=\"barbell-overhead-press-m-mo-4\" d=\"^18\"/><path id=\"barbell-overhead-press-m-mo-5\" d=\"^19\"/><path id=\"barbell-overhead-press-m-mo-6\" d=\"^20\"/><path id=\"barbell-overhead-press-m-mo-7\" d=\"^21\"/><path id=\"barbell-overhead-press-m-mo-8\" d=\"^22\"/><path id=\"barbell-overhead-press-m-mo-9\" d=\"^23\"/><path id=\"barbell-overhead-press-m-mo-10\" d=\"^24\"/><path id=\"barbell-overhead-press-m-mo-11\" d=\"^16\"/><path id=\"barbell-overhead-press-m-mo-12\" d=\"^17\"/><path id=\"barbell-overhead-press-m-mo-13\" d=\"^18\"/><path id=\"barbell-overhead-press-m-mo-14\" d=\"^19\"/><path id=\"barbell-overhead-press-m-mo-15\" d=\"^20\"/><path id=\"barbell-overhead-press-m-mo-16\" d=\"^21\"/><path id=\"barbell-overhead-press-m-mo-17\" d=\"^22\"/><path id=\"barbell-overhead-press-m-mo-18\" d=\"^23\"/><path id=\"barbell-overhead-press-m-mo-19\" d=\"^24\"/><path id=\"barbell-overhead-press-m-mo-20\" d=\"^29\"/><path id=\"barbell-overhead-press-m-mo-21\" d=\"^31\"/><path id=\"barbell-overhead-press-m-mo-22\" d=\"^33\"/><path id=\"barbell-overhead-press-m-mo-23\" d=\"^34\"/><path id=\"barbell-overhead-press-m-mo-24\" d=\"^35\"/><path id=\"barbell-overhead-press-m-mo-25\" d=\"^42\"/><path id=\"barbell-overhead-press-m-mo-26\" d=\"^43\"/><path id=\"barbell-overhead-press-m-mo-27\" d=\"~MHUA1FPtLz4PkLK7z3L-5-5Lz3O7L0z8LA3O7L_5-5LN7z3LF80LN7A3L_5Y5LA3S7L0A8Lz3S7L-5Y5Z\"/><path id=\"barbell-overhead-press-m-mo-28\" d=\"~MwUA1FTtLy1*4Ld0Lb4L76L18L1aL0cL6aL20L04L04L04L12L20L10L21L18L2gL12L25L19L0jL0rL1vL0G1L1B1L0rL0hL0bL32L06L1iL3eL06L10L16L10L04L00L02L05L27L15L02L1aL1aL5kL3qL3qL3mL3gL7cL5cL5cL5aL74Ld0LdaL5gL0cL0cL1aL48L0aL2aL36L0aL3cL2aL2cL4gLcaLg2L64L6aL8cL4cL8cL4gL2mL2uL6mL2kL4cL08L24L05L09L03L00L02L04L20L24L02L26L2cL2kL06L42L0bL0hL4tL0z1L2E1L4z1L0pL2hL0dL23L14L0cL0cL03L00L00L02L04L04L02L14L38L1cL0aL46L88La6Le0La5La6L62La4L85La3Le9LefLehL8jL8hL4fL2dL1bL0dL39L09L2bL4dL29L1fL3fL5fL7lLdjLfdL99L97L71L92L72Z\"/><path id=\"barbell-overhead-press-m-mo-29\" d=\"~MyKA1W(kLB3wgL-5K2LR4O4LK2.5L2I6LJ2.5LP4O4L!5K2LJ62L!5J2LP4P4LJ2!5L2J6LK2!5LR4P4Z\"/><path id=\"barbell-overhead-press-m-mo-30\" d=\"~MFNA1PwlLs.3L71L72L36L38L06L0cL0aL24L06L14L06L10L20L10L03L0aL2aL10L29L1dL1dL1nL3rL1B1L1x1L1rL1fL17L12L18L0iL1gL18L16L14L12L24L10L00L15L07L03L12L08L1aL2iL1mL2oL2iL3cL3aL36L7aL0aL50Lf0L96L0cL3aL28L2aL04L4aL14L16L08L08L1aL28L2cLa8Lg3L62L0aL88L68L4aL2aL0kL0mL0oL0gL2cL26L04L05L25L07L02L01L24L04L42L08L26L2gL4iL0aL20L27L2fL0rL2x1L0z1L4vL0jL2hL0bL27L13L0cL0aL23L10L21L04L02L28L02L16L0aL2cL06L28L84L64L61L87L24L86L40L81L81Lc7Le7LafL8jL4bL2fL09L09L19L39L07L49L07L2bL19L1fL3bL7hLbhLd7Lb3L75L52L70L34Z\"/><path id=\"barbell-overhead-press-m-mo-31\" d=\"~MSBA1_(bL5_3Lb1Lb0L95Lb3Lb5L75L97L77L77L5bL59L59L1dL19L1bL0bL2bL29L2dL69L69L6bL87L87La7L85Lc5Lc3La5Lc0Lc1Lc2Lc1Lc4La4Lc4Lc4L88La8L88L8aL6aL6aL6aL2cL2cL2cL0cL1cL1cL1cL5aL5aL5aL7aL78L98L78Lb4Lb4L94Lb4Z\"/><path id=\"barbell-overhead-press-m-mo-32\" d=\"^60\"/><path id=\"barbell-overhead-press-m-mo-33\" d=\"^61\"/><path id=\"barbell-overhead-press-m-mo-34\" d=\"^62\"/><path id=\"barbell-overhead-press-m-mo-35\" d=\"^63\"/><path id=\"barbell-overhead-press-m-mo-36\" d=\"^64\"/><path id=\"barbell-overhead-press-m-mo-37\" d=\"^42\"/><path id=\"barbell-overhead-press-m-mo-38\" d=\"^43\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#barbell-overhead-press-m-dots)\"/>\n  <path class=\"datum\" d=\"^27\"/><path class=\"floorline\" d=\"^28\"/><path class=\"eq\" d=\"^29\"/><path class=\"eq-thin\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq-thin\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-overhead-press-m-st-head\"/><use href=\"#barbell-overhead-press-m-st-torso\"/></g><g class=\"u-fill\"><use href=\"#barbell-overhead-press-m-st-head\"/><use href=\"#barbell-overhead-press-m-st-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-overhead-press-m-st-shcap.r\"/><use href=\"#barbell-overhead-press-m-st-upper.r\"/><use href=\"#barbell-overhead-press-m-st-elbowcap.r\"/><use href=\"#barbell-overhead-press-m-st-fore.r\"/><use href=\"#barbell-overhead-press-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-overhead-press-m-st-shcap.r\"/><use href=\"#barbell-overhead-press-m-st-upper.r\"/><use href=\"#barbell-overhead-press-m-st-elbowcap.r\"/><use href=\"#barbell-overhead-press-m-st-fore.r\"/><use href=\"#barbell-overhead-press-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-overhead-press-m-g0-shcap.r\"/><use href=\"#barbell-overhead-press-m-g0-upper.r\"/><use href=\"#barbell-overhead-press-m-g0-elbowcap.r\"/><use href=\"#barbell-overhead-press-m-g0-fore.r\"/><use href=\"#barbell-overhead-press-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-overhead-press-m-g0-shcap.r\"/><use href=\"#barbell-overhead-press-m-g0-upper.r\"/><use href=\"#barbell-overhead-press-m-g0-elbowcap.r\"/><use href=\"#barbell-overhead-press-m-g0-fore.r\"/><use href=\"#barbell-overhead-press-m-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^36\"/><path class=\"eq-pin\" d=\"^37\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-overhead-press-m-g1-shcap.r\"/><use href=\"#barbell-overhead-press-m-g1-upper.r\"/><use href=\"#barbell-overhead-press-m-g1-elbowcap.r\"/><use href=\"#barbell-overhead-press-m-g1-fore.r\"/><use href=\"#barbell-overhead-press-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-overhead-press-m-g1-shcap.r\"/><use href=\"#barbell-overhead-press-m-g1-upper.r\"/><use href=\"#barbell-overhead-press-m-g1-elbowcap.r\"/><use href=\"#barbell-overhead-press-m-g1-fore.r\"/><use href=\"#barbell-overhead-press-m-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^38\"/><path class=\"eq-pin\" d=\"^39\"/></g><g class=\"pose-end\"><path class=\"eq-line\" d=\"^40\"/><path class=\"eq-thin\" d=\"^41\"/><path class=\"eq-solid\" d=\"^42\"/><path class=\"eq-pin\" d=\"^43\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#barbell-overhead-press-m-e-thigh.l\"/><use href=\"#barbell-overhead-press-m-e-kneecap.l\"/><use href=\"#barbell-overhead-press-m-e-shank.l\"/><use href=\"#barbell-overhead-press-m-e-foot.l\"/><use href=\"#barbell-overhead-press-m-e-shcap.l\"/><use href=\"#barbell-overhead-press-m-e-upper.l\"/><use href=\"#barbell-overhead-press-m-e-elbowcap.l\"/><use href=\"#barbell-overhead-press-m-e-fore.l\"/><use href=\"#barbell-overhead-press-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#barbell-overhead-press-m-e-thigh.l\"/><use href=\"#barbell-overhead-press-m-e-kneecap.l\"/><use href=\"#barbell-overhead-press-m-e-shank.l\"/><use href=\"#barbell-overhead-press-m-e-foot.l\"/><use href=\"#barbell-overhead-press-m-e-shcap.l\"/><use href=\"#barbell-overhead-press-m-e-upper.l\"/><use href=\"#barbell-overhead-press-m-e-elbowcap.l\"/><use href=\"#barbell-overhead-press-m-e-fore.l\"/><use href=\"#barbell-overhead-press-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-overhead-press-m-e-head\"/><use href=\"#barbell-overhead-press-m-e-torso\"/><use href=\"#barbell-overhead-press-m-e-thigh.r\"/><use href=\"#barbell-overhead-press-m-e-kneecap.r\"/><use href=\"#barbell-overhead-press-m-e-shank.r\"/><use href=\"#barbell-overhead-press-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-overhead-press-m-e-head\"/><use href=\"#barbell-overhead-press-m-e-torso\"/><use href=\"#barbell-overhead-press-m-e-thigh.r\"/><use href=\"#barbell-overhead-press-m-e-kneecap.r\"/><use href=\"#barbell-overhead-press-m-e-shank.r\"/><use href=\"#barbell-overhead-press-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-overhead-press-m-e-shcap.r\"/><use href=\"#barbell-overhead-press-m-e-upper.r\"/><use href=\"#barbell-overhead-press-m-e-elbowcap.r\"/><use href=\"#barbell-overhead-press-m-e-fore.r\"/><use href=\"#barbell-overhead-press-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-overhead-press-m-e-shcap.r\"/><use href=\"#barbell-overhead-press-m-e-upper.r\"/><use href=\"#barbell-overhead-press-m-e-elbowcap.r\"/><use href=\"#barbell-overhead-press-m-e-fore.r\"/><use href=\"#barbell-overhead-press-m-e-fist.r\"/></g></g><path class=\"eq m-line\" d=\"^60\"/><path class=\"eq m-line\" d=\"^61\"/><path class=\"eq m-line\" d=\"^62\"/><path class=\"eq m-line\" d=\"^63\"/><path class=\"eq m-line\" d=\"^64\"/><path class=\"eq m-line\" d=\"^60\"/><path class=\"eq m-line\" d=\"^61\"/><path class=\"eq m-line\" d=\"^62\"/><path class=\"eq m-line\" d=\"^63\"/><path class=\"eq m-line\" d=\"^64\"/><path class=\"eq-solid\" d=\"^42\"/><path class=\"eq-pin\" d=\"^43\"/><path class=\"eq-line m-line\" d=\"^49\"/><circle class=\"joint\" cx=\"179\" cy=\"151.08\" r=\"2.25\"/><circle class=\"joint\" cx=\"179.73\" cy=\"107.31\" r=\"2.25\"/><circle class=\"joint\" cx=\"179\" cy=\"214.67\" r=\"2.25\"/><circle class=\"joint\" cx=\"174.83\" cy=\"272.22\" r=\"2.25\"/></g><mask id=\"barbell-overhead-press-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#barbell-overhead-press-m-mf-head\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-mf-torso\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-mf-shank.l\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-mf-foot.l\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-m-shcap.l\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-m-upper.l\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-m-fore.l\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-m-fist.l\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-mf-shank.r\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-mf-foot.r\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-m-shcap.r\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-m-upper.r\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-m-fore.r\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-m-fist.r\" fill=\"#000\"/><use href=\"#barbell-overhead-press-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-36\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-37\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-overhead-press-m-mo-38\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#barbell-overhead-press-m-mmask)\"><g class=\"u-stroke\"><use href=\"#barbell-overhead-press-m-m-shcap.l\"/><use href=\"#barbell-overhead-press-m-m-upper.l\"/><use href=\"#barbell-overhead-press-m-m-elbowcap.l\"/><use href=\"#barbell-overhead-press-m-m-fore.l\"/><use href=\"#barbell-overhead-press-m-m-fist.l\"/><use href=\"#barbell-overhead-press-m-m-shcap.r\"/><use href=\"#barbell-overhead-press-m-m-upper.r\"/><use href=\"#barbell-overhead-press-m-m-elbowcap.r\"/><use href=\"#barbell-overhead-press-m-m-fore.r\"/><use href=\"#barbell-overhead-press-m-m-fist.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MSSx1SPtLnD4La4La1L60L41L23L15L53L09L15L03L23L11L21L14L20L07L1bL05L02L2cL0iL2sL2A1L2H1L0D1L2qL2kL0aL20L27L2jL0dL21L43L01L03L20L00L01L06L1aL22L01L2bL2dL4lL2rL4tL0lL2jL4hL2bL69L45L63L83L69L87L29L45L19L05L17L05L25L07L27L37L39L55L79L55L71L37L37L3dL1fL3jL1nL0rL5rL3lL1fL17L05L04L0aL06L21L10L11L01L01L33L01L3fL0fL19L10L0aL1iL1uL0A1L0H1L1A1L0sL1iL0cL12L25L0dL05L02L00L02L03L13L23L17L45L45L27L10L33L51L92L92Ld5L55L73L70L78L38L7gL3iL7kLbcL5aL5eL3aL0cL28L4aL0aL38L1cL2aL2aL6cL8cLacL8iL8kL4eL8aL66L82L85L65\"/><path class=\"m-line\" d=\"~MyxA1wyD1LK2JcLR4.1LO3K3L*1T4L2.4L!1T4LP3K3LP4.1Lw50LP4!1LP3N3L!1U4L2!4L*1U4LO3N3LR4!1\"/><path class=\"m-line\" d=\"~MHwA1AND1L(1X2L55L33L50L12L32L06L18L18L58L14L16L00L10L21L03L04L3cL12L01L49L4hL8nLatLaz1Lcx1L8pL6dL19L00L3cL9gL7eL34L36L12L14L10L00L01L05L45L03L14L36L3cL7iL7mL7oL5mL5eL3eL5aL54L34L53L32L92L36L34L34L34L26L16L12L16L32L08L04L16L48L06L66L62L04L26L3cL3eL5gL9iL7mLboL3iL5cL16L06L03L65L25L01L02L20L14L24L06L16L3iL3gL1cL00L45LadL8pLgtLez1LgtL8lLafL47L23L14L5aL04L21L03L00L02L06L14L18L1aL56L14L16L42L22L82L60L44L46L44L22L83L83L89L8bLe7La7L85L87L65L25L29L05L27L63L47L27L27L19L39L1dL0dL1dL0dL07L55L13L32L72\"/><path class=\"m-line\" d=\"~MHBE1SVtL3!2L90L71L93L53L91L73L57L55L57L55L17L59L15L19L09L27L39L49L45L49L27L45L87L85L47L83L81La3L83L81L80Lc0L80L82L84La2L84L86L46L86L86L48L2aL46L4aL48L3aL28L0aL18L1aL56L1aL58L56L56L56L76L94L52L94L72L90\"/><path class=\"m-line\" d=\"~M(!D1SVtLT1x8L*2F1LE2F2LE1(2L2F3LA1(2LH2F2Lw3F1LA30Lw3E1LH2E2LA1)2L2z3LE1)2LE2E2L*2E1\"/><path class=\"m-line\" d=\"~M!ED1SVtL(4*kLJ16LN16LN18LJ14LN18LN14LJ18LN16LJ16LP16LJ16\"/><path class=\"m-line\" d=\"~MABJ1D-lLR1)7L)2D1LE2F2LE1(2L0F3LF1(2LF2F2Lw3D1LA32Lw3E1LF2E2LF1*2L0E3LE1*2LE2E2L)2E1\"/><path class=\"m-arrow\" d=\"~MJXG1HInLwG1BA1MI6UuLJ6TuLRB1Ax1\"/><path class=\"leader m\" d=\"~MWwz1wyD1LS(fo\"/><path class=\"leader m\" d=\"~MAPI1DAlLAO7B1\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"barbell-overhead-press-m-elbows\" data-key=\"elbows\" data-cue=\"The elbows sit behind the bar, so your forearms tilt.\" class=\"plate-callout m\" style=\"left:71.51%;top:48.32%\" aria-pressed=\"true\">Elbows back</button><button type=\"button\" id=\"barbell-overhead-press-m-drift\" data-key=\"drift\" data-cue=\"The bar curves forward, away from your face and mid-foot.\" class=\"plate-callout two m\" style=\"left:71.51%;top:24.02%\" aria-pressed=\"false\">Bar drifts<br>forward</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "forearms",
        cues: [{ key: "forearms", cue: "Keep your elbows under the bar so your forearms point straight up." }, { key: "head", cue: "Lean back slightly from the hips, then move under the bar as it passes." }, { key: "midfoot", cue: "Lock out with the bar over your shoulders and mid-foot." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "The elbows sit behind the bar, so your forearms tilt." }, { key: "drift", cue: "The bar curves forward, away from your face and mid-foot." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Elbows back</b><span>The elbows sit behind the bar, so your forearms tilt.</span></li><li><b>Bar drifts forward</b><span>The bar curves forward, away from your face and mid-foot.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: press 1 second, hold 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Barbell overhead press, side view. The bar starts on the front of the shoulders, forearms vertical, body leaning slightly back from the hips. It travels straight up over mid-foot to locked arms overhead, the head moving forward under the bar.",
      mistakeAlt: "Barbell Overhead Press: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "push",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-Q1: the push heel-of-palm pair cannot be drawn by golden B's engine (D-LIB7-19); the grip copy carries c3 and c4.",
    "orientation": "pronated",
    "handle": "bar-28",
    "overBody": true,
    "width": {
      "text": "Grip just outside your shoulders, so your forearms are vertical at the bottom.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-ohp"
        ],
        "note": "c2"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-ohp"
        ],
        "note": "c3"
      }
    },
    "contact": "heel",
    "wrist": {
      "ext": [
        0,
        15
      ],
      "limitText": "Bar in mid-palm bends your wrist back. Keep it on the heel.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-ohp"
        ],
        "note": "c4. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number."
      }
    },
    "faults": [
      {
        "key": "bent-back",
        "label": "Wrist bent back",
        "pose": {},
        "markers": [],
        "alt": "Bar in mid-palm, wrist bent back."
      }
    ],
    "gripLine": "Full grip, thumbs wrapped, bar on the heel of your palm. Your wrist stays almost straight.",
    "cue": "Palm heel, wrist not bent back."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "safety",
      "text": "In the power rack, set the crossbars. Bar at shoulder height.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nsca-ch15-summary",
          "stronglifts-ohp",
          "ace-standing-sp"
        ],
        "note": "c11, c1"
      }
    },
    {
      "kind": "grip",
      "text": "Grip just outside the shoulders, thumbs wrapped, bar on the palm's heel.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-ohp"
        ],
        "note": "c2, c3, c4"
      }
    },
    {
      "kind": "position",
      "text": "Feet hip-width and flat. Hips and knees locked, elbows under the bar.",
      "zoom": "ohp-forearm-vertical",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "stronglifts-ohp"
        ],
        "note": "c10, c9, c5"
      }
    },
    {
      "kind": "safety",
      "text": "Failed rep? Lower the bar to your shoulders, then rack it.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nsca-ch15-summary",
          "stronglifts-ohp"
        ],
        "note": "c11"
      }
    },
    {
      "kind": "load",
      "text": "Beat target by one or two reps? Add 2 to 10 percent.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "acsm2009"
        ],
        "note": "c16"
      }
    }
  ],
  posture: [
    {
      "key": "forearms",
      "label": "Forearms vertical",
      "detail": "Elbows under the bar at the bottom, forearms straight up and down.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "zoom": "ohp-forearm-vertical",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "stronglifts-ohp"
        ],
        "note": "c5"
      }
    },
    {
      "key": "head",
      "label": "Head clear",
      "detail": "Lean back slightly from the hips so the bar clears your chin.",
      "anchor": {
        "pose": "start",
        "at": "chin"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-ohp"
        ],
        "note": "c6"
      }
    },
    {
      "key": "back",
      "label": "Low back neutral",
      "detail": "Low back neutral. Lean comes from the hips, not the spine.",
      "anchor": {
        "pose": "start",
        "at": "lumbar"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-ohp"
        ],
        "note": "c8, c6"
      }
    },
    {
      "key": "legs",
      "label": "Legs locked",
      "detail": "Hips and knees locked.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-ohp"
        ],
        "note": "c9"
      }
    },
    {
      "key": "front",
      "label": "Bar in front",
      "detail": "Bar in front of the head, never behind the neck.",
      "anchor": {
        "pose": "start",
        "at": "chin"
      },
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "kolber2013",
          "esenkaya2000"
        ],
        "note": "c14"
      }
    },
    {
      "key": "midfoot",
      "label": "Over mid-foot",
      "detail": "Lockout with the bar over the shoulders and mid-foot.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-ohp"
        ],
        "note": "c7"
      }
    }
  ],
  zooms: [
    {
      "key": "ohp-forearm-vertical",
      "chip": "Forearms",
      "heading": "Forearm angle",
      "kind": "posture"
    }
  ],
  chips: [
    "ohp-forearm-vertical",
    "feel"
  ],
  copy: {
    "setupLine": "Set the crossbars, bar at shoulder height. Grip just outside the shoulders, elbows forward under the bar.",
    "mistakeLine": "Never arch your low back to finish a rep. If it won't stay neutral, the weight is too heavy.",
    "cueLine": "Elbows under the bar."
  },
  mistakes: [
    {
      "key": "elbows",
      "title": "Pressing with elbows back",
      "zoom": "ohp-forearm-vertical",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "stronglifts-ohp"
        ],
        "note": "c5"
      },
      "fix": "Move your elbows forward under the bar before you press."
    },
    {
      "key": "arch",
      "title": "Leaning back, low back arching",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-ohp"
        ],
        "note": "c8"
      },
      "fix": "The weight is too heavy: end the set."
    },
    {
      "key": "thumbless",
      "title": "Thumbless grip",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-ohp"
        ],
        "note": "c3"
      },
      "fix": "Wrap the thumbs."
    }
  ],
  risks: [
    {
      "key": "thumbless",
      "text": "Bar falling on the head with a thumbless grip.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-ohp"
        ],
        "note": "c3"
      }
    },
    {
      "key": "arch",
      "text": "Over-arching the low back under a heavy bar can cause back pain.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-ohp"
        ],
        "note": "c8"
      }
    },
    {
      "key": "behind-neck",
      "text": "Pressing behind the neck is linked to shoulder instability.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "kolber2013",
          "esenkaya2000"
        ],
        "note": "c14"
      }
    }
  ],
  riskFlags: [
    "shoulder",
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
    "ace-standing-sp",
    "stronglifts-ohp",
    "nsca-ch15-summary",
    "saeterbakken2013",
    "kolber2013",
    "esenkaya2000",
    "acsm2009",
    "kolber2010",
    "nhs-shoulder-pain",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/barbell_overhead_press.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

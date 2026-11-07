// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=8110d9db519bc572ddcd13b0ba3ab83e7a1a29bc55e69612e7ece6364c1c98ed
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_pike_push_up",
  name: "Pike Push-Up",
  hashes: { inputsSha256: "8110d9db519bc572ddcd13b0ba3ab83e7a1a29bc55e69612e7ece6364c1c98ed", golden: "b443401219f85a2559520c2d8fa2ec71bf7a88228fafb14a2c4b8a1d8a0361bc" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"pike-push-up-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"pike-push-up-n-st-thigh.l\" d=\"~#F12w)iPzx1ETjO-vH4*az1jEsDX1(8V3H4)1Ws)I1wmKdAaEhu-pHoON19X4E1V9Ey1YT1A1mJ7B9XkTpxE1(n*hUuV1YK102101000002101000010101000200000200100000200010000002220020111000000000001010000\"/><path id=\"pike-push-up-n-st-kneecap.l\" d=\"~~SPdyYJ1FJ10\"/><path id=\"pike-push-up-n-st-shank.l\" d=\"~#F12FVd(wJ1)OeR_H1J7z9A1kGryY1w9V3J4*1Dux.1yd*7(5BaiEfWA1GX1dV4z1V9Tz1FT1vjF4*aVgS3TnJe.aSivWr00000220000000000020000001000002100000000100000000000000021000000000010000220020\"/><path id=\"pike-push-up-n-st-foot.l\" d=\"~#o2JR8H.V1GP9-FV1F9A9wj(1!x1V7(K2yH1x)1OH1Xs*pOk)b-B1VgB3OgAu_4.vWa000010010100000200000100000010010100100010000000\"/><path id=\"pike-push-up-n-st-torso\" d=\"~#_12H)x1wUO1EVy1I*P1Hbz1N2x2IiG7IbA1-j)3.4(3ykHewmz8Y6Tbz9Wd-b(h)6JqB2NoH2HaFgD7_H1S9WpWd!4x4H7x6-jz4O7x4_e*1y7BgB8.j*8pT2SgO7x4yI1XJ201000000010000010002000101000200110020010100000000010100100020011100000000010001200000000200000020000021010010101201\"/><path id=\"pike-push-up-n-st-thigh.r\" d=\"^0\"/><path id=\"pike-push-up-n-st-kneecap.r\" d=\"^1\"/><path id=\"pike-push-up-n-st-shank.r\" d=\"^2\"/><path id=\"pike-push-up-n-st-foot.r\" d=\"^3\"/><path id=\"pike-push-up-n-st-shcap.r\" d=\"~~NxsNSJ1NO10\"/><path id=\"pike-push-up-n-st-upper.r\" d=\"~#F12WEs(GK1xXr-HJ1*3*781HpWE15V65E3.d.z1h)kx8zeXhBbXnEuX2-1R5R3DlwH176-4K7Iew7oUs(aFjFoHf01000000001000010000000000101010002100000000000000001000001000002120000110001000\"/><path id=\"pike-push-up-n-st-elbowcap.r\" d=\"~~S)w1wSU1Yy12\"/><path id=\"pike-push-up-n-st-fore.r\" d=\"~#F12Yyx1(zV1TXw1IHU1O3V9P1D1FoWz1O1-96-2VfOsbIeO5R9zcV7RgzsO2B1R7E6Di(D1aw2R6*7X8Y4iwmJ8YeUiWb20010100101002000011110000000102100011110000220002010100001210210002000000200202\"/><path id=\"pike-push-up-n-st-palm.r\" d=\"~#o2SUB1_y_1.GA1RU-1P8O9O8T1If_4Ok)3Td0OkqIf0O8X4P80Jy1VnUg1001001002020000001000000000020200000100000010102\"/><path id=\"pike-push-up-n-g0-shcap.r\" d=\"~~FHvNyN1NO10\"/><path id=\"pike-push-up-n-g0-upper.r\" d=\"~#F12UHvPFN1KEv)FK1j*7a0Y7NG1J2R5D1.2S1VvN7Vjx2zgEczhT9EuX1K2-3.4y3AH172O1-7KgR2EaWq!2ymWgFn00100010100100000001000012001000010000220000011010101200000000000010002200200002\"/><path id=\"pike-push-up-n-g0-elbowcap.r\" d=\"~~YYw1WEW1Yy12\"/><path id=\"pike-push-up-n-g0-fore.r\" d=\"~#F12P)w1_(W1GTw1GIW1*3R7P1oDpApz2z80O2VeRi.2xe)6O8EdO5Kf*hK2fR7T3!jPtcU1T6I5.aP2D4Sl!aAdJkH800000002000200200000010101110000020010100011100000010001000100002010102000210110\"/><path id=\"pike-push-up-n-g0-palm.r\" d=\"~#o2SUB1_y_1OxB1RU-1!3O9.3T1-6_4E9)3)50E9q-60.3X4!30YaVnUg1000001000000000011000010000000000000000000010102\"/><path id=\"pike-push-up-n-g1-shcap.r\" d=\"~~wJy1AxP1NO10\"/><path id=\"pike-push-up-n-g1-upper.r\" d=\"~#F12wKy1WXO1TTy1..N1!1*684E5YB1w4)3!1z2Wa)nPdBgD3*f)5zkdIqrR2z2I5*9(A193w1x7Be-aEiymK4WlD8Pr10001010000001001011000200010100100000000020000110101010010000000002200001021000\"/><path id=\"pike-push-up-n-g1-elbowcap.r\" d=\"~~wGx1PHX1Yy12\"/><path id=\"pike-push-up-n-g1-fore.r\" d=\"~#F12FRx1HzY1.Dx1.TX1G3)5J1awmPiV1.66B2IaXbT3XdT7B8OdO4)aBbB22X6z2(gDn8J1X5X3-d0U5DlSbNc!kw700000200000110001000000010002001010200000100020011001101000000021001010000002000\"/><path id=\"pike-push-up-n-g1-palm.r\" d=\"^14\"/><path id=\"pike-push-up-n-e-thigh.l\" d=\"~#F12PBtD!B1zGux(A1N8E8nvGP1(D1W98Y41AJ1RsUpG3AgTbNbBnAG1Tw1S1O4(2G9KU1Jx1ow1PaG5O8.vKK1w6.sUkzkDG100100100000000000101000000200010000100011001002100021000000000000012101001000000\"/><path id=\"pike-push-up-n-e-kneecap.l\" d=\"~~YHjU.N1FJ10\"/><path id=\"pike-push-up-n-e-shank.l\" d=\"~#F12H!jJWK1IAlB(J1PaI5my1VO1AF1Y9aW43WT1RG1yf*1W9*6W6Vd(X1Tz1S1K4!2G9GV1Jw1nx1N8B8XgT3OrU3IhPcBc!o10100010020000001011000002101200010000000010120020200001010200000000020022000000\"/><path id=\"pike-push-up-n-e-foot.l\" d=\"~#o2YDb(SU1RHcTNU1Y4ycUgS9wy1Y6AW1yD2GF1Iw2XfOz1-dEj-rTu!3GgPpUgIx1E3100110000000120010000000000000000002200011210001\"/><path id=\"pike-push-up-n-e-shcap.l\" d=\"~~YAB1PKS1NO10\"/><path id=\"pike-push-up-n-e-upper.l\" d=\"~#F12JJB1WTR1O.B1z(P1w4E564xhYu(4*1N2z1Sg)eJiza!8VdW1.kA7El3T23I5BlDs55D3-5)7xhxp_dzcSiI2Ss00000001000020000001000000100000001200200212002002000020000000000000000101000000\"/><path id=\"pike-push-up-n-e-elbowcap.l\" d=\"~~!-x1PBY1Yy12\"/><path id=\"pike-push-up-n-e-fore.l\" d=\"~#F12Jzy1U)Y1._x1GTY1V2*4D16YiFdx1.58)1)5I6G4Vdx8V7Vd.3T6-5)1a*5r(dHi6D1x5O2Ig*1U6!kFc_bylw602000002000021000200220000010110100200100010020200101200000200000001101101100000\"/><path id=\"pike-push-up-n-e-palm.l\" d=\"^14\"/><path id=\"pike-push-up-n-e-head\" d=\"~#w12UTJ1AG_1TxN1xS-1U3RqH9xjYaz4bX5S8P3wd(3FrA7!3(cw7S6AfOb*aFm-dNiBi!9Xox1Ba)f0100000100020000000002012020002000210020000200000000010002020001\"/><path id=\"pike-push-up-n-e-torso\" d=\"~#_12N(H1!UV1VSI1z)W1NblP2.1ziz8GbmVj*4)4!3NjwfHmx7F7KbX9HdOcPhx8wqG3How2Na!f_7NH1JbypYew5.3U7X5Vj*4G7G4!eK1_7-fK7Bk.8E1I3PgE7I4FN1*H201000000000100010100000022000002100001010100000000000101002000000202001000010000100000000000101010000110020000000011\"/><path id=\"pike-push-up-n-e-thigh.r\" d=\"^19\"/><path id=\"pike-push-up-n-e-kneecap.r\" d=\"^20\"/><path id=\"pike-push-up-n-e-shank.r\" d=\"^21\"/><path id=\"pike-push-up-n-e-foot.r\" d=\"^22\"/><path id=\"pike-push-up-n-e-shcap.r\" d=\"^23\"/><path id=\"pike-push-up-n-e-upper.r\" d=\"^24\"/><path id=\"pike-push-up-n-e-elbowcap.r\" d=\"^25\"/><path id=\"pike-push-up-n-e-fore.r\" d=\"^26\"/><path id=\"pike-push-up-n-e-palm.r\" d=\"^14\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#pike-push-up-n-dots)\"/>\n  <path class=\"floorline\" d=\"M45.79 305.5H263.11\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pike-push-up-n-st-thigh.l\"/><use href=\"#pike-push-up-n-st-kneecap.l\"/><use href=\"#pike-push-up-n-st-shank.l\"/><use href=\"#pike-push-up-n-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-n-st-thigh.l\"/><use href=\"#pike-push-up-n-st-kneecap.l\"/><use href=\"#pike-push-up-n-st-shank.l\"/><use href=\"#pike-push-up-n-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pike-push-up-n-st-torso\"/><use href=\"#pike-push-up-n-st-thigh.r\"/><use href=\"#pike-push-up-n-st-kneecap.r\"/><use href=\"#pike-push-up-n-st-shank.r\"/><use href=\"#pike-push-up-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-n-st-torso\"/><use href=\"#pike-push-up-n-st-thigh.r\"/><use href=\"#pike-push-up-n-st-kneecap.r\"/><use href=\"#pike-push-up-n-st-shank.r\"/><use href=\"#pike-push-up-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pike-push-up-n-st-shcap.r\"/><use href=\"#pike-push-up-n-st-upper.r\"/><use href=\"#pike-push-up-n-st-elbowcap.r\"/><use href=\"#pike-push-up-n-st-fore.r\"/><use href=\"#pike-push-up-n-st-palm.r\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-n-st-shcap.r\"/><use href=\"#pike-push-up-n-st-upper.r\"/><use href=\"#pike-push-up-n-st-elbowcap.r\"/><use href=\"#pike-push-up-n-st-fore.r\"/><use href=\"#pike-push-up-n-st-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pike-push-up-n-g0-shcap.r\"/><use href=\"#pike-push-up-n-g0-upper.r\"/><use href=\"#pike-push-up-n-g0-elbowcap.r\"/><use href=\"#pike-push-up-n-g0-fore.r\"/><use href=\"#pike-push-up-n-g0-palm.r\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-n-g0-shcap.r\"/><use href=\"#pike-push-up-n-g0-upper.r\"/><use href=\"#pike-push-up-n-g0-elbowcap.r\"/><use href=\"#pike-push-up-n-g0-fore.r\"/><use href=\"#pike-push-up-n-g0-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pike-push-up-n-g1-shcap.r\"/><use href=\"#pike-push-up-n-g1-upper.r\"/><use href=\"#pike-push-up-n-g1-elbowcap.r\"/><use href=\"#pike-push-up-n-g1-fore.r\"/><use href=\"#pike-push-up-n-g1-palm.r\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-n-g1-shcap.r\"/><use href=\"#pike-push-up-n-g1-upper.r\"/><use href=\"#pike-push-up-n-g1-elbowcap.r\"/><use href=\"#pike-push-up-n-g1-fore.r\"/><use href=\"#pike-push-up-n-g1-palm.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pike-push-up-n-e-thigh.l\"/><use href=\"#pike-push-up-n-e-kneecap.l\"/><use href=\"#pike-push-up-n-e-shank.l\"/><use href=\"#pike-push-up-n-e-foot.l\"/><use href=\"#pike-push-up-n-e-shcap.l\"/><use href=\"#pike-push-up-n-e-upper.l\"/><use href=\"#pike-push-up-n-e-elbowcap.l\"/><use href=\"#pike-push-up-n-e-fore.l\"/><use href=\"#pike-push-up-n-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-n-e-thigh.l\"/><use href=\"#pike-push-up-n-e-kneecap.l\"/><use href=\"#pike-push-up-n-e-shank.l\"/><use href=\"#pike-push-up-n-e-foot.l\"/><use href=\"#pike-push-up-n-e-shcap.l\"/><use href=\"#pike-push-up-n-e-upper.l\"/><use href=\"#pike-push-up-n-e-elbowcap.l\"/><use href=\"#pike-push-up-n-e-fore.l\"/><use href=\"#pike-push-up-n-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pike-push-up-n-e-head\"/><use href=\"#pike-push-up-n-e-torso\"/><use href=\"#pike-push-up-n-e-thigh.r\"/><use href=\"#pike-push-up-n-e-kneecap.r\"/><use href=\"#pike-push-up-n-e-shank.r\"/><use href=\"#pike-push-up-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-n-e-head\"/><use href=\"#pike-push-up-n-e-torso\"/><use href=\"#pike-push-up-n-e-thigh.r\"/><use href=\"#pike-push-up-n-e-kneecap.r\"/><use href=\"#pike-push-up-n-e-shank.r\"/><use href=\"#pike-push-up-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pike-push-up-n-e-shcap.r\"/><use href=\"#pike-push-up-n-e-upper.r\"/><use href=\"#pike-push-up-n-e-elbowcap.r\"/><use href=\"#pike-push-up-n-e-fore.r\"/><use href=\"#pike-push-up-n-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-n-e-shcap.r\"/><use href=\"#pike-push-up-n-e-upper.r\"/><use href=\"#pike-push-up-n-e-elbowcap.r\"/><use href=\"#pike-push-up-n-e-fore.r\"/><use href=\"#pike-push-up-n-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"197.79\" cy=\"258.16\" r=\"2.25\"/><circle class=\"joint\" cx=\"178.67\" cy=\"287.6\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.43\" cy=\"203.81\" r=\"2.25\"/><circle class=\"joint\" cx=\"106.08\" cy=\"239.94\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#(10JKB1F)U1xEB1x!U100211220110220fs022112012211022112012012012211hs2010000022110000002000000000000010020000000010020000001210002002001010002000001010002100001210002002001010000000021012100200220000111101\"/><path class=\"arrow\" d=\"~MD)I1AW-1LEF1VbLYx2-fZ\"/></g><path class=\"leader\" d=\"~MWNx1DzB1L0*)7\"/><circle class=\"anchor\" cx=\"171.31\" cy=\"189.95\" r=\"1.5\"/><path class=\"leader\" d=\"M235.42 288.42L245 248H255\"/><circle class=\"anchor\" cx=\"235.42\" cy=\"288.42\" r=\"1.5\"/><path class=\"leader\" d=\"~MUTJ1AG_1L0JJ5\"/><circle class=\"anchor\" cx=\"228.42\" cy=\"298.42\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"pike-push-up-n-hips\" data-key=\"hips\" data-cue=\"Keep your legs straight and your hips up in an upside-down V.\" class=\"plate-callout\" style=\"left:41.9%;top:32.4%\" aria-pressed=\"true\">Hips high</button><button type=\"button\" id=\"pike-push-up-n-head\" data-key=\"head\" data-cue=\"Move your head forward and down as your elbows bend.\" class=\"plate-callout two\" style=\"left:69.83%;top:63.13%\" aria-pressed=\"false\">Head<br>forward</button><button type=\"button\" id=\"pike-push-up-n-floor\" data-key=\"floor\" data-cue=\"Lower until your head is about an inch from the floor.\" class=\"plate-callout\" style=\"left:55.87%;top:87.99%\" aria-pressed=\"false\">Head near floor</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"pike-push-up-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"pike-push-up-m-st-thigh.l\" d=\"^0\"/><path id=\"pike-push-up-m-st-kneecap.l\" d=\"^1\"/><path id=\"pike-push-up-m-st-shank.l\" d=\"^2\"/><path id=\"pike-push-up-m-st-foot.l\" d=\"^3\"/><path id=\"pike-push-up-m-st-torso\" d=\"^4\"/><path id=\"pike-push-up-m-st-thigh.r\" d=\"^0\"/><path id=\"pike-push-up-m-st-kneecap.r\" d=\"^1\"/><path id=\"pike-push-up-m-st-shank.r\" d=\"^2\"/><path id=\"pike-push-up-m-st-foot.r\" d=\"^3\"/><path id=\"pike-push-up-m-st-shcap.r\" d=\"^5\"/><path id=\"pike-push-up-m-st-upper.r\" d=\"^6\"/><path id=\"pike-push-up-m-st-elbowcap.r\" d=\"^7\"/><path id=\"pike-push-up-m-st-fore.r\" d=\"^8\"/><path id=\"pike-push-up-m-st-palm.r\" d=\"^9\"/><path id=\"pike-push-up-m-g0-shcap.r\" d=\"^10\"/><path id=\"pike-push-up-m-g0-upper.r\" d=\"^11\"/><path id=\"pike-push-up-m-g0-elbowcap.r\" d=\"^12\"/><path id=\"pike-push-up-m-g0-fore.r\" d=\"^13\"/><path id=\"pike-push-up-m-g0-palm.r\" d=\"^14\"/><path id=\"pike-push-up-m-g1-shcap.r\" d=\"^15\"/><path id=\"pike-push-up-m-g1-upper.r\" d=\"^16\"/><path id=\"pike-push-up-m-g1-elbowcap.r\" d=\"^17\"/><path id=\"pike-push-up-m-g1-fore.r\" d=\"^18\"/><path id=\"pike-push-up-m-g1-palm.r\" d=\"^14\"/><path id=\"pike-push-up-m-e-thigh.l\" d=\"^19\"/><path id=\"pike-push-up-m-e-kneecap.l\" d=\"^20\"/><path id=\"pike-push-up-m-e-shank.l\" d=\"^21\"/><path id=\"pike-push-up-m-e-foot.l\" d=\"^22\"/><path id=\"pike-push-up-m-e-shcap.l\" d=\"^23\"/><path id=\"pike-push-up-m-e-upper.l\" d=\"^24\"/><path id=\"pike-push-up-m-e-elbowcap.l\" d=\"^25\"/><path id=\"pike-push-up-m-e-fore.l\" d=\"^26\"/><path id=\"pike-push-up-m-e-palm.l\" d=\"^14\"/><path id=\"pike-push-up-m-e-head\" d=\"^27\"/><path id=\"pike-push-up-m-e-torso\" d=\"^28\"/><path id=\"pike-push-up-m-e-thigh.r\" d=\"^19\"/><path id=\"pike-push-up-m-e-kneecap.r\" d=\"^20\"/><path id=\"pike-push-up-m-e-shank.r\" d=\"^21\"/><path id=\"pike-push-up-m-e-foot.r\" d=\"^22\"/><path id=\"pike-push-up-m-e-shcap.r\" d=\"^23\"/><path id=\"pike-push-up-m-e-upper.r\" d=\"^24\"/><path id=\"pike-push-up-m-e-elbowcap.r\" d=\"^25\"/><path id=\"pike-push-up-m-e-fore.r\" d=\"^26\"/><path id=\"pike-push-up-m-e-palm.r\" d=\"^14\"/><path id=\"pike-push-up-m-m-head\" d=\"~#w12yzF1PO_1XTG1-(-1D7.p_bRhAbX2eT5y8P4HcW5yqYay2Hdy6P7PgI9XdPkBgNgKjN7EoK4x8Gh0100000000100002202001000002101010000001002000001000020000110001\"/><path id=\"pike-push-up-m-m-torso\" d=\"~#_12HyE1NVV1VPE1)xX1NbsW2T1-gKaIbpXiR7R5D3FhNhAn*3U8KaIb(bXeUfObWoO6WngSaWe!9SF1yh_m!hS5z3D8V4XiO7V6G5(em!9XeV4*kT8K2O5(fT6I5!X1xA200220010110101010100201010210100000100200000000000000001010000020000100100110000000200000000001000010100202001000000\"/><path id=\"pike-push-up-m-m-thigh.l\" d=\"~#F12yzr_OA1XzsRNz1U7*8ptOJ1FI1W9lW4dHG1Rw1ApV5Afxdy9zoyD1GA1D1R4(1R9xR1wD1qw1waG6Ob.uTJ1ya-qHnEg!H110000000000020111100001111010000001010002020000101111000022000001001210000220010\"/><path id=\"pike-push-up-m-m-kneecap.l\" d=\"~~AAiwEN1FJ10\"/><path id=\"pike-push-up-m-m-shank.l\" d=\"~#F12HSiNAK1)XjVFJ1waE6qu-I1NJ1W9lY4fSO1zN1!eK3(8V7N5GeJU1TF1D1R4w2R9BS1AB1nrU7x9xh*1*qA6Egwe-9(p01000200000000000000202002000000000001010000000010100100200010101000000110101001\"/><path id=\"pike-push-up-m-m-foot.l\" d=\"~#o2HSaW-U1RVbxSU1!5UbJh!7Py1U3N!1Yw2BN1K!1*i-x1Of.hRu*rH2VgwrFeTx13200001000100020001110010100000000110110000000002\"/><path id=\"pike-push-up-m-m-shcap.l\" d=\"~~_Xx1N!R1NO10\"/><path id=\"pike-push-up-m-m-upper.l\" d=\"~#F12JYx1(UR1R*x1R_P1S1R682I3Yz1_3*3_1)1D9IlWcXgU2xg.6-jx2EnvO2K2.4*7yz1b3mV6Ie.bGh_mR3!lJ9yr01000010000000002001200010011000000000111000210002000010010100001000001110000100\"/><path id=\"pike-push-up-m-m-elbowcap.l\" d=\"~~(wx1P-Y1Yy12\"/><path id=\"pike-push-up-m-m-fore.l\" d=\"~#F12SRx1y--1OBx1XN-1z4E4H13Wmy9-2T59x2-8R5R7BcV9R5EebG9.4*1mE6gFjyfiA1-5I1TfU2SbUi_eP8!lm01020000000011001011010022001011102200000101010200000001000010100010100000001100\"/><path id=\"pike-push-up-m-m-thigh.r\" d=\"^37\"/><path id=\"pike-push-up-m-m-kneecap.r\" d=\"^38\"/><path id=\"pike-push-up-m-m-shank.r\" d=\"^39\"/><path id=\"pike-push-up-m-m-foot.r\" d=\"^40\"/><path id=\"pike-push-up-m-m-shcap.r\" d=\"^41\"/><path id=\"pike-push-up-m-m-upper.r\" d=\"^42\"/><path id=\"pike-push-up-m-m-elbowcap.r\" d=\"^43\"/><path id=\"pike-push-up-m-m-fore.r\" d=\"^44\"/><path id=\"pike-push-up-m-mf-palm.l\" d=\"^14\"/><path id=\"pike-push-up-m-mf-palm.r\" d=\"^14\"/><path id=\"pike-push-up-m-mo-0\" d=\"^27\"/><path id=\"pike-push-up-m-mo-1\" d=\"^28\"/><path id=\"pike-push-up-m-mo-2\" d=\"^19\"/><path id=\"pike-push-up-m-mo-3\" d=\"^20\"/><path id=\"pike-push-up-m-mo-4\" d=\"^21\"/><path id=\"pike-push-up-m-mo-5\" d=\"^22\"/><path id=\"pike-push-up-m-mo-6\" d=\"^23\"/><path id=\"pike-push-up-m-mo-7\" d=\"^24\"/><path id=\"pike-push-up-m-mo-8\" d=\"^25\"/><path id=\"pike-push-up-m-mo-9\" d=\"^26\"/><path id=\"pike-push-up-m-mo-10\" d=\"^14\"/><path id=\"pike-push-up-m-mo-11\" d=\"^19\"/><path id=\"pike-push-up-m-mo-12\" d=\"^20\"/><path id=\"pike-push-up-m-mo-13\" d=\"^21\"/><path id=\"pike-push-up-m-mo-14\" d=\"^22\"/><path id=\"pike-push-up-m-mo-15\" d=\"^23\"/><path id=\"pike-push-up-m-mo-16\" d=\"^24\"/><path id=\"pike-push-up-m-mo-17\" d=\"^25\"/><path id=\"pike-push-up-m-mo-18\" d=\"^26\"/><path id=\"pike-push-up-m-mo-19\" d=\"^14\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#pike-push-up-m-dots)\"/>\n  <path class=\"floorline\" d=\"^29\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pike-push-up-m-st-thigh.l\"/><use href=\"#pike-push-up-m-st-kneecap.l\"/><use href=\"#pike-push-up-m-st-shank.l\"/><use href=\"#pike-push-up-m-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-m-st-thigh.l\"/><use href=\"#pike-push-up-m-st-kneecap.l\"/><use href=\"#pike-push-up-m-st-shank.l\"/><use href=\"#pike-push-up-m-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pike-push-up-m-st-torso\"/><use href=\"#pike-push-up-m-st-thigh.r\"/><use href=\"#pike-push-up-m-st-kneecap.r\"/><use href=\"#pike-push-up-m-st-shank.r\"/><use href=\"#pike-push-up-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-m-st-torso\"/><use href=\"#pike-push-up-m-st-thigh.r\"/><use href=\"#pike-push-up-m-st-kneecap.r\"/><use href=\"#pike-push-up-m-st-shank.r\"/><use href=\"#pike-push-up-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pike-push-up-m-st-shcap.r\"/><use href=\"#pike-push-up-m-st-upper.r\"/><use href=\"#pike-push-up-m-st-elbowcap.r\"/><use href=\"#pike-push-up-m-st-fore.r\"/><use href=\"#pike-push-up-m-st-palm.r\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-m-st-shcap.r\"/><use href=\"#pike-push-up-m-st-upper.r\"/><use href=\"#pike-push-up-m-st-elbowcap.r\"/><use href=\"#pike-push-up-m-st-fore.r\"/><use href=\"#pike-push-up-m-st-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pike-push-up-m-g0-shcap.r\"/><use href=\"#pike-push-up-m-g0-upper.r\"/><use href=\"#pike-push-up-m-g0-elbowcap.r\"/><use href=\"#pike-push-up-m-g0-fore.r\"/><use href=\"#pike-push-up-m-g0-palm.r\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-m-g0-shcap.r\"/><use href=\"#pike-push-up-m-g0-upper.r\"/><use href=\"#pike-push-up-m-g0-elbowcap.r\"/><use href=\"#pike-push-up-m-g0-fore.r\"/><use href=\"#pike-push-up-m-g0-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pike-push-up-m-g1-shcap.r\"/><use href=\"#pike-push-up-m-g1-upper.r\"/><use href=\"#pike-push-up-m-g1-elbowcap.r\"/><use href=\"#pike-push-up-m-g1-fore.r\"/><use href=\"#pike-push-up-m-g1-palm.r\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-m-g1-shcap.r\"/><use href=\"#pike-push-up-m-g1-upper.r\"/><use href=\"#pike-push-up-m-g1-elbowcap.r\"/><use href=\"#pike-push-up-m-g1-fore.r\"/><use href=\"#pike-push-up-m-g1-palm.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pike-push-up-m-e-thigh.l\"/><use href=\"#pike-push-up-m-e-kneecap.l\"/><use href=\"#pike-push-up-m-e-shank.l\"/><use href=\"#pike-push-up-m-e-foot.l\"/><use href=\"#pike-push-up-m-e-shcap.l\"/><use href=\"#pike-push-up-m-e-upper.l\"/><use href=\"#pike-push-up-m-e-elbowcap.l\"/><use href=\"#pike-push-up-m-e-fore.l\"/><use href=\"#pike-push-up-m-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-m-e-thigh.l\"/><use href=\"#pike-push-up-m-e-kneecap.l\"/><use href=\"#pike-push-up-m-e-shank.l\"/><use href=\"#pike-push-up-m-e-foot.l\"/><use href=\"#pike-push-up-m-e-shcap.l\"/><use href=\"#pike-push-up-m-e-upper.l\"/><use href=\"#pike-push-up-m-e-elbowcap.l\"/><use href=\"#pike-push-up-m-e-fore.l\"/><use href=\"#pike-push-up-m-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pike-push-up-m-e-head\"/><use href=\"#pike-push-up-m-e-torso\"/><use href=\"#pike-push-up-m-e-thigh.r\"/><use href=\"#pike-push-up-m-e-kneecap.r\"/><use href=\"#pike-push-up-m-e-shank.r\"/><use href=\"#pike-push-up-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-m-e-head\"/><use href=\"#pike-push-up-m-e-torso\"/><use href=\"#pike-push-up-m-e-thigh.r\"/><use href=\"#pike-push-up-m-e-kneecap.r\"/><use href=\"#pike-push-up-m-e-shank.r\"/><use href=\"#pike-push-up-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pike-push-up-m-e-shcap.r\"/><use href=\"#pike-push-up-m-e-upper.r\"/><use href=\"#pike-push-up-m-e-elbowcap.r\"/><use href=\"#pike-push-up-m-e-fore.r\"/><use href=\"#pike-push-up-m-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#pike-push-up-m-e-shcap.r\"/><use href=\"#pike-push-up-m-e-upper.r\"/><use href=\"#pike-push-up-m-e-elbowcap.r\"/><use href=\"#pike-push-up-m-e-fore.r\"/><use href=\"#pike-push-up-m-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"197.79\" cy=\"258.16\" r=\"2.25\"/><circle class=\"joint\" cx=\"178.67\" cy=\"287.6\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.43\" cy=\"203.81\" r=\"2.25\"/><circle class=\"joint\" cx=\"106.08\" cy=\"239.94\" r=\"2.25\"/></g><mask id=\"pike-push-up-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#pike-push-up-m-m-head\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-torso\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-thigh.l\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-shank.l\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-foot.l\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-shcap.l\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-upper.l\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-fore.l\" fill=\"#000\"/><use href=\"#pike-push-up-m-mf-palm.l\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-thigh.r\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-shank.r\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-foot.r\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-shcap.r\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-upper.r\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#pike-push-up-m-m-fore.r\" fill=\"#000\"/><use href=\"#pike-push-up-m-mf-palm.r\" fill=\"#000\"/><use href=\"#pike-push-up-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pike-push-up-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#pike-push-up-m-mmask)\"><g class=\"u-stroke\"><use href=\"#pike-push-up-m-m-head\"/><use href=\"#pike-push-up-m-m-torso\"/><use href=\"#pike-push-up-m-m-thigh.l\"/><use href=\"#pike-push-up-m-m-kneecap.l\"/><use href=\"#pike-push-up-m-m-shank.l\"/><use href=\"#pike-push-up-m-m-foot.l\"/><use href=\"#pike-push-up-m-m-shcap.l\"/><use href=\"#pike-push-up-m-m-upper.l\"/><use href=\"#pike-push-up-m-m-elbowcap.l\"/><use href=\"#pike-push-up-m-m-fore.l\"/><use href=\"#pike-push-up-m-m-thigh.r\"/><use href=\"#pike-push-up-m-m-kneecap.r\"/><use href=\"#pike-push-up-m-m-shank.r\"/><use href=\"#pike-push-up-m-m-foot.r\"/><use href=\"#pike-push-up-m-m-shcap.r\"/><use href=\"#pike-push-up-m-m-upper.r\"/><use href=\"#pike-push-up-m-m-elbowcap.r\"/><use href=\"#pike-push-up-m-m-fore.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MyzF1PO_1LVP1WgLD7.pL_bRhLAbX2LeT5Ly8P4LHcW5LyqYaLy2HdLy6P7LPgI9LXdPkLBgNgLKjN7LEoK4Lx8Gh\"/><path class=\"m-line\" d=\"~MSKB1PYT1LBkP!1\"/><path class=\"leader m\" d=\"M205.29 299.44L225 330H235\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"pike-push-up-m-head\" data-key=\"head\" data-cue=\"Only your head drops toward the floor, straight down.\" class=\"plate-callout two m\" style=\"left:64.25%;top:86.03%\" aria-pressed=\"true\">Head straight<br>down</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "hips",
        cues: [{ key: "hips", cue: "Keep your legs straight and your hips up in an upside-down V." }, { key: "head", cue: "Move your head forward and down as your elbows bend." }, { key: "floor", cue: "Lower until your head is about an inch from the floor." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "head",
        cues: [{ key: "head", cue: "Only your head drops toward the floor, straight down." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Head straight down</b><span>Only your head drops toward the floor, straight down.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower, press\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>&nbsp;</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>&nbsp;</span></div></div></div>",
      alt: "Pike push-up, side view. Hands and toes on the floor, legs straight and hips high in an upside-down V, the lifter bends the elbows and lowers the head forward and down to just over the floor.",
      mistakeAlt: "Pike Push-Up: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "palm-flat",
    "why": "D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c1 and c10.",
    "orientation": "pronated",
    "handle": "floor",
    "loadAxis": "along-forearm",
    "overBody": false,
    "width": {
      "text": "Hands about shoulder-width apart, or slightly wider.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-pike",
          "ggr-pike",
          "nasm-pike"
        ],
        "note": "c1"
      }
    },
    "thumb": {
      "mode": "beside",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "hand-key-palm-flat"
        ],
        "note": "The card has no thumb line (no bar or handle): the palm-flat key's drawn thumb, beside the index on the floor (view-palm-flat.mjs:52)."
      }
    },
    "contact": "palm-flat",
    "wrist": {
      "exempt": "Palm flat on the floor: the palm-flat key records no wrist range (null).",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "hand-key-palm-flat"
        ],
        "note": "hand-palm-flat.mjs:14 VARIANTS.floor.wristRange null; the card's wrist line (c12) is a handle tip, shown in the wrist feel row"
      }
    },
    "faults": [],
    "gripLine": "Hands about shoulder-width. Spread your fingers for a stable base.",
    "cue": "Hips high, head forward and down."
  },
  contacts: [
    "floor-body"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Start in a push-up position, hands about shoulder-width.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-pike",
          "ggr-pike",
          "nasm-pike"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "brace",
      "text": "Brace and pull your shoulders down and back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-pike",
          "ggr-pike",
          "nasm-pike"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Keep your legs straight and lift your hips into a V.",
      "zoom": "pike",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-pike",
          "ggr-pike"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "position",
      "text": "Walk your hands toward your feet to get more upside down.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-pike",
          "ggr-pike"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "grip",
      "text": "Spread your fingers for a stable base. Squeeze your abs.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-pike"
        ],
        "note": "c10"
      }
    }
  ],
  posture: [
    {
      "key": "hips",
      "label": "Hips high",
      "detail": "Keep your hips up the whole time.",
      "anchor": {
        "pose": "start",
        "at": "hip.r"
      },
      "zoom": "pike",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-pike",
          "ggr-pike",
          "nasm-pike"
        ],
        "note": "c2, c3"
      }
    },
    {
      "key": "elbows",
      "label": "Elbows tucked",
      "detail": "Elbows tucked in, about 45 degrees from your body.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-pike",
          "nasm-pike",
          "ggr-pike"
        ],
        "note": "c3, c7"
      }
    },
    {
      "key": "neck",
      "label": "Neck neutral",
      "detail": "Neck neutral, chin slightly tucked.",
      "anchor": {
        "pose": "start",
        "at": "head"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-pike",
          "ggr-pike",
          "nasm-pike"
        ],
        "note": "c5"
      }
    },
    {
      "key": "head",
      "label": "Head forward",
      "detail": "Move your head forward and down as you bend.",
      "anchor": {
        "pose": "end",
        "at": "head"
      },
      "zoom": "head-path",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-pike",
          "fv-pike",
          "nasm-pike"
        ],
        "note": "c6, c5"
      }
    },
    {
      "key": "floor",
      "label": "Head near floor",
      "detail": "Lower until the head is about an inch from the floor.",
      "anchor": {
        "pose": "end",
        "at": "head"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-pike",
          "nasm-pike"
        ],
        "note": "c3"
      }
    },
    {
      "key": "breathe",
      "label": "Breathe",
      "detail": "Breathe in going down, out going up.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-pike"
        ],
        "note": "c8"
      }
    },
    {
      "key": "abs",
      "label": "Abs tight",
      "detail": "Squeeze your abs to hold the pike.",
      "anchor": {
        "pose": "start",
        "at": "navel"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-pike"
        ],
        "note": "c10"
      }
    }
  ],
  zooms: [
    {
      "key": "head-path",
      "chip": "Head path",
      "heading": "Head path",
      "kind": "posture"
    },
    {
      "key": "pike",
      "chip": "Hips",
      "heading": "Hips high",
      "kind": "posture"
    }
  ],
  chips: [
    "head-path",
    "pike",
    "feel"
  ],
  copy: {
    "setupLine": "Hands about shoulder-width, legs straight, hips lifted into an upside-down V.",
    "mistakeLine": "Never let your elbows flare out. Tuck them in, about 45 degrees from your body.",
    "cueLine": "Hips high, head forward and down."
  },
  mistakes: [
    {
      "key": "flare",
      "title": "Elbows flaring out",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-pike",
          "nasm-pike"
        ],
        "note": "c7"
      },
      "fix": "Tuck your elbows in. Too hard? Go back to standard push-ups."
    },
    {
      "key": "head",
      "title": "Moving only your head down",
      "zoom": "head-path",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-pike",
          "fv-pike",
          "nasm-pike"
        ],
        "note": "c6, c5"
      },
      "fix": "Chin slightly tucked. Move your head forward and down."
    },
    {
      "key": "breath",
      "title": "Holding your breath",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-pike"
        ],
        "note": "c8"
      },
      "fix": "Breathe in going down, out going up."
    }
  ],
  risks: [
    {
      "key": "flare",
      "text": "Elbows flaring out can lead to shoulder injury over time.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-pike",
          "nasm-pike"
        ],
        "note": "c7"
      }
    },
    {
      "key": "breath",
      "text": "Upside down, holding your breath can make you dizzy or light-headed.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-pike"
        ],
        "note": "c8"
      }
    },
    {
      "key": "head",
      "text": "Moving only your head toward the floor raises injury risk.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-pike"
        ],
        "note": "c6"
      }
    }
  ],
  riskFlags: [
    "shoulder",
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
    "fv-pike",
    "ggr-pike",
    "nasm-pike",
    "hand-key-palm-flat",
    "nhs-shoulder-pain",
    "nhs-wrist-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/pike_push_up.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

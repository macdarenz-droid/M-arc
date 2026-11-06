// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=f1ff819e00cdcfb6f1dd61bfa4dc8d8b62ee6fec27ea518f798971cd1639f4b6
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_t_bar_row",
  name: "T-Bar Row",
  hashes: { inputsSha256: "f1ff819e00cdcfb6f1dd61bfa4dc8d8b62ee6fec27ea518f798971cd1639f4b6", golden: "cffdb89723ca066ac7146b964c1c72db1027549666122509257e4ff6e143fa43" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"t-bar-row-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"t-bar-row-n-st-shcap.r\" d=\"~~WYU1SGD1wP10\"/><path id=\"t-bar-row-n-st-upper.r\" d=\"~#F12y-U1UzD1G(U1BxB1P1R8c0K3JN1_3I5!1V2Fa.z1HcIhy2EgV7*jz1BB1x1z3K2z6z8YK191kT8-f)3-gUnX2HmNayr10000000000010000001010001000000000111100210111000000111101002000100002000000210\"/><path id=\"t-bar-row-n-st-elbowcap.r\" d=\"~~PxU1PGO1Dz10\"/><path id=\"t-bar-row-n-st-fore.r\" d=\"~#F12wwU1JDO1EBU1KIN1P2.9k(11NH1F4-8_1z2A3Ov!7xcw1Eb-5GdF2OvK1I2X2K9)6!G1tY1rzaxaX1zcUiI1AhY8Nk00011000021011011000000100000200000100200002002100200010100010101010000020000000\"/><path id=\"t-bar-row-n-st-fist.r\" d=\"~~yIT1w-Y1ww10\"/><path id=\"t-bar-row-n-g0-shcap.r\" d=\"~~PVU1SXB1wP10\"/><path id=\"t-bar-row-n-g0-upper.r\" d=\"~#F12_!U1A(A1OPV1KwA1y5E7a4BnSG1Y5I3!2X1FpOtNiOaY8*dJ1ElPfTz1cE3eV6BrwE195J4X7zdR9BpHe*bAj*1!s00101000000000100001200000000200001100000120000000000000000000200011111210101100\"/><path id=\"t-bar-row-n-g0-elbowcap.r\" d=\"~~WAP1JTK1Dz10\"/><path id=\"t-bar-row-n-g0-fore.r\" d=\"~#F12NAP1A*K1OwP1IzK1pT9D1P1weYB1y1E9y1R2G7zsF3xe)2.a*9OaB8*rz2T1V5I7F7UE19_1z4T8Iae*4UlP4UgJfAg01200000000000101101200002220001002100101100000000100001010002012101101000022001\"/><path id=\"t-bar-row-n-g0-fist.r\" d=\"~~SUS1AHW1ww10\"/><path id=\"t-bar-row-n-g1-shcap.r\" d=\"~~HSU1SBB1wP10\"/><path id=\"t-bar-row-n-g1-upper.r\" d=\"~#F12WwV1JzA1-_V1)Hz1W6*586Gw1Az1P6.1A3z1Pv.mJk)5YbObF6GkNnzvA1z3w2I6Tz1Uv55y6R6TaIc-rF8xgWfO8Wr10101000001010020000010000000000100010000000200002000100000001000010101011010110\"/><path id=\"t-bar-row-n-g1-elbowcap.r\" d=\"~~yIN1FWI1Dz10\"/><path id=\"t-bar-row-n-g1-fore.r\" d=\"~#F12FJN1HAJ1GBN1VII1)1E9J1F1Fiwz12z9mR2IaEqP1IeI4Kazbz9Eb.pE2G1R6O6!bWB11(1B5x8IaJ1G2ymU6(fDhye00020001000020002000000000200001012002000000001011200000000100200200100022000000\"/><path id=\"t-bar-row-n-g1-fist.r\" d=\"~~U_R1H!T1ww10\"/><path id=\"t-bar-row-n-e-thigh.l\" d=\"~#F12UWD1y*F1)DD1)PE1X4-aE1aJjy.1Y3)8U1K4*aBT1w6IpB5Oj.hxj.f.R1T3x3-7*5Uc!!1F19G1VbEx1.3VaDK1D9Wy1Yv_x120000001100101001000000020020000000000010021000000020000020012000002101011210100\"/><path id=\"t-bar-row-n-e-kneecap.l\" d=\"~~_XH1FwU1_J10\"/><path id=\"t-bar-row-n-e-shank.l\" d=\"~#F12JWH1Y!T1V*H1)KS1U2TbH142y)1P6G7y3-3J1*y2J8)cq*bB6Be_8Ky2K2x4G5G8V9H(1E11r.bXdUa)eSnV1WlHbUp00100002000000021001200000200210100120010000220000101010020002001000201010000000\"/><path id=\"t-bar-row-n-e-foot.l\" d=\"~#o2_IH1FB)1E*H1GB(1DcD3(g)7wp*nYV2B3KG2-4OA1*7*m0*E1Y4KaXcYrBb.lSp001011010000000101100000000010001101000101000001\"/><path id=\"t-bar-row-n-e-shcap.l\" d=\"~~DOU1STA1wP10\"/><path id=\"t-bar-row-n-e-upper.l\" d=\"~#F12WDV1HHz1-BW1)Yy1!7x468VE1FqW69J37(z1ReDlvDeI8wbBiwuOo!1-2P3V5xH1Am77P7.4G7Re*sD1GjPb)e!o00000010101000100002200000100110100010100000200020000002100220000021010002001210\"/><path id=\"t-bar-row-n-e-elbowcap.l\" d=\"~~P!J1yIG1Dz10\"/><path id=\"t-bar-row-n-e-fore.l\" d=\"~#F12S(J1w.G1)VJ1GyG1T2I9P1F1PkWy1fI9gT2EcIqkRe-4xaXbO8xdxqI2E1*6E6FeWB14(1V5.7BaJ2rDmJ7Sfyiwd00001100001000010000101000002100220200010100010000100020020010121000001200002002\"/><path id=\"t-bar-row-n-e-fist.l\" d=\"~~H*P1WOR1ww10\"/><path id=\"t-bar-row-n-e-head\" d=\"~#w12Uww2wwA1Bxw2.Iy1EmTfXcEhD1RbG5G2y7z6U9-9yjBlJdN2D9E3G3.i!eAkFa(keylKcWlBjW12021000020001012100002000000000110000000021002002000000000010000\"/><path id=\"t-bar-row-n-e-torso\" d=\"~#_12Uy.1AIz1)R!1OJz1W4RajB3TfPcT4SaRdNfq!5SmE9(3OlK7RbH8Pe(a_iUkFiAlDdJaP2_dIbDsKy1wo)gI4T5.3-4V7FeI7S4U5)dTaIeRlV2E5J7HdWaI7S4*K1KJ202000100110001000000100010100200001010000000200020210100100200000000220000210020020010100000010000100100000011100000\"/><path id=\"t-bar-row-n-e-thigh.r\" d=\"^15\"/><path id=\"t-bar-row-n-e-kneecap.r\" d=\"^16\"/><path id=\"t-bar-row-n-e-shank.r\" d=\"^17\"/><path id=\"t-bar-row-n-e-foot.r\" d=\"^18\"/><path id=\"t-bar-row-n-e-shcap.r\" d=\"^19\"/><path id=\"t-bar-row-n-e-upper.r\" d=\"^20\"/><path id=\"t-bar-row-n-e-elbowcap.r\" d=\"^21\"/><path id=\"t-bar-row-n-e-fore.r\" d=\"^22\"/><path id=\"t-bar-row-n-e-fist.r\" d=\"^23\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#t-bar-row-n-dots)\"/>\n  <path class=\"floorline\" d=\"M20.17 339.5H341.71\"/><path class=\"eq\" d=\"~M(U5YDy2Lww80QA90.W7z9Lz9A9Q0B9z9B9L.W7D9Qz90!W7D9LA9B9Q0A9A9A9Z\"/><path class=\"eq-solid\" d=\"~~P-8YDw2Nr0\"/><path class=\"eq-pin\" d=\"~~WN9YDw2F60\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#t-bar-row-n-st-shcap.r\"/><use href=\"#t-bar-row-n-st-upper.r\"/><use href=\"#t-bar-row-n-st-elbowcap.r\"/><use href=\"#t-bar-row-n-st-fore.r\"/><use href=\"#t-bar-row-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-n-st-shcap.r\"/><use href=\"#t-bar-row-n-st-upper.r\"/><use href=\"#t-bar-row-n-st-elbowcap.r\"/><use href=\"#t-bar-row-n-st-fore.r\"/><use href=\"#t-bar-row-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#t-bar-row-n-g0-shcap.r\"/><use href=\"#t-bar-row-n-g0-upper.r\"/><use href=\"#t-bar-row-n-g0-elbowcap.r\"/><use href=\"#t-bar-row-n-g0-fore.r\"/><use href=\"#t-bar-row-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-n-g0-shcap.r\"/><use href=\"#t-bar-row-n-g0-upper.r\"/><use href=\"#t-bar-row-n-g0-elbowcap.r\"/><use href=\"#t-bar-row-n-g0-fore.r\"/><use href=\"#t-bar-row-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#t-bar-row-n-g1-shcap.r\"/><use href=\"#t-bar-row-n-g1-upper.r\"/><use href=\"#t-bar-row-n-g1-elbowcap.r\"/><use href=\"#t-bar-row-n-g1-fore.r\"/><use href=\"#t-bar-row-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-n-g1-shcap.r\"/><use href=\"#t-bar-row-n-g1-upper.r\"/><use href=\"#t-bar-row-n-g1-elbowcap.r\"/><use href=\"#t-bar-row-n-g1-fore.r\"/><use href=\"#t-bar-row-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#t-bar-row-n-e-thigh.l\"/><use href=\"#t-bar-row-n-e-kneecap.l\"/><use href=\"#t-bar-row-n-e-shank.l\"/><use href=\"#t-bar-row-n-e-foot.l\"/><use href=\"#t-bar-row-n-e-shcap.l\"/><use href=\"#t-bar-row-n-e-upper.l\"/><use href=\"#t-bar-row-n-e-elbowcap.l\"/><use href=\"#t-bar-row-n-e-fore.l\"/><use href=\"#t-bar-row-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-n-e-thigh.l\"/><use href=\"#t-bar-row-n-e-kneecap.l\"/><use href=\"#t-bar-row-n-e-shank.l\"/><use href=\"#t-bar-row-n-e-foot.l\"/><use href=\"#t-bar-row-n-e-shcap.l\"/><use href=\"#t-bar-row-n-e-upper.l\"/><use href=\"#t-bar-row-n-e-elbowcap.l\"/><use href=\"#t-bar-row-n-e-fore.l\"/><use href=\"#t-bar-row-n-e-fist.l\"/></g></g><path class=\"eq\" d=\"~M!O9w.)1LywN1O(jL.VK1wWkLEHN1wEjZ\"/><path class=\"eq\" d=\"~M(IX1HTI1LFVb*x5Lxzb!I6LKEcwY3Z\"/><path class=\"eq-solid\" d=\"~M(TW1wBG1LwqEbL(Y1NH6L*J3.T5Z\"/><path class=\"eq-line m-line\" d=\"~M(U9YDw2LUA*1ESe\"/><path class=\"eq-line m-line\" d=\"~MS(-1HIR1LSrR6LYkHR6L.I2zA6LXkKR6\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#t-bar-row-n-e-head\"/><use href=\"#t-bar-row-n-e-torso\"/><use href=\"#t-bar-row-n-e-thigh.r\"/><use href=\"#t-bar-row-n-e-kneecap.r\"/><use href=\"#t-bar-row-n-e-shank.r\"/><use href=\"#t-bar-row-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-n-e-head\"/><use href=\"#t-bar-row-n-e-torso\"/><use href=\"#t-bar-row-n-e-thigh.r\"/><use href=\"#t-bar-row-n-e-kneecap.r\"/><use href=\"#t-bar-row-n-e-shank.r\"/><use href=\"#t-bar-row-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~MWzS1WOR1L0OB2LXcPB2LYcPB2Z\"/><path class=\"eq-solid\" d=\"~M!RP1!TS1L_y3TO1LXN3(mL.W2HF2Z\"/><path class=\"eq\" d=\"~MUOS1(XN1C0G2K11e5C21G1kabC10ru4dC11dJ10fC001N15dC01eH1b9C00uy1d5C11J1kf0C00N12d4C11H1d9aC01y1t3eC02kK10eC002I14gC12dG1aaC11tre4C21I1dg0Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#t-bar-row-n-e-shcap.r\"/><use href=\"#t-bar-row-n-e-upper.r\"/><use href=\"#t-bar-row-n-e-elbowcap.r\"/><use href=\"#t-bar-row-n-e-fore.r\"/><use href=\"#t-bar-row-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-n-e-shcap.r\"/><use href=\"#t-bar-row-n-e-upper.r\"/><use href=\"#t-bar-row-n-e-elbowcap.r\"/><use href=\"#t-bar-row-n-e-fore.r\"/><use href=\"#t-bar-row-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"276.35\" cy=\"187.45\" r=\"2.25\"/><circle class=\"joint\" cx=\"235.47\" cy=\"211.69\" r=\"2.25\"/><circle class=\"joint\" cx=\"210.06\" cy=\"206.29\" r=\"2.25\"/><circle class=\"joint\" cx=\"226.02\" cy=\"266.28\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#F10YYT1!YW1z_T1-*W112211020102010201020f6210211200211200200121000011011000110100000101000001210020010000121000011010120000011010020000000\"/><path class=\"arrow\" d=\"~MJIS1PUS1L(uJsL*x2)eZ\"/></g><path class=\"leader\" d=\"~MYyT1wUy1L0)A4\"/><circle class=\"anchor\" cx=\"261.56\" cy=\"177.28\" r=\"1.5\"/><path class=\"leader\" d=\"M226.02 266.28L243 326H253\"/><circle class=\"anchor\" cx=\"226.02\" cy=\"266.28\" r=\"1.5\"/><path class=\"leader\" d=\"M235.47 211.69L205.5 236H195.5\"/><circle class=\"anchor\" cx=\"235.47\" cy=\"211.69\" r=\"1.5\"/>\n<g class=\"plate-zoom\" data-view=\"normal\" data-k=\"1.5\" data-c=\"200 126\" data-src=\"261.79 272.05\"><defs><clipPath id=\"t-bar-row-n-zclip\"><circle cx=\"200\" cy=\"126\" r=\"52\"/></clipPath></defs><circle class=\"pz-src\" cx=\"261.79\" cy=\"272.05\" r=\"34.67\"/><path class=\"pz-link\" d=\"~MYOP1_!N1LzO5)*c\"/><circle class=\"pz-bg\" cx=\"200\" cy=\"126\" r=\"52\"/><g class=\"pz-in\" clip-path=\"url(#t-bar-row-n-zclip)\">\n  <defs><pattern id=\"t-bar-row-n-z-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"t-bar-row-n-z-st-shcap.r\" d=\"~~YPG1HI2wF20\"/><path id=\"t-bar-row-n-z-st-upper.r\" d=\"~#F12HRG1Jy2B-G1VeH2*ce2z5SB2!5)7U2z4NfXV1NixqA3OoObVtX1)X1R1R4V3E9zcWA2f3u)cVn.5EpJz1z4Px1UfPF102000010100000020001100000010020000200110000000000010101000002200010010002000120\"/><path id=\"t-bar-row-n-z-st-elbowcap.r\" d=\"~~(KF1D.f_U10\"/><path id=\"t-bar-row-n-z-st-fore.r\" d=\"~#F12YIF1PWfVTF1xNe!3-es!23S)1N6zdW2z3W4EO1_bEiP1XgV8*jH3IO1x2R3B4)dRaW(1I1U2G1zf)eV2BiwsE2WpHdSu00010000100111101002001100101120020001100020020002001000020000002000001000210002\"/><path id=\"t-bar-row-n-z-st-fist.r\" d=\"~~HJE1PyuwP10\"/><path id=\"t-bar-row-n-z-g0-shcap.r\" d=\"~~wJG1HP1wF20\"/><path id=\"t-bar-row-n-z-g0-upper.r\" d=\"M213.6 1.62C211.45 3.69 210.24 6.67 208.87 8.75C207.49 10.84 206.52 12.33 205.36 14.13C204.21 15.93 204 16.08 201.92 19.54C199.85 23.01 195.69 29.94 192.92 34.93C190.15 39.93 187.73 44.72 185.31 49.51C182.89 54.31 179.68 60.14 178.38 63.68C177.08 67.22 177.05 68.82 177.5 70.76C177.95 72.7 179.52 74.36 181.06 75.32C182.59 76.28 184.77 76.97 186.71 76.53C188.65 76.08 190.08 75.36 192.7 72.64C195.32 69.92 199.16 64.49 202.41 60.22C205.66 55.94 208.92 51.68 212.2 47C215.48 42.33 219.89 35.56 222.1 32.18C224.32 28.79 224.36 28.54 225.47 26.72C226.59 24.89 227.5 23.36 228.78 21.21C230.05 19.07 232.2 16.68 233.13 13.84C234.05 11 234.93 6.83 234.32 4.18C233.71 1.53 231.57 -0.72 229.47 -2.03C227.38 -3.34 224.41 -4.29 221.77 -3.68C219.12 -3.07 215.75 -0.45 213.6 1.62Z\"/><path id=\"t-bar-row-n-z-g0-elbowcap.r\" d=\"~~_Sy1wHd_U10\"/><path id=\"t-bar-row-n-z-g0-fore.r\" d=\"~#F12JSy1UYdIJy1)RcI1Ie_1A2wlWY1Y1.dJ1-3-aBH1_4BlO4Eg)eXfzc.G1E3K2R8zb!aN.1b_2E6xdRfmK7Pw1_6(ownAo00120010000020000010000020000000000000210000101000100000202101010100001010000000\"/><path id=\"t-bar-row-n-z-g0-fist.r\" d=\"~~SHD1AJqwP10\"/><path id=\"t-bar-row-n-z-g1-shcap.r\" d=\"~~FEG1HlwF20\"/><path id=\"t-bar-row-n-z-g1-upper.r\" d=\"M214.52 -4.8C211.94 -3.28 210.07 -0.66 208.25 1.05C206.43 2.76 205.14 3.99 203.59 5.47C202.04 6.96 201.81 7.05 198.98 9.95C196.15 12.85 190.49 18.63 186.63 22.85C182.77 27.07 179.3 31.19 175.82 35.29C172.35 39.39 167.87 44.33 165.77 47.48C163.68 50.62 163.29 52.18 163.28 54.17C163.26 56.16 164.41 58.13 165.68 59.42C166.95 60.71 168.9 61.89 170.9 61.91C172.89 61.92 174.45 61.56 177.63 59.52C180.8 57.48 185.81 53.08 189.97 49.67C194.13 46.26 198.3 42.86 202.58 39.07C206.87 35.27 212.74 29.7 215.68 26.92C218.62 24.14 218.72 23.9 220.23 22.38C221.74 20.86 222.99 19.59 224.73 17.79C226.47 16 229.12 14.17 230.68 11.62C232.24 9.07 234.06 5.21 234.08 2.5C234.11 -0.22 232.54 -2.91 230.81 -4.67C229.08 -6.43 226.41 -8.04 223.7 -8.06C220.98 -8.08 217.09 -6.32 214.52 -4.8Z\"/><path id=\"t-bar-row-n-z-g1-elbowcap.r\" d=\"~~H!vJNa_U10\"/><path id=\"t-bar-row-n-z-g1-fore.r\" d=\"~#F12A(vNzbXTvO(9*2*dy2(1HrSU14Xdw1.3OfGE1D2TlO6RfXgXd-g-D1K3)1X9X9WhUY11Y2V7*bVfw2I3Ax1(9!nYpyl00000000001012220000010101001000000000111100010100100200002000020001000120010002\"/><path id=\"t-bar-row-n-z-g1-fist.r\" d=\"~~WzB1NXmwP10\"/><path id=\"t-bar-row-n-z-e-thigh.l\" d=\"~#F12WKkSF6EWjOD4B7BgX1e(sWY2W5RdP2T6Og-J2y9xD1.7GtVqRs.nXH2K5R4Vb)8!iJ.2!1f*1Rh.R1X5xgWz2!dyU1SO1_S100011001001010000020020021010000100000000000010110100000001000002001000121000000\"/><path id=\"t-bar-row-n-z-e-kneecap.l\" d=\"~~POqJ*mDz20\"/><path id=\"t-bar-row-n-z-e-shank.l\" d=\"~#F12HKqyYmIYq*RkA4Ih!122Y(2_9BbS4O5y2OA3PcOjJ1*hI9ElDdTz3T3z6)7OcOeP*2.11G1.hRk(fTmNz1O2Nw1yhND110022001010002111002000000002000000001110000022001000102000000100000000001200000\"/><path id=\"t-bar-row-n-z-e-foot.l\" d=\"~#o2N*p_UE1TXq*AD1Hi!4PpxcJB1.z1Uw4-4xN3B7.W1)bIy12-.1A7XfzjWG1-g.w1JD1000022010000101001001100010000000000000000020010\"/><path id=\"t-bar-row-n-z-e-shcap.l\" d=\"M210.32 -0.91a11.52 11.52 0 1 0 23.04 0a11.52 11.52 0 1 0 -23.04 0Z\"/><path id=\"t-bar-row-n-z-e-upper.l\" d=\"M215.96 -10.82C213.1 -9.97 210.66 -7.88 208.49 -6.65C206.31 -5.43 204.76 -4.55 202.91 -3.48C201.06 -2.41 200.8 -2.37 197.37 -0.24C193.94 1.89 187.06 6.13 182.31 9.3C177.56 12.47 173.22 15.62 168.87 18.77C164.52 21.92 159 25.63 156.22 28.18C153.44 30.73 152.68 32.15 152.19 34.08C151.7 36 152.34 38.2 153.26 39.75C154.18 41.31 155.8 42.92 157.73 43.42C159.66 43.91 161.26 43.93 164.84 42.71C168.41 41.5 174.31 38.43 179.16 36.12C184.01 33.81 188.86 31.52 193.92 28.87C198.98 26.22 206 22.22 209.52 20.23C213.03 18.24 213.19 18.04 215.01 16.93C216.84 15.81 218.35 14.88 220.47 13.55C222.59 12.23 225.59 11.1 227.71 9C229.84 6.9 232.53 3.59 233.2 0.96C233.88 -1.68 233.01 -4.67 231.75 -6.79C230.49 -8.91 228.28 -11.11 225.65 -11.78C223.02 -12.46 218.82 -11.68 215.96 -10.82Z\"/><path id=\"t-bar-row-n-z-e-elbowcap.l\" d=\"~~PWtS*6_U10\"/><path id=\"t-bar-row-n-z-e-fore.l\" d=\"~#F12S-tPV7XJtRP6.3*dD2!1_u(T1p*dq)3IiTE1uVlG7BfRh-cRjxE1T3-1IaI9NlPY12!2O8XbBfS3K1Fx1DbFnwrWj00000002001000000000000000000000010000010000000200000012100000000001000000002000\"/><path id=\"t-bar-row-n-z-e-fist.l\" d=\"~~WXz1PAjwP10\"/><path id=\"t-bar-row-n-z-e-head\" d=\"M299 -5.61C299.34 -2.16 299.8 3.35 298.86 6.9C297.93 10.44 295.72 13.43 293.39 15.66C291.05 17.89 287.64 19.21 284.85 20.29C282.05 21.36 279.55 21.61 276.59 22.13C273.63 22.65 269.96 23.24 267.07 23.42C264.18 23.61 261.46 23.69 259.24 23.24C257.02 22.79 254.8 22.4 253.72 20.7C252.65 19.01 252.55 15.52 252.77 13.07C252.99 10.63 253.91 8.52 255.04 6.05C256.16 3.57 258.15 1.6 259.51 -1.76C260.87 -5.12 261.36 -10.8 263.18 -14.11C265 -17.42 267.61 -19.96 270.44 -21.63C273.26 -23.29 276.88 -24.13 280.14 -24.12C283.39 -24.1 287.17 -23.28 289.95 -21.56C292.72 -19.84 295.26 -16.45 296.77 -13.79C298.28 -11.13 298.65 -9.05 299 -5.61Z\"/><path id=\"t-bar-row-n-z-e-torso\" d=\"M261.07 -10.62C258.57 -14.08 253.31 -10.42 249.7 -10.95C246.1 -11.49 242.89 -12.74 239.45 -13.82C236.01 -14.9 233.15 -16.74 229.06 -17.45C224.97 -18.16 219.81 -18.29 214.91 -18.07C210.01 -17.86 205.28 -17.42 199.65 -16.16C194.02 -14.91 187.28 -12.67 181.14 -10.56C175.01 -8.45 168.03 -5.5 162.83 -3.53C157.63 -1.56 154.07 0.52 149.93 1.26C145.79 2 142.25 1.48 137.97 0.9C133.69 0.31 128.49 -1.78 124.24 -2.24C120 -2.71 115.98 -2.76 112.5 -1.89C109.02 -1.03 105.59 0.62 103.37 2.97C101.16 5.32 99.75 8.6 99.2 12.21C98.66 15.82 99.38 20.38 100.1 24.62C100.81 28.85 101.81 33.75 103.49 37.63C105.18 41.51 106.84 45.85 110.2 47.9C113.56 49.95 118.22 49.92 123.67 49.91C129.12 49.9 136.66 48.76 142.9 47.84C149.13 46.92 155.18 45.74 161.08 44.41C166.99 43.08 172.89 40.8 178.33 39.85C183.77 38.89 188.89 38.9 193.73 38.69C198.56 38.49 202.59 39.21 207.36 38.63C212.13 38.05 217.78 36.92 222.36 35.2C226.93 33.49 231.51 30.73 234.79 28.33C238.07 25.93 239.84 23.02 242.05 20.81C244.26 18.6 245.52 16.56 248.05 15.08C250.58 13.59 254.47 12.77 257.24 11.9C260.01 11.02 264.03 13.56 264.67 9.81C265.31 6.05 263.56 -7.16 261.07 -10.62Z\"/><path id=\"t-bar-row-n-z-e-thigh.r\" d=\"^59\"/><path id=\"t-bar-row-n-z-e-kneecap.r\" d=\"^60\"/><path id=\"t-bar-row-n-z-e-shank.r\" d=\"^61\"/><path id=\"t-bar-row-n-z-e-foot.r\" d=\"^62\"/><path id=\"t-bar-row-n-z-e-shcap.r\" d=\"^63\"/><path id=\"t-bar-row-n-z-e-upper.r\" d=\"^64\"/><path id=\"t-bar-row-n-z-e-elbowcap.r\" d=\"^65\"/><path id=\"t-bar-row-n-z-e-fore.r\" d=\"^66\"/><path id=\"t-bar-row-n-z-e-fist.r\" d=\"^67\"/></defs>\n  \n  <path class=\"floorline\" d=\"M-162.43 226.92H319.89\"/><path class=\"eq\" d=\"M-149.46 226.42L-87.63 226.42Q-85.63 226.42 -85.63 224.42L-85.63 224.03Q-85.63 222.03 -87.63 222.03L-149.46 222.03Q-151.46 222.03 -151.46 224.03L-151.46 224.42Q-151.46 226.42 -149.46 226.42Z\"/><path class=\"eq-solid\" d=\"M-125.13 211.06a6.58 6.58 0 1 0 13.17 0a6.58 6.58 0 1 0 -13.17 0Z\"/><path class=\"eq-pin\" d=\"M-119.55 211.06a1 1 0 1 0 2 0a1 1 0 1 0 -2 0Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#t-bar-row-n-z-st-shcap.r\"/><use href=\"#t-bar-row-n-z-st-upper.r\"/><use href=\"#t-bar-row-n-z-st-elbowcap.r\"/><use href=\"#t-bar-row-n-z-st-fore.r\"/><use href=\"#t-bar-row-n-z-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-n-z-st-shcap.r\"/><use href=\"#t-bar-row-n-z-st-upper.r\"/><use href=\"#t-bar-row-n-z-st-elbowcap.r\"/><use href=\"#t-bar-row-n-z-st-fore.r\"/><use href=\"#t-bar-row-n-z-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#t-bar-row-n-z-g0-shcap.r\"/><use href=\"#t-bar-row-n-z-g0-upper.r\"/><use href=\"#t-bar-row-n-z-g0-elbowcap.r\"/><use href=\"#t-bar-row-n-z-g0-fore.r\"/><use href=\"#t-bar-row-n-z-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-n-z-g0-shcap.r\"/><use href=\"#t-bar-row-n-z-g0-upper.r\"/><use href=\"#t-bar-row-n-z-g0-elbowcap.r\"/><use href=\"#t-bar-row-n-z-g0-fore.r\"/><use href=\"#t-bar-row-n-z-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#t-bar-row-n-z-g1-shcap.r\"/><use href=\"#t-bar-row-n-z-g1-upper.r\"/><use href=\"#t-bar-row-n-z-g1-elbowcap.r\"/><use href=\"#t-bar-row-n-z-g1-fore.r\"/><use href=\"#t-bar-row-n-z-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-n-z-g1-shcap.r\"/><use href=\"#t-bar-row-n-z-g1-upper.r\"/><use href=\"#t-bar-row-n-z-g1-elbowcap.r\"/><use href=\"#t-bar-row-n-z-g1-fore.r\"/><use href=\"#t-bar-row-n-z-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#t-bar-row-n-z-e-thigh.l\"/><use href=\"#t-bar-row-n-z-e-kneecap.l\"/><use href=\"#t-bar-row-n-z-e-shank.l\"/><use href=\"#t-bar-row-n-z-e-foot.l\"/><use href=\"#t-bar-row-n-z-e-shcap.l\"/><use href=\"#t-bar-row-n-z-e-upper.l\"/><use href=\"#t-bar-row-n-z-e-elbowcap.l\"/><use href=\"#t-bar-row-n-z-e-fore.l\"/><use href=\"#t-bar-row-n-z-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-n-z-e-thigh.l\"/><use href=\"#t-bar-row-n-z-e-kneecap.l\"/><use href=\"#t-bar-row-n-z-e-shank.l\"/><use href=\"#t-bar-row-n-z-e-foot.l\"/><use href=\"#t-bar-row-n-z-e-shcap.l\"/><use href=\"#t-bar-row-n-z-e-upper.l\"/><use href=\"#t-bar-row-n-z-e-elbowcap.l\"/><use href=\"#t-bar-row-n-z-e-fore.l\"/><use href=\"#t-bar-row-n-z-e-fist.l\"/></g></g><path class=\"eq\" d=\"M-119.77 208.24L233.54 55L235.98 60.63L-117.32 213.88Z\"/><path class=\"eq\" d=\"~MUKK1!GaL!Oh-S7LRUgWR9LEIiwU5Z\"/><path class=\"eq-solid\" d=\"~MUGJ1NU6LwE1*gLNV2_O9LKz5*K8Z\"/><path class=\"eq-line m-line\" d=\"M-118.55 211.06L351.06 99.16\"/><path class=\"eq-line m-line\" d=\"~MSGR1(*iLJG1.9Lyvy_9LXR3GD9LBvx_9\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#t-bar-row-n-z-e-head\"/><use href=\"#t-bar-row-n-z-e-torso\"/><use href=\"#t-bar-row-n-z-e-thigh.r\"/><use href=\"#t-bar-row-n-z-e-kneecap.r\"/><use href=\"#t-bar-row-n-z-e-shank.r\"/><use href=\"#t-bar-row-n-z-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-n-z-e-head\"/><use href=\"#t-bar-row-n-z-e-torso\"/><use href=\"#t-bar-row-n-z-e-thigh.r\"/><use href=\"#t-bar-row-n-z-e-kneecap.r\"/><use href=\"#t-bar-row-n-z-e-shank.r\"/><use href=\"#t-bar-row-n-z-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~MHRB1PAjL0BF3LBjDF3LDjDF3Z\"/><path class=\"eq-solid\" d=\"~MPDz1Y_kLFU4KE2LzD5Jy1LIy4PJ3Z\"/><path class=\"eq\" d=\"~#w12AzD1!wfBBD1IIf.3S1)2w3R1!30A4U1!3(2w3_3S1F40_3T1(2*2U1-30E4R1-3)2*2.3T10001101002022000000022021010110000101111002000000020000011110000\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#t-bar-row-n-z-e-shcap.r\"/><use href=\"#t-bar-row-n-z-e-upper.r\"/><use href=\"#t-bar-row-n-z-e-elbowcap.r\"/><use href=\"#t-bar-row-n-z-e-fore.r\"/><use href=\"#t-bar-row-n-z-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-n-z-e-shcap.r\"/><use href=\"#t-bar-row-n-z-e-upper.r\"/><use href=\"#t-bar-row-n-z-e-elbowcap.r\"/><use href=\"#t-bar-row-n-z-e-fore.r\"/><use href=\"#t-bar-row-n-z-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"221.84\" cy=\"-0.91\" r=\"2.25\"/><circle class=\"joint\" cx=\"160.53\" cy=\"35.45\" r=\"2.25\"/><circle class=\"joint\" cx=\"122.4\" cy=\"27.35\" r=\"2.25\"/><circle class=\"joint\" cx=\"146.35\" cy=\"117.34\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#_10HGF1!)rKIF1EEs2011020021120001221001022112j60000000000000002010000000002220001110000020021010010000001012000001101010000210100100000100012000200020002000200020002000001000100010001000100\"/><path class=\"arrow\" d=\"~M_VB1HGkL!uJsL.x2)eZ\"/></g>\n</g><circle class=\"pz-ring\" cx=\"200\" cy=\"126\" r=\"52\"/></g></svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"t-bar-row-n-chest\" data-key=\"chest\" data-cue=\"Keep your back straight and your chest level with the floor.\" class=\"plate-callout two\" style=\"left:72.07%;top:32.4%\" aria-pressed=\"true\">Chest<br>parallel</button><button type=\"button\" id=\"t-bar-row-n-knees\" data-key=\"knees\" data-cue=\"Keep your knees slightly bent and your hips hinged back.\" class=\"plate-callout\" style=\"left:69.27%;top:84.92%\" aria-pressed=\"false\">Soft knees</button><button type=\"button\" id=\"t-bar-row-n-elbows\" data-key=\"elbows\" data-cue=\"Drive your elbows back and pull the handle to your lower chest.\" class=\"plate-callout two\" style=\"left:38.55%;top:59.78%\" aria-pressed=\"false\">Elbows<br>back</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"t-bar-row-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"t-bar-row-m-st-shcap.r\" d=\"^0\"/><path id=\"t-bar-row-m-st-upper.r\" d=\"^1\"/><path id=\"t-bar-row-m-st-elbowcap.r\" d=\"^2\"/><path id=\"t-bar-row-m-st-fore.r\" d=\"^3\"/><path id=\"t-bar-row-m-st-fist.r\" d=\"^4\"/><path id=\"t-bar-row-m-g0-shcap.r\" d=\"^5\"/><path id=\"t-bar-row-m-g0-upper.r\" d=\"^6\"/><path id=\"t-bar-row-m-g0-elbowcap.r\" d=\"^7\"/><path id=\"t-bar-row-m-g0-fore.r\" d=\"^8\"/><path id=\"t-bar-row-m-g0-fist.r\" d=\"^9\"/><path id=\"t-bar-row-m-g1-shcap.r\" d=\"^10\"/><path id=\"t-bar-row-m-g1-upper.r\" d=\"^11\"/><path id=\"t-bar-row-m-g1-elbowcap.r\" d=\"^12\"/><path id=\"t-bar-row-m-g1-fore.r\" d=\"^13\"/><path id=\"t-bar-row-m-g1-fist.r\" d=\"^14\"/><path id=\"t-bar-row-m-e-thigh.l\" d=\"^15\"/><path id=\"t-bar-row-m-e-kneecap.l\" d=\"^16\"/><path id=\"t-bar-row-m-e-shank.l\" d=\"^17\"/><path id=\"t-bar-row-m-e-foot.l\" d=\"^18\"/><path id=\"t-bar-row-m-e-shcap.l\" d=\"^19\"/><path id=\"t-bar-row-m-e-upper.l\" d=\"^20\"/><path id=\"t-bar-row-m-e-elbowcap.l\" d=\"^21\"/><path id=\"t-bar-row-m-e-fore.l\" d=\"^22\"/><path id=\"t-bar-row-m-e-fist.l\" d=\"^23\"/><path id=\"t-bar-row-m-e-head\" d=\"^24\"/><path id=\"t-bar-row-m-e-torso\" d=\"^25\"/><path id=\"t-bar-row-m-e-thigh.r\" d=\"^15\"/><path id=\"t-bar-row-m-e-kneecap.r\" d=\"^16\"/><path id=\"t-bar-row-m-e-shank.r\" d=\"^17\"/><path id=\"t-bar-row-m-e-foot.r\" d=\"^18\"/><path id=\"t-bar-row-m-e-shcap.r\" d=\"^19\"/><path id=\"t-bar-row-m-e-upper.r\" d=\"^20\"/><path id=\"t-bar-row-m-e-elbowcap.r\" d=\"^21\"/><path id=\"t-bar-row-m-e-fore.r\" d=\"^22\"/><path id=\"t-bar-row-m-e-fist.r\" d=\"^23\"/><path id=\"t-bar-row-m-m-head\" d=\"~#w12yx(1JYA1)E(1XAz1zkziTaViU2Ib)4*2_7E5WaR8PlViwdy4S9x2x1BjJcYlS7ymz2(k*eykEjl0002001000000101010021101000220000000000000000000000020000010000\"/><path id=\"t-bar-row-m-m-torso\" d=\"~#_12YD-1NPz1TV_1TXz1(5.95E3xhSa.5(9GfSdO4P2HrD7YaF2EaI8JeJ8(i!a(qP5!oqHa)2D6-gF7-I1Fc-q*E1Na-g_Y1(X1Vg-7W3H7Ed-8RfzlE5x6W6!bDc.7U3EA1IR200000201000200000000100010121000000000100100001010011110101010002200010010100001010000010001100010100000101002000000\"/><path id=\"t-bar-row-m-m-shcap.l\" d=\"~~SOS1UAA1wP10\"/><path id=\"t-bar-row-m-m-upper.l\" d=\"~#F12yBT1U!y1EzU1XGy1U7R468ED1FsW6lH3byz1IgDl)1Yd)8ya-iYs.pU1.2H3*5)F1Fo39D7E5)7ze.sU2ViNcXdPp00110100202000010102001010000002000101001000112100100020000000000200010020000001\"/><path id=\"t-bar-row-m-m-elbowcap.l\" d=\"~~(AI1JFG1Dz10\"/><path id=\"t-bar-row-m-m-fore.l\" d=\"~#F12FHI1_*G1R*H1.DG1z4X8U1uHq_uz2x90X2VgBo.1IeR6x9*cK6OhVnR2n*7x5Uk(y1e_1*6X6R9A4!2Amwa(dwk_900200001000000000011000101000000022000011100020000000000010002001000020121002000\"/><path id=\"t-bar-row-m-m-fist.l\" d=\"~~NRP1AVP1ww10\"/><path id=\"t-bar-row-m-m-shcap.r\" d=\"^86\"/><path id=\"t-bar-row-m-m-upper.r\" d=\"^87\"/><path id=\"t-bar-row-m-m-elbowcap.r\" d=\"^88\"/><path id=\"t-bar-row-m-m-fore.r\" d=\"^89\"/><path id=\"t-bar-row-m-m-fist.r\" d=\"^90\"/><path id=\"t-bar-row-m-m-eq0\" d=\"~MUO9A.)1LPSK1.!kL.EK1AUlLz*K1UBkZ\"/><path id=\"t-bar-row-m-m-eq1\" d=\"~M(*W1yVH1L_RbRG5LX(aAT6L.Acww4Z\"/><path id=\"t-bar-row-m-m-eq2\" d=\"~MHAW1HEF1LYp-bLA*1HG6LTP3VR5Z\"/><path id=\"t-bar-row-m-m-eq3\" d=\"~M_XR1AVP1L0OB2LXcPB2LYcPB2Z\"/><path id=\"t-bar-row-m-m-eq4\" d=\"~M_JP1DwS1LF-2-)1LEG3PG1LBG2AW2Z\"/><path id=\"t-bar-row-m-m-eq5\" d=\"~MYzS1H*K1C0G2K11e3C22G1ea9C02x1u6dC20jF10dC001J13dC20eH199C22usd3C02F1ed0C02J13d6C02H1j9cC22sx13cC21eE10eC002I16eC21jB1ccC02tx1e6C22I1jg2Z\"/><path id=\"t-bar-row-m-mf-thigh.l\" d=\"^15\"/><path id=\"t-bar-row-m-mf-kneecap.l\" d=\"^16\"/><path id=\"t-bar-row-m-mf-shank.l\" d=\"^17\"/><path id=\"t-bar-row-m-mf-foot.l\" d=\"^18\"/><path id=\"t-bar-row-m-mf-thigh.r\" d=\"^15\"/><path id=\"t-bar-row-m-mf-kneecap.r\" d=\"^16\"/><path id=\"t-bar-row-m-mf-shank.r\" d=\"^17\"/><path id=\"t-bar-row-m-mf-foot.r\" d=\"^18\"/><path id=\"t-bar-row-m-mo-0\" d=\"^24\"/><path id=\"t-bar-row-m-mo-1\" d=\"^25\"/><path id=\"t-bar-row-m-mo-2\" d=\"^15\"/><path id=\"t-bar-row-m-mo-3\" d=\"^16\"/><path id=\"t-bar-row-m-mo-4\" d=\"^17\"/><path id=\"t-bar-row-m-mo-5\" d=\"^18\"/><path id=\"t-bar-row-m-mo-6\" d=\"^19\"/><path id=\"t-bar-row-m-mo-7\" d=\"^20\"/><path id=\"t-bar-row-m-mo-8\" d=\"^21\"/><path id=\"t-bar-row-m-mo-9\" d=\"^22\"/><path id=\"t-bar-row-m-mo-10\" d=\"^23\"/><path id=\"t-bar-row-m-mo-11\" d=\"^15\"/><path id=\"t-bar-row-m-mo-12\" d=\"^16\"/><path id=\"t-bar-row-m-mo-13\" d=\"^17\"/><path id=\"t-bar-row-m-mo-14\" d=\"^18\"/><path id=\"t-bar-row-m-mo-15\" d=\"^19\"/><path id=\"t-bar-row-m-mo-16\" d=\"^20\"/><path id=\"t-bar-row-m-mo-17\" d=\"^21\"/><path id=\"t-bar-row-m-mo-18\" d=\"^22\"/><path id=\"t-bar-row-m-mo-19\" d=\"^23\"/><path id=\"t-bar-row-m-mo-20\" d=\"^27\"/><path id=\"t-bar-row-m-mo-21\" d=\"^28\"/><path id=\"t-bar-row-m-mo-22\" d=\"^29\"/><path id=\"t-bar-row-m-mo-23\" d=\"^30\"/><path id=\"t-bar-row-m-mo-24\" d=\"^31\"/><path id=\"t-bar-row-m-mo-25\" d=\"^32\"/><path id=\"t-bar-row-m-mo-26\" d=\"^35\"/><path id=\"t-bar-row-m-mo-27\" d=\"^36\"/><path id=\"t-bar-row-m-mo-28\" d=\"^37\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#t-bar-row-m-dots)\"/>\n  <path class=\"floorline\" d=\"^26\"/><path class=\"eq\" d=\"^27\"/><path class=\"eq-solid\" d=\"^28\"/><path class=\"eq-pin\" d=\"^29\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#t-bar-row-m-st-shcap.r\"/><use href=\"#t-bar-row-m-st-upper.r\"/><use href=\"#t-bar-row-m-st-elbowcap.r\"/><use href=\"#t-bar-row-m-st-fore.r\"/><use href=\"#t-bar-row-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-m-st-shcap.r\"/><use href=\"#t-bar-row-m-st-upper.r\"/><use href=\"#t-bar-row-m-st-elbowcap.r\"/><use href=\"#t-bar-row-m-st-fore.r\"/><use href=\"#t-bar-row-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#t-bar-row-m-g0-shcap.r\"/><use href=\"#t-bar-row-m-g0-upper.r\"/><use href=\"#t-bar-row-m-g0-elbowcap.r\"/><use href=\"#t-bar-row-m-g0-fore.r\"/><use href=\"#t-bar-row-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-m-g0-shcap.r\"/><use href=\"#t-bar-row-m-g0-upper.r\"/><use href=\"#t-bar-row-m-g0-elbowcap.r\"/><use href=\"#t-bar-row-m-g0-fore.r\"/><use href=\"#t-bar-row-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#t-bar-row-m-g1-shcap.r\"/><use href=\"#t-bar-row-m-g1-upper.r\"/><use href=\"#t-bar-row-m-g1-elbowcap.r\"/><use href=\"#t-bar-row-m-g1-fore.r\"/><use href=\"#t-bar-row-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-m-g1-shcap.r\"/><use href=\"#t-bar-row-m-g1-upper.r\"/><use href=\"#t-bar-row-m-g1-elbowcap.r\"/><use href=\"#t-bar-row-m-g1-fore.r\"/><use href=\"#t-bar-row-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#t-bar-row-m-e-thigh.l\"/><use href=\"#t-bar-row-m-e-kneecap.l\"/><use href=\"#t-bar-row-m-e-shank.l\"/><use href=\"#t-bar-row-m-e-foot.l\"/><use href=\"#t-bar-row-m-e-shcap.l\"/><use href=\"#t-bar-row-m-e-upper.l\"/><use href=\"#t-bar-row-m-e-elbowcap.l\"/><use href=\"#t-bar-row-m-e-fore.l\"/><use href=\"#t-bar-row-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-m-e-thigh.l\"/><use href=\"#t-bar-row-m-e-kneecap.l\"/><use href=\"#t-bar-row-m-e-shank.l\"/><use href=\"#t-bar-row-m-e-foot.l\"/><use href=\"#t-bar-row-m-e-shcap.l\"/><use href=\"#t-bar-row-m-e-upper.l\"/><use href=\"#t-bar-row-m-e-elbowcap.l\"/><use href=\"#t-bar-row-m-e-fore.l\"/><use href=\"#t-bar-row-m-e-fist.l\"/></g></g><path class=\"eq\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq-solid\" d=\"^32\"/><path class=\"eq-line m-line\" d=\"^33\"/><path class=\"eq-line m-line\" d=\"^34\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#t-bar-row-m-e-head\"/><use href=\"#t-bar-row-m-e-torso\"/><use href=\"#t-bar-row-m-e-thigh.r\"/><use href=\"#t-bar-row-m-e-kneecap.r\"/><use href=\"#t-bar-row-m-e-shank.r\"/><use href=\"#t-bar-row-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-m-e-head\"/><use href=\"#t-bar-row-m-e-torso\"/><use href=\"#t-bar-row-m-e-thigh.r\"/><use href=\"#t-bar-row-m-e-kneecap.r\"/><use href=\"#t-bar-row-m-e-shank.r\"/><use href=\"#t-bar-row-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^35\"/><path class=\"eq-solid\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#t-bar-row-m-e-shcap.r\"/><use href=\"#t-bar-row-m-e-upper.r\"/><use href=\"#t-bar-row-m-e-elbowcap.r\"/><use href=\"#t-bar-row-m-e-fore.r\"/><use href=\"#t-bar-row-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#t-bar-row-m-e-shcap.r\"/><use href=\"#t-bar-row-m-e-upper.r\"/><use href=\"#t-bar-row-m-e-elbowcap.r\"/><use href=\"#t-bar-row-m-e-fore.r\"/><use href=\"#t-bar-row-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"276.35\" cy=\"187.45\" r=\"2.25\"/><circle class=\"joint\" cx=\"235.47\" cy=\"211.69\" r=\"2.25\"/><circle class=\"joint\" cx=\"210.06\" cy=\"206.29\" r=\"2.25\"/><circle class=\"joint\" cx=\"226.02\" cy=\"266.28\" r=\"2.25\"/></g><mask id=\"t-bar-row-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#t-bar-row-m-m-head\" fill=\"#000\"/><use href=\"#t-bar-row-m-m-torso\" fill=\"#000\"/><use href=\"#t-bar-row-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#t-bar-row-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#t-bar-row-m-mf-shank.l\" fill=\"#000\"/><use href=\"#t-bar-row-m-mf-foot.l\" fill=\"#000\"/><use href=\"#t-bar-row-m-m-shcap.l\" fill=\"#000\"/><use href=\"#t-bar-row-m-m-upper.l\" fill=\"#000\"/><use href=\"#t-bar-row-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#t-bar-row-m-m-fore.l\" fill=\"#000\"/><use href=\"#t-bar-row-m-m-fist.l\" fill=\"#000\"/><use href=\"#t-bar-row-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#t-bar-row-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#t-bar-row-m-mf-shank.r\" fill=\"#000\"/><use href=\"#t-bar-row-m-mf-foot.r\" fill=\"#000\"/><use href=\"#t-bar-row-m-m-shcap.r\" fill=\"#000\"/><use href=\"#t-bar-row-m-m-upper.r\" fill=\"#000\"/><use href=\"#t-bar-row-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#t-bar-row-m-m-fore.r\" fill=\"#000\"/><use href=\"#t-bar-row-m-m-fist.r\" fill=\"#000\"/><use href=\"#t-bar-row-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#t-bar-row-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#t-bar-row-m-mmask)\"><g class=\"u-stroke\"><use href=\"#t-bar-row-m-m-head\"/><use href=\"#t-bar-row-m-m-torso\"/><use href=\"#t-bar-row-m-m-shcap.l\"/><use href=\"#t-bar-row-m-m-upper.l\"/><use href=\"#t-bar-row-m-m-elbowcap.l\"/><use href=\"#t-bar-row-m-m-fore.l\"/><use href=\"#t-bar-row-m-m-fist.l\"/><use href=\"#t-bar-row-m-m-shcap.r\"/><use href=\"#t-bar-row-m-m-upper.r\"/><use href=\"#t-bar-row-m-m-elbowcap.r\"/><use href=\"#t-bar-row-m-m-fore.r\"/><use href=\"#t-bar-row-m-m-fist.r\"/><use href=\"#t-bar-row-m-m-eq0\"/><use href=\"#t-bar-row-m-m-eq1\"/><use href=\"#t-bar-row-m-m-eq2\"/><use href=\"#t-bar-row-m-m-eq3\"/><use href=\"#t-bar-row-m-m-eq4\"/><use href=\"#t-bar-row-m-m-eq5\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~M(xG1NGA1LSgKkLN1W2LN1U2LN1Y2LN1W2LN1W2LN1U2LP1Y2LJ1W2LN1U2LP1Y2LJ1U2LN1Y2LP1U2LJ1Y2LP1U2\"/><path class=\"m-arrow\" d=\"~MPRK1HEuLSpS!2MXozjLYoAjLGdEP1\"/><path class=\"leader m\" d=\"~MyUK1YSx1L0X!3\"/><path class=\"leader m\" d=\"M210.23 185.83L181.75 198H171.75\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"t-bar-row-m-round\" data-key=\"round\" data-cue=\"The back rounds forward over the bar.\" class=\"plate-callout two m\" style=\"left:55.87%;top:31.28%\" aria-pressed=\"true\">Back<br>rounds</button><button type=\"button\" id=\"t-bar-row-m-tuck\" data-key=\"tuck\" data-cue=\"The hips tuck under as the back curls.\" class=\"plate-callout two m\" style=\"left:27.93%;top:49.16%\" aria-pressed=\"false\">Hips tuck<br>under</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "chest",
        cues: [{ key: "chest", cue: "Keep your back straight and your chest level with the floor." }, { key: "knees", cue: "Keep your knees slightly bent and your hips hinged back." }, { key: "elbows", cue: "Drive your elbows back and pull the handle to your lower chest." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "round",
        cues: [{ key: "round", cue: "The back rounds forward over the bar." }, { key: "tuck", cue: "The hips tuck under as the back curls." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Back rounds</b><span>The back rounds forward over the bar.</span></li><li><b>Hips tuck under</b><span>The hips tuck under as the back curls.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 1 second, hold 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "T-bar row, side view. Standing over a bar pinned at a floor pivot behind, a V-handle hooked under it near the plates, hinged with the chest level and knees soft, the lifter pulls the handle from straight arms toward the lower chest, elbows driving back, until the plates meet the torso.",
      mistakeAlt: "T-Bar Row: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "pull",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: tbar-grip: the Wrong is a thumb fault and no key draws one; the V-handle diameter is not on this card. The grip copy carries c6, c19 and c20.",
    "orientation": "neutral",
    "width": {
      "text": "Close: set by the V-handle.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-t-bar"
        ],
        "note": "c1, c6"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "baechle-grip"
        ],
        "note": "c19"
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        25
      ],
      "limitText": "Keep the wrists from curling forward.",
      "claim": {
        "tags": [
          "DATA",
          "MECH"
        ],
        "sources": [
          "odriscoll1992"
        ],
        "note": "c21, card grip.wrist. The ext range is pairs.mjs CONVENTIONS ga:pull-base, a convention, not a card number."
      }
    },
    "faults": [
      {
        "key": "thumbless",
        "label": "Thumb not wrapped",
        "pose": {},
        "markers": [],
        "alt": "Thumbs alongside the handle, not wrapped."
      }
    ],
    "gripLine": "Palms facing, thumbs wrapped around the V-handle, not alongside it. Straps are fine on heavy sets.",
    "cue": "Palms facing, thumbs wrapped."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "get-in",
      "text": "Barbell in a landmine, plates on the free end.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-t-bar"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "adjust",
      "text": "Hook a V-handle under the bar about 8-10 inches from the plates.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-t-bar"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Stand over the bar, feet about shoulder width, knees slightly bent.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-t-bar"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "grip",
      "text": "Hinge, chest level with the floor. Grab the handle, palms facing.",
      "zoom": "tbar-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-t-bar"
        ],
        "note": "c3, c6"
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
          "ggr-t-bar",
          "acsm2009"
        ],
        "note": "c13"
      }
    }
  ],
  posture: [
    {
      "key": "back",
      "label": "Chest parallel",
      "detail": "Brace. Back straight, chest parallel to the floor.",
      "anchor": {
        "pose": "end",
        "at": "backMid"
      },
      "zoom": "tbar-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-t-bar"
        ],
        "note": "c3"
      }
    },
    {
      "key": "trunk",
      "label": "Trunk still",
      "detail": "Trunk angle stays the same while the bar moves.",
      "anchor": {
        "pose": "end",
        "at": "lumbar"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-t-bar"
        ],
        "note": "c3"
      }
    },
    {
      "key": "blades",
      "label": "Shoulder blades",
      "detail": "Shoulder blades pull back as the elbows drive back.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-t-bar"
        ],
        "note": "c4"
      }
    },
    {
      "key": "lower",
      "label": "Full range",
      "detail": "Lower all the way, slowly.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-t-bar"
        ],
        "note": "c9, c5"
      }
    }
  ],
  zooms: [
    {
      "key": "tbar-back",
      "chip": "Back",
      "heading": "Back line",
      "kind": "posture",
      "feelRow": "low-back"
    }
  ],
  chips: [
    "tbar-back",
    "feel"
  ],
  copy: {
    "setupLine": "Hinge with the chest level and knees soft. Pull the handle to your lower chest.",
    "mistakeLine": "Don't round your back. Brace and use a lighter load.",
    "cueLine": "Elbows back, chest level.",
    "variantLine": "On the chest-supported machine, sternum at the pad's end."
  },
  mistakes: [
    {
      "key": "round",
      "title": "Rounding the back",
      "zoom": "tbar-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-t-bar"
        ],
        "note": "c7"
      },
      "fix": "Brace and use a lighter load."
    },
    {
      "key": "swing",
      "title": "Swinging the weight up",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-t-bar"
        ],
        "note": "c8, c4"
      },
      "fix": "Pull the shoulder blades back. Hold the squeeze at the top."
    },
    {
      "key": "short",
      "title": "Stopping halfway down",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-t-bar"
        ],
        "note": "c9, c5"
      },
      "fix": "Lower all the way, slowly, each rep."
    }
  ],
  risks: [
    {
      "key": "round",
      "text": "A rounded back strains the lower back and raises the chance of injury.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-t-bar"
        ],
        "note": "c7"
      }
    },
    {
      "key": "pad",
      "text": "Without a chest pad the lower back works much harder.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-t-bar"
        ],
        "note": "c11"
      }
    },
    {
      "key": "breath",
      "text": "Heavy reps with a held breath send blood pressure very high.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "macdougall1985"
        ],
        "note": "c16"
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
    "ggr-t-bar",
    "barbend-t-bar",
    "acsm2009",
    "macdougall1985",
    "baechle-grip",
    "odriscoll1992",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/t_bar_row.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

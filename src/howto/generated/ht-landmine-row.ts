// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=904b23e50671565b1b16f252f147498374f79adce51c3853d30c026aa730c0db
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_landmine_row",
  name: "Landmine Row",
  hashes: { inputsSha256: "904b23e50671565b1b16f252f147498374f79adce51c3853d30c026aa730c0db", golden: "c53912fab6be0530171c54350f0a8c16341942057d6d05e0b469f5dc8382d433" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"landmine-row-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"landmine-row-n-st-shcap.r\" d=\"~~WYU1SXD1wP10\"/><path id=\"landmine-row-n-st-upper.r\" d=\"~#F12U-U1DND1xxV1KKB1y2z8a2I6JJ1F4*4(1I2Hc.w1SdKgD3zgE6Gky1xz1r)2)1z6xbNI171A1E8EfI6IiNmI4ymP8Ur00021010000000012002100001000010121000101000000000101000200200000100200000001110\"/><path id=\"landmine-row-n-st-elbowcap.r\" d=\"~~DOT1wHO1Dz10\"/><path id=\"landmine-row-n-st-fore.r\" d=\"~#F12SKT1DHO1IPT1EPN1S1O9qW1Y3FF1N3V8U1B2aBtY6Xc1Eb.6XcjBtT1x2R3V8G3DF1n_1X1R9BaB2IaUj2FhUaPj01100000002000001000001111120000012001001000000001101000000100000001200000002121\"/><path id=\"landmine-row-n-st-fist.r\" d=\"~~(DS1WxY1ww10\"/><path id=\"landmine-row-n-g0-shcap.r\" d=\"~~PVU1PBD1wP10\"/><path id=\"landmine-row-n-g0-upper.r\" d=\"~#F12!)U1YEB1OWV1VJA1Y5R6a4IrND1D6V2!2I1wsxqPjK8Fa.cW3)kwjzx1kE3F1R6BvNz155A5B7-bBbRqNb)dWhx5Ps01001000012000000010000000002020000001002200002000001200220020000101000000000000\"/><path id=\"landmine-row-n-g0-elbowcap.r\" d=\"~~WIO1FJK1Dz10\"/><path id=\"landmine-row-n-g0-fore.r\" d=\"~#F12SKO1(.K1IDO1VBK1x2K8H1y1Niyv0O8iK2-9xmmIeX4EaTbT8VaRlG2z1O6K5Dcwy11W1B5*6Eb7B1FmH7Sf!hFd00010001101012200200000000020000212000000210110000000011111101210010100000000001\"/><path id=\"landmine-row-n-g0-fist.r\" d=\"~~!PR1DyV1ww10\"/><path id=\"landmine-row-n-g1-shcap.r\" d=\"~~HSU1PTB1wP10\"/><path id=\"landmine-row-n-g1-upper.r\" d=\"~#F12!BV1!JA1xzW1RYz1N7.488XA1wuU6vF3fAy1xiylx3FdX9y9BjJrErP1)2!2)5RE1Dq37_6V5R8XdXsA4)hJdKcAq00000220000001000010000101010000101000002001000002100000001101020000000220000010\"/><path id=\"landmine-row-n-g1-elbowcap.r\" d=\"~~!PK1DzI1Dz10\"/><path id=\"landmine-row-n-g1-fore.r\" d=\"~#F12UVK1!XI1EIK1IzI1G3-7N1o_mFrK1E8cO2-cRjR1KeE6E9.cX6Rd)iG2lE7E4(gAv8W1x6*5ObD1J2AmU9FeYjFa00101010110000100001200101000100000000101200200210101000202101000020000000002020\"/><path id=\"landmine-row-n-g1-fist.r\" d=\"~~yWP1wAS1ww10\"/><path id=\"landmine-row-n-e-thigh.l\" d=\"~#F12YYD1WRG1xBD1)DF1-5Kaz1eYoJ-1!2G9H1V4-fGS1W3-p)6)iKjGhTkTP1-3V2I8E5FiY.1D1dI2RbIx1jR6wN1NcWx1Uy1Yu02101100000002000020000000000000000000001000000012120000000200200000022001000100\"/><path id=\"landmine-row-n-e-kneecap.l\" d=\"~~J_I1HBU1_J10\"/><path id=\"landmine-row-n-e-shank.l\" d=\"~#F12N-I1J*T1BBJ1ROS1Y3GbF16*5_(1D7X6J3K3_7Iy2P9Ecy2Xb*4VeFfBx2z2I4O4V8Rfw*1E138)bTeF9EhAmX3Hl_8Uq00110021010000101000000200001010100111012110000000000100002001000202200001000000\"/><path id=\"landmine-row-n-e-foot.l\" d=\"~#o2NEH1FB)1B-H1GB(1WcA3Uh*7Wp*nF-2B3KJ2-4ED1*7.n0OG1Y4)aVcWsEbKmSp101001000000000101000000022000002000201011000000\"/><path id=\"landmine-row-n-e-shcap.l\" d=\"~~DOU1PxB1wP10\"/><path id=\"landmine-row-n-e-upper.l\" d=\"~#F12!KV1WUz1.NW1*Fz1F8X26a-H1wjU6qF3c!A1x8ylU2Jf*5!dxgYw1-iD2I2H4x5OJ1Se19w8O3E4-fXsR3*ky8*i(l00000000000100012020022000010001210020200000000101000000000200100000000001110002\"/><path id=\"landmine-row-n-e-elbowcap.l\" d=\"~~NIJ1PHF1Dz10\"/><path id=\"landmine-row-n-e-fore.l\" d=\"~#F12DYJ1WEG1xDJ1)VF1E6)6Y1ewx1(kK4.7nT2TlBh*5Bd*8-6GeI2EmOgR20.8E2_sPqqS1G8E4T8F6D9DkUdPa!lS300000000120010000000000020000202000100000000000002020001010020020001000000110002\"/><path id=\"landmine-row-n-e-fist.l\" d=\"~~wzS1!FN1ww10\"/><path id=\"landmine-row-n-e-head\" d=\"~#w12Uww2(KA1Bxw2--y1EmTfXcEhD1RbG5G2y7z6U9-9yjBlJdN2D9E3G3.i!eAkFa(keylKcWlBjW12021000020001012100002020000000110000000021002002002000000010000\"/><path id=\"landmine-row-n-e-torso\" d=\"~#_12Uy.1y-z1)R!1K_z1W4RajB3TfPcT4SaRdNfq(5SmI9(3KlK7RbH8Pe(a_iUkFiAlDdJaP2_dIbDsKy1wo)gI4T5.3-4V7FeI7S4U5)dTaIeRlV2E5J7HdWaI7S4*K1KJ202000100110001000000100011110000001010000000200020200100100200000000220000210020020010100000010000100100000011100000\"/><path id=\"landmine-row-n-e-thigh.r\" d=\"^15\"/><path id=\"landmine-row-n-e-kneecap.r\" d=\"^16\"/><path id=\"landmine-row-n-e-shank.r\" d=\"^17\"/><path id=\"landmine-row-n-e-foot.r\" d=\"^18\"/><path id=\"landmine-row-n-e-shcap.r\" d=\"^19\"/><path id=\"landmine-row-n-e-upper.r\" d=\"~#F12JOV1DUz1xRW1OGz1P8K24aXI1WhU6y1F3cSB1*6ylH3PfI5JeVf!x1-hH2I2P4.4EK1Dd39D8E3)3.fRsO4ElJ7TjHl01000000000001000000010010010100101000002000000002010100001012011000000001000001\"/><path id=\"landmine-row-n-e-elbowcap.r\" d=\"~~_BJ1DyF1Dz10\"/><path id=\"landmine-row-n-e-fore.r\" d=\"~#F12yIJ1SXF1O)I1EyF1X3z8P1qSoHs-1R86R2ReEl.1GeR6z9*cO6GfRkO2nO7O4_iNw18Y1K6E6VaS2Y2ymyawe(j_902001001110020000000000001100000000001000000010020001210000100000010000020002000\"/><path id=\"landmine-row-n-e-fist.r\" d=\"~~PWO1AEO1ww10\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#landmine-row-n-dots)\"/>\n  <path class=\"floorline\" d=\"M0.45 339.5H341.71\"/><path class=\"eq\" d=\"~MU-1YDy2Lww80QD90-W7z9LB9A9Q0B9B9B9L-W7D9Qz90!W7D9LA9B9Q0A9A9A9Z\"/><path class=\"eq-solid\" d=\"~~F(4YDw2Nr0\"/><path class=\"eq-pin\" d=\"~~JT5YDw2F60\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#landmine-row-n-st-shcap.r\"/><use href=\"#landmine-row-n-st-upper.r\"/><use href=\"#landmine-row-n-st-elbowcap.r\"/><use href=\"#landmine-row-n-st-fore.r\"/><use href=\"#landmine-row-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#landmine-row-n-st-shcap.r\"/><use href=\"#landmine-row-n-st-upper.r\"/><use href=\"#landmine-row-n-st-elbowcap.r\"/><use href=\"#landmine-row-n-st-fore.r\"/><use href=\"#landmine-row-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#landmine-row-n-g0-shcap.r\"/><use href=\"#landmine-row-n-g0-upper.r\"/><use href=\"#landmine-row-n-g0-elbowcap.r\"/><use href=\"#landmine-row-n-g0-fore.r\"/><use href=\"#landmine-row-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#landmine-row-n-g0-shcap.r\"/><use href=\"#landmine-row-n-g0-upper.r\"/><use href=\"#landmine-row-n-g0-elbowcap.r\"/><use href=\"#landmine-row-n-g0-fore.r\"/><use href=\"#landmine-row-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#landmine-row-n-g1-shcap.r\"/><use href=\"#landmine-row-n-g1-upper.r\"/><use href=\"#landmine-row-n-g1-elbowcap.r\"/><use href=\"#landmine-row-n-g1-fore.r\"/><use href=\"#landmine-row-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#landmine-row-n-g1-shcap.r\"/><use href=\"#landmine-row-n-g1-upper.r\"/><use href=\"#landmine-row-n-g1-elbowcap.r\"/><use href=\"#landmine-row-n-g1-fore.r\"/><use href=\"#landmine-row-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#landmine-row-n-e-thigh.l\"/><use href=\"#landmine-row-n-e-kneecap.l\"/><use href=\"#landmine-row-n-e-shank.l\"/><use href=\"#landmine-row-n-e-foot.l\"/><use href=\"#landmine-row-n-e-shcap.l\"/><use href=\"#landmine-row-n-e-upper.l\"/><use href=\"#landmine-row-n-e-elbowcap.l\"/><use href=\"#landmine-row-n-e-fore.l\"/><use href=\"#landmine-row-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#landmine-row-n-e-thigh.l\"/><use href=\"#landmine-row-n-e-kneecap.l\"/><use href=\"#landmine-row-n-e-shank.l\"/><use href=\"#landmine-row-n-e-foot.l\"/><use href=\"#landmine-row-n-e-shcap.l\"/><use href=\"#landmine-row-n-e-upper.l\"/><use href=\"#landmine-row-n-e-elbowcap.l\"/><use href=\"#landmine-row-n-e-fore.l\"/><use href=\"#landmine-row-n-e-fist.l\"/></g></g><path class=\"eq\" d=\"~M(U5!_)1L!TN1XNiLKHN1SDjLG*N1!WhZ\"/><path class=\"eq\" d=\"~MABU1YyK1LF_bXV4LIGbFw6LBIcFI3Z\"/><path class=\"eq-solid\" d=\"~MWOT1YTH1LHqKaLNS1FJ6LzE3IX5Z\"/><path class=\"eq-line m-line\" d=\"~MU-5YDw2LY.*1Tzb\"/><path class=\"eq-line m-line\" d=\"~MP.W1!yU1L(r)4L!8AS6LVw2xF6L)8ES6\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#landmine-row-n-e-head\"/><use href=\"#landmine-row-n-e-torso\"/><use href=\"#landmine-row-n-e-thigh.r\"/><use href=\"#landmine-row-n-e-kneecap.r\"/><use href=\"#landmine-row-n-e-shank.r\"/><use href=\"#landmine-row-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#landmine-row-n-e-head\"/><use href=\"#landmine-row-n-e-torso\"/><use href=\"#landmine-row-n-e-thigh.r\"/><use href=\"#landmine-row-n-e-kneecap.r\"/><use href=\"#landmine-row-n-e-shank.r\"/><use href=\"#landmine-row-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#landmine-row-n-e-shcap.r\"/><use href=\"#landmine-row-n-e-upper.r\"/><use href=\"#landmine-row-n-e-elbowcap.r\"/><use href=\"#landmine-row-n-e-fore.r\"/><use href=\"#landmine-row-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#landmine-row-n-e-shcap.r\"/><use href=\"#landmine-row-n-e-upper.r\"/><use href=\"#landmine-row-n-e-elbowcap.r\"/><use href=\"#landmine-row-n-e-fore.r\"/><use href=\"#landmine-row-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"276.35\" cy=\"189.68\" r=\"2.25\"/><circle class=\"joint\" cx=\"231.85\" cy=\"205.15\" r=\"2.25\"/><circle class=\"joint\" cx=\"210.06\" cy=\"208.52\" r=\"2.25\"/><circle class=\"joint\" cx=\"231.55\" cy=\"267.09\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#P10YXS1wwW1z-S1*BW1010201021122010201020102j420102010221120100020020000000200100012101000002000200000000000001000100001000010100000101000001110000010100000000000\"/><path class=\"arrow\" d=\"~MyAR1yOP1L_tPtLGx2KhZ\"/></g><path class=\"leader\" d=\"~MYyT1(xz1L0*S4\"/><circle class=\"anchor\" cx=\"261.56\" cy=\"179.51\" r=\"1.5\"/><path class=\"leader\" d=\"~MNJK1AXA1L0.W3\"/><circle class=\"anchor\" cx=\"232.39\" cy=\"188.02\" r=\"1.5\"/><path class=\"leader\" d=\"M231.85 205.15L205.5 236H195.5\"/><circle class=\"anchor\" cx=\"231.85\" cy=\"205.15\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"landmine-row-n-torso\" data-key=\"torso\" data-cue=\"Keep your back straight and your torso roughly level with the floor.\" class=\"plate-callout two\" style=\"left:72.07%;top:32.4%\" aria-pressed=\"true\">Torso<br>parallel</button><button type=\"button\" id=\"landmine-row-n-brace\" data-key=\"brace\" data-cue=\"Brace your trunk before each pull so your lower back does not round.\" class=\"plate-callout\" style=\"left:44.69%;top:37.99%\" aria-pressed=\"false\">Brace first</button><button type=\"button\" id=\"landmine-row-n-elbows\" data-key=\"elbows\" data-cue=\"Drive your elbows back and pull the bar to your chest.\" class=\"plate-callout two\" style=\"left:38.55%;top:59.78%\" aria-pressed=\"false\">Elbows<br>back</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"landmine-row-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"landmine-row-m-st-shcap.r\" d=\"^0\"/><path id=\"landmine-row-m-st-upper.r\" d=\"^1\"/><path id=\"landmine-row-m-st-elbowcap.r\" d=\"^2\"/><path id=\"landmine-row-m-st-fore.r\" d=\"^3\"/><path id=\"landmine-row-m-st-fist.r\" d=\"^4\"/><path id=\"landmine-row-m-g0-shcap.r\" d=\"^5\"/><path id=\"landmine-row-m-g0-upper.r\" d=\"^6\"/><path id=\"landmine-row-m-g0-elbowcap.r\" d=\"^7\"/><path id=\"landmine-row-m-g0-fore.r\" d=\"^8\"/><path id=\"landmine-row-m-g0-fist.r\" d=\"^9\"/><path id=\"landmine-row-m-g1-shcap.r\" d=\"^10\"/><path id=\"landmine-row-m-g1-upper.r\" d=\"^11\"/><path id=\"landmine-row-m-g1-elbowcap.r\" d=\"^12\"/><path id=\"landmine-row-m-g1-fore.r\" d=\"^13\"/><path id=\"landmine-row-m-g1-fist.r\" d=\"^14\"/><path id=\"landmine-row-m-e-thigh.l\" d=\"^15\"/><path id=\"landmine-row-m-e-kneecap.l\" d=\"^16\"/><path id=\"landmine-row-m-e-shank.l\" d=\"^17\"/><path id=\"landmine-row-m-e-foot.l\" d=\"^18\"/><path id=\"landmine-row-m-e-shcap.l\" d=\"^19\"/><path id=\"landmine-row-m-e-upper.l\" d=\"^20\"/><path id=\"landmine-row-m-e-elbowcap.l\" d=\"^21\"/><path id=\"landmine-row-m-e-fore.l\" d=\"^22\"/><path id=\"landmine-row-m-e-fist.l\" d=\"^23\"/><path id=\"landmine-row-m-e-head\" d=\"^24\"/><path id=\"landmine-row-m-e-torso\" d=\"^25\"/><path id=\"landmine-row-m-e-thigh.r\" d=\"^15\"/><path id=\"landmine-row-m-e-kneecap.r\" d=\"^16\"/><path id=\"landmine-row-m-e-shank.r\" d=\"^17\"/><path id=\"landmine-row-m-e-foot.r\" d=\"^18\"/><path id=\"landmine-row-m-e-shcap.r\" d=\"^19\"/><path id=\"landmine-row-m-e-upper.r\" d=\"^26\"/><path id=\"landmine-row-m-e-elbowcap.r\" d=\"^27\"/><path id=\"landmine-row-m-e-fore.r\" d=\"^28\"/><path id=\"landmine-row-m-e-fist.r\" d=\"^29\"/><path id=\"landmine-row-m-m-head\" d=\"~#w12yx(1HDB1)E(1TSz1zkEiTaTiU2Ib)4*2_7E5WaR8PlViwdy4S9x2x1BjJcYlS7ymz2(k*eykEjl0000011000000101010021101000220000000000000000000000020000010000\"/><path id=\"landmine-row-m-m-torso\" d=\"~#_12YD-1J(z1TV_1RBA1(5.95E3xhSa.5(9GfSdO4P2HrD7YaF2EaI8JeJ8(i!a(qP5!oqHa)2D6-gF7-I1Fc-q*E1Na-g_Y1(X1Vg-7W3H7Ed-8RfzlE5x6W6!bDc.7U3EA1IR200000200000200000000100010121000000000100100001010011110101010002200010010100001010000010001100010100000101002000000\"/><path id=\"landmine-row-m-m-shcap.l\" d=\"~~SOS1SSA1wP10\"/><path id=\"landmine-row-m-m-upper.l\" d=\"~#F12SIT1(Dz1IIU1I-y1w8B36a*F1HlS6iF32Nz1*9HlH1!e.6!c*gYuKk(1O2w4G5*H1Ah3bU7*3V4Vf)sX1IkH9OhAn00001000000001000200001010210110000020210100002101000000010002200000020101000001\"/><path id=\"landmine-row-m-m-elbowcap.l\" d=\"~~NWH1YHF1Dz10\"/><path id=\"landmine-row-m-m-fore.l\" d=\"~#F12YFI1NIG1xTH1-!F1T7*5!16JB1Nfx6B7z1I2.p*dB8.b*9E5Oe8EqzdT2gI9rFy1UlA1P1E9.2R6w8ScJiFf!7Fm711010000000111010100000111020000000000000002000000000002100000200000000000000210\"/><path id=\"landmine-row-m-m-fist.l\" d=\"~~yWR1AGK1ww10\"/><path id=\"landmine-row-m-m-shcap.r\" d=\"^46\"/><path id=\"landmine-row-m-m-upper.r\" d=\"~#F12PNT1WBz1VOU1x_y1J8V228*H1(iS6qH3cyB1)7yl_2Nf*5(d)fwx1XiF2I2H4)4TJ1Je57A8R3G4XfVsV3)kw8xj_l00000001100000101000021010100020010000000000020200000100120000000002200010001100\"/><path id=\"landmine-row-m-m-elbowcap.r\" d=\"~~NHH1W_E1Dz10\"/><path id=\"landmine-row-m-m-fore.r\" d=\"~#F12HUH1NVF1IAH1EyF1K5O7W1iHu!nR3G8dR2Ej-iR4-dB8V7*d-3*jBiT25I8B3Np(smW1-7)4K9w5w7ylPc_bNl!500101010102200010110100000011110100000000002002001000000000100010000010100020000\"/><path id=\"landmine-row-m-m-fist.r\" d=\"~~FHO1yGN1ww10\"/><path id=\"landmine-row-m-m-eq0\" d=\"~MWU5(_)1LPDN1IOjLR!K1(DkLKPN1!XiZ\"/><path id=\"landmine-row-m-m-eq1\" d=\"~MHXT1HyJ1L!Wbx(4LzBbDF6LTFc(T3Z\"/><path id=\"landmine-row-m-m-eq2\" d=\"~MAwT1YTG1LAq)aL_W1yI6L)H3xV5Z\"/><path id=\"landmine-row-m-mf-thigh.l\" d=\"^15\"/><path id=\"landmine-row-m-mf-kneecap.l\" d=\"^16\"/><path id=\"landmine-row-m-mf-shank.l\" d=\"^17\"/><path id=\"landmine-row-m-mf-foot.l\" d=\"^18\"/><path id=\"landmine-row-m-mf-thigh.r\" d=\"^15\"/><path id=\"landmine-row-m-mf-kneecap.r\" d=\"^16\"/><path id=\"landmine-row-m-mf-shank.r\" d=\"^17\"/><path id=\"landmine-row-m-mf-foot.r\" d=\"^18\"/><path id=\"landmine-row-m-mo-0\" d=\"^24\"/><path id=\"landmine-row-m-mo-1\" d=\"^25\"/><path id=\"landmine-row-m-mo-2\" d=\"^15\"/><path id=\"landmine-row-m-mo-3\" d=\"^16\"/><path id=\"landmine-row-m-mo-4\" d=\"^17\"/><path id=\"landmine-row-m-mo-5\" d=\"^18\"/><path id=\"landmine-row-m-mo-6\" d=\"^19\"/><path id=\"landmine-row-m-mo-7\" d=\"^20\"/><path id=\"landmine-row-m-mo-8\" d=\"^21\"/><path id=\"landmine-row-m-mo-9\" d=\"^22\"/><path id=\"landmine-row-m-mo-10\" d=\"^23\"/><path id=\"landmine-row-m-mo-11\" d=\"^15\"/><path id=\"landmine-row-m-mo-12\" d=\"^16\"/><path id=\"landmine-row-m-mo-13\" d=\"^17\"/><path id=\"landmine-row-m-mo-14\" d=\"^18\"/><path id=\"landmine-row-m-mo-15\" d=\"^19\"/><path id=\"landmine-row-m-mo-16\" d=\"^26\"/><path id=\"landmine-row-m-mo-17\" d=\"^27\"/><path id=\"landmine-row-m-mo-18\" d=\"^28\"/><path id=\"landmine-row-m-mo-19\" d=\"^29\"/><path id=\"landmine-row-m-mo-20\" d=\"^31\"/><path id=\"landmine-row-m-mo-21\" d=\"^32\"/><path id=\"landmine-row-m-mo-22\" d=\"^33\"/><path id=\"landmine-row-m-mo-23\" d=\"^34\"/><path id=\"landmine-row-m-mo-24\" d=\"^35\"/><path id=\"landmine-row-m-mo-25\" d=\"^36\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#landmine-row-m-dots)\"/>\n  <path class=\"floorline\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq-solid\" d=\"^32\"/><path class=\"eq-pin\" d=\"^33\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#landmine-row-m-st-shcap.r\"/><use href=\"#landmine-row-m-st-upper.r\"/><use href=\"#landmine-row-m-st-elbowcap.r\"/><use href=\"#landmine-row-m-st-fore.r\"/><use href=\"#landmine-row-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#landmine-row-m-st-shcap.r\"/><use href=\"#landmine-row-m-st-upper.r\"/><use href=\"#landmine-row-m-st-elbowcap.r\"/><use href=\"#landmine-row-m-st-fore.r\"/><use href=\"#landmine-row-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#landmine-row-m-g0-shcap.r\"/><use href=\"#landmine-row-m-g0-upper.r\"/><use href=\"#landmine-row-m-g0-elbowcap.r\"/><use href=\"#landmine-row-m-g0-fore.r\"/><use href=\"#landmine-row-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#landmine-row-m-g0-shcap.r\"/><use href=\"#landmine-row-m-g0-upper.r\"/><use href=\"#landmine-row-m-g0-elbowcap.r\"/><use href=\"#landmine-row-m-g0-fore.r\"/><use href=\"#landmine-row-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#landmine-row-m-g1-shcap.r\"/><use href=\"#landmine-row-m-g1-upper.r\"/><use href=\"#landmine-row-m-g1-elbowcap.r\"/><use href=\"#landmine-row-m-g1-fore.r\"/><use href=\"#landmine-row-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#landmine-row-m-g1-shcap.r\"/><use href=\"#landmine-row-m-g1-upper.r\"/><use href=\"#landmine-row-m-g1-elbowcap.r\"/><use href=\"#landmine-row-m-g1-fore.r\"/><use href=\"#landmine-row-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#landmine-row-m-e-thigh.l\"/><use href=\"#landmine-row-m-e-kneecap.l\"/><use href=\"#landmine-row-m-e-shank.l\"/><use href=\"#landmine-row-m-e-foot.l\"/><use href=\"#landmine-row-m-e-shcap.l\"/><use href=\"#landmine-row-m-e-upper.l\"/><use href=\"#landmine-row-m-e-elbowcap.l\"/><use href=\"#landmine-row-m-e-fore.l\"/><use href=\"#landmine-row-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#landmine-row-m-e-thigh.l\"/><use href=\"#landmine-row-m-e-kneecap.l\"/><use href=\"#landmine-row-m-e-shank.l\"/><use href=\"#landmine-row-m-e-foot.l\"/><use href=\"#landmine-row-m-e-shcap.l\"/><use href=\"#landmine-row-m-e-upper.l\"/><use href=\"#landmine-row-m-e-elbowcap.l\"/><use href=\"#landmine-row-m-e-fore.l\"/><use href=\"#landmine-row-m-e-fist.l\"/></g></g><path class=\"eq\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq-solid\" d=\"^36\"/><path class=\"eq-line m-line\" d=\"^37\"/><path class=\"eq-line m-line\" d=\"^38\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#landmine-row-m-e-head\"/><use href=\"#landmine-row-m-e-torso\"/><use href=\"#landmine-row-m-e-thigh.r\"/><use href=\"#landmine-row-m-e-kneecap.r\"/><use href=\"#landmine-row-m-e-shank.r\"/><use href=\"#landmine-row-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#landmine-row-m-e-head\"/><use href=\"#landmine-row-m-e-torso\"/><use href=\"#landmine-row-m-e-thigh.r\"/><use href=\"#landmine-row-m-e-kneecap.r\"/><use href=\"#landmine-row-m-e-shank.r\"/><use href=\"#landmine-row-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#landmine-row-m-e-shcap.r\"/><use href=\"#landmine-row-m-e-upper.r\"/><use href=\"#landmine-row-m-e-elbowcap.r\"/><use href=\"#landmine-row-m-e-fore.r\"/><use href=\"#landmine-row-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#landmine-row-m-e-shcap.r\"/><use href=\"#landmine-row-m-e-upper.r\"/><use href=\"#landmine-row-m-e-elbowcap.r\"/><use href=\"#landmine-row-m-e-fore.r\"/><use href=\"#landmine-row-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"276.35\" cy=\"189.68\" r=\"2.25\"/><circle class=\"joint\" cx=\"231.85\" cy=\"205.15\" r=\"2.25\"/><circle class=\"joint\" cx=\"210.06\" cy=\"208.52\" r=\"2.25\"/><circle class=\"joint\" cx=\"231.55\" cy=\"267.09\" r=\"2.25\"/></g><mask id=\"landmine-row-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#landmine-row-m-m-head\" fill=\"#000\"/><use href=\"#landmine-row-m-m-torso\" fill=\"#000\"/><use href=\"#landmine-row-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#landmine-row-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#landmine-row-m-mf-shank.l\" fill=\"#000\"/><use href=\"#landmine-row-m-mf-foot.l\" fill=\"#000\"/><use href=\"#landmine-row-m-m-shcap.l\" fill=\"#000\"/><use href=\"#landmine-row-m-m-upper.l\" fill=\"#000\"/><use href=\"#landmine-row-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#landmine-row-m-m-fore.l\" fill=\"#000\"/><use href=\"#landmine-row-m-m-fist.l\" fill=\"#000\"/><use href=\"#landmine-row-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#landmine-row-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#landmine-row-m-mf-shank.r\" fill=\"#000\"/><use href=\"#landmine-row-m-mf-foot.r\" fill=\"#000\"/><use href=\"#landmine-row-m-m-shcap.r\" fill=\"#000\"/><use href=\"#landmine-row-m-m-upper.r\" fill=\"#000\"/><use href=\"#landmine-row-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#landmine-row-m-m-fore.r\" fill=\"#000\"/><use href=\"#landmine-row-m-m-fist.r\" fill=\"#000\"/><use href=\"#landmine-row-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#landmine-row-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#landmine-row-m-mmask)\"><g class=\"u-stroke\"><use href=\"#landmine-row-m-m-head\"/><use href=\"#landmine-row-m-m-torso\"/><use href=\"#landmine-row-m-m-shcap.l\"/><use href=\"#landmine-row-m-m-upper.l\"/><use href=\"#landmine-row-m-m-elbowcap.l\"/><use href=\"#landmine-row-m-m-fore.l\"/><use href=\"#landmine-row-m-m-fist.l\"/><use href=\"#landmine-row-m-m-shcap.r\"/><use href=\"#landmine-row-m-m-upper.r\"/><use href=\"#landmine-row-m-m-elbowcap.r\"/><use href=\"#landmine-row-m-m-fore.r\"/><use href=\"#landmine-row-m-m-fist.r\"/><use href=\"#landmine-row-m-m-eq0\"/><use href=\"#landmine-row-m-m-eq1\"/><use href=\"#landmine-row-m-m-eq2\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~M(xG1JXA1LSgKkLN1W2LN1W2LN1U2LN1Y2LN1W2LN1U2LP1Y2LJ1W2LN1U2LP1Y2LJ1U2LN1Y2LP1U2LJ1Y2LP1U2\"/><path class=\"m-arrow\" d=\"~MPRK1FVuLSpS!2MXozjLYoAjLGdEP1\"/><path class=\"leader m\" d=\"~MyUK1Wwy1L0VH4\"/><path class=\"leader m\" d=\"M210.23 188.06L181.75 198H171.75\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"landmine-row-m-round\" data-key=\"round\" data-cue=\"The lower back rounds over the bar.\" class=\"plate-callout two m\" style=\"left:55.87%;top:31.28%\" aria-pressed=\"true\">Lower back<br>rounds</button><button type=\"button\" id=\"landmine-row-m-tuck\" data-key=\"tuck\" data-cue=\"The hips tuck under as the back curls.\" class=\"plate-callout two m\" style=\"left:27.93%;top:49.16%\" aria-pressed=\"false\">Hips tuck<br>under</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "torso",
        cues: [{ key: "torso", cue: "Keep your back straight and your torso roughly level with the floor." }, { key: "brace", cue: "Brace your trunk before each pull so your lower back does not round." }, { key: "elbows", cue: "Drive your elbows back and pull the bar to your chest." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "round",
        cues: [{ key: "round", cue: "The lower back rounds over the bar." }, { key: "tuck", cue: "The hips tuck under as the back curls." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Lower back rounds</b><span>The lower back rounds over the bar.</span></li><li><b>Hips tuck under</b><span>The hips tuck under as the back curls.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Landmine row, side view. Straddling the loaded end of a bar pinned at a floor pivot behind, hinged with the torso roughly level and the back straight, the lifter pulls the bar end from straight arms up to the chest, driving the elbows back.",
      mistakeAlt: "Landmine Row: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "pull",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: landmine-grip: the Wrong is a thumb fault and no key draws one; the bar diameter where the hands sit is not on the card. The grip copy carries c4 and c17.",
    "orientation": "pronated",
    "width": {
      "text": "Close: one hand above the other, just below the plates.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-landmine-row",
          "cissik-landmine"
        ],
        "note": "c4"
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
        "note": "c17"
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
        "note": "c18, card grip.wrist. The ext range is pairs.mjs CONVENTIONS ga:pull-base, a convention, not a card number."
      }
    },
    "faults": [
      {
        "key": "thumbless",
        "label": "Thumb not wrapped",
        "pose": {},
        "markers": [],
        "alt": "Thumbs alongside the bar, not wrapped."
      }
    ],
    "gripLine": "Overhand, one hand above the other. Thumbs wrapped around the bar, not alongside it.",
    "cue": "Overhand, thumbs wrapped."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "get-in",
      "text": "Anchor a barbell end in a landmine. Load the free end.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-landmine-row"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Straddle the loaded end, feet between hip and shoulder width.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-landmine-row",
          "cissik-landmine"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "position",
      "text": "Hinge until the torso is roughly level with the floor, back straight.",
      "zoom": "landmine-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-landmine-row",
          "cissik-landmine"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "grip",
      "text": "Both hands overhand below the plates, one above the other.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-landmine-row",
          "cissik-landmine"
        ],
        "note": "c4"
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
          "acsm2009",
          "rep-landmine-row"
        ],
        "note": "c13"
      }
    }
  ],
  posture: [
    {
      "key": "back",
      "label": "Flat back",
      "detail": "Back neutral the whole set, not rounded or arched.",
      "anchor": {
        "pose": "end",
        "at": "backMid"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-landmine-row"
        ],
        "note": "c9"
      }
    },
    {
      "key": "torso",
      "label": "Torso level",
      "detail": "Torso stays roughly parallel to the floor.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "zoom": "landmine-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-landmine-row",
          "cissik-landmine"
        ],
        "note": "c3"
      }
    },
    {
      "key": "blades",
      "label": "Shoulder blades",
      "detail": "Shoulder blades squeeze together at the top.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-landmine-row"
        ],
        "note": "c6"
      }
    }
  ],
  zooms: [
    {
      "key": "landmine-back",
      "chip": "Back",
      "heading": "Back line",
      "kind": "posture",
      "feelRow": "low-back"
    }
  ],
  chips: [
    "landmine-back",
    "feel"
  ],
  copy: {
    "setupLine": "Straddle the loaded end and hinge, back straight. Pull the bar end to your chest.",
    "mistakeLine": "Don't round your lower back. Brace before each rep and use a lighter load.",
    "cueLine": "Elbows back, back straight."
  },
  mistakes: [
    {
      "key": "round",
      "title": "Rounding the lower back",
      "zoom": "landmine-back",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "ggr-t-bar",
          "rep-landmine-row"
        ],
        "note": "c11, c5"
      },
      "fix": "Brace before each rep and use a lighter load."
    },
    {
      "key": "jerk",
      "title": "Jerking it up",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-landmine-row"
        ],
        "note": "c7, c6"
      },
      "fix": "Pull with control. Squeeze the shoulder blades at the top."
    },
    {
      "key": "short",
      "title": "Stopping short at the bottom",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "rep-landmine-row"
        ],
        "note": "c8"
      },
      "fix": "Lower until the arms are straight."
    }
  ],
  risks: [
    {
      "key": "round",
      "text": "A rounded back strains the lower back and raises the chance of injury.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "ggr-t-bar"
        ],
        "note": "c11"
      }
    },
    {
      "key": "spine",
      "text": "Of the rows tested, the bent-over row loaded the lower spine most.",
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "fenwick2009"
        ],
        "note": "c15 (inferred: measured on the standing bent-over row)"
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
        "note": "c14"
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
    "rep-landmine-row",
    "cissik-landmine",
    "ggr-t-bar",
    "acsm2009",
    "macdougall1985",
    "fenwick2009",
    "baechle-grip",
    "odriscoll1992",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/landmine_row.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

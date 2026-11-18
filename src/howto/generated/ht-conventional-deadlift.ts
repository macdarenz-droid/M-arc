// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=fba2540fd3a7b6b82c731cd9e8526b29ad6bfcbefc2d370149ccebad9a51a32e
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_conventional_deadlift",
  name: "Conventional Deadlift",
  hashes: { inputsSha256: "fba2540fd3a7b6b82c731cd9e8526b29ad6bfcbefc2d370149ccebad9a51a32e", golden: "b949337b1a52f99cda674db0d8e8aa7985d47dd8b89d2c7548b82f3f9ee6db2a" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"conventional-deadlift-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"conventional-deadlift-n-st-head\" d=\"~#w12FUuJEgxxtX*fBjDjBjS9BbB3E3_4X4)7x8BbRhKm_4XcT1T9Bj0NmBbJmK6YkF3Fj(fT1Fj2001010100000000000000101000200002000000202000000012000000020000\"/><path id=\"conventional-deadlift-n-st-torso\" d=\"~#_12FAtJ)k-Kt*PjV9K6z30S9ShU9N6_cwgJ60K6)nIm)7Xc_4(f-4_kI6NmxgShRh_4R9)7xgBrBz1BbBrK60T90!cwgA3w8Xc)7)fw8K6_kN6J6_cBbD3w8ET2ww100110101000100000000001200120000222000000000000100000000000001000000001002100200000010000000001010000000001010120000\"/><path id=\"conventional-deadlift-n-st-thigh.r\" d=\"~#F12SEsA.E1OxsGJD1K2VbB12P6P(1S5B8S2)30BV1DbRnx1BkIdImz5*U1*2-3I6O7b_(1D11F1.bVvBa*j_G1Y1(z1(nWE110011101001000111002000000000100100120010100100010000000100020002001010000010100\"/><path id=\"conventional-deadlift-n-st-kneecap.r\" d=\"~~S_t!(T1_J10\"/><path id=\"conventional-deadlift-n-st-shank.r\" d=\"~#F12(YtP)T1).tEPS1U1-bF10W5!(1(5*7U2)3T4.y2A7Xd5*bR7Rd!2)y2-2*3x6V7)3((1E12)1-bTc!b*c!ocYlPdNo00000000101200000000002002000000101001200000000200010000000000000010000000010121\"/><path id=\"conventional-deadlift-n-st-foot.r\" d=\"~#o2FPuAB)1.xvzB(1_cF3Shx8Pp)nF-2B3OJ2-4ED1)7.n2KG1Y4Bb-cYsBbImSp020022010100101101000000000220000101100000011110\"/><path id=\"conventional-deadlift-n-st-shcap.r\" d=\"~~wSsJEqwP10\"/><path id=\"conventional-deadlift-n-st-upper.r\" d=\"~#F12HSsFKq.NsVGpj*8a1D8wO1N2G6y1B3u-D1Y7.jx2GgGcIhIaKB1-1-2.3O5P3PO192R1-8EguKawrY2HmYgUn00200020000200000101001012000100101010002000010020002101000000100000212000200022\"/><path id=\"conventional-deadlift-n-st-elbowcap.r\" d=\"~~FzuSNz1Dz10\"/><path id=\"conventional-deadlift-n-st-fore.r\" d=\"~#F12_yuSXz1.(tT.y1rKaF1W1weFG1A1*9w1V2T7xw1P3xeX2*aX9VaK8.vE2.1T5B8D7wI19(1z4O9.9H2I5SlA4WgyfNg10000020000100001111000010011100000022220012000220121001010022200002000010000200\"/><path id=\"conventional-deadlift-n-st-fist.r\" d=\"~~wTw1D(J1ww10\"/><path id=\"conventional-deadlift-n-g0-head\" d=\"~#w12YBF1(GoRBE1)wnxr_1-kI5E6.9T5S1W1B9H1VdS1OswcK6A5E8KeVcFoH6ylwaPdyg(3Wo-dJd0000020200200000000001111100000000020000010000000210000101000000\"/><path id=\"conventional-deadlift-n-g0-torso\" d=\"~#_12P*z1Y!qEzB1Bwqx3zbI2x2I4Sjw3AbrNkS4D4Jb.lBbBk.cT4JfU6wkN8PrA2Yoz2!9G4D4IhY1OJ1!8)rV5B3V6G4iWi-2A8I4OeGhK4RiJbky9yh0.2A8XT2Vu01101000000000000001000000022001110100000100010020000000210000010000100000012100100100011000101100002000000000100101\"/><path id=\"conventional-deadlift-n-g0-thigh.r\" d=\"~#F12F.mPKI1.!lKGH1E8R8voFE1!P1a-91X4-sVJ1G3-p-bKgKnOb*w1VG1O4R1K9.2Wx1(U1unE5RaGw1S8(5(K1(kFtWG1Jk02012100001000000010000101200010101110010100000000000010002200101010010000200100\"/><path id=\"conventional-deadlift-n-g0-kneecap.r\" d=\"~~!PuA)T1_J10\"/><path id=\"conventional-deadlift-n-g0-shank.r\" d=\"~#F12JOuA*T1BVuxNS1J2XbD10F2D)1F6T7(2-3txz2(7Gdi)b-6.dU6Xy2R2x4T5z8O7W(1G11G1-bGdybEeAotWlDcFp00000101000000001000001010002020001200020000002100200000000002000020000002000210\"/><path id=\"conventional-deadlift-n-g0-foot.r\" d=\"~#o2DPuAB)1XxvzB(1_cF3Phx8Pp)nH-2B3RJ2-4ED1)7*n2KG1Y4zb-cWsBbGmSp020002010100000100000000001200000121000010111110\"/><path id=\"conventional-deadlift-n-g0-shcap.r\" d=\"~~wzw1Y_vwP10\"/><path id=\"conventional-deadlift-n-g0-upper.r\" d=\"~#F12Azw1WXvIDw1zUuy1.8a2jSO1P3V5U1.2F8xD1Ab)hA1Og.8GjE3VD1G1z3X2z6I5HO1b04*8xgx2GfSoK1NmycHq10000000000101000000000000021000210002002000010120210010000100002001100101010112\"/><path id=\"conventional-deadlift-n-g0-elbowcap.r\" d=\"~~!!vUzG1Dz10\"/><path id=\"conventional-deadlift-n-g0-fore.r\" d=\"~#F12J.v_BG1V!vTGF1A1IaqY1A6FI1w3R9P1K2R1)w1w6zdjEbT7GcI2*w1-1B2z4z9pSI1l(1G2BazagG9Akw1DhYb(i00000110010200002101010100001000000000002002001200000110000000000000000100000010\"/><path id=\"conventional-deadlift-n-g0-fist.r\" d=\"~~wTw1A!S1ww10\"/><path id=\"conventional-deadlift-n-g1-head\" d=\"~#w12AwH1y!uOJG1XItRq.5Ii.aK3BbX51A4I8y5-cJ9.qHd*2F7O6KaBgSl_cPhJfS8Djx3!o)g(80000000002001010000000111002001010000001111000000000000002010102\"/><path id=\"conventional-deadlift-n-g1-torso\" d=\"~#_12HDB1(Bw1OSD1.Uv4RbV1V2T9Sh5SbO6NjA3D5AhTh)4-lzb)7ydNaAhNd(pD9PoJ4UaO1S8XfJdKH1!fVoI5z4I5K4x3Ahx5y73BfKfx9*k!5*1_8JgY4)4w7*E2VU100001000000000000000200000002000100000000010000101000000220100000000020000010100001000010000100000000000222200001002\"/><path id=\"conventional-deadlift-n-g1-thigh.r\" d=\"~#F12UYkUNK1OTjTRJ1-9T6tuSP1_E1-1V9tV4IB1XB1T8To-eTdGpO6-F1)x1V4j-9rYI1!J1srK7E9-t!eFf!I1PqFo!J1Pb00200010000000000001010000000000200000010000000000010002200200000100020001110001\"/><path id=\"conventional-deadlift-n-g1-kneecap.r\" d=\"~~Awu_(T1_J10\"/><path id=\"conventional-deadlift-n-g1-shank.r\" d=\"~#F12P(t_(T1EyuTOS1_1XbD10(4((1(5.7Y2.3V3xz2F7Rd0)bG7Rd_3xz2-2.3*5.7.4((1E12-1.b-cWbGdWo2YlFdWo00001200000020000000222100100200000200200112100000000000000001000010000000000000\"/><path id=\"conventional-deadlift-n-g1-foot.r\" d=\"~#o2APuAB)1TxvzB(1_cF3Nhx8Pp)nH-2B3TJ2-4BD1)7*n2IG1Y4Eb-cWsBbEmSp020002111100000101100020000200200101100000012100\"/><path id=\"conventional-deadlift-n-g1-shcap.r\" d=\"~~wzw1FGA1wP10\"/><path id=\"conventional-deadlift-n-g1-upper.r\" d=\"~#F12Azw1DDA1IDw1Tyz1y1.8a0jWO1P3-5U1-2F8)B1AbziA1Ig.8IjE3XD1G1x3X2z6I5HO1b04.8xgB2GfUoK1NmycJq10000001000001010000020000001100200100002000000020200010020200012000100000020010\"/><path id=\"conventional-deadlift-n-g1-elbowcap.r\" d=\"~~!!vySK1Dz10\"/><path id=\"conventional-deadlift-n-g1-fore.r\" d=\"~#F12J.vHUK1V!vBYJ1A1Gaq_1A6AI1w3O9P1K2R1)w1w6zdjEbT7EcI2)w1-1B2z4B9pWI1l_1G2zazagG9Akw1FhYb!i00000010000000002200010000001000000002002100001101000010010000020000000200000011\"/><path id=\"conventional-deadlift-n-g1-fist.r\" d=\"~~wTw1SHX1ww10\"/><path id=\"conventional-deadlift-n-e-thigh.l\" d=\"~#F12NAk(AP1R-iORO1zbx4jy1NY1Hr*3)8z2G4xK1.rze*lVh-9zqbOO1Kn-4iV9J1yV1Jx1ix1I9G7OpSlAp(D1NvPhHN1i00000000000000001210000000001001110100000002000000000000000101200020000012011100\"/><path id=\"conventional-deadlift-n-e-kneecap.l\" d=\"~~wTuJ)T1_J10\"/><path id=\"conventional-deadlift-n-e-shank.l\" d=\"~#F12PRuA*T1RXuzNS1N2XbD12!1D)1H6T7w3-3hxz2(7Bdk)bV6)dw7Ty2R2x4T5B8.7U(1E10B1.bKdwbIewox1YlycFp00010000000200000121010101000001001010000000011001000000000000101101200002101110\"/><path id=\"conventional-deadlift-n-e-foot.l\" d=\"~#o2APuDB)1TxvEB(1_cF3Ph*7NpxoF-2B3OJ2-4ED1)7*n0KG1_4BbXcWsEbEmUp000002001001000101000000000000000010120000000011\"/><path id=\"conventional-deadlift-n-e-shcap.l\" d=\"~~wzw1WXF1wP10\"/><path id=\"conventional-deadlift-n-e-upper.l\" d=\"~#F12Azw1UUF1IDw1xRE1y1.8a0jWO1P3X5U1.2F8xD1Ab)hA1Og.8GjE3XD1G1x3X2z6I5JO1b14*8xgz2GfWoK1JmycHq10000000020000000000000100001000210000002202000022200211010101002000100001010110\"/><path id=\"conventional-deadlift-n-e-elbowcap.l\" d=\"~~!!vPwS1Dz10\"/><path id=\"conventional-deadlift-n-e-fore.l\" d=\"~#F12J.vYyS1V!vRDR1A1Kaq!1A6DI1w3T9P1I2R1*w1w6EdjzbT7IcI2*w1-1B2z4z9pSI1l(1G2BazaeG9Fkw1AhYb(i00010112000200012000020000001000000000012000001000010110000001000000000001000010\"/><path id=\"conventional-deadlift-n-e-fist.l\" d=\"~~wTw1y-.1ww10\"/><path id=\"conventional-deadlift-n-e-head\" d=\"~#w12!_H1_*A1EPH1-Hz1xpKaBgzeG1ObV5B1U5O7H7Tb(d.oYdbD8z5E7Xh_iJgPeJiw5JkR7!nGi_50000000000000211010120000010100220001000001100002001000000012100\"/><path id=\"conventional-deadlift-n-e-torso\" d=\"~#_12y!B1HIB1THE1OyB1F2GbB1)2TcUfG2Fb.9wiy2S5yk.dp.lV9V9FbNcUewgAoJdJnJ8Ya8ybzeAkVE1YjXlK5R4-4-3O4SfB6w6P2*eKdVbVlw2O3H8FfU7E6(5B*1Vw200000000010000000000200000020000000000000001000020000000000021010000020000000020000001000000200010110100100010200000\"/><path id=\"conventional-deadlift-n-e-thigh.r\" d=\"^33\"/><path id=\"conventional-deadlift-n-e-kneecap.r\" d=\"^34\"/><path id=\"conventional-deadlift-n-e-shank.r\" d=\"^35\"/><path id=\"conventional-deadlift-n-e-foot.r\" d=\"^36\"/><path id=\"conventional-deadlift-n-e-shcap.r\" d=\"^37\"/><path id=\"conventional-deadlift-n-e-upper.r\" d=\"^38\"/><path id=\"conventional-deadlift-n-e-elbowcap.r\" d=\"^39\"/><path id=\"conventional-deadlift-n-e-fore.r\" d=\"^40\"/><path id=\"conventional-deadlift-n-e-fist.r\" d=\"^41\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#conventional-deadlift-n-dots)\"/>\n  <path class=\"datum\" d=\"~MwTx1FBA2L0X.D1\"/><path class=\"floorline\" d=\"M62.29 339.5H281.71\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-n-st-head\"/><use href=\"#conventional-deadlift-n-st-torso\"/><use href=\"#conventional-deadlift-n-st-thigh.r\"/><use href=\"#conventional-deadlift-n-st-kneecap.r\"/><use href=\"#conventional-deadlift-n-st-shank.r\"/><use href=\"#conventional-deadlift-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-n-st-head\"/><use href=\"#conventional-deadlift-n-st-torso\"/><use href=\"#conventional-deadlift-n-st-thigh.r\"/><use href=\"#conventional-deadlift-n-st-kneecap.r\"/><use href=\"#conventional-deadlift-n-st-shank.r\"/><use href=\"#conventional-deadlift-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-n-st-shcap.r\"/><use href=\"#conventional-deadlift-n-st-upper.r\"/><use href=\"#conventional-deadlift-n-st-elbowcap.r\"/><use href=\"#conventional-deadlift-n-st-fore.r\"/><use href=\"#conventional-deadlift-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-n-st-shcap.r\"/><use href=\"#conventional-deadlift-n-st-upper.r\"/><use href=\"#conventional-deadlift-n-st-elbowcap.r\"/><use href=\"#conventional-deadlift-n-st-fore.r\"/><use href=\"#conventional-deadlift-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-n-g0-head\"/><use href=\"#conventional-deadlift-n-g0-torso\"/><use href=\"#conventional-deadlift-n-g0-thigh.r\"/><use href=\"#conventional-deadlift-n-g0-kneecap.r\"/><use href=\"#conventional-deadlift-n-g0-shank.r\"/><use href=\"#conventional-deadlift-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-n-g0-head\"/><use href=\"#conventional-deadlift-n-g0-torso\"/><use href=\"#conventional-deadlift-n-g0-thigh.r\"/><use href=\"#conventional-deadlift-n-g0-kneecap.r\"/><use href=\"#conventional-deadlift-n-g0-shank.r\"/><use href=\"#conventional-deadlift-n-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-n-g0-shcap.r\"/><use href=\"#conventional-deadlift-n-g0-upper.r\"/><use href=\"#conventional-deadlift-n-g0-elbowcap.r\"/><use href=\"#conventional-deadlift-n-g0-fore.r\"/><use href=\"#conventional-deadlift-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-n-g0-shcap.r\"/><use href=\"#conventional-deadlift-n-g0-upper.r\"/><use href=\"#conventional-deadlift-n-g0-elbowcap.r\"/><use href=\"#conventional-deadlift-n-g0-fore.r\"/><use href=\"#conventional-deadlift-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-n-g1-head\"/><use href=\"#conventional-deadlift-n-g1-torso\"/><use href=\"#conventional-deadlift-n-g1-thigh.r\"/><use href=\"#conventional-deadlift-n-g1-kneecap.r\"/><use href=\"#conventional-deadlift-n-g1-shank.r\"/><use href=\"#conventional-deadlift-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-n-g1-head\"/><use href=\"#conventional-deadlift-n-g1-torso\"/><use href=\"#conventional-deadlift-n-g1-thigh.r\"/><use href=\"#conventional-deadlift-n-g1-kneecap.r\"/><use href=\"#conventional-deadlift-n-g1-shank.r\"/><use href=\"#conventional-deadlift-n-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-n-g1-shcap.r\"/><use href=\"#conventional-deadlift-n-g1-upper.r\"/><use href=\"#conventional-deadlift-n-g1-elbowcap.r\"/><use href=\"#conventional-deadlift-n-g1-fore.r\"/><use href=\"#conventional-deadlift-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-n-g1-shcap.r\"/><use href=\"#conventional-deadlift-n-g1-upper.r\"/><use href=\"#conventional-deadlift-n-g1-elbowcap.r\"/><use href=\"#conventional-deadlift-n-g1-fore.r\"/><use href=\"#conventional-deadlift-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-n-e-thigh.l\"/><use href=\"#conventional-deadlift-n-e-kneecap.l\"/><use href=\"#conventional-deadlift-n-e-shank.l\"/><use href=\"#conventional-deadlift-n-e-foot.l\"/><use href=\"#conventional-deadlift-n-e-shcap.l\"/><use href=\"#conventional-deadlift-n-e-upper.l\"/><use href=\"#conventional-deadlift-n-e-elbowcap.l\"/><use href=\"#conventional-deadlift-n-e-fore.l\"/><use href=\"#conventional-deadlift-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-n-e-thigh.l\"/><use href=\"#conventional-deadlift-n-e-kneecap.l\"/><use href=\"#conventional-deadlift-n-e-shank.l\"/><use href=\"#conventional-deadlift-n-e-foot.l\"/><use href=\"#conventional-deadlift-n-e-shcap.l\"/><use href=\"#conventional-deadlift-n-e-upper.l\"/><use href=\"#conventional-deadlift-n-e-elbowcap.l\"/><use href=\"#conventional-deadlift-n-e-fore.l\"/><use href=\"#conventional-deadlift-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-n-e-head\"/><use href=\"#conventional-deadlift-n-e-torso\"/><use href=\"#conventional-deadlift-n-e-thigh.r\"/><use href=\"#conventional-deadlift-n-e-kneecap.r\"/><use href=\"#conventional-deadlift-n-e-shank.r\"/><use href=\"#conventional-deadlift-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-n-e-head\"/><use href=\"#conventional-deadlift-n-e-torso\"/><use href=\"#conventional-deadlift-n-e-thigh.r\"/><use href=\"#conventional-deadlift-n-e-kneecap.r\"/><use href=\"#conventional-deadlift-n-e-shank.r\"/><use href=\"#conventional-deadlift-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-n-e-shcap.r\"/><use href=\"#conventional-deadlift-n-e-upper.r\"/><use href=\"#conventional-deadlift-n-e-elbowcap.r\"/><use href=\"#conventional-deadlift-n-e-fore.r\"/><use href=\"#conventional-deadlift-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-n-e-shcap.r\"/><use href=\"#conventional-deadlift-n-e-upper.r\"/><use href=\"#conventional-deadlift-n-e-elbowcap.r\"/><use href=\"#conventional-deadlift-n-e-fore.r\"/><use href=\"#conventional-deadlift-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~#o2(Sy1AX.1EWy1*D.1V7X3V4B7hR8!3V7A7V4(fTw2R6NA2D7H6kW9K6D7_eAz2000002200001002000000011000000010100021010000001\"/><path class=\"eq-line\" d=\"~~HBry-.1WK62\"/><path class=\"eq-thin\" d=\"~~HHsy-.1WF50\"/><path class=\"eq-solid\" d=\"~~A!w1y-.1!m1\"/><path class=\"eq-pin\" d=\"~~YJx1y-.1F60\"/><path class=\"eq-cable m-line\" d=\"~M!Gy1D(J1LX1X8LB3H1LO2P2LG1D3L0P3LH1D3LP2P2LD3H1LP31LD3E1LP2O2LH1B3L0O3LG1B3LO2O2LB3E1\"/><circle class=\"joint\" cx=\"172\" cy=\"208.59\" r=\"2.25\"/><circle class=\"joint\" cx=\"168.97\" cy=\"256.08\" r=\"2.25\"/><circle class=\"joint\" cx=\"109.07\" cy=\"235.8\" r=\"2.25\"/><circle class=\"joint\" cx=\"163.81\" cy=\"266.14\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#y20YSx1D)N1RSx1EPN1321E30p0e0a0c0c0c0r0x302010201020100020102010201020102010201000201100000000000000000010100000002000200000101000001010000010100000101010000000101000001010000010100000101000001010000010100000000010102\"/><path class=\"arrow\" d=\"~MwTx1JN_1LXiOB1LFY1PB1Z\"/></g><path class=\"leader\" d=\"~MwTx1Dy)1LYPbV5\"/><circle class=\"anchor\" cx=\"172\" cy=\"322.91\" r=\"1.5\"/><path class=\"leader\" d=\"M153.14 196.42L114.41 168H104.41\"/><circle class=\"anchor\" cx=\"153.14\" cy=\"196.42\" r=\"1.5\"/><path class=\"leader\" d=\"M172 306.09L209 274H219\"/><circle class=\"anchor\" cx=\"172\" cy=\"306.09\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"conventional-deadlift-n-midfoot\" data-key=\"midfoot\" data-cue=\"Start with the bar over the middle of your foot, shins close.\" class=\"plate-callout two\" style=\"left:63.13%;top:83.8%\" aria-pressed=\"true\">Bar over<br>midfoot</button><button type=\"button\" id=\"conventional-deadlift-n-back\" data-key=\"back\" data-cue=\"Keep your back neutral from the floor to lockout.\" class=\"plate-callout\" style=\"left:8.38%;top:40.78%\" aria-pressed=\"false\">Flat back</button><button type=\"button\" id=\"conventional-deadlift-n-close\" data-key=\"close\" data-cue=\"Keep the bar close to your legs all the way up.\" class=\"plate-callout\" style=\"left:59.78%;top:70.39%\" aria-pressed=\"false\">Bar close</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"conventional-deadlift-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"conventional-deadlift-m-st-head\" d=\"^0\"/><path id=\"conventional-deadlift-m-st-torso\" d=\"^1\"/><path id=\"conventional-deadlift-m-st-thigh.r\" d=\"^2\"/><path id=\"conventional-deadlift-m-st-kneecap.r\" d=\"^3\"/><path id=\"conventional-deadlift-m-st-shank.r\" d=\"^4\"/><path id=\"conventional-deadlift-m-st-foot.r\" d=\"^5\"/><path id=\"conventional-deadlift-m-st-shcap.r\" d=\"^6\"/><path id=\"conventional-deadlift-m-st-upper.r\" d=\"^7\"/><path id=\"conventional-deadlift-m-st-elbowcap.r\" d=\"^8\"/><path id=\"conventional-deadlift-m-st-fore.r\" d=\"^9\"/><path id=\"conventional-deadlift-m-st-fist.r\" d=\"^10\"/><path id=\"conventional-deadlift-m-g0-head\" d=\"^11\"/><path id=\"conventional-deadlift-m-g0-torso\" d=\"^12\"/><path id=\"conventional-deadlift-m-g0-thigh.r\" d=\"^13\"/><path id=\"conventional-deadlift-m-g0-kneecap.r\" d=\"^14\"/><path id=\"conventional-deadlift-m-g0-shank.r\" d=\"^15\"/><path id=\"conventional-deadlift-m-g0-foot.r\" d=\"^16\"/><path id=\"conventional-deadlift-m-g0-shcap.r\" d=\"^17\"/><path id=\"conventional-deadlift-m-g0-upper.r\" d=\"^18\"/><path id=\"conventional-deadlift-m-g0-elbowcap.r\" d=\"^19\"/><path id=\"conventional-deadlift-m-g0-fore.r\" d=\"^20\"/><path id=\"conventional-deadlift-m-g0-fist.r\" d=\"^21\"/><path id=\"conventional-deadlift-m-g1-head\" d=\"^22\"/><path id=\"conventional-deadlift-m-g1-torso\" d=\"^23\"/><path id=\"conventional-deadlift-m-g1-thigh.r\" d=\"^24\"/><path id=\"conventional-deadlift-m-g1-kneecap.r\" d=\"^25\"/><path id=\"conventional-deadlift-m-g1-shank.r\" d=\"^26\"/><path id=\"conventional-deadlift-m-g1-foot.r\" d=\"^27\"/><path id=\"conventional-deadlift-m-g1-shcap.r\" d=\"^28\"/><path id=\"conventional-deadlift-m-g1-upper.r\" d=\"^29\"/><path id=\"conventional-deadlift-m-g1-elbowcap.r\" d=\"^30\"/><path id=\"conventional-deadlift-m-g1-fore.r\" d=\"^31\"/><path id=\"conventional-deadlift-m-g1-fist.r\" d=\"^32\"/><path id=\"conventional-deadlift-m-e-thigh.l\" d=\"^33\"/><path id=\"conventional-deadlift-m-e-kneecap.l\" d=\"^34\"/><path id=\"conventional-deadlift-m-e-shank.l\" d=\"^35\"/><path id=\"conventional-deadlift-m-e-foot.l\" d=\"^36\"/><path id=\"conventional-deadlift-m-e-shcap.l\" d=\"^37\"/><path id=\"conventional-deadlift-m-e-upper.l\" d=\"^38\"/><path id=\"conventional-deadlift-m-e-elbowcap.l\" d=\"^39\"/><path id=\"conventional-deadlift-m-e-fore.l\" d=\"^40\"/><path id=\"conventional-deadlift-m-e-fist.l\" d=\"^41\"/><path id=\"conventional-deadlift-m-e-head\" d=\"^42\"/><path id=\"conventional-deadlift-m-e-torso\" d=\"^43\"/><path id=\"conventional-deadlift-m-e-thigh.r\" d=\"^33\"/><path id=\"conventional-deadlift-m-e-kneecap.r\" d=\"^34\"/><path id=\"conventional-deadlift-m-e-shank.r\" d=\"^35\"/><path id=\"conventional-deadlift-m-e-foot.r\" d=\"^36\"/><path id=\"conventional-deadlift-m-e-shcap.r\" d=\"^37\"/><path id=\"conventional-deadlift-m-e-upper.r\" d=\"^38\"/><path id=\"conventional-deadlift-m-e-elbowcap.r\" d=\"^39\"/><path id=\"conventional-deadlift-m-e-fore.r\" d=\"^40\"/><path id=\"conventional-deadlift-m-e-fist.r\" d=\"^41\"/><path id=\"conventional-deadlift-m-m-head\" d=\"~#w12F!F1JBB1GVF1XRz1EoEcBfBfdTbR5R1A6x7A8zbYfVnWdgS8O4)5BiWhWhydJjP3WkE9FnViP40000011000000000010001010001010001101000000000021000011000200021\"/><path id=\"conventional-deadlift-m-m-torso\" d=\"~#_12!!z1HEB1*IB1.xB1y3Bbv)2VdUez3AbBbDhB3U3Nrz1W9.1)b*5!fD5YkS6SrfPoK4H9B5U2XhO2IJ1H6Xszy1(h*2NW1NN1*pR6S5U3XeTcTc-le)3y8UeU8T6S5KY1)A220000000020012001010000020200102000010000000000100000010110120021002000010000002000021002000001010200000001000000202\"/><path id=\"conventional-deadlift-m-m-shcap.l\" d=\"~~J!tPGF1wP10\"/><path id=\"conventional-deadlift-m-m-upper.l\" d=\"~#F12N!tyJF1O.tIFE10*880(4JO1_2z6H1)2Y3VD1w9GjpKgxbziX7zD1R1*2R3X56WO191t-8Eg7IcDqF1PmwfYo01010100110000000002202000000101000002200020001000002001011210001110002200000101\"/><path id=\"conventional-deadlift-m-m-elbowcap.l\" d=\"~~_YuSSR1Dz10\"/><path id=\"conventional-deadlift-m-m-fore.l\" d=\"~#F12YXuw-R1XVu.!P13Kaw1Y1DbAH1Y1-9F1T2K5Ow1S4-d)1xb*8GbG6Ow1*1*1B5T8F4JI1fw2K3-9)9U1*6Aly3(gYdNh00000000100020001000001012000001000000100000001000000002100220002002002000000000\"/><path id=\"conventional-deadlift-m-m-fist.l\" d=\"~~wTw1YD.1ww10\"/><path id=\"conventional-deadlift-m-m-shcap.r\" d=\"^59\"/><path id=\"conventional-deadlift-m-m-upper.r\" d=\"^60\"/><path id=\"conventional-deadlift-m-m-elbowcap.r\" d=\"^61\"/><path id=\"conventional-deadlift-m-m-fore.r\" d=\"^62\"/><path id=\"conventional-deadlift-m-m-fist.r\" d=\"^63\"/><path id=\"conventional-deadlift-m-m-eq0\" d=\"~#o2PSy1Ax.1*Ty1TP_1)7.2R5T6O1K8!2)7U6R5H8)x2N1WA2_7S5Y1N9O5(7Nm!w2002000000000000200000000002002101200000001000100\"/><path id=\"conventional-deadlift-m-m-eq1\" d=\"~~A!w1YD.1!m1\"/><path id=\"conventional-deadlift-m-m-eq2\" d=\"~~YJx1YD.1F60\"/><path id=\"conventional-deadlift-m-m-eq3\" d=\"~~HBrYD.1WK62\"/><path id=\"conventional-deadlift-m-m-eq4\" d=\"^66\"/><path id=\"conventional-deadlift-m-mf-thigh.l\" d=\"^33\"/><path id=\"conventional-deadlift-m-mf-kneecap.l\" d=\"^34\"/><path id=\"conventional-deadlift-m-mf-shank.l\" d=\"^35\"/><path id=\"conventional-deadlift-m-mf-foot.l\" d=\"^36\"/><path id=\"conventional-deadlift-m-mf-thigh.r\" d=\"^33\"/><path id=\"conventional-deadlift-m-mf-kneecap.r\" d=\"^34\"/><path id=\"conventional-deadlift-m-mf-shank.r\" d=\"^35\"/><path id=\"conventional-deadlift-m-mf-foot.r\" d=\"^36\"/><path id=\"conventional-deadlift-m-mo-0\" d=\"^42\"/><path id=\"conventional-deadlift-m-mo-1\" d=\"^43\"/><path id=\"conventional-deadlift-m-mo-2\" d=\"^33\"/><path id=\"conventional-deadlift-m-mo-3\" d=\"^34\"/><path id=\"conventional-deadlift-m-mo-4\" d=\"^35\"/><path id=\"conventional-deadlift-m-mo-5\" d=\"^36\"/><path id=\"conventional-deadlift-m-mo-6\" d=\"^37\"/><path id=\"conventional-deadlift-m-mo-7\" d=\"^38\"/><path id=\"conventional-deadlift-m-mo-8\" d=\"^39\"/><path id=\"conventional-deadlift-m-mo-9\" d=\"^40\"/><path id=\"conventional-deadlift-m-mo-10\" d=\"^41\"/><path id=\"conventional-deadlift-m-mo-11\" d=\"^33\"/><path id=\"conventional-deadlift-m-mo-12\" d=\"^34\"/><path id=\"conventional-deadlift-m-mo-13\" d=\"^35\"/><path id=\"conventional-deadlift-m-mo-14\" d=\"^36\"/><path id=\"conventional-deadlift-m-mo-15\" d=\"^37\"/><path id=\"conventional-deadlift-m-mo-16\" d=\"^38\"/><path id=\"conventional-deadlift-m-mo-17\" d=\"^39\"/><path id=\"conventional-deadlift-m-mo-18\" d=\"^40\"/><path id=\"conventional-deadlift-m-mo-19\" d=\"^41\"/><path id=\"conventional-deadlift-m-mo-20\" d=\"^46\"/><path id=\"conventional-deadlift-m-mo-21\" d=\"^49\"/><path id=\"conventional-deadlift-m-mo-22\" d=\"^50\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#conventional-deadlift-m-dots)\"/>\n  <path class=\"datum\" d=\"^44\"/><path class=\"floorline\" d=\"^45\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-m-st-head\"/><use href=\"#conventional-deadlift-m-st-torso\"/><use href=\"#conventional-deadlift-m-st-thigh.r\"/><use href=\"#conventional-deadlift-m-st-kneecap.r\"/><use href=\"#conventional-deadlift-m-st-shank.r\"/><use href=\"#conventional-deadlift-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-m-st-head\"/><use href=\"#conventional-deadlift-m-st-torso\"/><use href=\"#conventional-deadlift-m-st-thigh.r\"/><use href=\"#conventional-deadlift-m-st-kneecap.r\"/><use href=\"#conventional-deadlift-m-st-shank.r\"/><use href=\"#conventional-deadlift-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-m-st-shcap.r\"/><use href=\"#conventional-deadlift-m-st-upper.r\"/><use href=\"#conventional-deadlift-m-st-elbowcap.r\"/><use href=\"#conventional-deadlift-m-st-fore.r\"/><use href=\"#conventional-deadlift-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-m-st-shcap.r\"/><use href=\"#conventional-deadlift-m-st-upper.r\"/><use href=\"#conventional-deadlift-m-st-elbowcap.r\"/><use href=\"#conventional-deadlift-m-st-fore.r\"/><use href=\"#conventional-deadlift-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-m-g0-head\"/><use href=\"#conventional-deadlift-m-g0-torso\"/><use href=\"#conventional-deadlift-m-g0-thigh.r\"/><use href=\"#conventional-deadlift-m-g0-kneecap.r\"/><use href=\"#conventional-deadlift-m-g0-shank.r\"/><use href=\"#conventional-deadlift-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-m-g0-head\"/><use href=\"#conventional-deadlift-m-g0-torso\"/><use href=\"#conventional-deadlift-m-g0-thigh.r\"/><use href=\"#conventional-deadlift-m-g0-kneecap.r\"/><use href=\"#conventional-deadlift-m-g0-shank.r\"/><use href=\"#conventional-deadlift-m-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-m-g0-shcap.r\"/><use href=\"#conventional-deadlift-m-g0-upper.r\"/><use href=\"#conventional-deadlift-m-g0-elbowcap.r\"/><use href=\"#conventional-deadlift-m-g0-fore.r\"/><use href=\"#conventional-deadlift-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-m-g0-shcap.r\"/><use href=\"#conventional-deadlift-m-g0-upper.r\"/><use href=\"#conventional-deadlift-m-g0-elbowcap.r\"/><use href=\"#conventional-deadlift-m-g0-fore.r\"/><use href=\"#conventional-deadlift-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-m-g1-head\"/><use href=\"#conventional-deadlift-m-g1-torso\"/><use href=\"#conventional-deadlift-m-g1-thigh.r\"/><use href=\"#conventional-deadlift-m-g1-kneecap.r\"/><use href=\"#conventional-deadlift-m-g1-shank.r\"/><use href=\"#conventional-deadlift-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-m-g1-head\"/><use href=\"#conventional-deadlift-m-g1-torso\"/><use href=\"#conventional-deadlift-m-g1-thigh.r\"/><use href=\"#conventional-deadlift-m-g1-kneecap.r\"/><use href=\"#conventional-deadlift-m-g1-shank.r\"/><use href=\"#conventional-deadlift-m-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-m-g1-shcap.r\"/><use href=\"#conventional-deadlift-m-g1-upper.r\"/><use href=\"#conventional-deadlift-m-g1-elbowcap.r\"/><use href=\"#conventional-deadlift-m-g1-fore.r\"/><use href=\"#conventional-deadlift-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-m-g1-shcap.r\"/><use href=\"#conventional-deadlift-m-g1-upper.r\"/><use href=\"#conventional-deadlift-m-g1-elbowcap.r\"/><use href=\"#conventional-deadlift-m-g1-fore.r\"/><use href=\"#conventional-deadlift-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-m-e-thigh.l\"/><use href=\"#conventional-deadlift-m-e-kneecap.l\"/><use href=\"#conventional-deadlift-m-e-shank.l\"/><use href=\"#conventional-deadlift-m-e-foot.l\"/><use href=\"#conventional-deadlift-m-e-shcap.l\"/><use href=\"#conventional-deadlift-m-e-upper.l\"/><use href=\"#conventional-deadlift-m-e-elbowcap.l\"/><use href=\"#conventional-deadlift-m-e-fore.l\"/><use href=\"#conventional-deadlift-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-m-e-thigh.l\"/><use href=\"#conventional-deadlift-m-e-kneecap.l\"/><use href=\"#conventional-deadlift-m-e-shank.l\"/><use href=\"#conventional-deadlift-m-e-foot.l\"/><use href=\"#conventional-deadlift-m-e-shcap.l\"/><use href=\"#conventional-deadlift-m-e-upper.l\"/><use href=\"#conventional-deadlift-m-e-elbowcap.l\"/><use href=\"#conventional-deadlift-m-e-fore.l\"/><use href=\"#conventional-deadlift-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-m-e-head\"/><use href=\"#conventional-deadlift-m-e-torso\"/><use href=\"#conventional-deadlift-m-e-thigh.r\"/><use href=\"#conventional-deadlift-m-e-kneecap.r\"/><use href=\"#conventional-deadlift-m-e-shank.r\"/><use href=\"#conventional-deadlift-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-m-e-head\"/><use href=\"#conventional-deadlift-m-e-torso\"/><use href=\"#conventional-deadlift-m-e-thigh.r\"/><use href=\"#conventional-deadlift-m-e-kneecap.r\"/><use href=\"#conventional-deadlift-m-e-shank.r\"/><use href=\"#conventional-deadlift-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-m-e-shcap.r\"/><use href=\"#conventional-deadlift-m-e-upper.r\"/><use href=\"#conventional-deadlift-m-e-elbowcap.r\"/><use href=\"#conventional-deadlift-m-e-fore.r\"/><use href=\"#conventional-deadlift-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#conventional-deadlift-m-e-shcap.r\"/><use href=\"#conventional-deadlift-m-e-upper.r\"/><use href=\"#conventional-deadlift-m-e-elbowcap.r\"/><use href=\"#conventional-deadlift-m-e-fore.r\"/><use href=\"#conventional-deadlift-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^46\"/><path class=\"eq-line\" d=\"^47\"/><path class=\"eq-thin\" d=\"^48\"/><path class=\"eq-solid\" d=\"^49\"/><path class=\"eq-pin\" d=\"^50\"/><path class=\"eq-cable m-line\" d=\"^51\"/><circle class=\"joint\" cx=\"172\" cy=\"208.59\" r=\"2.25\"/><circle class=\"joint\" cx=\"168.97\" cy=\"256.08\" r=\"2.25\"/><circle class=\"joint\" cx=\"109.07\" cy=\"235.8\" r=\"2.25\"/><circle class=\"joint\" cx=\"163.81\" cy=\"266.14\" r=\"2.25\"/></g><mask id=\"conventional-deadlift-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#conventional-deadlift-m-m-head\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-m-torso\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-mf-shank.l\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-mf-foot.l\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-m-shcap.l\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-m-upper.l\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-m-fore.l\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-m-fist.l\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-mf-shank.r\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-mf-foot.r\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-m-shcap.r\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-m-upper.r\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-m-fore.r\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-m-fist.r\" fill=\"#000\"/><use href=\"#conventional-deadlift-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#conventional-deadlift-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#conventional-deadlift-m-mmask)\"><g class=\"u-stroke\"><use href=\"#conventional-deadlift-m-m-head\"/><use href=\"#conventional-deadlift-m-m-torso\"/><use href=\"#conventional-deadlift-m-m-shcap.l\"/><use href=\"#conventional-deadlift-m-m-upper.l\"/><use href=\"#conventional-deadlift-m-m-elbowcap.l\"/><use href=\"#conventional-deadlift-m-m-fore.l\"/><use href=\"#conventional-deadlift-m-m-fist.l\"/><use href=\"#conventional-deadlift-m-m-shcap.r\"/><use href=\"#conventional-deadlift-m-m-upper.r\"/><use href=\"#conventional-deadlift-m-m-elbowcap.r\"/><use href=\"#conventional-deadlift-m-m-fore.r\"/><use href=\"#conventional-deadlift-m-m-fist.r\"/><use href=\"#conventional-deadlift-m-m-eq0\"/><use href=\"#conventional-deadlift-m-m-eq1\"/><use href=\"#conventional-deadlift-m-m-eq2\"/><use href=\"#conventional-deadlift-m-m-eq3\"/><use href=\"#conventional-deadlift-m-m-eq4\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MHOkUAH1LSaBpLD2N2Ly2H2Ly2N2LD2H2Ly2N2LA2J2LA2J2LA2J2Ly2J2LA2J2LA2J2Ly2N2LA2H2LA2N2LA2H2\"/><path class=\"m-arrow\" d=\"~M!In(!y1L!J1!U2MGsIdLHsJdLKnEJ1\"/><path class=\"leader m\" d=\"M123.81 195.59L104.93 174H94.93\"/><path class=\"leader m\" d=\"M104.85 215.78L93.75 248H83.75\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"conventional-deadlift-m-round\" data-key=\"round\" data-cue=\"The lower back rounds as the bar leaves the floor.\" class=\"plate-callout two m\" style=\"left:2.23%;top:42.46%\" aria-pressed=\"true\">Lower back<br>rounds</button><button type=\"button\" id=\"conventional-deadlift-m-tuck\" data-key=\"tuck\" data-cue=\"The hips tuck under and the back curls over the bar.\" class=\"plate-callout two m\" style=\"left:3.35%;top:63.13%\" aria-pressed=\"false\">Hips tuck<br>under</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "midfoot",
        cues: [{ key: "midfoot", cue: "Start with the bar over the middle of your foot, shins close." }, { key: "back", cue: "Keep your back neutral from the floor to lockout." }, { key: "close", cue: "Keep the bar close to your legs all the way up." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "round",
        cues: [{ key: "round", cue: "The lower back rounds as the bar leaves the floor." }, { key: "tuck", cue: "The hips tuck under and the back curls over the bar." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Lower back rounds</b><span>The lower back rounds as the bar leaves the floor.</span></li><li><b>Hips tuck under</b><span>The hips tuck under and the back curls over the bar.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lift 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lift</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Conventional deadlift, side view. With the bar on the floor over the middle of the foot, shins close, arms straight and vertical, back flat, the lifter pulls the bar up close to the legs to stand tall, then lowers it back to the floor.",
      mistakeAlt: "Conventional Deadlift: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hold",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: dl-grip is a placement zoom (grip width, hands outside the knees), not a hand pose; its Right and Wrong are text checkpoints.",
    "orientation": "pronated",
    "handle": "bar-28",
    "width": {
      "text": "About shoulder width, arms just outside the knees.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-deadlift"
        ],
        "note": "c3"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "baechle-grip",
          "sl-deadlift"
        ],
        "note": "c21; card inherit[0] grip.thumb (romanian_deadlift)"
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "ext": [
        -10,
        10
      ],
      "limitText": "Keep the wrist neutral, in line with the forearm.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-deadlift"
        ],
        "note": "inherit:2 (card inherit[2] grip.wrist, romanian_deadlift; the card notes call the neutral wrist a drawing convention; W4 content K2: not c4). The ext range is the hold archetype's (GA 3.1), a convention, not a card number."
      }
    },
    "pose": {
      "thumb": "wrapped"
    },
    "faults": [],
    "gripLine": "Overhand, thumbs wrapped, hands about shoulder width, outside the knees. Use mixed grip or straps only when grip limits heavy sets.",
    "cue": "Thumbs wrapped, arms straight."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "get-in",
      "text": "Load full-size plates. Bar over mid-foot, feet about hip width.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-deadlift",
          "ace-deadlift"
        ],
        "note": "c23, c1, c2"
      }
    },
    {
      "kind": "grip",
      "text": "Grip about shoulder width, arms straight outside the knees.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-deadlift"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "brace",
      "text": "Breathe in and brace. Build tension slowly before liftoff.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-deadlift"
        ],
        "note": "c5, c22"
      }
    },
    {
      "kind": "position",
      "text": "Finish tall: hips and knees locked, shoulders back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-deadlift",
          "ace-deadlift"
        ],
        "note": "c10"
      }
    },
    {
      "kind": "position",
      "text": "To lower, push hips back first. Bend knees once the bar passes.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-deadlift"
        ],
        "note": "c11"
      }
    }
  ],
  posture: [
    {
      "key": "shins",
      "label": "Shins close",
      "detail": "Shins close to or touching the bar at the start.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "dl-start",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-deadlift"
        ],
        "note": "c1"
      }
    },
    {
      "key": "arms",
      "label": "Arms straight",
      "detail": "Arms straight and vertical from the side.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "zoom": "dl-start",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-deadlift"
        ],
        "note": "c4"
      }
    },
    {
      "key": "back",
      "label": "Flat back",
      "detail": "Back flat from floor to lockout.",
      "anchor": {
        "pose": "end",
        "at": "lumbar"
      },
      "zoom": "dl-start",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-deadlift",
          "sl-deadlift"
        ],
        "note": "c7"
      }
    },
    {
      "key": "bar",
      "label": "Bar close",
      "detail": "Bar travels close to the body.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-deadlift"
        ],
        "note": "c6"
      }
    },
    {
      "key": "lockout",
      "label": "Tall finish",
      "detail": "Finish tall: hips and knees locked, shoulders back.",
      "anchor": {
        "pose": "start",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-deadlift",
          "ace-deadlift"
        ],
        "note": "c10"
      }
    },
    {
      "key": "lower",
      "label": "Hips first",
      "detail": "To lower, push the hips back first. Bend the knees once the bar passes them.",
      "anchor": {
        "pose": "start",
        "at": "buttock"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-deadlift"
        ],
        "note": "c11"
      }
    }
  ],
  zooms: [
    {
      "key": "dl-start",
      "chip": "Start",
      "heading": "Start position",
      "kind": "posture",
      "feelRow": "low-back-over"
    },
    {
      "key": "dl-liftoff",
      "chip": "Liftoff",
      "heading": "Liftoff",
      "kind": "posture"
    }
  ],
  chips: [
    "dl-start",
    "dl-liftoff",
    "feel"
  ],
  copy: {
    "setupLine": "Bar over mid-foot, shins close. Grip about shoulder width, arms straight outside the knees.",
    "mistakeLine": "Never let your back round as the weight goes up. Lower the weight instead.",
    "cueLine": "Bar close, back flat."
  },
  mistakes: [
    {
      "key": "round",
      "title": "Back rounding under heavier weight",
      "zoom": "dl-start",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-deadlift"
        ],
        "note": "c8"
      },
      "fix": "Lower the weight or do fewer reps per set."
    },
    {
      "key": "hips",
      "title": "Hips shooting up first",
      "zoom": "dl-liftoff",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-deadlift"
        ],
        "note": "c9"
      },
      "fix": "Be patient off the floor so the legs start the pull."
    },
    {
      "key": "arms",
      "title": "Hands too wide, arms bent",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-deadlift"
        ],
        "note": "c3, c4"
      },
      "fix": "Grip about shoulder width. Straighten the arms before pulling."
    }
  ],
  risks: [
    {
      "key": "round",
      "text": "A rounded back loads the spine's discs and bones more.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "sl-deadlift",
          "cherni2026"
        ],
        "note": "c19"
      }
    },
    {
      "key": "breath",
      "text": "Heavy reps with a held breath send blood pressure very high.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "macdougall1985"
        ],
        "note": "c20"
      }
    },
    {
      "key": "jumps",
      "text": "Big load jumps appear linked with more injuries. Add weight in small steps.",
      "claim": {
        "tags": [
          "WEAK",
          "CONSENSUS"
        ],
        "sources": [
          "cherni2026",
          "sl-deadlift",
          "acsm2009"
        ],
        "note": "c18, c17"
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
    "sl-deadlift",
    "ace-deadlift",
    "acsm2009",
    "martinfuentes2020",
    "lee2018",
    "cherni2026",
    "macdougall1985",
    "baechle-grip",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/conventional_deadlift.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

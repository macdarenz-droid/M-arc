// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=a0073cfec8d51293fc925d30ba0e54c4a596efa670c7003510bcce41ebc8a4d4
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_sumo_deadlift",
  name: "Sumo Deadlift",
  hashes: { inputsSha256: "a0073cfec8d51293fc925d30ba0e54c4a596efa670c7003510bcce41ebc8a4d4", golden: "0700a3415830891ecf79135f7835e21141a393c5b0969442175e9aa3bd38aa6c" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"sumo-deadlift-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"sumo-deadlift-n-st-head\" d=\"~#w12yUuSFg-wt*(fEjDjEjS9zbB3E3_4X4)7)7BbThKmY4XcO1T9Ej0JmBbNmK6YkF3Fj(fT1Fj0001111100002000002000000010001002200010000010000010000000020000\"/><path id=\"sumo-deadlift-n-st-torso\" d=\"~#_12yAtSwlTKtzSjT9K6E30U9ShU9N6_cwgJ60K6)nGm)7.c_4wg-4!kI6HmxgUhRh_4R9)7xgBrBz1BbBrK60R90YcwgF3w8.c)7*fw8I6_kH6J6!cBbD3w8ET2ww100010101000100002000000000000000000010000000201110000020000021000000000000001000000000000000202000101020000010000000\"/><path id=\"sumo-deadlift-n-st-thigh.r\" d=\"~#F12JEsJ!E1ExsTKD1K2VbE12U6J(1S5z8P2x41)U1DbTnvzkOdImB5-U1*2-3G6K7bW(1F13F1Xb-vGa-j!G1_1!z1!nYE100000010000200000000100220000002001100100100000220000001000002010100210000021002\"/><path id=\"sumo-deadlift-n-st-kneecap.r\" d=\"~~__tJ)T1_J10\"/><path id=\"sumo-deadlift-n-st-shank.r\" d=\"~#F12D-tywU1B!t-PS1S1.bH10_5_(1!5*7U2)3X4-y2A7Vd5)bR7OdY2.y2-2*3z6X7-3w)1G11)1VbTcYb.c(ocWlSdNo02000022000000000000110000002202000200002201010002220011011000010000000101110100\"/><path id=\"sumo-deadlift-n-st-foot.r\" d=\"~#o2URuDB)1EzvEB(1ScF3Nh)7Np)nFY2B3TI2-4VB1)7Vn2)F1Y4.aXcNsEbGmUp001000000020000101010000000200000000000110120000\"/><path id=\"sumo-deadlift-n-st-shcap.r\" d=\"~~_RsSFqwP10\"/><path id=\"sumo-deadlift-n-st-upper.r\" d=\"~#F12DSsPNqXNs)Hpj*8a0D8!N1N2E6y1B3w1-D1U7Xj)1KgEcGhKaIB1.1-2-3K5P3JO1b4O1-8EgsKawr_2HmWgWn01010100001010000000012000020021002002000210000002000002100101010000212000001000\"/><path id=\"sumo-deadlift-n-st-elbowcap.r\" d=\"~~DzuNOz1Dz10\"/><path id=\"sumo-deadlift-n-st-fore.r\" d=\"~#F12WyuNYz1V(tT!y1tGaF1S1weDG1A1*9y1V2V7.vP3zeX2.aX9TaO8-vB2-1V5B8F7!H17w2B4R9*9F2G5UlA4UgyfNg00021021010000000101000010011000000022010000000020002220000000101202000010000202\"/><path id=\"sumo-deadlift-n-st-fist.r\" d=\"~~wTw1(*J1ww10\"/><path id=\"sumo-deadlift-n-g0-head\" d=\"~#w12DBF1WHo*AE1-xn)q_1-kG5I6X9O5P1S1E9J1TdN1OswcK6y5G8KeTcFoF6Al!9SdAg(3WoXdJd1000200010000000200011020000000002101000002000200000020000200110\"/><path id=\"sumo-deadlift-n-g0-torso\" d=\"~#_12A*z1Y*q-yB1xxqx3zbK2x2E4Pj(2DbnNkS4A4Fb.lzbzk*cT4JfS6ykN8Nry2_oE2_9E4A4KhW1OJ1_8)rV5B3X6G4mWi.2A8I4KeGhK4OiNbky9wh1-2A8-T2Ou02000200000001011020010110000000201000001000000000000010100101010000000000002100000000000000000000000000000000020020\"/><path id=\"sumo-deadlift-n-g0-thigh.r\" d=\"~#F12y!mPOI1V*lVIH1I8O8toAE1UP1a.90V4VsEJ1G3.p.bKgInKb-w1EG1O4R1I9-2Sx1SU1w1jI5TaIw1N8y6(K1(kFtWG1Hk00011000000010000120000100210011010000101001000000010100120000002000200200002100\"/><path id=\"sumo-deadlift-n-g0-kneecap.r\" d=\"~~wRuy)T1_J10\"/><path id=\"sumo-deadlift-n-g0-shank.r\" d=\"~#F12NOuD*T1BVuzNS1J2XbF10F2D)1H6T7!2-3tzz2_7Edg)bX6*dP6Xy2T2)3T5z8K7W(1E11G1-bGdAbBeAotWlFcDp10200101200200000000000120101000010101000202100000000100000000010001000101110100\"/><path id=\"sumo-deadlift-n-g0-foot.r\" d=\"~#o2JRuAB)1XyvzB(1ScF3Jhx8Fp)nFY2B3TI2-4-B1)7Tn2)F1Y4)a-cJsBbxmSp120002010100000101001010001200000111000000010100\"/><path id=\"sumo-deadlift-n-g0-shcap.r\" d=\"~~wzw1w!vwP10\"/><path id=\"sumo-deadlift-n-g0-upper.r\" d=\"~#F12Azw1(YvIDw1KVuy1-8a0jSO1P3X5U1-2D8*B1Fbziy1Ig.8IjE3VD1G1x3X2x6I5DO1b24*8xgB2GfUoK1NmycJq10000000000100000002000000200100000100012100000220210110000000002000000000020010\"/><path id=\"sumo-deadlift-n-g0-elbowcap.r\" d=\"~~!!vPAG1Dz10\"/><path id=\"sumo-deadlift-n-g0-fore.r\" d=\"~#F12J.vYDG1V!vVHF1y1GauY1y6AI1w3T9P1I2R1Xw1w6BdjEbT7GcI2Xw1.1B2)3z9rNI1l(1G2BazaeG9Akw1FhYb!i00000001200000012000020200001001200000002000000021000010000100000200001200000010\"/><path id=\"sumo-deadlift-n-g0-fist.r\" d=\"~~wTw1(.S1ww10\"/><path id=\"sumo-deadlift-n-g1-head\" d=\"~#w12S)G1S!uXIG1IJtTqV5Ki.aK3zbX53A4G8w5.cF9.qJd)2D7R6KaxgSlWcPhHfW8Fj)2Yo)gA90100100000000000000000001000000100000000000010100000020001000000\"/><path id=\"sumo-deadlift-n-g1-torso\" d=\"~#_12!BB1!Dw1)RD1VVv4RbX1V2R9Wh3NbO6PjD3D5whTh*4*lEb-7AdHaDhJd(pA9PoH4WaR1N8XfFdKH1_f-oI5x4I5K4x3Ah)4y75zfKfx9*k(5.1!8HgU4*4y7zF2OU102000000101210010100000000020000000000010100000011110000001200000010100000010101000000200000000000000000000000000020\"/><path id=\"sumo-deadlift-n-g1-thigh.r\" d=\"~#F12S-kDRK1RUjOUJ1.9O6psJP1NE1-1T9vV4)A1GB1V8Ro*eTdEpI6RF1Rx1T4h-9pSI1PJ1utK7B9)t_eJf_I1PqDoyK1Jb00000000010020121001012101000002000000100020000000100120001010001000101101002011\"/><path id=\"sumo-deadlift-n-g1-kneecap.r\" d=\"~~_)tY(T1_J10\"/><path id=\"sumo-deadlift-n-g1-shank.r\" d=\"~#F12D(t!(T1-xuTOS1Y1-bH10w5((1(5.7Y2*3*3)y2H7Td1*bI7VdU3*y2-2.3)5*7T4w)1G12-1.b-cYbBdYo4WlFdUo00000000000000101000000000000000000101000002000000002010120001000202000101001000\"/><path id=\"sumo-deadlift-n-g1-foot.r\" d=\"~#o2FRuAB)1OyvzB(1ScF3Hhx8Dp)nFY2B3TI2-4.B1)7Tn2*F1Y4xb-cJsBbxmSp021012110100000101200000000200200101000020010100\"/><path id=\"sumo-deadlift-n-g1-shcap.r\" d=\"~~wzw1PHA1wP10\"/><path id=\"sumo-deadlift-n-g1-upper.r\" d=\"~#F12Azw1NEA1IDw1.zz1y1*8a2jSO1P3V5U1.2D8)B1Fb)hy1Og.8GjE3TD1G1z3X2z6I5HO1b04)8xgx2GfSoK1NmycHq10000000020000020000000000200000010000022001000020200010000001002200000101010112\"/><path id=\"sumo-deadlift-n-g1-elbowcap.r\" d=\"~~!!vyTK1Dz10\"/><path id=\"sumo-deadlift-n-g1-fore.r\" d=\"~#F12J.vFVK1V!vB-J1y1Gau_1y6wI1w3O9P1K2R1-w1w6zdjEbT7GcI2Vw1.1G2)3x9rNI1l(1G2zazaaG9Fkw1AhYb(i00000200200000002001010000001000200002002200010120000210020000000000001000000010\"/><path id=\"sumo-deadlift-n-g1-fist.r\" d=\"~~wTw1PHX1ww10\"/><path id=\"sumo-deadlift-n-e-thigh.l\" d=\"~#F12PWj(PS1zGiBDS1Tb-1bA1w!1!fR5x8-2.3XP1Kixi.iBjB6XpU4GS1VdO4J1B9H3_-1PmcE1OaG5Il!pAw1Nx1Dy1AbSK1B801010100010000000000000020000000020000002101000000100210001100002001010002101000\"/><path id=\"sumo-deadlift-n-e-kneecap.l\" d=\"~~YRuN)T1_J10\"/><path id=\"sumo-deadlift-n-e-shank.l\" d=\"~#F12DPuN*T1*VuKNS1F2XbH14A2w)1H6R7!2-3p)y2!7Gdg)bV6.dS6Vy2O2x4V5z8R7W(1E11G1.bEdybGeAovWlFcFp10100000020001101000000000000000000200000020000010101000000000002000000000000200\"/><path id=\"sumo-deadlift-n-e-foot.l\" d=\"~#o2ARuDB)1GyvEB(1WcF3Fh)7yp)nFY2B3TI2X4*B1x8Tn0.F1_4BbXcJsEb*lUp000002000200000000200200100000200000022100000001\"/><path id=\"sumo-deadlift-n-e-shcap.l\" d=\"~~DAuH!F1wP10\"/><path id=\"sumo-deadlift-n-e-upper.l\" d=\"~#F12FAuD(F1XzuO_E12*8a1F4PO1w3z6F1x3F4RD1H9xjjOg-aGiG7BD1O1.2K3X5fPO192n.8GgfTcyqsNmWe(o10001101010200012000100020000220000101000000220002000100002000000101000101000002\"/><path id=\"sumo-deadlift-n-e-elbowcap.l\" d=\"~~_!uDBS1Dz10\"/><path id=\"sumo-deadlift-n-e-fore.l\" d=\"~#F12W.uDIS1x_uzOR10Iay1W1PaAH1w2V9D1T2*4Kw1Y4Xd*1xbX8Ob.5Ew1*1z2x5R8W3HI1f(1G3-9zaJ1x7ylY2whSdSh00001010101000000001000000200111012100021000011000101000000000010000200010100002\"/><path id=\"sumo-deadlift-n-e-fist.l\" d=\"~~wTw1y-.1ww10\"/><path id=\"sumo-deadlift-n-e-head\" d=\"~#w12SyF1yRz1GOE1Twy1Kq)5IizbI3zbV53D4G8A5-cS9-qJd-2F7O6GaBgPl(cJhNfJ8HjB3_oxh!80001200000001200020210110100000000001010100000010100100200000002\"/><path id=\"sumo-deadlift-n-e-torso\" d=\"~#_12NFz1!-A1XUA1BGA18ObX1V2V9Ph7SbV6Hjw3F5HhBhR4KlBb-7DdFaFhFdwqy9PoA4WaT1J8-f(cOH1Yf.oB6T3I5-2X1wgx5y71BfIfB9*kY5)1_8Hg_4x5w7RE2BV100000210000000000000100002100101010000000000000000011000001101100000000100002001000000010010020000000010101010010100\"/><path id=\"sumo-deadlift-n-e-thigh.r\" d=\"^33\"/><path id=\"sumo-deadlift-n-e-kneecap.r\" d=\"^34\"/><path id=\"sumo-deadlift-n-e-shank.r\" d=\"^35\"/><path id=\"sumo-deadlift-n-e-foot.r\" d=\"^36\"/><path id=\"sumo-deadlift-n-e-shcap.r\" d=\"^37\"/><path id=\"sumo-deadlift-n-e-upper.r\" d=\"^38\"/><path id=\"sumo-deadlift-n-e-elbowcap.r\" d=\"^39\"/><path id=\"sumo-deadlift-n-e-fore.r\" d=\"^40\"/><path id=\"sumo-deadlift-n-e-fist.r\" d=\"^41\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#sumo-deadlift-n-dots)\"/>\n  <path class=\"datum\" d=\"~MwTx1FBA2L0X.D1\"/><path class=\"floorline\" d=\"M62.29 339.5H281.71\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-n-st-head\"/><use href=\"#sumo-deadlift-n-st-torso\"/><use href=\"#sumo-deadlift-n-st-thigh.r\"/><use href=\"#sumo-deadlift-n-st-kneecap.r\"/><use href=\"#sumo-deadlift-n-st-shank.r\"/><use href=\"#sumo-deadlift-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-n-st-head\"/><use href=\"#sumo-deadlift-n-st-torso\"/><use href=\"#sumo-deadlift-n-st-thigh.r\"/><use href=\"#sumo-deadlift-n-st-kneecap.r\"/><use href=\"#sumo-deadlift-n-st-shank.r\"/><use href=\"#sumo-deadlift-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-n-st-shcap.r\"/><use href=\"#sumo-deadlift-n-st-upper.r\"/><use href=\"#sumo-deadlift-n-st-elbowcap.r\"/><use href=\"#sumo-deadlift-n-st-fore.r\"/><use href=\"#sumo-deadlift-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-n-st-shcap.r\"/><use href=\"#sumo-deadlift-n-st-upper.r\"/><use href=\"#sumo-deadlift-n-st-elbowcap.r\"/><use href=\"#sumo-deadlift-n-st-fore.r\"/><use href=\"#sumo-deadlift-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-n-g0-head\"/><use href=\"#sumo-deadlift-n-g0-torso\"/><use href=\"#sumo-deadlift-n-g0-thigh.r\"/><use href=\"#sumo-deadlift-n-g0-kneecap.r\"/><use href=\"#sumo-deadlift-n-g0-shank.r\"/><use href=\"#sumo-deadlift-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-n-g0-head\"/><use href=\"#sumo-deadlift-n-g0-torso\"/><use href=\"#sumo-deadlift-n-g0-thigh.r\"/><use href=\"#sumo-deadlift-n-g0-kneecap.r\"/><use href=\"#sumo-deadlift-n-g0-shank.r\"/><use href=\"#sumo-deadlift-n-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-n-g0-shcap.r\"/><use href=\"#sumo-deadlift-n-g0-upper.r\"/><use href=\"#sumo-deadlift-n-g0-elbowcap.r\"/><use href=\"#sumo-deadlift-n-g0-fore.r\"/><use href=\"#sumo-deadlift-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-n-g0-shcap.r\"/><use href=\"#sumo-deadlift-n-g0-upper.r\"/><use href=\"#sumo-deadlift-n-g0-elbowcap.r\"/><use href=\"#sumo-deadlift-n-g0-fore.r\"/><use href=\"#sumo-deadlift-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-n-g1-head\"/><use href=\"#sumo-deadlift-n-g1-torso\"/><use href=\"#sumo-deadlift-n-g1-thigh.r\"/><use href=\"#sumo-deadlift-n-g1-kneecap.r\"/><use href=\"#sumo-deadlift-n-g1-shank.r\"/><use href=\"#sumo-deadlift-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-n-g1-head\"/><use href=\"#sumo-deadlift-n-g1-torso\"/><use href=\"#sumo-deadlift-n-g1-thigh.r\"/><use href=\"#sumo-deadlift-n-g1-kneecap.r\"/><use href=\"#sumo-deadlift-n-g1-shank.r\"/><use href=\"#sumo-deadlift-n-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-n-g1-shcap.r\"/><use href=\"#sumo-deadlift-n-g1-upper.r\"/><use href=\"#sumo-deadlift-n-g1-elbowcap.r\"/><use href=\"#sumo-deadlift-n-g1-fore.r\"/><use href=\"#sumo-deadlift-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-n-g1-shcap.r\"/><use href=\"#sumo-deadlift-n-g1-upper.r\"/><use href=\"#sumo-deadlift-n-g1-elbowcap.r\"/><use href=\"#sumo-deadlift-n-g1-fore.r\"/><use href=\"#sumo-deadlift-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-n-e-thigh.l\"/><use href=\"#sumo-deadlift-n-e-kneecap.l\"/><use href=\"#sumo-deadlift-n-e-shank.l\"/><use href=\"#sumo-deadlift-n-e-foot.l\"/><use href=\"#sumo-deadlift-n-e-shcap.l\"/><use href=\"#sumo-deadlift-n-e-upper.l\"/><use href=\"#sumo-deadlift-n-e-elbowcap.l\"/><use href=\"#sumo-deadlift-n-e-fore.l\"/><use href=\"#sumo-deadlift-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-n-e-thigh.l\"/><use href=\"#sumo-deadlift-n-e-kneecap.l\"/><use href=\"#sumo-deadlift-n-e-shank.l\"/><use href=\"#sumo-deadlift-n-e-foot.l\"/><use href=\"#sumo-deadlift-n-e-shcap.l\"/><use href=\"#sumo-deadlift-n-e-upper.l\"/><use href=\"#sumo-deadlift-n-e-elbowcap.l\"/><use href=\"#sumo-deadlift-n-e-fore.l\"/><use href=\"#sumo-deadlift-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-n-e-head\"/><use href=\"#sumo-deadlift-n-e-torso\"/><use href=\"#sumo-deadlift-n-e-thigh.r\"/><use href=\"#sumo-deadlift-n-e-kneecap.r\"/><use href=\"#sumo-deadlift-n-e-shank.r\"/><use href=\"#sumo-deadlift-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-n-e-head\"/><use href=\"#sumo-deadlift-n-e-torso\"/><use href=\"#sumo-deadlift-n-e-thigh.r\"/><use href=\"#sumo-deadlift-n-e-kneecap.r\"/><use href=\"#sumo-deadlift-n-e-shank.r\"/><use href=\"#sumo-deadlift-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-n-e-shcap.r\"/><use href=\"#sumo-deadlift-n-e-upper.r\"/><use href=\"#sumo-deadlift-n-e-elbowcap.r\"/><use href=\"#sumo-deadlift-n-e-fore.r\"/><use href=\"#sumo-deadlift-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-n-e-shcap.r\"/><use href=\"#sumo-deadlift-n-e-upper.r\"/><use href=\"#sumo-deadlift-n-e-elbowcap.r\"/><use href=\"#sumo-deadlift-n-e-fore.r\"/><use href=\"#sumo-deadlift-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~#o2SSy1_T.1BUy1Gz.1)7x3K5R6K1O8w3)7W6O5D9Rx2gNA2_7S5S1S9R5_7Sl(w2010000000000000000200000000000010100000000100000\"/><path class=\"eq-line\" d=\"~~HBry-.1WK62\"/><path class=\"eq-thin\" d=\"~~HHsy-.1WF50\"/><path class=\"eq-solid\" d=\"~~A!w1y-.1!m1\"/><path class=\"eq-pin\" d=\"~~YJx1y-.1F60\"/><path class=\"eq-cable m-line\" d=\"~M!Gy1(*J1LX1X8LB3H1LO2P2LG1D3L0P3LH1D3LP2P2LD3H1LP30LD3I1LP2I2LH1G3L0I3LG1G3LO2I2LB3I1\"/><circle class=\"joint\" cx=\"161.95\" cy=\"209.33\" r=\"2.25\"/><circle class=\"joint\" cx=\"163.84\" cy=\"256.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"104.68\" cy=\"247.02\" r=\"2.25\"/><circle class=\"joint\" cx=\"163.61\" cy=\"266.15\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#y20YSx1y)N1RSx1zPN1301z30r0c0e0a0c0c0t0*201020001020102010201020102010200010201020102100000000000010100000001010000000000000000010100000200010100000101000001010000010100000101000001010000000001010000010100000101000000\"/><path class=\"arrow\" d=\"~MwTx1JN_1LXiOB1LFY1PB1Z\"/></g><path class=\"leader\" d=\"M172 306.09L209 274H219\"/><circle class=\"anchor\" cx=\"172\" cy=\"306.09\" r=\"1.5\"/><path class=\"leader\" d=\"M171.54 224.47L217 194H227\"/><circle class=\"anchor\" cx=\"171.54\" cy=\"224.47\" r=\"1.5\"/><path class=\"leader\" d=\"M163.61 266.15L126.97 304H116.97\"/><circle class=\"anchor\" cx=\"163.61\" cy=\"266.15\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"sumo-deadlift-n-shins\" data-key=\"shins\" data-cue=\"Keep the bar against your shins so it does not drift forward.\" class=\"plate-callout two\" style=\"left:59.78%;top:70.39%\" aria-pressed=\"true\">Bar on<br>shins</button><button type=\"button\" id=\"sumo-deadlift-n-chest\" data-key=\"chest\" data-cue=\"Keep your chest up and your back straight, trunk more upright.\" class=\"plate-callout\" style=\"left:62.01%;top:48.04%\" aria-pressed=\"false\">Chest up</button><button type=\"button\" id=\"sumo-deadlift-n-legs\" data-key=\"legs\" data-cue=\"Push with your legs to break the bar from the floor.\" class=\"plate-callout two\" style=\"left:11.17%;top:78.77%\" aria-pressed=\"false\">Legs drive<br>first</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"sumo-deadlift-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"sumo-deadlift-m-st-head\" d=\"^0\"/><path id=\"sumo-deadlift-m-st-torso\" d=\"^1\"/><path id=\"sumo-deadlift-m-st-thigh.r\" d=\"^2\"/><path id=\"sumo-deadlift-m-st-kneecap.r\" d=\"^3\"/><path id=\"sumo-deadlift-m-st-shank.r\" d=\"^4\"/><path id=\"sumo-deadlift-m-st-foot.r\" d=\"^5\"/><path id=\"sumo-deadlift-m-st-shcap.r\" d=\"^6\"/><path id=\"sumo-deadlift-m-st-upper.r\" d=\"^7\"/><path id=\"sumo-deadlift-m-st-elbowcap.r\" d=\"^8\"/><path id=\"sumo-deadlift-m-st-fore.r\" d=\"^9\"/><path id=\"sumo-deadlift-m-st-fist.r\" d=\"^10\"/><path id=\"sumo-deadlift-m-g0-head\" d=\"^11\"/><path id=\"sumo-deadlift-m-g0-torso\" d=\"^12\"/><path id=\"sumo-deadlift-m-g0-thigh.r\" d=\"^13\"/><path id=\"sumo-deadlift-m-g0-kneecap.r\" d=\"^14\"/><path id=\"sumo-deadlift-m-g0-shank.r\" d=\"^15\"/><path id=\"sumo-deadlift-m-g0-foot.r\" d=\"^16\"/><path id=\"sumo-deadlift-m-g0-shcap.r\" d=\"^17\"/><path id=\"sumo-deadlift-m-g0-upper.r\" d=\"^18\"/><path id=\"sumo-deadlift-m-g0-elbowcap.r\" d=\"^19\"/><path id=\"sumo-deadlift-m-g0-fore.r\" d=\"^20\"/><path id=\"sumo-deadlift-m-g0-fist.r\" d=\"^21\"/><path id=\"sumo-deadlift-m-g1-head\" d=\"^22\"/><path id=\"sumo-deadlift-m-g1-torso\" d=\"^23\"/><path id=\"sumo-deadlift-m-g1-thigh.r\" d=\"^24\"/><path id=\"sumo-deadlift-m-g1-kneecap.r\" d=\"^25\"/><path id=\"sumo-deadlift-m-g1-shank.r\" d=\"^26\"/><path id=\"sumo-deadlift-m-g1-foot.r\" d=\"^27\"/><path id=\"sumo-deadlift-m-g1-shcap.r\" d=\"^28\"/><path id=\"sumo-deadlift-m-g1-upper.r\" d=\"^29\"/><path id=\"sumo-deadlift-m-g1-elbowcap.r\" d=\"^30\"/><path id=\"sumo-deadlift-m-g1-fore.r\" d=\"^31\"/><path id=\"sumo-deadlift-m-g1-fist.r\" d=\"^32\"/><path id=\"sumo-deadlift-m-e-thigh.l\" d=\"^33\"/><path id=\"sumo-deadlift-m-e-kneecap.l\" d=\"^34\"/><path id=\"sumo-deadlift-m-e-shank.l\" d=\"^35\"/><path id=\"sumo-deadlift-m-e-foot.l\" d=\"^36\"/><path id=\"sumo-deadlift-m-e-shcap.l\" d=\"^37\"/><path id=\"sumo-deadlift-m-e-upper.l\" d=\"^38\"/><path id=\"sumo-deadlift-m-e-elbowcap.l\" d=\"^39\"/><path id=\"sumo-deadlift-m-e-fore.l\" d=\"^40\"/><path id=\"sumo-deadlift-m-e-fist.l\" d=\"^41\"/><path id=\"sumo-deadlift-m-e-head\" d=\"^42\"/><path id=\"sumo-deadlift-m-e-torso\" d=\"^43\"/><path id=\"sumo-deadlift-m-e-thigh.r\" d=\"^33\"/><path id=\"sumo-deadlift-m-e-kneecap.r\" d=\"^34\"/><path id=\"sumo-deadlift-m-e-shank.r\" d=\"^35\"/><path id=\"sumo-deadlift-m-e-foot.r\" d=\"^36\"/><path id=\"sumo-deadlift-m-e-shcap.r\" d=\"^37\"/><path id=\"sumo-deadlift-m-e-upper.r\" d=\"^38\"/><path id=\"sumo-deadlift-m-e-elbowcap.r\" d=\"^39\"/><path id=\"sumo-deadlift-m-e-fore.r\" d=\"^40\"/><path id=\"sumo-deadlift-m-e-fist.r\" d=\"^41\"/><path id=\"sumo-deadlift-m-m-head\" d=\"~#w12AOH1YPB1KEH1E*z1Ko-bIfxfjTbR5K1w6z7(7EbNf*nUdaS8T4E6zi(hPhHdyj_3Wk.8JnVi_40000000111000000000200001100000010000000000000111101010010100001\"/><path id=\"sumo-deadlift-m-m-torso\" d=\"~#_12_OB1yVB1-(D1)NB1(2zbx1)2Od_e*2Ab.aHhW1_5!k-cc-l)8EaJawd_d!gDn_ewnU9Uaq!bIdJmKD1wlTkB5.4T4x4I5FfO6W5J3-eXcKc-lo*3A8_eN8R6U5K-1zA201020000001101101121000002010100000001001000000002010000102200000000100010001000000220010122000200000000001000101211\"/><path id=\"sumo-deadlift-m-m-thigh.l\" d=\"~#F12PAj(JO1G.h-WN1XaX4ly1yW1!uG3E9V1K4VH1RuRc*m*g.a)pB2IK1Iq-48V9oFS1YA1mz1X8-7ErSjJmUF1DuPjFN1!301000210100210100000001010000102000001001100000021100000012000001202000000200200\"/><path id=\"sumo-deadlift-m-m-kneecap.l\" d=\"~~UEtU)T1_J10\"/><path id=\"sumo-deadlift-m-m-shank.l\" d=\"~#F12ADtSyU1-DtBTS1w1.bF13(8S(1J5E8S2z4x8Ry2N6zen.bE8Bdf)y2*2-3R6K7nA)1E12T2Tb)bPcTbNpH1Wl!eYn00000000000000100001000000000100020111022000210010012000000010000001011000012002\"/><path id=\"sumo-deadlift-m-m-foot.l\" d=\"~#o2ARuDB)1GyvEB(1UcF3Hh)7Ap*nAY2E3RI2-4.B1)7Vn0*F1_4xbXcHsEb*lUp000002200200001001010000000010100020022000000001\"/><path id=\"sumo-deadlift-m-m-shcap.l\" d=\"~~YPvH-F1wP10\"/><path id=\"sumo-deadlift-m-m-upper.l\" d=\"~#F12YPvYXF1.SvBUE1o.882sSO1H3-5S1*2w7ED1WaGikKgO9zjI4OD1K1x3.2x6x4PO1715*8zgT1TeyplNm_cwq00001010000021101011111001100020000000020010100100101001010101000210000101000101\"/><path id=\"sumo-deadlift-m-m-elbowcap.l\" d=\"~~PTvFyS1Dz10\"/><path id=\"sumo-deadlift-m-m-fore.l\" d=\"~#F12ySvUBS1OSvRGR1oGau_1N7YH1U2R9N1O2R2Vw1W5IdvBb)7zcK3Tw1-1z2I4)8eNI1h(1T2xaBamT8NkS1DhDcPi00000200000100100000010000101101010100101210120001111100000000101000200010100100\"/><path id=\"sumo-deadlift-m-m-thigh.r\" d=\"^59\"/><path id=\"sumo-deadlift-m-m-kneecap.r\" d=\"^60\"/><path id=\"sumo-deadlift-m-m-shank.r\" d=\"^61\"/><path id=\"sumo-deadlift-m-m-foot.r\" d=\"^62\"/><path id=\"sumo-deadlift-m-m-shcap.r\" d=\"^63\"/><path id=\"sumo-deadlift-m-m-upper.r\" d=\"^64\"/><path id=\"sumo-deadlift-m-m-elbowcap.r\" d=\"^65\"/><path id=\"sumo-deadlift-m-m-fore.r\" d=\"^66\"/><path id=\"sumo-deadlift-m-m-eq0\" d=\"~#o2!Sy1AW.1VVy1-B.1-7R3*4x7nO8U3X7(6)4yeXw2R4HA2J7A6uU9E6J7!gJy2000000000002002002011000000000010000000010000200\"/><path id=\"sumo-deadlift-m-mf-fist.l\" d=\"^41\"/><path id=\"sumo-deadlift-m-mf-fist.r\" d=\"^41\"/><path id=\"sumo-deadlift-m-mo-0\" d=\"^42\"/><path id=\"sumo-deadlift-m-mo-1\" d=\"^43\"/><path id=\"sumo-deadlift-m-mo-2\" d=\"^33\"/><path id=\"sumo-deadlift-m-mo-3\" d=\"^34\"/><path id=\"sumo-deadlift-m-mo-4\" d=\"^35\"/><path id=\"sumo-deadlift-m-mo-5\" d=\"^36\"/><path id=\"sumo-deadlift-m-mo-6\" d=\"^37\"/><path id=\"sumo-deadlift-m-mo-7\" d=\"^38\"/><path id=\"sumo-deadlift-m-mo-8\" d=\"^39\"/><path id=\"sumo-deadlift-m-mo-9\" d=\"^40\"/><path id=\"sumo-deadlift-m-mo-10\" d=\"^41\"/><path id=\"sumo-deadlift-m-mo-11\" d=\"^33\"/><path id=\"sumo-deadlift-m-mo-12\" d=\"^34\"/><path id=\"sumo-deadlift-m-mo-13\" d=\"^35\"/><path id=\"sumo-deadlift-m-mo-14\" d=\"^36\"/><path id=\"sumo-deadlift-m-mo-15\" d=\"^37\"/><path id=\"sumo-deadlift-m-mo-16\" d=\"^38\"/><path id=\"sumo-deadlift-m-mo-17\" d=\"^39\"/><path id=\"sumo-deadlift-m-mo-18\" d=\"^40\"/><path id=\"sumo-deadlift-m-mo-19\" d=\"^41\"/><path id=\"sumo-deadlift-m-mo-20\" d=\"^46\"/><path id=\"sumo-deadlift-m-mo-21\" d=\"^49\"/><path id=\"sumo-deadlift-m-mo-22\" d=\"^50\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#sumo-deadlift-m-dots)\"/>\n  <path class=\"datum\" d=\"^44\"/><path class=\"floorline\" d=\"^45\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-m-st-head\"/><use href=\"#sumo-deadlift-m-st-torso\"/><use href=\"#sumo-deadlift-m-st-thigh.r\"/><use href=\"#sumo-deadlift-m-st-kneecap.r\"/><use href=\"#sumo-deadlift-m-st-shank.r\"/><use href=\"#sumo-deadlift-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-m-st-head\"/><use href=\"#sumo-deadlift-m-st-torso\"/><use href=\"#sumo-deadlift-m-st-thigh.r\"/><use href=\"#sumo-deadlift-m-st-kneecap.r\"/><use href=\"#sumo-deadlift-m-st-shank.r\"/><use href=\"#sumo-deadlift-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-m-st-shcap.r\"/><use href=\"#sumo-deadlift-m-st-upper.r\"/><use href=\"#sumo-deadlift-m-st-elbowcap.r\"/><use href=\"#sumo-deadlift-m-st-fore.r\"/><use href=\"#sumo-deadlift-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-m-st-shcap.r\"/><use href=\"#sumo-deadlift-m-st-upper.r\"/><use href=\"#sumo-deadlift-m-st-elbowcap.r\"/><use href=\"#sumo-deadlift-m-st-fore.r\"/><use href=\"#sumo-deadlift-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-m-g0-head\"/><use href=\"#sumo-deadlift-m-g0-torso\"/><use href=\"#sumo-deadlift-m-g0-thigh.r\"/><use href=\"#sumo-deadlift-m-g0-kneecap.r\"/><use href=\"#sumo-deadlift-m-g0-shank.r\"/><use href=\"#sumo-deadlift-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-m-g0-head\"/><use href=\"#sumo-deadlift-m-g0-torso\"/><use href=\"#sumo-deadlift-m-g0-thigh.r\"/><use href=\"#sumo-deadlift-m-g0-kneecap.r\"/><use href=\"#sumo-deadlift-m-g0-shank.r\"/><use href=\"#sumo-deadlift-m-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-m-g0-shcap.r\"/><use href=\"#sumo-deadlift-m-g0-upper.r\"/><use href=\"#sumo-deadlift-m-g0-elbowcap.r\"/><use href=\"#sumo-deadlift-m-g0-fore.r\"/><use href=\"#sumo-deadlift-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-m-g0-shcap.r\"/><use href=\"#sumo-deadlift-m-g0-upper.r\"/><use href=\"#sumo-deadlift-m-g0-elbowcap.r\"/><use href=\"#sumo-deadlift-m-g0-fore.r\"/><use href=\"#sumo-deadlift-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-m-g1-head\"/><use href=\"#sumo-deadlift-m-g1-torso\"/><use href=\"#sumo-deadlift-m-g1-thigh.r\"/><use href=\"#sumo-deadlift-m-g1-kneecap.r\"/><use href=\"#sumo-deadlift-m-g1-shank.r\"/><use href=\"#sumo-deadlift-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-m-g1-head\"/><use href=\"#sumo-deadlift-m-g1-torso\"/><use href=\"#sumo-deadlift-m-g1-thigh.r\"/><use href=\"#sumo-deadlift-m-g1-kneecap.r\"/><use href=\"#sumo-deadlift-m-g1-shank.r\"/><use href=\"#sumo-deadlift-m-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-m-g1-shcap.r\"/><use href=\"#sumo-deadlift-m-g1-upper.r\"/><use href=\"#sumo-deadlift-m-g1-elbowcap.r\"/><use href=\"#sumo-deadlift-m-g1-fore.r\"/><use href=\"#sumo-deadlift-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-m-g1-shcap.r\"/><use href=\"#sumo-deadlift-m-g1-upper.r\"/><use href=\"#sumo-deadlift-m-g1-elbowcap.r\"/><use href=\"#sumo-deadlift-m-g1-fore.r\"/><use href=\"#sumo-deadlift-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-m-e-thigh.l\"/><use href=\"#sumo-deadlift-m-e-kneecap.l\"/><use href=\"#sumo-deadlift-m-e-shank.l\"/><use href=\"#sumo-deadlift-m-e-foot.l\"/><use href=\"#sumo-deadlift-m-e-shcap.l\"/><use href=\"#sumo-deadlift-m-e-upper.l\"/><use href=\"#sumo-deadlift-m-e-elbowcap.l\"/><use href=\"#sumo-deadlift-m-e-fore.l\"/><use href=\"#sumo-deadlift-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-m-e-thigh.l\"/><use href=\"#sumo-deadlift-m-e-kneecap.l\"/><use href=\"#sumo-deadlift-m-e-shank.l\"/><use href=\"#sumo-deadlift-m-e-foot.l\"/><use href=\"#sumo-deadlift-m-e-shcap.l\"/><use href=\"#sumo-deadlift-m-e-upper.l\"/><use href=\"#sumo-deadlift-m-e-elbowcap.l\"/><use href=\"#sumo-deadlift-m-e-fore.l\"/><use href=\"#sumo-deadlift-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-m-e-head\"/><use href=\"#sumo-deadlift-m-e-torso\"/><use href=\"#sumo-deadlift-m-e-thigh.r\"/><use href=\"#sumo-deadlift-m-e-kneecap.r\"/><use href=\"#sumo-deadlift-m-e-shank.r\"/><use href=\"#sumo-deadlift-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-m-e-head\"/><use href=\"#sumo-deadlift-m-e-torso\"/><use href=\"#sumo-deadlift-m-e-thigh.r\"/><use href=\"#sumo-deadlift-m-e-kneecap.r\"/><use href=\"#sumo-deadlift-m-e-shank.r\"/><use href=\"#sumo-deadlift-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-m-e-shcap.r\"/><use href=\"#sumo-deadlift-m-e-upper.r\"/><use href=\"#sumo-deadlift-m-e-elbowcap.r\"/><use href=\"#sumo-deadlift-m-e-fore.r\"/><use href=\"#sumo-deadlift-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#sumo-deadlift-m-e-shcap.r\"/><use href=\"#sumo-deadlift-m-e-upper.r\"/><use href=\"#sumo-deadlift-m-e-elbowcap.r\"/><use href=\"#sumo-deadlift-m-e-fore.r\"/><use href=\"#sumo-deadlift-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^46\"/><path class=\"eq-line\" d=\"^47\"/><path class=\"eq-thin\" d=\"^48\"/><path class=\"eq-solid\" d=\"^49\"/><path class=\"eq-pin\" d=\"^50\"/><path class=\"eq-cable m-line\" d=\"^51\"/><circle class=\"joint\" cx=\"161.95\" cy=\"209.33\" r=\"2.25\"/><circle class=\"joint\" cx=\"163.84\" cy=\"256.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"104.68\" cy=\"247.02\" r=\"2.25\"/><circle class=\"joint\" cx=\"163.61\" cy=\"266.15\" r=\"2.25\"/></g><mask id=\"sumo-deadlift-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#sumo-deadlift-m-m-head\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-torso\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-thigh.l\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-shank.l\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-foot.l\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-shcap.l\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-upper.l\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-fore.l\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-mf-fist.l\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-thigh.r\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-shank.r\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-foot.r\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-shcap.r\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-upper.r\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-m-fore.r\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-mf-fist.r\" fill=\"#000\"/><use href=\"#sumo-deadlift-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#sumo-deadlift-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#sumo-deadlift-m-mmask)\"><g class=\"u-stroke\"><use href=\"#sumo-deadlift-m-m-head\"/><use href=\"#sumo-deadlift-m-m-torso\"/><use href=\"#sumo-deadlift-m-m-thigh.l\"/><use href=\"#sumo-deadlift-m-m-kneecap.l\"/><use href=\"#sumo-deadlift-m-m-shank.l\"/><use href=\"#sumo-deadlift-m-m-foot.l\"/><use href=\"#sumo-deadlift-m-m-shcap.l\"/><use href=\"#sumo-deadlift-m-m-upper.l\"/><use href=\"#sumo-deadlift-m-m-elbowcap.l\"/><use href=\"#sumo-deadlift-m-m-fore.l\"/><use href=\"#sumo-deadlift-m-m-thigh.r\"/><use href=\"#sumo-deadlift-m-m-kneecap.r\"/><use href=\"#sumo-deadlift-m-m-shank.r\"/><use href=\"#sumo-deadlift-m-m-foot.r\"/><use href=\"#sumo-deadlift-m-m-shcap.r\"/><use href=\"#sumo-deadlift-m-m-upper.r\"/><use href=\"#sumo-deadlift-m-m-elbowcap.r\"/><use href=\"#sumo-deadlift-m-m-fore.r\"/><use href=\"#sumo-deadlift-m-m-eq0\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MF)e!EP1L0K.2MYiwpLXi)oL0wS1\"/><path class=\"leader m\" d=\"~MFSiU_G1L0Jb\"/><path class=\"leader m\" d=\"M174.93 225.79L227 200H237\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"sumo-deadlift-m-hips\" data-key=\"hips\" data-cue=\"The hips rise first while the bar stays on the floor.\" class=\"plate-callout two m\" style=\"left:2.23%;top:49.16%\" aria-pressed=\"true\">Hips shoot<br>up</button><button type=\"button\" id=\"sumo-deadlift-m-chest\" data-key=\"chest\" data-cue=\"The chest drops toward the bar and the back takes the lift.\" class=\"plate-callout two m\" style=\"left:64.8%;top:49.72%\" aria-pressed=\"false\">Chest<br>drops</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "shins",
        cues: [{ key: "shins", cue: "Keep the bar against your shins so it does not drift forward." }, { key: "chest", cue: "Keep your chest up and your back straight, trunk more upright." }, { key: "legs", cue: "Push with your legs to break the bar from the floor." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "hips",
        cues: [{ key: "hips", cue: "The hips rise first while the bar stays on the floor." }, { key: "chest", cue: "The chest drops toward the bar and the back takes the lift." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Hips shoot up</b><span>The hips rise first while the bar stays on the floor.</span></li><li><b>Chest drops</b><span>The chest drops toward the bar and the back takes the lift.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lift 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lift</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Sumo deadlift, side view. With the bar on the floor against the shins, hands inside the knees, chest up and the trunk more upright than a conventional pull, the lifter drives with the legs to stand tall, then lowers the bar back to the floor.",
      mistakeAlt: "Sumo Deadlift: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hold",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: sumo-grip is a placement zoom (hands inside the knees), not a hand pose; its Right and Wrong are text checkpoints.",
    "orientation": "pronated",
    "handle": "bar-28",
    "width": {
      "text": "Narrower than conventional: hands closer together, arms inside the knees.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "sl-deadlift",
          "escamilla2000"
        ],
        "note": "c3"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "sl-deadlift",
          "escamilla2000"
        ],
        "note": "c3; card inherit[0] grip.thumb (conventional_deadlift)"
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
          "sl-sumo"
        ],
        "note": "inherit:2 (card inherit[2] grip.wrist, conventional_deadlift; the card notes call the neutral wrist a drawing convention; W4 content K2: not c15). The ext range is the hold archetype's (GA 3.1), a convention, not a card number."
      }
    },
    "pose": {
      "thumb": "wrapped"
    },
    "faults": [],
    "gripLine": "Overhand, thumbs wrapped, hands inside the knees.",
    "cue": "Arms inside knees, chest up."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Wide stance, toes out, bar over mid-foot, shins vertical from the front.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "sl-sumo",
          "barbend-sumo",
          "escamilla2000"
        ],
        "note": "c1, c2"
      }
    },
    {
      "kind": "grip",
      "text": "Arms inside the knees, not outside as in a conventional pull.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "sl-deadlift",
          "escamilla2000"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "position",
      "text": "Chest up, bar against your shins.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-sumo"
        ],
        "note": "c13"
      }
    },
    {
      "kind": "brace",
      "text": "Build tension, then take a full breath into the belly.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-sumo",
          "sl-sumo"
        ],
        "note": "c10"
      }
    },
    {
      "kind": "load",
      "text": "Practise with light weight. Add load in small steps.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-sumo",
          "acsm2009"
        ],
        "note": "c18"
      }
    }
  ],
  posture: [
    {
      "key": "trunk",
      "label": "Upright trunk",
      "detail": "Trunk more upright than in a conventional deadlift.",
      "anchor": {
        "pose": "end",
        "at": "sternum"
      },
      "zoom": "sumo-start",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "escamilla2000",
          "sl-deadlift"
        ],
        "note": "c4"
      }
    },
    {
      "key": "back",
      "label": "Straight back",
      "detail": "Back straight from floor to lockout.",
      "anchor": {
        "pose": "end",
        "at": "lumbar"
      },
      "zoom": "sumo-start",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sumo"
        ],
        "note": "c15"
      }
    },
    {
      "key": "legs",
      "label": "Legs first",
      "detail": "Legs start the lift. Hips do not rise first.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "zoom": "sumo-start",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-sumo"
        ],
        "note": "c11"
      }
    },
    {
      "key": "bar",
      "label": "Bar on shins",
      "detail": "Bar close, against the shins.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "zoom": "sumo-start",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-sumo"
        ],
        "note": "c13"
      }
    },
    {
      "key": "lockout",
      "label": "Joint lockout",
      "detail": "Knees and hips lock out together.",
      "anchor": {
        "pose": "start",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-sumo"
        ],
        "note": "c14"
      }
    },
    {
      "key": "lower",
      "label": "Controlled lowering",
      "detail": "Lower the bar with control.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-sumo"
        ],
        "note": "c16"
      }
    }
  ],
  zooms: [
    {
      "key": "sumo-start",
      "chip": "Start",
      "heading": "Start position",
      "kind": "posture",
      "feelRow": "low-back-early"
    }
  ],
  chips: [
    "sumo-start",
    "feel"
  ],
  copy: {
    "setupLine": "Wide stance, toes out, bar over mid-foot. Arms inside the knees.",
    "mistakeLine": "Never let your hips shoot up first. Keep driving with the legs.",
    "cueLine": "Chest up, bar on shins."
  },
  mistakes: [
    {
      "key": "hips",
      "title": "Hips shooting up first",
      "zoom": "sumo-start",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-sumo"
        ],
        "note": "c12, c14"
      },
      "fix": "Be patient, drive with the legs. Lock knees and hips together."
    },
    {
      "key": "rush",
      "title": "Rushing the setup",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-sumo",
          "sl-sumo"
        ],
        "note": "c17, c16"
      },
      "fix": "Set feet, grip and brace before each pull. Lower with control."
    },
    {
      "key": "drift",
      "title": "Bar drifting off the shins",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-sumo"
        ],
        "note": "c13"
      },
      "fix": "Chest up and keep the bar against the shins."
    }
  ],
  risks: [
    {
      "key": "back",
      "text": "Sumo loads the lower back a little less, but heavier weight can offset that.",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "cholewicki1991",
          "barbend-sumo"
        ],
        "note": "c5, c6"
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
        "note": "c19"
      }
    },
    {
      "key": "hips",
      "text": "Hips rising first shifts the lift onto the back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-sumo"
        ],
        "note": "c12"
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
    "sl-sumo",
    "barbend-sumo",
    "escamilla2000",
    "sl-deadlift",
    "cholewicki1991",
    "escamilla2002",
    "hanen2025",
    "acsm2009",
    "macdougall1985",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/sumo_deadlift.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=7c910c4cda9012ac01ee3b7fdffd352d60397b8d59155c72486d183661dfcdac
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_kettlebell_swing",
  name: "Kettlebell Swing",
  hashes: { inputsSha256: "7c910c4cda9012ac01ee3b7fdffd352d60397b8d59155c72486d183661dfcdac", golden: "9a5bc95b6bbed58b0e63141f47b3e5277db97b69ee5c9d5aeeb8671e839a6359" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"kettlebell-swing-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"kettlebell-swing-n-st-thigh.l\" d=\"~#F12((kFwG1)KkRUE1x5VaE1cAlY_1P3E9S1K4TczT1H5RpX5IjIiKiKhXR1X3.2)7X5PeU!1D19R1VbIx1X2I9NK1DaJy1Yw1wx100010000000200200100020010012100000200000002101200200002000200000010001110022000\"/><path id=\"kettlebell-swing-n-st-kneecap.l\" d=\"~~YHpN)T1_J10\"/><path id=\"kettlebell-swing-n-st-shank.l\" d=\"~#F12DGpAxU1BIp-RS1J1.bF11D7W(1W5x8U2)3G6Xy2!6.dd)b.7GdH1*y2*2.3E6V7O2A)1E10E2VbIcAcGcApoWlDeDo00000100000000000000021001200000000012000001000121000200002000020000001000000000\"/><path id=\"kettlebell-swing-n-st-foot.l\" d=\"~#o2(HqDB)1x!qEB(1FcF3_g)7Yo)nYV2B3KG2X4TA1x8)m0XE1_4TaXcUrEbVlUp000022001220000020000200000000002000021000100001\"/><path id=\"kettlebell-swing-n-st-shcap.l\" d=\"~~SFz1HHF1wP10\"/><path id=\"kettlebell-swing-n-st-upper.l\" d=\"~#F12!GA1U!D1xIB1*SD1N8B228xI1JgJ6F1F3iHA1X5(k!3Ufx5_eEfYw1VgF2B2S4-4OJ1_b57A8z3-2xgOsE5Il!6zk!k02000000011010001002202000000000000200011110020101000000100020022020000000000210\"/><path id=\"kettlebell-swing-n-st-elbowcap.l\" d=\"~~UzrPyI1Dz10\"/><path id=\"kettlebell-swing-n-st-fore.l\" d=\"~#F12!_rW)G1EVs.-G1!9O1K1F1GD1_gU9eW2qHtR9HeJ2UaV3_9RaAtKaS1E2H7E6OF1Da*15Y8X4)1xa*lT3GgU5zfFg21200000000000000000000000000000111000000000001000000021010002000001000200002000\"/><path id=\"kettlebell-swing-n-st-fist.l\" d=\"~~(HiSzN1ww10\"/><path id=\"kettlebell-swing-n-st-head\" d=\"~#w12SYN1HHF1ByO1xXD1zjEjV9EjF3zb-4E3w8X4Db)7NmThYcY4U9O10EjDbJmN6NmE3Yk*fFjEjT10020010110000200100200000101000110022001000001200001000020000000\"/><path id=\"kettlebell-swing-n-st-torso\" d=\"~#_12SwH1H_D1*NI1.zE1J6T90E3ThU9I6U9)f_c0J6woK6w8Gm-4.c_4wgN6!k(fHmUhUhU9_4(f)7Fz1BrDrBb0K60R9)fYc)7F3w8.c)7*f-kI6I6H6Db!c)7D3)vET200001001100010000200000100010000000001000000020111000000001002000000000000010100000000010000020200210102100001000000\"/><path id=\"kettlebell-swing-n-st-thigh.r\" d=\"^0\"/><path id=\"kettlebell-swing-n-st-kneecap.r\" d=\"^1\"/><path id=\"kettlebell-swing-n-st-shank.r\" d=\"^2\"/><path id=\"kettlebell-swing-n-st-foot.r\" d=\"^3\"/><path id=\"kettlebell-swing-n-st-shcap.r\" d=\"^4\"/><path id=\"kettlebell-swing-n-st-upper.r\" d=\"^5\"/><path id=\"kettlebell-swing-n-st-elbowcap.r\" d=\"^6\"/><path id=\"kettlebell-swing-n-st-fore.r\" d=\"^7\"/><path id=\"kettlebell-swing-n-st-fist.r\" d=\"^8\"/><path id=\"kettlebell-swing-n-g0-shcap.r\" d=\"~~J!tPBx1wP10\"/><path id=\"kettlebell-swing-n-g0-upper.r\" d=\"~#F12W!tPwx1ExuI(vJ1O8a0K2(K1Y3I5Y1X2P9Gz1(bRhY1Igx8Vj*1RA1z1*2O2z6E7NK190gT8.fx4Gg(nI2Jmwb!q00000000000002000000010000101002000001010000202000001012000020010000001200020010\"/><path id=\"kettlebell-swing-n-g0-elbowcap.r\" d=\"~~DItYyH1Dz10\"/><path id=\"kettlebell-swing-n-g0-fore.r\" d=\"~#F12WGtDwH1RNtRBG1J2V9k_1i(G1D4X8Y1x2U2*uY7EcqBb)5Ed_1*uO1I2*2B9I6NG1rW1x1*9)9)1-b_iG1AhD9Jk01100000000000000000000101010000001001000000101000002001000000012000001000002000\"/><path id=\"kettlebell-swing-n-g0-fist.r\" d=\"~~D-s!NT1ww10\"/><path id=\"kettlebell-swing-n-g1-shcap.r\" d=\"~~DTn_IswP10\"/><path id=\"kettlebell-swing-n-g1-upper.r\" d=\"~#F12UwoAKtKGnXTsT5K667Sx1HvV1E6tz3*k*tX5KkKb.bBkO6Et)l)2x1E6*1yuWy156G6-5EdN9_7wsSfAgUr!800001011000100000200000210000000000000011000000000101000000000200102001010000000\"/><path id=\"kettlebell-swing-n-g1-elbowcap.r\" d=\"~~!DuA_y1Dz10\"/><path id=\"kettlebell-swing-n-g1-fore.r\" d=\"~#F12PPuSUz1B)tV)y1*5x8!1mNw1Pq)3-8fV2)l.lK4.dx8V7)dx4RmzlX2f)8T3WrPvq_1I8T5.7N6Y6DlJc!bJlA600000020000001000000000001111002001101000200011200000020000210000010011001120000\"/><path id=\"kettlebell-swing-n-g1-fist.r\" d=\"~~UyB1FIG1ww10\"/><path id=\"kettlebell-swing-n-e-thigh.l\" d=\"~#F12J-oy_E1BVoEID1)1VbB12w4J(1!5-7Y2.3y2*U1Dcxn5BkRc*m*2-U1-2-3)5-7)2P(1H10W1VbGvXbRlyG18wA1HmUF100010000000000000000220001002000000001200002000001000100021012101010100012000101\"/><path id=\"kettlebell-swing-n-e-kneecap.l\" d=\"~~U!pwwU1_J10\"/><path id=\"kettlebell-swing-n-e-shank.l\" d=\"~#F12y.pU)T1E)pTPS1w2VbD10H4_(1A6-7W2.3z3Xy2J7Rd4*bB7XdH4Ty2X2)3.5.7I5Y(1E10X1-b*cNbKdSo3Ylwd_o00000010101000000010120020000020002100002000210020002202100010101000202200000000\"/><path id=\"kettlebell-swing-n-e-foot.l\" d=\"~#o2NIqFB)1)!qGB(1DcA3wh*7wp*n_V2B3IG2-4RA1*7.m0*E1Y4KaVc_rEb)lSp000001001000100101100010022000100000100001000000\"/><path id=\"kettlebell-swing-n-e-shcap.l\" d=\"~~DWpJGqwP10\"/><path id=\"kettlebell-swing-n-e-upper.l\" d=\"~#F12P)q(YrR*pETrO8R14bWK1y4E5)3T2X1.y1XaEhRcEgG2*jH7RA1o)2w1z6H2yK1Y81cR8pT4WfJnDhFmA3Fr)900100000011000010002000000000021010020000200000000101012101111110002000000220000\"/><path id=\"kettlebell-swing-n-e-elbowcap.l\" d=\"~~_(y1HRrDz10\"/><path id=\"kettlebell-swing-n-e-fore.l\" d=\"~#F12D(z1(VsXzz1BPsR9V2_1h(G1sR8O4x2-1-uV3)bz8zbB1OdP5.uX2I2H1G9U2DG1_7W1u)9mE2(9HiPcDh_1SkK810000000000001000000200000002020000200200001000000010100000000010111000101101100\"/><path id=\"kettlebell-swing-n-e-fist.l\" d=\"~~NKJ1UPsww10\"/><path id=\"kettlebell-swing-n-e-head\" d=\"~#w12DDrJGg)SpX)fBjDjBjS9EbB3z3_4.4)7*7BbThKm_4XcT1T9Bj0JmBbNmK6_kF3Dj(fT1Fj0001010110100000000010000000000002001000000000002002000000020010\"/><path id=\"kettlebell-swing-n-e-torso\" d=\"~#_12DWpJxl-)p*SjR9K6B30S9ShU9N6YcwgN60I6)nKm)7-c_4yg-4YkI6NmxgShRh_4R9)7xgBrBz1EbBrI60R90YcwgF3w8-c)7)fw8K6_kN6J6YcBbF3w8BT2ww100010101001100100200000200020010121000002000000110100000001001101000000002000200002000000000001010100000000020020002\"/><path id=\"kettlebell-swing-n-e-thigh.r\" d=\"^21\"/><path id=\"kettlebell-swing-n-e-kneecap.r\" d=\"^22\"/><path id=\"kettlebell-swing-n-e-shank.r\" d=\"^23\"/><path id=\"kettlebell-swing-n-e-foot.r\" d=\"^24\"/><path id=\"kettlebell-swing-n-e-shcap.r\" d=\"^25\"/><path id=\"kettlebell-swing-n-e-upper.r\" d=\"^26\"/><path id=\"kettlebell-swing-n-e-elbowcap.r\" d=\"^27\"/><path id=\"kettlebell-swing-n-e-fore.r\" d=\"^28\"/><path id=\"kettlebell-swing-n-e-fist.r\" d=\"^29\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#kettlebell-swing-n-dots)\"/>\n  <path class=\"floorline\" d=\"M32.97 339.5H296.29\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-n-st-thigh.l\"/><use href=\"#kettlebell-swing-n-st-kneecap.l\"/><use href=\"#kettlebell-swing-n-st-shank.l\"/><use href=\"#kettlebell-swing-n-st-foot.l\"/><use href=\"#kettlebell-swing-n-st-shcap.l\"/><use href=\"#kettlebell-swing-n-st-upper.l\"/><use href=\"#kettlebell-swing-n-st-elbowcap.l\"/><use href=\"#kettlebell-swing-n-st-fore.l\"/><use href=\"#kettlebell-swing-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-n-st-thigh.l\"/><use href=\"#kettlebell-swing-n-st-kneecap.l\"/><use href=\"#kettlebell-swing-n-st-shank.l\"/><use href=\"#kettlebell-swing-n-st-foot.l\"/><use href=\"#kettlebell-swing-n-st-shcap.l\"/><use href=\"#kettlebell-swing-n-st-upper.l\"/><use href=\"#kettlebell-swing-n-st-elbowcap.l\"/><use href=\"#kettlebell-swing-n-st-fore.l\"/><use href=\"#kettlebell-swing-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-n-st-head\"/><use href=\"#kettlebell-swing-n-st-torso\"/><use href=\"#kettlebell-swing-n-st-thigh.r\"/><use href=\"#kettlebell-swing-n-st-kneecap.r\"/><use href=\"#kettlebell-swing-n-st-shank.r\"/><use href=\"#kettlebell-swing-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-n-st-head\"/><use href=\"#kettlebell-swing-n-st-torso\"/><use href=\"#kettlebell-swing-n-st-thigh.r\"/><use href=\"#kettlebell-swing-n-st-kneecap.r\"/><use href=\"#kettlebell-swing-n-st-shank.r\"/><use href=\"#kettlebell-swing-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-n-st-shcap.r\"/><use href=\"#kettlebell-swing-n-st-upper.r\"/><use href=\"#kettlebell-swing-n-st-elbowcap.r\"/><use href=\"#kettlebell-swing-n-st-fore.r\"/><use href=\"#kettlebell-swing-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-n-st-shcap.r\"/><use href=\"#kettlebell-swing-n-st-upper.r\"/><use href=\"#kettlebell-swing-n-st-elbowcap.r\"/><use href=\"#kettlebell-swing-n-st-fore.r\"/><use href=\"#kettlebell-swing-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-solid\" d=\"~#c2DSuDwW1B!uBPY1V3U)1T2AuK7F)1yV1VJ1A5)_1012000000010000000000001\"/><path class=\"eq-solid\" d=\"~#P12UTtUNV1XwtKHV1X1Y4.2A4.3F3R4A2*4sx5dX4X1K3Xa.2X7R25E1111H14S28D4z7F5)9(4ry5eY4Y1A4!2F3_3A2U4sw5000000000101000021200100010000000001000000000011001100200001000000100000000000011001000210001200\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-n-g0-shcap.r\"/><use href=\"#kettlebell-swing-n-g0-upper.r\"/><use href=\"#kettlebell-swing-n-g0-elbowcap.r\"/><use href=\"#kettlebell-swing-n-g0-fore.r\"/><use href=\"#kettlebell-swing-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-n-g0-shcap.r\"/><use href=\"#kettlebell-swing-n-g0-upper.r\"/><use href=\"#kettlebell-swing-n-g0-elbowcap.r\"/><use href=\"#kettlebell-swing-n-g0-fore.r\"/><use href=\"#kettlebell-swing-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-solid\" d=\"~#c2wRF1JJH1VUH1zYI1JN1YI1HlHlYI1JN15IB2.G1.G1000100000000100000000000\"/><path class=\"eq-solid\" d=\"~#P12!OE1PYH1OwE1EAI1P2J4F1_42A5G1_4R2J4R3U3G4P2RaG4V7X2-1_1tu00ut_1-1X2V7G4RaP2G4U3R3J4R2_4G1A52_4F1J4P2200010011100000101101000020021101120001010000000000000011000121101120020000101101002001110010002\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-n-g1-shcap.r\"/><use href=\"#kettlebell-swing-n-g1-upper.r\"/><use href=\"#kettlebell-swing-n-g1-elbowcap.r\"/><use href=\"#kettlebell-swing-n-g1-fore.r\"/><use href=\"#kettlebell-swing-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-n-g1-shcap.r\"/><use href=\"#kettlebell-swing-n-g1-upper.r\"/><use href=\"#kettlebell-swing-n-g1-elbowcap.r\"/><use href=\"#kettlebell-swing-n-g1-fore.r\"/><use href=\"#kettlebell-swing-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-line m-line\" d=\"~MFHhY_O1LNB2.F1L..1_lLTsP9Lx*1HiLy(1wvLHY1Xi\"/><path class=\"eq-line m-line\" d=\"~MDNhWXN1LU3wjL)4aL*4x1LR4E2LX3I3LX2B4LT1X4L7x5LP8O7L(5V5LpI2LdE1L00LeF1LqJ2LA8y1LHbqLY2F4LU1_4L8w5Ltw5LG2N4LI3_3LB4Y2\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-n-e-thigh.l\"/><use href=\"#kettlebell-swing-n-e-kneecap.l\"/><use href=\"#kettlebell-swing-n-e-shank.l\"/><use href=\"#kettlebell-swing-n-e-foot.l\"/><use href=\"#kettlebell-swing-n-e-shcap.l\"/><use href=\"#kettlebell-swing-n-e-upper.l\"/><use href=\"#kettlebell-swing-n-e-elbowcap.l\"/><use href=\"#kettlebell-swing-n-e-fore.l\"/><use href=\"#kettlebell-swing-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-n-e-thigh.l\"/><use href=\"#kettlebell-swing-n-e-kneecap.l\"/><use href=\"#kettlebell-swing-n-e-shank.l\"/><use href=\"#kettlebell-swing-n-e-foot.l\"/><use href=\"#kettlebell-swing-n-e-shcap.l\"/><use href=\"#kettlebell-swing-n-e-upper.l\"/><use href=\"#kettlebell-swing-n-e-elbowcap.l\"/><use href=\"#kettlebell-swing-n-e-fore.l\"/><use href=\"#kettlebell-swing-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-n-e-head\"/><use href=\"#kettlebell-swing-n-e-torso\"/><use href=\"#kettlebell-swing-n-e-thigh.r\"/><use href=\"#kettlebell-swing-n-e-kneecap.r\"/><use href=\"#kettlebell-swing-n-e-shank.r\"/><use href=\"#kettlebell-swing-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-n-e-head\"/><use href=\"#kettlebell-swing-n-e-torso\"/><use href=\"#kettlebell-swing-n-e-thigh.r\"/><use href=\"#kettlebell-swing-n-e-kneecap.r\"/><use href=\"#kettlebell-swing-n-e-shank.r\"/><use href=\"#kettlebell-swing-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~#c2S)O1N_r.OS1BTrP)1!5(tW3y)1S9.H1RW1-_1B7100100000000200100010100\"/><path class=\"eq-solid\" d=\"~#P12(JO1NYszFO1BItY4(1(3w3D3w4(1U4mw5hw5*1Y4.aw3-7U29S23F1024G1aR2.6I4.9T5lx5i*4(1V4w3x4w4x3U4)1w5l210020111000000000000000000012000100000200000000000000000120000001010010100000010000000000000001\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-n-e-shcap.r\"/><use href=\"#kettlebell-swing-n-e-upper.r\"/><use href=\"#kettlebell-swing-n-e-elbowcap.r\"/><use href=\"#kettlebell-swing-n-e-fore.r\"/><use href=\"#kettlebell-swing-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-n-e-shcap.r\"/><use href=\"#kettlebell-swing-n-e-upper.r\"/><use href=\"#kettlebell-swing-n-e-elbowcap.r\"/><use href=\"#kettlebell-swing-n-e-fore.r\"/><use href=\"#kettlebell-swing-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"139.23\" cy=\"134.62\" r=\"2.25\"/><circle class=\"joint\" cx=\"184.64\" cy=\"141.01\" r=\"2.25\"/><circle class=\"joint\" cx=\"139.23\" cy=\"203.74\" r=\"2.25\"/><circle class=\"joint\" cx=\"139.75\" cy=\"266.24\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#U20_Kk!zP1K(jOPO1W1I1W1K1S1V1J1-1H1*1A1x2w1B2oG2mK2eK26R24R2x5O5dG1fK1fG1jG1nE1nG1tE1rz1vz1x1z1B1vB1vE1tG1pI1p(cP4pfrdr9p9vbp7v5t5t5t3v1v1001011000200000000000002100000100100000000111100200100101000000020000002100001100002200200000100101001010100000100000200010111000000000010200200020000010001000010110100\"/><path class=\"arrow\" d=\"~MWxK1D*tLW3YG1LRD1OX1Z\"/></g><path class=\"leader\" d=\"M117.08 185.97L104.29 172H94.29\"/><circle class=\"anchor\" cx=\"117.08\" cy=\"185.97\" r=\"1.5\"/><path class=\"leader\" d=\"M123.36 165.34L100.41 118H90.41\"/><circle class=\"anchor\" cx=\"123.36\" cy=\"165.34\" r=\"1.5\"/><path class=\"leader\" d=\"M139.23 83.42L143 70H153\"/><circle class=\"anchor\" cx=\"139.23\" cy=\"83.42\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"kettlebell-swing-n-hinge\" data-key=\"hinge\" data-cue=\"Hips back, knees only slightly bent.\" class=\"plate-callout two\" style=\"left:4.47%;top:41.9%\" aria-pressed=\"true\">Hinge,<br>not squat</button><button type=\"button\" id=\"kettlebell-swing-n-flat\" data-key=\"flat\" data-cue=\"Back flat and straight through the whole swing.\" class=\"plate-callout\" style=\"left:4.47%;top:26.82%\" aria-pressed=\"false\">Flat back</button><button type=\"button\" id=\"kettlebell-swing-n-tall\" data-key=\"tall\" data-cue=\"At the top, ankles, knees, hips and shoulders in line.\" class=\"plate-callout\" style=\"left:41.34%;top:13.41%\" aria-pressed=\"false\">Stand tall</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"kettlebell-swing-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"kettlebell-swing-m-st-thigh.l\" d=\"^0\"/><path id=\"kettlebell-swing-m-st-kneecap.l\" d=\"^1\"/><path id=\"kettlebell-swing-m-st-shank.l\" d=\"^2\"/><path id=\"kettlebell-swing-m-st-foot.l\" d=\"^3\"/><path id=\"kettlebell-swing-m-st-shcap.l\" d=\"^4\"/><path id=\"kettlebell-swing-m-st-upper.l\" d=\"^5\"/><path id=\"kettlebell-swing-m-st-elbowcap.l\" d=\"^6\"/><path id=\"kettlebell-swing-m-st-fore.l\" d=\"^7\"/><path id=\"kettlebell-swing-m-st-fist.l\" d=\"^8\"/><path id=\"kettlebell-swing-m-st-head\" d=\"^9\"/><path id=\"kettlebell-swing-m-st-torso\" d=\"^10\"/><path id=\"kettlebell-swing-m-st-thigh.r\" d=\"^0\"/><path id=\"kettlebell-swing-m-st-kneecap.r\" d=\"^1\"/><path id=\"kettlebell-swing-m-st-shank.r\" d=\"^2\"/><path id=\"kettlebell-swing-m-st-foot.r\" d=\"^3\"/><path id=\"kettlebell-swing-m-st-shcap.r\" d=\"^4\"/><path id=\"kettlebell-swing-m-st-upper.r\" d=\"^5\"/><path id=\"kettlebell-swing-m-st-elbowcap.r\" d=\"^6\"/><path id=\"kettlebell-swing-m-st-fore.r\" d=\"^7\"/><path id=\"kettlebell-swing-m-st-fist.r\" d=\"^8\"/><path id=\"kettlebell-swing-m-g0-shcap.r\" d=\"^11\"/><path id=\"kettlebell-swing-m-g0-upper.r\" d=\"^12\"/><path id=\"kettlebell-swing-m-g0-elbowcap.r\" d=\"^13\"/><path id=\"kettlebell-swing-m-g0-fore.r\" d=\"^14\"/><path id=\"kettlebell-swing-m-g0-fist.r\" d=\"^15\"/><path id=\"kettlebell-swing-m-g1-shcap.r\" d=\"^16\"/><path id=\"kettlebell-swing-m-g1-upper.r\" d=\"^17\"/><path id=\"kettlebell-swing-m-g1-elbowcap.r\" d=\"^18\"/><path id=\"kettlebell-swing-m-g1-fore.r\" d=\"^19\"/><path id=\"kettlebell-swing-m-g1-fist.r\" d=\"^20\"/><path id=\"kettlebell-swing-m-e-thigh.l\" d=\"^21\"/><path id=\"kettlebell-swing-m-e-kneecap.l\" d=\"^22\"/><path id=\"kettlebell-swing-m-e-shank.l\" d=\"^23\"/><path id=\"kettlebell-swing-m-e-foot.l\" d=\"^24\"/><path id=\"kettlebell-swing-m-e-shcap.l\" d=\"^25\"/><path id=\"kettlebell-swing-m-e-upper.l\" d=\"^26\"/><path id=\"kettlebell-swing-m-e-elbowcap.l\" d=\"^27\"/><path id=\"kettlebell-swing-m-e-fore.l\" d=\"^28\"/><path id=\"kettlebell-swing-m-e-fist.l\" d=\"^29\"/><path id=\"kettlebell-swing-m-e-head\" d=\"^30\"/><path id=\"kettlebell-swing-m-e-torso\" d=\"^31\"/><path id=\"kettlebell-swing-m-e-thigh.r\" d=\"^21\"/><path id=\"kettlebell-swing-m-e-kneecap.r\" d=\"^22\"/><path id=\"kettlebell-swing-m-e-shank.r\" d=\"^23\"/><path id=\"kettlebell-swing-m-e-foot.r\" d=\"^24\"/><path id=\"kettlebell-swing-m-e-shcap.r\" d=\"^25\"/><path id=\"kettlebell-swing-m-e-upper.r\" d=\"^26\"/><path id=\"kettlebell-swing-m-e-elbowcap.r\" d=\"^27\"/><path id=\"kettlebell-swing-m-e-fore.r\" d=\"^28\"/><path id=\"kettlebell-swing-m-e-fist.r\" d=\"^29\"/><path id=\"kettlebell-swing-m-m-head\" d=\"~#w12FUhU(hxygKJiX8WpzdwhKby2pY5X7z5zcR6VpKcE1RdT5*7GhJ8Ff-jHhTfAkE6Fow6w7(h1000200011100000000000000010000020010100100000000101000200010110\"/><path id=\"kettlebell-swing-m-m-torso\" d=\"~#_12YIiH!mxwiKNlKbO1-2J1HgWbNbN1Pi_8w7B4-k.hIvJ3RaN8JeR8UiBb!h)k_cGlH2KaTbTd*y1TrIhTnGaR9Rs-1SqwvJ6Y5)eR1.aFeJ3NlS8w3U6XfH6!5V!1Dx200000020000000010000100200000021002000000002000000000210100100110002000000000002000000000002000000000000000210000011\"/><path id=\"kettlebell-swing-m-m-shcap.l\" d=\"~~PPkF(qwP10\"/><path id=\"kettlebell-swing-m-m-upper.l\" d=\"~#F12_-lYKs.Xk)EsK8V109YK1y4E5*3R2-1)y1-azhOcGgG2*jJ7RA1kx3y1x6J2yK1W81aR8nT4YfNnAhDmA3Drxa02001000000200000000200100000200000000101002000200011111000002002200000000010100\"/><path id=\"kettlebell-swing-m-m-elbowcap.l\" d=\"~~A-tDDsDz10\"/><path id=\"kettlebell-swing-m-m-fore.l\" d=\"~#F12PYuYHt)*t*AtV9X2(1j!G1uR8K4x2.1-uV3)bz8BbB1IdP5*u-2I2N1I9S2FG1Y7W1w1)9mE2(9JiScyhW1UkI802101120000010101001001111100010100000000000000011210002000002002000000111002000\"/><path id=\"kettlebell-swing-m-m-fist.l\" d=\"~~YEE1PBtww10\"/><path id=\"kettlebell-swing-m-m-shcap.r\" d=\"^48\"/><path id=\"kettlebell-swing-m-m-upper.r\" d=\"^49\"/><path id=\"kettlebell-swing-m-m-elbowcap.r\" d=\"^50\"/><path id=\"kettlebell-swing-m-m-fore.r\" d=\"^51\"/><path id=\"kettlebell-swing-m-m-fist.r\" d=\"^52\"/><path id=\"kettlebell-swing-m-m-eq0\" d=\"~#c2!-H1HOsBHK1zFsS)1w6!tU3y)1P9*H1OW1X_1z7000022100000000000220000\"/><path id=\"kettlebell-swing-m-m-eq1\" d=\"~#P12HEH1FKtOyH1*)tW4_1y4A3y3!3w2Y4m(4hw5*1W4.ay3-7W27P27F1226I18K2*6O4-9R5l)4k)4_1V4y3x4w4x3U4x2y5j100100001210100000000101000000200000020020000000000100100011100000200020001000012101010001220012\"/><path id=\"kettlebell-swing-m-mf-thigh.l\" d=\"^21\"/><path id=\"kettlebell-swing-m-mf-kneecap.l\" d=\"^22\"/><path id=\"kettlebell-swing-m-mf-shank.l\" d=\"^23\"/><path id=\"kettlebell-swing-m-mf-foot.l\" d=\"^24\"/><path id=\"kettlebell-swing-m-mf-thigh.r\" d=\"^21\"/><path id=\"kettlebell-swing-m-mf-kneecap.r\" d=\"^22\"/><path id=\"kettlebell-swing-m-mf-shank.r\" d=\"^23\"/><path id=\"kettlebell-swing-m-mf-foot.r\" d=\"^24\"/><path id=\"kettlebell-swing-m-mo-0\" d=\"^30\"/><path id=\"kettlebell-swing-m-mo-1\" d=\"^31\"/><path id=\"kettlebell-swing-m-mo-2\" d=\"^21\"/><path id=\"kettlebell-swing-m-mo-3\" d=\"^22\"/><path id=\"kettlebell-swing-m-mo-4\" d=\"^23\"/><path id=\"kettlebell-swing-m-mo-5\" d=\"^24\"/><path id=\"kettlebell-swing-m-mo-6\" d=\"^25\"/><path id=\"kettlebell-swing-m-mo-7\" d=\"^26\"/><path id=\"kettlebell-swing-m-mo-8\" d=\"^27\"/><path id=\"kettlebell-swing-m-mo-9\" d=\"^28\"/><path id=\"kettlebell-swing-m-mo-10\" d=\"^29\"/><path id=\"kettlebell-swing-m-mo-11\" d=\"^21\"/><path id=\"kettlebell-swing-m-mo-12\" d=\"^22\"/><path id=\"kettlebell-swing-m-mo-13\" d=\"^23\"/><path id=\"kettlebell-swing-m-mo-14\" d=\"^24\"/><path id=\"kettlebell-swing-m-mo-15\" d=\"^25\"/><path id=\"kettlebell-swing-m-mo-16\" d=\"^26\"/><path id=\"kettlebell-swing-m-mo-17\" d=\"^27\"/><path id=\"kettlebell-swing-m-mo-18\" d=\"^28\"/><path id=\"kettlebell-swing-m-mo-19\" d=\"^29\"/><path id=\"kettlebell-swing-m-mo-20\" d=\"^39\"/><path id=\"kettlebell-swing-m-mo-21\" d=\"^40\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#kettlebell-swing-m-dots)\"/>\n  <path class=\"floorline\" d=\"^32\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-m-st-thigh.l\"/><use href=\"#kettlebell-swing-m-st-kneecap.l\"/><use href=\"#kettlebell-swing-m-st-shank.l\"/><use href=\"#kettlebell-swing-m-st-foot.l\"/><use href=\"#kettlebell-swing-m-st-shcap.l\"/><use href=\"#kettlebell-swing-m-st-upper.l\"/><use href=\"#kettlebell-swing-m-st-elbowcap.l\"/><use href=\"#kettlebell-swing-m-st-fore.l\"/><use href=\"#kettlebell-swing-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-m-st-thigh.l\"/><use href=\"#kettlebell-swing-m-st-kneecap.l\"/><use href=\"#kettlebell-swing-m-st-shank.l\"/><use href=\"#kettlebell-swing-m-st-foot.l\"/><use href=\"#kettlebell-swing-m-st-shcap.l\"/><use href=\"#kettlebell-swing-m-st-upper.l\"/><use href=\"#kettlebell-swing-m-st-elbowcap.l\"/><use href=\"#kettlebell-swing-m-st-fore.l\"/><use href=\"#kettlebell-swing-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-m-st-head\"/><use href=\"#kettlebell-swing-m-st-torso\"/><use href=\"#kettlebell-swing-m-st-thigh.r\"/><use href=\"#kettlebell-swing-m-st-kneecap.r\"/><use href=\"#kettlebell-swing-m-st-shank.r\"/><use href=\"#kettlebell-swing-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-m-st-head\"/><use href=\"#kettlebell-swing-m-st-torso\"/><use href=\"#kettlebell-swing-m-st-thigh.r\"/><use href=\"#kettlebell-swing-m-st-kneecap.r\"/><use href=\"#kettlebell-swing-m-st-shank.r\"/><use href=\"#kettlebell-swing-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-m-st-shcap.r\"/><use href=\"#kettlebell-swing-m-st-upper.r\"/><use href=\"#kettlebell-swing-m-st-elbowcap.r\"/><use href=\"#kettlebell-swing-m-st-fore.r\"/><use href=\"#kettlebell-swing-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-m-st-shcap.r\"/><use href=\"#kettlebell-swing-m-st-upper.r\"/><use href=\"#kettlebell-swing-m-st-elbowcap.r\"/><use href=\"#kettlebell-swing-m-st-fore.r\"/><use href=\"#kettlebell-swing-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-solid\" d=\"^33\"/><path class=\"eq-solid\" d=\"^34\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-m-g0-shcap.r\"/><use href=\"#kettlebell-swing-m-g0-upper.r\"/><use href=\"#kettlebell-swing-m-g0-elbowcap.r\"/><use href=\"#kettlebell-swing-m-g0-fore.r\"/><use href=\"#kettlebell-swing-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-m-g0-shcap.r\"/><use href=\"#kettlebell-swing-m-g0-upper.r\"/><use href=\"#kettlebell-swing-m-g0-elbowcap.r\"/><use href=\"#kettlebell-swing-m-g0-fore.r\"/><use href=\"#kettlebell-swing-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-solid\" d=\"^35\"/><path class=\"eq-solid\" d=\"^36\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-m-g1-shcap.r\"/><use href=\"#kettlebell-swing-m-g1-upper.r\"/><use href=\"#kettlebell-swing-m-g1-elbowcap.r\"/><use href=\"#kettlebell-swing-m-g1-fore.r\"/><use href=\"#kettlebell-swing-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-m-g1-shcap.r\"/><use href=\"#kettlebell-swing-m-g1-upper.r\"/><use href=\"#kettlebell-swing-m-g1-elbowcap.r\"/><use href=\"#kettlebell-swing-m-g1-fore.r\"/><use href=\"#kettlebell-swing-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-line m-line\" d=\"^37\"/><path class=\"eq-line m-line\" d=\"^38\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-m-e-thigh.l\"/><use href=\"#kettlebell-swing-m-e-kneecap.l\"/><use href=\"#kettlebell-swing-m-e-shank.l\"/><use href=\"#kettlebell-swing-m-e-foot.l\"/><use href=\"#kettlebell-swing-m-e-shcap.l\"/><use href=\"#kettlebell-swing-m-e-upper.l\"/><use href=\"#kettlebell-swing-m-e-elbowcap.l\"/><use href=\"#kettlebell-swing-m-e-fore.l\"/><use href=\"#kettlebell-swing-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-m-e-thigh.l\"/><use href=\"#kettlebell-swing-m-e-kneecap.l\"/><use href=\"#kettlebell-swing-m-e-shank.l\"/><use href=\"#kettlebell-swing-m-e-foot.l\"/><use href=\"#kettlebell-swing-m-e-shcap.l\"/><use href=\"#kettlebell-swing-m-e-upper.l\"/><use href=\"#kettlebell-swing-m-e-elbowcap.l\"/><use href=\"#kettlebell-swing-m-e-fore.l\"/><use href=\"#kettlebell-swing-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-m-e-head\"/><use href=\"#kettlebell-swing-m-e-torso\"/><use href=\"#kettlebell-swing-m-e-thigh.r\"/><use href=\"#kettlebell-swing-m-e-kneecap.r\"/><use href=\"#kettlebell-swing-m-e-shank.r\"/><use href=\"#kettlebell-swing-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-m-e-head\"/><use href=\"#kettlebell-swing-m-e-torso\"/><use href=\"#kettlebell-swing-m-e-thigh.r\"/><use href=\"#kettlebell-swing-m-e-kneecap.r\"/><use href=\"#kettlebell-swing-m-e-shank.r\"/><use href=\"#kettlebell-swing-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^39\"/><path class=\"eq-solid\" d=\"^40\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-m-e-shcap.r\"/><use href=\"#kettlebell-swing-m-e-upper.r\"/><use href=\"#kettlebell-swing-m-e-elbowcap.r\"/><use href=\"#kettlebell-swing-m-e-fore.r\"/><use href=\"#kettlebell-swing-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#kettlebell-swing-m-e-shcap.r\"/><use href=\"#kettlebell-swing-m-e-upper.r\"/><use href=\"#kettlebell-swing-m-e-elbowcap.r\"/><use href=\"#kettlebell-swing-m-e-fore.r\"/><use href=\"#kettlebell-swing-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"139.23\" cy=\"134.62\" r=\"2.25\"/><circle class=\"joint\" cx=\"184.64\" cy=\"141.01\" r=\"2.25\"/><circle class=\"joint\" cx=\"139.23\" cy=\"203.74\" r=\"2.25\"/><circle class=\"joint\" cx=\"139.75\" cy=\"266.24\" r=\"2.25\"/></g><mask id=\"kettlebell-swing-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#kettlebell-swing-m-m-head\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-m-torso\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-mf-shank.l\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-mf-foot.l\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-m-shcap.l\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-m-upper.l\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-m-fore.l\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-m-fist.l\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-mf-shank.r\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-mf-foot.r\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-m-shcap.r\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-m-upper.r\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-m-fore.r\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-m-fist.r\" fill=\"#000\"/><use href=\"#kettlebell-swing-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#kettlebell-swing-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#kettlebell-swing-m-mmask)\"><g class=\"u-stroke\"><use href=\"#kettlebell-swing-m-m-head\"/><use href=\"#kettlebell-swing-m-m-torso\"/><use href=\"#kettlebell-swing-m-m-shcap.l\"/><use href=\"#kettlebell-swing-m-m-upper.l\"/><use href=\"#kettlebell-swing-m-m-elbowcap.l\"/><use href=\"#kettlebell-swing-m-m-fore.l\"/><use href=\"#kettlebell-swing-m-m-fist.l\"/><use href=\"#kettlebell-swing-m-m-shcap.r\"/><use href=\"#kettlebell-swing-m-m-upper.r\"/><use href=\"#kettlebell-swing-m-m-elbowcap.r\"/><use href=\"#kettlebell-swing-m-m-fore.r\"/><use href=\"#kettlebell-swing-m-m-fist.r\"/><use href=\"#kettlebell-swing-m-m-eq0\"/><use href=\"#kettlebell-swing-m-m-eq1\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MY_lJ-sLKR2F)1MF8zuLE8AuLPE1Tu\"/><path class=\"leader m\" d=\"~MFUhU(hL0Ii\"/><path class=\"leader m\" d=\"~MP.lHWx1L*W4G3\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"kettlebell-swing-m-lean\" data-key=\"lean\" data-cue=\"Leaning back at the top of the swing.\" class=\"plate-callout m\" style=\"left:4.47%;top:15.64%\" aria-pressed=\"true\">Leaning back</button><button type=\"button\" id=\"kettlebell-swing-m-arch\" data-key=\"arch\" data-cue=\"The low back overextends instead of the glutes finishing.\" class=\"plate-callout two m\" style=\"left:4.47%;top:41.9%\" aria-pressed=\"false\">Low back<br>arches</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "hinge",
        cues: [{ key: "hinge", cue: "Hips back, knees only slightly bent." }, { key: "flat", cue: "Back flat and straight through the whole swing." }, { key: "tall", cue: "At the top, ankles, knees, hips and shoulders in line." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "lean",
        cues: [{ key: "lean", cue: "Leaning back at the top of the swing." }, { key: "arch", cue: "The low back overextends instead of the glutes finishing." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Leaning back</b><span>Leaning back at the top of the swing.</span></li><li><b>Low back arches</b><span>The low back overextends instead of the glutes finishing.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: drive 1 second, swing down 1 second\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Drive</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Swing down</b><span>1 s</span></div></div></div>",
      alt: "Kettlebell swing, side view. From the hinge with the bell hiked back between the legs, the hips drive forward and the straight arms swing the bell to chest height. At the top the body stands stacked over the ankles.",
      mistakeAlt: "Kettlebell Swing: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP (b3): the card gives no thumb or wrist; c2, c3, c4 and c24 are on the setup lines."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Feet about shoulder-width and planted, the bell a foot in front.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-kb-swing",
          "hk-kb-swing",
          "bb-kb-swing",
          "nike-kb-swing",
          "ggr-kb-swing"
        ],
        "note": "card c1, c17"
      }
    },
    {
      "kind": "grip",
      "text": "Hinge and grip, palms down side by side, bell tilted toward you.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-kb-swing",
          "hk-kb-swing",
          "bb-kb-swing",
          "nike-kb-swing"
        ],
        "note": "card c1, c2, c3"
      }
    },
    {
      "kind": "position",
      "text": "Hike it high between your legs, then swing to about chest height.",
      "zoom": "kb-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-kb-swing",
          "hk-kb-swing",
          "bb-kb-swing",
          "sl-kb-swing",
          "nike-kb-swing"
        ],
        "note": "card c5, c9"
      }
    },
    {
      "kind": "position",
      "text": "Don't hold your breath: out as it rises, in as it falls.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nike-kb-swing",
          "mo-kb-swing",
          "sl-kb-swing"
        ],
        "note": "card c19"
      }
    },
    {
      "kind": "finish",
      "text": "Keep a full grip. Set the bell on the ground when done.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-kb-swing",
          "sl-kb-swing"
        ],
        "note": "card c24, c21"
      }
    }
  ],
  posture: [
    {
      "key": "hinge",
      "label": "Hip hinge",
      "detail": "Hinge at the hips, knees only slightly bent.",
      "anchor": {
        "pose": "start",
        "at": "buttock"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-kb-swing",
          "nike-kb-swing",
          "mf-kb-swing",
          "mo-kb-swing"
        ],
        "note": "card c6"
      }
    },
    {
      "key": "back",
      "label": "Flat back",
      "detail": "Keep your back flat through the whole swing. Bell too heavy? Stop or reset.",
      "anchor": {
        "pose": "start",
        "at": "backMid"
      },
      "zoom": "kb-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mf-kb-swing",
          "ggr-kb-swing",
          "mo-kb-swing",
          "bb-kb-swing",
          "nike-kb-swing"
        ],
        "note": "card c13, c12, c20"
      }
    },
    {
      "key": "drive",
      "label": "Hip drive",
      "detail": "Drive with your hips. Arms stay straight and loose, they don't lift.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-kb-swing",
          "sl-kb-swing",
          "nike-kb-swing",
          "bb-kb-swing"
        ],
        "note": "card c7, c16"
      }
    },
    {
      "key": "tall",
      "label": "Stand tall",
      "detail": "At the top, ankles, knees, hips and shoulders in line. Squeeze your glutes, don't lean back.",
      "anchor": {
        "pose": "end",
        "at": "head"
      },
      "zoom": "kb-top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-kb-swing",
          "mo-kb-swing",
          "hk-kb-swing",
          "nike-kb-swing",
          "mf-kb-swing"
        ],
        "note": "card c8, c14"
      }
    },
    {
      "key": "crush",
      "label": "Crush grip",
      "detail": "Use an easy hook grip, not a crush grip.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nike-kb-swing",
          "pg-kb-swing"
        ],
        "note": "card c4"
      }
    },
    {
      "key": "height",
      "label": "Chest height",
      "detail": "Swing to about chest height.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-kb-swing",
          "hk-kb-swing",
          "nike-kb-swing"
        ],
        "note": "card c9"
      }
    },
    {
      "key": "feet",
      "label": "Feet planted",
      "detail": "Feet planted, heels and toes down.",
      "anchor": {
        "pose": "end",
        "at": "heel.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nike-kb-swing",
          "ggr-kb-swing"
        ],
        "note": "card c17"
      }
    },
    {
      "key": "breathe",
      "label": "Breathing",
      "detail": "Don't hold your breath. Breathe out as you swing up, in as it comes down.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nike-kb-swing",
          "mo-kb-swing",
          "sl-kb-swing"
        ],
        "note": "card c19"
      }
    }
  ],
  zooms: [
    {
      "key": "kb-top",
      "chip": "Top",
      "heading": "Top position",
      "kind": "posture"
    },
    {
      "key": "kb-back",
      "chip": "Back",
      "heading": "Back shape",
      "kind": "posture"
    }
  ],
  chips: [
    "kb-top",
    "kb-back",
    "feel"
  ],
  copy: {
    "setupLine": "Feet about shoulder-width, bell a foot in front. Both hands on the handle, palms down.",
    "mistakeLine": "Don't lean back at the top. Squeeze your glutes and don't overextend.",
    "cueLine": "Hinge, then drive the hips."
  },
  mistakes: [],
  risks: [
    {
      "key": "round",
      "text": "Rounding the lower back strains it.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nike-kb-swing",
          "mo-kb-swing",
          "ggr-kb-swing"
        ],
        "note": "card c12"
      }
    },
    {
      "key": "lean",
      "text": "Leaning back at the top puts more pressure on the lower back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-kb-swing",
          "nike-kb-swing",
          "hk-kb-swing",
          "mo-kb-swing",
          "mf-kb-swing"
        ],
        "note": "card c14"
      }
    },
    {
      "key": "grip",
      "text": "A loose grip could let the bell slip or be dropped.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-kb-swing"
        ],
        "note": "card c24"
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
    "mo-kb-swing",
    "hk-kb-swing",
    "nike-kb-swing",
    "bb-kb-swing",
    "ggr-kb-swing",
    "sl-kb-swing",
    "mf-kb-swing",
    "pg-kb-swing",
    "mcgill-2012",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/kettlebell_swing.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

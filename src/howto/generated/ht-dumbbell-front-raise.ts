// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=982142b43f63981d2ba819571f7cd61dbdd5007c6eafe4b82e28ba74b1ed2805
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_dumbbell_front_raise",
  name: "Dumbbell Front Raise",
  hashes: { inputsSha256: "982142b43f63981d2ba819571f7cd61dbdd5007c6eafe4b82e28ba74b1ed2805", golden: "a71cec01be120f4428ce7132334534c5c9b1d50ae072f1a1e16927feed57cca2" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-front-raise-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-front-raise-n-st-upper.r\" d=\"~#F12PPrwWq-NrGSp5*8a1!5JO1Y2B6D1z3(2XD1S8Ojz1IgKb*hT8)B1T1-2T3X5A1WO170z1.8Eg6-bNqW1NmSfNo00010101010200010100010000101100200010100000000001110120010000001000100000000000\"/><path id=\"dumbbell-front-raise-n-st-elbowcap.r\" d=\"~~DTsF.z1Dz10\"/><path id=\"dumbbell-front-raise-n-st-fore.r\" d=\"~#F12HUsAGA1OJs)Kz1E2EaJ1P1Wj!D17*9i.2xcTuS1KeG4KazbB9*cKuI2O1-6G7DdSG12w2O5.8O9W3E2AmP6!fAhDe02210000001210020010011002000000010101000002000002100020010100110100000001100000\"/><path id=\"dumbbell-front-raise-n-st-fist.r\" d=\"~~!Jw1w*J1ww10\"/><path id=\"dumbbell-front-raise-n-g0-upper.r\" d=\"~#F12AVrFErODrVDqO3B8c5Wm(G1aX62I3RbzB1uElz7.ezhOc*lBw1R2x2K5x4PiwJ196E4*7xfA6G1(sY9FkNnyh00001001210010002100011210000020000000000000000000000210120101020010000000000010\"/><path id=\"dumbbell-front-raise-n-g0-elbowcap.r\" d=\"~~A(vU(y1Dz10\"/><path id=\"dumbbell-front-raise-n-g0-fore.r\" d=\"~#F12SAw1UVz1-VvI(y1*4*8Y1w1At!u.2E93-2RjzpR2Ee)6X8GdX5EkOoT2nK8*4WnHz1i!1T7X6K8W5y4_lWaPdNkY801111000001000022001010010000000200000001220000000001010100000000001011210100000\"/><path id=\"dumbbell-front-raise-n-g0-fist.r\" d=\"~~wwD1JKH1ww10\"/><path id=\"dumbbell-front-raise-n-g0-eq1.dumbbell.0-0\" d=\"~MNWF1JKH1LEryO1LzrxO1LDrxO1LJW11LDrAO1Z\"/><path id=\"dumbbell-front-raise-n-g1-upper.r\" d=\"~#F12W)rUVrzDrT!qG6K685SA1UuE2I6B1x3GoKu.6zkzcBbOkI5zw1*lB3x1R6T1Jx1yy198-6X5XbDbH9JrPgHfwsJ700111001210001010000000000001000000022200011101010210110000020200010000000021000\"/><path id=\"dumbbell-front-raise-n-g1-elbowcap.r\" d=\"~~FXy1(!w1Dz10\"/><path id=\"dumbbell-front-raise-n-g1-fore.r\" d=\"~#F12Jxz1(Xx1.Oy1Tzx1)5.7_1kWw1Spz4T8hV2)lxlV4XdE8T7)dT3VmOkV29*8I3(rUuoY1G8I5x8J6D7wlWc_bNlS500002000000020000002002000000000002200010000200200000110000100101000000020000101\"/><path id=\"dumbbell-front-raise-n-g1-fist.r\" d=\"~~UUG1SEE1ww10\"/><path id=\"dumbbell-front-raise-n-g1-eq1.dumbbell.0-0\" d=\"~MyIJ1SEE1LErAO1LzrzO1LDrzO1LJW10LDrAO1Z\"/><path id=\"dumbbell-front-raise-n-g2-upper.r\" d=\"~#F12_NsA)r*KrBRrz8V349DK1DfI4z5E2I2Xx1OjXdBgGf)5zlP2*B1V8G36X6qSI1Uj5aO8.2-6WeWiAm(kD8YsI301210100210101000200020000000002000002121010100210200210101000000010020000120000\"/><path id=\"dumbbell-front-raise-n-g2-elbowcap.r\" d=\"~~DSA1F)tDz10\"/><path id=\"dumbbell-front-raise-n-g2-fore.r\" d=\"~#F12SwB1S*uTIA1TIuI7x7(1a(A1AlK5x8x1T2*pGiT6.cG9I6IeO1OqRh-20K9B2(w1_qA1U1G9B4I6_7Fa_jDeW9ymJ202001010110002020000100101010010100000000001000000100000001000002120000000101200\"/><path id=\"dumbbell-front-raise-n-g2-fist.r\" d=\"~~PRJ1YIz1ww10\"/><path id=\"dumbbell-front-raise-n-g2-eq1.dumbbell.0-0\" d=\"~M(EO1YIz1LErAO1LzrzO1LDrzO1LJW10LDrAO1Z\"/><path id=\"dumbbell-front-raise-n-e-thigh.l\" d=\"~#F12_!qH*E1TWqTND1I2TbE12Y6J(1P5B8U2)39zV1AbOnx1EkOdGmG5XU1)2-3G6K77W(1F11F1.b-vBaXjwH1(1_z1woWE100200000020210100002000100000001000000000000100200100000002100000020000021000200\"/><path id=\"dumbbell-front-raise-n-e-kneecap.l\" d=\"~~FRswwU1_J10\"/><path id=\"dumbbell-front-raise-n-e-shank.l\" d=\"~#F12YOsU*T1)VsXNS1N2VbH12P1y)1J6R7w3X37*y2w8Bdk)bT6)dF7Oy2O2x4R5B8B8P(1B10E1*bId(aOewoB1UlwcNp01000000000012000020000000001000110110002001010011000020020101002000000000000211\"/><path id=\"dumbbell-front-raise-n-e-foot.l\" d=\"~#o2WJsDB)1E(sEB(1YcF3Uhx8Sp*nU-2B3-J2-4ID1*7)n0TG1Y4BbXc_sBbKmPp021200100010100000000020020000100110000111101100\"/><path id=\"dumbbell-front-raise-n-e-shcap.l\" d=\"~~JPrNSqwP10\"/><path id=\"dumbbell-front-raise-n-e-upper.l\" d=\"~#F12JwtNysV!rOxs.8d19WO1K2)5z3)2K1KD1X5XixaOg0XiyaKD1Y5)2N1)5A3WO1N21a.8ez1DgUpYdJm0UpXd00000000100101020000000002000000000000000001010000000010000000001000000000000010\"/><path id=\"dumbbell-front-raise-n-e-elbowcap.l\" d=\"~~YDB1NSqDz10\"/><path id=\"dumbbell-front-raise-n-e-fore.l\" d=\"~#F12S(B1NVr-AB1*GrE9-4w23JH1AaX7E6X1G2EvRa)9OaVaO3EeU2Rv-9X2q*9gFF1YgS1H1IaR1E3U9JfwgJgJ5!l)320200000020000000001012000200000010002001010000200022002001000000000200000000100\"/><path id=\"dumbbell-front-raise-n-e-fist.l\" d=\"~~YTN1DTtww10\"/><path id=\"dumbbell-front-raise-n-e-head\" d=\"~#w12PGtHGgGWrX)fBjFjBjU9BbE3E3_4X4)7x8BbRhKm_4XcT1T9Bj0NmEbHmG6!kA3DjygT1Dj0000020000011001010000101001000000000100000100100200210000000000\"/><path id=\"dumbbell-front-raise-n-e-torso\" d=\"~#_12P-rHxlzzs*SjR9-1B3K5S9_eU9yaYcwgN60I6)nKm)7Xc_4(f-4_kK6Nm*fShTh_4T9)7*fBrEz1EbBrG60V90!cwgA3w8Xc)7)fYaK6wiN6Y3_cO8A3w8zT2ww101002000000000010100000021002101102000100100010000000100000000011000000120111000000010000001001010000000001000000100\"/><path id=\"dumbbell-front-raise-n-e-thigh.r\" d=\"^19\"/><path id=\"dumbbell-front-raise-n-e-kneecap.r\" d=\"^20\"/><path id=\"dumbbell-front-raise-n-e-shank.r\" d=\"^21\"/><path id=\"dumbbell-front-raise-n-e-foot.r\" d=\"^22\"/><path id=\"dumbbell-front-raise-n-e-shcap.r\" d=\"^23\"/><path id=\"dumbbell-front-raise-n-e-upper.r\" d=\"^24\"/><path id=\"dumbbell-front-raise-n-e-elbowcap.r\" d=\"^25\"/><path id=\"dumbbell-front-raise-n-e-fore.r\" d=\"^26\"/><path id=\"dumbbell-front-raise-n-e-fist.r\" d=\"^27\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-front-raise-n-dots)\"/>\n  <path class=\"datum\" d=\"~MJwtNSqLASD10\"/><path class=\"floorline\" d=\"M76.86 339.5H274.34\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-n-st-upper.r\"/><use href=\"#dumbbell-front-raise-n-st-elbowcap.r\"/><use href=\"#dumbbell-front-raise-n-st-fore.r\"/><use href=\"#dumbbell-front-raise-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-n-st-upper.r\"/><use href=\"#dumbbell-front-raise-n-st-elbowcap.r\"/><use href=\"#dumbbell-front-raise-n-st-fore.r\"/><use href=\"#dumbbell-front-raise-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-n-g0-upper.r\"/><use href=\"#dumbbell-front-raise-n-g0-elbowcap.r\"/><use href=\"#dumbbell-front-raise-n-g0-fore.r\"/><use href=\"#dumbbell-front-raise-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-n-g0-upper.r\"/><use href=\"#dumbbell-front-raise-n-g0-elbowcap.r\"/><use href=\"#dumbbell-front-raise-n-g0-fore.r\"/><use href=\"#dumbbell-front-raise-n-g0-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-n-g0-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-n-g0-eq1.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-n-g1-upper.r\"/><use href=\"#dumbbell-front-raise-n-g1-elbowcap.r\"/><use href=\"#dumbbell-front-raise-n-g1-fore.r\"/><use href=\"#dumbbell-front-raise-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-n-g1-upper.r\"/><use href=\"#dumbbell-front-raise-n-g1-elbowcap.r\"/><use href=\"#dumbbell-front-raise-n-g1-fore.r\"/><use href=\"#dumbbell-front-raise-n-g1-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-n-g1-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-n-g1-eq1.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-n-g2-upper.r\"/><use href=\"#dumbbell-front-raise-n-g2-elbowcap.r\"/><use href=\"#dumbbell-front-raise-n-g2-fore.r\"/><use href=\"#dumbbell-front-raise-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-n-g2-upper.r\"/><use href=\"#dumbbell-front-raise-n-g2-elbowcap.r\"/><use href=\"#dumbbell-front-raise-n-g2-fore.r\"/><use href=\"#dumbbell-front-raise-n-g2-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-n-g2-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-n-g2-eq1.dumbbell.0-0\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-n-e-thigh.l\"/><use href=\"#dumbbell-front-raise-n-e-kneecap.l\"/><use href=\"#dumbbell-front-raise-n-e-shank.l\"/><use href=\"#dumbbell-front-raise-n-e-foot.l\"/><use href=\"#dumbbell-front-raise-n-e-shcap.l\"/><use href=\"#dumbbell-front-raise-n-e-upper.l\"/><use href=\"#dumbbell-front-raise-n-e-elbowcap.l\"/><use href=\"#dumbbell-front-raise-n-e-fore.l\"/><use href=\"#dumbbell-front-raise-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-n-e-thigh.l\"/><use href=\"#dumbbell-front-raise-n-e-kneecap.l\"/><use href=\"#dumbbell-front-raise-n-e-shank.l\"/><use href=\"#dumbbell-front-raise-n-e-foot.l\"/><use href=\"#dumbbell-front-raise-n-e-shcap.l\"/><use href=\"#dumbbell-front-raise-n-e-upper.l\"/><use href=\"#dumbbell-front-raise-n-e-elbowcap.l\"/><use href=\"#dumbbell-front-raise-n-e-fore.l\"/><use href=\"#dumbbell-front-raise-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-n-e-head\"/><use href=\"#dumbbell-front-raise-n-e-torso\"/><use href=\"#dumbbell-front-raise-n-e-thigh.r\"/><use href=\"#dumbbell-front-raise-n-e-kneecap.r\"/><use href=\"#dumbbell-front-raise-n-e-shank.r\"/><use href=\"#dumbbell-front-raise-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-n-e-head\"/><use href=\"#dumbbell-front-raise-n-e-torso\"/><use href=\"#dumbbell-front-raise-n-e-thigh.r\"/><use href=\"#dumbbell-front-raise-n-e-kneecap.r\"/><use href=\"#dumbbell-front-raise-n-e-shank.r\"/><use href=\"#dumbbell-front-raise-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-n-e-shcap.r\"/><use href=\"#dumbbell-front-raise-n-e-upper.r\"/><use href=\"#dumbbell-front-raise-n-e-elbowcap.r\"/><use href=\"#dumbbell-front-raise-n-e-fore.r\"/><use href=\"#dumbbell-front-raise-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-n-e-shcap.r\"/><use href=\"#dumbbell-front-raise-n-e-upper.r\"/><use href=\"#dumbbell-front-raise-n-e-elbowcap.r\"/><use href=\"#dumbbell-front-raise-n-e-fore.r\"/><use href=\"#dumbbell-front-raise-n-e-fist.r\"/></g></g><path class=\"disc\" d=\"~MAHR1DTtLBrAO1LErzO1LFrzO1LJW10LFrAO1Z\"/><path class=\"disc-core\" d=\"~~FBO1DTtNe0\"/><path class=\"eq-cable m-line\" d=\"~MPPrwWqL2Y1L22L11L02L20L11L02L21L12L01L22L11L22L11L02L20L11L02L21L12L21L12L21L12L21L02L11L22L10L21L02L11L22L11L22L01L02L01L02L01L02L01L12L21L02L01L02L01L02L01L22L00L00L00L00L00L00L01L02L00L00L00L00L00L00L00L01L02L00L00L00L00L00L00L00L01L02L00L00L00L00L00L00L00L01L02L00L00L00L00L00L41L12L00L21L12L01L22L11L22L10L01L22L11L22L11L02L20L11L22L11L02L21L12L00L21L12L21L12L01L22L10L21L12L01L22L11L02L20L01L02L00L20L10L01L02L00L00L20L11L02L00L00L00L21L12L00L00L00L21L12L00L00L01L02L20L10L00L01L02L00L20L10L01L02\"/><path class=\"eq-cable m-line\" d=\"~MY-uPOz1L2.1L02L10L20L00L01L02L00L00L01L12L20L00L01L02L00L00L01L12L20L00L01L02L00L00L01L12L20L00L01L02L10L00L00L02L21L10L00L00L00L00L00L00L20L10L02L01L00L00L00L00L20L10L00L00L00L02L01L00L00L20L10L00L00L00L00L00L02L21L50L20L00L10L20L00L00L10L21L02L10L20L00L00L10L20L00L10L20L00L00L10L20L00L10L20L00L00L10L20L00L10L20L00L00L10L20L00L10L20L00L30L22L01L02L10L21L02L11L22L01L12L21L02L01L12L21L12L01L22L11L22L10L01L22L11L02L21L12L21L12L00L01L02L01L22L11L02L01L02L00L01L22L11L02L01L02L00L01L02L21LnaL01L00L02L21L10L02L01L22L11L00L02L01L20L12L01L02L01L20L12L01L00L22Lvw1L20L00L00L00L00L00L00L00L02L01L10L20L00L00L00L00L00L2F1L20L10L00L20L10L20L10L00L20L10L20L10L00L20L10L20L10Ly1sL02L01L00L02L01L02L01L00L02L01L02L01L00L02L01L00L02L01L02L01L00\"/><path class=\"eq-cable m-line\" d=\"~MPUs(xA1L9V1\"/><path class=\"eq-cable m-line\" d=\"~MHUsAGA1LgY1L01L10L20L00L00L00L00L10L20L00L00L00L02L11L20L20L00L00L00L00L10L20L00L00L00L20L00L00L01L02L00L01L22L10L01L02L41L02L01L20L10L00L00L02L01L20L10L00L00L02L01L20L10L00L02L01L00L20L10L00L02L01L00L20L10L00L02L01L00L20L10L40L01L00L00L00L02L01L00L00L00L02L01L20L10L00L02L01L00L00L00L02L01L00L00L02L01L00L00L00L22L13L22L01L02L01L02L01L02L10L21L02L01L02L01L02L01L02L11L22L00L01L02L01L02L01\"/><path class=\"eq-cable m-line\" d=\"~MYHw1PzE1LjV1L20L10L00L21L12L00L20L10L01L22L10L20L10L01L22L10L00L20L11L02L20L10L00L21L12L00L20L10L01L22L10L00L20L11L14L10L20L10L20L10L01L22L10L20L10L00L12L01L22L11L22L11L02L21L12L00L10L20L10L22L01L10L20L00L12L21L10L20L00\"/><path class=\"eq-cable m-line\" d=\"~MSUswAA1L1W1L12\"/><path class=\"eq-cable m-line\" d=\"~MFzz1w*J1LBrAO1LBrzO1LDrzO1LJW12LDryO1LBryO1\"/><circle class=\"joint\" cx=\"148.54\" cy=\"136.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"196.15\" cy=\"136.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"150\" cy=\"203.73\" r=\"2.25\"/><circle class=\"joint\" cx=\"153.29\" cy=\"266.24\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#J20FxA1FxJ1xSz1*EJ1j9f7h7f5h3d3d5d1b1d1919171719133515135115715151739171b3b3b3d3d5f5d5f9h9f9h10110100001011011002100020010000000002120000010000000001011100000100020200002020001001010000000000100000020011000110010101000000000022020000100000000020\"/><path class=\"arrow\" d=\"~M!HO1yDvLy5UG1LIF1BW1Z\"/></g><path class=\"leader\" d=\"M131.57 147.41L129.34 132H119.34\"/><circle class=\"anchor\" cx=\"131.57\" cy=\"147.41\" r=\"1.5\"/><path class=\"leader\" d=\"~M(GD1NSqL0KF6\"/><circle class=\"anchor\" cx=\"196.15\" cy=\"136.07\" r=\"1.5\"/><path class=\"leader\" d=\"~M!G_1NSqL0KF6\"/><circle class=\"anchor\" cx=\"298.54\" cy=\"136.07\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dumbbell-front-raise-n-shoulders\" data-key=\"shoulders\" data-cue=\"Pull your shoulders down and back and hold them there.\" class=\"plate-callout two\" style=\"left:11.17%;top:30.73%\" aria-pressed=\"true\">Shoulders<br>down</button><button type=\"button\" id=\"dumbbell-front-raise-n-elbows\" data-key=\"elbows\" data-cue=\"Raise the dumbbells in front, elbows rising slightly ahead of the hands.\" class=\"plate-callout two\" style=\"left:53.07%;top:17.88%\" aria-pressed=\"false\">Elbows<br>lead</button><button type=\"button\" id=\"dumbbell-front-raise-n-height\" data-key=\"height\" data-cue=\"Stop when your arms are level with your shoulders.\" class=\"plate-callout two\" style=\"left:77.09%;top:17.88%\" aria-pressed=\"false\">Shoulder<br>height</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-front-raise-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-front-raise-m-st-upper.r\" d=\"^0\"/><path id=\"dumbbell-front-raise-m-st-elbowcap.r\" d=\"^1\"/><path id=\"dumbbell-front-raise-m-st-fore.r\" d=\"^2\"/><path id=\"dumbbell-front-raise-m-st-fist.r\" d=\"^3\"/><path id=\"dumbbell-front-raise-m-g0-upper.r\" d=\"^4\"/><path id=\"dumbbell-front-raise-m-g0-elbowcap.r\" d=\"^5\"/><path id=\"dumbbell-front-raise-m-g0-fore.r\" d=\"^6\"/><path id=\"dumbbell-front-raise-m-g0-fist.r\" d=\"^7\"/><path id=\"dumbbell-front-raise-m-g0-eq1.dumbbell.0-0\" d=\"^8\"/><path id=\"dumbbell-front-raise-m-g1-upper.r\" d=\"^9\"/><path id=\"dumbbell-front-raise-m-g1-elbowcap.r\" d=\"^10\"/><path id=\"dumbbell-front-raise-m-g1-fore.r\" d=\"^11\"/><path id=\"dumbbell-front-raise-m-g1-fist.r\" d=\"^12\"/><path id=\"dumbbell-front-raise-m-g1-eq1.dumbbell.0-0\" d=\"^13\"/><path id=\"dumbbell-front-raise-m-g2-upper.r\" d=\"^14\"/><path id=\"dumbbell-front-raise-m-g2-elbowcap.r\" d=\"^15\"/><path id=\"dumbbell-front-raise-m-g2-fore.r\" d=\"^16\"/><path id=\"dumbbell-front-raise-m-g2-fist.r\" d=\"^17\"/><path id=\"dumbbell-front-raise-m-g2-eq1.dumbbell.0-0\" d=\"^18\"/><path id=\"dumbbell-front-raise-m-e-thigh.l\" d=\"^19\"/><path id=\"dumbbell-front-raise-m-e-kneecap.l\" d=\"^20\"/><path id=\"dumbbell-front-raise-m-e-shank.l\" d=\"^21\"/><path id=\"dumbbell-front-raise-m-e-foot.l\" d=\"^22\"/><path id=\"dumbbell-front-raise-m-e-shcap.l\" d=\"^23\"/><path id=\"dumbbell-front-raise-m-e-upper.l\" d=\"^24\"/><path id=\"dumbbell-front-raise-m-e-elbowcap.l\" d=\"^25\"/><path id=\"dumbbell-front-raise-m-e-fore.l\" d=\"^26\"/><path id=\"dumbbell-front-raise-m-e-fist.l\" d=\"^27\"/><path id=\"dumbbell-front-raise-m-e-head\" d=\"^28\"/><path id=\"dumbbell-front-raise-m-e-torso\" d=\"^29\"/><path id=\"dumbbell-front-raise-m-e-thigh.r\" d=\"^19\"/><path id=\"dumbbell-front-raise-m-e-kneecap.r\" d=\"^20\"/><path id=\"dumbbell-front-raise-m-e-shank.r\" d=\"^21\"/><path id=\"dumbbell-front-raise-m-e-foot.r\" d=\"^22\"/><path id=\"dumbbell-front-raise-m-e-shcap.r\" d=\"^23\"/><path id=\"dumbbell-front-raise-m-e-upper.r\" d=\"^24\"/><path id=\"dumbbell-front-raise-m-e-elbowcap.r\" d=\"^25\"/><path id=\"dumbbell-front-raise-m-e-fore.r\" d=\"^26\"/><path id=\"dumbbell-front-raise-m-e-fist.r\" d=\"^27\"/><path id=\"dumbbell-front-raise-m-m-head\" d=\"~#w12HWqA*gEypI(gXe_m-gHdTbnz2H5I6-6zaG9.lBiw2RdO3x9-iw4SjRfSk)aylz1ymUbP2yj0000001101100001100000000002000010200000021000100100200100210002\"/><path id=\"dumbbell-front-raise-m-m-torso\" d=\"~#_12(Dq_.lVDqKJkX98G4X4ScScJb_7(fwdD6G1BbBmTnz3ObH7We*7(iVaUiEkSd.kW2Iazb)d*x1-sTgEoE6J1I9(1_fwd_4D7BeB5Kd_dO2wjy7F2Ya.aY4A7VH2SP100002001002000011100001010010100000000000000110002020000002000001000000200010111000000010111110000002022000001010000\"/><path id=\"dumbbell-front-raise-m-m-thigh.l\" d=\"~#F12(BtS-E1zAtOHD1G1-bE10sU(1J6O7_2.3Y4-U1HdKmoBkIbOn9xV1T2)3T5x8x6N(1F10H2TbVuBdRnwF1O1!z1FkWG100000012001000200010010120000000100001010100020000101000010000010100000000010010\"/><path id=\"dumbbell-front-raise-m-m-kneecap.l\" d=\"~~_VtUzU1_J10\"/><path id=\"dumbbell-front-raise-m-m-shank.l\" d=\"~#F12WUt(!T1E)t.NS1P3IbF16I4((1A7*6F3O3w6Ty2D9Kc_1.bG5OeNdRx2z2G4X4T8)dP*1E171.bGeU9XgPmB3NlS9Nq20000220001200200001000000110120001012000001210000001011000002000002101010000001\"/><path id=\"dumbbell-front-raise-m-m-shcap.l\" d=\"~~_xrwxrwP10\"/><path id=\"dumbbell-front-raise-m-m-upper.l\" d=\"~#F12Y.s(OsTYrKWs-8N11byN1BcO6-1B3r.D1J2Ik.5zgJ3EgYdKA1UdT2y2B5H4yO1R748V8J2H2yg!ry8wmV4ymVi00000000000000100000000020022000000210020000001101000021000012010100210020000000\"/><path id=\"dumbbell-front-raise-m-m-elbowcap.l\" d=\"~~WRA1AzpDz10\"/><path id=\"dumbbell-front-raise-m-m-fore.l\" d=\"~#F12yRB1YEqOVA1.xqxaX2(1hUI1A1*8R4B2-1Xw1*3)bz8zbB1OdP5-w1)2O2H1V9U2!H1(7_1w1KaiE1DaJiNcDhY1SkG811100010000200111100000100000000000000000000010002012100001111100201012100001001\"/><path id=\"dumbbell-front-raise-m-m-fist.l\" d=\"~~FJN1!zqww10\"/><path id=\"dumbbell-front-raise-m-m-thigh.r\" d=\"^48\"/><path id=\"dumbbell-front-raise-m-m-kneecap.r\" d=\"^49\"/><path id=\"dumbbell-front-raise-m-m-shank.r\" d=\"^50\"/><path id=\"dumbbell-front-raise-m-m-shcap.r\" d=\"^51\"/><path id=\"dumbbell-front-raise-m-m-upper.r\" d=\"^52\"/><path id=\"dumbbell-front-raise-m-m-elbowcap.r\" d=\"^53\"/><path id=\"dumbbell-front-raise-m-m-fore.r\" d=\"^54\"/><path id=\"dumbbell-front-raise-m-m-fist.r\" d=\"^55\"/><path id=\"dumbbell-front-raise-m-m-eq0\" d=\"~MUyR1!zqLBryO1LBrxO1LDrxO1LJW11LDrAO1Z\"/><path id=\"dumbbell-front-raise-m-m-eq1\" d=\"~~_*N1!zqNe0\"/><path id=\"dumbbell-front-raise-m-mf-foot.l\" d=\"^22\"/><path id=\"dumbbell-front-raise-m-mf-foot.r\" d=\"^22\"/><path id=\"dumbbell-front-raise-m-mo-0\" d=\"^28\"/><path id=\"dumbbell-front-raise-m-mo-1\" d=\"^29\"/><path id=\"dumbbell-front-raise-m-mo-2\" d=\"^19\"/><path id=\"dumbbell-front-raise-m-mo-3\" d=\"^20\"/><path id=\"dumbbell-front-raise-m-mo-4\" d=\"^21\"/><path id=\"dumbbell-front-raise-m-mo-5\" d=\"^22\"/><path id=\"dumbbell-front-raise-m-mo-6\" d=\"^23\"/><path id=\"dumbbell-front-raise-m-mo-7\" d=\"^24\"/><path id=\"dumbbell-front-raise-m-mo-8\" d=\"^25\"/><path id=\"dumbbell-front-raise-m-mo-9\" d=\"^26\"/><path id=\"dumbbell-front-raise-m-mo-10\" d=\"^27\"/><path id=\"dumbbell-front-raise-m-mo-11\" d=\"^19\"/><path id=\"dumbbell-front-raise-m-mo-12\" d=\"^20\"/><path id=\"dumbbell-front-raise-m-mo-13\" d=\"^21\"/><path id=\"dumbbell-front-raise-m-mo-14\" d=\"^22\"/><path id=\"dumbbell-front-raise-m-mo-15\" d=\"^23\"/><path id=\"dumbbell-front-raise-m-mo-16\" d=\"^24\"/><path id=\"dumbbell-front-raise-m-mo-17\" d=\"^25\"/><path id=\"dumbbell-front-raise-m-mo-18\" d=\"^26\"/><path id=\"dumbbell-front-raise-m-mo-19\" d=\"^27\"/><path id=\"dumbbell-front-raise-m-mo-20\" d=\"^32\"/><path id=\"dumbbell-front-raise-m-mo-21\" d=\"^33\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-front-raise-m-dots)\"/>\n  <path class=\"datum\" d=\"^30\"/><path class=\"floorline\" d=\"^31\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-m-st-upper.r\"/><use href=\"#dumbbell-front-raise-m-st-elbowcap.r\"/><use href=\"#dumbbell-front-raise-m-st-fore.r\"/><use href=\"#dumbbell-front-raise-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-m-st-upper.r\"/><use href=\"#dumbbell-front-raise-m-st-elbowcap.r\"/><use href=\"#dumbbell-front-raise-m-st-fore.r\"/><use href=\"#dumbbell-front-raise-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-m-g0-upper.r\"/><use href=\"#dumbbell-front-raise-m-g0-elbowcap.r\"/><use href=\"#dumbbell-front-raise-m-g0-fore.r\"/><use href=\"#dumbbell-front-raise-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-m-g0-upper.r\"/><use href=\"#dumbbell-front-raise-m-g0-elbowcap.r\"/><use href=\"#dumbbell-front-raise-m-g0-fore.r\"/><use href=\"#dumbbell-front-raise-m-g0-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-m-g0-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-m-g0-eq1.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-m-g1-upper.r\"/><use href=\"#dumbbell-front-raise-m-g1-elbowcap.r\"/><use href=\"#dumbbell-front-raise-m-g1-fore.r\"/><use href=\"#dumbbell-front-raise-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-m-g1-upper.r\"/><use href=\"#dumbbell-front-raise-m-g1-elbowcap.r\"/><use href=\"#dumbbell-front-raise-m-g1-fore.r\"/><use href=\"#dumbbell-front-raise-m-g1-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-m-g1-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-m-g1-eq1.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-m-g2-upper.r\"/><use href=\"#dumbbell-front-raise-m-g2-elbowcap.r\"/><use href=\"#dumbbell-front-raise-m-g2-fore.r\"/><use href=\"#dumbbell-front-raise-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-m-g2-upper.r\"/><use href=\"#dumbbell-front-raise-m-g2-elbowcap.r\"/><use href=\"#dumbbell-front-raise-m-g2-fore.r\"/><use href=\"#dumbbell-front-raise-m-g2-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-m-g2-eq1.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-m-g2-eq1.dumbbell.0-0\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-m-e-thigh.l\"/><use href=\"#dumbbell-front-raise-m-e-kneecap.l\"/><use href=\"#dumbbell-front-raise-m-e-shank.l\"/><use href=\"#dumbbell-front-raise-m-e-foot.l\"/><use href=\"#dumbbell-front-raise-m-e-shcap.l\"/><use href=\"#dumbbell-front-raise-m-e-upper.l\"/><use href=\"#dumbbell-front-raise-m-e-elbowcap.l\"/><use href=\"#dumbbell-front-raise-m-e-fore.l\"/><use href=\"#dumbbell-front-raise-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-m-e-thigh.l\"/><use href=\"#dumbbell-front-raise-m-e-kneecap.l\"/><use href=\"#dumbbell-front-raise-m-e-shank.l\"/><use href=\"#dumbbell-front-raise-m-e-foot.l\"/><use href=\"#dumbbell-front-raise-m-e-shcap.l\"/><use href=\"#dumbbell-front-raise-m-e-upper.l\"/><use href=\"#dumbbell-front-raise-m-e-elbowcap.l\"/><use href=\"#dumbbell-front-raise-m-e-fore.l\"/><use href=\"#dumbbell-front-raise-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-m-e-head\"/><use href=\"#dumbbell-front-raise-m-e-torso\"/><use href=\"#dumbbell-front-raise-m-e-thigh.r\"/><use href=\"#dumbbell-front-raise-m-e-kneecap.r\"/><use href=\"#dumbbell-front-raise-m-e-shank.r\"/><use href=\"#dumbbell-front-raise-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-m-e-head\"/><use href=\"#dumbbell-front-raise-m-e-torso\"/><use href=\"#dumbbell-front-raise-m-e-thigh.r\"/><use href=\"#dumbbell-front-raise-m-e-kneecap.r\"/><use href=\"#dumbbell-front-raise-m-e-shank.r\"/><use href=\"#dumbbell-front-raise-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-m-e-shcap.r\"/><use href=\"#dumbbell-front-raise-m-e-upper.r\"/><use href=\"#dumbbell-front-raise-m-e-elbowcap.r\"/><use href=\"#dumbbell-front-raise-m-e-fore.r\"/><use href=\"#dumbbell-front-raise-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-front-raise-m-e-shcap.r\"/><use href=\"#dumbbell-front-raise-m-e-upper.r\"/><use href=\"#dumbbell-front-raise-m-e-elbowcap.r\"/><use href=\"#dumbbell-front-raise-m-e-fore.r\"/><use href=\"#dumbbell-front-raise-m-e-fist.r\"/></g></g><path class=\"disc\" d=\"^32\"/><path class=\"disc-core\" d=\"^33\"/><path class=\"eq-cable m-line\" d=\"^34\"/><path class=\"eq-cable m-line\" d=\"^35\"/><path class=\"eq-cable m-line\" d=\"^36\"/><path class=\"eq-cable m-line\" d=\"^37\"/><path class=\"eq-cable m-line\" d=\"^38\"/><path class=\"eq-cable m-line\" d=\"^39\"/><path class=\"eq-cable m-line\" d=\"^40\"/><circle class=\"joint\" cx=\"148.54\" cy=\"136.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"196.15\" cy=\"136.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"150\" cy=\"203.73\" r=\"2.25\"/><circle class=\"joint\" cx=\"153.29\" cy=\"266.24\" r=\"2.25\"/></g><mask id=\"dumbbell-front-raise-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#dumbbell-front-raise-m-m-head\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-torso\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-thigh.l\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-shank.l\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-mf-foot.l\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-shcap.l\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-upper.l\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-fore.l\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-fist.l\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-thigh.r\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-shank.r\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-mf-foot.r\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-shcap.r\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-upper.r\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-fore.r\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-m-fist.r\" fill=\"#000\"/><use href=\"#dumbbell-front-raise-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-front-raise-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#dumbbell-front-raise-m-mmask)\"><g class=\"u-stroke\"><use href=\"#dumbbell-front-raise-m-m-head\"/><use href=\"#dumbbell-front-raise-m-m-torso\"/><use href=\"#dumbbell-front-raise-m-m-thigh.l\"/><use href=\"#dumbbell-front-raise-m-m-kneecap.l\"/><use href=\"#dumbbell-front-raise-m-m-shank.l\"/><use href=\"#dumbbell-front-raise-m-m-shcap.l\"/><use href=\"#dumbbell-front-raise-m-m-upper.l\"/><use href=\"#dumbbell-front-raise-m-m-elbowcap.l\"/><use href=\"#dumbbell-front-raise-m-m-fore.l\"/><use href=\"#dumbbell-front-raise-m-m-fist.l\"/><use href=\"#dumbbell-front-raise-m-m-thigh.r\"/><use href=\"#dumbbell-front-raise-m-m-kneecap.r\"/><use href=\"#dumbbell-front-raise-m-m-shank.r\"/><use href=\"#dumbbell-front-raise-m-m-shcap.r\"/><use href=\"#dumbbell-front-raise-m-m-upper.r\"/><use href=\"#dumbbell-front-raise-m-m-elbowcap.r\"/><use href=\"#dumbbell-front-raise-m-m-fore.r\"/><use href=\"#dumbbell-front-raise-m-m-fist.r\"/><use href=\"#dumbbell-front-raise-m-m-eq0\"/><use href=\"#dumbbell-front-raise-m-m-eq1\"/></g></g><g class=\"mistake-layer\"><path class=\"leader m\" d=\"M242.6 125.74L257 62H267\"/><path class=\"leader m\" d=\"M173.44 178.23L195 242H205\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dumbbell-front-raise-m-swing\" data-key=\"swing\" data-cue=\"The dumbbells swing up with body momentum.\" class=\"plate-callout two m\" style=\"left:73.18%;top:11.17%\" aria-pressed=\"true\">Swinging<br>up</button><button type=\"button\" id=\"dumbbell-front-raise-m-hips\" data-key=\"hips\" data-cue=\"The hips push forward to swing the weights up.\" class=\"plate-callout two m\" style=\"left:55.87%;top:61.45%\" aria-pressed=\"false\">Hips<br>forward</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "shoulders",
        cues: [{ key: "shoulders", cue: "Pull your shoulders down and back and hold them there." }, { key: "elbows", cue: "Raise the dumbbells in front, elbows rising slightly ahead of the hands." }, { key: "height", cue: "Stop when your arms are level with your shoulders." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "swing",
        cues: [{ key: "swing", cue: "The dumbbells swing up with body momentum." }, { key: "hips", cue: "The hips push forward to swing the weights up." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Swinging up</b><span>The dumbbells swing up with body momentum.</span></li><li><b>Hips forward</b><span>The hips push forward to swing the weights up.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: raise 1 second, hold 1 second, lower 3 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Raise</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:3 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>3 s</span></div></div></div>",
      alt: "Dumbbell front raise, side view. Standing tall with a dumbbell in each hand in front of the thighs, the arms rise forward with a soft elbow bend until they are level with the shoulders.",
      mistakeAlt: "Dumbbell Front Raise: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hold",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW6: no pair key draws the card's hand zoom; the grip copy carries c1, c6, c7 and c9.",
    "orientation": "pronated",
    "handle": "dumbbell",
    "overBody": false,
    "width": {
      "text": "Dumbbells in front of your thighs, shoulder-width apart as they rise.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-front-raise",
          "ace-front-raise",
          "mo-front-raise"
        ],
        "note": "c6, c2"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-front-raise",
          "mo-front-raise",
          "bb-front-raise"
        ],
        "note": "c1"
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "ext": [
        0,
        0
      ],
      "limitText": "Keep your wrists straight, not bent up or down.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-front-raise",
          "mo-front-raise"
        ],
        "note": "c9"
      }
    },
    "faults": [],
    "gripLine": "Closed grip, palms down, thumbs around the handles, dumbbells shoulder-width apart. Near the top, turn the inside edge slightly up.",
    "cue": "Palms down, wrists straight."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Stand with feet slightly wider than hips, or in a split stance.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-front-raise"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "grip",
      "text": "Dumbbells in front of your thighs, palms facing them. Elbows slightly bent.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-front-raise",
          "mo-front-raise"
        ],
        "note": "c1, c2"
      }
    },
    {
      "kind": "brace",
      "text": "Brace your torso and pull your shoulders down and back.",
      "zoom": "dfr-hips",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-front-raise",
          "bb-front-raise"
        ],
        "note": "c4"
      }
    },
    {
      "kind": "load",
      "text": "Pick a lighter weight than you think.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-front-raise",
          "bb-front-raise",
          "mo-front-raise"
        ],
        "note": "c14"
      }
    },
    {
      "kind": "brace",
      "text": "Breathe out, raise slowly. Breathe in, lower slowly, not onto your thighs.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-front-raise",
          "mo-front-raise",
          "bb-front-raise"
        ],
        "note": "c5, c10, c11"
      }
    }
  ],
  posture: [
    {
      "key": "raise",
      "label": "Raise slowly",
      "detail": "Breathe out and raise the dumbbells slowly in front of you.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-front-raise"
        ],
        "note": "c5"
      }
    },
    {
      "key": "width",
      "label": "Shoulder-width",
      "detail": "Keep them shoulder-width apart, elbows slightly bent.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-front-raise",
          "ace-front-raise",
          "mo-front-raise"
        ],
        "note": "c6, c2"
      }
    },
    {
      "key": "turn",
      "label": "Edge up",
      "detail": "Near shoulder height, turn the inside edge of the dumbbells slightly up.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-front-raise"
        ],
        "note": "c7"
      }
    },
    {
      "key": "height",
      "label": "Shoulder height",
      "detail": "Stop when your arms are level with your shoulders.",
      "anchor": {
        "pose": "end",
        "at": "shoulder.r"
      },
      "zoom": "dfr-top-height",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-front-raise",
          "mo-front-raise",
          "sl-front-raise",
          "fv-front-raise"
        ],
        "note": "c8"
      }
    },
    {
      "key": "torso",
      "label": "Torso upright",
      "detail": "Torso upright, no arch in the low back. Wrists straight.",
      "anchor": {
        "pose": "end",
        "at": "lumbar"
      },
      "zoom": "dfr-hips",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-front-raise",
          "mo-front-raise"
        ],
        "note": "c9"
      }
    },
    {
      "key": "lower",
      "label": "Lower slowly",
      "detail": "Breathe in and lower slowly. Don't rest them on your thighs.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-front-raise",
          "mo-front-raise",
          "bb-front-raise"
        ],
        "note": "c10, c11"
      }
    }
  ],
  zooms: [
    {
      "key": "dfr-top-height",
      "chip": "Top height",
      "heading": "Arm height",
      "kind": "posture"
    },
    {
      "key": "dfr-hips",
      "chip": "Hips",
      "heading": "Body still",
      "kind": "posture"
    }
  ],
  chips: [
    "dfr-top-height",
    "dfr-hips",
    "feel"
  ],
  copy: {
    "setupLine": "Brace, shoulders down and back. Breathe out and raise the dumbbells slowly in front of you.",
    "mistakeLine": "Breathe in and lower slowly. Don't rest the dumbbells on your thighs.",
    "cueLine": "Stop at shoulder height."
  },
  mistakes: [
    {
      "key": "swing",
      "title": "Swinging the weights up",
      "zoom": "dfr-hips",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-front-raise",
          "bb-front-raise"
        ],
        "note": "c12, c13"
      },
      "fix": "Use lighter dumbbells. Keep your hips still."
    },
    {
      "key": "arch",
      "title": "Arching the back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-front-raise",
          "mo-front-raise",
          "bb-front-raise"
        ],
        "note": "c9, c4"
      },
      "fix": "Brace and keep your torso upright."
    },
    {
      "key": "high",
      "title": "Raising above shoulder height",
      "zoom": "dfr-top-height",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-front-raise",
          "mo-front-raise",
          "sl-front-raise",
          "fv-front-raise"
        ],
        "note": "c8"
      },
      "fix": "Stop when your arms are level with your shoulders."
    }
  ],
  risks: [
    {
      "key": "swing",
      "text": "Shoulder: swinging the weights adds extra stress to the shoulder joints.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-front-raise"
        ],
        "note": "c13"
      }
    },
    {
      "key": "turn",
      "text": "Shoulder: a slight outward turn near shoulder height may reduce shoulder pinching.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-front-raise"
        ],
        "note": "c7"
      }
    },
    {
      "key": "heavy",
      "text": "It is easy to pick a weight that is too heavy.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-front-raise",
          "bb-front-raise",
          "mo-front-raise"
        ],
        "note": "c14"
      }
    }
  ],
  riskFlags: [
    "shoulder"
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
    "ace-front-raise",
    "mo-front-raise",
    "bb-front-raise",
    "sl-front-raise",
    "fv-front-raise",
    "coratella2020",
    "hold-default",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/dumbbell_front_raise.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

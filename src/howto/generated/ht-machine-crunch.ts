// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=d809c6344e5deba95268c2400dfc310adfee645586df721406de98194935277e
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_machine_crunch",
  name: "Machine Crunch",
  hashes: { inputsSha256: "d809c6344e5deba95268c2400dfc310adfee645586df721406de98194935277e", golden: "7c82f539ff8f5768e65c23fad2655f5d9c67cee354bdc52f2cd6c5158ad89a4b" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"machine-crunch-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"machine-crunch-n-st-head\" d=\"~#w12PRuw)qG(sKVqBjFjBjS9Bbz3E3Y4X4)7x8EbRhGm_4.cT1R9Bj0NmBbHmI6!kA3DjygT1Dj0000020000001200010000101100020000000000000002100000210000000000\"/><path id=\"machine-crunch-n-st-torso\" d=\"~#_12PxtwXvzItTFuR9I6B30S9UhU9J6YcwgN60I6)nKm)7XcY4(fX4_kI6Nm)fShTh_4T9)7)fBrzz1EbErG60V90!cwgA3w8Xc)7)fw8K6YkN6P6_cEbA3w8zT2ww101002000000000010000000021002101102001120002000000000100000000001200000120111000000010000000001011000200011000000100\"/><path id=\"machine-crunch-n-st-shcap.r\" d=\"~~Pxtw)A1wP10\"/><path id=\"machine-crunch-n-st-upper.r\" d=\"~#F12w!t(GD1zHt))B1I4T269JpAaT1K4r)1-6.9EcIhXeG7Eli*beE2gI4J1FnHe38X4.1.lD7WgWnAkya(sp00200000000012010100222000000000000000000001100002100000000001000010000020000021\"/><path id=\"machine-crunch-n-st-elbowcap.r\" d=\"~~WDy1DIE1Dz10\"/><path id=\"machine-crunch-n-st-fore.r\" d=\"~#F12DNA1DRE1OFA1IxF1V2!5hG1oGqI4w5-1A1O2Fc-8Sb-1wbW4_dR1JcH1W1U2y6W7BpuvkJ6F8_cPdTh_2*gE7xl00002001010000002020000000000000011210000100002001002000001000000002000000000021\"/><path id=\"machine-crunch-n-st-fist.r\" d=\"~~JFz1FRx1ww10\"/><path id=\"machine-crunch-n-g0-head\" d=\"~#w12w!y1A(rIJx1)FrBnHe-k!4BaV5B4(3.2*8B5Vc*b.pS7IbmT9TiO4HoX5HnvNj!7yfwk)5Hi0012002000000000000000101000001000022001201010000010100000000000\"/><path id=\"machine-crunch-n-g0-torso\" d=\"~#_12FHw1(Dw1G(w1).u.7K8x3nF5Jj!7J8_8SiD4F2H4Kn.b.9zdY3(fX4_kI6Nm)fShTh_4T9)7)fBrzz1EbEr.7wdP7Yd_bO7F1N8TaVaIhy4xb_i_4W7wf)7F1S8GY2(b02000020002200200000000010000000202100120002000000000100000000001200000000000200101101100020000000010100111000000010\"/><path id=\"machine-crunch-n-g0-shcap.r\" d=\"~~DyvPVB1wP10\"/><path id=\"machine-crunch-n-g0-upper.r\" d=\"~#F12_TvU_D1.AvzKD1R3R367HmAfjR4bB2x4Vaz8VjXcKa-kx4Ib-1B22T4aHj!i76B4-2zn(1Ab!qHhDePsP502002101200020000010001010000101212000000000000000220001110101010000000111000000\"/><path id=\"machine-crunch-n-g0-elbowcap.r\" d=\"~~YPz1U)F1Dz10\"/><path id=\"machine-crunch-n-g0-fore.r\" d=\"~#F12YVB1DNG1KJB1G!G1*3w59I1w7xpI5W3z2kB5wbGb(8K4JaF1NeK4Hbw1(1w1N6NdEmD1ntF6_4WeJh.d!6-f)1zm00000000010100210000111000000100020000101000200000022000000010022000202000001000\"/><path id=\"machine-crunch-n-g0-fist.r\" d=\"~~N*B1(Uz1ww10\"/><path id=\"machine-crunch-n-g1-head\" d=\"~#w12S.D1J!tzSB1-!sXpP8Ol0R8.7)4!2lI9z2RdV5.rwaI9(2E9BhR8wp1(mN4DhAc(9(mxaNg0000000200020000000000000010101000000212101001002000011010000000\"/><path id=\"machine-crunch-n-g1-torso\" d=\"~#_12NJz1WNx1-GA1RGw1X5)9.2K1oykW5waD4ykY1(3PeKkB1G9EdY2(fX4_kI6Nm)fShTh_4T9)7)fBrzz1EbErIcJpwlwvFgVunS8-7.c.h1xfYf_2S8PgB4nP8XY2V801000200000020001000102000000101010000120002000000000100000000001200000000010000000100200000001010001010001001001020\"/><path id=\"machine-crunch-n-g1-shcap.r\" d=\"~~(.w1H_D1wP10\"/><path id=\"machine-crunch-n-g1-upper.r\" d=\"~#F12YDx1WYE1G.w1BGE1V2x465AiHicK44B2p)9)3.kKaXcTjB8V9V2z29K4fHeHl78I3O3VnG3S5PsFeHhWqAb00000101000000020000100000000000000000020000000000101002000000020002002000001000\"/><path id=\"machine-crunch-n-g1-elbowcap.r\" d=\"~~wNA1FWH1Dz10\"/><path id=\"machine-crunch-n-g1-fore.r\" d=\"~#F12(KD1DKI1TxD1.XI1*4S30G1YcTlz6y2x21B7J8GdW5)6Y8R2HeR6_8gy2hN6AiGhH19G2U5c!fJk-8YaKd(3-l01000011011100000201210000000020010000001000001010110101200001000000100000000000\"/><path id=\"machine-crunch-n-g1-fist.r\" d=\"~~SwF1JHD1ww10\"/><path id=\"machine-crunch-n-e-thigh.l\" d=\"~#F12(Duy.U1-XsGYU1*b63D1S(1F5*6)6O3E3GU1.9)kGfxk.2OoA9*U1-4E4A2T8!4U*1yc6B1IbK3)fFtPB1HrSz1w5PI1xg01101000000012000200001000020011100000012121001000000000002000200101010200000001\"/><path id=\"machine-crunch-n-e-kneecap.l\" d=\"~~(FG1(AU1_J10\"/><path id=\"machine-crunch-n-e-shank.l\" d=\"~#F12yFG1_!T1)TG1*NS1_3IbF18G6_(1H7V6N3I3w8Ty2S9xcA2-b-4XeNfBx2)1I4R4-8-fA*1B158*bTeD9KhymX3HlW8Uq00111000001010002020000000000201210001000000000010100000000101010000000120000002\"/><path id=\"machine-crunch-n-e-foot.l\" d=\"~#o2wUE1DB)1RBF1EB(1YcF3Uh)7Sp*nU-2E3-J2-4ID1)7)n0TG1_4BbXc_sEbKmUp001002100210120001010020000000100010020010101001\"/><path id=\"machine-crunch-n-e-shcap.l\" d=\"~~UIy1PIF1wP10\"/><path id=\"machine-crunch-n-e-upper.l\" d=\"~#F12!Ry1AzG1)Gy1ETF1X1x485WdJjH1z4i)1F2R7dGlx8EexiKbT7*1x2hz4tP9Ul96O2T3RnT8m(sybUjPoNf10002001010000000000000000210102001110010000002200000110100000101001012000010110\"/><path id=\"machine-crunch-n-e-elbowcap.l\" d=\"~~yxB1!IJ1Dz10\"/><path id=\"machine-crunch-n-e-fore.l\" d=\"~#F12A-D1DHK1xID1BPK1R5W1gE1yh)fx61*1jX7Y4KeU1E9H6T6(cE7P53y2z2Y5DlGaD12O3P4B5!fAmK2DeX9Da-j02110120011210020000000000101010000000000010001001010101100100101001010000011000\"/><path id=\"machine-crunch-n-e-fist.l\" d=\"~~FNG1wKG1ww10\"/><path id=\"machine-crunch-n-e-head\" d=\"~#w12HGH1JWw1EFG1zNvxrJ2.k)4O6T9R5U1N1B9A1-dsIs(b-6(4G8XeIcJo!5HlN9!d_fJ4UoRdWd0000000020002002000000010002000001101010000000200121001000000000\"/><path id=\"machine-crunch-n-e-torso\" d=\"~#_12!yD1(Iz1xFE1RNy1E3xbK2x2*3UjF3AbfNkE1w5_nzfy9E6zdW1(fX4_kI6Nm)fShTh_4T9)7)fBrzz1EbErRjHA1yuwT1wqEU1X2D8T4GeIhB4Gi_bqy9whbV2D8GU2)s00000000002000000010000010000000002000120002000000000100000000001200002100000000011000200000010000000000000101000000\"/><path id=\"machine-crunch-n-e-thigh.r\" d=\"^21\"/><path id=\"machine-crunch-n-e-kneecap.r\" d=\"^22\"/><path id=\"machine-crunch-n-e-shank.r\" d=\"^23\"/><path id=\"machine-crunch-n-e-foot.r\" d=\"^24\"/><path id=\"machine-crunch-n-e-shcap.r\" d=\"^25\"/><path id=\"machine-crunch-n-e-upper.r\" d=\"^26\"/><path id=\"machine-crunch-n-e-elbowcap.r\" d=\"^27\"/><path id=\"machine-crunch-n-e-fore.r\" d=\"^28\"/><path id=\"machine-crunch-n-e-fist.r\" d=\"^29\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#machine-crunch-n-dots)\"/>\n  <path class=\"floorline\" d=\"M84.72 339.5H262.64\"/><path class=\"eq\" d=\"~M(BkYDy2L!Uo0Qwp0..n)oL)oAkQ0)o)ozkL..nwpQ)o0!.nwpLwpzkQ0wpwpAkZ\"/><path class=\"eq\" d=\"~M_zn!W)1L0T!oQ0)o)oUzoLAkwpQ)o0zkwpLwpUzoQ0wpwpTzoLzk)oQwp0Ak)oZ\"/><path class=\"eq\" d=\"~MJxny-Y1LSH80Qwp0RR7)oL)oAkQ0)o)ozkLRR7wpQ)o0SR7wpLwpzkQ0wpwpAkZ\"/><path class=\"eq\" d=\"~MJxnN_N1LAX40Qwp0z(3)oL)oAkQ0)o)ozkLz(3wpQ)o0A(3wpLwpzkQ0wpwpAkZ\"/><path class=\"eq\" d=\"~MD!J1U*)1L0GB3Q0GiGiwT2LHiHiQEi0EiHiLFiwT2Q0FiFixT2LEiEiQHi0HiEiZ\"/><path class=\"eq\" d=\"~MyErDyX1LY.90Qwp0Xy9)oL)owbQ0)o)o)aLXy9wpQ)o0Yy9wpLwp)aQ0wpwpwbZ\"/><path class=\"eq\" d=\"~M_Oq!IU1LAiOAgQs)oEH1UHfLAaJpQ*or-bUoLW7JJfQrwpDH1THfLxaIpQwps!bToZ\"/><path class=\"eq\" d=\"~~UXH1wD!1HS11\"/><path class=\"eq-pin\" d=\"~~UzJ1wD!1F60\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-n-st-head\"/><use href=\"#machine-crunch-n-st-torso\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-n-st-head\"/><use href=\"#machine-crunch-n-st-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-n-st-shcap.r\"/><use href=\"#machine-crunch-n-st-upper.r\"/><use href=\"#machine-crunch-n-st-elbowcap.r\"/><use href=\"#machine-crunch-n-st-fore.r\"/><use href=\"#machine-crunch-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-n-st-shcap.r\"/><use href=\"#machine-crunch-n-st-upper.r\"/><use href=\"#machine-crunch-n-st-elbowcap.r\"/><use href=\"#machine-crunch-n-st-fore.r\"/><use href=\"#machine-crunch-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-n-g0-head\"/><use href=\"#machine-crunch-n-g0-torso\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-n-g0-head\"/><use href=\"#machine-crunch-n-g0-torso\"/></g></g><path class=\"eq\" d=\"~MyItAAN1L_.9*WbQw8R9G*9HBbLIeH4QR9x8X1_eLBH9NVbQx8S9H*9GBbLJeG4QS9y8Y1-eZ\"/><path class=\"eq-solid\" d=\"~MyJE1HDB1L0Xy3Q0TeTeAU2LUeUeQTe0TeUeLUeAU2Q0UeUezU2LTeTeQUe0UeTeZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-n-g0-shcap.r\"/><use href=\"#machine-crunch-n-g0-upper.r\"/><use href=\"#machine-crunch-n-g0-elbowcap.r\"/><use href=\"#machine-crunch-n-g0-fore.r\"/><use href=\"#machine-crunch-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-n-g0-shcap.r\"/><use href=\"#machine-crunch-n-g0-upper.r\"/><use href=\"#machine-crunch-n-g0-elbowcap.r\"/><use href=\"#machine-crunch-n-g0-fore.r\"/><use href=\"#machine-crunch-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-n-g1-head\"/><use href=\"#machine-crunch-n-g1-torso\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-n-g1-head\"/><use href=\"#machine-crunch-n-g1-torso\"/></g></g><path class=\"eq\" d=\"~MJGtNGN1LH.bIB9Q!9T7x-b!T8L*eA1QT7*9-4AeL.GbSE9Q.9U7D-bXT8L_eB1QW7!9(4zeZ\"/><path class=\"eq-solid\" d=\"~MFOG1Y.E1L0Xy3Q0TeVeAU2LWeUeQTe0TeUeLUeAU2Q0UeUezU2LTeTeQWe0WeTeZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-n-g1-shcap.r\"/><use href=\"#machine-crunch-n-g1-upper.r\"/><use href=\"#machine-crunch-n-g1-elbowcap.r\"/><use href=\"#machine-crunch-n-g1-fore.r\"/><use href=\"#machine-crunch-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-n-g1-shcap.r\"/><use href=\"#machine-crunch-n-g1-upper.r\"/><use href=\"#machine-crunch-n-g1-elbowcap.r\"/><use href=\"#machine-crunch-n-g1-fore.r\"/><use href=\"#machine-crunch-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#machine-crunch-n-e-thigh.l\"/><use href=\"#machine-crunch-n-e-kneecap.l\"/><use href=\"#machine-crunch-n-e-shank.l\"/><use href=\"#machine-crunch-n-e-foot.l\"/><use href=\"#machine-crunch-n-e-shcap.l\"/><use href=\"#machine-crunch-n-e-upper.l\"/><use href=\"#machine-crunch-n-e-elbowcap.l\"/><use href=\"#machine-crunch-n-e-fore.l\"/><use href=\"#machine-crunch-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-n-e-thigh.l\"/><use href=\"#machine-crunch-n-e-kneecap.l\"/><use href=\"#machine-crunch-n-e-shank.l\"/><use href=\"#machine-crunch-n-e-foot.l\"/><use href=\"#machine-crunch-n-e-shcap.l\"/><use href=\"#machine-crunch-n-e-upper.l\"/><use href=\"#machine-crunch-n-e-elbowcap.l\"/><use href=\"#machine-crunch-n-e-fore.l\"/><use href=\"#machine-crunch-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-n-e-head\"/><use href=\"#machine-crunch-n-e-torso\"/><use href=\"#machine-crunch-n-e-thigh.r\"/><use href=\"#machine-crunch-n-e-kneecap.r\"/><use href=\"#machine-crunch-n-e-shank.r\"/><use href=\"#machine-crunch-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-n-e-head\"/><use href=\"#machine-crunch-n-e-torso\"/><use href=\"#machine-crunch-n-e-thigh.r\"/><use href=\"#machine-crunch-n-e-kneecap.r\"/><use href=\"#machine-crunch-n-e-shank.r\"/><use href=\"#machine-crunch-n-e-foot.r\"/></g></g><path class=\"eq\" d=\"~MSDtHNN1LADdGE6QHbG5zwdWW5L.ez2QG5GbX7_cLOVcFK6QGbH5AwdVW5L!eA2QH5FbY7-cZ\"/><path class=\"eq-solid\" d=\"~M!!H1J(H1L0Xy3Q0TeTeAU2LUeUeQTe0TeUeLUeAU2Q0UeUezU2LTeTeQUe0UeTeZ\"/><path class=\"eq\" d=\"~~(Jrw)K1SA10\"/><path class=\"eq-pin\" d=\"~~wHsw)K1P70\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-n-e-shcap.r\"/><use href=\"#machine-crunch-n-e-upper.r\"/><use href=\"#machine-crunch-n-e-elbowcap.r\"/><use href=\"#machine-crunch-n-e-fore.r\"/><use href=\"#machine-crunch-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-n-e-shcap.r\"/><use href=\"#machine-crunch-n-e-upper.r\"/><use href=\"#machine-crunch-n-e-elbowcap.r\"/><use href=\"#machine-crunch-n-e-fore.r\"/><use href=\"#machine-crunch-n-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"~MJFB1FRx1LbY1L20L10L00L20L10L20Ll7L00L01L02L00L20L11LfdL00L20L10L00\"/><path class=\"eq-line m-line\" d=\"~MA-z1!Jy1LK1vL10L00L00L20LedL01L00L00L02L21L10Lk7L20L10L00L20L10L20Lk0L20L10L20L00L10L20LkaL11L20L00L02L01L00LegL20L02L01L10\"/><path class=\"eq-line m-line\" d=\"~MSXA1WVw1LP1w1L00L11L22L00LfgL10L21L02L00L00L01LlaL20L10L20L00L10\"/><path class=\"eq-line m-line\" d=\"~MY-z1FRvLW10L20L10L20L10L20L10L20L10L20L00L10L20L10L20L10L20LX1_1L00L00L00L01L02L00L00L00L00L00L01L02L00L00L00L00L01L02\"/><path class=\"eq-line m-line\" d=\"~MwXA1wOy1L0_1L00L00L00L01L02L00L00L00L00L01L02L00L00L00L00L00L01L02LX1-1L20L10L20L10L20L10L00L20L10L20L10L20L10L20L10L20LW1-1L02L01L00L00L00L00L00L02L01L00L00L00L00L02L01L00L00L00\"/><path class=\"eq-line m-line\" d=\"~MY-z1PTw1L0-1L02L01L00L00L00L00L02L01L00L00L00L00L00L02L01L00L00\"/><circle class=\"joint\" cx=\"183.62\" cy=\"206.64\" r=\"2.25\"/><circle class=\"joint\" cx=\"195.24\" cy=\"227.18\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.4\" cy=\"258.4\" r=\"2.25\"/><circle class=\"joint\" cx=\"218.52\" cy=\"267.03\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#U10P*B1S.y1BYB1IXy10220110200z1y1020100221102010201221100020102G1o02102120002000001111100010001101000001010120000011111000010100200121000011111100000001210020200100000000002120\"/><path class=\"arrow\" d=\"~MY.G1yBF1LXw1BqLYy2NaZ\"/></g><path class=\"leader\" d=\"M135.92 260.44L97.8 274H87.8\"/><circle class=\"anchor\" cx=\"135.92\" cy=\"260.44\" r=\"1.5\"/><path class=\"leader\" d=\"M161.28 204.6L146.11 150H136.11\"/><circle class=\"anchor\" cx=\"161.28\" cy=\"204.6\" r=\"1.5\"/><path class=\"leader\" d=\"M181.3 235.36L235 248H245\"/><circle class=\"anchor\" cx=\"181.3\" cy=\"235.36\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"machine-crunch-n-hips\" data-key=\"hips\" data-cue=\"Keep your hips pressed against the back of the seat.\" class=\"plate-callout\" style=\"left:4.47%;top:70.39%\" aria-pressed=\"true\">Hips back</button><button type=\"button\" id=\"machine-crunch-n-curl\" data-key=\"curl\" data-cue=\"Curl your ribs down toward your pelvis.\" class=\"plate-callout two\" style=\"left:19.55%;top:35.75%\" aria-pressed=\"false\">Curl the<br>spine</button><button type=\"button\" id=\"machine-crunch-n-core\" data-key=\"core\" data-cue=\"Start the crunch with your abs, not by pulling with your arms.\" class=\"plate-callout\" style=\"left:67.04%;top:63.13%\" aria-pressed=\"false\">Core leads</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"machine-crunch-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"machine-crunch-m-st-head\" d=\"^0\"/><path id=\"machine-crunch-m-st-torso\" d=\"^1\"/><path id=\"machine-crunch-m-st-shcap.r\" d=\"^2\"/><path id=\"machine-crunch-m-st-upper.r\" d=\"^3\"/><path id=\"machine-crunch-m-st-elbowcap.r\" d=\"^4\"/><path id=\"machine-crunch-m-st-fore.r\" d=\"^5\"/><path id=\"machine-crunch-m-st-fist.r\" d=\"^6\"/><path id=\"machine-crunch-m-g0-head\" d=\"^7\"/><path id=\"machine-crunch-m-g0-torso\" d=\"^8\"/><path id=\"machine-crunch-m-g0-shcap.r\" d=\"^9\"/><path id=\"machine-crunch-m-g0-upper.r\" d=\"^10\"/><path id=\"machine-crunch-m-g0-elbowcap.r\" d=\"^11\"/><path id=\"machine-crunch-m-g0-fore.r\" d=\"^12\"/><path id=\"machine-crunch-m-g0-fist.r\" d=\"^13\"/><path id=\"machine-crunch-m-g1-head\" d=\"^14\"/><path id=\"machine-crunch-m-g1-torso\" d=\"^15\"/><path id=\"machine-crunch-m-g1-shcap.r\" d=\"^16\"/><path id=\"machine-crunch-m-g1-upper.r\" d=\"^17\"/><path id=\"machine-crunch-m-g1-elbowcap.r\" d=\"^18\"/><path id=\"machine-crunch-m-g1-fore.r\" d=\"^19\"/><path id=\"machine-crunch-m-g1-fist.r\" d=\"^20\"/><path id=\"machine-crunch-m-e-thigh.l\" d=\"^21\"/><path id=\"machine-crunch-m-e-kneecap.l\" d=\"^22\"/><path id=\"machine-crunch-m-e-shank.l\" d=\"^23\"/><path id=\"machine-crunch-m-e-foot.l\" d=\"^24\"/><path id=\"machine-crunch-m-e-shcap.l\" d=\"^25\"/><path id=\"machine-crunch-m-e-upper.l\" d=\"^26\"/><path id=\"machine-crunch-m-e-elbowcap.l\" d=\"^27\"/><path id=\"machine-crunch-m-e-fore.l\" d=\"^28\"/><path id=\"machine-crunch-m-e-fist.l\" d=\"^29\"/><path id=\"machine-crunch-m-e-head\" d=\"^30\"/><path id=\"machine-crunch-m-e-torso\" d=\"^31\"/><path id=\"machine-crunch-m-e-thigh.r\" d=\"^21\"/><path id=\"machine-crunch-m-e-kneecap.r\" d=\"^22\"/><path id=\"machine-crunch-m-e-shank.r\" d=\"^23\"/><path id=\"machine-crunch-m-e-foot.r\" d=\"^24\"/><path id=\"machine-crunch-m-e-shcap.r\" d=\"^25\"/><path id=\"machine-crunch-m-e-upper.r\" d=\"^26\"/><path id=\"machine-crunch-m-e-elbowcap.r\" d=\"^27\"/><path id=\"machine-crunch-m-e-fore.r\" d=\"^28\"/><path id=\"machine-crunch-m-e-fist.r\" d=\"^29\"/><path id=\"machine-crunch-m-m-head\" d=\"^0\"/><path id=\"machine-crunch-m-m-torso\" d=\"^1\"/><path id=\"machine-crunch-m-m-shcap.l\" d=\"^2\"/><path id=\"machine-crunch-m-m-upper.l\" d=\"~#F12HRtSyD1G)s)PB1G4R465NqWktB5jK2Gazhz7)jEcxbTkx5xiT8R29B5dHnDo7a)4*3KjF4W9HrYgwfysw700000012101011000010000000000200101000100010000000210112001000000000002100100000\"/><path id=\"machine-crunch-m-m-elbowcap.l\" d=\"~~YGy1PIG1Dz10\"/><path id=\"machine-crunch-m-m-fore.l\" d=\"~#F12WJz1HPH1RYy1BKH1G7X1H1nFvG3T6R3X1T1RihVc)6Gb0XcY6TiaV1U1X6P3FvW3J1oK7W1z8yaSjWaDh2WjIa00200000100111002000000101010012100020210100000000012101200000011000000100000000\"/><path id=\"machine-crunch-m-m-shcap.r\" d=\"^2\"/><path id=\"machine-crunch-m-m-upper.r\" d=\"^61\"/><path id=\"machine-crunch-m-m-elbowcap.r\" d=\"^62\"/><path id=\"machine-crunch-m-m-fore.r\" d=\"^63\"/><path id=\"machine-crunch-m-mf-thigh.l\" d=\"^21\"/><path id=\"machine-crunch-m-mf-kneecap.l\" d=\"^22\"/><path id=\"machine-crunch-m-mf-shank.l\" d=\"^23\"/><path id=\"machine-crunch-m-mf-foot.l\" d=\"^24\"/><path id=\"machine-crunch-m-mf-fist.l\" d=\"^29\"/><path id=\"machine-crunch-m-mf-thigh.r\" d=\"^21\"/><path id=\"machine-crunch-m-mf-kneecap.r\" d=\"^22\"/><path id=\"machine-crunch-m-mf-shank.r\" d=\"^23\"/><path id=\"machine-crunch-m-mf-foot.r\" d=\"^24\"/><path id=\"machine-crunch-m-mf-fist.r\" d=\"^29\"/><path id=\"machine-crunch-m-mo-0\" d=\"^30\"/><path id=\"machine-crunch-m-mo-1\" d=\"^31\"/><path id=\"machine-crunch-m-mo-2\" d=\"^21\"/><path id=\"machine-crunch-m-mo-3\" d=\"^22\"/><path id=\"machine-crunch-m-mo-4\" d=\"^23\"/><path id=\"machine-crunch-m-mo-5\" d=\"^24\"/><path id=\"machine-crunch-m-mo-6\" d=\"^25\"/><path id=\"machine-crunch-m-mo-7\" d=\"^26\"/><path id=\"machine-crunch-m-mo-8\" d=\"^27\"/><path id=\"machine-crunch-m-mo-9\" d=\"^28\"/><path id=\"machine-crunch-m-mo-10\" d=\"^29\"/><path id=\"machine-crunch-m-mo-11\" d=\"^21\"/><path id=\"machine-crunch-m-mo-12\" d=\"^22\"/><path id=\"machine-crunch-m-mo-13\" d=\"^23\"/><path id=\"machine-crunch-m-mo-14\" d=\"^24\"/><path id=\"machine-crunch-m-mo-15\" d=\"^25\"/><path id=\"machine-crunch-m-mo-16\" d=\"^26\"/><path id=\"machine-crunch-m-mo-17\" d=\"^27\"/><path id=\"machine-crunch-m-mo-18\" d=\"^28\"/><path id=\"machine-crunch-m-mo-19\" d=\"^29\"/><path id=\"machine-crunch-m-mo-20\" d=\"^33\"/><path id=\"machine-crunch-m-mo-21\" d=\"^34\"/><path id=\"machine-crunch-m-mo-22\" d=\"^35\"/><path id=\"machine-crunch-m-mo-23\" d=\"^36\"/><path id=\"machine-crunch-m-mo-24\" d=\"^37\"/><path id=\"machine-crunch-m-mo-25\" d=\"^38\"/><path id=\"machine-crunch-m-mo-26\" d=\"^39\"/><path id=\"machine-crunch-m-mo-27\" d=\"^40\"/><path id=\"machine-crunch-m-mo-28\" d=\"^41\"/><path id=\"machine-crunch-m-mo-29\" d=\"^46\"/><path id=\"machine-crunch-m-mo-30\" d=\"^47\"/><path id=\"machine-crunch-m-mo-31\" d=\"^48\"/><path id=\"machine-crunch-m-mo-32\" d=\"^49\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#machine-crunch-m-dots)\"/>\n  <path class=\"floorline\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><path class=\"eq\" d=\"^38\"/><path class=\"eq\" d=\"^39\"/><path class=\"eq\" d=\"^40\"/><path class=\"eq-pin\" d=\"^41\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-m-st-head\"/><use href=\"#machine-crunch-m-st-torso\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-m-st-head\"/><use href=\"#machine-crunch-m-st-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-m-st-shcap.r\"/><use href=\"#machine-crunch-m-st-upper.r\"/><use href=\"#machine-crunch-m-st-elbowcap.r\"/><use href=\"#machine-crunch-m-st-fore.r\"/><use href=\"#machine-crunch-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-m-st-shcap.r\"/><use href=\"#machine-crunch-m-st-upper.r\"/><use href=\"#machine-crunch-m-st-elbowcap.r\"/><use href=\"#machine-crunch-m-st-fore.r\"/><use href=\"#machine-crunch-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-m-g0-head\"/><use href=\"#machine-crunch-m-g0-torso\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-m-g0-head\"/><use href=\"#machine-crunch-m-g0-torso\"/></g></g><path class=\"eq\" d=\"^42\"/><path class=\"eq-solid\" d=\"^43\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-m-g0-shcap.r\"/><use href=\"#machine-crunch-m-g0-upper.r\"/><use href=\"#machine-crunch-m-g0-elbowcap.r\"/><use href=\"#machine-crunch-m-g0-fore.r\"/><use href=\"#machine-crunch-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-m-g0-shcap.r\"/><use href=\"#machine-crunch-m-g0-upper.r\"/><use href=\"#machine-crunch-m-g0-elbowcap.r\"/><use href=\"#machine-crunch-m-g0-fore.r\"/><use href=\"#machine-crunch-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-m-g1-head\"/><use href=\"#machine-crunch-m-g1-torso\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-m-g1-head\"/><use href=\"#machine-crunch-m-g1-torso\"/></g></g><path class=\"eq\" d=\"^44\"/><path class=\"eq-solid\" d=\"^45\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-m-g1-shcap.r\"/><use href=\"#machine-crunch-m-g1-upper.r\"/><use href=\"#machine-crunch-m-g1-elbowcap.r\"/><use href=\"#machine-crunch-m-g1-fore.r\"/><use href=\"#machine-crunch-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-m-g1-shcap.r\"/><use href=\"#machine-crunch-m-g1-upper.r\"/><use href=\"#machine-crunch-m-g1-elbowcap.r\"/><use href=\"#machine-crunch-m-g1-fore.r\"/><use href=\"#machine-crunch-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#machine-crunch-m-e-thigh.l\"/><use href=\"#machine-crunch-m-e-kneecap.l\"/><use href=\"#machine-crunch-m-e-shank.l\"/><use href=\"#machine-crunch-m-e-foot.l\"/><use href=\"#machine-crunch-m-e-shcap.l\"/><use href=\"#machine-crunch-m-e-upper.l\"/><use href=\"#machine-crunch-m-e-elbowcap.l\"/><use href=\"#machine-crunch-m-e-fore.l\"/><use href=\"#machine-crunch-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-m-e-thigh.l\"/><use href=\"#machine-crunch-m-e-kneecap.l\"/><use href=\"#machine-crunch-m-e-shank.l\"/><use href=\"#machine-crunch-m-e-foot.l\"/><use href=\"#machine-crunch-m-e-shcap.l\"/><use href=\"#machine-crunch-m-e-upper.l\"/><use href=\"#machine-crunch-m-e-elbowcap.l\"/><use href=\"#machine-crunch-m-e-fore.l\"/><use href=\"#machine-crunch-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-m-e-head\"/><use href=\"#machine-crunch-m-e-torso\"/><use href=\"#machine-crunch-m-e-thigh.r\"/><use href=\"#machine-crunch-m-e-kneecap.r\"/><use href=\"#machine-crunch-m-e-shank.r\"/><use href=\"#machine-crunch-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-m-e-head\"/><use href=\"#machine-crunch-m-e-torso\"/><use href=\"#machine-crunch-m-e-thigh.r\"/><use href=\"#machine-crunch-m-e-kneecap.r\"/><use href=\"#machine-crunch-m-e-shank.r\"/><use href=\"#machine-crunch-m-e-foot.r\"/></g></g><path class=\"eq\" d=\"^46\"/><path class=\"eq-solid\" d=\"^47\"/><path class=\"eq\" d=\"^48\"/><path class=\"eq-pin\" d=\"^49\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-crunch-m-e-shcap.r\"/><use href=\"#machine-crunch-m-e-upper.r\"/><use href=\"#machine-crunch-m-e-elbowcap.r\"/><use href=\"#machine-crunch-m-e-fore.r\"/><use href=\"#machine-crunch-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-crunch-m-e-shcap.r\"/><use href=\"#machine-crunch-m-e-upper.r\"/><use href=\"#machine-crunch-m-e-elbowcap.r\"/><use href=\"#machine-crunch-m-e-fore.r\"/><use href=\"#machine-crunch-m-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"^50\"/><path class=\"eq-line m-line\" d=\"^51\"/><path class=\"eq-line m-line\" d=\"^52\"/><path class=\"eq-line m-line\" d=\"^53\"/><path class=\"eq-line m-line\" d=\"^54\"/><path class=\"eq-line m-line\" d=\"^55\"/><circle class=\"joint\" cx=\"183.62\" cy=\"206.64\" r=\"2.25\"/><circle class=\"joint\" cx=\"195.24\" cy=\"227.18\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.4\" cy=\"258.4\" r=\"2.25\"/><circle class=\"joint\" cx=\"218.52\" cy=\"267.03\" r=\"2.25\"/></g><mask id=\"machine-crunch-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#machine-crunch-m-m-head\" fill=\"#000\"/><use href=\"#machine-crunch-m-m-torso\" fill=\"#000\"/><use href=\"#machine-crunch-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#machine-crunch-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#machine-crunch-m-mf-shank.l\" fill=\"#000\"/><use href=\"#machine-crunch-m-mf-foot.l\" fill=\"#000\"/><use href=\"#machine-crunch-m-m-shcap.l\" fill=\"#000\"/><use href=\"#machine-crunch-m-m-upper.l\" fill=\"#000\"/><use href=\"#machine-crunch-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#machine-crunch-m-m-fore.l\" fill=\"#000\"/><use href=\"#machine-crunch-m-mf-fist.l\" fill=\"#000\"/><use href=\"#machine-crunch-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#machine-crunch-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#machine-crunch-m-mf-shank.r\" fill=\"#000\"/><use href=\"#machine-crunch-m-mf-foot.r\" fill=\"#000\"/><use href=\"#machine-crunch-m-m-shcap.r\" fill=\"#000\"/><use href=\"#machine-crunch-m-m-upper.r\" fill=\"#000\"/><use href=\"#machine-crunch-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#machine-crunch-m-m-fore.r\" fill=\"#000\"/><use href=\"#machine-crunch-m-mf-fist.r\" fill=\"#000\"/><use href=\"#machine-crunch-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-crunch-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#machine-crunch-m-mmask)\"><g class=\"u-stroke\"><use href=\"#machine-crunch-m-m-head\"/><use href=\"#machine-crunch-m-m-torso\"/><use href=\"#machine-crunch-m-m-shcap.l\"/><use href=\"#machine-crunch-m-m-upper.l\"/><use href=\"#machine-crunch-m-m-elbowcap.l\"/><use href=\"#machine-crunch-m-m-fore.l\"/><use href=\"#machine-crunch-m-m-shcap.r\"/><use href=\"#machine-crunch-m-m-upper.r\"/><use href=\"#machine-crunch-m-m-elbowcap.r\"/><use href=\"#machine-crunch-m-m-fore.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MwRt!xD1LK1tLgfL00L02L11L20L02L01L02L01L00L12Lm9L00L00L12L21L00L12L21L00L10L22\"/><path class=\"m-line\" d=\"~MDytU.A1LaT1L01L20L10L02L21L10L00L02Lm6L10L02L01L02L01L00L22\"/><path class=\"m-line\" d=\"~MSOty*z1LN1vL12L20L00L10L20L10L20L01L12L20L8kL01L12L20L00\"/><path class=\"m-line\" d=\"~MDNuUOz1LU19L20L0kL10L22L01L00L12L21L00L10L22L01L7kL10L22L01L10L20L10L20\"/><path class=\"m-line\" d=\"~MHRtSyD1LF1F1L20L02L11L20L10L20L00L10L20L10L20L00L10L01L00L00L00L00L10L20L00L00L00L01L02L00L01L22L11L02L00L01L02L21L12L41L02L21L12L01L02L21L12L01L02L21L12L01L02L21L12L01L02L21L12L01L02L21L12L01L00L22L11L02L23L20L11L02L20L10L01L22L10L00L20L11L02L20L10L00L21L12L00L20L10L01L02L20L10L00L21L00L10L20L00L00L00L00L00L10L20L01L02L00L00L00L10L20L00L00L00L00L00\"/><path class=\"m-line\" d=\"~M_Ty1UAH1LP1w1\"/><path class=\"m-line\" d=\"~MA-z1SzF1Lz1I1L00L00L10L20L01L02L10L20L00L00L00L11L22L00L00L10L02L01L12L21L02L01L02L01L02L01L02L01L02L01L02L01L02L01L02L01L02L01L12L21L02L01L14L11L02L20L10L21L12L00L21L12L20L10L01L22L10L01L22L10L20L11L02L20L11L02L20L10L21L12L00L22L12L20L10L20L11L22L10L20L10L21L12L02L01L00L20L10L00L00L00L02L21L31L02L01L12L21L02L01L02L01L02L01L02L00L01\"/><path class=\"m-line\" d=\"~MUJu(Oz1LV1fL2J1\"/><path class=\"m-line\" d=\"~M!Kt_(z1LlW1\"/><path class=\"m-line\" d=\"~MDDz1JKH1LV19L01L02L00L8jL21L12L00L01L02\"/><path class=\"m-line\" d=\"~MWJz1HPH1LW18L02L01L10L20L00L00L02L01L00L00L10L01L00L11L22L10L20L11L22L43L02L01L20L10L00L02L21L05L00L02L01L00L02L01L00L02L01L00L00L02L21L10L02L01L00L00L02L01L00L02L01L00L13L21L12L01L00L02L01L02L21L12L01L02L01L00L22L11L02L01L02L01L02L21L11L00L00L00L20L10L00L00L20L10L00L00L00L20L10L00L00L20L10L00L00L59L11L22L00L10L21L12L20L11L22L00L10Lrx1L22L10L01L02L01L02L20L11LE12L01L02L01L22L11L02L01L02LruL02L11L22L11L20L12L21L12L21L00L12L5aL01L02L01L12L20L01L02L00L01L02L01L12L20L01L02L00L01L02L11L22L02L00L00L00L00L02L01L00L10L20L00L00L00L00L00L00L00L02L01L10L20L00L16L00L00L00L01L02L00L00L00L00L00L00L00L00L00L00L01L02L00L10L20L00L00L00L00L26L01L02L10L20L00L00L10L82L10L22L11L02L21L10L22L32L01L02L00\"/><path class=\"m-line\" d=\"~MSPy1wzH1LS1o\"/><path class=\"m-line\" d=\"~MwFz1ANH1LS1oL01\"/><path class=\"m-line\" d=\"~MFNI1wKG1LbY1L20L10L20L10L20L10Lj9L02L00L20L11L02L00LffL20L11L02L00L20L10L7lL02L00L01L02L01L02L0nL02L01L02L01L00L02L8lL20L10L00L02L21L10LgfL00L02L21L10L00L02Lk9L20L10L20L10L20L10Lo0L10L20L10L20L10L20Lk8L00L02L11L20L02L01LggL10L20L00L00L12L21L8kL02L01L02L01L00L02L0kL02L00L01L02L01L02L7kL11L22L00L00L10L20LfgL01L02L10L21L02L00Lj8L10L20L10L20L10\"/><path class=\"leader m\" d=\"~MPYy1JOD1L0TY9\"/><path class=\"leader m\" d=\"M137.97 202.08L96.08 218H86.08\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"machine-crunch-m-arms\" data-key=\"arms\" data-cue=\"The arms drag the handles down.\" class=\"plate-callout m\" style=\"left:49.72%;top:31.84%\" aria-pressed=\"true\">Arms pull</button><button type=\"button\" id=\"machine-crunch-m-upright\" data-key=\"upright\" data-cue=\"The trunk stays upright and the spine does not curl.\" class=\"plate-callout two m\" style=\"left:7.26%;top:54.75%\" aria-pressed=\"false\">Trunk<br>upright</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "hips",
        cues: [{ key: "hips", cue: "Keep your hips pressed against the back of the seat." }, { key: "curl", cue: "Curl your ribs down toward your pelvis." }, { key: "core", cue: "Start the crunch with your abs, not by pulling with your arms." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "arms",
        cues: [{ key: "arms", cue: "The arms drag the handles down." }, { key: "upright", cue: "The trunk stays upright and the spine does not curl." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Arms pull</b><span>The arms drag the handles down.</span></li><li><b>Trunk upright</b><span>The trunk stays upright and the spine does not curl.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: crunch 2 seconds, return 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Crunch</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div></div>",
      alt: "Machine crunch, side view. Seated with the hips back against the pad, shins against the roller and hands on the handles by the shoulders, the lifter curls the spine forward so the ribs come toward the pelvis.",
      mistakeAlt: "Machine Crunch: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "balance",
    "why": "D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c3 and c14.",
    "handle": "machine-grip",
    "loadAxis": "across",
    "width": {
      "text": "Set by the machine.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-crunch",
          "mo-crunch",
          "fb-crunch"
        ],
        "note": "c3"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "balance-default"
        ],
        "note": "card grip.thumb and grip.handContact: no source gives them (balance archetype default); golden B's balance default, not a card claim, never shown"
      }
    },
    "contact": "finger-base",
    "wrist": {
      "exempt": "Card grip.wrist: balance archetype default only; no source gives a wrist range for this exercise.",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "balance-default"
        ],
        "note": "card grip.wrist: balance archetype default only; no source gives a wrist range, so none is taken and nothing is shown (D-SHIP-W6-WRISTEXEMPT)"
      }
    },
    "faults": [],
    "gripLine": "Hold the handles in both hands. Start the crunch with your abs, not your arms.",
    "cue": "Start the crunch with your abs."
  },
  contacts: [
    "seat-back"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set the seat to a comfortable height and choose the weight.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-crunch",
          "mo-crunch"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Sit with your hips pressed against the back of the seat.",
      "zoom": "crunch-hips",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-crunch"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "brace",
      "text": "Push your shins against the padded roller and tighten your abs.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-crunch"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "grip",
      "text": "Hold the handles in both hands.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-crunch",
          "mo-crunch",
          "fb-crunch"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "position",
      "text": "Breathe out as you crunch. Don't strain your neck.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-crunch"
        ],
        "note": "c7, c14"
      }
    }
  ],
  posture: [
    {
      "key": "hips",
      "label": "Hips back",
      "detail": "Hips stay back in the seat.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "zoom": "crunch-hips",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-crunch"
        ],
        "note": "c2"
      }
    },
    {
      "key": "curl",
      "label": "Curl the spine",
      "detail": "Curl the ribs toward the pelvis.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "zoom": "crunch-curl",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-crunch",
          "fb-crunch"
        ],
        "note": "c4"
      }
    },
    {
      "key": "core",
      "label": "Core leads",
      "detail": "Start the crunch with the abs, not by pulling with the arms.",
      "anchor": {
        "pose": "end",
        "at": "navel"
      },
      "zoom": "crunch-arms",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-crunch"
        ],
        "note": "c14"
      }
    },
    {
      "key": "return",
      "label": "Slow return",
      "detail": "Return slowly, without letting the stack rest.",
      "anchor": {
        "pose": "start",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-crunch",
          "mo-crunch"
        ],
        "note": "c5, c14"
      }
    },
    {
      "key": "breathe",
      "label": "Breathe out",
      "detail": "Breathe out on the crunch.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-crunch"
        ],
        "note": "c7, c14"
      }
    },
    {
      "key": "neck",
      "label": "Neck relaxed",
      "detail": "Don't strain your neck.",
      "anchor": {
        "pose": "end",
        "at": "chin"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-crunch"
        ],
        "note": "c14"
      }
    }
  ],
  zooms: [
    {
      "key": "crunch-arms",
      "chip": "Arms",
      "heading": "Arm pull",
      "kind": "posture"
    },
    {
      "key": "crunch-curl",
      "chip": "Spine",
      "heading": "Spine curl",
      "kind": "posture",
      "feelRow": "hips"
    },
    {
      "key": "crunch-hips",
      "chip": "Hips",
      "heading": "Hips back",
      "kind": "posture"
    }
  ],
  chips: [
    "crunch-arms",
    "crunch-curl",
    "crunch-hips",
    "feel"
  ],
  copy: {
    "setupLine": "Set the seat to a comfortable height. Sit with your hips pressed against the back of the seat.",
    "mistakeLine": "Start the crunch with your abs, not by pulling with your arms.",
    "cueLine": "Ribs toward your pelvis."
  },
  mistakes: [
    {
      "key": "arms",
      "title": "Pulling with the arms",
      "zoom": "crunch-arms",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-crunch"
        ],
        "note": "c14"
      },
      "fix": "Start the crunch with your abs."
    },
    {
      "key": "heavy",
      "title": "Using too much weight",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-crunch"
        ],
        "note": "c6"
      },
      "fix": "Lower the weight to protect your back."
    },
    {
      "key": "rest",
      "title": "Letting the stack rest",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-crunch",
          "mo-crunch"
        ],
        "note": "c5, c14"
      },
      "fix": "Keep tension. Return without letting the stack rest."
    }
  ],
  risks: [
    {
      "key": "back",
      "text": "Too much weight can strain the back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-crunch"
        ],
        "note": "c6"
      }
    },
    {
      "key": "hip-flexors",
      "text": "Lower back pain? This machine works the hip flexors hard, so take care.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "sundstrup-2012"
        ],
        "note": "c10, c9"
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
    "ace-seated-crunch",
    "mo-crunch",
    "fb-crunch",
    "sl-crunch",
    "sundstrup-2012",
    "balance-default",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/machine_crunch.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

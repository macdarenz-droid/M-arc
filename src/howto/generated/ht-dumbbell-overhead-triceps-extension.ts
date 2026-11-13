// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=dc4da4f1028c7af2412f95e50523780400e13b326d7fa343dcb0d32655224ff3
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_dumbbell_overhead_triceps_extension",
  name: "Dumbbell Overhead Triceps Extension",
  hashes: { inputsSha256: "dc4da4f1028c7af2412f95e50523780400e13b326d7fa343dcb0d32655224ff3", golden: "2692ff099b7a245ff2a67e99221ab9e37cfa485fa218678bccaafb401d76b295" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-overhead-triceps-extension-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-overhead-triceps-extension-n-st-fore.l\" d=\"~#F12(Ux1Y_i*Oy1T(i!9y2.1kxH1(1_8Y3H2U1_vS1Dcw7!aeScB6(vkH2K1A9z3.G1-4X1r(9E1i-9Ti.aVgfEjN900020000000000001001001010000100000010111000001000002020011010000001000000002100\"/><path id=\"dumbbell-overhead-triceps-extension-n-st-fist.l\" d=\"~~!BnYTjwv1\"/><path id=\"dumbbell-overhead-triceps-extension-n-st-fore.r\" d=\"^0\"/><path id=\"dumbbell-overhead-triceps-extension-n-st-fist.r\" d=\"^1\"/><path id=\"dumbbell-overhead-triceps-extension-n-g0-eq1.dumbbell.1-0\" d=\"~MANn_DkL0DI1Q0J9J9-x1Ly)1I9QJ90x)1I9LI9-x1Q0I9I9_x1Lx)1J9QI90y)1J9Z\"/><path id=\"dumbbell-overhead-triceps-extension-n-g0-eq1.dumbbell.2-1\" d=\"~MHGqwxgL0BI1Q0I9I9_x1Lx)1J9QI90y)1J9LJ9_x1Q0J9J9-x1Ly)1I9QJ90x)1I9Z\"/><path id=\"dumbbell-overhead-triceps-extension-n-g0-fore.r\" d=\"~#F12Hxy1N*iE-y1OHjS8H5)12zF1xdy7W6N1H2JtSc!8(ayaA4weK1Ut!bW2hW98RB1BjK1I1!9F2!3)8RdTgKfK6KlD200010002100100000000100000000000012000021002000000000000010020000000200100101020\"/><path id=\"dumbbell-overhead-triceps-extension-n-g0-fist.r\" d=\"~~Y!nJHgwv1\"/><path id=\"dumbbell-overhead-triceps-extension-n-g1-eq1.dumbbell.1-0\" d=\"~MNFpyJhL0FI1Q0J9J9.x1LA)1I9QJ90z)1I9LI9.x1Q0I9I9!x1Lz)1J9QI90A)1J9Z\"/><path id=\"dumbbell-overhead-triceps-extension-n-g1-eq1.dumbbell.2-1\" d=\"~MWzsHDdL0EI1Q0I9I9!x1Lz)1J9QI90A)1J9LJ9!x1Q0J9J9.x1LA)1I9QJ90z)1I9Z\"/><path id=\"dumbbell-overhead-triceps-extension-n-g1-fore.r\" d=\"~#F12wJy1HAj.*y1*YjD6w8.1nxx1zqH4U8iW2ynAmS4Hd!7J7UdS3UnPlY2c(8W3KsBvrX1P8S5Y6x7*6IkBcIbXkK501010000111010000000000200000001100101000000000000000000020000001010000000022000\"/><path id=\"dumbbell-overhead-triceps-extension-n-g1-fist.r\" d=\"~~yXpWOdwv1\"/><path id=\"dumbbell-overhead-triceps-extension-n-g2-eq1.dumbbell.1-0\" d=\"~M!(rSIfL0DI1Q0J9J9-x1Ly)1I9QJ90x)1I9LI9-x1Q0I9I9_x1Lx)1J9QI90y)1J9Z\"/><path id=\"dumbbell-overhead-triceps-extension-n-g2-eq1.dumbbell.2-1\" d=\"~My_uYBbL0BI1Q0I9I9_x1Lx)1J9QI90y)1J9LJ9_x1Q0J9J9-x1Ly)1I9QJ90x)1I9Z\"/><path id=\"dumbbell-overhead-triceps-extension-n-g2-fore.r\" d=\"~#F12STy1NNjx*y1)Ek(2U9K1G1-lxA1uS99Y2_dYsdye!4Y9Nby8WeJsJ2J1A7P6XfxE15)1(5D8!8E4mOlO7*eRhKc00000001000200101000200000000202000100210000000001021010001000000000011101110100\"/><path id=\"dumbbell-overhead-triceps-extension-n-g2-fist.r\" d=\"~~PKsAObwv1\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-thigh.l\" d=\"~#F12!RvABI1BYuG)G1B7x9vi!w1AT1H1K9eR4Gn)K1jEpT9*gKlOdRrOI1B4*1X8X3yrNW1y1jx4Xa*vw5A1!J1DhFuwD1!n00010100000000020000000001000020000010000002000200000020002000000000001010000202\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-kneecap.l\" d=\"~~YyD1DHU1JI10\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-shank.l\" d=\"~#F12HxD1UDU1RFD1G-S1W2GbD143A*1J6z7(2R3P1)w2A8OcuRbx6XdW8Gw2E2)3E5x8K9J!1E11pRbGdHaTe_mV1wl(aYo00010100000000000000010001200200001100100000201000000000120000121000020200002100\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-foot.l\" d=\"~#o2AUB1!z)1zBD1*A(1JcA3whV7YoGn_W2x3IH2T4BB1X7Bn1GF1W4-aIc_r-aTlYo000002001001010000001000010001001212100200002020\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-shcap.l\" d=\"~~D.vF(sNN12\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-upper.l\" d=\"~#F12yYy1!)s*Vy1KyunW890lBN1E3W5O1_2.6wB1Ia!hf!fw9NiH4PB1H1(2!2_5!3*K1a04U8WfS1yeBoq-lKcxp21002000000001002021010001000000200100020000002001000001000100012110100121000000\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-elbowcap.l\" d=\"~~URw1H(jyy10\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-fore.l\" d=\"~#F12AXy1U_jxXy1*VkjAatX1X7OG1K2J9G1N2!2YvG5ydD1Ya_7Ub_3Yv_1y2J4U8z1zH1k*1U2Y9!9ry8*jX1RgxcXh00001210110120000000001100000000000000020020000002000021010002200011101002020000\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-fist.l\" d=\"~~yVv(Pawv1\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-head\" d=\"~#w12PSx1PFj*ww1E)iRiUiTiH9-az3z3W4T4-7X7XaxhXlW4IcR1G9Ti0Yl-aUlB6Dky3SiPfR1Ui0100020010000000001000100210010001101000000002000001210010000001\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-torso\" d=\"~#_12yAw1U.nIKw1XNmE9z6z31F9yhJ9F6JcNfA60z6EnVlX7KcW4SfV4ykz6WlRfyh)gW4G9-7KfGqzy1-aGqE60E90JcPfA3Y7Ic-7Rf_7z6AkA6D6Nc.aA3_7RP2(u00000001110200220000111000000001000002000000021101200020001010010000000000200000000020210010020220100000000022011110\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-thigh.r\" d=\"~#F12yGv!UG1OJvIEF11Kbz17x6P!1_6R6F3I3NaIS1FfBkw3GjI8-nU5ET1z2x4K4O8-cP.1D16S3*axs)fzrYz1K5Jy1!eNH101101200200000000000000200010100101000000010002000001000000000000101001002000201\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-kneecap.r\" d=\"~~HJuDXV1JI10\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-shank.r\" d=\"~#F12DPuYxV1BGvG.T1(6E9A1k)o_X1Y8*3A4x2_rX_1NcB8S5Ba4*eyy1EX1dT4O1K9Ex1HT1vh!3*aGgy4Vm!e)9Ni3Ar00110020020200200000000000111000002000000000000000000000200101000000012101200000\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-foot.r\" d=\"~#o2(Bp!z)1)Wp*A(1NcA3whV7_oGnWW2x3GH2T4BB1X7Bn1GF1W4-aIc!r-aVlYo100002001001011010101000010001001212100200101000\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-shcap.r\" d=\"^18\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-upper.r\" d=\"^19\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-elbowcap.r\" d=\"^20\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-fore.r\" d=\"^21\"/><path id=\"dumbbell-overhead-triceps-extension-n-e-fist.r\" d=\"^22\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-overhead-triceps-extension-n-dots)\"/>\n  <path class=\"floorline\" d=\"M108.2 338.79H249.8\"/><path class=\"arc measure\" d=\"M172.11 102.13L171.28 126.12A24 24 0 0 1 148.13 101.3Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-n-st-fore.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-n-st-fore.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-n-st-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-n-st-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"~M!GpS.jL0IO3Q0E6E6AG3LR9F6QE60S9F6LF6AG3Q0F6F6zG3LS9E6QF60R9E6Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-n-g0-eq1.dumbbell.1-0\"/><use href=\"#dumbbell-overhead-triceps-extension-n-g0-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-n-g0-eq1.dumbbell.1-0\"/><use href=\"#dumbbell-overhead-triceps-extension-n-g0-eq1.dumbbell.2-1\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-n-g0-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-n-g0-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"~MFAr!whL0IO3Q0E6E6AG3LT9F6QE60U9F6LF6AG3Q0F6F6zG3LU9E6QF60T9E6Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-n-g1-eq1.dumbbell.1-0\"/><use href=\"#dumbbell-overhead-triceps-extension-n-g1-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-n-g1-eq1.dumbbell.1-0\"/><use href=\"#dumbbell-overhead-triceps-extension-n-g1-eq1.dumbbell.2-1\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-n-g1-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-n-g1-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"~MU_tJwfL0KO3Q0E6E6DG3LR9F6QE60S9F6LF6DG3Q0F6F6BG3LS9E6QF60R9E6Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-n-g2-eq1.dumbbell.1-0\"/><use href=\"#dumbbell-overhead-triceps-extension-n-g2-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-n-g2-eq1.dumbbell.1-0\"/><use href=\"#dumbbell-overhead-triceps-extension-n-g2-eq1.dumbbell.2-1\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-n-g2-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-n-g2-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-n-e-thigh.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-kneecap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-shank.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-foot.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-shcap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-upper.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-elbowcap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-fore.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-n-e-thigh.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-kneecap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-shank.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-foot.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-shcap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-upper.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-elbowcap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-fore.l\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-n-e-head\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-torso\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-thigh.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-kneecap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-shank.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-n-e-head\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-torso\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-thigh.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-kneecap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-shank.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~MDyx1DyeL0KO3Q0E6E6DG3LR9F6QE60S9F6LF6DG3Q0F6F6BG3LS9E6QF60R9E6Z\"/><path class=\"disc\" d=\"~MNDvJKeL0DI1Q0J9J9-x1Ly)1I9QJ90x)1I9LI9-x1Q0I9I9_x1Lx)1J9QI90y)1J9Z\"/><path class=\"disc\" d=\"~MUxy1SEaL0BI1Q0I9I9_x1Lx)1J9QI90y)1J9LJ9_x1Q0J9J9-x1Ly)1I9QJ90x)1I9Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-n-e-shcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-upper.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-elbowcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-n-e-shcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-upper.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-elbowcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"170.5\" cy=\"148.2\" r=\"2.25\"/><circle class=\"joint\" cx=\"172.11\" cy=\"102.13\" r=\"2.25\"/><circle class=\"joint\" cx=\"171.92\" cy=\"215.1\" r=\"2.25\"/><circle class=\"joint\" cx=\"162.5\" cy=\"275.07\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#w20UKoFVhGIo)*h84808484a264848484648684666486666468864668446a644a46466a28464800000011000002000001010000020000000000000000000000101010102000000000010200200000100010001010000100000000010000000202000001000000\"/><path class=\"arrow\" d=\"~M(Ev(VaLTrSvLNdGy2Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M171.28 126.12A24 24 0 0 1 148.13 101.3\"/><g class=\"arc-ticks\"><path d=\"~MHOx1F.nL*1FY1\"/><path d=\"~MYWtw_jLBY1)1\"/></g><path class=\"leader\" d=\"~M!!tDKnL.R2y*4\"/></g></g><path class=\"leader\" d=\"M172.11 102.13L187 94H197\"/><circle class=\"anchor\" cx=\"172.11\" cy=\"102.13\" r=\"1.5\"/><path class=\"leader\" d=\"~MWRB1wVB1L0)4\"/><circle class=\"anchor\" cx=\"192.27\" cy=\"192.8\" r=\"1.5\"/><path class=\"leader\" d=\"M123.65 100.44L115.86 105H105.86\"/><circle class=\"anchor\" cx=\"123.65\" cy=\"100.44\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dumbbell-overhead-triceps-extension-n-vertical\" data-key=\"vertical\" data-cue=\"Keep the upper arms vertical and still. Only the elbows bend.\" class=\"plate-callout two\" style=\"left:53.63%;top:20.11%\" aria-pressed=\"true\">Arms<br>vertical</button><button type=\"button\" id=\"dumbbell-overhead-triceps-extension-n-braced\" data-key=\"braced\" data-cue=\"Brace the trunk, shoulders down and back, head in line with your spine.\" class=\"plate-callout two\" style=\"left:54.19%;top:42.46%\" aria-pressed=\"false\">Braced<br>torso</button><button type=\"button\" id=\"dumbbell-overhead-triceps-extension-n-stop\" data-key=\"stop\" data-cue=\"Lower to about a right angle, clear of the back of your head.\" class=\"plate-callout\" style=\"left:6.15%;top:23.18%\" aria-pressed=\"false\">Stop at 90°</button><span class=\"plate-arc-label\" style=\"left:22.35%;top:38.55%\"><b>Elbow</b><span>about 90°</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-overhead-triceps-extension-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-overhead-triceps-extension-m-st-fore.l\" d=\"^0\"/><path id=\"dumbbell-overhead-triceps-extension-m-st-fist.l\" d=\"^1\"/><path id=\"dumbbell-overhead-triceps-extension-m-st-fore.r\" d=\"^0\"/><path id=\"dumbbell-overhead-triceps-extension-m-st-fist.r\" d=\"^1\"/><path id=\"dumbbell-overhead-triceps-extension-m-g0-eq1.dumbbell.1-0\" d=\"^2\"/><path id=\"dumbbell-overhead-triceps-extension-m-g0-eq1.dumbbell.2-1\" d=\"^3\"/><path id=\"dumbbell-overhead-triceps-extension-m-g0-fore.r\" d=\"^4\"/><path id=\"dumbbell-overhead-triceps-extension-m-g0-fist.r\" d=\"^5\"/><path id=\"dumbbell-overhead-triceps-extension-m-g1-eq1.dumbbell.1-0\" d=\"^6\"/><path id=\"dumbbell-overhead-triceps-extension-m-g1-eq1.dumbbell.2-1\" d=\"^7\"/><path id=\"dumbbell-overhead-triceps-extension-m-g1-fore.r\" d=\"^8\"/><path id=\"dumbbell-overhead-triceps-extension-m-g1-fist.r\" d=\"^9\"/><path id=\"dumbbell-overhead-triceps-extension-m-g2-eq1.dumbbell.1-0\" d=\"^10\"/><path id=\"dumbbell-overhead-triceps-extension-m-g2-eq1.dumbbell.2-1\" d=\"^11\"/><path id=\"dumbbell-overhead-triceps-extension-m-g2-fore.r\" d=\"^12\"/><path id=\"dumbbell-overhead-triceps-extension-m-g2-fist.r\" d=\"^13\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-thigh.l\" d=\"^14\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-kneecap.l\" d=\"^15\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-shank.l\" d=\"^16\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-foot.l\" d=\"^17\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-shcap.l\" d=\"^18\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-upper.l\" d=\"^19\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-elbowcap.l\" d=\"^20\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-fore.l\" d=\"^21\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-fist.l\" d=\"^22\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-head\" d=\"^23\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-torso\" d=\"^24\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-thigh.r\" d=\"^25\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-kneecap.r\" d=\"^26\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-shank.r\" d=\"^27\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-foot.r\" d=\"^28\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-shcap.r\" d=\"^18\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-upper.r\" d=\"^19\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-elbowcap.r\" d=\"^20\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-fore.r\" d=\"^21\"/><path id=\"dumbbell-overhead-triceps-extension-m-e-fist.r\" d=\"^22\"/><path id=\"dumbbell-overhead-triceps-extension-m-m-head\" d=\"~#w12_WtNFjKAsTGjEewmGgwdBbpz2D5z6T6-9*8BlVhw2zdO3X8zi!3(izf!jRaJkz1NlFbH2Pi1000001200000010000020200001010100000000200010000000222000020012\"/><path id=\"dumbbell-overhead-triceps-extension-m-m-torso\" d=\"~#_12(EtyyoVEtEUmIax4x3kWcYeHaA4JfScPrV9xt.iBG1T5xiU4Agz1wlK1UoBaNk-cS6)7)3.g)hxE1V4zszd-eRR1VnHiAF1Yf_gVd)4Rd_a.1(kH7Y4!9zdW4!6IF2AO111000000020002020000202000001110020001010000020000000101100000000010100000000100000022220000000001111000000000001210\"/><path id=\"dumbbell-overhead-triceps-extension-m-m-shcap.r\" d=\"~~ywuH-sNN12\"/><path id=\"dumbbell-overhead-triceps-extension-m-m-upper.r\" d=\"~#F12H!w1DRsKxx1ITty1S872Ga*J1)1A6rA3w1UB1O6Uj!2UfUcDgwcYz1!1U2y4y5X5XK181(1P8Wf-1Y8Rq-3OlGh)l10100020001210010000000000001221001000020000002101000000101002010000100110101212\"/><path id=\"dumbbell-overhead-triceps-extension-m-m-elbowcap.r\" d=\"~~N_sU*jyy10\"/><path id=\"dumbbell-overhead-triceps-extension-m-m-fore.r\" d=\"~#F12J(uSSj)zvEKkP1waE1R1Eg*D1dW9nU2J9PuK2_dJ3JaAaW9FaFuD2U1y6S7X9)F14)1U4w9N9*2Y3zlz5.fOf*e02000000010000000000201000000002200000001100010000000001000000000000100100010000\"/><path id=\"dumbbell-overhead-triceps-extension-m-m-fist.r\" d=\"~~!)pJ*awv1\"/><path id=\"dumbbell-overhead-triceps-extension-m-m-eq0\" d=\"~MwKrUNeL0KO3Q0E6E6DG3LR9F6QE60S9F6LF6DG3Q0F6F6BG3LS9E6QF60R9E6Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-m-eq1\" d=\"~MFRp_-eL0DI1Q0J9J9-x1Ly)1I9QJ90x)1I9LI9-x1Q0I9I9_x1Lx)1J9QI90y)1J9Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-m-eq2\" d=\"~MNJswUaL0BI1Q0I9I9_x1Lx)1J9QI90y)1J9LJ9_x1Q0J9J9-x1Ly)1I9QJ90x)1I9Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-mf-thigh.l\" d=\"^14\"/><path id=\"dumbbell-overhead-triceps-extension-m-mf-kneecap.l\" d=\"^15\"/><path id=\"dumbbell-overhead-triceps-extension-m-mf-shank.l\" d=\"^16\"/><path id=\"dumbbell-overhead-triceps-extension-m-mf-foot.l\" d=\"^17\"/><path id=\"dumbbell-overhead-triceps-extension-m-mf-shcap.l\" d=\"^48\"/><path id=\"dumbbell-overhead-triceps-extension-m-mf-upper.l\" d=\"^49\"/><path id=\"dumbbell-overhead-triceps-extension-m-mf-elbowcap.l\" d=\"^50\"/><path id=\"dumbbell-overhead-triceps-extension-m-mf-fore.l\" d=\"^51\"/><path id=\"dumbbell-overhead-triceps-extension-m-mf-fist.l\" d=\"^52\"/><path id=\"dumbbell-overhead-triceps-extension-m-mf-thigh.r\" d=\"^25\"/><path id=\"dumbbell-overhead-triceps-extension-m-mf-kneecap.r\" d=\"^26\"/><path id=\"dumbbell-overhead-triceps-extension-m-mf-shank.r\" d=\"^27\"/><path id=\"dumbbell-overhead-triceps-extension-m-mf-foot.r\" d=\"^28\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-0\" d=\"^23\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-1\" d=\"^24\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-2\" d=\"^14\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-3\" d=\"^15\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-4\" d=\"^16\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-5\" d=\"^17\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-6\" d=\"^18\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-7\" d=\"^19\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-8\" d=\"^20\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-9\" d=\"^21\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-10\" d=\"^22\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-11\" d=\"^25\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-12\" d=\"^26\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-13\" d=\"^27\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-14\" d=\"^28\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-15\" d=\"^18\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-16\" d=\"^19\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-17\" d=\"^20\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-18\" d=\"^21\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-19\" d=\"^22\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-20\" d=\"^34\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-21\" d=\"^35\"/><path id=\"dumbbell-overhead-triceps-extension-m-mo-22\" d=\"^36\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-overhead-triceps-extension-m-dots)\"/>\n  <path class=\"floorline\" d=\"^29\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-st-fore.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-st-fore.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-st-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-st-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"^31\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-g0-eq1.dumbbell.1-0\"/><use href=\"#dumbbell-overhead-triceps-extension-m-g0-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-g0-eq1.dumbbell.1-0\"/><use href=\"#dumbbell-overhead-triceps-extension-m-g0-eq1.dumbbell.2-1\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-g0-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-g0-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"^32\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-g1-eq1.dumbbell.1-0\"/><use href=\"#dumbbell-overhead-triceps-extension-m-g1-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-g1-eq1.dumbbell.1-0\"/><use href=\"#dumbbell-overhead-triceps-extension-m-g1-eq1.dumbbell.2-1\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-g1-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-g1-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"^33\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-g2-eq1.dumbbell.1-0\"/><use href=\"#dumbbell-overhead-triceps-extension-m-g2-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-g2-eq1.dumbbell.1-0\"/><use href=\"#dumbbell-overhead-triceps-extension-m-g2-eq1.dumbbell.2-1\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-g2-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-g2-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-e-thigh.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-kneecap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-shank.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-foot.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-shcap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-upper.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-elbowcap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-fore.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-e-thigh.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-kneecap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-shank.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-foot.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-shcap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-upper.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-elbowcap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-fore.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-e-head\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-torso\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-thigh.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-kneecap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-shank.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-e-head\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-torso\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-thigh.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-kneecap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-shank.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^34\"/><path class=\"disc\" d=\"^35\"/><path class=\"disc\" d=\"^36\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-e-shcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-upper.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-elbowcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-e-shcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-upper.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-elbowcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"170.5\" cy=\"148.2\" r=\"2.25\"/><circle class=\"joint\" cx=\"172.11\" cy=\"102.13\" r=\"2.25\"/><circle class=\"joint\" cx=\"171.92\" cy=\"215.1\" r=\"2.25\"/><circle class=\"joint\" cx=\"162.5\" cy=\"275.07\" r=\"2.25\"/></g><mask id=\"dumbbell-overhead-triceps-extension-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-head\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-torso\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mf-shank.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mf-foot.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mf-upper.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mf-fore.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mf-fist.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mf-shank.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mf-foot.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-shcap.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-upper.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-fore.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-fist.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#dumbbell-overhead-triceps-extension-m-mmask)\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-m-head\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-torso\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-shcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-upper.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-elbowcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-fist.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-eq0\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-eq1\"/><use href=\"#dumbbell-overhead-triceps-extension-m-m-eq2\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~#60ANvPED1xNuXTE1KF3Ox1Ysxn000001001020\"/><path class=\"m-arrow\" d=\"~M(Pp(JB1LPY20M)oYiLwpXiL)R10\"/><path class=\"leader m\" d=\"M166.11 191.51L129.75 198H119.75\"/></g>\n<g class=\"plate-zoom\" data-view=\"mistake\" data-k=\"3\" data-c=\"250 176\" data-src=\"164.04 192.16\"><defs><clipPath id=\"dumbbell-overhead-triceps-extension-m-zclip\"><circle cx=\"250\" cy=\"176\" r=\"52\"/></clipPath></defs><circle class=\"pz-src\" cx=\"164.04\" cy=\"192.16\" r=\"17.33\"/><path class=\"pz-link\" d=\"~MWIz1w*A1LNO3*k\"/><circle class=\"pz-bg\" cx=\"250\" cy=\"176\" r=\"52\"/><g class=\"pz-in\" clip-path=\"url(#dumbbell-overhead-triceps-extension-m-zclip)\">\n  <defs><pattern id=\"dumbbell-overhead-triceps-extension-m-z-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-overhead-triceps-extension-m-z-st-fore.l\" d=\"M274.76 -111.15C270.45 -112.55 265.32 -112.54 261.79 -113C258.26 -113.45 256.45 -113.64 253.56 -113.88C250.68 -114.12 250.87 -114.41 244.46 -114.44C238.06 -114.48 224.19 -114.5 215.13 -114.09C206.06 -113.67 198.25 -112.78 190.07 -111.94C181.9 -111.09 171.52 -110.1 166.08 -109C160.63 -107.89 159.32 -107.11 157.4 -105.31C155.48 -103.52 154.63 -100.63 154.54 -98.24C154.46 -95.85 155.11 -92.91 156.9 -90.99C158.69 -89.06 159.94 -88.19 165.3 -86.71C170.65 -85.23 180.94 -83.52 189.03 -82.1C197.13 -80.68 204.86 -79.26 213.87 -78.21C222.89 -77.16 236.72 -76.22 243.11 -75.81C249.51 -75.4 249.33 -75.69 252.23 -75.73C255.13 -75.77 256.94 -75.83 260.5 -76.04C264.05 -76.25 269.17 -75.88 273.56 -76.98C277.96 -78.07 283.92 -79.87 286.86 -82.62C289.81 -85.37 291.12 -89.81 291.25 -93.47C291.37 -97.13 290.38 -101.64 287.63 -104.59C284.88 -107.54 279.06 -109.75 274.76 -111.15Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-st-fist.l\" d=\"M113.91 -99.14a14.87 14.87 0 1 0 29.74 0a14.87 14.87 0 1 0 -29.74 0Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-st-fore.r\" d=\"^60\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-st-fist.r\" d=\"^61\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-thigh.l\" d=\"~#F12wJO1PFT1*(J1zXO1OlzrB3Y1!y3J-4Y3IsJ1-d*B2-G4-1XI2xt)S1zw2GF1VS2Oy4Tc*5EqBbDR2Fz5D3X1EcGw1X)2wfJ3WD4ST1U_2wS3WE202011000000002021000201011010001000000010001100000101000000020100000001010000000\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-kneecap.l\" d=\"~~S(y2UXN2Ay41\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-shank.l\" d=\"~#F12H_y2wKN2)Oz2zBH2(7-x1U3abJX5AjIl!8XaN4Xy6Jo-B1W2Ty1xizG1Fq)w6z7)bKfBoOsDV5T39R2Ry1-E1!u)I1NA2*4_(1Ww1SH200111100000000000220000100010000000000020000000000200000001010121000000100020002\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-foot.l\" d=\"~#o2_Sx2WAO3.Bz2XEJ3AB1F9yT1BnNH2XB2AA8E9)(6*dRO3BnTB21-Y3weRw1EB1WT2Kw1zx2FH2020010000001000210021012100020001010100000100120\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-shcap.l\" d=\"~~(EP1YT8JI40\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-upper.l\" d=\"M291.62 44.9C293.22 39.34 292.36 33.17 292.64 28.34C292.92 23.5 293.1 20.05 293.3 15.91C293.49 11.76 293.7 11.31 293.81 3.47C293.93 -4.36 294.19 -20.04 293.99 -31.11C293.79 -42.19 293.19 -52.58 292.61 -62.98C292.03 -73.38 291.75 -86.29 290.5 -93.49C289.25 -100.7 287.73 -103.4 285.1 -106.22C282.47 -109.04 278.23 -110.29 274.73 -110.41C271.23 -110.53 266.91 -109.58 264.09 -106.95C261.27 -104.32 259.56 -101.74 257.81 -94.63C256.06 -87.53 254.89 -74.68 253.58 -64.34C252.28 -54.01 250.95 -43.68 249.98 -32.65C249.01 -21.61 248.18 -5.96 247.75 1.86C247.32 9.69 247.49 10.16 247.4 14.3C247.3 18.45 247.25 21.91 247.19 26.75C247.13 31.59 245.84 37.69 247.04 43.35C248.25 49 250.82 56.85 254.41 60.7C257.99 64.54 263.78 66.25 268.55 66.41C273.33 66.58 279.22 65.28 283.06 61.7C286.91 58.11 290.03 50.46 291.62 44.9Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-elbowcap.l\" d=\"M257.8 -94.06a16.35 16.35 0 1 0 32.71 0a16.35 16.35 0 1 0 -32.71 0Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-fore.l\" d=\"M291.16 -95.85C291.95 -100.31 291.23 -105.39 291.18 -108.95C291.14 -112.51 291.08 -114.32 290.92 -117.22C290.75 -120.11 291.06 -119.96 290.2 -126.31C289.35 -132.66 287.45 -146.39 285.77 -155.31C284.1 -164.23 282.13 -171.84 280.15 -179.82C278.18 -187.8 275.75 -197.93 273.9 -203.17C272.05 -208.41 271.09 -209.6 269.05 -211.25C267.01 -212.9 264.02 -213.35 261.65 -213.1C259.27 -212.85 256.45 -211.79 254.79 -209.75C253.14 -207.71 252.44 -206.35 251.72 -200.84C251 -195.33 250.74 -184.91 250.46 -176.7C250.19 -168.48 249.85 -160.63 250.07 -151.56C250.28 -142.48 251.28 -128.66 251.76 -122.27C252.24 -115.88 252.51 -116.09 252.95 -113.23C253.4 -110.36 253.71 -108.58 254.41 -105.08C255.11 -101.59 255.46 -96.48 257.15 -92.28C258.85 -88.08 261.47 -82.43 264.6 -79.89C267.73 -77.35 272.3 -76.68 275.95 -77.06C279.59 -77.44 283.92 -79.05 286.46 -82.19C288.99 -85.32 290.38 -91.39 291.16 -95.85Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-fist.l\" d=\"M244.08 -238.74a14.87 14.87 0 1 0 29.74 0a14.87 14.87 0 1 0 -29.74 0Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-head\" d=\"M273.58 -104.56C280.27 -104.06 290.93 -103.07 297.37 -100.1C303.81 -97.12 308.77 -91.92 312.24 -86.71C315.71 -81.51 317.07 -74.57 318.18 -68.87C319.3 -63.17 318.93 -58.34 318.93 -52.52C318.93 -46.69 318.8 -39.51 318.18 -33.93C317.57 -28.36 316.82 -23.15 315.21 -19.06C313.6 -14.98 312.11 -10.89 308.52 -9.4C304.93 -7.91 298.24 -8.9 293.65 -10.14C289.07 -11.38 285.35 -13.86 281.01 -16.83C276.68 -19.81 273.58 -24.27 267.63 -27.99C261.69 -31.7 251.03 -34.55 245.33 -39.14C239.63 -43.72 235.67 -49.54 233.44 -55.49C231.21 -61.44 230.84 -68.62 231.95 -74.82C233.07 -81.01 235.92 -87.95 240.13 -92.66C244.34 -97.37 251.65 -101.09 257.23 -103.07C262.8 -105.05 266.89 -105.05 273.58 -104.56Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-torso\" d=\"M251.28 -33.93C243.84 -30.34 249.05 -19.06 246.82 -12.37C244.59 -5.68 241.12 0.02 237.9 6.21C234.68 12.41 230.22 17.24 227.49 24.8C224.76 32.35 222.78 42.14 221.54 51.56C220.3 60.97 219.56 70.14 220.06 81.29C220.55 92.45 222.53 106.07 224.52 118.46C226.5 130.85 229.97 145.1 231.95 155.63C233.93 166.17 236.66 173.6 236.41 181.65C236.16 189.71 233.44 196.15 230.46 203.96C227.49 211.76 221.3 220.68 218.57 228.49C215.84 236.29 213.99 243.85 214.11 250.79C214.23 257.73 215.84 264.91 219.31 270.12C222.78 275.32 228.36 279.41 234.92 282.01C241.49 284.61 250.41 285.23 258.71 285.73C267.01 286.22 276.68 286.47 284.73 284.99C292.79 283.5 301.71 282.26 307.03 276.81C312.36 271.36 314.34 262.56 316.7 252.28C319.05 241.99 320.17 227.5 321.16 215.11C322.15 202.72 322.89 190.33 322.65 177.94C322.4 165.55 319.67 151.92 319.67 140.77C319.67 129.62 321.41 120.32 322.65 111.03C323.88 101.74 326.61 94.3 327.11 85.01C327.6 75.72 327.35 64.57 325.62 55.28C323.88 45.98 320.17 36.32 316.7 29.26C313.23 22.19 308.27 17.86 304.8 12.9C301.33 7.95 297.87 4.85 295.88 -0.48C293.9 -5.81 293.65 -13.49 292.91 -19.06C292.17 -24.64 298.36 -31.45 291.42 -33.93C284.48 -36.41 258.71 -37.53 251.28 -33.93Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-thigh.r\" d=\"~#F12SRN1WXN1*.N1xOH10Ry1O3hGiPV5Wk-jU9)9FvGX4YK1I!1y9)-1)oOE2UgR-4z6OcRdzpED1HS5U3iNa*w1zU2.O1GR2HI3EgAE3SJ1A)301011100200000010100000021010000000020000000020200010101011110000101000010000001\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-kneecap.r\" d=\"~~F.I1W(S2Ay41\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-shank.r\" d=\"~#F12(DJ1J(P2)RN1zIK2wlRrD3Y1*H2JE5FqXbJcE6JT2zP5PB1RoSgTua.J1HD3VB5O1-dG4KsXz3w_4B3X1YbVw1.P1ycxA2WJ1xuHX1dNR210001200020000000200000020001000012002121000202101000200002101200002000101000000\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-foot.r\" d=\"~#o2yFsWAO3z.tXEJ3AB1F9yT1BnNH2XB2AA8E9)(6*dRO3BnTB21-Y3weRw1EB1WT2Kw1zx2FH2020010000001000210021012100020001010100000100120\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-shcap.r\" d=\"^66\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-upper.r\" d=\"^67\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-elbowcap.r\" d=\"^68\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-fore.r\" d=\"^69\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-e-fist.r\" d=\"^70\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-m-head\" d=\"M214.2 -104.57C220.85 -105.47 231.47 -106.72 238.39 -105.15C245.31 -103.58 251.24 -99.52 255.72 -95.15C260.19 -90.78 262.97 -84.28 265.25 -78.94C267.52 -73.59 268.16 -68.79 269.37 -63.09C270.58 -57.4 271.96 -50.34 272.51 -44.76C273.06 -39.18 273.42 -33.93 272.69 -29.6C271.97 -25.26 271.36 -20.95 268.16 -18.75C264.95 -16.55 258.2 -16.13 253.46 -16.39C248.72 -16.65 244.57 -18.3 239.71 -20.31C234.85 -22.31 230.89 -26.03 224.3 -28.43C217.71 -30.83 206.7 -31.4 200.17 -34.7C193.64 -38 188.55 -42.87 185.13 -48.23C181.71 -53.58 179.86 -60.53 179.66 -66.82C179.46 -73.11 180.81 -80.49 183.95 -85.98C187.09 -91.46 193.47 -96.61 198.51 -99.71C203.55 -102.81 207.55 -103.66 214.2 -104.57Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-m-torso\" d=\"M207.07 -30.85C200.54 -25.79 207.98 -15.84 207.19 -8.83C206.4 -1.83 204.19 4.47 202.32 11.2C200.46 17.93 197.1 23.58 196.01 31.54C194.91 39.5 195.01 49.49 195.75 58.96C196.5 68.43 197.68 77.55 200.48 88.35C203.29 99.16 206.35 112.75 212.57 123.78C218.8 134.82 231.75 145.8 237.85 154.55C243.95 163.3 248.69 169.5 249.18 176.3C249.66 183.09 245.02 188.6 240.77 195.3C236.51 202.01 228.07 209.54 223.66 216.53C219.25 223.52 215.74 230.47 214.3 237.26C212.86 244.05 212.81 251.41 215.02 257.26C217.23 263.11 221.74 268.35 227.55 272.36C233.37 276.38 241.92 278.99 249.9 281.34C257.87 283.69 267.23 286.1 275.42 286.47C283.6 286.83 292.57 287.63 298.99 283.51C305.4 279.4 309.31 271.28 313.92 261.78C318.53 252.29 323.45 239.5 326.63 226.57C329.81 213.65 334.84 200.24 333 184.23C331.17 168.23 319.95 145.22 315.62 130.53C311.29 115.85 308.62 106.24 307.01 96.11C305.4 85.98 307.41 78.92 305.97 69.73C304.52 60.54 301.96 49.68 298.33 40.95C294.7 32.23 289.06 23.54 284.19 17.36C279.33 11.17 273.58 7.96 269.16 3.83C264.74 -0.29 260.7 -2.6 257.65 -7.4C254.6 -12.2 252.76 -19.66 250.88 -24.96C248.99 -30.26 253.63 -38.21 246.33 -39.19C239.03 -40.18 213.59 -35.91 207.07 -30.85Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-m-shcap.r\" d=\"~~SWH1(A8JI40\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-m-upper.r\" d=\"M262.92 37.88C263.32 32.11 261.2 26.25 260.47 21.46C259.74 16.67 259.2 13.26 258.53 9.17C257.86 5.07 257.96 4.58 256.45 -3.1C254.93 -10.79 251.93 -26.18 249.43 -36.97C246.94 -47.76 244.19 -57.81 241.46 -67.86C238.72 -77.9 235.77 -90.47 233.05 -97.26C230.33 -104.05 228.28 -106.38 225.12 -108.59C221.96 -110.8 217.56 -111.14 214.1 -110.53C210.65 -109.92 206.63 -108.09 204.42 -104.94C202.2 -101.78 201.07 -98.89 200.84 -91.58C200.6 -84.27 202.13 -71.45 203 -61.07C203.87 -50.7 204.72 -40.32 206.06 -29.32C207.41 -18.33 209.85 -2.84 211.06 4.9C212.26 12.64 212.53 13.06 213.3 17.14C214.07 21.22 214.73 24.61 215.68 29.36C216.63 34.1 216.64 40.34 218.99 45.62C221.35 50.91 225.5 58.05 229.8 61.06C234.11 64.08 240.12 64.54 244.83 63.71C249.53 62.88 255.02 60.39 258.04 56.08C261.05 51.78 262.51 43.65 262.92 37.88Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-m-elbowcap.r\" d=\"M200.59 -94.42a16.35 16.35 0 1 0 32.71 0a16.35 16.35 0 1 0 -32.71 0Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-m-fore.r\" d=\"M233.21 -99.71C233.05 -104.23 231.28 -109.05 230.5 -112.52C229.72 -116 229.28 -117.76 228.52 -120.55C227.76 -123.35 228.09 -123.27 225.94 -129.3C223.78 -135.33 219.06 -148.37 215.57 -156.74C212.08 -165.12 208.57 -172.16 204.98 -179.55C201.39 -186.94 196.91 -196.35 194.01 -201.09C191.11 -205.83 189.92 -206.79 187.58 -207.99C185.24 -209.18 182.23 -208.99 179.96 -208.25C177.69 -207.51 175.14 -205.9 173.95 -203.56C172.75 -201.21 172.36 -199.74 172.8 -194.2C173.24 -188.66 175.15 -178.42 176.59 -170.32C178.02 -162.23 179.33 -154.48 181.43 -145.65C183.52 -136.82 187.37 -123.5 189.17 -117.35C190.97 -111.2 191.19 -111.47 192.22 -108.76C193.25 -106.05 193.92 -104.37 195.34 -101.1C196.75 -97.83 198.15 -92.89 200.68 -89.14C203.22 -85.38 206.95 -80.4 210.54 -78.57C214.13 -76.74 218.74 -77.03 222.23 -78.16C225.71 -79.29 229.61 -81.77 231.44 -85.36C233.27 -88.95 233.36 -95.18 233.21 -99.71Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-m-fist.r\" d=\"M157.12 -232.77a14.87 14.87 0 1 0 29.74 0a14.87 14.87 0 1 0 -29.74 0Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-m-eq0\" d=\"M178.79 -176.42L178.79 -233.9Q178.79 -234.9 177.79 -234.9L166.2 -234.9Q165.2 -234.9 165.2 -233.9L165.2 -176.42Q165.2 -175.42 166.2 -175.42L177.79 -175.42Q178.79 -175.42 178.79 -176.42Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-m-eq1\" d=\"M150.1 -176.05L150.1 -149.31Q150.1 -147.81 151.6 -147.81L192.38 -147.81Q193.88 -147.81 193.88 -149.31L193.88 -176.05Q193.88 -177.55 192.38 -177.55L151.6 -177.55Q150.1 -177.55 150.1 -176.05Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-m-eq2\" d=\"M193.88 -234.27L193.88 -261.01Q193.88 -262.51 192.38 -262.51L151.6 -262.51Q150.1 -262.51 150.1 -261.01L150.1 -234.27Q150.1 -232.77 151.6 -232.77L192.38 -232.77Q193.88 -232.77 193.88 -234.27Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mf-thigh.l\" d=\"^62\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mf-kneecap.l\" d=\"^63\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mf-shank.l\" d=\"^64\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mf-foot.l\" d=\"^65\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mf-shcap.l\" d=\"^79\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mf-upper.l\" d=\"^80\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mf-elbowcap.l\" d=\"^81\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mf-fore.l\" d=\"^82\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mf-fist.l\" d=\"^83\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mf-thigh.r\" d=\"^73\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mf-kneecap.r\" d=\"^74\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mf-shank.r\" d=\"^75\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mf-foot.r\" d=\"^76\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-0\" d=\"^71\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-1\" d=\"^72\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-2\" d=\"^62\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-3\" d=\"^63\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-4\" d=\"^64\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-5\" d=\"^65\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-6\" d=\"^66\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-7\" d=\"^67\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-8\" d=\"^68\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-9\" d=\"^69\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-10\" d=\"^70\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-11\" d=\"^73\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-12\" d=\"^74\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-13\" d=\"^75\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-14\" d=\"^76\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-15\" d=\"^66\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-16\" d=\"^67\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-17\" d=\"^68\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-18\" d=\"^69\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-19\" d=\"^70\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-20\" d=\"M265.75 -182.39L265.75 -239.86Q265.75 -240.86 264.75 -240.86L253.16 -240.86Q252.16 -240.86 252.16 -239.86L252.16 -182.39Q252.16 -181.39 253.16 -181.39L264.75 -181.39Q265.75 -181.39 265.75 -182.39Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-21\" d=\"M237.06 -182.01L237.06 -155.28Q237.06 -153.78 238.56 -153.78L279.34 -153.78Q280.84 -153.78 280.84 -155.28L280.84 -182.01Q280.84 -183.51 279.34 -183.51L238.56 -183.51Q237.06 -183.51 237.06 -182.01Z\"/><path id=\"dumbbell-overhead-triceps-extension-m-z-mo-22\" d=\"M280.84 -240.24L280.84 -266.97Q280.84 -268.47 279.34 -268.47L238.56 -268.47Q237.06 -268.47 237.06 -266.97L237.06 -240.24Q237.06 -238.74 238.56 -238.74L279.34 -238.74Q280.84 -238.74 280.84 -240.24Z\"/></defs>\n  \n  <path class=\"floorline\" d=\"M82.42 614.92H507.22\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-z-st-fore.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-z-st-fore.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-z-st-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-z-st-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-st-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-thigh.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-kneecap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-shank.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-foot.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-shcap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-upper.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-elbowcap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-fore.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-thigh.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-kneecap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-shank.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-foot.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-shcap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-upper.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-elbowcap.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-fore.l\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-head\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-torso\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-thigh.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-kneecap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-shank.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-head\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-torso\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-thigh.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-kneecap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-shank.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^87\"/><path class=\"disc\" d=\"^88\"/><path class=\"disc\" d=\"^89\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-shcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-upper.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-elbowcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-shcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-upper.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-elbowcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"269.33\" cy=\"44.12\" r=\"2.25\"/><circle class=\"joint\" cx=\"274.16\" cy=\"-94.06\" r=\"2.25\"/><circle class=\"joint\" cx=\"273.58\" cy=\"244.84\" r=\"2.25\"/><circle class=\"joint\" cx=\"245.33\" cy=\"424.75\" r=\"2.25\"/></g><mask id=\"dumbbell-overhead-triceps-extension-m-z-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-head\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-torso\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mf-thigh.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mf-kneecap.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mf-shank.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mf-foot.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mf-shcap.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mf-upper.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mf-fore.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mf-fist.l\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mf-thigh.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mf-kneecap.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mf-shank.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mf-foot.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-shcap.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-upper.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-elbowcap.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-fore.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-fist.r\" fill=\"#000\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#dumbbell-overhead-triceps-extension-m-z-mmask)\"><g class=\"u-stroke\"><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-head\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-torso\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-shcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-upper.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-elbowcap.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-fore.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-fist.r\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-eq0\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-eq1\"/><use href=\"#dumbbell-overhead-triceps-extension-m-z-m-eq2\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~#60_wO1SOA1TwJ1GUF1K-9KA3PW2GB2101000110101\"/><path class=\"m-arrow\" d=\"~MFGt!)x1LPG80M)oYiLwpXiL)R10\"/></g>\n</g><circle class=\"pz-ring\" cx=\"250\" cy=\"176\" r=\"52\"/></g></svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dumbbell-overhead-triceps-extension-m-arch\" data-key=\"arch\" data-cue=\"Your lower back arches as you press the dumbbell up.\" class=\"plate-callout two m\" style=\"left:17.88%;top:49.16%\" aria-pressed=\"true\">Back<br>arches</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "vertical",
        cues: [{ key: "vertical", cue: "Keep the upper arms vertical and still. Only the elbows bend." }, { key: "braced", cue: "Brace the trunk, shoulders down and back, head in line with your spine." }, { key: "stop", cue: "Lower to about a right angle, clear of the back of your head." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "arch",
        cues: [{ key: "arch", cue: "Your lower back arches as you press the dumbbell up." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Back arches</b><span>Your lower back arches as you press the dumbbell up.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: press 1 second, hold 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Dumbbell overhead triceps extension, side view. Standing in a split stance, torso upright, one dumbbell held vertically in both hands behind the head with the elbows bent to about 90 degrees. The upper arms stay vertical while the elbows straighten to press the dumbbell overhead.",
      mistakeAlt: "Dumbbell Overhead Triceps Extension: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "push",
    "why": "D-SHIP-C3 no-zoom list: the cupped key lists dumbbell_overhead_triceps_extension in GAPS (hand-cupped.mjs:30; no hand fault sourced for the cupped grip); the grip copy carries c1 and c4.",
    "handle": "dumbbell",
    "loadAxis": "along-forearm",
    "overBody": true,
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-oh-ext"
        ],
        "note": "card c1"
      }
    },
    "contact": "heel",
    "wrist": {
      "ext": [
        0,
        15
      ],
      "limitText": "Keep your wrists still throughout.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "CONVENTION"
        ],
        "sources": [
          "ace-oh-ext",
          "ga-push-heel"
        ],
        "note": "card c7. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number."
      }
    },
    "faults": [
      {
        "key": "not-wrapped",
        "label": "Hands not wrapped",
        "pose": {},
        "markers": [],
        "alt": "Hands not wrapped round the handle."
      }
    ],
    "gripLine": "One dumbbell, both hands wrapped round the handle. Palms up, dumbbell hanging vertically.",
    "cue": "Both hands round handle, palms up."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "load",
      "text": "Pick a dumbbell you can get overhead safely.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "healthline-ote"
        ],
        "note": "card c8"
      }
    },
    {
      "kind": "position",
      "text": "Stand in a split stance, or sit on a back-supported bench.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-db-oh",
          "ace-oh-ext"
        ],
        "note": "card c11, c1"
      }
    },
    {
      "kind": "grip",
      "text": "Wrap both hands round the handle, dumbbell hanging vertically.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-oh-ext"
        ],
        "note": "card c1, c4 (grip.handContact; card zoom db-oh-hands right)"
      }
    },
    {
      "kind": "brace",
      "text": "Brace. Arms vertical, dumbbell over your head, elbows forward, not locked.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-oh-ext"
        ],
        "note": "card c3, c4"
      }
    },
    {
      "kind": "safety",
      "text": "For heavy sets, a spotter can help by supporting your elbows.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "motra-db-oh"
        ],
        "note": "card c13"
      }
    }
  ],
  posture: [
    {
      "key": "vertical",
      "label": "Arms vertical",
      "detail": "Upper arms vertical and still, elbows shoulder-width apart, no flaring.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "zoom": "db-oh-elbows",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "ace-oh-ext",
          "motra-db-oh"
        ],
        "note": "card c6, c7, c12"
      }
    },
    {
      "key": "depth",
      "label": "Stop at 90°",
      "detail": "Lower slowly behind your head to about 90°, without touching it.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "zoom": "db-oh-elbows",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-oh-ext"
        ],
        "note": "card c5, c6 (posture c5; the undrawn half of card zoom db-oh-elbows)"
      }
    },
    {
      "key": "brace",
      "label": "Braced torso",
      "detail": "Torso braced. Don't arch your back.",
      "anchor": {
        "pose": "end",
        "at": "lumbar"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "healthline-ote",
          "ace-oh-ext"
        ],
        "note": "card c9, c3"
      }
    },
    {
      "key": "still",
      "label": "Body still",
      "detail": "Head, torso, wrists and feet stay still.",
      "anchor": {
        "pose": "end",
        "at": "head"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-oh-ext"
        ],
        "note": "card c7"
      }
    },
    {
      "key": "lockout",
      "label": "Soft lockout",
      "detail": "Straighten without locking the elbows.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-oh-ext"
        ],
        "note": "card c4"
      }
    }
  ],
  zooms: [
    {
      "key": "db-oh-elbows",
      "chip": "Upper arms",
      "heading": "Upper arm position",
      "kind": "posture"
    }
  ],
  chips: [
    "db-oh-elbows",
    "feel"
  ],
  copy: {
    "setupLine": "One dumbbell in both hands, in a split stance or on a back-supported bench.",
    "mistakeLine": "Keep your upper arms vertical. Brace, and go lighter if your back arches.",
    "cueLine": "Upper arms still, only elbows bend."
  },
  mistakes: [
    {
      "key": "arch",
      "title": "Arching the back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "healthline-ote",
          "ace-oh-ext"
        ],
        "note": "card c9, c3"
      },
      "fix": "Brace. If the back still arches, use a lighter dumbbell."
    },
    {
      "key": "flare",
      "title": "Elbows flare, upper arms move",
      "zoom": "db-oh-elbows",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "ace-oh-ext",
          "motra-db-oh"
        ],
        "note": "card c6, c5, c12"
      },
      "fix": "Keep upper arms vertical, elbows shoulder-width. Stop lowering if they move."
    },
    {
      "key": "swing",
      "title": "Swinging the weight with momentum",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "healthline-ote",
          "motra-db-oh",
          "ace-oh-ext"
        ],
        "note": "card c10, c12, c7"
      },
      "fix": "Slow down, no momentum. Keep head, torso, wrists and feet still."
    }
  ],
  risks: [
    {
      "key": "dropped",
      "text": "Across weight training, dropped weights are the most common way people get badly hurt.",
      "claim": {
        "tags": [
          "WEAK"
        ],
        "sources": [
          "kerr-2010"
        ],
        "note": "card c15"
      }
    },
    {
      "key": "tendon",
      "text": "Triceps tendon rupture (rare), often from forceful lowering or lifting against resistance.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "gaviria-2020"
        ],
        "note": "card c16"
      }
    },
    {
      "key": "progress",
      "text": "Beat target by one or two reps? Add 2 to 10 percent.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "acsm-2009"
        ],
        "note": "card c17"
      }
    }
  ],
  riskFlags: [
    "elbow",
    "back",
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
    "ace-oh-ext",
    "healthline-ote",
    "motra-db-oh",
    "alves-2018",
    "kerr-2010",
    "gaviria-2020",
    "acsm-2009",
    "ga-push-heel",
    "nhs-elbow-pain",
    "nhs-shoulder-pain",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/dumbbell_overhead_triceps_extension.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

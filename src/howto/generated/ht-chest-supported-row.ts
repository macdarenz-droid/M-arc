// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=126151d291bceaad907e9342e6709a29ffbd1909c2c1e70678421c345c885095
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_chest_supported_row",
  name: "Chest-Supported Row",
  hashes: { inputsSha256: "126151d291bceaad907e9342e6709a29ffbd1909c2c1e70678421c345c885095", golden: "c927c654d8f6866719bee3ca807382882da570d30b871a009752d8950f254196" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"chest-supported-row-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"chest-supported-row-n-st-shcap.l\" d=\"~~YWqFRA1wP10\"/><path id=\"chest-supported-row-n-st-upper.l\" d=\"~#F12Y)rYwD1R!qT_B1X8X107PO1P4K5*3X2.1BB1GbzhVcGgK2*jF7)D14z3uG6F2YN1J938-8rK3(fFnFhFmH3Fr.900000002002000000000000001001111110002001000210100000210000100000000000000000000\"/><path id=\"chest-supported-row-n-st-elbowcap.l\" d=\"~~(GA1U!B1Dz10\"/><path id=\"chest-supported-row-n-st-fore.l\" d=\"~#F12PJB1NxE1RPA1**D1Ba.1!1pNI1T2E9X3G2V1*w1vVcx7Eb5-cS6xx11G2S1K9H3JI1H4!1qGaP1bAaNj!aDhaYjBa00200021011012000000000200000210000020000200000100000000200000010000000000100000\"/><path id=\"chest-supported-row-n-st-fist.l\" d=\"~~yDN1DyD1ww10\"/><path id=\"chest-supported-row-n-st-torso\" d=\"~#_12NAqFGv)Kq-_tT9K6E30U9ShU9N6_cwgJ60K6)nGm)7.c_4wg-4!kI6HmxgUhRh_4R9)7xgBrBz1BbBrK60R90YcwgF3w8.c)7*fw8I6_kH6J6!cBbD3w8ET2ww100010101000100002000000200020000020010000000201110000020000021000000000002001200000000000000202000101020000010020000\"/><path id=\"chest-supported-row-n-st-shcap.r\" d=\"^0\"/><path id=\"chest-supported-row-n-st-upper.r\" d=\"^1\"/><path id=\"chest-supported-row-n-st-elbowcap.r\" d=\"^2\"/><path id=\"chest-supported-row-n-st-fore.r\" d=\"^3\"/><path id=\"chest-supported-row-n-st-fist.r\" d=\"^4\"/><path id=\"chest-supported-row-n-g0-shcap.r\" d=\"~~HIqSTA1wP10\"/><path id=\"chest-supported-row-n-g0-upper.r\" d=\"~#F12!Wq_SB1RwqIXA1I5)665Sw1Fy1K1O6rE3EkOw1T4VkVaRc-jV7xt*o)2G1E6K2!sHB158z6I6BdN9D6HsUeyhyrNa00200000000002000011000000100001010101000001010111010102000002010110100000012120\"/><path id=\"chest-supported-row-n-g0-elbowcap.r\" d=\"~~yYw1FTI1Dz10\"/><path id=\"chest-supported-row-n-g0-fore.r\" d=\"~#F12WBy1SWJ1EHx1O.J1EaD1S1B1FF1Rf.9nV2rEvY8zex3-aF3GaAa)uU9V1D2*7w6FH1X8(16E9P4N2!9YlS4Pg-4_fVf00000000000100100000021000012100001000000200201210000200000020000202000010010100\"/><path id=\"chest-supported-row-n-g0-fist.r\" d=\"~~FAH1!.F1ww10\"/><path id=\"chest-supported-row-n-g1-shcap.r\" d=\"~~!)p_VA1wP10\"/><path id=\"chest-supported-row-n-g1-upper.r\" d=\"~#F12Wxq(yB1*YpXwA1)1R8a3DfSJ1J1O6iB3V4.B1P4XkO4.fXeEf.fVy1B2K2T4-4Sa(K190.2E8)f(2B6HsD6Slyk!k20002021000001100210100000000000002000000000002101000000011200010120012000000000\"/><path id=\"chest-supported-row-n-g1-elbowcap.r\" d=\"~~w*sUPK1Dz10\"/><path id=\"chest-supported-row-n-g1-fore.r\" d=\"~#F12YJuFTN1XRt.-N1za!1P1I1yE1-h-97-2lKuPaGe)1TaY3T9!aEuHbR1J2O7P6PG1Ibw24*8w5!2_9ymD3Ag*5!eKg11000000000000000110102100000000010200000100020000002000200001001200000101020000\"/><path id=\"chest-supported-row-n-g1-fist.r\" d=\"~~NyD1NEH1ww10\"/><path id=\"chest-supported-row-n-g2-shcap.r\" d=\"~~NUpAYA1wP10\"/><path id=\"chest-supported-row-n-g2-upper.r\" d=\"~#F12!UpwSA1I_pzOz1U1T8a0T3wO1_3I5!1-2PaVA1JcGhA2GgR7*jrzD1x1B3I2B6K8JN170k.8.fK3-gPn*2HmJaAr11002000200120001001010000000001010000001210101000101002001000000000010000220011\"/><path id=\"chest-supported-row-n-g2-elbowcap.r\" d=\"~~S.oy!K1Dz10\"/><path id=\"chest-supported-row-n-g2-fore.r\" d=\"~#F12SIqS(N1RPpIBO1za(1N1I1yE1Bi.93X2lOu_aIe)1Oa(3T9!azuUbT1J2K7P6PG1Tb(10*8D5A3W9(ly3Dg)5WeVg00000000002000200000001000001000000000210002000000200010110000002010020000000000\"/><path id=\"chest-supported-row-n-g2-fist.r\" d=\"~~Swy1SPH1ww10\"/><path id=\"chest-supported-row-n-e-thigh.l\" d=\"~#F12_ErwKU1-Yp*FU1.b55F1J(1!6V6z7K3I3)T1GbTk.f)jI3ToJ8.U1B6I4w2T8U4F*1Yd6E1EbV3-g_sWA1JsPz1!5!I1.e00000020000000002000000000001210000120001010010020001010100200000000002000020002\"/><path id=\"chest-supported-row-n-e-kneecap.l\" d=\"~~HHD1_xU1_J10\"/><path id=\"chest-supported-row-n-e-shank.l\" d=\"~#F12UGD1_YT1OWD1EIS1y4BbF16K7Y(1H7R6P3G3J9Ky2_9*bF2XbK4XeUg*w2.1K4I4.8*g_!1G17i*b.ew9XhUlE4FlF8!q10100000000200101000202000000010000022000000010100000001100000000020010000200200\"/><path id=\"chest-supported-row-n-e-foot.l\" d=\"~#o2_KA1Sw)1I)A1Rw(1YcD3Uh)7Sp*nU-2E3-J2-4ID1)7)n0TG1_4BbXc_sEbKmSp020000000210100001010020000000000000020100110100\"/><path id=\"chest-supported-row-n-e-shcap.l\" d=\"~~yGpN_A1wP10\"/><path id=\"chest-supported-row-n-e-upper.l\" d=\"~#F12ARpY)z1RBq-yz1F5z7a6BoUF1_5B3(2T1_pKsYi*9A9Xdy2zlFg-y1eB3mX6EswD155N4R7TcBaTpWdOcUiV2!s02000222000200100100000101000010000000000000000000000200001010200000100001000200\"/><path id=\"chest-supported-row-n-e-elbowcap.l\" d=\"~~ySk!OJ1Dz10\"/><path id=\"chest-supported-row-n-e-fore.l\" d=\"~#F12S)lDTK1xAlxYK1EaD1P1E1JF1Kf*9nT2tGvW8Be)2XaA3IaDaxvP9X1F2.7(5FH1V8w28G9N4N2!9YlU4Sg-4YfTf20000000002101000200200001000000000010000020000100200020000000000002200000001000\"/><path id=\"chest-supported-row-n-e-fist.l\" d=\"~~Y(ty-G1ww10\"/><path id=\"chest-supported-row-n-e-head\" d=\"~#w12NUrFRqBxqTEqEjDjEjS9zbB3E3_4X4)7)7BbThKmY4XcO1T9Ej0JmBbNmK6YkF3Fj(fT1Fj0001111100002000002000000010001002200010000010000012000000020000\"/><path id=\"chest-supported-row-n-e-torso\" d=\"~#_12NAqFGv)Kq-_tT9.1E3O5U9!eU9ya_cwgJ60K6)nGm)7.c_4wg-4!kI6HmxgUhRh_4R9)7xgBrBz1BbBrK60R90YcwgF3w8.c)7*fYaI6yiH6U3!cK8D3w8ET2ww100000100000000002000000200020000020010000000201110000020000021000000000002001200000000000000222000101020000010020000\"/><path id=\"chest-supported-row-n-e-thigh.r\" d=\"^21\"/><path id=\"chest-supported-row-n-e-kneecap.r\" d=\"^22\"/><path id=\"chest-supported-row-n-e-shank.r\" d=\"^23\"/><path id=\"chest-supported-row-n-e-foot.r\" d=\"^24\"/><path id=\"chest-supported-row-n-e-shcap.r\" d=\"^25\"/><path id=\"chest-supported-row-n-e-upper.r\" d=\"^26\"/><path id=\"chest-supported-row-n-e-elbowcap.r\" d=\"^27\"/><path id=\"chest-supported-row-n-e-fore.r\" d=\"^28\"/><path id=\"chest-supported-row-n-e-fist.r\" d=\"^29\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#chest-supported-row-n-dots)\"/>\n  <path class=\"floorline\" d=\"M61.97 338.77H296.03\"/><path class=\"eq\" d=\"~MWSP1Dyy2LJH10QF60zA1E6LE6)_F1Q0E6E6w.F1LzA1F6QE60AA1F6LF6w.F1Q0F6F6)_F1Z\"/><path class=\"eq\" d=\"~MJwz1S.F1LS!d0LTRd(aL*a!cL*a.cLTRd*aLSRd*aLwb.cZ\"/><path class=\"eq\" d=\"~MWEvAwP1L0K.cLWK3N.cLVK3N.cZ\"/><path class=\"eq\" d=\"~MUNlNUW1LAX80Qwp0z(7)oL)owbQ0)o)o)aLz(7wpQ)o0A(7wpLwp)aQ0wpwpwbZ\"/><path class=\"eq\" d=\"~MY(o!zX1L0U!9Q0F6F6IW9LAA1E6QF60zA1E6LE6IW9Q0E6E6JW9LzA1F6QE60AA1F6Z\"/><path class=\"eq\" d=\"~MHXjDyy2LYBc0QF60O)bE6LE6V8Q0E6E6W8LO)bF6QE60P)bF6LF6W8Q0F6F6V8Z\"/><path class=\"eq\" d=\"~MYxz1HIqLDYe0QJ90-NeI9LI9XqQ0I9I9YqL-NeJ9QI90_NeJ9LJ9YqQ0J9J9XqZ\"/><path class=\"eq-solid\" d=\"~~Pxz1DyqNr0\"/><path class=\"eq-pin\" d=\"~~WWz1DyqF60\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-n-st-shcap.l\"/><use href=\"#chest-supported-row-n-st-upper.l\"/><use href=\"#chest-supported-row-n-st-elbowcap.l\"/><use href=\"#chest-supported-row-n-st-fore.l\"/><use href=\"#chest-supported-row-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-n-st-shcap.l\"/><use href=\"#chest-supported-row-n-st-upper.l\"/><use href=\"#chest-supported-row-n-st-elbowcap.l\"/><use href=\"#chest-supported-row-n-st-fore.l\"/><use href=\"#chest-supported-row-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-n-st-torso\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-n-st-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-n-st-shcap.r\"/><use href=\"#chest-supported-row-n-st-upper.r\"/><use href=\"#chest-supported-row-n-st-elbowcap.r\"/><use href=\"#chest-supported-row-n-st-fore.r\"/><use href=\"#chest-supported-row-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-n-st-shcap.r\"/><use href=\"#chest-supported-row-n-st-upper.r\"/><use href=\"#chest-supported-row-n-st-elbowcap.r\"/><use href=\"#chest-supported-row-n-st-fore.r\"/><use href=\"#chest-supported-row-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq\" d=\"~MFWA1wyqLW*6wDeLVy7IXdLIgB4LW6KfL)N6)weLYy7HXdLHgF4Z\"/><path class=\"eq-solid\" d=\"~MPWH1ANH1L0RA3LD9N.2L1A9L0A9Lz9N.2Lz9I.2L0B9Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-n-g0-shcap.r\"/><use href=\"#chest-supported-row-n-g0-upper.r\"/><use href=\"#chest-supported-row-n-g0-elbowcap.r\"/><use href=\"#chest-supported-row-n-g0-fore.r\"/><use href=\"#chest-supported-row-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-n-g0-shcap.r\"/><use href=\"#chest-supported-row-n-g0-upper.r\"/><use href=\"#chest-supported-row-n-g0-elbowcap.r\"/><use href=\"#chest-supported-row-n-g0-fore.r\"/><use href=\"#chest-supported-row-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq\" d=\"~MNVA1SFqLHx3YOfL)G3.yfLTeG8LNaBdLIU2zEfL!G3_yfLWeJ8Z\"/><path class=\"eq-solid\" d=\"~MWUD1Y-I1L0RA3LA9N.2L2A9L1A9Lz9N.2Lz9K.2L1z9Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-n-g1-shcap.r\"/><use href=\"#chest-supported-row-n-g1-upper.r\"/><use href=\"#chest-supported-row-n-g1-elbowcap.r\"/><use href=\"#chest-supported-row-n-g1-fore.r\"/><use href=\"#chest-supported-row-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-n-g1-shcap.r\"/><use href=\"#chest-supported-row-n-g1-upper.r\"/><use href=\"#chest-supported-row-n-g1-elbowcap.r\"/><use href=\"#chest-supported-row-n-g1-fore.r\"/><use href=\"#chest-supported-row-n-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq\" d=\"~MATA1JNqLzrNYfLSfxNfLBcTbLNdGaLNB1*JfLRfDNfLDcSbZ\"/><path class=\"eq-solid\" d=\"~M!Sy1!yJ1L0TA3LA9P.2L0A9L2A9LB9P.2LB9O.2L2z9Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-n-g2-shcap.r\"/><use href=\"#chest-supported-row-n-g2-upper.r\"/><use href=\"#chest-supported-row-n-g2-elbowcap.r\"/><use href=\"#chest-supported-row-n-g2-fore.r\"/><use href=\"#chest-supported-row-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-n-g2-shcap.r\"/><use href=\"#chest-supported-row-n-g2-upper.r\"/><use href=\"#chest-supported-row-n-g2-elbowcap.r\"/><use href=\"#chest-supported-row-n-g2-fore.r\"/><use href=\"#chest-supported-row-n-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-n-e-thigh.l\"/><use href=\"#chest-supported-row-n-e-kneecap.l\"/><use href=\"#chest-supported-row-n-e-shank.l\"/><use href=\"#chest-supported-row-n-e-foot.l\"/><use href=\"#chest-supported-row-n-e-shcap.l\"/><use href=\"#chest-supported-row-n-e-upper.l\"/><use href=\"#chest-supported-row-n-e-elbowcap.l\"/><use href=\"#chest-supported-row-n-e-fore.l\"/><use href=\"#chest-supported-row-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-n-e-thigh.l\"/><use href=\"#chest-supported-row-n-e-kneecap.l\"/><use href=\"#chest-supported-row-n-e-shank.l\"/><use href=\"#chest-supported-row-n-e-foot.l\"/><use href=\"#chest-supported-row-n-e-shcap.l\"/><use href=\"#chest-supported-row-n-e-upper.l\"/><use href=\"#chest-supported-row-n-e-elbowcap.l\"/><use href=\"#chest-supported-row-n-e-fore.l\"/><use href=\"#chest-supported-row-n-e-fist.l\"/></g></g><path class=\"eq\" d=\"~MwBfDyy2L_BA10QF60R)z1E6LE6OlQ0E6E6PlLR)z1F6QE60S)z1F6LF6PlQ0F6F6OlZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-n-e-head\"/><use href=\"#chest-supported-row-n-e-torso\"/><use href=\"#chest-supported-row-n-e-thigh.r\"/><use href=\"#chest-supported-row-n-e-kneecap.r\"/><use href=\"#chest-supported-row-n-e-shank.r\"/><use href=\"#chest-supported-row-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-n-e-head\"/><use href=\"#chest-supported-row-n-e-torso\"/><use href=\"#chest-supported-row-n-e-thigh.r\"/><use href=\"#chest-supported-row-n-e-kneecap.r\"/><use href=\"#chest-supported-row-n-e-shank.r\"/><use href=\"#chest-supported-row-n-e-foot.r\"/></g></g><path class=\"eq\" d=\"~MNOA1PTqLRX4(xfLYG4X_eL-8GeLNfV6LY(4xUeL-G4W_eL(8HeZ\"/><path class=\"eq-solid\" d=\"~MyRuHII1L0RA3LA9N.2L0A9L0A9Lz9N.2Lz9K.2L0z9Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-n-e-shcap.r\"/><use href=\"#chest-supported-row-n-e-upper.r\"/><use href=\"#chest-supported-row-n-e-elbowcap.r\"/><use href=\"#chest-supported-row-n-e-fore.r\"/><use href=\"#chest-supported-row-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-n-e-shcap.r\"/><use href=\"#chest-supported-row-n-e-upper.r\"/><use href=\"#chest-supported-row-n-e-elbowcap.r\"/><use href=\"#chest-supported-row-n-e-fore.r\"/><use href=\"#chest-supported-row-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"137.13\" cy=\"188.55\" r=\"2.25\"/><circle class=\"joint\" cx=\"110.92\" cy=\"227.82\" r=\"2.25\"/><circle class=\"joint\" cx=\"141.51\" cy=\"256.2\" r=\"2.25\"/><circle class=\"joint\" cx=\"203.38\" cy=\"266.53\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#F20wPK1SEE1._K1zwE12201020001020.300102000020100000000001-221000000000000021120000V201020001000020002002000000000100001001100010000022002200200101010001000000100210021200012000200000000000000000100010021000002000200020010100000001010100\"/><path class=\"arrow\" d=\"~MSBw1ywH1LFF1XbL*N1UP1Z\"/></g><path class=\"leader\" d=\"~MWww1FJz1L0XYa\"/><circle class=\"anchor\" cx=\"163.95\" cy=\"181.16\" r=\"1.5\"/><path class=\"leader\" d=\"M110.92 227.82L95.34 234H85.34\"/><circle class=\"anchor\" cx=\"110.92\" cy=\"227.82\" r=\"1.5\"/><path class=\"leader\" d=\"~My-qNHz1LVU4K5\"/><circle class=\"anchor\" cx=\"137.13\" cy=\"180.87\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"chest-supported-row-n-chest\" data-key=\"chest\" data-cue=\"Keep the chest lightly on the pad from the first rep to the last.\" class=\"plate-callout two\" style=\"left:32.96%;top:24.02%\" aria-pressed=\"true\">Chest<br>on pad</button><button type=\"button\" id=\"chest-supported-row-n-elbows\" data-key=\"elbows\" data-cue=\"Each rep ends with the elbows close to the ribs and just behind the body.\" class=\"plate-callout two\" style=\"left:2.23%;top:59.22%\" aria-pressed=\"false\">Elbows<br>past sides</button><button type=\"button\" id=\"chest-supported-row-n-shoulders\" data-key=\"shoulders\" data-cue=\"Shoulders drawn back and down before the pull and kept there.\" class=\"plate-callout two\" style=\"left:9.5%;top:44.13%\" aria-pressed=\"false\">Shoulders<br>down</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"chest-supported-row-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"chest-supported-row-m-st-shcap.l\" d=\"^0\"/><path id=\"chest-supported-row-m-st-upper.l\" d=\"^1\"/><path id=\"chest-supported-row-m-st-elbowcap.l\" d=\"^2\"/><path id=\"chest-supported-row-m-st-fore.l\" d=\"^3\"/><path id=\"chest-supported-row-m-st-fist.l\" d=\"^4\"/><path id=\"chest-supported-row-m-st-torso\" d=\"^5\"/><path id=\"chest-supported-row-m-st-shcap.r\" d=\"^0\"/><path id=\"chest-supported-row-m-st-upper.r\" d=\"^1\"/><path id=\"chest-supported-row-m-st-elbowcap.r\" d=\"^2\"/><path id=\"chest-supported-row-m-st-fore.r\" d=\"^3\"/><path id=\"chest-supported-row-m-st-fist.r\" d=\"^4\"/><path id=\"chest-supported-row-m-g0-shcap.r\" d=\"^6\"/><path id=\"chest-supported-row-m-g0-upper.r\" d=\"^7\"/><path id=\"chest-supported-row-m-g0-elbowcap.r\" d=\"^8\"/><path id=\"chest-supported-row-m-g0-fore.r\" d=\"^9\"/><path id=\"chest-supported-row-m-g0-fist.r\" d=\"^10\"/><path id=\"chest-supported-row-m-g1-shcap.r\" d=\"^11\"/><path id=\"chest-supported-row-m-g1-upper.r\" d=\"^12\"/><path id=\"chest-supported-row-m-g1-elbowcap.r\" d=\"^13\"/><path id=\"chest-supported-row-m-g1-fore.r\" d=\"^14\"/><path id=\"chest-supported-row-m-g1-fist.r\" d=\"^15\"/><path id=\"chest-supported-row-m-g2-shcap.r\" d=\"^16\"/><path id=\"chest-supported-row-m-g2-upper.r\" d=\"^17\"/><path id=\"chest-supported-row-m-g2-elbowcap.r\" d=\"^18\"/><path id=\"chest-supported-row-m-g2-fore.r\" d=\"^19\"/><path id=\"chest-supported-row-m-g2-fist.r\" d=\"^20\"/><path id=\"chest-supported-row-m-e-thigh.l\" d=\"^21\"/><path id=\"chest-supported-row-m-e-kneecap.l\" d=\"^22\"/><path id=\"chest-supported-row-m-e-shank.l\" d=\"^23\"/><path id=\"chest-supported-row-m-e-foot.l\" d=\"^24\"/><path id=\"chest-supported-row-m-e-shcap.l\" d=\"^25\"/><path id=\"chest-supported-row-m-e-upper.l\" d=\"^26\"/><path id=\"chest-supported-row-m-e-elbowcap.l\" d=\"^27\"/><path id=\"chest-supported-row-m-e-fore.l\" d=\"^28\"/><path id=\"chest-supported-row-m-e-fist.l\" d=\"^29\"/><path id=\"chest-supported-row-m-e-head\" d=\"^30\"/><path id=\"chest-supported-row-m-e-torso\" d=\"^31\"/><path id=\"chest-supported-row-m-e-thigh.r\" d=\"^21\"/><path id=\"chest-supported-row-m-e-kneecap.r\" d=\"^22\"/><path id=\"chest-supported-row-m-e-shank.r\" d=\"^23\"/><path id=\"chest-supported-row-m-e-foot.r\" d=\"^24\"/><path id=\"chest-supported-row-m-e-shcap.r\" d=\"^25\"/><path id=\"chest-supported-row-m-e-upper.r\" d=\"^26\"/><path id=\"chest-supported-row-m-e-elbowcap.r\" d=\"^27\"/><path id=\"chest-supported-row-m-e-fore.r\" d=\"^28\"/><path id=\"chest-supported-row-m-e-fist.r\" d=\"^29\"/><path id=\"chest-supported-row-m-m-head\" d=\"~#w12FYiJRrRBhK*rX9HpTdUgRbU1tY5T7K5.b*6BpGdpVdK5x8KhY7_fGj(h*eFkR5yo_6J6Fi1111000002020000022100000000001110001021001010000200000000220000\"/><path id=\"chest-supported-row-m-m-torso\" d=\"~#_12FHjYOw1BwjOxvGb.1*2F1(fFcHb!1FiN9W7I4-lRi)x1A2BbP7Af)6YjE9wk*i(e.jN3BaBaXe-vxv.eIpVaEeXy1.5!qUE1D6w6*ez2Ib_dS2UlP8F3A7KfD6w6*(1A)110020010100200001100000100000000020010100000200020101010101011111100000000020000010100001110000002022000020000000210\"/><path id=\"chest-supported-row-m-m-shcap.r\" d=\"~~JRk_wB1wP10\"/><path id=\"chest-supported-row-m-m-upper.r\" d=\"~#F12!SkYUA1T!k.Sz1S2K8c2R9AN1S4*4y2K2Af)y1NeRfD4*fx5Vkw4-B1nG3O1I6Be_J191_1V8GfO5XjDlT5_l_6As01011020000000000010120022000020001010220011000022001100000001001010010000000100\"/><path id=\"chest-supported-row-m-m-elbowcap.r\" d=\"~~yUiw*K1Dz10\"/><path id=\"chest-supported-row-m-m-fore.r\" d=\"~#F12!Jk__N1XUjRFO1E9P4A1T1Sw1*rO9P2.22GqPiIe(1x9U6I6wd-pHjtU2I5H8WA1Gmw2fE7J7P5S8wm*2weBaW9*j10100000220001001101110000010000020010020010100000000001200200000000002100000002\"/><path id=\"chest-supported-row-m-m-fist.r\" d=\"~~yRqDFF1ww10\"/><path id=\"chest-supported-row-m-m-eq0\" d=\"~MwIA1FXqLVw8ATdLUR7EOdLI5)fLSg.2LUA8zAdLXR7FOdLN5(fZ\"/><path id=\"chest-supported-row-m-m-eq1\" d=\"~MHzrP_G1L0TA3LA9P.2L2A9L1A9Lz9P.2Lz9O.2L1z9Z\"/><path id=\"chest-supported-row-m-mf-thigh.l\" d=\"~#F12J.qDFU1IJp.zU1*b55F1J(1F7V6B7I3I3*T1TbRkxg.jK3XoD8.U1R6E4w2-8S4F*1De6G1EbX3*gYsNA1SsNz1A6yJ1Re11001010000020200020000000000000200001100000000100000000010022020010000000220011\"/><path id=\"chest-supported-row-m-mf-kneecap.l\" d=\"~~(*B1S)T1_J10\"/><path id=\"chest-supported-row-m-mf-shank.l\" d=\"~#F12(!B1wYT1GFD1)GS1W3IbD16I5((1A7-6J3K3D7Vy2N9Bcw2.bx5TeUeKx2x2G4T4X8)eH*1G156*bReJ9zhFmO3Nly9Pq00100111000101011000010000002021001010000000002000012100100000011002000000000000\"/><path id=\"chest-supported-row-m-mf-foot.l\" d=\"^24\"/><path id=\"chest-supported-row-m-mf-shcap.l\" d=\"^58\"/><path id=\"chest-supported-row-m-mf-upper.l\" d=\"^59\"/><path id=\"chest-supported-row-m-mf-elbowcap.l\" d=\"^60\"/><path id=\"chest-supported-row-m-mf-fore.l\" d=\"^61\"/><path id=\"chest-supported-row-m-mf-fist.l\" d=\"^62\"/><path id=\"chest-supported-row-m-mf-thigh.r\" d=\"^65\"/><path id=\"chest-supported-row-m-mf-kneecap.r\" d=\"^66\"/><path id=\"chest-supported-row-m-mf-shank.r\" d=\"^67\"/><path id=\"chest-supported-row-m-mf-foot.r\" d=\"^24\"/><path id=\"chest-supported-row-m-mo-0\" d=\"^30\"/><path id=\"chest-supported-row-m-mo-1\" d=\"^31\"/><path id=\"chest-supported-row-m-mo-2\" d=\"^21\"/><path id=\"chest-supported-row-m-mo-3\" d=\"^22\"/><path id=\"chest-supported-row-m-mo-4\" d=\"^23\"/><path id=\"chest-supported-row-m-mo-5\" d=\"^24\"/><path id=\"chest-supported-row-m-mo-6\" d=\"^25\"/><path id=\"chest-supported-row-m-mo-7\" d=\"^26\"/><path id=\"chest-supported-row-m-mo-8\" d=\"^27\"/><path id=\"chest-supported-row-m-mo-9\" d=\"^28\"/><path id=\"chest-supported-row-m-mo-10\" d=\"^29\"/><path id=\"chest-supported-row-m-mo-11\" d=\"^21\"/><path id=\"chest-supported-row-m-mo-12\" d=\"^22\"/><path id=\"chest-supported-row-m-mo-13\" d=\"^23\"/><path id=\"chest-supported-row-m-mo-14\" d=\"^24\"/><path id=\"chest-supported-row-m-mo-15\" d=\"^25\"/><path id=\"chest-supported-row-m-mo-16\" d=\"^26\"/><path id=\"chest-supported-row-m-mo-17\" d=\"^27\"/><path id=\"chest-supported-row-m-mo-18\" d=\"^28\"/><path id=\"chest-supported-row-m-mo-19\" d=\"^29\"/><path id=\"chest-supported-row-m-mo-20\" d=\"^48\"/><path id=\"chest-supported-row-m-mo-21\" d=\"^33\"/><path id=\"chest-supported-row-m-mo-22\" d=\"^34\"/><path id=\"chest-supported-row-m-mo-23\" d=\"^35\"/><path id=\"chest-supported-row-m-mo-24\" d=\"^36\"/><path id=\"chest-supported-row-m-mo-25\" d=\"^37\"/><path id=\"chest-supported-row-m-mo-26\" d=\"^38\"/><path id=\"chest-supported-row-m-mo-27\" d=\"^49\"/><path id=\"chest-supported-row-m-mo-28\" d=\"^50\"/><path id=\"chest-supported-row-m-mo-29\" d=\"^39\"/><path id=\"chest-supported-row-m-mo-30\" d=\"^40\"/><path id=\"chest-supported-row-m-mo-31\" d=\"^41\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#chest-supported-row-m-dots)\"/>\n  <path class=\"floorline\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><path class=\"eq\" d=\"^38\"/><path class=\"eq\" d=\"^39\"/><path class=\"eq-solid\" d=\"^40\"/><path class=\"eq-pin\" d=\"^41\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-m-st-shcap.l\"/><use href=\"#chest-supported-row-m-st-upper.l\"/><use href=\"#chest-supported-row-m-st-elbowcap.l\"/><use href=\"#chest-supported-row-m-st-fore.l\"/><use href=\"#chest-supported-row-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-m-st-shcap.l\"/><use href=\"#chest-supported-row-m-st-upper.l\"/><use href=\"#chest-supported-row-m-st-elbowcap.l\"/><use href=\"#chest-supported-row-m-st-fore.l\"/><use href=\"#chest-supported-row-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-m-st-torso\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-m-st-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-m-st-shcap.r\"/><use href=\"#chest-supported-row-m-st-upper.r\"/><use href=\"#chest-supported-row-m-st-elbowcap.r\"/><use href=\"#chest-supported-row-m-st-fore.r\"/><use href=\"#chest-supported-row-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-m-st-shcap.r\"/><use href=\"#chest-supported-row-m-st-upper.r\"/><use href=\"#chest-supported-row-m-st-elbowcap.r\"/><use href=\"#chest-supported-row-m-st-fore.r\"/><use href=\"#chest-supported-row-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq\" d=\"^42\"/><path class=\"eq-solid\" d=\"^43\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-m-g0-shcap.r\"/><use href=\"#chest-supported-row-m-g0-upper.r\"/><use href=\"#chest-supported-row-m-g0-elbowcap.r\"/><use href=\"#chest-supported-row-m-g0-fore.r\"/><use href=\"#chest-supported-row-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-m-g0-shcap.r\"/><use href=\"#chest-supported-row-m-g0-upper.r\"/><use href=\"#chest-supported-row-m-g0-elbowcap.r\"/><use href=\"#chest-supported-row-m-g0-fore.r\"/><use href=\"#chest-supported-row-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq\" d=\"^44\"/><path class=\"eq-solid\" d=\"^45\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-m-g1-shcap.r\"/><use href=\"#chest-supported-row-m-g1-upper.r\"/><use href=\"#chest-supported-row-m-g1-elbowcap.r\"/><use href=\"#chest-supported-row-m-g1-fore.r\"/><use href=\"#chest-supported-row-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-m-g1-shcap.r\"/><use href=\"#chest-supported-row-m-g1-upper.r\"/><use href=\"#chest-supported-row-m-g1-elbowcap.r\"/><use href=\"#chest-supported-row-m-g1-fore.r\"/><use href=\"#chest-supported-row-m-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq\" d=\"^46\"/><path class=\"eq-solid\" d=\"^47\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-m-g2-shcap.r\"/><use href=\"#chest-supported-row-m-g2-upper.r\"/><use href=\"#chest-supported-row-m-g2-elbowcap.r\"/><use href=\"#chest-supported-row-m-g2-fore.r\"/><use href=\"#chest-supported-row-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-m-g2-shcap.r\"/><use href=\"#chest-supported-row-m-g2-upper.r\"/><use href=\"#chest-supported-row-m-g2-elbowcap.r\"/><use href=\"#chest-supported-row-m-g2-fore.r\"/><use href=\"#chest-supported-row-m-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-m-e-thigh.l\"/><use href=\"#chest-supported-row-m-e-kneecap.l\"/><use href=\"#chest-supported-row-m-e-shank.l\"/><use href=\"#chest-supported-row-m-e-foot.l\"/><use href=\"#chest-supported-row-m-e-shcap.l\"/><use href=\"#chest-supported-row-m-e-upper.l\"/><use href=\"#chest-supported-row-m-e-elbowcap.l\"/><use href=\"#chest-supported-row-m-e-fore.l\"/><use href=\"#chest-supported-row-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-m-e-thigh.l\"/><use href=\"#chest-supported-row-m-e-kneecap.l\"/><use href=\"#chest-supported-row-m-e-shank.l\"/><use href=\"#chest-supported-row-m-e-foot.l\"/><use href=\"#chest-supported-row-m-e-shcap.l\"/><use href=\"#chest-supported-row-m-e-upper.l\"/><use href=\"#chest-supported-row-m-e-elbowcap.l\"/><use href=\"#chest-supported-row-m-e-fore.l\"/><use href=\"#chest-supported-row-m-e-fist.l\"/></g></g><path class=\"eq\" d=\"^48\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-m-e-head\"/><use href=\"#chest-supported-row-m-e-torso\"/><use href=\"#chest-supported-row-m-e-thigh.r\"/><use href=\"#chest-supported-row-m-e-kneecap.r\"/><use href=\"#chest-supported-row-m-e-shank.r\"/><use href=\"#chest-supported-row-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-m-e-head\"/><use href=\"#chest-supported-row-m-e-torso\"/><use href=\"#chest-supported-row-m-e-thigh.r\"/><use href=\"#chest-supported-row-m-e-kneecap.r\"/><use href=\"#chest-supported-row-m-e-shank.r\"/><use href=\"#chest-supported-row-m-e-foot.r\"/></g></g><path class=\"eq\" d=\"^49\"/><path class=\"eq-solid\" d=\"^50\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-m-e-shcap.r\"/><use href=\"#chest-supported-row-m-e-upper.r\"/><use href=\"#chest-supported-row-m-e-elbowcap.r\"/><use href=\"#chest-supported-row-m-e-fore.r\"/><use href=\"#chest-supported-row-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#chest-supported-row-m-e-shcap.r\"/><use href=\"#chest-supported-row-m-e-upper.r\"/><use href=\"#chest-supported-row-m-e-elbowcap.r\"/><use href=\"#chest-supported-row-m-e-fore.r\"/><use href=\"#chest-supported-row-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"137.13\" cy=\"188.55\" r=\"2.25\"/><circle class=\"joint\" cx=\"110.92\" cy=\"227.82\" r=\"2.25\"/><circle class=\"joint\" cx=\"141.51\" cy=\"256.2\" r=\"2.25\"/><circle class=\"joint\" cx=\"203.38\" cy=\"266.53\" r=\"2.25\"/></g><mask id=\"chest-supported-row-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#chest-supported-row-m-m-head\" fill=\"#000\"/><use href=\"#chest-supported-row-m-m-torso\" fill=\"#000\"/><use href=\"#chest-supported-row-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#chest-supported-row-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#chest-supported-row-m-mf-shank.l\" fill=\"#000\"/><use href=\"#chest-supported-row-m-mf-foot.l\" fill=\"#000\"/><use href=\"#chest-supported-row-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#chest-supported-row-m-mf-upper.l\" fill=\"#000\"/><use href=\"#chest-supported-row-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#chest-supported-row-m-mf-fore.l\" fill=\"#000\"/><use href=\"#chest-supported-row-m-mf-fist.l\" fill=\"#000\"/><use href=\"#chest-supported-row-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#chest-supported-row-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#chest-supported-row-m-mf-shank.r\" fill=\"#000\"/><use href=\"#chest-supported-row-m-mf-foot.r\" fill=\"#000\"/><use href=\"#chest-supported-row-m-m-shcap.r\" fill=\"#000\"/><use href=\"#chest-supported-row-m-m-upper.r\" fill=\"#000\"/><use href=\"#chest-supported-row-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#chest-supported-row-m-m-fore.r\" fill=\"#000\"/><use href=\"#chest-supported-row-m-m-fist.r\" fill=\"#000\"/><use href=\"#chest-supported-row-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chest-supported-row-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#chest-supported-row-m-mmask)\"><g class=\"u-stroke\"><use href=\"#chest-supported-row-m-m-head\"/><use href=\"#chest-supported-row-m-m-torso\"/><use href=\"#chest-supported-row-m-m-shcap.r\"/><use href=\"#chest-supported-row-m-m-upper.r\"/><use href=\"#chest-supported-row-m-m-elbowcap.r\"/><use href=\"#chest-supported-row-m-m-fore.r\"/><use href=\"#chest-supported-row-m-m-fist.r\"/><use href=\"#chest-supported-row-m-m-eq0\"/><use href=\"#chest-supported-row-m-m-eq1\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MNPoFVtLBH7Aw1MFm)lLEmwmLSR1-6\"/><path class=\"m-arrow\" d=\"~MNErFXB1LFw40\"/><path class=\"m-arrow\" d=\"~MNErYzD1L0)o\"/><path class=\"m-arrow\" d=\"~MWEvYzD1L0)o\"/><path class=\"m-arrow\" d=\"~MJHjYJN1LFH30M)oYiLwpXiL)R10\"/><path class=\"leader m\" d=\"~MFYiJRrL.y5I6\"/><path class=\"leader m\" d=\"M121.94 243.56L91.77 238H81.77\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"chest-supported-row-m-lean\" data-key=\"lean\" data-cue=\"The trunk leans back and the chest leaves the pad to finish the pull.\" class=\"plate-callout two m\" style=\"left:2.79%;top:32.96%\" aria-pressed=\"true\">Leaning<br>back</button><button type=\"button\" id=\"chest-supported-row-m-arch\" data-key=\"arch\" data-cue=\"The low back arches to heave the handles in.\" class=\"plate-callout two m\" style=\"left:2.79%;top:60.34%\" aria-pressed=\"false\">Low back<br>arched</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "chest",
        cues: [{ key: "chest", cue: "Keep the chest lightly on the pad from the first rep to the last." }, { key: "elbows", cue: "Each rep ends with the elbows close to the ribs and just behind the body." }, { key: "shoulders", cue: "Shoulders drawn back and down before the pull and kept there." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "lean",
        cues: [{ key: "lean", cue: "The trunk leans back and the chest leaves the pad to finish the pull." }, { key: "arch", cue: "The low back arches to heave the handles in." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Leaning back</b><span>The trunk leans back and the chest leaves the pad to finish the pull.</span></li><li><b>Low back arched</b><span>The low back arches to heave the handles in.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 2 seconds, hold 1 second, return 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div></div>",
      alt: "Chest-supported row, side view. Seated upright with the chest on an upright pad and the feet flat, the lifter pulls lever handles from straight arms at about shoulder height back until the elbows pass the sides, chest kept on the pad.",
      mistakeAlt: "Chest-Supported Row: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "pull",
    "why": "D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c3 and c4.",
    "orientation": "neutral",
    "handle": "machine-grip",
    "width": {
      "text": "Set by the machine.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-row-machine"
        ],
        "note": "c1"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "pull-default"
        ],
        "note": "card grip.thumb: the pull archetype default, no exercise-specific source; golden B's pull default, not a card claim, never shown"
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        0
      ],
      "limitText": "Keep your wrists in line with your forearms all set.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-row-machine"
        ],
        "note": "c3"
      }
    },
    "faults": [],
    "gripLine": "Take the handles with straight arms. Keep your wrists in line with your forearms.",
    "cue": "Chest on the pad."
  },
  contacts: [
    "brace-pad"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set the seat so the handles sit about level with your shoulders.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-row-machine"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Plant your feet on the floor or the foot pads.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-row-machine"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "adjust",
      "text": "Set the chest pad to touch your chest lightly, arms straight.",
      "zoom": "chest-pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-row-machine"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "brace",
      "text": "Sit tall, shoulders back and down, wrists straight.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-row-machine"
        ],
        "note": "c3"
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
        "note": "c13"
      }
    }
  ],
  posture: [
    {
      "key": "upright",
      "label": "Trunk upright",
      "detail": "Trunk upright and still.",
      "anchor": {
        "at": "backUpper",
        "pose": "end"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-row-machine"
        ],
        "note": "c7"
      }
    },
    {
      "key": "chest",
      "label": "Chest on pad",
      "detail": "Chest lightly on the pad the whole set.",
      "anchor": {
        "at": "chest",
        "pose": "end"
      },
      "zoom": "chest-pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-row-machine"
        ],
        "note": "c4"
      }
    },
    {
      "key": "elbows",
      "label": "Elbows close",
      "detail": "Elbows travel back close to your sides.",
      "anchor": {
        "at": "elbow.r",
        "pose": "end"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-row-machine"
        ],
        "note": "c4"
      }
    },
    {
      "key": "finish",
      "label": "Elbows past sides",
      "detail": "Each rep ends with the elbows just past your sides. Pause briefly.",
      "anchor": {
        "at": "elbow.r",
        "pose": "end"
      },
      "zoom": "elbow-finish",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-row-machine"
        ],
        "note": "c5"
      }
    },
    {
      "key": "return",
      "label": "Slow return",
      "detail": "Return slowly until your arms are straight. Shoulder blades stay back.",
      "anchor": {
        "at": "shoulderTop.r",
        "pose": "start"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-row-machine"
        ],
        "note": "c7"
      }
    },
    {
      "key": "wrists",
      "label": "Straight wrists",
      "detail": "Wrists in line with your forearms all set.",
      "anchor": {
        "at": "grip.r",
        "pose": "end"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-row-machine"
        ],
        "note": "c3"
      }
    }
  ],
  zooms: [
    {
      "key": "chest-pad",
      "chip": "Chest pad",
      "heading": "Chest on pad",
      "kind": "posture",
      "feelRow": "low-back"
    },
    {
      "key": "elbow-finish",
      "chip": "Elbows",
      "heading": "Elbow finish",
      "kind": "posture"
    }
  ],
  chips: [
    "chest-pad",
    "elbow-finish",
    "feel"
  ],
  copy: {
    "setupLine": "Set the seat so the handles sit about level with your shoulders. Chest lightly on the pad.",
    "mistakeLine": "Keep your chest on the pad. Never lean back to finish the pull.",
    "cueLine": "Chest on the pad, elbows back."
  },
  mistakes: [
    {
      "key": "lean",
      "title": "Leaning back off the pad",
      "zoom": "chest-pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-row-machine"
        ],
        "note": "c6, c4"
      },
      "fix": "Keep your chest on the pad. Do not lean back."
    },
    {
      "key": "round",
      "title": "Shoulders rounding forward",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-row-machine"
        ],
        "note": "c7"
      },
      "fix": "Return slowly. Stop when your arms are straight, shoulders still back."
    }
  ],
  risks: [
    {
      "key": "lean",
      "text": "Leaning back and arching adds needless stress to your lower back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-row-machine"
        ],
        "note": "c6"
      }
    },
    {
      "key": "free",
      "text": "A free-weight row measured more lower-back muscle work than a machine row.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "fenwick2009",
          "saeterbakken2015"
        ],
        "note": "c11"
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
    "ace-row-machine",
    "lehman2004",
    "fischer2025",
    "fenwick2009",
    "saeterbakken2015",
    "acsm2009",
    "ga-pull-base",
    "pull-default",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/chest_supported_row.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

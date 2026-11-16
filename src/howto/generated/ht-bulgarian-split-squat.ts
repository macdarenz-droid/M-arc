// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=ad9909e2e2ec77dfdddb1f824af143e2f56ad19b53c19437bbb9ac58d3108ad4
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_bulgarian_split_squat",
  name: "Bulgarian Split Squat",
  hashes: { inputsSha256: "ad9909e2e2ec77dfdddb1f824af143e2f56ad19b53c19437bbb9ac58d3108ad4", golden: "ed5d55d44cdd2b85456d7d54c892e4465fc676de702f4cbf27f74d740c0350aa" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"bulgarian-split-squat-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"bulgarian-split-squat-n-st-thigh.l\" d=\"~#F12PKx1P-I1*Kw1KWH1R8E8vq_F1WO12.97-4EuVI1B4-pEc)f-n-aGy1TF1O4K1R9T2Jz1(T1unT5Oa)vU9N7_K1!lPsDH1Dj01000000001101012001000000111100001111100200001110100011002100100002000000001000\"/><path id=\"bulgarian-split-squat-n-st-kneecap.l\" d=\"~~!IG1AyU1_J10\"/><path id=\"bulgarian-split-squat-n-st-shank.l\" d=\"~#F12wVH1!TS1IAJ1.TS1(bs2F1I(1_9H8H5A4P2Py2z9AeF6(btydI8wz2R1Y3x3J7R6B)143E1WbX2Vc-bVpGbTlY1RnDf00000000000101001002001000100200000200000000000000101000000002000010100022000020\"/><path id=\"bulgarian-split-squat-n-st-shcap.l\" d=\"~~ARy1J.swP10\"/><path id=\"bulgarian-split-squat-n-st-upper.l\" d=\"~#F12ARy1J.sxSy1TXre)8a2J2SO1D3*5N1*2_5RD1waVi0OgxaViX5RD1K1*2B3*5I2SO172f)8EgvTdPp1PmYdPp12100102000000002000022000021000100012000012000000002000221100021000001010000000\"/><path id=\"bulgarian-split-squat-n-st-elbowcap.l\" d=\"~~!*y1wBD1Dz10\"/><path id=\"bulgarian-split-squat-n-st-fore.l\" d=\"~#F12J!y1SED1I*y1IIB1uIauY1N6DI1(2T9N1K2-1*w1!5BdnEbX7EcV2*w1-1z2B4z9fSI1h(1K2zazaiz9FkD1Dh_bYi00000100010000000000000000100001000001010012101011110100200000000110001001000100\"/><path id=\"bulgarian-split-squat-n-st-fist.l\" d=\"~~(Wz1H*O1ww10\"/><path id=\"bulgarian-split-squat-n-st-head\" d=\"~#w12!RA1_.iE)y1OOiBkAiVjS8)aX3K3U4I4G8I7ObKgInN5Kcx1X9Bjvwn)9UmB5WkF4FiwhO2yj0210000100000001002101020000111012000101000000000000001200002010\"/><path id=\"bulgarian-split-squat-n-st-torso\" d=\"~#_12(-y1ARn*Bz1GzmE9.6E33Y8wiD9(6(bWgN68B5Eo.lB9xdA4Dg*3AlG5DnXeSiXgF5E9z7KgIpTA1V9VrK69T9hwcWg_2A8KcT8IgA7K7Nkw6Y6JdRa_2D8-U2Ur00000000022000101000002001000021010010100000000002012000100101010000001010010101210001001001000000001000000000000200\"/><path id=\"bulgarian-split-squat-n-st-thigh.r\" d=\"~#F12HFx1YRI1EKw1zIH1O7B9x1kYy1FU1D1X9eX4-ozO1vxqEaIhGmTdxtOJ1K4*1x9X3YsYX1A1hK4xb.w1U5!1JN1Di(uUE1Ao10002000010001002000021010000000000100200210100000010000020000000020000101100000\"/><path id=\"bulgarian-split-squat-n-st-kneecap.r\" d=\"~~NAF1W!U1_J10\"/><path id=\"bulgarian-split-squat-n-st-shank.r\" d=\"~#F12HDF1JNV1VXE1GxU1*2RbF1fPsHY1P2O9y1X4xtK!1S1IfR4xb)b-9zmG)1)3R2R8x5SjA!1z1eB6BaK7WfX2_rF8AkWlYh20100020000000000000000000000000000000000000200000020000000000101000200200020002\"/><path id=\"bulgarian-split-squat-n-st-foot.r\" d=\"~#o2_HK1AB)1K!K1zB(1_cF3Uhx8Up)nS-2B3-J2-4ID1)7xo2OG1Y4Eb-cYsBbGmSp120002012120000111001000101200002101101000010110\"/><path id=\"bulgarian-split-squat-n-st-shcap.r\" d=\"^3\"/><path id=\"bulgarian-split-squat-n-st-upper.r\" d=\"^4\"/><path id=\"bulgarian-split-squat-n-st-elbowcap.r\" d=\"^5\"/><path id=\"bulgarian-split-squat-n-st-fore.r\" d=\"^6\"/><path id=\"bulgarian-split-squat-n-st-fist.r\" d=\"^7\"/><path id=\"bulgarian-split-squat-n-g0-eq2.dumbbell.1-0\" d=\"~MASy1FGR1LEK10QI90!z1J9LJ9Ay2Q0J9J9zy2L!z1I9QJ90.z1I9LI9zy2Q0I9I9Ay2Z\"/><path id=\"bulgarian-split-squat-n-g0-eq2.dumbbell.2-1\" d=\"~MY.D1PEU1LFK10QJ90.z1I9LI9zy2Q0I9I9Ay2L.z1J9QI90!z1J9LJ9Ay2Q0J9J9zy2Z\"/><path id=\"bulgarian-split-squat-n-g0-thigh.l\" d=\"~#F12(Jx1YTN1-Kw1EPK1K8K8x1qHF1DP14.95X4VtzJ1.3-pzcEgTn)aXx1xG1T4O1K9X2Wy1JU1y1nT5Oaxw1D9!6!K1PlYswH1Wj00000100000000200010122000010101100220022000001000000000000010111101000100000000\"/><path id=\"bulgarian-split-squat-n-g0-kneecap.l\" d=\"~~AFG1ywX1_J10\"/><path id=\"bulgarian-split-squat-n-g0-shank.l\" d=\"~#F12H!H1FSV1IHJ1O*V1NbW37F1*(1G5_6F7P3H3Uy2(6JcN9_b!1Sex5Sx2NeH4z2Y8T4K*1.e6B1wc2O9ReGm*gIlO3OqD910000000100100100201010000200000011010000210100000001010000100210100000020001001\"/><path id=\"bulgarian-split-squat-n-g0-head\" d=\"~#w12!RA1!WlE)y1THlBkDiVjU8)a.3K3W4I4E8I7TbKgEnN5Rcx1T9Bjx1wn)9UmB5WkF4FiwhO2yj0010000000000000022000000002101010000001010000000100001001002010\"/><path id=\"bulgarian-split-squat-n-g0-torso\" d=\"~#_12(-y1DJq*Bz1I(oE9.6E35Y8AiD9!6(bUgN6cB5Go.lB9xdA4Dg*3AlG5Dn-eSiTgF5I9z7IgIpRA1V9XrK6bT9dwcSg_2F8KcX8IgD7K7Pkw6U6JdKa_2A8-U2Ur00000000002000101101002000000121010010110100000000002000100002000000011011000001210200011000020200011000020000000001\"/><path id=\"bulgarian-split-squat-n-g0-thigh.r\" d=\"~#F12!)x1YBO1VWw1-NN1Xa*4nw1AW1(vB3G9X1K4XH1VvGc*m-gGb*pK2TK1Kr-46-9gFS1_B1mx1-8x8xrJjYl(F1!twkFN1N410000210000000000000000000001210000002100002000001020010110101000101000000200001\"/><path id=\"bulgarian-split-squat-n-g0-kneecap.r\" d=\"~~WzJ1P)T1_J10\"/><path id=\"bulgarian-split-squat-n-g0-shank.r\" d=\"~#F12DyJ1FyU1BzJ1*SS1A1-bF13S8U(1P5E8S2x4X7Vy2S6)dn*bz8zd3zz2)2-3K6K7z1A)1G12K2VbzcNc-bNpH1UlWe(n01000000000220200100201100000002100200002100001010000000002000020000000000000001\"/><path id=\"bulgarian-split-squat-n-g0-foot.r\" d=\"^13\"/><path id=\"bulgarian-split-squat-n-g0-eq3.dumbbell.1-0\" d=\"^14\"/><path id=\"bulgarian-split-squat-n-g0-eq3.dumbbell.2-1\" d=\"^15\"/><path id=\"bulgarian-split-squat-n-g0-shcap.r\" d=\"~~ARy1NWvwP10\"/><path id=\"bulgarian-split-squat-n-g0-upper.r\" d=\"~#F12ARy1NWvxSy1XSue.8a1J2WO1D3)5N1*2_5RD1waVi0OgxaViX5RD1K1*2B3)5I2WO171f.8Egx1TdPp1PmYdPp10120000000200002000002101001000100010010110000000002200201002001000001010000000\"/><path id=\"bulgarian-split-squat-n-g0-elbowcap.r\" d=\"~~!*y1ywG1Dz10\"/><path id=\"bulgarian-split-squat-n-g0-fore.r\" d=\"~#F12J!y1UyG1I*y1ODF1uGau_1N6yI1(2O9N1O2-1*w1!5EdnBbX7EcV2.w1-1E2B4x9fUI1h!1K2zazagz9HkD1Dh_b_i01000000000000000000000101110000000200000210101010120000210000010010001000000001\"/><path id=\"bulgarian-split-squat-n-g0-fist.r\" d=\"~~(Wz1JYS1ww10\"/><path id=\"bulgarian-split-squat-n-g1-eq2.dumbbell.1-0\" d=\"~MASy1HAU1LEK10QI90!z1J9LJ9yy2Q0J9J9xy2L!z1I9QJ90.z1I9LI9xy2Q0I9I9yy2Z\"/><path id=\"bulgarian-split-squat-n-g1-eq2.dumbbell.2-1\" d=\"~MY.D1PyX1LFK10QJ90.z1I9LI9xy2Q0I9I9yy2L.z1J9QI90!z1J9LJ9yy2Q0J9J9xy2Z\"/><path id=\"bulgarian-split-squat-n-g1-thigh.l\" d=\"~#F12yFx1JER1EKw1RwP1K7E9z1kPy1PU1F1X9cX4KoGO1rxqxaKhEmXd-sXJ1I4*1x9-3JswY1A1jG4zb*w1P5S1HN1wiAvNE1Ho00000010000020200000000101100000200001000110020001000020010100000001210000101100\"/><path id=\"bulgarian-split-squat-n-g1-kneecap.l\" d=\"~~DyF1yU_1_J10\"/><path id=\"bulgarian-split-squat-n-g1-shank.l\" d=\"~#F12yAH1YH-1KJI1Rz_1W9w7hy1G_1BoH4!8F2D4J*1Ar_8WcWaN5Nf9w_1Yx1Y4lW9V1.V1)w1ix1JbY3T4Xg)fxnGj-9)rk01000000002002200001200000000000000000200000001010010000000000100010000022020001\"/><path id=\"bulgarian-split-squat-n-g1-head\" d=\"~#w12!RA1(RoE)y1VBoBkDiVjS8)aX3K3U4I4E8I7TbKgEnN5Rcx1V9Bjvwn*9UmG5WkH4FiwhO2Aj0010000000000000002001000100101110000000020000010100001200002010\"/><path id=\"bulgarian-split-squat-n-g1-torso\" d=\"~#_12(-y1DEt*Bz1I-rE9.6E33Y8wiD9(6(bWgN68B5Eo.lB9xdD4Dgx4AlB5Dn.eSiVgF5E9z7KgIpTA1V9VrK69T9hwcWg_2A8KcT8IgA7K7Nkw6Y6JdRa_2D8-U2Ur00000000022000101000002001020020000010110102000100012000100101000000001210010100200000001000000000001000000000000200\"/><path id=\"bulgarian-split-squat-n-g1-thigh.r\" d=\"~#F12WRy1SGS1*zx1**R1Xbx2bD1N!1(gK5B8-2.3RR1OjVhBjBjK6VpD4zT1XeT4J1I9A3H_1PncB1RaO5ElYpUv!x1wy1WbYK1T700001000001111002000001012002002000020000000101000200001011000120000010002000000\"/><path id=\"bulgarian-split-squat-n-g1-kneecap.r\" d=\"~~WPK1N)T1_J10\"/><path id=\"bulgarian-split-squat-n-g1-shank.r\" d=\"~#F12AOK1!!T1OVK1*KS1P2VbD12J1A)1N6O7(2X31zz2A8zdk)bO6xeN7Ry2R2z4O5B8G8U(1G13z1-bKd!aTe(nB1Wl_bJp00200010100020000200000000002000110101101010100000000010100000000101000000101000\"/><path id=\"bulgarian-split-squat-n-g1-foot.r\" d=\"~#o2_HK1DB)1K!K1EB(1_cF3Uh*7UpxoS-2B3-J2-4ID1)7xo0OG1!4Eb.cYsBbGmUp100002002020000111001000101000022001101000000011\"/><path id=\"bulgarian-split-squat-n-g1-eq3.dumbbell.1-0\" d=\"^29\"/><path id=\"bulgarian-split-squat-n-g1-eq3.dumbbell.2-1\" d=\"^30\"/><path id=\"bulgarian-split-squat-n-g1-shcap.r\" d=\"~~ARy1PRy1wP10\"/><path id=\"bulgarian-split-squat-n-g1-upper.r\" d=\"~#F12ARy1PRy1xSy1-Kx1e.8a1J2UO1D3.5N1x3_5KD1wa-i0Igxa-iX5KD1K1x3B3.5I2UO171f.8Egz1TdUp1JmYdUp10100000010000022000002000001100100110000010000002002001201000001100001010000001\"/><path id=\"bulgarian-split-squat-n-g1-elbowcap.r\" d=\"~~!*y1y.I1Dz10\"/><path id=\"bulgarian-split-squat-n-g1-fore.r\" d=\"~#F12J!y1U*I1I*y1KxI1uIau_1N6yI1(2R9N1K2-1*w1!5BdnEbX7EcV2.w1-1E2B4x9fSI1h(1K2zazaiz9FkD1Dh_bYi00000000000101000000000000100001000000000010111111110100200000000010001000000100\"/><path id=\"bulgarian-split-squat-n-g1-fist.r\" d=\"~~(Wz1JTV1ww10\"/><path id=\"bulgarian-split-squat-n-e-thigh.l\" d=\"~#F12N)w1HJT1VRw1z)R1G4BbB1cYgN!1A4.8(1K4*8OU1D7xpI4Xj*g-j-dIT1R3E3O7I6yaw(1A17l.b)w1.4VcUJ1W7Az1AuDz102010000020111100001010001000000100000000010100200200002100002000002202002000020\"/><path id=\"bulgarian-split-squat-n-e-kneecap.l\" d=\"~~NRA1!_(1_J10\"/><path id=\"bulgarian-split-squat-n-e-shank.l\" d=\"~#F12DzE1_(*1V!E1VD)1U5Navq*G1EO10!98_4JI1AT1P2FfD7P9yeP6PB1SX1S4P1S9U2By1xV1unU8H8A3zhI4TrzdGhOpTb01011010020000020022000200002000000200010000000020021000100001001012000000020020\"/><path id=\"bulgarian-split-squat-n-e-foot.l\" d=\"~#o2AYvHXV1TTvR.W1zdY1Idwe.e_v*R2FA1yG2zoUD1-6Fm.8!A1*jDfY7TmylFbxw1000100100200002000010000001000000000000111001000\"/><path id=\"bulgarian-split-squat-n-e-shcap.l\" d=\"~~ARy1PJB1wP10\"/><path id=\"bulgarian-split-squat-n-e-upper.l\" d=\"~#F12ARy1PJB1xSy1XFA1e)8a2J2SO1D3*5N1*2_5RD1waVi0OgxaViX5RD1K1*2B3*5I2SO172f)8EgvTdPp1PmYdPp10100100000001002000002101001000100010010110000000012000201100001000001010000000\"/><path id=\"bulgarian-split-squat-n-e-elbowcap.l\" d=\"~~!*y1AWN1Dz10\"/><path id=\"bulgarian-split-squat-n-e-fore.l\" d=\"~#F12J!y1WYN1I*y1O!K1uKau!1N6AI1(2T9N1K2-1*w1!5EdnBbX7EcV2.w1-1E2B4x9fUI1h!1K2zazagz9HkD1Dh_b_i01010102000200000100000000100000020200000210101010120000200000010010001200000000\"/><path id=\"bulgarian-split-squat-n-e-fist.l\" d=\"~~(Wz1NNY1ww10\"/><path id=\"bulgarian-split-squat-n-e-head\" d=\"~#w12!RA1(JrE)y1VwrBkDiVjU8)a.3K3W4I4E8I7TbKgEnN5Rcx1T9Bjx1wn)9UmB5WkF4FiwhO2yj0012000002000000022200000002101010000001010000000000001000002010\"/><path id=\"bulgarian-split-squat-n-e-torso\" d=\"~#_12(-y1Fyw1*Bz1KUuE9.6E35Y8AiD9!6(bUgN6cB5Go.lB9xdA4Dg*3AlG5Dn-eSiTgF5I9z7IgIpRA1V9XrK6bT9dwcSg_2F8KcX8IgF7K7Jkw6W6JdKa_2A8-U2Ur00000000002000101000002200000021010010100000000000002200100002000000001010000001210200011000020001011000020000000001\"/><path id=\"bulgarian-split-squat-n-e-thigh.r\" d=\"~#F12Dzz1JFV1)Tx1VEV1.bo3D1_(1P2G7V6T3x3TU1T7XlKezk.1xoyazV1O2B4H2G8H5y(1H94B1Rb)2TewuSD1WpYz1N3YH1)h20020000000000100000000000001002000101000111000000111110000000000200100000100001\"/><path id=\"bulgarian-split-squat-n-e-kneecap.r\" d=\"~~(zN1yxU1_J10\"/><path id=\"bulgarian-split-squat-n-e-shank.r\" d=\"~#F12SyN1D!T1EIN1TKS1y3RbF16X1y)1Y6B7A3T3H3)y2W8XcF1*b.5GeYazy2G2E4B5O8GbD(1G15h*b*dHa-fAnB2UlPa(p00200000200001000000000000000000000000020010111110000001110000000000000002100000\"/><path id=\"bulgarian-split-squat-n-e-foot.r\" d=\"~#o2_HK1DB)1K!K1EB(1_cF3Uh)7Up*nS-2E3-J2-4ID1)7xo0OG1_4EbXcYsEbGmUp100002002220020011011000101000002000121000000011\"/><path id=\"bulgarian-split-squat-n-e-shcap.r\" d=\"^49\"/><path id=\"bulgarian-split-squat-n-e-upper.r\" d=\"^50\"/><path id=\"bulgarian-split-squat-n-e-elbowcap.r\" d=\"^51\"/><path id=\"bulgarian-split-squat-n-e-fore.r\" d=\"^52\"/><path id=\"bulgarian-split-squat-n-e-fist.r\" d=\"^53\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#bulgarian-split-squat-n-dots)\"/>\n  <path class=\"floorline\" d=\"M86.35 339.5H306.51\"/><path class=\"eq\" d=\"~M!*lU*X1LAX60Qwp0z(5)oL)oAkQ0)o)ozkLz(5wpQ)o0A(5wpLwpzkQ0wpwpAkZ\"/><path class=\"eq\" d=\"~MwNoSRY1L0PT8Q0F6F6EK8LAA1E6QF60zA1E6LE6EK8Q0E6E6FK8LzA1F6QE60AA1F6Z\"/><path class=\"eq\" d=\"~MSDjYDy2LYBc0QF60O)bE6LE6V8Q0E6E6W8LO)bF6QE60P)bF6LF6W8Q0F6F6V8Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-st-thigh.l\"/><use href=\"#bulgarian-split-squat-n-st-kneecap.l\"/><use href=\"#bulgarian-split-squat-n-st-shank.l\"/><use href=\"#bulgarian-split-squat-n-st-shcap.l\"/><use href=\"#bulgarian-split-squat-n-st-upper.l\"/><use href=\"#bulgarian-split-squat-n-st-elbowcap.l\"/><use href=\"#bulgarian-split-squat-n-st-fore.l\"/><use href=\"#bulgarian-split-squat-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-st-thigh.l\"/><use href=\"#bulgarian-split-squat-n-st-kneecap.l\"/><use href=\"#bulgarian-split-squat-n-st-shank.l\"/><use href=\"#bulgarian-split-squat-n-st-shcap.l\"/><use href=\"#bulgarian-split-squat-n-st-upper.l\"/><use href=\"#bulgarian-split-squat-n-st-elbowcap.l\"/><use href=\"#bulgarian-split-squat-n-st-fore.l\"/><use href=\"#bulgarian-split-squat-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-st-head\"/><use href=\"#bulgarian-split-squat-n-st-torso\"/><use href=\"#bulgarian-split-squat-n-st-thigh.r\"/><use href=\"#bulgarian-split-squat-n-st-kneecap.r\"/><use href=\"#bulgarian-split-squat-n-st-shank.r\"/><use href=\"#bulgarian-split-squat-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-st-head\"/><use href=\"#bulgarian-split-squat-n-st-torso\"/><use href=\"#bulgarian-split-squat-n-st-thigh.r\"/><use href=\"#bulgarian-split-squat-n-st-kneecap.r\"/><use href=\"#bulgarian-split-squat-n-st-shank.r\"/><use href=\"#bulgarian-split-squat-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-st-shcap.r\"/><use href=\"#bulgarian-split-squat-n-st-upper.r\"/><use href=\"#bulgarian-split-squat-n-st-elbowcap.r\"/><use href=\"#bulgarian-split-squat-n-st-fore.r\"/><use href=\"#bulgarian-split-squat-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-st-shcap.r\"/><use href=\"#bulgarian-split-squat-n-st-upper.r\"/><use href=\"#bulgarian-split-squat-n-st-elbowcap.r\"/><use href=\"#bulgarian-split-squat-n-st-fore.r\"/><use href=\"#bulgarian-split-squat-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-solid\" d=\"~MD*y1wET1LPT30QF60EK3E6LE6OaQ0E6E6PaLEK3F6QE60FK3F6LF6PaQ0F6F6OaZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-g0-eq2.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-n-g0-eq2.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-g0-eq2.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-n-g0-eq2.dumbbell.2-1\"/></g></g><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-g0-thigh.l\"/><use href=\"#bulgarian-split-squat-n-g0-kneecap.l\"/><use href=\"#bulgarian-split-squat-n-g0-shank.l\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-g0-thigh.l\"/><use href=\"#bulgarian-split-squat-n-g0-kneecap.l\"/><use href=\"#bulgarian-split-squat-n-g0-shank.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-g0-head\"/><use href=\"#bulgarian-split-squat-n-g0-torso\"/><use href=\"#bulgarian-split-squat-n-g0-thigh.r\"/><use href=\"#bulgarian-split-squat-n-g0-kneecap.r\"/><use href=\"#bulgarian-split-squat-n-g0-shank.r\"/><use href=\"#bulgarian-split-squat-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-g0-head\"/><use href=\"#bulgarian-split-squat-n-g0-torso\"/><use href=\"#bulgarian-split-squat-n-g0-thigh.r\"/><use href=\"#bulgarian-split-squat-n-g0-kneecap.r\"/><use href=\"#bulgarian-split-squat-n-g0-shank.r\"/><use href=\"#bulgarian-split-squat-n-g0-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^64\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-g0-eq3.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-n-g0-eq3.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-g0-eq3.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-n-g0-eq3.dumbbell.2-1\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-g0-shcap.r\"/><use href=\"#bulgarian-split-squat-n-g0-upper.r\"/><use href=\"#bulgarian-split-squat-n-g0-elbowcap.r\"/><use href=\"#bulgarian-split-squat-n-g0-fore.r\"/><use href=\"#bulgarian-split-squat-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-g0-shcap.r\"/><use href=\"#bulgarian-split-squat-n-g0-upper.r\"/><use href=\"#bulgarian-split-squat-n-g0-elbowcap.r\"/><use href=\"#bulgarian-split-squat-n-g0-fore.r\"/><use href=\"#bulgarian-split-squat-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-solid\" d=\"~MD*y1wyW1LPT30QF60EK3E6LE6OaQ0E6E6PaLEK3F6QE60FK3F6LF6PaQ0F6F6OaZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-g1-eq2.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-n-g1-eq2.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-g1-eq2.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-n-g1-eq2.dumbbell.2-1\"/></g></g><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-g1-thigh.l\"/><use href=\"#bulgarian-split-squat-n-g1-kneecap.l\"/><use href=\"#bulgarian-split-squat-n-g1-shank.l\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-g1-thigh.l\"/><use href=\"#bulgarian-split-squat-n-g1-kneecap.l\"/><use href=\"#bulgarian-split-squat-n-g1-shank.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-g1-head\"/><use href=\"#bulgarian-split-squat-n-g1-torso\"/><use href=\"#bulgarian-split-squat-n-g1-thigh.r\"/><use href=\"#bulgarian-split-squat-n-g1-kneecap.r\"/><use href=\"#bulgarian-split-squat-n-g1-shank.r\"/><use href=\"#bulgarian-split-squat-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-g1-head\"/><use href=\"#bulgarian-split-squat-n-g1-torso\"/><use href=\"#bulgarian-split-squat-n-g1-thigh.r\"/><use href=\"#bulgarian-split-squat-n-g1-kneecap.r\"/><use href=\"#bulgarian-split-squat-n-g1-shank.r\"/><use href=\"#bulgarian-split-squat-n-g1-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^65\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-g1-eq3.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-n-g1-eq3.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-g1-eq3.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-n-g1-eq3.dumbbell.2-1\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-g1-shcap.r\"/><use href=\"#bulgarian-split-squat-n-g1-upper.r\"/><use href=\"#bulgarian-split-squat-n-g1-elbowcap.r\"/><use href=\"#bulgarian-split-squat-n-g1-fore.r\"/><use href=\"#bulgarian-split-squat-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-g1-shcap.r\"/><use href=\"#bulgarian-split-squat-n-g1-upper.r\"/><use href=\"#bulgarian-split-squat-n-g1-elbowcap.r\"/><use href=\"#bulgarian-split-squat-n-g1-fore.r\"/><use href=\"#bulgarian-split-squat-n-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-solid\" d=\"~MD*y1y*Y1LPT30QF60EK3E6LE6OaQ0E6E6PaLEK3F6QE60FK3F6LF6PaQ0F6F6OaZ\"/><path class=\"disc\" d=\"~MASy1H)W1LEK10QI90!z1J9LJ9Ay2Q0J9J9zy2L!z1I9QJ90.z1I9LI9zy2Q0I9I9Ay2Z\"/><path class=\"disc\" d=\"~MY.D1S*-1LFK10QJ90.z1I9LI9zy2Q0I9I9Ay2L.z1J9QI90!z1J9LJ9Ay2Q0J9J9zy2Z\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-e-thigh.l\"/><use href=\"#bulgarian-split-squat-n-e-kneecap.l\"/><use href=\"#bulgarian-split-squat-n-e-shank.l\"/><use href=\"#bulgarian-split-squat-n-e-foot.l\"/><use href=\"#bulgarian-split-squat-n-e-shcap.l\"/><use href=\"#bulgarian-split-squat-n-e-upper.l\"/><use href=\"#bulgarian-split-squat-n-e-elbowcap.l\"/><use href=\"#bulgarian-split-squat-n-e-fore.l\"/><use href=\"#bulgarian-split-squat-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-e-thigh.l\"/><use href=\"#bulgarian-split-squat-n-e-kneecap.l\"/><use href=\"#bulgarian-split-squat-n-e-shank.l\"/><use href=\"#bulgarian-split-squat-n-e-foot.l\"/><use href=\"#bulgarian-split-squat-n-e-shcap.l\"/><use href=\"#bulgarian-split-squat-n-e-upper.l\"/><use href=\"#bulgarian-split-squat-n-e-elbowcap.l\"/><use href=\"#bulgarian-split-squat-n-e-fore.l\"/><use href=\"#bulgarian-split-squat-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-e-head\"/><use href=\"#bulgarian-split-squat-n-e-torso\"/><use href=\"#bulgarian-split-squat-n-e-thigh.r\"/><use href=\"#bulgarian-split-squat-n-e-kneecap.r\"/><use href=\"#bulgarian-split-squat-n-e-shank.r\"/><use href=\"#bulgarian-split-squat-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-e-head\"/><use href=\"#bulgarian-split-squat-n-e-torso\"/><use href=\"#bulgarian-split-squat-n-e-thigh.r\"/><use href=\"#bulgarian-split-squat-n-e-kneecap.r\"/><use href=\"#bulgarian-split-squat-n-e-shank.r\"/><use href=\"#bulgarian-split-squat-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^66\"/><path class=\"disc\" d=\"^67\"/><path class=\"disc\" d=\"^68\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-n-e-shcap.r\"/><use href=\"#bulgarian-split-squat-n-e-upper.r\"/><use href=\"#bulgarian-split-squat-n-e-elbowcap.r\"/><use href=\"#bulgarian-split-squat-n-e-fore.r\"/><use href=\"#bulgarian-split-squat-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-n-e-shcap.r\"/><use href=\"#bulgarian-split-squat-n-e-upper.r\"/><use href=\"#bulgarian-split-squat-n-e-elbowcap.r\"/><use href=\"#bulgarian-split-squat-n-e-fore.r\"/><use href=\"#bulgarian-split-squat-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"184.5\" cy=\"191.44\" r=\"2.25\"/><circle class=\"joint\" cx=\"184.5\" cy=\"239.06\" r=\"2.25\"/><circle class=\"joint\" cx=\"180.88\" cy=\"260.47\" r=\"2.25\"/><circle class=\"joint\" cx=\"243.32\" cy=\"266.41\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#Y10PHz1w(I1OHz1GYI10000000002010000000000000000000000000000000000000000000000020002000200020000010101000100010001000100010001000100010000000000000000000000000000000000000000020002000200\"/><path class=\"arrow\" d=\"~MPHz1_yS1LXiOB1LFY1PB1Z\"/></g><path class=\"leader\" d=\"M156.21 271.57L151.18 240H141.18\"/><circle class=\"anchor\" cx=\"156.21\" cy=\"271.57\" r=\"1.5\"/><path class=\"leader\" d=\"~MUEU1AVx2L0T)1\"/><circle class=\"anchor\" cx=\"267.46\" cy=\"336.18\" r=\"1.5\"/><path class=\"leader\" d=\"M165.42 203.26L159.44 190H149.44\"/><circle class=\"anchor\" cx=\"165.42\" cy=\"203.26\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"bulgarian-split-squat-n-foot\" data-key=\"foot\" data-cue=\"Rest the top of the rear foot on a bench about knee height.\" class=\"plate-callout two\" style=\"left:22.35%;top:60.89%\" aria-pressed=\"true\">Foot on<br>bench</button><button type=\"button\" id=\"bulgarian-split-squat-n-stance\" data-key=\"stance\" data-cue=\"Put the front foot about three foot-lengths ahead of the bench.\" class=\"plate-callout\" style=\"left:70.95%;top:81.84%\" aria-pressed=\"false\">Long stance</button><button type=\"button\" id=\"bulgarian-split-squat-n-back\" data-key=\"back\" data-cue=\"Keep the back straight as the rear knee lowers.\" class=\"plate-callout\" style=\"left:12.29%;top:46.93%\" aria-pressed=\"false\">Back straight</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"bulgarian-split-squat-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"bulgarian-split-squat-m-st-thigh.l\" d=\"^0\"/><path id=\"bulgarian-split-squat-m-st-kneecap.l\" d=\"^1\"/><path id=\"bulgarian-split-squat-m-st-shank.l\" d=\"^2\"/><path id=\"bulgarian-split-squat-m-st-shcap.l\" d=\"^3\"/><path id=\"bulgarian-split-squat-m-st-upper.l\" d=\"^4\"/><path id=\"bulgarian-split-squat-m-st-elbowcap.l\" d=\"^5\"/><path id=\"bulgarian-split-squat-m-st-fore.l\" d=\"^6\"/><path id=\"bulgarian-split-squat-m-st-fist.l\" d=\"^7\"/><path id=\"bulgarian-split-squat-m-st-head\" d=\"^8\"/><path id=\"bulgarian-split-squat-m-st-torso\" d=\"^9\"/><path id=\"bulgarian-split-squat-m-st-thigh.r\" d=\"^10\"/><path id=\"bulgarian-split-squat-m-st-kneecap.r\" d=\"^11\"/><path id=\"bulgarian-split-squat-m-st-shank.r\" d=\"^12\"/><path id=\"bulgarian-split-squat-m-st-foot.r\" d=\"^13\"/><path id=\"bulgarian-split-squat-m-st-shcap.r\" d=\"^3\"/><path id=\"bulgarian-split-squat-m-st-upper.r\" d=\"^4\"/><path id=\"bulgarian-split-squat-m-st-elbowcap.r\" d=\"^5\"/><path id=\"bulgarian-split-squat-m-st-fore.r\" d=\"^6\"/><path id=\"bulgarian-split-squat-m-st-fist.r\" d=\"^7\"/><path id=\"bulgarian-split-squat-m-g0-eq2.dumbbell.1-0\" d=\"^14\"/><path id=\"bulgarian-split-squat-m-g0-eq2.dumbbell.2-1\" d=\"^15\"/><path id=\"bulgarian-split-squat-m-g0-thigh.l\" d=\"^16\"/><path id=\"bulgarian-split-squat-m-g0-kneecap.l\" d=\"^17\"/><path id=\"bulgarian-split-squat-m-g0-shank.l\" d=\"^18\"/><path id=\"bulgarian-split-squat-m-g0-head\" d=\"^19\"/><path id=\"bulgarian-split-squat-m-g0-torso\" d=\"^20\"/><path id=\"bulgarian-split-squat-m-g0-thigh.r\" d=\"^21\"/><path id=\"bulgarian-split-squat-m-g0-kneecap.r\" d=\"^22\"/><path id=\"bulgarian-split-squat-m-g0-shank.r\" d=\"^23\"/><path id=\"bulgarian-split-squat-m-g0-foot.r\" d=\"^13\"/><path id=\"bulgarian-split-squat-m-g0-eq3.dumbbell.1-0\" d=\"^14\"/><path id=\"bulgarian-split-squat-m-g0-eq3.dumbbell.2-1\" d=\"^15\"/><path id=\"bulgarian-split-squat-m-g0-shcap.r\" d=\"^24\"/><path id=\"bulgarian-split-squat-m-g0-upper.r\" d=\"^25\"/><path id=\"bulgarian-split-squat-m-g0-elbowcap.r\" d=\"^26\"/><path id=\"bulgarian-split-squat-m-g0-fore.r\" d=\"^27\"/><path id=\"bulgarian-split-squat-m-g0-fist.r\" d=\"^28\"/><path id=\"bulgarian-split-squat-m-g1-eq2.dumbbell.1-0\" d=\"^29\"/><path id=\"bulgarian-split-squat-m-g1-eq2.dumbbell.2-1\" d=\"^30\"/><path id=\"bulgarian-split-squat-m-g1-thigh.l\" d=\"^31\"/><path id=\"bulgarian-split-squat-m-g1-kneecap.l\" d=\"^32\"/><path id=\"bulgarian-split-squat-m-g1-shank.l\" d=\"^33\"/><path id=\"bulgarian-split-squat-m-g1-head\" d=\"^34\"/><path id=\"bulgarian-split-squat-m-g1-torso\" d=\"^35\"/><path id=\"bulgarian-split-squat-m-g1-thigh.r\" d=\"^36\"/><path id=\"bulgarian-split-squat-m-g1-kneecap.r\" d=\"^37\"/><path id=\"bulgarian-split-squat-m-g1-shank.r\" d=\"^38\"/><path id=\"bulgarian-split-squat-m-g1-foot.r\" d=\"^39\"/><path id=\"bulgarian-split-squat-m-g1-eq3.dumbbell.1-0\" d=\"^29\"/><path id=\"bulgarian-split-squat-m-g1-eq3.dumbbell.2-1\" d=\"^30\"/><path id=\"bulgarian-split-squat-m-g1-shcap.r\" d=\"^40\"/><path id=\"bulgarian-split-squat-m-g1-upper.r\" d=\"^41\"/><path id=\"bulgarian-split-squat-m-g1-elbowcap.r\" d=\"^42\"/><path id=\"bulgarian-split-squat-m-g1-fore.r\" d=\"^43\"/><path id=\"bulgarian-split-squat-m-g1-fist.r\" d=\"^44\"/><path id=\"bulgarian-split-squat-m-e-thigh.l\" d=\"^45\"/><path id=\"bulgarian-split-squat-m-e-kneecap.l\" d=\"^46\"/><path id=\"bulgarian-split-squat-m-e-shank.l\" d=\"^47\"/><path id=\"bulgarian-split-squat-m-e-foot.l\" d=\"^48\"/><path id=\"bulgarian-split-squat-m-e-shcap.l\" d=\"^49\"/><path id=\"bulgarian-split-squat-m-e-upper.l\" d=\"^50\"/><path id=\"bulgarian-split-squat-m-e-elbowcap.l\" d=\"^51\"/><path id=\"bulgarian-split-squat-m-e-fore.l\" d=\"^52\"/><path id=\"bulgarian-split-squat-m-e-fist.l\" d=\"^53\"/><path id=\"bulgarian-split-squat-m-e-head\" d=\"^54\"/><path id=\"bulgarian-split-squat-m-e-torso\" d=\"^55\"/><path id=\"bulgarian-split-squat-m-e-thigh.r\" d=\"^56\"/><path id=\"bulgarian-split-squat-m-e-kneecap.r\" d=\"^57\"/><path id=\"bulgarian-split-squat-m-e-shank.r\" d=\"^58\"/><path id=\"bulgarian-split-squat-m-e-foot.r\" d=\"^59\"/><path id=\"bulgarian-split-squat-m-e-shcap.r\" d=\"^49\"/><path id=\"bulgarian-split-squat-m-e-upper.r\" d=\"^50\"/><path id=\"bulgarian-split-squat-m-e-elbowcap.r\" d=\"^51\"/><path id=\"bulgarian-split-squat-m-e-fore.r\" d=\"^52\"/><path id=\"bulgarian-split-squat-m-e-fist.r\" d=\"^53\"/><path id=\"bulgarian-split-squat-m-m-head\" d=\"~#w12Y*B1yJtzIA1-)sBkDiTjS8xbX3K3U4I4E8K7TbIgGnP5Kcz1X9Bjv(m)9YmB5SkF4JiwhT2Aj0000000000000010100011100101012002100010001000000010100220000001\"/><path id=\"bulgarian-split-squat-m-m-torso\" d=\"~#_12!BA1Hxy1.RA1OTw1G9.6z33U8wiF9(6wcWgJ68B5Eo*lB9)cA4Dg*3DlG5AnXePiXgH5E9z7KgGpTA1-9VrI69R9h(bWgY2A8GcT8KgA7O7Nky6Y6NdRaW2D8VU2Ur00100000020000002020000001100000002000000022000012010000002101000010100020010100001001000011001000100000001010000200\"/><path id=\"bulgarian-split-squat-m-m-thigh.l\" d=\"~#F12JIy1SHU1XRy1X.S1o*bE17)9w(1P7K6S3z3_dKT1wh.jF4Vjz7xp(8OU1*1K4x4.8.gP!1F18H4xb)rEizuHz1V7yz1WcSJ102000101100001010002000100010000100000200011100000001100000000001100000001010000\"/><path id=\"bulgarian-split-squat-m-m-kneecap.l\" d=\"~~_Vw1(-w2_J10\"/><path id=\"bulgarian-split-squat-m-m-shank.l\" d=\"~#F12yOz1PJw2B-z1-_x2W1!bB1a*m-_1K3F9O1S4ynw)1x3DfP3Nb(a(a!fDx2_3(2(7_5TdV*1F1bA5_a!8*eP5KrG6-k-jXj10101001001010000000000000000000000000000000010000000020000010010110010001001100\"/><path id=\"bulgarian-split-squat-m-m-shcap.l\" d=\"~~w*z1UIE1wP10\"/><path id=\"bulgarian-split-squat-m-m-upper.l\" d=\"~#F12w*z1UIE1**z1*ED1e*8c2H2SO1D3.5N1x3Y5KD1ya-i0Igxa-iX5KD1K1x3z3.5K2SO192d*8Bgz1XdUp0JmYdUp00010002201010000011100000000100000100200000010020101000020001000100000020000001\"/><path id=\"bulgarian-split-squat-m-m-elbowcap.l\" d=\"~~_GA1DVP1Dz10\"/><path id=\"bulgarian-split-squat-m-m-fore.l\" d=\"~#F12HFA1YXP1IGA1R.O1y1Iaq_1S6yI1!2R9N1K2.1*w1w6BdpEbX7EcX2*w1X1z2B4z9dSI1j(1O2zaxaiz9FkD1Dh!bYi10000010000101000010101000000001001000100002200001010100001000000100000000000110\"/><path id=\"bulgarian-split-squat-m-m-fist.l\" d=\"~~!yB1PK_1ww10\"/><path id=\"bulgarian-split-squat-m-m-thigh.r\" d=\"~#F12w_A1WEX1BIz1TKX1TbH20H1P(1O6z8R5)3R2EV11OnBbEkuGmJd)U1y5-3(2O7H6Y(1i0G1.bB1EaUv_G1yk!z1X1_E1-n00210100100100000001010101200000000100011000000101100020000000010000020000002002\"/><path id=\"bulgarian-split-squat-m-m-kneecap.r\" d=\"~~DRO1PFU1_J10\"/><path id=\"bulgarian-split-squat-m-m-shank.r\" d=\"~#F12WPO1H(T1V(O1xRS1H4zbF18z9P(1U7I6P3B3ybBy2AaVbU2TbB4*eJiOw2X1K4B4)8OiJ!1E17q)bxfU8IiDlV4DlN7(q02021000000010220000000000011000101111002120000010000000101011121010022000010100\"/><path id=\"bulgarian-split-squat-m-m-foot.r\" d=\"~#o2_HK1DB)1K!K1EB(1_cF3Uh)7Up*nS-2E3-J2-4ID1)7xo0OG1_4EbXcYsEbGmUp100002002220000011011000101000002000121000000011\"/><path id=\"bulgarian-split-squat-m-m-shcap.r\" d=\"^79\"/><path id=\"bulgarian-split-squat-m-m-upper.r\" d=\"^80\"/><path id=\"bulgarian-split-squat-m-m-elbowcap.r\" d=\"^81\"/><path id=\"bulgarian-split-squat-m-m-fore.r\" d=\"^82\"/><path id=\"bulgarian-split-squat-m-m-fist.r\" d=\"^83\"/><path id=\"bulgarian-split-squat-m-m-eq0\" d=\"~MAGA1A!_1LPT30QF60EK3E6LE6OaQ0E6E6PaLEK3F6QE60FK3F6LF6PaQ0F6F6OaZ\"/><path id=\"bulgarian-split-squat-m-m-eq1\" d=\"~My(z1N(Y1LEK10QI90!z1J9LJ9yy2Q0J9J9xy2L!z1I9QJ90.z1I9LI9xy2Q0I9I9yy2Z\"/><path id=\"bulgarian-split-squat-m-m-eq2\" d=\"~MUEF1U!.1LFK10QJ90.z1I9LI9xy2Q0I9I9yy2L.z1J9QI90!z1J9LJ9yy2Q0J9J9xy2Z\"/><path id=\"bulgarian-split-squat-m-m-eq3\" d=\"^88\"/><path id=\"bulgarian-split-squat-m-m-eq4\" d=\"^89\"/><path id=\"bulgarian-split-squat-m-m-eq5\" d=\"^90\"/><path id=\"bulgarian-split-squat-m-mf-foot.l\" d=\"^48\"/><path id=\"bulgarian-split-squat-m-mo-0\" d=\"^54\"/><path id=\"bulgarian-split-squat-m-mo-1\" d=\"^55\"/><path id=\"bulgarian-split-squat-m-mo-2\" d=\"^45\"/><path id=\"bulgarian-split-squat-m-mo-3\" d=\"^46\"/><path id=\"bulgarian-split-squat-m-mo-4\" d=\"^47\"/><path id=\"bulgarian-split-squat-m-mo-5\" d=\"^48\"/><path id=\"bulgarian-split-squat-m-mo-6\" d=\"^49\"/><path id=\"bulgarian-split-squat-m-mo-7\" d=\"^50\"/><path id=\"bulgarian-split-squat-m-mo-8\" d=\"^51\"/><path id=\"bulgarian-split-squat-m-mo-9\" d=\"^52\"/><path id=\"bulgarian-split-squat-m-mo-10\" d=\"^53\"/><path id=\"bulgarian-split-squat-m-mo-11\" d=\"^56\"/><path id=\"bulgarian-split-squat-m-mo-12\" d=\"^57\"/><path id=\"bulgarian-split-squat-m-mo-13\" d=\"^58\"/><path id=\"bulgarian-split-squat-m-mo-14\" d=\"^59\"/><path id=\"bulgarian-split-squat-m-mo-15\" d=\"^49\"/><path id=\"bulgarian-split-squat-m-mo-16\" d=\"^50\"/><path id=\"bulgarian-split-squat-m-mo-17\" d=\"^51\"/><path id=\"bulgarian-split-squat-m-mo-18\" d=\"^52\"/><path id=\"bulgarian-split-squat-m-mo-19\" d=\"^53\"/><path id=\"bulgarian-split-squat-m-mo-20\" d=\"^61\"/><path id=\"bulgarian-split-squat-m-mo-21\" d=\"^62\"/><path id=\"bulgarian-split-squat-m-mo-22\" d=\"^63\"/><path id=\"bulgarian-split-squat-m-mo-23\" d=\"^66\"/><path id=\"bulgarian-split-squat-m-mo-24\" d=\"^67\"/><path id=\"bulgarian-split-squat-m-mo-25\" d=\"^68\"/><path id=\"bulgarian-split-squat-m-mo-26\" d=\"^66\"/><path id=\"bulgarian-split-squat-m-mo-27\" d=\"^67\"/><path id=\"bulgarian-split-squat-m-mo-28\" d=\"^68\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#bulgarian-split-squat-m-dots)\"/>\n  <path class=\"floorline\" d=\"^60\"/><path class=\"eq\" d=\"^61\"/><path class=\"eq\" d=\"^62\"/><path class=\"eq\" d=\"^63\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-st-thigh.l\"/><use href=\"#bulgarian-split-squat-m-st-kneecap.l\"/><use href=\"#bulgarian-split-squat-m-st-shank.l\"/><use href=\"#bulgarian-split-squat-m-st-shcap.l\"/><use href=\"#bulgarian-split-squat-m-st-upper.l\"/><use href=\"#bulgarian-split-squat-m-st-elbowcap.l\"/><use href=\"#bulgarian-split-squat-m-st-fore.l\"/><use href=\"#bulgarian-split-squat-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-st-thigh.l\"/><use href=\"#bulgarian-split-squat-m-st-kneecap.l\"/><use href=\"#bulgarian-split-squat-m-st-shank.l\"/><use href=\"#bulgarian-split-squat-m-st-shcap.l\"/><use href=\"#bulgarian-split-squat-m-st-upper.l\"/><use href=\"#bulgarian-split-squat-m-st-elbowcap.l\"/><use href=\"#bulgarian-split-squat-m-st-fore.l\"/><use href=\"#bulgarian-split-squat-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-st-head\"/><use href=\"#bulgarian-split-squat-m-st-torso\"/><use href=\"#bulgarian-split-squat-m-st-thigh.r\"/><use href=\"#bulgarian-split-squat-m-st-kneecap.r\"/><use href=\"#bulgarian-split-squat-m-st-shank.r\"/><use href=\"#bulgarian-split-squat-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-st-head\"/><use href=\"#bulgarian-split-squat-m-st-torso\"/><use href=\"#bulgarian-split-squat-m-st-thigh.r\"/><use href=\"#bulgarian-split-squat-m-st-kneecap.r\"/><use href=\"#bulgarian-split-squat-m-st-shank.r\"/><use href=\"#bulgarian-split-squat-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-st-shcap.r\"/><use href=\"#bulgarian-split-squat-m-st-upper.r\"/><use href=\"#bulgarian-split-squat-m-st-elbowcap.r\"/><use href=\"#bulgarian-split-squat-m-st-fore.r\"/><use href=\"#bulgarian-split-squat-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-st-shcap.r\"/><use href=\"#bulgarian-split-squat-m-st-upper.r\"/><use href=\"#bulgarian-split-squat-m-st-elbowcap.r\"/><use href=\"#bulgarian-split-squat-m-st-fore.r\"/><use href=\"#bulgarian-split-squat-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-solid\" d=\"^64\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-g0-eq2.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-m-g0-eq2.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-g0-eq2.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-m-g0-eq2.dumbbell.2-1\"/></g></g><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-g0-thigh.l\"/><use href=\"#bulgarian-split-squat-m-g0-kneecap.l\"/><use href=\"#bulgarian-split-squat-m-g0-shank.l\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-g0-thigh.l\"/><use href=\"#bulgarian-split-squat-m-g0-kneecap.l\"/><use href=\"#bulgarian-split-squat-m-g0-shank.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-g0-head\"/><use href=\"#bulgarian-split-squat-m-g0-torso\"/><use href=\"#bulgarian-split-squat-m-g0-thigh.r\"/><use href=\"#bulgarian-split-squat-m-g0-kneecap.r\"/><use href=\"#bulgarian-split-squat-m-g0-shank.r\"/><use href=\"#bulgarian-split-squat-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-g0-head\"/><use href=\"#bulgarian-split-squat-m-g0-torso\"/><use href=\"#bulgarian-split-squat-m-g0-thigh.r\"/><use href=\"#bulgarian-split-squat-m-g0-kneecap.r\"/><use href=\"#bulgarian-split-squat-m-g0-shank.r\"/><use href=\"#bulgarian-split-squat-m-g0-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^64\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-g0-eq3.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-m-g0-eq3.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-g0-eq3.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-m-g0-eq3.dumbbell.2-1\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-g0-shcap.r\"/><use href=\"#bulgarian-split-squat-m-g0-upper.r\"/><use href=\"#bulgarian-split-squat-m-g0-elbowcap.r\"/><use href=\"#bulgarian-split-squat-m-g0-fore.r\"/><use href=\"#bulgarian-split-squat-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-g0-shcap.r\"/><use href=\"#bulgarian-split-squat-m-g0-upper.r\"/><use href=\"#bulgarian-split-squat-m-g0-elbowcap.r\"/><use href=\"#bulgarian-split-squat-m-g0-fore.r\"/><use href=\"#bulgarian-split-squat-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-solid\" d=\"^65\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-g1-eq2.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-m-g1-eq2.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-g1-eq2.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-m-g1-eq2.dumbbell.2-1\"/></g></g><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-g1-thigh.l\"/><use href=\"#bulgarian-split-squat-m-g1-kneecap.l\"/><use href=\"#bulgarian-split-squat-m-g1-shank.l\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-g1-thigh.l\"/><use href=\"#bulgarian-split-squat-m-g1-kneecap.l\"/><use href=\"#bulgarian-split-squat-m-g1-shank.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-g1-head\"/><use href=\"#bulgarian-split-squat-m-g1-torso\"/><use href=\"#bulgarian-split-squat-m-g1-thigh.r\"/><use href=\"#bulgarian-split-squat-m-g1-kneecap.r\"/><use href=\"#bulgarian-split-squat-m-g1-shank.r\"/><use href=\"#bulgarian-split-squat-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-g1-head\"/><use href=\"#bulgarian-split-squat-m-g1-torso\"/><use href=\"#bulgarian-split-squat-m-g1-thigh.r\"/><use href=\"#bulgarian-split-squat-m-g1-kneecap.r\"/><use href=\"#bulgarian-split-squat-m-g1-shank.r\"/><use href=\"#bulgarian-split-squat-m-g1-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^65\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-g1-eq3.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-m-g1-eq3.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-g1-eq3.dumbbell.1-0\"/><use href=\"#bulgarian-split-squat-m-g1-eq3.dumbbell.2-1\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-g1-shcap.r\"/><use href=\"#bulgarian-split-squat-m-g1-upper.r\"/><use href=\"#bulgarian-split-squat-m-g1-elbowcap.r\"/><use href=\"#bulgarian-split-squat-m-g1-fore.r\"/><use href=\"#bulgarian-split-squat-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-g1-shcap.r\"/><use href=\"#bulgarian-split-squat-m-g1-upper.r\"/><use href=\"#bulgarian-split-squat-m-g1-elbowcap.r\"/><use href=\"#bulgarian-split-squat-m-g1-fore.r\"/><use href=\"#bulgarian-split-squat-m-g1-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-solid\" d=\"^66\"/><path class=\"disc\" d=\"^67\"/><path class=\"disc\" d=\"^68\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-e-thigh.l\"/><use href=\"#bulgarian-split-squat-m-e-kneecap.l\"/><use href=\"#bulgarian-split-squat-m-e-shank.l\"/><use href=\"#bulgarian-split-squat-m-e-foot.l\"/><use href=\"#bulgarian-split-squat-m-e-shcap.l\"/><use href=\"#bulgarian-split-squat-m-e-upper.l\"/><use href=\"#bulgarian-split-squat-m-e-elbowcap.l\"/><use href=\"#bulgarian-split-squat-m-e-fore.l\"/><use href=\"#bulgarian-split-squat-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-e-thigh.l\"/><use href=\"#bulgarian-split-squat-m-e-kneecap.l\"/><use href=\"#bulgarian-split-squat-m-e-shank.l\"/><use href=\"#bulgarian-split-squat-m-e-foot.l\"/><use href=\"#bulgarian-split-squat-m-e-shcap.l\"/><use href=\"#bulgarian-split-squat-m-e-upper.l\"/><use href=\"#bulgarian-split-squat-m-e-elbowcap.l\"/><use href=\"#bulgarian-split-squat-m-e-fore.l\"/><use href=\"#bulgarian-split-squat-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-e-head\"/><use href=\"#bulgarian-split-squat-m-e-torso\"/><use href=\"#bulgarian-split-squat-m-e-thigh.r\"/><use href=\"#bulgarian-split-squat-m-e-kneecap.r\"/><use href=\"#bulgarian-split-squat-m-e-shank.r\"/><use href=\"#bulgarian-split-squat-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-e-head\"/><use href=\"#bulgarian-split-squat-m-e-torso\"/><use href=\"#bulgarian-split-squat-m-e-thigh.r\"/><use href=\"#bulgarian-split-squat-m-e-kneecap.r\"/><use href=\"#bulgarian-split-squat-m-e-shank.r\"/><use href=\"#bulgarian-split-squat-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^66\"/><path class=\"disc\" d=\"^67\"/><path class=\"disc\" d=\"^68\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-e-shcap.r\"/><use href=\"#bulgarian-split-squat-m-e-upper.r\"/><use href=\"#bulgarian-split-squat-m-e-elbowcap.r\"/><use href=\"#bulgarian-split-squat-m-e-fore.r\"/><use href=\"#bulgarian-split-squat-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bulgarian-split-squat-m-e-shcap.r\"/><use href=\"#bulgarian-split-squat-m-e-upper.r\"/><use href=\"#bulgarian-split-squat-m-e-elbowcap.r\"/><use href=\"#bulgarian-split-squat-m-e-fore.r\"/><use href=\"#bulgarian-split-squat-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"184.5\" cy=\"191.44\" r=\"2.25\"/><circle class=\"joint\" cx=\"184.5\" cy=\"239.06\" r=\"2.25\"/><circle class=\"joint\" cx=\"180.88\" cy=\"260.47\" r=\"2.25\"/><circle class=\"joint\" cx=\"243.32\" cy=\"266.41\" r=\"2.25\"/></g><mask id=\"bulgarian-split-squat-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#bulgarian-split-squat-m-m-head\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-torso\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-thigh.l\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-shank.l\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-mf-foot.l\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-shcap.l\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-upper.l\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-fore.l\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-fist.l\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-thigh.r\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-shank.r\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-foot.r\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-shcap.r\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-upper.r\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-fore.r\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-m-fist.r\" fill=\"#000\"/><use href=\"#bulgarian-split-squat-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bulgarian-split-squat-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#bulgarian-split-squat-m-mmask)\"><g class=\"u-stroke\"><use href=\"#bulgarian-split-squat-m-m-head\"/><use href=\"#bulgarian-split-squat-m-m-torso\"/><use href=\"#bulgarian-split-squat-m-m-thigh.l\"/><use href=\"#bulgarian-split-squat-m-m-kneecap.l\"/><use href=\"#bulgarian-split-squat-m-m-shank.l\"/><use href=\"#bulgarian-split-squat-m-m-shcap.l\"/><use href=\"#bulgarian-split-squat-m-m-upper.l\"/><use href=\"#bulgarian-split-squat-m-m-elbowcap.l\"/><use href=\"#bulgarian-split-squat-m-m-fore.l\"/><use href=\"#bulgarian-split-squat-m-m-fist.l\"/><use href=\"#bulgarian-split-squat-m-m-thigh.r\"/><use href=\"#bulgarian-split-squat-m-m-kneecap.r\"/><use href=\"#bulgarian-split-squat-m-m-shank.r\"/><use href=\"#bulgarian-split-squat-m-m-foot.r\"/><use href=\"#bulgarian-split-squat-m-m-shcap.r\"/><use href=\"#bulgarian-split-squat-m-m-upper.r\"/><use href=\"#bulgarian-split-squat-m-m-elbowcap.r\"/><use href=\"#bulgarian-split-squat-m-m-fore.r\"/><use href=\"#bulgarian-split-squat-m-m-fist.r\"/><use href=\"#bulgarian-split-squat-m-m-eq0\"/><use href=\"#bulgarian-split-squat-m-m-eq1\"/><use href=\"#bulgarian-split-squat-m-m-eq2\"/><use href=\"#bulgarian-split-squat-m-m-eq3\"/><use href=\"#bulgarian-split-squat-m-m-eq4\"/><use href=\"#bulgarian-split-squat-m-m-eq5\"/></g></g><g class=\"mistake-layer\"><path class=\"leader m\" d=\"M174.5 331.83L120.53 314H110.53\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"bulgarian-split-squat-m-knee\" data-key=\"knee\" data-cue=\"Dropping into the bottom, the rear knee rests on the floor.\" class=\"plate-callout m\" style=\"left:8.38%;top:81.56%\" aria-pressed=\"true\">Knee rests</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "foot",
        cues: [{ key: "foot", cue: "Rest the top of the rear foot on a bench about knee height." }, { key: "stance", cue: "Put the front foot about three foot-lengths ahead of the bench." }, { key: "back", cue: "Keep the back straight as the rear knee lowers." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "knee",
        cues: [{ key: "knee", cue: "Dropping into the bottom, the rear knee rests on the floor." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Knee rests</b><span>Dropping into the bottom, the rear knee rests on the floor.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower controlled, stand\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>Controlled</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Stand</b><span>&nbsp;</span></div></div></div>",
      alt: "Bulgarian split squat with dumbbells, side view. The top of the rear foot rests on a bench behind, the front foot well ahead, and the body lowers until the rear knee is just above the floor, front foot flat, back straight, dumbbells hanging at the sides.",
      mistakeAlt: "Bulgarian Split Squat: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP: the card gives no thumb, contact or wrist claim."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Rest the top of your rear foot on a knee-high bench.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-bss",
          "ace-bss"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "position",
      "text": "Front foot about three foot-lengths ahead. Farther: more hips. Closer: more quads.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-bss",
          "ace-bss"
        ],
        "note": "c2, c6"
      }
    },
    {
      "kind": "position",
      "text": "Dumbbells at your sides, front knee over the front foot.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-bss"
        ],
        "note": "c9 (card grip.type), c4"
      }
    },
    {
      "kind": "position",
      "text": "Lower under control until the rear knee lightly touches the floor.",
      "zoom": "rear-knee",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-bss",
          "ace-bss"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "finish",
      "text": "Do all reps on one leg, then switch.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-bss"
        ],
        "note": "c7"
      }
    }
  ],
  posture: [
    {
      "key": "foot",
      "label": "Foot on bench",
      "detail": "Top of the rear foot on the bench.",
      "anchor": {
        "pose": "start",
        "at": "ankle.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-bss",
          "ace-bss"
        ],
        "note": "c2"
      }
    },
    {
      "key": "stance",
      "label": "Long stance",
      "detail": "Front foot about three foot-lengths ahead of the bench.",
      "anchor": {
        "pose": "start",
        "at": "toe.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-bss",
          "ace-bss"
        ],
        "note": "c2"
      }
    },
    {
      "key": "knee",
      "label": "Knee over foot",
      "detail": "Front knee stays over the front foot, not in or out.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-bss"
        ],
        "note": "c4"
      }
    },
    {
      "key": "back",
      "label": "Back straight",
      "detail": "Back straight as the rear knee lowers.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bss"
        ],
        "note": "c5"
      }
    },
    {
      "key": "foot-distance",
      "label": "Foot distance",
      "detail": "Front foot farther forward for more hip work, closer for more quads.",
      "anchor": {
        "pose": "end",
        "at": "toe.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-bss"
        ],
        "note": "c6"
      }
    },
    {
      "key": "rest",
      "label": "Rear knee resting",
      "detail": "Lower under control. Stop as the knee lightly touches.",
      "anchor": {
        "pose": "end",
        "at": "knee.l"
      },
      "zoom": "rear-knee",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-bss",
          "ace-bss"
        ],
        "note": "c3, c8"
      }
    },
    {
      "key": "crash",
      "label": "Crashing down",
      "detail": "Use a weight you can move smoothly.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-bss"
        ],
        "note": "c8"
      }
    }
  ],
  zooms: [
    {
      "key": "rear-knee",
      "chip": "Rear knee",
      "heading": "Rear knee",
      "kind": "posture"
    }
  ],
  chips: [
    "rear-knee",
    "feel"
  ],
  copy: {
    "setupLine": "Rear foot on a knee-high bench. Front foot farther forward works the hips more, closer the quads.",
    "mistakeLine": "Never drop onto the rear knee. Use a weight you can lower smoothly.",
    "cueLine": "Front knee over the front foot.",
    "variantLine": "Same stance and depth with a barbell instead of dumbbells."
  },
  mistakes: [],
  risks: [
    {
      "key": "crash",
      "text": "Crashing into the bottom. Use a weight you can move smoothly.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-bss"
        ],
        "note": "c8"
      }
    },
    {
      "key": "knee-drift",
      "text": "Front knee drifting inward or outward.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-bss"
        ],
        "note": "c4"
      }
    }
  ],
  riskFlags: [
    "knee"
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
    "cat-bss",
    "ace-bss",
    "mccurdy-2021",
    "arakawa-2023",
    "aygun-2025",
    "nhs-knee",
    "nhs-knee-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/bulgarian_split_squat.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

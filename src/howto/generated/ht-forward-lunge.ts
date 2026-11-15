// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=3a32bbfc53a65b4da83b29fb52b9e14a7443a17aadebd92d155e8471a0f187f8
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_forward_lunge",
  name: "Forward Lunge",
  hashes: { inputsSha256: "3a32bbfc53a65b4da83b29fb52b9e14a7443a17aadebd92d155e8471a0f187f8", golden: "0fc4815385548e5d757fcbcab25d32a8a9eff375b618701de6890594aed5d2e8" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"forward-lunge-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"forward-lunge-n-st-thigh.l\" d=\"~#F12AYfN.E1.SfRJD1B2TbE11N5U(1W5)7U2x4uzV1SbInjEkxdRmB4)U1.2.3E6T7K1Y(1D10P1-bRv-aVkPG1D1(z1AnDF100020000010200001200000200000001001010020000000000210000000020000000100002001220\"/><path id=\"forward-lunge-n-st-kneecap.l\" d=\"~~JAh_wU1_J10\"/><path id=\"forward-lunge-n-st-shank.l\" d=\"~#F12yzhA!T1RIhOKS1(2TbH16O1A)1W6E7A3T3y3)y2U8-cF1*b*5EePaEy2G2E4B5I8BbA(1E13h*b)dHaTfFnB2UlWa!p10101100020000100010000200000000200000000001000000000101000120000000220000101100\"/><path id=\"forward-lunge-n-st-foot.l\" d=\"~#o2WJgAB)1G(gzB(1!cF3Phx8Wp)nS-2B3-J2-4ID1)7)n2TG1Y4Bb-c_sBbKmSp020022110100000111000000001200100111101010111110\"/><path id=\"forward-lunge-n-st-shcap.l\" d=\"~~(UgyGqwP10\"/><path id=\"forward-lunge-n-st-upper.l\" d=\"~#F12(UgyGq.VgIBpe.8a1J2UO1D3.5N1x3_5KD1wa-i0Igxa-iX5KD1K1x3B3.5I2UO171f.8Egz1TdUp1JmYdUp10100000010000020001002000001100100110001010110002002001201000001100001010000001\"/><path id=\"forward-lunge-n-st-elbowcap.l\" d=\"~~WxhUSz1Dz10\"/><path id=\"forward-lunge-n-st-fore.l\" d=\"~#F12DwhDVz1Bxh)Yy1uIau_1N6yI1(2R9N1K2-1*w1!5BdnEbX7EcV2.w1-1E2B4x9fSI1h(1K2zazaiB9FkH1DhYbYi00000000000111000000000000100001000000000010111111110100200000000010000020000100\"/><path id=\"forward-lunge-n-st-fist.l\" d=\"~~Y_h(HK1ww10\"/><path id=\"forward-lunge-n-st-head\" d=\"~#w12(AiyGgXRgO)fBjFjBjS9Ebz3z3Y4.4)7*7EbThGm_4.cT1R9Bj0JmBbNmI6_kA3AjygO1Dj1000021010100200010010000110020100001000000012000000111000000010\"/><path id=\"forward-lunge-n-st-torso\" d=\"~#_12(UgyxlR(gVSjR9I6E30W9UhP9J6!cwgJ60I6)nKm)7-cY4ygX4YkI6Jm)fWhThY4T9)7)fErzz1zbErK60R90YcwgF3w8-c)7xgw8G6YkJ6P6YcEbF3w8BT2ww101000000000000110000000001000111101011020010001000000100101000100200010100010000000000000010000001001200110020000100\"/><path id=\"forward-lunge-n-st-thigh.r\" d=\"^0\"/><path id=\"forward-lunge-n-st-kneecap.r\" d=\"^1\"/><path id=\"forward-lunge-n-st-shank.r\" d=\"^2\"/><path id=\"forward-lunge-n-st-foot.r\" d=\"^3\"/><path id=\"forward-lunge-n-st-shcap.r\" d=\"^4\"/><path id=\"forward-lunge-n-st-upper.r\" d=\"^5\"/><path id=\"forward-lunge-n-st-elbowcap.r\" d=\"^6\"/><path id=\"forward-lunge-n-st-fore.r\" d=\"^7\"/><path id=\"forward-lunge-n-st-fist.r\" d=\"^8\"/><path id=\"forward-lunge-n-g0-eq1.dumbbell.1-0\" d=\"~MH)j(.J1LEK10QI90!z1J9LJ9yy2Q0J9J9xy2L!z1I9QJ90.z1I9LI9xy2Q0I9I9yy2Z\"/><path id=\"forward-lunge-n-g0-eq1.dumbbell.2-1\" d=\"~M(FoA_O1LFK10QJ90.z1I9LI9xy2Q0I9I9yy2L.z1J9QI90!z1J9LJ9yy2Q0J9J9xy2Z\"/><path id=\"forward-lunge-n-g0-thigh.l\" d=\"~#F12D_iJ)F1RSi-PE1-2RbB12S8F(1H5G8N2z4-1zV1Ja)nT1xkEe*l.6XU1x3V3R6G7W1_(1D13s.b)vB9RiPH1(2_z1FpwE101010100000000000022000200000002001000000000002000000010100000200100011110200000\"/><path id=\"forward-lunge-n-g0-kneecap.l\" d=\"~~A_kW)U1_J10\"/><path id=\"forward-lunge-n-g0-shank.l\" d=\"~#F12N!kAKU1-SlIzT1N6xaA1gXkU.1W8X4w4R2Nn.(1AcR9Y4*aB1OfDu-.1rV4I2T9VtYX1z1fA3ObOgP5)lJhV8!jH2ws01000000000000000011010000000010002001020002200010100000000020001000000022022000\"/><path id=\"forward-lunge-n-g0-foot.l\" d=\"^3\"/><path id=\"forward-lunge-n-g0-head\" d=\"~#w12!TlAGh.wkT(gOj!iIjF9zbK3G3_4T4z8-7GbEhXmy5VcK1T9Bj9Sm-aSmx6WkU3(iHg*1Aj0000020000000010100001000010000000000000101010000010020101000000\"/><path id=\"forward-lunge-n-g0-torso\" d=\"~#_12DxkHwmRIkzSkO9O6E33H9_hP9S6PcFgN62)5xoEmK8.cS4ygK4!kz6WmRf(hGhw5O9-7zgOqVz1XaIrK63R93ScDgw3y8VcE8xgY7-6UkH6S6wd*ay3w8-T2Su00000011000000200000222000000001000000101210000000000020001200200000021010000220001000111020000001000200000001111121\"/><path id=\"forward-lunge-n-g0-thigh.r\" d=\"~#F12!FjPDH1)Gi-yG1K8K8vq(E1NP16.93X4ItIJ1V3-p)bEgRnEbKx1GG1T4O1I9-2Fy1SU1y1lO5Razw1(8P6(K1Hlwt!G1!j00000000000001000100000021010010021000000000002000000000200000000000020000010010\"/><path id=\"forward-lunge-n-g0-kneecap.r\" d=\"~~yyr!US1_J10\"/><path id=\"forward-lunge-n-g0-shank.r\" d=\"~#F12YxrY)S1I_q*PR1v*bD19PjD!1(3z9Y1K4EjGw2!3.eX2VbGaOb)b)x2T3B3T7E6waH(1E1aO4)aX9Hex7yrw5DlYi!k10001111000220000100000121000200200210000010010020200000002002200021010002200001\"/><path id=\"forward-lunge-n-g0-foot.r\" d=\"~#o2!Buw-*1TNuOV!1Fd9!eBcSi.tWV2EqII2FfEE1D2znF6*D1JfzeO9!oBi*eNu002101000200000002000001110020200101000000010000\"/><path id=\"forward-lunge-n-g0-shcap.r\" d=\"~~F(jAGrwP10\"/><path id=\"forward-lunge-n-g0-upper.r\" d=\"~#F12F(jAGrB)jKBqg.881J2WO1D3)5N1)2Y5KD1ya-i0Ig)9-i-5KD1K1)2B3)5I2WO171h.8zgz1XdUp2JmUdUp00002010011000000100002000200020002000001010100100000001201000200100000000000021\"/><path id=\"forward-lunge-n-g0-elbowcap.r\" d=\"~~yIkWSA1Dz10\"/><path id=\"forward-lunge-n-g0-fore.r\" d=\"~#F12SGkFVA1RHkx-z1uIas_1S6yI1!2R9N1I2.1xx1w6zdpEbX7EcV2.w1.1E2z4x9dSI1j(1K2zazaiB9FkF1Dh!bYi00100000002101000000000121002200000000000010010121012100000000001010000020000120\"/><path id=\"forward-lunge-n-g0-fist.r\" d=\"~~AAlwIN1ww10\"/><path id=\"forward-lunge-n-g0-eq2.dumbbell.1-0\" d=\"^11\"/><path id=\"forward-lunge-n-g0-eq2.dumbbell.2-1\" d=\"^12\"/><path id=\"forward-lunge-n-g1-eq1.dumbbell.1-0\" d=\"~MWxuDHS1LEK10QI90!z1J9LJ9yy2Q0J9J9xy2L!z1I9QJ90.z1I9LI9xy2Q0I9I9yy2Z\"/><path id=\"forward-lunge-n-g1-eq1.dumbbell.2-1\" d=\"~MFIy1JFV1LFK10QJ90.z1I9LI9xy2Q0I9I9yy2L.z1J9QI90!z1J9LJ9yy2Q0J9J9xy2Z\"/><path id=\"forward-lunge-n-g1-thigh.l\" d=\"~#F12PKsJKN1VBs-(J1-2RbE12(8D(1D5G8N2z4x2BV1Ha*n-1BkEe-lz7VU1x3V3T6G7(1Y(1F11q-bzw1z9GiUH1A3_z1JpYD100002100212000101000000101000011102000200100000001100002000000011000010000000102\"/><path id=\"forward-lunge-n-g1-kneecap.l\" d=\"~~DOuFK_1_J10\"/><path id=\"forward-lunge-n-g1-shank.l\" d=\"~#F12HSv!)Y1Exx1V-Y1!bn8H1O!1_h!8F4N4_1Yw2Rh_eF4YbK2Yb)9Hy2IaF3K3P6O7V(1J85E1DbB4zeza*q-7BlS4Klyi00110000000101100001010000101000000001010000100000001000200002001010000000100100\"/><path id=\"forward-lunge-n-g1-foot.l\" d=\"~#o2U)jyS.1Vyl.E.1Y6HbAiY6Az1D1Sx2y*1*S1V-1Kl-w1)g)g-w1*pA1xhHsPc*x1F2010101002100200010000021010000000201010002000001\"/><path id=\"forward-lunge-n-g1-head\" d=\"~#w12Jxw1YXmXNuKImBkAiTjS8xbX3K3U4I4G8K7ObIgInP5Kcz1X9Bjv(m)9YmB5SkF4JiwhT2yj0200000000000010100111120000012002100110001000000010100220000000\"/><path id=\"forward-lunge-n-g1-torso\" d=\"~#_12PGuyKrOVuE)pG9.6z33U8wiH9(6!bWgN68B5Eo*lB9)cA4Fg*3ylG5DnXePiXgJ5E9E7KgEpTA1-9VrI69R9h(bWgY2A8GcT8KgA7O7NkA6Y6HdRaY2D8VU2Ur00100000020000000000100001100001012000000002100002010020000111010010100020010101000001000001001000200010101000200200\"/><path id=\"forward-lunge-n-g1-thigh.r\" d=\"~#F12FNt!BP1KBsBNO1XaB5jy1NV1!w1)2K9V1K4BH1Iw1.bEnTgOb.p)2zK1Bs-42.9eUR1SD1mvT8E8OrwjAlFG1PtPkyN1F501000020001010010110101010100010000000001010101000002100100100000000010100101000\"/><path id=\"forward-lunge-n-g1-kneecap.r\" d=\"~~HOE1ADV1_J10\"/><path id=\"forward-lunge-n-g1-shank.r\" d=\"~#F12JSE1J_V1BxE1ENU1O3IbA1h_vPW1(1T9oX4Rw1T_1mOfE5XaOcx9-p**1B4G2-8O4yn__1z1iX6.9K6ygE1ysS9PjUmPg00100000000110021000000000002102002000000000020000020000200120000000102000001211\"/><path id=\"forward-lunge-n-g1-foot.r\" d=\"~#o2_HK1DB)1K!K1EB(1_cF3Uh*7UpxoS-2B3-J2-4ID1)7xo0OG1!4Eb.cYsBbGmUp100002002020000111001000101200022001101000000011\"/><path id=\"forward-lunge-n-g1-shcap.r\" d=\"~~UwuHXw1wP10\"/><path id=\"forward-lunge-n-g1-upper.r\" d=\"~#F12UwuHXw1RxuRTve)8c2H2SO1D3.5N1x3Y5KD1ya-i0Igxa-iV5KD1R1x3x3.5K2SO192d)8BgvXdPp2PmUdPp02000002201010000011100000000100000100200010110020101000020000020000000000000000\"/><path id=\"forward-lunge-n-g1-elbowcap.r\" d=\"~~NKu(wH1Dz10\"/><path id=\"forward-lunge-n-g1-fore.r\" d=\"~#F12(IuPzH1)JuGEG1y1IaqY1S6DI1!2T9N1K2.1*w1w6BdpEbX7EcX2*w1X1z2B4z9dSI1j(1K2zaBaix9FkD1Dh!bYi10000110010000000010101000000001001001000002200001010100001000101100200000000110\"/><path id=\"forward-lunge-n-g1-fist.r\" d=\"~~PDvF-T1ww10\"/><path id=\"forward-lunge-n-g1-eq2.dumbbell.1-0\" d=\"^27\"/><path id=\"forward-lunge-n-g1-eq2.dumbbell.2-1\" d=\"^28\"/><path id=\"forward-lunge-n-e-thigh.l\" d=\"~#F12y)w1FIT1VFx1x*R1P1Xbz1dIeD*1w8-5W3)2NhGS1FiOiY5KjI5RpScTT1R1T4O3z9xlD.1F1ay5XaTqzkRw1wx1zaSy1S9HK100001021010000002010110101000000210000000010100002101021010001010000000200000000\"/><path id=\"forward-lunge-n-e-kneecap.l\" d=\"~~PKu(Y)1_J10\"/><path id=\"forward-lunge-n-e-shank.l\" d=\"~#F12!Aw1_I(1)Rx1E_(1ybN47H1K(1V9H6U7D3S3yy2UbUbFaUbW2(e)3Jw2!iP4X1(8)3z!1zj8B1!bsK8xf)kRizl)4zrJ721000020020001010000000000000001010000002100020010012000101100000020010100001200\"/><path id=\"forward-lunge-n-e-foot.l\" d=\"^32\"/><path id=\"forward-lunge-n-e-shcap.l\" d=\"~~JOy1PRD1wP10\"/><path id=\"forward-lunge-n-e-upper.l\" d=\"~#F12JOy1PRD1GPy1-KB1e.8a1J2WO1D3)5N1*2_5RD1waVi0OgxaViX5RD1K1*2B3)5I2WO171f.8Egx1TdPp1PmYdPp10120000000200002000002101001000100000010110000000002200201002001000001010000000\"/><path id=\"forward-lunge-n-e-elbowcap.l\" d=\"~~A!y1A.O1Dz10\"/><path id=\"forward-lunge-n-e-fore.l\" d=\"~#F12U_y1W*O1T.y1RxO1uGau_1N6yI1(2O9N1O2-1*w1!5EdnBbX7EcV2.w1-1E2B4x9fUI1h!1K2Bazakz9FkD1Dh_b_i01000000000100000000000101110000000200000210101010120000210000000210001000000001\"/><path id=\"forward-lunge-n-e-fist.l\" d=\"~~DVz1NT-1ww10\"/><path id=\"forward-lunge-n-e-head\" d=\"~#w12APA1(RsO*y1VBsBkDiVjS8)aX3K3U4I4E8I7TbKgEnN5Rcx1V9BjtwnxaUmB5WkF4FiwhO2yj0010000000000000022000000002101010000000000000010100001001002010\"/><path id=\"forward-lunge-n-e-torso\" d=\"~#_12DYy1DEx1BAz1G-vE9*6E35Y8AiD9!6(bUgN6cz5Io)lx9)cy4Dg*3AlG5Fn-eNiTgH5I9z7IgIpRA1V9XrK6bT9fwcWg_2D8KcX8IgD7K7Pkw6U6JdKa_2A8-U2Sr02000000002000101101002000000100100010110100000000100010100000000000011011000200200200011000020200011000000000000000\"/><path id=\"forward-lunge-n-e-thigh.r\" d=\"~#F12WFz1WKW1T-x1KRW1Xb!11D1Y(1K3-7)5*3X2BV1O2*mKcBk2xnHczV1P2.3Y2.7w6W(1N32B1-b-1XbAv_F1wm(z10!F1*l22020010000000000010101200000002000010000020020200100022000200200002000000200000\"/><path id=\"forward-lunge-n-e-kneecap.r\" d=\"~~(zN1yxU1_J10\"/><path id=\"forward-lunge-n-e-shank.r\" d=\"~#F12UyN1F!T1GIN1XKS1y3KbD12V1A)1Y6B7A3T3H3)y2W8XcF1*b.5GeYazy2G2E4z5K8Kby(1E13h.b*dDaXfFnG2SlUa(p01000010000000000000000001000010000000020010100010111000100002000000000111000000\"/><path id=\"forward-lunge-n-e-foot.r\" d=\"~#o2_HK1DB)1K!K1EB(1_cF3Uh)7Up*nS-2E3-J2-4ID1)7xo0OG1_4EbXcYsEbGmUp100002002220000011011000101000002000121000000011\"/><path id=\"forward-lunge-n-e-shcap.r\" d=\"^47\"/><path id=\"forward-lunge-n-e-upper.r\" d=\"^48\"/><path id=\"forward-lunge-n-e-elbowcap.r\" d=\"^49\"/><path id=\"forward-lunge-n-e-fore.r\" d=\"^50\"/><path id=\"forward-lunge-n-e-fist.r\" d=\"^51\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#forward-lunge-n-dots)\"/>\n  <path class=\"floorline\" d=\"M57.83 339.5H306.51\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-st-thigh.l\"/><use href=\"#forward-lunge-n-st-kneecap.l\"/><use href=\"#forward-lunge-n-st-shank.l\"/><use href=\"#forward-lunge-n-st-foot.l\"/><use href=\"#forward-lunge-n-st-shcap.l\"/><use href=\"#forward-lunge-n-st-upper.l\"/><use href=\"#forward-lunge-n-st-elbowcap.l\"/><use href=\"#forward-lunge-n-st-fore.l\"/><use href=\"#forward-lunge-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-st-thigh.l\"/><use href=\"#forward-lunge-n-st-kneecap.l\"/><use href=\"#forward-lunge-n-st-shank.l\"/><use href=\"#forward-lunge-n-st-foot.l\"/><use href=\"#forward-lunge-n-st-shcap.l\"/><use href=\"#forward-lunge-n-st-upper.l\"/><use href=\"#forward-lunge-n-st-elbowcap.l\"/><use href=\"#forward-lunge-n-st-fore.l\"/><use href=\"#forward-lunge-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-st-head\"/><use href=\"#forward-lunge-n-st-torso\"/><use href=\"#forward-lunge-n-st-thigh.r\"/><use href=\"#forward-lunge-n-st-kneecap.r\"/><use href=\"#forward-lunge-n-st-shank.r\"/><use href=\"#forward-lunge-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-st-head\"/><use href=\"#forward-lunge-n-st-torso\"/><use href=\"#forward-lunge-n-st-thigh.r\"/><use href=\"#forward-lunge-n-st-kneecap.r\"/><use href=\"#forward-lunge-n-st-shank.r\"/><use href=\"#forward-lunge-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-st-shcap.r\"/><use href=\"#forward-lunge-n-st-upper.r\"/><use href=\"#forward-lunge-n-st-elbowcap.r\"/><use href=\"#forward-lunge-n-st-fore.r\"/><use href=\"#forward-lunge-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-st-shcap.r\"/><use href=\"#forward-lunge-n-st-upper.r\"/><use href=\"#forward-lunge-n-st-elbowcap.r\"/><use href=\"#forward-lunge-n-st-fore.r\"/><use href=\"#forward-lunge-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-solid\" d=\"~MJHkU-N1LPT30QF60EK3E6LE6OaQ0E6E6PaLEK3F6QE60FK3F6LF6PaQ0F6F6OaZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-g0-eq1.dumbbell.1-0\"/><use href=\"#forward-lunge-n-g0-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-g0-eq1.dumbbell.1-0\"/><use href=\"#forward-lunge-n-g0-eq1.dumbbell.2-1\"/></g></g><g class=\"far\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-g0-thigh.l\"/><use href=\"#forward-lunge-n-g0-kneecap.l\"/><use href=\"#forward-lunge-n-g0-shank.l\"/><use href=\"#forward-lunge-n-g0-foot.l\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-g0-thigh.l\"/><use href=\"#forward-lunge-n-g0-kneecap.l\"/><use href=\"#forward-lunge-n-g0-shank.l\"/><use href=\"#forward-lunge-n-g0-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-g0-head\"/><use href=\"#forward-lunge-n-g0-torso\"/><use href=\"#forward-lunge-n-g0-thigh.r\"/><use href=\"#forward-lunge-n-g0-kneecap.r\"/><use href=\"#forward-lunge-n-g0-shank.r\"/><use href=\"#forward-lunge-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-g0-head\"/><use href=\"#forward-lunge-n-g0-torso\"/><use href=\"#forward-lunge-n-g0-thigh.r\"/><use href=\"#forward-lunge-n-g0-kneecap.r\"/><use href=\"#forward-lunge-n-g0-shank.r\"/><use href=\"#forward-lunge-n-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-g0-shcap.r\"/><use href=\"#forward-lunge-n-g0-upper.r\"/><use href=\"#forward-lunge-n-g0-elbowcap.r\"/><use href=\"#forward-lunge-n-g0-fore.r\"/><use href=\"#forward-lunge-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-g0-shcap.r\"/><use href=\"#forward-lunge-n-g0-upper.r\"/><use href=\"#forward-lunge-n-g0-elbowcap.r\"/><use href=\"#forward-lunge-n-g0-fore.r\"/><use href=\"#forward-lunge-n-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^59\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-g0-eq2.dumbbell.1-0\"/><use href=\"#forward-lunge-n-g0-eq2.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-g0-eq2.dumbbell.1-0\"/><use href=\"#forward-lunge-n-g0-eq2.dumbbell.2-1\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-solid\" d=\"~MYJu!EU1LPT30QF60EK3E6LE6OaQ0E6E6PaLEK3F6QE60FK3F6LF6PaQ0F6F6OaZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-g1-eq1.dumbbell.1-0\"/><use href=\"#forward-lunge-n-g1-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-g1-eq1.dumbbell.1-0\"/><use href=\"#forward-lunge-n-g1-eq1.dumbbell.2-1\"/></g></g><g class=\"far\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-g1-thigh.l\"/><use href=\"#forward-lunge-n-g1-kneecap.l\"/><use href=\"#forward-lunge-n-g1-shank.l\"/><use href=\"#forward-lunge-n-g1-foot.l\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-g1-thigh.l\"/><use href=\"#forward-lunge-n-g1-kneecap.l\"/><use href=\"#forward-lunge-n-g1-shank.l\"/><use href=\"#forward-lunge-n-g1-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-g1-head\"/><use href=\"#forward-lunge-n-g1-torso\"/><use href=\"#forward-lunge-n-g1-thigh.r\"/><use href=\"#forward-lunge-n-g1-kneecap.r\"/><use href=\"#forward-lunge-n-g1-shank.r\"/><use href=\"#forward-lunge-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-g1-head\"/><use href=\"#forward-lunge-n-g1-torso\"/><use href=\"#forward-lunge-n-g1-thigh.r\"/><use href=\"#forward-lunge-n-g1-kneecap.r\"/><use href=\"#forward-lunge-n-g1-shank.r\"/><use href=\"#forward-lunge-n-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-g1-shcap.r\"/><use href=\"#forward-lunge-n-g1-upper.r\"/><use href=\"#forward-lunge-n-g1-elbowcap.r\"/><use href=\"#forward-lunge-n-g1-fore.r\"/><use href=\"#forward-lunge-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-g1-shcap.r\"/><use href=\"#forward-lunge-n-g1-upper.r\"/><use href=\"#forward-lunge-n-g1-elbowcap.r\"/><use href=\"#forward-lunge-n-g1-fore.r\"/><use href=\"#forward-lunge-n-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-g1-eq2.dumbbell.1-0\"/><use href=\"#forward-lunge-n-g1-eq2.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-g1-eq2.dumbbell.1-0\"/><use href=\"#forward-lunge-n-g1-eq2.dumbbell.2-1\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-solid\" d=\"~MN.y1yy_1LPT30QF60EK3E6LE6OaQ0E6E6PaLEK3F6QE60FK3F6LF6PaQ0F6F6OaZ\"/><path class=\"disc\" d=\"~MJPy1HAY1LEK10QI90!z1J9LJ9Ay2Q0J9J9zy2L!z1I9QJ90.z1I9LI9zy2Q0I9I9Ay2Z\"/><path class=\"disc\" d=\"~Mw_D1Sy.1LFK10QJ90.z1I9LI9zy2Q0I9I9Ay2L.z1J9QI90!z1J9LJ9Ay2Q0J9J9zy2Z\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-e-thigh.l\"/><use href=\"#forward-lunge-n-e-kneecap.l\"/><use href=\"#forward-lunge-n-e-shank.l\"/><use href=\"#forward-lunge-n-e-foot.l\"/><use href=\"#forward-lunge-n-e-shcap.l\"/><use href=\"#forward-lunge-n-e-upper.l\"/><use href=\"#forward-lunge-n-e-elbowcap.l\"/><use href=\"#forward-lunge-n-e-fore.l\"/><use href=\"#forward-lunge-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-e-thigh.l\"/><use href=\"#forward-lunge-n-e-kneecap.l\"/><use href=\"#forward-lunge-n-e-shank.l\"/><use href=\"#forward-lunge-n-e-foot.l\"/><use href=\"#forward-lunge-n-e-shcap.l\"/><use href=\"#forward-lunge-n-e-upper.l\"/><use href=\"#forward-lunge-n-e-elbowcap.l\"/><use href=\"#forward-lunge-n-e-fore.l\"/><use href=\"#forward-lunge-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-e-head\"/><use href=\"#forward-lunge-n-e-torso\"/><use href=\"#forward-lunge-n-e-thigh.r\"/><use href=\"#forward-lunge-n-e-kneecap.r\"/><use href=\"#forward-lunge-n-e-shank.r\"/><use href=\"#forward-lunge-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-e-head\"/><use href=\"#forward-lunge-n-e-torso\"/><use href=\"#forward-lunge-n-e-thigh.r\"/><use href=\"#forward-lunge-n-e-kneecap.r\"/><use href=\"#forward-lunge-n-e-shank.r\"/><use href=\"#forward-lunge-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-n-e-shcap.r\"/><use href=\"#forward-lunge-n-e-upper.r\"/><use href=\"#forward-lunge-n-e-elbowcap.r\"/><use href=\"#forward-lunge-n-e-fore.r\"/><use href=\"#forward-lunge-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-n-e-shcap.r\"/><use href=\"#forward-lunge-n-e-upper.r\"/><use href=\"#forward-lunge-n-e-elbowcap.r\"/><use href=\"#forward-lunge-n-e-fore.r\"/><use href=\"#forward-lunge-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^61\"/><path class=\"disc\" d=\"^62\"/><path class=\"disc\" d=\"^63\"/><circle class=\"joint\" cx=\"184.22\" cy=\"197.36\" r=\"2.25\"/><circle class=\"joint\" cx=\"184.22\" cy=\"244.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"180.6\" cy=\"266.38\" r=\"2.25\"/><circle class=\"joint\" cx=\"243.32\" cy=\"266.41\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#w20yykyKF1*.jxIF10010200000yd_8022011022010010220110220100102Eao00001221001020000200001110110001200100011110002000001010020000001010100100200000101002000000101010010020000020000010101200000000101000002000001000\"/><path class=\"arrow\" d=\"~MyHy1!YS1LXB1IiLSz2K4Z\"/><path data-guide=\"shin\" style=\"display:none\" class=\"lead-guide\" d=\"~MUEN1YDy2L0RTh\"/><path data-guide=\"hips\" style=\"display:none\" class=\"lead-guide\" d=\"~MYFz1!wU1L0!Be\"/></g><path class=\"leader\" d=\"M160.04 267.36L193 240H203\"/><circle class=\"anchor\" cx=\"160.04\" cy=\"267.36\" r=\"1.5\"/><path class=\"leader\" d=\"~MwHP1AR-1LYF2T3\"/><circle class=\"anchor\" cx=\"247.36\" cy=\"294.58\" r=\"1.5\"/><path class=\"leader\" d=\"M165.14 209.18L207 182H217\"/><circle class=\"anchor\" cx=\"165.14\" cy=\"209.18\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"forward-lunge-n-hips\" data-key=\"hips\" data-cue=\"Drop the hips toward the floor rather than driving them forward.\" class=\"plate-callout two\" style=\"left:55.31%;top:60.89%\" aria-pressed=\"true\">Hips drop<br>down</button><button type=\"button\" id=\"forward-lunge-n-shin\" data-key=\"shin\" data-cue=\"Step long enough that the front shin is about vertical.\" class=\"plate-callout two\" style=\"left:70.95%;top:75.98%\" aria-pressed=\"false\">Front shin<br>vertical</button><button type=\"button\" id=\"forward-lunge-n-back\" data-key=\"back\" data-cue=\"Keep the back straight as you step.\" class=\"plate-callout\" style=\"left:59.22%;top:44.69%\" aria-pressed=\"false\">Back straight</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"forward-lunge-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"forward-lunge-m-st-thigh.l\" d=\"^0\"/><path id=\"forward-lunge-m-st-kneecap.l\" d=\"^1\"/><path id=\"forward-lunge-m-st-shank.l\" d=\"^2\"/><path id=\"forward-lunge-m-st-foot.l\" d=\"^3\"/><path id=\"forward-lunge-m-st-shcap.l\" d=\"^4\"/><path id=\"forward-lunge-m-st-upper.l\" d=\"^5\"/><path id=\"forward-lunge-m-st-elbowcap.l\" d=\"^6\"/><path id=\"forward-lunge-m-st-fore.l\" d=\"^7\"/><path id=\"forward-lunge-m-st-fist.l\" d=\"^8\"/><path id=\"forward-lunge-m-st-head\" d=\"^9\"/><path id=\"forward-lunge-m-st-torso\" d=\"^10\"/><path id=\"forward-lunge-m-st-thigh.r\" d=\"^0\"/><path id=\"forward-lunge-m-st-kneecap.r\" d=\"^1\"/><path id=\"forward-lunge-m-st-shank.r\" d=\"^2\"/><path id=\"forward-lunge-m-st-foot.r\" d=\"^3\"/><path id=\"forward-lunge-m-st-shcap.r\" d=\"^4\"/><path id=\"forward-lunge-m-st-upper.r\" d=\"^5\"/><path id=\"forward-lunge-m-st-elbowcap.r\" d=\"^6\"/><path id=\"forward-lunge-m-st-fore.r\" d=\"^7\"/><path id=\"forward-lunge-m-st-fist.r\" d=\"^8\"/><path id=\"forward-lunge-m-g0-eq1.dumbbell.1-0\" d=\"^11\"/><path id=\"forward-lunge-m-g0-eq1.dumbbell.2-1\" d=\"^12\"/><path id=\"forward-lunge-m-g0-thigh.l\" d=\"^13\"/><path id=\"forward-lunge-m-g0-kneecap.l\" d=\"^14\"/><path id=\"forward-lunge-m-g0-shank.l\" d=\"^15\"/><path id=\"forward-lunge-m-g0-foot.l\" d=\"^3\"/><path id=\"forward-lunge-m-g0-head\" d=\"^16\"/><path id=\"forward-lunge-m-g0-torso\" d=\"^17\"/><path id=\"forward-lunge-m-g0-thigh.r\" d=\"^18\"/><path id=\"forward-lunge-m-g0-kneecap.r\" d=\"^19\"/><path id=\"forward-lunge-m-g0-shank.r\" d=\"^20\"/><path id=\"forward-lunge-m-g0-foot.r\" d=\"^21\"/><path id=\"forward-lunge-m-g0-shcap.r\" d=\"^22\"/><path id=\"forward-lunge-m-g0-upper.r\" d=\"^23\"/><path id=\"forward-lunge-m-g0-elbowcap.r\" d=\"^24\"/><path id=\"forward-lunge-m-g0-fore.r\" d=\"^25\"/><path id=\"forward-lunge-m-g0-fist.r\" d=\"^26\"/><path id=\"forward-lunge-m-g0-eq2.dumbbell.1-0\" d=\"^11\"/><path id=\"forward-lunge-m-g0-eq2.dumbbell.2-1\" d=\"^12\"/><path id=\"forward-lunge-m-g1-eq1.dumbbell.1-0\" d=\"^27\"/><path id=\"forward-lunge-m-g1-eq1.dumbbell.2-1\" d=\"^28\"/><path id=\"forward-lunge-m-g1-thigh.l\" d=\"^29\"/><path id=\"forward-lunge-m-g1-kneecap.l\" d=\"^30\"/><path id=\"forward-lunge-m-g1-shank.l\" d=\"^31\"/><path id=\"forward-lunge-m-g1-foot.l\" d=\"^32\"/><path id=\"forward-lunge-m-g1-head\" d=\"^33\"/><path id=\"forward-lunge-m-g1-torso\" d=\"^34\"/><path id=\"forward-lunge-m-g1-thigh.r\" d=\"^35\"/><path id=\"forward-lunge-m-g1-kneecap.r\" d=\"^36\"/><path id=\"forward-lunge-m-g1-shank.r\" d=\"^37\"/><path id=\"forward-lunge-m-g1-foot.r\" d=\"^38\"/><path id=\"forward-lunge-m-g1-shcap.r\" d=\"^39\"/><path id=\"forward-lunge-m-g1-upper.r\" d=\"^40\"/><path id=\"forward-lunge-m-g1-elbowcap.r\" d=\"^41\"/><path id=\"forward-lunge-m-g1-fore.r\" d=\"^42\"/><path id=\"forward-lunge-m-g1-fist.r\" d=\"^43\"/><path id=\"forward-lunge-m-g1-eq2.dumbbell.1-0\" d=\"^27\"/><path id=\"forward-lunge-m-g1-eq2.dumbbell.2-1\" d=\"^28\"/><path id=\"forward-lunge-m-e-thigh.l\" d=\"^44\"/><path id=\"forward-lunge-m-e-kneecap.l\" d=\"^45\"/><path id=\"forward-lunge-m-e-shank.l\" d=\"^46\"/><path id=\"forward-lunge-m-e-foot.l\" d=\"^32\"/><path id=\"forward-lunge-m-e-shcap.l\" d=\"^47\"/><path id=\"forward-lunge-m-e-upper.l\" d=\"^48\"/><path id=\"forward-lunge-m-e-elbowcap.l\" d=\"^49\"/><path id=\"forward-lunge-m-e-fore.l\" d=\"^50\"/><path id=\"forward-lunge-m-e-fist.l\" d=\"^51\"/><path id=\"forward-lunge-m-e-head\" d=\"^52\"/><path id=\"forward-lunge-m-e-torso\" d=\"^53\"/><path id=\"forward-lunge-m-e-thigh.r\" d=\"^54\"/><path id=\"forward-lunge-m-e-kneecap.r\" d=\"^55\"/><path id=\"forward-lunge-m-e-shank.r\" d=\"^56\"/><path id=\"forward-lunge-m-e-foot.r\" d=\"^57\"/><path id=\"forward-lunge-m-e-shcap.r\" d=\"^47\"/><path id=\"forward-lunge-m-e-upper.r\" d=\"^48\"/><path id=\"forward-lunge-m-e-elbowcap.r\" d=\"^49\"/><path id=\"forward-lunge-m-e-fore.r\" d=\"^50\"/><path id=\"forward-lunge-m-e-fist.r\" d=\"^51\"/><path id=\"forward-lunge-m-m-head\" d=\"~#w12!GG1(RsEXE1VBsBkDiTjS8xbX3K3U4I4E8K7TbIgEnP5Rcz1V9Bjt(mxaYmB5SkF4JiwhT2yj0000002000000010120010000022002000000000000000010110100021000000\"/><path id=\"forward-lunge-m-m-torso\" d=\"~#_12wSE1DEx1)*E1G-vG9*6z35U8AiH9!6!bUgN6cB5Io*lx9)cy4Fg*3ylG5Dn-eSiTgF5I9B7IgEpRA1-9XrI6bR9f(bWgY2D8GcX8KgD7O7PkA6U6HdKaY2A8VU2Sr02100000200000000101000000100100002000010100100000000000101010000010110021200200000200010000021200210010101000200000\"/><path id=\"forward-lunge-m-m-thigh.l\" d=\"~#F12yFD1AOS1VzE1.FR1F6zavp*B1wS1U9x2S4E1NA1-D1HoO9ydIfP5OpPw1zH1gX4g.9GI1SK1w1o(8X7xgBtBI1!gGnJrX9HK100000010000000000000000020000000101000000020000000000001000010000001001110000000\"/><path id=\"forward-lunge-m-m-kneecap.l\" d=\"~~WXuJI*1_J10\"/><path id=\"forward-lunge-m-m-shank.l\" d=\"~#F12!Bw1w*.1*Ux1Ey!1WbF20F1x)1!2U7F6!3!2yz2X1JdY7wcc_d.6_y2_5y4V2y8V5.(1X64G1_bK1EbBdGo*dVlnzpSc20000200200100100000000100000002000002000000200010100200010101010110100000000000\"/><path id=\"forward-lunge-m-m-shcap.l\" d=\"~~AGE1PRD1wP10\"/><path id=\"forward-lunge-m-m-upper.l\" d=\"~#F12AGE1PRD1xHE1-KB1e.8c1H2WO1D3)5N1*2Y5RD1yaVi0OgxaViV5RD1O1*2B3)5I2WO191d.8Bgx1XdPp2PmUdPp00020000201210000010100101000020000000210100101000100200000002000000000000000000\"/><path id=\"forward-lunge-m-m-elbowcap.l\" d=\"~~(VE1A.O1Dz10\"/><path id=\"forward-lunge-m-m-fore.l\" d=\"~#F12NUE1W*O1OVE1RxO1y1Gaq_1S6yI1!2O9N1O2.1*w1w6EdpBbX7EcX2.w1X1E2B4x9dUI1j!1K2BaBakx9FkD1Dh!b_i11002000000100000010100101012000001200000200200000020000010000101200200000000011\"/><path id=\"forward-lunge-m-m-fist.l\" d=\"~~wOF1NT-1ww10\"/><path id=\"forward-lunge-m-m-thigh.r\" d=\"~#F12A-E1AKW1)GD1zIW1.be3D1U(1D4)6-6R3E3OU1)8ElxfxkO2GoN9xV1*3E4D2O8w5_*1Ab6E1ObE3OfPt!B1_qWz1J4DI1Xg20220020000101200000100000002000000000101001110000000000000000000000020000100200\"/><path id=\"forward-lunge-m-m-kneecap.r\" d=\"~~Y_S1!PV1_J10\"/><path id=\"forward-lunge-m-m-shank.r\" d=\"~#F12y)S1F_U1I-T1.ST1J7I9w1iIqH-1w9*3H4x2NtG!1wdG8_5KaaOf(z1RY1f-4I1X9*y1SU1z1jD4Bb.gw4RnwfVawjdws00000001110000001000000000100010100000000000000000000000000002022000011002000000\"/><path id=\"forward-lunge-m-m-shcap.r\" d=\"^76\"/><path id=\"forward-lunge-m-m-upper.r\" d=\"^77\"/><path id=\"forward-lunge-m-m-elbowcap.r\" d=\"^78\"/><path id=\"forward-lunge-m-m-fore.r\" d=\"^79\"/><path id=\"forward-lunge-m-m-fist.r\" d=\"^80\"/><path id=\"forward-lunge-m-m-eq0\" d=\"~MFVE1yy_1LPT30QF60EK3E6LE6OaQ0E6E6PaLEK3F6QE60FK3F6LF6PaQ0F6F6OaZ\"/><path id=\"forward-lunge-m-m-eq1\" d=\"~MDHE1HAY1LEK10QI90!z1J9LJ9Ay2Q0J9J9zy2L!z1I9QJ90.z1I9LI9zy2Q0I9I9Ay2Z\"/><path id=\"forward-lunge-m-m-eq2\" d=\"~M_TI1Sy.1LFK10QJ90.z1I9LI9zy2Q0I9I9Ay2L.z1J9QI90!z1J9LJ9Ay2Q0J9J9zy2Z\"/><path id=\"forward-lunge-m-m-eq3\" d=\"^84\"/><path id=\"forward-lunge-m-m-eq4\" d=\"^85\"/><path id=\"forward-lunge-m-m-eq5\" d=\"^86\"/><path id=\"forward-lunge-m-mf-foot.l\" d=\"^32\"/><path id=\"forward-lunge-m-mf-foot.r\" d=\"^57\"/><path id=\"forward-lunge-m-mo-0\" d=\"^52\"/><path id=\"forward-lunge-m-mo-1\" d=\"^53\"/><path id=\"forward-lunge-m-mo-2\" d=\"^44\"/><path id=\"forward-lunge-m-mo-3\" d=\"^45\"/><path id=\"forward-lunge-m-mo-4\" d=\"^46\"/><path id=\"forward-lunge-m-mo-5\" d=\"^32\"/><path id=\"forward-lunge-m-mo-6\" d=\"^47\"/><path id=\"forward-lunge-m-mo-7\" d=\"^48\"/><path id=\"forward-lunge-m-mo-8\" d=\"^49\"/><path id=\"forward-lunge-m-mo-9\" d=\"^50\"/><path id=\"forward-lunge-m-mo-10\" d=\"^51\"/><path id=\"forward-lunge-m-mo-11\" d=\"^54\"/><path id=\"forward-lunge-m-mo-12\" d=\"^55\"/><path id=\"forward-lunge-m-mo-13\" d=\"^56\"/><path id=\"forward-lunge-m-mo-14\" d=\"^57\"/><path id=\"forward-lunge-m-mo-15\" d=\"^47\"/><path id=\"forward-lunge-m-mo-16\" d=\"^48\"/><path id=\"forward-lunge-m-mo-17\" d=\"^49\"/><path id=\"forward-lunge-m-mo-18\" d=\"^50\"/><path id=\"forward-lunge-m-mo-19\" d=\"^51\"/><path id=\"forward-lunge-m-mo-20\" d=\"^61\"/><path id=\"forward-lunge-m-mo-21\" d=\"^62\"/><path id=\"forward-lunge-m-mo-22\" d=\"^63\"/><path id=\"forward-lunge-m-mo-23\" d=\"^61\"/><path id=\"forward-lunge-m-mo-24\" d=\"^62\"/><path id=\"forward-lunge-m-mo-25\" d=\"^63\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#forward-lunge-m-dots)\"/>\n  <path class=\"floorline\" d=\"^58\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-st-thigh.l\"/><use href=\"#forward-lunge-m-st-kneecap.l\"/><use href=\"#forward-lunge-m-st-shank.l\"/><use href=\"#forward-lunge-m-st-foot.l\"/><use href=\"#forward-lunge-m-st-shcap.l\"/><use href=\"#forward-lunge-m-st-upper.l\"/><use href=\"#forward-lunge-m-st-elbowcap.l\"/><use href=\"#forward-lunge-m-st-fore.l\"/><use href=\"#forward-lunge-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-st-thigh.l\"/><use href=\"#forward-lunge-m-st-kneecap.l\"/><use href=\"#forward-lunge-m-st-shank.l\"/><use href=\"#forward-lunge-m-st-foot.l\"/><use href=\"#forward-lunge-m-st-shcap.l\"/><use href=\"#forward-lunge-m-st-upper.l\"/><use href=\"#forward-lunge-m-st-elbowcap.l\"/><use href=\"#forward-lunge-m-st-fore.l\"/><use href=\"#forward-lunge-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-st-head\"/><use href=\"#forward-lunge-m-st-torso\"/><use href=\"#forward-lunge-m-st-thigh.r\"/><use href=\"#forward-lunge-m-st-kneecap.r\"/><use href=\"#forward-lunge-m-st-shank.r\"/><use href=\"#forward-lunge-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-st-head\"/><use href=\"#forward-lunge-m-st-torso\"/><use href=\"#forward-lunge-m-st-thigh.r\"/><use href=\"#forward-lunge-m-st-kneecap.r\"/><use href=\"#forward-lunge-m-st-shank.r\"/><use href=\"#forward-lunge-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-st-shcap.r\"/><use href=\"#forward-lunge-m-st-upper.r\"/><use href=\"#forward-lunge-m-st-elbowcap.r\"/><use href=\"#forward-lunge-m-st-fore.r\"/><use href=\"#forward-lunge-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-st-shcap.r\"/><use href=\"#forward-lunge-m-st-upper.r\"/><use href=\"#forward-lunge-m-st-elbowcap.r\"/><use href=\"#forward-lunge-m-st-fore.r\"/><use href=\"#forward-lunge-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-solid\" d=\"^59\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-g0-eq1.dumbbell.1-0\"/><use href=\"#forward-lunge-m-g0-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-g0-eq1.dumbbell.1-0\"/><use href=\"#forward-lunge-m-g0-eq1.dumbbell.2-1\"/></g></g><g class=\"far\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-g0-thigh.l\"/><use href=\"#forward-lunge-m-g0-kneecap.l\"/><use href=\"#forward-lunge-m-g0-shank.l\"/><use href=\"#forward-lunge-m-g0-foot.l\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-g0-thigh.l\"/><use href=\"#forward-lunge-m-g0-kneecap.l\"/><use href=\"#forward-lunge-m-g0-shank.l\"/><use href=\"#forward-lunge-m-g0-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-g0-head\"/><use href=\"#forward-lunge-m-g0-torso\"/><use href=\"#forward-lunge-m-g0-thigh.r\"/><use href=\"#forward-lunge-m-g0-kneecap.r\"/><use href=\"#forward-lunge-m-g0-shank.r\"/><use href=\"#forward-lunge-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-g0-head\"/><use href=\"#forward-lunge-m-g0-torso\"/><use href=\"#forward-lunge-m-g0-thigh.r\"/><use href=\"#forward-lunge-m-g0-kneecap.r\"/><use href=\"#forward-lunge-m-g0-shank.r\"/><use href=\"#forward-lunge-m-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-g0-shcap.r\"/><use href=\"#forward-lunge-m-g0-upper.r\"/><use href=\"#forward-lunge-m-g0-elbowcap.r\"/><use href=\"#forward-lunge-m-g0-fore.r\"/><use href=\"#forward-lunge-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-g0-shcap.r\"/><use href=\"#forward-lunge-m-g0-upper.r\"/><use href=\"#forward-lunge-m-g0-elbowcap.r\"/><use href=\"#forward-lunge-m-g0-fore.r\"/><use href=\"#forward-lunge-m-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^59\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-g0-eq2.dumbbell.1-0\"/><use href=\"#forward-lunge-m-g0-eq2.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-g0-eq2.dumbbell.1-0\"/><use href=\"#forward-lunge-m-g0-eq2.dumbbell.2-1\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-solid\" d=\"^60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-g1-eq1.dumbbell.1-0\"/><use href=\"#forward-lunge-m-g1-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-g1-eq1.dumbbell.1-0\"/><use href=\"#forward-lunge-m-g1-eq1.dumbbell.2-1\"/></g></g><g class=\"far\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-g1-thigh.l\"/><use href=\"#forward-lunge-m-g1-kneecap.l\"/><use href=\"#forward-lunge-m-g1-shank.l\"/><use href=\"#forward-lunge-m-g1-foot.l\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-g1-thigh.l\"/><use href=\"#forward-lunge-m-g1-kneecap.l\"/><use href=\"#forward-lunge-m-g1-shank.l\"/><use href=\"#forward-lunge-m-g1-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-g1-head\"/><use href=\"#forward-lunge-m-g1-torso\"/><use href=\"#forward-lunge-m-g1-thigh.r\"/><use href=\"#forward-lunge-m-g1-kneecap.r\"/><use href=\"#forward-lunge-m-g1-shank.r\"/><use href=\"#forward-lunge-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-g1-head\"/><use href=\"#forward-lunge-m-g1-torso\"/><use href=\"#forward-lunge-m-g1-thigh.r\"/><use href=\"#forward-lunge-m-g1-kneecap.r\"/><use href=\"#forward-lunge-m-g1-shank.r\"/><use href=\"#forward-lunge-m-g1-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-g1-shcap.r\"/><use href=\"#forward-lunge-m-g1-upper.r\"/><use href=\"#forward-lunge-m-g1-elbowcap.r\"/><use href=\"#forward-lunge-m-g1-fore.r\"/><use href=\"#forward-lunge-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-g1-shcap.r\"/><use href=\"#forward-lunge-m-g1-upper.r\"/><use href=\"#forward-lunge-m-g1-elbowcap.r\"/><use href=\"#forward-lunge-m-g1-fore.r\"/><use href=\"#forward-lunge-m-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-g1-eq2.dumbbell.1-0\"/><use href=\"#forward-lunge-m-g1-eq2.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-g1-eq2.dumbbell.1-0\"/><use href=\"#forward-lunge-m-g1-eq2.dumbbell.2-1\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-solid\" d=\"^61\"/><path class=\"disc\" d=\"^62\"/><path class=\"disc\" d=\"^63\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-e-thigh.l\"/><use href=\"#forward-lunge-m-e-kneecap.l\"/><use href=\"#forward-lunge-m-e-shank.l\"/><use href=\"#forward-lunge-m-e-foot.l\"/><use href=\"#forward-lunge-m-e-shcap.l\"/><use href=\"#forward-lunge-m-e-upper.l\"/><use href=\"#forward-lunge-m-e-elbowcap.l\"/><use href=\"#forward-lunge-m-e-fore.l\"/><use href=\"#forward-lunge-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-e-thigh.l\"/><use href=\"#forward-lunge-m-e-kneecap.l\"/><use href=\"#forward-lunge-m-e-shank.l\"/><use href=\"#forward-lunge-m-e-foot.l\"/><use href=\"#forward-lunge-m-e-shcap.l\"/><use href=\"#forward-lunge-m-e-upper.l\"/><use href=\"#forward-lunge-m-e-elbowcap.l\"/><use href=\"#forward-lunge-m-e-fore.l\"/><use href=\"#forward-lunge-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-e-head\"/><use href=\"#forward-lunge-m-e-torso\"/><use href=\"#forward-lunge-m-e-thigh.r\"/><use href=\"#forward-lunge-m-e-kneecap.r\"/><use href=\"#forward-lunge-m-e-shank.r\"/><use href=\"#forward-lunge-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-e-head\"/><use href=\"#forward-lunge-m-e-torso\"/><use href=\"#forward-lunge-m-e-thigh.r\"/><use href=\"#forward-lunge-m-e-kneecap.r\"/><use href=\"#forward-lunge-m-e-shank.r\"/><use href=\"#forward-lunge-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-e-shcap.r\"/><use href=\"#forward-lunge-m-e-upper.r\"/><use href=\"#forward-lunge-m-e-elbowcap.r\"/><use href=\"#forward-lunge-m-e-fore.r\"/><use href=\"#forward-lunge-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#forward-lunge-m-e-shcap.r\"/><use href=\"#forward-lunge-m-e-upper.r\"/><use href=\"#forward-lunge-m-e-elbowcap.r\"/><use href=\"#forward-lunge-m-e-fore.r\"/><use href=\"#forward-lunge-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^61\"/><path class=\"disc\" d=\"^62\"/><path class=\"disc\" d=\"^63\"/><circle class=\"joint\" cx=\"184.22\" cy=\"197.36\" r=\"2.25\"/><circle class=\"joint\" cx=\"184.22\" cy=\"244.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"180.6\" cy=\"266.38\" r=\"2.25\"/><circle class=\"joint\" cx=\"243.32\" cy=\"266.41\" r=\"2.25\"/></g><mask id=\"forward-lunge-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#forward-lunge-m-m-head\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-torso\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-thigh.l\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-shank.l\" fill=\"#000\"/><use href=\"#forward-lunge-m-mf-foot.l\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-shcap.l\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-upper.l\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-fore.l\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-fist.l\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-thigh.r\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-shank.r\" fill=\"#000\"/><use href=\"#forward-lunge-m-mf-foot.r\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-shcap.r\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-upper.r\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-fore.r\" fill=\"#000\"/><use href=\"#forward-lunge-m-m-fist.r\" fill=\"#000\"/><use href=\"#forward-lunge-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#forward-lunge-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#forward-lunge-m-mmask)\"><g class=\"u-stroke\"><use href=\"#forward-lunge-m-m-head\"/><use href=\"#forward-lunge-m-m-torso\"/><use href=\"#forward-lunge-m-m-thigh.l\"/><use href=\"#forward-lunge-m-m-kneecap.l\"/><use href=\"#forward-lunge-m-m-shank.l\"/><use href=\"#forward-lunge-m-m-shcap.l\"/><use href=\"#forward-lunge-m-m-upper.l\"/><use href=\"#forward-lunge-m-m-elbowcap.l\"/><use href=\"#forward-lunge-m-m-fore.l\"/><use href=\"#forward-lunge-m-m-fist.l\"/><use href=\"#forward-lunge-m-m-thigh.r\"/><use href=\"#forward-lunge-m-m-kneecap.r\"/><use href=\"#forward-lunge-m-m-shank.r\"/><use href=\"#forward-lunge-m-m-shcap.r\"/><use href=\"#forward-lunge-m-m-upper.r\"/><use href=\"#forward-lunge-m-m-elbowcap.r\"/><use href=\"#forward-lunge-m-m-fore.r\"/><use href=\"#forward-lunge-m-m-fist.r\"/><use href=\"#forward-lunge-m-m-eq0\"/><use href=\"#forward-lunge-m-m-eq1\"/><use href=\"#forward-lunge-m-m-eq2\"/><use href=\"#forward-lunge-m-m-eq3\"/><use href=\"#forward-lunge-m-m-eq4\"/><use href=\"#forward-lunge-m-m-eq5\"/></g></g><g class=\"mistake-layer\"><path class=\"leader m\" d=\"~MSEU1!PV1L0.X2\"/><path class=\"leader m\" d=\"M252.09 301.54L267 312H277\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"forward-lunge-m-knee\" data-key=\"knee\" data-cue=\"The hips and front knee drive forward, and the shin tips far over the foot.\" class=\"plate-callout two m\" style=\"left:73.74%;top:61.45%\" aria-pressed=\"true\">Knee drives<br>forward</button><button type=\"button\" id=\"forward-lunge-m-shin\" data-key=\"shin\" data-cue=\"The front shin tips far forward over the foot.\" class=\"plate-callout two m\" style=\"left:75.98%;top:81.01%\" aria-pressed=\"false\">Shin tips<br>forward</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "hips",
        cues: [{ key: "hips", cue: "Drop the hips toward the floor rather than driving them forward." }, { key: "shin", cue: "Step long enough that the front shin is about vertical." }, { key: "back", cue: "Keep the back straight as you step." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "knee",
        cues: [{ key: "knee", cue: "The hips and front knee drive forward, and the shin tips far over the foot." }, { key: "shin", cue: "The front shin tips far forward over the foot." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Knee drives forward</b><span>The hips and front knee drive forward, and the shin tips far over the foot.</span></li><li><b>Shin tips forward</b><span>The front shin tips far forward over the foot.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: step slow, lower smooth, rise\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Step</b><span>Slow</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>Smooth</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Rise</b><span>&nbsp;</span></div></div></div>",
      alt: "Forward lunge with dumbbells, side view. From standing, one leg steps forward and lands heel first, and the body lowers until the front thigh is parallel and the back knee is just off the floor, front shin near vertical, back foot on the ball, back straight.",
      mistakeAlt: "Forward Lunge: the common mistake, drawn dashed in the mistake colour over the correct end position.",
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
      "kind": "position",
      "text": "Feet hip width, dumbbells at your sides, palms facing in.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lunge-db",
          "ace-fwdlunge-bb"
        ],
        "note": "c5 (card grip.type), c1"
      }
    },
    {
      "kind": "position",
      "text": "Step forward heel first, moving the weight onto it slowly.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bw"
        ],
        "note": "c4"
      }
    },
    {
      "kind": "position",
      "text": "Lower slowly, hips straight down, back knee almost to the floor.",
      "zoom": "front-shin",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bb",
          "ace-fwdlunge-bw",
          "cat-lunge"
        ],
        "note": "c1, c3, c7"
      }
    },
    {
      "kind": "position",
      "text": "Push through the front foot and step back to the start.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bb",
          "cat-lunge"
        ],
        "note": "c1, c2"
      }
    },
    {
      "kind": "finish",
      "text": "Alternate legs. Keep the back straight throughout.",
      "zoom": "back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bb",
          "ace-lunge-db"
        ],
        "note": "c1, c5"
      }
    }
  ],
  posture: [
    {
      "key": "shin",
      "label": "Front shin vertical",
      "detail": "Step long enough that the front shin is about vertical at the bottom.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "front-shin",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-lunge"
        ],
        "note": "c2"
      }
    },
    {
      "key": "hips",
      "label": "Hips drop down",
      "detail": "Hips lower down, not forward. Land heel first and drop the hips straight down.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "zoom": "front-shin",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-fwdlunge-bw"
        ],
        "note": "c3, c4"
      }
    },
    {
      "key": "back",
      "label": "Back straight",
      "detail": "Back straight. Go lighter until you can stay upright and controlled.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "zoom": "back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lunge-db",
          "cat-lunge"
        ],
        "note": "c5, c6"
      }
    },
    {
      "key": "drop",
      "label": "Dropping fast",
      "detail": "Lower slowly. Use a weight you can move smoothly.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-lunge"
        ],
        "note": "c7, c6"
      }
    },
    {
      "key": "step",
      "label": "Step length",
      "detail": "A longer step works the glutes and hamstrings more. A shorter one, the quads.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-lunge"
        ],
        "note": "c13"
      }
    }
  ],
  zooms: [
    {
      "key": "front-shin",
      "chip": "Shin",
      "heading": "Front shin",
      "kind": "posture"
    },
    {
      "key": "back",
      "chip": "Back",
      "heading": "Back position",
      "kind": "posture",
      "feelRow": "lower-back"
    }
  ],
  chips: [
    "front-shin",
    "back",
    "feel"
  ],
  copy: {
    "setupLine": "Feet hip width, a dumbbell in each hand, palms in. Step forward, heel first.",
    "mistakeLine": "Never drive the hips forward. Land heel first and drop the hips straight down.",
    "cueLine": "Hips down, front shin vertical.",
    "variantLine": "Same step with a barbell instead of dumbbells."
  },
  mistakes: [],
  risks: [
    {
      "key": "kneecap",
      "text": "More kneecap-joint load than the reverse lunge.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "goulette-2021"
        ],
        "note": "c8"
      }
    },
    {
      "key": "heavy",
      "text": "Too heavy a load costs the upright trunk, the controlled descent and balance.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-lunge"
        ],
        "note": "c6"
      }
    },
    {
      "key": "crash",
      "text": "Crashing into the bottom position instead of lowering under control.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "cat-lunge"
        ],
        "note": "c7"
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
    "ace-fwdlunge-bb",
    "cat-lunge",
    "ace-fwdlunge-bw",
    "ace-lunge-db",
    "goulette-2021",
    "escamilla-2025",
    "bezerra-2021",
    "nhs-knee",
    "nhs-knee-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/forward_lunge.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

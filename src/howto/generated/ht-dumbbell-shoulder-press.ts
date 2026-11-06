// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=6e0f49140f3b02f867d5d3a91577c0a9aecc8269e554f3c494404d657e1daabd
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_dumbbell_shoulder_press",
  name: "Seated Dumbbell Shoulder Press",
  hashes: { inputsSha256: "6e0f49140f3b02f867d5d3a91577c0a9aecc8269e554f3c494404d657e1daabd", golden: "d3694df987b64f503bd39b3fd70abc50c499dc480d144791bd0b0a1fb873c893" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-shoulder-press-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-shoulder-press-n-st-upper.l\" d=\"~#F12YKt_WD1G*s*xD1)3I5a3UoNpdI59V2T9EkK4-kRaRc-j.7Ii-cO2pG5E1wlPs78R4-4)iU2w6JsNeDhwrWa00000000220011000000010010100000200000002020000210011000000021000000101002200000\"/><path id=\"dumbbell-shoulder-press-n-st-elbowcap.l\" d=\"~~w(x1!wI1Dz10\"/><path id=\"dumbbell-shoulder-press-n-st-fore.l\" d=\"~#F12PBA1Y_H1BEA1TWI12Hax1X1Ra.G1)1Y9B1P2(4Fw1T4Wd_1yb(8PbY5yw1w2w2y5P8V3)H1e)1H3_9AaG1A7)k-2xhTdRh10002000011012020001000000010101000200001000210021020000001000000002000100001002\"/><path id=\"dumbbell-shoulder-press-n-st-fist.l\" d=\"~~!Kw1WNx1ww10\"/><path id=\"dumbbell-shoulder-press-n-st-upper.r\" d=\"^0\"/><path id=\"dumbbell-shoulder-press-n-st-elbowcap.r\" d=\"^1\"/><path id=\"dumbbell-shoulder-press-n-st-fore.r\" d=\"^2\"/><path id=\"dumbbell-shoulder-press-n-st-fist.r\" d=\"^3\"/><path id=\"dumbbell-shoulder-press-n-g0-upper.r\" d=\"~#F12DOuWEE1x*tOBE1O4n09Pon.2G3I1R1z6E6*hEbOgz1IjY8.6F5R1J1G3(2Aoy40aR44Tj!eSoPfJmN1Pq.b02020000000000000000200120022012000000210000200000000200000000100010100100000210\"/><path id=\"dumbbell-shoulder-press-n-g0-elbowcap.r\" d=\"~~yEy1FyD1Dz10\"/><path id=\"dumbbell-shoulder-press-n-g0-fore.r\" d=\"~#F12JKA1FXB1)RA1*OD1A1D9B1G1*e-z1r(8rP2W7DqV2FeH3WaJaDaS8(pD2P1!5!6B8*B16-1J4F8Ua0F4XlB5Og.fOf10002000000200000000201010000011100002101000202000000000000000110000021110100000\"/><path id=\"dumbbell-shoulder-press-n-g0-fist.r\" d=\"~~wXvNYtww10\"/><path id=\"dumbbell-shoulder-press-n-g0-eq9.dumbbell.0-0\" d=\"~MNKy1NYtLEryO1LzrxO1LDrxO1LJW11LDrAO1Z\"/><path id=\"dumbbell-shoulder-press-n-g1-upper.r\" d=\"~#F12HVv_YD1KDvBEE1.3N375AhTlT4cE26Tb(3BkY6Eb(bT5PkE3!b1F23U4UkGi68z3w4k!mSrB9JfEgS7)r21010000121000000200010000000000201000000022001000000010102001010000000010000000\"/><path id=\"dumbbell-shoulder-press-n-g1-elbowcap.r\" d=\"~~FBx1!_x1Dz10\"/><path id=\"dumbbell-shoulder-press-n-g1-fore.r\" d=\"~#F12_Iz1UPx1KOz1XEy1oW8z1G1KdRx1B1P8x1F2H6Fn)2FeA3YaDaJaA7yny2J1U5J6X6Iz1cX1(3U7Dby2U4-l-4KgRf*f00200021010101220001000100000200000002001110012100001220011001000000000200010101\"/><path id=\"dumbbell-shoulder-press-n-g1-fist.r\" d=\"~~AwvAyqww10\"/><path id=\"dumbbell-shoulder-press-n-g1-eq9.dumbbell.0-0\" d=\"~MSWx1AyqLBrAO1LErzO1LFrzO1LJW12LFryO1Z\"/><path id=\"dumbbell-shoulder-press-n-g2-upper.r\" d=\"~#F12Pww1HBD1TXvEwE1O2W671H8.A1I4S3)1(1RcFm*eDfR4_fH4_kI1PpmW2W1N5!cRz1c2T1(6DdUcJkTkF6Rl)5Gs00001002202000012100221010100000001010002010100000000001000010100002000000000000\"/><path id=\"dumbbell-shoulder-press-n-g2-elbowcap.r\" d=\"~~NRvNVuDz10\"/><path id=\"dumbbell-shoulder-press-n-g2-fore.r\" d=\"~#F12(Yx1POu.-x1XEv7w9vO1K9EA1E2N8E1H2W3PpV4Wd_1yb_8SbS4Hp(1Y1_4H7R2IB1gV1y3N8WaJ2F7)k-2)gOdTh00002000010000000000000000100000000000000100200020000202001000000100001010000000\"/><path id=\"dumbbell-shoulder-press-n-g2-fist.r\" d=\"~~HGu!Imww10\"/><path id=\"dumbbell-shoulder-press-n-g2-eq9.dumbbell.0-0\" d=\"~MW)w1!ImLBrAO1LBrzO1LArzO1LPW10LArAO1Z\"/><path id=\"dumbbell-shoulder-press-n-e-thigh.l\" d=\"~#F12HTx1!*U1BAw1x!U1.bc3F1W(1(3x7.6T3z3KU1-8Il)exkG2GoS9xV1X3E4H2K8(4!*1!a4E1ObB3GfStwD1UqUz1D4FI1)g00000120000200200000022101010000101000000100000100001200000010010100100101012000\"/><path id=\"dumbbell-shoulder-press-n-e-kneecap.l\" d=\"~~_UJ1U)T1_J10\"/><path id=\"dumbbell-shoulder-press-n-e-shank.l\" d=\"~#F12HTJ1Y!T1)-J1-KS1S2XbF14uA)1N6O7w3X3exz2A8zdm*bI6xe_7Ty2K2x4O5B8X8N(1E10x1*bRd!aVe_nI1WlWbNp00000010001000000000000000000210100020000000000200010100101010101200001000001010\"/><path id=\"dumbbell-shoulder-press-n-e-foot.l\" d=\"~#o2NJJ1DB)1x(J1EB(1!cF3Ph)7Wp*nS-2E3-J2-4ID1)7)n0TG1_4BbXc_sEbKmUp200022100200020001010000000000100010121010101001\"/><path id=\"dumbbell-shoulder-press-n-e-shcap.l\" d=\"~~Nyt_XB1wP10\"/><path id=\"dumbbell-shoulder-press-n-e-upper.l\" d=\"~#F12Nyw1_XB1Oxw1O.D1d(890I2TO1z3w6O1(2X5PD1xaWi0Ngya_iW5ND1P1(2A3(5N2OO181g(8Dgy1YdOp0KmXdTp00000000000000000200100200000000000200110100010110121000110101000000000010100002\"/><path id=\"dumbbell-shoulder-press-n-e-elbowcap.l\" d=\"~~JOtNNsDz10\"/><path id=\"dumbbell-shoulder-press-n-e-fore.l\" d=\"~#F12JXvHNsOUvGHtT1Fap.1R3II1R3H9R1J2b(w1-6_c0Fb(6Wcgwx1W1J2P3F9J3II1q.1W1FaDa4JaRj0EhOaRj10000010100200000000000000000000000100000000000110000200010010101110000021210000\"/><path id=\"dumbbell-shoulder-press-n-e-fist.l\" d=\"~~URtSViww10\"/><path id=\"dumbbell-shoulder-press-n-e-head\" d=\"~#w12WHsSUr*WqO_rVc(nKf!eVbaT1P5*6E6)aG8InBgoTdI4V8GiU5yiEhPj-c_kx3ynS9D4_i0001000020000000210001000001000010000101000002010010101000000000\"/><path id=\"dumbbell-shoulder-press-n-e-torso\" d=\"~#_12!GswUw1GBs.AvObz2x7O2Wc!cPb(7!f(cF6I1GbxmOnB3RbH7Ue)7yjRaSiGkSd.kW2Kazb*d*x1-sVgEoB6J1I9(1_fwd_4D7EeB5Gd_dR2yjY5E1J7K9Y6Aa)B2FX100021001000000200020000010100000200100000222000000000101002000101012100200010100020000010101000002000100000020001210\"/><path id=\"dumbbell-shoulder-press-n-e-thigh.r\" d=\"^19\"/><path id=\"dumbbell-shoulder-press-n-e-kneecap.r\" d=\"^20\"/><path id=\"dumbbell-shoulder-press-n-e-shank.r\" d=\"^21\"/><path id=\"dumbbell-shoulder-press-n-e-foot.r\" d=\"^22\"/><path id=\"dumbbell-shoulder-press-n-e-shcap.r\" d=\"^23\"/><path id=\"dumbbell-shoulder-press-n-e-upper.r\" d=\"^24\"/><path id=\"dumbbell-shoulder-press-n-e-elbowcap.r\" d=\"^25\"/><path id=\"dumbbell-shoulder-press-n-e-fore.r\" d=\"^26\"/><path id=\"dumbbell-shoulder-press-n-e-fist.r\" d=\"^27\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-shoulder-press-n-dots)\"/>\n  <path class=\"floorline\" d=\"M60.29 339.5H308.97\"/><path class=\"eq\" d=\"~MDUjNUx2LDGo0Q_m0ISn-mL-m_mQ0.m-m.mLISn!mQ-m0JSn!mL_m.mQ0_m_m_mZ\"/><path class=\"eq\" d=\"~M!GjYDy2LWU20QPc0BF2OcLOcS4Q0OcOcR4LBF2PcQOc0DF2PcLPcR4Q0PcPcS4Z\"/><path class=\"eq\" d=\"~MwTG1YDy2LWU20QPc0BF2OcLOcS4Q0OcOcR4LBF2PcQOc0DF2PcLPcR4Q0PcPcS4Z\"/><path class=\"eq\" d=\"~MSTy1DXX1L0SO8Q0!m!mVY7L.m.mQ!m0!m.mL.mVY7Q0.m.mWY7L!m!mQ.m0.m!mZ\"/><path class=\"eq\" d=\"~MWwqWJJ1LEI1N*jQE1FiF!1*GjL)gOjQFiF1Pj)gLYnKJjQF1EiE!1(GjLwhPjQEiE1OjwhZ\"/><path class=\"eq\" d=\"~MHJuNUV1L.)3zVmQG4To(y3_wmLAfYmQToJ4K6SqLyU4yYlQJ4Uo-y3XwmLEfXmQUoI4S6OqZ\"/><path class=\"eq\" d=\"~MDRvWVX1L(S8KP1QSoI4V(7NjLVmFfQG4ToOqR6L)V7_A2QToH4W(7RjLWmzfQH4UoPqN6Z\"/><path class=\"arc measure\" d=\"M156.57 145.67L156.56 163.67A18 18 0 0 1 156.52 127.67Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-n-st-upper.l\"/><use href=\"#dumbbell-shoulder-press-n-st-elbowcap.l\"/><use href=\"#dumbbell-shoulder-press-n-st-fore.l\"/><use href=\"#dumbbell-shoulder-press-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-n-st-upper.l\"/><use href=\"#dumbbell-shoulder-press-n-st-elbowcap.l\"/><use href=\"#dumbbell-shoulder-press-n-st-fore.l\"/><use href=\"#dumbbell-shoulder-press-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-n-st-upper.r\"/><use href=\"#dumbbell-shoulder-press-n-st-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-n-st-fore.r\"/><use href=\"#dumbbell-shoulder-press-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-n-st-upper.r\"/><use href=\"#dumbbell-shoulder-press-n-st-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-n-st-fore.r\"/><use href=\"#dumbbell-shoulder-press-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-n-g0-upper.r\"/><use href=\"#dumbbell-shoulder-press-n-g0-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-n-g0-fore.r\"/><use href=\"#dumbbell-shoulder-press-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-n-g0-upper.r\"/><use href=\"#dumbbell-shoulder-press-n-g0-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-n-g0-fore.r\"/><use href=\"#dumbbell-shoulder-press-n-g0-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-n-g0-eq9.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-n-g0-eq9.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-n-g1-upper.r\"/><use href=\"#dumbbell-shoulder-press-n-g1-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-n-g1-fore.r\"/><use href=\"#dumbbell-shoulder-press-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-n-g1-upper.r\"/><use href=\"#dumbbell-shoulder-press-n-g1-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-n-g1-fore.r\"/><use href=\"#dumbbell-shoulder-press-n-g1-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-n-g1-eq9.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-n-g1-eq9.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-n-g2-upper.r\"/><use href=\"#dumbbell-shoulder-press-n-g2-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-n-g2-fore.r\"/><use href=\"#dumbbell-shoulder-press-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-n-g2-upper.r\"/><use href=\"#dumbbell-shoulder-press-n-g2-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-n-g2-fore.r\"/><use href=\"#dumbbell-shoulder-press-n-g2-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-n-g2-eq9.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-n-g2-eq9.dumbbell.0-0\"/></g></g></g><g class=\"pose-end\"><path class=\"disc\" d=\"~MyFw1SViLErAO1LzrzO1LDrzO1LJW10LDrAO1Z\"/><path class=\"disc-core\" d=\"~~DzuSViNe0\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-n-e-thigh.l\"/><use href=\"#dumbbell-shoulder-press-n-e-kneecap.l\"/><use href=\"#dumbbell-shoulder-press-n-e-shank.l\"/><use href=\"#dumbbell-shoulder-press-n-e-foot.l\"/><use href=\"#dumbbell-shoulder-press-n-e-shcap.l\"/><use href=\"#dumbbell-shoulder-press-n-e-upper.l\"/><use href=\"#dumbbell-shoulder-press-n-e-elbowcap.l\"/><use href=\"#dumbbell-shoulder-press-n-e-fore.l\"/><use href=\"#dumbbell-shoulder-press-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-n-e-thigh.l\"/><use href=\"#dumbbell-shoulder-press-n-e-kneecap.l\"/><use href=\"#dumbbell-shoulder-press-n-e-shank.l\"/><use href=\"#dumbbell-shoulder-press-n-e-foot.l\"/><use href=\"#dumbbell-shoulder-press-n-e-shcap.l\"/><use href=\"#dumbbell-shoulder-press-n-e-upper.l\"/><use href=\"#dumbbell-shoulder-press-n-e-elbowcap.l\"/><use href=\"#dumbbell-shoulder-press-n-e-fore.l\"/><use href=\"#dumbbell-shoulder-press-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-n-e-head\"/><use href=\"#dumbbell-shoulder-press-n-e-torso\"/><use href=\"#dumbbell-shoulder-press-n-e-thigh.r\"/><use href=\"#dumbbell-shoulder-press-n-e-kneecap.r\"/><use href=\"#dumbbell-shoulder-press-n-e-shank.r\"/><use href=\"#dumbbell-shoulder-press-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-n-e-head\"/><use href=\"#dumbbell-shoulder-press-n-e-torso\"/><use href=\"#dumbbell-shoulder-press-n-e-thigh.r\"/><use href=\"#dumbbell-shoulder-press-n-e-kneecap.r\"/><use href=\"#dumbbell-shoulder-press-n-e-shank.r\"/><use href=\"#dumbbell-shoulder-press-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-n-e-shcap.r\"/><use href=\"#dumbbell-shoulder-press-n-e-upper.r\"/><use href=\"#dumbbell-shoulder-press-n-e-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-n-e-fore.r\"/><use href=\"#dumbbell-shoulder-press-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-n-e-shcap.r\"/><use href=\"#dumbbell-shoulder-press-n-e-upper.r\"/><use href=\"#dumbbell-shoulder-press-n-e-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-n-e-fore.r\"/><use href=\"#dumbbell-shoulder-press-n-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"~MWJtAUD1LtK1L00L02L01L00L02L01Li7L22L01L10L20L02L11L20L02L11L20Lk0L22L11\"/><path class=\"eq-line m-line\" d=\"~MYAtAJB1LcV1L12L01L20LiaL01L00L02L01L00L02L21L10L02L01Lgg\"/><path class=\"eq-line m-line\" d=\"~MDWtASA1LJ1vL22L00L10L20L00L10LaiL02L10L21L02L10L21L02L00L11L22L0kL12L21L00L02L11L20L02L01L10L22L7iL10L20L00L10L20L02L11L20L10L20Lfg\"/><path class=\"eq-line m-line\" d=\"~MYKt_WD1LA1J1L10L22L11L20L10L22L11L20L10L22L11L20L12L21L02L01L02L01L22L11L02L00L01L02L01L22L11L20L12L21L10L20L12L21L10L22L03L00L20L10L00L20L10L00L20L10L00L00L22L11L00L20L10L00L00L20L10L00L20L10L00L02L21L10L00L20L10L41L00L02L01L00L00L22L11L00L00L02L01L00L00L02L21L10L00L00L02L01L00L00L02L01L20L10L02L03L20L02L01L12L21L02L11L20L02L11L22L01L02L11L20L02L11L22L01L12L21L00L02L11L22L01\"/><path class=\"eq-line m-line\" d=\"~MwzA1JFI1LsO1\"/><path class=\"eq-line m-line\" d=\"~MFAx1(ID1Lx1I1L30L00L00L00L00L00L00L20L10L00L00L00L12L21L00L02L01L10L22L01L00L12L20L00L00L00L00L00L00L00L00L00L00L00L00L00L00\"/><path class=\"eq-line m-line\" d=\"~MDVtPSA1LV1k\"/><path class=\"eq-line m-line\" d=\"~MyAtyNB1LtS1LN14\"/><path class=\"eq-line m-line\" d=\"~MJAA1!wI1L9W1L10\"/><path class=\"eq-line m-line\" d=\"~MWyA1HGI1L9U1L02L10Lh7L00\"/><path class=\"eq-line m-line\" d=\"~MPRz1P)I1LK1uL20\"/><path class=\"eq-line m-line\" d=\"~MDxz1yAJ1LV19\"/><path class=\"eq-line m-line\" d=\"~MYGy1W_I1LK1tLef\"/><path class=\"eq-line m-line\" d=\"~MPBA1Y_H1L3V1L01L20L10L00L20L10L20L10L00L22L11L00L20L10L00L00L10L20L11L02L20L10L00L20L10L10L00L00L00L00L20L10L01L02L00L00L30L00L00L00L00L02L11L20L00L00L00L00L00L00L00L00L00L00L00L00L00L00L10L20L00L00L00L00L00L00L00L00L00L00L00L32L11L22L01L02L00L01L02L01L12L21L02L01L02L00L01L02L01L12L21L02L01L02L00L01L02L11L22L01L02L10L00L00L00L00L00L00L00L10L20L00L00L00L00L00L00L00L00L00L00L00L00L00L10L20L00L00L00L00LbaL10L21L02L10L21L02L10L20L01L02L10Lpw1L22L10L01L22L10L00L21L12L8D1L12L21L10L22L01L12L21L10LD1oL00L02L11L20L00L00L00L10L20L00L00Le6L01L02L21L10L02L01L02L21L12L01L02L21L12L01L02L01L22L11L02L01L20L12L01L02L21L12L01L02L21L22L10L01L22L11L02L00L21L12L01L02L21\"/><path class=\"eq-line m-line\" d=\"~MSIy1H!I1Lw1N1L01L12Lsz1L12L01L00L20L12L01L20L10\"/><path class=\"eq-line m-line\" d=\"~M(xz1DAJ1L_1aL10L02L5G1L02L00L00\"/><path class=\"eq-line m-line\" d=\"~M_Tz1y(I1LS1rL00L00L01L02L00Lz1pL22L11\"/><path class=\"eq-line m-line\" d=\"~MSAA1A(H1LeV1\"/><path class=\"eq-line m-line\" d=\"~M!Ky1WNx1LbY1L20L10L20L10L20L10Lj7L01L02L20L11L02L00LffL00L21L12L00L20L10L7lL02L00L01L02L01L02L0nL02L01L02L01L00L02L8lL20L10L00L02L21L10LgfL00L02L01L20L12L01Lk7L20L10L20L10L00L20Lk0L20L00L10L20L10L20Lk8L00L12L21L00L02L01LggL10L20L00L02L11L20L8kL02L01L02L01L00L02L0kL02L00L01L02L01L02L7kL10L21L02L10L20L00LfgL01L02L10L21L02L00Lj8L10L20L10L20L10\"/><path class=\"eq-line m-line\" d=\"~MFAz1WNx1LBrAO1LBrzO1LDrzO1LJW10LDrAO1LBrAO1\"/><path class=\"disc\" d=\"^39\"/><path class=\"disc-core\" d=\"^40\"/><circle class=\"joint\" cx=\"156.55\" cy=\"193.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.57\" cy=\"145.67\" r=\"2.25\"/><circle class=\"joint\" cx=\"173.49\" cy=\"258.82\" r=\"2.25\"/><circle class=\"joint\" cx=\"235.78\" cy=\"266.18\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#w20U(w1_)uOwx1TGv1120122110221120122110201221102201102211201221102211201022112000011100000000010100000000010101000000210101002002000021010002200001010010000001110000001001010100000001010100000200000101200202\"/><path class=\"arrow\" d=\"~MS_uU)jLPpFx1LG(1zqZ\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M156.56 163.67A18 18 0 0 1 156.52 127.67\"/><g class=\"arc-ticks\"><path d=\"~MPSu(BvL0FY1\"/><path d=\"~MHSu(WpL5EY1\"/></g><path class=\"leader\" d=\"~MSVqUNsLR(3IW1\"/></g></g><path class=\"leader\" d=\"~MJysHRF1LB_4W2\"/><circle class=\"anchor\" cx=\"143.74\" cy=\"207.57\" r=\"1.5\"/><path class=\"leader\" d=\"M179.39 220.3L187 224H197\"/><circle class=\"anchor\" cx=\"179.39\" cy=\"220.3\" r=\"1.5\"/><path class=\"leader\" d=\"M156.46 108.32L147.29 102H137.29\"/><circle class=\"anchor\" cx=\"156.46\" cy=\"108.32\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dumbbell-shoulder-press-n-back\" data-key=\"back\" data-cue=\"Keep your head, shoulders and buttocks on the bench.\" class=\"plate-callout two\" style=\"left:18.44%;top:51.96%\" aria-pressed=\"true\">Back<br>on pad</button><button type=\"button\" id=\"dumbbell-shoulder-press-n-elbows\" data-key=\"elbows\" data-cue=\"Point your elbows in front of you, not straight out to the sides.\" class=\"plate-callout two\" style=\"left:53.63%;top:56.42%\" aria-pressed=\"false\">Elbows<br>forward</button><button type=\"button\" id=\"dumbbell-shoulder-press-n-lockout\" data-key=\"lockout\" data-cue=\"Press until your elbows are fully straight.\" class=\"plate-callout two\" style=\"left:20.11%;top:22.35%\" aria-pressed=\"false\">Full<br>lockout</button><span class=\"plate-arc-label\" style=\"left:11.73%;top:36.31%\"><b>Elbow</b><span>fully straight</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-shoulder-press-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-shoulder-press-m-st-upper.l\" d=\"^0\"/><path id=\"dumbbell-shoulder-press-m-st-elbowcap.l\" d=\"^1\"/><path id=\"dumbbell-shoulder-press-m-st-fore.l\" d=\"^2\"/><path id=\"dumbbell-shoulder-press-m-st-fist.l\" d=\"^3\"/><path id=\"dumbbell-shoulder-press-m-st-upper.r\" d=\"^0\"/><path id=\"dumbbell-shoulder-press-m-st-elbowcap.r\" d=\"^1\"/><path id=\"dumbbell-shoulder-press-m-st-fore.r\" d=\"^2\"/><path id=\"dumbbell-shoulder-press-m-st-fist.r\" d=\"^3\"/><path id=\"dumbbell-shoulder-press-m-g0-upper.r\" d=\"^4\"/><path id=\"dumbbell-shoulder-press-m-g0-elbowcap.r\" d=\"^5\"/><path id=\"dumbbell-shoulder-press-m-g0-fore.r\" d=\"^6\"/><path id=\"dumbbell-shoulder-press-m-g0-fist.r\" d=\"^7\"/><path id=\"dumbbell-shoulder-press-m-g0-eq9.dumbbell.0-0\" d=\"^8\"/><path id=\"dumbbell-shoulder-press-m-g1-upper.r\" d=\"^9\"/><path id=\"dumbbell-shoulder-press-m-g1-elbowcap.r\" d=\"^10\"/><path id=\"dumbbell-shoulder-press-m-g1-fore.r\" d=\"^11\"/><path id=\"dumbbell-shoulder-press-m-g1-fist.r\" d=\"^12\"/><path id=\"dumbbell-shoulder-press-m-g1-eq9.dumbbell.0-0\" d=\"^13\"/><path id=\"dumbbell-shoulder-press-m-g2-upper.r\" d=\"^14\"/><path id=\"dumbbell-shoulder-press-m-g2-elbowcap.r\" d=\"^15\"/><path id=\"dumbbell-shoulder-press-m-g2-fore.r\" d=\"^16\"/><path id=\"dumbbell-shoulder-press-m-g2-fist.r\" d=\"^17\"/><path id=\"dumbbell-shoulder-press-m-g2-eq9.dumbbell.0-0\" d=\"^18\"/><path id=\"dumbbell-shoulder-press-m-e-thigh.l\" d=\"^19\"/><path id=\"dumbbell-shoulder-press-m-e-kneecap.l\" d=\"^20\"/><path id=\"dumbbell-shoulder-press-m-e-shank.l\" d=\"^21\"/><path id=\"dumbbell-shoulder-press-m-e-foot.l\" d=\"^22\"/><path id=\"dumbbell-shoulder-press-m-e-shcap.l\" d=\"^23\"/><path id=\"dumbbell-shoulder-press-m-e-upper.l\" d=\"^24\"/><path id=\"dumbbell-shoulder-press-m-e-elbowcap.l\" d=\"^25\"/><path id=\"dumbbell-shoulder-press-m-e-fore.l\" d=\"^26\"/><path id=\"dumbbell-shoulder-press-m-e-fist.l\" d=\"^27\"/><path id=\"dumbbell-shoulder-press-m-e-head\" d=\"^28\"/><path id=\"dumbbell-shoulder-press-m-e-torso\" d=\"^29\"/><path id=\"dumbbell-shoulder-press-m-e-thigh.r\" d=\"^19\"/><path id=\"dumbbell-shoulder-press-m-e-kneecap.r\" d=\"^20\"/><path id=\"dumbbell-shoulder-press-m-e-shank.r\" d=\"^21\"/><path id=\"dumbbell-shoulder-press-m-e-foot.r\" d=\"^22\"/><path id=\"dumbbell-shoulder-press-m-e-shcap.r\" d=\"^23\"/><path id=\"dumbbell-shoulder-press-m-e-upper.r\" d=\"^24\"/><path id=\"dumbbell-shoulder-press-m-e-elbowcap.r\" d=\"^25\"/><path id=\"dumbbell-shoulder-press-m-e-fore.r\" d=\"^26\"/><path id=\"dumbbell-shoulder-press-m-e-fist.r\" d=\"^27\"/><path id=\"dumbbell-shoulder-press-m-m-shcap.l\" d=\"^23\"/><path id=\"dumbbell-shoulder-press-m-m-upper.l\" d=\"~#F12H*tWJA1EVu)xA1y6K248GuPhF5uW2aNlx4FloYeE7NcEhNgOeH1B2P2-4Iw1Fd57W5G3J2Bj)sz1Bk(9.gPn00101000010000001021010000000101000000010002000000002010120000000000111012200000\"/><path id=\"dumbbell-shoulder-press-m-m-elbowcap.l\" d=\"~~wIn(XF1Dz10\"/><path id=\"dumbbell-shoulder-press-m-m-fore.l\" d=\"~#F12wTpSYF1OOpEUG1*1Aal.1X2xI1X3D9T1H2vNw1x7Wc5FbS6!c1Nw1U1N2H3F9F4*H1q-1P1DaAai!aGjaGhBaVj00101000000000000000002101000002000000002002201010000000001000100002200100000022\"/><path id=\"dumbbell-shoulder-press-m-m-fist.l\" d=\"~~STn(xvww10\"/><path id=\"dumbbell-shoulder-press-m-m-shcap.r\" d=\"^23\"/><path id=\"dumbbell-shoulder-press-m-m-upper.r\" d=\"^70\"/><path id=\"dumbbell-shoulder-press-m-m-elbowcap.r\" d=\"^71\"/><path id=\"dumbbell-shoulder-press-m-m-fore.r\" d=\"^72\"/><path id=\"dumbbell-shoulder-press-m-m-fist.r\" d=\"^73\"/><path id=\"dumbbell-shoulder-press-m-m-eq0\" d=\"~M(Gq(xvLBrAO1LBrzO1LDrzO1LJW10LDrAO1Z\"/><path id=\"dumbbell-shoulder-press-m-m-eq1\" d=\"~~ABo(xvNe0\"/><path id=\"dumbbell-shoulder-press-m-m-eq2\" d=\"^74\"/><path id=\"dumbbell-shoulder-press-m-m-eq3\" d=\"^75\"/><path id=\"dumbbell-shoulder-press-m-mf-head\" d=\"^28\"/><path id=\"dumbbell-shoulder-press-m-mf-torso\" d=\"^29\"/><path id=\"dumbbell-shoulder-press-m-mf-thigh.l\" d=\"^19\"/><path id=\"dumbbell-shoulder-press-m-mf-kneecap.l\" d=\"^20\"/><path id=\"dumbbell-shoulder-press-m-mf-shank.l\" d=\"^21\"/><path id=\"dumbbell-shoulder-press-m-mf-foot.l\" d=\"^22\"/><path id=\"dumbbell-shoulder-press-m-mf-thigh.r\" d=\"^19\"/><path id=\"dumbbell-shoulder-press-m-mf-kneecap.r\" d=\"^20\"/><path id=\"dumbbell-shoulder-press-m-mf-shank.r\" d=\"^21\"/><path id=\"dumbbell-shoulder-press-m-mf-foot.r\" d=\"^22\"/><path id=\"dumbbell-shoulder-press-m-mo-0\" d=\"^28\"/><path id=\"dumbbell-shoulder-press-m-mo-1\" d=\"^29\"/><path id=\"dumbbell-shoulder-press-m-mo-2\" d=\"^19\"/><path id=\"dumbbell-shoulder-press-m-mo-3\" d=\"^20\"/><path id=\"dumbbell-shoulder-press-m-mo-4\" d=\"^21\"/><path id=\"dumbbell-shoulder-press-m-mo-5\" d=\"^22\"/><path id=\"dumbbell-shoulder-press-m-mo-6\" d=\"^23\"/><path id=\"dumbbell-shoulder-press-m-mo-7\" d=\"^24\"/><path id=\"dumbbell-shoulder-press-m-mo-8\" d=\"^25\"/><path id=\"dumbbell-shoulder-press-m-mo-9\" d=\"^26\"/><path id=\"dumbbell-shoulder-press-m-mo-10\" d=\"^27\"/><path id=\"dumbbell-shoulder-press-m-mo-11\" d=\"^19\"/><path id=\"dumbbell-shoulder-press-m-mo-12\" d=\"^20\"/><path id=\"dumbbell-shoulder-press-m-mo-13\" d=\"^21\"/><path id=\"dumbbell-shoulder-press-m-mo-14\" d=\"^22\"/><path id=\"dumbbell-shoulder-press-m-mo-15\" d=\"^23\"/><path id=\"dumbbell-shoulder-press-m-mo-16\" d=\"^24\"/><path id=\"dumbbell-shoulder-press-m-mo-17\" d=\"^25\"/><path id=\"dumbbell-shoulder-press-m-mo-18\" d=\"^26\"/><path id=\"dumbbell-shoulder-press-m-mo-19\" d=\"^27\"/><path id=\"dumbbell-shoulder-press-m-mo-20\" d=\"^31\"/><path id=\"dumbbell-shoulder-press-m-mo-21\" d=\"^32\"/><path id=\"dumbbell-shoulder-press-m-mo-22\" d=\"^33\"/><path id=\"dumbbell-shoulder-press-m-mo-23\" d=\"^34\"/><path id=\"dumbbell-shoulder-press-m-mo-24\" d=\"^35\"/><path id=\"dumbbell-shoulder-press-m-mo-25\" d=\"^36\"/><path id=\"dumbbell-shoulder-press-m-mo-26\" d=\"^37\"/><path id=\"dumbbell-shoulder-press-m-mo-27\" d=\"^39\"/><path id=\"dumbbell-shoulder-press-m-mo-28\" d=\"^40\"/><path id=\"dumbbell-shoulder-press-m-mo-29\" d=\"^39\"/><path id=\"dumbbell-shoulder-press-m-mo-30\" d=\"^40\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-shoulder-press-m-dots)\"/>\n  <path class=\"floorline\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-m-st-upper.l\"/><use href=\"#dumbbell-shoulder-press-m-st-elbowcap.l\"/><use href=\"#dumbbell-shoulder-press-m-st-fore.l\"/><use href=\"#dumbbell-shoulder-press-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-m-st-upper.l\"/><use href=\"#dumbbell-shoulder-press-m-st-elbowcap.l\"/><use href=\"#dumbbell-shoulder-press-m-st-fore.l\"/><use href=\"#dumbbell-shoulder-press-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-m-st-upper.r\"/><use href=\"#dumbbell-shoulder-press-m-st-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-m-st-fore.r\"/><use href=\"#dumbbell-shoulder-press-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-m-st-upper.r\"/><use href=\"#dumbbell-shoulder-press-m-st-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-m-st-fore.r\"/><use href=\"#dumbbell-shoulder-press-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-m-g0-upper.r\"/><use href=\"#dumbbell-shoulder-press-m-g0-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-m-g0-fore.r\"/><use href=\"#dumbbell-shoulder-press-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-m-g0-upper.r\"/><use href=\"#dumbbell-shoulder-press-m-g0-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-m-g0-fore.r\"/><use href=\"#dumbbell-shoulder-press-m-g0-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-m-g0-eq9.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-m-g0-eq9.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-m-g1-upper.r\"/><use href=\"#dumbbell-shoulder-press-m-g1-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-m-g1-fore.r\"/><use href=\"#dumbbell-shoulder-press-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-m-g1-upper.r\"/><use href=\"#dumbbell-shoulder-press-m-g1-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-m-g1-fore.r\"/><use href=\"#dumbbell-shoulder-press-m-g1-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-m-g1-eq9.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-m-g1-eq9.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-m-g2-upper.r\"/><use href=\"#dumbbell-shoulder-press-m-g2-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-m-g2-fore.r\"/><use href=\"#dumbbell-shoulder-press-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-m-g2-upper.r\"/><use href=\"#dumbbell-shoulder-press-m-g2-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-m-g2-fore.r\"/><use href=\"#dumbbell-shoulder-press-m-g2-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-m-g2-eq9.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-m-g2-eq9.dumbbell.0-0\"/></g></g></g><g class=\"pose-end\"><path class=\"disc\" d=\"^39\"/><path class=\"disc-core\" d=\"^40\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-m-e-thigh.l\"/><use href=\"#dumbbell-shoulder-press-m-e-kneecap.l\"/><use href=\"#dumbbell-shoulder-press-m-e-shank.l\"/><use href=\"#dumbbell-shoulder-press-m-e-foot.l\"/><use href=\"#dumbbell-shoulder-press-m-e-shcap.l\"/><use href=\"#dumbbell-shoulder-press-m-e-upper.l\"/><use href=\"#dumbbell-shoulder-press-m-e-elbowcap.l\"/><use href=\"#dumbbell-shoulder-press-m-e-fore.l\"/><use href=\"#dumbbell-shoulder-press-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-m-e-thigh.l\"/><use href=\"#dumbbell-shoulder-press-m-e-kneecap.l\"/><use href=\"#dumbbell-shoulder-press-m-e-shank.l\"/><use href=\"#dumbbell-shoulder-press-m-e-foot.l\"/><use href=\"#dumbbell-shoulder-press-m-e-shcap.l\"/><use href=\"#dumbbell-shoulder-press-m-e-upper.l\"/><use href=\"#dumbbell-shoulder-press-m-e-elbowcap.l\"/><use href=\"#dumbbell-shoulder-press-m-e-fore.l\"/><use href=\"#dumbbell-shoulder-press-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-m-e-head\"/><use href=\"#dumbbell-shoulder-press-m-e-torso\"/><use href=\"#dumbbell-shoulder-press-m-e-thigh.r\"/><use href=\"#dumbbell-shoulder-press-m-e-kneecap.r\"/><use href=\"#dumbbell-shoulder-press-m-e-shank.r\"/><use href=\"#dumbbell-shoulder-press-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-m-e-head\"/><use href=\"#dumbbell-shoulder-press-m-e-torso\"/><use href=\"#dumbbell-shoulder-press-m-e-thigh.r\"/><use href=\"#dumbbell-shoulder-press-m-e-kneecap.r\"/><use href=\"#dumbbell-shoulder-press-m-e-shank.r\"/><use href=\"#dumbbell-shoulder-press-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-m-e-shcap.r\"/><use href=\"#dumbbell-shoulder-press-m-e-upper.r\"/><use href=\"#dumbbell-shoulder-press-m-e-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-m-e-fore.r\"/><use href=\"#dumbbell-shoulder-press-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shoulder-press-m-e-shcap.r\"/><use href=\"#dumbbell-shoulder-press-m-e-upper.r\"/><use href=\"#dumbbell-shoulder-press-m-e-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-m-e-fore.r\"/><use href=\"#dumbbell-shoulder-press-m-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"^41\"/><path class=\"eq-line m-line\" d=\"^42\"/><path class=\"eq-line m-line\" d=\"^43\"/><path class=\"eq-line m-line\" d=\"^44\"/><path class=\"eq-line m-line\" d=\"^45\"/><path class=\"eq-line m-line\" d=\"^46\"/><path class=\"eq-line m-line\" d=\"^47\"/><path class=\"eq-line m-line\" d=\"^48\"/><path class=\"eq-line m-line\" d=\"^49\"/><path class=\"eq-line m-line\" d=\"^50\"/><path class=\"eq-line m-line\" d=\"^51\"/><path class=\"eq-line m-line\" d=\"^52\"/><path class=\"eq-line m-line\" d=\"^53\"/><path class=\"eq-line m-line\" d=\"^54\"/><path class=\"eq-line m-line\" d=\"^55\"/><path class=\"eq-line m-line\" d=\"^56\"/><path class=\"eq-line m-line\" d=\"^57\"/><path class=\"eq-line m-line\" d=\"^58\"/><path class=\"eq-line m-line\" d=\"^59\"/><path class=\"eq-line m-line\" d=\"^60\"/><path class=\"disc\" d=\"^39\"/><path class=\"disc-core\" d=\"^40\"/><circle class=\"joint\" cx=\"156.55\" cy=\"193.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.57\" cy=\"145.67\" r=\"2.25\"/><circle class=\"joint\" cx=\"173.49\" cy=\"258.82\" r=\"2.25\"/><circle class=\"joint\" cx=\"235.78\" cy=\"266.18\" r=\"2.25\"/></g><mask id=\"dumbbell-shoulder-press-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#dumbbell-shoulder-press-m-mf-head\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-mf-torso\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-mf-shank.l\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-mf-foot.l\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-m-shcap.l\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-m-upper.l\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-m-fore.l\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-m-fist.l\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-mf-shank.r\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-mf-foot.r\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-m-shcap.r\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-m-upper.r\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-m-fore.r\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-m-fist.r\" fill=\"#000\"/><use href=\"#dumbbell-shoulder-press-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shoulder-press-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#dumbbell-shoulder-press-m-mmask)\"><g class=\"u-stroke\"><use href=\"#dumbbell-shoulder-press-m-m-shcap.l\"/><use href=\"#dumbbell-shoulder-press-m-m-upper.l\"/><use href=\"#dumbbell-shoulder-press-m-m-elbowcap.l\"/><use href=\"#dumbbell-shoulder-press-m-m-fore.l\"/><use href=\"#dumbbell-shoulder-press-m-m-fist.l\"/><use href=\"#dumbbell-shoulder-press-m-m-shcap.r\"/><use href=\"#dumbbell-shoulder-press-m-m-upper.r\"/><use href=\"#dumbbell-shoulder-press-m-m-elbowcap.r\"/><use href=\"#dumbbell-shoulder-press-m-m-fore.r\"/><use href=\"#dumbbell-shoulder-press-m-m-fist.r\"/><use href=\"#dumbbell-shoulder-press-m-m-eq0\"/><use href=\"#dumbbell-shoulder-press-m-m-eq1\"/><use href=\"#dumbbell-shoulder-press-m-m-eq2\"/><use href=\"#dumbbell-shoulder-press-m-m-eq3\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MH*tWJA1LR1oL11L22L11L00L22L11L22L11L20L12L21L12L01L20L12L00L00L00L00L00L00L00L00L00L00L00L02L01L20L12L01L00L02L21L10L02L02L20L11L22L10L00L20L10L00L20L11L02L20L10L00L20L10L01L22L10L20L10L00L20L10L01L22L10L00L20L02L22L11L22L01L10L22L11L20L12L21L12L21L00L12L21\"/><path class=\"m-line\" d=\"~MW*oSXG1LY1hL10L00L20L10L00L20L12L01L20L10L00L20L10L20L10L00L22L11L00L20L10L00L20L10L20L10L00L01L00L00L20L10L00L00L02L01L00L20L10L00L00L00L02L01L20L10L00L00L00L00L02L21L10L00L13L20L02L01L10L20L02L11L20L00L12L21L00L10L22L01L10L20L02L11L20L00L10L22L01L00L10L22L01L10L01L12L21L00L10L20L12L21L10L20L00L10L00L20L11L02L20L10L20L11L02L20L30L20L01L12L20L00L11L22L00L00L10L21L02L10L20LdhL10L20L00L00L10L20L00L10L20L00L00L10L20L00L10L20L02L01L10L20L00L00LI1dL20L00L00L00L00L00L00L00L00L11L22L00L00L00L00L00L00Lz1iL00L00L01L02L00L00L01L02L10L20L01L02L00L00L00L01L02LdH1L01L02L11L22L01L02L01L12L21L02L00L11L22L01L02L01L12L21L02L01L12\"/><path class=\"m-line\" d=\"~MW.oNYG1LV1cL01\"/><path class=\"m-line\" d=\"~MAAoA-G1LV19L01\"/><path class=\"m-line\" d=\"~MNTnwNG1LvK1L20L00\"/><path class=\"m-line\" d=\"~MWKnJBG1L9T1L11L20L00\"/><path class=\"m-line\" d=\"~MWYpYPD1L0-1L12L01L02L01L02L01L00L22L11L02L01L02L01L00L22L11L02L01L02L01L00L22L11L02L01L00L02L01L02L21L52L01L02L01L02L00L01L02L01L02L01L02L00L01L02L01L02L01L02L00L01L02L01L02L01L02L00L01L02L01L12L00L00L00L01L02L00L00L00L00L00L01L02L00L00L00L00L00L01L02L00L00L00L00L01L02L00L00L00Ld6L00L02L01L00L02L01L00L00L02L01L00LvuL01L12L20L01L02L11L22L01L1H1L21L12L21L12L01L22L11L22LusL00L02L01L00L22L11L00L02L01L00L02Le6L00L00L20L10L00L00L00L00L00L00L00L00L00L00L00L00L00L00L00L00L00L00L00L00L00L01L02L00L22L01L00L02L21L10L02L01L00L02L01L00L02L01L00L00L02L01L00L02L01L00L02L01L00L02L01L00L02L21L20L02L01L02L01L02L20L11L02L01L02L01L02L21L12L01L02L01L02L21L12L01L02L01L02L00L21L12L01L02L01L02L21L12L01L42L01L20L10L02L01L20L10L02L21L10L20L22L01L10L20L10L20L12L21L00L00L21L12L20L10L20L10L21L12L20L10L20L11L22L10L20Lg5L00L02\"/><path class=\"m-line\" d=\"~M(TnwOG1LoS1L10L00Lw1rL01L00L02\"/><path class=\"m-line\" d=\"~MDBoP-G1LW1kL02L01L10L22L0G1L22L10L01L02\"/><path class=\"m-line\" d=\"~MSTp(xvL9Y1L10L00L20L10L20L10Lj7L01L22L10L00L01L02LffL20L10L01L02L20L10L7jL01L02L01L02L01L02L0nL02L01L02L01L02L01L8jL20L10L02L01L20L10LgfL02L01L20L10L02L01Lk7L20L10L20L10L20L10Lo0L10L20L10L20L10L20Lk8L02L01L10L20L02L01LggL10L20L00L02L11L20L8kL02L01L02L01L02L01L0oL01L02L01L02L01L02L7kL10L21L02L00L10L20LfgL01L02L00L10L21L02Lj8L10L20L10L20L00\"/><path class=\"m-line\" d=\"~M(Gq(xvLBrAO1LBrzO1LDrzO1LJW10LDrAO1LBrAO1\"/><path class=\"m-arrow\" d=\"~MSToyIpL0DG3MXi)oLYiwpL0)R1\"/><path class=\"leader m\" d=\"M126.01 159.03L117.48 140H107.48\"/><path class=\"leader m\" d=\"~MDNo(XF1L0yE2\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dumbbell-shoulder-press-m-behind\" data-key=\"behind\" data-cue=\"The dumbbells drop behind your head.\" class=\"plate-callout two m\" style=\"left:11.17%;top:32.96%\" aria-pressed=\"true\">Behind<br>the head</button><button type=\"button\" id=\"dumbbell-shoulder-press-m-elbows\" data-key=\"elbows\" data-cue=\"The elbows pull back behind your shoulders.\" class=\"plate-callout two m\" style=\"left:17.32%;top:60.34%\" aria-pressed=\"false\">Elbows<br>back</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "back",
        cues: [{ key: "back", cue: "Keep your head, shoulders and buttocks on the bench." }, { key: "elbows", cue: "Point your elbows in front of you, not straight out to the sides." }, { key: "lockout", cue: "Press until your elbows are fully straight." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "behind",
        cues: [{ key: "behind", cue: "The dumbbells drop behind your head." }, { key: "elbows", cue: "The elbows pull back behind your shoulders." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Behind the head</b><span>The dumbbells drop behind your head.</span></li><li><b>Elbows back</b><span>The elbows pull back behind your shoulders.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: press 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Seated dumbbell shoulder press, side view. Sitting upright, head, back and hips on the pad, feet flat, the lifter presses the dumbbells from shoulder level, elbows slightly forward, to straight arms directly over the shoulders.",
      mistakeAlt: "Seated Dumbbell Shoulder Press: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "push",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW2: the push heel-of-palm pair cannot be drawn by golden B's engine (D-LIB7-19); the grip copy carries c2.",
    "orientation": "pronated",
    "handle": "dumbbell",
    "overBody": true,
    "width": {
      "text": "Dumbbells shoulder-width or slightly wider at the start.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-ohp"
        ],
        "note": "c2"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-ohp"
        ],
        "note": "c2"
      }
    },
    "contact": "heel",
    "wrist": {
      "ext": [
        0,
        15
      ],
      "limitText": "Keep your wrists neutral throughout.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-ohp"
        ],
        "note": "c2. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number."
      }
    },
    "faults": [
      {
        "key": "bent-back",
        "label": "Wrist bent back",
        "pose": {},
        "markers": [],
        "alt": "Wrist bent back under the dumbbell."
      }
    ],
    "gripLine": "Closed grip, palms forward, thumbs wrapped. Handle firm in your palm.",
    "cue": "Handle firm in palm, wrist neutral."
  },
  contacts: [
    "seat-back"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Head, shoulders and buttocks on the backrest. Feet flat. Trunk braced.",
      "zoom": "seat-back-contact",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-ohp"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "grip",
      "text": "Bring the dumbbells to shoulder level, thumbs wrapped, wrists straight.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-ohp"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "brace",
      "text": "Shoulder blades down and back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-ohp"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "safety",
      "text": "If using a spotter, they stand behind you, hands near your wrists.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-ohp"
        ],
        "note": "c7"
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
        "note": "c11"
      }
    }
  ],
  posture: [
    {
      "key": "back",
      "label": "Back on pad",
      "detail": "Back on the pad, no low-back arch.",
      "anchor": {
        "pose": "end",
        "at": "lumbar"
      },
      "zoom": "seat-back-contact",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-ohp"
        ],
        "note": "c1, c4"
      }
    },
    {
      "key": "elbows",
      "label": "Elbows forward",
      "detail": "Elbows pointed in front of you.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-ohp"
        ],
        "note": "c5"
      }
    },
    {
      "key": "front",
      "label": "Dumbbells in front",
      "detail": "Dumbbells in front of the head, never behind the neck.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "kolber2013",
          "esenkaya2000"
        ],
        "note": "c10"
      }
    },
    {
      "key": "wrists",
      "label": "Wrists neutral",
      "detail": "Wrists neutral.",
      "anchor": {
        "pose": "start",
        "at": "wrist.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-ohp"
        ],
        "note": "c2"
      }
    },
    {
      "key": "lockout",
      "label": "Full lockout",
      "detail": "Press until the elbows are fully straight.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-ohp"
        ],
        "note": "c4"
      }
    }
  ],
  zooms: [
    {
      "key": "seat-back-contact",
      "chip": "Back",
      "heading": "Back contact",
      "kind": "posture"
    }
  ],
  chips: [
    "seat-back-contact",
    "feel"
  ],
  copy: {
    "setupLine": "Back on the pad, feet flat, trunk braced. Dumbbells at shoulder level, thumbs wrapped.",
    "mistakeLine": "Keep the dumbbells in front of your head. Never lower them behind the neck.",
    "cueLine": "Elbows pointed in front."
  },
  mistakes: [
    {
      "key": "behind",
      "title": "Lowering behind the head",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "kolber2013",
          "esenkaya2000"
        ],
        "note": "c10"
      },
      "fix": "Keep the dumbbells in front of the head."
    },
    {
      "key": "arch",
      "title": "Arching the back",
      "zoom": "seat-back-contact",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-ohp"
        ],
        "note": "c4"
      },
      "fix": "Press without arching your low back."
    },
    {
      "key": "drop",
      "title": "Dumbbells dropping fast going down",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-ohp"
        ],
        "note": "c6"
      },
      "fix": "Lower slowly, pulling them down."
    }
  ],
  risks: [
    {
      "key": "behind-neck",
      "text": "Pressing behind the neck is linked to shoulder instability.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "kolber2013",
          "esenkaya2000"
        ],
        "note": "c10"
      }
    },
    {
      "key": "shoulder",
      "text": "Shoulder injuries are common in lifting and linked to poor technique.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "kolber2010"
        ],
        "note": "c13"
      }
    },
    {
      "key": "dropped",
      "text": "Weights dropping on the lifter is the most common weight-room injury mechanism.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "kerr2010"
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
    "ace-seated-ohp",
    "saeterbakken2013",
    "kolber2013",
    "esenkaya2000",
    "acsm2009",
    "kolber2010",
    "kerr2010",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/dumbbell_shoulder_press.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

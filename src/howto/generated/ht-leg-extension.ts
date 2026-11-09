// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=33441e856ef32d95a33541a3efab7774abb205a3acbfbdd73bcaa8128946d1c9
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_leg_extension",
  name: "Leg Extension",
  hashes: { inputsSha256: "33441e856ef32d95a33541a3efab7774abb205a3acbfbdd73bcaa8128946d1c9", golden: "1a74eaa3f3eeab2a411b033133fb6a361684bbd39d7549e1c069666c76efc8c8" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"leg-extension-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"leg-extension-n-st-shank.l\" d=\"~#F12wVG1NJS1XYG1B*P1_1-bF10!4((1(5-7Y2)3V3*y2F7Td0)bG7Td_3*y2-2)3*5-7*4((1B10-1-b-cYbEdUo0YlDdUo00000000000000000001000000100000000000200010110000100020002000000201000000100122\"/><path id=\"leg-extension-n-st-foot.l\" d=\"~#o2UDH1!S*1EYH1.S!1!cD3Ph)7Wp)nS-2B3-J2X4ID1x8)n0TG1_4Bb-c_sBbKmUp200020100000000000000200000000110010101010121000\"/><path id=\"leg-extension-n-st-shank.r\" d=\"^0\"/><path id=\"leg-extension-n-st-foot.r\" d=\"^1\"/><path id=\"leg-extension-n-g0-shank.r\" d=\"~#F12DYG1H*S1RHG1*OR1T2VbD1dJrw-1W2R9D1V4-r)!1!1IfI4BbVbxa-kX)1)3T2I8E5FiP!1z1e)5IaX7SfG3!r_7AkHlHi11001000000002000100001210100001002101020002000001000001010000100022000001101211\"/><path id=\"leg-extension-n-g0-foot.r\" d=\"~#o2PHN1(A*1GON1Xw!1ydT1Sd.dAfTvJS2Kz1GG2JnXD1J6Gm_8xB1Njxf-7_m.kTbww1000200002000002000000001000220010000020200000200\"/><path id=\"leg-extension-n-g1-shank.r\" d=\"~#F12DxH1_IT1)zG1KDS1V6*9srDN1DI1t.9jX4)O1-N1-3xfx8X8Vez5KH1*T1T4x1-9V1wE1UR1tsG9K7R1Fh(6ArWeygJqD920001010000000000100202000000002001000010100200210000100020200000001202000100100\"/><path id=\"leg-extension-n-g1-foot.r\" d=\"~#o2HwS1DF.1TXR1XA_1PbE6U7XhW2)y1!)1*(1..1JP1Vx1ykXhDgIrUv*g.1WdVroyy1011002002200010101000000000001010010100200020000\"/><path id=\"leg-extension-n-g2-shank.r\" d=\"~#F12!NH1yWT1zDG1-*S1.9-6kz1S_1NnI4-8G2B4X*1Eq)8TcVaG5OfiI_1*w1-4mT9_1HW1Hw1hy1KbR3!4UgFg_mPjU9(rv02000200201101000002000200000020000000000010100021000010111010000000000000100020\"/><path id=\"leg-extension-n-g2-foot.r\" d=\"~#o2AYU1_AY1BzU1.DX1P8xakGjEaTx1_A1VR2ED1Wy2Bo(uTaPlzeNE1IgJ4W2XuwdJv001000010101002200000110100010011101200000001100\"/><path id=\"leg-extension-n-e-thigh.l\" d=\"~#F12N.uF-U1KJt)!U1Vb_11F1Y(1O3-7*5*3X2BV1R2*mIcEk2*mHcBV1S2*3Y2-7(5Y(1P31E1Vb-1-bDv_F1!lwA12_F1*l00000000000020200000110101002002002000000010000020200000000000000010010002001000\"/><path id=\"leg-extension-n-e-kneecap.l\" d=\"~~UWG1NJS1_J10\"/><path id=\"leg-extension-n-e-shank.l\" d=\"~#F12J)H1W_T1TPG1-ST1Tb.22B1F)1iI7R6V3z3xz2x2.cO8)bx1BeA6Iy2R9B4J2G8H5F(1Fa1H1*boPaYdNnNfWl_1Wp)a00110010100020120000100000000001100000000000000000100100000000100000000101101000\"/><path id=\"leg-extension-n-e-foot.l\" d=\"~#o2(BW1JFU1REV1xUT1F4KcI6EiXlTrW4O-2RbyJ2EbSB1x2(nA1!G1XdwaT8VtPnSo001002200000100200001000200200000010010110110002\"/><path id=\"leg-extension-n-e-shcap.l\" d=\"~~YBsA(A1wP10\"/><path id=\"leg-extension-n-e-upper.l\" d=\"~#F12PGsWPB1RxsG.A1X1I585weArN1V4iG2b*fw2BlK6zfKgKdxbKbx2B1K4G2U9wt92T2)4IkV6X2(sY8UkNmHi00220020012000000000002000000010020020000000001010000001011002000000200021101000\"/><path id=\"leg-extension-n-e-elbowcap.l\" d=\"~~y!uJKH1Dz10\"/><path id=\"leg-extension-n-e-fore.l\" d=\"~#F12S.uAWH1O-uxxH15-7A1A1ybYu_1R7A1z2G4TjU3)dT2*aX9XaB5Kj*1G1z5*5H4Nw1bP1O3x7TbR4O5Ply4Yg!ePg01101000011010000000110000000001010000000000200000000020000000020000200010000111\"/><path id=\"leg-extension-n-e-fist.l\" d=\"~~!Ww1yRR1ww10\"/><path id=\"leg-extension-n-e-head\" d=\"~#w12!-sH)q)BrB_qOhYkGiFbIbB2-2y5K5R7)8KaKj-kW3BdO2I9zjU1JlxdYlI8wlN1SkDe0Hj0000001000002202000000000000210000100001002000200020000001100200\"/><path id=\"leg-extension-n-e-torso\" d=\"~#_12HXr(_v-!r.IuzaR5E3aDbWgyaS5AeYeN6fO8In)m)5Gc!5Nfz6FkE8!k-hygzj!3)9I9BfzuXw1OdxqK6gO9sye_e(3W7Kd.6EfJ9R4Hl(6_5YbGc!3W7xP2DE101001010000001001011000020000000000010021000200000000110000000002000000000002011110101000100020000000101000000020000\"/><path id=\"leg-extension-n-e-thigh.r\" d=\"^8\"/><path id=\"leg-extension-n-e-kneecap.r\" d=\"^9\"/><path id=\"leg-extension-n-e-shank.r\" d=\"^10\"/><path id=\"leg-extension-n-e-foot.r\" d=\"^11\"/><path id=\"leg-extension-n-e-shcap.r\" d=\"^12\"/><path id=\"leg-extension-n-e-upper.r\" d=\"^13\"/><path id=\"leg-extension-n-e-elbowcap.r\" d=\"^14\"/><path id=\"leg-extension-n-e-fore.r\" d=\"^15\"/><path id=\"leg-extension-n-e-fist.r\" d=\"^16\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#leg-extension-n-dots)\"/>\n  <path class=\"floorline\" d=\"M57.42 338.77H300.58\"/><path class=\"eq\" d=\"~MUKdDyy2LD(l0Qwp0BBl)oL)oAkQ0)o)ozkLBBlwpQ)o0DBlwpLwpzkQ0wpwpAkZ\"/><path class=\"eq\" d=\"~MJGx1HS)1L0x.7Q0)o)oyy7LAkwpQ)o0zkwpLwpyy7Q0wpwpxy7Lzk)oQwp0Ak)oZ\"/><path class=\"eq\" d=\"~MU_o_yX1LWDf0Qwp0VKe)oL)owbQ0)o)o)aLVKewpQ)o0WKewpLwp)aQ0wpwpwbZ\"/><path class=\"eq\" d=\"~MS(qDyU1L*qzAgQG1)omNJfLFcNoQ*oH1V9PpLWS1!GfQH1wpnKJfLEcKoQ(oG1U9OpZ\"/><path class=\"eq\" d=\"~MJ_nA_G1LBF10Q)o0DfwpLwpzkQ0wpwpAkLDf)oQwp0Bf)oL)oAkQ0)o)ozkZ\"/><path class=\"eq\" d=\"~MUUmHS)1L0GylQ0)o)oHGkLAkwpQ)o0zkwpLwpHGkQ0wpwpGGkLzk)oQwp0Ak)oZ\"/><path class=\"eq\" d=\"~MSFeHIw2LU!50QF60IW5E6LE6zA1Q0E6E6AA1LIW5F6QE60JW5F6LF6AA1Q0F6F6zA1Z\"/><path class=\"eq-thin\" d=\"~MSHfNU(1L0VKl\"/><path class=\"eq-thin\" d=\"~MFzjNU(1L0VKl\"/><path class=\"eq\" d=\"~MHye!OX1LAG60LzG6SA7LzG6RA7Z\"/><path class=\"eq-thin\" d=\"M72.05 317.06H104.23M72.05 313.4H104.23M72.05 309.74H104.23M72.05 306.09H104.23M72.05 302.43H104.23M72.05 298.77H104.23M72.05 295.11H104.23M72.05 291.46H104.23M72.05 287.8H104.23\"/><path class=\"eq\" d=\"~MYGH1YOS1LxB2N-2QBbNeJF2-)1LG3TpQPeDbUpE3LPI1BW2QAbOeKF2Y)1LH3WpQOezbVpH3Z\"/><path class=\"eq\" d=\"~MNIx1N!R1L0(_3Q0NbNbOO3LKbKbQNb0NbKbLKbOO3Q0IbKbSO3LNbJbQKb0KbJbZ\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#leg-extension-n-st-shank.l\"/><use href=\"#leg-extension-n-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-n-st-shank.l\"/><use href=\"#leg-extension-n-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-extension-n-st-shank.r\"/><use href=\"#leg-extension-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-n-st-shank.r\"/><use href=\"#leg-extension-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq\" d=\"~MU)H1yDT1LHH5FD7Q!aWeXP4Ky7LRp-3QYe.a!3RpLEN5VJ6Q.aXe_P4Jy7LSp!3QVe!a-3UpZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-extension-n-g0-shank.r\"/><use href=\"#leg-extension-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-n-g0-shank.r\"/><use href=\"#leg-extension-n-g0-foot.r\"/></g></g><path class=\"eq\" d=\"~#F12F.S1PX_1V*S1xE.1X4S1*3!2.2w4R1U42w5P1U4!2w4(3!2Y4S1!41Y4K1(3*2!2)3P1V42.4R1V4.2)3*3*2X4K100100000200000010000200001001010000020000022000010100101002000000101002000001200\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq\" d=\"~MAGI1WBT1LFS7!Y4QNfY9x-6R(4LBpW5QY9OfV5EpLRJ7T)3QKfX9y-6S(4LDpV5QX9PfW5FpZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-extension-n-g1-shank.r\"/><use href=\"#leg-extension-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-n-g1-shank.r\"/><use href=\"#leg-extension-n-g1-foot.r\"/></g></g><path class=\"eq\" d=\"~#F12UNV1Y*X1zRV1GKY1T4S1)3!2.2w4R1U40w5S1U4!2w4w4!2U4S1w51U4K1w4*2!2)3S1V40.4R1V4.2)3)3*2T4K100002000000000110000000021000000001000000002100000000121000000001101000000200200\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq\" d=\"~M!RI1!xT1LD-8WW1Q(hP3Xz8zB2LKlNeQP3*hOeKlLTH8Ex1Q*hO3Wz8AB2LNlKeQO3wiNeNlZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-extension-n-g2-shank.r\"/><use href=\"#leg-extension-n-g2-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-n-g2-shank.r\"/><use href=\"#leg-extension-n-g2-foot.r\"/></g></g><path class=\"eq\" d=\"~#F12Y.W1!IU1B(W1K.U1X4S1*3!2.2w4R1U42w5N1U4(2w4w4!2W4S1!40W4R1w4.2(2)3N1T42)4R1T4.2)3*3.2X4R100100200200000010000200001200000200200000000012000002002002000000200002000011000\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MHyeA)N1LAG60LzG6AG4LzG6zG4Z\"/><path class=\"eq-thin\" d=\"M72.05 258.78H104.23M72.05 255.13H104.23M72.05 251.47H104.23M72.05 247.81H104.23M72.05 244.16H104.23\"/><path class=\"eq\" d=\"~MWYI1D.S1L!-8*S1QwiE3BI8WtLVeFlQE3)hBlVeLVA8Sx2Q)hH3AI8TtLYeElQF3wiFlYeZ\"/><path class=\"eq-line m-line\" d=\"~MyVI1WES1LAH2(O8\"/><path class=\"eq-line m-line\" d=\"~M_RH1FRS1LyH2(O8\"/><path class=\"eq-line m-line\" d=\"~MyKO1(J!1LX1)cLE3qL)2_1LK2J2LV1w3LrF3L0P3LsF3LW1w3LN2J2Lw3_1LH3qLJ30LH3rLw3V1LN2K2LW1)2LsG3L0I3LrG3LV1)2LK2K2L)2V1LE3r\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#leg-extension-n-e-thigh.l\"/><use href=\"#leg-extension-n-e-kneecap.l\"/><use href=\"#leg-extension-n-e-shank.l\"/><use href=\"#leg-extension-n-e-foot.l\"/><use href=\"#leg-extension-n-e-shcap.l\"/><use href=\"#leg-extension-n-e-upper.l\"/><use href=\"#leg-extension-n-e-elbowcap.l\"/><use href=\"#leg-extension-n-e-fore.l\"/><use href=\"#leg-extension-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-n-e-thigh.l\"/><use href=\"#leg-extension-n-e-kneecap.l\"/><use href=\"#leg-extension-n-e-shank.l\"/><use href=\"#leg-extension-n-e-foot.l\"/><use href=\"#leg-extension-n-e-shcap.l\"/><use href=\"#leg-extension-n-e-upper.l\"/><use href=\"#leg-extension-n-e-elbowcap.l\"/><use href=\"#leg-extension-n-e-fore.l\"/><use href=\"#leg-extension-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-extension-n-e-head\"/><use href=\"#leg-extension-n-e-torso\"/><use href=\"#leg-extension-n-e-thigh.r\"/><use href=\"#leg-extension-n-e-kneecap.r\"/><use href=\"#leg-extension-n-e-shank.r\"/><use href=\"#leg-extension-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-n-e-head\"/><use href=\"#leg-extension-n-e-torso\"/><use href=\"#leg-extension-n-e-thigh.r\"/><use href=\"#leg-extension-n-e-kneecap.r\"/><use href=\"#leg-extension-n-e-shank.r\"/><use href=\"#leg-extension-n-e-foot.r\"/></g></g><path class=\"eq\" d=\"~#F12S!W1JRP1)(W1.wR1X4N1*3(2.2w4R1W42!4P1W4!2w4(3(2Y4N1!42Y4R1(3.2!2*3P1X42.4R1X4.2*3*3.2X4R102100002200002000000200000021010020020020020000010120000012000010000022000001000\"/><path class=\"eq-solid\" d=\"~~wFH1NJS1Nr0\"/><path class=\"eq-pin\" d=\"~~D*H1NJS1F60\"/><path class=\"eq-solid\" d=\"~MPBy1yRR1L)1G7LG3(1L)1N3L0!3L(1N3LN3(1L!30LN3)1L(1G3L0)3L)1G3Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-extension-n-e-shcap.r\"/><use href=\"#leg-extension-n-e-upper.r\"/><use href=\"#leg-extension-n-e-elbowcap.r\"/><use href=\"#leg-extension-n-e-fore.r\"/><use href=\"#leg-extension-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-n-e-shcap.r\"/><use href=\"#leg-extension-n-e-upper.r\"/><use href=\"#leg-extension-n-e-elbowcap.r\"/><use href=\"#leg-extension-n-e-fore.r\"/><use href=\"#leg-extension-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"151.96\" cy=\"189.14\" r=\"2.25\"/><circle class=\"joint\" cx=\"163.73\" cy=\"217.18\" r=\"2.25\"/><circle class=\"joint\" cx=\"157.99\" cy=\"257.99\" r=\"2.25\"/><circle class=\"joint\" cx=\"220.71\" cy=\"257.99\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#N20(TJ1yT(1.EJ1XU(11b1b391d391b5b195b5b375b7b37795b57977959977779b557b59775b79395b59395d39391d5210000000010000100000021000100010100110011000001001100022000002100220010120001210010100000200010000002000200002000000102000000000000000100110000200000111100\"/><path class=\"arrow\" d=\"~MAIX1NDU1LS8yG1L-J1TS1Z\"/></g><path class=\"leader\" d=\"~MyPH1y-R1L0xA2\"/><circle class=\"anchor\" cx=\"217.61\" cy=\"254.89\" r=\"1.5\"/><path class=\"leader\" d=\"M134.72 203.5L111.79 188H101.79\"/><circle class=\"anchor\" cx=\"134.72\" cy=\"203.5\" r=\"1.5\"/><path class=\"leader\" d=\"M236.39 251.37L245 194H255\"/><circle class=\"anchor\" cx=\"236.39\" cy=\"251.37\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"leg-extension-n-pivot\" data-key=\"pivot\" data-cue=\"Knees line up with the machine's pivot.\" class=\"plate-callout two\" style=\"left:49.72%;top:56.98%\" aria-pressed=\"true\">Knee at<br>pivot</button><button type=\"button\" id=\"leg-extension-n-back\" data-key=\"back\" data-cue=\"Keep your back pressed into the pad without arching.\" class=\"plate-callout two\" style=\"left:11.17%;top:46.37%\" aria-pressed=\"false\">Back on<br>pad</button><button type=\"button\" id=\"leg-extension-n-soft\" data-key=\"soft\" data-cue=\"Straighten without locking your knees.\" class=\"plate-callout two\" style=\"left:69.83%;top:48.04%\" aria-pressed=\"false\">Knees<br>unlocked</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"leg-extension-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"leg-extension-m-st-shank.l\" d=\"^0\"/><path id=\"leg-extension-m-st-foot.l\" d=\"^1\"/><path id=\"leg-extension-m-st-shank.r\" d=\"^0\"/><path id=\"leg-extension-m-st-foot.r\" d=\"^1\"/><path id=\"leg-extension-m-g0-shank.r\" d=\"^2\"/><path id=\"leg-extension-m-g0-foot.r\" d=\"^3\"/><path id=\"leg-extension-m-g1-shank.r\" d=\"^4\"/><path id=\"leg-extension-m-g1-foot.r\" d=\"^5\"/><path id=\"leg-extension-m-g2-shank.r\" d=\"^6\"/><path id=\"leg-extension-m-g2-foot.r\" d=\"^7\"/><path id=\"leg-extension-m-e-thigh.l\" d=\"^8\"/><path id=\"leg-extension-m-e-kneecap.l\" d=\"^9\"/><path id=\"leg-extension-m-e-shank.l\" d=\"^10\"/><path id=\"leg-extension-m-e-foot.l\" d=\"^11\"/><path id=\"leg-extension-m-e-shcap.l\" d=\"^12\"/><path id=\"leg-extension-m-e-upper.l\" d=\"^13\"/><path id=\"leg-extension-m-e-elbowcap.l\" d=\"^14\"/><path id=\"leg-extension-m-e-fore.l\" d=\"^15\"/><path id=\"leg-extension-m-e-fist.l\" d=\"^16\"/><path id=\"leg-extension-m-e-head\" d=\"^17\"/><path id=\"leg-extension-m-e-torso\" d=\"^18\"/><path id=\"leg-extension-m-e-thigh.r\" d=\"^8\"/><path id=\"leg-extension-m-e-kneecap.r\" d=\"^9\"/><path id=\"leg-extension-m-e-shank.r\" d=\"^10\"/><path id=\"leg-extension-m-e-foot.r\" d=\"^11\"/><path id=\"leg-extension-m-e-shcap.r\" d=\"^12\"/><path id=\"leg-extension-m-e-upper.r\" d=\"^13\"/><path id=\"leg-extension-m-e-elbowcap.r\" d=\"^14\"/><path id=\"leg-extension-m-e-fore.r\" d=\"^15\"/><path id=\"leg-extension-m-e-fist.r\" d=\"^16\"/><path id=\"leg-extension-m-m-head\" d=\"~#w12NGuFUqRVszOqOhYkEiFbObB2V2y5R5R7.8OaRjVkY3EdO2I9xjU1HlxdYlI8wlJ1PkHe2Fj0000010000100000001010000012000100100001000010001100101200000000\"/><path id=\"leg-extension-m-m-torso\" d=\"~#_12!Dt!OvIJt-wuzaR5B3aybWgAaP5De!ew8K1)czoOuz8*cA4Pg.2NlX3DoBdSjGf(5*8*5.gXmED1X7IsB6Rcxq)bYdPD1!3W7Od-6BfH9R4Hl(6Y5YbBc!3U7xP2DE101010000001101000100000010002000011010000002000001101010000000000021001010101000020010120001010000010000020000000020\"/><path id=\"leg-extension-m-mf-thigh.l\" d=\"~#F12WJvy.U1V*t.(U1Vb!11F1Y(1O3-7*5*3X2BV1R2*mGcEk0*mHcBV1P2*3_2-7(5Y(1P31E1Vb-1.bDv(F1(l!z10(F1*l00020000000020220002100001000000000001010010000020200000000000001000200000200111\"/><path id=\"leg-extension-m-mf-kneecap.l\" d=\"~~!EH1FNS1_J10\"/><path id=\"leg-extension-m-mf-shank.l\" d=\"~#F12UPI1N!T1.xH1RUT1Tb-22G1D)1mE7V6X3)2xz2B2*cK8.bvEey6Iy2T9B4P2I8D5J(1Ja3D1)bqUa_dJnHfWl(1Wpzb02100011110020002000101000000022000000000102000120002001011000002001010000101000\"/><path id=\"leg-extension-m-mf-foot.l\" d=\"~#o2DXW1DHU1-YV1.VT1F4OcK6BiTlRrU4T-2RbDJ2EbPB1x2(ny1_G1TdyaV8VtPnUo011000100220000001021000200000011001200010120000\"/><path id=\"leg-extension-m-mf-shcap.l\" d=\"~~JVtwTA1wP10\"/><path id=\"leg-extension-m-mf-upper.l\" d=\"~#F12!Wt!(A1BStTFA1tV580_9UsD2I4sE2w2Rfy5Tkx4*fIeVfz9Vc*1O1)3.2D5!t92-1I5EjT9.6AsP5_lUjFl10111100120001000200110000020000022000200210100000000001000002000202200210001110\"/><path id=\"leg-extension-m-mf-elbowcap.l\" d=\"~~(PvAHH1Dz10\"/><path id=\"leg-extension-m-mf-fore.l\" d=\"~#F12WOvSOH1OOvK_G1g-7w1F1F8PvN2I7J1)1R2-j(4TdX1xbT8VbI3Rj*1R1O4G6J1Pw1hS1-2I7zbV5O7wlS2(gHd_h00020000000001101000011010000010002100220011110120010000020001000002000001010022\"/><path id=\"leg-extension-m-mf-fist.l\" d=\"^16\"/><path id=\"leg-extension-m-mf-thigh.r\" d=\"^56\"/><path id=\"leg-extension-m-mf-kneecap.r\" d=\"^57\"/><path id=\"leg-extension-m-mf-shank.r\" d=\"^58\"/><path id=\"leg-extension-m-mf-foot.r\" d=\"^59\"/><path id=\"leg-extension-m-mf-shcap.r\" d=\"^60\"/><path id=\"leg-extension-m-mf-upper.r\" d=\"^61\"/><path id=\"leg-extension-m-mf-elbowcap.r\" d=\"^62\"/><path id=\"leg-extension-m-mf-fore.r\" d=\"^63\"/><path id=\"leg-extension-m-mf-fist.r\" d=\"^16\"/><path id=\"leg-extension-m-mo-0\" d=\"^17\"/><path id=\"leg-extension-m-mo-1\" d=\"^18\"/><path id=\"leg-extension-m-mo-2\" d=\"^8\"/><path id=\"leg-extension-m-mo-3\" d=\"^9\"/><path id=\"leg-extension-m-mo-4\" d=\"^10\"/><path id=\"leg-extension-m-mo-5\" d=\"^11\"/><path id=\"leg-extension-m-mo-6\" d=\"^12\"/><path id=\"leg-extension-m-mo-7\" d=\"^13\"/><path id=\"leg-extension-m-mo-8\" d=\"^14\"/><path id=\"leg-extension-m-mo-9\" d=\"^15\"/><path id=\"leg-extension-m-mo-10\" d=\"^16\"/><path id=\"leg-extension-m-mo-11\" d=\"^8\"/><path id=\"leg-extension-m-mo-12\" d=\"^9\"/><path id=\"leg-extension-m-mo-13\" d=\"^10\"/><path id=\"leg-extension-m-mo-14\" d=\"^11\"/><path id=\"leg-extension-m-mo-15\" d=\"^12\"/><path id=\"leg-extension-m-mo-16\" d=\"^13\"/><path id=\"leg-extension-m-mo-17\" d=\"^14\"/><path id=\"leg-extension-m-mo-18\" d=\"^15\"/><path id=\"leg-extension-m-mo-19\" d=\"^16\"/><path id=\"leg-extension-m-mo-20\" d=\"^20\"/><path id=\"leg-extension-m-mo-21\" d=\"^21\"/><path id=\"leg-extension-m-mo-22\" d=\"^22\"/><path id=\"leg-extension-m-mo-23\" d=\"^23\"/><path id=\"leg-extension-m-mo-24\" d=\"^24\"/><path id=\"leg-extension-m-mo-25\" d=\"^25\"/><path id=\"leg-extension-m-mo-26\" d=\"^26\"/><path id=\"leg-extension-m-mo-27\" d=\"^29\"/><path id=\"leg-extension-m-mo-28\" d=\"^39\"/><path id=\"leg-extension-m-mo-29\" d=\"^31\"/><path id=\"leg-extension-m-mo-30\" d=\"^32\"/><path id=\"leg-extension-m-mo-31\" d=\"^41\"/><path id=\"leg-extension-m-mo-32\" d=\"^45\"/><path id=\"leg-extension-m-mo-33\" d=\"^46\"/><path id=\"leg-extension-m-mo-34\" d=\"^47\"/><path id=\"leg-extension-m-mo-35\" d=\"^48\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#leg-extension-m-dots)\"/>\n  <path class=\"floorline\" d=\"^19\"/><path class=\"eq\" d=\"^20\"/><path class=\"eq\" d=\"^21\"/><path class=\"eq\" d=\"^22\"/><path class=\"eq\" d=\"^23\"/><path class=\"eq\" d=\"^24\"/><path class=\"eq\" d=\"^25\"/><path class=\"eq\" d=\"^26\"/><path class=\"eq-thin\" d=\"^27\"/><path class=\"eq-thin\" d=\"^28\"/><path class=\"eq\" d=\"^29\"/><path class=\"eq-thin\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq\" d=\"^32\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#leg-extension-m-st-shank.l\"/><use href=\"#leg-extension-m-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-m-st-shank.l\"/><use href=\"#leg-extension-m-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-extension-m-st-shank.r\"/><use href=\"#leg-extension-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-m-st-shank.r\"/><use href=\"#leg-extension-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq\" d=\"^33\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-extension-m-g0-shank.r\"/><use href=\"#leg-extension-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-m-g0-shank.r\"/><use href=\"#leg-extension-m-g0-foot.r\"/></g></g><path class=\"eq\" d=\"^34\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq\" d=\"^35\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-extension-m-g1-shank.r\"/><use href=\"#leg-extension-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-m-g1-shank.r\"/><use href=\"#leg-extension-m-g1-foot.r\"/></g></g><path class=\"eq\" d=\"^36\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq\" d=\"^37\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-extension-m-g2-shank.r\"/><use href=\"#leg-extension-m-g2-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-m-g2-shank.r\"/><use href=\"#leg-extension-m-g2-foot.r\"/></g></g><path class=\"eq\" d=\"^38\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"^39\"/><path class=\"eq-thin\" d=\"^40\"/><path class=\"eq\" d=\"^41\"/><path class=\"eq-line m-line\" d=\"^42\"/><path class=\"eq-line m-line\" d=\"^43\"/><path class=\"eq-line m-line\" d=\"^44\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#leg-extension-m-e-thigh.l\"/><use href=\"#leg-extension-m-e-kneecap.l\"/><use href=\"#leg-extension-m-e-shank.l\"/><use href=\"#leg-extension-m-e-foot.l\"/><use href=\"#leg-extension-m-e-shcap.l\"/><use href=\"#leg-extension-m-e-upper.l\"/><use href=\"#leg-extension-m-e-elbowcap.l\"/><use href=\"#leg-extension-m-e-fore.l\"/><use href=\"#leg-extension-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-m-e-thigh.l\"/><use href=\"#leg-extension-m-e-kneecap.l\"/><use href=\"#leg-extension-m-e-shank.l\"/><use href=\"#leg-extension-m-e-foot.l\"/><use href=\"#leg-extension-m-e-shcap.l\"/><use href=\"#leg-extension-m-e-upper.l\"/><use href=\"#leg-extension-m-e-elbowcap.l\"/><use href=\"#leg-extension-m-e-fore.l\"/><use href=\"#leg-extension-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-extension-m-e-head\"/><use href=\"#leg-extension-m-e-torso\"/><use href=\"#leg-extension-m-e-thigh.r\"/><use href=\"#leg-extension-m-e-kneecap.r\"/><use href=\"#leg-extension-m-e-shank.r\"/><use href=\"#leg-extension-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-m-e-head\"/><use href=\"#leg-extension-m-e-torso\"/><use href=\"#leg-extension-m-e-thigh.r\"/><use href=\"#leg-extension-m-e-kneecap.r\"/><use href=\"#leg-extension-m-e-shank.r\"/><use href=\"#leg-extension-m-e-foot.r\"/></g></g><path class=\"eq\" d=\"^45\"/><path class=\"eq-solid\" d=\"^46\"/><path class=\"eq-pin\" d=\"^47\"/><path class=\"eq-solid\" d=\"^48\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-extension-m-e-shcap.r\"/><use href=\"#leg-extension-m-e-upper.r\"/><use href=\"#leg-extension-m-e-elbowcap.r\"/><use href=\"#leg-extension-m-e-fore.r\"/><use href=\"#leg-extension-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-m-e-shcap.r\"/><use href=\"#leg-extension-m-e-upper.r\"/><use href=\"#leg-extension-m-e-elbowcap.r\"/><use href=\"#leg-extension-m-e-fore.r\"/><use href=\"#leg-extension-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"151.96\" cy=\"189.14\" r=\"2.25\"/><circle class=\"joint\" cx=\"163.73\" cy=\"217.18\" r=\"2.25\"/><circle class=\"joint\" cx=\"157.99\" cy=\"257.99\" r=\"2.25\"/><circle class=\"joint\" cx=\"220.71\" cy=\"257.99\" r=\"2.25\"/></g><mask id=\"leg-extension-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#leg-extension-m-m-head\" fill=\"#000\"/><use href=\"#leg-extension-m-m-torso\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-shank.l\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-foot.l\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-upper.l\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-fore.l\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-fist.l\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-shank.r\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-foot.r\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-upper.r\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-fore.r\" fill=\"#000\"/><use href=\"#leg-extension-m-mf-fist.r\" fill=\"#000\"/><use href=\"#leg-extension-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#leg-extension-m-mmask)\"><g class=\"u-stroke\"><use href=\"#leg-extension-m-m-head\"/><use href=\"#leg-extension-m-m-torso\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~#60S-rYJE1.)qR(z1ThNy1GX1.P1000000101000\"/><path class=\"leader m\" d=\"M147.73 242.49L199 226H209\"/><path class=\"leader m\" d=\"M142.33 201.72L191 176H201\"/></g>\n<g class=\"plate-zoom\" data-view=\"mistake\" data-k=\"1.5\" data-c=\"72 138\" data-src=\"138.55 202.64\"><defs><clipPath id=\"leg-extension-m-zclip\"><circle cx=\"72\" cy=\"138\" r=\"52\"/></clipPath></defs><circle class=\"pz-src\" cx=\"138.55\" cy=\"202.64\" r=\"34.67\"/><path class=\"pz-link\" d=\"~MPDmP.y1LIrRq\"/><circle class=\"pz-bg\" cx=\"72\" cy=\"138\" r=\"52\"/><g class=\"pz-in\" clip-path=\"url(#leg-extension-m-zclip)\">\n  <defs><pattern id=\"leg-extension-m-z-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"leg-extension-m-z-st-shank.l\" d=\"~#F12!(z1YBI1OAA1.(F1W2Xh(10F7P(2(8.bD4-5V5RA3wbIk0)h)aIkW5RA3B4-5*8.bG7P(2-10X2XhEjSh.jwB10Uw1!jwB100000101000000000100001000000200000200002000000100000000010100001010000000002020\"/><path id=\"leg-extension-m-z-st-foot.l\" d=\"~#o2H-A1J).1XTB1IO_1Fj_4Jq)bND1xA1JD4X4BT3B7T-1)b)z10I(1D7-gBjDI1-gRx1JD1000020000121010200020002000020000000000001010000\"/><path id=\"leg-extension-m-z-st-shank.r\" d=\"^68\"/><path id=\"leg-extension-m-z-st-foot.r\" d=\"^69\"/><path id=\"leg-extension-m-z-e-thigh.l\" d=\"~#F12PYj(YN1*RhR(N1VhW22(1y(2E5Xb)8.5x4XO2-3Ky1RiIu2Ky1NiXO2!3.5y4Xbw9y(2F52*1VhV2VhYN1F*1(w1wW10F*1*w110100000200001200120000000010000000100020000200220020021010010101000100000100012\"/><path id=\"leg-extension-m-z-e-kneecap.l\" d=\"~~HxA1YBI1Dz20\"/><path id=\"leg-extension-m-z-e-shank.l\" d=\"~#F12N(B1yIK1IYz1E)J1IhE46*1W(2y1*a)9R5V4RA3x3IjXc*hR1GlA9Rz3GeE6S3Rc(7N*2Nf3(1.hA1_fWkAz1wnNw1!2UD1Tg00022001001210000100000002000010100000000000011000010100002001000000111000001002\"/><path id=\"leg-extension-m-z-e-foot.l\" d=\"~#o2HYW1U)K1-HV1zxK1P6ViV9KrOw1GG1!6GD4zhyS3xhNY1x3_z1W1Y(1RkAf)cOJ1Jz1YA1000000101100000010012002000001000100020000210000\"/><path id=\"leg-extension-m-z-e-shcap.l\" d=\"~~wYfDwnwF20\"/><path id=\"leg-extension-m-z-e-upper.l\" d=\"~#F12U*fy!nVRf).mV2z8e3(kUF1A2x7uO3j.nw3XvO9Xm-ozkTgBhx3X1R6K3JeNI1f6*3T7Ku*9E4HI1AdyvYx1Jr10101210121110100000210001010000001011100002002000210100100000012000100121010010\"/><path id=\"leg-extension-m-z-e-elbowcap.l\" d=\"~~P-jAEv_U10\"/><path id=\"leg-extension-m-z-e-fore.l\" d=\"~#F12UYjDUvOVjOUu7.bS1Y1WgDN1W2KbW1B3O6ItP5xl)3IgRezgX7zt)2)1V7.8P6SP1hJ2E5VaIh-6I8Fw1D6ypDm_o00010011100000000010110000000000001010000010000010010000000000001210000000001020\"/><path id=\"leg-extension-m-z-e-fist.l\" d=\"~~URmU!G1wP10\"/><path id=\"leg-extension-m-z-e-head\" d=\"~#w12DWgwy8KFeG_7BqAvIr(gBhI3B4U7B8IbKdTfBtEvN5VjT3BeTsS2(vVjUw1OcSvy2YuJl4(s1000000000010010000001101000011010012100201000100000000010000010\"/><path id=\"leg-extension-m-z-e-torso\" d=\"~#_12HyfNIfRHf.AdEfE8X4cWgypAfH8FlFmS9rXc)y1Ky1x9Ri!8HnE9FuGcJv-qwoTs!5*e)d*mEK1*P1GkEE1R9qGeH1DlDm!5SbEkEa-mwe.6(vNaY8UhKi!5PbBY3Y_100100200000000001000000001100001010000000001010000001010002100000001000000000000000002021000010000000000012100000001\"/><path id=\"leg-extension-m-z-e-thigh.r\" d=\"^70\"/><path id=\"leg-extension-m-z-e-kneecap.r\" d=\"^71\"/><path id=\"leg-extension-m-z-e-shank.r\" d=\"^72\"/><path id=\"leg-extension-m-z-e-foot.r\" d=\"^73\"/><path id=\"leg-extension-m-z-e-shcap.r\" d=\"^74\"/><path id=\"leg-extension-m-z-e-upper.r\" d=\"^75\"/><path id=\"leg-extension-m-z-e-elbowcap.r\" d=\"^76\"/><path id=\"leg-extension-m-z-e-fore.r\" d=\"^77\"/><path id=\"leg-extension-m-z-e-fist.r\" d=\"^78\"/><path id=\"leg-extension-m-z-m-head\" d=\"~#w12S*iJR7-OgVG7BqAvIr(gEhI3x4U7E8IbKdTfBtEvN5VjT3BeVsS2yw1VjSw1OcSvy2YuJl4(s1000000002010000200001121000011010012100200020101000000010020010\"/><path id=\"leg-extension-m-z-m-torso\" d=\"~#_12WGh__e)RhEUczfE8-4cWgypAfH8FlFmycB2RjBA1XK1xcGjy6WoE4Aw1V5HA1XjJt)m(8Id)8Gpzy1I-1TbOH1E9*ixE1*hSkW-1_5SbzkEa.mwe.6(vNaY8UhKi!5PbBY3Y_100002200000000001000001010000000202000000000000000100012101000100002202001210111100002220000010000000000010100021010\"/><path id=\"leg-extension-m-z-mf-thigh.l\" d=\"~#F12JSkU.N1-IiExO1VhW22!1y(2B5Xb*8.5B4XO2X3Ky1OiIu1Ky1SiXO2Y3.5D4Xb(8y(2D52-1Vh-2Vh!N1F*1!w1wW11F*1-w110110000200000000000000200000000010000000002000000010020000110121000100000100210\"/><path id=\"leg-extension-m-z-mf-kneecap.l\" d=\"~~D.A1NFI1Dz20\"/><path id=\"leg-extension-m-z-mf-shank.l\" d=\"~#F12HYD1YKK1ESA1*xK1IhG46-1W(2u*a*9R5T4RA3B3IjTc*hT1GlA9Rz3GeE6S3Rc!7N*2Sf3_1.hD1YfWkDz1ynPw1Y2SD1Og00012100001010000000000000020010110100000001011000001000000000000020000021001000\"/><path id=\"leg-extension-m-z-mf-foot.l\" d=\"~#o2DSX1HyN1VAW1-zK1P6XiV9GrOw1KG1!6ED4zhAS3xhHY1x3!z1W1_(1Rkwf)cKJ1Jz1_A1000001101001010012002010000000000001000200200000\"/><path id=\"leg-extension-m-z-mf-shcap.l\" d=\"~~J)hSOmwF20\"/><path id=\"leg-extension-m-z-mf-upper.l\" d=\"~#F12UxiJxnR_hxwmO1I8g5WeAI1D3X6N1E3!2GnW7)uz6*nOlOn.dxjX2B2)5I4Y7!J1d2-2x8XsKeKaDH1H8Uw1Ntyw112001001010000010000120000000100202000100200202000000000010100000000000000000000\"/><path id=\"leg-extension-m-z-mf-elbowcap.l\" d=\"~~WYkDyv_U10\"/><path id=\"leg-extension-m-z-mf-fore.l\" d=\"~#F12(WkNHvXWkXHusXbN1!1JcHO1Y3zbw2)2-3TtH7OkO2Tg)cKhz5Ot-2B2X6R9w2_P1pH2E4xbTgO8EbJv_3SpwkWq00002101000101002001000002000002000000000000002000010100000101200000100000010110\"/><path id=\"leg-extension-m-z-mf-fist.l\" d=\"^78\"/><path id=\"leg-extension-m-z-mf-thigh.r\" d=\"^83\"/><path id=\"leg-extension-m-z-mf-kneecap.r\" d=\"^84\"/><path id=\"leg-extension-m-z-mf-shank.r\" d=\"^85\"/><path id=\"leg-extension-m-z-mf-foot.r\" d=\"^86\"/><path id=\"leg-extension-m-z-mf-shcap.r\" d=\"^87\"/><path id=\"leg-extension-m-z-mf-upper.r\" d=\"^88\"/><path id=\"leg-extension-m-z-mf-elbowcap.r\" d=\"^89\"/><path id=\"leg-extension-m-z-mf-fore.r\" d=\"^90\"/><path id=\"leg-extension-m-z-mf-fist.r\" d=\"^78\"/><path id=\"leg-extension-m-z-mo-0\" d=\"^79\"/><path id=\"leg-extension-m-z-mo-1\" d=\"^80\"/><path id=\"leg-extension-m-z-mo-2\" d=\"^70\"/><path id=\"leg-extension-m-z-mo-3\" d=\"^71\"/><path id=\"leg-extension-m-z-mo-4\" d=\"^72\"/><path id=\"leg-extension-m-z-mo-5\" d=\"^73\"/><path id=\"leg-extension-m-z-mo-6\" d=\"^74\"/><path id=\"leg-extension-m-z-mo-7\" d=\"^75\"/><path id=\"leg-extension-m-z-mo-8\" d=\"^76\"/><path id=\"leg-extension-m-z-mo-9\" d=\"^77\"/><path id=\"leg-extension-m-z-mo-10\" d=\"^78\"/><path id=\"leg-extension-m-z-mo-11\" d=\"^70\"/><path id=\"leg-extension-m-z-mo-12\" d=\"^71\"/><path id=\"leg-extension-m-z-mo-13\" d=\"^72\"/><path id=\"leg-extension-m-z-mo-14\" d=\"^73\"/><path id=\"leg-extension-m-z-mo-15\" d=\"^74\"/><path id=\"leg-extension-m-z-mo-16\" d=\"^75\"/><path id=\"leg-extension-m-z-mo-17\" d=\"^76\"/><path id=\"leg-extension-m-z-mo-18\" d=\"^77\"/><path id=\"leg-extension-m-z-mo-19\" d=\"^78\"/><path id=\"leg-extension-m-z-mo-20\" d=\"M-34.68 341.5L137.85 341.5Q141.85 341.5 141.85 337.5L141.85 332.33Q141.85 328.33 137.85 328.33L-34.68 328.33Q-38.68 328.33 -38.68 332.33L-38.68 337.5Q-38.68 341.5 -34.68 341.5Z\"/><path id=\"leg-extension-m-z-mo-21\" d=\"~MJKnyI)1L0TRcQ0)o)oUYbLE7wpQ)o0F7wpLwpUYbQ0wpwpTYbLF7)oQwp0E7)oZ\"/><path id=\"leg-extension-m-z-mo-22\" d=\"~MYHaHES1LyTn0Qwp0x_m)oL)o)kQ0)o)owlLx_mwpQ)o0y_mwpLwpwlQ0wpwp)kZ\"/><path id=\"leg-extension-m-z-mo-23\" d=\"~M!*d_yN1LXG1B)oQG1)oPfPEoLVjAqQ)oF1Fm_nLNx2(AoQH1wpOfOEoLWjxqQwpG1Em*nZ\"/><path id=\"leg-extension-m-z-mo-24\" d=\"~MJT9FHuLGV20Q)o0H!1wpLwpF7Q0wpwpE7LH!1)oQwp0G!1)oL)oE7Q0)o)oF7Z\"/><path id=\"leg-extension-m-z-mo-25\" d=\"~MFN7yI)1L0OJw1Q0)o)oPTvLG7wpQ)o0H7wpLwpPTvQ0wpwpOTvLH7)oQwp0G7)oZ\"/><path id=\"leg-extension-m-z-mo-26\" d=\"M-26.71 328.33L19.56 328.33Q20.56 328.33 20.56 327.33L20.56 316.16Q20.56 315.16 19.56 315.16L-26.71 315.16Q-27.71 315.16 -27.71 316.16L-27.71 327.33Q-27.71 328.33 -26.71 328.33Z\"/><path id=\"leg-extension-m-z-mo-27\" d=\"M-27.71 260.3L20.56 260.3L20.56 315.16L-27.71 315.16Z\"/><path id=\"leg-extension-m-z-mo-28\" d=\"M-27.71 194.84L20.56 194.84L20.56 227.75L-27.71 227.75Z\"/><path id=\"leg-extension-m-z-mo-29\" d=\"~MP)A1YFI1LRH3wH4QGf_jyO3*D3Llxw1Q_jFfFvO7LSE2OB4QFf-jzO3(D3Lkyw1QXjEfBvP7Z\"/><path id=\"leg-extension-m-z-mo-30\" d=\"~MPPnYKH1L0NY5Q0AhAhGE5LzhzhQAh0AhzhLzhGE5Q0zhzhHE5LAhAhQzh0zhAhZ\"/><path id=\"leg-extension-m-z-mo-31\" d=\"~MwyE1H!I1LSIdEK2QUoO4IXcDP1LxlFoQK4RoBsGfLONcJx3QToN4JXcBP1LylGoQN4UoDsNfZ\"/><path id=\"leg-extension-m-z-mo-32\" d=\"~#F12D_X1AKF1.*X1IAG1)6D2)5J4G4w6G2w70J7F2w7J4w6w6J4w7D2J72w7E2w6I4J4)5F2)60I7G2)6G4)5)5I4)6E200200100020010001100100110002002000110000210020001200010021000120010000100022002\"/><path id=\"leg-extension-m-z-mo-33\" d=\"~~J.A1YBI1AG12\"/><path id=\"leg-extension-m-z-mo-34\" d=\"~~F(B1YBI1F60\"/><path id=\"leg-extension-m-z-mo-35\" d=\"~MSXoU!G1L*2)aLx5w3L)2y5L2!5L!2y5LA5w3L!51LA5.2L!2z5L2.5L)2z5Z\"/></defs>\n  \n  <path class=\"floorline\" d=\"M-49.66 342H315.09\"/><path class=\"eq\" d=\"^91\"/><path class=\"eq\" d=\"^92\"/><path class=\"eq\" d=\"^93\"/><path class=\"eq\" d=\"^94\"/><path class=\"eq\" d=\"^95\"/><path class=\"eq\" d=\"^96\"/><path class=\"eq\" d=\"^97\"/><path class=\"eq-thin\" d=\"M-18.06 315.16L-18.06 150.59\"/><path class=\"eq-thin\" d=\"~MDA2YR*1L0RAw1\"/><path class=\"eq\" d=\"^98\"/><path class=\"eq-thin\" d=\"M-27.71 309.68H20.56M-27.71 304.19H20.56M-27.71 298.71H20.56M-27.71 293.22H20.56M-27.71 287.73H20.56M-27.71 282.25H20.56M-27.71 276.76H20.56M-27.71 271.28H20.56M-27.71 265.79H20.56\"/><path class=\"eq\" d=\"^100\"/><path class=\"eq\" d=\"^101\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#leg-extension-m-z-st-shank.l\"/><use href=\"#leg-extension-m-z-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-m-z-st-shank.l\"/><use href=\"#leg-extension-m-z-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-extension-m-z-st-shank.r\"/><use href=\"#leg-extension-m-z-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-m-z-st-shank.r\"/><use href=\"#leg-extension-m-z-st-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^99\"/><path class=\"eq-thin\" d=\"M-27.71 222.27H20.56M-27.71 216.78H20.56M-27.71 211.29H20.56M-27.71 205.81H20.56M-27.71 200.32H20.56\"/><path class=\"eq\" d=\"^102\"/><path class=\"eq-line m-line\" d=\"~M((D1S(H1LDO3!Xc\"/><path class=\"eq-line m-line\" d=\"~MyHB1(JI1LAO3(Xc\"/><path class=\"eq-line m-line\" d=\"~M(SJ1ND_1LR2OjL)4H1LK4S2LT3U3LR2P4LG1!4L0F5LF1!4LW2P4LS3U3LN4S2Lw5H1LA52Lw5I1LN4R2LS3V3LW2I4LF1)4L0z5LG1)4LR2I4LT3V3LK4R2L)4I1\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#leg-extension-m-z-e-thigh.l\"/><use href=\"#leg-extension-m-z-e-kneecap.l\"/><use href=\"#leg-extension-m-z-e-shank.l\"/><use href=\"#leg-extension-m-z-e-foot.l\"/><use href=\"#leg-extension-m-z-e-shcap.l\"/><use href=\"#leg-extension-m-z-e-upper.l\"/><use href=\"#leg-extension-m-z-e-elbowcap.l\"/><use href=\"#leg-extension-m-z-e-fore.l\"/><use href=\"#leg-extension-m-z-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-m-z-e-thigh.l\"/><use href=\"#leg-extension-m-z-e-kneecap.l\"/><use href=\"#leg-extension-m-z-e-shank.l\"/><use href=\"#leg-extension-m-z-e-foot.l\"/><use href=\"#leg-extension-m-z-e-shcap.l\"/><use href=\"#leg-extension-m-z-e-upper.l\"/><use href=\"#leg-extension-m-z-e-elbowcap.l\"/><use href=\"#leg-extension-m-z-e-fore.l\"/><use href=\"#leg-extension-m-z-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-extension-m-z-e-head\"/><use href=\"#leg-extension-m-z-e-torso\"/><use href=\"#leg-extension-m-z-e-thigh.r\"/><use href=\"#leg-extension-m-z-e-kneecap.r\"/><use href=\"#leg-extension-m-z-e-shank.r\"/><use href=\"#leg-extension-m-z-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-m-z-e-head\"/><use href=\"#leg-extension-m-z-e-torso\"/><use href=\"#leg-extension-m-z-e-thigh.r\"/><use href=\"#leg-extension-m-z-e-kneecap.r\"/><use href=\"#leg-extension-m-z-e-shank.r\"/><use href=\"#leg-extension-m-z-e-foot.r\"/></g></g><path class=\"eq\" d=\"^103\"/><path class=\"eq-solid\" d=\"^104\"/><path class=\"eq-pin\" d=\"^105\"/><path class=\"eq-solid\" d=\"^106\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#leg-extension-m-z-e-shcap.r\"/><use href=\"#leg-extension-m-z-e-upper.r\"/><use href=\"#leg-extension-m-z-e-elbowcap.r\"/><use href=\"#leg-extension-m-z-e-fore.r\"/><use href=\"#leg-extension-m-z-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#leg-extension-m-z-e-shcap.r\"/><use href=\"#leg-extension-m-z-e-upper.r\"/><use href=\"#leg-extension-m-z-e-elbowcap.r\"/><use href=\"#leg-extension-m-z-e-fore.r\"/><use href=\"#leg-extension-m-z-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"92.16\" cy=\"117.79\" r=\"2.25\"/><circle class=\"joint\" cx=\"109.8\" cy=\"159.86\" r=\"2.25\"/><circle class=\"joint\" cx=\"101.2\" cy=\"221.08\" r=\"2.25\"/><circle class=\"joint\" cx=\"195.28\" cy=\"221.08\" r=\"2.25\"/></g><mask id=\"leg-extension-m-z-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#leg-extension-m-z-m-head\" fill=\"#000\"/><use href=\"#leg-extension-m-z-m-torso\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-thigh.l\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-kneecap.l\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-shank.l\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-foot.l\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-shcap.l\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-upper.l\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-fore.l\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-fist.l\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-thigh.r\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-kneecap.r\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-shank.r\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-foot.r\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-shcap.r\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-upper.r\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-fore.r\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mf-fist.r\" fill=\"#000\"/><use href=\"#leg-extension-m-z-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#leg-extension-m-z-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#leg-extension-m-z-mmask)\"><g class=\"u-stroke\"><use href=\"#leg-extension-m-z-m-head\"/><use href=\"#leg-extension-m-z-m-torso\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~#60WBfDWqz)d*PlRqYT1-S2IG2000002002000\"/></g>\n</g><circle class=\"pz-ring\" cx=\"72\" cy=\"138\" r=\"52\"/></g></svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"leg-extension-m-arch\" data-key=\"arch\" data-cue=\"The lower back arches as the legs extend.\" class=\"plate-callout two m\" style=\"left:56.98%;top:56.98%\" aria-pressed=\"true\">Back<br>arches</button><button type=\"button\" id=\"leg-extension-m-off\" data-key=\"off\" data-cue=\"The back lifts off the back pad.\" class=\"plate-callout two m\" style=\"left:54.75%;top:43.02%\" aria-pressed=\"false\">Back off<br>pad</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "pivot",
        cues: [{ key: "pivot", cue: "Knees line up with the machine's pivot." }, { key: "back", cue: "Keep your back pressed into the pad without arching." }, { key: "soft", cue: "Straighten without locking your knees." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "arch",
        cues: [{ key: "arch", cue: "The lower back arches as the legs extend." }, { key: "off", cue: "The back lifts off the back pad." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Back arches</b><span>The lower back arches as the legs extend.</span></li><li><b>Back off pad</b><span>The back lifts off the back pad.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: extend 2 seconds, hold 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Extend</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Leg extension, side view. Seated on a machine with the back on the pad, the knees level with the lever pivot and a roller on the lower shins, the lifter straightens the legs from 90 degrees until they are nearly level, without locking the knees.",
      mistakeAlt: "Leg Extension: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP (b): the card gives no thumb, contact or wrist claim; its grip type and width (c3) are setup step 4."
  },
  contacts: [
    "seat-back",
    "pivot-pad"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Knees at the pivot. Pad on your lower shins, just above ankles.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-le",
          "mo-le",
          "lifto-le",
          "fv-le"
        ],
        "note": "card c1, c2"
      }
    },
    {
      "kind": "position",
      "text": "Sit back against the pad, knees bent about 90 degrees.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-le",
          "lifto-le",
          "mo-le"
        ],
        "note": "card c3, c4"
      }
    },
    {
      "kind": "grip",
      "text": "Hold the handles at your sides. Brace your abs.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-le",
          "lifto-le",
          "mo-le"
        ],
        "note": "card c3, c4"
      }
    },
    {
      "kind": "position",
      "text": "Breathe out and lift with your quads, don't kick. Pause briefly.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-le",
          "lifto-le",
          "bb-le",
          "fv-le"
        ],
        "note": "card c12, c9, c18"
      }
    },
    {
      "kind": "position",
      "text": "Breathe in and lower slowly with control.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-le",
          "lifto-le",
          "fv-le",
          "bb-le"
        ],
        "note": "card c12, c11"
      }
    }
  ],
  posture: [
    {
      "key": "pivot",
      "label": "Knee at pivot",
      "detail": "Knee level with the machine's pivot.",
      "anchor": {
        "pose": "start",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-le",
          "mo-le",
          "lifto-le"
        ],
        "note": "card c1"
      }
    },
    {
      "key": "shin-pad",
      "label": "Pad above ankles",
      "detail": "Pad on the lower shins, just above the ankles.",
      "anchor": {
        "pose": "start",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "lifto-le",
          "fv-le"
        ],
        "note": "card c2"
      }
    },
    {
      "key": "arch",
      "label": "Back on pad",
      "detail": "Brace your abs. Go lighter until you can lift without arching.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-le",
          "sl-le",
          "mo-le",
          "lifto-le"
        ],
        "note": "card c5, c6, c4"
      }
    },
    {
      "key": "top",
      "label": "Knees unlocked",
      "detail": "Straighten your legs without locking your knees.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-le",
          "mo-le",
          "fv-le",
          "lifto-le",
          "sl-le"
        ],
        "note": "card c7, c8"
      }
    },
    {
      "key": "kick",
      "label": "No kicking",
      "detail": "Lift with your quads, slow and controlled. Don't kick.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-le",
          "fv-le",
          "sl-le",
          "mo-le",
          "lifto-le"
        ],
        "note": "card c9, c10"
      }
    },
    {
      "key": "pause",
      "label": "Pause, then lower",
      "detail": "Pause briefly at the top. Lower slowly with control.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-le",
          "lifto-le",
          "fv-le",
          "bb-le"
        ],
        "note": "card c18, c11"
      }
    }
  ],
  zooms: [
    {
      "key": "top",
      "chip": "Knees",
      "heading": "Knee lockout",
      "kind": "posture",
      "feelRow": "knee"
    }
  ],
  chips: [
    "top",
    "feel"
  ],
  copy: {
    "setupLine": "Start with a lower weight. Knees line up with the pivot.",
    "mistakeLine": "Don't kick up with momentum. Lift with your quads, slow and controlled.",
    "cueLine": "Pause at the top, lower slowly."
  },
  mistakes: [],
  risks: [
    {
      "key": "lock",
      "text": "Locking your knees at the top can add stress to the knee.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-le",
          "mo-le",
          "lifto-le",
          "sl-le"
        ],
        "note": "card c8"
      }
    },
    {
      "key": "arch",
      "text": "Arching your lower back can lead to discomfort.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-le",
          "mo-le",
          "lifto-le"
        ],
        "note": "card c6"
      }
    },
    {
      "key": "load",
      "text": "Too much weight can increase injury risk and likely leads to excess momentum.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-le",
          "mo-le",
          "lifto-le"
        ],
        "note": "card c10"
      }
    }
  ],
  riskFlags: [
    "knee",
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
    "bb-le",
    "sl-le",
    "mo-le",
    "lifto-le",
    "fv-le",
    "nhs-knee-pain",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/leg_extension.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

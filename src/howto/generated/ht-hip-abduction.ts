// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=ca2c92ffc646e7288436e0f52641949662a986dc70d2e4e6b0d5e6ed255c3fda
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_hip_abduction",
  name: "Hip Abduction",
  hashes: { inputsSha256: "ca2c92ffc646e7288436e0f52641949662a986dc70d2e4e6b0d5e6ed255c3fda", golden: "27eb090e46d20cd8d521fca5abb7c68f58ce58107acd46452631da7df041f251" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"hip-abduction-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"hip-abduction-n-st-thigh.l\" d=\"~#F12Y!D1UYP1EyE1xYP1!1pox1O6d)2A5G1N2xmEdwbUnDgyc_p(3*iIh!1*1D4K4I2x6ly17w2N(1!7OjxH1-sRl.K1*600021000101000010000000200000001010022000202000021000020000001000020010100000002\"/><path id=\"hip-abduction-n-st-kneecap.l\" d=\"~~UDz1WxS1_J10\"/><path id=\"hip-abduction-n-st-shank.l\" d=\"~#F12wBz1WxS1XFz1RSP1_1VbF11_4!(1y6.7W2.3X3.y2H7Vd2.bI7VdY3.y2V2.3x6.7-4!(1E11-1Vb-cSbGdWo2YlFdWo01000200011100002012100000010020000001000000021000002101000200010110002000002001\"/><path id=\"hip-abduction-n-st-foot.l\" d=\"~#e2(Uz1SK*1-xy1XK*1IuyY1-cGuEN1xjR9G6PG1zw1Ajxo2200101010010100000000010000\"/><path id=\"hip-abduction-n-st-thigh.r\" d=\"~#F12Y!x1UTU1V.x1x-U18w2my1J2x6B4K4.1*1(iIh-p(3Bgyc)aUnymEdH1N2w3A5P6dnx1.1pBp_-1!K1*6_sRlPjxH100010000100000110000021210120001010000000210100001002020002002101200000001011000\"/><path id=\"hip-abduction-n-st-kneecap.r\" d=\"~~H*vWxS1_J10\"/><path id=\"hip-abduction-n-st-shank.r\" d=\"~#F12W.vWxS1K)vRSP1_1VbF11_4!(1y6.7W2.3X3.y2J7Vd1.bG7VdY3.y2V2.3x6.7-4!(1E11-1Vb-cSbEdWo1YlHdWo01000200011100002012100000010000100001000000021000002101000200010110000010002001\"/><path id=\"hip-abduction-n-st-foot.r\" d=\"~#e2SFy1SK*1V.z1XK*1JuyY1_cGuFN1xjS9G6OG1zw1zjxo1200200000010100000000010000\"/><path id=\"hip-abduction-n-g0-thigh.l\" d=\"~#F12WID1H*U1zED1EzV1nH2cA1_6K6G3z5R1I2WiGa.p-2XiW7VgwkUkR5iY2F1!5H90fz1B2z1XA1UP1DN1(4Fx1OdStXz101012110010100001100111000002002000001002220002001000210000100002000000000001100\"/><path id=\"hip-abduction-n-g0-kneecap.l\" d=\"~~wUB1_xS1_J10\"/><path id=\"hip-abduction-n-g0-shank.l\" d=\"~#F12JSB1_xS1zWB1VSP1_1XbF10_4((1y6*7W2.3X3*y2J7Rd1)bG7RdY3*y2V2.3x6*7-4((1E10-1Xb-cSbEdWo1YlHdWo01000002000000002010100000002200100200000000000000002000020000010100000010002001\"/><path id=\"hip-abduction-n-g0-foot.l\" d=\"~#e2JPD1NK*1R*A1xK*1BuWX1VcKuxN1OjK9K6DG1Vvyj.n0011111000101101011000000000\"/><path id=\"hip-abduction-n-g0-thigh.r\" d=\"~#F12WIx1wOP1zTx1*KP1D2z1gz1G90E1!5hY2TkR5WgwkYiW7!p-2ViGaS1I2H3z5-6K6bA1oH2F!1B9RtXz1Ex1OdBN1(400000100200200011000101200010000021000100021002100101101201101010021000000101010\"/><path id=\"hip-abduction-n-g0-kneecap.r\" d=\"~~(Ot_xS1_J10\"/><path id=\"hip-abduction-n-g0-shank.r\" d=\"~#F12HNt_xS1xStVSP1_1XbF10_4((1y6*7W2.3X3*y2H7Rd2)bI7RdY3*y2V2.3x6*7-4((1E10-1Xb-cSbGdWo2YlFdWo01000002001000000010100000000220001200000000001000000000020000010110002000000001\"/><path id=\"hip-abduction-n-g0-foot.r\" d=\"~#e2AKvNK*1*)w1xK*1DuWX1WcKuyN1OjN9K6BG1Vvxj.n0001012000000111112000000000\"/><path id=\"hip-abduction-n-g1-thigh.l\" d=\"~#F12P_B1yyV1)IB1zFV1O3J26F1PjR6I3K5V1T2Y4E3VoV8.jA3.kWfN5Y1n!2T1H6Ska3E1x4B1GD1PB1YI1JfPz1K5wB1*r00000000000010200000000002100002200010101200010010000021000010101000001002001001\"/><path id=\"hip-abduction-n-g1-kneecap.l\" d=\"~~N)E1WyS1_J10\"/><path id=\"hip-abduction-n-g1-shank.l\" d=\"~#F12_*E1WyS1RxF1OTP1_1-bF10_4!(1y6-7W2)3X3-y2H7Td2)bI7TdY3-y2V2)3x6-7-4!(1E10-1-b-cWbGdUo2YlFdUo00000000001000000010110000000020001000000001001000000000000000000011000000000100\"/><path id=\"hip-abduction-n-g1-foot.l\" d=\"~#e2PHG1HN*1)-E1OK*1-sPX1xcTuxJ1*j)8R6JE1EvDiTn0100022001100020000010000000\"/><path id=\"hip-abduction-n-g1-thigh.r\" d=\"~#F12P_w1FHP1zHx1.FP1y4B14E1RkaU1H6o!2K5Y1!kWf!jA3WoV8X4E3W1T2J3K5OjR65F1P3J2_O1Bo)A1*rOz1K5XI1Jf00001000110000200001000200200010020020020000000010200000000000000120000220000000\"/><path id=\"hip-abduction-n-g1-kneecap.r\" d=\"~~PArWyS1_J10\"/><path id=\"hip-abduction-n-g1-shank.r\" d=\"~#F12!yrWyS1TDrOTP1_1-bF10_4!(1y6-7W2)3X3-y2J7Td1)bG7TdY3-y2V2)3x6-7-4!(1E10-1-b-cWbEdUo1YlHdUo00000000000000002010110000002000100000000001000000002000000000000001000000002100\"/><path id=\"hip-abduction-n-g1-foot.r\" d=\"~#e2wTsHN*1OzuOK*1_sPX1ycTuyJ1*jw9R6IE1EvBiTn0100021001200010000020000000\"/><path id=\"hip-abduction-n-e-head\" d=\"~#D12Y(y1DErzVx1-wrEjJeXcFbT9A3-4B3B3z3-4E3-4)7R1)7B3R9D3R9S1)7_4)7_4E3D3z3_4B3U9A3YcFbFjJe0000100200001010000000101100002100000000000011000001000000002020000002200000\"/><path id=\"hip-abduction-n-e-torso\" d=\"~#A22SIA1(Dw1)GA1B_u!c*iArsy8z9K6I3IeUg-J1(d-4-cU9YsT9_c_4R9DjK6U9N6-c1)nVc)E1xoID2zrJD2zrwF1xowoVc_c1T9N6BjK6-4R9U9_cT9Ys_4-c_J1(dJeUgN6I3x8z9zrs.c*iyY2YJ10220001000002002100000010101012000000000000000200000000200002100020200110000020000001000000000000000100101010100000012100000200010020000\"/><path id=\"hip-abduction-n-e-shcap.l\" d=\"~~(*E1HIB1wP10\"/><path id=\"hip-abduction-n-e-upper.l\" d=\"~#F12FKF1NND1xUE1VVB1z6G685yA1HuB2E6z1z3Xn)t.6zk)bEbTkI5RvTlz3tO6V1!w1_x17aX6X5zc(aJ9JrNgJfysJ710000202001100101221000020000000200002002020000000100110000100100001202000000001\"/><path id=\"hip-abduction-n-e-elbowcap.l\" d=\"~~FyO1DUI1Dz10\"/><path id=\"hip-abduction-n-e-fore.l\" d=\"~#F12JBO1FyI1GVO1*IH1J6*75w2RhSD1S7B6N2E1_fErFc-7N5-9aOe(eXr9X2J1T9TnAz1T1D1N3R9I8X5Xi(bK8yf9Dm00000100000000000100010000200000000100001000022002000000002000200000000000000110\"/><path id=\"hip-abduction-n-e-fist.l\" d=\"~~yRH1U*T1ww10\"/><path id=\"hip-abduction-n-e-shcap.r\" d=\"~~S)qHIB1wP10\"/><path id=\"hip-abduction-n-e-upper.r\" d=\"~#F12_NrDFA1GGsXPz1Y6X58a.w1_x1P6V1A3tSvTlUkI5wcEb!6zkYn)tA1z3D2E6xA1Hu75A6G6*9.cxsJ7KgJfI9Jr20000100200120000000101000020010000000100000110200002100020200200110100010100100\"/><path id=\"hip-abduction-n-e-elbowcap.r\" d=\"~~_UkDUI1Dz10\"/><path id=\"hip-abduction-n-e-fore.r\" d=\"~#F12(XkADJ1EKk.JI1K3R9U1D1UnAz1I1T9aX2*eXr9OeK5-9Ec-7-fErK2E1R7B6ShSD16w2I6*7E9A4aDmN8yfYi(b10001000000000021002002000000100000010000001001110000010100100002011100000000000\"/><path id=\"hip-abduction-n-e-fist.r\" d=\"~~NJpU*T1ww10\"/><path id=\"hip-abduction-n-e-thigh.l\" d=\"~#F12WVB1UyV1O(A1OFV1X5H24H1yvI6K4R5E2R2IaR1)nEazk_1XlJe)9N3V1(2I3F6Wvm3G1x6E1Ew1Hy1WH1yi_z1B3WD1Rp00100000200000000200000000002021010001110000000001000001010200020001010000111100\"/><path id=\"hip-abduction-n-e-kneecap.l\" d=\"~~(BH1JAS1_J10\"/><path id=\"hip-abduction-n-e-shank.l\" d=\"~#F12JAH1JAS1BFH1BVP1!1-bF10!4!(1(5.7Y2.3V3.y2F7Td0)bE7TdW3.y2X2.3*5.7.4!(1E10.1-bXcUbEdYo0UlFdYo10200000010100000002202000110000000021001010020000000101000010200000020000020000\"/><path id=\"hip-abduction-n-e-foot.l\" d=\"~#e2Y)I1wP*1ITH1TN*1IqyX1xbVuBF1GkG8V6wA1.uUgOn0001000000000210101000010020\"/><path id=\"hip-abduction-n-e-thigh.r\" d=\"~#F12WVw1UGP1RKx1)EP1y6E14G1VvmJ3F6W1(2waN3YlJeAk_1woEaJaR1F2R2N4R5xvI63H1Y5H2!B1.rVD1Rp-z1B3VH1yi02000201010000010000000021010001111000000000001210101010000020000001010000111100\"/><path id=\"hip-abduction-n-e-kneecap.r\" d=\"~~(*oJAS1_J10\"/><path id=\"hip-abduction-n-e-shank.r\" d=\"~#F12J!oJAS1BwpBVP1!1-bF10!4!(1(5.7Y2.3V3.y2F7Td0)bE7TdW3.y2X2.3*5.7.4!(1E10.1-bXcUbEdYo0UlFdYo10200000010100000002202000110000000021001010020000000101000010200000020000020000\"/><path id=\"hip-abduction-n-e-foot.r\" d=\"~#e2Y*pwP*1zHrTN*1JqyX1ybVuDF1GkH8V6)z1.uTgOn0001001010000200002000010010\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#hip-abduction-n-dots)\"/>\n  <path class=\"floorline\" d=\"M88.3 339.5H269.7\"/><path class=\"eq\" d=\"~MDTuHIX1LAX80Qwp0z(7)oL)owbQ0)o)o)aLz(7wpQ)o0A(7wpLwp)aQ0wpwpwbZ\"/><path class=\"eq\" d=\"~MHzy1W_X1L0JH9Q0F6F6zA9LAA1E6QF60zA1E6LE6zA9Q0E6E6AA9LzA1F6QE60AA1F6Z\"/><path class=\"eq\" d=\"~M!.sYDy2LYBc0QF60O)bE6LE6V8Q0E6E6W8LO)bF6QE60P)bF6LF6W8Q0F6F6V8Z\"/><path class=\"eq\" d=\"~MJFvFTU1LYJ70QYi0)-6XiLXiXwjQ0XiXiYwjL)-6YiQXi0w_6YiLYiYwjQ0YiYiXwjZ\"/><path class=\"eq\" d=\"~M(Jy1HIx2LUz10QYi0.gXiLXi)-8Q0XiXiw_8L.gYiQXi0!gYiLYiw_8Q0YiYi)-8Z\"/><path class=\"eq\" d=\"~M_zoYDy2L!Vl0QYi0zzlXiLXiSaQ0XiXiRaLzzlYiQXi0AzlYiLYiRaQ0YiYiSaZ\"/><path class=\"eq\" d=\"~MyRI1y-W1L00QWd0WdXdLVdU4Q0XdVdT4LWdYdQXd0XdYdLYdT4Q0YdYdU4Z\"/><path class=\"eq\" d=\"~MHzI1NUV1LNr0LKrVK3LKrWK3LNrWK3Z\"/><path class=\"eq\" d=\"~MNJqy-W1L00QYd0YdXdLXdU4Q0XdXdT4LYdYdQVd0VdYdLWdT4Q0YdWdU4Z\"/><path class=\"eq\" d=\"~MY(pNUV1LNr0LKrVK3LKrWK3LNrWK3Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-abduction-n-st-thigh.l\"/><use href=\"#hip-abduction-n-st-kneecap.l\"/><use href=\"#hip-abduction-n-st-shank.l\"/><use href=\"#hip-abduction-n-st-foot.l\"/><use href=\"#hip-abduction-n-st-thigh.r\"/><use href=\"#hip-abduction-n-st-kneecap.r\"/><use href=\"#hip-abduction-n-st-shank.r\"/><use href=\"#hip-abduction-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-abduction-n-st-thigh.l\"/><use href=\"#hip-abduction-n-st-kneecap.l\"/><use href=\"#hip-abduction-n-st-shank.l\"/><use href=\"#hip-abduction-n-st-foot.l\"/><use href=\"#hip-abduction-n-st-thigh.r\"/><use href=\"#hip-abduction-n-st-kneecap.r\"/><use href=\"#hip-abduction-n-st-shank.r\"/><use href=\"#hip-abduction-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq\" d=\"~MYWF1PBw2LSA10LRA1EFbLRA1FFbLSA1FFbZ\"/><path class=\"eq\" d=\"~MUwB1(wx2LW_40LV_4KrLV_4NrLW_4NrZ\"/><path class=\"eq\" d=\"~MDysPBw2LSA10LRA1EFbLRA1FFbLSA1FFbZ\"/><path class=\"eq\" d=\"~MDys(wx2LW_40LV_4KrLV_4NrLW_4NrZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-abduction-n-g0-thigh.l\"/><use href=\"#hip-abduction-n-g0-kneecap.l\"/><use href=\"#hip-abduction-n-g0-shank.l\"/><use href=\"#hip-abduction-n-g0-foot.l\"/><use href=\"#hip-abduction-n-g0-thigh.r\"/><use href=\"#hip-abduction-n-g0-kneecap.r\"/><use href=\"#hip-abduction-n-g0-shank.r\"/><use href=\"#hip-abduction-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-abduction-n-g0-thigh.l\"/><use href=\"#hip-abduction-n-g0-kneecap.l\"/><use href=\"#hip-abduction-n-g0-shank.l\"/><use href=\"#hip-abduction-n-g0-foot.l\"/><use href=\"#hip-abduction-n-g0-thigh.r\"/><use href=\"#hip-abduction-n-g0-kneecap.r\"/><use href=\"#hip-abduction-n-g0-shank.r\"/><use href=\"#hip-abduction-n-g0-foot.r\"/></g></g><path class=\"eq\" d=\"~MSKF1F*U1L!W10L.W1.W5L.W1!W5L!W1!W5Z\"/><path class=\"eq\" d=\"~My-rF*U1L!W10L.W1.W5L.W1!W5L!W1!W5Z\"/><path class=\"eq\" d=\"~MNAH1_xS1Ltz7L-1gLR1uLI1J1LtS1Lf_1L2!1Le_1LuS1LH1J1LU1uL_1gL!11L_1dLU1tLH1G1LuT1Le-1L2.1Lf-1LtT1LI1G1LR1tL-1dZ\"/><path class=\"eq\" d=\"~M(Ot_xS1Ltz7L-1gLT1uLG1J1LtS1Ld_1L1!1Lg_1LuS1LJ1J1LS1uL_1gL!11L_1dLS1tLJ1G1LuT1Lg-1L1.1Ld-1LtT1LG1G1LT1tL-1dZ\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq\" d=\"~MDyI1SDw2LSA10LRA1KFbLRA1NFbLSA1NFbZ\"/><path class=\"eq\" d=\"~MU-E1wyx2LFS40LES4KrLES4NrLFS4NrZ\"/><path class=\"eq\" d=\"~MYWpSDw2LSA10LRA1KFbLRA1NFbLSA1NFbZ\"/><path class=\"eq\" d=\"~MURpwyx2LFS40LES4KrLES4NrLFS4NrZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-abduction-n-g1-thigh.l\"/><use href=\"#hip-abduction-n-g1-kneecap.l\"/><use href=\"#hip-abduction-n-g1-shank.l\"/><use href=\"#hip-abduction-n-g1-foot.l\"/><use href=\"#hip-abduction-n-g1-thigh.r\"/><use href=\"#hip-abduction-n-g1-kneecap.r\"/><use href=\"#hip-abduction-n-g1-shank.r\"/><use href=\"#hip-abduction-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-abduction-n-g1-thigh.l\"/><use href=\"#hip-abduction-n-g1-kneecap.l\"/><use href=\"#hip-abduction-n-g1-shank.l\"/><use href=\"#hip-abduction-n-g1-foot.l\"/><use href=\"#hip-abduction-n-g1-thigh.r\"/><use href=\"#hip-abduction-n-g1-kneecap.r\"/><use href=\"#hip-abduction-n-g1-shank.r\"/><use href=\"#hip-abduction-n-g1-foot.r\"/></g></g><path class=\"eq\" d=\"~Mw-H1A(U1L!W10L.W1.W5L.W1!W5L!W1!W5Z\"/><path class=\"eq\" d=\"~MUKpA(U1L!W10L.W1.W5L.W1!W5L!W1!W5Z\"/><path class=\"eq\" d=\"~M!OJ1WyS1Ltx7L-1eLT1uLE1H1LvU1Lf_1L2!1Le_1LuU1LH1H1LU1uL_1eL!12L_1fLU1tLH1I1LuR1Le-1L2.1Lf-1LvR1LE1I1LT1tL-1fZ\"/><path class=\"eq\" d=\"~MPArWyS1Ltx7L-1eLT1uLG1H1LtU1Ld_1L1!1Lg_1Lw1U1LF1H1LU1uL_1eL!12L_1fLU1tLF1I1Lw1R1Lg-1L1.1Ld-1LtR1LG1I1LT1tL-1fZ\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MWFK1SFw2LSA10LRA1XFbLRA1YFbLSA1YFbZ\"/><path class=\"eq\" d=\"~M_JH1wAx2LFS40LES4KrLES4NrLFS4NrZ\"/><path class=\"eq\" d=\"~MFPnSFw2LSA10LRA1XFbLRA1YFbLSA1YFbZ\"/><path class=\"eq\" d=\"~MN(mwAx2LFS40LES4KrLES4NrLFS4NrZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-abduction-n-e-head\"/><use href=\"#hip-abduction-n-e-torso\"/><use href=\"#hip-abduction-n-e-shcap.l\"/><use href=\"#hip-abduction-n-e-upper.l\"/><use href=\"#hip-abduction-n-e-elbowcap.l\"/><use href=\"#hip-abduction-n-e-fore.l\"/><use href=\"#hip-abduction-n-e-fist.l\"/><use href=\"#hip-abduction-n-e-shcap.r\"/><use href=\"#hip-abduction-n-e-upper.r\"/><use href=\"#hip-abduction-n-e-elbowcap.r\"/><use href=\"#hip-abduction-n-e-fore.r\"/><use href=\"#hip-abduction-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hip-abduction-n-e-head\"/><use href=\"#hip-abduction-n-e-torso\"/><use href=\"#hip-abduction-n-e-shcap.l\"/><use href=\"#hip-abduction-n-e-upper.l\"/><use href=\"#hip-abduction-n-e-elbowcap.l\"/><use href=\"#hip-abduction-n-e-fore.l\"/><use href=\"#hip-abduction-n-e-fist.l\"/><use href=\"#hip-abduction-n-e-shcap.r\"/><use href=\"#hip-abduction-n-e-upper.r\"/><use href=\"#hip-abduction-n-e-elbowcap.r\"/><use href=\"#hip-abduction-n-e-fore.r\"/><use href=\"#hip-abduction-n-e-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-abduction-n-e-thigh.l\"/><use href=\"#hip-abduction-n-e-kneecap.l\"/><use href=\"#hip-abduction-n-e-shank.l\"/><use href=\"#hip-abduction-n-e-foot.l\"/><use href=\"#hip-abduction-n-e-thigh.r\"/><use href=\"#hip-abduction-n-e-kneecap.r\"/><use href=\"#hip-abduction-n-e-shank.r\"/><use href=\"#hip-abduction-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-abduction-n-e-thigh.l\"/><use href=\"#hip-abduction-n-e-kneecap.l\"/><use href=\"#hip-abduction-n-e-shank.l\"/><use href=\"#hip-abduction-n-e-foot.l\"/><use href=\"#hip-abduction-n-e-thigh.r\"/><use href=\"#hip-abduction-n-e-kneecap.r\"/><use href=\"#hip-abduction-n-e-shank.r\"/><use href=\"#hip-abduction-n-e-foot.r\"/></g></g><path class=\"eq\" d=\"~MS)J1_)U1L!W10L.W1.W5L.W1!W5L!W1!W5Z\"/><path class=\"eq\" d=\"~MyEn_)U1L!W10L.W1.W5L.W1!W5L!W1!W5Z\"/><path class=\"eq\" d=\"~MNWN1JAS1Ltz7L-1iLT1sLG1H1LtU1Ld_1L1!1Lg_1LuU1LJ1H1LS1sL_1iL!10L_1hLS1rLJ1G1LuT1Lg-1L1.1Ld-1LtT1LG1G1LT1rL-1hZ\"/><path class=\"eq\" d=\"~M(*oJAS1Ltz7L-1iLR1sLI1H1LtU1Lf_1L2!1Le_1LuU1LH1H1LU1sL_1iL!10L_1hLU1rLH1G1LuT1Le-1L2.1Lf-1LtT1LI1G1LR1rL-1hZ\"/><circle class=\"joint\" cx=\"212.15\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"246.63\" cy=\"223.39\" r=\"2.25\"/><circle class=\"joint\" cx=\"111.37\" cy=\"223.39\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#N20YWw1UxS1T.w1TxS12010201020122100122102211201220000000122102020122100201221201221220001022021000000100000001000000010020000000010000020002000001010100000020010001001100100000200020002002200000121010000001010010120000010010100000001110110000001010110\"/><path class=\"arrow\" d=\"~MU_pYAS1LwB1VjLxA1A-1Z\"/></g><path class=\"leader\" d=\"~MYSI1JAS1LwS8!1\"/><circle class=\"anchor\" cx=\"223.16\" cy=\"256.7\" r=\"1.5\"/><path class=\"leader\" d=\"~MYHqJAS1LIz9A8\"/><circle class=\"anchor\" cx=\"134.84\" cy=\"256.7\" r=\"1.5\"/><path class=\"leader\" d=\"M179 189.58L231 172H241\"/><circle class=\"anchor\" cx=\"179\" cy=\"189.58\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"hip-abduction-n-pivot\" data-key=\"pivot\" data-cue=\"Set the seat so your knees line up with the machine's pivot.\" class=\"plate-callout two\" style=\"left:73.18%;top:65.64%\" aria-pressed=\"true\">Knees at<br>pivot</button><button type=\"button\" id=\"hip-abduction-n-range\" data-key=\"range\" data-cue=\"Move from knees together to comfortably wide.\" class=\"plate-callout two\" style=\"left:11.17%;top:65.92%\" aria-pressed=\"false\">Full<br>range</button><button type=\"button\" id=\"hip-abduction-n-still\" data-key=\"still\" data-cue=\"Keep your back flat on the pad, with no rocking.\" class=\"plate-callout two\" style=\"left:65.92%;top:41.9%\" aria-pressed=\"false\">Upper body<br>still</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"hip-abduction-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"hip-abduction-m-st-thigh.l\" d=\"^0\"/><path id=\"hip-abduction-m-st-kneecap.l\" d=\"^1\"/><path id=\"hip-abduction-m-st-shank.l\" d=\"^2\"/><path id=\"hip-abduction-m-st-foot.l\" d=\"^3\"/><path id=\"hip-abduction-m-st-thigh.r\" d=\"^4\"/><path id=\"hip-abduction-m-st-kneecap.r\" d=\"^5\"/><path id=\"hip-abduction-m-st-shank.r\" d=\"^6\"/><path id=\"hip-abduction-m-st-foot.r\" d=\"^7\"/><path id=\"hip-abduction-m-g0-thigh.l\" d=\"^8\"/><path id=\"hip-abduction-m-g0-kneecap.l\" d=\"^9\"/><path id=\"hip-abduction-m-g0-shank.l\" d=\"^10\"/><path id=\"hip-abduction-m-g0-foot.l\" d=\"^11\"/><path id=\"hip-abduction-m-g0-thigh.r\" d=\"^12\"/><path id=\"hip-abduction-m-g0-kneecap.r\" d=\"^13\"/><path id=\"hip-abduction-m-g0-shank.r\" d=\"^14\"/><path id=\"hip-abduction-m-g0-foot.r\" d=\"^15\"/><path id=\"hip-abduction-m-g1-thigh.l\" d=\"^16\"/><path id=\"hip-abduction-m-g1-kneecap.l\" d=\"^17\"/><path id=\"hip-abduction-m-g1-shank.l\" d=\"^18\"/><path id=\"hip-abduction-m-g1-foot.l\" d=\"^19\"/><path id=\"hip-abduction-m-g1-thigh.r\" d=\"^20\"/><path id=\"hip-abduction-m-g1-kneecap.r\" d=\"^21\"/><path id=\"hip-abduction-m-g1-shank.r\" d=\"^22\"/><path id=\"hip-abduction-m-g1-foot.r\" d=\"^23\"/><path id=\"hip-abduction-m-e-head\" d=\"^24\"/><path id=\"hip-abduction-m-e-torso\" d=\"^25\"/><path id=\"hip-abduction-m-e-shcap.l\" d=\"^26\"/><path id=\"hip-abduction-m-e-upper.l\" d=\"^27\"/><path id=\"hip-abduction-m-e-elbowcap.l\" d=\"^28\"/><path id=\"hip-abduction-m-e-fore.l\" d=\"^29\"/><path id=\"hip-abduction-m-e-fist.l\" d=\"^30\"/><path id=\"hip-abduction-m-e-shcap.r\" d=\"^31\"/><path id=\"hip-abduction-m-e-upper.r\" d=\"^32\"/><path id=\"hip-abduction-m-e-elbowcap.r\" d=\"^33\"/><path id=\"hip-abduction-m-e-fore.r\" d=\"^34\"/><path id=\"hip-abduction-m-e-fist.r\" d=\"^35\"/><path id=\"hip-abduction-m-e-thigh.l\" d=\"^36\"/><path id=\"hip-abduction-m-e-kneecap.l\" d=\"^37\"/><path id=\"hip-abduction-m-e-shank.l\" d=\"^38\"/><path id=\"hip-abduction-m-e-foot.l\" d=\"^39\"/><path id=\"hip-abduction-m-e-thigh.r\" d=\"^40\"/><path id=\"hip-abduction-m-e-kneecap.r\" d=\"^41\"/><path id=\"hip-abduction-m-e-shank.r\" d=\"^42\"/><path id=\"hip-abduction-m-e-foot.r\" d=\"^43\"/><path id=\"hip-abduction-m-m-thigh.l\" d=\"~#F12UAD1Y)U1R*B1XBV1O1H2cD1(9R6z3G5K1I2wgO7OpE5KjY5OiJiPhO22_2cy6!b6bE1R2z1GE1FJ1JK1J9Ny1Eawx1Tw100000021010000100002000001000000002002020001010100220000000000220000000000200000\"/><path id=\"hip-abduction-m-m-kneecap.l\" d=\"~~wDD1(xS1_J10\"/><path id=\"hip-abduction-m-m-shank.l\" d=\"~#F12NAD1(xS1BFD1XSP1Y1-bH10!4!(1(5.7_2.3-3.y2H7Td0)bE7TdW3.y2X2.3*5.7.4!(1E10-1-b.cUbBdYo0UlFdYo10001020010120000002000010010000000021001000020000000101000000001000220000020000\"/><path id=\"hip-abduction-m-m-foot.l\" d=\"~#e2_BE1SK*1ITB1xK*1*tSX1TcIuVK1VjO9K6yG1Rv_i-n0000010010010100000020001000\"/><path id=\"hip-abduction-m-m-thigh.r\" d=\"~#F12UAx1PJP1.Kx1GIP1S2z1cE1.b6by61_2OhO2PiJiNjY5PpE5)fO7N1I2A3G5*9R6bD1P1H2D-1Rf)w1Tw1Ky1EaIK1J912101000000012000101010002021000000000010000020020000001110000000000100000000000\"/><path id=\"hip-abduction-m-m-kneecap.r\" d=\"~~!*s(xS1_J10\"/><path id=\"hip-abduction-m-m-shank.r\" d=\"~#F12F!s(xS1))sXSP1_1-bF10!4!(1(5.7Y2.3V3.y2F7Td0)bG7Td_3.y2-2.3*5.7.4!(1G10X1-b-cUbEdYo0UlDdYo00000000010100000002002000110000000001200010120000100101102000200000020000120020\"/><path id=\"hip-abduction-m-m-foot.r\" d=\"~#e2WXuSK*1zHw1xK*1(tSX1UcIuWK1VjP9K6xG1Rv-i-n0000010020010100000010002000\"/><path id=\"hip-abduction-m-m-eq0\" d=\"~MU)F1J*U1L!W10L.W1.W5L.W1!W5L!W1!W5Z\"/><path id=\"hip-abduction-m-m-eq1\" d=\"~M!VB1Axx2LNX40LKX4KrLKX4NrLNX4NrZ\"/><path id=\"hip-abduction-m-m-eq2\" d=\"~MwErJ*U1L!W10L.W1.W5L.W1!W5L!W1!W5Z\"/><path id=\"hip-abduction-m-m-eq3\" d=\"~MDPrAxx2LNX40LKX4KrLKX4NrLNX4NrZ\"/><path id=\"hip-abduction-m-mf-head\" d=\"^24\"/><path id=\"hip-abduction-m-mf-torso\" d=\"^25\"/><path id=\"hip-abduction-m-mf-shcap.l\" d=\"^26\"/><path id=\"hip-abduction-m-mf-upper.l\" d=\"^27\"/><path id=\"hip-abduction-m-mf-elbowcap.l\" d=\"^28\"/><path id=\"hip-abduction-m-mf-fore.l\" d=\"^29\"/><path id=\"hip-abduction-m-mf-fist.l\" d=\"^30\"/><path id=\"hip-abduction-m-mf-shcap.r\" d=\"^31\"/><path id=\"hip-abduction-m-mf-upper.r\" d=\"^32\"/><path id=\"hip-abduction-m-mf-elbowcap.r\" d=\"^33\"/><path id=\"hip-abduction-m-mf-fore.r\" d=\"^34\"/><path id=\"hip-abduction-m-mf-fist.r\" d=\"^35\"/><path id=\"hip-abduction-m-mo-0\" d=\"^24\"/><path id=\"hip-abduction-m-mo-1\" d=\"^25\"/><path id=\"hip-abduction-m-mo-2\" d=\"^36\"/><path id=\"hip-abduction-m-mo-3\" d=\"^37\"/><path id=\"hip-abduction-m-mo-4\" d=\"^38\"/><path id=\"hip-abduction-m-mo-5\" d=\"^39\"/><path id=\"hip-abduction-m-mo-6\" d=\"^26\"/><path id=\"hip-abduction-m-mo-7\" d=\"^27\"/><path id=\"hip-abduction-m-mo-8\" d=\"^28\"/><path id=\"hip-abduction-m-mo-9\" d=\"^29\"/><path id=\"hip-abduction-m-mo-10\" d=\"^30\"/><path id=\"hip-abduction-m-mo-11\" d=\"^40\"/><path id=\"hip-abduction-m-mo-12\" d=\"^41\"/><path id=\"hip-abduction-m-mo-13\" d=\"^42\"/><path id=\"hip-abduction-m-mo-14\" d=\"^43\"/><path id=\"hip-abduction-m-mo-15\" d=\"^31\"/><path id=\"hip-abduction-m-mo-16\" d=\"^32\"/><path id=\"hip-abduction-m-mo-17\" d=\"^33\"/><path id=\"hip-abduction-m-mo-18\" d=\"^34\"/><path id=\"hip-abduction-m-mo-19\" d=\"^35\"/><path id=\"hip-abduction-m-mo-20\" d=\"^45\"/><path id=\"hip-abduction-m-mo-21\" d=\"^46\"/><path id=\"hip-abduction-m-mo-22\" d=\"^47\"/><path id=\"hip-abduction-m-mo-23\" d=\"^48\"/><path id=\"hip-abduction-m-mo-24\" d=\"^49\"/><path id=\"hip-abduction-m-mo-25\" d=\"^50\"/><path id=\"hip-abduction-m-mo-26\" d=\"^51\"/><path id=\"hip-abduction-m-mo-27\" d=\"^52\"/><path id=\"hip-abduction-m-mo-28\" d=\"^53\"/><path id=\"hip-abduction-m-mo-29\" d=\"^54\"/><path id=\"hip-abduction-m-mo-30\" d=\"^75\"/><path id=\"hip-abduction-m-mo-31\" d=\"^71\"/><path id=\"hip-abduction-m-mo-32\" d=\"^72\"/><path id=\"hip-abduction-m-mo-33\" d=\"^76\"/><path id=\"hip-abduction-m-mo-34\" d=\"^73\"/><path id=\"hip-abduction-m-mo-35\" d=\"^74\"/><path id=\"hip-abduction-m-mo-36\" d=\"^77\"/><path id=\"hip-abduction-m-mo-37\" d=\"^78\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#hip-abduction-m-dots)\"/>\n  <path class=\"floorline\" d=\"^44\"/><path class=\"eq\" d=\"^45\"/><path class=\"eq\" d=\"^46\"/><path class=\"eq\" d=\"^47\"/><path class=\"eq\" d=\"^48\"/><path class=\"eq\" d=\"^49\"/><path class=\"eq\" d=\"^50\"/><path class=\"eq\" d=\"^51\"/><path class=\"eq\" d=\"^52\"/><path class=\"eq\" d=\"^53\"/><path class=\"eq\" d=\"^54\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-abduction-m-st-thigh.l\"/><use href=\"#hip-abduction-m-st-kneecap.l\"/><use href=\"#hip-abduction-m-st-shank.l\"/><use href=\"#hip-abduction-m-st-foot.l\"/><use href=\"#hip-abduction-m-st-thigh.r\"/><use href=\"#hip-abduction-m-st-kneecap.r\"/><use href=\"#hip-abduction-m-st-shank.r\"/><use href=\"#hip-abduction-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-abduction-m-st-thigh.l\"/><use href=\"#hip-abduction-m-st-kneecap.l\"/><use href=\"#hip-abduction-m-st-shank.l\"/><use href=\"#hip-abduction-m-st-foot.l\"/><use href=\"#hip-abduction-m-st-thigh.r\"/><use href=\"#hip-abduction-m-st-kneecap.r\"/><use href=\"#hip-abduction-m-st-shank.r\"/><use href=\"#hip-abduction-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq\" d=\"^55\"/><path class=\"eq\" d=\"^56\"/><path class=\"eq\" d=\"^57\"/><path class=\"eq\" d=\"^58\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-abduction-m-g0-thigh.l\"/><use href=\"#hip-abduction-m-g0-kneecap.l\"/><use href=\"#hip-abduction-m-g0-shank.l\"/><use href=\"#hip-abduction-m-g0-foot.l\"/><use href=\"#hip-abduction-m-g0-thigh.r\"/><use href=\"#hip-abduction-m-g0-kneecap.r\"/><use href=\"#hip-abduction-m-g0-shank.r\"/><use href=\"#hip-abduction-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-abduction-m-g0-thigh.l\"/><use href=\"#hip-abduction-m-g0-kneecap.l\"/><use href=\"#hip-abduction-m-g0-shank.l\"/><use href=\"#hip-abduction-m-g0-foot.l\"/><use href=\"#hip-abduction-m-g0-thigh.r\"/><use href=\"#hip-abduction-m-g0-kneecap.r\"/><use href=\"#hip-abduction-m-g0-shank.r\"/><use href=\"#hip-abduction-m-g0-foot.r\"/></g></g><path class=\"eq\" d=\"^59\"/><path class=\"eq\" d=\"^60\"/><path class=\"eq\" d=\"^61\"/><path class=\"eq\" d=\"^62\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq\" d=\"^63\"/><path class=\"eq\" d=\"^64\"/><path class=\"eq\" d=\"^65\"/><path class=\"eq\" d=\"^66\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-abduction-m-g1-thigh.l\"/><use href=\"#hip-abduction-m-g1-kneecap.l\"/><use href=\"#hip-abduction-m-g1-shank.l\"/><use href=\"#hip-abduction-m-g1-foot.l\"/><use href=\"#hip-abduction-m-g1-thigh.r\"/><use href=\"#hip-abduction-m-g1-kneecap.r\"/><use href=\"#hip-abduction-m-g1-shank.r\"/><use href=\"#hip-abduction-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-abduction-m-g1-thigh.l\"/><use href=\"#hip-abduction-m-g1-kneecap.l\"/><use href=\"#hip-abduction-m-g1-shank.l\"/><use href=\"#hip-abduction-m-g1-foot.l\"/><use href=\"#hip-abduction-m-g1-thigh.r\"/><use href=\"#hip-abduction-m-g1-kneecap.r\"/><use href=\"#hip-abduction-m-g1-shank.r\"/><use href=\"#hip-abduction-m-g1-foot.r\"/></g></g><path class=\"eq\" d=\"^67\"/><path class=\"eq\" d=\"^68\"/><path class=\"eq\" d=\"^69\"/><path class=\"eq\" d=\"^70\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"^71\"/><path class=\"eq\" d=\"^72\"/><path class=\"eq\" d=\"^73\"/><path class=\"eq\" d=\"^74\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-abduction-m-e-head\"/><use href=\"#hip-abduction-m-e-torso\"/><use href=\"#hip-abduction-m-e-shcap.l\"/><use href=\"#hip-abduction-m-e-upper.l\"/><use href=\"#hip-abduction-m-e-elbowcap.l\"/><use href=\"#hip-abduction-m-e-fore.l\"/><use href=\"#hip-abduction-m-e-fist.l\"/><use href=\"#hip-abduction-m-e-shcap.r\"/><use href=\"#hip-abduction-m-e-upper.r\"/><use href=\"#hip-abduction-m-e-elbowcap.r\"/><use href=\"#hip-abduction-m-e-fore.r\"/><use href=\"#hip-abduction-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hip-abduction-m-e-head\"/><use href=\"#hip-abduction-m-e-torso\"/><use href=\"#hip-abduction-m-e-shcap.l\"/><use href=\"#hip-abduction-m-e-upper.l\"/><use href=\"#hip-abduction-m-e-elbowcap.l\"/><use href=\"#hip-abduction-m-e-fore.l\"/><use href=\"#hip-abduction-m-e-fist.l\"/><use href=\"#hip-abduction-m-e-shcap.r\"/><use href=\"#hip-abduction-m-e-upper.r\"/><use href=\"#hip-abduction-m-e-elbowcap.r\"/><use href=\"#hip-abduction-m-e-fore.r\"/><use href=\"#hip-abduction-m-e-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-abduction-m-e-thigh.l\"/><use href=\"#hip-abduction-m-e-kneecap.l\"/><use href=\"#hip-abduction-m-e-shank.l\"/><use href=\"#hip-abduction-m-e-foot.l\"/><use href=\"#hip-abduction-m-e-thigh.r\"/><use href=\"#hip-abduction-m-e-kneecap.r\"/><use href=\"#hip-abduction-m-e-shank.r\"/><use href=\"#hip-abduction-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-abduction-m-e-thigh.l\"/><use href=\"#hip-abduction-m-e-kneecap.l\"/><use href=\"#hip-abduction-m-e-shank.l\"/><use href=\"#hip-abduction-m-e-foot.l\"/><use href=\"#hip-abduction-m-e-thigh.r\"/><use href=\"#hip-abduction-m-e-kneecap.r\"/><use href=\"#hip-abduction-m-e-shank.r\"/><use href=\"#hip-abduction-m-e-foot.r\"/></g></g><path class=\"eq\" d=\"^75\"/><path class=\"eq\" d=\"^76\"/><path class=\"eq\" d=\"^77\"/><path class=\"eq\" d=\"^78\"/><circle class=\"joint\" cx=\"212.15\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"246.63\" cy=\"223.39\" r=\"2.25\"/><circle class=\"joint\" cx=\"111.37\" cy=\"223.39\" r=\"2.25\"/></g><mask id=\"hip-abduction-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#hip-abduction-m-mf-head\" fill=\"#000\"/><use href=\"#hip-abduction-m-mf-torso\" fill=\"#000\"/><use href=\"#hip-abduction-m-m-thigh.l\" fill=\"#000\"/><use href=\"#hip-abduction-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#hip-abduction-m-m-shank.l\" fill=\"#000\"/><use href=\"#hip-abduction-m-m-foot.l\" fill=\"#000\"/><use href=\"#hip-abduction-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#hip-abduction-m-mf-upper.l\" fill=\"#000\"/><use href=\"#hip-abduction-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#hip-abduction-m-mf-fore.l\" fill=\"#000\"/><use href=\"#hip-abduction-m-mf-fist.l\" fill=\"#000\"/><use href=\"#hip-abduction-m-m-thigh.r\" fill=\"#000\"/><use href=\"#hip-abduction-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#hip-abduction-m-m-shank.r\" fill=\"#000\"/><use href=\"#hip-abduction-m-m-foot.r\" fill=\"#000\"/><use href=\"#hip-abduction-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#hip-abduction-m-mf-upper.r\" fill=\"#000\"/><use href=\"#hip-abduction-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#hip-abduction-m-mf-fore.r\" fill=\"#000\"/><use href=\"#hip-abduction-m-mf-fist.r\" fill=\"#000\"/><use href=\"#hip-abduction-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-36\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-abduction-m-mo-37\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#hip-abduction-m-mmask)\"><g class=\"u-stroke\"><use href=\"#hip-abduction-m-m-thigh.l\"/><use href=\"#hip-abduction-m-m-kneecap.l\"/><use href=\"#hip-abduction-m-m-shank.l\"/><use href=\"#hip-abduction-m-m-foot.l\"/><use href=\"#hip-abduction-m-m-thigh.r\"/><use href=\"#hip-abduction-m-m-kneecap.r\"/><use href=\"#hip-abduction-m-m-shank.r\"/><use href=\"#hip-abduction-m-m-foot.r\"/><use href=\"#hip-abduction-m-m-eq0\"/><use href=\"#hip-abduction-m-m-eq1\"/><use href=\"#hip-abduction-m-m-eq2\"/><use href=\"#hip-abduction-m-m-eq3\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MAHx1D-U1LK)28M(o-iL*o_iLwS13\"/><path class=\"m-arrow\" d=\"~MJTA1D-U1LN)28MxpWiLypViL)R13\"/><path class=\"leader m\" d=\"~MWHu(xS1LGzdSa\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"hip-abduction-m-short\" data-key=\"short\" data-cue=\"Your knees open only a little before the legs come back.\" class=\"plate-callout two m\" style=\"left:11.17%;top:65.92%\" aria-pressed=\"true\">Short<br>range</button>",
    ]);
    return {
      view: "front",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "pivot",
        cues: [{ key: "pivot", cue: "Set the seat so your knees line up with the machine's pivot." }, { key: "range", cue: "Move from knees together to comfortably wide." }, { key: "still", cue: "Keep your back flat on the pad, with no rocking." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "short",
        cues: [{ key: "short", cue: "Your knees open only a little before the legs come back." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Short range</b><span>Your knees open only a little before the legs come back.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: push out 2 seconds, hold 1 second, return 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Push out</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div></div>",
      alt: "Hip abduction machine, front view. Seated with the back on the pad, hands on the side handles and the pads against the outer thighs, the lifter pushes the knees apart from together to comfortably wide, then brings them back slowly.",
      mistakeAlt: "Hip Abduction: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "balance",
    "why": "D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c2.",
    "handle": "machine-grip",
    "loadAxis": "across",
    "width": {
      "text": "Set by the machine.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd",
          "sl-hip-abd"
        ],
        "note": "c2"
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
    "gripLine": "Hold the side handles for stability and brace your trunk.",
    "cue": "Knees in line with the pivot."
  },
  contacts: [
    "seat-back",
    "pivot-pad"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set the seat so your knees line up with the machine's pivot.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Back on the pad, feet on footrests, pads snug on outer thighs.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "load",
      "text": "Pick a weight you can move without losing form.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd"
        ],
        "note": "c6"
      }
    },
    {
      "kind": "grip",
      "text": "Hold the handles and brace your trunk.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd",
          "sl-hip-abd"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "position",
      "text": "Push your legs out, hold briefly, then return slowly.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd",
          "sl-hip-abd"
        ],
        "note": "c3"
      }
    }
  ],
  posture: [
    {
      "key": "pivot",
      "label": "Knees at pivot",
      "detail": "Seat set so the knees line up with the machine's pivot.",
      "anchor": {
        "pose": "end",
        "at": "knee.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd"
        ],
        "note": "c1"
      }
    },
    {
      "key": "back",
      "label": "Back on pad",
      "detail": "Back flat against the pad.",
      "anchor": {
        "pose": "end",
        "at": "sternum"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd"
        ],
        "note": "c5"
      }
    },
    {
      "key": "still",
      "label": "Upper body still",
      "detail": "Upper body still, no momentum.",
      "anchor": {
        "pose": "start",
        "at": "sternum"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd"
        ],
        "note": "c5"
      }
    },
    {
      "key": "range",
      "label": "Full range",
      "detail": "Open from knees together to comfortably wide.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "abd-range",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd"
        ],
        "note": "c4"
      }
    },
    {
      "key": "return",
      "label": "Slow return",
      "detail": "Return slowly, resisting the weight.",
      "anchor": {
        "pose": "start",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd",
          "sl-hip-abd"
        ],
        "note": "c3"
      }
    }
  ],
  zooms: [
    {
      "key": "abd-range",
      "chip": "Range",
      "heading": "Full range",
      "kind": "posture"
    }
  ],
  chips: [
    "abd-range",
    "feel"
  ],
  copy: {
    "setupLine": "Set the seat so your knees line up with the machine's pivot. Pads snug on your outer thighs.",
    "mistakeLine": "Open the legs to a full, comfortable range. Keep your upper body still.",
    "cueLine": "Knees together to comfortably wide."
  },
  mistakes: [
    {
      "key": "jerk",
      "title": "Jerking the weight",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd"
        ],
        "note": "c12, c5, c6"
      },
      "fix": "Keep your upper body still. Lower the weight."
    },
    {
      "key": "heavy",
      "title": "Weight too heavy for form",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd"
        ],
        "note": "c6"
      },
      "fix": "Lower the weight."
    },
    {
      "key": "range",
      "title": "Incomplete range",
      "zoom": "abd-range",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd"
        ],
        "note": "c12, c4"
      },
      "fix": "Open the legs to a full, comfortable range."
    }
  ],
  risks: [
    {
      "key": "fit",
      "text": "A machine that doesn't fit you can strain the hip.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd"
        ],
        "note": "c6"
      }
    },
    {
      "key": "heavy",
      "text": "Too much weight spoils form.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-abd"
        ],
        "note": "c6"
      }
    }
  ],
  riskFlags: [],
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
    "mo-hip-abd",
    "sl-hip-abd",
    "paz-2022",
    "balance-default"
  ],
  research: {
    "card": "docs/research/howto/cards/hip_abduction.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

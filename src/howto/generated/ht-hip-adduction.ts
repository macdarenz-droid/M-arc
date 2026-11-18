// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=fa03b0e3f421b65b630ec69822d471a3720712945606dd7a22fc866f668a82a4
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_hip_adduction",
  name: "Hip Adduction",
  hashes: { inputsSha256: "fa03b0e3f421b65b630ec69822d471a3720712945606dd7a22fc866f668a82a4", golden: "45a4df6c001ac674e829f79a321f2534afa6ea6e11b1523579306991aecd2d13" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"hip-adduction-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"hip-adduction-n-st-thigh.l\" d=\"~#F12WVB1UyV1O(A1OFV1X5H24H1yvI6K4R5E2R2IaR1)nEazk_1XlJe)9N3V1(2I3F6Wvm3G1x6E1Ew1Hy1WH1yi_z1B3WD1Rp00100000200000000200000000002021010001110000000001000001010200020001010000111100\"/><path id=\"hip-adduction-n-st-kneecap.l\" d=\"~~(BH1JAS1_J10\"/><path id=\"hip-adduction-n-st-shank.l\" d=\"~#F12JAH1JAS1BFH1BVP1!1-bF10!4!(1(5.7Y2.3V3.y2F7Td0)bE7TdW3.y2X2.3*5.7.4!(1E10.1-bXcUbEdYo0UlFdYo10200000010100000002202000110000000021001010020000000101000010200000020000020000\"/><path id=\"hip-adduction-n-st-foot.l\" d=\"~#e2Y)I1wP*1ITH1TN*1IqyX1xbVuBF1GkG8V6wA1.uUgOn0001000000000210101000010020\"/><path id=\"hip-adduction-n-st-thigh.r\" d=\"~#F12WVw1UGP1RKx1)EP1y6E14G1VvmJ3F6W1(2waN3YlJeAk_1woEaJaR1F2R2N4R5xvI63H1Y5H2!B1.rVD1Rp-z1B3VH1yi02000201010000010000000021010001111000000000001210101010000020000001010000111100\"/><path id=\"hip-adduction-n-st-kneecap.r\" d=\"~~(*oJAS1_J10\"/><path id=\"hip-adduction-n-st-shank.r\" d=\"~#F12J!oJAS1BwpBVP1!1-bF10!4!(1(5.7Y2.3V3.y2F7Td0)bE7TdW3.y2X2.3*5.7.4!(1E10.1-bXcUbEdYo0UlFdYo10200000010100000002202000110000000021001010020000000101000010200000020000020000\"/><path id=\"hip-adduction-n-st-foot.r\" d=\"~#e2Y*pwP*1zHrTN*1JqyX1ybVuDF1GkH8V6)z1.uTgOn0001001010000200002000010010\"/><path id=\"hip-adduction-n-g0-thigh.l\" d=\"~#F12SYB1HyV1GEB1GFV1B4J26D1DnK6X3R5X1O21R2KoI9)jU2BlDfiN2z1(2B2H6yoc3B1V4G1RA1FA1FI1PgWz1R4YB1)q00000000001010100020020000111000200020010100100001100000000101022000000000000000\"/><path id=\"hip-adduction-n-g0-kneecap.l\" d=\"~~!VF1AzS1_J10\"/><path id=\"hip-adduction-n-g0-shank.l\" d=\"~#F12FUF1AzS1)XF1*TP1_1-bF10!4!(1(5-7Y2)3V3-y2F7Td0)bG7Td_3-y2-2)3*5-7.4!(1G10X1-b-cWbEdUo0YlDdUo00000000000000000000012000100000000000200011100000100000102000000001000000100120\"/><path id=\"hip-adduction-n-g0-foot.l\" d=\"~#e2SBH1YN*1BWF1XK*1zsHX1-bRu)H1zk.8R6PD1Bv_hOn0000000020000101010010000001\"/><path id=\"hip-adduction-n-g0-thigh.r\" d=\"~#F12SYw1(GP1-Hx1KFP1W4G14B1xocD2H6A1(2hN2DlDfwkU2NoI92R2Y1O2Y3R5BnK65D1D4J2UJ1VpXB1)qVz1R4EI1Pg02010100000020010020000101100010000001000002100020000000000000000000001010000010\"/><path id=\"hip-adduction-n-g0-kneecap.r\" d=\"~~wNqAzS1_J10\"/><path id=\"hip-adduction-n-g0-shank.r\" d=\"~#F12NJqAzS1BPq*TP1Y1-bH10!4!(1(5-7_2)3-3-y2H7Td0)bE7TdW3-y2X2)3*5-7.4!(1E10-1-b.cWbBdUo0YlFdUo00001020000020000000010010000000000020001001000000000000000000001001200000000100\"/><path id=\"hip-adduction-n-g0-foot.r\" d=\"~#e2(XrYN*1GEtXK*1AsHX1_bRuwI1zk!8R6OD1Bv-hOn0000000010000101010020000001\"/><path id=\"hip-adduction-n-g1-thigh.l\" d=\"~#F12A(B1JxV1BTB1KEV1T2J2aD1_eO6z3R5R1K2SaX4*oK7.jw4)jWgSb8d!2nF6Fg87E1E3B1-E1wF1PJ1HdDz1E7Uz1Vt00100001200012010000000200200010000000001000000000002200002000021002200000010100\"/><path id=\"hip-adduction-n-g1-kneecap.l\" d=\"~~yzE1FyS1_J10\"/><path id=\"hip-adduction-n-g1-shank.l\" d=\"~#F12NxE1FyS1BBE1xTP1_1-bF10!4!(1(5-7Y2)3X3-y2J7Td1)bG7TdY3-y2V2)3x6-7-4!(1E10-1-b-cWbEdUo1YlHdUo00000000000000100010010000002000100000000001000000002000000000000001000000002100\"/><path id=\"hip-adduction-n-g1-foot.l\" d=\"~#e2PFF1!K*1*WD1EK*1ItSX1KcOu*J1-jG9K6FF1OvWiVn0000001012101000121001000010\"/><path id=\"hip-adduction-n-g1-thigh.r\" d=\"~#F12A(w1!HP1OHx1RGP1F3B18E1Eg8oF6e!2Rb8wkWg!jw4(oK7RaX4S1K2A3R5-eO69D1U2J2DU1zlTz1VtBz1E7OJ1Hd02001000001200000000000010000000200010000200000001021010010020101001010000100220\"/><path id=\"hip-adduction-n-g1-kneecap.r\" d=\"~~!wsFyS1_J10\"/><path id=\"hip-adduction-n-g1-shank.r\" d=\"~#F12F)rFyS1)ysxTP1_1-bF10_4!(1y6-7W2)3X3-y2H7Td2)bI7TdY3-y2X2)3*5-7.4!(1E10-1-b-cWbGdUo2YlFdUo00000000001000000010110000000020001000000001200020000000000000000011000000000100\"/><path id=\"hip-adduction-n-g1-foot.r\" d=\"~#e2wVt!K*1RDvEK*1JtSX1NcOu(J1-jH9K6EF1OvViVn0000000002000000222001101020\"/><path id=\"hip-adduction-n-e-head\" d=\"~#D12Y(y1DErzVx1-wrEjJeXcFbT9A3-4B3B3z3-4E3-4)7R1)7B3R9D3R9S1)7_4)7_4E3D3z3_4B3U9A3YcFbFjJe0000100200001010000000101100002100000000000011000001000000002020000002200000\"/><path id=\"hip-adduction-n-e-torso\" d=\"~#A22SIA1(Dw1)GA1B_u!c*iArsy8z9K6I3IeUg-J1(d-4-cU9YsT9_c_4R9DjK6U9N6-c1)nVc)E1xoID2zrJD2zrwF1xowoVc_c1T9N6BjK6-4R9U9_cT9Ys_4-c_J1(dJeUgN6I3x8z9zrs.c*iyY2YJ10220001000002002100000010101012000000000000000200000000200002100020200110000020000001000000000000000100101010100000012100000200010020000\"/><path id=\"hip-adduction-n-e-shcap.l\" d=\"~~(*E1HIB1wP10\"/><path id=\"hip-adduction-n-e-upper.l\" d=\"~#F12FKF1NND1xUE1VVB1z6G685yA1HuB2E6z1z3Xn)t.6zk)bEbTkI5RvTlz3tO6V1!w1_x17aX6X5zc(aJ9JrNgJfysJ710000202001100101221000020000000200002002020000000100110000100100001202000000001\"/><path id=\"hip-adduction-n-e-elbowcap.l\" d=\"~~FyO1DUI1Dz10\"/><path id=\"hip-adduction-n-e-fore.l\" d=\"~#F12JBO1FyI1GVO1*IH1J6*75w2RhSD1S7B6N2E1_fErFc-7N5-9aOe(eXr9X2J1T9TnAz1T1D1N3R9I8X5Xi(bK8yf9Dm00000100000000000100010000200000000100001000022002000000002000200000000000000110\"/><path id=\"hip-adduction-n-e-fist.l\" d=\"~~yRH1U*T1ww10\"/><path id=\"hip-adduction-n-e-shcap.r\" d=\"~~S)qHIB1wP10\"/><path id=\"hip-adduction-n-e-upper.r\" d=\"~#F12_NrDFA1GGsXPz1Y6X58a.w1_x1P6V1A3tSvTlUkI5wcEb!6zkYn)tA1z3D2E6xA1Hu75A6G6*9.cxsJ7KgJfI9Jr20000100200120000000101000020010000000100000110200002100020200200110100010100100\"/><path id=\"hip-adduction-n-e-elbowcap.r\" d=\"~~_UkDUI1Dz10\"/><path id=\"hip-adduction-n-e-fore.r\" d=\"~#F12(XkADJ1EKk.JI1K3R9U1D1UnAz1I1T9aX2*eXr9OeK5-9Ec-7-fErK2E1R7B6ShSD16w2I6*7E9A4aDmN8yfYi(b10001000000000021002002000000100000010000001001110000010100100002011100000000000\"/><path id=\"hip-adduction-n-e-fist.r\" d=\"~~NJpU*T1ww10\"/><path id=\"hip-adduction-n-e-thigh.l\" d=\"~#F12YND1(.U1)HD1-xV1hH2iy1U5I6I3)4T1I2HjRbxqT1IiN8-fYkNl)6mY2S1_5S83fz1x2x1Bz1PS1HN1_2Uw1.eysxB102020000000200000000012000000210011100002000001101000121002101101201010002000100\"/><path id=\"hip-adduction-n-e-kneecap.l\" d=\"~~NNB1YxS1_J10\"/><path id=\"hip-adduction-n-e-shank.l\" d=\"~#F12_JB1YxS1RPB1RSP1_1-bF10_4!(1y6-7W2)3X3-y2H7Td2)bI7TdY3-y2X2)3*5-7.4!(1E10-1-b-cUbGdYo2UlFdYo00000000011100000010110000000020001000000001200020000101000000000210020000020002\"/><path id=\"hip-adduction-n-e-foot.l\" d=\"~#e2YGD1NK*1.WA1zK*1BuYX1XcOuzN1IjO9K6JG1Xvwj.n0000001001120000202001000100\"/><path id=\"hip-adduction-n-e-thigh.r\" d=\"~#F12YNx1HPP1TVx1GOP1y2x1gz1R83R1_5lY2Kl)6_fYkJiN8yqT1GjRbU1I2J3)4T5I6hy1iH2D*1E6xsxB1Tw1.eGN1_200011100110100012100001000002101200200001001000000000210101012020011100200010102\"/><path id=\"hip-adduction-n-e-kneecap.r\" d=\"~~PVtYxS1_J10\"/><path id=\"hip-adduction-n-e-shank.r\" d=\"~#F12!TtYxS1TXtRSP1_1-bF10!4!(1(5-7Y2)3X3-y2J7Td1)bG7TdY3-y2V2)3x6-7-4!(1E10-1-b-cUbEdYo1UlHdYo00000000010100100010010000002000100000000001000000002101000000000200020000022002\"/><path id=\"hip-adduction-n-e-foot.r\" d=\"~#e2YTvNK*1TDx1zK*1DuYX1YcOuAN1IjP9K6IG1Xv)i.n1000002001220000101001000110\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#hip-adduction-n-dots)\"/>\n  <path class=\"floorline\" d=\"M88.3 339.5H269.7\"/><path class=\"eq\" d=\"~MDTuHIX1LAX80Qwp0z(7)oL)owbQ0)o)o)aLz(7wpQ)o0A(7wpLwp)aQ0wpwpwbZ\"/><path class=\"eq\" d=\"~MHzy1W_X1L0JH9Q0F6F6zA9LAA1E6QF60zA1E6LE6zA9Q0E6E6AA9LzA1F6QE60AA1F6Z\"/><path class=\"eq\" d=\"~M!.sYDy2LYBc0QF60O)bE6LE6V8Q0E6E6W8LO)bF6QE60P)bF6LF6W8Q0F6F6V8Z\"/><path class=\"eq\" d=\"~MJFvFTU1LYJ70QYi0)-6XiLXiXwjQ0XiXiYwjL)-6YiQXi0w_6YiLYiYwjQ0YiYiXwjZ\"/><path class=\"eq\" d=\"~M(Jy1HIx2LUz10QYi0.gXiLXi)-8Q0XiXiw_8L.gYiQXi0!gYiLYiw_8Q0YiYi)-8Z\"/><path class=\"eq\" d=\"~M_zoYDy2L!Vl0QYi0zzlXiLXiSaQ0XiXiRaLzzlYiQXi0AzlYiLYiRaQ0YiYiSaZ\"/><path class=\"eq\" d=\"~MyRI1y-W1L00QWd0WdXdLVdU4Q0XdVdT4LWdYdQXd0XdYdLYdT4Q0YdYdU4Z\"/><path class=\"eq\" d=\"~MHzI1NUV1LNr0LKrVK3LKrWK3LNrWK3Z\"/><path class=\"eq\" d=\"~MNJqy-W1L00QYd0YdXdLXdU4Q0XdXdT4LYdYdQVd0VdYdLWdT4Q0YdWdU4Z\"/><path class=\"eq\" d=\"~MY(pNUV1LNr0LKrVK3LKrWK3LNrWK3Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-adduction-n-st-thigh.l\"/><use href=\"#hip-adduction-n-st-kneecap.l\"/><use href=\"#hip-adduction-n-st-shank.l\"/><use href=\"#hip-adduction-n-st-foot.l\"/><use href=\"#hip-adduction-n-st-thigh.r\"/><use href=\"#hip-adduction-n-st-kneecap.r\"/><use href=\"#hip-adduction-n-st-shank.r\"/><use href=\"#hip-adduction-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-adduction-n-st-thigh.l\"/><use href=\"#hip-adduction-n-st-kneecap.l\"/><use href=\"#hip-adduction-n-st-shank.l\"/><use href=\"#hip-adduction-n-st-foot.l\"/><use href=\"#hip-adduction-n-st-thigh.r\"/><use href=\"#hip-adduction-n-st-kneecap.r\"/><use href=\"#hip-adduction-n-st-shank.r\"/><use href=\"#hip-adduction-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq\" d=\"~M__D1AEw2LSA10LRA1RFbLRA1SFbLSA1SFbZ\"/><path class=\"eq\" d=\"~M__D1Syx2LSI60LRI6KrLRI6NrLSI6NrZ\"/><path class=\"eq\" d=\"~MA(tAEw2LSA10LRA1RFbLRA1SFbLSA1SFbZ\"/><path class=\"eq\" d=\"~MAXoSyx2LSI60LRI6KrLRI6NrLSI6NrZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-adduction-n-g0-thigh.l\"/><use href=\"#hip-adduction-n-g0-kneecap.l\"/><use href=\"#hip-adduction-n-g0-shank.l\"/><use href=\"#hip-adduction-n-g0-foot.l\"/><use href=\"#hip-adduction-n-g0-thigh.r\"/><use href=\"#hip-adduction-n-g0-kneecap.r\"/><use href=\"#hip-adduction-n-g0-shank.r\"/><use href=\"#hip-adduction-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-adduction-n-g0-thigh.l\"/><use href=\"#hip-adduction-n-g0-kneecap.l\"/><use href=\"#hip-adduction-n-g0-shank.l\"/><use href=\"#hip-adduction-n-g0-foot.l\"/><use href=\"#hip-adduction-n-g0-thigh.r\"/><use href=\"#hip-adduction-n-g0-kneecap.r\"/><use href=\"#hip-adduction-n-g0-shank.r\"/><use href=\"#hip-adduction-n-g0-foot.r\"/></g></g><path class=\"eq\" d=\"~MWRD1S(U1L!W10L.W1.W5L.W1!W5L!W1!W5Z\"/><path class=\"eq\" d=\"~M(UtS(U1L!W10L.W1.W5L.W1!W5L!W1!W5Z\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq\" d=\"~MWzB1yDw2LSA10LRA1IFbLRA1JFbLSA1JFbZ\"/><path class=\"eq\" d=\"~MWzB1Pxx2LYD60LXD6KrLXD6NrLYD6NrZ\"/><path class=\"eq\" d=\"~MFVvyDw2LSA10LRA1IFbLRA1JFbLSA1JFbZ\"/><path class=\"eq\" d=\"~MyTqPxx2LYD60LXD6KrLXD6NrLYD6NrZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-adduction-n-g1-thigh.l\"/><use href=\"#hip-adduction-n-g1-kneecap.l\"/><use href=\"#hip-adduction-n-g1-shank.l\"/><use href=\"#hip-adduction-n-g1-foot.l\"/><use href=\"#hip-adduction-n-g1-thigh.r\"/><use href=\"#hip-adduction-n-g1-kneecap.r\"/><use href=\"#hip-adduction-n-g1-shank.r\"/><use href=\"#hip-adduction-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-adduction-n-g1-thigh.l\"/><use href=\"#hip-adduction-n-g1-kneecap.l\"/><use href=\"#hip-adduction-n-g1-shank.l\"/><use href=\"#hip-adduction-n-g1-foot.l\"/><use href=\"#hip-adduction-n-g1-thigh.r\"/><use href=\"#hip-adduction-n-g1-kneecap.r\"/><use href=\"#hip-adduction-n-g1-shank.r\"/><use href=\"#hip-adduction-n-g1-foot.r\"/></g></g><path class=\"eq\" d=\"~MS_A1W*U1L_W10L-W1.W5L-W1!W5L_W1!W5Z\"/><path class=\"eq\" d=\"~MAJvW*U1L_W10L-W1.W5L-W1!W5L_W1!W5Z\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MyRz1PBw2LSA10LRA1GFbLRA1HFbLSA1HFbZ\"/><path class=\"eq\" d=\"~MyRz1!wx2LF.50LE.5IrLE.5JrLF.5JrZ\"/><path class=\"eq\" d=\"~M!Ex1PBw2LSA10LRA1GFbLRA1HFbLSA1HFbZ\"/><path class=\"eq\" d=\"~MDRs!wx2LF.50LE.5IrLE.5JrLF.5JrZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-adduction-n-e-head\"/><use href=\"#hip-adduction-n-e-torso\"/><use href=\"#hip-adduction-n-e-shcap.l\"/><use href=\"#hip-adduction-n-e-upper.l\"/><use href=\"#hip-adduction-n-e-elbowcap.l\"/><use href=\"#hip-adduction-n-e-fore.l\"/><use href=\"#hip-adduction-n-e-fist.l\"/><use href=\"#hip-adduction-n-e-shcap.r\"/><use href=\"#hip-adduction-n-e-upper.r\"/><use href=\"#hip-adduction-n-e-elbowcap.r\"/><use href=\"#hip-adduction-n-e-fore.r\"/><use href=\"#hip-adduction-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hip-adduction-n-e-head\"/><use href=\"#hip-adduction-n-e-torso\"/><use href=\"#hip-adduction-n-e-shcap.l\"/><use href=\"#hip-adduction-n-e-upper.l\"/><use href=\"#hip-adduction-n-e-elbowcap.l\"/><use href=\"#hip-adduction-n-e-fore.l\"/><use href=\"#hip-adduction-n-e-fist.l\"/><use href=\"#hip-adduction-n-e-shcap.r\"/><use href=\"#hip-adduction-n-e-upper.r\"/><use href=\"#hip-adduction-n-e-elbowcap.r\"/><use href=\"#hip-adduction-n-e-fore.r\"/><use href=\"#hip-adduction-n-e-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-adduction-n-e-thigh.l\"/><use href=\"#hip-adduction-n-e-kneecap.l\"/><use href=\"#hip-adduction-n-e-shank.l\"/><use href=\"#hip-adduction-n-e-foot.l\"/><use href=\"#hip-adduction-n-e-thigh.r\"/><use href=\"#hip-adduction-n-e-kneecap.r\"/><use href=\"#hip-adduction-n-e-shank.r\"/><use href=\"#hip-adduction-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-adduction-n-e-thigh.l\"/><use href=\"#hip-adduction-n-e-kneecap.l\"/><use href=\"#hip-adduction-n-e-shank.l\"/><use href=\"#hip-adduction-n-e-foot.l\"/><use href=\"#hip-adduction-n-e-thigh.r\"/><use href=\"#hip-adduction-n-e-kneecap.r\"/><use href=\"#hip-adduction-n-e-shank.r\"/><use href=\"#hip-adduction-n-e-foot.r\"/></g></g><path class=\"eq\" d=\"~M!Ez1D*U1L!W10L.W1.W5L.W1!W5L!W1!W5Z\"/><path class=\"eq\" d=\"~MY(w1D*U1L!W10L.W1.W5L.W1!W5L!W1!W5Z\"/><circle class=\"joint\" cx=\"212.15\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"246.63\" cy=\"223.39\" r=\"2.25\"/><circle class=\"joint\" cx=\"111.37\" cy=\"223.39\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#!20WKqHAS1-HqKAS12200211220010220102000012210200000000020102201000020102201102201201201221120021122000102011100000001210100000000010100000200000000210001010100001210020002100210021002000200020002000001000100000020000002000001100000200021000010101001000010110000021010100200200020012000200022\"/><path class=\"arrow\" d=\"~MNAw1PxS1LIB1wjLAB1OY1Z\"/></g><path class=\"leader\" d=\"~MYHqJAS1L.D8A8\"/><circle class=\"anchor\" cx=\"134.84\" cy=\"256.7\" r=\"1.5\"/><path class=\"leader\" d=\"~MY(y1YxS1LPEfX1\"/><circle class=\"anchor\" cx=\"179\" cy=\"256.28\" r=\"1.5\"/><path class=\"leader\" d=\"M179 189.58L231 172H241\"/><circle class=\"anchor\" cx=\"179\" cy=\"189.58\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"hip-adduction-n-stretch\" data-key=\"stretch\" data-cue=\"Start only as wide as a light stretch in the inner thighs.\" class=\"plate-callout two\" style=\"left:8.38%;top:65.92%\" aria-pressed=\"true\">Light<br>stretch</button><button type=\"button\" id=\"hip-adduction-n-meet\" data-key=\"meet\" data-cue=\"Squeeze until the pads nearly touch.\" class=\"plate-callout two\" style=\"left:70.39%;top:65.36%\" aria-pressed=\"false\">Pads<br>meet</button><button type=\"button\" id=\"hip-adduction-n-back\" data-key=\"back\" data-cue=\"Keep your back flat against the pad, spine neutral.\" class=\"plate-callout two\" style=\"left:65.92%;top:41.9%\" aria-pressed=\"false\">Back<br>on pad</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"hip-adduction-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"hip-adduction-m-st-thigh.l\" d=\"^0\"/><path id=\"hip-adduction-m-st-kneecap.l\" d=\"^1\"/><path id=\"hip-adduction-m-st-shank.l\" d=\"^2\"/><path id=\"hip-adduction-m-st-foot.l\" d=\"^3\"/><path id=\"hip-adduction-m-st-thigh.r\" d=\"^4\"/><path id=\"hip-adduction-m-st-kneecap.r\" d=\"^5\"/><path id=\"hip-adduction-m-st-shank.r\" d=\"^6\"/><path id=\"hip-adduction-m-st-foot.r\" d=\"^7\"/><path id=\"hip-adduction-m-g0-thigh.l\" d=\"^8\"/><path id=\"hip-adduction-m-g0-kneecap.l\" d=\"^9\"/><path id=\"hip-adduction-m-g0-shank.l\" d=\"^10\"/><path id=\"hip-adduction-m-g0-foot.l\" d=\"^11\"/><path id=\"hip-adduction-m-g0-thigh.r\" d=\"^12\"/><path id=\"hip-adduction-m-g0-kneecap.r\" d=\"^13\"/><path id=\"hip-adduction-m-g0-shank.r\" d=\"^14\"/><path id=\"hip-adduction-m-g0-foot.r\" d=\"^15\"/><path id=\"hip-adduction-m-g1-thigh.l\" d=\"^16\"/><path id=\"hip-adduction-m-g1-kneecap.l\" d=\"^17\"/><path id=\"hip-adduction-m-g1-shank.l\" d=\"^18\"/><path id=\"hip-adduction-m-g1-foot.l\" d=\"^19\"/><path id=\"hip-adduction-m-g1-thigh.r\" d=\"^20\"/><path id=\"hip-adduction-m-g1-kneecap.r\" d=\"^21\"/><path id=\"hip-adduction-m-g1-shank.r\" d=\"^22\"/><path id=\"hip-adduction-m-g1-foot.r\" d=\"^23\"/><path id=\"hip-adduction-m-e-head\" d=\"^24\"/><path id=\"hip-adduction-m-e-torso\" d=\"^25\"/><path id=\"hip-adduction-m-e-shcap.l\" d=\"^26\"/><path id=\"hip-adduction-m-e-upper.l\" d=\"^27\"/><path id=\"hip-adduction-m-e-elbowcap.l\" d=\"^28\"/><path id=\"hip-adduction-m-e-fore.l\" d=\"^29\"/><path id=\"hip-adduction-m-e-fist.l\" d=\"^30\"/><path id=\"hip-adduction-m-e-shcap.r\" d=\"^31\"/><path id=\"hip-adduction-m-e-upper.r\" d=\"^32\"/><path id=\"hip-adduction-m-e-elbowcap.r\" d=\"^33\"/><path id=\"hip-adduction-m-e-fore.r\" d=\"^34\"/><path id=\"hip-adduction-m-e-fist.r\" d=\"^35\"/><path id=\"hip-adduction-m-e-thigh.l\" d=\"^36\"/><path id=\"hip-adduction-m-e-kneecap.l\" d=\"^37\"/><path id=\"hip-adduction-m-e-shank.l\" d=\"^38\"/><path id=\"hip-adduction-m-e-foot.l\" d=\"^39\"/><path id=\"hip-adduction-m-e-thigh.r\" d=\"^40\"/><path id=\"hip-adduction-m-e-kneecap.r\" d=\"^41\"/><path id=\"hip-adduction-m-e-shank.r\" d=\"^42\"/><path id=\"hip-adduction-m-e-foot.r\" d=\"^43\"/><path id=\"hip-adduction-m-m-thigh.l\" d=\"~#F12YSB1_yV1VRA1GFV1B8H20D1FJ1-5*5V5.2R2xsx1Tnzbzky1ImPd-rw4R2!2E5H6PJ1A11G1I8G1.nPw1(G1Wj!z1-1WE1xo02020000102001001000220000000000000010000000200000000010110000000001000200000020\"/><path id=\"hip-adduction-m-m-kneecap.l\" d=\"~~AXJ1UES1_J10\"/><path id=\"hip-adduction-m-m-shank.l\" d=\"~#F12SVJ1UES1I-J1KYP1!1-bF10!4!(1(5-7Y2)3V3-y2F7Td0)bE7TdW3-y2X2)3*5-7.4!(1E10.1-bXcUbEdYo0UlFdYo10200000000100000000212000100000000020001011000000000100000010200200020000020002\"/><path id=\"hip-adduction-m-m-foot.l\" d=\"~#e2UzO1ST*1K)K1TR*1OlYW1)8.u.w1-kX6X6NtOuSdBn0001000020000200210100000200\"/><path id=\"hip-adduction-m-m-thigh.r\" d=\"~#F12YSw1NGP1BUx1KEP1J8G12G1OJ1A1F5H6S2!2_rw4JmPdAky1Unzbysx1!2R2(5V5EJ1-50D1D8H2Ar-tVE1xo.z1-1*G1Wj00000001000000000010000000200000000000000012002000011020001012021000000002000100\"/><path id=\"hip-adduction-m-m-kneecap.r\" d=\"~~YJmUES1_J10\"/><path id=\"hip-adduction-m-m-shank.r\" d=\"~#F12DImUES1)NmKYP1!1-bF10!4!(1(5-7Y2)3V3-y2F7Td0)bE7TdW3-y2X2)3*5-7.4!(1E10.1-bXcUbEdYo0UlFdYo10200000000100000000212000100000000020001011000000000100000010200200020000020002\"/><path id=\"hip-adduction-m-m-foot.r\" d=\"~#e2!-mST*1x(nTR*1PlYW1w9.u!w1-kY6X6KtOuRdBn0001000010000200111110000200\"/><path id=\"hip-adduction-m-m-eq0\" d=\"~MDKH1yzV1L_W10L-W1.W5L-W1!W5L_W1!W5Z\"/><path id=\"hip-adduction-m-m-eq1\" d=\"~MHWH1JJw2LSA10LRA1GGbLRA1HGbLSA1HGbZ\"/><path id=\"hip-adduction-m-m-eq2\" d=\"~MHWH1_Ex2LSF70LRF7KrLRF7NrLSF7NrZ\"/><path id=\"hip-adduction-m-m-eq3\" d=\"~MP-pyzV1L_W10L-W1.W5L-W1!W5L_W1!W5Z\"/><path id=\"hip-adduction-m-m-eq4\" d=\"~MUyqJJw2LSA10LRA1GGbLRA1HGbLSA1HGbZ\"/><path id=\"hip-adduction-m-m-eq5\" d=\"~MU(j_Ex2LSF70LRF7KrLRF7NrLSF7NrZ\"/><path id=\"hip-adduction-m-mf-head\" d=\"^24\"/><path id=\"hip-adduction-m-mf-torso\" d=\"^25\"/><path id=\"hip-adduction-m-mf-shcap.l\" d=\"^26\"/><path id=\"hip-adduction-m-mf-upper.l\" d=\"^27\"/><path id=\"hip-adduction-m-mf-elbowcap.l\" d=\"^28\"/><path id=\"hip-adduction-m-mf-fore.l\" d=\"^29\"/><path id=\"hip-adduction-m-mf-fist.l\" d=\"^30\"/><path id=\"hip-adduction-m-mf-shcap.r\" d=\"^31\"/><path id=\"hip-adduction-m-mf-upper.r\" d=\"^32\"/><path id=\"hip-adduction-m-mf-elbowcap.r\" d=\"^33\"/><path id=\"hip-adduction-m-mf-fore.r\" d=\"^34\"/><path id=\"hip-adduction-m-mf-fist.r\" d=\"^35\"/><path id=\"hip-adduction-m-mo-0\" d=\"^24\"/><path id=\"hip-adduction-m-mo-1\" d=\"^25\"/><path id=\"hip-adduction-m-mo-2\" d=\"^36\"/><path id=\"hip-adduction-m-mo-3\" d=\"^37\"/><path id=\"hip-adduction-m-mo-4\" d=\"^38\"/><path id=\"hip-adduction-m-mo-5\" d=\"^39\"/><path id=\"hip-adduction-m-mo-6\" d=\"^26\"/><path id=\"hip-adduction-m-mo-7\" d=\"^27\"/><path id=\"hip-adduction-m-mo-8\" d=\"^28\"/><path id=\"hip-adduction-m-mo-9\" d=\"^29\"/><path id=\"hip-adduction-m-mo-10\" d=\"^30\"/><path id=\"hip-adduction-m-mo-11\" d=\"^40\"/><path id=\"hip-adduction-m-mo-12\" d=\"^41\"/><path id=\"hip-adduction-m-mo-13\" d=\"^42\"/><path id=\"hip-adduction-m-mo-14\" d=\"^43\"/><path id=\"hip-adduction-m-mo-15\" d=\"^31\"/><path id=\"hip-adduction-m-mo-16\" d=\"^32\"/><path id=\"hip-adduction-m-mo-17\" d=\"^33\"/><path id=\"hip-adduction-m-mo-18\" d=\"^34\"/><path id=\"hip-adduction-m-mo-19\" d=\"^35\"/><path id=\"hip-adduction-m-mo-20\" d=\"^45\"/><path id=\"hip-adduction-m-mo-21\" d=\"^46\"/><path id=\"hip-adduction-m-mo-22\" d=\"^47\"/><path id=\"hip-adduction-m-mo-23\" d=\"^48\"/><path id=\"hip-adduction-m-mo-24\" d=\"^49\"/><path id=\"hip-adduction-m-mo-25\" d=\"^50\"/><path id=\"hip-adduction-m-mo-26\" d=\"^51\"/><path id=\"hip-adduction-m-mo-27\" d=\"^52\"/><path id=\"hip-adduction-m-mo-28\" d=\"^53\"/><path id=\"hip-adduction-m-mo-29\" d=\"^54\"/><path id=\"hip-adduction-m-mo-30\" d=\"^71\"/><path id=\"hip-adduction-m-mo-31\" d=\"^67\"/><path id=\"hip-adduction-m-mo-32\" d=\"^68\"/><path id=\"hip-adduction-m-mo-33\" d=\"^72\"/><path id=\"hip-adduction-m-mo-34\" d=\"^69\"/><path id=\"hip-adduction-m-mo-35\" d=\"^70\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#hip-adduction-m-dots)\"/>\n  <path class=\"floorline\" d=\"^44\"/><path class=\"eq\" d=\"^45\"/><path class=\"eq\" d=\"^46\"/><path class=\"eq\" d=\"^47\"/><path class=\"eq\" d=\"^48\"/><path class=\"eq\" d=\"^49\"/><path class=\"eq\" d=\"^50\"/><path class=\"eq\" d=\"^51\"/><path class=\"eq\" d=\"^52\"/><path class=\"eq\" d=\"^53\"/><path class=\"eq\" d=\"^54\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-adduction-m-st-thigh.l\"/><use href=\"#hip-adduction-m-st-kneecap.l\"/><use href=\"#hip-adduction-m-st-shank.l\"/><use href=\"#hip-adduction-m-st-foot.l\"/><use href=\"#hip-adduction-m-st-thigh.r\"/><use href=\"#hip-adduction-m-st-kneecap.r\"/><use href=\"#hip-adduction-m-st-shank.r\"/><use href=\"#hip-adduction-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-adduction-m-st-thigh.l\"/><use href=\"#hip-adduction-m-st-kneecap.l\"/><use href=\"#hip-adduction-m-st-shank.l\"/><use href=\"#hip-adduction-m-st-foot.l\"/><use href=\"#hip-adduction-m-st-thigh.r\"/><use href=\"#hip-adduction-m-st-kneecap.r\"/><use href=\"#hip-adduction-m-st-shank.r\"/><use href=\"#hip-adduction-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq\" d=\"^55\"/><path class=\"eq\" d=\"^56\"/><path class=\"eq\" d=\"^57\"/><path class=\"eq\" d=\"^58\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-adduction-m-g0-thigh.l\"/><use href=\"#hip-adduction-m-g0-kneecap.l\"/><use href=\"#hip-adduction-m-g0-shank.l\"/><use href=\"#hip-adduction-m-g0-foot.l\"/><use href=\"#hip-adduction-m-g0-thigh.r\"/><use href=\"#hip-adduction-m-g0-kneecap.r\"/><use href=\"#hip-adduction-m-g0-shank.r\"/><use href=\"#hip-adduction-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-adduction-m-g0-thigh.l\"/><use href=\"#hip-adduction-m-g0-kneecap.l\"/><use href=\"#hip-adduction-m-g0-shank.l\"/><use href=\"#hip-adduction-m-g0-foot.l\"/><use href=\"#hip-adduction-m-g0-thigh.r\"/><use href=\"#hip-adduction-m-g0-kneecap.r\"/><use href=\"#hip-adduction-m-g0-shank.r\"/><use href=\"#hip-adduction-m-g0-foot.r\"/></g></g><path class=\"eq\" d=\"^59\"/><path class=\"eq\" d=\"^60\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq\" d=\"^61\"/><path class=\"eq\" d=\"^62\"/><path class=\"eq\" d=\"^63\"/><path class=\"eq\" d=\"^64\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-adduction-m-g1-thigh.l\"/><use href=\"#hip-adduction-m-g1-kneecap.l\"/><use href=\"#hip-adduction-m-g1-shank.l\"/><use href=\"#hip-adduction-m-g1-foot.l\"/><use href=\"#hip-adduction-m-g1-thigh.r\"/><use href=\"#hip-adduction-m-g1-kneecap.r\"/><use href=\"#hip-adduction-m-g1-shank.r\"/><use href=\"#hip-adduction-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-adduction-m-g1-thigh.l\"/><use href=\"#hip-adduction-m-g1-kneecap.l\"/><use href=\"#hip-adduction-m-g1-shank.l\"/><use href=\"#hip-adduction-m-g1-foot.l\"/><use href=\"#hip-adduction-m-g1-thigh.r\"/><use href=\"#hip-adduction-m-g1-kneecap.r\"/><use href=\"#hip-adduction-m-g1-shank.r\"/><use href=\"#hip-adduction-m-g1-foot.r\"/></g></g><path class=\"eq\" d=\"^65\"/><path class=\"eq\" d=\"^66\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"^67\"/><path class=\"eq\" d=\"^68\"/><path class=\"eq\" d=\"^69\"/><path class=\"eq\" d=\"^70\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-adduction-m-e-head\"/><use href=\"#hip-adduction-m-e-torso\"/><use href=\"#hip-adduction-m-e-shcap.l\"/><use href=\"#hip-adduction-m-e-upper.l\"/><use href=\"#hip-adduction-m-e-elbowcap.l\"/><use href=\"#hip-adduction-m-e-fore.l\"/><use href=\"#hip-adduction-m-e-fist.l\"/><use href=\"#hip-adduction-m-e-shcap.r\"/><use href=\"#hip-adduction-m-e-upper.r\"/><use href=\"#hip-adduction-m-e-elbowcap.r\"/><use href=\"#hip-adduction-m-e-fore.r\"/><use href=\"#hip-adduction-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hip-adduction-m-e-head\"/><use href=\"#hip-adduction-m-e-torso\"/><use href=\"#hip-adduction-m-e-shcap.l\"/><use href=\"#hip-adduction-m-e-upper.l\"/><use href=\"#hip-adduction-m-e-elbowcap.l\"/><use href=\"#hip-adduction-m-e-fore.l\"/><use href=\"#hip-adduction-m-e-fist.l\"/><use href=\"#hip-adduction-m-e-shcap.r\"/><use href=\"#hip-adduction-m-e-upper.r\"/><use href=\"#hip-adduction-m-e-elbowcap.r\"/><use href=\"#hip-adduction-m-e-fore.r\"/><use href=\"#hip-adduction-m-e-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hip-adduction-m-e-thigh.l\"/><use href=\"#hip-adduction-m-e-kneecap.l\"/><use href=\"#hip-adduction-m-e-shank.l\"/><use href=\"#hip-adduction-m-e-foot.l\"/><use href=\"#hip-adduction-m-e-thigh.r\"/><use href=\"#hip-adduction-m-e-kneecap.r\"/><use href=\"#hip-adduction-m-e-shank.r\"/><use href=\"#hip-adduction-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hip-adduction-m-e-thigh.l\"/><use href=\"#hip-adduction-m-e-kneecap.l\"/><use href=\"#hip-adduction-m-e-shank.l\"/><use href=\"#hip-adduction-m-e-foot.l\"/><use href=\"#hip-adduction-m-e-thigh.r\"/><use href=\"#hip-adduction-m-e-kneecap.r\"/><use href=\"#hip-adduction-m-e-shank.r\"/><use href=\"#hip-adduction-m-e-foot.r\"/></g></g><path class=\"eq\" d=\"^71\"/><path class=\"eq\" d=\"^72\"/><circle class=\"joint\" cx=\"212.15\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"246.63\" cy=\"223.39\" r=\"2.25\"/><circle class=\"joint\" cx=\"111.37\" cy=\"223.39\" r=\"2.25\"/></g><mask id=\"hip-adduction-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#hip-adduction-m-mf-head\" fill=\"#000\"/><use href=\"#hip-adduction-m-mf-torso\" fill=\"#000\"/><use href=\"#hip-adduction-m-m-thigh.l\" fill=\"#000\"/><use href=\"#hip-adduction-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#hip-adduction-m-m-shank.l\" fill=\"#000\"/><use href=\"#hip-adduction-m-m-foot.l\" fill=\"#000\"/><use href=\"#hip-adduction-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#hip-adduction-m-mf-upper.l\" fill=\"#000\"/><use href=\"#hip-adduction-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#hip-adduction-m-mf-fore.l\" fill=\"#000\"/><use href=\"#hip-adduction-m-mf-fist.l\" fill=\"#000\"/><use href=\"#hip-adduction-m-m-thigh.r\" fill=\"#000\"/><use href=\"#hip-adduction-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#hip-adduction-m-m-shank.r\" fill=\"#000\"/><use href=\"#hip-adduction-m-m-foot.r\" fill=\"#000\"/><use href=\"#hip-adduction-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#hip-adduction-m-mf-upper.r\" fill=\"#000\"/><use href=\"#hip-adduction-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#hip-adduction-m-mf-fore.r\" fill=\"#000\"/><use href=\"#hip-adduction-m-mf-fist.r\" fill=\"#000\"/><use href=\"#hip-adduction-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hip-adduction-m-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#hip-adduction-m-mmask)\"><g class=\"u-stroke\"><use href=\"#hip-adduction-m-m-thigh.l\"/><use href=\"#hip-adduction-m-m-kneecap.l\"/><use href=\"#hip-adduction-m-m-shank.l\"/><use href=\"#hip-adduction-m-m-foot.l\"/><use href=\"#hip-adduction-m-m-thigh.r\"/><use href=\"#hip-adduction-m-m-kneecap.r\"/><use href=\"#hip-adduction-m-m-shank.r\"/><use href=\"#hip-adduction-m-m-foot.r\"/><use href=\"#hip-adduction-m-m-eq0\"/><use href=\"#hip-adduction-m-m-eq1\"/><use href=\"#hip-adduction-m-m-eq2\"/><use href=\"#hip-adduction-m-m-eq3\"/><use href=\"#hip-adduction-m-m-eq4\"/><use href=\"#hip-adduction-m-m-eq5\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MYHq!.U1LBR2F3MFoXjLEoYjLwS1)1\"/><path class=\"m-arrow\" d=\"~MYSI1!.U1LDR2F3MXpYhLYpXhL)R1)1\"/><path class=\"leader m\" d=\"~MS-nUES1LzX4!4\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"hip-adduction-m-wide\" data-key=\"wide\" data-cue=\"The legs are spread into a deep, forced stretch at the start.\" class=\"plate-callout two m\" style=\"left:8.38%;top:65.92%\" aria-pressed=\"true\">Spread<br>too wide</button>",
    ]);
    return {
      view: "front",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "stretch",
        cues: [{ key: "stretch", cue: "Start only as wide as a light stretch in the inner thighs." }, { key: "meet", cue: "Squeeze until the pads nearly touch." }, { key: "back", cue: "Keep your back flat against the pad, spine neutral." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "wide",
        cues: [{ key: "wide", cue: "The legs are spread into a deep, forced stretch at the start." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Spread too wide</b><span>The legs are spread into a deep, forced stretch at the start.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: squeeze 2 seconds, hold 1 second, return 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Squeeze</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div></div>",
      alt: "Hip adduction machine, front view. Seated with the back on the pad, hands on the side handles and the pads against the inner thighs, the lifter squeezes the knees together from a light stretch until the pads nearly touch, then returns slowly.",
      mistakeAlt: "Hip Adduction: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "balance",
    "why": "D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c1.",
    "handle": "machine-grip",
    "loadAxis": "across",
    "width": {
      "text": "Set by the machine.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-add",
          "sl-hip-add"
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
    "gripLine": "Hold the side handles. Keep your back flat against the pad.",
    "cue": "Light stretch, then squeeze."
  },
  contacts: [
    "seat-back",
    "pivot-pad"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Back against the pad, feet on the footrests, hold the side handles.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-add",
          "sl-hip-add"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "adjust",
      "text": "Set the thigh pads on your inner thighs, just above the knees.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-add",
          "sl-hip-add"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "adjust",
      "text": "Set the start width to a light stretch, not a deep one.",
      "zoom": "add-start",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-add"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "load",
      "text": "Pick a moderate weight and check the selector pin is secure.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-add"
        ],
        "note": "c5"
      }
    },
    {
      "kind": "position",
      "text": "Squeeze, pause briefly, then return slowly, keeping tension.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-add"
        ],
        "note": "c3"
      }
    }
  ],
  posture: [
    {
      "key": "back",
      "label": "Back on pad",
      "detail": "Back flat against the pad, spine neutral.",
      "anchor": {
        "pose": "end",
        "at": "sternum"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-add"
        ],
        "note": "c4"
      }
    },
    {
      "key": "stretch",
      "label": "Light stretch",
      "detail": "Start with only a light stretch.",
      "anchor": {
        "pose": "start",
        "at": "knee.r"
      },
      "zoom": "add-start",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-add"
        ],
        "note": "c2"
      }
    },
    {
      "key": "meet",
      "label": "Pads meet",
      "detail": "Squeeze until the pads nearly touch.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-add"
        ],
        "note": "c3"
      }
    },
    {
      "key": "return",
      "label": "Slow return",
      "detail": "Return slowly, keeping tension.",
      "anchor": {
        "pose": "start",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-add"
        ],
        "note": "c3"
      }
    }
  ],
  zooms: [
    {
      "key": "add-start",
      "chip": "Start width",
      "heading": "Start width",
      "kind": "posture",
      "feelRow": "groin"
    }
  ],
  chips: [
    "add-start",
    "feel"
  ],
  copy: {
    "setupLine": "Thigh pads on your inner thighs, just above the knees. Start with only a light stretch.",
    "mistakeLine": "Squeeze and return slowly. Never swing the legs together.",
    "cueLine": "Light stretch, then squeeze."
  },
  mistakes: [
    {
      "key": "swing",
      "title": "Swinging the legs together",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-add"
        ],
        "note": "c4"
      },
      "fix": "Squeeze and return slowly."
    },
    {
      "key": "deep",
      "title": "Starting in a deep stretch",
      "zoom": "add-start",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-add"
        ],
        "note": "c2"
      },
      "fix": "Set a narrower start: a light stretch only."
    },
    {
      "key": "heavy",
      "title": "Weight too heavy for form",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-add"
        ],
        "note": "c5"
      },
      "fix": "Choose a moderate weight."
    }
  ],
  risks: [
    {
      "key": "stretch",
      "text": "Avoid an excessive stretch at the start.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-add"
        ],
        "note": "c2"
      }
    },
    {
      "key": "injury",
      "text": "Acute hip or groin injury? Don't use this machine.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-hip-add"
        ],
        "note": "c5"
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
    "mo-hip-add",
    "sl-hip-add",
    "brandt-2013",
    "balance-default"
  ],
  research: {
    "card": "docs/research/howto/cards/hip_adduction.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

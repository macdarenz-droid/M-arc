// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=a857680b7d479a08ab7bff26cdd34c716665ec30f51a7615cd9239c73f4ebccc
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_seated_cable_row",
  name: "Seated Cable Row",
  hashes: { inputsSha256: "a857680b7d479a08ab7bff26cdd34c716665ec30f51a7615cd9239c73f4ebccc", golden: "256b78949ce47e1628c8201e1571cead8d6481cc80958734b135500a41b6fb34" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"seated-cable-row-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"seated-cable-row-n-st-thigh.l\" d=\"~#F12yFn!HV1V-lRTV1Obw34H1w(1zaK8x5z4I2BV1A3zo.9xkA2TlYeRU1y8R3D3B7Y6W(1B31B1*bjK8Hw1(H1Nh_z1V3FD1Bq00000000020001000000201012002002001200110100000000110100001000010001002200100010\"/><path id=\"seated-cable-row-n-st-kneecap.l\" d=\"~~(Yx1DVR1_J10\"/><path id=\"seated-cable-row-n-st-shank.l\" d=\"~#F12UTy1!)S1TGx1*GS1BaG6iz1_.1Ak*4T8O2)3z)1XmV9xc)aV4KfN1z!1TtX4uR9P2yY1wtfF1Rb)2Y5JgSh_l(jP8(rR202000000001000101100000001101000000000000010000000000012000001000101010010101000\"/><path id=\"seated-cable-row-n-st-shcap.l\" d=\"~~HPo_XB1wP10\"/><path id=\"seated-cable-row-n-st-upper.l\" d=\"~#F12HJpNzE1)JoxUD1X7x449FI1Dh*3E5x2T2BvOk.c*g*e.6ElH1*z1xaE32T6gHG1Nl3aB8B3K8(dPhynNkJ9(s.100000001012000000011100200100001000101000001010000210120001210002000000200002020\"/><path id=\"seated-cable-row-n-st-elbowcap.l\" d=\"~~DBx1SPG1Dz10\"/><path id=\"seated-cable-row-n-st-fore.l\" d=\"~#F12U_x1YSH1Kyx1-BH1V8G5w20PF1Pcz7V6O1G2ztEcE9xbKaE4KeU1KtIbV2m-93(B1(iJ1N1.9z2V4y9Feyh(fJ6AmI200000000010021010101010001002000111010121000001011000100020002000011010100002001\"/><path id=\"seated-cable-row-n-st-fist.l\" d=\"~~WyH1DyK1ww10\"/><path id=\"seated-cable-row-n-st-head\" d=\"~#w12UFq_VrEXoBBrVlJgIk_6TaX4.3H4R3R8K6EcEeRoP6xc7V9)iV2Yn)7ynB3Akw6_gSiE4_i0010101000000101000020101000200000000000010100111101100000000200\"/><path id=\"seated-cable-row-n-st-torso\" d=\"~#_12(zoWBw1*Toz-uR8T7B3dy7YiU8W7NaUhH6s*2TozlxbGdw3PgR2PlK3JoXc!j*eA6.8V5*gxmTD1G7OsG6rO9I1NaUhy2J8TbV9.gW5E9WjN5F7DeG9A2J8.W2Ak01200202000200200212100000020000010000011000001000000020000000020002000020010010110000100000200111101200000020000000\"/><path id=\"seated-cable-row-n-st-thigh.r\" d=\"^0\"/><path id=\"seated-cable-row-n-st-kneecap.r\" d=\"^1\"/><path id=\"seated-cable-row-n-st-shank.r\" d=\"^2\"/><path id=\"seated-cable-row-n-st-shcap.r\" d=\"^3\"/><path id=\"seated-cable-row-n-st-upper.r\" d=\"^4\"/><path id=\"seated-cable-row-n-st-elbowcap.r\" d=\"^5\"/><path id=\"seated-cable-row-n-st-fore.r\" d=\"^6\"/><path id=\"seated-cable-row-n-st-fist.r\" d=\"^7\"/><path id=\"seated-cable-row-n-g0-shcap.r\" d=\"~~JJnHSB1wP10\"/><path id=\"seated-cable-row-n-g0-upper.r\" d=\"~#F12WUnHKD1KxnIOB1V4T7a3Us_B1nT6dG3Xg-y1B2BlG9Rd-i.9GqIs-2V1)5x3YoSF174K5x7)dA8(2_sWcSiWpNd00100002000000000200000000000000100001101001010200022020001010220010000100000020\"/><path id=\"seated-cable-row-n-g0-elbowcap.r\" d=\"~~!)sNEK1Dz10\"/><path id=\"seated-cable-row-n-g0-fore.r\" d=\"~#F12NAuDJN1BHtBHN1T9G1Y1rJF1)4.8B3B2O1TtkxdI6BbcOcJ7RtS1B2W1O8!3UF1(1_1oR9w2T1Fa(j_9FhlDjEb10002001000010020000020001101100012002000000000020000000001011000210002000210011\"/><path id=\"seated-cable-row-n-g0-fist.r\" d=\"~~HED1N!J1ww10\"/><path id=\"seated-cable-row-n-g1-shcap.r\" d=\"~~HFmUNB1wP10\"/><path id=\"seated-cable-row-n-g1-upper.r\" d=\"~#F12FHm(.B1GxmO-A1)1X881Pf!J1J1R6iG3x5BD1P4-kT4-f.eEfxg)y1E2K2V4-4!aAN174)2K8.fH3x6HsF6UlFkWk00010000002002200101000000000001010001020000000001200100001000000001000200001012\"/><path id=\"seated-cable-row-n-g1-elbowcap.r\" d=\"~~HEpwIN1Dz10\"/><path id=\"seated-cable-row-n-g1-fore.r\" d=\"~#F12yRqDOO1TWp*PO1-92U1x1PE1VaE9*1K2B1Ot!4-dO4)aw2Ibw9Gt_5.1!1)7A5YF1-3(1cE9N31HaDl!6(gx3Jh-d00020000000010100000000000101100200000020001002002000021001000101000001010000000\"/><path id=\"seated-cable-row-n-g1-fist.r\" d=\"~~!Iy1YWJ1ww10\"/><path id=\"seated-cable-row-n-g2-shcap.r\" d=\"~~FAlYJB1wP10\"/><path id=\"seated-cable-row-n-g2-upper.r\" d=\"~#F12FAlAIB1IDl)EA1o-8a2q!N1H3X5U1.2(6EB1WaIikOgO9)iK4VB1G1*2)2)5)3_N1715-8Bgz2OeypnNmYc(p20200000000001111021001010100020000002000000000000100001010010120000200101011100\"/><path id=\"seated-cable-row-n-g2-elbowcap.r\" d=\"~~AElPRN1Dz10\"/><path id=\"seated-cable-row-n-g2-fore.r\" d=\"~#F12FSmNVO1GXlGYO1)9gU1z1yF1KcR9K1R2z1IuD6*d)3*aN2xbN9BuA7.1w2)7J5SG1O5!1cE9Y3w1DaHly6!gV3!gKe10000020000100000200000021200100000002000210010100001010002100210100000000000000\"/><path id=\"seated-cable-row-n-g2-fist.r\" d=\"~~NPuyRJ1ww10\"/><path id=\"seated-cable-row-n-e-thigh.l\" d=\"~#F12wXm!AV1zFl*GV1Vby22H1U(1G5x8V5)3V2BV1vGnVbBkkVm(c)U1A4-3_2V7D6Y(1W10E1-bK1.aNvNG1_k(z1x1FF1xn00010120000000101010000000000000001010220000001010100000000000210000000000020000\"/><path id=\"seated-cable-row-n-e-kneecap.l\" d=\"~~YOx1!JS1_J10\"/><path id=\"seated-cable-row-n-e-shank.l\" d=\"~#F12FKy1WYT1*xx1RBT1OaR5cB1w*1DgI5B8-2*3Ow2RiIaKbIb*3EfJ2**1TpT4F1K9w3!-1PpdA1XbB2Y6(f(iWkSkD7UrI400000200000000002000000012000000000000002020000100002211100101011000000000000110\"/><path id=\"seated-cable-row-n-e-foot.l\" d=\"~#o2yBK1w(W1)JJ1OyW1J7*aO1Gj-dEw1WrEV2-uPD2VkHx1B8UmV9WF1.fA6j.uHg_t000001000000020000101111010200010101200022100000\"/><path id=\"seated-cable-row-n-e-shcap.l\" d=\"~~DwkWJB1wP10\"/><path id=\"seated-cable-row-n-e-upper.l\" d=\"~#F12Wzk__A1KRkB.z1W3-784*eSI1A5B4J2z2!iOvHgTdA6EfI2zlD8-z17B3pO6GjYG193_2B8Bez8GmSiG8!kF3_s10101000100000000100100100000000000000100020000000012001000000020000000220200011\"/><path id=\"seated-cable-row-n-e-elbowcap.l\" d=\"~~!xhHXK1Dz10\"/><path id=\"seated-cable-row-n-e-fore.l\" d=\"~#F12JHiY.N1XNhX!N1Ba7W1tUG1T9O9B2R2E1VvA4Td*4BbS1TbW8Rvw5z2!1O8!4UH1V2w2i-9y3qDa!kS7whK2(hBd00000012100001200010100021010111010220002010010200000022000101000000000000000001\"/><path id=\"seated-cable-row-n-e-fist.l\" d=\"~~wVqHIJ1ww10\"/><path id=\"seated-cable-row-n-e-head\" d=\"~#w12YUmAFrOxlO(qEjAjEjW9zbE3E3_4X4)7)7BbThKmY4XcO1T9Ej0JmBbNmK6YkF3Fj(fT1Fj0001101002012001012000001010001000200110000010010010000001000000\"/><path id=\"seated-cable-row-n-e-torso\" d=\"~#_12YAlAww1GNlXRuT9x4E3X2U9DgU9F8_cwgJ60K6)nGm)7.c_4wg-4!kK6Hm*fUhTh_4T9)7*fBrEz1BbBrK60R90YcwgF3w8.c)7*fJ9I6NjH6w5!c-9D3w8ET2ww100000010000100002000001000100000000010000000201012000000000220010000000000101000000000100000202101101120000010000000\"/><path id=\"seated-cable-row-n-e-thigh.r\" d=\"^25\"/><path id=\"seated-cable-row-n-e-kneecap.r\" d=\"^26\"/><path id=\"seated-cable-row-n-e-shank.r\" d=\"^27\"/><path id=\"seated-cable-row-n-e-foot.r\" d=\"^28\"/><path id=\"seated-cable-row-n-e-shcap.r\" d=\"^29\"/><path id=\"seated-cable-row-n-e-upper.r\" d=\"^30\"/><path id=\"seated-cable-row-n-e-elbowcap.r\" d=\"^31\"/><path id=\"seated-cable-row-n-e-fore.r\" d=\"^32\"/><path id=\"seated-cable-row-n-e-fist.r\" d=\"^33\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#seated-cable-row-n-dots)\"/>\n  <path class=\"datum\" d=\"~MYUmAYS1L0TWr\"/><path class=\"floorline\" d=\"M19.45 339.5H335.43\"/><path class=\"eq\" d=\"~MNG8DyX1LW.t0Qwp0Vyt)oL)oAkQ0)o)ozkLVytwpQ)o0WytwpLwpzkQ0wpwpAkZ\"/><path class=\"eq\" d=\"~M(Fa!OY1LW!p0QF60KWpE6LE6*qQ0E6E6(qLKWpF6QE60NWpF6LF6(qQ0F6F6*qZ\"/><path class=\"eq\" d=\"~MHEaH)X1L0YB9Q0F6F6O)8L(qE6QF60*qE6LE6O)8Q0E6E6P)8L*qF6QE60(qF6Z\"/><path class=\"eq\" d=\"~MWW9YDy2L(N20QF60VF2E6LE6V8Q0E6E6W8LVF2F6QE60WF2F6LF6W8Q0F6F6V8Z\"/><path class=\"eq\" d=\"~MS-y1H)X1L0YB9Q0F6F6O)8LwrE6QF60)qE6LE6O)8Q0E6E6P)8L)qF6QE60wrF6Z\"/><path class=\"eq\" d=\"~M(Fy1YDy2L(N20QF60VF2E6LE6V8Q0E6E6W8LVF2F6QE60WF2F6LF6W8Q0F6F6V8Z\"/><path class=\"eq\" d=\"~M!VP1HFY1LJX2zP7QF3-8*!2yA7LW1WaQ-8B3z8(6LKI2SH7QB3_8y*2xA7LX1VaQ_8F3A8*6Z\"/><path class=\"eq\" d=\"~MS*P1w*W1LH.4W)aQS2Y5xT4O!aLNaKbQY5O2Of2LO(4OXaQO2X5yT4P!aLIaJbQX5S2Jf2Z\"/><path class=\"eq\" d=\"~MSEU1YDy2L_B40QF60R)3E6LE6B3Q0E6E6D3LR)3F6QE60S)3F6LF6D3Q0F6F6B3Z\"/><path class=\"eq\" d=\"~MA(W1Pwy2L0OT.1Q0E6E6FK.1L*qF6QE60(qF6LF6FK.1Q0F6F6EK.1L(qE6QF60*qE6Z\"/><path class=\"eq\" d=\"~MHE)1Pwy2L0OT.1Q0E6E6FK.1L)qF6QE60wrF6LF6FK.1Q0F6F6EK.1LwrE6QF60)qE6Z\"/><path class=\"eq\" d=\"~MWWV1U*7LJH90QF60zA9E6LE6zA1Q0E6E6AA1LzA9F6QE60AA9F6LF6AA1Q0F6F6zA1Z\"/><path class=\"eq\" d=\"~M_)T1YDy2LyYc0QF60-RcE6LE6B3Q0E6E6D3L-RcF6QE60_RcF6LF6D3Q0F6F6B3Z\"/><path class=\"eq\" d=\"~MSKX1YDy2LU!50QF60IW5E6LE6zA1Q0E6E6AA1LIW5F6QE60JW5F6LF6AA1Q0F6F6zA1Z\"/><path class=\"eq-thin\" d=\"~MPOY1!Ow2L0ESi\"/><path class=\"eq-thin\" d=\"~MDF!1!Ow2L0ESi\"/><path class=\"eq\" d=\"~MHEX1YD!1LAG60LzG6AG4LzG6zG4Z\"/><path class=\"eq-thin\" d=\"M282.77 326.57H314.95M282.77 322.91H314.95M282.77 319.25H314.95M282.77 315.59H314.95M282.77 311.94H314.95\"/><path class=\"eq-solid\" d=\"~~S-W1NUV1AG12\"/><path class=\"eq-pin\" d=\"~~N!X1NUV1F60\"/><path class=\"eq\" d=\"~~!I-1y-8ww10\"/><path class=\"eq-pin\" d=\"~~UB_1y-8F60\"/><path class=\"arc measure\" d=\"M110.11 191.47L137.39 203.95A30 30 0 0 1 98.93 219.31Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-n-st-thigh.l\"/><use href=\"#seated-cable-row-n-st-kneecap.l\"/><use href=\"#seated-cable-row-n-st-shank.l\"/><use href=\"#seated-cable-row-n-st-shcap.l\"/><use href=\"#seated-cable-row-n-st-upper.l\"/><use href=\"#seated-cable-row-n-st-elbowcap.l\"/><use href=\"#seated-cable-row-n-st-fore.l\"/><use href=\"#seated-cable-row-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-n-st-thigh.l\"/><use href=\"#seated-cable-row-n-st-kneecap.l\"/><use href=\"#seated-cable-row-n-st-shank.l\"/><use href=\"#seated-cable-row-n-st-shcap.l\"/><use href=\"#seated-cable-row-n-st-upper.l\"/><use href=\"#seated-cable-row-n-st-elbowcap.l\"/><use href=\"#seated-cable-row-n-st-fore.l\"/><use href=\"#seated-cable-row-n-st-fist.l\"/></g></g><path class=\"eq-cable\" d=\"~MUHP1!PP1L!!6Py6\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-n-st-head\"/><use href=\"#seated-cable-row-n-st-torso\"/><use href=\"#seated-cable-row-n-st-thigh.r\"/><use href=\"#seated-cable-row-n-st-kneecap.r\"/><use href=\"#seated-cable-row-n-st-shank.r\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-n-st-head\"/><use href=\"#seated-cable-row-n-st-torso\"/><use href=\"#seated-cable-row-n-st-thigh.r\"/><use href=\"#seated-cable-row-n-st-kneecap.r\"/><use href=\"#seated-cable-row-n-st-shank.r\"/></g></g><path class=\"eq-solid\" d=\"~MADI1YTK1LyT4(w3QNa!6Xx4OA3L)gy3Q!6Ka.3-gLOO4TO2QKa.6Yx4PA3Lwhx3Q.6Na!3_gZ\"/><path class=\"eq-solid\" d=\"~MwVH1_XI1L0YU2Q0PcPcEF2LxaOcQPc0yaOcLOcEF2Q0OcOcFF2LyaPcQOc0xaPcZ\"/><path class=\"eq\" d=\"~~JYO1!PP1Hi1\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-n-st-shcap.r\"/><use href=\"#seated-cable-row-n-st-upper.r\"/><use href=\"#seated-cable-row-n-st-elbowcap.r\"/><use href=\"#seated-cable-row-n-st-fore.r\"/><use href=\"#seated-cable-row-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-n-st-shcap.r\"/><use href=\"#seated-cable-row-n-st-upper.r\"/><use href=\"#seated-cable-row-n-st-elbowcap.r\"/><use href=\"#seated-cable-row-n-st-fore.r\"/><use href=\"#seated-cable-row-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"~MPJE1SKK1LH!4DR2QAbY5KI4RW2LTg!4QY5zbR5IgLxX4Ew2QxbX5SI4NW2LPgX4QX5ybW5FgZ\"/><path class=\"eq-solid\" d=\"~MS-D1ASI1L0WU2Q0PcPcBF2LxaOcQPc0yaOcLOcBF2Q0OcOcDF2LyaPcQOc0xaPcZ\"/><path class=\"eq\" d=\"~~PEJ1A-O1Hi1\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-n-g0-shcap.r\"/><use href=\"#seated-cable-row-n-g0-upper.r\"/><use href=\"#seated-cable-row-n-g0-elbowcap.r\"/><use href=\"#seated-cable-row-n-g0-fore.r\"/><use href=\"#seated-cable-row-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-n-g0-shcap.r\"/><use href=\"#seated-cable-row-n-g0-upper.r\"/><use href=\"#seated-cable-row-n-g0-elbowcap.r\"/><use href=\"#seated-cable-row-n-g0-fore.r\"/><use href=\"#seated-cable-row-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"~MFSz1NEK1LYx5YB2QPb(4GR4GJ2LBgw6Q(4KbX6-fLG.4IV1QKb*4NR4HJ2LAgx6Q*4PbY6(fZ\"/><path class=\"eq-solid\" d=\"~MA(y1JJI1L0YU2Q0PcPcEF2LxaOcQPc0yaOcLOcEF2Q0OcOcFF2LyaPcQOc0xaPcZ\"/><path class=\"eq\" d=\"~~HSF1JDO1Hi1\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-n-g1-shcap.r\"/><use href=\"#seated-cable-row-n-g1-upper.r\"/><use href=\"#seated-cable-row-n-g1-elbowcap.r\"/><use href=\"#seated-cable-row-n-g1-fore.r\"/><use href=\"#seated-cable-row-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-n-g1-shcap.r\"/><use href=\"#seated-cable-row-n-g1-upper.r\"/><use href=\"#seated-cable-row-n-g1-elbowcap.r\"/><use href=\"#seated-cable-row-n-g1-fore.r\"/><use href=\"#seated-cable-row-n-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"~MWXvJxK1LDB5F*1QWbH4zV4TA2L.f_6QJ4XbR7OfLX*4BK1QXbG4yV4UA2L_f-6QG4YbU7PfZ\"/><path class=\"eq-solid\" d=\"~MWyvWDI1L0WU2Q0PcPcBF2LxaOcQPc0yaOcLOcBF2Q0OcOcDF2LyaPcQOc0xaPcZ\"/><path class=\"eq\" d=\"~~Y_A1(WN1Hi1\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-n-g2-shcap.r\"/><use href=\"#seated-cable-row-n-g2-upper.r\"/><use href=\"#seated-cable-row-n-g2-elbowcap.r\"/><use href=\"#seated-cable-row-n-g2-fore.r\"/><use href=\"#seated-cable-row-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-n-g2-shcap.r\"/><use href=\"#seated-cable-row-n-g2-upper.r\"/><use href=\"#seated-cable-row-n-g2-elbowcap.r\"/><use href=\"#seated-cable-row-n-g2-fore.r\"/><use href=\"#seated-cable-row-n-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MHEX1!SG1LAG60LzG6AG4LzG6zG4Z\"/><path class=\"eq-thin\" d=\"M282.77 231.23H314.95M282.77 227.57H314.95M282.77 223.91H314.95M282.77 220.26H314.95M282.77 216.6H314.95\"/><path class=\"eq-cable\" d=\"~M!I-1NUV1L0I.J1Mww1ww1L0_-v\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-n-e-thigh.l\"/><use href=\"#seated-cable-row-n-e-kneecap.l\"/><use href=\"#seated-cable-row-n-e-shank.l\"/><use href=\"#seated-cable-row-n-e-foot.l\"/><use href=\"#seated-cable-row-n-e-shcap.l\"/><use href=\"#seated-cable-row-n-e-upper.l\"/><use href=\"#seated-cable-row-n-e-elbowcap.l\"/><use href=\"#seated-cable-row-n-e-fore.l\"/><use href=\"#seated-cable-row-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-n-e-thigh.l\"/><use href=\"#seated-cable-row-n-e-kneecap.l\"/><use href=\"#seated-cable-row-n-e-shank.l\"/><use href=\"#seated-cable-row-n-e-foot.l\"/><use href=\"#seated-cable-row-n-e-shcap.l\"/><use href=\"#seated-cable-row-n-e-upper.l\"/><use href=\"#seated-cable-row-n-e-elbowcap.l\"/><use href=\"#seated-cable-row-n-e-fore.l\"/><use href=\"#seated-cable-row-n-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"~MDUx1YGN1LU)lyR8\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-n-e-head\"/><use href=\"#seated-cable-row-n-e-torso\"/><use href=\"#seated-cable-row-n-e-thigh.r\"/><use href=\"#seated-cable-row-n-e-kneecap.r\"/><use href=\"#seated-cable-row-n-e-shank.r\"/><use href=\"#seated-cable-row-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-n-e-head\"/><use href=\"#seated-cable-row-n-e-torso\"/><use href=\"#seated-cable-row-n-e-thigh.r\"/><use href=\"#seated-cable-row-n-e-kneecap.r\"/><use href=\"#seated-cable-row-n-e-shank.r\"/><use href=\"#seated-cable-row-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~M(!rJ.J1LNE5WW1Q!b!3VX4V(1LRfN7Q!3.bB8BfLK)4*D1Q.b*3UX4W(1LWfK7Q*3!bA8DfZ\"/><path class=\"eq-solid\" d=\"~MHEr(wI1L0YU2Q0PcPcEF2LzaOcQPc0AaOcLOcEF2Q0OcOcFF2LAaPcQOc0zaPcZ\"/><path class=\"eq\" d=\"~~(xx1YGN1Hi1\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-n-e-shcap.r\"/><use href=\"#seated-cable-row-n-e-upper.r\"/><use href=\"#seated-cable-row-n-e-elbowcap.r\"/><use href=\"#seated-cable-row-n-e-fore.r\"/><use href=\"#seated-cable-row-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-n-e-shcap.r\"/><use href=\"#seated-cable-row-n-e-upper.r\"/><use href=\"#seated-cable-row-n-e-elbowcap.r\"/><use href=\"#seated-cable-row-n-e-fore.r\"/><use href=\"#seated-cable-row-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"110.11\" cy=\"191.47\" r=\"2.25\"/><circle class=\"joint\" cx=\"92.98\" cy=\"234.13\" r=\"2.25\"/><circle class=\"joint\" cx=\"115.96\" cy=\"259.86\" r=\"2.25\"/><circle class=\"joint\" cx=\"178.65\" cy=\"258.06\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#y20W_F1!(J1*AG1I)J11022112012012211201221100221122110221102211022112012012211201221010100000001010002100001010020010101000000010110020000012100000101000000001101000001210100000001010002100001010020010101000000010100\"/><path class=\"arrow\" d=\"~M_xtJKJ1LHD1)gL)E1PW1Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M137.39 203.95A30 30 0 0 1 98.93 219.31\"/><g class=\"arc-ticks\"><path d=\"~MwAqHPE1LAT1Jn\"/><path d=\"~MUTjPzH1L)kDU1\"/></g><path class=\"leader\" d=\"~MJ_nNDI1L-V8_P1\"/></g></g><path class=\"leader\" d=\"M133.88 190.74L149 177H159\"/><circle class=\"anchor\" cx=\"133.88\" cy=\"190.74\" r=\"1.5\"/><path class=\"leader\" d=\"M92.98 234.13L77.5 198H67.5\"/><circle class=\"anchor\" cx=\"92.98\" cy=\"234.13\" r=\"1.5\"/><path class=\"leader\" d=\"M110.11 191.47L81.87 144H71.87\"/><circle class=\"anchor\" cx=\"110.11\" cy=\"191.47\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"seated-cable-row-n-tall\" data-key=\"tall\" data-cue=\"Sit tall; no rocking, the torso finishes upright.\" class=\"plate-callout\" style=\"left:43.02%;top:43.3%\" aria-pressed=\"true\">Chest tall</button><button type=\"button\" id=\"seated-cable-row-n-elbows\" data-key=\"elbows\" data-cue=\"Drive the elbows back past the ribs, close to the body.\" class=\"plate-callout two\" style=\"left:2.79%;top:49.16%\" aria-pressed=\"false\">Elbows<br>back</button><button type=\"button\" id=\"seated-cable-row-n-squeeze\" data-key=\"squeeze\" data-cue=\"Finish by squeezing the shoulder blades together, down, not up.\" class=\"plate-callout two\" style=\"left:2.79%;top:34.08%\" aria-pressed=\"false\">Squeeze<br>blades</button><span class=\"plate-arc-label\" style=\"left:2.79%;top:62.01%\"><b>Shoulder</b><span>about 90°</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"seated-cable-row-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"seated-cable-row-m-st-thigh.l\" d=\"^0\"/><path id=\"seated-cable-row-m-st-kneecap.l\" d=\"^1\"/><path id=\"seated-cable-row-m-st-shank.l\" d=\"^2\"/><path id=\"seated-cable-row-m-st-shcap.l\" d=\"^3\"/><path id=\"seated-cable-row-m-st-upper.l\" d=\"^4\"/><path id=\"seated-cable-row-m-st-elbowcap.l\" d=\"^5\"/><path id=\"seated-cable-row-m-st-fore.l\" d=\"^6\"/><path id=\"seated-cable-row-m-st-fist.l\" d=\"^7\"/><path id=\"seated-cable-row-m-st-head\" d=\"^8\"/><path id=\"seated-cable-row-m-st-torso\" d=\"^9\"/><path id=\"seated-cable-row-m-st-thigh.r\" d=\"^0\"/><path id=\"seated-cable-row-m-st-kneecap.r\" d=\"^1\"/><path id=\"seated-cable-row-m-st-shank.r\" d=\"^2\"/><path id=\"seated-cable-row-m-st-shcap.r\" d=\"^3\"/><path id=\"seated-cable-row-m-st-upper.r\" d=\"^4\"/><path id=\"seated-cable-row-m-st-elbowcap.r\" d=\"^5\"/><path id=\"seated-cable-row-m-st-fore.r\" d=\"^6\"/><path id=\"seated-cable-row-m-st-fist.r\" d=\"^7\"/><path id=\"seated-cable-row-m-g0-shcap.r\" d=\"^10\"/><path id=\"seated-cable-row-m-g0-upper.r\" d=\"^11\"/><path id=\"seated-cable-row-m-g0-elbowcap.r\" d=\"^12\"/><path id=\"seated-cable-row-m-g0-fore.r\" d=\"^13\"/><path id=\"seated-cable-row-m-g0-fist.r\" d=\"^14\"/><path id=\"seated-cable-row-m-g1-shcap.r\" d=\"^15\"/><path id=\"seated-cable-row-m-g1-upper.r\" d=\"^16\"/><path id=\"seated-cable-row-m-g1-elbowcap.r\" d=\"^17\"/><path id=\"seated-cable-row-m-g1-fore.r\" d=\"^18\"/><path id=\"seated-cable-row-m-g1-fist.r\" d=\"^19\"/><path id=\"seated-cable-row-m-g2-shcap.r\" d=\"^20\"/><path id=\"seated-cable-row-m-g2-upper.r\" d=\"^21\"/><path id=\"seated-cable-row-m-g2-elbowcap.r\" d=\"^22\"/><path id=\"seated-cable-row-m-g2-fore.r\" d=\"^23\"/><path id=\"seated-cable-row-m-g2-fist.r\" d=\"^24\"/><path id=\"seated-cable-row-m-e-thigh.l\" d=\"^25\"/><path id=\"seated-cable-row-m-e-kneecap.l\" d=\"^26\"/><path id=\"seated-cable-row-m-e-shank.l\" d=\"^27\"/><path id=\"seated-cable-row-m-e-foot.l\" d=\"^28\"/><path id=\"seated-cable-row-m-e-shcap.l\" d=\"^29\"/><path id=\"seated-cable-row-m-e-upper.l\" d=\"^30\"/><path id=\"seated-cable-row-m-e-elbowcap.l\" d=\"^31\"/><path id=\"seated-cable-row-m-e-fore.l\" d=\"^32\"/><path id=\"seated-cable-row-m-e-fist.l\" d=\"^33\"/><path id=\"seated-cable-row-m-e-head\" d=\"^34\"/><path id=\"seated-cable-row-m-e-torso\" d=\"^35\"/><path id=\"seated-cable-row-m-e-thigh.r\" d=\"^25\"/><path id=\"seated-cable-row-m-e-kneecap.r\" d=\"^26\"/><path id=\"seated-cable-row-m-e-shank.r\" d=\"^27\"/><path id=\"seated-cable-row-m-e-foot.r\" d=\"^28\"/><path id=\"seated-cable-row-m-e-shcap.r\" d=\"^29\"/><path id=\"seated-cable-row-m-e-upper.r\" d=\"^30\"/><path id=\"seated-cable-row-m-e-elbowcap.r\" d=\"^31\"/><path id=\"seated-cable-row-m-e-fore.r\" d=\"^32\"/><path id=\"seated-cable-row-m-e-fist.r\" d=\"^33\"/><path id=\"seated-cable-row-m-m-head\" d=\"~#w12N-hYJrIBgxNrXe!m-gHdTbnz2H5G6-6EaE9-lGiy2OdT3x9Xiw4SjRfUk)awlz1ymUbN2Aj0100200101002020000000000000012000001000020000002100021100110000\"/><path id=\"seated-cable-row-m-m-torso\" d=\"~#_12AHhJIw1.Gh).uzdKf7yePewm_8X4_fwd(6-1EdzmXqK3*bW6JfX6_j.8FkTiJfTjS3za.9.eGvTvIeTpB7z4Bh*1PhWm_4D7BeB5IfN4hJsy9WbW8Ik!4D7XH2SP100100020002200000010100000000020000000200010111100010000000002000000200110001001010020012101210000000000110101011010\"/><path id=\"seated-cable-row-m-m-thigh.l\" d=\"~#F12!zmJwV1VUkzwV1.bo3H1_(1Y1G7R6V3z3VU1*6*lEezkV1.nHaEV1*1x4N2I8H5D(1W86B1Tb.2IeDu!D1Dp_z1A3SH1Oi00010000000000000001000000101001212101100000021000000000200110100200010002010002\"/><path id=\"seated-cable-row-m-m-kneecap.l\" d=\"~~AAx1!UT1_J10\"/><path id=\"seated-cable-row-m-m-shank.l\" d=\"~#F12FDy1wyV1z-w1OTU1xbO48B1J(1U9E6R7B3R3xy2XbRbBaVb-2*ey4Gw2)iO4Y1)8y4D!1Aj9F1*bvP8DfwlSiAl(4wrE722000010001001002220010001000001010200000010000000000010100100200000000010100000\"/><path id=\"seated-cable-row-m-m-shcap.l\" d=\"~~JVhDTA1wP10\"/><path id=\"seated-cable-row-m-m-upper.l\" d=\"~#F12w_hS(z1VGiX)y1D4T764OhUH1F5.3S2*1_kIuAhTcw7-evGlJaEz11E3dO6.lPF171F3x8Td*8InDhT9HkN1!s00000010000000100000000000200002000101000000101000000120000001000000010001101100\"/><path id=\"seated-cable-row-m-m-elbowcap.l\" d=\"~~YDeAXJ1Dz10\"/><path id=\"seated-cable-row-m-m-fore.l\" d=\"~#F12DOfP.K1RTeK!K1Ea7Y1x1UG1O9R9B2O2G1XvA4Rd*4zbU1VbS8Rvw5)1(1T8_4WH1R2!1eV9A3oAa_kW7AhO2_hEd02000000210000111110000000000002001011000000001000000000010120000000000001010000\"/><path id=\"seated-cable-row-m-m-fist.l\" d=\"~~S-nHII1ww10\"/><path id=\"seated-cable-row-m-m-thigh.r\" d=\"^92\"/><path id=\"seated-cable-row-m-m-kneecap.r\" d=\"^93\"/><path id=\"seated-cable-row-m-m-shank.r\" d=\"^94\"/><path id=\"seated-cable-row-m-m-shcap.r\" d=\"^95\"/><path id=\"seated-cable-row-m-m-upper.r\" d=\"^96\"/><path id=\"seated-cable-row-m-m-elbowcap.r\" d=\"^97\"/><path id=\"seated-cable-row-m-m-fore.r\" d=\"^98\"/><path id=\"seated-cable-row-m-m-fist.r\" d=\"^99\"/><path id=\"seated-cable-row-m-m-eq0\" d=\"~MHEX1ySD1LAG60LzG6AG4LzG6zG4Z\"/><path id=\"seated-cable-row-m-m-eq1\" d=\"~MNxpJ.I1LHE5wX1Q!b(3OX4*(1LTfJ7Q!3.bB8EfLG)4BE1Q.b.3SX4w)1LSfK7Q*3!bA8DfZ\"/><path id=\"seated-cable-row-m-m-eq2\" d=\"~M!Io(wH1L0YU2Q0PcPcEF2LxaOcQPc0yaOcLOcEF2Q0OcOcFF2LyaPcQOc0xaPcZ\"/><path id=\"seated-cable-row-m-m-eq3\" d=\"~~JDuAHK1Hi1\"/><path id=\"seated-cable-row-m-mf-foot.l\" d=\"^28\"/><path id=\"seated-cable-row-m-mf-foot.r\" d=\"^28\"/><path id=\"seated-cable-row-m-mo-0\" d=\"^34\"/><path id=\"seated-cable-row-m-mo-1\" d=\"^35\"/><path id=\"seated-cable-row-m-mo-2\" d=\"^25\"/><path id=\"seated-cable-row-m-mo-3\" d=\"^26\"/><path id=\"seated-cable-row-m-mo-4\" d=\"^27\"/><path id=\"seated-cable-row-m-mo-5\" d=\"^28\"/><path id=\"seated-cable-row-m-mo-6\" d=\"^29\"/><path id=\"seated-cable-row-m-mo-7\" d=\"^30\"/><path id=\"seated-cable-row-m-mo-8\" d=\"^31\"/><path id=\"seated-cable-row-m-mo-9\" d=\"^32\"/><path id=\"seated-cable-row-m-mo-10\" d=\"^33\"/><path id=\"seated-cable-row-m-mo-11\" d=\"^25\"/><path id=\"seated-cable-row-m-mo-12\" d=\"^26\"/><path id=\"seated-cable-row-m-mo-13\" d=\"^27\"/><path id=\"seated-cable-row-m-mo-14\" d=\"^28\"/><path id=\"seated-cable-row-m-mo-15\" d=\"^29\"/><path id=\"seated-cable-row-m-mo-16\" d=\"^30\"/><path id=\"seated-cable-row-m-mo-17\" d=\"^31\"/><path id=\"seated-cable-row-m-mo-18\" d=\"^32\"/><path id=\"seated-cable-row-m-mo-19\" d=\"^33\"/><path id=\"seated-cable-row-m-mo-20\" d=\"^38\"/><path id=\"seated-cable-row-m-mo-21\" d=\"^39\"/><path id=\"seated-cable-row-m-mo-22\" d=\"^40\"/><path id=\"seated-cable-row-m-mo-23\" d=\"^41\"/><path id=\"seated-cable-row-m-mo-24\" d=\"^42\"/><path id=\"seated-cable-row-m-mo-25\" d=\"^43\"/><path id=\"seated-cable-row-m-mo-26\" d=\"^44\"/><path id=\"seated-cable-row-m-mo-27\" d=\"^45\"/><path id=\"seated-cable-row-m-mo-28\" d=\"^46\"/><path id=\"seated-cable-row-m-mo-29\" d=\"^47\"/><path id=\"seated-cable-row-m-mo-30\" d=\"^48\"/><path id=\"seated-cable-row-m-mo-31\" d=\"^49\"/><path id=\"seated-cable-row-m-mo-32\" d=\"^50\"/><path id=\"seated-cable-row-m-mo-33\" d=\"^51\"/><path id=\"seated-cable-row-m-mo-34\" d=\"^54\"/><path id=\"seated-cable-row-m-mo-35\" d=\"^74\"/><path id=\"seated-cable-row-m-mo-36\" d=\"^56\"/><path id=\"seated-cable-row-m-mo-37\" d=\"^57\"/><path id=\"seated-cable-row-m-mo-38\" d=\"^58\"/><path id=\"seated-cable-row-m-mo-39\" d=\"^59\"/><path id=\"seated-cable-row-m-mo-40\" d=\"^78\"/><path id=\"seated-cable-row-m-mo-41\" d=\"^79\"/><path id=\"seated-cable-row-m-mo-42\" d=\"^80\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#seated-cable-row-m-dots)\"/>\n  <path class=\"datum\" d=\"^36\"/><path class=\"floorline\" d=\"^37\"/><path class=\"eq\" d=\"^38\"/><path class=\"eq\" d=\"^39\"/><path class=\"eq\" d=\"^40\"/><path class=\"eq\" d=\"^41\"/><path class=\"eq\" d=\"^42\"/><path class=\"eq\" d=\"^43\"/><path class=\"eq\" d=\"^44\"/><path class=\"eq\" d=\"^45\"/><path class=\"eq\" d=\"^46\"/><path class=\"eq\" d=\"^47\"/><path class=\"eq\" d=\"^48\"/><path class=\"eq\" d=\"^49\"/><path class=\"eq\" d=\"^50\"/><path class=\"eq\" d=\"^51\"/><path class=\"eq-thin\" d=\"^52\"/><path class=\"eq-thin\" d=\"^53\"/><path class=\"eq\" d=\"^54\"/><path class=\"eq-thin\" d=\"^55\"/><path class=\"eq-solid\" d=\"^56\"/><path class=\"eq-pin\" d=\"^57\"/><path class=\"eq\" d=\"^58\"/><path class=\"eq-pin\" d=\"^59\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-m-st-thigh.l\"/><use href=\"#seated-cable-row-m-st-kneecap.l\"/><use href=\"#seated-cable-row-m-st-shank.l\"/><use href=\"#seated-cable-row-m-st-shcap.l\"/><use href=\"#seated-cable-row-m-st-upper.l\"/><use href=\"#seated-cable-row-m-st-elbowcap.l\"/><use href=\"#seated-cable-row-m-st-fore.l\"/><use href=\"#seated-cable-row-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-m-st-thigh.l\"/><use href=\"#seated-cable-row-m-st-kneecap.l\"/><use href=\"#seated-cable-row-m-st-shank.l\"/><use href=\"#seated-cable-row-m-st-shcap.l\"/><use href=\"#seated-cable-row-m-st-upper.l\"/><use href=\"#seated-cable-row-m-st-elbowcap.l\"/><use href=\"#seated-cable-row-m-st-fore.l\"/><use href=\"#seated-cable-row-m-st-fist.l\"/></g></g><path class=\"eq-cable\" d=\"^61\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-m-st-head\"/><use href=\"#seated-cable-row-m-st-torso\"/><use href=\"#seated-cable-row-m-st-thigh.r\"/><use href=\"#seated-cable-row-m-st-kneecap.r\"/><use href=\"#seated-cable-row-m-st-shank.r\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-m-st-head\"/><use href=\"#seated-cable-row-m-st-torso\"/><use href=\"#seated-cable-row-m-st-thigh.r\"/><use href=\"#seated-cable-row-m-st-kneecap.r\"/><use href=\"#seated-cable-row-m-st-shank.r\"/></g></g><path class=\"eq-solid\" d=\"^62\"/><path class=\"eq-solid\" d=\"^63\"/><path class=\"eq\" d=\"^64\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-m-st-shcap.r\"/><use href=\"#seated-cable-row-m-st-upper.r\"/><use href=\"#seated-cable-row-m-st-elbowcap.r\"/><use href=\"#seated-cable-row-m-st-fore.r\"/><use href=\"#seated-cable-row-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-m-st-shcap.r\"/><use href=\"#seated-cable-row-m-st-upper.r\"/><use href=\"#seated-cable-row-m-st-elbowcap.r\"/><use href=\"#seated-cable-row-m-st-fore.r\"/><use href=\"#seated-cable-row-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"^65\"/><path class=\"eq-solid\" d=\"^66\"/><path class=\"eq\" d=\"^67\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-m-g0-shcap.r\"/><use href=\"#seated-cable-row-m-g0-upper.r\"/><use href=\"#seated-cable-row-m-g0-elbowcap.r\"/><use href=\"#seated-cable-row-m-g0-fore.r\"/><use href=\"#seated-cable-row-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-m-g0-shcap.r\"/><use href=\"#seated-cable-row-m-g0-upper.r\"/><use href=\"#seated-cable-row-m-g0-elbowcap.r\"/><use href=\"#seated-cable-row-m-g0-fore.r\"/><use href=\"#seated-cable-row-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"^68\"/><path class=\"eq-solid\" d=\"^69\"/><path class=\"eq\" d=\"^70\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-m-g1-shcap.r\"/><use href=\"#seated-cable-row-m-g1-upper.r\"/><use href=\"#seated-cable-row-m-g1-elbowcap.r\"/><use href=\"#seated-cable-row-m-g1-fore.r\"/><use href=\"#seated-cable-row-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-m-g1-shcap.r\"/><use href=\"#seated-cable-row-m-g1-upper.r\"/><use href=\"#seated-cable-row-m-g1-elbowcap.r\"/><use href=\"#seated-cable-row-m-g1-fore.r\"/><use href=\"#seated-cable-row-m-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"^71\"/><path class=\"eq-solid\" d=\"^72\"/><path class=\"eq\" d=\"^73\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-m-g2-shcap.r\"/><use href=\"#seated-cable-row-m-g2-upper.r\"/><use href=\"#seated-cable-row-m-g2-elbowcap.r\"/><use href=\"#seated-cable-row-m-g2-fore.r\"/><use href=\"#seated-cable-row-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-m-g2-shcap.r\"/><use href=\"#seated-cable-row-m-g2-upper.r\"/><use href=\"#seated-cable-row-m-g2-elbowcap.r\"/><use href=\"#seated-cable-row-m-g2-fore.r\"/><use href=\"#seated-cable-row-m-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^74\"/><path class=\"eq-thin\" d=\"^75\"/><path class=\"eq-cable\" d=\"^76\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-m-e-thigh.l\"/><use href=\"#seated-cable-row-m-e-kneecap.l\"/><use href=\"#seated-cable-row-m-e-shank.l\"/><use href=\"#seated-cable-row-m-e-foot.l\"/><use href=\"#seated-cable-row-m-e-shcap.l\"/><use href=\"#seated-cable-row-m-e-upper.l\"/><use href=\"#seated-cable-row-m-e-elbowcap.l\"/><use href=\"#seated-cable-row-m-e-fore.l\"/><use href=\"#seated-cable-row-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-m-e-thigh.l\"/><use href=\"#seated-cable-row-m-e-kneecap.l\"/><use href=\"#seated-cable-row-m-e-shank.l\"/><use href=\"#seated-cable-row-m-e-foot.l\"/><use href=\"#seated-cable-row-m-e-shcap.l\"/><use href=\"#seated-cable-row-m-e-upper.l\"/><use href=\"#seated-cable-row-m-e-elbowcap.l\"/><use href=\"#seated-cable-row-m-e-fore.l\"/><use href=\"#seated-cable-row-m-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"^77\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-m-e-head\"/><use href=\"#seated-cable-row-m-e-torso\"/><use href=\"#seated-cable-row-m-e-thigh.r\"/><use href=\"#seated-cable-row-m-e-kneecap.r\"/><use href=\"#seated-cable-row-m-e-shank.r\"/><use href=\"#seated-cable-row-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-m-e-head\"/><use href=\"#seated-cable-row-m-e-torso\"/><use href=\"#seated-cable-row-m-e-thigh.r\"/><use href=\"#seated-cable-row-m-e-kneecap.r\"/><use href=\"#seated-cable-row-m-e-shank.r\"/><use href=\"#seated-cable-row-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^78\"/><path class=\"eq-solid\" d=\"^79\"/><path class=\"eq\" d=\"^80\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-m-e-shcap.r\"/><use href=\"#seated-cable-row-m-e-upper.r\"/><use href=\"#seated-cable-row-m-e-elbowcap.r\"/><use href=\"#seated-cable-row-m-e-fore.r\"/><use href=\"#seated-cable-row-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#seated-cable-row-m-e-shcap.r\"/><use href=\"#seated-cable-row-m-e-upper.r\"/><use href=\"#seated-cable-row-m-e-elbowcap.r\"/><use href=\"#seated-cable-row-m-e-fore.r\"/><use href=\"#seated-cable-row-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"110.11\" cy=\"191.47\" r=\"2.25\"/><circle class=\"joint\" cx=\"92.98\" cy=\"234.13\" r=\"2.25\"/><circle class=\"joint\" cx=\"115.96\" cy=\"259.86\" r=\"2.25\"/><circle class=\"joint\" cx=\"178.65\" cy=\"258.06\" r=\"2.25\"/></g><mask id=\"seated-cable-row-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#seated-cable-row-m-m-head\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-torso\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-thigh.l\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-shank.l\" fill=\"#000\"/><use href=\"#seated-cable-row-m-mf-foot.l\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-shcap.l\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-upper.l\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-fore.l\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-fist.l\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-thigh.r\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-shank.r\" fill=\"#000\"/><use href=\"#seated-cable-row-m-mf-foot.r\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-shcap.r\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-upper.r\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-fore.r\" fill=\"#000\"/><use href=\"#seated-cable-row-m-m-fist.r\" fill=\"#000\"/><use href=\"#seated-cable-row-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-36\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-37\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-38\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-39\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-40\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-41\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-cable-row-m-mo-42\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#seated-cable-row-m-mmask)\"><g class=\"u-stroke\"><use href=\"#seated-cable-row-m-m-head\"/><use href=\"#seated-cable-row-m-m-torso\"/><use href=\"#seated-cable-row-m-m-thigh.l\"/><use href=\"#seated-cable-row-m-m-kneecap.l\"/><use href=\"#seated-cable-row-m-m-shank.l\"/><use href=\"#seated-cable-row-m-m-shcap.l\"/><use href=\"#seated-cable-row-m-m-upper.l\"/><use href=\"#seated-cable-row-m-m-elbowcap.l\"/><use href=\"#seated-cable-row-m-m-fore.l\"/><use href=\"#seated-cable-row-m-m-fist.l\"/><use href=\"#seated-cable-row-m-m-thigh.r\"/><use href=\"#seated-cable-row-m-m-kneecap.r\"/><use href=\"#seated-cable-row-m-m-shank.r\"/><use href=\"#seated-cable-row-m-m-shcap.r\"/><use href=\"#seated-cable-row-m-m-upper.r\"/><use href=\"#seated-cable-row-m-m-elbowcap.r\"/><use href=\"#seated-cable-row-m-m-fore.r\"/><use href=\"#seated-cable-row-m-m-fist.r\"/><use href=\"#seated-cable-row-m-m-eq0\"/><use href=\"#seated-cable-row-m-m-eq1\"/><use href=\"#seated-cable-row-m-m-eq2\"/><use href=\"#seated-cable-row-m-m-eq3\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"M120.77 197.52A62 62 0 0 0 93.09 200.92M96.24 197.04L93.09 200.92L97.7 202.86\"/><path class=\"leader m\" d=\"M91.11 140.28L89.51 108H79.51\"/><path class=\"leader m\" d=\"M176.78 264.46L191 312H201\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"seated-cable-row-m-swing\" data-key=\"swing\" data-cue=\"The torso swings back past upright to heave the weight.\" class=\"plate-callout two m\" style=\"left:2.79%;top:24.02%\" aria-pressed=\"true\">Swinging<br>back</button><button type=\"button\" id=\"seated-cable-row-m-legs\" data-key=\"legs\" data-cue=\"The knees straighten to shove the body back.\" class=\"plate-callout two m\" style=\"left:54.75%;top:81.01%\" aria-pressed=\"false\">Legs<br>push</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "tall",
        cues: [{ key: "tall", cue: "Sit tall; no rocking, the torso finishes upright." }, { key: "elbows", cue: "Drive the elbows back past the ribs, close to the body." }, { key: "squeeze", cue: "Finish by squeezing the shoulder blades together, down, not up." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "swing",
        cues: [{ key: "swing", cue: "The torso swings back past upright to heave the weight." }, { key: "legs", cue: "The knees straighten to shove the body back." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Swinging back</b><span>The torso swings back past upright to heave the weight.</span></li><li><b>Legs push</b><span>The knees straighten to shove the body back.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 1 second, hold 1 second, return 2 seconds, rest 0.5 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:0.5 1 0\"><i></i><div class=\"tempo-label\"><b>Rest</b><span>0.5 s</span></div></div></div>",
      alt: "Seated cable row, side view. Seated on a row bench, feet on the footrest with knees slightly bent, the lifter pulls a V-handle from straight arms to the upper belly, elbows back past the ribs, torso upright.",
      mistakeAlt: "Seated Cable Row: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "pull",
    "orientation": "neutral",
    "handle": "v-handle",
    "loadAxis": "across",
    "overBody": false,
    "width": {
      "text": "Set by the handle: about a fist's width apart, in front of your middle. Let your hands sit the way it sets them, wrists straight.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "deabreu2023",
          "padovan2025grip",
          "difonza2026"
        ],
        "note": "Close grip and elbows in favour the lats (de Abreu Vasconcelos; Padovan via Di Fonza). Di Fonza: width and arm angle were never tested together, so the V-handle is a reasonable start, not a proven best."
      }
    },
    "thumb": {
      "mode": "wrapped",
      "options": [],
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "baechle-earle",
          "nsca-low-row"
        ],
        "note": "No study compares full and thumbless grips on a row. The NSCA row text asks for a closed grip; the NSCA editors teach the thumb round the bar. Thumb on top is not offered: unmeasured on a row, and a V-handle has little room for it (card)."
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        20
      ],
      "dev": [
        -10,
        10
      ],
      "limitText": "Curling wrists mean your grip is taking over. Finish the rep, then end the set.",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "odriscoll1992"
        ],
        "note": "O'Driscoll 1992 (a dynamometer, applied by reasoning): grip strongest about 35 degrees back, weaker 10 to 15 degrees away. The 0 to 20 target and the end-the-set limit are consensus, not injury thresholds. A7 open: the lat pulldown card dropped its band."
      }
    },
    "pose": {
      "view": "radial",
      "forearm": 180,
      "wrist": {
        "ext": 10,
        "dev": 0
      },
      "contactAt": 1,
      "fingers": {
        "curl": 1
      },
      "thumb": "wrapped",
      "squeeze": "firm",
      "handle": {
        "profile": "v-handle",
        "axis": "across",
        "strut": [
          0.35,
          -1
        ]
      },
      "load": {
        "kind": "pull"
      }
    },
    "faults": [
      {
        "key": "curled-slip",
        "label": "Curled, slipping",
        "pose": {
          "wrist": {
            "ext": -30,
            "dev": 0
          },
          "contactAt": 1.35,
          "squeeze": "max",
          "thumb": "wrapped"
        },
        "markers": [
          "lever-arc",
          "slip-arrow",
          "tendon"
        ],
        "alt": "The wrist curls forward, palm turned toward the belly. The handle rolls toward the fingertips. The fist squeezes hard, forearm tendons standing out. The arms end up pulling."
      }
    ],
    "gripLine": "Pull with your elbows, not your hands. Handle at the base of your fingers, thumbs wrapped, wrists straight.",
    "cue": "Hands are hooks. Pull with elbows."
  },
  contacts: [
    "foot-platform"
  ],
  setup: [
    {
      "kind": "load",
      "text": "Clip on the V-handle. Start light.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nsca-low-row"
        ],
        "note": "\"Lighter than you think\" is card consensus."
      }
    },
    {
      "kind": "get-in",
      "text": "Sit facing the stack, feet flat on the plate.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nsca-low-row",
          "unmc-cable-row"
        ]
      }
    },
    {
      "kind": "grip",
      "text": "Bend your knees, not your back, to take the handle. Thumbs wrapped.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "baechle-earle",
          "nsca-low-row"
        ]
      }
    },
    {
      "kind": "position",
      "text": "Sit tall, knees soft. Push back until the weight clears the stack.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nsca-low-row",
          "unmc-cable-row"
        ],
        "note": "Card consensus; the NSCA text asks for knees slightly flexed and kept there."
      }
    },
    {
      "kind": "brace",
      "text": "Chest up, shoulders down before you pull. It's hardest at the start.",
      "zoom": "back",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "nsca-low-row",
          "unmc-cable-row",
          "cronin2007"
        ],
        "note": "Cronin 2007: peak force comes in the first part of the pull, so the back is set before it starts."
      }
    }
  ],
  posture: [
    {
      "key": "feet",
      "label": "Knees soft",
      "detail": "Whole foot on the plate, hip width apart, knees slightly bent all set. Your legs brace you and stay still.",
      "anchor": {
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nsca-low-row",
          "unmc-cable-row"
        ],
        "note": "Foot on platform has no zoom (chip limit, see chips); the plate shows the soft knees and its Mistake layer the legs pushing."
      }
    },
    {
      "key": "torso",
      "label": "Torso still",
      "detail": "Torso close to vertical, chest up, lower back in its natural curve. The angle is the same at the start and finish of every rep. No rocking forward to reach or back to pull.",
      "anchor": {
        "at": "backUpper"
      },
      "zoom": "back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-row",
          "nsca-low-row",
          "unmc-cable-row"
        ]
      }
    },
    {
      "key": "finish",
      "label": "Handle to belly",
      "detail": "The handle finishes at the upper stomach. That is between your belly button and the bottom of your breastbone. The cable stays level or nearly level.",
      "anchor": {
        "at": "grips"
      },
      "zoom": "finish",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nsca-low-row",
          "unmc-cable-row"
        ]
      }
    },
    {
      "key": "elbows",
      "label": "Elbows by ribs",
      "detail": "Elbows travel back low and close to the body and stop just behind the torso. Arms close to the body favour the lats and give the most force.",
      "anchor": {
        "at": "elbow.r"
      },
      "zoom": "finish",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "deabreu2023",
          "ace-seated-row"
        ],
        "note": "Plate callout \"Elbows back\"."
      }
    },
    {
      "key": "blades",
      "label": "Shoulders down",
      "detail": "Shoulders stay away from the ears all set. At the end of the pull your shoulder blades move toward each other. On the way forward they slide apart under control. Let them move. A hard extra squeeze adds nothing measurable.",
      "anchor": {
        "at": "shoulderTop.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "ace-seated-row",
          "lehman2004",
          "padovan2025scap"
        ],
        "note": "The card's back-view \"shoulder blades\" zoom needs a back-view plate (5.2). The approved plate (golden A, owner rule) keeps its \"Squeeze blades\" callout unchanged; this checkpoint carries the verified wording (let the blades come back, no hard squeeze)."
      }
    },
    {
      "key": "wrists",
      "label": "Wrists straight",
      "detail": "Back of the hand in line with the forearm the whole way. Handle at the base of the fingers, no curl at the end.",
      "anchor": {
        "at": "grip.r"
      },
      "zoom": "hand",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "odriscoll1992"
        ]
      }
    }
  ],
  zooms: [
    {
      "key": "hand",
      "chip": "Hand",
      "heading": "Hand: right and wrong",
      "kind": "hand",
      "feelRow": "wrist"
    },
    {
      "key": "back",
      "chip": "Back line",
      "heading": "Back line: right and wrong",
      "kind": "posture",
      "feelRow": "low-back"
    },
    {
      "key": "finish",
      "chip": "Finish",
      "heading": "Finish: right and wrong",
      "kind": "posture",
      "feelRow": "traps"
    }
  ],
  chips: [
    "hand",
    "back",
    "finish",
    "feel"
  ],
  copy: {
    "setupLine": "Feet flat, knees soft, sit tall with the weight off the stack. Pull the handle to your belly, torso still.",
    "mistakeLine": "Don't rock to move the weight. If you have to swing, it's too heavy."
  },
  mistakes: [
    {
      "key": "rock",
      "title": "Rocking your torso",
      "zoom": "back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-row"
        ]
      },
      "fix": "Pick a weight you can pull with a still torso."
    },
    {
      "key": "round",
      "title": "Rounding your lower back",
      "zoom": "back",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "nsca-low-row",
          "callaghan2001"
        ]
      },
      "fix": "Arms go long, back stays tall."
    },
    {
      "key": "shrug",
      "title": "Shrugging and flaring elbows",
      "zoom": "finish",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "deabreu2023",
          "ace-seated-row"
        ]
      },
      "fix": "Shoulders down, elbows tucked to your ribs."
    }
  ],
  risks: [
    {
      "key": "back",
      "text": "Rocking loads your lower back. Repeated rounding under load hurt discs in lab tests.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "fenwick2009",
          "callaghan2001"
        ],
        "note": "Not measured for this row; Callaghan 2001 used pig spines."
      }
    },
    {
      "key": "shoulder",
      "text": "Shrugging loads your neck. Elbows too far back can pinch your shoulder.",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "deabreu2023",
          "dosanjos2024",
          "ace-seated-row"
        ]
      }
    },
    {
      "key": "wrist",
      "text": "Curled wrists tire your forearms first and can make wrists sore over time.",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "odriscoll1992"
        ],
        "note": "The grip-strength part is measured; the soreness link is consensus."
      }
    }
  ],
  riskFlags: [
    "wrist",
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
    "deabreu2023",
    "padovan2025grip",
    "padovan2025scap",
    "difonza2026",
    "lehman2004",
    "fujita2020",
    "dosanjos2024",
    "saeterbakken2015",
    "fenwick2009",
    "callaghan2001",
    "cronin2007",
    "odriscoll1992",
    "ronai2019",
    "ace-seated-row",
    "nsca-low-row",
    "unmc-cable-row",
    "baechle-earle",
    "nhs-wrist-pain",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "grip/research/seated_cable_row.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

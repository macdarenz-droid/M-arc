// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=1042552a5ed2b32adba86e6217770967192a9502476cca9dd28b578d9dc672b3
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_dumbbell_lateral_raise",
  name: "Dumbbell Lateral Raise",
  hashes: { inputsSha256: "1042552a5ed2b32adba86e6217770967192a9502476cca9dd28b578d9dc672b3", golden: "8bb81d44ec6f7b3514c3eff5ce6940d79cb0cae175aae00968a89e4b463a856b" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"lr-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"lr-n-head\" d=\"~#D12Y(y1YDgzVx1IwgEjNeXcDbT9D3-4B3B3B3-4B3-4x8R1*7B3T9D3T9S1*7_4x8_4B3D3B3_4B3U9D3YcDbFjNe0000100000001010020002101000002000000000000010000000000200022020000000200000\"/><path id=\"lr-n-torso\" d=\"~#A22SIA1YDl)GA1*-j!c-kAr0y8K6K6R1IeUh-J1Db-4-cU9_sT9Yc_4R9DjI6U9J6-c0)n-c)E1)nID2BrJD2BrwF1)nwo-c_c0T9J6BjI6-4R9U9YcT9_s_4-c_J1DbJeUhN6R1x8K6zr0.c-kyY2_J10121011000002000100002000000002101010000000000200001000000002000000000100000000001001000000000000101110000000002000010100000200111010000\"/><path id=\"lr-n-leg0\" d=\"~#F12wyz1DxG1*!y1xXE1x2OaG10F5FY1_5B7S2V3D1KJ1SbGnjEkxdRm*3GJ1.2I3B6.6V1NY1F11N1TaTvRfVkSG1D1!z1DnDF100000010100200000001010000000000000000000002000000011100110110012100100100001010\"/><path id=\"lr-n-leg1\" d=\"~~AKA1Y(T1_J10\"/><path id=\"lr-n-leg2\" d=\"~#F12SIA1Y)T1INA1)RS1U1KbD10D6Y!1Y5V7Y2.3z5xw2w7-d7*bR7OdJ2Ew2-2V3B6R7O3y*1G10x2IbRcNaVcwpcUl_dPo01010000101010100002000010001000000000000002000011000010000000002020000100000200\"/><path id=\"lr-n-leg3\" d=\"~#e2JFB1YN)1BVz1XN)1IuwY1-cIuKN1EjR9I6UG1)vDj)n1000000010010000000000000000\"/><path id=\"lr-n-leg4\" d=\"~#F12wyuH!F1T)t*RE1K1TaE11W1NY1D6.6!2I3(3GJ1ydRmkEkRbGnB1KJ1R2V3-5B7E5FY1H10y2OaTuRhBnDF1B1!z1WkSG101200121002101000000020000101000000000000001011010000200001010002020000001200011\"/><path id=\"lr-n-leg5\" d=\"~~YWuY(T1_J10\"/><path id=\"lr-n-leg6\" d=\"~#F12DVuY*T1*-uzPS1y2IbH10P3y*1D6R7_2V3I2Ew2S7Od8*b)6-dA5xw2X2.3X5V7B6Y!1B10T1Kb)c_9-dPobUlWcwp00000000200000210000020000000000002000200000020020000020000001010002000001001010\"/><path id=\"lr-n-leg7\" d=\"~#e2AVw1YN)1GFy1XN)1JuwY1_cIuNN1EjS9I6TG1)vBj)n2000000020010010100000000000\"/><path id=\"lr-n-st-10\" d=\"~~S)qYDqwP10\"/><path id=\"lr-n-st-11\" d=\"~#F12FwrN(pIErK.ow2X8a4*5FO1D4E5!1X2Nc.A1ydVg(2EgV6Bkw1*D1rz3z2K6RaNN190y1*8Xf-3*h_m.3ymw9Sr00012000020000220000000200120000000010001000000101010000000100000202000101000020\"/><path id=\"lr-n-st-12\" d=\"~~WYp_Iz1Dz10\"/><path id=\"lr-n-st-13\" d=\"~#F12UXpNBz1G)pBIy1N3O9e(1.3yH1y5E8(1)1(5.uw9Kb!1xbO4Xdy5xvE1O2.1R9Xa!F1z1W14xa.9-2XdNh*2wh!6Al00022000000000101010010000010000000000000000000020210000000020010001000000120000\"/><path id=\"lr-n-st-14\" d=\"~~AEowXJ1ww10\"/><path id=\"lr-n-st-1disc\" d=\"~MP*qwXJ1LBrAO1LBrzO1LDrzO1LJW10LDrAO1Z\"/><path id=\"lr-n-st10\" d=\"~~(*E1YDqwP10\"/><path id=\"lr-n-st11\" d=\"~#F12W(E1yOqK-E1VIpx1*8a0SaNN1A2K6sz3v*D1W6Bk*2EgxdVgKc.A1.1X2B4E5(5FO194)1X8BgY1)8Sr!3ym(h_m00000100000001010100002000200000000022000200000012101012101001001000000101000202\"/><path id=\"lr-n-st12\" d=\"~~N(G1_Iz1Dz10\"/><path id=\"lr-n-st13\" d=\"~#F12J*G1FSz1R.G1)Wy13xaA1W1Ya!F1!1R9F1O2x5xvP4Xd.1xb)8Kb*5.u*1)1x5E8!3yH1d(1K3O9Bao.6Al(2whYdNh01100000000011100000001010000000000001000001200000000010101002000000220000000100\"/><path id=\"lr-n-st14\" d=\"~~JWI1wXJ1ww10\"/><path id=\"lr-n-st1disc\" d=\"~MYJN1wXJ1LBrAO1LBrzO1LDrzO1LJW10LDrAO1Z\"/><path id=\"lr-n-g00\" d=\"^10\"/><path id=\"lr-n-g01\" d=\"~#F12NArWRp*Ur)RoH4-784Vi_I1N5*3U2)1ymzw1FhKcD7-epBlWbBB10G35V6xnWG171P3E8zex8On(g-9DkA1(s10101000100000000220020000010110101010111000000000000002000001000000010020000000\"/><path id=\"lr-n-g02\" d=\"~~!GnFSy1Dz10\"/><path id=\"lr-n-g03\" d=\"~#F12yInAAy1BYnzJx1H5R82(1*cHF1Y6x7J2K1Nc*sFbz9F4KaK1IeWbEtlX28V9IjSB1K1J1F2-9*8-4EhyeT6!fF2Am00000001010000000000021010020001011002000000010001000110100002200000001001200020\"/><path id=\"lr-n-g04\" d=\"~~_Yj!HI1ww10\"/><path id=\"lr-n-g0disc\" d=\"~MFOm!HI1LErAO1LzrzO1LDrzO1LJW10LDrAO1Z\"/><path id=\"lr-n-g10\" d=\"^10\"/><path id=\"lr-n-g11\" d=\"~#F12!IrUDpKAsVJoF6I688xu(A1H6G2y3B1yu-owkB7wbEcy5TkPlKw1uB3U1R6Vx1Yx153W5)6KbTbBr_9xfWg*6Ds01011000000100010100000001010000101000002000010101111002202001101000000010100000\"/><path id=\"lr-n-g12\" d=\"~~DBl(zx1Dz10\"/><path id=\"lr-n-g13\" d=\"~#F12UHlHNw1)!l)-vD7z7b(1*lDA1D8G5W2pYiGpydE6U6z9(1IeyiXp0X2P2O9RrDw1V1uP4)8V7-6)jY9xa!d)2ym10110001210000010100001101000220000010001002002000000000000002001000000000000010\"/><path id=\"lr-n-g14\" d=\"~~FWf(-F1ww10\"/><path id=\"lr-n-g1disc\" d=\"~MUJi(-F1LBrAO1LBrzO1LArzO1LPW12LAryO1Z\"/><path id=\"lr-n-g20\" d=\"^10\"/><path id=\"lr-n-g21\" d=\"~#F12AWry(o*Us*Io!7I44azE1FrY6fF39Yz1RfDlI1weX8PaKiUtGp_1X2H3.5TG1Fn59J7z5X7Ee.s!1xj(bIeAp11200000000000000010000121000001001000002000220010000000010120120020000001210011\"/><path id=\"lr-n-g22\" d=\"~~wPjNAvDz10\"/><path id=\"lr-n-g23\" d=\"~#F12P.jFFuESkx-tY8x5tW1xu_tF9z3_27Jo.jAe*2W8B7H5Od!nTkmT2W4R8Ry1No.1iP6X7V5I8-lS4BdwbE8Wk00000001010000200120010000000220000001010000000000010101001000000012000100020000\"/><path id=\"lr-n-g24\" d=\"~~NHcYEB1ww10\"/><path id=\"lr-n-g2disc\" d=\"~M!wfYEB1LEryO1LzrxO1LDrxO1LJW11LDrAO1Z\"/><path id=\"lr-n-g30\" d=\"^10\"/><path id=\"lr-n-g31\" d=\"~#F12Pxs!Yo*ztIOoW8z24a.J1DgS6F1J3iND1-5!kD4Yf.4(e)eDz1-gJ2E2_4X4EN1Ub39N8x3V3XfOsV5KlU6KkSk00000000000010101101011111000011001002010100000000011001010120200200000200000001\"/><path id=\"lr-n-g32\" d=\"~~YOiY*sDz10\"/><path id=\"lr-n-g33\" d=\"~#F12JzjN!rE*jVTrW9T2E1N1-A1wlY9jY2gYs*cJesFaX4W8TbHsXdJ1I2W6)6TE1Se)14H8X5I3T9BmG1TfJ7GdYh00000001210010200001000000000022000000010000021012210100101210000101110200000101\"/><path id=\"lr-n-g34\" d=\"~~U)9A(w1ww10\"/><path id=\"lr-n-g3disc\" d=\"~MwWcA(w1LBrAO1LBrzO1LDrzO1LJW12LDryO1Z\"/><path id=\"lr-n-e-10\" d=\"^10\"/><path id=\"lr-n-e-11\" d=\"~#F12!KsYWoTRtKWow9618KO1y4y6(2(2H1YD1N4yjN9PgjHiVaFD1x7w3T1_5G3VO1n07(8peEg)p-cImqzpSe00002001000000010110000022000200011100000000200010000000000101111001010020001000\"/><path id=\"lr-n-e-12\" d=\"~~(yiARqDz10\"/><path id=\"lr-n-e-13\" d=\"~#F12Y)i!Jpx.jxIpAa3T1A1)F1YaU9!1P2F1yvx5YdS4Ab)1Hb*8wv.5!1x2J8)4BH1!3.1dP9K3nzazl)6*gw3OhYd02010000001000210002001111000000200000000001100002000001210000000001000000100200\"/><path id=\"lr-n-e-14\" d=\"~~(_8!Bsww10\"/><path id=\"lr-n-e10\" d=\"^16\"/><path id=\"lr-n-e11\" d=\"~#F12FJG1YWrRFF1RUr*8p07WO1n-5G3)2T1ED1x7GiVaOgjxjN9XD1N4*2H1x6(2NO1y428)86T1DgApSeJmqwq-c01111100000000001010000000002101001210120000200101101000011000000020001000010100\"/><path id=\"lr-n-e12\" d=\"~~DUR1ARqDz10\"/><path id=\"lr-n-e13\" d=\"~#F12wRS1JVrXWR1VKrO9K3!1dDH1!3I8)4.1x2)u.5Gb*8zb)1XdS4xvx5O2F1T9!1wG1YaU1A1za3X2!9PhYd(gw3Al)600000011010000020020010000000010000000010100020011002000000001020002200000000100\"/><path id=\"lr-n-e14\" d=\"~~Sy.1!Bsww10\"/><path id=\"lr-n-discL\" d=\"~MJRb!BsLBrAO1LErzO1LFrzO1LJW10LFrAO1Z\"/><path id=\"lr-n-discR\" d=\"~M(Y*1!BsLBrAO1LErzO1LFrzO1LJW10LFrAO1Z\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#lr-n-dots)\"/>\n  <path class=\"datum\" d=\"M12 134.2H145.85\"/><path class=\"floorline\" d=\"M104 339.5H254\"/><path class=\"arc measure\" d=\"M212.15 134.2L217.01 161.77A28 28 0 0 0 240.13 135.18Z\"/><g class=\"pose-start\"><g class=\"u-stroke\"><use href=\"#lr-n-st-10\" class=\"\"/><use href=\"#lr-n-st-11\" class=\"\"/><use href=\"#lr-n-st-12\" class=\"\"/><use href=\"#lr-n-st-13\" class=\"\"/><use href=\"#lr-n-st-14\" class=\"\"/><use href=\"#lr-n-st-1disc\" class=\"\"/><use href=\"#lr-n-st10\" class=\"\"/><use href=\"#lr-n-st11\" class=\"\"/><use href=\"#lr-n-st12\" class=\"\"/><use href=\"#lr-n-st13\" class=\"\"/><use href=\"#lr-n-st14\" class=\"\"/><use href=\"#lr-n-st1disc\" class=\"\"/></g><g class=\"u-fill\"><use href=\"#lr-n-st-10\" class=\"\"/><use href=\"#lr-n-st-11\" class=\"\"/><use href=\"#lr-n-st-12\" class=\"\"/><use href=\"#lr-n-st-13\" class=\"\"/><use href=\"#lr-n-st-14\" class=\"\"/><use href=\"#lr-n-st-1disc\" class=\"\"/><use href=\"#lr-n-st10\" class=\"\"/><use href=\"#lr-n-st11\" class=\"\"/><use href=\"#lr-n-st12\" class=\"\"/><use href=\"#lr-n-st13\" class=\"\"/><use href=\"#lr-n-st14\" class=\"\"/><use href=\"#lr-n-st1disc\" class=\"\"/></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-th=\"26\"><g class=\"u-stroke\"><use href=\"#lr-n-g00\" class=\"\"/><use href=\"#lr-n-g01\" class=\"\"/><use href=\"#lr-n-g02\" class=\"\"/><use href=\"#lr-n-g03\" class=\"\"/><use href=\"#lr-n-g04\" class=\"\"/><use href=\"#lr-n-g0disc\" class=\"\"/></g><g class=\"u-fill\"><use href=\"#lr-n-g00\" class=\"\"/><use href=\"#lr-n-g01\" class=\"\"/><use href=\"#lr-n-g02\" class=\"\"/><use href=\"#lr-n-g03\" class=\"\"/><use href=\"#lr-n-g04\" class=\"\"/><use href=\"#lr-n-g0disc\" class=\"\"/></g></g><g class=\"ghost\" style=\"--o:0.2;--i:1\" data-th=\"42\"><g class=\"u-stroke\"><use href=\"#lr-n-g10\" class=\"\"/><use href=\"#lr-n-g11\" class=\"\"/><use href=\"#lr-n-g12\" class=\"\"/><use href=\"#lr-n-g13\" class=\"\"/><use href=\"#lr-n-g14\" class=\"\"/><use href=\"#lr-n-g1disc\" class=\"\"/></g><g class=\"u-fill\"><use href=\"#lr-n-g10\" class=\"\"/><use href=\"#lr-n-g11\" class=\"\"/><use href=\"#lr-n-g12\" class=\"\"/><use href=\"#lr-n-g13\" class=\"\"/><use href=\"#lr-n-g14\" class=\"\"/><use href=\"#lr-n-g1disc\" class=\"\"/></g></g><g class=\"ghost\" style=\"--o:0.28;--i:2\" data-th=\"58\"><g class=\"u-stroke\"><use href=\"#lr-n-g20\" class=\"\"/><use href=\"#lr-n-g21\" class=\"\"/><use href=\"#lr-n-g22\" class=\"\"/><use href=\"#lr-n-g23\" class=\"\"/><use href=\"#lr-n-g24\" class=\"\"/><use href=\"#lr-n-g2disc\" class=\"\"/></g><g class=\"u-fill\"><use href=\"#lr-n-g20\" class=\"\"/><use href=\"#lr-n-g21\" class=\"\"/><use href=\"#lr-n-g22\" class=\"\"/><use href=\"#lr-n-g23\" class=\"\"/><use href=\"#lr-n-g24\" class=\"\"/><use href=\"#lr-n-g2disc\" class=\"\"/></g></g><g class=\"ghost\" style=\"--o:0.36;--i:3\" data-th=\"73\"><g class=\"u-stroke\"><use href=\"#lr-n-g30\" class=\"\"/><use href=\"#lr-n-g31\" class=\"\"/><use href=\"#lr-n-g32\" class=\"\"/><use href=\"#lr-n-g33\" class=\"\"/><use href=\"#lr-n-g34\" class=\"\"/><use href=\"#lr-n-g3disc\" class=\"\"/></g><g class=\"u-fill\"><use href=\"#lr-n-g30\" class=\"\"/><use href=\"#lr-n-g31\" class=\"\"/><use href=\"#lr-n-g32\" class=\"\"/><use href=\"#lr-n-g33\" class=\"\"/><use href=\"#lr-n-g34\" class=\"\"/><use href=\"#lr-n-g3disc\" class=\"\"/></g></g><g class=\"pose-end\"><g class=\"u-stroke\"><use href=\"#lr-n-head\" class=\"\"/><use href=\"#lr-n-torso\" class=\"\"/><use href=\"#lr-n-leg0\" class=\"\"/><use href=\"#lr-n-leg1\" class=\"\"/><use href=\"#lr-n-leg2\" class=\"\"/><use href=\"#lr-n-leg3\" class=\"\"/><use href=\"#lr-n-leg4\" class=\"\"/><use href=\"#lr-n-leg5\" class=\"\"/><use href=\"#lr-n-leg6\" class=\"\"/><use href=\"#lr-n-leg7\" class=\"\"/><use href=\"#lr-n-e-10\" class=\"\"/><use href=\"#lr-n-e-11\" class=\"\"/><use href=\"#lr-n-e-12\" class=\"\"/><use href=\"#lr-n-e-13\" class=\"\"/><use href=\"#lr-n-e-14\" class=\"\"/><use href=\"#lr-n-e10\" class=\"\"/><use href=\"#lr-n-e11\" class=\"\"/><use href=\"#lr-n-e12\" class=\"\"/><use href=\"#lr-n-e13\" class=\"\"/><use href=\"#lr-n-e14\" class=\"\"/></g><g class=\"u-fill\"><use href=\"#lr-n-head\" class=\"\"/><use href=\"#lr-n-torso\" class=\"\"/><use href=\"#lr-n-leg0\" class=\"\"/><use href=\"#lr-n-leg1\" class=\"\"/><use href=\"#lr-n-leg2\" class=\"\"/><use href=\"#lr-n-leg3\" class=\"\"/><use href=\"#lr-n-leg4\" class=\"\"/><use href=\"#lr-n-leg5\" class=\"\"/><use href=\"#lr-n-leg6\" class=\"\"/><use href=\"#lr-n-leg7\" class=\"\"/><use href=\"#lr-n-e-10\" class=\"\"/><use href=\"#lr-n-e-11\" class=\"\"/><use href=\"#lr-n-e-12\" class=\"\"/><use href=\"#lr-n-e-13\" class=\"\"/><use href=\"#lr-n-e-14\" class=\"\"/><use href=\"#lr-n-e10\" class=\"\"/><use href=\"#lr-n-e11\" class=\"\"/><use href=\"#lr-n-e12\" class=\"\"/><use href=\"#lr-n-e13\" class=\"\"/><use href=\"#lr-n-e14\" class=\"\"/></g>\n    <use href=\"#lr-n-discL\" class=\"disc\"/><use href=\"#lr-n-discR\" class=\"disc\"/>\n    <circle class=\"disc-core\" cx=\"50.39\" cy=\"144.3\" r=\"2.3\"/><circle class=\"disc-core\" cx=\"307.61\" cy=\"144.3\" r=\"2.3\"/>\n    <circle class=\"joint\" cx=\"145.85\" cy=\"134.2\" r=\"2.25\"/><circle class=\"joint\" cx=\"98.26\" cy=\"135.86\" r=\"2.25\"/><circle class=\"joint\" cx=\"212.15\" cy=\"134.2\" r=\"2.25\"/><circle class=\"joint\" cx=\"259.74\" cy=\"135.86\" r=\"2.25\"/></g><g class=\"accent-layer\">\n    <path class=\"trace\" pathLength=\"1\" d=\"~#Y10(KmwwJ1-)mKDJ16j4h8h8h8hah8hcfafchcdcfgfcdedgd1v2tkfibkbmbk9kbm7k9o50101000000000000200000000000100002000201010200000000210010000001011011000000211012000200220010001010121000200200\"/>\n    <path class=\"arrow\" d=\"~M!FaA*uLwuHtLOx2xhZ\"/>\n    <g class=\"measure\"><path class=\"arc-line\" d=\"M217.01 161.77A28 28 0 0 0 240.13 135.18\"/><g class=\"arc-ticks\"><path d=\"~MwFH1P_uLY9JX1\"/><path d=\"~M!zN1wJqLDY1(1\"/></g>\n    <path class=\"leader\" d=\"~MN.K1YxuLHT1PX3\"/></g>\n    <path data-guide=\"elbows\" style=\"display:none\" class=\"lead-guide\" d=\"~MJXS1ARqL!AbPc\"/>\n  </g><path class=\"leader\" d=\"M198.97 125.62L224 62H234\"/>\n    <circle class=\"anchor\" cx=\"198.97\" cy=\"125.62\" r=\"1.5\"/><path class=\"leader\" d=\"~MJXS1SOpL0xE3\"/>\n    <circle class=\"anchor\" cx=\"259.74\" cy=\"130.49\" r=\"1.5\"/><path class=\"leader\" d=\"~MPG4YDqL0XH4\"/>\n    <circle class=\"anchor\" cx=\"22\" cy=\"134.2\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"lateral-raise-n-shrug\" data-key=\"shrug\" data-cue=\"The upper traps stay quiet. No shrug.\" class=\"plate-callout\" style=\"left:63.69%;top:11.17%\" aria-pressed=\"true\">No shrug</button><button type=\"button\" id=\"lateral-raise-n-elbows\" data-key=\"elbows\" data-cue=\"The elbows lead, the hands follow.\" class=\"plate-callout\" style=\"left:68.16%;top:23.46%\" aria-pressed=\"false\">Elbows lead</button><button type=\"button\" id=\"lateral-raise-n-stop\" data-key=\"stop\" data-cue=\"Stop when the arms are level with the shoulders.\" class=\"plate-callout two\" style=\"left:2.79%;top:20.11%\" aria-pressed=\"false\">Stop at<br>shoulder height</button><span class=\"plate-arc-label\" style=\"left:68.72%;top:46.37%\"><b>Shoulder</b><span>up to 90°</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"lr-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"lr-m-head\" d=\"^0\"/><path id=\"lr-m-torso\" d=\"^1\"/><path id=\"lr-m-leg0\" d=\"^2\"/><path id=\"lr-m-leg1\" d=\"^3\"/><path id=\"lr-m-leg2\" d=\"^4\"/><path id=\"lr-m-leg3\" d=\"^5\"/><path id=\"lr-m-leg4\" d=\"^6\"/><path id=\"lr-m-leg5\" d=\"^7\"/><path id=\"lr-m-leg6\" d=\"^8\"/><path id=\"lr-m-leg7\" d=\"^9\"/><path id=\"lr-m-st-10\" d=\"^10\"/><path id=\"lr-m-st-11\" d=\"^11\"/><path id=\"lr-m-st-12\" d=\"^12\"/><path id=\"lr-m-st-13\" d=\"^13\"/><path id=\"lr-m-st-14\" d=\"^14\"/><path id=\"lr-m-st-1disc\" d=\"^15\"/><path id=\"lr-m-st10\" d=\"^16\"/><path id=\"lr-m-st11\" d=\"^17\"/><path id=\"lr-m-st12\" d=\"^18\"/><path id=\"lr-m-st13\" d=\"^19\"/><path id=\"lr-m-st14\" d=\"^20\"/><path id=\"lr-m-st1disc\" d=\"^21\"/><path id=\"lr-m-g00\" d=\"^10\"/><path id=\"lr-m-g01\" d=\"^22\"/><path id=\"lr-m-g02\" d=\"^23\"/><path id=\"lr-m-g03\" d=\"^24\"/><path id=\"lr-m-g04\" d=\"^25\"/><path id=\"lr-m-g0disc\" d=\"^26\"/><path id=\"lr-m-g10\" d=\"^10\"/><path id=\"lr-m-g11\" d=\"^27\"/><path id=\"lr-m-g12\" d=\"^28\"/><path id=\"lr-m-g13\" d=\"^29\"/><path id=\"lr-m-g14\" d=\"^30\"/><path id=\"lr-m-g1disc\" d=\"^31\"/><path id=\"lr-m-g20\" d=\"^10\"/><path id=\"lr-m-g21\" d=\"^32\"/><path id=\"lr-m-g22\" d=\"^33\"/><path id=\"lr-m-g23\" d=\"^34\"/><path id=\"lr-m-g24\" d=\"^35\"/><path id=\"lr-m-g2disc\" d=\"^36\"/><path id=\"lr-m-g30\" d=\"^10\"/><path id=\"lr-m-g31\" d=\"^37\"/><path id=\"lr-m-g32\" d=\"^38\"/><path id=\"lr-m-g33\" d=\"^39\"/><path id=\"lr-m-g34\" d=\"^40\"/><path id=\"lr-m-g3disc\" d=\"^41\"/><path id=\"lr-m-e-10\" d=\"^10\"/><path id=\"lr-m-e-11\" d=\"^42\"/><path id=\"lr-m-e-12\" d=\"^43\"/><path id=\"lr-m-e-13\" d=\"^44\"/><path id=\"lr-m-e-14\" d=\"^45\"/><path id=\"lr-m-e10\" d=\"^16\"/><path id=\"lr-m-e11\" d=\"^46\"/><path id=\"lr-m-e12\" d=\"^47\"/><path id=\"lr-m-e13\" d=\"^48\"/><path id=\"lr-m-e14\" d=\"^49\"/><path id=\"lr-m-discL\" d=\"^50\"/><path id=\"lr-m-discR\" d=\"^51\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#lr-m-dots)\"/>\n  <path class=\"datum\" d=\"^52\"/><path class=\"floorline\" d=\"^53\"/><g class=\"pose-start\"><g class=\"u-stroke\"><use href=\"#lr-m-st-10\" class=\"\"/><use href=\"#lr-m-st-11\" class=\"\"/><use href=\"#lr-m-st-12\" class=\"\"/><use href=\"#lr-m-st-13\" class=\"\"/><use href=\"#lr-m-st-14\" class=\"\"/><use href=\"#lr-m-st-1disc\" class=\"\"/><use href=\"#lr-m-st10\" class=\"\"/><use href=\"#lr-m-st11\" class=\"\"/><use href=\"#lr-m-st12\" class=\"\"/><use href=\"#lr-m-st13\" class=\"\"/><use href=\"#lr-m-st14\" class=\"\"/><use href=\"#lr-m-st1disc\" class=\"\"/></g><g class=\"u-fill\"><use href=\"#lr-m-st-10\" class=\"\"/><use href=\"#lr-m-st-11\" class=\"\"/><use href=\"#lr-m-st-12\" class=\"\"/><use href=\"#lr-m-st-13\" class=\"\"/><use href=\"#lr-m-st-14\" class=\"\"/><use href=\"#lr-m-st-1disc\" class=\"\"/><use href=\"#lr-m-st10\" class=\"\"/><use href=\"#lr-m-st11\" class=\"\"/><use href=\"#lr-m-st12\" class=\"\"/><use href=\"#lr-m-st13\" class=\"\"/><use href=\"#lr-m-st14\" class=\"\"/><use href=\"#lr-m-st1disc\" class=\"\"/></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-th=\"26\"><g class=\"u-stroke\"><use href=\"#lr-m-g00\" class=\"\"/><use href=\"#lr-m-g01\" class=\"\"/><use href=\"#lr-m-g02\" class=\"\"/><use href=\"#lr-m-g03\" class=\"\"/><use href=\"#lr-m-g04\" class=\"\"/><use href=\"#lr-m-g0disc\" class=\"\"/></g><g class=\"u-fill\"><use href=\"#lr-m-g00\" class=\"\"/><use href=\"#lr-m-g01\" class=\"\"/><use href=\"#lr-m-g02\" class=\"\"/><use href=\"#lr-m-g03\" class=\"\"/><use href=\"#lr-m-g04\" class=\"\"/><use href=\"#lr-m-g0disc\" class=\"\"/></g></g><g class=\"ghost\" style=\"--o:0.2;--i:1\" data-th=\"42\"><g class=\"u-stroke\"><use href=\"#lr-m-g10\" class=\"\"/><use href=\"#lr-m-g11\" class=\"\"/><use href=\"#lr-m-g12\" class=\"\"/><use href=\"#lr-m-g13\" class=\"\"/><use href=\"#lr-m-g14\" class=\"\"/><use href=\"#lr-m-g1disc\" class=\"\"/></g><g class=\"u-fill\"><use href=\"#lr-m-g10\" class=\"\"/><use href=\"#lr-m-g11\" class=\"\"/><use href=\"#lr-m-g12\" class=\"\"/><use href=\"#lr-m-g13\" class=\"\"/><use href=\"#lr-m-g14\" class=\"\"/><use href=\"#lr-m-g1disc\" class=\"\"/></g></g><g class=\"ghost\" style=\"--o:0.28;--i:2\" data-th=\"58\"><g class=\"u-stroke\"><use href=\"#lr-m-g20\" class=\"\"/><use href=\"#lr-m-g21\" class=\"\"/><use href=\"#lr-m-g22\" class=\"\"/><use href=\"#lr-m-g23\" class=\"\"/><use href=\"#lr-m-g24\" class=\"\"/><use href=\"#lr-m-g2disc\" class=\"\"/></g><g class=\"u-fill\"><use href=\"#lr-m-g20\" class=\"\"/><use href=\"#lr-m-g21\" class=\"\"/><use href=\"#lr-m-g22\" class=\"\"/><use href=\"#lr-m-g23\" class=\"\"/><use href=\"#lr-m-g24\" class=\"\"/><use href=\"#lr-m-g2disc\" class=\"\"/></g></g><g class=\"ghost\" style=\"--o:0.36;--i:3\" data-th=\"73\"><g class=\"u-stroke\"><use href=\"#lr-m-g30\" class=\"\"/><use href=\"#lr-m-g31\" class=\"\"/><use href=\"#lr-m-g32\" class=\"\"/><use href=\"#lr-m-g33\" class=\"\"/><use href=\"#lr-m-g34\" class=\"\"/><use href=\"#lr-m-g3disc\" class=\"\"/></g><g class=\"u-fill\"><use href=\"#lr-m-g30\" class=\"\"/><use href=\"#lr-m-g31\" class=\"\"/><use href=\"#lr-m-g32\" class=\"\"/><use href=\"#lr-m-g33\" class=\"\"/><use href=\"#lr-m-g34\" class=\"\"/><use href=\"#lr-m-g3disc\" class=\"\"/></g></g><g class=\"pose-end\"><g class=\"u-stroke\"><use href=\"#lr-m-head\" class=\"\"/><use href=\"#lr-m-torso\" class=\"\"/><use href=\"#lr-m-leg0\" class=\"\"/><use href=\"#lr-m-leg1\" class=\"\"/><use href=\"#lr-m-leg2\" class=\"\"/><use href=\"#lr-m-leg3\" class=\"\"/><use href=\"#lr-m-leg4\" class=\"\"/><use href=\"#lr-m-leg5\" class=\"\"/><use href=\"#lr-m-leg6\" class=\"\"/><use href=\"#lr-m-leg7\" class=\"\"/><use href=\"#lr-m-e-10\" class=\"\"/><use href=\"#lr-m-e-11\" class=\"\"/><use href=\"#lr-m-e-12\" class=\"\"/><use href=\"#lr-m-e-13\" class=\"\"/><use href=\"#lr-m-e-14\" class=\"\"/><use href=\"#lr-m-e10\" class=\"\"/><use href=\"#lr-m-e11\" class=\"\"/><use href=\"#lr-m-e12\" class=\"\"/><use href=\"#lr-m-e13\" class=\"\"/><use href=\"#lr-m-e14\" class=\"\"/></g><g class=\"u-fill\"><use href=\"#lr-m-head\" class=\"\"/><use href=\"#lr-m-torso\" class=\"\"/><use href=\"#lr-m-leg0\" class=\"\"/><use href=\"#lr-m-leg1\" class=\"\"/><use href=\"#lr-m-leg2\" class=\"\"/><use href=\"#lr-m-leg3\" class=\"\"/><use href=\"#lr-m-leg4\" class=\"\"/><use href=\"#lr-m-leg5\" class=\"\"/><use href=\"#lr-m-leg6\" class=\"\"/><use href=\"#lr-m-leg7\" class=\"\"/><use href=\"#lr-m-e-10\" class=\"\"/><use href=\"#lr-m-e-11\" class=\"\"/><use href=\"#lr-m-e-12\" class=\"\"/><use href=\"#lr-m-e-13\" class=\"\"/><use href=\"#lr-m-e-14\" class=\"\"/><use href=\"#lr-m-e10\" class=\"\"/><use href=\"#lr-m-e11\" class=\"\"/><use href=\"#lr-m-e12\" class=\"\"/><use href=\"#lr-m-e13\" class=\"\"/><use href=\"#lr-m-e14\" class=\"\"/></g>\n    <use href=\"#lr-m-discL\" class=\"disc\"/><use href=\"#lr-m-discR\" class=\"disc\"/>\n    <circle class=\"disc-core\" cx=\"50.39\" cy=\"144.3\" r=\"2.3\"/><circle class=\"disc-core\" cx=\"307.61\" cy=\"144.3\" r=\"2.3\"/>\n    <circle class=\"joint\" cx=\"145.85\" cy=\"134.2\" r=\"2.25\"/><circle class=\"joint\" cx=\"98.26\" cy=\"135.86\" r=\"2.25\"/><circle class=\"joint\" cx=\"212.15\" cy=\"134.2\" r=\"2.25\"/><circle class=\"joint\" cx=\"259.74\" cy=\"135.86\" r=\"2.25\"/></g><g class=\"mistake-layer\">\n    <path class=\"m-line\" d=\"~#60S.A1w-m)Rz1.!my8PlK6(g000220001000\"/>\n    <path class=\"m-line\" d=\"~#60(xx1w-mOIy1.!mx8PlN6(g000210100000\"/>\n    <path class=\"m-arrow\" d=\"M204.97 121.62V107.62M201.97 110.62L204.97 106.62L207.97 110.62\"/>\n    <path class=\"m-arrow\" d=\"M209.27 250.97V270.97M206.27 266.97L209.27 271.47L212.27 266.97\"/>\n    <path class=\"m-arrow\" d=\"M63.99 137.96A15 15 0 0 0 36.3 139.17M34.85 134.39L36.3 139.17L40.49 136.44\"/>\n    <path class=\"leader m\" d=\"M204.97 105.62L224 62H234\"/>\n    <path class=\"leader m\" d=\"~M(UG1y)S1LSJ60\"/>\n    <path class=\"leader m\" d=\"~M(_9U.oL0T)2\"/>\n  </g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"lateral-raise-m-shrug\" data-key=\"shrug\" data-cue=\"The shoulders shrug toward the ears.\" class=\"plate-callout m\" style=\"left:63.69%;top:11.17%\" aria-pressed=\"true\">Shrug</button><button type=\"button\" id=\"lateral-raise-m-dip\" data-key=\"dip\" data-cue=\"The knees dip to swing it up.\" class=\"plate-callout m\" style=\"left:67.04%;top:66.76%\" aria-pressed=\"false\">Dip</button><button type=\"button\" id=\"lateral-raise-m-thumbs\" data-key=\"thumbs\" data-cue=\"Thumbs turn down at the top.\" class=\"plate-callout two m\" style=\"left:2.79%;top:20.11%\" aria-pressed=\"false\">Thumbs<br>down</button>",
    ]);
    return {
      view: "front",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "shrug",
        cues: [{ key: "shrug", cue: "The upper traps stay quiet. No shrug." }, { key: "elbows", cue: "The elbows lead, the hands follow." }, { key: "stop", cue: "Stop when the arms are level with the shoulders." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "shrug",
        cues: [{ key: "shrug", cue: "The shoulders shrug toward the ears." }, { key: "dip", cue: "The knees dip to swing it up." }, { key: "thumbs", cue: "Thumbs turn down at the top." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Shrug</b><span>The shoulders shrug toward the ears.</span></li><li><b>Dip</b><span>The knees dip to swing it up.</span></li><li><b>Thumbs down</b><span>Thumbs turn down at the top.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lift 1 second, hold 0.5 seconds, lower 2 seconds, rest 0.5 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lift</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:0.5 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>0.5 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:0.5 1 0\"><i></i><div class=\"tempo-label\"><b>Rest</b><span>0.5 s</span></div></div></div>",
      alt: "Dumbbell lateral raise, front view. Start: standing tall, arms at the sides, drawn dashed. Four in-between positions show the arms rising out to the sides with a slight elbow bend, elbows a little ahead of the hands. End: arms level with the shoulders, drawn solid. Shoulder abduction up to 90 degrees.",
      mistakeAlt: "Dumbbell Lateral Raise: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hold",
    "orientation": "neutral",
    "handle": "dumbbell",
    "loadAxis": "across",
    "overBody": false,
    "width": {
      "text": "One dumbbell per hand, beside the outside of each thigh, hands about hip width apart. Hold the middle of the handle so the dumbbell hangs level.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lateral-raise"
        ]
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "ace-lateral-raise",
          "sporrong1995",
          "sporrong1996"
        ],
        "note": "ACE: closed grip, thumbs round the handles. Sporrong: grip-gauge studies, not dumbbells; a reason to avoid a death grip, not proof of harm. No data for the thumbless grip."
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "ext": [
        -10,
        10
      ],
      "dev": [
        -10,
        10
      ],
      "limitText": "Wrist bending past about 15 degrees? Too heavy, or you're lifting with your hands.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "ace-lateral-raise",
          "coratella2020",
          "weiss1995"
        ],
        "note": "Straight wrist: ACE and the Coratella 2020 protocol. The 15 degree limit is coaching consensus, not a measured injury threshold. Weiss 1995 is nerve pressure, MECH/WEAK for this use."
      }
    },
    "pose": {
      "view": "radial",
      "forearm": 90,
      "wrist": {
        "ext": 0,
        "dev": 0
      },
      "contactAt": 0.6,
      "fingers": {
        "curl": 1
      },
      "thumb": "wrapped",
      "squeeze": "firm",
      "handle": {
        "profile": "dumbbell",
        "axis": "across"
      },
      "load": {
        "kind": "gravity"
      }
    },
    "faults": [
      {
        "key": "fingertip-hang",
        "label": "In the fingers",
        "pose": {
          "wrist": {
            "ext": -28,
            "dev": 0
          },
          "contactAt": 1.45,
          "fingers": {
            "curl": 1,
            "open": 0.35
          },
          "thumb": "loose"
        },
        "markers": [
          "lever-arc",
          "slip-arrow"
        ],
        "alt": "Same view. The handle hangs in the fingertips, fingers opening, thumb off. Far past the wrist, the weight pulls the hand about 28 degrees down."
      },
      {
        "key": "little-finger-up",
        "label": "Little finger up",
        "pose": {
          "view": "end-on",
          "handle": {
            "profile": "dumbbell",
            "axis": "along"
          },
          "rollDeg": 22
        },
        "markers": [
          "lever-arc"
        ],
        "alt": "At the top, the dumbbell tips like a pouring jug. Its little-finger end sits clearly above the thumb end. The upper arm turns in."
      }
    ],
    "gripLine": "Hold the handle mid-palm, so your wrist stays straight. At the top, keep your little finger no higher than your thumb.",
    "cue": "Wrist in line with forearm."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "load",
      "text": "Pick dumbbells you can raise 12 to 20 times without swinging.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "ace-lateral-raise",
          "jakobsen2012"
        ],
        "note": "12 to 20 reps is consensus; Jakobsen 2012 only shows 15RM loads are still hard work in novices."
      }
    },
    {
      "kind": "position",
      "text": "Feet hip width, knees soft. Swinging? Sit on a bench.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lateral-raise",
          "coratella2020"
        ],
        "note": "Stance: ACE. Seated: the Coratella 2020 protocol (reference dropped from user copy, A2)."
      }
    },
    {
      "kind": "grip",
      "text": "Dumbbells by your thighs, palms in, grip mid-palm.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lateral-raise"
        ]
      }
    },
    {
      "kind": "position",
      "text": "Keep your elbows soft, arms a little in front.",
      "zoom": "top-height",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lateral-raise"
        ],
        "note": "The 10 to 20 degree bend and 20 to 30 degrees in front of the body (scapular plane) are consensus; no top-down drawing yet (5.2)."
      }
    },
    {
      "kind": "brace",
      "text": "Shoulders down and slightly back, neck long.",
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lateral-raise"
        ]
      }
    }
  ],
  posture: [
    {
      "key": "tall",
      "label": "Stand tall",
      "detail": "Ear, shoulder, hip and ankle roughly stacked, knees soft. Low back in its normal small curve. The torso does not rock back to start the dumbbells moving.",
      "anchor": {
        "at": "sternum"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lateral-raise"
        ]
      }
    },
    {
      "key": "shoulders",
      "label": "Shoulders down",
      "detail": "Clear space between the shoulders and the ears, at the bottom and the top. The shoulders do not ride up toward the ears as the dumbbells rise.",
      "anchor": {
        "at": "trap.l"
      },
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "ace-lateral-raise",
          "andersen2008"
        ]
      }
    },
    {
      "key": "elbows",
      "label": "Elbows lead",
      "detail": "The elbows rise first and stay level with or slightly above the hands. Fixed small bend in the elbow, about 10 to 20 degrees.",
      "anchor": {
        "at": "elbow.l",
        "off": [
          0,
          -5.4
        ]
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lateral-raise"
        ]
      }
    },
    {
      "key": "stop",
      "label": "Shoulder height",
      "detail": "At the top, the upper arms are level with the shoulders and no higher. That is about 90 degrees from the body, parallel to the floor.",
      "anchor": {
        "at": "elbow.r"
      },
      "zoom": "top-height",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA",
          "MECH"
        ],
        "sources": [
          "ace-lateral-raise",
          "kolber2014",
          "graichen1999"
        ]
      }
    },
    {
      "key": "forward",
      "label": "Slightly forward",
      "detail": "From above, the arms sit about 20 to 30 degrees in front of the shoulders. They are not straight out to the side or behind the body.",
      "anchor": {
        "at": "grip.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lateral-raise"
        ],
        "note": "Top-down view: text checkpoint until the engine has a top view (5.2)."
      }
    },
    {
      "key": "wrist-top",
      "label": "Thumb level",
      "detail": "At the top, the palm faces the floor, knuckles in line with the forearm. The thumb end sits level with the little-finger end, or a touch higher.",
      "anchor": {
        "at": "grip.r"
      },
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "ace-lateral-raise",
          "coratella2020"
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
      "feelRow": "forearms"
    },
    {
      "key": "top-height",
      "chip": "Top height",
      "heading": "Top height: right and wrong",
      "kind": "posture",
      "feelRow": "pinch"
    },
    {
      "key": "shoulders",
      "chip": "Shoulders",
      "heading": "Shoulders: right and wrong",
      "kind": "posture",
      "feelRow": "traps"
    }
  ],
  chips: [
    "hand",
    "top-height",
    "shoulders",
    "feel"
  ],
  copy: {
    "setupLine": "Pick a weight you can raise 12 to 20 times without swinging. Shoulders down, elbows soft, arms slightly forward.",
    "mistakeLine": "Stop at shoulder height. Going higher, or tipping your little finger up, can pinch the top of your shoulder."
  },
  mistakes: [
    {
      "key": "tip",
      "title": "Little finger up",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "ace-lateral-raise",
          "coratella2020"
        ]
      },
      "fix": "At the top, palms down, thumbs level with little fingers."
    },
    {
      "key": "swing",
      "title": "Swinging and shrugging",
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "ace-lateral-raise",
          "andersen2008"
        ]
      },
      "fix": "Go lighter, body still, shoulders down."
    },
    {
      "key": "high",
      "title": "Too high",
      "zoom": "top-height",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "ace-lateral-raise",
          "kolber2014"
        ]
      },
      "fix": "Stop at shoulder height, then lower with control."
    }
  ],
  risks: [
    {
      "key": "pinch",
      "text": "Above shoulder height or little finger up can pinch a shoulder tendon.",
      "claim": {
        "tags": [
          "MECH",
          "DATA"
        ],
        "sources": [
          "graichen1999",
          "kolber2014"
        ],
        "note": "Graichen 1999: anatomy in healthy volunteers. Kolber 2014: association, not cause."
      }
    },
    {
      "key": "neck",
      "text": "Shrugging and swinging shift the work to your neck and lower back.",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "andersen2008",
          "ace-lateral-raise"
        ],
        "note": "The injury link is coaching consensus."
      }
    },
    {
      "key": "grip",
      "text": "A handle in your fingers bends your wrist and adds forearm and shoulder work.",
      "claim": {
        "tags": [
          "WEAK",
          "CONSENSUS"
        ],
        "sources": [
          "sporrong1995",
          "sporrong1996"
        ],
        "note": "Grip-gauge studies, not dumbbells."
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
    "ace-lateral-raise",
    "coratella2020",
    "graichen1999",
    "kolber2014",
    "kolber2010",
    "andersen2008",
    "sporrong1995",
    "sporrong1996",
    "weiss1995",
    "jakobsen2012",
    "nhs-wrist-pain",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "grip/research/dumbbell_lateral_raise.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

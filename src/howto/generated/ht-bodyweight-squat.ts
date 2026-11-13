// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=661419b1423ff89fdccba21dfaf2469fa067ab9116d78fc8aa32b8245373755c
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_bodyweight_squat",
  name: "Bodyweight Squat",
  hashes: { inputsSha256: "661419b1423ff89fdccba21dfaf2469fa067ab9116d78fc8aa32b8245373755c", golden: "a8d93efd5910b060fbb03de0bc9d0eef981aa2a4588c49f7a47c1e91b5d44779" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"bodyweight-squat-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"bodyweight-squat-n-st-head\" d=\"~#w12FAE1NHgGRB1O)fVjWiKjA9zbO3I3W4O4z8X7Ibxh.mD5VcG1T9EjfWmTaUmX5UkW3_iPgz2Aj0000020002000001112100001000100120000000100000200000010001000020\"/><path id=\"bodyweight-squat-n-st-torso\" d=\"~#_12HPB1Axlz.B1*SjO9V7B42W8FiF9(6wcWgH68x5Eo)lB9)cD4Dgx4DlB5An.ePiVgH5E9z7KgGpTA1-9VrI69R9h(bWgY2A8GcT8KgA7O7Nkw6W5JcIaw3A9)T2Yt00000110101110002000000001022000002000010122000110010000002101000010100220010100001000000010001000002000200001010000\"/><path id=\"bodyweight-squat-n-st-thigh.r\" d=\"~#F12DWz1UXE1BUz1OFD1I1.bE10A1Y(1D6R7(2.3S4.U1DdRmoBkKbKnhzV1T2)3T5x8-5P(1D12F2XbVu*cKnwF1I1(z1HkUG121000100000012100000000200010101000000101002000000021010011100000002000000101000\"/><path id=\"bodyweight-squat-n-st-kneecap.r\" d=\"~~JEA1!xU1_J10\"/><path id=\"bodyweight-squat-n-st-shank.r\" d=\"~#F12ADA1D!T1TOA1-KS1D3ObF16*2y)1!6x7F3R3S4.y2!8VcP1.bR5Iewc)x2G2E4.4O8Vc_*1B139*bBewaBg_mV2UlyaAq00001000000000000020000000110000000200000010000000100000200121111010100002000001\"/><path id=\"bodyweight-squat-n-st-foot.r\" d=\"~#o2UEz1DB)1E-z1EB(1UcF3Jh)7Jp)nHY2B3RI2-4-B1*7Tn1)F1_4.aXcJsEbBmUp000000001000002101200010100001012020000110020000\"/><path id=\"bodyweight-squat-n-g0-head\" d=\"~#w12DDF1UOiGUD1KwiEl(gzkN7XaI4X3J4.3K8X6)b)eEoD6BchV9xjz2PnV8(m.3HkN5JhyiX3_i0210000002000200000000000001202000000000000101000010100000110000\"/><path id=\"bodyweight-squat-n-g0-torso\" d=\"~#_12_BD1NxnKUD1GUlX8ObB7dP5Dk(7N8y9Hi(5P1bRozjEcOdD2SgV1WlG2wpObUk*dP6O8X4EhxkVE1-5.sV6eI72U9DfN1P8-aTaGhJ4-a!iD5F3NaB8w2WcBW2Wm00001010000010101201010002020022000200001000011001000010000100010100011010000000000000111002000010000011011101000002\"/><path id=\"bodyweight-squat-n-g0-thigh.r\" d=\"~#F12NYx1ySH1-yx1IFG1B6zaz1gNrDY1P2R9uV4xiOR1J2)p-7TiIkGg-mTO1)3R2T8-4Al__1A1d-2ObOx1w1E4FN1(dyx1AA1yt02000000201210010011102000000000021002000120000002002022000020100020001111010010\"/><path id=\"bodyweight-squat-n-g0-kneecap.r\" d=\"~~wHE1P.U1_J10\"/><path id=\"bodyweight-squat-n-g0-shank.r\" d=\"~#F12_IE1DHU1)wF1-)S1D6Gay1i*iA!1N8x5w4T2SlK)1!b*9S4xbX1IfPsV!1x1V4T2O9)rPY1B1dY2TbEgw6Rlwiz8ykA3(r01010100000120000010001010000002000010110110100000000100000000000012100101200001\"/><path id=\"bodyweight-squat-n-g0-foot.r\" d=\"~#o2PEz1DB)1)Yz1EB(1ScF3Jh)7Jp)nFY2B3TI2X4XB1x8Vn0*F1_4*aXcJsEbBmUp000002000200000000001210001010002020021100000000\"/><path id=\"bodyweight-squat-n-g1-head\" d=\"~#w12Y!G1YPoXJF1O!n-mWe.kH5BaO5B4w4)2-8I5VcOcTpJ7KbiX9.ix4JoE6DnK1UjP7NfYjV5Ji0000000010200010100020200110000000200001012000101000000022000000\"/><path id=\"bodyweight-squat-n-g1-torso\" d=\"~#_12UKE1A.s.wF1-OrT6.fXaE2y1(lA6Y9w5(jH5W2F5.nIfBfVddUgF1YlU1Uq.6_mxa(7B7V1.hVcRH1jOtB7q-5uP7!d9S8I8Rc.hmKeDgw56_7G6d_gzY2Wd10000001001000210000200000010000101111100100020000000000100100000000200000000012000000020010000100100001010101021012\"/><path id=\"bodyweight-squat-n-g1-thigh.r\" d=\"~#F12FHw1NNP1.zv*TO1za.5puAS1SA1z2O9G1R4XD1xz1)9xoRf-cTpx5)G1)uX4dX95YK1(G1qv.7X8EtHgWh!H1_r_mPK1!821220011110101020000100101020020010000021000010002110100010000200002000200010000\"/><path id=\"bodyweight-squat-n-g1-kneecap.r\" d=\"~~w_G1PFW1_J10\"/><path id=\"bodyweight-squat-n-g1-shank.r\" d=\"~#F12(wH1UKV1E)H1IGU1H8T8w1oIw1wW1J9*2S4T1Pz1OY1(d.6!6-9(1GfUG1EU12X49-9GF1FP1vjH5Vazhw2zpNcOcWhR3_r22010000020012100000021002002000110000100102002200010000220000000001010020101000\"/><path id=\"bodyweight-squat-n-g1-foot.r\" d=\"~#o2NEz1DB)1.Yz1EB(1ScF3Jh*7HpxoDY2B3OI2-4.B1)7Tn0*F1_4)aXcJsEbzmUp001012000001000101200010000020002000020000200001\"/><path id=\"bodyweight-squat-n-e-thigh.l\" d=\"~#F12FWvSz-1*EuGE-1Rb_10F1Y*1O3V7*5.3X2.T1R2*mGcEk1*mJc.T1S2.3Y2V7(5Y*1P30E1Rb-1OcDv_F1(lwA10_F1)l02020000000000020002000111000000000200100002000000000000000000000010000100001100\"/><path id=\"bodyweight-squat-n-e-kneecap.l\" d=\"~~PIH1_WW1_J10\"/><path id=\"bodyweight-squat-n-e-shank.l\" d=\"~#F12yUH1_-V1IUI1OXU1_8x8uqGz1(T1P9I2U4G1UD1GW1Fex6N7G9_2BfSJ1TR16X4a.9)H1!K1rn_5Gaxhs-pwbRd(gz5Ur00012100020210001000000001000012100001002110100000020020001001010000100010100200\"/><path id=\"bodyweight-squat-n-e-foot.l\" d=\"~#o2HEz1AB)1TYz1zB(1PcF3Nhx8Dp)nFY2B3VI2-4XB1)7Tn2)F1Y4)a-cJsBbzmSp020002210110100100101000200220000101200000010100\"/><path id=\"bodyweight-squat-n-e-shcap.l\" d=\"~~_DD1UyJ1wP10\"/><path id=\"bodyweight-squat-n-e-upper.l\" d=\"~#F12_WE1USK1zTD1VRK1.8d19WO1I2)5B3)2O1KD1V5XixaOg0XiyaKD1Y5)2N1)5D3WO1H21c.8ez1FgUpUdJm2UpXd02020000000001000101000002000000020000000001010000010102000000001200000000000010\"/><path id=\"bodyweight-squat-n-e-elbowcap.l\" d=\"~~D*O1UyJ1Dz10\"/><path id=\"bodyweight-squat-n-e-fore.l\" d=\"~#F12UzR1HEK1KEP1-DK1Kan!1t(H1E7T9X2K2I1*w1N2GdX5Bbw1zc(7-w1H3E2_1*8J4SI19(1izaU2oAaNkY8AhO1UiBc00121020000000000022000000000100002000000010000000000001011000000001000001010000\"/><path id=\"bodyweight-squat-n-e-fist.l\" d=\"~~HY-1JEI1ww10\"/><path id=\"bodyweight-squat-n-e-head\" d=\"~#w12_)I1U-y1TSH1T)x1Ro_bElU2R9V6R4P3.1B9-3BdE9)q_8OaU1R9ziG6!oB3HnJ1Pi!9_cPl.7Sh0210120001000000000020010111000100000000000020010001101010000020\"/><path id=\"bodyweight-squat-n-e-torso\" d=\"~#_12DwG1D-D1RYG1TPB1V2OkGeV5T4SmP3yb0NkD4!3NbGlOaXhBdR3(f(4!kF6PrtNo*4H9E5D2Xhx3KJ1W5-sB8e*4H2_5ScO2D8)4BeOhX3)hDcJ6I3A4K5.4ylB-2W200021000010000000001011110000000100000000000020101000002100000010100100000000010101000120010000101000001112002000000\"/><path id=\"bodyweight-squat-n-e-thigh.r\" d=\"^18\"/><path id=\"bodyweight-squat-n-e-kneecap.r\" d=\"^19\"/><path id=\"bodyweight-squat-n-e-shank.r\" d=\"^20\"/><path id=\"bodyweight-squat-n-e-foot.r\" d=\"^21\"/><path id=\"bodyweight-squat-n-e-shcap.r\" d=\"^22\"/><path id=\"bodyweight-squat-n-e-upper.r\" d=\"^23\"/><path id=\"bodyweight-squat-n-e-elbowcap.r\" d=\"^24\"/><path id=\"bodyweight-squat-n-e-fore.r\" d=\"^25\"/><path id=\"bodyweight-squat-n-e-fist.r\" d=\"^26\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#bodyweight-squat-n-dots)\"/>\n  <path class=\"datum\" d=\"~MWzA1JFw2LURbXKe\"/><path class=\"datum\" d=\"~MFWv_WW1L(UaxAe\"/><path class=\"floorline\" d=\"M86.29 339.5H305.71\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-n-st-head\"/><use href=\"#bodyweight-squat-n-st-torso\"/><use href=\"#bodyweight-squat-n-st-thigh.r\"/><use href=\"#bodyweight-squat-n-st-kneecap.r\"/><use href=\"#bodyweight-squat-n-st-shank.r\"/><use href=\"#bodyweight-squat-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-n-st-head\"/><use href=\"#bodyweight-squat-n-st-torso\"/><use href=\"#bodyweight-squat-n-st-thigh.r\"/><use href=\"#bodyweight-squat-n-st-kneecap.r\"/><use href=\"#bodyweight-squat-n-st-shank.r\"/><use href=\"#bodyweight-squat-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-n-g0-head\"/><use href=\"#bodyweight-squat-n-g0-torso\"/><use href=\"#bodyweight-squat-n-g0-thigh.r\"/><use href=\"#bodyweight-squat-n-g0-kneecap.r\"/><use href=\"#bodyweight-squat-n-g0-shank.r\"/><use href=\"#bodyweight-squat-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-n-g0-head\"/><use href=\"#bodyweight-squat-n-g0-torso\"/><use href=\"#bodyweight-squat-n-g0-thigh.r\"/><use href=\"#bodyweight-squat-n-g0-kneecap.r\"/><use href=\"#bodyweight-squat-n-g0-shank.r\"/><use href=\"#bodyweight-squat-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-n-g1-head\"/><use href=\"#bodyweight-squat-n-g1-torso\"/><use href=\"#bodyweight-squat-n-g1-thigh.r\"/><use href=\"#bodyweight-squat-n-g1-kneecap.r\"/><use href=\"#bodyweight-squat-n-g1-shank.r\"/><use href=\"#bodyweight-squat-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-n-g1-head\"/><use href=\"#bodyweight-squat-n-g1-torso\"/><use href=\"#bodyweight-squat-n-g1-thigh.r\"/><use href=\"#bodyweight-squat-n-g1-kneecap.r\"/><use href=\"#bodyweight-squat-n-g1-shank.r\"/><use href=\"#bodyweight-squat-n-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-n-e-thigh.l\"/><use href=\"#bodyweight-squat-n-e-kneecap.l\"/><use href=\"#bodyweight-squat-n-e-shank.l\"/><use href=\"#bodyweight-squat-n-e-foot.l\"/><use href=\"#bodyweight-squat-n-e-shcap.l\"/><use href=\"#bodyweight-squat-n-e-upper.l\"/><use href=\"#bodyweight-squat-n-e-elbowcap.l\"/><use href=\"#bodyweight-squat-n-e-fore.l\"/><use href=\"#bodyweight-squat-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-n-e-thigh.l\"/><use href=\"#bodyweight-squat-n-e-kneecap.l\"/><use href=\"#bodyweight-squat-n-e-shank.l\"/><use href=\"#bodyweight-squat-n-e-foot.l\"/><use href=\"#bodyweight-squat-n-e-shcap.l\"/><use href=\"#bodyweight-squat-n-e-upper.l\"/><use href=\"#bodyweight-squat-n-e-elbowcap.l\"/><use href=\"#bodyweight-squat-n-e-fore.l\"/><use href=\"#bodyweight-squat-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-n-e-head\"/><use href=\"#bodyweight-squat-n-e-torso\"/><use href=\"#bodyweight-squat-n-e-thigh.r\"/><use href=\"#bodyweight-squat-n-e-kneecap.r\"/><use href=\"#bodyweight-squat-n-e-shank.r\"/><use href=\"#bodyweight-squat-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-n-e-head\"/><use href=\"#bodyweight-squat-n-e-torso\"/><use href=\"#bodyweight-squat-n-e-thigh.r\"/><use href=\"#bodyweight-squat-n-e-kneecap.r\"/><use href=\"#bodyweight-squat-n-e-shank.r\"/><use href=\"#bodyweight-squat-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-n-e-shcap.r\"/><use href=\"#bodyweight-squat-n-e-upper.r\"/><use href=\"#bodyweight-squat-n-e-elbowcap.r\"/><use href=\"#bodyweight-squat-n-e-fore.r\"/><use href=\"#bodyweight-squat-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-n-e-shcap.r\"/><use href=\"#bodyweight-squat-n-e-upper.r\"/><use href=\"#bodyweight-squat-n-e-elbowcap.r\"/><use href=\"#bodyweight-squat-n-e-fore.r\"/><use href=\"#bodyweight-squat-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"203.33\" cy=\"225.7\" r=\"2.25\"/><circle class=\"joint\" cx=\"250.94\" cy=\"225.7\" r=\"2.25\"/><circle class=\"joint\" cx=\"162.28\" cy=\"280.13\" r=\"2.25\"/><circle class=\"joint\" cx=\"224.05\" cy=\"280.13\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#D20_!A1w.F1xxB1KXF122100102002011020021120000010Wc1000201102201000012210002011022010002101000210101100000200200000111010020000010010121000000001200020020000000001110100000200100000010101002002000000002101010000022000000001010100\"/><path class=\"arrow\" d=\"~M_*vA_V1LO8xG1LYJ1US1Z\"/></g><path class=\"leader\" d=\"M144.1 270.47L121.8 232H111.8\"/><circle class=\"anchor\" cx=\"144.1\" cy=\"270.47\" r=\"1.5\"/><path class=\"leader\" d=\"M224.05 280.13L239 308H249\"/><circle class=\"anchor\" cx=\"224.05\" cy=\"280.13\" r=\"1.5\"/><path class=\"leader\" d=\"M178.85 339L170.82 323H160.82\"/><circle class=\"anchor\" cx=\"178.85\" cy=\"339\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"bodyweight-squat-n-hips\" data-key=\"hips\" data-cue=\"Start by moving your hips back, then down.\" class=\"plate-callout\" style=\"left:11.17%;top:58.66%\" aria-pressed=\"true\">Hips back</button><button type=\"button\" id=\"bodyweight-squat-n-shin\" data-key=\"shin\" data-cue=\"At the bottom, keep your shins and torso parallel.\" class=\"plate-callout two\" style=\"left:68.16%;top:79.89%\" aria-pressed=\"false\">Shin parallel<br>torso</button><button type=\"button\" id=\"bodyweight-squat-n-heels\" data-key=\"heels\" data-cue=\"Keep your heels flat, down and up.\" class=\"plate-callout\" style=\"left:20.67%;top:84.08%\" aria-pressed=\"false\">Heels down</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"bodyweight-squat-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"bodyweight-squat-m-st-head\" d=\"^0\"/><path id=\"bodyweight-squat-m-st-torso\" d=\"^1\"/><path id=\"bodyweight-squat-m-st-thigh.r\" d=\"^2\"/><path id=\"bodyweight-squat-m-st-kneecap.r\" d=\"^3\"/><path id=\"bodyweight-squat-m-st-shank.r\" d=\"^4\"/><path id=\"bodyweight-squat-m-st-foot.r\" d=\"^5\"/><path id=\"bodyweight-squat-m-g0-head\" d=\"^6\"/><path id=\"bodyweight-squat-m-g0-torso\" d=\"^7\"/><path id=\"bodyweight-squat-m-g0-thigh.r\" d=\"^8\"/><path id=\"bodyweight-squat-m-g0-kneecap.r\" d=\"^9\"/><path id=\"bodyweight-squat-m-g0-shank.r\" d=\"^10\"/><path id=\"bodyweight-squat-m-g0-foot.r\" d=\"^11\"/><path id=\"bodyweight-squat-m-g1-head\" d=\"^12\"/><path id=\"bodyweight-squat-m-g1-torso\" d=\"^13\"/><path id=\"bodyweight-squat-m-g1-thigh.r\" d=\"^14\"/><path id=\"bodyweight-squat-m-g1-kneecap.r\" d=\"^15\"/><path id=\"bodyweight-squat-m-g1-shank.r\" d=\"^16\"/><path id=\"bodyweight-squat-m-g1-foot.r\" d=\"^17\"/><path id=\"bodyweight-squat-m-e-thigh.l\" d=\"^18\"/><path id=\"bodyweight-squat-m-e-kneecap.l\" d=\"^19\"/><path id=\"bodyweight-squat-m-e-shank.l\" d=\"^20\"/><path id=\"bodyweight-squat-m-e-foot.l\" d=\"^21\"/><path id=\"bodyweight-squat-m-e-shcap.l\" d=\"^22\"/><path id=\"bodyweight-squat-m-e-upper.l\" d=\"^23\"/><path id=\"bodyweight-squat-m-e-elbowcap.l\" d=\"^24\"/><path id=\"bodyweight-squat-m-e-fore.l\" d=\"^25\"/><path id=\"bodyweight-squat-m-e-fist.l\" d=\"^26\"/><path id=\"bodyweight-squat-m-e-head\" d=\"^27\"/><path id=\"bodyweight-squat-m-e-torso\" d=\"^28\"/><path id=\"bodyweight-squat-m-e-thigh.r\" d=\"^18\"/><path id=\"bodyweight-squat-m-e-kneecap.r\" d=\"^19\"/><path id=\"bodyweight-squat-m-e-shank.r\" d=\"^20\"/><path id=\"bodyweight-squat-m-e-foot.r\" d=\"^21\"/><path id=\"bodyweight-squat-m-e-shcap.r\" d=\"^22\"/><path id=\"bodyweight-squat-m-e-upper.r\" d=\"^23\"/><path id=\"bodyweight-squat-m-e-elbowcap.r\" d=\"^24\"/><path id=\"bodyweight-squat-m-e-fore.r\" d=\"^25\"/><path id=\"bodyweight-squat-m-e-fist.r\" d=\"^26\"/><path id=\"bodyweight-squat-m-m-head\" d=\"~#w12_!K1FNx1VOJ1EUw1Ko_bIlU2K9V6T4N3.1x9.3Gdz9.qW8RaY1R9BiG6!oE3FnN1Si(9!cNl*7Sh0000001001002020000002010100021101000010000100000200002000001000\"/><path id=\"bodyweight-squat-m-m-torso\" d=\"~#_12D*H1YKB1TVI1zBA1R2TkKeR5R4PmS3wb3SkH4_3HbGlIa-hGdK3yg!4_kF6PrvNo-4H9G5D2-hz3GJ1_5.sE8e*4H2Y5ScK2D8)4BeOh-3*hHcF6K3F4K5)4ylx-2U210000012100000002210000101000021011210220000000100021012101000000000000001000010000020002000202000001021010002200200\"/><path id=\"bodyweight-squat-m-m-thigh.l\" d=\"~#F12yEx1FXX1XYvTTX1Vb05D1S*1J6V6z7I3G3-S1XaXk-f*jB3VoP8RT1V5G4y2O8W4J!1Fd8E1zbT3Ih_s(A1DsPz1U5_I1zf00000001010001000000000002000012101010000010000000120002000200100002200020000000\"/><path id=\"bodyweight-squat-m-m-kneecap.l\" d=\"~~YzJ1WFX1_J10\"/><path id=\"bodyweight-squat-m-m-shank.l\" d=\"~#F12FRJ1JDW1IWK1RGV1!9R6qs.H1WK1_9pW4hPN1OO1(eX3(8x8y5RePT1*G1y1T4Y1T9KR1ND1rtP7E9xh-1zr!6xgSeG9Nq00000001100010121010000000101200201010002002000200010101010120000000000101000000\"/><path id=\"bodyweight-squat-m-m-foot.l\" d=\"~#o2(-z1DF(1GPA1TI*1!bH5Ji.4!sKjPX2wcXG2Vh*z1GeGnx4BG1E2V8ReYtz6)pNl010101000000010022000000000001000100010010010101\"/><path id=\"bodyweight-squat-m-m-shcap.l\" d=\"~~YzF1FXH1wP10\"/><path id=\"bodyweight-squat-m-m-upper.l\" d=\"~#F12YTG1FEJ1)OF1GDJ1)8d29SO1K2*5x3*2R1RD1V5VixaOg0ViyaRD1Y5*2N1*5D3SO1H22c)8evDgPpYdPm0PpXd20001000000101020001211012200000000020101021010000010102001000200000000200000000\"/><path id=\"bodyweight-squat-m-m-elbowcap.l\" d=\"~~D_R1FXH1Dz10\"/><path id=\"bodyweight-squat-m-m-fore.l\" d=\"~#F12SwT1(.I1IAS1K.I1Ian_1t(H1E7T9X2K2I1*w1N2GdX5Bbw1zc(7.w1H3z2_1)8J4PI19w2ixaU2myaJk_8FhO1Pizc00220000001000000100001011000100000000000001200010001001210000101000120200100200\"/><path id=\"bodyweight-squat-m-m-fist.l\" d=\"~~FV.1w!G1ww10\"/><path id=\"bodyweight-squat-m-m-thigh.r\" d=\"^39\"/><path id=\"bodyweight-squat-m-m-kneecap.r\" d=\"^40\"/><path id=\"bodyweight-squat-m-m-shank.r\" d=\"^41\"/><path id=\"bodyweight-squat-m-m-foot.r\" d=\"^42\"/><path id=\"bodyweight-squat-m-m-shcap.r\" d=\"^43\"/><path id=\"bodyweight-squat-m-m-upper.r\" d=\"^44\"/><path id=\"bodyweight-squat-m-m-elbowcap.r\" d=\"^45\"/><path id=\"bodyweight-squat-m-m-fore.r\" d=\"^46\"/><path id=\"bodyweight-squat-m-m-fist.r\" d=\"^47\"/><path id=\"bodyweight-squat-m-mo-0\" d=\"^27\"/><path id=\"bodyweight-squat-m-mo-1\" d=\"^28\"/><path id=\"bodyweight-squat-m-mo-2\" d=\"^18\"/><path id=\"bodyweight-squat-m-mo-3\" d=\"^19\"/><path id=\"bodyweight-squat-m-mo-4\" d=\"^20\"/><path id=\"bodyweight-squat-m-mo-5\" d=\"^21\"/><path id=\"bodyweight-squat-m-mo-6\" d=\"^22\"/><path id=\"bodyweight-squat-m-mo-7\" d=\"^23\"/><path id=\"bodyweight-squat-m-mo-8\" d=\"^24\"/><path id=\"bodyweight-squat-m-mo-9\" d=\"^25\"/><path id=\"bodyweight-squat-m-mo-10\" d=\"^26\"/><path id=\"bodyweight-squat-m-mo-11\" d=\"^18\"/><path id=\"bodyweight-squat-m-mo-12\" d=\"^19\"/><path id=\"bodyweight-squat-m-mo-13\" d=\"^20\"/><path id=\"bodyweight-squat-m-mo-14\" d=\"^21\"/><path id=\"bodyweight-squat-m-mo-15\" d=\"^22\"/><path id=\"bodyweight-squat-m-mo-16\" d=\"^23\"/><path id=\"bodyweight-squat-m-mo-17\" d=\"^24\"/><path id=\"bodyweight-squat-m-mo-18\" d=\"^25\"/><path id=\"bodyweight-squat-m-mo-19\" d=\"^26\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#bodyweight-squat-m-dots)\"/>\n  <path class=\"floorline\" d=\"^31\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-m-st-head\"/><use href=\"#bodyweight-squat-m-st-torso\"/><use href=\"#bodyweight-squat-m-st-thigh.r\"/><use href=\"#bodyweight-squat-m-st-kneecap.r\"/><use href=\"#bodyweight-squat-m-st-shank.r\"/><use href=\"#bodyweight-squat-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-m-st-head\"/><use href=\"#bodyweight-squat-m-st-torso\"/><use href=\"#bodyweight-squat-m-st-thigh.r\"/><use href=\"#bodyweight-squat-m-st-kneecap.r\"/><use href=\"#bodyweight-squat-m-st-shank.r\"/><use href=\"#bodyweight-squat-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-m-g0-head\"/><use href=\"#bodyweight-squat-m-g0-torso\"/><use href=\"#bodyweight-squat-m-g0-thigh.r\"/><use href=\"#bodyweight-squat-m-g0-kneecap.r\"/><use href=\"#bodyweight-squat-m-g0-shank.r\"/><use href=\"#bodyweight-squat-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-m-g0-head\"/><use href=\"#bodyweight-squat-m-g0-torso\"/><use href=\"#bodyweight-squat-m-g0-thigh.r\"/><use href=\"#bodyweight-squat-m-g0-kneecap.r\"/><use href=\"#bodyweight-squat-m-g0-shank.r\"/><use href=\"#bodyweight-squat-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-m-g1-head\"/><use href=\"#bodyweight-squat-m-g1-torso\"/><use href=\"#bodyweight-squat-m-g1-thigh.r\"/><use href=\"#bodyweight-squat-m-g1-kneecap.r\"/><use href=\"#bodyweight-squat-m-g1-shank.r\"/><use href=\"#bodyweight-squat-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-m-g1-head\"/><use href=\"#bodyweight-squat-m-g1-torso\"/><use href=\"#bodyweight-squat-m-g1-thigh.r\"/><use href=\"#bodyweight-squat-m-g1-kneecap.r\"/><use href=\"#bodyweight-squat-m-g1-shank.r\"/><use href=\"#bodyweight-squat-m-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-m-e-thigh.l\"/><use href=\"#bodyweight-squat-m-e-kneecap.l\"/><use href=\"#bodyweight-squat-m-e-shank.l\"/><use href=\"#bodyweight-squat-m-e-foot.l\"/><use href=\"#bodyweight-squat-m-e-shcap.l\"/><use href=\"#bodyweight-squat-m-e-upper.l\"/><use href=\"#bodyweight-squat-m-e-elbowcap.l\"/><use href=\"#bodyweight-squat-m-e-fore.l\"/><use href=\"#bodyweight-squat-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-m-e-thigh.l\"/><use href=\"#bodyweight-squat-m-e-kneecap.l\"/><use href=\"#bodyweight-squat-m-e-shank.l\"/><use href=\"#bodyweight-squat-m-e-foot.l\"/><use href=\"#bodyweight-squat-m-e-shcap.l\"/><use href=\"#bodyweight-squat-m-e-upper.l\"/><use href=\"#bodyweight-squat-m-e-elbowcap.l\"/><use href=\"#bodyweight-squat-m-e-fore.l\"/><use href=\"#bodyweight-squat-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-m-e-head\"/><use href=\"#bodyweight-squat-m-e-torso\"/><use href=\"#bodyweight-squat-m-e-thigh.r\"/><use href=\"#bodyweight-squat-m-e-kneecap.r\"/><use href=\"#bodyweight-squat-m-e-shank.r\"/><use href=\"#bodyweight-squat-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-m-e-head\"/><use href=\"#bodyweight-squat-m-e-torso\"/><use href=\"#bodyweight-squat-m-e-thigh.r\"/><use href=\"#bodyweight-squat-m-e-kneecap.r\"/><use href=\"#bodyweight-squat-m-e-shank.r\"/><use href=\"#bodyweight-squat-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-m-e-shcap.r\"/><use href=\"#bodyweight-squat-m-e-upper.r\"/><use href=\"#bodyweight-squat-m-e-elbowcap.r\"/><use href=\"#bodyweight-squat-m-e-fore.r\"/><use href=\"#bodyweight-squat-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-m-e-shcap.r\"/><use href=\"#bodyweight-squat-m-e-upper.r\"/><use href=\"#bodyweight-squat-m-e-elbowcap.r\"/><use href=\"#bodyweight-squat-m-e-fore.r\"/><use href=\"#bodyweight-squat-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"203.33\" cy=\"225.7\" r=\"2.25\"/><circle class=\"joint\" cx=\"250.94\" cy=\"225.7\" r=\"2.25\"/><circle class=\"joint\" cx=\"162.28\" cy=\"280.13\" r=\"2.25\"/><circle class=\"joint\" cx=\"224.05\" cy=\"280.13\" r=\"2.25\"/></g><mask id=\"bodyweight-squat-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#bodyweight-squat-m-m-head\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-torso\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-thigh.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-shank.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-foot.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-shcap.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-upper.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-fore.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-fist.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-thigh.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-shank.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-foot.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-shcap.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-upper.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-fore.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-m-fist.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#bodyweight-squat-m-mmask)\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-m-m-head\"/><use href=\"#bodyweight-squat-m-m-torso\"/><use href=\"#bodyweight-squat-m-m-thigh.l\"/><use href=\"#bodyweight-squat-m-m-kneecap.l\"/><use href=\"#bodyweight-squat-m-m-shank.l\"/><use href=\"#bodyweight-squat-m-m-foot.l\"/><use href=\"#bodyweight-squat-m-m-shcap.l\"/><use href=\"#bodyweight-squat-m-m-upper.l\"/><use href=\"#bodyweight-squat-m-m-elbowcap.l\"/><use href=\"#bodyweight-squat-m-m-fore.l\"/><use href=\"#bodyweight-squat-m-m-fist.l\"/><use href=\"#bodyweight-squat-m-m-thigh.r\"/><use href=\"#bodyweight-squat-m-m-kneecap.r\"/><use href=\"#bodyweight-squat-m-m-shank.r\"/><use href=\"#bodyweight-squat-m-m-foot.r\"/><use href=\"#bodyweight-squat-m-m-shcap.r\"/><use href=\"#bodyweight-squat-m-m-upper.r\"/><use href=\"#bodyweight-squat-m-m-elbowcap.r\"/><use href=\"#bodyweight-squat-m-m-fore.r\"/><use href=\"#bodyweight-squat-m-m-fist.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MNwz1YDx2LPx5ws\"/><path class=\"m-line\" d=\"~MSPK1WFX1L0y(a\"/><path class=\"leader m\" d=\"M179.27 333.88L153.6 322H143.6\"/><path class=\"leader m\" d=\"M205.11 338.36L227 323H237\"/></g>\n<g class=\"plate-zoom\" data-view=\"mistake\" data-k=\"2.5\" data-c=\"94 220\" data-src=\"179.06 336.44\"><defs><clipPath id=\"bodyweight-squat-m-zclip\"><circle cx=\"94\" cy=\"220\" r=\"52\"/></clipPath></defs><circle class=\"pz-src\" cx=\"179.06\" cy=\"336.44\" r=\"20.8\"/><path class=\"pz-link\" d=\"~MNSw1YK(1LEE8GFb\"/><circle class=\"pz-bg\" cx=\"94\" cy=\"220\" r=\"52\"/><g class=\"pz-in\" clip-path=\"url(#bodyweight-squat-m-zclip)\">\n  <defs><pattern id=\"bodyweight-squat-m-z-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"bodyweight-squat-m-z-st-head\" d=\"M147.27 -412.13C153.02 -411.56 162.17 -410.46 167.64 -407.76C173.12 -405.05 177.27 -400.46 180.14 -395.91C183.01 -391.35 184.02 -385.35 184.85 -380.42C185.68 -375.49 185.26 -371.34 185.12 -366.33C184.99 -361.31 184.73 -355.13 184.07 -350.35C183.41 -345.56 182.65 -341.1 181.17 -337.62C179.69 -334.14 178.32 -330.65 175.2 -329.45C172.07 -328.25 166.33 -329.26 162.42 -330.43C158.5 -331.6 155.36 -333.81 151.69 -336.47C148.03 -339.13 145.46 -343.04 140.43 -346.37C135.39 -349.7 126.29 -352.39 121.48 -356.47C116.68 -360.54 113.4 -365.64 111.62 -370.81C109.83 -375.98 109.67 -382.17 110.77 -387.48C111.87 -392.79 114.48 -398.69 118.21 -402.65C121.94 -406.61 128.32 -409.64 133.16 -411.22C138 -412.8 141.52 -412.71 147.27 -412.13Z\"/><path id=\"bodyweight-squat-m-z-st-torso\" d=\"M126.48 -351.86C120.01 -348.93 124.24 -339.05 122.16 -333.4C120.08 -327.76 117.01 -323.12 114.02 -317.98C111.04 -312.85 106.92 -308.93 104.23 -302.57C101.54 -296.21 99.4 -287.87 97.91 -279.83C96.42 -271.79 95.37 -263.94 95.29 -254.33C95.22 -244.72 96.31 -232.91 97.45 -222.17C98.6 -211.43 100.94 -199.02 102.17 -189.88C103.4 -180.74 105.41 -174.22 104.83 -167.31C104.26 -160.4 101.62 -154.98 98.71 -148.4C95.81 -141.83 90.08 -134.43 87.38 -127.85C84.69 -121.26 82.75 -114.84 82.54 -108.87C82.34 -102.9 83.4 -96.65 86.15 -92.02C88.89 -87.39 93.5 -83.62 99.03 -81.09C104.56 -78.56 112.2 -77.62 119.32 -76.82C126.43 -76.02 134.73 -75.38 141.72 -76.29C148.71 -77.21 156.44 -77.87 161.26 -82.32C166.09 -86.76 168.19 -94.24 170.68 -102.97C173.16 -111.71 174.78 -124.12 176.19 -134.73C177.6 -145.34 178.79 -155.96 179.14 -166.62C179.48 -177.28 177.76 -189.12 178.26 -198.71C178.76 -208.3 180.67 -216.21 182.15 -224.14C183.64 -232.07 186.32 -238.34 187.16 -246.31C188.01 -254.28 188.3 -263.88 187.22 -271.94C186.15 -280.01 183.39 -288.49 180.73 -294.71C178.06 -300.94 174 -304.82 171.24 -309.31C168.47 -313.8 165.69 -316.84 164.14 -321.64C162.6 -326.44 162.5 -333.24 161.98 -338.12C161.46 -343.01 166.95 -348.66 161.03 -350.95C155.12 -353.24 132.96 -354.78 126.48 -351.86Z\"/><path id=\"bodyweight-squat-m-z-st-thigh.r\" d=\"M103.24 -112.46C101.4 -105.47 103.86 -99.11 104.04 -93.62C104.21 -88.13 104.28 -84.2 104.28 -79.5C104.28 -74.8 104.04 -74.28 104.03 -65.4C104.02 -56.52 103.74 -38.76 104.22 -26.2C104.7 -13.64 105.82 -1.84 106.91 9.96C108.01 21.76 109.18 36.58 110.77 44.6C112.35 52.62 113.67 55.07 116.44 58.06C119.21 61.05 123.68 62.38 127.38 62.52C131.08 62.66 135.65 61.67 138.64 58.9C141.62 56.13 143.12 53.78 145.3 45.9C147.49 38.03 149.78 23.34 151.76 11.65C153.73 -0.03 155.74 -11.71 157.17 -24.2C158.59 -36.69 159.65 -54.42 160.31 -63.28C160.97 -72.14 160.77 -72.67 161.12 -77.36C161.47 -82.05 161.84 -85.95 162.43 -91.42C163.01 -96.88 165.95 -103.04 164.64 -110.15C163.33 -117.26 159.48 -128.77 154.56 -134.08C149.64 -139.39 141.68 -141.76 135.1 -142.01C128.52 -142.25 120.4 -140.49 115.1 -135.57C109.79 -130.64 105.09 -119.46 103.24 -112.46Z\"/><path id=\"bodyweight-squat-m-z-st-kneecap.r\" d=\"~~FPl__8wP30\"/><path id=\"bodyweight-squat-m-z-st-shank.r\" d=\"~#F12AKlPJ8xBmOY4F8Xsw3cE7Y*4DhXhw8.8JbGE5JmOvW3Vt*dzA1!t.A5R5VaIcGlOvW_4x3bt.tGz1wpRF1D-1T6!V1FpHx200002010000000111000100121002200001011020001010002000000000001000000000020000010\"/><path id=\"bodyweight-squat-m-z-st-foot.r\" d=\"~#o2YwjATA1XJkEzy1Nvy8PI1xkS)1..1U!6)7*!5)bK(2*jx.10OD3(bGr*vyE2)rRX1ww2111000010100021002000002000000010100001110200201\"/><path id=\"bodyweight-squat-m-z-e-thigh.l\" d=\"~#F12HBayOlOR6KYl*sP40A3N_4T8Ij)eR9.6Vx4G6I-1.uTS12I-1YuVx4N6R9_6Ij(eN_4W80x3*sT4EvyN2AD3YW1!-22AD3.W100000000020200100100000012000002000000100001010110000000000000000000000002000002\"/><path id=\"bodyweight-squat-m-z-e-kneecap.l\" d=\"~~N_A1yOfwP30\"/><path id=\"bodyweight-squat-m-z-e-shank.l\" d=\"~#F12(OB1SDdVwF1XPa(lxkJ2!1GY2!x4!n*5PbI3Sw3TE4Sz1BfYiGnw7xD1DO3*.3o.bkVoII3WS3K2)1YeXp-H1H2Iw2Nr)x1NH1Vc_A200000000110000000100010000000000200101010000000021001001100002220020000010000012\"/><path id=\"bodyweight-squat-m-z-e-foot.l\" d=\"~#o2ywjwTA1KIk)yy1Nvw8JI1)jA)1).1S!6)7)!5)bT(2)j)_10OD3wcOr)v!D2)rBX1ww2001010000020000000200010002000001000001000000000\"/><path id=\"bodyweight-squat-m-z-e-shcap.l\" d=\"M135.48 -56.85a19.2 19.2 0 1 0 38.4 0a19.2 19.2 0 1 0 -38.4 0Z\"/><path id=\"bodyweight-squat-m-z-e-upper.l\" d=\"M154.68 -37.65C159.51 -36.44 164.79 -37.37 168.96 -37.27C173.13 -37.18 176.1 -37.12 179.68 -37.08C183.25 -37.04 183.64 -36.87 190.39 -37.01C197.14 -37.15 210.63 -37.39 220.15 -37.89C229.67 -38.4 238.6 -39.23 247.53 -40.04C256.46 -40.85 267.56 -41.48 273.72 -42.77C279.88 -44.06 282.16 -45.45 284.51 -47.8C286.85 -50.15 287.8 -53.83 287.8 -56.85C287.8 -59.87 286.85 -63.55 284.51 -65.9C282.16 -68.25 279.88 -69.64 273.72 -70.93C267.56 -72.22 256.46 -72.85 247.53 -73.66C238.6 -74.47 229.67 -75.3 220.15 -75.81C210.63 -76.31 197.14 -76.56 190.39 -76.69C183.64 -76.83 183.25 -76.67 179.68 -76.62C176.1 -76.58 173.13 -76.52 168.96 -76.43C164.79 -76.33 159.51 -77.26 154.68 -76.05C149.84 -74.85 143.17 -72.39 139.97 -69.19C136.77 -65.99 135.48 -60.96 135.48 -56.85C135.48 -52.74 136.77 -47.71 139.97 -44.51C143.17 -41.31 149.84 -38.86 154.68 -37.65Z\"/><path id=\"bodyweight-squat-m-z-e-elbowcap.l\" d=\"M259.64 -56.85a14.08 14.08 0 1 0 28.16 0a14.08 14.08 0 1 0 -28.16 0Z\"/><path id=\"bodyweight-squat-m-z-e-fore.l\" d=\"M275 -42.19C278.83 -41.44 283.21 -41.99 286.28 -41.97C289.34 -41.95 290.9 -41.98 293.4 -42.08C295.89 -42.18 295.76 -41.91 301.23 -42.55C306.71 -43.2 318.56 -44.63 326.26 -45.93C333.97 -47.24 340.55 -48.82 347.45 -50.4C354.34 -51.98 363.11 -53.92 367.64 -55.43C372.18 -56.95 373.22 -57.75 374.67 -59.49C376.13 -61.22 376.55 -63.78 376.37 -65.83C376.19 -67.88 375.33 -70.33 373.6 -71.78C371.86 -73.24 370.7 -73.85 365.97 -74.56C361.24 -75.26 352.27 -75.64 345.21 -76.01C338.14 -76.37 331.38 -76.77 323.57 -76.72C315.76 -76.68 303.84 -76.03 298.33 -75.71C292.83 -75.39 293 -75.15 290.53 -74.82C288.06 -74.48 286.52 -74.23 283.5 -73.68C280.49 -73.13 276.08 -72.91 272.44 -71.51C268.8 -70.12 263.89 -67.95 261.66 -65.29C259.43 -62.64 258.78 -58.71 259.06 -55.57C259.33 -52.43 260.65 -48.67 263.31 -46.44C265.97 -44.21 271.17 -42.93 275 -42.19Z\"/><path id=\"bodyweight-squat-m-z-e-fist.l\" d=\"M385.68 -67.77a12.8 12.8 0 1 0 25.6 0a12.8 12.8 0 1 0 -25.6 0Z\"/><path id=\"bodyweight-squat-m-z-e-head\" d=\"M209.49 -175.66C214.79 -173.35 223.16 -169.5 227.55 -165.25C231.93 -161 234.48 -155.36 235.81 -150.14C237.15 -144.92 236.27 -138.9 235.56 -133.95C234.84 -129 233.16 -125.18 231.5 -120.45C229.84 -115.72 227.69 -109.92 225.59 -105.57C223.5 -101.22 221.41 -97.2 218.94 -94.34C216.46 -91.48 214.09 -88.58 210.75 -88.4C207.41 -88.21 202.25 -90.92 198.88 -93.24C195.51 -95.55 193.2 -98.62 190.52 -102.28C187.85 -105.93 186.6 -110.44 182.83 -115.15C179.06 -119.87 171.22 -125.22 167.89 -130.57C164.57 -135.92 163.01 -141.78 162.89 -147.24C162.78 -152.71 164.53 -158.66 167.2 -163.37C169.87 -168.08 174.16 -172.91 178.93 -175.53C183.69 -178.16 190.69 -179.09 195.79 -179.11C200.88 -179.13 204.2 -177.97 209.49 -175.66Z\"/><path id=\"bodyweight-squat-m-z-e-torso\" d=\"M171.24 -124.64C164.18 -123.85 164.9 -112.44 161.47 -108.4C158.04 -104.36 155.22 -102.69 150.66 -100.39C146.1 -98.1 139.93 -98.06 134.1 -94.64C128.27 -91.22 121.6 -85.52 115.7 -79.85C109.8 -74.19 104.37 -68.43 98.7 -60.67C93.04 -52.91 87.09 -42.67 81.7 -33.29C76.32 -23.9 70.73 -12.57 66.38 -4.35C62.04 3.87 59.9 10.43 55.62 16.04C51.33 21.66 46.54 25.14 40.68 29.34C34.82 33.53 26.13 36.94 20.45 41.23C14.77 45.52 9.83 50.05 6.61 55.08C3.38 60.11 1.11 66.03 1.11 71.41C1.11 76.8 3.15 82.39 6.61 87.39C10.07 92.39 16.17 97.09 21.88 101.41C27.59 105.73 34.4 110.52 40.88 113.3C47.36 116.08 54.34 119.45 60.76 118.09C67.18 116.72 72.8 111.37 79.39 105.12C85.99 98.88 93.9 88.76 100.34 80.62C106.77 72.49 112.43 64.25 117.98 56.3C123.54 48.34 128.04 39.86 133.65 32.9C139.27 25.94 145.82 20.09 151.65 14.52C157.49 8.94 163.32 5.41 168.65 -0.57C173.98 -6.55 179.82 -14.18 183.65 -21.36C187.48 -28.54 190.19 -37.03 191.65 -43.64C193.12 -50.26 191.77 -55.01 192.46 -61.04C193.15 -67.06 194.41 -73.18 195.8 -79.79C197.19 -86.4 199.48 -95.13 200.82 -100.7C202.16 -106.27 208.78 -109.21 203.85 -113.2C198.92 -117.19 178.31 -125.44 171.24 -124.64Z\"/><path id=\"bodyweight-squat-m-z-e-thigh.r\" d=\"^59\"/><path id=\"bodyweight-squat-m-z-e-kneecap.r\" d=\"^60\"/><path id=\"bodyweight-squat-m-z-e-shank.r\" d=\"^61\"/><path id=\"bodyweight-squat-m-z-e-foot.r\" d=\"^62\"/><path id=\"bodyweight-squat-m-z-e-shcap.r\" d=\"^63\"/><path id=\"bodyweight-squat-m-z-e-upper.r\" d=\"^64\"/><path id=\"bodyweight-squat-m-z-e-elbowcap.r\" d=\"^65\"/><path id=\"bodyweight-squat-m-z-e-fore.r\" d=\"^66\"/><path id=\"bodyweight-squat-m-z-e-fist.r\" d=\"^67\"/><path id=\"bodyweight-squat-m-z-m-head\" d=\"M233.89 -193.01C239.18 -190.7 247.55 -186.86 251.94 -182.61C256.33 -178.35 258.87 -172.71 260.2 -167.5C261.54 -162.28 260.67 -156.25 259.95 -151.31C259.23 -146.36 257.55 -142.54 255.89 -137.81C254.23 -133.08 252.08 -127.28 249.99 -122.92C247.89 -118.57 245.8 -114.56 243.33 -111.69C240.86 -108.83 238.48 -105.93 235.14 -105.75C231.8 -105.57 226.64 -108.28 223.27 -110.59C219.9 -112.91 217.59 -115.98 214.92 -119.63C212.24 -123.28 211 -127.79 207.22 -132.5C203.45 -137.22 195.61 -142.57 192.29 -147.92C188.96 -153.27 187.4 -159.13 187.29 -164.6C187.17 -170.07 188.92 -176.01 191.59 -180.72C194.26 -185.44 198.56 -190.26 203.32 -192.89C208.08 -195.51 215.08 -196.45 220.18 -196.47C225.27 -196.49 228.59 -195.32 233.89 -193.01Z\"/><path id=\"bodyweight-squat-m-z-m-torso\" d=\"M195.63 -142C188.57 -141.2 189.29 -129.8 185.86 -125.76C182.43 -121.72 179.61 -120.04 175.05 -117.75C170.49 -115.46 164.32 -115.42 158.49 -111.99C152.66 -108.57 145.99 -102.87 140.09 -97.21C134.2 -91.55 128.76 -85.78 123.1 -78.02C117.43 -70.26 111.48 -60.03 106.09 -50.64C100.71 -41.25 95.12 -29.93 90.78 -21.7C86.43 -13.48 84.29 -6.93 80.01 -1.31C75.73 4.3 70.94 7.78 65.08 11.98C59.21 16.18 50.52 19.59 44.84 23.88C39.16 28.17 34.22 32.7 31 37.73C27.77 42.76 25.5 48.67 25.5 54.06C25.5 59.44 27.54 65.03 31 70.03C34.47 75.03 40.56 79.73 46.27 84.05C51.98 88.37 58.79 93.16 65.27 95.94C71.75 98.72 78.73 102.09 85.15 100.73C91.57 99.37 97.19 94.01 103.79 87.77C110.38 81.53 118.3 71.41 124.73 63.27C131.16 55.13 136.82 46.9 142.37 38.94C147.93 30.99 152.44 22.51 158.05 15.55C163.66 8.58 170.21 2.74 176.04 -2.84C181.88 -8.42 187.71 -11.95 193.04 -17.93C198.38 -23.9 204.21 -31.53 208.04 -38.71C211.88 -45.89 214.58 -54.38 216.05 -61C217.52 -67.61 216.16 -72.37 216.85 -78.39C217.54 -84.41 218.8 -90.53 220.19 -97.14C221.59 -103.75 223.87 -112.48 225.21 -118.05C226.56 -123.62 233.17 -126.56 228.24 -130.55C223.31 -134.54 202.7 -142.8 195.63 -142Z\"/><path id=\"bodyweight-squat-m-z-m-thigh.l\" d=\"~#F12H)dDwiKIaxXhGt3dy3_-4(fTg-hO8G8)(3.q.T1OE1.R1x8T*1Hl)w4EeVaF5KlWbDX4yx1ez3-r)8EI1wF2D!2JD2YY2DePK3.B100210001001011002111000100000221010020220012100000000001000220000100002001120000\"/><path id=\"bodyweight-squat-m-z-m-kneecap.l\" d=\"~~yEG1_.gwP30\"/><path id=\"bodyweight-squat-m-z-m-shank.l\" d=\"~#F12(FH1yDe-BK1z(bWoGgA2F2EI3FS3Soz2YbR1DU3OW3PB1K9ymBk!cKA1Yw4XF3U2TbH4BoT.3Dw3)1E2PiznKH1T4*z2AhzF1SA1Enyy210101200000012000001010022000000000000200100001010100000201001101000000000000000\"/><path id=\"bodyweight-squat-m-z-m-foot.l\" d=\"~#o2UNkPHy1TDm)yw1YtDdwN1EcAF2IP1Y_6YtIY5xJ1.-2*z1B_1xaxE3V5-lEA1SH2Of)w2WV1000111001000001001000020002000001002000200000000\"/><path id=\"bodyweight-squat-m-z-m-shcap.l\" d=\"M159.87 -74.2a19.2 19.2 0 1 0 38.4 0a19.2 19.2 0 1 0 -38.4 0Z\"/><path id=\"bodyweight-squat-m-z-m-upper.l\" d=\"M179.07 -55C183.9 -53.8 189.19 -54.72 193.35 -54.63C197.52 -54.53 200.5 -54.48 204.07 -54.43C207.64 -54.39 208.04 -54.23 214.78 -54.36C221.53 -54.5 235.02 -54.74 244.54 -55.25C254.07 -55.75 262.99 -56.58 271.92 -57.39C280.85 -58.21 291.95 -58.83 298.11 -60.12C304.27 -61.42 306.55 -62.81 308.9 -65.15C311.24 -67.5 312.19 -71.19 312.19 -74.2C312.19 -77.22 311.24 -80.91 308.9 -83.26C306.55 -85.6 304.27 -86.99 298.11 -88.29C291.95 -89.58 280.85 -90.2 271.92 -91.01C262.99 -91.83 254.07 -92.66 244.54 -93.16C235.02 -93.67 221.53 -93.91 214.78 -94.05C208.04 -94.18 207.64 -94.02 204.07 -93.98C200.5 -93.93 197.52 -93.88 193.35 -93.78C189.19 -93.69 183.9 -94.61 179.07 -93.41C174.24 -92.2 167.56 -89.75 164.36 -86.55C161.16 -83.35 159.87 -78.32 159.87 -74.2C159.87 -70.09 161.16 -65.06 164.36 -61.86C167.56 -58.66 174.24 -56.21 179.07 -55Z\"/><path id=\"bodyweight-squat-m-z-m-elbowcap.l\" d=\"M284.03 -74.2a14.08 14.08 0 1 0 28.16 0a14.08 14.08 0 1 0 -28.16 0Z\"/><path id=\"bodyweight-squat-m-z-m-fore.l\" d=\"M299.39 -59.54C303.22 -58.8 307.6 -59.34 310.67 -59.33C313.74 -59.31 315.3 -59.34 317.79 -59.43C320.28 -59.53 320.15 -59.27 325.63 -59.91C331.1 -60.55 342.95 -61.98 350.66 -63.29C358.36 -64.6 364.94 -66.17 371.84 -67.76C378.74 -69.34 387.5 -71.27 392.04 -72.79C396.57 -74.3 397.61 -75.11 399.06 -76.84C400.52 -78.58 400.94 -81.14 400.76 -83.19C400.58 -85.23 399.72 -87.68 397.99 -89.14C396.25 -90.59 395.09 -91.21 390.36 -91.91C385.63 -92.62 376.67 -93 369.6 -93.36C362.53 -93.72 355.78 -94.13 347.96 -94.08C340.15 -94.03 328.23 -93.38 322.73 -93.06C317.22 -92.74 317.4 -92.51 314.92 -92.17C312.45 -91.83 310.91 -91.59 307.9 -91.04C304.88 -90.49 300.47 -90.27 296.83 -88.87C293.19 -87.47 288.28 -85.31 286.05 -82.65C283.82 -79.99 283.17 -76.06 283.45 -72.92C283.72 -69.78 285.05 -66.03 287.7 -63.8C290.36 -61.57 295.57 -60.29 299.39 -59.54Z\"/><path id=\"bodyweight-squat-m-z-m-fist.l\" d=\"M410.07 -85.12a12.8 12.8 0 1 0 25.6 0a12.8 12.8 0 1 0 -25.6 0Z\"/><path id=\"bodyweight-squat-m-z-m-thigh.r\" d=\"^72\"/><path id=\"bodyweight-squat-m-z-m-kneecap.r\" d=\"^73\"/><path id=\"bodyweight-squat-m-z-m-shank.r\" d=\"^74\"/><path id=\"bodyweight-squat-m-z-m-foot.r\" d=\"^75\"/><path id=\"bodyweight-squat-m-z-m-shcap.r\" d=\"^76\"/><path id=\"bodyweight-squat-m-z-m-upper.r\" d=\"^77\"/><path id=\"bodyweight-squat-m-z-m-elbowcap.r\" d=\"^78\"/><path id=\"bodyweight-squat-m-z-m-fore.r\" d=\"^79\"/><path id=\"bodyweight-squat-m-z-m-fist.r\" d=\"^80\"/><path id=\"bodyweight-squat-m-z-mo-0\" d=\"^68\"/><path id=\"bodyweight-squat-m-z-mo-1\" d=\"^69\"/><path id=\"bodyweight-squat-m-z-mo-2\" d=\"^59\"/><path id=\"bodyweight-squat-m-z-mo-3\" d=\"^60\"/><path id=\"bodyweight-squat-m-z-mo-4\" d=\"^61\"/><path id=\"bodyweight-squat-m-z-mo-5\" d=\"^62\"/><path id=\"bodyweight-squat-m-z-mo-6\" d=\"^63\"/><path id=\"bodyweight-squat-m-z-mo-7\" d=\"^64\"/><path id=\"bodyweight-squat-m-z-mo-8\" d=\"^65\"/><path id=\"bodyweight-squat-m-z-mo-9\" d=\"^66\"/><path id=\"bodyweight-squat-m-z-mo-10\" d=\"^67\"/><path id=\"bodyweight-squat-m-z-mo-11\" d=\"^59\"/><path id=\"bodyweight-squat-m-z-mo-12\" d=\"^60\"/><path id=\"bodyweight-squat-m-z-mo-13\" d=\"^61\"/><path id=\"bodyweight-squat-m-z-mo-14\" d=\"^62\"/><path id=\"bodyweight-squat-m-z-mo-15\" d=\"^63\"/><path id=\"bodyweight-squat-m-z-mo-16\" d=\"^64\"/><path id=\"bodyweight-squat-m-z-mo-17\" d=\"^65\"/><path id=\"bodyweight-squat-m-z-mo-18\" d=\"^66\"/><path id=\"bodyweight-squat-m-z-mo-19\" d=\"^67\"/></defs>\n  \n  <path class=\"floorline\" d=\"M-137.94 226.9H410.65\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-m-z-st-head\"/><use href=\"#bodyweight-squat-m-z-st-torso\"/><use href=\"#bodyweight-squat-m-z-st-thigh.r\"/><use href=\"#bodyweight-squat-m-z-st-kneecap.r\"/><use href=\"#bodyweight-squat-m-z-st-shank.r\"/><use href=\"#bodyweight-squat-m-z-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-m-z-st-head\"/><use href=\"#bodyweight-squat-m-z-st-torso\"/><use href=\"#bodyweight-squat-m-z-st-thigh.r\"/><use href=\"#bodyweight-squat-m-z-st-kneecap.r\"/><use href=\"#bodyweight-squat-m-z-st-shank.r\"/><use href=\"#bodyweight-squat-m-z-st-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-m-z-e-thigh.l\"/><use href=\"#bodyweight-squat-m-z-e-kneecap.l\"/><use href=\"#bodyweight-squat-m-z-e-shank.l\"/><use href=\"#bodyweight-squat-m-z-e-foot.l\"/><use href=\"#bodyweight-squat-m-z-e-shcap.l\"/><use href=\"#bodyweight-squat-m-z-e-upper.l\"/><use href=\"#bodyweight-squat-m-z-e-elbowcap.l\"/><use href=\"#bodyweight-squat-m-z-e-fore.l\"/><use href=\"#bodyweight-squat-m-z-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-m-z-e-thigh.l\"/><use href=\"#bodyweight-squat-m-z-e-kneecap.l\"/><use href=\"#bodyweight-squat-m-z-e-shank.l\"/><use href=\"#bodyweight-squat-m-z-e-foot.l\"/><use href=\"#bodyweight-squat-m-z-e-shcap.l\"/><use href=\"#bodyweight-squat-m-z-e-upper.l\"/><use href=\"#bodyweight-squat-m-z-e-elbowcap.l\"/><use href=\"#bodyweight-squat-m-z-e-fore.l\"/><use href=\"#bodyweight-squat-m-z-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-m-z-e-head\"/><use href=\"#bodyweight-squat-m-z-e-torso\"/><use href=\"#bodyweight-squat-m-z-e-thigh.r\"/><use href=\"#bodyweight-squat-m-z-e-kneecap.r\"/><use href=\"#bodyweight-squat-m-z-e-shank.r\"/><use href=\"#bodyweight-squat-m-z-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-m-z-e-head\"/><use href=\"#bodyweight-squat-m-z-e-torso\"/><use href=\"#bodyweight-squat-m-z-e-thigh.r\"/><use href=\"#bodyweight-squat-m-z-e-kneecap.r\"/><use href=\"#bodyweight-squat-m-z-e-shank.r\"/><use href=\"#bodyweight-squat-m-z-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-m-z-e-shcap.r\"/><use href=\"#bodyweight-squat-m-z-e-upper.r\"/><use href=\"#bodyweight-squat-m-z-e-elbowcap.r\"/><use href=\"#bodyweight-squat-m-z-e-fore.r\"/><use href=\"#bodyweight-squat-m-z-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bodyweight-squat-m-z-e-shcap.r\"/><use href=\"#bodyweight-squat-m-z-e-upper.r\"/><use href=\"#bodyweight-squat-m-z-e-elbowcap.r\"/><use href=\"#bodyweight-squat-m-z-e-fore.r\"/><use href=\"#bodyweight-squat-m-z-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"154.68\" cy=\"-56.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"273.72\" cy=\"-56.85\" r=\"2.25\"/><circle class=\"joint\" cx=\"52.05\" cy=\"79.21\" r=\"2.25\"/><circle class=\"joint\" cx=\"206.48\" cy=\"79.21\" r=\"2.25\"/></g><mask id=\"bodyweight-squat-m-z-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#bodyweight-squat-m-z-m-head\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-torso\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-thigh.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-kneecap.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-shank.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-foot.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-shcap.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-upper.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-elbowcap.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-fore.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-fist.l\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-thigh.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-kneecap.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-shank.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-foot.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-shcap.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-upper.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-elbowcap.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-fore.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-m-fist.r\" fill=\"#000\"/><use href=\"#bodyweight-squat-m-z-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bodyweight-squat-m-z-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#bodyweight-squat-m-z-mmask)\"><g class=\"u-stroke\"><use href=\"#bodyweight-squat-m-z-m-head\"/><use href=\"#bodyweight-squat-m-z-m-torso\"/><use href=\"#bodyweight-squat-m-z-m-thigh.l\"/><use href=\"#bodyweight-squat-m-z-m-kneecap.l\"/><use href=\"#bodyweight-squat-m-z-m-shank.l\"/><use href=\"#bodyweight-squat-m-z-m-foot.l\"/><use href=\"#bodyweight-squat-m-z-m-shcap.l\"/><use href=\"#bodyweight-squat-m-z-m-upper.l\"/><use href=\"#bodyweight-squat-m-z-m-elbowcap.l\"/><use href=\"#bodyweight-squat-m-z-m-fore.l\"/><use href=\"#bodyweight-squat-m-z-m-fist.l\"/><use href=\"#bodyweight-squat-m-z-m-thigh.r\"/><use href=\"#bodyweight-squat-m-z-m-kneecap.r\"/><use href=\"#bodyweight-squat-m-z-m-shank.r\"/><use href=\"#bodyweight-squat-m-z-m-foot.r\"/><use href=\"#bodyweight-squat-m-z-m-shcap.r\"/><use href=\"#bodyweight-squat-m-z-m-upper.r\"/><use href=\"#bodyweight-squat-m-z-m-elbowcap.r\"/><use href=\"#bodyweight-squat-m-z-m-fore.r\"/><use href=\"#bodyweight-squat-m-z-m-fist.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~M_NiwXG1L_TcwD2\"/><path class=\"m-line\" d=\"~MyXJ1_.gL0DIr\"/></g>\n</g><circle class=\"pz-ring\" cx=\"94\" cy=\"220\" r=\"52\"/></g></svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"bodyweight-squat-m-heels\" data-key=\"heels\" data-cue=\"The heels come off the floor at the bottom.\" class=\"plate-callout m\" style=\"left:19.55%;top:83.8%\" aria-pressed=\"true\">Heels lift</button><button type=\"button\" id=\"bodyweight-squat-m-toes\" data-key=\"toes\" data-cue=\"The weight rolls forward onto the toes.\" class=\"plate-callout two m\" style=\"left:64.8%;top:84.08%\" aria-pressed=\"false\">Weight on<br>toes</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "hips",
        cues: [{ key: "hips", cue: "Start by moving your hips back, then down." }, { key: "shin", cue: "At the bottom, keep your shins and torso parallel." }, { key: "heels", cue: "Keep your heels flat, down and up." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "heels",
        cues: [{ key: "heels", cue: "The heels come off the floor at the bottom." }, { key: "toes", cue: "The weight rolls forward onto the toes." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Heels lift</b><span>The heels come off the floor at the bottom.</span></li><li><b>Weight on toes</b><span>The weight rolls forward onto the toes.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower, drive up\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>&nbsp;</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Drive up</b><span>&nbsp;</span></div></div></div>",
      alt: "Bodyweight squat, side view. Standing with the feet slightly wider than the hips and the arms by the sides, the lifter moves the hips back and down until the thighs are about parallel, shins and torso parallel, heels flat.",
      mistakeAlt: "Bodyweight Squat: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP: the card archetype.hand is none; it gives no thumb, contact or wrist claim."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Feet slightly wider than hip width, toes slightly out.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bwsquat"
        ],
        "note": "b1"
      }
    },
    {
      "kind": "brace",
      "text": "Shoulders down and back, brace, chest up.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bwsquat"
        ],
        "note": "b1, b2"
      }
    },
    {
      "kind": "position",
      "text": "Hips back then down. Knees over the second toe, ankles steady.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bwsquat"
        ],
        "note": "b3, b5"
      }
    },
    {
      "kind": "position",
      "text": "Lower to thighs about parallel. Knees may pass the toes slightly.",
      "zoom": "bottom",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "ace-bwsquat",
          "fry-2003"
        ],
        "note": "b4, b8"
      }
    },
    {
      "kind": "finish",
      "text": "Breathe out, push the feet down, hips and chest rise together.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bwsquat"
        ],
        "note": "b7"
      }
    }
  ],
  posture: [
    {
      "key": "hips",
      "label": "Hips back",
      "detail": "Hips back then down.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bwsquat"
        ],
        "note": "b3"
      }
    },
    {
      "key": "knees",
      "label": "Knees follow toes",
      "detail": "Knees over the second toe, ankles not rolling.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bwsquat"
        ],
        "note": "b5"
      }
    },
    {
      "key": "shins",
      "label": "Shins controlled",
      "detail": "Shins travel forward under control. Slightly past the toes is fine.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "ace-bwsquat",
          "fry-2003"
        ],
        "note": "b8"
      }
    },
    {
      "key": "depth",
      "label": "Thighs parallel",
      "detail": "Thighs about parallel at the bottom, back flat. Stop the descent where the heels start to lift or the torso starts to round.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "zoom": "bottom",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bwsquat"
        ],
        "note": "b4"
      }
    },
    {
      "key": "shin-torso",
      "label": "Shin and torso",
      "detail": "Shin and torso parallel at the bottom.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "bottom",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bwsquat"
        ],
        "note": "b6"
      }
    },
    {
      "key": "rise",
      "label": "Rise together",
      "detail": "Hips and torso rise together, heels flat.",
      "anchor": {
        "pose": "end",
        "at": "heel.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bwsquat"
        ],
        "note": "b7"
      }
    }
  ],
  zooms: [
    {
      "key": "bottom",
      "chip": "Bottom",
      "heading": "Bottom position",
      "kind": "posture"
    }
  ],
  chips: [
    "bottom",
    "feel"
  ],
  copy: {
    "setupLine": "Lower until the thighs are about parallel. Stop where the heels lift or the back rounds.",
    "mistakeLine": "Never let the knees drift in or out. Keep them over the second toe, ankles not rolling.",
    "cueLine": "Hips back, heels down."
  },
  mistakes: [],
  risks: [
    {
      "key": "knees-back",
      "text": "Knees held behind the toes likely load the hips and lower back.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "ace-bwsquat",
          "fry-2003"
        ],
        "note": "b8"
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
    "ace-bwsquat",
    "fry-2003",
    "nhs-knee",
    "nhs-knee-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/bodyweight_squat.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=0720ae70217e047e29e15172991a32cd56326282f958d83df37e922b37c4928e
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_chin_up",
  name: "Chin-up",
  hashes: { inputsSha256: "0720ae70217e047e29e15172991a32cd56326282f958d83df37e922b37c4928e", golden: "98cbb08908fe0aa3010e64980fe68597728d8137b0ef8fc39e8b84f24a1501e3" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"chin-up-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"chin-up-n-st-thigh.l\" d=\"~#F12N.uwGI1xYuT(G1T1Taz12A3JY1N5*6J2T3J2-O1ybVk0EizbVkE2-O1O2T3I5*6z3JY1A12U1TaxsTaXj!A11Fw1_j!A100200000202100020010010000001010000000000001000002000100000000000002000000000200\"/><path id=\"chin-up-n-st-kneecap.l\" d=\"~~FYvwHW1HF12\"/><path id=\"chin-up-n-st-shank.l\" d=\"~#F12UFw1YEV1IKx1zSU1U9X4ku*I1yA1!8cJ40NO1IB1_dV1!8z6F6KcHT1-vS1z4U2K8.P1(sltY7I7BfO3zpy3*fAbKbSm00021000001010000200201011010102200010000001201000000000000200000012002001000000\"/><path id=\"chin-up-n-st-foot.l\" d=\"~#o2DWoyU.1zWp*..16(bybJd!qYgUnAK2Vd.z2)1Gz1T5.k-d)y1N8-cSgPmRrOd010000010002200001000001011000020010002002101001\"/><path id=\"chin-up-n-st-shcap.l\" d=\"~~(AvNUvFI11\"/><path id=\"chin-up-n-st-upper.l\" d=\"~#F12H.x1AXvOYx1BXw1tw870g.H1B3A5K1U2G7Fy1zaFgp!e(7Jhy3!y1D1Y2P2S5Y4VH1821w8Pe!1YdBmF1Ek*aTn00101002200002000100000001011000021010000100200000100000100000000000000000000000\"/><path id=\"chin-up-n-st-elbowcap.l\" d=\"~~_ww1yGnWv0\"/><path id=\"chin-up-n-st-fore.l\" d=\"~#F12Uxy1wInO*x1xAo)1D9jX1pBE1X3D8O1w2B2Ut-6AbjAaS5_bK1WtJ1F2W2P8N5-D1qV1uJ9A9kPa)guOfK8zi11200000000000001020000100000002000000100002000001000000010000000000020000101011\"/><path id=\"chin-up-n-st-fist.l\" d=\"~~FUw1UOe_s0\"/><path id=\"chin-up-n-st-head\" d=\"~#w12Uwx1_zmRSvz.lBhFhIhU8xa.2.2H4G4B7E7xa-fBkH4RbK1R8Eh1AkxaDk-5Wi(2JhJeO1Hh0021000110100001000000020000000100020020011000010110102000001010\"/><path id=\"chin-up-n-st-torso\" d=\"~#_12JVvWJq)*v.ypV8N2.2.9W8!aU8JcPbNe_50-5TlzkE7RbJ4NeG4Wi-5DkIe!f.fH4T8E7KeKoTvzaRoX50T82PbJe(2D7TbB7GeAc-5_dY5qSbB5!2F7*H2_s00010100000100000202000000101100010010101001101010000110100010000000000000022001000001100000201010010001010000000000\"/><path id=\"chin-up-n-st-thigh.r\" d=\"^0\"/><path id=\"chin-up-n-st-kneecap.r\" d=\"^1\"/><path id=\"chin-up-n-st-shank.r\" d=\"^2\"/><path id=\"chin-up-n-st-foot.r\" d=\"^3\"/><path id=\"chin-up-n-st-shcap.r\" d=\"^4\"/><path id=\"chin-up-n-st-upper.r\" d=\"^5\"/><path id=\"chin-up-n-st-elbowcap.r\" d=\"^6\"/><path id=\"chin-up-n-st-fore.r\" d=\"^7\"/><path id=\"chin-up-n-st-fist.r\" d=\"^8\"/><path id=\"chin-up-n-g0-thigh.l\" d=\"~#F12PPuS_D1TJuEPB1X1Raz10Y3NY1H5x7N2T3Y1.O1!a-k7BiGbTk.2XO1O2R3K5)6O2SY1A11S1RaGsGaEjyB1cHw1DkSA100010110001000100000210020010000010000220000210020020000200002100000200001010100\"/><path id=\"chin-up-n-g0-kneecap.l\" d=\"~~JRvY_R1HF12\"/><path id=\"chin-up-n-g0-shank.l\" d=\"~#F12Jxw1YYP1.Bx1VyP1S9.4kuOI1SA1(88H40wO1)B1_dX1Y8E6D6Rc(S1Kw1J1x4W2K8TP1NtlrY7R7IfE3*oH3*fJbxbUm02021000000100000000000011020000000100000000100000010110000120010000001011010000\"/><path id=\"chin-up-n-g0-foot.l\" d=\"~#o2HRo!EX1IRpIOX1c!bFbJdwrHgSo(J2Oe-z2K2Bz1-5-kEe*y1H8-cYgHmTrEd010020200000001010010000000000010100120000200100\"/><path id=\"chin-up-n-g0-head\" d=\"~#w12(Xv_ShEGuBNhVfWiOgAaGa)1O2U4*4.6)7I9ThXiJ3.bE2K8BhP1Fj-bSjO7!iD1Pi(c2Fh0201011000001002100001002000010000000000202001010001111000000100\"/><path id=\"chin-up-n-g0-torso\" d=\"~#_12_Yu((lX*uRUkI9H2.4)9w9_9(8Ddwcye!57X6Kl*kX6KbP4JeO4Ui)5ykReUfzgD4T8G7Ie.oIvIaIo-5r.9h(bYfA3D7Xb*6)dNdK5AdP5E2F9E4!3y9zF2Dz100001202002000111100200000000200000000002000000000011010120020000010001000000200010000010100001010200101000000000000\"/><path id=\"chin-up-n-g0-thigh.r\" d=\"^11\"/><path id=\"chin-up-n-g0-kneecap.r\" d=\"^12\"/><path id=\"chin-up-n-g0-shank.r\" d=\"^13\"/><path id=\"chin-up-n-g0-foot.r\" d=\"^14\"/><path id=\"chin-up-n-g1-thigh.l\" d=\"~#F12PBuAJy1zxu.xx1.1Raz12N4NY1D5E7N2R3A1*O1Ua.kbEiTbKkI3-O1R2K3R5*6-1SY1A11N1TaIs*9.iFB1oHw1SkJA101000000020200000000000010000200210000000010120000000001210000100010000101000001\"/><path id=\"chin-up-n-g1-kneecap.l\" d=\"~~PHvJIK1HF12\"/><path id=\"chin-up-n-g1-shank.l\" d=\"~#F12A_vYGJ1K(w1GTI1U9*4kszI1DB1(82H41SN1KD1_d)1W8I6w6TcSS1*w1J1z4S2R8GP1AujtS7T7Gfx3)oS3VfUb.aYm00000000000002010100000000000000010000000000012000000000200100000000000220010001\"/><path id=\"chin-up-n-g1-foot.l\" d=\"~#o2NJoS.S1OJpTyT1e_bHbDdHrygJpUJ2EfTz2-2zz1x6-kXeXy1F8.cwhym-r*c200000111000000200000002000101011000222000000000\"/><path id=\"chin-up-n-g1-head\" d=\"~#w12DOuYzdEwtEzdxeykOfPbOaz1)1_4R5I6-8V8zjzhF2xc*2G8)gy3yiKd(iE9(ibPjFbS1Dh0000100000001000200001010110001000111000000000210002001200111100\"/><path id=\"chin-up-n-g1-torso\" d=\"~#_12J!tyShT*tKEgxaF2.6*9D9Y8P9weHcYdw6fV7GlXlG6Gb_4HeX4Siz6!j*eNfBgA4X8O7BeEpBvVaBo-5V1BbE1NcFhH3w7.bO6TdUex5Nc_4E5F7)2(4WaXA2JG120000200000000000010121001010110000220000000000021101000022000100010101101000011100000200200100000000200000000200100\"/><path id=\"chin-up-n-g1-thigh.r\" d=\"^17\"/><path id=\"chin-up-n-g1-kneecap.r\" d=\"^18\"/><path id=\"chin-up-n-g1-shank.r\" d=\"^19\"/><path id=\"chin-up-n-g1-foot.r\" d=\"^20\"/><path id=\"chin-up-n-e-thigh.l\" d=\"~#F12S_tU*tVVtITsx2Rax12A5HY1y5E7J2T3k.O1JazllziXbGk)3-O1R2I3T5.6B1PY1A10H1TaOsT9KiNB1A1Hw1ylAA100101000200101110001000000100010020000010002000010101100020000100000000000022000\"/><path id=\"chin-up-n-e-kneecap.l\" d=\"~~Uzvw!F1HF12\"/><path id=\"chin-up-n-e-shank.l\" d=\"~#F12!SvU_E1.Ww1VzE1N9B5mw1TH1SB1(80F41DN1xE1Wdz2W8K6_5VcDS1Tx1J1x4J2R8.O1UuntS7V7Gf.2)o!3TfYbOa!m10110100020020010000120001001000000100101000000001010001010120000200100000000002\"/><path id=\"chin-up-n-e-foot.l\" d=\"~#o2WEoFON1*Ep)VN1m(bPb(cNr_fHqHJ2xgKz2E3Bz1E6TkBfRy1A8xdFh(l*rTc002200012002200001000001000200001001212002000010\"/><path id=\"chin-up-n-e-shcap.l\" d=\"~~WytwOiFI11\"/><path id=\"chin-up-n-e-upper.l\" d=\"~#F12U!tUWj))sBGjx7R345PE1_eV3T4*1G2XsEi.b)eRd*5zjP1*w1V8*24*5gYB1_i1aO7-2z7YcAgSkPiy8yqz200000000020000101210110000100210111000100000000000000000001000002100000011000000\"/><path id=\"chin-up-n-e-elbowcap.l\" d=\"~~Y)A1PYlWv0\"/><path id=\"chin-up-n-e-fore.l\" d=\"~#F12_.D1JElEDE1.*lH3S8I1x1Km)uN1W83P2PeUokydD5U8HbW6yfDoJ2y1(6H5)gEy19X1(5(6H8z4x1*jx8GdBhza01100000200002001000212000011111100000010100200001002000001101002010101000020000\"/><path id=\"chin-up-n-e-fist.l\" d=\"~~FUw1FKe_s0\"/><path id=\"chin-up-n-e-head\" d=\"~#w12PDtSW8VXrz_8GcAlIe!cRa5T1(4x6.5O9.7TkIfF1EcT3*7XgN4(g)e(hXa!ix2JkN9A3yh0000102002000000000000200010020200000001010100101000001000000000\"/><path id=\"chin-up-n-e-torso\" d=\"~#_12DwtwDdX*sK.b*aF2T8T9F9W7yaYeWcJdA6lV8zlKm-5Eb(4Fe-4PiI6WjzfFfKgy4X8X7BeRp-u*axo*5O2Oc.1wdYiS3!6zcB6zd!fX4Yb(3E8D5R1J6Hc.w2DO100200020021000000010100200020000010000020002200001010120000000000202000000210000020021010100001001010010100020012101\"/><path id=\"chin-up-n-e-thigh.r\" d=\"^23\"/><path id=\"chin-up-n-e-kneecap.r\" d=\"^24\"/><path id=\"chin-up-n-e-shank.r\" d=\"^25\"/><path id=\"chin-up-n-e-foot.r\" d=\"^26\"/><path id=\"chin-up-n-e-shcap.r\" d=\"^27\"/><path id=\"chin-up-n-e-upper.r\" d=\"^28\"/><path id=\"chin-up-n-e-elbowcap.r\" d=\"^29\"/><path id=\"chin-up-n-e-fore.r\" d=\"^30\"/><path id=\"chin-up-n-e-fist.r\" d=\"^31\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#chin-up-n-dots)\"/>\n  <path class=\"datum\" d=\"~Mw*3yweLW_s0\"/><path class=\"eq\" d=\"~MN_x1U.eLySd0QJ90VFdI9LI9lQ0I9I9mLVFdJ9QI90WFdJ9LJ9mQ0J9J9lZ\"/><path class=\"eq\" d=\"~MA!O1FYhLH70QF60x1E6LE6Gz6Q0E6E6Hz6Lx1F6QE60y1F6LF6Hz6Q0F6F6Gz6Z\"/><path class=\"eq\" d=\"~MSxy1DKeL00Q0010L-w10Q00!w10L00Q0202L!w11Q20-w11Z\"/><path class=\"eq-solid\" d=\"~~!zx1FKeDd0\"/><path class=\"eq-pin\" d=\"~~HKx1FKeY30\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#chin-up-n-st-thigh.l\"/><use href=\"#chin-up-n-st-kneecap.l\"/><use href=\"#chin-up-n-st-shank.l\"/><use href=\"#chin-up-n-st-foot.l\"/><use href=\"#chin-up-n-st-shcap.l\"/><use href=\"#chin-up-n-st-upper.l\"/><use href=\"#chin-up-n-st-elbowcap.l\"/><use href=\"#chin-up-n-st-fore.l\"/><use href=\"#chin-up-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#chin-up-n-st-thigh.l\"/><use href=\"#chin-up-n-st-kneecap.l\"/><use href=\"#chin-up-n-st-shank.l\"/><use href=\"#chin-up-n-st-foot.l\"/><use href=\"#chin-up-n-st-shcap.l\"/><use href=\"#chin-up-n-st-upper.l\"/><use href=\"#chin-up-n-st-elbowcap.l\"/><use href=\"#chin-up-n-st-fore.l\"/><use href=\"#chin-up-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chin-up-n-st-head\"/><use href=\"#chin-up-n-st-torso\"/><use href=\"#chin-up-n-st-thigh.r\"/><use href=\"#chin-up-n-st-kneecap.r\"/><use href=\"#chin-up-n-st-shank.r\"/><use href=\"#chin-up-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#chin-up-n-st-head\"/><use href=\"#chin-up-n-st-torso\"/><use href=\"#chin-up-n-st-thigh.r\"/><use href=\"#chin-up-n-st-kneecap.r\"/><use href=\"#chin-up-n-st-shank.r\"/><use href=\"#chin-up-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chin-up-n-st-shcap.r\"/><use href=\"#chin-up-n-st-upper.r\"/><use href=\"#chin-up-n-st-elbowcap.r\"/><use href=\"#chin-up-n-st-fore.r\"/><use href=\"#chin-up-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#chin-up-n-st-shcap.r\"/><use href=\"#chin-up-n-st-upper.r\"/><use href=\"#chin-up-n-st-elbowcap.r\"/><use href=\"#chin-up-n-st-fore.r\"/><use href=\"#chin-up-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#chin-up-n-g0-thigh.l\"/><use href=\"#chin-up-n-g0-kneecap.l\"/><use href=\"#chin-up-n-g0-shank.l\"/><use href=\"#chin-up-n-g0-foot.l\"/></g><g class=\"u-fill\"><use href=\"#chin-up-n-g0-thigh.l\"/><use href=\"#chin-up-n-g0-kneecap.l\"/><use href=\"#chin-up-n-g0-shank.l\"/><use href=\"#chin-up-n-g0-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chin-up-n-g0-head\"/><use href=\"#chin-up-n-g0-torso\"/><use href=\"#chin-up-n-g0-thigh.r\"/><use href=\"#chin-up-n-g0-kneecap.r\"/><use href=\"#chin-up-n-g0-shank.r\"/><use href=\"#chin-up-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#chin-up-n-g0-head\"/><use href=\"#chin-up-n-g0-torso\"/><use href=\"#chin-up-n-g0-thigh.r\"/><use href=\"#chin-up-n-g0-kneecap.r\"/><use href=\"#chin-up-n-g0-shank.r\"/><use href=\"#chin-up-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#chin-up-n-g1-thigh.l\"/><use href=\"#chin-up-n-g1-kneecap.l\"/><use href=\"#chin-up-n-g1-shank.l\"/><use href=\"#chin-up-n-g1-foot.l\"/></g><g class=\"u-fill\"><use href=\"#chin-up-n-g1-thigh.l\"/><use href=\"#chin-up-n-g1-kneecap.l\"/><use href=\"#chin-up-n-g1-shank.l\"/><use href=\"#chin-up-n-g1-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chin-up-n-g1-head\"/><use href=\"#chin-up-n-g1-torso\"/><use href=\"#chin-up-n-g1-thigh.r\"/><use href=\"#chin-up-n-g1-kneecap.r\"/><use href=\"#chin-up-n-g1-shank.r\"/><use href=\"#chin-up-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#chin-up-n-g1-head\"/><use href=\"#chin-up-n-g1-torso\"/><use href=\"#chin-up-n-g1-thigh.r\"/><use href=\"#chin-up-n-g1-kneecap.r\"/><use href=\"#chin-up-n-g1-shank.r\"/><use href=\"#chin-up-n-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#chin-up-n-e-thigh.l\"/><use href=\"#chin-up-n-e-kneecap.l\"/><use href=\"#chin-up-n-e-shank.l\"/><use href=\"#chin-up-n-e-foot.l\"/><use href=\"#chin-up-n-e-shcap.l\"/><use href=\"#chin-up-n-e-upper.l\"/><use href=\"#chin-up-n-e-elbowcap.l\"/><use href=\"#chin-up-n-e-fore.l\"/><use href=\"#chin-up-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#chin-up-n-e-thigh.l\"/><use href=\"#chin-up-n-e-kneecap.l\"/><use href=\"#chin-up-n-e-shank.l\"/><use href=\"#chin-up-n-e-foot.l\"/><use href=\"#chin-up-n-e-shcap.l\"/><use href=\"#chin-up-n-e-upper.l\"/><use href=\"#chin-up-n-e-elbowcap.l\"/><use href=\"#chin-up-n-e-fore.l\"/><use href=\"#chin-up-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chin-up-n-e-head\"/><use href=\"#chin-up-n-e-torso\"/><use href=\"#chin-up-n-e-thigh.r\"/><use href=\"#chin-up-n-e-kneecap.r\"/><use href=\"#chin-up-n-e-shank.r\"/><use href=\"#chin-up-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#chin-up-n-e-head\"/><use href=\"#chin-up-n-e-torso\"/><use href=\"#chin-up-n-e-thigh.r\"/><use href=\"#chin-up-n-e-kneecap.r\"/><use href=\"#chin-up-n-e-shank.r\"/><use href=\"#chin-up-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chin-up-n-e-shcap.r\"/><use href=\"#chin-up-n-e-upper.r\"/><use href=\"#chin-up-n-e-elbowcap.r\"/><use href=\"#chin-up-n-e-fore.r\"/><use href=\"#chin-up-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#chin-up-n-e-shcap.r\"/><use href=\"#chin-up-n-e-upper.r\"/><use href=\"#chin-up-n-e-elbowcap.r\"/><use href=\"#chin-up-n-e-fore.r\"/><use href=\"#chin-up-n-e-fist.r\"/></g></g><path class=\"eq-cable m-line\" d=\"~MUWy1P*rL*3dL25L23\"/><path class=\"eq-cable m-line\" d=\"~MNNv_BqLR4B3Li7La5Lc5L85La1Lc3L81Lc1La3La5La1La3La0La0L84La2L82Lc1L80La2L86La4L6aLaaLeaLc6Lc6L88L28L28L1a\"/><path class=\"eq-cable m-line\" d=\"~MSNvAUqLz1y5LuiLgc\"/><path class=\"eq-cable m-line\" d=\"~MwIv(.rL.1W5L70L12L31L03L15L09L1bL3bL55L23L00L64L48L6cLaaL24L66L46L46L44L68L26L48L44L66\"/><path class=\"eq-cable m-line\" d=\"~MDOuDUF1Lz2S5L96Ld6L72L54L21L61La1Lg5La3L80L63L80L63Lc1L83Lc1L83La2La1L83Lc3L87La5\"/><path class=\"eq-cable m-line\" d=\"~MWVy1wxtLG2X3L61L20L85L81La7L65L85L60\"/><path class=\"eq-cable m-line\" d=\"~MP)vYJnLG1N6L2oL2eL08L26L03L17L25L00L00L02L24L00L24L24L0eL2iL08L20L27L2jL2pL4B1L2E1L6z1L2pL2hL29L03L16L2cL3aL23L01L02L02L02L06L08L36L36L14L24L22L62La0Lc0La4L88L84L60L83L6bL6bL8jLafLabL8bL69L4bL29L17L19L09L47L29L0bL17L3dL7bL7bL9hL1jL5dL39L75L71L52L7aLb2Lb3L92L31L54L02L06L66L08L06L04L06L00L12L21L13L2aL1cL06L01L0bL0hL2rL1x1L2E1L2B1L2rL1hL07L11L1aL1gL1eL34L12L04L10L02L02L10L25L09L20L10L3cL0eL7m\"/><path class=\"eq-cable m-line\" d=\"~MAzx1UzgLT1uL28L82L40L44L26L0cL2cL3iL0kL5qL0mL0iL1eL28L14L23L27L23L11L21L04L02L24L26L26L2eL1mL28L22L27L2fL4nL2z1L6B1L4tL2nL4hL09L23L16L0aL04L03L01L00L22L14L26L28L38L0aL14L24L42L22L61L60\"/><path class=\"eq-cable m-line\" d=\"~MUxy1wInLuB3L51L31L50L12L04L16L08L2aL16L06L16L00L10L01L23L14L2cL14L03L09L0hL0lL1x1L0z1L2z1L0pL1dL09L32L08L1mL3eL36L06L14L10L04L10L01L25L17L11\"/><path class=\"eq-cable m-line\" d=\"~MPVw1FEeLuT2L84La0L68L64L68L86L48L28L68L28L28L08L0cL08L18L38L18L38L38L76L58L54L58L90L74\"/><circle class=\"joint\" cx=\"155.83\" cy=\"94.56\" r=\"2.25\"/><circle class=\"joint\" cx=\"194.47\" cy=\"111.44\" r=\"2.25\"/><circle class=\"joint\" cx=\"163.79\" cy=\"152.84\" r=\"2.25\"/><circle class=\"joint\" cx=\"165.76\" cy=\"209.28\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#!10YRy1PHoGTy1*To0102001122000112201020100020100000221100000201021122010211002101000000011111000020000111101002001210000010100000000010100000022002001011100010001200100010001001002000000000100002\"/><path class=\"arrow\" d=\"~MA.w1SHeL(oYx1L.*1GrZ\"/></g><path class=\"leader\" d=\"M155.22 87.68L117.83 93H107.83\"/><circle class=\"anchor\" cx=\"155.22\" cy=\"87.68\" r=\"1.5\"/><path class=\"leader\" d=\"~MN)B1PYlL0FUb\"/><circle class=\"anchor\" cx=\"194.47\" cy=\"111.44\" r=\"1.5\"/><path class=\"leader\" d=\"M167.63 70.27L179 39H189\"/><circle class=\"anchor\" cx=\"167.63\" cy=\"70.27\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"chin-up-n-set\" data-key=\"set\" data-cue=\"Pull the shoulder blades down and back before the arms bend, and hold them there.\" class=\"plate-callout\" style=\"left:0.56%;top:19.83%\" aria-pressed=\"true\">Shoulders set</button><button type=\"button\" id=\"chin-up-n-elbows\" data-key=\"elbows\" data-cue=\"Drive the elbows straight down toward the floor, kept in front of the body.\" class=\"plate-callout\" style=\"left:54.75%;top:44.69%\" aria-pressed=\"false\">Elbows in front</button><button type=\"button\" id=\"chin-up-n-chin\" data-key=\"chin\" data-cue=\"Pull until the chin is level with the bar, then lower to fully straight arms.\" class=\"plate-callout\" style=\"left:51.4%;top:4.75%\" aria-pressed=\"false\">Chin to bar</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"chin-up-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"chin-up-m-st-thigh.l\" d=\"^0\"/><path id=\"chin-up-m-st-kneecap.l\" d=\"^1\"/><path id=\"chin-up-m-st-shank.l\" d=\"^2\"/><path id=\"chin-up-m-st-foot.l\" d=\"^3\"/><path id=\"chin-up-m-st-shcap.l\" d=\"^4\"/><path id=\"chin-up-m-st-upper.l\" d=\"^5\"/><path id=\"chin-up-m-st-elbowcap.l\" d=\"^6\"/><path id=\"chin-up-m-st-fore.l\" d=\"^7\"/><path id=\"chin-up-m-st-fist.l\" d=\"^8\"/><path id=\"chin-up-m-st-head\" d=\"^9\"/><path id=\"chin-up-m-st-torso\" d=\"^10\"/><path id=\"chin-up-m-st-thigh.r\" d=\"^0\"/><path id=\"chin-up-m-st-kneecap.r\" d=\"^1\"/><path id=\"chin-up-m-st-shank.r\" d=\"^2\"/><path id=\"chin-up-m-st-foot.r\" d=\"^3\"/><path id=\"chin-up-m-st-shcap.r\" d=\"^4\"/><path id=\"chin-up-m-st-upper.r\" d=\"^5\"/><path id=\"chin-up-m-st-elbowcap.r\" d=\"^6\"/><path id=\"chin-up-m-st-fore.r\" d=\"^7\"/><path id=\"chin-up-m-st-fist.r\" d=\"^8\"/><path id=\"chin-up-m-g0-thigh.l\" d=\"^11\"/><path id=\"chin-up-m-g0-kneecap.l\" d=\"^12\"/><path id=\"chin-up-m-g0-shank.l\" d=\"^13\"/><path id=\"chin-up-m-g0-foot.l\" d=\"^14\"/><path id=\"chin-up-m-g0-head\" d=\"^15\"/><path id=\"chin-up-m-g0-torso\" d=\"^16\"/><path id=\"chin-up-m-g0-thigh.r\" d=\"^11\"/><path id=\"chin-up-m-g0-kneecap.r\" d=\"^12\"/><path id=\"chin-up-m-g0-shank.r\" d=\"^13\"/><path id=\"chin-up-m-g0-foot.r\" d=\"^14\"/><path id=\"chin-up-m-g1-thigh.l\" d=\"^17\"/><path id=\"chin-up-m-g1-kneecap.l\" d=\"^18\"/><path id=\"chin-up-m-g1-shank.l\" d=\"^19\"/><path id=\"chin-up-m-g1-foot.l\" d=\"^20\"/><path id=\"chin-up-m-g1-head\" d=\"^21\"/><path id=\"chin-up-m-g1-torso\" d=\"^22\"/><path id=\"chin-up-m-g1-thigh.r\" d=\"^17\"/><path id=\"chin-up-m-g1-kneecap.r\" d=\"^18\"/><path id=\"chin-up-m-g1-shank.r\" d=\"^19\"/><path id=\"chin-up-m-g1-foot.r\" d=\"^20\"/><path id=\"chin-up-m-e-thigh.l\" d=\"^23\"/><path id=\"chin-up-m-e-kneecap.l\" d=\"^24\"/><path id=\"chin-up-m-e-shank.l\" d=\"^25\"/><path id=\"chin-up-m-e-foot.l\" d=\"^26\"/><path id=\"chin-up-m-e-shcap.l\" d=\"^27\"/><path id=\"chin-up-m-e-upper.l\" d=\"^28\"/><path id=\"chin-up-m-e-elbowcap.l\" d=\"^29\"/><path id=\"chin-up-m-e-fore.l\" d=\"^30\"/><path id=\"chin-up-m-e-fist.l\" d=\"^31\"/><path id=\"chin-up-m-e-head\" d=\"^32\"/><path id=\"chin-up-m-e-torso\" d=\"^33\"/><path id=\"chin-up-m-e-thigh.r\" d=\"^23\"/><path id=\"chin-up-m-e-kneecap.r\" d=\"^24\"/><path id=\"chin-up-m-e-shank.r\" d=\"^25\"/><path id=\"chin-up-m-e-foot.r\" d=\"^26\"/><path id=\"chin-up-m-e-shcap.r\" d=\"^27\"/><path id=\"chin-up-m-e-upper.r\" d=\"^28\"/><path id=\"chin-up-m-e-elbowcap.r\" d=\"^29\"/><path id=\"chin-up-m-e-fore.r\" d=\"^30\"/><path id=\"chin-up-m-e-fist.r\" d=\"^31\"/><path id=\"chin-up-m-m-head\" d=\"~#w12D(mYUaOSl-BbR5Yn)9Sgza!23D5O7-3KbX4zoX8K2)b-5R6VeA9YbEjAeOfHhR7Jmy3(7Nf0210002200000120000020200000000200000010100000200210110020000200\"/><path id=\"chin-up-m-m-torso\" d=\"~#_12yyoY)eETnXXd.9J5xbV6DbS4_dFbAgy9Y5T2-eRhXnA1K9_7JcO8ygGbWe*jDa*jP1R9IbObxx1RmBhBkT6R1zeN1SiWfJ5U5IdG2.7!iz1WcH1)8S4x3U9(9BP1yw210021000000101000120000000000200001010000201010000000020001000000001000120000001012002002021000100000000000000200100\"/><path id=\"chin-up-m-m-thigh.l\" d=\"~#F12yGvAEw1*(tTxw1Vaj5A1_X1W8X5X6*2z3GN1Ec)hzfXhX3RmP6GO1V7*3W1x8_3UW1Ye8x1xa-3BgHp!v!qUv_6AF1Vb01000100001010010000000000000022000000000000000101002020001010000001000210000001\"/><path id=\"chin-up-m-m-kneecap.l\" d=\"~~JFG1!Jw1HF12\"/><path id=\"chin-up-m-m-shank.l\" d=\"~#F12JEG1WSw1-AG1zFv4VaA17FcUX1H4-7w2-3-bG.1!4)cO1XaE8Bbx5B!1.2B3I6E6S3YY1z14x3Ea)9wcV8WnW2Hj(eNk01000001000000000100000000002200000000000020000010101101000000000000001000020010\"/><path id=\"chin-up-m-m-foot.l\" d=\"~#o2FOI1NEH1VAJ1ONG1SaA5yhV3yrIgPO2(dXy2RiGw1EeBlO4OB1R3O7IdPrK4RoHi000011000000000100000202001010000000000020000122\"/><path id=\"chin-up-m-m-shcap.l\" d=\"~~wUpyUjFI11\"/><path id=\"chin-up-m-m-upper.l\" d=\"~#F12SKqP.k.PpXKkz7R369SE1HfV3V4.1G2)sTiTbzfRdx6zjJ1Bx1z9*22)5e!B1Fj3aO7.2x7Yc(fWkNiD8yq-102020001010111020000000002200210101000020001012000210000001001002000001110000200\"/><path id=\"chin-up-m-m-elbowcap.l\" d=\"~~PRx1FwnWv0\"/><path id=\"chin-up-m-m-fore.l\" d=\"~#F12ySz1N!mESz1IVndD9tR1R7XB1B2S8E1D2w3Ys-4DcA1waP7WaY3WsW1!1A4_7G1OD1eV1U2_8A9fJ7Ri-1KfKbIg01210110001010101010000000000010010020000000000000000210102000010000000000000000\"/><path id=\"chin-up-m-m-thigh.r\" d=\"^57\"/><path id=\"chin-up-m-m-kneecap.r\" d=\"^58\"/><path id=\"chin-up-m-m-shank.r\" d=\"^59\"/><path id=\"chin-up-m-m-foot.r\" d=\"^60\"/><path id=\"chin-up-m-m-shcap.r\" d=\"^61\"/><path id=\"chin-up-m-m-upper.r\" d=\"^62\"/><path id=\"chin-up-m-m-elbowcap.r\" d=\"^63\"/><path id=\"chin-up-m-m-fore.r\" d=\"^64\"/><path id=\"chin-up-m-mf-fist.l\" d=\"^31\"/><path id=\"chin-up-m-mf-fist.r\" d=\"^31\"/><path id=\"chin-up-m-mo-0\" d=\"^32\"/><path id=\"chin-up-m-mo-1\" d=\"^33\"/><path id=\"chin-up-m-mo-2\" d=\"^23\"/><path id=\"chin-up-m-mo-3\" d=\"^24\"/><path id=\"chin-up-m-mo-4\" d=\"^25\"/><path id=\"chin-up-m-mo-5\" d=\"^26\"/><path id=\"chin-up-m-mo-6\" d=\"^27\"/><path id=\"chin-up-m-mo-7\" d=\"^28\"/><path id=\"chin-up-m-mo-8\" d=\"^29\"/><path id=\"chin-up-m-mo-9\" d=\"^30\"/><path id=\"chin-up-m-mo-10\" d=\"^31\"/><path id=\"chin-up-m-mo-11\" d=\"^23\"/><path id=\"chin-up-m-mo-12\" d=\"^24\"/><path id=\"chin-up-m-mo-13\" d=\"^25\"/><path id=\"chin-up-m-mo-14\" d=\"^26\"/><path id=\"chin-up-m-mo-15\" d=\"^27\"/><path id=\"chin-up-m-mo-16\" d=\"^28\"/><path id=\"chin-up-m-mo-17\" d=\"^29\"/><path id=\"chin-up-m-mo-18\" d=\"^30\"/><path id=\"chin-up-m-mo-19\" d=\"^31\"/><path id=\"chin-up-m-mo-20\" d=\"^35\"/><path id=\"chin-up-m-mo-21\" d=\"^36\"/><path id=\"chin-up-m-mo-22\" d=\"^37\"/><path id=\"chin-up-m-mo-23\" d=\"^38\"/><path id=\"chin-up-m-mo-24\" d=\"^39\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#chin-up-m-dots)\"/>\n  <path class=\"datum\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><path class=\"eq-solid\" d=\"^38\"/><path class=\"eq-pin\" d=\"^39\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#chin-up-m-st-thigh.l\"/><use href=\"#chin-up-m-st-kneecap.l\"/><use href=\"#chin-up-m-st-shank.l\"/><use href=\"#chin-up-m-st-foot.l\"/><use href=\"#chin-up-m-st-shcap.l\"/><use href=\"#chin-up-m-st-upper.l\"/><use href=\"#chin-up-m-st-elbowcap.l\"/><use href=\"#chin-up-m-st-fore.l\"/><use href=\"#chin-up-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#chin-up-m-st-thigh.l\"/><use href=\"#chin-up-m-st-kneecap.l\"/><use href=\"#chin-up-m-st-shank.l\"/><use href=\"#chin-up-m-st-foot.l\"/><use href=\"#chin-up-m-st-shcap.l\"/><use href=\"#chin-up-m-st-upper.l\"/><use href=\"#chin-up-m-st-elbowcap.l\"/><use href=\"#chin-up-m-st-fore.l\"/><use href=\"#chin-up-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chin-up-m-st-head\"/><use href=\"#chin-up-m-st-torso\"/><use href=\"#chin-up-m-st-thigh.r\"/><use href=\"#chin-up-m-st-kneecap.r\"/><use href=\"#chin-up-m-st-shank.r\"/><use href=\"#chin-up-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#chin-up-m-st-head\"/><use href=\"#chin-up-m-st-torso\"/><use href=\"#chin-up-m-st-thigh.r\"/><use href=\"#chin-up-m-st-kneecap.r\"/><use href=\"#chin-up-m-st-shank.r\"/><use href=\"#chin-up-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chin-up-m-st-shcap.r\"/><use href=\"#chin-up-m-st-upper.r\"/><use href=\"#chin-up-m-st-elbowcap.r\"/><use href=\"#chin-up-m-st-fore.r\"/><use href=\"#chin-up-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#chin-up-m-st-shcap.r\"/><use href=\"#chin-up-m-st-upper.r\"/><use href=\"#chin-up-m-st-elbowcap.r\"/><use href=\"#chin-up-m-st-fore.r\"/><use href=\"#chin-up-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#chin-up-m-g0-thigh.l\"/><use href=\"#chin-up-m-g0-kneecap.l\"/><use href=\"#chin-up-m-g0-shank.l\"/><use href=\"#chin-up-m-g0-foot.l\"/></g><g class=\"u-fill\"><use href=\"#chin-up-m-g0-thigh.l\"/><use href=\"#chin-up-m-g0-kneecap.l\"/><use href=\"#chin-up-m-g0-shank.l\"/><use href=\"#chin-up-m-g0-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chin-up-m-g0-head\"/><use href=\"#chin-up-m-g0-torso\"/><use href=\"#chin-up-m-g0-thigh.r\"/><use href=\"#chin-up-m-g0-kneecap.r\"/><use href=\"#chin-up-m-g0-shank.r\"/><use href=\"#chin-up-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#chin-up-m-g0-head\"/><use href=\"#chin-up-m-g0-torso\"/><use href=\"#chin-up-m-g0-thigh.r\"/><use href=\"#chin-up-m-g0-kneecap.r\"/><use href=\"#chin-up-m-g0-shank.r\"/><use href=\"#chin-up-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#chin-up-m-g1-thigh.l\"/><use href=\"#chin-up-m-g1-kneecap.l\"/><use href=\"#chin-up-m-g1-shank.l\"/><use href=\"#chin-up-m-g1-foot.l\"/></g><g class=\"u-fill\"><use href=\"#chin-up-m-g1-thigh.l\"/><use href=\"#chin-up-m-g1-kneecap.l\"/><use href=\"#chin-up-m-g1-shank.l\"/><use href=\"#chin-up-m-g1-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chin-up-m-g1-head\"/><use href=\"#chin-up-m-g1-torso\"/><use href=\"#chin-up-m-g1-thigh.r\"/><use href=\"#chin-up-m-g1-kneecap.r\"/><use href=\"#chin-up-m-g1-shank.r\"/><use href=\"#chin-up-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#chin-up-m-g1-head\"/><use href=\"#chin-up-m-g1-torso\"/><use href=\"#chin-up-m-g1-thigh.r\"/><use href=\"#chin-up-m-g1-kneecap.r\"/><use href=\"#chin-up-m-g1-shank.r\"/><use href=\"#chin-up-m-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#chin-up-m-e-thigh.l\"/><use href=\"#chin-up-m-e-kneecap.l\"/><use href=\"#chin-up-m-e-shank.l\"/><use href=\"#chin-up-m-e-foot.l\"/><use href=\"#chin-up-m-e-shcap.l\"/><use href=\"#chin-up-m-e-upper.l\"/><use href=\"#chin-up-m-e-elbowcap.l\"/><use href=\"#chin-up-m-e-fore.l\"/><use href=\"#chin-up-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#chin-up-m-e-thigh.l\"/><use href=\"#chin-up-m-e-kneecap.l\"/><use href=\"#chin-up-m-e-shank.l\"/><use href=\"#chin-up-m-e-foot.l\"/><use href=\"#chin-up-m-e-shcap.l\"/><use href=\"#chin-up-m-e-upper.l\"/><use href=\"#chin-up-m-e-elbowcap.l\"/><use href=\"#chin-up-m-e-fore.l\"/><use href=\"#chin-up-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chin-up-m-e-head\"/><use href=\"#chin-up-m-e-torso\"/><use href=\"#chin-up-m-e-thigh.r\"/><use href=\"#chin-up-m-e-kneecap.r\"/><use href=\"#chin-up-m-e-shank.r\"/><use href=\"#chin-up-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#chin-up-m-e-head\"/><use href=\"#chin-up-m-e-torso\"/><use href=\"#chin-up-m-e-thigh.r\"/><use href=\"#chin-up-m-e-kneecap.r\"/><use href=\"#chin-up-m-e-shank.r\"/><use href=\"#chin-up-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#chin-up-m-e-shcap.r\"/><use href=\"#chin-up-m-e-upper.r\"/><use href=\"#chin-up-m-e-elbowcap.r\"/><use href=\"#chin-up-m-e-fore.r\"/><use href=\"#chin-up-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#chin-up-m-e-shcap.r\"/><use href=\"#chin-up-m-e-upper.r\"/><use href=\"#chin-up-m-e-elbowcap.r\"/><use href=\"#chin-up-m-e-fore.r\"/><use href=\"#chin-up-m-e-fist.r\"/></g></g><path class=\"eq-cable m-line\" d=\"^40\"/><path class=\"eq-cable m-line\" d=\"^41\"/><path class=\"eq-cable m-line\" d=\"^42\"/><path class=\"eq-cable m-line\" d=\"^43\"/><path class=\"eq-cable m-line\" d=\"^44\"/><path class=\"eq-cable m-line\" d=\"^45\"/><path class=\"eq-cable m-line\" d=\"^46\"/><path class=\"eq-cable m-line\" d=\"^47\"/><path class=\"eq-cable m-line\" d=\"^48\"/><path class=\"eq-cable m-line\" d=\"^49\"/><circle class=\"joint\" cx=\"155.83\" cy=\"94.56\" r=\"2.25\"/><circle class=\"joint\" cx=\"194.47\" cy=\"111.44\" r=\"2.25\"/><circle class=\"joint\" cx=\"163.79\" cy=\"152.84\" r=\"2.25\"/><circle class=\"joint\" cx=\"165.76\" cy=\"209.28\" r=\"2.25\"/></g><mask id=\"chin-up-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#chin-up-m-m-head\" fill=\"#000\"/><use href=\"#chin-up-m-m-torso\" fill=\"#000\"/><use href=\"#chin-up-m-m-thigh.l\" fill=\"#000\"/><use href=\"#chin-up-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#chin-up-m-m-shank.l\" fill=\"#000\"/><use href=\"#chin-up-m-m-foot.l\" fill=\"#000\"/><use href=\"#chin-up-m-m-shcap.l\" fill=\"#000\"/><use href=\"#chin-up-m-m-upper.l\" fill=\"#000\"/><use href=\"#chin-up-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#chin-up-m-m-fore.l\" fill=\"#000\"/><use href=\"#chin-up-m-mf-fist.l\" fill=\"#000\"/><use href=\"#chin-up-m-m-thigh.r\" fill=\"#000\"/><use href=\"#chin-up-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#chin-up-m-m-shank.r\" fill=\"#000\"/><use href=\"#chin-up-m-m-foot.r\" fill=\"#000\"/><use href=\"#chin-up-m-m-shcap.r\" fill=\"#000\"/><use href=\"#chin-up-m-m-upper.r\" fill=\"#000\"/><use href=\"#chin-up-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#chin-up-m-m-fore.r\" fill=\"#000\"/><use href=\"#chin-up-m-mf-fist.r\" fill=\"#000\"/><use href=\"#chin-up-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#chin-up-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#chin-up-m-mmask)\"><g class=\"u-stroke\"><use href=\"#chin-up-m-m-head\"/><use href=\"#chin-up-m-m-torso\"/><use href=\"#chin-up-m-m-thigh.l\"/><use href=\"#chin-up-m-m-kneecap.l\"/><use href=\"#chin-up-m-m-shank.l\"/><use href=\"#chin-up-m-m-foot.l\"/><use href=\"#chin-up-m-m-shcap.l\"/><use href=\"#chin-up-m-m-upper.l\"/><use href=\"#chin-up-m-m-elbowcap.l\"/><use href=\"#chin-up-m-m-fore.l\"/><use href=\"#chin-up-m-m-thigh.r\"/><use href=\"#chin-up-m-m-kneecap.r\"/><use href=\"#chin-up-m-m-shank.r\"/><use href=\"#chin-up-m-m-foot.r\"/><use href=\"#chin-up-m-m-shcap.r\"/><use href=\"#chin-up-m-m-upper.r\"/><use href=\"#chin-up-m-m-elbowcap.r\"/><use href=\"#chin-up-m-m-fore.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"M179.57 201.14A50 50 0 0 0 211.71 162.84M213.49 167.51L211.71 162.84L207.73 165.86\"/><path class=\"leader m\" d=\"M217.72 165.9L221 145H231\"/><path class=\"leader m\" d=\"M129.22 112.25L97.14 118H87.14\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"chin-up-m-kip\" data-key=\"kip\" data-cue=\"The legs kick forward to swing the body up.\" class=\"plate-callout m\" style=\"left:63.13%;top:34.36%\" aria-pressed=\"true\">Legs kick</button><button type=\"button\" id=\"chin-up-m-arc\" data-key=\"arc\" data-cue=\"The body arcs back to throw the chin over the bar.\" class=\"plate-callout m\" style=\"left:2.79%;top:26.82%\" aria-pressed=\"false\">Body arcs</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "set",
        cues: [{ key: "set", cue: "Pull the shoulder blades down and back before the arms bend, and hold them there." }, { key: "elbows", cue: "Drive the elbows straight down toward the floor, kept in front of the body." }, { key: "chin", cue: "Pull until the chin is level with the bar, then lower to fully straight arms." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "kip",
        cues: [{ key: "kip", cue: "The legs kick forward to swing the body up." }, { key: "arc", cue: "The body arcs back to throw the chin over the bar." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Legs kick</b><span>The legs kick forward to swing the body up.</span></li><li><b>Body arcs</b><span>The body arcs back to throw the chin over the bar.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 2 seconds, hold 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Chin-up, side view. Palms toward the face, hands about shoulder width. From a straight-arm hang under a bar, the body rises without swinging until the chin is level with the bar, elbows driven down in front of the body.",
      mistakeAlt: "Chin-up: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hang",
    "orientation": "supinated",
    "handle": "bar-32",
    "loadAxis": "across",
    "width": {
      "text": "Hands about shoulder-width apart, or slightly closer.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-chin-up",
          "nasm-chin-pull"
        ],
        "note": "c2"
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
          "ace-chin-ups",
          "hk-baechle-grip"
        ],
        "note": "c1, c21; inherited from pull_up (THUMB, parent c3)"
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        35
      ],
      "limitText": "Keep your wrist straight, in line with your forearm, not curled.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH",
          "CONVENTION"
        ],
        "sources": [
          "ace-chin-ups",
          "odriscoll-1992",
          "hand-key-bar"
        ],
        "note": "c3, c20. The ext range is the bar key's hang wristRange (ga:hang-base), a convention, not a card number."
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
      "load": {
        "kind": "gravity"
      }
    },
    "faults": [
      {
        "key": "curled",
        "label": "Wrist curled",
        "pose": {
          "wrist": {
            "dev": 0,
            "ext": -30
          }
        },
        "markers": [
          "lever-arc"
        ],
        "alt": "Wrist curled forward toward the forearm."
      }
    ],
    "gripLine": "Palms facing you, bar just below the base of your fingers, thumbs wrapped.",
    "cue": "Thumbs wrapped, wrists straight."
  },
  contacts: [
    "hang-support"
  ],
  setup: [
    {
      "kind": "grip",
      "text": "Palms facing you, full grip, thumbs wrapped round the bar.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "ace-chin-ups",
          "hk-baechle-grip"
        ],
        "note": "c1, c21; inherited from pull_up (THUMB, parent c3)"
      }
    },
    {
      "kind": "position",
      "text": "Hands about shoulder-width apart, or slightly closer.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-chin-up",
          "nasm-chin-pull"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "brace",
      "text": "Hang, cross one leg over the other and brace your abs.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chin-ups"
        ],
        "note": "c9"
      }
    },
    {
      "kind": "position",
      "text": "Pull your shoulders down and back before you bend your arms.",
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chin-ups",
          "nasm-chin-pull"
        ],
        "note": "c4"
      }
    },
    {
      "kind": "load",
      "text": "Can't do a full rep yet? Use band or machine help.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-chin-pull"
        ],
        "note": "c17"
      }
    }
  ],
  posture: [
    {
      "key": "hang",
      "label": "Free hang",
      "detail": "Elbows fully straight at the bottom, head between the arms.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-chin-up"
        ],
        "note": "c18"
      }
    },
    {
      "key": "shoulders",
      "label": "Shoulders set",
      "detail": "Shoulder blades down and back, held for the whole set.",
      "anchor": {
        "pose": "start",
        "at": "shoulderTop.r"
      },
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chin-ups",
          "nasm-chin-pull"
        ],
        "note": "c4"
      }
    },
    {
      "key": "wrists",
      "label": "Straight wrists",
      "detail": "Wrists straight, in line with the forearms.",
      "anchor": {
        "pose": "start",
        "at": "wrist.r"
      },
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chin-ups"
        ],
        "note": "c3"
      }
    },
    {
      "key": "elbows",
      "label": "Elbows in front",
      "detail": "Elbows drive down toward the floor, in front of the body.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chin-ups"
        ],
        "note": "c5"
      }
    },
    {
      "key": "line",
      "label": "Body still",
      "detail": "Body vertical and still: no swing, no kip.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "zoom": "body-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chin-ups",
          "nasm-chin-pull"
        ],
        "note": "c6"
      }
    },
    {
      "key": "chin",
      "label": "Chin to bar",
      "detail": "Chin level with the bar at the top.",
      "anchor": {
        "pose": "end",
        "at": "chin"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chin-ups"
        ],
        "note": "c7"
      }
    }
  ],
  zooms: [
    {
      "key": "hand",
      "chip": "Hand",
      "heading": "Hand: right and wrong",
      "kind": "hand"
    },
    {
      "key": "shoulders",
      "chip": "Shoulders",
      "heading": "Shoulder set",
      "kind": "posture",
      "feelRow": "traps"
    },
    {
      "key": "body-line",
      "chip": "Body line",
      "heading": "Body line",
      "kind": "posture"
    }
  ],
  chips: [
    "hand",
    "shoulders",
    "body-line",
    "feel"
  ],
  copy: {
    "setupLine": "Palms facing you, thumbs wrapped. Hang with straight arms, legs crossed and still.",
    "mistakeLine": "Don't swing or kick to get your chin over the bar.",
    "cueLine": "Shoulders down, then pull."
  },
  mistakes: [
    {
      "key": "kip",
      "title": "Swinging or kicking up",
      "zoom": "body-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chin-ups",
          "nasm-chin-pull"
        ],
        "note": "c9, c6"
      },
      "fix": "Cross your legs, brace and keep your body vertical."
    },
    {
      "key": "half",
      "title": "Half reps",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chin-ups"
        ],
        "note": "c7"
      },
      "fix": "Straight arms at the bottom, chin to the bar every rep."
    },
    {
      "key": "shrug",
      "title": "Shoulders up at the start",
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "MECH",
          "WEAK",
          "CONSENSUS"
        ],
        "sources": [
          "bullbar-assist-beginner",
          "ace-chin-ups",
          "nasm-chin-pull"
        ],
        "note": "c24, c4"
      },
      "fix": "Pull your shoulders down and back, then bend your arms."
    }
  ],
  risks: [
    {
      "key": "shoulder",
      "text": "Arms high overhead narrow the space under the shoulder roof.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "prinold-2016"
        ],
        "note": "c14, c13"
      }
    },
    {
      "key": "spine",
      "text": "Of the pulls tested, chin-ups and pull-ups loaded the spine most.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "mcgill-2014"
        ],
        "note": "c15"
      }
    },
    {
      "key": "elbow",
      "text": "Elbows can get overused when pulling volume rises too fast.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-chin-pull"
        ],
        "note": "c16"
      }
    }
  ],
  riskFlags: [
    "shoulder",
    "elbow"
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
    "ace-chin-ups",
    "strengthlog-chin-up",
    "nasm-chin-pull",
    "barbend-chin-up",
    "ace-best-back",
    "youdas-2010",
    "prinold-2016",
    "mcgill-2014",
    "odriscoll-1992",
    "hk-baechle-grip",
    "bullbar-assist-beginner",
    "bullbar-calluses",
    "hand-key-bar",
    "nhs-shoulder-pain",
    "nhs-elbow-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/chin_up.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

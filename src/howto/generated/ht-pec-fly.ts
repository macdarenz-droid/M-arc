// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=c7e5fae245b8f8dc5d83e80b67d4dc5c483c97863d0c20543364775858ea4667
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_pec_fly",
  name: "Pec Fly",
  hashes: { inputsSha256: "c7e5fae245b8f8dc5d83e80b67d4dc5c483c97863d0c20543364775858ea4667", golden: "d9aac21e853c01cb74f6cf188823d6c2c62d71c808492fd69c793e7e199e2c1f" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"pec-fly-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"pec-fly-n-st-upper.l\" d=\"~#F12DwG1F-D1I(E1zND1K8)249AN1JbX4-4O2B2*y1Ogxf)eXfV4.kD4ED1K5E3iR6H1WJ1!f1aT8z2.5DfUkNkNlP6Ns.500000000000000010110000020000020000000002020000000000000000000100020000210000000\"/><path id=\"pec-fly-n-st-elbowcap.l\" d=\"~~WDR1JwF1Dz10\"/><path id=\"pec-fly-n-st-fore.l\" d=\"~#F12_HS1ABG1ROR1-yG1)9O1Y1nyH1R4z9I3I2O1Iva)cO6BbaRcA7OvF1B2Y1*8W3DH1N2_1o.9(1pDa!jwaFhdFjxb02000000120000000000102000100200000001000002200101000000020001101000210000011100\"/><path id=\"pec-fly-n-st-fist.l\" d=\"~~H-_1SYE1ww10\"/><path id=\"pec-fly-n-st-upper.r\" d=\"~#F12YxsH*z1xAt)Tz1U8z22aVJ1!fS6H1F3iFD1K5!kD4YfV4yf)e(y1OgP2B2Y4-4zN1Jb39N8)2O3-fKs.5KlP6TkNk20000000000000101000101000000000100000100000200101000000000000000000002002001000\"/><path id=\"pec-fly-n-st-elbowcap.r\" d=\"~~NPiJwF1Dz10\"/><path id=\"pec-fly-n-st-fore.r\" d=\"~#F12SUjS.D1TOkE)D1!9(1-1oBH1N2(8W3D2Y1PvF1ScA7DbawdO6JvaJ2O1A9I3xH1R4X1nwaO1F1xaEjxbEhd.jwa00010012100000111110020000111000000220001020000000101022000000020021010000110000\"/><path id=\"pec-fly-n-st-fist.r\" d=\"~~DA9SYE1ww10\"/><path id=\"pec-fly-n-g0-upper.l\" d=\"~#F12U)F1A-D1IxF1VND1O7-229NG1Naz4R4z2E2Rs.e-eBfXf*4-kw4)v*3*2kx6J1wF1wf3aX7*1I9weFkYkNlU6PsI500000010100000200001001200000000000002001012101010000010000020210000000000000200\"/><path id=\"pec-fly-n-g0-elbowcap.l\" d=\"~~yGP1__E1Dz10\"/><path id=\"pec-fly-n-g0-fore.l\" d=\"~#F12UJR1U)F1xXP1.!F1*7R1P1pHx1-3E7K3X1T1zl7.cV6Bb2Vc(6zlm-1U1z7U3Nx1D3N1m.7_1R6FaWjFaDh1PjXa01000020001010000000000000100000000101120010000020000001010020000000000002010000\"/><path id=\"pec-fly-n-g0-fist.l\" d=\"~~_!X1SYE1ww10\"/><path id=\"pec-fly-n-g0-upper.r\" d=\"~#F12FxsP*z1xwt.Uz1Y7*14a)E1wfy6J1(2kww1*3_kw4Yf*4_eBfSs.eA2E2A4R4KG1Na19P7-27*gOsI5KlU6EkYk11100000200000000000022000121000001010002200010010000000000000000002000000000000\"/><path id=\"pec-fly-n-g0-elbowcap.r\" d=\"~~wNj__E1Dz10\"/><path id=\"pec-fly-n-g0-fore.r\" d=\"~#F12SRkwWD1xElB-D1!7_1K1mKx1D3A7U3_1U1AlmWc(6Db2!cV6Al7Y1T1F7K3Gx1-3O1p(7R1Y6zaOjXaBh1VjFa00100011111010100000200022111100000020000000000000000000100000010000010200000000\"/><path id=\"pec-fly-n-g0-fist.r\" d=\"~~WwcSYE1ww10\"/><path id=\"pec-fly-n-g1-upper.l\" d=\"~#F12S.F1UXD1)BF1TKD1G5X247Du!9O2I4E1z2xdVbOdKgBfG6zlA2RhvG2g*4P1JsFe3aV5.1BiwaHiPmYkP8_s-200000000002001001000000100000000200022000000200002012020000000020000020000100210\"/><path id=\"pec-fly-n-g1-elbowcap.l\" d=\"~~PxN1yXE1Dz10\"/><path id=\"pec-fly-n-g1-fore.l\" d=\"~#F12FAO1!.F1BYN1XYF1K4X1qnWiG3*3R3vT1X3fTc*6Eb5.cW6V3evU1z4P3WiW3qoK4W1Gg(9PjYaFh6UjGa00101000100111000200021200220000010100000202001000012101000010100100002000000020\"/><path id=\"pec-fly-n-g1-fist.l\" d=\"~~HIS1SYE1ww10\"/><path id=\"pec-fly-n-g1-upper.r\" d=\"~#F12D*r((z1OTsVWz1W5.14aIsFe(4P1H2gShvAlA2DfG6PdKgydVbF1z2P2I4Bu!937H5X2_5*j-s-2XkP8GiPm12000000101001020010000000120010000000101100002000011000000000100002200000020010\"/><path id=\"pec-fly-n-g1-elbowcap.r\" d=\"~~UVlyXE1Dz10\"/><path id=\"pec-fly-n-g1-fore.r\" d=\"~#F12JYmHSD1KAnBVD1N4W1poViW3A4P3w1U1W3e!cW6Fb5Uc*6Y3fw1T1(3R3ViG3pnN4X1(fGaTjGaEh6OjYa20001000011101002000021210000101000012002202000200210120000000001000000010000001\"/><path id=\"pec-fly-n-g1-fist.r\" d=\"~~DShSYE1ww10\"/><path id=\"pec-fly-n-g2-upper.l\" d=\"~#F12_JF1yND1xAF1KAD1x2R287AeDakV36.1H6*1R6Bk)bIbKkT5V1H6-1cV3o!aWd76V2.1IsV4w9PrHgPf!rY701010100000110020000010000200010000000011010100000000011011010000101000000100021\"/><path id=\"pec-fly-n-g2-elbowcap.l\" d=\"~~(YH1_VE1Dz10\"/><path id=\"pec-fly-n-g2-fore.l\" d=\"~#F12YNI1AYF1BOI1zVF1cT1alF2*2y1G3iR1Ag_5K9xbKa)3IeW1YfW6hN1R1F37U37opP1IthNe(gygD6ymT200020000010000000200000101010100022000100020000200002002000001011000000121000000\"/><path id=\"pec-fly-n-g2-fist.l\" d=\"~~DzI1SYE1ww10\"/><path id=\"pec-fly-n-g2-upper.r\" d=\"~#F12NNrSFA1OYrGwA1W2.186.aWdW3o_1cW1H6NkT5wcIbS6BkG6*15.1jV3zeDa77y2R2w6Bs.rY7GgPf)8Pr00000001210000000000002001000000200010101001000002200100000101011100201010000101\"/><path id=\"pec-fly-n-g2-elbowcap.r\" d=\"~~D(o_VE1Dz10\"/><path id=\"pec-fly-n-g2-fore.r\" d=\"~#F12wUpSTD1VVpzWD1qP18o8U3S1F3iN1XfW6JeW1Na)3N9xbzg_5hR1x1G3E2*29lbT1(lOjxmT2xgD6Ke(g01010000021000000200100020001002000101010110100200000011100002000000001101000020\"/><path id=\"pec-fly-n-g2-fist.r\" d=\"~~H_oSYE1ww10\"/><path id=\"pec-fly-n-e-head\" d=\"~#D12Y(y1DErzVx1-wrEjJeXcFbT9A3-4B3B3z3-4E3-4)7R1)7B3R9D3R9S1)7_4)7_4E3D3z3_4B3U9A3YcFbFjJe0000100200001010000000101100002100000000000011000001000000002020000002200000\"/><path id=\"pec-fly-n-e-torso\" d=\"~#A22SIA1(Dw1)GA1B_u!c*iArsy8z9K6I3IeUg-J1(d-4-cU9YsT9_c_4R9DjK6U9N6-c1)nVc)E1xoID2zrJD2zrwF1xowoVc_c1T9N6BjK6-4R9U9_cT9Ys_4-c_J1(dJeUgN6I3x8z9zrs.c*iyY2YJ10220001000002002100000010101012000000000000000200000000200002100020200110000020000001000000000000000100101010100000012100000200010020000\"/><path id=\"pec-fly-n-e-thigh.l\" d=\"~#F12wDA1FXU1..z1IVU1x38jA1UcY3_1*5qV2Sey6)cTmxhVaxqX1!bNaz2!1O4F4(8U9kvv-2I_1awnHF1PuwjFN1y300001000020100010100001111001200001010010101000000000112000000020000000120000000\"/><path id=\"pec-fly-n-e-kneecap.l\" d=\"~~JBD1HwU1_J10\"/><path id=\"pec-fly-n-e-shank.l\" d=\"~#F12YzD1wyU1XBD1-SS1J1-bF11D7S(1U5z8U2*3B6Ry2_6.df)bX7GdF1Xy2.2.3G6T7O2((1E12E2XbIcycGcApoWlDeDo00000001011010011000020000000000002002020000001010000200002000200000000000000000\"/><path id=\"pec-fly-n-e-foot.l\" d=\"~#e2wSE1yP)1R)B1TS)1ErN-1)dVtVN1.gX9*5HE1)x1_h*o0011000020101001000010002000\"/><path id=\"pec-fly-n-e-thigh.r\" d=\"~#F12wDvwVP1xJvXJP1w1-2jv*8U9P4F4A2!1.bNayqX1yhVawdTmRey6pV2-1*5TcY3kA1y38DpRU1EN1y3Ouwj)mHF102000000220100000000010101000010102200010110101111000102002000000000001001000000\"/><path id=\"pec-fly-n-e-kneecap.r\" d=\"~~S(sHwU1_J10\"/><path id=\"pec-fly-n-e-shank.r\" d=\"~#F12w*sS(T1OytTOS1F2XbF12P2((1H6T7!2.3E1Xy2Y7Gdg)b-6.dD6Ry2T2*3T5z8B7S(1E11I1-bEdybBeDonWlHcAp10001000000200000000000002021000000000000002002001000001010000000000000000000000\"/><path id=\"pec-fly-n-e-foot.r\" d=\"~#e2PIuyP)1**vTS)1FrN-1weVtWN1.gY9*5GE1)x1-h*o0021000010000001000020001000\"/><path id=\"pec-fly-n-e-shcap.l\" d=\"~~(*E1HIB1wP10\"/><path id=\"pec-fly-n-e-upper.l\" d=\"~#F12wAF1wUA1.GF1KIA1W1)186T4DdS32Y11A1Y9(hOb(7IecGl*8D4pK1)1x3X8(a75qK2G1)uIoWf*aWjb(s00000200000000000000000000000010102101001000001000200020000000200000200002200101\"/><path id=\"pec-fly-n-e-elbowcap.l\" d=\"~~YwE1!WE1Dz10\"/><path id=\"pec-fly-n-e-fore.l\" d=\"~#F12NzF1ySD1BNF1*UD1(3Y1lmOgY3S3P3uS1F1g!cU6Db5Wc)6F1dsV1P3R3VgE3ln(3-1HhGaXjGaBhaKjYa00000200010000101001010020000000000000000021010000100000010000000001010000111001\"/><path id=\"pec-fly-n-e-fist.l\" d=\"~~NJz1SYE1ww10\"/><path id=\"pec-fly-n-e-shcap.r\" d=\"~~S)qHIB1wP10\"/><path id=\"pec-fly-n-e-upper.r\" d=\"~#F12UBrUyD1Kxrz-B1pK285Y8(aw2x3qK1(8D4bGl*7Ie*hObz1Y9X11R32U4Dd76V1)1*qEfc(s(aWjJoWf10000000100010002000002000011100001010000000000000000000000200000101100200100000\"/><path id=\"pec-fly-n-e-elbowcap.r\" d=\"~~HWs!WE1Dz10\"/><path id=\"pec-fly-n-e-fore.r\" d=\"~#F12w-tU.F1GNtKYF1*3-1mnWgE3O3R3rV1E1dVc)6Bb5.cU6E1gtS1R3P3PgY3mm*3Y1Th!9NjYaDhaYjGa00101001000020000001110000000000000000100011110000000001000200000100010000010100\"/><path id=\"pec-fly-n-e-fist.r\" d=\"~~yRw1SYE1ww10\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#pec-fly-n-dots)\"/>\n  <path class=\"floorline\" d=\"M88.3 339.5H269.7\"/><path class=\"eq\" d=\"~MDTuHIX1LAX80Qwp0z(7)oL)owbQ0)o)o)aLz(7wpQ)o0A(7wpLwp)aQ0wpwpwbZ\"/><path class=\"eq\" d=\"~MHzy1W_X1L0JH9Q0F6F6zA9LAA1E6QF60zA1E6LE6zA9Q0E6E6AA9LzA1F6QE60AA1F6Z\"/><path class=\"eq\" d=\"~M!.sYDy2LYBc0QF60O)bE6LE6V8Q0E6E6W8LO)bF6QE60P)bF6LF6W8Q0F6F6V8Z\"/><path class=\"eq\" d=\"~MJFvFTU1LYJ70QYi0)-6XiLXiXwjQ0XiXiYwjL)-6YiQXi0w_6YiLYiYwjQ0YiYiXwjZ\"/><path class=\"eq\" d=\"~M(Jy1HIx2LUz10QYi0.gXiLXi)-D1Q0XiXiw_D1L.gYiQXi0!gYiLYiw_D1Q0YiYi)-D1Z\"/><path class=\"eq\" d=\"~MD-qy-pLAIg0QYi0IYfXiLXiX7Q0XiXiY7LIYfYiQXi0JYfYiLYiY7Q0YiYiX7Z\"/><path class=\"eq\" d=\"~MPRqHIx2LD80QYi0SaXiLXi)-D1Q0XiXiw_D1LSaYiQXi0RaYiLYiw_D1Q0YiYi)-D1Z\"/><path class=\"eq\" d=\"~M_zI1HIx2LD80QYi0SaXiLXi)-D1Q0XiXiw_D1LSaYiQXi0RaYiLYiw_D1Q0YiYi)-D1Z\"/><path class=\"eq-solid\" d=\"~~JGF1y-oSA10\"/><path class=\"eq-pin\" d=\"~~WEG1y-oF60\"/><path class=\"eq-solid\" d=\"~~wIry-oSA10\"/><path class=\"eq-pin\" d=\"~~HGsy-oF60\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pec-fly-n-st-upper.l\"/><use href=\"#pec-fly-n-st-elbowcap.l\"/><use href=\"#pec-fly-n-st-fore.l\"/><use href=\"#pec-fly-n-st-fist.l\"/><use href=\"#pec-fly-n-st-upper.r\"/><use href=\"#pec-fly-n-st-elbowcap.r\"/><use href=\"#pec-fly-n-st-fore.r\"/><use href=\"#pec-fly-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pec-fly-n-st-upper.l\"/><use href=\"#pec-fly-n-st-elbowcap.l\"/><use href=\"#pec-fly-n-st-fore.l\"/><use href=\"#pec-fly-n-st-fist.l\"/><use href=\"#pec-fly-n-st-upper.r\"/><use href=\"#pec-fly-n-st-elbowcap.r\"/><use href=\"#pec-fly-n-st-fore.r\"/><use href=\"#pec-fly-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pec-fly-n-g0-upper.l\"/><use href=\"#pec-fly-n-g0-elbowcap.l\"/><use href=\"#pec-fly-n-g0-fore.l\"/><use href=\"#pec-fly-n-g0-fist.l\"/><use href=\"#pec-fly-n-g0-upper.r\"/><use href=\"#pec-fly-n-g0-elbowcap.r\"/><use href=\"#pec-fly-n-g0-fore.r\"/><use href=\"#pec-fly-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pec-fly-n-g0-upper.l\"/><use href=\"#pec-fly-n-g0-elbowcap.l\"/><use href=\"#pec-fly-n-g0-fore.l\"/><use href=\"#pec-fly-n-g0-fist.l\"/><use href=\"#pec-fly-n-g0-upper.r\"/><use href=\"#pec-fly-n-g0-elbowcap.r\"/><use href=\"#pec-fly-n-g0-fore.r\"/><use href=\"#pec-fly-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pec-fly-n-g1-upper.l\"/><use href=\"#pec-fly-n-g1-elbowcap.l\"/><use href=\"#pec-fly-n-g1-fore.l\"/><use href=\"#pec-fly-n-g1-fist.l\"/><use href=\"#pec-fly-n-g1-upper.r\"/><use href=\"#pec-fly-n-g1-elbowcap.r\"/><use href=\"#pec-fly-n-g1-fore.r\"/><use href=\"#pec-fly-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pec-fly-n-g1-upper.l\"/><use href=\"#pec-fly-n-g1-elbowcap.l\"/><use href=\"#pec-fly-n-g1-fore.l\"/><use href=\"#pec-fly-n-g1-fist.l\"/><use href=\"#pec-fly-n-g1-upper.r\"/><use href=\"#pec-fly-n-g1-elbowcap.r\"/><use href=\"#pec-fly-n-g1-fore.r\"/><use href=\"#pec-fly-n-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pec-fly-n-g2-upper.l\"/><use href=\"#pec-fly-n-g2-elbowcap.l\"/><use href=\"#pec-fly-n-g2-fore.l\"/><use href=\"#pec-fly-n-g2-fist.l\"/><use href=\"#pec-fly-n-g2-upper.r\"/><use href=\"#pec-fly-n-g2-elbowcap.r\"/><use href=\"#pec-fly-n-g2-fore.r\"/><use href=\"#pec-fly-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pec-fly-n-g2-upper.l\"/><use href=\"#pec-fly-n-g2-elbowcap.l\"/><use href=\"#pec-fly-n-g2-fore.l\"/><use href=\"#pec-fly-n-g2-fist.l\"/><use href=\"#pec-fly-n-g2-upper.r\"/><use href=\"#pec-fly-n-g2-elbowcap.r\"/><use href=\"#pec-fly-n-g2-fore.r\"/><use href=\"#pec-fly-n-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pec-fly-n-e-head\"/><use href=\"#pec-fly-n-e-torso\"/></g><g class=\"u-fill\"><use href=\"#pec-fly-n-e-head\"/><use href=\"#pec-fly-n-e-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pec-fly-n-e-thigh.l\"/><use href=\"#pec-fly-n-e-kneecap.l\"/><use href=\"#pec-fly-n-e-shank.l\"/><use href=\"#pec-fly-n-e-foot.l\"/><use href=\"#pec-fly-n-e-thigh.r\"/><use href=\"#pec-fly-n-e-kneecap.r\"/><use href=\"#pec-fly-n-e-shank.r\"/><use href=\"#pec-fly-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pec-fly-n-e-thigh.l\"/><use href=\"#pec-fly-n-e-kneecap.l\"/><use href=\"#pec-fly-n-e-shank.l\"/><use href=\"#pec-fly-n-e-foot.l\"/><use href=\"#pec-fly-n-e-thigh.r\"/><use href=\"#pec-fly-n-e-kneecap.r\"/><use href=\"#pec-fly-n-e-shank.r\"/><use href=\"#pec-fly-n-e-foot.r\"/></g></g><path class=\"eq\" d=\"~MAUF1N!oLKY4DFcQO4WbS)4)XbLDcV8QUbS4z3TeLFF4zxcQP4TbR)4AYbLBcU8QVbR4A3UeZ\"/><path class=\"eq-solid\" d=\"~My.A1(GG1L0Xy3Q0TeTeAU2LUeUeQTe0TeUeLUeAU2Q0UeUezU2LTeTeQUe0UeTeZ\"/><path class=\"eq\" d=\"^61\"/><path class=\"eq-pin\" d=\"~~NDG1y-oP70\"/><path class=\"eq\" d=\"~MY(r(JpLNY4FFcQS4WbEF4zxcLA3TeQUbO4BcV8LR)4)XbQO4VbFF4yxcLz3UeQTbP4DcU8Z\"/><path class=\"eq-solid\" d=\"~MW)x1(GG1L0Xy3Q0TeTeAU2LUeUeQTe0TeUeLUeAU2Q0UeUezU2LTeTeQUe0UeTeZ\"/><path class=\"eq\" d=\"^63\"/><path class=\"eq-pin\" d=\"~~yFsy-oP70\"/><path class=\"eq-line m-line\" d=\"~MPD!1(BB1LA6N6L.2(1LO3gLI3lL.2x2L-1*2LjK3LqI3LEzi*.cLFBiA-cL(2*1LN3fLJ3mL_2y2L!1(2LkN3LpJ3LFzi(.c\"/><path class=\"eq-line m-line\" d=\"~MWH.1SYB1LA1R5Ly2qLS1S1Lqy2L2F2Lry2LT1S1L)1qLz1N_3Lz1I_3L)1rLT1R1Lrz2L2z2Lqz2LS1R1Ly2rLA1I_3\"/><path class=\"eq-line m-line\" d=\"~MJRaFID1Lz8U3LpI3LkK3L_1*2L!2x2LJ3lLP3gL!2(1LFBiz-cLEzi(.cLqJ3LjN3L.1(2L-2y2LI3mLK3fL*2*1LEBiA-c\"/><path class=\"eq-line m-line\" d=\"~MSV9SYB1LA1R5Lw2qLU1S1Lsy2L1F2Lpy2LR1S1Lx2qLz1N_3Lz1I_3Lx2rLR1R1Lpz2L1z2Lsz2LU1R1Lw2rLA1I_3\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#pec-fly-n-e-shcap.l\"/><use href=\"#pec-fly-n-e-upper.l\"/><use href=\"#pec-fly-n-e-elbowcap.l\"/><use href=\"#pec-fly-n-e-fore.l\"/><use href=\"#pec-fly-n-e-fist.l\"/><use href=\"#pec-fly-n-e-shcap.r\"/><use href=\"#pec-fly-n-e-upper.r\"/><use href=\"#pec-fly-n-e-elbowcap.r\"/><use href=\"#pec-fly-n-e-fore.r\"/><use href=\"#pec-fly-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pec-fly-n-e-shcap.l\"/><use href=\"#pec-fly-n-e-upper.l\"/><use href=\"#pec-fly-n-e-elbowcap.l\"/><use href=\"#pec-fly-n-e-fore.l\"/><use href=\"#pec-fly-n-e-fist.l\"/><use href=\"#pec-fly-n-e-shcap.r\"/><use href=\"#pec-fly-n-e-upper.r\"/><use href=\"#pec-fly-n-e-elbowcap.r\"/><use href=\"#pec-fly-n-e-fore.r\"/><use href=\"#pec-fly-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"212.15\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"205.43\" cy=\"203.34\" r=\"2.25\"/><circle class=\"joint\" cx=\"152.57\" cy=\"203.34\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#y20HWcSYE1*IcRYE1J20102000D20100000!10000000S10102000A10002010s0100020c000001040100000000010000000000000200010101000000000200020002000200000101000000000001000002000000000000000000000000000100010001000002010101000100000\"/><path class=\"arrow\" d=\"~MHBw1SYE1LOB1YiLPB1EY1Z\"/></g><path class=\"leader\" d=\"~M!GS1JwF1L0AS2\"/><circle class=\"anchor\" cx=\"257.58\" cy=\"204.86\" r=\"1.5\"/><path class=\"leader\" d=\"~MDAaSYE1L0NV8\"/><circle class=\"anchor\" cx=\"51.87\" cy=\"203.61\" r=\"1.5\"/><path class=\"leader\" d=\"M179 203.61L138.45 236H128.45\"/><circle class=\"anchor\" cx=\"179\" cy=\"203.61\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"pec-fly-n-elbows\" data-key=\"elbows\" data-cue=\"Keep a slight, fixed bend in the elbows.\" class=\"plate-callout two\" style=\"left:65.92%;top:59.78%\" aria-pressed=\"true\">Soft<br>elbows</button><button type=\"button\" id=\"pec-fly-n-height\" data-key=\"height\" data-cue=\"Set the seat so the arms move at chest-to-shoulder height.\" class=\"plate-callout two\" style=\"left:5.59%;top:68.16%\" aria-pressed=\"false\">Chest<br>height</button><button type=\"button\" id=\"pec-fly-n-meet\" data-key=\"meet\" data-cue=\"Bring the handles together in front of the chest each rep.\" class=\"plate-callout two\" style=\"left:22.07%;top:59.78%\" aria-pressed=\"false\">Hands<br>meet</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"pec-fly-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"pec-fly-m-st-upper.l\" d=\"^0\"/><path id=\"pec-fly-m-st-elbowcap.l\" d=\"^1\"/><path id=\"pec-fly-m-st-fore.l\" d=\"^2\"/><path id=\"pec-fly-m-st-fist.l\" d=\"^3\"/><path id=\"pec-fly-m-st-upper.r\" d=\"^4\"/><path id=\"pec-fly-m-st-elbowcap.r\" d=\"^5\"/><path id=\"pec-fly-m-st-fore.r\" d=\"^6\"/><path id=\"pec-fly-m-st-fist.r\" d=\"^7\"/><path id=\"pec-fly-m-g0-upper.l\" d=\"^8\"/><path id=\"pec-fly-m-g0-elbowcap.l\" d=\"^9\"/><path id=\"pec-fly-m-g0-fore.l\" d=\"^10\"/><path id=\"pec-fly-m-g0-fist.l\" d=\"^11\"/><path id=\"pec-fly-m-g0-upper.r\" d=\"^12\"/><path id=\"pec-fly-m-g0-elbowcap.r\" d=\"^13\"/><path id=\"pec-fly-m-g0-fore.r\" d=\"^14\"/><path id=\"pec-fly-m-g0-fist.r\" d=\"^15\"/><path id=\"pec-fly-m-g1-upper.l\" d=\"^16\"/><path id=\"pec-fly-m-g1-elbowcap.l\" d=\"^17\"/><path id=\"pec-fly-m-g1-fore.l\" d=\"^18\"/><path id=\"pec-fly-m-g1-fist.l\" d=\"^19\"/><path id=\"pec-fly-m-g1-upper.r\" d=\"^20\"/><path id=\"pec-fly-m-g1-elbowcap.r\" d=\"^21\"/><path id=\"pec-fly-m-g1-fore.r\" d=\"^22\"/><path id=\"pec-fly-m-g1-fist.r\" d=\"^23\"/><path id=\"pec-fly-m-g2-upper.l\" d=\"^24\"/><path id=\"pec-fly-m-g2-elbowcap.l\" d=\"^25\"/><path id=\"pec-fly-m-g2-fore.l\" d=\"^26\"/><path id=\"pec-fly-m-g2-fist.l\" d=\"^27\"/><path id=\"pec-fly-m-g2-upper.r\" d=\"^28\"/><path id=\"pec-fly-m-g2-elbowcap.r\" d=\"^29\"/><path id=\"pec-fly-m-g2-fore.r\" d=\"^30\"/><path id=\"pec-fly-m-g2-fist.r\" d=\"^31\"/><path id=\"pec-fly-m-e-head\" d=\"^32\"/><path id=\"pec-fly-m-e-torso\" d=\"^33\"/><path id=\"pec-fly-m-e-thigh.l\" d=\"^34\"/><path id=\"pec-fly-m-e-kneecap.l\" d=\"^35\"/><path id=\"pec-fly-m-e-shank.l\" d=\"^36\"/><path id=\"pec-fly-m-e-foot.l\" d=\"^37\"/><path id=\"pec-fly-m-e-thigh.r\" d=\"^38\"/><path id=\"pec-fly-m-e-kneecap.r\" d=\"^39\"/><path id=\"pec-fly-m-e-shank.r\" d=\"^40\"/><path id=\"pec-fly-m-e-foot.r\" d=\"^41\"/><path id=\"pec-fly-m-e-shcap.l\" d=\"^42\"/><path id=\"pec-fly-m-e-upper.l\" d=\"^43\"/><path id=\"pec-fly-m-e-elbowcap.l\" d=\"^44\"/><path id=\"pec-fly-m-e-fore.l\" d=\"^45\"/><path id=\"pec-fly-m-e-fist.l\" d=\"^46\"/><path id=\"pec-fly-m-e-shcap.r\" d=\"^47\"/><path id=\"pec-fly-m-e-upper.r\" d=\"^48\"/><path id=\"pec-fly-m-e-elbowcap.r\" d=\"^49\"/><path id=\"pec-fly-m-e-fore.r\" d=\"^50\"/><path id=\"pec-fly-m-e-fist.r\" d=\"^51\"/><path id=\"pec-fly-m-m-upper.l\" d=\"~#F12wYF1wWD1*DF1BJD1z4T227Po_9O1E4px2K5G9xcKhVeR7ElaVaw1z2iK4F1HmDe56R4X1RmS6Jg!nwkFawtf01000212002100000000000000001000010121002000001010002001010002002001102100012000\"/><path id=\"pec-fly-m-m-elbowcap.l\" d=\"~~U!J1HWE1Dz10\"/><path id=\"pec-fly-m-m-fore.l\" d=\"~#F12!(K1A.F1BXK1*XF1X2-1glDcB3O2T3hT1w49OcE7Gb7.cP6w4ilU1T2N3(b_3gq.2U1TkS9FjybFhe!j)911200000101000002000001000200110002000000000000000001000002001010111002000200101\"/><path id=\"pec-fly-m-m-fist.l\" d=\"~~wXO1SYE1ww10\"/><path id=\"pec-fly-m-m-upper.r\" d=\"~#F12U-rUwA1RIsOYz1S4X166GmDeN4F1A2iWaw1FlaWeR7ycKhN5G9qx2P1E4Oo_917A4T2_7Em)sf)jFaIg!n00121001011000000000001000110101000010000000000000001100220200010010010011200110\"/><path id=\"pec-fly-m-m-elbowcap.r\" d=\"~~P_mHWE1Dz10\"/><path id=\"pec-fly-m-m-fore.r\" d=\"~#F12Y!nSRD1TAoIUD1!2U1fq*b_3U2N3mU1)3i!cP6Hb7PcE7)39iT1P2T3BcB3flY2-1DkVa.j)9EheEjyb01011000002000000000000000001000200110002000001000100020000010210101100010002101\"/><path id=\"pec-fly-m-m-fist.r\" d=\"~~PDkSYE1ww10\"/><path id=\"pec-fly-m-m-eq0\" d=\"~MAwG1AOpL_!6YGcQA6!a-I6)AcLy1.eQ(az6Ed.6LTx7XYbQz6.a_I6wBcLx1!eQ*ay6Fd!6Z\"/><path id=\"pec-fly-m-m-eq1\" d=\"~MUBR1(GG1L0Xy3Q0TeTeAU2LUeUeQTe0TeUeLUeAU2Q0UeUezU2LTeTeQUe0UeTeZ\"/><path id=\"pec-fly-m-m-eq2\" d=\"~MPVrYYoL-!6YGcQz6!aUx7XYbLFd.6Q!aA6x1.eL_I6)AcQA6*aTx7YYbLEd!6Q.az6y1!eZ\"/><path id=\"pec-fly-m-m-eq3\" d=\"~MAVl(GG1L0Xy3Q0TeTeAU2LUeUeQTe0TeUeLUeAU2Q0UeUezU2LTeTeQUe0UeTeZ\"/><path id=\"pec-fly-m-mf-head\" d=\"^32\"/><path id=\"pec-fly-m-mf-torso\" d=\"^33\"/><path id=\"pec-fly-m-mf-thigh.l\" d=\"^34\"/><path id=\"pec-fly-m-mf-kneecap.l\" d=\"^35\"/><path id=\"pec-fly-m-mf-shank.l\" d=\"^36\"/><path id=\"pec-fly-m-mf-foot.l\" d=\"^37\"/><path id=\"pec-fly-m-mf-shcap.l\" d=\"^42\"/><path id=\"pec-fly-m-mf-thigh.r\" d=\"^38\"/><path id=\"pec-fly-m-mf-kneecap.r\" d=\"^39\"/><path id=\"pec-fly-m-mf-shank.r\" d=\"^40\"/><path id=\"pec-fly-m-mf-foot.r\" d=\"^41\"/><path id=\"pec-fly-m-mf-shcap.r\" d=\"^47\"/><path id=\"pec-fly-m-mo-0\" d=\"^32\"/><path id=\"pec-fly-m-mo-1\" d=\"^33\"/><path id=\"pec-fly-m-mo-2\" d=\"^34\"/><path id=\"pec-fly-m-mo-3\" d=\"^35\"/><path id=\"pec-fly-m-mo-4\" d=\"^36\"/><path id=\"pec-fly-m-mo-5\" d=\"^37\"/><path id=\"pec-fly-m-mo-6\" d=\"^42\"/><path id=\"pec-fly-m-mo-7\" d=\"^43\"/><path id=\"pec-fly-m-mo-8\" d=\"^44\"/><path id=\"pec-fly-m-mo-9\" d=\"^45\"/><path id=\"pec-fly-m-mo-10\" d=\"^46\"/><path id=\"pec-fly-m-mo-11\" d=\"^38\"/><path id=\"pec-fly-m-mo-12\" d=\"^39\"/><path id=\"pec-fly-m-mo-13\" d=\"^40\"/><path id=\"pec-fly-m-mo-14\" d=\"^41\"/><path id=\"pec-fly-m-mo-15\" d=\"^47\"/><path id=\"pec-fly-m-mo-16\" d=\"^48\"/><path id=\"pec-fly-m-mo-17\" d=\"^49\"/><path id=\"pec-fly-m-mo-18\" d=\"^50\"/><path id=\"pec-fly-m-mo-19\" d=\"^51\"/><path id=\"pec-fly-m-mo-20\" d=\"^53\"/><path id=\"pec-fly-m-mo-21\" d=\"^54\"/><path id=\"pec-fly-m-mo-22\" d=\"^55\"/><path id=\"pec-fly-m-mo-23\" d=\"^56\"/><path id=\"pec-fly-m-mo-24\" d=\"^57\"/><path id=\"pec-fly-m-mo-25\" d=\"^58\"/><path id=\"pec-fly-m-mo-26\" d=\"^59\"/><path id=\"pec-fly-m-mo-27\" d=\"^60\"/><path id=\"pec-fly-m-mo-28\" d=\"^61\"/><path id=\"pec-fly-m-mo-29\" d=\"^62\"/><path id=\"pec-fly-m-mo-30\" d=\"^65\"/><path id=\"pec-fly-m-mo-31\" d=\"^66\"/><path id=\"pec-fly-m-mo-32\" d=\"^61\"/><path id=\"pec-fly-m-mo-33\" d=\"^67\"/><path id=\"pec-fly-m-mo-34\" d=\"^63\"/><path id=\"pec-fly-m-mo-35\" d=\"^64\"/><path id=\"pec-fly-m-mo-36\" d=\"^68\"/><path id=\"pec-fly-m-mo-37\" d=\"^69\"/><path id=\"pec-fly-m-mo-38\" d=\"^63\"/><path id=\"pec-fly-m-mo-39\" d=\"^70\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#pec-fly-m-dots)\"/>\n  <path class=\"floorline\" d=\"^52\"/><path class=\"eq\" d=\"^53\"/><path class=\"eq\" d=\"^54\"/><path class=\"eq\" d=\"^55\"/><path class=\"eq\" d=\"^56\"/><path class=\"eq\" d=\"^57\"/><path class=\"eq\" d=\"^58\"/><path class=\"eq\" d=\"^59\"/><path class=\"eq\" d=\"^60\"/><path class=\"eq-solid\" d=\"^61\"/><path class=\"eq-pin\" d=\"^62\"/><path class=\"eq-solid\" d=\"^63\"/><path class=\"eq-pin\" d=\"^64\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pec-fly-m-st-upper.l\"/><use href=\"#pec-fly-m-st-elbowcap.l\"/><use href=\"#pec-fly-m-st-fore.l\"/><use href=\"#pec-fly-m-st-fist.l\"/><use href=\"#pec-fly-m-st-upper.r\"/><use href=\"#pec-fly-m-st-elbowcap.r\"/><use href=\"#pec-fly-m-st-fore.r\"/><use href=\"#pec-fly-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pec-fly-m-st-upper.l\"/><use href=\"#pec-fly-m-st-elbowcap.l\"/><use href=\"#pec-fly-m-st-fore.l\"/><use href=\"#pec-fly-m-st-fist.l\"/><use href=\"#pec-fly-m-st-upper.r\"/><use href=\"#pec-fly-m-st-elbowcap.r\"/><use href=\"#pec-fly-m-st-fore.r\"/><use href=\"#pec-fly-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pec-fly-m-g0-upper.l\"/><use href=\"#pec-fly-m-g0-elbowcap.l\"/><use href=\"#pec-fly-m-g0-fore.l\"/><use href=\"#pec-fly-m-g0-fist.l\"/><use href=\"#pec-fly-m-g0-upper.r\"/><use href=\"#pec-fly-m-g0-elbowcap.r\"/><use href=\"#pec-fly-m-g0-fore.r\"/><use href=\"#pec-fly-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pec-fly-m-g0-upper.l\"/><use href=\"#pec-fly-m-g0-elbowcap.l\"/><use href=\"#pec-fly-m-g0-fore.l\"/><use href=\"#pec-fly-m-g0-fist.l\"/><use href=\"#pec-fly-m-g0-upper.r\"/><use href=\"#pec-fly-m-g0-elbowcap.r\"/><use href=\"#pec-fly-m-g0-fore.r\"/><use href=\"#pec-fly-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pec-fly-m-g1-upper.l\"/><use href=\"#pec-fly-m-g1-elbowcap.l\"/><use href=\"#pec-fly-m-g1-fore.l\"/><use href=\"#pec-fly-m-g1-fist.l\"/><use href=\"#pec-fly-m-g1-upper.r\"/><use href=\"#pec-fly-m-g1-elbowcap.r\"/><use href=\"#pec-fly-m-g1-fore.r\"/><use href=\"#pec-fly-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pec-fly-m-g1-upper.l\"/><use href=\"#pec-fly-m-g1-elbowcap.l\"/><use href=\"#pec-fly-m-g1-fore.l\"/><use href=\"#pec-fly-m-g1-fist.l\"/><use href=\"#pec-fly-m-g1-upper.r\"/><use href=\"#pec-fly-m-g1-elbowcap.r\"/><use href=\"#pec-fly-m-g1-fore.r\"/><use href=\"#pec-fly-m-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pec-fly-m-g2-upper.l\"/><use href=\"#pec-fly-m-g2-elbowcap.l\"/><use href=\"#pec-fly-m-g2-fore.l\"/><use href=\"#pec-fly-m-g2-fist.l\"/><use href=\"#pec-fly-m-g2-upper.r\"/><use href=\"#pec-fly-m-g2-elbowcap.r\"/><use href=\"#pec-fly-m-g2-fore.r\"/><use href=\"#pec-fly-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pec-fly-m-g2-upper.l\"/><use href=\"#pec-fly-m-g2-elbowcap.l\"/><use href=\"#pec-fly-m-g2-fore.l\"/><use href=\"#pec-fly-m-g2-fist.l\"/><use href=\"#pec-fly-m-g2-upper.r\"/><use href=\"#pec-fly-m-g2-elbowcap.r\"/><use href=\"#pec-fly-m-g2-fore.r\"/><use href=\"#pec-fly-m-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pec-fly-m-e-head\"/><use href=\"#pec-fly-m-e-torso\"/></g><g class=\"u-fill\"><use href=\"#pec-fly-m-e-head\"/><use href=\"#pec-fly-m-e-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pec-fly-m-e-thigh.l\"/><use href=\"#pec-fly-m-e-kneecap.l\"/><use href=\"#pec-fly-m-e-shank.l\"/><use href=\"#pec-fly-m-e-foot.l\"/><use href=\"#pec-fly-m-e-thigh.r\"/><use href=\"#pec-fly-m-e-kneecap.r\"/><use href=\"#pec-fly-m-e-shank.r\"/><use href=\"#pec-fly-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pec-fly-m-e-thigh.l\"/><use href=\"#pec-fly-m-e-kneecap.l\"/><use href=\"#pec-fly-m-e-shank.l\"/><use href=\"#pec-fly-m-e-foot.l\"/><use href=\"#pec-fly-m-e-thigh.r\"/><use href=\"#pec-fly-m-e-kneecap.r\"/><use href=\"#pec-fly-m-e-shank.r\"/><use href=\"#pec-fly-m-e-foot.r\"/></g></g><path class=\"eq\" d=\"^65\"/><path class=\"eq-solid\" d=\"^66\"/><path class=\"eq\" d=\"^61\"/><path class=\"eq-pin\" d=\"^67\"/><path class=\"eq\" d=\"^68\"/><path class=\"eq-solid\" d=\"^69\"/><path class=\"eq\" d=\"^63\"/><path class=\"eq-pin\" d=\"^70\"/><path class=\"eq-line m-line\" d=\"^71\"/><path class=\"eq-line m-line\" d=\"^72\"/><path class=\"eq-line m-line\" d=\"^73\"/><path class=\"eq-line m-line\" d=\"^74\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#pec-fly-m-e-shcap.l\"/><use href=\"#pec-fly-m-e-upper.l\"/><use href=\"#pec-fly-m-e-elbowcap.l\"/><use href=\"#pec-fly-m-e-fore.l\"/><use href=\"#pec-fly-m-e-fist.l\"/><use href=\"#pec-fly-m-e-shcap.r\"/><use href=\"#pec-fly-m-e-upper.r\"/><use href=\"#pec-fly-m-e-elbowcap.r\"/><use href=\"#pec-fly-m-e-fore.r\"/><use href=\"#pec-fly-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pec-fly-m-e-shcap.l\"/><use href=\"#pec-fly-m-e-upper.l\"/><use href=\"#pec-fly-m-e-elbowcap.l\"/><use href=\"#pec-fly-m-e-fore.l\"/><use href=\"#pec-fly-m-e-fist.l\"/><use href=\"#pec-fly-m-e-shcap.r\"/><use href=\"#pec-fly-m-e-upper.r\"/><use href=\"#pec-fly-m-e-elbowcap.r\"/><use href=\"#pec-fly-m-e-fore.r\"/><use href=\"#pec-fly-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"212.15\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"205.43\" cy=\"203.34\" r=\"2.25\"/><circle class=\"joint\" cx=\"152.57\" cy=\"203.34\" r=\"2.25\"/></g><mask id=\"pec-fly-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#pec-fly-m-mf-head\" fill=\"#000\"/><use href=\"#pec-fly-m-mf-torso\" fill=\"#000\"/><use href=\"#pec-fly-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#pec-fly-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#pec-fly-m-mf-shank.l\" fill=\"#000\"/><use href=\"#pec-fly-m-mf-foot.l\" fill=\"#000\"/><use href=\"#pec-fly-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#pec-fly-m-m-upper.l\" fill=\"#000\"/><use href=\"#pec-fly-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#pec-fly-m-m-fore.l\" fill=\"#000\"/><use href=\"#pec-fly-m-m-fist.l\" fill=\"#000\"/><use href=\"#pec-fly-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#pec-fly-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#pec-fly-m-mf-shank.r\" fill=\"#000\"/><use href=\"#pec-fly-m-mf-foot.r\" fill=\"#000\"/><use href=\"#pec-fly-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#pec-fly-m-m-upper.r\" fill=\"#000\"/><use href=\"#pec-fly-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#pec-fly-m-m-fore.r\" fill=\"#000\"/><use href=\"#pec-fly-m-m-fist.r\" fill=\"#000\"/><use href=\"#pec-fly-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-36\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-37\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-38\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pec-fly-m-mo-39\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#pec-fly-m-mmask)\"><g class=\"u-stroke\"><use href=\"#pec-fly-m-m-upper.l\"/><use href=\"#pec-fly-m-m-elbowcap.l\"/><use href=\"#pec-fly-m-m-fore.l\"/><use href=\"#pec-fly-m-m-fist.l\"/><use href=\"#pec-fly-m-m-upper.r\"/><use href=\"#pec-fly-m-m-elbowcap.r\"/><use href=\"#pec-fly-m-m-fore.r\"/><use href=\"#pec-fly-m-m-fist.r\"/><use href=\"#pec-fly-m-m-eq0\"/><use href=\"#pec-fly-m-m-eq1\"/><use href=\"#pec-fly-m-m-eq2\"/><use href=\"#pec-fly-m-m-eq3\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MPDlHDI1LPPr0\"/><path class=\"m-arrow\" d=\"~MPDlNOH1L0WK1\"/><path class=\"m-arrow\" d=\"~MwXP1NOH1L0WK1\"/><path class=\"leader m\" d=\"M108.56 203.61L89.89 240H79.89\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"pec-fly-m-short\" data-key=\"short\" data-cue=\"The arms stop short: the handles finish well apart in front.\" class=\"plate-callout two m\" style=\"left:8.94%;top:60.89%\" aria-pressed=\"true\">Stops<br>short</button>",
    ]);
    return {
      view: "front",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "Keep a slight, fixed bend in the elbows." }, { key: "height", cue: "Set the seat so the arms move at chest-to-shoulder height." }, { key: "meet", cue: "Bring the handles together in front of the chest each rep." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "short",
        cues: [{ key: "short", cue: "The arms stop short: the handles finish well apart in front." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Stops short</b><span>The arms stop short: the handles finish well apart in front.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: close 2 seconds, hold 2 seconds, open 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Close</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Open</b><span>2 s</span></div></div></div>",
      alt: "Pec fly on the handle machine, front view. Seated with the back on the pad and feet flat, the lifter holds vertical handles with slightly bent elbows at chest height and sweeps the arms from out to the sides until the handles nearly meet in front of the chest.",
      mistakeAlt: "Pec Fly: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP: the card gives no thumb, contact or wrist claim."
  },
  contacts: [
    "seat-back"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set the seat so the handles are at chest level.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "vg-pecfly",
          "ace-top3-chest",
          "hl-pecdeck"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "position",
      "text": "Sit back against the pad, feet flat, shoulder-width or wider.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-top3-chest",
          "vg-pecfly"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "grip",
      "text": "Take the handles with the elbows slightly bent.",
      "zoom": "fly-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "vg-pecfly",
          "hl-pecdeck"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "load",
      "text": "Pick a weight you can take through the full range without rocking.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hl-pecdeck"
        ],
        "note": "c14"
      }
    },
    {
      "kind": "brace",
      "text": "Upper back lifting off the pad? Go lighter.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-top3-chest"
        ],
        "note": "c6"
      }
    }
  ],
  posture: [
    {
      "key": "back",
      "label": "Back on pad",
      "detail": "Upper back pressed into the pad as the handles meet. Upper back lifting off the pad to finish the rep? Go lighter.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-top3-chest"
        ],
        "note": "c6"
      }
    },
    {
      "key": "elbows",
      "label": "Soft elbows",
      "detail": "Elbows keep the same slight bend.",
      "anchor": {
        "pose": "start",
        "at": "elbow.l"
      },
      "zoom": "fly-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "vg-pecfly",
          "hl-pecdeck"
        ],
        "note": "c3"
      }
    },
    {
      "key": "height",
      "label": "Chest height",
      "detail": "Arms at chest-to-shoulder height.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "vg-pecfly",
          "ace-top3-chest",
          "hl-pecdeck"
        ],
        "note": "c2"
      }
    },
    {
      "key": "meet",
      "label": "Hands meet",
      "detail": "Go lighter until the handles nearly meet every rep.",
      "anchor": {
        "pose": "end",
        "at": "grips"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-top3-chest",
          "vg-pecfly"
        ],
        "note": "c5, c6"
      }
    },
    {
      "key": "technique",
      "label": "Changing technique",
      "detail": "Keep the same technique. Lower the weight.",
      "anchor": {
        "pose": "end",
        "at": "grip.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-top3-chest"
        ],
        "note": "c7"
      }
    },
    {
      "key": "behind",
      "label": "Arms in front",
      "detail": "Don't start with the arms behind the body.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "ace-top3-chest"
        ],
        "note": "c9. Inferred from ACE's cable crossover advice (card)."
      }
    },
    {
      "key": "grip",
      "label": "Overhand grip",
      "detail": "Overhand on the handles. On the pad version, the forearms rest on the pads.",
      "anchor": {
        "pose": "start",
        "at": "grip.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "vg-pecfly",
          "hl-pecdeck",
          "ace-top3-chest"
        ],
        "note": "card grip.type and grip.width, claims c3, c4"
      }
    },
    {
      "key": "width",
      "label": "Machine-set width",
      "detail": "The machine arms set the hand width.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "vg-pecfly",
          "hl-pecdeck",
          "ace-top3-chest"
        ],
        "note": "card grip.type and grip.width, claims c3, c4"
      }
    }
  ],
  zooms: [
    {
      "key": "fly-elbow",
      "chip": "Elbows",
      "heading": "Elbow bend",
      "kind": "posture"
    }
  ],
  chips: [
    "fly-elbow",
    "feel"
  ],
  copy: {
    "setupLine": "Set the seat so the handles are at chest level. Sit back against the pad, feet flat.",
    "mistakeLine": "Never lift your upper back off the pad to finish a rep. Lower the weight instead.",
    "cueLine": "Handles nearly meet."
  },
  mistakes: [],
  risks: [
    {
      "key": "shoulder",
      "text": "The pec deck puts the front of the shoulder in a vulnerable position.",
      "claim": {
        "tags": [
          "MECH",
          "CONSENSUS"
        ],
        "sources": [
          "ace-top3-chest"
        ],
        "note": "c8. ACE says it of the pec deck; applying it to the handle machine is by reasoning (card)."
      }
    },
    {
      "key": "technique",
      "text": "Changing the technique to lift more weight can cause injury.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-top3-chest"
        ],
        "note": "c7"
      }
    },
    {
      "key": "behind",
      "text": "Starting with the arms behind the body may strain the shoulder.",
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "ace-top3-chest"
        ],
        "note": "c9. Inferred from ACE's cable crossover advice (card)."
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
    "ace-top3-chest",
    "vg-pecfly",
    "hl-pecdeck",
    "pinto-2025",
    "soncin-2014",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/pec_fly.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

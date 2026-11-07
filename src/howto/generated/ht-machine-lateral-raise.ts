// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=8e30b91f683725dcb697ca9eef8628aae1940f7e6ef5adb7f7bc66626bd7da17
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_machine_lateral_raise",
  name: "Machine Lateral Raise",
  hashes: { inputsSha256: "8e30b91f683725dcb697ca9eef8628aae1940f7e6ef5adb7f7bc66626bd7da17", golden: "906fb4e46b1fd7c99d8b527716366d03c67357a2d5263680e34f4cb4e1926bc7" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"machine-lateral-raise-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"machine-lateral-raise-n-st-upper.l\" d=\"~#F12w)E1HVB1OYE1ESA1I1-881FcyN1!1O6oE3G2XD1!5IkI3zgXdEgTdIA1x2T2G4z5U7wO1b2G2T8)fH2B8_rY4(lWiDm00010000000000000000000000000200000001010011000000002000101000200011010100101000\"/><path id=\"machine-lateral-raise-n-st-elbowcap.l\" d=\"~~UFH1wNN1Dz10\"/><path id=\"machine-lateral-raise-n-st-fore.l\" d=\"~#F12!EH1_VN1GBH1*.K1bT9A1P1(bJD1S1z9D1O2V5Gs(3)dI2*aI9xbT6zs)1-1G5T7A5_E1d!1T3*8Oa3x6JlW3YgJewh10011000010000101020000000100010000000100201010000010000100101100000202001020010\"/><path id=\"machine-lateral-raise-n-st-fist.l\" d=\"~~wGJ1YEX1ww10\"/><path id=\"machine-lateral-raise-n-st-upper.r\" d=\"~#F12UwrHxB1)FrT(z1H2T8c2T7wO1H4z5y2T2UdIA1YdEgJ3zg.5IkH2XD1nE3.1O6EcyN171J1-8TfO4ViDmX4(lD8_r10100020001000101010010001010000000200000000000000000000000001000000000001012100\"/><path id=\"machine-lateral-raise-n-st-elbowcap.r\" d=\"~~PNpwNN1Dz10\"/><path id=\"machine-lateral-raise-n-st-fore.r\" d=\"~#F12WKpDDN1xWpRKK1U3*8e!1z5_E1H5T7w2-1U6zsJ9xbJ2*a*3)dW5GsB1O2R1z9*bJD1z1P1cT9K9O4IewhV3Ygy6Jl20010120000001000001010220000000200020000000100000101001002001000000020110100000\"/><path id=\"machine-lateral-raise-n-st-fist.r\" d=\"~~PUnYEX1ww10\"/><path id=\"machine-lateral-raise-n-g0-upper.l\" d=\"~#F12AFF1!FD1.SE1BJB1z5G785AvwA1z1T6lE3Bj-x1R3)kBa.cOjT8BsXq*2K1B6V2Nr!D178.5X6Kdy9w5Us_dWhPqUb00210101011000002000000000200002000100000020001210000002101000010100200011000100\"/><path id=\"machine-lateral-raise-n-g0-elbowcap.l\" d=\"~~wyN1PVJ1Dz10\"/><path id=\"machine-lateral-raise-n-g0-fore.l\" d=\"~#F12NFN1PJK1R_K1IWJ1R4O8U1q!rFtV2)81V2.h)mT2Ge)6V8IdV5TiOmR2lB8K4NmNx1g!1G7G6G9P4w4!l_aPdNkU800200000010000000000002000200000000000001000200000000120001010010000000200000020\"/><path id=\"machine-lateral-raise-n-g0-fist.l\" d=\"~~H_T1JXT1ww10\"/><path id=\"machine-lateral-raise-n-g0-upper.r\" d=\"~#F12YGrYKA1OwsESz1!5X688Kr!D1D6V2(2K1DsXqPjT8Da.cS3)kDj-x1mE3A1T6zvwA175A5G7zc-aOqUb-dWh)4Us01002020020000000200100000000100020010101010101000002001010111000001000110100001\"/><path id=\"machine-lateral-raise-n-g0-elbowcap.r\" d=\"~~AVlPVJ1Dz10\"/><path id=\"machine-lateral-raise-n-g0-fore.r\" d=\"~#F12U.lP(I1BNmBJI1H7G6f!1KmNx1D8K4S2lUiOmJdV5w7V8U2Ge!h)m2V2W2)8.rFtT1qS4O8O6x8KkU8-aPd)3!l01000000101110101010002000000000000010001010100000000001000010001000001012000000\"/><path id=\"machine-lateral-raise-n-g0-fist.r\" d=\"~~DzgJXT1ww10\"/><path id=\"machine-lateral-raise-n-g1-upper.l\" d=\"~#F12(YF1NWD1E-E1*BD1-7I445_I1Ui*3K5x2R2xw1xmKcEh-eB7BlqBB1VbG32V66WG1wn18G8O3)7AewhPnAk!9wtB100000000120110010000000101000101012101110000000100001000001110022020000200000000\"/><path id=\"machine-lateral-raise-n-g1-elbowcap.l\" d=\"~~FWP1SKG1Dz10\"/><path id=\"machine-lateral-raise-n-g1-fore.l\" d=\"~#F12!GR1(NH1KTP1BxH1)7T5(12AD1(dI6.6G1I2Oq.cV8TbBaX4Oes*qzcT2kI9fDz1FkH1N1K9O2B6H8Hd_hUfF7DmE100000000000200020000000000000000100000101020022001111000000100101111110100010000\"/><path id=\"machine-lateral-raise-n-g1-fist.l\" d=\"~~!x-1YFK1ww10\"/><path id=\"machine-lateral-raise-n-g1-upper.r\" d=\"~#F12S_rAwA1z.sGRz1H8O328VG1wnW66H32DB1VbDlq_eB7NcEhyw1xmy2R2(3K5-I1Ui35_7I4z6)e)sB1zk!9)gPn02000100002000101100000021011101011110010100000001200122000000000000000002001010\"/><path id=\"machine-lateral-raise-n-g1-elbowcap.r\" d=\"~~!wjSKG1Dz10\"/><path id=\"machine-lateral-raise-n-g1-fore.r\" d=\"~#F12PUjFJF1KKk*zF1N9O2G1N1Bz1FkJ9fU2k(qzcPesDaX4W8TbPq.cH1I2J6.6zD1(d*12w8T5K2xaBmE1TfF7Gd_h00000100000001011002100000000020000000000000000002000200000000000010110001010101\"/><path id=\"machine-lateral-raise-n-g1-fist.r\" d=\"~~U.aYFK1ww10\"/><path id=\"machine-lateral-raise-n-e-head\" d=\"~#D12Y(y1DErzVx1-wrEjJeXcFbT9A3-4B3B3z3-4E3-4)7R1)7B3R9D3R9S1)7_4)7_4E3D3z3_4B3U9A3YcFbFjJe0000100200001010000000101100002100000000000011000001000000002020000002200000\"/><path id=\"machine-lateral-raise-n-e-torso\" d=\"~#A22SIA1(Dw1)GA1B_u!c*iArsy8z9K6I3IeUg-J1(d-4-cU9YsT9_c_4R9DjK6U9N6-c1)nVc)E1xoID2zrJD2zrwF1xowoVc_c1T9N6BjK6-4R9U9_cT9Ys_4-c_J1(dJeUgN6I3x8z9zrs.c*iyY2YJ10220001000002002100000010101012000000000000000200000000200002100020200110000020000001000000000000000100101010100000012100000200010020000\"/><path id=\"machine-lateral-raise-n-e-shcap.l\" d=\"~~(*E1HIB1wP10\"/><path id=\"machine-lateral-raise-n-e-upper.l\" d=\"~#F12(KG1H.D1BHF1I_D1)8d2bSO1G2*5B3*2K1RD1X5VixaOg0ViyaRD1W5*2S1*5y3SO1N22a)8evDgPpYdPm1PpTd00001000010000000000001010000001000000111000000001000000001000000000000101000000\"/><path id=\"machine-lateral-raise-n-e-elbowcap.l\" d=\"~~JUR1HIB1Dz10\"/><path id=\"machine-lateral-raise-n-e-fore.l\" d=\"~#F12FYS1yPD1.*R1RKD1T9O1W1pYF1G4-8G3E2T1.t4*cR6Eb4RcD7*tw1B2U1V8Y3!F1W2Y1mR9(1V1DaYjAaFh9Jj*a02000200100101000000000000000010012002101000100000011111010000101000100020000000\"/><path id=\"machine-lateral-raise-n-e-fist.l\" d=\"~~Y*_1WBB1ww10\"/><path id=\"machine-lateral-raise-n-e-shcap.r\" d=\"~~S)qHIB1wP10\"/><path id=\"machine-lateral-raise-n-e-upper.r\" d=\"~#F12SOsH.z1GTtE!z1w9e1aRO1N2(5y3(2S1SD1W5WiyaPg0WixaSD1X5(2K1(5B3RO1G21bw9dw1EgOpTdOm1OpYd00002000000000010000000001000000010000000000000000000001002000000000000101000000\"/><path id=\"machine-lateral-raise-n-e-elbowcap.r\" d=\"~~YyiHIB1Dz10\"/><path id=\"machine-lateral-raise-n-e-fore.r\" d=\"~#F12UDjPDA1.wk)GA1S9(1X1m.F1W2W8Y3D2U1(tw1ScD7Fb4(cR6!t4F2T1_8G3XF1G4V1pU9O1y2xaIj*aEh9XjAa00101001212101000020000000021001200000000000000000010120000200020000001000200000\"/><path id=\"machine-lateral-raise-n-e-fist.r\" d=\"~~Y)8WBB1ww10\"/><path id=\"machine-lateral-raise-n-e-thigh.l\" d=\"~#F12wDA1FXU1..z1IVU1x38jA1UcY3_1*5qV2Sey6)cTmxhVaxqX1!bNaz2!1O4F4(8U9kvv-2I_1awnHF1PuwjFN1y300001000020100010100001111001200001010010101000000000112000000020000000120000000\"/><path id=\"machine-lateral-raise-n-e-kneecap.l\" d=\"~~JBD1HwU1_J10\"/><path id=\"machine-lateral-raise-n-e-shank.l\" d=\"~#F12YzD1wyU1XBD1-SS1J1-bF11D7S(1U5z8U2*3B6Ry2_6.df)bX7GdF1Xy2.2.3G6T7O2((1E12E2XbIcycGcApoWlDeDo00000001011010011000020000000000002002020000001010000200002000200000000000000000\"/><path id=\"machine-lateral-raise-n-e-foot.l\" d=\"~#e2wSE1yP)1R)B1TS)1ErN-1)dVtVN1.gX9*5HE1)x1_h*o0011000020101001000010002000\"/><path id=\"machine-lateral-raise-n-e-thigh.r\" d=\"~#F12wDvwVP1xJvXJP1w1-2jv*8U9P4F4A2!1.bNayqX1yhVawdTmRey6pV2-1*5TcY3kA1y38DpRU1EN1y3Ouwj)mHF102000000220100000000010101000010102200010110101111000102002000000000001001000000\"/><path id=\"machine-lateral-raise-n-e-kneecap.r\" d=\"~~S(sHwU1_J10\"/><path id=\"machine-lateral-raise-n-e-shank.r\" d=\"~#F12w*sS(T1OytTOS1F2XbF12P2((1H6T7!2.3E1Xy2Y7Gdg)b-6.dD6Ry2T2*3T5z8B7S(1E11I1-bEdybBeDonWlHcAp10001000000200000000000002021000000000000002002001000001010000000000000000000000\"/><path id=\"machine-lateral-raise-n-e-foot.r\" d=\"~#e2PIuyP)1**vTS)1FrN-1weVtWN1.gY9*5GE1)x1-h*o0021000010000001000020001000\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#machine-lateral-raise-n-dots)\"/>\n  <path class=\"floorline\" d=\"M88.3 339.5H269.7\"/><path class=\"eq\" d=\"~MDTuHIX1LAX80Qwp0z(7)oL)owbQ0)o)o)aLz(7wpQ)o0A(7wpLwp)aQ0wpwpwbZ\"/><path class=\"eq\" d=\"~MHzy1W_X1L0JH9Q0F6F6zA9LAA1E6QF60zA1E6LE6zA9Q0E6E6AA9LzA1F6QE60AA1F6Z\"/><path class=\"eq\" d=\"~M!.sYDy2LYBc0QF60O)bE6LE6V8Q0E6E6W8LO)bF6QE60P)bF6LF6W8Q0F6F6V8Z\"/><path class=\"eq\" d=\"~MJFvFTU1LYJ70QYi0)-6XiLXiXwjQ0XiXiYwjL)-6YiQXi0w_6YiLYiYwjQ0YiYiXwjZ\"/><path class=\"eq\" d=\"~M(Jy1HIx2LUz10QYi0.gXiLXi)-D1Q0XiXiw_D1L.gYiQXi0!gYiLYiw_D1Q0YiYi)-D1Z\"/><path class=\"eq\" d=\"~MD-qy-pLAIg0QYi0IYfXiLXiX7Q0XiXiY7LIYfYiQXi0JYfYiLYiY7Q0YiYiX7Z\"/><path class=\"eq-solid\" d=\"~~JGF1HIB1SA10\"/><path class=\"eq-pin\" d=\"~~WEG1HIB1F60\"/><path class=\"eq-solid\" d=\"~~wIrHIB1SA10\"/><path class=\"eq-pin\" d=\"~~HGsHIB1F60\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-lateral-raise-n-st-upper.l\"/><use href=\"#machine-lateral-raise-n-st-elbowcap.l\"/><use href=\"#machine-lateral-raise-n-st-fore.l\"/><use href=\"#machine-lateral-raise-n-st-fist.l\"/><use href=\"#machine-lateral-raise-n-st-upper.r\"/><use href=\"#machine-lateral-raise-n-st-elbowcap.r\"/><use href=\"#machine-lateral-raise-n-st-fore.r\"/><use href=\"#machine-lateral-raise-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-lateral-raise-n-st-upper.l\"/><use href=\"#machine-lateral-raise-n-st-elbowcap.l\"/><use href=\"#machine-lateral-raise-n-st-fore.l\"/><use href=\"#machine-lateral-raise-n-st-fist.l\"/><use href=\"#machine-lateral-raise-n-st-upper.r\"/><use href=\"#machine-lateral-raise-n-st-elbowcap.r\"/><use href=\"#machine-lateral-raise-n-st-fore.r\"/><use href=\"#machine-lateral-raise-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq\" d=\"~M!!I1!ID1LPS2JG3LVV1*)3LGO3XS2LWV1_)3Z\"/><path class=\"eq\" d=\"~M!JU1SSV1LNr0LKr-W3LKr_W3LNr_W3Z\"/><path class=\"eq\" d=\"~MUwq!ID1LOS2JG3LWV1*)3LHO3XS2LVV1_)3Z\"/><path class=\"eq\" d=\"~MDVgSSV1LNr0LKr-W3LKr_W3LNr_W3Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-lateral-raise-n-g0-upper.l\"/><use href=\"#machine-lateral-raise-n-g0-elbowcap.l\"/><use href=\"#machine-lateral-raise-n-g0-fore.l\"/><use href=\"#machine-lateral-raise-n-g0-fist.l\"/><use href=\"#machine-lateral-raise-n-g0-upper.r\"/><use href=\"#machine-lateral-raise-n-g0-elbowcap.r\"/><use href=\"#machine-lateral-raise-n-g0-fore.r\"/><use href=\"#machine-lateral-raise-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-lateral-raise-n-g0-upper.l\"/><use href=\"#machine-lateral-raise-n-g0-elbowcap.l\"/><use href=\"#machine-lateral-raise-n-g0-fore.l\"/><use href=\"#machine-lateral-raise-n-g0-fist.l\"/><use href=\"#machine-lateral-raise-n-g0-upper.r\"/><use href=\"#machine-lateral-raise-n-g0-elbowcap.r\"/><use href=\"#machine-lateral-raise-n-g0-fore.r\"/><use href=\"#machine-lateral-raise-n-g0-fist.r\"/></g></g><path class=\"eq\" d=\"~MJON1FVG1L!K1P_1LV2G!2Lx-2XoLW2N!2Z\"/><path class=\"eq\" d=\"~MANnFVG1L.K1P_1LW2G!2Ly-2XoLV2N!2Z\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq\" d=\"~MFzJ1yDB1LJY3S_1LIF3O.2LKF4TpLPF3P.2Z\"/><path class=\"eq\" d=\"~MHU-1(zO1LJr0LIr.W3LIr!W3LJr!W3Z\"/><path class=\"eq\" d=\"~MF_pyDB1LIY3S_1LJF3O.2LNF4TpLOF3P.2Z\"/><path class=\"eq\" d=\"~M_Kb(zO1LJr0LIr.W3LIr!W3LJr!W3Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-lateral-raise-n-g1-upper.l\"/><use href=\"#machine-lateral-raise-n-g1-elbowcap.l\"/><use href=\"#machine-lateral-raise-n-g1-fore.l\"/><use href=\"#machine-lateral-raise-n-g1-fist.l\"/><use href=\"#machine-lateral-raise-n-g1-upper.r\"/><use href=\"#machine-lateral-raise-n-g1-elbowcap.r\"/><use href=\"#machine-lateral-raise-n-g1-fore.r\"/><use href=\"#machine-lateral-raise-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-lateral-raise-n-g1-upper.l\"/><use href=\"#machine-lateral-raise-n-g1-elbowcap.l\"/><use href=\"#machine-lateral-raise-n-g1-fore.l\"/><use href=\"#machine-lateral-raise-n-g1-fist.l\"/><use href=\"#machine-lateral-raise-n-g1-upper.r\"/><use href=\"#machine-lateral-raise-n-g1-elbowcap.r\"/><use href=\"#machine-lateral-raise-n-g1-fore.r\"/><use href=\"#machine-lateral-raise-n-g1-fist.r\"/></g></g><path class=\"eq\" d=\"~MU.O1UwE1L!y2Pw1L.H1-R2L._2YgL!H1(R2Z\"/><path class=\"eq\" d=\"~M!xmUwE1L.y2Pw1L!H1-R2L!_2YgL.H1(R2Z\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MJYI1FxA1L!B40L.B4RA1L.B4SA1L!B4SA1Z\"/><path class=\"eq\" d=\"~MyP.1AxE1LNr0LKr.W3LKr!W3LNr!W3Z\"/><path class=\"eq\" d=\"~MABqFxA1L.B40L!B4RA1L!B4SA1L.B4SA1Z\"/><path class=\"eq\" d=\"~MwS9AxE1LNr0LKr.W3LKr!W3LNr!W3Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-lateral-raise-n-e-head\"/><use href=\"#machine-lateral-raise-n-e-torso\"/><use href=\"#machine-lateral-raise-n-e-shcap.l\"/><use href=\"#machine-lateral-raise-n-e-upper.l\"/><use href=\"#machine-lateral-raise-n-e-elbowcap.l\"/><use href=\"#machine-lateral-raise-n-e-fore.l\"/><use href=\"#machine-lateral-raise-n-e-fist.l\"/><use href=\"#machine-lateral-raise-n-e-shcap.r\"/><use href=\"#machine-lateral-raise-n-e-upper.r\"/><use href=\"#machine-lateral-raise-n-e-elbowcap.r\"/><use href=\"#machine-lateral-raise-n-e-fore.r\"/><use href=\"#machine-lateral-raise-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-lateral-raise-n-e-head\"/><use href=\"#machine-lateral-raise-n-e-torso\"/><use href=\"#machine-lateral-raise-n-e-shcap.l\"/><use href=\"#machine-lateral-raise-n-e-upper.l\"/><use href=\"#machine-lateral-raise-n-e-elbowcap.l\"/><use href=\"#machine-lateral-raise-n-e-fore.l\"/><use href=\"#machine-lateral-raise-n-e-fist.l\"/><use href=\"#machine-lateral-raise-n-e-shcap.r\"/><use href=\"#machine-lateral-raise-n-e-upper.r\"/><use href=\"#machine-lateral-raise-n-e-elbowcap.r\"/><use href=\"#machine-lateral-raise-n-e-fore.r\"/><use href=\"#machine-lateral-raise-n-e-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-lateral-raise-n-e-thigh.l\"/><use href=\"#machine-lateral-raise-n-e-kneecap.l\"/><use href=\"#machine-lateral-raise-n-e-shank.l\"/><use href=\"#machine-lateral-raise-n-e-foot.l\"/><use href=\"#machine-lateral-raise-n-e-thigh.r\"/><use href=\"#machine-lateral-raise-n-e-kneecap.r\"/><use href=\"#machine-lateral-raise-n-e-shank.r\"/><use href=\"#machine-lateral-raise-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#machine-lateral-raise-n-e-thigh.l\"/><use href=\"#machine-lateral-raise-n-e-kneecap.l\"/><use href=\"#machine-lateral-raise-n-e-shank.l\"/><use href=\"#machine-lateral-raise-n-e-foot.l\"/><use href=\"#machine-lateral-raise-n-e-thigh.r\"/><use href=\"#machine-lateral-raise-n-e-kneecap.r\"/><use href=\"#machine-lateral-raise-n-e-shank.r\"/><use href=\"#machine-lateral-raise-n-e-foot.r\"/></g></g><path class=\"eq\" d=\"~MF(O1FxA1LNH20LKH2-W1LKH2_W1LNH2_W1Z\"/><path class=\"eq\" d=\"~MF)lFxA1LKH20LNH2-W1LNH2_W1LKH2_W1Z\"/><circle class=\"joint\" cx=\"212.15\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"259.77\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"98.23\" cy=\"191.25\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#J20AGpJyN1)PpKBN14309632943474545474367436743656365458343856165638165816163838161818180638000002201100020000102000000001010000100000200000002010000020000220000000000200000022101020000000000000001000000101010110100010000020220200000020000000010\"/><path class=\"arrow\" d=\"~MAzjFPB1LHoAy1LG*1EsZ\"/></g><path class=\"leader\" d=\"M212.15 191.25L257 162H267\"/><circle class=\"anchor\" cx=\"212.15\" cy=\"191.25\" r=\"1.5\"/><path class=\"leader\" d=\"~M(BjHIB1L0Gz6\"/><circle class=\"anchor\" cx=\"98.23\" cy=\"191.25\" r=\"1.5\"/><path class=\"leader\" d=\"~MSXS1HIB1L0-(b\"/><circle class=\"anchor\" cx=\"259.77\" cy=\"191.25\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"machine-lateral-raise-n-pivot\" data-key=\"pivot\" data-cue=\"Set the seat so your shoulders line up with the pivots.\" class=\"plate-callout two\" style=\"left:73.18%;top:39.11%\" aria-pressed=\"true\">Shoulders<br>at pivot</button><button type=\"button\" id=\"machine-lateral-raise-n-lead\" data-key=\"lead\" data-cue=\"Press out through the elbows into the pads.\" class=\"plate-callout two\" style=\"left:6.7%;top:33.52%\" aria-pressed=\"false\">Lead with<br>elbows</button><button type=\"button\" id=\"machine-lateral-raise-n-level\" data-key=\"level\" data-cue=\"Stop when your upper arms are horizontal.\" class=\"plate-callout two\" style=\"left:64.8%;top:25.14%\" aria-pressed=\"false\">Elbows<br>shoulder-high</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"machine-lateral-raise-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"machine-lateral-raise-m-st-upper.l\" d=\"^0\"/><path id=\"machine-lateral-raise-m-st-elbowcap.l\" d=\"^1\"/><path id=\"machine-lateral-raise-m-st-fore.l\" d=\"^2\"/><path id=\"machine-lateral-raise-m-st-fist.l\" d=\"^3\"/><path id=\"machine-lateral-raise-m-st-upper.r\" d=\"^4\"/><path id=\"machine-lateral-raise-m-st-elbowcap.r\" d=\"^5\"/><path id=\"machine-lateral-raise-m-st-fore.r\" d=\"^6\"/><path id=\"machine-lateral-raise-m-st-fist.r\" d=\"^7\"/><path id=\"machine-lateral-raise-m-g0-upper.l\" d=\"^8\"/><path id=\"machine-lateral-raise-m-g0-elbowcap.l\" d=\"^9\"/><path id=\"machine-lateral-raise-m-g0-fore.l\" d=\"^10\"/><path id=\"machine-lateral-raise-m-g0-fist.l\" d=\"^11\"/><path id=\"machine-lateral-raise-m-g0-upper.r\" d=\"^12\"/><path id=\"machine-lateral-raise-m-g0-elbowcap.r\" d=\"^13\"/><path id=\"machine-lateral-raise-m-g0-fore.r\" d=\"^14\"/><path id=\"machine-lateral-raise-m-g0-fist.r\" d=\"^15\"/><path id=\"machine-lateral-raise-m-g1-upper.l\" d=\"^16\"/><path id=\"machine-lateral-raise-m-g1-elbowcap.l\" d=\"^17\"/><path id=\"machine-lateral-raise-m-g1-fore.l\" d=\"^18\"/><path id=\"machine-lateral-raise-m-g1-fist.l\" d=\"^19\"/><path id=\"machine-lateral-raise-m-g1-upper.r\" d=\"^20\"/><path id=\"machine-lateral-raise-m-g1-elbowcap.r\" d=\"^21\"/><path id=\"machine-lateral-raise-m-g1-fore.r\" d=\"^22\"/><path id=\"machine-lateral-raise-m-g1-fist.r\" d=\"^23\"/><path id=\"machine-lateral-raise-m-e-head\" d=\"^24\"/><path id=\"machine-lateral-raise-m-e-torso\" d=\"^25\"/><path id=\"machine-lateral-raise-m-e-shcap.l\" d=\"^26\"/><path id=\"machine-lateral-raise-m-e-upper.l\" d=\"^27\"/><path id=\"machine-lateral-raise-m-e-elbowcap.l\" d=\"^28\"/><path id=\"machine-lateral-raise-m-e-fore.l\" d=\"^29\"/><path id=\"machine-lateral-raise-m-e-fist.l\" d=\"^30\"/><path id=\"machine-lateral-raise-m-e-shcap.r\" d=\"^31\"/><path id=\"machine-lateral-raise-m-e-upper.r\" d=\"^32\"/><path id=\"machine-lateral-raise-m-e-elbowcap.r\" d=\"^33\"/><path id=\"machine-lateral-raise-m-e-fore.r\" d=\"^34\"/><path id=\"machine-lateral-raise-m-e-fist.r\" d=\"^35\"/><path id=\"machine-lateral-raise-m-e-thigh.l\" d=\"^36\"/><path id=\"machine-lateral-raise-m-e-kneecap.l\" d=\"^37\"/><path id=\"machine-lateral-raise-m-e-shank.l\" d=\"^38\"/><path id=\"machine-lateral-raise-m-e-foot.l\" d=\"^39\"/><path id=\"machine-lateral-raise-m-e-thigh.r\" d=\"^40\"/><path id=\"machine-lateral-raise-m-e-kneecap.r\" d=\"^41\"/><path id=\"machine-lateral-raise-m-e-shank.r\" d=\"^42\"/><path id=\"machine-lateral-raise-m-e-foot.r\" d=\"^43\"/><path id=\"machine-lateral-raise-m-m-upper.l\" d=\"~#F12J(G1NYD1O!F1XzE1R8S215!I1RiT6tG39zD1W7xl)2OfU5ze_fBy1SiI2N2O4(4UK1)d2aE8N3S4UfUsA4DlT7HjTl00010102000011000010100000020000002000200010000000200010110111000010000020000111\"/><path id=\"machine-lateral-raise-m-m-elbowcap.l\" d=\"~~JyR1UBy1Dz10\"/><path id=\"machine-lateral-raise-m-m-fore.l\" d=\"~#F12_SS1wFz1)YR1VNz1V9!1J1I1AB1*hO95T2lKsNaGe.1Ray4K9(a)rHbR1F2*6N6UE1Ib(10O8A5y2yaymY2ygz6Se-g10000000000020000020000010000010120020002010110000020001001000110110110200000000\"/><path id=\"machine-lateral-raise-m-m-fist.l\" d=\"~~y_-1S.uww10\"/><path id=\"machine-lateral-raise-m-m-upper.r\" d=\"~#F12()sD(z1BxuEIA1F8N31aTK1)dP4(4J2N2Dy1SiAe_fPfU5yl)2AD1W7H39U6t.I1Ri25S8S2S6.eGjTlBlT7TsA400210101000010000000200010001000000002000000000000210000020101002101001000002000\"/><path id=\"machine-lateral-raise-m-m-elbowcap.r\" d=\"~~WUiUBy1Dz10\"/><path id=\"machine-lateral-raise-m-m-fore.r\" d=\"~#F12yBkHzx1X!kTOx1P8A5*10TE1Ib(6N6S1F2wsHbN9(aSay4He.1NsNaU2lP95zB1*hI1I1W9!1F5.8Re-gxgz6xmY221002000010002000001001000100002000000200000100000100000000000200000000002010001\"/><path id=\"machine-lateral-raise-m-m-fist.r\" d=\"~~NzaS.uww10\"/><path id=\"machine-lateral-raise-m-m-eq0\" d=\"~MSBI1NHz1L_*3VK1LEH4HbLKR3yP2LJH4GbZ\"/><path id=\"machine-lateral-raise-m-m-eq1\" d=\"~MJzO1Y!x1L(B2IpLTY2BqLET1(J2LUY2DqZ\"/><path id=\"machine-lateral-raise-m-m-eq2\" d=\"~MNJ_1FXw1LNr0LKr.W3LKr!W3LNr!W3Z\"/><path id=\"machine-lateral-raise-m-m-eq3\" d=\"~M(XqNHz1L-*3VK1LFH4HbLNR3yP2LIH4GbZ\"/><path id=\"machine-lateral-raise-m-m-eq4\" d=\"~MA_mY!x1L*B2IpLUY2BqLFT1(J2LTY2DqZ\"/><path id=\"machine-lateral-raise-m-m-eq5\" d=\"~MUVaFXw1LNr0LKr.W3LKr!W3LNr!W3Z\"/><path id=\"machine-lateral-raise-m-mf-head\" d=\"^24\"/><path id=\"machine-lateral-raise-m-mf-torso\" d=\"^25\"/><path id=\"machine-lateral-raise-m-mf-thigh.l\" d=\"^36\"/><path id=\"machine-lateral-raise-m-mf-kneecap.l\" d=\"^37\"/><path id=\"machine-lateral-raise-m-mf-shank.l\" d=\"^38\"/><path id=\"machine-lateral-raise-m-mf-foot.l\" d=\"^39\"/><path id=\"machine-lateral-raise-m-mf-shcap.l\" d=\"^26\"/><path id=\"machine-lateral-raise-m-mf-thigh.r\" d=\"^40\"/><path id=\"machine-lateral-raise-m-mf-kneecap.r\" d=\"^41\"/><path id=\"machine-lateral-raise-m-mf-shank.r\" d=\"^42\"/><path id=\"machine-lateral-raise-m-mf-foot.r\" d=\"^43\"/><path id=\"machine-lateral-raise-m-mf-shcap.r\" d=\"^31\"/><path id=\"machine-lateral-raise-m-mo-0\" d=\"^24\"/><path id=\"machine-lateral-raise-m-mo-1\" d=\"^25\"/><path id=\"machine-lateral-raise-m-mo-2\" d=\"^36\"/><path id=\"machine-lateral-raise-m-mo-3\" d=\"^37\"/><path id=\"machine-lateral-raise-m-mo-4\" d=\"^38\"/><path id=\"machine-lateral-raise-m-mo-5\" d=\"^39\"/><path id=\"machine-lateral-raise-m-mo-6\" d=\"^26\"/><path id=\"machine-lateral-raise-m-mo-7\" d=\"^27\"/><path id=\"machine-lateral-raise-m-mo-8\" d=\"^28\"/><path id=\"machine-lateral-raise-m-mo-9\" d=\"^29\"/><path id=\"machine-lateral-raise-m-mo-10\" d=\"^30\"/><path id=\"machine-lateral-raise-m-mo-11\" d=\"^40\"/><path id=\"machine-lateral-raise-m-mo-12\" d=\"^41\"/><path id=\"machine-lateral-raise-m-mo-13\" d=\"^42\"/><path id=\"machine-lateral-raise-m-mo-14\" d=\"^43\"/><path id=\"machine-lateral-raise-m-mo-15\" d=\"^31\"/><path id=\"machine-lateral-raise-m-mo-16\" d=\"^32\"/><path id=\"machine-lateral-raise-m-mo-17\" d=\"^33\"/><path id=\"machine-lateral-raise-m-mo-18\" d=\"^34\"/><path id=\"machine-lateral-raise-m-mo-19\" d=\"^35\"/><path id=\"machine-lateral-raise-m-mo-20\" d=\"^45\"/><path id=\"machine-lateral-raise-m-mo-21\" d=\"^46\"/><path id=\"machine-lateral-raise-m-mo-22\" d=\"^47\"/><path id=\"machine-lateral-raise-m-mo-23\" d=\"^48\"/><path id=\"machine-lateral-raise-m-mo-24\" d=\"^49\"/><path id=\"machine-lateral-raise-m-mo-25\" d=\"^50\"/><path id=\"machine-lateral-raise-m-mo-26\" d=\"^51\"/><path id=\"machine-lateral-raise-m-mo-27\" d=\"^52\"/><path id=\"machine-lateral-raise-m-mo-28\" d=\"^53\"/><path id=\"machine-lateral-raise-m-mo-29\" d=\"^54\"/><path id=\"machine-lateral-raise-m-mo-30\" d=\"^67\"/><path id=\"machine-lateral-raise-m-mo-31\" d=\"^71\"/><path id=\"machine-lateral-raise-m-mo-32\" d=\"^68\"/><path id=\"machine-lateral-raise-m-mo-33\" d=\"^69\"/><path id=\"machine-lateral-raise-m-mo-34\" d=\"^72\"/><path id=\"machine-lateral-raise-m-mo-35\" d=\"^70\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#machine-lateral-raise-m-dots)\"/>\n  <path class=\"floorline\" d=\"^44\"/><path class=\"eq\" d=\"^45\"/><path class=\"eq\" d=\"^46\"/><path class=\"eq\" d=\"^47\"/><path class=\"eq\" d=\"^48\"/><path class=\"eq\" d=\"^49\"/><path class=\"eq\" d=\"^50\"/><path class=\"eq-solid\" d=\"^51\"/><path class=\"eq-pin\" d=\"^52\"/><path class=\"eq-solid\" d=\"^53\"/><path class=\"eq-pin\" d=\"^54\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-lateral-raise-m-st-upper.l\"/><use href=\"#machine-lateral-raise-m-st-elbowcap.l\"/><use href=\"#machine-lateral-raise-m-st-fore.l\"/><use href=\"#machine-lateral-raise-m-st-fist.l\"/><use href=\"#machine-lateral-raise-m-st-upper.r\"/><use href=\"#machine-lateral-raise-m-st-elbowcap.r\"/><use href=\"#machine-lateral-raise-m-st-fore.r\"/><use href=\"#machine-lateral-raise-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-lateral-raise-m-st-upper.l\"/><use href=\"#machine-lateral-raise-m-st-elbowcap.l\"/><use href=\"#machine-lateral-raise-m-st-fore.l\"/><use href=\"#machine-lateral-raise-m-st-fist.l\"/><use href=\"#machine-lateral-raise-m-st-upper.r\"/><use href=\"#machine-lateral-raise-m-st-elbowcap.r\"/><use href=\"#machine-lateral-raise-m-st-fore.r\"/><use href=\"#machine-lateral-raise-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq\" d=\"^55\"/><path class=\"eq\" d=\"^56\"/><path class=\"eq\" d=\"^57\"/><path class=\"eq\" d=\"^58\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-lateral-raise-m-g0-upper.l\"/><use href=\"#machine-lateral-raise-m-g0-elbowcap.l\"/><use href=\"#machine-lateral-raise-m-g0-fore.l\"/><use href=\"#machine-lateral-raise-m-g0-fist.l\"/><use href=\"#machine-lateral-raise-m-g0-upper.r\"/><use href=\"#machine-lateral-raise-m-g0-elbowcap.r\"/><use href=\"#machine-lateral-raise-m-g0-fore.r\"/><use href=\"#machine-lateral-raise-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-lateral-raise-m-g0-upper.l\"/><use href=\"#machine-lateral-raise-m-g0-elbowcap.l\"/><use href=\"#machine-lateral-raise-m-g0-fore.l\"/><use href=\"#machine-lateral-raise-m-g0-fist.l\"/><use href=\"#machine-lateral-raise-m-g0-upper.r\"/><use href=\"#machine-lateral-raise-m-g0-elbowcap.r\"/><use href=\"#machine-lateral-raise-m-g0-fore.r\"/><use href=\"#machine-lateral-raise-m-g0-fist.r\"/></g></g><path class=\"eq\" d=\"^59\"/><path class=\"eq\" d=\"^60\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq\" d=\"^61\"/><path class=\"eq\" d=\"^62\"/><path class=\"eq\" d=\"^63\"/><path class=\"eq\" d=\"^64\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-lateral-raise-m-g1-upper.l\"/><use href=\"#machine-lateral-raise-m-g1-elbowcap.l\"/><use href=\"#machine-lateral-raise-m-g1-fore.l\"/><use href=\"#machine-lateral-raise-m-g1-fist.l\"/><use href=\"#machine-lateral-raise-m-g1-upper.r\"/><use href=\"#machine-lateral-raise-m-g1-elbowcap.r\"/><use href=\"#machine-lateral-raise-m-g1-fore.r\"/><use href=\"#machine-lateral-raise-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-lateral-raise-m-g1-upper.l\"/><use href=\"#machine-lateral-raise-m-g1-elbowcap.l\"/><use href=\"#machine-lateral-raise-m-g1-fore.l\"/><use href=\"#machine-lateral-raise-m-g1-fist.l\"/><use href=\"#machine-lateral-raise-m-g1-upper.r\"/><use href=\"#machine-lateral-raise-m-g1-elbowcap.r\"/><use href=\"#machine-lateral-raise-m-g1-fore.r\"/><use href=\"#machine-lateral-raise-m-g1-fist.r\"/></g></g><path class=\"eq\" d=\"^65\"/><path class=\"eq\" d=\"^66\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"^67\"/><path class=\"eq\" d=\"^68\"/><path class=\"eq\" d=\"^69\"/><path class=\"eq\" d=\"^70\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-lateral-raise-m-e-head\"/><use href=\"#machine-lateral-raise-m-e-torso\"/><use href=\"#machine-lateral-raise-m-e-shcap.l\"/><use href=\"#machine-lateral-raise-m-e-upper.l\"/><use href=\"#machine-lateral-raise-m-e-elbowcap.l\"/><use href=\"#machine-lateral-raise-m-e-fore.l\"/><use href=\"#machine-lateral-raise-m-e-fist.l\"/><use href=\"#machine-lateral-raise-m-e-shcap.r\"/><use href=\"#machine-lateral-raise-m-e-upper.r\"/><use href=\"#machine-lateral-raise-m-e-elbowcap.r\"/><use href=\"#machine-lateral-raise-m-e-fore.r\"/><use href=\"#machine-lateral-raise-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-lateral-raise-m-e-head\"/><use href=\"#machine-lateral-raise-m-e-torso\"/><use href=\"#machine-lateral-raise-m-e-shcap.l\"/><use href=\"#machine-lateral-raise-m-e-upper.l\"/><use href=\"#machine-lateral-raise-m-e-elbowcap.l\"/><use href=\"#machine-lateral-raise-m-e-fore.l\"/><use href=\"#machine-lateral-raise-m-e-fist.l\"/><use href=\"#machine-lateral-raise-m-e-shcap.r\"/><use href=\"#machine-lateral-raise-m-e-upper.r\"/><use href=\"#machine-lateral-raise-m-e-elbowcap.r\"/><use href=\"#machine-lateral-raise-m-e-fore.r\"/><use href=\"#machine-lateral-raise-m-e-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-lateral-raise-m-e-thigh.l\"/><use href=\"#machine-lateral-raise-m-e-kneecap.l\"/><use href=\"#machine-lateral-raise-m-e-shank.l\"/><use href=\"#machine-lateral-raise-m-e-foot.l\"/><use href=\"#machine-lateral-raise-m-e-thigh.r\"/><use href=\"#machine-lateral-raise-m-e-kneecap.r\"/><use href=\"#machine-lateral-raise-m-e-shank.r\"/><use href=\"#machine-lateral-raise-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#machine-lateral-raise-m-e-thigh.l\"/><use href=\"#machine-lateral-raise-m-e-kneecap.l\"/><use href=\"#machine-lateral-raise-m-e-shank.l\"/><use href=\"#machine-lateral-raise-m-e-foot.l\"/><use href=\"#machine-lateral-raise-m-e-thigh.r\"/><use href=\"#machine-lateral-raise-m-e-kneecap.r\"/><use href=\"#machine-lateral-raise-m-e-shank.r\"/><use href=\"#machine-lateral-raise-m-e-foot.r\"/></g></g><path class=\"eq\" d=\"^71\"/><path class=\"eq\" d=\"^72\"/><circle class=\"joint\" cx=\"212.15\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"259.77\" cy=\"191.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"98.23\" cy=\"191.25\" r=\"2.25\"/></g><mask id=\"machine-lateral-raise-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#machine-lateral-raise-m-mf-head\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-mf-torso\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-mf-shank.l\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-mf-foot.l\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-m-upper.l\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-m-fore.l\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-m-fist.l\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-mf-shank.r\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-mf-foot.r\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-m-upper.r\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-m-fore.r\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-m-fist.r\" fill=\"#000\"/><use href=\"#machine-lateral-raise-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-lateral-raise-m-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#machine-lateral-raise-m-mmask)\"><g class=\"u-stroke\"><use href=\"#machine-lateral-raise-m-m-upper.l\"/><use href=\"#machine-lateral-raise-m-m-elbowcap.l\"/><use href=\"#machine-lateral-raise-m-m-fore.l\"/><use href=\"#machine-lateral-raise-m-m-fist.l\"/><use href=\"#machine-lateral-raise-m-m-upper.r\"/><use href=\"#machine-lateral-raise-m-m-elbowcap.r\"/><use href=\"#machine-lateral-raise-m-m-fore.r\"/><use href=\"#machine-lateral-raise-m-m-fist.r\"/><use href=\"#machine-lateral-raise-m-m-eq0\"/><use href=\"#machine-lateral-raise-m-m-eq1\"/><use href=\"#machine-lateral-raise-m-m-eq2\"/><use href=\"#machine-lateral-raise-m-m-eq3\"/><use href=\"#machine-lateral-raise-m-m-eq4\"/><use href=\"#machine-lateral-raise-m-m-eq5\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MAUfHIB1LFVD10\"/><path class=\"m-arrow\" d=\"~M(BjHIB1L(hVB3MAe(rLze*rLV8HR1\"/><path class=\"m-arrow\" d=\"~MSXS1HIB1L*hVB3M_mJlL-mIlLW8HR1\"/><path class=\"leader m\" d=\"~M!XjUBy1L0zN6\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"machine-lateral-raise-m-high\" data-key=\"high\" data-cue=\"Your arms rise above shoulder level, elbows higher than your shoulders.\" class=\"plate-callout two m\" style=\"left:4.47%;top:28.49%\" aria-pressed=\"true\">Above<br>shoulders</button>",
    ]);
    return {
      view: "front",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "pivot",
        cues: [{ key: "pivot", cue: "Set the seat so your shoulders line up with the pivots." }, { key: "lead", cue: "Press out through the elbows into the pads." }, { key: "level", cue: "Stop when your upper arms are horizontal." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "high",
        cues: [{ key: "high", cue: "Your arms rise above shoulder level, elbows higher than your shoulders." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Above shoulders</b><span>Your arms rise above shoulder level, elbows higher than your shoulders.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: raise 2 seconds, hold 1 second, lower 3 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Raise</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:3 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>3 s</span></div></div></div>",
      alt: "Machine lateral raise, front view. Seated with the back on the pad and the arm pads just above the elbows, the lifter raises the arms out to the sides, leading with the elbows, until the upper arms are horizontal, level with the shoulders.",
      mistakeAlt: "Machine Lateral Raise: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "balance",
    "why": "D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c3 and c4.",
    "handle": "machine-grip",
    "loadAxis": "across",
    "width": {
      "text": "Set by the machine arms.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-raise",
          "sl-lat-raise",
          "mo-lat-raise"
        ],
        "note": "c3"
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
      "ext": [
        0,
        0
      ],
      "limitText": "Keep your wrists neutral.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-raise",
          "sl-lat-raise",
          "mo-lat-raise"
        ],
        "note": "c3"
      }
    },
    "faults": [],
    "gripLine": "Hold the handles, pads just above the elbows. Lead with the elbows.",
    "cue": "Lead with the elbows."
  },
  contacts: [
    "seat-back"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set the seat so your shoulders line up with the machine's pivots.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-lat-raise",
          "vg-lat-raise"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Sit with your back on the pad, feet flat on the floor.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-lat-raise",
          "vg-lat-raise"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "grip",
      "text": "Arms on the pads, just above the elbows. Hold the handles.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-raise",
          "sl-lat-raise",
          "mo-lat-raise"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "load",
      "text": "Pick a lighter weight than you think.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-lat-raise",
          "laf-lat-raise"
        ],
        "note": "c7"
      }
    },
    {
      "kind": "position",
      "text": "Lower slowly, stopping before the stack rests.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "laf-lat-raise",
          "mo-lat-raise"
        ],
        "note": "c9"
      }
    }
  ],
  posture: [
    {
      "key": "pivot",
      "label": "Shoulders at pivot",
      "detail": "Seat set so the shoulders line up with the machine's pivots.",
      "anchor": {
        "pose": "start",
        "at": "shoulder.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-lat-raise",
          "vg-lat-raise"
        ],
        "note": "c1"
      }
    },
    {
      "key": "back",
      "label": "Back on pad",
      "detail": "Back stays on the pad, feet flat.",
      "anchor": {
        "pose": "end",
        "at": "sternum"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-lat-raise",
          "vg-lat-raise"
        ],
        "note": "c2"
      }
    },
    {
      "key": "lead",
      "label": "Lead with elbows",
      "detail": "Lead with the elbows.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-lat-raise",
          "mo-lat-raise"
        ],
        "note": "c4"
      }
    },
    {
      "key": "level",
      "label": "Elbows shoulder-high",
      "detail": "Stop when the upper arms are horizontal.",
      "anchor": {
        "pose": "end",
        "at": "elbow.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-lat-raise",
          "laf-lat-raise",
          "mo-lat-raise",
          "vg-lat-raise"
        ],
        "note": "c5"
      }
    },
    {
      "key": "shrug",
      "label": "Shoulders down",
      "detail": "Shoulders stay down, no shrugging.",
      "anchor": {
        "pose": "end",
        "at": "shoulderTop.r"
      },
      "zoom": "latm-shrug",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-lat-raise"
        ],
        "note": "c6"
      }
    },
    {
      "key": "lower",
      "label": "Slow lowering",
      "detail": "Lower slowly, stopping before the stack rests.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "laf-lat-raise",
          "mo-lat-raise"
        ],
        "note": "c9"
      }
    }
  ],
  zooms: [
    {
      "key": "latm-shrug",
      "chip": "Shoulders",
      "heading": "Shoulders down",
      "kind": "posture",
      "feelRow": "traps"
    }
  ],
  chips: [
    "latm-shrug",
    "feel"
  ],
  copy: {
    "setupLine": "Set the seat so your shoulders line up with the machine's pivots. Arms on the pads.",
    "mistakeLine": "Keep your shoulders down. Stop when your upper arms are horizontal.",
    "cueLine": "Lead with the elbows."
  },
  mistakes: [
    {
      "key": "swing",
      "title": "Swinging the body up",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "vg-lat-raise",
          "mo-lat-raise",
          "sl-lat-raise",
          "laf-lat-raise"
        ],
        "note": "c8, c7"
      },
      "fix": "Lower the weight and lift without momentum."
    },
    {
      "key": "shrug",
      "title": "Shrugging the shoulders",
      "zoom": "latm-shrug",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-lat-raise",
          "sl-lat-raise",
          "laf-lat-raise"
        ],
        "note": "c6, c7"
      },
      "fix": "Keep your shoulders down. Go lighter if needed."
    },
    {
      "key": "heavy",
      "title": "Too heavy for shoulder height",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-lat-raise",
          "laf-lat-raise"
        ],
        "note": "c7"
      },
      "fix": "Lower the weight."
    }
  ],
  risks: [
    {
      "key": "swing",
      "text": "Swinging the body to finish a rep can lead to injury.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "vg-lat-raise",
          "mo-lat-raise"
        ],
        "note": "c8"
      }
    },
    {
      "key": "heavy",
      "text": "It is easy to choose a weight that is too heavy.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-lat-raise",
          "laf-lat-raise"
        ],
        "note": "c7"
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
    "mo-lat-raise",
    "vg-lat-raise",
    "ace-lat-raise",
    "laf-lat-raise",
    "sl-lat-raise",
    "rabello-2024",
    "balance-default"
  ],
  research: {
    "card": "docs/research/howto/cards/machine_lateral_raise.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

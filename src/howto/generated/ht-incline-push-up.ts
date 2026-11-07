// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=9c29daf40f93f867c162cd3743221afe3df19f877b74c3da059bd9b959f04e68
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_incline_push_up",
  name: "Incline Push-Up",
  hashes: { inputsSha256: "9c29daf40f93f867c162cd3743221afe3df19f877b74c3da059bd9b959f04e68", golden: "3ec638a4b268730f28519957eb51f1b07c5d238e99e43d4e541a9b06b8af5608" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"incline-push-up-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"incline-push-up-n-st-thigh.l\" d=\"~#F12w(uN*S1OGw1RJS1Wax5dB1G_1yly9J3P4S1yT1VcFpD5yjV5HiBiUR1Kh!2V3_5.7K!1JecF1WbT1H2.w1*J1B9*x1DaOw1Hw100010100000020010000000101011000120000200000002000100100020000101200020200000000\"/><path id=\"incline-push-up-n-st-kneecap.l\" d=\"~~JUiwVY1FJ10\"/><path id=\"incline-push-up-n-st-shank.l\" d=\"~#F12PTjyGX1GxlE)W1YbT1aD1B_1JmA9N3N4P1N(1Km!ew3NbI3YaXaPw2Kf(2V3Y5.7*!1DddB1Ya)4Xe.8xrR5TkA6RjSj00000000002001010012000200001020000000010110100200000000000022001000000000020000\"/><path id=\"incline-push-up-n-st-foot.l\" d=\"~#o2DB9A)_1KFaXD.1iwdScNe(tPhJs_T2zh)G2G3TD1-6XmGg*B1(8Ge_iAoTu*d011010101200020121022000100010120011010000000001\"/><path id=\"incline-push-up-n-st-torso\" d=\"~#_12A(P1wON1XJS1)HN1H3-arz3)dAeG3!aObWg_1w6!k-cF1Onz8Xaw9_dwc!hNlWgWlWbJa_1(czcUpVz1SmGi-1)5V2z9RbUgT6H5(3Iezc.cOl5B4!7De(8V6F5-V1TB211100001000200000000200100000001002000000202000000010101110100010101001200000011100000020000000020200111111110020010\"/><path id=\"incline-push-up-n-st-thigh.r\" d=\"^0\"/><path id=\"incline-push-up-n-st-kneecap.r\" d=\"^1\"/><path id=\"incline-push-up-n-st-shank.r\" d=\"^2\"/><path id=\"incline-push-up-n-st-foot.r\" d=\"^3\"/><path id=\"incline-push-up-n-st-shcap.r\" d=\"~~F*H1(IR1NO10\"/><path id=\"incline-push-up-n-st-upper.r\" d=\"~#F12API1yDP1*BJ1-WO1S5T388)qDnN53W25yl-8YkB3wd-9_8)iFe*huK2W1z5-tJj35w5I4.1TiEsJ4-hHd*bwq00100000000010020000001001001001100000100100002000010000000000100000001000200000\"/><path id=\"incline-push-up-n-st-elbowcap.r\" d=\"~~YYB1HRV1Yy12\"/><path id=\"incline-push-up-n-st-fore.r\" d=\"~#F12W.D1WVW1OJD1-SW1R5T1upSnO3x5O3E1T1V99Vc-6xb4Rc_6T9eG1U1)4S3PnH3w1oO5W1VcAaJjHayh3HjKa00000001110020000020001010010102000000010100000200001000000101101010010001010100\"/><path id=\"incline-push-up-n-st-palm.r\" d=\"~#o2(-H1y-U1RyH1.HU1U4K9T4R1K8W4Eb*3I72EboK81T4V4U40yfVnUg0110000000011010010000210000110000000001200020000\"/><path id=\"incline-push-up-n-g0-shcap.r\" d=\"~~NOF1_TK1NO10\"/><path id=\"incline-push-up-n-g0-upper.r\" d=\"~#F12WSF1NyK1)*F1BFJ1w3O6a6XbFA1U4E3D2V1Ye*lwgOdw6EfO2-kA4)pd-2B1R5zgUy175A2X6)bxd.lPiz8WkJ3Ns01000002000000000010000000000200011000021000010101000000211002000000000000000100\"/><path id=\"incline-push-up-n-g0-elbowcap.r\" d=\"~~_AD1PRU1Yy12\"/><path id=\"incline-push-up-n-g0-fore.r\" d=\"~#F12ARD1yNV1zyD1O(U1z5E6S1cAsWhI3x7dK2EgGdV5zdX8-6zeO2XgVcK26X7T1(nAnkS1B7T3Eb(3Y8AkHdPaWl_300010002101000000200010020200200001000000100000200200002202100200200020000002000\"/><path id=\"incline-push-up-n-g0-palm.r\" d=\"~#o2WXI1DFX1E)H1KVW1y7K8z5O2Raw3BcB6T8O1)cK1X9X1O4R5H5u!mzkHg!2000101010010100100002020000100000001010120010000\"/><path id=\"incline-push-up-n-g1-shcap.r\" d=\"~~N!B1_*G1NO10\"/><path id=\"incline-push-up-n-g1-upper.r\" d=\"~#F12P!B1YwH1I.B1X)F11E880A5_I1Y2X5F1X2S3Ey1_8xjvEgxb.hV7Kx1V1V2K3G5cyJ192tB8BgI2)byqJ1AmyfJo00000010002000011012001000002000000000220000110000010100020000000000000000000000\"/><path id=\"incline-push-up-n-g1-elbowcap.r\" d=\"~~w_D1SPS1Yy12\"/><path id=\"incline-push-up-n-g1-fore.r\" d=\"~#F12JAE1PIT1*RD1-WS1I6)7(1k(x1DqK4X8jX2XnzmX4KdE8K7*dO3EoIl-2bz9R3HtDvs!1R8T5)6H7J7WkUcNbHlF500100001000000000000011100002002101010200210100000111102000001000202000001000000\"/><path id=\"incline-push-up-n-g1-palm.r\" d=\"~#o2DEK1ATW1*wJ1XAW1Y7K9V7T1-dU4Ii*3Gc1Gim.d0T7-4W72AuTnSg2002000000011100200000000201200000000200000101000\"/><path id=\"incline-push-up-n-e-thigh.l\" d=\"~#F12FOoSHJ1KSp)II1F8I8nv.O1SE1_94U43!I1ztNpR3Ag*bybBn_F1Bx1P1O4W2G9.T1(x1mw1PaI5*8-vIK1P6TsylTjJG100100110000000010001100100001000010002101111001010002000022200011100000000002000\"/><path id=\"incline-push-up-n-e-kneecap.l\" d=\"~~yYeFKV1FJ10\"/><path id=\"incline-push-up-n-e-shank.l\" d=\"~#F12AGfHFU1.PgTOT1NaO5mw1EO1YF1_94W41AT1EH1Afz2P9x7U6XdNX1GA1S1K4W2I9.U1yx1nx1H8I8-gG3Ir(3GhWc.bwp00001010100000000000000001000000010020000000021002002000011010000000000001000020\"/><path id=\"incline-push-up-n-e-foot.l\" d=\"~#o2FW6DF.1)-7Kz.1(4ycUgH9Ay1F6yX1PB2BG1*)1zgEz1xezjBsEuU3IgYpHgKx1.2021011010101200002000010000010120000100100010000\"/><path id=\"incline-push-up-n-e-shcap.l\" d=\"~~SAz1WHD1NO10\"/><path id=\"incline-push-up-n-e-upper.l\" d=\"~#F12yFz1S!D1T.y1O.B1.2I883(jWH1mT66E3x9IB1D2*kz6)ezgKdVjxx1I2B2z5G4PfPJ154-3)7Bfy5x3NsJ8UkymDi00200101000000001000000000000000200000101020000010100000001010000011011000000100\"/><path id=\"incline-push-up-n-e-elbowcap.l\" d=\"~~AwE1w.N1Yy12\"/><path id=\"incline-push-up-n-e-fore.l\" d=\"~#F12DxE1WFO1K-D1.KN1G2zaJ1P1NjJD19-9mX2*bIuP1EeB4Ea)az9VcxuI2O1X6E7ydwG11y2I5X8G9S3I2!lN6Yf!gwe02000000000100100000001000120000022200000000000001000110100200000100101010000200\"/><path id=\"incline-push-up-n-e-palm.l\" d=\"~#o2(-H1y-U1EOG1.HU1P8K9O8R1IfW4Kk*3Xd2KkoIf1O8V4P80Jy1VnUg0011000002021010000000200000120200000100200020000\"/><path id=\"incline-push-up-n-e-head\" d=\"~#w12USJ1HOw1E!I1)wvRq*3.iX9)3VaV56P3O8F4.cS7zr(cX3Y6-6EbGfwmFbFiyeU9PiO1SoEgya2010100000000011110010002220011110000000000100000002000101021001\"/><path id=\"incline-push-up-n-e-torso\" d=\"~#_12S*E1Ayy1xFG1TNx1jGb-1T2I8wigJbB5SjW3y5JfzjX6OmGbK7DdwaFhYc!pP8HoW3Na-1y8XfycEH1yf-oV3z5V5T7B5SjO4D7z1-eXfx8Gky7G1!8JgS3K4H7EH2OO101001000210000000001011110000000010000020010000000000101010000001000000100101000002101000000001101000001002000000020\"/><path id=\"incline-push-up-n-e-thigh.r\" d=\"^20\"/><path id=\"incline-push-up-n-e-kneecap.r\" d=\"^21\"/><path id=\"incline-push-up-n-e-shank.r\" d=\"^22\"/><path id=\"incline-push-up-n-e-foot.r\" d=\"^23\"/><path id=\"incline-push-up-n-e-shcap.r\" d=\"^24\"/><path id=\"incline-push-up-n-e-upper.r\" d=\"^25\"/><path id=\"incline-push-up-n-e-elbowcap.r\" d=\"^26\"/><path id=\"incline-push-up-n-e-fore.r\" d=\"^27\"/><path id=\"incline-push-up-n-e-palm.r\" d=\"^28\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#incline-push-up-n-dots)\"/>\n  <path class=\"datum\" d=\"M208.82 181.56L-0.34 326.03\"/><path class=\"floorline\" d=\"M23.11 339.5H275.56\"/><path class=\"eq\" d=\"~M!wI1W(X1L(T60Qwp0*_5)oL)oYkQ0)o)oXkL*_5wpQ)o0(_5wpLwpXkQ0wpwpYkZ\"/><path class=\"eq\" d=\"~MYOK1NSY1L0(S8Q0F6F6VJ8LNz1E6QF60Kz1E6LE6VJ8Q0E6E6WJ8LKz1F6QE60Nz1F6Z\"/><path class=\"eq\" d=\"~MJHF1YDy2L(wc0QF60V_bE6LE6I8Q0E6E6J8LV_bF6QE60W_bF6LF6J8Q0F6F6I8Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#incline-push-up-n-st-thigh.l\"/><use href=\"#incline-push-up-n-st-kneecap.l\"/><use href=\"#incline-push-up-n-st-shank.l\"/><use href=\"#incline-push-up-n-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-n-st-thigh.l\"/><use href=\"#incline-push-up-n-st-kneecap.l\"/><use href=\"#incline-push-up-n-st-shank.l\"/><use href=\"#incline-push-up-n-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#incline-push-up-n-st-torso\"/><use href=\"#incline-push-up-n-st-thigh.r\"/><use href=\"#incline-push-up-n-st-kneecap.r\"/><use href=\"#incline-push-up-n-st-shank.r\"/><use href=\"#incline-push-up-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-n-st-torso\"/><use href=\"#incline-push-up-n-st-thigh.r\"/><use href=\"#incline-push-up-n-st-kneecap.r\"/><use href=\"#incline-push-up-n-st-shank.r\"/><use href=\"#incline-push-up-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#incline-push-up-n-st-shcap.r\"/><use href=\"#incline-push-up-n-st-upper.r\"/><use href=\"#incline-push-up-n-st-elbowcap.r\"/><use href=\"#incline-push-up-n-st-fore.r\"/><use href=\"#incline-push-up-n-st-palm.r\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-n-st-shcap.r\"/><use href=\"#incline-push-up-n-st-upper.r\"/><use href=\"#incline-push-up-n-st-elbowcap.r\"/><use href=\"#incline-push-up-n-st-fore.r\"/><use href=\"#incline-push-up-n-st-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#incline-push-up-n-g0-shcap.r\"/><use href=\"#incline-push-up-n-g0-upper.r\"/><use href=\"#incline-push-up-n-g0-elbowcap.r\"/><use href=\"#incline-push-up-n-g0-fore.r\"/><use href=\"#incline-push-up-n-g0-palm.r\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-n-g0-shcap.r\"/><use href=\"#incline-push-up-n-g0-upper.r\"/><use href=\"#incline-push-up-n-g0-elbowcap.r\"/><use href=\"#incline-push-up-n-g0-fore.r\"/><use href=\"#incline-push-up-n-g0-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#incline-push-up-n-g1-shcap.r\"/><use href=\"#incline-push-up-n-g1-upper.r\"/><use href=\"#incline-push-up-n-g1-elbowcap.r\"/><use href=\"#incline-push-up-n-g1-fore.r\"/><use href=\"#incline-push-up-n-g1-palm.r\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-n-g1-shcap.r\"/><use href=\"#incline-push-up-n-g1-upper.r\"/><use href=\"#incline-push-up-n-g1-elbowcap.r\"/><use href=\"#incline-push-up-n-g1-fore.r\"/><use href=\"#incline-push-up-n-g1-palm.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#incline-push-up-n-e-thigh.l\"/><use href=\"#incline-push-up-n-e-kneecap.l\"/><use href=\"#incline-push-up-n-e-shank.l\"/><use href=\"#incline-push-up-n-e-foot.l\"/><use href=\"#incline-push-up-n-e-shcap.l\"/><use href=\"#incline-push-up-n-e-upper.l\"/><use href=\"#incline-push-up-n-e-elbowcap.l\"/><use href=\"#incline-push-up-n-e-fore.l\"/><use href=\"#incline-push-up-n-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-n-e-thigh.l\"/><use href=\"#incline-push-up-n-e-kneecap.l\"/><use href=\"#incline-push-up-n-e-shank.l\"/><use href=\"#incline-push-up-n-e-foot.l\"/><use href=\"#incline-push-up-n-e-shcap.l\"/><use href=\"#incline-push-up-n-e-upper.l\"/><use href=\"#incline-push-up-n-e-elbowcap.l\"/><use href=\"#incline-push-up-n-e-fore.l\"/><use href=\"#incline-push-up-n-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#incline-push-up-n-e-head\"/><use href=\"#incline-push-up-n-e-torso\"/><use href=\"#incline-push-up-n-e-thigh.r\"/><use href=\"#incline-push-up-n-e-kneecap.r\"/><use href=\"#incline-push-up-n-e-shank.r\"/><use href=\"#incline-push-up-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-n-e-head\"/><use href=\"#incline-push-up-n-e-torso\"/><use href=\"#incline-push-up-n-e-thigh.r\"/><use href=\"#incline-push-up-n-e-kneecap.r\"/><use href=\"#incline-push-up-n-e-shank.r\"/><use href=\"#incline-push-up-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#incline-push-up-n-e-shcap.r\"/><use href=\"#incline-push-up-n-e-upper.r\"/><use href=\"#incline-push-up-n-e-elbowcap.r\"/><use href=\"#incline-push-up-n-e-fore.r\"/><use href=\"#incline-push-up-n-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-n-e-shcap.r\"/><use href=\"#incline-push-up-n-e-upper.r\"/><use href=\"#incline-push-up-n-e-elbowcap.r\"/><use href=\"#incline-push-up-n-e-fore.r\"/><use href=\"#incline-push-up-n-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"187.52\" cy=\"196.27\" r=\"2.25\"/><circle class=\"joint\" cx=\"205.26\" cy=\"239.84\" r=\"2.25\"/><circle class=\"joint\" cx=\"132.52\" cy=\"236.75\" r=\"2.25\"/><circle class=\"joint\" cx=\"82.61\" cy=\"273.48\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#D20HUJ1FET1KYJ1xOT12211120102011200100000100000100012213022100112000010000211020112000000002001010000010120002101101002001000000100010001000100011010000000000001000002000000000010100020002000000000000200002000210000100020000000\"/><path class=\"arrow\" d=\"~MwAE1H-G1L!z1UlLRz2R1Z\"/></g><path class=\"leader\" d=\"M166.54 189.1L124.47 172H114.47\"/><circle class=\"anchor\" cx=\"166.54\" cy=\"189.1\" r=\"1.5\"/><path class=\"leader\" d=\"~MH)B1S-y1L0RAc\"/><circle class=\"anchor\" cx=\"194.45\" cy=\"178.17\" r=\"1.5\"/><path class=\"leader\" d=\"M232.37 269.75L277 254H287\"/><circle class=\"anchor\" cx=\"232.37\" cy=\"269.75\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"incline-push-up-n-line\" data-key=\"line\" data-cue=\"Keep your head, hips and heels in one line.\" class=\"plate-callout\" style=\"left:4.47%;top:41.9%\" aria-pressed=\"true\">Straight line</button><button type=\"button\" id=\"incline-push-up-n-shoulders\" data-key=\"shoulders\" data-cue=\"Keep your shoulders down and away from your ears.\" class=\"plate-callout two\" style=\"left:41.9%;top:21.23%\" aria-pressed=\"false\">Shoulders<br>down</button><button type=\"button\" id=\"incline-push-up-n-chest\" data-key=\"chest\" data-cue=\"Lower until your chest is just short of the bench.\" class=\"plate-callout two\" style=\"left:78.77%;top:64.8%\" aria-pressed=\"false\">Chest<br>to bench</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"incline-push-up-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"incline-push-up-m-st-thigh.l\" d=\"^0\"/><path id=\"incline-push-up-m-st-kneecap.l\" d=\"^1\"/><path id=\"incline-push-up-m-st-shank.l\" d=\"^2\"/><path id=\"incline-push-up-m-st-foot.l\" d=\"^3\"/><path id=\"incline-push-up-m-st-torso\" d=\"^4\"/><path id=\"incline-push-up-m-st-thigh.r\" d=\"^0\"/><path id=\"incline-push-up-m-st-kneecap.r\" d=\"^1\"/><path id=\"incline-push-up-m-st-shank.r\" d=\"^2\"/><path id=\"incline-push-up-m-st-foot.r\" d=\"^3\"/><path id=\"incline-push-up-m-st-shcap.r\" d=\"^5\"/><path id=\"incline-push-up-m-st-upper.r\" d=\"^6\"/><path id=\"incline-push-up-m-st-elbowcap.r\" d=\"^7\"/><path id=\"incline-push-up-m-st-fore.r\" d=\"^8\"/><path id=\"incline-push-up-m-st-palm.r\" d=\"^9\"/><path id=\"incline-push-up-m-g0-shcap.r\" d=\"^10\"/><path id=\"incline-push-up-m-g0-upper.r\" d=\"^11\"/><path id=\"incline-push-up-m-g0-elbowcap.r\" d=\"^12\"/><path id=\"incline-push-up-m-g0-fore.r\" d=\"^13\"/><path id=\"incline-push-up-m-g0-palm.r\" d=\"^14\"/><path id=\"incline-push-up-m-g1-shcap.r\" d=\"^15\"/><path id=\"incline-push-up-m-g1-upper.r\" d=\"^16\"/><path id=\"incline-push-up-m-g1-elbowcap.r\" d=\"^17\"/><path id=\"incline-push-up-m-g1-fore.r\" d=\"^18\"/><path id=\"incline-push-up-m-g1-palm.r\" d=\"^19\"/><path id=\"incline-push-up-m-e-thigh.l\" d=\"^20\"/><path id=\"incline-push-up-m-e-kneecap.l\" d=\"^21\"/><path id=\"incline-push-up-m-e-shank.l\" d=\"^22\"/><path id=\"incline-push-up-m-e-foot.l\" d=\"^23\"/><path id=\"incline-push-up-m-e-shcap.l\" d=\"^24\"/><path id=\"incline-push-up-m-e-upper.l\" d=\"^25\"/><path id=\"incline-push-up-m-e-elbowcap.l\" d=\"^26\"/><path id=\"incline-push-up-m-e-fore.l\" d=\"^27\"/><path id=\"incline-push-up-m-e-palm.l\" d=\"^28\"/><path id=\"incline-push-up-m-e-head\" d=\"^29\"/><path id=\"incline-push-up-m-e-torso\" d=\"^30\"/><path id=\"incline-push-up-m-e-thigh.r\" d=\"^20\"/><path id=\"incline-push-up-m-e-kneecap.r\" d=\"^21\"/><path id=\"incline-push-up-m-e-shank.r\" d=\"^22\"/><path id=\"incline-push-up-m-e-foot.r\" d=\"^23\"/><path id=\"incline-push-up-m-e-shcap.r\" d=\"^24\"/><path id=\"incline-push-up-m-e-upper.r\" d=\"^25\"/><path id=\"incline-push-up-m-e-elbowcap.r\" d=\"^26\"/><path id=\"incline-push-up-m-e-fore.r\" d=\"^27\"/><path id=\"incline-push-up-m-e-palm.r\" d=\"^28\"/><path id=\"incline-push-up-m-m-head\" d=\"~#w12USR1Y-vI.P1-IuTqR3xjE9E4XaT5cH3O8y4xdw7Er!c*3S6)6ObxfFm_aPiYd(9FivWoxgFa0001111000100000001210012020010111110001210100200010101001001100\"/><path id=\"incline-push-up-m-m-torso\" d=\"~#_12S(J1JOx1XFN1x.w1UdGmzjUaVgYoFcS2.4Uj!3w5(eIjz7ImObB7JdW9ShNc(pw8NoD3Ja*1Y7*fHbKH1SeBp-3*4X5R7.4UjI4H7K1-eB7Ge.sweV9PfwpG3G4H7xI2)K101002020000000002100000020101200200010000000010000010000000000000000000020200001000010000200200001002000000100000201\"/><path id=\"incline-push-up-m-m-thigh.l\" d=\"~#F12SWtAxJ1B-u*xI1A8K8pvxO1JF1Y91Y43DI1*tNpB4_fxcWaRnAF1.x1N1O4S2I9ET1(y1ouFaT5K9RvEK1J7BsSl.iYG100020010110001012002000011011100100000000202000200200001011000000000020000000200\"/><path id=\"incline-push-up-m-m-kneecap.l\" d=\"~~(Ak_FV1FJ10\"/><path id=\"incline-push-up-m-m-shank.l\" d=\"~#F12HVkNAU1T!lxIT1JaT5mw1KN1UG1Y91Y45HS1BI1yfI2J9E7H6*d_W1EB1N1R4S2I9GU1(x1nrD8R8.gx3IrN4)gydIbFp00000212100200200000200020020000010101000001010000000000000001001101100022200000\"/><path id=\"incline-push-up-m-m-foot.l\" d=\"~#o2WDcPG.1GHdzA.1A5wc_gw9Fy1W5HY1JA2IH1B)1Xg.y1Ke.iXsVtH3OgAq_fTx1z2010210120002200000000002200000020000012000001200\"/><path id=\"incline-push-up-m-m-shcap.l\" d=\"~~!AG1(zB1NO10\"/><path id=\"incline-push-up-m-m-upper.l\" d=\"~#F12!AG1PAB1KBG1ExA1cX8a1_2yO1A3*5J1*2F5zD1Y9Ti5EgxaIiB6xD1K1-2z3*5*1AO170h.8)fpGdJp8Am!dDp11020000001000000001010010000100002000101102202101101220000100000000000021220011\"/><path id=\"incline-push-up-m-m-elbowcap.l\" d=\"~~WUG1wHN1Yy12\"/><path id=\"incline-push-up-m-m-fore.l\" d=\"~#F12yTG1JHN1VVG1VNK1S1zao!1!3_H1N3E9U1G20Tw1W6Vc3xb*6RcnTw1T1E2T3E9)2wI1l!1-1Baxa0zaNj4whUaFj21020012000011002020000002000000021010000002000010000002001111000200000000002001\"/><path id=\"incline-push-up-m-m-thigh.r\" d=\"^43\"/><path id=\"incline-push-up-m-m-kneecap.r\" d=\"^44\"/><path id=\"incline-push-up-m-m-shank.r\" d=\"^45\"/><path id=\"incline-push-up-m-m-foot.r\" d=\"^46\"/><path id=\"incline-push-up-m-m-shcap.r\" d=\"^47\"/><path id=\"incline-push-up-m-m-upper.r\" d=\"^48\"/><path id=\"incline-push-up-m-m-elbowcap.r\" d=\"^49\"/><path id=\"incline-push-up-m-m-fore.r\" d=\"^50\"/><path id=\"incline-push-up-m-mf-palm.l\" d=\"^28\"/><path id=\"incline-push-up-m-mf-palm.r\" d=\"^28\"/><path id=\"incline-push-up-m-mo-0\" d=\"^29\"/><path id=\"incline-push-up-m-mo-1\" d=\"^30\"/><path id=\"incline-push-up-m-mo-2\" d=\"^20\"/><path id=\"incline-push-up-m-mo-3\" d=\"^21\"/><path id=\"incline-push-up-m-mo-4\" d=\"^22\"/><path id=\"incline-push-up-m-mo-5\" d=\"^23\"/><path id=\"incline-push-up-m-mo-6\" d=\"^24\"/><path id=\"incline-push-up-m-mo-7\" d=\"^25\"/><path id=\"incline-push-up-m-mo-8\" d=\"^26\"/><path id=\"incline-push-up-m-mo-9\" d=\"^27\"/><path id=\"incline-push-up-m-mo-10\" d=\"^28\"/><path id=\"incline-push-up-m-mo-11\" d=\"^20\"/><path id=\"incline-push-up-m-mo-12\" d=\"^21\"/><path id=\"incline-push-up-m-mo-13\" d=\"^22\"/><path id=\"incline-push-up-m-mo-14\" d=\"^23\"/><path id=\"incline-push-up-m-mo-15\" d=\"^24\"/><path id=\"incline-push-up-m-mo-16\" d=\"^25\"/><path id=\"incline-push-up-m-mo-17\" d=\"^26\"/><path id=\"incline-push-up-m-mo-18\" d=\"^27\"/><path id=\"incline-push-up-m-mo-19\" d=\"^28\"/><path id=\"incline-push-up-m-mo-20\" d=\"^33\"/><path id=\"incline-push-up-m-mo-21\" d=\"^34\"/><path id=\"incline-push-up-m-mo-22\" d=\"^35\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#incline-push-up-m-dots)\"/>\n  <path class=\"datum\" d=\"^31\"/><path class=\"floorline\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#incline-push-up-m-st-thigh.l\"/><use href=\"#incline-push-up-m-st-kneecap.l\"/><use href=\"#incline-push-up-m-st-shank.l\"/><use href=\"#incline-push-up-m-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-m-st-thigh.l\"/><use href=\"#incline-push-up-m-st-kneecap.l\"/><use href=\"#incline-push-up-m-st-shank.l\"/><use href=\"#incline-push-up-m-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#incline-push-up-m-st-torso\"/><use href=\"#incline-push-up-m-st-thigh.r\"/><use href=\"#incline-push-up-m-st-kneecap.r\"/><use href=\"#incline-push-up-m-st-shank.r\"/><use href=\"#incline-push-up-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-m-st-torso\"/><use href=\"#incline-push-up-m-st-thigh.r\"/><use href=\"#incline-push-up-m-st-kneecap.r\"/><use href=\"#incline-push-up-m-st-shank.r\"/><use href=\"#incline-push-up-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#incline-push-up-m-st-shcap.r\"/><use href=\"#incline-push-up-m-st-upper.r\"/><use href=\"#incline-push-up-m-st-elbowcap.r\"/><use href=\"#incline-push-up-m-st-fore.r\"/><use href=\"#incline-push-up-m-st-palm.r\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-m-st-shcap.r\"/><use href=\"#incline-push-up-m-st-upper.r\"/><use href=\"#incline-push-up-m-st-elbowcap.r\"/><use href=\"#incline-push-up-m-st-fore.r\"/><use href=\"#incline-push-up-m-st-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#incline-push-up-m-g0-shcap.r\"/><use href=\"#incline-push-up-m-g0-upper.r\"/><use href=\"#incline-push-up-m-g0-elbowcap.r\"/><use href=\"#incline-push-up-m-g0-fore.r\"/><use href=\"#incline-push-up-m-g0-palm.r\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-m-g0-shcap.r\"/><use href=\"#incline-push-up-m-g0-upper.r\"/><use href=\"#incline-push-up-m-g0-elbowcap.r\"/><use href=\"#incline-push-up-m-g0-fore.r\"/><use href=\"#incline-push-up-m-g0-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#incline-push-up-m-g1-shcap.r\"/><use href=\"#incline-push-up-m-g1-upper.r\"/><use href=\"#incline-push-up-m-g1-elbowcap.r\"/><use href=\"#incline-push-up-m-g1-fore.r\"/><use href=\"#incline-push-up-m-g1-palm.r\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-m-g1-shcap.r\"/><use href=\"#incline-push-up-m-g1-upper.r\"/><use href=\"#incline-push-up-m-g1-elbowcap.r\"/><use href=\"#incline-push-up-m-g1-fore.r\"/><use href=\"#incline-push-up-m-g1-palm.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#incline-push-up-m-e-thigh.l\"/><use href=\"#incline-push-up-m-e-kneecap.l\"/><use href=\"#incline-push-up-m-e-shank.l\"/><use href=\"#incline-push-up-m-e-foot.l\"/><use href=\"#incline-push-up-m-e-shcap.l\"/><use href=\"#incline-push-up-m-e-upper.l\"/><use href=\"#incline-push-up-m-e-elbowcap.l\"/><use href=\"#incline-push-up-m-e-fore.l\"/><use href=\"#incline-push-up-m-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-m-e-thigh.l\"/><use href=\"#incline-push-up-m-e-kneecap.l\"/><use href=\"#incline-push-up-m-e-shank.l\"/><use href=\"#incline-push-up-m-e-foot.l\"/><use href=\"#incline-push-up-m-e-shcap.l\"/><use href=\"#incline-push-up-m-e-upper.l\"/><use href=\"#incline-push-up-m-e-elbowcap.l\"/><use href=\"#incline-push-up-m-e-fore.l\"/><use href=\"#incline-push-up-m-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#incline-push-up-m-e-head\"/><use href=\"#incline-push-up-m-e-torso\"/><use href=\"#incline-push-up-m-e-thigh.r\"/><use href=\"#incline-push-up-m-e-kneecap.r\"/><use href=\"#incline-push-up-m-e-shank.r\"/><use href=\"#incline-push-up-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-m-e-head\"/><use href=\"#incline-push-up-m-e-torso\"/><use href=\"#incline-push-up-m-e-thigh.r\"/><use href=\"#incline-push-up-m-e-kneecap.r\"/><use href=\"#incline-push-up-m-e-shank.r\"/><use href=\"#incline-push-up-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#incline-push-up-m-e-shcap.r\"/><use href=\"#incline-push-up-m-e-upper.r\"/><use href=\"#incline-push-up-m-e-elbowcap.r\"/><use href=\"#incline-push-up-m-e-fore.r\"/><use href=\"#incline-push-up-m-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#incline-push-up-m-e-shcap.r\"/><use href=\"#incline-push-up-m-e-upper.r\"/><use href=\"#incline-push-up-m-e-elbowcap.r\"/><use href=\"#incline-push-up-m-e-fore.r\"/><use href=\"#incline-push-up-m-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"187.52\" cy=\"196.27\" r=\"2.25\"/><circle class=\"joint\" cx=\"205.26\" cy=\"239.84\" r=\"2.25\"/><circle class=\"joint\" cx=\"132.52\" cy=\"236.75\" r=\"2.25\"/><circle class=\"joint\" cx=\"82.61\" cy=\"273.48\" r=\"2.25\"/></g><mask id=\"incline-push-up-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#incline-push-up-m-m-head\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-torso\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-thigh.l\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-shank.l\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-foot.l\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-shcap.l\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-upper.l\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-fore.l\" fill=\"#000\"/><use href=\"#incline-push-up-m-mf-palm.l\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-thigh.r\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-shank.r\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-foot.r\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-shcap.r\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-upper.r\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#incline-push-up-m-m-fore.r\" fill=\"#000\"/><use href=\"#incline-push-up-m-mf-palm.r\" fill=\"#000\"/><use href=\"#incline-push-up-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#incline-push-up-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#incline-push-up-m-mmask)\"><g class=\"u-stroke\"><use href=\"#incline-push-up-m-m-head\"/><use href=\"#incline-push-up-m-m-torso\"/><use href=\"#incline-push-up-m-m-thigh.l\"/><use href=\"#incline-push-up-m-m-kneecap.l\"/><use href=\"#incline-push-up-m-m-shank.l\"/><use href=\"#incline-push-up-m-m-foot.l\"/><use href=\"#incline-push-up-m-m-shcap.l\"/><use href=\"#incline-push-up-m-m-upper.l\"/><use href=\"#incline-push-up-m-m-elbowcap.l\"/><use href=\"#incline-push-up-m-m-fore.l\"/><use href=\"#incline-push-up-m-m-thigh.r\"/><use href=\"#incline-push-up-m-m-kneecap.r\"/><use href=\"#incline-push-up-m-m-shank.r\"/><use href=\"#incline-push-up-m-m-foot.r\"/><use href=\"#incline-push-up-m-m-shcap.r\"/><use href=\"#incline-push-up-m-m-upper.r\"/><use href=\"#incline-push-up-m-m-elbowcap.r\"/><use href=\"#incline-push-up-m-m-fore.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~M(GaY.)1LUU50M)oYiLwpXiL)R10\"/><path class=\"leader m\" d=\"M49.34 311.77L81 326H91\"/><path class=\"leader m\" d=\"~MF)J1NPB1LwI8yc\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"incline-push-up-m-feet\" data-key=\"feet\" data-cue=\"Your feet are too close to the bench.\" class=\"plate-callout m\" style=\"left:24.02%;top:84.92%\" aria-pressed=\"true\">Feet too close</button><button type=\"button\" id=\"incline-push-up-m-shrug\" data-key=\"shrug\" data-cue=\"Your shoulder blades stay raised toward your ears.\" class=\"plate-callout two m\" style=\"left:74.86%;top:48.04%\" aria-pressed=\"false\">Shoulders<br>shrug</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "line",
        cues: [{ key: "line", cue: "Keep your head, hips and heels in one line." }, { key: "shoulders", cue: "Keep your shoulders down and away from your ears." }, { key: "chest", cue: "Lower until your chest is just short of the bench." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "feet",
        cues: [{ key: "feet", cue: "Your feet are too close to the bench." }, { key: "shrug", cue: "Your shoulder blades stay raised toward your ears." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Feet too close</b><span>Your feet are too close to the bench.</span></li><li><b>Shoulders shrug</b><span>Your shoulder blades stay raised toward your ears.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: press 3 seconds, lower 3 seconds\"><div class=\"tempo-seg move\" style=\"flex:3 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>3 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:3 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>3 s</span></div></div></div>",
      alt: "Incline push-up, side view. Hands flat on the edge of a bench, body straight on the toes at about 45 degrees, the lifter presses from the chest just over the bench to straight arms.",
      mistakeAlt: "Incline Push-Up: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "palm-flat",
    "why": "D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c1.",
    "orientation": "pronated",
    "handle": "floor",
    "loadAxis": "along-forearm",
    "overBody": false,
    "width": {
      "text": "Hands on top, shoulder-width or a little wider.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-incline",
          "nasm-incline",
          "sl-incline"
        ],
        "note": "c1"
      }
    },
    "thumb": {
      "mode": "beside",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "hand-key-palm-flat"
        ],
        "note": "The card has no grip.thumb: the palm-flat key's drawn thumb, beside the index on the surface (view-palm-flat.mjs:52)."
      }
    },
    "contact": "palm-flat",
    "wrist": {
      "exempt": "Palm flat on the bench: the palm-flat key records no wrist range (null).",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "hand-key-palm-flat"
        ],
        "note": "hand-palm-flat.mjs:14 VARIANTS.floor.wristRange null; the card has no grip.wrist"
      }
    },
    "faults": [],
    "gripLine": "Both hands on top of the bench, shoulder-width or a little wider.",
    "cue": "Shoulders down, away from your ears."
  },
  contacts: [
    "floor-body"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Use a sturdy bench or box that holds your weight.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-incline",
          "nasm-incline",
          "sl-incline"
        ],
        "note": "c1, c14"
      }
    },
    {
      "kind": "grip",
      "text": "Hands on top, shoulder-width or a little wider.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-incline",
          "nasm-incline",
          "sl-incline"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Walk your feet back until your body slopes at 45 degrees.",
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-incline",
          "nasm-incline",
          "sl-incline"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "brace",
      "text": "Brace, squeeze glutes and thighs. Body in one line, head to heels.",
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-incline",
          "sl-incline",
          "bb-incline"
        ],
        "note": "c2, c6"
      }
    },
    {
      "kind": "position",
      "text": "Shoulders back and down, away from your ears.",
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-incline",
          "sl-incline",
          "bb-incline"
        ],
        "note": "c2, c10"
      }
    }
  ],
  posture: [
    {
      "key": "line",
      "label": "Straight line",
      "detail": "Head, hips and heels stay in one line.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-incline",
          "nasm-incline",
          "sl-incline"
        ],
        "note": "c2, c3"
      }
    },
    {
      "key": "shoulders",
      "label": "Shoulders down",
      "detail": "Feet far enough back that the shoulders stay away from the ears.",
      "anchor": {
        "pose": "end",
        "at": "shoulder.r"
      },
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-incline"
        ],
        "note": "c10"
      }
    },
    {
      "key": "chest",
      "label": "Chest to bench",
      "detail": "Lower until the chest is just short of the bench.",
      "anchor": {
        "pose": "start",
        "at": "sternum"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-incline",
          "nasm-incline",
          "sl-incline"
        ],
        "note": "c3"
      }
    },
    {
      "key": "hips",
      "label": "Hips in line",
      "detail": "Shoulders stay in line with your hips.",
      "anchor": {
        "pose": "start",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-incline",
          "nasm-incline",
          "sl-incline"
        ],
        "note": "c3, c6"
      }
    },
    {
      "key": "elbows",
      "label": "Elbows at 45",
      "detail": "Elbows about 45 degrees from your body.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-incline",
          "bb-incline"
        ],
        "note": "c4"
      }
    },
    {
      "key": "gaze",
      "label": "Look ahead",
      "detail": "Look straight ahead, not up.",
      "anchor": {
        "pose": "end",
        "at": "head"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-incline"
        ],
        "note": "c5"
      }
    },
    {
      "key": "squeeze",
      "label": "Glutes tight",
      "detail": "Squeeze your glutes and thighs.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-incline"
        ],
        "note": "c6"
      }
    },
    {
      "key": "breathe",
      "label": "Breathe",
      "detail": "Breathe in going down, out going up.",
      "anchor": {
        "pose": "start",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-incline",
          "bb-incline"
        ],
        "note": "c8"
      }
    }
  ],
  zooms: [
    {
      "key": "shoulders",
      "chip": "Shoulders",
      "heading": "Shoulders down",
      "kind": "posture"
    },
    {
      "key": "hip-line",
      "chip": "Hip line",
      "heading": "Hip line",
      "kind": "posture"
    }
  ],
  chips: [
    "shoulders",
    "hip-line",
    "feel"
  ],
  copy: {
    "setupLine": "Hands on a sturdy bench, feet walked back. Body in one line, shoulders down.",
    "mistakeLine": "Never keep your feet too close to the bench. Walk them back so your shoulders sit down.",
    "cueLine": "Shoulders down, body in one line."
  },
  mistakes: [
    {
      "key": "feet",
      "title": "Feet too close, shoulders shrugged",
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-incline"
        ],
        "note": "c10"
      },
      "fix": "Walk your feet back so your shoulders sit down."
    },
    {
      "key": "elbows",
      "title": "Elbows flaring too wide",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-incline",
          "bb-incline"
        ],
        "note": "c11, c4"
      },
      "fix": "Keep your elbows about 45 degrees from your body."
    },
    {
      "key": "low-back",
      "title": "Low back dropping",
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-incline",
          "nasm-incline"
        ],
        "note": "c12"
      },
      "fix": "Keep your hips in line with your shoulders."
    }
  ],
  risks: [
    {
      "key": "feet",
      "text": "Feet too close shrugs the shoulders and may raise shoulder injury risk.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-incline"
        ],
        "note": "c10"
      }
    },
    {
      "key": "elbows",
      "text": "Elbows flared wide add stress to the shoulder.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-incline"
        ],
        "note": "c11"
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
    "bb-incline",
    "nasm-incline",
    "sl-incline",
    "hand-key-palm-flat",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/incline_push_up.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

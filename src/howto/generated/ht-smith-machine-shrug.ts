// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=7d75bae8a9e6431650c2b4a6fef0354416b28164d60e9516be8abedff1bd6881
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_smith_machine_shrug",
  name: "Smith Machine Shrug",
  hashes: { inputsSha256: "7d75bae8a9e6431650c2b4a6fef0354416b28164d60e9516be8abedff1bd6881", golden: "702a335a73cebc6227aa005513e161e1f7e02afe9fd254ba5a815c27d7625098" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"smith-machine-shrug-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"smith-machine-shrug-n-st-shcap.r\" d=\"~~w!w1SEqwP10\"/><path id=\"smith-machine-shrug-n-st-upper.r\" d=\"~#F12D!w1AJqX-w1RFpb*880!6yO1U2B6A1z3A2VD1F8TjR1Kg-bThE9VB1-1-2V3T5A2SO190E1-8GgcBbYqy2HmygDo21000000100000000000000000000101011210002000100000000020002000001000001101100000\"/><path id=\"smith-machine-shrug-n-st-elbowcap.r\" d=\"~~_Ay1DOz1Dz10\"/><path id=\"smith-machine-shrug-n-st-fore.r\" d=\"~#F12YAy1!-z1K)x1B(y1K1GaJ1S1!fSF1m)9sV2z9Vv_2EeE3VaEaGa)9IvE2-1z6*7H9UH15w2T4G9X9_2I4Ylw5NgWfYf20101000201000101100000000000000000100000001010101002000002000002000010101101200\"/><path id=\"smith-machine-shrug-n-st-fist.r\" d=\"~~!yB1__J1ww10\"/><path id=\"smith-machine-shrug-n-e-thigh.l\" d=\"~#F12F)v(_E1K-vzJD1G2TbE10D6S(1U5B8U2*34EV1JbOnrBkGdKm*4*U1.2-3E6R7pY(1F10J1-bXvOazk!G1U1_z1Un(E120220000011010010100021001002000000000121020010020111002002000001100020101100000\"/><path id=\"smith-machine-shrug-n-e-kneecap.l\" d=\"~~HPx1D)T1_J10\"/><path id=\"smith-machine-shrug-n-e-shank.l\" d=\"~#F12YNx1A*T1RUx1xNS1J2-bD14A2A)1H6T7(2-3rxz2(7Gdg*bV6)dW6Vy2T2)3T5B8T7W(1B11G1-bGdybIeAorWlAcDp20012100120000000001011101012000000021000002100101000000200012101000100020010000\"/><path id=\"smith-machine-shrug-n-e-foot.l\" d=\"~#o2DOx1AB)1Xwy1zB(1YcF3Uhx8Sp)nU-2B3-J2-4ID1)7)n2TG1Y4Bb-c_sBbKmSp021002110110100101000020000200100111000010111100\"/><path id=\"smith-machine-shrug-n-e-shcap.l\" d=\"~~w!w1!-owP10\"/><path id=\"smith-machine-shrug-n-e-upper.l\" d=\"~#F12D!w1J(oX-w1-_nb.881!6yO1U2E6A1)2A2-D1F8RjR1Ig-bVhE9VB1-1-2V3T5A2SO190E1.8GggBbUqy2Nmygyo20000000100101010002000000000002001010012000100001000121002001001200011000110100\"/><path id=\"smith-machine-shrug-n-e-elbowcap.l\" d=\"~~_Ay1Pxy1Dz10\"/><path id=\"smith-machine-shrug-n-e-fore.l\" d=\"~#F12YAy1DJy1K)x1OPx1K1IaJ1U1!fSF1m*9sX2z9Xv_2zeE3-aEaBa)9OvE2X1z6.7H9SH15w2T4G9X9Y2I4_lw5PgWfWf21111002201000101000000000020000000000000000020200002000002000002000000200111100\"/><path id=\"smith-machine-shrug-n-e-fist.l\" d=\"~~!yB1yKI1ww10\"/><path id=\"smith-machine-shrug-n-e-head\" d=\"~#w12wJy1SEg-Yw1**fBjDjBjS9BbB3E3_4X4)7x8BbRhKm_4XcT1T9Bj0NmBbHmK6!kF3Dj(fT1Fj0001010100001000000000101000000002000000000000100002200000020000\"/><path id=\"smith-machine-shrug-n-e-torso\" d=\"~#_12w!w1S)kTBx1zRjR9GtB3NrS9HvU9.bYcwgN60I6)nKm)7Xc_4(f-4_kI6NmxgShRh_4R9)7xgBrBz1EbBrG60V90!cwgA3w8Xc)7)fV5K6Py1N6yk_c.oA3w8zT2ww100012101000000000000000220022000122000100000000100000000000001001000000022101200000010000000001010000000001000020002\"/><path id=\"smith-machine-shrug-n-e-thigh.r\" d=\"^5\"/><path id=\"smith-machine-shrug-n-e-kneecap.r\" d=\"^6\"/><path id=\"smith-machine-shrug-n-e-shank.r\" d=\"^7\"/><path id=\"smith-machine-shrug-n-e-foot.r\" d=\"^8\"/><path id=\"smith-machine-shrug-n-e-shcap.r\" d=\"^9\"/><path id=\"smith-machine-shrug-n-e-upper.r\" d=\"^10\"/><path id=\"smith-machine-shrug-n-e-elbowcap.r\" d=\"^11\"/><path id=\"smith-machine-shrug-n-e-fore.r\" d=\"^12\"/><path id=\"smith-machine-shrug-n-e-fist.r\" d=\"^13\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#smith-machine-shrug-n-dots)\"/>\n  <path class=\"datum\" d=\"~MPJpSXoLP)80\"/><path class=\"datum\" d=\"~MPJp!GnLP)80\"/><path class=\"floorline\" d=\"M110.17 339.5H275.47\"/><path class=\"eq\" d=\"~MSPD1HIw2L0.W-1Q0VdVdDG-1LWdWdQXd0XdWdLYdDG-1Q0YdYdzG-1LXdXdQWd0WdXdZ\"/><path class=\"eq\" d=\"~M!XG1Pwy2L0OT.1Q0E6E6FK.1LXS1F6QE60YS1F6LF6FK.1Q0F6F6EK.1LYS1E6QF60XS1E6Z\"/><path class=\"eq-thin\" d=\"M207.58 295.11h1.2M207.58 287.8h1.2M207.58 280.49h1.2M207.58 273.17h1.2M207.58 265.86h1.2M207.58 258.54h1.2M207.58 251.23h1.2M207.58 243.91h1.2M207.58 236.6h1.2M207.58 229.29h1.2M207.58 221.97h1.2M207.58 214.66h1.2M207.58 207.34h1.2M207.58 200.03h1.2M207.58 192.71h1.2M207.58 185.4h1.2M207.58 178.09h1.2M207.58 170.77h1.2M207.58 163.46h1.2M207.58 156.14h1.2M207.58 148.83h1.2M207.58 141.51h1.2M207.58 134.2h1.2M207.58 126.89h1.2M207.58 119.57h1.2M207.58 112.26h1.2M207.58 104.94h1.2M207.58 97.63h1.2M207.58 90.31h1.2M207.58 83h1.2M207.58 75.69h1.2M207.58 68.37h1.2M207.58 61.06h1.2M207.58 53.74h1.2\"/><path class=\"eq\" d=\"~MwBB1U*7LDJ40Qwp0BT3)oL)oAkQ0)o)ozkLBT3wpQ)o0DT3wpLwpzkQ0wpwpAkZ\"/><path class=\"eq\" d=\"~MwJz1YDy2LN.e0Q!m0RAe.mL.m!mQ0-m.m-mLRAe_mQ.m0SAe_mL!m-mQ0!m!m!mZ\"/><path class=\"arc measure\" d=\"M180.48 174.32L178.78 156.4A18 18 0 0 1 185.7 191.54Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#smith-machine-shrug-n-st-shcap.r\"/><use href=\"#smith-machine-shrug-n-st-upper.r\"/><use href=\"#smith-machine-shrug-n-st-elbowcap.r\"/><use href=\"#smith-machine-shrug-n-st-fore.r\"/><use href=\"#smith-machine-shrug-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#smith-machine-shrug-n-st-shcap.r\"/><use href=\"#smith-machine-shrug-n-st-upper.r\"/><use href=\"#smith-machine-shrug-n-st-elbowcap.r\"/><use href=\"#smith-machine-shrug-n-st-fore.r\"/><use href=\"#smith-machine-shrug-n-st-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MH(B1(zJ1LA90Q!m0Yd.mL.m!mQ0-m.m-mLYd_mQ.m0Xd_mL!m-mQ0!m!m!mZ\"/><path class=\"eq\" d=\"~MH(D1(zJ1Lyk0Lxk)vLVdww1LWdHiLI6GiZ\"/><path class=\"eq-line\" d=\"~~AVvyKI1WK62\"/><path class=\"eq-thin\" d=\"~~D_w1yKI1WF50\"/><path class=\"eq-solid\" d=\"~~wJB1yKI1!m1\"/><path class=\"eq-pin\" d=\"~~U!B1yKI1F60\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#smith-machine-shrug-n-e-thigh.l\"/><use href=\"#smith-machine-shrug-n-e-kneecap.l\"/><use href=\"#smith-machine-shrug-n-e-shank.l\"/><use href=\"#smith-machine-shrug-n-e-foot.l\"/><use href=\"#smith-machine-shrug-n-e-shcap.l\"/><use href=\"#smith-machine-shrug-n-e-upper.l\"/><use href=\"#smith-machine-shrug-n-e-elbowcap.l\"/><use href=\"#smith-machine-shrug-n-e-fore.l\"/><use href=\"#smith-machine-shrug-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#smith-machine-shrug-n-e-thigh.l\"/><use href=\"#smith-machine-shrug-n-e-kneecap.l\"/><use href=\"#smith-machine-shrug-n-e-shank.l\"/><use href=\"#smith-machine-shrug-n-e-foot.l\"/><use href=\"#smith-machine-shrug-n-e-shcap.l\"/><use href=\"#smith-machine-shrug-n-e-upper.l\"/><use href=\"#smith-machine-shrug-n-e-elbowcap.l\"/><use href=\"#smith-machine-shrug-n-e-fore.l\"/><use href=\"#smith-machine-shrug-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#smith-machine-shrug-n-e-head\"/><use href=\"#smith-machine-shrug-n-e-torso\"/><use href=\"#smith-machine-shrug-n-e-thigh.r\"/><use href=\"#smith-machine-shrug-n-e-kneecap.r\"/><use href=\"#smith-machine-shrug-n-e-shank.r\"/><use href=\"#smith-machine-shrug-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#smith-machine-shrug-n-e-head\"/><use href=\"#smith-machine-shrug-n-e-torso\"/><use href=\"#smith-machine-shrug-n-e-thigh.r\"/><use href=\"#smith-machine-shrug-n-e-kneecap.r\"/><use href=\"#smith-machine-shrug-n-e-shank.r\"/><use href=\"#smith-machine-shrug-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#smith-machine-shrug-n-e-shcap.r\"/><use href=\"#smith-machine-shrug-n-e-upper.r\"/><use href=\"#smith-machine-shrug-n-e-elbowcap.r\"/><use href=\"#smith-machine-shrug-n-e-fore.r\"/><use href=\"#smith-machine-shrug-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#smith-machine-shrug-n-e-shcap.r\"/><use href=\"#smith-machine-shrug-n-e-upper.r\"/><use href=\"#smith-machine-shrug-n-e-elbowcap.r\"/><use href=\"#smith-machine-shrug-n-e-fore.r\"/><use href=\"#smith-machine-shrug-n-e-fist.r\"/></g></g><path class=\"eq\" d=\"~My*y1URO1LSI60QPc0x)5OcLOcB8Q0OcOcD8Lx)5PcQOc0y)5PcLPcD8Q0PcPcB8Z\"/><path class=\"eq-solid\" d=\"~#o2PxE1_zI1)wE1ETH1G8)1E6-5O2B8w2I8_5E6iOy2J9wA2S8S4_2F9R4P8(t_*1100000200202202000001000001001002000000010101010\"/><path class=\"eq-solid\" d=\"^29\"/><path class=\"eq-pin\" d=\"^30\"/><path class=\"eq-cable m-line\" d=\"~MPPw1HTmLz2A5L53L31L31L10L00L04L13L55L31L02L04L68L6aL8gL8eL4cL6aL48L68L42L42\"/><path class=\"eq-cable m-line\" d=\"~MPYB1PPqLE2K7L54L58L3aL1aL0gL3gL7gL3aL1aL08L24L40L80L64L18L66L00L82L45\"/><path class=\"eq-cable m-line\" d=\"~MW-D1__J1LV1X8LG3H1LI2P2LI1D3L0P3LH1D3LP2P2LD3H1LP30LD3I1LP2I2LH1G3L0I3LI1G3LI2I2LG3I1\"/><circle class=\"joint\" cx=\"176\" cy=\"127.02\" r=\"2.25\"/><circle class=\"joint\" cx=\"180.48\" cy=\"174.32\" r=\"2.25\"/><circle class=\"joint\" cx=\"176\" cy=\"203.45\" r=\"2.25\"/><circle class=\"joint\" cx=\"178.74\" cy=\"266.11\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#!20wJy1UWo)Iy1RXo0001020000010200000102000001020000000102000001020000010200000102000001020000000102000001020000000000000000000000000000000000000000000200000000000000020000000000000000010000000000000000000000000000000000000000000000000200000000000000020000000000000000010000000000000000000000\"/><path class=\"arrow\" d=\"~MwJy1HBmLYiPB1LEY1OB1Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M178.78 156.4A18 18 0 0 1 185.7 191.54\"/><g class=\"arc-ticks\"><path d=\"~MY)y1JHvLG5)X1\"/><path d=\"~MJxA1DVA1LHg!V1\"/></g><path class=\"leader\" d=\"~MUyE1HGx1LAJ8RI5\"/></g></g><path class=\"leader\" d=\"M193.9 192.2L217 183H227\"/><circle class=\"anchor\" cx=\"193.9\" cy=\"192.2\" r=\"1.5\"/><path class=\"leader\" d=\"M176 119.34L122.06 114H112.06\"/><circle class=\"anchor\" cx=\"176\" cy=\"119.34\" r=\"1.5\"/><path class=\"leader\" d=\"M176 83.13L136.58 66H126.58\"/><circle class=\"anchor\" cx=\"176\" cy=\"83.13\" r=\"1.5\"/>\n<g class=\"plate-zoom\" data-view=\"normal\" data-k=\"3.5\" data-c=\"96 196\" data-src=\"176 122.99\"><defs><clipPath id=\"smith-machine-shrug-n-zclip\"><circle cx=\"96\" cy=\"196\" r=\"52\"/></clipPath></defs><circle class=\"pz-src\" cx=\"176\" cy=\"122.99\" r=\"14.86\"/><path class=\"pz-link\" d=\"~MNEw1F)pLI)5WN5\"/><circle class=\"pz-bg\" cx=\"96\" cy=\"196\" r=\"52\"/><g class=\"pz-in\" clip-path=\"url(#smith-machine-shrug-n-zclip)\">\n  <defs><pattern id=\"smith-machine-shrug-n-z-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"smith-machine-shrug-n-z-st-shcap.r\" d=\"~~wPdwxN1wF50\"/><path id=\"smith-machine-shrug-n-z-st-upper.r\" d=\"~#F12YPd_PN1EFdGUH1I1Evy11woYA5y9Vly4.aJ7RE4!sTA2K5G-1BG1)*1Xw1Xz4)5.9)cTjN7HD5z12R4-u-Y1H1GE1S*2J7FN2DY1NU200001000120002020000111101010000000000000020000000002000000200000000000010000002\"/><path id=\"smith-machine-shrug-n-z-st-elbowcap.r\" d=\"~~Y(hWIN2D.32\"/><path id=\"smith-machine-shrug-n-z-st-fore.r\" d=\"~#F12W(hyRO2EJhzPJ2V4BA1N4P5_X1wN4J2.y1y3O9xw1)N3waXR1IbTB1)z1-z1*y1xN3.7B6GlVrNw1yV4lw7zgTw1zy1Y9IfFJ2PhW-1AX1!W100210100000000000001000000012021001100002000000000000010102200200100100120010000\"/><path id=\"smith-machine-shrug-n-z-st-fist.r\" d=\"~~wFsHAO3wP30\"/><path id=\"smith-machine-shrug-n-z-e-thigh.l\" d=\"~#F12NIa_U*2xX9*PY2B8-F1I46YlY_6WjGsy9zemB_5UE1GS2x3TD2VN1RN2*gI-5GaEd)lRqT2!.6J45U4KG1*N3OA1KD2HS4P5U*3(S2SI400000010000000000020000010110000000101020002102000000200002100010010120000000000\"/><path id=\"smith-machine-shrug-n-z-e-kneecap.l\" d=\"~~DXfUzF4_!40\"/><path id=\"smith-machine-shrug-n-z-e-shank.l\" d=\"~#F12WRfS!E4)Bg)Xy4A8)F1J46J7(!6AmTqDaGd.2-H7UrON1_1.G1OnVP1JnVG7x9BeVjIsTqJ.6G43R4TG1TN1(D1xS1HU2I3(I2UH1HY200000000000000000000101000100000120200200100101000001100021010000000000010002021\"/><path id=\"smith-machine-shrug-n-z-e-foot.l\" d=\"~#o2DTfUFO5XPhTYI5YJ1DbU*1)rS-2)T2U-9Bb-J8XgID4xs)T20TR4_gBE1-J1_A3zE1KN2P-2000010001000100000000200210000000000000002000100\"/><path id=\"smith-machine-shrug-n-z-e-shcap.l\" d=\"~~wPdwxG1wF50\"/><path id=\"smith-machine-shrug-n-z-e-upper.l\" d=\"~#F12YPd_PG1EFdGUB1I1Evy11woYA5y9Xly4-aJ7RE4!sRA2K5I-1BG1)*1Xw1Xz4)5.9)cTjN7HD5z12R4-u-Y1H1GE1S*2J7FN2DY1NU200001000120002020002101000000200000000000020000000002000000000000000000010000002\"/><path id=\"smith-machine-shrug-n-z-e-elbowcap.l\" d=\"~~Y(hWIG2D.32\"/><path id=\"smith-machine-shrug-n-z-e-fore.l\" d=\"~#F12W(hyRH2EJhzPE2V4BA1N4P5_X1wN4J2*y1y3I9xw1zO3waTR1IbVB1)z1-z1*y1xN3.7B6GlVrNw1yV4lw7zgTw1zy1W9IfJJ2PhS-1AX1wX100210100000000010000020001002221011100002000000000000010102200210100100120000200\"/><path id=\"smith-machine-shrug-n-z-e-fist.l\" d=\"~~wFsHAH3wP30\"/><path id=\"smith-machine-shrug-n-z-e-head\" d=\"~#w12wYiwxb-AdK)9Bz2Fz2Bz2Ux1BE1EbEb_gXg)rxsBE1R*1KN2_gXJ1T5Tx1Bz20JN2EE1NN2Gm_F2AbDz2yY1T5Dz20100020000000100000000000000000000000100000100002201000000000000\"/><path id=\"smith-machine-shrug-n-z-e-torso\" d=\"~#_12wPdwVrTReTSmRx1ID3Bbww3Sx1UK3Ux1TG1YJ1wY1Nm2ImxU2KN2)r-J1_gyY1-gYF2KmNN2*X1S*1T*1_gTx1)r*X1B)2E.3BE1B)2Km0Tx11!J1yY1AbwsXJ1)r)X1)jKm_Y3NmJD2_J1BX2Abwszz9wP300000000001012021000100000010100011000000101000002101010000200000001011011010100001000200000000000000100001000200000\"/><path id=\"smith-machine-shrug-n-z-e-thigh.r\" d=\"^51\"/><path id=\"smith-machine-shrug-n-z-e-kneecap.r\" d=\"^52\"/><path id=\"smith-machine-shrug-n-z-e-shank.r\" d=\"^53\"/><path id=\"smith-machine-shrug-n-z-e-foot.r\" d=\"^54\"/><path id=\"smith-machine-shrug-n-z-e-shcap.r\" d=\"^55\"/><path id=\"smith-machine-shrug-n-z-e-upper.r\" d=\"^56\"/><path id=\"smith-machine-shrug-n-z-e-elbowcap.r\" d=\"^57\"/><path id=\"smith-machine-shrug-n-z-e-fore.r\" d=\"^58\"/><path id=\"smith-machine-shrug-n-z-e-fist.r\" d=\"^59\"/></defs>\n  \n  <path class=\"floorline\" d=\"M-134.41 952.54H444.17\"/><path class=\"eq\" d=\"M170.24 922.44L170.24 -119.19Q170.24 -123.19 166.24 -123.19L158.88 -123.19Q154.88 -123.19 154.88 -119.19L154.88 922.44Q154.88 926.44 158.88 926.44L166.24 926.44Q170.24 926.44 170.24 922.44Z\"/><path class=\"eq\" d=\"M228.1 951.04L228.1 -122.19Q228.1 -123.19 227.1 -123.19L190.19 -123.19Q189.19 -123.19 189.19 -122.19L189.19 951.04Q189.19 952.04 190.19 952.04L227.1 952.04Q228.1 952.04 228.1 951.04Z\"/><path class=\"eq-thin\" d=\"M208.04 798.43h1.2M208.04 772.83h1.2M208.04 747.23h1.2M208.04 721.63h1.2M208.04 696.03h1.2M208.04 670.43h1.2M208.04 644.83h1.2M208.04 619.23h1.2M208.04 593.63h1.2M208.04 568.03h1.2M208.04 542.42h1.2M208.04 516.82h1.2M208.04 491.22h1.2M208.04 465.62h1.2M208.04 440.02h1.2M208.04 414.42h1.2M208.04 388.82h1.2M208.04 363.22h1.2M208.04 337.62h1.2M208.04 312.02h1.2M208.04 286.42h1.2M208.04 260.82h1.2M208.04 235.22h1.2M208.04 209.62h1.2M208.04 184.01h1.2M208.04 158.41h1.2M208.04 132.81h1.2M208.04 107.21h1.2M208.04 81.61h1.2M208.04 56.01h1.2M208.04 30.41h1.2M208.04 4.81h1.2M208.04 -20.79h1.2M208.04 -46.39h1.2\"/><path class=\"eq\" d=\"M135.84 -92.47L234.34 -92.47Q238.34 -92.47 238.34 -96.47L238.34 -119.19Q238.34 -123.19 234.34 -123.19L135.84 -123.19Q131.84 -123.19 131.84 -119.19L131.84 -96.47Q131.84 -92.47 135.84 -92.47Z\"/><path class=\"eq\" d=\"~MwRkF(-5LyNX10Qwp0xVW1)oL)o)U2Q0)o)owV2LxVW1wpQ)o0yVW1wpLwpwV2Q0wpwp)U2Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#smith-machine-shrug-n-z-st-shcap.r\"/><use href=\"#smith-machine-shrug-n-z-st-upper.r\"/><use href=\"#smith-machine-shrug-n-z-st-elbowcap.r\"/><use href=\"#smith-machine-shrug-n-z-st-fore.r\"/><use href=\"#smith-machine-shrug-n-z-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#smith-machine-shrug-n-z-st-shcap.r\"/><use href=\"#smith-machine-shrug-n-z-st-upper.r\"/><use href=\"#smith-machine-shrug-n-z-st-elbowcap.r\"/><use href=\"#smith-machine-shrug-n-z-st-fore.r\"/><use href=\"#smith-machine-shrug-n-z-st-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MwRtHUJ3LwN40Qwp0)U3)oL)o)U2Q0)o)owV2L)U3wpQ)o0wV3wpLwpwV2Q0wpwp)U2Z\"/><path class=\"eq\" d=\"~MwYy1HUJ3LND20LKD2)O3L)O1wP3LwP1ww2LKm))1Z\"/><path class=\"eq-line\" d=\"~~wF9HAH3wPm2\"/><path class=\"eq-thin\" d=\"~~UGdHAH3NNi1\"/><path class=\"eq-solid\" d=\"~~wFtHAH3wP20\"/><path class=\"eq-pin\" d=\"~~YRvHAH3F60\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#smith-machine-shrug-n-z-e-thigh.l\"/><use href=\"#smith-machine-shrug-n-z-e-kneecap.l\"/><use href=\"#smith-machine-shrug-n-z-e-shank.l\"/><use href=\"#smith-machine-shrug-n-z-e-foot.l\"/><use href=\"#smith-machine-shrug-n-z-e-shcap.l\"/><use href=\"#smith-machine-shrug-n-z-e-upper.l\"/><use href=\"#smith-machine-shrug-n-z-e-elbowcap.l\"/><use href=\"#smith-machine-shrug-n-z-e-fore.l\"/><use href=\"#smith-machine-shrug-n-z-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#smith-machine-shrug-n-z-e-thigh.l\"/><use href=\"#smith-machine-shrug-n-z-e-kneecap.l\"/><use href=\"#smith-machine-shrug-n-z-e-shank.l\"/><use href=\"#smith-machine-shrug-n-z-e-foot.l\"/><use href=\"#smith-machine-shrug-n-z-e-shcap.l\"/><use href=\"#smith-machine-shrug-n-z-e-upper.l\"/><use href=\"#smith-machine-shrug-n-z-e-elbowcap.l\"/><use href=\"#smith-machine-shrug-n-z-e-fore.l\"/><use href=\"#smith-machine-shrug-n-z-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#smith-machine-shrug-n-z-e-head\"/><use href=\"#smith-machine-shrug-n-z-e-torso\"/><use href=\"#smith-machine-shrug-n-z-e-thigh.r\"/><use href=\"#smith-machine-shrug-n-z-e-kneecap.r\"/><use href=\"#smith-machine-shrug-n-z-e-shank.r\"/><use href=\"#smith-machine-shrug-n-z-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#smith-machine-shrug-n-z-e-head\"/><use href=\"#smith-machine-shrug-n-z-e-torso\"/><use href=\"#smith-machine-shrug-n-z-e-thigh.r\"/><use href=\"#smith-machine-shrug-n-z-e-kneecap.r\"/><use href=\"#smith-machine-shrug-n-z-e-shank.r\"/><use href=\"#smith-machine-shrug-n-z-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#smith-machine-shrug-n-z-e-shcap.r\"/><use href=\"#smith-machine-shrug-n-z-e-upper.r\"/><use href=\"#smith-machine-shrug-n-z-e-elbowcap.r\"/><use href=\"#smith-machine-shrug-n-z-e-fore.r\"/><use href=\"#smith-machine-shrug-n-z-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#smith-machine-shrug-n-z-e-shcap.r\"/><use href=\"#smith-machine-shrug-n-z-e-upper.r\"/><use href=\"#smith-machine-shrug-n-z-e-elbowcap.r\"/><use href=\"#smith-machine-shrug-n-z-e-fore.r\"/><use href=\"#smith-machine-shrug-n-z-e-fist.r\"/></g></g><path class=\"eq\" d=\"~MPUjHUY3LwEo0QPc0O_nOcLOcO_3Q0OcOcP_3LO_nPcQOc0P_nPcLPcP_3Q0PcPcO_3Z\"/><path class=\"eq-solid\" d=\"~#o2Dzz1_zG3Gxz1.GE3Bt-6*lOkV8Xs_6BtPk*l(1XF7wx1AN7_t!fY9Jw1*fWt!F3JY6000020000000200002000002000000010002001111000000\"/><path class=\"eq-solid\" d=\"^72\"/><path class=\"eq-pin\" d=\"^73\"/><path class=\"eq-cable m-line\" d=\"~MWEc(Gx1LO7yiLhfLf9L95L70L12L06L95LjlL95L34L8eLcsLmD1Lw1S1LqW1LgH1LiA1LgsLimLgcLg8\"/><path class=\"eq-cable m-line\" d=\"~MWTuHwO1L-7xqLngLjqLdy1L5F1L1U1LdY1LnW1LfH1L9w1L0qLacLg6Lo3LicL4w1L6iLe8Li3Lkf\"/><path class=\"eq-cable m-line\" d=\"~MwFy1HAO3Lx6TuLGbW4LR8U8LV4DbL0FcLW4DbLU8U8LDbW4LFc0LDbV4LU8R8LW4GbL0zcLV4GbLR8R8LGbV4\"/><circle class=\"joint\" cx=\"96\" cy=\"210.08\" r=\"2.25\"/><circle class=\"joint\" cx=\"111.67\" cy=\"375.63\" r=\"2.25\"/><circle class=\"joint\" cx=\"96\" cy=\"477.61\" r=\"2.25\"/><circle class=\"joint\" cx=\"105.6\" cy=\"696.9\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#!20wYiWVF1)Xix-F10200010200010200010200010200010200010200010200010200010200010200010200010200010200010200010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000\"/><path class=\"arrow\" d=\"~MwYi_Wy1LYiPB1LEY1OB1Z\"/></g>\n</g><circle class=\"pz-ring\" cx=\"96\" cy=\"196\" r=\"52\"/></g></svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"smith-machine-shrug-n-arms\" data-key=\"arms\" data-cue=\"Let your arms hang long with only a slight bend at the elbows.\" class=\"plate-callout\" style=\"left:62.01%;top:44.97%\" aria-pressed=\"true\">Arms long</button><button type=\"button\" id=\"smith-machine-shrug-n-up\" data-key=\"up\" data-cue=\"Lift your shoulders up toward your ears and lower them, with no rolling.\" class=\"plate-callout\" style=\"left:6.7%;top:25.7%\" aria-pressed=\"false\">Straight up</button><button type=\"button\" id=\"smith-machine-shrug-n-head\" data-key=\"head\" data-cue=\"Keep your head level, not pushed forward.\" class=\"plate-callout\" style=\"left:13.97%;top:12.29%\" aria-pressed=\"false\">Head still</button><span class=\"plate-arc-label\" style=\"left:68.72%;top:37.99%\"><b>Elbow</b><span>slight bend</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"smith-machine-shrug-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"smith-machine-shrug-m-st-shcap.r\" d=\"^0\"/><path id=\"smith-machine-shrug-m-st-upper.r\" d=\"^1\"/><path id=\"smith-machine-shrug-m-st-elbowcap.r\" d=\"^2\"/><path id=\"smith-machine-shrug-m-st-fore.r\" d=\"^3\"/><path id=\"smith-machine-shrug-m-st-fist.r\" d=\"^4\"/><path id=\"smith-machine-shrug-m-e-thigh.l\" d=\"^5\"/><path id=\"smith-machine-shrug-m-e-kneecap.l\" d=\"^6\"/><path id=\"smith-machine-shrug-m-e-shank.l\" d=\"^7\"/><path id=\"smith-machine-shrug-m-e-foot.l\" d=\"^8\"/><path id=\"smith-machine-shrug-m-e-shcap.l\" d=\"^9\"/><path id=\"smith-machine-shrug-m-e-upper.l\" d=\"^10\"/><path id=\"smith-machine-shrug-m-e-elbowcap.l\" d=\"^11\"/><path id=\"smith-machine-shrug-m-e-fore.l\" d=\"^12\"/><path id=\"smith-machine-shrug-m-e-fist.l\" d=\"^13\"/><path id=\"smith-machine-shrug-m-e-head\" d=\"^14\"/><path id=\"smith-machine-shrug-m-e-torso\" d=\"^15\"/><path id=\"smith-machine-shrug-m-e-thigh.r\" d=\"^5\"/><path id=\"smith-machine-shrug-m-e-kneecap.r\" d=\"^6\"/><path id=\"smith-machine-shrug-m-e-shank.r\" d=\"^7\"/><path id=\"smith-machine-shrug-m-e-foot.r\" d=\"^8\"/><path id=\"smith-machine-shrug-m-e-shcap.r\" d=\"^9\"/><path id=\"smith-machine-shrug-m-e-upper.r\" d=\"^10\"/><path id=\"smith-machine-shrug-m-e-elbowcap.r\" d=\"^11\"/><path id=\"smith-machine-shrug-m-e-fore.r\" d=\"^12\"/><path id=\"smith-machine-shrug-m-e-fist.r\" d=\"^13\"/><path id=\"smith-machine-shrug-m-m-head\" d=\"~#w12N-A1PwhTJz1*BgToNbElN2O9-6T4N3X1B9V3Ed*8xr(8KaY1O9)hT6!o-2DnU1PiAaScUlx8Nh1010002000000000200020000010000000020000202000000002000000010100\"/><path id=\"smith-machine-shrug-m-m-torso\" d=\"~#_12HYx1((kBRy1TWjX1zqI1yF1DfUlU9.bYcwgN60I6)nKm)7Xc_4(f-4_kI6NmxgShRh_4R9)7xgBrBz1EbBrG60V90!cwgA3w8Xc)7)fV5)7WF1P8UlHpOiH1E5z-2S100000001210000000000000220022000122000100000000100000000000001001000000022101200000010000000001000000000000000200000\"/><path id=\"smith-machine-shrug-m-mf-thigh.l\" d=\"^5\"/><path id=\"smith-machine-shrug-m-mf-kneecap.l\" d=\"^6\"/><path id=\"smith-machine-shrug-m-mf-shank.l\" d=\"^7\"/><path id=\"smith-machine-shrug-m-mf-foot.l\" d=\"^8\"/><path id=\"smith-machine-shrug-m-mf-shcap.l\" d=\"^9\"/><path id=\"smith-machine-shrug-m-mf-upper.l\" d=\"^10\"/><path id=\"smith-machine-shrug-m-mf-elbowcap.l\" d=\"^11\"/><path id=\"smith-machine-shrug-m-mf-fore.l\" d=\"^12\"/><path id=\"smith-machine-shrug-m-mf-fist.l\" d=\"^13\"/><path id=\"smith-machine-shrug-m-mf-thigh.r\" d=\"^5\"/><path id=\"smith-machine-shrug-m-mf-kneecap.r\" d=\"^6\"/><path id=\"smith-machine-shrug-m-mf-shank.r\" d=\"^7\"/><path id=\"smith-machine-shrug-m-mf-foot.r\" d=\"^8\"/><path id=\"smith-machine-shrug-m-mf-shcap.r\" d=\"^9\"/><path id=\"smith-machine-shrug-m-mf-upper.r\" d=\"^10\"/><path id=\"smith-machine-shrug-m-mf-elbowcap.r\" d=\"^11\"/><path id=\"smith-machine-shrug-m-mf-fore.r\" d=\"^12\"/><path id=\"smith-machine-shrug-m-mf-fist.r\" d=\"^13\"/><path id=\"smith-machine-shrug-m-mo-0\" d=\"^14\"/><path id=\"smith-machine-shrug-m-mo-1\" d=\"^15\"/><path id=\"smith-machine-shrug-m-mo-2\" d=\"^5\"/><path id=\"smith-machine-shrug-m-mo-3\" d=\"^6\"/><path id=\"smith-machine-shrug-m-mo-4\" d=\"^7\"/><path id=\"smith-machine-shrug-m-mo-5\" d=\"^8\"/><path id=\"smith-machine-shrug-m-mo-6\" d=\"^9\"/><path id=\"smith-machine-shrug-m-mo-7\" d=\"^10\"/><path id=\"smith-machine-shrug-m-mo-8\" d=\"^11\"/><path id=\"smith-machine-shrug-m-mo-9\" d=\"^12\"/><path id=\"smith-machine-shrug-m-mo-10\" d=\"^13\"/><path id=\"smith-machine-shrug-m-mo-11\" d=\"^5\"/><path id=\"smith-machine-shrug-m-mo-12\" d=\"^6\"/><path id=\"smith-machine-shrug-m-mo-13\" d=\"^7\"/><path id=\"smith-machine-shrug-m-mo-14\" d=\"^8\"/><path id=\"smith-machine-shrug-m-mo-15\" d=\"^9\"/><path id=\"smith-machine-shrug-m-mo-16\" d=\"^10\"/><path id=\"smith-machine-shrug-m-mo-17\" d=\"^11\"/><path id=\"smith-machine-shrug-m-mo-18\" d=\"^12\"/><path id=\"smith-machine-shrug-m-mo-19\" d=\"^13\"/><path id=\"smith-machine-shrug-m-mo-20\" d=\"^25\"/><path id=\"smith-machine-shrug-m-mo-21\" d=\"^26\"/><path id=\"smith-machine-shrug-m-mo-22\" d=\"^31\"/><path id=\"smith-machine-shrug-m-mo-23\" d=\"^19\"/><path id=\"smith-machine-shrug-m-mo-24\" d=\"^20\"/><path id=\"smith-machine-shrug-m-mo-25\" d=\"^22\"/><path id=\"smith-machine-shrug-m-mo-26\" d=\"^23\"/><path id=\"smith-machine-shrug-m-mo-27\" d=\"^29\"/><path id=\"smith-machine-shrug-m-mo-28\" d=\"^30\"/><path id=\"smith-machine-shrug-m-mo-29\" d=\"^32\"/><path id=\"smith-machine-shrug-m-mo-30\" d=\"^29\"/><path id=\"smith-machine-shrug-m-mo-31\" d=\"^30\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#smith-machine-shrug-m-dots)\"/>\n  <path class=\"datum\" d=\"^16\"/><path class=\"floorline\" d=\"^18\"/><path class=\"eq\" d=\"^19\"/><path class=\"eq\" d=\"^20\"/><path class=\"eq-thin\" d=\"^21\"/><path class=\"eq\" d=\"^22\"/><path class=\"eq\" d=\"^23\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#smith-machine-shrug-m-st-shcap.r\"/><use href=\"#smith-machine-shrug-m-st-upper.r\"/><use href=\"#smith-machine-shrug-m-st-elbowcap.r\"/><use href=\"#smith-machine-shrug-m-st-fore.r\"/><use href=\"#smith-machine-shrug-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#smith-machine-shrug-m-st-shcap.r\"/><use href=\"#smith-machine-shrug-m-st-upper.r\"/><use href=\"#smith-machine-shrug-m-st-elbowcap.r\"/><use href=\"#smith-machine-shrug-m-st-fore.r\"/><use href=\"#smith-machine-shrug-m-st-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^25\"/><path class=\"eq\" d=\"^26\"/><path class=\"eq-line\" d=\"^27\"/><path class=\"eq-thin\" d=\"^28\"/><path class=\"eq-solid\" d=\"^29\"/><path class=\"eq-pin\" d=\"^30\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#smith-machine-shrug-m-e-thigh.l\"/><use href=\"#smith-machine-shrug-m-e-kneecap.l\"/><use href=\"#smith-machine-shrug-m-e-shank.l\"/><use href=\"#smith-machine-shrug-m-e-foot.l\"/><use href=\"#smith-machine-shrug-m-e-shcap.l\"/><use href=\"#smith-machine-shrug-m-e-upper.l\"/><use href=\"#smith-machine-shrug-m-e-elbowcap.l\"/><use href=\"#smith-machine-shrug-m-e-fore.l\"/><use href=\"#smith-machine-shrug-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#smith-machine-shrug-m-e-thigh.l\"/><use href=\"#smith-machine-shrug-m-e-kneecap.l\"/><use href=\"#smith-machine-shrug-m-e-shank.l\"/><use href=\"#smith-machine-shrug-m-e-foot.l\"/><use href=\"#smith-machine-shrug-m-e-shcap.l\"/><use href=\"#smith-machine-shrug-m-e-upper.l\"/><use href=\"#smith-machine-shrug-m-e-elbowcap.l\"/><use href=\"#smith-machine-shrug-m-e-fore.l\"/><use href=\"#smith-machine-shrug-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#smith-machine-shrug-m-e-head\"/><use href=\"#smith-machine-shrug-m-e-torso\"/><use href=\"#smith-machine-shrug-m-e-thigh.r\"/><use href=\"#smith-machine-shrug-m-e-kneecap.r\"/><use href=\"#smith-machine-shrug-m-e-shank.r\"/><use href=\"#smith-machine-shrug-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#smith-machine-shrug-m-e-head\"/><use href=\"#smith-machine-shrug-m-e-torso\"/><use href=\"#smith-machine-shrug-m-e-thigh.r\"/><use href=\"#smith-machine-shrug-m-e-kneecap.r\"/><use href=\"#smith-machine-shrug-m-e-shank.r\"/><use href=\"#smith-machine-shrug-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#smith-machine-shrug-m-e-shcap.r\"/><use href=\"#smith-machine-shrug-m-e-upper.r\"/><use href=\"#smith-machine-shrug-m-e-elbowcap.r\"/><use href=\"#smith-machine-shrug-m-e-fore.r\"/><use href=\"#smith-machine-shrug-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#smith-machine-shrug-m-e-shcap.r\"/><use href=\"#smith-machine-shrug-m-e-upper.r\"/><use href=\"#smith-machine-shrug-m-e-elbowcap.r\"/><use href=\"#smith-machine-shrug-m-e-fore.r\"/><use href=\"#smith-machine-shrug-m-e-fist.r\"/></g></g><path class=\"eq\" d=\"^31\"/><path class=\"eq-solid\" d=\"^32\"/><path class=\"eq-solid\" d=\"^29\"/><path class=\"eq-pin\" d=\"^30\"/><circle class=\"joint\" cx=\"176\" cy=\"127.02\" r=\"2.25\"/><circle class=\"joint\" cx=\"180.48\" cy=\"174.32\" r=\"2.25\"/><circle class=\"joint\" cx=\"176\" cy=\"203.45\" r=\"2.25\"/><circle class=\"joint\" cx=\"178.74\" cy=\"266.11\" r=\"2.25\"/></g><mask id=\"smith-machine-shrug-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#smith-machine-shrug-m-m-head\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-m-torso\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-shank.l\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-foot.l\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-upper.l\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-fore.l\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-fist.l\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-shank.r\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-foot.r\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-upper.r\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-fore.r\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mf-fist.r\" fill=\"#000\"/><use href=\"#smith-machine-shrug-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#smith-machine-shrug-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#smith-machine-shrug-m-mmask)\"><g class=\"u-stroke\"><use href=\"#smith-machine-shrug-m-m-head\"/><use href=\"#smith-machine-shrug-m-m-torso\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~#w80N-A1PwhBUA1x(gg8ac483696f6n4j6d8d894d472b09192f4d2707033331537355333313400160854043000130519250115031307371515201735191b7f3hbj7h5h59294740c1a16365256315211741676315515393h1j3n1d5714380k1o0m0e3c1e1a0c2c0c2a0g0a1c2a2a68686a6c086a4688a6e4cagca8e881c185898d878781a084a88c800100100022000210000000020000000001010100001001000012100110101012100101111200100200120001012000200000002000000011112000001101002200011002000002200101011011100002000000101020002002000100000001000000011100002020000201000000000000021010110020101000000020020000000100101010120001000002201000000000100201010001200010000010100001000000110000001000200200000020020010000002000000000000000000002000200000000010100000000012020002000100200001000002000000001000000000002002002101000000000001110200110001010100000000000010000\"/><path class=\"m-arrow\" d=\"~MwBz1SNfLNK2(oMRtDaLStBaLTO1Gf\"/><path class=\"leader m\" d=\"~MN-A1PwhL0O(2\"/><path class=\"leader m\" d=\"~MS)B1N.mLDS55\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"smith-machine-shrug-m-head\" data-key=\"head\" data-cue=\"The head pushes forward as the shoulders rise.\" class=\"plate-callout m\" style=\"left:21.79%;top:10.89%\" aria-pressed=\"true\">Head forward</button><button type=\"button\" id=\"smith-machine-shrug-m-chin\" data-key=\"chin\" data-cue=\"The chin drops instead of the head staying level.\" class=\"plate-callout m\" style=\"left:60.89%;top:26.54%\" aria-pressed=\"false\">Chin drops</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "arms",
        cues: [{ key: "arms", cue: "Let your arms hang long with only a slight bend at the elbows." }, { key: "up", cue: "Lift your shoulders up toward your ears and lower them, with no rolling." }, { key: "head", cue: "Keep your head level, not pushed forward." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "head",
        cues: [{ key: "head", cue: "The head pushes forward as the shoulders rise." }, { key: "chin", cue: "The chin drops instead of the head staying level." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Head forward</b><span>The head pushes forward as the shoulders rise.</span></li><li><b>Chin drops</b><span>The chin drops instead of the head staying level.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lift 2 seconds, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lift</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Smith machine shrug, side view. Standing tall, the Smith bar hangs at mid-thigh on long arms with a slight elbow bend. Only the shoulders lift, straight up toward the ears, and lower again. The head stays level.",
      mistakeAlt: "Smith Machine Shrug: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hold",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: shrug-grip, inherited from barbell_shrug: the Wrong is a thumb fault and no key draws one.",
    "orientation": "pronated",
    "loadAxis": "across",
    "overBody": false,
    "width": {
      "text": "Slightly wider than your shoulders.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-smith-shrug"
        ],
        "note": "c1"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "baechle-grip"
        ],
        "note": "card inherit grip.thumb: the same overhand straight bar (c1; parent c10)"
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "exempt": "card grip.wrist: no shrug source read gives the wrist (hold archetype default).",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "hold-default"
        ],
        "note": "card grip.wrist: no shrug source read gives the wrist (hold archetype default); not a card claim, never shown"
      }
    },
    "faults": [
      {
        "key": "thumbless",
        "label": "Thumb not wrapped",
        "pose": {},
        "markers": [],
        "alt": "Thumb not wrapped around the bar."
      }
    ],
    "gripLine": "Overhand, hands slightly wider than your shoulders, thumbs wrapped around the bar.",
    "cue": "Arms long, head level."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set the bar at mid-thigh height.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-smith-shrug"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "safety",
      "text": "Set the safety pins so the bar cannot drop.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-smith-shrug"
        ],
        "note": "c4"
      }
    },
    {
      "kind": "position",
      "text": "Stand with feet shoulder-width apart.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-smith-shrug"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "grip",
      "text": "Grip overhand, slightly wider than the shoulders, thumbs wrapped.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-smith-shrug",
          "baechle-grip"
        ],
        "note": "c1, inherit:0 (the parent's thumb rule; W4 content K2: this card's c10 is the blood-pressure claim)"
      }
    },
    {
      "kind": "get-in",
      "text": "Rotate the bar off the hooks and let the arms hang long.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "eos-smith",
          "motra-smith-shrug"
        ],
        "note": "c6, c1"
      }
    }
  ],
  posture: [
    {
      "key": "arms",
      "label": "Arms long",
      "detail": "Arms long, only a slight elbow bend.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "zoom": "smith-shrug-top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-smith-shrug"
        ],
        "note": "c1"
      }
    },
    {
      "key": "up",
      "label": "Straight up",
      "detail": "Shoulders straight up and down, no roll. Lower slowly.",
      "anchor": {
        "pose": "end",
        "at": "shoulderTop.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "motra-smith-shrug",
          "acsm2009"
        ],
        "note": "c2, c7, c11"
      }
    },
    {
      "key": "head",
      "label": "Head still",
      "detail": "Head level, not pushed forward.",
      "anchor": {
        "pose": "end",
        "at": "head"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-smith-shrug"
        ],
        "note": "c3"
      }
    },
    {
      "key": "still",
      "label": "Body still",
      "detail": "Body still, no rocking.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-smith-shrug"
        ],
        "note": "c3"
      }
    }
  ],
  zooms: [
    {
      "key": "smith-shrug-top",
      "chip": "Top",
      "heading": "Top position",
      "kind": "posture"
    }
  ],
  chips: [
    "smith-shrug-top",
    "feel"
  ],
  copy: {
    "setupLine": "Bar at mid-thigh, safety pins set. Feet shoulder-width apart.",
    "mistakeLine": "Keep your head level. Never push it forward as the shoulders rise.",
    "cueLine": "Shoulders up, arms long, head level."
  },
  mistakes: [
    {
      "key": "head",
      "title": "Pushing the head forward",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-smith-shrug"
        ],
        "note": "c3"
      },
      "fix": "Keep the head level as the shoulders rise."
    },
    {
      "key": "rock",
      "title": "Rocking the body",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-smith-shrug",
          "eos-smith",
          "acsm2009"
        ],
        "note": "c3, c5, c8"
      },
      "fix": "Use slow, steady reps. Add weight in small steps."
    },
    {
      "key": "elbows",
      "title": "Bending the elbows",
      "zoom": "smith-shrug-top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "motra-smith-shrug"
        ],
        "note": "c3, c2"
      },
      "fix": "Keep the arms long. Lift with the shoulders."
    }
  ],
  risks: [
    {
      "key": "breath",
      "text": "Heavy reps with a held breath send blood pressure very high.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "macdougall1985"
        ],
        "note": "c10"
      }
    },
    {
      "key": "shoulder",
      "text": "The shoulder is a common injury site in lifting. Poor technique adds risk.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "kolber2010"
        ],
        "note": "c9"
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
    "motra-smith-shrug",
    "eos-smith",
    "acsm2009",
    "kolber2010",
    "macdougall1985",
    "baechle-grip",
    "hold-default",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/smith_machine_shrug.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

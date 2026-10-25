// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=5143b9aac5b06fc72096756a95cc87ae33baf5e28ae1d8ba733a42da88d8320e
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_machine_chest_press",
  name: "Machine Chest Press",
  hashes: { inputsSha256: "5143b9aac5b06fc72096756a95cc87ae33baf5e28ae1d8ba733a42da88d8320e", golden: "1fcf5153e9184711135d62da5d92ea8d3deed8b61a529b277bbb434a83ad530b" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"machine-chest-press-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"machine-chest-press-n-st-upper.l\" d=\"~#F12WzrN-A1EGrxAA1S1E5a2*3Ht(3)2Y1K1P8)b_dEgP3xg.5KkX2Oevx2I2G4O8Hsb1qO5-cXhXiym-4(lw8!r00101010000101200100000200000100000010001002000010200000000002100200000000000020\"/><path id=\"machine-chest-press-n-st-elbowcap.l\" d=\"~~JFqWXH1Dz10\"/><path id=\"machine-chest-press-n-st-fore.l\" d=\"~#F12WUrH.I1)*q)*I1O8cH1z1yx1xcB8R1B2x1OmF5zeK3-aY2Va_9EmD6K1w2I6H5Yy1I5W1eT7W3-2FbPlH5WgG4Jg)e00000100000010000200120010100000000000002101000021000100000020000211010100002000\"/><path id=\"machine-chest-press-n-st-fist.l\" d=\"~~Jwy1y-F1ww10\"/><path id=\"machine-chest-press-n-st-upper.r\" d=\"^0\"/><path id=\"machine-chest-press-n-st-elbowcap.r\" d=\"^1\"/><path id=\"machine-chest-press-n-st-fore.r\" d=\"^2\"/><path id=\"machine-chest-press-n-st-fist.r\" d=\"^3\"/><path id=\"machine-chest-press-n-e-thigh.l\" d=\"~#F12A)t_XU1)Os-UU1*b45D1U(1P5*6)6O3E3EU1za*kOfxk-2Oo!8*U1x5G4D2T8Y4U*1Nc6E1IbO3BgDtJB1SrSz1A5SI1*f00101000012000020010020000000000001001000010000001002021000001111001200001000100\"/><path id=\"machine-chest-press-n-e-kneecap.l\" d=\"~~HxG1WzU1_J10\"/><path id=\"machine-chest-press-n-e-shank.l\" d=\"~#F12FwG1N!T1GIG1INS1U3IbF16)4((1y7-6J3O3Y6Vy2H9Ic!1Xbx5VeyeOx2x2G4V4V8TeN*1B170*bOeS9.gJmI3JlD9Nq00000001010010100100200000010022000100100200020000000001001000000002000100101000\"/><path id=\"machine-chest-press-n-e-foot.l\" d=\"~#o2wUE1DB)1RBF1EB(1YcF3Uh)7Sp*nU-2E3-J2-4ID1)7)n0TG1_4BbXc_sEbKmUp001002100210120001010020000000100010020010101001\"/><path id=\"machine-chest-press-n-e-shcap.l\" d=\"~~UyrUzB1wP10\"/><path id=\"machine-chest-press-n-e-upper.l\" d=\"~#F12WHs(SD1-ErzJD1V8*129AO1P5I5z4T2*1XA1*bXg)cEgX2zk_6TD1hz3sI6D2HN1Aa0a.8v*3_fwnWhymW3PrE901000000002000000101010010000000000000100001000101012020000002000021000110000200\"/><path id=\"machine-chest-press-n-e-elbowcap.l\" d=\"~~HTA1PUD1Dz10\"/><path id=\"machine-chest-press-n-e-fore.l\" d=\"~#F12UWB1H-E1-_A1IWE1BaV1!1nAI1R3G9R3E2R1Vw1d-c-6Bb0-c(6Rw1eI2U1E9S3AI1N3!1oBaY1bAaUjPaDh1UjOa11000000010000010001200100001000000000200100100002020000000200001000000000002010\"/><path id=\"machine-chest-press-n-e-fist.l\" d=\"~~NKN1wUD1ww10\"/><path id=\"machine-chest-press-n-e-head\" d=\"~#w12SFsW(qXUqT-qIh!kIiDbIbB2-2y5K5R7)8OaKjXkU3zdI2O9BjY1JlBdYlE8wlH1PkHe4Fj0002000010000010100110010000000002002000120000020000000000002000\"/><path id=\"machine-chest-press-n-e-torso\" d=\"~#_12wDrF_vRIrBIu.9E3I3K2!aFfHaN7De_eJ6hO8In)m)5Ic!5SfB6Dkz8!k*hwgxjw4*9K9GfzuTw1RdBqG6iT9sDe_e!3W7Kd-6zfWaX4!j!6P4(b.a_3U7xP2AE100002220000110022000000000011000101001000002000010000000000011002001002000020000000000020000001001220022000011101000\"/><path id=\"machine-chest-press-n-e-thigh.r\" d=\"^4\"/><path id=\"machine-chest-press-n-e-kneecap.r\" d=\"^5\"/><path id=\"machine-chest-press-n-e-shank.r\" d=\"^6\"/><path id=\"machine-chest-press-n-e-foot.r\" d=\"^7\"/><path id=\"machine-chest-press-n-e-shcap.r\" d=\"^8\"/><path id=\"machine-chest-press-n-e-upper.r\" d=\"^9\"/><path id=\"machine-chest-press-n-e-elbowcap.r\" d=\"^10\"/><path id=\"machine-chest-press-n-e-fore.r\" d=\"^11\"/><path id=\"machine-chest-press-n-e-fist.r\" d=\"^12\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#machine-chest-press-n-dots)\"/>\n  <path class=\"floorline\" d=\"M59.3 339.5H303.6\"/><path class=\"eq\" d=\"~MAzkPwy2L0IHX1Q0E6E6AAX1LXS1F6QE60YS1F6LF6AAX1Q0F6F6zAX1LYS1E6QF60XS1E6Z\"/><path class=\"eq-thin\" d=\"M96.74 295.11h1.2M96.74 287.8h1.2M96.74 280.49h1.2M96.74 273.17h1.2M96.74 265.86h1.2M96.74 258.54h1.2M96.74 251.23h1.2M96.74 243.91h1.2M96.74 236.6h1.2M96.74 229.29h1.2M96.74 221.97h1.2M96.74 214.66h1.2M96.74 207.34h1.2M96.74 200.03h1.2M96.74 192.71h1.2M96.74 185.4h1.2M96.74 178.09h1.2M96.74 170.77h1.2M96.74 163.46h1.2M96.74 156.14h1.2M96.74 148.83h1.2M96.74 141.51h1.2M96.74 134.2h1.2M96.74 126.89h1.2M96.74 119.57h1.2M96.74 112.26h1.2M96.74 104.94h1.2M96.74 97.63h1.2M96.74 90.31h1.2M96.74 83h1.2M96.74 75.69h1.2\"/><path class=\"eq\" d=\"~MyErDyX1LY.90Qwp0Xy9)oL)owbQ0)o)o)aLXy9wpQ)o0Yy9wpLwp)aQ0wpwpwbZ\"/><path class=\"eq\" d=\"~MPGvSRX1L0PT9Q0F6F6EK9LAA1E6QF60zA1E6LE6EK9Q0E6E6FK9LzA1F6QE60AA1F6Z\"/><path class=\"eq\" d=\"~MyyqYDy2LYBc0QF60O)bE6LE6V8Q0E6E6W8LO)bF6QE60P)bF6LF6W8Q0F6F6V8Z\"/><path class=\"eq\" d=\"~MFKqSxU1L*qBAgQG1*okPJfLJcNoQ)oH1X9PpLWS1(GfQF1(onOJfLEcKoQ(oG1U9OpZ\"/><path class=\"eq-line\" d=\"~MWIoS_J1LRF40\"/><path class=\"eq\" d=\"~M_EA1!EbLBxh0QE60(_gF6LF6FK1Q0F6F6EK1L(_gE6QF60*_gE6LE6EK1Q0E6E6FK1Z\"/><path class=\"arc measure\" d=\"M193.05 197.84L175.29 194.86A18 18 0 0 1 211.05 197.81Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#machine-chest-press-n-st-upper.l\"/><use href=\"#machine-chest-press-n-st-elbowcap.l\"/><use href=\"#machine-chest-press-n-st-fore.l\"/><use href=\"#machine-chest-press-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#machine-chest-press-n-st-upper.l\"/><use href=\"#machine-chest-press-n-st-elbowcap.l\"/><use href=\"#machine-chest-press-n-st-fore.l\"/><use href=\"#machine-chest-press-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-chest-press-n-st-upper.r\"/><use href=\"#machine-chest-press-n-st-elbowcap.r\"/><use href=\"#machine-chest-press-n-st-fore.r\"/><use href=\"#machine-chest-press-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-chest-press-n-st-upper.r\"/><use href=\"#machine-chest-press-n-st-elbowcap.r\"/><use href=\"#machine-chest-press-n-st-fore.r\"/><use href=\"#machine-chest-press-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-line\" d=\"~MHEB1!HdLHV1DHp\"/><path class=\"eq-line\" d=\"~MW-z1!KdLHV1FHp\"/><path class=\"eq-line\" d=\"~MDXB1UWD1LA1T5Ly2sLS1S1Lqy2L2F2Lry2LT1S1L)1sLz1J_3Lz1K_3L)1pLT1R1Lrx2L2E2Lqx2LS1R1Ly2pLA1K_3\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-line\" d=\"~MFIB1UEdLSV4J(o\"/><path class=\"eq-line\" d=\"~MH(z1yPdLSV4H(o\"/><path class=\"eq-line\" d=\"~MW.F1DHD1LA1T5Ly2sLP1U1Luw2L0F2Lrw2LT1U1L)1sLz1J_3Lz1I_3L)1tLT1O1Lrx2L0E2Lux2LP1O1Ly2tLA1I_3\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-line\" d=\"~M_NB1(zdLyU7AGo\"/><path class=\"eq-line\" d=\"~MFzA1URdLyU7DGo\"/><path class=\"eq-line\" d=\"~MN(I1(TB1LA1T5Ly2sLS1U1Lqw2L2F2Lrw2LR1U1Lx2sLz1J_3Lz1I_3Lx2tLR1O1Lrx2L2E2Lqx2LS1O1Ly2tLA1I_3\"/></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#machine-chest-press-n-e-thigh.l\"/><use href=\"#machine-chest-press-n-e-kneecap.l\"/><use href=\"#machine-chest-press-n-e-shank.l\"/><use href=\"#machine-chest-press-n-e-foot.l\"/><use href=\"#machine-chest-press-n-e-shcap.l\"/><use href=\"#machine-chest-press-n-e-upper.l\"/><use href=\"#machine-chest-press-n-e-elbowcap.l\"/><use href=\"#machine-chest-press-n-e-fore.l\"/><use href=\"#machine-chest-press-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#machine-chest-press-n-e-thigh.l\"/><use href=\"#machine-chest-press-n-e-kneecap.l\"/><use href=\"#machine-chest-press-n-e-shank.l\"/><use href=\"#machine-chest-press-n-e-foot.l\"/><use href=\"#machine-chest-press-n-e-shcap.l\"/><use href=\"#machine-chest-press-n-e-upper.l\"/><use href=\"#machine-chest-press-n-e-elbowcap.l\"/><use href=\"#machine-chest-press-n-e-fore.l\"/><use href=\"#machine-chest-press-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-chest-press-n-e-head\"/><use href=\"#machine-chest-press-n-e-torso\"/><use href=\"#machine-chest-press-n-e-thigh.r\"/><use href=\"#machine-chest-press-n-e-kneecap.r\"/><use href=\"#machine-chest-press-n-e-shank.r\"/><use href=\"#machine-chest-press-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#machine-chest-press-n-e-head\"/><use href=\"#machine-chest-press-n-e-torso\"/><use href=\"#machine-chest-press-n-e-thigh.r\"/><use href=\"#machine-chest-press-n-e-kneecap.r\"/><use href=\"#machine-chest-press-n-e-shank.r\"/><use href=\"#machine-chest-press-n-e-foot.r\"/></g></g><path class=\"eq\" d=\"~MJ(z1W!cLyVaFVnQA5NbOAa*NnLH2.eQJbz5Tc*7LG.a-AnQz5IbPAayOnLG2YeQIbA5Ucy8Z\"/><path class=\"eq-solid\" d=\"~My!O1HBF1L0Vy3Q0TeTeyU2LUeUeQTe0TeUeLUeyU2Q0WeUe)T2LTeVeQUe0UeVeZ\"/><path class=\"eq\" d=\"~~PGz1!EcSA10\"/><path class=\"eq-pin\" d=\"~~SDA1!EcP70\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-chest-press-n-e-shcap.r\"/><use href=\"#machine-chest-press-n-e-upper.r\"/><use href=\"#machine-chest-press-n-e-elbowcap.r\"/><use href=\"#machine-chest-press-n-e-fore.r\"/><use href=\"#machine-chest-press-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-chest-press-n-e-shcap.r\"/><use href=\"#machine-chest-press-n-e-upper.r\"/><use href=\"#machine-chest-press-n-e-elbowcap.r\"/><use href=\"#machine-chest-press-n-e-fore.r\"/><use href=\"#machine-chest-press-n-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"~MUyuUzB1L9U1L12L20L01\"/><path class=\"eq-line m-line\" d=\"~MHBrFWA1LaV1L00L02Lm6L10L02L01L00L02L01L22L11L00L02LgcL12L20L00L10L20L00\"/><path class=\"eq-line m-line\" d=\"~M_(rDYz1LN1tL8kL01L12L20L01L12L20L00L01L12L20L0kL10L22L01\"/><path class=\"eq-line m-line\" d=\"~MwwtFWz1LW1aL12L21L7kL10L20L02L11L20L10L20L00L10L22LfcL02\"/><path class=\"eq-line m-line\" d=\"~MH-tYFA1LuJ1L02L00L01L02L20Ll6L02L20L10L01L02L20L11L02L20\"/><path class=\"eq-line m-line\" d=\"~MWzrN-A1LbU1L12L01L00L02L01L00L02L01L20L12L01L00L00L20L00L11L22L00L10L20L11L22L00L00L00L00L21L12L00L00L00L00L24L20L10L00L20L10L00L20L10L00L20L10L00L20L10L00L20L10L00L00L20L10L00L20L10L00L60L10L22L11L20L12L21L02L11L20L12L21L10L22L11L20L12L21L12L21L10L22L11L20L02L20L01L12L21L02L11L22L00L11L22L01L12L21L02L11L22L00L11L22L01L12L21\"/><path class=\"eq-line m-line\" d=\"~MWyrA-I1LN1uL8B1\"/><path class=\"eq-line m-line\" d=\"~MYDtA(F1LiV1L20L10L20L10L22L11L20L51L02L20L11L02L21L12L00L21L12L01L22L11L02L20L11L02L21L12L00L21L12L01L22L10L01L14L10L00L20L10L00L20L10L00L20L10L10L20L00L00L00L00L01L12L20L01L02L11L20L00L10L20L12L21L00L10L20L00Ln0\"/><path class=\"eq-line m-line\" d=\"~M(Yt(EA1LbX1LB1q\"/><path class=\"eq-line m-line\" d=\"~MH(sWVz1LO1vL9F1\"/><path class=\"eq-line m-line\" d=\"~MF!rA-z1Lx1N1\"/><path class=\"eq-line m-line\" d=\"~MFKrS_I1LV1aL0jL21L12\"/><path class=\"eq-line m-line\" d=\"~MPxr!YI1LV1bL02L8j\"/><path class=\"eq-line m-line\" d=\"~MJFqWXH1LcV1L10\"/><path class=\"eq-line m-line\" d=\"~MWUrH.I1LY15L01L02L00L01L02L00L11L22L00L01L02L00L03L22L11L00L22L11L22L11L01L10L20L10L20L11L22L10L20L15L20L02L01L10L20L00L00L12L21L00L00L10L20L00L02L11L20L00L00L10L20L02L01L10L20L00L00L13L00L01L12L21L02L00L01L02L00L01L02L00L01L02L01L02L10L21L02L00L01L02L01L30L20L10L20L10L20L10L20L10L01L22L10L20L10L20L10L20L10L00L21L12L20L10L20L99L10L20L01L02L00L00L00L00L00L01L02LB1nL20L00L00L00L00L00L00L10Lz1aL10L20L01L12L20L10L20L10LhD1L10L00L20L10L20L10L20L10L00L20L10L1eL01L02L01L02L10L21L02L01L02L00L01L02L11L22L00L01L02L01L02L00L11L22L00L10L02L00L00L00L00L00L00L10L20L00L00L00L00L00L00L00L00L00L00L00L10L20L00L24L12L01L22L11L22L10L01L22L11L22L11L22L10L01L22L11\"/><path class=\"eq-line m-line\" d=\"~MUFqU-H1L5_1L21L12L00LD1bL02L20L10L01L02L20\"/><path class=\"eq-line m-line\" d=\"~MATqARI1Lw1P1L01L02LmB1L20L12\"/><path class=\"eq-line m-line\" d=\"~MUOrJ_I1LW1aL00\"/><path class=\"eq-line m-line\" d=\"~MJwA1y-F1LbY1L20L10L00L20L10L20Ll9L02L00L01L02L20L10LfhL02L20L10L00L00L20L9lL02L01L02L01L02L00L0nL00L02L01L02L01L02L8lL00L20L10L00L00L22LehL00L00L02L01L20L12Lk9L20L10L00L20L10L20Lk0L20L10L20L00L10L20Lk8L10L20L02L01L00L02LeeL20L00L00L10L20L02L8iL00L02L01L02L01L02L0kL02L01L02L01L02L00L9iL22L00L00L10L20L00LfeL12L20L01L02L00L00Ll8L20L10L20L00L10\"/><path class=\"eq-line m-line\" d=\"~M(yB1UKdLXI1UJp\"/><path class=\"eq-line m-line\" d=\"~MHVz1DIdLXI1UJp\"/><path class=\"eq-line m-line\" d=\"~MYRy1y-D1Ly1T5LA2sLS1S1LsA2L1A2LpA2LR1S1Lx2sLz1J_3Lz1K_3Lx2pLR1R1Lpx2L1E2Lsx2LS1R1LA2pLy1K_3\"/><circle class=\"joint\" cx=\"146.34\" cy=\"190.02\" r=\"2.25\"/><circle class=\"joint\" cx=\"193.05\" cy=\"197.84\" r=\"2.25\"/><circle class=\"joint\" cx=\"155.22\" cy=\"257.89\" r=\"2.25\"/><circle class=\"joint\" cx=\"217.29\" cy=\"266.83\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#!10NJB1DXF1*zB1IXF11000211200011B1100020100122100020110220100021bz1211201201221000000000000011000000000002000101200200000111001000002101000000100111000020000101000000100001000000010000120000200200010\"/><path class=\"arrow\" d=\"~MYFN1AwE1LVtUtL!hEx2Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M175.29 194.86A18 18 0 0 1 211.05 197.81\"/><g class=\"arc-ticks\"><path d=\"~MFwz1yDD1LOX1G9\"/><path d=\"~MyNF1HUD1LFY11\"/></g><path class=\"leader\" d=\"~M_wD1(Xy1L()aBx6\"/></g></g><path class=\"leader\" d=\"M179.26 208.81L223 256H233\"/><circle class=\"anchor\" cx=\"179.26\" cy=\"208.81\" r=\"1.5\"/><path class=\"leader\" d=\"~MUYpDXE1Lx_9_3\"/><circle class=\"anchor\" cx=\"131.94\" cy=\"203.39\" r=\"1.5\"/><path class=\"leader\" d=\"M140.09 218.83L96.5 254H86.5\"/><circle class=\"anchor\" cx=\"140.09\" cy=\"218.83\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"machine-chest-press-n-height\" data-key=\"height\" data-cue=\"Set the seat so the handles line up with the middle of the chest.\" class=\"plate-callout two\" style=\"left:63.69%;top:65.36%\" aria-pressed=\"true\">Handles<br>mid-chest</button><button type=\"button\" id=\"machine-chest-press-n-blades\" data-key=\"blades\" data-cue=\"Keep the shoulder blades back and down, pressed into the pad.\" class=\"plate-callout two\" style=\"left:7.82%;top:50.84%\" aria-pressed=\"false\">Blades<br>on pad</button><button type=\"button\" id=\"machine-chest-press-n-elbows\" data-key=\"elbows\" data-cue=\"Keep the elbows about 45 degrees out from the sides, below the shoulders.\" class=\"plate-callout two\" style=\"left:8.1%;top:64.8%\" aria-pressed=\"false\">Elbows<br>45°</button><span class=\"plate-arc-label\" style=\"left:70.95%;top:39.11%\"><b>Elbow</b><span>soft, not locked</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"machine-chest-press-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"machine-chest-press-m-st-upper.l\" d=\"^0\"/><path id=\"machine-chest-press-m-st-elbowcap.l\" d=\"^1\"/><path id=\"machine-chest-press-m-st-fore.l\" d=\"^2\"/><path id=\"machine-chest-press-m-st-fist.l\" d=\"^3\"/><path id=\"machine-chest-press-m-st-upper.r\" d=\"^0\"/><path id=\"machine-chest-press-m-st-elbowcap.r\" d=\"^1\"/><path id=\"machine-chest-press-m-st-fore.r\" d=\"^2\"/><path id=\"machine-chest-press-m-st-fist.r\" d=\"^3\"/><path id=\"machine-chest-press-m-e-thigh.l\" d=\"^4\"/><path id=\"machine-chest-press-m-e-kneecap.l\" d=\"^5\"/><path id=\"machine-chest-press-m-e-shank.l\" d=\"^6\"/><path id=\"machine-chest-press-m-e-foot.l\" d=\"^7\"/><path id=\"machine-chest-press-m-e-shcap.l\" d=\"^8\"/><path id=\"machine-chest-press-m-e-upper.l\" d=\"^9\"/><path id=\"machine-chest-press-m-e-elbowcap.l\" d=\"^10\"/><path id=\"machine-chest-press-m-e-fore.l\" d=\"^11\"/><path id=\"machine-chest-press-m-e-fist.l\" d=\"^12\"/><path id=\"machine-chest-press-m-e-head\" d=\"^13\"/><path id=\"machine-chest-press-m-e-torso\" d=\"^14\"/><path id=\"machine-chest-press-m-e-thigh.r\" d=\"^4\"/><path id=\"machine-chest-press-m-e-kneecap.r\" d=\"^5\"/><path id=\"machine-chest-press-m-e-shank.r\" d=\"^6\"/><path id=\"machine-chest-press-m-e-foot.r\" d=\"^7\"/><path id=\"machine-chest-press-m-e-shcap.r\" d=\"^8\"/><path id=\"machine-chest-press-m-e-upper.r\" d=\"^9\"/><path id=\"machine-chest-press-m-e-elbowcap.r\" d=\"^10\"/><path id=\"machine-chest-press-m-e-fore.r\" d=\"^11\"/><path id=\"machine-chest-press-m-e-fist.r\" d=\"^12\"/><path id=\"machine-chest-press-m-m-head\" d=\"~#w12yFv!ErVVtX_qKk!h.jD8.a*3T3P4B4E8B7Xb)fRnW5OctT9zjG1AnV9YmX4SkS4wiJh.2wj1002000000200000000020200001010100002220000001000000010002002000\"/><path id=\"machine-chest-press-m-m-torso\" d=\"~#_12SKtD!vI_tTNuV8-dV3(7w8JmS9S1Ub!gA5y1E1-nzgB8VcF5SfB6Dkz8!k*hwgxjw4*9K9GfzuTw1RdBqE6N9y3U8NbrW2D8Ec.8BgY2z8JoU5wb_dKeW2F8EV2Aq01100200000002000010000100100000001100000002000010000000000011002001000100020000000000000000012000000200000200000001\"/><path id=\"machine-chest-press-m-m-shcap.l\" d=\"~~HPuU!A1wP10\"/><path id=\"machine-chest-press-m-m-upper.l\" d=\"~#F12Sww1UJD1.!u*ID1.890bSO1T2)5z3*2O1RD1K5Xi)9Og4TiAaRD1w6.2N1)5F3WO1y21a.8ivDgWpPdJm1Pp.d00220000000010001101000000002100002001100021010000000000000220010120010010000010\"/><path id=\"machine-chest-press-m-m-elbowcap.l\" d=\"~~WDF1!_A1Dz10\"/><path id=\"machine-chest-press-m-m-fore.l\" d=\"~#F12DHG1W)B1zNF1*!B1GaT1!1pNI1.3I9K3I2T1)w11.c-6Bb4Vcw7xx1mE2W1I9U3PI1y3!1oEa_11DaWjHaDh5PjVa20010020010000000000000210110100000010111000201000012100200000000020000100000000\"/><path id=\"machine-chest-press-m-m-fist.l\" d=\"~~(yS1wYA1ww10\"/><path id=\"machine-chest-press-m-m-shcap.r\" d=\"^71\"/><path id=\"machine-chest-press-m-m-upper.r\" d=\"^72\"/><path id=\"machine-chest-press-m-m-elbowcap.r\" d=\"^73\"/><path id=\"machine-chest-press-m-m-fore.r\" d=\"^74\"/><path id=\"machine-chest-press-m-m-fist.r\" d=\"^75\"/><path id=\"machine-chest-press-m-m-eq0\" d=\"~MYxA1_(cLDEeD.lQ_6Na.VdRXlL2*eQNa-6Xd*5L-He*GlQ-6Ka!VdSXlL1(eQKa_6Yd(5Z\"/><path id=\"machine-chest-press-m-m-eq1\" d=\"~MSRT1JGD1L0Xy3Q0TeTeAU2LUeUeQTe0TeUeLUeAU2Q0UeUezU2LTeTeQUe0UeTeZ\"/><path id=\"machine-chest-press-m-mf-thigh.l\" d=\"^4\"/><path id=\"machine-chest-press-m-mf-kneecap.l\" d=\"^5\"/><path id=\"machine-chest-press-m-mf-shank.l\" d=\"^6\"/><path id=\"machine-chest-press-m-mf-foot.l\" d=\"^7\"/><path id=\"machine-chest-press-m-mf-thigh.r\" d=\"^4\"/><path id=\"machine-chest-press-m-mf-kneecap.r\" d=\"^5\"/><path id=\"machine-chest-press-m-mf-shank.r\" d=\"^6\"/><path id=\"machine-chest-press-m-mf-foot.r\" d=\"^7\"/><path id=\"machine-chest-press-m-mo-0\" d=\"^13\"/><path id=\"machine-chest-press-m-mo-1\" d=\"^14\"/><path id=\"machine-chest-press-m-mo-2\" d=\"^4\"/><path id=\"machine-chest-press-m-mo-3\" d=\"^5\"/><path id=\"machine-chest-press-m-mo-4\" d=\"^6\"/><path id=\"machine-chest-press-m-mo-5\" d=\"^7\"/><path id=\"machine-chest-press-m-mo-6\" d=\"^8\"/><path id=\"machine-chest-press-m-mo-7\" d=\"^9\"/><path id=\"machine-chest-press-m-mo-8\" d=\"^10\"/><path id=\"machine-chest-press-m-mo-9\" d=\"^11\"/><path id=\"machine-chest-press-m-mo-10\" d=\"^12\"/><path id=\"machine-chest-press-m-mo-11\" d=\"^4\"/><path id=\"machine-chest-press-m-mo-12\" d=\"^5\"/><path id=\"machine-chest-press-m-mo-13\" d=\"^6\"/><path id=\"machine-chest-press-m-mo-14\" d=\"^7\"/><path id=\"machine-chest-press-m-mo-15\" d=\"^8\"/><path id=\"machine-chest-press-m-mo-16\" d=\"^9\"/><path id=\"machine-chest-press-m-mo-17\" d=\"^10\"/><path id=\"machine-chest-press-m-mo-18\" d=\"^11\"/><path id=\"machine-chest-press-m-mo-19\" d=\"^12\"/><path id=\"machine-chest-press-m-mo-20\" d=\"^16\"/><path id=\"machine-chest-press-m-mo-21\" d=\"^18\"/><path id=\"machine-chest-press-m-mo-22\" d=\"^19\"/><path id=\"machine-chest-press-m-mo-23\" d=\"^20\"/><path id=\"machine-chest-press-m-mo-24\" d=\"^21\"/><path id=\"machine-chest-press-m-mo-25\" d=\"^23\"/><path id=\"machine-chest-press-m-mo-26\" d=\"^34\"/><path id=\"machine-chest-press-m-mo-27\" d=\"^35\"/><path id=\"machine-chest-press-m-mo-28\" d=\"^36\"/><path id=\"machine-chest-press-m-mo-29\" d=\"^37\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#machine-chest-press-m-dots)\"/>\n  <path class=\"floorline\" d=\"^15\"/><path class=\"eq\" d=\"^16\"/><path class=\"eq-thin\" d=\"^17\"/><path class=\"eq\" d=\"^18\"/><path class=\"eq\" d=\"^19\"/><path class=\"eq\" d=\"^20\"/><path class=\"eq\" d=\"^21\"/><path class=\"eq-line\" d=\"^22\"/><path class=\"eq\" d=\"^23\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#machine-chest-press-m-st-upper.l\"/><use href=\"#machine-chest-press-m-st-elbowcap.l\"/><use href=\"#machine-chest-press-m-st-fore.l\"/><use href=\"#machine-chest-press-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#machine-chest-press-m-st-upper.l\"/><use href=\"#machine-chest-press-m-st-elbowcap.l\"/><use href=\"#machine-chest-press-m-st-fore.l\"/><use href=\"#machine-chest-press-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-chest-press-m-st-upper.r\"/><use href=\"#machine-chest-press-m-st-elbowcap.r\"/><use href=\"#machine-chest-press-m-st-fore.r\"/><use href=\"#machine-chest-press-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-chest-press-m-st-upper.r\"/><use href=\"#machine-chest-press-m-st-elbowcap.r\"/><use href=\"#machine-chest-press-m-st-fore.r\"/><use href=\"#machine-chest-press-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-line\" d=\"^25\"/><path class=\"eq-line\" d=\"^26\"/><path class=\"eq-line\" d=\"^27\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-line\" d=\"^28\"/><path class=\"eq-line\" d=\"^29\"/><path class=\"eq-line\" d=\"^30\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-line\" d=\"^31\"/><path class=\"eq-line\" d=\"^32\"/><path class=\"eq-line\" d=\"^33\"/></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#machine-chest-press-m-e-thigh.l\"/><use href=\"#machine-chest-press-m-e-kneecap.l\"/><use href=\"#machine-chest-press-m-e-shank.l\"/><use href=\"#machine-chest-press-m-e-foot.l\"/><use href=\"#machine-chest-press-m-e-shcap.l\"/><use href=\"#machine-chest-press-m-e-upper.l\"/><use href=\"#machine-chest-press-m-e-elbowcap.l\"/><use href=\"#machine-chest-press-m-e-fore.l\"/><use href=\"#machine-chest-press-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#machine-chest-press-m-e-thigh.l\"/><use href=\"#machine-chest-press-m-e-kneecap.l\"/><use href=\"#machine-chest-press-m-e-shank.l\"/><use href=\"#machine-chest-press-m-e-foot.l\"/><use href=\"#machine-chest-press-m-e-shcap.l\"/><use href=\"#machine-chest-press-m-e-upper.l\"/><use href=\"#machine-chest-press-m-e-elbowcap.l\"/><use href=\"#machine-chest-press-m-e-fore.l\"/><use href=\"#machine-chest-press-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-chest-press-m-e-head\"/><use href=\"#machine-chest-press-m-e-torso\"/><use href=\"#machine-chest-press-m-e-thigh.r\"/><use href=\"#machine-chest-press-m-e-kneecap.r\"/><use href=\"#machine-chest-press-m-e-shank.r\"/><use href=\"#machine-chest-press-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#machine-chest-press-m-e-head\"/><use href=\"#machine-chest-press-m-e-torso\"/><use href=\"#machine-chest-press-m-e-thigh.r\"/><use href=\"#machine-chest-press-m-e-kneecap.r\"/><use href=\"#machine-chest-press-m-e-shank.r\"/><use href=\"#machine-chest-press-m-e-foot.r\"/></g></g><path class=\"eq\" d=\"^34\"/><path class=\"eq-solid\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq-pin\" d=\"^37\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#machine-chest-press-m-e-shcap.r\"/><use href=\"#machine-chest-press-m-e-upper.r\"/><use href=\"#machine-chest-press-m-e-elbowcap.r\"/><use href=\"#machine-chest-press-m-e-fore.r\"/><use href=\"#machine-chest-press-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#machine-chest-press-m-e-shcap.r\"/><use href=\"#machine-chest-press-m-e-upper.r\"/><use href=\"#machine-chest-press-m-e-elbowcap.r\"/><use href=\"#machine-chest-press-m-e-fore.r\"/><use href=\"#machine-chest-press-m-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"^38\"/><path class=\"eq-line m-line\" d=\"^39\"/><path class=\"eq-line m-line\" d=\"^40\"/><path class=\"eq-line m-line\" d=\"^41\"/><path class=\"eq-line m-line\" d=\"^42\"/><path class=\"eq-line m-line\" d=\"^43\"/><path class=\"eq-line m-line\" d=\"^44\"/><path class=\"eq-line m-line\" d=\"^45\"/><path class=\"eq-line m-line\" d=\"^46\"/><path class=\"eq-line m-line\" d=\"^47\"/><path class=\"eq-line m-line\" d=\"^48\"/><path class=\"eq-line m-line\" d=\"^49\"/><path class=\"eq-line m-line\" d=\"^50\"/><path class=\"eq-line m-line\" d=\"^51\"/><path class=\"eq-line m-line\" d=\"^52\"/><path class=\"eq-line m-line\" d=\"^53\"/><path class=\"eq-line m-line\" d=\"^54\"/><path class=\"eq-line m-line\" d=\"^55\"/><path class=\"eq-line m-line\" d=\"^56\"/><path class=\"eq-line m-line\" d=\"^57\"/><path class=\"eq-line m-line\" d=\"^58\"/><path class=\"eq-line m-line\" d=\"^59\"/><circle class=\"joint\" cx=\"146.34\" cy=\"190.02\" r=\"2.25\"/><circle class=\"joint\" cx=\"193.05\" cy=\"197.84\" r=\"2.25\"/><circle class=\"joint\" cx=\"155.22\" cy=\"257.89\" r=\"2.25\"/><circle class=\"joint\" cx=\"217.29\" cy=\"266.83\" r=\"2.25\"/></g><mask id=\"machine-chest-press-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#machine-chest-press-m-m-head\" fill=\"#000\"/><use href=\"#machine-chest-press-m-m-torso\" fill=\"#000\"/><use href=\"#machine-chest-press-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#machine-chest-press-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#machine-chest-press-m-mf-shank.l\" fill=\"#000\"/><use href=\"#machine-chest-press-m-mf-foot.l\" fill=\"#000\"/><use href=\"#machine-chest-press-m-m-shcap.l\" fill=\"#000\"/><use href=\"#machine-chest-press-m-m-upper.l\" fill=\"#000\"/><use href=\"#machine-chest-press-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#machine-chest-press-m-m-fore.l\" fill=\"#000\"/><use href=\"#machine-chest-press-m-m-fist.l\" fill=\"#000\"/><use href=\"#machine-chest-press-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#machine-chest-press-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#machine-chest-press-m-mf-shank.r\" fill=\"#000\"/><use href=\"#machine-chest-press-m-mf-foot.r\" fill=\"#000\"/><use href=\"#machine-chest-press-m-m-shcap.r\" fill=\"#000\"/><use href=\"#machine-chest-press-m-m-upper.r\" fill=\"#000\"/><use href=\"#machine-chest-press-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#machine-chest-press-m-m-fore.r\" fill=\"#000\"/><use href=\"#machine-chest-press-m-m-fist.r\" fill=\"#000\"/><use href=\"#machine-chest-press-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#machine-chest-press-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#machine-chest-press-m-mmask)\"><g class=\"u-stroke\"><use href=\"#machine-chest-press-m-m-head\"/><use href=\"#machine-chest-press-m-m-torso\"/><use href=\"#machine-chest-press-m-m-shcap.l\"/><use href=\"#machine-chest-press-m-m-upper.l\"/><use href=\"#machine-chest-press-m-m-elbowcap.l\"/><use href=\"#machine-chest-press-m-m-fore.l\"/><use href=\"#machine-chest-press-m-m-fist.l\"/><use href=\"#machine-chest-press-m-m-shcap.r\"/><use href=\"#machine-chest-press-m-m-upper.r\"/><use href=\"#machine-chest-press-m-m-elbowcap.r\"/><use href=\"#machine-chest-press-m-m-fore.r\"/><use href=\"#machine-chest-press-m-m-fist.r\"/><use href=\"#machine-chest-press-m-m-eq0\"/><use href=\"#machine-chest-press-m-m-eq1\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"M135.86 180.27A80 80 0 0 1 163.58 178.33M159.58 181.33L163.58 178.33L159.58 175.33\"/><path class=\"m-arrow\" d=\"~MHYpSPE1L(w1V1\"/><path class=\"m-arrow\" d=\"~M(Ypy*E1LE1*o\"/><path class=\"m-arrow\" d=\"~M!-qJ.E1LG1)o\"/><path class=\"leader m\" d=\"M134.52 202.2L86.05 218H76.05\"/><path class=\"leader m\" d=\"M211.5 188.62L231 234H241\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"machine-chest-press-m-round\" data-key=\"round\" data-cue=\"The shoulders roll forward and the upper back leaves the pad.\" class=\"plate-callout two m\" style=\"left:4.75%;top:54.75%\" aria-pressed=\"true\">Off<br>the pad</button><button type=\"button\" id=\"machine-chest-press-m-lock\" data-key=\"lock\" data-cue=\"The elbows snap straight at the end of the press.\" class=\"plate-callout two m\" style=\"left:65.92%;top:59.22%\" aria-pressed=\"false\">Locked<br>elbows</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "height",
        cues: [{ key: "height", cue: "Set the seat so the handles line up with the middle of the chest." }, { key: "blades", cue: "Keep the shoulder blades back and down, pressed into the pad." }, { key: "elbows", cue: "Keep the elbows about 45 degrees out from the sides, below the shoulders." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "round",
        cues: [{ key: "round", cue: "The shoulders roll forward and the upper back leaves the pad." }, { key: "lock", cue: "The elbows snap straight at the end of the press." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Off the pad</b><span>The shoulders roll forward and the upper back leaves the pad.</span></li><li><b>Locked elbows</b><span>The elbows snap straight at the end of the press.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: press 1 second, hold 0.3 seconds, return 1.5 seconds, rest 0.5 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:0.3 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>0.3 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:1.5 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>1.5 s</span></div></div><div class=\"tempo-seg\" style=\"flex:0.5 1 0\"><i></i><div class=\"tempo-label\"><b>Rest</b><span>0.5 s</span></div></div></div>",
      alt: "Machine chest press, side view. Seated with the back flat on a slightly reclined pad and feet flat on the floor, the lifter presses vertical handles on a top-pivot lever arm from mid-chest height straight forward until the arms are long, elbows soft, shoulder blades kept on the pad.",
      mistakeAlt: "Machine Chest Press: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "push",
    "orientation": "pronated",
    "handle": "machine-grip",
    "loadAxis": "along-forearm",
    "handleChoice": {
      "sore": "Sore wrist? Use the vertical handles.",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "muyor2023"
        ],
        "note": "No chest difference between handle types (Muyor 2023); choosing vertical for a sore wrist is consensus."
      }
    },
    "overBody": false,
    "width": {
      "text": "Pick handles that put your hands just outside your shoulders at the start. Line each forearm up behind its handle.",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "muyor2023"
        ]
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chest-press"
        ],
        "note": "ACE: full grip, thumbs around the handles. The \"stops the handle rolling into the fingers\" mechanism is consensus."
      }
    },
    "contact": "heel",
    "wrist": {
      "ext": [
        0,
        10
      ],
      "dev": [
        -10,
        10
      ],
      "limitText": "Wrist bending back past about 15 to 20 degrees? Stop and go lighter.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH",
          "WEAK"
        ],
        "sources": [
          "ace-chest-press",
          "barbell-logic-grip",
          "weiss1995",
          "nance2017"
        ],
        "note": "Heel of palm and straight wrist: ACE plus coaching consensus. 0-10 deg target leans on Weiss 1995 (nerve pressure, not lifting). The 15-20 deg limit is coaching consensus. Nance 2017 is association only."
      }
    },
    "pose": {
      "view": "radial",
      "forearm": 90,
      "wrist": {
        "ext": 8,
        "dev": 0
      },
      "contactAt": 0.3,
      "fingers": {
        "curl": 1
      },
      "thumb": "wrapped",
      "squeeze": "firm",
      "handle": {
        "profile": "press-horizontal",
        "axis": "across",
        "diameterMm": 32
      },
      "load": {
        "kind": "push"
      }
    },
    "faults": [
      {
        "key": "fingers-bent-back",
        "label": "Wrist bent back",
        "pose": {
          "wrist": {
            "ext": 35,
            "dev": 0
          },
          "contactAt": 1.05,
          "fingers": {
            "curl": 0.92
          },
          "thumb": "loose"
        },
        "markers": [
          "lever-arc"
        ],
        "alt": "Horizontal handle, side view. The handle has slid into the fingers, thumb loose. The wrist is bent far back. The push passes behind the wrist, bending it further."
      }
    ],
    "gripLine": "Push through the heel of your palm, so your wrist stays straight. A wrapped thumb stops the handle rolling into your fingers.",
    "cue": "Heel of palm, wrist straight."
  },
  contacts: [
    "seat-back",
    "standing-feet"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set the seat so the handles meet mid-chest.",
      "zoom": "seat-height",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chest-press"
        ],
        "note": "No study measures seat height on this machine; ACE setup plus consensus."
      }
    },
    {
      "kind": "adjust",
      "text": "Start the handles at your chest, never behind it.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chest-press",
          "fees1998"
        ]
      }
    },
    {
      "kind": "position",
      "text": "Sit right back, hips on the pad, feet flat.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chest-press"
        ]
      }
    },
    {
      "kind": "grip",
      "text": "Handle in the heel of your palm, wrist straight.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH",
          "WEAK"
        ],
        "sources": [
          "ace-chest-press",
          "barbell-logic-grip",
          "weiss1995",
          "nance2017"
        ],
        "note": "Heel of palm and straight wrist: ACE plus coaching consensus. 0-10 deg target leans on Weiss 1995 (nerve pressure, not lifting). The 15-20 deg limit is coaching consensus. Nance 2017 is association only."
      }
    },
    {
      "kind": "brace",
      "text": "Set your shoulder blades down and back into the pad.",
      "zoom": "blades",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chest-press"
        ]
      }
    }
  ],
  posture: [
    {
      "key": "height",
      "label": "Handles mid-chest",
      "detail": "At the start the handles are at mid-chest height. They are level with the chest or just in front, never behind.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "zoom": "seat-height",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chest-press"
        ],
        "note": "No study measures seat height on this machine; ACE setup plus consensus."
      }
    },
    {
      "key": "blades",
      "label": "Blades on pad",
      "detail": "Upper back and shoulder blades stay on the pad to the end of each push. Normal small arch in the low back.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "zoom": "blades",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chest-press"
        ]
      }
    },
    {
      "key": "wrist",
      "label": "Straight wrist",
      "detail": "Knuckles, wrist and forearm form one straight line. The forearm points the way the handle moves. The handle sits in the heel of the palm.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH",
          "WEAK"
        ],
        "sources": [
          "ace-chest-press",
          "barbell-logic-grip",
          "weiss1995",
          "nance2017"
        ],
        "note": "Heel of palm and straight wrist: ACE plus coaching consensus. 0-10 deg target leans on Weiss 1995 (nerve pressure, not lifting). The 15-20 deg limit is coaching consensus. Nance 2017 is association only."
      }
    },
    {
      "key": "elbows",
      "label": "Elbows behind handles",
      "detail": "Each elbow sits about level with its handle and right behind it, below shoulder height. The forearm points straight along the push. From above, horizontal handles put the elbows roughly 45 to 60 degrees out. With vertical handles they sit closer to the body. They never flare straight out level with the shoulders.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chest-press",
          "fees1998"
        ]
      }
    },
    {
      "key": "feet",
      "label": "Sit right back",
      "detail": "Both feet flat on the floor. Hips pushed back into the seat and back pad, no bridging.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chest-press"
        ]
      }
    },
    {
      "key": "soft",
      "label": "Soft elbows",
      "detail": "At the end, the arms are long with a small bend left in the elbows. The shoulder blades are still on the pad.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "zoom": "blades",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chest-press"
        ]
      }
    }
  ],
  zooms: [
    {
      "key": "hand",
      "chip": "Hand",
      "chipCaption": "Heel of palm",
      "heading": "Hand: right and wrong",
      "kind": "hand",
      "feelRow": "wrist"
    },
    {
      "key": "seat-height",
      "chip": "Seat height",
      "heading": "Seat height: right and wrong",
      "kind": "posture",
      "feelRow": "front-shoulders"
    },
    {
      "key": "blades",
      "chip": "Blades",
      "heading": "Shoulder blades: right and wrong",
      "kind": "posture",
      "feelRow": "elbows"
    }
  ],
  copy: {
    "setupLine": "Set the seat so the handles meet mid-chest. Sit right back, feet flat, shoulder blades on the pad.",
    "mistakeLine": "Never let your wrist fold back to finish a heavy rep. Drop the weight and push through the heel of your hand.",
    "cueLine": "Handles at mid-chest."
  },
  mistakes: [
    {
      "key": "wrist",
      "title": "Wrist bent back",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH",
          "WEAK"
        ],
        "sources": [
          "ace-chest-press",
          "barbell-logic-grip",
          "weiss1995",
          "nance2017"
        ],
        "note": "Heel of palm and straight wrist: ACE plus coaching consensus. 0-10 deg target leans on Weiss 1995 (nerve pressure, not lifting). The 15-20 deg limit is coaching consensus. Nance 2017 is association only."
      },
      "fix": "Handle on the heel of your palm. Still bending? Go lighter."
    },
    {
      "key": "seat-low",
      "title": "Seat too low",
      "zoom": "seat-height",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chest-press"
        ],
        "note": "No study measures seat height on this machine; ACE setup plus consensus."
      },
      "fix": "Raise the seat so the handles meet mid-chest."
    },
    {
      "key": "round-lock",
      "title": "Shoulders roll off, elbows lock",
      "zoom": "blades",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chest-press"
        ]
      },
      "fix": "Stop before your elbows lock. Rolling forward to finish? Go lighter."
    }
  ],
  risks: [
    {
      "key": "wrist",
      "text": "Pushing through a bent-back wrist squeezes the back of the wrist.",
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "nance2017"
        ],
        "note": "Nance 2017: an MRI study of people with this pain; association, not cause."
      }
    },
    {
      "key": "shoulder",
      "text": "Handles behind your chest, elbows out, stretch the front of your shoulder under load.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chest-press",
          "fees1998"
        ]
      }
    },
    {
      "key": "elbow",
      "text": "Snapping your elbows straight under heavy weight loads the joints, not the muscles.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-chest-press"
        ]
      }
    }
  ],
  riskFlags: [
    "wrist",
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
    "ace-chest-press",
    "muyor2023",
    "weiss1995",
    "nance2017",
    "fees1998",
    "snyder2012",
    "calatayud2016",
    "barbell-logic-grip",
    "nhs-wrist-pain",
    "nhs-elbow-pain"
  ],
  research: {
    "card": "grip/research/machine_chest_press.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

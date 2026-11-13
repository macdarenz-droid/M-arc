// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=a6d6eddf6712f546fe51a513a98b33a0b67e20c539134efed95c952560e6a395
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_ab_wheel_rollout",
  name: "Ab Wheel Rollout",
  hashes: { inputsSha256: "a6d6eddf6712f546fe51a513a98b33a0b67e20c539134efed95c952560e6a395", golden: "4084a324508f46d7097ba2cd9bc401009c91c7ab09a84aa55d7dcddf2892563d" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"ab-wheel-rollout-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"ab-wheel-rollout-n-st-thigh.l\" d=\"~#F12w*dD-V1TBdTUU1R6X8x1iwuJR1N1.8gI4.kGJ14)nX8Ig*jGdxpzH1.3)1E8X3FoNU1y1hT3IaKuw45SH1SfFtNz1Wn11100000000020001000010001000000000000000121000000000001000010000011000000000001\"/><path id=\"ab-wheel-rollout-n-st-shcap.l\" d=\"~~UDoDxK1AJ12\"/><path id=\"ab-wheel-rollout-n-st-upper.l\" d=\"~#F12WDoH)J1)FoR(I1qz8a18(I1D3K5N1T2_6zz1wa.gizfK8RhX3Vz1E1X2V2R5)3UI1b00E8.eR1Rd!mtWkUbwo01000001001000000100020200000000100000012100001200200000000021000001000010000100\"/><path id=\"ab-wheel-rollout-n-st-elbowcap.l\" d=\"~~WDoUSV1Jw10\"/><path id=\"ab-wheel-rollout-n-st-fore.l\" d=\"~#F12FBowUV1)Doz_U1F1O9oW1!4_E1!2X8J1B2pIu_5)bbGa-6KbV1IuO1x2T3K8T1yF1hY1)1K9G9a*8Hik!fNaSh02020000000000010010000100010020001210000000200210001000000000020001010200001000\"/><path id=\"ab-wheel-rollout-n-st-fist.l\" d=\"~~HVoJS(1Nt0\"/><path id=\"ab-wheel-rollout-n-st-head\" d=\"~#w12N-w1HHE1xzw1.)B1.o*2.hG8x4*9G5ew3)7S3Bcw6Opyc-3(5V6*a-d!kY9NhPcS9_ghwn-eY92001010000000010101002000110000200101000222002220000000000011002\"/><path id=\"ab-wheel-rollout-n-st-torso\" d=\"~#_12NPsS(F1IXt*HF1rTa-1G2B7whsUaE4HiU3S4WdEix7XkXaK6UcY8PgHbFoy7_mU2W9x2!6.e(9XE1AdTnT3R4O5*6B4Hi*3(6T1-d-e*6ViF7vF8Nf_2*3(6TD2XG102000020002000020000111000000200002200200001011000000000011001002000100000000001010000100000000000010000202200000000\"/><path id=\"ab-wheel-rollout-n-st-thigh.r\" d=\"^0\"/><path id=\"ab-wheel-rollout-n-st-shcap.r\" d=\"^1\"/><path id=\"ab-wheel-rollout-n-st-upper.r\" d=\"^2\"/><path id=\"ab-wheel-rollout-n-st-elbowcap.r\" d=\"^3\"/><path id=\"ab-wheel-rollout-n-st-fore.r\" d=\"^4\"/><path id=\"ab-wheel-rollout-n-st-fist.r\" d=\"^5\"/><path id=\"ab-wheel-rollout-n-e-thigh.l\" d=\"~#F12yyvJ*Y1XGw1*IY1S9z59x1KV1(lS8!2H4A1!N1XdYnY3Phz6HgThJK1GiU2O3(4R7OX1!fcA1Ya)1sTuBH1-6Bv(a*sJv00011000000000120021001200000000110000010100021010000000020000000011001002000021\"/><path id=\"ab-wheel-rollout-n-e-kneecap.l\" d=\"~~N.jJW(1DG12\"/><path id=\"ab-wheel-rollout-n-e-shank.l\" d=\"~#F12UAlWI*1xPmzO*1!aU11D1.-1N4F7S5U3N2S*1I3ScW6wb0ScV6S*1J3U3K2F7R5.-1K41B1!aT1Xa-bVmBc)j0VmDc00000000002101200001111010000000000000101010000020002001010000000020000000002000\"/><path id=\"ab-wheel-rollout-n-e-foot.l\" d=\"~#o2_wbJE)1R)a*Fw2*bU2xb(dzbFuEF2YE1yx2.r_y1G9Yj*9Dw1BlPe(5)iylY7Eu000010000000000000010000002000002020022000021000\"/><path id=\"ab-wheel-rollout-n-e-shcap.l\" d=\"~~PAH1W*W1AJ12\"/><path id=\"ab-wheel-rollout-n-e-upper.l\" d=\"~#F12W.H1SAY1z)G1BUX1z7G467SE1_iI3z5-1K2VsOl-aGgEdz7Tj1Vx1Bc)21E61SB1Ym56I7O3*7WcWeDmFi!9Sq102100100000000022010100001000020020000010100001000020010100022020000000022011100\"/><path id=\"ab-wheel-rollout-n-e-elbowcap.l\" d=\"~~FxS1P)_1Jw10\"/><path id=\"ab-wheel-rollout-n-e-fore.l\" d=\"~#F12AUS1P(.1R*R1VR.1x8B5!10!B1wdR6I6G1E2XrKcE8RaK9x4Edy1xsVbR2gB9fJz1(iH1H1G9G2-3P8UcygPeF6JkT102000000011002000020001200012100202000101200001100002000200000200000000110020020\"/><path id=\"ab-wheel-rollout-n-e-fist.l\" d=\"~~FJ_1JS(1Nt0\"/><path id=\"ab-wheel-rollout-n-e-head\" d=\"~#w12WDU1A*T1R)T1XKS1Om.azeXdjXax5G1N5T6H7EaDezmSca_7E4X5VgPgygHcShP3wjz8PlBhN40202000000000121010110000200001010000200210000010100000010100220\"/><path id=\"ab-wheel-rollout-n-e-torso\" d=\"~#_12AUO1HxU1G)P1V.T1U2Bat.2KcWdT2Haxa(f(1P5(iXc6.lx8V9w9Nc!bDgUkUeUk(9_9H1Nb-bNmBy1Dk)h.1R5*2G8)9(f)5D5y3RdXbKb)jmT3P7SdY7)5D5.U1T(100021000001010020010100000121010121010000022000000012100000000020000010020000020000101000000000020000000000000000000\"/><path id=\"ab-wheel-rollout-n-e-thigh.r\" d=\"^8\"/><path id=\"ab-wheel-rollout-n-e-kneecap.r\" d=\"^9\"/><path id=\"ab-wheel-rollout-n-e-shank.r\" d=\"^10\"/><path id=\"ab-wheel-rollout-n-e-foot.r\" d=\"^11\"/><path id=\"ab-wheel-rollout-n-e-shcap.r\" d=\"^12\"/><path id=\"ab-wheel-rollout-n-e-upper.r\" d=\"^13\"/><path id=\"ab-wheel-rollout-n-e-elbowcap.r\" d=\"^14\"/><path id=\"ab-wheel-rollout-n-e-fore.r\" d=\"^15\"/><path id=\"ab-wheel-rollout-n-e-fist.r\" d=\"^16\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#ab-wheel-rollout-n-dots)\"/>\n  <path class=\"datum\" d=\"~MyNgWHw2LDOF1.xe\"/><path class=\"floorline\" d=\"M14.07 332.99H344\"/><path class=\"eq\" d=\"~M_E5y(w2L(.h0QSc0IOhTcLRcUcQ0TcRcTcLIOhUcQRc0JOhUcLScTcQ0UcScUcZ\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#ab-wheel-rollout-n-st-thigh.l\"/><use href=\"#ab-wheel-rollout-n-st-shcap.l\"/><use href=\"#ab-wheel-rollout-n-st-upper.l\"/><use href=\"#ab-wheel-rollout-n-st-elbowcap.l\"/><use href=\"#ab-wheel-rollout-n-st-fore.l\"/><use href=\"#ab-wheel-rollout-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#ab-wheel-rollout-n-st-thigh.l\"/><use href=\"#ab-wheel-rollout-n-st-shcap.l\"/><use href=\"#ab-wheel-rollout-n-st-upper.l\"/><use href=\"#ab-wheel-rollout-n-st-elbowcap.l\"/><use href=\"#ab-wheel-rollout-n-st-fore.l\"/><use href=\"#ab-wheel-rollout-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#ab-wheel-rollout-n-st-head\"/><use href=\"#ab-wheel-rollout-n-st-torso\"/><use href=\"#ab-wheel-rollout-n-st-thigh.r\"/></g><g class=\"u-fill\"><use href=\"#ab-wheel-rollout-n-st-head\"/><use href=\"#ab-wheel-rollout-n-st-torso\"/><use href=\"#ab-wheel-rollout-n-st-thigh.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#ab-wheel-rollout-n-st-shcap.r\"/><use href=\"#ab-wheel-rollout-n-st-upper.r\"/><use href=\"#ab-wheel-rollout-n-st-elbowcap.r\"/><use href=\"#ab-wheel-rollout-n-st-fore.r\"/><use href=\"#ab-wheel-rollout-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#ab-wheel-rollout-n-st-shcap.r\"/><use href=\"#ab-wheel-rollout-n-st-upper.r\"/><use href=\"#ab-wheel-rollout-n-st-elbowcap.r\"/><use href=\"#ab-wheel-rollout-n-st-fore.r\"/><use href=\"#ab-wheel-rollout-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-solid\" d=\"~MwEB1JS(1C0z2V12g9C20R1qafC10lP11hC102W19fC00qN1f7C00P1sh0C00W11faC00N1p7gC00sO10iC104V18gC10rK1g8C20O1ri0Z\"/><path class=\"eq-solid\" d=\"~#P12ADE1JS(1XFE1*B)1*4H1K4S2V3U3R2P4G1w51A5J1w5S2P4W3U3N4S2w5H1A52w5I1N4T2W3R3S2O4J1)41z5G1)4R2O4V3R3K4T2*4I1000000210100000200000010100000000200000101000000000001010002000000000010100000000000020021010000\"/><path class=\"eq\" d=\"~#w12NOB1JS(1xRB1K_(1.2F1I2F2z1w31A3F1w3F2F2(2F1F30(2E1F2E2F1*21E3z1*2I2E2.2E10020020210022000000002001212100000101110000101000021011000012000\"/><path class=\"eq-line\" d=\"^22\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-solid\" d=\"~MWNP1JS(1C0z2V12g9C00K1q8fC00rP10hC002W19fC00qN1f7C00P1sh0C00W11faC00N1p7gC00sO10iC001V1agC00pK1g8C00O1ri0Z\"/><path class=\"eq-solid\" d=\"~#P12YKS1JS(1GPS1*B)1)4H1O4S2T3U3R2P4G1w51A5J1w5U2P4S3U3P4S2w5H1A52w5I1P4T2S3R3U2O4J1)41z5G1)4R2O4T3R3O4T2)4I1000000011100000200000010100020200210000101000000000001010002100020200010100000000000021001010000\"/><path class=\"eq\" d=\"~#w12yXP1JS(1TYP1K_(1)2F1E2F2E1w30A3F1w3F2F2w3F1A30w3E1F2E2F1*20E3E1*2E2E2)2E10000120210120000000022000222000000002100002101000001111000110000\"/><path class=\"eq-line\" d=\"^25\"/></g><g class=\"pose-end\"><path class=\"eq-solid\" d=\"~MHW.1JS(1C0z2V12g9C00K1q8fC00rP10hC203W19fC00qN1f7C20H1sh0C00W11daC20N1p7gC00sO12iC201V1agC00pK1g8C00O1ri0Z\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#ab-wheel-rollout-n-e-thigh.l\"/><use href=\"#ab-wheel-rollout-n-e-kneecap.l\"/><use href=\"#ab-wheel-rollout-n-e-shank.l\"/><use href=\"#ab-wheel-rollout-n-e-foot.l\"/><use href=\"#ab-wheel-rollout-n-e-shcap.l\"/><use href=\"#ab-wheel-rollout-n-e-upper.l\"/><use href=\"#ab-wheel-rollout-n-e-elbowcap.l\"/><use href=\"#ab-wheel-rollout-n-e-fore.l\"/><use href=\"#ab-wheel-rollout-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#ab-wheel-rollout-n-e-thigh.l\"/><use href=\"#ab-wheel-rollout-n-e-kneecap.l\"/><use href=\"#ab-wheel-rollout-n-e-shank.l\"/><use href=\"#ab-wheel-rollout-n-e-foot.l\"/><use href=\"#ab-wheel-rollout-n-e-shcap.l\"/><use href=\"#ab-wheel-rollout-n-e-upper.l\"/><use href=\"#ab-wheel-rollout-n-e-elbowcap.l\"/><use href=\"#ab-wheel-rollout-n-e-fore.l\"/><use href=\"#ab-wheel-rollout-n-e-fist.l\"/></g></g><path class=\"eq-solid\" d=\"~#P12JV*1JS(1*X*1*B)1)4H1K4S2V3U3R2P4I1w52A5H1w5S2P4U3U3P4S2w5H1A52w5I1P4T2U3R3S2O4H1)42z5I1)4R2O4V3R3K4T2)4I1000000010110001210000000000000101200002101000000000001012002001010000000000000101000120001010000\"/><path class=\"eq\" d=\"~#w12Y(.1JS(1Iw!1K_(1*2F1E2F2E1w30A3F1w3F2F2w3F1A30w3E1F2E2F1*20E3E1*2E2E2*2E10010020200020000000022200222000000002100202101000001010000011000\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#ab-wheel-rollout-n-e-head\"/><use href=\"#ab-wheel-rollout-n-e-torso\"/><use href=\"#ab-wheel-rollout-n-e-thigh.r\"/><use href=\"#ab-wheel-rollout-n-e-kneecap.r\"/><use href=\"#ab-wheel-rollout-n-e-shank.r\"/><use href=\"#ab-wheel-rollout-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#ab-wheel-rollout-n-e-head\"/><use href=\"#ab-wheel-rollout-n-e-torso\"/><use href=\"#ab-wheel-rollout-n-e-thigh.r\"/><use href=\"#ab-wheel-rollout-n-e-kneecap.r\"/><use href=\"#ab-wheel-rollout-n-e-shank.r\"/><use href=\"#ab-wheel-rollout-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#ab-wheel-rollout-n-e-shcap.r\"/><use href=\"#ab-wheel-rollout-n-e-upper.r\"/><use href=\"#ab-wheel-rollout-n-e-elbowcap.r\"/><use href=\"#ab-wheel-rollout-n-e-fore.r\"/><use href=\"#ab-wheel-rollout-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#ab-wheel-rollout-n-e-shcap.r\"/><use href=\"#ab-wheel-rollout-n-e-upper.r\"/><use href=\"#ab-wheel-rollout-n-e-elbowcap.r\"/><use href=\"#ab-wheel-rollout-n-e-fore.r\"/><use href=\"#ab-wheel-rollout-n-e-fist.r\"/></g></g><path class=\"eq-line\" d=\"^28\"/><path class=\"eq-line m-line\" d=\"~M!Uo(R.1LaU1L00L20L10L00L00L00L21L12L00L00L00L00L20L10Lc7L20L10L20L10L00L20L10L22L11L00L20LqrL20L00L10L22L11L20L00L10L0z1L00L00L11L22L00L00L00L01LvnL20L12L21L00L10L20L10L20L10L20L00Ld5L01L02L00L00L00L01L02L00L00L01L02L00L00L20L11L02L00L00L01L02L00L00L01L02L00L00L00\"/><path class=\"eq-line m-line\" d=\"~My*o_B)1LtI1L22L11L00L20L10Lk5L01L00L00L02L01L10Lo0L12L01L00L00L02L01Lk8L10L20L02L11L20L10LggL01L00L02L11L22L01L8kL00L10L20L01L02L10L2kL00L02L11L20L00L00L9kL21L02L01L02L00L11LbgL00L10L21L12L20L10Lf8L11L02L00L00L01L02Lj0L00L01L02L00\"/><path class=\"eq-line m-line\" d=\"~My(r_I(1L3V1L02L50L00L00L10L22L01L52L10L20L10L20L10L32L10L02L21L10L02L32L10L00L00L20L10L34L10L20L00L12L21L54L02L00L01L02L21L58L01L00L02L01L00L38L21L10L02L21L10L18L01L02L01L02L01L18L00L00L00L00L01L0aL01L10L22L01L10L28L00L11L22L00L11L2aL21L10L00L00L00L28L01L02L01L02L01L28L20L11L02L20L11L48L00L01L02L00L01L48L01L22L11L00L02L64L11L22L10L20L00L44L00L20L10L00L20L42L02L20L11L02L20L42L20L10L20L10L20L42L21L02L00L00L00L60L02L21L10L02L01L80L02L01L10L22L01L60L00L00L00L00L20L41L20L10L20L10L20\"/><circle class=\"joint\" cx=\"222.82\" cy=\"281.23\" r=\"2.25\"/><circle class=\"joint\" cx=\"261.38\" cy=\"302\" r=\"2.25\"/><circle class=\"joint\" cx=\"162.76\" cy=\"302.09\" r=\"2.25\"/><circle class=\"joint\" cx=\"108.26\" cy=\"321.02\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#S20DWrJS(1V)qIS(10010200010201020001020001020001020001020102000102000102000102010200010200010200000000000100000000000100000000020000000000000000000000000000000001000000000001000000000200000000000000000000000000000000010000000002000000000002000000000000000000000\"/><path class=\"arrow\" d=\"~MHV-1JS(1LOB1YiLPB1EY1Z\"/></g><path class=\"leader\" d=\"~MUVX1UWS1L0.*7\"/><circle class=\"anchor\" cx=\"285.06\" cy=\"259.62\" r=\"1.5\"/><path class=\"leader\" d=\"~M_Hz1D.W1L0KKe\"/><circle class=\"anchor\" cx=\"180.93\" cy=\"280.83\" r=\"1.5\"/><path class=\"leader\" d=\"~MWG.1JE!1L0.E1\"/><circle class=\"anchor\" cx=\"303.63\" cy=\"308.38\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"ab-wheel-rollout-n-line\" data-key=\"line\" data-cue=\"Knees to head in one line, back straight.\" class=\"plate-callout two\" style=\"left:68.16%;top:50%\" aria-pressed=\"true\">Straight<br>line</button><button type=\"button\" id=\"ab-wheel-rollout-n-arch\" data-key=\"arch\" data-cue=\"Don't let your low back arch as you reach.\" class=\"plate-callout two\" style=\"left:47.77%;top:46.65%\" aria-pressed=\"false\">No back<br>arch</button><button type=\"button\" id=\"ab-wheel-rollout-n-slow\" data-key=\"slow\" data-cue=\"Roll out and back slowly and under control.\" class=\"plate-callout two\" style=\"left:81.01%;top:73.18%\" aria-pressed=\"false\">Roll<br>slowly</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"ab-wheel-rollout-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"ab-wheel-rollout-m-st-thigh.l\" d=\"^0\"/><path id=\"ab-wheel-rollout-m-st-shcap.l\" d=\"^1\"/><path id=\"ab-wheel-rollout-m-st-upper.l\" d=\"^2\"/><path id=\"ab-wheel-rollout-m-st-elbowcap.l\" d=\"^3\"/><path id=\"ab-wheel-rollout-m-st-fore.l\" d=\"^4\"/><path id=\"ab-wheel-rollout-m-st-fist.l\" d=\"^5\"/><path id=\"ab-wheel-rollout-m-st-head\" d=\"^6\"/><path id=\"ab-wheel-rollout-m-st-torso\" d=\"^7\"/><path id=\"ab-wheel-rollout-m-st-thigh.r\" d=\"^0\"/><path id=\"ab-wheel-rollout-m-st-shcap.r\" d=\"^1\"/><path id=\"ab-wheel-rollout-m-st-upper.r\" d=\"^2\"/><path id=\"ab-wheel-rollout-m-st-elbowcap.r\" d=\"^3\"/><path id=\"ab-wheel-rollout-m-st-fore.r\" d=\"^4\"/><path id=\"ab-wheel-rollout-m-st-fist.r\" d=\"^5\"/><path id=\"ab-wheel-rollout-m-e-thigh.l\" d=\"^8\"/><path id=\"ab-wheel-rollout-m-e-kneecap.l\" d=\"^9\"/><path id=\"ab-wheel-rollout-m-e-shank.l\" d=\"^10\"/><path id=\"ab-wheel-rollout-m-e-foot.l\" d=\"^11\"/><path id=\"ab-wheel-rollout-m-e-shcap.l\" d=\"^12\"/><path id=\"ab-wheel-rollout-m-e-upper.l\" d=\"^13\"/><path id=\"ab-wheel-rollout-m-e-elbowcap.l\" d=\"^14\"/><path id=\"ab-wheel-rollout-m-e-fore.l\" d=\"^15\"/><path id=\"ab-wheel-rollout-m-e-fist.l\" d=\"^16\"/><path id=\"ab-wheel-rollout-m-e-head\" d=\"^17\"/><path id=\"ab-wheel-rollout-m-e-torso\" d=\"^18\"/><path id=\"ab-wheel-rollout-m-e-thigh.r\" d=\"^8\"/><path id=\"ab-wheel-rollout-m-e-kneecap.r\" d=\"^9\"/><path id=\"ab-wheel-rollout-m-e-shank.r\" d=\"^10\"/><path id=\"ab-wheel-rollout-m-e-foot.r\" d=\"^11\"/><path id=\"ab-wheel-rollout-m-e-shcap.r\" d=\"^12\"/><path id=\"ab-wheel-rollout-m-e-upper.r\" d=\"^13\"/><path id=\"ab-wheel-rollout-m-e-elbowcap.r\" d=\"^14\"/><path id=\"ab-wheel-rollout-m-e-fore.r\" d=\"^15\"/><path id=\"ab-wheel-rollout-m-e-fist.r\" d=\"^16\"/><path id=\"ab-wheel-rollout-m-m-head\" d=\"~#w12WNS1P!P1KWR1BTO1*oX1BiO7T4V9B5mU2B8(2Gc!4Xp_bI4Y5.6VbIdJl_8(hUbHaNgg(mEePa0000012000000020000000010000000220220010010101001010000001002001\"/><path id=\"ab-wheel-rollout-m-m-torso\" d=\"~#_12FFN1(WS1ENO1RxS1I1Ra.1B2K6HhH1NaG3UiH7(6W9xtRbVB1*7)8A7UdP9UhJiJh(i_cS9W2ydza(qVuUm.ewnVhA3GV1-T1DH1T3y7z2XdEfG6EiD8jH8Pfy2T3y7IF2ID110001000000010110002001010000020000012001000010100000000000100001000000110002010100001002101002002100000000000020000\"/><path id=\"ab-wheel-rollout-m-m-thigh.l\" d=\"~#F12JAw1yJ.1zOx1GA.1WaX25x1x-1!8Y7Y4_3A2!P1O2DmD9Pi*1!jGdNP1E7H3*2U6z6V-1U22y1wbk!7TtKE1Gg-w1F3Kz1!n00000012100001000001000012000001110000000000000200000200000220001010102000001200\"/><path id=\"ab-wheel-rollout-m-m-thigh.r\" d=\"^41\"/><path id=\"ab-wheel-rollout-m-mf-kneecap.l\" d=\"^9\"/><path id=\"ab-wheel-rollout-m-mf-shank.l\" d=\"^10\"/><path id=\"ab-wheel-rollout-m-mf-foot.l\" d=\"^11\"/><path id=\"ab-wheel-rollout-m-mf-shcap.l\" d=\"^12\"/><path id=\"ab-wheel-rollout-m-mf-upper.l\" d=\"^13\"/><path id=\"ab-wheel-rollout-m-mf-elbowcap.l\" d=\"^14\"/><path id=\"ab-wheel-rollout-m-mf-fore.l\" d=\"^15\"/><path id=\"ab-wheel-rollout-m-mf-fist.l\" d=\"^16\"/><path id=\"ab-wheel-rollout-m-mf-kneecap.r\" d=\"^9\"/><path id=\"ab-wheel-rollout-m-mf-shank.r\" d=\"^10\"/><path id=\"ab-wheel-rollout-m-mf-foot.r\" d=\"^11\"/><path id=\"ab-wheel-rollout-m-mf-shcap.r\" d=\"^12\"/><path id=\"ab-wheel-rollout-m-mf-upper.r\" d=\"^13\"/><path id=\"ab-wheel-rollout-m-mf-elbowcap.r\" d=\"^14\"/><path id=\"ab-wheel-rollout-m-mf-fore.r\" d=\"^15\"/><path id=\"ab-wheel-rollout-m-mf-fist.r\" d=\"^16\"/><path id=\"ab-wheel-rollout-m-mo-0\" d=\"^17\"/><path id=\"ab-wheel-rollout-m-mo-1\" d=\"^18\"/><path id=\"ab-wheel-rollout-m-mo-2\" d=\"^8\"/><path id=\"ab-wheel-rollout-m-mo-3\" d=\"^9\"/><path id=\"ab-wheel-rollout-m-mo-4\" d=\"^10\"/><path id=\"ab-wheel-rollout-m-mo-5\" d=\"^11\"/><path id=\"ab-wheel-rollout-m-mo-6\" d=\"^12\"/><path id=\"ab-wheel-rollout-m-mo-7\" d=\"^13\"/><path id=\"ab-wheel-rollout-m-mo-8\" d=\"^14\"/><path id=\"ab-wheel-rollout-m-mo-9\" d=\"^15\"/><path id=\"ab-wheel-rollout-m-mo-10\" d=\"^16\"/><path id=\"ab-wheel-rollout-m-mo-11\" d=\"^8\"/><path id=\"ab-wheel-rollout-m-mo-12\" d=\"^9\"/><path id=\"ab-wheel-rollout-m-mo-13\" d=\"^10\"/><path id=\"ab-wheel-rollout-m-mo-14\" d=\"^11\"/><path id=\"ab-wheel-rollout-m-mo-15\" d=\"^12\"/><path id=\"ab-wheel-rollout-m-mo-16\" d=\"^13\"/><path id=\"ab-wheel-rollout-m-mo-17\" d=\"^14\"/><path id=\"ab-wheel-rollout-m-mo-18\" d=\"^15\"/><path id=\"ab-wheel-rollout-m-mo-19\" d=\"^16\"/><path id=\"ab-wheel-rollout-m-mo-20\" d=\"^21\"/><path id=\"ab-wheel-rollout-m-mo-21\" d=\"^29\"/><path id=\"ab-wheel-rollout-m-mo-22\" d=\"^30\"/><path id=\"ab-wheel-rollout-m-mo-23\" d=\"^28\"/><path id=\"ab-wheel-rollout-m-mo-24\" d=\"^28\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#ab-wheel-rollout-m-dots)\"/>\n  <path class=\"datum\" d=\"^19\"/><path class=\"floorline\" d=\"^20\"/><path class=\"eq\" d=\"^21\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#ab-wheel-rollout-m-st-thigh.l\"/><use href=\"#ab-wheel-rollout-m-st-shcap.l\"/><use href=\"#ab-wheel-rollout-m-st-upper.l\"/><use href=\"#ab-wheel-rollout-m-st-elbowcap.l\"/><use href=\"#ab-wheel-rollout-m-st-fore.l\"/><use href=\"#ab-wheel-rollout-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#ab-wheel-rollout-m-st-thigh.l\"/><use href=\"#ab-wheel-rollout-m-st-shcap.l\"/><use href=\"#ab-wheel-rollout-m-st-upper.l\"/><use href=\"#ab-wheel-rollout-m-st-elbowcap.l\"/><use href=\"#ab-wheel-rollout-m-st-fore.l\"/><use href=\"#ab-wheel-rollout-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#ab-wheel-rollout-m-st-head\"/><use href=\"#ab-wheel-rollout-m-st-torso\"/><use href=\"#ab-wheel-rollout-m-st-thigh.r\"/></g><g class=\"u-fill\"><use href=\"#ab-wheel-rollout-m-st-head\"/><use href=\"#ab-wheel-rollout-m-st-torso\"/><use href=\"#ab-wheel-rollout-m-st-thigh.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#ab-wheel-rollout-m-st-shcap.r\"/><use href=\"#ab-wheel-rollout-m-st-upper.r\"/><use href=\"#ab-wheel-rollout-m-st-elbowcap.r\"/><use href=\"#ab-wheel-rollout-m-st-fore.r\"/><use href=\"#ab-wheel-rollout-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#ab-wheel-rollout-m-st-shcap.r\"/><use href=\"#ab-wheel-rollout-m-st-upper.r\"/><use href=\"#ab-wheel-rollout-m-st-elbowcap.r\"/><use href=\"#ab-wheel-rollout-m-st-fore.r\"/><use href=\"#ab-wheel-rollout-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-solid\" d=\"^22\"/><path class=\"eq-solid\" d=\"^23\"/><path class=\"eq\" d=\"^24\"/><path class=\"eq-line\" d=\"^22\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-solid\" d=\"^25\"/><path class=\"eq-solid\" d=\"^26\"/><path class=\"eq\" d=\"^27\"/><path class=\"eq-line\" d=\"^25\"/></g><g class=\"pose-end\"><path class=\"eq-solid\" d=\"^28\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#ab-wheel-rollout-m-e-thigh.l\"/><use href=\"#ab-wheel-rollout-m-e-kneecap.l\"/><use href=\"#ab-wheel-rollout-m-e-shank.l\"/><use href=\"#ab-wheel-rollout-m-e-foot.l\"/><use href=\"#ab-wheel-rollout-m-e-shcap.l\"/><use href=\"#ab-wheel-rollout-m-e-upper.l\"/><use href=\"#ab-wheel-rollout-m-e-elbowcap.l\"/><use href=\"#ab-wheel-rollout-m-e-fore.l\"/><use href=\"#ab-wheel-rollout-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#ab-wheel-rollout-m-e-thigh.l\"/><use href=\"#ab-wheel-rollout-m-e-kneecap.l\"/><use href=\"#ab-wheel-rollout-m-e-shank.l\"/><use href=\"#ab-wheel-rollout-m-e-foot.l\"/><use href=\"#ab-wheel-rollout-m-e-shcap.l\"/><use href=\"#ab-wheel-rollout-m-e-upper.l\"/><use href=\"#ab-wheel-rollout-m-e-elbowcap.l\"/><use href=\"#ab-wheel-rollout-m-e-fore.l\"/><use href=\"#ab-wheel-rollout-m-e-fist.l\"/></g></g><path class=\"eq-solid\" d=\"^29\"/><path class=\"eq\" d=\"^30\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#ab-wheel-rollout-m-e-head\"/><use href=\"#ab-wheel-rollout-m-e-torso\"/><use href=\"#ab-wheel-rollout-m-e-thigh.r\"/><use href=\"#ab-wheel-rollout-m-e-kneecap.r\"/><use href=\"#ab-wheel-rollout-m-e-shank.r\"/><use href=\"#ab-wheel-rollout-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#ab-wheel-rollout-m-e-head\"/><use href=\"#ab-wheel-rollout-m-e-torso\"/><use href=\"#ab-wheel-rollout-m-e-thigh.r\"/><use href=\"#ab-wheel-rollout-m-e-kneecap.r\"/><use href=\"#ab-wheel-rollout-m-e-shank.r\"/><use href=\"#ab-wheel-rollout-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#ab-wheel-rollout-m-e-shcap.r\"/><use href=\"#ab-wheel-rollout-m-e-upper.r\"/><use href=\"#ab-wheel-rollout-m-e-elbowcap.r\"/><use href=\"#ab-wheel-rollout-m-e-fore.r\"/><use href=\"#ab-wheel-rollout-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#ab-wheel-rollout-m-e-shcap.r\"/><use href=\"#ab-wheel-rollout-m-e-upper.r\"/><use href=\"#ab-wheel-rollout-m-e-elbowcap.r\"/><use href=\"#ab-wheel-rollout-m-e-fore.r\"/><use href=\"#ab-wheel-rollout-m-e-fist.r\"/></g></g><path class=\"eq-line\" d=\"^28\"/><path class=\"eq-line m-line\" d=\"^31\"/><path class=\"eq-line m-line\" d=\"^32\"/><path class=\"eq-line m-line\" d=\"^33\"/><circle class=\"joint\" cx=\"222.82\" cy=\"281.23\" r=\"2.25\"/><circle class=\"joint\" cx=\"261.38\" cy=\"302\" r=\"2.25\"/><circle class=\"joint\" cx=\"162.76\" cy=\"302.09\" r=\"2.25\"/><circle class=\"joint\" cx=\"108.26\" cy=\"321.02\" r=\"2.25\"/></g><mask id=\"ab-wheel-rollout-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#ab-wheel-rollout-m-m-head\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-m-torso\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-m-thigh.l\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-shank.l\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-foot.l\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-upper.l\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-fore.l\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-fist.l\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-m-thigh.r\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-shank.r\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-foot.r\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-upper.r\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-fore.r\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mf-fist.r\" fill=\"#000\"/><use href=\"#ab-wheel-rollout-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#ab-wheel-rollout-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#ab-wheel-rollout-m-mmask)\"><g class=\"u-stroke\"><use href=\"#ab-wheel-rollout-m-m-head\"/><use href=\"#ab-wheel-rollout-m-m-torso\"/><use href=\"#ab-wheel-rollout-m-m-thigh.l\"/><use href=\"#ab-wheel-rollout-m-m-thigh.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~Mw*z1(yX1L0wI2MXi)oLYiwpL0)R1\"/><path class=\"leader m\" d=\"~M_Hz1D.W1L0K.c\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"ab-wheel-rollout-m-arch\" data-key=\"arch\" data-cue=\"The low back arches as the arms reach overhead.\" class=\"plate-callout two m\" style=\"left:47.77%;top:48.88%\" aria-pressed=\"true\">Low back<br>arches</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "line",
        cues: [{ key: "line", cue: "Knees to head in one line, back straight." }, { key: "arch", cue: "Don't let your low back arch as you reach." }, { key: "slow", cue: "Roll out and back slowly and under control." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "arch",
        cues: [{ key: "arch", cue: "The low back arches as the arms reach overhead." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Low back arches</b><span>The low back arches as the arms reach overhead.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: roll out 2 seconds, roll back 1 second\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Roll out</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Roll back</b><span>1 s</span></div></div></div>",
      alt: "Ab wheel rollout, side view. Kneeling on a pad with the hands on the wheel just in front of the knees, the lifter rolls the wheel forward until the body is one straight line from the knees to the head, arms reaching overhead.",
      mistakeAlt: "Ab Wheel Rollout: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP (b): the card gives no thumb, contact or wrist claim; its grip type and width (c1) are setup step 1."
  },
  contacts: [
    "floor-body"
  ],
  setup: [
    {
      "kind": "grip",
      "text": "Kneel on a soft pad, hands on the wheel, shoulder-width apart.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-abwheel",
          "sl-abex",
          "bb-bestab"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "position",
      "text": "Set the wheel on the floor just in front of your knees.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-abwheel",
          "sl-abex",
          "bb-bestab"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "brace",
      "text": "Brace and squeeze your glutes. Start with your trunk, not your arms.",
      "zoom": "back-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-abex",
          "sl-abwheel",
          "bb-abrollouts"
        ],
        "note": "card c2, c5"
      }
    },
    {
      "kind": "safety",
      "text": "New? Kneel, not standing, and roll toward a wall that stops you.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-abrollouts",
          "bb-bestab",
          "sl-abwheel"
        ],
        "note": "card c6, c7"
      }
    },
    {
      "kind": "position",
      "text": "Start short, roll further as strength grows. Pull back with your lats.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-abrollouts",
          "bb-bestab",
          "sl-abwheel"
        ],
        "note": "card c7, c4"
      }
    }
  ],
  posture: [
    {
      "key": "slow",
      "label": "Roll slowly",
      "detail": "Roll out slowly, never fast.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-abrollouts",
          "sl-abex",
          "sl-abwheel"
        ],
        "note": "card c2, c5"
      }
    },
    {
      "key": "line",
      "label": "Straight line",
      "detail": "Knees to head in one straight line.",
      "anchor": {
        "pose": "end",
        "at": "backMid"
      },
      "zoom": "back-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-abex",
          "sl-abwheel"
        ],
        "note": "card c2"
      }
    },
    {
      "key": "back",
      "label": "No back arch",
      "detail": "Your low back doesn't arch as you reach. If it does, roll out less far.",
      "anchor": {
        "pose": "end",
        "at": "sacrum"
      },
      "zoom": "back-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-bestab",
          "bb-abrollouts",
          "sl-abwheel"
        ],
        "note": "card c3, c7"
      }
    },
    {
      "key": "core",
      "label": "Trunk first",
      "detail": "Start the roll from your trunk, not your arms.",
      "anchor": {
        "pose": "start",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-abrollouts"
        ],
        "note": "card c5"
      }
    },
    {
      "key": "return",
      "label": "Pull back",
      "detail": "Pull back with your lats, under control.",
      "anchor": {
        "pose": "end",
        "at": "shoulder.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-abwheel",
          "bb-bestab"
        ],
        "note": "card c4"
      }
    },
    {
      "key": "range",
      "label": "Short range",
      "detail": "A short roll-out you fully control.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-abrollouts",
          "bb-bestab",
          "sl-coreex",
          "sl-abwheel",
          "sl-abex"
        ],
        "note": "card c7"
      }
    },
    {
      "key": "standing",
      "label": "Standing too soon",
      "detail": "Build up on your knees with a short roll-out.",
      "anchor": {
        "pose": "start",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-abrollouts",
          "bb-bestab",
          "sl-abwheel"
        ],
        "note": "card c6, c7"
      }
    }
  ],
  zooms: [
    {
      "key": "back-line",
      "chip": "Back line",
      "heading": "Back line",
      "kind": "posture",
      "feelRow": "low-back"
    }
  ],
  chips: [
    "back-line",
    "feel"
  ],
  copy: {
    "setupLine": "Kneel on a soft pad, hands on the wheel. Brace and roll out slowly.",
    "mistakeLine": "Don't let your low back arch. Roll out less far.",
    "cueLine": "Knees to head in one line."
  },
  mistakes: [],
  risks: [
    {
      "key": "arch",
      "text": "An arching or rotating torso can result in injury.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-abrollouts"
        ],
        "note": "card c13"
      }
    },
    {
      "key": "fast",
      "text": "Rolling out too fast can increase the risk of arching or rotating.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-abrollouts"
        ],
        "note": "card c5"
      }
    },
    {
      "key": "fall",
      "text": "A fall in a standing rollout has caused serious spine injury.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "yamane-2023"
        ],
        "note": "card c8"
      }
    }
  ],
  riskFlags: [
    "back"
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
    "sl-abwheel",
    "sl-abex",
    "sl-coreex",
    "bb-bestab",
    "bb-abrollouts",
    "escamilla-2006",
    "yamane-2023",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/ab_wheel_rollout.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

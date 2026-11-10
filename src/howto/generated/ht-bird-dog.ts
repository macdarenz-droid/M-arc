// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=ba5518c50e57d967f6b5a72521d7e4a3266ae78e5a6b4f2cb537b29d00299f03
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_bird_dog",
  name: "Bird Dog",
  hashes: { inputsSha256: "ba5518c50e57d967f6b5a72521d7e4a3266ae78e5a6b4f2cb537b29d00299f03", golden: "5dc253bfd4aa7315914e224255506f93ea050061447f554b3df4558f291dab3f" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"bird-dog-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"bird-dog-n-st-thigh.l\" d=\"~#F12Uys(YT1V(rEFS1*1zcE11S3wx2D6z8_2x4W2)W1Yc.n0.kXc.nV2)W1-2x4z6z8V3wx2H11(1zcIw1EcVmHH10FB1WmHH100000200001012121010100200010000000001000200002002121000000200001000000000000020\"/><path id=\"bird-dog-n-st-kneecap.l\" d=\"~~_zt!Nw2JN12\"/><path id=\"bird-dog-n-st-shank.l\" d=\"~#F12FxvFx)1KNw1GU)1(aW59D1R)1Vf_5N8(2w4Az2yiybSbWbw4_f.2Ww2PpW4K1Y9G3I!1EpcB1Fcw2I7Ig*jxlIl)6Rs(400100000000000000010100020200010120100020010100000000000002000000200000200000020\"/><path id=\"bird-dog-n-st-foot.l\" d=\"~#o2A.jA(.1.Uk--!1G7SbD2!jFf(w1)pD-2Yt*G2HkBz1Y7Tn_8KH1Fg.6W1(v*hGu000000001000101000002000100110000020010101000002\"/><path id=\"bird-dog-n-st-upper.r\" d=\"~#F12YNH1H(O1XOH1G-N1gE9a1P2JR1F3B6P1x3(5.E1NaKj0)gKaKj*5.E1O1x3E3B6O2JR191fE9Xgx1BeNq0FnDeNq00000100002002000000101010000000000000000020000000021000000100000001010000111100\"/><path id=\"bird-dog-n-st-elbowcap.r\" d=\"~~w!H1PS-1NA12\"/><path id=\"bird-dog-n-st-fore.r\" d=\"~#F12H_H1PS-1I*H1KVY1W1Vas(1S3wK1W3V9U1I2gEy1A7zd0Xbz7zdfEy1T1I2V3V9R3wK1r(1V1VaRa3.aFk0!h!aFk00110100000010010010020000002200001200000002200001200000000121101000000000000000\"/><path id=\"bird-dog-n-st-palm.r\" d=\"~#o2NwJ1SIw2VTH1T!)1(8)9*8T1zgw5OlB4Ee0Olszg0*8)4(80yA1.oJh0101010101000101000000000121001111010101011010010\"/><path id=\"bird-dog-n-e-thigh.l\" d=\"~#F12ySuJGR1Xyw1IBR1Ac*12G1)w2Y3A8A6A4!2wX1S2_nWc(k0_n-cwX1X2y4-2A8E6*w2K31F1Fc!1AcGw1GH1TmEB10GH1_m00001001000000100000020010010100000000001100002000020000000022000202000010101200\"/><path id=\"bird-dog-n-e-kneecap.l\" d=\"~~_KgS-T1JN12\"/><path id=\"bird-dog-n-e-shank.l\" d=\"~#F12H!hPGS1EKjOKS1Fc(12H1Gx2(4D8A6y4(2HB2-3DeS7Jc2yeR7NB2w4y4.2A8z6Bx2B50E1Fc.1zcGdOpXdRm0OpUd10220000001010000100101111012100001010000001000010101000000001011000001000002110\"/><path id=\"bird-dog-n-e-foot.l\" d=\"~#o2yG6A.S1BH7IKT1G3HdF8Di!oPqH3_!2w5RO2F8XE10-o)4zI1HdTbSb!tOqBn000010011001000101000000100010110001000000000001\"/><path id=\"bird-dog-n-e-shcap.l\" d=\"~~YNH1H(O1WR12\"/><path id=\"bird-dog-n-e-upper.l\" d=\"^4\"/><path id=\"bird-dog-n-e-elbowcap.l\" d=\"^5\"/><path id=\"bird-dog-n-e-fore.l\" d=\"^6\"/><path id=\"bird-dog-n-e-palm.l\" d=\"^7\"/><path id=\"bird-dog-n-e-head\" d=\"~#w12A)V1PzK1z_V1-KI1ToTd)eKg2)bX5.1U6x7!8zbHh.nAeA1A9G4O5zjShDjWcNkY2UlOaUnRj(30000000020000010000000020000022000200002000200010100212100020000\"/><path id=\"bird-dog-n-e-torso\" d=\"~#_12A_P1_(J1xIS1B.J1W3IbvE3XeUeT3JbGcFh_1J6ymBdU1RoK8IbJ9SeFc(iFmWhSmUc(aw2WdOcFrzB1wo-i.1I6V2T9GcJhx7J5H4*eOcVdOmfR4D8YeS9x7P5KX1-G200000010000022000000101010100000020002220000001000020000212001010020020000010000100001101200010020010110000000002000\"/><path id=\"bird-dog-n-e-thigh.r\" d=\"^0\"/><path id=\"bird-dog-n-e-kneecap.r\" d=\"^1\"/><path id=\"bird-dog-n-e-shank.r\" d=\"^2\"/><path id=\"bird-dog-n-e-foot.r\" d=\"^3\"/><path id=\"bird-dog-n-e-shcap.r\" d=\"^12\"/><path id=\"bird-dog-n-e-upper.r\" d=\"~#F12NwJ1wPR1K.H1)NR1E9f19JR1O2B6E3x3O1.E1*5KjKa)g0KjNa.E1(5x3P1B6F3JR1P21aE9gx1YgNqDeFn0NqBe00001000100020000000020000000000000000010101000000200210001000000011110000101000\"/><path id=\"bird-dog-n-e-elbowcap.r\" d=\"~~DPU1H(O1NA12\"/><path id=\"bird-dog-n-e-fore.r\" d=\"~#F12UUV1NAR1RXU1IxR1VaV1(1rwK1R3V9V3I2T1Ey1fBdz7Tb0BdA7Ey1gI2U1V9W3wK1S3(1sVaW13SaFk!a!h0Fk.a01121000000002100002200010002100002200120020010010000000001010000000000000000001\"/><path id=\"bird-dog-n-e-palm.r\" d=\"~#o2SD*1NBO1--.1OWN1(8*9)8V1xg(4Klz4Ie2Kloxg2)8)4(80yA1.oJh0101010110000010000000001000000011010101011000210\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#bird-dog-n-dots)\"/>\n  <path class=\"floorline\" d=\"M27 339.5H289.08\"/><path class=\"eq\" d=\"~M!I5YDy2LY)S10QA30T!S1z3Lz31Q0z3z32LT!S1A3Qz30U!S1A3LA32Q0A3A31Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bird-dog-n-st-thigh.l\"/><use href=\"#bird-dog-n-st-kneecap.l\"/><use href=\"#bird-dog-n-st-shank.l\"/><use href=\"#bird-dog-n-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#bird-dog-n-st-thigh.l\"/><use href=\"#bird-dog-n-st-kneecap.l\"/><use href=\"#bird-dog-n-st-shank.l\"/><use href=\"#bird-dog-n-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bird-dog-n-st-upper.r\"/><use href=\"#bird-dog-n-st-elbowcap.r\"/><use href=\"#bird-dog-n-st-fore.r\"/><use href=\"#bird-dog-n-st-palm.r\"/></g><g class=\"u-fill\"><use href=\"#bird-dog-n-st-upper.r\"/><use href=\"#bird-dog-n-st-elbowcap.r\"/><use href=\"#bird-dog-n-st-fore.r\"/><use href=\"#bird-dog-n-st-palm.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bird-dog-n-e-thigh.l\"/><use href=\"#bird-dog-n-e-kneecap.l\"/><use href=\"#bird-dog-n-e-shank.l\"/><use href=\"#bird-dog-n-e-foot.l\"/><use href=\"#bird-dog-n-e-shcap.l\"/><use href=\"#bird-dog-n-e-upper.l\"/><use href=\"#bird-dog-n-e-elbowcap.l\"/><use href=\"#bird-dog-n-e-fore.l\"/><use href=\"#bird-dog-n-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#bird-dog-n-e-thigh.l\"/><use href=\"#bird-dog-n-e-kneecap.l\"/><use href=\"#bird-dog-n-e-shank.l\"/><use href=\"#bird-dog-n-e-foot.l\"/><use href=\"#bird-dog-n-e-shcap.l\"/><use href=\"#bird-dog-n-e-upper.l\"/><use href=\"#bird-dog-n-e-elbowcap.l\"/><use href=\"#bird-dog-n-e-fore.l\"/><use href=\"#bird-dog-n-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bird-dog-n-e-head\"/><use href=\"#bird-dog-n-e-torso\"/><use href=\"#bird-dog-n-e-thigh.r\"/><use href=\"#bird-dog-n-e-kneecap.r\"/><use href=\"#bird-dog-n-e-shank.r\"/><use href=\"#bird-dog-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bird-dog-n-e-head\"/><use href=\"#bird-dog-n-e-torso\"/><use href=\"#bird-dog-n-e-thigh.r\"/><use href=\"#bird-dog-n-e-kneecap.r\"/><use href=\"#bird-dog-n-e-shank.r\"/><use href=\"#bird-dog-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bird-dog-n-e-shcap.r\"/><use href=\"#bird-dog-n-e-upper.r\"/><use href=\"#bird-dog-n-e-elbowcap.r\"/><use href=\"#bird-dog-n-e-fore.r\"/><use href=\"#bird-dog-n-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#bird-dog-n-e-shcap.r\"/><use href=\"#bird-dog-n-e-upper.r\"/><use href=\"#bird-dog-n-e-elbowcap.r\"/><use href=\"#bird-dog-n-e-fore.r\"/><use href=\"#bird-dog-n-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"225.35\" cy=\"245.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"274.66\" cy=\"245.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.51\" cy=\"265.11\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.51\" cy=\"330.06\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#A20J_gWI.1BzhRR.10102122100100022110200010200000010200211221102201000000000000201020001010000020020010001001000002200000002000000200020002000000000001010000000021010000011101000000011101100010001200120002000200121002000\"/><path class=\"arrow\" d=\"~MUJ6DSU1LWG1J4L.*1FrZ\"/></g><path class=\"leader\" d=\"M230.35 325.51L239 310H249\"/><circle class=\"anchor\" cx=\"230.35\" cy=\"325.51\" r=\"1.5\"/><path class=\"leader\" d=\"~MyBB1wSN1L0X_1\"/><circle class=\"anchor\" cx=\"190.25\" cy=\"238.4\" r=\"1.5\"/><path class=\"leader\" d=\"~MSK-1SSN1L0RB5\"/><circle class=\"anchor\" cx=\"294.01\" cy=\"238.49\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"bird-dog-n-under\" data-key=\"under\" data-cue=\"Hands under the shoulders, knees under the hips.\" class=\"plate-callout two\" style=\"left:68.16%;top:80.45%\" aria-pressed=\"true\">Hands, knees<br>under</button><button type=\"button\" id=\"bird-dog-n-flat\" data-key=\"flat\" data-cue=\"Spine neutral: no sagging or arching as the leg rises.\" class=\"plate-callout\" style=\"left:46.93%;top:54.75%\" aria-pressed=\"false\">Back flat</button><button type=\"button\" id=\"bird-dog-n-level\" data-key=\"level\" data-cue=\"Arm and leg at or near parallel to the floor, hips level.\" class=\"plate-callout two\" style=\"left:79.33%;top:48.04%\" aria-pressed=\"false\">Arm, leg<br>level</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"bird-dog-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"bird-dog-m-st-thigh.l\" d=\"^0\"/><path id=\"bird-dog-m-st-kneecap.l\" d=\"^1\"/><path id=\"bird-dog-m-st-shank.l\" d=\"^2\"/><path id=\"bird-dog-m-st-foot.l\" d=\"^3\"/><path id=\"bird-dog-m-st-upper.r\" d=\"^4\"/><path id=\"bird-dog-m-st-elbowcap.r\" d=\"^5\"/><path id=\"bird-dog-m-st-fore.r\" d=\"^6\"/><path id=\"bird-dog-m-st-palm.r\" d=\"^7\"/><path id=\"bird-dog-m-e-thigh.l\" d=\"^8\"/><path id=\"bird-dog-m-e-kneecap.l\" d=\"^9\"/><path id=\"bird-dog-m-e-shank.l\" d=\"^10\"/><path id=\"bird-dog-m-e-foot.l\" d=\"^11\"/><path id=\"bird-dog-m-e-shcap.l\" d=\"^12\"/><path id=\"bird-dog-m-e-upper.l\" d=\"^4\"/><path id=\"bird-dog-m-e-elbowcap.l\" d=\"^5\"/><path id=\"bird-dog-m-e-fore.l\" d=\"^6\"/><path id=\"bird-dog-m-e-palm.l\" d=\"^7\"/><path id=\"bird-dog-m-e-head\" d=\"^13\"/><path id=\"bird-dog-m-e-torso\" d=\"^14\"/><path id=\"bird-dog-m-e-thigh.r\" d=\"^0\"/><path id=\"bird-dog-m-e-kneecap.r\" d=\"^1\"/><path id=\"bird-dog-m-e-shank.r\" d=\"^2\"/><path id=\"bird-dog-m-e-foot.r\" d=\"^3\"/><path id=\"bird-dog-m-e-shcap.r\" d=\"^12\"/><path id=\"bird-dog-m-e-upper.r\" d=\"^15\"/><path id=\"bird-dog-m-e-elbowcap.r\" d=\"^16\"/><path id=\"bird-dog-m-e-fore.r\" d=\"^17\"/><path id=\"bird-dog-m-e-palm.r\" d=\"^18\"/><path id=\"bird-dog-m-m-head\" d=\"~#w12PIV1POI1T*U1I.G1OqI9RhTd)1*b*5pJ5x8!6OcAdKqyeE1F8X5R8*hPk(f(fyiH6!kK6ApRiw70010000210010110000000200020001010020000000000000012101000000000\"/><path id=\"bird-dog-m-m-torso\" d=\"~#_12wFP1PDJ1TXR1X_I1W1.bK1*2Bc_gV1_bB9Aj_5Y9HjTsG1GJ1-5EcU3whw5(lUeNo_gUjP9W5Dh)6PD1BpwtI9HuzcJj)Y1-A2Aux6U6Y1RfTeIbEmH3B3_8Fgw7z6S6)y2O)100111000000101000000000110000000000001000200001000002000010100000000000020200121000000001000000000100000020001000100\"/><path id=\"bird-dog-m-m-thigh.l\" d=\"~#F12UYu(NR1VEw1E!R1AcP2eE1z(1EjN5U8_2A4WS1Ul!hFkSjF7_qT3SU1WgW4E1!9)2X.1)pbF1Yaw6WmxqXv)z1.y1*cRO1P610002000000100000000000000011010100022200010100020100000202000010120000001010000\"/><path id=\"bird-dog-m-m-kneecap.l\" d=\"~~(RgAJO1JN12\"/><path id=\"bird-dog-m-m-shank.l\" d=\"~#F12yRiy)K1R*jXTN1_ay6dD1.(1)hN5U8!2y4Hy2SkUawcUbH4!fz2W)1Wr_4B1Y9*2I.1Orgz1ycN2V6VgEjVl)k.7-s(320020000200100010001000000020000202200210000101200000100021011000000100021101002\"/><path id=\"bird-dog-m-m-foot.l\" d=\"~#o2_N7(NH1RE8RII1V7FbN1wkyePx1EtAY2Jw1-F2UlIy1W8GnHazH1NgE6g(vXg.u010100200000000010000000002001111001000000220000\"/><path id=\"bird-dog-m-m-thigh.r\" d=\"~#F12PKrW*T1xErEKS1R2xcB12(6Ww2Y5K8U2B47zX1SbKoB1.k*dznR5.W1)2-3V6-73wx2H10D1Gc.w1OaKkPI1!1AB1wpAG101111000000010000000000020000010000001000100021000002100000000002200020010002001\"/><path id=\"bird-dog-m-mf-shcap.l\" d=\"^12\"/><path id=\"bird-dog-m-mf-upper.l\" d=\"^4\"/><path id=\"bird-dog-m-mf-elbowcap.l\" d=\"^5\"/><path id=\"bird-dog-m-mf-fore.l\" d=\"^6\"/><path id=\"bird-dog-m-mf-palm.l\" d=\"^7\"/><path id=\"bird-dog-m-mf-kneecap.r\" d=\"^1\"/><path id=\"bird-dog-m-mf-shank.r\" d=\"^2\"/><path id=\"bird-dog-m-mf-foot.r\" d=\"^3\"/><path id=\"bird-dog-m-mf-shcap.r\" d=\"^12\"/><path id=\"bird-dog-m-mf-upper.r\" d=\"^15\"/><path id=\"bird-dog-m-mf-elbowcap.r\" d=\"^16\"/><path id=\"bird-dog-m-mf-fore.r\" d=\"^17\"/><path id=\"bird-dog-m-mf-palm.r\" d=\"^18\"/><path id=\"bird-dog-m-mo-0\" d=\"^13\"/><path id=\"bird-dog-m-mo-1\" d=\"^14\"/><path id=\"bird-dog-m-mo-2\" d=\"^8\"/><path id=\"bird-dog-m-mo-3\" d=\"^9\"/><path id=\"bird-dog-m-mo-4\" d=\"^10\"/><path id=\"bird-dog-m-mo-5\" d=\"^11\"/><path id=\"bird-dog-m-mo-6\" d=\"^12\"/><path id=\"bird-dog-m-mo-7\" d=\"^4\"/><path id=\"bird-dog-m-mo-8\" d=\"^5\"/><path id=\"bird-dog-m-mo-9\" d=\"^6\"/><path id=\"bird-dog-m-mo-10\" d=\"^7\"/><path id=\"bird-dog-m-mo-11\" d=\"^0\"/><path id=\"bird-dog-m-mo-12\" d=\"^1\"/><path id=\"bird-dog-m-mo-13\" d=\"^2\"/><path id=\"bird-dog-m-mo-14\" d=\"^3\"/><path id=\"bird-dog-m-mo-15\" d=\"^12\"/><path id=\"bird-dog-m-mo-16\" d=\"^15\"/><path id=\"bird-dog-m-mo-17\" d=\"^16\"/><path id=\"bird-dog-m-mo-18\" d=\"^17\"/><path id=\"bird-dog-m-mo-19\" d=\"^18\"/><path id=\"bird-dog-m-mo-20\" d=\"^20\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#bird-dog-m-dots)\"/>\n  <path class=\"floorline\" d=\"^19\"/><path class=\"eq\" d=\"^20\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bird-dog-m-st-thigh.l\"/><use href=\"#bird-dog-m-st-kneecap.l\"/><use href=\"#bird-dog-m-st-shank.l\"/><use href=\"#bird-dog-m-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#bird-dog-m-st-thigh.l\"/><use href=\"#bird-dog-m-st-kneecap.l\"/><use href=\"#bird-dog-m-st-shank.l\"/><use href=\"#bird-dog-m-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bird-dog-m-st-upper.r\"/><use href=\"#bird-dog-m-st-elbowcap.r\"/><use href=\"#bird-dog-m-st-fore.r\"/><use href=\"#bird-dog-m-st-palm.r\"/></g><g class=\"u-fill\"><use href=\"#bird-dog-m-st-upper.r\"/><use href=\"#bird-dog-m-st-elbowcap.r\"/><use href=\"#bird-dog-m-st-fore.r\"/><use href=\"#bird-dog-m-st-palm.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bird-dog-m-e-thigh.l\"/><use href=\"#bird-dog-m-e-kneecap.l\"/><use href=\"#bird-dog-m-e-shank.l\"/><use href=\"#bird-dog-m-e-foot.l\"/><use href=\"#bird-dog-m-e-shcap.l\"/><use href=\"#bird-dog-m-e-upper.l\"/><use href=\"#bird-dog-m-e-elbowcap.l\"/><use href=\"#bird-dog-m-e-fore.l\"/><use href=\"#bird-dog-m-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#bird-dog-m-e-thigh.l\"/><use href=\"#bird-dog-m-e-kneecap.l\"/><use href=\"#bird-dog-m-e-shank.l\"/><use href=\"#bird-dog-m-e-foot.l\"/><use href=\"#bird-dog-m-e-shcap.l\"/><use href=\"#bird-dog-m-e-upper.l\"/><use href=\"#bird-dog-m-e-elbowcap.l\"/><use href=\"#bird-dog-m-e-fore.l\"/><use href=\"#bird-dog-m-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bird-dog-m-e-head\"/><use href=\"#bird-dog-m-e-torso\"/><use href=\"#bird-dog-m-e-thigh.r\"/><use href=\"#bird-dog-m-e-kneecap.r\"/><use href=\"#bird-dog-m-e-shank.r\"/><use href=\"#bird-dog-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bird-dog-m-e-head\"/><use href=\"#bird-dog-m-e-torso\"/><use href=\"#bird-dog-m-e-thigh.r\"/><use href=\"#bird-dog-m-e-kneecap.r\"/><use href=\"#bird-dog-m-e-shank.r\"/><use href=\"#bird-dog-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bird-dog-m-e-shcap.r\"/><use href=\"#bird-dog-m-e-upper.r\"/><use href=\"#bird-dog-m-e-elbowcap.r\"/><use href=\"#bird-dog-m-e-fore.r\"/><use href=\"#bird-dog-m-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#bird-dog-m-e-shcap.r\"/><use href=\"#bird-dog-m-e-upper.r\"/><use href=\"#bird-dog-m-e-elbowcap.r\"/><use href=\"#bird-dog-m-e-fore.r\"/><use href=\"#bird-dog-m-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"225.35\" cy=\"245.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"274.66\" cy=\"245.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.51\" cy=\"265.11\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.51\" cy=\"330.06\" r=\"2.25\"/></g><mask id=\"bird-dog-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#bird-dog-m-m-head\" fill=\"#000\"/><use href=\"#bird-dog-m-m-torso\" fill=\"#000\"/><use href=\"#bird-dog-m-m-thigh.l\" fill=\"#000\"/><use href=\"#bird-dog-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#bird-dog-m-m-shank.l\" fill=\"#000\"/><use href=\"#bird-dog-m-m-foot.l\" fill=\"#000\"/><use href=\"#bird-dog-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#bird-dog-m-mf-upper.l\" fill=\"#000\"/><use href=\"#bird-dog-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#bird-dog-m-mf-fore.l\" fill=\"#000\"/><use href=\"#bird-dog-m-mf-palm.l\" fill=\"#000\"/><use href=\"#bird-dog-m-m-thigh.r\" fill=\"#000\"/><use href=\"#bird-dog-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#bird-dog-m-mf-shank.r\" fill=\"#000\"/><use href=\"#bird-dog-m-mf-foot.r\" fill=\"#000\"/><use href=\"#bird-dog-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#bird-dog-m-mf-upper.r\" fill=\"#000\"/><use href=\"#bird-dog-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#bird-dog-m-mf-fore.r\" fill=\"#000\"/><use href=\"#bird-dog-m-mf-palm.r\" fill=\"#000\"/><use href=\"#bird-dog-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bird-dog-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#bird-dog-m-mmask)\"><g class=\"u-stroke\"><use href=\"#bird-dog-m-m-head\"/><use href=\"#bird-dog-m-m-torso\"/><use href=\"#bird-dog-m-m-thigh.l\"/><use href=\"#bird-dog-m-m-kneecap.l\"/><use href=\"#bird-dog-m-m-shank.l\"/><use href=\"#bird-dog-m-m-foot.l\"/><use href=\"#bird-dog-m-m-thigh.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~Mwwz1yFK1L0FR2MXi)oLYiwpL0)R1\"/><path class=\"m-arrow\" d=\"~M!U9P.J1L0)H2MYiwpLXi)oL0wS1\"/><path class=\"leader m\" d=\"~MHKA1P*O1L0)Y3\"/><path class=\"leader m\" d=\"~MPEdUEJ1L0IR6\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"bird-dog-m-arch\" data-key=\"arch\" data-cue=\"The low back sags into an arch as the leg rises.\" class=\"plate-callout two m\" style=\"left:41.9%;top:51.96%\" aria-pressed=\"true\">Low back<br>arches</button><button type=\"button\" id=\"bird-dog-m-high\" data-key=\"high\" data-cue=\"The leg lifts higher than the low back can hold.\" class=\"plate-callout m\" style=\"left:5.59%;top:44.69%\" aria-pressed=\"false\">Leg too high</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "under",
        cues: [{ key: "under", cue: "Hands under the shoulders, knees under the hips." }, { key: "flat", cue: "Spine neutral: no sagging or arching as the leg rises." }, { key: "level", cue: "Arm and leg at or near parallel to the floor, hips level." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "arch",
        cues: [{ key: "arch", cue: "The low back sags into an arch as the leg rises." }, { key: "high", cue: "The leg lifts higher than the low back can hold." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Low back arches</b><span>The low back sags into an arch as the leg rises.</span></li><li><b>Leg too high</b><span>The leg lifts higher than the low back can hold.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: reach 3 seconds, hold 3 seconds, return 3 seconds\"><div class=\"tempo-seg move\" style=\"flex:3 1 0\"><i></i><div class=\"tempo-label\"><b>Reach</b><span>3 s</span></div></div><div class=\"tempo-seg\" style=\"flex:3 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>3 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:3 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>3 s</span></div></div></div>",
      alt: "Bird dog, side view. On hands and knees on a mat with the back flat, one arm reaches straight forward and the opposite leg straight back, both level with the floor.",
      mistakeAlt: "Bird Dog: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "palm-flat",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW7: gap-ruled, the palm-flat key's faults cite no claim of this card and its hand zoom has no Wrong; the grip copy carries c2.",
    "orientation": "pronated",
    "handle": "floor",
    "loadAxis": "along-forearm",
    "overBody": false,
    "width": {
      "text": "Hands shoulder-width apart, under the shoulders.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-birddog",
          "bb-birddog"
        ],
        "note": "card c2"
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
        "note": "the palm-flat key's drawn thumb (the card has no grip.thumb)"
      }
    },
    "contact": "palm-flat",
    "wrist": {
      "exempt": "Palm flat on the mat: the wrist sits under the shoulder, no range given.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-birddog",
          "bb-birddog"
        ],
        "note": "card c2"
      }
    },
    "faults": [],
    "gripLine": "Hands under the shoulders, fingers facing forward.",
    "cue": "Hands under shoulders, knees under hips."
  },
  contacts: [
    "floor-body"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Kneel on a mat, knees and feet hip-width apart.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-birddog"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "position",
      "text": "Put a cushion or folded towel under your knees.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-birddog",
          "hl-birddog"
        ],
        "note": "card c22"
      }
    },
    {
      "kind": "grip",
      "text": "Hands on the mat under your shoulders, fingers forward.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-birddog",
          "bb-birddog"
        ],
        "note": "card c2"
      }
    },
    {
      "kind": "position",
      "text": "Knees under your hips. Keep hips and shoulders level.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-birddog",
          "bb-birddog",
          "hl-birddog",
          "mo-birddog"
        ],
        "note": "card c2, c4, c5, c12"
      }
    },
    {
      "kind": "brace",
      "text": "Hold your spine neutral, back flat. Move slowly and keep breathing.",
      "zoom": "back-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-birddog",
          "ggr-birddog",
          "bb-birddog",
          "mo-birddog",
          "hl-birddog"
        ],
        "note": "card c3, c10, c13"
      }
    }
  ],
  posture: [
    {
      "key": "hands",
      "label": "Hands under",
      "detail": "Hands flat under your shoulders, fingers facing forward.",
      "anchor": {
        "pose": "start",
        "at": "wrist.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-birddog",
          "bb-birddog"
        ],
        "note": "card c2"
      }
    },
    {
      "key": "back",
      "label": "Back flat",
      "detail": "Back flat: no sagging or arching.",
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
          "ace-birddog",
          "ggr-birddog"
        ],
        "note": "card c3"
      }
    },
    {
      "key": "height",
      "label": "Limb height",
      "detail": "Raise the limbs only as high as you can hold your low back.",
      "anchor": {
        "pose": "end",
        "at": "ankle.l"
      },
      "zoom": "back-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-birddog",
          "hl-birddog",
          "mo-birddog"
        ],
        "note": "card c7"
      }
    },
    {
      "key": "level",
      "label": "Hips level",
      "detail": "Keep your hips and shoulders level.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-birddog",
          "hl-birddog",
          "bb-birddog",
          "mo-birddog"
        ],
        "note": "card c4, c5, c12"
      }
    },
    {
      "key": "slow",
      "label": "Slow reps",
      "detail": "Move slowly and keep breathing.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-birddog",
          "mo-birddog",
          "hl-birddog",
          "ggr-birddog"
        ],
        "note": "card c10, c13"
      }
    },
    {
      "key": "head",
      "label": "Head in line",
      "detail": "Head in line with your spine, eyes on the floor.",
      "anchor": {
        "pose": "start",
        "at": "head"
      },
      "zoom": "head",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-birddog",
          "ggr-birddog"
        ],
        "note": "card c6"
      }
    },
    {
      "key": "press",
      "label": "Press the floor",
      "detail": "Press the floor with your unmoving hand, knee and toes.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-birddog",
          "hl-birddog",
          "mo-birddog"
        ],
        "note": "card c11, c12"
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
    },
    {
      "key": "head",
      "chip": "Head",
      "heading": "Head",
      "kind": "posture"
    }
  ],
  chips: [
    "back-line",
    "head",
    "feel"
  ],
  copy: {
    "setupLine": "Hands under your shoulders, knees under your hips, back flat. Move slowly and keep breathing.",
    "mistakeLine": "Never let your low back arch as the leg rises. Raise the limbs only that high.",
    "cueLine": "Back flat, eyes on the floor."
  },
  mistakes: [
    {
      "key": "arch",
      "title": "Back arching as leg rises",
      "zoom": "back-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-birddog",
          "mo-birddog",
          "ace-birddog",
          "hl-birddog"
        ],
        "note": "card c8, c7"
      },
      "fix": "Raise the limbs only as high as your low back holds."
    },
    {
      "key": "head",
      "title": "Head lifted to look forward",
      "zoom": "head",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-birddog",
          "ace-birddog"
        ],
        "note": "card c9, c6"
      },
      "fix": "Keep your eyes on the floor, head in line with your spine."
    },
    {
      "key": "hips",
      "title": "Hips tilting or rotating",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-birddog",
          "hl-birddog",
          "mo-birddog"
        ],
        "note": "card c11, c12"
      },
      "fix": "Press down with your unmoving hand, knee and toes. Hips level."
    }
  ],
  risks: [
    {
      "key": "arch",
      "text": "Arching or rounding the back puts increased stress on the lumbar spine.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-birddog",
          "mo-birddog"
        ],
        "note": "card c8"
      }
    },
    {
      "key": "head",
      "text": "Lifting your head to look forward takes your neck out of alignment.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-birddog"
        ],
        "note": "card c9"
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
    "ace-birddog",
    "bb-birddog",
    "ggr-birddog",
    "hl-birddog",
    "mo-birddog",
    "calatayud-2019",
    "hand-key-palm-flat",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/bird_dog.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

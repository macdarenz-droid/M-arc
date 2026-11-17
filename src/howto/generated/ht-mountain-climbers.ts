// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=b8f31342bae9bea881fc6f5656dfa8f4a94b5b5831a7936d3e18d977df668bf8
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_mountain_climbers",
  name: "Mountain Climbers",
  hashes: { inputsSha256: "b8f31342bae9bea881fc6f5656dfa8f4a94b5b5831a7936d3e18d977df668bf8", golden: "f30d6abf2dc7d68a402c6a8e5149399719a86af6f7cfac15216ccfeb74fad56f" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"mountain-climbers-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"mountain-climbers-n-st-thigh.r\" d=\"~#F12FBA1(UK1X(B1x(J1we-6fR1EK2UsAcN4w6!1Sz2GhUx1U6Jp.7woGoWx2Vn_3)4S7Oa)O2!jeS1PfE2Y2VI1X.1Xb)J1(d-H1FI100021000000220200000010000002000210000020010100000001010100020200101000020000000\"/><path id=\"mountain-climbers-n-st-kneecap.r\" d=\"~~W!jWJV1Y_12\"/><path id=\"mountain-climbers-n-st-shank.r\" d=\"~#F12PBlPST1Byn)AT1SfE2eS1xK2NuAcN4y6(1PS2Ru(j!3(eT4HeKeNV2Bl!3*4S7Oa.P2DidR1ye-6TjTb)z1)6ErJ8.pAq00200010120000000000000000000000002000200000001012000000001010000100200010000100\"/><path id=\"mountain-climbers-n-st-foot.r\" d=\"~#o2(H7wTY1--8V!Y1sFh_gwjwF1_mWD1AO3XnBy3X4BT1E9zuzmES1YbxjAp_vXF1Bi001000101000002200001020000000021000011000000000\"/><path id=\"mountain-climbers-n-g0-thigh.r\" d=\"~#F12!Gy1ADO1Iyz1EKK1A5XeO1pIy1!H2WbI5U5.2Pz1z!1NsxjNcKn7By1WtE)1pE6z2VcOH1SD2N1qJ9Rc)s-w1OS1(x1)lWG1c_!110000001110000101200001100000020000000010000100000000010000021000100002101000000\"/><path id=\"mountain-climbers-n-g0-kneecap.r\" d=\"~~WXr!.(1Y_12\"/><path id=\"mountain-climbers-n-g0-shank.r\" d=\"~#F12PTuYF*1.Aw1RN(1YbNatJ1-F2KE1N4AcH2_5PJ2UI1_9YhDdP8FkW1AE2_T1F67(ct.x2ES1qG1JeJ6-3OmXhzw1.nKfVA1)220000002000020010000100002020000002200000000100000200012002000010002200220000100\"/><path id=\"mountain-climbers-n-g0-foot.r\" d=\"~#o2Y_hSRW1Txi)wY1)f!6xcDmX7NK1B.2HH2AU2-X1NN1xmDp*iWE1)B1!lP4GlSy1D3RJ1000012000100020000100010100200000020010000000020\"/><path id=\"mountain-climbers-n-e-thigh.l\" d=\"^0\"/><path id=\"mountain-climbers-n-e-kneecap.l\" d=\"^1\"/><path id=\"mountain-climbers-n-e-shank.l\" d=\"^2\"/><path id=\"mountain-climbers-n-e-foot.l\" d=\"^3\"/><path id=\"mountain-climbers-n-e-shcap.l\" d=\"~~SxU1JNI1w)11\"/><path id=\"mountain-climbers-n-e-upper.l\" d=\"~#F12SxU1JNI1-yU1R)G1kTbe1y3P(1D4.7!1-3S7RS1DdRo0TlBdRoR7RS1.1-3B4.7z3P(1b1jTbElK1*hPx11PtwiPx101020021010000101100100101000010000000010100001110000021010002210100200000000001\"/><path id=\"mountain-climbers-n-e-elbowcap.l\" d=\"~~JSU1_UX1DN10\"/><path id=\"mountain-climbers-n-e-fore.l\" d=\"~#F12FPU1_UX1BUU1xPW1H2KduN2S4w-1U4GcD2)2iGI1w9Xg0Xe)8XgjGI1x2)2V4GcR4w-1vN2E2KdGd7XdWp1Um_dWp01002000101110010102200010000000000000100000020101100100000000010000201010002000\"/><path id=\"mountain-climbers-n-e-palm.l\" d=\"~#o2SwW1YEw2.EU1-U)1HbVcGb)1KkF6BrE5zi1BrA1Kk0GbG6Hb0UK1OvAm0101010101001100000000002001200101010101000000000\"/><path id=\"mountain-climbers-n-e-head\" d=\"~#w12YRy2YSE1)Gy2.NB1OvTgKjIk9EfG7B2F8x9(aKeFlVu(hA1JbX5I7xoWmWnUgWpA4HrXcFuToJ50002000000000010100000000100001210001000000001000000201000210021\"/><path id=\"mountain-climbers-n-e-torso\" d=\"~#_12Uw!1HRE1O(*1KIE1H4OeE1)3Gi_iI4PezfFmP2y8UrIhJ1zv*aBeDcDiwgUn_s!l_sHf!dF2whBgSx1VO1_tRoK2)7X3xcxfFm.8A7D5BjGg*gOs1R5SawjYb-8y7EF2*.201000101000000000002000020200100020000000002000000000000001000100002200220000002000010200111012100000222000001210100\"/><path id=\"mountain-climbers-n-e-thigh.r\" d=\"~#F12_wz1HxT1)Nx1R!R1BdG8z1D1Ax2SS1T2VcO1x6KS1BP1Bcxw1)jIhIx1T7XW1zI1G6l.cpA.1N-1w1G1)9.bRD1YkUl_Y1Sz1wvH.1Nd21000110010000200002000000110001000001000210000000000001102000000001011210101001\"/><path id=\"mountain-climbers-n-e-kneecap.r\" d=\"~~FJO1PD.1Y_12\"/><path id=\"mountain-climbers-n-e-shank.r\" d=\"~#F12JNR1yH-1EIT1KW-1yfD47W1VS2X3F9y9W4F4_X2Y5SgUbUf(1!iG7WW2NfP5.2FbR6ER2Ig6R1WffEdRi)tBlEsK3Gy1Hd20011000002100001012000011000000020200010100000000000002001010110121010020101000\"/><path id=\"mountain-climbers-n-e-foot.r\" d=\"~#o2!Ay1WUX1BUz1).X1Y1Dh_hAiyG1WkHJ1(J3VsXw3K7.S1XaOtTozR1WaOj_qNuVG1zg001000000011110000001110100200001010100000000022\"/><path id=\"mountain-climbers-n-e-shcap.r\" d=\"^8\"/><path id=\"mountain-climbers-n-e-upper.r\" d=\"^9\"/><path id=\"mountain-climbers-n-e-elbowcap.r\" d=\"^10\"/><path id=\"mountain-climbers-n-e-fore.r\" d=\"^11\"/><path id=\"mountain-climbers-n-e-palm.r\" d=\"^12\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#mountain-climbers-n-dots)\"/>\n  <path class=\"datum\" d=\"M316.29 211.51L-22.3 304.81\"/><path class=\"floorline\" d=\"M16 339.5H317.31\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#mountain-climbers-n-st-thigh.r\"/><use href=\"#mountain-climbers-n-st-kneecap.r\"/><use href=\"#mountain-climbers-n-st-shank.r\"/><use href=\"#mountain-climbers-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#mountain-climbers-n-st-thigh.r\"/><use href=\"#mountain-climbers-n-st-kneecap.r\"/><use href=\"#mountain-climbers-n-st-shank.r\"/><use href=\"#mountain-climbers-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#mountain-climbers-n-g0-thigh.r\"/><use href=\"#mountain-climbers-n-g0-kneecap.r\"/><use href=\"#mountain-climbers-n-g0-shank.r\"/><use href=\"#mountain-climbers-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#mountain-climbers-n-g0-thigh.r\"/><use href=\"#mountain-climbers-n-g0-kneecap.r\"/><use href=\"#mountain-climbers-n-g0-shank.r\"/><use href=\"#mountain-climbers-n-g0-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#mountain-climbers-n-e-thigh.l\"/><use href=\"#mountain-climbers-n-e-kneecap.l\"/><use href=\"#mountain-climbers-n-e-shank.l\"/><use href=\"#mountain-climbers-n-e-foot.l\"/><use href=\"#mountain-climbers-n-e-shcap.l\"/><use href=\"#mountain-climbers-n-e-upper.l\"/><use href=\"#mountain-climbers-n-e-elbowcap.l\"/><use href=\"#mountain-climbers-n-e-fore.l\"/><use href=\"#mountain-climbers-n-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#mountain-climbers-n-e-thigh.l\"/><use href=\"#mountain-climbers-n-e-kneecap.l\"/><use href=\"#mountain-climbers-n-e-shank.l\"/><use href=\"#mountain-climbers-n-e-foot.l\"/><use href=\"#mountain-climbers-n-e-shcap.l\"/><use href=\"#mountain-climbers-n-e-upper.l\"/><use href=\"#mountain-climbers-n-e-elbowcap.l\"/><use href=\"#mountain-climbers-n-e-fore.l\"/><use href=\"#mountain-climbers-n-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#mountain-climbers-n-e-head\"/><use href=\"#mountain-climbers-n-e-torso\"/><use href=\"#mountain-climbers-n-e-thigh.r\"/><use href=\"#mountain-climbers-n-e-kneecap.r\"/><use href=\"#mountain-climbers-n-e-shank.r\"/><use href=\"#mountain-climbers-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#mountain-climbers-n-e-head\"/><use href=\"#mountain-climbers-n-e-torso\"/><use href=\"#mountain-climbers-n-e-thigh.r\"/><use href=\"#mountain-climbers-n-e-kneecap.r\"/><use href=\"#mountain-climbers-n-e-shank.r\"/><use href=\"#mountain-climbers-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#mountain-climbers-n-e-shcap.r\"/><use href=\"#mountain-climbers-n-e-upper.r\"/><use href=\"#mountain-climbers-n-e-elbowcap.r\"/><use href=\"#mountain-climbers-n-e-fore.r\"/><use href=\"#mountain-climbers-n-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#mountain-climbers-n-e-shcap.r\"/><use href=\"#mountain-climbers-n-e-upper.r\"/><use href=\"#mountain-climbers-n-e-elbowcap.r\"/><use href=\"#mountain-climbers-n-e-fore.r\"/><use href=\"#mountain-climbers-n-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"276.57\" cy=\"222.46\" r=\"2.25\"/><circle class=\"joint\" cx=\"276.57\" cy=\"284.93\" r=\"2.25\"/><circle class=\"joint\" cx=\"189.91\" cy=\"249.16\" r=\"2.25\"/><circle class=\"joint\" cx=\"252.01\" cy=\"303.12\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#S20JOmPIX1xFmG!W1e7g7e9g7e9ebg7cde9cbcdcbcdcbafadad8dafybS4kK1kK1gR1cR1cR16T16R12T10T15R13T1bR19R1fO1hR1jK1nO1nI1tG1rG100000200101000000000000000200001001010001001100000200022000110000000000000200101010000200200101001010110100100000000000200000000100000001200000000010000001010200000\"/><path class=\"arrow\" d=\"~M(DP1SI!1Lzi_B1L.4Kz2Z\"/></g><path class=\"leader\" d=\"~MSwW1JNI1L0IKb\"/><circle class=\"anchor\" cx=\"276.57\" cy=\"222.46\" r=\"1.5\"/><path class=\"leader\" d=\"M253.4 204.29L204.47 172H194.47\"/><circle class=\"anchor\" cx=\"253.4\" cy=\"204.29\" r=\"1.5\"/><path class=\"leader\" d=\"M252.01 303.12L156.97 236H146.97\"/><circle class=\"anchor\" cx=\"252.01\" cy=\"303.12\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"mountain-climbers-n-hands\" data-key=\"hands\" data-cue=\"Arms straight, hands right under the shoulders.\" class=\"plate-callout two\" style=\"left:65.92%;top:34.64%\" aria-pressed=\"true\">Hands under<br>shoulders</button><button type=\"button\" id=\"mountain-climbers-n-line\" data-key=\"line\" data-cue=\"Keep one straight line from the back of the head to the heels.\" class=\"plate-callout\" style=\"left:26.82%;top:41.9%\" aria-pressed=\"false\">Straight line</button><button type=\"button\" id=\"mountain-climbers-n-knee\" data-key=\"knee\" data-cue=\"Bring one knee toward the chest, then switch legs.\" class=\"plate-callout\" style=\"left:12.29%;top:59.78%\" aria-pressed=\"false\">Knee to chest</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"mountain-climbers-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"mountain-climbers-m-st-thigh.r\" d=\"^0\"/><path id=\"mountain-climbers-m-st-kneecap.r\" d=\"^1\"/><path id=\"mountain-climbers-m-st-shank.r\" d=\"^2\"/><path id=\"mountain-climbers-m-st-foot.r\" d=\"^3\"/><path id=\"mountain-climbers-m-g0-thigh.r\" d=\"^4\"/><path id=\"mountain-climbers-m-g0-kneecap.r\" d=\"^5\"/><path id=\"mountain-climbers-m-g0-shank.r\" d=\"^6\"/><path id=\"mountain-climbers-m-g0-foot.r\" d=\"^7\"/><path id=\"mountain-climbers-m-e-thigh.l\" d=\"^0\"/><path id=\"mountain-climbers-m-e-kneecap.l\" d=\"^1\"/><path id=\"mountain-climbers-m-e-shank.l\" d=\"^2\"/><path id=\"mountain-climbers-m-e-foot.l\" d=\"^3\"/><path id=\"mountain-climbers-m-e-shcap.l\" d=\"^8\"/><path id=\"mountain-climbers-m-e-upper.l\" d=\"^9\"/><path id=\"mountain-climbers-m-e-elbowcap.l\" d=\"^10\"/><path id=\"mountain-climbers-m-e-fore.l\" d=\"^11\"/><path id=\"mountain-climbers-m-e-palm.l\" d=\"^12\"/><path id=\"mountain-climbers-m-e-head\" d=\"^13\"/><path id=\"mountain-climbers-m-e-torso\" d=\"^14\"/><path id=\"mountain-climbers-m-e-thigh.r\" d=\"^15\"/><path id=\"mountain-climbers-m-e-kneecap.r\" d=\"^16\"/><path id=\"mountain-climbers-m-e-shank.r\" d=\"^17\"/><path id=\"mountain-climbers-m-e-foot.r\" d=\"^18\"/><path id=\"mountain-climbers-m-e-shcap.r\" d=\"^8\"/><path id=\"mountain-climbers-m-e-upper.r\" d=\"^9\"/><path id=\"mountain-climbers-m-e-elbowcap.r\" d=\"^10\"/><path id=\"mountain-climbers-m-e-fore.r\" d=\"^11\"/><path id=\"mountain-climbers-m-e-palm.r\" d=\"^12\"/><path id=\"mountain-climbers-m-m-head\" d=\"~#w12DAz2Y_I1XSz2)XG1Ko.p.bRpW4TeE6G4Ya)5(exaAuEmSg!6Uc-1ozp!d_tP7Stx5DrTlSoBp-20100001000000100020000101020000200000000022000011010000000000001\"/><path id=\"mountain-climbers-m-m-torso\" d=\"~#_12W(!1(VG1z.(1IAH1W8Ec6E4On(bV8HcRlDg5J8WvK7HbxtX5)gW5DlS7PrDkwuHmYnNcW6Fl.9FO1Ey1AA1Vd8K8aRcKlDgTa!3wbKg.9GlxrE9T8D8FeFhVa_3XD1EN301000200000000010100100000001010100120012101000000001010021200022000200100001002000002020000001011002002200010020021\"/><path id=\"mountain-climbers-m-m-thigh.l\" d=\"~#F12F_y1(AF1ENA1GzE1PcK9rK1BD2yI1Ycw2D6mw)1xuFy11HnTc!iOs_.1)z1!2T5F5-bRH2yz1oJ1Yez5-5KI1-!14RG1HmOx1_S100000010000000010001010022200000000002000021001001000000000000010100000000020000\"/><path id=\"mountain-climbers-m-m-kneecap.l\" d=\"~~PHkSRS1Y_12\"/><path id=\"mountain-climbers-m-m-shank.l\" d=\"~#F12JFl(.P1Exn.yP1YeE5qJ1XB2!J1_cw2F6mwI2)K1Hk0!dO7Ab.gYO2IB1_2T5J5Xb-I2Px1lI1NcO9KlO7XA12zpPdEkUu20000101000210001100111000000021001002200000000210000020020000000000000100000000\"/><path id=\"mountain-climbers-m-m-foot.l\" d=\"~#o2yG9N!Y1xVaKO-1R2yhUcymPy1NuHfUU3E3*A3W5zT1)2GvIb-V1HfzgAiDA1zA1zq000000000000012001010100000000012002001000010000\"/><path id=\"mountain-climbers-m-m-thigh.r\" d=\"~#F12PHy1_IK1OXw1VFJ1Od*7vH1Wy2HP1)2OcV1x6xU1TN1BdOvRkXgTx1O6BY1GG1E6f*cdw*1PX1w1G1OaRbXB1wmNnDY1SA1WtY.1Nb00000000001000002220011110100000000100000001000000020010000000022000001000000000\"/><path id=\"mountain-climbers-m-m-kneecap.r\" d=\"~~H(N1wyV1Y_12\"/><path id=\"mountain-climbers-m-m-shank.r\" d=\"~#F12HGP1DET1KDS1..S1SfV1gS1BN2Srwc(4(5y2ST2Kr_jS4Afx4Ye*dAW2)hy4-4w8GaOR2HfdR1JeI6zjBc.z1K8KrN7-qAp02100001211100000011010200200100100110000000200021100200000000000200100000010000\"/><path id=\"mountain-climbers-m-m-foot.r\" d=\"~#o2(Ay1WUX1GUz1).X1_1Dh_hyiyG1_kDJ1wK3Ts-w3G7*S1-aOtToBR1YaOjYqNuRG1xg010001000000100200100000000200000100002000002200\"/><path id=\"mountain-climbers-m-mf-shcap.l\" d=\"^8\"/><path id=\"mountain-climbers-m-mf-upper.l\" d=\"^9\"/><path id=\"mountain-climbers-m-mf-elbowcap.l\" d=\"^10\"/><path id=\"mountain-climbers-m-mf-fore.l\" d=\"^11\"/><path id=\"mountain-climbers-m-mf-palm.l\" d=\"^12\"/><path id=\"mountain-climbers-m-mf-shcap.r\" d=\"^8\"/><path id=\"mountain-climbers-m-mf-upper.r\" d=\"^9\"/><path id=\"mountain-climbers-m-mf-elbowcap.r\" d=\"^10\"/><path id=\"mountain-climbers-m-mf-fore.r\" d=\"^11\"/><path id=\"mountain-climbers-m-mf-palm.r\" d=\"^12\"/><path id=\"mountain-climbers-m-mo-0\" d=\"^13\"/><path id=\"mountain-climbers-m-mo-1\" d=\"^14\"/><path id=\"mountain-climbers-m-mo-2\" d=\"^0\"/><path id=\"mountain-climbers-m-mo-3\" d=\"^1\"/><path id=\"mountain-climbers-m-mo-4\" d=\"^2\"/><path id=\"mountain-climbers-m-mo-5\" d=\"^3\"/><path id=\"mountain-climbers-m-mo-6\" d=\"^8\"/><path id=\"mountain-climbers-m-mo-7\" d=\"^9\"/><path id=\"mountain-climbers-m-mo-8\" d=\"^10\"/><path id=\"mountain-climbers-m-mo-9\" d=\"^11\"/><path id=\"mountain-climbers-m-mo-10\" d=\"^12\"/><path id=\"mountain-climbers-m-mo-11\" d=\"^15\"/><path id=\"mountain-climbers-m-mo-12\" d=\"^16\"/><path id=\"mountain-climbers-m-mo-13\" d=\"^17\"/><path id=\"mountain-climbers-m-mo-14\" d=\"^18\"/><path id=\"mountain-climbers-m-mo-15\" d=\"^8\"/><path id=\"mountain-climbers-m-mo-16\" d=\"^9\"/><path id=\"mountain-climbers-m-mo-17\" d=\"^10\"/><path id=\"mountain-climbers-m-mo-18\" d=\"^11\"/><path id=\"mountain-climbers-m-mo-19\" d=\"^12\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#mountain-climbers-m-dots)\"/>\n  <path class=\"datum\" d=\"^19\"/><path class=\"floorline\" d=\"^20\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#mountain-climbers-m-st-thigh.r\"/><use href=\"#mountain-climbers-m-st-kneecap.r\"/><use href=\"#mountain-climbers-m-st-shank.r\"/><use href=\"#mountain-climbers-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#mountain-climbers-m-st-thigh.r\"/><use href=\"#mountain-climbers-m-st-kneecap.r\"/><use href=\"#mountain-climbers-m-st-shank.r\"/><use href=\"#mountain-climbers-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#mountain-climbers-m-g0-thigh.r\"/><use href=\"#mountain-climbers-m-g0-kneecap.r\"/><use href=\"#mountain-climbers-m-g0-shank.r\"/><use href=\"#mountain-climbers-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#mountain-climbers-m-g0-thigh.r\"/><use href=\"#mountain-climbers-m-g0-kneecap.r\"/><use href=\"#mountain-climbers-m-g0-shank.r\"/><use href=\"#mountain-climbers-m-g0-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#mountain-climbers-m-e-thigh.l\"/><use href=\"#mountain-climbers-m-e-kneecap.l\"/><use href=\"#mountain-climbers-m-e-shank.l\"/><use href=\"#mountain-climbers-m-e-foot.l\"/><use href=\"#mountain-climbers-m-e-shcap.l\"/><use href=\"#mountain-climbers-m-e-upper.l\"/><use href=\"#mountain-climbers-m-e-elbowcap.l\"/><use href=\"#mountain-climbers-m-e-fore.l\"/><use href=\"#mountain-climbers-m-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#mountain-climbers-m-e-thigh.l\"/><use href=\"#mountain-climbers-m-e-kneecap.l\"/><use href=\"#mountain-climbers-m-e-shank.l\"/><use href=\"#mountain-climbers-m-e-foot.l\"/><use href=\"#mountain-climbers-m-e-shcap.l\"/><use href=\"#mountain-climbers-m-e-upper.l\"/><use href=\"#mountain-climbers-m-e-elbowcap.l\"/><use href=\"#mountain-climbers-m-e-fore.l\"/><use href=\"#mountain-climbers-m-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#mountain-climbers-m-e-head\"/><use href=\"#mountain-climbers-m-e-torso\"/><use href=\"#mountain-climbers-m-e-thigh.r\"/><use href=\"#mountain-climbers-m-e-kneecap.r\"/><use href=\"#mountain-climbers-m-e-shank.r\"/><use href=\"#mountain-climbers-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#mountain-climbers-m-e-head\"/><use href=\"#mountain-climbers-m-e-torso\"/><use href=\"#mountain-climbers-m-e-thigh.r\"/><use href=\"#mountain-climbers-m-e-kneecap.r\"/><use href=\"#mountain-climbers-m-e-shank.r\"/><use href=\"#mountain-climbers-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#mountain-climbers-m-e-shcap.r\"/><use href=\"#mountain-climbers-m-e-upper.r\"/><use href=\"#mountain-climbers-m-e-elbowcap.r\"/><use href=\"#mountain-climbers-m-e-fore.r\"/><use href=\"#mountain-climbers-m-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#mountain-climbers-m-e-shcap.r\"/><use href=\"#mountain-climbers-m-e-upper.r\"/><use href=\"#mountain-climbers-m-e-elbowcap.r\"/><use href=\"#mountain-climbers-m-e-fore.r\"/><use href=\"#mountain-climbers-m-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"276.57\" cy=\"222.46\" r=\"2.25\"/><circle class=\"joint\" cx=\"276.57\" cy=\"284.93\" r=\"2.25\"/><circle class=\"joint\" cx=\"189.91\" cy=\"249.16\" r=\"2.25\"/><circle class=\"joint\" cx=\"252.01\" cy=\"303.12\" r=\"2.25\"/></g><mask id=\"mountain-climbers-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#mountain-climbers-m-m-head\" fill=\"#000\"/><use href=\"#mountain-climbers-m-m-torso\" fill=\"#000\"/><use href=\"#mountain-climbers-m-m-thigh.l\" fill=\"#000\"/><use href=\"#mountain-climbers-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#mountain-climbers-m-m-shank.l\" fill=\"#000\"/><use href=\"#mountain-climbers-m-m-foot.l\" fill=\"#000\"/><use href=\"#mountain-climbers-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#mountain-climbers-m-mf-upper.l\" fill=\"#000\"/><use href=\"#mountain-climbers-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#mountain-climbers-m-mf-fore.l\" fill=\"#000\"/><use href=\"#mountain-climbers-m-mf-palm.l\" fill=\"#000\"/><use href=\"#mountain-climbers-m-m-thigh.r\" fill=\"#000\"/><use href=\"#mountain-climbers-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#mountain-climbers-m-m-shank.r\" fill=\"#000\"/><use href=\"#mountain-climbers-m-m-foot.r\" fill=\"#000\"/><use href=\"#mountain-climbers-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#mountain-climbers-m-mf-upper.r\" fill=\"#000\"/><use href=\"#mountain-climbers-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#mountain-climbers-m-mf-fore.r\" fill=\"#000\"/><use href=\"#mountain-climbers-m-mf-palm.r\" fill=\"#000\"/><use href=\"#mountain-climbers-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#mountain-climbers-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#mountain-climbers-m-mmask)\"><g class=\"u-stroke\"><use href=\"#mountain-climbers-m-m-head\"/><use href=\"#mountain-climbers-m-m-torso\"/><use href=\"#mountain-climbers-m-m-thigh.l\"/><use href=\"#mountain-climbers-m-m-kneecap.l\"/><use href=\"#mountain-climbers-m-m-shank.l\"/><use href=\"#mountain-climbers-m-m-foot.l\"/><use href=\"#mountain-climbers-m-m-thigh.r\"/><use href=\"#mountain-climbers-m-m-kneecap.r\"/><use href=\"#mountain-climbers-m-m-shank.r\"/><use href=\"#mountain-climbers-m-m-foot.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~M(yB1FVP1L.oTX5M(lFmL*lEmLW6SR1\"/><path class=\"leader m\" d=\"M184.03 192.85L186.19 172H176.19\"/><path class=\"leader m\" d=\"~MUFN1!AE1L0zK3\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"mountain-climbers-m-hike\" data-key=\"hike\" data-cue=\"The hips hike up as the knee drives forward.\" class=\"plate-callout m\" style=\"left:30.73%;top:41.9%\" aria-pressed=\"true\">Hips hike</button><button type=\"button\" id=\"mountain-climbers-m-line\" data-key=\"line\" data-cue=\"Head to heels is no longer one straight line.\" class=\"plate-callout m\" style=\"left:65.92%;top:41.9%\" aria-pressed=\"false\">Line breaks</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "hands",
        cues: [{ key: "hands", cue: "Arms straight, hands right under the shoulders." }, { key: "line", cue: "Keep one straight line from the back of the head to the heels." }, { key: "knee", cue: "Bring one knee toward the chest, then switch legs." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "hike",
        cues: [{ key: "hike", cue: "The hips hike up as the knee drives forward." }, { key: "line", cue: "Head to heels is no longer one straight line." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Hips hike</b><span>The hips hike up as the knee drives forward.</span></li><li><b>Line breaks</b><span>Head to heels is no longer one straight line.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: work 15 seconds, rest 15 seconds\"><div class=\"tempo-seg move\" style=\"flex:15 1 0\"><i></i><div class=\"tempo-label\"><b>Work</b><span>15 s</span></div></div><div class=\"tempo-seg\" style=\"flex:15 1 0\"><i></i><div class=\"tempo-label\"><b>Rest</b><span>15 s</span></div></div></div>",
      alt: "Mountain climbers, side view. High plank on straight arms, hands under the shoulders, body in one line from head to heels. One knee drives forward under the chest while the other leg stays straight back on the toes, hips level.",
      mistakeAlt: "Mountain Climbers: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "palm-flat",
    "orientation": "pronated",
    "handle": "floor",
    "loadAxis": "along-forearm",
    "width": {
      "text": "Hands directly under the shoulders.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hinge-mc"
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
        "note": "the palm-flat key's drawing (the card has no grip.thumb or grip.handContact)"
      }
    },
    "contact": "palm-flat",
    "wrist": {
      "exempt": "Palm flat on the floor: the wrist is bent back under body weight.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "nance-2017"
        ],
        "note": "card c12"
      }
    },
    "pose": {
      "forearmTilt": 0,
      "cup": 0
    },
    "faults": [
      {
        "key": "hand-ahead",
        "label": "Hand ahead",
        "pose": {
          "forearmTilt": 25,
          "cup": 0
        },
        "markers": [],
        "alt": "Hand flat but ahead of the shoulder, forearm leaning back."
      }
    ],
    "gripLine": "Hands flat on the floor, directly under your shoulders. Arms straight.",
    "cue": "Shoulders over wrists."
  },
  contacts: [
    "floor-body"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Start on hands and knees, arms straight, hands under your shoulders.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hinge-mc"
        ],
        "note": "card c2"
      }
    },
    {
      "kind": "position",
      "text": "Step your legs back onto your toes. Body in one straight line.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hinge-mc"
        ],
        "note": "card c3"
      }
    },
    {
      "kind": "position",
      "text": "Bring one foot toward your chest, then switch legs quickly.",
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hinge-mc"
        ],
        "note": "card c4"
      }
    },
    {
      "kind": "position",
      "text": "Keep the plank position the whole time.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hinge-mc"
        ],
        "note": "card c5"
      }
    },
    {
      "kind": "load",
      "text": "Start with 2 to 3 sets of 15 seconds on, 15 off.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "lohre-mc"
        ],
        "note": "card c13"
      }
    }
  ],
  posture: [
    {
      "key": "hands",
      "label": "Hands under shoulders",
      "detail": "Hands under shoulders, arms straight.",
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
          "hinge-mc"
        ],
        "note": "card c2"
      }
    },
    {
      "key": "line",
      "label": "Straight line",
      "detail": "Straight line from head to heels.",
      "anchor": {
        "pose": "start",
        "at": "backMid"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hinge-mc"
        ],
        "note": "card c3"
      }
    },
    {
      "key": "hips",
      "label": "Hips level",
      "detail": "Hips don't hike up.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hinge-mc",
          "hl-mc",
          "lohre-mc"
        ],
        "note": "card c4, c3, c16"
      }
    },
    {
      "key": "stack",
      "label": "Shoulders over wrists",
      "detail": "Shoulders stay over the wrists.",
      "anchor": {
        "pose": "end",
        "at": "shoulder.r"
      },
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hinge-mc",
          "lohre-mc"
        ],
        "note": "card c2, c6, c19"
      }
    }
  ],
  zooms: [
    {
      "key": "hand",
      "chip": "Hands",
      "heading": "Hand position",
      "kind": "hand"
    },
    {
      "key": "hip-line",
      "chip": "Hip line",
      "heading": "Hip line",
      "kind": "posture"
    }
  ],
  chips: [
    "hand",
    "hip-line",
    "feel"
  ],
  copy: {
    "setupLine": "Hands under your shoulders, arms straight. Body in one straight line from head to heels.",
    "mistakeLine": "Keep your hips level as the legs switch. Slow down if they hike.",
    "cueLine": "Hips level, shoulders over wrists."
  },
  mistakes: [
    {
      "key": "hike",
      "title": "Hips hike up",
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hl-mc",
          "lohre-mc"
        ],
        "note": "card c16, c18"
      },
      "fix": "Keep your hips level and slow down."
    },
    {
      "key": "weight-back",
      "title": "Weight shifts back",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hinge-mc"
        ],
        "note": "card c6"
      },
      "fix": "Shoulders over wrists, press slightly forward."
    },
    {
      "key": "bounce",
      "title": "Bouncing on the toes",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hinge-mc"
        ],
        "note": "card c7"
      },
      "fix": "Glide the knees forward with smooth steps."
    }
  ],
  risks: [
    {
      "key": "wrist",
      "text": "Pain on the back of the wrist in the loaded, bent-back position.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "nance-2017"
        ],
        "note": "card c12"
      }
    },
    {
      "key": "bounce",
      "text": "Bouncing on your toes can add impact and make control harder.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hinge-mc"
        ],
        "note": "card c7"
      }
    }
  ],
  riskFlags: [
    "wrist"
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
    "hinge-mc",
    "nance-2017",
    "lohre-mc",
    "hl-mc",
    "nhs-wrist",
    "hand-key-palm-flat",
    "nhs-wrist-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/mountain_climbers.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

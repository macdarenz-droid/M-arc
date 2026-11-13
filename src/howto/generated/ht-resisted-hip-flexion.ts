// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=0ce77dcddab2fda3e53b5ffb2e42ea8e73b5337cd1ab995184778c9384a54ff2
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_resisted_hip_flexion",
  name: "Resisted Hip Flexion",
  hashes: { inputsSha256: "0ce77dcddab2fda3e53b5ffb2e42ea8e73b5337cd1ab995184778c9384a54ff2", golden: "bc6d769a41032b605b0c230786ca4f69333fb156c6185ca3a1ef50f9a2cf2ad2" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"resisted-hip-flexion-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"resisted-hip-flexion-n-st-thigh.r\" d=\"~#F12yWD1DHE1T(D1X.B1H1.bB19*cP*1!7x6U3)2DgXS1(h)iD5Oj)5KpJb*T1V1O4X3B9RjY.1D1a_4*azrKjVv_x1G9Yy1SayK102000001001210010000121000000000020100002210000110101010101010000000220000100100\"/><path id=\"resisted-hip-flexion-n-st-kneecap.r\" d=\"~~wNA1YYT1_J10\"/><path id=\"resisted-hip-flexion-n-st-shank.r\" d=\"~#F12DOA1!FT1.yB1-*R1Y5KaD1e)g_!1H8G5(3-2JjBw2SbGay4EbB2GfJqT*1B1V4*2I9xqN-1E1bJ2Xb)fU6)kWiG7Jk(3Yr11000000000111101000001000000010101010100000000200000000000000200010000000101010\"/><path id=\"resisted-hip-flexion-n-st-foot.r\" d=\"~#o2A*w1Jz(1KTx1OD*1AcD5WiE5(sVjw-2UazI2TgVA1-dVnV3.G1T1x9KeAuT6xq!l210000000010120000000020002002020000001000000001\"/><path id=\"resisted-hip-flexion-n-g0-thigh.r\" d=\"~#F12w!B1DVF1IFB1EHE1X5Kaz1cWo_-1(2K9D1T4Xf-S1Y3-p*6)iKjIhRkxR1*3X2E8G5AiA!1D1fG2RbGx1fV6(K1Jc_x1Py1_u00000001000000111110102000200000022002002000000020001100010020012000002000011100\"/><path id=\"resisted-hip-flexion-n-g0-kneecap.r\" d=\"~~N*H1HIT1_J10\"/><path id=\"resisted-hip-flexion-n-g0-shank.r\" d=\"~#F12A*H1SwT1VII1KTR1P4zbD1aX9N(1U7I6S3z3_bxy2FaRbY2Tb*3)eyjGw2X1K4)3)8EjA!1B19s.bzfJ8Riwl)4AlD7yr02100010100000000002000000000000200120000020000220002001010000000000200002000010\"/><path id=\"resisted-hip-flexion-n-g0-foot.r\" d=\"~#o2NWF1HA(1EIG1GD*1NcP4Hiz6(rBlN-2w6.I2VcKB1*b-nK2.G1g-9*dYtz8.oAn000020020012101110011110100020000001011000002100\"/><path id=\"resisted-hip-flexion-n-g1-thigh.r\" d=\"~#F12HxD1yYG1TYA1BwG1VaE5ly1HV1Ax1*2K9T1K4zH1Tw1XbEnOgTb*px3)J1Is-40-9cJR1_D1mx1R8B8Rr_i(kJG1JtUkAN1P501101000001010210120000001002000000000021000000000010101000000020020000200002000\"/><path id=\"resisted-hip-flexion-n-g1-kneecap.r\" d=\"~~UxP1w_N1_J10\"/><path id=\"resisted-hip-flexion-n-g1-shank.r\" d=\"~#F12JwP1SUN1TGP1xDK1F3RbD16O2y)1!6x7D3T3y4*y2!8XcH1-bT5KePbxy2G2E4)4O8zcw(1E15d.bzeya)fwnO2SlHayq10002000000101022000000000000110020000000000100000000001011012011100200000200010\"/><path id=\"resisted-hip-flexion-n-g1-foot.r\" d=\"~#o2_BO1F!-1x-O1B*Y1Wc!3(hz7_qTmU-2J1KJ2V8*B1)9*nE1-G1W2RaKdJtT9VnJo000000011000000110000000000000101001000200000000\"/><path id=\"resisted-hip-flexion-n-e-thigh.l\" d=\"~#F12YWA1(XE1GTA1.FD1-1XbE11w3_(1y6-7Y2*3(2xV1Sc*m6BkBcznx2zV1X2*3*5.7*3U(1F12!1XbxvxcGmWF17(z1SlyG100101011000020000000110000010000000000000210001200000100000200000000002000000020\"/><path id=\"resisted-hip-flexion-n-e-kneecap.l\" d=\"~~STB1SwU1_J10\"/><path id=\"resisted-hip-flexion-n-e-shank.l\" d=\"~#F12DSB1A!T1K_B1OKS1(2ObF12B1A)1Y6B7y3V3W2xz2S8.cA1.b)5EeDaIy2K2z4z5K8.aF(1E15l.b.dNaOfHnz2Sl!a!p01020001010000000200001111111010021000000100000000000001000002000200000010000001\"/><path id=\"resisted-hip-flexion-n-e-foot.l\" d=\"~#o2y(A1AB)1VOB1zB(1_cF3Uhx8Up)nS-2B3-J2-4ID1)7xo2OG1Y4Eb-cYsBbGmSp120002012120000110001000101200002101101000010110\"/><path id=\"resisted-hip-flexion-n-e-shcap.l\" d=\"~~STB1SFqwP10\"/><path id=\"resisted-hip-flexion-n-e-upper.l\" d=\"~#F12AUB1DxqO_B1z(oY1V8c2)4HO1w4I5(1V2UbxB1YcxhS2Bgx7xk8*D1vx3B2K6V9WN193u-8-fR3RhynI3FmS9Hr00021002200000100000200000110000000000010100000100010100010000000010010020000121\"/><path id=\"resisted-hip-flexion-n-e-elbowcap.l\" d=\"~~USA1HNz1Dz10\"/><path id=\"resisted-hip-flexion-n-e-fore.l\" d=\"~#F12NRA1WTz1GPA1RXy18IauW1_9PH1D2-9F1O2K4Vw1w5TdV1zbV8TbB5Rw1)1x2-4V8!2NI1f(1B3.9xaF1O7(kN2yhHd_h21200200101000000000121101200010100100210100000000000000000000000020021000002101\"/><path id=\"resisted-hip-flexion-n-e-fist.l\" d=\"~~SzD1YzK1ww10\"/><path id=\"resisted-hip-flexion-n-e-head\" d=\"~#w12SzE1SFgIPB1*(fBjAjBjW9BbE3E3_4X4)7x8BbRhKm_4XcT1T9Bj0NmBbJmK6YkF3Fj(fT1Fj2021000002010001012000101000200020200100202000010010000001000000\"/><path id=\"resisted-hip-flexion-n-e-torso\" d=\"~#_12STB1Swlz*B1BSjV9I6z30S9UhU9J6_cwgJ60K6)nIm)7Xc_4(f-4_kK6Nm*fShTh_4T9)7*fBrEz1BbBrK60T90!cwgA3w8Xc)7)fw8K6_kN6J6_cBbD3w8ET2ww100100200220002002000001000100000202000000000200002000000000220010000000000100000000000002000200000010021011010000000\"/><path id=\"resisted-hip-flexion-n-e-thigh.r\" d=\"~#F12SzE1JBH1OUB1zGH1-bY12H1W(1K3.7x6.3V2zV1R2xnGczk0xnHczV1S2.3W2.7y6W(1J32B1-b-1XbDv_F1(lwA10_F1*l20101102201010000100200000000000000001010121010000101020001210200000000000000000\"/><path id=\"resisted-hip-flexion-n-e-kneecap.r\" d=\"~~Y(R1SYE1_J10\"/><path id=\"resisted-hip-flexion-n-e-shank.r\" d=\"~#F12D*R1SYE1*wS1GGD1_1.bD12(4w)1(5*7_2.3-3xz2H7Rd2)bI7RdY3xz2X2.3*5*7.4w)1E12-1.b.cWbBdYo0UlFdYo00011002000020000100000110000200001200000100000120000000020001001000200000000000\"/><path id=\"resisted-hip-flexion-n-e-foot.r\" d=\"~#o2YNS1((S1GwT1*(R1YcF3Uhx8Sp)nU-2B3-J2-4ID1)7)n2TG1Y4Bb-c_sBbKmSp020002010110102101000020000220000101000000010100\"/><path id=\"resisted-hip-flexion-n-e-shcap.r\" d=\"^16\"/><path id=\"resisted-hip-flexion-n-e-upper.r\" d=\"~#F12yKD1D(o.JE1KNoy8V368XF1HoY62F35JA1XcFl4SeX7!bVh(u*m(1T2Y3R5*H1wk55W7T4O6.e*s3.jPaBgAo01200220000010000001101000000000010001010000020001111012100000200000000000000000\"/><path id=\"resisted-hip-flexion-n-e-elbowcap.r\" d=\"~~y.tFTuDz10\"/><path id=\"resisted-hip-flexion-n-e-fore.r\" d=\"~#F12S.t!DuXEuTKty5x94y2Gb_G1S6O7F2V1JbVuYaX9_3OaB2IeSa)unX25.9.hPE1E1N1Y1zaI9V3Rg!eV5FgF3(l00000002001010200210010111000002000100010001000200001120000200200010110020011100\"/><path id=\"resisted-hip-flexion-n-e-fist.r\" d=\"~~YVqSYE1ww10\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#resisted-hip-flexion-n-dots)\"/>\n  <path class=\"floorline\" d=\"M51.4 339.5H329.34\"/><path class=\"eq\" d=\"~MNzkPwy2L0OT.1Q0E6E6FK.1L*qF6QE60(qF6LF6FK.1Q0F6F6EK.1L(qE6QF60*qE6Z\"/><path class=\"eq\" d=\"~MSJsPwy2L0OT.1Q0E6E6FK.1L*qF6QE60(qF6LF6FK.1Q0F6F6EK.1L(qE6QF60*qE6Z\"/><path class=\"eq\" d=\"~Mw!iU*7LHH90QF60xA9E6LE6zA1Q0E6E6AA1LxA9F6QE60yA9F6LF6AA1Q0F6F6zA1Z\"/><path class=\"eq\" d=\"~MABhYDy2LyYc0QF60-RcE6LE6B3Q0E6E6D3L-RcF6QE60_RcF6LF6D3Q0F6F6B3Z\"/><path class=\"eq\" d=\"~M_SkYDy2LW!50QF60KW5E6LE6zA1Q0E6E6AA1LKW5F6QE60NW5F6LF6AA1Q0F6F6zA1Z\"/><path class=\"eq-thin\" d=\"~M_Ul!Ow2L0VKl\"/><path class=\"eq-thin\" d=\"~MPKp!Ow2L0VKl\"/><path class=\"eq\" d=\"~MSJkHI-1LDG60LBG6SA7LBG6RA7Z\"/><path class=\"eq-thin\" d=\"M104.41 326.57H136.6M104.41 322.91H136.6M104.41 319.25H136.6M104.41 315.59H136.6M104.41 311.94H136.6M104.41 308.28H136.6M104.41 304.62H136.6M104.41 300.97H136.6M104.41 297.31H136.6\"/><path class=\"eq-solid\" d=\"~~NzrHI)1AG12\"/><path class=\"eq-pin\" d=\"~~HDsHI)1F60\"/><path class=\"eq\" d=\"~~DRmy-8ww10\"/><path class=\"eq-pin\" d=\"~~(Hny-8F60\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#resisted-hip-flexion-n-st-thigh.r\"/><use href=\"#resisted-hip-flexion-n-st-kneecap.r\"/><use href=\"#resisted-hip-flexion-n-st-shank.r\"/><use href=\"#resisted-hip-flexion-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#resisted-hip-flexion-n-st-thigh.r\"/><use href=\"#resisted-hip-flexion-n-st-kneecap.r\"/><use href=\"#resisted-hip-flexion-n-st-shank.r\"/><use href=\"#resisted-hip-flexion-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#resisted-hip-flexion-n-g0-thigh.r\"/><use href=\"#resisted-hip-flexion-n-g0-kneecap.r\"/><use href=\"#resisted-hip-flexion-n-g0-shank.r\"/><use href=\"#resisted-hip-flexion-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#resisted-hip-flexion-n-g0-thigh.r\"/><use href=\"#resisted-hip-flexion-n-g0-kneecap.r\"/><use href=\"#resisted-hip-flexion-n-g0-shank.r\"/><use href=\"#resisted-hip-flexion-n-g0-foot.r\"/></g></g><path class=\"eq\" d=\"~MD-F1NP!1LSS2SjLGx3WH1L.z2-R2Z\"/><path class=\"eq-solid\" d=\"~MYWF1Uy*1LxoV5LYhJw1LHu)kZ\"/><path class=\"eq-solid\" d=\"~MF)E1Y_!1L)4bL4S1LkN1Lw1D1LJ1qLN1cLU15LN1fLD1z1LsE1Z\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#resisted-hip-flexion-n-g1-thigh.r\"/><use href=\"#resisted-hip-flexion-n-g1-kneecap.r\"/><use href=\"#resisted-hip-flexion-n-g1-shank.r\"/><use href=\"#resisted-hip-flexion-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#resisted-hip-flexion-n-g1-thigh.r\"/><use href=\"#resisted-hip-flexion-n-g1-kneecap.r\"/><use href=\"#resisted-hip-flexion-n-g1-shank.r\"/><use href=\"#resisted-hip-flexion-n-g1-foot.r\"/></g></g><path class=\"eq\" d=\"~MDwO1FHY1LFU2!9LV.2WV1L-J2KG2Z\"/><path class=\"eq-solid\" d=\"~M!)N1U!Y1LRo.2LJlAuLYrIoZ\"/><path class=\"eq-solid\" d=\"~MUEN1PXY1L)46LaS1LoJ1LA1w1LP1mLP16LS17LH1rLA1x1LkO1Z\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MSJkyyx1LDG60LBG6AG4LBG6zG4Z\"/><path class=\"eq-thin\" d=\"M104.41 187.57H136.6M104.41 183.92H136.6M104.41 180.26H136.6M104.41 176.6H136.6M104.41 172.94H136.6\"/><path class=\"eq-cable\" d=\"~MNzrHI)1L0ESW1MES3ww1L0wGn\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#resisted-hip-flexion-n-e-thigh.l\"/><use href=\"#resisted-hip-flexion-n-e-kneecap.l\"/><use href=\"#resisted-hip-flexion-n-e-shank.l\"/><use href=\"#resisted-hip-flexion-n-e-foot.l\"/><use href=\"#resisted-hip-flexion-n-e-shcap.l\"/><use href=\"#resisted-hip-flexion-n-e-upper.l\"/><use href=\"#resisted-hip-flexion-n-e-elbowcap.l\"/><use href=\"#resisted-hip-flexion-n-e-fore.l\"/><use href=\"#resisted-hip-flexion-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#resisted-hip-flexion-n-e-thigh.l\"/><use href=\"#resisted-hip-flexion-n-e-kneecap.l\"/><use href=\"#resisted-hip-flexion-n-e-shank.l\"/><use href=\"#resisted-hip-flexion-n-e-foot.l\"/><use href=\"#resisted-hip-flexion-n-e-shcap.l\"/><use href=\"#resisted-hip-flexion-n-e-upper.l\"/><use href=\"#resisted-hip-flexion-n-e-elbowcap.l\"/><use href=\"#resisted-hip-flexion-n-e-fore.l\"/><use href=\"#resisted-hip-flexion-n-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"~MH_P1!OS1LXxlPXb\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#resisted-hip-flexion-n-e-head\"/><use href=\"#resisted-hip-flexion-n-e-torso\"/><use href=\"#resisted-hip-flexion-n-e-thigh.r\"/><use href=\"#resisted-hip-flexion-n-e-kneecap.r\"/><use href=\"#resisted-hip-flexion-n-e-shank.r\"/><use href=\"#resisted-hip-flexion-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#resisted-hip-flexion-n-e-head\"/><use href=\"#resisted-hip-flexion-n-e-torso\"/><use href=\"#resisted-hip-flexion-n-e-thigh.r\"/><use href=\"#resisted-hip-flexion-n-e-kneecap.r\"/><use href=\"#resisted-hip-flexion-n-e-shank.r\"/><use href=\"#resisted-hip-flexion-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#resisted-hip-flexion-n-e-shcap.r\"/><use href=\"#resisted-hip-flexion-n-e-upper.r\"/><use href=\"#resisted-hip-flexion-n-e-elbowcap.r\"/><use href=\"#resisted-hip-flexion-n-e-fore.r\"/><use href=\"#resisted-hip-flexion-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#resisted-hip-flexion-n-e-shcap.r\"/><use href=\"#resisted-hip-flexion-n-e-upper.r\"/><use href=\"#resisted-hip-flexion-n-e-elbowcap.r\"/><use href=\"#resisted-hip-flexion-n-e-fore.r\"/><use href=\"#resisted-hip-flexion-n-e-fist.r\"/></g></g><path class=\"eq\" d=\"~MAxS1!OR1L!U20L.U2ww2L.U2))1Z\"/><path class=\"eq-solid\" d=\"~MwzS1DyS1LVo0LWoJrLWoIrZ\"/><path class=\"eq-solid\" d=\"~MHHR1!)R1L)4oLiS1LsD1LH1w1LP1eLP10LP1fLH1rLsG1LiK1Z\"/><path class=\"eq-line m-line\" d=\"~MyWD1DHE1LR8NN1LH1.bLB19L*cP*1L!7x6LU4xc\"/><path class=\"eq-line m-line\" d=\"~MWDE1!(T1LUw1*H2LgO9LX3B9LRjY.1LD1aL_4*aLzrKjLVv_x1LG9Yy1LYbWI1\"/><path class=\"eq-line m-line\" d=\"~MDOA1!FT1LVjyI1LY5KaLD1eL)g_!1LH8G5LAaBx1\"/><path class=\"eq-line m-line\" d=\"~Mw.y1yY(1L(qVR1LSd*vL*2I9LxqN-1LE1bLJ2XbLxdJF1\"/><path class=\"eq-line m-line\" d=\"~MWRA1HDT1LE1F1\"/><path class=\"eq-line m-line\" d=\"~MA*w1Jz(1LGm!sLAcD5LWiE5L(sVjLw-2UaLzI2TgLVA1-dLVnV3L.G1T1Lx9KeLUz18\"/><path class=\"eq-line m-line\" d=\"~MUwx1HA(1LX1f\"/><path class=\"eq-line m-line\" d=\"~MNFx1YN!1LYO2wtLTB3DvL.-1E-2LUB3xv\"/><path class=\"eq-line m-line\" d=\"~M!zx1Sw*1LBnK8L_dDy1LSw1GhL-dBy1\"/><path class=\"eq-line m-line\" d=\"~MPKw1(V!1L*4tL0S1LcP1LsF1LH1w1LJ1iLU12LP1fLH1pLuE1LS6Rw1\"/><circle class=\"joint\" cx=\"200.25\" cy=\"134.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"158.44\" cy=\"156.68\" r=\"2.25\"/><circle class=\"joint\" cx=\"200.25\" cy=\"203.61\" r=\"2.25\"/><circle class=\"joint\" cx=\"262.97\" cy=\"203.61\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#H20W.E1AAU1ONE1RzU12h1h0h1h1j1f5h1j5f3f2f3h9f7d7h9f9f9d9dddbdbdb9fdbbf9c9f7f9d7h9h5d5j5f7h10101001010000000010100001200010120000222001010012000020200002001000000000222000010000020002200000100210000012000000020200000001200020000100001000001\"/><path class=\"arrow\" d=\"~MYJT1yKG1LUaSF1LIO1EP1Z\"/></g><path class=\"leader\" d=\"~MSzE1SFgL0RY3\"/><circle class=\"anchor\" cx=\"200.25\" cy=\"83.29\" r=\"1.5\"/><path class=\"leader\" d=\"M251.68 194.99L291 182H301\"/><circle class=\"anchor\" cx=\"251.68\" cy=\"194.99\" r=\"1.5\"/><path class=\"leader\" d=\"M185.4 189.53L221 150H231\"/><circle class=\"anchor\" cx=\"185.4\" cy=\"189.53\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"resisted-hip-flexion-n-tall\" data-key=\"tall\" data-cue=\"Stand tall with the core braced and the standing leg steady.\" class=\"plate-callout two\" style=\"left:48.04%;top:6.7%\" aria-pressed=\"true\">Stand<br>tall</button><button type=\"button\" id=\"resisted-hip-flexion-n-thigh\" data-key=\"thigh\" data-cue=\"Drive the knee up and forward until the thigh is about parallel.\" class=\"plate-callout two\" style=\"left:82.68%;top:44.69%\" aria-pressed=\"false\">Thigh<br>to hip</button><button type=\"button\" id=\"resisted-hip-flexion-n-back\" data-key=\"back\" data-cue=\"Keep the core tight and do not lean back to lift higher.\" class=\"plate-callout two\" style=\"left:63.13%;top:35.75%\" aria-pressed=\"false\">No back<br>arch</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"resisted-hip-flexion-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"resisted-hip-flexion-m-st-thigh.r\" d=\"^0\"/><path id=\"resisted-hip-flexion-m-st-kneecap.r\" d=\"^1\"/><path id=\"resisted-hip-flexion-m-st-shank.r\" d=\"^2\"/><path id=\"resisted-hip-flexion-m-st-foot.r\" d=\"^3\"/><path id=\"resisted-hip-flexion-m-g0-thigh.r\" d=\"^4\"/><path id=\"resisted-hip-flexion-m-g0-kneecap.r\" d=\"^5\"/><path id=\"resisted-hip-flexion-m-g0-shank.r\" d=\"^6\"/><path id=\"resisted-hip-flexion-m-g0-foot.r\" d=\"^7\"/><path id=\"resisted-hip-flexion-m-g1-thigh.r\" d=\"^8\"/><path id=\"resisted-hip-flexion-m-g1-kneecap.r\" d=\"^9\"/><path id=\"resisted-hip-flexion-m-g1-shank.r\" d=\"^10\"/><path id=\"resisted-hip-flexion-m-g1-foot.r\" d=\"^11\"/><path id=\"resisted-hip-flexion-m-e-thigh.l\" d=\"^12\"/><path id=\"resisted-hip-flexion-m-e-kneecap.l\" d=\"^13\"/><path id=\"resisted-hip-flexion-m-e-shank.l\" d=\"^14\"/><path id=\"resisted-hip-flexion-m-e-foot.l\" d=\"^15\"/><path id=\"resisted-hip-flexion-m-e-shcap.l\" d=\"^16\"/><path id=\"resisted-hip-flexion-m-e-upper.l\" d=\"^17\"/><path id=\"resisted-hip-flexion-m-e-elbowcap.l\" d=\"^18\"/><path id=\"resisted-hip-flexion-m-e-fore.l\" d=\"^19\"/><path id=\"resisted-hip-flexion-m-e-fist.l\" d=\"^20\"/><path id=\"resisted-hip-flexion-m-e-head\" d=\"^21\"/><path id=\"resisted-hip-flexion-m-e-torso\" d=\"^22\"/><path id=\"resisted-hip-flexion-m-e-thigh.r\" d=\"^23\"/><path id=\"resisted-hip-flexion-m-e-kneecap.r\" d=\"^24\"/><path id=\"resisted-hip-flexion-m-e-shank.r\" d=\"^25\"/><path id=\"resisted-hip-flexion-m-e-foot.r\" d=\"^26\"/><path id=\"resisted-hip-flexion-m-e-shcap.r\" d=\"^16\"/><path id=\"resisted-hip-flexion-m-e-upper.r\" d=\"^27\"/><path id=\"resisted-hip-flexion-m-e-elbowcap.r\" d=\"^28\"/><path id=\"resisted-hip-flexion-m-e-fore.r\" d=\"^29\"/><path id=\"resisted-hip-flexion-m-e-fist.r\" d=\"^30\"/><path id=\"resisted-hip-flexion-m-m-head\" d=\"~#w12PzA1_HgKOy1xJgXe_m-gHdTbpz2N5I6.6zaG9.lBiw2RdO3x9-iw4SjTfSk.aylE1AmWbJ2Aj0000000101100000020000000002000000200000001002020000200002001202\"/><path id=\"resisted-hip-flexion-m-m-torso\" d=\"~#_12AUz1PGl.Tz1z_jVaE4B3kAdFfWaH4_f(c!7I2*fKmEvB4GcP5ygX4YkI6Nm)fShTh_4T9)7)fBrzz1EbErR7XbIrV8HiPA1_4A7Bez5)dDb*1UlU7(4DaRdY4y7VH2WP120200000000020001010100100110010000001020010001010100100001000101210010000011110110000000200000000200002000101000200\"/><path id=\"resisted-hip-flexion-m-m-shcap.l\" d=\"~~wWA1_zqwP10\"/><path id=\"resisted-hip-flexion-m-m-upper.l\" d=\"~#F12SWA1N!p*!A1G-oY1X8c0)4NO1w4K5(1V2UbzB1Yc*gS2Ggx7)j8.D1vB3B2I6V9WN191u.8-fT3RhDnI3AmS9Jr00001000200002100001210100100001010200000001010000000000000000000110000021000020\"/><path id=\"resisted-hip-flexion-m-m-elbowcap.l\" d=\"~~AVz1SGz1Dz10\"/><path id=\"resisted-hip-flexion-m-m-fore.l\" d=\"~#F12!Tz1(Nz1XSz1XSy18Oau_1_9JH1D2V9F1T2K4Tw1w5TdV1zbV8TbB5Rw1)1)1-4-8!2PI1fw2B3)9xaJ1O7!kN2whHd!h20210000121000000201001002200010100002200000020101000000020000000020001100002202\"/><path id=\"resisted-hip-flexion-m-m-fist.l\" d=\"~~wDB1w)J1ww10\"/><path id=\"resisted-hip-flexion-m-m-shcap.r\" d=\"^75\"/><path id=\"resisted-hip-flexion-m-m-upper.r\" d=\"~#F12APB1A-oxPD1-Goy8T348)F1WnY62F30PA1BcFlcUeK7ycRhHvIm!1V2!3O5BI1Nj39W7K4B6)e)sj)jHaOg_n00000000000000210000020220000000101001200011012001000000210000000000000000000120\"/><path id=\"resisted-hip-flexion-m-m-elbowcap.r\" d=\"~~(.sNHuDz10\"/><path id=\"resisted-hip-flexion-m-m-fore.r\" d=\"~#F12J.sYxu.AtKEty4K9c(1.6YH1W5B8A2.1A8RvU9.aW2.aT3)dF7.vvT2G1.9OdAG1E1U1qGa-9X2-eSgz4WgW5Sl00000020000110010100000010110000020020000100011110000000100101001101011100000000\"/><path id=\"resisted-hip-flexion-m-m-fist.r\" d=\"^30\"/><path id=\"resisted-hip-flexion-m-mf-thigh.l\" d=\"~#F12SWB1AXE1xVB1)ED1G1XbB13c!(1J6T7(2V3A5xV1NdEmuEkzbRn0BV1R2x4R5z8O6P(1D10N2TbRuEd*nWE1X1(z1!j!G120101020000200210000000101121001002101000000000001000101000002020011110000100000\"/><path id=\"resisted-hip-flexion-m-mf-kneecap.l\" d=\"~~NzD1JyU1_J10\"/><path id=\"resisted-hip-flexion-m-mf-shank.l\" d=\"~#F12FyD1A!T1IJD1.KS1J3KbF16V3y)1(6)6H3O3H5.y2A9RcU1-bK5Oe!c.x2E2E4.4R8GdU*1E115)bGe_9KgYm*2NlY9Hq00000000220200101200020200002002000200200200120000000102000001000002000111001011\"/><path id=\"resisted-hip-flexion-m-mf-foot.l\" d=\"^15\"/><path id=\"resisted-hip-flexion-m-mf-thigh.r\" d=\"~#F12HzF1UEH1GUD1IIH1Vb_11F1Y(1O3-7*5*3X2BV1R2*mGcEk1*mJcBV1S2*3Y2-7(5Y(1P31E1Vb-1.bDv(F1(l!z11(F1.l02000000000020200000100101000000000200000012000020200000000000001000200100220010\"/><path id=\"resisted-hip-flexion-m-mf-kneecap.r\" d=\"~~P(S1!_E1_J10\"/><path id=\"resisted-hip-flexion-m-mf-shank.r\" d=\"~#F12!!S1!_E1TwT1VID1_1XbF10!4((1(5-7Y2)3X3*y2J7Td1)bG7Td_3*y2-2)3*5-7*4((1B10-1Xb-cUbEdWo0YlDdWo01000200000000120001000000002000000000200010110002100000002200010000000000100020\"/><path id=\"resisted-hip-flexion-m-mf-foot.r\" d=\"~#o2PNT1FxT1zwU1ExS1!cD3Ph)7Wp*nS-2E3-J2-4ID1)7)n0TG1_4Bb-c_sBbKmUp000020100200000011010000001000100010101012121010\"/><path id=\"resisted-hip-flexion-m-mo-0\" d=\"^21\"/><path id=\"resisted-hip-flexion-m-mo-1\" d=\"^22\"/><path id=\"resisted-hip-flexion-m-mo-2\" d=\"^12\"/><path id=\"resisted-hip-flexion-m-mo-3\" d=\"^13\"/><path id=\"resisted-hip-flexion-m-mo-4\" d=\"^14\"/><path id=\"resisted-hip-flexion-m-mo-5\" d=\"^15\"/><path id=\"resisted-hip-flexion-m-mo-6\" d=\"^16\"/><path id=\"resisted-hip-flexion-m-mo-7\" d=\"^17\"/><path id=\"resisted-hip-flexion-m-mo-8\" d=\"^18\"/><path id=\"resisted-hip-flexion-m-mo-9\" d=\"^19\"/><path id=\"resisted-hip-flexion-m-mo-10\" d=\"^20\"/><path id=\"resisted-hip-flexion-m-mo-11\" d=\"^23\"/><path id=\"resisted-hip-flexion-m-mo-12\" d=\"^24\"/><path id=\"resisted-hip-flexion-m-mo-13\" d=\"^25\"/><path id=\"resisted-hip-flexion-m-mo-14\" d=\"^26\"/><path id=\"resisted-hip-flexion-m-mo-15\" d=\"^16\"/><path id=\"resisted-hip-flexion-m-mo-16\" d=\"^27\"/><path id=\"resisted-hip-flexion-m-mo-17\" d=\"^28\"/><path id=\"resisted-hip-flexion-m-mo-18\" d=\"^29\"/><path id=\"resisted-hip-flexion-m-mo-19\" d=\"^30\"/><path id=\"resisted-hip-flexion-m-mo-20\" d=\"^32\"/><path id=\"resisted-hip-flexion-m-mo-21\" d=\"^33\"/><path id=\"resisted-hip-flexion-m-mo-22\" d=\"^34\"/><path id=\"resisted-hip-flexion-m-mo-23\" d=\"^35\"/><path id=\"resisted-hip-flexion-m-mo-24\" d=\"^36\"/><path id=\"resisted-hip-flexion-m-mo-25\" d=\"^39\"/><path id=\"resisted-hip-flexion-m-mo-26\" d=\"^51\"/><path id=\"resisted-hip-flexion-m-mo-27\" d=\"^41\"/><path id=\"resisted-hip-flexion-m-mo-28\" d=\"^42\"/><path id=\"resisted-hip-flexion-m-mo-29\" d=\"^43\"/><path id=\"resisted-hip-flexion-m-mo-30\" d=\"^44\"/><path id=\"resisted-hip-flexion-m-mo-31\" d=\"^55\"/><path id=\"resisted-hip-flexion-m-mo-32\" d=\"^56\"/><path id=\"resisted-hip-flexion-m-mo-33\" d=\"^57\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#resisted-hip-flexion-m-dots)\"/>\n  <path class=\"floorline\" d=\"^31\"/><path class=\"eq\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq-thin\" d=\"^37\"/><path class=\"eq-thin\" d=\"^38\"/><path class=\"eq\" d=\"^39\"/><path class=\"eq-thin\" d=\"^40\"/><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq-pin\" d=\"^42\"/><path class=\"eq\" d=\"^43\"/><path class=\"eq-pin\" d=\"^44\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#resisted-hip-flexion-m-st-thigh.r\"/><use href=\"#resisted-hip-flexion-m-st-kneecap.r\"/><use href=\"#resisted-hip-flexion-m-st-shank.r\"/><use href=\"#resisted-hip-flexion-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#resisted-hip-flexion-m-st-thigh.r\"/><use href=\"#resisted-hip-flexion-m-st-kneecap.r\"/><use href=\"#resisted-hip-flexion-m-st-shank.r\"/><use href=\"#resisted-hip-flexion-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#resisted-hip-flexion-m-g0-thigh.r\"/><use href=\"#resisted-hip-flexion-m-g0-kneecap.r\"/><use href=\"#resisted-hip-flexion-m-g0-shank.r\"/><use href=\"#resisted-hip-flexion-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#resisted-hip-flexion-m-g0-thigh.r\"/><use href=\"#resisted-hip-flexion-m-g0-kneecap.r\"/><use href=\"#resisted-hip-flexion-m-g0-shank.r\"/><use href=\"#resisted-hip-flexion-m-g0-foot.r\"/></g></g><path class=\"eq\" d=\"^45\"/><path class=\"eq-solid\" d=\"^46\"/><path class=\"eq-solid\" d=\"^47\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#resisted-hip-flexion-m-g1-thigh.r\"/><use href=\"#resisted-hip-flexion-m-g1-kneecap.r\"/><use href=\"#resisted-hip-flexion-m-g1-shank.r\"/><use href=\"#resisted-hip-flexion-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#resisted-hip-flexion-m-g1-thigh.r\"/><use href=\"#resisted-hip-flexion-m-g1-kneecap.r\"/><use href=\"#resisted-hip-flexion-m-g1-shank.r\"/><use href=\"#resisted-hip-flexion-m-g1-foot.r\"/></g></g><path class=\"eq\" d=\"^48\"/><path class=\"eq-solid\" d=\"^49\"/><path class=\"eq-solid\" d=\"^50\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"^51\"/><path class=\"eq-thin\" d=\"^52\"/><path class=\"eq-cable\" d=\"^53\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#resisted-hip-flexion-m-e-thigh.l\"/><use href=\"#resisted-hip-flexion-m-e-kneecap.l\"/><use href=\"#resisted-hip-flexion-m-e-shank.l\"/><use href=\"#resisted-hip-flexion-m-e-foot.l\"/><use href=\"#resisted-hip-flexion-m-e-shcap.l\"/><use href=\"#resisted-hip-flexion-m-e-upper.l\"/><use href=\"#resisted-hip-flexion-m-e-elbowcap.l\"/><use href=\"#resisted-hip-flexion-m-e-fore.l\"/><use href=\"#resisted-hip-flexion-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#resisted-hip-flexion-m-e-thigh.l\"/><use href=\"#resisted-hip-flexion-m-e-kneecap.l\"/><use href=\"#resisted-hip-flexion-m-e-shank.l\"/><use href=\"#resisted-hip-flexion-m-e-foot.l\"/><use href=\"#resisted-hip-flexion-m-e-shcap.l\"/><use href=\"#resisted-hip-flexion-m-e-upper.l\"/><use href=\"#resisted-hip-flexion-m-e-elbowcap.l\"/><use href=\"#resisted-hip-flexion-m-e-fore.l\"/><use href=\"#resisted-hip-flexion-m-e-fist.l\"/></g></g><path class=\"eq-cable\" d=\"^54\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#resisted-hip-flexion-m-e-head\"/><use href=\"#resisted-hip-flexion-m-e-torso\"/><use href=\"#resisted-hip-flexion-m-e-thigh.r\"/><use href=\"#resisted-hip-flexion-m-e-kneecap.r\"/><use href=\"#resisted-hip-flexion-m-e-shank.r\"/><use href=\"#resisted-hip-flexion-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#resisted-hip-flexion-m-e-head\"/><use href=\"#resisted-hip-flexion-m-e-torso\"/><use href=\"#resisted-hip-flexion-m-e-thigh.r\"/><use href=\"#resisted-hip-flexion-m-e-kneecap.r\"/><use href=\"#resisted-hip-flexion-m-e-shank.r\"/><use href=\"#resisted-hip-flexion-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#resisted-hip-flexion-m-e-shcap.r\"/><use href=\"#resisted-hip-flexion-m-e-upper.r\"/><use href=\"#resisted-hip-flexion-m-e-elbowcap.r\"/><use href=\"#resisted-hip-flexion-m-e-fore.r\"/><use href=\"#resisted-hip-flexion-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#resisted-hip-flexion-m-e-shcap.r\"/><use href=\"#resisted-hip-flexion-m-e-upper.r\"/><use href=\"#resisted-hip-flexion-m-e-elbowcap.r\"/><use href=\"#resisted-hip-flexion-m-e-fore.r\"/><use href=\"#resisted-hip-flexion-m-e-fist.r\"/></g></g><path class=\"eq\" d=\"^55\"/><path class=\"eq-solid\" d=\"^56\"/><path class=\"eq-solid\" d=\"^57\"/><path class=\"eq-line m-line\" d=\"^58\"/><path class=\"eq-line m-line\" d=\"^59\"/><path class=\"eq-line m-line\" d=\"^60\"/><path class=\"eq-line m-line\" d=\"^61\"/><path class=\"eq-line m-line\" d=\"^62\"/><path class=\"eq-line m-line\" d=\"^63\"/><path class=\"eq-line m-line\" d=\"^64\"/><path class=\"eq-line m-line\" d=\"^65\"/><path class=\"eq-line m-line\" d=\"^66\"/><path class=\"eq-line m-line\" d=\"^67\"/><circle class=\"joint\" cx=\"200.25\" cy=\"134.49\" r=\"2.25\"/><circle class=\"joint\" cx=\"158.44\" cy=\"156.68\" r=\"2.25\"/><circle class=\"joint\" cx=\"200.25\" cy=\"203.61\" r=\"2.25\"/><circle class=\"joint\" cx=\"262.97\" cy=\"203.61\" r=\"2.25\"/></g><mask id=\"resisted-hip-flexion-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#resisted-hip-flexion-m-m-head\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-m-torso\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-mf-shank.l\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-mf-foot.l\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-m-shcap.l\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-m-upper.l\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-m-fore.l\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-m-fist.l\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-mf-shank.r\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-mf-foot.r\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-m-shcap.r\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-m-upper.r\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-m-fore.r\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-m-fist.r\" fill=\"#000\"/><use href=\"#resisted-hip-flexion-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resisted-hip-flexion-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#resisted-hip-flexion-m-mmask)\"><g class=\"u-stroke\"><use href=\"#resisted-hip-flexion-m-m-head\"/><use href=\"#resisted-hip-flexion-m-m-torso\"/><use href=\"#resisted-hip-flexion-m-m-shcap.l\"/><use href=\"#resisted-hip-flexion-m-m-upper.l\"/><use href=\"#resisted-hip-flexion-m-m-elbowcap.l\"/><use href=\"#resisted-hip-flexion-m-m-fore.l\"/><use href=\"#resisted-hip-flexion-m-m-fist.l\"/><use href=\"#resisted-hip-flexion-m-m-shcap.r\"/><use href=\"#resisted-hip-flexion-m-m-upper.r\"/><use href=\"#resisted-hip-flexion-m-m-elbowcap.r\"/><use href=\"#resisted-hip-flexion-m-m-fore.r\"/><use href=\"#resisted-hip-flexion-m-m-fist.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MJ-r(D(1LUwmXUb\"/><path class=\"m-line\" d=\"~#i0H!y1YOp-!y1XUnWaH4_f(c!7I2*fKmEvB4GcP5ygX4YkI6020010101001001100100000010200100000\"/><path class=\"leader m\" d=\"~MPzA1_HgLY(aGa\"/><path class=\"leader m\" d=\"M190.48 189.9L227 172H237\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"resisted-hip-flexion-m-lean\" data-key=\"lean\" data-cue=\"You lean back to lift the leg higher.\" class=\"plate-callout two m\" style=\"left:65.92%;top:16.76%\" aria-pressed=\"true\">Leans<br>back</button><button type=\"button\" id=\"resisted-hip-flexion-m-arch\" data-key=\"arch\" data-cue=\"Your lower back arches as the knee comes up.\" class=\"plate-callout two m\" style=\"left:64.8%;top:41.9%\" aria-pressed=\"false\">Lower back<br>arches</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "tall",
        cues: [{ key: "tall", cue: "Stand tall with the core braced and the standing leg steady." }, { key: "thigh", cue: "Drive the knee up and forward until the thigh is about parallel." }, { key: "back", cue: "Keep the core tight and do not lean back to lift higher." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "lean",
        cues: [{ key: "lean", cue: "You lean back to lift the leg higher." }, { key: "arch", cue: "Your lower back arches as the knee comes up." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Leans back</b><span>You lean back to lift the leg higher.</span></li><li><b>Lower back arches</b><span>Your lower back arches as the knee comes up.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lift 2 seconds, hold 2 seconds, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lift</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Resisted hip flexion, side view. Standing tall on the left leg, facing away from a low cable pulley, right hand on the frame and a cuff on the right ankle, the lifter drives the right knee up and forward from behind the body until the thigh is about level.",
      mistakeAlt: "Resisted Hip Flexion: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP (b): the card gives no thumb, contact or wrist claim; its grip type (c1, c2) is setup step 2."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Strap the cuff to one ankle on a low cable.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "motra-hf",
          "kovo-hf"
        ],
        "note": "card c1, c2"
      }
    },
    {
      "kind": "grip",
      "text": "Face away from the machine, a little tension. Hold the frame.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "motra-hf",
          "kovo-hf"
        ],
        "note": "card c1, c2"
      }
    },
    {
      "kind": "brace",
      "text": "Brace your trunk, stand tall, hips level and square.",
      "zoom": "torso-upright",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "motra-hf",
          "kovo-hf"
        ],
        "note": "card c3, c12, c6"
      }
    },
    {
      "kind": "position",
      "text": "Drive the knee straight up and forward, thigh about level. Don't swing.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "kovo-hf",
          "motra-hf"
        ],
        "note": "card c2, c5, c6, c7"
      }
    },
    {
      "kind": "finish",
      "text": "Pause, lower with control, no stack slam. Switch legs after the set.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "motra-hf",
          "kovo-hf",
          "outside-hf"
        ],
        "note": "card c3, c4, c7, c2, c16"
      }
    }
  ],
  posture: [
    {
      "key": "upright",
      "label": "Upright torso",
      "detail": "Upright, core tight. Don't lean back. Lift only as high as you can without arching.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "zoom": "torso-upright",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "motra-hf",
          "outside-hf",
          "kovo-hf"
        ],
        "note": "card c3, c6, c13, c14, c7, c12, c5"
      }
    },
    {
      "key": "hips",
      "label": "Hips square",
      "detail": "Hips level and square, no rotation.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "motra-hf"
        ],
        "note": "card c6"
      }
    },
    {
      "key": "stance",
      "label": "Standing leg steady",
      "detail": "Standing leg steady.",
      "anchor": {
        "pose": "end",
        "at": "knee.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "kovo-hf"
        ],
        "note": "card c12"
      }
    },
    {
      "key": "knee",
      "label": "Knee straight",
      "detail": "Knee travels straight forward.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "motra-hf",
          "kovo-hf"
        ],
        "note": "card c6, c2"
      }
    },
    {
      "key": "swing",
      "label": "Swinging the leg",
      "detail": "Lift slowly from the hip.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "kovo-hf",
          "motra-hf"
        ],
        "note": "card c7, c6, c3"
      }
    },
    {
      "key": "slam",
      "label": "Stack slamming down",
      "detail": "Lower with control.",
      "anchor": {
        "pose": "start",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "kovo-hf",
          "motra-hf"
        ],
        "note": "card c7, c4"
      }
    },
    {
      "key": "cuff",
      "label": "Cuff on ankle",
      "detail": "Cuff around the ankle, slight cable tension.",
      "anchor": {
        "pose": "start",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "motra-hf",
          "kovo-hf"
        ],
        "note": "card c1, c2"
      }
    }
  ],
  zooms: [
    {
      "key": "torso-upright",
      "chip": "Torso",
      "heading": "Upright torso",
      "kind": "posture",
      "feelRow": "low-back"
    }
  ],
  chips: [
    "torso-upright",
    "feel"
  ],
  copy: {
    "setupLine": "Cuff on one ankle, facing away from a low cable. Hold the frame.",
    "mistakeLine": "Don't lean back to lift higher. Stand tall, core tight.",
    "cueLine": "Stand tall, knee up.",
    "variantLine": "Band version: band round a low anchor and your shoe."
  },
  mistakes: [],
  risks: [
    {
      "key": "arch",
      "text": "Don't arch your lower back to lift higher. Keep a neutral spine.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "kovo-hf",
          "motra-hf"
        ],
        "note": "card c7, c5, c11"
      }
    },
    {
      "key": "pain",
      "text": "Acute hip or lower-back pain? Skip this exercise.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "motra-hf"
        ],
        "note": "card c11"
      }
    },
    {
      "key": "balance",
      "text": "Stop if balance causes strain.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "motra-hf"
        ],
        "note": "card c11"
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
    "motra-hf",
    "kovo-hf",
    "outside-hf",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/resisted_hip_flexion.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

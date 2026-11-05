// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=d350e489453e62942c6121734b2af137aad1f851efd04cd293d7c2ae1643d1c1
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_upright_row",
  name: "Upright Row",
  hashes: { inputsSha256: "d350e489453e62942c6121734b2af137aad1f851efd04cd293d7c2ae1643d1c1", golden: "2b666e31dc19be0f4a7524d22836ddde13f4b4cee35b08a883098f01e78d15fd" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"upright-row-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"upright-row-n-st-upper.l\" d=\"~#F12w(E1DNqI*E1XHp2*8c2N4(N1!2*5H1x3A4zD1A9BjlKg.aEiO7RB1O1*2O3X57FO170t-8BglRcDqw1Jm_e(o00000020001011000200002100011100000010001020001000002120010000002000000100000000\"/><path id=\"upright-row-n-st-elbowcap.l\" d=\"~~(XF1WSz1Dz10\"/><path id=\"upright-row-n-st-fore.l\" d=\"~#F12HWF1UTz1RYF1.Xy1N1Eaq!1U4YH1F3G9U1I2dEw1P6)c9Bbz7TcI1Ew1T1G2-3x9I2(H1l_1*1xaEa7*9_jgFh(aFj00000100020002100000200210000000000120001001010000001100010000100001210000101100\"/><path id=\"upright-row-n-st-fist.l\" d=\"~~HzG1JEK1ww10\"/><path id=\"upright-row-n-st-upper.r\" d=\"~#F12U)q(GqByrTDpu-8808FO1P3X5P1*2P7RB1!aEimKgz9Bjz4zD1G1x3.2*5K4(N1b21*8zgx2-e(ovJmScDq00000001101100002000102000200010102101001100000200010000101010000000000001101010\"/><path id=\"upright-row-n-st-elbowcap.r\" d=\"~~D)qWSz1Dz10\"/><path id=\"upright-row-n-st-fore.r\" d=\"~#F12S*qWRz1ExrzWy1(1xam_1J2(H1_3x9U1G2J1Ew1A7TcaBbO6)ceEw1T1I2E3G9T4YH1p!1K1EaBan*aFjfFh(9_j20101011102100000001012000100100000000001210000020020002000100000001000000110100\"/><path id=\"upright-row-n-st-fist.r\" d=\"~~D_qJEK1ww10\"/><path id=\"upright-row-n-g0-upper.r\" d=\"~#F12YArJWpIVrVXoJ4R7a2*iUH1P5X3S2)1_lGuPhBcJ7VedElPbRz12E35R6BnHF171S3x8Td)8XnUgBawkowt10010101010002000010111010002000100000001002000000011100200100000000000000000200\"/><path id=\"upright-row-n-g0-elbowcap.r\" d=\"~~yGnFOy1Dz10\"/><path id=\"upright-row-n-g0-fore.r\" d=\"~#F12yHn_!y1*znGBy1V1-8H1D1whNx1a-8qI2z9EoW1GeB4OaxbG9*9-nE2E1E6B6SawA15Y1X4R7)a0R2wmJ6ygwhHe11000001010001010102200001020010110000000002000001010000102000001210100000000101\"/><path id=\"upright-row-n-g0-fist.r\" d=\"~~D_qy(G1ww10\"/><path id=\"upright-row-n-g1-upper.r\" d=\"~#F12YNryGpIGsKRo!6X568*w1Ay1N6X1D3v_v.lSkK5(bGb!6Bk!nEuD1z3A2I6zA1Yu99F6I6BaTcxsN7IgJfB9Nr00002100000001100000000200020010102100021010010000200211110220000000100020010010\"/><path id=\"upright-row-n-g1-elbowcap.r\" d=\"~~FUkUWw1Dz10\"/><path id=\"upright-row-n-g1-fore.r\" d=\"~#F12Y_kUKx1RKkEYw1G4E8U1q!qysK2X80T2-gTlR2Ee)6X8IdX5Ih)kR2j)7G4NlJw1eY1x7)5*9Y3y4!lWaNdPkW800200020002000000100001010000002200000020000000011101100000002010000011011200100\"/><path id=\"upright-row-n-g1-fist.r\" d=\"~~D_qYUD1ww10\"/><path id=\"upright-row-n-g2-upper.r\" d=\"~#F12w!rFwp).s)Soy8z34aBG1(kS6kD32Yz1R9DlP1yfV6wd-gwvzkA2O2(3G5BI1Wg17W7)3V4Tf.sz2OkD9Xh!m11011000000101020000000000000000000000000020010011100202000000100200000000010011\"/><path id=\"upright-row-n-g2-elbowcap.r\" d=\"~~WAjWxuDz10\"/><path id=\"upright-row-n-g2-fore.r\" d=\"~#F12JNjD!uX!izEux6B8_1o!w1Yqx4.8hX2KmBmK4Xdx8.7)d-3znTlV2dx9V3As_vmY1G8V5X7W6_6DlNc!bJlw600011112100000000110100022000200011000100100000200000001100000001012001000000020\"/><path id=\"upright-row-n-g2-fist.r\" d=\"~~D_qJIz1ww10\"/><path id=\"upright-row-n-e-head\" d=\"~#D12Y(y1yJgzVx1VBgEjNeXcDbT9D3-4B3B3B3-4B3-4x8R1*7B3T9D3T9S1*7_4x8_4B3D3B3_4B3U9D3YcDbFjNe0000100000001010020002101000002000000000000010000000000200022020000000200000\"/><path id=\"upright-row-n-e-torso\" d=\"~#A22SIA1yJl)GA1E)j!c-kAr0y8K6K6R1IeUh-J1Db-4-cU9_sT9Yc_4R9DjI6U9J6-c0)n-c)E1)nID2BrJD2BrwF1)nwo-c_c0T9J6BjI6-4R9U9YcT9_s_4-c_J1DbJeUhN6R1x8K6zr0.c-kyY2_J10021011000002000100002000000002101010000000002200000000000002000000000100000000000001002000000000101110000000002000010100000200111000000\"/><path id=\"upright-row-n-e-thigh.l\" d=\"~#F12Jyz1DAF1V-y1*VD1)2ObG14Aa_*1y5K8J2z4z3.U1!9zoz2zkXeRlx8EU1B3T3X6x7D3N(1D13k-bGw1T8OhwI1_3Yz1AqFD100002100110020010020000001200001200000000200020200010100000000101000020000010000\"/><path id=\"upright-row-n-e-kneecap.l\" d=\"~~FIB1PwU1_J10\"/><path id=\"upright-row-n-e-shank.l\" d=\"~#F12YGB1FzU1XHB1)TS1A1.bF11S8J(1P5z8P2z4V7Ky2P6)dj*bB8zd3*y2)2V3I6O7B1((1E14R2VbxcHcXbJpD1YlYe_n00000001010001000000011101000022000200010120002000011000000111000000001002200000\"/><path id=\"upright-row-n-e-foot.l\" d=\"~#e2wGE1_P)1zYB1-U)1.oF_1KeItXK1OfV9T5NB1Bz1PgIp1010000000000200000020021000\"/><path id=\"upright-row-n-e-thigh.r\" d=\"~#F12Jyu(TE1Rzu*AD1j-bB13B3N(1Y6x7D3T3y8EU1YeRlA2zk.9zoA3.U1I2z4x5K8za_*1H14w3ObXtzfzqFD1-3Yz1PhwI100000000001111000212101210000010010010010000100001100021001100000000010000020000\"/><path id=\"upright-row-n-e-kneecap.r\" d=\"~~UYtPwU1_J10\"/><path id=\"upright-row-n-e-shank.r\" d=\"~#F12AXt_*T1V*t)NS1S2VbF14D1((1J6O7w3V34*y2D8zdk*bO6)dW7Ky2O2z4O5z8R8J(1E11z1.bKd_aXe_nB1YlYbJp00210100000011001000100101000200120000012101000000010001010000000000100220000000\"/><path id=\"upright-row-n-e-foot.r\" d=\"~#e2PUu_P)1IBw1-U)1!oF_1NeItYK1OfW9T5KB1Bz1OgIp2020001010000200000010022000\"/><path id=\"upright-row-n-e-shcap.l\" d=\"~~(*E1yJqwP10\"/><path id=\"upright-row-n-e-upper.l\" d=\"~#F12(KG1y!rGPF1z.rK7d29JE1K2.4z3K2K1IrX5VixaOg0ViyaIrY5K2N1.4A3JE1N22aK7ez7DgPpYdPm0PpXd00000000000111220000000002000000000000000001010020100002000000000000000200000000\"/><path id=\"upright-row-n-e-elbowcap.l\" d=\"~~PxP1yJqDz10\"/><path id=\"upright-row-n-e-fore.l\" d=\"~#F12PGP1HTpT(P1TwpF8K6l!1VqNy1(8O4Y2jPmxoWd-4S7G8S3ze_lRoc.2W3G9-v_t-1qU5V8I7x7*kP7RbWcK5Sl01012101001010000000020000002021010001000001000000000000000000010000022000111110\"/><path id=\"upright-row-n-e-fist.l\" d=\"~~HzG1yyw1ww10\"/><path id=\"upright-row-n-e-shcap.r\" d=\"~~S)qyJqwP10\"/><path id=\"upright-row-n-e-upper.r\" d=\"~#F12SOsy!oBKt)!oN7e1aIE1N2!4A3N2N1JrY5WiyaPg0WixaJrX5N2K1!4z3IE1K219N7dA7BgOpXdOm0OpYd00000010120020100001010000000000000000020000000012210110100000000000000002000000\"/><path id=\"upright-row-n-e-elbowcap.r\" d=\"~~UVjyJqDz10\"/><path id=\"upright-row-n-e-fore.r\" d=\"~#F12U*j!Ar)JjBNqT5V8_1q_v_tV3G9b.2-lRoR3zeR7G8Vd-4OmxoX2j*8O4WqNy1m!1E8K6R7W6N5SlSbWc(kP701000010100000000000010000111001111000000002000000000010111101012001010010121000\"/><path id=\"upright-row-n-e-fist.r\" d=\"~~D_qyyw1ww10\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#upright-row-n-dots)\"/>\n  <path class=\"datum\" d=\"~MwI2yJqLSAq0\"/><path class=\"floorline\" d=\"M104.39 339.5H253.61\"/><path class=\"arc measure\" d=\"M212.15 135.05L212.15 163.05A28 28 0 0 0 240.15 135.05Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#upright-row-n-st-upper.l\"/><use href=\"#upright-row-n-st-elbowcap.l\"/><use href=\"#upright-row-n-st-fore.l\"/><use href=\"#upright-row-n-st-fist.l\"/><use href=\"#upright-row-n-st-upper.r\"/><use href=\"#upright-row-n-st-elbowcap.r\"/><use href=\"#upright-row-n-st-fore.r\"/><use href=\"#upright-row-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#upright-row-n-st-upper.l\"/><use href=\"#upright-row-n-st-elbowcap.l\"/><use href=\"#upright-row-n-st-fore.l\"/><use href=\"#upright-row-n-st-fist.l\"/><use href=\"#upright-row-n-st-upper.r\"/><use href=\"#upright-row-n-st-elbowcap.r\"/><use href=\"#upright-row-n-st-fore.r\"/><use href=\"#upright-row-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#upright-row-n-g0-upper.r\"/><use href=\"#upright-row-n-g0-elbowcap.r\"/><use href=\"#upright-row-n-g0-fore.r\"/><use href=\"#upright-row-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#upright-row-n-g0-upper.r\"/><use href=\"#upright-row-n-g0-elbowcap.r\"/><use href=\"#upright-row-n-g0-fore.r\"/><use href=\"#upright-row-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#upright-row-n-g1-upper.r\"/><use href=\"#upright-row-n-g1-elbowcap.r\"/><use href=\"#upright-row-n-g1-fore.r\"/><use href=\"#upright-row-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#upright-row-n-g1-upper.r\"/><use href=\"#upright-row-n-g1-elbowcap.r\"/><use href=\"#upright-row-n-g1-fore.r\"/><use href=\"#upright-row-n-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#upright-row-n-g2-upper.r\"/><use href=\"#upright-row-n-g2-elbowcap.r\"/><use href=\"#upright-row-n-g2-fore.r\"/><use href=\"#upright-row-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#upright-row-n-g2-upper.r\"/><use href=\"#upright-row-n-g2-elbowcap.r\"/><use href=\"#upright-row-n-g2-fore.r\"/><use href=\"#upright-row-n-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#upright-row-n-e-head\"/><use href=\"#upright-row-n-e-torso\"/><use href=\"#upright-row-n-e-thigh.l\"/><use href=\"#upright-row-n-e-kneecap.l\"/><use href=\"#upright-row-n-e-shank.l\"/><use href=\"#upright-row-n-e-foot.l\"/><use href=\"#upright-row-n-e-thigh.r\"/><use href=\"#upright-row-n-e-kneecap.r\"/><use href=\"#upright-row-n-e-shank.r\"/><use href=\"#upright-row-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#upright-row-n-e-head\"/><use href=\"#upright-row-n-e-torso\"/><use href=\"#upright-row-n-e-thigh.l\"/><use href=\"#upright-row-n-e-kneecap.l\"/><use href=\"#upright-row-n-e-shank.l\"/><use href=\"#upright-row-n-e-foot.l\"/><use href=\"#upright-row-n-e-thigh.r\"/><use href=\"#upright-row-n-e-kneecap.r\"/><use href=\"#upright-row-n-e-shank.r\"/><use href=\"#upright-row-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~MANg_Nw1LFxB10QF60)_A1E6LE6-6Q0E6E6_6L)_A1F6QE60w.A1F6LF6_6Q0F6F6-6Z\"/><path class=\"eq-solid\" d=\"~MUxgDIvLGHc0QE60yAcF6LF6(qQ0F6F6*qLyAcE6QF60xAcE6LE6*qQ0E6E6(qZ\"/><path class=\"eq-solid\" d=\"~M_HgP*uL*e0QE60W8F6LF6JW1Q0F6F6IW1LW8E6QF60V8E6LE6IW1Q0E6E6JW1Z\"/><path class=\"eq\" d=\"~MSAfHUpLBg0QOc0W3PcLPc(VbQ0PcPc*VbLW3OcQPc0V3OcLOc*VbQ0OcOc(VbZ\"/><path class=\"eq-solid\" d=\"~M!.V1!Yw1LHHc0QF60xAcE6LE6*qQ0E6E6(qLxAcF6QE60yAcF6LF6(qQ0F6F6*qZ\"/><path class=\"eq-solid\" d=\"~MWSV1UDx1L(e0QF60V8E6LE6IW1Q0E6E6JW1LV8F6QE60W8F6LF6JW1Q0F6F6IW1Z\"/><path class=\"eq\" d=\"~M(YW1YOD1LDg0QPc0V3OcLOc*VbQ0OcOc(VbLV3PcQOc0W3PcLPc(VbQ0PcPc*VbZ\"/><path class=\"eq-thin m-line\" d=\"~M!EgJEK1LYKB10\"/><path class=\"eq-thin m-line\" d=\"~MyR3F(K1L_Wc0L-WcVK1L-WcWK1L_WcWK1\"/><path class=\"eq-thin m-line\" d=\"~M!EeAVT1LDG10LBG1K.cLBG1N.cLDG1N.c\"/><path class=\"eq-thin m-line\" d=\"~MUVV1F(K1L_Wc0L-WcVK1L-WcWK1L_WcWK1\"/><path class=\"eq-thin m-line\" d=\"~MNJW1AVT1LDG10LBG1K.cLBG1N.cLDG1N.c\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#upright-row-n-e-shcap.l\"/><use href=\"#upright-row-n-e-upper.l\"/><use href=\"#upright-row-n-e-elbowcap.l\"/><use href=\"#upright-row-n-e-fore.l\"/><use href=\"#upright-row-n-e-fist.l\"/><use href=\"#upright-row-n-e-shcap.r\"/><use href=\"#upright-row-n-e-upper.r\"/><use href=\"#upright-row-n-e-elbowcap.r\"/><use href=\"#upright-row-n-e-fore.r\"/><use href=\"#upright-row-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#upright-row-n-e-shcap.l\"/><use href=\"#upright-row-n-e-upper.l\"/><use href=\"#upright-row-n-e-elbowcap.l\"/><use href=\"#upright-row-n-e-fore.l\"/><use href=\"#upright-row-n-e-fist.l\"/><use href=\"#upright-row-n-e-shcap.r\"/><use href=\"#upright-row-n-e-upper.r\"/><use href=\"#upright-row-n-e-elbowcap.r\"/><use href=\"#upright-row-n-e-fore.r\"/><use href=\"#upright-row-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"212.15\" cy=\"135.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"135.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"251.63\" cy=\"135.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"106.37\" cy=\"135.05\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#D20yyqJFz1zHqVIz1614363012103230321230325412761478545a5a5a7a7c5e7e7g7e7e5i9g5e7i7e5g700101210000020001000000001002001200200200000000000200201002000000121010010200000000000001000000000012020000000101001000000101101000010000011\"/><path class=\"arrow\" d=\"~M(FkHYrLYgND1LBW1IF1Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M212.15 163.05A28 28 0 0 0 240.15 135.05\"/><g class=\"arc-ticks\"><path d=\"~M(KG1yyvL0FY1\"/><path d=\"~M(zN1yJqLFY10\"/></g><path class=\"leader\" d=\"~MSSK1UPuLDw5.Bb\"/></g></g><path class=\"leader\" d=\"~MWAR1yJqL0xD9\"/><circle class=\"anchor\" cx=\"251.63\" cy=\"135.05\" r=\"1.5\"/><path class=\"leader\" d=\"~Myw7yJqL0RIa\"/><circle class=\"anchor\" cx=\"35.85\" cy=\"135.05\" r=\"1.5\"/><path class=\"leader\" d=\"~MD_ryyw1L0RE8\"/><circle class=\"anchor\" cx=\"142.43\" cy=\"164.17\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"upright-row-n-elbows\" data-key=\"elbows\" data-cue=\"Lead with your elbows out to the sides, above your hands.\" class=\"plate-callout\" style=\"left:54.19%;top:15.36%\" aria-pressed=\"true\">Elbows lead</button><button type=\"button\" id=\"upright-row-n-height\" data-key=\"height\" data-cue=\"Stop when your elbows reach shoulder level.\" class=\"plate-callout two\" style=\"left:1.12%;top:11.73%\" aria-pressed=\"false\">Shoulder<br>height</button><button type=\"button\" id=\"upright-row-n-bar\" data-key=\"bar\" data-cue=\"Pull the bar straight up, close to your body.\" class=\"plate-callout\" style=\"left:17.32%;top:24.86%\" aria-pressed=\"false\">Bar close</button><span class=\"plate-arc-label\" style=\"left:73.18%;top:25.7%\"><b>Shoulder</b><span>level, 90°</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"upright-row-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"upright-row-m-st-upper.l\" d=\"^0\"/><path id=\"upright-row-m-st-elbowcap.l\" d=\"^1\"/><path id=\"upright-row-m-st-fore.l\" d=\"^2\"/><path id=\"upright-row-m-st-fist.l\" d=\"^3\"/><path id=\"upright-row-m-st-upper.r\" d=\"^4\"/><path id=\"upright-row-m-st-elbowcap.r\" d=\"^5\"/><path id=\"upright-row-m-st-fore.r\" d=\"^6\"/><path id=\"upright-row-m-st-fist.r\" d=\"^7\"/><path id=\"upright-row-m-g0-upper.r\" d=\"^8\"/><path id=\"upright-row-m-g0-elbowcap.r\" d=\"^9\"/><path id=\"upright-row-m-g0-fore.r\" d=\"^10\"/><path id=\"upright-row-m-g0-fist.r\" d=\"^11\"/><path id=\"upright-row-m-g1-upper.r\" d=\"^12\"/><path id=\"upright-row-m-g1-elbowcap.r\" d=\"^13\"/><path id=\"upright-row-m-g1-fore.r\" d=\"^14\"/><path id=\"upright-row-m-g1-fist.r\" d=\"^15\"/><path id=\"upright-row-m-g2-upper.r\" d=\"^16\"/><path id=\"upright-row-m-g2-elbowcap.r\" d=\"^17\"/><path id=\"upright-row-m-g2-fore.r\" d=\"^18\"/><path id=\"upright-row-m-g2-fist.r\" d=\"^19\"/><path id=\"upright-row-m-e-head\" d=\"^20\"/><path id=\"upright-row-m-e-torso\" d=\"^21\"/><path id=\"upright-row-m-e-thigh.l\" d=\"^22\"/><path id=\"upright-row-m-e-kneecap.l\" d=\"^23\"/><path id=\"upright-row-m-e-shank.l\" d=\"^24\"/><path id=\"upright-row-m-e-foot.l\" d=\"^25\"/><path id=\"upright-row-m-e-thigh.r\" d=\"^26\"/><path id=\"upright-row-m-e-kneecap.r\" d=\"^27\"/><path id=\"upright-row-m-e-shank.r\" d=\"^28\"/><path id=\"upright-row-m-e-foot.r\" d=\"^29\"/><path id=\"upright-row-m-e-shcap.l\" d=\"^30\"/><path id=\"upright-row-m-e-upper.l\" d=\"^31\"/><path id=\"upright-row-m-e-elbowcap.l\" d=\"^32\"/><path id=\"upright-row-m-e-fore.l\" d=\"^33\"/><path id=\"upright-row-m-e-fist.l\" d=\"^34\"/><path id=\"upright-row-m-e-shcap.r\" d=\"^35\"/><path id=\"upright-row-m-e-upper.r\" d=\"^36\"/><path id=\"upright-row-m-e-elbowcap.r\" d=\"^37\"/><path id=\"upright-row-m-e-fore.r\" d=\"^38\"/><path id=\"upright-row-m-e-fist.r\" d=\"^39\"/><path id=\"upright-row-m-m-upper.l\" d=\"~#F12!IH1SRr-OG1XDsB7A557Az1xvR6D1B3m.w1_i.k!3.cHaG8PjVp_rK1w3O2A6wD1Ir8aT6Y5_8YdSsG5Sh*dHbVq00021002000002000000010101000000000100111110002000100200021100000020010000001020\"/><path id=\"upright-row-m-m-elbowcap.l\" d=\"~~NOO1NVkDz10\"/><path id=\"upright-row-m-m-fore.l\" d=\"~#F12yzP1yUjzWP1ONjF7K1rD1zqygJ7eF2oAgx7PesDaX4U8Tb!f.7oz2N4*5xtU9O11_5V4N3XcBmE1TfF7Gd_h20200000000000000001200101000000001000000000121210000100000101101012100000000000\"/><path id=\"upright-row-m-m-fist.l\" d=\"~~HzG1!Ooww10\"/><path id=\"upright-row-m-m-upper.r\" d=\"~#F12PKtSDpIFuB*pU6Y57a)B1IrP2A6N1w3Wp_rH8Pj!cHa!k!3!w1_iD3mS6D1zz1xv67D7A5HbTbGbVqRh*dRsG500002102000220001000200101000100000000010101000000020000020012001020000000011000\"/><path id=\"upright-row-m-m-elbowcap.r\" d=\"~~WEkNVkDz10\"/><path id=\"upright-row-m-m-fore.r\" d=\"~#F12H.kYWlXHkVIl-5V4P11ytU9K4*5nz2.f.7T8TbBaX4Oeszgx7E2oI7eAqygsD1E7K1xcS5Hd_hUfF7DmE100010100000100000222000000002000000000010110010000000000000010100010100000000200\"/><path id=\"upright-row-m-m-fist.r\" d=\"~~D_q!Ooww10\"/><path id=\"upright-row-m-m-eq0\" d=\"~MANgW!oLFxB10QF60)_A1E6LE6.6Q0E6E6!6L)_A1F6QE60w.A1F6LF6!6Q0F6F6.6Z\"/><path id=\"upright-row-m-m-eq1\" d=\"~MUxgy-nLGHc0QE60yAcF6LF6(qQ0F6F6*qLyAcE6QF60xAcE6LE6*qQ0E6E6(qZ\"/><path id=\"upright-row-m-m-eq2\" d=\"~M_HgHInL*e0QE60W8F6LF6JW1Q0F6F6IW1LW8E6QF60V8E6LE6IW1Q0E6E6JW1Z\"/><path id=\"upright-row-m-m-eq3\" d=\"~MSAfDyiLBg0QOc0W3PcLPc(VbQ0PcPc*VbLW3OcQPc0V3OcLOc*VbQ0OcOc(VbZ\"/><path id=\"upright-row-m-m-eq4\" d=\"~M!.V1YDpLHHc0QF60xAcE6LE6*qQ0E6E6(qLxAcF6QE60yAcF6LF6(qQ0F6F6*qZ\"/><path id=\"upright-row-m-m-eq5\" d=\"~MWSV1NUpL(e0QF60V8E6LE6IW1Q0E6E6JW1LV8F6QE60W8F6LF6JW1Q0F6F6IW1Z\"/><path id=\"upright-row-m-m-eq6\" d=\"~M(YW1U*uLDg0QPc0V3OcLOc*VbQ0OcOc(VbLV3PcQOc0W3PcLPc(VbQ0PcPc*VbZ\"/><path id=\"upright-row-m-mf-head\" d=\"^20\"/><path id=\"upright-row-m-mf-torso\" d=\"^21\"/><path id=\"upright-row-m-mf-thigh.l\" d=\"^22\"/><path id=\"upright-row-m-mf-kneecap.l\" d=\"^23\"/><path id=\"upright-row-m-mf-shank.l\" d=\"^24\"/><path id=\"upright-row-m-mf-foot.l\" d=\"^25\"/><path id=\"upright-row-m-mf-shcap.l\" d=\"^30\"/><path id=\"upright-row-m-mf-thigh.r\" d=\"^26\"/><path id=\"upright-row-m-mf-kneecap.r\" d=\"^27\"/><path id=\"upright-row-m-mf-shank.r\" d=\"^28\"/><path id=\"upright-row-m-mf-foot.r\" d=\"^29\"/><path id=\"upright-row-m-mf-shcap.r\" d=\"^35\"/><path id=\"upright-row-m-mo-0\" d=\"^20\"/><path id=\"upright-row-m-mo-1\" d=\"^21\"/><path id=\"upright-row-m-mo-2\" d=\"^22\"/><path id=\"upright-row-m-mo-3\" d=\"^23\"/><path id=\"upright-row-m-mo-4\" d=\"^24\"/><path id=\"upright-row-m-mo-5\" d=\"^25\"/><path id=\"upright-row-m-mo-6\" d=\"^30\"/><path id=\"upright-row-m-mo-7\" d=\"^31\"/><path id=\"upright-row-m-mo-8\" d=\"^32\"/><path id=\"upright-row-m-mo-9\" d=\"^33\"/><path id=\"upright-row-m-mo-10\" d=\"^34\"/><path id=\"upright-row-m-mo-11\" d=\"^26\"/><path id=\"upright-row-m-mo-12\" d=\"^27\"/><path id=\"upright-row-m-mo-13\" d=\"^28\"/><path id=\"upright-row-m-mo-14\" d=\"^29\"/><path id=\"upright-row-m-mo-15\" d=\"^35\"/><path id=\"upright-row-m-mo-16\" d=\"^36\"/><path id=\"upright-row-m-mo-17\" d=\"^37\"/><path id=\"upright-row-m-mo-18\" d=\"^38\"/><path id=\"upright-row-m-mo-19\" d=\"^39\"/><path id=\"upright-row-m-mo-20\" d=\"^43\"/><path id=\"upright-row-m-mo-21\" d=\"^44\"/><path id=\"upright-row-m-mo-22\" d=\"^45\"/><path id=\"upright-row-m-mo-23\" d=\"^46\"/><path id=\"upright-row-m-mo-24\" d=\"^47\"/><path id=\"upright-row-m-mo-25\" d=\"^48\"/><path id=\"upright-row-m-mo-26\" d=\"^49\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#upright-row-m-dots)\"/>\n  <path class=\"datum\" d=\"^40\"/><path class=\"floorline\" d=\"^41\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#upright-row-m-st-upper.l\"/><use href=\"#upright-row-m-st-elbowcap.l\"/><use href=\"#upright-row-m-st-fore.l\"/><use href=\"#upright-row-m-st-fist.l\"/><use href=\"#upright-row-m-st-upper.r\"/><use href=\"#upright-row-m-st-elbowcap.r\"/><use href=\"#upright-row-m-st-fore.r\"/><use href=\"#upright-row-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#upright-row-m-st-upper.l\"/><use href=\"#upright-row-m-st-elbowcap.l\"/><use href=\"#upright-row-m-st-fore.l\"/><use href=\"#upright-row-m-st-fist.l\"/><use href=\"#upright-row-m-st-upper.r\"/><use href=\"#upright-row-m-st-elbowcap.r\"/><use href=\"#upright-row-m-st-fore.r\"/><use href=\"#upright-row-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#upright-row-m-g0-upper.r\"/><use href=\"#upright-row-m-g0-elbowcap.r\"/><use href=\"#upright-row-m-g0-fore.r\"/><use href=\"#upright-row-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#upright-row-m-g0-upper.r\"/><use href=\"#upright-row-m-g0-elbowcap.r\"/><use href=\"#upright-row-m-g0-fore.r\"/><use href=\"#upright-row-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#upright-row-m-g1-upper.r\"/><use href=\"#upright-row-m-g1-elbowcap.r\"/><use href=\"#upright-row-m-g1-fore.r\"/><use href=\"#upright-row-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#upright-row-m-g1-upper.r\"/><use href=\"#upright-row-m-g1-elbowcap.r\"/><use href=\"#upright-row-m-g1-fore.r\"/><use href=\"#upright-row-m-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#upright-row-m-g2-upper.r\"/><use href=\"#upright-row-m-g2-elbowcap.r\"/><use href=\"#upright-row-m-g2-fore.r\"/><use href=\"#upright-row-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#upright-row-m-g2-upper.r\"/><use href=\"#upright-row-m-g2-elbowcap.r\"/><use href=\"#upright-row-m-g2-fore.r\"/><use href=\"#upright-row-m-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#upright-row-m-e-head\"/><use href=\"#upright-row-m-e-torso\"/><use href=\"#upright-row-m-e-thigh.l\"/><use href=\"#upright-row-m-e-kneecap.l\"/><use href=\"#upright-row-m-e-shank.l\"/><use href=\"#upright-row-m-e-foot.l\"/><use href=\"#upright-row-m-e-thigh.r\"/><use href=\"#upright-row-m-e-kneecap.r\"/><use href=\"#upright-row-m-e-shank.r\"/><use href=\"#upright-row-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#upright-row-m-e-head\"/><use href=\"#upright-row-m-e-torso\"/><use href=\"#upright-row-m-e-thigh.l\"/><use href=\"#upright-row-m-e-kneecap.l\"/><use href=\"#upright-row-m-e-shank.l\"/><use href=\"#upright-row-m-e-foot.l\"/><use href=\"#upright-row-m-e-thigh.r\"/><use href=\"#upright-row-m-e-kneecap.r\"/><use href=\"#upright-row-m-e-shank.r\"/><use href=\"#upright-row-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^43\"/><path class=\"eq-solid\" d=\"^44\"/><path class=\"eq-solid\" d=\"^45\"/><path class=\"eq\" d=\"^46\"/><path class=\"eq-solid\" d=\"^47\"/><path class=\"eq-solid\" d=\"^48\"/><path class=\"eq\" d=\"^49\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#upright-row-m-e-shcap.l\"/><use href=\"#upright-row-m-e-upper.l\"/><use href=\"#upright-row-m-e-elbowcap.l\"/><use href=\"#upright-row-m-e-fore.l\"/><use href=\"#upright-row-m-e-fist.l\"/><use href=\"#upright-row-m-e-shcap.r\"/><use href=\"#upright-row-m-e-upper.r\"/><use href=\"#upright-row-m-e-elbowcap.r\"/><use href=\"#upright-row-m-e-fore.r\"/><use href=\"#upright-row-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#upright-row-m-e-shcap.l\"/><use href=\"#upright-row-m-e-upper.l\"/><use href=\"#upright-row-m-e-elbowcap.l\"/><use href=\"#upright-row-m-e-fore.l\"/><use href=\"#upright-row-m-e-fist.l\"/><use href=\"#upright-row-m-e-shcap.r\"/><use href=\"#upright-row-m-e-upper.r\"/><use href=\"#upright-row-m-e-elbowcap.r\"/><use href=\"#upright-row-m-e-fore.r\"/><use href=\"#upright-row-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"212.15\" cy=\"135.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"135.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"251.63\" cy=\"135.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"106.37\" cy=\"135.05\" r=\"2.25\"/></g><mask id=\"upright-row-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#upright-row-m-mf-head\" fill=\"#000\"/><use href=\"#upright-row-m-mf-torso\" fill=\"#000\"/><use href=\"#upright-row-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#upright-row-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#upright-row-m-mf-shank.l\" fill=\"#000\"/><use href=\"#upright-row-m-mf-foot.l\" fill=\"#000\"/><use href=\"#upright-row-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#upright-row-m-m-upper.l\" fill=\"#000\"/><use href=\"#upright-row-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#upright-row-m-m-fore.l\" fill=\"#000\"/><use href=\"#upright-row-m-m-fist.l\" fill=\"#000\"/><use href=\"#upright-row-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#upright-row-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#upright-row-m-mf-shank.r\" fill=\"#000\"/><use href=\"#upright-row-m-mf-foot.r\" fill=\"#000\"/><use href=\"#upright-row-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#upright-row-m-m-upper.r\" fill=\"#000\"/><use href=\"#upright-row-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#upright-row-m-m-fore.r\" fill=\"#000\"/><use href=\"#upright-row-m-m-fist.r\" fill=\"#000\"/><use href=\"#upright-row-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#upright-row-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#upright-row-m-mmask)\"><g class=\"u-stroke\"><use href=\"#upright-row-m-m-upper.l\"/><use href=\"#upright-row-m-m-elbowcap.l\"/><use href=\"#upright-row-m-m-fore.l\"/><use href=\"#upright-row-m-m-fist.l\"/><use href=\"#upright-row-m-m-upper.r\"/><use href=\"#upright-row-m-m-elbowcap.r\"/><use href=\"#upright-row-m-m-fore.r\"/><use href=\"#upright-row-m-m-fist.r\"/><use href=\"#upright-row-m-m-eq0\"/><use href=\"#upright-row-m-m-eq1\"/><use href=\"#upright-row-m-m-eq2\"/><use href=\"#upright-row-m-m-eq3\"/><use href=\"#upright-row-m-m-eq4\"/><use href=\"#upright-row-m-m-eq5\"/><use href=\"#upright-row-m-m-eq6\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MY(y1S!uL0V_4MYiwpLXi)oL0wS1\"/><path class=\"m-arrow\" d=\"~MDzT1yJqLxiTW5MAlwnLzl)mL(4WR1\"/><path class=\"leader m\" d=\"~MHzH1!OoL0IW7\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"upright-row-m-chin\" data-key=\"chin\" data-cue=\"The bar comes up under the chin, the elbows above the shoulders.\" class=\"plate-callout two m\" style=\"left:54.19%;top:12.85%\" aria-pressed=\"true\">Bar under<br>chin</button>",
    ]);
    return {
      view: "front",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "Lead with your elbows out to the sides, above your hands." }, { key: "height", cue: "Stop when your elbows reach shoulder level." }, { key: "bar", cue: "Pull the bar straight up, close to your body." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "chin",
        cues: [{ key: "chin", cue: "The bar comes up under the chin, the elbows above the shoulders." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Bar under chin</b><span>The bar comes up under the chin, the elbows above the shoulders.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Barbell upright row, front view. Standing upright, overhand grip wider than the shoulders, the lifter pulls the bar straight up close to the body from the thighs to the lower ribs, elbows leading out to the sides and stopping level with the shoulders, higher than the hands.",
      mistakeAlt: "Upright Row: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "pull",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW2: no pair key variant draws this card's barbell grip (ruling 8); the grip copy carries c1, c7 and c14.",
    "orientation": "pronated",
    "handle": "bar-28",
    "width": {
      "text": "About shoulder width or wider. Never hands close together.",
      "claim": {
        "tags": [
          "MECH",
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "lesmills-upright-row",
          "mcallister2013"
        ],
        "note": "c5, c7"
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
        "note": "c14"
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        25
      ],
      "limitText": "Wrists straight. Lift with the shoulders, not the wrists.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-upright-row"
        ],
        "note": "c3, card grip.wrist. The ext range is pairs.mjs CONVENTIONS ga:pull-base, a convention, not a card number."
      }
    },
    "faults": [],
    "gripLine": "Overhand, about shoulder width or wider, thumbs around the bar.",
    "cue": "Elbows lead, out to the sides."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Stand upright, feet about shoulder width, chest up.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-upright-row"
        ],
        "note": "c12"
      }
    },
    {
      "kind": "grip",
      "text": "Overhand grip about shoulder width or wider, thumbs around the bar.",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "mcallister2013",
          "sl-upright-row",
          "baechle-grip"
        ],
        "note": "c7, c1, c14"
      }
    },
    {
      "kind": "brace",
      "text": "Draw the shoulder blades back before the first pull.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "lesmills-upright-row"
        ],
        "note": "c6"
      }
    },
    {
      "kind": "load",
      "text": "Start light, with few sets.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-upright-row"
        ],
        "note": "c2"
      }
    }
  ],
  posture: [
    {
      "key": "elbows",
      "label": "Elbows lead",
      "detail": "Elbows out to the sides, leading the bar.",
      "anchor": {
        "pose": "end",
        "at": "elbow.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-upright-row"
        ],
        "note": "c3"
      }
    },
    {
      "key": "height",
      "label": "Shoulder height",
      "detail": "Elbows no higher than the shoulders.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "zoom": "urow-top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-upright-row"
        ],
        "note": "c2"
      }
    },
    {
      "key": "bar",
      "label": "Bar close",
      "detail": "Bar close to the body.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-upright-row"
        ],
        "note": "c3"
      }
    },
    {
      "key": "shoulders",
      "label": "Shoulders back",
      "detail": "Shoulders back, not rounded forward.",
      "anchor": {
        "pose": "end",
        "at": "shoulder.r"
      },
      "claim": {
        "tags": [
          "MECH",
          "CONSENSUS"
        ],
        "sources": [
          "lesmills-upright-row"
        ],
        "note": "c5"
      }
    }
  ],
  zooms: [
    {
      "key": "urow-top",
      "chip": "Top",
      "heading": "Top position",
      "kind": "posture",
      "feelRow": "shoulder"
    }
  ],
  chips: [
    "urow-top",
    "feel"
  ],
  copy: {
    "setupLine": "Stand tall, feet about shoulder width. Overhand grip about shoulder width or wider.",
    "mistakeLine": "Never pull the bar under your chin. Stop with the elbows level with the shoulders.",
    "cueLine": "Elbows to shoulder height.",
    "variantLine": "Cable version: same form. May feel easier on the shoulders."
  },
  mistakes: [
    {
      "key": "chin",
      "title": "Bar pulled under the chin",
      "zoom": "urow-top",
      "claim": {
        "tags": [
          "MECH",
          "CONSENSUS"
        ],
        "sources": [
          "lesmills-upright-row"
        ],
        "note": "c5"
      },
      "fix": "Stop at the lower ribs, elbows level with the shoulders."
    },
    {
      "key": "narrow",
      "title": "Hands too close together",
      "claim": {
        "tags": [
          "MECH",
          "CONSENSUS"
        ],
        "sources": [
          "lesmills-upright-row"
        ],
        "note": "c5"
      },
      "fix": "Widen the grip to about shoulder width or more."
    },
    {
      "key": "wrists",
      "title": "Lifting with wrists, elbows dropping",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-upright-row"
        ],
        "note": "c3"
      },
      "fix": "Lead with the elbows out to the sides."
    }
  ],
  risks: [
    {
      "key": "pinch",
      "text": "Shoulder pinching at the top when the elbows rise above the shoulders.",
      "claim": {
        "tags": [
          "MECH",
          "CONSENSUS"
        ],
        "sources": [
          "lesmills-upright-row"
        ],
        "note": "c5"
      }
    },
    {
      "key": "common",
      "text": "The shoulder is a common injury site in weight training.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "kolber2010"
        ],
        "note": "c13"
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
    "sl-upright-row",
    "lesmills-upright-row",
    "mcallister2013",
    "kolber2010",
    "baechle-grip",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/upright_row.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

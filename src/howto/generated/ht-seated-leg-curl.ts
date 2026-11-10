// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=536311bac8dffb1c6c934223de6989fbdf16a6e42e83c60bac29d7652f40a763
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_seated_leg_curl",
  name: "Seated Leg Curl",
  hashes: { inputsSha256: "536311bac8dffb1c6c934223de6989fbdf16a6e42e83c60bac29d7652f40a763", golden: "e41f404b910bd0c60d47935873976cb155227d9c8f9cd68f9d446e3260b4ae32" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"seated-leg-curl-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"seated-leg-curl-n-st-shank.l\" d=\"~#F12!-A1ABS1OKz1OUR1-a)48B1(*1Wc*5*7)2V3Kx2.ezb-aKbE3zfD3I)1)lR4S1B9S3D.1ym9A1.bK1W7PfykSj(k(5Hr.520200200100000000000001010100000200101000202000000100000010000010000000020000000\"/><path id=\"seated-leg-curl-n-st-foot.l\" d=\"~#o2!TO1W)T1GHO1K!S1NbR6A7xiW1)y1F(1Ow2R_1_R1Bx1wlEhUgRqJw1)gK1(cxsW1(x1020001000110120000200002202000200000100101010000\"/><path id=\"seated-leg-curl-n-st-shank.r\" d=\"^0\"/><path id=\"seated-leg-curl-n-st-foot.r\" d=\"^1\"/><path id=\"seated-leg-curl-n-g0-shank.r\" d=\"~#F12_xA1WUR1BFz1.JP1V5Oaw1lyH1yO11-93.4VI1*S1I2GfG7K9xeO6TB1KX1T4O1K9V2Fy1yV1toV8E8)2yhJ4UrDdHhPpSb10010000000000000001201010000002100100000011000100001000001200000100111010011101\"/><path id=\"seated-leg-curl-n-g0-foot.r\" d=\"~#o2HUI1FS-1VxJ1EPY1AdP1NgzaHmzrNY2ReXJ2w5zE1)2-nw3VF1AaVcEbAr-e*iFs002100001000001000010010011011121002202000000000\"/><path id=\"seated-leg-curl-n-g1-shank.r\" d=\"~#F12HYz1y-P1R.z1-GO1Y1-bD10U5((1!5)7Y2*3R4*y2A7Vd3)bK7Od(2xz2-2.3)5-7B4w)1E12*1-bTc_bxd!oaWlSdSo00002000000220000020000000000000000000101000000020000000000021002000100000200010\"/><path id=\"seated-leg-curl-n-g1-foot.r\" d=\"~#o2NzB1HV.1OyD1xy.1U9A9HjS1wy1G8YO2yG1Vw2XG1Ot.p*kVbRD1BgR3VgUuJ4xw1Hb100000010110002000001020010000000001010001111100\"/><path id=\"seated-leg-curl-n-e-thigh.l\" d=\"~#F12_Yo(.R1TGnX_R1*bi1F1W(1y3z7V6T3B3TU1x8RlVexkz2Bo!9xV1)2E4F2K8D5y(1wa4E1Ob)2)eYtHD1yq_z1_3!H1Rh00000120010100000000001000010100010100000000110000200020000000011000000000100000\"/><path id=\"seated-leg-curl-n-e-kneecap.l\" d=\"~~!-z1PYP1_J10\"/><path id=\"seated-leg-curl-n-e-shank.l\" d=\"~#F12AxA1F*O1.)A1E-N1H8O8y1oxx1_V1N9.2P4R1JA1IY1(dV6w7X9A2GfJH1)T14X47*9*F1AP1vnP5RaGh!1BpDcXcSh-3Yr00100002200000001010020200000000010000000000000000020000000200000100000121010000\"/><path id=\"seated-leg-curl-n-e-foot.l\" d=\"~#o2YTuHN-1zYvIR-1F2wdPe_cHw1UdJE1SP2-qzF2I8GD1X9*lElxA1y7IfwmWlRw1xa200000200000002000000212000000002010120100010000\"/><path id=\"seated-leg-curl-n-e-shcap.l\" d=\"~~_BlADy1wP10\"/><path id=\"seated-leg-curl-n-e-upper.l\" d=\"~#F12ADlWIy1-zlBPx1b*6a0U6FA1U2)4D1K2(2xo_7Xj*1IgBcKhK8XmV1x2V3E4(1_A1b0B1X6BhE7Ta(qS2HmUgYn20000002000010000110101010000000000001002101210001010010000220000000001010000000\"/><path id=\"seated-leg-curl-n-e-elbowcap.l\" d=\"~~NKmDHG1Dz10\"/><path id=\"seated-leg-curl-n-e-fore.l\" d=\"~#F12UOmS_G1)EmOAG1E2I8H1w1yjUu7O8kK2EaXleKe)4xa-bI8)aIlI2tR6I5YcWx12W1G5-6Ib1lFmU7Jfyi(c20011010011000200020000100020000000000000010001011000001010000011110100010101000\"/><path id=\"seated-leg-curl-n-e-fist.l\" d=\"~~HzqSRP1ww10\"/><path id=\"seated-leg-curl-n-e-head\" d=\"~#w12NDl_HoKSjKFoEgWlXhDcObT1R2D5-5B7O9xaOkVj(2Gd*2G9)iU2UkBeHlK9wlaFlAdA1Fj1001001000000000000002200020000200010100010000021010000000200010\"/><path id=\"seated-leg-curl-n-e-torso\" d=\"~#_12yJkwFtzOkVYr)9-3)12PcJfPaU4NfSdF6z1KaOmKn)3-b(6(eO7Jj*9HjTjFeIky3GaVaGe.w1)tXf-oG6y1K9Y1JfNdS4J7)dT5KeUaT2SlY7S6ycTd!3y6*K2FI110000001000100000000021002000200000111000000000200100010101000000000000000000200010002000010100120200000020000101100\"/><path id=\"seated-leg-curl-n-e-thigh.r\" d=\"^6\"/><path id=\"seated-leg-curl-n-e-kneecap.r\" d=\"^7\"/><path id=\"seated-leg-curl-n-e-shank.r\" d=\"^8\"/><path id=\"seated-leg-curl-n-e-foot.r\" d=\"^9\"/><path id=\"seated-leg-curl-n-e-shcap.r\" d=\"^10\"/><path id=\"seated-leg-curl-n-e-upper.r\" d=\"^11\"/><path id=\"seated-leg-curl-n-e-elbowcap.r\" d=\"^12\"/><path id=\"seated-leg-curl-n-e-fore.r\" d=\"^13\"/><path id=\"seated-leg-curl-n-e-fist.r\" d=\"^14\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#seated-leg-curl-n-dots)\"/>\n  <path class=\"floorline\" d=\"M58.31 339.77H299.69\"/><path class=\"eq\" d=\"~M!wlNFU1LY.90Qwp0Xy9)oL)owbQ0)o)o)aLXy9wpQ)o0Yy9wpLwp)aQ0wpwpwbZ\"/><path class=\"eq\" d=\"~MHzp_XU1L0(NcQ0F6F6VFcLAA1E6QF60zA1E6LE6VFcQ0E6E6WFcLzA1F6QE60AA1F6Z\"/><path class=\"eq\" d=\"~M!.jNFy2LYBc0QF60O)bE6LE6V8Q0E6E6W8LO)bF6QE60P)bF6LF6W8Q0F6F6V8Z\"/><path class=\"eq\" d=\"~MD_qWxw2L0EwbQ0)o)oFEaLAkwpQ)o0zkwpLwpFEaQ0wpwpEEaLzk)oQwp0Ak)oZ\"/><path class=\"eq\" d=\"~MUDl_*P1L.E2-)fQK3XoWI1PHfLHeHnQXoN3K7DqLD*2WzfQN3YoVI1THfLGeBnQYoK3N7GqZ\"/><path class=\"eq\" d=\"~MAyD1Wxw2L0XUdQ0)o)oY.cLAkwpQ)o0zkwpLwpY.cQ0wpwpX.cLzk)oQwp0Ak)oZ\"/><path class=\"eq\" d=\"~MSwrJxT1LJe.A3Q(1Rd)pJV2LUbPfQRd*1OfUbLy1F-2Q*1SdAqIV2LVbOfQSd(1PfTbZ\"/><path class=\"eq\" d=\"~MNJgNFy2LWVo0Q!m0-(n.mL.m!mQ0.m.m.mL-(n!mQ-m0!(n!mL_m.mQ0!m_m!mZ\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#seated-leg-curl-n-st-shank.l\"/><use href=\"#seated-leg-curl-n-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#seated-leg-curl-n-st-shank.l\"/><use href=\"#seated-leg-curl-n-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-leg-curl-n-st-shank.r\"/><use href=\"#seated-leg-curl-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#seated-leg-curl-n-st-shank.r\"/><use href=\"#seated-leg-curl-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq\" d=\"~My*A1PPR1Ly-3!.8QD7_gxx3ES8L)nT9Q_gB7U9)nLVy4-z8QB7-gyx3AS8LwoW9Q-gD7T9woZ\"/><path class=\"eq\" d=\"~~_.E1wW_1HS11\"/><path class=\"eq-pin\" d=\"~~!EG1wW_1F60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-leg-curl-n-g0-shank.r\"/><use href=\"#seated-leg-curl-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#seated-leg-curl-n-g0-shank.r\"/><use href=\"#seated-leg-curl-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq\" d=\"~MUPA1wDR1LIF2wJ9QG4Yh!V2*V8LOdxmQYhF4ymOdLHS1O(8QF4Xh.V2(V8LPdymQXhE4xmPdZ\"/><path class=\"eq\" d=\"~~Nzx1yF.1HS11\"/><path class=\"eq-pin\" d=\"~~POy1yF.1F60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-leg-curl-n-g1-shank.r\"/><use href=\"#seated-leg-curl-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#seated-leg-curl-n-g1-shank.r\"/><use href=\"#seated-leg-curl-n-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~M(JA1DWP1LBK7JB6QxeWb_H7TI5LJ2XpQWbyeYpJ2LNT6-E6QyeVb-H7WI5LI2YpQVbxeXpG2Z\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#seated-leg-curl-n-e-thigh.l\"/><use href=\"#seated-leg-curl-n-e-kneecap.l\"/><use href=\"#seated-leg-curl-n-e-shank.l\"/><use href=\"#seated-leg-curl-n-e-foot.l\"/><use href=\"#seated-leg-curl-n-e-shcap.l\"/><use href=\"#seated-leg-curl-n-e-upper.l\"/><use href=\"#seated-leg-curl-n-e-elbowcap.l\"/><use href=\"#seated-leg-curl-n-e-fore.l\"/><use href=\"#seated-leg-curl-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#seated-leg-curl-n-e-thigh.l\"/><use href=\"#seated-leg-curl-n-e-kneecap.l\"/><use href=\"#seated-leg-curl-n-e-shank.l\"/><use href=\"#seated-leg-curl-n-e-foot.l\"/><use href=\"#seated-leg-curl-n-e-shcap.l\"/><use href=\"#seated-leg-curl-n-e-upper.l\"/><use href=\"#seated-leg-curl-n-e-elbowcap.l\"/><use href=\"#seated-leg-curl-n-e-fore.l\"/><use href=\"#seated-leg-curl-n-e-fist.l\"/></g></g><path class=\"eq\" d=\"~~AIrHVX1HS11\"/><path class=\"eq-pin\" d=\"~~AXsHVX1F60\"/><path class=\"eq\" d=\"~MF(y1WXK1LJV1(z3Q(2P5*J1Ix3L_c.dQP5)2Vi_2L*X1K.2Q*2O5!J1Jx3LVc!dQR5w3Ui-2Z\"/><path class=\"eq\" d=\"~~A-x1SGK1HS11\"/><path class=\"eq-pin\" d=\"~~ABz1SGK1F60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-leg-curl-n-e-head\"/><use href=\"#seated-leg-curl-n-e-torso\"/><use href=\"#seated-leg-curl-n-e-thigh.r\"/><use href=\"#seated-leg-curl-n-e-kneecap.r\"/><use href=\"#seated-leg-curl-n-e-shank.r\"/><use href=\"#seated-leg-curl-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#seated-leg-curl-n-e-head\"/><use href=\"#seated-leg-curl-n-e-torso\"/><use href=\"#seated-leg-curl-n-e-thigh.r\"/><use href=\"#seated-leg-curl-n-e-kneecap.r\"/><use href=\"#seated-leg-curl-n-e-shank.r\"/><use href=\"#seated-leg-curl-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-leg-curl-n-e-shcap.r\"/><use href=\"#seated-leg-curl-n-e-upper.r\"/><use href=\"#seated-leg-curl-n-e-elbowcap.r\"/><use href=\"#seated-leg-curl-n-e-fore.r\"/><use href=\"#seated-leg-curl-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#seated-leg-curl-n-e-shcap.r\"/><use href=\"#seated-leg-curl-n-e-upper.r\"/><use href=\"#seated-leg-curl-n-e-elbowcap.r\"/><use href=\"#seated-leg-curl-n-e-fore.r\"/><use href=\"#seated-leg-curl-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~~FIA1PYP1Nr0\"/><path class=\"eq-pin\" d=\"~~NwB1PYP1F60\"/><path class=\"eq-line m-line\" d=\"~MDzP1HDW1L-3EjLz7(2LI5N5L*2y7L0U7L(2y7LN5N5Ly7(2LU70Ly7*2LN5K5L(2)6L0X7L*2)6LI5K5Lz7*2\"/><circle class=\"joint\" cx=\"116.13\" cy=\"175.06\" r=\"2.25\"/><circle class=\"joint\" cx=\"120.42\" cy=\"211.55\" r=\"2.25\"/><circle class=\"joint\" cx=\"128.13\" cy=\"243.13\" r=\"2.25\"/><circle class=\"joint\" cx=\"190.51\" cy=\"249.68\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#N20(HP1!)V1*RP1XRV1f9j9f9fbfbfbfddbdfdfbdbhbdbh7hbf5j9h7h3j7h3l3h3j3h0l1j0l2h0j2j4j2l6f6l4h8j8h000000100000222002000200020000000000010100012000000002110121010200000101000000200000100000000010020010002101000001002000021000000111100020000101010120002000\"/><path class=\"arrow\" d=\"~M_wvWO.1L_G1G2LVY1WA1Z\"/></g><path class=\"leader\" d=\"M190.51 249.68L209 216H219\"/><circle class=\"anchor\" cx=\"190.51\" cy=\"249.68\" r=\"1.5\"/><path class=\"leader\" d=\"~MADz1wXI1L0))6\"/><circle class=\"anchor\" cx=\"180.18\" cy=\"223.84\" r=\"1.5\"/><path class=\"leader\" d=\"M148.06 285.01L126.93 308H116.93\"/><circle class=\"anchor\" cx=\"148.06\" cy=\"285.01\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"seated-leg-curl-n-pivot\" data-key=\"pivot\" data-cue=\"Line your knees up with the machine’s pivot.\" class=\"plate-callout two\" style=\"left:59.78%;top:54.19%\" aria-pressed=\"true\">Knee at<br>pivot</button><button type=\"button\" id=\"seated-leg-curl-n-thigh\" data-key=\"thigh\" data-cue=\"Set the thigh pad snug just above your knees.\" class=\"plate-callout two\" style=\"left:41.9%;top:41.34%\" aria-pressed=\"false\">Pad above<br>knees</button><button type=\"button\" id=\"seated-leg-curl-n-ankle\" data-key=\"ankle\" data-cue=\"Set the ankle pad just above your shoes, below your calves.\" class=\"plate-callout two\" style=\"left:11.17%;top:79.89%\" aria-pressed=\"false\">Pad above<br>shoes</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"seated-leg-curl-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"seated-leg-curl-m-st-shank.l\" d=\"^0\"/><path id=\"seated-leg-curl-m-st-foot.l\" d=\"^1\"/><path id=\"seated-leg-curl-m-st-shank.r\" d=\"^0\"/><path id=\"seated-leg-curl-m-st-foot.r\" d=\"^1\"/><path id=\"seated-leg-curl-m-g0-shank.r\" d=\"^2\"/><path id=\"seated-leg-curl-m-g0-foot.r\" d=\"^3\"/><path id=\"seated-leg-curl-m-g1-shank.r\" d=\"^4\"/><path id=\"seated-leg-curl-m-g1-foot.r\" d=\"^5\"/><path id=\"seated-leg-curl-m-e-thigh.l\" d=\"^6\"/><path id=\"seated-leg-curl-m-e-kneecap.l\" d=\"^7\"/><path id=\"seated-leg-curl-m-e-shank.l\" d=\"^8\"/><path id=\"seated-leg-curl-m-e-foot.l\" d=\"^9\"/><path id=\"seated-leg-curl-m-e-shcap.l\" d=\"^10\"/><path id=\"seated-leg-curl-m-e-upper.l\" d=\"^11\"/><path id=\"seated-leg-curl-m-e-elbowcap.l\" d=\"^12\"/><path id=\"seated-leg-curl-m-e-fore.l\" d=\"^13\"/><path id=\"seated-leg-curl-m-e-fist.l\" d=\"^14\"/><path id=\"seated-leg-curl-m-e-head\" d=\"^15\"/><path id=\"seated-leg-curl-m-e-torso\" d=\"^16\"/><path id=\"seated-leg-curl-m-e-thigh.r\" d=\"^6\"/><path id=\"seated-leg-curl-m-e-kneecap.r\" d=\"^7\"/><path id=\"seated-leg-curl-m-e-shank.r\" d=\"^8\"/><path id=\"seated-leg-curl-m-e-foot.r\" d=\"^9\"/><path id=\"seated-leg-curl-m-e-shcap.r\" d=\"^10\"/><path id=\"seated-leg-curl-m-e-upper.r\" d=\"^11\"/><path id=\"seated-leg-curl-m-e-elbowcap.r\" d=\"^12\"/><path id=\"seated-leg-curl-m-e-fore.r\" d=\"^13\"/><path id=\"seated-leg-curl-m-e-fist.r\" d=\"^14\"/><path id=\"seated-leg-curl-m-m-foot.l\" d=\"~#o2Y!tSG-1-*ux_Y1P8Da(i_3_y1G4HH2yS1E.1xR1Iq)sIjzeOA1RkR1*g!t_7zx1U7100200101002100000012120002000001010010111020001\"/><path id=\"seated-leg-curl-m-m-foot.r\" d=\"^46\"/><path id=\"seated-leg-curl-m-mf-head\" d=\"^15\"/><path id=\"seated-leg-curl-m-mf-torso\" d=\"^16\"/><path id=\"seated-leg-curl-m-mf-thigh.l\" d=\"^6\"/><path id=\"seated-leg-curl-m-mf-kneecap.l\" d=\"^7\"/><path id=\"seated-leg-curl-m-mf-shank.l\" d=\"^8\"/><path id=\"seated-leg-curl-m-mf-shcap.l\" d=\"^10\"/><path id=\"seated-leg-curl-m-mf-upper.l\" d=\"^11\"/><path id=\"seated-leg-curl-m-mf-elbowcap.l\" d=\"^12\"/><path id=\"seated-leg-curl-m-mf-fore.l\" d=\"^13\"/><path id=\"seated-leg-curl-m-mf-fist.l\" d=\"^14\"/><path id=\"seated-leg-curl-m-mf-thigh.r\" d=\"^6\"/><path id=\"seated-leg-curl-m-mf-kneecap.r\" d=\"^7\"/><path id=\"seated-leg-curl-m-mf-shank.r\" d=\"^8\"/><path id=\"seated-leg-curl-m-mf-shcap.r\" d=\"^10\"/><path id=\"seated-leg-curl-m-mf-upper.r\" d=\"^11\"/><path id=\"seated-leg-curl-m-mf-elbowcap.r\" d=\"^12\"/><path id=\"seated-leg-curl-m-mf-fore.r\" d=\"^13\"/><path id=\"seated-leg-curl-m-mf-fist.r\" d=\"^14\"/><path id=\"seated-leg-curl-m-mo-0\" d=\"^15\"/><path id=\"seated-leg-curl-m-mo-1\" d=\"^16\"/><path id=\"seated-leg-curl-m-mo-2\" d=\"^6\"/><path id=\"seated-leg-curl-m-mo-3\" d=\"^7\"/><path id=\"seated-leg-curl-m-mo-4\" d=\"^8\"/><path id=\"seated-leg-curl-m-mo-5\" d=\"^9\"/><path id=\"seated-leg-curl-m-mo-6\" d=\"^10\"/><path id=\"seated-leg-curl-m-mo-7\" d=\"^11\"/><path id=\"seated-leg-curl-m-mo-8\" d=\"^12\"/><path id=\"seated-leg-curl-m-mo-9\" d=\"^13\"/><path id=\"seated-leg-curl-m-mo-10\" d=\"^14\"/><path id=\"seated-leg-curl-m-mo-11\" d=\"^6\"/><path id=\"seated-leg-curl-m-mo-12\" d=\"^7\"/><path id=\"seated-leg-curl-m-mo-13\" d=\"^8\"/><path id=\"seated-leg-curl-m-mo-14\" d=\"^9\"/><path id=\"seated-leg-curl-m-mo-15\" d=\"^10\"/><path id=\"seated-leg-curl-m-mo-16\" d=\"^11\"/><path id=\"seated-leg-curl-m-mo-17\" d=\"^12\"/><path id=\"seated-leg-curl-m-mo-18\" d=\"^13\"/><path id=\"seated-leg-curl-m-mo-19\" d=\"^14\"/><path id=\"seated-leg-curl-m-mo-20\" d=\"^32\"/><path id=\"seated-leg-curl-m-mo-21\" d=\"^33\"/><path id=\"seated-leg-curl-m-mo-22\" d=\"^34\"/><path id=\"seated-leg-curl-m-mo-23\" d=\"^38\"/><path id=\"seated-leg-curl-m-mo-24\" d=\"^39\"/><path id=\"seated-leg-curl-m-mo-25\" d=\"^35\"/><path id=\"seated-leg-curl-m-mo-26\" d=\"^36\"/><path id=\"seated-leg-curl-m-mo-27\" d=\"^37\"/><path id=\"seated-leg-curl-m-mo-28\" d=\"^18\"/><path id=\"seated-leg-curl-m-mo-29\" d=\"^19\"/><path id=\"seated-leg-curl-m-mo-30\" d=\"^20\"/><path id=\"seated-leg-curl-m-mo-31\" d=\"^21\"/><path id=\"seated-leg-curl-m-mo-32\" d=\"^22\"/><path id=\"seated-leg-curl-m-mo-33\" d=\"^23\"/><path id=\"seated-leg-curl-m-mo-34\" d=\"^24\"/><path id=\"seated-leg-curl-m-mo-35\" d=\"^25\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#seated-leg-curl-m-dots)\"/>\n  <path class=\"floorline\" d=\"^17\"/><path class=\"eq\" d=\"^18\"/><path class=\"eq\" d=\"^19\"/><path class=\"eq\" d=\"^20\"/><path class=\"eq\" d=\"^21\"/><path class=\"eq\" d=\"^22\"/><path class=\"eq\" d=\"^23\"/><path class=\"eq\" d=\"^24\"/><path class=\"eq\" d=\"^25\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#seated-leg-curl-m-st-shank.l\"/><use href=\"#seated-leg-curl-m-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#seated-leg-curl-m-st-shank.l\"/><use href=\"#seated-leg-curl-m-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-leg-curl-m-st-shank.r\"/><use href=\"#seated-leg-curl-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#seated-leg-curl-m-st-shank.r\"/><use href=\"#seated-leg-curl-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq\" d=\"^26\"/><path class=\"eq\" d=\"^27\"/><path class=\"eq-pin\" d=\"^28\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-leg-curl-m-g0-shank.r\"/><use href=\"#seated-leg-curl-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#seated-leg-curl-m-g0-shank.r\"/><use href=\"#seated-leg-curl-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq\" d=\"^29\"/><path class=\"eq\" d=\"^30\"/><path class=\"eq-pin\" d=\"^31\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-leg-curl-m-g1-shank.r\"/><use href=\"#seated-leg-curl-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#seated-leg-curl-m-g1-shank.r\"/><use href=\"#seated-leg-curl-m-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^32\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#seated-leg-curl-m-e-thigh.l\"/><use href=\"#seated-leg-curl-m-e-kneecap.l\"/><use href=\"#seated-leg-curl-m-e-shank.l\"/><use href=\"#seated-leg-curl-m-e-foot.l\"/><use href=\"#seated-leg-curl-m-e-shcap.l\"/><use href=\"#seated-leg-curl-m-e-upper.l\"/><use href=\"#seated-leg-curl-m-e-elbowcap.l\"/><use href=\"#seated-leg-curl-m-e-fore.l\"/><use href=\"#seated-leg-curl-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#seated-leg-curl-m-e-thigh.l\"/><use href=\"#seated-leg-curl-m-e-kneecap.l\"/><use href=\"#seated-leg-curl-m-e-shank.l\"/><use href=\"#seated-leg-curl-m-e-foot.l\"/><use href=\"#seated-leg-curl-m-e-shcap.l\"/><use href=\"#seated-leg-curl-m-e-upper.l\"/><use href=\"#seated-leg-curl-m-e-elbowcap.l\"/><use href=\"#seated-leg-curl-m-e-fore.l\"/><use href=\"#seated-leg-curl-m-e-fist.l\"/></g></g><path class=\"eq\" d=\"^33\"/><path class=\"eq-pin\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq-pin\" d=\"^37\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-leg-curl-m-e-head\"/><use href=\"#seated-leg-curl-m-e-torso\"/><use href=\"#seated-leg-curl-m-e-thigh.r\"/><use href=\"#seated-leg-curl-m-e-kneecap.r\"/><use href=\"#seated-leg-curl-m-e-shank.r\"/><use href=\"#seated-leg-curl-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#seated-leg-curl-m-e-head\"/><use href=\"#seated-leg-curl-m-e-torso\"/><use href=\"#seated-leg-curl-m-e-thigh.r\"/><use href=\"#seated-leg-curl-m-e-kneecap.r\"/><use href=\"#seated-leg-curl-m-e-shank.r\"/><use href=\"#seated-leg-curl-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#seated-leg-curl-m-e-shcap.r\"/><use href=\"#seated-leg-curl-m-e-upper.r\"/><use href=\"#seated-leg-curl-m-e-elbowcap.r\"/><use href=\"#seated-leg-curl-m-e-fore.r\"/><use href=\"#seated-leg-curl-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#seated-leg-curl-m-e-shcap.r\"/><use href=\"#seated-leg-curl-m-e-upper.r\"/><use href=\"#seated-leg-curl-m-e-elbowcap.r\"/><use href=\"#seated-leg-curl-m-e-fore.r\"/><use href=\"#seated-leg-curl-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^38\"/><path class=\"eq-pin\" d=\"^39\"/><path class=\"eq-line m-line\" d=\"^40\"/><circle class=\"joint\" cx=\"116.13\" cy=\"175.06\" r=\"2.25\"/><circle class=\"joint\" cx=\"120.42\" cy=\"211.55\" r=\"2.25\"/><circle class=\"joint\" cx=\"128.13\" cy=\"243.13\" r=\"2.25\"/><circle class=\"joint\" cx=\"190.51\" cy=\"249.68\" r=\"2.25\"/></g><mask id=\"seated-leg-curl-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#seated-leg-curl-m-mf-head\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-torso\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-shank.l\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-m-foot.l\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-upper.l\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-fore.l\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-fist.l\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-shank.r\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-m-foot.r\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-upper.r\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-fore.r\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mf-fist.r\" fill=\"#000\"/><use href=\"#seated-leg-curl-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#seated-leg-curl-m-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#seated-leg-curl-m-mmask)\"><g class=\"u-stroke\"><use href=\"#seated-leg-curl-m-m-foot.l\"/><use href=\"#seated-leg-curl-m-m-foot.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"M164.62 334.87A36 36 0 0 0 185.28 317.53M185.53 322.53L185.28 317.53L180.56 319.17\"/><path class=\"leader m\" d=\"~MHwy1yJ)1LN-fRf\"/><path class=\"leader m\" d=\"M160.65 278.58L112.75 306H102.75\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"seated-leg-curl-m-flexed\" data-key=\"flexed\" data-cue=\"Your feet flex up as if you were standing.\" class=\"plate-callout two m\" style=\"left:69.83%;top:83.8%\" aria-pressed=\"true\">Feet<br>flexed up</button><button type=\"button\" id=\"seated-leg-curl-m-calves\" data-key=\"calves\" data-cue=\"You push the pad with your calves instead of pointing your toes.\" class=\"plate-callout two m\" style=\"left:13.41%;top:79.33%\" aria-pressed=\"false\">Calves<br>push</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "pivot",
        cues: [{ key: "pivot", cue: "Line your knees up with the machine’s pivot." }, { key: "thigh", cue: "Set the thigh pad snug just above your knees." }, { key: "ankle", cue: "Set the ankle pad just above your shoes, below your calves." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "flexed",
        cues: [{ key: "flexed", cue: "Your feet flex up as if you were standing." }, { key: "calves", cue: "You push the pad with your calves instead of pointing your toes." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Feet flexed up</b><span>Your feet flex up as if you were standing.</span></li><li><b>Calves push</b><span>You push the pad with your calves instead of pointing your toes.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: curl 1 second, return 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Curl</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div></div>",
      alt: "Seated leg curl, side view. Seated with the back on the pad, knees in line with the machine pivot, the thigh pad just above the knees and the ankle pad just above the shoes, the lifter curls the feet under the seat with the toes pointed.",
      mistakeAlt: "Seated Leg Curl: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP: the card gives no thumb, contact or wrist claim."
  },
  contacts: [
    "seat-back",
    "pivot-pad"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set the seat so your knees line up with the pivot.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slc"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "adjust",
      "text": "Thigh pad snug above your knees, ankle pad just above your shoes.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-legcurl"
        ],
        "note": "c2, c3"
      }
    },
    {
      "kind": "position",
      "text": "Back flat against the back pad. Breathe out as you curl.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slc",
          "bb-legcurl"
        ],
        "note": "c4, c5"
      }
    },
    {
      "kind": "grip",
      "text": "Grip the handles and press your hips into the seat.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-legcurl"
        ],
        "note": "c5"
      }
    },
    {
      "kind": "position",
      "text": "Brace your trunk. Curl slowly, as far as you can. Straighten slowly.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slc",
          "bb-legcurl"
        ],
        "note": "c6, c7"
      }
    }
  ],
  posture: [
    {
      "key": "pivot",
      "label": "Knees at pivot",
      "detail": "Knees stay in line with the pivot. Set the seat and leg pad.",
      "anchor": {
        "pose": "start",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slc"
        ],
        "note": "c1, c9"
      }
    },
    {
      "key": "ankle-pad",
      "label": "Pad above shoes",
      "detail": "Ankle pad just above the shoes, never high on the calves.",
      "anchor": {
        "pose": "start",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-legcurl"
        ],
        "note": "c3"
      }
    },
    {
      "key": "hips",
      "label": "Hips down",
      "detail": "Hips stay down in the seat.",
      "anchor": {
        "pose": "end",
        "at": "seat"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-legcurl"
        ],
        "note": "c5"
      }
    },
    {
      "key": "grip",
      "label": "Hands on handles",
      "detail": "Hands on the side handles, squeezed.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-legcurl"
        ],
        "note": "c5"
      }
    },
    {
      "key": "curl",
      "label": "Full curl",
      "detail": "Curl as far as you can, slow and controlled.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slc"
        ],
        "note": "c6"
      }
    },
    {
      "key": "breathe",
      "label": "Breathe out",
      "detail": "Breathe out as you curl.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-legcurl"
        ],
        "note": "c5"
      }
    },
    {
      "key": "calves",
      "label": "Pushing with calves",
      "detail": "Point your toes, or lower the weight.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-legcurl"
        ],
        "note": "c10"
      }
    },
    {
      "key": "swing",
      "label": "Swinging heavy weight",
      "detail": "Lower the weight. Keep it slow.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slc"
        ],
        "note": "c8"
      }
    },
    {
      "key": "return",
      "label": "Slow return",
      "detail": "Straighten slowly. Don't let the weights clang.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-legcurl",
          "sl-slc"
        ],
        "note": "c7"
      }
    }
  ],
  zooms: [],
  copy: {
    "setupLine": "Set the seat so your knees line up with the pivot. Thigh pad snug just above your knees.",
    "mistakeLine": "Point your toes, don't push with your calves. If they cramp, lower the weight.",
    "cueLine": "Knees in line with the pivot."
  },
  mistakes: [],
  risks: [
    {
      "key": "pivot",
      "text": "Knees out of line with the pivot can hurt.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slc"
        ],
        "note": "c1"
      }
    },
    {
      "key": "swing",
      "text": "Too much weight turns the curl into a swing.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-slc"
        ],
        "note": "c8"
      }
    }
  ],
  riskFlags: [
    "knee"
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
    "sl-slc",
    "bb-legcurl",
    "maeo-2021",
    "nhs-knee-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/seated_leg_curl.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

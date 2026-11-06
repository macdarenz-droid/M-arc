// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=7474a431afe4903e1dec7a9dd95f53fbe8c2e6777db4b9c5e17306104668decb
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_barbell_shrug",
  name: "Barbell Shrug",
  hashes: { inputsSha256: "7474a431afe4903e1dec7a9dd95f53fbe8c2e6777db4b9c5e17306104668decb", golden: "b548422d3b32e15af554327f2d50e67dee7b3cfb43a0a67b4a7bae8fa8919848" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"barbell-shrug-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"barbell-shrug-n-st-shcap.r\" d=\"~~w!w1SEqwP10\"/><path id=\"barbell-shrug-n-st-upper.r\" d=\"~#F12S!w1_NqzYw1IIpr.8a3S9YN1F2K6uz33-D1A7zkO2Eg-c)gKbzB1*1X2)3I5!4JO1b2X1X8BgJ1V9HrJ3DmNhDn12002021000220210002000200000100001010200000000220200000000000000000001000020010\"/><path id=\"barbell-shrug-n-st-elbowcap.r\" d=\"~~_Vy1PKz1Dz10\"/><path id=\"barbell-shrug-n-st-fore.r\" d=\"~#F12_Uy1HUz1TSy1EYy15IaA1W1JbyH1Y1.9D1R2T5Ow1J4-dx2xbx9EbO6Iw1x2)1B5O8S4HI1bw2R3-9xaW1X6FlF3!g!dHh00002020000101010000000000200020000022200000000002200000000010110012000100011101\"/><path id=\"barbell-shrug-n-st-fist.r\" d=\"~~SSA1AxK1ww10\"/><path id=\"barbell-shrug-n-e-thigh.l\" d=\"~#F12F)v(_E1K-vzJD1G2TbE10D6S(1U5B8U2*34EV1JbOnrBkGdKm*4*U1.2-3E6R7pY(1F10J1-bXvOazk!G1U1_z1Un(E120220000011010010100021001002000000000121020010020111002002000001100020101100000\"/><path id=\"barbell-shrug-n-e-kneecap.l\" d=\"~~HPx1D)T1_J10\"/><path id=\"barbell-shrug-n-e-shank.l\" d=\"~#F12YNx1A*T1RUx1xNS1J2-bD14A2A)1H6T7(2-3rxz2(7Gdg*bV6)dW6Vy2T2)3T5B8T7W(1B11G1-bGdybIeAorWlAcDp20012100120000000001011101012000000021000002100101000000200012101000100020010000\"/><path id=\"barbell-shrug-n-e-foot.l\" d=\"~#o2DOx1AB)1Xwy1zB(1YcF3Uhx8Sp)nU-2B3-J2-4ID1)7)n2TG1Y4Bb-c_sBbKmSp021002110110100101000020000200100111000010111100\"/><path id=\"barbell-shrug-n-e-shcap.l\" d=\"~~w!w1!-owP10\"/><path id=\"barbell-shrug-n-e-upper.l\" d=\"~#F12S!w1yxpzYw1T*nr.883S9YN1F2I6uB31.D1A7)jO2GgXc*gObEB1-1T2z4O5!4PO191-1V8BgJ1V9HrJ3DmNhAn12000001100200002000000020020000000000000100020011220001000000000200200021200110\"/><path id=\"barbell-shrug-n-e-elbowcap.l\" d=\"~~SVy1_)x1Dz10\"/><path id=\"barbell-shrug-n-e-fore.l\" d=\"~#F12SUy1SDy1ISy1KHx15Kay1W1NbyH1Y1.9A1R2R5Kw1J4.dx2xbx9EbO6Iw1)1)1B5O8P4HI1bw2R3-9)9W1-6DlF3!g_dJh20002000012101010000120200011000000000000000000000000000000100010111110100101200\"/><path id=\"barbell-shrug-n-e-fist.l\" d=\"~~ySA1PTI1ww10\"/><path id=\"barbell-shrug-n-e-head\" d=\"~#w12wJy1SEg-Yw1**fBjDjBjS9BbB3E3_4X4)7x8BbRhKm_4XcT1T9Bj0NmBbHmK6!kF3Dj(fT1Fj0001010100001000000000101000000002000000000000100002200000020000\"/><path id=\"barbell-shrug-n-e-torso\" d=\"~#_12w!w1S)kTBx1zRjR9GtB3NrS9HvU9.bYcwgN60I6)nKm)7Xc_4(f-4_kI6NmxgShRh_4R9)7xgBrBz1EbBrG60V90!cwgA3w8Xc)7)fV5K6Py1N6yk_c.oA3w8zT2ww100012101000000000000000220022000122000100000000100000000000001001000000022101200000010000000001010000000001000020002\"/><path id=\"barbell-shrug-n-e-thigh.r\" d=\"^5\"/><path id=\"barbell-shrug-n-e-kneecap.r\" d=\"^6\"/><path id=\"barbell-shrug-n-e-shank.r\" d=\"^7\"/><path id=\"barbell-shrug-n-e-foot.r\" d=\"^8\"/><path id=\"barbell-shrug-n-e-shcap.r\" d=\"^9\"/><path id=\"barbell-shrug-n-e-upper.r\" d=\"^10\"/><path id=\"barbell-shrug-n-e-elbowcap.r\" d=\"^11\"/><path id=\"barbell-shrug-n-e-fore.r\" d=\"^12\"/><path id=\"barbell-shrug-n-e-fist.r\" d=\"^13\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#barbell-shrug-n-dots)\"/>\n  <path class=\"datum\" d=\"~MwXbSXoLwVm0\"/><path class=\"datum\" d=\"~MwXb!GnLwVm0\"/><path class=\"floorline\" d=\"M110.17 339.5H256.46\"/><path class=\"arc measure\" d=\"M183.16 174.05L180.45 156.26A18 18 0 0 1 186.46 191.75Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-shrug-n-st-shcap.r\"/><use href=\"#barbell-shrug-n-st-upper.r\"/><use href=\"#barbell-shrug-n-st-elbowcap.r\"/><use href=\"#barbell-shrug-n-st-fore.r\"/><use href=\"#barbell-shrug-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-shrug-n-st-shcap.r\"/><use href=\"#barbell-shrug-n-st-upper.r\"/><use href=\"#barbell-shrug-n-st-elbowcap.r\"/><use href=\"#barbell-shrug-n-st-fore.r\"/><use href=\"#barbell-shrug-n-st-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-line\" d=\"~~JAvPTI1WK62\"/><path class=\"eq-thin\" d=\"~~JGw1PTI1WF50\"/><path class=\"eq-solid\" d=\"~~F.A1PTI1!m1\"/><path class=\"eq-pin\" d=\"~~_IB1PTI1F60\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#barbell-shrug-n-e-thigh.l\"/><use href=\"#barbell-shrug-n-e-kneecap.l\"/><use href=\"#barbell-shrug-n-e-shank.l\"/><use href=\"#barbell-shrug-n-e-foot.l\"/><use href=\"#barbell-shrug-n-e-shcap.l\"/><use href=\"#barbell-shrug-n-e-upper.l\"/><use href=\"#barbell-shrug-n-e-elbowcap.l\"/><use href=\"#barbell-shrug-n-e-fore.l\"/><use href=\"#barbell-shrug-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#barbell-shrug-n-e-thigh.l\"/><use href=\"#barbell-shrug-n-e-kneecap.l\"/><use href=\"#barbell-shrug-n-e-shank.l\"/><use href=\"#barbell-shrug-n-e-foot.l\"/><use href=\"#barbell-shrug-n-e-shcap.l\"/><use href=\"#barbell-shrug-n-e-upper.l\"/><use href=\"#barbell-shrug-n-e-elbowcap.l\"/><use href=\"#barbell-shrug-n-e-fore.l\"/><use href=\"#barbell-shrug-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-shrug-n-e-head\"/><use href=\"#barbell-shrug-n-e-torso\"/><use href=\"#barbell-shrug-n-e-thigh.r\"/><use href=\"#barbell-shrug-n-e-kneecap.r\"/><use href=\"#barbell-shrug-n-e-shank.r\"/><use href=\"#barbell-shrug-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-shrug-n-e-head\"/><use href=\"#barbell-shrug-n-e-torso\"/><use href=\"#barbell-shrug-n-e-thigh.r\"/><use href=\"#barbell-shrug-n-e-kneecap.r\"/><use href=\"#barbell-shrug-n-e-shank.r\"/><use href=\"#barbell-shrug-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-shrug-n-e-shcap.r\"/><use href=\"#barbell-shrug-n-e-upper.r\"/><use href=\"#barbell-shrug-n-e-elbowcap.r\"/><use href=\"#barbell-shrug-n-e-fore.r\"/><use href=\"#barbell-shrug-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-shrug-n-e-shcap.r\"/><use href=\"#barbell-shrug-n-e-upper.r\"/><use href=\"#barbell-shrug-n-e-elbowcap.r\"/><use href=\"#barbell-shrug-n-e-fore.r\"/><use href=\"#barbell-shrug-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~#o2SRD1UKI1.SD1z*H1x8-2R5R6R1I8_2z8S6R5!7xy2_1WA2w8N5Y1P9K5(7wnWw2000000010102001011000001000002000002000020000000\"/><path class=\"eq-solid\" d=\"~~HBB1PTI1_c0\"/><path class=\"eq-pin\" d=\"^23\"/><path class=\"eq-cable m-line\" d=\"~MPPw1HTmLz2A5L53L31L31L10L00L04L13L55L31L02L04L68L6aL8gL8eL4cL6aL48L68L42L42\"/><path class=\"eq-cable m-line\" d=\"~MPYB1PPqLE2K7L54L58L3aL1aL0gL3gL7gL3aL1aL08L24L40L80L64L18L66L00L82L45\"/><path class=\"eq-cable m-line\" d=\"~MH)B1AxK1Lt.4L.1mLG1N1LnY1L1w2LqY1LH1N1L!1mL!10L!1lLH1K1LqX1L1)1LnX1LG1K1L.1l\"/><circle class=\"joint\" cx=\"176\" cy=\"127.02\" r=\"2.25\"/><circle class=\"joint\" cx=\"183.16\" cy=\"174.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"176\" cy=\"203.45\" r=\"2.25\"/><circle class=\"joint\" cx=\"178.74\" cy=\"266.11\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#!20wJy1UWo)Iy1RXo0001020000010200000102000001020000000102000001020000010200000102000001020000000102000001020000000000000000000000000000000000000000000200000000000000020000000000000000010000000000000000000000000000000000000000000000000200000000000000020000000000000000010000000000000000000000\"/><path class=\"arrow\" d=\"~MwJy1HBmLYiPB1LEY1OB1Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M180.45 156.26A18 18 0 0 1 186.46 191.75\"/><g class=\"arc-ticks\"><path d=\"~MSIz1HGvLK8RX1\"/><path d=\"~M_FA1!VA1LFaFX1\"/></g><path class=\"leader\" d=\"~MwUE1wIx1LYA3Xw5\"/></g></g><path class=\"leader\" d=\"M194.58 192.42L217 185H227\"/><circle class=\"anchor\" cx=\"194.58\" cy=\"192.42\" r=\"1.5\"/><path class=\"leader\" d=\"~MwJy1!GnLF!4Te\"/><circle class=\"anchor\" cx=\"176\" cy=\"119.34\" r=\"1.5\"/><path class=\"leader\" d=\"~M_YuSXsL-_1p\"/><circle class=\"anchor\" cx=\"157.57\" cy=\"147.13\" r=\"1.5\"/>\n<g class=\"plate-zoom\" data-view=\"normal\" data-k=\"3.5\" data-c=\"110 274\" data-src=\"176 122.99\"><defs><clipPath id=\"barbell-shrug-n-zclip\"><circle cx=\"110\" cy=\"274\" r=\"52\"/></clipPath></defs><circle class=\"pz-src\" cx=\"176\" cy=\"122.99\" r=\"14.86\"/><path class=\"pz-link\" d=\"~M_Dx1YVqLBV7(Ph\"/><circle class=\"pz-bg\" cx=\"110\" cy=\"274\" r=\"52\"/><g class=\"pz-in\" clip-path=\"url(#barbell-shrug-n-zclip)\">\n  <defs><pattern id=\"barbell-shrug-n-z-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"barbell-shrug-n-z-st-shcap.r\" d=\"~~PEgPF*1wF50\"/><path id=\"barbell-shrug-n-z-st-upper.r\" d=\"~#F12NGg(x(1--f)B_1z3xvy15Nx1Hz5_7BmN3zbfxF4!oxD2V8x-1VJ1K.1GF1)x4R6R9ze.iwh!B5x16I6VuTY1!4.x1U)2(bWK2!!1AR200000010110000001011101000002000000000101001000002000200100010000200202000001010\"/><path id=\"barbell-shrug-n-z-st-elbowcap.r\" d=\"~~YRmHK*2D.32\"/><path id=\"barbell-shrug-n-z-st-fore.r\" d=\"~#F12HNmwB(2RDmVy.2nKA1!3(5!E1DT4D6Ky1A4x9XjXR3JfIP1E7TD1XvOE1-mBR3x7x7Bi-twgWX4O1(6KcGy1xz1w6RnyH2AbH.1WP1S!120002020001000000020000002000000000200001100010000200010000101101001010002101000\"/><path id=\"barbell-shrug-n-z-st-fist.r\" d=\"~~JDtwy)3wP30\"/><path id=\"barbell-shrug-n-z-e-thigh.l\" d=\"~#F12(ydH!J3RNcKYE3B8-F1I46YlY_6WjGsy9zemB_5UE1GS2x3TD2VN1RN2*gI-5GaEd)lRqT2!.6J45U4KG1*N3OA1KD2HS4P5U*3(S2SI400000010000000000020000010110000000101020002102000000200002100010010120000000000\"/><path id=\"barbell-shrug-n-z-e-kneecap.l\" d=\"~~WNiAIX4_!40\"/><path id=\"barbell-shrug-n-z-e-shank.l\" d=\"~#F12DGiyAX4O*iO)R4A8)F1J46J7(!6AmTqDaGd.2-H7UrON1_1.G1OnVP1JnVG7x9BeVjIsTqJ.6G43R4TG1TN1(D1xS1HU2I3(I2UH1HY200000000000000000000101000100000120200200100101000001100021010000000000010002021\"/><path id=\"barbell-shrug-n-z-e-foot.l\" d=\"~#o2WHiAP(5EFkzw.5YJ1DbU*1)rS-2)T2U-9Bb-J8XgID4xs)T20TR4_gBE1-J1_A3zE1KN2P-2000010001000100000000200210000000000000002000100\"/><path id=\"barbell-shrug-n-z-e-shcap.l\" d=\"~~PEgPFY1wF50\"/><path id=\"barbell-shrug-n-z-e-upper.l\" d=\"~#F12NGg_x-1*-f.BV1x3xvy15Hx1Jz5_7EmN3)abBF4wp)B2X8x-1TJ1O.1BF1)x4R6R9ze.i!g!B5z14E6TuTY1_4)x1U)2!bUK2!!1FR210000000000000101212100100002201111000100010101000010000000000022022002001001200\"/><path id=\"barbell-shrug-n-z-e-elbowcap.l\" d=\"~~wRmNKY2D.32\"/><path id=\"barbell-shrug-n-z-e-fore.l\" d=\"~#F12SKmwB-2*BmTyW2jOA1Y3(5!E1DT4D6Iy1A4x9Vj-R3NfGP1B7TD1-vRE1TmER3z7*6zi.t_fUX4K1(6KcEy1xz1(5TnAH2ybD.1YP1W!100010000000000000000001111000000000001010000100001010010101002020000000000002000\"/><path id=\"barbell-shrug-n-z-e-fist.l\" d=\"~~_AtFy_3wP30\"/><path id=\"barbell-shrug-n-z-e-head\" d=\"~#w12POlPFqG!f*DpBz2Fz2Bz2Ux1BE1EbEb_gXg)rxsBE1R*1KN2_gXJ1T5Tx1Bz20JN2EE1NN2Gm_F2AbDz2yY1T5Dz20100020000000100000000000000000000000100000100002201000000000000\"/><path id=\"barbell-shrug-n-z-e-torso\" d=\"~#_12PEgP!H1zGhz_B1Rx1ID3Bbww3Sx1UK3Ux1TG1YJ1wY1Nm2ImxU2KN2)r-J1_gyY1-gYF2KmNN2*X1S*1T*1_gTx1)r*X1B)2E.3BE1B)2Km0Tx11!J1yY1AbwsXJ1)r)X1)jKm_Y3NmJD2_J1BX2Abwszz9wP300000000001012021000100000010100011000000101000002101010000200000001011011010100001000200000000000000100001000200000\"/><path id=\"barbell-shrug-n-z-e-thigh.r\" d=\"^44\"/><path id=\"barbell-shrug-n-z-e-kneecap.r\" d=\"^45\"/><path id=\"barbell-shrug-n-z-e-shank.r\" d=\"^46\"/><path id=\"barbell-shrug-n-z-e-foot.r\" d=\"^47\"/><path id=\"barbell-shrug-n-z-e-shcap.r\" d=\"^48\"/><path id=\"barbell-shrug-n-z-e-upper.r\" d=\"^49\"/><path id=\"barbell-shrug-n-z-e-elbowcap.r\" d=\"^50\"/><path id=\"barbell-shrug-n-z-e-fore.r\" d=\"^51\"/><path id=\"barbell-shrug-n-z-e-fist.r\" d=\"^52\"/></defs>\n  \n  <path class=\"floorline\" d=\"M-120.41 1030.54H391.61\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-shrug-n-z-st-shcap.r\"/><use href=\"#barbell-shrug-n-z-st-upper.r\"/><use href=\"#barbell-shrug-n-z-st-elbowcap.r\"/><use href=\"#barbell-shrug-n-z-st-fore.r\"/><use href=\"#barbell-shrug-n-z-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-shrug-n-z-st-shcap.r\"/><use href=\"#barbell-shrug-n-z-st-upper.r\"/><use href=\"#barbell-shrug-n-z-st-elbowcap.r\"/><use href=\"#barbell-shrug-n-z-st-fore.r\"/><use href=\"#barbell-shrug-n-z-st-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-line\" d=\"~~YAaFy_3wPm2\"/><path class=\"eq-thin\" d=\"~~JDeFy_3NNi1\"/><path class=\"eq-solid\" d=\"~~_AuFy_3wP20\"/><path class=\"eq-pin\" d=\"~~SNw1Fy_3F60\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#barbell-shrug-n-z-e-thigh.l\"/><use href=\"#barbell-shrug-n-z-e-kneecap.l\"/><use href=\"#barbell-shrug-n-z-e-shank.l\"/><use href=\"#barbell-shrug-n-z-e-foot.l\"/><use href=\"#barbell-shrug-n-z-e-shcap.l\"/><use href=\"#barbell-shrug-n-z-e-upper.l\"/><use href=\"#barbell-shrug-n-z-e-elbowcap.l\"/><use href=\"#barbell-shrug-n-z-e-fore.l\"/><use href=\"#barbell-shrug-n-z-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#barbell-shrug-n-z-e-thigh.l\"/><use href=\"#barbell-shrug-n-z-e-kneecap.l\"/><use href=\"#barbell-shrug-n-z-e-shank.l\"/><use href=\"#barbell-shrug-n-z-e-foot.l\"/><use href=\"#barbell-shrug-n-z-e-shcap.l\"/><use href=\"#barbell-shrug-n-z-e-upper.l\"/><use href=\"#barbell-shrug-n-z-e-elbowcap.l\"/><use href=\"#barbell-shrug-n-z-e-fore.l\"/><use href=\"#barbell-shrug-n-z-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-shrug-n-z-e-head\"/><use href=\"#barbell-shrug-n-z-e-torso\"/><use href=\"#barbell-shrug-n-z-e-thigh.r\"/><use href=\"#barbell-shrug-n-z-e-kneecap.r\"/><use href=\"#barbell-shrug-n-z-e-shank.r\"/><use href=\"#barbell-shrug-n-z-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-shrug-n-z-e-head\"/><use href=\"#barbell-shrug-n-z-e-torso\"/><use href=\"#barbell-shrug-n-z-e-thigh.r\"/><use href=\"#barbell-shrug-n-z-e-kneecap.r\"/><use href=\"#barbell-shrug-n-z-e-shank.r\"/><use href=\"#barbell-shrug-n-z-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-shrug-n-z-e-shcap.r\"/><use href=\"#barbell-shrug-n-z-e-upper.r\"/><use href=\"#barbell-shrug-n-z-e-elbowcap.r\"/><use href=\"#barbell-shrug-n-z-e-fore.r\"/><use href=\"#barbell-shrug-n-z-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-shrug-n-z-e-shcap.r\"/><use href=\"#barbell-shrug-n-z-e-upper.r\"/><use href=\"#barbell-shrug-n-z-e-elbowcap.r\"/><use href=\"#barbell-shrug-n-z-e-fore.r\"/><use href=\"#barbell-shrug-n-z-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~#o2(yA1YK-3KEA1*TX3Gs)9Oj-mO5OtwaGs_mOjSr)D7S6AP7_rDjD6Ax1xj_rJP2Py7111011010000010121000000000100020010000000001010\"/><path class=\"eq-solid\" d=\"~~wFvFy_3_J10\"/><path class=\"eq-pin\" d=\"^59\"/><path class=\"eq-cable m-line\" d=\"~MD)eNRP1LO7yiLhfLf9L95L70L12L06L95LjlL95L34L8eLcsLmD1Lw1S1LqW1LgH1LiA1LgsLimLgcLg8\"/><path class=\"eq-cable m-line\" d=\"~MDIx1_E(1L-7xqLngLjqLdy1L5F1L1U1LdY1LnW1LfH1L9w1L0qLacLg6Lo3LicL4w1L6iLe8Li3Lkf\"/><path class=\"eq-cable m-line\" d=\"~MDzy1wy)3LK3BhLE6W2L.4Y4LR2J6L0Y6LS2J6L!4Y4LF6W2L!61LF6R2L!4.4LS2E6L0.6LR2E6L.4.4LE6R2\"/><circle class=\"joint\" cx=\"110\" cy=\"288.08\" r=\"2.25\"/><circle class=\"joint\" cx=\"135.07\" cy=\"452.71\" r=\"2.25\"/><circle class=\"joint\" cx=\"110\" cy=\"555.61\" r=\"2.25\"/><circle class=\"joint\" cx=\"119.6\" cy=\"774.9\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#!20POlD*X1OOlRwY10200010200010200010200010200010200010200010200010200010200010200010200010200010200010200010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000\"/><path class=\"arrow\" d=\"~MPOlH(R1LYiPB1LEY1OB1Z\"/></g>\n</g><circle class=\"pz-ring\" cx=\"110\" cy=\"274\" r=\"52\"/></g></svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"barbell-shrug-n-arms\" data-key=\"arms\" data-cue=\"Keep your elbows straight and let your arms just hang.\" class=\"plate-callout\" style=\"left:62.01%;top:45.53%\" aria-pressed=\"true\">Straight arms</button><button type=\"button\" id=\"barbell-shrug-n-up\" data-key=\"up\" data-cue=\"Move your shoulders only up and down, with no rolling.\" class=\"plate-callout\" style=\"left:54.75%;top:26.54%\" aria-pressed=\"false\">Straight up</button><button type=\"button\" id=\"barbell-shrug-n-back\" data-key=\"back\" data-cue=\"Keep your knees soft, your hips straight and your back tall.\" class=\"plate-callout\" style=\"left:20.67%;top:34.92%\" aria-pressed=\"false\">Back tall</button><span class=\"plate-arc-label\" style=\"left:62.01%;top:38.55%\"><b>Elbow</b><span>straight</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"barbell-shrug-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"barbell-shrug-m-st-shcap.r\" d=\"^0\"/><path id=\"barbell-shrug-m-st-upper.r\" d=\"^1\"/><path id=\"barbell-shrug-m-st-elbowcap.r\" d=\"^2\"/><path id=\"barbell-shrug-m-st-fore.r\" d=\"^3\"/><path id=\"barbell-shrug-m-st-fist.r\" d=\"^4\"/><path id=\"barbell-shrug-m-e-thigh.l\" d=\"^5\"/><path id=\"barbell-shrug-m-e-kneecap.l\" d=\"^6\"/><path id=\"barbell-shrug-m-e-shank.l\" d=\"^7\"/><path id=\"barbell-shrug-m-e-foot.l\" d=\"^8\"/><path id=\"barbell-shrug-m-e-shcap.l\" d=\"^9\"/><path id=\"barbell-shrug-m-e-upper.l\" d=\"^10\"/><path id=\"barbell-shrug-m-e-elbowcap.l\" d=\"^11\"/><path id=\"barbell-shrug-m-e-fore.l\" d=\"^12\"/><path id=\"barbell-shrug-m-e-fist.l\" d=\"^13\"/><path id=\"barbell-shrug-m-e-head\" d=\"^14\"/><path id=\"barbell-shrug-m-e-torso\" d=\"^15\"/><path id=\"barbell-shrug-m-e-thigh.r\" d=\"^5\"/><path id=\"barbell-shrug-m-e-kneecap.r\" d=\"^6\"/><path id=\"barbell-shrug-m-e-shank.r\" d=\"^7\"/><path id=\"barbell-shrug-m-e-foot.r\" d=\"^8\"/><path id=\"barbell-shrug-m-e-shcap.r\" d=\"^9\"/><path id=\"barbell-shrug-m-e-upper.r\" d=\"^10\"/><path id=\"barbell-shrug-m-e-elbowcap.r\" d=\"^11\"/><path id=\"barbell-shrug-m-e-fore.r\" d=\"^12\"/><path id=\"barbell-shrug-m-e-fist.r\" d=\"^13\"/><path id=\"barbell-shrug-m-m-upper.l\" d=\"~#F12!)w1wEoKNx1IEn!3.7a6xgSI1D5z4N2x2_jRvSgGdN6zf-1zlA9zA15E3jR6IkWG1b3y3z8zeE8TmAi.8UkU2!s10200100020010001010000000101000020220000100000020010100000020200120000110010000\"/><path id=\"barbell-shrug-m-m-elbowcap.l\" d=\"~~(WtHAx1Dz10\"/><path id=\"barbell-shrug-m-m-fore.l\" d=\"~#F12SyuUwy1zOtTJx1X6X7!1iHz1_o.4V8nV2ToxlK5KdT8B7Ee*2BpIk-27I9B3_uDuuY1.8z5*6N7J8UkFdwbYlN420001000100101010100020200000000100011000000000020000002000200001120000020200000\"/><path id=\"barbell-shrug-m-m-fist.l\" d=\"~~DFB1JHE1ww10\"/><path id=\"barbell-shrug-m-m-upper.r\" d=\"^67\"/><path id=\"barbell-shrug-m-m-elbowcap.r\" d=\"^68\"/><path id=\"barbell-shrug-m-m-fore.r\" d=\"^69\"/><path id=\"barbell-shrug-m-m-fist.r\" d=\"^70\"/><path id=\"barbell-shrug-m-m-eq0\" d=\"~~HRB1JHE1!m1\"/><path id=\"barbell-shrug-m-m-eq1\" d=\"~~(xD1JHE1F60\"/><path id=\"barbell-shrug-m-m-eq2\" d=\"~#o2U!D1YRD1xTD1EAD1x8w3K8K1R6O5)2x8N1K8Kz1EX1UJ1wT1U9pN7A6qU9J_1Sy1001010000000000101000002002100002021000010000000\"/><path id=\"barbell-shrug-m-m-eq3\" d=\"~~J.B1JHE1_c0\"/><path id=\"barbell-shrug-m-m-eq4\" d=\"^72\"/><path id=\"barbell-shrug-m-mf-head\" d=\"^14\"/><path id=\"barbell-shrug-m-mf-torso\" d=\"^15\"/><path id=\"barbell-shrug-m-mf-thigh.l\" d=\"^5\"/><path id=\"barbell-shrug-m-mf-kneecap.l\" d=\"^6\"/><path id=\"barbell-shrug-m-mf-shank.l\" d=\"^7\"/><path id=\"barbell-shrug-m-mf-foot.l\" d=\"^8\"/><path id=\"barbell-shrug-m-mf-shcap.l\" d=\"^9\"/><path id=\"barbell-shrug-m-mf-thigh.r\" d=\"^5\"/><path id=\"barbell-shrug-m-mf-kneecap.r\" d=\"^6\"/><path id=\"barbell-shrug-m-mf-shank.r\" d=\"^7\"/><path id=\"barbell-shrug-m-mf-foot.r\" d=\"^8\"/><path id=\"barbell-shrug-m-mf-shcap.r\" d=\"^9\"/><path id=\"barbell-shrug-m-mo-0\" d=\"^14\"/><path id=\"barbell-shrug-m-mo-1\" d=\"^15\"/><path id=\"barbell-shrug-m-mo-2\" d=\"^5\"/><path id=\"barbell-shrug-m-mo-3\" d=\"^6\"/><path id=\"barbell-shrug-m-mo-4\" d=\"^7\"/><path id=\"barbell-shrug-m-mo-5\" d=\"^8\"/><path id=\"barbell-shrug-m-mo-6\" d=\"^9\"/><path id=\"barbell-shrug-m-mo-7\" d=\"^10\"/><path id=\"barbell-shrug-m-mo-8\" d=\"^11\"/><path id=\"barbell-shrug-m-mo-9\" d=\"^12\"/><path id=\"barbell-shrug-m-mo-10\" d=\"^13\"/><path id=\"barbell-shrug-m-mo-11\" d=\"^5\"/><path id=\"barbell-shrug-m-mo-12\" d=\"^6\"/><path id=\"barbell-shrug-m-mo-13\" d=\"^7\"/><path id=\"barbell-shrug-m-mo-14\" d=\"^8\"/><path id=\"barbell-shrug-m-mo-15\" d=\"^9\"/><path id=\"barbell-shrug-m-mo-16\" d=\"^10\"/><path id=\"barbell-shrug-m-mo-17\" d=\"^11\"/><path id=\"barbell-shrug-m-mo-18\" d=\"^12\"/><path id=\"barbell-shrug-m-mo-19\" d=\"^13\"/><path id=\"barbell-shrug-m-mo-20\" d=\"^22\"/><path id=\"barbell-shrug-m-mo-21\" d=\"^23\"/><path id=\"barbell-shrug-m-mo-22\" d=\"^24\"/><path id=\"barbell-shrug-m-mo-23\" d=\"^25\"/><path id=\"barbell-shrug-m-mo-24\" d=\"^23\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#barbell-shrug-m-dots)\"/>\n  <path class=\"datum\" d=\"^16\"/><path class=\"floorline\" d=\"^18\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-shrug-m-st-shcap.r\"/><use href=\"#barbell-shrug-m-st-upper.r\"/><use href=\"#barbell-shrug-m-st-elbowcap.r\"/><use href=\"#barbell-shrug-m-st-fore.r\"/><use href=\"#barbell-shrug-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-shrug-m-st-shcap.r\"/><use href=\"#barbell-shrug-m-st-upper.r\"/><use href=\"#barbell-shrug-m-st-elbowcap.r\"/><use href=\"#barbell-shrug-m-st-fore.r\"/><use href=\"#barbell-shrug-m-st-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq-line\" d=\"^20\"/><path class=\"eq-thin\" d=\"^21\"/><path class=\"eq-solid\" d=\"^22\"/><path class=\"eq-pin\" d=\"^23\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#barbell-shrug-m-e-thigh.l\"/><use href=\"#barbell-shrug-m-e-kneecap.l\"/><use href=\"#barbell-shrug-m-e-shank.l\"/><use href=\"#barbell-shrug-m-e-foot.l\"/><use href=\"#barbell-shrug-m-e-shcap.l\"/><use href=\"#barbell-shrug-m-e-upper.l\"/><use href=\"#barbell-shrug-m-e-elbowcap.l\"/><use href=\"#barbell-shrug-m-e-fore.l\"/><use href=\"#barbell-shrug-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#barbell-shrug-m-e-thigh.l\"/><use href=\"#barbell-shrug-m-e-kneecap.l\"/><use href=\"#barbell-shrug-m-e-shank.l\"/><use href=\"#barbell-shrug-m-e-foot.l\"/><use href=\"#barbell-shrug-m-e-shcap.l\"/><use href=\"#barbell-shrug-m-e-upper.l\"/><use href=\"#barbell-shrug-m-e-elbowcap.l\"/><use href=\"#barbell-shrug-m-e-fore.l\"/><use href=\"#barbell-shrug-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-shrug-m-e-head\"/><use href=\"#barbell-shrug-m-e-torso\"/><use href=\"#barbell-shrug-m-e-thigh.r\"/><use href=\"#barbell-shrug-m-e-kneecap.r\"/><use href=\"#barbell-shrug-m-e-shank.r\"/><use href=\"#barbell-shrug-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-shrug-m-e-head\"/><use href=\"#barbell-shrug-m-e-torso\"/><use href=\"#barbell-shrug-m-e-thigh.r\"/><use href=\"#barbell-shrug-m-e-kneecap.r\"/><use href=\"#barbell-shrug-m-e-shank.r\"/><use href=\"#barbell-shrug-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-shrug-m-e-shcap.r\"/><use href=\"#barbell-shrug-m-e-upper.r\"/><use href=\"#barbell-shrug-m-e-elbowcap.r\"/><use href=\"#barbell-shrug-m-e-fore.r\"/><use href=\"#barbell-shrug-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-shrug-m-e-shcap.r\"/><use href=\"#barbell-shrug-m-e-upper.r\"/><use href=\"#barbell-shrug-m-e-elbowcap.r\"/><use href=\"#barbell-shrug-m-e-fore.r\"/><use href=\"#barbell-shrug-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^24\"/><path class=\"eq-solid\" d=\"^25\"/><path class=\"eq-pin\" d=\"^23\"/><circle class=\"joint\" cx=\"176\" cy=\"127.02\" r=\"2.25\"/><circle class=\"joint\" cx=\"183.16\" cy=\"174.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"176\" cy=\"203.45\" r=\"2.25\"/><circle class=\"joint\" cx=\"178.74\" cy=\"266.11\" r=\"2.25\"/></g><mask id=\"barbell-shrug-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#barbell-shrug-m-mf-head\" fill=\"#000\"/><use href=\"#barbell-shrug-m-mf-torso\" fill=\"#000\"/><use href=\"#barbell-shrug-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#barbell-shrug-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#barbell-shrug-m-mf-shank.l\" fill=\"#000\"/><use href=\"#barbell-shrug-m-mf-foot.l\" fill=\"#000\"/><use href=\"#barbell-shrug-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#barbell-shrug-m-m-upper.l\" fill=\"#000\"/><use href=\"#barbell-shrug-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#barbell-shrug-m-m-fore.l\" fill=\"#000\"/><use href=\"#barbell-shrug-m-m-fist.l\" fill=\"#000\"/><use href=\"#barbell-shrug-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#barbell-shrug-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#barbell-shrug-m-mf-shank.r\" fill=\"#000\"/><use href=\"#barbell-shrug-m-mf-foot.r\" fill=\"#000\"/><use href=\"#barbell-shrug-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#barbell-shrug-m-m-upper.r\" fill=\"#000\"/><use href=\"#barbell-shrug-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#barbell-shrug-m-m-fore.r\" fill=\"#000\"/><use href=\"#barbell-shrug-m-m-fist.r\" fill=\"#000\"/><use href=\"#barbell-shrug-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-shrug-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#barbell-shrug-m-mmask)\"><g class=\"u-stroke\"><use href=\"#barbell-shrug-m-m-upper.l\"/><use href=\"#barbell-shrug-m-m-elbowcap.l\"/><use href=\"#barbell-shrug-m-m-fore.l\"/><use href=\"#barbell-shrug-m-m-fist.l\"/><use href=\"#barbell-shrug-m-m-upper.r\"/><use href=\"#barbell-shrug-m-m-elbowcap.r\"/><use href=\"#barbell-shrug-m-m-fore.r\"/><use href=\"#barbell-shrug-m-m-fist.r\"/><use href=\"#barbell-shrug-m-m-eq0\"/><use href=\"#barbell-shrug-m-m-eq1\"/><use href=\"#barbell-shrug-m-m-eq2\"/><use href=\"#barbell-shrug-m-m-eq3\"/><use href=\"#barbell-shrug-m-m-eq4\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MDFE1JHE1Lz1G8Lx2kL.1y1LR1P1Lz1(1LfA2L1A2LkA2Lw1(1LU1P1L!1y1LA2kLA21LA2fL!1z1LU1R1Lw1.1Lkx2L1E2Lfx2Lz1.1LR1R1L.1z1Lx2f\"/><path class=\"m-arrow\" d=\"~M(UD1JHE1LdG3Lp6LpgLhiLdqL7qL0sL6qLgqLiiLqgLq6Ls0Lq7LqdLihLgpL6pL0rL7pLdpLhhLpdLp7\"/><path class=\"m-arrow\" d=\"~MySB1YEH1LAmTR1M(6NuL*6KuLIkUK1\"/><path class=\"m-line\" d=\"~MwJy1!-oL.R3NH8LPz9VW3L-K4*V3\"/><path class=\"leader m\" d=\"~MA_uHAx1L)z3x4\"/><path class=\"leader m\" d=\"M195.87 201.34L227 219H237\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"barbell-shrug-m-elbows\" data-key=\"elbows\" data-cue=\"The elbows bend to pull the bar up.\" class=\"plate-callout m\" style=\"left:13.41%;top:41.06%\" aria-pressed=\"true\">Elbows bend</button><button type=\"button\" id=\"barbell-shrug-m-arms\" data-key=\"arms\" data-cue=\"The arms lift the bar instead of the shoulders.\" class=\"plate-callout m\" style=\"left:64.8%;top:55.03%\" aria-pressed=\"false\">Arms pull</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "arms",
        cues: [{ key: "arms", cue: "Keep your elbows straight and let your arms just hang." }, { key: "up", cue: "Move your shoulders only up and down, with no rolling." }, { key: "back", cue: "Keep your knees soft, your hips straight and your back tall." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "The elbows bend to pull the bar up." }, { key: "arms", cue: "The arms lift the bar instead of the shoulders." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Elbows bend</b><span>The elbows bend to pull the bar up.</span></li><li><b>Arms pull</b><span>The arms lift the bar instead of the shoulders.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lift 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lift</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Barbell shrug, side view. Standing tall with soft knees and straight hips, the bar hangs on straight arms in front of the thighs. Only the shoulders lift straight up toward the ears and lower again. The arms stay straight.",
      mistakeAlt: "Barbell Shrug: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hold",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: shrug-grip: the Wrong is a thumb fault and no key draws one; no hold key; bar diameter not on the card.",
    "orientation": "pronated",
    "handle": "bar-28",
    "loadAxis": "across",
    "overBody": false,
    "width": {
      "text": "Hands about shoulder width.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-shrug"
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
        "note": "c10"
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
    "gripLine": "Overhand, hands about shoulder width, thumbs wrapped around the bar.",
    "cue": "Arms straight, shoulders up."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "grip",
      "text": "Overhand grip, hands about shoulder width, thumbs around the bar.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-shrug",
          "baechle-grip"
        ],
        "note": "c1, c10"
      }
    },
    {
      "kind": "position",
      "text": "Stand tall with knees slightly bent and hips straight.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-shrug"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "position",
      "text": "Let the bar hang in front of your thighs on straight arms.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-barbell-shrug"
        ],
        "note": "c4"
      }
    },
    {
      "kind": "position",
      "text": "Lift your shoulders straight up toward your ears. No rolling.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-shrug"
        ],
        "note": "c2, c3"
      }
    },
    {
      "kind": "load",
      "text": "Beat target by one or two reps? Add 2 to 10 percent.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "acsm2009"
        ],
        "note": "c8"
      }
    }
  ],
  posture: [
    {
      "key": "back",
      "label": "Back tall",
      "detail": "Knees soft, hips straight, back tall the whole set.",
      "anchor": {
        "pose": "start",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-shrug"
        ],
        "note": "c2"
      }
    },
    {
      "key": "arms",
      "label": "Straight arms",
      "detail": "Arms straight. The shoulders do the lifting.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "zoom": "shrug-top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-barbell-shrug"
        ],
        "note": "c4"
      }
    },
    {
      "key": "up",
      "label": "Straight up",
      "detail": "Shoulders up toward the ears, then down. No rolling.",
      "anchor": {
        "pose": "end",
        "at": "shoulderTop.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-shrug",
          "sl-barbell-shrug"
        ],
        "note": "c2, c3, c4"
      }
    },
    {
      "key": "lower",
      "label": "Slow lower",
      "detail": "Lower slowly to the start.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "acsm2009",
          "ace-shrug"
        ],
        "note": "c7"
      }
    }
  ],
  zooms: [
    {
      "key": "shrug-top",
      "chip": "Top",
      "heading": "Top position",
      "kind": "posture"
    }
  ],
  chips: [
    "shrug-top",
    "feel"
  ],
  copy: {
    "setupLine": "Overhand grip, hands about shoulder width. Stand tall, knees slightly bent.",
    "mistakeLine": "Keep your arms straight, so the shoulders lift the bar, not the arms.",
    "cueLine": "Shoulders straight up, arms straight."
  },
  mistakes: [
    {
      "key": "roll",
      "title": "Rolling the shoulders",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-shrug"
        ],
        "note": "c3"
      },
      "fix": "Lift straight up, lower straight down."
    },
    {
      "key": "arms",
      "title": "Bending the arms to pull",
      "zoom": "shrug-top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-barbell-shrug"
        ],
        "note": "c4"
      },
      "fix": "Keep your elbows straight. If you can't, lower the weight."
    },
    {
      "key": "drop",
      "title": "Dropping the bar fast",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "acsm2009",
          "ace-shrug"
        ],
        "note": "c7"
      },
      "fix": "Lower slowly to the start."
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
        "note": "c9"
      }
    },
    {
      "key": "shoulder",
      "text": "The shoulder is a common injury site in lifting. Poor technique adds risk.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "kolber2010"
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
    "ace-shrug",
    "sl-barbell-shrug",
    "acsm2009",
    "macdougall1985",
    "baechle-grip",
    "kolber2010",
    "hold-default",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/barbell_shrug.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

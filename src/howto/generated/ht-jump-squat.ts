// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=622cad03ee7f41b451eec9039154fc2fdd555079db98d5d5852e8bb5ad8c9219
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_jump_squat",
  name: "Jump Squat",
  hashes: { inputsSha256: "622cad03ee7f41b451eec9039154fc2fdd555079db98d5d5852e8bb5ad8c9219", golden: "f8dda1e3aacacfc8dbacabd818aa13f87ca5de585a9429c1621bde7b320f3d3f" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"jump-squat-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"jump-squat-n-st-thigh.l\" d=\"~#F12FEz1FYB1EEz1xGA1t.bB13R1_(1S6G7y3V3_6XU1Ae)lS1xkIa*nW1BV1I2z4I5E8O8D(1F14_2RbBuGeBpwE1-2!z1SiNH110101000000000000200000000011010100121000000001000100000002001011110020000101101\"/><path id=\"jump-squat-n-st-kneecap.l\" d=\"~~SEz1yBS1_J10\"/><path id=\"jump-squat-n-st-shank.l\" d=\"~#F12PDz1A(R1ERz1)OP1P3IbF16R4((1y7-6H3R3F6Xy2H9Ic_1-bB5ReWdVx2z2G4X4V8BeS*1E151*bIeU9-gNmE3PlN9Hq10020000002000021000000010022020020000101110000100101010020200020000020000000000\"/><path id=\"jump-squat-n-st-foot.l\" d=\"~#o2AWy1!!!1.Wz1XJ!1U8(9wjS3Yy1)4FI2_P1B!1)O1.qRsTj-d.A1.j-1*gwuH7)w1D8000101010100000000001101110101000001010000000220\"/><path id=\"jump-squat-n-st-shcap.l\" d=\"~~YSA1!VowP10\"/><path id=\"jump-squat-n-st-upper.l\" d=\"~#F12JWA1FFpTGA1xEo)2I881Jk!H1mX64B3E9TB1A2xlG6EfKgOd*jzx1K2z2E5G4(fYJ172-3)7OfA5.2YsU8_kJmJi01000000002000200100020100020010100100000000000010000000000000001200010000000000\"/><path id=\"jump-squat-n-st-elbowcap.l\" d=\"~~_PF1WEx1Dz10\"/><path id=\"jump-squat-n-st-fore.l\" d=\"~#F12HXH1FSx1VJH1KIy1O4A95)1U8EG1*5U7B2Y1I9_tEaJaB3Wa!2FeO8AuuW2oU9JfGE1H1K1G1(9P9(3UfVf(4RgK4Xl10001200000200200000200100000201011000002002000011010100001101010000020000000010\"/><path id=\"jump-squat-n-st-fist.l\" d=\"~~UHI1NBoww10\"/><path id=\"jump-squat-n-st-head\" d=\"~#w12!wD1!SeIKA1xIeRi!jXiFaIb.2x3w5)4.7K8.aGi-lH4*c*1R9Bjmwm*bDmE7!kS2WjFfpFj1010002000100100020020020001210000000000020002000000101000000000\"/><path id=\"jump-squat-n-st-torso\" d=\"~#_12DWA1NJjB(A1V*hEa.9)6gN8DjD9y7Ub!gP5sI2xo)hK8.cY4_fG5Ukz7YlXgwhEiP4X9R8VfKsEy1BcXqK6y6G1_5!b(4S2F8zc.8Rg!6-7FkS5W2H9V9!3yc)R2!y110000000000000200000020001002120020110121022000010000100201010001010102100000001010000002000000000001210102000002012\"/><path id=\"jump-squat-n-st-thigh.r\" d=\"^0\"/><path id=\"jump-squat-n-st-kneecap.r\" d=\"^1\"/><path id=\"jump-squat-n-st-shank.r\" d=\"^2\"/><path id=\"jump-squat-n-st-foot.r\" d=\"^3\"/><path id=\"jump-squat-n-st-shcap.r\" d=\"^4\"/><path id=\"jump-squat-n-st-upper.r\" d=\"^5\"/><path id=\"jump-squat-n-st-elbowcap.r\" d=\"^6\"/><path id=\"jump-squat-n-st-fore.r\" d=\"^7\"/><path id=\"jump-squat-n-st-fist.r\" d=\"^8\"/><path id=\"jump-squat-n-g0-thigh.l\" d=\"~#F12H!tPDF1xStKYD1K3IbE16AcS*1_4R8D2E4-4)U1w9KoX2xkKf)k-9GU1G3O3)6*6F5S(1F134*bOw1G7xgNI1w5Uz1HrNB102101200000100000000020000000220000000010100101000000002000010000201010002101200\"/><path id=\"jump-squat-n-g0-kneecap.l\" d=\"~~_Rw1AwU1_J10\"/><path id=\"jump-squat-n-g0-shank.l\" d=\"~#F12JPw1H!T1)Xw1RKS1_2RbF129A)1U6G7y3X3Y1)y2H8)cy1*bE6BeD9Ky2I2z4I5I8*9J(1E11p*b-dSazfUn-1SlFbWp00000020010100002020012000101000000111111100000000000000000000011122000010200000\"/><path id=\"jump-squat-n-g0-foot.l\" d=\"~#o2_xw1AB)1KTw1zB(1_cF3Uhx8Up)nS-2B3-J2-4ID1)7xo2OG1Y4Eb-cYsBbGmSp120002012120000111001000101200002101101000010110\"/><path id=\"jump-squat-n-g0-shcap.l\" d=\"~~SKy1UzrwP10\"/><path id=\"jump-squat-n-g0-upper.l\" d=\"~#F12FNy1PIrIGy1OFqvX8a3AaAN1A2I6uz3fBD1Y6BkT2EgxdXg.bIA1.1V2z4E5J5_N172*1T8EgF1E9NrW3DmWh!m00000000010002010000000000010000000000010001000000100000000000000222000000001000\"/><path id=\"jump-squat-n-g0-elbowcap.l\" d=\"~~_HA1(BA1Dz10\"/><path id=\"jump-squat-n-g0-fore.l\" d=\"~#F12!KD1NYA1.*B1xNB1K6U78.1YhRB1R7!5O2A1VfFqIcU7R5W9fNe*eYq8W2I1N9_n)x1P1z1K3F9y8N6!iVbW8*emzm00100000020000000100020002020020010110101011010020000202101110000000000020000200\"/><path id=\"jump-squat-n-g0-fist.l\" d=\"~~PzG1wAsww10\"/><path id=\"jump-squat-n-g0-head\" d=\"~#w12AyD1AEhIRA1-UgBmUfTkA6Oaz5*3D4I3X8*5IcKdzpw7-b2V9*iG3woB7FnK2!j_6AgAj*4Si0020020010001001010110000000000101000010110101200000000200010000\"/><path id=\"jump-squat-n-g0-torso\" d=\"~#_12PYz1PUlxHA1OFkX7*cE8E1U3ylA7w9D7AjD5F2P3-nOfVcRdS1UgI1Wl*1Fp*a!kTdU6G8K4IhGjxF1E5)s.7P4T2A5Ha_7iU8V9TbVhW2Rc_h(4P2yaB7sweKX2yh00200001002002010011100002220001010021010001002000001110000001010101000200000100020000000100001010000001011001010111\"/><path id=\"jump-squat-n-g0-thigh.r\" d=\"^11\"/><path id=\"jump-squat-n-g0-kneecap.r\" d=\"^12\"/><path id=\"jump-squat-n-g0-shank.r\" d=\"^13\"/><path id=\"jump-squat-n-g0-foot.r\" d=\"^14\"/><path id=\"jump-squat-n-g0-shcap.r\" d=\"^15\"/><path id=\"jump-squat-n-g0-upper.r\" d=\"^16\"/><path id=\"jump-squat-n-g0-elbowcap.r\" d=\"^17\"/><path id=\"jump-squat-n-g0-fore.r\" d=\"^18\"/><path id=\"jump-squat-n-g0-fist.r\" d=\"^19\"/><path id=\"jump-squat-n-e-thigh.l\" d=\"~#F12U.sHKO1GWrOPN1.9O6rs_P1UE1.1V9vV4TB1TB1V8Ro)eTdGpG6xG1-x1V4j.9pAJ1WJ1qtO7B9VtAfPfWI1UqDowK1Fb10000200000002000000200020200001100002000200001000010110100012100000000000000011\"/><path id=\"jump-squat-n-e-kneecap.l\" d=\"~~SAD1w!V1_J10\"/><path id=\"jump-squat-n-e-shank.l\" d=\"~#F12DHD1DzV1TDE1I*T1_7*8y1mTtYX1H9K3J4.1Ww1O_1PdV7N6)9y1OfAE1OW19.4nX9.B1PS1x1j_4*axh(2Ko_dTbHix2ws00000002000000000000100200010000020000002000100002000102000000011100120010100201\"/><path id=\"jump-squat-n-e-foot.l\" d=\"~#o2_xw1DB)1KTw1EB(1_cH3Uhx8Up)nS-2B3-J2-4ID1)7xo2OG1Y4Eb-cYsBbGmUp100002012120000111001000101200002101101000000011\"/><path id=\"jump-squat-n-e-shcap.l\" d=\"~~YTz1WAy1wP10\"/><path id=\"jump-squat-n-e-upper.l\" d=\"~#F12_Tz1wyy1VWz1E)w1uT8a17UN1S3T5S1.2_7RA1ybziuKg)8GjX3BB1B1x3.2.5)4FN1710V8zgX2xfWoB1NmDcFq00000011100002020000000000101000100101000021010200010001011002120001202000100100\"/><path id=\"jump-squat-n-e-elbowcap.l\" d=\"~~JPz1!DI1Dz10\"/><path id=\"jump-squat-n-e-fore.l\" d=\"~#F12FNB1DwJ1z_A1)PJ1-7Y5k-1FpTvO8_3V2gRk(kXdS4X7A8-3we*jSl7W2O3Y8Nu-qW1pI5A8(5S8Al*6_bRc!5Il00001010001000000000001101011111001110010000201002002001110000000020001011000200\"/><path id=\"jump-squat-n-e-fist.l\" d=\"~~(.G1(TA1ww10\"/><path id=\"jump-squat-n-e-head\" d=\"~#w12_IG1(*o*)E1-xo)oSaIlW1B9z7-4F3K1E9B3Id*7GrF9zay2O9Xhz7(ox2DnP2yiWa!bAmX8Ah0000000000000000100000000000000110000002000000000001010022001100\"/><path id=\"jump-squat-n-e-torso\" d=\"~#_12JDD1!YsVwE1KRrK4Of*8I3V1PlY4PaJ2JkP4J3A9Gm*b)fTdX1PgW2SlJ3yrT4Snx8S8O65.hx9TI1!1GtR8J2*3N4D8waR1N8T6Od-hX1KgFeU4H2wa.4O2AfB-2O100000000202000000002000020001010001000010100010110000002000200100000020002001000000010020000000002000002000000101202\"/><path id=\"jump-squat-n-e-thigh.r\" d=\"^22\"/><path id=\"jump-squat-n-e-kneecap.r\" d=\"^23\"/><path id=\"jump-squat-n-e-shank.r\" d=\"^24\"/><path id=\"jump-squat-n-e-foot.r\" d=\"^25\"/><path id=\"jump-squat-n-e-shcap.r\" d=\"^26\"/><path id=\"jump-squat-n-e-upper.r\" d=\"^27\"/><path id=\"jump-squat-n-e-elbowcap.r\" d=\"^28\"/><path id=\"jump-squat-n-e-fore.r\" d=\"^29\"/><path id=\"jump-squat-n-e-fist.r\" d=\"^30\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#jump-squat-n-dots)\"/>\n  <path class=\"floorline\" d=\"M70.29 339.5H289.71\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#jump-squat-n-st-thigh.l\"/><use href=\"#jump-squat-n-st-kneecap.l\"/><use href=\"#jump-squat-n-st-shank.l\"/><use href=\"#jump-squat-n-st-foot.l\"/><use href=\"#jump-squat-n-st-shcap.l\"/><use href=\"#jump-squat-n-st-upper.l\"/><use href=\"#jump-squat-n-st-elbowcap.l\"/><use href=\"#jump-squat-n-st-fore.l\"/><use href=\"#jump-squat-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#jump-squat-n-st-thigh.l\"/><use href=\"#jump-squat-n-st-kneecap.l\"/><use href=\"#jump-squat-n-st-shank.l\"/><use href=\"#jump-squat-n-st-foot.l\"/><use href=\"#jump-squat-n-st-shcap.l\"/><use href=\"#jump-squat-n-st-upper.l\"/><use href=\"#jump-squat-n-st-elbowcap.l\"/><use href=\"#jump-squat-n-st-fore.l\"/><use href=\"#jump-squat-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#jump-squat-n-st-head\"/><use href=\"#jump-squat-n-st-torso\"/><use href=\"#jump-squat-n-st-thigh.r\"/><use href=\"#jump-squat-n-st-kneecap.r\"/><use href=\"#jump-squat-n-st-shank.r\"/><use href=\"#jump-squat-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#jump-squat-n-st-head\"/><use href=\"#jump-squat-n-st-torso\"/><use href=\"#jump-squat-n-st-thigh.r\"/><use href=\"#jump-squat-n-st-kneecap.r\"/><use href=\"#jump-squat-n-st-shank.r\"/><use href=\"#jump-squat-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#jump-squat-n-st-shcap.r\"/><use href=\"#jump-squat-n-st-upper.r\"/><use href=\"#jump-squat-n-st-elbowcap.r\"/><use href=\"#jump-squat-n-st-fore.r\"/><use href=\"#jump-squat-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#jump-squat-n-st-shcap.r\"/><use href=\"#jump-squat-n-st-upper.r\"/><use href=\"#jump-squat-n-st-elbowcap.r\"/><use href=\"#jump-squat-n-st-fore.r\"/><use href=\"#jump-squat-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#jump-squat-n-g0-thigh.l\"/><use href=\"#jump-squat-n-g0-kneecap.l\"/><use href=\"#jump-squat-n-g0-shank.l\"/><use href=\"#jump-squat-n-g0-foot.l\"/><use href=\"#jump-squat-n-g0-shcap.l\"/><use href=\"#jump-squat-n-g0-upper.l\"/><use href=\"#jump-squat-n-g0-elbowcap.l\"/><use href=\"#jump-squat-n-g0-fore.l\"/><use href=\"#jump-squat-n-g0-fist.l\"/></g><g class=\"u-fill\"><use href=\"#jump-squat-n-g0-thigh.l\"/><use href=\"#jump-squat-n-g0-kneecap.l\"/><use href=\"#jump-squat-n-g0-shank.l\"/><use href=\"#jump-squat-n-g0-foot.l\"/><use href=\"#jump-squat-n-g0-shcap.l\"/><use href=\"#jump-squat-n-g0-upper.l\"/><use href=\"#jump-squat-n-g0-elbowcap.l\"/><use href=\"#jump-squat-n-g0-fore.l\"/><use href=\"#jump-squat-n-g0-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#jump-squat-n-g0-head\"/><use href=\"#jump-squat-n-g0-torso\"/><use href=\"#jump-squat-n-g0-thigh.r\"/><use href=\"#jump-squat-n-g0-kneecap.r\"/><use href=\"#jump-squat-n-g0-shank.r\"/><use href=\"#jump-squat-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#jump-squat-n-g0-head\"/><use href=\"#jump-squat-n-g0-torso\"/><use href=\"#jump-squat-n-g0-thigh.r\"/><use href=\"#jump-squat-n-g0-kneecap.r\"/><use href=\"#jump-squat-n-g0-shank.r\"/><use href=\"#jump-squat-n-g0-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#jump-squat-n-g0-shcap.r\"/><use href=\"#jump-squat-n-g0-upper.r\"/><use href=\"#jump-squat-n-g0-elbowcap.r\"/><use href=\"#jump-squat-n-g0-fore.r\"/><use href=\"#jump-squat-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#jump-squat-n-g0-shcap.r\"/><use href=\"#jump-squat-n-g0-upper.r\"/><use href=\"#jump-squat-n-g0-elbowcap.r\"/><use href=\"#jump-squat-n-g0-fore.r\"/><use href=\"#jump-squat-n-g0-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#jump-squat-n-e-thigh.l\"/><use href=\"#jump-squat-n-e-kneecap.l\"/><use href=\"#jump-squat-n-e-shank.l\"/><use href=\"#jump-squat-n-e-foot.l\"/><use href=\"#jump-squat-n-e-shcap.l\"/><use href=\"#jump-squat-n-e-upper.l\"/><use href=\"#jump-squat-n-e-elbowcap.l\"/><use href=\"#jump-squat-n-e-fore.l\"/><use href=\"#jump-squat-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#jump-squat-n-e-thigh.l\"/><use href=\"#jump-squat-n-e-kneecap.l\"/><use href=\"#jump-squat-n-e-shank.l\"/><use href=\"#jump-squat-n-e-foot.l\"/><use href=\"#jump-squat-n-e-shcap.l\"/><use href=\"#jump-squat-n-e-upper.l\"/><use href=\"#jump-squat-n-e-elbowcap.l\"/><use href=\"#jump-squat-n-e-fore.l\"/><use href=\"#jump-squat-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#jump-squat-n-e-head\"/><use href=\"#jump-squat-n-e-torso\"/><use href=\"#jump-squat-n-e-thigh.r\"/><use href=\"#jump-squat-n-e-kneecap.r\"/><use href=\"#jump-squat-n-e-shank.r\"/><use href=\"#jump-squat-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#jump-squat-n-e-head\"/><use href=\"#jump-squat-n-e-torso\"/><use href=\"#jump-squat-n-e-thigh.r\"/><use href=\"#jump-squat-n-e-kneecap.r\"/><use href=\"#jump-squat-n-e-shank.r\"/><use href=\"#jump-squat-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#jump-squat-n-e-shcap.r\"/><use href=\"#jump-squat-n-e-upper.r\"/><use href=\"#jump-squat-n-e-elbowcap.r\"/><use href=\"#jump-squat-n-e-fore.r\"/><use href=\"#jump-squat-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#jump-squat-n-e-shcap.r\"/><use href=\"#jump-squat-n-e-upper.r\"/><use href=\"#jump-squat-n-e-elbowcap.r\"/><use href=\"#jump-squat-n-e-fore.r\"/><use href=\"#jump-squat-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"190.04\" cy=\"174.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"187.45\" cy=\"221.26\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.04\" cy=\"233.67\" r=\"2.25\"/><circle class=\"joint\" cx=\"202.46\" cy=\"275.84\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#w20(Kz1FBD1KVz1zzD1102010qs000000qq021122qq102010qs002010qq122001qs102211ss10010201010001000010020000000000000001000000110100200001101000001010100222002200001000000002000001000002020002000001002011101100002222\"/><path class=\"arrow\" d=\"~MWJuWKJ1LG9.F1LYK1_R1Z\"/></g><path class=\"leader\" d=\"M156.04 233.67L143.8 259H133.8\"/><circle class=\"anchor\" cx=\"156.04\" cy=\"233.67\" r=\"1.5\"/><path class=\"leader\" d=\"M194.7 74.7L257 106H267\"/><circle class=\"anchor\" cx=\"194.7\" cy=\"74.7\" r=\"1.5\"/><path class=\"leader\" d=\"M202.46 275.84L245 292H255\"/><circle class=\"anchor\" cx=\"202.46\" cy=\"275.84\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"jump-squat-n-hips\" data-key=\"hips\" data-cue=\"Send the hips back, then down, keeping the back flat.\" class=\"plate-callout\" style=\"left:17.32%;top:66.2%\" aria-pressed=\"true\">Hips back</button><button type=\"button\" id=\"jump-squat-n-extend\" data-key=\"extend\" data-cue=\"Jump by extending ankles, knees and hips together.\" class=\"plate-callout two\" style=\"left:73.18%;top:23.46%\" aria-pressed=\"false\">Full<br>extension</button><button type=\"button\" id=\"jump-squat-n-land\" data-key=\"land\" data-cue=\"Land quietly on the mid-foot, hips back and down, knees bent.\" class=\"plate-callout\" style=\"left:69.83%;top:75.42%\" aria-pressed=\"false\">Soft landing</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"jump-squat-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"jump-squat-m-st-thigh.l\" d=\"^0\"/><path id=\"jump-squat-m-st-kneecap.l\" d=\"^1\"/><path id=\"jump-squat-m-st-shank.l\" d=\"^2\"/><path id=\"jump-squat-m-st-foot.l\" d=\"^3\"/><path id=\"jump-squat-m-st-shcap.l\" d=\"^4\"/><path id=\"jump-squat-m-st-upper.l\" d=\"^5\"/><path id=\"jump-squat-m-st-elbowcap.l\" d=\"^6\"/><path id=\"jump-squat-m-st-fore.l\" d=\"^7\"/><path id=\"jump-squat-m-st-fist.l\" d=\"^8\"/><path id=\"jump-squat-m-st-head\" d=\"^9\"/><path id=\"jump-squat-m-st-torso\" d=\"^10\"/><path id=\"jump-squat-m-st-thigh.r\" d=\"^0\"/><path id=\"jump-squat-m-st-kneecap.r\" d=\"^1\"/><path id=\"jump-squat-m-st-shank.r\" d=\"^2\"/><path id=\"jump-squat-m-st-foot.r\" d=\"^3\"/><path id=\"jump-squat-m-st-shcap.r\" d=\"^4\"/><path id=\"jump-squat-m-st-upper.r\" d=\"^5\"/><path id=\"jump-squat-m-st-elbowcap.r\" d=\"^6\"/><path id=\"jump-squat-m-st-fore.r\" d=\"^7\"/><path id=\"jump-squat-m-st-fist.r\" d=\"^8\"/><path id=\"jump-squat-m-g0-thigh.l\" d=\"^11\"/><path id=\"jump-squat-m-g0-kneecap.l\" d=\"^12\"/><path id=\"jump-squat-m-g0-shank.l\" d=\"^13\"/><path id=\"jump-squat-m-g0-foot.l\" d=\"^14\"/><path id=\"jump-squat-m-g0-shcap.l\" d=\"^15\"/><path id=\"jump-squat-m-g0-upper.l\" d=\"^16\"/><path id=\"jump-squat-m-g0-elbowcap.l\" d=\"^17\"/><path id=\"jump-squat-m-g0-fore.l\" d=\"^18\"/><path id=\"jump-squat-m-g0-fist.l\" d=\"^19\"/><path id=\"jump-squat-m-g0-head\" d=\"^20\"/><path id=\"jump-squat-m-g0-torso\" d=\"^21\"/><path id=\"jump-squat-m-g0-thigh.r\" d=\"^11\"/><path id=\"jump-squat-m-g0-kneecap.r\" d=\"^12\"/><path id=\"jump-squat-m-g0-shank.r\" d=\"^13\"/><path id=\"jump-squat-m-g0-foot.r\" d=\"^14\"/><path id=\"jump-squat-m-g0-shcap.r\" d=\"^15\"/><path id=\"jump-squat-m-g0-upper.r\" d=\"^16\"/><path id=\"jump-squat-m-g0-elbowcap.r\" d=\"^17\"/><path id=\"jump-squat-m-g0-fore.r\" d=\"^18\"/><path id=\"jump-squat-m-g0-fist.r\" d=\"^19\"/><path id=\"jump-squat-m-e-thigh.l\" d=\"^22\"/><path id=\"jump-squat-m-e-kneecap.l\" d=\"^23\"/><path id=\"jump-squat-m-e-shank.l\" d=\"^24\"/><path id=\"jump-squat-m-e-foot.l\" d=\"^25\"/><path id=\"jump-squat-m-e-shcap.l\" d=\"^26\"/><path id=\"jump-squat-m-e-upper.l\" d=\"^27\"/><path id=\"jump-squat-m-e-elbowcap.l\" d=\"^28\"/><path id=\"jump-squat-m-e-fore.l\" d=\"^29\"/><path id=\"jump-squat-m-e-fist.l\" d=\"^30\"/><path id=\"jump-squat-m-e-head\" d=\"^31\"/><path id=\"jump-squat-m-e-torso\" d=\"^32\"/><path id=\"jump-squat-m-e-thigh.r\" d=\"^22\"/><path id=\"jump-squat-m-e-kneecap.r\" d=\"^23\"/><path id=\"jump-squat-m-e-shank.r\" d=\"^24\"/><path id=\"jump-squat-m-e-foot.r\" d=\"^25\"/><path id=\"jump-squat-m-e-shcap.r\" d=\"^26\"/><path id=\"jump-squat-m-e-upper.r\" d=\"^27\"/><path id=\"jump-squat-m-e-elbowcap.r\" d=\"^28\"/><path id=\"jump-squat-m-e-fore.r\" d=\"^29\"/><path id=\"jump-squat-m-e-fist.r\" d=\"^30\"/><path id=\"jump-squat-m-m-head\" d=\"~#w12DNB1UWgG!z1XEgxlAhxkS7.aK4T3P4*3K8-6)bBfzoA6EchV9xj)1Jn-8wnx4HkN5Nh!hR3(i0000000000011000020000110010100120012120001101010012100000000010\"/><path id=\"jump-squat-m-m-torso\" d=\"~#_12SNz1YFl)!z1R.jX8Ebx7bY5Aky8F8D9HiJ5U1uxoTg)aKdw3Ngx3JlB4(nTdHjTf_5)8G6-gIn.B1E8BsG7D5z2P5ybU6P1N8*aKaEhP4RawjA5J3UaG8y2Sc)V2yn12000010100001210021002100010121001010000000000000121010100100010020020200000200000000100000202100100010000002002010\"/><path id=\"jump-squat-m-m-thigh.l\" d=\"~#F12NJvS.E1zEvVJD1B2VbE12P5S(1Y5x8S2)3qBV1UbInnBk)cRmI4xV1-2-3E6T7I1Y(1D10N1-bOvXaTkPG1D1wA1FnyF100000002000010000000100000000200000020010120000000010002100000200000100200010100\"/><path id=\"jump-squat-m-m-kneecap.l\" d=\"~~H-w1YwU1_J10\"/><path id=\"jump-squat-m-m-shank.l\" d=\"~#F12(Xw1A!T1Iwx1OKS1(2TbF16O1A)1Y6E7A3T3w3)y2U8-cF1*b*5EeNaGy2G2B4z5I8BbA(1E13j*b*dJaTfDnE2UlYa!p00001100021000000000000200020000200000000000002200000000000000100001010010002100\"/><path id=\"jump-squat-m-m-foot.l\" d=\"^14\"/><path id=\"jump-squat-m-m-shcap.l\" d=\"~~yTy1YWqwP10\"/><path id=\"jump-squat-m-m-upper.l\" d=\"~#F12YUy1DzrOJy1Xwq-1T881SewK1S1R6kB3G4BD1!4XkG4.fOeOfKfBz1B2O2R4*4(9HN174-2O8*f(2V6Ds!5Wl!jDl01020000000100000000001010010012100020121010100101020022001110010101010100220011\"/><path id=\"jump-squat-m-m-elbowcap.l\" d=\"~~NJB1wUz1Dz10\"/><path id=\"jump-squat-m-m-fore.l\" d=\"~#F12ARE1DzA1GzE1O_A1T5H82*1(dKE1.6Y6K2H1xdysRbY8T4Faw1PeIcHskY2fU9HkRA1P1G1R2W9Y8H5UhKdA7XfR1zm00200000000000000200002000010000001000100000000000000000000101210102000000000020\"/><path id=\"jump-squat-m-m-fist.l\" d=\"~~HIG1Fyrww10\"/><path id=\"jump-squat-m-m-thigh.r\" d=\"^41\"/><path id=\"jump-squat-m-m-kneecap.r\" d=\"^42\"/><path id=\"jump-squat-m-m-shank.r\" d=\"^43\"/><path id=\"jump-squat-m-m-foot.r\" d=\"^14\"/><path id=\"jump-squat-m-m-shcap.r\" d=\"^44\"/><path id=\"jump-squat-m-m-upper.r\" d=\"^45\"/><path id=\"jump-squat-m-m-elbowcap.r\" d=\"^46\"/><path id=\"jump-squat-m-m-fore.r\" d=\"^47\"/><path id=\"jump-squat-m-m-fist.r\" d=\"^48\"/><path id=\"jump-squat-m-mo-0\" d=\"^31\"/><path id=\"jump-squat-m-mo-1\" d=\"^32\"/><path id=\"jump-squat-m-mo-2\" d=\"^22\"/><path id=\"jump-squat-m-mo-3\" d=\"^23\"/><path id=\"jump-squat-m-mo-4\" d=\"^24\"/><path id=\"jump-squat-m-mo-5\" d=\"^25\"/><path id=\"jump-squat-m-mo-6\" d=\"^26\"/><path id=\"jump-squat-m-mo-7\" d=\"^27\"/><path id=\"jump-squat-m-mo-8\" d=\"^28\"/><path id=\"jump-squat-m-mo-9\" d=\"^29\"/><path id=\"jump-squat-m-mo-10\" d=\"^30\"/><path id=\"jump-squat-m-mo-11\" d=\"^22\"/><path id=\"jump-squat-m-mo-12\" d=\"^23\"/><path id=\"jump-squat-m-mo-13\" d=\"^24\"/><path id=\"jump-squat-m-mo-14\" d=\"^25\"/><path id=\"jump-squat-m-mo-15\" d=\"^26\"/><path id=\"jump-squat-m-mo-16\" d=\"^27\"/><path id=\"jump-squat-m-mo-17\" d=\"^28\"/><path id=\"jump-squat-m-mo-18\" d=\"^29\"/><path id=\"jump-squat-m-mo-19\" d=\"^30\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#jump-squat-m-dots)\"/>\n  <path class=\"floorline\" d=\"^33\"/><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#jump-squat-m-e-thigh.l\"/><use href=\"#jump-squat-m-e-kneecap.l\"/><use href=\"#jump-squat-m-e-shank.l\"/><use href=\"#jump-squat-m-e-foot.l\"/><use href=\"#jump-squat-m-e-shcap.l\"/><use href=\"#jump-squat-m-e-upper.l\"/><use href=\"#jump-squat-m-e-elbowcap.l\"/><use href=\"#jump-squat-m-e-fore.l\"/><use href=\"#jump-squat-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#jump-squat-m-e-thigh.l\"/><use href=\"#jump-squat-m-e-kneecap.l\"/><use href=\"#jump-squat-m-e-shank.l\"/><use href=\"#jump-squat-m-e-foot.l\"/><use href=\"#jump-squat-m-e-shcap.l\"/><use href=\"#jump-squat-m-e-upper.l\"/><use href=\"#jump-squat-m-e-elbowcap.l\"/><use href=\"#jump-squat-m-e-fore.l\"/><use href=\"#jump-squat-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#jump-squat-m-e-head\"/><use href=\"#jump-squat-m-e-torso\"/><use href=\"#jump-squat-m-e-thigh.r\"/><use href=\"#jump-squat-m-e-kneecap.r\"/><use href=\"#jump-squat-m-e-shank.r\"/><use href=\"#jump-squat-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#jump-squat-m-e-head\"/><use href=\"#jump-squat-m-e-torso\"/><use href=\"#jump-squat-m-e-thigh.r\"/><use href=\"#jump-squat-m-e-kneecap.r\"/><use href=\"#jump-squat-m-e-shank.r\"/><use href=\"#jump-squat-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#jump-squat-m-e-shcap.r\"/><use href=\"#jump-squat-m-e-upper.r\"/><use href=\"#jump-squat-m-e-elbowcap.r\"/><use href=\"#jump-squat-m-e-fore.r\"/><use href=\"#jump-squat-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#jump-squat-m-e-shcap.r\"/><use href=\"#jump-squat-m-e-upper.r\"/><use href=\"#jump-squat-m-e-elbowcap.r\"/><use href=\"#jump-squat-m-e-fore.r\"/><use href=\"#jump-squat-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"190.04\" cy=\"174.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"187.45\" cy=\"221.26\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.04\" cy=\"233.67\" r=\"2.25\"/><circle class=\"joint\" cx=\"202.46\" cy=\"275.84\" r=\"2.25\"/></g><mask id=\"jump-squat-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#jump-squat-m-m-head\" fill=\"#000\"/><use href=\"#jump-squat-m-m-torso\" fill=\"#000\"/><use href=\"#jump-squat-m-m-thigh.l\" fill=\"#000\"/><use href=\"#jump-squat-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#jump-squat-m-m-shank.l\" fill=\"#000\"/><use href=\"#jump-squat-m-m-foot.l\" fill=\"#000\"/><use href=\"#jump-squat-m-m-shcap.l\" fill=\"#000\"/><use href=\"#jump-squat-m-m-upper.l\" fill=\"#000\"/><use href=\"#jump-squat-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#jump-squat-m-m-fore.l\" fill=\"#000\"/><use href=\"#jump-squat-m-m-fist.l\" fill=\"#000\"/><use href=\"#jump-squat-m-m-thigh.r\" fill=\"#000\"/><use href=\"#jump-squat-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#jump-squat-m-m-shank.r\" fill=\"#000\"/><use href=\"#jump-squat-m-m-foot.r\" fill=\"#000\"/><use href=\"#jump-squat-m-m-shcap.r\" fill=\"#000\"/><use href=\"#jump-squat-m-m-upper.r\" fill=\"#000\"/><use href=\"#jump-squat-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#jump-squat-m-m-fore.r\" fill=\"#000\"/><use href=\"#jump-squat-m-m-fist.r\" fill=\"#000\"/><use href=\"#jump-squat-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#jump-squat-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#jump-squat-m-mmask)\"><g class=\"u-stroke\"><use href=\"#jump-squat-m-m-head\"/><use href=\"#jump-squat-m-m-torso\"/><use href=\"#jump-squat-m-m-thigh.l\"/><use href=\"#jump-squat-m-m-kneecap.l\"/><use href=\"#jump-squat-m-m-shank.l\"/><use href=\"#jump-squat-m-m-foot.l\"/><use href=\"#jump-squat-m-m-shcap.l\"/><use href=\"#jump-squat-m-m-upper.l\"/><use href=\"#jump-squat-m-m-elbowcap.l\"/><use href=\"#jump-squat-m-m-fore.l\"/><use href=\"#jump-squat-m-m-fist.l\"/><use href=\"#jump-squat-m-m-thigh.r\"/><use href=\"#jump-squat-m-m-kneecap.r\"/><use href=\"#jump-squat-m-m-shank.r\"/><use href=\"#jump-squat-m-m-foot.r\"/><use href=\"#jump-squat-m-m-shcap.r\"/><use href=\"#jump-squat-m-m-upper.r\"/><use href=\"#jump-squat-m-m-elbowcap.r\"/><use href=\"#jump-squat-m-m-fore.r\"/><use href=\"#jump-squat-m-m-fist.r\"/></g></g><g class=\"mistake-layer\"><path class=\"leader m\" d=\"M175.06 266.36L137.41 328H127.41\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"jump-squat-m-straight\" data-key=\"straight\" data-cue=\"The knees stay straight and locked on the landing.\" class=\"plate-callout m\" style=\"left:4.47%;top:85.47%\" aria-pressed=\"true\">Knees straight</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "hips",
        cues: [{ key: "hips", cue: "Send the hips back, then down, keeping the back flat." }, { key: "extend", cue: "Jump by extending ankles, knees and hips together." }, { key: "land", cue: "Land quietly on the mid-foot, hips back and down, knees bent." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "straight",
        cues: [{ key: "straight", cue: "The knees stay straight and locked on the landing." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Knees straight</b><span>The knees stay straight and locked on the landing.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower controlled, jump explosive\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>Controlled</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Jump</b><span>Explosive</span></div></div></div>",
      alt: "Jump squat, side view. Touchdown frame: full extension on the balls of the feet, hands loosely at the chest. On landing the hips go back and down: in the same spot, feet flat, knees and hips bent, trunk slightly forward.",
      mistakeAlt: "Jump Squat: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP: the card archetype.hand is none; it gives no thumb, contact or wrist claim."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "safety",
      "text": "Learn to squat and land first. Start with small jumps.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-squatjumps"
        ],
        "note": "j7"
      }
    },
    {
      "kind": "safety",
      "text": "Never jump to failure: end the set before fatigue spoils your landings.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "nasm-boxjump"
        ],
        "note": "j15 (card tierA.wayOut)"
      }
    },
    {
      "kind": "position",
      "text": "Feet hip width, hands at the chest, brace. Hips back, then down.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-squatjumps",
          "cat-squatjump"
        ],
        "note": "j1, j10, j2"
      }
    },
    {
      "kind": "position",
      "text": "Heels about to lift: brief pause, then extend ankles, knees, hips.",
      "zoom": "take-off",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-squatjumps"
        ],
        "note": "j2, j3"
      }
    },
    {
      "kind": "finish",
      "text": "Land quietly, hips back and down, trunk slightly forward, head in line.",
      "zoom": "landing",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-squatjumps"
        ],
        "note": "j4, j8"
      }
    }
  ],
  posture: [
    {
      "key": "back",
      "label": "Back flat",
      "detail": "Back flat on the way down.",
      "anchor": {
        "pose": "start",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-squatjumps"
        ],
        "note": "j2"
      }
    },
    {
      "key": "extend",
      "label": "Full extension",
      "detail": "Ankles, knees and hips extend together.",
      "anchor": {
        "pose": "start",
        "at": "hip.r"
      },
      "zoom": "take-off",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-squatjumps"
        ],
        "note": "j3"
      }
    },
    {
      "key": "mid-foot",
      "label": "Mid-foot landing",
      "detail": "Land on the mid-foot, rolling to the heels.",
      "anchor": {
        "pose": "end",
        "at": "sole.r"
      },
      "zoom": "landing",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-squatjumps"
        ],
        "note": "j4"
      }
    },
    {
      "key": "knees-bent",
      "label": "Knees bent",
      "detail": "Knees bent on landing, never locked. Land quietly, hips back, knees bending.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "zoom": "landing",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-squatjumps"
        ],
        "note": "j5, j4"
      }
    },
    {
      "key": "trunk",
      "label": "Trunk slightly forward",
      "detail": "Trunk slightly forward, head in line on landing.",
      "anchor": {
        "pose": "end",
        "at": "sternum"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-squatjumps"
        ],
        "note": "j8"
      }
    },
    {
      "key": "knee-line",
      "label": "Knees in line",
      "detail": "Knees do not cave inward on landing.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "hewett-2005"
        ],
        "note": "j16"
      }
    },
    {
      "key": "knees-forward",
      "label": "Knees shooting forward",
      "detail": "Push the hips back as you land.",
      "anchor": {
        "pose": "end",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-squatjumps"
        ],
        "note": "j6, j4"
      }
    },
    {
      "key": "small-jumps",
      "label": "Jumps too big",
      "detail": "Go back to small jumps until the landing is quiet and controlled.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-squatjumps"
        ],
        "note": "j7"
      }
    }
  ],
  zooms: [
    {
      "key": "landing",
      "chip": "Landing",
      "heading": "Landing",
      "kind": "posture",
      "feelRow": "knees"
    },
    {
      "key": "take-off",
      "chip": "Take-off",
      "heading": "Take-off",
      "kind": "posture"
    }
  ],
  chips: [
    "landing",
    "take-off",
    "feel"
  ],
  copy: {
    "setupLine": "Never jump to failure: end the set before fatigue spoils your landings. Only jump more explosively once your landings are mastered.",
    "mistakeLine": "Never land with locked knees. Keep the trunk slightly forward, head in line.",
    "cueLine": "Land soft, hips back."
  },
  mistakes: [],
  risks: [
    {
      "key": "locked",
      "text": "Locked-knee landings may lead to knee injuries.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-squatjumps"
        ],
        "note": "j5"
      }
    },
    {
      "key": "forward",
      "text": "Knees travelling far forward on landing add knee stress.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-squatjumps"
        ],
        "note": "j6"
      }
    },
    {
      "key": "cave",
      "text": "Knees caving inward on landing.",
      "claim": {
        "tags": [
          "MECH",
          "WEAK"
        ],
        "sources": [
          "hewett-2005"
        ],
        "note": "j16"
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
    "ace-squatjumps",
    "cat-squatjump",
    "nasm-boxjump",
    "hewett-2005",
    "nhs-knee",
    "nhs-knee-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/jump_squat.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

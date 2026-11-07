// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=08f03e33d3ef5247598163ae27bf0f2a5e670724b3a01c3b7f669b8a350fa1af
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_horizontal_leg_press",
  name: "Horizontal Leg Press",
  hashes: { inputsSha256: "08f03e33d3ef5247598163ae27bf0f2a5e670724b3a01c3b7f669b8a350fa1af", golden: "230495d702f11dcc01b2dcf700d745284d5e43e540efb438dba51ed4bc7a0bd7" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"horizontal-leg-press-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"horizontal-leg-press-n-st-thigh.l\" d=\"~#F12PFtUxT1GytKPU1n(bF16W9)*1K7J6R3H3RdNT1-g!jG4YjH7ypR8SU1_1H4D4w9PgT!1B19E4Dbyswi(tIz1P7zz1.cRJ100000001210200000000020000010010000120200001100200000001010000010010100000012120\"/><path id=\"horizontal-leg-press-n-st-kneecap.l\" d=\"~~PysFSD1_J10\"/><path id=\"horizontal-leg-press-n-st-shank.l\" d=\"~#F12UBtU)E1EYrzSE1BbE4aE1P(1J8I6O7I3O3zy2Ea.b*9VbR2-eJ4Vw2ThK4(1*8D4S!1_h7F1*bnW8yfNlwiFlS4!q-700000100200000002010000022000000200000101012001000000000001110000201000000000010\"/><path id=\"horizontal-leg-press-n-st-foot.l\" d=\"~#o2YJF1YwH1-JE1zOG1F3-c)7Th)nRpB3T-2-4YJ2*7PD11(n_4UG1XcDbEb-sUpJm000020000101010100010000020001000101211101210000\"/><path id=\"horizontal-leg-press-n-st-thigh.r\" d=\"^0\"/><path id=\"horizontal-leg-press-n-st-kneecap.r\" d=\"^1\"/><path id=\"horizontal-leg-press-n-st-shank.r\" d=\"^2\"/><path id=\"horizontal-leg-press-n-st-foot.r\" d=\"^3\"/><path id=\"horizontal-leg-press-n-g0-thigh.r\" d=\"~#F12yBtFKT1TXsO_U1R2WbD1cJjV.1I8A5)3U2RlWP1XjwhG7!iF3!pXgPS1y1U4_2N9_pB-1z1f)5Ha(oHmAz1Gu(cKx1V5xN110020000200000010000001000000002000000020010010000000020000010002010011010000000\"/><path id=\"horizontal-leg-press-n-g0-kneecap.r\" d=\"~~!*t(zE1_J10\"/><path id=\"horizontal-leg-press-n-g0-shank.r\" d=\"~#F12AzvYRF1BVtIDF1GbV36E1!(1N5X6z7O3I3Ry2E7GcI9-b*1Re(4Ox2OeE4w2-8U4H*1yf3D1)b1J9PeFmyhNlS3Pq)801000000000000000200100000121000002101100000011110100020001000100120000000000201\"/><path id=\"horizontal-leg-press-n-g0-foot.r\" d=\"~#o2SIH1YwH1RIG1zOG1D3-cx8Th.nRpE3T-2-4YJ2)7PD12(nY4UG1-cDbBb-sUpJm000000100101010110110000020001001111010101210000\"/><path id=\"horizontal-leg-press-n-g1-thigh.r\" d=\"~#F12N)s_YT1THszzV1K4wby1kytTX1z9U3I4w2ItJJ1GmNdGaHhB1Aq)owO1cW4A1_9yz1xU1x1lR7D9YkyqWE1.nNi.uy2IN110000110001010011000120000000001001002100000012000022000000000001012000220000002\"/><path id=\"horizontal-leg-press-n-g1-kneecap.r\" d=\"~~w-vYwF1_J10\"/><path id=\"horizontal-leg-press-n-g1-shank.r\" d=\"~#F12Uxx1(NG1*Sv*DG1Tb*26B1y)1qG7V6T3z3xz2B2.cR8*bx1BeA6Iy2-9z4N2I8D5F(1Sa3D1*boPa_dJnNfWl(1Wp)a00000000000000000000001200000000000200010000200000020010000000002000022000100000\"/><path id=\"horizontal-leg-press-n-g1-foot.r\" d=\"~#o2JHJ1YwH1IHI1zOG1D3-c)7Th)nRpB3T-2-4YJ2*7PD11(n_4UG1-cDbzb-sPpJm200000000101011100010000020011101101010121011000\"/><path id=\"horizontal-leg-press-n-g2-thigh.r\" d=\"~#F12SWs!AU1*-rKHV1O6yasoHE1*P1T9_1V4y1KB1!B1Ko!8Rdyfz6HpTx1FG1hY4p!9PJ1KJ1tnB9P7HfStUI1Vfwo-q(a)J100000011000000210010101000000000100000100000001010000000020100111000020000000200\"/><path id=\"horizontal-leg-press-n-g2-kneecap.r\" d=\"~~HWx1!KG1_J10\"/><path id=\"horizontal-leg-press-n-g2-shank.r\" d=\"~#F12HAz1F!H1xVx1V-H1-bO10E1Y(1O6*7V5x4V2-y2N5-d)6*baOdW7*y2x2*3_2T7D6w)1F30F1XbA2wcScypScUlfNo.d01000001000001000210101010101000020000000111112101100110000200220000000000200100\"/><path id=\"horizontal-leg-press-n-g2-foot.r\" d=\"~#o2FGN1YwH1GGK1zOG1F3-c)7Th)nRpB3T-2X4YJ2x8PD10(n_4UG1XcDbEb-sUpJm000000002101010100012000020001000101211101010010\"/><path id=\"horizontal-leg-press-n-e-thigh.l\" d=\"~#F12DAs!TU1O*q.NV1E9S7mw1JU1Ry1-9E1X4bBO1Uo)psOhFaTdFmRJ1wt)1J4X3y9!X1Rshz1zbH4P5(w1NN1V1wvziDoRE110000220000000001000001010012010021200000200022000200200010111100000000002100010\"/><path id=\"horizontal-leg-press-n-e-kneecap.l\" d=\"~~(yA1_IJ1_J10\"/><path id=\"horizontal-leg-press-n-e-shank.l\" d=\"~#F12w!B1SYK1OKA1IxN1-bH1bz1P.1IlB9V3R4R1R)1FlxfO3RbF3BbSaTx2Ae)2W3x6_7y(1*baF1*a_4UeH9JrF6!kV5JkIj00010100002001000010001001000000020000100200200000000002001010100000200000000100\"/><path id=\"horizontal-leg-press-n-e-foot.l\" d=\"~#o2yFP1YwH1xFO1zOG1D3-c)7Th)nRpB3T-2-4YJ2)7PD12(nY4UG1-cDbBb-sUpJm000000100101011110010000022001001111010101210000\"/><path id=\"horizontal-leg-press-n-e-shcap.l\" d=\"~~YXgUDF1wP10\"/><path id=\"horizontal-leg-press-n-e-upper.l\" d=\"~#F12FOh(OG1RXg-wG1-5*367Px1yhO2z5B1I2GiRh*aBizeK8Glr)nT7-22V5aAvDl7aB6E3XfP9(e!oJjPb(sD100000220002000100002001111000021000000002001111101000010000120001012100200010100\"/><path id=\"horizontal-leg-press-n-e-elbowcap.l\" d=\"~~ANnF(I1Dz10\"/><path id=\"horizontal-leg-press-n-e-fore.l\" d=\"~#F12_Wn_XJ1IFnOAJ1-4K7W1iFsJo)2B85R2OhXi-3)d.7x8XdK4xiziT29)7G3DnDtkW1I7z5Baw4w6Jl(bNcAl_600002220010010000010101000000110000000000000100121011100200200000101000000100010\"/><path id=\"horizontal-leg-press-n-e-fist.l\" d=\"~~AItH)R1ww10\"/><path id=\"horizontal-leg-press-n-e-head\" d=\"~#w12wDd(.vGUbOIw1.7(pOcShIbJ2hY5)7-4Gcz6zqObV1Rd*5X7)gy9SeKk_gBg_j*6PoD5S7Uh0000000012010000001000000200120001000000000001010001100200101110\"/><path id=\"horizontal-leg-press-n-e-torso\" d=\"~#_12(yeWYA1TVdEIz1I6S4!2R3Jh!5PbB1Ak(3!4x4IkEeEmF8X6!bD9*d!bEi_6VqA2XoK2OaIgx7OI1O9zqTd-4y4I7D6yky4U7y4)eA2x7JgN8wkNeH7Y8RmD1tK_1Hz220000001100100200021000010100020000000200220020010001200002000000010012100010002000000100001000100000200101010000001\"/><path id=\"horizontal-leg-press-n-e-thigh.r\" d=\"^16\"/><path id=\"horizontal-leg-press-n-e-kneecap.r\" d=\"^17\"/><path id=\"horizontal-leg-press-n-e-shank.r\" d=\"^18\"/><path id=\"horizontal-leg-press-n-e-foot.r\" d=\"^19\"/><path id=\"horizontal-leg-press-n-e-shcap.r\" d=\"^20\"/><path id=\"horizontal-leg-press-n-e-upper.r\" d=\"^21\"/><path id=\"horizontal-leg-press-n-e-elbowcap.r\" d=\"^22\"/><path id=\"horizontal-leg-press-n-e-fore.r\" d=\"^23\"/><path id=\"horizontal-leg-press-n-e-fist.r\" d=\"^24\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#horizontal-leg-press-n-dots)\"/>\n  <path class=\"floorline\" d=\"M18.52 339.77H339.48\"/><path class=\"eq\" d=\"~MwNdNFy2L(!d0QPc0KPdOcLOcuQ0OcOctLKPdPcQOc0NPdPcLPctQ0PcPcuZ\"/><path class=\"eq\" d=\"~M_Ag!zx2LYk0QPc0E8OcLOcOGhQ0OcOcPGhLE8PcQOc0F8PcLPcPGhQ0PcPcOGhZ\"/><path class=\"eq\" d=\"~M(Dr!zx2LYk0QPc0E8OcLOczJ8Q0OcOcAJ8LE8PcQOc0F8PcLPcAJ8Q0PcPczJ8Z\"/><path class=\"eq\" d=\"~MAIuH)R1LGiJ.2\"/><path class=\"eq\" d=\"~MUJo!YT1LTwfxzfQThXhH*d(yfLJpwaQXhUh!9PpLUwfY)dQUhWhE*dxzfLIp*9QYhTh-9OpZ\"/><path class=\"eq\" d=\"~MNXvP*T1LxR8w_1QKoD5_*7GsLDm)fQD5NoWqS5LNT7GK2QNoB5-*7NsLBm(fQB5KoVqR5Z\"/><path class=\"eq-line\" d=\"~MNXrNUP1L!Wz10\"/><path class=\"eq-line\" d=\"~MNXrw-R1L!Wz10\"/><path class=\"eq\" d=\"~M!S(1SRS1L0H(eQ0F6F6xYeLAA1E6QF60zA1E6LE6xYeQ0E6E6yYeLzA1F6QE60AA1F6Z\"/><path class=\"eq\" d=\"~Mw!qSRS1L0H(eQ0F6F6xYeLAA1E6QF60zA1E6LE6xYeQ0E6E6yYeLzA1F6QE60AA1F6Z\"/><path class=\"eq\" d=\"~MA-qNFy2LPTB10QF60EKB1E6LE6-hQ0E6E6_hLEKB1F6QE60FKB1F6LF6_hQ0F6F6-hZ\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-n-st-thigh.l\"/><use href=\"#horizontal-leg-press-n-st-kneecap.l\"/><use href=\"#horizontal-leg-press-n-st-shank.l\"/><use href=\"#horizontal-leg-press-n-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-n-st-thigh.l\"/><use href=\"#horizontal-leg-press-n-st-kneecap.l\"/><use href=\"#horizontal-leg-press-n-st-shank.l\"/><use href=\"#horizontal-leg-press-n-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-n-st-thigh.r\"/><use href=\"#horizontal-leg-press-n-st-kneecap.r\"/><use href=\"#horizontal-leg-press-n-st-shank.r\"/><use href=\"#horizontal-leg-press-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-n-st-thigh.r\"/><use href=\"#horizontal-leg-press-n-st-kneecap.r\"/><use href=\"#horizontal-leg-press-n-st-shank.r\"/><use href=\"#horizontal-leg-press-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-n-g0-thigh.r\"/><use href=\"#horizontal-leg-press-n-g0-kneecap.r\"/><use href=\"#horizontal-leg-press-n-g0-shank.r\"/><use href=\"#horizontal-leg-press-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-n-g0-thigh.r\"/><use href=\"#horizontal-leg-press-n-g0-kneecap.r\"/><use href=\"#horizontal-leg-press-n-g0-shank.r\"/><use href=\"#horizontal-leg-press-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-n-g1-thigh.r\"/><use href=\"#horizontal-leg-press-n-g1-kneecap.r\"/><use href=\"#horizontal-leg-press-n-g1-shank.r\"/><use href=\"#horizontal-leg-press-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-n-g1-thigh.r\"/><use href=\"#horizontal-leg-press-n-g1-kneecap.r\"/><use href=\"#horizontal-leg-press-n-g1-shank.r\"/><use href=\"#horizontal-leg-press-n-g1-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-n-g2-thigh.r\"/><use href=\"#horizontal-leg-press-n-g2-kneecap.r\"/><use href=\"#horizontal-leg-press-n-g2-shank.r\"/><use href=\"#horizontal-leg-press-n-g2-foot.r\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-n-g2-thigh.r\"/><use href=\"#horizontal-leg-press-n-g2-kneecap.r\"/><use href=\"#horizontal-leg-press-n-g2-shank.r\"/><use href=\"#horizontal-leg-press-n-g2-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MJFS1w-R1LNyc0QPc0*VbOcLOcTz1Q0OcOcUz1L*VbPcQOc0(VbPcLPcUz1Q0PcPcTz1Z\"/><path class=\"eq\" d=\"~MWBU1JXO1L(tVT5Qy1B6xz1PJ5LTA16QB6vPy1AcLVmSN5QvD6Az1OJ5LSA15QD6w1Ry1zcZ\"/><path class=\"eq-solid\" d=\"~MUGU1wWO1L0xAhQ0I9I9W_gL.3J9QI90!3J9LJ9W_gQ0J9J9V_gL!3I9QJ90.3I9Z\"/><path class=\"eq-thin\" d=\"~MHNI1J)O1L0-WhLww1_WhL)v_WhL)v-Wh\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-n-e-thigh.l\"/><use href=\"#horizontal-leg-press-n-e-kneecap.l\"/><use href=\"#horizontal-leg-press-n-e-shank.l\"/><use href=\"#horizontal-leg-press-n-e-foot.l\"/><use href=\"#horizontal-leg-press-n-e-shcap.l\"/><use href=\"#horizontal-leg-press-n-e-upper.l\"/><use href=\"#horizontal-leg-press-n-e-elbowcap.l\"/><use href=\"#horizontal-leg-press-n-e-fore.l\"/><use href=\"#horizontal-leg-press-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-n-e-thigh.l\"/><use href=\"#horizontal-leg-press-n-e-kneecap.l\"/><use href=\"#horizontal-leg-press-n-e-shank.l\"/><use href=\"#horizontal-leg-press-n-e-foot.l\"/><use href=\"#horizontal-leg-press-n-e-shcap.l\"/><use href=\"#horizontal-leg-press-n-e-upper.l\"/><use href=\"#horizontal-leg-press-n-e-elbowcap.l\"/><use href=\"#horizontal-leg-press-n-e-fore.l\"/><use href=\"#horizontal-leg-press-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-n-e-head\"/><use href=\"#horizontal-leg-press-n-e-torso\"/><use href=\"#horizontal-leg-press-n-e-thigh.r\"/><use href=\"#horizontal-leg-press-n-e-kneecap.r\"/><use href=\"#horizontal-leg-press-n-e-shank.r\"/><use href=\"#horizontal-leg-press-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-n-e-head\"/><use href=\"#horizontal-leg-press-n-e-torso\"/><use href=\"#horizontal-leg-press-n-e-thigh.r\"/><use href=\"#horizontal-leg-press-n-e-kneecap.r\"/><use href=\"#horizontal-leg-press-n-e-shank.r\"/><use href=\"#horizontal-leg-press-n-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"~~W_tH)R1Ng2\"/><path class=\"eq-pin\" d=\"~~!AuH)R1F60\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-n-e-shcap.r\"/><use href=\"#horizontal-leg-press-n-e-upper.r\"/><use href=\"#horizontal-leg-press-n-e-elbowcap.r\"/><use href=\"#horizontal-leg-press-n-e-fore.r\"/><use href=\"#horizontal-leg-press-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-n-e-shcap.r\"/><use href=\"#horizontal-leg-press-n-e-upper.r\"/><use href=\"#horizontal-leg-press-n-e-elbowcap.r\"/><use href=\"#horizontal-leg-press-n-e-fore.r\"/><use href=\"#horizontal-leg-press-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"93.4\" cy=\"205.86\" r=\"2.25\"/><circle class=\"joint\" cx=\"125.65\" cy=\"225\" r=\"2.25\"/><circle class=\"joint\" cx=\"137.83\" cy=\"258.81\" r=\"2.25\"/><circle class=\"joint\" cx=\"191.96\" cy=\"227.17\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#F20wXu(!D1xSuG.D114200402142014220214220402042412240422164416242428042a244a0a6a2c6g6g6m001000012002000000120000010000002000001200002002200000022000001011010000000101001200001200000101000002010000001001000010002000101000020000000020\"/><path class=\"arrow\" d=\"~M(FB1H!I1LBD1IhLJz2B6Z\"/></g><path class=\"leader\" d=\"M87.5 227.52L71.07 240H61.07\"/><circle class=\"anchor\" cx=\"87.5\" cy=\"227.52\" r=\"1.5\"/><path class=\"leader\" d=\"~MFOtFSD1L0EU2\"/><circle class=\"anchor\" cx=\"150.92\" cy=\"197.48\" r=\"1.5\"/><path class=\"leader\" d=\"M191.96 227.17L195 278H205\"/><circle class=\"anchor\" cx=\"191.96\" cy=\"227.17\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"horizontal-leg-press-n-back\" data-key=\"back\" data-cue=\"Keep the back and tailbone flat on the pad, hips down.\" class=\"plate-callout two\" style=\"left:2.23%;top:60.89%\" aria-pressed=\"true\">Back<br>on pad</button><button type=\"button\" id=\"horizontal-leg-press-n-ninety\" data-key=\"ninety\" data-cue=\"Set the seat so the knees start at about 90 degrees, heels flat.\" class=\"plate-callout two\" style=\"left:27.37%;top:40.22%\" aria-pressed=\"false\">Knees<br>about 90°</button><button type=\"button\" id=\"horizontal-leg-press-n-soft\" data-key=\"soft\" data-cue=\"End each push with a small bend left in the knees.\" class=\"plate-callout two\" style=\"left:55.87%;top:71.51%\" aria-pressed=\"false\">Soft<br>knees</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"horizontal-leg-press-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"horizontal-leg-press-m-st-thigh.l\" d=\"^0\"/><path id=\"horizontal-leg-press-m-st-kneecap.l\" d=\"^1\"/><path id=\"horizontal-leg-press-m-st-shank.l\" d=\"^2\"/><path id=\"horizontal-leg-press-m-st-foot.l\" d=\"^3\"/><path id=\"horizontal-leg-press-m-st-thigh.r\" d=\"^0\"/><path id=\"horizontal-leg-press-m-st-kneecap.r\" d=\"^1\"/><path id=\"horizontal-leg-press-m-st-shank.r\" d=\"^2\"/><path id=\"horizontal-leg-press-m-st-foot.r\" d=\"^3\"/><path id=\"horizontal-leg-press-m-g0-thigh.r\" d=\"^4\"/><path id=\"horizontal-leg-press-m-g0-kneecap.r\" d=\"^5\"/><path id=\"horizontal-leg-press-m-g0-shank.r\" d=\"^6\"/><path id=\"horizontal-leg-press-m-g0-foot.r\" d=\"^7\"/><path id=\"horizontal-leg-press-m-g1-thigh.r\" d=\"^8\"/><path id=\"horizontal-leg-press-m-g1-kneecap.r\" d=\"^9\"/><path id=\"horizontal-leg-press-m-g1-shank.r\" d=\"^10\"/><path id=\"horizontal-leg-press-m-g1-foot.r\" d=\"^11\"/><path id=\"horizontal-leg-press-m-g2-thigh.r\" d=\"^12\"/><path id=\"horizontal-leg-press-m-g2-kneecap.r\" d=\"^13\"/><path id=\"horizontal-leg-press-m-g2-shank.r\" d=\"^14\"/><path id=\"horizontal-leg-press-m-g2-foot.r\" d=\"^15\"/><path id=\"horizontal-leg-press-m-e-thigh.l\" d=\"^16\"/><path id=\"horizontal-leg-press-m-e-kneecap.l\" d=\"^17\"/><path id=\"horizontal-leg-press-m-e-shank.l\" d=\"^18\"/><path id=\"horizontal-leg-press-m-e-foot.l\" d=\"^19\"/><path id=\"horizontal-leg-press-m-e-shcap.l\" d=\"^20\"/><path id=\"horizontal-leg-press-m-e-upper.l\" d=\"^21\"/><path id=\"horizontal-leg-press-m-e-elbowcap.l\" d=\"^22\"/><path id=\"horizontal-leg-press-m-e-fore.l\" d=\"^23\"/><path id=\"horizontal-leg-press-m-e-fist.l\" d=\"^24\"/><path id=\"horizontal-leg-press-m-e-head\" d=\"^25\"/><path id=\"horizontal-leg-press-m-e-torso\" d=\"^26\"/><path id=\"horizontal-leg-press-m-e-thigh.r\" d=\"^16\"/><path id=\"horizontal-leg-press-m-e-kneecap.r\" d=\"^17\"/><path id=\"horizontal-leg-press-m-e-shank.r\" d=\"^18\"/><path id=\"horizontal-leg-press-m-e-foot.r\" d=\"^19\"/><path id=\"horizontal-leg-press-m-e-shcap.r\" d=\"^20\"/><path id=\"horizontal-leg-press-m-e-upper.r\" d=\"^21\"/><path id=\"horizontal-leg-press-m-e-elbowcap.r\" d=\"^22\"/><path id=\"horizontal-leg-press-m-e-fore.r\" d=\"^23\"/><path id=\"horizontal-leg-press-m-e-fist.r\" d=\"^24\"/><path id=\"horizontal-leg-press-m-m-thigh.r\" d=\"~#F12D.rJYU1ERqzNV1BaH6ey1PY1KrR9R2V4t*R1Fi*pK2Ti_7KgHk*O1(mR2y4*4S8D.1zlfB1Rb(2F1Fx1AN1N4Dx1)dyt)z101101011110020011000000000000021010100101000100010000001010010100100120000100220\"/><path id=\"horizontal-leg-press-m-m-kneecap.r\" d=\"~~Y-A1P-K1_J10\"/><path id=\"horizontal-leg-press-m-m-shank.r\" d=\"~#F12DYD1NAO1xIB1*SO1Tb!2fB1NY1KsT9R2T4vO!1(sKfT1xbS4X9(bK)1(lR2y4)4S8y!1OjgD1EaD6WfN7_r_2AkE8_hRl00001210010000100002200010100010002000011000000000101000020200101011110020000001\"/><path id=\"horizontal-leg-press-m-m-foot.r\" d=\"~#o2HOP1YwH1GOO1zOG1D3-c)7Th)nRpB3T-2-4YJ2)7PD10(n!4UG1.cDbBb-sUpJm200000002101010100010000020001200011010101210000\"/><path id=\"horizontal-leg-press-m-m-eq0\" d=\"~MWOS1w-R1LJyc0QPc0.VbOcLOcTz1Q0OcOcUz1L.VbPcQOc0!VbPcLPcUz1Q0PcPcTz1Z\"/><path id=\"horizontal-leg-press-m-m-eq1\" d=\"~M(JU1JXO1LwuVT5Qw1B6Bz1PJ5LRA16QB6vSy1AcLXmSN5Qx1D6yz1OJ5LUA15QD6w1Ry1zcZ\"/><path id=\"horizontal-leg-press-m-m-eq2\" d=\"~M!PU1wWO1L0xAhQ0I9I9W_gL.3J9QI90!3J9LJ9W_gQ0J9J9V_gL!3I9QJ90.3I9Z\"/><path id=\"horizontal-leg-press-m-mf-head\" d=\"^25\"/><path id=\"horizontal-leg-press-m-mf-torso\" d=\"^26\"/><path id=\"horizontal-leg-press-m-mf-thigh.l\" d=\"^50\"/><path id=\"horizontal-leg-press-m-mf-kneecap.l\" d=\"^51\"/><path id=\"horizontal-leg-press-m-mf-shank.l\" d=\"^52\"/><path id=\"horizontal-leg-press-m-mf-foot.l\" d=\"^53\"/><path id=\"horizontal-leg-press-m-mf-shcap.l\" d=\"^20\"/><path id=\"horizontal-leg-press-m-mf-upper.l\" d=\"^21\"/><path id=\"horizontal-leg-press-m-mf-elbowcap.l\" d=\"^22\"/><path id=\"horizontal-leg-press-m-mf-fore.l\" d=\"^23\"/><path id=\"horizontal-leg-press-m-mf-fist.l\" d=\"^24\"/><path id=\"horizontal-leg-press-m-mf-shcap.r\" d=\"^20\"/><path id=\"horizontal-leg-press-m-mf-upper.r\" d=\"^21\"/><path id=\"horizontal-leg-press-m-mf-elbowcap.r\" d=\"^22\"/><path id=\"horizontal-leg-press-m-mf-fore.r\" d=\"^23\"/><path id=\"horizontal-leg-press-m-mf-fist.r\" d=\"^24\"/><path id=\"horizontal-leg-press-m-mo-0\" d=\"^25\"/><path id=\"horizontal-leg-press-m-mo-1\" d=\"^26\"/><path id=\"horizontal-leg-press-m-mo-2\" d=\"^16\"/><path id=\"horizontal-leg-press-m-mo-3\" d=\"^17\"/><path id=\"horizontal-leg-press-m-mo-4\" d=\"^18\"/><path id=\"horizontal-leg-press-m-mo-5\" d=\"^19\"/><path id=\"horizontal-leg-press-m-mo-6\" d=\"^20\"/><path id=\"horizontal-leg-press-m-mo-7\" d=\"^21\"/><path id=\"horizontal-leg-press-m-mo-8\" d=\"^22\"/><path id=\"horizontal-leg-press-m-mo-9\" d=\"^23\"/><path id=\"horizontal-leg-press-m-mo-10\" d=\"^24\"/><path id=\"horizontal-leg-press-m-mo-11\" d=\"^16\"/><path id=\"horizontal-leg-press-m-mo-12\" d=\"^17\"/><path id=\"horizontal-leg-press-m-mo-13\" d=\"^18\"/><path id=\"horizontal-leg-press-m-mo-14\" d=\"^19\"/><path id=\"horizontal-leg-press-m-mo-15\" d=\"^20\"/><path id=\"horizontal-leg-press-m-mo-16\" d=\"^21\"/><path id=\"horizontal-leg-press-m-mo-17\" d=\"^22\"/><path id=\"horizontal-leg-press-m-mo-18\" d=\"^23\"/><path id=\"horizontal-leg-press-m-mo-19\" d=\"^24\"/><path id=\"horizontal-leg-press-m-mo-20\" d=\"^28\"/><path id=\"horizontal-leg-press-m-mo-21\" d=\"^29\"/><path id=\"horizontal-leg-press-m-mo-22\" d=\"^30\"/><path id=\"horizontal-leg-press-m-mo-23\" d=\"^32\"/><path id=\"horizontal-leg-press-m-mo-24\" d=\"^33\"/><path id=\"horizontal-leg-press-m-mo-25\" d=\"^36\"/><path id=\"horizontal-leg-press-m-mo-26\" d=\"^37\"/><path id=\"horizontal-leg-press-m-mo-27\" d=\"^38\"/><path id=\"horizontal-leg-press-m-mo-28\" d=\"^39\"/><path id=\"horizontal-leg-press-m-mo-29\" d=\"^40\"/><path id=\"horizontal-leg-press-m-mo-30\" d=\"^41\"/><path id=\"horizontal-leg-press-m-mo-31\" d=\"^43\"/><path id=\"horizontal-leg-press-m-mo-32\" d=\"^44\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#horizontal-leg-press-m-dots)\"/>\n  <path class=\"floorline\" d=\"^27\"/><path class=\"eq\" d=\"^28\"/><path class=\"eq\" d=\"^29\"/><path class=\"eq\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq-line\" d=\"^34\"/><path class=\"eq-line\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><path class=\"eq\" d=\"^38\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-m-st-thigh.l\"/><use href=\"#horizontal-leg-press-m-st-kneecap.l\"/><use href=\"#horizontal-leg-press-m-st-shank.l\"/><use href=\"#horizontal-leg-press-m-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-m-st-thigh.l\"/><use href=\"#horizontal-leg-press-m-st-kneecap.l\"/><use href=\"#horizontal-leg-press-m-st-shank.l\"/><use href=\"#horizontal-leg-press-m-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-m-st-thigh.r\"/><use href=\"#horizontal-leg-press-m-st-kneecap.r\"/><use href=\"#horizontal-leg-press-m-st-shank.r\"/><use href=\"#horizontal-leg-press-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-m-st-thigh.r\"/><use href=\"#horizontal-leg-press-m-st-kneecap.r\"/><use href=\"#horizontal-leg-press-m-st-shank.r\"/><use href=\"#horizontal-leg-press-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-m-g0-thigh.r\"/><use href=\"#horizontal-leg-press-m-g0-kneecap.r\"/><use href=\"#horizontal-leg-press-m-g0-shank.r\"/><use href=\"#horizontal-leg-press-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-m-g0-thigh.r\"/><use href=\"#horizontal-leg-press-m-g0-kneecap.r\"/><use href=\"#horizontal-leg-press-m-g0-shank.r\"/><use href=\"#horizontal-leg-press-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-m-g1-thigh.r\"/><use href=\"#horizontal-leg-press-m-g1-kneecap.r\"/><use href=\"#horizontal-leg-press-m-g1-shank.r\"/><use href=\"#horizontal-leg-press-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-m-g1-thigh.r\"/><use href=\"#horizontal-leg-press-m-g1-kneecap.r\"/><use href=\"#horizontal-leg-press-m-g1-shank.r\"/><use href=\"#horizontal-leg-press-m-g1-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-m-g2-thigh.r\"/><use href=\"#horizontal-leg-press-m-g2-kneecap.r\"/><use href=\"#horizontal-leg-press-m-g2-shank.r\"/><use href=\"#horizontal-leg-press-m-g2-foot.r\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-m-g2-thigh.r\"/><use href=\"#horizontal-leg-press-m-g2-kneecap.r\"/><use href=\"#horizontal-leg-press-m-g2-shank.r\"/><use href=\"#horizontal-leg-press-m-g2-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^39\"/><path class=\"eq\" d=\"^40\"/><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq-thin\" d=\"^42\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-m-e-thigh.l\"/><use href=\"#horizontal-leg-press-m-e-kneecap.l\"/><use href=\"#horizontal-leg-press-m-e-shank.l\"/><use href=\"#horizontal-leg-press-m-e-foot.l\"/><use href=\"#horizontal-leg-press-m-e-shcap.l\"/><use href=\"#horizontal-leg-press-m-e-upper.l\"/><use href=\"#horizontal-leg-press-m-e-elbowcap.l\"/><use href=\"#horizontal-leg-press-m-e-fore.l\"/><use href=\"#horizontal-leg-press-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-m-e-thigh.l\"/><use href=\"#horizontal-leg-press-m-e-kneecap.l\"/><use href=\"#horizontal-leg-press-m-e-shank.l\"/><use href=\"#horizontal-leg-press-m-e-foot.l\"/><use href=\"#horizontal-leg-press-m-e-shcap.l\"/><use href=\"#horizontal-leg-press-m-e-upper.l\"/><use href=\"#horizontal-leg-press-m-e-elbowcap.l\"/><use href=\"#horizontal-leg-press-m-e-fore.l\"/><use href=\"#horizontal-leg-press-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-m-e-head\"/><use href=\"#horizontal-leg-press-m-e-torso\"/><use href=\"#horizontal-leg-press-m-e-thigh.r\"/><use href=\"#horizontal-leg-press-m-e-kneecap.r\"/><use href=\"#horizontal-leg-press-m-e-shank.r\"/><use href=\"#horizontal-leg-press-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-m-e-head\"/><use href=\"#horizontal-leg-press-m-e-torso\"/><use href=\"#horizontal-leg-press-m-e-thigh.r\"/><use href=\"#horizontal-leg-press-m-e-kneecap.r\"/><use href=\"#horizontal-leg-press-m-e-shank.r\"/><use href=\"#horizontal-leg-press-m-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^43\"/><path class=\"eq-pin\" d=\"^44\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-m-e-shcap.r\"/><use href=\"#horizontal-leg-press-m-e-upper.r\"/><use href=\"#horizontal-leg-press-m-e-elbowcap.r\"/><use href=\"#horizontal-leg-press-m-e-fore.r\"/><use href=\"#horizontal-leg-press-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-m-e-shcap.r\"/><use href=\"#horizontal-leg-press-m-e-upper.r\"/><use href=\"#horizontal-leg-press-m-e-elbowcap.r\"/><use href=\"#horizontal-leg-press-m-e-fore.r\"/><use href=\"#horizontal-leg-press-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"93.4\" cy=\"205.86\" r=\"2.25\"/><circle class=\"joint\" cx=\"125.65\" cy=\"225\" r=\"2.25\"/><circle class=\"joint\" cx=\"137.83\" cy=\"258.81\" r=\"2.25\"/><circle class=\"joint\" cx=\"191.96\" cy=\"227.17\" r=\"2.25\"/></g><mask id=\"horizontal-leg-press-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#horizontal-leg-press-m-mf-head\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mf-torso\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mf-shank.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mf-foot.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mf-upper.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mf-fore.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mf-fist.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-m-thigh.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-m-shank.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-m-foot.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mf-upper.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mf-fore.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mf-fist.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#horizontal-leg-press-m-mmask)\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-m-m-thigh.r\"/><use href=\"#horizontal-leg-press-m-m-kneecap.r\"/><use href=\"#horizontal-leg-press-m-m-shank.r\"/><use href=\"#horizontal-leg-press-m-m-foot.r\"/><use href=\"#horizontal-leg-press-m-m-eq0\"/><use href=\"#horizontal-leg-press-m-m-eq1\"/><use href=\"#horizontal-leg-press-m-m-eq2\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MN*qSRS1LyVmRK9\"/><path class=\"leader m\" d=\"M195.61 234.48L199 278H209\"/></g>\n<g class=\"plate-zoom\" data-view=\"mistake\" data-k=\"2\" data-c=\"166 130\" data-src=\"193.76 230.85\"><defs><clipPath id=\"horizontal-leg-press-m-zclip\"><circle cx=\"166\" cy=\"130\" r=\"52\"/></clipPath></defs><circle class=\"pz-src\" cx=\"193.76\" cy=\"230.85\" r=\"26\"/><path class=\"pz-link\" d=\"~M!OA1DDF1LzJ1Gw5\"/><circle class=\"pz-bg\" cx=\"166\" cy=\"130\" r=\"52\"/><g class=\"pz-in\" clip-path=\"url(#horizontal-leg-press-m-zclip)\">\n  <defs><pattern id=\"horizontal-leg-press-m-z-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"horizontal-leg-press-m-z-st-thigh.l\" d=\"~#F12DFfJHB1..e*EF1I1YnN2iJjB!3*e!c)6P6zr!D3-x1_E1I8SE1NeyS1zhyG3W3_8N8_h(w1E-3I2fR8FmDY1AA1(.1-D2wfGD2.px-222000200000101000001200020011100001010002010110101100100001010000001000000000000\"/><path id=\"horizontal-leg-press-m-z-st-kneecap.l\" d=\"~~A!cUIcU-21\"/><path id=\"horizontal-leg-press-m-z-st-shank.l\" d=\"~#F12NyfJDfVEcIIeGmO8gK2A*3Wg*c)eO6)6KA4OkTn*jKn)4VtU8Ix4xz1X8U3*hP8A-3Uz1hP2-nI1Nh!t_H1DA1NH1y9!V1Vf00101010001002101020000000020010100000001000210002002000020000010001000002200002\"/><path id=\"horizontal-leg-press-m-z-st-foot.l\" d=\"~#o2WPB1WFjXPz1KBiJ6Vp*fzz1)O1ET1I6BT5R9S-4)f!J21(O1W9FT2TpJmImT-1AT1_J1020101000200000101010002001111002000100010100000\"/><path id=\"horizontal-leg-press-m-z-st-thigh.r\" d=\"^60\"/><path id=\"horizontal-leg-press-m-z-st-kneecap.r\" d=\"^61\"/><path id=\"horizontal-leg-press-m-z-st-shank.r\" d=\"^62\"/><path id=\"horizontal-leg-press-m-z-st-foot.r\" d=\"^63\"/><path id=\"horizontal-leg-press-m-z-e-thigh.l\" d=\"~#F12P)c(NF1xSa.AH1OiwfF1A2YF3EB2OjK2T9nE(2DR1zU1(1.y1JkGrPJ1z-2w_1)3W8O7Fi_O3G-1G1z2zmW8yb_x2Y!2I3y(1EA1JP1zO200001000101000200000000121200021000100002101010020000010000010020000020200100000\"/><path id=\"horizontal-leg-press-m-z-e-kneecap.l\" d=\"~~y*s_(nU-21\"/><path id=\"horizontal-leg-press-m-z-e-shank.l\" d=\"~#F12DOw1HYqzSt*GrXnW2jK2!W3TH1IiG7)8E3B)3SH1zu.6znF6ImJlBz4ysz6J7)bWfw!3-nkJ2XlY9FtSiUW1Pc!G1KbUF1TD102000000010000000000200000200020010022000000000022000000000000000000100000000010\"/><path id=\"horizontal-leg-press-m-z-e-foot.l\" d=\"~#o2HEV1WFjGET1KBiJ6Vp)fzz1)O1ET1I6BT5R9S-4xg!J22(O1S9FT2TpJmGmT-1AT1_J1021101001200000101011012000101000010000000100000\"/><path id=\"horizontal-leg-press-m-z-e-shcap.l\" d=\"M-50.14 80.07a15.36 15.36 0 1 0 30.72 0a15.36 15.36 0 1 0 -30.72 0Z\"/><path id=\"horizontal-leg-press-m-z-e-upper.l\" d=\"M-42.62 93.28C-40.14 95.88 -37.25 96.73 -35.03 98.13C-32.81 99.54 -31.22 100.53 -29.31 101.71C-27.39 102.89 -27.24 103.13 -23.53 105.21C-19.82 107.28 -12.41 111.45 -7.04 114.17C-1.68 116.88 3.5 119.18 8.67 121.5C13.84 123.81 19.85 126.79 23.98 128.04C28.11 129.29 30.88 129.64 33.45 128.98C36.02 128.33 38.18 126.18 39.41 124.1C40.64 122.03 41.5 119.1 40.84 116.53C40.19 113.96 38.55 111.69 35.47 108.67C32.4 105.64 26.9 101.8 22.4 98.37C17.89 94.94 13.39 91.49 8.44 88.08C3.48 84.67 -3.73 80.17 -7.33 77.91C-10.93 75.64 -11.21 75.63 -13.16 74.51C-15.12 73.39 -16.75 72.47 -19.05 71.2C-21.35 69.92 -23.47 67.8 -26.94 66.86C-30.41 65.93 -36.35 64.68 -39.86 65.58C-43.37 66.47 -46.31 69.4 -47.99 72.23C-49.67 75.06 -50.84 79.05 -49.94 82.56C-49.05 86.07 -45.11 90.69 -42.62 93.28Z\"/><path id=\"horizontal-leg-press-m-z-e-elbowcap.l\" d=\"~~JT3WznJD22\"/><path id=\"horizontal-leg-press-m-z-e-fore.l\" d=\"~#F12YA4YWoXE3xPn-9)eJ3F1SY1WP1*5Igfz5-y1RB1.7.rRfBgRr.8BA1EA1z5jzgV6PN1P_1A1H3TeEaOk(7yc!H1!nYoFH1Wd00101202200000000002100001000210101010121010002000000200002000010002000000001000\"/><path id=\"horizontal-leg-press-m-z-e-fist.l\" d=\"~~NKfYBz1ww20\"/><path id=\"horizontal-leg-press-m-z-e-head\" d=\"M-86.54 -5.28C-82.31 -7.14 -75.51 -9.98 -70.63 -10.26C-65.75 -10.53 -61.06 -8.97 -57.26 -6.93C-53.47 -4.88 -50.4 -1.11 -47.88 2C-45.36 5.1 -44.02 8.16 -42.14 11.7C-40.25 15.25 -38.01 19.66 -36.58 23.25C-35.15 26.84 -33.92 30.24 -33.58 33.25C-33.24 36.26 -32.82 39.22 -34.53 41.29C-36.23 43.36 -40.62 44.92 -43.81 45.65C-47 46.38 -50.06 46.07 -53.66 45.66C-57.25 45.26 -60.58 43.55 -65.4 43.21C-70.22 42.87 -77.62 44.58 -82.57 43.64C-87.52 42.69 -91.81 40.44 -95.09 37.54C-98.37 34.64 -100.92 30.39 -102.24 26.27C-103.57 22.14 -104.08 17 -103.04 12.77C-102 8.55 -98.76 3.92 -96.01 0.91C-93.26 -2.09 -90.77 -3.42 -86.54 -5.28Z\"/><path id=\"horizontal-leg-press-m-z-e-torso\" d=\"M-77.27 44.88C-80.63 49.47 -74.09 54.34 -73.01 59.43C-71.93 64.52 -71.69 70.28 -70.8 75.42C-69.91 80.56 -69.63 85.01 -67.66 90.28C-65.68 95.55 -62.46 101.52 -58.95 107.03C-55.43 112.55 -51.76 117.72 -46.57 123.38C-41.37 129.04 -34.29 135.36 -27.76 141.02C-21.23 146.68 -13.09 152.66 -7.38 157.34C-1.67 162.02 3.06 164.73 6.49 169.09C9.93 173.45 11.34 178.05 13.23 183.49C15.12 188.92 15.8 196.37 17.81 201.7C19.83 207.02 22.2 211.83 25.33 215.44C28.47 219.05 32.5 222.12 36.64 223.33C40.77 224.54 45.52 224.23 50.14 222.7C54.76 221.16 59.74 217.54 64.34 214.13C68.94 210.71 74.14 206.57 77.74 202.22C81.33 197.87 85.48 193.26 85.88 188.03C86.28 182.79 83.43 177.27 80.12 170.81C76.81 164.34 70.98 156.2 66.02 149.22C61.05 142.24 55.96 135.38 50.35 128.95C44.73 122.52 37.26 116.54 32.32 110.66C27.38 104.77 24.19 99.1 20.73 93.65C17.26 88.2 15.41 83.07 11.56 77.95C7.71 72.83 2.64 67.05 -2.39 62.92C-7.42 58.78 -13.66 55.33 -18.62 53.14C-23.57 50.95 -28.39 50.51 -32.13 49.78C-35.87 49.04 -38.54 50.29 -41.04 48.73C-43.55 47.18 -45.18 43.27 -47.14 40.46C-49.11 37.66 -47.83 31.16 -52.86 31.9C-57.88 32.64 -73.91 40.29 -77.27 44.88Z\"/><path id=\"horizontal-leg-press-m-z-e-thigh.r\" d=\"^64\"/><path id=\"horizontal-leg-press-m-z-e-kneecap.r\" d=\"^65\"/><path id=\"horizontal-leg-press-m-z-e-shank.r\" d=\"^66\"/><path id=\"horizontal-leg-press-m-z-e-foot.r\" d=\"^67\"/><path id=\"horizontal-leg-press-m-z-e-shcap.r\" d=\"^68\"/><path id=\"horizontal-leg-press-m-z-e-upper.r\" d=\"^69\"/><path id=\"horizontal-leg-press-m-z-e-elbowcap.r\" d=\"^70\"/><path id=\"horizontal-leg-press-m-z-e-fore.r\" d=\"^71\"/><path id=\"horizontal-leg-press-m-z-e-fist.r\" d=\"^72\"/><path id=\"horizontal-leg-press-m-z-m-thigh.r\" d=\"~#F12UKc!XF1.-9GzH1EkPcuH2(P3zX1zj.4G9x2*z3SA1*T1*4EB1YfXw1SF1))2!K1x5A8-9AhFW3GH1tE2znY5P2Wy2H!2W8Fy2.rH_1BF202020000002100000000010000010000000020000100000000000000000010000011110000111110\"/><path id=\"horizontal-leg-press-m-z-m-kneecap.r\" d=\"~~YHuD_qU-21\"/><path id=\"horizontal-leg-press-m-z-m-shank.r\" d=\"~#F12SEy1wPtGKv*JuEnU5vG2_P3-Y1xjz5K9x2)Y3Y-1Vuz3EmA9Rj!nX(3(I1E5A8*9(gAY3XD1w1F2OkHcHv!e_X1Y5AF1OgSz1GI100020000100000200101110100020012000200001000100120000000010101000000200000000000\"/><path id=\"horizontal-leg-press-m-z-m-foot.r\" d=\"~#o2!VV1WFj.VT1KBiJ6Vp)fzz1)O1ET1K6BT5R9U-4*fYJ21wP1W9FT2TpJmKmT-1FT1_J1001101000000000101000000011110000200101010002000\"/><path id=\"horizontal-leg-press-m-z-m-eq0\" d=\"~MyH-1D-y1L!*o0QPc0IRoOcLOc-J3Q0OcOc_J3LIRoPcQOc0JRoPcLPc_J3Q0PcPc-J3Z\"/><path id=\"horizontal-leg-press-m-z-m-eq1\" d=\"~MAP*1y!uL(*1VTbQw1B6xz2PJbL-_2-8Qz6x1YY2AlLXW1SNbQvD6yz2OJbL__2_8QA6w1XY2zlZ\"/><path id=\"horizontal-leg-press-m-z-m-eq2\" d=\"M316.32 158.18L316.32 -20.22Q316.32 -21.72 314.82 -21.72L307.58 -21.72Q306.08 -21.72 306.08 -20.22L306.08 158.18Q306.08 159.68 307.58 159.68L314.82 159.68Q316.32 159.68 316.32 158.18Z\"/><path id=\"horizontal-leg-press-m-z-mf-head\" d=\"^73\"/><path id=\"horizontal-leg-press-m-z-mf-torso\" d=\"^74\"/><path id=\"horizontal-leg-press-m-z-mf-thigh.l\" d=\"^75\"/><path id=\"horizontal-leg-press-m-z-mf-kneecap.l\" d=\"^76\"/><path id=\"horizontal-leg-press-m-z-mf-shank.l\" d=\"^77\"/><path id=\"horizontal-leg-press-m-z-mf-foot.l\" d=\"^78\"/><path id=\"horizontal-leg-press-m-z-mf-shcap.l\" d=\"^68\"/><path id=\"horizontal-leg-press-m-z-mf-upper.l\" d=\"^69\"/><path id=\"horizontal-leg-press-m-z-mf-elbowcap.l\" d=\"^70\"/><path id=\"horizontal-leg-press-m-z-mf-fore.l\" d=\"^71\"/><path id=\"horizontal-leg-press-m-z-mf-fist.l\" d=\"^72\"/><path id=\"horizontal-leg-press-m-z-mf-shcap.r\" d=\"^68\"/><path id=\"horizontal-leg-press-m-z-mf-upper.r\" d=\"^69\"/><path id=\"horizontal-leg-press-m-z-mf-elbowcap.r\" d=\"^70\"/><path id=\"horizontal-leg-press-m-z-mf-fore.r\" d=\"^71\"/><path id=\"horizontal-leg-press-m-z-mf-fist.r\" d=\"^72\"/><path id=\"horizontal-leg-press-m-z-mo-0\" d=\"^73\"/><path id=\"horizontal-leg-press-m-z-mo-1\" d=\"^74\"/><path id=\"horizontal-leg-press-m-z-mo-2\" d=\"^64\"/><path id=\"horizontal-leg-press-m-z-mo-3\" d=\"^65\"/><path id=\"horizontal-leg-press-m-z-mo-4\" d=\"^66\"/><path id=\"horizontal-leg-press-m-z-mo-5\" d=\"^67\"/><path id=\"horizontal-leg-press-m-z-mo-6\" d=\"^68\"/><path id=\"horizontal-leg-press-m-z-mo-7\" d=\"^69\"/><path id=\"horizontal-leg-press-m-z-mo-8\" d=\"^70\"/><path id=\"horizontal-leg-press-m-z-mo-9\" d=\"^71\"/><path id=\"horizontal-leg-press-m-z-mo-10\" d=\"^72\"/><path id=\"horizontal-leg-press-m-z-mo-11\" d=\"^64\"/><path id=\"horizontal-leg-press-m-z-mo-12\" d=\"^65\"/><path id=\"horizontal-leg-press-m-z-mo-13\" d=\"^66\"/><path id=\"horizontal-leg-press-m-z-mo-14\" d=\"^67\"/><path id=\"horizontal-leg-press-m-z-mo-15\" d=\"^68\"/><path id=\"horizontal-leg-press-m-z-mo-16\" d=\"^69\"/><path id=\"horizontal-leg-press-m-z-mo-17\" d=\"^70\"/><path id=\"horizontal-leg-press-m-z-mo-18\" d=\"^71\"/><path id=\"horizontal-leg-press-m-z-mo-19\" d=\"^72\"/><path id=\"horizontal-leg-press-m-z-mo-20\" d=\"M-85.99 346.89L60.41 346.89Q62.41 346.89 62.41 344.89L62.41 337.19Q62.41 335.19 60.41 335.19L-85.99 335.19Q-87.99 335.19 -87.99 337.19L-87.99 344.89Q-87.99 346.89 -85.99 346.89Z\"/><path id=\"horizontal-leg-press-m-z-mo-21\" d=\"M-58.19 335.19L-47.56 335.19Q-45.56 335.19 -45.56 333.19L-45.56 148.08Q-45.56 146.08 -47.56 146.08L-58.19 146.08Q-60.19 146.08 -60.19 148.08L-60.19 333.19Q-60.19 335.19 -58.19 335.19Z\"/><path id=\"horizontal-leg-press-m-z-mo-22\" d=\"~MSYa(Nx2LNy20QPc0*V1OcLOc-*hQ0OcOc_*hL*V1PcQOc0(V1PcLPc_*hQ0PcPc-*hZ\"/><path id=\"horizontal-leg-press-m-z-mo-23\" d=\"M31.04 201.4L-128.39 41.13Q-131.21 38.29 -134.05 41.11L-142.89 49.91Q-145.73 52.73 -142.91 55.57L16.52 215.84Q19.34 218.68 22.18 215.85L31.03 207.05Q33.86 204.23 31.04 201.4Z\"/><path id=\"horizontal-leg-press-m-z-mo-24\" d=\"~MP(k(!D1L)SiP(3QOoD5W)h.w3LSz1WN1QD5NoJdx-1LNVhVR4QNoE5-)hYw3LOz1TN1QB5KoIdy-1Z\"/><path id=\"horizontal-leg-press-m-z-mo-25\" d=\"~Mw*R2wAA1L0FGuQ0F6F6)yuLw.2E6QF60)_2E6LE6)yuQ0E6E6wzuL)_2F6QE60w.2F6Z\"/><path id=\"horizontal-leg-press-m-z-mo-26\" d=\"~MFOawAA1L0FGuQ0F6F6)yuL(_2E6QF60*_2E6LE6)yuQ0E6E6wzuL*_2F6QE60(_2F6Z\"/><path id=\"horizontal-leg-press-m-z-mo-27\" d=\"~MDzayYz2LSTI20QF60GKI2E6LE6IW1Q0E6E6JW1LGKI2F6QE60HKI2F6LF6JW1Q0F6F6IW1Z\"/><path id=\"horizontal-leg-press-m-z-mo-28\" d=\"~MP.Y1D-y1L!*o0QPc0IRoOcLOc-J3Q0OcOc_J3LIRoPcQOc0JRoPcLPc_J3Q0PcPc-J3Z\"/><path id=\"horizontal-leg-press-m-z-mo-29\" d=\"~MSx*1y!uL(*1VTbQy1B6xz2PJbLX_2-8QB6x1WY2AlLXW1SNbQx1D6yz2OJbLY_2_8QD6w1VY2zlZ\"/><path id=\"horizontal-leg-press-m-z-mo-30\" d=\"M313.99 158.18L313.99 -20.22Q313.99 -21.72 312.49 -21.72L305.25 -21.72Q303.75 -21.72 303.75 -20.22L303.75 158.18Q303.75 159.68 305.25 159.68L312.49 159.68Q313.99 159.68 313.99 158.18Z\"/><path id=\"horizontal-leg-press-m-z-mo-31\" d=\"~~PJgYBz1(w11\"/><path id=\"horizontal-leg-press-m-z-mo-32\" d=\"~~DEhYBz1F60\"/></defs>\n  \n  <path class=\"floorline\" d=\"M-184.54 347.39H457.4\"/><path class=\"eq\" d=\"^82\"/><path class=\"eq\" d=\"^83\"/><path class=\"eq\" d=\"^84\"/><path class=\"eq\" d=\"~MNKhYBz1LRA1!W5\"/><path class=\"eq\" d=\"^85\"/><path class=\"eq\" d=\"^86\"/><path class=\"eq-line\" d=\"~MyDcyPw1L_KE20\"/><path class=\"eq-line\" d=\"~MyDcD-y1L_KE20\"/><path class=\"eq\" d=\"^87\"/><path class=\"eq\" d=\"^88\"/><path class=\"eq\" d=\"^89\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-m-z-st-thigh.l\"/><use href=\"#horizontal-leg-press-m-z-st-kneecap.l\"/><use href=\"#horizontal-leg-press-m-z-st-shank.l\"/><use href=\"#horizontal-leg-press-m-z-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-m-z-st-thigh.l\"/><use href=\"#horizontal-leg-press-m-z-st-kneecap.l\"/><use href=\"#horizontal-leg-press-m-z-st-shank.l\"/><use href=\"#horizontal-leg-press-m-z-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-m-z-st-thigh.r\"/><use href=\"#horizontal-leg-press-m-z-st-kneecap.r\"/><use href=\"#horizontal-leg-press-m-z-st-shank.r\"/><use href=\"#horizontal-leg-press-m-z-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-m-z-st-thigh.r\"/><use href=\"#horizontal-leg-press-m-z-st-kneecap.r\"/><use href=\"#horizontal-leg-press-m-z-st-shank.r\"/><use href=\"#horizontal-leg-press-m-z-st-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^90\"/><path class=\"eq\" d=\"^91\"/><path class=\"eq-solid\" d=\"^92\"/><path class=\"eq-thin\" d=\"M223.33 159.68L223.33 -21.72L233.57 -21.72L233.57 159.68L223.33 159.68\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-m-z-e-thigh.l\"/><use href=\"#horizontal-leg-press-m-z-e-kneecap.l\"/><use href=\"#horizontal-leg-press-m-z-e-shank.l\"/><use href=\"#horizontal-leg-press-m-z-e-foot.l\"/><use href=\"#horizontal-leg-press-m-z-e-shcap.l\"/><use href=\"#horizontal-leg-press-m-z-e-upper.l\"/><use href=\"#horizontal-leg-press-m-z-e-elbowcap.l\"/><use href=\"#horizontal-leg-press-m-z-e-fore.l\"/><use href=\"#horizontal-leg-press-m-z-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-m-z-e-thigh.l\"/><use href=\"#horizontal-leg-press-m-z-e-kneecap.l\"/><use href=\"#horizontal-leg-press-m-z-e-shank.l\"/><use href=\"#horizontal-leg-press-m-z-e-foot.l\"/><use href=\"#horizontal-leg-press-m-z-e-shcap.l\"/><use href=\"#horizontal-leg-press-m-z-e-upper.l\"/><use href=\"#horizontal-leg-press-m-z-e-elbowcap.l\"/><use href=\"#horizontal-leg-press-m-z-e-fore.l\"/><use href=\"#horizontal-leg-press-m-z-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-m-z-e-head\"/><use href=\"#horizontal-leg-press-m-z-e-torso\"/><use href=\"#horizontal-leg-press-m-z-e-thigh.r\"/><use href=\"#horizontal-leg-press-m-z-e-kneecap.r\"/><use href=\"#horizontal-leg-press-m-z-e-shank.r\"/><use href=\"#horizontal-leg-press-m-z-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-m-z-e-head\"/><use href=\"#horizontal-leg-press-m-z-e-torso\"/><use href=\"#horizontal-leg-press-m-z-e-thigh.r\"/><use href=\"#horizontal-leg-press-m-z-e-kneecap.r\"/><use href=\"#horizontal-leg-press-m-z-e-shank.r\"/><use href=\"#horizontal-leg-press-m-z-e-foot.r\"/></g></g><path class=\"eq-solid\" d=\"^93\"/><path class=\"eq-pin\" d=\"^94\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-m-z-e-shcap.r\"/><use href=\"#horizontal-leg-press-m-z-e-upper.r\"/><use href=\"#horizontal-leg-press-m-z-e-elbowcap.r\"/><use href=\"#horizontal-leg-press-m-z-e-fore.r\"/><use href=\"#horizontal-leg-press-m-z-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#horizontal-leg-press-m-z-e-shcap.r\"/><use href=\"#horizontal-leg-press-m-z-e-upper.r\"/><use href=\"#horizontal-leg-press-m-z-e-elbowcap.r\"/><use href=\"#horizontal-leg-press-m-z-e-fore.r\"/><use href=\"#horizontal-leg-press-m-z-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"-34.78\" cy=\"80.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"29.73\" cy=\"118.35\" r=\"2.25\"/><circle class=\"joint\" cx=\"54.08\" cy=\"185.97\" r=\"2.25\"/><circle class=\"joint\" cx=\"162.35\" cy=\"122.69\" r=\"2.25\"/></g><mask id=\"horizontal-leg-press-m-z-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#horizontal-leg-press-m-z-mf-head\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mf-torso\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mf-thigh.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mf-kneecap.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mf-shank.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mf-foot.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mf-shcap.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mf-upper.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mf-fore.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mf-fist.l\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-m-thigh.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-m-kneecap.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-m-shank.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-m-foot.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mf-shcap.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mf-upper.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mf-fore.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mf-fist.r\" fill=\"#000\"/><use href=\"#horizontal-leg-press-m-z-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#horizontal-leg-press-m-z-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#horizontal-leg-press-m-z-mmask)\"><g class=\"u-stroke\"><use href=\"#horizontal-leg-press-m-z-m-thigh.r\"/><use href=\"#horizontal-leg-press-m-z-m-kneecap.r\"/><use href=\"#horizontal-leg-press-m-z-m-shank.r\"/><use href=\"#horizontal-leg-press-m-z-m-foot.r\"/><use href=\"#horizontal-leg-press-m-z-m-eq0\"/><use href=\"#horizontal-leg-press-m-z-m-eq1\"/><use href=\"#horizontal-leg-press-m-z-m-eq2\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MwSaHHA1LFHK1B.i\"/></g>\n</g><circle class=\"pz-ring\" cx=\"166\" cy=\"130\" r=\"52\"/></g></svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"horizontal-leg-press-m-lock\" data-key=\"lock\" data-cue=\"The knees snap straight and lock at the end of the push.\" class=\"plate-callout two m\" style=\"left:56.98%;top:71.51%\" aria-pressed=\"true\">Knees<br>locked</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "back",
        cues: [{ key: "back", cue: "Keep the back and tailbone flat on the pad, hips down." }, { key: "ninety", cue: "Set the seat so the knees start at about 90 degrees, heels flat." }, { key: "soft", cue: "End each push with a small bend left in the knees." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "lock",
        cues: [{ key: "lock", cue: "The knees snap straight and lock at the end of the push." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Knees locked</b><span>The knees snap straight and lock at the end of the push.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: press 2 seconds, hold 1 second, return 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div></div>",
      alt: "Horizontal leg press, side view. Seated with the back and tailbone on an upright pad and the feet flat on a vertical plate, the lifter pushes the sled along a level rail from knees at about 90 degrees until the knees are relaxed and nearly straight, never locked.",
      mistakeAlt: "Horizontal Leg Press: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "why": "D-SHIP-C3: card-no-zoom; the card has no hand zoom, and its grip copy (inherited from leg_press, c2) carries the light hold.",
    "archetype": "balance",
    "handle": "pad-handle",
    "loadAxis": "across",
    "width": {
      "text": "Set by the machine: one handle beside each hip. Arms relaxed with soft elbows, shoulders down and back on the pad.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press"
        ],
        "note": "c2 (inherit: grip; posture Hands light on the side handles)"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press"
        ],
        "note": "c2 (inherit: grip; posture Hands light on the side handles)"
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        20
      ],
      "dev": [
        -10,
        10
      ],
      "limitText": "",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press"
        ],
        "note": "c2"
      }
    },
    "pose": {
      "view": "radial",
      "forearm": 0,
      "wrist": {
        "ext": 8,
        "dev": 0
      },
      "contactAt": 0.9,
      "fingers": {
        "curl": 1
      },
      "thumb": "wrapped",
      "squeeze": "light",
      "handle": {
        "profile": "pad-handle",
        "axis": "across",
        "strut": [
          -0.35,
          1
        ]
      },
      "load": {
        "kind": "pull"
      }
    },
    "faults": [
      {
        "key": "push-on-knees",
        "label": "Pushing on knee",
        "pose": {
          "forearm": 0,
          "wrist": {
            "ext": 80,
            "dev": 0
          },
          "contactAt": 0.45,
          "fingers": {
            "curl": 1
          },
          "thumb": "beside",
          "squeeze": "firm",
          "handle": {
            "profile": "machine-grip",
            "axis": "across",
            "diameterMm": 104
          },
          "load": {
            "kind": "push"
          }
        },
        "markers": [
          "lever-arc"
        ],
        "alt": "Palm pressed on the front of the knee to push a hard rep up. The wrist folds back about 80 degrees. The push runs behind the wrist, bending it further."
      }
    ],
    "gripLine": "Hold the handles lightly.",
    "cue": "Light hands, never on your knees."
  },
  contacts: [
    "foot-platform",
    "seat-back"
  ],
  setup: [
    {
      "kind": "get-in",
      "text": "Sit back, back and tailbone flat against the pad.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press",
          "webmd-seated-leg-press"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Feet flat on the plate, toes forward.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press",
          "webmd-seated-leg-press"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "adjust",
      "text": "Set the seat: knees at about 90 degrees, thighs clear of ribs.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press",
          "webmd-seated-leg-press"
        ],
        "note": "c1, c5"
      }
    },
    {
      "kind": "grip",
      "text": "Hold the handles lightly and brace your stomach.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "brace",
      "text": "Breathe out as you push. Control the plate on the way back.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA",
          "MECH"
        ],
        "sources": [
          "ace-seated-leg-press",
          "webmd-seated-leg-press",
          "macdougall1985"
        ],
        "note": "c3, c11, c5"
      }
    }
  ],
  posture: [
    {
      "key": "back",
      "label": "Tailbone on pad",
      "detail": "Your lower back stays on the pad with no gap, even at the bottom. Hips sit in the corner of the seat.",
      "anchor": {
        "at": "sacrum",
        "pose": "end"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press",
          "webmd-seated-leg-press"
        ],
        "note": "c1, c4 (inherit: posture Tailbone and lower back flat on the pad)"
      }
    },
    {
      "key": "feet",
      "label": "Whole foot flat",
      "detail": "Heels down, foot in the middle of the plate, toes straight or out a little. Push from heel through ball.",
      "anchor": {
        "at": "heel.r",
        "pose": "end"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press",
          "webmd-seated-leg-press"
        ],
        "note": "c1, c3 (inherit: posture Whole foot flat, mid-platform)"
      }
    },
    {
      "key": "soft",
      "label": "Soft knees",
      "detail": "At the top your legs are almost straight, with a small bend at the knee.",
      "anchor": {
        "at": "knee.r",
        "pose": "end"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press",
          "webmd-seated-leg-press"
        ],
        "note": "c3, c4 (inherit: posture Soft knees at the top)"
      }
    },
    {
      "key": "hands",
      "label": "Hands light",
      "detail": "Arms relaxed, shoulders and head on the pad, hands wrapped lightly round the side handles.",
      "anchor": {
        "at": "grip.r",
        "pose": "end"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press"
        ],
        "note": "c2 (inherit: grip; posture Hands light on the side handles)"
      }
    },
    {
      "key": "top",
      "label": "Heels pressed",
      "detail": "Heels pressed into the plate. Knees stop relaxed, never locked.",
      "anchor": {
        "at": "knee.r",
        "pose": "end"
      },
      "zoom": "knee-top",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA",
          "WEAK"
        ],
        "sources": [
          "ace-seated-leg-press",
          "webmd-seated-leg-press",
          "barnds2019"
        ],
        "note": "c7, c4, c8"
      }
    },
    {
      "key": "knees-line",
      "label": "Knees in line",
      "detail": "Kneecaps follow the line of your feet.",
      "anchor": {
        "at": "knee.r",
        "pose": "end"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "webmd-seated-leg-press"
        ],
        "note": "c6"
      }
    },
    {
      "key": "seat",
      "label": "Seat set",
      "detail": "Knees at about 90 degrees at the start. Thighs stay clear of your ribs.",
      "anchor": {
        "at": "knee.r",
        "pose": "start"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press",
          "webmd-seated-leg-press"
        ],
        "note": "c1, c5"
      }
    },
    {
      "key": "return",
      "label": "Controlled return",
      "detail": "Control the plate on the way back. Thighs never press into your ribs.",
      "anchor": {
        "at": "hip.r",
        "pose": "start"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press",
          "webmd-seated-leg-press"
        ],
        "note": "c5"
      }
    }
  ],
  zooms: [
    {
      "key": "knee-top",
      "chip": "Knees",
      "heading": "Knee lockout",
      "kind": "posture",
      "feelRow": "knee"
    }
  ],
  chips: [
    "knee-top",
    "feel"
  ],
  copy: {
    "setupLine": "Sit back, tailbone flat on the pad. Feet flat, knees at about 90 degrees, thighs clear of your ribs.",
    "mistakeLine": "Keep a small bend at the top. Never lock your knees.",
    "cueLine": "Heels pressed, soft knees."
  },
  mistakes: [
    {
      "key": "lock",
      "title": "Locking the knees",
      "zoom": "knee-top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press"
        ],
        "note": "c7"
      },
      "fix": "Stop just short of straight. Keep a small bend."
    },
    {
      "key": "hips",
      "title": "Hips lifting, lower back rounding",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press",
          "webmd-seated-leg-press"
        ],
        "note": "c4, c2, c1"
      },
      "fix": "Set the seat so your knees start at about 90 degrees."
    },
    {
      "key": "knees-in",
      "title": "Knees falling in",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "webmd-seated-leg-press"
        ],
        "note": "c6"
      },
      "fix": "Keep your kneecaps in line with your feet."
    }
  ],
  risks: [
    {
      "key": "lock",
      "text": "Locking the knees under load is very rarely linked to knee dislocation.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "barnds2019"
        ],
        "note": "c8"
      }
    },
    {
      "key": "breath",
      "text": "Heavy presses to failure sent blood pressure very high, partly from breath holding.",
      "claim": {
        "tags": [
          "DATA",
          "MECH"
        ],
        "sources": [
          "macdougall1985"
        ],
        "note": "c11"
      }
    },
    {
      "key": "back",
      "text": "Avoid rounding your lower back off the pad.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-seated-leg-press",
          "webmd-seated-leg-press"
        ],
        "note": "c4, c2"
      }
    }
  ],
  riskFlags: [
    "knee",
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
    "ace-seated-leg-press",
    "webmd-seated-leg-press",
    "barnds2019",
    "tassi1998",
    "tassi1999",
    "escamilla2001",
    "macdougall1985",
    "nhs-knee-pain",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/horizontal_leg_press.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

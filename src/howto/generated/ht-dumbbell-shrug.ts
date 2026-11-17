// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=492bc3b5c07f9220addb5348c00deb94e7632336fefad614b1965325e4ecd3e1
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_dumbbell_shrug",
  name: "Dumbbell Shrug",
  hashes: { inputsSha256: "492bc3b5c07f9220addb5348c00deb94e7632336fefad614b1965325e4ecd3e1", golden: "a9f1b5f848b77ecc04b693727abbf921411766ddbea2f8679cf132cbf23f8e46" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-shrug-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-shrug-n-st-shcap.r\" d=\"~~S)qyJqwP10\"/><path id=\"dumbbell-shrug-n-st-upper.r\" d=\"~#F12U)qNGqRyr.Bpw1-8a19YO1S3-5S1.2!7zD1AbBiqKg*8BjT3-D1G1x3-2x6x5JO1702)8Bg.1xfWoE1NmHcHq00002201011210012100000000200011100000000000000200100000000100101200000000020001\"/><path id=\"dumbbell-shrug-n-st-elbowcap.r\" d=\"~~(.qDVz1Dz10\"/><path id=\"dumbbell-shrug-n-st-fore.r\" d=\"~#F12J_qPTz1T(qTXy1D2Bam!1N1SI1y4z9U1G2w2*w1N7KceEbB6xdw1*w1R1K2x3O9K5FI1r!1B1KaBahIbAjnAhS9yk20000101001110002010010000000010010000001210100020000000000121000202000100111000\"/><path id=\"dumbbell-shrug-n-st-fist.r\" d=\"~~yRq!KK1ww10\"/><path id=\"dumbbell-shrug-n-e-head\" d=\"~#D12Y(y1yJgzVx1VBgEjNeXcDbT9D3-4B3B3B3-4B3-4x8R1*7B3T9D3T9S1*7_4x8_4B3D3B3_4B3U9D3YcDbFjNe0000100000001010020002101000002000000000000010000000000200022020000000200000\"/><path id=\"dumbbell-shrug-n-e-torso\" d=\"~#A22SIA1yJl)GA1E)j!czE1Arz9y8ylK6WgIeWq-J1Bg-4-cU9_sT9Yc_4R9DjI6U9J6-c0)n-c)E1)nID2BrJD2BrwF1)nwo-c_c0T9J6BjI6-4R9U9YcT9_s_4-c_J1BgJeWqN6Wgx8ylzrz9.czE1yY2_J10020001000022000110100000000002101010000000002200000000000002000000000100000000000001002000000000101110000000000010110100200200010000000\"/><path id=\"dumbbell-shrug-n-e-thigh.l\" d=\"~#F12Jyz1DAF1V-y1*VD1)2ObG14Aa_*1y5K8J2z4z3.U1!9zoz2zkXeRlx8EU1B3T3X6x7D3N(1D13k-bGw1T8OhwI1_3Yz1AqFD100002100110020010020000001200001200000000200020200010100000000101000020000010000\"/><path id=\"dumbbell-shrug-n-e-kneecap.l\" d=\"~~FIB1PwU1_J10\"/><path id=\"dumbbell-shrug-n-e-shank.l\" d=\"~#F12YGB1FzU1XHB1)TS1A1.bF11S8J(1P5z8P2z4V7Ky2P6)dj*bB8zd3*y2)2V3I6O7B1((1E14R2VbxcHcXbJpD1YlYe_n00000001010001000000011101000022000200010120002000011000000111000000001002200000\"/><path id=\"dumbbell-shrug-n-e-foot.l\" d=\"~#e2wGE1_P)1zYB1-U)1.oF_1KeItXK1OfV9T5NB1Bz1PgIp1010000000000200000020021000\"/><path id=\"dumbbell-shrug-n-e-thigh.r\" d=\"~#F12Jyu(TE1Rzu*AD1j-bB13B3N(1Y6x7D3T3y8EU1YeRlA2zk.9zoA3.U1I2z4x5K8za_*1H14w3ObXtzfzqFD1-3Yz1PhwI100000000001111000212101210000010010010010000100001100021001100000000010000020000\"/><path id=\"dumbbell-shrug-n-e-kneecap.r\" d=\"~~UYtPwU1_J10\"/><path id=\"dumbbell-shrug-n-e-shank.r\" d=\"~#F12AXt_*T1V*t)NS1S2VbF14D1((1J6O7w3V34*y2D8zdk*bO6)dW7Ky2O2z4O5z8R8J(1E11z1.bKd_aXe_nB1YlYbJp00210100000011001000100101000200120000012101000000010001010000000000100220000000\"/><path id=\"dumbbell-shrug-n-e-foot.r\" d=\"~#e2PUu_P)1IBw1-U)1!oF_1NeItYK1OfW9T5KB1Bz1OgIp2020001010000200000010022000\"/><path id=\"dumbbell-shrug-n-e-shcap.l\" d=\"~~(*E1J(owP10\"/><path id=\"dumbbell-shrug-n-e-upper.l\" d=\"~#F12w(E1wxp*!E1G*n1*880y5NO1_2z6H1z3U3VD1(8EjpOgzbzi.7xD1R1)2R3V5aUO192v*8Bg3GcFqF1Jmyf_o00101002000022000000010002000001000010000000011000000010101000020000000000020000\"/><path id=\"dumbbell-shrug-n-e-elbowcap.l\" d=\"~~A.F1NEy1Dz10\"/><path id=\"dumbbell-shrug-n-e-fore.l\" d=\"~#F12S-F1AGy1E.F1)Jx1D1Gas_1N5FI1y3O9S1K2v*w1D6zddBbK7Kc)1*w1T1E2x4B9K1PI1lw2B2EaBaaR9wkoFhJbyj00100000001010100001002000000000220002000000201000010002000001100001000000010100\"/><path id=\"dumbbell-shrug-n-e-fist.l\" d=\"~~NJG1DwJ1ww10\"/><path id=\"dumbbell-shrug-n-e-shcap.r\" d=\"~~S)qJ(owP10\"/><path id=\"dumbbell-shrug-n-e-upper.r\" d=\"~#F12U)qW.oRyrxYnw1*8a29UO1S3V5S1)2!7xD1AbziqOg*8EjT3VD1G1z3-2z6x5NO1702*8Bg)1xf_oE1JmHcFq02002000001010002001000000200010110000020001000000120000020000101000020000000000\"/><path id=\"dumbbell-shrug-n-e-elbowcap.r\" d=\"~~(.qNEy1Dz10\"/><path id=\"dumbbell-shrug-n-e-fore.r\" d=\"~#F12J_q_By1T(q*Gx1D2Eamw2N1PI1y4B9U1E2w2*w1N7KceBbB6zdw1*w1R1K2x3O9K5FI1r_1B1GaBajIbyjnFhS9wk20010000021011002010000000020012000000001010110020000000000020000001010000101100\"/><path id=\"dumbbell-shrug-n-e-fist.r\" d=\"~~yRqDwJ1ww10\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-shrug-n-dots)\"/>\n  <path class=\"datum\" d=\"~MPSz2y!oLRAq0\"/><path class=\"datum\" d=\"~MPSz2JNnLRAq0\"/><path class=\"floorline\" d=\"M104.39 339.5H253.61\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shrug-n-st-shcap.r\"/><use href=\"#dumbbell-shrug-n-st-upper.r\"/><use href=\"#dumbbell-shrug-n-st-elbowcap.r\"/><use href=\"#dumbbell-shrug-n-st-fore.r\"/><use href=\"#dumbbell-shrug-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shrug-n-st-shcap.r\"/><use href=\"#dumbbell-shrug-n-st-upper.r\"/><use href=\"#dumbbell-shrug-n-st-elbowcap.r\"/><use href=\"#dumbbell-shrug-n-st-fore.r\"/><use href=\"#dumbbell-shrug-n-st-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shrug-n-e-head\"/><use href=\"#dumbbell-shrug-n-e-torso\"/><use href=\"#dumbbell-shrug-n-e-thigh.l\"/><use href=\"#dumbbell-shrug-n-e-kneecap.l\"/><use href=\"#dumbbell-shrug-n-e-shank.l\"/><use href=\"#dumbbell-shrug-n-e-foot.l\"/><use href=\"#dumbbell-shrug-n-e-thigh.r\"/><use href=\"#dumbbell-shrug-n-e-kneecap.r\"/><use href=\"#dumbbell-shrug-n-e-shank.r\"/><use href=\"#dumbbell-shrug-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shrug-n-e-head\"/><use href=\"#dumbbell-shrug-n-e-torso\"/><use href=\"#dumbbell-shrug-n-e-thigh.l\"/><use href=\"#dumbbell-shrug-n-e-kneecap.l\"/><use href=\"#dumbbell-shrug-n-e-shank.l\"/><use href=\"#dumbbell-shrug-n-e-foot.l\"/><use href=\"#dumbbell-shrug-n-e-thigh.r\"/><use href=\"#dumbbell-shrug-n-e-kneecap.r\"/><use href=\"#dumbbell-shrug-n-e-shank.r\"/><use href=\"#dumbbell-shrug-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shrug-n-e-shcap.l\"/><use href=\"#dumbbell-shrug-n-e-upper.l\"/><use href=\"#dumbbell-shrug-n-e-elbowcap.l\"/><use href=\"#dumbbell-shrug-n-e-fore.l\"/><use href=\"#dumbbell-shrug-n-e-fist.l\"/><use href=\"#dumbbell-shrug-n-e-shcap.r\"/><use href=\"#dumbbell-shrug-n-e-upper.r\"/><use href=\"#dumbbell-shrug-n-e-elbowcap.r\"/><use href=\"#dumbbell-shrug-n-e-fore.r\"/><use href=\"#dumbbell-shrug-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shrug-n-e-shcap.l\"/><use href=\"#dumbbell-shrug-n-e-upper.l\"/><use href=\"#dumbbell-shrug-n-e-elbowcap.l\"/><use href=\"#dumbbell-shrug-n-e-fore.l\"/><use href=\"#dumbbell-shrug-n-e-fist.l\"/><use href=\"#dumbbell-shrug-n-e-shcap.r\"/><use href=\"#dumbbell-shrug-n-e-upper.r\"/><use href=\"#dumbbell-shrug-n-e-elbowcap.r\"/><use href=\"#dumbbell-shrug-n-e-fore.r\"/><use href=\"#dumbbell-shrug-n-e-fist.r\"/></g></g><path class=\"disc\" d=\"~M!yJ1DwJ1LBrAO1LErzO1LFrzO1LJW10LFrAO1Z\"/><path class=\"disc-core\" d=\"~~w(G1DwJ1Ne0\"/><path class=\"disc\" d=\"~MNEtDwJ1LBrAO1LErzO1LFrzO1LJW10LFrAO1Z\"/><path class=\"disc-core\" d=\"~~SyrDwJ1Ne0\"/><circle class=\"joint\" cx=\"212.15\" cy=\"127.74\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"127.74\" r=\"2.25\"/><circle class=\"joint\" cx=\"214.77\" cy=\"175.27\" r=\"2.25\"/><circle class=\"joint\" cx=\"143.23\" cy=\"175.27\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#!20(KG1A.o*KG1x!o0102000001020000010200000001020000010200000102000001020000010200000001020000010200000102000100000000000000000000000000000000000002000000000000000001000000000000000100000000000000000000000000000000000000000000000002000000000000000001000000000000000100000000000000000000000001\"/><path class=\"arrow\" d=\"~M(KG1_GmLYiPB1LEY1OB1Z\"/></g><path class=\"leader\" d=\"~M!EqA!B1LEO1.5\"/><circle class=\"anchor\" cx=\"134.38\" cy=\"193.94\" r=\"1.5\"/><path class=\"leader\" d=\"~M(KG1JNnL0.B1\"/><circle class=\"anchor\" cx=\"212.15\" cy=\"120.06\" r=\"1.5\"/><path class=\"leader\" d=\"M179 149.13L162.44 101H152.44\"/><circle class=\"anchor\" cx=\"179\" cy=\"149.13\" r=\"1.5\"/>\n<g class=\"plate-zoom\" data-view=\"normal\" data-k=\"3.5\" data-c=\"282 188\" data-src=\"212.15 123.71\"><defs><clipPath id=\"dumbbell-shrug-n-zclip\"><circle cx=\"282\" cy=\"188\" r=\"52\"/></clipPath></defs><circle class=\"pz-src\" cx=\"212.15\" cy=\"123.71\" r=\"14.86\"/><path class=\"pz-link\" d=\"~MFSI1yAqLAx4_W3\"/><circle class=\"pz-bg\" cx=\"282\" cy=\"188\" r=\"52\"/><g class=\"pz-in\" clip-path=\"url(#dumbbell-shrug-n-zclip)\">\n  <defs><pattern id=\"dumbbell-shrug-n-z-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-shrug-n-z-st-shcap.r\" d=\"~~yP4wOJ1wF50\"/><path id=\"dumbbell-shrug-n-z-st-upper.r\" d=\"~#F12HP4YBJ1O_4zGF1J3zvw12p_D5DcBkW5xaPrKB4YD1R)1A3R-1KvIz2XcTE4O4Xa.9GlOh!B5z116GvKY1-6.U1UW2G4PN2wI1!.200200110000000000020020001010000000020100001200200010001012000000010000000000000\"/><path id=\"dumbbell-shrug-n-z-st-elbowcap.r\" d=\"~~Pz4((J2D.32\"/><path id=\"dumbbell-shrug-n-z-st-fore.r\" d=\"~#F12y(3y-J2)J4OXG2W7Vz1H2U6H5PY4(dzw1(5*7_6GT3wqRI1_1EE1)lXK1U3KT3E5K8*aEx1)iJX4)2N6I4BA1Kz1E2.E1!y2V2D!1Wx1yD212200010110000000011000121200020000010000000001000200002001001000000022000010100\"/><path id=\"dumbbell-shrug-n-z-st-fist.r\" d=\"~~F*2PBO3wP30\"/><path id=\"dumbbell-shrug-n-z-e-head\" d=\"~#D12FKw1wO9T.rTY8Bz2NS1.J1DE1Rx1Db-gBbBbBbXgBb.gxsR5*rEbTx1FbTx1S5*r!gxsYgBbDbBb_gBbSx1Db!J1DE1Az2NS10000100010000000000000000011001010001020001000002100101010000010102000100000\"/><path id=\"dumbbell-shrug-n-z-e-torso\" d=\"~#A22yHB1w)qKAB1BymYJ1-F4F)2)vwsSG2KmN_1IS1U*2-!4-Y1-g-J1Ux1_A3Tx1_J1_gTx1Dz2KmUx1Pm-J11)T2-J1)I4)T2KW7B)2NW7B)2wJ4)T2wU2-J1_J11Tx1PmBz2Km-gTx1Ux1_J1Tx1_A3_g-J1_!4-Y1JS1U*2NmN_1)rSG2E)2)vXJ1-F4(T9_!42001012100010000020200101010100000100111101010000010110100000000000000000000010110100000001001010000000000000000020200000100110101100000\"/><path id=\"dumbbell-shrug-n-z-e-thigh.l\" d=\"~#F12w_w1PT!2R.vXRX2VazF1G4gFz1FY6!hItA8VeXa-Y5Py1TU2R7GD2KT1KI2IsxX5)aOcXnxpAb!_6H4d(1OG1*P3xuB*1JW4Fdy*3P.2AD411000000000020000000000000210010100101012000000111000200000000000000000010000001\"/><path id=\"dumbbell-shrug-n-z-e-kneecap.l\" d=\"~~A-F1WDD4_!40\"/><path id=\"dumbbell-shrug-n-z-e-shank.l\" d=\"~#F12_TF1FPD4GXF1*Hx4w4OG1H45!tJ_6FjVs!8Ee.qKF7_mxR1O2.G1GsxN1j)G7KazdKmBqz4J!6G4a-8-F1KH1wI1BG1w-2P4!I2HT1ST210000002001001010100201000000000000000000100000020002120000010100000200220020000\"/><path id=\"dumbbell-shrug-n-z-e-foot.l\" d=\"~#e2yRO1YON5*BH1V*N5)W2WI6XS1RD3xw5KW1Xx1VjYy4)_3!-1*Y20120001000000000200000000001\"/><path id=\"dumbbell-shrug-n-z-e-thigh.r\" d=\"~#F12wHfU__2GNfxWV2*1OG1G4dzb!_6Ynxp(aOcPsxX5JT1KI2S7GD2Oy1TU2Ya-Y5z8Ve*hItzz1FY6F4gWazF1zF3BV1O.2AD4Edy*3D*1JW410000000000200210100000021010100000011000010000000002000000000010100002000101000\"/><path id=\"dumbbell-shrug-n-z-e-kneecap.r\" d=\"~~_EeWDD4_!40\"/><path id=\"dumbbell-shrug-n-z-e-shank.r\" d=\"~#F12PyeD*B4G-eI-w4_8-F1H4ay4J!6SmBqJazdk)G7HsxN1P2.G1-mxR1_qKF7X8EeGjVs.tJ_6G45)3OG1zO1WB1GT1ST2O4!I2DG1w-200000000101100002000000100101000001010002000201111012000020000000000021002100000\"/><path id=\"dumbbell-shrug-n-z-e-foot.r\" d=\"~#e2PGhYON5TUmV*N5wX2WI6YS1RD3yw5KW1Yx1VjXy4)_3.-1*Y21110002000001000101000000011\"/><path id=\"dumbbell-shrug-n-z-e-shcap.l\" d=\"~~P_R1wOE1wF50\"/><path id=\"dumbbell-shrug-n-z-e-upper.l\" d=\"~#F12Y_R1FYE1zXR1E.z15GvA11Ph!B5!9GlP4XaYcTE4NvIz2z3T-1XD1K)1OrOB4V5xaBcBkq_D5v2I3zv-Y1h)H1!.2H4PN2!U1UW200011001010001000010010020100000010200000002101000000000200110000000000000002000\"/><path id=\"dumbbell-shrug-n-z-e-elbowcap.l\" d=\"~~UwV1!(E2D.32\"/><path id=\"dumbbell-shrug-n-z-e-fore.l\" d=\"~#F12D.U1WAF2ExV1ByB2J4EA1w3N6wjJX4(aEx1F5K8T3KT3wmXK1.1EE1.pRI1.6IT3*5-7*dBw1G5PY4G2U6V7Vz1Kz1A1Vx1yD2W2D!1!E1_y200002000020010101000100000000000102000110002201000000001000010020011110010000000\"/><path id=\"dumbbell-shrug-n-z-e-fist.l\" d=\"~~H*W1PBH3wP30\"/><path id=\"dumbbell-shrug-n-z-e-shcap.r\" d=\"~~yP4wOE1wF50\"/><path id=\"dumbbell-shrug-n-z-e-upper.r\" d=\"~#F12HP4YBE1O_4zGz1J3zvw12p_D5DcBkW5xaPrOB4YD1K)1A3T-1KvIz2XcTE4O4Xa.9GlOh!B5z116GvKY1-6.U1UW2G4PN2wI1!.200200110000000000020020000000201000020100001200000010001012001000010000000000000\"/><path id=\"dumbbell-shrug-n-z-e-elbowcap.r\" d=\"~~Pz4!(E2D.32\"/><path id=\"dumbbell-shrug-n-z-e-fore.r\" d=\"~#F12y(3y-E2)J4OXA2W7Vz1H2U6H5PY4(dBw1(5-7_6IT3wqRI1_1EE1)lXK1U3KT3E5K8*aEx1)iJX4)2N6I4EA1Kz1z2.E1_y2V2D!1Wx1yD212200010110000000010020021200020000010000000001000200002001000000000002000010100\"/><path id=\"dumbbell-shrug-n-z-e-fist.r\" d=\"~~F*2PBH3wP30\"/></defs>\n  \n  <path class=\"floorline\" d=\"M-95.16 942.02H427.09\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shrug-n-z-st-shcap.r\"/><use href=\"#dumbbell-shrug-n-z-st-upper.r\"/><use href=\"#dumbbell-shrug-n-z-st-elbowcap.r\"/><use href=\"#dumbbell-shrug-n-z-st-fore.r\"/><use href=\"#dumbbell-shrug-n-z-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shrug-n-z-st-shcap.r\"/><use href=\"#dumbbell-shrug-n-z-st-upper.r\"/><use href=\"#dumbbell-shrug-n-z-st-elbowcap.r\"/><use href=\"#dumbbell-shrug-n-z-st-fore.r\"/><use href=\"#dumbbell-shrug-n-z-st-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shrug-n-z-e-head\"/><use href=\"#dumbbell-shrug-n-z-e-torso\"/><use href=\"#dumbbell-shrug-n-z-e-thigh.l\"/><use href=\"#dumbbell-shrug-n-z-e-kneecap.l\"/><use href=\"#dumbbell-shrug-n-z-e-shank.l\"/><use href=\"#dumbbell-shrug-n-z-e-foot.l\"/><use href=\"#dumbbell-shrug-n-z-e-thigh.r\"/><use href=\"#dumbbell-shrug-n-z-e-kneecap.r\"/><use href=\"#dumbbell-shrug-n-z-e-shank.r\"/><use href=\"#dumbbell-shrug-n-z-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shrug-n-z-e-head\"/><use href=\"#dumbbell-shrug-n-z-e-torso\"/><use href=\"#dumbbell-shrug-n-z-e-thigh.l\"/><use href=\"#dumbbell-shrug-n-z-e-kneecap.l\"/><use href=\"#dumbbell-shrug-n-z-e-shank.l\"/><use href=\"#dumbbell-shrug-n-z-e-foot.l\"/><use href=\"#dumbbell-shrug-n-z-e-thigh.r\"/><use href=\"#dumbbell-shrug-n-z-e-kneecap.r\"/><use href=\"#dumbbell-shrug-n-z-e-shank.r\"/><use href=\"#dumbbell-shrug-n-z-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shrug-n-z-e-shcap.l\"/><use href=\"#dumbbell-shrug-n-z-e-upper.l\"/><use href=\"#dumbbell-shrug-n-z-e-elbowcap.l\"/><use href=\"#dumbbell-shrug-n-z-e-fore.l\"/><use href=\"#dumbbell-shrug-n-z-e-fist.l\"/><use href=\"#dumbbell-shrug-n-z-e-shcap.r\"/><use href=\"#dumbbell-shrug-n-z-e-upper.r\"/><use href=\"#dumbbell-shrug-n-z-e-elbowcap.r\"/><use href=\"#dumbbell-shrug-n-z-e-fore.r\"/><use href=\"#dumbbell-shrug-n-z-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shrug-n-z-e-shcap.l\"/><use href=\"#dumbbell-shrug-n-z-e-upper.l\"/><use href=\"#dumbbell-shrug-n-z-e-elbowcap.l\"/><use href=\"#dumbbell-shrug-n-z-e-fore.l\"/><use href=\"#dumbbell-shrug-n-z-e-fist.l\"/><use href=\"#dumbbell-shrug-n-z-e-shcap.r\"/><use href=\"#dumbbell-shrug-n-z-e-upper.r\"/><use href=\"#dumbbell-shrug-n-z-e-elbowcap.r\"/><use href=\"#dumbbell-shrug-n-z-e-fore.r\"/><use href=\"#dumbbell-shrug-n-z-e-fist.r\"/></g></g><path class=\"disc\" d=\"~MWIw2PBH3LB)2!A5LB)2.A5LA)2.A5LP(51LA)2(A5Z\"/><path class=\"disc-core\" d=\"~~Y_Y1PBH3SS10\"/><path class=\"disc\" d=\"~MWIcPBH3LE)2!A5Lz)2.A5LD)2.A5LJ(51LD)2(A5Z\"/><path class=\"disc-core\" d=\"~~W_4PBH3SS10\"/><circle class=\"joint\" cx=\"282\" cy=\"202.08\" r=\"2.25\"/><circle class=\"joint\" cx=\"49.93\" cy=\"202.08\" r=\"2.25\"/><circle class=\"joint\" cx=\"291.18\" cy=\"368.46\" r=\"2.25\"/><circle class=\"joint\" cx=\"40.75\" cy=\"368.46\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#!20PyX1WzE1OyX1xEE10200010200010200010200010200010200010200010200010200010200010200010200010200010200010200010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000020000010000\"/><path class=\"arrow\" d=\"~MPyX1_Ax1LYiPB1LEY1OB1Z\"/></g>\n</g><circle class=\"pz-ring\" cx=\"282\" cy=\"188\" r=\"52\"/></g></svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"dumbbell-shrug-n-arms\" data-key=\"arms\" data-cue=\"Let your arms hang straight. Only the shoulders lift.\" class=\"plate-callout\" style=\"left:5.59%;top:47.77%\" aria-pressed=\"true\">Straight arms</button><button type=\"button\" id=\"dumbbell-shrug-n-up\" data-key=\"up\" data-cue=\"Lift your shoulders straight up and down, not forward or back.\" class=\"plate-callout\" style=\"left:59.78%;top:22.63%\" aria-pressed=\"false\">Straight up</button><button type=\"button\" id=\"dumbbell-shrug-n-tall\" data-key=\"tall\" data-cue=\"Stand tall and keep your trunk braced the whole set.\" class=\"plate-callout\" style=\"left:19.55%;top:22.07%\" aria-pressed=\"false\">Stand tall</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-shrug-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-shrug-m-st-shcap.r\" d=\"^0\"/><path id=\"dumbbell-shrug-m-st-upper.r\" d=\"^1\"/><path id=\"dumbbell-shrug-m-st-elbowcap.r\" d=\"^2\"/><path id=\"dumbbell-shrug-m-st-fore.r\" d=\"^3\"/><path id=\"dumbbell-shrug-m-st-fist.r\" d=\"^4\"/><path id=\"dumbbell-shrug-m-e-head\" d=\"^5\"/><path id=\"dumbbell-shrug-m-e-torso\" d=\"^6\"/><path id=\"dumbbell-shrug-m-e-thigh.l\" d=\"^7\"/><path id=\"dumbbell-shrug-m-e-kneecap.l\" d=\"^8\"/><path id=\"dumbbell-shrug-m-e-shank.l\" d=\"^9\"/><path id=\"dumbbell-shrug-m-e-foot.l\" d=\"^10\"/><path id=\"dumbbell-shrug-m-e-thigh.r\" d=\"^11\"/><path id=\"dumbbell-shrug-m-e-kneecap.r\" d=\"^12\"/><path id=\"dumbbell-shrug-m-e-shank.r\" d=\"^13\"/><path id=\"dumbbell-shrug-m-e-foot.r\" d=\"^14\"/><path id=\"dumbbell-shrug-m-e-shcap.l\" d=\"^15\"/><path id=\"dumbbell-shrug-m-e-upper.l\" d=\"^16\"/><path id=\"dumbbell-shrug-m-e-elbowcap.l\" d=\"^17\"/><path id=\"dumbbell-shrug-m-e-fore.l\" d=\"^18\"/><path id=\"dumbbell-shrug-m-e-fist.l\" d=\"^19\"/><path id=\"dumbbell-shrug-m-e-shcap.r\" d=\"^20\"/><path id=\"dumbbell-shrug-m-e-upper.r\" d=\"^21\"/><path id=\"dumbbell-shrug-m-e-elbowcap.r\" d=\"^22\"/><path id=\"dumbbell-shrug-m-e-fore.r\" d=\"^23\"/><path id=\"dumbbell-shrug-m-e-fist.r\" d=\"^24\"/><path id=\"dumbbell-shrug-m-m-upper.l\" d=\"~#F12NIF1W)pGTE1GBp-5-645!y1Uw1.1R6vx3VmXvX5KkKb-bEkO6*uVnx3z1K6z2Jv(z176O6x6IcPa!7_rUfFgUrY800010100000022000100021110000000001000001000010010100011010020000100012002000000\"/><path id=\"dumbbell-shrug-m-m-elbowcap.l\" d=\"~~S-N1HUvDz10\"/><path id=\"dumbbell-shrug-m-m-fore.l\" d=\"~#F12J(N1U)uTPO1BHuD7O7dw2Rl!B1D8X5U2x1wj*q_cX6J6E9P1KeFiOr1.2H2V9Gr(x1V1y1J4I9G8.5VjFaV9DeI2Dm01000202000000000101010200000000000000000011001000010100000200000000210000021000\"/><path id=\"dumbbell-shrug-m-m-fist.l\" d=\"~~NJG1yXE1ww10\"/><path id=\"dumbbell-shrug-m-m-upper.r\" d=\"~#F12yKrw*nRDs)znP6x686Iv(z1N6z2y3z1(uVnFkO6Nb-bY5KkWmXvw1x3!1R6.y1Uw135_5-6.a*bTrY8TfFg.7_r00100001210020200001002000002000000000000102000100120000000101000000000210010001\"/><path id=\"dumbbell-shrug-m-m-elbowcap.r\" d=\"~~P*kHUvDz10\"/><path id=\"dumbbell-shrug-m-m-fore.r\" d=\"~#F12HylyGw1)UkEPvI4I9W1y1Hr(x1G2V92.2EiOrO1KeI6E9-cX6)i*qT2x1B8X5Sl!B1ew2B7O7O8P5J2DmW9DeWjFa00000200001111002000210000000000000000000201011110000000020200010020020000110000\"/><path id=\"dumbbell-shrug-m-m-fist.r\" d=\"~~yRqyXE1ww10\"/><path id=\"dumbbell-shrug-m-m-eq0\" d=\"~M!yJ1yXE1LBryO1LErxO1LFrxO1LJW11LFrAO1Z\"/><path id=\"dumbbell-shrug-m-m-eq1\" d=\"~~w(G1yXE1Ne0\"/><path id=\"dumbbell-shrug-m-m-eq2\" d=\"~MNEtyXE1LBryO1LErxO1LFrxO1LJW11LFrAO1Z\"/><path id=\"dumbbell-shrug-m-m-eq3\" d=\"~~SyryXE1Ne0\"/><path id=\"dumbbell-shrug-m-mf-head\" d=\"^5\"/><path id=\"dumbbell-shrug-m-mf-torso\" d=\"^6\"/><path id=\"dumbbell-shrug-m-mf-thigh.l\" d=\"^7\"/><path id=\"dumbbell-shrug-m-mf-kneecap.l\" d=\"^8\"/><path id=\"dumbbell-shrug-m-mf-shank.l\" d=\"^9\"/><path id=\"dumbbell-shrug-m-mf-foot.l\" d=\"^10\"/><path id=\"dumbbell-shrug-m-mf-shcap.l\" d=\"^15\"/><path id=\"dumbbell-shrug-m-mf-thigh.r\" d=\"^11\"/><path id=\"dumbbell-shrug-m-mf-kneecap.r\" d=\"^12\"/><path id=\"dumbbell-shrug-m-mf-shank.r\" d=\"^13\"/><path id=\"dumbbell-shrug-m-mf-foot.r\" d=\"^14\"/><path id=\"dumbbell-shrug-m-mf-shcap.r\" d=\"^20\"/><path id=\"dumbbell-shrug-m-mo-0\" d=\"^5\"/><path id=\"dumbbell-shrug-m-mo-1\" d=\"^6\"/><path id=\"dumbbell-shrug-m-mo-2\" d=\"^7\"/><path id=\"dumbbell-shrug-m-mo-3\" d=\"^8\"/><path id=\"dumbbell-shrug-m-mo-4\" d=\"^9\"/><path id=\"dumbbell-shrug-m-mo-5\" d=\"^10\"/><path id=\"dumbbell-shrug-m-mo-6\" d=\"^15\"/><path id=\"dumbbell-shrug-m-mo-7\" d=\"^16\"/><path id=\"dumbbell-shrug-m-mo-8\" d=\"^17\"/><path id=\"dumbbell-shrug-m-mo-9\" d=\"^18\"/><path id=\"dumbbell-shrug-m-mo-10\" d=\"^19\"/><path id=\"dumbbell-shrug-m-mo-11\" d=\"^11\"/><path id=\"dumbbell-shrug-m-mo-12\" d=\"^12\"/><path id=\"dumbbell-shrug-m-mo-13\" d=\"^13\"/><path id=\"dumbbell-shrug-m-mo-14\" d=\"^14\"/><path id=\"dumbbell-shrug-m-mo-15\" d=\"^20\"/><path id=\"dumbbell-shrug-m-mo-16\" d=\"^21\"/><path id=\"dumbbell-shrug-m-mo-17\" d=\"^22\"/><path id=\"dumbbell-shrug-m-mo-18\" d=\"^23\"/><path id=\"dumbbell-shrug-m-mo-19\" d=\"^24\"/><path id=\"dumbbell-shrug-m-mo-20\" d=\"^28\"/><path id=\"dumbbell-shrug-m-mo-21\" d=\"^29\"/><path id=\"dumbbell-shrug-m-mo-22\" d=\"^30\"/><path id=\"dumbbell-shrug-m-mo-23\" d=\"^31\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-shrug-m-dots)\"/>\n  <path class=\"datum\" d=\"^25\"/><path class=\"floorline\" d=\"^27\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shrug-m-st-shcap.r\"/><use href=\"#dumbbell-shrug-m-st-upper.r\"/><use href=\"#dumbbell-shrug-m-st-elbowcap.r\"/><use href=\"#dumbbell-shrug-m-st-fore.r\"/><use href=\"#dumbbell-shrug-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shrug-m-st-shcap.r\"/><use href=\"#dumbbell-shrug-m-st-upper.r\"/><use href=\"#dumbbell-shrug-m-st-elbowcap.r\"/><use href=\"#dumbbell-shrug-m-st-fore.r\"/><use href=\"#dumbbell-shrug-m-st-fist.r\"/></g></g></g><g class=\"pose-end\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shrug-m-e-head\"/><use href=\"#dumbbell-shrug-m-e-torso\"/><use href=\"#dumbbell-shrug-m-e-thigh.l\"/><use href=\"#dumbbell-shrug-m-e-kneecap.l\"/><use href=\"#dumbbell-shrug-m-e-shank.l\"/><use href=\"#dumbbell-shrug-m-e-foot.l\"/><use href=\"#dumbbell-shrug-m-e-thigh.r\"/><use href=\"#dumbbell-shrug-m-e-kneecap.r\"/><use href=\"#dumbbell-shrug-m-e-shank.r\"/><use href=\"#dumbbell-shrug-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shrug-m-e-head\"/><use href=\"#dumbbell-shrug-m-e-torso\"/><use href=\"#dumbbell-shrug-m-e-thigh.l\"/><use href=\"#dumbbell-shrug-m-e-kneecap.l\"/><use href=\"#dumbbell-shrug-m-e-shank.l\"/><use href=\"#dumbbell-shrug-m-e-foot.l\"/><use href=\"#dumbbell-shrug-m-e-thigh.r\"/><use href=\"#dumbbell-shrug-m-e-kneecap.r\"/><use href=\"#dumbbell-shrug-m-e-shank.r\"/><use href=\"#dumbbell-shrug-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-shrug-m-e-shcap.l\"/><use href=\"#dumbbell-shrug-m-e-upper.l\"/><use href=\"#dumbbell-shrug-m-e-elbowcap.l\"/><use href=\"#dumbbell-shrug-m-e-fore.l\"/><use href=\"#dumbbell-shrug-m-e-fist.l\"/><use href=\"#dumbbell-shrug-m-e-shcap.r\"/><use href=\"#dumbbell-shrug-m-e-upper.r\"/><use href=\"#dumbbell-shrug-m-e-elbowcap.r\"/><use href=\"#dumbbell-shrug-m-e-fore.r\"/><use href=\"#dumbbell-shrug-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-shrug-m-e-shcap.l\"/><use href=\"#dumbbell-shrug-m-e-upper.l\"/><use href=\"#dumbbell-shrug-m-e-elbowcap.l\"/><use href=\"#dumbbell-shrug-m-e-fore.l\"/><use href=\"#dumbbell-shrug-m-e-fist.l\"/><use href=\"#dumbbell-shrug-m-e-shcap.r\"/><use href=\"#dumbbell-shrug-m-e-upper.r\"/><use href=\"#dumbbell-shrug-m-e-elbowcap.r\"/><use href=\"#dumbbell-shrug-m-e-fore.r\"/><use href=\"#dumbbell-shrug-m-e-fist.r\"/></g></g><path class=\"disc\" d=\"^28\"/><path class=\"disc-core\" d=\"^29\"/><path class=\"disc\" d=\"^30\"/><path class=\"disc-core\" d=\"^31\"/><circle class=\"joint\" cx=\"212.15\" cy=\"127.74\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"127.74\" r=\"2.25\"/><circle class=\"joint\" cx=\"214.77\" cy=\"175.27\" r=\"2.25\"/><circle class=\"joint\" cx=\"143.23\" cy=\"175.27\" r=\"2.25\"/></g><mask id=\"dumbbell-shrug-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#dumbbell-shrug-m-mf-head\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-mf-torso\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-mf-shank.l\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-mf-foot.l\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-m-upper.l\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-m-fore.l\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-m-fist.l\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-mf-shank.r\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-mf-foot.r\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-m-upper.r\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-m-fore.r\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-m-fist.r\" fill=\"#000\"/><use href=\"#dumbbell-shrug-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-shrug-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#dumbbell-shrug-m-mmask)\"><g class=\"u-stroke\"><use href=\"#dumbbell-shrug-m-m-upper.l\"/><use href=\"#dumbbell-shrug-m-m-elbowcap.l\"/><use href=\"#dumbbell-shrug-m-m-fore.l\"/><use href=\"#dumbbell-shrug-m-m-fist.l\"/><use href=\"#dumbbell-shrug-m-m-upper.r\"/><use href=\"#dumbbell-shrug-m-m-elbowcap.r\"/><use href=\"#dumbbell-shrug-m-m-fore.r\"/><use href=\"#dumbbell-shrug-m-m-fist.r\"/><use href=\"#dumbbell-shrug-m-m-eq0\"/><use href=\"#dumbbell-shrug-m-m-eq1\"/><use href=\"#dumbbell-shrug-m-m-eq2\"/><use href=\"#dumbbell-shrug-m-m-eq3\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~M!yJ1yXE1LBrzO1LErAO1LFrAO1LJW11LFrxO1LErxO1\"/><path class=\"m-line\" d=\"~MNEtyXE1LBrzO1LErAO1LFrAO1LJW11LFrxO1LErxO1\"/><path class=\"m-arrow\" d=\"~MNPK1DwJ1L0zG4MYiwpLXi)oL0wS1\"/><path class=\"m-arrow\" d=\"~MyKoDwJ1L0zG4MYiwpLXi)oL0wS1\"/><path class=\"leader m\" d=\"~M_!O1HUvL(V2x6\"/><path class=\"leader m\" d=\"M140.97 203.37L115.32 193H105.32\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"dumbbell-shrug-m-elbows\" data-key=\"elbows\" data-cue=\"The elbows bend to pull the dumbbells up.\" class=\"plate-callout m\" style=\"left:70.95%;top:38.83%\" aria-pressed=\"true\">Elbows bend</button><button type=\"button\" id=\"dumbbell-shrug-m-pull\" data-key=\"pull\" data-cue=\"The arms lift the weights instead of the shoulders.\" class=\"plate-callout m\" style=\"left:8.38%;top:47.77%\" aria-pressed=\"false\">Arms pull</button>",
    ]);
    return {
      view: "front",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "arms",
        cues: [{ key: "arms", cue: "Let your arms hang straight. Only the shoulders lift." }, { key: "up", cue: "Lift your shoulders straight up and down, not forward or back." }, { key: "tall", cue: "Stand tall and keep your trunk braced the whole set." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "The elbows bend to pull the dumbbells up." }, { key: "pull", cue: "The arms lift the weights instead of the shoulders." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Elbows bend</b><span>The elbows bend to pull the dumbbells up.</span></li><li><b>Arms pull</b><span>The arms lift the weights instead of the shoulders.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lift 1 second, hold 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lift</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Dumbbell shrug, front view. Standing tall with a dumbbell hanging in each hand at the sides on straight arms. Only the shoulders lift straight up toward the ears, pause and lower again. The arms stay straight.",
      mistakeAlt: "Dumbbell Shrug: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hold",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: dshrug-grip: no hold key; the handle diameter and the contact point are not on the card.",
    "handle": "dumbbell",
    "loadAxis": "across",
    "overBody": false,
    "width": {
      "text": "Hands at your sides.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dumbbell-shrug"
        ],
        "note": "c1"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "baechle-grip"
        ],
        "note": "c13; card inherit grip.thumb: the rule covers all grips"
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "ext": [
        15,
        35
      ],
      "limitText": "",
      "claim": {
        "tags": [
          "DATA",
          "MECH"
        ],
        "sources": [
          "odriscoll1992"
        ],
        "note": "c14, card grip.wrist (a card drawing convention until F-LB3-3)"
      }
    },
    "faults": [
      {
        "key": "curled",
        "label": "Wrist curled",
        "pose": {},
        "markers": [],
        "alt": "Wrist curled forward."
      }
    ],
    "gripLine": "A dumbbell in each hand, thumbs wrapped. Wrist bent back in its natural grip position, not curled forward.",
    "cue": "Arms straight, pause at the top."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "grip",
      "text": "Pick up a dumbbell in each hand, thumbs around the handles.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "sl-dumbbell-shrug",
          "baechle-grip"
        ],
        "note": "c1, c13"
      }
    },
    {
      "kind": "position",
      "text": "Stand tall with the dumbbells at your sides.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dumbbell-shrug"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "brace",
      "text": "Brace your trunk. Arms straight and passive.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dumbbell-shrug"
        ],
        "note": "c4, c6"
      }
    },
    {
      "kind": "grip",
      "text": "Grip limiting the load? Lifting straps are fine.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dumbbell-shrug"
        ],
        "note": "c8"
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
        "note": "c15"
      }
    }
  ],
  posture: [
    {
      "key": "tall",
      "label": "Stand tall",
      "detail": "Good posture, trunk braced the whole set.",
      "anchor": {
        "pose": "start",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dumbbell-shrug"
        ],
        "note": "c4"
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
      "zoom": "dshrug-top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dumbbell-shrug"
        ],
        "note": "c3"
      }
    },
    {
      "key": "up",
      "label": "Straight up",
      "detail": "Straight up and down, not forward or back. No rolling.",
      "anchor": {
        "pose": "end",
        "at": "shoulderTop.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "ace-shrug",
          "sl-dumbbell-shrug"
        ],
        "note": "c12, c6"
      }
    },
    {
      "key": "top",
      "label": "Pause on top",
      "detail": "Short pause at the top, then lower slowly.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dumbbell-shrug"
        ],
        "note": "c5"
      }
    }
  ],
  zooms: [
    {
      "key": "dshrug-top",
      "chip": "Top",
      "heading": "Top position",
      "kind": "posture"
    }
  ],
  chips: [
    "dshrug-top",
    "feel"
  ],
  copy: {
    "setupLine": "A dumbbell in each hand at your sides. Stand tall, trunk braced.",
    "mistakeLine": "Keep your arms straight and passive. Only the shoulders lift.",
    "cueLine": "Shoulders up, pause, lower slowly."
  },
  mistakes: [
    {
      "key": "arms",
      "title": "Bending the arms to pull",
      "zoom": "dshrug-top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dumbbell-shrug"
        ],
        "note": "c6"
      },
      "fix": "Keep the arms straight and passive."
    },
    {
      "key": "roll",
      "title": "Rolling or shifting the shoulders",
      "claim": {
        "tags": [
          "CONSENSUS",
          "MECH"
        ],
        "sources": [
          "ace-shrug",
          "sl-dumbbell-shrug"
        ],
        "note": "c12, c6"
      },
      "fix": "Lift straight up, lower straight down."
    },
    {
      "key": "heavy",
      "title": "Going too heavy",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-dumbbell-shrug"
        ],
        "note": "c7, c8"
      },
      "fix": "Use lighter dumbbells, or straps if the grip is the limit."
    }
  ],
  risks: [
    {
      "key": "breath",
      "text": "Heavy reps with a held breath send blood pressure very high.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "macdougall1985"
        ],
        "note": "c16; card inherit risks[breath]: heavy shrugs are heavy lifts"
      }
    },
    {
      "key": "shoulder",
      "text": "The shoulder is a common injury site in weight training. Poor technique adds risk.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "kolber2010"
        ],
        "note": "c17; card inherit redFlags: the shoulder is loaded the same way"
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
    "sl-dumbbell-shrug",
    "acsm2009",
    "ace-shrug",
    "baechle-grip",
    "odriscoll1992",
    "macdougall1985",
    "kolber2010",
    "ekstrom2003",
    "andersen2008",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/dumbbell_shrug.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

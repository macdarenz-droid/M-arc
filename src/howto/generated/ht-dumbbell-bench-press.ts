// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=9cce0ae3915d6e553ceeabaa64a33005478344523741f2805659e05b133c18be
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_dumbbell_bench_press",
  name: "Dumbbell Bench Press",
  hashes: { inputsSha256: "9cce0ae3915d6e553ceeabaa64a33005478344523741f2805659e05b133c18be", golden: "1fdce73a7431d1f10e18e54140184df37c1fb89902bde18dcd460c817365635c" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-bench-press-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-bench-press-n-st-upper.l\" d=\"~#F12WFs!HT1KEsRNU1d(8b0.1TO1E3(5K1(2B6JD1EaWi3Ng_9_iJ5SD1N1(2A3y6_2TO1a0e(8AgH1weOp6ImIdXp02000010021000001000010000000000200000200021010000000100000020120001001210010010\"/><path id=\"dumbbell-bench-press-n-st-elbowcap.l\" d=\"~~PYpwxH1Dz10\"/><path id=\"dumbbell-bench-press-n-st-fore.l\" d=\"~#F12PwsUwH1X*rV!H1T1Hap.1.3II1O3J9R1J23(w1X6_c4Hbw7Ucowx1U1H2W3H9w3KI1q.1Y1FaAa2JaVj5EhVaKj00020000120200001000000101010122002001000200002000001002000010110101200001002020\"/><path id=\"dumbbell-bench-press-n-st-fist.l\" d=\"~~WYpyFw1ww10\"/><path id=\"dumbbell-bench-press-n-st-upper.r\" d=\"^0\"/><path id=\"dumbbell-bench-press-n-st-elbowcap.r\" d=\"^1\"/><path id=\"dumbbell-bench-press-n-st-fore.r\" d=\"^2\"/><path id=\"dumbbell-bench-press-n-st-fist.r\" d=\"^3\"/><path id=\"dumbbell-bench-press-n-g0-upper.r\" d=\"~#F12HDsF-T1R!rzUU1V2W673S9)A1R4S3x2!1GdHmKfYex5UfY3(kI2(pkW2P1S5AeOz182-1(6(c!c(kxk(6Ilz5Rs02000000000100100000020001001000012000002001111000000110001000020001011010100000\"/><path id=\"dumbbell-bench-press-n-g0-elbowcap.r\" d=\"~~F)rwFJ1Dz10\"/><path id=\"dumbbell-bench-press-n-g0-fore.r\" d=\"~#F12!Du!yJ1KEuI!J1bN9vR1*8ID1G2_8G1H2P3!rx5SdS1AbS8YbH4Ur(1(1U4!7*1IE1g-1w3w9NaJ1U7-kG2xhzd*h00000210000200000101010000011110101010010000020002002001010000111000102000200002\"/><path id=\"dumbbell-bench-press-n-g0-fist.r\" d=\"~~A.q_Oz1ww10\"/><path id=\"dumbbell-bench-press-n-g0-eq3.dumbbell.0-0\" d=\"~MSRt_Oz1LBrAO1LErzO1LFrzO1LJW10LFrAO1Z\"/><path id=\"dumbbell-bench-press-n-g1-upper.r\" d=\"~#F12W!rAHU1*KrK-U1.3W377!gXmV4iG2czcA5*jN7.aJc-4WkO3Yc3H22W4NkTj88B3D4!1NmDrza!e.gP6Bs21110011000012020010120000000000220000022002101111020010001011000002002000001000\"/><path id=\"dumbbell-bench-press-n-g1-elbowcap.r\" d=\"~~AHtWBO1Dz10\"/><path id=\"dumbbell-bench-press-n-g1-fore.r\" d=\"~#F12SRvH)N1.Sv)XO13A9x1K1)9*A1x2W8G1H2F4JqR4Wdw2yb(8Nby5Aqw2Y1!4N7B3zD1eV1H3S8SaY1w7xl)2*g-dOh00000110000001010000100002000000000002101000000010100000020001001000000000111000\"/><path id=\"dumbbell-bench-press-n-g1-fist.r\" d=\"~~U*rSXD1ww10\"/><path id=\"dumbbell-bench-press-n-g1-eq3.dumbbell.0-0\" d=\"~MyUuSXD1LBrAO1LErzO1LFrzO1LJW10LFrAO1Z\"/><path id=\"dumbbell-bench-press-n-g2-upper.r\" d=\"~#F12y(qy_U1.Jqx.U1I420bNm.4z3.2V1E1x5E5Xj-7Gg_1RhAcX3D6G1U1K2N3wn50aB4uVhHi(qYaJmR2YnOg20020000200000200000100000200001001100012000000101000200000200101002202000021002\"/><path id=\"dumbbell-bench-press-n-g2-elbowcap.r\" d=\"~~SzuF_S1Dz10\"/><path id=\"dumbbell-bench-press-n-g2-fore.r\" d=\"~#F12DIw1HVS1VIw1xOT1bP9x1R1X8XD1I2!8I1H2P3Hsz5UdS1ybN8YbJ4Ds!1!1U4(7.1VE1i-1!2y9PaD1W7XkE2zhzd*h00002010100220001000100020000200001000002100011000200001011000010010100001010101\"/><path id=\"dumbbell-bench-press-n-g2-fist.r\" d=\"~~AwtH)G1ww10\"/><path id=\"dumbbell-bench-press-n-g2-eq3.dumbbell.0-0\" d=\"~MSWvH)G1LEryO1LzrxO1LDrxO1LJW11LDrAO1Z\"/><path id=\"dumbbell-bench-press-n-e-thigh.l\" d=\"~#F12NUE1HGU1KBD1BBU1.b37D1P(1y7-6E7I3G3)T1IbRk)f)jI3VoH8-U1G6G4w2X8U4F*1!d8E1GbX3-g_sSA1NsPz1w6(I1.e02020000012000100002001200000000100000200000000000000020010000000000000001010000\"/><path id=\"dumbbell-bench-press-n-e-kneecap.l\" d=\"~~(WS1w)T1_J10\"/><path id=\"dumbbell-bench-press-n-e-shank.l\" d=\"~#F12JVS1ywU1)XS1XPS1P1.bH10H6_(1_5)7U2x4I5Xy2y7.d9*bT7KdA2xz2-2-3B6X7I3y)1E10x2XbOcwcXcwpiWl!dHo00000000000011000001111200200100000010010100001001001001000000200010000001012102\"/><path id=\"dumbbell-bench-press-n-e-foot.l\" d=\"~#o2HPT1DB)1.xU1EB(1YcF3Uh*7SpxoU-2B3-J2-4ID1)7)n0TG1_4BbXc_sEbKmUp000002000011100101010020000000000000020000100001\"/><path id=\"dumbbell-bench-press-n-e-shcap.l\" d=\"~~WFpJHT1wP10\"/><path id=\"dumbbell-bench-press-n-e-upper.l\" d=\"~#F12P_pYOU1RHpVxU1-3T367Sn(fnT4fG2X5)bE8Tj-cGa.k)3)cx3G20V46PkYj36O4*2Bm!2FbWqPhAeNsJ500000200000000000001010002000000000000000000000101120020001000002000002000000000\"/><path id=\"dumbbell-bench-press-n-e-elbowcap.l\" d=\"~~N)t!-W1Dz10\"/><path id=\"dumbbell-bench-press-n-e-fore.l\" d=\"~#F12NEw1!-W1KAw1GVX1X1wal-1R3RH1O3D9T1F2dww1.6Yc0Fb!6Yceww1U1F2P3D9S3RH1m-1Y1waDaoNaRj0EhKaRj00110000001210020000000010000000000000001000000002000200000021000210000000002002\"/><path id=\"dumbbell-bench-press-n-e-fist.l\" d=\"~~UyuwEK1ww10\"/><path id=\"dumbbell-bench-press-n-e-head\" d=\"~#w12wNgHIT1GGgB)U1!kFhNbDix2Pbw5W2O7S5Gay9VkUjBdR3I9S2_1yjEdElR8TlF1xlyeTkFj50001100000200000100200020000000000002000002100101000000010001000\"/><path id=\"dumbbell-bench-press-n-e-torso\" d=\"~#_12!GlSJU1X_jKEU1E2AaT4Y4JeRaN9BaDf-dl.6VnH9z7ypy5Uc-4*fK6-k*fKmThRhT9-4*fw8Ez1DrBrDbO3S6*2UeAm)d_7V3z7HdUbHfNiD5(1G6.8*a(8B4_E1YO200010000020000100000000000200000000001000000010121000000002001010100000000000110000000220000100001002020000101000020\"/><path id=\"dumbbell-bench-press-n-e-thigh.r\" d=\"^19\"/><path id=\"dumbbell-bench-press-n-e-kneecap.r\" d=\"^20\"/><path id=\"dumbbell-bench-press-n-e-shank.r\" d=\"^21\"/><path id=\"dumbbell-bench-press-n-e-foot.r\" d=\"^22\"/><path id=\"dumbbell-bench-press-n-e-shcap.r\" d=\"^23\"/><path id=\"dumbbell-bench-press-n-e-upper.r\" d=\"^24\"/><path id=\"dumbbell-bench-press-n-e-elbowcap.r\" d=\"^25\"/><path id=\"dumbbell-bench-press-n-e-fore.r\" d=\"^26\"/><path id=\"dumbbell-bench-press-n-e-fist.r\" d=\"^27\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-bench-press-n-dots)\"/>\n  <path class=\"datum\" d=\"~MUyv!-W1L0.Wc\"/><path class=\"floorline\" d=\"M41.16 339.5H322.03\"/><path class=\"eq\" d=\"~M(EcNUX1LDXw10Qwp0B(v)oL)oDkQ0)o)oBkLB(vwpQ)o0D(vwpLwpBkQ0wpwpDkZ\"/><path class=\"eq\" d=\"~MPEeDy-1LyYs0QF60-RsE6LE6)qQ0E6E6wrL-RsF6QE60_RsF6LF6wrQ0F6F6)qZ\"/><path class=\"eq\" d=\"~M_BeSRY1L0PT8Q0F6F6EK8LwrE6QF60)qE6LE6EK8Q0E6E6FK8L)qF6QE60wrF6Z\"/><path class=\"eq\" d=\"~MDVdYDy2L(N20QF60VF2E6LE6V8Q0E6E6W8LVF2F6QE60WF2F6LF6W8Q0F6F6V8Z\"/><path class=\"eq\" d=\"~MSTG1SRY1L0PT8Q0F6F6EK8L(qE6QF60*qE6LE6EK8Q0E6E6FK8L*qF6QE60(qF6Z\"/><path class=\"eq\" d=\"~M(yG1YDy2L(N20QF60VF2E6LE6V8Q0E6E6W8LVF2F6QE60WF2F6LF6W8Q0F6F6V8Z\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-n-st-upper.l\"/><use href=\"#dumbbell-bench-press-n-st-elbowcap.l\"/><use href=\"#dumbbell-bench-press-n-st-fore.l\"/><use href=\"#dumbbell-bench-press-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-n-st-upper.l\"/><use href=\"#dumbbell-bench-press-n-st-elbowcap.l\"/><use href=\"#dumbbell-bench-press-n-st-fore.l\"/><use href=\"#dumbbell-bench-press-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-n-st-upper.r\"/><use href=\"#dumbbell-bench-press-n-st-elbowcap.r\"/><use href=\"#dumbbell-bench-press-n-st-fore.r\"/><use href=\"#dumbbell-bench-press-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-n-st-upper.r\"/><use href=\"#dumbbell-bench-press-n-st-elbowcap.r\"/><use href=\"#dumbbell-bench-press-n-st-fore.r\"/><use href=\"#dumbbell-bench-press-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-n-g0-upper.r\"/><use href=\"#dumbbell-bench-press-n-g0-elbowcap.r\"/><use href=\"#dumbbell-bench-press-n-g0-fore.r\"/><use href=\"#dumbbell-bench-press-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-n-g0-upper.r\"/><use href=\"#dumbbell-bench-press-n-g0-elbowcap.r\"/><use href=\"#dumbbell-bench-press-n-g0-fore.r\"/><use href=\"#dumbbell-bench-press-n-g0-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-n-g0-eq3.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-n-g0-eq3.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-n-g1-upper.r\"/><use href=\"#dumbbell-bench-press-n-g1-elbowcap.r\"/><use href=\"#dumbbell-bench-press-n-g1-fore.r\"/><use href=\"#dumbbell-bench-press-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-n-g1-upper.r\"/><use href=\"#dumbbell-bench-press-n-g1-elbowcap.r\"/><use href=\"#dumbbell-bench-press-n-g1-fore.r\"/><use href=\"#dumbbell-bench-press-n-g1-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-n-g1-eq3.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-n-g1-eq3.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-n-g2-upper.r\"/><use href=\"#dumbbell-bench-press-n-g2-elbowcap.r\"/><use href=\"#dumbbell-bench-press-n-g2-fore.r\"/><use href=\"#dumbbell-bench-press-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-n-g2-upper.r\"/><use href=\"#dumbbell-bench-press-n-g2-elbowcap.r\"/><use href=\"#dumbbell-bench-press-n-g2-fore.r\"/><use href=\"#dumbbell-bench-press-n-g2-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-n-g2-eq3.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-n-g2-eq3.dumbbell.0-0\"/></g></g></g><g class=\"pose-end\"><path class=\"disc\" d=\"~Mw-w1wEK1LBrAO1LBrzO1LDrzO1LJW12LDryO1Z\"/><path class=\"disc-core\" d=\"~~DUuwEK1Ne0\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-n-e-thigh.l\"/><use href=\"#dumbbell-bench-press-n-e-kneecap.l\"/><use href=\"#dumbbell-bench-press-n-e-shank.l\"/><use href=\"#dumbbell-bench-press-n-e-foot.l\"/><use href=\"#dumbbell-bench-press-n-e-shcap.l\"/><use href=\"#dumbbell-bench-press-n-e-upper.l\"/><use href=\"#dumbbell-bench-press-n-e-elbowcap.l\"/><use href=\"#dumbbell-bench-press-n-e-fore.l\"/><use href=\"#dumbbell-bench-press-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-n-e-thigh.l\"/><use href=\"#dumbbell-bench-press-n-e-kneecap.l\"/><use href=\"#dumbbell-bench-press-n-e-shank.l\"/><use href=\"#dumbbell-bench-press-n-e-foot.l\"/><use href=\"#dumbbell-bench-press-n-e-shcap.l\"/><use href=\"#dumbbell-bench-press-n-e-upper.l\"/><use href=\"#dumbbell-bench-press-n-e-elbowcap.l\"/><use href=\"#dumbbell-bench-press-n-e-fore.l\"/><use href=\"#dumbbell-bench-press-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-n-e-head\"/><use href=\"#dumbbell-bench-press-n-e-torso\"/><use href=\"#dumbbell-bench-press-n-e-thigh.r\"/><use href=\"#dumbbell-bench-press-n-e-kneecap.r\"/><use href=\"#dumbbell-bench-press-n-e-shank.r\"/><use href=\"#dumbbell-bench-press-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-n-e-head\"/><use href=\"#dumbbell-bench-press-n-e-torso\"/><use href=\"#dumbbell-bench-press-n-e-thigh.r\"/><use href=\"#dumbbell-bench-press-n-e-kneecap.r\"/><use href=\"#dumbbell-bench-press-n-e-shank.r\"/><use href=\"#dumbbell-bench-press-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-n-e-shcap.r\"/><use href=\"#dumbbell-bench-press-n-e-upper.r\"/><use href=\"#dumbbell-bench-press-n-e-elbowcap.r\"/><use href=\"#dumbbell-bench-press-n-e-fore.r\"/><use href=\"#dumbbell-bench-press-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-n-e-shcap.r\"/><use href=\"#dumbbell-bench-press-n-e-upper.r\"/><use href=\"#dumbbell-bench-press-n-e-elbowcap.r\"/><use href=\"#dumbbell-bench-press-n-e-fore.r\"/><use href=\"#dumbbell-bench-press-n-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"~MyOsyFw1LBrAO1LErzO1LFrzO1LJW12LFryO1LEryO1\"/><path class=\"disc\" d=\"^38\"/><path class=\"disc-core\" d=\"^39\"/><circle class=\"joint\" cx=\"137.07\" cy=\"262.78\" r=\"2.25\"/><circle class=\"joint\" cx=\"159.14\" cy=\"280.62\" r=\"2.25\"/><circle class=\"joint\" cx=\"205\" cy=\"255.62\" r=\"2.25\"/><circle class=\"joint\" cx=\"266.84\" cy=\"266.08\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#!10PSr!Vy1TOrEKy10201000201000201000201000201000201000002010002010002010002000022002000200022002000200020002000200020002000200020012000200020012000200020002200200020002000200020002000000000000000\"/><path class=\"arrow\" d=\"~MSUu_!I1LTtVtLFx2!hZ\"/></g><path class=\"leader\" d=\"M207.05 276.1L261 232H271\"/><circle class=\"anchor\" cx=\"207.05\" cy=\"276.1\" r=\"1.5\"/><path class=\"leader\" d=\"M159.14 231.52L177 214H187\"/><circle class=\"anchor\" cx=\"159.14\" cy=\"231.52\" r=\"1.5\"/><path class=\"leader\" d=\"~MUyv!-W1L0UJ3\"/><circle class=\"anchor\" cx=\"159.14\" cy=\"280.62\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dumbbell-bench-press-n-five\" data-key=\"five\" data-cue=\"Keep your head, shoulders, hips and both feet down the whole set.\" class=\"plate-callout two\" style=\"left:74.3%;top:58.66%\" aria-pressed=\"true\">Five<br>points</button><button type=\"button\" id=\"dumbbell-bench-press-n-depth\" data-key=\"depth\" data-cue=\"Lower the dumbbells to mid-chest, a little wide, and touch gently.\" class=\"plate-callout two\" style=\"left:50.84%;top:53.63%\" aria-pressed=\"false\">Down to<br>mid-chest</button><button type=\"button\" id=\"dumbbell-bench-press-n-elbow\" data-key=\"elbow\" data-cue=\"Keep each dumbbell over its elbow, forearm close to vertical.\" class=\"plate-callout two\" style=\"left:24.58%;top:82.12%\" aria-pressed=\"false\">Weight<br>over elbow</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dumbbell-bench-press-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dumbbell-bench-press-m-st-upper.l\" d=\"^0\"/><path id=\"dumbbell-bench-press-m-st-elbowcap.l\" d=\"^1\"/><path id=\"dumbbell-bench-press-m-st-fore.l\" d=\"^2\"/><path id=\"dumbbell-bench-press-m-st-fist.l\" d=\"^3\"/><path id=\"dumbbell-bench-press-m-st-upper.r\" d=\"^0\"/><path id=\"dumbbell-bench-press-m-st-elbowcap.r\" d=\"^1\"/><path id=\"dumbbell-bench-press-m-st-fore.r\" d=\"^2\"/><path id=\"dumbbell-bench-press-m-st-fist.r\" d=\"^3\"/><path id=\"dumbbell-bench-press-m-g0-upper.r\" d=\"^4\"/><path id=\"dumbbell-bench-press-m-g0-elbowcap.r\" d=\"^5\"/><path id=\"dumbbell-bench-press-m-g0-fore.r\" d=\"^6\"/><path id=\"dumbbell-bench-press-m-g0-fist.r\" d=\"^7\"/><path id=\"dumbbell-bench-press-m-g0-eq3.dumbbell.0-0\" d=\"^8\"/><path id=\"dumbbell-bench-press-m-g1-upper.r\" d=\"^9\"/><path id=\"dumbbell-bench-press-m-g1-elbowcap.r\" d=\"^10\"/><path id=\"dumbbell-bench-press-m-g1-fore.r\" d=\"^11\"/><path id=\"dumbbell-bench-press-m-g1-fist.r\" d=\"^12\"/><path id=\"dumbbell-bench-press-m-g1-eq3.dumbbell.0-0\" d=\"^13\"/><path id=\"dumbbell-bench-press-m-g2-upper.r\" d=\"^14\"/><path id=\"dumbbell-bench-press-m-g2-elbowcap.r\" d=\"^15\"/><path id=\"dumbbell-bench-press-m-g2-fore.r\" d=\"^16\"/><path id=\"dumbbell-bench-press-m-g2-fist.r\" d=\"^17\"/><path id=\"dumbbell-bench-press-m-g2-eq3.dumbbell.0-0\" d=\"^18\"/><path id=\"dumbbell-bench-press-m-e-thigh.l\" d=\"^19\"/><path id=\"dumbbell-bench-press-m-e-kneecap.l\" d=\"^20\"/><path id=\"dumbbell-bench-press-m-e-shank.l\" d=\"^21\"/><path id=\"dumbbell-bench-press-m-e-foot.l\" d=\"^22\"/><path id=\"dumbbell-bench-press-m-e-shcap.l\" d=\"^23\"/><path id=\"dumbbell-bench-press-m-e-upper.l\" d=\"^24\"/><path id=\"dumbbell-bench-press-m-e-elbowcap.l\" d=\"^25\"/><path id=\"dumbbell-bench-press-m-e-fore.l\" d=\"^26\"/><path id=\"dumbbell-bench-press-m-e-fist.l\" d=\"^27\"/><path id=\"dumbbell-bench-press-m-e-head\" d=\"^28\"/><path id=\"dumbbell-bench-press-m-e-torso\" d=\"^29\"/><path id=\"dumbbell-bench-press-m-e-thigh.r\" d=\"^19\"/><path id=\"dumbbell-bench-press-m-e-kneecap.r\" d=\"^20\"/><path id=\"dumbbell-bench-press-m-e-shank.r\" d=\"^21\"/><path id=\"dumbbell-bench-press-m-e-foot.r\" d=\"^22\"/><path id=\"dumbbell-bench-press-m-e-shcap.r\" d=\"^23\"/><path id=\"dumbbell-bench-press-m-e-upper.r\" d=\"^24\"/><path id=\"dumbbell-bench-press-m-e-elbowcap.r\" d=\"^25\"/><path id=\"dumbbell-bench-press-m-e-fore.r\" d=\"^26\"/><path id=\"dumbbell-bench-press-m-e-fist.r\" d=\"^27\"/><path id=\"dumbbell-bench-press-m-m-head\" d=\"~#w12wxiDRS1*DhG(T1YbPoU2HlV6P9N3U4z9_1Bd!3)qD9Oa-8T9V1G6Aiz3.oJ1En(9OiPl.cPh(70000200000200000000000000000001001000100210001000000000100100000\"/><path id=\"dumbbell-bench-press-m-m-torso\" d=\"~#_12Nwm(PV1-XkOYU1NppOhXlP5)d!4)c_8RiR5-8)hFqF2HF1J6Sb-4xgK6Xk*fImThVhT9X4*fw8Ez1FrBrAbXoAc*dYR1J_1)tY5G6R1(eWgY9wjB2AvEc*jED1)lN4S2A-200101020010010022001011111000001110000000002000220000100022200020000000000000020000200200002000000010002000101002021\"/><path id=\"dumbbell-bench-press-m-m-thigh.l\" d=\"~#F12(BE1F!R1TYB1xOR1VbK2bD1_.1wjE5G8T2)3XP1ElzhXj.iB7.pJ3RS1OgT4A1O9Y2N-1UpcB1Ga.5zm(oNuyz1Px1_cyN1)510101000000110100000200220000020000022000001000011000200110000200020001000010011\"/><path id=\"dumbbell-bench-press-m-m-kneecap.l\" d=\"~~YyS1()T1_J10\"/><path id=\"dumbbell-bench-press-m-m-shank.l\" d=\"~#F12HxS1NzU1OxS1xUS1s*bH11P9N(1N5G8N2B4-8Ky2H6zet*bE8xdI1xz2)2V3O6K75D)1E12T2Tb)bUcEbUpS1UlyfUn10100000000000210101000000000010110000100000000000101000000022100000201010000010\"/><path id=\"dumbbell-bench-press-m-m-foot.l\" d=\"~#o2HPT1DB)1.xU1EB(1YcF3Uh*7SpxoU-2B3-J2-4ID1)7)n0TG1!4Bb.c_sBbKmUp000002000010100101000020000000020001000000100001\"/><path id=\"dumbbell-bench-press-m-m-shcap.l\" d=\"~~SWpYKU1wP10\"/><path id=\"dumbbell-bench-press-m-m-upper.l\" d=\"~#F12yRqWYV1.)pxOV1E4T267PoU9R1I4p)1O5B9EcIhXeG7EliVay1x2kI4J1Jm_d58R4X1Rm_6YgWnykya(sp01000002000200101100000020000000000000010120000010001101000002000000221012020001\"/><path id=\"dumbbell-bench-press-m-m-elbowcap.l\" d=\"~~_VuwXW1Dz10\"/><path id=\"dumbbell-bench-press-m-m-fore.l\" d=\"~#F12Y*w1FUW1-!w1VOX1tAarX1R6)G1*2N9I1H2!1Uv*5DdqFb_7DcY2Sv_1A2D4_8aIH1m*1N2!9Da4y9EkG1Bh.b-i02020020002100101000010000101100000101000200000002120021010000010002000011000100\"/><path id=\"dumbbell-bench-press-m-m-thigh.r\" d=\"^48\"/><path id=\"dumbbell-bench-press-m-m-kneecap.r\" d=\"^49\"/><path id=\"dumbbell-bench-press-m-m-shank.r\" d=\"^50\"/><path id=\"dumbbell-bench-press-m-m-foot.r\" d=\"^51\"/><path id=\"dumbbell-bench-press-m-m-shcap.r\" d=\"^52\"/><path id=\"dumbbell-bench-press-m-m-upper.r\" d=\"^53\"/><path id=\"dumbbell-bench-press-m-m-elbowcap.r\" d=\"^54\"/><path id=\"dumbbell-bench-press-m-m-fore.r\" d=\"^55\"/><path id=\"dumbbell-bench-press-m-mf-fist.l\" d=\"^27\"/><path id=\"dumbbell-bench-press-m-mf-fist.r\" d=\"^27\"/><path id=\"dumbbell-bench-press-m-mo-0\" d=\"^28\"/><path id=\"dumbbell-bench-press-m-mo-1\" d=\"^29\"/><path id=\"dumbbell-bench-press-m-mo-2\" d=\"^19\"/><path id=\"dumbbell-bench-press-m-mo-3\" d=\"^20\"/><path id=\"dumbbell-bench-press-m-mo-4\" d=\"^21\"/><path id=\"dumbbell-bench-press-m-mo-5\" d=\"^22\"/><path id=\"dumbbell-bench-press-m-mo-6\" d=\"^23\"/><path id=\"dumbbell-bench-press-m-mo-7\" d=\"^24\"/><path id=\"dumbbell-bench-press-m-mo-8\" d=\"^25\"/><path id=\"dumbbell-bench-press-m-mo-9\" d=\"^26\"/><path id=\"dumbbell-bench-press-m-mo-10\" d=\"^27\"/><path id=\"dumbbell-bench-press-m-mo-11\" d=\"^19\"/><path id=\"dumbbell-bench-press-m-mo-12\" d=\"^20\"/><path id=\"dumbbell-bench-press-m-mo-13\" d=\"^21\"/><path id=\"dumbbell-bench-press-m-mo-14\" d=\"^22\"/><path id=\"dumbbell-bench-press-m-mo-15\" d=\"^23\"/><path id=\"dumbbell-bench-press-m-mo-16\" d=\"^24\"/><path id=\"dumbbell-bench-press-m-mo-17\" d=\"^25\"/><path id=\"dumbbell-bench-press-m-mo-18\" d=\"^26\"/><path id=\"dumbbell-bench-press-m-mo-19\" d=\"^27\"/><path id=\"dumbbell-bench-press-m-mo-20\" d=\"^32\"/><path id=\"dumbbell-bench-press-m-mo-21\" d=\"^33\"/><path id=\"dumbbell-bench-press-m-mo-22\" d=\"^34\"/><path id=\"dumbbell-bench-press-m-mo-23\" d=\"^35\"/><path id=\"dumbbell-bench-press-m-mo-24\" d=\"^36\"/><path id=\"dumbbell-bench-press-m-mo-25\" d=\"^37\"/><path id=\"dumbbell-bench-press-m-mo-26\" d=\"^38\"/><path id=\"dumbbell-bench-press-m-mo-27\" d=\"^39\"/><path id=\"dumbbell-bench-press-m-mo-28\" d=\"^38\"/><path id=\"dumbbell-bench-press-m-mo-29\" d=\"^39\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dumbbell-bench-press-m-dots)\"/>\n  <path class=\"floorline\" d=\"^31\"/><path class=\"eq\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-m-st-upper.l\"/><use href=\"#dumbbell-bench-press-m-st-elbowcap.l\"/><use href=\"#dumbbell-bench-press-m-st-fore.l\"/><use href=\"#dumbbell-bench-press-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-m-st-upper.l\"/><use href=\"#dumbbell-bench-press-m-st-elbowcap.l\"/><use href=\"#dumbbell-bench-press-m-st-fore.l\"/><use href=\"#dumbbell-bench-press-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-m-st-upper.r\"/><use href=\"#dumbbell-bench-press-m-st-elbowcap.r\"/><use href=\"#dumbbell-bench-press-m-st-fore.r\"/><use href=\"#dumbbell-bench-press-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-m-st-upper.r\"/><use href=\"#dumbbell-bench-press-m-st-elbowcap.r\"/><use href=\"#dumbbell-bench-press-m-st-fore.r\"/><use href=\"#dumbbell-bench-press-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-m-g0-upper.r\"/><use href=\"#dumbbell-bench-press-m-g0-elbowcap.r\"/><use href=\"#dumbbell-bench-press-m-g0-fore.r\"/><use href=\"#dumbbell-bench-press-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-m-g0-upper.r\"/><use href=\"#dumbbell-bench-press-m-g0-elbowcap.r\"/><use href=\"#dumbbell-bench-press-m-g0-fore.r\"/><use href=\"#dumbbell-bench-press-m-g0-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-m-g0-eq3.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-m-g0-eq3.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-m-g1-upper.r\"/><use href=\"#dumbbell-bench-press-m-g1-elbowcap.r\"/><use href=\"#dumbbell-bench-press-m-g1-fore.r\"/><use href=\"#dumbbell-bench-press-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-m-g1-upper.r\"/><use href=\"#dumbbell-bench-press-m-g1-elbowcap.r\"/><use href=\"#dumbbell-bench-press-m-g1-fore.r\"/><use href=\"#dumbbell-bench-press-m-g1-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-m-g1-eq3.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-m-g1-eq3.dumbbell.0-0\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-m-g2-upper.r\"/><use href=\"#dumbbell-bench-press-m-g2-elbowcap.r\"/><use href=\"#dumbbell-bench-press-m-g2-fore.r\"/><use href=\"#dumbbell-bench-press-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-m-g2-upper.r\"/><use href=\"#dumbbell-bench-press-m-g2-elbowcap.r\"/><use href=\"#dumbbell-bench-press-m-g2-fore.r\"/><use href=\"#dumbbell-bench-press-m-g2-fist.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-m-g2-eq3.dumbbell.0-0\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-m-g2-eq3.dumbbell.0-0\"/></g></g></g><g class=\"pose-end\"><path class=\"disc\" d=\"^38\"/><path class=\"disc-core\" d=\"^39\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-m-e-thigh.l\"/><use href=\"#dumbbell-bench-press-m-e-kneecap.l\"/><use href=\"#dumbbell-bench-press-m-e-shank.l\"/><use href=\"#dumbbell-bench-press-m-e-foot.l\"/><use href=\"#dumbbell-bench-press-m-e-shcap.l\"/><use href=\"#dumbbell-bench-press-m-e-upper.l\"/><use href=\"#dumbbell-bench-press-m-e-elbowcap.l\"/><use href=\"#dumbbell-bench-press-m-e-fore.l\"/><use href=\"#dumbbell-bench-press-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-m-e-thigh.l\"/><use href=\"#dumbbell-bench-press-m-e-kneecap.l\"/><use href=\"#dumbbell-bench-press-m-e-shank.l\"/><use href=\"#dumbbell-bench-press-m-e-foot.l\"/><use href=\"#dumbbell-bench-press-m-e-shcap.l\"/><use href=\"#dumbbell-bench-press-m-e-upper.l\"/><use href=\"#dumbbell-bench-press-m-e-elbowcap.l\"/><use href=\"#dumbbell-bench-press-m-e-fore.l\"/><use href=\"#dumbbell-bench-press-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-m-e-head\"/><use href=\"#dumbbell-bench-press-m-e-torso\"/><use href=\"#dumbbell-bench-press-m-e-thigh.r\"/><use href=\"#dumbbell-bench-press-m-e-kneecap.r\"/><use href=\"#dumbbell-bench-press-m-e-shank.r\"/><use href=\"#dumbbell-bench-press-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-m-e-head\"/><use href=\"#dumbbell-bench-press-m-e-torso\"/><use href=\"#dumbbell-bench-press-m-e-thigh.r\"/><use href=\"#dumbbell-bench-press-m-e-kneecap.r\"/><use href=\"#dumbbell-bench-press-m-e-shank.r\"/><use href=\"#dumbbell-bench-press-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-m-e-shcap.r\"/><use href=\"#dumbbell-bench-press-m-e-upper.r\"/><use href=\"#dumbbell-bench-press-m-e-elbowcap.r\"/><use href=\"#dumbbell-bench-press-m-e-fore.r\"/><use href=\"#dumbbell-bench-press-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#dumbbell-bench-press-m-e-shcap.r\"/><use href=\"#dumbbell-bench-press-m-e-upper.r\"/><use href=\"#dumbbell-bench-press-m-e-elbowcap.r\"/><use href=\"#dumbbell-bench-press-m-e-fore.r\"/><use href=\"#dumbbell-bench-press-m-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"^40\"/><path class=\"disc\" d=\"^38\"/><path class=\"disc-core\" d=\"^39\"/><circle class=\"joint\" cx=\"137.07\" cy=\"262.78\" r=\"2.25\"/><circle class=\"joint\" cx=\"159.14\" cy=\"280.62\" r=\"2.25\"/><circle class=\"joint\" cx=\"205\" cy=\"255.62\" r=\"2.25\"/><circle class=\"joint\" cx=\"266.84\" cy=\"266.08\" r=\"2.25\"/></g><mask id=\"dumbbell-bench-press-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#dumbbell-bench-press-m-m-head\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-torso\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-thigh.l\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-shank.l\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-foot.l\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-shcap.l\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-upper.l\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-fore.l\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-mf-fist.l\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-thigh.r\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-shank.r\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-foot.r\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-shcap.r\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-upper.r\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-m-fore.r\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-mf-fist.r\" fill=\"#000\"/><use href=\"#dumbbell-bench-press-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dumbbell-bench-press-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#dumbbell-bench-press-m-mmask)\"><g class=\"u-stroke\"><use href=\"#dumbbell-bench-press-m-m-head\"/><use href=\"#dumbbell-bench-press-m-m-torso\"/><use href=\"#dumbbell-bench-press-m-m-thigh.l\"/><use href=\"#dumbbell-bench-press-m-m-kneecap.l\"/><use href=\"#dumbbell-bench-press-m-m-shank.l\"/><use href=\"#dumbbell-bench-press-m-m-foot.l\"/><use href=\"#dumbbell-bench-press-m-m-shcap.l\"/><use href=\"#dumbbell-bench-press-m-m-upper.l\"/><use href=\"#dumbbell-bench-press-m-m-elbowcap.l\"/><use href=\"#dumbbell-bench-press-m-m-fore.l\"/><use href=\"#dumbbell-bench-press-m-m-thigh.r\"/><use href=\"#dumbbell-bench-press-m-m-kneecap.r\"/><use href=\"#dumbbell-bench-press-m-m-shank.r\"/><use href=\"#dumbbell-bench-press-m-m-foot.r\"/><use href=\"#dumbbell-bench-press-m-m-shcap.r\"/><use href=\"#dumbbell-bench-press-m-m-upper.r\"/><use href=\"#dumbbell-bench-press-m-m-elbowcap.r\"/><use href=\"#dumbbell-bench-press-m-m-fore.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MyNF1ARV1L0BU4MYiwpLXi)oL0wS1\"/><path class=\"m-arrow\" d=\"~MyNF1U*V1L0BG2\"/><path class=\"m-arrow\" d=\"~MSxF1U*V1Lwp0\"/><path class=\"m-arrow\" d=\"~MSxF1NUT1Lwp0\"/><path class=\"leader m\" d=\"~MFRz1!HJ1L0Iv\"/><path class=\"leader m\" d=\"~MyNF1U*V1L0!F4\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dumbbell-bench-press-m-arch\" data-key=\"arch\" data-cue=\"Your low back arches and the belly pushes up.\" class=\"plate-callout two m\" style=\"left:46.93%;top:50.84%\" aria-pressed=\"true\">Low back<br>arches</button><button type=\"button\" id=\"dumbbell-bench-press-m-hips\" data-key=\"hips\" data-cue=\"Your hips lift off the bench to push the weight up.\" class=\"plate-callout two m\" style=\"left:39.66%;top:82.12%\" aria-pressed=\"false\">Hips<br>lift off</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "five",
        cues: [{ key: "five", cue: "Keep your head, shoulders, hips and both feet down the whole set." }, { key: "depth", cue: "Lower the dumbbells to mid-chest, a little wide, and touch gently." }, { key: "elbow", cue: "Keep each dumbbell over its elbow, forearm close to vertical." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "arch",
        cues: [{ key: "arch", cue: "Your low back arches and the belly pushes up." }, { key: "hips", cue: "Your hips lift off the bench to push the weight up." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Low back arches</b><span>Your low back arches and the belly pushes up.</span></li><li><b>Hips lift off</b><span>Your hips lift off the bench to push the weight up.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower 2 seconds, press 1 second\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>1 s</span></div></div></div>",
      alt: "Dumbbell bench press, side view. Lying on a flat bench, head, shoulders and hips on the pad, feet flat, the lifter lowers the dumbbells from straight arms to mid-chest, each forearm vertical under its dumbbell, then presses back up.",
      mistakeAlt: "Dumbbell Bench Press: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "push",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW2: the push heel-of-palm pair cannot be drawn by golden B's engine (D-LIB7-19); the grip copy carries c3 and c7.",
    "orientation": "pronated",
    "handle": "dumbbell",
    "overBody": true,
    "width": {
      "text": "Keep each dumbbell over its elbow. They drift apart slightly going down.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "sbs-bench"
        ],
        "note": "c7"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-db-chest-press"
        ],
        "note": "c3"
      }
    },
    "contact": "heel",
    "wrist": {
      "ext": [
        0,
        15
      ],
      "limitText": "Keep the wrist neutral, not bent forward or back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-db-chest-press"
        ],
        "note": "c3. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number."
      }
    },
    "faults": [
      {
        "key": "bent-back",
        "label": "Wrist bent back",
        "pose": {},
        "markers": [],
        "alt": "Wrist bent back under the dumbbell."
      }
    ],
    "gripLine": "Closed grip, palms facing forward, thumbs wrapped. Handle firm in your palm.",
    "cue": "Handle firm in palm, wrist neutral."
  },
  contacts: [
    "bench-lying"
  ],
  setup: [
    {
      "kind": "get-in",
      "text": "Sit on the bench end, feet on the floor, dumbbells in hand.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hk-db-bench"
        ],
        "note": "c10"
      }
    },
    {
      "kind": "get-in",
      "text": "Lean back into position with the dumbbells over your shoulders.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hk-db-bench"
        ],
        "note": "c10"
      }
    },
    {
      "kind": "brace",
      "text": "Feet flat, spine neutral, shoulder blades down and back.",
      "zoom": "five-point-bench",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-db-chest-press",
          "nsca-ch15-summary"
        ],
        "note": "c1, c2"
      }
    },
    {
      "kind": "position",
      "text": "Press to straight arms, dumbbells over your shoulders.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hk-db-bench"
        ],
        "note": "c10"
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
        "note": "c14"
      }
    }
  ],
  posture: [
    {
      "key": "contact",
      "label": "Five points",
      "detail": "Head, shoulders, buttocks and feet stay in contact.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "zoom": "five-point-bench",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-db-chest-press",
          "nsca-ch15-summary"
        ],
        "note": "c2"
      }
    },
    {
      "key": "arch",
      "label": "No arch",
      "detail": "No low-back arch, lowering or pressing.",
      "anchor": {
        "pose": "end",
        "at": "lumbar"
      },
      "zoom": "five-point-bench",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-db-chest-press"
        ],
        "note": "c6"
      }
    },
    {
      "key": "depth",
      "label": "Down to mid-chest",
      "detail": "Lower to mid-chest, a little wide, and touch gently.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-db-chest-press"
        ],
        "note": "c5"
      }
    },
    {
      "key": "elbow",
      "label": "Weight over elbow",
      "detail": "Each dumbbell stays roughly over its elbow.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "sbs-bench"
        ],
        "note": "c7"
      }
    },
    {
      "key": "wrists",
      "label": "Wrists neutral",
      "detail": "Wrists neutral, not bent forward or back.",
      "anchor": {
        "pose": "start",
        "at": "wrist.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-db-chest-press"
        ],
        "note": "c3"
      }
    }
  ],
  zooms: [
    {
      "key": "five-point-bench",
      "chip": "Five points",
      "heading": "Bench contact",
      "kind": "posture"
    }
  ],
  chips: [
    "five-point-bench",
    "feel"
  ],
  copy: {
    "setupLine": "Lie back with the dumbbells over your shoulders. Feet flat, shoulder blades down and back.",
    "mistakeLine": "Keep your hips and low back on the bench, lowering and pressing.",
    "cueLine": "Weight over elbow."
  },
  mistakes: [
    {
      "key": "arch",
      "title": "Arching the low back",
      "zoom": "five-point-bench",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-db-chest-press",
          "nsca-ch15-summary"
        ],
        "note": "c6, c2"
      },
      "fix": "Keep your hips and back on the bench."
    },
    {
      "key": "bounce",
      "title": "Dumbbells bouncing off the chest",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-db-chest-press"
        ],
        "note": "c5"
      },
      "fix": "Lower slowly and touch gently."
    }
  ],
  risks: [
    {
      "key": "dropped",
      "text": "Dropped weights cause most bad lifting injuries. Heavy? A spotter behind grips your wrists.",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "kerr2010",
          "hk-db-bench"
        ],
        "note": "c16, c11"
      }
    },
    {
      "key": "pec",
      "text": "Pec tendon rupture while lowering the weight.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "kowalczuk2022"
        ],
        "note": "c17"
      }
    },
    {
      "key": "shoulder",
      "text": "Shoulder injuries are common in lifting and linked to poor technique.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "kolber2010"
        ],
        "note": "c18"
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
    "ace-db-chest-press",
    "nsca-ch15-summary",
    "sbs-bench",
    "hk-db-bench",
    "saeterbakken2011",
    "acsm2009",
    "kerr2010",
    "kowalczuk2022",
    "kolber2010",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/dumbbell_bench_press.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

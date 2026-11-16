// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=f2e904d6391565340154fc7e31fe9163897ce51b277ce9801c8716cfe5bf6d6b
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_barbell_bench_press",
  name: "Barbell Bench Press",
  hashes: { inputsSha256: "f2e904d6391565340154fc7e31fe9163897ce51b277ce9801c8716cfe5bf6d6b", golden: "db6a630b628d103f90ba758cc2c318de378f002e074310dc97f4b78b569c1e13" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"barbell-bench-press-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"barbell-bench-press-n-st-upper.l\" d=\"~#F12WFs!HT1KEsBNU1f_870)1zO1z3_5R1(2z6_B1BaSi7Sg(9YiH5!B1N1w3A3(5_2zO1a0e!8AgS1weKp6ImIdXp00002000201000200010000200000012000001001000000000001001000000100101001210012010\"/><path id=\"barbell-bench-press-n-st-elbowcap.l\" d=\"~~PYp(zH1Dz10\"/><path id=\"barbell-bench-press-n-st-fore.l\" d=\"~#F12PwsSzH1-*rR)H1R1Hap.1.3GI1K3J9T1J23_w1X6_c4Hbw7Uco!w1U1H2U3H9A3II1m.1_1DaDa6HaVj5BhVaOj10000000000020020010000011110002002001000000100000200001101111000200001200100010\"/><path id=\"barbell-bench-press-n-st-fist.l\" d=\"~~WYpYIw1ww10\"/><path id=\"barbell-bench-press-n-st-upper.r\" d=\"^0\"/><path id=\"barbell-bench-press-n-st-elbowcap.r\" d=\"^1\"/><path id=\"barbell-bench-press-n-st-fore.r\" d=\"^2\"/><path id=\"barbell-bench-press-n-st-fist.r\" d=\"^3\"/><path id=\"barbell-bench-press-n-g0-upper.r\" d=\"~#F12YBs__T1T!rxRU1O2P593W8*uE4W2z2J1EbAe-fDeT5Nfw3wlbyikJ2U1!4DdGta2T1!5!aPhSlIjW7xlz4Vs00000011100101200000100002020000010000200212000220000020000200000011101000000120\"/><path id=\"barbell-bench-press-n-g0-elbowcap.r\" d=\"~~!-rFNK1Dz10\"/><path id=\"barbell-bench-press-n-g0-fore.r\" d=\"~#F12NxuPFK1EyuzxN1bD9tR1I9.A1B2S8G1H2U3AqV4YdW1ybY8SbS4yq(1Y1Y4P7K2)B1gV1y3S8Uay2H7.kT2xhOdXh00001001210000010111100110220000100010000000000000000000000101000002002101001120\"/><path id=\"barbell-bench-press-n-g0-fist.r\" d=\"~~USqPwB1ww10\"/><path id=\"barbell-bench-press-n-g1-upper.r\" d=\"~#F12yXrPOU1EIr.XU1z3!177Pd)d*3v.17B3.4*kD4VcJaB8WjA4A43(18!3HgGa88O2U2)6WqJsR5NhEeyb-q20011000100000101100020001120000000200200000100000100000200200000000000020000002\"/><path id=\"barbell-bench-press-n-g1-elbowcap.r\" d=\"~~SSsA(P1Dz10\"/><path id=\"barbell-bench-press-n-g1-fore.r\" d=\"~#F12w_uWXP1X_uxKR19(7vE1B9VvB2P7I1y2D3DkR4_dw2wb(8Nbw4wk(1P1W4H6E2*w1eO1A3H7AbD5w7zl)2)g-dKh20000020000000002100100000000001000000200000020000200000020020100220010000101000\"/><path id=\"barbell-bench-press-n-g1-fist.r\" d=\"~~SJrDVG1ww10\"/><path id=\"barbell-bench-press-n-e-thigh.l\" d=\"~#F12NUE1HGU1KBD1BBU1.b37D1P(1y7-6E7I3G3)T1IbRk)f)jI3VoH8-U1G6G4w2X8U4F*1!d8E1GbX3-g_sSA1NsPz1w6(I1.e02020000012000100002001200000000100000200000000000000020010000000000000001010000\"/><path id=\"barbell-bench-press-n-e-kneecap.l\" d=\"~~(WS1w)T1_J10\"/><path id=\"barbell-bench-press-n-e-shank.l\" d=\"~#F12JVS1ywU1)XS1XPS1P1.bH10H6_(1_5)7U2x4I5Xy2y7.d9*bT7KdA2xz2-2-3B6X7I3y)1E10x2XbOcwcXcwpiWl!dHo00000000000011000001111200200100000010010100001001001001000000200010000001012102\"/><path id=\"barbell-bench-press-n-e-foot.l\" d=\"~#o2HPT1DB)1.xU1EB(1YcF3Uh*7SpxoU-2B3-J2-4ID1)7)n0TG1_4BbXc_sEbKmUp000002000011100101010020000000000000020000100001\"/><path id=\"barbell-bench-press-n-e-shcap.l\" d=\"~~WFpJHT1wP10\"/><path id=\"barbell-bench-press-n-e-upper.l\" d=\"~#F12NYpwNU1VOp.AU1x2K265yeN9iV36-1Y6V1z7)jEcxbTkz5v!6X1eT3s_awd7aR2-1.sB4_9FrUgAfAs(620000210020000000201012100200001010100000000200000000010000101010100200000000000\"/><path id=\"barbell-bench-press-n-e-elbowcap.l\" d=\"~~Hzs_PV1Dz10\"/><path id=\"barbell-bench-press-n-e-fore.l\" d=\"~#F12HIu_PV1GFuOBW1X1U7lK1R3)vO3_6T1_1dPj.6Yc0Fb!6YcePjU1_1S3_6N3)voK1Y1U7DaP7NaRj2EhRaRj00100021011010210000020000000000000000000002000001101001010020000000000000100000\"/><path id=\"barbell-bench-press-n-e-fist.l\" d=\"~~PDs!GN1ww10\"/><path id=\"barbell-bench-press-n-e-head\" d=\"~#w12wNgHIT1GGgB)U1!kFhNbDix2Pbw5W2O7S5Gay9VkUjBdR3I9S2_1yjEdElR8TlF1xlyeTkFj50001100000200000100200020000000000002000002100101000000010001000\"/><path id=\"barbell-bench-press-n-e-torso\" d=\"~#_12!GlSJU1X_jKEU1E2AaT4Y4JeRaN9BaDf-dl.6VnH9z7ypy5Uc-4*fK6-k*fKmThRhT9-4*fw8Ez1DrBrDbO3S6*2UeAm)d_7V3z7HdUbHfNiD5(1G6.8*a(8B4_E1YO200010000020000100000000000200000000001000000010121000000002001010100000000000110000000220000100001002020000101000020\"/><path id=\"barbell-bench-press-n-e-thigh.r\" d=\"^12\"/><path id=\"barbell-bench-press-n-e-kneecap.r\" d=\"^13\"/><path id=\"barbell-bench-press-n-e-shank.r\" d=\"^14\"/><path id=\"barbell-bench-press-n-e-foot.r\" d=\"^15\"/><path id=\"barbell-bench-press-n-e-shcap.r\" d=\"^16\"/><path id=\"barbell-bench-press-n-e-upper.r\" d=\"^17\"/><path id=\"barbell-bench-press-n-e-elbowcap.r\" d=\"^18\"/><path id=\"barbell-bench-press-n-e-fore.r\" d=\"^19\"/><path id=\"barbell-bench-press-n-e-fist.r\" d=\"^20\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#barbell-bench-press-n-dots)\"/>\n  <path class=\"datum\" d=\"~MPDt_PV1L0*Ha\"/><path class=\"floorline\" d=\"M41.16 339.5H322.03\"/><path class=\"eq\" d=\"~M(EcNUX1LDXw10Qwp0B(v)oL)oDkQ0)o)oBkLB(vwpQ)o0D(vwpLwpBkQ0wpwpDkZ\"/><path class=\"eq\" d=\"~MPEeDy-1LyYs0QF60-RsE6LE6)qQ0E6E6wrL-RsF6QE60_RsF6LF6wrQ0F6F6)qZ\"/><path class=\"eq\" d=\"~M_BeSRY1L0PT8Q0F6F6EK8LwrE6QF60)qE6LE6EK8Q0E6E6FK8L)qF6QE60wrF6Z\"/><path class=\"eq\" d=\"~MDVdYDy2L(N20QF60VF2E6LE6V8Q0E6E6W8LVF2F6QE60WF2F6LF6W8Q0F6F6V8Z\"/><path class=\"eq\" d=\"~MSTG1SRY1L0PT8Q0F6F6EK8L(qE6QF60*qE6LE6EK8Q0E6E6FK8L*qF6QE60(qF6Z\"/><path class=\"eq\" d=\"~M(yG1YDy2L(N20QF60VF2E6LE6V8Q0E6E6W8LVF2F6QE60WF2F6LF6W8Q0F6F6V8Z\"/><path class=\"eq\" d=\"~MDyhPwy2L0*NH1Q0E6E6WFH1LXS1F6QE60YS1F6LF6WFH1Q0F6F6VFH1LYS1E6QF60XS1E6Z\"/><path class=\"eq-thin\" d=\"M81.23 295.11h1.2M81.23 287.8h1.2M81.23 280.49h1.2M81.23 273.17h1.2M81.23 265.86h1.2M81.23 258.54h1.2M81.23 251.23h1.2M81.23 243.91h1.2M81.23 236.6h1.2M81.23 229.29h1.2M81.23 221.97h1.2M81.23 214.66h1.2M81.23 207.34h1.2M81.23 200.03h1.2M81.23 192.71h1.2M81.23 185.4h1.2M81.23 178.09h1.2M81.23 170.77h1.2M81.23 163.46h1.2M81.23 156.14h1.2M81.23 148.83h1.2M81.23 141.51h1.2\"/><path class=\"eq\" d=\"~MDyh(yz1Lww20L))1VK1LXdWK1LYdww1LES1)vZ\"/><path class=\"eq\" d=\"~Mw-(1Pwy2L0*NH1Q0E6E6WFH1LVS1F6QE60WS1F6LF6WFH1Q0F6F6VFH1LWS1E6QF60VS1E6Z\"/><path class=\"eq-thin\" d=\"M315.29 295.11h1.2M315.29 287.8h1.2M315.29 280.49h1.2M315.29 273.17h1.2M315.29 265.86h1.2M315.29 258.54h1.2M315.29 251.23h1.2M315.29 243.91h1.2M315.29 236.6h1.2M315.29 229.29h1.2M315.29 221.97h1.2M315.29 214.66h1.2M315.29 207.34h1.2M315.29 200.03h1.2M315.29 192.71h1.2M315.29 185.4h1.2M315.29 178.09h1.2M315.29 170.77h1.2M315.29 163.46h1.2M315.29 156.14h1.2M315.29 148.83h1.2M315.29 141.51h1.2\"/><path class=\"eq\" d=\"~MHWg_)P1LAGJ10Q!m0ESI1.mL.m!mQ0.m.m.mLESI1!mQ.m0FSI1!mL!m.mQ0!m!m!mZ\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#barbell-bench-press-n-st-upper.l\"/><use href=\"#barbell-bench-press-n-st-elbowcap.l\"/><use href=\"#barbell-bench-press-n-st-fore.l\"/><use href=\"#barbell-bench-press-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#barbell-bench-press-n-st-upper.l\"/><use href=\"#barbell-bench-press-n-st-elbowcap.l\"/><use href=\"#barbell-bench-press-n-st-fore.l\"/><use href=\"#barbell-bench-press-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-bench-press-n-st-upper.r\"/><use href=\"#barbell-bench-press-n-st-elbowcap.r\"/><use href=\"#barbell-bench-press-n-st-fore.r\"/><use href=\"#barbell-bench-press-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-bench-press-n-st-upper.r\"/><use href=\"#barbell-bench-press-n-st-elbowcap.r\"/><use href=\"#barbell-bench-press-n-st-fore.r\"/><use href=\"#barbell-bench-press-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-bench-press-n-g0-upper.r\"/><use href=\"#barbell-bench-press-n-g0-elbowcap.r\"/><use href=\"#barbell-bench-press-n-g0-fore.r\"/><use href=\"#barbell-bench-press-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-bench-press-n-g0-upper.r\"/><use href=\"#barbell-bench-press-n-g0-elbowcap.r\"/><use href=\"#barbell-bench-press-n-g0-fore.r\"/><use href=\"#barbell-bench-press-n-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~~Y.qPwB1!m1\"/><path class=\"eq-pin\" d=\"~~JJrPwB1F60\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-bench-press-n-g1-upper.r\"/><use href=\"#barbell-bench-press-n-g1-elbowcap.r\"/><use href=\"#barbell-bench-press-n-g1-fore.r\"/><use href=\"#barbell-bench-press-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-bench-press-n-g1-upper.r\"/><use href=\"#barbell-bench-press-n-g1-elbowcap.r\"/><use href=\"#barbell-bench-press-n-g1-fore.r\"/><use href=\"#barbell-bench-press-n-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~~WVrDVG1!m1\"/><path class=\"eq-pin\" d=\"~~HDsDVG1F60\"/></g><g class=\"pose-end\"><path class=\"eq-line\" d=\"~~_Ym!GN1WK62\"/><path class=\"eq-thin\" d=\"~~_*n!GN1WF50\"/><path class=\"eq-solid\" d=\"~~UOs!GN1!m1\"/><path class=\"eq-pin\" d=\"~~Fwt!GN1F60\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#barbell-bench-press-n-e-thigh.l\"/><use href=\"#barbell-bench-press-n-e-kneecap.l\"/><use href=\"#barbell-bench-press-n-e-shank.l\"/><use href=\"#barbell-bench-press-n-e-foot.l\"/><use href=\"#barbell-bench-press-n-e-shcap.l\"/><use href=\"#barbell-bench-press-n-e-upper.l\"/><use href=\"#barbell-bench-press-n-e-elbowcap.l\"/><use href=\"#barbell-bench-press-n-e-fore.l\"/><use href=\"#barbell-bench-press-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#barbell-bench-press-n-e-thigh.l\"/><use href=\"#barbell-bench-press-n-e-kneecap.l\"/><use href=\"#barbell-bench-press-n-e-shank.l\"/><use href=\"#barbell-bench-press-n-e-foot.l\"/><use href=\"#barbell-bench-press-n-e-shcap.l\"/><use href=\"#barbell-bench-press-n-e-upper.l\"/><use href=\"#barbell-bench-press-n-e-elbowcap.l\"/><use href=\"#barbell-bench-press-n-e-fore.l\"/><use href=\"#barbell-bench-press-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-bench-press-n-e-head\"/><use href=\"#barbell-bench-press-n-e-torso\"/><use href=\"#barbell-bench-press-n-e-thigh.r\"/><use href=\"#barbell-bench-press-n-e-kneecap.r\"/><use href=\"#barbell-bench-press-n-e-shank.r\"/><use href=\"#barbell-bench-press-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-bench-press-n-e-head\"/><use href=\"#barbell-bench-press-n-e-torso\"/><use href=\"#barbell-bench-press-n-e-thigh.r\"/><use href=\"#barbell-bench-press-n-e-kneecap.r\"/><use href=\"#barbell-bench-press-n-e-shank.r\"/><use href=\"#barbell-bench-press-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-bench-press-n-e-shcap.r\"/><use href=\"#barbell-bench-press-n-e-upper.r\"/><use href=\"#barbell-bench-press-n-e-elbowcap.r\"/><use href=\"#barbell-bench-press-n-e-fore.r\"/><use href=\"#barbell-bench-press-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-bench-press-n-e-shcap.r\"/><use href=\"#barbell-bench-press-n-e-upper.r\"/><use href=\"#barbell-bench-press-n-e-elbowcap.r\"/><use href=\"#barbell-bench-press-n-e-fore.r\"/><use href=\"#barbell-bench-press-n-e-fist.r\"/></g></g><path class=\"eq-line m-line\" d=\"~MWYqySO1LU*y10\"/><path class=\"eq-line m-line\" d=\"~MWYq_)P1LU*y10\"/><path class=\"eq-solid\" d=\"^43\"/><path class=\"eq-pin\" d=\"^44\"/><path class=\"eq-cable m-line\" d=\"~MPOrYIw1LX1V8LB3F1LK2P2LI1D3L0P3LH1D3LP2P2LD3F1LP32LD3G1LP2O2LH1B3L0O3LI1B3LK2O2LB3G1\"/><circle class=\"joint\" cx=\"137.07\" cy=\"262.78\" r=\"2.25\"/><circle class=\"joint\" cx=\"149.52\" cy=\"274.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"205\" cy=\"255.62\" r=\"2.25\"/><circle class=\"joint\" cx=\"266.84\" cy=\"266.08\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#w20UBrAWy1)zr-Jy10102000102000001020001021021020001020000010200010200010200000100010100000200010100000200001101110010001001110010101001012000220021012000220000010101000000000101000000100111001002100011011110\"/><path class=\"arrow\" d=\"~MwwtNAK1L*oVx1L!*1FrZ\"/></g><path class=\"leader\" d=\"~MyNF1U*V1L0zV6\"/><circle class=\"anchor\" cx=\"207.05\" cy=\"276.1\" r=\"1.5\"/><path class=\"leader\" d=\"M149.52 237.1L175 172H185\"/><circle class=\"anchor\" cx=\"149.52\" cy=\"237.1\" r=\"1.5\"/><path class=\"leader\" d=\"~MPDt!FS1L0AY6\"/><circle class=\"anchor\" cx=\"149.52\" cy=\"257.42\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"barbell-bench-press-n-hips\" data-key=\"hips\" data-cue=\"Keep your buttocks on the bench for every rep.\" class=\"plate-callout two\" style=\"left:55.87%;top:56.42%\" aria-pressed=\"true\">Hips<br>down</button><button type=\"button\" id=\"barbell-bench-press-n-touch\" data-key=\"touch\" data-cue=\"Lower the bar to the middle of your chest, never toward the neck.\" class=\"plate-callout two\" style=\"left:50.28%;top:41.9%\" aria-pressed=\"false\">Mid-chest<br>touch</button><button type=\"button\" id=\"barbell-bench-press-n-forearms\" data-key=\"forearms\" data-cue=\"At the bottom your forearms point straight up under the bar.\" class=\"plate-callout two\" style=\"left:30.73%;top:80.45%\" aria-pressed=\"false\">Forearms<br>vertical</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"barbell-bench-press-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"barbell-bench-press-m-st-upper.l\" d=\"^0\"/><path id=\"barbell-bench-press-m-st-elbowcap.l\" d=\"^1\"/><path id=\"barbell-bench-press-m-st-fore.l\" d=\"^2\"/><path id=\"barbell-bench-press-m-st-fist.l\" d=\"^3\"/><path id=\"barbell-bench-press-m-st-upper.r\" d=\"^0\"/><path id=\"barbell-bench-press-m-st-elbowcap.r\" d=\"^1\"/><path id=\"barbell-bench-press-m-st-fore.r\" d=\"^2\"/><path id=\"barbell-bench-press-m-st-fist.r\" d=\"^3\"/><path id=\"barbell-bench-press-m-g0-upper.r\" d=\"^4\"/><path id=\"barbell-bench-press-m-g0-elbowcap.r\" d=\"^5\"/><path id=\"barbell-bench-press-m-g0-fore.r\" d=\"^6\"/><path id=\"barbell-bench-press-m-g0-fist.r\" d=\"^7\"/><path id=\"barbell-bench-press-m-g1-upper.r\" d=\"^8\"/><path id=\"barbell-bench-press-m-g1-elbowcap.r\" d=\"^9\"/><path id=\"barbell-bench-press-m-g1-fore.r\" d=\"^10\"/><path id=\"barbell-bench-press-m-g1-fist.r\" d=\"^11\"/><path id=\"barbell-bench-press-m-e-thigh.l\" d=\"^12\"/><path id=\"barbell-bench-press-m-e-kneecap.l\" d=\"^13\"/><path id=\"barbell-bench-press-m-e-shank.l\" d=\"^14\"/><path id=\"barbell-bench-press-m-e-foot.l\" d=\"^15\"/><path id=\"barbell-bench-press-m-e-shcap.l\" d=\"^16\"/><path id=\"barbell-bench-press-m-e-upper.l\" d=\"^17\"/><path id=\"barbell-bench-press-m-e-elbowcap.l\" d=\"^18\"/><path id=\"barbell-bench-press-m-e-fore.l\" d=\"^19\"/><path id=\"barbell-bench-press-m-e-fist.l\" d=\"^20\"/><path id=\"barbell-bench-press-m-e-head\" d=\"^21\"/><path id=\"barbell-bench-press-m-e-torso\" d=\"^22\"/><path id=\"barbell-bench-press-m-e-thigh.r\" d=\"^12\"/><path id=\"barbell-bench-press-m-e-kneecap.r\" d=\"^13\"/><path id=\"barbell-bench-press-m-e-shank.r\" d=\"^14\"/><path id=\"barbell-bench-press-m-e-foot.r\" d=\"^15\"/><path id=\"barbell-bench-press-m-e-shcap.r\" d=\"^16\"/><path id=\"barbell-bench-press-m-e-upper.r\" d=\"^17\"/><path id=\"barbell-bench-press-m-e-elbowcap.r\" d=\"^18\"/><path id=\"barbell-bench-press-m-e-fore.r\" d=\"^19\"/><path id=\"barbell-bench-press-m-e-fist.r\" d=\"^20\"/><path id=\"barbell-bench-press-m-m-upper.l\" d=\"~#F12wBsY!T1*-r)UU1*2(591Nb-x1T4!2B2S1XdwiKgPdG6DfA2Dlx3JmeW2F1H5_f*va2B2J6AbSfPmIiP8Xk-2.s02002100000001010000020010000210100000010002100000000001000012020000200000002000\"/><path id=\"barbell-bench-press-m-m-elbowcap.l\" d=\"~~SHsy*J1Dz10\"/><path id=\"barbell-bench-press-m-m-fore.l\" d=\"~#F12SSuA!J1EPuTVK1K1H9pT1K4KE1I3U8T1D2cFsR6wd8DbF7ScA1HsW1A2Y3J8N2RE1oX1w2H9AaP2ya.jdEh)aEj00000100000000021010000021121000002101000012100001111101000120001000010000200200\"/><path id=\"barbell-bench-press-m-m-fist.l\" d=\"~~PDsWwA1ww10\"/><path id=\"barbell-bench-press-m-m-upper.r\" d=\"^53\"/><path id=\"barbell-bench-press-m-m-elbowcap.r\" d=\"^54\"/><path id=\"barbell-bench-press-m-m-fore.r\" d=\"^55\"/><path id=\"barbell-bench-press-m-m-fist.r\" d=\"^56\"/><path id=\"barbell-bench-press-m-m-eq0\" d=\"~~UOsWwA1!m1\"/><path id=\"barbell-bench-press-m-m-eq1\" d=\"~~FwtWwA1F60\"/><path id=\"barbell-bench-press-m-m-eq2\" d=\"^57\"/><path id=\"barbell-bench-press-m-m-eq3\" d=\"^58\"/><path id=\"barbell-bench-press-m-mf-head\" d=\"^21\"/><path id=\"barbell-bench-press-m-mf-torso\" d=\"^22\"/><path id=\"barbell-bench-press-m-mf-thigh.l\" d=\"^12\"/><path id=\"barbell-bench-press-m-mf-kneecap.l\" d=\"^13\"/><path id=\"barbell-bench-press-m-mf-shank.l\" d=\"^14\"/><path id=\"barbell-bench-press-m-mf-foot.l\" d=\"^15\"/><path id=\"barbell-bench-press-m-mf-shcap.l\" d=\"^16\"/><path id=\"barbell-bench-press-m-mf-thigh.r\" d=\"^12\"/><path id=\"barbell-bench-press-m-mf-kneecap.r\" d=\"^13\"/><path id=\"barbell-bench-press-m-mf-shank.r\" d=\"^14\"/><path id=\"barbell-bench-press-m-mf-foot.r\" d=\"^15\"/><path id=\"barbell-bench-press-m-mf-shcap.r\" d=\"^16\"/><path id=\"barbell-bench-press-m-mo-0\" d=\"^21\"/><path id=\"barbell-bench-press-m-mo-1\" d=\"^22\"/><path id=\"barbell-bench-press-m-mo-2\" d=\"^12\"/><path id=\"barbell-bench-press-m-mo-3\" d=\"^13\"/><path id=\"barbell-bench-press-m-mo-4\" d=\"^14\"/><path id=\"barbell-bench-press-m-mo-5\" d=\"^15\"/><path id=\"barbell-bench-press-m-mo-6\" d=\"^16\"/><path id=\"barbell-bench-press-m-mo-7\" d=\"^17\"/><path id=\"barbell-bench-press-m-mo-8\" d=\"^18\"/><path id=\"barbell-bench-press-m-mo-9\" d=\"^19\"/><path id=\"barbell-bench-press-m-mo-10\" d=\"^20\"/><path id=\"barbell-bench-press-m-mo-11\" d=\"^12\"/><path id=\"barbell-bench-press-m-mo-12\" d=\"^13\"/><path id=\"barbell-bench-press-m-mo-13\" d=\"^14\"/><path id=\"barbell-bench-press-m-mo-14\" d=\"^15\"/><path id=\"barbell-bench-press-m-mo-15\" d=\"^16\"/><path id=\"barbell-bench-press-m-mo-16\" d=\"^17\"/><path id=\"barbell-bench-press-m-mo-17\" d=\"^18\"/><path id=\"barbell-bench-press-m-mo-18\" d=\"^19\"/><path id=\"barbell-bench-press-m-mo-19\" d=\"^20\"/><path id=\"barbell-bench-press-m-mo-20\" d=\"^25\"/><path id=\"barbell-bench-press-m-mo-21\" d=\"^26\"/><path id=\"barbell-bench-press-m-mo-22\" d=\"^27\"/><path id=\"barbell-bench-press-m-mo-23\" d=\"^28\"/><path id=\"barbell-bench-press-m-mo-24\" d=\"^29\"/><path id=\"barbell-bench-press-m-mo-25\" d=\"^30\"/><path id=\"barbell-bench-press-m-mo-26\" d=\"^31\"/><path id=\"barbell-bench-press-m-mo-27\" d=\"^33\"/><path id=\"barbell-bench-press-m-mo-28\" d=\"^34\"/><path id=\"barbell-bench-press-m-mo-29\" d=\"^36\"/><path id=\"barbell-bench-press-m-mo-30\" d=\"^43\"/><path id=\"barbell-bench-press-m-mo-31\" d=\"^44\"/><path id=\"barbell-bench-press-m-mo-32\" d=\"^43\"/><path id=\"barbell-bench-press-m-mo-33\" d=\"^44\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#barbell-bench-press-m-dots)\"/>\n  <path class=\"floorline\" d=\"^24\"/><path class=\"eq\" d=\"^25\"/><path class=\"eq\" d=\"^26\"/><path class=\"eq\" d=\"^27\"/><path class=\"eq\" d=\"^28\"/><path class=\"eq\" d=\"^29\"/><path class=\"eq\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq-thin\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><path class=\"eq-thin\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#barbell-bench-press-m-st-upper.l\"/><use href=\"#barbell-bench-press-m-st-elbowcap.l\"/><use href=\"#barbell-bench-press-m-st-fore.l\"/><use href=\"#barbell-bench-press-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#barbell-bench-press-m-st-upper.l\"/><use href=\"#barbell-bench-press-m-st-elbowcap.l\"/><use href=\"#barbell-bench-press-m-st-fore.l\"/><use href=\"#barbell-bench-press-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-bench-press-m-st-upper.r\"/><use href=\"#barbell-bench-press-m-st-elbowcap.r\"/><use href=\"#barbell-bench-press-m-st-fore.r\"/><use href=\"#barbell-bench-press-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-bench-press-m-st-upper.r\"/><use href=\"#barbell-bench-press-m-st-elbowcap.r\"/><use href=\"#barbell-bench-press-m-st-fore.r\"/><use href=\"#barbell-bench-press-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-bench-press-m-g0-upper.r\"/><use href=\"#barbell-bench-press-m-g0-elbowcap.r\"/><use href=\"#barbell-bench-press-m-g0-fore.r\"/><use href=\"#barbell-bench-press-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-bench-press-m-g0-upper.r\"/><use href=\"#barbell-bench-press-m-g0-elbowcap.r\"/><use href=\"#barbell-bench-press-m-g0-fore.r\"/><use href=\"#barbell-bench-press-m-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^37\"/><path class=\"eq-pin\" d=\"^38\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-bench-press-m-g1-upper.r\"/><use href=\"#barbell-bench-press-m-g1-elbowcap.r\"/><use href=\"#barbell-bench-press-m-g1-fore.r\"/><use href=\"#barbell-bench-press-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-bench-press-m-g1-upper.r\"/><use href=\"#barbell-bench-press-m-g1-elbowcap.r\"/><use href=\"#barbell-bench-press-m-g1-fore.r\"/><use href=\"#barbell-bench-press-m-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^39\"/><path class=\"eq-pin\" d=\"^40\"/></g><g class=\"pose-end\"><path class=\"eq-line\" d=\"^41\"/><path class=\"eq-thin\" d=\"^42\"/><path class=\"eq-solid\" d=\"^43\"/><path class=\"eq-pin\" d=\"^44\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#barbell-bench-press-m-e-thigh.l\"/><use href=\"#barbell-bench-press-m-e-kneecap.l\"/><use href=\"#barbell-bench-press-m-e-shank.l\"/><use href=\"#barbell-bench-press-m-e-foot.l\"/><use href=\"#barbell-bench-press-m-e-shcap.l\"/><use href=\"#barbell-bench-press-m-e-upper.l\"/><use href=\"#barbell-bench-press-m-e-elbowcap.l\"/><use href=\"#barbell-bench-press-m-e-fore.l\"/><use href=\"#barbell-bench-press-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#barbell-bench-press-m-e-thigh.l\"/><use href=\"#barbell-bench-press-m-e-kneecap.l\"/><use href=\"#barbell-bench-press-m-e-shank.l\"/><use href=\"#barbell-bench-press-m-e-foot.l\"/><use href=\"#barbell-bench-press-m-e-shcap.l\"/><use href=\"#barbell-bench-press-m-e-upper.l\"/><use href=\"#barbell-bench-press-m-e-elbowcap.l\"/><use href=\"#barbell-bench-press-m-e-fore.l\"/><use href=\"#barbell-bench-press-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-bench-press-m-e-head\"/><use href=\"#barbell-bench-press-m-e-torso\"/><use href=\"#barbell-bench-press-m-e-thigh.r\"/><use href=\"#barbell-bench-press-m-e-kneecap.r\"/><use href=\"#barbell-bench-press-m-e-shank.r\"/><use href=\"#barbell-bench-press-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-bench-press-m-e-head\"/><use href=\"#barbell-bench-press-m-e-torso\"/><use href=\"#barbell-bench-press-m-e-thigh.r\"/><use href=\"#barbell-bench-press-m-e-kneecap.r\"/><use href=\"#barbell-bench-press-m-e-shank.r\"/><use href=\"#barbell-bench-press-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-bench-press-m-e-shcap.r\"/><use href=\"#barbell-bench-press-m-e-upper.r\"/><use href=\"#barbell-bench-press-m-e-elbowcap.r\"/><use href=\"#barbell-bench-press-m-e-fore.r\"/><use href=\"#barbell-bench-press-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-bench-press-m-e-shcap.r\"/><use href=\"#barbell-bench-press-m-e-upper.r\"/><use href=\"#barbell-bench-press-m-e-elbowcap.r\"/><use href=\"#barbell-bench-press-m-e-fore.r\"/><use href=\"#barbell-bench-press-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^43\"/><path class=\"eq-pin\" d=\"^44\"/><path class=\"eq-cable m-line\" d=\"^47\"/><circle class=\"joint\" cx=\"137.07\" cy=\"262.78\" r=\"2.25\"/><circle class=\"joint\" cx=\"149.52\" cy=\"274.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"205\" cy=\"255.62\" r=\"2.25\"/><circle class=\"joint\" cx=\"266.84\" cy=\"266.08\" r=\"2.25\"/></g><mask id=\"barbell-bench-press-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#barbell-bench-press-m-mf-head\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-mf-torso\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-mf-shank.l\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-mf-foot.l\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-m-upper.l\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-m-fore.l\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-m-fist.l\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-mf-shank.r\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-mf-foot.r\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-m-upper.r\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-m-fore.r\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-m-fist.r\" fill=\"#000\"/><use href=\"#barbell-bench-press-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-bench-press-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#barbell-bench-press-m-mmask)\"><g class=\"u-stroke\"><use href=\"#barbell-bench-press-m-m-upper.l\"/><use href=\"#barbell-bench-press-m-m-elbowcap.l\"/><use href=\"#barbell-bench-press-m-m-fore.l\"/><use href=\"#barbell-bench-press-m-m-fist.l\"/><use href=\"#barbell-bench-press-m-m-upper.r\"/><use href=\"#barbell-bench-press-m-m-elbowcap.r\"/><use href=\"#barbell-bench-press-m-m-fore.r\"/><use href=\"#barbell-bench-press-m-m-fist.r\"/><use href=\"#barbell-bench-press-m-m-eq0\"/><use href=\"#barbell-bench-press-m-m-eq1\"/><use href=\"#barbell-bench-press-m-m-eq2\"/><use href=\"#barbell-bench-press-m-m-eq3\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MPDtNNK1L0GS8\"/><path class=\"m-line\" d=\"~M(xuWwA1Lx2KaL*3P1L.2w3LT1!3L0A4LU1!3L(2w3L_3P1LF42L_3R1L(2)2LU1.3L0z4LT1.3L.2)2L*3R1\"/><path class=\"m-arrow\" d=\"~MPDtwTD1L0GS1MYiwpLXi)oL0wS1\"/><path class=\"leader m\" d=\"M149.52 214.43L203 228H213\"/><path class=\"leader m\" d=\"M149.52 180.05L179 172H189\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"barbell-bench-press-m-path\" data-key=\"path\" data-cue=\"You drive the bar straight up off your chest.\" class=\"plate-callout two m\" style=\"left:58.1%;top:57.54%\" aria-pressed=\"true\">Straight<br>up</button><button type=\"button\" id=\"barbell-bench-press-m-chest\" data-key=\"chest\" data-cue=\"The bar stays over your chest instead of moving back over your shoulders.\" class=\"plate-callout two m\" style=\"left:51.4%;top:41.9%\" aria-pressed=\"false\">Stays over<br>chest</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "hips",
        cues: [{ key: "hips", cue: "Keep your buttocks on the bench for every rep." }, { key: "touch", cue: "Lower the bar to the middle of your chest, never toward the neck." }, { key: "forearms", cue: "At the bottom your forearms point straight up under the bar." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "path",
        cues: [{ key: "path", cue: "You drive the bar straight up off your chest." }, { key: "chest", cue: "The bar stays over your chest instead of moving back over your shoulders." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Straight up</b><span>You drive the bar straight up off your chest.</span></li><li><b>Stays over chest</b><span>The bar stays over your chest instead of moving back over your shoulders.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower 2 seconds, press 1 second, hold 1 second\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div></div>",
      alt: "Barbell bench press, side view. Lying on a flat bench in a rack, feet flat and hips down, the lifter lowers the bar from straight arms over the shoulders to the middle of the chest, forearms vertical, then presses it up and back toward the shoulders.",
      mistakeAlt: "Barbell Bench Press: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "push",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: bar-low-palm: push heel-of-palm pair not drawable through golden B's engine (D-LIB7-19); no key draws it; the grip copy carries c4 and c5.",
    "orientation": "pronated",
    "handle": "bar-28",
    "overBody": true,
    "width": {
      "text": "Hands slightly wider than shoulder-width.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bb-chest-press"
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
          "hk-bench-youth",
          "stronglifts-bench"
        ],
        "note": "c4"
      }
    },
    "contact": "heel",
    "wrist": {
      "ext": [
        0,
        15
      ],
      "limitText": "Bar over the wrist, wrist not bent back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-bench",
          "sbs-bench"
        ],
        "note": "c5. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number."
      }
    },
    "faults": [
      {
        "key": "bent-back",
        "label": "Wrist bent back",
        "pose": {},
        "markers": [],
        "alt": "Bar high toward the fingers, wrist bent back."
      }
    ],
    "gripLine": "Closed grip, palms toward your feet. Bar in the palm's base, thumb wrapped.",
    "cue": "Palm base, wrist not bent back."
  },
  contacts: [
    "bench-lying"
  ],
  setup: [
    {
      "kind": "safety",
      "text": "Set the safety pins slightly below where the bar touches your chest.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-bench"
        ],
        "note": "c6"
      }
    },
    {
      "kind": "position",
      "text": "Shoulders at least 8 cm from uprights. Feet flat. Blades together.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hk-bench-youth",
          "sbs-bench"
        ],
        "note": "c13, c14, c12"
      }
    },
    {
      "kind": "grip",
      "text": "Grip slightly wider than shoulders, thumbs wrapped, bar low in the palm.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hk-bench-youth",
          "stronglifts-bench",
          "ace-bb-chest-press",
          "sbs-bench"
        ],
        "note": "c4, c1, c5"
      }
    },
    {
      "kind": "get-in",
      "text": "With a spotter behind your head, unrack the bar to straight arms.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hk-bench-youth",
          "stronglifts-bench"
        ],
        "note": "c7, c27"
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
        "note": "c16"
      }
    }
  ],
  posture: [
    {
      "key": "hips",
      "label": "Hips down",
      "detail": "Buttocks on the bench, feet pressing the floor.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "zoom": "hips-on-bench",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bb-chest-press",
          "stronglifts-bench",
          "hk-bench-youth"
        ],
        "note": "c1, c10"
      }
    },
    {
      "key": "blades",
      "label": "Blades together",
      "detail": "Shoulder blades together before you unrack.",
      "anchor": {
        "pose": "start",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sbs-bench"
        ],
        "note": "c12"
      }
    },
    {
      "key": "elbows",
      "label": "Elbows tucked",
      "detail": "Elbows tucked in about 75 degrees as you lower.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hk-bench-youth",
          "stronglifts-bench"
        ],
        "note": "c2"
      }
    },
    {
      "key": "forearms",
      "label": "Forearms vertical",
      "detail": "Forearms vertical at the bottom.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hk-bench-youth",
          "stronglifts-bench"
        ],
        "note": "c2"
      }
    },
    {
      "key": "wrists",
      "label": "Low in palm",
      "detail": "Bar low in the palm, wrists not bent back.",
      "anchor": {
        "pose": "start",
        "at": "wrist.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-bench",
          "sbs-bench"
        ],
        "note": "c5"
      }
    },
    {
      "key": "path",
      "label": "Bar path",
      "detail": "Bar travels between mid-chest and over the shoulders, never to the neck.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "stronglifts-bench"
        ],
        "note": "c8"
      }
    }
  ],
  zooms: [
    {
      "key": "hips-on-bench",
      "chip": "Hips",
      "heading": "Hips on bench",
      "kind": "posture"
    }
  ],
  chips: [
    "hips-on-bench",
    "feel"
  ],
  copy: {
    "setupLine": "Pins set. Buttocks on the bench, feet pressing the floor, blades together.",
    "mistakeLine": "Hips lifted off the bench, low back over-arched? That rep counts as failed.",
    "cueLine": "Up and back over the shoulders."
  },
  mistakes: [
    {
      "key": "path",
      "title": "Pressing straight up off chest",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sbs-bench",
          "stronglifts-bench"
        ],
        "note": "c25, c8"
      },
      "fix": "Drive it up and slightly back toward your shoulders."
    },
    {
      "key": "thumbless",
      "title": "Thumbless grip",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hk-bench-youth",
          "stronglifts-bench"
        ],
        "note": "c4"
      },
      "fix": "Wrap your thumbs round the bar."
    },
    {
      "key": "hips",
      "title": "Hips lifting, low back over-arched",
      "zoom": "hips-on-bench",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bb-chest-press",
          "stronglifts-bench",
          "hk-bench-youth"
        ],
        "note": "c1, c10"
      },
      "fix": "Buttocks down, feet pressing the floor. Lifted hips fail the rep."
    }
  ],
  risks: [
    {
      "key": "face",
      "text": "Bar over face and neck: wrap the thumbs. Use safety pins or a spotter.",
      "claim": {
        "tags": [
          "DATA",
          "CONSENSUS"
        ],
        "sources": [
          "jumbelic2007",
          "hk-bench-youth",
          "stronglifts-bench"
        ],
        "note": "c9, c4, c6, c7"
      }
    },
    {
      "key": "pec",
      "text": "Pec tendon rupture while lowering the bar.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "kowalczuk2022"
        ],
        "note": "c22"
      }
    },
    {
      "key": "dropped",
      "text": "In US hospital data, dropped weights are the top cause of lifting injuries.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "kerr2010"
        ],
        "note": "c23"
      }
    }
  ],
  riskFlags: [
    "shoulder",
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
    "stronglifts-bench",
    "hk-bench-youth",
    "ace-bb-chest-press",
    "sbs-bench",
    "saeterbakken2021",
    "rodriguezridao2020",
    "coratella2020",
    "kowalczuk2022",
    "jumbelic2007",
    "kerr2010",
    "kolber2010",
    "acsm2009",
    "nhs-shoulder-pain",
    "nhs-wrist-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/barbell_bench_press.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

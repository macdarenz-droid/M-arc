// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=f027a0d833e28b65f97443c0ac0bc3fb5936ef93be32b918e18be7ab4733ccd2
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_dead_bug",
  name: "Dead Bug",
  hashes: { inputsSha256: "f027a0d833e28b65f97443c0ac0bc3fb5936ef93be32b918e18be7ab4733ccd2", golden: "008e9427823e47ed837310b875de96dc0d645ea52aaa9ecd977e56665bd052fc" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dead-bug-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dead-bug-n-st-thigh.l\" d=\"~#F12DGF1!J(1)JF1R!)1_1wcH11R3O)1)5!7-2y4R2YV1OcHn0PkPcHnS2YV1Y2y4A6!7P3O)1G11-1wcUv!bDmGG10OA1BmGG110121001010000002100001011000000001000111000000120000001111002000010100000101000\"/><path id=\"dead-bug-n-st-kneecap.l\" d=\"~~wNA1_)R1JK10\"/><path id=\"dead-bug-n-st-shank.l\" d=\"~#F12J.B1_NT1RIA1)HT1*b.12E1W)1.4.7z6x4X2-z2_3-dI7zc1-dN7-z2-3x4Y2.7A6W)1!42H1*b_1_b(cwpPdwm1wpId11012000001210012012100000000001000000010110102002101100002101101100100100100010\"/><path id=\"dead-bug-n-st-foot.l\" d=\"~#o2NDR1(!S1xDP1xIS1H3xdz8XhIo*pB3-_2-4_K2B8(D12Fo_4DH1*cHbIbztwqUm000101001210000101000010100001001001010000002110\"/><path id=\"dead-bug-n-st-upper.r\" d=\"~#F12FYqYE(1GXq*I)1dy990K2EP1B3y6K1w3.5wE1Ba(i0YgFa(iY5wE1P1w3D3y6N2EP1a0ey9Ngy1!d.p0Xm.d.p00000200021010000000000010000000000000001000001000000002000200000000000000000000\"/><path id=\"dead-bug-n-st-elbowcap.r\" d=\"~~wAoH_U1Wz11\"/><path id=\"dead-bug-n-st-fore.r\" d=\"~#F12(JqH_U1*GqVWV1V1Jap.1O3)I1R3N9V1J2dNx1*6(c0Jb(6(ceNx1W1J2S3N9P3)I1q.1Y1JaFa6Ua.j0IhRa.j10110000000021010110100101000000000000010100000111110000002001001011000000000100\"/><path id=\"dead-bug-n-st-palm.r\" d=\"~#o2()pWKK1ONqK-N1W9-8U1_8.4YfA4wl1wepwl0Yf!4_80-8HoEz10)g010100100202002200101010020002020000010100000000\"/><path id=\"dead-bug-n-e-thigh.l\" d=\"~#F12PWB1P_w2VDA1G.w2)by13F1U)1gO7R6-3x3RV1.5Km*dOkE1)nwb.V1pz4S2G8S5D)1N72E1XbR2.dYu(E1YoFA1H2YH1Tj00010100100002200001010200000010020000010100220000010100000020200000001000000002\"/><path id=\"dead-bug-n-e-kneecap.l\" d=\"~~H_P1UB)1JK10\"/><path id=\"dead-bug-n-e-shank.l\" d=\"~#F12YAS1PUw2EVP1VKw2-bT24E1!)1tO7R6-3)2)z2dEdE8BcnBeP6Kz2)7B4S2I8P5J)1!81H1)by1(aWdAowfwmH1Yp-b00010020001000200002100000002010100021000010100001000000020121101000020000100000\"/><path id=\"dead-bug-n-e-foot.l\" d=\"~#o2DP*1H-w2*P!1OBw2y4Vcx7IiRmIrJ2X_2V9HK2OaHD1O1FoD2JH1TdPaO9-tNoFo000210101000000000000001210100000000000000000000\"/><path id=\"dead-bug-n-e-shcap.l\" d=\"~~wXnYE(1UP10\"/><path id=\"dead-bug-n-e-upper.l\" d=\"^4\"/><path id=\"dead-bug-n-e-elbowcap.l\" d=\"^5\"/><path id=\"dead-bug-n-e-fore.l\" d=\"^6\"/><path id=\"dead-bug-n-e-palm.l\" d=\"^7\"/><path id=\"dead-bug-n-e-head\" d=\"~#w12!xfJFw2IGfT!x2UoDcSfFfgYbW5P1x6F7B8HbVfFo.dfV8Y4H6HixiXhKdIjX3)ky9Vn!iV40002002000001000020200100010100110120001202200020000000000001200\"/><path id=\"dead-bug-n-e-torso\" d=\"~#_12HzkWAw2VTiTHw2TjFfY4!jDnx8Y7X8(hOasO6TkuT9A2A6Yc.8IeXbViOlVh-lTcVaB2RdwcGr!z1Vnyi!z1oR1*fXg)bN8)1-9UbY5Fh!jJ9Eb.1T4A4DpI9(-1HB220200000000010000000000011020000210000200000000000000000110000000001012200002000000002000020000000000000101010002000\"/><path id=\"dead-bug-n-e-thigh.r\" d=\"^0\"/><path id=\"dead-bug-n-e-kneecap.r\" d=\"^1\"/><path id=\"dead-bug-n-e-shank.r\" d=\"^2\"/><path id=\"dead-bug-n-e-foot.r\" d=\"^3\"/><path id=\"dead-bug-n-e-shcap.r\" d=\"^12\"/><path id=\"dead-bug-n-e-upper.r\" d=\"~#F12FxpSX!1EBqXT!1y9n0cOO1W8N6J2D3y1JE1kDkW7SgE2NhTc!B1.a_2.1S5*3zP1(307_8X1vIgRrGaOm(2-nDh10000010020101000000001000020001000011100000000020200000220010220010100000000010\"/><path id=\"dead-bug-n-e-elbowcap.r\" d=\"~~A-eNO)1Wz11\"/><path id=\"dead-bug-n-e-fore.r\" d=\"~#F12!XfNH(1KUgVG(1SaaX1y1BI1F9!9H2P2H1Fx1*3YdD5FbO1(bT8yx1-4A2*1!8-4)I1H2x2fAaz3B1Eaxl.7GhF2EiDd00200000200000000001110101002000010001001000100000002010100100000000120000002022\"/><path id=\"dead-bug-n-e-palm.r\" d=\"~#o2wO8NW)1KY9Ey)1)9K8P8-2Fg_2Fk-6(d.1!k.1Wfz2w8)5V8D1BD1Kj-gD2000002002000020001210000020021000010101011210101\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dead-bug-n-dots)\"/>\n  <path class=\"floorline\" d=\"M16 339.5H342\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dead-bug-n-st-thigh.l\"/><use href=\"#dead-bug-n-st-kneecap.l\"/><use href=\"#dead-bug-n-st-shank.l\"/><use href=\"#dead-bug-n-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#dead-bug-n-st-thigh.l\"/><use href=\"#dead-bug-n-st-kneecap.l\"/><use href=\"#dead-bug-n-st-shank.l\"/><use href=\"#dead-bug-n-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dead-bug-n-st-upper.r\"/><use href=\"#dead-bug-n-st-elbowcap.r\"/><use href=\"#dead-bug-n-st-fore.r\"/><use href=\"#dead-bug-n-st-palm.r\"/></g><g class=\"u-fill\"><use href=\"#dead-bug-n-st-upper.r\"/><use href=\"#dead-bug-n-st-elbowcap.r\"/><use href=\"#dead-bug-n-st-fore.r\"/><use href=\"#dead-bug-n-st-palm.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dead-bug-n-e-thigh.l\"/><use href=\"#dead-bug-n-e-kneecap.l\"/><use href=\"#dead-bug-n-e-shank.l\"/><use href=\"#dead-bug-n-e-foot.l\"/><use href=\"#dead-bug-n-e-shcap.l\"/><use href=\"#dead-bug-n-e-upper.l\"/><use href=\"#dead-bug-n-e-elbowcap.l\"/><use href=\"#dead-bug-n-e-fore.l\"/><use href=\"#dead-bug-n-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#dead-bug-n-e-thigh.l\"/><use href=\"#dead-bug-n-e-kneecap.l\"/><use href=\"#dead-bug-n-e-shank.l\"/><use href=\"#dead-bug-n-e-foot.l\"/><use href=\"#dead-bug-n-e-shcap.l\"/><use href=\"#dead-bug-n-e-upper.l\"/><use href=\"#dead-bug-n-e-elbowcap.l\"/><use href=\"#dead-bug-n-e-fore.l\"/><use href=\"#dead-bug-n-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dead-bug-n-e-head\"/><use href=\"#dead-bug-n-e-torso\"/><use href=\"#dead-bug-n-e-thigh.r\"/><use href=\"#dead-bug-n-e-kneecap.r\"/><use href=\"#dead-bug-n-e-shank.r\"/><use href=\"#dead-bug-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dead-bug-n-e-head\"/><use href=\"#dead-bug-n-e-torso\"/><use href=\"#dead-bug-n-e-thigh.r\"/><use href=\"#dead-bug-n-e-kneecap.r\"/><use href=\"#dead-bug-n-e-shank.r\"/><use href=\"#dead-bug-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dead-bug-n-e-shcap.r\"/><use href=\"#dead-bug-n-e-upper.r\"/><use href=\"#dead-bug-n-e-elbowcap.r\"/><use href=\"#dead-bug-n-e-fore.r\"/><use href=\"#dead-bug-n-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#dead-bug-n-e-shcap.r\"/><use href=\"#dead-bug-n-e-upper.r\"/><use href=\"#dead-bug-n-e-elbowcap.r\"/><use href=\"#dead-bug-n-e-fore.r\"/><use href=\"#dead-bug-n-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"129.22\" cy=\"318.68\" r=\"2.25\"/><circle class=\"joint\" cx=\"81.41\" cy=\"325.03\" r=\"2.25\"/><circle class=\"joint\" cx=\"193.82\" cy=\"319.5\" r=\"2.25\"/><circle class=\"joint\" cx=\"193.82\" cy=\"255.97\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#Y20PxowOK1OUoGKK12m2m4k6m6k4m8k6kak8kakaickagekcgeiegegggeeieieeekciaiek8ick8k8kam4i8o6i4o4k2m4m2k0o2k100021010000000000000001000000011100000000000000101002000010200000010100000100000101000010120001010002001001012000002100000000000000100101200011110000001110000000010000000001100\"/><path class=\"arrow\" d=\"~MDP8wNw2LIkTA1L_-1wz1Z\"/></g><path class=\"leader\" d=\"~M(Ux1YB!1L0EOe\"/><circle class=\"anchor\" cx=\"172.31\" cy=\"308.12\" r=\"1.5\"/><path class=\"leader\" d=\"M201.82 249.97L253 208H263\"/><circle class=\"anchor\" cx=\"201.82\" cy=\"249.97\" r=\"1.5\"/><path class=\"leader\" d=\"M289.06 319.44L290.84 292H280.84\"/><circle class=\"anchor\" cx=\"289.06\" cy=\"319.44\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dead-bug-n-lowback\" data-key=\"lowback\" data-cue=\"Keep your low back flat on the mat every rep.\" class=\"plate-callout two\" style=\"left:38.55%;top:54.19%\" aria-pressed=\"true\">Low back<br>down</button><button type=\"button\" id=\"dead-bug-n-knees\" data-key=\"knees\" data-cue=\"Knees bent 90 degrees, right over your hips.\" class=\"plate-callout two\" style=\"left:72.07%;top:51.96%\" aria-pressed=\"false\">Knees over<br>hips</button><button type=\"button\" id=\"dead-bug-n-opposite\" data-key=\"opposite\" data-cue=\"Lower one arm and the opposite leg together until hand and heel lightly touch.\" class=\"plate-callout two\" style=\"left:59.78%;top:75.42%\" aria-pressed=\"false\">Opposite<br>limbs</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"dead-bug-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dead-bug-m-st-thigh.l\" d=\"^0\"/><path id=\"dead-bug-m-st-kneecap.l\" d=\"^1\"/><path id=\"dead-bug-m-st-shank.l\" d=\"^2\"/><path id=\"dead-bug-m-st-foot.l\" d=\"^3\"/><path id=\"dead-bug-m-st-upper.r\" d=\"^4\"/><path id=\"dead-bug-m-st-elbowcap.r\" d=\"^5\"/><path id=\"dead-bug-m-st-fore.r\" d=\"^6\"/><path id=\"dead-bug-m-st-palm.r\" d=\"^7\"/><path id=\"dead-bug-m-e-thigh.l\" d=\"^8\"/><path id=\"dead-bug-m-e-kneecap.l\" d=\"^9\"/><path id=\"dead-bug-m-e-shank.l\" d=\"^10\"/><path id=\"dead-bug-m-e-foot.l\" d=\"^11\"/><path id=\"dead-bug-m-e-shcap.l\" d=\"^12\"/><path id=\"dead-bug-m-e-upper.l\" d=\"^4\"/><path id=\"dead-bug-m-e-elbowcap.l\" d=\"^5\"/><path id=\"dead-bug-m-e-fore.l\" d=\"^6\"/><path id=\"dead-bug-m-e-palm.l\" d=\"^7\"/><path id=\"dead-bug-m-e-head\" d=\"^13\"/><path id=\"dead-bug-m-e-torso\" d=\"^14\"/><path id=\"dead-bug-m-e-thigh.r\" d=\"^0\"/><path id=\"dead-bug-m-e-kneecap.r\" d=\"^1\"/><path id=\"dead-bug-m-e-shank.r\" d=\"^2\"/><path id=\"dead-bug-m-e-foot.r\" d=\"^3\"/><path id=\"dead-bug-m-e-shcap.r\" d=\"^12\"/><path id=\"dead-bug-m-e-upper.r\" d=\"^15\"/><path id=\"dead-bug-m-e-elbowcap.r\" d=\"^16\"/><path id=\"dead-bug-m-e-fore.r\" d=\"^17\"/><path id=\"dead-bug-m-e-palm.r\" d=\"^18\"/><path id=\"dead-bug-m-m-torso\" d=\"~#_12HzkWAw2VTiTHw2TjFfY4!jDnx8Y7X8(hOaHaOrRH1U2*1!z1P6Acz5zg*6*kOgKmBiOh-9V4xgJ8zz1DsIr_bEmJ8!gPvDR2KI1KR1X5-9UbY5Fh!jJ9Eb.1T4A4DpI9(-1HB220200000000010000000000001000210000020000000110020000000000000200000000010110000001012000020000000000000101010002000\"/><path id=\"dead-bug-m-mf-head\" d=\"^13\"/><path id=\"dead-bug-m-mf-thigh.l\" d=\"~#F12UED1(Sw2-XA1GTw2xcu0H1S)1w1O7T6X3)2OV1O6ImxeIkK1zoYa.V1E1B4N2G8P5y)1y84E1XbV2BeUuWE1ApJA1U2_H1Bj00010120001001001100000001000020000100000000000000001200020000010000000000020000\"/><path id=\"dead-bug-m-mf-kneecap.l\" d=\"~~!IR1Wx)1JK10\"/><path id=\"dead-bug-m-mf-shank.l\" d=\"~#F12!VS1SPw2KDR1GGw2XbX22E1()19K7T6.3x3.z2x1EdI8zcrEeJ6Kz2T8B4S2I8J5H)1S93D1xcw1!a_dwoAf(lU1!pTb00210010101000000000100020000011000100100012000000020001111000000000001210000002\"/><path id=\"dead-bug-m-mf-foot.l\" d=\"~#o2Hx(1YYw2Gy*1VAw2F4Tc.6KiGmRrD3X_2IaFK2*aDD1T1FoY1JH1VdNaE9*tFoPo012002010120000010001001100020001200020010001011\"/><path id=\"dead-bug-m-mf-shcap.l\" d=\"^12\"/><path id=\"dead-bug-m-mf-upper.l\" d=\"^4\"/><path id=\"dead-bug-m-mf-elbowcap.l\" d=\"^5\"/><path id=\"dead-bug-m-mf-fore.l\" d=\"^6\"/><path id=\"dead-bug-m-mf-palm.l\" d=\"^7\"/><path id=\"dead-bug-m-mf-thigh.r\" d=\"~#F12w.F1HB(1-(F1*U)1_1!bH10R3O)1)5(7-2(3R2!V1OcFn0PkPcFnS2!V1Y2(3A6(7P3O)1G10-1!bUvwcDmKG10IA1BmKG100101000020000002001010000010000000001101001010020000002100000000011110000011100\"/><path id=\"dead-bug-m-mf-kneecap.r\" d=\"~~_)A1FYR1JK10\"/><path id=\"dead-bug-m-mf-shank.r\" d=\"~#F12DKD1FET1I*A1KzT1.b-11G1Y)1*4.7)5x4-2-z2_3-dK7zc0-dN7-z2-3x4_2.7w6Y)1w51D1.b!1_bwdwpJdwm0wpId00002111101101002210100001000000000200000010102000021010102002001001100000100210\"/><path id=\"dead-bug-m-mf-foot.r\" d=\"~#o2FYR1NVS1.XP1TzS1H3*cz8.hIo.pB3X_2-4YK2B8!D12Jo_4AH1*cHbIbBtwqYm000000001012000200002110100200000001010000022010\"/><path id=\"dead-bug-m-mf-shcap.r\" d=\"^12\"/><path id=\"dead-bug-m-mf-upper.r\" d=\"^15\"/><path id=\"dead-bug-m-mf-elbowcap.r\" d=\"^16\"/><path id=\"dead-bug-m-mf-fore.r\" d=\"^17\"/><path id=\"dead-bug-m-mf-palm.r\" d=\"^18\"/><path id=\"dead-bug-m-mo-0\" d=\"^13\"/><path id=\"dead-bug-m-mo-1\" d=\"^14\"/><path id=\"dead-bug-m-mo-2\" d=\"^8\"/><path id=\"dead-bug-m-mo-3\" d=\"^9\"/><path id=\"dead-bug-m-mo-4\" d=\"^10\"/><path id=\"dead-bug-m-mo-5\" d=\"^11\"/><path id=\"dead-bug-m-mo-6\" d=\"^12\"/><path id=\"dead-bug-m-mo-7\" d=\"^4\"/><path id=\"dead-bug-m-mo-8\" d=\"^5\"/><path id=\"dead-bug-m-mo-9\" d=\"^6\"/><path id=\"dead-bug-m-mo-10\" d=\"^7\"/><path id=\"dead-bug-m-mo-11\" d=\"^0\"/><path id=\"dead-bug-m-mo-12\" d=\"^1\"/><path id=\"dead-bug-m-mo-13\" d=\"^2\"/><path id=\"dead-bug-m-mo-14\" d=\"^3\"/><path id=\"dead-bug-m-mo-15\" d=\"^12\"/><path id=\"dead-bug-m-mo-16\" d=\"^15\"/><path id=\"dead-bug-m-mo-17\" d=\"^16\"/><path id=\"dead-bug-m-mo-18\" d=\"^17\"/><path id=\"dead-bug-m-mo-19\" d=\"^18\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#dead-bug-m-dots)\"/>\n  <path class=\"floorline\" d=\"^19\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dead-bug-m-st-thigh.l\"/><use href=\"#dead-bug-m-st-kneecap.l\"/><use href=\"#dead-bug-m-st-shank.l\"/><use href=\"#dead-bug-m-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#dead-bug-m-st-thigh.l\"/><use href=\"#dead-bug-m-st-kneecap.l\"/><use href=\"#dead-bug-m-st-shank.l\"/><use href=\"#dead-bug-m-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dead-bug-m-st-upper.r\"/><use href=\"#dead-bug-m-st-elbowcap.r\"/><use href=\"#dead-bug-m-st-fore.r\"/><use href=\"#dead-bug-m-st-palm.r\"/></g><g class=\"u-fill\"><use href=\"#dead-bug-m-st-upper.r\"/><use href=\"#dead-bug-m-st-elbowcap.r\"/><use href=\"#dead-bug-m-st-fore.r\"/><use href=\"#dead-bug-m-st-palm.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dead-bug-m-e-thigh.l\"/><use href=\"#dead-bug-m-e-kneecap.l\"/><use href=\"#dead-bug-m-e-shank.l\"/><use href=\"#dead-bug-m-e-foot.l\"/><use href=\"#dead-bug-m-e-shcap.l\"/><use href=\"#dead-bug-m-e-upper.l\"/><use href=\"#dead-bug-m-e-elbowcap.l\"/><use href=\"#dead-bug-m-e-fore.l\"/><use href=\"#dead-bug-m-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#dead-bug-m-e-thigh.l\"/><use href=\"#dead-bug-m-e-kneecap.l\"/><use href=\"#dead-bug-m-e-shank.l\"/><use href=\"#dead-bug-m-e-foot.l\"/><use href=\"#dead-bug-m-e-shcap.l\"/><use href=\"#dead-bug-m-e-upper.l\"/><use href=\"#dead-bug-m-e-elbowcap.l\"/><use href=\"#dead-bug-m-e-fore.l\"/><use href=\"#dead-bug-m-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dead-bug-m-e-head\"/><use href=\"#dead-bug-m-e-torso\"/><use href=\"#dead-bug-m-e-thigh.r\"/><use href=\"#dead-bug-m-e-kneecap.r\"/><use href=\"#dead-bug-m-e-shank.r\"/><use href=\"#dead-bug-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dead-bug-m-e-head\"/><use href=\"#dead-bug-m-e-torso\"/><use href=\"#dead-bug-m-e-thigh.r\"/><use href=\"#dead-bug-m-e-kneecap.r\"/><use href=\"#dead-bug-m-e-shank.r\"/><use href=\"#dead-bug-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dead-bug-m-e-shcap.r\"/><use href=\"#dead-bug-m-e-upper.r\"/><use href=\"#dead-bug-m-e-elbowcap.r\"/><use href=\"#dead-bug-m-e-fore.r\"/><use href=\"#dead-bug-m-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#dead-bug-m-e-shcap.r\"/><use href=\"#dead-bug-m-e-upper.r\"/><use href=\"#dead-bug-m-e-elbowcap.r\"/><use href=\"#dead-bug-m-e-fore.r\"/><use href=\"#dead-bug-m-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"129.22\" cy=\"318.68\" r=\"2.25\"/><circle class=\"joint\" cx=\"81.41\" cy=\"325.03\" r=\"2.25\"/><circle class=\"joint\" cx=\"193.82\" cy=\"319.5\" r=\"2.25\"/><circle class=\"joint\" cx=\"193.82\" cy=\"255.97\" r=\"2.25\"/></g><mask id=\"dead-bug-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#dead-bug-m-mf-head\" fill=\"#000\"/><use href=\"#dead-bug-m-m-torso\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-shank.l\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-foot.l\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-upper.l\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-fore.l\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-palm.l\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-shank.r\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-foot.r\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-upper.r\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-fore.r\" fill=\"#000\"/><use href=\"#dead-bug-m-mf-palm.r\" fill=\"#000\"/><use href=\"#dead-bug-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#dead-bug-m-mmask)\"><g class=\"u-stroke\"><use href=\"#dead-bug-m-m-torso\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MP!x1YDy2L0EH1MYiwpLXi)oL0wS1\"/><path class=\"m-line\" d=\"~M_RuWxy2LU4G1L20L12L01L02L01L00L02L01L02L01L00L22L11L0dL0bL01L00L02L01L02L01L00L22L11L0w3L0eL00L00L02L01L00L00L00L20L1iL0cL01L00L02L01L00L02L01L00L22L11L0E1L00L01L00L02\"/><path class=\"leader m\" d=\"~MP!x1Nyw2L0*wg\"/></g>\n<g class=\"plate-zoom\" data-view=\"mistake\" data-k=\"2\" data-c=\"62 252\" data-src=\"173.72 331.32\"><defs><clipPath id=\"dead-bug-m-zclip\"><circle cx=\"62\" cy=\"252\" r=\"52\"/></clipPath></defs><circle class=\"pz-src\" cx=\"173.72\" cy=\"331.32\" r=\"26\"/><path class=\"pz-link\" d=\"~MF-tUY*1LXJ9OV6\"/><circle class=\"pz-bg\" cx=\"62\" cy=\"252\" r=\"52\"/><g class=\"pz-in\" clip-path=\"url(#dead-bug-m-zclip)\">\n  <defs><pattern id=\"dead-bug-m-z-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"dead-bug-m-z-st-thigh.l\" d=\"~#F12A_oHTJ1XxpTSO1W3_nP22)6z)3zc(fR5!7z5YI3)oPN10wG1wpPN1A5YI3S5!7Ac(fy7z)3R22V3_nD)1!nNJ1-S20XF2IJ1-S210100000100000000000000002200100000100020010002000000000101000000000000020000000\"/><path id=\"dead-bug-m-z-st-kneecap.l\" d=\"~~YzhA-jY_20\"/><path id=\"dead-bug-m-z-st-shank.l\" d=\"~#F12P(jAXm-(gOOm*nV32O2P)3.9.fzcx8R5TE4U7Tr.eEo2TrYeTE4O7x8P5.fAcP)3_92S2*nW3Wn(pwS1!qwJ10wS1.q00000020000100200101112000000100000000002010010020010000220000000002000000000000\"/><path id=\"dead-bug-m-z-st-foot.l\" d=\"~#o2SUH1PTlVTF1.OkN6.pEgVz1RP1.T1O6OV5V9U.4EgYK20UP1W9FU2.pYmVmI_1_T1JK1200000000000200000000001100110101100200000111001\"/><path id=\"dead-bug-m-z-st-upper.r\" d=\"M-11.47 226.73C-10.5 222.82 -11.24 218.53 -11.17 215.16C-11.09 211.78 -11.05 209.37 -11.01 206.48C-10.98 203.58 -10.84 203.26 -10.95 197.79C-11.06 192.33 -11.26 181.39 -11.67 173.68C-12.08 165.96 -12.75 158.72 -13.41 151.49C-14.07 144.26 -14.57 135.26 -15.62 130.27C-16.67 125.27 -17.8 123.43 -19.7 121.53C-21.6 119.63 -24.59 118.86 -27.03 118.86C-29.48 118.86 -32.46 119.63 -34.37 121.53C-36.27 123.43 -37.39 125.27 -38.44 130.27C-39.49 135.26 -39.99 144.26 -40.65 151.49C-41.31 158.72 -41.98 165.96 -42.39 173.68C-42.8 181.39 -43 192.33 -43.11 197.79C-43.22 203.26 -43.09 203.58 -43.05 206.48C-43.02 209.37 -42.97 211.78 -42.9 215.16C-42.82 218.53 -43.57 222.82 -42.59 226.73C-41.61 230.65 -39.63 236.06 -37.03 238.65C-34.44 241.24 -30.37 242.29 -27.03 242.29C-23.7 242.29 -19.62 241.24 -17.03 238.65C-14.44 236.06 -12.45 230.65 -11.47 226.73Z\"/><path id=\"dead-bug-m-z-st-elbowcap.r\" d=\"M-38.44 130.27a11.41 11.41 0 1 0 22.82 0a11.41 11.41 0 1 0 -22.82 0Z\"/><path id=\"dead-bug-m-z-st-fore.r\" d=\"M-15.1 130.27C-14.23 127.23 -14.36 123.65 -14.13 121.18C-13.9 118.71 -13.81 117.45 -13.72 115.43C-13.62 113.41 -13.42 113.53 -13.55 109.07C-13.68 104.6 -14 94.93 -14.51 88.62C-15.02 82.31 -15.83 76.89 -16.62 71.21C-17.41 65.53 -18.35 58.32 -19.25 54.55C-20.15 50.78 -20.73 49.88 -22.03 48.59C-23.33 47.29 -25.36 46.77 -27.03 46.77C-28.7 46.77 -30.74 47.29 -32.03 48.59C-33.33 49.88 -33.91 50.78 -34.81 54.55C-35.71 58.32 -36.65 65.53 -37.45 71.21C-38.24 76.89 -39.04 82.31 -39.55 88.62C-40.07 94.93 -40.38 104.6 -40.52 109.07C-40.65 113.53 -40.44 113.41 -40.35 115.43C-40.25 117.45 -40.16 118.71 -39.93 121.18C-39.7 123.65 -39.83 127.23 -38.96 130.27C-38.09 133.3 -36.69 137.42 -34.7 139.41C-32.71 141.39 -29.59 142.2 -27.03 142.2C-24.48 142.2 -21.35 141.39 -19.36 139.41C-17.38 137.42 -15.98 133.3 -15.1 130.27Z\"/><path id=\"dead-bug-m-z-st-palm.r\" d=\"M-19.25 54.55C-18.73 51.76 -22.88 45.68 -23.92 40.54C-24.96 35.41 -25.04 28.88 -25.48 23.74C-25.91 18.61 -25.91 13.57 -26.51 9.74C-27.12 5.91 -28.46 2.64 -29.11 0.78C-29.75 -1.09 -29.97 -1.46 -30.4 -1.46C-30.83 -1.46 -31.22 -1.09 -31.7 0.78C-32.17 2.64 -32.74 5.91 -33.26 9.74C-33.77 13.57 -34.55 18.61 -34.81 23.74C-35.07 28.88 -34.81 35.41 -34.81 40.54C-34.81 45.68 -36.11 51.76 -34.81 54.55C-33.51 57.34 -29.62 57.27 -27.03 57.27C-24.44 57.27 -19.77 57.34 -19.25 54.55Z\"/><path id=\"dead-bug-m-z-e-thigh.l\" d=\"~#F12_UjSNR1EVgBPR1*nA27S2H)3sxfxdT7x6BI3.b.J1Xr-F1T2zP1ymXI3R1E8w5TgDbJ(3!e4O2OnB5XrU*1_O2PR1UF2P4NV2BE102200011000021000000000100022020010111000021000000000010000121000010000110000000\"/><path id=\"dead-bug-m-z-e-kneecap.l\" d=\"~~J!G1YAN1Y_20\"/><path id=\"dead-bug-m-z-e-shank.l\" d=\"~#F12FRJ1SyR1BSG1*UP1VnE54O2ww4.1BfxdR7z6*E4pTqOgEoR1KsAd*D4xgG8y5VgAbW(3Yh3P2xoD2(lNrHP1!t!I1W2ST1Tn00001100002000010121000000021001011002000100101000111001000000001000010101121002\"/><path id=\"dead-bug-m-z-e-foot.l\" d=\"~#o2AFz2FJR1TGx2TAP1y8Op*dRA1GK1-W1!4RV5KjW_4xlUJ2*2SP1J4WU2Erwl)iT.1!P1SP1000100000000000000101010100000100000200000000020\"/><path id=\"dead-bug-m-z-e-shcap.l\" d=\"M-42.59 226.73a15.56 15.56 0 1 0 31.12 0a15.56 15.56 0 1 0 -31.12 0Z\"/><path id=\"dead-bug-m-z-e-upper.l\" d=\"^42\"/><path id=\"dead-bug-m-z-e-elbowcap.l\" d=\"^43\"/><path id=\"dead-bug-m-z-e-fore.l\" d=\"^44\"/><path id=\"dead-bug-m-z-e-palm.l\" d=\"^45\"/><path id=\"dead-bug-m-z-e-head\" d=\"M-131.26 247.41C-132.44 242.88 -134.19 235.62 -133.67 230.7C-133.16 225.77 -130.84 221.33 -128.18 217.87C-125.53 214.41 -121.25 211.94 -117.74 209.92C-114.23 207.9 -110.95 207.06 -107.11 205.75C-103.26 204.44 -98.49 202.9 -94.67 202.06C-90.85 201.21 -87.25 200.53 -84.18 200.68C-81.12 200.82 -78.09 200.88 -76.29 202.92C-74.5 204.96 -73.65 209.6 -73.44 212.9C-73.23 216.21 -74.02 219.22 -75.01 222.75C-76 226.29 -78.25 229.34 -79.36 234.1C-80.48 238.86 -79.96 246.54 -81.71 251.34C-83.45 256.13 -86.4 260.06 -89.83 262.87C-93.25 265.68 -97.91 267.55 -102.26 268.21C-106.6 268.86 -111.82 268.54 -115.88 266.82C-119.94 265.1 -124.04 261.11 -126.6 257.88C-129.16 254.64 -130.08 251.94 -131.26 247.41Z\"/><path id=\"dead-bug-m-z-e-torso\" d=\"M-79.61 246.24C-75.56 250.34 -68.4 244.15 -64.37 244.33C-60.34 244.51 -58.65 245.26 -55.41 247.31C-52.17 249.37 -49.66 253.97 -44.93 256.65C-40.2 259.34 -33.42 261.62 -27.04 263.41C-20.66 265.19 -14.4 266.61 -6.65 267.37C1.1 268.13 10.71 268.11 19.46 267.96C28.22 267.81 38.17 266.94 45.87 266.5C53.57 266.05 59.59 265.58 65.67 265.3C71.76 265.02 76.49 264.29 82.39 264.8C88.29 265.32 95.32 267.96 101.07 268.39C106.83 268.82 112.25 268.71 116.91 267.37C121.56 266.03 126.11 263.65 128.99 260.37C131.87 257.1 133.62 252.6 134.19 247.7C134.76 242.81 133.56 236.69 132.4 231C131.23 225.32 129.66 218.76 127.2 213.6C124.74 208.45 122.3 202.66 117.66 200.05C113.03 197.45 106.74 197.7 99.39 197.97C92.03 198.24 80.24 200.4 73.53 201.67C66.83 202.95 64.03 205.15 59.15 205.61C54.28 206.07 50.12 205.47 44.26 204.45C38.41 203.42 30.32 201.23 24.02 199.46C17.73 197.68 12.86 195.07 6.49 193.81C0.12 192.55 -7.6 191.62 -14.19 191.9C-20.78 192.18 -27.82 193.79 -33.04 195.49C-38.26 197.19 -40.75 199.99 -45.51 202.09C-50.27 204.19 -55.99 205.87 -61.6 208.09C-67.2 210.31 -74.65 213.46 -79.16 215.4C-83.67 217.34 -88.57 214.59 -88.65 219.73C-88.72 224.87 -83.65 242.14 -79.61 246.24Z\"/><path id=\"dead-bug-m-z-e-thigh.r\" d=\"^38\"/><path id=\"dead-bug-m-z-e-kneecap.r\" d=\"^39\"/><path id=\"dead-bug-m-z-e-shank.r\" d=\"^40\"/><path id=\"dead-bug-m-z-e-foot.r\" d=\"^41\"/><path id=\"dead-bug-m-z-e-shcap.r\" d=\"^50\"/><path id=\"dead-bug-m-z-e-upper.r\" d=\"M-29.08 211.31C-33.09 210.86 -37.24 212.16 -40.59 212.53C-43.95 212.9 -46.35 213.17 -49.22 213.52C-52.09 213.86 -52.43 213.77 -57.83 214.6C-63.24 215.43 -74.05 217.06 -81.65 218.48C-89.24 219.9 -96.33 221.52 -103.41 223.13C-110.5 224.73 -119.35 226.41 -124.16 228.11C-128.97 229.81 -130.65 231.16 -132.29 233.3C-133.92 235.43 -134.29 238.5 -133.97 240.92C-133.65 243.34 -132.49 246.21 -130.36 247.84C-128.22 249.48 -126.25 250.35 -121.16 250.73C-116.07 251.11 -107.09 250.43 -99.83 250.13C-92.57 249.83 -85.31 249.55 -77.61 248.94C-69.9 248.33 -59.04 247.09 -53.61 246.48C-48.17 245.87 -47.87 245.69 -45.01 245.28C-42.14 244.86 -39.76 244.5 -36.42 243.98C-33.08 243.46 -28.74 243.64 -24.99 242.16C-21.23 240.67 -16.13 237.99 -13.9 235.08C-11.67 232.17 -11.17 227.99 -11.61 224.69C-12.05 221.38 -13.62 217.48 -16.53 215.25C-19.44 213.02 -25.07 211.76 -29.08 211.31Z\"/><path id=\"dead-bug-m-z-e-elbowcap.r\" d=\"M-134.07 239.42a11.41 11.41 0 1 0 22.82 0a11.41 11.41 0 1 0 -22.82 0Z\"/><path id=\"dead-bug-m-z-e-fore.r\" d=\"M-124.23 227.6C-127.35 227.13 -130.88 227.73 -133.36 227.83C-135.85 227.93 -137.11 228 -139.12 228.17C-141.14 228.34 -141.04 228.12 -145.45 228.84C-149.86 229.56 -159.4 231.15 -165.59 232.48C-171.78 233.82 -177.05 235.33 -182.58 236.86C-188.1 238.4 -195.13 240.28 -198.74 241.67C-202.36 243.06 -203.17 243.75 -204.29 245.21C-205.4 246.66 -205.65 248.75 -205.43 250.4C-205.21 252.05 -204.43 254.01 -202.97 255.12C-201.52 256.23 -200.55 256.69 -196.7 257.09C-192.84 257.49 -185.57 257.47 -179.84 257.51C-174.1 257.55 -168.62 257.63 -162.3 257.31C-155.97 256.99 -146.35 256.03 -141.9 255.58C-137.46 255.12 -137.61 254.93 -135.62 254.57C-133.63 254.21 -132.39 253.96 -129.97 253.4C-127.55 252.85 -123.99 252.51 -121.09 251.25C-118.19 249.98 -114.3 248.05 -112.59 245.82C-110.88 243.59 -110.5 240.38 -110.83 237.85C-111.17 235.32 -112.38 232.33 -114.61 230.62C-116.84 228.91 -121.1 228.06 -124.23 227.6Z\"/><path id=\"dead-bug-m-z-e-palm.r\" d=\"M-198.74 241.67C-201.58 241.52 -207.06 246.43 -212.01 248.14C-216.97 249.84 -223.43 250.78 -228.46 251.89C-233.5 252.99 -238.5 253.66 -242.21 254.76C-245.92 255.86 -248.99 257.62 -250.75 258.51C-252.52 259.4 -252.86 259.66 -252.8 260.09C-252.75 260.52 -252.33 260.85 -250.41 261.08C-248.5 261.3 -245.19 261.43 -241.32 261.44C-237.46 261.45 -232.36 261.56 -227.24 261.14C-222.11 260.72 -215.67 259.61 -210.58 258.93C-205.49 258.26 -199.29 258.74 -196.7 257.09C-194.11 255.44 -194.68 251.59 -195.02 249.02C-195.36 246.45 -195.91 241.81 -198.74 241.67Z\"/><path id=\"dead-bug-m-z-m-torso\" d=\"M-79.61 246.24C-75.56 250.34 -68.4 244.15 -64.37 244.33C-60.34 244.51 -58.65 245.26 -55.41 247.31C-52.17 249.37 -49.66 253.97 -44.93 256.65C-40.2 259.34 -33.42 261.62 -27.04 263.41C-20.66 265.19 -14.4 266.61 -6.65 267.37C1.1 268.13 10.21 269.23 19.46 267.96C28.72 266.69 41.35 262.37 48.88 259.77C56.42 257.18 59.51 252.94 64.68 252.4C69.84 251.86 74.46 254.51 79.87 256.53C85.28 258.55 91.65 262.72 97.12 264.53C102.6 266.34 107.9 267.54 112.74 267.37C117.57 267.2 122.57 265.99 126.15 263.5C129.74 261.02 132.53 257.08 134.26 252.47C136 247.86 136.32 241.63 136.56 235.83C136.81 230.03 136.86 223.29 135.73 217.69C134.59 212.09 133.62 205.88 129.75 202.23C125.89 198.58 119.73 197.31 112.52 195.79C105.32 194.27 96.39 193.57 86.54 193.13C76.69 192.69 63.57 191.46 53.44 193.14C43.31 194.83 30.66 202.2 25.75 203.25C20.85 204.31 27.23 201.03 24.02 199.46C20.81 197.88 12.86 195.07 6.49 193.81C0.12 192.55 -7.6 191.62 -14.19 191.9C-20.78 192.18 -27.82 193.79 -33.04 195.49C-38.26 197.19 -40.75 199.99 -45.51 202.09C-50.27 204.19 -55.99 205.87 -61.6 208.09C-67.2 210.31 -74.65 213.46 -79.16 215.4C-83.67 217.34 -88.57 214.59 -88.65 219.73C-88.72 224.87 -83.65 242.14 -79.61 246.24Z\"/><path id=\"dead-bug-m-z-mf-head\" d=\"^51\"/><path id=\"dead-bug-m-z-mf-thigh.l\" d=\"~#F12wXkN)P1IXhEwR1xow23P2D)3y2)eBdO7z6)H3-cVJ1Gs-F1.2GP1UlVI3T2I8y5Tg!aA(3Ag8R2OnG5IsF*1NO2HS1UF2D5WV2KD120000000001000100000200000101002100210010000002100001021012000002100020000010101\"/><path id=\"dead-bug-m-z-mf-kneecap.l\" d=\"~~P)H1(!K1Y_20\"/><path id=\"dead-bug-m-z-mf-shank.l\" d=\"~#F12STK1Y_P1VUH1GJP1RnK56K2()3nxfBdO7B6*E4x2KqXgEoX1Rs_c-D4EhG8(4-gwbS(3!i3S2Bo(1YlUrwP1Hu!I1A3_T1zn01010100001010101001200002000000100000000001010010000100201010020000000000000000\"/><path id=\"dead-bug-m-z-mf-foot.l\" d=\"~#o2HHA2wIR1BJy2XyP1H8OpTdVA1-J1BX1S6OV5.kN_4VlPJ2O3NP1W3_U2KrYkOi-.1NP1(P1000001000002000200010100020101000020001000100000\"/><path id=\"dead-bug-m-z-mf-shcap.l\" d=\"^50\"/><path id=\"dead-bug-m-z-mf-upper.l\" d=\"^42\"/><path id=\"dead-bug-m-z-mf-elbowcap.l\" d=\"^43\"/><path id=\"dead-bug-m-z-mf-fore.l\" d=\"^44\"/><path id=\"dead-bug-m-z-mf-palm.l\" d=\"^45\"/><path id=\"dead-bug-m-z-mf-thigh.r\" d=\"~#F12Y*pFAJ1IBqRzO1W3_nP22)6z)3zc(fO5!7E5YI3*oPN10wG1wpPN1A5YI3S5!7Ac(fy7z)3R22V3_nD)1!nNJ1-S20XF2IJ1-S200000002002000000020000002000100002100020000002000200000120000000000000020200000\"/><path id=\"dead-bug-m-z-mf-kneecap.r\" d=\"~~JEiyHjY_20\"/><path id=\"dead-bug-m-z-mf-shank.r\" d=\"~#F12AylyFmKyiKwm.nV31O2S)3.9.fzc)7R5XE4U7Rr.eEo2Rr_eXE4T7)7S5.fAcS)3_91S2.nW3WnwqwS1YqwJ12wS1.q20200000100000200101000010002100022000100101010020000010020220200000010002000000\"/><path id=\"dead-bug-m-z-mf-foot.r\" d=\"~#o2FYI1NAlKXG1-wkP6.pBgVz1VP1.T1K6OV5V9U.4EgYK20UP1Y9FU2)pYmTmI_1!T1JK1000000000010000020000001000110000010002000210010\"/><path id=\"dead-bug-m-z-mf-shcap.r\" d=\"^50\"/><path id=\"dead-bug-m-z-mf-upper.r\" d=\"^53\"/><path id=\"dead-bug-m-z-mf-elbowcap.r\" d=\"^54\"/><path id=\"dead-bug-m-z-mf-fore.r\" d=\"^55\"/><path id=\"dead-bug-m-z-mf-palm.r\" d=\"^56\"/><path id=\"dead-bug-m-z-mo-0\" d=\"^51\"/><path id=\"dead-bug-m-z-mo-1\" d=\"^52\"/><path id=\"dead-bug-m-z-mo-2\" d=\"^46\"/><path id=\"dead-bug-m-z-mo-3\" d=\"^47\"/><path id=\"dead-bug-m-z-mo-4\" d=\"^48\"/><path id=\"dead-bug-m-z-mo-5\" d=\"^49\"/><path id=\"dead-bug-m-z-mo-6\" d=\"^50\"/><path id=\"dead-bug-m-z-mo-7\" d=\"^42\"/><path id=\"dead-bug-m-z-mo-8\" d=\"^43\"/><path id=\"dead-bug-m-z-mo-9\" d=\"^44\"/><path id=\"dead-bug-m-z-mo-10\" d=\"^45\"/><path id=\"dead-bug-m-z-mo-11\" d=\"^38\"/><path id=\"dead-bug-m-z-mo-12\" d=\"^39\"/><path id=\"dead-bug-m-z-mo-13\" d=\"^40\"/><path id=\"dead-bug-m-z-mo-14\" d=\"^41\"/><path id=\"dead-bug-m-z-mo-15\" d=\"^50\"/><path id=\"dead-bug-m-z-mo-16\" d=\"^53\"/><path id=\"dead-bug-m-z-mo-17\" d=\"^54\"/><path id=\"dead-bug-m-z-mo-18\" d=\"^55\"/><path id=\"dead-bug-m-z-mo-19\" d=\"^56\"/></defs>\n  \n  <path class=\"floorline\" d=\"M-253.47 267.87H398.52\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dead-bug-m-z-st-thigh.l\"/><use href=\"#dead-bug-m-z-st-kneecap.l\"/><use href=\"#dead-bug-m-z-st-shank.l\"/><use href=\"#dead-bug-m-z-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#dead-bug-m-z-st-thigh.l\"/><use href=\"#dead-bug-m-z-st-kneecap.l\"/><use href=\"#dead-bug-m-z-st-shank.l\"/><use href=\"#dead-bug-m-z-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dead-bug-m-z-st-upper.r\"/><use href=\"#dead-bug-m-z-st-elbowcap.r\"/><use href=\"#dead-bug-m-z-st-fore.r\"/><use href=\"#dead-bug-m-z-st-palm.r\"/></g><g class=\"u-fill\"><use href=\"#dead-bug-m-z-st-upper.r\"/><use href=\"#dead-bug-m-z-st-elbowcap.r\"/><use href=\"#dead-bug-m-z-st-fore.r\"/><use href=\"#dead-bug-m-z-st-palm.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#dead-bug-m-z-e-thigh.l\"/><use href=\"#dead-bug-m-z-e-kneecap.l\"/><use href=\"#dead-bug-m-z-e-shank.l\"/><use href=\"#dead-bug-m-z-e-foot.l\"/><use href=\"#dead-bug-m-z-e-shcap.l\"/><use href=\"#dead-bug-m-z-e-upper.l\"/><use href=\"#dead-bug-m-z-e-elbowcap.l\"/><use href=\"#dead-bug-m-z-e-fore.l\"/><use href=\"#dead-bug-m-z-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#dead-bug-m-z-e-thigh.l\"/><use href=\"#dead-bug-m-z-e-kneecap.l\"/><use href=\"#dead-bug-m-z-e-shank.l\"/><use href=\"#dead-bug-m-z-e-foot.l\"/><use href=\"#dead-bug-m-z-e-shcap.l\"/><use href=\"#dead-bug-m-z-e-upper.l\"/><use href=\"#dead-bug-m-z-e-elbowcap.l\"/><use href=\"#dead-bug-m-z-e-fore.l\"/><use href=\"#dead-bug-m-z-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dead-bug-m-z-e-head\"/><use href=\"#dead-bug-m-z-e-torso\"/><use href=\"#dead-bug-m-z-e-thigh.r\"/><use href=\"#dead-bug-m-z-e-kneecap.r\"/><use href=\"#dead-bug-m-z-e-shank.r\"/><use href=\"#dead-bug-m-z-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#dead-bug-m-z-e-head\"/><use href=\"#dead-bug-m-z-e-torso\"/><use href=\"#dead-bug-m-z-e-thigh.r\"/><use href=\"#dead-bug-m-z-e-kneecap.r\"/><use href=\"#dead-bug-m-z-e-shank.r\"/><use href=\"#dead-bug-m-z-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#dead-bug-m-z-e-shcap.r\"/><use href=\"#dead-bug-m-z-e-upper.r\"/><use href=\"#dead-bug-m-z-e-elbowcap.r\"/><use href=\"#dead-bug-m-z-e-fore.r\"/><use href=\"#dead-bug-m-z-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#dead-bug-m-z-e-shcap.r\"/><use href=\"#dead-bug-m-z-e-upper.r\"/><use href=\"#dead-bug-m-z-e-elbowcap.r\"/><use href=\"#dead-bug-m-z-e-fore.r\"/><use href=\"#dead-bug-m-z-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"-27.03\" cy=\"226.73\" r=\"2.25\"/><circle class=\"joint\" cx=\"-122.66\" cy=\"239.42\" r=\"2.25\"/><circle class=\"joint\" cx=\"102.16\" cy=\"228.37\" r=\"2.25\"/><circle class=\"joint\" cx=\"102.16\" cy=\"101.3\" r=\"2.25\"/></g><mask id=\"dead-bug-m-z-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#dead-bug-m-z-mf-head\" fill=\"#000\"/><use href=\"#dead-bug-m-z-m-torso\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-thigh.l\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-kneecap.l\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-shank.l\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-foot.l\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-shcap.l\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-upper.l\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-fore.l\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-palm.l\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-thigh.r\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-kneecap.r\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-shank.r\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-foot.r\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-shcap.r\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-upper.r\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-fore.r\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mf-palm.r\" fill=\"#000\"/><use href=\"#dead-bug-m-z-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#dead-bug-m-z-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#dead-bug-m-z-mmask)\"><g class=\"u-stroke\"><use href=\"#dead-bug-m-z-m-torso\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MYwcyEU1L0KU2MYiwpLXi)oL0wS1\"/><path class=\"m-line\" d=\"~MNI5!!T1LH9R2L10L00L01L02L00L20L11L02L00L00L00L21L12L0tL0pL00L20L11L02L00L00L00L20L11L0w6L0sL02L21L10L00L02L01L00L22L1w1L0oL00L01L22L10L01L02L00L01L22L10L0R2L01L00L20L10\"/></g>\n</g><circle class=\"pz-ring\" cx=\"62\" cy=\"252\" r=\"52\"/></g></svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"dead-bug-m-arch\" data-key=\"arch\" data-cue=\"Your low back arches off the mat as the arm and leg lower.\" class=\"plate-callout two m\" style=\"left:38.55%;top:57.54%\" aria-pressed=\"true\">Low back<br>arches</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "lowback",
        cues: [{ key: "lowback", cue: "Keep your low back flat on the mat every rep." }, { key: "knees", cue: "Knees bent 90 degrees, right over your hips." }, { key: "opposite", cue: "Lower one arm and the opposite leg together until hand and heel lightly touch." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "arch",
        cues: [{ key: "arch", cue: "Your low back arches off the mat as the arm and leg lower." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Low back arches</b><span>Your low back arches off the mat as the arm and leg lower.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower slow, return slow\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>Slow</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>Slow</span></div></div></div>",
      alt: "Dead bug, side view. Lying on the back with the low back on the mat, knees over the hips at 90 degrees and arms straight up, the lifter lowers one arm overhead and the opposite leg until hand and heel lightly touch the floor, then returns.",
      mistakeAlt: "Dead Bug: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c3, c4) is on setup steps 2 and 4 and the posture line lower."
  },
  contacts: [
    "floor-body"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Lie on your back on a mat.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-deadbug"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "position",
      "text": "Knees at 90 degrees over your hips, arms straight above your chest.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-deadbug",
          "ggr-deadbug"
        ],
        "note": "card c3"
      }
    },
    {
      "kind": "brace",
      "text": "Brace, press your lower back into the mat, shoulders down and back.",
      "zoom": "low-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-deadbug",
          "ggr-deadbug"
        ],
        "note": "card c3, c2"
      }
    },
    {
      "kind": "position",
      "text": "Breathe in and slowly lower one arm and the opposite leg.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-deadbug",
          "ggr-deadbug"
        ],
        "note": "card c4"
      }
    },
    {
      "kind": "position",
      "text": "Touch hand and heel lightly, without resting. Breathe out, return, switch sides.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-deadbug",
          "ggr-deadbug"
        ],
        "note": "card c4, c9"
      }
    }
  ],
  posture: [
    {
      "key": "lower",
      "label": "Opposite limbs",
      "detail": "Slowly lower one arm and the opposite leg toward the floor.",
      "anchor": {
        "pose": "end",
        "at": "wrist.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-deadbug",
          "ggr-deadbug"
        ],
        "note": "card c4"
      }
    },
    {
      "key": "touch",
      "label": "Light touch",
      "detail": "Hand and heel lightly touch the floor without resting.",
      "anchor": {
        "pose": "end",
        "at": "heel.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-deadbug",
          "ggr-deadbug"
        ],
        "note": "card c4"
      }
    },
    {
      "key": "return",
      "label": "Slow return",
      "detail": "Bring them back slowly, then switch sides.",
      "anchor": {
        "pose": "start",
        "at": "knee.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-deadbug",
          "ggr-deadbug"
        ],
        "note": "card c4"
      }
    },
    {
      "key": "breathe",
      "label": "Breathing",
      "detail": "Breathe in as you reach out, out as you return. Never hold your breath.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-deadbug",
          "ace-deadbug"
        ],
        "note": "card c9, c4"
      }
    },
    {
      "key": "low-back",
      "label": "Low back down",
      "detail": "The back stays flat on the mat. Press your lower back into it. If it lifts, finish the rep and rest.",
      "anchor": {
        "pose": "end",
        "at": "lumbar"
      },
      "zoom": "low-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-deadbug",
          "ace-deadbug"
        ],
        "note": "card c5, c6, c3, c7"
      }
    },
    {
      "key": "neck",
      "label": "Eyes up",
      "detail": "Stare straight up at the ceiling. Don't crane your neck to look at your legs.",
      "anchor": {
        "pose": "end",
        "at": "head"
      },
      "zoom": "neck",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-deadbug"
        ],
        "note": "card c8"
      }
    }
  ],
  zooms: [
    {
      "key": "low-back",
      "chip": "Low back",
      "heading": "Low back",
      "kind": "posture",
      "feelRow": "low-back"
    },
    {
      "key": "neck",
      "chip": "Neck",
      "heading": "Neck",
      "kind": "posture",
      "feelRow": "neck"
    }
  ],
  chips: [
    "low-back",
    "neck",
    "feel"
  ],
  copy: {
    "setupLine": "Hand and heel lightly touch the floor without resting. Bring them back slowly, then switch sides.",
    "mistakeLine": "Don't hold your breath. Breathe in as you reach out, out as you return.",
    "cueLine": "Low back on the mat."
  },
  mistakes: [],
  risks: [
    {
      "key": "arch",
      "text": "Arching your back could contribute to a back injury.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-deadbug"
        ],
        "note": "card c6"
      }
    },
    {
      "key": "neck",
      "text": "Looking down at your legs strains your neck.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-deadbug"
        ],
        "note": "card c8"
      }
    },
    {
      "key": "breath",
      "text": "Holding your breath? Breathe in as you reach out, out as you return.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-deadbug",
          "ace-deadbug"
        ],
        "note": "card c9"
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
    "ace-deadbug",
    "ggr-deadbug",
    "pereira-2017",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/dead_bug.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

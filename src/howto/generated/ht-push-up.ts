// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=6681e654b2f66aa2a615f0559a8f2368b5ccbeddecc619cf24e33ce6bc4caaf5
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_push_up",
  name: "Push-Up",
  hashes: { inputsSha256: "6681e654b2f66aa2a615f0559a8f2368b5ccbeddecc619cf24e33ce6bc4caaf5", golden: "e75ad6eadb8da0b4721b3b8c1dd0473dc9e3db1ea8d45a0fc81f1e3ce6a79042" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"push-up-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"push-up-n-st-thigh.l\" d=\"~#F12Sxw1wP.1BPx1zO.1Wbx14G1x(19H7J6Y3!2FU1_5!lPdwkF1JnXaSU1my4O2y8I5T*1E71F1PbP2Pdxu)D1xoIz1E2VG1Dj00100001010002000001200000100100000001000101200000200000222000000010000100101012\"/><path id=\"push-up-n-st-kneecap.l\" d=\"~~yNiwA*1FJ10\"/><path id=\"push-up-n-st-shank.l\" d=\"~#F12A*jFW.1OIl-!.1SbP21D1K(1w1N7N6W3!2Hy2cwdy8Ybo(dK6_x2Y7w4K2D8K5.*1R84E1Ybz1XaGdRnReIlG1BpSb00000101210002200200000020200002100101001010000000120020010100000011012000111110\"/><path id=\"push-up-n-st-foot.l\" d=\"~#o2U_8!R.1z-9BB!1*3Nc!6!hymUqE2UY2J9KI2DaKB1P1TnB2IG1FdBaH9wt.nRn000000200000110000001001000000000000100001000000\"/><path id=\"push-up-n-st-torso\" d=\"~#_12POS1_P*1V!T1x**1(6z94z3.hJ8*6y9OgWbdH6yo.4F9Tl*3.cY3ygw5!kPeAnFgJiD9H5Fg.6JA1XoPrI9cG6kK9TgUbx8W2W8Bc.6BgBkT7V6(5FaHdx8U2Oq*T200010000010001010000200101010000000200001010000200000100000010010000000000000000100101010000200000111100000100200000\"/><path id=\"push-up-n-st-thigh.r\" d=\"^0\"/><path id=\"push-up-n-st-kneecap.r\" d=\"^1\"/><path id=\"push-up-n-st-shank.r\" d=\"^2\"/><path id=\"push-up-n-st-foot.r\" d=\"^3\"/><path id=\"push-up-n-st-shcap.r\" d=\"~~PXI1(V(1NO10\"/><path id=\"push-up-n-st-upper.r\" d=\"~#F12HzK1WD*1T*K1TB*1U610c-y1(4U4!2H2D1(ly4FjN8DgB1WhGbAlI7w2O1D4R3zz1e1bS6tY8XgEqObxmU1zoNf00010000020101000201200000210100001011000100100121200201000000000010020001010100\"/><path id=\"push-up-n-st-elbowcap.r\" d=\"~~SGB1WD)1Yy12\"/><path id=\"push-up-n-st-fore.r\" d=\"~#F12YWB1(zw2VJB1.Y)1I3R4F10HkWa.1V51x2T6O5B6.c*8T6zex2E7X4*1i)51DgDgaD1E5X1Tg4J9(jYdwaWlD301001002001010001010112000121000012101001200000001110110000002001010000100000000\"/><path id=\"push-up-n-st-palm.r\" d=\"~#o2PNG1HXw2GPF1xGw2w6O9)5T1.a_4Oe)3T90Oeq.a0)5X4w60!lVnUg1101001000000000001000000000000000000101000010100\"/><path id=\"push-up-n-g0-shcap.r\" d=\"~~NVH1AA_1NO10\"/><path id=\"push-up-n-g0-upper.r\" d=\"~#F12FGI1S*Y1RwJ1)KY1(5X36a*sUnP55_23Jn-9!kX2DdK9F9-i_gxjy1R2w2B5-v_j37N5O4R2XhKsU3)h(cVcWp00000020000001001020022001210010100000010100002000000001200001000200010000101120\"/><path id=\"push-up-n-g0-elbowcap.r\" d=\"~~HAB1yJ(1Yy12\"/><path id=\"push-up-n-g0-fore.r\" d=\"~#F12YJB1AB)1ExB1XU(1X3I6N1cUn!j*1B71G2zcKd-3-dV7)7RdO4.c.cE20z7K2WiUocP1B6z4.cA1_5AlYbHc!k!602002201000000200010100000101000000001011000200101002000000100001000010000000000\"/><path id=\"push-up-n-g0-palm.r\" d=\"~#o2FPG1PKx2INF1KIx2H2)aI6mR8P8EfU1z9U3Rdy6Eaw4O7B2Y5B2HcGuPf*5010200010000000001200001012100000000100010000200\"/><path id=\"push-up-n-g1-shcap.r\" d=\"~~HKG1USV1NO10\"/><path id=\"push-up-n-g1-upper.r\" d=\"~#F12wUG1F_U1*AH1X)T1N4O684KjDB1H5.2U2O1YkXnwiVaJ8xeu.kybRt2)20x6KnYy1b5Y3*6GbKcOoWeKbyjG1Us00000000002000000000200100000200200000010100010000000000000000011101211010121002\"/><path id=\"push-up-n-g1-elbowcap.r\" d=\"~~STB1JT!1Yy12\"/><path id=\"push-up-n-g1-fore.r\" d=\"~#F12wXB1_B*1.JB1-N!1B3V8N1w1UmUvB1*8aT2Td)nhGeR5R9GcK7GeTnO2tB7K5UgAz16!1x6z7zaU2swmS8Se_iPb00101000100000000000000000000100001111000100100000000202000020000002001110020000\"/><path id=\"push-up-n-g1-palm.r\" d=\"~#o2DWG1yRx2GTF1*Px2(1EbK6A1O8w9TfS2G9A4Td!6OaU4X7V1!5T2!bBvAfX6010000002000200111111010010100100000010111011001\"/><path id=\"push-up-n-e-thigh.l\" d=\"~#F12FwsJXS1TItBDS1Uax59B1E_1PlA9J3P4N1(S1xdFpw5Aj*5AiGiNR1-h!2-3W5.7E!1(ecD1WbV1w2.w1)J1.8.x1PaBw1Uw101002200010001100000101010001000000000021001000000002020002000100000000022000001\"/><path id=\"push-up-n-e-kneecap.l\" d=\"~~DYf(RY1FJ10\"/><path id=\"push-up-n-e-shank.l\" d=\"~#F12(WgADX1TAi*.W1WbX1aF1)-1!mD9H3N4P1F(1xn(ew3HbO3Ya.aHw2)f(2V3W5*7.!1YdbE1Uax5XeX8BrG5OkH6KjWj00101110120001011100122000101210101001111000000001001011000010000100000001010000\"/><path id=\"push-up-n-e-foot.l\" d=\"~#o2UG6w)_1*J7GD.1mwdUcHeDuDhytWT2.h*G2R3RD1*6VmVg.B1_8Eewj!nXuVd011010000000200000100000002000001002000100011101\"/><path id=\"push-up-n-e-shcap.l\" d=\"~~y)E1DyR1NO10\"/><path id=\"push-up-n-e-upper.l\" d=\"~#F12y)E1DyR1))E1.(O1e.8c0F2AO1D3*5N1*2W5xD1(9Oi1Eg.9OiV5xD1K1*2z3*5I2AO190d.8)fvOdDp1FmSdDp00000100201200010100000101000010002000010100000101100200000120002021011010111110\"/><path id=\"push-up-n-e-elbowcap.l\" d=\"~~WIF1FF_1Yy12\"/><path id=\"push-up-n-e-fore.l\" d=\"~#F12AHF1FF_1xKF1RJ-1U1zaq_1N3(H1P3E9S1E2gVw1Y6Rc0zb-6RcbVw1V1E2K3E9K3(H1n_1X1za*95KaJj0whJaJj10001101210010000010100001000010001000010010100000000001010110000000001000000010\"/><path id=\"push-up-n-e-palm.l\" d=\"~#o2PNG1HXw2-zF1xGw2P8O9O8T1If_4Ok)3Td0OkqIf0O8X4P80Jy1VnUg1001001002000000001000000000000200000100000010100\"/><path id=\"push-up-n-e-head\" d=\"~#w12U!S1ABN1-WS1)RJ1VnRcTeGf9ObI5T1y6-6H8.awgznPdqU8G4T5ziAh(hPcFjy3SkO9_mTiy40121002000000220021210000100000020002000020200000000000020010101\"/><path id=\"push-up-n-e-torso\" d=\"~#_12A)K1wAN1VKO1R)K1D3*at)2XdAeG3wbIbWg!1A6YkzdA1KnG8VaD9YdAcYhSlNg_lSbNaY1YcEcHp*z1PmKi*1x6X2x9IbYgV6H5!3IeBc-cOl2E4_7Je!8T6J5OW1EB200010100000000101210000200100020001010020000011010000000001000111000000010002000001010002021010000110100220200120020\"/><path id=\"push-up-n-e-thigh.r\" d=\"^20\"/><path id=\"push-up-n-e-kneecap.r\" d=\"^21\"/><path id=\"push-up-n-e-shank.r\" d=\"^22\"/><path id=\"push-up-n-e-foot.r\" d=\"^23\"/><path id=\"push-up-n-e-shcap.r\" d=\"^24\"/><path id=\"push-up-n-e-upper.r\" d=\"^25\"/><path id=\"push-up-n-e-elbowcap.r\" d=\"^26\"/><path id=\"push-up-n-e-fore.r\" d=\"^27\"/><path id=\"push-up-n-e-palm.r\" d=\"^28\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#push-up-n-dots)\"/>\n  <path class=\"datum\" d=\"M237.2 244.35L-7.89 311.89\"/><path class=\"floorline\" d=\"M16 339.5H242.92\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#push-up-n-st-thigh.l\"/><use href=\"#push-up-n-st-kneecap.l\"/><use href=\"#push-up-n-st-shank.l\"/><use href=\"#push-up-n-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#push-up-n-st-thigh.l\"/><use href=\"#push-up-n-st-kneecap.l\"/><use href=\"#push-up-n-st-shank.l\"/><use href=\"#push-up-n-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#push-up-n-st-torso\"/><use href=\"#push-up-n-st-thigh.r\"/><use href=\"#push-up-n-st-kneecap.r\"/><use href=\"#push-up-n-st-shank.r\"/><use href=\"#push-up-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#push-up-n-st-torso\"/><use href=\"#push-up-n-st-thigh.r\"/><use href=\"#push-up-n-st-kneecap.r\"/><use href=\"#push-up-n-st-shank.r\"/><use href=\"#push-up-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#push-up-n-st-shcap.r\"/><use href=\"#push-up-n-st-upper.r\"/><use href=\"#push-up-n-st-elbowcap.r\"/><use href=\"#push-up-n-st-fore.r\"/><use href=\"#push-up-n-st-palm.r\"/></g><g class=\"u-fill\"><use href=\"#push-up-n-st-shcap.r\"/><use href=\"#push-up-n-st-upper.r\"/><use href=\"#push-up-n-st-elbowcap.r\"/><use href=\"#push-up-n-st-fore.r\"/><use href=\"#push-up-n-st-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#push-up-n-g0-shcap.r\"/><use href=\"#push-up-n-g0-upper.r\"/><use href=\"#push-up-n-g0-elbowcap.r\"/><use href=\"#push-up-n-g0-fore.r\"/><use href=\"#push-up-n-g0-palm.r\"/></g><g class=\"u-fill\"><use href=\"#push-up-n-g0-shcap.r\"/><use href=\"#push-up-n-g0-upper.r\"/><use href=\"#push-up-n-g0-elbowcap.r\"/><use href=\"#push-up-n-g0-fore.r\"/><use href=\"#push-up-n-g0-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#push-up-n-g1-shcap.r\"/><use href=\"#push-up-n-g1-upper.r\"/><use href=\"#push-up-n-g1-elbowcap.r\"/><use href=\"#push-up-n-g1-fore.r\"/><use href=\"#push-up-n-g1-palm.r\"/></g><g class=\"u-fill\"><use href=\"#push-up-n-g1-shcap.r\"/><use href=\"#push-up-n-g1-upper.r\"/><use href=\"#push-up-n-g1-elbowcap.r\"/><use href=\"#push-up-n-g1-fore.r\"/><use href=\"#push-up-n-g1-palm.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#push-up-n-e-thigh.l\"/><use href=\"#push-up-n-e-kneecap.l\"/><use href=\"#push-up-n-e-shank.l\"/><use href=\"#push-up-n-e-foot.l\"/><use href=\"#push-up-n-e-shcap.l\"/><use href=\"#push-up-n-e-upper.l\"/><use href=\"#push-up-n-e-elbowcap.l\"/><use href=\"#push-up-n-e-fore.l\"/><use href=\"#push-up-n-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#push-up-n-e-thigh.l\"/><use href=\"#push-up-n-e-kneecap.l\"/><use href=\"#push-up-n-e-shank.l\"/><use href=\"#push-up-n-e-foot.l\"/><use href=\"#push-up-n-e-shcap.l\"/><use href=\"#push-up-n-e-upper.l\"/><use href=\"#push-up-n-e-elbowcap.l\"/><use href=\"#push-up-n-e-fore.l\"/><use href=\"#push-up-n-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#push-up-n-e-head\"/><use href=\"#push-up-n-e-torso\"/><use href=\"#push-up-n-e-thigh.r\"/><use href=\"#push-up-n-e-kneecap.r\"/><use href=\"#push-up-n-e-shank.r\"/><use href=\"#push-up-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#push-up-n-e-head\"/><use href=\"#push-up-n-e-torso\"/><use href=\"#push-up-n-e-thigh.r\"/><use href=\"#push-up-n-e-kneecap.r\"/><use href=\"#push-up-n-e-shank.r\"/><use href=\"#push-up-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#push-up-n-e-shcap.r\"/><use href=\"#push-up-n-e-upper.r\"/><use href=\"#push-up-n-e-elbowcap.r\"/><use href=\"#push-up-n-e-fore.r\"/><use href=\"#push-up-n-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#push-up-n-e-shcap.r\"/><use href=\"#push-up-n-e-upper.r\"/><use href=\"#push-up-n-e-elbowcap.r\"/><use href=\"#push-up-n-e-fore.r\"/><use href=\"#push-up-n-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"212.24\" cy=\"251.23\" r=\"2.25\"/><circle class=\"joint\" cx=\"212.24\" cy=\"298.28\" r=\"2.25\"/><circle class=\"joint\" cx=\"146.97\" cy=\"271.34\" r=\"2.25\"/><circle class=\"joint\" cx=\"87.75\" cy=\"289.59\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#D20y-J1(Kw2G_J1xXw21000001000001102110201101020101020101000011200110201120011000211020101000000000002000020002000111000001000000001000010101000001010000000200000001000000000121010001000000000000200000010010020022000000000000010\"/><path class=\"arrow\" d=\"~MAWH1(EV1LSqNw1Lz)1zoZ\"/></g><path class=\"leader\" d=\"M194.79 237.55L172.47 214H162.47\"/><circle class=\"anchor\" cx=\"194.79\" cy=\"237.55\" r=\"1.5\"/><path class=\"leader\" d=\"~M_.H1FUP1L0XPb\"/><circle class=\"anchor\" cx=\"219.49\" cy=\"249\" r=\"1.5\"/><path class=\"leader\" d=\"M230.42 338.63L277 304H287\"/><circle class=\"anchor\" cx=\"230.42\" cy=\"338.63\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"push-up-n-line\" data-key=\"line\" data-cue=\"Keep your head, hips and heels in one line, with no sag.\" class=\"plate-callout\" style=\"left:17.88%;top:53.63%\" aria-pressed=\"true\">Straight line</button><button type=\"button\" id=\"push-up-n-hands\" data-key=\"hands\" data-cue=\"At the top, stack your shoulders over your elbows and wrists.\" class=\"plate-callout two\" style=\"left:54.75%;top:41.9%\" aria-pressed=\"false\">Shoulders<br>over hands</button><button type=\"button\" id=\"push-up-n-chest\" data-key=\"chest\" data-cue=\"Lower until your chest touches the floor lightly.\" class=\"plate-callout two\" style=\"left:78.77%;top:78.77%\" aria-pressed=\"false\">Chest<br>to floor</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"push-up-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"push-up-m-st-thigh.l\" d=\"^0\"/><path id=\"push-up-m-st-kneecap.l\" d=\"^1\"/><path id=\"push-up-m-st-shank.l\" d=\"^2\"/><path id=\"push-up-m-st-foot.l\" d=\"^3\"/><path id=\"push-up-m-st-torso\" d=\"^4\"/><path id=\"push-up-m-st-thigh.r\" d=\"^0\"/><path id=\"push-up-m-st-kneecap.r\" d=\"^1\"/><path id=\"push-up-m-st-shank.r\" d=\"^2\"/><path id=\"push-up-m-st-foot.r\" d=\"^3\"/><path id=\"push-up-m-st-shcap.r\" d=\"^5\"/><path id=\"push-up-m-st-upper.r\" d=\"^6\"/><path id=\"push-up-m-st-elbowcap.r\" d=\"^7\"/><path id=\"push-up-m-st-fore.r\" d=\"^8\"/><path id=\"push-up-m-st-palm.r\" d=\"^9\"/><path id=\"push-up-m-g0-shcap.r\" d=\"^10\"/><path id=\"push-up-m-g0-upper.r\" d=\"^11\"/><path id=\"push-up-m-g0-elbowcap.r\" d=\"^12\"/><path id=\"push-up-m-g0-fore.r\" d=\"^13\"/><path id=\"push-up-m-g0-palm.r\" d=\"^14\"/><path id=\"push-up-m-g1-shcap.r\" d=\"^15\"/><path id=\"push-up-m-g1-upper.r\" d=\"^16\"/><path id=\"push-up-m-g1-elbowcap.r\" d=\"^17\"/><path id=\"push-up-m-g1-fore.r\" d=\"^18\"/><path id=\"push-up-m-g1-palm.r\" d=\"^19\"/><path id=\"push-up-m-e-thigh.l\" d=\"^20\"/><path id=\"push-up-m-e-kneecap.l\" d=\"^21\"/><path id=\"push-up-m-e-shank.l\" d=\"^22\"/><path id=\"push-up-m-e-foot.l\" d=\"^23\"/><path id=\"push-up-m-e-shcap.l\" d=\"^24\"/><path id=\"push-up-m-e-upper.l\" d=\"^25\"/><path id=\"push-up-m-e-elbowcap.l\" d=\"^26\"/><path id=\"push-up-m-e-fore.l\" d=\"^27\"/><path id=\"push-up-m-e-palm.l\" d=\"^28\"/><path id=\"push-up-m-e-head\" d=\"^29\"/><path id=\"push-up-m-e-torso\" d=\"^30\"/><path id=\"push-up-m-e-thigh.r\" d=\"^20\"/><path id=\"push-up-m-e-kneecap.r\" d=\"^21\"/><path id=\"push-up-m-e-shank.r\" d=\"^22\"/><path id=\"push-up-m-e-foot.r\" d=\"^23\"/><path id=\"push-up-m-e-shcap.r\" d=\"^24\"/><path id=\"push-up-m-e-upper.r\" d=\"^25\"/><path id=\"push-up-m-e-elbowcap.r\" d=\"^26\"/><path id=\"push-up-m-e-fore.r\" d=\"^27\"/><path id=\"push-up-m-e-palm.r\" d=\"^28\"/><path id=\"push-up-m-m-head\" d=\"~#w12PRR1UBK1VIR1OSI1VnRcVeEf5RbO5T1D6.6F8-awgznPdqS8E4R5BiAh!hScHjw3SkR9_mOiy40100001210010101000001010000101000000201210001000000101000012101\"/><path id=\"push-up-m-m-torso\" d=\"~#_12wUJ1PAK1TyN1xwK1xc!2WcYc6(fF3(a3DkP8Y5N5Bv-iIz1Ia-7_aNcFeAgSnUdwnU8UaeAbXdSk-D1!jBlShEl*7.S1RF1DT1R2A8X4zeEh.3.h!b-gSnPw1HgAbG9KW1BB210000002000101100021000002012110100001000000020000000000220200000001010100000000100000002000000000101010002000000000\"/><path id=\"push-up-m-m-thigh.l\" d=\"~#F12w!uw)X1xHw1XXX1NbT21G1O*1F8A8F5y4N2SU1R1UnNa!jO1Wl*dDU1R6U3*2H7O6x(1H12F1YbsF9Tv.G1OiKz1Y2TD1Wo00020001200200001000000101000210001001000002000001000000000120012000200200001000\"/><path id=\"push-up-m-m-kneecap.l\" d=\"~~JThJF.1FJ10\"/><path id=\"push-up-m-m-shank.l\" d=\"~#F12A!iW_-1*Hk-_-1Ybs4F1V*1S9F8H5y4J2Wx2X8(dA6_bp(cG8Dy2I1W3)2H7O6I(103B1PbX2OcVbGpBbIlU1In(e20000100200000200011101110011010000100111000000020002002100000100010100100011101\"/><path id=\"push-up-m-m-foot.l\" d=\"~#o2J!7DE.1B*8zW.1E2!cF9YgSpJn(9yY2x1xJ2(4KD1X1Tn*7TF1Yb)bDdPr.qxk010000020010100000000101012000001000001010002020\"/><path id=\"push-up-m-m-thigh.r\" d=\"^40\"/><path id=\"push-up-m-m-kneecap.r\" d=\"^41\"/><path id=\"push-up-m-m-shank.r\" d=\"^42\"/><path id=\"push-up-m-m-foot.r\" d=\"^43\"/><path id=\"push-up-m-mf-shcap.l\" d=\"^24\"/><path id=\"push-up-m-mf-upper.l\" d=\"^25\"/><path id=\"push-up-m-mf-elbowcap.l\" d=\"^26\"/><path id=\"push-up-m-mf-fore.l\" d=\"^27\"/><path id=\"push-up-m-mf-palm.l\" d=\"^28\"/><path id=\"push-up-m-mf-shcap.r\" d=\"^24\"/><path id=\"push-up-m-mf-upper.r\" d=\"^25\"/><path id=\"push-up-m-mf-elbowcap.r\" d=\"^26\"/><path id=\"push-up-m-mf-fore.r\" d=\"^27\"/><path id=\"push-up-m-mf-palm.r\" d=\"^28\"/><path id=\"push-up-m-mo-0\" d=\"^29\"/><path id=\"push-up-m-mo-1\" d=\"^30\"/><path id=\"push-up-m-mo-2\" d=\"^20\"/><path id=\"push-up-m-mo-3\" d=\"^21\"/><path id=\"push-up-m-mo-4\" d=\"^22\"/><path id=\"push-up-m-mo-5\" d=\"^23\"/><path id=\"push-up-m-mo-6\" d=\"^24\"/><path id=\"push-up-m-mo-7\" d=\"^25\"/><path id=\"push-up-m-mo-8\" d=\"^26\"/><path id=\"push-up-m-mo-9\" d=\"^27\"/><path id=\"push-up-m-mo-10\" d=\"^28\"/><path id=\"push-up-m-mo-11\" d=\"^20\"/><path id=\"push-up-m-mo-12\" d=\"^21\"/><path id=\"push-up-m-mo-13\" d=\"^22\"/><path id=\"push-up-m-mo-14\" d=\"^23\"/><path id=\"push-up-m-mo-15\" d=\"^24\"/><path id=\"push-up-m-mo-16\" d=\"^25\"/><path id=\"push-up-m-mo-17\" d=\"^26\"/><path id=\"push-up-m-mo-18\" d=\"^27\"/><path id=\"push-up-m-mo-19\" d=\"^28\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#push-up-m-dots)\"/>\n  <path class=\"datum\" d=\"^31\"/><path class=\"floorline\" d=\"^32\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#push-up-m-st-thigh.l\"/><use href=\"#push-up-m-st-kneecap.l\"/><use href=\"#push-up-m-st-shank.l\"/><use href=\"#push-up-m-st-foot.l\"/></g><g class=\"u-fill\"><use href=\"#push-up-m-st-thigh.l\"/><use href=\"#push-up-m-st-kneecap.l\"/><use href=\"#push-up-m-st-shank.l\"/><use href=\"#push-up-m-st-foot.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#push-up-m-st-torso\"/><use href=\"#push-up-m-st-thigh.r\"/><use href=\"#push-up-m-st-kneecap.r\"/><use href=\"#push-up-m-st-shank.r\"/><use href=\"#push-up-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#push-up-m-st-torso\"/><use href=\"#push-up-m-st-thigh.r\"/><use href=\"#push-up-m-st-kneecap.r\"/><use href=\"#push-up-m-st-shank.r\"/><use href=\"#push-up-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#push-up-m-st-shcap.r\"/><use href=\"#push-up-m-st-upper.r\"/><use href=\"#push-up-m-st-elbowcap.r\"/><use href=\"#push-up-m-st-fore.r\"/><use href=\"#push-up-m-st-palm.r\"/></g><g class=\"u-fill\"><use href=\"#push-up-m-st-shcap.r\"/><use href=\"#push-up-m-st-upper.r\"/><use href=\"#push-up-m-st-elbowcap.r\"/><use href=\"#push-up-m-st-fore.r\"/><use href=\"#push-up-m-st-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#push-up-m-g0-shcap.r\"/><use href=\"#push-up-m-g0-upper.r\"/><use href=\"#push-up-m-g0-elbowcap.r\"/><use href=\"#push-up-m-g0-fore.r\"/><use href=\"#push-up-m-g0-palm.r\"/></g><g class=\"u-fill\"><use href=\"#push-up-m-g0-shcap.r\"/><use href=\"#push-up-m-g0-upper.r\"/><use href=\"#push-up-m-g0-elbowcap.r\"/><use href=\"#push-up-m-g0-fore.r\"/><use href=\"#push-up-m-g0-palm.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#push-up-m-g1-shcap.r\"/><use href=\"#push-up-m-g1-upper.r\"/><use href=\"#push-up-m-g1-elbowcap.r\"/><use href=\"#push-up-m-g1-fore.r\"/><use href=\"#push-up-m-g1-palm.r\"/></g><g class=\"u-fill\"><use href=\"#push-up-m-g1-shcap.r\"/><use href=\"#push-up-m-g1-upper.r\"/><use href=\"#push-up-m-g1-elbowcap.r\"/><use href=\"#push-up-m-g1-fore.r\"/><use href=\"#push-up-m-g1-palm.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#push-up-m-e-thigh.l\"/><use href=\"#push-up-m-e-kneecap.l\"/><use href=\"#push-up-m-e-shank.l\"/><use href=\"#push-up-m-e-foot.l\"/><use href=\"#push-up-m-e-shcap.l\"/><use href=\"#push-up-m-e-upper.l\"/><use href=\"#push-up-m-e-elbowcap.l\"/><use href=\"#push-up-m-e-fore.l\"/><use href=\"#push-up-m-e-palm.l\"/></g><g class=\"u-fill\"><use href=\"#push-up-m-e-thigh.l\"/><use href=\"#push-up-m-e-kneecap.l\"/><use href=\"#push-up-m-e-shank.l\"/><use href=\"#push-up-m-e-foot.l\"/><use href=\"#push-up-m-e-shcap.l\"/><use href=\"#push-up-m-e-upper.l\"/><use href=\"#push-up-m-e-elbowcap.l\"/><use href=\"#push-up-m-e-fore.l\"/><use href=\"#push-up-m-e-palm.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#push-up-m-e-head\"/><use href=\"#push-up-m-e-torso\"/><use href=\"#push-up-m-e-thigh.r\"/><use href=\"#push-up-m-e-kneecap.r\"/><use href=\"#push-up-m-e-shank.r\"/><use href=\"#push-up-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#push-up-m-e-head\"/><use href=\"#push-up-m-e-torso\"/><use href=\"#push-up-m-e-thigh.r\"/><use href=\"#push-up-m-e-kneecap.r\"/><use href=\"#push-up-m-e-shank.r\"/><use href=\"#push-up-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#push-up-m-e-shcap.r\"/><use href=\"#push-up-m-e-upper.r\"/><use href=\"#push-up-m-e-elbowcap.r\"/><use href=\"#push-up-m-e-fore.r\"/><use href=\"#push-up-m-e-palm.r\"/></g><g class=\"u-fill\"><use href=\"#push-up-m-e-shcap.r\"/><use href=\"#push-up-m-e-upper.r\"/><use href=\"#push-up-m-e-elbowcap.r\"/><use href=\"#push-up-m-e-fore.r\"/><use href=\"#push-up-m-e-palm.r\"/></g></g><circle class=\"joint\" cx=\"212.24\" cy=\"251.23\" r=\"2.25\"/><circle class=\"joint\" cx=\"212.24\" cy=\"298.28\" r=\"2.25\"/><circle class=\"joint\" cx=\"146.97\" cy=\"271.34\" r=\"2.25\"/><circle class=\"joint\" cx=\"87.75\" cy=\"289.59\" r=\"2.25\"/></g><mask id=\"push-up-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#push-up-m-m-head\" fill=\"#000\"/><use href=\"#push-up-m-m-torso\" fill=\"#000\"/><use href=\"#push-up-m-m-thigh.l\" fill=\"#000\"/><use href=\"#push-up-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#push-up-m-m-shank.l\" fill=\"#000\"/><use href=\"#push-up-m-m-foot.l\" fill=\"#000\"/><use href=\"#push-up-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#push-up-m-mf-upper.l\" fill=\"#000\"/><use href=\"#push-up-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#push-up-m-mf-fore.l\" fill=\"#000\"/><use href=\"#push-up-m-mf-palm.l\" fill=\"#000\"/><use href=\"#push-up-m-m-thigh.r\" fill=\"#000\"/><use href=\"#push-up-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#push-up-m-m-shank.r\" fill=\"#000\"/><use href=\"#push-up-m-m-foot.r\" fill=\"#000\"/><use href=\"#push-up-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#push-up-m-mf-upper.r\" fill=\"#000\"/><use href=\"#push-up-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#push-up-m-mf-fore.r\" fill=\"#000\"/><use href=\"#push-up-m-mf-palm.r\" fill=\"#000\"/><use href=\"#push-up-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#push-up-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#push-up-m-mmask)\"><g class=\"u-stroke\"><use href=\"#push-up-m-m-head\"/><use href=\"#push-up-m-m-torso\"/><use href=\"#push-up-m-m-thigh.l\"/><use href=\"#push-up-m-m-kneecap.l\"/><use href=\"#push-up-m-m-shank.l\"/><use href=\"#push-up-m-m-foot.l\"/><use href=\"#push-up-m-m-thigh.r\"/><use href=\"#push-up-m-m-kneecap.r\"/><use href=\"#push-up-m-m-shank.r\"/><use href=\"#push-up-m-m-foot.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MSWs!)U1LFI2YH5MErGfLFrHfLBkXK1\"/><path class=\"leader m\" d=\"M148.81 281.07L101.44 258H91.44\"/><path class=\"leader m\" d=\"~MNHz1!WT1L0IS7\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"push-up-m-sag\" data-key=\"sag\" data-cue=\"Your hips sag toward the floor, below the line.\" class=\"plate-callout m\" style=\"left:7.82%;top:65.92%\" aria-pressed=\"true\">Hips sag</button><button type=\"button\" id=\"push-up-m-arch\" data-key=\"arch\" data-cue=\"Your low back arches instead of staying braced.\" class=\"plate-callout two m\" style=\"left:33.52%;top:51.96%\" aria-pressed=\"false\">Low back<br>arches</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "line",
        cues: [{ key: "line", cue: "Keep your head, hips and heels in one line, with no sag." }, { key: "hands", cue: "At the top, stack your shoulders over your elbows and wrists." }, { key: "chest", cue: "Lower until your chest touches the floor lightly." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "sag",
        cues: [{ key: "sag", cue: "Your hips sag toward the floor, below the line." }, { key: "arch", cue: "Your low back arches instead of staying braced." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Hips sag</b><span>Your hips sag toward the floor, below the line.</span></li><li><b>Low back arches</b><span>Your low back arches instead of staying braced.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: press 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Push-up, side view. From the chest touching the floor, palms flat under the shoulders and elbows out, the lifter presses up to straight arms, shoulders over the hands, the body one straight line from head to heels on the toes.",
      mistakeAlt: "Push-Up: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "palm-flat",
    "why": "D-SHIP-C3: the card has no hand zoom (card-no-zoom); the grip copy carries c1, c6 and c14.",
    "orientation": "pronated",
    "handle": "floor",
    "loadAxis": "along-forearm",
    "overBody": false,
    "width": {
      "text": "Hands about shoulder-width apart, or slightly wider.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushup",
          "sl-pushup"
        ],
        "note": "c1"
      }
    },
    "thumb": {
      "mode": "beside",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "hand-key-palm-flat"
        ],
        "note": "The card has no grip.thumb: the palm-flat key's drawn thumb, beside the index on the floor (view-palm-flat.mjs:52)."
      }
    },
    "contact": "palm-flat",
    "wrist": {
      "exempt": "Palm flat on the floor: the wrist sits under the shoulder at the top, no range given.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-pushup"
        ],
        "note": "c6"
      }
    },
    "faults": [
      {
        "key": "cupped-palm",
        "label": "Palm cupped",
        "pose": {},
        "markers": [],
        "alt": "Palm arched off the floor, only the heel and fingertips down. The heel takes the load."
      },
      {
        "key": "hand-ahead",
        "label": "Hand ahead",
        "pose": {},
        "markers": [],
        "alt": "Hand flat but ahead of the shoulder, forearm leaning back."
      }
    ],
    "gripLine": "Palms flat, about shoulder-width. Push through the heel and outer edge of the palm.",
    "cue": "Squeeze the floor with your hands."
  },
  contacts: [
    "floor-body"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Kneel, palms flat on the floor about shoulder-width apart.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushup",
          "sl-pushup"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Shift forward until your shoulders are over your hands.",
      "zoom": "stack",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushup",
          "sl-pushup",
          "bb-pushup"
        ],
        "note": "c1, c6"
      }
    },
    {
      "kind": "position",
      "text": "Straighten your legs, feet together. Torso and legs move together.",
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushup",
          "sl-pushup",
          "bb-pushup"
        ],
        "note": "c2, c3"
      }
    },
    {
      "kind": "brace",
      "text": "Brace your trunk and tense your glutes and thighs.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushup",
          "sl-pushup"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "grip",
      "text": "Hands squeeze the floor. Breathe in going down, out going up.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-pushup",
          "ace-pushup",
          "sl-pushup"
        ],
        "note": "c14, c8"
      }
    }
  ],
  posture: [
    {
      "key": "line",
      "label": "Straight line",
      "detail": "Low back doesn't sag, hips don't hike.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushup",
          "bb-pushup"
        ],
        "note": "c3"
      }
    },
    {
      "key": "stack",
      "label": "Shoulders over hands",
      "detail": "Shoulders over elbows over wrists at the top.",
      "anchor": {
        "pose": "end",
        "at": "shoulder.r"
      },
      "zoom": "stack",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-pushup"
        ],
        "note": "c6"
      }
    },
    {
      "key": "head",
      "label": "Head in line",
      "detail": "Head in line with your spine.",
      "anchor": {
        "pose": "end",
        "at": "head"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushup",
          "sl-pushup"
        ],
        "note": "c2"
      }
    },
    {
      "key": "together",
      "label": "One piece",
      "detail": "Torso and legs move together.",
      "anchor": {
        "pose": "start",
        "at": "backMid"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushup",
          "bb-pushup"
        ],
        "note": "c3"
      }
    },
    {
      "key": "breathe",
      "label": "Breathe",
      "detail": "Breathe in going down, out going up.",
      "anchor": {
        "pose": "start",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-pushup"
        ],
        "note": "c8"
      }
    },
    {
      "key": "grip",
      "label": "Palms flat",
      "detail": "Palms flat. 'Squeeze' the floor, pushing through the heel and outer edge of the palm.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushup",
          "sl-pushup",
          "bb-pushup"
        ],
        "note": "c1, c14"
      }
    }
  ],
  zooms: [
    {
      "key": "hip-line",
      "chip": "Hip line",
      "heading": "Hip line",
      "kind": "posture"
    },
    {
      "key": "stack",
      "chip": "Hands",
      "heading": "Hand position",
      "kind": "posture"
    }
  ],
  chips: [
    "hip-line",
    "stack",
    "feel"
  ],
  copy: {
    "setupLine": "Palms flat, about shoulder-width, shoulders over your hands. Body in one line, feet together.",
    "mistakeLine": "Never let your hips sag or your low back arch. Brace your abs and squeeze your glutes.",
    "cueLine": "Body in one straight line."
  },
  mistakes: [
    {
      "key": "sag",
      "title": "Hips sagging, low back arching",
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-pushup"
        ],
        "note": "c5"
      },
      "fix": "Brace your abs, squeeze your glutes, tuck your pelvis slightly."
    },
    {
      "key": "hands",
      "title": "Hands not under the shoulders",
      "zoom": "stack",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-pushup"
        ],
        "note": "c6"
      },
      "fix": "Stack your shoulders over your hands."
    },
    {
      "key": "drop",
      "title": "Dropping fast to the floor",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "bb-pushup",
          "ace-pushup"
        ],
        "note": "c13"
      },
      "fix": "Lower under control and touch the floor lightly."
    }
  ],
  risks: [
    {
      "key": "elbows",
      "text": "Elbows kept close may ease stress on the shoulder.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-pushup"
        ],
        "note": "c7"
      }
    },
    {
      "key": "floor",
      "text": "A cluttered or slippery floor makes the set unsafe.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-pushup"
        ],
        "note": "c15"
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
    "ace-pushup",
    "sl-pushup",
    "bb-pushup",
    "kikuchi-2017",
    "hand-key-palm-flat",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/push_up.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

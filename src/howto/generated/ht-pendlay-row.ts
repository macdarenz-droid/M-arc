// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=f0e448079f8d9151af1f8cedb4df46bc4ef477cdf1e2d43a4353629903fc7cee
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_pendlay_row",
  name: "Pendlay Row",
  hashes: { inputsSha256: "f0e448079f8d9151af1f8cedb4df46bc4ef477cdf1e2d43a4353629903fc7cee", golden: "b03679384fa3d1510abed08a8e0a8d826b252b67923f7447ed5ec69bdf05d515" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"pendlay-row-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"pendlay-row-n-st-shcap.r\" d=\"~~NTD1AOF1wP10\"/><path id=\"pendlay-row-n-st-upper.r\" d=\"~#F12J.F1NBE1*TG1RUE1y6(358Ry1xhW2A5F1N2Wj(hFbwiFeF8FliHp(7_21_5bEw1Bl67P6D3(ezaGfToRjBb.sp02000100000000012001100200000002100010000000002000100200002000010000010010200200\"/><path id=\"pendlay-row-n-st-elbowcap.r\" d=\"~~_Ow1NXA1Dz10\"/><path id=\"pendlay-row-n-st-fore.r\" d=\"~#F12WNw1J*A1-Kw1KBA1a.8uN1N9_z1F2I8F1E2T3*oW4Vd-1xb-8RbR4Xo.1V1X4G7P2wB1fU1z3E8VaX2E7wl_2whPdUh00000000000000220000000010101000000101100000200120000200000200000010001110000100\"/><path id=\"pendlay-row-n-st-fist.r\" d=\"~~wTw1SwK1ww10\"/><path id=\"pendlay-row-n-g0-shcap.r\" d=\"~~DSD1Y!F1wP10\"/><path id=\"pendlay-row-n-g0-upper.r\" d=\"~#F12PBF1!JE1)yG1.OE1J7u1aRE1bY4P3H2W1!qS7yiJbJgA1JjV8Yr-3P2G1D5X2EE1B529J72F8TfOoOfKmR1Kq!b01012100000220002002000101200000100000000010000002000001011000000001001010010021\"/><path id=\"pendlay-row-n-g0-elbowcap.r\" d=\"~~SFvNIF1Dz10\"/><path id=\"pendlay-row-n-g0-fore.r\" d=\"~#F12UFvJWF1EAvI(E1x1)8D1H1Pe_y1w1-8uI2E7*oW2BeG3XaGaBaB8Toz2K1-5V6!7!A19Y1B4)7*anB4_ly5Ng!fSf00101000002200000000020000100210010000001011010001200001002000101200001010002000\"/><path id=\"pendlay-row-n-g0-fist.r\" d=\"~~wTw1WWP1ww10\"/><path id=\"pendlay-row-n-g1-shcap.r\" d=\"~~!PD1JHG1wP10\"/><path id=\"pendlay-row-n-g1-upper.r\" d=\"~#F12DUE1A!E1.TF1KUE1w8V12aGG1YdA6U1w3mDx1x3UkW4(fI4JfTeAuEeF2x2J4O4RH1A917Y7R27XgGsO6Rlw6xl(j10100000100100002200202002110101000000200000000011011002000002001010100002011101\"/><path id=\"pendlay-row-n-g1-elbowcap.r\" d=\"~~YXuFSI1Dz10\"/><path id=\"pendlay-row-n-g1-fore.r\" d=\"~#F12HYuU(I1GSu*AI1T1V9H1N1(gyB1eO9oO2R9zsD2Ee-3TaXaV9IaXrG2O1E6)6NaHE15w2-4R8EaS1G3wm_5DgPg(e00010000001000010000021011020011100000000010100000200000000101001012100000000000\"/><path id=\"pendlay-row-n-g1-fist.r\" d=\"~~wTw1_JU1ww10\"/><path id=\"pendlay-row-n-g2-shcap.r\" d=\"~~SOD1yYG1wP10\"/><path id=\"pendlay-row-n-g2-upper.r\" d=\"~#F12_AE1DPF1ByF1T*E1N7K468zB1YrS6hD3bYx1XfAlx2WdB9waXiFrEpU1-2y3.5.E1!n39w7B5K7TeXs!2XiPcOdUp00000000002000000202000001000000200220001000000000100001202101101100021000002000\"/><path id=\"pendlay-row-n-g2-elbowcap.r\" d=\"~~!IvH-N1Dz10\"/><path id=\"pendlay-row-n-g2-fore.r\" d=\"~#F12SIvwzO1BEvREN1vEaD1U1UeJF1y1.9sR2)7GvF3xe)2-a*9Ra.8)uE2X1-5)7(7FH17(1I4G9.9D2x5SlS4WgHfyg00000000000020012010020020020010000101200100000100002021011000022011100020010100\"/><path id=\"pendlay-row-n-g2-fist.r\" d=\"~~wTw1(yY1ww10\"/><path id=\"pendlay-row-n-e-thigh.l\" d=\"~#F12FKoANG1VYnXzF1.5EaE1eyqA-1Y2O9A1T4)gGS1D3)pI7Xi.j*gTlOP1x4T2I8B5UjW.1y1dO2VbKx1cO5yN1ydNx1Hz1Au01000001110000000000021000010000021000200010000020200000010120101020000000000000\"/><path id=\"pendlay-row-n-e-kneecap.l\" d=\"~~PWt((T1_J10\"/><path id=\"pendlay-row-n-e-shank.l\" d=\"~#F12!UtywU1OXtXPS1S1.bF10J6_(1Y5)7W2)3I5.y2w7-d9*bV7KdD2xz2.2.3B6V7G3w)1E12x2VbRc!bVcypiYl!dHo00002120000101100020012001010100001010210101000101110000020002101110020200002100\"/><path id=\"pendlay-row-n-e-foot.l\" d=\"~#o2FPuAB)1.xvzB(1_cF3Shx8Pp)nF-2B3OJ2-4ED1)7.n2KG1Y4Bb-cWsBbEmSp020022010100000101000000000220000101101000210110\"/><path id=\"pendlay-row-n-e-shcap.l\" d=\"~~FND1WBH1wP10\"/><path id=\"pendlay-row-n-e-upper.l\" d=\"~#F12NRD1PUG1x)D1OTF1S3E8a6XeFK1y5O4J2B2Dj-x1wg.dw6KfX2xlJ8.B17I3rT6BjSI195Y2K8Xe-6.l!ix8wlU3Ys00001000002200010000100000000021001000020000010000000001100002000000210010021000\"/><path id=\"pendlay-row-n-e-elbowcap.l\" d=\"~~WPz1D.S1Dz10\"/><path id=\"pendlay-row-n-e-fore.l\" d=\"~#F12WOz1UUS1TXz1R-R1P3-9gw2G4HI1A5R8w2*1H6Ow1w9Ebw2zbO4XdN5Rw1E1T2X1-9BbDH1x1W16Kaxa*1XdJhx3wh(6yl00000020001110001002000000000200010000000101000000101200000000100020002200002000\"/><path id=\"pendlay-row-n-e-fist.l\" d=\"~~wTw1y-.1ww10\"/><path id=\"pendlay-row-n-e-head\" d=\"~#w12S(R1(RH1)JS1.)F1Gh*kV7xkF4-aO4T3P8x4_b.6woIfHcw6W9n!1xj(8JnH4(mE5HkVhWh*iO30000000020000000002101100200000000000000020210000001110200000110\"/><path id=\"pendlay-row-n-e-torso\" d=\"~#_12_IK1WTF1z-N1TxG1H7)8aB3Ki(7E7!8BhHbn!5Do*2P9Xjx4)cD4AgN5Alyfwn_gJiJ9F5HgI7JA1TpUrxaV2R6K2T5GbWbB8J2A9)bK6TgxkI8)6Y5(9_dG8J2.n-V200000100202200002100000100011000111002000010020000001202101100000010000000002010100000010000000000010001011011000210\"/><path id=\"pendlay-row-n-e-thigh.r\" d=\"^20\"/><path id=\"pendlay-row-n-e-kneecap.r\" d=\"^21\"/><path id=\"pendlay-row-n-e-shank.r\" d=\"^22\"/><path id=\"pendlay-row-n-e-foot.r\" d=\"^23\"/><path id=\"pendlay-row-n-e-shcap.r\" d=\"^24\"/><path id=\"pendlay-row-n-e-upper.r\" d=\"^25\"/><path id=\"pendlay-row-n-e-elbowcap.r\" d=\"^26\"/><path id=\"pendlay-row-n-e-fore.r\" d=\"^27\"/><path id=\"pendlay-row-n-e-fist.r\" d=\"^28\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#pendlay-row-n-dots)\"/>\n  <path class=\"datum\" d=\"~MwXbD-B1Lw!N10\"/><path class=\"floorline\" d=\"M62.29 339.5H281.71\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pendlay-row-n-st-shcap.r\"/><use href=\"#pendlay-row-n-st-upper.r\"/><use href=\"#pendlay-row-n-st-elbowcap.r\"/><use href=\"#pendlay-row-n-st-fore.r\"/><use href=\"#pendlay-row-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pendlay-row-n-st-shcap.r\"/><use href=\"#pendlay-row-n-st-upper.r\"/><use href=\"#pendlay-row-n-st-elbowcap.r\"/><use href=\"#pendlay-row-n-st-fore.r\"/><use href=\"#pendlay-row-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pendlay-row-n-g0-shcap.r\"/><use href=\"#pendlay-row-n-g0-upper.r\"/><use href=\"#pendlay-row-n-g0-elbowcap.r\"/><use href=\"#pendlay-row-n-g0-fore.r\"/><use href=\"#pendlay-row-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pendlay-row-n-g0-shcap.r\"/><use href=\"#pendlay-row-n-g0-upper.r\"/><use href=\"#pendlay-row-n-g0-elbowcap.r\"/><use href=\"#pendlay-row-n-g0-fore.r\"/><use href=\"#pendlay-row-n-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~~A!w1WWP1!m1\"/><path class=\"eq-pin\" d=\"~~YJx1WWP1F60\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pendlay-row-n-g1-shcap.r\"/><use href=\"#pendlay-row-n-g1-upper.r\"/><use href=\"#pendlay-row-n-g1-elbowcap.r\"/><use href=\"#pendlay-row-n-g1-fore.r\"/><use href=\"#pendlay-row-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pendlay-row-n-g1-shcap.r\"/><use href=\"#pendlay-row-n-g1-upper.r\"/><use href=\"#pendlay-row-n-g1-elbowcap.r\"/><use href=\"#pendlay-row-n-g1-fore.r\"/><use href=\"#pendlay-row-n-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~~A!w1_JU1!m1\"/><path class=\"eq-pin\" d=\"~~YJx1_JU1F60\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pendlay-row-n-g2-shcap.r\"/><use href=\"#pendlay-row-n-g2-upper.r\"/><use href=\"#pendlay-row-n-g2-elbowcap.r\"/><use href=\"#pendlay-row-n-g2-fore.r\"/><use href=\"#pendlay-row-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pendlay-row-n-g2-shcap.r\"/><use href=\"#pendlay-row-n-g2-upper.r\"/><use href=\"#pendlay-row-n-g2-elbowcap.r\"/><use href=\"#pendlay-row-n-g2-fore.r\"/><use href=\"#pendlay-row-n-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~~A!w1(yY1!m1\"/><path class=\"eq-pin\" d=\"~~YJx1(yY1F60\"/></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pendlay-row-n-e-thigh.l\"/><use href=\"#pendlay-row-n-e-kneecap.l\"/><use href=\"#pendlay-row-n-e-shank.l\"/><use href=\"#pendlay-row-n-e-foot.l\"/><use href=\"#pendlay-row-n-e-shcap.l\"/><use href=\"#pendlay-row-n-e-upper.l\"/><use href=\"#pendlay-row-n-e-elbowcap.l\"/><use href=\"#pendlay-row-n-e-fore.l\"/><use href=\"#pendlay-row-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#pendlay-row-n-e-thigh.l\"/><use href=\"#pendlay-row-n-e-kneecap.l\"/><use href=\"#pendlay-row-n-e-shank.l\"/><use href=\"#pendlay-row-n-e-foot.l\"/><use href=\"#pendlay-row-n-e-shcap.l\"/><use href=\"#pendlay-row-n-e-upper.l\"/><use href=\"#pendlay-row-n-e-elbowcap.l\"/><use href=\"#pendlay-row-n-e-fore.l\"/><use href=\"#pendlay-row-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pendlay-row-n-e-head\"/><use href=\"#pendlay-row-n-e-torso\"/><use href=\"#pendlay-row-n-e-thigh.r\"/><use href=\"#pendlay-row-n-e-kneecap.r\"/><use href=\"#pendlay-row-n-e-shank.r\"/><use href=\"#pendlay-row-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pendlay-row-n-e-head\"/><use href=\"#pendlay-row-n-e-torso\"/><use href=\"#pendlay-row-n-e-thigh.r\"/><use href=\"#pendlay-row-n-e-kneecap.r\"/><use href=\"#pendlay-row-n-e-shank.r\"/><use href=\"#pendlay-row-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pendlay-row-n-e-shcap.r\"/><use href=\"#pendlay-row-n-e-upper.r\"/><use href=\"#pendlay-row-n-e-elbowcap.r\"/><use href=\"#pendlay-row-n-e-fore.r\"/><use href=\"#pendlay-row-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pendlay-row-n-e-shcap.r\"/><use href=\"#pendlay-row-n-e-upper.r\"/><use href=\"#pendlay-row-n-e-elbowcap.r\"/><use href=\"#pendlay-row-n-e-fore.r\"/><use href=\"#pendlay-row-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~#o2YGy1SO!1xYy1BE!1E2G8D2G8w6x6H8E2F8D2J_1Vu*W1DF10W9X6Y6T94VE1FX1000111111010001200000000200010020000210022000010\"/><path class=\"eq-line\" d=\"~~HBry-.1WK62\"/><path class=\"eq-thin\" d=\"~~HHsy-.1WF50\"/><path class=\"eq-solid\" d=\"~~A!w1y-.1!m1\"/><path class=\"eq-pin\" d=\"~~YJx1y-.1F60\"/><path class=\"eq-solid\" d=\"^42\"/><path class=\"eq-pin\" d=\"^43\"/><path class=\"eq-cable m-line\" d=\"~M!Gy1SwK1LX1X8LB3H1LO2P2LG1D3L0P3LH1D3LP2P2LD3H1LP30LD3G1LP2O2LH1B3L0O3LG1B3LO2O2LB3G1\"/><circle class=\"joint\" cx=\"204.52\" cy=\"215.95\" r=\"2.25\"/><circle class=\"joint\" cx=\"187.5\" cy=\"260.35\" r=\"2.25\"/><circle class=\"joint\" cx=\"136.44\" cy=\"207.7\" r=\"2.25\"/><circle class=\"joint\" cx=\"159.24\" cy=\"266.07\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#y20wTx1NBO1)Sx1R.N10102010201020102010201020102010201020102010201020102010201020102020101000001010000010100000101000001010000010100000101000001010000010100000101000001010000010100000101000001010000010100000101000001\"/><path class=\"arrow\" d=\"~MwTx1_O_1LXiOB1LFY1PB1Z\"/></g><path class=\"leader\" d=\"~MH.B1D-B1L0B.1\"/><circle class=\"anchor\" cx=\"193.81\" cy=\"193.47\" r=\"1.5\"/><path class=\"leader\" d=\"M135.28 187.15L134.78 172H124.78\"/><circle class=\"anchor\" cx=\"135.28\" cy=\"187.15\" r=\"1.5\"/><path class=\"leader\" d=\"M172 306.09L221 322H231\"/><circle class=\"anchor\" cx=\"172\" cy=\"306.09\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"pendlay-row-n-back\" data-key=\"back\" data-cue=\"Keep your torso level with the floor, shoulders and hips at one height.\" class=\"plate-callout two\" style=\"left:53.63%;top:40.22%\" aria-pressed=\"true\">Back<br>parallel</button><button type=\"button\" id=\"pendlay-row-n-still\" data-key=\"still\" data-cue=\"Move only the bar and your arms, never stand up to pull.\" class=\"plate-callout\" style=\"left:11.17%;top:41.9%\" aria-pressed=\"false\">Torso still</button><button type=\"button\" id=\"pendlay-row-n-floor\" data-key=\"floor\" data-cue=\"Set the bar down on the floor at a dead stop between reps.\" class=\"plate-callout two\" style=\"left:63.13%;top:83.8%\" aria-pressed=\"false\">Floor<br>each rep</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"pendlay-row-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"pendlay-row-m-st-shcap.r\" d=\"^0\"/><path id=\"pendlay-row-m-st-upper.r\" d=\"^1\"/><path id=\"pendlay-row-m-st-elbowcap.r\" d=\"^2\"/><path id=\"pendlay-row-m-st-fore.r\" d=\"^3\"/><path id=\"pendlay-row-m-st-fist.r\" d=\"^4\"/><path id=\"pendlay-row-m-g0-shcap.r\" d=\"^5\"/><path id=\"pendlay-row-m-g0-upper.r\" d=\"^6\"/><path id=\"pendlay-row-m-g0-elbowcap.r\" d=\"^7\"/><path id=\"pendlay-row-m-g0-fore.r\" d=\"^8\"/><path id=\"pendlay-row-m-g0-fist.r\" d=\"^9\"/><path id=\"pendlay-row-m-g1-shcap.r\" d=\"^10\"/><path id=\"pendlay-row-m-g1-upper.r\" d=\"^11\"/><path id=\"pendlay-row-m-g1-elbowcap.r\" d=\"^12\"/><path id=\"pendlay-row-m-g1-fore.r\" d=\"^13\"/><path id=\"pendlay-row-m-g1-fist.r\" d=\"^14\"/><path id=\"pendlay-row-m-g2-shcap.r\" d=\"^15\"/><path id=\"pendlay-row-m-g2-upper.r\" d=\"^16\"/><path id=\"pendlay-row-m-g2-elbowcap.r\" d=\"^17\"/><path id=\"pendlay-row-m-g2-fore.r\" d=\"^18\"/><path id=\"pendlay-row-m-g2-fist.r\" d=\"^19\"/><path id=\"pendlay-row-m-e-thigh.l\" d=\"^20\"/><path id=\"pendlay-row-m-e-kneecap.l\" d=\"^21\"/><path id=\"pendlay-row-m-e-shank.l\" d=\"^22\"/><path id=\"pendlay-row-m-e-foot.l\" d=\"^23\"/><path id=\"pendlay-row-m-e-shcap.l\" d=\"^24\"/><path id=\"pendlay-row-m-e-upper.l\" d=\"^25\"/><path id=\"pendlay-row-m-e-elbowcap.l\" d=\"^26\"/><path id=\"pendlay-row-m-e-fore.l\" d=\"^27\"/><path id=\"pendlay-row-m-e-fist.l\" d=\"^28\"/><path id=\"pendlay-row-m-e-head\" d=\"^29\"/><path id=\"pendlay-row-m-e-torso\" d=\"^30\"/><path id=\"pendlay-row-m-e-thigh.r\" d=\"^20\"/><path id=\"pendlay-row-m-e-kneecap.r\" d=\"^21\"/><path id=\"pendlay-row-m-e-shank.r\" d=\"^22\"/><path id=\"pendlay-row-m-e-foot.r\" d=\"^23\"/><path id=\"pendlay-row-m-e-shcap.r\" d=\"^24\"/><path id=\"pendlay-row-m-e-upper.r\" d=\"^25\"/><path id=\"pendlay-row-m-e-elbowcap.r\" d=\"^26\"/><path id=\"pendlay-row-m-e-fore.r\" d=\"^27\"/><path id=\"pendlay-row-m-e-fist.r\" d=\"^28\"/><path id=\"pendlay-row-m-m-head\" d=\"~#w12NRO1NSI1)EP1OzH1RdOnG4xly6*9.3I4w9R2(c-4AqzbDb!7U9w1y5Ri(4PocJnO8DjKkNexiR61010100000000010000100000000020021000021011110001001010000010000\"/><path id=\"pendlay-row-m-m-torso\" d=\"~#_12yII1U!F1IVJ1*RG1W8T7qx3OjW4V8U7XiD8I5oAoDgY9D7I7*aUbwcFfPfUoNcWnN7Ya3PaOeUiKF1(iKm-I1E1Ey1DV1!(1lT8w1ybGaR3OhKiTb-7S4P7HfR8uI9TY200000000000000000020000020002000100000000000000020000000020000000010100000012100000110110100000000200002000100100000\"/><path id=\"pendlay-row-m-m-shcap.l\" d=\"~~UEA1yRG1wP10\"/><path id=\"pendlay-row-m-m-upper.l\" d=\"~#F12yGA1PBG1RSA1zzF1S2R8c4B9WN1P4)4A2O2_e*z1HeXf(3)fE5RkW3VD1lE3V1O6XdSK171W1-8Of*4KjPlI5_lA7ys11010100001010000000100101000100000000010100101000000020001111001010000001010100\"/><path id=\"pendlay-row-m-m-elbowcap.l\" d=\"~~!Jy1NRS1Dz10\"/><path id=\"pendlay-row-m-m-fore.l\" d=\"~#F12JIy1NOS1*Oy1TTR1H2Bak(1A1SI1y4z9W1E2H2.w1P7KcmBbB6zdJ1)w1O1K2)2K9.5AI1p_1E1GaxanRb(ivFhP9Ak10000000020020000210100002010101211011000100200020210021001001002001010000200001\"/><path id=\"pendlay-row-m-m-shcap.r\" d=\"^52\"/><path id=\"pendlay-row-m-m-upper.r\" d=\"^53\"/><path id=\"pendlay-row-m-m-elbowcap.r\" d=\"^54\"/><path id=\"pendlay-row-m-m-fore.r\" d=\"^55\"/><path id=\"pendlay-row-m-m-eq0\" d=\"~#o2HJy1UJ!1O-y1Ty!1E3.7D1O8D5-6w8E3N8A1AW1RB1RR1UN1F1S9*5U7R9F1Tw1W.1000002000010112000111010020002200000000000010001\"/><path id=\"pendlay-row-m-mf-thigh.l\" d=\"^20\"/><path id=\"pendlay-row-m-mf-kneecap.l\" d=\"^21\"/><path id=\"pendlay-row-m-mf-shank.l\" d=\"^22\"/><path id=\"pendlay-row-m-mf-foot.l\" d=\"^23\"/><path id=\"pendlay-row-m-mf-fist.l\" d=\"^28\"/><path id=\"pendlay-row-m-mf-thigh.r\" d=\"^20\"/><path id=\"pendlay-row-m-mf-kneecap.r\" d=\"^21\"/><path id=\"pendlay-row-m-mf-shank.r\" d=\"^22\"/><path id=\"pendlay-row-m-mf-foot.r\" d=\"^23\"/><path id=\"pendlay-row-m-mf-fist.r\" d=\"^28\"/><path id=\"pendlay-row-m-mo-0\" d=\"^29\"/><path id=\"pendlay-row-m-mo-1\" d=\"^30\"/><path id=\"pendlay-row-m-mo-2\" d=\"^20\"/><path id=\"pendlay-row-m-mo-3\" d=\"^21\"/><path id=\"pendlay-row-m-mo-4\" d=\"^22\"/><path id=\"pendlay-row-m-mo-5\" d=\"^23\"/><path id=\"pendlay-row-m-mo-6\" d=\"^24\"/><path id=\"pendlay-row-m-mo-7\" d=\"^25\"/><path id=\"pendlay-row-m-mo-8\" d=\"^26\"/><path id=\"pendlay-row-m-mo-9\" d=\"^27\"/><path id=\"pendlay-row-m-mo-10\" d=\"^28\"/><path id=\"pendlay-row-m-mo-11\" d=\"^20\"/><path id=\"pendlay-row-m-mo-12\" d=\"^21\"/><path id=\"pendlay-row-m-mo-13\" d=\"^22\"/><path id=\"pendlay-row-m-mo-14\" d=\"^23\"/><path id=\"pendlay-row-m-mo-15\" d=\"^24\"/><path id=\"pendlay-row-m-mo-16\" d=\"^25\"/><path id=\"pendlay-row-m-mo-17\" d=\"^26\"/><path id=\"pendlay-row-m-mo-18\" d=\"^27\"/><path id=\"pendlay-row-m-mo-19\" d=\"^28\"/><path id=\"pendlay-row-m-mo-20\" d=\"^39\"/><path id=\"pendlay-row-m-mo-21\" d=\"^42\"/><path id=\"pendlay-row-m-mo-22\" d=\"^43\"/><path id=\"pendlay-row-m-mo-23\" d=\"^42\"/><path id=\"pendlay-row-m-mo-24\" d=\"^43\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#pendlay-row-m-dots)\"/>\n  <path class=\"datum\" d=\"^31\"/><path class=\"floorline\" d=\"^32\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pendlay-row-m-st-shcap.r\"/><use href=\"#pendlay-row-m-st-upper.r\"/><use href=\"#pendlay-row-m-st-elbowcap.r\"/><use href=\"#pendlay-row-m-st-fore.r\"/><use href=\"#pendlay-row-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pendlay-row-m-st-shcap.r\"/><use href=\"#pendlay-row-m-st-upper.r\"/><use href=\"#pendlay-row-m-st-elbowcap.r\"/><use href=\"#pendlay-row-m-st-fore.r\"/><use href=\"#pendlay-row-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pendlay-row-m-g0-shcap.r\"/><use href=\"#pendlay-row-m-g0-upper.r\"/><use href=\"#pendlay-row-m-g0-elbowcap.r\"/><use href=\"#pendlay-row-m-g0-fore.r\"/><use href=\"#pendlay-row-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pendlay-row-m-g0-shcap.r\"/><use href=\"#pendlay-row-m-g0-upper.r\"/><use href=\"#pendlay-row-m-g0-elbowcap.r\"/><use href=\"#pendlay-row-m-g0-fore.r\"/><use href=\"#pendlay-row-m-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^33\"/><path class=\"eq-pin\" d=\"^34\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pendlay-row-m-g1-shcap.r\"/><use href=\"#pendlay-row-m-g1-upper.r\"/><use href=\"#pendlay-row-m-g1-elbowcap.r\"/><use href=\"#pendlay-row-m-g1-fore.r\"/><use href=\"#pendlay-row-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pendlay-row-m-g1-shcap.r\"/><use href=\"#pendlay-row-m-g1-upper.r\"/><use href=\"#pendlay-row-m-g1-elbowcap.r\"/><use href=\"#pendlay-row-m-g1-fore.r\"/><use href=\"#pendlay-row-m-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^35\"/><path class=\"eq-pin\" d=\"^36\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#pendlay-row-m-g2-shcap.r\"/><use href=\"#pendlay-row-m-g2-upper.r\"/><use href=\"#pendlay-row-m-g2-elbowcap.r\"/><use href=\"#pendlay-row-m-g2-fore.r\"/><use href=\"#pendlay-row-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pendlay-row-m-g2-shcap.r\"/><use href=\"#pendlay-row-m-g2-upper.r\"/><use href=\"#pendlay-row-m-g2-elbowcap.r\"/><use href=\"#pendlay-row-m-g2-fore.r\"/><use href=\"#pendlay-row-m-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^37\"/><path class=\"eq-pin\" d=\"^38\"/></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#pendlay-row-m-e-thigh.l\"/><use href=\"#pendlay-row-m-e-kneecap.l\"/><use href=\"#pendlay-row-m-e-shank.l\"/><use href=\"#pendlay-row-m-e-foot.l\"/><use href=\"#pendlay-row-m-e-shcap.l\"/><use href=\"#pendlay-row-m-e-upper.l\"/><use href=\"#pendlay-row-m-e-elbowcap.l\"/><use href=\"#pendlay-row-m-e-fore.l\"/><use href=\"#pendlay-row-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#pendlay-row-m-e-thigh.l\"/><use href=\"#pendlay-row-m-e-kneecap.l\"/><use href=\"#pendlay-row-m-e-shank.l\"/><use href=\"#pendlay-row-m-e-foot.l\"/><use href=\"#pendlay-row-m-e-shcap.l\"/><use href=\"#pendlay-row-m-e-upper.l\"/><use href=\"#pendlay-row-m-e-elbowcap.l\"/><use href=\"#pendlay-row-m-e-fore.l\"/><use href=\"#pendlay-row-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pendlay-row-m-e-head\"/><use href=\"#pendlay-row-m-e-torso\"/><use href=\"#pendlay-row-m-e-thigh.r\"/><use href=\"#pendlay-row-m-e-kneecap.r\"/><use href=\"#pendlay-row-m-e-shank.r\"/><use href=\"#pendlay-row-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#pendlay-row-m-e-head\"/><use href=\"#pendlay-row-m-e-torso\"/><use href=\"#pendlay-row-m-e-thigh.r\"/><use href=\"#pendlay-row-m-e-kneecap.r\"/><use href=\"#pendlay-row-m-e-shank.r\"/><use href=\"#pendlay-row-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#pendlay-row-m-e-shcap.r\"/><use href=\"#pendlay-row-m-e-upper.r\"/><use href=\"#pendlay-row-m-e-elbowcap.r\"/><use href=\"#pendlay-row-m-e-fore.r\"/><use href=\"#pendlay-row-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#pendlay-row-m-e-shcap.r\"/><use href=\"#pendlay-row-m-e-upper.r\"/><use href=\"#pendlay-row-m-e-elbowcap.r\"/><use href=\"#pendlay-row-m-e-fore.r\"/><use href=\"#pendlay-row-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^39\"/><path class=\"eq-line\" d=\"^40\"/><path class=\"eq-thin\" d=\"^41\"/><path class=\"eq-solid\" d=\"^42\"/><path class=\"eq-pin\" d=\"^43\"/><path class=\"eq-solid\" d=\"^42\"/><path class=\"eq-pin\" d=\"^43\"/><path class=\"eq-cable m-line\" d=\"^44\"/><circle class=\"joint\" cx=\"204.52\" cy=\"215.95\" r=\"2.25\"/><circle class=\"joint\" cx=\"187.5\" cy=\"260.35\" r=\"2.25\"/><circle class=\"joint\" cx=\"136.44\" cy=\"207.7\" r=\"2.25\"/><circle class=\"joint\" cx=\"159.24\" cy=\"266.07\" r=\"2.25\"/></g><mask id=\"pendlay-row-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#pendlay-row-m-m-head\" fill=\"#000\"/><use href=\"#pendlay-row-m-m-torso\" fill=\"#000\"/><use href=\"#pendlay-row-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#pendlay-row-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#pendlay-row-m-mf-shank.l\" fill=\"#000\"/><use href=\"#pendlay-row-m-mf-foot.l\" fill=\"#000\"/><use href=\"#pendlay-row-m-m-shcap.l\" fill=\"#000\"/><use href=\"#pendlay-row-m-m-upper.l\" fill=\"#000\"/><use href=\"#pendlay-row-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#pendlay-row-m-m-fore.l\" fill=\"#000\"/><use href=\"#pendlay-row-m-mf-fist.l\" fill=\"#000\"/><use href=\"#pendlay-row-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#pendlay-row-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#pendlay-row-m-mf-shank.r\" fill=\"#000\"/><use href=\"#pendlay-row-m-mf-foot.r\" fill=\"#000\"/><use href=\"#pendlay-row-m-m-shcap.r\" fill=\"#000\"/><use href=\"#pendlay-row-m-m-upper.r\" fill=\"#000\"/><use href=\"#pendlay-row-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#pendlay-row-m-m-fore.r\" fill=\"#000\"/><use href=\"#pendlay-row-m-mf-fist.r\" fill=\"#000\"/><use href=\"#pendlay-row-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#pendlay-row-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#pendlay-row-m-mmask)\"><g class=\"u-stroke\"><use href=\"#pendlay-row-m-m-head\"/><use href=\"#pendlay-row-m-m-torso\"/><use href=\"#pendlay-row-m-m-shcap.l\"/><use href=\"#pendlay-row-m-m-upper.l\"/><use href=\"#pendlay-row-m-m-elbowcap.l\"/><use href=\"#pendlay-row-m-m-fore.l\"/><use href=\"#pendlay-row-m-m-shcap.r\"/><use href=\"#pendlay-row-m-m-upper.r\"/><use href=\"#pendlay-row-m-m-elbowcap.r\"/><use href=\"#pendlay-row-m-m-fore.r\"/><use href=\"#pendlay-row-m-m-eq0\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~M!XrDXA1LYlBjLgU3LkU3LkW3LiS3LiU3LkU3LiU3LiU3LkW3LiS3LkU3LiU3LkU3LgU3LmU3\"/><path class=\"m-arrow\" d=\"~MwWx1SVvL0ww3MXi)oLYiwpL0)R1\"/><path class=\"leader m\" d=\"~MD!w1y*y1L0RT5\"/><path class=\"leader m\" d=\"M142.06 188.03L111.75 172H101.75\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"pendlay-row-m-round\" data-key=\"round\" data-cue=\"The back is rounded to reach the bar on the floor.\" class=\"plate-callout two m\" style=\"left:41.9%;top:30.73%\" aria-pressed=\"true\">Back<br>rounded</button><button type=\"button\" id=\"pendlay-row-m-tuck\" data-key=\"tuck\" data-cue=\"The hips tuck under and the back curls down.\" class=\"plate-callout two m\" style=\"left:8.38%;top:41.9%\" aria-pressed=\"false\">Hips tuck<br>under</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "back",
        cues: [{ key: "back", cue: "Keep your torso level with the floor, shoulders and hips at one height." }, { key: "still", cue: "Move only the bar and your arms, never stand up to pull." }, { key: "floor", cue: "Set the bar down on the floor at a dead stop between reps." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "round",
        cues: [{ key: "round", cue: "The back is rounded to reach the bar on the floor." }, { key: "tuck", cue: "The hips tuck under and the back curls down." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Back rounded</b><span>The back is rounded to reach the bar on the floor.</span></li><li><b>Hips tuck under</b><span>The hips tuck under and the back curls down.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Pendlay row, side view. Hinged with the torso level with the floor and the knees slightly bent, the lifter pulls the bar from a dead stop on the floor up to the base of the chest, moving only the arms, and sets it back down each rep.",
      mistakeAlt: "Pendlay Row: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "pull",
    "why": "D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c1, c16 and c20.",
    "orientation": "pronated",
    "handle": "bar-28",
    "width": {
      "text": "Slightly wider than shoulder width.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-pendlay",
          "ggr-pendlay"
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
        "note": "c16"
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        25
      ],
      "limitText": "Keep the wrists from curling forward.",
      "claim": {
        "tags": [
          "DATA",
          "MECH"
        ],
        "sources": [
          "odriscoll1992"
        ],
        "note": "c21, card grip.wrist. The ext range is pairs.mjs CONVENTIONS ga:pull-base, a convention, not a card number."
      }
    },
    "faults": [],
    "gripLine": "Overhand, thumbs around the bar. Straps are fine if grip fails first.",
    "cue": "Overhand, thumbs wrapped."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "get-in",
      "text": "New to lifting? Start with seated or chest-supported rows first.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-pendlay"
        ],
        "note": "c13"
      }
    },
    {
      "kind": "position",
      "text": "Bar on the floor. Stand over it, feet flat, shoulder width.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-pendlay"
        ],
        "note": "c10"
      }
    },
    {
      "kind": "grip",
      "text": "Hips a little above deadlift height. Overhand, slightly wider than shoulders. Brace.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-pendlay",
          "ggr-pendlay"
        ],
        "note": "c1, c5"
      }
    },
    {
      "kind": "position",
      "text": "Back rounds to reach it? Raise the bar on blocks or plates.",
      "zoom": "pendlay-start",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-pendlay"
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
          "barbend-pendlay",
          "acsm2009"
        ],
        "note": "c7"
      }
    }
  ],
  posture: [
    {
      "key": "torso",
      "label": "Torso level",
      "detail": "Torso level, shoulders and hips at the same height.",
      "anchor": {
        "pose": "end",
        "at": "backMid"
      },
      "zoom": "pendlay-start",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-pendlay"
        ],
        "note": "c2"
      }
    },
    {
      "key": "still",
      "label": "Torso still",
      "detail": "Upper body still. Only the bar and arms move.",
      "anchor": {
        "pose": "start",
        "at": "backUpper"
      },
      "zoom": "pendlay-top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-pendlay",
          "barbend-pendlay"
        ],
        "note": "c4, c6"
      }
    },
    {
      "key": "brace",
      "label": "Brace first",
      "detail": "Brace before each pull. Shoulders not shrugged, hips don't come forward.",
      "anchor": {
        "pose": "start",
        "at": "sacrum"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-pendlay"
        ],
        "note": "c5"
      }
    },
    {
      "key": "feet",
      "label": "Feet flat",
      "detail": "Both feet flat the whole set.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-pendlay"
        ],
        "note": "c10"
      }
    }
  ],
  zooms: [
    {
      "key": "pendlay-start",
      "chip": "Start",
      "heading": "Start position",
      "kind": "posture"
    },
    {
      "key": "pendlay-top",
      "chip": "Top",
      "heading": "Top position",
      "kind": "posture"
    }
  ],
  chips: [
    "pendlay-start",
    "pendlay-top",
    "feel"
  ],
  copy: {
    "setupLine": "Hinge with the torso level. Pull the bar from the floor to the base of your chest.",
    "mistakeLine": "Don't stand up to yank the bar. Use less weight and keep the torso level.",
    "cueLine": "Torso level, floor each rep."
  },
  mistakes: [
    {
      "key": "round",
      "title": "Starting with a rounded back",
      "zoom": "pendlay-start",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-pendlay"
        ],
        "note": "c8"
      },
      "fix": "Raise the bar on blocks or plates. Keep the back flat."
    },
    {
      "key": "rise",
      "title": "Standing partly up to yank",
      "zoom": "pendlay-top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-pendlay",
          "barbend-pendlay"
        ],
        "note": "c6, c5"
      },
      "fix": "Use less weight. Keep the torso level, hips not forward."
    },
    {
      "key": "flare",
      "title": "Elbows flared wide",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "barbend-pendlay"
        ],
        "note": "c9"
      },
      "fix": "Lighten the load. Pull the bar toward the hips."
    }
  ],
  risks: [
    {
      "key": "round",
      "text": "Starting a rep with a rounded back is dangerous.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ggr-pendlay"
        ],
        "note": "c8, c23"
      }
    },
    {
      "key": "spine",
      "text": "Of the rows tested, the bent-over row loaded the lower spine most.",
      "claim": {
        "tags": [
          "DATA",
          "MECH"
        ],
        "sources": [
          "fenwick2009"
        ],
        "note": "c18 (inferred: measured on the standing bent-over row)"
      }
    },
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
        "note": "c17"
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
    "barbend-pendlay",
    "ggr-pendlay",
    "sl-pendlay",
    "acsm2009",
    "baechle-grip",
    "macdougall1985",
    "fenwick2009",
    "odriscoll1992",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/pendlay_row.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=afe5945e79518356b05e411ad03367a002906feadf13174b8778fbe1c8be9bbb
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_bayesian_cable_curl",
  name: "Bayesian Cable Curl",
  hashes: { inputsSha256: "afe5945e79518356b05e411ad03367a002906feadf13174b8778fbe1c8be9bbb", golden: "178522ce263eee015d27df4703142d51626ab662e573754d2e7d157ea721870f" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"bayesian-cable-curl-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"bayesian-cable-curl-n-st-fore.r\" d=\"~#F12WyF1(OA1XWF1X)z1Y7R5nY1-pHuJ8V3P2hWl)kUc-3H7E7_3XcylTleO2Y3I8Gu_pX1oS5X7K6T6Oj_5zbAb-5Pj00011010020000020001010002020000000000000210100000010110020200000200000120000010\"/><path id=\"bayesian-cable-curl-n-st-fist.r\" d=\"~~YSx1DSI1Ft2\"/><path id=\"bayesian-cable-curl-n-g0-fore.r\" d=\"~#F12H-E1!xB1KwF1zGA1A3*8e_1-3UE1W4-7!1.1U5TtD8KaY1zax4RcY4-tvI2X1*8xaSD1tS12R9z9V1Rc!fX2SfJ6Hj00100200000001012120010000101000002000011120001000000101010100000001000000000000\"/><path id=\"bayesian-cable-curl-n-g0-fist.r\" d=\"~~PID1WxN1Ft2\"/><path id=\"bayesian-cable-curl-n-g1-fore.r\" d=\"~#F12(.E1(VB1RTE1R*A1R2z9H1D1YjWy1nx9gT2KcOroEdG4G9Ta*7zdBrE2E1O6K6_dJB16_1O5-7I8_3B1FkU6FeHgDc20020011112002100001000000000000200020000002002000100000001002002100011001000000\"/><path id=\"bayesian-cable-curl-n-g1-fist.r\" d=\"~~DWI1FIK1Ft2\"/><path id=\"bayesian-cable-curl-n-g2-fore.r\" d=\"~#F12UGF1!AD1XUE1VVB1K7x6!18wA1Ah-5x7x1I2*pKf)6Gb.8x5GddEqXeV26*8K1Yw1UmD1N1*8G3-4w8YaDhUd(7Hkk00101000020200000020000000010102101010000100100000100000000002121000210000020000\"/><path id=\"bayesian-cable-curl-n-g2-fist.r\" d=\"~~DVO1!WG1Ft2\"/><path id=\"bayesian-cable-curl-n-e-thigh.l\" d=\"~#F12PSH1_KJ1E_G1zHI1X6O8viAvFP1D1*8eG4)lKI1j-nz9zgBkTcxqzG1*3*1G8K3SpJT1y1h*3zaxuW4w1NH1FgSs(z1Pm10120000110001010100000001011100001010000101001210101000000200002000100000010010\"/><path id=\"bayesian-cable-curl-n-e-kneecap.l\" d=\"~~_XP1WyV1wG11\"/><path id=\"bayesian-cable-curl-n-e-shank.l\" d=\"~#F12NWP1J)U1E*P1TUT1P2RaA103_-1w6V6!2O3H1E*1W7*bs.aV5*cF8.!1B2V3*4V7*8A-1z13r.aOcW9-dSlT1_jHaPn00000000010000000020001002002000020000000002000101000200000000002000200000002021\"/><path id=\"bayesian-cable-curl-n-e-foot.l\" d=\"~#o2yHP1HG)1B_P1xJ(1Yb(2ygG7Nn*l(R2*2ED2I4zz1I7.l2zD1J4EaVbJqEaKkJn100000101000000000000000002000001000000020210000\"/><path id=\"bayesian-cable-curl-n-e-shcap.l\" d=\"~~wOK1FEv!I12\"/><path id=\"bayesian-cable-curl-n-e-upper.l\" d=\"~#F12J.K1YFuRKN1BXtY4E446XlWp(4vN2h_i*bSi.5Ja-aJ5XiDbBjiK2q)4)oUm35y4X4.4KgBpA8Ge_eB7Np00200001110101100000000000000210000020101000001010010000000210110100020000000000\"/><path id=\"bayesian-cable-curl-n-e-elbowcap.l\" d=\"~~SFG1P(z1Dw10\"/><path id=\"bayesian-cable-curl-n-e-fore.l\" d=\"~#F12FGG1NHA1KBG1XYz1tX6A1u_cYosX6u*1I5)e_1zdX3T9*9V8x6Xe.1rB5I4!6wr7H1X3O5ObB4V2DkW5YeFfHd00010002200000010020000000000010002101000000000002200101202000010010000020000000\"/><path id=\"bayesian-cable-curl-n-e-fist.l\" d=\"~~FSI1(YG1Ft2\"/><path id=\"bayesian-cable-curl-n-e-head\" d=\"~#w12_HO1P(l).K1VVlRhPhOh_8Ga*2.2J4K4E7G7GaxgKkJ4XbK1X8Th1SkBaNk-5wj!2UhUeO1Sh0000010020010100001210000120002000010000100000021000002001010002\"/><path id=\"bayesian-cable-curl-n-e-torso\" d=\"~#_12((K1PGqXEN1x)o)8BcI96U5wjS7P7U8Sg_5A1T1VmVixbGcw2DfK1_jz2!mOa!iVcw6X7I4-fGiGA1G5KqX5x1R8V1W8UgN1W7zaI9VfJ4I9ShS45J6I7(2HexJ2Ht02020000000000020010000000010101010100020000000000020020020101111111100000200000001100000000200000101000001111101000\"/><path id=\"bayesian-cable-curl-n-e-thigh.r\" d=\"~#F12AHH1DwI1IKH1zVG10*az13X5A-1P6E6w3z3!9VO1Ne)i_2Ei.7OmF5KP1.1.3I4*7)bDY1D14F3GaOqzfTp_x1z5Pw1yewF100010100000000100100010100200000000020012002200010000000200210000000000200200000\"/><path id=\"bayesian-cable-curl-n-e-kneecap.r\" d=\"~~(NG1FKW1wG11\"/><path id=\"bayesian-cable-curl-n-e-shank.r\" d=\"~#F12USG1w-V1EHH1XUU1U6T8uiRnWU1F8V3(3)1FqKX1_bX7D5T94zeDw1BU1dI4I1*8KvNP1tfU3EaGfY3OlyeK9Nh5Wp01000202100000200000202000020010100000000001000001010020000002200001100000101000\"/><path id=\"bayesian-cable-curl-n-e-foot.r\" d=\"~#o2YRA1HG)1-xB1xJ(1Ub(2DgG7Jn*l(R2*2ED2I4zz1I7*l2)B1J4GaVbJqEaOkJn001000000000100010000000000000000010000000010000\"/><path id=\"bayesian-cable-curl-n-e-shcap.r\" d=\"^12\"/><path id=\"bayesian-cable-curl-n-e-upper.r\" d=\"~#F12!.K1FFuRTN1-Rty6I564EtJw1!5.1!2tUszlUiV5WaTaS5TiDlTsu.2!1.5Iw1Ft35J5x6X9BbIpW7OePeV7Jp00000211100000011000000200010100001010000000000220000000201200200000002001101000\"/><path id=\"bayesian-cable-curl-n-e-elbowcap.r\" d=\"~~F_E1YEB1Dw10\"/><path id=\"bayesian-cable-curl-n-e-fore.r\" d=\"~#F12J*F1FGD1RzF1XFD1R9nW1pHE1V6.8K2B2G1zuD2zcB5GasxbH7)tw3x2W1B8(3_E19_1kB9H2iH9Yiw8WfK1(gxb00000000010111001001200101002010101200000010100001111100022000001000200000100000\"/><path id=\"bayesian-cable-curl-n-e-fist.r\" d=\"~~N_P1YNA1Ft2\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#bayesian-cable-curl-n-dots)\"/>\n  <path class=\"datum\" d=\"~M(_N1FEvL0Py5\"/><path class=\"floorline\" d=\"M49.96 338.83H308.04\"/><path class=\"eq\" d=\"~My-bSyy2LHHa0QF60xAaE6LE6xiQ0E6E6yiLxAaF6QE60yAaF6LF6yiQ0F6F6xiZ\"/><path class=\"eq\" d=\"~MD!bDBaL_Y70QJ90KO7I9LI9xmQ0I9I9ymLKO7J9QI90NO7J9LJ9ymQ0J9J9xmZ\"/><path class=\"eq\" d=\"~MUWiSyy2LHt0QF60xnE6LE6THX1Q0E6E6UHX1LxnF6QE60ynF6LF6UHX1Q0F6F6THX1Z\"/><path class=\"eq\" d=\"~MF*bSyy2LHt0QF60xnE6LE6THX1Q0E6E6UHX1LxnF6QE60ynF6LF6UHX1Q0F6F6THX1Z\"/><path class=\"eq-solid\" d=\"~~H.eW)bFt2\"/><path class=\"eq-pin\" d=\"~~HSfW)bF60\"/><path class=\"eq-solid\" d=\"~~D_jW)bFt2\"/><path class=\"eq-pin\" d=\"~~DRkW)bF60\"/><path class=\"eq-solid\" d=\"~~_Rj_!*1UB10\"/><path class=\"eq-pin\" d=\"~~DRk_!*1F60\"/><path class=\"eq-cable\" d=\"~MSYfNybL!(40\"/><path class=\"eq-cable\" d=\"~MYUlW)bLH8A*R1\"/><path class=\"eq-thin\" d=\"~MYNeJPw2L0*NK1\"/><path class=\"eq-thin\" d=\"~MJyhJPw2L0*NK1\"/><path class=\"eq\" d=\"~M(.dSyy2LH-30QF60xT3E6LE6KvQ0E6E6NvLxT3F6QE60yT3F6LF6NvQ0F6F6KvZ\"/><path class=\"eq\" d=\"~MWVdJ)-1L_B40L-B4wR6L-B4)P6Z\"/><path class=\"eq-thin\" d=\"M70.03 326.96H91.44M70.03 323.61H91.44M70.03 320.27H91.44M70.03 316.93H91.44M70.03 313.58H91.44M70.03 310.24H91.44M70.03 306.89H91.44M70.03 303.55H91.44M70.03 300.2H91.44\"/><path class=\"arc measure\" d=\"M239.83 159.88L239.83 175.88A16 16 0 0 1 228.51 171.2Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#bayesian-cable-curl-n-st-fore.r\"/><use href=\"#bayesian-cable-curl-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bayesian-cable-curl-n-st-fore.r\"/><use href=\"#bayesian-cable-curl-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-cable\" d=\"~MNwky)!1Lw_hO-d\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bayesian-cable-curl-n-g0-fore.r\"/><use href=\"#bayesian-cable-curl-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bayesian-cable-curl-n-g0-fore.r\"/><use href=\"#bayesian-cable-curl-n-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MN_B1SBO1LK2)S1L_D1!mLrPV1L-jHfLxU1OcZ\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-cable\" d=\"~MHzkw*!1LY(mISe\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bayesian-cable-curl-n-g1-fore.r\"/><use href=\"#bayesian-cable-curl-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bayesian-cable-curl-n-g1-fore.r\"/><use href=\"#bayesian-cable-curl-n-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MyyI1UHN1LH2)S1LPA1JqL-5DV1LBlNdLTS1GhZ\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-cable\" d=\"~MNykS*!1LN)q*Bi\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bayesian-cable-curl-n-g2-fore.r\"/><use href=\"#bayesian-cable-curl-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bayesian-cable-curl-n-g2-fore.r\"/><use href=\"#bayesian-cable-curl-n-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~M!xO1UXH1LuxT1LDB1JpLI4JV1LXkweLzT1)fZ\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MWVdNTB1L_B40L-B4N*3L-B4K*3Z\"/><path class=\"eq-thin\" d=\"M70.03 209.27H91.44M70.03 205.93H91.44M70.03 202.58H91.44M70.03 199.24H91.44M70.03 195.89H91.44\"/><path class=\"eq-cable\" d=\"~MSYfW)bL0YTp\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bayesian-cable-curl-n-e-thigh.l\"/><use href=\"#bayesian-cable-curl-n-e-kneecap.l\"/><use href=\"#bayesian-cable-curl-n-e-shank.l\"/><use href=\"#bayesian-cable-curl-n-e-foot.l\"/><use href=\"#bayesian-cable-curl-n-e-shcap.l\"/><use href=\"#bayesian-cable-curl-n-e-upper.l\"/><use href=\"#bayesian-cable-curl-n-e-elbowcap.l\"/><use href=\"#bayesian-cable-curl-n-e-fore.l\"/><use href=\"#bayesian-cable-curl-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bayesian-cable-curl-n-e-thigh.l\"/><use href=\"#bayesian-cable-curl-n-e-kneecap.l\"/><use href=\"#bayesian-cable-curl-n-e-shank.l\"/><use href=\"#bayesian-cable-curl-n-e-foot.l\"/><use href=\"#bayesian-cable-curl-n-e-shcap.l\"/><use href=\"#bayesian-cable-curl-n-e-upper.l\"/><use href=\"#bayesian-cable-curl-n-e-elbowcap.l\"/><use href=\"#bayesian-cable-curl-n-e-fore.l\"/><use href=\"#bayesian-cable-curl-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bayesian-cable-curl-n-e-head\"/><use href=\"#bayesian-cable-curl-n-e-torso\"/><use href=\"#bayesian-cable-curl-n-e-thigh.r\"/><use href=\"#bayesian-cable-curl-n-e-kneecap.r\"/><use href=\"#bayesian-cable-curl-n-e-shank.r\"/><use href=\"#bayesian-cable-curl-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bayesian-cable-curl-n-e-head\"/><use href=\"#bayesian-cable-curl-n-e-torso\"/><use href=\"#bayesian-cable-curl-n-e-thigh.r\"/><use href=\"#bayesian-cable-curl-n-e-kneecap.r\"/><use href=\"#bayesian-cable-curl-n-e-shank.r\"/><use href=\"#bayesian-cable-curl-n-e-foot.r\"/></g></g><path class=\"eq-cable\" d=\"~MP)jY)!1LyIsXIn\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bayesian-cable-curl-n-e-shcap.r\"/><use href=\"#bayesian-cable-curl-n-e-upper.r\"/><use href=\"#bayesian-cable-curl-n-e-elbowcap.r\"/><use href=\"#bayesian-cable-curl-n-e-fore.r\"/><use href=\"#bayesian-cable-curl-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bayesian-cable-curl-n-e-shcap.r\"/><use href=\"#bayesian-cable-curl-n-e-upper.r\"/><use href=\"#bayesian-cable-curl-n-e-elbowcap.r\"/><use href=\"#bayesian-cable-curl-n-e-fore.r\"/><use href=\"#bayesian-cable-curl-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MSHP1wUB1L)3.S1LNE1UlLsPV1LKjwgLGU1)aZ\"/><circle class=\"joint\" cx=\"239.83\" cy=\"159.88\" r=\"2.25\"/><circle class=\"joint\" cx=\"209.03\" cy=\"190.68\" r=\"2.25\"/><circle class=\"joint\" cx=\"227.77\" cy=\"221.94\" r=\"2.25\"/><circle class=\"joint\" cx=\"218.87\" cy=\"278.6\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#H20PGA1U(J1X!z1RXJ1ajcn8j6n8l6n2l6n1n4n1n3l0n5n5n3l9l7lbl7jdldjbfflhddjjdfdlfhblbj9l9l7l7n70002002100020010102000200010100020101020000010120000001011110020001010000010002000011010100220010110000001000020001010002002000220000002000100010000\"/><path class=\"arrow\" d=\"~My.R1HxD1LA9(F1LOK1)R1Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M239.83 175.88A16 16 0 0 1 228.51 171.2\"/><g class=\"arc-ticks\"><path d=\"~M(_N1FSx1L0FY1\"/><path d=\"~M!BK1H!w1LXE1YE1\"/></g><path class=\"leader\" d=\"~M!OK1DOy1LJT8*W7\"/></g></g><path class=\"leader\" d=\"~MN_F1YNA1L0XG1\"/><circle class=\"anchor\" cx=\"209.03\" cy=\"186.68\" r=\"1.5\"/><path class=\"leader\" d=\"M237.17 152.99L216.65 114H206.65\"/><circle class=\"anchor\" cx=\"237.17\" cy=\"152.99\" r=\"1.5\"/><path class=\"leader\" d=\"M216.22 184.69L175.68 210H165.68\"/><circle class=\"anchor\" cx=\"216.22\" cy=\"184.69\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"bayesian-cable-curl-n-behind\" data-key=\"behind\" data-cue=\"Start with the working arm drawn back behind your torso, cable taut.\" class=\"plate-callout two\" style=\"left:33.52%;top:39.11%\" aria-pressed=\"true\">Arm behind<br>body</button><button type=\"button\" id=\"bayesian-cable-curl-n-still\" data-key=\"still\" data-cue=\"Keep the upper arm still. Only the forearm travels.\" class=\"plate-callout two\" style=\"left:36.31%;top:25.7%\" aria-pressed=\"false\">Upper arm<br>still</button><button type=\"button\" id=\"bayesian-cable-curl-n-close\" data-key=\"close\" data-cue=\"Keep the elbow close to your body.\" class=\"plate-callout two\" style=\"left:32.4%;top:52.51%\" aria-pressed=\"false\">Elbow<br>close</button><span class=\"plate-arc-label\" style=\"left:78.21%;top:36.31%\"><b>Upper arm</b><span>about 45°</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"bayesian-cable-curl-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"bayesian-cable-curl-m-st-fore.r\" d=\"^0\"/><path id=\"bayesian-cable-curl-m-st-fist.r\" d=\"^1\"/><path id=\"bayesian-cable-curl-m-g0-fore.r\" d=\"^2\"/><path id=\"bayesian-cable-curl-m-g0-fist.r\" d=\"^3\"/><path id=\"bayesian-cable-curl-m-g1-fore.r\" d=\"^4\"/><path id=\"bayesian-cable-curl-m-g1-fist.r\" d=\"^5\"/><path id=\"bayesian-cable-curl-m-g2-fore.r\" d=\"^6\"/><path id=\"bayesian-cable-curl-m-g2-fist.r\" d=\"^7\"/><path id=\"bayesian-cable-curl-m-e-thigh.l\" d=\"^8\"/><path id=\"bayesian-cable-curl-m-e-kneecap.l\" d=\"^9\"/><path id=\"bayesian-cable-curl-m-e-shank.l\" d=\"^10\"/><path id=\"bayesian-cable-curl-m-e-foot.l\" d=\"^11\"/><path id=\"bayesian-cable-curl-m-e-shcap.l\" d=\"^12\"/><path id=\"bayesian-cable-curl-m-e-upper.l\" d=\"^13\"/><path id=\"bayesian-cable-curl-m-e-elbowcap.l\" d=\"^14\"/><path id=\"bayesian-cable-curl-m-e-fore.l\" d=\"^15\"/><path id=\"bayesian-cable-curl-m-e-fist.l\" d=\"^16\"/><path id=\"bayesian-cable-curl-m-e-head\" d=\"^17\"/><path id=\"bayesian-cable-curl-m-e-torso\" d=\"^18\"/><path id=\"bayesian-cable-curl-m-e-thigh.r\" d=\"^19\"/><path id=\"bayesian-cable-curl-m-e-kneecap.r\" d=\"^20\"/><path id=\"bayesian-cable-curl-m-e-shank.r\" d=\"^21\"/><path id=\"bayesian-cable-curl-m-e-foot.r\" d=\"^22\"/><path id=\"bayesian-cable-curl-m-e-shcap.r\" d=\"^12\"/><path id=\"bayesian-cable-curl-m-e-upper.r\" d=\"^23\"/><path id=\"bayesian-cable-curl-m-e-elbowcap.r\" d=\"^24\"/><path id=\"bayesian-cable-curl-m-e-fore.r\" d=\"^25\"/><path id=\"bayesian-cable-curl-m-e-fist.r\" d=\"^26\"/><path id=\"bayesian-cable-curl-m-m-eq0\" d=\"~MJ-S1FUtLG9BS1LSG1JhLJ6DV1LTh!hLBV1K5Z\"/><path id=\"bayesian-cable-curl-m-mf-head\" d=\"^17\"/><path id=\"bayesian-cable-curl-m-mf-torso\" d=\"^18\"/><path id=\"bayesian-cable-curl-m-mf-thigh.l\" d=\"^8\"/><path id=\"bayesian-cable-curl-m-mf-kneecap.l\" d=\"^9\"/><path id=\"bayesian-cable-curl-m-mf-shank.l\" d=\"^10\"/><path id=\"bayesian-cable-curl-m-mf-foot.l\" d=\"^11\"/><path id=\"bayesian-cable-curl-m-mf-shcap.l\" d=\"^12\"/><path id=\"bayesian-cable-curl-m-mf-upper.l\" d=\"^13\"/><path id=\"bayesian-cable-curl-m-mf-elbowcap.l\" d=\"^14\"/><path id=\"bayesian-cable-curl-m-mf-fore.l\" d=\"^15\"/><path id=\"bayesian-cable-curl-m-mf-fist.l\" d=\"^16\"/><path id=\"bayesian-cable-curl-m-mf-thigh.r\" d=\"^19\"/><path id=\"bayesian-cable-curl-m-mf-kneecap.r\" d=\"^20\"/><path id=\"bayesian-cable-curl-m-mf-shank.r\" d=\"^21\"/><path id=\"bayesian-cable-curl-m-mf-foot.r\" d=\"^22\"/><path id=\"bayesian-cable-curl-m-mf-shcap.r\" d=\"^12\"/><path id=\"bayesian-cable-curl-m-mf-upper.r\" d=\"~#F12!.K1HDw1IBK1TNvO5x665Jw1Ft-1.5v.2BlTsT5TiTaTaTiV5Tszl-2t*5.1FtJw154z6I5zbY9W7JpPePeJpW700000200000000001200000000100000000101000200000011000010110210200000000100000000\"/><path id=\"bayesian-cable-curl-m-mf-elbowcap.r\" d=\"~~D.T1YEB1Dw10\"/><path id=\"bayesian-cable-curl-m-mf-fore.r\" d=\"~#F12!!V1_AB1I!V1T(B1nS9pV1V6GE1K2!8G1D2F2AuG5Dcw1DaD7Aby3yuW1(1(3F87-E1g-1N2F9D9ly8ViI1VfBb*g20200000000010000200010000101001210000000021010000200011010100110001010000121000\"/><path id=\"bayesian-cable-curl-m-mf-fist.r\" d=\"~~ABT1PHsFt2\"/><path id=\"bayesian-cable-curl-m-mo-0\" d=\"^17\"/><path id=\"bayesian-cable-curl-m-mo-1\" d=\"^18\"/><path id=\"bayesian-cable-curl-m-mo-2\" d=\"^8\"/><path id=\"bayesian-cable-curl-m-mo-3\" d=\"^9\"/><path id=\"bayesian-cable-curl-m-mo-4\" d=\"^10\"/><path id=\"bayesian-cable-curl-m-mo-5\" d=\"^11\"/><path id=\"bayesian-cable-curl-m-mo-6\" d=\"^12\"/><path id=\"bayesian-cable-curl-m-mo-7\" d=\"^13\"/><path id=\"bayesian-cable-curl-m-mo-8\" d=\"^14\"/><path id=\"bayesian-cable-curl-m-mo-9\" d=\"^15\"/><path id=\"bayesian-cable-curl-m-mo-10\" d=\"^16\"/><path id=\"bayesian-cable-curl-m-mo-11\" d=\"^19\"/><path id=\"bayesian-cable-curl-m-mo-12\" d=\"^20\"/><path id=\"bayesian-cable-curl-m-mo-13\" d=\"^21\"/><path id=\"bayesian-cable-curl-m-mo-14\" d=\"^22\"/><path id=\"bayesian-cable-curl-m-mo-15\" d=\"^12\"/><path id=\"bayesian-cable-curl-m-mo-16\" d=\"^23\"/><path id=\"bayesian-cable-curl-m-mo-17\" d=\"^24\"/><path id=\"bayesian-cable-curl-m-mo-18\" d=\"^25\"/><path id=\"bayesian-cable-curl-m-mo-19\" d=\"^26\"/><path id=\"bayesian-cable-curl-m-mo-20\" d=\"^29\"/><path id=\"bayesian-cable-curl-m-mo-21\" d=\"^30\"/><path id=\"bayesian-cable-curl-m-mo-22\" d=\"^31\"/><path id=\"bayesian-cable-curl-m-mo-23\" d=\"^32\"/><path id=\"bayesian-cable-curl-m-mo-24\" d=\"^33\"/><path id=\"bayesian-cable-curl-m-mo-25\" d=\"^34\"/><path id=\"bayesian-cable-curl-m-mo-26\" d=\"^35\"/><path id=\"bayesian-cable-curl-m-mo-27\" d=\"^36\"/><path id=\"bayesian-cable-curl-m-mo-28\" d=\"^37\"/><path id=\"bayesian-cable-curl-m-mo-29\" d=\"^38\"/><path id=\"bayesian-cable-curl-m-mo-30\" d=\"^43\"/><path id=\"bayesian-cable-curl-m-mo-31\" d=\"^44\"/><path id=\"bayesian-cable-curl-m-mo-32\" d=\"^53\"/><path id=\"bayesian-cable-curl-m-mo-33\" d=\"^57\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#bayesian-cable-curl-m-dots)\"/>\n  <path class=\"floorline\" d=\"^28\"/><path class=\"eq\" d=\"^29\"/><path class=\"eq\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq\" d=\"^32\"/><path class=\"eq-solid\" d=\"^33\"/><path class=\"eq-pin\" d=\"^34\"/><path class=\"eq-solid\" d=\"^35\"/><path class=\"eq-pin\" d=\"^36\"/><path class=\"eq-solid\" d=\"^37\"/><path class=\"eq-pin\" d=\"^38\"/><path class=\"eq-cable\" d=\"^39\"/><path class=\"eq-cable\" d=\"^40\"/><path class=\"eq-thin\" d=\"^41\"/><path class=\"eq-thin\" d=\"^42\"/><path class=\"eq\" d=\"^43\"/><path class=\"eq\" d=\"^44\"/><path class=\"eq-thin\" d=\"^45\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#bayesian-cable-curl-m-st-fore.r\"/><use href=\"#bayesian-cable-curl-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bayesian-cable-curl-m-st-fore.r\"/><use href=\"#bayesian-cable-curl-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-cable\" d=\"^47\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bayesian-cable-curl-m-g0-fore.r\"/><use href=\"#bayesian-cable-curl-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bayesian-cable-curl-m-g0-fore.r\"/><use href=\"#bayesian-cable-curl-m-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^48\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-cable\" d=\"^49\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bayesian-cable-curl-m-g1-fore.r\"/><use href=\"#bayesian-cable-curl-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bayesian-cable-curl-m-g1-fore.r\"/><use href=\"#bayesian-cable-curl-m-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^50\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-cable\" d=\"^51\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bayesian-cable-curl-m-g2-fore.r\"/><use href=\"#bayesian-cable-curl-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bayesian-cable-curl-m-g2-fore.r\"/><use href=\"#bayesian-cable-curl-m-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^52\"/></g><g class=\"pose-end\"><path class=\"eq\" d=\"^53\"/><path class=\"eq-thin\" d=\"^54\"/><path class=\"eq-cable\" d=\"^55\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#bayesian-cable-curl-m-e-thigh.l\"/><use href=\"#bayesian-cable-curl-m-e-kneecap.l\"/><use href=\"#bayesian-cable-curl-m-e-shank.l\"/><use href=\"#bayesian-cable-curl-m-e-foot.l\"/><use href=\"#bayesian-cable-curl-m-e-shcap.l\"/><use href=\"#bayesian-cable-curl-m-e-upper.l\"/><use href=\"#bayesian-cable-curl-m-e-elbowcap.l\"/><use href=\"#bayesian-cable-curl-m-e-fore.l\"/><use href=\"#bayesian-cable-curl-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#bayesian-cable-curl-m-e-thigh.l\"/><use href=\"#bayesian-cable-curl-m-e-kneecap.l\"/><use href=\"#bayesian-cable-curl-m-e-shank.l\"/><use href=\"#bayesian-cable-curl-m-e-foot.l\"/><use href=\"#bayesian-cable-curl-m-e-shcap.l\"/><use href=\"#bayesian-cable-curl-m-e-upper.l\"/><use href=\"#bayesian-cable-curl-m-e-elbowcap.l\"/><use href=\"#bayesian-cable-curl-m-e-fore.l\"/><use href=\"#bayesian-cable-curl-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#bayesian-cable-curl-m-e-head\"/><use href=\"#bayesian-cable-curl-m-e-torso\"/><use href=\"#bayesian-cable-curl-m-e-thigh.r\"/><use href=\"#bayesian-cable-curl-m-e-kneecap.r\"/><use href=\"#bayesian-cable-curl-m-e-shank.r\"/><use href=\"#bayesian-cable-curl-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#bayesian-cable-curl-m-e-head\"/><use href=\"#bayesian-cable-curl-m-e-torso\"/><use href=\"#bayesian-cable-curl-m-e-thigh.r\"/><use href=\"#bayesian-cable-curl-m-e-kneecap.r\"/><use href=\"#bayesian-cable-curl-m-e-shank.r\"/><use href=\"#bayesian-cable-curl-m-e-foot.r\"/></g></g><path class=\"eq-cable\" d=\"^56\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#bayesian-cable-curl-m-e-shcap.r\"/><use href=\"#bayesian-cable-curl-m-e-upper.r\"/><use href=\"#bayesian-cable-curl-m-e-elbowcap.r\"/><use href=\"#bayesian-cable-curl-m-e-fore.r\"/><use href=\"#bayesian-cable-curl-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#bayesian-cable-curl-m-e-shcap.r\"/><use href=\"#bayesian-cable-curl-m-e-upper.r\"/><use href=\"#bayesian-cable-curl-m-e-elbowcap.r\"/><use href=\"#bayesian-cable-curl-m-e-fore.r\"/><use href=\"#bayesian-cable-curl-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^57\"/><circle class=\"joint\" cx=\"239.83\" cy=\"159.88\" r=\"2.25\"/><circle class=\"joint\" cx=\"209.03\" cy=\"190.68\" r=\"2.25\"/><circle class=\"joint\" cx=\"227.77\" cy=\"221.94\" r=\"2.25\"/><circle class=\"joint\" cx=\"218.87\" cy=\"278.6\" r=\"2.25\"/></g><mask id=\"bayesian-cable-curl-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#bayesian-cable-curl-m-mf-head\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-torso\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-shank.l\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-foot.l\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-upper.l\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-fore.l\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-fist.l\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-shank.r\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-foot.r\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-upper.r\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-fore.r\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mf-fist.r\" fill=\"#000\"/><use href=\"#bayesian-cable-curl-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#bayesian-cable-curl-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#bayesian-cable-curl-m-mmask)\"><g class=\"u-stroke\"><use href=\"#bayesian-cable-curl-m-m-eq0\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~M!.K1HDw1LJ2S3La7L65L65L13L03L30L73L71L33L35L10L03L10L02L40L53Lb9L11L20L88LecLkiLqoLw1uLqoLkkLecL88L23L55LbdL79L15L01L03L10L03L10L20L24L88L00L01L57L9dLbfLhlLhnLffLbfL9bL5dL39L15L47L07L0dL17L37L39L53L33L73L33L37L13L77L51L91L93Lb0L70L54L91L73Lb5Ld9LfdLhdLjhLnfLhfLb5L77L11L24L44L86L11L10L00L30L01L50L11Lb9Ld9L73L00L68LccLimLssLquLqqLikLceL88L22L33L97L57L42L12L20L11L31L13L55L33L09L33L11L32L54L56L7aL94L90L94L36L08L2cL6gL8gLaiL0gL2gL6aL4cL86L86L86L84L2aL8aL84L88Le2Lc4Li2Li6LiaLe6La4Lc1L45L25L2b\"/><path class=\"m-line\" d=\"~MS.V1YEB1LK2HcLR4.1LK3K3L.1R4L0.4L!1R4LN3K3LS4.1L!40LS4_1LN3S3L!1P4L0!4L.1P4LK3S3LR4_1\"/><path class=\"m-line\" d=\"~M!!V1_AB1LiI3L90L31L52L02L14L06L28L2aL06L08L02L14L21L10L15L46L1aL44L33L07L3hL3pL3tL5B1L5z1L1nL3hL17L02L3cL2gL0kL14L16L14L02L02L02L11L07L15L11L02L08L2eL0iL4oL2oL4mL2iL2cL1cL16L34L32L72L16L36L16L16L06L24L26L22L36L26L14L46L44L28L84L42L60L44L44L2cL0eL4iL1kL2qL2mL2kL0eL26L24L11L27L07L00L20L12L42L04L46L24L4gL2mL28L40L05L0hL1pL0x1L1B1L0x1L0nL0fL0bL03L06L2aL14L23L10L21L02L04L26L28L08L0aL04L06L40L42L63L80L41L68L40L60L45L47L49L2fL8dL6bL47L47L29L27L37L35L05L29L25L37L07L79L35L9bL79L5fL59L55L35L50L32L38\"/><path class=\"m-line\" d=\"~MW)U1PHsL3_2L92L71L93L53L91L75L35L77L53L57L19L35L39L17L29L17L09L27L69L05L69L27La3L47L85L65L81La3L83L81L82Lc1L80L82L84La4L84L62L8aL44La8L26L68L0aL68L28L08L1cL28L18L38L3aL18L56L58L74L3aL72L94L54L94L72L90\"/><path class=\"m-line\" d=\"~MU!jNy*1LY!uBNv\"/><path class=\"leader m\" d=\"~MJ.U1YwD1L0YK1\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"bayesian-cable-curl-m-swing\" data-key=\"swing\" data-cue=\"Your upper arm swings forward so the shoulder helps lift the handle.\" class=\"plate-callout two m\" style=\"left:72.07%;top:55.31%\" aria-pressed=\"true\">Upper arm<br>swings</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "behind",
        cues: [{ key: "behind", cue: "Start with the working arm drawn back behind your torso, cable taut." }, { key: "still", cue: "Keep the upper arm still. Only the forearm travels." }, { key: "close", cue: "Keep the elbow close to your body." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "swing",
        cues: [{ key: "swing", cue: "Your upper arm swings forward so the shoulder helps lift the handle." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Upper arm swings</b><span>Your upper arm swings forward so the shoulder helps lift the handle.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: curl 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Curl</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Bayesian cable curl, side view. Standing in a split stance facing away from a low cable pulley, leaning slightly forward, the working arm drawn back behind the torso. The upper arm stays still while the elbow bends to bring the handle forward and up toward the shoulder.",
      mistakeAlt: "Bayesian Cable Curl: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP: the card gives no thumb, contact or wrist claim."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set the cable to its lowest height with a single handle.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-bayesian",
          "sl-bayesian"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "grip",
      "text": "Handle in your working hand, back to the machine.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-bayesian",
          "sl-bayesian"
        ],
        "note": "c1 (card grip.type)"
      }
    },
    {
      "kind": "position",
      "text": "Step forward to light tension, arm behind you, torso leaning slightly forward.",
      "zoom": "bayes-reach",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-bayesian",
          "bb-bayesian"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "safety",
      "text": "Stand closer if your shoulder feels restricted.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-bayesian"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "brace",
      "text": "Brace the trunk, no tilting. Free hand on your hip.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-bayesian"
        ],
        "note": "c7"
      }
    }
  ],
  posture: [
    {
      "key": "lean",
      "label": "Slight lean",
      "detail": "Torso leans slightly forward.",
      "anchor": {
        "pose": "start",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-bayesian",
          "bb-bayesian"
        ],
        "note": "c2"
      }
    },
    {
      "key": "elbow",
      "label": "Elbow close",
      "detail": "Elbow stays close to the body.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-bayesian",
          "bb-bayesian"
        ],
        "note": "c4"
      }
    },
    {
      "key": "still",
      "label": "Upper arm still",
      "detail": "Upper arm stays motionless. Only the elbow bends.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "zoom": "bayes-arm",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-bayesian",
          "sl-bayesian"
        ],
        "note": "c5, c4"
      }
    },
    {
      "key": "trunk",
      "label": "Trunk braced",
      "detail": "Trunk braced, no tilting side to side. Free hand on your hip.",
      "anchor": {
        "pose": "end",
        "at": "backMid"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-bayesian"
        ],
        "note": "c7"
      }
    },
    {
      "key": "lower",
      "label": "Slow lowering",
      "detail": "Lower slowly.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-bayesian"
        ],
        "note": "c6"
      }
    },
    {
      "key": "far",
      "label": "Standing too far",
      "detail": "Stand a bit closer to the cable.",
      "anchor": {
        "pose": "start",
        "at": "heel.r"
      },
      "zoom": "bayes-reach",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-bayesian"
        ],
        "note": "c3"
      }
    }
  ],
  zooms: [
    {
      "key": "bayes-arm",
      "chip": "Upper arm",
      "heading": "Upper arm",
      "kind": "posture"
    },
    {
      "key": "bayes-reach",
      "chip": "Distance",
      "heading": "Cable distance",
      "kind": "posture",
      "feelRow": "stretch"
    }
  ],
  chips: [
    "bayes-arm",
    "bayes-reach",
    "feel"
  ],
  copy: {
    "setupLine": "Back to a low cable, one handle, one arm at a time. Lean slightly forward, arm drawn behind you.",
    "mistakeLine": "Never let the upper arm swing forward. Brace your trunk so you do not tilt side to side.",
    "cueLine": "Elbow close, lower slowly."
  },
  mistakes: [],
  risks: [
    {
      "key": "shoulder",
      "text": "Holding the arm behind the body can cause shoulder discomfort for some people.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-bayesian"
        ],
        "note": "c9"
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
    "bb-bayesian",
    "sl-bayesian",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/bayesian_cable_curl.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

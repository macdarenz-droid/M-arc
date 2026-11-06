// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=7534fd3ed0f42f82a3cf7c89155b34050e89e017a976409eae9ac07b55ea4b25
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_resistance_band_row",
  name: "Resistance Band Row",
  hashes: { inputsSha256: "7534fd3ed0f42f82a3cf7c89155b34050e89e017a976409eae9ac07b55ea4b25", golden: "c8084092b845fbfa97caae47a3b22f3f8aa7ec1300c20347fcdb94f436771e17" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"resistance-band-row-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"resistance-band-row-n-st-shcap.l\" d=\"~~NNhWWP1DU10\"/><path id=\"resistance-band-row-n-st-upper.l\" d=\"~#F12FSiFFS1*KhB.R1*8K329YR1Wdx5G5R2K2KB1xj.fVg)gV5-mw4IG1z7O3iE7A1AP1Yi38G9R2-6JgWl_mDnW7yvK511000000010100010100000121000201011000000000200011020001000000000001010000001111\"/><path id=\"resistance-band-row-n-st-elbowcap.l\" d=\"~~wNr_.T1FD10\"/><path id=\"resistance-band-row-n-st-fore.l\" d=\"~#F12NKsFzV1EPr._U1RaV3A2fYN1F4E9K5B2B2Xy1T6KcT9)bz2*e(4)y1R5X2F1TaA2PK1Yb!1A1Eb0I2Yayj(eNiD3(mT700000000011001000000000021101200200111100001101002000000001200100000000000010000\"/><path id=\"resistance-band-row-n-st-fist.l\" d=\"~~(*B1WVV1_y11\"/><path id=\"resistance-band-row-n-st-shcap.r\" d=\"^0\"/><path id=\"resistance-band-row-n-st-upper.r\" d=\"^1\"/><path id=\"resistance-band-row-n-st-elbowcap.r\" d=\"^2\"/><path id=\"resistance-band-row-n-st-fore.r\" d=\"^3\"/><path id=\"resistance-band-row-n-st-fist.r\" d=\"^4\"/><path id=\"resistance-band-row-n-g0-shcap.r\" d=\"~~P)gWWP1DU10\"/><path id=\"resistance-band-row-n-g0-upper.r\" d=\"~#F12DIhSXR1OTgXYP1X5.787Uy1UD1K1B7nR3RlIA1G4XmGb.dEl*8GvRsB3R1X6-2Su!G174O6B7KeDa(5wvNf!iwtFc00011010011000000000001210000000020001010120000000021000110010000002000001021000\"/><path id=\"resistance-band-row-n-g0-elbowcap.r\" d=\"~~F-n(RY1FD10\"/><path id=\"resistance-band-row-n-g0-fore.r\" d=\"~#F12YDpF--1*FoI.-1)a2Y1z1YJ1xcOa*1X2I1xy1_5)e.4xcF2Ec_9*x1W6z2D2x9U5wN1T4D2eKa_3A1wbwnN7JiI3(izf10200100000000000000012000000000000000000000100200100020000000000010020010000100\"/><path id=\"resistance-band-row-n-g0-fist.r\" d=\"~~Wzy1wWW1_y11\"/><path id=\"resistance-band-row-n-g1-shcap.r\" d=\"~~UPgWWP1DU10\"/><path id=\"resistance-band-row-n-g1-upper.r\" d=\"~#F12FTgAER1)Eg)xP1R2G983_iJP1D1G7gO3E7XG1w4XmV5*gXg*fxj-B1R2O2G5x5!d!R1b6O3z9xhP4K5wvW7Fn!mUl20000200000200010000020000020012100000000010121010002110020100000000000002200000\"/><path id=\"resistance-band-row-n-g1-elbowcap.r\" d=\"~~HAkYG_1FD10\"/><path id=\"resistance-band-row-n-g1-fore.r\" d=\"~#F12UUlPP.1)Wk-U.1xbuY1G1WI1EfTaE1X2x1Tx1D8GfV3-by3RbWaGx1A9)1J2T8D6UK1*7A2czaP4(1!aNnY5DiV4WhKg10111101010100010000201000001210100000101012000101200002000001000100000000010100\"/><path id=\"resistance-band-row-n-g1-fist.r\" d=\"~~NGuHWX1_y11\"/><path id=\"resistance-band-row-n-g2-shcap.r\" d=\"~~WxgWWP1DU10\"/><path id=\"resistance-band-row-n-g2-upper.r\" d=\"~#F12Yxg_UP1BAgxNO1sX9a4oWT1W3G6W1z3W7TG1Wb*jm.hEaVkV4xH1O1G3B3O6O4PT1725X9Rh-1*fFrpJo!dFs00002100000120000010101011012002000210010111010002110020001010100000000021010000\"/><path id=\"resistance-band-row-n-g2-elbowcap.r\" d=\"~~wAgY-_1FD10\"/><path id=\"resistance-band-row-n-g2-fore.r\" d=\"~#F12HSh(w!1GUg-z!1Bbe!1B1WJ1xdRaX1-2E1Gy1S6xfO4*bJ2BcDaxy1J7x2H2)8W5DN1O5A2aIaA4P1!aDn(6JiX3PiKf10120002201010101200000000000001000210000100202000001201110002010020002000001001\"/><path id=\"resistance-band-row-n-g2-fist.r\" d=\"~~DOqUWY1_y11\"/><path id=\"resistance-band-row-n-e-thigh.l\" d=\"~#F12_Ii_Vx2RYgzYx2-cS13H1HA2I1E8-6B4x3V-1-4KoGe)lnKpSc--1mI4!2X8D6wA2D62I1XcK2*dNx1SI1JpwE1J1FK1Em20000001110000210010121010010000100000000000021000100000000000200000000000000200\"/><path id=\"resistance-band-row-n-e-kneecap.l\" d=\"~~(EuFR)1WP10\"/><path id=\"resistance-band-row-n-e-shank.l\" d=\"~#F12HTvJzx2Twu*-w2TcG34G1WA2!1.7I7.3K3.F2O3*dO9*cI1OfN6xF2XbO4S2E9S5Sz2Nc3H1)ckDbDfDpAhPnP2AsRb00001010002001000021000200101000002000111000200000002000000000000002000000001002\"/><path id=\"resistance-band-row-n-e-foot.l\" d=\"~#o2w*I1S(x2R-H1TJx2w3xeI9-ixr.q.6Ex3E2ST2E7AH1swq_6yK1OdUcEd.uWsJn020000010100000001010000120010000010000000020000\"/><path id=\"resistance-band-row-n-e-shcap.l\" d=\"~~_SfWWP1DU10\"/><path id=\"resistance-band-row-n-e-upper.l\" d=\"~#F12yXfyyP1GEg.(N1H4X886*hNP1U5T4_2G2AmXz1AiKey7Kg*1xnUaVF13T3jE7XmJN195J3)8XfB8RoWjX9Jm_2Nv00010000002000010000000000002000000101100001200020000100010002011100220010022000\"/><path id=\"resistance-band-row-n-e-elbowcap.l\" d=\"~~Fxcy)-1FD10\"/><path id=\"resistance-band-row-n-e-fore.l\" d=\"~#F12PFdyE.1GHcRA.1zbR1w2rUN1*4BaR3O2X1Ez1cxex7Bc8Xd_7zz1H1O2_1*9A4YN1U2y2q)ay29AbSl!aYifwl.b00100202002000000000001000020000010000012100000000000100200101120000000020000200\"/><path id=\"resistance-band-row-n-e-fist.l\" d=\"~~(Um(W-1_y11\"/><path id=\"resistance-band-row-n-e-head\" d=\"~#w12YNi!PB1zXgKDB1-k!k.kNaEcO3I3F5G5X8T8zcBjIoF5.dX1Ka.k1JozcHo)6WmP3_kNhX1_k0000200000001000000010200212100220000000212000010020000210001010\"/><path id=\"resistance-band-row-n-e-torso\" d=\"~#_12S_gAWH1)AhVzG1Ka)1O3*5PaAgJa(a(dNh(61*6xqGoV8)dF5NhG5Um.6JoKhyjzjF5IaV8KhRtGD1BcOt*61Oa2weJhN3W8*dX8IhYb*6Uj(6(3!dB9S3Y8O_2Yy101101000000000001000000000002220000010210022000000000202000101000100000000001000011110111000000200010100100022100001\"/><path id=\"resistance-band-row-n-e-thigh.r\" d=\"^20\"/><path id=\"resistance-band-row-n-e-kneecap.r\" d=\"^21\"/><path id=\"resistance-band-row-n-e-shank.r\" d=\"^22\"/><path id=\"resistance-band-row-n-e-foot.r\" d=\"^23\"/><path id=\"resistance-band-row-n-e-shcap.r\" d=\"^24\"/><path id=\"resistance-band-row-n-e-upper.r\" d=\"^25\"/><path id=\"resistance-band-row-n-e-elbowcap.r\" d=\"^26\"/><path id=\"resistance-band-row-n-e-fore.r\" d=\"^27\"/><path id=\"resistance-band-row-n-e-fist.r\" d=\"^28\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#resistance-band-row-n-dots)\"/>\n  <path class=\"datum\" d=\"~MYNiJy)1L0.(p\"/><path class=\"floorline\" d=\"M16 339.5H342\"/><path class=\"eq\" d=\"~MHF7YDy2LFGI10QA30zDI1z3Lz3hQ0z3z3iLzDI1A3Qz30ADI1A3LA3iQ0A3A3hZ\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-n-st-shcap.l\"/><use href=\"#resistance-band-row-n-st-upper.l\"/><use href=\"#resistance-band-row-n-st-elbowcap.l\"/><use href=\"#resistance-band-row-n-st-fore.l\"/><use href=\"#resistance-band-row-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-n-st-shcap.l\"/><use href=\"#resistance-band-row-n-st-upper.l\"/><use href=\"#resistance-band-row-n-st-elbowcap.l\"/><use href=\"#resistance-band-row-n-st-fore.l\"/><use href=\"#resistance-band-row-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-n-st-shcap.r\"/><use href=\"#resistance-band-row-n-st-upper.r\"/><use href=\"#resistance-band-row-n-st-elbowcap.r\"/><use href=\"#resistance-band-row-n-st-fore.r\"/><use href=\"#resistance-band-row-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-n-st-shcap.r\"/><use href=\"#resistance-band-row-n-st-upper.r\"/><use href=\"#resistance-band-row-n-st-elbowcap.r\"/><use href=\"#resistance-band-row-n-st-fore.r\"/><use href=\"#resistance-band-row-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"~MWwO1!U!1Lx.bTY5LA_b(V5LN4K4LpD6LHYbU-5Lx_bxW5LK4S4Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-n-g0-shcap.r\"/><use href=\"#resistance-band-row-n-g0-upper.r\"/><use href=\"#resistance-band-row-n-g0-elbowcap.r\"/><use href=\"#resistance-band-row-n-g0-fore.r\"/><use href=\"#resistance-band-row-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-n-g0-shcap.r\"/><use href=\"#resistance-band-row-n-g0-upper.r\"/><use href=\"#resistance-band-row-n-g0-elbowcap.r\"/><use href=\"#resistance-band-row-n-g0-fore.r\"/><use href=\"#resistance-band-row-n-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^34\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"~MNxO1PV!1LxVf.Y4LYTfJW4LU3z5L6H6LPSfF_4LVTfOW4LT3D5Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-n-g1-shcap.r\"/><use href=\"#resistance-band-row-n-g1-upper.r\"/><use href=\"#resistance-band-row-n-g1-elbowcap.r\"/><use href=\"#resistance-band-row-n-g1-fore.r\"/><use href=\"#resistance-band-row-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-n-g1-shcap.r\"/><use href=\"#resistance-band-row-n-g1-upper.r\"/><use href=\"#resistance-band-row-n-g1-elbowcap.r\"/><use href=\"#resistance-band-row-n-g1-fore.r\"/><use href=\"#resistance-band-row-n-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^35\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"~M(xO1!V!1LBOj)Y3LUKjUW3Ly3K5LsF6L_JjU_3LTKjXW3Lx3P5Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-n-g2-shcap.r\"/><use href=\"#resistance-band-row-n-g2-upper.r\"/><use href=\"#resistance-band-row-n-g2-elbowcap.r\"/><use href=\"#resistance-band-row-n-g2-fore.r\"/><use href=\"#resistance-band-row-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-n-g2-shcap.r\"/><use href=\"#resistance-band-row-n-g2-upper.r\"/><use href=\"#resistance-band-row-n-g2-elbowcap.r\"/><use href=\"#resistance-band-row-n-g2-fore.r\"/><use href=\"#resistance-band-row-n-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^36\"/></g><g class=\"pose-end\"><path class=\"eq-line m-line\" d=\"~MyBO1JP!1LIA8V_6\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-n-e-thigh.l\"/><use href=\"#resistance-band-row-n-e-kneecap.l\"/><use href=\"#resistance-band-row-n-e-shank.l\"/><use href=\"#resistance-band-row-n-e-foot.l\"/><use href=\"#resistance-band-row-n-e-shcap.l\"/><use href=\"#resistance-band-row-n-e-upper.l\"/><use href=\"#resistance-band-row-n-e-elbowcap.l\"/><use href=\"#resistance-band-row-n-e-fore.l\"/><use href=\"#resistance-band-row-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-n-e-thigh.l\"/><use href=\"#resistance-band-row-n-e-kneecap.l\"/><use href=\"#resistance-band-row-n-e-shank.l\"/><use href=\"#resistance-band-row-n-e-foot.l\"/><use href=\"#resistance-band-row-n-e-shcap.l\"/><use href=\"#resistance-band-row-n-e-upper.l\"/><use href=\"#resistance-band-row-n-e-elbowcap.l\"/><use href=\"#resistance-band-row-n-e-fore.l\"/><use href=\"#resistance-band-row-n-e-fist.l\"/></g></g><path class=\"eq-solid\" d=\"~MJyO1yW!1LIGn)Y2LUEn_W2LW2V5LF1A6LFEnY_2LXEn-W2LT2W5Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-n-e-head\"/><use href=\"#resistance-band-row-n-e-torso\"/><use href=\"#resistance-band-row-n-e-thigh.r\"/><use href=\"#resistance-band-row-n-e-kneecap.r\"/><use href=\"#resistance-band-row-n-e-shank.r\"/><use href=\"#resistance-band-row-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-n-e-head\"/><use href=\"#resistance-band-row-n-e-torso\"/><use href=\"#resistance-band-row-n-e-thigh.r\"/><use href=\"#resistance-band-row-n-e-kneecap.r\"/><use href=\"#resistance-band-row-n-e-shank.r\"/><use href=\"#resistance-band-row-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-n-e-shcap.r\"/><use href=\"#resistance-band-row-n-e-upper.r\"/><use href=\"#resistance-band-row-n-e-elbowcap.r\"/><use href=\"#resistance-band-row-n-e-fore.r\"/><use href=\"#resistance-band-row-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-n-e-shcap.r\"/><use href=\"#resistance-band-row-n-e-upper.r\"/><use href=\"#resistance-band-row-n-e-elbowcap.r\"/><use href=\"#resistance-band-row-n-e-fore.r\"/><use href=\"#resistance-band-row-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MAGO1FS!1L(1UX1L.3RV1Lx2*1Lw2x2L0VV1L(3SV1Ly2(1Z\"/><path class=\"eq-solid\" d=\"^38\"/><circle class=\"joint\" cx=\"88.16\" cy=\"249.39\" r=\"2.25\"/><circle class=\"joint\" cx=\"67.76\" cy=\"296.81\" r=\"2.25\"/><circle class=\"joint\" cx=\"94.52\" cy=\"322.94\" r=\"2.25\"/><circle class=\"joint\" cx=\"162.66\" cy=\"325.32\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#A20SzB1!BW1XKB1BzW10000000000000000000201000000000000000000000000020100000000000000000021002000200020002000200220022002200220002101210021002100210020002000200020002002200220022002200021012100210021002100210020002000200000\"/><path class=\"arrow\" d=\"~M(Ap(H-1LPvVrL*l()1Z\"/></g><path class=\"leader\" d=\"M114 247.8L155 228H165\"/><circle class=\"anchor\" cx=\"114\" cy=\"247.8\" r=\"1.5\"/><path class=\"leader\" d=\"~MPEdy)-1L0Rw6\"/><circle class=\"anchor\" cx=\"67.76\" cy=\"296.81\" r=\"1.5\"/><path class=\"leader\" d=\"M240.81 309.85L239 304H249\"/><circle class=\"anchor\" cx=\"240.81\" cy=\"309.85\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"resistance-band-row-n-tall\" data-key=\"tall\" data-cue=\"Back straight and neutral, chest up, the same from start to finish.\" class=\"plate-callout\" style=\"left:44.69%;top:57.54%\" aria-pressed=\"true\">Sit tall</button><button type=\"button\" id=\"resistance-band-row-n-elbows\" data-key=\"elbows\" data-cue=\"Elbows travel back close to the body.\" class=\"plate-callout two\" style=\"left:0.56%;top:63.13%\" aria-pressed=\"false\">Elbows<br>to sides</button><button type=\"button\" id=\"resistance-band-row-n-band\" data-key=\"band\" data-cue=\"The band sits securely around the soles of the feet, feet flexed.\" class=\"plate-callout two\" style=\"left:68.16%;top:78.77%\" aria-pressed=\"false\">Band round<br>soles</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"resistance-band-row-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"resistance-band-row-m-st-shcap.l\" d=\"^0\"/><path id=\"resistance-band-row-m-st-upper.l\" d=\"^1\"/><path id=\"resistance-band-row-m-st-elbowcap.l\" d=\"^2\"/><path id=\"resistance-band-row-m-st-fore.l\" d=\"^3\"/><path id=\"resistance-band-row-m-st-fist.l\" d=\"^4\"/><path id=\"resistance-band-row-m-st-shcap.r\" d=\"^0\"/><path id=\"resistance-band-row-m-st-upper.r\" d=\"^1\"/><path id=\"resistance-band-row-m-st-elbowcap.r\" d=\"^2\"/><path id=\"resistance-band-row-m-st-fore.r\" d=\"^3\"/><path id=\"resistance-band-row-m-st-fist.r\" d=\"^4\"/><path id=\"resistance-band-row-m-g0-shcap.r\" d=\"^5\"/><path id=\"resistance-band-row-m-g0-upper.r\" d=\"^6\"/><path id=\"resistance-band-row-m-g0-elbowcap.r\" d=\"^7\"/><path id=\"resistance-band-row-m-g0-fore.r\" d=\"^8\"/><path id=\"resistance-band-row-m-g0-fist.r\" d=\"^9\"/><path id=\"resistance-band-row-m-g1-shcap.r\" d=\"^10\"/><path id=\"resistance-band-row-m-g1-upper.r\" d=\"^11\"/><path id=\"resistance-band-row-m-g1-elbowcap.r\" d=\"^12\"/><path id=\"resistance-band-row-m-g1-fore.r\" d=\"^13\"/><path id=\"resistance-band-row-m-g1-fist.r\" d=\"^14\"/><path id=\"resistance-band-row-m-g2-shcap.r\" d=\"^15\"/><path id=\"resistance-band-row-m-g2-upper.r\" d=\"^16\"/><path id=\"resistance-band-row-m-g2-elbowcap.r\" d=\"^17\"/><path id=\"resistance-band-row-m-g2-fore.r\" d=\"^18\"/><path id=\"resistance-band-row-m-g2-fist.r\" d=\"^19\"/><path id=\"resistance-band-row-m-e-thigh.l\" d=\"^20\"/><path id=\"resistance-band-row-m-e-kneecap.l\" d=\"^21\"/><path id=\"resistance-band-row-m-e-shank.l\" d=\"^22\"/><path id=\"resistance-band-row-m-e-foot.l\" d=\"^23\"/><path id=\"resistance-band-row-m-e-shcap.l\" d=\"^24\"/><path id=\"resistance-band-row-m-e-upper.l\" d=\"^25\"/><path id=\"resistance-band-row-m-e-elbowcap.l\" d=\"^26\"/><path id=\"resistance-band-row-m-e-fore.l\" d=\"^27\"/><path id=\"resistance-band-row-m-e-fist.l\" d=\"^28\"/><path id=\"resistance-band-row-m-e-head\" d=\"^29\"/><path id=\"resistance-band-row-m-e-torso\" d=\"^30\"/><path id=\"resistance-band-row-m-e-thigh.r\" d=\"^20\"/><path id=\"resistance-band-row-m-e-kneecap.r\" d=\"^21\"/><path id=\"resistance-band-row-m-e-shank.r\" d=\"^22\"/><path id=\"resistance-band-row-m-e-foot.r\" d=\"^23\"/><path id=\"resistance-band-row-m-e-shcap.r\" d=\"^24\"/><path id=\"resistance-band-row-m-e-upper.r\" d=\"^25\"/><path id=\"resistance-band-row-m-e-elbowcap.r\" d=\"^26\"/><path id=\"resistance-band-row-m-e-fore.r\" d=\"^27\"/><path id=\"resistance-band-row-m-e-fist.r\" d=\"^28\"/><path id=\"resistance-band-row-m-m-head\" d=\"~#w12_Oo(PF1RznTKE1EsW8Gnjz9X8O5(2hza*1-eK5OuAb-9H3xaIiX9FrkWoH5JiWdFaDpGbSh1000100000000001011010000000000000010122000100001000000000010110\"/><path id=\"resistance-band-row-m-m-torso\" d=\"~#_12AUkHHJ1)UlVyI1K7X5A20Y3DkJ7AaA7AlH1_4Dg)nY2O9Kd_5UfG9FkBcNjXm!dEnU2GbVc-e*B1)t)iVpT8PB1wE1yB1(aVS18J9za*cGjD2Ee(iF2UeDnx5sS3Bw3-b20000002100020001202101000000000220111011010000000100000000000000110000001000020000010110100000020002100020000000000\"/><path id=\"resistance-band-row-m-m-shcap.r\" d=\"~~A-i!IS1DU10\"/><path id=\"resistance-band-row-m-m-upper.r\" d=\"~#F12D.iH*R1*DjKYP1D3B9a4.bFS1y5E5N2V2UhBD1AgKgw5Eh.4TmU5TG1jR3O1z7.gYP191F2K9Rgz6xmPm-6NnS6_u20200000000000010001202000001000011100002021010000000000200020000002000000100002\"/><path id=\"resistance-band-row-m-m-elbowcap.r\" d=\"~~HKgJx!1FD10\"/><path id=\"resistance-band-row-m-m-fore.r\" d=\"~#F12WXhAG*1G-g)F*1Ebl(1x1DN1R8KaX2V2R1Ez1D3Oe)5BcF1)c_8zz1D4G2(1T9(4!N1x1A2iXay3iwbNmA9Si.1wkRd00020000200000001000110010000100002000000010100012100121002200101000000002000000\"/><path id=\"resistance-band-row-m-m-fist.r\" d=\"~~ywrW(_1_y11\"/><path id=\"resistance-band-row-m-mf-thigh.l\" d=\"~#F12UUhwNx2IxgGPx2-cP11N1FA2K1G8-6z4z3V-1X4KoEe)lpKpSc--1mI4!2X8D6wA2D62K1VcG2xeJx1UI1JpwE1J1FK1Em20000100000111111100001010000000000101000100020000000001000002000120010000200001\"/><path id=\"resistance-band-row-m-mf-kneecap.l\" d=\"~~YPtJG)1WP10\"/><path id=\"resistance-band-row-m-mf-shank.l\" d=\"~#F12D!uS.w2RGtzSw2RcG36I1SA2(1X7I7)3I3-F2T3*dI9.cK1TfJ6*E2TbT4P2z9S5Pz2Jc5N1*ciDbDfDpAhPnP2DsRb10101000000000000000120000101000000002000210002101110000020101012100202000000010\"/><path id=\"resistance-band-row-m-mf-foot.l\" d=\"~#o2_BI1YWx2IyH1-Ax2w3xeI9-ixr*q-6Bx3I2UT2B7wH1sAq_6wK1OdUcEd.uWsJn000100010101010000000200020010000101000001002000\"/><path id=\"resistance-band-row-m-mf-shcap.l\" d=\"^47\"/><path id=\"resistance-band-row-m-mf-upper.l\" d=\"^48\"/><path id=\"resistance-band-row-m-mf-elbowcap.l\" d=\"^49\"/><path id=\"resistance-band-row-m-mf-fore.l\" d=\"^50\"/><path id=\"resistance-band-row-m-mf-fist.l\" d=\"^51\"/><path id=\"resistance-band-row-m-mf-thigh.r\" d=\"^52\"/><path id=\"resistance-band-row-m-mf-kneecap.r\" d=\"^53\"/><path id=\"resistance-band-row-m-mf-shank.r\" d=\"^54\"/><path id=\"resistance-band-row-m-mf-foot.r\" d=\"^55\"/><path id=\"resistance-band-row-m-mo-0\" d=\"^29\"/><path id=\"resistance-band-row-m-mo-1\" d=\"^30\"/><path id=\"resistance-band-row-m-mo-2\" d=\"^20\"/><path id=\"resistance-band-row-m-mo-3\" d=\"^21\"/><path id=\"resistance-band-row-m-mo-4\" d=\"^22\"/><path id=\"resistance-band-row-m-mo-5\" d=\"^23\"/><path id=\"resistance-band-row-m-mo-6\" d=\"^24\"/><path id=\"resistance-band-row-m-mo-7\" d=\"^25\"/><path id=\"resistance-band-row-m-mo-8\" d=\"^26\"/><path id=\"resistance-band-row-m-mo-9\" d=\"^27\"/><path id=\"resistance-band-row-m-mo-10\" d=\"^28\"/><path id=\"resistance-band-row-m-mo-11\" d=\"^20\"/><path id=\"resistance-band-row-m-mo-12\" d=\"^21\"/><path id=\"resistance-band-row-m-mo-13\" d=\"^22\"/><path id=\"resistance-band-row-m-mo-14\" d=\"^23\"/><path id=\"resistance-band-row-m-mo-15\" d=\"^24\"/><path id=\"resistance-band-row-m-mo-16\" d=\"^25\"/><path id=\"resistance-band-row-m-mo-17\" d=\"^26\"/><path id=\"resistance-band-row-m-mo-18\" d=\"^27\"/><path id=\"resistance-band-row-m-mo-19\" d=\"^28\"/><path id=\"resistance-band-row-m-mo-20\" d=\"^33\"/><path id=\"resistance-band-row-m-mo-21\" d=\"^39\"/><path id=\"resistance-band-row-m-mo-22\" d=\"^38\"/><path id=\"resistance-band-row-m-mo-23\" d=\"^38\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#resistance-band-row-m-dots)\"/>\n  <path class=\"datum\" d=\"^31\"/><path class=\"floorline\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-m-st-shcap.l\"/><use href=\"#resistance-band-row-m-st-upper.l\"/><use href=\"#resistance-band-row-m-st-elbowcap.l\"/><use href=\"#resistance-band-row-m-st-fore.l\"/><use href=\"#resistance-band-row-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-m-st-shcap.l\"/><use href=\"#resistance-band-row-m-st-upper.l\"/><use href=\"#resistance-band-row-m-st-elbowcap.l\"/><use href=\"#resistance-band-row-m-st-fore.l\"/><use href=\"#resistance-band-row-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-m-st-shcap.r\"/><use href=\"#resistance-band-row-m-st-upper.r\"/><use href=\"#resistance-band-row-m-st-elbowcap.r\"/><use href=\"#resistance-band-row-m-st-fore.r\"/><use href=\"#resistance-band-row-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-m-st-shcap.r\"/><use href=\"#resistance-band-row-m-st-upper.r\"/><use href=\"#resistance-band-row-m-st-elbowcap.r\"/><use href=\"#resistance-band-row-m-st-fore.r\"/><use href=\"#resistance-band-row-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq-solid\" d=\"^34\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-m-g0-shcap.r\"/><use href=\"#resistance-band-row-m-g0-upper.r\"/><use href=\"#resistance-band-row-m-g0-elbowcap.r\"/><use href=\"#resistance-band-row-m-g0-fore.r\"/><use href=\"#resistance-band-row-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-m-g0-shcap.r\"/><use href=\"#resistance-band-row-m-g0-upper.r\"/><use href=\"#resistance-band-row-m-g0-elbowcap.r\"/><use href=\"#resistance-band-row-m-g0-fore.r\"/><use href=\"#resistance-band-row-m-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^34\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq-solid\" d=\"^35\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-m-g1-shcap.r\"/><use href=\"#resistance-band-row-m-g1-upper.r\"/><use href=\"#resistance-band-row-m-g1-elbowcap.r\"/><use href=\"#resistance-band-row-m-g1-fore.r\"/><use href=\"#resistance-band-row-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-m-g1-shcap.r\"/><use href=\"#resistance-band-row-m-g1-upper.r\"/><use href=\"#resistance-band-row-m-g1-elbowcap.r\"/><use href=\"#resistance-band-row-m-g1-fore.r\"/><use href=\"#resistance-band-row-m-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^35\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq-solid\" d=\"^36\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-m-g2-shcap.r\"/><use href=\"#resistance-band-row-m-g2-upper.r\"/><use href=\"#resistance-band-row-m-g2-elbowcap.r\"/><use href=\"#resistance-band-row-m-g2-fore.r\"/><use href=\"#resistance-band-row-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-m-g2-shcap.r\"/><use href=\"#resistance-band-row-m-g2-upper.r\"/><use href=\"#resistance-band-row-m-g2-elbowcap.r\"/><use href=\"#resistance-band-row-m-g2-fore.r\"/><use href=\"#resistance-band-row-m-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^36\"/></g><g class=\"pose-end\"><path class=\"eq-line m-line\" d=\"^37\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-m-e-thigh.l\"/><use href=\"#resistance-band-row-m-e-kneecap.l\"/><use href=\"#resistance-band-row-m-e-shank.l\"/><use href=\"#resistance-band-row-m-e-foot.l\"/><use href=\"#resistance-band-row-m-e-shcap.l\"/><use href=\"#resistance-band-row-m-e-upper.l\"/><use href=\"#resistance-band-row-m-e-elbowcap.l\"/><use href=\"#resistance-band-row-m-e-fore.l\"/><use href=\"#resistance-band-row-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-m-e-thigh.l\"/><use href=\"#resistance-band-row-m-e-kneecap.l\"/><use href=\"#resistance-band-row-m-e-shank.l\"/><use href=\"#resistance-band-row-m-e-foot.l\"/><use href=\"#resistance-band-row-m-e-shcap.l\"/><use href=\"#resistance-band-row-m-e-upper.l\"/><use href=\"#resistance-band-row-m-e-elbowcap.l\"/><use href=\"#resistance-band-row-m-e-fore.l\"/><use href=\"#resistance-band-row-m-e-fist.l\"/></g></g><path class=\"eq-solid\" d=\"^38\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-m-e-head\"/><use href=\"#resistance-band-row-m-e-torso\"/><use href=\"#resistance-band-row-m-e-thigh.r\"/><use href=\"#resistance-band-row-m-e-kneecap.r\"/><use href=\"#resistance-band-row-m-e-shank.r\"/><use href=\"#resistance-band-row-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-m-e-head\"/><use href=\"#resistance-band-row-m-e-torso\"/><use href=\"#resistance-band-row-m-e-thigh.r\"/><use href=\"#resistance-band-row-m-e-kneecap.r\"/><use href=\"#resistance-band-row-m-e-shank.r\"/><use href=\"#resistance-band-row-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-m-e-shcap.r\"/><use href=\"#resistance-band-row-m-e-upper.r\"/><use href=\"#resistance-band-row-m-e-elbowcap.r\"/><use href=\"#resistance-band-row-m-e-fore.r\"/><use href=\"#resistance-band-row-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#resistance-band-row-m-e-shcap.r\"/><use href=\"#resistance-band-row-m-e-upper.r\"/><use href=\"#resistance-band-row-m-e-elbowcap.r\"/><use href=\"#resistance-band-row-m-e-fore.r\"/><use href=\"#resistance-band-row-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^39\"/><path class=\"eq-solid\" d=\"^38\"/><circle class=\"joint\" cx=\"88.16\" cy=\"249.39\" r=\"2.25\"/><circle class=\"joint\" cx=\"67.76\" cy=\"296.81\" r=\"2.25\"/><circle class=\"joint\" cx=\"94.52\" cy=\"322.94\" r=\"2.25\"/><circle class=\"joint\" cx=\"162.66\" cy=\"325.32\" r=\"2.25\"/></g><mask id=\"resistance-band-row-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#resistance-band-row-m-m-head\" fill=\"#000\"/><use href=\"#resistance-band-row-m-m-torso\" fill=\"#000\"/><use href=\"#resistance-band-row-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#resistance-band-row-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#resistance-band-row-m-mf-shank.l\" fill=\"#000\"/><use href=\"#resistance-band-row-m-mf-foot.l\" fill=\"#000\"/><use href=\"#resistance-band-row-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#resistance-band-row-m-mf-upper.l\" fill=\"#000\"/><use href=\"#resistance-band-row-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#resistance-band-row-m-mf-fore.l\" fill=\"#000\"/><use href=\"#resistance-band-row-m-mf-fist.l\" fill=\"#000\"/><use href=\"#resistance-band-row-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#resistance-band-row-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#resistance-band-row-m-mf-shank.r\" fill=\"#000\"/><use href=\"#resistance-band-row-m-mf-foot.r\" fill=\"#000\"/><use href=\"#resistance-band-row-m-m-shcap.r\" fill=\"#000\"/><use href=\"#resistance-band-row-m-m-upper.r\" fill=\"#000\"/><use href=\"#resistance-band-row-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#resistance-band-row-m-m-fore.r\" fill=\"#000\"/><use href=\"#resistance-band-row-m-m-fist.r\" fill=\"#000\"/><use href=\"#resistance-band-row-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#resistance-band-row-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#resistance-band-row-m-mmask)\"><g class=\"u-stroke\"><use href=\"#resistance-band-row-m-m-head\"/><use href=\"#resistance-band-row-m-m-torso\"/><use href=\"#resistance-band-row-m-m-shcap.r\"/><use href=\"#resistance-band-row-m-m-upper.r\"/><use href=\"#resistance-band-row-m-m-elbowcap.r\"/><use href=\"#resistance-band-row-m-m-fore.r\"/><use href=\"#resistance-band-row-m-m-fist.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"M84.33 260.02A62 62 0 0 1 112.02 263.42M107.41 265.37L112.02 263.42L108.86 259.55\"/><path class=\"leader m\" d=\"~MySdAW!1L0TUc\"/><path class=\"leader m\" d=\"M107.39 250.05L155 228H165\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"resistance-band-row-m-slump\" data-key=\"slump\" data-cue=\"The lower back rounds and the trunk tips forward.\" class=\"plate-callout two m\" style=\"left:0.56%;top:57.54%\" aria-pressed=\"true\">Low back<br>rounds</button><button type=\"button\" id=\"resistance-band-row-m-tip\" data-key=\"tip\" data-cue=\"The trunk tips forward over the legs instead of staying tall.\" class=\"plate-callout two m\" style=\"left:44.69%;top:57.54%\" aria-pressed=\"false\">Trunk tips<br>forward</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "tall",
        cues: [{ key: "tall", cue: "Back straight and neutral, chest up, the same from start to finish." }, { key: "elbows", cue: "Elbows travel back close to the body." }, { key: "band", cue: "The band sits securely around the soles of the feet, feet flexed." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "slump",
        cues: [{ key: "slump", cue: "The lower back rounds and the trunk tips forward." }, { key: "tip", cue: "The trunk tips forward over the legs instead of staying tall." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Low back rounds</b><span>The lower back rounds and the trunk tips forward.</span></li><li><b>Trunk tips forward</b><span>The trunk tips forward over the legs instead of staying tall.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 2 seconds, return 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>2 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Return</b><span>2 s</span></div></div></div>",
      alt: "Resistance band row, side view. Sitting tall on a mat, legs straight out and feet flexed with a band round the soles, the lifter pulls the band ends from straight arms back to the lower ribs, elbows close to the sides.",
      mistakeAlt: "Resistance Band Row: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "pull",
    "why": "D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c11 and c13.",
    "orientation": "neutral",
    "width": {
      "text": "Set by where the band leaves your feet.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-bandrow",
          "physitrack-longsitrow"
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
          "theraband-manual"
        ],
        "note": "c11"
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "ext": [
        0,
        0
      ],
      "limitText": "Keep your wrists straight, in line with your forearms.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "sabf-bandrow"
        ],
        "note": "c13"
      }
    },
    "faults": [],
    "gripLine": "Band flat in your palm, long end round the back of your hand. Grip it firmly.",
    "cue": "Sit tall, elbows back."
  },
  contacts: [
    "floor-body"
  ],
  setup: [
    {
      "kind": "safety",
      "text": "Check the band for wear. Breathe out as you pull.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-bandrow",
          "physitrack-longsitrow"
        ],
        "note": "c2, c5"
      }
    },
    {
      "kind": "position",
      "text": "Sit on a mat, legs straight out, feet flexed.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-bandrow",
          "physitrack-longsitrow"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "grip",
      "text": "Loop the band round both soles. Wrap an end round each hand.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-bandrow",
          "physitrack-longsitrow",
          "theraband-manual"
        ],
        "note": "c1, c11"
      }
    },
    {
      "kind": "load",
      "text": "Hold the band shorter or longer to change how hard it is.",
      "claim": {
        "tags": [
          "DATA",
          "MECH"
        ],
        "sources": [
          "thomas2005"
        ],
        "note": "c6"
      }
    },
    {
      "kind": "brace",
      "text": "Sit tall, shoulders down and back, arms straight in front.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-bandrow",
          "physitrack-longsitrow"
        ],
        "note": "c3"
      }
    }
  ],
  posture: [
    {
      "key": "tall",
      "label": "Sit tall",
      "detail": "Back straight and neutral, sitting tall, all set.",
      "anchor": {
        "at": "backMid",
        "pose": "start"
      },
      "zoom": "back-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-bandrow",
          "physitrack-longsitrow"
        ],
        "note": "c3"
      }
    },
    {
      "key": "shoulders",
      "label": "Shoulders down",
      "detail": "Shoulder blades drawn down and back from the start.",
      "anchor": {
        "at": "shoulderTop.r",
        "pose": "start"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-bandrow",
          "physitrack-longsitrow"
        ],
        "note": "c3"
      }
    },
    {
      "key": "elbows",
      "label": "Elbows to sides",
      "detail": "Elbows pull straight back, close to your sides.",
      "anchor": {
        "at": "elbow.r",
        "pose": "end"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-bandrow",
          "physitrack-longsitrow"
        ],
        "note": "c4"
      }
    },
    {
      "key": "squeeze",
      "label": "Small squeeze",
      "detail": "A small squeeze between your shoulder blades at the end.",
      "anchor": {
        "at": "backUpper",
        "pose": "end"
      },
      "zoom": "blades",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-bandrow",
          "physitrack-longsitrow"
        ],
        "note": "c4"
      }
    },
    {
      "key": "breathe",
      "label": "Breathe out",
      "detail": "Breathe out on the pull. Straighten your arms slowly on the way back.",
      "anchor": {
        "at": "chest",
        "pose": "end"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-bandrow",
          "physitrack-longsitrow"
        ],
        "note": "c5"
      }
    },
    {
      "key": "band",
      "label": "Band round soles",
      "detail": "Band flat across both soles, feet flexed. Never on the toes.",
      "anchor": {
        "at": "ball.r",
        "pose": "start"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-bandrow"
        ],
        "note": "c2"
      }
    }
  ],
  zooms: [
    {
      "key": "back-line",
      "chip": "Back",
      "heading": "Back line",
      "kind": "posture",
      "feelRow": "low-back"
    },
    {
      "key": "blades",
      "chip": "Shoulder blades",
      "heading": "Shoulder blades",
      "kind": "posture"
    }
  ],
  chips: [
    "back-line",
    "blades",
    "feel"
  ],
  copy: {
    "setupLine": "Sit on a mat, legs straight. Loop the band round both soles.",
    "mistakeLine": "Sit tall all set. Never let the band snap your arms back.",
    "cueLine": "Sit tall, elbows back."
  },
  mistakes: [
    {
      "key": "snap",
      "title": "Letting the band snap back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-bandrow",
          "physitrack-longsitrow"
        ],
        "note": "c5"
      },
      "fix": "Control the way back to the start."
    },
    {
      "key": "slump",
      "title": "Slumping while holding the band",
      "zoom": "back-line",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA",
          "MECH"
        ],
        "sources": [
          "sweat-bandrow",
          "physitrack-longsitrow",
          "thomas2005"
        ],
        "note": "c3, c6"
      },
      "fix": "Sit tall first. If you can't, hold the band further along."
    },
    {
      "key": "band",
      "title": "A worn or loose band",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-bandrow"
        ],
        "note": "c2"
      },
      "fix": "Check the band each session. Anchor it firmly round your soles."
    }
  ],
  risks: [
    {
      "key": "band",
      "text": "A worn or loosely anchored band can snap back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-bandrow",
          "physitrack-longsitrow",
          "theraband-manual"
        ],
        "note": "c2, c14"
      }
    },
    {
      "key": "slump",
      "text": "Avoid holding the pull with your lower back rounded.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sweat-bandrow",
          "physitrack-longsitrow"
        ],
        "note": "c3"
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
    "sweat-bandrow",
    "physitrack-longsitrow",
    "thomas2005",
    "lehman2004",
    "fischer2025",
    "theraband-manual",
    "sabf-bandrow",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/resistance_band_row.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

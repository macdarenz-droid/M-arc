// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=72a1399e27ff6425a85aa98b762664720f7dffcfbe5fcedd5d26d8588ddd8e6c
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_assisted_pull_up",
  name: "Assisted Pull-up",
  hashes: { inputsSha256: "72a1399e27ff6425a85aa98b762664720f7dffcfbe5fcedd5d26d8588ddd8e6c", golden: "887ab8d9a9f5ff3b9a34fa3b935c27a29cee41f01c64993cd57cbe0a28fba4ef" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"assisted-pull-up-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"assisted-pull-up-n-st-thigh.l\" d=\"~#F12SIq_EtVyq.)r*2*9z16UaNV1A4O7!1V3B4*K1Y7BlI2GhIdEiR8GK1.2)2x6)5U4DW1w136GaBsI6.dYB1H4_uYnJw110111100100000100010000000001000220000000000000000010110000000000000000000010002\"/><path id=\"assisted-pull-up-n-st-kneecap.l\" d=\"~~!Vs!NE1_D10\"/><path id=\"assisted-pull-up-n-st-shank.l\" d=\"~#F12PYt(DD1Rxv*BD1Jai4y1.V1!9J7N4U3w2H-1G9PcA5Faz1AbO7w_1.2D3V2F6*5XW1S11x1(9T2Bb)9KmB9Xiw2xkUd00200000001100010100111000002000010000100000000100100002001010002000000010000101\"/><path id=\"assisted-pull-up-n-st-foot.l\" d=\"~#o2HPkPIF1BxlEDG1X7H8I1WgN7PtBz1FB2!z1BY1DmVpAaEiYdRx1Pex3V3Pq*9Vr010121000000020200000000000001001000220200000000\"/><path id=\"assisted-pull-up-n-st-shcap.l\" d=\"~~_.oAyiSG12\"/><path id=\"assisted-pull-up-n-st-upper.l\" d=\"~#F12SGpyxj*VoGNi-4-467FsWmO1)4rO2BgIlE6EhTaT9.hG4*m)dO2hB5vNpYp38G5G4*cF7P8WnPewdHow600000000010020220000012000000000100002110011000002000202200001000000022000100000\"/><path id=\"assisted-pull-up-n-st-elbowcap.l\" d=\"~~_NuJ-mPu0\"/><path id=\"assisted-pull-up-n-st-fore.l\" d=\"~#F12wKw1_Vm)Jw1.JnhP8nK1x7*y1B2(7z1y2P2(pT4Uby1Y9D7FaF3(pW1Y1!3D7vTz1gR1J2D8(8eA7-hT1-e)a.f00101000000000100020000001000000000100020002200101001010000000010002002000000000\"/><path id=\"assisted-pull-up-n-st-head\" d=\"~#w12WXnN*8XIm.E9K8(l.bJe*9N1r(4R6V4Ga)5.lRbj-bV4x7Ef_6!dXgNf)cSh-4!k(5N5Yf2000000210020000000101001010000000011100100000000011010000000000\"/><path id=\"assisted-pull-up-n-st-torso\" d=\"~#_12HEoWDdR(nT(b.bN1IaG6S9P6!aJdFdYbD6I1xbVjXn-3OaF5Sdz5Sh-6NizfyeGgU3R8.7IdTpXsIb.mz6V4xg)2Se!lw4H6Bc.4BbFgT3Wbw2GaY2nU8ydRW1UW100000000011000200000000220010110000020002000000200001000002000000000100000000000000121101000000010002001001000000100\"/><path id=\"assisted-pull-up-n-st-thigh.r\" d=\"^0\"/><path id=\"assisted-pull-up-n-st-kneecap.r\" d=\"^1\"/><path id=\"assisted-pull-up-n-st-shank.r\" d=\"^2\"/><path id=\"assisted-pull-up-n-st-foot.r\" d=\"^3\"/><path id=\"assisted-pull-up-n-st-shcap.r\" d=\"^4\"/><path id=\"assisted-pull-up-n-st-upper.r\" d=\"^5\"/><path id=\"assisted-pull-up-n-st-elbowcap.r\" d=\"^6\"/><path id=\"assisted-pull-up-n-st-fore.r\" d=\"^7\"/><path id=\"assisted-pull-up-n-g0-head\" d=\"~#w12yRp!DdzAoxIdKbPkTdUcza0R1Y4.5O5G9K7xkKew1-bV3T7*fU4(fVeDhVawiG2!jY8F3Hg0201000020000000100000011110000000100000020001000101000120210000\"/><path id=\"assisted-pull-up-n-g0-torso\" d=\"~#_12JKp(PhEHp)EgTa4)7B6N9U8Y9!bUcPc(5tE9xkEmx5-a!4WdX4YhI6YiXePe*f_3R8T7Kd*oKt-axnX5z3KdE2DdFjS3U6-bT5Gc(dx4Ad_3x6D5O3H6JbX*1PN120120000100000000000000000000021010000000202202000002101000000000000002000101001000000000101001012000000010200001000\"/><path id=\"assisted-pull-up-n-g0-thigh.r\" d=\"~#F12DTqHYx1BIqBPw1-2)9v6F9UV1J4I7(1V3B3*K1J8)kx2Kh*cRiO7KK1X2z3)5z6J3JW1y15cGa)r)6-eJB1U3(uwn(w100010000020000100011010002220000000000000020001002022001010101010000000020002000\"/><path id=\"assisted-pull-up-n-g0-kneecap.r\" d=\"~~(Vs(xJ1_D10\"/><path id=\"assisted-pull-up-n-g0-shank.r\" d=\"~#F12N-t!-H1Oyv--H1Jao2A1xW1S8D7U4W3A2P-1*7HcH5HarFbE7A_1K1D3V2N6V5-W160x1waI2)aEaBmV9-iP1IkDd01200010101110101200020010000110010000220000002101001121001002000001010011000000\"/><path id=\"assisted-pull-up-n-g0-foot.r\" d=\"~#o2YOkSXJ1*)kXSK1x8D8V1WgY6Ut-A1JA2DB1EX1YmGpSa.hSeEx1PeX2E4NqG9*r001000000000011010101011000000000002000000000001\"/><path id=\"assisted-pull-up-n-g1-head\" d=\"~#w12yIrNVh)*pIThze_iGfPa)9I1B2P4x5E6E8V8XhxhS2RbR2x8KgH2_hGcPiB8Fi8JiNbuUg1000000100001010000002110100001011101000001010002000020000101000\"/><path id=\"assisted-pull-up-n-g1-torso\" d=\"~#_12DUqU*l-WqTUkI9nO5)5y9(a!8Ja!bAd_5dK7Ok.kx6*aS4_dO4_h*5AjGe(eRf!3O8B7TdGo*tEaInR5R1.aE1ycUgD3_6ObI6BdYbX4JeA5R1(7T5F4D9Oz2SB100000100212000021001000000000001010000000012100220200000100000000000010000000100200000010002000000010101101000000000\"/><path id=\"assisted-pull-up-n-g1-thigh.r\" d=\"~#F12(_q_FD1*TqRwB1O2*9x12y8_V1P4E7y2R3x2xN1Y8-kR1OhRcXiK6VK1V2B3-5E6y2JW1y11mGa*rV7RfyB1_2(uHmSx101000000212101002020002001000020000002110101001010101200020001011100000000200210\"/><path id=\"assisted-pull-up-n-g1-kneecap.r\" d=\"~~(VsYUP1_D10\"/><path id=\"assisted-pull-up-n-g1-shank.r\" d=\"~#F12J_tUJO1IzvOKO1Faw12y1BW1J7y7Y4S3D2Y-1R6AcS5NahHb)6D_15F3O2P6T5VW1v3x1DaE2XaKaxmBaXiy1XkWc20001001010000110010000000010100001210010100020001000000012001020002100001001000\"/><path id=\"assisted-pull-up-n-g1-foot.r\" d=\"~#o2JOkJzR1)(k*(R1z8y8z2Sgw6YtGD1Uz2ND1OW1JnVo!aVhNf.w1PeK2-4JqV8Bs100000001000002002000000001000000000000000000000\"/><path id=\"assisted-pull-up-n-e-thigh.l\" d=\"~#F12UyrF-H1O!q-PG1G2xax12Y6yW1Y4B7y2R3tzN1D9Rkz1KhzcBjI5XK1T2B3T5O6oPW1A13sEaXrG8KgUA1D2yvJlwy100001010100010010110110100101000000111000200100100000020000000100001000000000202\"/><path id=\"assisted-pull-up-n-e-kneecap.l\" d=\"~~(VsNEV1_D10\"/><path id=\"assisted-pull-up-n-e-shank.l\" d=\"~#F12H.tF)T1GAvxxU1FaD12A1IW1y6w7(4N3H2(-1G5wc(5JabSbX6A_1F1H3R2U6G5TW1I23x1Fa*1RaXaXlXaXioxlAc00010100000001000000000101000000000000000000000200012010000020010000200022100100\"/><path id=\"assisted-pull-up-n-e-foot.l\" d=\"~#o2yOkwOV1)*k.HW1I8_7O2PgJ5(t*E1Uy2WE1OV1(nBoJbIhygRw1Uex2K5Fqx8Ks000000000120000002000210002002001000000000010100\"/><path id=\"assisted-pull-up-n-e-shcap.l\" d=\"~~UIrFDvSG12\"/><path id=\"assisted-pull-up-n-e-upper.l\" d=\"~#F12H(tSJv.YtXHw1R1P771D4VF1O3S4V1J2-9YvzbYez2yeA6Nh1Dx1sY2(1N5F8zF182pW7YdD3yf)jw3EjK8Vn11000000000000000110122002000200001002101000000000000000001010010000020000101011\"/><path id=\"assisted-pull-up-n-e-elbowcap.l\" d=\"~~J*sPGnPu0\"/><path id=\"assisted-pull-up-n-e-fore.l\" d=\"~#F12W.u(InEXu*zoB2Y8fV13XB1X3!7O1!1R2PsX6SanW9y5Pb-1SsH1A2J2F8(5EB1oR1ow9_8oJaBgA1.eX7Th02000000000000001220000000010101011010100000000110000200100010012000200000002000\"/><path id=\"assisted-pull-up-n-e-fist.l\" d=\"~~_Uty.eYr1\"/><path id=\"assisted-pull-up-n-e-head\" d=\"~#w12yBtyGmXYrVwmRgSgVgH8V9X2X2D4z4)6)6T9EfOjD4)aI1I8Tg0JjV9JjO5yiW2Wg(dK1Sg1000011010002000002100000001000020210020000002120000202000101012\"/><path id=\"assisted-pull-up-n-e-torso\" d=\"~#_12N.r_JqXzsTApG8R1-2-4J8(cH8W8yb!dP50K5XkOj)6xbD4!dz4wiT5Nj-dFfEfA4G8.6.dTnOuV9RnR50E80wb!d_2!6xb.6.dH9R5UfS5D3ybI7_2w7zF2Wr00001001002200000002101200002201100000200000000000000000000001010000001000200000000001220000001010000000010200000001\"/><path id=\"assisted-pull-up-n-e-thigh.r\" d=\"^22\"/><path id=\"assisted-pull-up-n-e-kneecap.r\" d=\"^23\"/><path id=\"assisted-pull-up-n-e-shank.r\" d=\"^24\"/><path id=\"assisted-pull-up-n-e-foot.r\" d=\"^25\"/><path id=\"assisted-pull-up-n-e-shcap.r\" d=\"^26\"/><path id=\"assisted-pull-up-n-e-upper.r\" d=\"^27\"/><path id=\"assisted-pull-up-n-e-elbowcap.r\" d=\"^28\"/><path id=\"assisted-pull-up-n-e-fore.r\" d=\"^29\"/><path id=\"assisted-pull-up-n-e-fist.r\" d=\"^30\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#assisted-pull-up-n-dots)\"/>\n  <path class=\"datum\" d=\"~Mw*3JNeLN(n0\"/><path class=\"floorline\" d=\"M77.66 338.87H280.34\"/><path class=\"eq\" d=\"~MWHG1_yy2Lwz10QF60XsE6LE6I.X1Q0E6E6J.X1LXsF6QE60YsF6LF6J.X1Q0F6F6I.X1Z\"/><path class=\"eq\" d=\"~MSET1_yy2Lwz10QF60XsE6LE6I.X1Q0E6E6J.X1LXsF6QE60YsF6LF6J.X1Q0F6F6I.X1Z\"/><path class=\"eq\" d=\"~MS(D1FAbL_Pd0QJ90KEdI9LI9KjQ0I9I9NjLKEdJ9QI90NEdJ9LJ9NjQ0J9J9KjZ\"/><path class=\"eq\" d=\"~M!-uyXeL(Ya0QJ90ROaI9LI9KbQ0I9I9NbLROaJ9QI90SOaJ9LJ9NbQ0J9J9KbZ\"/><path class=\"eq\" d=\"~MJwvw.eL00Q0010LRv0Q00Uv0L00Q0202LUv1Q20Rv1Z\"/><path class=\"eq-solid\" d=\"~~!zuy.eWc0\"/><path class=\"eq-pin\" d=\"~~YJuy.eY30\"/><path class=\"eq\" d=\"~MWOz1(BY1LJI50QJ90)x5I9LI9R3Q0I9I9S3L)x5J9QI90wy5J9LJ9S3Q0J9J9R3Z\"/><path class=\"eq\" d=\"~MWRJ1_yy2L!R40QF60TI4E6LE6-sQ0E6E6_sLTI4F6QE60UI4F6LF6_sQ0F6F6-sZ\"/><path class=\"eq\" d=\"~MNIJ1_U.1LJ(40LI(4N(4LI(4K(4Z\"/><path class=\"eq-thin\" d=\"M227.11 327.59H252.45M227.11 324.42H252.45M227.11 321.26H252.45M227.11 318.09H252.45M227.11 314.92H252.45M227.11 311.75H252.45M227.11 308.58H252.45\"/><path class=\"eq-thin\" d=\"~MwTK1FTw2L0BYR1\"/><path class=\"eq-thin\" d=\"~MFyP1FTw2L0BYR1\"/><path class=\"eq-solid\" d=\"~~AxE1(zcYr1\"/><path class=\"eq-pin\" d=\"~~SWE1(zcF60\"/><path class=\"eq-solid\" d=\"~~!(K1(zcYr1\"/><path class=\"eq-pin\" d=\"~~JUN1(zcF60\"/><path class=\"eq-cable\" d=\"~M_!E1DFbL_*60\"/><path class=\"eq-solid\" d=\"~~WJF1!wT1Yn0\"/><path class=\"eq-pin\" d=\"~~D(F1!wT1F60\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#assisted-pull-up-n-st-thigh.l\"/><use href=\"#assisted-pull-up-n-st-kneecap.l\"/><use href=\"#assisted-pull-up-n-st-shank.l\"/><use href=\"#assisted-pull-up-n-st-foot.l\"/><use href=\"#assisted-pull-up-n-st-shcap.l\"/><use href=\"#assisted-pull-up-n-st-upper.l\"/><use href=\"#assisted-pull-up-n-st-elbowcap.l\"/><use href=\"#assisted-pull-up-n-st-fore.l\"/></g><g class=\"u-fill\"><use href=\"#assisted-pull-up-n-st-thigh.l\"/><use href=\"#assisted-pull-up-n-st-kneecap.l\"/><use href=\"#assisted-pull-up-n-st-shank.l\"/><use href=\"#assisted-pull-up-n-st-foot.l\"/><use href=\"#assisted-pull-up-n-st-shcap.l\"/><use href=\"#assisted-pull-up-n-st-upper.l\"/><use href=\"#assisted-pull-up-n-st-elbowcap.l\"/><use href=\"#assisted-pull-up-n-st-fore.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#assisted-pull-up-n-st-head\"/><use href=\"#assisted-pull-up-n-st-torso\"/><use href=\"#assisted-pull-up-n-st-thigh.r\"/><use href=\"#assisted-pull-up-n-st-kneecap.r\"/><use href=\"#assisted-pull-up-n-st-shank.r\"/><use href=\"#assisted-pull-up-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#assisted-pull-up-n-st-head\"/><use href=\"#assisted-pull-up-n-st-torso\"/><use href=\"#assisted-pull-up-n-st-thigh.r\"/><use href=\"#assisted-pull-up-n-st-kneecap.r\"/><use href=\"#assisted-pull-up-n-st-shank.r\"/><use href=\"#assisted-pull-up-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#assisted-pull-up-n-st-shcap.r\"/><use href=\"#assisted-pull-up-n-st-upper.r\"/><use href=\"#assisted-pull-up-n-st-elbowcap.r\"/><use href=\"#assisted-pull-up-n-st-fore.r\"/></g><g class=\"u-fill\"><use href=\"#assisted-pull-up-n-st-shcap.r\"/><use href=\"#assisted-pull-up-n-st-upper.r\"/><use href=\"#assisted-pull-up-n-st-elbowcap.r\"/><use href=\"#assisted-pull-up-n-st-fore.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><path class=\"eq-cable\" d=\"~MF*E1(_S1Lzs)WD1\"/><path class=\"eq\" d=\"~MyYF1wTT1L-SeOD2L_HeU.1LAbK9LW7HcLwFeSN2L.HeX.1L)aS9Z\"/><path class=\"eq\" d=\"~MwOp(KP1L0OsLP9wjLA3P9Lz3P9LO9wjLO9*iLz3R9Z\"/><path class=\"eq\" d=\"~MY)mSFK1LA(50LGN5F4LB4J7LI7D4LO82LI7G4LB4G7LGN5E4LHN5E4LD4G7LJ7G4LP82LJ7D4Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#assisted-pull-up-n-g0-head\"/><use href=\"#assisted-pull-up-n-g0-torso\"/><use href=\"#assisted-pull-up-n-g0-thigh.r\"/><use href=\"#assisted-pull-up-n-g0-kneecap.r\"/><use href=\"#assisted-pull-up-n-g0-shank.r\"/><use href=\"#assisted-pull-up-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#assisted-pull-up-n-g0-head\"/><use href=\"#assisted-pull-up-n-g0-torso\"/><use href=\"#assisted-pull-up-n-g0-thigh.r\"/><use href=\"#assisted-pull-up-n-g0-kneecap.r\"/><use href=\"#assisted-pull-up-n-g0-shank.r\"/><use href=\"#assisted-pull-up-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><path class=\"eq-cable\" d=\"~MF*E1YDT1Lzs-yE1\"/><path class=\"eq\" d=\"~Mw(F1!VT1L-SeSD2LwFeON2LY7KcLwbS9L!He-.1L)EeUN2LV7JcZ\"/><path class=\"eq\" d=\"~MwOp_wV1L0OsLP9(iLD3S9LB3S9LO9(iLO9)iLB3O9Z\"/><path class=\"eq\" d=\"~MY)mN.R1LA(50LEN5D4LG4N7LG7D4LO82LG7E4LG4K7LEN5B4LHN5B4LD4K7LJ7E4LP82LJ7D4Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#assisted-pull-up-n-g1-head\"/><use href=\"#assisted-pull-up-n-g1-torso\"/><use href=\"#assisted-pull-up-n-g1-thigh.r\"/><use href=\"#assisted-pull-up-n-g1-kneecap.r\"/><use href=\"#assisted-pull-up-n-g1-shank.r\"/><use href=\"#assisted-pull-up-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#assisted-pull-up-n-g1-head\"/><use href=\"#assisted-pull-up-n-g1-torso\"/><use href=\"#assisted-pull-up-n-g1-thigh.r\"/><use href=\"#assisted-pull-up-n-g1-kneecap.r\"/><use href=\"#assisted-pull-up-n-g1-shank.r\"/><use href=\"#assisted-pull-up-n-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MNIJ1YyW1LJ(40LI(4_W3LI(4-W3Z\"/><path class=\"eq-thin\" d=\"M227.11 292.76H252.45M227.11 289.59H252.45M227.11 286.42H252.45M227.11 283.25H252.45M227.11 280.08H252.45\"/><path class=\"eq-solid\" d=\"~MUTI1JU-1LWv0LVvO9LVvP9Z\"/><path class=\"eq-cable\" d=\"~MU_N1(zcL0_(G1\"/><path class=\"eq-cable\" d=\"~MwxF1UST1L.vVNE1\"/><path class=\"eq\" d=\"~M_AG1_WT1L*BdYT6LD-c*X6LP3EeLNdW5L_xd)D6LE-c(X6LO3FeZ\"/><path class=\"eq\" d=\"~MU*qUT-1L0OsLP9wjLD3P9LB3P9LO9wjLO9)iLB3O9Z\"/><path class=\"eq-line m-line\" d=\"~MyTF1HNT1L)BdVT6LYxd!D6LPdR5LP3AeLF-c(X6LXxd*D6LOdW5LO3Be\"/><path class=\"eq-line m-line\" d=\"~MU*qA.I1L0OsLP9wjLA3P9Lx3P9LR9wjLR9)iLx3O9LA3O9\"/><path class=\"eq-line m-line\" d=\"~MJNoYVF1LA(50LGN5F4LB4H7LI7H4LO81LI7B4LB4I7LGN5E4LHN5E4LD4I7LJ7B4LP81LJ7H4LD4H7\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#assisted-pull-up-n-e-thigh.l\"/><use href=\"#assisted-pull-up-n-e-kneecap.l\"/><use href=\"#assisted-pull-up-n-e-shank.l\"/><use href=\"#assisted-pull-up-n-e-foot.l\"/><use href=\"#assisted-pull-up-n-e-shcap.l\"/><use href=\"#assisted-pull-up-n-e-upper.l\"/><use href=\"#assisted-pull-up-n-e-elbowcap.l\"/><use href=\"#assisted-pull-up-n-e-fore.l\"/><use href=\"#assisted-pull-up-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#assisted-pull-up-n-e-thigh.l\"/><use href=\"#assisted-pull-up-n-e-kneecap.l\"/><use href=\"#assisted-pull-up-n-e-shank.l\"/><use href=\"#assisted-pull-up-n-e-foot.l\"/><use href=\"#assisted-pull-up-n-e-shcap.l\"/><use href=\"#assisted-pull-up-n-e-upper.l\"/><use href=\"#assisted-pull-up-n-e-elbowcap.l\"/><use href=\"#assisted-pull-up-n-e-fore.l\"/><use href=\"#assisted-pull-up-n-e-fist.l\"/></g></g><path class=\"eq\" d=\"~M!_h_yy2LUXy10QF60IRy1E6LE6zgQ0E6E6AgLIRy1F6QE60JRy1F6LF6AgQ0F6F6zgZ\"/><path class=\"eq\" d=\"~MNNoFNW1LA(50LGN5F4LB4H7LI7H4LO81LI7B4LB4I7LGN5E4LFN5E4LH4I7LH7B4LP81LH7H4Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#assisted-pull-up-n-e-head\"/><use href=\"#assisted-pull-up-n-e-torso\"/><use href=\"#assisted-pull-up-n-e-thigh.r\"/><use href=\"#assisted-pull-up-n-e-kneecap.r\"/><use href=\"#assisted-pull-up-n-e-shank.r\"/><use href=\"#assisted-pull-up-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#assisted-pull-up-n-e-head\"/><use href=\"#assisted-pull-up-n-e-torso\"/><use href=\"#assisted-pull-up-n-e-thigh.r\"/><use href=\"#assisted-pull-up-n-e-kneecap.r\"/><use href=\"#assisted-pull-up-n-e-shank.r\"/><use href=\"#assisted-pull-up-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#assisted-pull-up-n-e-shcap.r\"/><use href=\"#assisted-pull-up-n-e-upper.r\"/><use href=\"#assisted-pull-up-n-e-elbowcap.r\"/><use href=\"#assisted-pull-up-n-e-fore.r\"/><use href=\"#assisted-pull-up-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#assisted-pull-up-n-e-shcap.r\"/><use href=\"#assisted-pull-up-n-e-upper.r\"/><use href=\"#assisted-pull-up-n-e-elbowcap.r\"/><use href=\"#assisted-pull-up-n-e-fore.r\"/><use href=\"#assisted-pull-up-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"146.75\" cy=\"159.72\" r=\"2.25\"/><circle class=\"joint\" cx=\"152.94\" cy=\"119.28\" r=\"2.25\"/><circle class=\"joint\" cx=\"149.29\" cy=\"218.34\" r=\"2.25\"/><circle class=\"joint\" cx=\"153.08\" cy=\"272.55\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#(10NXsWYgzVs)Ng0012211201221002011022011220100000020102001122100201000200110000001000000100000000020000000000010000002000010000020000001000000002200021012000001111110000121012000001002002000000000100\"/><path class=\"arrow\" d=\"~MSzvPKrLzq-w1L_(1ypZ\"/></g><path class=\"leader\" d=\"M147.08 282.55L103.07 316H93.07\"/><circle class=\"anchor\" cx=\"147.08\" cy=\"282.55\" r=\"1.5\"/><path class=\"leader\" d=\"M146.75 153.07L127.34 158H117.34\"/><circle class=\"anchor\" cx=\"146.75\" cy=\"153.07\" r=\"1.5\"/><path class=\"leader\" d=\"M142.63 67.37L151 26H161\"/><circle class=\"anchor\" cx=\"142.63\" cy=\"67.37\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"assisted-pull-up-n-pad\" data-key=\"pad\" data-cue=\"Kneel on the pad and let it sink until the arms are straight.\" class=\"plate-callout two\" style=\"left:11.17%;top:82.12%\" aria-pressed=\"true\">Knees<br>on pad</button><button type=\"button\" id=\"assisted-pull-up-n-set\" data-key=\"set\" data-cue=\"Draw the shoulder blades down and back before the elbows bend.\" class=\"plate-callout two\" style=\"left:10.61%;top:37.99%\" aria-pressed=\"false\">Shoulders<br>set</button><button type=\"button\" id=\"assisted-pull-up-n-chin\" data-key=\"chin\" data-cue=\"Pull until the chin clears the bar, then lower to straight arms.\" class=\"plate-callout two\" style=\"left:43.58%;top:1.12%\" aria-pressed=\"false\">Chin over<br>bar</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"assisted-pull-up-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"assisted-pull-up-m-st-thigh.l\" d=\"^0\"/><path id=\"assisted-pull-up-m-st-kneecap.l\" d=\"^1\"/><path id=\"assisted-pull-up-m-st-shank.l\" d=\"^2\"/><path id=\"assisted-pull-up-m-st-foot.l\" d=\"^3\"/><path id=\"assisted-pull-up-m-st-shcap.l\" d=\"^4\"/><path id=\"assisted-pull-up-m-st-upper.l\" d=\"^5\"/><path id=\"assisted-pull-up-m-st-elbowcap.l\" d=\"^6\"/><path id=\"assisted-pull-up-m-st-fore.l\" d=\"^7\"/><path id=\"assisted-pull-up-m-st-head\" d=\"^8\"/><path id=\"assisted-pull-up-m-st-torso\" d=\"^9\"/><path id=\"assisted-pull-up-m-st-thigh.r\" d=\"^0\"/><path id=\"assisted-pull-up-m-st-kneecap.r\" d=\"^1\"/><path id=\"assisted-pull-up-m-st-shank.r\" d=\"^2\"/><path id=\"assisted-pull-up-m-st-foot.r\" d=\"^3\"/><path id=\"assisted-pull-up-m-st-shcap.r\" d=\"^4\"/><path id=\"assisted-pull-up-m-st-upper.r\" d=\"^5\"/><path id=\"assisted-pull-up-m-st-elbowcap.r\" d=\"^6\"/><path id=\"assisted-pull-up-m-st-fore.r\" d=\"^7\"/><path id=\"assisted-pull-up-m-g0-head\" d=\"^10\"/><path id=\"assisted-pull-up-m-g0-torso\" d=\"^11\"/><path id=\"assisted-pull-up-m-g0-thigh.r\" d=\"^12\"/><path id=\"assisted-pull-up-m-g0-kneecap.r\" d=\"^13\"/><path id=\"assisted-pull-up-m-g0-shank.r\" d=\"^14\"/><path id=\"assisted-pull-up-m-g0-foot.r\" d=\"^15\"/><path id=\"assisted-pull-up-m-g1-head\" d=\"^16\"/><path id=\"assisted-pull-up-m-g1-torso\" d=\"^17\"/><path id=\"assisted-pull-up-m-g1-thigh.r\" d=\"^18\"/><path id=\"assisted-pull-up-m-g1-kneecap.r\" d=\"^19\"/><path id=\"assisted-pull-up-m-g1-shank.r\" d=\"^20\"/><path id=\"assisted-pull-up-m-g1-foot.r\" d=\"^21\"/><path id=\"assisted-pull-up-m-e-thigh.l\" d=\"^22\"/><path id=\"assisted-pull-up-m-e-kneecap.l\" d=\"^23\"/><path id=\"assisted-pull-up-m-e-shank.l\" d=\"^24\"/><path id=\"assisted-pull-up-m-e-foot.l\" d=\"^25\"/><path id=\"assisted-pull-up-m-e-shcap.l\" d=\"^26\"/><path id=\"assisted-pull-up-m-e-upper.l\" d=\"^27\"/><path id=\"assisted-pull-up-m-e-elbowcap.l\" d=\"^28\"/><path id=\"assisted-pull-up-m-e-fore.l\" d=\"^29\"/><path id=\"assisted-pull-up-m-e-fist.l\" d=\"^30\"/><path id=\"assisted-pull-up-m-e-head\" d=\"^31\"/><path id=\"assisted-pull-up-m-e-torso\" d=\"^32\"/><path id=\"assisted-pull-up-m-e-thigh.r\" d=\"^22\"/><path id=\"assisted-pull-up-m-e-kneecap.r\" d=\"^23\"/><path id=\"assisted-pull-up-m-e-shank.r\" d=\"^24\"/><path id=\"assisted-pull-up-m-e-foot.r\" d=\"^25\"/><path id=\"assisted-pull-up-m-e-shcap.r\" d=\"^26\"/><path id=\"assisted-pull-up-m-e-upper.r\" d=\"^27\"/><path id=\"assisted-pull-up-m-e-elbowcap.r\" d=\"^28\"/><path id=\"assisted-pull-up-m-e-fore.r\" d=\"^29\"/><path id=\"assisted-pull-up-m-e-fist.r\" d=\"^30\"/><path id=\"assisted-pull-up-m-m-head\" d=\"~#w12wVr(JhTFqTAhTgWgVgF8V9X2X2A4z4.6)6X9EfIjD4xbI1I8Tg0JjV9JjO5yiW2Ug(dI1Sg0002001110002000002002001000020020210000000000120001202000002022\"/><path id=\"assisted-pull-up-m-m-torso\" d=\"~#_12NIqUPlXTqIFkG8T5-22J8DfF8S5Db!dN50O5XkIj)6zbD4!dB4wiO5Nj.dFfEfA4G8.6.dTnOuV9RnR50E80wb!d_2!6xb.6.d(6R5wiS5S5ybX9_2(6zF2Yr02001100002101000022001200002221000000000000000000000000000001010000001100210001000001220000001110000000000100000200\"/><path id=\"assisted-pull-up-m-m-thigh.r\" d=\"~#F12USpA*B1OJpVUA1G2xax12Y6wW1W4z7D2O3vBN1D9Rkz1KhzcBjI5XK1T2E3T5I6oNW1A13qEaTrG8OgUA1D2yvJlwy100001010100012000202002101101000000111000000100010001020000100002021000000000200\"/><path id=\"assisted-pull-up-m-m-kneecap.r\" d=\"~~!BrHIP1_D10\"/><path id=\"assisted-pull-up-m-m-shank.r\" d=\"~#F12HIsAzO1GUt*AO1FaD12y1IW1D6w7!4N3H2(-1G5wc(5JabSbX6A_1F1H3R2U6I5TW1E23z1Fa*1RaXaXlXaXimxlFc00010101000200000000100101000000000000000000010000000211000120111000200022120000\"/><path id=\"assisted-pull-up-m-m-foot.r\" d=\"~#o2y)i!SP1)KjXNR1I8Y7O2UgJ5!t*E1Uy2WE1OV1(nBoHbIhDgRw1Sex2K5Fqx8Ks000000000020000012001210100002210000000000010100\"/><path id=\"assisted-pull-up-m-m-eq0\" d=\"~MS*F1YVT1LxUeU*1LNGeXB2L(7GcL!aY9L!Ie)S1LKGe!B2L*7FcZ\"/><path id=\"assisted-pull-up-m-m-eq1\" d=\"~MWKpPXU1L0OsLP9wjLD3P9LB3P9LO9wjLO9)iLB3O9Z\"/><path id=\"assisted-pull-up-m-m-eq2\" d=\"~MN(mASR1LA(50LEN5F4LG4H7LG7H4LO81LG7B4LG4I7LEN5E4LHN5E4LD4I7LJ7B4LP81LJ7H4Z\"/><path id=\"assisted-pull-up-m-mf-thigh.l\" d=\"^82\"/><path id=\"assisted-pull-up-m-mf-kneecap.l\" d=\"^83\"/><path id=\"assisted-pull-up-m-mf-shank.l\" d=\"^84\"/><path id=\"assisted-pull-up-m-mf-foot.l\" d=\"^85\"/><path id=\"assisted-pull-up-m-mf-shcap.l\" d=\"~~PzqDyqSG12\"/><path id=\"assisted-pull-up-m-mf-upper.l\" d=\"~#F12AxsUDr*DrxUrV6D335Jx1XkT50X20ztNaKi4Oc!6xaNfGoAjR1D2*2!4Hz1zh46E6(3U4PdAp7whI9Wdzl00021002000020000000010000000101101010000000010200000100010000000200000010100102\"/><path id=\"assisted-pull-up-m-mf-elbowcap.l\" d=\"~~FBx1FJmPu0\"/><path id=\"assisted-pull-up-m-mf-fore.l\" d=\"~#F12Pwz1P(lKFz1EVmJ2U8E1B1ViBw1kS8bJ2WbJpjScF4_8yaJ7NcypA2D1F6!5GdXy13X1D5H7A8I3sEjK6KdOfIb01020000012100001000001010120002000010010021000000000210000000010010001000002001\"/><path id=\"assisted-pull-up-m-mf-fist.l\" d=\"^30\"/><path id=\"assisted-pull-up-m-mf-shcap.r\" d=\"^89\"/><path id=\"assisted-pull-up-m-mf-upper.r\" d=\"^90\"/><path id=\"assisted-pull-up-m-mf-elbowcap.r\" d=\"^91\"/><path id=\"assisted-pull-up-m-mf-fore.r\" d=\"^92\"/><path id=\"assisted-pull-up-m-mf-fist.r\" d=\"^30\"/><path id=\"assisted-pull-up-m-mo-0\" d=\"^31\"/><path id=\"assisted-pull-up-m-mo-1\" d=\"^32\"/><path id=\"assisted-pull-up-m-mo-2\" d=\"^22\"/><path id=\"assisted-pull-up-m-mo-3\" d=\"^23\"/><path id=\"assisted-pull-up-m-mo-4\" d=\"^24\"/><path id=\"assisted-pull-up-m-mo-5\" d=\"^25\"/><path id=\"assisted-pull-up-m-mo-6\" d=\"^26\"/><path id=\"assisted-pull-up-m-mo-7\" d=\"^27\"/><path id=\"assisted-pull-up-m-mo-8\" d=\"^28\"/><path id=\"assisted-pull-up-m-mo-9\" d=\"^29\"/><path id=\"assisted-pull-up-m-mo-10\" d=\"^30\"/><path id=\"assisted-pull-up-m-mo-11\" d=\"^22\"/><path id=\"assisted-pull-up-m-mo-12\" d=\"^23\"/><path id=\"assisted-pull-up-m-mo-13\" d=\"^24\"/><path id=\"assisted-pull-up-m-mo-14\" d=\"^25\"/><path id=\"assisted-pull-up-m-mo-15\" d=\"^26\"/><path id=\"assisted-pull-up-m-mo-16\" d=\"^27\"/><path id=\"assisted-pull-up-m-mo-17\" d=\"^28\"/><path id=\"assisted-pull-up-m-mo-18\" d=\"^29\"/><path id=\"assisted-pull-up-m-mo-19\" d=\"^30\"/><path id=\"assisted-pull-up-m-mo-20\" d=\"^73\"/><path id=\"assisted-pull-up-m-mo-21\" d=\"^35\"/><path id=\"assisted-pull-up-m-mo-22\" d=\"^36\"/><path id=\"assisted-pull-up-m-mo-23\" d=\"^37\"/><path id=\"assisted-pull-up-m-mo-24\" d=\"^38\"/><path id=\"assisted-pull-up-m-mo-25\" d=\"^39\"/><path id=\"assisted-pull-up-m-mo-26\" d=\"^40\"/><path id=\"assisted-pull-up-m-mo-27\" d=\"^41\"/><path id=\"assisted-pull-up-m-mo-28\" d=\"^42\"/><path id=\"assisted-pull-up-m-mo-29\" d=\"^43\"/><path id=\"assisted-pull-up-m-mo-30\" d=\"^44\"/><path id=\"assisted-pull-up-m-mo-31\" d=\"^63\"/><path id=\"assisted-pull-up-m-mo-32\" d=\"^65\"/><path id=\"assisted-pull-up-m-mo-33\" d=\"^48\"/><path id=\"assisted-pull-up-m-mo-34\" d=\"^49\"/><path id=\"assisted-pull-up-m-mo-35\" d=\"^50\"/><path id=\"assisted-pull-up-m-mo-36\" d=\"^51\"/><path id=\"assisted-pull-up-m-mo-37\" d=\"^68\"/><path id=\"assisted-pull-up-m-mo-38\" d=\"^69\"/><path id=\"assisted-pull-up-m-mo-39\" d=\"^74\"/><path id=\"assisted-pull-up-m-mo-40\" d=\"^53\"/><path id=\"assisted-pull-up-m-mo-41\" d=\"^54\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#assisted-pull-up-m-dots)\"/>\n  <path class=\"datum\" d=\"^33\"/><path class=\"floorline\" d=\"^34\"/><path class=\"eq\" d=\"^35\"/><path class=\"eq\" d=\"^36\"/><path class=\"eq\" d=\"^37\"/><path class=\"eq\" d=\"^38\"/><path class=\"eq\" d=\"^39\"/><path class=\"eq-solid\" d=\"^40\"/><path class=\"eq-pin\" d=\"^41\"/><path class=\"eq\" d=\"^42\"/><path class=\"eq\" d=\"^43\"/><path class=\"eq\" d=\"^44\"/><path class=\"eq-thin\" d=\"^45\"/><path class=\"eq-thin\" d=\"^46\"/><path class=\"eq-thin\" d=\"^47\"/><path class=\"eq-solid\" d=\"^48\"/><path class=\"eq-pin\" d=\"^49\"/><path class=\"eq-solid\" d=\"^50\"/><path class=\"eq-pin\" d=\"^51\"/><path class=\"eq-cable\" d=\"^52\"/><path class=\"eq-solid\" d=\"^53\"/><path class=\"eq-pin\" d=\"^54\"/><g class=\"pose-end\"><path class=\"eq\" d=\"^63\"/><path class=\"eq-thin\" d=\"^64\"/><path class=\"eq-solid\" d=\"^65\"/><path class=\"eq-cable\" d=\"^66\"/><path class=\"eq-cable\" d=\"^67\"/><path class=\"eq\" d=\"^68\"/><path class=\"eq\" d=\"^69\"/><path class=\"eq-line m-line\" d=\"^70\"/><path class=\"eq-line m-line\" d=\"^71\"/><path class=\"eq-line m-line\" d=\"^72\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#assisted-pull-up-m-e-thigh.l\"/><use href=\"#assisted-pull-up-m-e-kneecap.l\"/><use href=\"#assisted-pull-up-m-e-shank.l\"/><use href=\"#assisted-pull-up-m-e-foot.l\"/><use href=\"#assisted-pull-up-m-e-shcap.l\"/><use href=\"#assisted-pull-up-m-e-upper.l\"/><use href=\"#assisted-pull-up-m-e-elbowcap.l\"/><use href=\"#assisted-pull-up-m-e-fore.l\"/><use href=\"#assisted-pull-up-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#assisted-pull-up-m-e-thigh.l\"/><use href=\"#assisted-pull-up-m-e-kneecap.l\"/><use href=\"#assisted-pull-up-m-e-shank.l\"/><use href=\"#assisted-pull-up-m-e-foot.l\"/><use href=\"#assisted-pull-up-m-e-shcap.l\"/><use href=\"#assisted-pull-up-m-e-upper.l\"/><use href=\"#assisted-pull-up-m-e-elbowcap.l\"/><use href=\"#assisted-pull-up-m-e-fore.l\"/><use href=\"#assisted-pull-up-m-e-fist.l\"/></g></g><path class=\"eq\" d=\"^73\"/><path class=\"eq\" d=\"^74\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#assisted-pull-up-m-e-head\"/><use href=\"#assisted-pull-up-m-e-torso\"/><use href=\"#assisted-pull-up-m-e-thigh.r\"/><use href=\"#assisted-pull-up-m-e-kneecap.r\"/><use href=\"#assisted-pull-up-m-e-shank.r\"/><use href=\"#assisted-pull-up-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#assisted-pull-up-m-e-head\"/><use href=\"#assisted-pull-up-m-e-torso\"/><use href=\"#assisted-pull-up-m-e-thigh.r\"/><use href=\"#assisted-pull-up-m-e-kneecap.r\"/><use href=\"#assisted-pull-up-m-e-shank.r\"/><use href=\"#assisted-pull-up-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#assisted-pull-up-m-e-shcap.r\"/><use href=\"#assisted-pull-up-m-e-upper.r\"/><use href=\"#assisted-pull-up-m-e-elbowcap.r\"/><use href=\"#assisted-pull-up-m-e-fore.r\"/><use href=\"#assisted-pull-up-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#assisted-pull-up-m-e-shcap.r\"/><use href=\"#assisted-pull-up-m-e-upper.r\"/><use href=\"#assisted-pull-up-m-e-elbowcap.r\"/><use href=\"#assisted-pull-up-m-e-fore.r\"/><use href=\"#assisted-pull-up-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"146.75\" cy=\"159.72\" r=\"2.25\"/><circle class=\"joint\" cx=\"152.94\" cy=\"119.28\" r=\"2.25\"/><circle class=\"joint\" cx=\"149.29\" cy=\"218.34\" r=\"2.25\"/><circle class=\"joint\" cx=\"153.08\" cy=\"272.55\" r=\"2.25\"/></g><mask id=\"assisted-pull-up-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#assisted-pull-up-m-m-head\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-m-torso\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-mf-shank.l\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-mf-foot.l\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-mf-upper.l\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-mf-fore.l\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-mf-fist.l\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-m-thigh.r\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-m-shank.r\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-m-foot.r\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-mf-upper.r\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-mf-fore.r\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-mf-fist.r\" fill=\"#000\"/><use href=\"#assisted-pull-up-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-36\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-37\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-38\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-39\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-40\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#assisted-pull-up-m-mo-41\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#assisted-pull-up-m-mmask)\"><g class=\"u-stroke\"><use href=\"#assisted-pull-up-m-m-head\"/><use href=\"#assisted-pull-up-m-m-torso\"/><use href=\"#assisted-pull-up-m-m-thigh.r\"/><use href=\"#assisted-pull-up-m-m-kneecap.r\"/><use href=\"#assisted-pull-up-m-m-shank.r\"/><use href=\"#assisted-pull-up-m-m-foot.r\"/><use href=\"#assisted-pull-up-m-m-eq0\"/><use href=\"#assisted-pull-up-m-m-eq1\"/><use href=\"#assisted-pull-up-m-m-eq2\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MAxsUDrLY3z1L5bL35L35L31L32L32L06L56L54L10L32L12L11L42L03L56L94L34L21L83Le9LmdLqdLy1lLsfLmbLc9La3L13L76Ld4Lb6L31L32L11L02L31L02L10L63L81L01L12L72Ld4Lf8Ln6LlcLh6Lf8Ld4Ld4L50L91L51L75Lb0L70L90L70L54L36L54L52L52L72L34L76L38L38L3aL18L18L18L56L7aLb8LdaLfcLjeLjeLfcL98L56L12L21L61L45L02L02L00L32L22L32L14L98LbaL74L20L81Lg5LkdLw1bLw1jLubLmbLe7La1L41L72L76L72L40L11L22L12L10L52L34L52L73L32L14L12L48L28L68L0eL1aL18L26La4La0Lg1Li3Lk1Le4Le2Lc1La3La1L65L87L63La1L81La5L85L6bL6bL6bLchLcbLcbL49L27L35L73L93\"/><path class=\"m-line\" d=\"~MFyz1FJmLG2UbLG4V1LE3G3L-1G4L0T4L_1G4LF3G3LH4V1LU41LH4_1LF3F3L_1H4L0U4L-1H4LE3F3LG4_1\"/><path class=\"m-line\" d=\"~MPwz1P(lLjz3L72L32L30L16L22L26L44L4aL26L44L16L20L02L13L11L44L28L44L11L59L7bLblLdnLhvLdtLbjL9dL35L02L28L8iL4gL04L06L24L12L22L10L00L35L13L13L14L66L4cL6gLciLamL8gLagL4aL2aL26L16L32L56L04L1aL24L16L44L26L40L26L04L06L42L46L24L82L84L40L43L64L44L88L4cL6eL8iLamL8kL8gL4aL66L04L03L15L15L00L21L12L42L44L22L44LaeL8eL6aL00L07L3fLbjL9vLfvL9rL7lL5fL37L03L24L4aL04L03L11L20L02L22L44L48L48L06L46L02L62L21L61L45L60L82L22L63L23L09L29L3fL0dL4bL09L27L19L35L35L35L35L05L17L35L35L95L55Ld3L79Lb9L75L75L51L30L16L36\"/><path class=\"m-line\" d=\"~MFJvy.eL3W2L90L50L93L53L93L51L57L57L53L55L17L39L15L39L27L07L07L09L65L29L27L65L63L67L67L61L83La3L63La0L80L80L81La4L62La4L84L62L68L66L66L68L26L2aL66L08L0aL08L2aL38L16L3aL16L58L56L56L58L52L94L54L92L54L91\"/><path class=\"m-arrow\" d=\"~MFTpNwW1L)O1z!4MFpJiLEpIiLUeYO1\"/><path class=\"leader m\" d=\"M174.68 114.6L109.61 142H99.61\"/><path class=\"leader m\" d=\"M115.4 261.57L103.16 316H93.16\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"assisted-pull-up-m-partial\" data-key=\"partial\" data-cue=\"The arms never straighten at the bottom: a half rep.\" class=\"plate-callout two m\" style=\"left:16.2%;top:33.52%\" aria-pressed=\"true\">Arms<br>bent</button><button type=\"button\" id=\"assisted-pull-up-m-high\" data-key=\"high\" data-cue=\"The pad never sinks to the dead hang.\" class=\"plate-callout two m\" style=\"left:7.26%;top:82.12%\" aria-pressed=\"false\">Pad<br>stays up</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "pad",
        cues: [{ key: "pad", cue: "Kneel on the pad and let it sink until the arms are straight." }, { key: "set", cue: "Draw the shoulder blades down and back before the elbows bend." }, { key: "chin", cue: "Pull until the chin clears the bar, then lower to straight arms." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "partial",
        cues: [{ key: "partial", cue: "The arms never straighten at the bottom: a half rep." }, { key: "high", cue: "The pad never sinks to the dead hang." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Arms bent</b><span>The arms never straighten at the bottom: a half rep.</span></li><li><b>Pad stays up</b><span>The pad never sinks to the dead hang.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower 3 seconds, pull 2 seconds, hold 1 second\"><div class=\"tempo-seg move\" style=\"flex:3 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>3 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div></div>",
      alt: "Assisted pull-up, side view. Kneeling on the machine pad, overhand grip a little wider than the shoulders. From the chin over the bar, the body lowers slowly to a straight-arm hang with the knees on the pad.",
      mistakeAlt: "Assisted Pull-up: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hang",
    "orientation": "pronated",
    "handle": "bar-32",
    "loadAxis": "across",
    "width": {
      "text": "About shoulder width, or a little wider.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "bullbar-assist-beginner",
          "strengthlog-assisted-pull-up"
        ],
        "note": "c1"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "hk-baechle-grip"
        ],
        "note": "c12"
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        35
      ],
      "limitText": "Keep your wrist from curling forward.",
      "claim": {
        "tags": [
          "MECH",
          "CONVENTION"
        ],
        "sources": [
          "odriscoll-1992",
          "hand-key-bar"
        ],
        "note": "c14. The ext range is the bar key's hang wristRange (ga:hang-base), a convention, not a card number."
      }
    },
    "pose": {
      "view": "radial",
      "forearm": 180,
      "wrist": {
        "ext": 10,
        "dev": 0
      },
      "contactAt": 1,
      "fingers": {
        "curl": 1
      },
      "thumb": "wrapped",
      "squeeze": "firm",
      "load": {
        "kind": "gravity"
      }
    },
    "faults": [
      {
        "key": "curled",
        "label": "Wrist curled",
        "pose": {
          "wrist": {
            "dev": 0,
            "ext": -30
          }
        },
        "markers": [
          "lever-arc"
        ],
        "alt": "Wrist curled forward toward the forearm."
      }
    ],
    "gripLine": "Overhand, thumbs wrapped around the bar.",
    "cue": "Overhand, thumbs wrapped."
  },
  contacts: [
    "brace-pad"
  ],
  setup: [
    {
      "kind": "load",
      "text": "More stack weight, more help. Use the least for full reps.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "bullbar-assist-beginner",
          "bullbar-assist-safety"
        ],
        "note": "c4, c5"
      }
    },
    {
      "kind": "grip",
      "text": "Overhand, about shoulder width or a little wider, thumbs wrapped.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "bullbar-assist-beginner",
          "strengthlog-assisted-pull-up",
          "hk-baechle-grip"
        ],
        "note": "c1, c12"
      }
    },
    {
      "kind": "position",
      "text": "Knees securely on the pad. Let it sink until your arms straighten.",
      "zoom": "knee-pad",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "bullbar-assist-beginner",
          "strengthlog-assisted-pull-up"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "brace",
      "text": "Blades down and back, then pull elbows to ribs, chest up.",
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "bullbar-assist-beginner",
          "nasm-chin-pull",
          "strengthlog-assisted-pull-up"
        ],
        "note": "c7, c2"
      }
    },
    {
      "kind": "load",
      "text": "Over the weeks, add reps first, then take assistance away.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-chin-pull",
          "bullbar-assist-beginner"
        ],
        "note": "c6"
      }
    }
  ],
  posture: [
    {
      "key": "straight",
      "label": "Straight arms",
      "detail": "Arms fully straight at the bottom of every rep.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "zoom": "knee-pad",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-assisted-pull-up",
          "bullbar-assist-beginner"
        ],
        "note": "c3"
      }
    },
    {
      "key": "blades",
      "label": "Shoulders set",
      "detail": "Shoulder blades down and back before the arms bend.",
      "anchor": {
        "pose": "end",
        "at": "shoulderTop.r"
      },
      "zoom": "shoulders",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bullbar-assist-beginner",
          "nasm-chin-pull"
        ],
        "note": "c7"
      }
    },
    {
      "key": "elbows",
      "label": "Elbows down",
      "detail": "Elbows drive down toward the ribs.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bullbar-assist-beginner",
          "nasm-chin-pull"
        ],
        "note": "c7"
      }
    },
    {
      "key": "chest",
      "label": "Chest up",
      "detail": "Chest up at the top, shoulders not hunched.",
      "anchor": {
        "pose": "start",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "bullbar-assist-beginner",
          "strengthlog-assisted-pull-up"
        ],
        "note": "c2"
      }
    },
    {
      "key": "chin",
      "label": "Chin over bar",
      "detail": "Chin over the bar at the top.",
      "anchor": {
        "pose": "start",
        "at": "chin"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-assisted-pull-up",
          "bullbar-assist-beginner"
        ],
        "note": "c3"
      }
    },
    {
      "key": "still",
      "label": "No swing",
      "detail": "No swing or leg drive.",
      "anchor": {
        "pose": "end",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "bullbar-assist-beginner",
          "nasm-chin-pull"
        ],
        "note": "c8"
      }
    }
  ],
  zooms: [
    {
      "key": "hand",
      "chip": "Hand",
      "heading": "Hand: right and wrong",
      "kind": "hand"
    },
    {
      "key": "knee-pad",
      "chip": "Bottom",
      "heading": "Bottom position",
      "kind": "posture"
    },
    {
      "key": "shoulders",
      "chip": "Shoulders",
      "heading": "Shoulder set",
      "kind": "posture",
      "feelRow": "traps"
    }
  ],
  chips: [
    "hand",
    "knee-pad",
    "shoulders",
    "feel"
  ],
  copy: {
    "setupLine": "Knees on the pad, overhand grip. Hang with straight arms, shoulders down and back.",
    "mistakeLine": "Straighten your arms fully at the bottom. Lower slowly, never drop.",
    "cueLine": "Shoulders down, then pull."
  },
  mistakes: [
    {
      "key": "drop",
      "title": "Dropping fast when lowering",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "bullbar-assist-safety"
        ],
        "note": "c16"
      },
      "fix": "Take three to four seconds to lower to straight arms."
    },
    {
      "key": "half",
      "title": "Stopping short",
      "zoom": "knee-pad",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "bullbar-assist-beginner",
          "nasm-chin-pull",
          "bullbar-assist-safety"
        ],
        "note": "c8, c5"
      },
      "fix": "Full hang to chin over the bar. Can't? Add a little assistance."
    },
    {
      "key": "swing",
      "title": "Swinging or leg drive",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "bullbar-assist-safety"
        ],
        "note": "c5"
      },
      "fix": "Add assistance until every rep is controlled."
    }
  ],
  risks: [
    {
      "key": "shoulder",
      "text": "Arms overhead narrow the space under the shoulder roof.",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [
          "prinold-2016"
        ],
        "note": "c10"
      }
    },
    {
      "key": "elbow",
      "text": "Elbows can get overused when pulling volume rises too fast.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "nasm-chin-pull"
        ],
        "note": "c13"
      }
    },
    {
      "key": "neck",
      "text": "Resting your chin or neck on the pad loads the neck.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "bullbar-assist-safety"
        ],
        "note": "c17"
      }
    }
  ],
  riskFlags: [
    "shoulder",
    "elbow"
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
    "bullbar-assist-beginner",
    "bullbar-assist-safety",
    "strengthlog-assisted-pull-up",
    "nasm-chin-pull",
    "hk-baechle-grip",
    "odriscoll-1992",
    "prinold-2016",
    "youdas-2010",
    "hand-key-bar",
    "nhs-shoulder-pain",
    "nhs-elbow-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/assisted_pull_up.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

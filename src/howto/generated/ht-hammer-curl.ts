// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=9e3272f12e720250a914db420c88d0a8deb5dfb998434437a9c3b136221ecb23
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_hammer_curl",
  name: "Hammer Curl",
  hashes: { inputsSha256: "9e3272f12e720250a914db420c88d0a8deb5dfb998434437a9c3b136221ecb23", golden: "a9861b4072e2e851de7315c5dc69af5c6848bf3c5fc64b75847f4d367c181baa" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"hammer-curl-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"hammer-curl-n-st-fore.r\" d=\"~#F12yJvyNB1xOv)RA1W1Gaq!1P3NI1P3I9U1E2exx1!6Xc0Eb.6Xcdxx1T1E2R3I9K3NI1p!1T1GaEa3KaSj1FhSaSj00110000212101110000021010000010000000101002000001010101002001001000000000000000\"/><path id=\"hammer-curl-n-st-fist.r\" d=\"~~!PvAEO1ww10\"/><path id=\"hammer-curl-n-g0-fore.r\" d=\"~#F12WSvDzD1xBvOHB1K4K9U1A1YrSx1I2T91.2RiGrV1IeO6B9.cR6GjXqV2vE8R5ymPB1gw2I7K7I8W5U2Am!9ye_jwa01210110000000022000000000020010002000000000000000000100000010000002000101000121\"/><path id=\"hammer-curl-n-g0-fist.r\" d=\"~~NAB1PNK1ww10\"/><path id=\"hammer-curl-n-g0-eq1.dumbbell.1-0\" d=\"~M_XF1WKK1LyB1)pQW7I5Xy1(cLTK1XP1QI5V7FuP.1L)nHsQT7J5_y1*cLPK1YP1QJ5W7BuO.1Z\"/><path id=\"hammer-curl-n-g0-eq1.dumbbell.2-1\" d=\"~MyRz1JOK1LxB1wqQV7J5Yy1*cLUK1YP1QJ5W7GuO.1LAoGsQU7I5.y1(cLOK1XP1QI5V7DuP.1Z\"/><path id=\"hammer-curl-n-g1-fore.r\" d=\"~#F12FAw1UPD1*HvBAD1x9B5w21yH1UbT7R6R1G2*uVbT9-aRa.3IeA2zv*aX2o)96UE1yiP1J1Ea.1T3N9_eUgDg_5wmz300210100000002000020001000000000010000012100020200010100000000000000202101220002\"/><path id=\"hammer-curl-n-g1-fist.r\" d=\"~~yXF1A-F1ww10\"/><path id=\"hammer-curl-n-g1-eq1.dumbbell.1-0\" d=\"~M!_I1UFE1LNfRH1QF3-8)kSuLIx2-dQ-8B3(_1NvLO3!A1QB3_8AlOuLHx2_dQ_8F3*_1IvZ\"/><path id=\"hammer-curl-n-g1-eq1.dumbbell.2-1\" d=\"~MFTE1WGH1LKfPH1QE3_8wlKuLJx2YdQ_8D3*_1KvLP3.A1QD3-8zlNuLGx2XdQ-8B3(_1NvZ\"/><path id=\"hammer-curl-n-g2-fore.r\" d=\"~#F12J_w1URD1O(v)VD1Kaw1W1B1wG1Te.9vX2t*vy8zeG3.a(2Oa(9-v(8.1D2x8_5!H1-7w26O9H4P2!9Uly5UgK4DgBf00000000000000002000100021010000002000001000000000002001010100002200000200000000\"/><path id=\"hammer-curl-n-g2-fist.r\" d=\"~~F)F1w*y1ww10\"/><path id=\"hammer-curl-n-g2-eq1.dumbbell.1-0\" d=\"~Mw.H1JNw1LXbVI1QK2x98yB1LI*1AqQx9N2Fy2)7LHiDw1QN2y95xB1LN*1zqQw9K2Gy2w8Z\"/><path id=\"hammer-curl-n-g2-eq1.dumbbell.2-1\" d=\"~MSzG1WIB1LYbWI1QJ2y99xB1LP*1zqQy9K2Gy2w8LIiBw1QI2x9ayB1LO*1AqQx9N2Hy2)7Z\"/><path id=\"hammer-curl-n-e-thigh.l\" d=\"~#F12FXuHRH1X!tGHG1I7G9x1kwy1_U1J1X9c-4xoKO1jxq*9Rhzm.dOs)J1G4)1z9-3ysAY1y1fE4Bb*w1A5A1NN1_hDvFE1Yo01200000200000002201110000000020000000100002101000000100000001000100020020000200\"/><path id=\"hammer-curl-n-e-kneecap.l\" d=\"~~wOB1wwU1_J10\"/><path id=\"hammer-curl-n-e-shank.l\" d=\"~#F12SKB1J!T1xVB1TKS1Y2RbH125A)1S6G7A3X3P1)y2J8xdu*bE6zey9Oy2K2z4G5G8.9J(1B11r*bXdUazfSnV1WlFbUp10000000001100000200001000011110101002000000000000100020020000100000200000000110\"/><path id=\"hammer-curl-n-e-foot.l\" d=\"~#o2()A1AB)1RRB1zB(1!cF3Phx8Wp)nS-2B3-J2-4ID1)7)n2TG1Y4Bb-c_sBbKmSp220022110100000101000000000200100111101010111100\"/><path id=\"hammer-curl-n-e-shcap.l\" d=\"~~!wvNAswP10\"/><path id=\"hammer-curl-n-e-upper.l\" d=\"~#F12!wvNAs-xvVwre)8a2J2SO1D3*5P1*2W5RD1yaVi0OgxaViX5RD1K1*2B3*5G2SO1b2d)8EgvTdPp1PmYdPp12100102000020002020020010020000100002000002000000000010020100021000001010000000\"/><path id=\"hammer-curl-n-e-elbowcap.l\" d=\"~~WKvyNB1Dz10\"/><path id=\"hammer-curl-n-e-fore.l\" d=\"~#F12yKx1YBD1XYw1G-D1*7Y6k.1HpOz1-8_4V2qRl(oKdN5E7S8*2De.kSp7!2G3N9Suzv_1rE5w9U7S6UkB8AbBdP4Xl01000002002000011000200000000000000000000002001011100100020020011100022000100010\"/><path id=\"hammer-curl-n-e-fist.l\" d=\"~~A_B1F(tww10\"/><path id=\"hammer-curl-n-e-head\" d=\"~#w12w_w1H.h-DvVRhBjDjBjS9BbB3E3_4X4)7x8BbRhKm_4XcT1T9Bj0NmBbHmK6!kF3Dj(fT1Fj0001010100001000000000101000000002000000000000100000200000020000\"/><path id=\"hammer-curl-n-e-torso\" d=\"~#_12wHvHTmTTv.AlR9.1B3O5S9!eU9yaYcwgN60I6)nKm)7Xc_4(f-4_kI6NmxgShRh_4R9)7xgBrBz1EbBrG60V90!cwgA3w8Xc)7)fYaK6yiN6U3_cK8A3w8zT2ww100002100000000000000000020002000102000100000000100000000000001001000000020101000000010000000001010000000001000000000\"/><path id=\"hammer-curl-n-e-thigh.r\" d=\"~#F12ANuN)F1VRuKPE10-bE17E6P(1A7-6F3K3_axU1Yf.kA3*jT8RoY5*U1z2G4V4V8zdP*1D14U3Gb)sOg*r(A1T5Sz1HfYI100000200002000000000100020000100000002010100101010020011000101110000000000000101\"/><path id=\"hammer-curl-n-e-kneecap.r\" d=\"~~JPtPNV1_J10\"/><path id=\"hammer-curl-n-e-shank.r\" d=\"~#F12NUtJYU1GNuVPT1F7O9A1k-pU-1w9x4H4z2WsT!1!cO8_5Ra0KfHz1x-1hX4O1X9Iy1(U1vfw4Gb.gD4InHfKaAj1ws00002222000000000000020000100100210110000010121200100002000000001001001000002000\"/><path id=\"hammer-curl-n-e-foot.r\" d=\"~#o2PAoAB)1xWozB(1YcF3Uhx8Sp)nU-2B3-J2-4ID1)7)n2TG1Y4Bb-c_sBbKmSp021002110110100101000020000200100111000010111100\"/><path id=\"hammer-curl-n-e-shcap.r\" d=\"^18\"/><path id=\"hammer-curl-n-e-upper.r\" d=\"^19\"/><path id=\"hammer-curl-n-e-elbowcap.r\" d=\"^20\"/><path id=\"hammer-curl-n-e-fore.r\" d=\"^21\"/><path id=\"hammer-curl-n-e-fist.r\" d=\"^22\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#hammer-curl-n-dots)\"/>\n  <path class=\"floorline\" d=\"M94.86 339.5H258.7\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-n-st-fore.r\"/><use href=\"#hammer-curl-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-n-st-fore.r\"/><use href=\"#hammer-curl-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-n-g0-fore.r\"/><use href=\"#hammer-curl-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-n-g0-fore.r\"/><use href=\"#hammer-curl-n-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MJIE1NxJ1LT(2Fy2Qz5S3y*2R-1LDby5QS3A5tEcL(V2Xz2QA5R3x*2S-1LBbx5QR3z5uFcZ\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-n-g0-eq1.dumbbell.1-0\"/><use href=\"#hammer-curl-n-g0-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-n-g0-eq1.dumbbell.1-0\"/><use href=\"#hammer-curl-n-g0-eq1.dumbbell.2-1\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-n-g1-fore.r\"/><use href=\"#hammer-curl-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-n-g1-fore.r\"/><use href=\"#hammer-curl-n-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~My*G1!*D1LOE1SJ3Qz2!5FI1RA3LwcG2Q!5D2X7I9LPv.F3QA2.5EI1SA3L)bF2Q.5z2Y7P9Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-n-g1-eq1.dumbbell.1-0\"/><use href=\"#hammer-curl-n-g1-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-n-g1-eq1.dumbbell.1-0\"/><use href=\"#hammer-curl-n-g1-eq1.dumbbell.2-1\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-n-g2-fore.r\"/><use href=\"#hammer-curl-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-n-g2-fore.r\"/><use href=\"#hammer-curl-n-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MDyG1yGx1L!tSO3QU1w6BmBI3LP8V8Qy6T1XbI3LIy1.E3QT1)5HmDI3LR8W8Qx6U1YbJ3Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-n-g2-eq1.dumbbell.1-0\"/><use href=\"#hammer-curl-n-g2-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-n-g2-eq1.dumbbell.1-0\"/><use href=\"#hammer-curl-n-g2-eq1.dumbbell.2-1\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#hammer-curl-n-e-thigh.l\"/><use href=\"#hammer-curl-n-e-kneecap.l\"/><use href=\"#hammer-curl-n-e-shank.l\"/><use href=\"#hammer-curl-n-e-foot.l\"/><use href=\"#hammer-curl-n-e-shcap.l\"/><use href=\"#hammer-curl-n-e-upper.l\"/><use href=\"#hammer-curl-n-e-elbowcap.l\"/><use href=\"#hammer-curl-n-e-fore.l\"/><use href=\"#hammer-curl-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-n-e-thigh.l\"/><use href=\"#hammer-curl-n-e-kneecap.l\"/><use href=\"#hammer-curl-n-e-shank.l\"/><use href=\"#hammer-curl-n-e-foot.l\"/><use href=\"#hammer-curl-n-e-shcap.l\"/><use href=\"#hammer-curl-n-e-upper.l\"/><use href=\"#hammer-curl-n-e-elbowcap.l\"/><use href=\"#hammer-curl-n-e-fore.l\"/><use href=\"#hammer-curl-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-n-e-head\"/><use href=\"#hammer-curl-n-e-torso\"/><use href=\"#hammer-curl-n-e-thigh.r\"/><use href=\"#hammer-curl-n-e-kneecap.r\"/><use href=\"#hammer-curl-n-e-shank.r\"/><use href=\"#hammer-curl-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-n-e-head\"/><use href=\"#hammer-curl-n-e-torso\"/><use href=\"#hammer-curl-n-e-thigh.r\"/><use href=\"#hammer-curl-n-e-kneecap.r\"/><use href=\"#hammer-curl-n-e-shank.r\"/><use href=\"#hammer-curl-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-n-e-shcap.r\"/><use href=\"#hammer-curl-n-e-upper.r\"/><use href=\"#hammer-curl-n-e-elbowcap.r\"/><use href=\"#hammer-curl-n-e-fore.r\"/><use href=\"#hammer-curl-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-n-e-shcap.r\"/><use href=\"#hammer-curl-n-e-upper.r\"/><use href=\"#hammer-curl-n-e-elbowcap.r\"/><use href=\"#hammer-curl-n-e-fore.r\"/><use href=\"#hammer-curl-n-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~MNAB1HAtLPY2FH2Q_4w4VO2)H2L(1zcQy4X4Oby4LXX2Kx2QX4)3WO2yI2L*1wcQ)3_4Pb)3Z\"/><path class=\"disc\" d=\"~MWzD1(KrLVy1ztQB7)5PlHuLGz1UY1Qx6D7UR1TJ1LSx1!fQD7y6OlBuLHz1VY1Qy6B7TR1UJ1Z\"/><path class=\"disc\" d=\"~MPPE1SNw1LWy1ytQD7w6OlBuLJz1VY1Qw6B7XR1SJ1LKx1-fQB7x6JlDuLEz1WY1Q)5D7UR1RJ1Z\"/><path class=\"eq-cable m-line\" d=\"~MyJvyNB1LrS3L84L62L41L41L05L25L35L0bL29L03L05L21L00L04L04L05L0bL03L02L2eL0gL2uL4y1L2F1L2F1L0uL4gL0aL21L4bL0jL2hL27L23L25L21L20L11L20L0aL06L24L23L17L2fL0jL0nL1tL1lL0hL0hL27L49L23L82L43L85L27L43L27L03L07L11L17L41L07L03L17L13L57L35L73L32L53L19L07L3hL4hL0lL0tL2nL0jL0fL17L03L04L16L1aL20L11L00L11L15L03L37L1hL1jL1bL01L3aL0gL3uL0F1L1F1L3y1L0uL3gL0eL02L03L0bL05L04L04L00L01L15L13L09L2bL05L25L35L01L51L72L34\"/><path class=\"eq-cable m-line\" d=\"~MHJy1NNO1L.W30L!W3TeL!W3UeL.W3Ue\"/><path class=\"eq-cable m-line\" d=\"~MHJA1FWP1L))10Lww2B(2Lww2D(2L))1D(2\"/><path class=\"eq-cable m-line\" d=\"~MNVuFWP1L))10Lww2B(2Lww2D(2L))1D(2\"/><circle class=\"joint\" cx=\"166.54\" cy=\"144.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"166.54\" cy=\"191.69\" r=\"2.25\"/><circle class=\"joint\" cx=\"168\" cy=\"211.73\" r=\"2.25\"/><circle class=\"joint\" cx=\"158.27\" cy=\"273.68\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#H20W)y1y*N1IPy1KxO17p7nbn9ndlblfjflfhjjfhlfjhlbjfn9nbnbn5n9p5p3n3r1n1p0r2n2p4p6n8n6pcn8lclc0001012100010001200000020000020000000011000120000001010000200000101001000100020001010012100020010121000010000021010000000002000000021001000000000000\"/><path class=\"arrow\" d=\"~MSBF1WBvLNz1PmLRz2B3Z\"/></g><path class=\"leader\" d=\"~MA_D1F(tL0XD2\"/><circle class=\"anchor\" cx=\"198.74\" cy=\"153.32\" r=\"1.5\"/><path class=\"leader\" d=\"M166.54 191.69L157.5 182H147.5\"/><circle class=\"anchor\" cx=\"166.54\" cy=\"191.69\" r=\"1.5\"/><path class=\"leader\" d=\"~M_DtHIuL0GN1\"/><circle class=\"anchor\" cx=\"149.57\" cy=\"155.41\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"hammer-curl-n-grip\" data-key=\"grip\" data-cue=\"Keep the palms facing your body from bottom to top. No wrist twist.\" class=\"plate-callout two\" style=\"left:55.87%;top:28.49%\" aria-pressed=\"true\">Neutral<br>grip</button><button type=\"button\" id=\"hammer-curl-n-elbows\" data-key=\"elbows\" data-cue=\"Keep the elbows by your body. Do not move them forward.\" class=\"plate-callout two\" style=\"left:25.14%;top:44.69%\" aria-pressed=\"false\">Elbows<br>still</button><button type=\"button\" id=\"hammer-curl-n-torso\" data-key=\"torso\" data-cue=\"Stand tall with the lower back not arched and the shoulders not shrugged.\" class=\"plate-callout two\" style=\"left:24.02%;top:30.17%\" aria-pressed=\"false\">Upright<br>torso</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"hammer-curl-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"hammer-curl-m-st-fore.r\" d=\"^0\"/><path id=\"hammer-curl-m-st-fist.r\" d=\"^1\"/><path id=\"hammer-curl-m-g0-fore.r\" d=\"^2\"/><path id=\"hammer-curl-m-g0-fist.r\" d=\"^3\"/><path id=\"hammer-curl-m-g0-eq1.dumbbell.1-0\" d=\"^4\"/><path id=\"hammer-curl-m-g0-eq1.dumbbell.2-1\" d=\"^5\"/><path id=\"hammer-curl-m-g1-fore.r\" d=\"^6\"/><path id=\"hammer-curl-m-g1-fist.r\" d=\"^7\"/><path id=\"hammer-curl-m-g1-eq1.dumbbell.1-0\" d=\"^8\"/><path id=\"hammer-curl-m-g1-eq1.dumbbell.2-1\" d=\"^9\"/><path id=\"hammer-curl-m-g2-fore.r\" d=\"^10\"/><path id=\"hammer-curl-m-g2-fist.r\" d=\"^11\"/><path id=\"hammer-curl-m-g2-eq1.dumbbell.1-0\" d=\"^12\"/><path id=\"hammer-curl-m-g2-eq1.dumbbell.2-1\" d=\"^13\"/><path id=\"hammer-curl-m-e-thigh.l\" d=\"^14\"/><path id=\"hammer-curl-m-e-kneecap.l\" d=\"^15\"/><path id=\"hammer-curl-m-e-shank.l\" d=\"^16\"/><path id=\"hammer-curl-m-e-foot.l\" d=\"^17\"/><path id=\"hammer-curl-m-e-shcap.l\" d=\"^18\"/><path id=\"hammer-curl-m-e-upper.l\" d=\"^19\"/><path id=\"hammer-curl-m-e-elbowcap.l\" d=\"^20\"/><path id=\"hammer-curl-m-e-fore.l\" d=\"^21\"/><path id=\"hammer-curl-m-e-fist.l\" d=\"^22\"/><path id=\"hammer-curl-m-e-head\" d=\"^23\"/><path id=\"hammer-curl-m-e-torso\" d=\"^24\"/><path id=\"hammer-curl-m-e-thigh.r\" d=\"^25\"/><path id=\"hammer-curl-m-e-kneecap.r\" d=\"^26\"/><path id=\"hammer-curl-m-e-shank.r\" d=\"^27\"/><path id=\"hammer-curl-m-e-foot.r\" d=\"^28\"/><path id=\"hammer-curl-m-e-shcap.r\" d=\"^18\"/><path id=\"hammer-curl-m-e-upper.r\" d=\"^19\"/><path id=\"hammer-curl-m-e-elbowcap.r\" d=\"^20\"/><path id=\"hammer-curl-m-e-fore.r\" d=\"^21\"/><path id=\"hammer-curl-m-e-fist.r\" d=\"^22\"/><path id=\"hammer-curl-m-m-shcap.r\" d=\"^18\"/><path id=\"hammer-curl-m-m-upper.r\" d=\"~#F12(NvJDtIWuKJs*5T667Hz1(v*1I6x1z3znIvB6EkTbXbIkx6GvBnx3x1O6)1ww1Jz178R6x6EcYaJ8Yr!f!fYrJ810020001101010000202002001000000010002000000000000000200020000000200000012000212\"/><path id=\"hammer-curl-m-m-elbowcap.r\" d=\"~~ywD1!Wy1Dz10\"/><path id=\"hammer-curl-m-m-fore.r\" d=\"~#F12_DF1Nwz1T!E1X_z1I4P97)1(7.H1.5y8B2(1*8Wv)9Sa-2!aF3Aex8(vuY2w1!9Se)F1H1V1x1NaY9Y2FfBgP4TgB5Tl20001000202100010100020001011002000010000002100100101221011010000000200000100001\"/><path id=\"hammer-curl-m-m-fist.r\" d=\"~~HUF1PFpww10\"/><path id=\"hammer-curl-m-m-eq0\" d=\"~MYYE1WEpLSO3!tQy6U1.E3Gy1LI3XbQU1)5X8S8LzI3GmQ)5R1(E3Jy1LF3YbQR1y6_8O8Z\"/><path id=\"hammer-curl-m-m-eq1\" d=\"~My(E1DGnLVI1XbQx9K2Dw1JiLx8Hy2QI2y9DqO*1LAB1aQy9N2Gw1IiLA8Gy2QN2x9BqP*1Z\"/><path id=\"hammer-curl-m-m-eq2\" d=\"~MSHI1_ErLYI1WbQy9N2Ew1GiLw8Ey2QN2x9zqJ*1LxB15Qx9K2Dw1HiLx8Fy2QI2y9DqI*1Z\"/><path id=\"hammer-curl-m-mf-head\" d=\"^23\"/><path id=\"hammer-curl-m-mf-torso\" d=\"^24\"/><path id=\"hammer-curl-m-mf-thigh.l\" d=\"^14\"/><path id=\"hammer-curl-m-mf-kneecap.l\" d=\"^15\"/><path id=\"hammer-curl-m-mf-shank.l\" d=\"^16\"/><path id=\"hammer-curl-m-mf-foot.l\" d=\"^17\"/><path id=\"hammer-curl-m-mf-shcap.l\" d=\"^18\"/><path id=\"hammer-curl-m-mf-upper.l\" d=\"^45\"/><path id=\"hammer-curl-m-mf-elbowcap.l\" d=\"^46\"/><path id=\"hammer-curl-m-mf-fore.l\" d=\"^47\"/><path id=\"hammer-curl-m-mf-fist.l\" d=\"^48\"/><path id=\"hammer-curl-m-mf-thigh.r\" d=\"^25\"/><path id=\"hammer-curl-m-mf-kneecap.r\" d=\"^26\"/><path id=\"hammer-curl-m-mf-shank.r\" d=\"^27\"/><path id=\"hammer-curl-m-mf-foot.r\" d=\"^28\"/><path id=\"hammer-curl-m-mo-0\" d=\"^23\"/><path id=\"hammer-curl-m-mo-1\" d=\"^24\"/><path id=\"hammer-curl-m-mo-2\" d=\"^14\"/><path id=\"hammer-curl-m-mo-3\" d=\"^15\"/><path id=\"hammer-curl-m-mo-4\" d=\"^16\"/><path id=\"hammer-curl-m-mo-5\" d=\"^17\"/><path id=\"hammer-curl-m-mo-6\" d=\"^18\"/><path id=\"hammer-curl-m-mo-7\" d=\"^19\"/><path id=\"hammer-curl-m-mo-8\" d=\"^20\"/><path id=\"hammer-curl-m-mo-9\" d=\"^21\"/><path id=\"hammer-curl-m-mo-10\" d=\"^22\"/><path id=\"hammer-curl-m-mo-11\" d=\"^25\"/><path id=\"hammer-curl-m-mo-12\" d=\"^26\"/><path id=\"hammer-curl-m-mo-13\" d=\"^27\"/><path id=\"hammer-curl-m-mo-14\" d=\"^28\"/><path id=\"hammer-curl-m-mo-15\" d=\"^18\"/><path id=\"hammer-curl-m-mo-16\" d=\"^19\"/><path id=\"hammer-curl-m-mo-17\" d=\"^20\"/><path id=\"hammer-curl-m-mo-18\" d=\"^21\"/><path id=\"hammer-curl-m-mo-19\" d=\"^22\"/><path id=\"hammer-curl-m-mo-20\" d=\"^33\"/><path id=\"hammer-curl-m-mo-21\" d=\"^34\"/><path id=\"hammer-curl-m-mo-22\" d=\"^35\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#hammer-curl-m-dots)\"/>\n  <path class=\"floorline\" d=\"^29\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-m-st-fore.r\"/><use href=\"#hammer-curl-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-m-st-fore.r\"/><use href=\"#hammer-curl-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-m-g0-fore.r\"/><use href=\"#hammer-curl-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-m-g0-fore.r\"/><use href=\"#hammer-curl-m-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^30\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-m-g0-eq1.dumbbell.1-0\"/><use href=\"#hammer-curl-m-g0-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-m-g0-eq1.dumbbell.1-0\"/><use href=\"#hammer-curl-m-g0-eq1.dumbbell.2-1\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-m-g1-fore.r\"/><use href=\"#hammer-curl-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-m-g1-fore.r\"/><use href=\"#hammer-curl-m-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^31\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-m-g1-eq1.dumbbell.1-0\"/><use href=\"#hammer-curl-m-g1-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-m-g1-eq1.dumbbell.1-0\"/><use href=\"#hammer-curl-m-g1-eq1.dumbbell.2-1\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-m-g2-fore.r\"/><use href=\"#hammer-curl-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-m-g2-fore.r\"/><use href=\"#hammer-curl-m-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^32\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-m-g2-eq1.dumbbell.1-0\"/><use href=\"#hammer-curl-m-g2-eq1.dumbbell.2-1\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-m-g2-eq1.dumbbell.1-0\"/><use href=\"#hammer-curl-m-g2-eq1.dumbbell.2-1\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#hammer-curl-m-e-thigh.l\"/><use href=\"#hammer-curl-m-e-kneecap.l\"/><use href=\"#hammer-curl-m-e-shank.l\"/><use href=\"#hammer-curl-m-e-foot.l\"/><use href=\"#hammer-curl-m-e-shcap.l\"/><use href=\"#hammer-curl-m-e-upper.l\"/><use href=\"#hammer-curl-m-e-elbowcap.l\"/><use href=\"#hammer-curl-m-e-fore.l\"/><use href=\"#hammer-curl-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-m-e-thigh.l\"/><use href=\"#hammer-curl-m-e-kneecap.l\"/><use href=\"#hammer-curl-m-e-shank.l\"/><use href=\"#hammer-curl-m-e-foot.l\"/><use href=\"#hammer-curl-m-e-shcap.l\"/><use href=\"#hammer-curl-m-e-upper.l\"/><use href=\"#hammer-curl-m-e-elbowcap.l\"/><use href=\"#hammer-curl-m-e-fore.l\"/><use href=\"#hammer-curl-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-m-e-head\"/><use href=\"#hammer-curl-m-e-torso\"/><use href=\"#hammer-curl-m-e-thigh.r\"/><use href=\"#hammer-curl-m-e-kneecap.r\"/><use href=\"#hammer-curl-m-e-shank.r\"/><use href=\"#hammer-curl-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-m-e-head\"/><use href=\"#hammer-curl-m-e-torso\"/><use href=\"#hammer-curl-m-e-thigh.r\"/><use href=\"#hammer-curl-m-e-kneecap.r\"/><use href=\"#hammer-curl-m-e-shank.r\"/><use href=\"#hammer-curl-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#hammer-curl-m-e-shcap.r\"/><use href=\"#hammer-curl-m-e-upper.r\"/><use href=\"#hammer-curl-m-e-elbowcap.r\"/><use href=\"#hammer-curl-m-e-fore.r\"/><use href=\"#hammer-curl-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#hammer-curl-m-e-shcap.r\"/><use href=\"#hammer-curl-m-e-upper.r\"/><use href=\"#hammer-curl-m-e-elbowcap.r\"/><use href=\"#hammer-curl-m-e-fore.r\"/><use href=\"#hammer-curl-m-e-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^33\"/><path class=\"disc\" d=\"^34\"/><path class=\"disc\" d=\"^35\"/><path class=\"eq-cable m-line\" d=\"^36\"/><path class=\"eq-cable m-line\" d=\"^37\"/><path class=\"eq-cable m-line\" d=\"^38\"/><path class=\"eq-cable m-line\" d=\"^39\"/><circle class=\"joint\" cx=\"166.54\" cy=\"144.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"166.54\" cy=\"191.69\" r=\"2.25\"/><circle class=\"joint\" cx=\"168\" cy=\"211.73\" r=\"2.25\"/><circle class=\"joint\" cx=\"158.27\" cy=\"273.68\" r=\"2.25\"/></g><mask id=\"hammer-curl-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#hammer-curl-m-mf-head\" fill=\"#000\"/><use href=\"#hammer-curl-m-mf-torso\" fill=\"#000\"/><use href=\"#hammer-curl-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#hammer-curl-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#hammer-curl-m-mf-shank.l\" fill=\"#000\"/><use href=\"#hammer-curl-m-mf-foot.l\" fill=\"#000\"/><use href=\"#hammer-curl-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#hammer-curl-m-mf-upper.l\" fill=\"#000\"/><use href=\"#hammer-curl-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#hammer-curl-m-mf-fore.l\" fill=\"#000\"/><use href=\"#hammer-curl-m-mf-fist.l\" fill=\"#000\"/><use href=\"#hammer-curl-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#hammer-curl-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#hammer-curl-m-mf-shank.r\" fill=\"#000\"/><use href=\"#hammer-curl-m-mf-foot.r\" fill=\"#000\"/><use href=\"#hammer-curl-m-m-shcap.r\" fill=\"#000\"/><use href=\"#hammer-curl-m-m-upper.r\" fill=\"#000\"/><use href=\"#hammer-curl-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#hammer-curl-m-m-fore.r\" fill=\"#000\"/><use href=\"#hammer-curl-m-m-fist.r\" fill=\"#000\"/><use href=\"#hammer-curl-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#hammer-curl-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#hammer-curl-m-mmask)\"><g class=\"u-stroke\"><use href=\"#hammer-curl-m-m-shcap.r\"/><use href=\"#hammer-curl-m-m-upper.r\"/><use href=\"#hammer-curl-m-m-elbowcap.r\"/><use href=\"#hammer-curl-m-m-fore.r\"/><use href=\"#hammer-curl-m-m-fist.r\"/><use href=\"#hammer-curl-m-m-eq0\"/><use href=\"#hammer-curl-m-m-eq1\"/><use href=\"#hammer-curl-m-m-eq2\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~M(NvJDtLS2!3Lc7L85L45L05L11L33L71L71L55L33L03L30L01L22L22L77L97L33L40L6aLieLkiLusLw1uLusLomLeeL84L22L59LdfL79L05L11L13L01L01L11L00L66L66L24L15L55LbfLbhLjnLhpLhhLdfLbfL5dL19L37L47L07L0dL1bL37L37L57L53L71L55L17L35L75L53Lb3L91Lb1Lb4L30L90Lb3Lb7Lf9LfdLhfLpjLnjLhdLd9L95L10L00L86L66L01L12L11L11L10L50L11Ld9LdbL73L11L6aLggLimLusLuA1LsqLioLgeL6aL22L13LbbL53L40L12L21L30L11L33L55L17L17L33L13L54L32L78L7aLb6Lb0L94L16L3aL4cL8gLaiL6mL2iL4eL4eL8aL6aL84Lc6L68L48L6aLa8La6Le4Le4Lk0LiaLk8Lg8Lc2La0L83L29L0d\"/><path class=\"m-line\" d=\"~MPDF1!Wy1LV2PdL*4x2L-3-3L)1*4L1I5Ly2*4L_3-3L(4x2LJ52L(4w2L_3_3Ly2(4L1J5L)1(4L-3_3L*4w2\"/><path class=\"m-line\" d=\"~M_DF1Nwz1L_1E3L73L53L30L32L14L18L06L1aL3aL14L16L10L22L13L23L04L3eL12L21L2bL2hL6rL6vLaI1L8z1L4rL4hL07L01L7eL3iL7gL38L32L16L12L12L01L00L05L29L01L14L16L3gL5iL5sL5oL3oL5iL1eL5cL56L32L30L70L74L36L56L36L04L06L14L26L54L16L06L04L28L08L68L44L60L26L28L0cL5eL3kL7kL7qL7qL3kL3cL1aL04L21L49L03L23L24L11L26L04L04L2aL3gL3mL0aL22L27L8fL8rLcz1LcE1Lcx1LanL6hL4bL21L12L3eL04L03L23L12L20L06L18L06L3cL36L16L06L22L64L41La0L64L26L46L61L61L85L8bL8dLcbLc7L87L87L47L27L27L19L45L27L65L29L19L19L19L5dL5fL2fL3dL17L17L71L12L94\"/><path class=\"m-line\" d=\"~MHUH1PFpL3y3Lb4L73L93L73L93L73L77L57L75L37L37L3bL35L1bL07L2bL37L4bL45L4bL47L47L85L87L67L83L83Lc3L63Lc3L84Lc1L80Lc2L64Lc4L82L88L66L86L88L48L4aL48L4aL48L3cL28L0cL18L3aL38L3aL38L78L56L76L78L92L74L94L72Lb0\"/><path class=\"m-line\" d=\"~M!Pw1NUpL0HSc\"/><path class=\"leader m\" d=\"~MHzE1UyA1L(B7zh\"/><path class=\"leader m\" d=\"M174.54 142.07L203 96H213\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"hammer-curl-m-elbows\" data-key=\"elbows\" data-cue=\"Your elbows move forward as the dumbbells come up.\" class=\"plate-callout two m\" style=\"left:64.8%;top:44.69%\" aria-pressed=\"true\">Elbows<br>forward</button><button type=\"button\" id=\"hammer-curl-m-shoulder\" data-key=\"shoulder\" data-cue=\"The front of your shoulder takes the load instead of the biceps.\" class=\"plate-callout two m\" style=\"left:58.1%;top:20.67%\" aria-pressed=\"false\">Shoulder<br>takes over</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "grip",
        cues: [{ key: "grip", cue: "Keep the palms facing your body from bottom to top. No wrist twist." }, { key: "elbows", cue: "Keep the elbows by your body. Do not move them forward." }, { key: "torso", cue: "Stand tall with the lower back not arched and the shoulders not shrugged." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "Your elbows move forward as the dumbbells come up." }, { key: "shoulder", cue: "The front of your shoulder takes the load instead of the biceps." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Elbows forward</b><span>Your elbows move forward as the dumbbells come up.</span></li><li><b>Shoulder takes over</b><span>The front of your shoulder takes the load instead of the biceps.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: curl 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Curl</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Hammer curl, side view. Standing in a split stance with a dumbbell in each hand, palms facing the body. The elbows stay by the body while the forearms curl the dumbbells from the thighs up to the front of the shoulders.",
      mistakeAlt: "Hammer Curl: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "curl",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-W5-HAMMER: the card zoom's Wrong, the wrist twisting toward palms up (c5), is a forearm rotation the curl key cannot draw; the grip copy carries c1, c4 and c5.",
    "orientation": "neutral",
    "handle": "dumbbell",
    "width": {
      "text": "Let the dumbbells hang slightly out from your sides if that keeps your wrist straight.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-hammer"
        ],
        "note": "c10"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-hammer"
        ],
        "note": "c1"
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "ext": [
        -10,
        10
      ],
      "limitText": "Keep the wrist from twisting through the lift.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "CONVENTION"
        ],
        "sources": [
          "ace-hammer",
          "sl-hammer",
          "ga-curl-mid"
        ],
        "note": "c5, c4. The ext range is pairs.mjs CONVENTIONS ga:curl-mid, a convention, not a card number."
      }
    },
    "faults": [],
    "gripLine": "Closed neutral grip, thumbs round the handles. Wrist straight, palms facing your body.",
    "cue": "Palms facing you, wrists straight."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "load",
      "text": "Pick dumbbells you can curl without swinging.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-hammer"
        ],
        "note": "c7"
      }
    },
    {
      "kind": "position",
      "text": "Take a split stance, brace, shoulders down and back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-hammer"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "grip",
      "text": "Hold the dumbbells with a closed neutral grip beside your thighs.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-hammer"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Curl to the front of the shoulders, lower to straight arms.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-hammer"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "brace",
      "text": "Torso upright, no arching the lower back, no shrugging.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-hammer"
        ],
        "note": "c4"
      }
    }
  ],
  posture: [
    {
      "key": "grip",
      "label": "Neutral grip",
      "detail": "Palms keep facing your body, no wrist twist.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-hammer"
        ],
        "note": "c5"
      }
    },
    {
      "key": "elbows",
      "label": "Elbows still",
      "detail": "Elbows do not move forward.",
      "anchor": {
        "pose": "end",
        "at": "elbow.r"
      },
      "zoom": "hammer-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-hammer"
        ],
        "note": "c4"
      }
    },
    {
      "key": "torso",
      "label": "Upright torso",
      "detail": "Torso upright. No arching the lower back.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-hammer"
        ],
        "note": "c4"
      }
    },
    {
      "key": "shrug",
      "label": "No shrugging",
      "detail": "No shrugging.",
      "anchor": {
        "pose": "end",
        "at": "shoulderTop.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-hammer"
        ],
        "note": "c4"
      }
    },
    {
      "key": "lower",
      "label": "Straight arms",
      "detail": "Lower until the elbows are fully straight.",
      "anchor": {
        "pose": "start",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-hammer"
        ],
        "note": "c3"
      }
    },
    {
      "key": "range",
      "label": "Full range",
      "detail": "Full range, not half reps.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-hammer"
        ],
        "note": "c7"
      }
    }
  ],
  zooms: [
    {
      "key": "hammer-elbow",
      "chip": "Elbows",
      "heading": "Elbow path",
      "kind": "posture",
      "feelRow": "front-shoulder"
    }
  ],
  chips: [
    "hammer-elbow",
    "feel"
  ],
  copy: {
    "setupLine": "Split stance, torso braced, shoulders down and back. Dumbbells beside your thighs, palms facing your body.",
    "mistakeLine": "Keep the torso upright, no arching the lower back, no shrugging. Go full range, never half reps.",
    "cueLine": "Palms facing you all the way."
  },
  mistakes: [
    {
      "key": "elbows",
      "title": "Elbows moving forward or back",
      "zoom": "hammer-elbow",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-hammer",
          "ace-hammer"
        ],
        "note": "c6, c4"
      },
      "fix": "Keep the elbows at your sides."
    },
    {
      "key": "twist",
      "title": "Wrists twisting out of neutral",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-hammer"
        ],
        "note": "c5"
      },
      "fix": "Keep the palms facing your body the whole way."
    },
    {
      "key": "swing",
      "title": "Swinging the body",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-hammer"
        ],
        "note": "c7"
      },
      "fix": "Take weight off and lift with control."
    }
  ],
  risks: [
    {
      "key": "heavy",
      "text": "Too heavy a weight can make you swing and cut reps short.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-hammer"
        ],
        "note": "c7"
      }
    },
    {
      "key": "delts",
      "text": "Elbows moving forward put extra load on the front delts.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-hammer"
        ],
        "note": "c6"
      }
    }
  ],
  riskFlags: [
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
    "ace-hammer",
    "sl-hammer",
    "caufriez-2018",
    "ga-curl-mid",
    "nhs-wrist-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/hammer_curl.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

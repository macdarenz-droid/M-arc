// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=7dbb686d46ee84810f464ef02a68be452b75d481dc1cd20fedae3388685d881e
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_decline_bench_press",
  name: "Decline Bench Press",
  hashes: { inputsSha256: "7dbb686d46ee84810f464ef02a68be452b75d481dc1cd20fedae3388685d881e", golden: "df6135e4776efbf2393b737a31cbdc5b91dbe31d5bf0a49c9c42abe198db5602" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"decline-bench-press-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"decline-bench-press-n-st-upper.l\" d=\"~#F12FVrPzS1)Tr-DT1d_8b0*1BO1z3(5R1!2z6_B1BaSi7Pg(9!iH5_B1N1w3A3(5_2zO1a0e_8AgU1weIp6KmIdXp00000010011000220000000000000010000020010000000000001101000020120000021010012010\"/><path id=\"decline-bench-press-n-st-elbowcap.l\" d=\"~~yBpP!F1Dz10\"/><path id=\"decline-bench-press-n-st-fore.l\" d=\"~#F12yKrD!F1IHrBYG1R1Hap.1.3GI1K3J9T1H23(w1X6Yc4Fbw7Yco_w1U1H2U3F9A3GI1m.1_1FaDa4HaVj5BhVaOj10000000010120000000000200000100002200000000000000220000121200000000001000000010\"/><path id=\"decline-bench-press-n-st-fist.l\" d=\"~~FBpJAvww10\"/><path id=\"decline-bench-press-n-st-upper.r\" d=\"^0\"/><path id=\"decline-bench-press-n-st-elbowcap.r\" d=\"^1\"/><path id=\"decline-bench-press-n-st-fore.r\" d=\"^2\"/><path id=\"decline-bench-press-n-st-fist.r\" d=\"^3\"/><path id=\"decline-bench-press-n-g0-upper.r\" d=\"~#F12HSrSTS1-FrXHT1R2Y593F9zw1I4_2z2P1.bYf.fyeV5Pf(2ylx1WjiN2U1y5WdOua2X1y6AbUgYlEjW7xl)3Xs00020012000200000002000020012100021010010111000000021001011200100200021010002000\"/><path id=\"decline-bench-press-n-g0-elbowcap.r\" d=\"~~(GrH)I1Dz10\"/><path id=\"decline-bench-press-n-g0-fore.r\" d=\"~#F12URtw.I1RRt)TJ1jD9tO1)7-B1R2U8G1F2W2wrE5NdF1FbH8_bU3!q!1(1P4Y7x1TD1iV1Y2_8PaA2A8Tkx2BhVczi21210002000000000000200000000012000100010000220020001000020000010000001100000000\"/><path id=\"decline-bench-press-n-g0-fist.r\" d=\"~~SJq!Iz1ww10\"/><path id=\"decline-bench-press-n-g1-upper.r\" d=\"~#F12UzrAFT1TVqGST1T3H257HgKgB4j)15K7K1-ky4-cNax8Wj1N77y25H4Hj-c88x3y3X4!oJsR5NhEeyb-q00000101000000002020001011000011102200000010000000100000202100000000000120000002\"/><path id=\"decline-bench-press-n-g1-elbowcap.r\" d=\"~~_RsSEO1Dz10\"/><path id=\"decline-bench-press-n-g1-fore.r\" d=\"~#F12N-uUyO1K-u.YO1hD8vG1x8Ix1K2W7K1y2S2(lz5SdP1AbS8YbJ3_l_1S1S4!6B1Ky1kO1W2_7(aU4_7XkI2xh)c)h01010000000000012101100000000000000020000100002002000000221200000000020000000021\"/><path id=\"decline-bench-press-n-g1-fist.r\" d=\"~~(TrJTE1ww10\"/><path id=\"decline-bench-press-n-e-thigh.l\" d=\"~#F12yHF1DwO1KIE1zAP1x7U9ss(G1-N1-9H1V4qIE1_z1)oS7GeFeO7wpXz1JE1rW4G1_9_N1*G1rrT9y7YdJuJJ1IdNpKpJdIJ100101000000101001000000010000200000000200000000000000000000000010000010100000000\"/><path id=\"decline-bench-press-n-e-kneecap.l\" d=\"~~A!K1WUA1_J10\"/><path id=\"decline-bench-press-n-e-shank.l\" d=\"~#F12(yN1FOB1*HK1IDA1E5Xaw1lyF1YP1e-90.4OG1VU1.1Gf-6.9-d*6Iz1)Y1O4T1I9x3Aw1JW1x1mE8R8X3!gF3!rPcYhwpSc00000000101000002000010012120000000000001200000101010000100002000000102100010002\"/><path id=\"decline-bench-press-n-e-foot.l\" d=\"~#o2FFV1N-K1xUV1.WJ1Dduwg*awlxsWX2XiOJ2U8BE1B1TnA4zF1wcEdVaJq)fRhyt000020000000101110100000000000000001010000010010\"/><path id=\"decline-bench-press-n-e-shcap.l\" d=\"~~FVowzS1wP10\"/><path id=\"decline-bench-press-n-e-upper.l\" d=\"~#F12yWpSPT1XBpBHT1x4X14b_mA5-1.3r*1*2*6TeOfRfE5)kW3T6!3X1u-3y2JlU938G4tKnH9(jylHly7Ps*400100200110012021001000000200101200012000220020000200010011010100200000000000000\"/><path id=\"decline-bench-press-n-e-elbowcap.l\" d=\"~~wJt!PT1Dz10\"/><path id=\"decline-bench-press-n-e-fore.l\" d=\"~#F12!Tv(KT1VSvEAU1vF8tI1B6.x1)2S7I1y2F1ymX5FdsDb!7FcF2(lW1Y1D4y7mKy1mO1H2!7UaH5!8IkG1BhzcTi01200010120000010002200010010001000000010000120000000000200000000200002000001000\"/><path id=\"decline-bench-press-n-e-fist.l\" d=\"~~H.s__I1ww10\"/><path id=\"decline-bench-press-n-e-head\" d=\"~#w12yDgN-U1)NgXJW1YoFbWfUesUbW5H1.5H7T7Nb.eFoVd2I8_4W6(hIi)gXdXiG4TkF8RnSiE50200020002100202001200022010000000002101110000020000001000000000\"/><path id=\"decline-bench-press-n-e-torso\" d=\"~#_12FBlFRU1KWjOYU1gJaE3_5Ab)dP6EcAbEhK2O6RkAfbyqD8(aX8BeRbOiGlKhOlKcRaB2Id!b*qJz1In!hV1D7s(e!hEjS6T5R3YeHfWbAjc8V6KbE8S7I6A.1Yy211000020000100200020010100101200000000000000001002000011110000000000020000000000000100120001000000012100010001200111\"/><path id=\"decline-bench-press-n-e-thigh.r\" d=\"^12\"/><path id=\"decline-bench-press-n-e-kneecap.r\" d=\"^13\"/><path id=\"decline-bench-press-n-e-shank.r\" d=\"^14\"/><path id=\"decline-bench-press-n-e-foot.r\" d=\"^15\"/><path id=\"decline-bench-press-n-e-shcap.r\" d=\"^16\"/><path id=\"decline-bench-press-n-e-upper.r\" d=\"^17\"/><path id=\"decline-bench-press-n-e-elbowcap.r\" d=\"^18\"/><path id=\"decline-bench-press-n-e-fore.r\" d=\"^19\"/><path id=\"decline-bench-press-n-e-fist.r\" d=\"^20\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#decline-bench-press-n-dots)\"/>\n  <path class=\"floorline\" d=\"M36.77 339.5H322.03\"/><path class=\"eq\" d=\"~MA*fNUx2LHPH10Q!m0K-G1-mL.m_mQ0.m.m.mLK-G1!mQ.m0N-G1!mL!m.mQ0_m!m_mZ\"/><path class=\"eq\" d=\"~MYSfYDy2LYU20QPc0EF2OcLOcS4Q0OcOcR4LEF2PcQOc0FF2PcLPcR4Q0PcPcS4Z\"/><path class=\"eq\" d=\"~MyzY1YDy2LYU20QPc0EF2OcLOcS4Q0OcOcR4LEF2PcQOc0FF2PcLPcR4Q0PcPcS4Z\"/><path class=\"eq\" d=\"~M(*gF.-1L0PI6Q0!m!mTU5L.m.mQ!m0!m.mL.mTU5Q0.m.mUU5L!m!mQ.m0.m!mZ\"/><path class=\"eq\" d=\"~MN)I1JTS1L0JTdQ0!m!mO!cL.m.mQ_m0_m.mL-mO!cQ0.m-mP!cL_m!mQ.m0.m!mZ\"/><path class=\"eq\" d=\"~MwzfH_-1LNTv)N8QDoO6XxvJP7LGlAhQK6Bo)qB4L-UuWw9QBoP6YxvIP7LHlzhQN6DowrD4Z\"/><path class=\"eq\" d=\"~MN*Y1yGw2L0*FiQ0RkRkJUhLSkSkQRk0RkSkLSkJUhQ0SkSkIUhLRkRkQSk0SkRkZ\"/><path class=\"eq\" d=\"~MASiPwy2L0)EF1Q0E6E6YxF1LVS1F6QE60WS1F6LF6YxF1Q0F6F6XxF1LWS1E6QF60VS1E6Z\"/><path class=\"eq-thin\" d=\"M88.91 295.11h1.2M88.91 287.8h1.2M88.91 280.49h1.2M88.91 273.17h1.2M88.91 265.86h1.2M88.91 258.54h1.2M88.91 251.23h1.2M88.91 243.91h1.2M88.91 236.6h1.2M88.91 229.29h1.2M88.91 221.97h1.2M88.91 214.66h1.2M88.91 207.34h1.2M88.91 200.03h1.2M88.91 192.71h1.2M88.91 185.4h1.2M88.91 178.09h1.2M88.91 170.77h1.2M88.91 163.46h1.2M88.91 156.14h1.2M88.91 148.83h1.2\"/><path class=\"eq\" d=\"~MASiSAy1Lww20L))1XK1LVdYK1LWdww1LGS1)vZ\"/><path class=\"eq\" d=\"~MFDiYPN1LYyg0Q!m0.If-mL.m_mQ0.m.m.mL.If!mQ-m0(If!mL_m.mQ0_m_m_mZ\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#decline-bench-press-n-st-upper.l\"/><use href=\"#decline-bench-press-n-st-elbowcap.l\"/><use href=\"#decline-bench-press-n-st-fore.l\"/><use href=\"#decline-bench-press-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#decline-bench-press-n-st-upper.l\"/><use href=\"#decline-bench-press-n-st-elbowcap.l\"/><use href=\"#decline-bench-press-n-st-fore.l\"/><use href=\"#decline-bench-press-n-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#decline-bench-press-n-st-upper.r\"/><use href=\"#decline-bench-press-n-st-elbowcap.r\"/><use href=\"#decline-bench-press-n-st-fore.r\"/><use href=\"#decline-bench-press-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#decline-bench-press-n-st-upper.r\"/><use href=\"#decline-bench-press-n-st-elbowcap.r\"/><use href=\"#decline-bench-press-n-st-fore.r\"/><use href=\"#decline-bench-press-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#decline-bench-press-n-g0-upper.r\"/><use href=\"#decline-bench-press-n-g0-elbowcap.r\"/><use href=\"#decline-bench-press-n-g0-fore.r\"/><use href=\"#decline-bench-press-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#decline-bench-press-n-g0-upper.r\"/><use href=\"#decline-bench-press-n-g0-elbowcap.r\"/><use href=\"#decline-bench-press-n-g0-fore.r\"/><use href=\"#decline-bench-press-n-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~~YVq!Iz1!m1\"/><path class=\"eq-pin\" d=\"~~HDr!Iz1F60\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#decline-bench-press-n-g1-upper.r\"/><use href=\"#decline-bench-press-n-g1-elbowcap.r\"/><use href=\"#decline-bench-press-n-g1-fore.r\"/><use href=\"#decline-bench-press-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#decline-bench-press-n-g1-upper.r\"/><use href=\"#decline-bench-press-n-g1-elbowcap.r\"/><use href=\"#decline-bench-press-n-g1-fore.r\"/><use href=\"#decline-bench-press-n-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~~A*rJTE1!m1\"/><path class=\"eq-pin\" d=\"~~WKsJTE1F60\"/></g><g class=\"pose-end\"><path class=\"eq-line\" d=\"~~UKn__I1WK62\"/><path class=\"eq-thin\" d=\"~~USo__I1WF50\"/><path class=\"eq-solid\" d=\"~~NAt__I1!m1\"/><path class=\"eq-pin\" d=\"~~yVt__I1F60\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#decline-bench-press-n-e-thigh.l\"/><use href=\"#decline-bench-press-n-e-kneecap.l\"/><use href=\"#decline-bench-press-n-e-shank.l\"/><use href=\"#decline-bench-press-n-e-foot.l\"/><use href=\"#decline-bench-press-n-e-shcap.l\"/><use href=\"#decline-bench-press-n-e-upper.l\"/><use href=\"#decline-bench-press-n-e-elbowcap.l\"/><use href=\"#decline-bench-press-n-e-fore.l\"/><use href=\"#decline-bench-press-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#decline-bench-press-n-e-thigh.l\"/><use href=\"#decline-bench-press-n-e-kneecap.l\"/><use href=\"#decline-bench-press-n-e-shank.l\"/><use href=\"#decline-bench-press-n-e-foot.l\"/><use href=\"#decline-bench-press-n-e-shcap.l\"/><use href=\"#decline-bench-press-n-e-upper.l\"/><use href=\"#decline-bench-press-n-e-elbowcap.l\"/><use href=\"#decline-bench-press-n-e-fore.l\"/><use href=\"#decline-bench-press-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#decline-bench-press-n-e-head\"/><use href=\"#decline-bench-press-n-e-torso\"/><use href=\"#decline-bench-press-n-e-thigh.r\"/><use href=\"#decline-bench-press-n-e-kneecap.r\"/><use href=\"#decline-bench-press-n-e-shank.r\"/><use href=\"#decline-bench-press-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#decline-bench-press-n-e-head\"/><use href=\"#decline-bench-press-n-e-torso\"/><use href=\"#decline-bench-press-n-e-thigh.r\"/><use href=\"#decline-bench-press-n-e-kneecap.r\"/><use href=\"#decline-bench-press-n-e-shank.r\"/><use href=\"#decline-bench-press-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#decline-bench-press-n-e-shcap.r\"/><use href=\"#decline-bench-press-n-e-upper.r\"/><use href=\"#decline-bench-press-n-e-elbowcap.r\"/><use href=\"#decline-bench-press-n-e-fore.r\"/><use href=\"#decline-bench-press-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#decline-bench-press-n-e-shcap.r\"/><use href=\"#decline-bench-press-n-e-upper.r\"/><use href=\"#decline-bench-press-n-e-elbowcap.r\"/><use href=\"#decline-bench-press-n-e-fore.r\"/><use href=\"#decline-bench-press-n-e-fist.r\"/></g></g><path class=\"eq\" d=\"~~SWW1SIK1HS11\"/><path class=\"eq-pin\" d=\"~~UyY1SIK1F60\"/><path class=\"eq-line m-line\" d=\"~MFBqyzK1LU_80\"/><path class=\"eq-line m-line\" d=\"~MFBqYPN1LU_80\"/><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq-pin\" d=\"^42\"/><path class=\"eq-cable m-line\" d=\"~My!qJAvLV1X8LG3J1LI2J2LI1H3L0J3LH1H3LP2J2LD3J1LP30LD3G1LP2O2LH1B3L0O3LI1B3LI2O2LG3G1\"/><circle class=\"joint\" cx=\"133.96\" cy=\"256.48\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.03\" cy=\"263.82\" r=\"2.25\"/><circle class=\"joint\" cx=\"197.72\" cy=\"231.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"242.07\" cy=\"187.63\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#!10J.qUPx1*YqBFx12211002211022112211201221102211201221122110221100221120122110000010000000002000000020020000200001000000000000000000000000000000000200100000011000000010010000002000000020000002200\"/><path class=\"arrow\" d=\"~MUOtUSH1LKsXuLNw2FkZ\"/></g><path class=\"leader\" d=\"~MWHW1yXN1L0RA4\"/><circle class=\"anchor\" cx=\"278.19\" cy=\"239.21\" r=\"1.5\"/><path class=\"leader\" d=\"M152.85 224.45L171 164H181\"/><circle class=\"anchor\" cx=\"152.85\" cy=\"224.45\" r=\"1.5\"/><path class=\"leader\" d=\"~M_.oPKV1L0wN2\"/><circle class=\"anchor\" cx=\"127.33\" cy=\"273.52\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"decline-bench-press-n-feet\" data-key=\"feet\" data-cue=\"Lock your feet under the pads at the high end.\" class=\"plate-callout two\" style=\"left:77.65%;top:49.72%\" aria-pressed=\"true\">Feet<br>hooked</button><button type=\"button\" id=\"decline-bench-press-n-touch\" data-key=\"touch\" data-cue=\"Touch the bar to your lower chest only, never high toward the neck.\" class=\"plate-callout two\" style=\"left:49.16%;top:39.66%\" aria-pressed=\"false\">Lower-chest<br>touch</button><button type=\"button\" id=\"decline-bench-press-n-blades\" data-key=\"blades\" data-cue=\"Pull your shoulder blades together and down, chest up.\" class=\"plate-callout two\" style=\"left:32.96%;top:78.77%\" aria-pressed=\"false\">Blades<br>together</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"decline-bench-press-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"decline-bench-press-m-st-upper.l\" d=\"^0\"/><path id=\"decline-bench-press-m-st-elbowcap.l\" d=\"^1\"/><path id=\"decline-bench-press-m-st-fore.l\" d=\"^2\"/><path id=\"decline-bench-press-m-st-fist.l\" d=\"^3\"/><path id=\"decline-bench-press-m-st-upper.r\" d=\"^0\"/><path id=\"decline-bench-press-m-st-elbowcap.r\" d=\"^1\"/><path id=\"decline-bench-press-m-st-fore.r\" d=\"^2\"/><path id=\"decline-bench-press-m-st-fist.r\" d=\"^3\"/><path id=\"decline-bench-press-m-g0-upper.r\" d=\"^4\"/><path id=\"decline-bench-press-m-g0-elbowcap.r\" d=\"^5\"/><path id=\"decline-bench-press-m-g0-fore.r\" d=\"^6\"/><path id=\"decline-bench-press-m-g0-fist.r\" d=\"^7\"/><path id=\"decline-bench-press-m-g1-upper.r\" d=\"^8\"/><path id=\"decline-bench-press-m-g1-elbowcap.r\" d=\"^9\"/><path id=\"decline-bench-press-m-g1-fore.r\" d=\"^10\"/><path id=\"decline-bench-press-m-g1-fist.r\" d=\"^11\"/><path id=\"decline-bench-press-m-e-thigh.l\" d=\"^12\"/><path id=\"decline-bench-press-m-e-kneecap.l\" d=\"^13\"/><path id=\"decline-bench-press-m-e-shank.l\" d=\"^14\"/><path id=\"decline-bench-press-m-e-foot.l\" d=\"^15\"/><path id=\"decline-bench-press-m-e-shcap.l\" d=\"^16\"/><path id=\"decline-bench-press-m-e-upper.l\" d=\"^17\"/><path id=\"decline-bench-press-m-e-elbowcap.l\" d=\"^18\"/><path id=\"decline-bench-press-m-e-fore.l\" d=\"^19\"/><path id=\"decline-bench-press-m-e-fist.l\" d=\"^20\"/><path id=\"decline-bench-press-m-e-head\" d=\"^21\"/><path id=\"decline-bench-press-m-e-torso\" d=\"^22\"/><path id=\"decline-bench-press-m-e-thigh.r\" d=\"^12\"/><path id=\"decline-bench-press-m-e-kneecap.r\" d=\"^13\"/><path id=\"decline-bench-press-m-e-shank.r\" d=\"^14\"/><path id=\"decline-bench-press-m-e-foot.r\" d=\"^15\"/><path id=\"decline-bench-press-m-e-shcap.r\" d=\"^16\"/><path id=\"decline-bench-press-m-e-upper.r\" d=\"^17\"/><path id=\"decline-bench-press-m-e-elbowcap.r\" d=\"^18\"/><path id=\"decline-bench-press-m-e-fore.r\" d=\"^19\"/><path id=\"decline-bench-press-m-e-fist.r\" d=\"^20\"/><path id=\"decline-bench-press-m-m-upper.l\" d=\"~#F12HVoSBS1-Vo)!R1cB280w3FbA3T1J1nJ6wby9BjtOg)aBiz5WbO1jE3G1X1Pb92hz2VhIrIcDqF1PmwfYo00000000000000200000022000000010110100200000000100000200120001101110010200000100\"/><path id=\"decline-bench-press-m-m-elbowcap.l\" d=\"~~_Bp!GU1Dz10\"/><path id=\"decline-bench-press-m-m-fore.l\" d=\"~#F12JJr!)T1.NrXTU1cP7B1x1TbRsT1F7z1A2N4Fhz3Dey3YayaPaF5why2D1D5J5*4KuaO1U3P6ycJ5_4VlV4TgOf*f00200010100020010000121010000001000010010000200000010101100000000200000011001000\"/><path id=\"decline-bench-press-m-m-fist.l\" d=\"~~!JnJVK1ww10\"/><path id=\"decline-bench-press-m-m-upper.r\" d=\"^53\"/><path id=\"decline-bench-press-m-m-elbowcap.r\" d=\"^54\"/><path id=\"decline-bench-press-m-m-fore.r\" d=\"^55\"/><path id=\"decline-bench-press-m-m-fist.r\" d=\"^56\"/><path id=\"decline-bench-press-m-m-eq0\" d=\"~~wWnJVK1!m1\"/><path id=\"decline-bench-press-m-m-eq1\" d=\"~~UDoJVK1F60\"/><path id=\"decline-bench-press-m-m-eq2\" d=\"^57\"/><path id=\"decline-bench-press-m-m-eq3\" d=\"^58\"/><path id=\"decline-bench-press-m-mf-head\" d=\"^21\"/><path id=\"decline-bench-press-m-mf-torso\" d=\"^22\"/><path id=\"decline-bench-press-m-mf-thigh.l\" d=\"^12\"/><path id=\"decline-bench-press-m-mf-kneecap.l\" d=\"^13\"/><path id=\"decline-bench-press-m-mf-shank.l\" d=\"^14\"/><path id=\"decline-bench-press-m-mf-foot.l\" d=\"^15\"/><path id=\"decline-bench-press-m-mf-shcap.l\" d=\"^16\"/><path id=\"decline-bench-press-m-mf-thigh.r\" d=\"^12\"/><path id=\"decline-bench-press-m-mf-kneecap.r\" d=\"^13\"/><path id=\"decline-bench-press-m-mf-shank.r\" d=\"^14\"/><path id=\"decline-bench-press-m-mf-foot.r\" d=\"^15\"/><path id=\"decline-bench-press-m-mf-shcap.r\" d=\"^16\"/><path id=\"decline-bench-press-m-mo-0\" d=\"^21\"/><path id=\"decline-bench-press-m-mo-1\" d=\"^22\"/><path id=\"decline-bench-press-m-mo-2\" d=\"^12\"/><path id=\"decline-bench-press-m-mo-3\" d=\"^13\"/><path id=\"decline-bench-press-m-mo-4\" d=\"^14\"/><path id=\"decline-bench-press-m-mo-5\" d=\"^15\"/><path id=\"decline-bench-press-m-mo-6\" d=\"^16\"/><path id=\"decline-bench-press-m-mo-7\" d=\"^17\"/><path id=\"decline-bench-press-m-mo-8\" d=\"^18\"/><path id=\"decline-bench-press-m-mo-9\" d=\"^19\"/><path id=\"decline-bench-press-m-mo-10\" d=\"^20\"/><path id=\"decline-bench-press-m-mo-11\" d=\"^12\"/><path id=\"decline-bench-press-m-mo-12\" d=\"^13\"/><path id=\"decline-bench-press-m-mo-13\" d=\"^14\"/><path id=\"decline-bench-press-m-mo-14\" d=\"^15\"/><path id=\"decline-bench-press-m-mo-15\" d=\"^16\"/><path id=\"decline-bench-press-m-mo-16\" d=\"^17\"/><path id=\"decline-bench-press-m-mo-17\" d=\"^18\"/><path id=\"decline-bench-press-m-mo-18\" d=\"^19\"/><path id=\"decline-bench-press-m-mo-19\" d=\"^20\"/><path id=\"decline-bench-press-m-mo-20\" d=\"^24\"/><path id=\"decline-bench-press-m-mo-21\" d=\"^25\"/><path id=\"decline-bench-press-m-mo-22\" d=\"^26\"/><path id=\"decline-bench-press-m-mo-23\" d=\"^27\"/><path id=\"decline-bench-press-m-mo-24\" d=\"^28\"/><path id=\"decline-bench-press-m-mo-25\" d=\"^29\"/><path id=\"decline-bench-press-m-mo-26\" d=\"^30\"/><path id=\"decline-bench-press-m-mo-27\" d=\"^43\"/><path id=\"decline-bench-press-m-mo-28\" d=\"^44\"/><path id=\"decline-bench-press-m-mo-29\" d=\"^31\"/><path id=\"decline-bench-press-m-mo-30\" d=\"^33\"/><path id=\"decline-bench-press-m-mo-31\" d=\"^34\"/><path id=\"decline-bench-press-m-mo-32\" d=\"^41\"/><path id=\"decline-bench-press-m-mo-33\" d=\"^42\"/><path id=\"decline-bench-press-m-mo-34\" d=\"^41\"/><path id=\"decline-bench-press-m-mo-35\" d=\"^42\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#decline-bench-press-m-dots)\"/>\n  <path class=\"floorline\" d=\"^23\"/><path class=\"eq\" d=\"^24\"/><path class=\"eq\" d=\"^25\"/><path class=\"eq\" d=\"^26\"/><path class=\"eq\" d=\"^27\"/><path class=\"eq\" d=\"^28\"/><path class=\"eq\" d=\"^29\"/><path class=\"eq\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq-thin\" d=\"^32\"/><path class=\"eq\" d=\"^33\"/><path class=\"eq\" d=\"^34\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#decline-bench-press-m-st-upper.l\"/><use href=\"#decline-bench-press-m-st-elbowcap.l\"/><use href=\"#decline-bench-press-m-st-fore.l\"/><use href=\"#decline-bench-press-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#decline-bench-press-m-st-upper.l\"/><use href=\"#decline-bench-press-m-st-elbowcap.l\"/><use href=\"#decline-bench-press-m-st-fore.l\"/><use href=\"#decline-bench-press-m-st-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#decline-bench-press-m-st-upper.r\"/><use href=\"#decline-bench-press-m-st-elbowcap.r\"/><use href=\"#decline-bench-press-m-st-fore.r\"/><use href=\"#decline-bench-press-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#decline-bench-press-m-st-upper.r\"/><use href=\"#decline-bench-press-m-st-elbowcap.r\"/><use href=\"#decline-bench-press-m-st-fore.r\"/><use href=\"#decline-bench-press-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#decline-bench-press-m-g0-upper.r\"/><use href=\"#decline-bench-press-m-g0-elbowcap.r\"/><use href=\"#decline-bench-press-m-g0-fore.r\"/><use href=\"#decline-bench-press-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#decline-bench-press-m-g0-upper.r\"/><use href=\"#decline-bench-press-m-g0-elbowcap.r\"/><use href=\"#decline-bench-press-m-g0-fore.r\"/><use href=\"#decline-bench-press-m-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^35\"/><path class=\"eq-pin\" d=\"^36\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#decline-bench-press-m-g1-upper.r\"/><use href=\"#decline-bench-press-m-g1-elbowcap.r\"/><use href=\"#decline-bench-press-m-g1-fore.r\"/><use href=\"#decline-bench-press-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#decline-bench-press-m-g1-upper.r\"/><use href=\"#decline-bench-press-m-g1-elbowcap.r\"/><use href=\"#decline-bench-press-m-g1-fore.r\"/><use href=\"#decline-bench-press-m-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^37\"/><path class=\"eq-pin\" d=\"^38\"/></g><g class=\"pose-end\"><path class=\"eq-line\" d=\"^39\"/><path class=\"eq-thin\" d=\"^40\"/><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq-pin\" d=\"^42\"/><g class=\"far\"><g class=\"u-stroke\"><use href=\"#decline-bench-press-m-e-thigh.l\"/><use href=\"#decline-bench-press-m-e-kneecap.l\"/><use href=\"#decline-bench-press-m-e-shank.l\"/><use href=\"#decline-bench-press-m-e-foot.l\"/><use href=\"#decline-bench-press-m-e-shcap.l\"/><use href=\"#decline-bench-press-m-e-upper.l\"/><use href=\"#decline-bench-press-m-e-elbowcap.l\"/><use href=\"#decline-bench-press-m-e-fore.l\"/><use href=\"#decline-bench-press-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#decline-bench-press-m-e-thigh.l\"/><use href=\"#decline-bench-press-m-e-kneecap.l\"/><use href=\"#decline-bench-press-m-e-shank.l\"/><use href=\"#decline-bench-press-m-e-foot.l\"/><use href=\"#decline-bench-press-m-e-shcap.l\"/><use href=\"#decline-bench-press-m-e-upper.l\"/><use href=\"#decline-bench-press-m-e-elbowcap.l\"/><use href=\"#decline-bench-press-m-e-fore.l\"/><use href=\"#decline-bench-press-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#decline-bench-press-m-e-head\"/><use href=\"#decline-bench-press-m-e-torso\"/><use href=\"#decline-bench-press-m-e-thigh.r\"/><use href=\"#decline-bench-press-m-e-kneecap.r\"/><use href=\"#decline-bench-press-m-e-shank.r\"/><use href=\"#decline-bench-press-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#decline-bench-press-m-e-head\"/><use href=\"#decline-bench-press-m-e-torso\"/><use href=\"#decline-bench-press-m-e-thigh.r\"/><use href=\"#decline-bench-press-m-e-kneecap.r\"/><use href=\"#decline-bench-press-m-e-shank.r\"/><use href=\"#decline-bench-press-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#decline-bench-press-m-e-shcap.r\"/><use href=\"#decline-bench-press-m-e-upper.r\"/><use href=\"#decline-bench-press-m-e-elbowcap.r\"/><use href=\"#decline-bench-press-m-e-fore.r\"/><use href=\"#decline-bench-press-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#decline-bench-press-m-e-shcap.r\"/><use href=\"#decline-bench-press-m-e-upper.r\"/><use href=\"#decline-bench-press-m-e-elbowcap.r\"/><use href=\"#decline-bench-press-m-e-fore.r\"/><use href=\"#decline-bench-press-m-e-fist.r\"/></g></g><path class=\"eq\" d=\"^43\"/><path class=\"eq-pin\" d=\"^44\"/><path class=\"eq-solid\" d=\"^41\"/><path class=\"eq-pin\" d=\"^42\"/><path class=\"eq-cable m-line\" d=\"^47\"/><circle class=\"joint\" cx=\"133.96\" cy=\"256.48\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.03\" cy=\"263.82\" r=\"2.25\"/><circle class=\"joint\" cx=\"197.72\" cy=\"231.98\" r=\"2.25\"/><circle class=\"joint\" cx=\"242.07\" cy=\"187.63\" r=\"2.25\"/></g><mask id=\"decline-bench-press-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#decline-bench-press-m-mf-head\" fill=\"#000\"/><use href=\"#decline-bench-press-m-mf-torso\" fill=\"#000\"/><use href=\"#decline-bench-press-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#decline-bench-press-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#decline-bench-press-m-mf-shank.l\" fill=\"#000\"/><use href=\"#decline-bench-press-m-mf-foot.l\" fill=\"#000\"/><use href=\"#decline-bench-press-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#decline-bench-press-m-m-upper.l\" fill=\"#000\"/><use href=\"#decline-bench-press-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#decline-bench-press-m-m-fore.l\" fill=\"#000\"/><use href=\"#decline-bench-press-m-m-fist.l\" fill=\"#000\"/><use href=\"#decline-bench-press-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#decline-bench-press-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#decline-bench-press-m-mf-shank.r\" fill=\"#000\"/><use href=\"#decline-bench-press-m-mf-foot.r\" fill=\"#000\"/><use href=\"#decline-bench-press-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#decline-bench-press-m-m-upper.r\" fill=\"#000\"/><use href=\"#decline-bench-press-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#decline-bench-press-m-m-fore.r\" fill=\"#000\"/><use href=\"#decline-bench-press-m-m-fist.r\" fill=\"#000\"/><use href=\"#decline-bench-press-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#decline-bench-press-m-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#decline-bench-press-m-mmask)\"><g class=\"u-stroke\"><use href=\"#decline-bench-press-m-m-upper.l\"/><use href=\"#decline-bench-press-m-m-elbowcap.l\"/><use href=\"#decline-bench-press-m-m-fore.l\"/><use href=\"#decline-bench-press-m-m-fist.l\"/><use href=\"#decline-bench-press-m-m-upper.r\"/><use href=\"#decline-bench-press-m-m-elbowcap.r\"/><use href=\"#decline-bench-press-m-m-fore.r\"/><use href=\"#decline-bench-press-m-m-fist.r\"/><use href=\"#decline-bench-press-m-m-eq0\"/><use href=\"#decline-bench-press-m-m-eq1\"/><use href=\"#decline-bench-press-m-m-eq2\"/><use href=\"#decline-bench-press-m-m-eq3\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MNRpJVK1LX2)dLB5A2L*3(3Lz2D5L0P5LA2D5L(3(3LD5A2LP50LD5z2L(3*3LA2B5L0O5Lz2B5L*3*3LB5z2\"/><path class=\"m-line\" d=\"~MJToP(J1LE9nLcU3L!1A3LY2F2LP3w1LU3bLA3-1LH2.2LHP1U!6LKH1V)6LjO5LV2.4LI4O3LI5K1LO5kL*4W2LI3J4L.S1Vx6\"/><path class=\"m-arrow\" d=\"~M_VsHVH1LKz3S_1Myc-sLxc_sLAI1Gp\"/><path class=\"m-line\" d=\"~MHFnJVK1LRT1wW2\"/><path class=\"leader m\" d=\"~M!JoJzJ1LXF9A1\"/><path class=\"leader m\" d=\"~MUIlJIP1L0AG8\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"decline-bench-press-m-high\" data-key=\"high\" data-cue=\"The bar touches high on your chest instead of the lower chest.\" class=\"plate-callout two m\" style=\"left:0.56%;top:56.98%\" aria-pressed=\"true\">Bar lands<br>high</button><button type=\"button\" id=\"decline-bench-press-m-neck\" data-key=\"neck\" data-cue=\"The bar comes down close to your neck.\" class=\"plate-callout two m\" style=\"left:26.82%;top:79.89%\" aria-pressed=\"false\">Near the<br>neck</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "feet",
        cues: [{ key: "feet", cue: "Lock your feet under the pads at the high end." }, { key: "touch", cue: "Touch the bar to your lower chest only, never high toward the neck." }, { key: "blades", cue: "Pull your shoulder blades together and down, chest up." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "high",
        cues: [{ key: "high", cue: "The bar touches high on your chest instead of the lower chest." }, { key: "neck", cue: "The bar comes down close to your neck." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Bar lands high</b><span>The bar touches high on your chest instead of the lower chest.</span></li><li><b>Near the neck</b><span>The bar comes down close to your neck.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: lower 2 seconds, pause 1 second, press 1 second\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Pause</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Press</b><span>1 s</span></div></div></div>",
      alt: "Decline bench press, side view. Lying on a bench that falls toward the head, feet hooked under the pads at the high end, the lifter lowers the bar from locked arms to touch the lower chest, then presses back up. Safety arms sit at the sides.",
      mistakeAlt: "Decline Bench Press: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "push",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: bar-low-palm, inherited from barbell_bench_press: push heel-of-palm pair not drawable through golden B's engine (D-LIB7-19); no key draws it.",
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
          "workoutlabs-decline",
          "strengthlog-decline"
        ],
        "note": "c3"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "MECH"
        ],
        "sources": [],
        "note": "card inherit grip.thumb (inherit:0): the bar still travels over the face, neck and chest (barbell_bench_press thumb rule)."
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
          "MECH"
        ],
        "sources": [],
        "note": "card inherit grip.wrist (inherit:2): the wrist sits under the same bar in the same way (barbell_bench_press wrist rule)."
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
    "gripLine": "Overhand grip. Bar in the palm's base, not high toward the fingers, thumb wrapped.",
    "cue": "Palm base, wrist not bent back."
  },
  contacts: [
    "bench-lying"
  ],
  setup: [
    {
      "kind": "safety",
      "text": "Set the bench in decline and the safety racks at both sides.",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "strengthlog-decline",
          "lauver2016",
          "coratella2020",
          "workoutlabs-decline"
        ],
        "note": "c2, c6"
      }
    },
    {
      "kind": "adjust",
      "text": "Set the bar where you can reach it without straightening your arms.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "workoutlabs-decline"
        ],
        "note": "c7"
      }
    },
    {
      "kind": "position",
      "text": "Feet locked under the pads. Grip slightly wider than shoulders.",
      "zoom": "feet-hooked",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "workoutlabs-decline",
          "strengthlog-decline"
        ],
        "note": "c1, c3"
      }
    },
    {
      "kind": "get-in",
      "text": "New to it? Use a spotter. Lift out on locked arms.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-decline",
          "workoutlabs-decline"
        ],
        "note": "c6, c7"
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
        "note": "c11"
      }
    }
  ],
  posture: [
    {
      "key": "feet",
      "label": "Feet hooked",
      "detail": "Feet hooked under the pads.",
      "anchor": {
        "pose": "end",
        "at": "ankle.r"
      },
      "zoom": "feet-hooked",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "workoutlabs-decline"
        ],
        "note": "c1"
      }
    },
    {
      "key": "blades",
      "label": "Blades together",
      "detail": "Shoulder blades together and down.",
      "anchor": {
        "pose": "start",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-decline"
        ],
        "note": "c4"
      }
    },
    {
      "key": "touch",
      "label": "Lower-chest touch",
      "detail": "Bar to the lower chest only.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-decline",
          "workoutlabs-decline"
        ],
        "note": "c5"
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
          "MECH"
        ],
        "sources": [],
        "note": "card inherit grip.handContact, grip.wrist, zooms.bar-low-palm (inherit:1, 2, 3): same bar and overhand grip (c3) (barbell_bench_press wrist and contact rule)."
      }
    }
  ],
  zooms: [
    {
      "key": "feet-hooked",
      "chip": "Feet",
      "heading": "Feet hooked",
      "kind": "posture"
    }
  ],
  chips: [
    "feet-hooked",
    "feel"
  ],
  copy: {
    "setupLine": "Both feet locked under the pads. Blades together and down, chest up.",
    "mistakeLine": "Feet loose, not locked under the pads? Hook them before you lie back.",
    "cueLine": "Lower chest only."
  },
  mistakes: [
    {
      "key": "high",
      "title": "Bar landing high, toward neck",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA",
          "MECH"
        ],
        "sources": [
          "strengthlog-decline",
          "workoutlabs-decline",
          "jumbelic2007"
        ],
        "note": "c5, c12"
      },
      "fix": "Lower it to the lower chest only."
    },
    {
      "key": "safeties",
      "title": "Heavy without safeties or spotter",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-decline",
          "workoutlabs-decline"
        ],
        "note": "c6"
      },
      "fix": "Set the safety racks. Use a spotter or go lighter."
    },
    {
      "key": "bounce",
      "title": "Bar bouncing off the chest",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "strengthlog-decline",
          "workoutlabs-decline",
          "acsm2009"
        ],
        "note": "c5, c8"
      },
      "fix": "Lower with control, 2 seconds down."
    }
  ],
  risks: [
    {
      "key": "face",
      "text": "Bar over face and neck: touch low. Wrap thumbs. Set the safety racks.",
      "claim": {
        "tags": [
          "DATA",
          "MECH",
          "CONSENSUS"
        ],
        "sources": [
          "jumbelic2007",
          "workoutlabs-decline",
          "strengthlog-decline"
        ],
        "note": "c12, c6, inherit:0"
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
        "note": "c14"
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
        "note": "c13"
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
    "workoutlabs-decline",
    "strengthlog-decline",
    "lauver2016",
    "coratella2020",
    "kowalczuk2022",
    "jumbelic2007",
    "kerr2010",
    "kolber2010",
    "acsm2009",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/decline_bench_press.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

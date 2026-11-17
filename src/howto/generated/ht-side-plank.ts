// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=e461c5229fb62438b2ea0f5beb26d520035a1b8845055109c1e016cb943749dc
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_side_plank",
  name: "Side Plank",
  hashes: { inputsSha256: "e461c5229fb62438b2ea0f5beb26d520035a1b8845055109c1e016cb943749dc", golden: "0140c708a1ea067dedff6628e404700f92ace622735ca0c8f774dcdc5858664d" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"side-plank-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"side-plank-n-st-thigh.l\" d=\"~#F12HKE1UB*1.!B1Xy*1Ec65F1Hw2N5z7E7R3G3XV1BaVl-fOk.2BpF9IW1*4K4D2-8w5H)1Nc6E1VbO3OgwuPD1DsSA1A5WJ1Rg22021012101010000100100111101000000000200001010000000010100000001000200000010100\"/><path id=\"side-plank-n-st-kneecap.l\" d=\"~~A-S1JO!1yN11\"/><path id=\"side-plank-n-st-shank.l\" d=\"~#F12SwU1S(*1)PS1)T*1-bR36E1_w2y4B7E7T3G3VA2-5-cG9BcV1.eN5Vz2GdG4D2*8w5N)1(d7F1Bc4waYeHnwhwmy3yr*900000000000000000000000101002200000021000000200012000001100100001000001000002000\"/><path id=\"side-plank-n-st-foot.l\" d=\"~#e2w_)1_*(1VS)1.Rw2UU1!D1Xw1W8zqPJ1.7_8Vq.N1Vl*m2000000021002100011012100200\"/><path id=\"side-plank-n-st-thigh.r\" d=\"~#F12YDB1UWx2GWz1-Yx2BcN10F1Sw2G1.7I6*3)2KW1O4BnOd-kl)n!bTW1mB4Y2E8_5Hw2_50G1)bG2BdWvDG1(n!A1F1_H1xl10000000200002020000010001001010002200000010020000001001000101220000000100000000\"/><path id=\"side-plank-n-st-kneecap.r\" d=\"~~(KP1UV)1yN11\"/><path id=\"side-plank-n-st-shank.r\" d=\"~#F12J_R1FBx2)GP1V)w2xcG20G1!w2X2-7I6)3)2*A2P1Vd)7GcdEey7VA2E6z4W2E8!5Nw2D70H1BcN1SbUd_oNeJmo_pXc10011100110000220010010001110000001101100100000000000020000000001010110120010000\"/><path id=\"side-plank-n-st-foot.r\" d=\"~#e2_W*1HF)1TY*1XT*1S_1BtXuEexiIP1E6)9Gy1PG1Gp(i0010002001000120000000000200\"/><path id=\"side-plank-n-g0-thigh.r\" d=\"~#F12NFB1DA)1xYz1Tx)1zc87F1Jw2w5z7B7V3G3XV1-9XlTfTk-2xpP9KW1T4I4F2.8w5P)1Ac4I1VbI3EgDuUD1_rSA1(4WJ1.g00200000100000000010100000000200000000000000001000220001000200000000111000210000\"/><path id=\"side-plank-n-g0-kneecap.r\" d=\"~~yUP1AI(1yN11\"/><path id=\"side-plank-n-g0-shank.r\" d=\"~#F12_.R1J_)1BJP1zP)1-bO34B1!w2P3E7z7R3G3-A2E5.cI9BcR1-eU5-z2*cG4F2-8y5N)1Nd5H1Ec8DaUeHn_gDmw3!qBa10101012002000000200001010000100002000101101200000011010100020000000000000100010\"/><path id=\"side-plank-n-g0-foot.r\" d=\"~#e2J!*1(y)1Gz(1-N*1D*1GnEtBhGd.R1B5TaBD1wD1zrHg0002000000000000002001011021\"/><path id=\"side-plank-n-g1-thigh.r\" d=\"~#F12HHB1YP!1I_z1KG!1Bcv7F1P)1FbK6-7E3T3RU1xfBkXhzkV4*p(6XV1*9R4_1E9D4(*1Ai8B1EbT4BjNsYz1Sv(z1N8yN1Kc02010000000012000000000000100020000000000101000000101110000100001000000001200120\"/><path id=\"side-plank-n-g1-kneecap.r\" d=\"~~NWP1!)!1yN11\"/><path id=\"side-plank-n-g1-shank.r\" d=\"~#F12U-R1HN(1EIP1O)*1IbR48E1Dw2(9O6.7G3T3.z2)b.bOa)b-2IfA4xy2KjT4_1G9A4(*1UjbF1BctW8SfSlyjYly5_rK700000010020000000000020000002000000200020000100000000012000000000002002000000000\"/><path id=\"side-plank-n-g1-foot.r\" d=\"~#e2W_*1S!(1XD(1GG*1F)1GhOr*jE8*S1B4xbXG1Ay1OsPd1000200010002000000000000012\"/><path id=\"side-plank-n-e-head\" d=\"~#D12wBgYHK1)PfzRN1U7PnW6Ag1NaV4S3E4y2T4U3I9w2I8x1Ga1I8G6B7E4B6E7R1X5)1B4R1X5H6E8AfX8Jk.d1000020020000000001000200000000000000111010100020010100101101000000002000010\"/><path id=\"side-plank-n-e-torso\" d=\"~#A22NOlDUK1Gzk*DK1)fGjw9KqR3.9V3U5Hc!j.3FO1zegFv4F9UdV7.72XkN9E7E4NcIkAjTA1(u-R1P.1x3RK2zaXN1O4VrF4Icw3NbRcSg.aN1Sfx5!o(i.a)8Yp-E1_lB8k-6.8Y5)8NqOoP5YF2VD20000020002101000001000200000120020002000000200100000000000011110000121000001011200001000002000000200000001000001112101220001012001002020\"/><path id=\"side-plank-n-e-thigh.l\" d=\"~#F12_-D1W*U1GJB1*JU1XbI3fD1(.1_nX4*8K2G4KP1EpBgKl-iV8-qU1TS1Rk-4q*9F2w-1Fuiz1Ba-6KoyoUsyD1Sx1NfPO1X221002020001000100001210000100002001000010100011010000000020000101200100101001200\"/><path id=\"side-plank-n-e-kneecap.l\" d=\"~~S_R1w)X1yN11\"/><path id=\"side-plank-n-e-shank.l\" d=\"~#F12SUS1HH-1zHR1KSY1Ea-6iz1_!1SmX4*8K2E4Bw2IpO9VcBbB5-fu*!1Gw1-4q.9D2SY1WvfD1-bK3N5whFhwnFkJ9YsV100000000200000002000021012000000002000000020002000010100000100200010001002020000\"/><path id=\"side-plank-n-e-foot.l\" d=\"~#e2_U*1SV*1X(!1GB)1AE1PU1.x1B1.B1wz1zaD6*bRU1xeEs0101000100210000100000001011\"/><path id=\"side-plank-n-e-shcap.l\" d=\"~~SOqDIH1HR10\"/><path id=\"side-plank-n-e-upper.l\" d=\"~#F12wWsYXI1)Vr-BJ1z8H339AG1BmX6bE35Iz1HaXlB1IfH7*cShIu(k*1S2.3N5AI1Xh6aX7A4U4HgWtN1!k-9Whxo00000000010020021001200020210100101010020021010020000000000100000010100000010102\"/><path id=\"side-plank-n-e-elbowcap.l\" d=\"~~!zz1PND1DA11\"/><path id=\"side-plank-n-e-fore.l\" d=\"~#F12yBz1(!D1T*y1-yD1z2-9J1J1HjHB13X9oT2GbRsS1XeK4VaObK9xczsK2K1X6)6UcAF11(1I5K8IaA2I2WmY6JgWhPe00000000000000010000020010020000000000000000002001000200000200000011000100002000\"/><path id=\"side-plank-n-e-fist.l\" d=\"~~y_D1HBO1!w10\"/><path id=\"side-plank-n-e-thigh.r\" d=\"~#F12PJB1J!-1O*z1KP-1xcB2bH1D(1HhX5I8-2*3.S1zkGiTjTjV6KqN4RU1BfV4N1V9A3(.1DocB1-aV5-lPqPw1_y1(y1!bwO1X700000000200100001020000011100000000200101000001011000002000000000001010100000000\"/><path id=\"side-plank-n-e-kneecap.r\" d=\"~~DVP1PT.1yN11\"/><path id=\"side-plank-n-e-shank.r\" d=\"~#F12!TR1Uw*1BEP1GK!1.aV5eB1_(1ygT5I8*2*3Ky2TiXaRbVb)3VfU2.)1.pX4N1V9A3W.1UpbF1zcB2A7JgUjwlAlF7JsX400000000001000020002000001000200000000000002001010020000020010100001101200100000\"/><path id=\"side-plank-n-e-foot.r\" d=\"~#e2WR*1PU(1Vy(1Vy*1Uw2)aIpRmG3OT1x3Kb.J1!tVtWa0020001001011001000000000010\"/><path id=\"side-plank-n-e-shcap.r\" d=\"~~HDmH(W1HR10\"/><path id=\"side-plank-n-e-upper.r\" d=\"~#F12HDmH(W1GEmT-V1gB9a0P2wR1D3B6P1x3(5OE1HaGj0.gGaGj*5OE1O1x3E3B6K2wR190dB9Vgz1xeFq0AnyeFq01000000002002011100000002111100001111120010000101020000200020011000020000121010\"/><path id=\"side-plank-n-e-elbowcap.r\" d=\"~~NTmyPw2DA11\"/><path id=\"side-plank-n-e-fore.r\" d=\"~#F12SVnHH)1xHoEJ)1P7H1E1sIvF5(6H3!1S1NihNdJ6SblYcX7JiK1U1X1S6)3Vv.1K1nJ7z2w8.aVkV9Vhw1Kj_b00001000200100100220000010001201010000100000001010000000000002020002000200200000\"/><path id=\"side-plank-n-e-fist.r\" d=\"~~NTfP!w2!w10\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#side-plank-n-dots)\"/>\n  <path class=\"datum\" d=\"~MyBj!!V1LSOO1N_a\"/><path class=\"floorline\" d=\"M16 339.5H342\"/><path class=\"eq\" d=\"~M((eYDy2LwTS10QA30.OS1z3Lz30Q0z3z30L.OS1A3Qz30!OS1A3LA30Q0A3A30Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#side-plank-n-st-thigh.l\"/><use href=\"#side-plank-n-st-kneecap.l\"/><use href=\"#side-plank-n-st-shank.l\"/><use href=\"#side-plank-n-st-foot.l\"/><use href=\"#side-plank-n-st-thigh.r\"/><use href=\"#side-plank-n-st-kneecap.r\"/><use href=\"#side-plank-n-st-shank.r\"/><use href=\"#side-plank-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#side-plank-n-st-thigh.l\"/><use href=\"#side-plank-n-st-kneecap.l\"/><use href=\"#side-plank-n-st-shank.l\"/><use href=\"#side-plank-n-st-foot.l\"/><use href=\"#side-plank-n-st-thigh.r\"/><use href=\"#side-plank-n-st-kneecap.r\"/><use href=\"#side-plank-n-st-shank.r\"/><use href=\"#side-plank-n-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#side-plank-n-g0-thigh.r\"/><use href=\"#side-plank-n-g0-kneecap.r\"/><use href=\"#side-plank-n-g0-shank.r\"/><use href=\"#side-plank-n-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#side-plank-n-g0-thigh.r\"/><use href=\"#side-plank-n-g0-kneecap.r\"/><use href=\"#side-plank-n-g0-shank.r\"/><use href=\"#side-plank-n-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#side-plank-n-g1-thigh.r\"/><use href=\"#side-plank-n-g1-kneecap.r\"/><use href=\"#side-plank-n-g1-shank.r\"/><use href=\"#side-plank-n-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#side-plank-n-g1-thigh.r\"/><use href=\"#side-plank-n-g1-kneecap.r\"/><use href=\"#side-plank-n-g1-shank.r\"/><use href=\"#side-plank-n-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#side-plank-n-e-head\"/><use href=\"#side-plank-n-e-torso\"/><use href=\"#side-plank-n-e-thigh.l\"/><use href=\"#side-plank-n-e-kneecap.l\"/><use href=\"#side-plank-n-e-shank.l\"/><use href=\"#side-plank-n-e-foot.l\"/><use href=\"#side-plank-n-e-shcap.l\"/><use href=\"#side-plank-n-e-upper.l\"/><use href=\"#side-plank-n-e-elbowcap.l\"/><use href=\"#side-plank-n-e-fore.l\"/><use href=\"#side-plank-n-e-fist.l\"/><use href=\"#side-plank-n-e-thigh.r\"/><use href=\"#side-plank-n-e-kneecap.r\"/><use href=\"#side-plank-n-e-shank.r\"/><use href=\"#side-plank-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#side-plank-n-e-head\"/><use href=\"#side-plank-n-e-torso\"/><use href=\"#side-plank-n-e-thigh.l\"/><use href=\"#side-plank-n-e-kneecap.l\"/><use href=\"#side-plank-n-e-shank.l\"/><use href=\"#side-plank-n-e-foot.l\"/><use href=\"#side-plank-n-e-shcap.l\"/><use href=\"#side-plank-n-e-upper.l\"/><use href=\"#side-plank-n-e-elbowcap.l\"/><use href=\"#side-plank-n-e-fore.l\"/><use href=\"#side-plank-n-e-fist.l\"/><use href=\"#side-plank-n-e-thigh.r\"/><use href=\"#side-plank-n-e-kneecap.r\"/><use href=\"#side-plank-n-e-shank.r\"/><use href=\"#side-plank-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#side-plank-n-e-shcap.r\"/><use href=\"#side-plank-n-e-upper.r\"/><use href=\"#side-plank-n-e-elbowcap.r\"/><use href=\"#side-plank-n-e-fore.r\"/><use href=\"#side-plank-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#side-plank-n-e-shcap.r\"/><use href=\"#side-plank-n-e-upper.r\"/><use href=\"#side-plank-n-e-elbowcap.r\"/><use href=\"#side-plank-n-e-fore.r\"/><use href=\"#side-plank-n-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"143.5\" cy=\"216.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"121.54\" cy=\"281.33\" r=\"2.25\"/><circle class=\"joint\" cx=\"185.61\" cy=\"196.88\" r=\"2.25\"/><circle class=\"joint\" cx=\"121.54\" cy=\"330.25\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#D20JJB1FN(1-IB1IT(10020122110002010221120102010201020102010201020112210200010211220102110000000200200000100000000002002000200000100010001000110000000100000001000000010010001100100010101000002000220000010010101100002000001012100\"/><path class=\"arrow\" d=\"~MPBD1SVX1LFeNE1LOT1XI1Z\"/></g><path class=\"leader\" d=\"M112.54 322.25L112.64 307H102.64\"/><circle class=\"anchor\" cx=\"112.54\" cy=\"322.25\" r=\"1.5\"/><path class=\"leader\" d=\"~M((H1WTR1L0*(9\"/><circle class=\"anchor\" cx=\"219.99\" cy=\"254.03\" r=\"1.5\"/><path class=\"leader\" d=\"M114.07 278.78L89.53 259H79.53\"/><circle class=\"anchor\" cx=\"114.07\" cy=\"278.78\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"side-plank-n-elbow\" data-key=\"elbow\" data-cue=\"Bottom elbow sits under the shoulder.\" class=\"plate-callout two\" style=\"left:2.23%;top:79.61%\" aria-pressed=\"true\">Elbow under<br>shoulder</button><button type=\"button\" id=\"side-plank-n-hips\" data-key=\"hips\" data-cue=\"Hips lifted into one line with the ribs and legs.\" class=\"plate-callout\" style=\"left:55.87%;top:47.49%\" aria-pressed=\"false\">Hips up</button><button type=\"button\" id=\"side-plank-n-shoulder\" data-key=\"shoulder\" data-cue=\"Bottom shoulder stays away from the ear.\" class=\"plate-callout two\" style=\"left:2.23%;top:66.2%\" aria-pressed=\"false\">Shoulder<br>down</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"side-plank-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"side-plank-m-st-thigh.l\" d=\"^0\"/><path id=\"side-plank-m-st-kneecap.l\" d=\"^1\"/><path id=\"side-plank-m-st-shank.l\" d=\"^2\"/><path id=\"side-plank-m-st-foot.l\" d=\"^3\"/><path id=\"side-plank-m-st-thigh.r\" d=\"^4\"/><path id=\"side-plank-m-st-kneecap.r\" d=\"^5\"/><path id=\"side-plank-m-st-shank.r\" d=\"^6\"/><path id=\"side-plank-m-st-foot.r\" d=\"^7\"/><path id=\"side-plank-m-g0-thigh.r\" d=\"^8\"/><path id=\"side-plank-m-g0-kneecap.r\" d=\"^9\"/><path id=\"side-plank-m-g0-shank.r\" d=\"^10\"/><path id=\"side-plank-m-g0-foot.r\" d=\"^11\"/><path id=\"side-plank-m-g1-thigh.r\" d=\"^12\"/><path id=\"side-plank-m-g1-kneecap.r\" d=\"^13\"/><path id=\"side-plank-m-g1-shank.r\" d=\"^14\"/><path id=\"side-plank-m-g1-foot.r\" d=\"^15\"/><path id=\"side-plank-m-e-head\" d=\"^16\"/><path id=\"side-plank-m-e-torso\" d=\"^17\"/><path id=\"side-plank-m-e-thigh.l\" d=\"^18\"/><path id=\"side-plank-m-e-kneecap.l\" d=\"^19\"/><path id=\"side-plank-m-e-shank.l\" d=\"^20\"/><path id=\"side-plank-m-e-foot.l\" d=\"^21\"/><path id=\"side-plank-m-e-shcap.l\" d=\"^22\"/><path id=\"side-plank-m-e-upper.l\" d=\"^23\"/><path id=\"side-plank-m-e-elbowcap.l\" d=\"^24\"/><path id=\"side-plank-m-e-fore.l\" d=\"^25\"/><path id=\"side-plank-m-e-fist.l\" d=\"^26\"/><path id=\"side-plank-m-e-thigh.r\" d=\"^27\"/><path id=\"side-plank-m-e-kneecap.r\" d=\"^28\"/><path id=\"side-plank-m-e-shank.r\" d=\"^29\"/><path id=\"side-plank-m-e-foot.r\" d=\"^30\"/><path id=\"side-plank-m-e-shcap.r\" d=\"^31\"/><path id=\"side-plank-m-e-upper.r\" d=\"^32\"/><path id=\"side-plank-m-e-elbowcap.r\" d=\"^33\"/><path id=\"side-plank-m-e-fore.r\" d=\"^34\"/><path id=\"side-plank-m-e-fist.r\" d=\"^35\"/><path id=\"side-plank-m-m-head\" d=\"~#D12FRjHNI1ESiOJJ11WoF1NhG3_9T5w2R4kR5w2T9x1O7T3-9G3*5R8T5E6O3.88*5hT4a*5S8-5yhT3Yn.60002001000000000022002200210002000000010100010002000112001010100001001002000\"/><path id=\"side-plank-m-m-torso\" d=\"~#A22FPoSJK1OHnBSJ1B9Gn!gIm9OaE5H4P5UmOiYI1Od)3St!9S4!fxlOh(exvAo8E5yc.lFhzE1!rRW1wX1J3KK2B6RO1z2-rF5xcTaP2GbtW3H8Ng2WhYpO7*b!A1XtHnvW2B6BaS2.gJm*oK2D.2KJ11000000020000020000100000210000100020000200000020000212001100010100000101002200001002000021011000000000001001010010000000010000101011010\"/><path id=\"side-plank-m-m-thigh.l\" d=\"~#F12SWE1Dy-1xED1IYY1zcT1bF1!(1Se)5B8x3X3XT1-hzjXi*j-5EqU5zV1XcV4S1K9U3!!1NlcB1xbE5TkNryy1Jx1Nz1HaUN1*910000000101000000000020010000010101002200011110100000000200000000200021010000010\"/><path id=\"side-plank-m-m-kneecap.l\" d=\"~~HxT1!D_1yN11\"/><path id=\"side-plank-m-m-shank.l\" d=\"~#F12yyU1UU.1RUS1Iz.1xbz5aG1P)1Hd)5B8z3-3zz2OfIbzb-bO3RfJ3)w2*mT4U1R9S3_!1(mbD1BcT1!7ygPkAkPlF6Asx600000210100002000002000022000001000000002020000001000000010001000010010020010100\"/><path id=\"side-plank-m-m-foot.l\" d=\"~#e2AT)1WG(1KA)1B!)1SN1wN1Xx1(3Bw1HF1x9U7VjES1zi-p0001100010200020000001002000\"/><path id=\"side-plank-m-m-shcap.l\" d=\"~~WDuHHJ1HR10\"/><path id=\"side-plank-m-m-upper.l\" d=\"~#F12FBw1_-K1-zvzyN1K8_117PI1XeI6R1z3lXz1_3GlV4EgP4-fAfOw1FfG2D2V4W4_J1)96aE8Y2H1(gytP6DmB6PlTk00010100000001000021000101000020010000002001010010000120001000010100001010000000\"/><path id=\"side-plank-m-m-elbowcap.l\" d=\"~~AFE1y*G1DA11\"/><path id=\"side-plank-m-m-fore.l\" d=\"~#F12PDE1A*G1RGE1RyG1Y1X9qY1U3DG1S3-8Y1E2c-ty7zd1Rb)6xdf-tV1E2T3-8R3DG1pY1V1X9OaI2Xayk2YhYaAk00000000000200100000210100000110100000001001000000101000010120000001000000100000\"/><path id=\"side-plank-m-m-fist.l\" d=\"~~WIE1WBT1!w10\"/><path id=\"side-plank-m-m-thigh.r\" d=\"~#F12Y!B1Y_*1OJA1)V*1Ec95H1yw2!7-6K7R3R3BV1BcxlVgIkV3RpH8BW1z7K4A2)8S4Y(1!e8B1Tb)3OhNtFB1StJA1S6HK1Ve00010100002001000001110000101000001010020000022000010000000210000000100000000001\"/><path id=\"side-plank-m-m-kneecap.r\" d=\"~~AGR1NU*1yN11\"/><path id=\"side-plank-m-m-shank.r\" d=\"~#F12WNS1Jz)1T)P1*W(1Rbx46B1Sw2P6-6K7R3O3IA2K8Kc.9zcB2xf(4zz2)fK4y2x9U4_(1Jg7F1Ec7N9wfUm(h!l(3Nr.820012100000001000000000100010000000000100010001210000000101002001100000000020000\"/><path id=\"side-plank-m-m-foot.r\" d=\"~#e2(O(1S*(1E-(1XG*1D(1RkKsOi)aKS1V4.a*E1HA1-r(e0200010100110100000200111100\"/><path id=\"side-plank-m-mf-shcap.r\" d=\"^31\"/><path id=\"side-plank-m-mf-upper.r\" d=\"^32\"/><path id=\"side-plank-m-mf-elbowcap.r\" d=\"^33\"/><path id=\"side-plank-m-mf-fore.r\" d=\"^34\"/><path id=\"side-plank-m-mf-fist.r\" d=\"^35\"/><path id=\"side-plank-m-mo-0\" d=\"^16\"/><path id=\"side-plank-m-mo-1\" d=\"^17\"/><path id=\"side-plank-m-mo-2\" d=\"^18\"/><path id=\"side-plank-m-mo-3\" d=\"^19\"/><path id=\"side-plank-m-mo-4\" d=\"^20\"/><path id=\"side-plank-m-mo-5\" d=\"^21\"/><path id=\"side-plank-m-mo-6\" d=\"^22\"/><path id=\"side-plank-m-mo-7\" d=\"^23\"/><path id=\"side-plank-m-mo-8\" d=\"^24\"/><path id=\"side-plank-m-mo-9\" d=\"^25\"/><path id=\"side-plank-m-mo-10\" d=\"^26\"/><path id=\"side-plank-m-mo-11\" d=\"^27\"/><path id=\"side-plank-m-mo-12\" d=\"^28\"/><path id=\"side-plank-m-mo-13\" d=\"^29\"/><path id=\"side-plank-m-mo-14\" d=\"^30\"/><path id=\"side-plank-m-mo-15\" d=\"^31\"/><path id=\"side-plank-m-mo-16\" d=\"^32\"/><path id=\"side-plank-m-mo-17\" d=\"^33\"/><path id=\"side-plank-m-mo-18\" d=\"^34\"/><path id=\"side-plank-m-mo-19\" d=\"^35\"/><path id=\"side-plank-m-mo-20\" d=\"^38\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#side-plank-m-dots)\"/>\n  <path class=\"datum\" d=\"^36\"/><path class=\"floorline\" d=\"^37\"/><path class=\"eq\" d=\"^38\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#side-plank-m-st-thigh.l\"/><use href=\"#side-plank-m-st-kneecap.l\"/><use href=\"#side-plank-m-st-shank.l\"/><use href=\"#side-plank-m-st-foot.l\"/><use href=\"#side-plank-m-st-thigh.r\"/><use href=\"#side-plank-m-st-kneecap.r\"/><use href=\"#side-plank-m-st-shank.r\"/><use href=\"#side-plank-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#side-plank-m-st-thigh.l\"/><use href=\"#side-plank-m-st-kneecap.l\"/><use href=\"#side-plank-m-st-shank.l\"/><use href=\"#side-plank-m-st-foot.l\"/><use href=\"#side-plank-m-st-thigh.r\"/><use href=\"#side-plank-m-st-kneecap.r\"/><use href=\"#side-plank-m-st-shank.r\"/><use href=\"#side-plank-m-st-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.33\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#side-plank-m-g0-thigh.r\"/><use href=\"#side-plank-m-g0-kneecap.r\"/><use href=\"#side-plank-m-g0-shank.r\"/><use href=\"#side-plank-m-g0-foot.r\"/></g><g class=\"u-fill\"><use href=\"#side-plank-m-g0-thigh.r\"/><use href=\"#side-plank-m-g0-kneecap.r\"/><use href=\"#side-plank-m-g0-shank.r\"/><use href=\"#side-plank-m-g0-foot.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:1\" data-t=\"0.67\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#side-plank-m-g1-thigh.r\"/><use href=\"#side-plank-m-g1-kneecap.r\"/><use href=\"#side-plank-m-g1-shank.r\"/><use href=\"#side-plank-m-g1-foot.r\"/></g><g class=\"u-fill\"><use href=\"#side-plank-m-g1-thigh.r\"/><use href=\"#side-plank-m-g1-kneecap.r\"/><use href=\"#side-plank-m-g1-shank.r\"/><use href=\"#side-plank-m-g1-foot.r\"/></g></g></g><g class=\"pose-end\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#side-plank-m-e-head\"/><use href=\"#side-plank-m-e-torso\"/><use href=\"#side-plank-m-e-thigh.l\"/><use href=\"#side-plank-m-e-kneecap.l\"/><use href=\"#side-plank-m-e-shank.l\"/><use href=\"#side-plank-m-e-foot.l\"/><use href=\"#side-plank-m-e-shcap.l\"/><use href=\"#side-plank-m-e-upper.l\"/><use href=\"#side-plank-m-e-elbowcap.l\"/><use href=\"#side-plank-m-e-fore.l\"/><use href=\"#side-plank-m-e-fist.l\"/><use href=\"#side-plank-m-e-thigh.r\"/><use href=\"#side-plank-m-e-kneecap.r\"/><use href=\"#side-plank-m-e-shank.r\"/><use href=\"#side-plank-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#side-plank-m-e-head\"/><use href=\"#side-plank-m-e-torso\"/><use href=\"#side-plank-m-e-thigh.l\"/><use href=\"#side-plank-m-e-kneecap.l\"/><use href=\"#side-plank-m-e-shank.l\"/><use href=\"#side-plank-m-e-foot.l\"/><use href=\"#side-plank-m-e-shcap.l\"/><use href=\"#side-plank-m-e-upper.l\"/><use href=\"#side-plank-m-e-elbowcap.l\"/><use href=\"#side-plank-m-e-fore.l\"/><use href=\"#side-plank-m-e-fist.l\"/><use href=\"#side-plank-m-e-thigh.r\"/><use href=\"#side-plank-m-e-kneecap.r\"/><use href=\"#side-plank-m-e-shank.r\"/><use href=\"#side-plank-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#side-plank-m-e-shcap.r\"/><use href=\"#side-plank-m-e-upper.r\"/><use href=\"#side-plank-m-e-elbowcap.r\"/><use href=\"#side-plank-m-e-fore.r\"/><use href=\"#side-plank-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#side-plank-m-e-shcap.r\"/><use href=\"#side-plank-m-e-upper.r\"/><use href=\"#side-plank-m-e-elbowcap.r\"/><use href=\"#side-plank-m-e-fore.r\"/><use href=\"#side-plank-m-e-fist.r\"/></g></g><circle class=\"joint\" cx=\"143.5\" cy=\"216.83\" r=\"2.25\"/><circle class=\"joint\" cx=\"121.54\" cy=\"281.33\" r=\"2.25\"/><circle class=\"joint\" cx=\"185.61\" cy=\"196.88\" r=\"2.25\"/><circle class=\"joint\" cx=\"121.54\" cy=\"330.25\" r=\"2.25\"/></g><mask id=\"side-plank-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#side-plank-m-m-head\" fill=\"#000\"/><use href=\"#side-plank-m-m-torso\" fill=\"#000\"/><use href=\"#side-plank-m-m-thigh.l\" fill=\"#000\"/><use href=\"#side-plank-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#side-plank-m-m-shank.l\" fill=\"#000\"/><use href=\"#side-plank-m-m-foot.l\" fill=\"#000\"/><use href=\"#side-plank-m-m-shcap.l\" fill=\"#000\"/><use href=\"#side-plank-m-m-upper.l\" fill=\"#000\"/><use href=\"#side-plank-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#side-plank-m-m-fore.l\" fill=\"#000\"/><use href=\"#side-plank-m-m-fist.l\" fill=\"#000\"/><use href=\"#side-plank-m-m-thigh.r\" fill=\"#000\"/><use href=\"#side-plank-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#side-plank-m-m-shank.r\" fill=\"#000\"/><use href=\"#side-plank-m-m-foot.r\" fill=\"#000\"/><use href=\"#side-plank-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#side-plank-m-mf-upper.r\" fill=\"#000\"/><use href=\"#side-plank-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#side-plank-m-mf-fore.r\" fill=\"#000\"/><use href=\"#side-plank-m-mf-fist.r\" fill=\"#000\"/><use href=\"#side-plank-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#side-plank-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#side-plank-m-mmask)\"><g class=\"u-stroke\"><use href=\"#side-plank-m-m-head\"/><use href=\"#side-plank-m-m-torso\"/><use href=\"#side-plank-m-m-thigh.l\"/><use href=\"#side-plank-m-m-kneecap.l\"/><use href=\"#side-plank-m-m-shank.l\"/><use href=\"#side-plank-m-m-foot.l\"/><use href=\"#side-plank-m-m-shcap.l\"/><use href=\"#side-plank-m-m-upper.l\"/><use href=\"#side-plank-m-m-elbowcap.l\"/><use href=\"#side-plank-m-m-fore.l\"/><use href=\"#side-plank-m-m-fist.l\"/><use href=\"#side-plank-m-m-thigh.r\"/><use href=\"#side-plank-m-m-kneecap.r\"/><use href=\"#side-plank-m-m-shank.r\"/><use href=\"#side-plank-m-m-foot.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MYHD1yy-1L0wI2MXi)oLYiwpL0)R1\"/><path class=\"leader m\" d=\"~My)H1HxV1L0xR7\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"side-plank-m-sink\" data-key=\"sink\" data-cue=\"The hips sink toward the floor.\" class=\"plate-callout m\" style=\"left:59.78%;top:55.87%\" aria-pressed=\"true\">Hips sink</button>",
    ]);
    return {
      view: "front",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "elbow",
        cues: [{ key: "elbow", cue: "Bottom elbow sits under the shoulder." }, { key: "hips", cue: "Hips lifted into one line with the ribs and legs." }, { key: "shoulder", cue: "Bottom shoulder stays away from the ear." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "sink",
        cues: [{ key: "sink", cue: "The hips sink toward the floor." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Hips sink</b><span>The hips sink toward the floor.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: hold 30–60 seconds\"><div class=\"tempo-seg\" style=\"flex:30–60 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>30–60 s</span></div></div></div>",
      alt: "Side plank, front view. From lying on one side propped on the forearm, the hips lift until the body forms one straight line from the head to the feet, the elbow under the shoulder and the top hand on the hip.",
      mistakeAlt: "Side Plank: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "none",
    "why": "D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c1, c3) is on setup steps 1 and 4."
  },
  contacts: [
    "floor-body"
  ],
  setup: [
    {
      "kind": "position",
      "text": "Lie on your side, elbow under your shoulder, forearm on a mat.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-sideplank"
        ],
        "note": "card c1, c7"
      }
    },
    {
      "kind": "position",
      "text": "Stack your top leg on your bottom leg.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-sideplank"
        ],
        "note": "card c1"
      }
    },
    {
      "kind": "position",
      "text": "Press elbow and foot down. Lift hips in line, head to feet.",
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-sideplank",
          "sl-sideplank"
        ],
        "note": "card c2"
      }
    },
    {
      "kind": "position",
      "text": "Top hand on your hip. Hold as steadily as you can.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-sideplank"
        ],
        "note": "card c3"
      }
    },
    {
      "kind": "brace",
      "text": "Brace and keep breathing, slow and deep.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-sideplank",
          "sl-sideplank"
        ],
        "note": "card c6, c2"
      }
    }
  ],
  posture: [
    {
      "key": "line",
      "label": "Straight line",
      "detail": "Head to feet in one straight line.",
      "anchor": {
        "pose": "end",
        "at": "hip.l"
      },
      "zoom": "hip-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-sideplank",
          "sl-sideplank"
        ],
        "note": "card c2"
      }
    },
    {
      "key": "hips",
      "label": "Hips up",
      "detail": "Hips up, don't let them sink. Lift them back in line, or end the hold.",
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
          "bb-sideplank",
          "sl-sideplank"
        ],
        "note": "card c5, c9, c2"
      }
    },
    {
      "key": "shoulder",
      "label": "Shoulder down",
      "detail": "Bottom shoulder down, away from your ear. Don't shrug. Pad the elbow.",
      "anchor": {
        "pose": "end",
        "at": "shoulder.r"
      },
      "zoom": "shoulder",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-sideplank"
        ],
        "note": "card c7"
      }
    },
    {
      "key": "breathe",
      "label": "Keep breathing",
      "detail": "Don't hold your breath. Keep the brace and take slow belly breaths.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-sideplank"
        ],
        "note": "card c6"
      }
    }
  ],
  zooms: [
    {
      "key": "hip-line",
      "chip": "Hips",
      "heading": "Hip line",
      "kind": "posture"
    },
    {
      "key": "shoulder",
      "chip": "Shoulder",
      "heading": "Bottom shoulder",
      "kind": "posture",
      "feelRow": "shoulder"
    }
  ],
  chips: [
    "hip-line",
    "shoulder",
    "feel"
  ],
  copy: {
    "setupLine": "Lie on your side, elbow under your shoulder. Lift your hips.",
    "mistakeLine": "Don't let your hips sink. Keep them in line.",
    "cueLine": "Hips up, keep breathing."
  },
  mistakes: [],
  risks: [
    {
      "key": "knee",
      "text": "Too much pressure inside the top knee or foot may stress those joints.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-sideplank-mod"
        ],
        "note": "card c8"
      }
    },
    {
      "key": "sink",
      "text": "Sinking hips take work off your trunk. Lift them, or end the hold.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-sideplank",
          "sl-sideplank"
        ],
        "note": "card c5, c9, c2"
      }
    },
    {
      "key": "breath",
      "text": "Holding your breath is one of the biggest side-plank mistakes.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "bb-sideplank"
        ],
        "note": "card c6"
      }
    }
  ],
  riskFlags: [
    "knee"
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
    "bb-sideplank",
    "sl-sideplank",
    "ace-sideplank-mod",
    "juker-1998",
    "nhs-knee-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/side_plank.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=1f18a0884ee90fd4937349c8effd0f43a2b2923e67e5d582a2856fe6e3aaa6db
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_inverted_row",
  name: "Inverted Row",
  hashes: { inputsSha256: "1f18a0884ee90fd4937349c8effd0f43a2b2923e67e5d582a2856fe6e3aaa6db", golden: "55a17079d6bf422c159551bfffc982dc5008cf651dc82be8633c5ac5aa505c16" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"inverted-row-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"inverted-row-n-st-thigh.l\" d=\"~#F12PTtSw_1xDs*T-1TbE2dA1y!1HiG5E8X2*3)P1XkGhKj)i)6-pW3XS1*fT4F1K9!2W-1!ocB1IaX5XlFpYuWy1Wx1HcwN1K601000201001100100001010001000000000000012100000100011001110000002012001000200001\"/><path id=\"inverted-row-n-st-kneecap.l\" d=\"~~ARF1P).1_J10\"/><path id=\"inverted-row-n-st-shank.l\" d=\"~#F12wNG1yI*1)yF1GX!1IaV5cB1_!1yhG5E8-2*3zw2TjEaObEbz4GfD2T*1TqT4D1K9(2N-1HqdA1VbI2S6ygSi(kNkP7Yr*310200200000100020010100100200202001011110001010000000000010100000001010020000010\"/><path id=\"inverted-row-n-st-foot.l\" d=\"~#o2PAU1wWw2OJT1O_)1J7.aK1EjVdGw1_rEV2*uPD2VkFx1G8Sm.9WF1-fy6h-uFg_t010210101200000000000020011011100000002200001000\"/><path id=\"inverted-row-n-st-shcap.l\" d=\"~~PEgPwU1wP10\"/><path id=\"inverted-row-n-st-upper.l\" d=\"~#F12N*i(*U1.DiO-V1X5Y695Fr*D1z6W2*2P1zsYqIjU8zawdO3(k)i!x1lD3z1U6wv)z184x5H7yc!aNqXb!dXhY4Ts20200000100000010100000000012001000121100001010000000000010100001212100000011000\"/><path id=\"inverted-row-n-st-elbowcap.l\" d=\"~~HHmwWJ1Dz10\"/><path id=\"inverted-row-n-st-fore.l\" d=\"~#F12_FoYNK1-TnOxN1z8P6o*1SqKy1*8N4X2oOmyoTd_4R7J8O3we.lYob!2T3F9Yv.t!1nV5W8J7(6wlK7SbVcJ5Tl10002220001010111100020101210100000110020000020001000120001110000021001210011010\"/><path id=\"inverted-row-n-st-head\" d=\"~#w12Ux8UIP1-I7*_R1(dHnU4wl.5ya(3F4)8W2-cy5)pSbBbX7X9pX4UiG5OonEnD8IjFkXeDiH60100000000000100000101000200200200100000102001200202000020000000\"/><path id=\"inverted-row-n-st-torso\" d=\"~#_12FGcH)S1R(aVHS1O8U8V5F5Wh*3_cO5NjO6A2)5VoG2BfHi2Udw1TgD1XlI7OqIaTmK7-7Xhw2IH1JdKtD1B2w6G3w9NjO6U85*bD9S4YiYeDcS1O5B4-aWc9WaSY201000002001101000200121000000100000000020000021200000111110020000000100000000002000220001100000020220001000100020001\"/><path id=\"inverted-row-n-st-thigh.r\" d=\"^0\"/><path id=\"inverted-row-n-st-kneecap.r\" d=\"^1\"/><path id=\"inverted-row-n-st-shank.r\" d=\"^2\"/><path id=\"inverted-row-n-st-foot.r\" d=\"^3\"/><path id=\"inverted-row-n-st-shcap.r\" d=\"^4\"/><path id=\"inverted-row-n-st-upper.r\" d=\"^5\"/><path id=\"inverted-row-n-st-elbowcap.r\" d=\"^6\"/><path id=\"inverted-row-n-st-fore.r\" d=\"^7\"/><path id=\"inverted-row-n-g0-head\" d=\"~#w12JKc(IF1GObKWG1N9JpoPlT7!8y3!4E9w1OdW2XrS6T9T9I9R2)7NhrxpS3)mSbRhPmXa!gJ91010100000100000212100000200011200000000010111000200000200000002\"/><path id=\"inverted-row-n-g0-torso\" d=\"~#_12Pzg(WI1G*e._H1.9(6T6y4FihPdz3Fk.2H3O5*nV6EiAfK2Pdw4BgA5BlG2KrE6zoX5)8.hE1zJ1N5ztB4G3N5-4H8Fk.2P8J1Id!6y1FjHcWeP2B5z2EbPc(1R5(Y200100010000020000000000200000000010000120020000101100002200002000000101000020000120002012000000120200002000100010100\"/><path id=\"inverted-row-n-g0-shcap.r\" d=\"~~PWjF.K1wP10\"/><path id=\"inverted-row-n-g0-upper.r\" d=\"~#F12DSmwON1OFmxyO1V2W473S9*qG4(1z2w1EaY8-g(c-6wfN1Dl6PdkD2N1S4!d*oa2-1A5J8WkynThF9Kk)1)s00121020000001010010000000000001000010100000200000000001111012000000000000010020\"/><path id=\"inverted-row-n-g0-elbowcap.r\" d=\"~~SJmA-F1Dz10\"/><path id=\"inverted-row-n-g0-fore.r\" d=\"~#F12Swo!-G1RJnXwH1T7(1sG1Jr.h.70G2j)hW8Oe5*9y5E8(bVhS9nF2R4H6NuXbS14)5(4-1JcDmeHf.7WcGi01110110002000001010100120020000000000001020000000111000020001000010101010010111\"/><path id=\"inverted-row-n-e-thigh.l\" d=\"~#F12YAy1_OR1-(w1VTP1zaI6nuPR1UD1)1V9z1T4GD1.A1E9IoEfGdIp-5XG1xx1X4f-9j(J1_I1qtT7x9KtYfJgHI1yrYnDK1Fa00100001210000010020000002001010000000000000000000011100000000001001010002101100\"/><path id=\"inverted-row-n-e-kneecap.l\" d=\"~~YRI1_XX1_J10\"/><path id=\"inverted-row-n-e-shank.l\" d=\"~#F12ywJ1Y_Y1)(H1.YX1T7z9qtUS1_B1x2X9x1T4)U1EG1I5Kex9*7zfI3*O1*N1X4f.9jFJ1wK1rw1xaK6cJh(9DqHgHeHrF610002200000200101100200000002100101200012120000000010000000101020000001010000010\"/><path id=\"inverted-row-n-e-foot.l\" d=\"~#o2U-U1D-)1zKU1.W(1!aR7P5OiB1xz1PY1TB2zW1YW1GvUnXfyiXnPy1)g2PaztS4Yx1102000000220000000020000010020000000200001000010\"/><path id=\"inverted-row-n-e-shcap.l\" d=\"~~WPnN.E1wP10\"/><path id=\"inverted-row-n-e-upper.l\" d=\"~#F12YYnAWF1BHnX(E1O3*585JmAt2O51X2E8Vm)1BlE9TdVixa.hEgK2B1E5)1Ni!v52G4I5RiF1_2!sPcWiPpUd20100001110001020000002000002010000001100001000210000201011012000002000000001001\"/><path id=\"inverted-row-n-e-elbowcap.l\" d=\"~~!!rw_K1Dz10\"/><path id=\"inverted-row-n-e-fore.l\" d=\"~#F12UAuJ(K1-(t)VN1V2S8jT1uTB1K4U7-1_1R3UpE8_bI1DbH5PdT2YpN1D2P2J8!7XA1w1K1k(8S9D5_cziw2zhz8Vk01200000120000020002001010000110020000020000001100000020000001010120000000000001\"/><path id=\"inverted-row-n-e-fist.l\" d=\"~~!)sHNB1ww10\"/><path id=\"inverted-row-n-e-head\" d=\"~#w12DOhNYw1.Gg-!x1U4_qB3Dl)8H7y2J5I9lVd4KsP1X7Eb-8E4*aWfU3XoW7)lUeBfyoO6!eJc1010000101210101000010002200001200110000010010002020000000200000\"/><path id=\"inverted-row-n-e-torso\" d=\"~#_12!OkAXA1KOjRUz1)aw5B7_2wiY2!djNksD4-4Em*aXkSb-4_c(6Bf_8.jW2KrV1-ox4.9GhR4IJ1V2.rI9E4_4G6D7PksA8!2KeJ4K2AjN9YgJ3X40Ob!bH4TlJW200020000200000000010101000000000200000000000001000000000000101010000101000000121000002022000222200000100000010210000\"/><path id=\"inverted-row-n-e-thigh.r\" d=\"^16\"/><path id=\"inverted-row-n-e-kneecap.r\" d=\"^17\"/><path id=\"inverted-row-n-e-shank.r\" d=\"^18\"/><path id=\"inverted-row-n-e-foot.r\" d=\"^19\"/><path id=\"inverted-row-n-e-shcap.r\" d=\"^20\"/><path id=\"inverted-row-n-e-upper.r\" d=\"^21\"/><path id=\"inverted-row-n-e-elbowcap.r\" d=\"^22\"/><path id=\"inverted-row-n-e-fore.r\" d=\"^23\"/><path id=\"inverted-row-n-e-fist.r\" d=\"^24\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#inverted-row-n-dots)\"/>\n  <path class=\"floorline\" d=\"M87.76 338.52H317.66\"/><path class=\"eq\" d=\"~MDEsJ_x2L0xYY1Q0E6E6_RY1LVS1F6QE60WS1F6LF6_RY1Q0F6F6-RY1LWS1E6QF60VS1E6Z\"/><path class=\"eq-thin\" d=\"M138.36 294.13h1.2M138.36 286.82h1.2M138.36 279.5h1.2M138.36 272.19h1.2M138.36 264.87h1.2M138.36 257.56h1.2M138.36 250.25h1.2M138.36 242.93h1.2M138.36 235.62h1.2M138.36 228.3h1.2M138.36 220.99h1.2M138.36 213.67h1.2M138.36 206.36h1.2M138.36 199.05h1.2M138.36 191.73h1.2M138.36 184.42h1.2M138.36 177.1h1.2M138.36 169.79h1.2M138.36 162.47h1.2M138.36 155.16h1.2M138.36 147.85h1.2M138.36 140.53h1.2M138.36 133.22h1.2M138.36 125.9h1.2M138.36 118.59h1.2M138.36 111.27h1.2M138.36 103.96h1.2M138.36 96.65h1.2M138.36 89.33h1.2M138.36 82.02h1.2M138.36 74.7h1.2M138.36 67.39h1.2\"/><path class=\"eq\" d=\"~MDEsy!D1L0BG4L!mDG4L.mHS3L_x1GS3L-x1!mZ\"/><path class=\"eq\" d=\"~MDSuFNB1L00Q0010LIA10Q10JA10L20Q0222LJA11Q20IA11Z\"/><path class=\"eq-solid\" d=\"~~FRtHNB1Ue0\"/><path class=\"eq-pin\" d=\"~~A!tHNB1Y30\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#inverted-row-n-st-thigh.l\"/><use href=\"#inverted-row-n-st-kneecap.l\"/><use href=\"#inverted-row-n-st-shank.l\"/><use href=\"#inverted-row-n-st-foot.l\"/><use href=\"#inverted-row-n-st-shcap.l\"/><use href=\"#inverted-row-n-st-upper.l\"/><use href=\"#inverted-row-n-st-elbowcap.l\"/><use href=\"#inverted-row-n-st-fore.l\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-n-st-thigh.l\"/><use href=\"#inverted-row-n-st-kneecap.l\"/><use href=\"#inverted-row-n-st-shank.l\"/><use href=\"#inverted-row-n-st-foot.l\"/><use href=\"#inverted-row-n-st-shcap.l\"/><use href=\"#inverted-row-n-st-upper.l\"/><use href=\"#inverted-row-n-st-elbowcap.l\"/><use href=\"#inverted-row-n-st-fore.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#inverted-row-n-st-head\"/><use href=\"#inverted-row-n-st-torso\"/><use href=\"#inverted-row-n-st-thigh.r\"/><use href=\"#inverted-row-n-st-kneecap.r\"/><use href=\"#inverted-row-n-st-shank.r\"/><use href=\"#inverted-row-n-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-n-st-head\"/><use href=\"#inverted-row-n-st-torso\"/><use href=\"#inverted-row-n-st-thigh.r\"/><use href=\"#inverted-row-n-st-kneecap.r\"/><use href=\"#inverted-row-n-st-shank.r\"/><use href=\"#inverted-row-n-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#inverted-row-n-st-shcap.r\"/><use href=\"#inverted-row-n-st-upper.r\"/><use href=\"#inverted-row-n-st-elbowcap.r\"/><use href=\"#inverted-row-n-st-fore.r\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-n-st-shcap.r\"/><use href=\"#inverted-row-n-st-upper.r\"/><use href=\"#inverted-row-n-st-elbowcap.r\"/><use href=\"#inverted-row-n-st-fore.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#inverted-row-n-g0-head\"/><use href=\"#inverted-row-n-g0-torso\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-n-g0-head\"/><use href=\"#inverted-row-n-g0-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#inverted-row-n-g0-shcap.r\"/><use href=\"#inverted-row-n-g0-upper.r\"/><use href=\"#inverted-row-n-g0-elbowcap.r\"/><use href=\"#inverted-row-n-g0-fore.r\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-n-g0-shcap.r\"/><use href=\"#inverted-row-n-g0-upper.r\"/><use href=\"#inverted-row-n-g0-elbowcap.r\"/><use href=\"#inverted-row-n-g0-fore.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#inverted-row-n-e-thigh.l\"/><use href=\"#inverted-row-n-e-kneecap.l\"/><use href=\"#inverted-row-n-e-shank.l\"/><use href=\"#inverted-row-n-e-foot.l\"/><use href=\"#inverted-row-n-e-shcap.l\"/><use href=\"#inverted-row-n-e-upper.l\"/><use href=\"#inverted-row-n-e-elbowcap.l\"/><use href=\"#inverted-row-n-e-fore.l\"/><use href=\"#inverted-row-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-n-e-thigh.l\"/><use href=\"#inverted-row-n-e-kneecap.l\"/><use href=\"#inverted-row-n-e-shank.l\"/><use href=\"#inverted-row-n-e-foot.l\"/><use href=\"#inverted-row-n-e-shcap.l\"/><use href=\"#inverted-row-n-e-upper.l\"/><use href=\"#inverted-row-n-e-elbowcap.l\"/><use href=\"#inverted-row-n-e-fore.l\"/><use href=\"#inverted-row-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#inverted-row-n-e-head\"/><use href=\"#inverted-row-n-e-torso\"/><use href=\"#inverted-row-n-e-thigh.r\"/><use href=\"#inverted-row-n-e-kneecap.r\"/><use href=\"#inverted-row-n-e-shank.r\"/><use href=\"#inverted-row-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-n-e-head\"/><use href=\"#inverted-row-n-e-torso\"/><use href=\"#inverted-row-n-e-thigh.r\"/><use href=\"#inverted-row-n-e-kneecap.r\"/><use href=\"#inverted-row-n-e-shank.r\"/><use href=\"#inverted-row-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#inverted-row-n-e-shcap.r\"/><use href=\"#inverted-row-n-e-upper.r\"/><use href=\"#inverted-row-n-e-elbowcap.r\"/><use href=\"#inverted-row-n-e-fore.r\"/><use href=\"#inverted-row-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-n-e-shcap.r\"/><use href=\"#inverted-row-n-e-upper.r\"/><use href=\"#inverted-row-n-e-elbowcap.r\"/><use href=\"#inverted-row-n-e-fore.r\"/><use href=\"#inverted-row-n-e-fist.r\"/></g></g><path class=\"eq-cable m-line\" d=\"~MWwqYXI1LA5x6LafL65L11L98LdgLfaL34L52L52L02L32L21L11L63L45L03L12L56L7aLfgLhkLfkLdiLdgL9aL76L76L51L31L53L72L72L72L34L34L14L36L14L52L32L16L56L06L06L1cL44L24L26L18L78L9eLbcLfgLlkLfkLdeL9aL38L14L23L63L63L01L02L20L34L06L12L3aL9cLbiL5aL12La5Lcb\"/><path class=\"eq-cable m-line\" d=\"~MAJu!ID1L*2y1L39L17L0bL27L1bL07L69L67L09L67L87L85L65L87L81Lc3L83L81La0Lc2La3L84L84\"/><circle class=\"joint\" cx=\"128.11\" cy=\"204.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"148.49\" cy=\"234.56\" r=\"2.25\"/><circle class=\"joint\" cx=\"182.92\" cy=\"244.16\" r=\"2.25\"/><circle class=\"joint\" cx=\"230.17\" cy=\"285.41\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#A20!XmHxO1OSmXFO10020020000002201042110222010022000201022000201221022012210220000000001002000000000000001000000200000022001001010000220000010000020010001000110000200100010001100000010100000210120000200020000000000000001\"/><path class=\"arrow\" d=\"~M(NtDPD1L-9YF1L.i.w2Z\"/></g><path class=\"leader\" d=\"M227.34 271.49L245 218H255\"/><circle class=\"anchor\" cx=\"227.34\" cy=\"271.49\" r=\"1.5\"/><path class=\"leader\" d=\"~M!)t(!B1LAB5d\"/><circle class=\"anchor\" cx=\"153.58\" cy=\"194.07\" r=\"1.5\"/><path class=\"leader\" d=\"M122.38 217L69.69 194H59.69\"/><circle class=\"anchor\" cx=\"122.38\" cy=\"217\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"inverted-row-n-line\" data-key=\"line\" data-cue=\"Keep a rigid straight line from head to heels, top and bottom.\" class=\"plate-callout two\" style=\"left:69.83%;top:54.75%\" aria-pressed=\"true\">Body<br>straight</button><button type=\"button\" id=\"inverted-row-n-chest\" data-key=\"chest\" data-cue=\"Pull until the chest touches the bar.\" class=\"plate-callout two\" style=\"left:48.88%;top:48.04%\" aria-pressed=\"false\">Chest<br>to bar</button><button type=\"button\" id=\"inverted-row-n-blades\" data-key=\"blades\" data-cue=\"Squeeze the shoulder blades back together and down at the top.\" class=\"plate-callout two\" style=\"left:1.68%;top:48.04%\" aria-pressed=\"false\">Blades<br>back</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"inverted-row-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"inverted-row-m-st-thigh.l\" d=\"^0\"/><path id=\"inverted-row-m-st-kneecap.l\" d=\"^1\"/><path id=\"inverted-row-m-st-shank.l\" d=\"^2\"/><path id=\"inverted-row-m-st-foot.l\" d=\"^3\"/><path id=\"inverted-row-m-st-shcap.l\" d=\"^4\"/><path id=\"inverted-row-m-st-upper.l\" d=\"^5\"/><path id=\"inverted-row-m-st-elbowcap.l\" d=\"^6\"/><path id=\"inverted-row-m-st-fore.l\" d=\"^7\"/><path id=\"inverted-row-m-st-head\" d=\"^8\"/><path id=\"inverted-row-m-st-torso\" d=\"^9\"/><path id=\"inverted-row-m-st-thigh.r\" d=\"^0\"/><path id=\"inverted-row-m-st-kneecap.r\" d=\"^1\"/><path id=\"inverted-row-m-st-shank.r\" d=\"^2\"/><path id=\"inverted-row-m-st-foot.r\" d=\"^3\"/><path id=\"inverted-row-m-st-shcap.r\" d=\"^4\"/><path id=\"inverted-row-m-st-upper.r\" d=\"^5\"/><path id=\"inverted-row-m-st-elbowcap.r\" d=\"^6\"/><path id=\"inverted-row-m-st-fore.r\" d=\"^7\"/><path id=\"inverted-row-m-g0-head\" d=\"^10\"/><path id=\"inverted-row-m-g0-torso\" d=\"^11\"/><path id=\"inverted-row-m-g0-shcap.r\" d=\"^12\"/><path id=\"inverted-row-m-g0-upper.r\" d=\"^13\"/><path id=\"inverted-row-m-g0-elbowcap.r\" d=\"^14\"/><path id=\"inverted-row-m-g0-fore.r\" d=\"^15\"/><path id=\"inverted-row-m-e-thigh.l\" d=\"^16\"/><path id=\"inverted-row-m-e-kneecap.l\" d=\"^17\"/><path id=\"inverted-row-m-e-shank.l\" d=\"^18\"/><path id=\"inverted-row-m-e-foot.l\" d=\"^19\"/><path id=\"inverted-row-m-e-shcap.l\" d=\"^20\"/><path id=\"inverted-row-m-e-upper.l\" d=\"^21\"/><path id=\"inverted-row-m-e-elbowcap.l\" d=\"^22\"/><path id=\"inverted-row-m-e-fore.l\" d=\"^23\"/><path id=\"inverted-row-m-e-fist.l\" d=\"^24\"/><path id=\"inverted-row-m-e-head\" d=\"^25\"/><path id=\"inverted-row-m-e-torso\" d=\"^26\"/><path id=\"inverted-row-m-e-thigh.r\" d=\"^16\"/><path id=\"inverted-row-m-e-kneecap.r\" d=\"^17\"/><path id=\"inverted-row-m-e-shank.r\" d=\"^18\"/><path id=\"inverted-row-m-e-foot.r\" d=\"^19\"/><path id=\"inverted-row-m-e-shcap.r\" d=\"^20\"/><path id=\"inverted-row-m-e-upper.r\" d=\"^21\"/><path id=\"inverted-row-m-e-elbowcap.r\" d=\"^22\"/><path id=\"inverted-row-m-e-fore.r\" d=\"^23\"/><path id=\"inverted-row-m-e-fist.r\" d=\"^24\"/><path id=\"inverted-row-m-m-torso\" d=\"~#_12ySmwOz1-)lEzy1)bs-70!f(8FdH4!iw8S5x3*gxiRnS3)8Ha_b-bHfOfycVoD7.n9XaVeEaTF1ziXmTiT5y3K8S4_iw8U6S5xfv)8whw3wjY4B3y4-aW9D8VS1HG220020010100000200000001010002000001000000000000000000101000000002100202002000000100000010001000000001000010000000000\"/><path id=\"inverted-row-m-m-thigh.r\" d=\"~#F12wXvwAV1)JuONU1)aT4hy1AX1(tO3z9.1K4*I1xuxdRmEhTa)pT1RN1VpX4a-9uPT1!z1mx1x9X7IqNkDnyF1Uu!iHN1_200000020001101000000001010111100000120200022000000110000000000200010010000000010\"/><path id=\"inverted-row-m-m-kneecap.r\" d=\"~~AwH1PP-1_J10\"/><path id=\"inverted-row-m-m-shank.r\" d=\"~#F12SUH1wY_1ING1).-1x9X7mx1AY1(sR3E9*1I4*_1)vX7GdEaI6IfrxX1ID1X48.9w1yT1DB1ly1)aV4F3yhyeFoNiJbwsY100000101000111001010000200020001002000000000200000000010110120200000001110000011\"/><path id=\"inverted-row-m-m-foot.r\" d=\"~#o2_NU1DBw2-!T1IB)1N9E9J2Bj.6Iy1FJ1*K2IJ1_(1)qSsRcJk-h!B1Xg!2U5IuwaNw1001001011020001000010000020001000002000020000100\"/><path id=\"inverted-row-m-mf-head\" d=\"~#w12wAlNWuEUjIIvz5WqIaYizbU34_5O8.3.cX4ErT8B3EdX6)6.f_aDc.l(e*h(ix9!oJ2P9Yg0001110001110000202200200100100000020000000000002010100000010000\"/><path id=\"inverted-row-m-mf-thigh.l\" d=\"^42\"/><path id=\"inverted-row-m-mf-kneecap.l\" d=\"^43\"/><path id=\"inverted-row-m-mf-shank.l\" d=\"^44\"/><path id=\"inverted-row-m-mf-foot.l\" d=\"^45\"/><path id=\"inverted-row-m-mf-shcap.l\" d=\"~~PDoY)E1wP10\"/><path id=\"inverted-row-m-mf-upper.l\" d=\"~#F12_NoY_F1IxoGBF1B3K5a5!kSqaE50R2B6IjE2xlE9Vd-i-9Vf-cI2vx5T1yhDt76*3)4.j9y3_sUcSiWpNd00020000000000000000000011100000002000000001000012000120000010000200000100000010\"/><path id=\"inverted-row-m-mf-elbowcap.l\" d=\"~~!GsFNK1Dz10\"/><path id=\"inverted-row-m-mf-fore.l\" d=\"~#F12_Ru(PK1BKuTEN1E2F8lR1rXz1x4J7X1Y1B2Wn-7DcpDb(5HdG1UnN1y2y3(7w6Gz1sK1A1P8Y9(5!bXiH1zhx9Ik00200000000002000000000010010100000000000100020220100000000001000000000000010000\"/><path id=\"inverted-row-m-mf-fist.l\" d=\"^24\"/><path id=\"inverted-row-m-mf-shcap.r\" d=\"^47\"/><path id=\"inverted-row-m-mf-upper.r\" d=\"^48\"/><path id=\"inverted-row-m-mf-elbowcap.r\" d=\"^49\"/><path id=\"inverted-row-m-mf-fore.r\" d=\"^50\"/><path id=\"inverted-row-m-mf-fist.r\" d=\"^24\"/><path id=\"inverted-row-m-mo-0\" d=\"^25\"/><path id=\"inverted-row-m-mo-1\" d=\"^26\"/><path id=\"inverted-row-m-mo-2\" d=\"^16\"/><path id=\"inverted-row-m-mo-3\" d=\"^17\"/><path id=\"inverted-row-m-mo-4\" d=\"^18\"/><path id=\"inverted-row-m-mo-5\" d=\"^19\"/><path id=\"inverted-row-m-mo-6\" d=\"^20\"/><path id=\"inverted-row-m-mo-7\" d=\"^21\"/><path id=\"inverted-row-m-mo-8\" d=\"^22\"/><path id=\"inverted-row-m-mo-9\" d=\"^23\"/><path id=\"inverted-row-m-mo-10\" d=\"^24\"/><path id=\"inverted-row-m-mo-11\" d=\"^16\"/><path id=\"inverted-row-m-mo-12\" d=\"^17\"/><path id=\"inverted-row-m-mo-13\" d=\"^18\"/><path id=\"inverted-row-m-mo-14\" d=\"^19\"/><path id=\"inverted-row-m-mo-15\" d=\"^20\"/><path id=\"inverted-row-m-mo-16\" d=\"^21\"/><path id=\"inverted-row-m-mo-17\" d=\"^22\"/><path id=\"inverted-row-m-mo-18\" d=\"^23\"/><path id=\"inverted-row-m-mo-19\" d=\"^24\"/><path id=\"inverted-row-m-mo-20\" d=\"^28\"/><path id=\"inverted-row-m-mo-21\" d=\"^30\"/><path id=\"inverted-row-m-mo-22\" d=\"^31\"/><path id=\"inverted-row-m-mo-23\" d=\"^32\"/><path id=\"inverted-row-m-mo-24\" d=\"^33\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#inverted-row-m-dots)\"/>\n  <path class=\"floorline\" d=\"^27\"/><path class=\"eq\" d=\"^28\"/><path class=\"eq-thin\" d=\"^29\"/><path class=\"eq\" d=\"^30\"/><path class=\"eq\" d=\"^31\"/><path class=\"eq-solid\" d=\"^32\"/><path class=\"eq-pin\" d=\"^33\"/><g class=\"pose-start\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#inverted-row-m-st-thigh.l\"/><use href=\"#inverted-row-m-st-kneecap.l\"/><use href=\"#inverted-row-m-st-shank.l\"/><use href=\"#inverted-row-m-st-foot.l\"/><use href=\"#inverted-row-m-st-shcap.l\"/><use href=\"#inverted-row-m-st-upper.l\"/><use href=\"#inverted-row-m-st-elbowcap.l\"/><use href=\"#inverted-row-m-st-fore.l\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-m-st-thigh.l\"/><use href=\"#inverted-row-m-st-kneecap.l\"/><use href=\"#inverted-row-m-st-shank.l\"/><use href=\"#inverted-row-m-st-foot.l\"/><use href=\"#inverted-row-m-st-shcap.l\"/><use href=\"#inverted-row-m-st-upper.l\"/><use href=\"#inverted-row-m-st-elbowcap.l\"/><use href=\"#inverted-row-m-st-fore.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#inverted-row-m-st-head\"/><use href=\"#inverted-row-m-st-torso\"/><use href=\"#inverted-row-m-st-thigh.r\"/><use href=\"#inverted-row-m-st-kneecap.r\"/><use href=\"#inverted-row-m-st-shank.r\"/><use href=\"#inverted-row-m-st-foot.r\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-m-st-head\"/><use href=\"#inverted-row-m-st-torso\"/><use href=\"#inverted-row-m-st-thigh.r\"/><use href=\"#inverted-row-m-st-kneecap.r\"/><use href=\"#inverted-row-m-st-shank.r\"/><use href=\"#inverted-row-m-st-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#inverted-row-m-st-shcap.r\"/><use href=\"#inverted-row-m-st-upper.r\"/><use href=\"#inverted-row-m-st-elbowcap.r\"/><use href=\"#inverted-row-m-st-fore.r\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-m-st-shcap.r\"/><use href=\"#inverted-row-m-st-upper.r\"/><use href=\"#inverted-row-m-st-elbowcap.r\"/><use href=\"#inverted-row-m-st-fore.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:0\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#inverted-row-m-g0-head\"/><use href=\"#inverted-row-m-g0-torso\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-m-g0-head\"/><use href=\"#inverted-row-m-g0-torso\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#inverted-row-m-g0-shcap.r\"/><use href=\"#inverted-row-m-g0-upper.r\"/><use href=\"#inverted-row-m-g0-elbowcap.r\"/><use href=\"#inverted-row-m-g0-fore.r\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-m-g0-shcap.r\"/><use href=\"#inverted-row-m-g0-upper.r\"/><use href=\"#inverted-row-m-g0-elbowcap.r\"/><use href=\"#inverted-row-m-g0-fore.r\"/></g></g></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#inverted-row-m-e-thigh.l\"/><use href=\"#inverted-row-m-e-kneecap.l\"/><use href=\"#inverted-row-m-e-shank.l\"/><use href=\"#inverted-row-m-e-foot.l\"/><use href=\"#inverted-row-m-e-shcap.l\"/><use href=\"#inverted-row-m-e-upper.l\"/><use href=\"#inverted-row-m-e-elbowcap.l\"/><use href=\"#inverted-row-m-e-fore.l\"/><use href=\"#inverted-row-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-m-e-thigh.l\"/><use href=\"#inverted-row-m-e-kneecap.l\"/><use href=\"#inverted-row-m-e-shank.l\"/><use href=\"#inverted-row-m-e-foot.l\"/><use href=\"#inverted-row-m-e-shcap.l\"/><use href=\"#inverted-row-m-e-upper.l\"/><use href=\"#inverted-row-m-e-elbowcap.l\"/><use href=\"#inverted-row-m-e-fore.l\"/><use href=\"#inverted-row-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#inverted-row-m-e-head\"/><use href=\"#inverted-row-m-e-torso\"/><use href=\"#inverted-row-m-e-thigh.r\"/><use href=\"#inverted-row-m-e-kneecap.r\"/><use href=\"#inverted-row-m-e-shank.r\"/><use href=\"#inverted-row-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-m-e-head\"/><use href=\"#inverted-row-m-e-torso\"/><use href=\"#inverted-row-m-e-thigh.r\"/><use href=\"#inverted-row-m-e-kneecap.r\"/><use href=\"#inverted-row-m-e-shank.r\"/><use href=\"#inverted-row-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#inverted-row-m-e-shcap.r\"/><use href=\"#inverted-row-m-e-upper.r\"/><use href=\"#inverted-row-m-e-elbowcap.r\"/><use href=\"#inverted-row-m-e-fore.r\"/><use href=\"#inverted-row-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#inverted-row-m-e-shcap.r\"/><use href=\"#inverted-row-m-e-upper.r\"/><use href=\"#inverted-row-m-e-elbowcap.r\"/><use href=\"#inverted-row-m-e-fore.r\"/><use href=\"#inverted-row-m-e-fist.r\"/></g></g><path class=\"eq-cable m-line\" d=\"^34\"/><path class=\"eq-cable m-line\" d=\"^35\"/><circle class=\"joint\" cx=\"128.11\" cy=\"204.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"148.49\" cy=\"234.56\" r=\"2.25\"/><circle class=\"joint\" cx=\"182.92\" cy=\"244.16\" r=\"2.25\"/><circle class=\"joint\" cx=\"230.17\" cy=\"285.41\" r=\"2.25\"/></g><mask id=\"inverted-row-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#inverted-row-m-mf-head\" fill=\"#000\"/><use href=\"#inverted-row-m-m-torso\" fill=\"#000\"/><use href=\"#inverted-row-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#inverted-row-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#inverted-row-m-mf-shank.l\" fill=\"#000\"/><use href=\"#inverted-row-m-mf-foot.l\" fill=\"#000\"/><use href=\"#inverted-row-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#inverted-row-m-mf-upper.l\" fill=\"#000\"/><use href=\"#inverted-row-m-mf-elbowcap.l\" fill=\"#000\"/><use href=\"#inverted-row-m-mf-fore.l\" fill=\"#000\"/><use href=\"#inverted-row-m-mf-fist.l\" fill=\"#000\"/><use href=\"#inverted-row-m-m-thigh.r\" fill=\"#000\"/><use href=\"#inverted-row-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#inverted-row-m-m-shank.r\" fill=\"#000\"/><use href=\"#inverted-row-m-m-foot.r\" fill=\"#000\"/><use href=\"#inverted-row-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#inverted-row-m-mf-upper.r\" fill=\"#000\"/><use href=\"#inverted-row-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#inverted-row-m-mf-fore.r\" fill=\"#000\"/><use href=\"#inverted-row-m-mf-fist.r\" fill=\"#000\"/><use href=\"#inverted-row-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#inverted-row-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#inverted-row-m-mmask)\"><g class=\"u-stroke\"><use href=\"#inverted-row-m-m-torso\"/><use href=\"#inverted-row-m-m-thigh.r\"/><use href=\"#inverted-row-m-m-kneecap.r\"/><use href=\"#inverted-row-m-m-shank.r\"/><use href=\"#inverted-row-m-m-foot.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"~MFAA1_(S1LxY3_I2MAbBtLzbDtLHH1Vq\"/><path class=\"leader m\" d=\"M151.79 273.06L122.39 306H112.39\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"inverted-row-m-sag\" data-key=\"sag\" data-cue=\"The hips drop toward the floor and the body folds.\" class=\"plate-callout two m\" style=\"left:13.97%;top:79.33%\" aria-pressed=\"true\">Hips<br>sagging</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "line",
        cues: [{ key: "line", cue: "Keep a rigid straight line from head to heels, top and bottom." }, { key: "chest", cue: "Pull until the chest touches the bar." }, { key: "blades", cue: "Squeeze the shoulder blades back together and down at the top." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "sag",
        cues: [{ key: "sag", cue: "The hips drop toward the floor and the body folds." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Hips sagging</b><span>The hips drop toward the floor and the body folds.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 1 second, hold 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Inverted row, side view. Hanging face up under a bar set at about waist height, heels on the floor and the body straight from head to heels, the lifter pulls the chest to the bar, then lowers to straight arms.",
      mistakeAlt: "Inverted Row: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "pull",
    "orientation": "pronated",
    "handle": "bar-32",
    "loadAxis": "across",
    "width": {
      "text": "Slightly wider than shoulder width.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-best-back",
          "youdas-2016",
          "strengthlog-inverted-row"
        ],
        "note": "c2"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "hk-baechle-grip"
        ],
        "note": "c14"
      }
    },
    "contact": "finger-base",
    "wrist": {
      "ext": [
        0,
        25
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
        "note": "c15. The ext range is the bar key's row wristRange (ga:pull-base), a convention, not a card number."
      }
    },
    "pose": {
      "view": "radial",
      "forearm": 180,
      "wrist": {
        "ext": 5,
        "dev": 0
      },
      "contactAt": 1,
      "fingers": {
        "curl": 1
      },
      "thumb": "wrapped",
      "squeeze": "firm",
      "load": {
        "kind": "pull"
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
    "gripLine": "Overhand, bar across the base of your fingers, thumbs wrapped.",
    "cue": "Overhand, thumbs wrapped."
  },
  contacts: [
    "hang-support"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set a bar in a rack at about waist height.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-inverted-row",
          "ace-best-back"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "grip",
      "text": "Overhand, slightly wider than your shoulders, thumbs wrapped.",
      "zoom": "hand",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-best-back",
          "youdas-2016",
          "strengthlog-inverted-row",
          "hk-baechle-grip"
        ],
        "note": "c2, c14"
      }
    },
    {
      "kind": "position",
      "text": "Hang under it, body straight from head to heels.",
      "zoom": "body-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-inverted-row",
          "ace-best-back",
          "strengthlog-inverted-row"
        ],
        "note": "c3, c1"
      }
    },
    {
      "kind": "brace",
      "text": "Pull your shoulder blades back and down as you row.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-inverted-row",
          "ace-best-back"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "load",
      "text": "Too hard? Raise the bar. Too easy? Feet on a box.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-inverted-row",
          "catalyst-ring-row",
          "catalyst-inverted-row"
        ],
        "note": "c7"
      }
    }
  ],
  posture: [
    {
      "key": "line",
      "label": "Body rigid",
      "detail": "Body rigid and straight, heels to head.",
      "anchor": {
        "pose": "end",
        "at": "buttock"
      },
      "zoom": "body-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-inverted-row",
          "ace-best-back"
        ],
        "note": "c3"
      }
    },
    {
      "key": "arms",
      "label": "Straight arms",
      "detail": "Arms fully straight at the bottom.",
      "anchor": {
        "pose": "start",
        "at": "elbow.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-inverted-row",
          "ace-best-back"
        ],
        "note": "c3"
      }
    },
    {
      "key": "chest",
      "label": "Chest to bar",
      "detail": "Chest to the bar at the top.",
      "anchor": {
        "pose": "end",
        "at": "chest"
      },
      "zoom": "top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-inverted-row",
          "ace-best-back"
        ],
        "note": "c4"
      }
    },
    {
      "key": "blades",
      "label": "Blades back",
      "detail": "Shoulder blades back and down at the top.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-inverted-row",
          "ace-best-back"
        ],
        "note": "c3"
      }
    },
    {
      "key": "lower",
      "label": "Slow lowering",
      "detail": "Lower slowly, under control.",
      "anchor": {
        "pose": "start",
        "at": "hip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-inverted-row",
          "strengthlog-inverted-row"
        ],
        "note": "c5"
      }
    },
    {
      "key": "wrists",
      "label": "Wrists level",
      "detail": "Wrists not curled forward.",
      "anchor": {
        "pose": "end",
        "at": "wrist.r"
      },
      "zoom": "hand",
      "claim": {
        "tags": [
          "MECH",
          "CONVENTION"
        ],
        "sources": [
          "odriscoll-1992",
          "hand-key-bar"
        ],
        "note": "c15. The ext range is the bar key's row wristRange (ga:pull-base), a convention, not a card number."
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
      "key": "body-line",
      "chip": "Body line",
      "heading": "Body line",
      "kind": "posture",
      "feelRow": "low-back"
    },
    {
      "key": "top",
      "chip": "Top",
      "heading": "Top position",
      "kind": "posture"
    }
  ],
  chips: [
    "hand",
    "body-line",
    "top",
    "feel"
  ],
  copy: {
    "setupLine": "Hang under a waist-high bar, body straight from head to heels. Pull your chest to the bar.",
    "mistakeLine": "Don't let your hips sag. Raise the bar if you can't hold the line.",
    "cueLine": "Body rigid, chest to bar."
  },
  mistakes: [
    {
      "key": "sag",
      "title": "Hips sagging",
      "zoom": "body-line",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-inverted-row",
          "ace-best-back",
          "strengthlog-inverted-row"
        ],
        "note": "c3, c7"
      },
      "fix": "Keep your whole body rigid. Can't? Raise the bar."
    },
    {
      "key": "short",
      "title": "Stopping short of the bar",
      "zoom": "top",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "strengthlog-inverted-row",
          "ace-best-back"
        ],
        "note": "c4, c7"
      },
      "fix": "Pull until your chest touches the bar."
    },
    {
      "key": "drop",
      "title": "Dropping back down fast",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-inverted-row",
          "strengthlog-inverted-row"
        ],
        "note": "c5"
      },
      "fix": "Lower yourself with control to straight arms."
    }
  ],
  risks: [
    {
      "key": "joints",
      "text": "Stiff shoulders or arms? Rings let them move more freely than a bar.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "catalyst-ring-row"
        ],
        "note": "c13"
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
    "strengthlog-inverted-row",
    "ace-best-back",
    "catalyst-inverted-row",
    "catalyst-ring-row",
    "youdas-2016",
    "fenwick-2009",
    "youdas-2020",
    "hk-baechle-grip",
    "odriscoll-1992",
    "hand-key-bar",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/inverted_row.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

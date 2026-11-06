// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=52cf253b716c8db693ae8e2228f23053c534b11ff9a64a974ebbf1c1a59df3a0
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_cable_fly",
  name: "Cable Fly",
  hashes: { inputsSha256: "52cf253b716c8db693ae8e2228f23053c534b11ff9a64a974ebbf1c1a59df3a0", golden: "227beb75c13476c1e3e52f778e9cde006e473b3658f3c6765dea82069e750b3e" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"cable-fly-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"cable-fly-n-st-upper.l\" d=\"~#F12wyF1wVx1OBE1xIx1x7V227(D1Ha)3z4)1.1KtReOc.cIdE4ThF3Kw1B5X2eR5w1UB1De16E7.1B5YcAhUhAi_5AoO420000000100000001000020101000200010020001000000000100010000002000000000200000202\"/><path id=\"cable-fly-n-st-elbowcap.l\" d=\"~~()N1S_y1_t2\"/><path id=\"cable-fly-n-st-fore.l\" d=\"~#F12w(O1Y-z1*DO1IXz1O8I1S1lWz1z3V7)2*1I1Vq5-aX5O94.a_5Rqi*1N1T7w3Wz1Y2S1kO8P1nU8WgY8Se1Pg)800100001000002000001000000000220021000000000000100000000010110012000010010021000\"/><path id=\"cable-fly-n-st-fist.l\" d=\"~~!zX1!Yy1Ar0\"/><path id=\"cable-fly-n-st-upper.r\" d=\"~#F12YytPEvV)tz)uF7.126TB1DeS5w1Y2eNw1B5UhF3JdE4Pc.cNtRew2.1w4z4*D1Ha17y7V2E3IdzoO4zi_5zhUh00020010000020000000002000100001000200010102002000101000100000100202000002000000\"/><path id=\"cable-fly-n-st-elbowcap.r\" d=\"~~!xlS_y1_t2\"/><path id=\"cable-fly-n-st-fore.r\" d=\"~#F12()lJ.x1)Wmx(x1P8P1R1kVz1Y2U7w3(1N1Sqi!a_5P94_aX5Wq5(1I1W7)2Vz1z3R1lP8I1sT8Og)8Re1VgY801200101000000000110101010002002100200000000010000020000010020000020022000111010\"/><path id=\"cable-fly-n-st-fist.r\" d=\"~~Jzd!Yy1Ar0\"/><path id=\"cable-fly-n-g0-upper.l\" d=\"~#F12PxF1!Ux1)EE1RIx1E6O205wz1P9K3)3X1.1)nzdIczdEdK4XhA3xr*3R2gB5y1Yx1Nd16R6X1B8Wb(g(hwiw6Doz400002002100001010000212001000100000002000000001010220001000000111120000012101200\"/><path id=\"cable-fly-n-g0-elbowcap.l\" d=\"~~FEN1_Vy1_t2\"/><path id=\"cable-fly-n-g0-fore.l\" d=\"~#F12UAO1wVz1KSN1BSz1V6R1H1jFsO2x6z3K1I1.hlXa*5O93.aU5.h4R1H1z6(2DsJ3F1mV6H1-5P8NgD9Ue8YgV800000020000210000120000100000000202000010011000110101000000111000010100020000100\"/><path id=\"cable-fly-n-g0-fist.l\" d=\"~~WVU1!Yy1Ar0\"/><path id=\"cable-fly-n-g0-upper.r\" d=\"~#F12FytWEvE!t.)uS6X126Xx1NdD5y1S2gyr*3YhA3FdK4JczdwozdY1.1N3)3)y1P905F6O2hIeBoz4)hw6*g(h01000010110012000000000000020000000100011011000001010020021000101002002200001001\"/><path id=\"cable-fly-n-g0-elbowcap.r\" d=\"~~S_l_Vy1_t2\"/><path id=\"cable-fly-n-g0-fore.r\" d=\"~#F12(XmUWx1BHn.Yx1W6H1E1mBsJ3A6(2S1H1!h4!aU5P93Ya*5!hlN1I1y6z3EsO2G1jW6R1S5V8XgV8Te8KgD900011100000000200100210001001010000000000100100100200200100000000001001000000000\"/><path id=\"cable-fly-n-g0-fist.r\" d=\"~~SRf!Yy1Ar0\"/><path id=\"cable-fly-n-g1-upper.l\" d=\"~#F12!*E1NTx1VIE1OHx1K4I227Spy9x2-3vX1xbGazbBeXcV5*hJ1xfI1)1gB4y1_nYc0a.4X1OfA8yfNjNhY7No*100002200002001101000200001010101210000000000000010000100201001000000020210110000\"/><path id=\"cable-fly-n-g1-elbowcap.l\" d=\"~~!HJ1WSy1_t2\"/><path id=\"cable-fly-n-g1-fore.l\" d=\"~#F12yEK1_Rz1)!J1VNz1V3V1oj(fx2E3B3nK1z3hKaI6R9fzbF5z34tJ1O3_2Sf_3mm-3F1Be_7Ag_9Ueqwhx802001000001010100101010100000000120000010000020000000000000000110100200020011100\"/><path id=\"cable-fly-n-g1-fist.l\" d=\"~~N)O1!Yy1Ar0\"/><path id=\"cable-fly-n-g1-upper.r\" d=\"~#F12U(syGvORtRxv!4X10a-nYcD4y1w2gyfI1(hJ1YcV5AbBeybGaw1X1y2-3Rpy917N4I2J4*gKo*1KhY7xfNj00012010000100001000001010101011010101010010000000011010101200000000210012020000\"/><path id=\"cable-fly-n-g1-elbowcap.r\" d=\"~~(WnWSy1_t2\"/><path id=\"cable-fly-n-g1-fore.r\" d=\"~#F12yToSTx1I*oRVx1_3F1lmRf_3P3_2uJ1A34AbF5S9fNaI6A3hoK1F3B3*fx2njW3V1DdE9)gx8Teqzg_921000010100000000002000001000022000000000101010120000000002000020021011000100001\"/><path id=\"cable-fly-n-g1-fist.r\" d=\"~~_Ek!Yy1Ar0\"/><path id=\"cable-fly-n-g2-upper.l\" d=\"~#F12HRE1YHx1*GE1zyx1X1E265ycH9iz38T1!4.1*4Gh-9*9BhK5)1(4R16E3gA9Fc54E2V1VnT4!6UnFdUdPnH701001011010021000200010012000000000101000210100010120000012000000120001000012101\"/><path id=\"cable-fly-n-g2-elbowcap.l\" d=\"~~SSG1WRy1_t2\"/><path id=\"cable-fly-n-g2-fore.l\" d=\"~#F12DYG1HBz1T-G1xzz1sz1kdy3pA2z2y1tA9YaE2xcx6K7EbX4P8Dbx1qO2U1R1(2bcI1mBlOcP3PiD9JbJhF702001020011010100001000200000011000001001000010100100001001000020002000002000000\"/><path id=\"cable-fly-n-g2-fist.l\" d=\"~~y.G1!Yy1Ar0\"/><path id=\"cable-fly-n-g2-upper.r\" d=\"~#F12ySs_RvR_sGHvF2V164z9FcF3gS16w2(4DhK5_9*9(4Gh.4.17T1hz3xcH955Y1E2y4-nOnH7EdUd.6Un10001001000022200000000200010100001010220001000200110011012000010111010020001011\"/><path id=\"cable-fly-n-g2-elbowcap.r\" d=\"~~FOqWRy1_t2\"/><path id=\"cable-fly-n-g2-fore.r\" d=\"~#F12_Uqy(x1GXq)(x1J1mccS1(2P2U1y1qO8DbFbX4y6K7F2xcz9Yax1tz2z2x3pjdrz1_7GnIhF7B9JbO3Pi02002000010020000111102000010000210000000200010020000001102000020000000200000200\"/><path id=\"cable-fly-n-g2-fist.r\" d=\"~~DJq!Yy1Ar0\"/><path id=\"cable-fly-n-e-head\" d=\"~#D12Y(y1w)nO.x1R-nEgDc.aP9z8W2x4V2V2V2z4X2x4X6G1-6X2z8Y2z8H1-6y4X6A4X2W2V2y4V2A8W2!aP9FgDc0021010000000002000000000002000101000000000101000200000000000200000000011100\"/><path id=\"cable-fly-n-e-torso\" d=\"~#A22YAA1UDsKzA1Twr(aVhwn2_6O5O5G1zc(e)B1P9x4.aA8Joz8(ay4B8FgK5D8N5.a0Ik.a.x1GkT.1xnU.1xn!x1GkJk.a!a0B8N5EgK5x4B8A8(az8Joy4.awD1P9Ac(eP5G1-6O5)m2*aVhWH2wD10001010010000000102002000000010001020001000001000001000100000020000010000000010001000001000001000201000100000002102000000020000101002010\"/><path id=\"cable-fly-n-e-thigh.l\" d=\"~#F12_xz1HzJ1K_y1z!H1R2V9x12P8JU1J4z7(1O3T2-J1J8Ok-1)gKcEi.6IJ1X2)2T5x6U2wV1w13ixaKrE7XeJA1D3JuAmJw102000001010110000000000001002022002200000100100020110011000100101000000200000100\"/><path id=\"cable-fly-n-e-kneecap.l\" d=\"~~U)A1YBW1wD11\"/><path id=\"cable-fly-n-e-shank.l\" d=\"~#F12H(A1yFW1z)A1xwV1u)9w11H7!U1U4*6A2K3O6GY1S5.bjza.6Bb3TY1O2B3O5I6vJV1v2z2-9GaJa*9Plw1NiPcFk00000010000000100010000000002202000000200020011000010020000200000001001200002001\"/><path id=\"cable-fly-n-e-foot.l\" d=\"~#e2(TD1(*)1OHB1Gxw2xlHR1Gc-oXD1Bdz8-4SvXtAeOl1101010010010121011002020000\"/><path id=\"cable-fly-n-e-thigh.r\" d=\"~#F12D_uSVI1B.uVKH1hxav3T2wV1U5x6Y2)2!6IJ1NcEi_1)gI8OkU2-J1*1O3I4z7O8JU1y12S2V9Ep-czmJw1B3JuYeJA100000100210021100020000100001200121000010000000000200101011010020001000002000000\"/><path id=\"cable-fly-n-e-kneecap.r\" d=\"~~(RuYBW1wD11\"/><path id=\"cable-fly-n-e-shank.r\" d=\"~#F12UPuNzW1zWu-.U1A2-9w12w1JV1P5I6P2B34TY1!6BbkzaR5.bP6GY1z2K3T4*6G7!U1v1t)9Kby9OcFkvNi(9Pl00000200100001002001100010000000021200000000200020101000200000000110000022000100\"/><path id=\"cable-fly-n-e-foot.r\" d=\"~#e2SGv(*)1)Sw1Gxw2ylHR1Hc-oYD1BdA8-4RvXtzeOl2101010020010111012002020000\"/><path id=\"cable-fly-n-e-shcap.l\" d=\"~~WBE1FNw1WF10\"/><path id=\"cable-fly-n-e-upper.l\" d=\"~#F12FHE1S.vBOE1XTvJ1.186*3_bD33J11U1N7!eBaN6Ic7)hx7w3nE1V1T2K7wa71oE2z2-pEk!d-8(gcSo01100000020000200202000101000000000000000000001010000000000000010120000000010100\"/><path id=\"cable-fly-n-e-elbowcap.l\" d=\"~~yKD1WSy1_t2\"/><path id=\"cable-fly-n-e-fore.l\" d=\"~#F12wGE1PTx1BSE1KVx1J3D1jm-d_3D3_2qJ1A18DbA5P9hNaK6y1dmK1_2B3Bex2njH3T1FeR9zh-7Resxg!900000110002000001002000021012000001210000000000000000210002000210002000000000020\"/><path id=\"cable-fly-n-e-fist.l\" d=\"~~JHz1!Yy1Ar0\"/><path id=\"cable-fly-n-e-shcap.r\" d=\"~~NDsFNw1WF10\"/><path id=\"cable-fly-n-e-upper.r\" d=\"~#F12wIswxx1KEsKYw1nE281N7waW1T2oE1y7w38)hK6Ic.eBaT1N7I11B33(3_b76I1.1GmBdbSo_8(gFk!d01000000000000000000000000000000000000010100020210000002000020010001010000001001\"/><path id=\"cable-fly-n-e-elbowcap.r\" d=\"~~YUtWSy1_t2\"/><path id=\"cable-fly-n-e-fore.r\" d=\"~#F12WPu_Rz1XEuXNz1G3T1ojDex2-2B3lK1x1dKaK6O9hBbA5z18pJ1B3_2_d_3kmI3D1IfY7yg!9SesAh-711001000200200000000000000000200001001110000020010001000200100001000001010000200\"/><path id=\"cable-fly-n-e-fist.r\" d=\"~~!!w1!Yy1Ar0\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#cable-fly-n-dots)\"/>\n  <path class=\"floorline\" d=\"M36.4 339.5H321.6\"/><path class=\"eq\" d=\"~MPE3Pwy2L0)NS1Q0E6E6YFS1L)jF6QE60wkF6LF6YFS1Q0F6F6XFS1LwkE6QF60)jE6Z\"/><path class=\"eq\" d=\"~MY_7Pwy2L0)NS1Q0E6E6YFS1L)jF6QE60wkF6LF6YFS1Q0F6F6XFS1LwkE6QF60)jE6Z\"/><path class=\"eq\" d=\"~MwE2Y-gLPK50QF60EE5E6LE6XrQ0E6E6YrLEE5F6QE60FE5F6LF6YrQ0F6F6XrZ\"/><path class=\"eq\" d=\"~MPoYDy2LPH80QF60EA8E6LE64Q0E6E63LEA8F6QE60FA8F6LF63Q0F6F64Z\"/><path class=\"eq\" d=\"~MPV3YDy2LPP20QF60EH2E6LE6XrQ0E6E6YrLEH2F6QE60FH2F6LF6YrQ0F6F6XrZ\"/><path class=\"eq-thin\" d=\"~M!x4FYw2L0EBi\"/><path class=\"eq-thin\" d=\"~MU-5FYw2L0EBi\"/><path class=\"eq\" d=\"~MFO3PW_1Lw*20L)!2Yx6L)!2Xx6Z\"/><path class=\"eq-thin\" d=\"M17.8 328.46H32.68M17.8 325.36H32.68M17.8 322.26H32.68M17.8 319.16H32.68M17.8 316.06H32.68M17.8 312.96H32.68M17.8 309.86H32.68M17.8 306.76H32.68M17.8 303.66H32.68\"/><path class=\"eq-solid\" d=\"~~AR5PEv!y10\"/><path class=\"eq-pin\" d=\"~~YK6PEvF60\"/><path class=\"eq\" d=\"~~Uy4wRhAr0\"/><path class=\"eq-pin\" d=\"~~PX4wRhF60\"/><path class=\"eq\" d=\"~MPG)1Pwy2L0)NS1Q0E6E6YFS1L)jF6QE60wkF6LF6YFS1Q0F6F6XFS1LwkE6QF60)jE6Z\"/><path class=\"eq\" d=\"~MY!z2Pwy2L0)NS1Q0E6E6YFS1L)jF6QE60wkF6LF6YFS1Q0F6F6XFS1LwkE6QF60)jE6Z\"/><path class=\"eq\" d=\"~MwG(1Y-gLPK50QF60EE5E6LE6XrQ0E6E6YrLEE5F6QE60FE5F6LF6YrQ0F6F6XrZ\"/><path class=\"eq\" d=\"~MP_!1YDy2LPH80QF60EA8E6LE64Q0E6E63LEA8F6QE60FA8F6LF63Q0F6F64Z\"/><path class=\"eq\" d=\"~MPX)1YDy2LPP20QF60EH2E6LE6XrQ0E6E6YrLEH2F6QE60FH2F6LF6YrQ0F6F6XrZ\"/><path class=\"eq-thin\" d=\"~M!zw2FYw2L0EBi\"/><path class=\"eq-thin\" d=\"~MU.x2FYw2L0EBi\"/><path class=\"eq\" d=\"~MFR)1PW_1Lw*20L)!2Yx6L)!2Xx6Z\"/><path class=\"eq-thin\" d=\"M325.32 328.46H340.2M325.32 325.36H340.2M325.32 322.26H340.2M325.32 319.16H340.2M325.32 316.06H340.2M325.32 312.96H340.2M325.32 309.86H340.2M325.32 306.76H340.2M325.32 303.66H340.2\"/><path class=\"eq-solid\" d=\"~~UD(1PEv!y10\"/><path class=\"eq-pin\" d=\"~~Fz)1PEvF60\"/><path class=\"eq\" d=\"~~UAw2wRhAr0\"/><path class=\"eq-pin\" d=\"~~P-w2wRhF60\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-fly-n-st-upper.l\"/><use href=\"#cable-fly-n-st-elbowcap.l\"/><use href=\"#cable-fly-n-st-fore.l\"/><use href=\"#cable-fly-n-st-fist.l\"/><use href=\"#cable-fly-n-st-upper.r\"/><use href=\"#cable-fly-n-st-elbowcap.r\"/><use href=\"#cable-fly-n-st-fore.r\"/><use href=\"#cable-fly-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-fly-n-st-upper.l\"/><use href=\"#cable-fly-n-st-elbowcap.l\"/><use href=\"#cable-fly-n-st-fore.l\"/><use href=\"#cable-fly-n-st-fist.l\"/><use href=\"#cable-fly-n-st-upper.r\"/><use href=\"#cable-fly-n-st-elbowcap.r\"/><use href=\"#cable-fly-n-st-fore.r\"/><use href=\"#cable-fly-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-fly-n-g0-upper.l\"/><use href=\"#cable-fly-n-g0-elbowcap.l\"/><use href=\"#cable-fly-n-g0-fore.l\"/><use href=\"#cable-fly-n-g0-fist.l\"/><use href=\"#cable-fly-n-g0-upper.r\"/><use href=\"#cable-fly-n-g0-elbowcap.r\"/><use href=\"#cable-fly-n-g0-fore.r\"/><use href=\"#cable-fly-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-fly-n-g0-upper.l\"/><use href=\"#cable-fly-n-g0-elbowcap.l\"/><use href=\"#cable-fly-n-g0-fore.l\"/><use href=\"#cable-fly-n-g0-fist.l\"/><use href=\"#cable-fly-n-g0-upper.r\"/><use href=\"#cable-fly-n-g0-elbowcap.r\"/><use href=\"#cable-fly-n-g0-fore.r\"/><use href=\"#cable-fly-n-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-fly-n-g1-upper.l\"/><use href=\"#cable-fly-n-g1-elbowcap.l\"/><use href=\"#cable-fly-n-g1-fore.l\"/><use href=\"#cable-fly-n-g1-fist.l\"/><use href=\"#cable-fly-n-g1-upper.r\"/><use href=\"#cable-fly-n-g1-elbowcap.r\"/><use href=\"#cable-fly-n-g1-fore.r\"/><use href=\"#cable-fly-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-fly-n-g1-upper.l\"/><use href=\"#cable-fly-n-g1-elbowcap.l\"/><use href=\"#cable-fly-n-g1-fore.l\"/><use href=\"#cable-fly-n-g1-fist.l\"/><use href=\"#cable-fly-n-g1-upper.r\"/><use href=\"#cable-fly-n-g1-elbowcap.r\"/><use href=\"#cable-fly-n-g1-fore.r\"/><use href=\"#cable-fly-n-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-fly-n-g2-upper.l\"/><use href=\"#cable-fly-n-g2-elbowcap.l\"/><use href=\"#cable-fly-n-g2-fore.l\"/><use href=\"#cable-fly-n-g2-fist.l\"/><use href=\"#cable-fly-n-g2-upper.r\"/><use href=\"#cable-fly-n-g2-elbowcap.r\"/><use href=\"#cable-fly-n-g2-fore.r\"/><use href=\"#cable-fly-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-fly-n-g2-upper.l\"/><use href=\"#cable-fly-n-g2-elbowcap.l\"/><use href=\"#cable-fly-n-g2-fore.l\"/><use href=\"#cable-fly-n-g2-fist.l\"/><use href=\"#cable-fly-n-g2-upper.r\"/><use href=\"#cable-fly-n-g2-elbowcap.r\"/><use href=\"#cable-fly-n-g2-fore.r\"/><use href=\"#cable-fly-n-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MFO3_zJ1Lw*20L)!2FU3L)!2EU3Z\"/><path class=\"eq-thin\" d=\"M17.8 241.39H32.68M17.8 238.29H32.68M17.8 235.19H32.68M17.8 232.09H32.68M17.8 228.99H32.68\"/><path class=\"eq-cable\" d=\"~MAR5PEvL0OWdMIjArL0WXp\"/><path class=\"eq\" d=\"~MFR)1_zJ1Lw*20L)!2FU3L)!2EU3Z\"/><path class=\"eq-thin\" d=\"M325.32 241.39H340.2M325.32 238.29H340.2M325.32 235.19H340.2M325.32 232.09H340.2M325.32 228.99H340.2\"/><path class=\"eq-cable\" d=\"~MJJw2PEvL0OWdMJjArL0WXp\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-fly-n-e-head\"/><use href=\"#cable-fly-n-e-torso\"/><use href=\"#cable-fly-n-e-thigh.l\"/><use href=\"#cable-fly-n-e-kneecap.l\"/><use href=\"#cable-fly-n-e-shank.l\"/><use href=\"#cable-fly-n-e-foot.l\"/><use href=\"#cable-fly-n-e-thigh.r\"/><use href=\"#cable-fly-n-e-kneecap.r\"/><use href=\"#cable-fly-n-e-shank.r\"/><use href=\"#cable-fly-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#cable-fly-n-e-head\"/><use href=\"#cable-fly-n-e-torso\"/><use href=\"#cable-fly-n-e-thigh.l\"/><use href=\"#cable-fly-n-e-kneecap.l\"/><use href=\"#cable-fly-n-e-shank.l\"/><use href=\"#cable-fly-n-e-foot.l\"/><use href=\"#cable-fly-n-e-thigh.r\"/><use href=\"#cable-fly-n-e-kneecap.r\"/><use href=\"#cable-fly-n-e-shank.r\"/><use href=\"#cable-fly-n-e-foot.r\"/></g></g><path class=\"eq-cable\" d=\"~MP_v_Py1LOGpRD2\"/><path class=\"eq-cable\" d=\"~MwzD1_Py1LPGpRD2\"/><path class=\"eq-line\" d=\"~MwYx1JHx1LO*1ND1Lw.3Ag\"/><path class=\"eq-line\" d=\"~MPBA1JHx1LP*1ND1L)_3Ag\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-fly-n-e-shcap.l\"/><use href=\"#cable-fly-n-e-upper.l\"/><use href=\"#cable-fly-n-e-elbowcap.l\"/><use href=\"#cable-fly-n-e-fore.l\"/><use href=\"#cable-fly-n-e-fist.l\"/><use href=\"#cable-fly-n-e-shcap.r\"/><use href=\"#cable-fly-n-e-upper.r\"/><use href=\"#cable-fly-n-e-elbowcap.r\"/><use href=\"#cable-fly-n-e-fore.r\"/><use href=\"#cable-fly-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-fly-n-e-shcap.l\"/><use href=\"#cable-fly-n-e-upper.l\"/><use href=\"#cable-fly-n-e-elbowcap.l\"/><use href=\"#cable-fly-n-e-fore.l\"/><use href=\"#cable-fly-n-e-fist.l\"/><use href=\"#cable-fly-n-e-shcap.r\"/><use href=\"#cable-fly-n-e-upper.r\"/><use href=\"#cable-fly-n-e-elbowcap.r\"/><use href=\"#cable-fly-n-e-fore.r\"/><use href=\"#cable-fly-n-e-fist.r\"/></g></g><path class=\"eq-cable\" d=\"~MwR6FHw1LPGpSD2\"/><path class=\"eq-cable\" d=\"~MPJ)1FHw1LOGpSD2\"/><circle class=\"joint\" cx=\"207.1\" cy=\"166.12\" r=\"2.25\"/><circle class=\"joint\" cx=\"150.9\" cy=\"166.12\" r=\"2.25\"/><circle class=\"joint\" cx=\"201.43\" cy=\"177.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.57\" cy=\"177.07\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#(10WJg!Yy1.xg.Yy1001020Y10201020S10001020H10102010y10102010o0100020a00010202010000020001010000010000000000000200010001010100000000010100000101000000010000000102000101010000000101010001000002000001010100000\"/><path class=\"arrow\" d=\"~MHEw1!Yy1LOB1YiLPB1EY1Z\"/></g><path class=\"leader\" d=\"~M_*O1_-z1L0WY6\"/><circle class=\"anchor\" cx=\"245.41\" cy=\"183.33\" r=\"1.5\"/><path class=\"leader\" d=\"M179 178.06L225 134H235\"/><circle class=\"anchor\" cx=\"179\" cy=\"178.06\" r=\"1.5\"/><path class=\"leader\" d=\"~MP(d!Yy1L0U-7\"/><circle class=\"anchor\" cx=\"71.44\" cy=\"178.06\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"cable-fly-n-elbows\" data-key=\"elbows\" data-cue=\"Keep your elbows slightly bent at the same angle all rep.\" class=\"plate-callout two\" style=\"left:67.04%;top:59.78%\" aria-pressed=\"true\">Soft<br>elbows</button><button type=\"button\" id=\"cable-fly-n-meet\" data-key=\"meet\" data-cue=\"Bring your hands together in front and pause one second.\" class=\"plate-callout two\" style=\"left:64.25%;top:31.28%\" aria-pressed=\"false\">Hands<br>meet</button><button type=\"button\" id=\"cable-fly-n-chest\" data-key=\"chest\" data-cue=\"Open only until your hands are in line with your chest.\" class=\"plate-callout two\" style=\"left:11.17%;top:59.78%\" aria-pressed=\"false\">Stop at<br>chest</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"cable-fly-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"cable-fly-m-st-upper.l\" d=\"^0\"/><path id=\"cable-fly-m-st-elbowcap.l\" d=\"^1\"/><path id=\"cable-fly-m-st-fore.l\" d=\"^2\"/><path id=\"cable-fly-m-st-fist.l\" d=\"^3\"/><path id=\"cable-fly-m-st-upper.r\" d=\"^4\"/><path id=\"cable-fly-m-st-elbowcap.r\" d=\"^5\"/><path id=\"cable-fly-m-st-fore.r\" d=\"^6\"/><path id=\"cable-fly-m-st-fist.r\" d=\"^7\"/><path id=\"cable-fly-m-g0-upper.l\" d=\"^8\"/><path id=\"cable-fly-m-g0-elbowcap.l\" d=\"^9\"/><path id=\"cable-fly-m-g0-fore.l\" d=\"^10\"/><path id=\"cable-fly-m-g0-fist.l\" d=\"^11\"/><path id=\"cable-fly-m-g0-upper.r\" d=\"^12\"/><path id=\"cable-fly-m-g0-elbowcap.r\" d=\"^13\"/><path id=\"cable-fly-m-g0-fore.r\" d=\"^14\"/><path id=\"cable-fly-m-g0-fist.r\" d=\"^15\"/><path id=\"cable-fly-m-g1-upper.l\" d=\"^16\"/><path id=\"cable-fly-m-g1-elbowcap.l\" d=\"^17\"/><path id=\"cable-fly-m-g1-fore.l\" d=\"^18\"/><path id=\"cable-fly-m-g1-fist.l\" d=\"^19\"/><path id=\"cable-fly-m-g1-upper.r\" d=\"^20\"/><path id=\"cable-fly-m-g1-elbowcap.r\" d=\"^21\"/><path id=\"cable-fly-m-g1-fore.r\" d=\"^22\"/><path id=\"cable-fly-m-g1-fist.r\" d=\"^23\"/><path id=\"cable-fly-m-g2-upper.l\" d=\"^24\"/><path id=\"cable-fly-m-g2-elbowcap.l\" d=\"^25\"/><path id=\"cable-fly-m-g2-fore.l\" d=\"^26\"/><path id=\"cable-fly-m-g2-fist.l\" d=\"^27\"/><path id=\"cable-fly-m-g2-upper.r\" d=\"^28\"/><path id=\"cable-fly-m-g2-elbowcap.r\" d=\"^29\"/><path id=\"cable-fly-m-g2-fore.r\" d=\"^30\"/><path id=\"cable-fly-m-g2-fist.r\" d=\"^31\"/><path id=\"cable-fly-m-e-head\" d=\"^32\"/><path id=\"cable-fly-m-e-torso\" d=\"^33\"/><path id=\"cable-fly-m-e-thigh.l\" d=\"^34\"/><path id=\"cable-fly-m-e-kneecap.l\" d=\"^35\"/><path id=\"cable-fly-m-e-shank.l\" d=\"^36\"/><path id=\"cable-fly-m-e-foot.l\" d=\"^37\"/><path id=\"cable-fly-m-e-thigh.r\" d=\"^38\"/><path id=\"cable-fly-m-e-kneecap.r\" d=\"^39\"/><path id=\"cable-fly-m-e-shank.r\" d=\"^40\"/><path id=\"cable-fly-m-e-foot.r\" d=\"^41\"/><path id=\"cable-fly-m-e-shcap.l\" d=\"^42\"/><path id=\"cable-fly-m-e-upper.l\" d=\"^43\"/><path id=\"cable-fly-m-e-elbowcap.l\" d=\"^44\"/><path id=\"cable-fly-m-e-fore.l\" d=\"^45\"/><path id=\"cable-fly-m-e-fist.l\" d=\"^46\"/><path id=\"cable-fly-m-e-shcap.r\" d=\"^47\"/><path id=\"cable-fly-m-e-upper.r\" d=\"^48\"/><path id=\"cable-fly-m-e-elbowcap.r\" d=\"^49\"/><path id=\"cable-fly-m-e-fore.r\" d=\"^50\"/><path id=\"cable-fly-m-e-fist.r\" d=\"^51\"/><path id=\"cable-fly-m-m-upper.l\" d=\"~#F12(GE1Jwx1VxE1xNw1*1V483WdwnuB4c)1-1Teg*hB6RcVeKaRaBa.1t.3-1Aa_o74R2G4Gh.3lSoN8yhykDe20000001000000000000000000021001010100101210000000200000000000101000000002002000\"/><path id=\"cable-fly-m-m-elbowcap.l\" d=\"~~(_G1UzB1_t2\"/><path id=\"cable-fly-m-m-fore.l\" d=\"~#F12DzI1FDA1EVI1IOA1N6!3O14EuR7H5y5y1!1!jJ7F8A9w9A3Dc-1ykY6w2pJ7hIsBdvvJ7y1P6.6Vc.dXd*4Ti(201020000000020000000100000000020000002000001000000000020000010000100020000020001\"/><path id=\"cable-fly-m-m-upper.r\" d=\"~#F12WHsA!vGUsRHvS2G484za_o!3-1!1tSaBaWeKaD6Rcf*h_1Teb)1tB4Vdwn73(1V4I7xgxkDeK8yhmSo00101000000010000000200200000111112002000000001010101000010000100010000200101000\"/><path id=\"cable-fly-m-m-elbowcap.r\" d=\"~~!DqUzB1_t2\"/><path id=\"cable-fly-m-m-fore.r\" d=\"~#F12AOryxD1I.qIBD1I7y1w1vJsBdI7h)1pxkY6Bc-1)8A3E8A9.jJ7x1!1G5y5FuR7P14K6!3nH9Ui(2Yd*4Wc.d00200000100000000000010000020000100000000020000000100000000002010100020000020001\"/><path id=\"cable-fly-m-mf-head\" d=\"^32\"/><path id=\"cable-fly-m-mf-torso\" d=\"^33\"/><path id=\"cable-fly-m-mf-thigh.l\" d=\"^34\"/><path id=\"cable-fly-m-mf-kneecap.l\" d=\"^35\"/><path id=\"cable-fly-m-mf-shank.l\" d=\"^36\"/><path id=\"cable-fly-m-mf-foot.l\" d=\"^37\"/><path id=\"cable-fly-m-mf-shcap.l\" d=\"^42\"/><path id=\"cable-fly-m-mf-fist.l\" d=\"^46\"/><path id=\"cable-fly-m-mf-thigh.r\" d=\"^38\"/><path id=\"cable-fly-m-mf-kneecap.r\" d=\"^39\"/><path id=\"cable-fly-m-mf-shank.r\" d=\"^40\"/><path id=\"cable-fly-m-mf-foot.r\" d=\"^41\"/><path id=\"cable-fly-m-mf-shcap.r\" d=\"^47\"/><path id=\"cable-fly-m-mf-fist.r\" d=\"^51\"/><path id=\"cable-fly-m-mo-0\" d=\"^32\"/><path id=\"cable-fly-m-mo-1\" d=\"^33\"/><path id=\"cable-fly-m-mo-2\" d=\"^34\"/><path id=\"cable-fly-m-mo-3\" d=\"^35\"/><path id=\"cable-fly-m-mo-4\" d=\"^36\"/><path id=\"cable-fly-m-mo-5\" d=\"^37\"/><path id=\"cable-fly-m-mo-6\" d=\"^42\"/><path id=\"cable-fly-m-mo-7\" d=\"^43\"/><path id=\"cable-fly-m-mo-8\" d=\"^44\"/><path id=\"cable-fly-m-mo-9\" d=\"^45\"/><path id=\"cable-fly-m-mo-10\" d=\"^46\"/><path id=\"cable-fly-m-mo-11\" d=\"^38\"/><path id=\"cable-fly-m-mo-12\" d=\"^39\"/><path id=\"cable-fly-m-mo-13\" d=\"^40\"/><path id=\"cable-fly-m-mo-14\" d=\"^41\"/><path id=\"cable-fly-m-mo-15\" d=\"^47\"/><path id=\"cable-fly-m-mo-16\" d=\"^48\"/><path id=\"cable-fly-m-mo-17\" d=\"^49\"/><path id=\"cable-fly-m-mo-18\" d=\"^50\"/><path id=\"cable-fly-m-mo-19\" d=\"^51\"/><path id=\"cable-fly-m-mo-20\" d=\"^53\"/><path id=\"cable-fly-m-mo-21\" d=\"^54\"/><path id=\"cable-fly-m-mo-22\" d=\"^55\"/><path id=\"cable-fly-m-mo-23\" d=\"^56\"/><path id=\"cable-fly-m-mo-24\" d=\"^57\"/><path id=\"cable-fly-m-mo-25\" d=\"^60\"/><path id=\"cable-fly-m-mo-26\" d=\"^79\"/><path id=\"cable-fly-m-mo-27\" d=\"^62\"/><path id=\"cable-fly-m-mo-28\" d=\"^63\"/><path id=\"cable-fly-m-mo-29\" d=\"^64\"/><path id=\"cable-fly-m-mo-30\" d=\"^65\"/><path id=\"cable-fly-m-mo-31\" d=\"^66\"/><path id=\"cable-fly-m-mo-32\" d=\"^67\"/><path id=\"cable-fly-m-mo-33\" d=\"^68\"/><path id=\"cable-fly-m-mo-34\" d=\"^69\"/><path id=\"cable-fly-m-mo-35\" d=\"^70\"/><path id=\"cable-fly-m-mo-36\" d=\"^73\"/><path id=\"cable-fly-m-mo-37\" d=\"^82\"/><path id=\"cable-fly-m-mo-38\" d=\"^75\"/><path id=\"cable-fly-m-mo-39\" d=\"^76\"/><path id=\"cable-fly-m-mo-40\" d=\"^77\"/><path id=\"cable-fly-m-mo-41\" d=\"^78\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#cable-fly-m-dots)\"/>\n  <path class=\"floorline\" d=\"^52\"/><path class=\"eq\" d=\"^53\"/><path class=\"eq\" d=\"^54\"/><path class=\"eq\" d=\"^55\"/><path class=\"eq\" d=\"^56\"/><path class=\"eq\" d=\"^57\"/><path class=\"eq-thin\" d=\"^58\"/><path class=\"eq-thin\" d=\"^59\"/><path class=\"eq\" d=\"^60\"/><path class=\"eq-thin\" d=\"^61\"/><path class=\"eq-solid\" d=\"^62\"/><path class=\"eq-pin\" d=\"^63\"/><path class=\"eq\" d=\"^64\"/><path class=\"eq-pin\" d=\"^65\"/><path class=\"eq\" d=\"^66\"/><path class=\"eq\" d=\"^67\"/><path class=\"eq\" d=\"^68\"/><path class=\"eq\" d=\"^69\"/><path class=\"eq\" d=\"^70\"/><path class=\"eq-thin\" d=\"^71\"/><path class=\"eq-thin\" d=\"^72\"/><path class=\"eq\" d=\"^73\"/><path class=\"eq-thin\" d=\"^74\"/><path class=\"eq-solid\" d=\"^75\"/><path class=\"eq-pin\" d=\"^76\"/><path class=\"eq\" d=\"^77\"/><path class=\"eq-pin\" d=\"^78\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-fly-m-st-upper.l\"/><use href=\"#cable-fly-m-st-elbowcap.l\"/><use href=\"#cable-fly-m-st-fore.l\"/><use href=\"#cable-fly-m-st-fist.l\"/><use href=\"#cable-fly-m-st-upper.r\"/><use href=\"#cable-fly-m-st-elbowcap.r\"/><use href=\"#cable-fly-m-st-fore.r\"/><use href=\"#cable-fly-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-fly-m-st-upper.l\"/><use href=\"#cable-fly-m-st-elbowcap.l\"/><use href=\"#cable-fly-m-st-fore.l\"/><use href=\"#cable-fly-m-st-fist.l\"/><use href=\"#cable-fly-m-st-upper.r\"/><use href=\"#cable-fly-m-st-elbowcap.r\"/><use href=\"#cable-fly-m-st-fore.r\"/><use href=\"#cable-fly-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-fly-m-g0-upper.l\"/><use href=\"#cable-fly-m-g0-elbowcap.l\"/><use href=\"#cable-fly-m-g0-fore.l\"/><use href=\"#cable-fly-m-g0-fist.l\"/><use href=\"#cable-fly-m-g0-upper.r\"/><use href=\"#cable-fly-m-g0-elbowcap.r\"/><use href=\"#cable-fly-m-g0-fore.r\"/><use href=\"#cable-fly-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-fly-m-g0-upper.l\"/><use href=\"#cable-fly-m-g0-elbowcap.l\"/><use href=\"#cable-fly-m-g0-fore.l\"/><use href=\"#cable-fly-m-g0-fist.l\"/><use href=\"#cable-fly-m-g0-upper.r\"/><use href=\"#cable-fly-m-g0-elbowcap.r\"/><use href=\"#cable-fly-m-g0-fore.r\"/><use href=\"#cable-fly-m-g0-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-fly-m-g1-upper.l\"/><use href=\"#cable-fly-m-g1-elbowcap.l\"/><use href=\"#cable-fly-m-g1-fore.l\"/><use href=\"#cable-fly-m-g1-fist.l\"/><use href=\"#cable-fly-m-g1-upper.r\"/><use href=\"#cable-fly-m-g1-elbowcap.r\"/><use href=\"#cable-fly-m-g1-fore.r\"/><use href=\"#cable-fly-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-fly-m-g1-upper.l\"/><use href=\"#cable-fly-m-g1-elbowcap.l\"/><use href=\"#cable-fly-m-g1-fore.l\"/><use href=\"#cable-fly-m-g1-fist.l\"/><use href=\"#cable-fly-m-g1-upper.r\"/><use href=\"#cable-fly-m-g1-elbowcap.r\"/><use href=\"#cable-fly-m-g1-fore.r\"/><use href=\"#cable-fly-m-g1-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-fly-m-g2-upper.l\"/><use href=\"#cable-fly-m-g2-elbowcap.l\"/><use href=\"#cable-fly-m-g2-fore.l\"/><use href=\"#cable-fly-m-g2-fist.l\"/><use href=\"#cable-fly-m-g2-upper.r\"/><use href=\"#cable-fly-m-g2-elbowcap.r\"/><use href=\"#cable-fly-m-g2-fore.r\"/><use href=\"#cable-fly-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-fly-m-g2-upper.l\"/><use href=\"#cable-fly-m-g2-elbowcap.l\"/><use href=\"#cable-fly-m-g2-fore.l\"/><use href=\"#cable-fly-m-g2-fist.l\"/><use href=\"#cable-fly-m-g2-upper.r\"/><use href=\"#cable-fly-m-g2-elbowcap.r\"/><use href=\"#cable-fly-m-g2-fore.r\"/><use href=\"#cable-fly-m-g2-fist.r\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^79\"/><path class=\"eq-thin\" d=\"^80\"/><path class=\"eq-cable\" d=\"^81\"/><path class=\"eq\" d=\"^82\"/><path class=\"eq-thin\" d=\"^83\"/><path class=\"eq-cable\" d=\"^84\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-fly-m-e-head\"/><use href=\"#cable-fly-m-e-torso\"/><use href=\"#cable-fly-m-e-thigh.l\"/><use href=\"#cable-fly-m-e-kneecap.l\"/><use href=\"#cable-fly-m-e-shank.l\"/><use href=\"#cable-fly-m-e-foot.l\"/><use href=\"#cable-fly-m-e-thigh.r\"/><use href=\"#cable-fly-m-e-kneecap.r\"/><use href=\"#cable-fly-m-e-shank.r\"/><use href=\"#cable-fly-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#cable-fly-m-e-head\"/><use href=\"#cable-fly-m-e-torso\"/><use href=\"#cable-fly-m-e-thigh.l\"/><use href=\"#cable-fly-m-e-kneecap.l\"/><use href=\"#cable-fly-m-e-shank.l\"/><use href=\"#cable-fly-m-e-foot.l\"/><use href=\"#cable-fly-m-e-thigh.r\"/><use href=\"#cable-fly-m-e-kneecap.r\"/><use href=\"#cable-fly-m-e-shank.r\"/><use href=\"#cable-fly-m-e-foot.r\"/></g></g><path class=\"eq-cable\" d=\"^85\"/><path class=\"eq-cable\" d=\"^86\"/><path class=\"eq-line\" d=\"^87\"/><path class=\"eq-line\" d=\"^88\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-fly-m-e-shcap.l\"/><use href=\"#cable-fly-m-e-upper.l\"/><use href=\"#cable-fly-m-e-elbowcap.l\"/><use href=\"#cable-fly-m-e-fore.l\"/><use href=\"#cable-fly-m-e-fist.l\"/><use href=\"#cable-fly-m-e-shcap.r\"/><use href=\"#cable-fly-m-e-upper.r\"/><use href=\"#cable-fly-m-e-elbowcap.r\"/><use href=\"#cable-fly-m-e-fore.r\"/><use href=\"#cable-fly-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-fly-m-e-shcap.l\"/><use href=\"#cable-fly-m-e-upper.l\"/><use href=\"#cable-fly-m-e-elbowcap.l\"/><use href=\"#cable-fly-m-e-fore.l\"/><use href=\"#cable-fly-m-e-fist.l\"/><use href=\"#cable-fly-m-e-shcap.r\"/><use href=\"#cable-fly-m-e-upper.r\"/><use href=\"#cable-fly-m-e-elbowcap.r\"/><use href=\"#cable-fly-m-e-fore.r\"/><use href=\"#cable-fly-m-e-fist.r\"/></g></g><path class=\"eq-cable\" d=\"^89\"/><path class=\"eq-cable\" d=\"^90\"/><circle class=\"joint\" cx=\"207.1\" cy=\"166.12\" r=\"2.25\"/><circle class=\"joint\" cx=\"150.9\" cy=\"166.12\" r=\"2.25\"/><circle class=\"joint\" cx=\"201.43\" cy=\"177.07\" r=\"2.25\"/><circle class=\"joint\" cx=\"156.57\" cy=\"177.07\" r=\"2.25\"/></g><mask id=\"cable-fly-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#cable-fly-m-mf-head\" fill=\"#000\"/><use href=\"#cable-fly-m-mf-torso\" fill=\"#000\"/><use href=\"#cable-fly-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#cable-fly-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#cable-fly-m-mf-shank.l\" fill=\"#000\"/><use href=\"#cable-fly-m-mf-foot.l\" fill=\"#000\"/><use href=\"#cable-fly-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#cable-fly-m-m-upper.l\" fill=\"#000\"/><use href=\"#cable-fly-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#cable-fly-m-m-fore.l\" fill=\"#000\"/><use href=\"#cable-fly-m-mf-fist.l\" fill=\"#000\"/><use href=\"#cable-fly-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#cable-fly-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#cable-fly-m-mf-shank.r\" fill=\"#000\"/><use href=\"#cable-fly-m-mf-foot.r\" fill=\"#000\"/><use href=\"#cable-fly-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#cable-fly-m-m-upper.r\" fill=\"#000\"/><use href=\"#cable-fly-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#cable-fly-m-m-fore.r\" fill=\"#000\"/><use href=\"#cable-fly-m-mf-fist.r\" fill=\"#000\"/><use href=\"#cable-fly-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-32\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-33\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-34\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-35\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-36\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-37\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-38\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-39\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-40\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-fly-m-mo-41\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#cable-fly-m-mmask)\"><g class=\"u-stroke\"><use href=\"#cable-fly-m-m-upper.l\"/><use href=\"#cable-fly-m-m-elbowcap.l\"/><use href=\"#cable-fly-m-m-fore.l\"/><use href=\"#cable-fly-m-m-upper.r\"/><use href=\"#cable-fly-m-m-elbowcap.r\"/><use href=\"#cable-fly-m-m-fore.r\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MWYI1YTA1LU3NdLI5aLz5T1Lz4T3LK2.4LbI5LY1B5LS3x4L.x2IH4LWD2wF4LN5dLD5Y1Ly4S3LN2_4LaN5LT1D5LT3y4L!x2JH4\"/><path class=\"m-line\" d=\"~MD!z1ATz1LI9R5L!2z3L_3.1LF45Lw4J1LD3!2L_1_3L6F4LPF6DG2L.G6BB2L.2D3L-3_1LE46L)3I1Lz3.2L.1-3L7E4LKF6EG2\"/><path class=\"m-line\" d=\"~MUAsPTB1LO8wbLR3x4LX1B5LcI5LN2.4LA4T3LA5T1LJ5aLYD2*E4L.x2JH4LU3y4LU1D5L9N5LK2_4Lx4S3LB5Y1LK5dLVD2wF4\"/><path class=\"m-line\" d=\"~MWNx1S(x1LYaR1L5F4L-1_3LB3!2L)3J1LE45L-3.1L.2z3L.G6FB2LNF6EG2L8E4L!1-3LA3.2Lw4I1LF46L_3_1L!2D3L!G6BB2\"/><path class=\"m-arrow\" d=\"~M(!F1WSy1L_K3(P2MEv8LFv7LEF1Vt\"/><path class=\"m-arrow\" d=\"~MSwtWSy1L-K3(P2Mw9*tL)8(tLFF1Vt\"/><path class=\"leader m\" d=\"~MYYH1UzB1L0!H2\"/><path class=\"leader m\" d=\"~MYArUzB1L0!H2\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"cable-fly-m-press\" data-key=\"press\" data-cue=\"Your elbows bend deeply, turning the fly into a press.\" class=\"plate-callout two m\" style=\"left:57.54%;top:55.31%\" aria-pressed=\"true\">Elbows<br>bend</button><button type=\"button\" id=\"cable-fly-m-drop\" data-key=\"drop\" data-cue=\"Your elbows drop under your hands, as in a press.\" class=\"plate-callout two m\" style=\"left:21.23%;top:55.31%\" aria-pressed=\"false\">Elbows<br>drop</button>",
    ]);
    return {
      view: "front",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "elbows",
        cues: [{ key: "elbows", cue: "Keep your elbows slightly bent at the same angle all rep." }, { key: "meet", cue: "Bring your hands together in front and pause one second." }, { key: "chest", cue: "Open only until your hands are in line with your chest." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "press",
        cues: [{ key: "press", cue: "Your elbows bend deeply, turning the fly into a press." }, { key: "drop", cue: "Your elbows drop under your hands, as in a press." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Elbows bend</b><span>Your elbows bend deeply, turning the fly into a press.</span></li><li><b>Elbows drop</b><span>Your elbows drop under your hands, as in a press.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: close 1 second, hold 1 second, open 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Close</b><span>1 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Open</b><span>2 s</span></div></div></div>",
      alt: "Cable fly, front view. Standing braced between two cable columns with the pulleys just above shoulder height, the lifter sweeps the arms from open to the sides, in line with the chest, until the hands meet in front, elbows slightly bent the whole time.",
      mistakeAlt: "Cable Fly: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hold",
    "why": "D-SHIP-C3: the d-handle key lists cable_fly in GAPS (c4 names no bend direction); the grip copy carries c4 and c8.",
    "orientation": "neutral",
    "handle": "d-handle",
    "loadAxis": "across",
    "overBody": false,
    "width": {
      "text": "Open the arms only until your hands are in line with your chest.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-cable-fly"
        ],
        "note": "c7"
      }
    },
    "thumb": {
      "mode": "wrapped",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "hold-default"
        ],
        "note": "card grip.thumb and grip.handContact: no cable fly source gives them (hold archetype default); golden B's hold default, not a card claim, never shown"
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "exempt": "c4: the wrist is held at the same angle all rep; no source gives a range or a bend direction.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cable-fly"
        ],
        "note": "c4"
      }
    },
    "faults": [
      {
        "key": "wrist-bending",
        "label": "Wrist bending",
        "pose": {},
        "markers": [],
        "alt": "Wrist bending as the hands come together."
      }
    ],
    "gripLine": "Single handles, palms facing each other as the hands meet. Hold the wrist at the same angle all rep.",
    "cue": "Same elbow bend all rep."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set both pulleys at or slightly above shoulder height.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-standing-fly",
          "puregym-cable-fly"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Stand centred between them, pulleys slightly behind you.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cable-fly"
        ],
        "note": "c2"
      }
    },
    {
      "kind": "brace",
      "text": "Staggered or parallel stance. Brace your trunk, legs and glutes.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cable-fly",
          "puregym-cable-fly"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "load",
      "text": "Choose a weight that lets you keep a soft elbow bend.",
      "zoom": "fly-elbows",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-cable-fly"
        ],
        "note": "c7"
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
        "note": "c14"
      }
    }
  ],
  posture: [
    {
      "key": "centred",
      "label": "Centred",
      "detail": "Centred between the pulleys.",
      "anchor": {
        "pose": "start",
        "at": "hips"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cable-fly"
        ],
        "note": "c2"
      }
    },
    {
      "key": "still",
      "label": "Body still",
      "detail": "Trunk braced, body still, no swinging.",
      "anchor": {
        "pose": "start",
        "at": "chest"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cable-fly",
          "puregym-cable-fly"
        ],
        "note": "c3, c6"
      }
    },
    {
      "key": "elbows",
      "label": "Soft elbows",
      "detail": "Elbows slightly bent, same angle all rep.",
      "anchor": {
        "pose": "start",
        "at": "elbow.l"
      },
      "zoom": "fly-elbows",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cable-fly"
        ],
        "note": "c4"
      }
    },
    {
      "key": "meet",
      "label": "Hands meet",
      "detail": "Hands meet in front, then open only to the chest line.",
      "anchor": {
        "pose": "end",
        "at": "grips"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-standing-fly",
          "puregym-cable-fly"
        ],
        "note": "c5, c7"
      }
    },
    {
      "key": "palms",
      "label": "Palms facing",
      "detail": "Palms face each other when the handles meet.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-cable-fly"
        ],
        "note": "c8"
      }
    }
  ],
  zooms: [
    {
      "key": "fly-elbows",
      "chip": "Elbows",
      "heading": "Elbow bend",
      "kind": "posture"
    }
  ],
  chips: [
    "fly-elbows",
    "feel"
  ],
  copy: {
    "setupLine": "Set both pulleys at or slightly above shoulder height. Stand centred, pulleys slightly behind you.",
    "mistakeLine": "Keep the elbow bend fixed, so the fly never turns into a press.",
    "cueLine": "Soft elbows, hands meet in front."
  },
  mistakes: [
    {
      "key": "press",
      "title": "Bending elbows into a press",
      "zoom": "fly-elbows",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cable-fly"
        ],
        "note": "c6, c4"
      },
      "fix": "Keep the elbow bend fixed. Move at the shoulders."
    },
    {
      "key": "swing",
      "title": "Swinging with too much weight",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cable-fly",
          "puregym-cable-fly"
        ],
        "note": "c6, c7"
      },
      "fix": "Use a weight you can move slowly with a soft elbow bend."
    },
    {
      "key": "open",
      "title": "Arms opening too far back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "puregym-cable-fly"
        ],
        "note": "c7"
      },
      "fix": "Stop when the hands are in line with the chest."
    }
  ],
  risks: [
    {
      "key": "load",
      "text": "Cable flyes load the shoulder more than bench pressing. Keep your joints stable.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "schutz2022"
        ],
        "note": "c11"
      }
    },
    {
      "key": "shoulder",
      "text": "The shoulder is a common injury site in lifting.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "kolber2010"
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
    "ace-standing-fly",
    "puregym-cable-fly",
    "sl-cable-fly",
    "schutz2022",
    "acsm2009",
    "kolber2010",
    "hold-default",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/cable_fly.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

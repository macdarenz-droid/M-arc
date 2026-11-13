// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=5e30ea295b8b1209cd70576bcb46ab4e5524593735597c79adf6fea5e031833d
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_cable_lateral_raise",
  name: "Cable Lateral Raise",
  hashes: { inputsSha256: "5e30ea295b8b1209cd70576bcb46ab4e5524593735597c79adf6fea5e031833d", golden: "26883fc11f0f1837a2e935ff7c018a2dc5cea766c277e051d8fb2204986d3560" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"cable-lateral-raise-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"cable-lateral-raise-n-st-upper.l\" d=\"~#F12P(E1(AqVAF1zypY1V8a0T4wO1w4I5!1V2HbRA1Wc*gP2IgB7)j1BD1vB3E2E6I9FN173qX8-f-3IhDnG3Dm_9Hr10010101002200000020000101020000200000020001010002000000000012020011010121010100\"/><path id=\"cable-lateral-raise-n-st-elbowcap.l\" d=\"~~w)D1DOz1Dz10\"/><path id=\"cable-lateral-raise-n-st-fore.l\" d=\"~#F12_*D1SGz1RAE1ERy1y3X8gW1O2wE1Y4V7w2.1S4Br_8TbU1xbX4VdW3GrB1I2G2-8G9(B1x1S17K9R9O4IdWhT2whJ7wl00000201111000100000200000000010000000000020011010000000000120000001000001000000\"/><path id=\"cable-lateral-raise-n-st-fist.l\" d=\"~~PXB1DAJ1ww10\"/><path id=\"cable-lateral-raise-n-g0-upper.l\" d=\"~#F12H(E1JDq*yF1xFpN1O7a0R2!F1_3V4Y1I2A9IsFcIh(1IgX7XjE2Xtz1X2O2K5G7JF173gT7Kf*7TgWnT2FmSayr10022000010010002000000002000200020000000021000100021020000022121000012100000000\"/><path id=\"cable-lateral-raise-n-g0-elbowcap.l\" d=\"~~NJE1_Gy1Dz10\"/><path id=\"cable-lateral-raise-n-g0-fore.l\" d=\"~#F12NIE1wzy1-RE1GRx1(2K6gN1.1!sU4K5!1E1J3Bfy9Gby2xbI4XdP2OfI1X1E2X6-8SrtA1fx7z8Gb*dFhE3whY6Al01010002000021200001000000000000100010000000100000101110100111200020000200012021\"/><path id=\"cable-lateral-raise-n-g0-fist.l\" d=\"~~FGD1HVF1ww10\"/><path id=\"cable-lateral-raise-n-g1-upper.l\" d=\"~#F12SyF1Swr-YE1VGqB2-583Fg(sD1x5cR2X2EjA1Blx7*exhTcBdIeB2E1T4I2wc(u96)2K5-j.3K1wtS9FkJnFh10000002101000000000100220020001010000100010000200001002100000100000000100200200\"/><path id=\"cable-lateral-raise-n-g1-elbowcap.l\" d=\"~~FzI1JEw1Dz10\"/><path id=\"cable-lateral-raise-n-g1-fore.l\" d=\"~#F12_AI1FWw1RyI1XGw17-4y1e!aygU1B5y1T1I1x4A1KeO4EaOb.8z2X3*17-4I2P4(iby1G3K3-fIaR1Am!6_fUhSd02022000001000200000000000002002200210100010100100001000002000001000000012012100\"/><path id=\"cable-lateral-raise-n-g1-fist.l\" d=\"~~J(J1JBA1ww10\"/><path id=\"cable-lateral-raise-n-g2-upper.l\" d=\"~#F12A.F1FYrO)E1OIr-6I347FD1WdK3*4X1E2GoTgEdTgzfI6Bl_1Xs*5*2c.5sJA1yi3aB7R2BcNcDiUmSk_8(sT201000000020010111100121000010000200011000000100100001010000200000202001010000001\"/><path id=\"cable-lateral-raise-n-g2-elbowcap.l\" d=\"~~wUO1NOtDz10\"/><path id=\"cable-lateral-raise-n-g2-fore.l\" d=\"~#F12HGP1PRuR-O1.EuR5z4J15NrJ7E4T5p)1Vdz6E9xbIaG4KeS1)dB5)1s*6y1Yo_dsA1.6rxdU5DeAh(fN6ymG221010002000000200100021011020000010000020000200000000000001200000000001010000001\"/><path id=\"cable-lateral-raise-n-g2-fist.l\" d=\"~~HTV1(.vww10\"/><path id=\"cable-lateral-raise-n-e-head\" d=\"~#D12Y(y1yJgzVx1VBgEjNeXcDbT9D3-4B3B3B3-4B3-4x8R1*7B3T9D3T9S1*7_4x8_4B3D3B3_4B3U9D3YcDbFjNe0000100000001010020002101000002000000000000010000000000200022020000000200000\"/><path id=\"cable-lateral-raise-n-e-torso\" d=\"~#A22SIA1yJl)GA1E)j!c-kAr0y8K6K6R1IeUh-J1Db-4-cU9_sT9Yc_4R9DjI6U9J6-c0)n-c)E1)nID2BrJD2BrwF1)nwo-c_c0T9J6BjI6-4R9U9YcT9_s_4-c_J1DbJeUhN6R1x8K6zr0.c-kyY2_J10021011000002000100002000000002101010000000002200000000000002000000000100000000000001002000000000101110000000002000010100000200111000000\"/><path id=\"cable-lateral-raise-n-e-thigh.l\" d=\"~#F12Jyz1DAF1V-y1*VD1)2ObG14Aa_*1y5K8J2z4z3.U1!9zoz2zkXeRlx8EU1B3T3X6x7D3N(1D13k-bGw1T8OhwI1_3Yz1AqFD100002100110020010020000001200001200000000200020200010100000000101000020000010000\"/><path id=\"cable-lateral-raise-n-e-kneecap.l\" d=\"~~FIB1PwU1_J10\"/><path id=\"cable-lateral-raise-n-e-shank.l\" d=\"~#F12YGB1FzU1XHB1)TS1A1.bF11S8J(1P5z8P2z4V7Ky2P6)dj*bB8zd3*y2)2V3I6O7B1((1E14R2VbxcHcXbJpD1YlYe_n00000001010001000000011101000022000200010120002000011000000111000000001002200000\"/><path id=\"cable-lateral-raise-n-e-foot.l\" d=\"~#e2wGE1_P)1zYB1-U)1.oF_1KeItXK1OfV9T5NB1Bz1PgIp1010000000000200000020021000\"/><path id=\"cable-lateral-raise-n-e-shcap.l\" d=\"~~(*E1yJqwP10\"/><path id=\"cable-lateral-raise-n-e-upper.l\" d=\"~#F12(KG1y!rBHF1z.r)8d29SO1K2*5z3*2K1RD1X5VixaOg0ViyaRD1Y5*2N1*5A3SO1N22a)8evDgPpYdPm0PpXd00001000000101020000001012000000000000101001010000000002001000000000000200000000\"/><path id=\"cable-lateral-raise-n-e-elbowcap.l\" d=\"~~JUR1yJqDz10\"/><path id=\"cable-lateral-raise-n-e-fore.l\" d=\"~#F12NSS1PPrBYR1XGrR9z3!1f!G1J2K8X4)1*1TuX4TbR8BbR1Rdw5Xu-3K2F1I9F2_F1F9W1y1)98V2(9(hydwhN2(kV710101100002000000000000000012010100000020000000100000010000000101001011000000000\"/><path id=\"cable-lateral-raise-n-e-fist.l\" d=\"~~Hx.1(Vrww10\"/><path id=\"cable-lateral-raise-n-e-thigh.r\" d=\"~#F12Jyu(TE1Rzu*AD1j-bB13B3N(1Y6x7D3T3y8EU1YeRlA2zk.9zoA3.U1I2z4x5K8za_*1H14w3ObXtzfzqFD1-3Yz1PhwI100000000001111000212101210000010010010010000100001100021001100000000010000020000\"/><path id=\"cable-lateral-raise-n-e-kneecap.r\" d=\"~~UYtPwU1_J10\"/><path id=\"cable-lateral-raise-n-e-shank.r\" d=\"~#F12AXt_*T1V*t)NS1S2VbF14D1((1J6O7w3V34*y2D8zdk*bO6)dW7Ky2O2z4O5z8R8J(1E11z1.bKd_aXe_nB1YlYbJp00210100000011001000100101000200120000012101000000010001010000000000100220000000\"/><path id=\"cable-lateral-raise-n-e-foot.r\" d=\"~#e2PUu_P)1IBw1-U)1!oF_1NeItYK1OfW9T5KB1Bz1OgIp2020001010000200000010022000\"/><path id=\"cable-lateral-raise-n-e-shcap.r\" d=\"~~S)qyJqwP10\"/><path id=\"cable-lateral-raise-n-e-upper.r\" d=\"~#F12S)qyJqOwrIFpe.8a0N2SO1y3*5S1*2W5RD1yaVi0OgxaViX5RD1K1*2B3*5G2SO1b0d.8Egx1TdPp1PmYdPp00020000000001100000000111000000100000010100000000010010000002000000001010000000\"/><path id=\"cable-lateral-raise-n-e-elbowcap.r\" d=\"~~JJrWVz1Dz10\"/><path id=\"cable-lateral-raise-n-e-fore.r\" d=\"~#F12YHrWVz1XKrV-y1Y1Eam!1S3JI1P3G9U1G2e)w1!6Xc0Eb.6Xcd)w1T1G2R3G9K3JI1p!1T1EaEa5KaSj1FhSaSj00200010010100100000001010000000000000101000000000000101002000000000010000010000\"/><path id=\"cable-lateral-raise-n-e-fist.r\" d=\"~~SOrSNK1ww10\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#cable-lateral-raise-n-dots)\"/>\n  <path class=\"datum\" d=\"~M(KG1yJqLSAq0\"/><path class=\"floorline\" d=\"M25.4 339.5H332.6\"/><path class=\"eq\" d=\"~MyRbPwy2L0OT.1Q0E6E6FK.1L)qF6QE60wrF6LF6FK.1Q0F6F6EK.1LwrE6QF60)qE6Z\"/><path class=\"eq\" d=\"~MD_jPwy2L0OT.1Q0E6E6FK.1L)qF6QE60wrF6LF6FK.1Q0F6F6EK.1LwrE6QF60)qE6Z\"/><path class=\"eq\" d=\"~MSGaU*7LJH90QF60zA9E6LE6zA1Q0E6E6AA1LzA9F6QE60AA9F6LF6AA1Q0F6F6zA1Z\"/><path class=\"eq\" d=\"~MWS8YDy2LAYc0QF60.RcE6LE6B3Q0E6E6D3L.RcF6QE60!RcF6LF6D3Q0F6F6B3Z\"/><path class=\"eq\" d=\"~MNwcYDy2LU!50QF60IW5E6LE6zA1Q0E6E6AA1LIW5F6QE60JW5F6LF6AA1Q0F6F6zA1Z\"/><path class=\"eq-thin\" d=\"~MNyd!Ow2L0VKl\"/><path class=\"eq-thin\" d=\"~My.g!Ow2L0VKl\"/><path class=\"eq\" d=\"~MD_bHI-1LAG60LzG6SA7LzG6RA7Z\"/><path class=\"eq-thin\" d=\"M60.51 326.57H92.69M60.51 322.91H92.69M60.51 319.25H92.69M60.51 315.59H92.69M60.51 311.94H92.69M60.51 308.28H92.69M60.51 304.62H92.69M60.51 300.97H92.69M60.51 297.31H92.69\"/><path class=\"eq-solid\" d=\"~~yRiy-(1AG12\"/><path class=\"eq-pin\" d=\"~~(Tjy-(1F60\"/><path class=\"eq\" d=\"~~Y(dy-8ww10\"/><path class=\"eq-pin\" d=\"~~PYey-8F60\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-lateral-raise-n-st-upper.l\"/><use href=\"#cable-lateral-raise-n-st-elbowcap.l\"/><use href=\"#cable-lateral-raise-n-st-fore.l\"/><use href=\"#cable-lateral-raise-n-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-lateral-raise-n-st-upper.l\"/><use href=\"#cable-lateral-raise-n-st-elbowcap.l\"/><use href=\"#cable-lateral-raise-n-st-fore.l\"/><use href=\"#cable-lateral-raise-n-st-fist.l\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq\" d=\"~MFGE1HVF1Lx.1yz2LAW3zD4Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-lateral-raise-n-g0-upper.l\"/><use href=\"#cable-lateral-raise-n-g0-elbowcap.l\"/><use href=\"#cable-lateral-raise-n-g0-fore.l\"/><use href=\"#cable-lateral-raise-n-g0-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-lateral-raise-n-g0-upper.l\"/><use href=\"#cable-lateral-raise-n-g0-elbowcap.l\"/><use href=\"#cable-lateral-raise-n-g0-fore.l\"/><use href=\"#cable-lateral-raise-n-g0-fist.l\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq\" d=\"~MJ(K1JBA1L)*1A)1Lw!3E(3Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-lateral-raise-n-g1-upper.l\"/><use href=\"#cable-lateral-raise-n-g1-elbowcap.l\"/><use href=\"#cable-lateral-raise-n-g1-fore.l\"/><use href=\"#cable-lateral-raise-n-g1-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-lateral-raise-n-g1-upper.l\"/><use href=\"#cable-lateral-raise-n-g1-elbowcap.l\"/><use href=\"#cable-lateral-raise-n-g1-fore.l\"/><use href=\"#cable-lateral-raise-n-g1-fist.l\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq\" d=\"~MHTW1(.vLVz2A!1LJE4EY3Z\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-lateral-raise-n-g2-upper.l\"/><use href=\"#cable-lateral-raise-n-g2-elbowcap.l\"/><use href=\"#cable-lateral-raise-n-g2-fore.l\"/><use href=\"#cable-lateral-raise-n-g2-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-lateral-raise-n-g2-upper.l\"/><use href=\"#cable-lateral-raise-n-g2-elbowcap.l\"/><use href=\"#cable-lateral-raise-n-g2-fore.l\"/><use href=\"#cable-lateral-raise-n-g2-fist.l\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"~MD_bHBqLAG60LzG6AG4LzG6zG4Z\"/><path class=\"eq-thin\" d=\"M60.51 152.26H92.69M60.51 148.6H92.69M60.51 144.94H92.69M60.51 141.28H92.69M60.51 137.63H92.69\"/><path class=\"eq-cable\" d=\"~MyRiy-(1L0))V1MGS3ww1L0FJg\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-lateral-raise-n-e-head\"/><use href=\"#cable-lateral-raise-n-e-torso\"/><use href=\"#cable-lateral-raise-n-e-thigh.l\"/><use href=\"#cable-lateral-raise-n-e-kneecap.l\"/><use href=\"#cable-lateral-raise-n-e-shank.l\"/><use href=\"#cable-lateral-raise-n-e-foot.l\"/><use href=\"#cable-lateral-raise-n-e-shcap.l\"/><use href=\"#cable-lateral-raise-n-e-upper.l\"/><use href=\"#cable-lateral-raise-n-e-elbowcap.l\"/><use href=\"#cable-lateral-raise-n-e-fore.l\"/><use href=\"#cable-lateral-raise-n-e-fist.l\"/><use href=\"#cable-lateral-raise-n-e-thigh.r\"/><use href=\"#cable-lateral-raise-n-e-kneecap.r\"/><use href=\"#cable-lateral-raise-n-e-shank.r\"/><use href=\"#cable-lateral-raise-n-e-foot.r\"/><use href=\"#cable-lateral-raise-n-e-shcap.r\"/><use href=\"#cable-lateral-raise-n-e-upper.r\"/><use href=\"#cable-lateral-raise-n-e-elbowcap.r\"/><use href=\"#cable-lateral-raise-n-e-fore.r\"/><use href=\"#cable-lateral-raise-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-lateral-raise-n-e-head\"/><use href=\"#cable-lateral-raise-n-e-torso\"/><use href=\"#cable-lateral-raise-n-e-thigh.l\"/><use href=\"#cable-lateral-raise-n-e-kneecap.l\"/><use href=\"#cable-lateral-raise-n-e-shank.l\"/><use href=\"#cable-lateral-raise-n-e-foot.l\"/><use href=\"#cable-lateral-raise-n-e-shcap.l\"/><use href=\"#cable-lateral-raise-n-e-upper.l\"/><use href=\"#cable-lateral-raise-n-e-elbowcap.l\"/><use href=\"#cable-lateral-raise-n-e-fore.l\"/><use href=\"#cable-lateral-raise-n-e-fist.l\"/><use href=\"#cable-lateral-raise-n-e-thigh.r\"/><use href=\"#cable-lateral-raise-n-e-kneecap.r\"/><use href=\"#cable-lateral-raise-n-e-shank.r\"/><use href=\"#cable-lateral-raise-n-e-foot.r\"/><use href=\"#cable-lateral-raise-n-e-shcap.r\"/><use href=\"#cable-lateral-raise-n-e-upper.r\"/><use href=\"#cable-lateral-raise-n-e-elbowcap.r\"/><use href=\"#cable-lateral-raise-n-e-fore.r\"/><use href=\"#cable-lateral-raise-n-e-fist.r\"/></g></g><path class=\"eq-cable\" d=\"~MS!-1(RtLRDB1JBy1\"/><path class=\"eq\" d=\"~MHx!1(VrLXA2w!1LPG4)X3Z\"/><path class=\"eq-line m-line\" d=\"~MP(E1(AqL9Y1L00L01L02L00L00L00L00L01L02L00L00L00L20L11L02L00L00L00L00L01L02L20L10L00L20L10L00L01L22L10L00L20L10L00L20L11L22L00L10L20L10L20L00L10L20L00L10L21L12L42L01L12L20L11L22L11L22L01L12L21L12L21L02L11L22L11L22L11L22L01L12L20L11L22L01L12L21L12L21L12L21L02L11L22L11L22L01L12L21L12L40L01L02L01L02L01L02L01L02L01L02L01L02L01L02L01L02L00L01L02L01L02L01L02L01L02L01L02L01L02L01L02L01L02L01L02L00L01L22L00L10L20L00L00L11L22L00L10L20L00L00L10L20L00L00L11L22L00L10L20L00L00L10L20L00L10L20L01L02L10L20L00\"/><path class=\"eq-line m-line\" d=\"~M(BG1!Pz1LeX1L00L00L20L10L00L20L10L00L00L20L10L00L20L10L00L00L20L10L00L00L20L10L00L20L10L00L00L20L10L00L20L10L00L00L10L20L10L02L21L10L20L10L20L12L21L10L20L10L20L10L22L11L20L10L00L20L10L22L11L20L10L20L10L20L12L21L10L20L10L20L10L10L00L00L21L12L00L00L01L02L00L01L02L20L10L01L02L00L00L01L02L20L11L02L00L00L01L02L00L20L11L02L00L01L02L00L00L01L22L10L00L01L12L00L00L00L00L00L00L02L01L00L00L00L00L00L00L00L00L10L20L00L10L20L00L10L21L02L10L20L00L00L10L00L20L10L20L10L20L10L20L10L20L10L00L20L10L21L12L20L10L20Ln2L00L00L00L00L00L00L00L00L00L01L02L00L00L00L00L00L00L00L00L00L00L00Lz1qL20L10L00L20L10L00L20L10L00L20L10L20L10L00L22L11L00L3D1L12L20L10L00L21L12L20L10L00L21L12L00L20L10L21L12L00Lsy1L12L21L12L00L21L12L21L12L01L22L11L22L11L22L11L02L21L12L21L12L01\"/><path class=\"eq-line m-line\" d=\"~M_*D1SGz1LfY1L20L11L02L00L20L10L00L01L22L10L00L00L21L02L20L11L02L21L12L20L11L22L21L12L20L01L02L00L01L02L00L01L44L00L00L00L00L00L00L02L01L00L00L00L00L20L10L00L00L00L00L00L00L00L00L00L00L00L00L20L10L00L00L40L20L10L21L12L20L10L01L22L10L20L11L22L10L20L10L21L12L20L10L21L12L00L20L11L22L10L40L01L12L20L00L11L22L10L20L01L12L20L00L11L22L10L20L01L12L20L00L11L22L10L20L01Lc3L20L10L20L10L20L00L10L20L10L20L10LD1nL00L10L20L10L20L00L10L20L4B1L21L00L12L21L10L22L01L10LpvL01L02L01L02L21L12L01L02L01L02L01Lb7L00L00L21L12L00L20L10L01L02L20L10L01L02L20L10L00L01L22L10L00L01L22L10L00L00L01L10L02L01L02L01L20L12L01L02L01L02L01L20L12L01L02L01L00L22L11L02L01L02L01L00L22L53L02L11L22L01L00L02L01L02L01L02L01L00L02L01L02L01L02L01L00L02L01L02L01L12L21L00L02L01L02L01L32L10L20L10L02L21L10L20L10L20L30L01L02L00L00L01L02L00L00L11L00L00L00L00L00L00L02L01L00L00L00L00L00Lh6\"/><path class=\"eq-line m-line\" d=\"~MPXE1DAJ1LbY1L20L10L00L20L10L20Ll7L00L01L02L00L21L12LffL00L20L10L01L02L20L9jL01L02L01L02L00L01L0jL01L00L02L01L02L01L8jL00L22L11L00L00L20LefL02L01L00L02L01L20Li7L20L10L00L20L10L20Lk0L20L10L20L00L10L20LiaL21L00L00L02L01L00LegL20L02L01L10L20L00L8mL01L00L02L01L02L01L0oL01L02L01L02L00L01L9mL20L00L00L11L22L00LfgL10L21L02L00L00L01LlaL20L10L20L00L10\"/><path class=\"eq-line m-line\" d=\"~MPXD1DAJ1Lzx2Dw2LFy4Iw4Lzx2Dw2\"/><circle class=\"joint\" cx=\"212.15\" cy=\"135.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"135.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"259.77\" cy=\"135.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"182.67\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#D20YGD1_wH1BAD1EIH1S19P17S19J15N15F13F15D11y11w10u1o0q2i2k0c4e264820206107690d4f2h2n0p2t0v0x11E10I1300000000000121000000000010010100000000000000100000000000000001001001011010210110000020002000000010001200000000010000000000000001010002100000\"/><path class=\"arrow\" d=\"~MAN.1DYsLGiWB1LR4Iz2Z\"/></g><path class=\"leader\" d=\"M214.53 222.79L245 248H255\"/><circle class=\"anchor\" cx=\"214.53\" cy=\"222.79\" r=\"1.5\"/><path class=\"leader\" d=\"M259.77 135.05L249.68 82H239.68\"/><circle class=\"anchor\" cx=\"259.77\" cy=\"135.05\" r=\"1.5\"/><path class=\"leader\" d=\"~MNOw2yJqL0RN6\"/><circle class=\"anchor\" cx=\"330.15\" cy=\"135.05\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"cable-lateral-raise-n-tight\" data-key=\"tight\" data-cue=\"Step away from the machine so the cable is tight.\" class=\"plate-callout two\" style=\"left:69.83%;top:63.13%\" aria-pressed=\"true\">Cable<br>tight</button><button type=\"button\" id=\"cable-lateral-raise-n-elbow\" data-key=\"elbow\" data-cue=\"Raise your arm out to the side, elbow leading the hand.\" class=\"plate-callout two\" style=\"left:53.07%;top:16.76%\" aria-pressed=\"false\">Elbow<br>leads</button><button type=\"button\" id=\"cable-lateral-raise-n-height\" data-key=\"height\" data-cue=\"Stop when your arm is parallel with the floor.\" class=\"plate-callout two\" style=\"left:77.09%;top:17.32%\" aria-pressed=\"false\">Shoulder<br>height</button>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"cable-lateral-raise-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"cable-lateral-raise-m-st-upper.l\" d=\"^0\"/><path id=\"cable-lateral-raise-m-st-elbowcap.l\" d=\"^1\"/><path id=\"cable-lateral-raise-m-st-fore.l\" d=\"^2\"/><path id=\"cable-lateral-raise-m-st-fist.l\" d=\"^3\"/><path id=\"cable-lateral-raise-m-g0-upper.l\" d=\"^4\"/><path id=\"cable-lateral-raise-m-g0-elbowcap.l\" d=\"^5\"/><path id=\"cable-lateral-raise-m-g0-fore.l\" d=\"^6\"/><path id=\"cable-lateral-raise-m-g0-fist.l\" d=\"^7\"/><path id=\"cable-lateral-raise-m-g1-upper.l\" d=\"^8\"/><path id=\"cable-lateral-raise-m-g1-elbowcap.l\" d=\"^9\"/><path id=\"cable-lateral-raise-m-g1-fore.l\" d=\"^10\"/><path id=\"cable-lateral-raise-m-g1-fist.l\" d=\"^11\"/><path id=\"cable-lateral-raise-m-g2-upper.l\" d=\"^12\"/><path id=\"cable-lateral-raise-m-g2-elbowcap.l\" d=\"^13\"/><path id=\"cable-lateral-raise-m-g2-fore.l\" d=\"^14\"/><path id=\"cable-lateral-raise-m-g2-fist.l\" d=\"^15\"/><path id=\"cable-lateral-raise-m-e-head\" d=\"^16\"/><path id=\"cable-lateral-raise-m-e-torso\" d=\"^17\"/><path id=\"cable-lateral-raise-m-e-thigh.l\" d=\"^18\"/><path id=\"cable-lateral-raise-m-e-kneecap.l\" d=\"^19\"/><path id=\"cable-lateral-raise-m-e-shank.l\" d=\"^20\"/><path id=\"cable-lateral-raise-m-e-foot.l\" d=\"^21\"/><path id=\"cable-lateral-raise-m-e-shcap.l\" d=\"^22\"/><path id=\"cable-lateral-raise-m-e-upper.l\" d=\"^23\"/><path id=\"cable-lateral-raise-m-e-elbowcap.l\" d=\"^24\"/><path id=\"cable-lateral-raise-m-e-fore.l\" d=\"^25\"/><path id=\"cable-lateral-raise-m-e-fist.l\" d=\"^26\"/><path id=\"cable-lateral-raise-m-e-thigh.r\" d=\"^27\"/><path id=\"cable-lateral-raise-m-e-kneecap.r\" d=\"^28\"/><path id=\"cable-lateral-raise-m-e-shank.r\" d=\"^29\"/><path id=\"cable-lateral-raise-m-e-foot.r\" d=\"^30\"/><path id=\"cable-lateral-raise-m-e-shcap.r\" d=\"^31\"/><path id=\"cable-lateral-raise-m-e-upper.r\" d=\"^32\"/><path id=\"cable-lateral-raise-m-e-elbowcap.r\" d=\"^33\"/><path id=\"cable-lateral-raise-m-e-fore.r\" d=\"^34\"/><path id=\"cable-lateral-raise-m-e-fist.r\" d=\"^35\"/><path id=\"cable-lateral-raise-m-m-upper.l\" d=\"~#F12J(G1D-rO!F1RAsR8W219!I1OiT6tG3bzD1Y7xl)2OfU5ze_fEy1UiE2J2R4w5SK1xe4aB8N3P4UfWsD4ylX7JjRl00000000000200002001000000000000012000020000200000000001212101001210101001000000\"/><path id=\"cable-lateral-raise-m-m-elbowcap.l\" d=\"~~JyR1HDnDz10\"/><path id=\"cable-lateral-raise-m-m-fore.l\" d=\"~#F12FKS1FHoGSR1.Jo)9aU1x1yF1zcO9T1O2x1Ku(5*d)3*aJ2xbH9Eu!6-1w2x8J5SG1E5(1cI9Y3uAaHlF6_gT3whGe00000020000001002000001010000222000001000000010002020002000210000110101000002002\"/><path id=\"cable-lateral-raise-m-m-fist.l\" d=\"~~YI_1YElww10\"/><path id=\"cable-lateral-raise-m-m-eq0\" d=\"~MYI.1YElL)(1Ay2Lw(3EA4Z\"/><path id=\"cable-lateral-raise-m-mf-head\" d=\"^16\"/><path id=\"cable-lateral-raise-m-mf-torso\" d=\"^17\"/><path id=\"cable-lateral-raise-m-mf-thigh.l\" d=\"^18\"/><path id=\"cable-lateral-raise-m-mf-kneecap.l\" d=\"^19\"/><path id=\"cable-lateral-raise-m-mf-shank.l\" d=\"^20\"/><path id=\"cable-lateral-raise-m-mf-foot.l\" d=\"^21\"/><path id=\"cable-lateral-raise-m-mf-shcap.l\" d=\"^22\"/><path id=\"cable-lateral-raise-m-mf-thigh.r\" d=\"^27\"/><path id=\"cable-lateral-raise-m-mf-kneecap.r\" d=\"^28\"/><path id=\"cable-lateral-raise-m-mf-shank.r\" d=\"^29\"/><path id=\"cable-lateral-raise-m-mf-foot.r\" d=\"^30\"/><path id=\"cable-lateral-raise-m-mf-shcap.r\" d=\"^31\"/><path id=\"cable-lateral-raise-m-mf-upper.r\" d=\"^32\"/><path id=\"cable-lateral-raise-m-mf-elbowcap.r\" d=\"^33\"/><path id=\"cable-lateral-raise-m-mf-fore.r\" d=\"^34\"/><path id=\"cable-lateral-raise-m-mf-fist.r\" d=\"^35\"/><path id=\"cable-lateral-raise-m-mo-0\" d=\"^16\"/><path id=\"cable-lateral-raise-m-mo-1\" d=\"^17\"/><path id=\"cable-lateral-raise-m-mo-2\" d=\"^18\"/><path id=\"cable-lateral-raise-m-mo-3\" d=\"^19\"/><path id=\"cable-lateral-raise-m-mo-4\" d=\"^20\"/><path id=\"cable-lateral-raise-m-mo-5\" d=\"^21\"/><path id=\"cable-lateral-raise-m-mo-6\" d=\"^22\"/><path id=\"cable-lateral-raise-m-mo-7\" d=\"^23\"/><path id=\"cable-lateral-raise-m-mo-8\" d=\"^24\"/><path id=\"cable-lateral-raise-m-mo-9\" d=\"^25\"/><path id=\"cable-lateral-raise-m-mo-10\" d=\"^26\"/><path id=\"cable-lateral-raise-m-mo-11\" d=\"^27\"/><path id=\"cable-lateral-raise-m-mo-12\" d=\"^28\"/><path id=\"cable-lateral-raise-m-mo-13\" d=\"^29\"/><path id=\"cable-lateral-raise-m-mo-14\" d=\"^30\"/><path id=\"cable-lateral-raise-m-mo-15\" d=\"^31\"/><path id=\"cable-lateral-raise-m-mo-16\" d=\"^32\"/><path id=\"cable-lateral-raise-m-mo-17\" d=\"^33\"/><path id=\"cable-lateral-raise-m-mo-18\" d=\"^34\"/><path id=\"cable-lateral-raise-m-mo-19\" d=\"^35\"/><path id=\"cable-lateral-raise-m-mo-20\" d=\"^38\"/><path id=\"cable-lateral-raise-m-mo-21\" d=\"^39\"/><path id=\"cable-lateral-raise-m-mo-22\" d=\"^40\"/><path id=\"cable-lateral-raise-m-mo-23\" d=\"^41\"/><path id=\"cable-lateral-raise-m-mo-24\" d=\"^42\"/><path id=\"cable-lateral-raise-m-mo-25\" d=\"^45\"/><path id=\"cable-lateral-raise-m-mo-26\" d=\"^54\"/><path id=\"cable-lateral-raise-m-mo-27\" d=\"^47\"/><path id=\"cable-lateral-raise-m-mo-28\" d=\"^48\"/><path id=\"cable-lateral-raise-m-mo-29\" d=\"^49\"/><path id=\"cable-lateral-raise-m-mo-30\" d=\"^50\"/><path id=\"cable-lateral-raise-m-mo-31\" d=\"^58\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#cable-lateral-raise-m-dots)\"/>\n  <path class=\"datum\" d=\"^36\"/><path class=\"floorline\" d=\"^37\"/><path class=\"eq\" d=\"^38\"/><path class=\"eq\" d=\"^39\"/><path class=\"eq\" d=\"^40\"/><path class=\"eq\" d=\"^41\"/><path class=\"eq\" d=\"^42\"/><path class=\"eq-thin\" d=\"^43\"/><path class=\"eq-thin\" d=\"^44\"/><path class=\"eq\" d=\"^45\"/><path class=\"eq-thin\" d=\"^46\"/><path class=\"eq-solid\" d=\"^47\"/><path class=\"eq-pin\" d=\"^48\"/><path class=\"eq\" d=\"^49\"/><path class=\"eq-pin\" d=\"^50\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-lateral-raise-m-st-upper.l\"/><use href=\"#cable-lateral-raise-m-st-elbowcap.l\"/><use href=\"#cable-lateral-raise-m-st-fore.l\"/><use href=\"#cable-lateral-raise-m-st-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-lateral-raise-m-st-upper.l\"/><use href=\"#cable-lateral-raise-m-st-elbowcap.l\"/><use href=\"#cable-lateral-raise-m-st-fore.l\"/><use href=\"#cable-lateral-raise-m-st-fist.l\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><path class=\"eq\" d=\"^51\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-lateral-raise-m-g0-upper.l\"/><use href=\"#cable-lateral-raise-m-g0-elbowcap.l\"/><use href=\"#cable-lateral-raise-m-g0-fore.l\"/><use href=\"#cable-lateral-raise-m-g0-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-lateral-raise-m-g0-upper.l\"/><use href=\"#cable-lateral-raise-m-g0-elbowcap.l\"/><use href=\"#cable-lateral-raise-m-g0-fore.l\"/><use href=\"#cable-lateral-raise-m-g0-fist.l\"/></g></g></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><path class=\"eq\" d=\"^52\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-lateral-raise-m-g1-upper.l\"/><use href=\"#cable-lateral-raise-m-g1-elbowcap.l\"/><use href=\"#cable-lateral-raise-m-g1-fore.l\"/><use href=\"#cable-lateral-raise-m-g1-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-lateral-raise-m-g1-upper.l\"/><use href=\"#cable-lateral-raise-m-g1-elbowcap.l\"/><use href=\"#cable-lateral-raise-m-g1-fore.l\"/><use href=\"#cable-lateral-raise-m-g1-fist.l\"/></g></g></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><path class=\"eq\" d=\"^53\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-lateral-raise-m-g2-upper.l\"/><use href=\"#cable-lateral-raise-m-g2-elbowcap.l\"/><use href=\"#cable-lateral-raise-m-g2-fore.l\"/><use href=\"#cable-lateral-raise-m-g2-fist.l\"/></g><g class=\"u-fill\"><use href=\"#cable-lateral-raise-m-g2-upper.l\"/><use href=\"#cable-lateral-raise-m-g2-elbowcap.l\"/><use href=\"#cable-lateral-raise-m-g2-fore.l\"/><use href=\"#cable-lateral-raise-m-g2-fist.l\"/></g></g></g><g class=\"pose-end\"><path class=\"eq\" d=\"^54\"/><path class=\"eq-thin\" d=\"^55\"/><path class=\"eq-cable\" d=\"^56\"/><g class=\"\"><g class=\"u-stroke\"><use href=\"#cable-lateral-raise-m-e-head\"/><use href=\"#cable-lateral-raise-m-e-torso\"/><use href=\"#cable-lateral-raise-m-e-thigh.l\"/><use href=\"#cable-lateral-raise-m-e-kneecap.l\"/><use href=\"#cable-lateral-raise-m-e-shank.l\"/><use href=\"#cable-lateral-raise-m-e-foot.l\"/><use href=\"#cable-lateral-raise-m-e-shcap.l\"/><use href=\"#cable-lateral-raise-m-e-upper.l\"/><use href=\"#cable-lateral-raise-m-e-elbowcap.l\"/><use href=\"#cable-lateral-raise-m-e-fore.l\"/><use href=\"#cable-lateral-raise-m-e-fist.l\"/><use href=\"#cable-lateral-raise-m-e-thigh.r\"/><use href=\"#cable-lateral-raise-m-e-kneecap.r\"/><use href=\"#cable-lateral-raise-m-e-shank.r\"/><use href=\"#cable-lateral-raise-m-e-foot.r\"/><use href=\"#cable-lateral-raise-m-e-shcap.r\"/><use href=\"#cable-lateral-raise-m-e-upper.r\"/><use href=\"#cable-lateral-raise-m-e-elbowcap.r\"/><use href=\"#cable-lateral-raise-m-e-fore.r\"/><use href=\"#cable-lateral-raise-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#cable-lateral-raise-m-e-head\"/><use href=\"#cable-lateral-raise-m-e-torso\"/><use href=\"#cable-lateral-raise-m-e-thigh.l\"/><use href=\"#cable-lateral-raise-m-e-kneecap.l\"/><use href=\"#cable-lateral-raise-m-e-shank.l\"/><use href=\"#cable-lateral-raise-m-e-foot.l\"/><use href=\"#cable-lateral-raise-m-e-shcap.l\"/><use href=\"#cable-lateral-raise-m-e-upper.l\"/><use href=\"#cable-lateral-raise-m-e-elbowcap.l\"/><use href=\"#cable-lateral-raise-m-e-fore.l\"/><use href=\"#cable-lateral-raise-m-e-fist.l\"/><use href=\"#cable-lateral-raise-m-e-thigh.r\"/><use href=\"#cable-lateral-raise-m-e-kneecap.r\"/><use href=\"#cable-lateral-raise-m-e-shank.r\"/><use href=\"#cable-lateral-raise-m-e-foot.r\"/><use href=\"#cable-lateral-raise-m-e-shcap.r\"/><use href=\"#cable-lateral-raise-m-e-upper.r\"/><use href=\"#cable-lateral-raise-m-e-elbowcap.r\"/><use href=\"#cable-lateral-raise-m-e-fore.r\"/><use href=\"#cable-lateral-raise-m-e-fist.r\"/></g></g><path class=\"eq-cable\" d=\"^57\"/><path class=\"eq\" d=\"^58\"/><path class=\"eq-line m-line\" d=\"^59\"/><path class=\"eq-line m-line\" d=\"^60\"/><path class=\"eq-line m-line\" d=\"^61\"/><path class=\"eq-line m-line\" d=\"^62\"/><path class=\"eq-line m-line\" d=\"^63\"/><circle class=\"joint\" cx=\"212.15\" cy=\"135.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"135.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"259.77\" cy=\"135.05\" r=\"2.25\"/><circle class=\"joint\" cx=\"145.85\" cy=\"182.67\" r=\"2.25\"/></g><mask id=\"cable-lateral-raise-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#cable-lateral-raise-m-mf-head\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mf-torso\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mf-thigh.l\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mf-kneecap.l\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mf-shank.l\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mf-foot.l\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mf-shcap.l\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-m-upper.l\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-m-fore.l\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-m-fist.l\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mf-thigh.r\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mf-kneecap.r\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mf-shank.r\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mf-foot.r\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mf-shcap.r\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mf-upper.r\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mf-elbowcap.r\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mf-fore.r\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mf-fist.r\" fill=\"#000\"/><use href=\"#cable-lateral-raise-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-24\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-25\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-26\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-27\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-28\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-29\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-30\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#cable-lateral-raise-m-mo-31\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#cable-lateral-raise-m-mmask)\"><g class=\"u-stroke\"><use href=\"#cable-lateral-raise-m-m-upper.l\"/><use href=\"#cable-lateral-raise-m-m-elbowcap.l\"/><use href=\"#cable-lateral-raise-m-m-fore.l\"/><use href=\"#cable-lateral-raise-m-m-fist.l\"/><use href=\"#cable-lateral-raise-m-m-eq0\"/></g></g><g class=\"mistake-layer\"><path class=\"m-line\" d=\"~MPWkF.*1LFWA1IRD1\"/><path class=\"leader m\" d=\"~MUBS1HDnL0G!2\"/><path class=\"leader m\" d=\"~MYI.1YElL0XT5\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Front view</span><button type=\"button\" id=\"cable-lateral-raise-m-above\" data-key=\"above\" data-cue=\"The arm rises above shoulder height.\" class=\"plate-callout two m\" style=\"left:55.87%;top:17.88%\" aria-pressed=\"true\">Above<br>shoulder</button><button type=\"button\" id=\"cable-lateral-raise-m-past\" data-key=\"past\" data-cue=\"The upper arm goes past level, beyond 90 degrees.\" class=\"plate-callout two m\" style=\"left:79.33%;top:11.17%\" aria-pressed=\"false\">Beyond<br>90°</button>",
    ]);
    return {
      view: "front",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "tight",
        cues: [{ key: "tight", cue: "Step away from the machine so the cable is tight." }, { key: "elbow", cue: "Raise your arm out to the side, elbow leading the hand." }, { key: "height", cue: "Stop when your arm is parallel with the floor." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "above",
        cues: [{ key: "above", cue: "The arm rises above shoulder height." }, { key: "past", cue: "The upper arm goes past level, beyond 90 degrees." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Above shoulder</b><span>The arm rises above shoulder height.</span></li><li><b>Beyond 90°</b><span>The upper arm goes past level, beyond 90 degrees.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: raise 2 seconds, hold 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Raise</b><span>2 s</span></div></div><div class=\"tempo-seg\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Hold</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Cable lateral raise, front view. Standing side-on to a cable column, a single handle from the low pulley in the outside hand, the cable across the front of the body, the arm rises out to the side, elbow slightly bent and leading, until the upper arm is level with the shoulder.",
      mistakeAlt: "Cable Lateral Raise: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "hold",
    "why": "D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c2 and c4.",
    "handle": "d-handle",
    "loadAxis": "across",
    "overBody": false,
    "width": {
      "text": "One arm, the outside hand, the one farther from the machine.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-cable-lat-raise",
          "sl-cable-lat-raise",
          "mo-cable-lat-raise"
        ],
        "note": "c2, c4"
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
        "note": "card grip.thumb, grip.handContact, grip.wrist: \"Not given by any source read\"; golden B's hold default from the card parent dumbbell_lateral_raise (Q-W6-3), not a card claim, never shown"
      }
    },
    "contact": "mid-palm",
    "wrist": {
      "exempt": "Card grip.wrist: not given by any source read; no wrist position or range is sourced.",
      "claim": {
        "tags": [
          "CONVENTION"
        ],
        "sources": [
          "hold-default"
        ],
        "note": "card grip.thumb, grip.handContact, grip.wrist: \"Not given by any source read\"; golden B's hold default from the card parent dumbbell_lateral_raise (Q-W6-3), not a card claim, never shown"
      }
    },
    "faults": [],
    "gripLine": "One single handle in your outside hand, the one farther from the machine.",
    "cue": "Elbow leads, stop at shoulder height."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "adjust",
      "text": "Set the pulley at its lowest point with a single handle.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-cable-lat-raise",
          "sl-cable-lat-raise",
          "fv-cable-lat-raise"
        ],
        "note": "c1"
      }
    },
    {
      "kind": "position",
      "text": "Stand upright, side-on to the machine. Handle in your outside hand.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "fv-cable-lat-raise",
          "sl-cable-lat-raise",
          "mo-cable-lat-raise"
        ],
        "note": "c2, c12"
      }
    },
    {
      "kind": "position",
      "text": "Step away until the cable is tight.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-cable-lat-raise",
          "fv-cable-lat-raise"
        ],
        "note": "c3"
      }
    },
    {
      "kind": "brace",
      "text": "Let the arm hang down, elbow slightly bent. Brace your torso.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-cable-lat-raise"
        ],
        "note": "c4"
      }
    },
    {
      "kind": "load",
      "text": "Pick a lighter weight than you think.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-cable-lat-raise",
          "mo-cable-lat-raise"
        ],
        "note": "c14"
      }
    }
  ],
  posture: [
    {
      "key": "tight",
      "label": "Cable tight",
      "detail": "A step away, cable tight at the start.",
      "anchor": {
        "pose": "start",
        "at": "grip.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-cable-lat-raise",
          "fv-cable-lat-raise"
        ],
        "note": "c3"
      }
    },
    {
      "key": "lead",
      "label": "Elbow leads",
      "detail": "Lead with the elbow. Don't pull the handle up.",
      "anchor": {
        "pose": "end",
        "at": "elbow.l"
      },
      "zoom": "clr-elbow-lead",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-cable-lat-raise",
          "fv-cable-lat-raise"
        ],
        "note": "c6, c13"
      }
    },
    {
      "key": "height",
      "label": "Shoulder height",
      "detail": "Stop when your arm is parallel with the floor.",
      "anchor": {
        "pose": "end",
        "at": "elbow.l"
      },
      "zoom": "clr-top-height",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-cable-lat-raise",
          "sl-cable-lat-raise"
        ],
        "note": "c7"
      }
    },
    {
      "key": "bend",
      "label": "Soft elbow",
      "detail": "Keep the elbow slightly bent. Don't lock it.",
      "anchor": {
        "pose": "start",
        "at": "elbow.l"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-cable-lat-raise"
        ],
        "note": "c9"
      }
    },
    {
      "key": "upright",
      "label": "Stay upright",
      "detail": "Stay upright. Brace so you don't lean.",
      "anchor": {
        "pose": "end",
        "at": "sternum"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-cable-lat-raise",
          "fv-cable-lat-raise"
        ],
        "note": "c12"
      }
    }
  ],
  zooms: [
    {
      "key": "clr-top-height",
      "chip": "Top",
      "heading": "Top height",
      "kind": "posture",
      "feelRow": "above"
    },
    {
      "key": "clr-elbow-lead",
      "chip": "Elbow",
      "heading": "Elbow lead",
      "kind": "posture"
    }
  ],
  chips: [
    "clr-top-height",
    "clr-elbow-lead",
    "feel"
  ],
  copy: {
    "setupLine": "Pulley at its lowest point, single handle. Stand side-on, a step away, cable tight.",
    "mistakeLine": "Stop when your arm is parallel with the floor. Keep the shoulder down.",
    "cueLine": "Elbow leads, stop at shoulder height."
  },
  mistakes: [
    {
      "key": "above",
      "title": "Raising above shoulder height",
      "zoom": "clr-top-height",
      "claim": {
        "tags": [
          "CONSENSUS",
          "DATA"
        ],
        "sources": [
          "kolber2014",
          "mo-cable-lat-raise",
          "sl-cable-lat-raise"
        ],
        "note": "c19, c7"
      },
      "fix": "Stop when your arm is parallel with the floor."
    },
    {
      "key": "swing",
      "title": "Swinging with momentum",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-cable-lat-raise",
          "fv-cable-lat-raise",
          "sl-cable-lat-raise"
        ],
        "note": "c11, c14, c8"
      },
      "fix": "Go lighter and lift without swinging. Breathe in, lower with control."
    },
    {
      "key": "shrug",
      "title": "Shrugging the shoulder",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "mo-cable-lat-raise"
        ],
        "note": "c10"
      },
      "fix": "Keep your shoulder down as the arm rises."
    }
  ],
  risks: [
    {
      "key": "above",
      "text": "Raises above shoulder height are linked with signs of shoulder pinching.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "kolber2014"
        ],
        "note": "c19"
      }
    },
    {
      "key": "forward",
      "text": "Raising straight out to the side hurts? Raise a little forward.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "larsen2025"
        ],
        "note": "c20"
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
    "mo-cable-lat-raise",
    "sl-cable-lat-raise",
    "fv-cable-lat-raise",
    "larsen2025",
    "kolber2014",
    "hold-default",
    "nhs-shoulder-pain"
  ],
  research: {
    "card": "docs/research/howto/cards/cable_lateral_raise.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

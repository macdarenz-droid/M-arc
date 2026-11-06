// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=ab52d7061f25c1fdacf0408725f51e9b9a1581edb04749f1630e658109ce45cf
import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: "lib_barbell_row",
  name: "Barbell Row",
  hashes: { inputsSha256: "ab52d7061f25c1fdacf0408725f51e9b9a1581edb04749f1630e658109ce45cf", golden: "c632740ce86dab4d29e7812a76fc19bb07fd2f150e2301264df8d73443881e80" },
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
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"barbell-row-n-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"barbell-row-n-st-shcap.r\" d=\"~~HKB1P(x1wP10\"/><path id=\"barbell-row-n-st-upper.r\" d=\"~#F12DPB1DNx1B*B1)Jw1N3E8a6)dNK1y5O4J2G2Nizy1_fBeW5Kfz3xlU7xD19G3tT6Ki!I193U2O8-eT6TlJjV7AlF4Ws00001000001000010000000010100000001001110000000002000000000000000010001000000000\"/><path id=\"barbell-row-n-st-elbowcap.r\" d=\"~~wVy1_VH1Dz10\"/><path id=\"barbell-row-n-st-fore.r\" d=\"~#F12HUy1WKH1K*y1xTG1(3T9cw2E6AI1P5G8D2*1U7xw1S9.aP2)a.3)d_6Bw1vV2K1.9)cSG1z1W1iKa-9I2TeYgX3Yg!5Pl01000200200012000200201000022001000011101001011010010100000101000000010100001000\"/><path id=\"barbell-row-n-st-fist.r\" d=\"~~wTw1(DU1ww10\"/><path id=\"barbell-row-n-g0-shcap.r\" d=\"~~NDB1USx1wP10\"/><path id=\"barbell-row-n-g0-upper.r\" d=\"~#F12!TB1HRw1-ID1X-vy6X5a6Kt(x1D6.1w3vAs.kFkR6Nb.b_5Kk_j*su)2S1B6Xw1Pu73P5K6K9OdTr!8RfDg.7!r20101001010010000000021000000100012000100012000000000000000101000200000200000002\"/><path id=\"barbell-row-n-g0-elbowcap.r\" d=\"~~wRvD!E1Dz10\"/><path id=\"barbell-row-n-g0-fore.r\" d=\"~#F12SOv()E1XOvOAE1kxaw1W1W7YG1W2I9H1K2X2RvS5KdB1zbx8xcV3Kv-1z2K4V8qPH1h!1X2-9Ba4K8SkW1DhNcJi01001000000000200210100000000002100000020000220000020000100011000000121210000101\"/><path id=\"barbell-row-n-g0-fist.r\" d=\"~~wTw1WIR1ww10\"/><path id=\"barbell-row-n-g1-shcap.r\" d=\"~~U)A1YDx1wP10\"/><path id=\"barbell-row-n-g1-upper.r\" d=\"~#F12_RB1Axw1xGD1.Ov(5B468Xs_pY5fY2byoTb!kX3(cEaP8Oj_gVkuV2!1I5Vvwm75J5*4.3OhOsA5Th!dRbUq00000100000000000210002200000000012100111000100022000100101100002200000000100000\"/><path id=\"barbell-row-n-g1-elbowcap.r\" d=\"~~NOvJ!B1Dz10\"/><path id=\"barbell-row-n-g1-fore.r\" d=\"~#F12yNvWwD1zNvTEB1kE9uP1w8wD1P2V8J1E2V2zrF5OdE1zbG8.bT3)q.1.1K4.7w1_D1fU1-2-8Oax2z8Uky2AhUcFi01000011100200100000010100000000020200000200002100220020010000000000002200001000\"/><path id=\"barbell-row-n-g1-fist.r\" d=\"~~wTw1PPN1ww10\"/><path id=\"barbell-row-n-g2-shcap.r\" d=\"~~YYA1!_w1wP10\"/><path id=\"barbell-row-n-g2-upper.r\" d=\"~#F12_OB1!RvGAD1RDvF5R246KpHi(4kP28SgI3FlB1AeO8YaEiWaGduB2W1X4*rDe59_4I3(2-k.sS1EjUbXewp00200000000000000121001010002120020200010100020000000010001010110100000110000020\"/><path id=\"barbell-row-n-g2-elbowcap.r\" d=\"~~W(vDwA1Dz10\"/><path id=\"barbell-row-n-g2-fore.r\" d=\"~#F12A*vYyA1R(vRJz1A1E8sP1!5Wx1w3O7N1)1v.l!5BdnEbX7Ec*1.lX1V1x4x7z1Fy1jP1E2*7RaK5z9FkD1Dh_bYi20010020022000100010000022100001000020000020000000000021002000000000000000000100\"/><path id=\"barbell-row-n-g2-fist.r\" d=\"~~wTw1FVI1ww10\"/><path id=\"barbell-row-n-e-thigh.l\" d=\"~#F12FxpFFG1-KoG*E1V5IaB1aPo!-1(2K9H1R4Tf.S1!3Xp.6)iGjOhKkxR1.3X2E8I5(hD!1A1dB2VbKx1j-6(K1Dc_x1Py1wv00101201010220101000000011002200000001101000000020000000000101100000000020200000\"/><path id=\"barbell-row-n-e-kneecap.l\" d=\"~~Dxu_(T1_J10\"/><path id=\"barbell-row-n-e-shank.l\" d=\"~#F12U)tW(T1RzuOOS1(1XbD11W4y)1w6.7Y2)3O3.y2H7Vd0*bE7Tdw4)y2-2*3*5.7)4w)1E11-1-b.cUbGdWo0YlAdWo01002010100200000001000002010100100020200000000002002001101111100012000200011101\"/><path id=\"barbell-row-n-e-foot.l\" d=\"~#o2FPuAB)1.xvzB(1_cF3Shx8Pp)nF-2B3OJ2-4ED1)7.n2KG1Y4Bb-cYsBbImSp020022010100101101000000000220000101100000011110\"/><path id=\"barbell-row-n-e-shcap.l\" d=\"~~!RA1wOw1wP10\"/><path id=\"barbell-row-n-e-upper.l\" d=\"~#F12wSB1WxvKzD1R!uN4x128xmHa(3(1!1s!7J3wlF3SfK5JeVfy4O7u.1!1)3Vn_53bA4.1FcKlVsR4BlP7RjHl00000000000000000010001000002120002000020002002000121001000012000010100200010120\"/><path id=\"barbell-row-n-e-elbowcap.l\" d=\"~~_Ow1yxy1Dz10\"/><path id=\"barbell-row-n-e-fore.l\" d=\"~#F12DNw1yxy1BRw1TKx1Y1z7mF1S3DuP3R6U1R1eEh!6Xc0Eb.6XcdEhT1R1O3R6R3DulF1X1z7BaX8KaSj0FhNaSj00200101000000000100021000000000000000100002000100101000010110000020000000001000\"/><path id=\"barbell-row-n-e-fist.l\" d=\"~~wTw1y_F1ww10\"/><path id=\"barbell-row-n-e-head\" d=\"~#w12HGO1WNsxYN1R*qBq)6.h-b.2IbX59P4z8Y5TcSaIqPdE2P7B6R9Tg_k_d_gAgU7WjE4UoKhD80000222000110010020200010000120000000000101010000000000200000010\"/><path id=\"barbell-row-n-e-torso\" d=\"~#_12WKH1ARtV_I1EytoObR1X2OayhlSbO7yjP2A5NiVfG3Ikxbx8AdHaAhNdwqA9PoJ4UaT1P8VfFdOH1!f-o.7R2K5esWdG5_6gxf.e.9El!4I2W8AgP5G5_6GB2xY100000000000011000000000100000000111110010000102000020000000000000121000002000001200000000000200000010000000200101100\"/><path id=\"barbell-row-n-e-thigh.r\" d=\"^20\"/><path id=\"barbell-row-n-e-kneecap.r\" d=\"^21\"/><path id=\"barbell-row-n-e-shank.r\" d=\"^22\"/><path id=\"barbell-row-n-e-foot.r\" d=\"^23\"/><path id=\"barbell-row-n-e-shcap.r\" d=\"^24\"/><path id=\"barbell-row-n-e-upper.r\" d=\"^25\"/><path id=\"barbell-row-n-e-elbowcap.r\" d=\"^26\"/><path id=\"barbell-row-n-e-fore.r\" d=\"^27\"/><path id=\"barbell-row-n-e-fist.r\" d=\"^28\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#barbell-row-n-dots)\"/>\n  <path class=\"datum\" d=\"~MwTx1FBA2L0ENY1\"/><path class=\"floorline\" d=\"M62.29 339.5H281.71\"/><path class=\"arc measure\" d=\"M160.96 266.05L154.19 247.23A20 20 0 0 0 160.9 286.05Z\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-row-n-st-shcap.r\"/><use href=\"#barbell-row-n-st-upper.r\"/><use href=\"#barbell-row-n-st-elbowcap.r\"/><use href=\"#barbell-row-n-st-fore.r\"/><use href=\"#barbell-row-n-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-row-n-st-shcap.r\"/><use href=\"#barbell-row-n-st-upper.r\"/><use href=\"#barbell-row-n-st-elbowcap.r\"/><use href=\"#barbell-row-n-st-fore.r\"/><use href=\"#barbell-row-n-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-row-n-g0-shcap.r\"/><use href=\"#barbell-row-n-g0-upper.r\"/><use href=\"#barbell-row-n-g0-elbowcap.r\"/><use href=\"#barbell-row-n-g0-fore.r\"/><use href=\"#barbell-row-n-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-row-n-g0-shcap.r\"/><use href=\"#barbell-row-n-g0-upper.r\"/><use href=\"#barbell-row-n-g0-elbowcap.r\"/><use href=\"#barbell-row-n-g0-fore.r\"/><use href=\"#barbell-row-n-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~~A!w1WIR1!m1\"/><path class=\"eq-pin\" d=\"~~YJx1WIR1F60\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-row-n-g1-shcap.r\"/><use href=\"#barbell-row-n-g1-upper.r\"/><use href=\"#barbell-row-n-g1-elbowcap.r\"/><use href=\"#barbell-row-n-g1-fore.r\"/><use href=\"#barbell-row-n-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-row-n-g1-shcap.r\"/><use href=\"#barbell-row-n-g1-upper.r\"/><use href=\"#barbell-row-n-g1-elbowcap.r\"/><use href=\"#barbell-row-n-g1-fore.r\"/><use href=\"#barbell-row-n-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~~A!w1PPN1!m1\"/><path class=\"eq-pin\" d=\"~~YJx1PPN1F60\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-row-n-g2-shcap.r\"/><use href=\"#barbell-row-n-g2-upper.r\"/><use href=\"#barbell-row-n-g2-elbowcap.r\"/><use href=\"#barbell-row-n-g2-fore.r\"/><use href=\"#barbell-row-n-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-row-n-g2-shcap.r\"/><use href=\"#barbell-row-n-g2-upper.r\"/><use href=\"#barbell-row-n-g2-elbowcap.r\"/><use href=\"#barbell-row-n-g2-fore.r\"/><use href=\"#barbell-row-n-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"~~A!w1FVI1!m1\"/><path class=\"eq-pin\" d=\"~~YJx1FVI1F60\"/></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#barbell-row-n-e-thigh.l\"/><use href=\"#barbell-row-n-e-kneecap.l\"/><use href=\"#barbell-row-n-e-shank.l\"/><use href=\"#barbell-row-n-e-foot.l\"/><use href=\"#barbell-row-n-e-shcap.l\"/><use href=\"#barbell-row-n-e-upper.l\"/><use href=\"#barbell-row-n-e-elbowcap.l\"/><use href=\"#barbell-row-n-e-fore.l\"/><use href=\"#barbell-row-n-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#barbell-row-n-e-thigh.l\"/><use href=\"#barbell-row-n-e-kneecap.l\"/><use href=\"#barbell-row-n-e-shank.l\"/><use href=\"#barbell-row-n-e-foot.l\"/><use href=\"#barbell-row-n-e-shcap.l\"/><use href=\"#barbell-row-n-e-upper.l\"/><use href=\"#barbell-row-n-e-elbowcap.l\"/><use href=\"#barbell-row-n-e-fore.l\"/><use href=\"#barbell-row-n-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-row-n-e-head\"/><use href=\"#barbell-row-n-e-torso\"/><use href=\"#barbell-row-n-e-thigh.r\"/><use href=\"#barbell-row-n-e-kneecap.r\"/><use href=\"#barbell-row-n-e-shank.r\"/><use href=\"#barbell-row-n-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-row-n-e-head\"/><use href=\"#barbell-row-n-e-torso\"/><use href=\"#barbell-row-n-e-thigh.r\"/><use href=\"#barbell-row-n-e-kneecap.r\"/><use href=\"#barbell-row-n-e-shank.r\"/><use href=\"#barbell-row-n-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-row-n-e-shcap.r\"/><use href=\"#barbell-row-n-e-upper.r\"/><use href=\"#barbell-row-n-e-elbowcap.r\"/><use href=\"#barbell-row-n-e-fore.r\"/><use href=\"#barbell-row-n-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-row-n-e-shcap.r\"/><use href=\"#barbell-row-n-e-upper.r\"/><use href=\"#barbell-row-n-e-elbowcap.r\"/><use href=\"#barbell-row-n-e-fore.r\"/><use href=\"#barbell-row-n-e-fist.r\"/></g></g><path class=\"eq-line\" d=\"~~HBry_F1WK62\"/><path class=\"eq-thin\" d=\"~~HHsy_F1WF50\"/><path class=\"eq-solid\" d=\"~~A!w1y_F1!m1\"/><path class=\"eq-pin\" d=\"~~YJx1y_F1F60\"/><path class=\"eq-solid\" d=\"^42\"/><path class=\"eq-pin\" d=\"^43\"/><path class=\"eq-cable m-line\" d=\"~M!Gy1(DU1LX1X8LB3H1LO2P2LG1D3L0P3LH1D3LP2P2LD3H1LP30LD3I1LP2K2LH1B3L0O3LG1B3LO2K2LB3I1\"/><circle class=\"joint\" cx=\"194.86\" cy=\"166.24\" r=\"2.25\"/><circle class=\"joint\" cx=\"172\" cy=\"174.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"139.76\" cy=\"207.09\" r=\"2.25\"/><circle class=\"joint\" cx=\"160.96\" cy=\"266.05\" r=\"2.25\"/></g><g class=\"accent-layer\"><path class=\"trace\" pathLength=\"1\" d=\"~#_10wTx1PyS1)Sx1zHS10201000201020100020100020102010002010201000201000201020100000001010002000001010000010100000000010100020000010100000101000000000101000001010100000001010000000001010000010100\"/><path class=\"arrow\" d=\"~MwTx1SwH1LYiPB1LEY1OB1Z\"/><g class=\"measure\"><path class=\"arc-line\" d=\"M154.19 247.23A20 20 0 0 0 160.9 286.05\"/><g class=\"arc-ticks\"><path d=\"~MDJuWwR1Lxj*U1\"/><path d=\"~MWKv_yX1L3FY1\"/></g><path class=\"leader\" d=\"~MPDrDWU1LBJ2*W1\"/></g></g><path class=\"leader\" d=\"~MH!tHAz1L0-A1\"/><circle class=\"anchor\" cx=\"153.01\" cy=\"179.89\" r=\"1.5\"/><path class=\"leader\" d=\"M160.96 266.05L197 291H207\"/><circle class=\"anchor\" cx=\"160.96\" cy=\"266.05\" r=\"1.5\"/><path class=\"leader\" d=\"M172 208.97L207 230H217\"/><circle class=\"anchor\" cx=\"172\" cy=\"208.97\" r=\"1.5\"/>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"barbell-row-n-back\" data-key=\"back\" data-cue=\"Keep the back flat, not rounded or arched, from start to finish.\" class=\"plate-callout\" style=\"left:20.11%;top:39.39%\" aria-pressed=\"true\">Flat back</button><button type=\"button\" id=\"barbell-row-n-knees\" data-key=\"knees\" data-cue=\"Keep the knees slightly bent and the hips hinged, not standing tall.\" class=\"plate-callout\" style=\"left:56.42%;top:75.14%\" aria-pressed=\"false\">Soft knees</button><button type=\"button\" id=\"barbell-row-n-bar\" data-key=\"bar\" data-cue=\"Pull the bar to the belly button or low chest, not the neck.\" class=\"plate-callout two\" style=\"left:59.22%;top:58.1%\" aria-pressed=\"false\">Bar to<br>belly</button><span class=\"plate-arc-label\" style=\"left:15.08%;top:70.95%\"><b>Knee</b><span>slightly bent</span></span>",
      "<svg class=\"plate-svg\" viewBox=\"0 0 358 358\" width=\"358\" height=\"358\" aria-hidden=\"true\">\n  <defs><pattern id=\"barbell-row-m-dots\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\"><rect x=\"7.5\" y=\"7.5\" width=\"1\" height=\"1\" class=\"dot\"/></pattern><path id=\"barbell-row-m-st-shcap.r\" d=\"^0\"/><path id=\"barbell-row-m-st-upper.r\" d=\"^1\"/><path id=\"barbell-row-m-st-elbowcap.r\" d=\"^2\"/><path id=\"barbell-row-m-st-fore.r\" d=\"^3\"/><path id=\"barbell-row-m-st-fist.r\" d=\"^4\"/><path id=\"barbell-row-m-g0-shcap.r\" d=\"^5\"/><path id=\"barbell-row-m-g0-upper.r\" d=\"^6\"/><path id=\"barbell-row-m-g0-elbowcap.r\" d=\"^7\"/><path id=\"barbell-row-m-g0-fore.r\" d=\"^8\"/><path id=\"barbell-row-m-g0-fist.r\" d=\"^9\"/><path id=\"barbell-row-m-g1-shcap.r\" d=\"^10\"/><path id=\"barbell-row-m-g1-upper.r\" d=\"^11\"/><path id=\"barbell-row-m-g1-elbowcap.r\" d=\"^12\"/><path id=\"barbell-row-m-g1-fore.r\" d=\"^13\"/><path id=\"barbell-row-m-g1-fist.r\" d=\"^14\"/><path id=\"barbell-row-m-g2-shcap.r\" d=\"^15\"/><path id=\"barbell-row-m-g2-upper.r\" d=\"^16\"/><path id=\"barbell-row-m-g2-elbowcap.r\" d=\"^17\"/><path id=\"barbell-row-m-g2-fore.r\" d=\"^18\"/><path id=\"barbell-row-m-g2-fist.r\" d=\"^19\"/><path id=\"barbell-row-m-e-thigh.l\" d=\"^20\"/><path id=\"barbell-row-m-e-kneecap.l\" d=\"^21\"/><path id=\"barbell-row-m-e-shank.l\" d=\"^22\"/><path id=\"barbell-row-m-e-foot.l\" d=\"^23\"/><path id=\"barbell-row-m-e-shcap.l\" d=\"^24\"/><path id=\"barbell-row-m-e-upper.l\" d=\"^25\"/><path id=\"barbell-row-m-e-elbowcap.l\" d=\"^26\"/><path id=\"barbell-row-m-e-fore.l\" d=\"^27\"/><path id=\"barbell-row-m-e-fist.l\" d=\"^28\"/><path id=\"barbell-row-m-e-head\" d=\"^29\"/><path id=\"barbell-row-m-e-torso\" d=\"^30\"/><path id=\"barbell-row-m-e-thigh.r\" d=\"^20\"/><path id=\"barbell-row-m-e-kneecap.r\" d=\"^21\"/><path id=\"barbell-row-m-e-shank.r\" d=\"^22\"/><path id=\"barbell-row-m-e-foot.r\" d=\"^23\"/><path id=\"barbell-row-m-e-shcap.r\" d=\"^24\"/><path id=\"barbell-row-m-e-upper.r\" d=\"^25\"/><path id=\"barbell-row-m-e-elbowcap.r\" d=\"^26\"/><path id=\"barbell-row-m-e-fore.r\" d=\"^27\"/><path id=\"barbell-row-m-e-fist.r\" d=\"^28\"/><path id=\"barbell-row-m-m-head\" d=\"~#w12FOF1YPjXEE1-NiBqw7KlG1x8G8B5P25G9G1Vd)3BsPaV8N3z9TgR9wpN1SmW5NgDdU8Nn*a_f0000010000002000011110000200000010000000000100000001010000000000\"/><path id=\"barbell-row-m-m-torso\" d=\"~#_12W-A1J!mE-B1)Ylx5GaX2T1fyky5HaA3FkS5F3N6xoIfxiOdE2Fg_3Dl!4NrT2woO6w9.5y1.h*5xJ1!3BtR5B3G8X4A3DkE1S8x7Gd.hz1)f_eN2_8UgI3B1S8xY2.d00002000200111010120002200010002000200100010000000000002000000000010000010000201010000000110001100200000100000021010\"/><path id=\"barbell-row-m-m-thigh.l\" d=\"~#F12AIqADF1Exq)XD1E3KbG16YbU*1!4O8D2E4K4)U1A9IoT2xkEfzlO9GU1E3R3)6*6!4S(1D13a*bRw1R7EgJI1W4Uz1ArUB110010101110100000000000002100020000200000000010010010000000101010120000000000010\"/><path id=\"barbell-row-m-m-kneecap.l\" d=\"~~y(sJwU1_J10\"/><path id=\"barbell-row-m-m-shank.l\" d=\"~#F12W!sJAU1I!s)US1q*bF13FaJ(1H5K8J2z4O9Iy2y6Bev)bK8.cx2)y2z3X3R6E7iy)1E14-2RbXbWczbYp(1WlHfJn00000000000200010100000000000001200002000011000000001100020000000010020200101000\"/><path id=\"barbell-row-m-m-foot.l\" d=\"~#o2FPuDB)1.xvEB(1_cF3Ph*7SpxoF-2B3KJ2-4GD1)7.n0OG1!4xb.cWsBbImUp000022000000000101000010000200020021000000001001\"/><path id=\"barbell-row-m-m-shcap.l\" d=\"~~S)w1STrwP10\"/><path id=\"barbell-row-m-m-upper.l\" d=\"~#F12_Hx1YUqVXx1*DqN3E364Ge_kN4bD27D9z2_j.7SaVcJ4XkeO93B2bK4)hYh55U2*3rzo.qYaOeDh.5Ns11000000010100002020021000000001010002120001010000000200200000002000000010020000\"/><path id=\"barbell-row-m-m-elbowcap.l\" d=\"~~JEu(IvDz10\"/><path id=\"barbell-row-m-m-fore.l\" d=\"~#F12DHuN*vOzuVHv.1z7H1qShFp0K7kE2x8.f0OeG5.9zc)7-8OfE2jB6z4JbSs0P1*4O5*cT22DmA8DfSiFc00200200001010000000000000200000000000000002100000010001200220000000000000000000\"/><path id=\"barbell-row-m-m-fist.l\" d=\"~~DTx1ANB1ww10\"/><path id=\"barbell-row-m-m-thigh.r\" d=\"^56\"/><path id=\"barbell-row-m-m-kneecap.r\" d=\"^57\"/><path id=\"barbell-row-m-m-shank.r\" d=\"^58\"/><path id=\"barbell-row-m-m-foot.r\" d=\"^59\"/><path id=\"barbell-row-m-m-shcap.r\" d=\"^60\"/><path id=\"barbell-row-m-m-upper.r\" d=\"^61\"/><path id=\"barbell-row-m-m-elbowcap.r\" d=\"^62\"/><path id=\"barbell-row-m-m-fore.r\" d=\"^63\"/><path id=\"barbell-row-m-m-fist.r\" d=\"^64\"/><path id=\"barbell-row-m-m-eq0\" d=\"~~H!x1ANB1!m1\"/><path id=\"barbell-row-m-m-eq1\" d=\"~~(Jy1ANB1F60\"/><path id=\"barbell-row-m-m-eq2\" d=\"^65\"/><path id=\"barbell-row-m-m-eq3\" d=\"^66\"/><path id=\"barbell-row-m-mo-0\" d=\"^29\"/><path id=\"barbell-row-m-mo-1\" d=\"^30\"/><path id=\"barbell-row-m-mo-2\" d=\"^20\"/><path id=\"barbell-row-m-mo-3\" d=\"^21\"/><path id=\"barbell-row-m-mo-4\" d=\"^22\"/><path id=\"barbell-row-m-mo-5\" d=\"^23\"/><path id=\"barbell-row-m-mo-6\" d=\"^24\"/><path id=\"barbell-row-m-mo-7\" d=\"^25\"/><path id=\"barbell-row-m-mo-8\" d=\"^26\"/><path id=\"barbell-row-m-mo-9\" d=\"^27\"/><path id=\"barbell-row-m-mo-10\" d=\"^28\"/><path id=\"barbell-row-m-mo-11\" d=\"^20\"/><path id=\"barbell-row-m-mo-12\" d=\"^21\"/><path id=\"barbell-row-m-mo-13\" d=\"^22\"/><path id=\"barbell-row-m-mo-14\" d=\"^23\"/><path id=\"barbell-row-m-mo-15\" d=\"^24\"/><path id=\"barbell-row-m-mo-16\" d=\"^25\"/><path id=\"barbell-row-m-mo-17\" d=\"^26\"/><path id=\"barbell-row-m-mo-18\" d=\"^27\"/><path id=\"barbell-row-m-mo-19\" d=\"^28\"/><path id=\"barbell-row-m-mo-20\" d=\"^42\"/><path id=\"barbell-row-m-mo-21\" d=\"^43\"/><path id=\"barbell-row-m-mo-22\" d=\"^42\"/><path id=\"barbell-row-m-mo-23\" d=\"^43\"/></defs>\n  <rect width=\"358\" height=\"358\" fill=\"url(#barbell-row-m-dots)\"/>\n  <path class=\"datum\" d=\"^31\"/><path class=\"floorline\" d=\"^32\"/><g class=\"pose-start\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-row-m-st-shcap.r\"/><use href=\"#barbell-row-m-st-upper.r\"/><use href=\"#barbell-row-m-st-elbowcap.r\"/><use href=\"#barbell-row-m-st-fore.r\"/><use href=\"#barbell-row-m-st-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-row-m-st-shcap.r\"/><use href=\"#barbell-row-m-st-upper.r\"/><use href=\"#barbell-row-m-st-elbowcap.r\"/><use href=\"#barbell-row-m-st-fore.r\"/><use href=\"#barbell-row-m-st-fist.r\"/></g></g></g><g class=\"ghost\" style=\"--o:0.12;--i:0\" data-t=\"0.25\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-row-m-g0-shcap.r\"/><use href=\"#barbell-row-m-g0-upper.r\"/><use href=\"#barbell-row-m-g0-elbowcap.r\"/><use href=\"#barbell-row-m-g0-fore.r\"/><use href=\"#barbell-row-m-g0-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-row-m-g0-shcap.r\"/><use href=\"#barbell-row-m-g0-upper.r\"/><use href=\"#barbell-row-m-g0-elbowcap.r\"/><use href=\"#barbell-row-m-g0-fore.r\"/><use href=\"#barbell-row-m-g0-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^34\"/><path class=\"eq-pin\" d=\"^35\"/></g><g class=\"ghost\" style=\"--o:0.24;--i:1\" data-t=\"0.5\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-row-m-g1-shcap.r\"/><use href=\"#barbell-row-m-g1-upper.r\"/><use href=\"#barbell-row-m-g1-elbowcap.r\"/><use href=\"#barbell-row-m-g1-fore.r\"/><use href=\"#barbell-row-m-g1-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-row-m-g1-shcap.r\"/><use href=\"#barbell-row-m-g1-upper.r\"/><use href=\"#barbell-row-m-g1-elbowcap.r\"/><use href=\"#barbell-row-m-g1-fore.r\"/><use href=\"#barbell-row-m-g1-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^36\"/><path class=\"eq-pin\" d=\"^37\"/></g><g class=\"ghost\" style=\"--o:0.36;--i:2\" data-t=\"0.75\"><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-row-m-g2-shcap.r\"/><use href=\"#barbell-row-m-g2-upper.r\"/><use href=\"#barbell-row-m-g2-elbowcap.r\"/><use href=\"#barbell-row-m-g2-fore.r\"/><use href=\"#barbell-row-m-g2-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-row-m-g2-shcap.r\"/><use href=\"#barbell-row-m-g2-upper.r\"/><use href=\"#barbell-row-m-g2-elbowcap.r\"/><use href=\"#barbell-row-m-g2-fore.r\"/><use href=\"#barbell-row-m-g2-fist.r\"/></g></g><path class=\"eq-solid\" d=\"^38\"/><path class=\"eq-pin\" d=\"^39\"/></g><g class=\"pose-end\"><g class=\"far\"><g class=\"u-stroke\"><use href=\"#barbell-row-m-e-thigh.l\"/><use href=\"#barbell-row-m-e-kneecap.l\"/><use href=\"#barbell-row-m-e-shank.l\"/><use href=\"#barbell-row-m-e-foot.l\"/><use href=\"#barbell-row-m-e-shcap.l\"/><use href=\"#barbell-row-m-e-upper.l\"/><use href=\"#barbell-row-m-e-elbowcap.l\"/><use href=\"#barbell-row-m-e-fore.l\"/><use href=\"#barbell-row-m-e-fist.l\"/></g><g class=\"u-fill\"><use href=\"#barbell-row-m-e-thigh.l\"/><use href=\"#barbell-row-m-e-kneecap.l\"/><use href=\"#barbell-row-m-e-shank.l\"/><use href=\"#barbell-row-m-e-foot.l\"/><use href=\"#barbell-row-m-e-shcap.l\"/><use href=\"#barbell-row-m-e-upper.l\"/><use href=\"#barbell-row-m-e-elbowcap.l\"/><use href=\"#barbell-row-m-e-fore.l\"/><use href=\"#barbell-row-m-e-fist.l\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-row-m-e-head\"/><use href=\"#barbell-row-m-e-torso\"/><use href=\"#barbell-row-m-e-thigh.r\"/><use href=\"#barbell-row-m-e-kneecap.r\"/><use href=\"#barbell-row-m-e-shank.r\"/><use href=\"#barbell-row-m-e-foot.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-row-m-e-head\"/><use href=\"#barbell-row-m-e-torso\"/><use href=\"#barbell-row-m-e-thigh.r\"/><use href=\"#barbell-row-m-e-kneecap.r\"/><use href=\"#barbell-row-m-e-shank.r\"/><use href=\"#barbell-row-m-e-foot.r\"/></g></g><g class=\"\"><g class=\"u-stroke\"><use href=\"#barbell-row-m-e-shcap.r\"/><use href=\"#barbell-row-m-e-upper.r\"/><use href=\"#barbell-row-m-e-elbowcap.r\"/><use href=\"#barbell-row-m-e-fore.r\"/><use href=\"#barbell-row-m-e-fist.r\"/></g><g class=\"u-fill\"><use href=\"#barbell-row-m-e-shcap.r\"/><use href=\"#barbell-row-m-e-upper.r\"/><use href=\"#barbell-row-m-e-elbowcap.r\"/><use href=\"#barbell-row-m-e-fore.r\"/><use href=\"#barbell-row-m-e-fist.r\"/></g></g><path class=\"eq-line\" d=\"^40\"/><path class=\"eq-thin\" d=\"^41\"/><path class=\"eq-solid\" d=\"^42\"/><path class=\"eq-pin\" d=\"^43\"/><path class=\"eq-solid\" d=\"^42\"/><path class=\"eq-pin\" d=\"^43\"/><path class=\"eq-cable m-line\" d=\"^44\"/><circle class=\"joint\" cx=\"194.86\" cy=\"166.24\" r=\"2.25\"/><circle class=\"joint\" cx=\"172\" cy=\"174.25\" r=\"2.25\"/><circle class=\"joint\" cx=\"139.76\" cy=\"207.09\" r=\"2.25\"/><circle class=\"joint\" cx=\"160.96\" cy=\"266.05\" r=\"2.25\"/></g><mask id=\"barbell-row-m-mmask\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"358\" height=\"358\"><rect width=\"358\" height=\"358\" fill=\"#fff\"/><use href=\"#barbell-row-m-m-head\" fill=\"#000\"/><use href=\"#barbell-row-m-m-torso\" fill=\"#000\"/><use href=\"#barbell-row-m-m-thigh.l\" fill=\"#000\"/><use href=\"#barbell-row-m-m-kneecap.l\" fill=\"#000\"/><use href=\"#barbell-row-m-m-shank.l\" fill=\"#000\"/><use href=\"#barbell-row-m-m-foot.l\" fill=\"#000\"/><use href=\"#barbell-row-m-m-shcap.l\" fill=\"#000\"/><use href=\"#barbell-row-m-m-upper.l\" fill=\"#000\"/><use href=\"#barbell-row-m-m-elbowcap.l\" fill=\"#000\"/><use href=\"#barbell-row-m-m-fore.l\" fill=\"#000\"/><use href=\"#barbell-row-m-m-fist.l\" fill=\"#000\"/><use href=\"#barbell-row-m-m-thigh.r\" fill=\"#000\"/><use href=\"#barbell-row-m-m-kneecap.r\" fill=\"#000\"/><use href=\"#barbell-row-m-m-shank.r\" fill=\"#000\"/><use href=\"#barbell-row-m-m-foot.r\" fill=\"#000\"/><use href=\"#barbell-row-m-m-shcap.r\" fill=\"#000\"/><use href=\"#barbell-row-m-m-upper.r\" fill=\"#000\"/><use href=\"#barbell-row-m-m-elbowcap.r\" fill=\"#000\"/><use href=\"#barbell-row-m-m-fore.r\" fill=\"#000\"/><use href=\"#barbell-row-m-m-fist.r\" fill=\"#000\"/><use href=\"#barbell-row-m-mo-0\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-1\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-2\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-3\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-4\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-5\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-6\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-7\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-8\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-9\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-10\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-11\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-12\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-13\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-14\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-15\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-16\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-17\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-18\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-19\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-20\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-21\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-22\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/><use href=\"#barbell-row-m-mo-23\" fill=\"none\" stroke=\"#000\" stroke-width=\"3.5\"/></mask><g class=\"m-pose\" mask=\"url(#barbell-row-m-mmask)\"><g class=\"u-stroke\"><use href=\"#barbell-row-m-m-head\"/><use href=\"#barbell-row-m-m-torso\"/><use href=\"#barbell-row-m-m-thigh.l\"/><use href=\"#barbell-row-m-m-kneecap.l\"/><use href=\"#barbell-row-m-m-shank.l\"/><use href=\"#barbell-row-m-m-foot.l\"/><use href=\"#barbell-row-m-m-shcap.l\"/><use href=\"#barbell-row-m-m-upper.l\"/><use href=\"#barbell-row-m-m-elbowcap.l\"/><use href=\"#barbell-row-m-m-fore.l\"/><use href=\"#barbell-row-m-m-fist.l\"/><use href=\"#barbell-row-m-m-thigh.r\"/><use href=\"#barbell-row-m-m-kneecap.r\"/><use href=\"#barbell-row-m-m-shank.r\"/><use href=\"#barbell-row-m-m-foot.r\"/><use href=\"#barbell-row-m-m-shcap.r\"/><use href=\"#barbell-row-m-m-upper.r\"/><use href=\"#barbell-row-m-m-elbowcap.r\"/><use href=\"#barbell-row-m-m-fore.r\"/><use href=\"#barbell-row-m-m-fist.r\"/><use href=\"#barbell-row-m-m-eq0\"/><use href=\"#barbell-row-m-m-eq1\"/><use href=\"#barbell-row-m-m-eq2\"/><use href=\"#barbell-row-m-m-eq3\"/></g></g><g class=\"mistake-layer\"><path class=\"m-arrow\" d=\"M236.96 160.32A100 100 0 0 0 211.36 127.55M216.29 128.35L211.36 127.55L211.98 132.52\"/><path class=\"m-arrow\" d=\"~MwwnHNF1LYK1GiMEgWqLFgVqLKN1Si\"/><path class=\"leader m\" d=\"~MNzvSRsL0xJ2\"/><path class=\"leader m\" d=\"~MwypyED1L0xG2\"/></g>\n</svg>",
      "<span class=\"plate-meta\" style=\"left:4.47%;top:3.91%\">Side view</span><button type=\"button\" id=\"barbell-row-m-swing\" data-key=\"swing\" data-cue=\"The torso swings up to heave the bar.\" class=\"plate-callout two m\" style=\"left:21.79%;top:26.26%\" aria-pressed=\"true\">Torso<br>swings up</button><button type=\"button\" id=\"barbell-row-m-hips\" data-key=\"hips\" data-cue=\"The hips and lower back throw the weight up.\" class=\"plate-callout m\" style=\"left:10.61%;top:42.18%\" aria-pressed=\"false\">Hips throw</button>",
    ]);
    return {
      view: "side",
      normal: {
        svg: nSvg,
        overlay: nOverlay,
        firstKey: "back",
        cues: [{ key: "back", cue: "Keep the back flat, not rounded or arched, from start to finish." }, { key: "knees", cue: "Keep the knees slightly bent and the hips hinged, not standing tall." }, { key: "bar", cue: "Pull the bar to the belly button or low chest, not the neck." }],
      },
      mistake: {
        svg: mSvg,
        overlay: mOverlay,
        firstKey: "swing",
        cues: [{ key: "swing", cue: "The torso swings up to heave the bar." }, { key: "hips", cue: "The hips and lower back throw the weight up." }],
      },
      tells: "<div class=\"tells\" hidden><span class=\"eyebrow\">Tells</span><ol><li><b>Torso swings up</b><span>The torso swings up to heave the bar.</span></li><li><b>Hips throw</b><span>The hips and lower back throw the weight up.</span></li></ol></div>",
      tempo: "<div class=\"tempo\" role=\"img\" aria-label=\"Tempo: pull 1 second, lower 2 seconds\"><div class=\"tempo-seg move\" style=\"flex:1 1 0\"><i></i><div class=\"tempo-label\"><b>Pull</b><span>1 s</span></div></div><div class=\"tempo-seg move\" style=\"flex:2 1 0\"><i></i><div class=\"tempo-label\"><b>Lower</b><span>2 s</span></div></div></div>",
      alt: "Barbell row, side view. Hinged at the hips with a flat back and slightly bent knees, the lifter pulls the bar from straight arms, over the middle of the foot, to the belly button or low chest, driving the elbows back.",
      mistakeAlt: "Barbell Row: the common mistake, drawn dashed in the mistake colour over the correct end position.",
    };
  })(),
  rev: 1,
  handling: {
    "archetype": "pull",
    "why": "D-SHIP-C3 no-zoom list, D-SHIP-HANDW2: no pair key variant draws this card's barbell grip (Q-W2-1, ruling 8); the grip copy carries c1, c2 and c16.",
    "orientation": "pronated",
    "handle": "bar-28",
    "width": {
      "text": "Slightly wider than shoulder width, so wrists, elbows and shoulders line up.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bent-over-row",
          "sl-barbell-row"
        ],
        "note": "c1, c2"
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
      "limitText": "Keep the wrists straight, in line with the forearms.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bent-over-row"
        ],
        "note": "c1, card grip.wrist. The ext range is pairs.mjs CONVENTIONS ga:pull-base, a convention, not a card number."
      }
    },
    "faults": [
      {
        "key": "curled",
        "label": "Wrist curled",
        "pose": {},
        "markers": [],
        "alt": "Wrist curled under the bar, out of line with the forearm."
      }
    ],
    "gripLine": "Overhand, thumbs around the bar. Straps are fine if grip fails first.",
    "cue": "Overhand, thumbs wrapped, wrists straight."
  },
  contacts: [
    "standing-feet"
  ],
  setup: [
    {
      "kind": "get-in",
      "text": "Lift the bar from the rack. Weight even under the feet.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bent-over-row",
          "sl-barbell-row"
        ],
        "note": "c3, c8"
      }
    },
    {
      "kind": "grip",
      "text": "Feet shoulder width. Overhand grip slightly wider, thumbs around the bar.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-barbell-row",
          "baechle-grip"
        ],
        "note": "c8, c2, c16"
      }
    },
    {
      "kind": "position",
      "text": "Bend at the hips, back straight, knees slightly bent. Arms straight.",
      "zoom": "row-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bent-over-row"
        ],
        "note": "c3, c5"
      }
    },
    {
      "kind": "brace",
      "text": "Breathe in, then pull. Shoulder blades together at the top.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-barbell-row"
        ],
        "note": "c19, c9"
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
      "key": "back",
      "label": "Flat back",
      "detail": "Back neutral the whole set, not rounded or arched.",
      "anchor": {
        "pose": "end",
        "at": "backMid"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-barbell-row"
        ],
        "note": "c4"
      }
    },
    {
      "key": "trunk",
      "label": "Trunk still",
      "detail": "Trunk angle stays the same while the bar moves.",
      "anchor": {
        "pose": "end",
        "at": "lumbar"
      },
      "zoom": "row-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bent-over-row",
          "sl-barbell-row"
        ],
        "note": "c5, c7"
      }
    },
    {
      "key": "bar",
      "label": "Bar to belly",
      "detail": "Bar pulled to the belly button or low chest.",
      "anchor": {
        "pose": "end",
        "at": "grip.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "ace-bent-over-row",
          "sl-barbell-row"
        ],
        "note": "c5, c6"
      }
    },
    {
      "key": "blades",
      "label": "Shoulder blades",
      "detail": "Shoulder blades forward at the bottom, together at the top.",
      "anchor": {
        "pose": "end",
        "at": "backUpper"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-barbell-row"
        ],
        "note": "c9"
      }
    },
    {
      "key": "feet",
      "label": "Even feet",
      "detail": "Weight even under the feet.",
      "anchor": {
        "pose": "start",
        "at": "ankle.r"
      },
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-barbell-row"
        ],
        "note": "c8"
      }
    }
  ],
  zooms: [
    {
      "key": "row-back",
      "chip": "Back",
      "heading": "Back angle",
      "kind": "posture",
      "feelRow": "low-back"
    }
  ],
  chips: [
    "row-back",
    "feel"
  ],
  copy: {
    "setupLine": "Hinge at the hips, back flat, knees slightly bent. Pull the bar to your belly.",
    "mistakeLine": "Don't swing the bar up with your hips. Go lighter and row strictly.",
    "cueLine": "Bar to belly, back flat."
  },
  mistakes: [
    {
      "key": "swing",
      "title": "Swinging the bar up",
      "zoom": "row-back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-barbell-row"
        ],
        "note": "c7"
      },
      "fix": "Go lighter and row strictly."
    },
    {
      "key": "round",
      "title": "Rounding the back",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-barbell-row"
        ],
        "note": "c4, c7"
      },
      "fix": "Keep the back flat. If it rounds, lower the weight."
    },
    {
      "key": "underhand",
      "title": "Underhand grip for heavy sets",
      "claim": {
        "tags": [
          "CONSENSUS",
          "WEAK"
        ],
        "sources": [
          "sl-barbell-row"
        ],
        "note": "c20"
      },
      "fix": "Keep the overhand grip for this row."
    }
  ],
  risks: [
    {
      "key": "spine",
      "text": "This row puts the largest load on the lower spine of the rows tested.",
      "claim": {
        "tags": [
          "DATA"
        ],
        "sources": [
          "fenwick2009"
        ],
        "note": "c10"
      }
    },
    {
      "key": "breath",
      "text": "Heavy reps with a held breath send blood pressure very high.",
      "claim": {
        "tags": [
          "DATA",
          "WEAK"
        ],
        "sources": [
          "macdougall1985"
        ],
        "note": "c15"
      }
    },
    {
      "key": "swing",
      "text": "Swinging the bar up with your hips shifts work to the lower back.",
      "claim": {
        "tags": [
          "CONSENSUS"
        ],
        "sources": [
          "sl-barbell-row"
        ],
        "note": "c7"
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
    "ace-bent-over-row",
    "sl-barbell-row",
    "fenwick2009",
    "saeterbakken2015",
    "acsm2009",
    "macdougall1985",
    "baechle-grip",
    "nhs-back"
  ],
  research: {
    "card": "docs/research/howto/cards/barbell_row.json",
    "rev": 1
  },
} satisfies BuiltHowTo;

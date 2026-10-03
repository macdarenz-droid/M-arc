// LIB-6 zbox shell: the posture-crop geometry. Three registries, each picked by name from an exercise's options:
//   CAMERAS - the plate camera the crops are cut from;
//   STILLS  - how a still (one pose) becomes a plate spec (which equipment it keeps or moves);
//   GUIDES  - the one mark per crop the callout points at (bespoke geometry per kind).
// Arithmetic is golden B's, operation for operation (same order, same rounding), so the output is byte-identical.
import { renderPlate, landmarksOf, legPressFace } from '../../../layers/engine/index.mjs';

export const f = v => +(+v).toFixed(2);
const sub = (a, b) => a.map((v, i) => v - b[i]), add = (a, b) => a.map((v, i) => v + b[i]), mul = (a, k) => a.map(v => v * k);
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0), nrm = a => mul(a, 1 / Math.hypot(...a));
const pt = p => `${f(p[0])} ${f(p[1])}`;

/** camera option -> REF { pxPerM, x0, y0 }. */
export const CAMERAS = {
  fixed: (spec, o) => ({ pxPerM: o.pxPerM, x0: o.x0, y0: o.y0 }),                       // a set camera
  'spec-origin': (spec, o) => ({ pxPerM: o.pxPerM, x0: spec.camera.x0, y0: spec.camera.y0 }),   // set scale, the spec's origin
  fitted: spec => renderPlate(spec, { id: 'cam' }).report.camera,                          // the plate's own fitted camera
};

/** still option -> (ctx, o) => (still => plate spec of that one pose, no ghosts, trace, measure, callouts or mistake). */
export const STILLS = {
  // `still.seatDrop` moves the seat, back pad, pad bracket and body down together (lever, handles, feet, frame stay);
  // equipment functions whose source names o.dropFn are plate-only and left out.
  'seat-drop': (ctx, o) => ({ pose, seatDrop = 0 }) => {
    const plateSpec = ctx.plateSpec, dy = -seatDrop, up = q => [q[0], q[1] + dy, q[2]];
    const equipment = plateSpec.equipment
      .filter(e => !(typeof e === 'function' && e.toString().includes(o.dropFn)))
      .map(e => {
        if (typeof e === 'function' || !dy) return e;
        if (e.type === 'seat') return { ...e, at: up(e.at) };
        if (e.type === 'backPad') return { ...e, surface: e.surface.map(up) };
        if (e.type === 'line') return { ...e, pts: e.pts.map(up) };
        return e;
      });
    const p = { ...pose, root: { ...pose.root, at: up(pose.root.at) } };
    const { trace, measure, mistake, datum, ...rest } = plateSpec;
    return { ...rest, poses: { start: p, end: p }, equipment, ghosts: { count: 0 }, callouts: [], checks: [], seatDrop };
  },
  // the plate's floor plus a bar at the still's `bar` (plate outline behind, sleeve dot in front)
  barbell: (ctx, o) => ({ pose, bar }) => {
    const plateSpec = ctx.plateSpec;
    const floor = plateSpec.equipment.find(e => e && typeof e === 'object' && e.type === 'floor');
    const equipment = [floor,
      { type: 'barbell', at: bar, plates: o.plates, part: 'bar', z: 'back' },
      { type: 'pulley', at: bar, r: o.sleeveR, part: 'bar', z: 'front' }];
    const { trace, measure, mistake, datum, ...rest } = plateSpec;
    return { ...rest, poses: { start: pose, end: pose }, equipment, ghosts: { count: 0 }, callouts: [], checks: [], startParts: [] };
  },
  // the plate's own sled item; a still with a fixed `travel` places the sled there (exercise module's SLED)
  sled: ctx => {
    const { plateSpec, REF, mod } = ctx, SLED = mod.SLED, sledFn = plateSpec.equipment.find(e => typeof e === 'function');
    return ({ pose, travel }) => {
      const equipment = plateSpec.equipment.map(e => typeof e !== 'function' ? e
        : (lm, c) => travel == null ? sledFn(lm, c).filter(x => x.type === 'legPress45') : [{ ...SLED, travel, type: 'legPress45', part: 'sled' }]);
      const { trace, measure, mistake, datum, checks, ...rest } = plateSpec;
      return { ...rest, camera: { pxPerM: REF.pxPerM, x0: REF.x0, y0: REF.y0 }, poses: { start: pose, end: pose }, equipment, ghosts: { count: 0 }, callouts: [], checks: [], startParts: [] };
    };
  },
};

// Seated machine: the back pad's face frame on a still (u along the pad, n its normal) and the back's foot on it.
function seatPad(ctx, still) {
  const s = ctx.stillSpec(still), lm = landmarksOf(s.poses.end, ctx.H);
  const padItem = s.equipment.find(e => e.type === 'backPad');
  const [pu, pl] = padItem.surface, d = [pu[1] - pl[1], pu[2] - pl[2]], k = Math.hypot(...d), u = [0, d[0] / k, d[1] / k], n = [0, -u[2], u[1]];
  const bu = lm.backUpper, sd = (bu[1] - pu[1]) * n[1] + (bu[2] - pu[2]) * n[2];
  const foot = [0, bu[1] - n[1] * sd, bu[2] - n[2] * sd];
  return { u, bu, foot };
}
// Reclined sled: the pad face through the end pose's buttock and upper back.
function reclinePad(ctx) {
  const LM_END = landmarksOf(ctx.plateSpec.poses.end, ctx.H), PAD_U = nrm(sub(LM_END.backUpper, LM_END.buttock));
  return { PAD_U, onPad: p => add(LM_END.buttock, mul(PAD_U, dot(sub(p, LM_END.buttock), PAD_U))) };
}
const onFace = (p, fc) => sub(p, mul(fc.normal, dot(sub(p, fc.at), fc.normal)));
// The bony bump at the base of the neck (C7), rigid with the thorax: from the neck pivot, o.back toward the back and
// o.up up, in the thorax frame (up = sacrum to neck).
function c7Of(lm, o) {
  const up = [lm.neck[1] - lm.sacrum[1], lm.neck[2] - lm.sacrum[2]], k = Math.hypot(...up), u = [up[0] / k, up[1] / k];
  const back = [u[1], -u[0]];
  return [0, lm.neck[1] + u[0] * o.up + back[0] * o.back, lm.neck[2] + u[1] * o.up + back[1] * o.back];
}

/** guide kind -> (ctx, still, role, o) => svg (plate px, drawn over the crop). role: 'right' | 'wrong'. */
export const GUIDES = {
  // the handle's height carried back across the body to the pad (dashed), plus the mid-chest target mark (a tick and a
  // dot at the o.from still's handle height, moved down with the body when the seat drops): accent when right,
  // neutral when wrong (it is the target, not a second fault)
  'handle-to-chest': (ctx, still, role, o) => {
    const { P, H, REF, stillSpec, stills } = ctx;
    const s = stillSpec(still), lm = landmarksOf(s.poses.end, H), cls = role === 'right' ? 'hz-g ok' : 'hz-g no';
    const g = P(lm['grip.r']), c = P(lm.chest), bu = P(lm.backUpper);
    const tickY = P(landmarksOf(stillSpec(stills[o.from]).poses.end, H)['grip.r'])[1] + (s.seatDrop ?? 0) * REF.pxPerM;
    const mx = c[0], tgtCls = role === 'right' ? 'hz-g ok' : 'hz-g tgt', dotCls = role === 'right' ? 'hz-g dot ok' : 'hz-g dot tgt';
    return `<path class="${cls} dash" d="M${f(bu[0] - 3)} ${f(g[1])}H${f(g[0])}"/>`
      + `<path class="${tgtCls}" d="M${f(mx - 5)} ${f(tickY)}H${f(mx + 5)}"/><circle class="${dotCls}" cx="${f(mx)}" cy="${f(tickY)}" r="2.2"/>`;
  },
  // seated: a short bracket along the pad face where the upper back touches it (o.half m each side)
  'seat-pad-contact': (ctx, still, role, o) => {
    const { P } = ctx, cls = role === 'right' ? 'hz-g ok' : 'hz-g no', { u, foot } = seatPad(ctx, still);
    const a = P([0, foot[1] - u[1] * o.half, foot[2] - u[2] * o.half]), b = P([0, foot[1] + u[1] * o.half, foot[2] + u[2] * o.half]);
    return `<path class="${cls}" d="M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}"/>`;
  },
  // seated: dimension from the pad face to the rounded upper back, end caps laid along the pad (o.capPx / 2 each side)
  // and a faint fill in the gap between them
  'seat-pad-gap': (ctx, still, role, o) => {
    const { P, REF } = ctx, cls = role === 'right' ? 'hz-g ok' : 'hz-g no', { u, bu, foot } = seatPad(ctx, still);
    const A = P(foot), B = P(bu), tk = o.capHalfPx / REF.pxPerM;
    const ends = p => [P([0, p[1] - u[1] * tk, p[2] - u[2] * tk]), P([0, p[1] + u[1] * tk, p[2] + u[2] * tk])];
    const [a0, a1] = ends(foot), [b0, b1] = ends(bu), L = ([a, b]) => `M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}`;
    return `<path class="hz-g gapfill" d="M${f(a0[0])} ${f(a0[1])}L${f(b0[0])} ${f(b0[1])}L${f(b1[0])} ${f(b1[1])}L${f(a1[0])} ${f(a1[1])}Z"/>`
      + `<path class="${cls}" d="${L([A, B])}${L([a0, a1])}${L([b0, b1])}"/>`;
  },
  // reclined: the lower back and tailbone lying on the pad, a contact line along the pad face (o.offPx toward the pad)
  'recline-pad-contact': (ctx, still, role, o) => {
    const { P } = ctx, lm = ctx.lmOf(still), cls = role === 'right' ? 'ok' : 'no', { onPad } = reclinePad(ctx);
    const a = P(onPad(lm.backMid)), b = P(onPad(lm.buttock)), n = nrm(sub(a, b)), off = [n[1] * o.offPx, -n[0] * o.offPx];
    const A = add(a, off), B = add(b, off);
    return `<path class="hz-g ${cls} wide" d="M${pt(A)}L${pt(B)}"/>` + [A, B].map(p => `<circle class="hz-g dot ${cls}" cx="${f(p[0])}" cy="${f(p[1])}" r="2.4"/>`).join('');
  },
  // reclined: the gap between the pad face and the rolled-up lower back, shaded, with the sacrum's distance
  'recline-pad-gap': (ctx, still, role, o) => {
    const { P } = ctx, lm = ctx.lmOf(still), cls = role === 'right' ? 'ok' : 'no', { onPad, PAD_U } = reclinePad(ctx);
    const body = [lm.backMid, lm.lumbar, lm.sacrum, lm.buttock].map(P), pad = [lm.buttock, lm.backMid].map(p => P(onPad(p)));
    return `<path class="hz-gap" d="M${body.map(pt).join('L')}L${pad.map(pt).join('L')}Z"/>`
      + `<path class="hz-g ref dash" d="M${pt(P(onPad(lm.backUpper)))}L${pt(P(onPad(add(lm.buttock, mul(PAD_U, o.padRunM)))))}"/>`
      + `<path class="hz-g ${cls}" d="M${pt(P(lm.sacrum))}L${pt(P(onPad(lm.sacrum)))}"/>`;
  },
  // sled: whole foot on the plate, the push running from the heel to the ball
  'sole-line': (ctx, still, role, o) => {
    const { P } = ctx, lm = ctx.lmOf(still), cls = role === 'right' ? 'ok' : 'no';
    const fc = legPressFace(ctx.mod.SLED, still.travel), h = P(onFace(lm['heel.r'], fc)), b = P(onFace(lm['ball.r'], fc)), n = nrm(sub(b, h)), off = [-n[1] * -o.offPx, n[0] * -o.offPx];
    return `<path class="hz-g ${cls} wide" d="M${pt(add(h, off))}L${pt(add(b, off))}"/>`
      + [h, b].map(p => `<circle class="hz-g dot ${cls}" cx="${f(p[0] + off[0])}" cy="${f(p[1] + off[1])}" r="2.4"/>`).join('');
  },
  // sled: the heel off the plate (shaded gap, gap line with end ticks), all the push on the ball
  'heel-gap': (ctx, still, role, o) => {
    const { P } = ctx, lm = ctx.lmOf(still), cls = role === 'right' ? 'ok' : 'no';
    const fc = legPressFace(ctx.mod.SLED, still.travel), h = P(lm['heel.r']), h0 = P(onFace(lm['heel.r'], fc)), b = P(onFace(lm['ball.r'], fc));
    const d = nrm(sub(h, h0)), t = [-d[1] * o.tickPx, d[0] * o.tickPx];
    return `<path class="hz-gap" d="M${pt(h)}L${pt(h0)}L${pt(b)}Z"/>`
      + `<path class="hz-g ${cls}" d="M${pt(h0)}L${pt(h)}M${pt(sub(h0, t))}L${pt(add(h0, t))}M${pt(sub(h, t))}L${pt(add(h, t))}"/>`
      + `<circle class="hz-g dot ${cls}" cx="${f(b[0])}" cy="${f(b[1])}" r="2.6"/>`;
  },
  // barbell: a ring round the bar (o.pressure: two short arcs toward the bony bump), plus the bony bump (C7) itself,
  // the same in both crops: a dot, a dashed level line carried back from it and a small label over the line's end
  'bar-ring': (ctx, still, role, o) => {
    const { P, REF } = ctx, lm = ctx.lmOf(still), cls = role === 'right' ? 'hz-g ok' : 'hz-g no';
    const B = P(still.bar), c7 = P(c7Of(lm, o.c7)), r = o.sleeveR * REF.pxPerM + 2.2;
    let svg = `<circle class="${cls}" cx="${f(B[0])}" cy="${f(B[1])}" r="${f(r)}"/>`;
    if (o.pressure) {
      const a = Math.atan2(c7[1] - B[1], c7[0] - B[0]);
      for (const [rr, w] of [[r + 2.4, 0.55], [r + 4.6, 0.45]]) {
        const p0 = [B[0] + rr * Math.cos(a - w), B[1] + rr * Math.sin(a - w)], p1 = [B[0] + rr * Math.cos(a + w), B[1] + rr * Math.sin(a + w)];
        svg += `<path class="${cls}" d="M${f(p0[0])} ${f(p0[1])}A${f(rr)} ${f(rr)} 0 0 1 ${f(p1[0])} ${f(p1[1])}"/>`;
      }
    }
    const LX = o.c7.lineLen, fs = o.c7.fontSize;
    svg += `<path class="hz-g ref dash thin" d="M${f(c7[0] - LX)} ${f(c7[1])}H${f(c7[0])}"/>`
      + `<circle class="hz-c7" cx="${f(c7[0])}" cy="${f(c7[1])}" r="1.5"/>`
      + `<text class="hz-c7-t" x="${f(c7[0] - LX)}" y="${f(c7[1] - 1.8)}" font-size="${fs}">${o.c7.label}</text>`;
    return svg;
  },
  // the top of the knee (knee centre + o.kneeR) carried back past the hip, dashed, and the hip crease as a dot
  // (o.creaseM from the hip-joint centre along the thigh's upper normal)
  'knee-line': (ctx, still, role, o) => {
    const { P, REF } = ctx, lm = ctx.lmOf(still);
    const K = P(lm['knee.r']), top = K[1] - o.kneeR * REF.pxPerM, J = P(lm['hip.r']), bt = P(lm.buttock);
    const tx = K[0] - J[0], ty = K[1] - J[1], tl = Math.hypot(tx, ty), sg = -tx / tl > 0 ? -1 : 1;
    const Hp = [J[0] + sg * (ty / tl) * o.creaseM * REF.pxPerM, J[1] + sg * (-tx / tl) * o.creaseM * REF.pxPerM];
    return `<path class="hz-g dash ref" d="M${f(bt[0] - 6)} ${f(top)}H${f(K[0] + 10)}"/>`
      + `<circle class="hz-g dot ${role === 'right' ? 'ok' : 'no'}" cx="${f(Hp[0])}" cy="${f(Hp[1])}" r="3"/>`;
  },
};

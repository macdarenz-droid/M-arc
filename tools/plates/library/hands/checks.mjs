// LIB-7: the C5-style geometry checks of a radial hand pair (hands/DESIGN.md §4 A2) and the counted sweep (A3). Every
// check reads the rendered pair (renderPair's report and the positions measured on its SVG). The sheet, the gate block and
// tests/library/hand-pairs.test.ts all call these.
import { HAND_PROP } from '../../layers/engine/hand.mjs';
import { CAMERA_TEXT, inPoly, labelsOnInk, PALM_UP, pairSpec, poly, renderPair } from './pairs.mjs';

const RAD = Math.PI / 180;
/** The contact category's contactAt (golden-B precedents: chest press .3, lateral raise .6, lat pulldown 1.0). */
export const CONTACT_AT = { heel: -0.1, mid: 0.6, base: 1.0, fingers: 1.15 };

/** items as an array, or a throw when it is empty or not exactly n long (a sweep that sees nothing fails). */
export function sweep(items, n, what) {
  const a = [...items];
  if (a.length === 0) throw new Error(`${what}: nothing to check`);
  if (a.length !== n) throw new Error(`${what}: ${a.length}, expected ${n}`);
  return a;
}

/** Every page of one id, rendered: [{ fault, report, svg }]. */
export function renderedPages(id, index) {
  const s = pairSpec(id, index);
  return { spec: s, pages: s.wrong.map(F => { const uid = `hp-${id.replace(/_/g, '-')}-${F.key}`, r = renderPair(id, { fault: F.key, uid, index }); return { fault: F, uid, report: r.report, svg: r.svg }; }) };
}

/** u (mm along the hand from the wrist) of the drawn contact dot, from the SVG, the pose's forearm direction and its wrist
 *  bend (golden-B makeProj: forearm frame U along the forearm, V turned 90 deg, mirrored for an underhand grip). */
export function contactU(m, pose, k) {
  const th = pose.forearm * RAD, U = [Math.sin(th), Math.cos(th)], mi = pose.mirror ? -1 : 1, V = [mi * U[1], -mi * U[0]];
  const d = [m.contact[0] - m.wrist[0], m.contact[1] - m.wrist[1]], a = (d[0] * U[0] + d[1] * U[1]) / k, b = (d[0] * V[0] + d[1] * V[1]) / k;
  const e = (pose.wrist?.ext ?? 0) * RAD;
  return a * Math.cos(e) + b * Math.sin(e);
}

/** The fist's front, in mm: how wide the Right hand's ink is across the forearm within 4 mm of its farthest point along
 *  it. A squared fist (curl 2, the approved lateral raise) is broad there; a fist closed round a handle in the fingers
 *  tapers to a point (critic run on #193, 10-03; D-LIB7-16). Read from the Right half's <defs> outlines. */
export const FRONT_TOL_MM = 4, SQUARE_FRONT_MM = 20, AXIS_TOL_DEG = 2;
export function fistFrontMm(svg, uid, forearm, k) {
  const th = forearm * RAD, U = [Math.sin(th), Math.cos(th)], V = [U[1], -U[0]];
  const pts = [...svg.matchAll(new RegExp(`<path id="${uid}-r-[a-z0-9-]+" d="([^"]+)"`, 'g'))].flatMap(q => poly(q[1]));
  if (!pts.length) return 0;
  const u = pts.map(p => p[0] * U[0] + p[1] * U[1]), f = Math.max(...u);
  const v = pts.filter((p, i) => u[i] >= f - FRONT_TOL_MM * k).map(p => p[0] * V[0] + p[1] * V[1]);
  return (Math.max(...v) - Math.min(...v)) / k;
}

/** Points (of 360) on a knob's rim that lie outside its half's hand outline (the <defs> paths). */
export function knobRimOutside(svg, uid, k) {
  const inks = [...svg.matchAll(new RegExp(`<path id="${uid}-${k.role[0]}-[a-z0-9-]+" d="([^"]+)"`, 'g'))].map(q => poly(q[1]));
  if (!inks.length) return 360;
  let n = 0;
  for (let i = 0; i < 360; i++) { const t = i * RAD; if (!inks.some(ps => inPoly([k.cx + k.r * Math.cos(t), k.cy + k.r * Math.sin(t)], ps))) n++; }
  return n;
}

/** Problems of one id's pages ([] = ok). Pure on the rendered reports, so a test can plant a defect in them. */
export function problemsOf(spec, pages) {
  if (!pages.length) return [`${spec.id}: no pages`];
  // G1-G9 read golden-B's radial report; a key with its own view (LIB-12) brings its own checks, or none here. Its
  // wristRange may be null, which a destructuring default would not catch (LIB-12 review Blocker, 10-03)
  if (spec.mod.VIEW !== 'radial' || spec.mod.render) return spec.mod.checks ? spec.mod.checks(spec, pages) : [];
  if (!Array.isArray(spec.wristRange) || spec.wristRange.length !== 2) return [`${spec.id}: G1 no wrist range`];
  const bad = [], [lo, hi] = spec.wristRange;
  for (const { fault: F, report: R, svg, uid } of pages) {
    const at = `${spec.id}/${F.key}`, M = R.measured;
    // G1, G2: Right inside the range; Wrong outside it on the side its claim names (so the two cannot swap)
    if (!(R.right.ext >= lo && R.right.ext <= hi)) bad.push(`${at}: G1 right wrist ${R.right.ext} outside ${lo}..${hi}`);
    if (F.side === 'flexed' ? !(R.wrong.ext < lo) : F.side === 'extended' ? !(R.wrong.ext > hi) : true) bad.push(`${at}: G2 wrong wrist ${R.wrong.ext} not ${F.side} past ${lo}..${hi}`);
    if (!['flexed', 'extended'].includes(F.side)) bad.push(`${at}: G2 unknown side ${F.side}`);
    // G3: thumb wrapped (every LIB-7 claim says so)
    if (R.right.thumb !== 'wrapped') bad.push(`${at}: G3 right thumb ${R.right.thumb}`);
    // G4: the drawn contact sits where its category puts it along the palm (HAND_PROP: index knuckle line)
    const want = CONTACT_AT[spec.contact];
    if (want == null) bad.push(`${at}: G4 unknown contact ${spec.contact}`);
    else {
      const u = contactU(M.right, spec.right, R.scalePxPerMm), uWant = (0.5 + 0.5 * want) * HAND_PROP.index.mcp[0] * R.right.HLmm;
      if (!(Math.abs(u - uWant) <= 1)) bad.push(`${at}: G4 right contact at ${u.toFixed(1)} mm, ${spec.contact} is ${uWant.toFixed(1)} mm`);
    }
    if (spec.contact === 'heel' && !(R.wrong.contactAt >= 0.8)) bad.push(`${at}: G4 push wrong contactAt ${R.wrong.contactAt} < .8`);
    // G5: the explicit handle, in both halves
    for (const role of ['right', 'wrong']) {
      if (R[role].handle !== spec.handle.profile || R[role].handleDiameterMm !== spec.handle.diameterMm)
        bad.push(`${at}: G5 ${role} handle ${R[role].handle} ${R[role].handleDiameterMm} mm, want ${spec.handle.profile} ${spec.handle.diameterMm} mm`);
    }
    // G6: lever rules on along-forearm loads; none for loads across the hand
    if (spec.loadAxis === 'along-forearm' && !(R.ok && Object.keys(R.checks).length === 2)) bad.push(`${at}: G6 lever checks ${JSON.stringify(R.checks)}`);
    if (spec.loadAxis === 'across' && Object.keys(R.checks).length) bad.push(`${at}: G6 lever checks on an across load`);
    // G6: a force line only where golden B draws one: loads along the forearm (chest press) and pulls (lat pulldown);
    // none on a gravity curl (lateral raise) or the rope, whose load direction no source gives
    const hasLoad = /class="h-load/.test(svg), wantLoad = spec.loadAxis === 'along-forearm' || spec.mod.VARIANTS[spec.variant].archetype === 'pull';
    if (hasLoad !== wantLoad) bad.push(`${at}: G6 force line ${hasLoad ? 'drawn' : 'missing'}`);
    // G6: a push Right on the heel draws no force line and so no wrist tick, as golden B's squat Right (D-LIB7-18a/b): the
    // contact dot and the pivot stay; a variant that routes its line through the pivot instead gets the pivot checks below
    const Vr = spec.mod.VARIANTS[spec.variant], rightPart = svg.slice(svg.indexOf('<g class="h-panel right">'), svg.indexOf('<g class="h-panel wrong">'));
    if (Vr.archetype === 'push' && spec.contact === 'heel' && !Vr.loadThroughPivot) {
      if (/class="h-load"/.test(rightPart)) bad.push(`${at}: G6 push Right draws a force line`);
      if (/class="h-tick"/.test(rightPart)) bad.push(`${at}: G6 push Right with no force line draws a wrist tick`);
      if (!/class="h-contact"/.test(rightPart)) bad.push(`${at}: G6 push Right lost its contact dot`);
    }
    // G6: a Right line routed through the wrist pivot passes within 0.5 px of it and runs along the forearm axis (D-LIB7-14, 18)
    if (Vr.loadThroughPivot) {
      const P = R.pivot, W = M.right.wrist;
      if (!P) bad.push(`${at}: G6 force line not re-aimed through the pivot`);
      else {
        const [A, E] = [P.from, P.to], dx = E[0] - A[0], dy = E[1] - A[1], t = ((W[0] - A[0]) * dx + (W[1] - A[1]) * dy) / (dx * dx + dy * dy);
        const off = Math.hypot(A[0] + t * dx - W[0], A[1] + t * dy - W[1]);
        if (!(off <= 0.5 && t > 0 && t < 1)) bad.push(`${at}: G6 Right force line ${off.toFixed(1)} px from the wrist pivot`);
        if (!svg.includes(`d="M${A[0]} ${A[1]}L${E[0]} ${E[1]}"`)) bad.push(`${at}: G6 re-aimed force line not drawn`);
        // and straight down the forearm axis, as the Wrong's line is (D-LIB7-18)
        const th = spec.right.forearm * RAD, ang = Math.abs(Math.asin((dx * -Math.cos(th) - dy * -Math.sin(th)) / Math.hypot(dx, dy))) / RAD;
        if (!(ang <= AXIS_TOL_DEG && dx * -Math.sin(th) + dy * -Math.cos(th) > 0)) bad.push(`${at}: G6 Right force line ${ang.toFixed(1)} deg off the forearm axis`);
      }
    }
    // G7: a rope reads as a rope: one plain section (no rigid-handle core) and its knob, coaxial, at the composer's size,
    // dashed over the fist in both halves (D-LIB7-13)
    if (spec.handle.profile === 'rope') {
      if (!spec.handle.knobMm) bad.push(`${at}: G7 rope without a knob`);
      if (/class="h-eq-core"/.test(svg)) bad.push(`${at}: G7 rope drawn with a handle core`);
      const K = R.knobs ?? [];
      if (K.length !== 2) bad.push(`${at}: G7 ${K.length} knobs, expected 2`);
      for (const k of K) {
        const h = M[k.role].handle;
        if (!h || Math.hypot(k.cx - h[0], k.cy - h[1]) > 0.01 || Math.abs(k.r - spec.handle.knobMm / 2 * R.scalePxPerMm) > 0.01) bad.push(`${at}: G7 ${k.role} knob off the rope`);
        if (!svg.includes(`<circle class="h-eq-thin" cx="${k.cx}" cy="${k.cy}" r="${k.r}"/>`)) bad.push(`${at}: G7 ${k.role} knob not drawn`);
        // the knob is drawn dashed whole, so none of its rim may reach past the fist (D-LIB7-17a: a rim that shows is solid)
        const out = knobRimOutside(svg, uid, k);
        if (out > 0) bad.push(`${at}: G7 ${k.role} knob rim shows past the fist on ${out} of 360 points but is drawn dashed`);
      }
    }
    // G7: a level fist (curls, the rope) closes square at the front, as curl 2 does (D-LIB7-16)
    if (spec.right.forearm === 90 && uid) {
      const w = fistFrontMm(svg, uid, 90, R.scalePxPerMm);
      if (!(w >= SQUARE_FRONT_MM)) bad.push(`${at}: G7 fist front ${w.toFixed(1)} mm wide, a square fist is at least ${SQUARE_FRONT_MM} mm`);
    }
    // G9: no bend value over the hand's outline (estimated boxes; the gate measures the real ones)
    for (const l of uid ? labelsOnInk(svg, uid) : []) bad.push(`${at}: G9 ${l.role} label ${l.text} on the hand`);
    // G8: palm direction (forearm level: underhand and the EZ angled grip = palm up, handle above the wrist; D-LIB7-16)
    // and the camera label
    if (spec.right.forearm === 90 && ['under', 'over', 'angled'].includes(spec.orientation)) {
      const up = M.right.handle[1] < M.right.wrist[1];
      if (up !== PALM_UP.has(spec.orientation)) bad.push(`${at}: G8 palm ${up ? 'up' : 'down'} for ${spec.orientation === 'angled' ? 'the angled grip' : `${spec.orientation}hand`}`);
    }
    const cam = svg.match(/aria-label="([^.]*)\./)?.[1];
    const camWant = CAMERA_TEXT[spec.orientation] ?? (spec.camera === 'above' ? 'Seen from above' : 'Seen from the side');
    if (cam !== camWant) bad.push(`${at}: G8 camera "${cam}", want "${camWant}"`);
    // a level forearm shows the palm up or down, so it needs a stated orientation (D-LIB7-12); golden B's YOU/MACHINE
    // row only where there is a machine (D-LIB7-11)
    if (spec.orientation === 'unstated' && spec.right.forearm === 90) bad.push(`${at}: G8 a level forearm with no stated orientation`);
    const machineRow = />MACHINE</.test(svg), V = spec.mod.VARIANTS[spec.variant];
    if (machineRow && !V.machine) bad.push(`${at}: G8 a YOU/MACHINE row with no machine`);
    if (spec.camera === 'above' && V.machine && !machineRow) bad.push(`${at}: G8 the YOU/MACHINE row is missing`);
  }
  return bad;
}

/** Problems of one drawn id ([] = ok). */
export function pairProblems(id, index) {
  const { spec, pages } = renderedPages(id, index);
  return problemsOf(spec, pages);
}

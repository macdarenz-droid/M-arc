// LIB-7: the C5-style geometry checks of a radial hand pair (hands/DESIGN.md §4 A2) and the counted sweep (A3). Every
// check reads the rendered pair (renderPair's report and the positions measured on its SVG). The sheet, the gate block and
// tests/library/hand-pairs.test.ts all call these.
import { HAND_PROP } from '../../layers/engine/hand.mjs';
import { labelsOnInk, pairSpec, renderPair, THUMB_SIDE } from './pairs.mjs';

const RAD = Math.PI / 180;
/** The contact category's contactAt (golden-B precedents: chest press .3, lateral raise .6, lat pulldown 1.0). */
export const CONTACT_AT = { heel: 0.3, mid: 0.6, base: 1.0 };

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

/** u (mm along the hand from the wrist) of the drawn contact dot, from the SVG and the pose's forearm direction. */
export function contactU(m, pose, k) {
  const th = pose.forearm * RAD, U = [Math.sin(th), Math.cos(th)];
  return ((m.contact[0] - m.wrist[0]) * U[0] + (m.contact[1] - m.wrist[1]) * U[1]) / k;
}

/** Problems of one id's pages ([] = ok). Pure on the rendered reports, so a test can plant a defect in them. */
export function problemsOf(spec, pages) {
  const bad = [], [lo, hi] = spec.wristRange;
  if (!pages.length) return [`${spec.id}: no pages`];
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
    // G9: no bend value over the hand's outline (estimated boxes; the gate measures the real ones)
    for (const l of uid ? labelsOnInk(svg, uid) : []) bad.push(`${at}: G9 ${l.role} label ${l.text} on the hand`);
    // G8: palm direction (forearm level: underhand = palm up, handle above the wrist) and the camera label
    if (spec.right.forearm === 90 && ['under', 'over'].includes(spec.orientation)) {
      const up = M.right.handle[1] < M.right.wrist[1];
      if (up !== (spec.orientation === 'under')) bad.push(`${at}: G8 palm ${up ? 'up' : 'down'} for ${spec.orientation}hand`);
    }
    const cam = svg.match(/aria-label="([^.]*)\./)?.[1];
    const camWant = spec.orientation === 'unstated' ? THUMB_SIDE : spec.camera === 'above' ? 'Seen from above' : 'Seen from the side';
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

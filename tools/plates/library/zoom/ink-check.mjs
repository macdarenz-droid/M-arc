// F-ZOOM-INK (D-ZOOM-INK; #329): PQ-H1's label-on-ink check and a zoom circle. A zoom's magnified render is clipped to
// its circle, and qa/browser.mjs counts that render as ink only inside the circle. These probes run the H1 half of
// LIB-3's browser QA (390 px) on the zoom page (horizontal_leg_press's Mistake zoom, circle (166, 130) r 52) with the
// Mistake tell moved in the built HTML. Each probe is { case, at: [x, y] (tell box left/top, plate px), css?, want }:
//   clipped  the tell over clipped-away render only: clean (red with the fix reverted)
//   drawn    zoom background and ring stroke off (CSS), so only the render is ink: 1 px apart, clean then red on render
//            ink inside the circle (hit <= r; red only if the fix keeps the render inside the circle)
//   ring     1 px apart, clean then red on the ring
//   plate    1 px apart, clean then red on plate ink outside the circle
// Used by tests/gate/zoom-ink.mjs and the gate block F-ZOOM-INK.
import { makeMirror } from '../../golden.mjs';
import { candidateOf } from '../candidate.mjs';
import { browserResults } from '../qa/browser.mjs';
import { dropMirror, loadEngine } from '../qa/engine.mjs';
import { loadPins } from '../qa/index.mjs';
import { buildZoomPage, zoomAll } from './build.mjs';
import { sha256 } from '../lb1/build.mjs';

export const ID = 'lib_horizontal_leg_press', TELL = 'horizontal-leg-press-m-lock', CIRCLE = { c: [166, 130], r: 52 };
export const PAGE_SHA = 'a0ef8eabc3b6935193531cd9236a27c5e67b5102f8b9f9c9ec7f3de031ccece0';
const BARE = '.plate .pz-bg { fill: none; } .plate .pz-ring { stroke: none; }';
export const PROBES = [
  { case: 'clipped', at: [270, 60], want: 'clean' },
  { case: 'drawn', at: [212, 112], css: BARE, want: 'clean' },
  { case: 'drawn', at: [211, 112], css: BARE, want: 'in' },
  { case: 'ring', at: [213, 112], want: 'clean' },
  { case: 'ring', at: [212, 112], want: 'ring' },
  { case: 'plate', at: [270, 207], want: 'clean' },
  { case: 'plate', at: [270, 208], want: 'out' },
];

const pc = v => +(v / 358 * 100).toFixed(4);
/** The page with the Mistake tell's box at plate px (x, y). */
export const tellAt = (html, [x, y]) => {
  const re = new RegExp(`(id="${TELL}"[^>]*style=")left:[\\d.]+%;top:[\\d.]+%`);
  if (!re.test(html)) throw new Error(`zoom-ink: no ${TELL} button on the page`);
  return html.replace(re, `$1left:${pc(x)}%;top:${pc(y)}%`);
};
/** Distance of an H1 ink hit ("... at x,y") from the circle centre, or null. */
export const hitDist = text => { const m = /at (\d+),(\d+)$/.exec(text); return m ? Math.hypot(+m[1] - CIRCLE.c[0], +m[2] - CIRCLE.c[1]) : null; };

/** Runs PROBES; returns { sha, clean, rows: [{ ...probe, hit, d, ok }], problems }. `reverted`: the fix is reverted,
 *  so 'clipped' must be red (the other rows are reported, not judged). */
export async function zoomInk(browser, { reverted = false } = {}) {
  const all = zoomAll(), page = await buildZoomPage({ all, ids: [ID] }), base = page.html.toString('utf8');
  const mirror = makeMirror(), problems = [], rows = [];
  try {
    const E = await loadEngine(mirror), env = loadPins().envelope;
    const h1 = async (html, css = null) => {
      const c = await candidateOf(ID, { all, platesHtml: html, engine: E, authoring: true });
      if (!c.plate.zoom?.mistake) throw new Error('zoom-ink: horizontal_leg_press has no Mistake zoom on its page');
      // 390 px only: the 360 and 340 px rows report 'not measured' and are left out
      return (await browserResults(browser, html, [c], E, env, { widths: [390], css })).get(c.id).H1.map(p => p.text).filter(t => !/: not measured$/.test(t));
    };
    const sha = sha256(page.html), clean = await h1(base);
    if (sha !== PAGE_SHA) problems.push(`zoom page sha256 ${sha} != main's ${PAGE_SHA}`);
    if (clean.length) problems.push(`H1 on the zoom page as built: ${clean.join('; ')}`);
    for (const p of PROBES) {
      const hit = (await h1(tellAt(base, p.at), p.css)).find(t => t.startsWith('mistake:lock text box sits on figure ink')) ?? null;
      const d = hit ? hitDist(hit) : null;
      const ok = reverted ? (p.case !== 'clipped' || !!hit)
        : p.want === 'clean' ? !hit : p.want === 'in' ? d !== null && d <= CIRCLE.r : p.want === 'ring' ? d !== null && Math.abs(d - CIRCLE.r) <= 1.5 : d !== null && d > CIRCLE.r + 1.5;
      rows.push({ ...p, css: !!p.css, hit, d: d === null ? null : +d.toFixed(2), ok });
      if (!ok && (!reverted || p.case === 'clipped')) problems.push(`${p.case} at ${p.at}: want ${reverted ? 'red' : p.want}, got ${hit ?? 'clean'}`);
    }
    return { sha, clean, rows, problems };
  } finally { dropMirror(mirror); }
}

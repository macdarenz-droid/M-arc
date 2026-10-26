// F-ZOOM-INK (D-ZOOM-INK, #327): PQ-H1's label-on-ink check and a zoom circle. A zoom's magnified render is clipped
// to its circle, but SVG isPointInFill/isPointInStroke ignore the clip, so geometry that is never drawn counted as ink.
// qa/browser.mjs counts it only inside the circle. This script runs the H1 half of LIB-3's browser QA on the zoom page
// (horizontal_leg_press, the one zoom on main) with one label moved in the built HTML:
//   clean          the page as built: no H1 problem; the zoom page sha and the QA table as on main
//   clipped        the Mistake tell over clipped-away zoom geometry only (no drawn ink): clean with the fix, red
//                  with the fix reverted (run this script in a worktree with the two clip lines removed)
//   ring           the tell stepped 1 px at a time onto the zoom circle: clean, then red at the next px
//   plate          the tell stepped 1 px at a time onto plate ink outside the circle: clean, then red at the next px
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tests/gate/zoom-ink.mjs [probe x y ...]
// With the fix reverted, set ZOOM_INK_REVERTED=1: PASS then needs 'clipped' red.
import { makeMirror } from '../../tools/plates/golden.mjs';
import { candidateOf } from '../../tools/plates/library/candidate.mjs';
import { browserResults, launch } from '../../tools/plates/library/qa/browser.mjs';
import { dropMirror, loadEngine } from '../../tools/plates/library/qa/engine.mjs';
import { loadPins, runQa } from '../../tools/plates/library/qa/index.mjs';
import { buildZoomPage, zoomAll } from '../../tools/plates/library/zoom/build.mjs';
import { sha256 } from '../../tools/plates/library/lb1/build.mjs';

const ID = 'lib_horizontal_leg_press', TELL = 'horizontal-leg-press-m-lock', all = zoomAll();
const page = await buildZoomPage({ all, ids: [ID] }), base = page.html.toString('utf8');
const mirror = makeMirror(), E = await loadEngine(mirror), pins = loadPins(), browser = await launch();
const pc = v => +(v / 358 * 100).toFixed(4);
const at = (x, y) => base.replace(new RegExp(`(id="${TELL}"[^>]*style=")left:[\\d.]+%;top:[\\d.]+%`), `$1left:${pc(x)}%;top:${pc(y)}%`);
const h1 = async html => {
  const c = await candidateOf(ID, { all, platesHtml: html, engine: E, authoring: true });
  const b = await browserResults(browser, html, [c], E, pins.envelope);
  return (await runQa(c, { engine: E, pins, browser: b })).hard['PQ-H1'].problems.map(p => p.text);
};
const ink = ps => ps.filter(t => t.startsWith('mistake:lock text box sits on figure ink'));
try {
  if (process.argv[2] === 'probe') { for (let i = 3; i + 1 < process.argv.length; i += 2) console.log(process.argv[i], process.argv[i + 1], JSON.stringify(await h1(at(+process.argv[i], +process.argv[i + 1])))); }
  else {
    const C = [166, 130], R = 52, out = [];   // the Mistake zoom circle on main (pz-ring)
    const inCircle = t => { const m = /at (\d+),(\d+)$/.exec(t); return m ? Math.hypot(+m[1] - C[0], +m[2] - C[1]) <= R + 1 : null; };
    // smallest step d in [1, max] with H1 ink on the tell, d - 1 clean (bisection on a monotone walk)
    const walk = async (from, dir, max) => {
      const red = async d => ink(await h1(at(from[0] + dir[0] * d, from[1] + dir[1] * d)));
      if ((await red(0)).length) return { error: 'red at the start' };
      let lo = 0, hi = max, hit = await red(hi);
      if (!hit.length) return { error: `clean at ${max}` };
      while (hi - lo > 1) { const mid = (lo + hi) >> 1, r = await red(mid); if (r.length) { hi = mid; hit = r; } else lo = mid; }
      return { clean: lo, red: hi, text: hit[0], inCircle: inCircle(hit[0]) };
    };
    const clean = await h1(base);
    out.push(`clean: zoom page sha256 ${sha256(page.html)}; H1 ${JSON.stringify(clean)}`);
    const clipped = ink(await h1(at(270, 60)));
    out.push(`clipped (tell at 270,60, over clipped-away zoom geometry only): ${JSON.stringify(clipped)}`);
    const ring = await walk([240, 112], [-1, 0], 40), plate = await walk([270, 60], [0, 1], 160);
    out.push(`ring (from 240,112 left): ${JSON.stringify(ring)}`, `plate (from 270,60 down): ${JSON.stringify(plate)}`);
    for (const l of out) console.log(l);
    const fixed = !process.env.ZOOM_INK_REVERTED;
    const ok = clean.length === 0 && sha256(page.html) === 'a0ef8eabc3b6935193531cd9236a27c5e67b5102f8b9f9c9ec7f3de031ccece0'
      && (fixed ? clipped.length === 0 && ring.red === ring.clean + 1 && ring.inCircle === true && plate.red === plate.clean + 1 && plate.inCircle === false
        : clipped.length > 0);   // reverted, the walks start red: they cross the clipped geometry
    console.log(ok ? `PASS (${fixed ? 'fix' : 'fix reverted: clipped is red'})` : 'FAIL');
    process.exitCode = ok ? 0 : 1;
  }
} finally { await browser.close(); dropMirror(mirror); }

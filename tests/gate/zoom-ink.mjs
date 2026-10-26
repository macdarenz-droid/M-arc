// F-ZOOM-INK (D-ZOOM-INK, #329): runs tools/plates/library/zoom/ink-check.mjs (the same probes as the gate block
// F-ZOOM-INK) and prints each row. PQ-H1 must count a zoom's clipped render as ink only inside its circle.
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tests/gate/zoom-ink.mjs
// With the fix reverted (the two clip lines removed from qa/browser.mjs), set ZOOM_INK_REVERTED=1: PASS then needs
// 'clipped' red. A fix that drops all zoom render ink fails the 'drawn' row.
import { launch } from '../../tools/plates/library/qa/browser.mjs';
import { zoomInk } from '../../tools/plates/library/zoom/ink-check.mjs';

const reverted = !!process.env.ZOOM_INK_REVERTED, browser = await launch();
try {
  const r = await zoomInk(browser, { reverted });
  console.log(`zoom page sha256 ${r.sha}; H1 as built: ${JSON.stringify(r.clean)}`);
  for (const row of r.rows) console.log(`${row.case}${row.css ? ' (bg and ring off)' : ''} at ${row.at}: ${row.hit ?? 'clean'}${row.d === null ? '' : ` (${row.d} px from the centre)`} ${row.ok ? 'ok' : 'WRONG'}`);
  for (const p of r.problems) console.log(`problem: ${p}`);
  console.log(r.problems.length ? 'FAIL' : `PASS (${reverted ? 'fix reverted: clipped is red' : 'fix'})`);
  process.exitCode = r.problems.length ? 1 : 0;
} finally { await browser.close(); }

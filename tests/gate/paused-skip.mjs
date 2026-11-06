// LIB-SHIP W3 D-SHIP-W3-PAUSEDSKIP (#384 6687335829): runs tools/plates/fidelity/paused-skip.mjs (the same probes as the
// gate block LIB-SHIP-W3-PAUSEDSKIP) and prints each row.
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tests/gate/paused-skip.mjs            (this tree's harness)
//   PAUSED_SKIP_HARNESS=<path to another harness.mjs> node tests/gate/paused-skip.mjs  (e.g. main's: case 3 is red there)
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { pausedSkip } from '../../tools/plates/fidelity/paused-skip.mjs';

const H = await import(process.env.PAUSED_SKIP_HARNESS ? pathToFileURL(process.env.PAUSED_SKIP_HARNESS).href : '../../tools/plates/fidelity/harness.mjs');
const browser = await chromium.launch({ executablePath: process.env.MARC_CHROMIUM || '/opt/pw-browsers/chromium' });
try {
  const r = await pausedSkip(browser, H);
  for (const row of r.rows) console.log(`${row.settled === row.want ? 'ok  ' : 'RED '} ${row.case} / ${row.fn}: settled ${row.settled}, expected ${row.want}`);
  console.log(r.problems.length ? `FAIL (${r.problems.length} rows)` : 'PASS');
  process.exitCode = r.problems.length ? 1 : 0;
} finally { await browser.close(); }

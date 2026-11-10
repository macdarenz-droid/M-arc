// LIB-SHIP W6 D-SHIP-W6-RISKS / D-SHIP-W6-F2 (#393 6703065396, 6703104795): runs tools/plates/library/fidelity/ship-w6.mjs
// (the same checks as the gate block LIB-SHIP-W6-RISKS-F2) and prints each row.
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tests/gate/ship-w6.mjs
import { chromium } from 'playwright';
import { f2Rows, risksRows } from '../../tools/plates/library/fidelity/ship-w6.mjs';

const browser = await chromium.launch({ executablePath: process.env.MARC_CHROMIUM || '/opt/pw-browsers/chromium' });
try {
  const r = await risksRows(browser, await import('../../tools/plates/fidelity/harness.mjs'));
  for (const row of r.rows) console.log(`RISKS ${row.name}: ${JSON.stringify(row.got)}`);
  const f = await f2Rows();
  for (const row of f.rows) console.log(`F2 ${row.id} ${row.drop ? 'without F2' : 'with the pin'}: ${JSON.stringify(row.got)}`);
  const problems = [...r.problems, ...f.problems];
  for (const p of problems) console.log(`RED ${p}`);
  console.log(problems.length ? `FAIL (${problems.length})` : 'PASS');
  process.exitCode = problems.length ? 1 : 0;
} finally { await browser.close(); }

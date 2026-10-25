// LIB-7c gate (hands/DESIGN.md §10; card 7c-A8): LIB-7's lib7Gate over the LIB-7c keys only (`owner: 'LIB-7c'`, gate.mjs:79).
// gate.mjs's own main runs LIB-7's keys, and its name is not a key module's (pairs.mjs KEY_FILE), so LIB-7c has its own.
//   node tools/plates/library/hands/lib7c-gate.mjs [<browser path>]
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { lib7Gate } from './gate.mjs';
import { INDEX, ROOT } from './pairs.mjs';

export const OWNER = 'LIB-7c';
/** The pages the LIB-7c block must check: one per fault of each drawn LIB-7c id. */
export const expectedPages = (index = INDEX) => [...index.drawn.values()].filter(e => e.mod.OWNER === OWNER).reduce((n, e) => n + e.cfg.faults.length, 0);
export const lib7cGate = (browser, opts = {}) => lib7Gate(browser, { ...opts, owner: OWNER });

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { chromium } = createRequire(join(ROOT, 'package.json'))('playwright');
  const b = await chromium.launch({ executablePath: process.argv[2] ?? '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--disable-lcd-text'] });
  try {
    const t0 = Date.now(), r = await lib7cGate(b), want = expectedPages();
    if (r.pages !== want) r.problems.push(`LIB-7c: ${r.pages} pages, expected ${want}`);
    console.log(`${b.version()}: ${r.pages} pages x ${r.themes} themes x ${r.widths} widths, ${r.shots} shots, ${(Date.now() - t0) / 1000} s`);
    console.log(r.problems.length ? r.problems.join('\n') : 'LIB-7c gate: PASS');
    process.exitCode = r.problems.length ? 1 : 0;
  } finally { await b.close(); }
}

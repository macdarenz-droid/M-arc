// LIB-SHIP W3 D-SHIP-W3-PAUSEDSKIP (#384 6687335829): the probes behind harness.mjs nothingToWaitFor, shared by the gate
// block LIB-SHIP-W3-PAUSEDSKIP and tests/gate/paused-skip.mjs. On a scratch page:
//   1 a running animation (in view) still blocks settle and settleApp;  2 a paused animation in view still blocks them;
//   3 a paused animation fully below the viewport no longer blocks them (main's harness blocks it: the W3 change);
//   4 mutation: the predicate without the viewport condition lets case 2 through (so red 2 bites).
const PAGE = where => `<!doctype html><style>@keyframes k { to { transform: translateX(40px); } } body { margin: 0; height: 3000px; }
  #a { position: absolute; left: 10px; top: ${where === 'below' ? 2000 : 20}px; width: 40px; height: 40px; background: #888; animation: k 60s linear infinite; }</style><div id="a"></div>`;
/** The ruled mutation: every paused animation skipped, the viewport condition dropped. */
export const noViewport = () => document.getAnimations().every(a => a.playState === 'paused');
export const CASES = Object.freeze([
  { name: '1 running, in view', where: 'in', paused: false, settles: false },
  { name: '2 paused, in view', where: 'in', paused: true, settles: false },
  { name: '3 paused, fully below the viewport', where: 'below', paused: true, settles: true },
]);

/** { rows, problems } for `H` (a harness module with settle and settleApp) on `browser`. */
export async function pausedSkip(browser, H) {
  const run = async (c, fn) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }), page = await ctx.newPage();
    try {
      await page.setContent(PAGE(c.where));
      if (c.paused) await page.evaluate(() => document.getAnimations().forEach(a => a.pause()));
      return await fn(page).then(() => true, () => false);
    } finally { await ctx.close(); }
  };
  const rows = [];
  for (const c of CASES) for (const [label, fn] of [['settle', H.settle], ['settleApp', H.settleApp]]) {
    const settled = await run(c, fn);
    rows.push({ case: c.name, fn: label, settled, want: c.settles });
  }
  const m = await run(CASES[1], p => p.waitForFunction(noViewport, null, { timeout: 2000 }));
  rows.push({ case: '4 mutation (no viewport condition) on case 2', fn: 'waitForFunction', settled: m, want: true });
  const problems = rows.filter(r => r.settled !== r.want).map(r => `${r.case} / ${r.fn}: settled ${r.settled}, expected ${r.want}`);
  return { rows, problems };
}

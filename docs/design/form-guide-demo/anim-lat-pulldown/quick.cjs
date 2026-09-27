// quick.cjs: one or more screenshots of the player. Usage: node quick.cjs "<query>" out.png [scale]
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : {});
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i += 2) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 520 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto('file://' + path.join(__dirname, 'index.html') + args[i]); await p.waitForTimeout(600);
    await (await p.$('.player')).screenshot({ path: args[i + 1] });
    if (errs.length) console.log('ERR', args[i], errs);
    await ctx.close();
  }
  await b.close();
})();

// crop.cjs: 4x crop of the stage around (x0,y0,w,h) in stage px. Usage: node crop.cjs "<query>" out.png x0 y0 w h ...
const { chromium } = require('/home/user/M-arc/node_modules/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i += 6) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 520 }, deviceScaleFactor: 4 });
    const p = await ctx.newPage();
    await p.goto('file://' + path.join(__dirname, 'index.html') + a[i]); await p.waitForTimeout(500);
    const r = await (await p.$('.stage')).boundingBox();
    await p.screenshot({ path: a[i + 1], clip: { x: r.x + +a[i + 2], y: r.y + +a[i + 3], width: +a[i + 4], height: +a[i + 5] } });
    await ctx.close();
  }
  await b.close();
})();

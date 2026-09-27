// node crop.cjs <file> <query> <out> x y w h [scale]   (x,y,w,h in stage px)
const { chromium } = require('playwright');
(async () => {
  const [file, query, out, x, y, w, h, sc] = process.argv.slice(2);
  const b = await chromium.launch(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : {});
  const p = await b.newPage({ viewport: { width: 390, height: 520 }, deviceScaleFactor: +(sc || 4) });
  await p.goto('file://' + __dirname + '/' + file + query); await p.waitForTimeout(500);
  const r = await (await p.$('.stage')).boundingBox();
  await p.screenshot({ path: out, clip: { x: r.x + +x, y: r.y + +y, width: +w, height: +h } });
  await b.close();
})();

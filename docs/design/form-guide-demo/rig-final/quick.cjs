// quick look: node quick.cjs <file> <query> <out> [scale]
const { chromium } = require('/home/user/M-arc/node_modules/playwright');
(async () => {
  const [file, query, out, scale] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 390, height: 520 }, deviceScaleFactor: +(scale || 2) });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + __dirname + '/' + file + (query || ''));
  await p.waitForTimeout(500);
  await (await p.$('.player') || p).screenshot({ path: out });
  if (errs.length) console.log('ERR', errs);
  await b.close();
})();

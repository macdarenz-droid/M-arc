// LIB-4b twin of gate group HT-3b, A4a (pinned in ../twins.mjs): with the service worker in control, the app reloads
// offline and this id's How-to sheet opens from its Train card, and opening it adds no localStorage key. The rest of
// HT-3b is build-wide or once per run (exemption X4).
import { DEVICE, HT_CUSTOM, closeHowTo, htSeed, openCard } from '../../../fidelity/harness.mjs';
import { WIDTH } from '../tuples.mjs';
import { stateOf } from '../rows.mjs';

const htFlow = async page => {
  await page.waitForSelector('.nav');
  await page.waitForFunction(() => !document.getElementById('launch'), null, { timeout: 5000 }).catch(() => {});
  await page.locator('nav.nav button', { hasText: 'Train' }).click();
  await page.getByRole('button', { name: /^Start / }).first().click();
  for (let i = 0; i < 2; i++) {
    await page.waitForTimeout(300);
    const skip = page.getByRole('button', { name: 'Skip', exact: true });
    if (await skip.isVisible().catch(() => false)) { await skip.click(); continue; }
    const start = page.getByRole('button', { name: /^Start / }).first();
    if (await start.isVisible().catch(() => false)) await start.click();
  }
  await page.locator('.card.exercise').first().waitFor({ state: 'visible', timeout: 5000 });
};

export async function run({ browser, port, R, order, custom = HT_CUSTOM }, { lib, index, theme }) {
  const st = stateOf('offline', 'open', WIDTH), bad = [];
  const ctx = await browser.newContext({ viewport: DEVICE.viewport, deviceScaleFactor: DEVICE.deviceScaleFactor, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => bad.push(`A4: ${e.message}`));
  const failed = [];
  page.on('requestfailed', r => failed.push(`${new URL(r.url()).pathname} ${r.failure()?.errorText ?? ''}`.trim()));
  try {
    await page.addInitScript(htSeed, [theme, order, custom]);
    await page.goto(`http://localhost:${port}/`);
    await page.waitForSelector('.nav');
    await page.waitForFunction(() => !document.getElementById('launch'), null, { timeout: 5000 }).catch(() => {});
    const controlled = await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 }).then(() => true).catch(() => false);
    if (!controlled) bad.push('A4: the service worker never took control');
    await ctx.setOffline(true);
    await page.reload();
    await page.waitForSelector('.nav', { timeout: 10000 }).catch(async () => {
      // what the page holds when it fails (B2 delta, 10-18: not reproduced on LIB-4c's scratch here), so a recurrence names its cause
      const d = await page.evaluate(async () => ({
        url: location.href, title: document.title, body: (document.body?.innerText ?? '').slice(0, 120), controller: !!navigator.serviceWorker?.controller,
        regs: (await navigator.serviceWorker.getRegistrations()).map(r => ({ active: r.active?.state ?? null, waiting: r.waiting?.state ?? null, installing: r.installing?.state ?? null })),
        caches: await Promise.all((await caches.keys()).map(async k => `${k}:${(await (await caches.open(k)).keys()).length}`)),
      })).catch(e => `state not readable: ${e.message.split('\n')[0]}`);
      bad.push(`A4: offline reload did not render the app; page ${JSON.stringify(d).slice(0, 600)}; failed requests ${JSON.stringify(failed.slice(0, 8))}`);
    });
    if (bad.some(b => b.startsWith('A4: offline reload did not render'))) throw new Error('A4: no app to continue with offline');
    await htFlow(page);
    const keysBefore = await page.evaluate(() => Object.keys(localStorage).sort());
    await openCard(page, index);
    await page.locator('.card.exercise').nth(index).locator('button.ht-entry').click();
    await page.locator('dialog.sheet.ht .ht-golden figure[data-mode="normal"]').waitFor({ state: 'visible', timeout: 8000 }).catch(() => bad.push('A4: the How-to sheet did not open offline'));
    await closeHowTo(page);
    const keysAfter = await page.evaluate(() => Object.keys(localStorage).sort());
    if (JSON.stringify(keysBefore) !== JSON.stringify(keysAfter)) bad.push(`A4: localStorage keys changed opening the sheet: ${JSON.stringify(keysBefore)} -> ${JSON.stringify(keysAfter)}`);
  } catch (e) { bad.push(e.message.split('\n')[0]); } finally { await ctx.close(); }
  R.check(lib, theme, st, bad);
}

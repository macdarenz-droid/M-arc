// Visual and migration gate: builds must already exist in www/. Boots the app
// with realistic data in the previous app's storage format, walks every screen
// in all five themes, saves screenshots as evidence and fails on any page error.
// Run: node scripts/screenshot-gate.mjs   (set MARC_CHROMIUM to a chrome binary to skip the bundled one)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, 'screenshots');
mkdirSync(OUT, { recursive: true });
const PORT = process.env.MARC_GATE_PORT || '4173';
const server = spawn(process.execPath, [join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--port', PORT, '--strictPort'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
process.on('exit', () => { try { server.kill('SIGKILL'); } catch { /* already gone */ } });
server.stdout.on('data', d => process.stdout.write(`[preview] ${d}`));
server.stderr.on('data', d => process.stderr.write(`[preview] ${d}`));
let stopping = false;
server.on('exit', code => { if (code && !stopping) { console.error(`preview server exited with ${code}`); process.exit(1); } });
for (let i = 0; ; i++) {
  try { const r = await fetch(`http://localhost:${PORT}/`); if (r.ok) break; } catch { /* not yet */ }
  if (i > 120) { console.error('preview server did not start'); process.exit(1); }
  await new Promise(r => setTimeout(r, 250));
}
console.log('preview ready on', PORT);

/** F12: a PNG's width and height from its header, or null when the bytes are not a PNG. */
const pngSize = (buf) => (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47 && buf.readUInt32BE(4) === 0x0d0a1a0a ? { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) } : null);
/** F12: the share sheet is open and every card preview has drawn. */
const shareSheetReady = (page) => page.waitForFunction(() => { const imgs = [...document.querySelectorAll('dialog[open] .share-slide img')]; return imgs.length === 3 && imgs.every(i => i.complete && i.naturalWidth > 0); }, null, { timeout: 8000 }).then(() => true).catch(() => false);

/** PL-18: wait up to 5 s for something that should appear, instead of a fixed sleep + isVisible. */
const visible = (locator, timeout = 5000) => locator.waitFor({ state: 'visible', timeout }).then(() => true).catch(() => false);

/** F5: let a short-lived animation finish before a screenshot, instead of guessing a fixed delay.
 * Ignores long-running (rest bar) and paused animations, so it never becomes a second fixed wait. */
const settle = (page) => page.evaluate(() => Promise.race([
  Promise.all(document.getAnimations().filter(a => a.playState === 'running' && a.effect && a.effect.getComputedTiming().endTime <= 1000).map(a => a.finished.catch(() => {}))),
  new Promise(r => setTimeout(r, 1000)),
])).catch(() => {});

const sha1 = (buf) => createHash('sha1').update(buf).digest('hex');

/** A3: a realistic single-finger touch drag via CDP — Playwright's mouse() only ever produces
 * mouse/pointer input, never a real Touch, and our gesture code (A3/I7/F13) reads touch identity
 * and Pointer Events that a synthesized mouse drag won't exercise the same way. Linear from
 * (x0,y0) to (x1,y1) over `ms`, in ~16ms steps. */
async function touchDrag(page, x0, y0, x1, y1, ms) {
  const cdp = await page.context().newCDPSession(page);
  try {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y: y0 }] });
    if (ms <= 150) {
      // A fast flick: one round-trip straight to the end point. Each CDP call carries its own
      // real (unpaced) latency here (tens of ms) — spreading a short, fast gesture over several
      // small steps would let that latency dilute the measured velocity below the fling
      // threshold, exactly backwards from what a real flick produces.
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x1, y: y1 }] });
    } else {
      const steps = Math.min(10, Math.max(3, Math.round(ms / 150)));
      for (let i = 1; i <= steps; i++) {
        const x = x0 + (x1 - x0) * (i / steps);
        const y = y0 + (y1 - y0) * (i / steps);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
        await new Promise(r => setTimeout(r, ms / steps));
      }
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } finally {
    await cdp.detach().catch(() => {});
  }
}

// Realistic legacy data so the migration path is exercised end to end.
const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const iso = (offset, h = 17) => { const d = new Date(); d.setDate(d.getDate() - offset); d.setHours(h, 30, 0, 0); return d.toISOString(); };
const rec = (i, offset, dayKey, name, type, muscle, sets, kg0) => ({ id: `r${i}`, day: dayKey, dayKey: day(offset), name, type, muscle, finalizedAt: iso(offset), sets: Array.from({ length: sets }, (_, k) => ({ kg: kg0, reps: 8 + (k % 2), effort: k === sets - 1 ? 'max' : 'ideal' })) });
const completed = [];
let i = 0;
const pushDays = [1, 4, 8, 11, 15, 18, 22, 25, 29];
const pullDays = [2, 6, 9, 13, 16, 20, 23, 27];
const legDays = [3, 7, 10, 14, 17, 21, 24, 28];
pushDays.forEach((o, n) => { completed.push(rec(i++, o, 'push', 'Chest Press', 'Machine', 'Chest', 3, 50 + n * 2.5)); completed.push(rec(i++, o, 'push', 'Dumbbell Shoulder Press', 'Dumbbells', 'Shoulders', 3, 18 + n)); completed.push(rec(i++, o, 'push', 'Triceps Pushdown', 'Cable', 'Triceps', 3, 25 + n)); });
pullDays.forEach((o, n) => { completed.push(rec(i++, o, 'pull', 'Lat Pulldown', 'Cable', 'Lats', 3, 55 + n * 2.5)); completed.push(rec(i++, o, 'pull', 'Seated Cable Row', 'Cable', 'Mid Back', 3, 50 + n)); completed.push(rec(i++, o, 'pull', 'Hammer Curl', 'Dumbbells', 'Biceps', 3, 12)); });
legDays.forEach((o, n) => { completed.push(rec(i++, o, 'legs', 'Leg Press', 'Leg Press', 'Quads', 4, 120 + n * 5)); completed.push(rec(i++, o, 'legs', 'Romanian Deadlift', 'Barbell', 'Hamstrings', 3, 60 + n * 2.5)); completed.push(rec(i++, o, 'legs', 'Standing Calf Raise', 'Machine', 'Calves', 3, 40)); });
const timed = [...pushDays.map(o => ({ id: `t${o}`, day: 'push', dayKey: day(o), startedAt: iso(o, 16), endedAt: iso(o, 17), durationMs: 3300000 }))];
const legacy = {
  days: {}, money: { available: 0, savings: 0, weeklyLimit: 0, currency: 'AUD', transactions: [] },
  workouts: { completedExercises: completed, sessions: [], timedSessions: timed, customSplits: [], custom: {}, dayNames: {}, hiddenBaseSplits: [], trainingProgram: 'lean' },
  trainingSchedule: { days: { mon: 'push', tue: null, wed: 'pull', thu: null, fri: 'legs', sat: null, sun: null } },
  notifications: { trainingEnabled: true, trainingTime: '17:30', trainingStyle: 'silent' },
  preferences: { units: { weight: 'kg' } }, user: { profile: { displayName: 'Marc', bodyWeightKg: 78 } },
};

const browser = await chromium.launch({ ...(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : {}), args: ['--no-sandbox'] });
const themes = ['silent-black', 'paper', 'ember', 'emerald', 'midnight'];
const errors = [];
for (const theme of themes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${theme}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${theme} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), theme]);
  await page.goto(`http://localhost:${PORT}/`);
  console.log(theme, 'loaded');
  await page.waitForSelector('.nav');
  await page.waitForTimeout(400);
  const shot = async (name) => { await settle(page); return page.screenshot({ path: `${OUT}/${theme}-${name}.png` }); };
  await shot('today');
  // A profile with no birth year/height/sex and no completed onboarding shows the "help the
  // coach know you" sheet on top of Today (even on the legacy-import fixture) — screenshot it,
  // then dismiss ("Later") so the rest of the walk is unblocked, same as a real user's first look.
  await shot('onboarding');
  await page.getByRole('button', { name: 'Later' }).click();
  await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250); await shot('train');
  if (theme === 'silent-black') {
    // Log a past session: no timer, no rest banner.
    await page.getByRole('button', { name: 'Log a past session' }).click(); await page.waitForTimeout(250); await shot('past-session');
    // QA-R7-1: in the past-session rows too, a tap 1-8 px below any effort button hits its own row or no effort row.
    const pastMisses = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('dialog[open] .effort')];
      const bad = [];
      rows.forEach((row, i) => {
        for (const b of row.querySelectorAll('button')) {
          const r = b.getBoundingClientRect();
          for (let dy = 1; dy <= 8; dy++) {
            const hit = document.elementFromPoint(r.left + r.width / 2, r.bottom + dy);
            const other = hit?.closest('.effort');
            if (other && other !== row) bad.push(`row ${i} ${b.className} +${dy}px`);
          }
        }
      });
      return { rows: rows.length, bad };
    });
    if (pastMisses.rows < 2) errors.push(`${theme}: expected several effort rows in the past-session sheet, found ${pastMisses.rows}`);
    if (pastMisses.bad.length) errors.push(`${theme}: past-session taps below an effort button land on another set: ${pastMisses.bad.slice(0, 4).join(', ')}`);
    const pastInputs = page.locator('.set-grid input');
    await pastInputs.nth(0).fill('40'); await pastInputs.nth(1).fill('10');
    await page.locator('.effort button.easy').first().click();
    await page.getByRole('button', { name: 'Save past session' }).click(); await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Done', exact: true }).click(); await page.waitForTimeout(250);
    // Starting a session first shows the check-in sheet (F2.2, once per day), then the pre-session sheet (6.13, cadence 'pre').
    await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300); await shot('check-in');
    await page.getByRole('button', { name: 'Skip' }).click(); await page.waitForTimeout(300); await shot('pre-session');
    await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
    // Four rated sets so the post-session debrief has enough evidence to show an effort-mix row.
    // Set 1 is easy at/above the placeholder target, so in-session autoregulation (6.13, cadence
    // 'live') suggests more load right under the exercise.
    const inputs = page.locator('.set-grid input');
    const targetKg = parseFloat(await inputs.nth(0).getAttribute('placeholder')) || 50;
    const targetReps = parseInt(await inputs.nth(1).getAttribute('placeholder'), 10) || 8;
    await inputs.nth(0).fill(String(targetKg)); await inputs.nth(1).fill(String(targetReps + 2)); await inputs.nth(1).blur();
    await page.locator('.effort button.easy').nth(0).click();
    await inputs.nth(2).fill('72.5'); await inputs.nth(3).fill('8'); await inputs.nth(3).blur();
    await page.locator('.effort button.ideal').nth(1).click();
    await inputs.nth(4).fill('70'); await inputs.nth(5).fill('7'); await inputs.nth(5).blur();
    await page.locator('.effort button.max').nth(2).click();
    // F8: '+ Set' became an icon-only button (aria-label 'Add set').
    await page.getByRole('button', { name: 'Add set' }).first().click(); await page.waitForTimeout(150);
    const inputs2 = page.locator('.set-grid input');
    await inputs2.nth(6).fill('70'); await inputs2.nth(7).fill('6'); await inputs2.nth(7).blur();
    await page.locator('.effort button.ideal').nth(3).click();
    await page.waitForTimeout(300); await shot('live');
    // R2.1: the rest clock keeps ticking after leaving the live screen.
    const clock0 = await page.locator('.rest .clock').textContent().catch(() => null);
    await page.locator('nav.nav button', { hasText: 'Today' }).click();
    await page.waitForTimeout(2100);
    const clock1 = await page.locator('.rest .clock').textContent().catch(() => null);
    if (!clock0 || clock0 === clock1) errors.push(`${theme}: the rest clock stopped after switching to Today (${clock0} → ${clock1})`);
    await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
    if (!(await visible(page.getByText('for the next set')))) errors.push(`${theme}: expected an in-session autoregulation line after an easy first set`);
    await page.getByRole('button', { name: 'Finish' }).click(); await page.waitForTimeout(300); await shot('finish-sheet');
    await page.getByRole('button', { name: /Finish and save|Just today/ }).click(); await page.waitForTimeout(400);
    // A scripted finish is always fast enough to be "compressed", so the time question shows up here every run.
    if (await page.getByRole('heading', { name: 'When did you train?' }).isVisible().catch(() => false)) {
      await shot('time-question');
      await page.getByRole('button', { name: 'Save', exact: true }).click();
      await page.waitForTimeout(400);
    }
    await shot('summary');
    if (!(await visible(page.getByText('Debrief', { exact: true })))) errors.push(`${theme}: expected a post-session debrief on the finish screen`);
    // F12: "Share workout" on the finish screen opens the sheet on This workout; Save writes a real PNG at both sizes.
    await page.getByRole('button', { name: 'Share workout' }).click();
    if (!(await shareSheetReady(page))) errors.push(`${theme}: the share sheet's cards did not draw from the finish screen`);
    await shot('share-finish');
    for (const [label, w, h] of [['9:16', 1080, 1920], ['1:1', 1080, 1080]]) {
      await page.locator('dialog[open] .share-size button', { hasText: label }).click();
      await shareSheetReady(page);
      const dl = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
      await page.locator('dialog[open] .share-actions button', { hasText: 'Save' }).click();
      const d = await dl;
      const buf = d ? readFileSync(await d.path()) : Buffer.alloc(0);
      const size = pngSize(buf);
      if (!size || size.w !== w || size.h !== h || buf.length < 5000) errors.push(`${theme}: share card ${label} was not a ${w}×${h} PNG (${size ? `${size.w}×${size.h}` : 'no PNG'}, ${buf.length} bytes)`);
    }
    await page.keyboard.press('Escape'); await page.waitForTimeout(250);
    await page.getByRole('button', { name: 'Done', exact: true }).click();
  }
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250); await shot('history');
  // F12: the share icon on a session card, and Share on Stats (which opens on Week).
  await page.locator('[data-palace="history.session-share"]').first().click();
  if (!(await shareSheetReady(page))) errors.push(`${theme}: the share sheet's cards did not draw from a History session`);
  await shot('share-session'); await page.keyboard.press('Escape'); await page.waitForTimeout(250);
  await page.getByRole('tab', { name: 'Stats' }).click(); await page.waitForTimeout(250); await shot('stats');
  await page.getByRole('button', { name: 'Share your stats' }).click();
  if (!(await shareSheetReady(page))) errors.push(`${theme}: the share sheet's cards did not draw from Stats`);
  if ((await page.locator('dialog[open] .share-chips [aria-pressed="true"]').textContent().catch(() => '')) !== 'Week') errors.push(`${theme}: Stats share should open on Week`);
  await shot('share-stats'); await page.keyboard.press('Escape'); await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: 'Body' }).click(); await page.waitForTimeout(300); await shot('body');
  if (theme === 'silent-black') { await page.locator('path.muscle').nth(2).click({ force: true }); await page.waitForTimeout(300); await shot('muscle-detail'); await page.keyboard.press('Escape'); await page.getByRole('tab', { name: 'Levels' }).click(); await page.waitForTimeout(250); await shot('levels'); }
  await page.locator('nav.nav button', { hasText: 'Escobar' }).click(); await page.waitForTimeout(250); await shot('coach');
  if (theme === 'silent-black') { await page.locator('.insight').first().click(); await page.waitForTimeout(300); await shot('insight'); await page.keyboard.press('Escape'); }
  await page.locator('nav.nav button', { hasText: 'Today' }).click(); await page.getByRole('button', { name: 'Settings', exact: true }).click(); await page.waitForTimeout(300); await shot('settings');
  // QA5-5b(a): every context here runs under reducedMotion:'reduce' (F5), so this is already the
  // "Settings under OS reduce" case the F3 spec calls for a probe of; nothing had checked it.
  const rm = await page.getByRole('switch', { name: 'Reduce motion' }).evaluate(e => ({ d: e.disabled, c: e.getAttribute('aria-checked') }));
  if (!rm.d || rm.c !== 'true') errors.push(`${theme}: Reduce motion switch under OS reduce is ${JSON.stringify(rm)}, expected disabled+checked`);
  if (theme === 'silent-black') {
    await page.getByRole('button', { name: 'Open', exact: true }).click(); await page.waitForTimeout(300); await shot('profile-dashboard');
    await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  }
  if (theme === 'silent-black') {
    // R1.2: after boot, a stray rejection or throw must not replace the app with the crash screen.
    await page.evaluate(() => { void Promise.reject(new Error('gate-injected-x')); setTimeout(() => { throw new Error('gate-injected-y'); }); });
    await page.waitForTimeout(400);
    for (let k = errors.length - 1; k >= 0; k--) if (errors[k].includes('gate-injected')) errors.splice(k, 1);
    if (await page.getByText('could not start').isVisible().catch(() => false)) errors.push(`${theme}: a post-boot error showed the crash screen`);
    if (!(await page.locator('.nav').isVisible())) errors.push(`${theme}: the app disappeared after a post-boot error`);
    // QA-R2c-3: the same toast twice restarts its timer (the second one lasts its full 3 s).
    await page.locator('nav.nav button', { hasText: 'Today' }).click(); await page.getByRole('button', { name: 'Settings', exact: true }).click(); await page.waitForTimeout(300);
    const buzz = page.getByRole('button', { name: 'Test haptic' });
    await buzz.click(); await page.waitForTimeout(2000); await buzz.click(); await page.waitForTimeout(2200);
    if (!(await page.locator('.toast', { hasText: 'Sent a test buzz' }).isVisible().catch(() => false))) errors.push(`${theme}: a repeated toast closed on the first toast's timer`);
    await page.waitForTimeout(1200);
    await page.keyboard.press('Escape'); await page.waitForTimeout(200);
    // R1.3: export a backup, reset everything, restore it: the session count must match.
    const before = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).sessions.length);
    await page.locator('nav.nav button', { hasText: 'Today' }).click(); await page.getByRole('button', { name: 'Settings', exact: true }).click(); await page.waitForTimeout(300);
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export backup' }).click()]);
    const { readFile } = await import('node:fs/promises');
    const backupText = await readFile(await download.path(), 'utf8');
    await page.getByRole('button', { name: 'Reset workout data' }).click();
    await page.getByRole('button', { name: 'Reset everything' }).click(); await page.waitForTimeout(300);
    const afterReset = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).sessions.length);
    const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.getByRole('button', { name: 'Restore backup' }).click()]);
    await chooser.setFiles({ name: 'marc-backup.json', mimeType: 'application/json', buffer: Buffer.from(backupText) });
    await page.getByRole('button', { name: 'Replace', exact: true }).click(); await page.waitForTimeout(400);
    await shot('restored');
    const after = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).sessions.length);
    console.log(theme, 'backup round trip:', before, '→ reset', afterReset, '→ restored', after);
    if (afterReset !== 0 || after !== before) errors.push(`${theme}: backup round trip lost sessions (${before} → ${afterReset} → ${after})`);
    await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  }
  const state = await page.evaluate(() => ({ ...JSON.parse(localStorage.getItem('marc.state.v1')), legacy: !!localStorage.getItem('dailyTrackerPremium') }));
  console.log(theme, 'sessions:', state.sessions.length, 'splits:', state.splits.map(s => s.name).join(','), 'legacy untouched:', state.legacy);
  if (state.sessions.length < 25 || !state.legacy || state.splits.length !== 3) errors.push(`${theme}: legacy import produced unexpected state`);
  await ctx.close();
}

// R2.7 (UI-23): on a 360 px phone the set row keeps a typed 102.5 fully visible.
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`narrow: ${e.message}`));
  await page.addInitScript(legacyJson => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, JSON.stringify(legacy));
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {});
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip' }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  const load = page.locator('.set-grid .weight-input input').first();
  await load.fill('102.5');
  await page.waitForTimeout(150);
  const fit = await load.evaluate(el => ({ scroll: el.scrollWidth, client: el.clientWidth }));
  await settle(page); await page.screenshot({ path: `${OUT}/silent-black-set-grid-360.png` });
  console.log('narrow set grid:', fit);
  if (fit.scroll > fit.client) errors.push(`narrow: the load input clips 102.5 at 360 px (${fit.scroll} > ${fit.client})`);
  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  if (pageWidth > 360) errors.push(`narrow: the live screen is ${pageWidth} px wide on a 360 px phone`);
  await ctx.close();
}

// QA6-2: on Stats > Exercise progress, a bodyweight/assisted set label ("BW+10 kg × 5",
// "20 kg assist") is longer than a plain kg one, so on a 360 px phone the date cell must not
// overlap the set text.
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`stat-hist-row: ${e.message}`));
  await page.addInitScript(() => {
    const now = new Date().toISOString();
    const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const sess = (offset, id, name, sets) => ({ id: `s${offset}-${id}`, splitId: 'sp1', splitName: 'Pull', day: day(offset), startedAt: `${day(offset)}T17:00:00.000Z`, endedAt: `${day(offset)}T17:30:00.000Z`, durationSec: 1800, gymId: 'gym_default',
      exercises: [{ exerciseId: id, name, sets }],
      logging: { mode: 'live', trainedAt: `${day(offset)}T17:00:00.000Z`, trainedEndAt: `${day(offset)}T17:30:00.000Z`, loggedAt: `${day(offset)}T17:30:00.000Z`, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] } });
    const pullUp = [0, 1, 2].map(() => ({ kg: 10, reps: 5, effort: 'ideal' }));
    const assisted = [0, 1, 2].map(() => ({ kg: 20, reps: 10, effort: 'ideal' }));
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [
        sess(10, 'lib_pull_up', 'Pull-Up', pullUp), sess(6, 'lib_pull_up', 'Pull-Up', pullUp), sess(3, 'lib_pull_up', 'Pull-Up', pullUp),
        sess(9, 'lib_assisted_pull_up', 'Assisted Pull-Up', assisted), sess(5, 'lib_assisted_pull_up', 'Assisted Pull-Up', assisted), sess(2, 'lib_assisted_pull_up', 'Assisted Pull-Up', assisted),
      ],
      active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
    }));
  });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.waitForTimeout(300);
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);
  await page.getByRole('tab', { name: 'Stats' }).click(); await page.waitForTimeout(250);
  for (const label of ['Pull-Up', 'Assisted Pull-Up']) {
    await page.locator('select').first().selectOption({ label });
    await page.waitForTimeout(200);
    await settle(page); await page.screenshot({ path: `${OUT}/silent-black-stat-hist-row-${label.toLowerCase().replace(/\s+/g, '-')}.png` });
    // Scoped by the Section's own data-palace, not by the stat-hist-row class, so this probe still
    // finds the rows (and so still fails on overlap) if the class were ever removed by mistake.
    // QA6-5: this used to measure `.grow` (the date cell's wrapper), not the date text itself, so
    // an overflowing date could miss the check entirely if the wrapper stayed narrow.
    const rows = await page.evaluate(() => [...document.querySelectorAll('[data-palace="history.exercise-stats"] .list .list-row')].map(row => {
      const date = row.querySelector(':scope > .grow .small') ?? row.querySelector(':scope > .grow');
      const setText = row.querySelector(':scope > .hint');
      const dr = date.getBoundingClientRect(), sr = setText.getBoundingClientRect();
      return { dateRight: dr.right, setLeft: sr.left, dateLines: date.getClientRects().length };
    }));
    if (!rows.length) errors.push(`stat-hist-row ${label}: expected recent-session rows on Exercise progress`);
    for (const r of rows) {
      if (r.dateRight > r.setLeft) errors.push(`stat-hist-row ${label}: the date (right ${r.dateRight}) overlaps the set text (left ${r.setLeft})`);
      if (r.dateLines > 1) errors.push(`stat-hist-row ${label}: the date wrapped onto ${r.dateLines} lines`);
    }
  }
  await ctx.close();
}

// R6: a day off on Today, a sticky setup note on a live card, logged warm-ups, and the CSV row in Settings.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'r6';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(legacyJson => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, JSON.stringify(legacy));
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.waitForTimeout(300);
  // Every weekday scheduled, so today is a training day whatever the date. Written by an init
  // script on a fresh page: editing storage under the running app loses to its own save on unload.
  const patched = await page.evaluate(() => { const st = JSON.parse(localStorage.getItem('marc.state.v1')); const id = st.splits[0].id; for (const d of ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']) st.schedule[d] = id; return JSON.stringify(st); });
  await page.close();
  const page2 = await ctx.newPage();
  page2.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page2.addInitScript(json => { if (!sessionStorage.getItem('r6.patched')) { sessionStorage.setItem('r6.patched', '1'); localStorage.setItem('marc.state.v1', json); } }, patched);
  await page2.goto(`http://localhost:${PORT}/`); await page2.waitForSelector('.nav'); await page2.waitForTimeout(300);
  await page2.getByRole('button', { name: 'Later' }).click({ timeout: 1000 }).catch(() => {});
  await page2.getByRole('button', { name: 'Take today off' }).click().catch(() => errors.push(`${tag}: no "Take today off" on a scheduled day`));
  await page2.waitForTimeout(250);
  if (!(await visible(page2.getByText('Day off', { exact: true })))) errors.push(`${tag}: expected the day-off state on Today`);
  await settle(page2); await page2.screenshot({ path: `${OUT}/silent-black-day-off.png` });
  await page2.getByRole('button', { name: 'Undo day off' }).click().catch(() => {});
  await page2.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page2.waitForTimeout(250);
  await page2.getByRole('button', { name: /^Start / }).first().click(); await page2.waitForTimeout(300);
  if (await page2.getByRole('button', { name: 'Skip' }).isVisible().catch(() => false)) { await page2.getByRole('button', { name: 'Skip' }).click(); await page2.waitForTimeout(300); }
  await page2.getByRole('button', { name: /^Start / }).first().click(); await page2.waitForTimeout(400);
  const card = page2.locator('.card.exercise').first();
  await card.getByRole('button', { name: 'Options', exact: true }).click(); await page2.waitForTimeout(200);
  await page2.locator('[data-palace="train.exercise-note-edit"]').fill('Seat 4, narrow grip');
  await page2.locator('[data-palace="train.exercise-note-edit"]').blur();
  await page2.locator('dialog.sheet[open]').last().getByRole('button', { name: 'Close' }).click(); await page2.waitForTimeout(200);
  if (!(await visible(card.locator('.exercise-note')))) errors.push(`${tag}: expected the setup note under the exercise name`);
  await page2.getByRole('button', { name: 'Show warm-up' }).first().click().catch(() => errors.push(`${tag}: no warm-up on the first main lift`));
  await page2.getByRole('button', { name: 'Log warm-ups' }).first().click().catch(() => errors.push(`${tag}: no "Log warm-ups"`));
  await page2.waitForTimeout(250);
  if ((await card.locator('.set-kind.warmup').count()) < 1) errors.push(`${tag}: expected warm-up sets in the live card`);
  await settle(page2); await card.screenshot({ path: `${OUT}/silent-black-warmups-note.png` });
  // QA-R7-1: in the finish sheet's effort list, a tap just below a set's 'Max' never rates the set below.
  for (let j = 0; j < 6; j++) { await page2.locator('.set-grid input[inputmode="numeric"]').nth(j).fill('8', { timeout: 1000 }).catch(() => {}); }
  await page2.getByRole('button', { name: 'Finish', exact: true }).click(); await page2.waitForTimeout(250);
  const repair = page2.locator('[data-palace="train.effort-repair"]');
  if (await visible(repair)) {
    const misses = await repair.evaluate(el => {
      const rows = [...el.querySelectorAll('.effort')];
      const bad = [];
      for (let i = 0; i + 1 < rows.length; i++) {
        const btn = rows[i].querySelector('button.max').getBoundingClientRect();
        for (let dy = 1; dy <= 8; dy++) {
          const hit = document.elementFromPoint(btn.left + btn.width / 2, btn.bottom + dy);
          if (hit && rows[i + 1].contains(hit)) bad.push(`row ${i} +${dy}px`);
        }
      }
      return bad;
    });
    if (misses.length) errors.push(`${tag}: taps below a 'Max' land on the next set: ${misses.join(', ')}`);
  } else errors.push(`${tag}: expected the effort repair list on the finish sheet`);
  // QA-R2d-3: the finish sheet's duration keeps ticking while the sheet is open.
  const dur = page2.locator('[data-finish-duration]');
  const d0 = await dur.textContent().catch(() => null); await page2.waitForTimeout(2100);
  const d1 = await dur.textContent().catch(() => null);
  if (!d0 || d0 === d1) errors.push(`${tag}: the finish sheet's duration froze at ${d0}`);
  await page2.keyboard.press('Escape'); await page2.waitForTimeout(150);
  const width = await page2.evaluate(() => document.documentElement.scrollWidth);
  if (width > 390) errors.push(`${tag}: the live screen is ${width} px wide`);
  await page2.locator('nav.nav button', { hasText: /^(Today)$/ }).click(); await page2.waitForTimeout(200);
  await page2.locator('[data-palace="today.settings"]').click(); await page2.waitForTimeout(300);
  const csv = page2.locator('[data-palace="settings.csv"]');
  await csv.scrollIntoViewIfNeeded().catch(() => {});
  if (!(await visible(csv))) errors.push(`${tag}: expected the CSV export row in Settings`);
  else { await settle(page2); await csv.screenshot({ path: `${OUT}/silent-black-csv-row.png` }); }
  await ctx.close();
}

// A fresh (non-legacy) profile so the onboarding form and a goal-change insight are visible
// without the legacy fixture's own progress insights outranking them in the top 3.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`fresh-profile: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`fresh-profile console: ${m.text()}`); });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Add my details' }).click();
  await page.waitForTimeout(250);
  await settle(page); await page.screenshot({ path: `${OUT}/silent-black-onboarding-form.png` });
  await page.locator('label:has-text("Body weight") input').first().fill('80');
  await page.getByText('Strength focus').click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.waitForTimeout(300);
  await page.locator('nav.nav button', { hasText: 'Escobar' }).click();
  await page.waitForTimeout(250);
  const insightTitles = await page.locator('.insight h3').allTextContents();
  if (!insightTitles.some(t => t.includes('Goal changed'))) errors.push(`fresh-profile: expected a goal-change insight, got: ${insightTitles.join(' | ')}`);
  await settle(page); await page.screenshot({ path: `${OUT}/silent-black-goal-changed-insight.png` });
  await ctx.close();
}

// A fresh profile with >=5 sessions logged this calendar week, so the weekly review
// card (6.13, cadence 'weekly') appears on Coach without waiting a real week.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`weekly-review: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`weekly-review console: ${m.text()}`); });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.getByRole('button', { name: 'Later' }).click();
  await page.waitForTimeout(200);
  await page.locator('nav.nav button', { hasText: 'Train' }).click();
  await page.getByRole('button', { name: 'Use Push / Pull / Legs' }).click();
  await page.waitForTimeout(200);

  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const dayStr = (offset) => { const d = new Date(monday); d.setDate(monday.getDate() + offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const todayOffset = (now.getDay() + 6) % 7;
  const days = [];
  for (let n = 0; n < 5; n++) days.push(dayStr(Math.min(n, todayOffset)));

  for (const dayKey of days) {
    await page.getByRole('button', { name: 'Log a past session' }).click();
    await page.waitForTimeout(200);
    await page.locator('input[type="date"]').fill(dayKey);
    const pastInputs = page.locator('.set-grid input');
    await pastInputs.nth(0).fill('50');
    await pastInputs.nth(1).fill('10');
    await page.locator('.effort button.ideal').first().click();
    await page.getByRole('button', { name: 'Save past session' }).click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Done', exact: true }).click();
    await page.waitForTimeout(200);
  }
  await page.locator('nav.nav button', { hasText: 'Escobar' }).click();
  await page.waitForTimeout(300);
  await settle(page); await page.screenshot({ path: `${OUT}/silent-black-weekly-review.png` });
  if (!(await visible(page.getByText('Weekly review')))) errors.push('weekly-review: expected the weekly review card on Coach after 5 sessions this week');
  await page.getByText('Weekly review').click();
  await page.waitForTimeout(300);
  await settle(page); await page.screenshot({ path: `${OUT}/silent-black-weekly-review-sheet.png` });
  await ctx.close();
}

// A profile with 7+ days of elevated resting HR (F2.1), so the Today readiness card shows a real
// tier with reasons instead of the empty "connect a watch" prompt, and a lift that would otherwise
// suggest an increase holds instead once readiness is red (the progression hook, 6.4).
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`readiness: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`readiness console: ${m.text()}`); });
  await page.addInitScript(() => {
    const now = new Date().toISOString();
    const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const healthDays = Array.from({ length: 28 }, (_, i) => ({ day: day(i), restingHr: i < 7 ? 75 : 55, source: 'health_connect', syncedAt: now }));
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [], active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays, weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
    }));
  });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.waitForTimeout(300);
  await settle(page); await page.screenshot({ path: `${OUT}/silent-black-readiness-card.png` });
  if (!(await visible(page.getByRole('heading', { name: /^Readiness:/ })))) errors.push('readiness: expected a real readiness tier on Today with 7+ days of health data');

  // A "two-for-two clean top" history that would otherwise suggest an increase.
  await page.locator('nav.nav button', { hasText: 'Train' }).click();
  await page.getByRole('button', { name: 'Use Push / Pull / Legs' }).click();
  await page.waitForTimeout(200);
  for (const offset of [8, 4]) {
    await page.getByRole('button', { name: 'Log a past session' }).click();
    await page.waitForTimeout(200);
    const d = new Date(); d.setDate(d.getDate() - offset);
    await page.locator('input[type="date"]').fill(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    const pastInputs = page.locator('.set-grid input');
    await pastInputs.nth(0).fill('50'); await pastInputs.nth(1).fill('12');
    await page.locator('.effort button.ideal').first().click();
    await page.getByRole('button', { name: 'Save past session' }).click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Done', exact: true }).click();
    await page.waitForTimeout(200);
  }
  await page.getByRole('button', { name: /^Start / }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Skip' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /^Start / }).first().click();
  await page.waitForTimeout(300);
  await settle(page); await page.screenshot({ path: `${OUT}/silent-black-readiness-holds-train.png` });
  if (await page.getByText('Add one step').isVisible().catch(() => false)) errors.push('readiness: expected red readiness to remove the load increase in Train');
  await ctx.close();
}

// A stubbed WatchBridge plugin (F0.4/F1.1/F1.6, 6.2/6.3), so the live pill, per-set peak and
// finish-screen Heart card are exercised without real Bluetooth hardware. Capacitor's real web
// core (bundled in the app) overwrites a plain `window.Capacitor` override, but respects the
// official CapacitorCustomPlatform escape hatch for reporting a non-web platform.
// Plain viewport, no touch/mobile emulation: the touch-event path made clicks on the effort
// buttons flaky here, unlike the theme passes above which never type into a live set mid-flow.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`watch-stub: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`watch-stub console: ${m.text()}`); });
  await page.addInitScript(() => {
    window.CapacitorCustomPlatform = { name: 'android' };
    const listeners = {};
    let status = { state: 'idle', freshness: 'DISCONNECTED', message: 'Ready to connect' };
    let bpm = 118;
    const emitBpm = () => { bpm += 1; for (const cb of listeners.watchMeasurement || []) cb({ bpm, contact: true, rrMs: [], energyKj: null, receivedAtEpochMs: Date.now(), receivedAtElapsedMs: performance.now() }); };
    const setStatus = s => { status = { ...status, ...s }; for (const cb of listeners.watchStatus || []) cb(status); };
    window.Capacitor = {
      isNativePlatform: () => true,
      Plugins: {
        WatchBridge: {
          isSupported: async () => ({ supported: true }),
          permissionState: async () => ({ granted: true, needsLocation: false }),
          requestPermissions: async () => ({ granted: true }),
          startScan: async () => { setTimeout(() => { for (const cb of listeners.watchDevice || []) cb({ address: 'AA:BB', name: 'Test Watch', advertisesHeartRate: true, paired: false, rssi: -50 }); }, 50); },
          stopScan: async () => {},
          connect: async () => { setStatus({ state: 'connected', freshness: 'LIVE', deviceName: 'Test Watch', message: 'Connected' }); emitBpm(); },
          disconnect: async () => { setStatus({ state: 'idle', freshness: 'DISCONNECTED', deviceName: undefined, message: 'Disconnected' }); },
          status: async () => status,
          addListener: async (event, cb) => { (listeners[event] ||= []).push(cb); return { remove: () => {} }; },
        },
      },
    };
    // A complete profile so the profile-onboarding sheet doesn't compete for the dialog top layer here.
    // A week of restingHr history so restTarget() has what it needs for a heart-mode rest screenshot (F1.2).
    const now = new Date().toISOString();
    const healthDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return { day: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`, restingHr: 60, source: 'health_connect', syncedAt: now }; });
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [], active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'heart', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays, weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
    }));
  });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.waitForTimeout(300);
  await page.locator('nav.nav button', { hasText: 'Train' }).click();
  await page.getByRole('button', { name: 'Use Push / Pull / Legs' }).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: /^Start / }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Skip' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /^Start / }).first().click();
  await page.waitForTimeout(300);
  await page.locator('.watch-pill').click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Scan for a watch' }).click();
  await page.waitForTimeout(300);
  await page.getByText('Test Watch').click();
  await page.waitForTimeout(300);
  await settle(page); await page.screenshot({ path: `${OUT}/watch-sheet.png` });
  await page.getByRole('button', { name: 'Close' }).click();
  await page.waitForTimeout(200);
  if (!(await visible(page.locator('.watch-pill .heart-bpm')))) errors.push('watch-stub: expected the live pill to reach LIVE inside a session');
  await settle(page); await page.screenshot({ path: `${OUT}/watch-pill-live.png` });

  const inputs = page.locator('.set-grid input');
  await inputs.nth(0).fill('50'); await inputs.nth(1).fill('10'); await inputs.nth(1).blur();
  await page.locator('.effort button.ideal').first().click();
  await page.waitForTimeout(200);
  if (!(await visible(page.getByText(/^peak /)))) errors.push('watch-stub: expected a per-set peak badge after a live commit');
  await settle(page); await page.screenshot({ path: `${OUT}/watch-rest-heart-mode.png` });
  if (!(await visible(page.getByText('Resting until heart rate settles')))) errors.push('watch-stub: expected the heart-mode rest banner ("N -> N") after a live commit with rest.mode=heart');

  await page.getByRole('button', { name: 'Finish' }).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: /Finish and save|Just today/ }).first().click();
  await page.waitForTimeout(400);
  if (await page.getByRole('heading', { name: 'When did you train?' }).isVisible().catch(() => false)) {
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await page.waitForTimeout(400);
  }
  await settle(page); await page.screenshot({ path: `${OUT}/watch-finish-heart.png` });
  if (!(await visible(page.getByRole('heading', { name: 'Heart' })))) errors.push('watch-stub: expected a Heart card on the finish screen after a session with heart data');
  await ctx.close();
}

// Plate Sense (§25): an lb dumbbell at a kg gym shows the entry pill in lb with the "≈ kg" reading
// under it; a barbell target opens the plate sheet; a 2.2× slip shows the suspect chip. 5 themes.
for (const theme of themes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`plate-sense ${theme}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`plate-sense ${theme} console: ${m.text()}`); });
  await page.addInitScript(([t]) => {
    if (localStorage.getItem('marc.state.v1')) return;
    localStorage.setItem('marc.theme', t);
    const now = new Date().toISOString();
    const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const sess = (offset) => ({ id: `s${offset}`, splitId: 'sp1', splitName: 'Upper', day: day(offset), startedAt: `${day(offset)}T17:00:00.000Z`, endedAt: `${day(offset)}T18:00:00.000Z`, durationSec: 3600, gymId: 'gym_default',
      exercises: [
        { exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', sets: [0, 1, 2].map(() => ({ kg: 80, reps: 8, effort: 'ideal' })) },
        { exerciseId: 'lib_dumbbell_bench_press', name: 'Dumbbell Bench Press', sets: [0, 1, 2].map(() => ({ kg: 22.68, reps: 10, effort: 'ideal', entered: { value: 50, unit: 'lb' } })) },
      ],
      logging: { mode: 'live', trainedAt: `${day(offset)}T17:00:00.000Z`, trainedEndAt: `${day(offset)}T18:00:00.000Z`, loggedAt: `${day(offset)}T18:00:00.000Z`, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] } });
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [{ id: 'sp1', name: 'Upper', color: '#6aa9ff', focus: [], createdAt: now, exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }, { exerciseId: 'lib_dumbbell_bench_press', sets: 3 }] }],
      schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [sess(6), sess(3)], active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: false, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [{ day: day(0), sleepQuality: 4 }], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
      units: { gyms: [{ id: 'gym_default', name: 'My gym', defaultUnit: 'kg', createdAt: now }], activeGymId: 'gym_default', byExercise: { gym_default: { lib_dumbbell_bench_press: { unit: 'lb', ladder: [5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80], source: 'user', updatedAt: now } } }, byEquipment: {} },
    }));
  }, [theme]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.waitForTimeout(300);
  await page.locator('nav.nav button', { hasText: 'Train' }).click();
  await page.waitForTimeout(200);
  if (!(await visible(page.locator('[data-palace="train.gym-chip"]')))) errors.push(`plate-sense ${theme}: expected the gym chip on Train idle`);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip' }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  // The barbell entry opens first. A 2.2× slip on its first set shows the suspect chip.
  const inputs = page.locator('.set-grid input');
  await inputs.nth(0).fill('176'); await inputs.nth(1).fill('8'); await inputs.nth(1).blur();
  await page.waitForTimeout(200);
  // F7: the committed set recedes (a checkmark, faded fields) instead of looking like a draft one.
  const f7 = await page.evaluate(() => {
    const committed = document.querySelectorAll('.set-grid.committed');
    const kind = committed[0]?.querySelector('.set-kind');
    const committedInput = committed[0]?.querySelector('input');
    const draftInput = document.querySelector('.set-grid:not(.committed) input');
    return {
      committedCount: committed.length,
      hasCheck: !!kind?.querySelector('svg'),
      committedBg: committedInput ? getComputedStyle(committedInput).backgroundColor : null,
      draftBg: draftInput ? getComputedStyle(draftInput).backgroundColor : null,
      fontVariant: committedInput ? getComputedStyle(committedInput).fontVariantNumeric : null,
    };
  });
  if (f7.committedCount !== 1) errors.push(`plate-sense ${theme}: expected 1 .set-grid.committed after committing set 1, got ${f7.committedCount}`);
  if (!f7.hasCheck) errors.push(`plate-sense ${theme}: expected the committed set's set-kind to show a checkmark`);
  if (!f7.committedBg || f7.committedBg === f7.draftBg) errors.push(`plate-sense ${theme}: committed vs draft input background did not differ (${f7.committedBg} vs ${f7.draftBg})`);
  if (f7.fontVariant !== 'tabular-nums') errors.push(`plate-sense ${theme}: kg input font-variant-numeric is ${f7.fontVariant}, expected tabular-nums`);
  if (!(await visible(page.locator('.suspect-chip')))) errors.push(`plate-sense ${theme}: expected the unit-slip chip after a 2.2× load`);
  await settle(page); await page.screenshot({ path: `${OUT}/${theme}-plate-suspect.png` });
  await page.locator('.suspect-chip').getByRole('button', { name: 'Yes, lb' }).click();
  await page.waitForTimeout(200);
  if (!(await visible(page.locator('.weight-approx').first()))) errors.push(`plate-sense ${theme}: expected the ≈ kg reading once the bench is in lb`);
  // Plate sheet from the barbell target.
  await page.locator('.target-link').first().click();
  await page.waitForTimeout(300);
  if (!(await visible(page.locator('[data-palace="train.plate-sheet"]')))) errors.push(`plate-sense ${theme}: expected the plate sheet`);
  await settle(page); await page.screenshot({ path: `${OUT}/${theme}-plate-sheet.png` });
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  // The dumbbell entry, typed in lb.
  await page.getByText('Dumbbell Bench Press').first().click();
  await page.waitForTimeout(200);
  const dbInput = page.locator('.exercise.active input[aria-label="Load in lb"]').first();
  // F7: kg (display) differs from lb (entry) here, so `.weight-approx` is already reserved on
  // mount — the row must not grow the moment a digit resolves it to a real conversion.
  const rowHeight = () => page.evaluate(() => document.querySelector('.exercise.active input[aria-label="Load in lb"]').closest('.set-grid').getBoundingClientRect().height);
  const rowBefore = await rowHeight();
  await dbInput.pressSequentially('5');
  const rowAfterFirstDigit = await rowHeight();
  if (Math.abs(rowAfterFirstDigit - rowBefore) > 0.5) errors.push(`plate-sense ${theme}: set row height changed after the first digit (${rowBefore} -> ${rowAfterFirstDigit})`);
  await dbInput.pressSequentially('5');
  await page.waitForTimeout(150);
  const pill = page.locator('.exercise.active .unit-pill').first();
  if ((await pill.textContent())?.trim() !== 'lb') errors.push(`plate-sense ${theme}: expected the dumbbell pill in lb`);
  if (!(await page.locator('.exercise.active .weight-approx').first().textContent().catch(() => ''))?.includes('≈ 24.9 kg')) errors.push(`plate-sense ${theme}: expected "≈ 24.9 kg" under 55 lb`);
  await settle(page); await page.locator('.exercise.active').first().screenshot({ path: `${OUT}/${theme}-plate-pill.png` });
  await ctx.close();
}

// QA4-5: the share sheet's Photo / Save / Share stay on screen and tappable on a short phone and a
// tall one, with a 0, 24 or 48 px bottom safe area (set through --safe-area-inset-bottom).
for (const [w, h] of [[360, 640], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`share-fit ${w}: ${e.message}`));
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);
  await page.getByRole('tab', { name: 'Stats' }).click(); await page.waitForTimeout(250);
  for (const inset of [0, 24, 48]) {
    await page.evaluate(i => document.documentElement.style.setProperty('--safe-area-inset-bottom', `${i}px`), inset);
    await page.getByRole('button', { name: 'Share your stats' }).click();
    await shareSheetReady(page);
    const off = await page.evaluate(() => [...document.querySelectorAll('dialog[open] .share-actions button')].filter(b => {
      const r = b.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !(r.top >= 0 && r.bottom <= innerHeight && hit && b.contains(hit));
    }).map(b => b.textContent));
    if (off.length) errors.push(`share-fit ${w}×${h} inset ${inset}: off screen or covered: ${off.join(', ')}`);
    // QA4-15: every control in the sheet is at least 44 × 44 px.
    const small = await page.evaluate(() => [...document.querySelectorAll('dialog[open] .share-dots button, dialog[open] .share-size button, dialog[open] .share-actions button')]
      .map(b => { const r = b.getBoundingClientRect(); return { t: b.getAttribute('aria-label') || b.textContent, w: Math.round(r.width), h: Math.round(r.height) }; })
      .filter(x => x.w < 44 || x.h < 44).map(x => `${x.t} ${x.w}×${x.h}`));
    if (small.length) errors.push(`share-fit ${w}×${h}: tap targets under 44 px: ${small.join(', ')}`);
    if (w === 360) { await page.waitForTimeout(300); await settle(page); await page.screenshot({ path: `${OUT}/silent-black-share-360-inset${inset}.png` }); }
    await page.keyboard.press('Escape'); await page.waitForTimeout(250);
  }
  await ctx.close();
}

// Palace (§7, EV1): every registry entry resolves. goTo each id through the dev hooks and assert its
// anchor is visible (silent-black), then screenshot three spotlights in all five themes.
for (const theme of themes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`palace ${theme}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`palace ${theme} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson, t]) => {
    localStorage.setItem('marc.dev', '1');
    localStorage.setItem('marc.theme', t);
    if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson);
  }, [JSON.stringify(legacy), theme]);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }
  const ids = await page.evaluate(() => window.__palace.ids);
  const anchors = await page.evaluate(() => window.__palace.anchors);
  if (theme === 'silent-black') {
    if (ids.length < 65) errors.push(`palace: expected about 70 entries, got ${ids.length}`);
    const unresolved = [];
    for (const id of ids) {
      const ok = await page.evaluate(id => window.__palace.goTo(id), id);
      await page.waitForTimeout(60);
      const visible = await page.locator(`[data-palace="${anchors[id]}"]`).last().isVisible().catch(() => false);
      if (!ok || !visible) unresolved.push(id);
    }
    if (unresolved.length) errors.push(`palace: anchors not visible after goTo: ${unresolved.join(', ')}`);
    console.log('palace', ids.length - unresolved.length, '/', ids.length, 'entries resolved');
  }
  for (const id of ['body.recovering', 'settings.gyms', 'history.records']) {
    await page.evaluate(id => window.__palace.goTo(id), id);
    await page.waitForTimeout(250);
    await settle(page); await page.screenshot({ path: `${OUT}/${theme}-spotlight-${id.replace('.', '-')}.png` });
  }
  await ctx.close();
}

// I6 regression: goTo() used to close the previous sheet by dispatching 'cancel' on every open
// dialog directly, each running its own history.back() (via unregisterSheet) independently. Rapid
// back-to-back palace navigation (this is exactly what the loop above already does, and is how
// this was first caught) calls that on every hop, faster than the browser reliably delivers each
// popstate — a stray one can land after a *later* sheet has already pushed its own history entry
// and get misread as a real Back press, closing the wrong (just-opened) sheet. Fixed by routing
// through closeAllSheets (router.ts's go() already relies on it for the same reason: one batched
// history.go(-n) instead of N separate history.back() calls). This block pins the regression on
// its own terms — many settings.* hops in a row, the exact shape that exposed it — independent of
// the broader loop above (whose >=65 threshold could mask a partial regression).
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'palace rapid settings nav';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson]) => {
    localStorage.setItem('marc.dev', '1');
    localStorage.setItem('marc.theme', 'silent-black');
    if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson);
  }, [JSON.stringify(legacy)]);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }
  const ids = await page.evaluate(() => window.__palace.ids);
  const anchors = await page.evaluate(() => window.__palace.anchors);
  const settingsIds = ids.filter(id => id.startsWith('settings.') || id.startsWith('profile.'));
  const unresolved = [];
  for (const id of settingsIds) {
    const ok = await page.evaluate(id => window.__palace.goTo(id), id);
    await page.waitForTimeout(60);
    const visible = await page.locator(`[data-palace="${anchors[id]}"]`).last().isVisible().catch(() => false);
    if (!ok || !visible) unresolved.push(id);
  }
  if (unresolved.length) errors.push(`${tag}: anchors not visible after rapid consecutive goTo(): ${unresolved.join(', ')}`);
  await ctx.close();
}

// QA11-1: closeAllSheets used to overcount ignorePops by the number of sheets it closed instead
// of by 1 — one history.go(-n) is one navigation and fires exactly one popstate in real
// Chromium/WebView, regardless of n. With 2+ sheets open, ignorePops never reached 0, so goTo()
// (which awaits closeAllSheets since the I6-regression fix) hung forever, and the next real Back
// was silently swallowed (eaten decrementing a counter that never belonged to it).
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'QA11-1 nested sheets + goTo + Back';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson]) => {
    localStorage.setItem('marc.dev', '1');
    localStorage.setItem('marc.theme', 'silent-black');
    if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson);
  }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }
  // Two sheets open: Settings, then Gyms nested inside it.
  await page.locator('[data-palace="today.settings"]').click(); await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Manage' }).first().click();
  await page.waitForSelector('dialog.sheet[open].nested');
  const anchor = await page.evaluate(() => window.__palace.anchors['settings.reminders']);
  const done = await Promise.race([
    page.evaluate(() => window.__palace.goTo('settings.reminders')),
    new Promise(resolve => setTimeout(() => resolve('TIMEOUT'), 4000)),
  ]);
  if (done === 'TIMEOUT') errors.push(`${tag}: goTo() with 2 sheets open did not resolve within 4s (ignorePops likely stuck)`);
  else {
    await page.waitForTimeout(60);
    if (!(await page.locator(`[data-palace="${anchor}"]`).last().isVisible().catch(() => false))) errors.push(`${tag}: settings.reminders not visible after goTo() with 2 sheets open`);
    const openAfterGoTo = await page.locator('dialog.sheet[open]').count();
    if (openAfterGoTo !== 1) errors.push(`${tag}: expected exactly one sheet open after goTo(), got ${openAfterGoTo}`);
    // One real Back must close it cleanly — proof ignorePops isn't left stuck above 0.
    await page.goBack();
    await page.waitForTimeout(350);
    if (await page.locator('dialog.sheet[open]').count()) errors.push(`${tag}: expected the sheet gone after a single real Back`);
  }
  await ctx.close();
}

// Escobar (§23 EV5): the mock transport (marc.dev=1, in-memory store, no network) plays a recorded
// conversation with a lift_trend chart, a citation, chips and a proposal card. Screenshot it in all
// five themes at 390 and 360 px, plus the dock on Today and the Hall; "Thinking…" within 150 ms.
for (const theme of themes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = `escobar ${theme}`;
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson, t]) => {
    localStorage.setItem('marc.dev', '1');
    localStorage.setItem('marc.theme', t);
    if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson);
  }, [JSON.stringify(legacy), theme]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }
  await page.evaluate(() => document.querySelector('.toast button')?.click());
  await page.waitForTimeout(100);
  if (!(await visible(page.locator('.esc-dock')))) errors.push(`${tag}: expected the dock on Today`);
  await settle(page); await page.screenshot({ path: `${OUT}/${theme}-escobar-dock-today.png` });
  await page.locator('nav.nav button', { hasText: 'Escobar' }).click(); await page.waitForTimeout(250);
  await settle(page); await page.screenshot({ path: `${OUT}/${theme}-escobar-hall.png` });
  await page.locator('.esc-hall-input').click();
  await page.waitForSelector('dialog.esc-sheet[open]');
  await page.waitForTimeout(250);
  if (theme === 'silent-black') {
    for (const label of ['Share health data', 'Share body data']) if (!(await visible(page.locator('dialog.esc-sheet').getByText(label, { exact: true })))) errors.push(`${tag}: expected the explainer switch label "${label}"`);
    await settle(page); await page.screenshot({ path: `${OUT}/${theme}-escobar-explainer.png` });
  }
  await page.locator('dialog.esc-sheet').getByRole('button', { name: 'Turn on Escobar', exact: true }).click();
  await page.waitForTimeout(200);
  if (!(await visible(page.getByText('Ask me anything.')))) errors.push(`${tag}: expected the empty state`);
  if (theme === 'silent-black') { await settle(page); await page.screenshot({ path: `${OUT}/${theme}-escobar-empty.png` }); }
  await page.locator('.esc-textarea').fill('How is my chest press going?');
  const measureFeedback = p => p.evaluate(() => new Promise(res => {
    const t0 = performance.now();
    document.querySelector('.esc-send').click();
    const tick = () => { if (document.querySelector('.esc-live')?.textContent?.includes('Thinking…')) res(performance.now() - t0); else if (performance.now() - t0 > 2000) res(9999); else requestAnimationFrame(tick); };
    tick();
  }));
  let firstFeedbackMs = await measureFeedback(page);
  // QA5-5b(b): this context runs under reduce; the Escobar Thinking line's esc-lift/esc-fade are
  // both gated on html:not([data-motion="reduce"]) (F1/F3) — nothing had checked that gate holds
  // for this specific live state, only that Today has no loop at rest (:902, which can't fail).
  const loops = await page.evaluate(() => document.getAnimations().filter(a => a.effect && a.effect.getTiming().iterations === Infinity).map(a => a.animationName));
  if (loops.length) errors.push(`${tag}: infinite animation(s) while Thinking under reduce: ${loops.join(', ')}`);
  if (firstFeedbackMs > 150) {
    // PL-18: one retry on a fresh page of the same context, so a slow runner tick does not fail the gate.
    const again = await ctx.newPage();
    await again.goto(`http://localhost:${PORT}/`);
    await again.waitForSelector('.nav');
    await again.locator('nav.nav button', { hasText: 'Escobar' }).click();
    await again.locator('.esc-hall-input').click();
    await again.waitForSelector('.esc-textarea');
    await again.locator('.esc-textarea').fill('How is my chest press going?');
    firstFeedbackMs = await measureFeedback(again);
    await again.close();
  }
  if (firstFeedbackMs > 150) errors.push(`${tag}: "Thinking…" took ${Math.round(firstFeedbackMs)} ms (budget 150, after one retry)`);
  await page.waitForFunction(() => window.__escobar.status() === 'idle' && document.querySelector('.esc-proposal'), null, { timeout: 15000 }).catch(() => errors.push(`${tag}: the mock conversation did not finish`));
  await page.waitForTimeout(200);
  if (!(await visible(page.locator('.esc-comp[data-component="lift_trend"] .sparkline')))) errors.push(`${tag}: expected the lift_trend chart`);
  if ((await page.locator('.esc-answer .esc-cite').count()) < 1) errors.push(`${tag}: expected a citation in the answer`);
  if ((await page.locator('.esc-chips .chip').count()) < 3) errors.push(`${tag}: expected three follow-up chips`);
  await settle(page); await page.screenshot({ path: `${OUT}/${theme}-escobar-chat-390.png` });
  await page.setViewportSize({ width: 360, height: 780 }); await page.waitForTimeout(200);
  const overflow = await page.evaluate(() => { const t = document.querySelector('.esc-thread'); return t ? t.scrollWidth - t.clientWidth : 0; });
  if (overflow > 1) errors.push(`${tag}: the thread scrolls sideways at 360 px`);
  await settle(page); await page.screenshot({ path: `${OUT}/${theme}-escobar-chat-360.png` });
  if (theme === themes.find(t => t !== 'silent-black')) {
    // ES-03: Undo is offered right after Apply and gone once its 8 s window closes.
    await page.locator('.esc-proposal').getByRole('button', { name: 'Apply', exact: true }).click(); await page.waitForTimeout(300);
    const undo = page.locator('.esc-proposal').getByRole('button', { name: 'Undo', exact: true });
    if (!(await visible(undo))) errors.push(`${tag}: expected Undo right after Apply`);
    await page.waitForTimeout(8300);
    if (await undo.isVisible().catch(() => false)) errors.push(`${tag}: Undo still showing after 8 s`);
  }
  if (theme === 'silent-black') {
    await page.locator('.esc-answer .esc-cite').first().click(); await page.waitForTimeout(100);
    if (!(await visible(page.locator('.esc-pop')))) errors.push(`${tag}: expected the citation popover`);
    await settle(page); await page.screenshot({ path: `${OUT}/${theme}-escobar-citation.png` });
    await page.locator('.esc-proposal').getByRole('button', { name: 'Apply', exact: true }).click(); await page.waitForTimeout(300);
    if (!(await visible(page.locator('.esc-proposal').getByText('Applied')))) errors.push(`${tag}: expected "Applied" on the proposal`);
    // ES-03: Undo inside its 8 s window reverses the change.
    await page.locator('.esc-proposal').getByRole('button', { name: 'Undo', exact: true }).click(); await page.waitForTimeout(300);
    if (!(await visible(page.locator('.esc-proposal').getByText('Undone')))) errors.push(`${tag}: expected "Undone" after Undo within the window`);
    await page.locator('.esc-drawer-toggle').last().click(); await page.waitForTimeout(100);
    await settle(page); await page.screenshot({ path: `${OUT}/${theme}-escobar-drawer.png` });
    // Stop mid-turn, then the offline fallback (find_in_app answered locally).
    await page.locator('.esc-textarea').fill('And my legs?'); await page.locator('.esc-send').click(); await page.waitForTimeout(60);
    await page.getByRole('button', { name: 'Stop', exact: true }).click(); await page.waitForTimeout(300);
    if (!(await visible(page.getByText('Stopped.')))) errors.push(`${tag}: expected "Stopped." after Stop`);
    await ctx.setOffline(true);
    await page.locator('.esc-textarea').fill('where are my records'); await page.locator('.esc-send').click(); await page.waitForTimeout(400);
    if (!(await visible(page.locator('.esc-local')))) errors.push(`${tag}: expected the offline palace answer`);
    await settle(page); await page.screenshot({ path: `${OUT}/${theme}-escobar-offline.png` });
    await ctx.setOffline(false);
  }
  const touched = await page.evaluate(() => localStorage.getItem('marc.escobar.v1'));
  if (touched) errors.push(`${tag}: the mock wrote to marc.escobar.v1`);
  await ctx.close();
}

// Live heart line (owner's pick): a fake LIVE watch reading through the dev hook, the line and the
// number on Train in all five themes, coloured by each theme's accent.
for (const theme of themes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`pulse ${theme}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`pulse ${theme} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson, t]) => { localStorage.setItem('marc.dev', '1'); localStorage.setItem('marc.theme', t); if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy), theme]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }
  await page.locator('nav.nav button', { hasText: 'Train' }).click(); await page.waitForTimeout(300);
  await page.evaluate(() => window.__pulse(128)); await page.waitForTimeout(300);
  // A watch appearing can raise the "help the coach know you" sheet; dismiss it like a person would.
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); }
  await page.waitForTimeout(600);
  if (!(await visible(page.locator('.pulse-edge')))) errors.push(`pulse ${theme}: expected the pulsing edge on Train`);
  if (!(await page.locator('.heart-bpm').first().textContent().catch(() => ''))?.includes('128')) errors.push(`pulse ${theme}: expected the heart-rate number`);
  // QA5-5: this context is the one kept at no-preference specifically to cover PulseLine's rAF
  // loop (not a CSS animation, so document.getAnimations() never sees it) — but nothing had ever
  // asserted that --pulse-beat actually changes over time; a break in the rAF loop would still
  // leave '.pulse-edge' visible (its opacity/box-shadow read the CSS var, and simply not updating
  // it produces one static frame that still passes the visibility check above).
  // I3: the loop now writes --pulse-beat on the PulseLine root and each .heart-bpm-icon, never on
  // <html> (a per-frame write there forces a style recalc across the whole page).
  const pulse = await page.evaluate(async () => {
    const root = document.querySelector('.pulse-line');
    const s = new Set(); const htmlVals = new Set();
    for (let k = 0; k < 8; k++) { s.add(root?.style.getPropertyValue('--pulse-beat')); htmlVals.add(document.documentElement.style.getPropertyValue('--pulse-beat')); await new Promise(r => setTimeout(r, 60)); }
    return { rootBeats: s.size, htmlVals: [...htmlVals] };
  });
  if (pulse.rootBeats < 2) errors.push(`pulse ${theme}: --pulse-beat is not animating`);
  if (pulse.htmlVals.some(v => v !== '')) errors.push(`pulse ${theme}: --pulse-beat leaked onto <html> (${pulse.htmlVals.join(',')})`);
  await settle(page); await page.screenshot({ path: `${OUT}/${theme}-pulse-train.png`, clip: { x: 0, y: 0, width: 390, height: 220 } });
  if (theme === 'silent-black') {
    // Hold-and-drag reorder in a live session: the first exercise dragged down lands lower.
    await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
    if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
    await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);
    // Collapse the open card so the list is short and even.
    await page.locator('.reorder-item .exname').first().click(); await page.waitForTimeout(200);
    const before = await page.locator('.reorder-item .exname').allTextContents();
    const box = await page.locator('.reorder-item').nth(0).boundingBox();
    const next = await page.locator('.reorder-item').nth(1).boundingBox();
    await page.mouse.move(box.x + 40, box.y + 24); await page.mouse.down(); await page.waitForTimeout(450);
    for (let k = 1; k <= 10; k++) { await page.mouse.move(box.x + 40, box.y + 24 + (next.height + 12) * 1.2 * k / 10); await page.waitForTimeout(20); }
    await page.mouse.up(); await page.waitForTimeout(300);
    const after = await page.locator('.reorder-item .exname').allTextContents();
    if (after[0] !== before[1] || after[1] !== before[0]) errors.push(`reorder: expected ${before[0]} to move below ${before[1]}, got ${after.slice(0, 3).join(', ')}`);
    await settle(page); await page.screenshot({ path: `${OUT}/reorder-after.png` });
  }
  await ctx.close();
}

// R5.5 service worker: an offline reload still renders the app, and after a new build (new cache,
// the old Escobar chunk gone from the server) the already-open tab can still open Escobar.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'service worker';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson]) => { localStorage.setItem('marc.dev', '1'); if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  const later = async () => { if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); } };
  await later();
  const controlled = await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 }).then(() => true).catch(() => false);
  if (!controlled) errors.push(`${tag}: the service worker never took control`);
  await ctx.setOffline(true);
  await page.reload();
  if (!(await page.waitForSelector('.nav', { timeout: 10000 }).then(() => true).catch(() => false))) errors.push(`${tag}: offline reload did not render the app`);
  await ctx.setOffline(false);
  await later();
  const swPath = join(ROOT, 'www/sw.js');
  const swA = readFileSync(swPath, 'utf8');
  const chunk = readdirSync(join(ROOT, 'www/assets')).find(f => f.startsWith('EscobarSheet-'));
  const chunkPath = join(ROOT, 'www/assets', chunk);
  const chunkBytes = readFileSync(chunkPath);
  try {
    // "Build B": a new cache name, and the old hashed chunk no longer on the server.
    writeFileSync(swPath, swA.replace(/marc-\d{14}/, 'marc-99999999999999').replace(`"./assets/${chunk}",`, '').replace(`,"./assets/${chunk}"`, ''));
    unlinkSync(chunkPath);
    await page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); await r?.update(); });
    const swapped = await page.waitForFunction(() => caches.keys().then(k => k.length === 1 && k[0] === 'marc-99999999999999'), null, { timeout: 15000 }).then(() => true).catch(() => false);
    if (!swapped) errors.push(`${tag}: build B's service worker did not activate`);
    await page.locator('nav.nav button', { hasText: 'Escobar' }).click(); await page.waitForTimeout(250);
    await page.locator('.esc-hall-input').click();
    if (!(await page.waitForSelector('dialog.esc-sheet[open]', { timeout: 10000 }).then(() => true).catch(() => false))) errors.push(`${tag}: Escobar did not open after build B`);
  } finally {
    writeFileSync(swPath, swA);
    writeFileSync(chunkPath, chunkBytes);
  }
  await ctx.close();
}

// F5: motion smoke — full-motion (no-preference) run so a later batch's real animations are
// exercised end to end, not just under the reduced-motion contexts above. HAS flags flip true as
// their batch lands (F6 restFix, I6 sheetExit); until then each logs 'skipped' instead of failing.
{
  const HAS = { restFix: true, sheetExit: true };
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const tag = 'motion smoke';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), 'silent-black']);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.waitForTimeout(400);

  // QA5-5: F1/F2/F3's own "Gate:" acceptance checks had no probe anywhere (vitest or gate), and
  // every context above now forces OS reduce, so the in-app toggle and the live mq listener were
  // never exercised at all. This block runs at full motion first, then flips reduced motion on
  // and off (OS, then the in-app toggle, then a reload) and checks each one.
  const ms = v => parseFloat(v) * (v.trim().endsWith('ms') ? 1 : 1000); // build minifies 320ms to .32s
  const mstate = () => page.evaluate(() => ({ attr: document.documentElement.dataset.motion ?? null, sheet: getComputedStyle(document.documentElement).getPropertyValue('--dur-sheet'), pref: localStorage.getItem('marc.motion') }));
  const f2 = await page.evaluate(() => ({ panel: !!document.activeElement?.classList.contains('sheet-panel'), tap: getComputedStyle(document.documentElement).webkitTapHighlightColor }));
  if (!f2.panel) errors.push(`${tag}: onboarding sheet did not focus .sheet-panel`);
  if (f2.tap !== 'rgba(0, 0, 0, 0)') errors.push(`${tag}: html tap highlight is ${f2.tap}`);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {}); await page.waitForTimeout(250);
  let m = await mstate();
  if (m.attr !== null || ms(m.sheet) !== 320) errors.push(`${tag}: expected full motion, got ${JSON.stringify(m)}`);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  if (!(await page.waitForFunction(() => document.documentElement.dataset.motion === 'reduce', null, { timeout: 2000 }).then(() => true).catch(() => false))) errors.push(`${tag}: OS reduce did not set data-motion live`);
  if (ms((await mstate()).sheet) !== 150) errors.push(`${tag}: --dur-sheet is not 150ms under reduce`);
  if ((await page.evaluate(() => document.getAnimations().filter(a => a.effect && a.effect.getTiming().iterations === Infinity).length)) !== 0) errors.push(`${tag}: infinite animation on Today under reduce`);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  if (!(await page.waitForFunction(() => !document.documentElement.dataset.motion, null, { timeout: 2000 }).then(() => true).catch(() => false))) errors.push(`${tag}: data-motion stayed after OS reduce went off`);
  await page.locator('[data-palace="today.settings"]').click(); await page.waitForTimeout(300);
  await page.getByRole('switch', { name: 'Reduce motion' }).click(); await page.waitForTimeout(100);
  m = await mstate();
  if (m.attr !== 'reduce' || m.pref !== 'reduce') errors.push(`${tag}: Reduce motion toggle did not apply: ${JSON.stringify(m)}`);
  const td = await page.locator('.toggle').first().evaluate(el => getComputedStyle(el).transitionDuration);
  if (td !== '0.2s') errors.push(`${tag}: .toggle transition-duration under reduce is ${td}`);
  await page.reload(); await page.waitForSelector('.nav');
  m = await mstate();
  if (m.attr !== 'reduce' || m.pref !== 'reduce') errors.push(`${tag}: Reduce motion did not survive reload`);
  await page.evaluate(() => localStorage.removeItem('marc.motion'));
  await page.reload(); await page.waitForSelector('.nav');

  // (1) A sheet slides down and is gone, instead of vanishing in one frame.
  if (HAS.sheetExit) {
    await page.locator('[data-palace="today.settings"]').click();
    await page.waitForSelector('dialog.sheet[open]');
    await page.getByRole('button', { name: 'Close' }).click();
    await page.waitForTimeout(60);
    if (!(await page.locator('dialog.sheet[open].closing').count())) errors.push(`${tag}: expected dialog.sheet[open].closing at +60ms`);
    await page.waitForTimeout(340);
    if (await page.locator('dialog.sheet[open]').count()) errors.push(`${tag}: expected no dialog.sheet[open] by +400ms`);
  } else {
    console.log(`${tag}: sheetExit skipped`);
  }

  // (2) The rest banner reads the configured time with an empty bar on its first frame, not a
  // stale total+1s with a full bar.
  if (HAS.restFix) {
    await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
    await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
    if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
    await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
    const inputs = page.locator('.set-grid input');
    await inputs.nth(0).fill('50'); await inputs.nth(1).fill('8'); await inputs.nth(1).blur();
    await page.waitForTimeout(100);
    const rest = await page.evaluate(() => {
      const clock = document.querySelector('.rest .clock');
      const bar = document.querySelector('.rest .bar > i');
      if (!clock || !bar) return null;
      const track = bar.parentElement.getBoundingClientRect().width;
      // I1: the bar is a fixed-width (100%) element moved by a WAAPI translateX, not an inline
      // width%, so its getBoundingClientRect().width is always the full track. Read the fill from
      // the transform matrix's e (translateX in px) instead: -track = empty, 0 = full.
      const m = new DOMMatrixReadOnly(getComputedStyle(bar).transform);
      // A9: the hint can now read 'Next · …' instead of 'Rest · m:ss' whenever the open card has
      // another set to do, so the configured total comes from the bar's own WAAPI duration
      // (created at ~totalSec remaining) instead of parsing the hint text.
      const anim = document.getAnimations().find(a => a.effect && a.effect.target === bar);
      return {
        clock: clock.textContent,
        totalMs: anim ? anim.effect.getComputedTiming().duration : null,
        fillPct: track ? Math.max(0, Math.min(100, (1 + m.e / track) * 100)) : 0,
      };
    });
    if (!rest) errors.push(`${tag}: expected the rest banner after committing set 1`);
    else {
      if (rest.fillPct > 10) errors.push(`${tag}: the rest bar fill is ${rest.fillPct.toFixed(1)}% at +100ms, expected <=10%`);
      // QA5-14: this is the actual F6 regression (a stale total+1s clock on the first frame) —
      // a fix that only corrected the bar would still pass without this.
      if (rest.totalMs == null) errors.push(`${tag}: no rest bar animation to read the configured length from`);
      else {
        const sec = s => s.split(':').reduce((a, n) => a * 60 + Number(n), 0);
        const totalSec = Math.round(rest.totalMs / 1000);
        if (![totalSec, totalSec - 1].includes(sec(rest.clock))) errors.push(`${tag}: first-frame rest clock ${rest.clock}, expected ${totalSec} or 1s less`);
      }
    }
  } else {
    console.log(`${tag}: restFix skipped`);
  }

  // (3) Always: every still-running infinite animation is one of the allow-listed decorative loops.
  // I3 dropped exercise-breathe/exercise-shimmer, so a live screen showing an active card must not
  // have any infinite animation left running on it at all.
  const ALLOW = ['esc-rot', 'esc-blink', 'esc-pulse', 'esc-lift', 'palace-glow', 'esc-spin'];
  const unlisted = await page.evaluate(allow => document.getAnimations()
    .filter(a => a.effect && a.effect.getTiming().iterations === Infinity)
    .filter(a => !(a instanceof CSSAnimation && allow.includes(a.animationName)))
    .map(a => (a instanceof CSSAnimation ? a.animationName : a.constructor.name)), ALLOW);
  if (unlisted.length) errors.push(`${tag}: unlisted infinite animation(s): ${unlisted.join(', ')}`);
  await ctx.close();
}

// I6: sheets rise from the edge and leave the same way, the header stays put while content
// scrolls under it, and a second Back during one sheet's exit reaches the sheet below.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const tag = 'I6 sheets';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), 'silent-black']);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {}); await page.waitForTimeout(250);

  const tyOf = async () => page.evaluate(() => {
    const p = document.querySelector('dialog.sheet[open] .sheet-panel');
    if (!p) return null;
    const m = new DOMMatrixReadOnly(getComputedStyle(p).transform);
    return { ty: m.f, opacity: Number(getComputedStyle(p).opacity) };
  });

  // (1) Entry, full motion: well into the slide at 30ms, settled by 400ms.
  await page.locator('[data-palace="today.settings"]').click();
  await page.waitForTimeout(30);
  let t = await tyOf();
  if (!t || !(t.ty > 50)) errors.push(`${tag}: expected the panel > 50px down at +30ms, got ${JSON.stringify(t)}`);
  await page.waitForTimeout(400);
  t = await tyOf();
  if (!t || t.ty !== 0) errors.push(`${tag}: expected the panel settled (ty 0) at +400ms, got ${JSON.stringify(t)}`);

  // (2) Sticky header + Close reachable after scrolling. Also opens the nested Gyms sheet for (3).
  await page.evaluate(() => { const p = document.querySelector('dialog.sheet[open] .sheet-panel'); if (p) p.scrollTop = 800; });
  await page.waitForTimeout(50);
  const scrolled = await page.evaluate(() => {
    const top = document.querySelector('dialog.sheet[open] .sheet-top');
    const panel = document.querySelector('dialog.sheet[open] .sheet-panel');
    const close = [...document.querySelectorAll('dialog.sheet[open] button')].find(b => b.getAttribute('aria-label') === 'Close');
    return { has: !!top?.classList.contains('scrolled'), closeTop: close?.getBoundingClientRect().top, panelTop: panel?.getBoundingClientRect().top };
  });
  if (!scrolled.has) errors.push(`${tag}: expected .sheet-top.scrolled after scrolling the panel`);
  if (scrolled.closeTop == null || scrolled.panelTop == null || scrolled.closeTop < scrolled.panelTop) errors.push(`${tag}: Close button scrolled out of view: ${JSON.stringify(scrolled)}`);

  // (3) A second Back mid-exit reaches the sheet below it. Settings -> nested Gyms sheet, then
  // Back twice quickly (the first starts Gyms' exit; the second must close Settings too).
  await page.getByRole('button', { name: 'Manage' }).first().click();
  await page.waitForSelector('dialog.sheet[open].nested');
  await page.goBack();
  await page.waitForTimeout(30);
  const midExit = await page.evaluate(() => [...document.querySelectorAll('dialog.sheet[open]')].map(d => d.classList.contains('closing')));
  if (midExit.length < 2 || !midExit[midExit.length - 1]) errors.push(`${tag}: expected the top (Gyms) sheet mid-exit after one Back, got ${JSON.stringify(midExit)}`);
  await page.goBack();
  await page.waitForTimeout(30);
  const bothClosing = await page.evaluate(() => [...document.querySelectorAll('dialog.sheet[open]')].every(d => d.classList.contains('closing')));
  if (midExit.length >= 2 && !bothClosing) errors.push(`${tag}: expected the sheet below to also start closing on a second Back`);
  await page.waitForTimeout(400);
  if (await page.locator('dialog.sheet[open]').count()) errors.push(`${tag}: expected every sheet gone 400ms after both exits started`);

  // (4) Reduced motion: a crossfade (ty stays 0, opacity < 1 mid-fade), never a bare snap.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('[data-palace="today.settings"]').click();
  await page.waitForTimeout(30);
  const r = await tyOf();
  if (!r || r.ty !== 0 || !(r.opacity < 1)) errors.push(`${tag}: expected a reduced-motion crossfade (ty 0, opacity < 1) at +30ms, got ${JSON.stringify(r)}`);
  await ctx.close();
}

// A3: pulling a sheet down by its handle/title, or by its own content once scrolled to the top,
// dismisses it past a quarter of its height or on a fast flick; short of both, it springs back.
// Starting on scrollable content (not at its top) or on typed input never moves the sheet.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const tag = 'A3 sheet swipe';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), 'silent-black']);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {}); await page.waitForTimeout(250);

  // Nested sheets (e.g. ExercisePicker inside SplitEditor) render as a dialog literally nested
  // inside the outer one's markup — always the topmost/last in DOM order, and the one actually
  // interactive.
  const panelBox = () => page.locator('dialog.sheet[open] .sheet-panel').last().boundingBox();
  const panelTy = () => page.evaluate(() => {
    const panels = [...document.querySelectorAll('dialog.sheet[open] .sheet-panel')];
    const p = panels.at(-1);
    if (!p) return null;
    const t = getComputedStyle(p).transform;
    return t === 'none' ? 0 : new DOMMatrixReadOnly(t).f;
  });
  const topScrollTop = (v) => page.evaluate(val => {
    const panels = [...document.querySelectorAll('dialog.sheet[open] .sheet-panel')];
    const p = panels.at(-1);
    if (!p) return null;
    if (val != null) p.scrollTop = val;
    return p.scrollTop;
  }, v);
  const openCount = () => page.locator('dialog.sheet[open]').count();

  // (a) A slow drag (well under the fling speed) past a quarter of the panel height closes it.
  await page.locator('[data-palace="today.settings"]').click(); await page.waitForTimeout(400);
  let box = await panelBox();
  const dist40 = box.height * 0.4;
  await touchDrag(page, box.x + box.width / 2, box.y + 10, box.x + box.width / 2, box.y + 10 + dist40, Math.round(dist40 / 0.15));
  await page.waitForTimeout(300);
  if (await openCount()) errors.push(`${tag}: a slow 40%-of-height drag did not close the sheet`);

  // (b) A short, slow drag springs back; the sheet stays open.
  await page.locator('[data-palace="today.settings"]').click(); await page.waitForTimeout(400);
  box = await panelBox();
  const dist10 = box.height * 0.1;
  await touchDrag(page, box.x + box.width / 2, box.y + 10, box.x + box.width / 2, box.y + 10 + dist10, Math.round(dist10 / 0.15));
  await page.waitForTimeout(450);
  const tyBack = await panelTy();
  if (tyBack !== 0) errors.push(`${tag}: expected the panel back at ty 0 after a short drag, got ${tyBack}`);
  if (!(await openCount())) errors.push(`${tag}: a short 10%-of-height drag closed the sheet`);

  // (c) A fast 60px/100ms flick closes even well under a quarter of the height.
  box = await panelBox();
  await touchDrag(page, box.x + box.width / 2, box.y + 10, box.x + box.width / 2, box.y + 70, 100);
  await page.waitForTimeout(300);
  if (await openCount()) errors.push(`${tag}: a fast 60px/100ms flick did not close the sheet`);

  // (d) Scrolled content: dragging the body scrolls the list; the sheet itself never moves or closes.
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.locator('[data-palace="train.edit-split"]').first().click(); await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Add exercise', exact: true }).click();
  await page.waitForSelector('dialog.sheet[open].nested'); await page.waitForTimeout(300);
  await topScrollTop(300);
  await page.waitForTimeout(150);
  const scrollBefore = await topScrollTop();
  box = await panelBox();
  await touchDrag(page, box.x + box.width / 2, box.y + box.height / 2, box.x + box.width / 2, box.y + box.height / 2 + 100, 200);
  await page.waitForTimeout(150);
  const scrollAfter = await topScrollTop();
  if (!(scrollAfter < scrollBefore)) errors.push(`${tag}: expected dragging scrolled content upward, scrollTop ${scrollBefore} -> ${scrollAfter}`);
  if ((await panelTy()) !== 0) errors.push(`${tag}: the sheet moved while its scrolled content was dragged`);
  if ((await openCount()) < 2) errors.push(`${tag}: the sheet closed while its scrolled content was dragged`);

  // (e) Starting on the search input never moves the sheet.
  await topScrollTop(0);
  const ibox = await page.locator('dialog.sheet[open] .sheet-panel').last().locator('input').first().boundingBox();
  await touchDrag(page, ibox.x + ibox.width / 2, ibox.y + ibox.height / 2, ibox.x + ibox.width / 2, ibox.y + ibox.height / 2 + 150, 200);
  await page.waitForTimeout(150);
  if ((await panelTy()) !== 0) errors.push(`${tag}: the sheet moved while dragging from the search input`);
  if ((await openCount()) < 2) errors.push(`${tag}: the sheet closed while dragging from the search input`);
  await ctx.close();
}

// I7: the Escobar sheet slides in like other sheets, tracks the finger between half and full
// while dragging, and flings to the nearest detent (or closed) on release. Full motion — under
// reduce the drag never live-follows, so there is nothing to measure mid-drag.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const tag = 'I7 escobar sheet';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson]) => {
    localStorage.setItem('marc.dev', '1');
    localStorage.setItem('marc.theme', 'silent-black');
    if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson);
  }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }
  await page.locator('nav.nav button', { hasText: 'Escobar' }).click(); await page.waitForTimeout(250);
  await page.locator('.esc-hall-input').click();
  await page.waitForSelector('dialog.esc-sheet[open]');
  await page.waitForTimeout(60);

  // (1) Entry: a running sheet-in on open.
  const enterRunning = await page.evaluate(() => document.getAnimations().some(a => a instanceof CSSAnimation && a.animationName === 'sheet-in' && a.effect?.target?.classList?.contains('esc-panel')));
  if (!enterRunning) errors.push(`${tag}: expected .esc-panel to have a running sheet-in right after open`);
  await page.waitForTimeout(400);
  await page.locator('dialog.esc-sheet').getByRole('button', { name: 'Turn on Escobar', exact: true }).click().catch(() => {});
  await page.waitForTimeout(300);

  const panelState = () => page.evaluate(() => {
    const p = document.querySelector('.esc-panel');
    const d = document.querySelector('dialog.esc-sheet[open]');
    if (!p) return null;
    const t = getComputedStyle(p).transform;
    return { height: p.getBoundingClientRect().height, ty: t === 'none' ? 0 : new DOMMatrixReadOnly(t).f, closing: !!d?.classList.contains('closing') };
  });
  const grabBox = () => page.locator('.esc-grab-zone').boundingBox();
  const vh = 844;
  const hFull = 0.94 * vh, hHalf = 0.62 * vh;
  const near = (a, b) => Math.abs(a - b) <= 14;

  // Hall.tsx's esc-hall-input opens Escobar straight to 'full' (openEscobar({detent:'full'})).
  let s = await panelState();
  if (!s || !near(s.height, hFull)) errors.push(`${tag}: expected to open at full detent from the Hall input, got ${JSON.stringify(s)}`);

  // (2) A fast 60px up drag ends at full (height ~= 94dvh, no transform).
  let box = await grabBox();
  await touchDrag(page, box.x + box.width / 2, box.y + box.height / 2, box.x + box.width / 2, box.y + box.height / 2 - 60, 100);
  await page.waitForTimeout(400);
  s = await panelState();
  if (!s || !near(s.height, hFull) || s.ty !== 0) errors.push(`${tag}: expected full detent after a fast up drag, got ${JSON.stringify(s)}`);

  // (3) A slow 30px down drag from full returns to full.
  box = await grabBox();
  await touchDrag(page, box.x + box.width / 2, box.y + box.height / 2, box.x + box.width / 2, box.y + box.height / 2 + 30, 1000);
  await page.waitForTimeout(400);
  s = await panelState();
  if (!s || !near(s.height, hFull) || s.ty !== 0) errors.push(`${tag}: expected to stay at full after a slow 30px down drag, got ${JSON.stringify(s)}`);

  // Drag down to half, slowly, to set up (4).
  box = await grabBox();
  await touchDrag(page, box.x + box.width / 2, box.y + box.height / 2, box.x + box.width / 2, box.y + box.height / 2 + (hFull - hHalf), 1400);
  await page.waitForTimeout(400);
  s = await panelState();
  if (!s || !near(s.height, hHalf)) errors.push(`${tag}: expected half detent before the flick-close case, got ${JSON.stringify(s)}`);

  // (4) A fast down flick from half closes, .closing first.
  box = await grabBox();
  await touchDrag(page, box.x + box.width / 2, box.y + box.height / 2, box.x + box.width / 2, box.y + box.height / 2 + 80, 100);
  await page.waitForTimeout(30);
  s = await panelState();
  if (!s?.closing) errors.push(`${tag}: expected dialog.esc-sheet.closing right after a fast down flick from half`);
  // The remaining distance to "closed" from a modest 80px flick is well past 200px, so this
  // settle runs at durFor('bounce') (460ms full motion), not the shorter 'spring' — give it room.
  await page.waitForTimeout(700);
  if (await page.locator('dialog.esc-sheet[open]').count()) errors.push(`${tag}: expected the Escobar sheet gone after its close animation`);

  // (5) Back routes through the same requestEscobarClose() as the X button and backdrop click
  // (native/back.ts calls it directly; verified at the unit level in tests/back.test.ts), so its
  // exit is the same animation exercised by (4) above.

  // (6) Focusing the composer from half animates instead of jumping. Hall.tsx's esc-hall-input
  // always reopens at full, so drag down to half first.
  await page.locator('.esc-hall-input').click();
  await page.waitForSelector('dialog.esc-sheet[open]');
  await page.waitForTimeout(400);
  box = await grabBox();
  await touchDrag(page, box.x + box.width / 2, box.y + box.height / 2, box.x + box.width / 2, box.y + box.height / 2 + (hFull - hHalf), 1400);
  await page.waitForTimeout(400);
  s = await panelState();
  if (!s || !near(s.height, hHalf)) errors.push(`${tag}: expected half detent to set up the composer-focus case, got ${JSON.stringify(s)}`);
  await page.locator('.esc-textarea').click();
  const animating = await page.evaluate(() => document.getAnimations().some(a => a.playState === 'running' && a.effect?.target?.classList?.contains('esc-panel')));
  if (!animating) errors.push(`${tag}: expected a running animation on .esc-panel right after focusing the composer from half`);
  // The FLIP travels half -> full (~270px, >= 200), so this one settles at durFor('bounce')
  // (460ms full motion), not 'spring'.
  await page.waitForTimeout(700);
  s = await panelState();
  if (!s || !near(s.height, hFull) || Math.abs(s.ty) > 1) errors.push(`${tag}: expected full detent after focusing the composer, got ${JSON.stringify(s)}`);
  await ctx.close();
}

// F13: toast — a soft exit (no vanish-in-one-frame), a large enough and readable Undo, and
// swipe-to-dismiss in any of the three directions it recognizes (never Undo on a swipe away).
// The centring fix itself (no sideways jump) is QA5-4's existing probe, further down.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const tag = 'F13 toast';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', 'silent-black'); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {}); await page.waitForTimeout(250);

  // (1) Soft exit: a plain (no-action) toast's timeout adds .leaving, then the toast is gone
  // within 250ms — never a one-frame vanish.
  await page.locator('[data-palace="today.settings"]').click(); await page.waitForTimeout(300);
  await page.evaluate(() => { [...document.querySelectorAll('dialog[open] button')].find(b => b.textContent.trim() === 'Test haptic')?.click(); });
  await page.waitForTimeout(60);
  if (!(await page.locator('.toast').count())) errors.push(`${tag}: expected a toast after Test haptic`);
  await page.waitForTimeout(3050);
  if (!(await page.locator('.toast.leaving').count())) errors.push(`${tag}: expected .toast.leaving right after its 3s timeout`);
  await page.waitForTimeout(250);
  if (await page.locator('.toast').count()) errors.push(`${tag}: expected the toast gone within 250ms of .leaving`);
  await page.getByRole('button', { name: 'Close' }).click(); await page.waitForTimeout(300);

  // (2)+(3) An action (Undo) toast: button hit target and contrast, per theme. Removing an
  // exercise (F10) is the simplest reliable way to get one.
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);

  const removeAndGetToast = async () => {
    await page.locator('.card.exercise').first().getByRole('button', { name: 'Options', exact: true }).click(); await page.waitForTimeout(200);
    await page.evaluate(() => { const b = [...document.querySelectorAll('dialog[open] button')].find(x => x.textContent.trim() === 'Remove from this session'); b?.click(); });
    await page.waitForTimeout(250);
  };
  await removeAndGetToast();
  const hit = await page.evaluate(() => {
    const btn = document.querySelector('.toast button');
    if (!btn) return null;
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const pts = [[cx, cy], [cx - 21, cy], [cx + 21, cy], [cx, cy - 21], [cx, cy + 21]];
    return { height: r.height, hits: pts.map(([x, y]) => document.elementFromPoint(x, y) === btn || btn.contains(document.elementFromPoint(x, y))) };
  });
  if (!hit) errors.push(`${tag}: expected a toast with an Undo button after removing an exercise`);
  else {
    // min-height:32px in CSS; tolerate the sub-pixel rounding a 2x devicePixelRatio rect can show.
    if (hit.height < 31.5) errors.push(`${tag}: Undo button is ${hit.height.toFixed(2)}px tall, expected >= 32`);
    if (!hit.hits.every(Boolean)) errors.push(`${tag}: Undo button missed a hit-test within 21px of its centre: ${JSON.stringify(hit.hits)}`);
  }
  // Undo it back so the next check starts from a clean, full entry list again.
  await page.locator('.toast').getByRole('button', { name: 'Undo' }).click(); await page.waitForTimeout(350);

  for (const theme of themes) {
    await page.evaluate(t => { localStorage.setItem('marc.theme', t); }, theme);
    await page.reload(); await page.waitForSelector('.nav'); await page.waitForTimeout(300);
    await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
    await removeAndGetToast();
    const contrast = await page.evaluate(() => {
      const btn = document.querySelector('.toast button');
      const toast = document.querySelector('.toast');
      if (!btn || !toast) return null;
      const parseRgba = str => { const m = str.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
      const fg = parseRgba(getComputedStyle(btn).color);
      const bg = parseRgba(getComputedStyle(toast).backgroundColor);
      if (!fg || !bg) return null;
      const lin = c => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
      const rl = ({ r, g, b: bb }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bb);
      const l1 = rl(fg) + 0.05, l2 = rl(bg) + 0.05;
      return l1 > l2 ? l1 / l2 : l2 / l1;
    });
    if (contrast != null && contrast < 4.5) errors.push(`${tag} ${theme}: toast button contrast ${contrast.toFixed(2)} < 4.5`);
    await page.locator('.toast').getByRole('button', { name: 'Undo' }).click(); await page.waitForTimeout(350);
  }
  await page.evaluate(t => { localStorage.setItem('marc.theme', t); }, 'silent-black');
  await page.reload(); await page.waitForSelector('.nav'); await page.waitForTimeout(300);

  // (4) Swipe away in any of the three recognized directions dismisses without running Undo.
  const entriesOf = () => page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).active.entries.length);
  const swipeAway = async (dx, dy) => {
    await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
    const before = await entriesOf();
    await removeAndGetToast();
    const box = await page.locator('.toast').boundingBox();
    await touchDrag(page, box.x + box.width / 2, box.y + box.height / 2, box.x + box.width / 2 + dx, box.y + box.height / 2 + dy, 100);
    await page.waitForTimeout(300);
    if (await page.locator('.toast').count()) errors.push(`${tag}: expected the toast gone after a ${dx || 0}/${dy || 0}px swipe`);
    const after = await entriesOf();
    if (after !== before - 1) errors.push(`${tag}: a swiped-away toast ran Undo (entries ${before} -> ${after}, expected ${before - 1})`);
  };
  await swipeAway(60, 0);
  await swipeAway(0, 60);

  // QA11-3: a plain tap (pointerdown then pointerup with no real movement) used to pause the
  // countdown via track()'s onStart and never resume it — neither tracker had a gesture to end,
  // so it stayed paused forever. A tap always fires both events regardless, so the toast must
  // still dismiss on its normal schedule.
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await removeAndGetToast();
  const tapBox = await page.locator('.toast').boundingBox();
  await page.mouse.move(tapBox.x + 10, tapBox.y + tapBox.height / 2);
  await page.mouse.down(); await page.mouse.up();
  await page.waitForTimeout(5400);
  if (await page.locator('.toast').count()) errors.push(`${tag} (QA11-3): a tapped toast is still on screen 5.4s later — its countdown never resumed`);
  await page.locator('.toast').getByRole('button', { name: 'Undo' }).click().catch(() => {});
  await page.waitForTimeout(350);

  // QA11-6: holding the toast pauses its countdown, and releasing resumes it with the time that
  // was left — not a fresh one.
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await removeAndGetToast();
  await page.waitForTimeout(1500);
  const holdBox = await page.locator('.toast').boundingBox();
  await page.mouse.move(holdBox.x + 10, holdBox.y + holdBox.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(3800); // total elapsed since show: ~5300ms, past the un-paused 5000ms deadline
  if (!(await page.locator('.toast').count())) errors.push(`${tag} (QA11-6): expected the held toast still on screen past its un-paused deadline`);
  await page.mouse.up();
  await page.waitForTimeout(1000);
  if (!(await page.locator('.toast').count())) errors.push(`${tag} (QA11-6): expected the toast still on screen ~1s after release (~3.5s of its ~3.5s remaining), not gone already`);
  await page.waitForTimeout(2900); // remaining ~2.5s plus the exit animation
  if (await page.locator('.toast').count()) errors.push(`${tag} (QA11-6): expected the toast gone once its remaining time (not a fresh countdown) elapsed`);
  await ctx.close();
}

// I1: the rest banner rises in with a running animation, its bar glides continuously via WAAPI
// (rebuilt, not stepped, when the remaining time changes), its buttons are real tap targets, and
// it exits (a `.leaving` class, then gone) instead of vanishing in one frame.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const tag = 'I1 rest banner';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), 'silent-black']);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {}); await page.waitForTimeout(250);
  await page.locator('.toast').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  const inputs = page.locator('.set-grid input');
  await inputs.nth(0).fill('50'); await inputs.nth(1).fill('8'); await inputs.nth(1).blur();
  await page.waitForTimeout(60);

  const entering = await page.evaluate(() => {
    const el = document.querySelector('.rest');
    return !!el && document.getAnimations().some(a => a.effect?.target === el && a.playState === 'running');
  });
  if (!entering) errors.push(`${tag}: .rest has no running enter animation right after it appears`);

  const barInfo = await page.evaluate(() => {
    const bar = document.querySelector('.rest .bar > i');
    const clockText = document.querySelector('.rest .clock')?.textContent ?? '';
    const anim = bar && document.getAnimations().find(a => a.effect?.target === bar);
    return anim ? { duration: anim.effect.getComputedTiming().duration, clockText, playState: anim.playState } : null;
  });
  if (!barInfo) errors.push(`${tag}: no WAAPI animation found on the rest bar`);
  else {
    if (barInfo.playState !== 'running') errors.push(`${tag}: the rest bar animation is ${barInfo.playState}, expected running`);
    const sec = str => str.split(':').reduce((n, part) => n * 60 + Number(part), 0);
    const expectedMs = sec(barInfo.clockText) * 1000;
    if (Math.abs(barInfo.duration - expectedMs) > 1500) errors.push(`${tag}: bar duration ${barInfo.duration}ms does not track the clock (${barInfo.clockText})`);
  }

  // +15 changes the rest's end time, so the old bar animation is cancelled and a fresh one runs.
  await page.locator('.rest').getByRole('button', { name: 'More rest' }).click();
  await page.waitForTimeout(50);
  const afterAdjust = await page.evaluate(() => {
    const bar = document.querySelector('.rest .bar > i');
    const anims = document.getAnimations().filter(a => a.effect?.target === bar);
    return { count: anims.length, running: anims.filter(a => a.playState === 'running').length };
  });
  if (afterAdjust.count !== 1 || afterAdjust.running !== 1) errors.push(`${tag}: expected exactly one running bar animation after +15, got ${JSON.stringify(afterAdjust)}`);

  for (const name of ['Less rest', 'More rest']) {
    const h = await page.locator('.rest').getByRole('button', { name }).evaluate(el => el.getBoundingClientRect().height);
    if (h < 44) errors.push(`${tag}: '${name}' is ${h.toFixed(1)}px tall, expected >=44`);
  }
  const skipH = await page.locator('.rest').getByRole('button', { name: 'Skip' }).evaluate(el => el.getBoundingClientRect().height);
  if (skipH < 44) errors.push(`${tag}: 'Skip' is ${skipH.toFixed(1)}px tall, expected >=44`);

  // Skip plays the exit animation instead of the banner vanishing in one frame.
  await page.locator('.rest').getByRole('button', { name: 'Skip' }).click();
  await page.waitForTimeout(30);
  if (!(await page.locator('.rest.leaving').count())) errors.push(`${tag}: expected .rest.leaving right after Skip`);
  await page.waitForTimeout(250);
  if (await page.locator('.rest').count()) errors.push(`${tag}: expected .rest gone by 250ms after Skip`);

  await ctx.close();
}

// A9: the rest banner shows what to do next, and falls back to the plain clock once nothing is
// left to log on the open card.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'A9 next-up hint';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), 'silent-black']);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {}); await page.waitForTimeout(250);
  await page.locator('.toast').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);

  const inputs = page.locator('.set-grid input');
  const rowCount = (await inputs.count()) / 2;
  if (rowCount < 2) errors.push(`${tag}: expected at least 2 sets on the first exercise, got ${rowCount}`);

  await inputs.nth(0).fill('50'); await inputs.nth(1).fill('8'); await inputs.nth(1).blur();
  await page.waitForTimeout(80);
  let hint = await page.locator('.rest .hint').first().textContent();
  if (!hint?.startsWith('Next · ')) errors.push(`${tag}: expected 'Next · …' after committing set 1 of ${rowCount}, got '${hint}'`);

  for (let s = 1; s < rowCount; s++) {
    await inputs.nth(s * 2).fill('50'); await inputs.nth(s * 2 + 1).fill('8'); await inputs.nth(s * 2 + 1).blur();
    await page.waitForTimeout(80);
  }
  hint = await page.locator('.rest .hint').first().textContent();
  if (!/^Rest · \d+:\d{2}$/.test(hint ?? '')) errors.push(`${tag}: expected 'Rest · m:ss' once every set on the card is logged, got '${hint}'`);

  await ctx.close();
}

// A1: tapping the next-up hint row ("Log as planned") fills and logs that set with exactly the
// values it was already showing, moves on to the following set, and its wider tap target never
// steals a tap from the effort row above it or the row below it.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'A1 log as planned';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), 'silent-black']);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {}); await page.waitForTimeout(250);
  await page.locator('.toast').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);

  if ((await page.locator('.set-grid.committed').count()) !== 0) errors.push(`${tag}: expected nothing committed on a fresh exercise`);
  const fillRowCount0 = await page.locator('.fill-row').count();
  if (fillRowCount0 !== 1) errors.push(`${tag}: expected exactly one .fill-row on a fresh exercise, got ${fillRowCount0}`);

  // QA-R7-1 style: the wider hit area must not reach into the effort row above or the row below.
  const hitAreaBleed = await page.evaluate(() => {
    const bad = [];
    const fillRow = document.querySelector('.fill-row');
    const card = fillRow?.closest('.exercise');
    if (fillRow && card) {
      for (const btn of card.querySelectorAll('.effort button')) {
        const r = btn.getBoundingClientRect();
        for (let dy = 1; dy <= 8; dy++) {
          const hit = document.elementFromPoint(r.left + r.width / 2, r.bottom + dy);
          if (hit === fillRow || fillRow.contains(hit)) bad.push(`effort button +${dy}px hit the fill-row`);
        }
      }
      const fr = fillRow.getBoundingClientRect();
      for (let dy = 7; dy <= 10; dy++) {
        const hit = document.elementFromPoint(fr.left + fr.width / 2, fr.bottom + dy);
        if (hit === fillRow || fillRow.contains(hit)) bad.push(`+${dy}px below the fill-row still hit it`);
      }
    }
    const kgInput = card?.querySelector('.set-grid input');
    if (kgInput) {
      const r = kgInput.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.bottom - 2);
      if (hit !== kgInput) bad.push('the kg input itself is not hit 2px above its own bottom edge');
    }
    return bad;
  });
  if (hitAreaBleed.length) errors.push(`${tag}: ${hitAreaBleed.join('; ')}`);

  const before = await page.evaluate(() => {
    // The header row is a .set-grid too, but only a data row has real <input> children.
    const row = [...document.querySelectorAll('.exercise.active .set-grid')].find(g => g.querySelector('input'));
    const inputs = row ? [...row.querySelectorAll('input')] : [];
    // Set 2's hint row is still a plain div at this point (set 1 holds the fill-row); its height
    // right before it becomes the fill-row is what must not change (no min-height on .fill-row).
    const set2RowHeight = [...document.querySelectorAll('.exercise.active .set-grid + .row-between')][1]?.getBoundingClientRect().height ?? null;
    return { kgPh: inputs[0]?.placeholder ?? null, repsPh: inputs[1]?.placeholder ?? null, set2RowHeight };
  });

  await page.locator('.fill-row').click();
  await page.waitForTimeout(150);
  if (!(await visible(page.locator('.rest')))) errors.push(`${tag}: expected the rest banner after tapping 'Log as planned'`);
  const after = await page.evaluate(() => {
    const committed = [...document.querySelectorAll('.set-grid.committed')];
    const committedHasFillRow = committed.some(g => g.nextElementSibling?.classList.contains('fill-row'));
    const inputs = committed[0] ? [...committed[0].querySelectorAll('input')] : [];
    const fillRowHeight = document.querySelector('.fill-row')?.getBoundingClientRect().height ?? null;
    return { committedCount: committed.length, committedHasFillRow, kgVal: inputs[0]?.value ?? null, repsVal: inputs[1]?.value ?? null, fillRowCount: document.querySelectorAll('.fill-row').length, fillRowHeight };
  });
  if (after.committedCount !== 1) errors.push(`${tag}: expected 1 committed set after tapping, got ${after.committedCount}`);
  if (after.committedHasFillRow) errors.push(`${tag}: the now-committed set 1 still has a fill-row`);
  if (after.fillRowCount !== 1) errors.push(`${tag}: expected set 2 to have the fill-row now, got ${after.fillRowCount} fill-row(s)`);
  if (before.kgPh && after.kgVal !== before.kgPh) errors.push(`${tag}: logged kg ${after.kgVal} does not match the shown placeholder ${before.kgPh}`);
  if (before.repsPh && after.repsVal !== before.repsPh) errors.push(`${tag}: logged reps ${after.repsVal} does not match the shown placeholder ${before.repsPh}`);
  if (before.set2RowHeight != null && after.fillRowHeight != null && Math.abs(before.set2RowHeight - after.fillRowHeight) > 1) {
    errors.push(`${tag}: set 2's row height changed from ${before.set2RowHeight} to ${after.fillRowHeight} when it became the fill-row`);
  }

  // A typed reps value survives a tap on the (now set 2's) fill-row.
  const repsInput = page.locator('.exercise.active .set-grid:not(.committed) input').nth(1);
  await repsInput.fill('6');
  await page.locator('.fill-row').click();
  await page.waitForTimeout(150);
  const typedReps = await page.evaluate(() => [...document.querySelectorAll('.set-grid.committed')].at(-1)?.querySelectorAll('input')[1]?.value ?? null);
  if (typedReps !== '6') errors.push(`${tag}: typed reps '6' were overwritten by the fill-row, got '${typedReps}'`);

  await ctx.close();
}

// A8: the keyboard's action key moves kg -> reps -> the next set's kg (Done on the last set),
// and focusing a filled field selects it so typing replaces the value instead of appending.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'A8 keyboard flow';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), 'silent-black']);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {}); await page.waitForTimeout(250);
  await page.locator('.toast').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);

  const kgFields = page.locator('.exercise.active [data-set-field="kg"]');
  const repsFields = page.locator('.exercise.active [data-set-field="reps"]');
  const lastRepsHint = await repsFields.last().getAttribute('enterkeyhint');
  if (lastRepsHint !== 'done') errors.push(`${tag}: the last set's reps field enterkeyhint is '${lastRepsHint}', expected 'done'`);
  const firstRepsHint = await repsFields.first().getAttribute('enterkeyhint');
  if (firstRepsHint !== 'next') errors.push(`${tag}: set 1's reps field enterkeyhint is '${firstRepsHint}', expected 'next'`);
  const kgHint = await kgFields.first().getAttribute('enterkeyhint');
  if (kgHint !== 'next') errors.push(`${tag}: the kg field enterkeyhint is '${kgHint}', expected 'next'`);

  await kgFields.first().click();
  await page.keyboard.type('60');
  await page.keyboard.press('Enter');
  let active = await page.evaluate(() => document.activeElement === document.querySelectorAll('.exercise.active [data-set-field="reps"]')[0]);
  if (!active) errors.push(`${tag}: Enter after kg did not focus the reps field`);
  await page.keyboard.type('8');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(80);
  const committed = await page.locator('.set-grid.committed').count();
  if (committed !== 1) errors.push(`${tag}: expected set 1 committed after Enter on reps, got ${committed} committed`);
  active = await page.evaluate(() => document.activeElement === document.querySelectorAll('.exercise.active [data-set-field="kg"]')[1]);
  if (!active) errors.push(`${tag}: Enter after reps did not move to set 2's kg field`);

  // Focusing a filled field selects it, so typing replaces instead of appending.
  await kgFields.nth(1).click();
  await page.keyboard.type('60');
  await page.evaluate(() => (document.activeElement instanceof HTMLElement) && document.activeElement.blur());
  await kgFields.nth(1).click();
  await page.keyboard.type('62.5');
  const finalKg = await kgFields.nth(1).inputValue();
  if (finalKg !== '62.5') errors.push(`${tag}: refocusing a filled kg field and typing gave '${finalKg}', expected '62.5' (select-on-focus)`);

  await ctx.close();
}

// F9: a small 'PR' pill with an inline trophy pops in once when a record set is logged — not
// while it's still just a promising, uncommitted number — and does not replay on a tab switch.
for (const theme of themes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = `F9 pr-badge ${theme}`;
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([t]) => {
    if (localStorage.getItem('marc.state.v1')) return;
    localStorage.setItem('marc.theme', t);
    const now = new Date().toISOString();
    const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const sess = { id: 's1', splitId: 'sp1', splitName: 'Upper', day: day(3), startedAt: `${day(3)}T17:00:00.000Z`, endedAt: `${day(3)}T18:00:00.000Z`, durationSec: 3600, gymId: 'gym_default',
      exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', sets: [{ kg: 50, reps: 8, effort: 'ideal' }, { kg: 50, reps: 8, effort: 'ideal' }] }],
      logging: { mode: 'live', trainedAt: `${day(3)}T17:00:00.000Z`, trainedEndAt: `${day(3)}T18:00:00.000Z`, loggedAt: `${day(3)}T18:00:00.000Z`, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] } };
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [{ id: 'sp1', name: 'Upper', color: '#6aa9ff', focus: [], createdAt: now, exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 2 }] }],
      schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [sess], active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: false, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [{ day: day(0), sleepQuality: 4 }], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
      units: { gyms: [{ id: 'gym_default', name: 'My gym', defaultUnit: 'kg', createdAt: now }], activeGymId: 'gym_default', byExercise: {}, byEquipment: {} },
    }));
  }, [theme]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await page.waitForTimeout(300);
  await page.locator('nav.nav button', { hasText: 'Train' }).click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip' }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);

  // 80kg beats the 50kg history: a clear live record, well before it is committed.
  const inputs = page.locator('.set-grid input');
  await inputs.nth(0).fill('80'); await inputs.nth(1).fill('5');
  await page.waitForTimeout(80);
  if (await page.locator('.pr-badge').count()) errors.push(`${tag}: a .pr-badge showed for an uncommitted record`);
  await inputs.nth(1).blur();
  await page.waitForTimeout(80);
  const popState = await page.evaluate(() => {
    const badge = document.querySelector('.pr-badge');
    const running = badge ? document.getAnimations().some(a => a.effect?.target === badge && a.playState === 'running') : false;
    return { exists: !!badge, hasPop: !!badge?.classList.contains('pop'), running };
  });
  if (!popState.exists) errors.push(`${tag}: expected a .pr-badge once the record set is committed`);
  if (!popState.hasPop) errors.push(`${tag}: expected the freshly-committed record's badge to have .pop`);
  if (!popState.running) errors.push(`${tag}: expected a running pr-pop animation on the fresh badge`);

  // Trophy and text sit on the same visual line.
  const align = await page.evaluate(() => {
    const badge = document.querySelector('.pr-badge');
    const svg = badge?.querySelector('svg');
    if (!badge || !svg) return null;
    const textNode = [...badge.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
    const range = document.createRange();
    if (textNode) range.selectNodeContents(textNode); else range.selectNodeContents(badge);
    const textRect = range.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    return Math.abs((svgRect.top + svgRect.bottom) / 2 - (textRect.top + textRect.bottom) / 2);
  });
  if (align != null && align > 2) errors.push(`${tag}: trophy/text centre-y off by ${align.toFixed(1)}px, expected <=2`);

  // WCAG: the badge text against its own composited background.
  const contrast = await page.evaluate(() => {
    const badge = document.querySelector('.pr-badge');
    if (!badge) return null;
    const parseRgba = str => { const m = str.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
    const cs = getComputedStyle(badge);
    const fg = parseRgba(cs.color);
    const own = parseRgba(cs.backgroundColor);
    let node = badge.parentElement, under = { r: 255, g: 255, b: 255 };
    while (node) { const bg = parseRgba(getComputedStyle(node).backgroundColor); if (bg && bg.a >= 0.999) { under = bg; break; } node = node.parentElement; }
    const mix = (f, b, a) => f * a + b * (1 - a);
    const bg = own ? { r: mix(own.r, under.r, own.a), g: mix(own.g, under.g, own.a), b: mix(own.b, under.b, own.a) } : under;
    const lin = c => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
    const rl = ({ r, g, b: bb }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bb);
    const l1 = rl(fg) + 0.05, l2 = rl(bg) + 0.05;
    return l1 > l2 ? l1 / l2 : l2 / l1;
  });
  if (contrast != null && contrast < 4.5) errors.push(`${tag}: pr-badge text contrast ${contrast.toFixed(2)} < 4.5`);

  // A tab switch away and back does not replay the pop.
  await page.locator('nav.nav button', { hasText: 'Today' }).click(); await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(300);
  const afterSwitch = await page.evaluate(() => { const b = document.querySelector('.pr-badge'); return { exists: !!b, hasPop: !!b?.classList.contains('pop') }; });
  if (!afterSwitch.exists) errors.push(`${tag}: expected the .pr-badge to still be there after a tab switch`);
  if (afterSwitch.hasPop) errors.push(`${tag}: the badge replayed .pop after a tab switch back`);

  await ctx.close();
}

// F8: every live control is a real >=44px tap target (QA-R7-1 style: elementFromPoint at its
// centre +/-21px still resolves to it or a descendant), at both 390 and 360px, and the topbar
// controls fit on one line even at 360px.
for (const width of [390, 360]) {
  const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = `F8 tap targets ${width}px`;
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), 'silent-black']);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {}); await page.waitForTimeout(250);
  await page.locator('.toast').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);

  const topbarWrap = await page.evaluate(() => {
    const row = document.querySelector('.topbar .row');
    if (!row || !row.children.length) return 0;
    const tops = [...row.children].map(c => c.getBoundingClientRect().top);
    return Math.max(...tops) - Math.min(...tops);
  });
  if (topbarWrap > 2) errors.push(`${tag}: the live topbar controls wrapped onto more than one line (top spread ${topbarWrap.toFixed(1)}px)`);

  const misses = await page.evaluate(() => {
    const check = (el, label) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      for (const dy of [-21, 21]) {
        const hit = document.elementFromPoint(cx, cy + dy);
        if (!(hit === el || el.contains(hit))) return `${label}: (${cx.toFixed(0)},${(cy + dy).toFixed(0)}) missed (hit ${hit ? hit.className || hit.tagName : 'nothing'})`;
      }
      return null;
    };
    const byText = (sel, text) => [...document.querySelectorAll(sel)].find(b => b.textContent.trim() === text);
    const controls = [
      [byText('.topbar button', 'Finish'), 'Finish'],
      [document.querySelector('[aria-label="Pause"], [aria-label="Resume"]'), 'Pause/Resume'],
      [document.querySelector('.exercise.active .set-kind'), '.set-kind'],
      [document.querySelector('[aria-label="Add set"]'), 'Add set'],
      [document.querySelector('[aria-label="Remove last set"]'), 'Remove last set'],
      [byText('.exercise.active button', 'Done with exercise') || byText('.exercise.active button', 'Undo done'), 'Done with exercise/Undo done'],
      [byText('.exercise.active button', 'See substitutes'), 'See substitutes'],
      [document.querySelector('.watch-pill'), '.watch-pill'],
    ];
    return controls.map(([el, label]) => check(el, label)).filter(Boolean);
  });
  if (misses.length) errors.push(`${tag}: ${misses.join('; ')}`);

  await ctx.close();
}

// QA5-1b..4b: a regression guard for QA5-1..4. Those fixes had no probe of their own — the gate
// still passed against the pre-fix build, so undoing any of them would go unnoticed. In-app
// Reduce motion only (OS no-preference), the exact path the original bugs were in.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const tag = 'in-app reduce';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', 'silent-black'); localStorage.setItem('marc.motion', 'reduce'); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await page.waitForTimeout(400);
  const closeSheet = async () => { await page.locator('dialog[open] [aria-label="Close"]').last().click(); await page.waitForTimeout(250); };
  // QA5-1: a sheet whose form has an autofocus field opens with the caret in it, not on the panel.
  await page.getByRole('button', { name: 'Add my details' }).click(); await page.waitForTimeout(300);
  if (!(await page.evaluate(() => !!document.activeElement?.matches('dialog[open] input[inputmode="decimal"]')))) errors.push(`${tag}: 'Add my details' did not focus its body-weight field`);
  await closeSheet();
  await page.locator('.toast').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  // QA5-4: a view fades in without moving.
  const moved = await page.evaluate(async () => {
    const seen = new Set();
    [...document.querySelectorAll('nav.nav button')].find(b => /^(Train|Live)$/.test(b.textContent.trim())).click();
    for (const t0 = performance.now(); performance.now() - t0 < 250;) { await new Promise(r => requestAnimationFrame(r)); const v = document.querySelector('.view'); if (v) seen.add(getComputedStyle(v).transform); }
    return [...seen].filter(t => t !== 'none');
  });
  if (moved.length) errors.push(`${tag}: .view moves on entry: ${moved.slice(0, 2).join(' | ')}`);
  await page.waitForTimeout(200);
  await page.locator('[data-palace="train.new-split"]').click(); await page.waitForTimeout(300);
  if (!(await page.evaluate(() => !!document.activeElement?.matches('dialog[open] input[placeholder="e.g. Upper A"]')))) errors.push(`${tag}: 'New split' did not focus its name field`);
  await closeSheet();
  // QA5-2: a primary button dims while pressed (scale is 1 under reduce).
  const start = page.getByRole('button', { name: /^Start / }).first();
  const bb = await start.boundingBox();
  await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.mouse.down(); await page.waitForTimeout(200);
  const pressOp = await start.evaluate(e => getComputedStyle(e).opacity);
  await page.mouse.move(1, 1); await page.mouse.up(); await page.waitForTimeout(150);
  if (!(+pressOp < 1)) errors.push(`${tag}: pressing Start gave no feedback (opacity ${pressOp})`);
  // QA5-3/I3: the active exercise keeps a static accent-tinted border and a solid name colour
  // (no ring, no loop — I3 dropped the box-shadow breathing glow for a steady hairline).
  await start.click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);
  const ax = await page.evaluate(() => {
    const e = document.querySelector('.exercise.active');
    const other = document.querySelector('.exercise:not(.active)');
    const n = e?.querySelector('.exname');
    return e && n && { activeBorder: getComputedStyle(e).borderColor, otherBorder: other ? getComputedStyle(other).borderColor : null, name: getComputedStyle(n).color };
  });
  if (!ax || ax.name === 'rgba(0, 0, 0, 0)' || (ax.otherBorder != null && ax.activeBorder === ax.otherBorder)) errors.push(`${tag}: active exercise lost its border tint or name colour: ${JSON.stringify(ax)}`);
  // QA5-4: the toast stays centred while it fades in.
  await page.locator('nav.nav button', { hasText: 'Today' }).click(); await page.waitForTimeout(250);
  await page.locator('[data-palace="today.settings"]').click(); await page.waitForTimeout(300);
  const xs = await page.evaluate(async () => {
    [...document.querySelectorAll('dialog[open] button')].find(b => b.textContent.trim() === 'Test haptic').click();
    const s = new Set();
    for (const t0 = performance.now(); performance.now() - t0 < 400;) { await new Promise(r => requestAnimationFrame(r)); const t = document.querySelector('.toast'); if (t) s.add(Math.round(t.getBoundingClientRect().left)); }
    return [...s];
  });
  if (xs.length !== 1) errors.push(`${tag}: toast moved while appearing: left ${xs.join(' -> ')}`);
  await ctx.close();
}

// QA5-5b(c): F2's own acceptance checks (a computed press-state change and back within 250ms of
// release, no ring on the onboarding sheet's own buttons, a solid ring on keyboard focus and none
// on a mouse click) had no gate probe anywhere. Full motion (no reducedMotion key): under reduce,
// .seg/.tab/etc. answer with opacity instead of scale (QA5-2), so scale/transform here would read
// as unchanged for the wrong reason.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const tag = 'F2 press/focus';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), 'silent-black']);
  await page.goto(`http://localhost:${PORT}/`); await page.waitForSelector('.nav'); await page.waitForTimeout(400);
  const onbRing = await page.evaluate(() => [...document.querySelectorAll('dialog[open] button')].filter(b => getComputedStyle(b).outlineStyle !== 'none').length);
  if (onbRing) errors.push(`${tag}: ${onbRing} onboarding button(s) show a focus ring`);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {}); await page.waitForTimeout(250);
  const press = async (l, prop) => { const b = await l.boundingBox(); const read = () => l.evaluate((e, p) => getComputedStyle(e)[p], prop); const rest = await read(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(120); const down = await read(); await page.mouse.up(); await page.waitForTimeout(250); const back = await read().catch(() => rest); if (down === rest || back !== rest) errors.push(`${tag}: press ${prop} rest=${rest} down=${down} +250ms=${back}`); };
  await press(page.locator('.nav button svg').first(), 'opacity');
  await page.locator('[data-palace="today.settings"]').click(); await page.waitForTimeout(400);
  await press(page.locator('dialog[open] .seg button').first(), 'scale');
  await press(page.locator('dialog[open] .theme-card').first(), 'backgroundColor');
  await page.keyboard.press('Tab');
  const kb = await page.evaluate(() => ({ cls: document.activeElement?.className, o: getComputedStyle(document.activeElement).outlineStyle }));
  if (kb.o !== 'solid') errors.push(`${tag}: keyboard Tab focus ring is ${JSON.stringify(kb)}`);
  await page.locator('dialog[open] .seg button').first().click(); await page.waitForTimeout(100);
  const mc = await page.evaluate(() => ({ cls: document.activeElement?.className, o: getComputedStyle(document.activeElement).outlineStyle }));
  if (mc.o !== 'none') errors.push(`${tag}: mouse click shows a focus ring ${JSON.stringify(mc)}`);
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  // QA5-5c: 'Take today off' (Today.tsx:84) only shows on some days, so this probe depended on
  // the real-world date; 'Start ...' on Train is always there regardless of day.
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250); await press(page.getByRole('button', { name: /^Start / }).first(), 'transform');
  await ctx.close();
}

// F5: determinism — Today, History and the live Train clock render byte-identical 300ms apart, so
// an animation still settling on capture (rather than a real difference) never slips through.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'determinism';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), 'silent-black']);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {});
  // QA5-6: the legacy fixture's "Imported N sessions" boot toast (main.tsx, 3000ms, no action)
  // leaves at unpredictable points relative to the fixed waits below on a loaded CI runner, so a
  // twiceMatch pair can straddle it (visible in shot A, gone in shot B) with no real regression.
  await page.locator('.toast').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(250);

  const twiceMatch = async (name, opts = {}) => {
    await settle(page);
    const a = await page.screenshot(opts);
    await page.waitForTimeout(300);
    await settle(page);
    const b = await page.screenshot(opts);
    if (sha1(a) !== sha1(b)) errors.push(`${tag}: ${name} was not identical 300ms apart`);
  };

  await twiceMatch('today');
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(300);
  await twiceMatch('history');
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);
  // LiveClock (Train.tsx) is the only h1.num on the live screen; masked along with the rest clock
  // since both tick every second and would otherwise never match frame to frame.
  await twiceMatch('live train clock', { mask: [page.locator('.rest .clock'), page.locator('h1.num')] });
  await ctx.close();
}

// O3: Body recovery "Ready times" — ring tiles grouped by day, tap to open a detail strip.
// QA7-6: main CI went red because these probes ran on the real wall clock — a tile time like
// "10 pm – midnight" only appears near certain hours, and the same tree passed or failed the
// "2 columns" check depending purely on when CI happened to run. Every block below pins the
// page's clock (Playwright's clock.install, which starts ticking normally from that instant —
// nothing else needs to change) to a fixed instant, and session times are hours-ago-from-that,
// not from Date.now().
{
  const RT_PINNED_NOW = new Date();
  RT_PINNED_NOW.setHours(12, 0, 0, 0);
  const rtSess = (hoursAgo, id, name, kg, effort, sets, refMs = RT_PINNED_NOW.getTime()) => {
    const at = refMs - hoursAgo * 3_600_000;
    const d = new Date(at);
    const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return {
      id, splitId: 'sp1', splitName: 'Custom', day, startedAt: new Date(at).toISOString(), endedAt: new Date(at + 1_800_000).toISOString(), durationSec: 1800, gymId: 'gym_default',
      exercises: [{ exerciseId: id, name, sets: Array.from({ length: sets }, () => ({ kg, reps: 8, effort })) }],
      logging: { mode: 'live', trainedAt: new Date(at).toISOString(), trainedEndAt: new Date(at + 1_800_000).toISOString(), loggedAt: new Date(at + 1_800_000).toISOString(), timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] },
    };
  };
  const rtStateJson = (sessions, checkIns = []) => JSON.stringify({
    version: 1, createdAt: new Date().toISOString(), profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
    goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
    sessions, active: null, customExercises: [],
    preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
    body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
    onboarding: { dismissedAt: [], completedAt: new Date().toISOString() }, checkIns, recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
  });
  // A spread across recovery bands: fresh + max effort (deep in "Later"), a day-old moderate
  // session (typically "Today"/"Tomorrow"), and an older easy session (often "Ready now").
  const rtMainSessions = [
    rtSess(1, 'rt1', 'Barbell Curl', 20, 'max', 4),
    rtSess(20, 'rt2', 'Leg Press', 150, 'ideal', 4),
    rtSess(30, 'rt3', 'Lat Pulldown', 55, 'easy', 3),
  ];

  // A real click via mouse coordinates, at 20% across the element rather than dead centre:
  // the Escobar dock is a small pill horizontally centred and fixed near the bottom of the
  // viewport (styles.css `.esc-dock`), so a full-width row's exact centre can sit right under
  // it. Raw coordinates also avoid locator.click()'s own actionability re-scroll, which would
  // be mistaken for the tile moving in the "stays under the finger" checks below.
  const tapEl = async (page, locator) => {
    if (!(await locator.count().catch(() => 0))) return false;
    await locator.scrollIntoViewIfNeeded().catch(() => {});
    const box = await locator.boundingBox({ timeout: 2000 }).catch(() => null);
    if (!box) return false;
    await page.mouse.click(box.x + box.width * 0.2, box.y + box.height / 2);
    return true;
  };

  const openRtBody = async (page, stateJson, theme, pinnedMs = RT_PINNED_NOW.getTime()) => {
    await page.addInitScript(([json, t]) => { localStorage.setItem('marc.state.v1', json); localStorage.setItem('marc.theme', t); }, [stateJson, theme]);
    // Installed before navigation: the clock then ticks normally from this instant (Playwright's
    // clock.install does not pause it), so every timer/CSS transition behaves exactly as with the
    // real clock — only "now" itself is fixed, removing the time-of-day flakiness (QA7-6).
    await page.clock.install({ time: pinnedMs });
    await page.goto(`http://localhost:${PORT}/`);
    await page.waitForSelector('.nav');
    await page.waitForTimeout(250);
    if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(150); }
    await page.locator('nav.nav button', { hasText: 'Body' }).click();
    await page.waitForTimeout(350);
    // Bring the "Ready times" card to the top of the viewport: the muscle map above it is tall,
    // and a detail strip opening right at the bottom of a short page can otherwise grow under
    // the fixed bottom nav (.esc-dock/.nav sit above page content there, per z-dock/z-nav).
    await page.evaluate(() => document.querySelector('[data-palace="body.recovering"]')?.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(150);
  };

  for (const width of [360, 390]) {
    for (const theme of ['paper', 'silent-black']) {
      const tag = `ready-times ${theme} ${width}`;
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
      page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
      await openRtBody(page, rtStateJson(rtMainSessions), theme);

      // The groups and counts equal the helper's output: every rendered tile belongs to exactly
      // one group, and the group header's own count matches how many tiles it actually contains.
      const dump = await page.evaluate(() => {
        const groups = [...document.querySelectorAll('.rt-group-head')].map(h => ({ label: h.children[0]?.textContent ?? '', count: h.children[1]?.textContent ?? '' }));
        return { groups, tiles: document.querySelectorAll('button.rt-tile').length };
      });
      if (!dump.groups.some(g => g.label === 'Ready now')) errors.push(`${tag}: expected a "Ready now" row`);
      const total = dump.groups.reduce((a, g) => a + (Number(g.count) || 0), 0);
      if (dump.tiles !== total) errors.push(`${tag}: ${dump.tiles} tiles rendered but group counts sum to ${total} (${JSON.stringify(dump.groups)})`);
      const dayLabels = await page.evaluate(() => {
        const fmt = (d) => d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
        const now = new Date();
        const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
        return { today: fmt(now), tomorrow: fmt(tomorrow) };
      });
      const todayGroup = dump.groups.find(g => g.label.startsWith('Today'));
      if (todayGroup && !todayGroup.label.includes(dayLabels.today)) errors.push(`${tag}: "Today" header "${todayGroup.label}" does not include today's date ${dayLabels.today}`);
      const tomorrowGroup = dump.groups.find(g => g.label.startsWith('Tomorrow'));
      if (tomorrowGroup && !tomorrowGroup.label.includes(dayLabels.tomorrow)) errors.push(`${tag}: "Tomorrow" header "${tomorrowGroup.label}" does not include tomorrow's date ${dayLabels.tomorrow}`);

      await settle(page);
      await page.screenshot({ path: `${OUT}/${theme}-ready-times-${width}.png` });

      // No text is clipped and there is no horizontal scroll.
      const clipped = await page.evaluate(() => [...document.querySelectorAll('.rt-tile-name, .rt-tile-time')]
        .filter(n => !n.classList.contains('rt-probe-name') && !n.classList.contains('rt-probe-time'))
        .filter(n => n.scrollWidth > n.clientWidth + 1).map(n => n.textContent));
      if (clipped.length) errors.push(`${tag}: clipped ready-times text: ${clipped.join(', ')}`);
      if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) errors.push(`${tag}: horizontal scroll on the Body tab`);

      const firstTile = page.locator('button.rt-tile').first();
      if (await firstTile.count()) {
        // A tap opens the strip under the tapped line, and the tile moves at most 2px. Taps use
        // real mouse coordinates (tapEl), not locator.click()'s own actionability scroll, so the
        // only scroll that can happen is ours.
        await firstTile.scrollIntoViewIfNeeded();
        const beforeTop = await firstTile.evaluate(el => el.getBoundingClientRect().top);
        await tapEl(page, firstTile);
        await page.waitForTimeout(300);
        const afterTop = await firstTile.evaluate(el => el.getBoundingClientRect().top);
        if (Math.abs(afterTop - beforeTop) > 2) errors.push(`${tag}: tapped tile moved ${Math.abs(afterTop - beforeTop).toFixed(1)}px opening the strip (want <= 2px)`);
        const detail = page.locator('.rt-detail-wrap.open .rt-detail');
        if (!(await visible(detail))) errors.push(`${tag}: expected an open detail strip after tapping a tile`);
        // QA7-1: the wrap must actually grow to 1fr, not stay a clipped sliver — check real
        // geometry, not just visible() (which passed even at a 28px sliver with rows 2/3 clipped).
        const geo = await page.evaluate(() => {
          const wrap = document.querySelector('.rt-detail-wrap.open');
          const row3 = wrap?.querySelector('.rt-detail-row3');
          const chevron = wrap?.querySelector('.rt-detail-chevron');
          const heads = [...document.querySelectorAll('.rt-group-head')];
          const wrapRect = wrap?.getBoundingClientRect();
          const nextHead = heads.find(h => h.getBoundingClientRect().top >= (wrapRect?.bottom ?? Infinity) - 1) ?? heads[heads.length - 1];
          return {
            wrapHeight: wrapRect?.height ?? 0,
            row3Bottom: row3?.getBoundingClientRect().bottom ?? null,
            chevronBottom: chevron?.getBoundingClientRect().bottom ?? null,
            wrapBottom: wrapRect?.bottom ?? null,
            nextHeadTop: nextHead?.getBoundingClientRect().top ?? null,
            detailBottom: wrap?.querySelector('.rt-detail')?.getBoundingClientRect().bottom ?? null,
          };
        });
        if (geo.wrapHeight < 80) errors.push(`${tag}: detail wrap is only ${geo.wrapHeight.toFixed(1)}px tall (want >= 80px, QA7-1)`);
        if (geo.row3Bottom != null && geo.wrapBottom != null && geo.row3Bottom > geo.wrapBottom + 1) errors.push(`${tag}: row3 bottom (${geo.row3Bottom}) is below the wrap bottom (${geo.wrapBottom}), clipped (QA7-1)`);
        if (geo.chevronBottom != null && geo.wrapBottom != null && geo.chevronBottom > geo.wrapBottom + 1) errors.push(`${tag}: chevron bottom (${geo.chevronBottom}) is below the wrap bottom (${geo.wrapBottom}), clipped (QA7-1)`);
        if (geo.nextHeadTop != null && geo.detailBottom != null && geo.nextHeadTop < geo.detailBottom - 1) errors.push(`${tag}: the next group header (top ${geo.nextHeadTop}) overlaps the open strip (bottom ${geo.detailBottom}, QA7-1)`);

        // Tapping the strip opens the muscle panel.
        await tapEl(page, detail);
        await page.waitForTimeout(300);
        if (!(await visible(page.locator('dialog.sheet[open]')))) errors.push(`${tag}: tapping the detail strip did not open the muscle panel`);
        await page.locator('dialog.sheet[open]').last().getByRole('button', { name: 'Close' }).click().catch(() => {});
        await page.waitForTimeout(200);

        // Tapping the same tile twice closes it.
        if ((await firstTile.getAttribute('aria-expanded')) !== 'true') errors.push(`${tag}: expected aria-expanded=true on the still-open tapped tile`);
        await tapEl(page, firstTile);
        await page.waitForTimeout(300);
        if ((await firstTile.getAttribute('aria-expanded')) !== 'false') errors.push(`${tag}: tapping the same tile twice should close it (aria-expanded=false)`);
        if (await visible(page.locator('.rt-detail-wrap.open .rt-detail'))) errors.push(`${tag}: a detail strip is still open after closing the only open tile`);

        // Switching tiles across groups keeps the newly tapped tile under the finger.
        const otherTile = page.locator('button.rt-tile').nth(Math.min(3, (await page.locator('button.rt-tile').count()) - 1));
        await otherTile.scrollIntoViewIfNeeded();
        const before2 = await otherTile.evaluate(el => el.getBoundingClientRect().top);
        await tapEl(page, otherTile);
        await page.waitForTimeout(300);
        const after2 = await otherTile.evaluate(el => el.getBoundingClientRect().top);
        if (Math.abs(after2 - before2) > 2) errors.push(`${tag}: switching tiles moved the newly tapped tile ${Math.abs(after2 - before2).toFixed(1)}px (want <= 2px)`);

        // A theme switch while a strip is open does not throw and the strip keeps showing.
        await page.evaluate(() => { document.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') === 'paper' ? 'silent-black' : 'paper'); });
        await page.waitForTimeout(200);
        if (!(await visible(page.locator('.rt-detail-wrap.open .rt-detail')))) errors.push(`${tag}: the open strip disappeared across a theme switch`);
      }

      // Odd counts in a group render its last tile spanning both columns (rt-tile-full).
      if (!(await page.locator('.rt-tile-full').count())) errors.push(`${tag}: expected at least one odd-count full-span tile with this seed`);

      await ctx.close();
    }
  }

  // QA7-2/QA7-6: a long, common muscle name ("Front shoulders") — and, at some times of day, a
  // long time string ("10 pm – midnight") — must not force the whole card to one column at
  // 360px, the tightest column width. Swept across pinned times of day (QA7-6): a tile's ready
  // time depends on the clock, so this must hold at every hour, not just whenever CI happens to
  // run — a fixed `hoursAgo` combined with a shifting "now" naturally sweeps the resulting ready
  // time through many hour-of-day labels. hoursAgo=44 was chosen (scripts/_tmp-qa76-calc.ts, not
  // kept) because it makes the 17:00 point land on the exact bug case: earliest rounds to a
  // two-digit hour and latest ceils to midnight, giving the maximal 16-char "10 pm – midnight".
  // .rt-tile has no vertical padding (styles.css), so its height is exactly the stacked content:
  // name (max 36px, 2 lines) + time (max 32px, 2 lines) = 68px when both wrap, 52px (matching
  // .rt-tile's min-height) when both sit on one line.
  const RT_QA76_MAX_TILE_HEIGHT = 68;
  const RT_QA76_ONE_LINE_HEIGHT = 52;
  const rtQa76Texts = [];
  for (const [h, m] of [[6, 0], [11, 30], [17, 0], [21, 45], [23, 30]]) {
    const pinned = new Date(); pinned.setHours(h, m, 0, 0);
    const pinnedMs = pinned.getTime();
    const tag = `ready-times QA7-6 (Front shoulders @ ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')})`;
    const ctx = await browser.newContext({ viewport: { width: 360, height: 900 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
    await openRtBody(page, rtStateJson([rtSess(44, 'e1', 'Barbell Overhead Press', 30, 'ideal', 3, pinnedMs)]), 'silent-black', pinnedMs);
    const tileWithName = page.locator('button.rt-tile', { hasText: 'Front shoulders' }).first();
    if (!(await tileWithName.count())) {
      errors.push(`${tag}: expected a "Front shoulders" tile with this seed`);
    } else {
      const lineHasOneCol = await tileWithName.evaluate(el => !!el.closest('.rt-line.one-col'));
      if (lineHasOneCol) errors.push(`${tag}: "Front shoulders" forced the card to one column at 360px`);
      const cols = await tileWithName.evaluate(el => getComputedStyle(el.closest('.rt-line')).gridTemplateColumns.trim().split(' ').length);
      if (cols !== 2) errors.push(`${tag}: expected 2 columns, got ${cols}`);
      const nameEl = tileWithName.locator('.rt-tile-name');
      const nameBox = await nameEl.evaluate(el => ({ scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, height: el.getBoundingClientRect().height }));
      if (nameBox.scrollWidth > nameBox.clientWidth + 0.5) errors.push(`${tag}: "Front shoulders" is clipped horizontally (scrollWidth ${nameBox.scrollWidth} > clientWidth ${nameBox.clientWidth})`);
      if (nameBox.height > 36.5) errors.push(`${tag}: "Front shoulders" name box is ${nameBox.height.toFixed(1)}px tall (want <= 36px)`);
      const timeEl = tileWithName.locator('.rt-tile-time');
      const timeBox = await timeEl.evaluate(el => ({ scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, text: el.textContent }));
      if (timeBox.scrollWidth > timeBox.clientWidth + 0.5) errors.push(`${tag}: time "${timeBox.text}" is clipped horizontally (scrollWidth ${timeBox.scrollWidth} > clientWidth ${timeBox.clientWidth})`);
      // QA7-6: max-height:32px + overflow:hidden hides a 3rd line rather than clipping it visibly,
      // so a width-only check would miss it silently. Guard the vertical crop too.
      if (timeBox.scrollHeight > timeBox.clientHeight + 1) errors.push(`${tag}: time "${timeBox.text}" is clipped vertically (scrollHeight ${timeBox.scrollHeight} > clientHeight ${timeBox.clientHeight})`);
      if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) errors.push(`${tag}: horizontal scroll on the Body tab`);
      rtQa76Texts.push(timeBox.text ?? '');

      // QA7-6: never drop the tile-height assertion — replace it with the exact bound the CSS
      // gives (name max 36px + time max 32px, no vertical padding on .rt-tile).
      const tileHeight = await tileWithName.evaluate(el => el.getBoundingClientRect().height);
      if (tileHeight < RT_QA76_ONE_LINE_HEIGHT - 1 || tileHeight > RT_QA76_MAX_TILE_HEIGHT + 1) {
        errors.push(`${tag}: tile height is ${tileHeight.toFixed(1)}px (want between ${RT_QA76_ONE_LINE_HEIGHT - 1} and ${RT_QA76_MAX_TILE_HEIGHT + 1})`);
      }
      const nameFitsOneLine = nameBox.height <= 18.5;
      const timeFitsOneLine = timeBox.clientHeight <= 16.5;
      if (nameFitsOneLine && timeFitsOneLine && Math.abs(tileHeight - RT_QA76_ONE_LINE_HEIGHT) > 1) {
        errors.push(`${tag}: name and time both fit one line but tile height is ${tileHeight.toFixed(1)}px (want ${RT_QA76_ONE_LINE_HEIGHT} +-1)`);
      }

      // Every tile sharing this row (2-column grid) must render at the same height, or the row
      // looks broken even when neither individual tile is clipped.
      const rowHeights = await tileWithName.evaluate(el => Array.from(el.closest('.rt-line').querySelectorAll('.rt-tile')).map(t => t.getBoundingClientRect().height));
      const maxRowHeight = Math.max(...rowHeights);
      const minRowHeight = Math.min(...rowHeights);
      if (maxRowHeight - minRowHeight > 1) errors.push(`${tag}: tiles in the same row have mismatched heights (${rowHeights.map(h2 => h2.toFixed(1)).join(', ')})`);
    }
    await ctx.close();
  }
  // QA7-6: prove the sweep actually reaches the reported bug case, not just 5 arbitrary points —
  // at least one pinned time must produce the maximal 16-char "<hour> <am|pm> - midnight" string.
  if (!rtQa76Texts.some(t => t.length === 16 && t.endsWith('midnight'))) {
    errors.push(`ready-times QA7-6: sweep never hit the 16-char "<hour> - midnight" case (saw: ${rtQa76Texts.map(t => `"${t}"`).join(', ')})`);
  }

  // QA7-4: the scroll-keep timer must not fire against a screen the user has since left. Tapping
  // a tile starts a ~230ms setTimeout that reads the tapped tile's DOM node back out of a ref map;
  // without clearing the old timer and deleting refs on unmount, a stale (detached) node's
  // getBoundingClientRect() reads as all-zero rather than null, so leaving the tab within that
  // window scrolls whatever screen is now showing.
  {
    const tag = 'ready-times QA7-4';
    const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
    await openRtBody(page, rtStateJson(rtMainSessions), 'silent-black');
    const tile = page.locator('button.rt-tile').first();
    await tapEl(page, tile);
    // Switch tabs well inside the durFor('base')+30 window, then wait past it, and compare the
    // NEW screen's own scroll position before/after (not Body's — a different page entirely).
    await page.waitForTimeout(60);
    await page.locator('nav.nav button', { hasText: 'Today' }).click();
    await page.waitForTimeout(50);
    // A non-zero baseline: the bug's stray delta is a large negative number (the Body tile's real
    // top minus a stale node's all-zero rect), which at scrollY 0 clamps to 0 either way and
    // hides the bug. Scrolling down first makes an unwanted reset to 0 visible.
    await page.evaluate(() => window.scrollTo(0, 300));
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    await page.waitForTimeout(400);
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    if (Math.abs(scrollYAfter - scrollYBefore) > 0.5) errors.push(`${tag}: leaving the Body tab mid-timer scrolled the new screen (${scrollYBefore} -> ${scrollYAfter})`);
    await ctx.close();
  }

  // A minute tick while a strip is open: the grouping/order freezes (no reshuffle, no crash),
  // even though `recovery` (app/selectors.ts) recomputes on every minuteNow rollover. Playwright's
  // virtual clock crosses the minute boundary deterministically, the same technique the
  // notes-wipe regression test below uses, without a real 60 s wait.
  {
    const tag = 'ready-times minute-tick';
    const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
    await page.addInitScript(([json, t]) => { localStorage.setItem('marc.state.v1', json); localStorage.setItem('marc.theme', t); }, [rtStateJson(rtMainSessions), 'silent-black']);
    // Installed before navigation so the app's own minute/1s clock (app/clock.ts) ticks against
    // the virtual clock and actually advances when fast-forwarded below.
    await page.clock.install({ time: Date.now() });
    await page.goto(`http://localhost:${PORT}/`);
    await page.waitForSelector('.nav');
    await page.waitForTimeout(250);
    if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(150); }
    await page.locator('nav.nav button', { hasText: 'Body' }).click();
    await page.waitForTimeout(350);
    await page.evaluate(() => document.querySelector('[data-palace="body.recovering"]')?.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(150);

    const layoutOf = () => page.evaluate(() => ({
      groups: [...document.querySelectorAll('.rt-group-head')].map(h => h.children[0]?.textContent),
      names: [...document.querySelectorAll('.rt-tile-name:not(.rt-probe-name)')].map(n => n.textContent),
    }));
    const firstTile = page.locator('button.rt-tile').first();
    await tapEl(page, firstTile);
    await page.waitForTimeout(300);
    if (!(await visible(page.locator('.rt-detail-wrap.open .rt-detail')))) errors.push(`${tag}: expected an open strip before the tick`);
    const before = await layoutOf();

    await page.clock.fastForward(65_000); // crosses a minute boundary
    await page.waitForTimeout(300);

    if (!(await visible(page.locator('.rt-detail-wrap.open .rt-detail')))) errors.push(`${tag}: the open strip closed across a minute tick`);
    const after = await layoutOf();
    if (JSON.stringify(after) !== JSON.stringify(before)) errors.push(`${tag}: the grouping/order changed across a minute tick while a strip was open (before ${JSON.stringify(before)}, after ${JSON.stringify(after)})`);
    await ctx.close();
  }

  // Edge cases: nothing logged, only sore muscles, a single trained muscle, everything ready or
  // fully recovered, 20+ muscles at once, 320 px (the one-column switch) and full motion
  // (no-preference) — each a quick smoke check.
  const edgeCases = [
    { tag: 'nothing-logged', sessions: [] },
    { tag: 'only-sore', sessions: [rtSess(96, 'e1', 'Barbell Curl', 20, 'easy', 1)], checkIns: [{ day: new Date().toISOString().slice(0, 10), soreness: { biceps: 5, brachialis: 5 } }] },
    { tag: 'single-muscle', sessions: [rtSess(5, 'e1', 'Barbell Curl', 20, 'ideal', 3)] },
    // Well past ready (easy, 1 set, 30h+ ago): nothing recovering, so no Today/Tomorrow/Later/Sore
    // group should render at all — only "Ready now" (or "Fully recovered", a different Section).
    { tag: 'everything-ready-or-full', sessions: [rtSess(36, 'e1', 'Standing Calf Raise', 40, 'easy', 1), rtSess(40, 'e2', 'Ab Wheel Rollout', 15, 'easy', 1)] },
    {
      tag: '20-plus-muscles',
      sessions: [
        ['Barbell Curl', 20], ['Leg Press', 150], ['Lat Pulldown', 55], ['Overhead Press', 30], ['Triceps Pushdown', 25],
        ['Seated Cable Row', 50], ['Hammer Curl', 12], ['Romanian Deadlift', 60], ['Standing Calf Raise', 40], ['Chest Press', 50],
        ['Cable Crunch', 20], ['Hip Thrust', 80], ['Cable Lateral Raise', 8], ['Face Pull', 15], ['Leg Curl', 40],
        ['Leg Extension', 45], ['Hip Abduction', 30], ['Hip Adduction', 30], ['Reverse Fly', 10], ['Wrist Curl', 8],
        ['Ab Wheel Rollout', 15], ['Farmer Carry', 30],
      ].map(([name, kg], i) => rtSess(1 + i * 3, `e${i}`, name, kg, i % 3 === 0 ? 'max' : i % 3 === 1 ? 'easy' : 'ideal', 3)),
    },
  ];
  for (const { tag, sessions, checkIns } of edgeCases) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`ready-times ${tag}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`ready-times ${tag} console: ${m.text()}`); });
    await openRtBody(page, rtStateJson(sessions, checkIns), 'silent-black');
    const readyNowRow = await page.evaluate(() => document.querySelector('[data-palace="body.ready"] .rt-group-head')?.textContent);
    if (!readyNowRow) errors.push(`ready-times ${tag}: expected the "Ready now" row (data-palace="body.ready") to render`);
    const tiles = page.locator('button.rt-tile');
    const n = await tiles.count();
    if (n > 0) { await tiles.first().click(); await page.waitForTimeout(250); await tiles.first().click(); await page.waitForTimeout(150); }
    if (tag === 'only-sore' && !(await page.evaluate(() => [...document.querySelectorAll('.rt-group-head')].some(h => h.textContent?.startsWith('Sore today'))))) {
      errors.push(`ready-times ${tag}: expected a "Sore today" group`);
    }
    if (tag === 'nothing-logged' && n !== 0) errors.push(`ready-times ${tag}: expected zero tiles`);
    if (tag === 'everything-ready-or-full') {
      const dayGroups = await page.evaluate(() => [...document.querySelectorAll('.rt-group-head')].map(h => h.children[0]?.textContent).filter(l => l !== 'Ready now'));
      if (dayGroups.length) errors.push(`ready-times ${tag}: expected no Today/Tomorrow/Later/Sore groups, got ${JSON.stringify(dayGroups)}`);
    }
    await ctx.close();
  }

  // 320px: the one-column switch, and no clipped text / no horizontal scroll there either.
  {
    const ctx = await browser.newContext({ viewport: { width: 320, height: 900 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`ready-times 320: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`ready-times 320 console: ${m.text()}`); });
    await openRtBody(page, rtStateJson(rtMainSessions), 'silent-black');
    const cols = await page.evaluate(() => { const l = document.querySelector('.rt-line'); return l ? getComputedStyle(l).gridTemplateColumns.trim().split(' ').length : 0; });
    if (cols !== 1) errors.push(`ready-times 320: expected the one-column layout, got ${cols} column(s)`);
    if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) errors.push('ready-times 320: horizontal scroll on the Body tab');

    // QA7-3: in one-column mode every tile's ring sits on the left, so the caret must too — even
    // for a tile that was originally the second (right) one of its pair. Find one dynamically (the
    // seed's exact grouping shifts slightly with the real clock), rather than assuming an index.
    const secondIndex = await page.evaluate(() => {
      const allTiles = [...document.querySelectorAll('button.rt-tile')];
      for (const line of document.querySelectorAll('.rt-line')) {
        const tiles = [...line.querySelectorAll('button.rt-tile')];
        if (tiles.length === 2) return allTiles.indexOf(tiles[1]);
      }
      return -1;
    });
    if (secondIndex < 0) {
      errors.push('ready-times 320 QA7-3: expected at least one 2-tile line to test the caret against');
    } else {
      const secondTile = page.locator('button.rt-tile').nth(secondIndex);
      await tapEl(page, secondTile);
      await page.waitForTimeout(300);
      const caretCheck = await page.evaluate((idx) => {
        const tile = [...document.querySelectorAll('button.rt-tile')][idx];
        const ring = tile?.querySelector('.rt-ring');
        const caret = document.querySelector('.rt-detail-wrap.open .rt-caret');
        if (!ring || !caret) return null;
        const r = ring.getBoundingClientRect();
        const c = caret.getBoundingClientRect();
        return { ringCenter: r.left + r.width / 2, caretCenter: c.left + c.width / 2 };
      }, secondIndex);
      if (!caretCheck) errors.push('ready-times 320 QA7-3: expected an open strip with a caret after tapping the second-in-pair tile');
      else if (Math.abs(caretCheck.caretCenter - caretCheck.ringCenter) > 8) errors.push(`ready-times 320 QA7-3: caret centre (${caretCheck.caretCenter.toFixed(1)}) is ${Math.abs(caretCheck.caretCenter - caretCheck.ringCenter).toFixed(1)}px from the ring centre (${caretCheck.ringCenter.toFixed(1)}), want <= 8px`);
    }

    await ctx.close();
  }

  // Full motion (no-preference): the grid-rows/opacity transition opens and settles without error.
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`ready-times motion: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`ready-times motion console: ${m.text()}`); });
    await openRtBody(page, rtStateJson(rtMainSessions), 'silent-black');
    const tile = page.locator('button.rt-tile').first();
    await tile.click();
    await settle(page);
    await page.waitForTimeout(300);
    if (!(await visible(page.locator('.rt-detail-wrap.open .rt-detail')))) errors.push('ready-times motion: expected the strip open under full motion');
    await ctx.close();
  }
}

// Hotfix regression: an exercise's "Note for today" and "Setup note" inputs are controlled by the
// live store value and only saved on the native 'change' event (blur/Enter). During a live
// session, `recovery` (app/selectors.ts) is a computed signal keyed on the ticking `minuteNow`
// signal; every wall-clock minute rollover recomputes it, which re-renders every open EntryCard —
// including one with its notes sheet open — and resets an unsaved, still-focused input back to the
// last-committed value. Playwright's virtual clock crosses that minute boundary deterministically,
// without a real 60 s wait and without any date-dependent locator.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'notes-wipe';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy)]);
  // Installed before navigation so the app's own 1 s ticker (acquireTicker, app/clock.ts) is
  // created against the virtual clock and actually advances when fast-forwarded below.
  await page.clock.install({ time: Date.now() });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {});
  await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);

  const card = page.locator('.card.exercise').first();
  const openMenu = () => card.getByRole('button', { name: 'Options', exact: true }).click();
  const closeMenu = () => page.locator('dialog.sheet[open]').last().getByRole('button', { name: 'Close' }).click();
  // 65 s of virtual time guarantees a minute rollover regardless of where the wall clock started.
  const crossAMinute = () => page.clock.fastForward(65_000);

  // "Note for today": typed but not yet blurred, must survive a minute rolling over mid-edit,
  // and must still be there after closing and reopening the sheet.
  await openMenu(); await page.waitForTimeout(200);
  const noteInput = page.getByLabel('Note for today');
  await noteInput.fill('Seat 5 test');
  await crossAMinute(); await page.waitForTimeout(200);
  if ((await noteInput.inputValue()) !== 'Seat 5 test') errors.push(`${tag}: "Note for today" was wiped when a minute rolled over mid-edit`);
  await closeMenu(); await page.waitForTimeout(200);
  await openMenu(); await page.waitForTimeout(200);
  if ((await page.getByLabel('Note for today').inputValue()) !== 'Seat 5 test') errors.push(`${tag}: "Note for today" did not survive closing and reopening the sheet`);

  // "Setup note (shown every time)": same two checks.
  const stickyInput = page.getByLabel('Setup note (shown every time)');
  await stickyInput.fill('Seat 5 setup test');
  await crossAMinute(); await page.waitForTimeout(200);
  if ((await stickyInput.inputValue()) !== 'Seat 5 setup test') errors.push(`${tag}: "Setup note" was wiped when a minute rolled over mid-edit`);
  await closeMenu(); await page.waitForTimeout(200);
  await openMenu(); await page.waitForTimeout(200);
  if ((await page.getByLabel('Setup note (shown every time)').inputValue()) !== 'Seat 5 setup test') errors.push(`${tag}: "Setup note" did not survive closing and reopening the sheet`);
  await closeMenu();
  await ctx.close();
}

// Hotfix regression #2 (masking / overwrite on Skip, Put back, Substitute, Remove): those buttons
// used to call setMenu(false) directly, bypassing the same flush the sheet's own Close/back path
// got. A typed-then-reverted edit leaves the local draft non-null (the browser's native 'change'
// only fires when the value differs from what it was at focus time, so reverting to the original
// text never fires it), so the stale draft masked whatever another tab or device had since saved.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'notes-wipe-mask';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {});
  await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);

  const card = page.locator('.card.exercise').first();
  await card.getByRole('button', { name: 'Options', exact: true }).click(); await page.waitForTimeout(200);
  const stickyInput = page.getByLabel('Setup note (shown every time)');
  await stickyInput.click();
  await page.keyboard.type('X');
  await page.keyboard.press('Backspace');
  if ((await stickyInput.inputValue()) !== '') errors.push(`${tag}: setup note draft is not back to its original (empty) text before the Skip tap`);
  await page.getByRole('button', { name: 'Skip today', exact: true }).click();
  await page.waitForTimeout(200);

  // Another tab/device saves a setup note for this exercise while ours held a stale reverted draft.
  const exerciseId = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).active.entries[0].exerciseId);
  await page.evaluate(exId => {
    const st = JSON.parse(localStorage.getItem('marc.state.v1'));
    st.exerciseNotes = { ...st.exerciseNotes, [exId]: 'From another tab' };
    const json = JSON.stringify(st);
    localStorage.setItem('marc.state.v1', json);
    // Same-document writes never raise 'storage'; dispatching it by hand stands in for the second tab.
    window.dispatchEvent(new StorageEvent('storage', { key: 'marc.state.v1', newValue: json, storageArea: localStorage }));
  }, exerciseId);
  await page.waitForTimeout(200);

  await card.getByRole('button', { name: 'Options', exact: true }).click(); await page.waitForTimeout(200);
  if ((await page.getByLabel('Setup note (shown every time)').inputValue()) !== 'From another tab') errors.push(`${tag}: a stale reverted draft masked another tab's saved setup note`);
  await page.locator('dialog.sheet[open]').last().getByRole('button', { name: 'Close' }).click();
  await ctx.close();
}

// Hotfix regression #3 (index staleness): "Note for today" saves by array index. Removing an entry
// without first blurring the note field (a real tap always blurs first and is unaffected — this
// reproduces the no-blur path, e.g. the Sheet's own unmount) used to let the pending draft, once
// flushed after the array had already shifted, land on whichever exercise now sat at that index.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'notes-wipe-index';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {});
  await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);

  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).active.entries.map(e => e.exerciseId));
  if (before.length < 2) errors.push(`${tag}: expected at least 2 exercises in this session to test index staleness`);

  const card = page.locator('.card.exercise').first();
  await card.getByRole('button', { name: 'Options', exact: true }).click(); await page.waitForTimeout(200);
  const noteInput = page.getByLabel('Note for today');
  await noteInput.click();
  await page.keyboard.type('Should not leak');
  if ((await noteInput.inputValue()) !== 'Should not leak') errors.push(`${tag}: note field did not take the typed text`);
  // element.click() (no prior pointer interaction) skips the browser's default click-blurs-the-
  // previously-focused-field step; a real tap does blur first and is unaffected by this bug.
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('dialog[open] button')].find(b => b.textContent.trim() === 'Remove from this session');
    btn?.click();
  });
  await page.waitForTimeout(300);

  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).active.entries.map(e => ({ id: e.exerciseId, note: e.note ?? null })));
  if (after.length !== before.length - 1) errors.push(`${tag}: expected the entry to actually be removed (before ${before.length}, after ${after.length})`);
  if (after.some(e => e.note === 'Should not leak')) errors.push(`${tag}: the note leaked onto another exercise after a no-blur Remove`);
  await ctx.close();
}

// QA10-3: F10's own acceptance checks (docs/UI-POLISH-PLAN.md F10) were never added, which is how
// QA10-1 and QA10-2 shipped. Undo round-trips (identity-based, not index-based) for every removal,
// plus the hold-to-confirm timing and its keyboard twin.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'f10-undo';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {});
  await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);

  const activeEntries = () => page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).active.entries);
  // store.ts debounces the localStorage write 250ms after each update() call, resetting on every
  // new call — so a read right after this needs a clean gap past that, not just past the click.
  const clickUndo = async () => { await page.locator('.toast').getByRole('button', { name: 'Undo' }).click(); await page.waitForTimeout(350); };

  // QA10-1: a note typed but not yet blurred still survives Remove -> Undo (closeMenu() commits
  // the draft to the store; the fix re-reads the entry by id afterwards instead of using the
  // stale render-time prop).
  const before1 = await activeEntries();
  const removedId = before1[0].id;
  await page.locator('.card.exercise').first().getByRole('button', { name: 'Options', exact: true }).click(); await page.waitForTimeout(200);
  const noteInput = page.getByLabel('Note for today');
  await noteInput.click();
  await page.keyboard.type('QA10-1 note');
  await page.evaluate(() => { const btn = [...document.querySelectorAll('dialog[open] button')].find(b => b.textContent.trim() === 'Remove from this session'); btn?.click(); });
  await page.waitForTimeout(250);
  await clickUndo();
  const after1 = await activeEntries();
  if (after1.length !== before1.length) errors.push(`${tag}: remove exercise + Undo left ${after1.length} entries, expected ${before1.length}`);
  const restored1 = after1.find(e => e.id === removedId);
  if (!restored1) errors.push(`${tag}: Undo did not restore the removed entry (same id)`);
  else if (restored1.note !== 'QA10-1 note') errors.push(`${tag}: QA10-1 regressed — the note typed just before Remove was dropped by Undo (got ${JSON.stringify(restored1.note)})`);

  // Remove last set -> Undo: same id, same position, rest of the entry untouched. Undo only
  // shows for a set that actually had something logged (hasEntry), so give the last set reps
  // first — a fresh set's blank draft would silently skip the toast and hang clickUndo().
  const beforeSets = await activeEntries();
  const firstEntry = beforeSets.find(e => e.id === removedId);
  if (!firstEntry || firstEntry.sets.length < 2) errors.push(`${tag}: expected the first entry to have >=2 sets to test 'Remove last set'`);
  else {
    const card = page.locator(`.card.exercise:has-text("${firstEntry.name}")`).first();
    await card.locator('[data-set-field="reps"]').last().click();
    await page.keyboard.type('5');
    await page.keyboard.press('Tab');
    // store.ts debounces the localStorage write 250ms after update(); activeEntries() reads
    // localStorage, so every read here needs to clear that window or it sees stale data.
    await page.waitForTimeout(300);
    const beforeRemove = (await activeEntries()).find(e => e.id === removedId).sets;
    await card.getByRole('button', { name: 'Remove last set' }).click(); await page.waitForTimeout(200);
    await clickUndo();
    const afterSets = (await activeEntries()).find(e => e.id === removedId).sets;
    if (JSON.stringify(afterSets) !== JSON.stringify(beforeRemove)) errors.push(`${tag}: 'Remove last set' + Undo did not restore the original sets (ids/order): before=${JSON.stringify(beforeRemove)} after=${JSON.stringify(afterSets)}`);
  }

  // Delete set 2 of 3 (set menu) -> Undo: original order restored.
  const entryForDelete = (await activeEntries()).find(e => e.id === removedId);
  const cardD = page.locator(`.card.exercise:has-text("${entryForDelete.name}")`).first();
  while ((await cardD.locator('.set-kind').count()) < 3) {
    await cardD.getByRole('button', { name: 'Add set' }).click(); await page.waitForTimeout(100);
  }
  await page.waitForTimeout(300); // clear store.ts's 250ms save debounce before reading state
  const beforeDelete = (await activeEntries()).find(e => e.id === removedId).sets;
  await cardD.locator('.set-kind').nth(1).click(); await page.waitForTimeout(200); // set 2's options
  await page.getByRole('button', { name: 'Delete set', exact: true }).click(); await page.waitForTimeout(200);
  await clickUndo();
  const afterDelete = (await activeEntries()).find(e => e.id === removedId).sets;
  if (JSON.stringify(afterDelete) !== JSON.stringify(beforeDelete)) errors.push(`${tag}: 'Delete set' 2 of 3 + Undo did not restore the original order`);

  await ctx.close();
}

// QA10-3 (continued): the split editor's Remove + Undo, and HoldButton's hold-timing / keyboard
// tap-twice twin, each on a fresh session so they don't interact with the flow above.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'f10-undo-2';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {});
  await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);

  // Split editor Remove -> Undo: same position and sets. The editor's own Sheet stays open after
  // Remove (by design — you're still editing), but a <dialog> in showModal() paints in the
  // browser's top layer, above any ordinary position:fixed element including .toast — so the
  // toast is there but genuinely unreachable until the sheet closes, same as for a real user.
  await page.locator('[data-palace="train.edit-split"]').first().click(); await page.waitForTimeout(250);
  const beforeSplit = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('marc.state.v1')); return s.splits[0].exercises; });
  if (beforeSplit.length < 2) errors.push(`${tag}: expected >=2 exercises in the first split to test the split editor's Remove`);
  else {
    await page.locator('dialog[open] .list-row').first().getByRole('button', { name: 'Remove' }).click(); await page.waitForTimeout(200);
    await page.locator('dialog[open] [aria-label="Close"]').last().click(); await page.waitForTimeout(200);
    await page.locator('.toast').getByRole('button', { name: 'Undo' }).click(); await page.waitForTimeout(350);
    const afterSplit = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('marc.state.v1')); return s.splits[0].exercises; });
    if (JSON.stringify(afterSplit) !== JSON.stringify(beforeSplit)) errors.push(`${tag}: split editor Remove + Undo did not restore position and sets`);
  }

  // Hold-to-discard: a short hold does nothing, a full hold discards.
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Finish', exact: true }).click(); await page.waitForTimeout(300);
  const holdBtn = page.getByRole('button', { name: 'Hold to discard, press and hold' });
  const box = await holdBtn.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down(); await page.waitForTimeout(300); await page.mouse.up();
  await page.waitForTimeout(150);
  if (!(await visible(holdBtn))) errors.push(`${tag}: a 300ms hold discarded the session (expected nothing to happen)`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down(); await page.waitForTimeout(850); await page.mouse.up();
  await page.waitForTimeout(200);
  const activeAfterHold = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).active);
  if (activeAfterHold !== null) errors.push(`${tag}: an 850ms hold did not discard the session`);

  // Keyboard twin: Enter arms "Tap again to confirm", a second Enter confirms.
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Finish', exact: true }).click(); await page.waitForTimeout(300);
  const holdBtn2 = page.getByRole('button', { name: 'Hold to discard, press and hold' });
  await holdBtn2.focus();
  await page.keyboard.press('Enter'); await page.waitForTimeout(100);
  if (!(await visible(page.getByRole('button', { name: 'Tap again to confirm' })))) errors.push(`${tag}: one keyboard Enter did not show 'Tap again to confirm'`);
  await page.keyboard.press('Enter'); await page.waitForTimeout(250);
  const activeAfterKeyboard = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).active);
  if (activeAfterKeyboard !== null) errors.push(`${tag}: a second keyboard Enter did not confirm the discard`);

  await ctx.close();
}

// QA10-7: no horizontal scroll at 320px on the screens most likely to carry a long nowrap child —
// the fix (.stack/.stack-sm grid-template-columns) touches every stack in the app, so this checks
// it didn't just move the overflow somewhere else. Body is checked with real training history
// loaded (the `legacy` fixture), so its Ready-times card (O3) renders real tiles, not an empty
// state, in both a dark and a light theme.
for (const theme of ['silent-black', 'paper']) {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = `qa10-7 320 ${theme}`;
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson, t]) => { localStorage.setItem('marc.theme', t); if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy), theme]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {});
  await page.waitForTimeout(250);

  const noScroll = async label => {
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    const client = await page.evaluate(() => document.documentElement.clientWidth);
    if (width > client + 1) errors.push(`${tag}: horizontal scroll on ${label} (scrollWidth ${width} > clientWidth ${client})`);
  };

  await noScroll('Today');

  await page.locator('nav.nav button', { hasText: 'Body' }).click(); await page.waitForTimeout(300);
  const rtTiles = await page.locator('button.rt-tile').count();
  if (rtTiles === 0) errors.push(`${tag}: expected the Ready-times card to render real tiles from the legacy fixture on Body`);
  await noScroll('Body (Ready-times seeded)');

  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(300);
  await noScroll('History');

  await page.locator('nav.nav button', { hasText: 'Today' }).click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Settings', exact: true }).click(); await page.waitForTimeout(300);
  await noScroll('Settings');
  await page.locator('dialog[open] [aria-label="Close"]').last().click().catch(() => {}); await page.waitForTimeout(200);

  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);
  await noScroll('Train (live)');

  await ctx.close();
}

await browser.close();
stopping = true;
server.kill();
if (errors.length) { console.error('Page errors:', errors); process.exit(1); }
console.log('Screenshot gate PASS: 5 themes, no page errors, legacy import verified, crash containment and backup round trip verified, rest clock off-screen and 360 px set grid verified, watch stub verified, plate sense verified, palace verified, escobar verified (Apply, Undo in window, Undo gone after 8 s), heart line verified, reorder verified, service worker offline reload and build-B chunk carry-over verified, R6 day off, setup note, warm-ups and CSV row verified, F12 share sheet on all three entry points, PNG export at 9:16 and 1:1, and its buttons on screen at 360 and 390 px with 0/24/48 px safe areas verified, motion smoke and determinism verified (F5), and O3 ready-times ring tiles (grouping, tap open/close/switch, muscle panel, one-column fallback, edge cases) verified.');
